"use client";

import type { Booking } from "@/types";
import { X, CheckCircle2 } from "lucide-react";

interface BookingDetailModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BookingDetailModal({ booking, isOpen, onClose }: BookingDetailModalProps) {
  if (!isOpen || !booking) return null;

  const start = new Date(booking.start_time);
  const end = new Date(booking.end_time);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-xl border border-zinc-200 shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <div>
            <h2 className="text-base font-semibold text-zinc-900">{booking.title}</h2>
            <p className="text-[11px] font-mono text-zinc-400 mt-0.5">{booking.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div className="p-3.5 bg-zinc-50 rounded-lg border border-zinc-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 font-medium">Status</span>
              <span className="font-semibold text-zinc-900">{booking.status}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-500 font-medium">Date & Time</span>
              <span className="font-medium text-zinc-800">
                {start.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} &bull;{" "}
                {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} –{" "}
                {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>

          {booking.check_in_pin && (
            <div className="p-4 bg-zinc-900 text-white rounded-lg text-center shadow-xs">
              <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-medium block mb-1">
                Kiosk Check-In Access PIN
              </span>
              <span className="text-2xl font-mono font-bold tracking-widest text-white">
                {booking.check_in_pin}
              </span>
            </div>
          )}

          {booking.checked_in_at && (
            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 p-3 rounded-lg">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Checked in at {new Date(booking.checked_in_at).toLocaleString("en-US")}</span>
            </div>
          )}

          {booking.rejection_reason && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 space-y-1">
              <span className="font-semibold block">Decline Reason:</span>
              <p className="text-rose-700">{booking.rejection_reason}</p>
            </div>
          )}

          {booking.cancellation_reason && (
            <div className="p-3 bg-zinc-100 border border-zinc-200 rounded-lg text-zinc-700 space-y-1">
              <span className="font-semibold block">Cancellation Reason:</span>
              <p className="text-zinc-600">{booking.cancellation_reason}</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end px-6 py-4 border-t border-zinc-100 bg-zinc-50/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 rounded-md border border-zinc-200 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
