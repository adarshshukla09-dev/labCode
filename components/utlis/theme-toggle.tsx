"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [nextTheme, setNextTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (animating) return;

    const targetTheme = resolvedTheme === "dark" ? "light" : "dark";

    setNextTheme(targetTheme);
    setAnimating(true);

    // Change the actual theme after the reveal begins.
    window.setTimeout(() => {
      setTheme(targetTheme);
    }, 250);

    window.setTimeout(() => {
      setAnimating(false);
    }, 850);
  };

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className="grid size-10 place-items-center rounded-full border border-border bg-background"
      >
        <Sun className="size-5" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <>
      <motion.button
        type="button"
        onClick={toggleTheme}
        disabled={animating}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        title={`Switch to ${isDark ? "light" : "dark"} mode`}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.9 }}
        className="relative z-[100] grid size-10 shrink-0 place-items-center overflow-hidden rounded-full border border-border bg-background text-foreground shadow-sm transition-colors"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? "moon" : "sun"}
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ duration: 0.25 }}
            className="absolute"
          >
            {isDark ? (
              <Moon className="size-5" />
            ) : (
              <Sun className="size-5" />
            )}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {animating && (
          <motion.div
            key="theme-reveal"
            initial={{ clipPath: "circle(0px at 50% 50%)" }}
            animate={{ clipPath: "circle(150vmax at 50% 50%)" }}
            exit={{ opacity: 0 }}
            transition={{
              clipPath: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              },
              opacity: { duration: 0.15 },
            }}
            className="pointer-events-none fixed inset-0 z-[90]"
            style={{
              backgroundColor: nextTheme === "dark" ? "#09090b" : "#ffffff",
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}