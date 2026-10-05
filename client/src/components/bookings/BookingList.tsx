"use client";

import type { Booking } from "@/types";
import { formatUtcTime } from "@/utils/date-time";
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from "lucide-react";

interface BookingListProps {
  bookings: Booking[];
  onViewDetail?: (booking: Booking) => void;
  onCancel?: (booking: Booking) => void;
}

export function BookingList({
  bookings,
  onViewDetail,
  onCancel,
}: BookingListProps) {
  if (bookings.length === 0) {
    return (
      <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center">
        <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-3 text-zinc-400">
          <Calendar className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-900">
          No reservations found
        </h3>
        <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
          You have no active or historical meeting room bookings in this
          workspace.
        </p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            Confirmed
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3" />
            Pending Approval
          </span>
        );
      case "CHECKED_IN":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            Checked In
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full">
            <XCircle className="w-3 h-3" />
            Declined
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-zinc-100 text-zinc-600 border border-zinc-200 px-2 py-0.5 rounded-full">
            <RotateCcw className="w-3 h-3" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-3">
      {bookings.map((booking) => {
        const startDate = new Date(booking.start_time);

        return (
          <div
            key={booking.id}
            className="bg-white border border-zinc-200/90 rounded-xl p-4 sm:p-5 shadow-xs hover:border-zinc-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-sm font-semibold text-zinc-900 tracking-tight">
                  {booking.title}
                </h3>
                {getStatusBadge(booking.status)}
              </div>

              <div className="flex items-center gap-3 text-xs text-zinc-500 flex-wrap">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  {startDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  {formatUtcTime(booking.start_time)}{" "}
                  –{" "}
                  {formatUtcTime(booking.end_time)}
                </span>
              </div>

              {booking.check_in_pin && (
                <div className="inline-flex items-center gap-1.5 pt-1">
                  <span className="text-[11px] font-medium text-zinc-500">
                    Access PIN:
                  </span>
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-zinc-100 border border-zinc-200 text-zinc-900 rounded tracking-wider">
                    {booking.check_in_pin}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              {onViewDetail && (
                <button
                  onClick={() => onViewDetail(booking)}
                  className="px-3 py-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-900 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-md transition-colors"
                >
                  View Details
                </button>
              )}
              {onCancel &&
                (booking.status === "APPROVED" ||
                  booking.status === "PENDING") && (
                  <button
                    onClick={() => onCancel(booking)}
                    className="px-3 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 bg-white hover:bg-rose-50 border border-zinc-200 hover:border-rose-200 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
