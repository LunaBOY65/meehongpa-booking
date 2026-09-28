"use client";

import type { User } from "@/types";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  return (
    <div className="overflow-x-auto border rounded-lg shadow-sm">
      <table className="w-full text-left border-collapse text-sm text-gray-700">
        <thead className="bg-slate-100 text-slate-700 font-semibold border-b">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Department</th>
            <th className="p-3">Role</th>
            <th className="p-3">No-Show</th>
            <th className="p-3">Status</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-4 text-center text-gray-500">
                ไม่พบข้อมูลผู้ใช้งาน
              </td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u.id} className="border-b hover:bg-slate-50">
                <td className="p-3 font-medium text-gray-900">{u.full_name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.department || "-"}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      u.role === "ADMIN"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="p-3 font-mono">{u.no_show_count}</td>
                <td className="p-3">
                  {u.is_locked ? (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded font-medium">
                      🔒 Locked
                    </span>
                  ) : (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">
                      Active
                    </span>
                  )}
                </td>
                <td className="p-3 text-right space-x-2">
                  <button
                    onClick={() => onEdit(u)}
                    className="px-2.5 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Edit / Unlock
                  </button>
                  <button
                    onClick={() => onDelete(u)}
                    className="px-2.5 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
