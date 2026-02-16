exports.up = pgm => {
  pgm.createTable("attendance", {
    id: "id",
    student_id: { type: "int", notNull: true, references: "students(id)" },
    type: { type: "varchar(10)", notNull: true }, // IN or OUT
    recorded_by: { type: "int", notNull: true, references: "users(id)" },
    recorded_at: { type: "timestamp", default: pgm.func("current_timestamp") },
  }, { ifNotExists: true });
};

exports.down = pgm => {
  pgm.dropTable("attendance", { ifExists: true });
};
