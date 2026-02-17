"use client";

import { useEffect, useState } from "react";

interface SettingsSection {
  key: string;
  label: string;
  type: string;
}

const SECTIONS: SettingsSection[] = [
  { key: "fc", label: "Fulfillment Centers", type: "fulfillment-centers" },
  { key: "sz", label: "Shipping Zones", type: "shipping-zones" },
  { key: "sp", label: "Shipping Profiles", type: "shipping-profiles" },
  { key: "ca", label: "Carrier Accounts", type: "carrier-accounts" },
  { key: "sl", label: "Service Levels", type: "service-levels" },
  { key: "hs", label: "Hello Settings", type: "hello-settings" },
  { key: "wh", label: "Webhooks", type: "webhooks" },
];

export default function SettingsPage() {
  const [data, setData] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  function toggleSection(key: string, type: string) {
    if (expanded[key]) {
      setExpanded((prev) => ({ ...prev, [key]: false }));
      return;
    }

    setExpanded((prev) => ({ ...prev, [key]: true }));

    if (data[key]) return;

    setLoading((prev) => ({ ...prev, [key]: true }));
    fetch(`/api/zonos/settings?type=${type}`)
      .then((res) => res.json())
      .then((result) => {
        setData((prev) => ({ ...prev, [key]: result }));
      })
      .finally(() => {
        setLoading((prev) => ({ ...prev, [key]: false }));
      });
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-2">Settings Viewer</h1>
      <p className="text-sm text-gray-500 mb-6">
        Read-only view of current Zonos store configuration. These settings are
        fetched live from the Zonos API.
      </p>

      <div className="space-y-3">
        {SECTIONS.map(({ key, label, type }) => (
          <div
            key={key}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden"
          >
            <button
              onClick={() => toggleSection(key, type)}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span>{label}</span>
              <span className="text-gray-400">
                {expanded[key] ? "\u25B2" : "\u25BC"}
              </span>
            </button>

            {expanded[key] && (
              <div className="border-t border-gray-200 p-4">
                {loading[key] ? (
                  <p className="text-sm text-gray-500">Loading...</p>
                ) : data[key] ? (
                  <pre className="text-xs font-mono bg-gray-50 rounded p-3 overflow-auto max-h-96">
                    {JSON.stringify(data[key], null, 2)}
                  </pre>
                ) : (
                  <p className="text-sm text-gray-500">No data available.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
