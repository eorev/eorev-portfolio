import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Archivo, Spline_Sans_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { SITE } from "@/lib/content";
import { PostHogAnalytics } from "./providers";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo",
});

const splineMono = Spline_Sans_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-spline-mono",
});

const description =
  "Backend and infrastructure engineer. Co-owner of BurntBase, where I own the Go API, its Postgres and pgvector data layer, and the AWS infrastructure underneath.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.role}`,
    template: `%s — ${SITE.name}`,
  },
  description,
  alternates: { canonical: "/" },
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  keywords: [
    "Ethan Orevillo",
    "backend engineer",
    "infrastructure engineer",
    "Go",
    "PostgreSQL",
    "pgvector",
    "AWS",
    "BurntBase",
  ],
  openGraph: {
    type: "profile",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.role}`,
    description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.role}`,
    description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f6f3ec",
  colorScheme: "light",
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE.name,
  jobTitle: SITE.role,
  url: SITE.url,
  email: `mailto:${SITE.email}`,
  address: {
    "@type": "PostalAddress",
    addressRegion: "NJ",
    addressCountry: "US",
  },
  sameAs: [SITE.github, SITE.linkedin],
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "University of Delaware",
  },
  worksFor: [
    { "@type": "Organization", name: "Prudential Financial" },
    { "@type": "Organization", name: "BurntBase" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${splineMono.variable}`}>
      <body className="min-h-screen bg-paper font-sans text-body text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <PostHogAnalytics>{children}</PostHogAnalytics>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
