import "dotenv/config";

import pg from "pg";

import type { Pool, QueryResult } from "pg";

import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

import type { ExpectedOutput } from "@/db/drizzle/schema/labs";

const { Pool: PgPool } = pg;
const { types } = pg;

// BIGINT: convert to number when it is safe.
types.setTypeParser(20, (value) => {
  const number = Number(value);

  return Number.isSafeInteger(number) ? number : value;
});

// DATE: preserve the original calendar date.
types.setTypeParser(1082, (value) => value);

// TIMESTAMP WITHOUT TIME ZONE: preserve its original value.
types.setTypeParser(1114, (value) => value);

export type Question = {
  solution_query: string;
  expected_output: ExpectedOutput | string;
  points: number;
};

export type SqlQueryResult = {
  columns: string[];
  rows: Record<string, unknown>[];
  rowCount: number;
  rowsAffected: number;
};

export type EvaluateResult = {
  isCorrect: boolean;
  score: number;
  totalPoints: number;
  matchType: "query" | "output" | "none";
  message: string;
  result: SqlQueryResult;
};

interface EvaluationDatabase {
  admin: Pool;
  student: Pool;
  dbName: string;
  username: string;
}

// ======================================================
// CONFIG
// ======================================================

const DUMP_PATH = path.join(process.cwd(), "ingestion", "sql-lab-master.sql");

const getPostgresConfig = () => {
  const connectionString = process.env.POSTGRES_ADMIN_URL;

  if (!connectionString) {
    throw new Error("POSTGRES_ADMIN_URL is missing");
  }

  const url = new URL(connectionString);

  console.log("PostgreSQL connection config:", {
    host: url.hostname,
    database: url.pathname,
    sslmode: url.searchParams.get("sslmode"),
    hasPassword: Boolean(url.password),
  });

  if (url.searchParams.get("sslmode") !== "require") {
    throw new Error("POSTGRES_ADMIN_URL must include sslmode=require");
  }

  return {
    connectionString,
    ssl: {
      rejectUnauthorized: true,
    },
    max: 2,
    connectionTimeoutMillis: 15000,
  };
};

const emptyResult = (): SqlQueryResult => ({
  columns: [],
  rows: [],
  rowCount: 0,
  rowsAffected: 0,
});

// ======================================================
// NORMALIZATION HELPERS
// ======================================================

function normalizeQuery(query: string): string {
  return query.trim().replace(/;\s*$/, "").replace(/\s+/g, " ").toLowerCase();
}

function normalizeValue(value: unknown): unknown {
  if (value instanceof Date) {
    // Use local calendar components for Date objects.
    // This avoids shifting date-only values in timezones such as IST.
    return [
      value.getFullYear(),
      String(value.getMonth() + 1).padStart(2, "0"),
      String(value.getDate()).padStart(2, "0"),
    ].join("-");
  }

  if (Buffer.isBuffer(value)) {
    return value.toString("base64");
  }

  if (Array.isArray(value)) {
    return value.map(normalizeValue);
  }

  if (value && typeof value === "object") {
    const object = value as Record<string, unknown>;

    return Object.keys(object)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = normalizeValue(object[key]);
        return acc;
      }, {});
  }

  return value;
}

function normalizeRow(row: unknown): string {
  if (row && typeof row === "object" && !Array.isArray(row)) {
    return JSON.stringify(normalizeValue(row));
  }

  return JSON.stringify(normalizeValue(row));
}

// ======================================================
// DATABASE CREATION
// ======================================================

export const createDatabase = async (): Promise<EvaluationDatabase> => {
  const config = getPostgresConfig();
  const baseUrl = new URL(config.connectionString);

  const id = randomUUID().replace(/-/g, "");
  const dbName = `eval_${id}`;
  const username = `eval_${id.slice(0, 24)}`;
  const password = randomUUID().replace(/-/g, "");

  const admin = new PgPool({
    ...config,
    max: 2,
    connectionTimeoutMillis: 15000,
  });

  let dbAdmin: Pool | null = null;
  let student: Pool | null = null;

  try {
    console.time("DB: CREATE DATABASE");
    await admin.query(`CREATE DATABASE "${dbName}"`);
    console.timeEnd("DB: CREATE DATABASE");

    const evalAdminUrl = new URL(baseUrl.toString());
    evalAdminUrl.pathname = `/${dbName}`;

    dbAdmin = new PgPool({
      ...config,
      connectionString: evalAdminUrl.toString(),
      max: 1,
      connectionTimeoutMillis: 15000,
    });

    console.time("DB: READ SQL DUMP");
    const dump = await readFile(DUMP_PATH, "utf8");
    console.timeEnd("DB: READ SQL DUMP");

    console.time("DB: IMPORT SQL DUMP");
    await dbAdmin.query(dump);
    console.timeEnd("DB: IMPORT SQL DUMP");

    console.time("DB: CREATE ROLE");
    await admin.query(`CREATE ROLE "${username}" LOGIN PASSWORD '${password}'`);
    await dbAdmin.query(
      `GRANT CONNECT ON DATABASE "${dbName}" TO "${username}"`,
    );
    await dbAdmin.query(`GRANT USAGE ON SCHEMA public TO "${username}"`);
    await dbAdmin.query(
      `GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO "${username}"`,
    );
    await dbAdmin.query(
      `GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO "${username}"`,
    );
    console.timeEnd("DB: CREATE ROLE");

    await dbAdmin.end();
    dbAdmin = null;

    const studentUrl = new URL(baseUrl.toString());
    studentUrl.pathname = `/${dbName}`;
    studentUrl.username = username;
    studentUrl.password = password;

    student = new PgPool({
      ...config,
      connectionString: studentUrl.toString(),
      max: 1,
      connectionTimeoutMillis: 15000,
    });

    console.time("DB: STUDENT CONNECTION");
    await student.query("SELECT 1");
    console.timeEnd("DB: STUDENT CONNECTION");

    return {
      admin,
      student,
      dbName,
      username,
    };
  } catch (error) {
    console.error("Database creation failed:", error);

    if (student) await student.end().catch(() => {});
    if (dbAdmin) await dbAdmin.end().catch(() => {});

    await admin
      .query(`DROP DATABASE IF EXISTS "${dbName}" WITH (FORCE)`)
      .catch(() => {});

    await admin.query(`DROP ROLE IF EXISTS "${username}"`).catch(() => {});
    await admin.end().catch(() => {});

    throw error;
  }
};

// ======================================================
// QUERY EXECUTION
// ======================================================

export const executeQuery = async (
  db: Pool,
  query: string,
): Promise<SqlQueryResult> => {
  const result: QueryResult = await db.query(query);

  const rows = result.rows as Record<string, unknown>[];

  const columns = result.fields.map((field) => field.name);

  const isSelect =
    result.command === "SELECT" ||
    result.command === "SHOW" ||
    result.command === "VALUES";

  return {
    columns: isSelect ? columns : [],
    rows: isSelect ? rows : [],
    rowCount: isSelect ? rows.length : 0,
    rowsAffected: isSelect ? 0 : (result.rowCount ?? 0),
  };
};

// ======================================================
// DATABASE CLEANUP
// ======================================================

export const cleanupDatabase = async (
  database: EvaluationDatabase,
): Promise<void> => {
  const { admin, student, dbName, username } = database;

  console.log(`Cleaning evaluation database: ${dbName}`);

  await student.end().catch((error) => {
    console.error("Student connection cleanup error:", error);
  });

  await admin
    .query(
      `SELECT pg_terminate_backend(pid)
     FROM pg_stat_activity
     WHERE datname = $1
       AND pid <> pg_backend_pid()`,
      [dbName],
    )
    .catch((error) => {
      console.error("Connection termination error:", error);
    });

  await admin
    .query(`DROP DATABASE IF EXISTS "${dbName}" WITH (FORCE)`)
    .catch((error) => {
      console.error("Database cleanup error:", error);
    });

  await admin.query(`DROP ROLE IF EXISTS "${username}"`).catch((error) => {
    console.error("User cleanup error:", error);
  });

  await admin.end().catch((error) => {
    console.error("Admin connection cleanup error:", error);
  });

  console.log("Evaluation database cleaned successfully.");
};

// ======================================================
// QUERY COMPARISON
// ======================================================

function compareQuery(studentQuery: string, solutionQuery: string): boolean {
  return normalizeQuery(studentQuery) === normalizeQuery(solutionQuery);
}

// ======================================================
// OUTPUT COMPARISON
// ======================================================

function compareOutput(
  actual: SqlQueryResult,
  expected: ExpectedOutput,
): boolean {
  const hasExpectedCriteria =
    expected.columns !== undefined ||
    expected.row_count !== undefined ||
    expected.rows !== undefined ||
    expected.rows_affected !== undefined;

  if (!hasExpectedCriteria) {
    console.warn("Expected output has no comparison criteria.");
    return false;
  }

  // 1. Compare columns (order-sensitive).
  // Note: If expected.columns was saved alphabetically instead of table DDL order,
  // check the EXPECTED COLUMNS vs ACTUAL COLUMNS log output.
  if (
    expected.columns !== undefined &&
    JSON.stringify(actual.columns) !== JSON.stringify(expected.columns)
  ) {
    console.log("Column mismatch:", {
      actual: actual.columns,
      expected: expected.columns,
    });

    return false;
  }

  // 2. Compare row count.
  if (
    expected.row_count !== undefined &&
    actual.rowCount !== expected.row_count
  ) {
    console.log("Row count mismatch:", {
      actual: actual.rowCount,
      expected: expected.row_count,
    });

    return false;
  }

  // 3. Compare affected rows.
  if (
    expected.rows_affected !== undefined &&
    actual.rowsAffected !== expected.rows_affected
  ) {
    console.log("Affected rows mismatch:", {
      actual: actual.rowsAffected,
      expected: expected.rows_affected,
    });

    return false;
  }

  // 4. Compare rows.
  if (expected.rows !== undefined) {
    if (actual.rows.length !== expected.rows.length) {
      console.log("Rows length mismatch:", {
        actual: actual.rows.length,
        expected: expected.rows.length,
      });

      return false;
    }

    const actualRows = actual.rows.map(normalizeRow);
    const expectedRows = expected.rows.map(normalizeRow);

    // SQL result ordering is not guaranteed unless explicitly requested.
    if (expected.order_matters !== true) {
      actualRows.sort();
      expectedRows.sort();
    }

    for (let i = 0; i < actualRows.length; i++) {
      if (actualRows[i] !== expectedRows[i]) {
        console.log("Row mismatch at index:", i, {
          actual: actualRows[i],
          expected: expectedRows[i],
        });

        return false;
      }
    }
  }

  return true;
}

// ======================================================
// MAIN SQL EVALUATION
// ======================================================

export const evaluateSql = async (
  studentQuery: string,
  question: Question,
): Promise<EvaluateResult> => {
  const attemptId = randomUUID();

  let database: EvaluationDatabase | null = null;

  const failedResult = (
    message: string,
    result: SqlQueryResult = emptyResult(),
  ): EvaluateResult => ({
    isCorrect: false,
    score: 0,
    totalPoints: question.points,
    matchType: "none",
    message,
    result,
  });

  try {
    // 1. Validate query.
    const query = studentQuery.trim();

    if (!query) {
      return failedResult("Please enter a SQL query.");
    }

    console.log("================================");
    console.log("SQL ATTEMPT:", attemptId);
    console.log("STUDENT QUERY:", query);
    console.log("================================");

    // 2. Parse expected output.
    const expected: ExpectedOutput =
      typeof question.expected_output === "string"
        ? JSON.parse(question.expected_output)
        : question.expected_output;

    if (!expected || typeof expected !== "object") {
      throw new Error("Question expected output is invalid.");
    }

    // 3. Create isolated database.
    database = await createDatabase();

    console.log("PostgreSQL evaluation database created.");

    // 4. Execute student query.
    const actualResult = await executeQuery(database.student, query);

    console.log("ACTUAL QUERY RESULT:");
    console.dir(actualResult, { depth: null });

    // Diagnostic logs before comparison
    console.log("EXPECTED COLUMNS:", expected.columns);
    console.log("ACTUAL COLUMNS:", actualResult.columns);

    console.log("EXPECTED ROW COUNT:", expected.row_count);
    console.log("ACTUAL ROW COUNT:", actualResult.rowCount);

    console.log("EXPECTED FIRST ROW:", expected.rows?.[0]);
    console.log("ACTUAL FIRST ROW:", actualResult.rows?.[0]);

    console.log("ACTUAL DATE TYPE:", typeof actualResult.rows?.[1]?.hire_date);
    console.log("ACTUAL DATE VALUE:", actualResult.rows?.[1]?.hire_date);

    // 5. Compare output.
    const outputMatches = compareOutput(actualResult, expected);

    // 6. Compare query.
    const queryMatches = compareQuery(query, question.solution_query);

    // 7. Determine result.
    if (outputMatches) {
      const matchType = queryMatches ? "query" : "output";

      console.log(`SQL evaluation successful: ${matchType}`);

      return {
        isCorrect: true,
        score: question.points,
        totalPoints: question.points,
        matchType,
        message:
          matchType === "query"
            ? "Correct answer!"
            : "Correct answer! Your query produces the expected output.",
        result: actualResult,
      };
    }

    console.log("SQL output does not match expected output.");

    return {
      isCorrect: false,
      score: 0,
      totalPoints: question.points,
      matchType: "none",
      message:
        "Incorrect answer. Your query output does not match the expected result.",
      result: actualResult,
    };
  } catch (error) {
    console.error("SQL Evaluation Error:", error);

    return failedResult(
      error instanceof Error
        ? `SQL execution failed: ${error.message}`
        : "SQL execution failed.",
    );
  } finally {
    // 8. Always clean up temporary database.
    if (database) {
      await cleanupDatabase(database);
    }
  }
};
