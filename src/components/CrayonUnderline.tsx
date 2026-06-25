/** Hand-drawn crayon underline for headings (Sketchbook motif). */
export function CrayonUnderline({
  color = "var(--color-ks-coral)",
  width = 150,
  className,
}: {
  color?: string;
  width?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 150 10"
      width={width}
      height={(width * 10) / 150}
      className={className}
      aria-hidden="true"
      style={{ maxWidth: "100%" }}
    >
      <path
        d="M4 6C40 2 70 9 100 5 120 2 134 6 146 5"
        stroke={color}
        strokeWidth={4.8}
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
