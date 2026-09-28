"use client";

import { useState } from "react";
import type { Booking } from "@/types";

interface BookingRejectModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string, reason: string) => Promise<void>;
}

export function BookingRejectModal({ booking, isOpen, onClose, onConfirm }: BookingRejectModalProps) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !booking) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("Please specify a rejection reason.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await onConfirm(booking.id, reason);
      setReason("");
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to reject booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Reject Reservation</h3>
        <p className="text-sm text-gray-600 mb-4">
          Rejecting reservation <span className="font-semibold text-gray-900">&quot;{booking.title}&quot;</span>.
        </p>

        {error && <div className="p-2 bg-red-100 text-red-700 text-xs rounded mb-3">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Reason for Rejection *</label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Room maintenance scheduled during this time slot."
              className="w-full border px-3 py-2 rounded text-sm text-gray-900"
            />
          </div>

          <div className="flex justify-end gap-2 border-t pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded text-sm text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:bg-gray-400"
            >
              {loading ? "Rejecting..." : "Reject Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
