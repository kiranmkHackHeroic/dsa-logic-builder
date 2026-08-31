import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import pool from "../db.js";

const router = Router();

// ── GET /api/streaks ─────────────────────────────────────────────
router.get("/", authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM user_streaks WHERE user_id = ?",
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.json(null);
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error("Get streak error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ── PUT /api/streaks ─────────────────────────────────────────────
router.put("/", authenticate, async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.last_activity_date) {
      updates.last_activity_date = String(updates.last_activity_date).split("T")[0];
    }
    const fields = [];
    const values = [];

    const allowedFields = [
      "current_streak", "longest_streak", "last_activity_date",
      "total_problems_solved", "total_problems_attempted",
    ];

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(updates[field]);
      }
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    values.push(req.user.id);
    await pool.query(
      `UPDATE user_streaks SET ${fields.join(", ")} WHERE user_id = ?`,
      values
    );

    const [rows] = await pool.query("SELECT * FROM user_streaks WHERE user_id = ?", [req.user.id]);
    return res.json(rows[0]);
  } catch (err) {
    console.error("Update streak error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ── POST /api/streaks/record-activity ────────────────────────────
router.post("/record-activity", authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM user_streaks WHERE user_id = ?", [req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Streak record not found" });
    }

    const streak = rows[0];
    const today = new Date().toISOString().split("T")[0];
    const lastActivity = streak.last_activity_date;

    let newStreak = streak.current_streak;

    if (lastActivity) {
      const lastDate = new Date(lastActivity);
      const todayDate = new Date(today);
      const diffTime = todayDate.getTime() - lastDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        newStreak = streak.current_streak + 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }
      // Same day — keep current streak
    } else {
      newStreak = 1;
    }

    await pool.query(
      `UPDATE user_streaks
       SET current_streak = ?, longest_streak = ?, last_activity_date = ?
       WHERE user_id = ?`,
      [newStreak, Math.max(newStreak, streak.longest_streak), today, req.user.id]
    );

    const [updated] = await pool.query("SELECT * FROM user_streaks WHERE user_id = ?", [req.user.id]);
    return res.json(updated[0]);
  } catch (err) {
    console.error("Record activity error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ── POST /api/streaks/increment-solved ───────────────────────────
router.post("/increment-solved", authenticate, async (req, res) => {
  try {
    await pool.query(
      "UPDATE user_streaks SET total_problems_solved = total_problems_solved + 1 WHERE user_id = ?",
      [req.user.id]
    );
    const [rows] = await pool.query("SELECT * FROM user_streaks WHERE user_id = ?", [req.user.id]);
    return res.json(rows[0]);
  } catch (err) {
    console.error("Increment solved error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ── POST /api/streaks/increment-attempted ────────────────────────
router.post("/increment-attempted", authenticate, async (req, res) => {
  try {
    await pool.query(
      "UPDATE user_streaks SET total_problems_attempted = total_problems_attempted + 1 WHERE user_id = ?",
      [req.user.id]
    );
    const [rows] = await pool.query("SELECT * FROM user_streaks WHERE user_id = ?", [req.user.id]);
    return res.json(rows[0]);
  } catch (err) {
    console.error("Increment attempted error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
