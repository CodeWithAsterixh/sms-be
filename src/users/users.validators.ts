import { z } from "zod";

export const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password_hash: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "principal", "teacher", "gatekeeper"]),
});
