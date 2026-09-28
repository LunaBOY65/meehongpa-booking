"use client";

import type { Booking } from "@/types";

interface BookingApprovalTableProps {
  bookings: Booking[];
  onApprove: (booking: Booking) => void;
  onReject: (booking: Booking) => void;
}

export function BookingApprovalTable({ bookings, onApprove, onReject }: BookingApprovalTableProps) {
  return (
    <div className="overflow-x-auto border rounded-lg shadow-sm">
      <table className="w-full text-left border-collapse text-sm text-gray-700">
        <thead className="bg-slate-100 text-slate-700 font-semibold border-b">
          <tr>
            <th className="p-3">Title</th>
            <th className="p-3">User ID</th>
            <th className="p-3">Start Time</th>
            <th className="p-3">End Time</th>
            <th className="p-3">Status</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-4 text-center text-gray-500">
                ไม่มีรายการจองที่รอการอนุมัติ
              </td>
            </tr>
          ) : (
            bookings.map((b) => (
              <tr key={b.id} className="border-b hover:bg-slate-50">
                <td className="p-3 font-medium text-gray-900">{b.title}</td>
                <td className="p-3 font-mono text-xs text-gray-500">{b.user_id}</td>
                <td className="p-3">{new Date(b.start_time).toLocaleString("th-TH")}</td>
                <td className="p-3">{new Date(b.end_time).toLocaleString("th-TH")}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-yellow-100 text-yellow-800">
                    {b.status}
                  </span>
                </td>
                <td className="p-3 text-right space-x-2">
                  <button
                    onClick={() => onApprove(b)}
                    className="px-2.5 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 font-medium"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => onReject(b)}
                    className="px-2.5 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 font-medium"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
