import fs from "fs";
import path from "path";
import { pool } from "./db.js";

export async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename TEXT PRIMARY KEY,
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const migrationsDir = "./migrations";
  const files = fs.readdirSync(migrationsDir).sort();

  for (const file of files) {
    const alreadyApplied = await pool.query(
      "SELECT 1 FROM schema_migrations WHERE filename = $1",
      [file]
    );

    if (alreadyApplied.rowCount > 0) {
      continue;
    }

    const sql = fs.readFileSync(path.join(migrationsDir, file)).toString();
    const upSql = sql.split("-- DOWN")[0];

    await pool.query(upSql);
    await pool.query(
      "INSERT INTO schema_migrations (filename) VALUES ($1)",
      [file]
    );
  }
}
