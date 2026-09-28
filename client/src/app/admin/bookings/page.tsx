"use client";

import { useEffect, useState } from "react";
import { bookingService } from "@/services/booking.service";
import { BookingApprovalTable } from "@/components/bookings/BookingApprovalTable";
import { BookingApproveModal } from "@/components/bookings/BookingApproveModal";
import { BookingRejectModal } from "@/components/bookings/BookingRejectModal";
import type { Booking } from "@/types";
import { Loader2, AlertCircle } from "lucide-react";

export default function AdminBookingsPage() {
  const [pendingBookings, setPendingBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  // Initial Mount
  useEffect(() => {
    let isMounted = true;

    async function loadInitialPending() {
      try {
        const data = await bookingService.getBookings({ status: "PENDING" });
        if (isMounted) setPendingBookings(data);
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to fetch pending requests");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadInitialPending();

    return () => {
      isMounted = false;
    };
  }, []);

  const refreshPending = async () => {
    try {
      const data = await bookingService.getBookings({ status: "PENDING" });
      setPendingBookings(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to refresh pending bookings");
    }
  };

  const handleOpenApprove = (b: Booking) => {
    setSelectedBooking(b);
    setIsApproveOpen(true);
  };

  const handleOpenReject = (b: Booking) => {
    setSelectedBooking(b);
    setIsRejectOpen(true);
  };

  const handleConfirmApprove = async (id: string) => {
    await bookingService.approveBooking(id);
    await refreshPending();
  };

  const handleConfirmReject = async (id: string, reason: string) => {
    await bookingService.rejectBooking(id, { reason });
    await refreshPending();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">Booking Approvals Queue</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Authorize or decline room reservations that require administrative confirmation</p>
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
          <span>Loading approval queue...</span>
        </div>
      ) : (
        <BookingApprovalTable
          bookings={pendingBookings}
          onApprove={handleOpenApprove}
          onReject={handleOpenReject}
        />
      )}

      <BookingApproveModal
        booking={selectedBooking}
        isOpen={isApproveOpen}
        onClose={() => setIsApproveOpen(false)}
        onConfirm={handleConfirmApprove}
      />

      <BookingRejectModal
        booking={selectedBooking}
        isOpen={isRejectOpen}
        onClose={() => setIsRejectOpen(false)}
        onConfirm={handleConfirmReject}
      />
    </div>
  );
}
