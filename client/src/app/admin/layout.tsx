"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/components/layout/AuthProvider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
    } else if (user.role !== "ADMIN") {
      router.replace("/");
    }
  }, [loading, router, user]);

  if (loading || user?.role !== "ADMIN") {
    return (
      <div className="p-16 flex items-center justify-center gap-2 text-xs text-zinc-400">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Verifying administrator access...</span>
      </div>
    );
  }

  return children;
}
