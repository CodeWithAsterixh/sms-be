import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";

import env from "../lib/modules/constants/env";
import { startServer } from "../lib/modules/helpers/server-starter";

// ---------------------- Middleware imports ----------------------
import { errorHandler } from "../lib/middlewares/error-handler";

// ---------------------- Route imports ------------------------
import studentRoutes from "../src/students/students.routes";
import userRoutes from "../src/users/users.routes";
import classRoutes from "../src/classes/classes.routes";
import attendanceRoutes from "../src/attendance/attendance.routes";
import announcementRoutes from "../src/announcements/announcements.routes";
import authRoutes from "../src/__auth/auth.routes";
import permissionRoutes from "../src/permissions/permissions.routes";
import conductRoutes from "../src/conduct/conduct.routes";
import financialRoutes from "../src/financial/financial.routes";
import cookieParser from "cookie-parser";
// -------------------------------------------------------------

// ---------------------- App initialization -------------------
const app: Application = express();

// ---------------------- Core middleware ----------------------
app.use(helmet());
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

// ---------------------- Auth Endpoints ----------------------
app.use("/auth", authRoutes);

// ---------------------- Register API routes -----------------
app.use("/students", studentRoutes);
app.use("/users", userRoutes);
app.use("/classes", classRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/announcements", announcementRoutes);
app.use("/permissions", permissionRoutes);
app.use("/conduct-records", conductRoutes);
app.use("/financial-records", financialRoutes);

// ---------------------- Error handling middleware ----------------

app.use(errorHandler);

// ---------------------- Health check ------------------------
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ---------------------- Start server ------------------------
startServer(app);
