"use client";

import type { UserLockoutItem } from "@/types";
import { ShieldAlert, Lock, AlertTriangle, CheckCircle2 } from "lucide-react";

interface UserLockoutTableProps {
  users: UserLockoutItem[];
}

export function UserLockoutTable({ users }: UserLockoutTableProps) {
  if (users.length === 0) {
    return (
      <div className="bg-white border border-zinc-200/90 rounded-xl p-8 text-center shadow-xs">
        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-900">Zero policy violations</h3>
        <p className="text-xs text-zinc-500 mt-1">No member accounts are currently suspended or flagged for no-shows.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-zinc-200/90 rounded-xl overflow-hidden shadow-xs">
      <div className="p-5 border-b border-zinc-100 flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-zinc-700" />
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-zinc-900">Accounts Flagged for No-Shows / Suspensions</h3>
          <p className="text-xs text-zinc-500">Members with repeat missed reservations or active lockout locks</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50/75 text-[12px] font-medium text-zinc-500 uppercase tracking-wider">
              <th className="py-3 px-4">Member Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4 text-right">No-Show Counter</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 text-zinc-800">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-zinc-50/50 transition-colors">
                <td className="py-3.5 px-4 font-medium text-zinc-900">{u.full_name}</td>
                <td className="py-3.5 px-4 text-xs text-zinc-500">{u.email}</td>
                <td className="py-3.5 px-4 text-xs text-zinc-600">{u.department || "—"}</td>
                <td className="py-3.5 px-4 text-right font-mono text-xs font-semibold text-rose-600">
                  {u.no_show_count}
                </td>
                <td className="py-3.5 px-4">
                  {u.is_locked ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full">
                      <Lock className="w-2.5 h-2.5" />
                      Locked Out
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                      <AlertTriangle className="w-2.5 h-2.5" />
                      Warning ({u.no_show_count} no-shows)
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
