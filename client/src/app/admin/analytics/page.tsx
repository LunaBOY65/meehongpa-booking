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
import { Loader2, AlertCircle, Calendar, Building2 } from "lucide-react";

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
      // Ignore room fetch error if empty
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
      else setError("Failed to fetch analytics metrics");
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900">Facility Analytics</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Track facility occupancy, check-in completion, and penalty metrics</p>
        </div>

        <div className="flex items-center gap-2 bg-white p-1.5 border border-zinc-200 rounded-lg shadow-xs self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-2">
            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-[11px] font-medium text-zinc-500">Period:</span>
          </div>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="px-2 py-1 text-xs bg-zinc-50 border border-zinc-200 rounded text-zinc-800 focus:outline-none focus:border-zinc-900"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
              const monthName = new Date(2026, m - 1).toLocaleString("en-US", { month: "short" });
              return (
                <option key={m} value={m}>
                  {monthName}
                </option>
              );
            })}
          </select>

          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-16 px-2 py-1 text-xs bg-zinc-50 border border-zinc-200 rounded text-zinc-800 focus:outline-none focus:border-zinc-900 font-mono"
          />
        </div>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2.5 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <AnalyticsSummaryCards data={summary} />

      <div className="bg-white border border-zinc-200/90 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-zinc-500" />
            <h2 className="text-sm font-semibold tracking-tight text-zinc-900">Room Occupancy Analysis</h2>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-zinc-500 font-medium">Facility:</label>
            <select
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-md text-zinc-900 focus:outline-none focus:border-zinc-900"
            >
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.building})
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-12 flex items-center justify-center text-zinc-400 gap-2 text-xs">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Calculating utilization metrics...</span>
          </div>
        ) : (
          <RoomUtilizationChart data={utilization} />
        )}
      </div>

      <UserLockoutTable users={lockouts} />
    </div>
  );
}
