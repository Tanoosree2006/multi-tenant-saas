const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.post("/", async (req, res) => {
  const { name, subdomain } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO tenants (name, subdomain) VALUES ($1, $2) RETURNING *",
      [name, subdomain]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
