"use client";

import { useState } from "react";
import type { Booking } from "@/types";
import { Calendar, Clock, Lock, CheckCircle2 } from "lucide-react";

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
    <div className="bg-white border border-zinc-200/90 rounded-xl p-5 sm:p-6 shadow-xs mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-zinc-100">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-zinc-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-zinc-500" />
            Schedule Timeline
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">Availability breakdown for 08:00 – 19:00</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-zinc-600">Date:</label>
          <input
            type="date"
            value={date}
            onChange={handleDateSubmit}
            className="px-2.5 py-1.5 text-xs bg-zinc-50/50 border border-zinc-200 rounded-md text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white focus:ring-1 focus:ring-zinc-900 transition-colors"
          />
        </div>
      </div>

      <div className="space-y-1.5 pt-4">
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
            <div key={hour} className="flex items-center gap-3 text-xs py-1">
              <span className="w-12 font-mono text-[11px] text-zinc-400 font-medium text-right shrink-0">
                {hour.toString().padStart(2, "0")}:00
              </span>
              <div
                className={`flex-1 px-3 py-2 rounded-md transition-all ${
                  isOccupied
                    ? "bg-rose-50/80 border border-rose-200/80 text-rose-900 font-medium"
                    : "bg-zinc-50 hover:bg-zinc-100/70 border border-zinc-150 text-zinc-600"
                }`}
              >
                {isOccupied ? (
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 truncate">
                      <Lock className="w-3 h-3 text-rose-600 shrink-0" />
                      <span className="truncate">{matchingBookings.map((mb) => mb.title).join(", ")}</span>
                    </div>
                    <span className="text-[10px] text-rose-700 bg-rose-100/70 px-1.5 py-0.2 rounded font-mono shrink-0">
                      Reserved
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <CheckCircle2 className="w-3 h-3 text-zinc-400" />
                    <span>Available</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
