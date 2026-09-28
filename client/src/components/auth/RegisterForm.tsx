"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/services/auth.service";
import { Loader2, AlertCircle, ArrowRight } from "lucide-react";

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
      router.push("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create account. Please check your information.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="bg-white border border-zinc-200/80 rounded-xl p-6 sm:p-8 shadow-xs">
        <div className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900">Create RoomDesk Account</h1>
          <p className="text-xs text-zinc-500 mt-1">Join your organization workspace to reserve rooms</p>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-rose-50 border border-rose-200/80 rounded-lg flex items-start gap-2.5 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1.5">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Jane Doe"
              className="w-full px-3 py-2 text-sm bg-white border border-zinc-200 rounded-md text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1.5">
              Work Email <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@company.com"
              className="w-full px-3 py-2 text-sm bg-white border border-zinc-200 rounded-md text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1.5">
              Department <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Engineering / Product / Sales"
              className="w-full px-3 py-2 text-sm bg-white border border-zinc-200 rounded-md text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1.5">
              Password <span className="text-rose-500">*</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full px-3 py-2 text-sm bg-white border border-zinc-200 rounded-md text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-md disabled:bg-zinc-300 disabled:cursor-not-allowed transition-colors shadow-xs"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-zinc-100 text-center text-xs text-zinc-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-zinc-900 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
