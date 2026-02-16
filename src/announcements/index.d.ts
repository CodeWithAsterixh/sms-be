export interface Announcement {
  id: number;
  student_id: number;
  message: string;
  created_by: number;
  created_at: string;
}

export interface CreateAnnouncementDTO {
  student_id: number;
  message: string;
  created_by: number;
}
