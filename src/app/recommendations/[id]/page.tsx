"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { Recommendation } from "@/types/recommendations";
import { fetchRecommendation } from "@/lib/api-client";
import { StatusBadge } from "@/components/status-badge";
import { CategoryTag } from "@/components/category-tag";
import { PayloadRenderer } from "@/components/payload-renderer";
import { ActionBar } from "@/components/action-bar";
import { ExecutionResultPanel } from "@/components/execution-result";

export default function RecommendationDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRawPayload, setShowRawPayload] = useState(false);

  useEffect(() => {
    fetchRecommendation(id)
      .then(setRecommendation)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="text-gray-500">Loading...</p>;
  }

  if (error || !recommendation) {
    return (
      <div>
        <p className="text-red-600">{error || "Recommendation not found"}</p>
        <Link href="/" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <Link href="/" className="text-blue-600 hover:underline text-sm mb-4 inline-block">
        &larr; Back to Dashboard
      </Link>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{recommendation.title}</h1>
        <div className="flex items-center gap-3 mb-2">
          <StatusBadge status={recommendation.status} />
          <CategoryTag category={recommendation.category} />
          <span className="text-sm text-gray-500">{recommendation.storeId}</span>
        </div>
        <p className="text-gray-600 text-sm">{recommendation.description}</p>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
        <div>
          <p className="text-gray-500">Created</p>
          <p>{new Date(recommendation.createdAt).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-500">Updated</p>
          <p>{new Date(recommendation.updatedAt).toLocaleString()}</p>
        </div>
        {recommendation.reviewedBy && (
          <>
            <div>
              <p className="text-gray-500">Reviewed By</p>
              <p>{recommendation.reviewedBy}</p>
            </div>
            <div>
              <p className="text-gray-500">Reviewed At</p>
              <p>
                {recommendation.reviewedAt
                  ? new Date(recommendation.reviewedAt).toLocaleString()
                  : "-"}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Payload Preview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Payload</h2>
          <button
            onClick={() => setShowRawPayload(!showRawPayload)}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            {showRawPayload ? "Structured View" : "Raw JSON"}
          </button>
        </div>

        {showRawPayload ? (
          <pre className="text-xs font-mono bg-gray-50 rounded p-4 overflow-auto max-h-96">
            {JSON.stringify(recommendation.payload, null, 2)}
          </pre>
        ) : (
          <PayloadRenderer
            category={recommendation.category}
            payload={recommendation.payload}
          />
        )}
      </div>

      {/* Execution Result */}
      {recommendation.executionResult && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Execution Result</h2>
          <ExecutionResultPanel result={recommendation.executionResult} />
        </div>
      )}

      {/* Action Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <ActionBar
          recommendation={recommendation}
          onUpdate={setRecommendation}
        />
      </div>
    </div>
  );
}
