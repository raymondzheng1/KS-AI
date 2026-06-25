import { Arrow, C, Caption, DiagramSvg, Node } from "./kit";

/** 01 — The AI family tree: AI → ML → Deep Learning → what it powers. */
export function AiFamilyTree() {
  return (
    <DiagramSvg w={900} h={470} title="The AI family tree: AI contains Machine Learning, which contains Deep Learning, which powers computer vision, language, and generative AI">
      <Node x={350} y={14} w={200} h={56} accent="yellow" label="Artificial Intelligence" sub="(AI)" />
      <Node x={350} y={120} w={200} h={56} accent="blue" label="Machine Learning" sub="(ML)" />
      <Node x={350} y={226} w={200} h={52} accent="green" label="Deep Learning" />
      <Arrow x1={450} y1={70} x2={450} y2={118} accent="yellow" />
      <Arrow x1={450} y1={176} x2={450} y2={224} accent="blue" />

      {/* right-side captions */}
      <Caption x={576} y={46} text="the big umbrella" />
      <Caption x={576} y={152} text="learns from examples" />
      <Caption x={576} y={258} text="brain-like networks" />

      {/* what deep learning powers */}
      <Arrow x1={420} y1={290} x2={150} y2={348} accent="coral" />
      <Arrow x1={450} y1={290} x2={450} y2={348} accent="orange" />
      <Arrow x1={480} y1={290} x2={760} y2={348} accent="lav" />
      <Node x={30} y={350} w={220} h={72} accent="coral" label="Computer Vision" emoji="👁️" />
      <Node x={340} y={350} w={220} h={72} accent="orange" label="Understands Language" emoji="💬" fontSize={14} />
      <Node x={650} y={350} w={220} h={72} accent="lav" label="Generative AI" emoji="✨" />
      <text x={450} y={448} textAnchor="middle" fontSize={13} fill={C.slate}>
        All the AI you use today is “Narrow AI” — brilliant at one job each.
      </text>
    </DiagramSvg>
  );
}

/** 02 — The machine-learning training loop. */
export function MlLoop() {
  return (
    <DiagramSvg w={820} h={520} title="The machine learning loop: collect examples, train the model, make predictions, check and improve, then repeat">
      <Node x={300} y={20} w={220} h={66} accent="blue" label="Collect examples" emoji="📊" fontSize={15} />
      <Node x={560} y={210} w={220} h={66} accent="green" label="Train the model" emoji="🏋️" fontSize={15} />
      <Node x={300} y={400} w={220} h={66} accent="orange" label="Make a guess" emoji="🔮" fontSize={15} />
      <Node x={40} y={210} w={220} h={66} accent="coral" label="Check & improve" emoji="✅" fontSize={15} />

      <Arrow x1={520} y1={70} x2={612} y2={206} accent="blue" />
      <Arrow x1={650} y1={280} x2={470} y2={398} accent="green" />
      <Arrow x1={300} y1={448} x2={170} y2={282} accent="orange" />
      <Arrow x1={210} y1={206} x2={355} y2={86} accent="coral" />

      <text x={410} y={250} textAnchor="middle" fontSize={26} fontWeight={700} fill={C.dark}>
        🔁
      </text>
      <text x={410} y={284} textAnchor="middle" fontSize={15} fontWeight={700} fill={C.dark}>
        repeat &amp;
      </text>
      <text x={410} y={304} textAnchor="middle" fontSize={15} fontWeight={700} fill={C.dark}>
        get smarter
      </text>
      <text x={410} y={502} textAnchor="middle" fontSize={13} fill={C.slate}>
        More good examples → smarter guesses.
      </text>
    </DiagramSvg>
  );
}

/** 03 — Prompt anatomy: the R-C-T-F-C framework. */
export function PromptAnatomy() {
  const rows: Array<{ letter: string; name: string; ex: string; accent: "blue" | "green" | "orange" | "coral" | "lav" }> = [
    { letter: "R", name: "Role", ex: "“You are an expert marine biologist…”", accent: "blue" },
    { letter: "C", name: "Context", ex: "“I'm a 12-year-old doing a school project…”", accent: "green" },
    { letter: "T", name: "Task", ex: "“Explain how warming oceans bleach coral…”", accent: "orange" },
    { letter: "F", name: "Format", ex: "“…in 3 short paragraphs with a bullet summary.”", accent: "coral" },
    { letter: "C", name: "Constraints", ex: "“…avoid jargon. Only facts I can check.”", accent: "lav" },
  ];
  return (
    <DiagramSvg w={900} h={500} title="A great prompt has five parts: Role, Context, Task, Format, Constraints">
      <text x={450} y={28} textAnchor="middle" fontSize={17} fontWeight={700} fill={C.dark}>
        A great prompt has 5 parts
      </text>
      {rows.map((r, i) => {
        const y = 50 + i * 88;
        return (
          <g key={i}>
            <RowBar x={40} y={y} w={820} h={72} accent={r.accent} />
            <circle cx={96} cy={y + 36} r={26} fill={accentColorOf(r.accent)} />
            <text x={96} y={y + 44} textAnchor="middle" fontSize={24} fontWeight={700} fill="#fff">
              {r.letter}
            </text>
            <text x={148} y={y + 32} fontSize={17} fontWeight={700} fill={C.dark}>
              {r.name}
            </text>
            <text x={148} y={y + 56} fontSize={13.5} fill={C.slate}>
              {r.ex}
            </text>
          </g>
        );
      })}
    </DiagramSvg>
  );
}

function accentColorOf(a: "blue" | "green" | "orange" | "coral" | "lav"): string {
  return { blue: C.blue, green: C.green, orange: C.orange, coral: C.coral, lav: C.lav }[a];
}
function accentDarkOf(a: "blue" | "green" | "orange" | "coral" | "lav"): string {
  return { blue: C.dark, green: C.greenD, orange: C.orangeD, coral: C.coralD, lav: C.lavD }[a];
}

/** A candy bar used by the prompt rows (fill white, coloured border + base). */
function RowBar({ x, y, w, h, accent }: { x: number; y: number; w: number; h: number; accent: "blue" | "green" | "orange" | "coral" | "lav" }) {
  return (
    <g>
      <rect x={x} y={y + 4} width={w} height={h} rx={16} fill={accentDarkOf(accent)} opacity={0.9} />
      <rect x={x} y={y} width={w} height={h} rx={16} fill="#fff" stroke={accentColorOf(accent)} strokeWidth={2.5} />
    </g>
  );
}
