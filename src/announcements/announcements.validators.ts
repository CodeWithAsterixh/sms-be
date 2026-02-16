import { z } from "zod";

export const createAnnouncementSchema = z.object({
  student_id: z.number().int().positive(),
  message: z.string().min(1, "Message cannot be empty"),
  created_by: z.number().int().positive(),
});
