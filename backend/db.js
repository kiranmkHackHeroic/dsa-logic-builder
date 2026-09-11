import "dotenv/config";
import mysql from "mysql2/promise";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const rawUri = process.env.DATABASE_URL || process.env.MYSQL_URL;
let cleanUri = rawUri;
if (rawUri) {
  try {
    const parsed = new URL(rawUri);
    parsed.searchParams.delete("ssl-mode");
    const targetDb = process.env.MYSQL_DATABASE || "dsa_logic_builder";
    if (parsed.pathname === "/defaultdb" || parsed.pathname === "/" || !parsed.pathname) {
      parsed.pathname = `/${targetDb}`;
    }
    cleanUri = parsed.toString();
  } catch {
    cleanUri = rawUri;
  }
}

const connectionConfig = cleanUri
  ? {
      uri: cleanUri,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      dateStrings: true,
      multipleStatements: true,
      ssl: process.env.MYSQL_SSL === "true" ? { rejectUnauthorized: false } : undefined,
    }
  : {
      host: process.env.MYSQL_HOST || "localhost",
      port: parseInt(process.env.MYSQL_PORT || "3306", 10),
      user: process.env.MYSQL_USER || "root",
      password: process.env.MYSQL_PASSWORD || "",
      database: process.env.MYSQL_DATABASE || "dsa_logic_builder",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      dateStrings: true,
      multipleStatements: true,
      ssl: process.env.MYSQL_SSL === "true" ? { rejectUnauthorized: false } : undefined,
    };

const pool = mysql.createPool(connectionConfig);

/**
 * Returns safe connection info (without credentials) for health checks.
 */
export function getDbInfo() {
  if (cleanUri) {
    try {
      const parsed = new URL(cleanUri);
      return {
        type: "uri",
        host: parsed.hostname || "unknown",
        port: parsed.port || "3306",
        database: parsed.pathname ? parsed.pathname.replace(/^\//, "") : "unknown",
      };
    } catch {
      return { type: "uri", host: "custom-uri", port: "3306", database: "custom" };
    }
  }
  return {
    type: "params",
    host: process.env.MYSQL_HOST || "localhost",
    port: process.env.MYSQL_PORT || "3306",
    database: process.env.MYSQL_DATABASE || "dsa_logic_builder",
  };
}

/**
 * Test database connectivity with a lightweight query.
 */
export async function checkDbConnection() {
  try {
    const [rows] = await pool.query("SELECT 1 as connected");
    return {
      connected: true,
      timestamp: new Date().toISOString(),
      info: getDbInfo(),
    };
  } catch (err) {
    return {
      connected: false,
      code: err.code || "DB_ERROR",
      message: err.message || "Failed to connect to MySQL database",
      info: getDbInfo(),
    };
  }
}

/**
 * Automatically ensures tables exist on startup if DB is reachable.
 */
export async function ensureSchema() {
  let conn;
  try {
    const [tables] = await pool.query("SHOW TABLES LIKE 'users'");
    if (Array.isArray(tables) && tables.length > 0) {
      console.log("ℹ️  Database tables already initialized.");
      return;
    }

    console.log("🚀 Initializing database schema from schema.sql...");
    const fs = await import("fs");
    const schemaPath = path.join(__dirname, "schema.sql");
    if (!fs.existsSync(schemaPath)) {
      console.warn("⚠️  schema.sql not found, skipping auto-migration.");
      return;
    }

    const schema = fs.readFileSync(schemaPath, "utf8");
    const parts = schema.split(/DELIMITER\s+\$\$/);

    // Run table definitions
    if (parts[0] && parts[0].trim()) {
      await pool.query(parts[0]);
      console.log("✅ Database tables created successfully!");
    }

    // Run trigger block if present
    if (parts[1]) {
      const triggerBlock = parts[1].split(/DELIMITER\s+;/)[0].trim();
      if (triggerBlock) {
        const triggerSql = triggerBlock.replace(/\$\$$/, "").trim();
        try {
          await pool.query(triggerSql);
          console.log("✅ Database triggers created!");
        } catch (trgErr) {
          // Triggers may fail on some cloud serverless instances or if already exist
          console.warn("⚠️  Trigger creation notice:", trgErr.message);
        }
      }
    }
  } catch (err) {
    console.warn("⚠️  Auto-migration deferred (Database currently unreachable or initializing):", err.message);
  }
}

export default pool;
