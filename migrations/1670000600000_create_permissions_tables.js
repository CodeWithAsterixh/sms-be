exports.up = pgm => {
  pgm.createTable("permissions", {
    id: "id",
    slug: { type: "varchar(100)", notNull: true, unique: true },
    description: { type: "text" },
  });

  pgm.createTable("role_permissions", {
    role: { type: "varchar(50)", notNull: true },
    permission_id: { type: "integer", notNull: true, references: "permissions", onDelete: "CASCADE" },
  });

  pgm.addConstraint("role_permissions", "role_permissions_pk", {
    primaryKey: ["role", "permission_id"],
  });
};

exports.down = pgm => {
  pgm.dropTable("role_permissions");
  pgm.dropTable("permissions");
};
