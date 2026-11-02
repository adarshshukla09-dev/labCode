"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ResizableNavbar } from "@/components/velora/resizable-navbar";
import { ThemeToggle } from "@/components/utlis/theme-toggle";
import Image from "next/image";

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
  { label: "Labs", href: "/lab" },
  { label: "Learn", href: "/Learn" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <ResizableNavbar
      logo={
        <Link
          href="/"
          className="flex items-center gap-2 font-bold tracking-tight"
        >
          <span className="grid size-8 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Image src="/favicon.svg" alt="Logo" width={24} height={24} />
          </span>
          <span>Labs</span>
        </Link>
      }
      items={navItems}
      activeHref={pathname}
      threshold={80}
      compactWidth={760}
      maxWidth={1152}
      cta={
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      }
    />
  );
}
