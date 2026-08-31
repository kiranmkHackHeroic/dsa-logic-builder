import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { authenticate } from "../middleware/auth.js";
import pool from "../db.js";

const router = Router();

function formatDateTime(val) {
  if (!val) return null;
  const d = new Date(val);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 19).replace("T", " ");
}

function parseProgressRow(row) {
  if (!row) return null;
  let steps = row.completed_steps;
  if (typeof steps === "string") {
    try {
      steps = JSON.parse(steps);
    } catch {
      steps = [];
    }
  }
  return {
    ...row,
    completed_steps: steps,
  };
}

// ── GET /api/progress ─────────────────────────────────────────────
router.get("/", authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM problem_progress WHERE user_id = ? ORDER BY updated_at DESC",
      [req.user.id]
    );
    return res.json(rows.map(parseProgressRow));
  } catch (err) {
    console.error("Get all progress error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ── GET /api/progress/:problemId ──────────────────────────────────
router.get("/:problemId", authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM problem_progress WHERE user_id = ? AND problem_id = ?",
      [req.user.id, req.params.problemId]
    );

    if (rows.length === 0) {
      return res.json(null);
    }

    return res.json(parseProgressRow(rows[0]));
  } catch (err) {
    console.error("Get progress error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ── PUT /api/progress/:problemId ──────────────────────────────────
// Upsert: insert if not exists, update if exists
router.put("/:problemId", authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const problemId = req.params.problemId;

    // Check existing
    const [existing] = await pool.query(
      "SELECT id FROM problem_progress WHERE user_id = ? AND problem_id = ?",
      [userId, problemId]
    );

    const updates = { ...req.body };

    // Format dates for MySQL
    if (updates.started_at !== undefined) {
      updates.started_at = formatDateTime(updates.started_at);
    }
    if (updates.completed_at !== undefined) {
      updates.completed_at = formatDateTime(updates.completed_at);
    }

    // Ensure completed_steps is stored as valid JSON string
    if (updates.completed_steps !== undefined) {
      if (Array.isArray(updates.completed_steps)) {
        updates.completed_steps = JSON.stringify(updates.completed_steps);
      } else if (!updates.completed_steps) {
        updates.completed_steps = JSON.stringify([]);
      }
    }

    if (existing.length > 0) {
      // Update
      const fields = [];
      const values = [];

      const allowedFields = [
        "current_step", "completed_steps", "status",
        "understanding_text", "thinking_text", "brute_force_text",
        "optimization_text", "final_approach_text", "code_solution",
        "logic_score", "time_spent_thinking", "time_spent_coding",
        "started_at", "completed_at",
      ];

      for (const field of allowedFields) {
        if (updates[field] !== undefined) {
          fields.push(`${field} = ?`);
          values.push(updates[field]);
        }
      }

      if (fields.length > 0) {
        values.push(existing[0].id);
        await pool.query(
          `UPDATE problem_progress SET ${fields.join(", ")} WHERE id = ?`,
          values
        );
      }

      const [rows] = await pool.query("SELECT * FROM problem_progress WHERE id = ?", [existing[0].id]);
      return res.json(parseProgressRow(rows[0]));
    } else {
      // Insert
      const id = uuidv4();
      const startedAt = formatDateTime(updates.started_at) || formatDateTime(new Date());

      await pool.query(
        `INSERT INTO problem_progress (id, user_id, problem_id, current_step, completed_steps, status,
          understanding_text, thinking_text, brute_force_text, optimization_text,
          final_approach_text, code_solution, logic_score,
          time_spent_thinking, time_spent_coding, started_at, completed_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id, userId, problemId,
          updates.current_step ?? 1,
          updates.completed_steps ?? JSON.stringify([]),
          updates.status ?? "not_started",
          updates.understanding_text ?? null,
          updates.thinking_text ?? null,
          updates.brute_force_text ?? null,
          updates.optimization_text ?? null,
          updates.final_approach_text ?? null,
          updates.code_solution ?? null,
          updates.logic_score ?? null,
          updates.time_spent_thinking ?? 0,
          updates.time_spent_coding ?? 0,
          startedAt,
          updates.completed_at ?? null,
        ]
      );

      const [rows] = await pool.query("SELECT * FROM problem_progress WHERE id = ?", [id]);
      return res.status(201).json(parseProgressRow(rows[0]));
    }
  } catch (err) {
    console.error("Upsert progress error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
