import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Self-hosted (next/font/google needs fonts.googleapis.com at build time,
// which proved flaky). Families mirror the organizer's site (Exo 2 display,
// Inter body, JetBrains Mono); latin-subset variable woff2 from gstatic.
const exo2 = localFont({
  variable: "--font-exo2",
  src: "../fonts/Exo2-var.woff2",
  weight: "100 900",
  display: "swap",
});

const inter = localFont({
  variable: "--font-inter",
  src: "../fonts/Inter-var.woff2",
  weight: "100 900",
  display: "swap",
});

const jetbrainsMono = localFont({
  variable: "--font-jetbrains-mono",
  src: "../fonts/JetBrainsMono-var.woff2",
  weight: "100 800",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://lodgings.aistartuphouse.com",
  ),
  title: {
    default: "AI Startup House Lodging | New York, Austin and Los Angeles",
    template: "%s | AI Startup House Lodging",
  },
  description:
    "Lodging for Entrepreneur AI Startup House participants: Mansfield and Seton in Manhattan, Capitol in Austin, and StayHW condos in Hollywood, Los Angeles. Explore rooms and request your stay.",
  openGraph: {
    siteName: "AI Startup House Lodging",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${exo2.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
