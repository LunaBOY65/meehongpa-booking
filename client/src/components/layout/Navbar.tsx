"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/layout/AuthProvider";
import { authService } from "@/services/auth.service";
import { Building2, LogOut, LogIn, UserPlus } from "lucide-react";

export function Navbar() {
  const router = useRouter();
  const { user, clearUser } = useAuth();

  const handleLogout = () => {
    authService.logout();
    clearUser();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 text-zinc-900 font-semibold tracking-tight text-base hover:opacity-90 transition-opacity">
            <div className="w-7 h-7 bg-zinc-900 text-white rounded-md flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <span>RoomDesk</span>
            <span className="text-[11px] font-medium bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded border border-zinc-200">
              Workspace
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3 text-sm">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-zinc-100 transition-colors text-zinc-700"
              >
                <div className="w-6 h-6 rounded-full bg-zinc-200 text-zinc-700 flex items-center justify-center text-xs font-semibold">
                  {user?.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="font-medium text-zinc-900 hidden sm:inline">
                  {user?.full_name || "Profile"}
                </span>
                <span className={`text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded ${
                  user?.role === "ADMIN" ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-600 border border-zinc-200"
                }`}>
                  {user?.role}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 px-2.5 py-1.5 rounded-md border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 transition-all font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-900 px-3 py-1.5 rounded-md hover:bg-zinc-100 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign in
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1.5 text-xs font-medium bg-zinc-900 text-white px-3 py-1.5 rounded-md hover:bg-zinc-800 transition-colors shadow-xs"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Create account
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
