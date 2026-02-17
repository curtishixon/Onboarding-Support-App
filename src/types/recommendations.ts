export type ActionCategory =
  | "fulfillment_center"
  | "catalog_item"
  | "carrier_account"
  | "cartonization"
  | "packing_slip"
  | "pddp"
  | "collect_invoice"
  | "webhook";

export type RecommendationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "executed"
  | "failed";

export interface ExecutionResult {
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
}

export interface Recommendation {
  id: string;
  storeId: string;
  category: ActionCategory;
  action: "create" | "update" | "delete";
  title: string;
  description: string;
  payload: Record<string, unknown>;
  status: RecommendationStatus;
  createdAt: string;
  updatedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  executionResult?: ExecutionResult;
  metadata?: Record<string, unknown>;
}

export interface RecommendationFilters {
  status?: RecommendationStatus;
  category?: ActionCategory;
  storeId?: string;
}

export const ACTION_CATEGORY_LABELS: Record<ActionCategory, string> = {
  fulfillment_center: "Fulfillment Center",
  catalog_item: "Catalog Item",
  carrier_account: "Carrier Account",
  cartonization: "Cartonization Settings",
  packing_slip: "Packing Slip Settings",
  pddp: "PDDP Settings",
  collect_invoice: "Collect Invoice Settings",
  webhook: "Webhook",
};

export const STATUS_LABELS: Record<RecommendationStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  executed: "Executed",
  failed: "Failed",
};
