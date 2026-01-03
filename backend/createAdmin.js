import bcrypt from "bcrypt";
import { pool } from "./db.js";

const run = async () => {
  const email = "admin@demo.com";
  const password = "Demo@123";
  const tenantSubdomain = "demo";

  const tenantRes = await pool.query(
    "SELECT id FROM tenants WHERE subdomain = $1",
    [tenantSubdomain]
  );

  if (tenantRes.rowCount === 0) {
    console.error("❌ Tenant not found");
    process.exit(1);
  }

  const tenantId = tenantRes.rows[0].id;
  const hash = await bcrypt.hash(password, 10);

  await pool.query(
    `
    UPDATE users
    SET password_hash = $1, is_active = true
    WHERE email = $2 AND tenant_id = $3
    `,
    [hash, email, tenantId]
  );

  console.log("✅ Demo admin password reset to Demo@123");
  process.exit(0);
};

run();
