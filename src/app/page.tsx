import Link from "next/link";
import { CrayonUnderline } from "@/components/CrayonUnderline";
import { SiteHeader } from "@/components/SiteHeader";
import { Sunny } from "@/components/Sunny";
import { HURDLES, TOOLS } from "@/lib/content";
import { accentColor, accentTint } from "@/lib/game/accent";
import { SITE } from "@/lib/seo/site";

const PILLARS = [
  { icon: "🧠", title: "Understand AI", text: "How machines learn, see, and create — explained simply.", color: "var(--color-ks-blue)" },
  { icon: "🛠️", title: "Use real AI tools", text: "Claude, Teachable Machine, Firefly, Suno — hands-on.", color: "var(--color-ks-green)" },
  { icon: "⚖️", title: "Think it through", text: "Spot bias and deepfakes, and use AI the right way.", color: "var(--color-ks-coral)" },
  { icon: "🚀", title: "Build your own", text: "Design an AI project and show it off on Demo Day.", color: "var(--color-ks-orange)" },
];

const STEPS = [
  { n: 1, title: "Join a room", text: "Scan a QR or open your invite link, then pick a fun nickname." },
  { n: 2, title: "Clear 10 hurdles", text: "Learn one idea at a time, play the activities, then pass the gate quiz." },
  { n: 3, title: "Climb the leaderboard", text: "Earn XP for wins, first tries, and daily streaks. Race your friends!" },
];

const FAQS = [
  { q: "Do I need to download anything?", a: "Nope — it runs right in your browser. You can even add it to your home screen so it opens like an app." },
  { q: "Is it free? Do I need an account?", a: "Free, with no login and no email. Just pick a fun nickname and start playing — your private link saves your progress." },
  { q: "Can I play with my friends?", a: "Yes! Create a room, share the invite link or QR code, and race each other up the leaderboard." },
  { q: "What will I actually learn?", a: "Real AI skills: how it works, how to use the top tools, how to use it safely and fairly, and how to build your very own AI project." },
  { q: "Is it safe for kids?", a: "Built for it — only hand-picked videos, no ads, and no personal info collected beyond the nickname you choose." },
];

function SectionTitle({ children, underline = "var(--color-ks-coral)" }: { children: React.ReactNode; underline?: string }) {
  return (
    <div className="mb-6 text-center">
      <h2 className="inline-block font-display text-2xl font-bold text-ks-dark md:text-3xl">{children}</h2>
      <div className="mx-auto mt-1 w-40">
        <CrayonUnderline color={underline} />
      </div>
    </div>
  );
}

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["WebApplication", "EducationalApplication"],
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Any (web browser)",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    audience: { "@type": "EducationalAudience", educationalRole: "student" },
    educationalLevel: "Middle school",
    isAccessibleForFree: true,
    inLanguage: "en",
  };

  return (
    <main className="mx-auto max-w-md px-5 pb-16 pt-[max(1rem,env(safe-area-inset-top))] md:max-w-5xl md:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <SiteHeader home start />

      {/* Eyebrow */}
      <p className="mb-3 flex justify-center">
        <span className="ks-chip" style={{ color: "var(--color-ks-coral)", boxShadow: "inset 0 0 0 2px var(--color-ks-coral)" }}>
          🚀 A 2-week AI adventure for curious kids
        </span>
      </p>

      {/* Hero card — stacks on mobile, two columns on desktop */}
      <section className="relative">
        <div
          className="ks-card relative px-6 pb-6 pt-9 text-center md:flex md:items-center md:gap-10 md:px-10 md:py-10 md:text-left"
          style={{ transform: "rotate(-1deg)" }}
        >
          <span className="ks-tape" style={{ top: -10, left: 28 }} />
          <span className="ks-tape ks-tape-green" style={{ top: -10, right: 28, transform: "rotate(6deg)" }} />
          <div className="flex justify-center md:shrink-0">
            <Sunny pose="poseWave" size={130} bob className="md:hidden" />
            <Sunny pose="poseWave" size={200} bob className="hidden md:block" />
          </div>
          <div className="md:flex-1">
            <h1 className="font-display text-[26px] font-bold leading-[1.05] text-ks-dark md:text-5xl">
              Become an
              <br />
              AI Explorer
            </h1>
            <div className="mx-auto -mt-1 w-40 md:mx-0 md:w-56">
              <CrayonUnderline color="var(--color-ks-coral)" />
            </div>
            <p className="mx-auto mt-3 max-w-xs text-pretty text-sm text-ks-ink md:mx-0 md:max-w-md md:text-lg">
              A 2-week adventure where you clear <strong>10 AI hurdles</strong> — from how machines
              learn to building your own project — playing and competing with friends.
            </p>
            <div className="mt-5 flex flex-col gap-2.5 md:flex-row">
              <Link href="/start" className="ks-btn ks-btn-coral w-full md:w-auto">
                Start your adventure ✏️
              </Link>
              <Link href="/overview" className="ks-btn ks-btn-ghost w-full md:w-auto">
                See the 10 hurdles
              </Link>
            </div>
          </div>
        </div>
        <p className="mt-3 text-center text-xs text-ks-slate">
          Free · No login · Play with friends · Safe for kids
        </p>
      </section>

      {/* What you'll master */}
      <section className="mt-12 md:mt-16">
        <SectionTitle underline="var(--color-ks-blue)">What you&apos;ll master 🧠</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p) => (
            <div key={p.title} className="ks-card p-5">
              <div
                className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl text-2xl"
                style={{ background: "color-mix(in srgb, " + p.color + " 16%, white)" }}
              >
                {p.icon}
              </div>
              <h3 className="font-display text-base font-semibold" style={{ color: p.color }}>
                {p.title}
              </h3>
              <p className="mt-1 text-sm text-ks-ink">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The 10-hurdle adventure */}
      <section className="mt-12 md:mt-16">
        <SectionTitle underline="var(--color-ks-green)">Your 10-hurdle adventure 🗺️</SectionTitle>
        <p className="mx-auto mb-6 max-w-xl text-center text-sm text-ks-ink">
          Two weeks, ten hurdles. Clear each one to unlock the next — all the way to Demo Day.
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {HURDLES.map((h) => (
            <div
              key={h.id}
              className="ks-card flex items-center gap-2.5 p-3"
              style={{ borderLeft: `5px solid ${accentColor(h.accent)}` }}
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg"
                style={{ background: accentTint(h.accent, 22) }}
              >
                {h.icon}
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wide" style={{ color: accentColor(h.accent) }}>
                  Day {h.day}
                </p>
                <p className="font-display text-sm font-semibold text-ks-dark">{h.title}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center">
          <Link href="/overview" className="ks-btn ks-btn-ghost">
            See the full programme →
          </Link>
        </p>
      </section>

      {/* AI toolkit */}
      <section className="mt-12 md:mt-16">
        <SectionTitle underline="var(--color-ks-orange)">Real tools you&apos;ll use 🛠️</SectionTitle>
        <p className="mx-auto mb-6 max-w-xl text-center text-sm text-ks-ink">
          You&apos;ll actually build things with the same AI tools the pros use — all kid-safe and free.
        </p>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {TOOLS.map((t) => (
            <div key={t.id} className="ks-card flex items-center gap-2 p-3">
              <span className="text-2xl">{t.icon}</span>
              <span className="truncate font-display text-sm font-semibold text-ks-dark">{t.name}</span>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center">
          <Link href="/tools" className="ks-btn ks-btn-ghost">
            Explore the AI toolkit →
          </Link>
        </p>
      </section>

      {/* How it works */}
      <section className="mt-12 md:mt-16">
        <SectionTitle underline="var(--color-ks-coral)">How it works 🧭</SectionTitle>
        <div className="grid gap-3 md:grid-cols-3 md:gap-5">
          {STEPS.map((s) => (
            <div key={s.n} className="ks-card flex gap-4 p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ks-blue font-display text-lg font-bold text-white">
                {s.n}
              </span>
              <div>
                <h3 className="font-display text-base font-semibold text-ks-dark">{s.title}</h3>
                <p className="mt-0.5 text-sm text-ks-ink">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-12 md:mt-16">
        <SectionTitle underline="var(--color-ks-lav)">Questions? 🙋</SectionTitle>
        <dl className="mx-auto grid max-w-3xl gap-3 md:grid-cols-2">
          {FAQS.map((f) => (
            <div key={f.q} className="ks-card p-4">
              <dt className="font-display text-base font-semibold text-ks-dark">{f.q}</dt>
              <dd className="mt-1 text-sm text-ks-ink">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Closing CTA */}
      <section className="mt-12 md:mt-16">
        <div className="ks-card relative px-6 py-8 text-center" style={{ transform: "rotate(0.6deg)" }}>
          <span className="ks-tape ks-tape-green" style={{ top: -10, left: "50%", marginLeft: -43 }} />
          <div className="flex justify-center">
            <Sunny pose="poseGrad" size={120} />
          </div>
          <h2 className="font-display text-2xl font-bold text-ks-dark md:text-3xl">
            Ready to become an AI Explorer?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-ks-ink">
            Grab your private link, pick a nickname, and clear your first hurdle in minutes.
          </p>
          <Link href="/start" className="ks-btn ks-btn-coral mt-5 text-lg">
            Start your adventure ✏️
          </Link>
          <p className="mt-3 text-xs text-ks-slate">Free · No login · Play with friends · Safe for kids</p>
        </div>
      </section>
    </main>
  );
}
