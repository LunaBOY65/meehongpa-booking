export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  // 1. ดึง Token จาก localStorage (ถ้ามี)
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  // 2. เตรียม Headers โดยระบุชนิดข้อมูลเป็น Record<string, string>
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // 3. แนบ Authorization Header ถ้ามี Token
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // 4. ส่ง Request ไปยัง FastAPI
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.detail || "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์",
    );
  }

  // รองรับกรณี 204 No Content (เช่น ตอนสั่งลบห้อง)
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
