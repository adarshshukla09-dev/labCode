import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./db/drizzle/migrations",
  schema: "./db/drizzle/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url:
      process.env.DB_URL ||
      "postgresql://postgres:postgres123@labcode-postgres:5432/sqllab", //change to process.env.DB_URL for neon
  },
});
