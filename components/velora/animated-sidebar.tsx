
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

interface SidebarContextType {
  closeDrawer: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
  closeDrawer: () => {},
});

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Sidebar({
  children,
  className,
  ...props
}: SidebarProps) {
  const drawerRef = useRef<HTMLDialogElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuRef = useRef<HTMLButtonElement>(null);
  const drawerId = useId();

  const closeDrawer = () => {
    drawerRef.current?.close();
  };

  useEffect(() => {
    if (!drawerOpen) return;

    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [drawerOpen]);

  const sidebarContent = (
    <SidebarContext.Provider value={{ closeDrawer }}>
      <div
        className={cn(
          "flex h-full min-h-0 flex-col bg-card text-card-foreground",
          className
        )}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );

  return (
    <>
      {/* Mobile top bar */}
      <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-card px-4 lg:hidden">
        <button
          ref={menuRef}
          type="button"
          aria-label="Open navigation"
          aria-expanded={drawerOpen}
          aria-controls={drawerId}
          onClick={() => {
            drawerRef.current?.showModal();
            setDrawerOpen(true);
          }}
          className="grid size-9 place-items-center rounded-lg hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <svg
            viewBox="0 0 24 24"
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <span className="font-semibold">Navigation</span>
      </header>

      {/* Desktop sidebar */}
{/* Desktop sidebar */}
<aside
  {...props}
  className={cn(
    "hidden lg:flex lg:h-dvh lg:w-64 lg:shrink-0 lg:sticky lg:top-0 lg:flex-col",
    "border-r border-white/10 bg-[#0d1017]",
    className
  )}
>
  {sidebarContent}
</aside>
      {/* Mobile drawer */}
      <dialog
        ref={drawerRef}
        id={drawerId}
        aria-label="Navigation"
        onClose={() => {
          setDrawerOpen(false);
          menuRef.current?.focus({ preventScroll: true });
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeDrawer();
          }
        }}
        className="fixed inset-y-0 left-0 m-0 h-dvh max-h-none w-72 max-w-[85vw] border-r bg-card p-0 text-foreground shadow-xl backdrop:bg-black/40 open:flex open:flex-col"
      >
        {sidebarContent}
      </dialog>
    </>
  );
}

interface SidebarHeaderProps {
  logo: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
}

export function SidebarHeader({
  logo,
  title,
  subtitle,
}: SidebarHeaderProps) {
  return (
    <div className="flex min-h-16 shrink-0 items-center gap-3 border-b px-4 py-3">
      <div className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-primary/10 text-primary">
        {logo}
      </div>

      <div className="min-w-0 flex-1">
        {title && (
          <div className="truncate text-sm font-semibold">
            {title}
          </div>
        )}

        {subtitle && (
          <div className="truncate text-xs text-muted-foreground">
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}

interface SidebarContentProps {
  children: React.ReactNode;
  className?: string;
}

export function SidebarContent({
  children,
  className,
}: SidebarContentProps) {
  return (
    <nav
      aria-label="Main navigation"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-3",
        className
      )}
    >
      {children}
    </nav>
  );
}

interface SidebarGroupProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function SidebarGroup({
  title,
  icon,
  children,
  defaultOpen = false,
  className,
}: SidebarGroupProps) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();

  return (
    <div className={cn("w-full", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((previous) => !previous)}
        className={cn(
          "flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
          "text-muted-foreground hover:bg-muted hover:text-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          open && "bg-muted/70 text-foreground"
        )}
      >
        <span className="grid size-5 shrink-0 place-items-center">
          {icon}
        </span>

        <span className="min-w-0 flex-1 truncate">
          {title}
        </span>

        <svg
          viewBox="0 0 24 24"
          className={cn(
            "size-4 shrink-0 transition-transform duration-200",
            open && "rotate-90"
          )}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

      <div
        id={id}
        hidden={!open}
        className="ml-5 mt-1 space-y-1 border-l pl-3"
      >
        {children}
      </div>
    </div>
  );
}

interface SidebarLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
}

export function SidebarLink({
  label,
  icon,
  active = false,
  className,
  onClick,
  ...props
}: SidebarLinkProps) {
  const { closeDrawer } = useContext(SidebarContext);

  return (
    <a
      {...props}
      aria-current={active ? "page" : undefined}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented) {
          closeDrawer();
        }
      }}
      className={cn(
        "flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        "text-muted-foreground hover:bg-muted hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active && "bg-primary/10 font-medium text-primary",
        className
      )}
    >
      {icon && (
        <span className="grid size-4 shrink-0 place-items-center">
          {icon}
        </span>
      )}

      <span className="truncate">{label}</span>
    </a>
  );
}

export function SidebarFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("shrink-0 border-t p-3", className)}>
      {children}
    </div>
  );
}
