import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { pool } from "./db.js";
import { migrate } from "./migrate.js";
import { seed } from "./seed.js";

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL }));

await migrate();
await seed();

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch {
    res.status(500).json({ status: "fail" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (!user.rows.length) return res.status(401).json({ success: false });

  const match = await bcrypt.compare(password, user.rows[0].password_hash);
  if (!match) return res.status(401).json({ success: false });

  const token = jwt.sign(
    { userId: user.rows[0].id, role: user.rows[0].role },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  res.json({ success: true, token });
});

app.listen(5000, "0.0.0.0", () => {
  console.log("✅ Backend running on port 5000");
});

