"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "./theme-provider";
import { TRPCReactProvider } from "@/trpc/client";

// Dynamically import the Navbar component
const Navbar = dynamic(() => import("../blocks/navbar").then((m) => m.Navbar), {
  ssr: true, // Keep true if you want it server-rendered, or false if it relies strictly on browser APIs
  loading: () => <div className="h-16 w-full bg-background animate-pulse" />, // Optional placeholder height
});
const FooterWordmark = dynamic(
  () => import("../blocks/footer-wordmark").then((m) => m.FooterWordmark),
  {
    ssr: true,
    loading: () => <div className="h-16 w-full bg-background animate-pulse" />,
  },
);

function LayoutContentInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login" || pathname?.startsWith("/labs/");

  return (
    <>
      {!isLoginPage && <Navbar />}

      <div className="min-h-screen ">{children}</div>

      {!isLoginPage && <FooterWordmark />}
    </>
  );
}

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={null}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <TRPCReactProvider>
          <LayoutContentInner>{children}</LayoutContentInner>
        </TRPCReactProvider>
      </ThemeProvider>
    </Suspense>
  );
}
