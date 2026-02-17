interface Props {
  data: Record<string, unknown>;
}

function str(val: unknown): string {
  if (val == null || val === "") return "";
  return String(val);
}

export function FulfillmentCenterPayload({ data }: Props) {
  const party = data.party as Record<string, unknown> | undefined;
  const location = party?.location as Record<string, unknown> | undefined;
  const person = party?.person as Record<string, unknown> | undefined;

  const addressLine = location
    ? [str(location.line1), str(location.line2)].filter(Boolean).join(", ")
    : "";
  const cityLine = location
    ? [str(location.locality), str(location.administrativeAreaCode), str(location.postalCode)]
        .filter(Boolean)
        .join(", ") + " " + str(location.countryCode)
    : "";
  const contactName = person
    ? [str(person.firstName), str(person.lastName)].filter(Boolean).join(" ")
    : "";

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium text-gray-500">Center Name</p>
        <p className="text-sm">{str(data.name) || "-"}</p>
      </div>
      {location && (
        <div>
          <p className="text-sm font-medium text-gray-500">Address</p>
          {addressLine && <p className="text-sm">{addressLine}</p>}
          {cityLine.trim() && <p className="text-sm">{cityLine}</p>}
        </div>
      )}
      {person && (
        <div>
          <p className="text-sm font-medium text-gray-500">Contact</p>
          {contactName && <p className="text-sm">{contactName}</p>}
          {str(person.email) && <p className="text-sm text-gray-500">{str(person.email)}</p>}
          {str(person.phone) && <p className="text-sm text-gray-500">{str(person.phone)}</p>}
          {str(person.companyName) && <p className="text-sm text-gray-500">{str(person.companyName)}</p>}
        </div>
      )}
    </div>
  );
}
