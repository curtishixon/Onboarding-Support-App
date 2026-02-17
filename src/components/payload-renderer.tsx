import type { ActionCategory } from "@/types/recommendations";
import { FulfillmentCenterPayload } from "./payload-renderers/fulfillment-center-payload";
import { CatalogItemPayload } from "./payload-renderers/catalog-item-payload";
import { WebhookPayload } from "./payload-renderers/webhook-payload";
import { SettingsPayload } from "./payload-renderers/settings-payload";

interface Props {
  category: ActionCategory;
  payload: Record<string, unknown>;
}

export function PayloadRenderer({ category, payload }: Props) {
  switch (category) {
    case "fulfillment_center":
      return <FulfillmentCenterPayload data={payload} />;
    case "catalog_item":
      return <CatalogItemPayload data={payload} />;
    case "webhook":
      return <WebhookPayload data={payload} />;
    case "carrier_account":
    case "cartonization":
    case "packing_slip":
    case "pddp":
    case "collect_invoice":
      return <SettingsPayload data={payload} />;
    default:
      return <SettingsPayload data={payload} />;
  }
}
