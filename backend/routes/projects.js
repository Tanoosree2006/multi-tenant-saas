import express from "express";
import { pool } from "../db.js";
import { authenticate } from "../middleware/auth.js";
import { randomUUID } from "crypto";

const router = express.Router();

/* =========================
   CREATE PROJECT
   POST /api/projects
========================= */
router.post("/", authenticate, async (req, res) => {
  const { name, description } = req.body;
  const { tenantId, userId } = req.user;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Project name is required"
    });
  }

  try {
    const id = randomUUID();

    const result = await pool.query(
      `
      INSERT INTO projects (id, tenant_id, name, description, status, created_by)
      VALUES ($1, $2, $3, $4, 'active', $5)
      RETURNING id, name, description, status
      `,
      [id, tenantId, name, description || null, userId]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    console.error("CREATE PROJECT ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

/* =========================
   GET ALL PROJECTS
   GET /api/projects
========================= */
router.get("/", authenticate, async (req, res) => {
  const { tenantId } = req.user;

  try {
    const result = await pool.query(
      `
      SELECT id, name, description, status
      FROM projects
      WHERE tenant_id = $1
      ORDER BY created_at DESC
      `,
      [tenantId]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    console.error("GET PROJECTS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

/* =========================
   GET PROJECT BY ID
   GET /api/projects/:id
========================= */
router.get("/:id", authenticate, async (req, res) => {
  const { tenantId } = req.user;
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT id, name, description, status
      FROM projects
      WHERE id = $1 AND tenant_id = $2
      `,
      [id, tenantId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    console.error("GET PROJECT ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

/* =========================
   UPDATE PROJECT
   PUT /api/projects/:id
========================= */
router.put("/:id", authenticate, async (req, res) => {
  const { tenantId } = req.user;
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE projects
      SET name = $1,
          description = $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3 AND tenant_id = $4
      RETURNING id, name, description, status
      `,
      [name, description, id, tenantId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (err) {
    console.error("UPDATE PROJECT ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

/* =========================
   DELETE PROJECT
   DELETE /api/projects/:id
========================= */
router.delete("/:id", authenticate, async (req, res) => {
  const { tenantId } = req.user;
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      DELETE FROM projects
      WHERE id = $1 AND tenant_id = $2
      `,
      [id, tenantId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    res.json({
      success: true,
      message: "Project deleted successfully"
    });
  } catch (err) {
    console.error("DELETE PROJECT ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

export default router;


