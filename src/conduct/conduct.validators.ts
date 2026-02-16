import { z } from "zod";
import { validate } from "../../lib/middlewares/validate";

const conductSchema = z.object({
  student_id: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string().min(1),
  severity: z.enum(["low", "medium", "high"]),
});

export const validateConductRecord = validate(conductSchema);
