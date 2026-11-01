import type { QueryResult, CellValue } from "@/components/labs/testCase";

type QueryPayload = {
  columns: string[];
  rows: (Record<string, unknown> | unknown[])[];
  rowCount?: number;
  rowsAffected?: number;
};

const normalizeCell = (value: unknown): CellValue => {
  if (value === null || value === undefined) return null;

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (value instanceof Date) return value.toISOString();

  if (typeof value === "bigint") return value.toString();

  if (Array.isArray(value)) {
    return value.map(normalizeCell);
  }

  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [key, normalizeCell(val)]),
    );
  }

  return String(value);
};

export function toQueryResult(
  result: QueryPayload | null | undefined,
  message: string,
  evaluation?: QueryResult["evaluation"],
  preserveObjects = false,
): QueryResult {
  if (!result) {
    return {
      columns: [],
      rows: [],
      error: message || "Execution returned no result.",
      evaluation,
    };
  }

  const rows: QueryResult["rows"] = result.rows.map((row) => {
    if (Array.isArray(row)) {
      return row.map(normalizeCell);
    }

    if (preserveObjects) {
      return Object.fromEntries(
        Object.entries(row).map(([key, value]) => [key, normalizeCell(value)]),
      );
    }

    return result.columns.map((column) => normalizeCell(row[column]));
  });

  return {
    columns: result.columns ?? [],
    rows,
    rowCount: result.rowCount,
    rowsAffected: result.rowsAffected,
    evaluation,
  };
}
