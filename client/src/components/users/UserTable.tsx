"use client";

import type { User } from "@/types";
import { Users, Edit3, Trash2, Lock, Shield, Check } from "lucide-react";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  if (users.length === 0) {
    return (
      <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center">
        <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-3 text-zinc-400">
          <Users className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-900">No users found</h3>
        <p className="text-xs text-zinc-500 mt-1">There are no user records matching the selected directory filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50/75 text-[12px] font-medium text-zinc-500 uppercase tracking-wider">
              <th className="py-3 px-4">Member</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4 text-right">No-Shows</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 text-zinc-800">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-zinc-50/50 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-medium text-zinc-900">{u.full_name}</div>
                  <div className="text-xs text-zinc-400">{u.email}</div>
                </td>
                <td className="py-3.5 px-4 text-xs font-medium text-zinc-600">
                  {u.department || "—"}
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                      u.role === "ADMIN"
                        ? "bg-zinc-900 text-white"
                        : "bg-zinc-100 text-zinc-700 border border-zinc-200"
                    }`}
                  >
                    <Shield className="w-2.5 h-2.5" />
                    {u.role}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-xs">
                  <span className={u.no_show_count > 0 ? "text-rose-600 font-semibold" : "text-zinc-500"}>
                    {u.no_show_count}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  {u.is_locked ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full">
                      <Lock className="w-2.5 h-2.5" />
                      Locked
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                      <Check className="w-2.5 h-2.5" />
                      Active
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      onClick={() => onEdit(u)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-zinc-700 bg-white hover:bg-zinc-50 border border-zinc-200 px-2.5 py-1 rounded-md transition-colors"
                    >
                      <Edit3 className="w-3 h-3 text-zinc-400" />
                      Manage
                    </button>
                    <button
                      onClick={() => onDelete(u)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 hover:text-rose-700 bg-white hover:bg-rose-50 border border-zinc-200 hover:border-rose-200 px-2 py-1 rounded-md transition-colors"
                      title="Delete User"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
