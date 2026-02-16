import { ConductRecord, CreateConductRecordDTO, UpdateConductRecordDTO } from "./index";
import pool from "../../lib/modules/helpers/db-connector";

export async function createConductRecord(data: CreateConductRecordDTO): Promise<ConductRecord> {
  const result = await pool.query(
    `
    INSERT INTO student_conduct_records (student_id, title, description, severity, created_by)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [data.student_id, data.title, data.description, data.severity, data.created_by]
  );
  return result.rows[0];
}

export async function getStudentConductRecords(student_id: number): Promise<ConductRecord[]> {
  const result = await pool.query(
    `
    SELECT c.*, COALESCE(up.full_name, u.email) as creator_name
    FROM student_conduct_records c
    LEFT JOIN users u ON c.created_by = u.id
    LEFT JOIN user_profiles up ON u.id = up.user_id
    WHERE c.student_id = $1 AND c.deleted_at IS NULL
    ORDER BY c.created_at DESC
    `,
    [student_id]
  );
  return result.rows;
}

export async function updateConductRecord(id: number, data: UpdateConductRecordDTO): Promise<ConductRecord | null> {
  const fields = [];
  const values = [];
  let idx = 1;

  if (data.title) {
    fields.push(`title = $${idx++}`);
    values.push(data.title);
  }
  if (data.description) {
    fields.push(`description = $${idx++}`);
    values.push(data.description);
  }
  if (data.severity) {
    fields.push(`severity = $${idx++}`);
    values.push(data.severity);
  }

  if (fields.length === 0) return null;

  values.push(id);
  
  const result = await pool.query(
    `
    UPDATE student_conduct_records
    SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
    WHERE id = $${idx} AND deleted_at IS NULL
    RETURNING *
    `,
    values
  );

  return result.rows[0] || null;
}

export async function deleteConductRecord(id: number): Promise<void> {
  await pool.query(
    `
    UPDATE student_conduct_records
    SET deleted_at = CURRENT_TIMESTAMP
    WHERE id = $1
    `,
    [id]
  );
}
