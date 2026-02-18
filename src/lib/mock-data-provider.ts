import type { DataProvider } from "./data-provider";
import type {
  Recommendation,
  RecommendationFilters,
  RecommendationStatus,
  ExecutionResult,
} from "@/types/recommendations";

// Store configuration with Zonos Store IDs
export const STORES = {
  "Lennon Test": { id: "7910", name: "Lennon Test" },
  "Zonos Demo App": { id: "7908", name: "Zonos Demo App" },
} as const;

export type StoreName = keyof typeof STORES;

const SEED_DATA: Recommendation[] = [
  {
    id: "rec_001",
    storeId: "Lennon Test",
    category: "fulfillment_center",
    action: "create",
    title: "Create fulfillment center for Lennon Test",
    description:
      "Add primary warehouse in West Jordan, UT as a fulfillment center.",
    payload: {
      name: "Lennon Test - West Jordan Warehouse",
      party: {
        location: {
          line1: "6993 S Old Bingham Hwy",
          locality: "West Jordan",
          administrativeAreaCode: "UT",
          postalCode: "84081",
          countryCode: "US",
        },
        person: {
          firstName: "John",
          lastName: "Smith",
          email: "john@lennontest.com",
          phone: "8015551234",
          companyName: "Lennon Test",
        },
        type: "ORIGIN",
      },
    },
    status: "pending",
    createdAt: "2025-02-15T10:00:00Z",
    updatedAt: "2025-02-15T10:00:00Z",
  },
  {
    id: "rec_002",
    storeId: "Lennon Test",
    category: "catalog_item",
    action: "create",
    title: "Add Cotton T-Shirt to catalog",
    description:
      "Create catalog entry for Cotton T-Shirt with HS code 6109.10 and country of origin CN.",
    payload: {
      name: "Cotton T-Shirt",
      description: "Men's short sleeve cotton crew neck t-shirt",
      hsCode: "6109.10",
      countryOfOrigin: "CN",
      productId: "PROD-001",
      sku: "TSH-BLK-M",
      categories: ["Apparel", "Men's Clothing"],
      material: "100% cotton",
    },
    status: "pending",
    createdAt: "2025-02-15T10:05:00Z",
    updatedAt: "2025-02-15T10:05:00Z",
  },
  {
    id: "rec_003",
    storeId: "Lennon Test",
    category: "catalog_item",
    action: "update",
    title: "Update HS code for Leather Wallet",
    description:
      "Correct the HS code for Leather Wallet from 4202.31 to 4202.32.",
    payload: {
      id: "catalog_item_xyz",
      hsCode: "4202.32",
      countryOfOrigin: "IT",
    },
    status: "pending",
    createdAt: "2025-02-15T10:10:00Z",
    updatedAt: "2025-02-15T10:10:00Z",
  },
  {
    id: "rec_004",
    storeId: "Zonos Demo App",
    category: "carrier_account",
    action: "create",
    title: "Connect FedEx carrier account",
    description:
      "Connect FedEx account for international shipping.",
    payload: {
      carrier: "FEDEX",
      accountNumber: "123456789",
    },
    status: "pending",
    createdAt: "2025-02-15T11:00:00Z",
    updatedAt: "2025-02-15T11:00:00Z",
  },
  {
    id: "rec_005",
    storeId: "Zonos Demo App",
    category: "webhook",
    action: "create",
    title: "Create order webhook",
    description:
      "Set up webhook to notify when orders are created or canceled.",
    payload: {
      url: "https://demo.zonos.com/webhooks/orders",
      events: ["ORDER_CREATED", "ORDER_CANCELED"],
    },
    status: "approved",
    createdAt: "2025-02-14T09:00:00Z",
    updatedAt: "2025-02-15T08:30:00Z",
    reviewedBy: "Sarah Chen",
    reviewedAt: "2025-02-15T08:30:00Z",
  },
  {
    id: "rec_006",
    storeId: "Zonos Demo App",
    category: "fulfillment_center",
    action: "create",
    title: "Create EU fulfillment center",
    description:
      "Add European warehouse in Amsterdam as fulfillment center.",
    payload: {
      name: "Zonos Demo - Amsterdam Warehouse",
      party: {
        location: {
          line1: "Keizersgracht 123",
          locality: "Amsterdam",
          postalCode: "1015 CJ",
          countryCode: "NL",
        },
        person: {
          firstName: "Hans",
          lastName: "Mueller",
          email: "hans@demo.zonos.com",
          phone: "+31201234567",
          companyName: "Zonos Demo EU",
        },
        type: "ORIGIN",
      },
    },
    status: "approved",
    createdAt: "2025-02-13T14:00:00Z",
    updatedAt: "2025-02-14T10:00:00Z",
    reviewedBy: "Mike Torres",
    reviewedAt: "2025-02-14T10:00:00Z",
  },
  {
    id: "rec_007",
    storeId: "Lennon Test",
    category: "pddp",
    action: "update",
    title: "Enable PDDP for UK VAT collection",
    description:
      "Configure PDDP settings to enable UK VAT collection.",
    payload: {
      enabled: true,
      countries: ["GB"],
    },
    status: "executed",
    createdAt: "2025-02-12T08:00:00Z",
    updatedAt: "2025-02-13T09:00:00Z",
    reviewedBy: "Sarah Chen",
    reviewedAt: "2025-02-12T16:00:00Z",
    executionResult: {
      success: true,
      data: { id: "pddp_settings_abc123" },
    },
  },
  {
    id: "rec_008",
    storeId: "Zonos Demo App",
    category: "webhook",
    action: "create",
    title: "Create shipment webhook",
    description:
      "Set up webhook for shipment events.",
    payload: {
      url: "https://demo.zonos.com/webhooks/shipments",
      events: ["SHIPMENT_CREATED", "SHIPMENT_CANCELED"],
    },
    status: "executed",
    createdAt: "2025-02-11T10:00:00Z",
    updatedAt: "2025-02-12T11:00:00Z",
    reviewedBy: "Mike Torres",
    reviewedAt: "2025-02-11T15:00:00Z",
    executionResult: {
      success: true,
      data: { id: "webhook_xyz789" },
    },
  },
  {
    id: "rec_009",
    storeId: "Zonos Demo App",
    category: "carrier_account",
    action: "create",
    title: "Connect DHL account",
    description: "Connect DHL Express account for EU shipments.",
    payload: {
      carrier: "DHL",
      accountNumber: "987654321",
    },
    status: "failed",
    createdAt: "2025-02-10T12:00:00Z",
    updatedAt: "2025-02-11T09:00:00Z",
    reviewedBy: "Sarah Chen",
    reviewedAt: "2025-02-10T16:00:00Z",
    executionResult: {
      success: false,
      error: "Invalid DHL account number format",
    },
  },
  {
    id: "rec_010",
    storeId: "Lennon Test",
    category: "collect_invoice",
    action: "update",
    title: "Update collect invoice fee config",
    description:
      "Set collect invoice handling fee to $5.00 USD.",
    payload: {
      handlingFee: 5.0,
      currency: "USD",
    },
    status: "rejected",
    createdAt: "2025-02-09T10:00:00Z",
    updatedAt: "2025-02-10T08:00:00Z",
    reviewedBy: "Mike Torres",
    reviewedAt: "2025-02-10T08:00:00Z",
  },
];

export class MockDataProvider implements DataProvider {
  private recommendations: Recommendation[] = [...SEED_DATA];

  async getRecommendations(
    filters?: RecommendationFilters
  ): Promise<Recommendation[]> {
    let results = [...this.recommendations];

    if (filters?.status) {
      results = results.filter((r) => r.status === filters.status);
    }
    if (filters?.category) {
      results = results.filter((r) => r.category === filters.category);
    }
    if (filters?.storeId) {
      results = results.filter((r) => r.storeId === filters.storeId);
    }

    return results.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async getRecommendation(id: string): Promise<Recommendation | null> {
    return this.recommendations.find((r) => r.id === id) ?? null;
  }

  async updateRecommendationStatus(
    id: string,
    status: RecommendationStatus,
    reviewedBy?: string
  ): Promise<Recommendation> {
    const rec = this.recommendations.find((r) => r.id === id);
    if (!rec) {
      throw new Error(`Recommendation not found: ${id}`);
    }

    rec.status = status;
    rec.updatedAt = new Date().toISOString();
    if (reviewedBy) {
      rec.reviewedBy = reviewedBy;
      rec.reviewedAt = new Date().toISOString();
    }

    return { ...rec };
  }

  async setExecutionResult(
    id: string,
    result: ExecutionResult
  ): Promise<Recommendation> {
    const rec = this.recommendations.find((r) => r.id === id);
    if (!rec) {
      throw new Error(`Recommendation not found: ${id}`);
    }

    rec.executionResult = result;
    rec.status = result.success ? "executed" : "failed";
    rec.updatedAt = new Date().toISOString();

    return { ...rec };
  }

  async getRecommendationCounts(): Promise<
    Record<RecommendationStatus, number>
  > {
    const counts: Record<RecommendationStatus, number> = {
      pending: 0,
      approved: 0,
      rejected: 0,
      executed: 0,
      failed: 0,
    };

    for (const rec of this.recommendations) {
      counts[rec.status]++;
    }

    return counts;
  }

  // Get list of unique stores
  async getStores(): Promise<Array<{ id: string; name: string }>> {
    return Object.values(STORES);
  }
}
