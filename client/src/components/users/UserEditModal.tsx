"use client";

import { useState, useEffect } from "react";
import type { User, UserRole } from "@/types";

interface UserEditModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: { full_name?: string; department?: string; role?: UserRole; is_locked?: boolean; no_show_count?: number }) => Promise<void>;
}

export function UserEditModal({ user, isOpen, onClose, onSave }: UserEditModalProps) {
  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState<UserRole>("MEMBER");
  const [isLocked, setIsLocked] = useState(false);
  const [noShowCount, setNoShowCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      setDepartment(user.department || "");
      setRole(user.role);
      setIsLocked(user.is_locked);
      setNoShowCount(user.no_show_count);
    }
  }, [user]);

  if (!isOpen || !user) return null;

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
      else setError("Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const handleUnlockAccount = () => {
    setIsLocked(false);
    setNoShowCount(0);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
        <h2 className="text-lg font-bold mb-4 text-gray-800">Edit User ({user.email})</h2>
        {error && <div className="p-2 bg-red-100 text-red-700 text-sm rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border px-3 py-2 rounded text-sm text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Department</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full border px-3 py-2 rounded text-sm text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full border px-3 py-2 rounded text-sm text-gray-900"
            >
              <option value="MEMBER">MEMBER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          <div className="border-t pt-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Account Lock Status:</span>
              <span className={isLocked ? "text-red-600 font-bold text-sm" : "text-green-600 font-bold text-sm"}>
                {isLocked ? "Locked" : "Active"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">No-Show Count:</span>
              <input
                type="number"
                min="0"
                value={noShowCount}
                onChange={(e) => setNoShowCount(Number(e.target.value))}
                className="w-20 border px-2 py-1 rounded text-sm text-gray-900 text-right"
              />
            </div>
            {isLocked && (
              <button
                type="button"
                onClick={handleUnlockAccount}
                className="w-full bg-green-600 hover:bg-green-700 text-white text-xs py-1.5 rounded font-medium"
              >
                🔓 Unlock Account & Reset No-Show Count
              </button>
            )}
          </div>

          <div className="flex justify-end gap-2 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border text-gray-700 text-sm rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
