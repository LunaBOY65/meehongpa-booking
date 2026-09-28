"use client";

import { useState } from "react";
import type { Booking } from "@/types";
import { X, XCircle, Loader2, AlertCircle } from "lucide-react";

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
      setError("Please specify a reason for declining.");
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
      else setError("Failed to decline reservation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-xl border border-zinc-200 shadow-xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <div className="flex items-center gap-2 text-rose-600">
            <XCircle className="w-4 h-4" />
            <h3 className="text-sm font-semibold text-zinc-900">Decline Reservation</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-xs text-zinc-600 mb-4">
            Declining reservation <strong className="text-zinc-900 font-semibold">&ldquo;{booking.title}&rdquo;</strong>.
          </p>

          {error && (
            <div className="mb-3 p-2.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-800">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                Reason for Rejection <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Facility is reserved for executive meeting."
                className="w-full px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-3.5 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 rounded-md border border-zinc-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-md disabled:bg-rose-300 transition-colors shadow-xs"
              >
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Decline Booking</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
