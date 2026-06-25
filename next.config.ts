import type { NextConfig } from "next";

/**
 * Baseline security headers applied to all routes (Harness §6.6).
 *
 *  - Referrer-Policy = strict-origin-when-cross-origin
 *      Load-bearing for the capability-code model: a player's private code
 *      lives in the URL path (`/p/<code>`). Without this, clicking an
 *      outbound tool/video link would leak the full URL (incl. the code)
 *      in the Referer header. strict-origin-when-cross-origin drops the
 *      path on cross-origin requests.
 *
 *  - Content-Security-Policy
 *      Locked down. Third-party origins permitted:
 *        - youtube-nocookie.com  (curated lesson video iframes)
 *        - i.ytimg.com           (video thumbnails)
 *        - GA4 hubs              (only active when NEXT_PUBLIC_GA_ID is set)
 *      'unsafe-eval' is opened in DEV ONLY (Next's React Refresh uses eval);
 *      production stays tight (Harness §6.6).
 */
const isDev = process.env.NODE_ENV !== "production";
const GA_SCRIPT = "https://www.googletagmanager.com";
const GA_HUBS =
  "https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com";

const scriptSrc =
  (isDev
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
    : "script-src 'self' 'unsafe-inline'") + ` ${GA_SCRIPT}`;

const SECURITY_HEADERS = [
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      scriptSrc,
      "style-src 'self' 'unsafe-inline'",
      `img-src 'self' data: blob: https://i.ytimg.com ${GA_HUBS}`,
      "font-src 'self' data:",
      "frame-src https://www.youtube-nocookie.com",
      `connect-src 'self' ${GA_HUBS}`,
      "worker-src 'self'",
      "manifest-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  // Pin the workspace root — a stray lockfile higher in the tree otherwise
  // makes Next infer the wrong root (build warning).
  turbopack: { root: __dirname },
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
};

export default nextConfig;
