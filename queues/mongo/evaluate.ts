import "dotenv/config";

import { randomUUID } from "node:crypto";
import type { Db, Document, IndexSpecification } from "mongodb";
import type { MongoExpectedOutput } from "@/db/drizzle/schema";
import { mongooseDb } from "@/db/labs/mongoose";

// The exercise JSON also supports scalar/value answers. The shared schema type
// currently only declares document and write outputs, so extend it locally.
type MongoExpectedOutputWithValue =
  | MongoExpectedOutput
  | { type: "value"; value: unknown };

// -------------------- PUBLIC TYPES --------------------

export type MongoQuestion = {
  solution_query: string | null;
  expected_output: MongoExpectedOutputWithValue | null;
  points: number;
};

export type MongoQueryResult = {
  columns: string[];
  rows: Record<string, unknown>[];
  rowCount: number;
  rowsAffected: number;
};

type EvaluateResult = {
  isCorrect: boolean;
  score: number;
  totalPoints: number;
  matchType: "query" | "output" | "none";
  message: string;
  result: MongoQueryResult | null;
};

type Operation =
  | "find"
  | "findOne"
  | "aggregate"
  | "countDocuments"
  | "distinct"
  | "insertOne"
  | "insertMany"
  | "updateOne"
  | "updateMany"
  | "deleteOne"
  | "deleteMany"
  | "createIndex"
  | "createCollection";

type StudentQuery = {
  collection: string;
  operation: Operation;
  filter?: Document;
  pipeline?: Document[];
  field?: string;
  document?: Document;
  documents?: Document[];
  update?: Document;
  indexSpec?: IndexSpecification;
  indexOptions?: Document;
  collectionOptions?: Document;
  options?: {
    projection?: Document;
    sort?: Document;
    limit?: number;
    skip?: number;
  };
};

const MAX_ROWS = 500;
const QUERY_TIMEOUT = 5_000;

// -------------------- SAFE MONGO-SHELL LITERAL PARSER --------------------
// Parses data literals only. Submitted JavaScript is never evaluated.

class LiteralParser {
  private i = 0;
  constructor(private readonly source: string) {}

  private ws() {
    while (/\s/.test(this.source[this.i] ?? "")) this.i++;
  }
  private peek() {
    this.ws();
    return this.source[this.i];
  }
  private consume(char: string) {
    this.ws();
    if (this.source[this.i] !== char)
      throw new Error(`Expected "${char}" at position ${this.i}.`);
    this.i++;
  }
  private string(): string {
    const quote = this.source[this.i++];
    let out = "";
    while (this.i < this.source.length) {
      const c = this.source[this.i++];
      if (c === quote) return out;
      if (c === "\\") {
        const n = this.source[this.i++];
        const escapes: Record<string, string> = {
          n: "\n",
          r: "\r",
          t: "\t",
          b: "\b",
          f: "\f",
        };
        out += escapes[n] ?? n;
      } else out += c;
    }
    throw new Error("Unterminated string literal.");
  }
  private regex(): RegExp {
    this.i++; // opening slash
    let pattern = "";
    let escaped = false;
    while (this.i < this.source.length) {
      const c = this.source[this.i++];
      if (escaped) {
        pattern += `\\${c}`;
        escaped = false;
        continue;
      }
      if (c === "\\") {
        escaped = true;
        continue;
      }
      if (c === "/") {
        let flags = "";
        while (/[gimsuy]/.test(this.source[this.i] ?? ""))
          flags += this.source[this.i++];
        return new RegExp(pattern, flags);
      }
      pattern += c;
    }
    throw new Error("Unterminated regular expression.");
  }
  private identifier(): string {
    this.ws();
    const match = this.source.slice(this.i).match(/^[A-Za-z_$][\w$]*/);
    if (!match)
      throw new Error(`Expected an object key at position ${this.i}.`);
    this.i += match[0].length;
    return match[0];
  }
  value(): unknown {
    this.ws();
    const c = this.source[this.i];
    if (c === "{") {
      this.i++;
      const obj: Document = {};
      while (this.peek() !== "}") {
        const key =
          this.peek() === '"' || this.peek() === "'"
            ? this.string()
            : this.identifier();
        this.consume(":");
        obj[key] = this.value();
        if (this.peek() === ",") {
          this.i++;
          if (this.peek() === "}") break;
        } else break;
      }
      this.consume("}");
      return obj;
    }
    if (c === "[") {
      this.i++;
      const arr: unknown[] = [];
      while (this.peek() !== "]") {
        arr.push(this.value());
        if (this.peek() === ",") {
          this.i++;
          if (this.peek() === "]") break;
        } else break;
      }
      this.consume("]");
      return arr;
    }
    if (c === '"' || c === "'") return this.string();
    if (c === "/") return this.regex();
    const rest = this.source.slice(this.i);
    const atom = rest.match(
      /^(?:-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|true|false|null|undefined)/,
    )?.[0];
    if (!atom)
      throw new Error(
        `Unsupported value at position ${this.i}. Use literals only.`,
      );
    this.i += atom.length;
    if (atom === "undefined") throw new Error("undefined is not supported.");
    return atom === "true"
      ? true
      : atom === "false"
        ? false
        : atom === "null"
          ? null
          : Number(atom);
  }
  get position() {
    return this.i;
  }
  set position(value: number) {
    this.i = value;
  }
  rest() {
    return this.source.slice(this.i).trim();
  }
}

function parseQuery(source: string): StudentQuery {
  const input = source.trim().replace(/;\s*$/, "");
  const head = input.match(
    /^db\.([A-Za-z0-9_-]+)\.(find|findOne|aggregate|countDocuments|distinct|insertOne|insertMany|updateOne|updateMany|deleteOne|deleteMany|createIndex)\s*\(/,
  );
  const createCollection = input.match(/^db\.createCollection\s*\(/);
  if (!head && !createCollection) {
    try {
      return JSON.parse(input) as StudentQuery;
    } catch {
      throw new Error(
        "Invalid query. Use db.collection.operation(...) with literal arguments.",
      );
    }
  }

  const operation = (
    createCollection ? "createCollection" : head![2]
  ) as Operation;
  const collection = createCollection ? "" : head![1];
  const parser = new LiteralParser(input);
  parser.position = (createCollection ? createCollection[0] : head![0]).length;
  const args: unknown[] = [];
  while (parser.rest().length && parser.rest()[0] !== ")") {
    args.push(parser.value());
    if (parser.rest().startsWith(","))
      parser.position += input.slice(parser.position).match(/^\s*,/)![0].length;
    else break;
  }
  const restBeforeClose = parser.rest();
  if (!restBeforeClose.startsWith(")"))
    throw new Error("Missing closing parenthesis.");
  parser.position += input.slice(parser.position).match(/^\s*\)/)![0].length;

  if (createCollection) {
    if (typeof args[0] !== "string")
      throw new Error("Collection name must be a string.");
    const query: StudentQuery = {
      collection: args[0],
      operation,
      collectionOptions: args[1] as Document | undefined,
    };
    if (parser.rest())
      throw new Error("Trailing query input is not supported.");
    return query;
  }

  const q: StudentQuery = { collection, operation };
  const arg = (n: number) => args[n] as Document | undefined;
  switch (operation) {
    case "aggregate":
      q.pipeline = arg(0) as Document[];
      break;
    case "distinct":
      q.field = args[0] as string;
      q.filter = arg(1);
      break;
    case "insertOne":
      q.document = arg(0);
      break;
    case "insertMany":
      q.documents = arg(0) as Document[];
      break;
    case "updateOne":
    case "updateMany":
      q.filter = arg(0);
      q.update = arg(1);
      break;
    case "deleteOne":
    case "deleteMany":
      q.filter = arg(0);
      break;
    case "createIndex":
      q.indexSpec = arg(0) as IndexSpecification;
      q.indexOptions = arg(1);
      break;
    default:
      q.filter = arg(0);
      if (operation === "find" || operation === "findOne")
        q.options = { projection: arg(1) };
  }

  if (operation === "find" || operation === "findOne") {
    let rest = parser.rest();
    while (rest) {
      const chain = rest.match(/^\.(sort|limit|skip)\s*\(/);
      if (!chain) throw new Error("Unsupported MongoDB method chain.");
      parser.position += input
        .slice(parser.position)
        .match(/^\s*\./)![0].length;
      parser.position += chain[1].length + 1;
      const value = parser.value();
      if (typeof value !== "object" || value === null) {
        if (
          (chain[1] === "limit" || chain[1] === "skip") &&
          typeof value !== "number"
        )
          throw new Error(`${chain[1]} requires a number.`);
      }
      const close = parser.rest();
      if (!close.startsWith(")"))
        throw new Error(`Invalid ${chain[1]} argument.`);
      parser.position += input
        .slice(parser.position)
        .match(/^\s*\)/)![0].length;
      q.options ??= {};
      if (chain[1] === "sort") q.options.sort = value as Document;
      if (chain[1] === "limit") q.options.limit = value as number;
      if (chain[1] === "skip") q.options.skip = value as number;
      rest = parser.rest();
    }
  } else if (parser.rest())
    throw new Error("Trailing query input is not supported.");

  return q;
}

// -------------------- NORMALIZATION / COMPARISON --------------------

function normalizeValue(value: unknown): unknown {
  if (value instanceof Date) return value.toISOString();
  if (value instanceof RegExp)
    return { $regex: value.source, $options: value.flags };
  if (Array.isArray(value)) return value.map(normalizeValue);
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if (typeof obj.toHexString === "function" && obj._bsontype === "ObjectId")
      return obj.toHexString();
    if (obj._bsontype === "Decimal128" || obj._bsontype === "Long")
      return String(value);
    if (Buffer.isBuffer(value)) return value.toString("base64");
    return Object.keys(obj)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = normalizeValue(obj[key]);
        return acc;
      }, {});
  }
  return value;
}

function stable(value: unknown): string {
  return JSON.stringify(normalizeValue(value));
}
function canonicalQuery(value: unknown, preserveKeyOrder = false): unknown {
  if (Array.isArray(value))
    return value.map((v) => canonicalQuery(v, preserveKeyOrder));
  if (!value || typeof value !== "object" || value instanceof RegExp)
    return normalizeValue(value);
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj);
  // Sort keys for semantic equality, except sort specifications where key order matters.
  const ordered = preserveKeyOrder ? keys : keys.sort();
  const result: Record<string, unknown> = {};
  for (const key of ordered)
    result[key] = canonicalQuery(obj[key], key === "$sort");
  return result;
}
function compareQuery(student: StudentQuery, solution: StudentQuery): boolean {
  const normalize = (q: StudentQuery) => {
    const copy: StudentQuery = {
      ...q,
      options: q.options ? { ...q.options } : undefined,
    };
    if (copy.operation === "find" || copy.operation === "findOne")
      copy.filter ??= {};
    return canonicalQuery(copy);
  };
  return stable(normalize(student)) === stable(normalize(solution));
}

function compareDocuments(
  actualRows: Record<string, unknown>[],
  expected: Extract<MongoExpectedOutput, { type: "documents" }>,
): { isCorrect: boolean; message: string } {
  const expectedRows = expected.documents as Record<string, unknown>[];
  if (actualRows.length !== expected.count) {
    return {
      isCorrect: false,
      message: `Expected ${expected.count} documents, but your query returned ${actualRows.length}.`,
    };
  }
  if (expectedRows.length !== expected.count) {
    return {
      isCorrect: false,
      message: `The expected output is incomplete: it declares ${expected.count} documents but contains ${expectedRows.length}. Add all expected documents or use a separate sample-output mode.`,
    };
  }

  const expectedHasId = expectedRows.some((row) => Object.hasOwn(row, "_id"));
  const clean = (row: Record<string, unknown>) => {
    const copy = { ...row };
    // MongoDB's automatically generated _id is ignored only when the answer schema omits it.
    if (!expectedHasId) delete copy._id;
    return normalizeValue(copy) as Record<string, unknown>;
  };
  const actual = actualRows.map(clean);
  const expectedNormalized = expectedRows.map(clean);
  const actualColumns = new Set(actual.flatMap((row) => Object.keys(row)));
  const expectedColumns = new Set(
    expectedNormalized.flatMap((row) => Object.keys(row)),
  );
  const missing = [...expectedColumns].filter((k) => !actualColumns.has(k));
  const extra = [...actualColumns].filter((k) => !expectedColumns.has(k));
  if (missing.length || extra.length) {
    return {
      isCorrect: false,
      message: [
        missing.length ? `Missing columns: ${missing.join(", ")}.` : "",
        extra.length ? `Unexpected columns: ${extra.join(", ")}.` : "",
      ]
        .filter(Boolean)
        .join(" "),
    };
  }

  // Treat result order as irrelevant here. Questions that require ordering should encode
  // the sort in their solution and/or use an explicit order-sensitive expectation mode.
  const actualSorted = actual.map(stable).sort();
  const expectedSorted = expectedNormalized.map(stable).sort();
  for (let i = 0; i < expectedSorted.length; i++) {
    if (actualSorted[i] !== expectedSorted[i]) {
      return {
        isCorrect: false,
        message: `Your query returned ${actualRows.length} documents, but the document contents do not match the expected output (first mismatch at sorted row ${i + 1}).`,
      };
    }
  }
  return {
    isCorrect: true,
    message:
      "Correct answer! All documents and columns match the expected output.",
  };
}

function compareOutput(
  actualRows: Record<string, unknown>[],
  rowsAffected: number,
  expected: MongoExpectedOutputWithValue,
): { isCorrect: boolean; message: string } {
  if (expected.type === "documents")
    return compareDocuments(actualRows, expected);
  if (expected.type === "value") {
    const actualValue =
      actualRows[0]?.count ?? actualRows[0]?.value ?? actualRows[0];
    const isCorrect = stable(actualValue) === stable(expected.value);
    return {
      isCorrect,
      message: isCorrect
        ? "Correct answer! The returned value matches."
        : `Expected value ${JSON.stringify(expected.value)}, received ${JSON.stringify(actualValue)}.`,
    };
  }
  if (expected.type === "write") {
    const result = actualRows[0] ?? {};
    const checks: [string, unknown, unknown][] = [
      ["acknowledged", expected.acknowledged, result.acknowledged],
      ["insertedCount", expected.insertedCount, rowsAffected],
      ["deletedCount", expected.deletedCount, result.deletedCount],
      ["modifiedCount", expected.modifiedCount, result.modifiedCount],
      ["matchedCount", expected.matchedCount, result.matchedCount],
    ];
    const failures = checks.filter(
      ([, wanted, actual]) =>
        wanted !== undefined && stable(actual) !== stable(wanted),
    );
    return {
      isCorrect: failures.length === 0,
      message: failures.length
        ? "Incorrect write result. One or more operation counts do not match the expected output."
        : "Correct answer! Your write operation produced the expected result.",
    };
  }
  return { isCorrect: false, message: "Unsupported expected output type." };
}

// -------------------- VALIDATION --------------------

function validateQuery(query: StudentQuery) {
  if (
    query.operation !== "createCollection" &&
    !/^[A-Za-z0-9_-]+$/.test(query.collection)
  )
    throw new Error("Invalid collection name.");
  if (query.operation === "aggregate" && !Array.isArray(query.pipeline))
    throw new Error("Aggregation pipeline must be an array.");
  if (
    query.options?.limit !== undefined &&
    (!Number.isInteger(query.options.limit) ||
      query.options.limit < 1 ||
      query.options.limit > MAX_ROWS)
  )
    throw new Error(`Limit must be between 1 and ${MAX_ROWS}.`);
  if (
    query.options?.skip !== undefined &&
    (!Number.isInteger(query.options.skip) || query.options.skip < 0)
  )
    throw new Error("Skip must be a non-negative integer.");
  const forbidden = new Set([
    "$where",
    "$function",
    "$accumulator",
    "$out",
    "$merge",
  ]);
  const inspect = (value: unknown): void => {
    if (Array.isArray(value)) return value.forEach(inspect);
    if (!value || typeof value !== "object") return;
    for (const [key, child] of Object.entries(value)) {
      if (forbidden.has(key))
        throw new Error(`Unsupported MongoDB operator: ${key}`);
      inspect(child);
    }
  };
  inspect(query);
}

// -------------------- DATABASE ISOLATION --------------------

async function cloneMasterDatabase(masterDb: Db, temporaryDb: Db) {
  const collections = await masterDb
    .listCollections({}, { nameOnly: false })
    .toArray();

  for (const info of collections) {
    if (info.type !== "collection" || info.name.startsWith("system.")) {
      continue;
    }

    const source = masterDb.collection(info.name);
    const target = temporaryDb.collection(info.name);

    // Ensure the temporary collection is empty before cloning.
    await target.deleteMany({});

    // Copy documents from the master collection.
    const docs = await source.find({}).toArray();

    for (let i = 0; i < docs.length; i += 500) {
      await target.insertMany(docs.slice(i, i + 500), {
        ordered: true,
      });
    }

    // Copy indexes except the default _id index.
    const indexes = (await source.indexes())
      .filter((index) => index.name !== "_id_")
      .map((index) => {
        const { key, name, ns, v, ...options } = index;
        return { key, name, ...options };
      });

    if (indexes.length) {
      await target.createIndexes(
        indexes as Parameters<typeof target.createIndexes>[0],
      );
    }

    console.log(`Cloned ${info.name}: ${docs.length} documents`);
  }
}

// -------------------- EXECUTION --------------------

async function executeStudentQuery(
  database: Db,
  query: StudentQuery,
): Promise<MongoQueryResult> {
  const collection = query.collection
    ? database.collection(query.collection)
    : null;
  let rows: Record<string, unknown>[] = [];
  let rowsAffected = 0;

  switch (query.operation) {
    case "find": {
      rows = await collection!
        .find(query.filter ?? {}, {
          projection: query.options?.projection,
          maxTimeMS: QUERY_TIMEOUT,
        })
        .sort(query.options?.sort ?? {})
        .skip(query.options?.skip ?? 0)
        .limit(query.options?.limit ?? MAX_ROWS)
        .toArray();
      break;
    }
    case "findOne": {
      const doc = await collection!.findOne(query.filter ?? {}, {
        projection: query.options?.projection,
        sort: query.options?.sort,
        maxTimeMS: QUERY_TIMEOUT,
      });
      rows = doc ? [doc] : [];
      break;
    }
    case "aggregate":
      rows = await collection!
        .aggregate(query.pipeline ?? [], {
          maxTimeMS: QUERY_TIMEOUT,
          allowDiskUse: false,
        })
        .limit(MAX_ROWS)
        .toArray();
      break;
    case "countDocuments":
      rows = [
        {
          count: await collection!.countDocuments(query.filter ?? {}, {
            maxTimeMS: QUERY_TIMEOUT,
          }),
        },
      ];
      break;
    case "distinct": {
      if (!query.field) throw new Error("Field is required for distinct.");
      rows = (
        await collection!.distinct(query.field, query.filter ?? {}, {
          maxTimeMS: QUERY_TIMEOUT,
        })
      )
        .slice(0, MAX_ROWS)
        .map((value) => ({ value }));
      break;
    }
    case "insertOne": {
      if (!query.document)
        throw new Error("Document is required for insertOne.");
      const r = await collection!.insertOne(query.document);
      rowsAffected = r.acknowledged ? 1 : 0;
      rows = [
        {
          acknowledged: r.acknowledged,
          insertedId: r.insertedId,
          insertedCount: 1,
        },
      ];
      break;
    }
    case "insertMany": {
      if (!query.documents?.length)
        throw new Error("Documents are required for insertMany.");
      if (query.documents.length > MAX_ROWS)
        throw new Error(`You can insert at most ${MAX_ROWS} documents.`);
      const r = await collection!.insertMany(query.documents);
      rowsAffected = r.insertedCount;
      rows = [
        {
          acknowledged: r.acknowledged,
          insertedCount: r.insertedCount,
          insertedIds: r.insertedIds,
        },
      ];
      break;
    }
    case "updateOne":
    case "updateMany": {
      if (!query.update) throw new Error("Update document is required.");
      const r =
        query.operation === "updateOne"
          ? await collection!.updateOne(query.filter ?? {}, query.update, {
              maxTimeMS: QUERY_TIMEOUT,
            })
          : await collection!.updateMany(query.filter ?? {}, query.update, {
              maxTimeMS: QUERY_TIMEOUT,
            });
      rowsAffected = r.modifiedCount;
      rows = [
        {
          matchedCount: r.matchedCount,
          modifiedCount: r.modifiedCount,
          acknowledged: r.acknowledged,
        },
      ];
      break;
    }
    case "deleteOne":
    case "deleteMany": {
      const r =
        query.operation === "deleteOne"
          ? await collection!.deleteOne(query.filter ?? {}, {
              maxTimeMS: QUERY_TIMEOUT,
            })
          : await collection!.deleteMany(query.filter ?? {}, {
              maxTimeMS: QUERY_TIMEOUT,
            });
      rowsAffected = r.deletedCount;
      rows = [{ deletedCount: r.deletedCount, acknowledged: r.acknowledged }];
      break;
    }
    case "createIndex": {
      if (!query.indexSpec) throw new Error("Index specification is required.");
      const name = await collection!.createIndex(
        query.indexSpec,
        query.indexOptions ?? {},
      );
      rows = [{ value: name }];
      rowsAffected = 1;
      break;
    }
    case "createCollection": {
      // The master dataset may already contain this collection. The attempt database
      // is isolated, so recreate it to let the schema-validation exercise run.
      if (
        await database
          .listCollections({ name: query.collection }, { nameOnly: true })
          .hasNext()
      ) {
        await database.collection(query.collection).drop();
      }
      await database.createCollection(
        query.collection,
        query.collectionOptions ?? {},
      );
      rows = [{ ok: 1 }];
      rowsAffected = 1;
      break;
    }
  }

  rows = normalizeValue(rows) as Record<string, unknown>[];
  return {
    columns: [...new Set(rows.flatMap((row) => Object.keys(row)))],
    rows,
    rowCount: rows.length,
    rowsAffected,
  };
}

// -------------------- MAIN EVALUATION --------------------

export const evaluateMongo = async (
  studentQuery: string,
  question: MongoQuestion,
): Promise<EvaluateResult> => {
  const databaseName = `attempt_${randomUUID().replaceAll("-", "")}`;
  let temporaryDb: Db | null = null;
  const failed = (message: string): EvaluateResult => ({
    isCorrect: false,
    score: 0,
    totalPoints: question.points,
    matchType: "none",
    message,
    result: null,
  });

  try {
    if (!question.solution_query)
      return failed("Question solution query is missing.");
    if (!question.expected_output)
      return failed("Question expected output is missing.");
    if (!studentQuery.trim()) return failed("Please enter a MongoDB query.");

    const expected =
      typeof question.expected_output === "string"
        ? (JSON.parse(question.expected_output) as MongoExpectedOutputWithValue)
        : question.expected_output;
    const student = parseQuery(studentQuery);
    const solution = parseQuery(question.solution_query);
    validateQuery(student);
    validateQuery(solution);

    await mongooseDb.asPromise();
    const client = mongooseDb.getClient();
    const masterDb = mongooseDb.db;
    if (!masterDb)
      return failed("Master MongoDB database connection not found.");
    temporaryDb = client.db(databaseName);
    await cloneMasterDatabase(masterDb, temporaryDb);
    // st
    temporaryDb = client.db(databaseName);

    console.log("\n========== SOURCE DATABASE ==========");
    console.log("Connected database:", masterDb.databaseName);
    console.log("Temporary database:", temporaryDb.databaseName);
    console.log("MongoDB URI configured:", !!process.env.MONGODB_URI);

    const sourceCollections = await masterDb
      .listCollections({}, { nameOnly: true })
      .toArray();

    for (const collection of sourceCollections) {
      const count = await masterDb.collection(collection.name).countDocuments();

      console.log(`SOURCE ${collection.name}: ${count}`);
    }

    console.log("========== CLONING DATABASE ==========");

    await cloneMasterDatabase(masterDb, temporaryDb);

    console.log("========== CLONE COMPLETED ==========");

    const temporaryCollections = await temporaryDb
      .listCollections({}, { nameOnly: true })
      .toArray();

    for (const collection of temporaryCollections) {
      const count = await temporaryDb
        .collection(collection.name)
        .countDocuments();

      console.log(`TEMP ${collection.name}: ${count}`);
    }

    console.log("======================================");
    const actual = await executeStudentQuery(temporaryDb, student);
    if (compareQuery(student, solution)) {
      return {
        isCorrect: true,
        score: question.points,
        totalPoints: question.points,
        matchType: "query",
        message: "Correct answer! Your query matches the solution.",
        result: actual,
      };
    }
    const comparison = compareOutput(
      actual.rows,
      actual.rowsAffected,
      expected,
    );
    return {
      isCorrect: comparison.isCorrect,
      score: comparison.isCorrect ? question.points : 0,
      totalPoints: question.points,
      matchType: comparison.isCorrect ? "output" : "none",
      message: comparison.isCorrect
        ? "Correct answer! Your query is different from the solution, but it produces the expected output."
        : comparison.message,
      result: actual,
    };
  } catch (error) {
    console.error("MongoDB Evaluation Error:", error);
    return failed(
      error instanceof Error ? error.message : "MongoDB execution failed.",
    );
  } finally {
    if (temporaryDb)
      await temporaryDb
        .dropDatabase()
        .catch((error) =>
          console.error("Failed to drop temporary MongoDB database:", error),
        );
  }
};
