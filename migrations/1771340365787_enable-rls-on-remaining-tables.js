exports.up = (pgm) => {
  const tables = [
    "disciplinary_records",
    "financial_records",
    "pgmigrations",
  ];

  tables.forEach((table) => {
    // Using IF EXISTS to avoid errors if the tables are missing (e.g. locally vs production)
    // and to handle the user's specific request for these tables.
    pgm.sql(`ALTER TABLE IF EXISTS ${table} ENABLE ROW LEVEL SECURITY;`);
  });
};

exports.down = (pgm) => {
  const tables = [
    "disciplinary_records",
    "financial_records",
    "pgmigrations",
  ];

  tables.forEach((table) => {
    pgm.sql(`ALTER TABLE IF EXISTS ${table} DISABLE ROW LEVEL SECURITY;`);
  });
};
