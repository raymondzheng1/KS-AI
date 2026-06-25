import Link from "next/link";
import { BrandLockup } from "./BrandLockup";

/** Top nav shown on every standalone page (desktop only; mobile uses the footer). */
const NAV = [
  { href: "/overview", label: "Programme" },
  { href: "/tools", label: "AI Toolkit" },
  { href: "/appendix", label: "Glossary" },
];

/**
 * Consistent site header: the KidSmart brand lockup (taps home) on the left,
 * a compact nav on desktop, and a right-side slot. `start` shows the persistent
 * "Start" button (so a student can begin from any informational page); `action`
 * supplies a page-specific control instead (e.g. the room's "Continue" button).
 * On `home` the lockup is static (no self-link). The full nav lives in the
 * shared footer for small screens.
 */
export function SiteHeader({
  home = false,
  start = false,
  action,
}: {
  home?: boolean;
  start?: boolean;
  action?: React.ReactNode;
}) {
  return (
    <header className="flex items-center justify-between gap-3 py-4">
      <BrandLockup href={home ? null : "/"} />
      <div className="flex items-center gap-1.5">
        <nav className="hidden items-center gap-0.5 sm:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-full px-3 py-1.5 text-sm font-semibold text-ks-ink transition-colors hover:bg-ks-cream hover:text-ks-dark"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        {action}
        {start && (
          <Link href="/start" className="ks-btn ks-btn-coral ks-btn-sm whitespace-nowrap">
            Start ✏️
          </Link>
        )}
      </div>
    </header>
  );
}
