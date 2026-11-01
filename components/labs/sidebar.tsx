"use client";

import Image from "next/image";
import { useState } from "react";

interface Lesson {
  lessonNumber: number;
  title: string;
  chapter: string;
}

interface ActiveLesson {
  lessonNumber: number;
  title: string;
  chapter: string;
}

interface SidebarProps {
  sidebarData: {
    lessonNumber: number;
    title: string;
    chapter: string;
  }[];
  activeLessonNumber: number | null;
  activeChapter: string | null;
  activeLessonTitle: string;
  labTitle: string;
  onLessonSelect: (lesson: ActiveLesson) => void;
  onClose?: () => void;
}

export default function Sidebar({
  sidebarData,
  activeLessonNumber,
  activeChapter,
  activeLessonTitle,
  labTitle,
  onLessonSelect,
  onClose,
}: SidebarProps) {
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);

  // Extract unique chapters from props sidebarData
  const chaptersMap = new Map<
    string,
    Array<{ lessonNumber: number; title: string }>
  >();
  const chaptersSet = new Set<string>();

  for (const item of sidebarData) {
    const chapter = item.chapter;
    chaptersSet.add(chapter);
    const existing = chaptersMap.get(chapter) || [];
    existing.push({ lessonNumber: item.lessonNumber, title: item.title });
    chaptersMap.set(chapter, existing);
  }

  const chapters = Array.from(chaptersSet).sort((a, b) => {
    const aFirst = Math.min(
      ...(chaptersMap.get(a) ?? []).map((lesson) => lesson.lessonNumber),
    );

    const bFirst = Math.min(
      ...(chaptersMap.get(b) ?? []).map((lesson) => lesson.lessonNumber),
    );

    return aFirst - bFirst;
  });
  const toggleChapter = (chapter: string) => {
    setExpandedChapter((previous) => (previous === chapter ? null : chapter));
  };

  const handleLessonClick = (lesson: Lesson) => {
    onLessonSelect(lesson);
    onClose?.();
  };

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col overflow-hidden rounded-xl border border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="border-b border-sidebar-border px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary text-sm font-bold">
            <Image src="/favicon.svg" alt="Logo" width={24} height={24} />{" "}
          </div>

          <div className="min-w-0">
            <h1 className="font-heading font-semibold text-sm">{labTitle}</h1>

            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {activeLessonTitle}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-5 pb-2 pt-5">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Course Content
        </h2>

        <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
          {chapters.length} chapters
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-5">
        {chapters.map((chapter) => {
          const isExpanded = expandedChapter === chapter;
          const chapterLessons = (chaptersMap.get(chapter) || []).sort(
            (a, b) => a.lessonNumber - b.lessonNumber,
          );
          return (
            <div key={chapter} className="mb-1">
              <button
                type="button"
                onClick={() => toggleChapter(chapter)}
                aria-expanded={isExpanded}
                className="group flex w-full items-center gap-2 rounded-lg px-3 py-3 text-left transition-colors hover:bg-sidebar-accent"
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

                <span className="flex-1 text-sm font-medium">{chapter}</span>
              </button>

              {isExpanded && (
                <div className="ml-4 space-y-0.5 border-l border-sidebar-border">
                  {chapterLessons.map((lesson) => {
                    const isActive =
                      activeChapter === chapter &&
                      activeLessonNumber === lesson.lessonNumber;

                    return (
                      <button
                        key={lesson.lessonNumber}
                        type="button"
                        onClick={() =>
                          handleLessonClick({
                            lessonNumber: lesson.lessonNumber,
                            title: lesson.title,
                            chapter,
                          })
                        }
                        className={`group flex w-full items-center gap-2.5 rounded-r-lg py-2 pl-3 pr-2 text-left transition-all ${
                          isActive
                            ? "bg-primary/10 font-medium text-primary"
                            : "text-muted-foreground hover:bg-sidebar-accent"
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded text-[11px] font-medium ${
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {lesson.lessonNumber}
                        </span>

                        <span className="truncate text-[13px] leading-5">
                          {lesson.title}
                        </span>
                      </button>
                    );
                  })}

                  {chapterLessons.length === 0 && (
                    <p className="px-3 py-2 text-xs text-muted-foreground">
                      No lessons found.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
