import express from "express";
import { pool } from "../db.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

/* =========================
   GET CURRENT TENANT DETAILS
========================= */
router.get("/me", authenticate, async (req, res) => {
  const { tenantId } = req.user;

  try {
    const result = await pool.query(
      "SELECT id, name, subdomain, status FROM tenants WHERE id = $1",
      [tenantId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
