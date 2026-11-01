"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import type { editor as MonacoEditor } from "monaco-editor";

interface CodeEditorProps {
  initialQuery?: string;
  onRunQuery?: (query: string) => void | Promise<void>;
  isRunning?: boolean;
}

export default function CodeEditor({
  initialQuery = "-- Write your SQL query here\nSELECT * FROM users;",
  onRunQuery,
  isRunning: externalIsRunning,
}: CodeEditorProps) {
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
    setError("");
  }, [initialQuery]);
  const [internalIsRunning, setInternalIsRunning] = useState(false);
  const [error, setError] = useState("");

  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);

  const isRunning = externalIsRunning ?? internalIsRunning;

  const executeQuery = useCallback(async () => {
    if (!query.trim() || isRunning) return;

    if (!onRunQuery) {
      setError("Connect the query execution handler to run SQL.");
      return;
    }

    setError("");
    setInternalIsRunning(true);

    try {
      await onRunQuery(query);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to execute query.");
    } finally {
      setInternalIsRunning(false);
    }
  }, [query, isRunning, onRunQuery]);

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;

    // Ctrl + Enter / Cmd + Enter
    editor.addCommand(2048 | 3, () => {
      void executeQuery();
    });
  };

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden bg-card text-card-foreground border border-border rounded-xl">
      {/* Toolbar */}
      <header className="flex min-h-[52px] items-center justify-between gap-3 border-b border-border px-4 py-2 bg-muted/40">
        <div className="flex items-center gap-2">
          <svg
            className="h-4 w-4 text-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              d="m8 5-7 7 7 7M16 5l7 7-7 7M14 3l-4 18"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span className="text-sm font-semibold text-foreground font-heading">
            SQL Query Editor
          </span>
        </div>

        <button
          type="button"
          onClick={() => void executeQuery()}
          disabled={isRunning || !query.trim()}
          className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRunning ? (
            <>
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="3"
                  opacity=".25"
                />
                <path
                  d="M21 12a9 9 0 0 0-9-9"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              Running...
            </>
          ) : (
            <>
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="m8 5 12 7-12 7V5Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Run Query
            </>
          )}
        </button>
      </header>

      {/* Editor */}
      <div className="min-h-0 flex-1">
        <Editor
          height="100%"
          width="100%"
          language="sql"
          theme="vs-dark"
          value={query}
          onChange={(value) => {
            setQuery(value ?? "");
            setError("");
          }}
          onMount={handleEditorMount}
          loading={
            <div className="flex h-full items-center justify-center bg-card text-sm text-muted-foreground">
              Loading SQL editor...
            </div>
          }
          options={{
            fontSize: 14,
            fontFamily: '"Droid Sans Mono", Consolas, monospace',
            fontLigatures: false,
            minimap: { enabled: false },
            padding: {
              top: 16,
              bottom: 16,
            },
            lineNumbers: "on",
            lineNumbersMinChars: 3,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: "on",
            folding: true,
            renderLineHighlight: "all",
            cursorBlinking: "smooth",
            smoothScrolling: true,
            contextmenu: true,
            readOnly: false,
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
          }}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div
          role="alert"
          className="border-t border-destructive/20 bg-destructive/10 px-4 py-3 text-xs text-destructive"
        >
          {error}
        </div>
      )}

      {/* Footer */}
      <footer className="flex min-h-[34px] items-center justify-between gap-2 border-t border-border px-4 py-2 bg-muted/40">
        <span className="text-[11px] text-muted-foreground">
          PostgreSQL · SQL
        </span>

        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-foreground">
            Ctrl
          </kbd>
          {" + "}
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-foreground">
            Enter
          </kbd>
          <span className="ml-1">to run</span>
        </span>
      </footer>
    </section>
  );
}
