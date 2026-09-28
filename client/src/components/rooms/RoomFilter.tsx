"use client";

import { useState } from "react";
import type { RoomFilterParams } from "@/types";

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
    <form onSubmit={handleApply} className="bg-slate-50 p-4 border rounded-lg flex flex-wrap items-end gap-3 mb-6">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Building</label>
        <input
          type="text"
          value={building}
          onChange={(e) => setBuilding(e.target.value)}
          placeholder="Tower A"
          className="border px-3 py-1.5 rounded text-sm text-gray-900 w-36"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Floor</label>
        <input
          type="text"
          value={floor}
          onChange={(e) => setFloor(e.target.value)}
          placeholder="4"
          className="border px-3 py-1.5 rounded text-sm text-gray-900 w-24"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Min Capacity</label>
        <input
          type="number"
          min="1"
          value={minCapacity}
          onChange={(e) => setMinCapacity(e.target.value)}
          placeholder="8"
          className="border px-3 py-1.5 rounded text-sm text-gray-900 w-28"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
        <select
          value={isActive}
          onChange={(e) => setIsActive(e.target.value)}
          className="border px-3 py-1.5 rounded text-sm text-gray-900 w-32"
        >
          <option value="all">All</option>
          <option value="true">Active Only</option>
          <option value="false">Inactive Only</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-medium"
        >
          Filter
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="border bg-white hover:bg-gray-100 text-gray-700 px-3 py-1.5 rounded text-sm"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
