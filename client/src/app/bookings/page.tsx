"use client";

import { useEffect, useState } from "react";
import { bookingService } from "@/services/booking.service";
import { userService } from "@/services/user.service";
import { BookingList } from "@/components/bookings/BookingList";
import { BookingDetailModal } from "@/components/bookings/BookingDetailModal";
import { BookingCancelModal } from "@/components/bookings/BookingCancelModal";
import type { Booking } from "@/types";
import { Loader2, AlertCircle } from "lucide-react";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  // Initial Mount
  useEffect(() => {
    let isMounted = true;

    async function loadInitialBookings() {
      try {
        const me = await userService.getCurrentUser();
        const list = await bookingService.getBookings({ user_id: me.id });
        if (isMounted) setBookings(list);
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to fetch reservations");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadInitialBookings();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenDetail = (b: Booking) => {
    setSelectedBooking(b);
    setIsDetailOpen(true);
  };

  const handleOpenCancel = (b: Booking) => {
    setSelectedBooking(b);
    setIsCancelOpen(true);
  };

  const handleConfirmCancel = async (id: string, reason: string) => {
    await bookingService.cancelBooking(id, { reason });
    // Refetch user bookings after cancellation
    try {
      const me = await userService.getCurrentUser();
      const list = await bookingService.getBookings({ user_id: me.id });
      setBookings(list);
    } catch {
      // Keep existing list on failure
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">My Reservations</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Track upcoming meeting schedules, access check-in PINs, or cancel bookings</p>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2.5 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="p-16 flex items-center justify-center text-zinc-400 gap-2 text-xs">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading reservations...</span>
        </div>
      ) : (
        <BookingList
          bookings={bookings}
          onViewDetail={handleOpenDetail}
          onCancel={handleOpenCancel}
        />
      )}

      <BookingDetailModal
        booking={selectedBooking}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />

      <BookingCancelModal
        booking={selectedBooking}
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
}
