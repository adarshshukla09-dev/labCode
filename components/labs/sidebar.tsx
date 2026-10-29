"use client";

import { useState } from "react";

interface Chapter {
  title: string;
  lessons: string[];
}

interface Lesson {
  id: number;
  title: string;
}

interface SidebarProps {
  activeLesson?: number;
  onLessonSelect?: (lesson: Lesson) => void;
  activeMode?: string;
  onModeChange?: (mode: string) => void;
  onClose?: () => void;
}

const chapters: Chapter[] = [
  {
    title: "Querying Data",
    lessons: [
      "SELECT All Columns",
      "SELECT Specific Columns",
      "SELECT with DISTINCT",
      "LIMIT Results",
      "Column Aliases with AS",
    ],
  },
  {
    title: "Sorting Data",
    lessons: [
      "ORDER BY Ascending",
      "ORDER BY Descending",
      "ORDER BY Multiple Columns",
    ],
  },
  {
    title: "Filtering Data",
    lessons: [
      "WHERE Clause",
      "Comparison Operators",
      "WHERE with AND",
      "WHERE with OR",
      "IN Operator",
      "NOT IN Operator",
      "BETWEEN Operator",
      "LIKE Pattern Matching",
      "IS NULL",
      "IS NOT NULL",
    ],
  },
  {
    title: "Joining Tables",
    lessons: [
      "Table Aliases",
      "INNER JOIN Basics",
      "LEFT JOIN",
      "RIGHT JOIN",
      "Self JOIN",
      "JOIN Multiple Tables",
      "JOIN with WHERE",
    ],
  },
  {
    title: "Grouping Data",
    lessons: [
      "COUNT Function",
      "SUM Function",
      "AVG Function",
      "MIN and MAX Functions",
      "GROUP BY",
      "HAVING Clause",
    ],
  },
  {
    title: "Subqueries",
    lessons: [
      "Subquery in WHERE",
      "Subquery in FROM",
      "EXISTS Operator",
    ],
  },
  {
    title: "Set Operators",
    lessons: ["UNION", "UNION ALL"],
  },
  {
    title: "Modifying Data",
    lessons: [
      "INSERT Single Row",
      "INSERT Multiple Rows",
      "INSERT with Specific Columns",
      "UPDATE Single Column",
      "UPDATE Multiple Columns",
      "UPDATE with WHERE Condition",
      "UPDATE with JOIN",
      "DELETE with WHERE",
      "DELETE with JOIN",
      "INSERT INTO SELECT",
    ],
  },
  {
    title: "Common Table Expressions",
    lessons: [
      "Basic CTE with WITH",
      "Multiple CTEs",
      "CTE for Complex Aggregation",
      "Recursive CTE",
    ],
  },
  {
    title: "Advanced Topics",
    lessons: [
      "ROW_NUMBER Window Function",
      "RANK Window Function",
      "CASE Expression",
      "COALESCE Function",
      "GROUP BY with ROLLUP",
      "LAG Window Function",
    ],
  },
  {
    title: "Data Types & Constraints",
    lessons: [
      "Understanding INTEGER Types",
      "Understanding VARCHAR vs TEXT",
      "Understanding DECIMAL for Money",
      "Understanding DATE Types",
      "PRIMARY KEY Constraint",
      "FOREIGN KEY Constraint",
    ],
  },
];

export default function Sidebar({
  activeLesson = 1,
  onLessonSelect,
  activeMode = "Lessons",
  onModeChange,
  onClose,
}: SidebarProps) {
  const [expandedChapters, setExpandedChapters] = useState<string[]>([
    "Querying Data",
  ]);

  const [selectedLesson, setSelectedLesson] = useState<number>(activeLesson);

  const toggleChapter = (title: string): void => {
    setExpandedChapters((previous) =>
      previous.includes(title)
        ? previous.filter((chapter) => chapter !== title)
        : [...previous, title]
    );
  };

  const handleLessonClick = (lesson: string, lessonNumber: number): void => {
    setSelectedLesson(lessonNumber);

    onLessonSelect?.({
      id: lessonNumber,
      title: lesson,
    });

    onClose?.();
  };

  let lessonNumber = 0;

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col overflow-hidden rounded-xl border border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="border-b border-sidebar-border px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary text-sm font-bold">
            logo
          </div>
          <div className="min-w-0">
            <span className="font-heading font-semibold text-sm text-sidebar-foreground">SQL Lab</span>
            <p className="mt-0.5 text-xs text-muted-foreground truncate">
              Learn SQL Interactively
            </p>
          </div>
        </div>
      </div>

      {/* Lessons Heading */}
      <div className="flex items-center justify-between px-5 pb-2 pt-5">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Course Content
        </h2>

        <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
          {chapters.reduce(
            (total, chapter) => total + chapter.lessons.length,
            0
          )}
        </span>
      </div>

      {/* Chapters and Lessons */}
      <nav className="flex-1 overflow-y-auto px-3 pb-5">
        {chapters.map((chapter) => {
          const isExpanded = expandedChapters.includes(chapter.title);

          return (
            <div key={chapter.title} className="mb-1">
              <button
                type="button"
                onClick={() => toggleChapter(chapter.title)}
                aria-expanded={isExpanded}
                className="group flex w-full items-center gap-2 rounded-lg px-3 py-3 text-left transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <svg
                  className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                    isExpanded ? "rotate-90" : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="m9 18 6-6-6-6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <span className="flex-1 text-sm font-medium text-sidebar-foreground group-hover:text-sidebar-accent-foreground">
                  {chapter.title}
                </span>

                <span className="text-xs text-muted-foreground">
                  {chapter.lessons.length}
                </span>
              </button>

              {isExpanded && (
                <div className="space-y-0.5 border-l border-sidebar-border ml-4">
                  {chapter.lessons.map((lesson) => {
                    lessonNumber += 1;

                    const currentNumber = lessonNumber;
                    const isActive = selectedLesson === currentNumber;

                    return (
                      <button
                        key={lesson}
                        type="button"
                        onClick={() => handleLessonClick(lesson, currentNumber)}
                        className={`group flex w-full items-center gap-2.5 rounded-r-lg py-2 pl-3 pr-2 text-left transition-all ${
                          isActive
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded text-[11px] font-medium ${
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground group-hover:bg-sidebar-accent"
                          }`}
                        >
                          {currentNumber}
                        </span>

                        <span className="text-[13px] leading-5 truncate">
                          {lesson}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}