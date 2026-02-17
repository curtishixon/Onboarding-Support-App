import { NextRequest, NextResponse } from "next/server";
import { dataProvider } from "@/lib/data-provider-instance";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const recommendation = await dataProvider.getRecommendation(id);

  if (!recommendation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(recommendation);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { status, reviewedBy } = body;

  if (!status || !["approved", "rejected"].includes(status)) {
    return NextResponse.json(
      { error: "Status must be 'approved' or 'rejected'" },
      { status: 400 }
    );
  }

  const existing = await dataProvider.getRecommendation(id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (existing.status !== "pending") {
    return NextResponse.json(
      { error: `Cannot transition from '${existing.status}' to '${status}'` },
      { status: 400 }
    );
  }

  const updated = await dataProvider.updateRecommendationStatus(
    id,
    status,
    reviewedBy
  );

  return NextResponse.json(updated);
}
