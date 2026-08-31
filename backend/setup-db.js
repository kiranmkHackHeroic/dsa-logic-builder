/**
 * Quick script to create the database and tables.
 * Uses the credentials from server/.env
 *
 * Usage: node server/setup-db.js
 */
import "dotenv/config";
import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function setup() {
  const dbUrl = process.env.DATABASE_URL || process.env.MYSQL_URL;
  const host = process.env.MYSQL_HOST || "localhost";
  const port = parseInt(process.env.MYSQL_PORT || "3306", 10);
  const user = process.env.MYSQL_USER || "root";
  const password = process.env.MYSQL_PASSWORD || "";

  // First connect without a database to create it
  let conn;
  try {
    const connConfig = dbUrl
      ? { uri: dbUrl, multipleStatements: true, ssl: process.env.MYSQL_SSL === "true" ? { rejectUnauthorized: false } : undefined }
      : { host, port, user, password, multipleStatements: true, ssl: process.env.MYSQL_SSL === "true" ? { rejectUnauthorized: false } : undefined };

    console.log(dbUrl ? `Connecting to MySQL via connection URL...` : `Connecting to MySQL at ${host}:${port} as '${user}'...`);
    conn = await mysql.createConnection(connConfig);
    console.log("✅ Connected to MySQL!");
  } catch (err) {
    console.error("❌ Failed to connect to MySQL:", err.message);
    console.error("\nPlease check your MYSQL credentials in backend/.env");
    process.exit(1);
  }

  try {
    const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
    // Split on DELIMITER to handle trigger creation separately
    const parts = schema.split(/DELIMITER\s+\$\$/);
    
    // Run the main schema (before DELIMITER)
    if (parts[0].trim()) {
      await conn.query(parts[0]);
      console.log("✅ Tables created!");
    }

    // Handle the trigger block (between DELIMITER $$ and DELIMITER ;)
    if (parts[1]) {
      const triggerBlock = parts[1].split(/DELIMITER\s+;/)[0].trim();
      if (triggerBlock) {
        // Remove trailing $$ from the trigger
        const triggerSql = triggerBlock.replace(/\$\$$/, "").trim();
        await conn.query(triggerSql);
        console.log("✅ Trigger created!");
      }
    }

    console.log("\n🎉 Database 'dsa_logic_builder' is ready!");
  } catch (err) {
    if (err.code === "ER_DB_CREATE_EXISTS" || err.message.includes("already exists")) {
      console.log("ℹ️  Database already exists — skipping.");
    } else {
      console.error("❌ Schema error:", err.message);
    }
  } finally {
    await conn.end();
  }
}

setup();
