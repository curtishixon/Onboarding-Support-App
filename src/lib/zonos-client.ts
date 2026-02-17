import type {
  ZonosGraphQLResponse,
  FulfillmentCenter,
  FulfillmentCenterCreateInput,
  CatalogItem,
  CatalogItemCreateInput,
  CatalogItemUpdateInput,
  CarrierAccountConnectInput,
  CarrierAccount,
  CartonizationSettingsUpdateInput,
  PackingSlipSettingsUpdateInput,
  PddpSettingsUpdateInput,
  CollectInvoiceSettingsUpdateInput,
  WebhookCreateInput,
  WebhookUpdateInput,
  Webhook,
  ShippingZone,
  ShippingProfile,
  HelloSettings,
  ServiceLevel,
} from "@/types/zonos";
import { getApiKey, getProxyKey } from "./credentials";

const ZONOS_API_URL = "https://api.zonos.com/graphql";

interface RequestOptions {
  useProxyKey?: boolean;
  credentialToken?: string;
}

async function zonosRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
  options?: RequestOptions
): Promise<ZonosGraphQLResponse<T>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    credentialToken: options?.credentialToken ?? getApiKey(),
  };

  if (options?.useProxyKey) {
    headers.credentialTokenProxy = getProxyKey();
  }

  const response = await fetch(ZONOS_API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Zonos API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<ZonosGraphQLResponse<T>>;
}

// --- Mutation functions ---

export async function createFulfillmentCenter(
  input: FulfillmentCenterCreateInput,
  options?: RequestOptions
): Promise<ZonosGraphQLResponse<{ partyCreate: { id: string }; fulfillmentCenterCreate: FulfillmentCenter }>> {
  // Two-step: create party first, then fulfillment center
  const partyResult = await zonosRequest<{ partyCreate: { id: string } }>(
    `mutation CreateParty($input: PartyCreateInput!) {
      partyCreate(input: $input) {
        id type
        location { line1 line2 locality administrativeAreaCode postalCode countryCode }
        person { firstName lastName email phone companyName }
      }
    }`,
    { input: input.party },
    options
  );

  if (partyResult.errors?.length || !partyResult.data?.partyCreate?.id) {
    return partyResult as ZonosGraphQLResponse<{ partyCreate: { id: string }; fulfillmentCenterCreate: FulfillmentCenter }>;
  }

  const partyId = partyResult.data.partyCreate.id;

  // Introspect the actual fulfillmentCenterCreate input shape
  // Based on the docs reference: name + party (party ID)
  return zonosRequest(
    `mutation CreateFulfillmentCenter($name: String!, $party: ID!) {
      fulfillmentCenterCreate(name: $name, party: $party) {
        id name
        party {
          id type
          location { line1 line2 locality administrativeAreaCode postalCode countryCode }
          person { firstName lastName email phone companyName }
        }
      }
    }`,
    { name: input.name, party: partyId },
    options
  );
}

export async function createCatalogItem(
  input: CatalogItemCreateInput[],
  options?: RequestOptions
): Promise<ZonosGraphQLResponse<{ catalogItemCreate: CatalogItem[] }>> {
  return zonosRequest(
    `mutation CreateCatalogItems($input: [CatalogItemCreateInput!]!) {
      catalogItemCreate(input: $input) {
        id name description hsCode countryOfOrigin productId sku
      }
    }`,
    { input },
    options
  );
}

export async function updateCatalogItem(
  input: CatalogItemUpdateInput[],
  options?: RequestOptions
): Promise<ZonosGraphQLResponse<{ catalogItemUpdate: CatalogItem[] }>> {
  return zonosRequest(
    `mutation UpdateCatalogItems($input: [CatalogItemUpdateInput!]!) {
      catalogItemUpdate(input: $input) {
        id name description hsCode countryOfOrigin productId sku
      }
    }`,
    { input },
    options
  );
}

export async function connectCarrierAccount(
  input: CarrierAccountConnectInput,
  options?: RequestOptions
): Promise<ZonosGraphQLResponse<{ carrierAccountConnect: CarrierAccount }>> {
  return zonosRequest(
    `mutation ConnectCarrierAccount($input: CarrierAccountConnectInput!) {
      carrierAccountConnect(input: $input) {
        id
      }
    }`,
    { input },
    options
  );
}

export async function updateCartonizationSettings(
  input: CartonizationSettingsUpdateInput,
  options?: RequestOptions
): Promise<ZonosGraphQLResponse<{ cartonizationSettingsUpdate: Record<string, unknown> }>> {
  return zonosRequest(
    `mutation UpdateCartonizationSettings($input: CartonizationSettingsUpdateInput!) {
      cartonizationSettingsUpdate(input: $input) {
        id
      }
    }`,
    { input },
    options
  );
}

export async function updatePackingSlipSettings(
  input: PackingSlipSettingsUpdateInput,
  options?: RequestOptions
): Promise<ZonosGraphQLResponse<{ packingSlipSettingsUpdate: Record<string, unknown> }>> {
  return zonosRequest(
    `mutation UpdatePackingSlipSettings($input: PackingSlipSettingsUpdateInput!) {
      packingSlipSettingsUpdate(input: $input) {
        id
      }
    }`,
    { input },
    options
  );
}

export async function updatePddpSettings(
  input: PddpSettingsUpdateInput,
  options?: RequestOptions
): Promise<ZonosGraphQLResponse<{ pddpSettingsUpdate: Record<string, unknown> }>> {
  return zonosRequest(
    `mutation UpdatePddpSettings($input: PddpSettingsUpdateInput!) {
      pddpSettingsUpdate(input: $input) {
        id
      }
    }`,
    { input },
    options
  );
}

export async function updateCollectInvoiceSettings(
  input: CollectInvoiceSettingsUpdateInput,
  options?: RequestOptions
): Promise<ZonosGraphQLResponse<{ collectInvoiceSettingsUpdate: Record<string, unknown> }>> {
  return zonosRequest(
    `mutation UpdateCollectInvoiceSettings($input: CollectInvoiceSettingsUpdateInput!) {
      collectInvoiceSettingsUpdate(input: $input) {
        id
      }
    }`,
    { input },
    options
  );
}

export async function createWebhook(
  input: WebhookCreateInput,
  options?: RequestOptions
): Promise<ZonosGraphQLResponse<{ webhookCreate: Webhook }>> {
  return zonosRequest(
    `mutation CreateWebhook($input: WebhookCreateInput!) {
      webhookCreate(input: $input) {
        id url events
      }
    }`,
    { input },
    options
  );
}

export async function updateWebhook(
  input: WebhookUpdateInput,
  options?: RequestOptions
): Promise<ZonosGraphQLResponse<{ webhookUpdate: Webhook }>> {
  return zonosRequest(
    `mutation UpdateWebhook($input: WebhookUpdateInput!) {
      webhookUpdate(input: $input) {
        id url events
      }
    }`,
    { input },
    options
  );
}

export async function deleteWebhook(
  id: string,
  options?: RequestOptions
): Promise<ZonosGraphQLResponse<{ webhookDelete: { id: string } }>> {
  return zonosRequest(
    `mutation DeleteWebhook($id: ID!) {
      webhookDelete(id: $id) {
        id
      }
    }`,
    { id },
    { ...options, useProxyKey: true }
  );
}

// --- Query functions ---

export async function getFulfillmentCenters(
  options?: RequestOptions
): Promise<ZonosGraphQLResponse<{ fulfillmentCenters: FulfillmentCenter[] }>> {
  return zonosRequest(
    `query FulfillmentCenters {
      fulfillmentCenters {
        id name
        party {
          id type
          location { line1 line2 locality administrativeArea administrativeAreaCode postalCode countryCode }
          person { firstName lastName email phone companyName }
        }
      }
    }`,
    undefined,
    options
  );
}

export async function getShippingZones(
  options?: RequestOptions
): Promise<ZonosGraphQLResponse<{ shippingZones: ShippingZone[] }>> {
  return zonosRequest(
    `query ShippingZones {
      shippingZones {
        id name countryCodes
      }
    }`,
    undefined,
    options
  );
}

export async function getShippingProfiles(
  options?: RequestOptions
): Promise<ZonosGraphQLResponse<{ shippingProfiles: ShippingProfile[] }>> {
  return zonosRequest(
    `query ShippingProfiles {
      shippingProfiles {
        id name
      }
    }`,
    undefined,
    options
  );
}

export async function getCarrierAccounts(
  options?: RequestOptions
): Promise<ZonosGraphQLResponse<{ carrierAccounts: CarrierAccount[] }>> {
  return zonosRequest(
    `query CarrierAccounts {
      carrierAccounts {
        id accountNumber
      }
    }`,
    undefined,
    options
  );
}

export async function getHelloSettings(
  options?: RequestOptions
): Promise<ZonosGraphQLResponse<{ helloSettings: HelloSettings }>> {
  return zonosRequest(
    `query HelloSettings {
      helloSettings {
        id
      }
    }`,
    undefined,
    options
  );
}

export async function getServiceLevels(
  options?: RequestOptions
): Promise<ZonosGraphQLResponse<{ serviceLevels: ServiceLevel[] }>> {
  return zonosRequest(
    `query ServiceLevels {
      serviceLevels {
        id name
      }
    }`,
    undefined,
    options
  );
}

export async function getWebhooks(
  options?: RequestOptions
): Promise<ZonosGraphQLResponse<{ webhooks: Webhook[] }>> {
  return zonosRequest(
    `query Webhooks {
      webhooks {
        id url events
      }
    }`,
    undefined,
    options
  );
}
