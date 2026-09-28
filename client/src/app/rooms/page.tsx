"use client";

import { useEffect, useState, useCallback } from "react";
import { roomService } from "@/services/room.service";
import { RoomFilter } from "@/components/rooms/RoomFilter";
import { RoomList } from "@/components/rooms/RoomList";
import type { Room, RoomFilterParams } from "@/types";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleFilterRooms = async (params?: RoomFilterParams) => {
    setLoading(true);
    setError(null);
    try {
      const data = await roomService.getRooms(params);
      setRooms(data);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  // ดึงข้อมูลครั้งแรกเมื่อเปิดหน้าเว็บ
  useEffect(() => {
    let isMounted = true;
    async function loadInitialRooms() {
      try {
        const data = await roomService.getRooms();
        if (isMounted) setRooms(data);
      } catch (err: unknown) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch rooms",
          );
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            🚪 Meeting Rooms Catalog
          </h1>
          <p className="text-sm text-gray-500">
            Browse available facilities and reserve time slots
          </p>
        </div>
      </div>

      <RoomFilter onFilterChange={handleFilterRooms} />

      {error && (
        <div className="p-3 bg-red-100 text-red-700 text-sm rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center text-gray-500">
          Loading meeting rooms...
        </div>
      ) : (
        <RoomList rooms={rooms} />
      )}
    </div>
  );
}
