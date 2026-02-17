import { NextRequest, NextResponse } from "next/server";
import { updatePddpSettings } from "@/lib/zonos-client";
import type { PddpSettingsUpdateInput } from "@/types/zonos";

export async function PUT(request: NextRequest) {
  const body = (await request.json()) as PddpSettingsUpdateInput;
  const result = await updatePddpSettings(body);
  if (result.errors?.length) {
    return NextResponse.json({ errors: result.errors }, { status: 500 });
  }
  return NextResponse.json(result.data);
}
