import { NextRequest, NextResponse } from "next/server";
import { createFulfillmentCenter } from "@/lib/zonos-client";
import type { FulfillmentCenterCreateInput } from "@/types/zonos";

interface FulfillmentCenterSetupRequest {
  person: {
    companyName: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  location: {
    line1: string;
    line2: string;
    line3: string;
    locality: string;
    administrativeAreaCode: string;
    countryCode: string;
    postalCode: string;
  };
}

export async function POST(request: NextRequest) {
  let body: FulfillmentCenterSetupRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Validate required fields
  const { person, location } = body;
  if (!person?.companyName || !person?.firstName || !person?.lastName || !person?.email) {
    return NextResponse.json(
      { error: "Missing required contact fields: companyName, firstName, lastName, email" },
      { status: 400 }
    );
  }
  if (!location?.line1 || !location?.locality || !location?.postalCode || !location?.countryCode) {
    return NextResponse.json(
      { error: "Missing required address fields: line1, locality, postalCode, countryCode" },
      { status: 400 }
    );
  }

  // Build the input for the existing createFulfillmentCenter function
  // which handles: partyCreate (ORIGIN) → fulfillmentCenterCreate
  const input: FulfillmentCenterCreateInput = {
    name: person.companyName,
    party: {
      type: "ORIGIN",
      location: {
        line1: location.line1,
        line2: location.line2 || undefined,
        line3: location.line3 || undefined,
        locality: location.locality,
        administrativeAreaCode: location.administrativeAreaCode || undefined,
        postalCode: location.postalCode,
        countryCode: location.countryCode,
      },
      person: {
        companyName: person.companyName,
        firstName: person.firstName,
        lastName: person.lastName,
        email: person.email,
        phone: person.phone || undefined,
      },
    },
  };

  try {
    const result = await createFulfillmentCenter(input);

    if (result.errors?.length) {
      const errorMessage = result.errors[0]?.message || "Failed to create fulfillment center";
      return NextResponse.json({ error: errorMessage }, { status: 500 });
    }

    const data = result.data;
    return NextResponse.json(
      {
        success: true,
        partyId: data?.partyCreate?.id,
        fulfillmentCenterId: data?.fulfillmentCenterCreate?.id,
      },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
