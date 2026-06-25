import type { Metadata, Viewport } from "next";
import { Inter, Nunito } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { SITE } from "@/lib/seo/site";
import "./globals.css";

// Display face: only the weights the UI renders (Harness §19.1).
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — Become an AI Explorer`, template: `%s · ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.shortName,
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: SITE.shortName,
    statusBarStyle: "default",
  },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} — Become an AI Explorer`,
    description: SITE.description,
    url: SITE.url,
  },
};

export const viewport: Viewport = {
  themeColor: SITE.themeColor,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${nunito.variable} ${inter.variable}`}>
      <body>
        {children}
        <GoogleAnalytics />
        <Analytics />
      </body>
    </html>
  );
}
