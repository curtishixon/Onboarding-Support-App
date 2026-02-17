"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Recommendation, RecommendationStatus, ActionCategory } from "@/types/recommendations";
import { fetchRecommendations } from "@/lib/api-client";
import { StatusBadge } from "./status-badge";
import { CategoryTag } from "./category-tag";

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

  useEffect(() => {
    setLoading(true);
    const filters: Record<string, string> = {};
    if (statusFilter) filters.status = statusFilter;
    if (categoryFilter) filters.category = categoryFilter;

    fetchRecommendations(filters as Parameters<typeof fetchRecommendations>[0])
      .then(setRecommendations)
      .finally(() => setLoading(false));
  }, [statusFilter, categoryFilter]);

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as RecommendationStatus | "")}
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="executed">Executed</option>
          <option value="failed">Failed</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as ActionCategory | "")}
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white"
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
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading...</p>
      ) : recommendations.length === 0 ? (
        <p className="text-gray-500 text-sm">No recommendations found.</p>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Category</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Title</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Store</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recommendations.map((rec) => (
                <tr
                  key={rec.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <StatusBadge status={rec.status} />
                  </td>
                  <td className="px-4 py-3">
                    <CategoryTag category={rec.category} />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/recommendations/${rec.id}`}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {rec.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{rec.storeId}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(rec.updatedAt).toLocaleDateString()}
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
