"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Calendar,
  Clock,
  ArrowRight,
  DoorOpen,
  CalendarCheck2,
  KeyRound,
  ShieldCheck,
  Building2,
  Users2,
  BarChart3,
  CheckCircle2,
  Plus,
  Command,
  ChevronRight,
} from "lucide-react";
import { roomService } from "@/services/room.service";
import { bookingService } from "@/services/booking.service";
import { useAuth } from "@/components/layout/AuthProvider";
import type { Room, Booking } from "@/types";

export default function HomePage() {
  const { user: currentUser, loading: authLoading } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [upcomingBooking, setUpcomingBooking] = useState<Booking | null>(null);
  const [pendingCount, setPendingCount] = useState<number>(0);
  // const [commandQuery, setCommandQuery] = useState("");

  useEffect(() => {
    let isMounted = true;

    roomService
      .getRooms()
      .then((roomList) => {
        if (isMounted) setRooms(roomList);
      })
      .catch(() => {
        if (isMounted) setRooms([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (authLoading) return;

    let isMounted = true;
    if (!currentUser) {
      return () => {
        isMounted = false;
      };
    }
    const userId = currentUser.id;
    const isAdmin = currentUser.role === "ADMIN";

    async function loadUserBookings() {
      const userBookings = await bookingService
        .getBookings({ user_id: userId })
        .catch(() => []);

      if (isMounted) {
        const now = new Date();
        const activeBookings = userBookings
          .filter(
            (booking) =>
              (booking.status === "APPROVED" ||
                booking.status === "PENDING" ||
                booking.status === "CHECKED_IN") &&
              new Date(booking.end_time) > now,
          )
          .sort(
            (a, b) =>
              new Date(a.start_time).getTime() -
              new Date(b.start_time).getTime(),
          );

        setUpcomingBooking(activeBookings[0] ?? null);
      }

      if (isAdmin) {
        const pendingList = await bookingService
          .getBookings({ status: "PENDING" })
          .catch(() => []);
        if (isMounted) setPendingCount(pendingList.length);
      }
    }

    void loadUserBookings();

    return () => {
      isMounted = false;
    };
  }, [currentUser, authLoading]);

  const activeRoomsCount = rooms.filter((r) => r.is_active).length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* 1. Workspace Header */}
      {/* <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200/80"> */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
            Workspace Dashboard
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            {currentUser
              ? `Welcome back, ${currentUser.full_name}`
              : "Workspace Overview"}{" "}
            &bull; Real-time facility availability
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/bookings/check-in"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-900 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-md transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5 text-zinc-500" />
            <span>Kiosk Check-In</span>
          </Link>
          <Link
            href="/rooms"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-md transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Book Room</span>
          </Link>
        </div>
      </div>

      {/* 2. Assistant & Command Bar (AI / Chatbot Integration Ready) */}
      {/* <div className="bg-white border border-zinc-200/90 rounded-xl p-2.5 sm:p-3 shadow-xs flex items-center gap-3 focus-within:border-zinc-900 focus-within:ring-1 focus-within:ring-zinc-900 transition-all">
        <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-700 shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={commandQuery}
          onChange={(e) => setCommandQuery(e.target.value)}
          placeholder="Search rooms, check slot availability, or ask assistant..."
          className="w-full bg-transparent text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
        />
        <div className="hidden sm:flex items-center gap-1.5 shrink-0">
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 bg-zinc-100 border border-zinc-200 rounded">
            <Command className="w-3 h-3" /> K
          </span>
          <button
            type="button"
            className="px-2.5 py-1 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-md transition-colors shadow-xs"
          >
            Ask AI
          </button>
        </div>
      </div> */}

      {/* 3. Status & Today's Schedule Overview (2 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Left Column: Next Meeting / Active Status */}
        <div className="md:col-span-2 bg-white border border-zinc-200/90 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Next Upcoming Meeting
              </span>
              <Link
                href="/bookings"
                className="text-xs text-zinc-500 hover:text-zinc-900 font-medium inline-flex items-center gap-1"
              >
                <span>View all</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {upcomingBooking ? (
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-zinc-900">
                      {upcomingBooking.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                        {new Date(
                          upcomingBooking.start_time,
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-zinc-400" />
                        {new Date(
                          upcomingBooking.start_time,
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          timeZone: "UTC",
                        })}{" "}
                        –{" "}
                        {new Date(upcomingBooking.end_time).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            timeZone: "UTC",
                          },
                        )}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                      upcomingBooking.status === "APPROVED"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : upcomingBooking.status === "CHECKED_IN"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {upcomingBooking.status === "APPROVED" && (
                      <CheckCircle2 className="w-3 h-3" />
                    )}
                    {upcomingBooking.status}
                  </span>
                </div>

                {upcomingBooking.check_in_pin && (
                  <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg flex items-center justify-between">
                    <span className="text-xs text-zinc-600 font-medium">
                      Check-In Access PIN:
                    </span>
                    <span className="font-mono text-sm font-bold tracking-widest text-zinc-900 bg-white px-2 py-0.5 border border-zinc-200 rounded">
                      {upcomingBooking.check_in_pin}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-6 text-center space-y-2">
                <div className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto">
                  <CalendarCheck2 className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-medium text-zinc-800">
                  No scheduled reservations
                </h4>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                  You have no active meeting bookings for today. Browse
                  available rooms to schedule one.
                </p>
                <div className="pt-2">
                  <Link
                    href="/rooms"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-900 hover:text-blue-600"
                  >
                    <span>Schedule room</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Workspace Live Status & Shortcuts */}
        <div className="space-y-4">
          <div className="bg-white border border-zinc-200/90 rounded-xl p-4 shadow-xs space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block">
              Facility Availability
            </span>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DoorOpen className="w-4 h-4 text-zinc-500" />
                <span className="text-xs font-medium text-zinc-700">
                  Active Facilities
                </span>
              </div>
              <span className="text-sm font-semibold font-mono text-zinc-900">
                {activeRoomsCount} of {rooms.length}
              </span>
            </div>
            <Link
              href="/rooms"
              className="w-full text-center block text-xs font-medium text-zinc-700 hover:text-zinc-900 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 py-1.5 rounded-md transition-colors"
            >
              Browse Catalog
            </Link>
          </div>

          {currentUser?.role === "ADMIN" && (
            <div className="bg-white border border-zinc-200/90 rounded-xl p-4 shadow-xs space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block">
                Administrative Pulse
              </span>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-medium text-zinc-700">
                    Pending Approvals
                  </span>
                </div>
                <span
                  className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full ${
                    pendingCount > 0
                      ? "bg-amber-100 text-amber-800"
                      : "bg-zinc-100 text-zinc-600"
                  }`}
                >
                  {pendingCount}
                </span>
              </div>
              <Link
                href="/admin/bookings"
                className="w-full text-center block text-xs font-medium text-zinc-700 hover:text-zinc-900 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 py-1.5 rounded-md transition-colors"
              >
                Open Approval Queue
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* 4. Facility Directory & Operations (Compact Grid) */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 px-1">
          Workspace Operations
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Link
            href="/rooms"
            className="bg-white border border-zinc-200/90 rounded-xl p-4 shadow-xs hover:border-zinc-300 hover:bg-zinc-50/50 transition-all flex items-start justify-between group"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-700 flex items-center justify-center shrink-0">
                <DoorOpen className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors">
                  Meeting Rooms Catalog
                </h4>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Browse capacity, building floors, and reserve slots
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
          </Link>

          <Link
            href="/bookings"
            className="bg-white border border-zinc-200/90 rounded-xl p-4 shadow-xs hover:border-zinc-300 hover:bg-zinc-50/50 transition-all flex items-start justify-between group"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-700 flex items-center justify-center shrink-0">
                <CalendarCheck2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors">
                  My Reservations
                </h4>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  View your schedules, PIN codes, and cancellation
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
          </Link>

          <Link
            href="/bookings/check-in"
            className="bg-white border border-zinc-200/90 rounded-xl p-4 shadow-xs hover:border-zinc-300 hover:bg-zinc-50/50 transition-all flex items-start justify-between group"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-700 flex items-center justify-center shrink-0">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors">
                  Kiosk Check-In
                </h4>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Confirm physical attendance with 6-digit PIN
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
          </Link>

          <Link
            href="/admin/rooms"
            className="bg-white border border-zinc-200/90 rounded-xl p-4 shadow-xs hover:border-zinc-300 hover:bg-zinc-50/50 transition-all flex items-start justify-between group"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-700 flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors">
                  Room Management
                </h4>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Configure rooms, seat limits, and maintenance
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
          </Link>

          <Link
            href="/admin/users"
            className="bg-white border border-zinc-200/90 rounded-xl p-4 shadow-xs hover:border-zinc-300 hover:bg-zinc-50/50 transition-all flex items-start justify-between group"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-700 flex items-center justify-center shrink-0">
                <Users2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors">
                  Member Directory
                </h4>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Manage accounts, unlock users, and roles
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
          </Link>

          <Link
            href="/admin/analytics"
            className="bg-white border border-zinc-200/90 rounded-xl p-4 shadow-xs hover:border-zinc-300 hover:bg-zinc-50/50 transition-all flex items-start justify-between group"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-700 flex items-center justify-center shrink-0">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-zinc-900 group-hover:text-blue-600 transition-colors">
                  Facility Analytics
                </h4>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Monthly occupancy rates and no-show audit
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
