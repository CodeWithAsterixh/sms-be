exports.up = pgm => {
  pgm.createTable("classes", {
    id: "id",
    name: { type: "varchar(50)", notNull: true },
    arm: { type: "varchar(10)", notNull: true },
    display_name: { type: "varchar(50)", notNull: true, unique: true },
    created_at: { type: "timestamp", default: pgm.func("current_timestamp") },
  }, { ifNotExists: true });
};

exports.down = pgm => {
  pgm.dropTable("classes", { ifExists: true });
};
