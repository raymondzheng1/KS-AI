import Link from "next/link";
import { Sunny } from "./Sunny";

/**
 * Shared closing call-to-action used at the foot of the informational pages so
 * a student can jump straight into the adventure after reading.
 */
export function StartCta({
  title = "Ready to start your adventure?",
  subtitle = "Pick a fun nickname and clear your first AI hurdle in minutes.",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="mt-12">
      <div
        className="ks-card relative px-6 py-8 text-center"
        style={{ transform: "rotate(-0.5deg)" }}
      >
        <span className="ks-tape ks-tape-green" style={{ top: -10, left: "50%", marginLeft: -43 }} />
        <div className="flex justify-center">
          <Sunny pose="poseCheer" size={92} bob />
        </div>
        <h2 className="font-display text-2xl font-bold text-ks-dark">{title}</h2>
        <p className="mx-auto mt-2 max-w-md text-ks-ink">{subtitle}</p>
        <Link href="/start" className="ks-btn ks-btn-coral mt-5 text-lg">
          Start your adventure ✏️
        </Link>
        <p className="mt-3 text-xs text-ks-slate">Free · No login · Play with friends · Safe for kids</p>
      </div>
    </section>
  );
}
