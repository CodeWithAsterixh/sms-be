exports.up = pgm => {
  pgm.createTable("users", {
    id: "id",
    email: { type: "varchar(150)", notNull: true, unique: true },
    password_hash: { type: "varchar(200)", notNull: true },
    role: { type: "varchar(50)", notNull: true }, // admin, gatekeeper, teacher, principal
    status: { type: "varchar(50)", notNull: true, default: "active" }, 
    created_at: { type: "timestamp", default: pgm.func("current_timestamp") },
  }, { ifNotExists: true });
};

exports.down = pgm => {
  pgm.dropTable("users", { ifExists: true });
};
