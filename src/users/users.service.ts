import { CreateUserDTO, User } from ".";
import pool from "../../lib/modules/helpers/db-connector";

export async function createUser(data: CreateUserDTO): Promise<User> {
  const result = await pool.query(
    `
    INSERT INTO users (email, password_hash, role)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [data.email, data.password_hash, data.role]
  );
  return result.rows[0];
}

export async function getAllUsers(): Promise<User[]> {
  const result = await pool.query("SELECT * FROM users ORDER BY id ASC");
  return result.rows;
}

export async function getUserById(id: number): Promise<User | null> {
  const result = await pool.query("SELECT * FROM users WHERE id=$1", [id]);
  return result.rows[0] || null;
}
