"use client";

import type { RoomUtilizationResponse } from "@/types";
import { BarChart3 } from "lucide-react";

interface RoomUtilizationChartProps {
  data: RoomUtilizationResponse | null;
}

export function RoomUtilizationChart({ data }: RoomUtilizationChartProps) {
  if (!data || data.daily_data.length === 0) {
    return (
      <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center">
        <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-3 text-zinc-400">
          <BarChart3 className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-900">No utilization data</h3>
        <p className="text-xs text-zinc-500 mt-1">Select a room to analyze daily booking occupancy.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-zinc-200/90 rounded-xl p-5 sm:p-6 shadow-xs mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-zinc-900">Daily Occupancy & Utilization</h3>
          <p className="text-xs text-zinc-500 mt-0.5">Calculated based on a standard 10-hour business day (08:00 – 18:00)</p>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        {data.daily_data.map((item) => {
          const dateObj = new Date(item.date);
          const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

          return (
            <div key={item.date} className="space-y-1 text-xs">
              <div className="flex items-center justify-between text-zinc-600">
                <span className="font-medium text-zinc-800">{dayName}</span>
                <span className="font-mono text-zinc-500 text-[11px]">
                  <strong className="text-zinc-900 font-semibold">{item.total_booked_hours} hrs</strong> ({item.utilization_percentage}%) &bull; {item.booking_count} reservation{item.booking_count === 1 ? "" : "s"}
                </span>
              </div>
              <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    item.utilization_percentage > 75
                      ? "bg-zinc-900"
                      : item.utilization_percentage > 40
                      ? "bg-zinc-700"
                      : "bg-zinc-400"
                  }`}
                  style={{ width: `${Math.min(100, item.utilization_percentage)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
