import express from "express";
import cors from "cors";
import fs from "fs";
import { pool } from "./db.js";
import { migrate } from "./migrate.js";

import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";
import taskRoutes from "./routes/tasks.js";
import tenantRoutes from "./routes/tenants.js";
import userRoutes from "./routes/users.js";
import dashboardRoutes from "./routes/dashboard.js";

const app = express();
app.use(express.json());
app.use(cors());

// Run migrations
await migrate();

// ✅ Seed ONLY if tenants table is empty
const { rowCount } = await pool.query("SELECT 1 FROM tenants LIMIT 1");
if (rowCount === 0) {
  const seedSql = fs.readFileSync("./seeds/seed.sql", "utf8");
  await pool.query(seedSql);
  console.log("🌱 Seed data inserted");
}

app.use("/api/auth", authRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch {
    res.status(500).json({ status: "fail" });
  }
});

app.listen(5000, "0.0.0.0", () => {
  console.log("✅ Backend running on port 5000");
});
