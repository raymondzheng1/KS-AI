import { ACCENTS, Arrow, C, DiagramSvg, Node } from "./kit";

/** 04 — How computer vision works (a CNN), step by step. */
export function CnnArchitecture() {
  return (
    <DiagramSvg w={960} h={300} title="Computer vision: a photo goes through layers that find edges, combine clues, and guess what it sees">
      {/* faint stacked layers behind the middle two nodes */}
      {[270, 510].map((bx) => (
        <g key={bx} opacity={0.5}>
          <rect x={bx + 14} y={104} width={200} height={96} rx={14} fill="#fff" stroke={C.kraft} strokeWidth={2} strokeDasharray="3 5" />
          <rect x={bx + 7} y={100} width={200} height={96} rx={14} fill="#fff" stroke={C.kraft} strokeWidth={2} strokeDasharray="3 5" />
        </g>
      ))}
      <Node x={20} y={96} w={200} h={96} accent="blue" label="A photo" emoji="📷" />
      <Node x={260} y={96} w={200} h={96} accent="green" label="Find edges & shapes" emoji="🔍" fontSize={14} />
      <Node x={500} y={96} w={200} h={96} accent="orange" label="Combine the clues" emoji="🧩" fontSize={14} />
      <Node x={740} y={96} w={200} h={96} accent="coral" label="“It's a cat!”" emoji="✅" />
      <Arrow x1={220} y1={144} x2={258} y2={144} accent="blue" />
      <Arrow x1={460} y1={144} x2={498} y2={144} accent="green" />
      <Arrow x1={700} y1={144} x2={738} y2={144} accent="orange" />
      <text x={480} y={250} textAnchor="middle" fontSize={13.5} fill={C.slate}>
        This is a neural network — it builds up understanding layer by layer.
      </text>
    </DiagramSvg>
  );
}

/** 05 — The four kinds of bias in AI. */
export function BiasTypes() {
  const cards: Array<{ title: string; lines: string[]; accent: keyof typeof ACCENTS }> = [
    { title: "Historical bias", lines: ["Trained on the past, so it repeats old unfairness.", "Hiring AI trained on mostly-male staff preferred men."], accent: "coral" },
    { title: "Representation bias", lines: ["Some groups are missing from the data.", "Face ID trained on light skin works worse on dark skin."], accent: "blue" },
    { title: "Measurement bias", lines: ["The data doesn't match real life.", "Using arrests for “crime” — biased policing skews it."], accent: "orange" },
    { title: "Aggregation bias", lines: ["One model for everyone, when groups differ.", "Medical AI on “average” data can miss women's symptoms."], accent: "lav" },
  ];
  const pos = [
    { x: 30, y: 18 },
    { x: 460, y: 18 },
    { x: 30, y: 222 },
    { x: 460, y: 222 },
  ];
  const w = 410;
  const h = 186;
  return (
    <DiagramSvg w={900} h={428} title="Four kinds of AI bias: historical, representation, measurement, and aggregation">
      {cards.map((card, i) => {
        const p = pos[i];
        const a = ACCENTS[card.accent];
        return (
          <g key={i}>
            <rect x={p.x} y={p.y + 4} width={w} height={h} rx={18} fill={a.d} opacity={0.9} />
            <rect x={p.x} y={p.y} width={w} height={h} rx={18} fill="#fff" stroke={a.c} strokeWidth={2.5} />
            <rect x={p.x} y={p.y} width={10} height={h} rx={5} fill={a.c} />
            <text x={p.x + 26} y={p.y + 42} fontSize={19} fontWeight={700} fill={C.dark}>
              {card.title}
            </text>
            <text x={p.x + 26} y={p.y + 78} fontSize={14} fontWeight={700} fill={a.c}>
              {card.lines[0]}
            </text>
            <text x={p.x + 26} y={p.y + 120} fontSize={13.5} fill={C.slate}>
              <tspan x={p.x + 26}>{card.lines[1].slice(0, 44)}</tspan>
              <tspan x={p.x + 26} dy={20}>
                {card.lines[1].slice(44)}
              </tspan>
            </text>
          </g>
        );
      })}
    </DiagramSvg>
  );
}

/** 06 — Generative AI (diffusion): random noise cleaned up into a picture. */
const NOISE = [
  [18, 22], [44, 60], [70, 30], [110, 48], [130, 96], [26, 110], [88, 120], [58, 90],
  [120, 18], [96, 70], [34, 78], [142, 64], [16, 50], [76, 16], [104, 132], [50, 134],
  [132, 124], [22, 88], [66, 52], [114, 110], [40, 36], [90, 100], [10, 130], [146, 100],
];
function NoiseTile({ x, y, count, star }: { x: number; y: number; count: number; star: number }) {
  return (
    <g>
      <rect x={x} y={y} width={150} height={150} rx={16} fill={C.cream} stroke={C.kraft} strokeWidth={2.5} strokeDasharray="3 6" />
      {NOISE.slice(0, count).map(([dx, dy], k) => (
        <circle key={k} cx={x + dx} cy={y + dy} r={2.6} fill={C.slate} opacity={0.6} />
      ))}
      {star > 0 && (
        <text x={x + 75} y={y + 96} textAnchor="middle" fontSize={64 * star} opacity={star} >
          ⭐
        </text>
      )}
    </g>
  );
}
export function Diffusion() {
  const xs = [20, 210, 400, 590, 780];
  return (
    <DiagramSvg w={940} h={300} title="Generative AI starts with random noise and removes it step by step to create a new picture">
      <text x={470} y={28} textAnchor="middle" fontSize={16} fontWeight={700} fill={C.dark}>
        From random noise → a brand-new picture ✨
      </text>
      <NoiseTile x={xs[0]} y={56} count={24} star={0} />
      <NoiseTile x={xs[1]} y={56} count={16} star={0.35} />
      <NoiseTile x={xs[2]} y={56} count={9} star={0.6} />
      <NoiseTile x={xs[3]} y={56} count={3} star={0.85} />
      <NoiseTile x={xs[4]} y={56} count={0} star={1} />
      {xs.slice(0, 4).map((x, i) => (
        <Arrow key={i} x1={x + 152} y1={131} x2={x + 188} y2={131} accent="lav" />
      ))}
      <text x={470} y={250} textAnchor="middle" fontSize={13.5} fill={C.slate}>
        Each step the AI guesses what the noise is hiding, until a clear image appears.
      </text>
    </DiagramSvg>
  );
}
