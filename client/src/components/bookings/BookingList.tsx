"use client";

import type { Booking } from "@/types";

interface BookingListProps {
  bookings: Booking[];
  onViewDetail?: (booking: Booking) => void;
  onCancel?: (booking: Booking) => void;
}

export function BookingList({ bookings, onViewDetail, onCancel }: BookingListProps) {
  if (bookings.length === 0) {
    return (
      <div className="p-8 text-center border rounded-lg bg-gray-50 text-gray-500">
        ไม่มีรายการจองห้องประชุม
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <span className="px-2.5 py-1 text-xs font-semibold rounded bg-green-100 text-green-800">APPROVED</span>;
      case "PENDING":
        return <span className="px-2.5 py-1 text-xs font-semibold rounded bg-yellow-100 text-yellow-800">PENDING APPROVAL</span>;
      case "CHECKED_IN":
        return <span className="px-2.5 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">CHECKED IN</span>;
      case "REJECTED":
        return <span className="px-2.5 py-1 text-xs font-semibold rounded bg-red-100 text-red-800">REJECTED</span>;
      case "CANCELLED":
        return <span className="px-2.5 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-600">CANCELLED</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="space-y-3">
      {bookings.map((booking) => {
        const startDate = new Date(booking.start_time);
        const endDate = new Date(booking.end_time);

        return (
          <div
            key={booking.id}
            className="bg-white border rounded-lg p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-bold text-gray-900">{booking.title}</h3>
                {getStatusBadge(booking.status)}
              </div>
              <p className="text-sm text-gray-600">
                📅 {startDate.toLocaleDateString("th-TH")} | 🕒{" "}
                {startDate.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })} -{" "}
                {endDate.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })}
              </p>
              {booking.check_in_pin && (
                <p className="text-sm mt-1 text-blue-700 font-mono font-bold">
                  🔑 Check-In PIN: {booking.check_in_pin}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {onViewDetail && (
                <button
                  onClick={() => onViewDetail(booking)}
                  className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium"
                >
                  Details
                </button>
              )}
              {onCancel && (booking.status === "APPROVED" || booking.status === "PENDING") && (
                <button
                  onClick={() => onCancel(booking)}
                  className="px-3 py-1.5 text-xs bg-red-600 hover:bg-red-700 text-white rounded font-medium"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
