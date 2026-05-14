import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BioDB Next.js Demo",
  description: "Search PDB entries and manage proteins with Server Actions.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
