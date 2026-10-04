export interface Room {
  id: string;
  name: string;
  capacity: number;
  building: string;
  floor: string;
  requires_approval: boolean;
  is_active: boolean;
  image_url: string | null;
  created_at: string;
}

export interface RoomFilterParams {
  building?: string;
  floor?: string;
  min_capacity?: number;
  is_active?: boolean;
}

export interface CreateRoomRequest {
  name: string;
  capacity: number;
  building: string;
  floor: string;
  requires_approval?: boolean;
}

export interface UpdateRoomRequest {
  name?: string;
  capacity?: number;
  building?: string;
  floor?: string;
  requires_approval?: boolean;
  is_active?: boolean;
}
