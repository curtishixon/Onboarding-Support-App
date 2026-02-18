interface Props {
  data: Record<string, unknown>;
}

export function SettingsPayload({ data }: Props) {
  const entries = Object.entries(data);

  return (
    <div className="space-y-3">
      {entries.map(([key, value]) => (
        <div key={key}>
          <p className="text-sm font-medium text-[var(--text-tertiary)]">
            {key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
          </p>
          <p className="text-sm font-mono">
            {typeof value === "object" ? JSON.stringify(value, null, 2) : String(value)}
          </p>
        </div>
      ))}
    </div>
  );
}
