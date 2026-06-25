/**
 * Single source of truth for site-level identity + canonical origin.
 * Base URL is env-driven (Harness §8) so domain moves are painless; the
 * trailing slash is stripped once, centrally, so sitemap/robots/canonical agree.
 */
export const SITE = {
  name: "KidSmart AI Training",
  shortName: "KidSmart AI",
  description:
    "A 2-week AI adventure for curious kids — clear 10 hurdles covering AI " +
    "fundamentals, tools, ethics, and creative projects. Play with friends, " +
    "climb the leaderboard, and build your own AI project.",
  themeColor: "#FFD135",
  backgroundColor: "#F4F9FF",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://kidsmart-ai-training.vercel.app").replace(
    /\/+$/,
    "",
  ),
} as const;

/** Absolute URL for a path (leading slash optional). */
export function absUrl(path = "/"): string {
  return `${SITE.url}/${path.replace(/^\/+/, "")}`;
}
