"use client";

/**
 * GA4 loader — dormant by default (Harness §8.2). No-ops entirely unless
 * NEXT_PUBLIC_GA_ID is set, and NEVER runs on player/room pages (the
 * capability code lives in the URL — no PII to GA, ever).
 */
import Script from "next/script";
import { usePathname } from "next/navigation";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/** Routes whose URL carries a private code — analytics must skip them. */
function isPrivatePath(pathname: string): boolean {
  return (
    pathname.startsWith("/p/") ||
    pathname.startsWith("/room/") ||
    pathname.startsWith("/join/")
  );
}

export function GoogleAnalytics() {
  const pathname = usePathname();
  if (!GA_ID || isPrivatePath(pathname)) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
