"use client";

import { useState } from "react";
import type { RoomFilterParams } from "@/types";
import { Search, Filter, RotateCcw, Building, Users } from "lucide-react";

interface RoomFilterProps {
  onFilterChange: (filters: RoomFilterParams) => void;
}

export function RoomFilter({ onFilterChange }: RoomFilterProps) {
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [minCapacity, setMinCapacity] = useState("");
  const [isActive, setIsActive] = useState<string>("all");

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({
      building: building || undefined,
      floor: floor || undefined,
      min_capacity: minCapacity ? Number(minCapacity) : undefined,
      is_active: isActive === "all" ? undefined : isActive === "true",
    });
  };

  const handleReset = () => {
    setBuilding("");
    setFloor("");
    setMinCapacity("");
    setIsActive("all");
    onFilterChange({});
  };

  return (
    <form
      onSubmit={handleApply}
      className="bg-white border border-zinc-200/90 rounded-xl p-3 sm:p-4 shadow-xs mb-6 flex flex-wrap items-center gap-3"
    >
      <div className="flex-1 min-w-[140px]">
        <label className="block text-[11px] font-medium text-zinc-500 mb-1">Building</label>
        <div className="relative">
          <input
            type="text"
            value={building}
            onChange={(e) => setBuilding(e.target.value)}
            placeholder="e.g. Tower A"
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-zinc-50/50 border border-zinc-200 rounded-md text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white focus:ring-1 focus:ring-zinc-900 transition-colors"
          />
          <Building className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      <div className="w-24">
        <label className="block text-[11px] font-medium text-zinc-500 mb-1">Floor</label>
        <input
          type="text"
          value={floor}
          onChange={(e) => setFloor(e.target.value)}
          placeholder="e.g. 4"
          className="w-full px-3 py-1.5 text-xs bg-zinc-50/50 border border-zinc-200 rounded-md text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white focus:ring-1 focus:ring-zinc-900 transition-colors"
        />
      </div>

      <div className="w-28">
        <label className="block text-[11px] font-medium text-zinc-500 mb-1">Min Capacity</label>
        <div className="relative">
          <input
            type="number"
            min="1"
            value={minCapacity}
            onChange={(e) => setMinCapacity(e.target.value)}
            placeholder="Seats"
            className="w-full pl-7 pr-2 py-1.5 text-xs bg-zinc-50/50 border border-zinc-200 rounded-md text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white focus:ring-1 focus:ring-zinc-900 transition-colors"
          />
          <Users className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      <div className="w-32">
        <label className="block text-[11px] font-medium text-zinc-500 mb-1">Status</label>
        <select
          value={isActive}
          onChange={(e) => setIsActive(e.target.value)}
          className="w-full px-2.5 py-1.5 text-xs bg-zinc-50/50 border border-zinc-200 rounded-md text-zinc-900 focus:outline-none focus:border-zinc-900 focus:bg-white focus:ring-1 focus:ring-zinc-900 transition-colors"
        >
          <option value="all">All Rooms</option>
          <option value="true">Active Only</option>
          <option value="false">Disabled Only</option>
        </select>
      </div>

      <div className="flex items-center gap-2 pt-4 sm:pt-0 sm:self-end">
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 rounded-md transition-colors shadow-xs"
        >
          <Filter className="w-3 h-3" />
          <span>Filter</span>
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-md border border-zinc-200 transition-colors"
          title="Reset Filters"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>
    </form>
  );
}
