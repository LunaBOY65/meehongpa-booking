"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "🏠 Home", href: "/" },
    { label: "🚪 Meeting Rooms", href: "/rooms" },
    { label: "📅 My Bookings", href: "/bookings" },
    { label: "🔑 Check-In Kiosk", href: "/bookings/check-in" },
    { label: "👤 Profile", href: "/profile" },
  ];

  const adminItems = [
    { label: "🏢 Manage Rooms", href: "/admin/rooms" },
    { label: "✅ Booking Approvals", href: "/admin/bookings" },
    { label: "👥 User Directory", href: "/admin/users" },
    { label: "📊 Analytics & Reports", href: "/admin/analytics" },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 min-h-screen p-4 flex flex-col gap-6 border-r border-slate-800">
      <div>
        <h2 className="text-xs font-semibold uppercase text-slate-400 mb-2 px-2">
          User Menu
        </h2>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "hover:bg-slate-800 text-slate-300"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div>
        <h2 className="text-xs font-semibold uppercase text-slate-400 mb-2 px-2">
          Admin Console
        </h2>
        <nav className="flex flex-col gap-1">
          {adminItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-purple-600 text-white"
                    : "hover:bg-slate-800 text-slate-300"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
