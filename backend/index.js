import "dotenv/config";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load server/.env first, then fallback to root .env.local and root .env
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profiles.js";
import progressRoutes from "./routes/progress.js";
import streakRoutes from "./routes/streaks.js";
import roleRoutes from "./routes/roles.js";
import dryrunRoutes from "./routes/dryrun.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads", "avatars");
fs.mkdirSync(uploadsDir, { recursive: true });

// ── Security ─────────────────────────────────────────────────────
// Helmet sets various HTTP security headers (CSP, HSTS, X-Frame, etc.)
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// CORS — support comma-separated CORS_ORIGIN, localhost, and Vercel preview domains
const configuredOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

const allowedOrigins = [
  ...configuredOrigins,
  "http://localhost:8080",
  "http://localhost:5173"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      process.env.CORS_ORIGIN === "*" ||
      allowedOrigins.includes(origin) ||
      origin.startsWith("http://localhost:") ||
      origin.startsWith("http://127.0.0.1:")
    ) {
      return callback(null, true);
    }
    callback(new Error("Not allowed by CORS: " + origin));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Global rate limiter — 100 requests per minute per IP
app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
}));

// Auth-specific rate limiter — tighter (10 per minute)
const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many authentication attempts, please try again later." },
});

// Body parsing with size limit
app.use(express.json({ limit: "1mb" }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Routes ───────────────────────────────────────────────────────
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/streaks", streakRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/ai", dryrunRoutes);

// Root endpoint
app.get("/", (_req, res) => {
  res.json({
    message: "DSA Logic Builder API Server is running!",
    frontend: "http://localhost:8080",
    health: "http://localhost:3001/api/health",
  });
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 catch-all
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ── Start ────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
});
