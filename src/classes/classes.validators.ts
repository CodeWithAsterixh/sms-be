import { z } from "zod";

export const createClassSchema = z.object({
  name: z.string().min(2, "Class name must be at least 2 characters"),
  arm: z.string().min(1, "Class arm is required"),
  display_name: z.string().min(2, "Display name must be at least 2 characters"),
});
