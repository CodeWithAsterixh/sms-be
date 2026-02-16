import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../../lib/utils/jwt";
import pool from "../../lib/modules/helpers/db-connector";
import env from "../../lib/modules/constants/env";
import { TokenPayload } from "../../types/auth";
import { throwError } from "../../lib/middlewares/error-handler";

const refreshTokensStore = new Map<string, string>(); // In-memory store for refresh tokens

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: (env.NODE_ENV === "production" ? "none" : "lax") as "none" | "lax" | "strict",
};

// Login
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    const user = result.rows[0];
    if (!user) throwError(401, "Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) throwError(401, "Invalid credentials");

    // Fetch permissions
    const permissionsResult = await pool.query(
      `SELECT p.slug FROM permissions p JOIN role_permissions rp ON p.id = rp.permission_id WHERE rp.role = $1`,
      [user.role]
    );
    const permissions = permissionsResult.rows.map((r: any) => r.slug);

    const payload: TokenPayload = { id: user.id, email: user.email, role: user.role, permissions };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    refreshTokensStore.set(refreshToken, user.email);

    res.cookie("accessToken", accessToken, { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 }); // 15 mins
    res.cookie("refreshToken", refreshToken, { ...COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days

    return res.status(200).json({ success: true, data: { user: payload, accessToken } });
  } catch (err: any) {
    console.error(err);
    if (err.statusCode) throw err;
    throwError(500, err.message || "Login failed");
  }
}

// Refresh token
export async function refreshToken(req: Request, res: Response) {
  const token = req.cookies.refreshToken || req.body.token;
  if (!token || !refreshTokensStore.has(token))
    throwError(401, "Invalid refresh token");

  try {
    const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;

    // Fetch fresh permissions
    const permissionsResult = await pool.query(
      `SELECT p.slug FROM permissions p JOIN role_permissions rp ON p.id = rp.permission_id WHERE rp.role = $1`,
      [payload.role]
    );
    const permissions = permissionsResult.rows.map((r: any) => r.slug);

    const accessToken = generateAccessToken({ 
      id: payload.id, 
      email: payload.email, 
      role: payload.role,
      permissions
    });
    
    res.cookie("accessToken", accessToken, { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 });

    return res.status(200).json({ success: true, data: { accessToken } });
  } catch (err: any) {
    if (err.statusCode) throw err;
    throwError(401, "Refresh token invalid or expired");
  }
}

// Logout
export async function logout(req: Request, res: Response) {
  const token = req.cookies.refreshToken || req.body.token;
  if (token && refreshTokensStore.has(token)) {
    refreshTokensStore.delete(token);
  }
  
  res.clearCookie("accessToken", COOKIE_OPTIONS);
  res.clearCookie("refreshToken", COOKIE_OPTIONS);
  
  return res.status(200).json({ success: true, message: "Logged out successfully" });
}

// Get Me
export async function getMe(req: Request, res: Response) {
  const user = (req as any).user;
  if (!user) throwError(401, "Unauthorized");
  return res.status(200).json({ success: true, data: { user } });
}
