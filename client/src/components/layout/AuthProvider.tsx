"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";
import type { User } from "@/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
  clearUser: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    setError(null);
    if (!authService.isAuthenticated()) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      setUser(await userService.getCurrentUser());
    } catch (err: unknown) {
      setUser(null);
      const message =
        err instanceof Error ? err.message : "Unable to verify your session";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      try {
        const currentUser = authService.isAuthenticated()
          ? await userService.getCurrentUser()
          : null;
        if (isMounted) {
          setUser(currentUser);
          setError(null);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setUser(null);
          setError(
            err instanceof Error ? err.message : "Unable to verify your session",
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    void initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const clearUser = useCallback(() => {
    setUser(null);
    setError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, error, refreshUser, clearUser }}
    >
      {error && (
        <div
          role="alert"
          className="border-b border-rose-200 bg-rose-50 px-4 py-2 text-center text-xs text-rose-800"
        >
          Could not verify your session: {error}
        </div>
      )}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
