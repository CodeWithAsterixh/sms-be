import pool from "../../lib/modules/helpers/db-connector";
import { Announcement, CreateAnnouncementDTO } from ".";

export async function createAnnouncement(data: CreateAnnouncementDTO): Promise<Announcement> {
  const result = await pool.query(
    `
    INSERT INTO announcements (student_id, message, created_by)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [data.student_id, data.message, data.created_by]
  );
  return result.rows[0];
}

export async function getAnnouncementsByStudent(student_id: number): Promise<Announcement[]> {
  const result = await pool.query(
    "SELECT * FROM announcements WHERE student_id=$1 ORDER BY created_at DESC",
    [student_id]
  );
  return result.rows;
}
