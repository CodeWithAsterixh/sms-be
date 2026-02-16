import { Attendance, CreateAttendanceDTO } from ".";
import pool from "../../lib/modules/helpers/db-connector";

export async function recordAttendance(
  data: CreateAttendanceDTO,
): Promise<Attendance> {
  // Prevent duplicate entries within 60 seconds
  const DUPLICATE_WINDOW_SECONDS = 60;
  
  const existing = await pool.query(
    `
    SELECT * FROM attendance 
    WHERE student_id = $1 
    AND type = $2 
    AND recorded_at > NOW() - INTERVAL '1 second' * $3
    ORDER BY recorded_at DESC
    LIMIT 1
    `,
    [data.student_id, data.type, DUPLICATE_WINDOW_SECONDS]
  );

  if (existing.rows.length > 0) {
    throw { statusCode: 409, message: `Duplicate ${data.type} record detected. Please wait a moment.` };
  }

  const result = await pool.query(
    `
    INSERT INTO attendance (student_id, type, recorded_by)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [data.student_id, data.type, data.recorded_by],
  );
  return result.rows[0];
}

export async function getAttendanceByStudent(
  student_id: number,
): Promise<Attendance[]> {
  const result = await pool.query(
    `
    SELECT a.*, COALESCE(up.full_name, u.email) as recorder_name
    FROM attendance a
    LEFT JOIN users u ON a.recorded_by = u.id
    LEFT JOIN user_profiles up ON u.id = up.user_id
    WHERE a.student_id=$1 
    ORDER BY a.recorded_at DESC
    `,
    [student_id],
  );
  return result.rows;
}

export async function deleteLatestAttendance(student_id: number, type?: 'IN' | 'OUT'): Promise<void> {
  // Delete the most recent attendance record for the student, optionally filtered by type
  let query = `
    DELETE FROM attendance
    WHERE id = (
      SELECT id FROM attendance 
      WHERE student_id = $1 
  `;
  const params: any[] = [student_id];

  if (type) {
    query += ` AND type = $2 `;
    params.push(type);
  }

  query += `
      ORDER BY recorded_at DESC 
      LIMIT 1
    )
  `;

  await pool.query(query, params);
}
