import { NextRequest, NextResponse } from "next/server";
import { updateCollectInvoiceSettings } from "@/lib/zonos-client";
import type { CollectInvoiceSettingsUpdateInput } from "@/types/zonos";

export async function PUT(request: NextRequest) {
  const body = (await request.json()) as CollectInvoiceSettingsUpdateInput;
  const result = await updateCollectInvoiceSettings(body);
  if (result.errors?.length) {
    return NextResponse.json({ errors: result.errors }, { status: 500 });
  }
  return NextResponse.json(result.data);
}
