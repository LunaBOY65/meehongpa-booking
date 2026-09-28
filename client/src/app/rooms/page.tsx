"use client";

import { useEffect, useState } from "react";
import { roomService } from "@/services/room.service";
import { RoomFilter } from "@/components/rooms/RoomFilter";
import { RoomList } from "@/components/rooms/RoomList";
import type { Room, RoomFilterParams } from "@/types";
import { Loader2, AlertCircle } from "lucide-react";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // User Action: filtering rooms
  const handleFilterChange = async (params?: RoomFilterParams) => {
    setLoading(true);
    setError(null);
    try {
      const data = await roomService.getRooms(params);
      setRooms(data);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to fetch meeting rooms");
    } finally {
      setLoading(false);
    }
  };

  // Initial Mount
  useEffect(() => {
    let isMounted = true;

    async function loadInitialRooms() {
      try {
        const data = await roomService.getRooms();
        if (isMounted) setRooms(data);
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to fetch meeting rooms");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadInitialRooms();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">Meeting Rooms</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Explore available workspaces, equipment capacities, and reservation schedules</p>
      </div>

      <RoomFilter onFilterChange={handleFilterChange} />

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2.5 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="p-16 flex items-center justify-center text-zinc-400 gap-2 text-xs">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading room catalog...</span>
        </div>
      ) : (
        <RoomList rooms={rooms} />
      )}
    </div>
  );
}
