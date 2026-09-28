"use client";

import { useState } from "react";
import type { User } from "@/types";
import { X, AlertTriangle, Loader2 } from "lucide-react";

interface UserDeleteDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export function UserDeleteDialog({ user, isOpen, onClose, onConfirm }: UserDeleteDialogProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !user) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onConfirm(user.id);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-xl border border-zinc-200 shadow-xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <div className="flex items-center gap-2 text-rose-600">
            <AlertTriangle className="w-4 h-4" />
            <h3 className="text-sm font-semibold text-zinc-900">Delete User Account</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-xs text-zinc-600 leading-relaxed">
            Are you sure you want to permanently remove <strong className="text-zinc-900 font-semibold">{user.full_name}</strong> ({user.email})? All associated reservations will be deleted. This action cannot be undone.
          </p>

          <div className="flex items-center justify-end gap-2 mt-6">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-3.5 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 rounded-md border border-zinc-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-md disabled:bg-rose-300 transition-colors shadow-xs"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Delete User</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
