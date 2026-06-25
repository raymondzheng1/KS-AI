import Link from "next/link";
import { BrandLockup } from "./BrandLockup";

/** Shared shell for public content pages: brand lockup + title + body. */
export function SectionShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto max-w-4xl px-5 pb-20 pt-[max(1rem,env(safe-area-inset-top))]">
      <header className="flex items-center justify-between py-4">
        <BrandLockup />
        <Link href="/" className="ks-iconbtn" aria-label="Home">
          ‹
        </Link>
      </header>
      <section className="py-4">
        <h1 className="font-display text-3xl font-bold text-ks-dark sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-lg text-ks-ink">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </section>
    </main>
  );
}
