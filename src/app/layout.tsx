import type { Metadata } from "next";
import { Sidebar } from "@/components/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
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
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen antialiased">
        <ThemeProvider>
          <Sidebar />
          <main className="flex-1 p-8 overflow-auto bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
