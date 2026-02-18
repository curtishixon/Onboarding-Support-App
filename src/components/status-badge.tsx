import type { RecommendationStatus } from "@/types/recommendations";
import { STATUS_LABELS } from "@/types/recommendations";

const STATUS_STYLES: Record<RecommendationStatus, { bg: string; text: string; dot: string }> = {
  pending: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-400",
  },
  approved: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-400",
  },
  rejected: {
    bg: "bg-gray-100",
    text: "text-gray-600",
    dot: "bg-gray-400",
  },
  executed: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-400",
  },
  failed: {
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-400",
  },
};

export function StatusBadge({ status }: { status: RecommendationStatus }) {
  const style = STATUS_STYLES[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {STATUS_LABELS[status]}
    </span>
  );
}
