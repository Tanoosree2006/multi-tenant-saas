import { pool } from "./db.js";

export async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tenants (
      id UUID PRIMARY KEY,
      name TEXT,
      subdomain TEXT UNIQUE,
      subscription_plan TEXT
    );

    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY,
      tenant_id UUID,
      email TEXT,
      password_hash TEXT,
      role TEXT,
      UNIQUE(tenant_id, email)
    );
  `);
}
