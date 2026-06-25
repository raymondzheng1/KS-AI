/**
 * Transactional email via the Resend REST API (Harness §16.2 — zero-deps
 * fetch variant). Used only by the /contact form; never touches player data.
 *
 * Logs the REASON a send fails to the server console (Vercel function logs) so
 * misconfiguration is diagnosable — without ever logging the visitor's message
 * or email address (Harness §6.2 no-PII-in-logs).
 *
 * Recipient is `CONTACT_TO` (env), defaulting to the admin inbox.
 */
import "server-only";

const DEFAULT_INBOX = "raymond.zheng@gmail.com";

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export async function sendContactEmail(
  msg: ContactMessage,
): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error(
      "[contact] RESEND_API_KEY is not set in this deployment — cannot send. " +
        "Add it in Vercel and REDEPLOY (env changes don't affect a running deployment).",
    );
    return { ok: false, error: "not_configured" };
  }

  const from = process.env.RESEND_FROM ?? "KidSmart AI <onboarding@resend.dev>";
  const to = process.env.CONTACT_TO ?? DEFAULT_INBOX;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: msg.email,
        subject: `KidSmart AI — contact from ${msg.name}`,
        text: `From: ${msg.name} <${msg.email}>\n\n${msg.message}`,
      }),
    });
    if (res.ok) return { ok: true };

    // Non-2xx from Resend — log the operational detail (NOT the message body).
    // Common causes: from-domain not verified, invalid `from`, or the shared
    // onboarding@resend.dev sender can only deliver to the account owner.
    const detail = await res.text().catch(() => "");
    console.error(
      `[contact] Resend rejected the send: status=${res.status} from="${from}" to-domain="${to.split("@")[1] ?? "?"}" detail=${detail.slice(0, 400)}`,
    );
    return { ok: false, error: "send_failed" };
  } catch (e) {
    console.error("[contact] Resend request threw:", e instanceof Error ? e.message : String(e));
    return { ok: false, error: "send_failed" };
  }
}
