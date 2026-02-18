import { StatsCards } from "@/components/stats-cards";
import { RecommendationsTable } from "@/components/recommendations-table";

export default function DashboardPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gradient">Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage and review onboarding recommendations</p>
      </div>

      {/* Stats */}
      <StatsCards />

      {/* Recommendations Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recommendations</h2>
        </div>
        <RecommendationsTable />
      </div>
    </div>
  );
}
