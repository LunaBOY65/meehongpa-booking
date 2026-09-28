"use client";

import type { AnalyticsSummaryResponse } from "@/types";

interface AnalyticsSummaryCardsProps {
  data: AnalyticsSummaryResponse | null;
}

export function AnalyticsSummaryCards({ data }: AnalyticsSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="bg-white border rounded-lg p-5 shadow-sm">
        <span className="text-xs font-semibold uppercase text-gray-500 block">Total Reservations</span>
        <span className="text-3xl font-extrabold text-blue-600 mt-1 block">
          {data?.total_reservations ?? 0}
        </span>
      </div>

      <div className="bg-white border rounded-lg p-5 shadow-sm">
        <span className="text-xs font-semibold uppercase text-gray-500 block">Completed Check-Ins</span>
        <span className="text-3xl font-extrabold text-emerald-600 mt-1 block">
          {data?.completed_check_ins ?? 0}
        </span>
      </div>

      <div className="bg-white border rounded-lg p-5 shadow-sm">
        <span className="text-xs font-semibold uppercase text-gray-500 block">Cancellations</span>
        <span className="text-3xl font-extrabold text-rose-600 mt-1 block">
          {data?.cancellations ?? 0}
        </span>
      </div>
    </div>
  );
}
