"use client";

import Link from "next/link";
import { DoorOpen, CalendarCheck2, KeyRound, BarChart3, Users2, ShieldCheck, ArrowRight, Building2 } from "lucide-react";

export default function HomePage() {
  const quickLinks = [
    {
      title: "Meeting Rooms",
      description: "Explore available meeting rooms, check capacities, and reserve time slots.",
      href: "/rooms",
      icon: DoorOpen,
      action: "Browse facilities",
    },
    {
      title: "My Reservations",
      description: "Manage your upcoming schedules, access check-in PINs, and cancel bookings.",
      href: "/bookings",
      icon: CalendarCheck2,
      action: "View bookings",
    },
    {
      title: "Kiosk Check-In",
      description: "Physical room kiosk interface to enter 6-digit PINs and confirm attendance.",
      href: "/bookings/check-in",
      icon: KeyRound,
      action: "Launch kiosk",
    },
    {
      title: "Utilization Analytics",
      description: "Review monthly room occupancy rates, no-show counters, and KPIs.",
      href: "/admin/analytics",
      icon: BarChart3,
      action: "View reports",
    },
  ];

  const adminShortcuts = [
    {
      title: "Room Management",
      description: "Add new facilities, modify capacity, or toggle maintenance mode.",
      href: "/admin/rooms",
      icon: Building2,
    },
    {
      title: "Approval Queue",
      description: "Review pending reservation requests requiring administrative approval.",
      href: "/admin/bookings",
      icon: ShieldCheck,
    },
    {
      title: "Member Directory",
      description: "Manage accounts, reset no-show penalties, and unlock suspended users.",
      href: "/admin/users",
      icon: Users2,
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Hero Section */}
      <div className="bg-white border border-zinc-200/90 rounded-2xl p-6 sm:p-10 shadow-xs">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-800 border border-zinc-200 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Meeting Room Booking Platform</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 max-w-xl">
          Coordinate meeting rooms and collaborative spaces with zero friction.
        </h1>
        <p className="text-sm text-zinc-500 mt-2 max-w-lg leading-relaxed">
          Book equipped facilities, manage approval queues, check in via hardware kiosks, and eliminate ghost meetings with automated no-show tracking.
        </p>

        <div className="flex items-center gap-3 mt-6 flex-wrap">
          <Link
            href="/rooms"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 px-4 py-2 rounded-md transition-colors shadow-xs"
          >
            <span>Book a Room</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/bookings/check-in"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-700 hover:text-zinc-900 bg-white hover:bg-zinc-50 border border-zinc-200 px-4 py-2 rounded-md transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5 text-zinc-500" />
            <span>Check-In Kiosk</span>
          </Link>
        </div>
      </div>

      {/* Primary Actions Grid */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 px-1">
          Quick Access
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="bg-white border border-zinc-200/90 rounded-xl p-5 shadow-xs hover:border-zinc-300 hover:shadow-sm transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-700 mb-3 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-900 tracking-tight group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="inline-flex items-center gap-1 text-xs font-medium text-zinc-900 mt-4 group-hover:translate-x-0.5 transition-transform">
                  <span>{item.action}</span>
                  <ArrowRight className="w-3 h-3 text-zinc-400" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Admin Operations */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 px-1">
          Administrative Modules
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {adminShortcuts.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="bg-white border border-zinc-200/90 rounded-xl p-4 shadow-xs hover:border-zinc-300 transition-all flex items-start gap-3 group"
              >
                <div className="w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-600 shrink-0 group-hover:border-zinc-400">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-zinc-900 truncate group-hover:text-blue-600">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-zinc-500 mt-0.5 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
