import { Application } from "express";
import env from "../constants/env";
import pool from "./db-connector";


export async function startServer(app: Application) {
  try {
    await pool.query("SELECT 1");

    console.log("Database connected");

    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });

  } catch (error) {
    console.error("Database connection failed");
    
    process.exit(1);
  }
}

