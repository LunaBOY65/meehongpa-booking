"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { roomService } from "@/services/room.service";
import { bookingService } from "@/services/booking.service";
import { RoomDetailCard } from "@/components/rooms/RoomDetailCard";
import { BookingCalendar } from "@/components/bookings/BookingCalendar";
import { BookingForm } from "@/components/bookings/BookingForm";
import type { Room, BookingAvailability, CreateBookingRequest } from "@/types";
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function RoomDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [room, setRoom] = useState<Room | null>(null);
  const [bookings, setBookings] = useState<BookingAvailability[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Initial Mount: Fetch initial room and bookings
  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      try {
        const [roomData, bookingList] = await Promise.all([
          roomService.getRoomById(id),
          bookingService.getAvailability(id, selectedDate),
        ]);

        if (isMounted) {
          setRoom(roomData);
          setBookings(bookingList);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load room details");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, [id, selectedDate]);

  // User Action: Change selected schedule date
  const handleDateChange = async (newDate: string) => {
    setSelectedDate(newDate);
    try {
      const bookingList = await bookingService.getAvailability(id, newDate);
      setBookings(bookingList);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load schedule for date");
    }
  };

  // User Action: Submit booking
  const handleBookingSubmit = async (data: CreateBookingRequest) => {
    setSuccessMsg(null);
    const created = await bookingService.createBooking(data);
    if (created.status === "PENDING") {
      setSuccessMsg("Reservation request submitted. Awaiting administrator review.");
    } else {
      setSuccessMsg(`Room reservation confirmed! Check-In Access PIN: ${created.check_in_pin}`);
    }

    // Refresh bookings after reservation
    const bookingList = await bookingService.getAvailability(id, selectedDate);
    setBookings(bookingList);
  };

  if (loading && !room) {
    return (
      <div className="p-16 flex items-center justify-center text-zinc-400 gap-2 text-xs">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Loading room details...</span>
      </div>
    );
  }

  if (error && !room) {
    return (
      <div className="max-w-md mx-auto p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-800">
        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
        <span>{error || "Meeting room not found"}</span>
      </div>
    );
  }

  if (!room) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <Link
          href="/rooms"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 mb-3 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Rooms Catalog</span>
        </Link>
        <RoomDetailCard room={room} />
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl flex items-center gap-2 text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BookingCalendar
            bookings={bookings}
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
          />
        </div>
        <div>
          <BookingForm
            roomId={room.id}
            onSuccess={() => {}}
            onSubmitBooking={handleBookingSubmit}
          />
        </div>
      </div>
    </div>
  );
}
