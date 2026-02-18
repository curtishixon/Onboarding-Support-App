"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Recommendation, RecommendationStatus, ActionCategory } from "@/types/recommendations";
import { fetchRecommendations } from "@/lib/api-client";
import { StatusBadge } from "./status-badge";
import { CategoryTag } from "./category-tag";
import { STORES } from "@/lib/mock-data-provider";

interface Props {
  initialStatus?: RecommendationStatus;
}

export function RecommendationsTable({ initialStatus }: Props) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<RecommendationStatus | "">(
    initialStatus ?? ""
  );
  const [categoryFilter, setCategoryFilter] = useState<ActionCategory | "">("");
  const [storeFilter, setStoreFilter] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    const filters: Record<string, string> = {};
    if (statusFilter) filters.status = statusFilter;
    if (categoryFilter) filters.category = categoryFilter;
    if (storeFilter) filters.storeId = storeFilter;

    fetchRecommendations(filters as Parameters<typeof fetchRecommendations>[0])
      .then(setRecommendations)
      .finally(() => setLoading(false));
  }, [statusFilter, categoryFilter, storeFilter]);

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 px-6 py-4 bg-gray-50/50 border-b border-gray-100">
        {/* Store Filter */}
        <div className="relative">
          <select
            value={storeFilter}
            onChange={(e) => setStoreFilter(e.target.value)}
            className="appearance-none border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
          >
            <option value="">All Stores</option>
            {Object.entries(STORES).map(([name, { id }]) => (
              <option key={id} value={name}>
                {name}
              </option>
            ))}
          </select>
          <svg className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as RecommendationStatus | "")}
            className="appearance-none border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="executed">Executed</option>
            <option value="failed">Failed</option>
          </select>
          <svg className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Category Filter */}
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as ActionCategory | "")}
            className="appearance-none border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
          >
            <option value="">All Categories</option>
            <option value="fulfillment_center">Fulfillment Center</option>
            <option value="catalog_item">Catalog Item</option>
            <option value="carrier_account">Carrier Account</option>
            <option value="cartonization">Cartonization</option>
            <option value="packing_slip">Packing Slip</option>
            <option value="pddp">PDDP</option>
            <option value="collect_invoice">Collect Invoice</option>
            <option value="webhook">Webhook</option>
          </select>
          <svg className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-gray-500">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-sm">Loading recommendations...</span>
          </div>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-sm font-medium">No recommendations found</p>
          <p className="text-xs text-gray-400 mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 font-medium text-gray-500 uppercase text-xs tracking-wider">Status</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500 uppercase text-xs tracking-wider">Category</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500 uppercase text-xs tracking-wider">Title</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500 uppercase text-xs tracking-wider">Store</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500 uppercase text-xs tracking-wider">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recommendations.map((rec) => (
                <tr
                  key={rec.id}
                  className="hover:bg-blue-50/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <StatusBadge status={rec.status} />
                  </td>
                  <td className="px-6 py-4">
                    <CategoryTag category={rec.category} />
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/recommendations/${rec.id}`}
                      className="text-gray-900 font-medium hover:text-blue-600 transition-colors group-hover:text-blue-600"
                    >
                      {rec.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                      {rec.storeId}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(rec.updatedAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
