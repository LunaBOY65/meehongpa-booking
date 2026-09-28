"use client";

import { useEffect, useState, useCallback } from "react";
import { bookingService } from "@/services/booking.service";
import { userService } from "@/services/user.service";
import { BookingList } from "@/components/bookings/BookingList";
import { BookingDetailModal } from "@/components/bookings/BookingDetailModal";
import { BookingCancelModal } from "@/components/bookings/BookingCancelModal";
import type { Booking } from "@/types";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const me = await userService.getCurrentUser();
      const list = await bookingService.getBookings({ user_id: me.id });
      setBookings(list);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to fetch personal bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

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
    fetchBookings();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">📅 My Reservations</h1>
        <p className="text-sm text-gray-500">Track your room bookings, view access PINs, or cancel requests</p>
      </div>

      {error && <div className="p-3 bg-red-100 text-red-700 text-sm rounded">{error}</div>}

      {loading ? (
        <div className="p-8 text-center text-gray-500">Loading reservations...</div>
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
