"use client";

import type { Booking } from "@/types";
import { Clock, Check, X, Inbox } from "lucide-react";

interface BookingApprovalTableProps {
  bookings: Booking[];
  onApprove: (booking: Booking) => void;
  onReject: (booking: Booking) => void;
}

export function BookingApprovalTable({
  bookings,
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

  return (
    <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50/75 text-[12px] font-medium text-zinc-500 uppercase tracking-wider">
              <th className="py-3 px-4">Reservation Title</th>
              <th className="py-3 px-4">User Ref</th>
              <th className="py-3 px-4">Time Window</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 text-zinc-800">
            {bookings.map((b) => {
              const start = new Date(b.start_time);
              const end = new Date(b.end_time);

              return (
                <tr
                  key={b.id}
                  className="hover:bg-zinc-50/50 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-zinc-900">{b.title}</div>
                    <div className="text-[11px] text-zinc-400 font-mono">
                      {b.id}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-zinc-500 truncate max-w-[140px]">
                    {b.user_id}
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
                      {start.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: "UTC",
                      })}{" "}
                      –{" "}
                      {end.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: "UTC",
                      })}
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
