"use client";

import { useState } from "react";
import type { Booking } from "@/types";

interface BookingApproveModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export function BookingApproveModal({ booking, isOpen, onClose, onConfirm }: BookingApproveModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Approve Reservation</h3>
        <p className="text-sm text-gray-600 mb-4">
          Are you sure you want to approve reservation <span className="font-semibold text-gray-900">&quot;{booking.title}&quot;</span>? This will issue a 6-digit access PIN.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-sm text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              await onConfirm(booking.id);
              setLoading(false);
              onClose();
            }}
            className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? "Approving..." : "Approve & Issue PIN"}
          </button>
        </div>
      </div>
    </div>
  );
}
