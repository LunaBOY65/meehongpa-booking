"use client";

import { useState } from "react";
import { bookingService } from "@/services/booking.service";
import type { Booking } from "@/types";

export function CheckInForm() {
  const [bookingId, setBookingId] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successBooking, setSuccessBooking] = useState<Booking | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessBooking(null);
    setLoading(true);

    try {
      const res = await bookingService.checkIn({
        booking_id: bookingId.trim(),
        pin: pin.trim(),
      });
      setSuccessBooking(res);
      setBookingId("");
      setPin("");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to check in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white border rounded-xl p-6 shadow-md">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">🔑 Room Check-In Kiosk</h1>
        <p className="text-sm text-gray-500 mt-1">
          Enter your Booking ID and 6-digit access PIN to confirm attendance
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 text-sm rounded mb-4 text-center font-medium">
          ❌ {error}
        </div>
      )}

      {successBooking && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 text-sm rounded mb-6 space-y-1">
          <div className="text-base font-bold text-green-900">🎉 Check-In Successful!</div>
          <p>Meeting: <strong>{successBooking.title}</strong></p>
          <p>Checked In At: {successBooking.checked_in_at ? new Date(successBooking.checked_in_at).toLocaleTimeString("th-TH") : "-"}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Booking ID (UUID)</label>
          <input
            type="text"
            required
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
            className="w-full border px-3 py-2 rounded font-mono text-sm text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">6-Digit PIN</label>
          <input
            type="text"
            maxLength={6}
            required
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="123456"
            className="w-full border px-3 py-2 rounded font-mono text-center text-xl tracking-widest text-gray-900"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg text-base shadow disabled:bg-gray-400"
        >
          {loading ? "Verifying PIN..." : "CHECK-IN NOW"}
        </button>
      </form>
    </div>
  );
}
