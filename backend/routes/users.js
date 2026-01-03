import express from "express";
import { pool } from "../db.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

/* =========================
   GET USERS FOR TENANT
========================= */
router.get("/", authenticate, async (req, res) => {
  try {
    const { tenantId } = req.user;

    const result = await pool.query(
      `
      SELECT 
        id,
        email,
        full_name AS "fullName",
        role,
        is_active AS "isActive"
      FROM users
      WHERE tenant_id = $1
      ORDER BY created_at DESC
      `,
      [tenantId]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.error("Users API error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
});

export default router;
