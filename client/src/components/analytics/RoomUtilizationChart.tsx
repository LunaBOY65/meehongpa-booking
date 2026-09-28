"use client";

import type { RoomUtilizationResponse } from "@/types";

interface RoomUtilizationChartProps {
  data: RoomUtilizationResponse | null;
}

export function RoomUtilizationChart({ data }: RoomUtilizationChartProps) {
  if (!data || data.daily_data.length === 0) {
    return (
      <div className="bg-white border rounded-lg p-6 text-center text-gray-500">
        No utilization data available.
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg p-5 shadow-sm mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">📈 Daily Utilization Rates (%)</h3>
      <div className="space-y-3">
        {data.daily_data.map((item) => (
          <div key={item.date} className="space-y-1">
            <div className="flex justify-between text-xs text-gray-600">
              <span className="font-mono">{item.date}</span>
              <span>
                <strong>{item.total_booked_hours} hrs</strong> ({item.utilization_percentage}%) - {item.booking_count} bookings
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${Math.min(100, item.utilization_percentage)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
