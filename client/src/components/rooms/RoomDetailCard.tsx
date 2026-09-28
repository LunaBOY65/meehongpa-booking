"use client";

import type { Room } from "@/types";

interface RoomDetailCardProps {
  room: Room;
}

export function RoomDetailCard({ room }: RoomDetailCardProps) {
  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm mb-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{room.name}</h1>
          <p className="text-sm text-gray-500">
            {room.building} &bull; Floor {room.floor}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded text-sm font-semibold ${
            room.is_active
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {room.is_active ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t pt-4 text-sm text-gray-700">
        <div>
          <span className="text-gray-500 block">Capacity</span>
          <span className="font-semibold text-lg">{room.capacity} seats</span>
        </div>
        <div>
          <span className="text-gray-500 block">Approval Required</span>
          <span className="font-semibold text-lg">
            {room.requires_approval ? "Yes (Admin Review)" : "No (Instant)"}
          </span>
        </div>
        <div>
          <span className="text-gray-500 block">Building & Floor</span>
          <span className="font-semibold text-lg">{room.building} / Fl. {room.floor}</span>
        </div>
      </div>
    </div>
  );
}
