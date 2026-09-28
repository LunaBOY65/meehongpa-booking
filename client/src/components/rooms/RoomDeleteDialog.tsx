"use client";

import type { Room } from "@/types";

interface RoomDeleteDialogProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export function RoomDeleteDialog({ room, isOpen, onClose, onConfirm }: RoomDeleteDialogProps) {
  if (!isOpen || !room) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Room</h3>
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete room <span className="font-semibold text-gray-900">{room.name}</span> ({room.building})?
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
              await onConfirm(room.id);
              onClose();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Delete Room
          </button>
        </div>
      </div>
    </div>
  );
}
