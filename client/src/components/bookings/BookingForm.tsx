"use client";

import { useState } from "react";
import type { CreateBookingRequest } from "@/types";

interface BookingFormProps {
  roomId: string;
  onSuccess: () => void;
  onSubmitBooking: (data: CreateBookingRequest) => Promise<void>;
}

export function BookingForm({ roomId, onSuccess, onSubmitBooking }: BookingFormProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [startTimeStr, setStartTimeStr] = useState("09:00");
  const [endTimeStr, setEndTimeStr] = useState("10:00");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
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
    <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-5 shadow-sm space-y-4">
      <h2 className="text-lg font-bold text-gray-800 border-b pb-2">📝 Reserve This Room</h2>

      {error && <div className="p-2 bg-red-100 text-red-700 text-sm rounded">{error}</div>}

      <div>
        <label className="block text-sm text-gray-700 mb-1">Meeting Title</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Weekly Team Sync"
          className="w-full border px-3 py-2 rounded text-sm text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-700 mb-1">Date</label>
        <input
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border px-3 py-2 rounded text-sm text-gray-900"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Start Time</label>
          <input
            type="time"
            required
            value={startTimeStr}
            onChange={(e) => setStartTimeStr(e.target.value)}
            className="w-full border px-3 py-2 rounded text-sm text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">End Time</label>
          <input
            type="time"
            required
            value={endTimeStr}
            onChange={(e) => setEndTimeStr(e.target.value)}
            className="w-full border px-3 py-2 rounded text-sm text-gray-900"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded text-sm font-semibold disabled:bg-gray-400 mt-2"
      >
        {loading ? "Submitting Request..." : "Confirm Booking"}
      </button>
    </form>
  );
}
