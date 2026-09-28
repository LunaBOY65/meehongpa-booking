"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white border rounded-xl p-8 shadow-sm text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
          🏢 Meeting Room Booking System
        </h1>
        <p className="text-base text-gray-600 max-w-2xl mx-auto mb-8">
          Welcome to the fullstack Meeting Room Booking platform built with Next.js App Router, Tailwind CSS, and FastAPI backend.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <Link
            href="/rooms"
            className="p-5 border rounded-lg hover:border-blue-500 hover:shadow-md transition-all bg-slate-50"
          >
            <div className="text-2xl mb-2">🚪</div>
            <h3 className="font-bold text-gray-800">Rooms Catalog</h3>
            <p className="text-xs text-gray-500 mt-1">Browse rooms and reserve time slots</p>
          </Link>

          <Link
            href="/bookings"
            className="p-5 border rounded-lg hover:border-blue-500 hover:shadow-md transition-all bg-slate-50"
          >
            <div className="text-2xl mb-2">📅</div>
            <h3 className="font-bold text-gray-800">My Bookings</h3>
            <p className="text-xs text-gray-500 mt-1">View personal schedule and access PINs</p>
          </Link>

          <Link
            href="/bookings/check-in"
            className="p-5 border rounded-lg hover:border-blue-500 hover:shadow-md transition-all bg-slate-50"
          >
            <div className="text-2xl mb-2">🔑</div>
            <h3 className="font-bold text-gray-800">Check-In Kiosk</h3>
            <p className="text-xs text-gray-500 mt-1">Enter 6-digit PIN to check into room</p>
          </Link>

          <Link
            href="/admin/rooms"
            className="p-5 border rounded-lg hover:border-purple-500 hover:shadow-md transition-all bg-slate-50"
          >
            <div className="text-2xl mb-2">⚙️</div>
            <h3 className="font-bold text-gray-800">Admin Console</h3>
            <p className="text-xs text-gray-500 mt-1">Manage rooms, approvals, users & analytics</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
