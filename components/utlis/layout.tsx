"use client";

import { usePathname } from "next/navigation";
import { FooterWordmark } from "../blocks/footer-wordmark";
import { Navbar } from "../blocks/navbar";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <>
      {!isLoginPage && (
       
          <Navbar />
          
      )}

      <div className="min-h-screen pl-0 md:pl-16">
        {children}
      </div>
       {!isLoginPage && (
        
          <FooterWordmark />
        
      )}

    </>
  );
}