"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard" },
  { href: "/?status=pending", label: "Pending Actions" },
  { href: "/?status=executed", label: "History" },
  { href: "/settings", label: "Settings Viewer" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-gray-100 p-4 flex flex-col gap-1">
      <div className="mb-6 px-3">
        <h1 className="text-lg font-semibold text-white">Onboarding Support</h1>
        <p className="text-xs text-gray-400 mt-1">Zonos Integration Tool</p>
      </div>
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/" && !item.href.includes("?")
              : pathname + (typeof window !== "undefined" ? window.location.search : "") === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
