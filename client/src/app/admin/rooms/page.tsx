"use client";

import { useEffect, useState, useCallback } from "react";
import { roomService } from "@/services/room.service";
import { RoomList } from "@/components/rooms/RoomList";
import { RoomFormModal } from "@/components/rooms/RoomFormModal";
import { RoomDeleteDialog } from "@/components/rooms/RoomDeleteDialog";
import type { Room, CreateRoomRequest, UpdateRoomRequest } from "@/types";

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await roomService.getRooms();
      setRooms(data);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleOpenAdd = () => {
    setSelectedRoom(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (room: Room) => {
    setSelectedRoom(room);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (room: Room) => {
    setSelectedRoom(room);
    setIsDeleteOpen(true);
  };

  const handleSaveRoom = async (
    data: CreateRoomRequest | UpdateRoomRequest,
    id?: string
  ) => {
    if (id) {
      await roomService.updateRoom(id, data as UpdateRoomRequest);
    } else {
      await roomService.createRoom(data as CreateRoomRequest);
    }
    fetchRooms();
  };

  const handleDeleteRoom = async (id: string) => {
    await roomService.deleteRoom(id);
    fetchRooms();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">🏢 Admin Room Management</h1>
          <p className="text-sm text-gray-500">Create, update, or remove meeting room facilities</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-semibold shadow"
        >
          + Add New Room
        </button>
      </div>

      {error && <div className="p-3 bg-red-100 text-red-700 text-sm rounded">{error}</div>}

      {loading ? (
        <div className="p-8 text-center text-gray-500">Loading rooms...</div>
      ) : (
        <RoomList
          rooms={rooms}
          isAdmin={true}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />
      )}

      <RoomFormModal
        room={selectedRoom}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveRoom}
      />

      <RoomDeleteDialog
        room={selectedRoom}
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteRoom}
      />
    </div>
  );
}
