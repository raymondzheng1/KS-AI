import { SiteHeader } from "./SiteHeader";

/** Shared shell for public content pages: consistent header + title + body. */
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
      <SiteHeader />
      <section className="py-4">
        <h1 className="font-display text-3xl font-bold text-ks-dark sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-lg text-ks-ink">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </section>
    </main>
  );
}
