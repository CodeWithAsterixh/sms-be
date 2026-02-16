import { Router } from "express";
import { login, refreshToken, logout, getMe } from "./auth.controller";
import { authenticate } from "../../lib/middlewares/auth";
import { z } from "zod";
import { validate } from "../../lib/middlewares/validate";

const router = Router();

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });
const tokenSchema = z.object({ token: z.string().min(1).optional() });

router.post("/login", validate(loginSchema), login);
router.post("/refresh", validate(tokenSchema), refreshToken);
router.post("/logout", validate(tokenSchema), logout);
router.get("/me", authenticate, getMe);

export default router;
