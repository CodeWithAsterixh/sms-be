export interface Class {
  id: number;
  name: string;
  arm: string;
  display_name: string;
  created_at: string;
}

export interface CreateClassDTO {
  name: string;
  arm: string;
  display_name: string;
}
