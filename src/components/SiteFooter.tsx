import Link from "next/link";

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
