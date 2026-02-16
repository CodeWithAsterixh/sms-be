export interface User {
  id: number;
  email: string;
  role: "admin" | "principal" | "teacher" | "gatekeeper";
  status: "active" | "disabled";
  created_at: string;
}

export interface CreateUserDTO {
  email: string;
  password_hash: string;
  role: "admin" | "principal" | "teacher" | "gatekeeper";
}
