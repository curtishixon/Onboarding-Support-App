import { NextRequest, NextResponse } from "next/server";
import { createWebhook, updateWebhook, deleteWebhook, getWebhooks } from "@/lib/zonos-client";
import type { WebhookCreateInput, WebhookUpdateInput } from "@/types/zonos";

export async function GET() {
  const result = await getWebhooks();
  if (result.errors?.length) {
    return NextResponse.json({ errors: result.errors }, { status: 500 });
  }
  return NextResponse.json(result.data);
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as WebhookCreateInput;
  if (!body.url || !body.events?.length) {
    return NextResponse.json(
      { error: "Missing required fields: url, events" },
      { status: 400 }
    );
  }
  const result = await createWebhook(body);
  if (result.errors?.length) {
    return NextResponse.json({ errors: result.errors }, { status: 500 });
  }
  return NextResponse.json(result.data, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const body = (await request.json()) as WebhookUpdateInput;
  if (!body.id) {
    return NextResponse.json({ error: "Missing required field: id" }, { status: 400 });
  }
  const result = await updateWebhook(body);
  if (result.errors?.length) {
    return NextResponse.json({ errors: result.errors }, { status: 500 });
  }
  return NextResponse.json(result.data);
}

export async function DELETE(request: NextRequest) {
  const { id } = (await request.json()) as { id: string };
  if (!id) {
    return NextResponse.json({ error: "Missing required field: id" }, { status: 400 });
  }
  const result = await deleteWebhook(id);
  if (result.errors?.length) {
    return NextResponse.json({ errors: result.errors }, { status: 500 });
  }
  return NextResponse.json(result.data);
}
