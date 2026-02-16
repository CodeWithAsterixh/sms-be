export interface Attendance {
  id: number;
  student_id: number;
  type: "IN" | "OUT";
  recorded_by: number;
  recorded_at: string;
}

export interface CreateAttendanceDTO {
  student_id: number;
  type: "IN" | "OUT";
  recorded_by: number;
}
