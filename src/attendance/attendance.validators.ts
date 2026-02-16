import { z } from "zod";

export const recordAttendanceSchema = z.object({
  student_id: z.number().int().positive(),
  type: z.enum(["IN", "OUT"]),
  recorded_by: z.number().int().positive(),
});
