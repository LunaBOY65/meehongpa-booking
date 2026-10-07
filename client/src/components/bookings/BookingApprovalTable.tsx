"use client";

import type { Booking } from "@/types";
import type { Room, User } from "@/types";
import { formatUtcTime } from "@/utils/date-time";
import { Clock, Check, X, Inbox, MapPin, Users as UsersIcon } from "lucide-react";

interface BookingApprovalTableProps {
  bookings: Booking[];
  rooms: Room[];
  users: User[];
  onApprove: (booking: Booking) => void;
  onReject: (booking: Booking) => void;
}

export function BookingApprovalTable({
  bookings,
  rooms,
  users,
  onApprove,
  onReject,
}: BookingApprovalTableProps) {
  if (bookings.length === 0) {
    return (
      <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center">
        <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-3 text-zinc-400">
          <Inbox className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-900">All caught up</h3>
        <p className="text-xs text-zinc-500 mt-1">
          There are no pending room reservation requests awaiting approval.
        </p>
      </div>
    );
  }

  const roomsById = new Map(rooms.map((room) => [room.id, room]));
  const usersById = new Map(users.map((user) => [user.id, user]));
  const sortedBookings = [...bookings].sort(
    (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
  );

  return (
    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50/75 text-[12px] font-medium text-zinc-500 uppercase tracking-wider">
              <th className="py-3 px-4">Reservation Title</th>
              <th className="py-3 px-4">Room</th>
              <th className="py-3 px-4">Requested By</th>
              <th className="py-3 px-4">Time Window</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 text-zinc-800">
            {sortedBookings.map((b) => {
              const start = new Date(b.start_time);
              const room = roomsById.get(b.room_id);
              const user = usersById.get(b.user_id);

              return (
                <tr
                  key={b.id}
                  className="hover:bg-zinc-50/50 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-zinc-900">{b.title}</div>
                  </td>
                  <td className="py-3.5 px-4 text-xs">
                    <div className="font-medium text-zinc-800">
                      {room?.name ?? "Room unavailable"}
                    </div>
                    {room && (
                      <div className="mt-1 flex flex-col gap-1 text-[11px] text-zinc-500">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3 shrink-0" />
                          {room.building} · Floor {room.floor}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <UsersIcon className="h-3 w-3 shrink-0" />
                          Capacity {room.capacity}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-xs">
                    <div className="font-medium text-zinc-800">
                      {user?.full_name ?? "User unavailable"}
                    </div>
                    {user?.email && (
                      <div className="mt-1 text-[11px] text-zinc-500">
                        {user.email}
                      </div>
                    )}
                    {user?.department && (
                      <div className="text-[11px] text-zinc-400">
                        {user.department}
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-zinc-600">
                    <div>
                      {start.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <div className="text-zinc-400">
                      {formatUtcTime(b.start_time)}{" "}
                      –{" "}
                      {formatUtcTime(b.end_time)}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                      <Clock className="w-3 h-3" />
                      Pending Review
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => onApprove(b)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 px-2.5 py-1 rounded-md transition-colors shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Approve
                      </button>
                      <button
                        onClick={() => onReject(b)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 hover:text-rose-700 bg-white hover:bg-rose-50 border border-zinc-200 hover:border-rose-200 px-2.5 py-1 rounded-md transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                        Decline
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
