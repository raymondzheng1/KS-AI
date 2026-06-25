import type { Concept, ContentTable } from "@/lib/content/schema";

export function DataTable({ table }: { table: ContentTable }) {
  return (
    <div className="my-3 overflow-x-auto">
      {table.caption && (
        <p className="mb-1 text-sm font-bold text-ks-dark">{table.caption}</p>
      )}
      <table className="w-full border-collapse overflow-hidden rounded-xl text-sm">
        <thead>
          <tr>
            {table.columns.map((c, i) => (
              <th
                key={i}
                className="bg-ks-blue px-3 py-2 text-left font-bold text-white"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, r) => (
            <tr key={r} className={r % 2 ? "bg-white" : "bg-ks-cream"}>
              {row.map((cell, c) => (
                <td key={c} className="border-t border-ks-dark/10 px-3 py-2 align-top text-ks-ink">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const CALLOUT_STYLE = {
  insight: { bg: "var(--color-ks-cream)", border: "var(--color-ks-orange)", icon: "💡", label: "Key Insight" },
  warning: { bg: "color-mix(in srgb, var(--color-ks-coral) 12%, white)", border: "var(--color-ks-coral)", icon: "⚠️", label: "Watch Out" },
  rule: { bg: "color-mix(in srgb, var(--color-ks-green) 12%, white)", border: "var(--color-ks-green)", icon: "✅", label: "Golden Rule" },
} as const;

export function Callout({
  kind,
  text,
}: {
  kind: "insight" | "warning" | "rule";
  text: string[];
}) {
  const s = CALLOUT_STYLE[kind];
  return (
    <div
      className="my-3 rounded-2xl border-l-4 p-4"
      style={{ background: s.bg, borderColor: s.border }}
    >
      <p className="mb-1 font-bold text-ks-dark">
        {s.icon} {s.label}
      </p>
      <ul className="ml-1 space-y-1">
        {text.map((t, i) => (
          <li key={i} className="text-sm text-ks-ink">
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ConceptBlock({ concept, index }: { concept: Concept; index: number }) {
  return (
    <section className="mb-6">
      <h3 className="mb-2 flex items-center gap-2 text-xl font-bold text-ks-dark">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ks-blue text-sm font-extrabold text-white">
          {index + 1}
        </span>
        {concept.heading}
      </h3>
      {concept.body.map((p, i) => (
        <p key={i} className="mb-2 text-pretty text-ks-ink">
          {p}
        </p>
      ))}
      {concept.bullets.length > 0 && (
        <ul className="my-2 ml-5 list-disc space-y-1">
          {concept.bullets.map((b, i) => (
            <li key={i} className="text-ks-ink">
              {b}
            </li>
          ))}
        </ul>
      )}
      {concept.table && <DataTable table={concept.table} />}
      {concept.callout && <Callout kind={concept.callout.kind} text={concept.callout.text} />}
    </section>
  );
}
