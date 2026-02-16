import { z } from "zod";
import { validate } from "../../lib/middlewares/validate";

const financialSchema = z.object({
  student_id: z.number().int().positive(),
  academic_session: z.string().min(1),
  term: z.string().min(1),
  payment_status: z.enum(["paid", "unpaid", "partial"]),
  amount_paid: z.number().min(0),
  amount_due: z.number().min(0),
});

export const validateFinancialRecord = validate(financialSchema);
