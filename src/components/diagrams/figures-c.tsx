import { ACCENTS, Arrow, C, DashLine, DiagramSvg, Node } from "./kit";

/** 07 — Design Thinking: the five stages (an iterative loop). */
export function DesignThinking() {
  const stages: Array<{ n: number; emoji: string; name: string; accent: keyof typeof ACCENTS }> = [
    { n: 1, emoji: "💛", name: "Empathise", accent: "blue" },
    { n: 2, emoji: "🎯", name: "Define", accent: "green" },
    { n: 3, emoji: "💡", name: "Ideate", accent: "orange" },
    { n: 4, emoji: "🔨", name: "Prototype", accent: "coral" },
    { n: 5, emoji: "🧪", name: "Test", accent: "lav" },
  ];
  const w = 160;
  const h = 104;
  const y = 86;
  const xs = [20, 205, 390, 575, 760];
  return (
    <DiagramSvg w={940} h={300} title="Design thinking has five stages: empathise, define, ideate, prototype, test — then repeat">
      <text x={470} y={30} textAnchor="middle" fontSize={17} fontWeight={700} fill={C.dark}>
        Design Thinking — 5 stages 🛠️
      </text>
      {stages.map((s, i) => {
        const x = xs[i];
        return (
          <g key={i}>
            <Node x={x} y={y} w={w} h={h} accent={s.accent} label={s.name} emoji={s.emoji} fontSize={15} />
            <circle cx={x + 20} cy={y + 20} r={15} fill={ACCENTS[s.accent].c} />
            <text x={x + 20} y={y + 25} textAnchor="middle" fontSize={15} fontWeight={700} fill="#fff">
              {s.n}
            </text>
            {i < stages.length - 1 && <Arrow x1={x + w} y1={y + h / 2} x2={xs[i + 1]} y2={y + h / 2} accent={s.accent} />}
          </g>
        );
      })}
      {/* iterate-back loop */}
      <path d="M 840 200 C 840 250, 100 250, 100 200" fill="none" stroke={C.kraft} strokeWidth={2.5} strokeDasharray="2 6" strokeLinecap="round" markerEnd="url(#arrow-blue)" />
      <text x={470} y={252} textAnchor="middle" fontSize={13.5} fill={C.slate}>
        …then repeat &amp; improve 🔁
      </text>
    </DiagramSvg>
  );
}

/** 08 — Course mind map: KidSmart AI → four pillars → topics. */
export function CourseMindMap() {
  const branches: Array<{ x: number; emoji: string; title: string; accent: keyof typeof ACCENTS; leaves: string[] }> = [
    { x: 14, emoji: "🧠", title: "Understand AI", accent: "blue", leaves: ["What is AI?", "How AI learns", "Computer vision"] },
    { x: 240, emoji: "🛠️", title: "Use AI Tools", accent: "green", leaves: ["Prompting", "Claude & Copilot", "Teachable Machine", "Firefly & Suno"] },
    { x: 466, emoji: "⚖️", title: "Use AI Fairly", accent: "coral", leaves: ["Bias", "Deepfakes", "AI ethics"] },
    { x: 692, emoji: "🚀", title: "Create & Build", accent: "orange", leaves: ["Creativity", "Design thinking", "Build your project", "Demo Day"] },
  ];
  const bw = 200;
  const by = 156;
  return (
    <DiagramSvg w={900} h={520} title="Course mind map: the KidSmart AI programme covers four pillars — understand AI, use AI tools, use AI fairly, and create and build">
      <Node x={340} y={20} w={220} h={64} accent="yellow" label="KidSmart AI" emoji="🤖" fontSize={17} />
      {branches.map((b, i) => {
        const cx = b.x + bw / 2;
        const a = ACCENTS[b.accent];
        return (
          <g key={i}>
            <DashLine x1={450} y1={84} x2={cx} y2={by} color={a.c} />
            <Node x={b.x} y={by} w={bw} h={58} accent={b.accent} label={b.title} emoji={b.emoji} fontSize={14} />
            {b.leaves.map((leaf, k) => {
              const ly = by + 92 + k * 40;
              return (
                <g key={k}>
                  <rect x={b.x + 10} y={ly} width={bw - 20} height={30} rx={15} fill="#fff" stroke={a.c} strokeWidth={2} />
                  <text x={cx} y={ly + 20} textAnchor="middle" fontSize={12.5} fontWeight={600} fill={C.dark}>
                    {leaf}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}
    </DiagramSvg>
  );
}

/** 09 — The Claude Code loop: a build-with-AI teammate cycle. */
export function ClaudeCodeLoop() {
  return (
    <DiagramSvg w={820} h={500} title="The Claude Code loop: tell it your goal, it writes code, run and test, refine together, then repeat">
      <Node x={300} y={20} w={220} h={66} accent="blue" label="Tell it your goal" emoji="💬" fontSize={15} />
      <Node x={560} y={210} w={220} h={66} accent="green" label="It writes code" emoji="🛠️" fontSize={15} />
      <Node x={300} y={400} w={220} h={66} accent="orange" label="Run &amp; test" emoji="▶️" fontSize={15} />
      <Node x={40} y={210} w={220} h={66} accent="coral" label="Refine together" emoji="🔁" fontSize={15} />
      <Arrow x1={520} y1={70} x2={612} y2={206} accent="blue" />
      <Arrow x1={650} y1={280} x2={470} y2={398} accent="green" />
      <Arrow x1={300} y1={448} x2={170} y2={282} accent="orange" />
      <Arrow x1={210} y1={206} x2={355} y2={86} accent="coral" />
      <text x={410} y={250} textAnchor="middle" fontSize={26}>🤝</text>
      <text x={410} y={284} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.dark}>you steer,</text>
      <text x={410} y={304} textAnchor="middle" fontSize={14} fontWeight={700} fill={C.dark}>it builds</text>
      <text x={410} y={486} textAnchor="middle" fontSize={13} fill={C.slate}>
        Claude Code is a teammate, not a shortcut.
      </text>
    </DiagramSvg>
  );
}
