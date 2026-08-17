import type { Metadata } from "next";

import "../globals.css";

export const metadata: Metadata = {
  title: "Studio | SADIA",
  robots: {
    index: false,
    follow: false,
  },
};

export default function StudioLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  );
}
