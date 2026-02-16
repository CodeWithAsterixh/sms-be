exports.up = pgm => {
  pgm.createTable("students", {
    id: "id",
    student_uid: { type: "varchar(20)", notNull: true, unique: true },
    first_name: { type: "varchar(100)", notNull: true },
    last_name: { type: "varchar(100)", notNull: true },
    class_id: { type: "int", notNull: true, references: "classes(id)" },
    photo_url: { type: "text" },
    status: { type: "varchar(50)", notNull: true, default: "active" },
    created_by: { type: "int", references: "users(id)" },
    updated_by: { type: "int", references: "users(id)" },
    created_at: { type: "timestamp", default: pgm.func("current_timestamp") },
    updated_at: { type: "timestamp" },
    deleted_at: { type: "timestamp" },
  }, { ifNotExists: true });
};

exports.down = pgm => {
  pgm.dropTable("students", { ifExists: true });
};
