import type { Accent } from "@/lib/content/schema";

/** CSS value for a hurdle's accent token (maps to --color-ks-*). */
export function accentColor(a: Accent): string {
  return `var(--color-ks-${a})`;
}

/** A soft tinted background derived from the accent. */
export function accentTint(a: Accent, pct = 14): string {
  return `color-mix(in srgb, var(--color-ks-${a}) ${pct}%, white)`;
}
