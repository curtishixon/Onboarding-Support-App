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
      <div className="flex items-center gap-2 text-sm text-gray-500">
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
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              confirmAction === "approve"
                ? "bg-green-700 text-white"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {confirmAction === "approve" ? "Confirm Approve" : "Approve"}
          </button>
          <button
            onClick={() => handleAction("reject")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              confirmAction === "reject"
                ? "bg-red-700 text-white"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            {confirmAction === "reject" ? "Confirm Reject" : "Reject"}
          </button>
        </>
      )}

      {recommendation.status === "approved" && (
        <button
          onClick={() => handleAction("execute")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            confirmAction === "execute"
              ? "bg-blue-700 text-white"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {confirmAction === "execute"
            ? "Confirm Execute"
            : "Execute Mutation"}
        </button>
      )}

      {recommendation.status === "failed" && (
        <button
          onClick={() => handleAction("execute")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            confirmAction === "execute"
              ? "bg-orange-700 text-white"
              : "bg-orange-600 text-white hover:bg-orange-700"
          }`}
        >
          {confirmAction === "execute" ? "Confirm Retry" : "Retry"}
        </button>
      )}

      {confirmAction && (
        <button
          onClick={() => setConfirmAction(null)}
          className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
