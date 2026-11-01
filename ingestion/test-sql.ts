import type { InferInsertModel } from "drizzle-orm";
import seedData from "./seed.updated.json";
import { ExpectedOutput, questions } from "@/db/drizzle/schema";
import { client, db } from "@/db/drizzle";

const DATASET_VERSION = "sql-lab-v1";

// --------------------------------------------------
// Types
// --------------------------------------------------

type TableContext = {
  table: string;
  columns: string[];
  description: string;
};

type SeedQuestion = {
  slug: string;
  title: string;
  description: string;
  question: string;
  task: string;
  chapter: string;
  lesson_number: number;
  difficulty: "easy" | "medium" | "hard";
  points: number;
  sort_order: number;
  dialect: "sqlite";
  starter_query: string | null;
  solution_query: string;
  explanation: string;
  hints: string[];
  table_context: TableContext[];
  expected_output: ExpectedOutput | null;
};

type QuestionInsert = InferInsertModel<typeof questions>;

// --------------------------------------------------
// Validation helpers
// --------------------------------------------------

function isExpectedOutput(value: unknown): value is ExpectedOutput {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const output = value as Record<string, unknown>;

  const isValidCell = (
    cell: unknown,
  ): cell is string | number | boolean | null =>
    cell === null ||
    typeof cell === "string" ||
    (typeof cell === "number" && Number.isFinite(cell)) ||
    typeof cell === "boolean";

  // Validate columns when present.
  if (
    output.columns !== undefined &&
    (!Array.isArray(output.columns) ||
      !output.columns.every((column) => typeof column === "string"))
  ) {
    return false;
  }

  // Validate rows when present.
  if (output.rows !== undefined) {
    if (!Array.isArray(output.rows)) {
      return false;
    }

    const isValidRow = (row: unknown): boolean => {
      if (Array.isArray(row)) {
        return row.every(isValidCell);
      }

      if (typeof row !== "object" || row === null) {
        return false;
      }

      return Object.values(row as Record<string, unknown>).every(isValidCell);
    };

    if (!output.rows.every(isValidRow)) {
      return false;
    }
  }

  // Validate optional counts.
  for (const key of ["row_count", "rows_affected"]) {
    const count = output[key];

    if (
      count !== undefined &&
      (typeof count !== "number" || !Number.isInteger(count) || count < 0)
    ) {
      return false;
    }
  }

  if (output.type !== undefined && typeof output.type !== "string") {
    return false;
  }

  if (output.note !== undefined && typeof output.note !== "string") {
    return false;
  }

  // A rows result must contain columns and rows.
  if (output.type === "rows") {
    return Array.isArray(output.columns) && Array.isArray(output.rows);
  }

  // A DML result must contain a valid affected-row count.
  if (output.type === "dml") {
    return (
      typeof output.rows_affected === "number" &&
      Number.isInteger(output.rows_affected) &&
      output.rows_affected >= 0
    );
  }

  // Reject objects without a recognized result structure.
  return output.type === "rows" || output.type === "dml";
}

function validateExpectedOutput(
  value: unknown,
  slug: string,
): ExpectedOutput | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (!isExpectedOutput(value)) {
    throw new Error(
      `Invalid expected_output for question "${slug}". ` +
        "Expected a valid rows or dml result.",
    );
  }

  return value;
}

// --------------------------------------------------
// Seed database
// --------------------------------------------------

async function seed() {
  try {
    const data = seedData as SeedQuestion[];

    for (const question of data) {
      const expectedOutput = validateExpectedOutput(
        question.expected_output,
        question.slug,
      );

      const values = {
        slug: question.slug,
        title: question.title,
        description: question.description,
        question: question.question,
        task: question.task,
        chapter: question.chapter,
        lessonNumber: question.lesson_number,
        difficulty: question.difficulty,
        points: question.points ?? 10,
        sortOrder: question.sort_order ?? question.lesson_number,
        dialect: question.dialect ?? "sqlite",
        starterQuery: question.starter_query,
        solutionQuery: question.solution_query,
        explanation: question.explanation,
        hints: question.hints,
        tableContext: question.table_context,
        expectedOutput,
        datasetVersion: DATASET_VERSION,
        status: "published",
      } satisfies QuestionInsert;

      await db
        .insert(questions)
        .values(values)
        .onConflictDoUpdate({
          target: questions.slug,
          set: {
            title: values.title,
            description: values.description,
            question: values.question,
            task: values.task,
            chapter: values.chapter,
            lessonNumber: values.lessonNumber,
            difficulty: values.difficulty,
            points: values.points,
            sortOrder: values.sortOrder,
            dialect: values.dialect,
            starterQuery: values.starterQuery,
            solutionQuery: values.solutionQuery,
            explanation: values.explanation,
            hints: values.hints,
            tableContext: values.tableContext,
            expectedOutput: values.expectedOutput,
            datasetVersion: values.datasetVersion,
            status: values.status,
            updatedAt: new Date(),
          },
        });
    }

    console.log(
      `Successfully seeded ${seedData.length} SQL Lab questions into PostgreSQL.`,
    );
  } catch (error) {
    console.error("Failed to seed SQL Lab questions:", error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

seed().catch((error) => {
  console.error("Failed to seed SQL Lab questions:", error);
  process.exitCode = 1;
});
