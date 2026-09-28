"use client";

import { use, useEffect, useState, useCallback } from "react";
import { roomService } from "@/services/room.service";
import { bookingService } from "@/services/booking.service";
import { RoomDetailCard } from "@/components/rooms/RoomDetailCard";
import { BookingCalendar } from "@/components/bookings/BookingCalendar";
import { BookingForm } from "@/components/bookings/BookingForm";
import type { Room, Booking, CreateBookingRequest } from "@/types";

export default function RoomDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [room, setRoom] = useState<Room | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const roomData = await roomService.getRoomById(id);
      setRoom(roomData);

      const bookingList = await bookingService.getBookings({
        room_id: id,
        date: selectedDate,
      });
      setBookings(bookingList);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to load room details");
    } finally {
      setLoading(false);
    }
  }, [id, selectedDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleBookingSubmit = async (data: CreateBookingRequest) => {
    setSuccessMsg(null);
    const created = await bookingService.createBooking(data);
    if (created.status === "PENDING") {
      setSuccessMsg("🎉 Reservation request submitted! Awaiting Admin approval.");
    } else {
      setSuccessMsg(`🎉 Room reserved successfully! Access PIN: ${created.check_in_pin}`);
    }
    loadData();
  };

  if (loading && !room) {
    return <div className="p-8 text-center text-gray-500">Loading room details...</div>;
  }

  if (error || !room) {
    return (
      <div className="p-6 max-w-lg mx-auto bg-red-50 border border-red-200 text-red-700 rounded text-center">
        ❌ {error || "Room not found"}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <RoomDetailCard room={room} />

      {successMsg && (
        <div className="p-4 bg-green-100 border border-green-300 text-green-800 rounded font-semibold text-center">
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BookingCalendar
            bookings={bookings}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </div>
        <div>
          <BookingForm
            roomId={room.id}
            onSuccess={loadData}
            onSubmitBooking={handleBookingSubmit}
          />
        </div>
      </div>
    </div>
  );
}
