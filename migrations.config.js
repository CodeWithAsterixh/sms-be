const path = require("path");
require("dotenv").config();

module.exports = {
  databaseUrl: process.env.DB_URL || process.env.DATABASE_URL,
  migrationsTable: "pgmigrations",
  dir: "migrations",
};
