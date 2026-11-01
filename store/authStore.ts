import { create } from "zustand";
import { authClient } from "@/lib/auth-client";

// 1. Use Better Auth's official type inference to avoid structural mismatches
export type User = typeof authClient.$Infer.Session.user;
export type Session = typeof authClient.$Infer.Session.session;

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  fetchSession: () => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true, // Start as true while verifying session on load
  error: null,

  // Fetch the current active session and user from Better Auth
  fetchSession: async () => {
    set({ isLoading: true, error: null });

   try {
      const { data } = await authClient.getSession();
      set({ user: data?.user ?? null, isLoading: false });
    } catch {
      set({ user: null, isLoading: false });
    }
  },

  // Sign out the user and clear local store state
  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      await authClient.signOut();
      set({ user: null, session: null, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  // Manually update user state if needed (e.g., after profile updates)
  setUser: (user) => set({ user }),
}));