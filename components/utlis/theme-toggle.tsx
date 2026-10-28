"use client";

import { useEffect, useState } from "react";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" aria-label="Change theme">
        <Sun className="size-4" />
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
      <Button
        variant={theme === "light" ? "secondary" : "ghost"}
        size="icon"
        aria-label="Light mode"
        title="Light mode"
        onClick={() => setTheme("light")}
      >
        <Sun className="size-4" />
      </Button>

      <Button
        variant={theme === "dark" ? "secondary" : "ghost"}
        size="icon"
        aria-label="Dark mode"
        title="Dark mode"
        onClick={() => setTheme("dark")}
      >
        <Moon className="size-4" />
      </Button>

      <Button
        variant={theme === "system" ? "secondary" : "ghost"}
        size="icon"
        aria-label="System theme"
        title="Use system theme"
        onClick={() => setTheme("system")}
      >
        <Laptop className="size-4" />
      </Button>
    </div>
  );
}
