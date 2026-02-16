import pool from "../../lib/modules/helpers/db-connector";
import { Class, CreateClassDTO } from ".";

export async function createClass(data: CreateClassDTO): Promise<Class> {
  const result = await pool.query(
    `INSERT INTO classes (name, arm, display_name)
     VALUES ($1, $2, $3) RETURNING *`,
    [data.name, data.arm, data.display_name]
  );
  return result.rows[0];
}

export async function getAllClasses(): Promise<Class[]> {
  const result = await pool.query("SELECT * FROM classes ORDER BY id ASC");
  return result.rows;
}
