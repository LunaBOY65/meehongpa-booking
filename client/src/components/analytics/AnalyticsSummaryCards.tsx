"use client";

import type { AnalyticsSummaryResponse } from "@/types";
import { CalendarCheck2, CheckCircle2, XCircle } from "lucide-react";

interface AnalyticsSummaryCardsProps {
  data: AnalyticsSummaryResponse | null;
}

export function AnalyticsSummaryCards({ data }: AnalyticsSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="bg-white border border-zinc-200/90 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-500">Total Reservations</span>
          <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-600">
            <CalendarCheck2 className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-semibold tracking-tight text-zinc-900 mt-2">
          {data?.total_reservations ?? 0}
        </div>
        <div className="text-[11px] text-zinc-400 mt-1">Booked in selected period</div>
      </div>

      <div className="bg-white border border-zinc-200/90 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-500">Completed Check-Ins</span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-semibold tracking-tight text-zinc-900 mt-2">
          {data?.completed_check_ins ?? 0}
        </div>
        <div className="text-[11px] text-zinc-400 mt-1">Verified physical attendance</div>
      </div>

      <div className="bg-white border border-zinc-200/90 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-500">Cancelled Bookings</span>
          <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
            <XCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-semibold tracking-tight text-zinc-900 mt-2">
          {data?.cancellations ?? 0}
        </div>
        <div className="text-[11px] text-zinc-400 mt-1">Released prior to meeting time</div>
      </div>
    </div>
  );
}
