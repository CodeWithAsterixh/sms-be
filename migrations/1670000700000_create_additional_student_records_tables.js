exports.up = pgm => {
  // Disciplinary Records
  pgm.createTable("disciplinary_records", {
    id: "id",
    student_id: { type: "int", notNull: true, references: "students(id)", onDelete: "CASCADE" },
    type: { type: "varchar(50)", notNull: true }, // e.g., 'query', 'suspension', 'expulsion'
    description: { type: "text", notNull: true },
    recorded_by: { type: "int", notNull: true, references: "users(id)" },
    recorded_at: { type: "timestamp", default: pgm.func("current_timestamp") },
  }, { ifNotExists: true });

  // Financial Records
  pgm.createTable("financial_records", {
    id: "id",
    student_id: { type: "int", notNull: true, references: "students(id)", onDelete: "CASCADE" },
    session: { type: "varchar(20)", notNull: true }, // e.g., '2024/2025'
    term: { type: "varchar(20)", notNull: true }, // e.g., 'First Term'
    status: { type: "varchar(20)", notNull: true }, // 'paid', 'unpaid', 'partial'
    amount: { type: "decimal(10, 2)", notNull: true, default: 0 },
    payment_date: { type: "timestamp" },
    recorded_by: { type: "int", references: "users(id)" }, // Can be null if auto-generated? No, usually by bursar.
    recorded_at: { type: "timestamp", default: pgm.func("current_timestamp") },
  }, { ifNotExists: true });

  // Student Class History
  pgm.createTable("student_class_history", {
    id: "id",
    student_id: { type: "int", notNull: true, references: "students(id)", onDelete: "CASCADE" },
    class_id: { type: "int", notNull: true, references: "classes(id)" },
    academic_session: { type: "varchar(20)", notNull: true },
    promoted_at: { type: "timestamp", default: pgm.func("current_timestamp") },
  }, { ifNotExists: true });
};

exports.down = pgm => {
  pgm.dropTable("student_class_history", { ifExists: true });
  pgm.dropTable("financial_records", { ifExists: true });
  pgm.dropTable("disciplinary_records", { ifExists: true });
};
