import { NextResponse } from "next/server";
import { buildSnapshot } from "@/lib/server/snapshot";

/**
 * GET /api/cron/backup — daily off-store backup (Harness §2.3). Guarded by
 * CRON_SECRET. Builds the full KV snapshot and, when GITHUB_TOKEN + GITHUB_REPO
 * are configured, commits a dated copy to the repo so it survives losing the KV
 * provider. Without GitHub configured it returns snapshot stats (no-op) loudly.
 */
function authorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${secret}` || req.headers.get("x-cron-secret") === secret;
}

export async function GET(req: Request): Promise<NextResponse> {
  if (!authorized(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let snapshot;
  try {
    snapshot = await buildSnapshot(new Date().toISOString());
  } catch {
    return NextResponse.json({ ok: false, error: "kv_unavailable" }, { status: 503 });
  }

  const stats = {
    rooms: Object.keys(snapshot.rooms).length,
    profiles: Object.keys(snapshot.profiles).length,
    progress: Object.keys(snapshot.progress).length,
  };

  const repo = process.env.GITHUB_REPO;
  const ghToken = process.env.GITHUB_TOKEN;
  if (!repo || !ghToken) {
    return NextResponse.json({ ok: true, committed: false, reason: "github_not_configured", stats });
  }

  const date = snapshot.exportedAt.slice(0, 10);
  const path = `backups/kidsmart-${date}.json`;
  const content = Buffer.from(JSON.stringify(snapshot, null, 2)).toString("base64");

  try {
    // Look up any existing file's sha (so a same-day re-run updates, not 409s).
    let sha: string | undefined;
    const head = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
      headers: { authorization: `Bearer ${ghToken}`, "user-agent": "kidsmart-backup" },
    });
    if (head.ok) sha = ((await head.json()) as { sha?: string }).sha;

    const put = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
      method: "PUT",
      headers: {
        authorization: `Bearer ${ghToken}`,
        "user-agent": "kidsmart-backup",
        "content-type": "application/json",
      },
      body: JSON.stringify({ message: `Backup ${date}`, content, sha }),
    });
    if (!put.ok) {
      return NextResponse.json({ ok: false, error: "github_write_failed", status: put.status }, { status: 502 });
    }
    return NextResponse.json({ ok: true, committed: true, path, stats });
  } catch {
    return NextResponse.json({ ok: false, error: "github_unreachable" }, { status: 502 });
  }
}
