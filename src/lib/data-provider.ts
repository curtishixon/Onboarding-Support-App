import type {
  Recommendation,
  RecommendationFilters,
  RecommendationStatus,
  ExecutionResult,
} from "@/types/recommendations";

export interface DataProvider {
  getRecommendations(filters?: RecommendationFilters): Promise<Recommendation[]>;
  getRecommendation(id: string): Promise<Recommendation | null>;
  updateRecommendationStatus(
    id: string,
    status: RecommendationStatus,
    reviewedBy?: string
  ): Promise<Recommendation>;
  setExecutionResult(id: string, result: ExecutionResult): Promise<Recommendation>;
  getRecommendationCounts(): Promise<Record<RecommendationStatus, number>>;
}
