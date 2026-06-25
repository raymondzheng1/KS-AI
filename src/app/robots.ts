import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo/site";

/** Public content is indexable; private code-bearing routes are not (§18). */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/p/", "/room/", "/join/", "/facilitator"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
