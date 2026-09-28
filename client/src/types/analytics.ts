export interface AnalyticsSummaryParams {
  month: number;
  year: number;
}

export interface AnalyticsSummaryResponse {
  month: number;
  year: number;
  total_reservations: number;
  completed_check_ins: number;
  cancellations: number;
}

export interface RoomUtilizationParams {
  room_id: string;
  month: number;
  year: number;
}

export interface DailyUtilizationRecord {
  date: string;
  total_booked_hours: number;
  utilization_percentage: number;
  booking_count: number;
}

export interface RoomUtilizationResponse {
  room_id: string;
  month: number;
  year: number;
  daily_data: DailyUtilizationRecord[];
}

export interface UserLockoutItem {
  id: string;
  email: string;
  full_name: string;
  department: string | null;
  no_show_count: number;
  is_locked: boolean;
}

export interface UserLockoutResponse {
  locked_users: UserLockoutItem[];
}
