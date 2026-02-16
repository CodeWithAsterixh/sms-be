import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest, UserRole, TokenPayload } from "../../types/auth";
import env from "../modules/constants/env";

// Verify access token
export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  let token = req.cookies?.accessToken;
  
  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");
    if (parts.length === 2) {
      token = parts[1];
    }
  }

  if (!token) return res.status(401).json({ success: false, message: "No token provided" });

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Token invalid or expired" });
  }
}

// Role-based access
export function authorizeRoles(...roles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!roles.includes(req.user.role)) return res.status(403).json({ success: false, message: "Forbidden" });
    next();
  };
}

// Permission-based access
export function authorizePermissions(permission: string) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });
    
    // Admins always have access
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if user has the required permission
    if (!req.user.permissions?.includes(permission)) {
      return res.status(403).json({ success: false, message: "Forbidden: Insufficient permissions" });
    }

    next();
  };
}
