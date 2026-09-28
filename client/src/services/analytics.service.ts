import { apiClient } from "./api-client";
import type {
  AnalyticsSummaryParams,
  AnalyticsSummaryResponse,
  RoomUtilizationParams,
  RoomUtilizationResponse,
  UserLockoutResponse,
} from "@/types";

export const analyticsService = {
  getSummary: async (
    params: AnalyticsSummaryParams
  ): Promise<AnalyticsSummaryResponse> => {
    const query = new URLSearchParams({
      month: params.month.toString(),
      year: params.year.toString(),
    });
    return apiClient<AnalyticsSummaryResponse>(`/analytics/summary?${query.toString()}`);
  },
  getRoomUtilization: async (
    params: RoomUtilizationParams
  ): Promise<RoomUtilizationResponse> => {
    const query = new URLSearchParams({
      room_id: params.room_id,
      month: params.month.toString(),
      year: params.year.toString(),
    });
    return apiClient<RoomUtilizationResponse>(
      `/analytics/room-utilization?${query.toString()}`
    );
  },
  getUserLockouts: async (): Promise<UserLockoutResponse> => {
    return apiClient<UserLockoutResponse>("/analytics/user-lockouts");
  },
};
