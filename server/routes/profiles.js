import { Router } from "express";
import multer from "multer";
import path from "path";
import { authenticate } from "../middleware/auth.js";
import pool from "../db.js";

const router = Router();

// Multer config for avatar uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/avatars"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user.id}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// ── GET /api/profiles/me ─────────────────────────────────────────
router.get("/me", authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, email, display_name, avatar_url, created_at, updated_at FROM users WHERE id = ?",
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Profile not found" });
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error("Get profile error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ── PUT /api/profiles/me ─────────────────────────────────────────
router.put("/me", authenticate, async (req, res) => {
  try {
    const { display_name, avatar_url } = req.body;
    const fields = [];
    const values = [];

    if (display_name !== undefined) {
      fields.push("display_name = ?");
      values.push(display_name);
    }
    if (avatar_url !== undefined) {
      fields.push("avatar_url = ?");
      values.push(avatar_url);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    values.push(req.user.id);
    await pool.query(`UPDATE users SET ${fields.join(", ")} WHERE id = ?`, values);

    const [rows] = await pool.query(
      "SELECT id, email, display_name, avatar_url, created_at, updated_at FROM users WHERE id = ?",
      [req.user.id]
    );

    return res.json(rows[0]);
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ── POST /api/profiles/me/avatar ─────────────────────────────────
router.post("/me/avatar", authenticate, upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    await pool.query("UPDATE users SET avatar_url = ? WHERE id = ?", [avatarUrl, req.user.id]);

    const [rows] = await pool.query(
      "SELECT id, email, display_name, avatar_url, created_at, updated_at FROM users WHERE id = ?",
      [req.user.id]
    );

    return res.json(rows[0]);
  } catch (err) {
    console.error("Avatar upload error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
