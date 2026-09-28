"use client";

import { useState, useEffect } from "react";
import type { Room, CreateRoomRequest, UpdateRoomRequest } from "@/types";

interface RoomFormModalProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateRoomRequest | UpdateRoomRequest, id?: string) => Promise<void>;
}

export function RoomFormModal({ room, isOpen, onClose, onSave }: RoomFormModalProps) {
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState(10);
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (room) {
      setName(room.name);
      setCapacity(room.capacity);
      setBuilding(room.building);
      setFloor(room.floor);
      setRequiresApproval(room.requires_approval);
      setIsActive(room.is_active);
    } else {
      setName("");
      setCapacity(10);
      setBuilding("");
      setFloor("");
      setRequiresApproval(false);
      setIsActive(true);
    }
  }, [room, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (room) {
        await onSave(
          {
            name,
            capacity,
            building,
            floor,
            requires_approval: requiresApproval,
            is_active: isActive,
          },
          room.id
        );
      } else {
        await onSave({
          name,
          capacity,
          building,
          floor,
          requires_approval: requiresApproval,
        });
      }
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to save room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
        <h2 className="text-lg font-bold mb-4 text-gray-800">
          {room ? "Edit Meeting Room" : "Add New Meeting Room"}
        </h2>
        {error && <div className="p-2 bg-red-100 text-red-700 text-sm rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Room Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Boardroom A"
              className="w-full border px-3 py-2 rounded text-sm text-gray-900"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Capacity</label>
              <input
                type="number"
                min="1"
                required
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full border px-3 py-2 rounded text-sm text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Building</label>
              <input
                type="text"
                required
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                placeholder="Tower A"
                className="w-full border px-3 py-2 rounded text-sm text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Floor</label>
              <input
                type="text"
                required
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                placeholder="4"
                className="w-full border px-3 py-2 rounded text-sm text-gray-900"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="requires_approval"
              checked={requiresApproval}
              onChange={(e) => setRequiresApproval(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600"
            />
            <label htmlFor="requires_approval" className="text-sm text-gray-700">
              Requires Admin Approval
            </label>
          </div>

          {room && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600"
              />
              <label htmlFor="is_active" className="text-sm text-gray-700">
                Is Active (Open for Booking)
              </label>
            </div>
          )}

          <div className="flex justify-end gap-2 border-t pt-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border text-gray-700 text-sm rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? "Saving..." : room ? "Update Room" : "Create Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
