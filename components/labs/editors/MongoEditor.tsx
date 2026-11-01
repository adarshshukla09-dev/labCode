"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";

export default function MongoEditor({ initialQuery, onRunQuery, isRunning = false }: {
  initialQuery: string; onRunQuery?: (query: string) => void | Promise<void>; isRunning?: boolean;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [error, setError] = useState("");
  const runQuery = async () => {
    if (!onRunQuery || !query.trim() || isRunning) return;
    setError("");
    try {
      await onRunQuery(query);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to execute MongoDB query.");
    }
  };
  return <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-card">
    <header className="flex min-h-[52px] items-center justify-between border-b border-border bg-muted/40 px-4 py-2">
      <span className="text-sm font-semibold">MongoDB Query Editor</span>
      <button type="button" onClick={() => void runQuery()} disabled={isRunning || !query.trim() || !onRunQuery}
        className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-50">{isRunning ? "Running…" : "Run Query"}</button>
    </header>
    <div className="min-h-0 flex-1"><Editor height="100%" language="javascript" theme="vs-dark" value={query} onChange={(value) => setQuery(value ?? "")}
      options={{ fontSize: 14, minimap: { enabled: false }, automaticLayout: true, wordWrap: "on", scrollBeyondLastLine: false }} /></div>
    {error && <div role="alert" className="border-t border-destructive/20 bg-destructive/10 px-4 py-3 text-xs text-destructive">{error}</div>}
    <footer className="border-t border-border bg-muted/40 px-4 py-2 text-[11px] text-muted-foreground">MongoDB · JavaScript</footer>
  </section>;
}
