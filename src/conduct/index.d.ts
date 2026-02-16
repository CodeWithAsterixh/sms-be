export interface ConductRecord {
  id: number;
  student_id: number;
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  created_by: number;
  creator_name?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface CreateConductRecordDTO {
  student_id: number;
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  created_by: number;
}

export interface UpdateConductRecordDTO {
  title?: string;
  description?: string;
  severity?: "low" | "medium" | "high";
}
