"use client";

import { useState } from "react";
import type { Recommendation } from "@/types/recommendations";
import {
  approveRecommendation,
  rejectRecommendation,
  executeRecommendation,
} from "@/lib/api-client";

interface Props {
  recommendation: Recommendation;
  onUpdate: (updated: Recommendation) => void;
}

export function ActionBar({ recommendation, onUpdate }: Props) {
  const [loading, setLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState<string | null>(null);

  async function handleAction(action: string) {
    if (confirmAction !== action) {
      setConfirmAction(action);
      return;
    }

    setLoading(true);
    setConfirmAction(null);

    try {
      if (action === "approve") {
        const updated = await approveRecommendation(
          recommendation.id,
          "current_user"
        );
        onUpdate(updated);
      } else if (action === "reject") {
        const updated = await rejectRecommendation(
          recommendation.id,
          "current_user"
        );
        onUpdate(updated);
      } else if (action === "execute") {
        const result = await executeRecommendation(recommendation.id);
        // Refetch to get updated status
        const response = await fetch(`/api/recommendations/${recommendation.id}`);
        const updated = await response.json();
        onUpdate({ ...updated, executionResult: result });
      }
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        Processing...
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {recommendation.status === "pending" && (
        <>
          <button
            onClick={() => handleAction("approve")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm ${
              confirmAction === "approve"
                ? "bg-emerald-600 text-white shadow-emerald-200"
                : "bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-md"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {confirmAction === "approve" ? "Confirm Approve" : "Approve"}
          </button>
          <button
            onClick={() => handleAction("reject")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              confirmAction === "reject"
                ? "bg-red-600 text-white shadow-sm"
                : "bg-white text-red-600 border border-red-200 hover:bg-red-50"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            {confirmAction === "reject" ? "Confirm Reject" : "Reject"}
          </button>
        </>
      )}

      {recommendation.status === "approved" && (
        <button
          onClick={() => handleAction("execute")}
          className={`btn-primary inline-flex items-center gap-2 ${
            confirmAction === "execute" ? "opacity-90" : ""
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          {confirmAction === "execute" ? "Confirm Execute" : "Execute Mutation"}
        </button>
      )}

      {recommendation.status === "failed" && (
        <button
          onClick={() => handleAction("execute")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm ${
            confirmAction === "execute"
              ? "bg-amber-600 text-white"
              : "bg-amber-500 text-white hover:bg-amber-600 hover:shadow-md"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {confirmAction === "execute" ? "Confirm Retry" : "Retry"}
        </button>
      )}

      {confirmAction && (
        <button
          onClick={() => setConfirmAction(null)}
          className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
