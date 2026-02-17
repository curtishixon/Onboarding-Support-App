import { StatsCards } from "@/components/stats-cards";
import { RecommendationsTable } from "@/components/recommendations-table";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <StatsCards />
      <h2 className="text-lg font-semibold mb-4">Recommendations</h2>
      <RecommendationsTable />
    </div>
  );
}
