"use client";

import { useEffect, useState } from "react";
import { roomService } from "@/services/room.service";
import { RoomList } from "@/components/rooms/RoomList";
import { RoomFormModal } from "@/components/rooms/RoomFormModal";
import { RoomDeleteDialog } from "@/components/rooms/RoomDeleteDialog";
import type { Room, CreateRoomRequest, UpdateRoomRequest } from "@/types";
import { Plus, Loader2, AlertCircle } from "lucide-react";

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

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

  const refreshRooms = async () => {
    try {
      const data = await roomService.getRooms();
      setRooms(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to refresh rooms");
    }
  };

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
    id?: string,
    image?: File
  ) => {
    let savedRoom: Room;
    if (id) {
      savedRoom = await roomService.updateRoom(id, data as UpdateRoomRequest);
    } else {
      savedRoom = await roomService.createRoom(data as CreateRoomRequest);
    }
    if (image) {
      try {
        await roomService.uploadRoomImage(savedRoom.id, image);
      } catch (err: unknown) {
        setSelectedRoom(savedRoom);
        await refreshRooms();
        throw new Error(
          `Room details were saved, but the photo could not be uploaded: ${
            err instanceof Error ? err.message : "Unknown error"
          }`
        );
      }
    }
    await refreshRooms();
  };

  const handleDeleteRoom = async (id: string) => {
    await roomService.deleteRoom(id);
    await refreshRooms();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900">Manage Meeting Rooms</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Add, modify specifications, or archive workspace rooms and equipment</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-md transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Meeting Room</span>
        </button>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2.5 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="p-16 flex items-center justify-center text-zinc-400 gap-2 text-xs">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading rooms...</span>
        </div>
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
