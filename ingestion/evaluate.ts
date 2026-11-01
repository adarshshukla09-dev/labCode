import "dotenv/config";

import Database from "better-sqlite3";
import type { Database as DatabaseType } from "better-sqlite3";

import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

import type { ExpectedOutput } from "@/db/drizzle/schema/labs";

// -------------------- TYPES --------------------

export type Question = {
  solution_query: string;
  expected_output: ExpectedOutput;
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

// -------------------- CONFIG --------------------

const DUMP_PATH = path.join(process.cwd(), "ingestion", "sql-lab-master.sql");

// -------------------- HELPERS --------------------

const emptyResult = (): SqlQueryResult => ({
  columns: [],
  rows: [],
  rowCount: 0,
  rowsAffected: 0,
});

// Normalize SQL for query comparison.
function normalizeQuery(query: string): string {
  return query.trim().replace(/;\s*$/, "").replace(/\s+/g, " ").toLowerCase();
}

// Normalize values before comparing rows.
function normalizeValue(value: unknown): unknown {
  if (value instanceof Date) {
    return value.toISOString();
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
  // Expected row represented as an array:
  // ["Ava", "Morgan", 24000000]

  if (Array.isArray(row)) {
    return JSON.stringify(normalizeValue(row));
  }

  // Expected row represented as an object:
  // { first_name: "Ava", last_name: "Morgan" }

  if (row && typeof row === "object") {
    const object = row as Record<string, unknown>;

    // Convert object into ordered array using column names.
    const values = columns.map((column) => object[column]);

    return JSON.stringify(normalizeValue(values));
  }

  return JSON.stringify(normalizeValue(row));
}
// -------------------- DATABASE HELPERS --------------------

async function createDatabase(): Promise<DatabaseType> {
  const db = new Database(":memory:");

  db.pragma("foreign_keys = ON");

  const dump = await readFile(DUMP_PATH, "utf8");

  // Import the SQLite master dataset.
  db.exec(dump);

  return db;
}

// -------------------- QUERY EXECUTION --------------------

function executeQuery(db: DatabaseType, query: string): SqlQueryResult {
  const statement = db.prepare(query);

  if (statement.reader) {
    const columns = statement.columns().map((column) => column.name);

    const rows = statement.all() as Record<string, unknown>[];

    return {
      columns,
      rows,
      rowCount: rows.length,
      rowsAffected: 0,
    };
  }

  const execution = statement.run();

  return {
    columns: [],
    rows: [],
    rowCount: 0,
    rowsAffected: execution.changes,
  };
}

// -------------------- QUERY COMPARISON --------------------

function compareQuery(studentQuery: string, solutionQuery: string): boolean {
  return normalizeQuery(studentQuery) === normalizeQuery(solutionQuery);
}

// -------------------- OUTPUT COMPARISON --------------------

function compareOutput(
  actual: SqlQueryResult,
  expected: ExpectedOutput,
): boolean {
  // 1. Compare columns.

  if (
    expected.columns?.length &&
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

  // 3. Compare affected rows if provided.

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

  // 4. Compare actual rows against expected rows.

  if (expected.rows !== undefined) {
    if (actual.rows.length !== expected.rows.length) {
      return false;
    }

    const columns = expected.columns?.length
      ? expected.columns
      : actual.columns;

    const actualRows = actual.rows.map((row) => normalizeRow(row, columns));

    const expectedRows = expected.rows.map((row) => normalizeRow(row, columns));
    // Ignore row ordering when specified.
    if (expected.order_matters === false) {
      actualRows.sort();
      expectedRows.sort();
    }

    // Compare row by row.
    for (let i = 0; i < actualRows.length; i++) {
      if (actualRows[i] !== expectedRows[i]) {
        console.log("Row mismatch at index:", i);

        console.log("Actual row:");
        console.log(actual.rows[i]);

        console.log("Expected row:");
        console.log(expected.rows[i]);

        return false;
      }
    }
  }

  return true;
}

// -------------------- MAIN EVALUATION --------------------

export const evaluateSql = async (
  studentQuery: string,
  question: Question,
): Promise<EvaluateResult> => {
  const attemptId = randomUUID();

  let db: DatabaseType | null = null;

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
    // 1. Validate student query.

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

    // 3. Create isolated SQLite database.

    db = await createDatabase();

    console.log("SQLite database created.");

    // 4. Execute student's query.

    // Always execute the query so we can return
    // its actual output, even if it is incorrect.

    const actualResult = executeQuery(db, query);

    console.log("ACTUAL QUERY RESULT:");
    console.dir(actualResult, { depth: null });

    // 5. First check whether the SQL query matches
    // the official solution query.

    const queryMatches = compareQuery(query, question.solution_query);

    if (queryMatches) {
      console.log("QUERY MATCHED SOLUTION.");

      return {
        isCorrect: true,
        score: question.points,
        totalPoints: question.points,
        matchType: "query",
        message: "Correct answer!",
        result: actualResult,
      };
    }

    // 6. If query does not match, compare its output.

    console.log("QUERY DOES NOT MATCH. CHECKING OUTPUT...");

    const outputMatches = compareOutput(actualResult, expected);

    // 7. Return evaluation result.

    if (outputMatches) {
      console.log("OUTPUT MATCHED EXPECTED OUTPUT.");

      return {
        isCorrect: true,
        score: question.points,
        totalPoints: question.points,
        matchType: "output",
        message: "Correct answer! Your query produces the expected output.",
        result: actualResult,
      };
    }

    console.log("OUTPUT DOES NOT MATCH.");

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
    // 8. Close isolated SQLite database.

    if (db) {
      try {
        db.close();
        console.log("SQLite database closed.");
      } catch (error) {
        console.error("Database cleanup error:", error);
      }
    }
  }
};
