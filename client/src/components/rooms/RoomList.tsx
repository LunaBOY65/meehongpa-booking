"use client";

import Link from "next/link";
import type { Room } from "@/types";

interface RoomListProps {
  rooms: Room[];
  isAdmin?: boolean;
  onEdit?: (room: Room) => void;
  onDelete?: (room: Room) => void;
}

export function RoomList({ rooms, isAdmin, onEdit, onDelete }: RoomListProps) {
  if (rooms.length === 0) {
    return (
      <div className="p-8 text-center border rounded-lg bg-gray-50 text-gray-500">
        ไม่พบห้องประชุมตามเงื่อนไขที่กำหนด
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {rooms.map((room) => (
        <div
          key={room.id}
          className="bg-white border rounded-lg p-5 shadow-sm hover:shadow transition-shadow flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-gray-800">{room.name}</h3>
              <span
                className={`text-xs px-2 py-0.5 rounded font-medium ${
                  room.is_active
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {room.is_active ? "Active" : "Disabled"}
              </span>
            </div>

            <div className="space-y-1 text-sm text-gray-600 mb-4">
              <p>📍 Building: {room.building} (Floor {room.floor})</p>
              <p>👥 Capacity: {room.capacity} seats</p>
              <p>
                🔒 Requires Approval:{" "}
                <span className="font-semibold">
                  {room.requires_approval ? "Yes" : "No (Auto-Approve)"}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between border-t pt-3 mt-2">
            <Link
              href={`/rooms/${room.id}`}
              className="text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded font-medium"
            >
              View Schedule / Book &rarr;
            </Link>

            {isAdmin && (
              <div className="flex gap-2">
                {onEdit && (
                  <button
                    onClick={() => onEdit(room)}
                    className="text-xs bg-slate-700 text-white px-2.5 py-1.5 rounded hover:bg-slate-800"
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(room)}
                    className="text-xs bg-red-600 text-white px-2.5 py-1.5 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
