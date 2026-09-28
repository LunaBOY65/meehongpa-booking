"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  DoorOpen,
  CalendarCheck2,
  KeyRound,
  User,
  SlidersHorizontal,
  CheckCircle2,
  Users2,
  BarChart3,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const userNavItems = [
    { label: "Overview", href: "/", icon: LayoutDashboard },
    { label: "Meeting Rooms", href: "/rooms", icon: DoorOpen },
    { label: "My Bookings", href: "/bookings", icon: CalendarCheck2 },
    { label: "Check-In Kiosk", href: "/bookings/check-in", icon: KeyRound },
    { label: "My Profile", href: "/profile", icon: User },
  ];

  const adminNavItems = [
    { label: "Manage Rooms", href: "/admin/rooms", icon: SlidersHorizontal },
    { label: "Booking Approvals", href: "/admin/bookings", icon: CheckCircle2 },
    { label: "User Directory", href: "/admin/users", icon: Users2 },
    { label: "Analytics & Usage", href: "/admin/analytics", icon: BarChart3 },
  ];

  return (
    <aside className="w-60 bg-white border-r border-zinc-200 min-h-[calc(100vh-3.5rem)] p-4 flex flex-col gap-6 shrink-0">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2 px-2.5">
          Workspace
        </div>
        <nav className="space-y-0.5">
          {userNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-zinc-100 text-zinc-900 font-medium"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-zinc-900" : "text-zinc-400"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2 px-2.5">
          Administration
        </div>
        <nav className="space-y-0.5">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-zinc-100 text-zinc-900 font-medium"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-zinc-900" : "text-zinc-400"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
