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
    void params;
    throw new Error("Not implemented");
  },
  getRoomUtilization: async (
    params: RoomUtilizationParams
  ): Promise<RoomUtilizationResponse> => {
    void params;
    throw new Error("Not implemented");
  },
  getUserLockouts: async (): Promise<UserLockoutResponse> => {
    throw new Error("Not implemented");
  },
};
