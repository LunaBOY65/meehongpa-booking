"use client";

import { useState } from "react";
import { bookingService } from "@/services/booking.service";
import type { CheckInResult } from "@/types";
import {
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";

export function CheckInForm() {
  const [bookingId, setBookingId] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successBooking, setSuccessBooking] = useState<CheckInResult | null>(null);

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
      else
        setError("Failed to check in. Please verify your PIN and Booking ID.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="text-center mb-6">
          <div className="w-10 h-10 bg-zinc-900 text-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-xs">
            <KeyRound className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
            Room Check-In Kiosk
          </h1>
          <p className="text-xs text-zinc-500 mt-1 max-w-xs mx-auto">
            Enter your reservation identifier and 6-digit access PIN to record
            attendance
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2.5 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successBooking && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5 text-xs text-emerald-900">
            <div className="flex items-center gap-1.5 font-semibold text-sm text-emerald-950">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Check-In Successful
            </div>
            <p className="text-emerald-800">
              Meeting:{" "}
              <strong className="font-semibold text-emerald-950">
                {successBooking.title}
              </strong>
            </p>
            <p className="text-emerald-700 text-[11px]">
              Recorded at{" "}
              {successBooking.checked_in_at
                ? new Date(successBooking.checked_in_at).toLocaleTimeString(
                    "en-US",
                  )
                : "Now"}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1.5">
              Booking ID (UUID) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
              className="w-full px-3 py-2 text-xs font-mono bg-white border border-zinc-200 rounded-md text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1.5">
              6-Digit Access PIN <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              maxLength={6}
              required
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••••"
              className="w-full px-3 py-2.5 text-center text-lg font-mono tracking-widest bg-zinc-50 border border-zinc-200 rounded-md text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white focus:ring-1 focus:ring-zinc-900 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-md disabled:bg-zinc-300 disabled:cursor-not-allowed transition-colors shadow-xs"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying PIN...</span>
              </>
            ) : (
              <>
                <span>Confirm Attendance</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
