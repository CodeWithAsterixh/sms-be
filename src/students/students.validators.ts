import { z } from "zod";

export const createStudentSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  class_id: z.coerce.number().int().positive("Class ID must be a positive integer"),
});
