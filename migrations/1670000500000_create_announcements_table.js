exports.up = pgm => {
  pgm.createTable("announcements", {
    id: "id",
    student_id: { type: "int", references: "students(id)" },
    message: { type: "text", notNull: true },
    created_by: { type: "int", references: "users(id)" },
    created_at: { type: "timestamp", default: pgm.func("current_timestamp") },
  }, { ifNotExists: true });
};

exports.down = pgm => {
  pgm.dropTable("announcements", { ifExists: true });
};
