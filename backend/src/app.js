const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const app = express();

/* =========================
   GLOBAL MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   HEALTH CHECK
========================= */
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

/* =========================
   DB TEST
========================= */
app.get("/db-test", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()");
    res.json({
      message: "Database connected successfully",
      time: result.rows[0].now,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database connection failed" });
  }
});

/* =========================
   INIT TABLES (TEMP – DEV ONLY)
========================= */
app.get("/init-tenants", async (req, res) => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS tenants (
        tenant_id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        subdomain VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    res.json({ message: "Tenants table created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Tenants table creation failed" });
  }
});

app.get("/init-users", async (req, res) => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        tenant_id INTEGER REFERENCES tenants(tenant_id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password_hash TEXT NOT NULL,
        role VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (tenant_id, email)
      )
    `);
    res.json({ message: "Users table created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Users table creation failed" });
  }
});

/* =========================
   ROUTES
========================= */
const tenantsRoutes = require("./routes/tenants");
app.use("/api/tenants", tenantsRoutes);

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

module.exports = app;
