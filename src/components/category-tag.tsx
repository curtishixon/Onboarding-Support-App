import type { ActionCategory } from "@/types/recommendations";
import { ACTION_CATEGORY_LABELS } from "@/types/recommendations";

const CATEGORY_STYLES: Record<ActionCategory, { bg: string; text: string; border: string }> = {
  fulfillment_center: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  catalog_item: {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    border: "border-indigo-200",
  },
  carrier_account: {
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    border: "border-cyan-200",
  },
  cartonization: {
    bg: "bg-teal-50",
    text: "text-teal-700",
    border: "border-teal-200",
  },
  packing_slip: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  pddp: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
  },
  collect_invoice: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  webhook: {
    bg: "bg-pink-50",
    text: "text-pink-700",
    border: "border-pink-200",
  },
};

export function CategoryTag({ category }: { category: ActionCategory }) {
  const style = CATEGORY_STYLES[category];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${style.bg} ${style.text} ${style.border}`}
    >
      {ACTION_CATEGORY_LABELS[category]}
    </span>
  );
}
