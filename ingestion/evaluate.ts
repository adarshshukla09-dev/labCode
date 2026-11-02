import "dotenv/config";

import mysql from "mysql2/promise";

import type {
  Connection,
  FieldPacket,
  ResultSetHeader,
  RowDataPacket,
} from "mysql2/promise";

import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

import type { ExpectedOutput } from "@/db/drizzle/schema/labs";

// ======================================================
// TYPES
// ======================================================

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
  admin: Connection;
  student: Connection;
  dbName: string;
  username: string;
}

// ======================================================
// CONFIG
// ======================================================

const DUMP_PATH = path.join(process.cwd(), "ingestion", "sql-lab-master.sql");

const getMySqlConfig = () => {
  const connectionString =
    process.env.MYSQL_URL ||
    process.env.SQL_DB_URL_2 ||
    "mysql://root:YOUR_ROOT_PASSWORD@127.0.0.1:3306/sqllab";

  const url = new URL(connectionString);

  return {
    host: url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
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
    return value.toISOString().slice(0, 10);
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

function normalizeRow(row: unknown, columns: string[]): string {
  if (Array.isArray(row)) {
    return JSON.stringify(normalizeValue(row));
  }

  if (row && typeof row === "object") {
    const object = row as Record<string, unknown>;

    const values = columns.map((column) => normalizeValue(object[column]));

    return JSON.stringify(values);
  }

  return JSON.stringify(normalizeValue(row));
}

// ======================================================
// DATABASE CREATION
// ======================================================

export const createDatabase = async (): Promise<EvaluationDatabase> => {
  const config = getMySqlConfig();

  const id = randomUUID().replace(/-/g, "");

  const dbName = `eval_${id}`;
  const username = `eval_${id.slice(0, 24)}`;
  const password = randomUUID().replace(/-/g, "");

  // Admin connection.
  const admin = await mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: "sqllab",
    multipleStatements: true,
    dateStrings: true,
  });

  let student: Connection | null = null;

  try {
    console.log(`Creating evaluation database: ${dbName}`);

    // 1. Create isolated database.
    await admin.query(`CREATE DATABASE \`${dbName}\``);

    // 2. Read trusted SQL dataset.
    const dump = await readFile(DUMP_PATH, "utf8");

    // 3. Select evaluation database.
    await admin.query(`USE \`${dbName}\``);

    // 4. Import trusted dataset.
    await admin.query(dump);

    console.log("Master dataset imported successfully.");

    // 5. Create temporary student user.
    await admin.query(
      `CREATE USER '${username}'@'%' IDENTIFIED BY '${password}'`,
    );

    // 6. Grant privileges only on evaluation database.
    await admin.query(
      `GRANT ALL PRIVILEGES ON \`${dbName}\`.* TO '${username}'@'%'`,
    );

    // 7. Connect student.
    student = await mysql.createConnection({
      ...config,
      user: username,
      password,
      database: dbName,
      multipleStatements: false,
      decimalNumbers: true,
      dateStrings: true,
      connectTimeout: 10000,
    });

    console.log("Student database connection established.");

    return {
      admin,
      student,
      dbName,
      username,
    };
  } catch (error) {
    console.error("Database creation failed:", error);

    if (student) {
      await student.end().catch(() => {});
    }

    await admin.query(`DROP USER IF EXISTS '${username}'@'%'`).catch(() => {});

    await admin.query(`DROP DATABASE IF EXISTS \`${dbName}\``).catch(() => {});

    await admin.end().catch(() => {});

    throw error;
  }
};

// ======================================================
// QUERY EXECUTION
// ======================================================

export const executeQuery = async (
  db: Connection,
  query: string,
): Promise<SqlQueryResult> => {
  const [result, fields] = await db.query(query);

  if (Array.isArray(result)) {
    const rows = result as RowDataPacket[];

    const columns = ((fields || []) as FieldPacket[]).map(
      (field) => field.name,
    );

    return {
      columns,
      rows: rows as Record<string, unknown>[],
      rowCount: rows.length,
      rowsAffected: 0,
    };
  }

  const execution = result as ResultSetHeader;

  return {
    columns: [],
    rows: [],
    rowCount: 0,
    rowsAffected: execution.affectedRows,
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

  await admin.query(`DROP USER IF EXISTS '${username}'@'%'`).catch((error) => {
    console.error("User cleanup error:", error);
  });

  await admin.query(`DROP DATABASE IF EXISTS \`${dbName}\``).catch((error) => {
    console.error("Database cleanup error:", error);
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

  // 1. Compare columns.
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

    const columns = expected.columns?.length
      ? expected.columns
      : actual.columns;

    const actualRows = actual.rows.map((row) => normalizeRow(row, columns));

    const expectedRows = expected.rows.map((row) => normalizeRow(row, columns));

    // Ignore row ordering when order_matters is false.
    if (expected.order_matters === false) {
      actualRows.sort();
      expectedRows.sort();
    }

    for (let i = 0; i < actualRows.length; i++) {
      if (actualRows[i] !== expectedRows[i]) {
        console.log("Row mismatch at index:", i);
        console.log("Actual:", actual.rows[i]);
        console.log("Expected:", expected.rows[i]);

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

    console.log("MySQL evaluation database created.");

    // 4. Execute student query.
    const actualResult = await executeQuery(database.student, query);

    console.log("ACTUAL QUERY RESULT:");
    console.dir(actualResult, { depth: null });

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
