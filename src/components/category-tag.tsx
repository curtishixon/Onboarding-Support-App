import type { ActionCategory } from "@/types/recommendations";
import { ACTION_CATEGORY_LABELS } from "@/types/recommendations";

const CATEGORY_COLORS: Record<ActionCategory, string> = {
  fulfillment_center: "bg-purple-100 text-purple-800",
  catalog_item: "bg-indigo-100 text-indigo-800",
  carrier_account: "bg-cyan-100 text-cyan-800",
  cartonization: "bg-teal-100 text-teal-800",
  packing_slip: "bg-emerald-100 text-emerald-800",
  pddp: "bg-orange-100 text-orange-800",
  collect_invoice: "bg-amber-100 text-amber-800",
  webhook: "bg-pink-100 text-pink-800",
};

export function CategoryTag({ category }: { category: ActionCategory }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[category]}`}
    >
      {ACTION_CATEGORY_LABELS[category]}
    </span>
  );
}
