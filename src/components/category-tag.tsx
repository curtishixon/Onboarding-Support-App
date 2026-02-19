import type { ActionCategory } from "@/types/recommendations";
import { ACTION_CATEGORY_LABELS } from "@/types/recommendations";

const CATEGORY_STYLES: Record<ActionCategory, string> = {
  fulfillment_center: "bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300 border-purple-300 dark:border-purple-500/40",
  catalog_item: "bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300 border-indigo-300 dark:border-indigo-500/40",
  carrier_account: "bg-cyan-100 text-cyan-800 dark:bg-cyan-500/20 dark:text-cyan-300 border-cyan-300 dark:border-cyan-500/40",
  cartonization: "bg-teal-100 text-teal-800 dark:bg-teal-500/20 dark:text-teal-300 border-teal-300 dark:border-teal-500/40",
  packing_slip: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40",
  pddp: "bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300 border-orange-300 dark:border-orange-500/40",
  collect_invoice: "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border-amber-300 dark:border-amber-500/40",
  webhook: "bg-pink-100 text-pink-800 dark:bg-pink-500/20 dark:text-pink-300 border-pink-300 dark:border-pink-500/40",
};

export function CategoryTag({ category }: { category: ActionCategory }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${CATEGORY_STYLES[category]}`}
    >
      {ACTION_CATEGORY_LABELS[category]}
    </span>
  );
}
