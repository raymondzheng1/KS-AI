import type { Metadata } from "next";
import { normalizeCode } from "@/lib/progress/code";

/** Code-bearing routes are never indexed (Harness §18). The manifest points at
 *  this player's page so an installed icon opens to their saved adventure. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code: raw } = await params;
  const code = normalizeCode(decodeURIComponent(raw));
  return {
    robots: { index: false, follow: false },
    manifest: code ? `/p/${code}/app.webmanifest` : undefined,
  };
}

export default function PlayerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
