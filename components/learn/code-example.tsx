"use client";

import { useState } from "react";

export function CodeExample({ code, label = "Code example", language = "sql" }: { code: string; label?: string; language?: "sql" | "javascript" }) {
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <figure className="my-6 overflow-hidden rounded-xl border border-border bg-card">
      <figcaption className="flex items-center justify-between gap-4 border-b border-border px-4 py-3 text-xs text-muted-foreground">
        <span>{label}</span>
        <button
          type="button"
          onClick={copyCode}
          className="rounded-md px-2 py-1 font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Copy ${label.toLowerCase()}`}
        >
          {copied ? "Copied" : "Copy code"}
        </button>
      </figcaption>
      <pre className="overflow-x-auto p-4 text-sm leading-6 text-foreground"><code data-language={language}>{code}</code></pre>
      <span className="sr-only" aria-live="polite">{copied ? "Code copied to clipboard." : ""}</span>
    </figure>
  );
}
