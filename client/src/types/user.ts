export type UserRole = "MEMBER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  full_name: string;
  department: string | null;
  role: UserRole;
  no_show_count: number;
  is_locked: boolean;
  created_at: string;
}

export interface UserFilterParams {
  department?: string;
  is_locked?: boolean;
  role?: UserRole;
}

export interface UpdateUserRequest {
  full_name?: string;
  department?: string;
  role?: UserRole;
  is_locked?: boolean;
  no_show_count?: number;
}
