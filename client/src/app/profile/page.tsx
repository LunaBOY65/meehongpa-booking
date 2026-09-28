"use client";

import { useEffect, useState } from "react";
import { userService } from "@/services/user.service";
import { UserProfileCard } from "@/components/users/UserProfileCard";
import type { User } from "@/types";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    userService
      .getCurrentUser()
      .then(setUser)
      .catch((err) => {
        setError(err.message || "Failed to load user profile. Please login.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading user profile...</div>;
  }

  if (error || !user) {
    return (
      <div className="max-w-md mx-auto p-6 bg-red-50 border border-red-200 rounded text-red-700 text-center">
        ❌ {error || "User profile not available."}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">👤 User Profile</h1>
      <UserProfileCard user={user} />
    </div>
  );
}
