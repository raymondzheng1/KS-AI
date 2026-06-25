import Image from "next/image";
import Link from "next/link";

/** Shared shell for public content pages: logo bar + title + body. */
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
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/kidsmart_logo.png"
            alt="KidSmart"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
          />
          <span className="font-display text-lg font-extrabold text-ks-dark">KidSmart AI</span>
        </Link>
        <Link href="/" className="ks-chip text-sm">← Home</Link>
      </header>
      <section className="py-4">
        <h1 className="text-3xl font-extrabold text-ks-dark sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-lg text-ks-ink">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </section>
    </main>
  );
}
