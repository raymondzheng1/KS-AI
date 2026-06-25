/**
 * Transactional email via the Resend REST API (Harness §16.2 — zero-deps
 * fetch variant). Used only by the /contact form; never touches player data.
 * When RESEND_API_KEY is unset the route reports a friendly failure rather
 * than throwing.
 */
import "server-only";

const ADMIN_INBOX = "raymond.zheng@gmail.com";

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export async function sendContactEmail(
  msg: ContactMessage,
): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: "send_failed" };
  const from = process.env.RESEND_FROM ?? "KidSmart AI <onboarding@resend.dev>";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [ADMIN_INBOX],
        reply_to: msg.email,
        subject: `KidSmart AI — contact from ${msg.name}`,
        text: `From: ${msg.name} <${msg.email}>\n\n${msg.message}`,
      }),
    });
    return res.ok ? { ok: true } : { ok: false, error: "send_failed" };
  } catch {
    return { ok: false, error: "send_failed" };
  }
}
