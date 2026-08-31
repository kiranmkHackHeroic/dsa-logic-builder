import "dotenv/config";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key-change-in-production";

/**
 * Express middleware that verifies a JWT from the Authorization header.
 * On success it attaches `req.user = { id, email }`.
 */
export function authenticate(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid authorization header" });
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired, please log in again" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
}

/**
 * Middleware to restrict access to users with a specific role (e.g. 'admin').
 */
export function requireRole(role, pool) {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }
    try {
      const [rows] = await pool.query(
        "SELECT role FROM user_roles WHERE user_id = ? AND role = ?",
        [req.user.id, role]
      );
      if (rows.length === 0) {
        return res.status(403).json({ error: `Access denied. Requires ${role} role.` });
      }
      next();
    } catch (err) {
      console.error("Role check error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
}

/**
 * Create a JWT for the given user.
 */
export function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}
