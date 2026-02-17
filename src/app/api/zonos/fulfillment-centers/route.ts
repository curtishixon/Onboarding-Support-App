import { NextRequest, NextResponse } from "next/server";
import { createFulfillmentCenter, getFulfillmentCenters } from "@/lib/zonos-client";
import type { FulfillmentCenterCreateInput } from "@/types/zonos";

export async function GET() {
  const result = await getFulfillmentCenters();
  if (result.errors?.length) {
    return NextResponse.json({ errors: result.errors }, { status: 500 });
  }
  return NextResponse.json(result.data);
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as FulfillmentCenterCreateInput;

  if (!body.name || !body.party) {
    return NextResponse.json(
      { error: "Missing required fields: name, party" },
      { status: 400 }
    );
  }

  const result = await createFulfillmentCenter(body);
  if (result.errors?.length) {
    return NextResponse.json({ errors: result.errors }, { status: 500 });
  }
  return NextResponse.json(result.data, { status: 201 });
}
