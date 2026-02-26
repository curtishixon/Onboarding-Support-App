import { NextRequest, NextResponse } from "next/server";
import type { PartyCreateInput } from "@/types/zonos";
import { getApiKey } from "@/lib/credentials";

const ZONOS_API_URL = "https://api.zonos.com/graphql";

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

async function zonosGraphQL<T>(
  query: string,
  variables: Record<string, unknown>
): Promise<{ data?: T; errors?: Array<{ message: string }> }> {
  const response = await fetch(ZONOS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      credentialToken: getApiKey(),
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Zonos API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
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

  // Step 1: Create the party with type ORIGIN
  const partyInput: PartyCreateInput = {
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
  };

  const partyResult = await zonosGraphQL<{ partyCreate: { id: string } }>(
    `mutation CreatePartyForFulfillmentCenter($input: PartyCreateInput!) {
      partyCreate(input: $input) {
        id
      }
    }`,
    { input: partyInput }
  );

  if (partyResult.errors?.length || !partyResult.data?.partyCreate?.id) {
    const errorMessage = partyResult.errors?.[0]?.message || "Failed to create party";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }

  const partyId = partyResult.data.partyCreate.id;

  // Step 2: Link the party to a fulfillment center via updateFulfillmentCenter
  const fulfillmentResult = await zonosGraphQL<{ updateFulfillmentCenter: { id: string } }>(
    `mutation UpdateFulfillmentCenter($input: UpdateFulfillmentCenterInput!) {
      updateFulfillmentCenter(input: $input) {
        id
      }
    }`,
    { input: { party: partyId } }
  );

  if (fulfillmentResult.errors?.length) {
    // If updateFulfillmentCenter fails, still return the party ID as partial success
    return NextResponse.json(
      {
        partyId,
        warning: "Party created but fulfillment center link may require manual setup",
        fulfillmentError: fulfillmentResult.errors[0]?.message,
      },
      { status: 207 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      partyId,
      fulfillmentCenterId: fulfillmentResult.data?.updateFulfillmentCenter?.id,
    },
    { status: 201 }
  );
}
