import type { RecommendationStatus } from "@/types/recommendations";
import { STATUS_LABELS } from "@/types/recommendations";

const STATUS_STYLES: Record<RecommendationStatus, string> = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border-amber-200 dark:border-amber-500/30",
  approved: "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300 border-blue-200 dark:border-blue-500/30",
  rejected: "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300 border-gray-200 dark:border-gray-500/30",
  executed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30",
  failed: "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300 border-red-200 dark:border-red-500/30",
};

const DOT_STYLES: Record<RecommendationStatus, string> = {
  pending: "bg-amber-500 dark:bg-amber-400",
  approved: "bg-blue-500 dark:bg-blue-400",
  rejected: "bg-gray-500 dark:bg-gray-400",
  executed: "bg-emerald-500 dark:bg-emerald-400",
  failed: "bg-red-500 dark:bg-red-400",
};

export function StatusBadge({ status }: { status: RecommendationStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLES[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${DOT_STYLES[status]}`} />
      {STATUS_LABELS[status]}
    </span>
  );
}
