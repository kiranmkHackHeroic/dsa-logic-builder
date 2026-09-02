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
      ssl: process.env.MYSQL_SSL === "true" ? { rejectUnauthorized: false } : undefined,
    };

const pool = mysql.createPool(connectionConfig);

export default pool;
