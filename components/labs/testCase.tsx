"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Circle,
  Clock3,
  Database,
  Terminal,
  FlaskConical,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export interface TestCase {
  id: number;
  name: string;
  status: "passed" | "failed" | "pending";
  expected?: string;
  actual?: string;
  message?: string;
}

export interface QueryResult {
  columns: string[];
  rows: (string | number | boolean | null)[][];
  executionTime?: number;
  error?: string;
}

interface TestCaseResultsProps {
  testCases?: TestCase[];
  queryResult?: QueryResult | null;
  isRunning?: boolean;
}

const defaultTestCases: TestCase[] = [
  { id: 1, name: "Test Case 1", status: "pending" },
  { id: 2, name: "Test Case 2", status: "pending" },
  { id: 3, name: "Test Case 3", status: "pending" },
];

function StatusIcon({ status }: { status: TestCase["status"] }) {
  if (status === "passed") {
    return (
      <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
    );
  }

  if (status === "failed") {
    return (
      <XCircle className="size-4 shrink-0 text-destructive" />
    );
  }

  return (
    <Circle className="size-4 shrink-0 text-muted-foreground" />
  );
}

function StatusBadge({ status }: { status: TestCase["status"] }) {
  if (status === "passed") {
    return (
      <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
        Passed
      </Badge>
    );
  }

  if (status === "failed") {
    return <Badge variant="destructive">Failed</Badge>;
  }

  return <Badge variant="secondary">Pending</Badge>;
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center gap-2 p-6 text-center">
      <div className="mb-1 rounded-xl border bg-muted/50 p-3 text-muted-foreground">
        {icon}
      </div>

      <p className="text-sm font-medium">{title}</p>

      <p className="max-w-xs text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

export default function TestCaseResults({
  testCases = defaultTestCases,
  queryResult = null,
  isRunning = false,
}: TestCaseResultsProps) {
  const [activeTab, setActiveTab] = useState("testcases");
  const [selectedTestCase, setSelectedTestCase] = useState<number | null>(
    testCases[0]?.id ?? null
  );

  useEffect(() => {
    if (!testCases.some((tc) => tc.id === selectedTestCase)) {
      setSelectedTestCase(testCases[0]?.id ?? null);
    }
  }, [testCases, selectedTestCase]);

  const passedCount = testCases.filter(
    (tc) => tc.status === "passed"
  ).length;

  const failedCount = testCases.filter(
    (tc) => tc.status === "failed"
  ).length;

  const selectedCase = testCases.find(
    (tc) => tc.id === selectedTestCase
  );

  const totalCount = testCases.length;
  const allCompleted =
    totalCount > 0 &&
    testCases.every((tc) => tc.status !== "pending");

  const getDisplayValue = (
    value: string | number | boolean | null
  ) => {
    if (value === null) return "NULL";
    if (typeof value === "boolean") return String(value);
    return String(value);
  };

  return (
    <section className="flex h-full min-h-[300px] flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex min-h-0 flex-1 flex-col gap-0"
      >
        {/* Header */}
        <div className="flex min-h-12 flex-wrap items-center justify-between gap-3 border-b bg-muted/30 px-3 sm:px-4">
          <TabsList className="h-11 rounded-none bg-transparent p-0">
            <TabsTrigger
              value="testcases"
              className="h-11 gap-2 rounded-none border-b-2 border-transparent px-3 text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              <FlaskConical className="size-4" />
              Test Cases

              {totalCount > 0 && (
                <span className="ml-1 rounded-md bg-muted px-1.5 py-0.5 text-xs">
                  {totalCount}
                </span>
              )}
            </TabsTrigger>

            <TabsTrigger
              value="output"
              className="h-11 gap-2 rounded-none border-b-2 border-transparent px-3 text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              <Terminal className="size-4" />
              Output
            </TabsTrigger>
          </TabsList>

          {/* Summary */}
          {activeTab === "testcases" && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-3.5" />
                {passedCount} passed
              </span>

              <span className="flex items-center gap-1.5 text-destructive">
                <XCircle className="size-3.5" />
                {failedCount} failed
              </span>
            </div>
          )}

          {activeTab === "output" && queryResult && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Database className="size-3.5" />
              {queryResult.rows.length} rows
            </div>
          )}
        </div>

        {/* Test Cases */}
        <TabsContent
          value="testcases"
          className="mt-0 min-h-0 flex-1 focus-visible:outline-none"
        >
          {isRunning ? (
            <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
              <Loader2 className="size-6 animate-spin text-primary" />
              <p className="font-medium text-foreground">
                Running test cases...
              </p>
              <p>Executing your SQL query and checking results.</p>
            </div>
          ) : testCases.length === 0 ? (
            <EmptyState
              icon={<FlaskConical className="size-6" />}
              title="No test cases available"
              description="Test cases will appear here when they are configured for this SQL exercise."
            />
          ) : (
            <div className="grid min-h-[240px] grid-cols-1 md:grid-cols-[210px_minmax(0,1fr)]">
              {/* Test case sidebar */}
              <ScrollArea className="border-b md:border-b-0 md:border-r">
                <div className="p-2">
                  <p className="px-2 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Test suite
                  </p>

                  {testCases.map((tc, index) => {
                    const isSelected = selectedTestCase === tc.id;

                    return (
                      <button
                        key={tc.id}
                        type="button"
                        onClick={() => setSelectedTestCase(tc.id)}
                        className={`mb-1 flex w-full items-center gap-2.5 rounded-lg px-3 py-3 text-left transition-colors ${
                          isSelected
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                        }`}
                      >
                        <StatusIcon status={tc.status} />

                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium">
                            {tc.name}
                          </span>

                          <span className="mt-0.5 block text-xs text-muted-foreground">
                            Case {index + 1}
                          </span>
                        </span>

                        {isSelected && (
                          <span className="size-1.5 rounded-full bg-primary" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>

              {/* Selected test case details */}
              <ScrollArea className="min-w-0">
                {selectedCase ? (
                  <div className="space-y-5 p-4 sm:p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <StatusIcon status={selectedCase.status} />

                        <h3 className="text-sm font-semibold">
                          {selectedCase.name}
                        </h3>
                      </div>

                      <StatusBadge status={selectedCase.status} />
                    </div>

                    <Separator />

                    {selectedCase.message && (
                      <div
                        className={`flex gap-2 rounded-lg border p-3 text-sm ${
                          selectedCase.status === "failed"
                            ? "border-destructive/20 bg-destructive/5 text-destructive"
                            : "bg-muted/40 text-muted-foreground"
                        }`}
                      >
                        <AlertCircle className="mt-0.5 size-4 shrink-0" />

                        <p className="whitespace-pre-wrap break-words">
                          {selectedCase.message}
                        </p>
                      </div>
                    )}

                    {selectedCase.expected !== undefined && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Expected output
                        </p>

                        <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-lg border bg-muted/30 p-3 font-mono text-xs leading-6">
                          {selectedCase.expected}
                        </pre>
                      </div>
                    )}

                    {selectedCase.actual !== undefined && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Actual output
                        </p>

                        <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-lg border bg-muted/30 p-3 font-mono text-xs leading-6">
                          {selectedCase.actual}
                        </pre>
                      </div>
                    )}

                    {selectedCase.expected === undefined &&
                      selectedCase.actual === undefined &&
                      !selectedCase.message && (
                        <EmptyState
                          icon={<Clock3 className="size-6" />}
                          title={
                            selectedCase.status === "pending"
                              ? "Waiting for execution"
                              : "No additional details"
                          }
                          description={
                            selectedCase.status === "pending"
                              ? "Run your SQL query to see this test case's results."
                              : "There are no additional details for this test case."
                          }
                        />
                      )}
                  </div>
                ) : (
                  <EmptyState
                    icon={<FlaskConical className="size-6" />}
                    title="Select a test case"
                    description="Choose a test case from the sidebar to inspect its results."
                  />
                )}
              </ScrollArea>
            </div>
          )}

          {/* Optional test summary footer */}
          {!isRunning && allCompleted && (
            <div className="flex flex-wrap items-center justify-between gap-2 border-t bg-muted/20 px-4 py-3 text-xs">
              <span className="text-muted-foreground">
                {passedCount} of {totalCount} test cases passed
              </span>

              <Badge
                variant={failedCount === 0 ? "default" : "destructive"}
              >
                {failedCount === 0 ? "All tests passed" : "Tests failed"}
              </Badge>
            </div>
          )}
        </TabsContent>

        {/* SQL Output */}
        <TabsContent
          value="output"
          className="mt-0 min-h-0 flex-1 focus-visible:outline-none"
        >
          {isRunning ? (
            <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
              <Loader2 className="size-6 animate-spin text-primary" />
              <p>Executing SQL query...</p>
            </div>
          ) : queryResult?.error ? (
            <div className="p-4 sm:p-5">
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-destructive">
                  <XCircle className="size-4" />
                  SQL Execution Error
                </div>

                <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-6 text-destructive/90">
                  {queryResult.error}
                </pre>
              </div>
            </div>
          ) : queryResult ? (
            <div className="flex min-h-[240px] flex-col">
              {/* Output metadata */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b bg-muted/20 px-4 py-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Database className="size-3.5" />

                  <span>
                    {queryResult.rows.length}{" "}
                    {queryResult.rows.length === 1 ? "row" : "rows"} returned
                  </span>
                </span>

                {queryResult.executionTime !== undefined && (
                  <span className="flex items-center gap-2">
                    <Clock3 className="size-3.5" />
                    {queryResult.executionTime} ms
                  </span>
                )}

                <Badge variant="outline" className="font-normal">
                  Success
                </Badge>
              </div>

              {queryResult.columns.length > 0 ? (
                queryResult.rows.length > 0 ? (
                  <ScrollArea className="max-h-[400px] w-full">
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
                          {queryResult.rows.map((row, rowIndex) => (
                            <TableRow key={rowIndex}>
                              {queryResult.columns.map((_, columnIndex) => {
                                const value = row[columnIndex] ?? null;

                                return (
                                  <TableCell
                                    key={columnIndex}
                                    className="whitespace-nowrap font-mono text-xs"
                                  >
                                    {value === null ? (
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
                    title="Query returned no rows"
                    description="The query executed successfully, but no records matched."
                  />
                )
              ) : (
                <EmptyState
                  icon={<CheckCircle2 className="size-6" />}
                  title="Query executed successfully"
                  description="This statement did not return a result set."
                />
              )}
            </div>
          ) : (
            <EmptyState
              icon={<Terminal className="size-6" />}
              title="No output yet"
              description="Run your SQL query to see the result table here."
            />
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
}