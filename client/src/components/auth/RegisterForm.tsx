"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";

export function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await authService.register({
        email,
        password,
        full_name: fullName,
        department,
      });
      // ลงทะเบียนสำเร็จ ส่งไปยังหน้า Login
      router.push("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("เกิดข้อผิดพลาดในการลงทะเบียน");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-sm mx-auto p-4 bg-white border rounded shadow-sm"
    >
      <h1 className="text-xl font-bold text-gray-800">สมัครสมาชิก (Register)</h1>

      {error && (
        <div className="p-2 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm mb-1 text-gray-700">ชื่อ-นามสกุล</label>
        <input
          type="text"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border px-3 py-2 rounded text-gray-900"
          placeholder="สมชาย ใจดี"
        />
      </div>

      <div>
        <label className="block text-sm mb-1 text-gray-700">อีเมล</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded text-gray-900"
          placeholder="user@example.com"
        />
      </div>

      <div>
        <label className="block text-sm mb-1 text-gray-700">แผนก (Department)</label>
        <input
          type="text"
          required
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full border px-3 py-2 rounded text-gray-900"
          placeholder="IT / Marketing / HR"
        />
      </div>

      <div>
        <label className="block text-sm mb-1 text-gray-700">รหัสผ่าน</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded text-gray-900"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 disabled:bg-gray-400 mt-2"
      >
        {loading ? "กำลังลงทะเบียน..." : "ลงทะเบียน"}
      </button>
    </form>
  );
}
