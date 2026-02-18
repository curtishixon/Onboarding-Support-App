interface Props {
  data: Record<string, unknown>;
}

export function WebhookPayload({ data }: Props) {
  const url = data.url != null ? String(data.url) : null;
  const id = data.id != null ? String(data.id) : null;
  const events = Array.isArray(data.events) ? (data.events as string[]) : null;

  return (
    <div className="space-y-3">
      {url !== null && (
        <div>
          <p className="text-sm font-medium text-[var(--text-tertiary)]">Webhook URL</p>
          <p className="text-sm font-mono break-all">{url}</p>
        </div>
      )}
      {events !== null && (
        <div>
          <p className="text-sm font-medium text-[var(--text-tertiary)]">Events</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {events.map((event) => (
              <span
                key={event}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
              >
                {event}
              </span>
            ))}
          </div>
        </div>
      )}
      {id !== null && (
        <div>
          <p className="text-sm font-medium text-[var(--text-tertiary)]">Webhook ID</p>
          <p className="text-sm font-mono">{id}</p>
        </div>
      )}
    </div>
  );
}
