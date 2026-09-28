"use client";

import type { User } from "@/types";
import { User as UserIcon, Mail, Building, Shield, AlertTriangle, CheckCircle2, Lock } from "lucide-react";

interface UserProfileCardProps {
  user: User;
}

export function UserProfileCard({ user }: UserProfileCardProps) {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 max-w-xl shadow-xs">
      <div className="flex items-start gap-4 pb-6 border-b border-zinc-100">
        <div className="w-12 h-12 rounded-full bg-zinc-900 text-white flex items-center justify-center font-semibold text-lg shrink-0">
          {user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-zinc-900 truncate">{user.full_name}</h2>
            <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
              user.role === "ADMIN" ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-700 border border-zinc-200"
            }`}>
              <Shield className="w-3 h-3" />
              {user.role}
            </span>
          </div>
          <p className="text-sm text-zinc-500 flex items-center gap-1.5 mt-0.5">
            <Mail className="w-3.5 h-3.5 text-zinc-400" />
            {user.email}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 text-sm">
        <div className="p-3.5 bg-zinc-50 rounded-lg border border-zinc-100">
          <div className="text-xs text-zinc-500 font-medium flex items-center gap-1.5 mb-1">
            <Building className="w-3.5 h-3.5 text-zinc-400" />
            Department
          </div>
          <div className="font-semibold text-zinc-900">{user.department || "General"}</div>
        </div>

        <div className="p-3.5 bg-zinc-50 rounded-lg border border-zinc-100">
          <div className="text-xs text-zinc-500 font-medium flex items-center gap-1.5 mb-1">
            <AlertTriangle className="w-3.5 h-3.5 text-zinc-400" />
            No-Show Frequency
          </div>
          <div className="font-semibold text-zinc-900 flex items-center gap-1.5">
            <span>{user.no_show_count} incident{user.no_show_count === 1 ? "" : "s"}</span>
            {user.no_show_count >= 3 && (
              <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded font-medium">Flagged</span>
            )}
          </div>
        </div>

        <div className="p-3.5 bg-zinc-50 rounded-lg border border-zinc-100 sm:col-span-2">
          <div className="text-xs text-zinc-500 font-medium mb-1">Account Eligibility</div>
          <div className="flex items-center gap-2">
            {user.is_locked ? (
              <div className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                <Lock className="w-3.5 h-3.5" />
                <span>Account Suspended — Contact administrator to unlock reservation privileges</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Active Member — Good standing for immediate room reservations</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
