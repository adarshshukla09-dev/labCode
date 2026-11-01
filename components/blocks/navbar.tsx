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
  { label: "Labs", href: "/labs" },
  { label: "Learn", href: "/Learn" },
];

export function Navbar() {
  const pathname = usePathname();

  // const {
  //   data: session,
  //   isPending: isLoading,
  // } = authClient.useSession();

  // const user = session?.user;

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

          {/* <div className="flex min-w-10 shrink-0 items-center justify-center">
            {isLoading ? (
              <div
                className="size-10 animate-pulse rounded-full bg-muted"
                aria-label="Loading user profile"
              />
            ) : user ? (
              <Link
                href="/profile"
                aria-label="View profile"
                title={user.name || user.email || "My profile"}
                className="flex size-10 items-center justify-center overflow-hidden rounded-full border border-border bg-muted transition-opacity hover:opacity-80"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "User profile"}
                    className="size-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-semibold uppercase">
                    {user.name?.trim()?.charAt(0) ||
                      user.email?.trim()?.charAt(0) || (
                        <Icon d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8" />
                      )}
                  </span>
                )}
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Icon d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8" />
                <span>Login</span>
              </Link>
            )}
          </div> */}
        </div>
      }
    />
  );
}
