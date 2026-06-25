import Image from "next/image";
import Link from "next/link";

const PILLARS = [
  { icon: "🧠", title: "Understand AI", color: "var(--color-ks-blue)", text: "How machines learn, see, and create — explained for curious minds." },
  { icon: "🛠️", title: "Use the Tools", color: "var(--color-ks-green)", text: "Claude, Teachable Machine, Firefly, Suno and more — hands-on." },
  { icon: "⚖️", title: "Think Ethically", color: "var(--color-ks-coral)", text: "Bias, deepfakes, and doing the right thing with powerful tools." },
  { icon: "🚀", title: "Build & Share", color: "var(--color-ks-orange)", text: "Design your own AI project and present it on Demo Day." },
];

const STEPS = [
  { n: 1, title: "Join a room", text: "Open your invite link or scan the QR code, pick a fun nickname, and you're in." },
  { n: 2, title: "Clear 10 hurdles", text: "Each day is a hurdle. Learn, play the activities, then pass the gate quiz to unlock the next." },
  { n: 3, title: "Climb the leaderboard", text: "Earn XP for every hurdle, first-try wins, and daily streaks. Race your friends to the top!" },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-5 pb-20 pt-[max(1.5rem,env(safe-area-inset-top))]">
      {/* Hero */}
      <section className="flex flex-col items-center gap-5 py-10 text-center">
        <Image
          src="/kidsmart_logo.png"
          alt="KidSmart"
          width={120}
          height={120}
          priority
          className="h-28 w-28 object-contain drop-shadow"
        />
        <h1 className="text-balance text-4xl font-extrabold leading-tight text-ks-dark sm:text-5xl">
          Become an{" "}
          <span className="rounded-2xl bg-ks-yellow px-3 py-1 text-ks-dark">AI Explorer</span>
        </h1>
        <p className="max-w-2xl text-pretty text-lg text-ks-ink">
          A 2-week adventure where you clear <strong>10 AI hurdles</strong> — from how
          machines learn to building your own project — playing and competing with friends.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/start"
            className="rounded-pill bg-ks-coral px-7 py-3 text-lg font-extrabold text-white shadow-card transition hover:brightness-105"
            style={{ borderRadius: "var(--radius-pill)" }}
          >
            Start your adventure
          </Link>
          <Link
            href="/overview"
            className="ks-chip text-base"
          >
            See the 10 hurdles
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="py-8">
        <h2 className="mb-5 text-center text-2xl font-bold text-ks-dark">How it works</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="ks-card p-5">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-ks-blue text-lg font-extrabold text-white">
                {s.n}
              </div>
              <h3 className="text-lg font-bold text-ks-dark">{s.title}</h3>
              <p className="mt-1 text-sm text-ks-ink">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Learning pillars */}
      <section className="py-8">
        <h2 className="mb-5 text-center text-2xl font-bold text-ks-dark">
          Four things you&apos;ll master
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {PILLARS.map((p) => (
            <div key={p.title} className="ks-card flex items-start gap-4 p-5">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl"
                style={{ background: "color-mix(in srgb, " + p.color + " 18%, white)" }}
              >
                {p.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold" style={{ color: p.color }}>
                  {p.title}
                </h3>
                <p className="mt-1 text-sm text-ks-ink">{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-10 flex flex-wrap items-center justify-center gap-2 border-t border-ks-dark/15 pt-6 text-sm text-ks-ink-soft">
        {[
          { href: "/overview", label: "Programme" },
          { href: "/tools", label: "AI Toolkit" },
          { href: "/appendix", label: "Glossary" },
          { href: "/facilitator", label: "Facilitators" },
          { href: "/contact", label: "Contact" },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="inline-flex min-h-11 items-center px-3 font-semibold hover:text-ks-dark"
          >
            {l.label}
          </Link>
        ))}
      </footer>
    </main>
  );
}
