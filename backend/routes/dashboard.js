import express from "express";
import { pool } from "../db.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, async (req, res) => {
  const tenantId = req.user.tenantId;

  try {
    const projects = await pool.query(
      "SELECT COUNT(*) FROM projects WHERE tenant_id=$1",
      [tenantId]
    );

    const tasks = await pool.query(
      `SELECT COUNT(*) FROM tasks 
       WHERE project_id IN 
       (SELECT id FROM projects WHERE tenant_id=$1)`,
      [tenantId]
    );

    const users = await pool.query(
      "SELECT COUNT(*) FROM users WHERE tenant_id=$1",
      [tenantId]
    );

    res.json({
      success: true,
      data: {
        projects: Number(projects.rows[0].count),
        tasks: Number(tasks.rows[0].count),
        users: Number(users.rows[0].count),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

export default router;
