exports.up = (pgm) => {
  // Student Conduct Records
  pgm.createTable("student_conduct_records", {
    id: "id",
    student_id: { type: "int", notNull: true, references: "students(id)", onDelete: "CASCADE" },
    title: { type: "varchar(255)", notNull: true },
    description: { type: "text", notNull: true },
    severity: { type: "varchar(20)", notNull: true }, // low, medium, high
    created_by: { type: "int", notNull: true, references: "users(id)" },
    created_at: { type: "timestamp", default: pgm.func("current_timestamp") },
    updated_at: { type: "timestamp", default: pgm.func("current_timestamp") },
    deleted_at: { type: "timestamp" },
  });

  // Student Financial Records
  pgm.createTable("student_financial_records", {
    id: "id",
    student_id: { type: "int", notNull: true, references: "students(id)", onDelete: "CASCADE" },
    academic_session: { type: "varchar(20)", notNull: true }, // e.g. 2025/2026
    term: { type: "varchar(20)", notNull: true }, // first, second, third
    payment_status: { type: "varchar(20)", notNull: true }, // paid, unpaid, partial
    amount_paid: { type: "decimal(10, 2)", notNull: true, default: 0 },
    amount_due: { type: "decimal(10, 2)", notNull: true, default: 0 },
    recorded_by: { type: "int", notNull: true, references: "users(id)" },
    recorded_at: { type: "timestamp", default: pgm.func("current_timestamp") },
    updated_at: { type: "timestamp", default: pgm.func("current_timestamp") },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("student_financial_records");
  pgm.dropTable("student_conduct_records");
};
