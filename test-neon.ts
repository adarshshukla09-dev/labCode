import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_ADMIN_URL,
  ssl: {
    rejectUnauthorized: true,
  },
});

async function main() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("Connected successfully:", result.rows[0]);
  } catch (error) {
    console.error("Connection failed:", error);
  } finally {
    await pool.end();
  }
}

main();
