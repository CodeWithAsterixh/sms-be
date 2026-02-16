// Payload stored inside JWT tokens
export interface TokenPayload {
  id: number;
  email: string;
  role: UserRole;
  permissions: string[];
}

// Allowed user roles
export type UserRole = "admin" | "principal" | "teacher" | "gatekeeper";

// Request body for login
export interface LoginDTO {
  email: string;
  password: string;
}

// Request object extended with user info after authentication
import { Request } from "express";

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

// Response returned after successful login
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}
