import type { DataProvider } from "./data-provider";
import type {
  Recommendation,
  RecommendationFilters,
  RecommendationStatus,
  ExecutionResult,
} from "@/types/recommendations";

const SEED_DATA: Recommendation[] = [
  {
    id: "rec_001",
    storeId: "store_acme",
    category: "fulfillment_center",
    action: "create",
    title: "Create fulfillment center for Acme Corp",
    description:
      "Add primary warehouse in West Jordan, UT as a fulfillment center for Acme Corp.",
    payload: {
      name: "Acme Corp - West Jordan Warehouse",
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
          email: "john@acmecorp.com",
          phone: "8015551234",
          companyName: "Acme Corp",
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
    storeId: "store_acme",
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
    storeId: "store_acme",
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
    storeId: "store_globex",
    category: "carrier_account",
    action: "create",
    title: "Connect FedEx carrier account",
    description:
      "Connect Globex Corp's FedEx account for international shipping.",
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
    storeId: "store_globex",
    category: "webhook",
    action: "create",
    title: "Create order webhook for Globex",
    description:
      "Set up webhook to notify Globex when orders are created or canceled.",
    payload: {
      url: "https://globex.com/webhooks/zonos-orders",
      events: ["ORDER_CREATED", "ORDER_CANCELED"],
    },
    status: "approved",
    createdAt: "2025-02-14T09:00:00Z",
    updatedAt: "2025-02-15T08:30:00Z",
    reviewedBy: "rep_sarah",
    reviewedAt: "2025-02-15T08:30:00Z",
  },
  {
    id: "rec_006",
    storeId: "store_initech",
    category: "fulfillment_center",
    action: "create",
    title: "Create EU fulfillment center for Initech",
    description:
      "Add European warehouse in Amsterdam as fulfillment center.",
    payload: {
      name: "Initech - Amsterdam Warehouse",
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
          email: "hans@initech.eu",
          phone: "+31201234567",
          companyName: "Initech EU",
        },
        type: "ORIGIN",
      },
    },
    status: "approved",
    createdAt: "2025-02-13T14:00:00Z",
    updatedAt: "2025-02-14T10:00:00Z",
    reviewedBy: "rep_mike",
    reviewedAt: "2025-02-14T10:00:00Z",
  },
  {
    id: "rec_007",
    storeId: "store_acme",
    category: "pddp",
    action: "update",
    title: "Enable PDDP for UK VAT collection",
    description:
      "Configure PDDP settings to enable UK VAT collection for Acme Corp.",
    payload: {
      enabled: true,
      countries: ["GB"],
    },
    status: "executed",
    createdAt: "2025-02-12T08:00:00Z",
    updatedAt: "2025-02-13T09:00:00Z",
    reviewedBy: "rep_sarah",
    reviewedAt: "2025-02-12T16:00:00Z",
    executionResult: {
      success: true,
      data: { id: "pddp_settings_abc123" },
    },
  },
  {
    id: "rec_008",
    storeId: "store_globex",
    category: "webhook",
    action: "create",
    title: "Create shipment webhook for Globex",
    description:
      "Set up webhook for shipment events.",
    payload: {
      url: "https://globex.com/webhooks/zonos-shipments",
      events: ["SHIPMENT_CREATED", "SHIPMENT_CANCELED"],
    },
    status: "executed",
    createdAt: "2025-02-11T10:00:00Z",
    updatedAt: "2025-02-12T11:00:00Z",
    reviewedBy: "rep_mike",
    reviewedAt: "2025-02-11T15:00:00Z",
    executionResult: {
      success: true,
      data: { id: "webhook_xyz789" },
    },
  },
  {
    id: "rec_009",
    storeId: "store_initech",
    category: "carrier_account",
    action: "create",
    title: "Connect DHL account for Initech",
    description: "Connect Initech's DHL Express account for EU shipments.",
    payload: {
      carrier: "DHL",
      accountNumber: "987654321",
    },
    status: "failed",
    createdAt: "2025-02-10T12:00:00Z",
    updatedAt: "2025-02-11T09:00:00Z",
    reviewedBy: "rep_sarah",
    reviewedAt: "2025-02-10T16:00:00Z",
    executionResult: {
      success: false,
      error: "Invalid DHL account number format",
    },
  },
  {
    id: "rec_010",
    storeId: "store_acme",
    category: "collect_invoice",
    action: "update",
    title: "Update collect invoice fee config for Acme",
    description:
      "Set collect invoice handling fee to $5.00 USD for Acme Corp.",
    payload: {
      handlingFee: 5.0,
      currency: "USD",
    },
    status: "rejected",
    createdAt: "2025-02-09T10:00:00Z",
    updatedAt: "2025-02-10T08:00:00Z",
    reviewedBy: "rep_mike",
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
}
