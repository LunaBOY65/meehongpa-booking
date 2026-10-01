import { apiClient } from "./api-client";
import type {
  Booking,
  BookingAvailability,
  BookingFilterParams,
  CreateBookingRequest,
  RejectBookingRequest,
  CancelBookingRequest,
  CheckInRequest,
  CheckInResult,
} from "@/types";

export const bookingService = {
  getAvailability: async (
    roomId: string,
    date: string,
  ): Promise<BookingAvailability[]> => {
    const query = new URLSearchParams({ room_id: roomId, date_str: date });
    return apiClient<BookingAvailability[]>(`/bookings/availability?${query}`);
  },
  getBookings: async (params?: BookingFilterParams): Promise<Booking[]> => {
    let queryString = "";
    if (params) {
      const query = new URLSearchParams();
      if (params.user_id) query.append("user_id", params.user_id);
      if (params.room_id) query.append("room_id", params.room_id);
      if (params.date) query.append("date_str", params.date);
      if (params.status) query.append("status", params.status);

      const qs = query.toString();
      if (qs) queryString = `?${qs}`;
    }
    return apiClient<Booking[]>(`/bookings${queryString}`);
  },
  getBookingById: async (id: string): Promise<Booking> => {
    return apiClient<Booking>(`/bookings/${id}`);
  },
  createBooking: async (data: CreateBookingRequest): Promise<Booking> => {
    return apiClient<Booking>("/bookings", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  approveBooking: async (id: string): Promise<Booking> => {
    return apiClient<Booking>(`/bookings/${id}/approve`, {
      method: "POST",
    });
  },
  rejectBooking: async (
    id: string,
    data: RejectBookingRequest
  ): Promise<Booking> => {
    return apiClient<Booking>(`/bookings/${id}/reject`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  cancelBooking: async (
    id: string,
    data: CancelBookingRequest
  ): Promise<Booking> => {
    return apiClient<Booking>(`/bookings/${id}/cancel`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  checkIn: async (data: CheckInRequest): Promise<CheckInResult> => {
    return apiClient<CheckInResult>("/bookings/check-in", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
