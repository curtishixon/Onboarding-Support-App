import { NextRequest, NextResponse } from "next/server";
import { connectCarrierAccount, getCarrierAccounts } from "@/lib/zonos-client";
import type { CarrierAccountConnectInput } from "@/types/zonos";

export async function GET() {
  const result = await getCarrierAccounts();
  if (result.errors?.length) {
    return NextResponse.json({ errors: result.errors }, { status: 500 });
  }
  return NextResponse.json(result.data);
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as CarrierAccountConnectInput;
  const result = await connectCarrierAccount(body);
  if (result.errors?.length) {
    return NextResponse.json({ errors: result.errors }, { status: 500 });
  }
  return NextResponse.json(result.data, { status: 201 });
}
