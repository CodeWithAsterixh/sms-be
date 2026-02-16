import { CreateFinancialRecordDTO, FinancialRecord, UpdateFinancialRecordDTO } from "./index";
import pool from "../../lib/modules/helpers/db-connector";

export async function createFinancialRecord(data: CreateFinancialRecordDTO): Promise<FinancialRecord> {
  const result = await pool.query(
    `
    INSERT INTO student_financial_records (student_id, academic_session, term, payment_status, amount_paid, amount_due, recorded_by)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
    `,
    [data.student_id, data.academic_session, data.term, data.payment_status, data.amount_paid, data.amount_due, data.recorded_by]
  );
  return result.rows[0];
}

export async function getStudentFinancialRecords(student_id: number): Promise<FinancialRecord[]> {
  const result = await pool.query(
    `
    SELECT f.*, COALESCE(up.full_name, u.email) as recorder_name
    FROM student_financial_records f
    LEFT JOIN users u ON f.recorded_by = u.id
    LEFT JOIN user_profiles up ON u.id = up.user_id
    WHERE f.student_id = $1
    ORDER BY f.recorded_at DESC
    `,
    [student_id]
  );
  return result.rows;
}

export async function updateFinancialRecord(id: number, data: UpdateFinancialRecordDTO): Promise<FinancialRecord | null> {
  const fields = [];
  const values = [];
  let idx = 1;

  if (data.payment_status) {
    fields.push(`payment_status = $${idx++}`);
    values.push(data.payment_status);
  }
  if (data.amount_paid !== undefined) {
    fields.push(`amount_paid = $${idx++}`);
    values.push(data.amount_paid);
  }
  if (data.amount_due !== undefined) {
    fields.push(`amount_due = $${idx++}`);
    values.push(data.amount_due);
  }

  if (fields.length === 0) return null;

  values.push(id);
  
  const result = await pool.query(
    `
    UPDATE student_financial_records
    SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
    WHERE id = $${idx}
    RETURNING *
    `,
    values
  );

  return result.rows[0] || null;
}
