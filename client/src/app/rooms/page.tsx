// client/src/app/rooms/page.tsx
"use client";

import { useEffect, useState } from "react";
import { roomService } from "@/services/room.service";
import RoomList from "@/components/rooms/RoomList";
import type { Room } from "@/types";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const data = await roomService.getRooms();
        setRooms(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("ไม่สามารถโหลดข้อมูลห้องประชุมได้");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">ห้องประชุมทั้งหมด</h1>
      </div>

      {loading && <p className="text-gray-500">กำลังโหลดข้อมูลห้อง...</p>}
      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded mb-4">{error}</div>
      )}

      {!loading && !error && <RoomList rooms={rooms} />}
    </div>
  );
}
