"use client";

import type { User } from "@/types";

interface UserProfileCardProps {
  user: User;
}

export function UserProfileCard({ user }: UserProfileCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm max-w-md">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 bg-blue-100 text-blue-700 font-bold text-2xl flex items-center justify-center rounded-full">
          {user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">{user.full_name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="space-y-2 border-t pt-4 text-sm text-gray-700">
        <div className="flex justify-between">
          <span className="font-medium">Department:</span>
          <span>{user.department || "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Role:</span>
          <span className={`font-semibold px-2 py-0.5 rounded text-xs ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
            {user.role}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">No-Show Count:</span>
          <span className="font-mono text-red-600 font-bold">{user.no_show_count}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Account Status:</span>
          <span className={user.is_locked ? "text-red-600 font-bold" : "text-green-600 font-bold"}>
            {user.is_locked ? "🔒 Locked" : "✅ Active"}
          </span>
        </div>
      </div>
    </div>
  );
}
