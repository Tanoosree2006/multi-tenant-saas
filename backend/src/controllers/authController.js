const bcrypt = require("bcrypt");
const db = require("../config/db");

exports.register = async (req, res) => {
  try {
    console.log("REGISTER BODY:", req.body); // 🔥 DEBUG

    const { tenant_id, name, email, password } = req.body;

    if (!tenant_id || !name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO users (tenant_id, name, email, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING user_id, tenant_id, name, email, role, created_at`,
      [tenant_id, name, email, hashedPassword, "ADMIN"]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error("REGISTER ERROR 👉", err); // 🔥 IMPORTANT
    res.status(500).json({ error: "User registration failed" });
  }
};
