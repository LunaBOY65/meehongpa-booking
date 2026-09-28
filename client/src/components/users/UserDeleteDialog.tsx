"use client";

import type { User } from "@/types";

interface UserDeleteDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export function UserDeleteDialog({ user, isOpen, onClose, onConfirm }: UserDeleteDialogProps) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Delete User</h3>
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to remove user <span className="font-semibold text-gray-900">{user.full_name} ({user.email})</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-sm text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              await onConfirm(user.id);
              onClose();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Delete User
          </button>
        </div>
      </div>
    </div>
  );
}
