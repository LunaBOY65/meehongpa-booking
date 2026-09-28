"use client";

import { useState } from "react";
import type { Booking } from "@/types";
import { X, CheckCircle2, Loader2 } from "lucide-react";

interface BookingApproveModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export function BookingApproveModal({ booking, isOpen, onClose, onConfirm }: BookingApproveModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !booking) return null;

  const handleApprove = async () => {
    setLoading(true);
    try {
      await onConfirm(booking.id);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-xl border border-zinc-200 shadow-xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <div className="flex items-center gap-2 text-zinc-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-semibold">Approve Reservation</h3>
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
            Confirm approval for <strong className="text-zinc-900 font-semibold">&ldquo;{booking.title}&rdquo;</strong>? This will transition the booking to Confirmed status and generate a 6-digit kiosk PIN for the organizer.
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
              onClick={handleApprove}
              disabled={loading}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-md disabled:bg-zinc-300 transition-colors shadow-xs"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Approve & Issue PIN</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
