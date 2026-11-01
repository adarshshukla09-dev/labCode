// import { drizzle } from "drizzle-orm/neon-http";
// import { neon } from "@neondatabase/serverless";
// import * as schema from "@/db/drizzle/schema";

// const connectionString = process.env.process.env.DB_URL;

// if (!connectionString) {
//   throw new Error("process.env.DB_URL is not defined");
// }

// const sql = neon(connectionString);

// export const db = drizzle(sql, {
//   schema,
// });
import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/drizzle/schema";

const connectionString = "postgresql://postgres:postgres@localhost:5432/sqllab";
if (!connectionString) {
  throw new Error("db_url is not defined");
}

export const client = postgres(connectionString);

export const db = drizzle(client, {
  schema,
});
