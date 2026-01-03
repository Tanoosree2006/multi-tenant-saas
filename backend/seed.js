import { pool } from "./db.js";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";

export async function seed() {
  const password = await bcrypt.hash("Admin@123", 10);

  await pool.query(`
    INSERT INTO users (id, tenant_id, email, password_hash, role)
    VALUES ($1, NULL, $2, $3, 'super_admin')
    ON CONFLICT DO NOTHING
  `, [randomUUID(), "superadmin@system.com", password]);
}
