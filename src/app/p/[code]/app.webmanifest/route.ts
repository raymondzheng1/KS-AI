import { NextResponse } from "next/server";
import { SITE } from "@/lib/seo/site";

/**
 * Per-player PWA manifest (Harness §19.2). Installing from a player's page
 * yields an icon whose start_url is the stable `/play` resume route — so it
 * opens the player's *latest* code (resolved on the device at open time)
 * rather than freezing whichever code was active at install. id is stable so
 * installs from different codes dedupe to one app.
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    name: `${SITE.shortName} — My Adventure`,
    short_name: SITE.shortName,
    id: "/play",
    start_url: "/play",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: SITE.backgroundColor,
    theme_color: SITE.themeColor,
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  });
}
