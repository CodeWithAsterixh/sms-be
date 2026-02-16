import { Pool } from "pg";
import env from "../constants/env";

const pool = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  ssl: env.SUPPORT_SSL?{
    rejectUnauthorized: false,
  }:false,
  
});

export default pool;
