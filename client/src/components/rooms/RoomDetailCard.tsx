"use client";

import Image from "next/image";
import type { Room } from "@/types";
import { getRoomImageUrl } from "@/services/room.service";
import { DoorOpen, Users, MapPin, ShieldAlert, CheckCircle2 } from "lucide-react";

interface RoomDetailCardProps {
  room: Room;
}

export function RoomDetailCard({ room }: RoomDetailCardProps) {
  return (
    <div className="bg-white border border-zinc-200/90 rounded-xl overflow-hidden shadow-xs mb-6">
      {room.image_url && (
        <div className="relative h-56 sm:h-72 w-full bg-zinc-100">
          <Image
            src={getRoomImageUrl(room.image_url)}
            alt={`${room.name} room`}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 1024px"
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700 shrink-0">
              <DoorOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-zinc-900">{room.name}</h1>
              <p className="text-xs text-zinc-500 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                <span>{room.building} &bull; Floor {room.floor}</span>
              </p>
            </div>
          </div>

          <div>
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                room.is_active
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-rose-50 text-rose-700 border border-rose-200"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${room.is_active ? "bg-emerald-500" : "bg-rose-500"}`} />
              {room.is_active ? "Active Facility" : "Under Maintenance"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-xs">
          <div className="p-3.5 bg-zinc-50/75 rounded-lg border border-zinc-100">
            <span className="text-zinc-500 block font-medium mb-1">Room Capacity</span>
            <div className="text-base font-semibold text-zinc-900 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-zinc-500" />
              <span>{room.capacity} Persons</span>
            </div>
          </div>

          <div className="p-3.5 bg-zinc-50/75 rounded-lg border border-zinc-100">
            <span className="text-zinc-500 block font-medium mb-1">Reservation Policy</span>
            <div className="text-sm font-semibold text-zinc-900 flex items-center gap-1.5">
              {room.requires_approval ? (
                <span className="text-amber-700 font-medium flex items-center gap-1">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  Admin Approval Queue
                </span>
              ) : (
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Auto-Confirmed
                </span>
              )}
            </div>
          </div>

          <div className="p-3.5 bg-zinc-50/75 rounded-lg border border-zinc-100">
            <span className="text-zinc-500 block font-medium mb-1">Building Location</span>
            <div className="text-sm font-semibold text-zinc-900">
              {room.building}, Floor {room.floor}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
