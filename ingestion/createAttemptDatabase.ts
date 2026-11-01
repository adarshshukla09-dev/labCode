import "dotenv/config";
import mysql from "mysql2/promise";
import { spawn } from "node:child_process";
import { createReadStream } from "node:fs";
import path from "node:path";

const DUMP_PATH = path.join(process.cwd(), "ingestion", "dumps", "master.sql");

const CONTAINER = "sql-lab-mysql";

export const insertMaster = async () => {
  const connectionString = process.env.SQL_DB_URL_2;

  if (!connectionString) {
    throw new Error("SQL_DB_URL_2 is not defined");
  }

  const dbUrl = new URL(connectionString);

  const database = decodeURIComponent(dbUrl.pathname.replace(/^\/+/, ""));

  const username = decodeURIComponent(dbUrl.username);
  const password = decodeURIComponent(dbUrl.password);

  const filePath = path.join(process.cwd(), "ingestion", "sql-lab-master.sql");

  return new Promise((resolve, reject) => {
    const mysql = spawn(
      "mysql",
      [
        `-h${dbUrl.hostname}`,
        `-P${dbUrl.port || 3306}`,
        `-u${username}`,
        database,
      ],
      {
        env: {
          ...process.env,
          MYSQL_PWD: password,
        },
      },
    );

    let stderr = "";

    mysql.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    mysql.on("error", (error) => {
      reject(new Error(`Could not start MySQL process: ${error.message}`));
    });

    const sqlStream = createReadStream(filePath);

    sqlStream.on("error", (error) => {
      mysql.kill();
      reject(new Error(`Could not read SQL dump: ${error.message}`));
    });

    sqlStream.pipe(mysql.stdin);

    mysql.on("close", (code) => {
      if (code !== 0) {
        reject(
          new Error(`MySQL import failed with exit code ${code}:\n${stderr}`),
        );
        return;
      }

      console.log("MySQL master database initialized successfully");

      resolve({
        success: true,
        message: "MySQL master database initialized successfully",
      });
    });
  });
};

import { randomUUID } from "node:crypto";

export const generateAttemptDatabaseName = () => {
  return `attempt_${randomUUID().replaceAll("-", "")}`;
};
