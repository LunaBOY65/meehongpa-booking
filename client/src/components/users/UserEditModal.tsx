"use client";

import { useState } from "react";
import type { User, UserRole } from "@/types";
import { X, Loader2, Unlock, AlertCircle } from "lucide-react";

interface UserEditModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: { full_name?: string; department?: string; role?: UserRole; is_locked?: boolean; no_show_count?: number }) => Promise<void>;
}

function UserEditForm({
  user,
  onClose,
  onSave,
}: {
  user: User;
  onClose: () => void;
  onSave: (id: string, data: { full_name?: string; department?: string; role?: UserRole; is_locked?: boolean; no_show_count?: number }) => Promise<void>;
}) {
  const [fullName, setFullName] = useState(user.full_name || "");
  const [department, setDepartment] = useState(user.department || "");
  const [role, setRole] = useState<UserRole>(user.role);
  const [isLocked, setIsLocked] = useState(user.is_locked);
  const [noShowCount, setNoShowCount] = useState(user.no_show_count);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSave(user.id, {
        full_name: fullName,
        department,
        role,
        is_locked: isLocked,
        no_show_count: noShowCount,
      });
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to update user profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUnlockAccount = () => {
    setIsLocked(false);
    setNoShowCount(0);
  };

  return (
    <div className="bg-white rounded-xl border border-zinc-200 shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
        <div>
          <h2 className="text-base font-semibold text-zinc-900">Manage User Account</h2>
          <p className="text-xs text-zinc-500">{user.email}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {error && (
        <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label className="block text-xs font-medium text-zinc-700 mb-1.5">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-zinc-200 rounded-md text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1.5">Department</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-zinc-200 rounded-md text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1.5">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-3 py-2 text-sm bg-white border border-zinc-200 rounded-md text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
            >
              <option value="MEMBER">MEMBER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
        </div>

        <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-150 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-zinc-700">Account Standing:</span>
            <span className={isLocked ? "text-rose-700 font-semibold" : "text-emerald-700 font-semibold"}>
              {isLocked ? "Suspended (Locked)" : "Active"}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-zinc-700">Recorded No-Shows:</span>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min="0"
                value={noShowCount}
                onChange={(e) => setNoShowCount(Number(e.target.value))}
                className="w-16 px-2 py-1 text-xs border border-zinc-200 rounded bg-white text-zinc-900 text-right focus:outline-none focus:border-zinc-900"
              />
              <span className="text-zinc-500">times</span>
            </div>
          </div>

          {isLocked && (
            <button
              type="button"
              onClick={handleUnlockAccount}
              className="w-full mt-2 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-medium transition-colors shadow-xs"
            >
              <Unlock className="w-3.5 h-3.5" />
              Unlock Account & Reset No-Shows
            </button>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 rounded-md border border-zinc-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-md disabled:bg-zinc-300 disabled:cursor-not-allowed transition-colors shadow-xs"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export function UserEditModal({ user, isOpen, onClose, onSave }: UserEditModalProps) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs">
      <UserEditForm key={user.id} user={user} onClose={onClose} onSave={onSave} />
    </div>
  );
}
