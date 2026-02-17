import type { Metadata } from "next";
import { Sidebar } from "@/components/sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Onboarding Support App",
  description: "Internal tool for automating Zonos onboarding workflows",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-gray-50 text-gray-900">
        <Sidebar />
        <main className="flex-1 p-8">{children}</main>
      </body>
    </html>
  );
}
