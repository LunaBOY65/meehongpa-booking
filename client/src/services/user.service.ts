import { apiClient } from "./api-client";
import type { User, UserFilterParams, UpdateUserRequest } from "@/types";

export const userService = {
  getCurrentUser: async (): Promise<User> => {
    return apiClient<User>("/users/me");
  },
  getUsers: async (params?: UserFilterParams): Promise<User[]> => {
    let queryString = "";
    if (params) {
      const query = new URLSearchParams();
      if (params.department) query.append("department", params.department);
      if (params.is_locked !== undefined)
        query.append("is_locked", params.is_locked.toString());
      if (params.role) query.append("role", params.role);

      const qs = query.toString();
      if (qs) queryString = `?${qs}`;
    }
    return apiClient<User[]>(`/users${queryString}`);
  },
  getUserById: async (id: string): Promise<User> => {
    return apiClient<User>(`/users/${id}`);
  },
  updateUser: async (id: string, data: UpdateUserRequest): Promise<User> => {
    return apiClient<User>(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
  deleteUser: async (id: string): Promise<void> => {
    return apiClient<void>(`/users/${id}`, {
      method: "DELETE",
    });
  },
};
