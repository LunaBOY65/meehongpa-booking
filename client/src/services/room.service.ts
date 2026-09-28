import { apiClient } from "./api-client";

import type {
  Room,
  RoomFilterParams,
  CreateRoomRequest,
  UpdateRoomRequest,
} from "@/types";

export const roomService = {
  getRooms: async (params?: RoomFilterParams): Promise<Room[]> => {
    // แปลง object params เป็น query string เช่น ?building=TowerA
    let queryString = "";
    if (params) {
      const query = new URLSearchParams();
      if (params.building) query.append("building", params.building);
      if (params.floor) query.append("floor", params.floor);
      if (params.min_capacity)
        query.append("min_capacity", params.min_capacity.toString());
      if (params.is_active !== undefined)
        query.append("is_active", params.is_active.toString());

      const qs = query.toString();
      if (qs) queryString = `?${qs}`;
    }
    return apiClient<Room[]>(`/rooms${queryString}`);
  },
  getRoomById: async (id: string): Promise<Room> => {
    return apiClient<Room>(`/rooms/${id}`);
  },
  createRoom: async (data: CreateRoomRequest): Promise<Room> => {
    return apiClient<Room>("/rooms", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  updateRoom: async (id: string, data: UpdateRoomRequest): Promise<Room> => {
    return apiClient<Room>(`/rooms/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
  deleteRoom: async (id: string): Promise<void> => {
    return apiClient<void>(`/rooms/${id}`, {
      method: "DELETE",
    });
  },
};
