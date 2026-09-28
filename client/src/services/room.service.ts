import type {
  Room,
  RoomFilterParams,
  CreateRoomRequest,
  UpdateRoomRequest,
} from "@/types";

export const roomService = {
  getRooms: async (params?: RoomFilterParams): Promise<Room[]> => {
    void params;
    throw new Error("Not implemented");
  },
  getRoomById: async (id: string): Promise<Room> => {
    void id;
    throw new Error("Not implemented");
  },
  createRoom: async (data: CreateRoomRequest): Promise<Room> => {
    void data;
    throw new Error("Not implemented");
  },
  updateRoom: async (id: string, data: UpdateRoomRequest): Promise<Room> => {
    void id;
    void data;
    throw new Error("Not implemented");
  },
  deleteRoom: async (id: string): Promise<void> => {
    void id;
    throw new Error("Not implemented");
  },
};
