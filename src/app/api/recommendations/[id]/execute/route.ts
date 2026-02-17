import { NextRequest, NextResponse } from "next/server";
import { dataProvider } from "@/lib/data-provider-instance";
import { executeRecommendation } from "@/lib/execute-recommendation";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const recommendation = await dataProvider.getRecommendation(id);

  if (!recommendation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (recommendation.status !== "approved") {
    return NextResponse.json(
      {
        error: `Cannot execute recommendation with status '${recommendation.status}'. Must be 'approved'.`,
      },
      { status: 400 }
    );
  }

  const result = await executeRecommendation(recommendation);
  await dataProvider.setExecutionResult(id, result);

  if (result.success) {
    return NextResponse.json({ success: true, data: result.data });
  } else {
    return NextResponse.json(
      { success: false, error: result.error },
      { status: 500 }
    );
  }
}
