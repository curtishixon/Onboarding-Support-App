# Zonos API Reference

## Endpoint
```
POST https://api.zonos.com/graphql
Content-Type: application/json
credentialToken: <api-key>
```

## Authentication
| Header | Purpose |
|--------|---------|
| `credentialToken` | Required for all operations |
| `credentialTokenProxy` | Additional header for destructive ops (void, cancel) |

## Rate Limiting
- 3,000 points/second (300,000 max capacity)
- Query base: 5 points, Mutation base: 10 points, Each object: 1 point
- Response header `zonos-query-complexity` shows points consumed

---

## Core Workflow Mutations

Zonos uses a workflow pattern where multiple operations run in a single mutation call. The API threads state between steps.

### Standard Landed Cost Workflow
```graphql
mutation CalculateLandedCost(
  $parties: [PartyCreateWorkflowInput!]!
  $items: [ItemCreateWorkflowInput!]!
  $landedCostConfig: LandedCostWorkFlowInput!
) {
  partyCreateWorkflow(input: $parties) {
    id type
    location { line1 locality administrativeAreaCode countryCode postalCode }
    person { email firstName lastName phone companyName }
  }
  itemCreateWorkflow(input: $items) {
    id amount productId quantity description countryOfOrigin hsCode currencyCode sku name
  }
  cartonizeWorkflow {
    id type weight length width height weightUnit dimensionalUnit
  }
  shipmentRatingCalculateWorkflow {
    id amount serviceLevelCode displayName currencyCode
    details { amount carrierCode type }
    amountSubtotals { shipping fuelSurcharge insuranceCost otherSurcharge }
  }
  landedCostCalculateWorkflow(input: $landedCostConfig) {
    id shortId method endUse currencyCode landedCostGuaranteeCode
    amountSubtotals { items shipping duties taxes fees }
    duties { amount currencyCode description formula type item { id hsCode } }
    taxes { amount currencyCode description formula type item { id hsCode } }
    fees { amount currencyCode description type }
    deMinimis { type threshold formula }
    shipmentRating { id amount displayName serviceLevelCode }
  }
}
```

### Shipment/Label Workflow
```
1. partyCreateWorkflow → Create parties
2. itemCreateWorkflow → Define items
3. cartonsCreateWorkflow → Define carton dimensions
4. shipmentCreateWorkflow → Create shipment + generate label
```

---

## Key Input Types

### PartyCreateWorkflowInput
```graphql
input PartyCreateWorkflowInput {
  location: PartyLocationInput!    # countryCode required; line1, locality, postalCode, etc.
  person: PartyPersonInput         # firstName, lastName, email, phone, companyName
  type: PartyType!                 # ORIGIN | DESTINATION | PAYOR | PAYEE
}
```

### ItemCreateWorkflowInput
```graphql
input ItemCreateWorkflowInput {
  amount: Decimal!                 # Item price
  currencyCode: CurrencyCode!     # ISO 4217 (USD, CAD, EUR, etc.)
  quantity: Int!                   # Number of items
  # Optional but recommended:
  countryOfOrigin: CountryCode     # ISO 3166-1 alpha-2
  description: String
  hsCode: String                   # HS tariff code
  name: String
  productId: String
  sku: String
  weight: Decimal
  weightUnit: WeightUnitCode       # GRAM | KILOGRAM | OUNCE | POUND
  measurements: [ItemMeasurementInput!]  # HEIGHT, LENGTH, WIDTH, WEIGHT, VOLUME
  imageUrl: String
  brand: String
  material: String
  categories: [String!]
  itemType: ItemType               # PHYSICAL_GOOD | DIGITAL_GOOD | SERVICE | etc.
}
```

### LandedCostWorkFlowInput
```graphql
input LandedCostWorkFlowInput {
  calculationMethod: IncotermCode!  # DDP_PREFERRED (guaranteed) | DAP
  endUse: CustomsSpecEndUseType!    # FOR_RESALE | NOT_FOR_RESALE
  tariffRate: ZonosTariffRateType!  # ZONOS_PREFERRED (guaranteed)
}
```

### ItemMeasurementInput
```graphql
input ItemMeasurementInput {
  type: ItemMeasurementType!       # HEIGHT | LENGTH | WIDTH | WEIGHT | VOLUME | ALCOHOL_BY_VOLUME
  unitOfMeasure: ItemUnitOfMeasure!
  value: Decimal!
}
```

---

## Order Mutations

### orderCreate
```graphql
mutation CreateOrder($input: OrderCreateInput!) {
  orderCreate(input: $input) { id status }
}
# Input: accountOrderNumber, billTo (party ID), grandTotal, landedCostId, currencyCode
```

### orderCancel (requires credentialTokenProxy)
### orderAddTrackingNumber
### orderUpdateAccountOrderNumber
### orderRefundCreate

---

## Shipment Mutations

### shipmentCreateWorkflow
```graphql
mutation CreateShipment($input: ShipmentCreateWorkflowInput!) {
  shipmentCreateWorkflow(input: $input) {
    id status trackingNumbers
    serviceLevel { name carrier { name } }
    shipmentCartons {
      label { url trackingNumber documentFiling }
    }
  }
}
# Minimal input: { orderId: "order_XXX", generateLabel: true }
```

### shipmentStatusUpdate (requires credentialTokenProxy)
- Set status to `VOIDED` to void a shipment

---

## Classification Mutations

### classificationsCalculate
```graphql
mutation ClassifyItems($input: [ClassificationCalculateInput!]!) {
  classificationsCalculate(input: $input) {
    id name confidenceScore customsDescription
    hsCode { code description { full friendly } fragments { code description } }
    alternates { subheadingAlternate { code } probabilityMass }
  }
}
# Required: name. Optional: description, imageUrl, categories, material, level (BASE|ADVANCED|ULTRA)
```

### hsCodesValidate
- Validates HS codes, returns VALID or INVALID with type (CHAPTER, HEADING, SUBHEADING, TARIFF)

---

## Vision Mutations

### itemsExtract
```graphql
mutation ItemsExtract($input: ItemsExtractInput!) {
  itemsExtract(input: $input) {
    id quantity
    content { categories description name materials }
    classification { confidenceScore hsCode { code } }
    valueEstimation { currency value valueEstimateRange { high low } }
    countryOfOriginInference { confidenceScore countryOfOrigin }
  }
}
# Input: imageBase64 (required), shipToCountry, localizedLanguageCode
```

---

## Cart/Checkout Mutations

### cartCreate (server-side only)
```graphql
mutation CartCreate($input: CartCreateInput!) {
  cartCreate(input: $input) {
    id items { id name amount quantity }
  }
}
# Input: currencyCode, storeId, items[]
```

---

## Common Queries

| Query | Purpose |
|-------|---------|
| `order(id: ID!)` | Get single order |
| `orders(filter: OrdersFilter)` | Search orders (paginated) |
| `shipment(id: ID!)` | Get single shipment |
| `shipments(filter: ShipmentsFilter)` | Search shipments |
| `classification(id: ID!)` | Get classification result |
| `catalogItem(id: ID!)` | Get catalog item |
| `exchangeRate(source, target)` | Get exchange rate |
| `carriers` | List all carriers |
| `serviceLevels(filter)` | List service levels |

---

## Key Enums

| Enum | Values |
|------|--------|
| `PartyType` | ORIGIN, DESTINATION, PAYOR, PAYEE |
| `IncotermCode` | DDP, DAP, CIF, FOB, CUSTOM |
| `CustomsSpecEndUseType` | FOR_RESALE, NOT_FOR_RESALE |
| `CountryCode` | ISO 3166-1 alpha-2 (250+) |
| `CurrencyCode` | ISO 4217 (160+) |
| `ItemType` | PHYSICAL_GOOD, DIGITAL_GOOD, SERVICE, SUBSCRIPTION, BUNDLE |
| `WeightUnitCode` | GRAM, KILOGRAM, OUNCE, POUND |
| `DimensionalUnitCode` | CENTIMETER, INCH, METER, MILLIMETER, FOOT, YARD |
| `LabelCarrierCode` | APC, CANADA_POST, DHL, FEDEX, UPS, USPS, etc. |
| `Mode` | LIVE, TEST |
| `ClassificationLevel` | BASE, ADVANCED, ULTRA |
| `LabelFileType` | PDF, ZPL |

## ID Prefixes
| Prefix | Entity |
|--------|--------|
| `ldct` | Landed Cost |
| `clfy` | Classification |
| `ship` | Shipment Rating |
| `ordr` | Order |
| `prty` | Party |
