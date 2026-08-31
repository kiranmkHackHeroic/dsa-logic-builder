import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import pool from "../db.js";

const router = Router();

// ── GET /api/roles ────────────────────────────────────────────────
router.get("/", authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT role FROM user_roles WHERE user_id = ?",
      [req.user.id]
    );
    const roles = rows.map((r) => r.role);
    return res.json({ roles });
  } catch (err) {
    console.error("Get roles error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
