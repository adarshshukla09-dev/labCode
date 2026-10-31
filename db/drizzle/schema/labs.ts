import {
  pgTable,
  pgEnum,
  serial,
  integer,
  text,
  timestamp,
  uniqueIndex,
  index,
  jsonb,
  varchar, // ✅ Fixed: Imported from pg-core instead of mysql-core
} from "drizzle-orm/pg-core";

// Progress status enum
export const progressStatusEnum = pgEnum("progress_status", [
  "not_started",
  "in_progress",
  "completed",
]);

export const questionDialectEnum = pgEnum("question_dialect", [
  "sqlite",
  "postgresql",
  "mysql",
  "mongodb",
]);

export const questionDifficultyEnum = pgEnum("question_difficulty", [
  "easy",
  "medium",
  "hard",
]);

export const questionStatusEnum = pgEnum("question_status", [
  "draft",
  "published",
  "archived",
]);

export type ExpectedOutputCell = string | number | boolean | null;

export type ExpectedOutputRow =
  | Record<string, ExpectedOutputCell>
  | ExpectedOutputCell[];

export interface ExpectedOutput {
  type?: string;
  columns?: string[];
  row_count?: number;
  rows?: ExpectedOutputRow[];
  rows_affected?: number;
  order_matters?: boolean;
  note?: string;
}

export type MongoExpectedOutput =
  | {
      type: "documents";
      count: number;
      documents: Record<string, unknown>[];
    }
  | {
      type: "write";
      acknowledged?: boolean;
      insertedCount?: number;
      matchedCount?: number;
      modifiedCount?: number;
      deletedCount?: number;
    };

export const questions = pgTable(
  "questions",
  () => ({
    id: serial("id").primaryKey(),

    slug: varchar("slug", { length: 150 }).notNull(),

    title: varchar("title", { length: 255 }).notNull(),

    description: text("description"),

    question: text("question").notNull(),

    task: text("task").notNull(),

    dialect: questionDialectEnum("dialect").notNull().default("sqlite"),

    difficulty: questionDifficultyEnum("difficulty").notNull().default("easy"),

    starterQuery: text("starter_query"),

    // Keep the solution server-side.
    solutionQuery: text("solution_query"),

    explanation: text("explanation"),

    hints: jsonb("hints").$type<string[]>().notNull().default([]),

    expectedOutput: jsonb("expected_output").$type<ExpectedOutput>(),

    datasetVersion: varchar("dataset_version", { length: 50 }),

    status: questionStatusEnum("status").notNull().default("draft"),

    points: integer("points").notNull().default(10),

    sortOrder: integer("sort_order").notNull().default(0),
    chapter: varchar("chapter", { length: 150 }).notNull(),

    lessonNumber: integer("lesson_number").notNull(),

    tableContext: jsonb("table_context")
      .$type<
        {
          table: string;
          columns: string[];
          description: string;
        }[]
      >()
      .notNull()
      .default([]),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  }),
  (table) => [
    uniqueIndex("questions_slug_idx").on(table.slug),
    uniqueIndex("questions_lesson_number_idx").on(table.lessonNumber),
    index("questions_chapter_idx").on(table.chapter),
    index("questions_status_idx").on(table.status),
    index("questions_dialect_idx").on(table.dialect),
    index("questions_difficulty_idx").on(table.difficulty),
    index("questions_sort_order_idx").on(table.sortOrder),
    index("questions_lesson_chapter_idx").on(
      table.lessonNumber,
      table.chapter,
      table.sortOrder,
    ),
  ],
);

export const mongoQuestions = pgTable(
  "mongo_queries",
  () => ({
    id: serial("id").primaryKey(),

    slug: varchar("slug", { length: 150 }).notNull(),

    title: varchar("title", { length: 255 }).notNull(),

    description: text("description"),

    question: text("question").notNull(),

    task: text("task").notNull(),

    difficulty: questionDifficultyEnum("difficulty").notNull().default("easy"),

    // Example: db.employees.find({})
    starterQuery: text("starter_query"),

    // Keep the solution server-side.
    solutionQuery: text("solution_query"),

    explanation: text("explanation"),

    hints: jsonb("hints").$type<string[]>().notNull().default([]),

    expectedOutput: jsonb("expected_output").$type<MongoExpectedOutput>(),

    datasetVersion: varchar("dataset_version", { length: 50 }),

    status: questionStatusEnum("status").notNull().default("draft"),

    points: integer("points").notNull().default(10),

    sortOrder: integer("sort_order").notNull().default(0),

    chapter: varchar("chapter", { length: 150 }).notNull(),

    lessonNumber: integer("lesson_number").notNull(),

    collectionContext: jsonb("collection_context")
      .$type<
        {
          collection: string;
          fields: string[];
          description: string;
        }[]
      >()
      .notNull()
      .default([]),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  }),
  (table) => [
    uniqueIndex("mongo_queries_slug_idx").on(table.slug),

    uniqueIndex("mongo_queries_lesson_number_idx").on(table.lessonNumber),

    index("mongo_queries_chapter_idx").on(table.chapter),

    index("mongo_queries_status_idx").on(table.status),

    index("mongo_queries_difficulty_idx").on(table.difficulty),

    index("mongo_queries_sort_order_idx").on(table.sortOrder),

    index("mongo_queries_lesson_chapter_idx").on(
      table.lessonNumber,
      table.chapter,
      table.sortOrder,
    ),
  ],
);

export type Question = typeof questions.$inferSelect;
export type MongoQuestion = typeof mongoQuestions.$inferSelect;
