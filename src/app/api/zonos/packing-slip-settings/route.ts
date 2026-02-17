import { NextRequest, NextResponse } from "next/server";
import { updatePackingSlipSettings } from "@/lib/zonos-client";
import type { PackingSlipSettingsUpdateInput } from "@/types/zonos";

export async function PUT(request: NextRequest) {
  const body = (await request.json()) as PackingSlipSettingsUpdateInput;
  const result = await updatePackingSlipSettings(body);
  if (result.errors?.length) {
    return NextResponse.json({ errors: result.errors }, { status: 500 });
  }
  return NextResponse.json(result.data);
}
