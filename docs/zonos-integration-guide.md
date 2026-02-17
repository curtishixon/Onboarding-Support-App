# Zonos Integration Guide

## End-to-End Workflow

### 1. Landed Cost Calculation
The core workflow combines 5 operations in a single GraphQL mutation:

```
partyCreateWorkflow → itemCreateWorkflow → cartonizeWorkflow → shipmentRatingCalculateWorkflow → landedCostCalculateWorkflow
```

**Variables example:**
```json
{
  "parties": [
    {
      "location": {
        "line1": "6993 S Old Bingham Hwy",
        "locality": "West Jordan",
        "administrativeAreaCode": "UT",
        "postalCode": "84081",
        "countryCode": "US"
      },
      "type": "ORIGIN"
    },
    {
      "location": {
        "line1": "123 Main St",
        "locality": "Toronto",
        "administrativeAreaCode": "ON",
        "postalCode": "M5V 2T6",
        "countryCode": "CA"
      },
      "type": "DESTINATION",
      "person": {
        "email": "customer@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "phone": "+1234567890"
      }
    }
  ],
  "items": [
    {
      "amount": 49.99,
      "currencyCode": "USD",
      "countryOfOrigin": "US",
      "quantity": 1,
      "productId": "PROD-001",
      "description": "Cotton T-Shirt",
      "hsCode": "6109.10",
      "measurements": [
        { "type": "WEIGHT", "value": 0.5, "unitOfMeasure": "POUND" },
        { "type": "LENGTH", "value": 30, "unitOfMeasure": "CENTIMETER" },
        { "type": "WIDTH", "value": 20, "unitOfMeasure": "CENTIMETER" },
        { "type": "HEIGHT", "value": 5, "unitOfMeasure": "CENTIMETER" }
      ]
    }
  ],
  "landedCostConfig": {
    "calculationMethod": "DDP_PREFERRED",
    "endUse": "NOT_FOR_RESALE",
    "tariffRate": "ZONOS_PREFERRED"
  }
}
```

### 2. Order Creation
After getting a landed cost quote, create an order:
```json
{
  "input": {
    "accountOrderNumber": "ORD-12345",
    "billTo": "prty_...",
    "grandTotal": 75.50,
    "landedCostId": "ldct_...",
    "currencyCode": "USD"
  }
}
```
- Quotes expire after 90 days
- Each `accountOrderNumber` must be unique per organization

### 3. Shipment + Label Creation
```json
{
  "input": {
    "orderId": "ordr_...",
    "generateLabel": true
  }
}
```
Optional: `fulfillmentCenter`, `serviceLevel`, `trackingNumbers` (when generateLabel=false)

### 4. Void Shipment (if needed)
Requires `credentialTokenProxy` header:
```json
{
  "input": {
    "shipment": "shipment_xxx",
    "status": "VOIDED",
    "note": "Voiding shipment"
  }
}
```

---

## Classification Integration

### Single Item Classification
```json
{
  "input": [{
    "name": "Cotton T-Shirt",
    "description": "Men's short sleeve cotton crew neck t-shirt",
    "categories": ["Apparel", "Men's Clothing"],
    "material": "100% cotton",
    "countryOfOrigin": "CN",
    "level": "ADVANCED"
  }]
}
```

### Classification Levels
| Level | Speed | Description |
|-------|-------|-------------|
| BASE | < 1 second | Uses only provided product info |
| ADVANCED | 1-3 seconds | Supplements with external data |
| ULTRA | 3+ seconds | Deeper research for technical products |

### Confidence Scoring
- 75-100%: High confidence
- 50-74%: Moderate
- 25-49%: Fair
- 10-24%: Low
- 0-9%: No result

### HS Code Priority in Landed Cost
1. Provided HS Code (validated)
2. Zonos Catalog
3. Ecommerce Platform
4. Classify on the Fly (auto-generate)
5. Fallback HS Code

---

## Vision (AI Item Extraction)

Extract items from photos (2-5 second response time):
```json
{
  "input": {
    "imageBase64": "<base64-encoded-image>",
    "shipToCountry": "CA",
    "localizedLanguageCode": "EN"
  }
}
```
Returns: item names, descriptions, categories, materials, HS codes, value estimates, country of origin.

---

## Item Restrictions

Check if items can be shipped to a destination:
```json
{
  "input": {
    "shipFromCountry": "US",
    "shipToCountry": "MX",
    "restrictionTypeThreshold": "OBSERVATION",
    "items": [{
      "hsCode": "2710.19.9905",
      "description": "engine oil",
      "countryOfOrigin": "US"
    }]
  }
}
```

**Action responses:**
- `NO_MATCH`: No restrictions found
- `PROHIBITIONS_APPLY`: Item is banned
- `RESTRICTIONS_APPLY`: Additional approvals needed

---

## Party Screening

Screen against 153 government sanction lists:
- Required: `name`, `countryCode`, `locality`
- Returns: `REVIEW` (match found) or `NO_MATCHES`

---

## Webhooks

### Key Events
| Event | Trigger |
|-------|---------|
| `ORDER_CREATED` | New order created |
| `ORDER_CANCELED` | Order canceled |
| `ORDER_STATUS_CHANGED` | Status change |
| `SHIPMENT_CREATED` | Shipment created |
| `SHIPMENT_CANCELED` | Shipment voided |

---

## Checkout Integration (Hello + Checkout)

### SDK Loading
```javascript
const script = document.createElement("script");
script.src = "https://cdn.jsdelivr.net/npm/@zonos/elements/dist/scripts/loadZonos.js";
script.addEventListener("load", () => {
  window.Zonos.init({
    storeId: 7744,
    zonosApiKey: "credential_live_...",
    checkoutSettings: {
      createCartId: async () => {
        // Server-side cart creation - return cart ID string
      },
      placeOrderButtonSelector: "#placeOrder",
    },
    helloSettings: {
      currencyElementSelector: ".price",
      showForCountries: "ONLY_SHIPPABLE",
    },
  });
});
document.head.appendChild(script);
```

### Required Post-Checkout
1. `orderUpdateAccountOrderNumber` - sync platform order number
2. `orderAddTrackingNumber` - sync tracking (if not using Dashboard labels)

### Test Cards
| Scenario | Card Number |
|----------|-------------|
| Success | 4242 4242 4242 4242 |
| Declined | 4000 0000 0000 0002 |

---

## Collect (Duty/Tax from Consignees)

Add `quoteType: COLLECT` to landed cost input. System auto-generates payment link emailed to destination party. Quote valid for 3 months.

---

## Tax Remittance

| Region | Mechanism | Threshold |
|--------|-----------|-----------|
| EU | IOSS | Orders <= EUR 150 |
| UK | VAT (20%) | Orders < GBP 135 |
| Norway | VOEC | All |
| Australia | GST | Standard |
| New Zealand | GST | Post-threshold |
| Singapore | GST | Post-threshold |

---

## Country-Specific Requirements

- **Brazil & Canada**: `administrativeAreaCode` required
- **Brazil**: Tax ID required for imports
- **EU**: IOSS for orders <= EUR 150
- **UK**: VAT collection for orders < GBP 135

---

## Carrier Support

| Carrier | Features |
|---------|----------|
| FedEx | Full integration, negotiated rates, electronic invoices (80+ countries) |
| UPS | Requires $15 duty/tax forwarding waiver, electronic invoices (70+ countries) |
| DHL | Full integration, universal electronic invoices |
| USPS | Live rates, requires item weights |
| Canada Post | Live rates, manifest workflow for contract shippers |

---

## Landed Cost Guarantee (LCG)

**Pricing:** $2 USD per order + 10% of duty and tax

**Covers:** HS code changes, valuation disputes, calculation errors, tariff changes, FX fluctuation

**Requires:** `DDP_PREFERRED` calculation method + `ZONOS_PREFERRED` tariff rate

**Timeframe:** 90 days standard; up to 1 year with approval
