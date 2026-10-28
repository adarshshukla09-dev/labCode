"use client";

import { ResizableNavbar } from "@/components/velora/resizable-navbar";
import { ThemeToggle } from "@/components/utlis/theme-toggle";

function Icon({ d }: { d: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-5"
    >
      <path d={d} />
    </svg>
  );
}

const navItems = [
  { label: "Home", href: "/" },
  { label: "Labs", href: "/projects" },
  { label: "Analytics", href: "/analytics" },
  { label: "Settings", href: "/settings" },
];

export function Navbar() {
  return (
    <ResizableNavbar
      logo={
        <a
          href="/"
          className="flex items-center gap-2 font-bold tracking-tight"
        >
          <span className="grid size-8 place-items-center rounded-xl bg-primary text-primary-foreground">
            X
          </span>
          <span>xyzlabs</span>
        </a>
      }
      items={navItems}
      activeHref="/"
      threshold={80}
      compactWidth={760}
      maxWidth={1152}
      cta={
        <div className="flex items-center gap-2">
          {/* Theme switcher */}
          <ThemeToggle />

          {/* Profile button */}
          <a
            href="/profile"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Icon d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8" />
            <span>Profile</span>
          </a>
        </div>
      }
    />
  );
}
