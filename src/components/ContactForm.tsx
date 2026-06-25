"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        setStatus("error");
        setError(
          j.error === "rate_limited"
            ? "Too many messages just now — please try again later."
            : "Sorry, the message could not be sent. Please email us directly.",
        );
      }
    } catch {
      setStatus("error");
      setError("Network error — please try again.");
    }
  }

  if (status === "sent") {
    return (
      <div className="ks-card p-6 text-center">
        <p className="text-lg font-bold text-ks-green">Thanks — your message is on its way! ✅</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="ks-card flex flex-col gap-4 p-6">
      {/* Honeypot — hidden from humans. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <label className="flex flex-col gap-1 text-sm font-semibold text-ks-dark">
        Your name
        <input
          name="name"
          required
          maxLength={80}
          className="min-h-11 rounded-xl border-2 border-ks-dark/25 bg-white px-3 py-2 text-ks-ink"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold text-ks-dark">
        Your email
        <input
          name="email"
          type="email"
          required
          maxLength={200}
          className="min-h-11 rounded-xl border-2 border-ks-dark/25 bg-white px-3 py-2 text-ks-ink"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-semibold text-ks-dark">
        Message
        <textarea
          name="message"
          required
          maxLength={4000}
          rows={5}
          className="rounded-xl border-2 border-ks-dark/25 bg-white px-3 py-2 text-ks-ink"
        />
      </label>
      <p className="text-xs text-ks-ink-soft">
        Please don&apos;t paste a player&apos;s game code here — keep it private.
      </p>
      {status === "error" && <p className="text-sm font-semibold text-ks-coral">{error}</p>}
      <button
        type="submit"
        disabled={status === "sending"}
        className="min-h-11 rounded-pill bg-ks-blue px-6 py-2 font-extrabold text-white shadow-card transition hover:brightness-105 disabled:opacity-60"
        style={{ borderRadius: "var(--radius-pill)" }}
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
