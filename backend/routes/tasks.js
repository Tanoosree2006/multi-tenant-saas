import express from "express";
import { pool } from "../db.js";
import { authenticate } from "../middleware/auth.js";
import { randomUUID } from "crypto";

const router = express.Router();

/* CREATE TASK */
router.post("/", authenticate, async (req, res) => {
  const { projectId, title, description } = req.body;

  if (!projectId || !title) {
    return res.status(400).json({ success: false });
  }

  try {
    await pool.query(
      `INSERT INTO tasks (id, project_id, title, description)
       VALUES ($1,$2,$3,$4)`,
      [randomUUID(), projectId, title, description || ""]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

/* LIST TASKS */
router.get("/", authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*
       FROM tasks t
       JOIN projects p ON t.project_id = p.id
       WHERE p.tenant_id = $1`,
      [req.user.tenantId]
    );

    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

export default router;
