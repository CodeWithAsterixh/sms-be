interface STUDENT {
    id: number;
    student_uid: string;
    first_name: string;
    last_name: string;
    class_id: number;
    photo_url?: string;
    status: "active" | "inactive" | "suspended";
    created_by: number;
    updated_by: number;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}



export interface CREATE_STUDENT_DTO {
  first_name: string;
  last_name: string;
  class_id: number;
}


