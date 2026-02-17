import type {
  Recommendation,
  RecommendationFilters,
  RecommendationStatus,
  ExecutionResult,
} from "@/types/recommendations";

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || `Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function fetchRecommendations(
  filters?: RecommendationFilters
): Promise<Recommendation[]> {
  const params = new URLSearchParams();
  if (filters?.status) params.set("status", filters.status);
  if (filters?.category) params.set("category", filters.category);
  if (filters?.storeId) params.set("storeId", filters.storeId);
  const qs = params.toString();
  return fetchJSON(`/api/recommendations${qs ? `?${qs}` : ""}`);
}

export async function fetchRecommendation(id: string): Promise<Recommendation> {
  return fetchJSON(`/api/recommendations/${id}`);
}

export async function fetchRecommendationCounts(): Promise<
  Record<RecommendationStatus, number>
> {
  return fetchJSON("/api/recommendations?counts=true");
}

export async function approveRecommendation(
  id: string,
  reviewedBy: string
): Promise<Recommendation> {
  return fetchJSON(`/api/recommendations/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "approved", reviewedBy }),
  });
}

export async function rejectRecommendation(
  id: string,
  reviewedBy: string
): Promise<Recommendation> {
  return fetchJSON(`/api/recommendations/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "rejected", reviewedBy }),
  });
}

export async function executeRecommendation(
  id: string
): Promise<ExecutionResult> {
  return fetchJSON(`/api/recommendations/${id}/execute`, {
    method: "POST",
  });
}
