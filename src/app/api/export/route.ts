import { NextResponse } from "next/server";
import { buildSnapshot } from "@/lib/server/snapshot";

/**
 * GET /api/export — token-gated full KV snapshot (Harness §2.3). Requires the
 * `x-export-token` header to equal EXPORT_TOKEN. Fail-closed if unset.
 */
export async function GET(req: Request): Promise<NextResponse> {
  const token = process.env.EXPORT_TOKEN;
  if (!token || req.headers.get("x-export-token") !== token) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const snapshot = await buildSnapshot(new Date().toISOString());
    return NextResponse.json(snapshot, {
      headers: {
        "cache-control": "no-store",
        "content-disposition": `attachment; filename="kidsmart-backup.json"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "kv_unavailable" }, { status: 503 });
  }
}
