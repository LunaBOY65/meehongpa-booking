"use client";

import Link from "next/link";
import type { Room } from "@/types";
import { DoorOpen, Users, MapPin, ShieldAlert, ArrowRight, Edit3, Trash2, CheckCircle2 } from "lucide-react";

interface RoomListProps {
  rooms: Room[];
  isAdmin?: boolean;
  onEdit?: (room: Room) => void;
  onDelete?: (room: Room) => void;
}

export function RoomList({ rooms, isAdmin, onEdit, onDelete }: RoomListProps) {
  if (rooms.length === 0) {
    return (
      <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center">
        <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-3 text-zinc-400">
          <DoorOpen className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-900">No meeting rooms found</h3>
        <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
          We couldn&apos;t find any rooms matching your search parameters. Try resetting your filter settings.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {rooms.map((room) => (
        <div
          key={room.id}
          className="bg-white border border-zinc-200/90 rounded-xl p-5 shadow-xs hover:border-zinc-300 hover:shadow-sm transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="text-base font-semibold text-zinc-900 tracking-tight group-hover:text-blue-600 transition-colors">
                  {room.name}
                </h3>
                <p className="text-xs text-zinc-500 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{room.building} &bull; Floor {room.floor}</span>
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                  room.is_active
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${room.is_active ? "bg-emerald-500" : "bg-rose-500"}`} />
                {room.is_active ? "Available" : "Maintenance"}
              </span>
            </div>

            <div className="flex items-center gap-4 py-3 border-y border-zinc-100 text-xs text-zinc-600 mb-4">
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-zinc-400" />
                <span><strong className="text-zinc-900 font-semibold">{room.capacity}</strong> seats</span>
              </div>
              <div className="flex items-center gap-1.5">
                {room.requires_approval ? (
                  <span className="text-amber-700 font-medium flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Approval required
                  </span>
                ) : (
                  <span className="text-zinc-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Instant booking
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <Link
              href={`/rooms/${room.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-900 hover:text-blue-600 transition-colors"
            >
              <span>Schedule & Reserve</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {isAdmin && (
              <div className="inline-flex items-center gap-1">
                {onEdit && (
                  <button
                    onClick={() => onEdit(room)}
                    className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
                    title="Edit Room"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(room)}
                    className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                    title="Delete Room"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
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
