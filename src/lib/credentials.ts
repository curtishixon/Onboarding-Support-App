export function getApiKey(): string {
  const key = process.env.ZONOS_API_KEY;
  if (!key) {
    throw new Error("ZONOS_API_KEY environment variable is not set");
  }
  return key;
}

export function getProxyKey(): string {
  const key = process.env.ZONOS_PROXY_KEY;
  if (!key) {
    throw new Error("ZONOS_PROXY_KEY environment variable is not set");
  }
  return key;
}

export function getStoreId(): string {
  const id = process.env.NEXT_PUBLIC_ZONOS_STORE_ID;
  if (!id) {
    throw new Error("NEXT_PUBLIC_ZONOS_STORE_ID environment variable is not set");
  }
  return id;
}
