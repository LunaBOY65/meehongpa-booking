"use client";

import { useEffect, useState } from "react";
import { userService } from "@/services/user.service";
import { UserProfileCard } from "@/components/users/UserProfileCard";
import type { User } from "@/types";
import { Loader2, AlertCircle } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    userService
      .getCurrentUser()
      .then(setUser)
      .catch((err) => {
        setError(err.message || "Failed to load user profile. Please sign in.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">Account Overview</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Manage your personal credentials, department association, and status</p>
      </div>

      {loading ? (
        <div className="p-12 flex items-center justify-center text-zinc-400 gap-2 text-xs">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading profile...</span>
        </div>
      ) : error || !user ? (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800 max-w-md">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{error || "User profile unavailable."}</span>
        </div>
      ) : (
        <UserProfileCard user={user} />
      )}
    </div>
  );
}
