"use client";

import { useEffect, useState } from "react";
import type { RecommendationStatus } from "@/types/recommendations";
import { fetchRecommendationCounts } from "@/lib/api-client";

const CARD_CONFIG: {
  status: RecommendationStatus;
  label: string;
  color: string;
}[] = [
  { status: "pending", label: "Pending", color: "border-yellow-400 bg-yellow-50" },
  { status: "approved", label: "Approved", color: "border-blue-400 bg-blue-50" },
  { status: "executed", label: "Executed", color: "border-green-400 bg-green-50" },
  { status: "failed", label: "Failed", color: "border-red-400 bg-red-50" },
];

export function StatsCards() {
  const [counts, setCounts] = useState<Record<RecommendationStatus, number> | null>(null);

  useEffect(() => {
    fetchRecommendationCounts().then(setCounts);
  }, []);

  return (
    <div className="grid grid-cols-4 gap-4 mb-8">
      {CARD_CONFIG.map(({ status, label, color }) => (
        <div
          key={status}
          className={`border-l-4 rounded-lg p-4 ${color}`}
        >
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-bold mt-1">
            {counts ? counts[status] : "-"}
          </p>
        </div>
      ))}
    </div>
  );
}
