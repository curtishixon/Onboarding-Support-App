"use client";

import { useState, type ReactNode } from "react";

interface SettingsSection {
  key: string;
  label: string;
  type: string;
  icon: ReactNode;
}

const SECTIONS: SettingsSection[] = [
  {
    key: "fc",
    label: "Fulfillment Centers",
    type: "fulfillment-centers",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    key: "sz",
    label: "Shipping Zones",
    type: "shipping-zones",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: "sp",
    label: "Shipping Profiles",
    type: "shipping-profiles",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    key: "ca",
    label: "Carrier Accounts",
    type: "carrier-accounts",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
  {
    key: "sl",
    label: "Service Levels",
    type: "service-levels",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    key: "hs",
    label: "Hello Settings",
    type: "hello-settings",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    key: "wh",
    label: "Webhooks",
    type: "webhooks",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
  },
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gradient">Settings Viewer</h1>
        <p className="text-[var(--text-tertiary)] mt-1">
          Read-only view of current Zonos store configuration
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6 flex items-start gap-3">
        <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-blue-600 dark:text-blue-400">
          These settings are fetched live from the Zonos API. Click on a section to view its current configuration.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-3">
        {SECTIONS.map(({ key, label, type, icon }) => (
          <div
            key={key}
            className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-primary)] shadow-sm overflow-hidden card-hover transition-colors"
          >
            <button
              onClick={() => toggleSection(key, type)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[var(--bg-hover)] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-secondary)] flex items-center justify-center">
                  {icon}
                </div>
                <span className="font-medium text-[var(--text-primary)]">{label}</span>
              </div>
              <svg
                className={`w-5 h-5 text-[var(--text-muted)] transition-transform ${expanded[key] ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {expanded[key] && (
              <div className="border-t border-[var(--border-primary)] p-5 bg-[var(--bg-tertiary)]">
                {loading[key] ? (
                  <div className="flex items-center gap-3 text-[var(--text-tertiary)] py-4">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-sm">Loading configuration...</span>
                  </div>
                ) : data[key] ? (
                  <pre className="text-xs font-mono bg-gray-900 text-gray-100 rounded-lg p-4 overflow-auto max-h-96">
                    {JSON.stringify(data[key], null, 2)}
                  </pre>
                ) : (
                  <p className="text-sm text-[var(--text-tertiary)] py-4">No data available.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
