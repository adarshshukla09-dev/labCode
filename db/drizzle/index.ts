import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/drizzle/schema";

const connectionString =
  process.env.DB_URL ||
  "postgresql://postgres:postgres123@labcode-postgres:5432/sqllab";
if (!connectionString) {
  throw new Error("db_url is not defined");
}

export const client = postgres(connectionString);

export const db = drizzle(client, {
  schema,
});
