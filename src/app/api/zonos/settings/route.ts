import { NextRequest, NextResponse } from "next/server";
import {
  getFulfillmentCenters,
  getShippingZones,
  getShippingProfiles,
  getCarrierAccounts,
  getHelloSettings,
  getServiceLevels,
  getWebhooks,
} from "@/lib/zonos-client";

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type");

  if (!type) {
    return NextResponse.json(
      { error: "Missing query parameter: type" },
      { status: 400 }
    );
  }

  switch (type) {
    case "fulfillment-centers": {
      const result = await getFulfillmentCenters();
      return NextResponse.json(result.data ?? { errors: result.errors });
    }
    case "shipping-zones": {
      const result = await getShippingZones();
      return NextResponse.json(result.data ?? { errors: result.errors });
    }
    case "shipping-profiles": {
      const result = await getShippingProfiles();
      return NextResponse.json(result.data ?? { errors: result.errors });
    }
    case "carrier-accounts": {
      const result = await getCarrierAccounts();
      return NextResponse.json(result.data ?? { errors: result.errors });
    }
    case "hello-settings": {
      const result = await getHelloSettings();
      return NextResponse.json(result.data ?? { errors: result.errors });
    }
    case "service-levels": {
      const result = await getServiceLevels();
      return NextResponse.json(result.data ?? { errors: result.errors });
    }
    case "webhooks": {
      const result = await getWebhooks();
      return NextResponse.json(result.data ?? { errors: result.errors });
    }
    default:
      return NextResponse.json(
        { error: `Unknown settings type: ${type}` },
        { status: 400 }
      );
  }
}
