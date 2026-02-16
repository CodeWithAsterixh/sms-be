exports.up = (pgm) => {
  pgm.createTable(
    "user_profiles",
    {
      id: "id",
      user_id: {
        type: "int",
        notNull: true,
        references: "users(id)",
        unique: true,
      },
      full_name: { type: "varchar(200)", notNull: true },
      phone: { type: "varchar(50)" },
      created_at: { type: "timestamp", default: pgm.func("current_timestamp") },
    },
    { ifNotExists: true },
  );
};

exports.down = (pgm) => {
  pgm.dropTable("user_profiles", { ifExists: true });
};
