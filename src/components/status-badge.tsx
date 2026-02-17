import type { RecommendationStatus } from "@/types/recommendations";
import { STATUS_LABELS } from "@/types/recommendations";

const STATUS_COLORS: Record<RecommendationStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-blue-100 text-blue-800",
  rejected: "bg-gray-100 text-gray-600",
  executed: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
};

export function StatusBadge({ status }: { status: RecommendationStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
