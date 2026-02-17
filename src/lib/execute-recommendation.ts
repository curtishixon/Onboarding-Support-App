import type { Recommendation } from "@/types/recommendations";
import type { ExecutionResult } from "@/types/recommendations";
import type {
  FulfillmentCenterCreateInput,
  CatalogItemCreateInput,
  CatalogItemUpdateInput,
  CarrierAccountConnectInput,
  CartonizationSettingsUpdateInput,
  PackingSlipSettingsUpdateInput,
  PddpSettingsUpdateInput,
  CollectInvoiceSettingsUpdateInput,
  WebhookCreateInput,
  WebhookUpdateInput,
} from "@/types/zonos";
import * as zonos from "./zonos-client";

export async function executeRecommendation(
  recommendation: Recommendation
): Promise<ExecutionResult> {
  try {
    const { category, action, payload } = recommendation;

    switch (category) {
      case "fulfillment_center": {
        const result = await zonos.createFulfillmentCenter(
          payload as unknown as FulfillmentCenterCreateInput
        );
        if (result.errors?.length) {
          return { success: false, error: result.errors[0].message };
        }
        return { success: true, data: result.data as unknown as Record<string, unknown> };
      }

      case "catalog_item": {
        if (action === "create") {
          const result = await zonos.createCatalogItem([
            payload as unknown as CatalogItemCreateInput,
          ]);
          if (result.errors?.length) {
            return { success: false, error: result.errors[0].message };
          }
          return { success: true, data: result.data as unknown as Record<string, unknown> };
        }
        if (action === "update") {
          const result = await zonos.updateCatalogItem([
            payload as unknown as CatalogItemUpdateInput,
          ]);
          if (result.errors?.length) {
            return { success: false, error: result.errors[0].message };
          }
          return { success: true, data: result.data as unknown as Record<string, unknown> };
        }
        return { success: false, error: `Unsupported action: ${action}` };
      }

      case "carrier_account": {
        const result = await zonos.connectCarrierAccount(
          payload as unknown as CarrierAccountConnectInput
        );
        if (result.errors?.length) {
          return { success: false, error: result.errors[0].message };
        }
        return { success: true, data: result.data as unknown as Record<string, unknown> };
      }

      case "cartonization": {
        const result = await zonos.updateCartonizationSettings(
          payload as unknown as CartonizationSettingsUpdateInput
        );
        if (result.errors?.length) {
          return { success: false, error: result.errors[0].message };
        }
        return { success: true, data: result.data as unknown as Record<string, unknown> };
      }

      case "packing_slip": {
        const result = await zonos.updatePackingSlipSettings(
          payload as unknown as PackingSlipSettingsUpdateInput
        );
        if (result.errors?.length) {
          return { success: false, error: result.errors[0].message };
        }
        return { success: true, data: result.data as unknown as Record<string, unknown> };
      }

      case "pddp": {
        const result = await zonos.updatePddpSettings(
          payload as unknown as PddpSettingsUpdateInput
        );
        if (result.errors?.length) {
          return { success: false, error: result.errors[0].message };
        }
        return { success: true, data: result.data as unknown as Record<string, unknown> };
      }

      case "collect_invoice": {
        const result = await zonos.updateCollectInvoiceSettings(
          payload as unknown as CollectInvoiceSettingsUpdateInput
        );
        if (result.errors?.length) {
          return { success: false, error: result.errors[0].message };
        }
        return { success: true, data: result.data as unknown as Record<string, unknown> };
      }

      case "webhook": {
        if (action === "create") {
          const result = await zonos.createWebhook(
            payload as unknown as WebhookCreateInput
          );
          if (result.errors?.length) {
            return { success: false, error: result.errors[0].message };
          }
          return { success: true, data: result.data as unknown as Record<string, unknown> };
        }
        if (action === "update") {
          const result = await zonos.updateWebhook(
            payload as unknown as WebhookUpdateInput
          );
          if (result.errors?.length) {
            return { success: false, error: result.errors[0].message };
          }
          return { success: true, data: result.data as unknown as Record<string, unknown> };
        }
        if (action === "delete") {
          const id = (payload as { id?: string }).id;
          if (!id) return { success: false, error: "Missing webhook ID" };
          const result = await zonos.deleteWebhook(id);
          if (result.errors?.length) {
            return { success: false, error: result.errors[0].message };
          }
          return { success: true, data: result.data as unknown as Record<string, unknown> };
        }
        return { success: false, error: `Unsupported action: ${action}` };
      }

      default:
        return { success: false, error: `Unknown category: ${category}` };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
