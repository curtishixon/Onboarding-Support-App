import { NextRequest, NextResponse } from "next/server";
import { createCatalogItem, updateCatalogItem } from "@/lib/zonos-client";
import type { CatalogItemCreateInput, CatalogItemUpdateInput } from "@/types/zonos";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as CatalogItemCreateInput | CatalogItemCreateInput[];
  const items = Array.isArray(body) ? body : [body];

  const result = await createCatalogItem(items);
  if (result.errors?.length) {
    return NextResponse.json({ errors: result.errors }, { status: 500 });
  }
  return NextResponse.json(result.data, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const body = (await request.json()) as CatalogItemUpdateInput | CatalogItemUpdateInput[];
  const items = Array.isArray(body) ? body : [body];

  const result = await updateCatalogItem(items);
  if (result.errors?.length) {
    return NextResponse.json({ errors: result.errors }, { status: 500 });
  }
  return NextResponse.json(result.data);
}
