"use client";

import { useState } from "react";
import type { Booking } from "@/types";

interface BookingCalendarProps {
  bookings: Booking[];
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export function BookingCalendar({ bookings, selectedDate, onDateChange }: BookingCalendarProps) {
  const [date, setDate] = useState(selectedDate);

  const handleDateSubmit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDate(val);
    onDateChange(val);
  };

  // Time slots from 08:00 to 18:00
  const hours = Array.from({ length: 11 }, (_, i) => i + 8);

  return (
    <div className="bg-white border rounded-lg p-5 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800">📅 Room Schedule Timeline</h2>
          <p className="text-xs text-gray-500">View reservations for the selected day</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-700">Select Date:</label>
          <input
            type="date"
            value={date}
            onChange={handleDateSubmit}
            className="border px-3 py-1.5 rounded text-sm text-gray-900"
          />
        </div>
      </div>

      <div className="space-y-2">
        {hours.map((hour) => {
          const slotStart = new Date(`${date}T${hour.toString().padStart(2, "0")}:00:00Z`);
          const slotEnd = new Date(`${date}T${(hour + 1).toString().padStart(2, "0")}:00:00Z`);

          const matchingBookings = bookings.filter((b) => {
            const start = new Date(b.start_time);
            const end = new Date(b.end_time);
            return start < slotEnd && end > slotStart && b.status !== "CANCELLED" && b.status !== "REJECTED";
          });

          const isOccupied = matchingBookings.length > 0;

          return (
            <div key={hour} className="flex items-center gap-4 border-b pb-2 text-sm">
              <span className="w-16 font-mono text-xs text-gray-500 font-semibold">
                {hour.toString().padStart(2, "0")}:00
              </span>
              <div
                className={`flex-1 p-2 rounded text-xs transition-colors ${
                  isOccupied
                    ? "bg-red-100 text-red-800 border border-red-200 font-medium"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                }`}
              >
                {isOccupied ? (
                  <div>
                    {matchingBookings.map((mb) => (
                      <span key={mb.id} className="block">
                        🔒 Booked: <strong>{mb.title}</strong> ({new Date(mb.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(mb.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                      </span>
                    ))}
                  </div>
                ) : (
                  <span>✅ Available</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
