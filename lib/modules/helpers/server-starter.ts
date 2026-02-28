import { Application } from "express";
import pino from "pino";
import env from "../constants/env";
import pool from "./db-connector";

const logger = pino({
  level: env.NODE_ENV === "production" ? "info" : "debug",
});

export async function startServer(app: Application) {
  try {
    await pool.query("SELECT 1");

    logger.info("Database connected");

    app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT}`);
    });

  } catch (error) {
    logger.error("Database connection failed");
    
    process.exit(1);
  }
}

