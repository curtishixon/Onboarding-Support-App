// --- Enums ---

export type PartyType = "ORIGIN" | "DESTINATION" | "PAYOR" | "PAYEE";

export type IncotermCode = "DDP" | "DDP_PREFERRED" | "DAP" | "CIF" | "FOB" | "CUSTOM";

export type CustomsSpecEndUseType = "FOR_RESALE" | "NOT_FOR_RESALE";

export type ItemType =
  | "PHYSICAL_GOOD"
  | "DIGITAL_GOOD"
  | "SERVICE"
  | "SUBSCRIPTION"
  | "BUNDLE";

export type WeightUnitCode = "GRAM" | "KILOGRAM" | "OUNCE" | "POUND";

export type DimensionalUnitCode =
  | "CENTIMETER"
  | "INCH"
  | "METER"
  | "MILLIMETER"
  | "FOOT"
  | "YARD";

export type ItemMeasurementType =
  | "HEIGHT"
  | "LENGTH"
  | "WIDTH"
  | "WEIGHT"
  | "VOLUME"
  | "ALCOHOL_BY_VOLUME";

export type ClassificationLevel = "BASE" | "ADVANCED" | "ULTRA";

export type Mode = "LIVE" | "TEST";

export type WebhookEvent =
  | "ORDER_CREATED"
  | "ORDER_CANCELED"
  | "ORDER_STATUS_CHANGED"
  | "SHIPMENT_CREATED"
  | "SHIPMENT_CANCELED";

// --- Input types (for mutations) ---

export interface PartyLocationInput {
  line1?: string;
  line2?: string;
  locality?: string;
  administrativeArea?: string;
  administrativeAreaCode?: string;
  postalCode?: string;
  countryCode: string;
}

export interface PartyPersonInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  companyName?: string;
}

export interface PartyCreateInput {
  location: PartyLocationInput;
  person?: PartyPersonInput;
  type: PartyType;
}

export interface ItemMeasurementInput {
  type: ItemMeasurementType;
  unitOfMeasure: string;
  value: number;
}

export interface CatalogItemCreateInput {
  name: string;
  description?: string;
  hsCode?: string;
  countryOfOrigin?: string;
  productId?: string;
  sku?: string;
  imageUrl?: string;
  brand?: string;
  material?: string;
  categories?: string[];
  amount?: number;
  currencyCode?: string;
  weight?: number;
  weightUnit?: WeightUnitCode;
  measurements?: ItemMeasurementInput[];
}

export interface CatalogItemUpdateInput {
  id: string;
  name?: string;
  description?: string;
  hsCode?: string;
  countryOfOrigin?: string;
  productId?: string;
  sku?: string;
  imageUrl?: string;
  brand?: string;
  material?: string;
  categories?: string[];
}

export interface FulfillmentCenterCreateInput {
  name: string;
  party: PartyCreateInput;
}

export interface CarrierAccountConnectInput {
  carrier: string;
  accountNumber?: string;
  [key: string]: unknown;
}

export interface CartonizationSettingsUpdateInput {
  [key: string]: unknown;
}

export interface PackingSlipSettingsUpdateInput {
  [key: string]: unknown;
}

export interface PddpSettingsUpdateInput {
  [key: string]: unknown;
}

export interface CollectInvoiceSettingsUpdateInput {
  [key: string]: unknown;
}

export interface WebhookCreateInput {
  url: string;
  events: WebhookEvent[];
}

export interface WebhookUpdateInput {
  id: string;
  url?: string;
  events?: WebhookEvent[];
}

// --- Response/entity types ---

export interface PartyLocation {
  line1: string | null;
  line2: string | null;
  locality: string | null;
  administrativeArea: string | null;
  administrativeAreaCode: string | null;
  postalCode: string | null;
  countryCode: string;
}

export interface PartyPerson {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  companyName: string | null;
}

export interface Party {
  id: string;
  type: PartyType;
  location: PartyLocation;
  person: PartyPerson | null;
}

export interface FulfillmentCenter {
  id: string;
  name: string;
  party: Party;
}

export interface CatalogItem {
  id: string;
  name: string;
  description: string | null;
  hsCode: string | null;
  countryOfOrigin: string | null;
  productId: string | null;
  sku: string | null;
}

export interface CarrierAccount {
  id: string;
  carrier: { name: string; code: string } | null;
  accountNumber: string | null;
}

export interface Webhook {
  id: string;
  url: string;
  events: WebhookEvent[];
}

export interface ShippingZone {
  id: string;
  name: string;
  countryCodes: string[];
}

export interface ShippingProfile {
  id: string;
  name: string;
}

export interface HelloSettings {
  id: string;
}

export interface ServiceLevel {
  id: string;
  name: string;
}

// --- GraphQL response wrapper ---

export interface ZonosGraphQLError {
  message: string;
  path?: string[];
  extensions?: Record<string, unknown>;
}

export interface ZonosGraphQLResponse<T> {
  data?: T;
  errors?: ZonosGraphQLError[];
}
