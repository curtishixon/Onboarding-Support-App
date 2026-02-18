import { StatsCards } from "@/components/stats-cards";
import { RecommendationsTable } from "@/components/recommendations-table";

export default function DashboardPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gradient">Dashboard</h1>
        <p className="text-[var(--text-tertiary)] mt-1">Manage and review onboarding recommendations</p>
      </div>

      {/* Stats */}
      <StatsCards />

      {/* Recommendations Table */}
      <div className="bg-[var(--bg-secondary)] rounded-xl shadow-sm border border-[var(--border-primary)] overflow-hidden transition-colors">
        <div className="px-6 py-4 border-b border-[var(--border-primary)]">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Recommendations</h2>
        </div>
        <RecommendationsTable />
      </div>
    </div>
  );
}
