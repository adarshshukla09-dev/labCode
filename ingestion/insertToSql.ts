import "dotenv/config";
import { Pool } from "pg";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const insertMaster = async () => {
  const connectionString = process.env.POSTGRES_URL?.trim();

  if (!connectionString) {
    throw new Error("POSTGRES_URL is not defined");
  }

  const pool = new Pool({
    connectionString,
    max: 1,
    connectionTimeoutMillis: 10000,
  });

  try {
    // Read PostgreSQL master SQL file.
    const filePath = path.join(
      process.cwd(),
      "ingestion",
      "sql-lab-master.sql",
    );

    const sqlQuery = await readFile(filePath, "utf-8");

    // Execute SQL dump.
    const client = await pool.connect();

    try {
      await client.query(sqlQuery);
    } finally {
      client.release();
    }

    console.log("PostgreSQL master database initialized successfully");

    return {
      success: true,
      message: "PostgreSQL master database initialized successfully",
    };
  } catch (error) {
    console.error("PostgreSQL Import Error:", error);
    throw error;
  } finally {
    await pool.end();
  }
};

// Execute seed script.
insertMaster().catch((error) => {
  console.error("PostgreSQL seed failed:", error);
  process.exitCode = 1;
});
