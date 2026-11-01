"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const fetchSession = useAuthStore((state) => state.fetchSession);

  useEffect(() => {
    void fetchSession();
  }, [fetchSession]);

  return <>{children}</>;
}