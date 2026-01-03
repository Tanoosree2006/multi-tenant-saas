import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password, tenantSubdomain } = req.body;

  try {
    const tenantResult = await pool.query(
      "SELECT id FROM tenants WHERE subdomain = $1",
      [tenantSubdomain]
    );

    if (tenantResult.rowCount === 0) {
      return res.status(401).json({ success: false, message: "Tenant not found" });
    }

    const tenantId = tenantResult.rows[0].id;

    const userResult = await pool.query(
      `SELECT id, email, password_hash, full_name, role
       FROM users
       WHERE email = $1 AND tenant_id = $2`,
      [email, tenantId]
    );

    if (userResult.rowCount === 0) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const user = userResult.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        tenantId,
        role: user.role,
      },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          role: user.role,
          tenantId,
        },
        token,
        expiresIn: "24h",
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

export default router;
