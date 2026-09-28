import { apiClient } from "./api-client";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from "@/types";

export const authService = {
  // สมัครสมาชิก
  async register(data: RegisterRequest) {
    return apiClient("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // เข้าสู่ระบบ และบันทึก Token
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const result = await apiClient<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    // เก็บ Token ลงเครื่องเมื่อล็อกอินผ่าน
    if (result.access_token) {
      localStorage.setItem("access_token", result.access_token);
    }

    return result;
  },

  // ออกจากระบบ
  logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
    }
  },

  // เช็กว่ามี Token อยู่ในเครื่องไหม
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("access_token");
  },
};
