// Environment configuration
import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: number;
  NODE_ENV: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;

  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;

  SUPPORT_SSL: boolean;

  FRONTEND_URL: string
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const env: EnvConfig = {
  PORT:
    process.env.PORT && Number.isFinite(+process.env.PORT)
      ? +process.env.PORT
      : 3000,

  NODE_ENV: process.env.NODE_ENV || "development",

  JWT_ACCESS_SECRET: requireEnv("JWT_ACCESS_SECRET"),
  JWT_REFRESH_SECRET: requireEnv("JWT_REFRESH_SECRET"),

  DB_HOST: requireEnv("DB_HOST"),
  DB_PORT: Number(requireEnv("DB_PORT")),
  DB_NAME: requireEnv("DB_NAME"),
  DB_USER: requireEnv("DB_USER"),
  DB_PASSWORD: requireEnv("DB_PASSWORD"),
  SUPPORT_SSL: process.env.SUPPORT_SSL === "true",

  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
};

export default env;
