"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { Room, CreateRoomRequest, UpdateRoomRequest } from "@/types";
import { getRoomImageUrl } from "@/services/room.service";
import { X, Loader2, AlertCircle, Building2, ImagePlus } from "lucide-react";

interface RoomFormModalProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateRoomRequest | UpdateRoomRequest, id?: string, image?: File) => Promise<void>;
}

function RoomFormContent({
  room,
  onClose,
  onSave,
}: {
  room: Room | null;
  onClose: () => void;
  onSave: (data: CreateRoomRequest | UpdateRoomRequest, id?: string, image?: File) => Promise<void>;
}) {
  const [name, setName] = useState(room?.name || "");
  const [capacity, setCapacity] = useState(room?.capacity || 10);
  const [building, setBuilding] = useState(room?.building || "");
  const [floor, setFloor] = useState(room?.floor || "");
  const [requiresApproval, setRequiresApproval] = useState(room?.requires_approval || false);
  const [isActive, setIsActive] = useState(room?.is_active ?? true);
  const [image, setImage] = useState<File | undefined>();
  const imagePreview = useMemo(
    () => image ? URL.createObjectURL(image) : room?.image_url ? getRoomImageUrl(room.image_url) : null,
    [image, room]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

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
          room.id,
          image
        );
      } else {
        await onSave({
          name,
          capacity,
          building,
          floor,
          requires_approval: requiresApproval,
        }, undefined, image);
      }
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to save room details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-zinc-200 shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-zinc-600" />
          <h2 className="text-base font-semibold text-zinc-900">
            {room ? "Edit Meeting Room" : "Add Meeting Room"}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {error && (
        <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label className="block text-xs font-medium text-zinc-700 mb-1.5">
            Room Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Executive Boardroom 4A"
            className="w-full px-3 py-2 text-sm bg-white border border-zinc-200 rounded-md text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1.5">
              Capacity <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              required
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm bg-white border border-zinc-200 rounded-md text-zinc-900 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors text-right"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1.5">
              Building <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={building}
              onChange={(e) => setBuilding(e.target.value)}
              placeholder="Tower A"
              className="w-full px-3 py-2 text-sm bg-white border border-zinc-200 rounded-md text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1.5">
              Floor <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              placeholder="4"
              className="w-full px-3 py-2 text-sm bg-white border border-zinc-200 rounded-md text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-700 mb-1.5">
            Room Photo <span className="text-zinc-400">(optional, max 5 MB)</span>
          </label>
          <label className="flex items-center gap-3 p-3 border border-dashed border-zinc-300 rounded-lg cursor-pointer hover:bg-zinc-50">
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Room preview"
                width={96}
                height={64}
                unoptimized
                className="h-16 w-24 rounded object-cover"
              />
            ) : (
              <span className="h-16 w-24 rounded bg-zinc-100 flex items-center justify-center text-zinc-400">
                <ImagePlus className="w-5 h-5" />
              </span>
            )}
            <span className="text-xs text-zinc-600">
              {image ? image.name : room?.image_url ? "Choose a new photo to replace the current one" : "Choose a room photo"}
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="sr-only"
              onChange={(event) => {
                const selectedImage = event.target.files?.[0];
                if (!selectedImage) return;
                if (selectedImage.size > 5 * 1024 * 1024) {
                  setImage(undefined);
                  setError("Image must be 5 MB or smaller");
                  event.target.value = "";
                  return;
                }
                if (!["image/jpeg", "image/png", "image/gif", "image/webp"].includes(selectedImage.type)) {
                  setImage(undefined);
                  setError("Choose a JPG, PNG, GIF, or WEBP image");
                  event.target.value = "";
                  return;
                }
                setImage(selectedImage);
                setError(null);
              }}
            />
          </label>
        </div>

        <div className="pt-2 space-y-2.5">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={requiresApproval}
              onChange={(e) => setRequiresApproval(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
            />
            <div className="text-xs">
              <span className="font-medium text-zinc-900 block">Require Admin Approval</span>
              <span className="text-zinc-500">Reservations will stay PENDING until confirmed by an admin.</span>
            </div>
          </label>

          {room && (
            <label className="flex items-start gap-2.5 cursor-pointer select-none pt-1">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
              />
              <div className="text-xs">
                <span className="font-medium text-zinc-900 block">Facility Active</span>
                <span className="text-zinc-500">Uncheck to disable booking for maintenance.</span>
              </div>
            </label>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-100">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 rounded-md border border-zinc-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-md disabled:bg-zinc-300 disabled:cursor-not-allowed transition-colors shadow-xs"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{room ? "Update Room" : "Create Room"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export function RoomFormModal({ room, isOpen, onClose, onSave }: RoomFormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs">
      <RoomFormContent key={room ? room.id : "new"} room={room} onClose={onClose} onSave={onSave} />
    </div>
  );
}
