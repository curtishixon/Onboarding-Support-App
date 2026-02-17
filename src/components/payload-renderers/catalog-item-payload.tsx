interface Props {
  data: Record<string, unknown>;
}

function field(data: Record<string, unknown>, key: string): string | null {
  const val = data[key];
  if (val == null || val === "") return null;
  return String(val);
}

export function CatalogItemPayload({ data }: Props) {
  return (
    <div className="space-y-3">
      {field(data, "name") !== null && (
        <div>
          <p className="text-sm font-medium text-gray-500">Product Name</p>
          <p className="text-sm">{field(data, "name")}</p>
        </div>
      )}
      {field(data, "description") !== null && (
        <div>
          <p className="text-sm font-medium text-gray-500">Description</p>
          <p className="text-sm">{field(data, "description")}</p>
        </div>
      )}
      {field(data, "hsCode") !== null && (
        <div>
          <p className="text-sm font-medium text-gray-500">HS Code</p>
          <p className="text-sm font-mono">{field(data, "hsCode")}</p>
        </div>
      )}
      {field(data, "countryOfOrigin") !== null && (
        <div>
          <p className="text-sm font-medium text-gray-500">Country of Origin</p>
          <p className="text-sm">{field(data, "countryOfOrigin")}</p>
        </div>
      )}
      {field(data, "sku") !== null && (
        <div>
          <p className="text-sm font-medium text-gray-500">SKU</p>
          <p className="text-sm font-mono">{field(data, "sku")}</p>
        </div>
      )}
      {field(data, "productId") !== null && (
        <div>
          <p className="text-sm font-medium text-gray-500">Product ID</p>
          <p className="text-sm font-mono">{field(data, "productId")}</p>
        </div>
      )}
      {field(data, "material") !== null && (
        <div>
          <p className="text-sm font-medium text-gray-500">Material</p>
          <p className="text-sm">{field(data, "material")}</p>
        </div>
      )}
      {Array.isArray(data.categories) && (
        <div>
          <p className="text-sm font-medium text-gray-500">Categories</p>
          <p className="text-sm">{(data.categories as string[]).join(", ")}</p>
        </div>
      )}
    </div>
  );
}
