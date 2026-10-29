"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import CodeEditor from "@/components/labs/codeEditor";
import TestCaseResults, { type TestCase, type QueryResult } from "@/components/labs/testCase";

interface ResizableWorkspaceProps {
  initialQuery?: string;
  onRunQuery?: (query: string) => void | Promise<void>;
  isRunning?: boolean;
  testCases?: TestCase[];
  queryResult?: QueryResult | null;
}

export default function ResizableWorkspace({
  initialQuery,
  onRunQuery,
  isRunning = false,
  testCases,
  queryResult,
}: ResizableWorkspaceProps) {
  const [topHeight, setTopHeight] = useState<number>(60); // Percentage height for the editor (default 60%)
  const isDragging = useRef<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const containerHeight = containerRect.height;
    
    // Calculate new height percentage based on mouse position relative to container
    const offsetY = e.clientY - containerRect.top;
    const newHeightPercentage = (offsetY / containerHeight) * 100;

    // Constrain panel heights between 20% and 80%
    if (newHeightPercentage >= 20 && newHeightPercentage <= 80) {
      setTopHeight(newHeightPercentage);
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    if (isDragging.current) {
      isDragging.current = false;
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={containerRef}
      className="flex h-full w-full flex-col overflow-hidden bg-background"
    >
      {/* Top Panel: Code Editor */}
      <div style={{ height: `${topHeight}%` }} className="min-h-[150px] flex flex-col">
        <CodeEditor
          initialQuery={initialQuery}
          onRunQuery={onRunQuery}
          isRunning={isRunning}
        />
      </div>

      {/* Draggable Splitter Handle */}
      <div
        onMouseDown={handleMouseDown}
        className="group relative flex h-2.5 w-full cursor-row-resize items-center justify-center bg-muted/40 hover:bg-primary/20 transition-colors"
        title="Drag to resize panels"
      >
        <div className="h-1 w-12 rounded-full bg-border group-hover:bg-primary transition-colors" />
      </div>

      {/* Bottom Panel: Test Cases & Results */}
      <div
        style={{ height: `${100 - topHeight}%` }}
        className="min-h-[150px] flex flex-col"
      >
        <TestCaseResults
          testCases={testCases}
          queryResult={queryResult}
          isRunning={isRunning}
        />
      </div>
    </div>
  );
}