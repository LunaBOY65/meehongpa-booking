import type {
  Booking,
  BookingFilterParams,
  CreateBookingRequest,
  RejectBookingRequest,
  CancelBookingRequest,
  CheckInRequest,
} from "@/types";

export const bookingService = {
  getBookings: async (params?: BookingFilterParams): Promise<Booking[]> => {
    void params;
    throw new Error("Not implemented");
  },
  getBookingById: async (id: string): Promise<Booking> => {
    void id;
    throw new Error("Not implemented");
  },
  createBooking: async (data: CreateBookingRequest): Promise<Booking> => {
    void data;
    throw new Error("Not implemented");
  },
  approveBooking: async (id: string): Promise<Booking> => {
    void id;
    throw new Error("Not implemented");
  },
  rejectBooking: async (
    id: string,
    data: RejectBookingRequest,
  ): Promise<Booking> => {
    void id;
    void data;
    throw new Error("Not implemented");
  },
  cancelBooking: async (
    id: string,
    data: CancelBookingRequest,
  ): Promise<Booking> => {
    void id;
    void data;
    throw new Error("Not implemented");
  },
  checkIn: async (data: CheckInRequest): Promise<Booking> => {
    void data;
    throw new Error("Not implemented");
  },
};
