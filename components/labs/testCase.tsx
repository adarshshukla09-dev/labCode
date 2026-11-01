"use client";

import {
  Database,
  Terminal,
  Clock3,
  Loader2,
  XCircle,
  CheckCircle2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { LabSlug } from "@/lib/labs/lab-config";

export type CellValue =
  | string
  | number
  | boolean
  | null
  | Record<string, unknown>
  | unknown[];

export interface EvaluationResult {
  isCorrect: boolean;
  score: number;
  totalPoints: number;
  matchType: string;
  message: string;
}

export interface QueryResult {
  columns: string[];
  rows: (CellValue[] | Record<string, unknown>)[];
  rowCount?: number;
  rowsAffected?: number;
  executionTime?: number;
  error?: string;
  evaluation?: EvaluationResult;
}

interface QueryResultProps {
  queryResult?: QueryResult | null;
  isRunning?: boolean;
  lab?: LabSlug | string;
}

function EmptyState({
  icon,
  title,
  description,
  evaluation,
  isCorrect,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  evaluation?: EvaluationResult;
  isCorrect?: boolean;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
      <div className="rounded-xl border bg-muted/50 p-3 text-muted-foreground">
        {icon}
      </div>

      <p className="text-sm font-semibold">{title}</p>

      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>

      {evaluation && !isCorrect && (
        <Badge
          variant="outline"
          className="border-destructive text-destructive mt-1"
        >
          Incorrect Answer
        </Badge>
      )}
    </div>
  );
}

export default function QueryResultPanel({
  queryResult = null,
  isRunning = false,
  lab = "sql",
}: QueryResultProps) {
  const technology = lab === "mongodb" ? "MongoDB" : "SQL";
  const evaluation = queryResult?.evaluation;
  const isCorrect = evaluation?.isCorrect;

  const rows = queryResult?.rows ?? [];

  const getDisplayValue = (value: unknown): string => {
    if (value === null || value === undefined) {
      return "NULL";
    }

    if (typeof value === "object") {
      return JSON.stringify(value, null, 2);
    }

    return String(value);
  };

  const getCellValue = (
    row: CellValue[] | Record<string, unknown>,
    column: string,
    index: number,
  ): unknown => {
    if (Array.isArray(row)) {
      return row[index] ?? null;
    }

    return row[column] ?? null;
  };

  const resultTheme = evaluation
    ? isCorrect
      ? {
          container: "border-emerald-500/50 bg-emerald-500/[0.03]",
          badge: "border-emerald-500 text-emerald-600",
          row: "bg-emerald-500/[0.04] hover:bg-emerald-500/10",
          status: "text-emerald-600",
        }
      : {
          container: "border-destructive/50 bg-destructive/[0.03]",
          badge: "border-destructive text-destructive",
          row: "bg-destructive/[0.04] hover:bg-destructive/10",
          status: "text-destructive",
        }
    : {
        container: "border-border bg-card",
        badge: "",
        row: "",
        status: "",
      };

  return (
    <section
      className={`flex h-full min-h-[300px] flex-col overflow-hidden rounded-xl border shadow-sm ${resultTheme.container}`}
    >
      {/* Header */}
      <div className="flex min-h-12 items-center justify-between border-b bg-muted/30 px-4">
        <div className="flex items-center gap-2">
          <Database className="size-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Query Result</h3>
        </div>

        {isRunning ? (
          <Badge variant="outline">
            <Loader2 className="mr-1 size-3 animate-spin" />
            Running
          </Badge>
        ) : evaluation ? (
          <Badge variant="outline" className={resultTheme.badge}>
            {isCorrect ? (
              <CheckCircle2 className="mr-1 size-3" />
            ) : (
              <XCircle className="mr-1 size-3" />
            )}
            {isCorrect ? "Correct" : "Incorrect"}
          </Badge>
        ) : queryResult && !queryResult.error ? (
          <Badge variant="outline">Executed</Badge>
        ) : null}
      </div>

      {/* Loading */}
      {isRunning ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="size-7 animate-spin text-primary" />
          <p className="font-medium text-foreground">
            Executing {technology} query...
          </p>
          <p>Please wait while your query is processed.</p>
        </div>
      ) : queryResult?.error && !queryResult.rows.length ? (
        <div className="flex-1 p-4 sm:p-5">
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-destructive">
              <XCircle className="size-4" />
              {technology} Execution Error
            </div>

            <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-6 text-destructive/90">
              {queryResult.error}
            </pre>
          </div>
        </div>
      ) : queryResult ? (
        <div className="flex min-h-0 flex-1 flex-col">
          {/* Evaluation Message */}
          {evaluation && (
            <div
              className={`mx-4 mt-4 rounded-lg border p-3 ${
                isCorrect
                  ? "border-emerald-500/30 bg-emerald-500/10"
                  : "border-destructive/30 bg-destructive/10"
              }`}
            >
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <CheckCircle2 className="size-4 text-emerald-600" />
                ) : (
                  <XCircle className="size-4 text-destructive" />
                )}

                <p
                  className={`text-sm font-medium ${
                    isCorrect
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-destructive"
                  }`}
                >
                  {evaluation.message}
                </p>
              </div>
            </div>
          )}

          {/* Query Metadata */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <Database className="size-3.5" />
              {rows.length} {rows.length === 1 ? "row" : "rows"} returned
            </span>

            {queryResult.rowsAffected !== undefined &&
              queryResult.rowsAffected > 0 && (
                <span>
                  {queryResult.rowsAffected}{" "}
                  {queryResult.rowsAffected === 1 ? "document" : "documents"}{" "}
                  affected
                </span>
              )}

            {queryResult.executionTime !== undefined && (
              <span className="flex items-center gap-2">
                <Clock3 className="size-3.5" />
                {queryResult.executionTime} ms
              </span>
            )}
          </div>

          {/* Actual SQL / MongoDB Output */}
          {queryResult.columns.length > 0 && rows.length > 0 ? (
            <ScrollArea className="min-h-0 w-full flex-1">
              <div className="min-w-full">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      {queryResult.columns.map((column, index) => (
                        <TableHead
                          key={`${column}-${index}`}
                          className="whitespace-nowrap font-semibold text-foreground"
                        >
                          {column}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {rows.map((row, rowIndex) => (
                      <TableRow key={rowIndex} className={resultTheme.row}>
                        {queryResult.columns.map((column, columnIndex) => {
                          const value = getCellValue(row, column, columnIndex);

                          return (
                            <TableCell
                              key={`${column}-${columnIndex}`}
                              className="max-w-[350px] whitespace-pre-wrap break-words font-mono text-xs"
                            >
                              {value === null || value === undefined ? (
                                <span className="italic text-muted-foreground">
                                  NULL
                                </span>
                              ) : (
                                getDisplayValue(value)
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
          ) : (
            <EmptyState
              icon={<Database className="size-6" />}
              title={
                lab === "mongodb"
                  ? "0 documents returned"
                  : "Query returned no rows"
              }
              description={
                lab === "mongodb"
                  ? "Your query executed successfully, but the collection or filter returned no documents."
                  : "The query executed successfully, but no records matched."
              }
              evaluation={evaluation}
              isCorrect={isCorrect}
            />
          )}
        </div>
      ) : (
        <EmptyState
          icon={<Terminal className="size-6" />}
          title="No query results yet"
          description={`Run your ${technology} query to see the execution results here.`}
        />
      )}
    </section>
  );
}
