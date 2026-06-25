import Link from "next/link";
import { BrandLockup } from "@/components/BrandLockup";
import { CrayonUnderline } from "@/components/CrayonUnderline";
import { Sunny } from "@/components/Sunny";

const STEPS = [
  { done: true, title: "Join a room", text: "Scan a QR or open your invite link." },
  { done: true, title: "Clear 10 hurdles", text: "Learn, play, then pass the gate quiz." },
  { done: false, title: "Climb the leaderboard", text: "Earn XP for wins and daily streaks." },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-md px-5 pb-16 pt-[max(1rem,env(safe-area-inset-top))]">
      {/* Header */}
      <header className="flex items-center justify-between py-3">
        <BrandLockup href={null} />
        <span className="ks-iconbtn" aria-hidden>
          🦊
        </span>
      </header>
      <p className="mb-4 text-sm text-ks-slate">Hi, explorer! Ready to start? 👋</p>

      {/* Hero card */}
      <section className="relative">
        <div className="ks-card relative px-6 pb-6 pt-9 text-center" style={{ transform: "rotate(-1deg)" }}>
          <span className="ks-tape" style={{ top: -10, left: 28 }} />
          <span className="ks-tape ks-tape-green" style={{ top: -10, right: 28, transform: "rotate(6deg)" }} />
          <div className="flex justify-center">
            <Sunny pose="poseWave" size={130} bob />
          </div>
          <h1 className="font-display text-[26px] font-bold leading-[1.05] text-ks-dark">
            Become an
            <br />
            AI Explorer
          </h1>
          <div className="mx-auto -mt-1 w-40">
            <CrayonUnderline color="var(--color-ks-coral)" />
          </div>
          <p className="mx-auto mt-3 max-w-xs text-pretty text-sm text-ks-ink">
            A 2-week adventure — clear <strong>10 AI hurdles</strong>, play and compete with friends.
          </p>
          <Link href="/start" className="ks-btn ks-btn-coral mt-5 w-full">
            Start your adventure ✏️
          </Link>
          <Link href="/overview" className="ks-btn ks-btn-ghost mt-2.5 w-full">
            See the 10 hurdles
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="mt-7">
        <h2 className="mb-3 font-display text-base font-semibold text-ks-dark" style={{ transform: "rotate(-1deg)" }}>
          How it works
        </h2>
        <div className="flex flex-col gap-2.5">
          {STEPS.map((s) => (
            <div key={s.title} className="flex items-center gap-3">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border-[2.5px] border-dashed border-ks-kraft bg-white text-ks-green"
                aria-hidden
              >
                {s.done ? "✓" : ""}
              </span>
              <div className="min-w-0">
                <p className="font-display text-sm font-semibold text-ks-dark">{s.title}</p>
                <p className="text-xs text-ks-slate">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-9 flex flex-wrap items-center justify-center gap-2 border-t border-ks-kraft/40 pt-5 text-sm text-ks-slate">
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
