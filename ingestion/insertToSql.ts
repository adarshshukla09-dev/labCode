import "dotenv/config";
import mysql from "mysql2/promise";
import { readFile } from "fs/promises";
import path from "path";

export const insertMaster = async () => {
  let connection;

  try {
    const connectionString =
      process.env.MYSQL_URL || "mysql://root:root123@labcode-mysql:3306/sqllab";

    if (!connectionString) {
      throw new Error("SQL_DB_URL_2 is not defined");
    }

    const dbUrl = new URL(connectionString);

    connection = await mysql.createConnection({
      host: dbUrl.hostname,
      port: Number(dbUrl.port || 3306),
      user: decodeURIComponent(dbUrl.username),
      password: decodeURIComponent(dbUrl.password),
      database: dbUrl.pathname.slice(1),
      multipleStatements: true,
    });

    const filePath = path.join(
      process.cwd(),
      "ingestion",
      "sql-lab-master.sql",
    );

    const sqlQuery = await readFile(filePath, "utf-8");

    await connection.query(sqlQuery);

    console.log("MySQL master database initialized successfully");

    return {
      success: true,
      message: "MySQL master database initialized successfully",
    };
  } catch (error) {
    console.error("SQL Import Error:", error);

    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

insertMaster().catch((error) => {
  console.error("MySQL seed failed:", error);
  process.exitCode = 1;
});
