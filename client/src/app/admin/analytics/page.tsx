"use client";

import { useEffect, useState, useCallback } from "react";
import { analyticsService } from "@/services/analytics.service";
import { roomService } from "@/services/room.service";
import { AnalyticsSummaryCards } from "@/components/analytics/AnalyticsSummaryCards";
import { RoomUtilizationChart } from "@/components/analytics/RoomUtilizationChart";
import { UserLockoutTable } from "@/components/analytics/UserLockoutTable";
import type {
  AnalyticsSummaryResponse,
  RoomUtilizationResponse,
  UserLockoutItem,
  Room,
} from "@/types";

export default function AdminAnalyticsPage() {
  const [summary, setSummary] = useState<AnalyticsSummaryResponse | null>(null);
  const [utilization, setUtilization] = useState<RoomUtilizationResponse | null>(null);
  const [lockouts, setLockouts] = useState<UserLockoutItem[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string>("");

  const [month, setMonth] = useState<number>(9);
  const [year, setYear] = useState<number>(2026);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = useCallback(async () => {
    try {
      const roomList = await roomService.getRooms();
      setRooms(roomList);
      if (roomList.length > 0 && !selectedRoomId) {
        setSelectedRoomId(roomList[0].id);
      }
    } catch {
      // Ignore room fetch error if offline or empty
    }
  }, [selectedRoomId]);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const summaryData = await analyticsService.getSummary({ month, year });
      setSummary(summaryData);

      const lockoutData = await analyticsService.getUserLockouts();
      setLockouts(lockoutData.locked_users);

      if (selectedRoomId) {
        const utilData = await analyticsService.getRoomUtilization({
          room_id: selectedRoomId,
          month,
          year,
        });
        setUtilization(utilData);
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  }, [month, year, selectedRoomId]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">📊 Facility Analytics & Reports</h1>
          <p className="text-sm text-gray-500">Monitor reservation KPIs, room utilization rates, and no-show lockouts</p>
        </div>

        <div className="flex items-center gap-3 bg-white p-2 border rounded-lg shadow-sm">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-0.5">Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="border px-2 py-1 rounded text-xs text-gray-900"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <option key={m} value={m}>
                  Month {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-0.5">Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="border px-2 py-1 rounded text-xs text-gray-900 w-20"
            />
          </div>
        </div>
      </div>

      {error && <div className="p-3 bg-red-100 text-red-700 text-sm rounded">{error}</div>}

      <AnalyticsSummaryCards data={summary} />

      <div className="bg-white border rounded-lg p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-lg font-bold text-gray-800">Select Room for Utilization Breakdown</h2>
          <select
            value={selectedRoomId}
            onChange={(e) => setSelectedRoomId(e.target.value)}
            className="border px-3 py-1.5 rounded text-sm text-gray-900 max-w-xs"
          >
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.building})
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading chart data...</div>
        ) : (
          <RoomUtilizationChart data={utilization} />
        )}
      </div>

      <UserLockoutTable users={lockouts} />
    </div>
  );
}
