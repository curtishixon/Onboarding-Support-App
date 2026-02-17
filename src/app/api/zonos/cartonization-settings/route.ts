import { NextRequest, NextResponse } from "next/server";
import { updateCartonizationSettings } from "@/lib/zonos-client";
import type { CartonizationSettingsUpdateInput } from "@/types/zonos";

export async function PUT(request: NextRequest) {
  const body = (await request.json()) as CartonizationSettingsUpdateInput;
  const result = await updateCartonizationSettings(body);
  if (result.errors?.length) {
    return NextResponse.json({ errors: result.errors }, { status: 500 });
  }
  return NextResponse.json(result.data);
}
