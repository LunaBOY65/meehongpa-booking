"use client";

import { useState } from "react";
import type { CreateBookingRequest } from "@/types";
import { Loader2, AlertCircle, CalendarPlus } from "lucide-react";

const TIME_OPTIONS = Array.from({ length: 29 }, (_, index) => {
  const totalMinutes = 8 * 60 + index * 30;
  const hours = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (totalMinutes % 60).toString().padStart(2, "0");
  const value = `${hours}:${minutes}`;

  return { value, label: value };
});

interface BookingFormProps {
  roomId: string;
  onSuccess: () => void;
  onSubmitBooking: (data: CreateBookingRequest) => Promise<void>;
}

export function BookingForm({
  roomId,
  onSuccess,
  onSubmitBooking,
}: BookingFormProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [startTimeStr, setStartTimeStr] = useState("08:00");
  const [endTimeStr, setEndTimeStr] = useState("22:00");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (startTimeStr >= endTimeStr) {
      setError("End time must be after start time");
      return;
    }

    setLoading(true);

    try {
      const startIso = new Date(`${date}T${startTimeStr}:00Z`).toISOString();
      const endIso = new Date(`${date}T${endTimeStr}:00Z`).toISOString();

      await onSubmitBooking({
        room_id: roomId,
        title,
        start_time: startIso,
        end_time: endIso,
      });

      setTitle("");
      onSuccess();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to reserve meeting room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-zinc-200/90 rounded-xl p-5 sm:p-6 shadow-xs space-y-4"
    >
      <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
        <CalendarPlus className="w-4 h-4 text-zinc-700" />
        <h2 className="text-base font-semibold tracking-tight text-zinc-900">
          Reserve Room
        </h2>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-zinc-700 mb-1.5">
          Meeting Title <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Q4 Sprint Planning"
          className="w-full px-3 py-2 text-sm bg-white border border-zinc-200 rounded-md text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-700 mb-1.5">
          Date <span className="text-rose-500">*</span>
        </label>
        <input
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-white border border-zinc-200 rounded-md text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-zinc-700 mb-1.5">
            Start Time <span className="text-rose-500">*</span>
          </label>
          <select
            required
            aria-label="Start time (24-hour format)"
            value={startTimeStr}
            onChange={(e) => setStartTimeStr(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-zinc-200 rounded-md text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
          >
            {TIME_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value} disabled={value >= endTimeStr}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-700 mb-1.5">
            End Time <span className="text-rose-500">*</span>
          </label>
          <select
            required
            aria-label="End time (24-hour format)"
            value={endTimeStr}
            onChange={(e) => setEndTimeStr(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-zinc-200 rounded-md text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
          >
            {TIME_OPTIONS.map(({ value, label }) => (
              <option
                key={value}
                value={value}
                disabled={value <= startTimeStr}
              >
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-2 flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-md disabled:bg-zinc-300 disabled:cursor-not-allowed transition-colors shadow-xs"
      >
        {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
        <span>
          {loading ? "Confirming Reservation..." : "Confirm Reservation"}
        </span>
      </button>
    </form>
  );
}
