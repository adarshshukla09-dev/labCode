"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { FooterWordmark } from "../blocks/footer-wordmark";
import { Navbar } from "../blocks/navbar";

function LayoutContentInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login" || pathname?.startsWith("/Labs/");

  return (
    <>
      {!isLoginPage && <Navbar />}

      <div className="min-h-screen ">
        {children}
      </div>

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
      <LayoutContentInner>{children}</LayoutContentInner>
    </Suspense>
  );
}
