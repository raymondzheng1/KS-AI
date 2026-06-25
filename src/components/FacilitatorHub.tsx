import Link from "next/link";
import { FacilitatorForm } from "@/components/FacilitatorForm";
import { SiteHeader } from "@/components/SiteHeader";
import { DataTable } from "@/components/game/ContentBlocks";
import { HURDLES } from "@/lib/content";

/**
 * Facilitator Hub — the consolidated "teacher pack" shown on /facilitator once
 * the passcode is entered. Pulls every gated block from all 10 hurdles into one
 * place: the run-of-show schedule, run guides / answer keys, the gate-quiz
 * answer keys, and a link to track a class on the room leaderboard.
 * Server-rendered; collapsibles use native <details> (no JS).
 */
export function FacilitatorHub() {
  return (
    <main className="mx-auto max-w-4xl px-5 pb-20 pt-[max(1rem,env(safe-area-inset-top))]">
      <SiteHeader />

      <h1 className="mt-4 font-display text-3xl font-bold text-ks-dark">👩‍🏫 Facilitator Hub</h1>
      <p className="mt-2 max-w-2xl text-ks-ink">
        Everything you need to run the 2-week program with a class or club — the daily schedule,
        run guides, and answer keys, all in one place.
      </p>

      <div className="mt-5">
        <FacilitatorForm active />
      </div>

      {/* Program at a glance */}
      <section className="mt-8">
        <h2 className="mb-3 font-display text-xl font-bold text-ks-dark">📅 Program at a glance</h2>
        <div className="ks-card overflow-hidden">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="bg-ks-blue px-3 py-2 text-left font-bold text-white">Day</th>
                <th className="bg-ks-blue px-3 py-2 text-left font-bold text-white">Hurdle</th>
                <th className="hidden bg-ks-blue px-3 py-2 text-left font-bold text-white sm:table-cell">Focus</th>
              </tr>
            </thead>
            <tbody>
              {HURDLES.map((h, i) => (
                <tr key={h.id} className={i % 2 ? "bg-white" : "bg-ks-cream"}>
                  <td className="border-t border-ks-dark/10 px-3 py-2 font-bold text-ks-dark">{h.day}</td>
                  <td className="border-t border-ks-dark/10 px-3 py-2 text-ks-ink">
                    {h.icon} {h.title}
                  </td>
                  <td className="hidden border-t border-ks-dark/10 px-3 py-2 text-ks-ink-soft sm:table-cell">
                    {h.subtitle}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Track a class */}
      <section className="mt-8">
        <h2 className="mb-3 font-display text-xl font-bold text-ks-dark">🏆 Track your class</h2>
        <div className="ks-card p-5">
          <p className="text-ks-ink">
            Create a <strong>room</strong> for your class, share the invite link or QR code, and
            watch everyone&apos;s progress on the room leaderboard. Open it any time at{" "}
            <span className="font-mono text-ks-dark">/room/&lt;your-room-code&gt;</span>.
          </p>
          <Link href="/start" className="ks-btn ks-btn-green mt-3">
            Create a class room →
          </Link>
        </div>
      </section>

      {/* Per-day packs */}
      <section className="mt-8">
        <h2 className="mb-3 font-display text-xl font-bold text-ks-dark">📖 Daily facilitator packs</h2>
        <div className="flex flex-col gap-2.5">
          {HURDLES.map((h) => {
            const activityNotes = h.activities.filter((a) => a.facilitator.length > 0);
            return (
              <details key={h.id} className="ks-card overflow-hidden p-0">
                <summary className="flex cursor-pointer items-center gap-3 p-4 font-display font-semibold text-ks-dark">
                  <span className="text-xl">{h.icon}</span>
                  <span>
                    Day {h.day} · {h.title}
                  </span>
                </summary>
                <div className="border-t border-ks-kraft/40 p-4">
                  {/* Facilitator blocks: schedule, guides, cases, rubric, checklist */}
                  {h.facilitator.map((b, k) => (
                    <div key={k} className="mb-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-ks-green">{b.kind}</p>
                      <h3 className="mb-1 font-bold text-ks-dark">{b.heading}</h3>
                      {b.body.map((p, j) => (
                        <p key={j} className="mb-1 text-sm text-ks-ink">{p}</p>
                      ))}
                      {b.table && <DataTable table={b.table} />}
                    </div>
                  ))}

                  {/* Activity run-notes */}
                  {activityNotes.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-bold uppercase tracking-wide text-ks-green">Activity run notes</p>
                      {activityNotes.map((a, k) => (
                        <div key={k} className="mt-1">
                          <h3 className="font-bold text-ks-dark">{a.name}</h3>
                          <ul className="ml-4 list-disc text-sm text-ks-ink">
                            {a.facilitator.map((f, j) => (
                              <li key={j}>{f}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Gate-quiz answer key */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-ks-coral">Gate-quiz answer key</p>
                    <ol className="mt-1 ml-4 list-decimal space-y-2 text-sm text-ks-ink">
                      {h.quiz.map((q, k) => (
                        <li key={k}>
                          <span className="font-semibold text-ks-dark">{q.q}</span>
                          <br />
                          <span className="text-ks-green">✓ {q.options[q.answer]}</span>
                          {q.explain && <span className="text-ks-ink-soft"> — {q.explain}</span>}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      </section>
    </main>
  );
}
