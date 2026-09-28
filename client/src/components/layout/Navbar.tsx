"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { authService } from "@/services/auth.service";
import { userService } from "@/services/user.service";
import type { User } from "@/types";

export function Navbar() {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const authed = authService.isAuthenticated();
    setIsAuth(authed);
    if (authed) {
      userService.getCurrentUser().then(setUser).catch(() => {
        setIsAuth(false);
      });
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <header className="bg-slate-800 text-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold hover:text-slate-200">
          🏢 Meeting Room Booking
        </Link>
        <div className="flex items-center gap-4 text-sm">
          {isAuth ? (
            <>
              <Link href="/profile" className="hover:underline">
                👤 {user?.full_name || "Profile"} ({user?.role})
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="border border-white hover:bg-slate-700 px-3 py-1.5 rounded"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
