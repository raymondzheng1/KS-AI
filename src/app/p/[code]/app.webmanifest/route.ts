import { NextResponse } from "next/server";
import { SITE } from "@/lib/seo/site";
import { normalizeCode } from "@/lib/progress/code";

/**
 * Per-player PWA manifest (Harness §19.2). start_url + id point at this
 * player's page, so an installed icon opens straight to their saved adventure.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ code: string }> },
): Promise<NextResponse> {
  const { code: raw } = await params;
  const code = normalizeCode(decodeURIComponent(raw));
  const startUrl = code ? `/p/${code}` : "/";
  return NextResponse.json({
    name: `${SITE.shortName} — My Adventure`,
    short_name: SITE.shortName,
    id: startUrl,
    start_url: startUrl,
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
