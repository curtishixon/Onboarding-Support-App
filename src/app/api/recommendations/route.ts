import { NextRequest, NextResponse } from "next/server";
import { dataProvider } from "@/lib/data-provider-instance";
import type { RecommendationFilters } from "@/types/recommendations";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const filters: RecommendationFilters = {};

  const status = searchParams.get("status");
  if (status) filters.status = status as RecommendationFilters["status"];

  const category = searchParams.get("category");
  if (category) filters.category = category as RecommendationFilters["category"];

  const storeId = searchParams.get("storeId");
  if (storeId) filters.storeId = storeId;

  const countOnly = searchParams.get("counts");
  if (countOnly === "true") {
    const counts = await dataProvider.getRecommendationCounts();
    return NextResponse.json(counts);
  }

  const recommendations = await dataProvider.getRecommendations(filters);
  return NextResponse.json(recommendations);
}
