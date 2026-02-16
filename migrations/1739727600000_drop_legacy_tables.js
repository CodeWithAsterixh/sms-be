exports.up = (pgm) => {
  pgm.dropTable("disciplinary_records", { ifExists: true });
  pgm.dropTable("financial_records", { ifExists: true });
};

exports.down = (pgm) => {
  // Re-create tables if rolled back (copied from original migration)
  pgm.createTable("disciplinary_records", {
    id: "id",
    student_id: { type: "int", notNull: true, references: "students(id)", onDelete: "CASCADE" },
    type: { type: "varchar(50)", notNull: true }, 
    description: { type: "text", notNull: true },
    recorded_by: { type: "int", notNull: true, references: "users(id)" },
    recorded_at: { type: "timestamp", default: pgm.func("current_timestamp") },
  });

  pgm.createTable("financial_records", {
    id: "id",
    student_id: { type: "int", notNull: true, references: "students(id)", onDelete: "CASCADE" },
    session: { type: "varchar(20)", notNull: true },
    term: { type: "varchar(20)", notNull: true },
    status: { type: "varchar(20)", notNull: true },
    amount: { type: "decimal(10, 2)", notNull: true, default: 0 },
    payment_date: { type: "timestamp" },
    recorded_by: { type: "int", references: "users(id)" },
    recorded_at: { type: "timestamp", default: pgm.func("current_timestamp") },
  });
};
