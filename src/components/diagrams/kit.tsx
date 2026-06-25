/**
 * Shared building blocks for the themed "Sketchbook" lesson diagrams — crisp
 * inline SVGs in the KidSmart palette (candy cards, dashed kraft connectors,
 * Fredoka labels). Each diagram composes these primitives for a consistent look.
 */
import type { ReactNode } from "react";

export const C = {
  yellow: "#FFD135",
  yellowD: "#F2B705",
  blue: "#4B9FD4",
  dark: "#2E6FA3",
  green: "#6DBE47",
  greenD: "#4e9a2f",
  orange: "#F5A623",
  orangeD: "#cf8a12",
  coral: "#E85C3A",
  coralD: "#c0492c",
  lav: "#8E9BE0",
  lavD: "#6E7CCB",
  cream: "#FFF8E8",
  ink: "#444444",
  slate: "#7E92A6",
  kraft: "#C7A86A",
} as const;

export type Accent = { c: string; d: string };
export const ACCENTS: Record<string, Accent> = {
  yellow: { c: C.yellow, d: C.yellowD },
  blue: { c: C.blue, d: C.dark },
  green: { c: C.green, d: C.greenD },
  orange: { c: C.orange, d: C.orangeD },
  coral: { c: C.coral, d: C.coralD },
  lav: { c: C.lav, d: C.lavD },
};

/** Responsive SVG frame: matched font, dashed-arrow markers, viewBox aspect. */
export function DiagramSvg({
  w,
  h,
  title,
  children,
}: {
  w: number;
  h: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={title}
      width="100%"
      height="auto"
      style={{
        display: "block",
        fontFamily: "var(--font-fredoka), ui-rounded, system-ui, sans-serif",
      }}
    >
      <defs>
        {Object.entries(ACCENTS).map(([k, a]) => (
          <marker
            key={k}
            id={`arrow-${k}`}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M1 1 L9 5 L1 9 z" fill={a.c} />
          </marker>
        ))}
      </defs>
      {children}
    </svg>
  );
}

/** A candy card (rounded rect with a solid bottom offset) + centered label. */
export function Node({
  x,
  y,
  w,
  h,
  accent = "blue",
  label,
  sub,
  fontSize = 15,
  emoji,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  accent?: keyof typeof ACCENTS;
  label: string;
  sub?: string;
  fontSize?: number;
  emoji?: string;
}) {
  const a = ACCENTS[accent];
  const cx = x + w / 2;
  const cy = y + h / 2;
  const labelDy = sub ? -5 : emoji ? 8 : 5;
  return (
    <g>
      <rect x={x} y={y + 4} width={w} height={h} rx={14} fill={a.d} opacity={0.95} />
      <rect x={x} y={y} width={w} height={h} rx={14} fill="#fff" stroke={a.c} strokeWidth={2.5} />
      {emoji && (
        <text x={cx} y={y + h / 2 - 8} textAnchor="middle" fontSize={fontSize + 6}>
          {emoji}
        </text>
      )}
      <text x={cx} y={cy + labelDy} textAnchor="middle" fontWeight={700} fontSize={fontSize} fill={C.dark}>
        {label}
      </text>
      {sub && (
        <text x={cx} y={cy + 13} textAnchor="middle" fontSize={fontSize - 4} fill={C.slate}>
          {sub}
        </text>
      )}
    </g>
  );
}

/** Dashed connector with an arrowhead in the given accent colour. */
export function Arrow({
  x1,
  y1,
  x2,
  y2,
  accent = "blue",
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  accent?: keyof typeof ACCENTS;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={ACCENTS[accent].c}
      strokeWidth={2.5}
      strokeDasharray="2 6"
      strokeLinecap="round"
      markerEnd={`url(#arrow-${accent})`}
    />
  );
}

/** Plain dashed line (no arrowhead). */
export function DashLine({
  x1,
  y1,
  x2,
  y2,
  color = C.kraft,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
}) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={2.5} strokeDasharray="2 6" strokeLinecap="round" />
  );
}

/** Diagram caption text. */
export function Caption({ x, y, text, anchor = "start" }: { x: number; y: number; text: string; anchor?: "start" | "middle" | "end" }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={12.5} fill={C.slate}>
      {text}
    </text>
  );
}
