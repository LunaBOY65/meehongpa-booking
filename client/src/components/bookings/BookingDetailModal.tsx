"use client";

import type { Booking } from "@/types";

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
        <div className="flex justify-between items-start mb-4 border-b pb-3">
          <div>
            <h2 className="text-lg font-bold text-gray-800">{booking.title}</h2>
            <p className="text-xs text-gray-500">ID: {booking.id}</p>
          </div>
          <span className="px-2.5 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">
            {booking.status}
          </span>
        </div>

        <div className="space-y-3 text-sm text-gray-700">
          <div>
            <span className="text-gray-500 block">Date & Time</span>
            <span className="font-medium">
              {start.toLocaleDateString("th-TH")} ({start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
            </span>
          </div>

          {booking.check_in_pin && (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded text-center">
              <span className="text-xs text-blue-700 uppercase font-semibold block">Check-In Access PIN</span>
              <span className="text-2xl font-mono font-bold tracking-widest text-blue-900">
                {booking.check_in_pin}
              </span>
            </div>
          )}

          {booking.checked_in_at && (
            <div>
              <span className="text-gray-500 block">Checked In At</span>
              <span className="font-medium">{new Date(booking.checked_in_at).toLocaleString("th-TH")}</span>
            </div>
          )}

          {booking.rejection_reason && (
            <div className="bg-red-50 p-3 rounded text-red-700 text-xs">
              <strong>Rejection Reason:</strong> {booking.rejection_reason}
            </div>
          )}

          {booking.cancellation_reason && (
            <div className="bg-gray-100 p-3 rounded text-gray-700 text-xs">
              <strong>Cancellation Reason:</strong> {booking.cancellation_reason}
            </div>
          )}
        </div>

        <div className="flex justify-end border-t pt-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-white text-sm rounded hover:bg-slate-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
