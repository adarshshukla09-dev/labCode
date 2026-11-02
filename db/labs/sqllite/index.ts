import { drizzle } from "drizzle-orm/mysql2";

const connectionString =
  process.env.SQL_DB_URL_2 || "mysql://root:root123@labcode-mysql:3306/sqllab";

if (!connectionString) {
  throw new Error("SQL_DB_URL_2 is not defined");
}

export const mysqlDb = drizzle({
  connection: {
    uri: connectionString,
  },
});
