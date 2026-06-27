import Link from "next/link";
import { OTHER_KIDSMART_SERVICES } from "@/lib/kidsmart/services";

const LINKS = [
  { href: "/overview", label: "Programme" },
  { href: "/tools", label: "AI Toolkit" },
  { href: "/appendix", label: "Glossary" },
  { href: "/facilitator", label: "Facilitators" },
  { href: "/contact", label: "Contact" },
];

/**
 * Consistent site footer, rendered once in the root layout so it appears on
 * every page — the public pages, the room board, and the in-journey game.
 */
export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-ks-kraft/40 bg-ks-cream/40">
      <div className="mx-auto max-w-5xl px-5 py-7 pb-[max(1.75rem,env(safe-area-inset-bottom))]">
        {OTHER_KIDSMART_SERVICES.length > 0 && (
          <section className="mb-6">
            <p className="mb-2 text-center text-xs font-bold uppercase tracking-wide text-ks-slate">
              More from KidSmart 🦊
            </p>
            <div className="mx-auto grid max-w-2xl gap-2 sm:grid-cols-2">
              {OTHER_KIDSMART_SERVICES.map((s) => {
                const inner = (
                  <>
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-xl"
                      style={{ background: `color-mix(in srgb, ${s.accent} 16%, white)` }}
                    >
                      {s.icon}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-display text-sm font-bold text-ks-dark">
                        {s.name}
                        {s.status === "coming-soon" && (
                          <span className="ml-1.5 rounded-full bg-ks-kraft/30 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ks-slate">
                            Soon
                          </span>
                        )}
                      </span>
                      <span className="block truncate text-xs text-ks-ink-soft">{s.tagline}</span>
                    </span>
                  </>
                );
                return s.status === "live" ? (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener"
                    className="ks-card flex items-center gap-3 p-3 transition hover:scale-[1.02]"
                    style={{ borderLeft: `5px solid ${s.accent}` }}
                  >
                    {inner}
                  </a>
                ) : (
                  <div
                    key={s.id}
                    className="ks-card flex items-center gap-3 p-3 opacity-70"
                    style={{ borderLeft: `5px solid ${s.accent}` }}
                  >
                    {inner}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <nav className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="inline-flex min-h-11 items-center px-3 text-sm font-semibold text-ks-slate hover:text-ks-dark"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <p className="mt-3 text-center text-xs text-ks-slate">
          Free · No login · Play with friends · Safe for kids
        </p>
        <p className="mt-1 text-center text-xs text-ks-slate/80">
          © KidSmart · A 2-week AI adventure for curious kids
        </p>
      </div>
    </footer>
  );
}
