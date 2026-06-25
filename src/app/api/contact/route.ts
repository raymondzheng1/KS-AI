import { NextResponse } from "next/server";
import { ContactInputSchema } from "@/lib/schemas";
import { sendContactEmail } from "@/lib/server/email";
import { getLimiter } from "@/lib/server/ratelimit";
import { clientIp } from "@/lib/server/request";

/**
 * Contact form → admin inbox via Resend. Validation runs BEFORE the rate
 * limiter so bad-shape and honeypot hits don't consume a legit visitor's
 * budget. Honeypot (`website`) and validation failures return a silent 400.
 */
export async function POST(req: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const parsed = ContactInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
  if (parsed.data.website) {
    // Honeypot tripped — pretend success, send nothing.
    return NextResponse.json({ ok: true });
  }

  const { ok } = await getLimiter("contact").limit(clientIp(req));
  if (!ok) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  const result = await sendContactEmail({
    name: parsed.data.name,
    email: parsed.data.email,
    message: parsed.data.message,
  });
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 503 });
  }
  return NextResponse.json({ ok: true });
}
