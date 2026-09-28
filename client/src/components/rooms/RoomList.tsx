import { Room } from "@/types";

interface RoomListProps {
  rooms: Room[];
}

export default function RoomList({ rooms }: RoomListProps) {
  if (rooms.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        ยังไม่มีห้องประชุมในระบบ
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {rooms.map((room) => (
        <div
          key={room.id}
          className="border rounded-lg p-4 shadow-sm hover:shadow transition bg-white"
        >
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-lg font-bold text-gray-800">{room.name}</h2>
            <span
              className={`text-xs px-2 py-1 rounded font-medium ${
                room.is_active
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {room.is_active ? "เปิดใช้งาน" : "ปิดปรับปรุง"}
            </span>
          </div>

          <div className="text-sm text-gray-600 space-y-1">
            <p>
              ตึก: {room.building} (ชั้น {room.floor})
            </p>
            <p>ความจุ: {room.capacity} ที่นั่ง</p>
            {room.requires_approval && (
              <p className="text-amber-600 text-xs mt-1">
                * ต้องรอแอดมินอนุมัติ
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
