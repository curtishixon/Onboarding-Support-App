"use client";

import React, { useEffect, useState } from "react";
import type { RecommendationStatus } from "@/types/recommendations";
import { fetchRecommendationCounts } from "@/lib/api-client";

const CARD_CONFIG: {
  status: RecommendationStatus;
  label: string;
  bgColor: string;
  iconColor: string;
  icon: React.ReactNode;
}[] = [
  {
    status: "pending",
    label: "Pending",
    bgColor: "bg-amber-50",
    iconColor: "text-amber-500",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    status: "approved",
    label: "Approved",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-500",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    status: "executed",
    label: "Executed",
    bgColor: "bg-emerald-50",
    iconColor: "text-emerald-500",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  {
    status: "failed",
    label: "Failed",
    bgColor: "bg-red-50",
    iconColor: "text-red-500",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
];

export function StatsCards() {
  const [counts, setCounts] = useState<Record<RecommendationStatus, number> | null>(null);

  useEffect(() => {
    fetchRecommendationCounts().then(setCounts);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {CARD_CONFIG.map(({ status, label, bgColor, iconColor, icon }) => (
        <div
          key={status}
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 card-hover"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {counts ? counts[status] : "-"}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-lg ${bgColor} ${iconColor} flex items-center justify-center`}>
              {icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
