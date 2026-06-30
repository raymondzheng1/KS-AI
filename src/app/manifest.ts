import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo/site";

/** Global installable-PWA manifest (Harness §19.2). The per-player manifest at
 *  /p/<code>/app.webmanifest overrides start_url so an installed icon opens
 *  straight to that player's game. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.shortName,
    description: SITE.description,
    // Resume route: an installed icon opens the player's latest code (or /start
    // if none) instead of a fixed page — see /play and §18.8.
    start_url: "/play",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: SITE.backgroundColor,
    theme_color: SITE.themeColor,
    categories: ["education", "kids"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
