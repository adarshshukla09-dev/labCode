"use client";

import { useState } from "react";
import Sidebar from "@/components/labs/sidebar";
import QuestionSection, { Question } from "@/components/labs/question-list";
import ResizableWorkspace from "@/components/blocks/resizeWorkspace";
import { TestCase, QueryResult } from "@/components/labs/testCase";

// Sample question data
const sampleQuestion: Question = {
  id: 1,
  title: "Retrieve All Active Users",
  description: "Write a SQL query to fetch all users from the users table who have an 'active' status.",
  context: "You are working with an e-commerce database containing customer details, orders, and logs.",
  task: "Select all columns from the users table where status is equal to 'active'.",
  hint: "Use the WHERE clause with the condition status = 'active'.",
  difficulty: "Easy",
};

// Sample initial test cases
const initialTestCases: TestCase[] = [
  { id: 1, name: "Returns only active users", status: "pending" },
  { id: 2, name: "Handles case sensitivity correctly", status: "pending" },
  { id: 3, name: "Returns correct columns", status: "pending" },
];

export default function SQLABPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [testCases, setTestCases] = useState<TestCase[]>(initialTestCases);
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);

  // Handler triggered when the user clicks "Run Query" or presses Ctrl + Enter
  const handleRunQuery = async (query: string) => {
    setIsRunning(true);

    // Simulate backend query execution and test evaluation delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Example logic simulating results based on query content
    if (query.toLowerCase().includes("select")) {
      setQueryResult({
        columns: ["id", "name", "email", "status"],
        rows: [
          [1, "Alice Smith", "alice@example.com", "active"],
          [2, "Bob Jones", "bob@example.com", "active"],
        ],
        executionTime: 45,
      });

      setTestCases([
        { id: 1, name: "Returns only active users", status: "passed", expected: "2 rows", actual: "2 rows" },
        { id: 2, name: "Handles case sensitivity correctly", status: "passed", expected: "Match", actual: "Match" },
        { id: 3, name: "Returns correct columns", status: "passed", expected: "4 columns", actual: "4 columns" },
      ]);
    } else {
      setQueryResult({
        columns: [],
        rows: [],
        error: "Syntax error near unexpected token.",
      });

      setTestCases([
        { id: 1, name: "Returns only active users", status: "failed", message: "Query failed to execute." },
        { id: 2, name: "Handles case sensitivity correctly", status: "pending" },
        { id: 3, name: "Returns correct columns", status: "pending" },
      ]);
    }

    setIsRunning(false);
  };

return (
  <div className="flex h-screen w-full gap-3 overflow-hidden bg-background p-3 text-foreground">
    {/* Sidebar */}
    <Sidebar />

    {/* Main Workspace */}
    <main className="grid min-h-0 min-w-0 flex-1 grid-cols-1 gap-3 overflow-hidden lg:grid-cols-2">

      {/* Left Column: Question Section */}
      <div className="flex min-h-0 min-w-0 flex-col overflow-hidden">
        <QuestionSection question={sampleQuestion} />
      </div>

      {/* Right Column: Editor & Results */}
      <div className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-background">
        <ResizableWorkspace
          initialQuery={"-- Write your SQL query here\nSELECT * FROM users WHERE status = 'active';"}
          onRunQuery={handleRunQuery}
          isRunning={isRunning}
          testCases={testCases}
          queryResult={queryResult}
        />
      </div>

    </main>
  </div>
);
}