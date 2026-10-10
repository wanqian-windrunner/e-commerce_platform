import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { DATABASE_URL, NODE_ENV } from "../config/env.js";
import * as schema from "./schema/index.js";

export const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 10000,
  ssl: NODE_ENV === "production" ? { rejectUnauthorized: true } : false,

})

export const db = drizzle(pool, { schema });

export const connectDB = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    await client.query("SELECT 1")
    client.release();
    console.log(" PostgreSQL connected successfully");
  } catch (error){
    console.error("Failed to connect to PostgreSQL:", error);
    process.exit(1);
  }
}

// 断开连接
const closePool = async () => {
  console.log("Closing database connection pool...");
  await pool.end();
  process.exit(0);
};

process.on("SIGINT", closePool);
process.on("SIGTERM", closePool);
