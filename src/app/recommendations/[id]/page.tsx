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
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3 text-[var(--text-tertiary)]">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-sm">Loading recommendation...</span>
        </div>
      </div>
    );
  }

  if (error || !recommendation) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 max-w-md">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="font-medium text-red-600 dark:text-red-400">{error || "Recommendation not found"}</p>
            <Link href="/" className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm mt-2 inline-flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-[var(--text-tertiary)] hover:text-blue-600 text-sm mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Dashboard
      </Link>

      {/* Header Card */}
      <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] shadow-sm p-6 mb-6 transition-colors">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-3">{recommendation.title}</h1>
            <div className="flex items-center gap-3 flex-wrap">
              <StatusBadge status={recommendation.status} />
              <CategoryTag category={recommendation.category} />
              <span className="text-sm text-[var(--text-tertiary)] font-mono">{recommendation.storeId}</span>
            </div>
          </div>
        </div>
        {recommendation.description && (
          <p className="text-[var(--text-secondary)] mt-4 pt-4 border-t border-[var(--border-primary)]">{recommendation.description}</p>
        )}
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] shadow-sm p-4 transition-colors">
          <p className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Created</p>
          <p className="text-sm text-[var(--text-primary)]">{new Date(recommendation.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</p>
          <p className="text-xs text-[var(--text-tertiary)]">{new Date(recommendation.createdAt).toLocaleTimeString()}</p>
        </div>
        <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] shadow-sm p-4 transition-colors">
          <p className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Updated</p>
          <p className="text-sm text-[var(--text-primary)]">{new Date(recommendation.updatedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</p>
          <p className="text-xs text-[var(--text-tertiary)]">{new Date(recommendation.updatedAt).toLocaleTimeString()}</p>
        </div>
        {recommendation.reviewedBy && (
          <>
            <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] shadow-sm p-4 transition-colors">
              <p className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Reviewed By</p>
              <p className="text-sm text-[var(--text-primary)]">{recommendation.reviewedBy}</p>
            </div>
            <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] shadow-sm p-4 transition-colors">
              <p className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Reviewed At</p>
              <p className="text-sm text-[var(--text-primary)]">
                {recommendation.reviewedAt
                  ? new Date(recommendation.reviewedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
                  : "-"}
              </p>
              {recommendation.reviewedAt && (
                <p className="text-xs text-[var(--text-tertiary)]">{new Date(recommendation.reviewedAt).toLocaleTimeString()}</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Payload Section */}
      <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] shadow-sm overflow-hidden mb-6 transition-colors">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-primary)]">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Payload</h2>
          <button
            onClick={() => setShowRawPayload(!showRawPayload)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] bg-[var(--bg-tertiary)] hover:bg-[var(--bg-hover)] rounded-lg transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            {showRawPayload ? "Structured View" : "Raw JSON"}
          </button>
        </div>

        <div className="p-6">
          {showRawPayload ? (
            <pre className="text-xs font-mono bg-gray-900 text-gray-100 rounded-lg p-4 overflow-auto max-h-96">
              {JSON.stringify(recommendation.payload, null, 2)}
            </pre>
          ) : (
            <PayloadRenderer
              category={recommendation.category}
              payload={recommendation.payload}
            />
          )}
        </div>
      </div>

      {/* Execution Result */}
      {recommendation.executionResult && (
        <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] shadow-sm overflow-hidden mb-6 transition-colors">
          <div className="px-6 py-4 border-b border-[var(--border-primary)]">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Execution Result</h2>
          </div>
          <div className="p-6">
            <ExecutionResultPanel result={recommendation.executionResult} />
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] shadow-sm p-5 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[var(--text-secondary)]">Actions</span>
          <ActionBar
            recommendation={recommendation}
            onUpdate={setRecommendation}
          />
        </div>
      </div>
    </div>
  );
}
