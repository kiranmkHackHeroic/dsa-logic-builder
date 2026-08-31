import { Router } from "express";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import pool from "../db.js";
import { authenticate, signToken } from "../middleware/auth.js";

const router = Router();

// ── POST /api/auth/signup ──────────────────────────────────────────
router.post("/signup", async (req, res) => {
  try {
    const { email, password, displayName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check for existing user
    const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const id = uuidv4();
    const passwordHash = await bcrypt.hash(password, 12);
    const name = displayName || email.split("@")[0];

    await pool.query(
      `INSERT INTO users (id, email, password_hash, display_name, last_sign_in_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [id, email, passwordHash, name]
    );

    const user = { id, email, display_name: name, created_at: new Date().toISOString(), last_sign_in_at: new Date().toISOString() };
    const token = signToken(user);

    return res.status(201).json({ user, token });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ── POST /api/auth/login ───────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const dbUser = rows[0];
    const valid = await bcrypt.compare(password, dbUser.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Update last_sign_in_at
    await pool.query("UPDATE users SET last_sign_in_at = NOW() WHERE id = ?", [dbUser.id]);

    const user = {
      id: dbUser.id,
      email: dbUser.email,
      display_name: dbUser.display_name,
      avatar_url: dbUser.avatar_url,
      created_at: dbUser.created_at,
      last_sign_in_at: new Date().toISOString(),
    };
    const token = signToken(user);

    return res.json({ user, token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ── GET /api/auth/me ───────────────────────────────────────────────
router.get("/me", authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, email, display_name, avatar_url, created_at, updated_at, last_sign_in_at FROM users WHERE id = ?",
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ user: rows[0] });
  } catch (err) {
    console.error("Get user error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ── GET /api/auth/verify ───────────────────────────────────────────
router.get("/verify", authenticate, (req, res) => {
  return res.json({ valid: true, user: req.user });
});

// ── PUT /api/auth/update-password ──────────────────────────────────
router.put("/update-password", authenticate, async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await pool.query("UPDATE users SET password_hash = ? WHERE id = ?", [passwordHash, req.user.id]);

    return res.json({ message: "Password updated" });
  } catch (err) {
    console.error("Update password error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ── POST /api/auth/reset-password ──────────────────────────────────
router.post("/reset-password", async (req, res) => {
  // Placeholder — in production, send an email with a reset link
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  // Always return success to avoid leaking user existence
  return res.json({ message: "If that email exists, a reset link has been sent." });
});

export default router;
