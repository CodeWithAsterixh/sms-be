import { v4 as uuidv4 } from "uuid";
import { CREATE_STUDENT_DTO, STUDENT } from ".";
import pool from "../../lib/modules/helpers/db-connector";

export async function createStudent(data: CREATE_STUDENT_DTO): Promise<STUDENT> {
  const student_uid = generateStudentUID();

  const result = await pool.query(
    `
    INSERT INTO students (student_uid, first_name, last_name, class_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [student_uid, data.first_name, data.last_name, data.class_id]
  );

  return result.rows[0];
}

export async function getAllStudents(
  page: number = 1,
  limit: number = 10,
  search?: string,
  classId?: number,
  status?: string
): Promise<{ students: any[]; total: number; totalPages: number }> {
  const offset = (page - 1) * limit;
  const params: any[] = [];
  let paramIndex = 1;

  // Base query with CTE to get today's latest attendance status
  let query = `
    WITH StudentStatus AS (
      SELECT 
        s.*,
        (
          SELECT type 
          FROM attendance a 
          WHERE a.student_id = s.id 
            AND a.recorded_at::date = CURRENT_DATE 
          ORDER BY a.recorded_at DESC 
          LIMIT 1
        ) as today_status,
        c.name as class_name
      FROM students s
      LEFT JOIN classes c ON s.class_id = c.id
      WHERE s.deleted_at IS NULL
    )
    SELECT * FROM StudentStatus
    WHERE 1=1
  `;

  // Dynamic filters
  if (search) {
    query += ` AND (first_name ILIKE $${paramIndex} OR last_name ILIKE $${paramIndex} OR student_uid ILIKE $${paramIndex})`;
    params.push(`%${search}%`);
    paramIndex++;
  }

  if (classId) {
    query += ` AND class_id = $${paramIndex}`;
    params.push(classId);
    paramIndex++;
  }

  if (status) {
    if (status === 'IN') {
      query += ` AND today_status = 'IN'`;
    } else if (status === 'OUT') {
      query += ` AND today_status = 'OUT'`;
    } else if (status === 'ABSENT') {
      query += ` AND today_status IS NULL`;
    }
  }

  // Count query
  const countQuery = `SELECT COUNT(*) FROM (${query}) as count_table`;
  const countResult = await pool.query(countQuery, params);
  const total = parseInt(countResult.rows[0].count);

  // Final data query
  query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(limit, offset);

  const result = await pool.query(query, params);

  return {
    students: result.rows,
    total,
    totalPages: Math.ceil(total / limit)
  };
}

export async function getStudentById(id: number | string): Promise<STUDENT | null> {
  const query = `
    SELECT s.*, c.name as class_name 
    FROM students s 
    LEFT JOIN classes c ON s.class_id = c.id 
    WHERE ${typeof id === 'string' ? 's.student_uid=$1' : 's.id=$1'}
  `;
  
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
}

export async function updateStudent(id: number | string, data: Partial<STUDENT>): Promise<STUDENT | null> {
  const fields = Object.keys(data).filter(key => key !== 'id' && key !== 'created_at' && key !== 'updated_at' && key !== 'class_name');
  if (fields.length === 0) return null;

  // Resolve ID if string
  let numericId: number;
  if (typeof id === 'string') {
    const s = await getStudentById(id);
    if (!s) return null;
    numericId = s.id;
  } else {
    numericId = id;
  }

  // Check if class is changing
  let classChanged = false;
  if (data.class_id) {
    const currentStudent = await getStudentById(numericId);
    if (currentStudent && currentStudent.class_id !== Number(data.class_id)) {
      classChanged = true;
    }
  }

  const setClause = fields.map((key, index) => `${key} = $${index + 2}`).join(', ');
  const values = fields.map(key => (data as any)[key]);

  const result = await pool.query(
    `UPDATE students SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
    [numericId, ...values]
  );
  
  const updatedStudent = result.rows[0];

  // If class was updated, record in history
  if (updatedStudent && classChanged) {
    try {
      await pool.query(
        `INSERT INTO student_class_history (student_id, class_id, academic_session) VALUES ($1, $2, $3)`,
        [numericId, data.class_id, '2024/2025']
      );
    } catch (error) {
      console.error('Failed to record class history:', error);
      // Don't fail the update if history recording fails
    }
  }
  
  return updatedStudent || null;
}

export async function getClassHistory(studentId: number) {
  const result = await pool.query(
    `SELECT h.*, c.name as class_name 
     FROM student_class_history h 
     JOIN classes c ON h.class_id = c.id
     WHERE h.student_id = $1 ORDER BY h.promoted_at DESC`,
    [studentId]
  );
  return result.rows;
}

// Helper: Generate UID like STU-2026-0001
function generateStudentUID(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000); // 4-digit random
  return `STU-${year}-${random}`;
}
