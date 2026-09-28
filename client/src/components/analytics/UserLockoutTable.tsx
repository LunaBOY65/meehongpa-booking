"use client";

import type { UserLockoutItem } from "@/types";

interface UserLockoutTableProps {
  users: UserLockoutItem[];
}

export function UserLockoutTable({ users }: UserLockoutTableProps) {
  return (
    <div className="bg-white border rounded-lg p-5 shadow-sm">
      <h3 className="text-lg font-bold text-gray-800 mb-4">⚠️ Accounts Flagged for Lockout / High No-Shows</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-700">
          <thead className="bg-slate-100 text-slate-700 font-semibold border-b">
            <tr>
              <th className="p-3">Full Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Department</th>
              <th className="p-3">No-Show Count</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  ไม่มีผู้ใช้งานที่ติดล็อกหรือมีสถิติ No-show
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="border-b">
                  <td className="p-3 font-medium text-gray-900">{u.full_name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.department || "-"}</td>
                  <td className="p-3 font-mono text-red-600 font-bold">{u.no_show_count}</td>
                  <td className="p-3">
                    {u.is_locked ? (
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-700">
                        🔒 Locked Out
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-yellow-100 text-yellow-800">
                        ⚠️ High No-Show
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
