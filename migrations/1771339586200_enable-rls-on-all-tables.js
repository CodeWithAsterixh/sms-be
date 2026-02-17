exports.up = (pgm) => {
  const tables = [
    "users",
    "user_profiles",
    "classes",
    "students",
    "attendance",
    "announcements",
    "permissions",
    "role_permissions",
    "student_class_history",
    "student_conduct_records",
    "student_financial_records",
  ];

  tables.forEach((table) => {
    pgm.sql(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`);
  });
};

exports.down = (pgm) => {
  const tables = [
    "users",
    "user_profiles",
    "classes",
    "students",
    "attendance",
    "announcements",
    "permissions",
    "role_permissions",
    "student_class_history",
    "student_conduct_records",
    "student_financial_records",
  ];

  tables.forEach((table) => {
    pgm.sql(`ALTER TABLE ${table} DISABLE ROW LEVEL SECURITY;`);
  });
};
