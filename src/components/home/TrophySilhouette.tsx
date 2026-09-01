import type { CSSProperties } from "react";

// A more classically-proportioned trophy silhouette (bulging cup, tapered neck, curved
// handles, two-tier base) for the "shadow passing behind" effect on the homepage — the
// generic minimal-outline Trophy icon read too flat/abstract at large size for that.
// Solid fill via currentColor, same convention as lucide icons, so the caller sets color
// through `style={{ color }}` or a text-color className.
export function TrophySilhouette({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 100 90" className={className} style={style} fill="currentColor" aria-hidden>
      {/* cup, tapered neck and stem block in one continuous silhouette */}
      <path d="M32 10 L68 10 C74 16 72 26 66 34 C62 42 58 48 54 54 L54 66 L62 66 L62 72 L38 72 L38 66 L46 66 L46 54 C42 48 38 42 34 34 C28 26 26 16 32 10 Z" />
      {/* wide foot */}
      <rect x="28" y="72" width="44" height="8" rx="2" />
      {/* left handle */}
      <path d="M30 16 C14 14 8 28 14 40 C18 47 25 50 30 48 L30 42 C26 43 21 40 19 34 C16 26 20 18 30 20 Z" />
      {/* right handle */}
      <path d="M70 16 C86 14 92 28 86 40 C82 47 75 50 70 48 L70 42 C74 43 79 40 81 34 C84 26 80 18 70 20 Z" />
    </svg>
  );
}
