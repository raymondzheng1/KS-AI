import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo/site";

/** Public, indexable surfaces only — never the code-bearing routes (§18).
 *  Stable lastModified avoids per-crawl freshness noise (Harness §8). */
const LAST_MODIFIED = new Date("2026-06-25");

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/overview", "/tools", "/mindmap", "/appendix", "/contact"];
  return paths.map((path) => ({
    url: `${SITE.url}${path === "/" ? "" : path}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
