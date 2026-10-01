export type BookingStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED"
  | "CHECKED_IN";

export interface Booking {
  id: string;
  room_id: string;
  user_id: string;
  title: string;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  check_in_pin?: string | null;
  checked_in_at?: string | null;
  rejection_reason?: string | null;
  cancellation_reason?: string | null;
  created_at: string;
}

export interface BookingAvailability {
  start_time: string;
  end_time: string;
  status: BookingStatus;
}

export interface CheckInResult {
  id: string;
  title: string;
  status: BookingStatus;
  checked_in_at: string | null;
}

export interface BookingFilterParams {
  user_id?: string;
  room_id?: string;
  date?: string;
  status?: BookingStatus;
}

export interface CreateBookingRequest {
  room_id: string;
  title: string;
  start_time: string;
  end_time: string;
}

export interface RejectBookingRequest {
  reason: string;
}

export interface CancelBookingRequest {
  reason: string;
}

export interface CheckInRequest {
  booking_id: string;
  pin: string;
}
