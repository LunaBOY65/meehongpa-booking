import type { User, UserFilterParams, UpdateUserRequest } from "@/types";

export const userService = {
  getCurrentUser: async (): Promise<User> => {
    throw new Error("Not implemented");
  },
  getUsers: async (params?: UserFilterParams): Promise<User[]> => {
    void params;
    throw new Error("Not implemented");
  },
  getUserById: async (id: string): Promise<User> => {
    void id;
    throw new Error("Not implemented");
  },
  updateUser: async (id: string, data: UpdateUserRequest): Promise<User> => {
    void id;
    void data;
    throw new Error("Not implemented");
  },
  deleteUser: async (id: string): Promise<void> => {
    void id;
    throw new Error("Not implemented");
  },
};
