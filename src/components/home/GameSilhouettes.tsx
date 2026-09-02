import { useId, type CSSProperties } from "react";

// Bigger, single-color "shadow" shapes for the homepage's floating game texture —
// a companion to TrophySilhouette. GameThumbs.tsx's board icons are built as small,
// dark-boxed app-tile previews (each has its own rounded-square background), so they
// read as tiny app icons rather than shapes when scattered large and faint behind
// content. These have no box: just a solid currentColor silhouette, so they scale up
// cleanly and read at a glance even at low opacity. Same convention as TrophySilhouette:
// color comes from the caller via `style={{ color }}` or a text-color className.

type SilhouetteProps = { className?: string; style?: CSSProperties };

export function ChessPieceSilhouette({ className, style }: SilhouetteProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} fill="currentColor" aria-hidden>
      {/* cross */}
      <rect x="45" y="2" width="10" height="14" rx="2" />
      <rect x="38" y="7" width="24" height="7" rx="2" />
      {/* crown / head */}
      <circle cx="50" cy="30" r="12" />
      {/* collar flare */}
      <path d="M40 42 L60 42 L65 52 L35 52 Z" />
      {/* robe tapering to the base */}
      <path d="M36 52 C34 62 29 74 25 86 C24 90 27 94 31 94 L69 94 C73 94 76 90 75 86 C71 74 66 62 64 52 Z" />
      {/* plinth */}
      <rect x="18" y="94" width="64" height="6" rx="2" />
    </svg>
  );
}

export function CardsSilhouette({ className, style }: SilhouetteProps) {
  // Back card (copas/hearts): a heart punched out as an ordinary hole in that card's own
  // path (fillRule="evenodd"), nested inside its own rotate group so the hole rotates
  // together with the card and always lines up — the reliable original approach.
  //
  // Front card (ouros/diamonds): the diamond instead comes from a <mask> over the
  // *whole* two-card group. A hole cut into just the front card's own path only reveals
  // what's transparent in that one path — so anywhere the diamond reached into the zone
  // where the two fanned cards overlap, it exposed the back card's solid fill sitting
  // behind it instead of true empty space, reading as "cut off." A mask over the
  // composited group instead punches through both cards as a single flat shape, which
  // is what lets this diamond run large and even cross into the overlap and still
  // always reveal clean transparency. It's tilted to match the front card's own -12°
  // angle so it reads as following the card rather than sitting perfectly upright.
  const maskId = useId();
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} fill="currentColor" aria-hidden>
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
          <rect x="0" y="0" width="100" height="100" fill="white" />
          <g transform="rotate(-12 37 53)">
            <path d="M37,36 L51,53 L37,70 L23,53 Z" fill="black" />
          </g>
        </mask>
      </defs>
      <g mask={`url(#${maskId})`}>
        <g transform="rotate(14 62 55)">
          <path
            fillRule="evenodd"
            d="M47,16 H79 A7,7 0 0 1 86,23 V75 A7,7 0 0 1 79,82 H47 A7,7 0 0 1 40,75 V23 A7,7 0 0 1 47,16 Z
               M63,43.8 C60.4,36 47.4,36 47.4,46.4 C47.4,56.8 57.8,62 63,69.8
               C68.2,62 78.6,56.8 78.6,46.4 C78.6,36 65.6,36 63,43.8 Z"
          />
        </g>
        <g transform="rotate(-12 40 58)">
          <rect x="14" y="20" width="46" height="66" rx="7" />
        </g>
      </g>
    </svg>
  );
}

export function DominoSilhouette({ className, style }: SilhouetteProps) {
  // A tile split by a center divider — 4 pips (one in each corner) on the left half, 6
  // pips on the right laid out as 3 columns of 2 (running lengthwise toward the tile's
  // end edge, not stacked in tall columns) so the two halves read as differently
  // patterned instead of the 6-side looking like a rotated copy of the 4-side. No
  // internal rotate on the tile itself (unlike the other silhouettes here): with one,
  // "left" and "right" in this file's own coordinates stop matching what actually ends
  // up on the left/right of the rendered piece once the wrapper's own tilt is layered
  // on top — exactly what made the pip sides read as swapped even after correcting
  // them here.
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        d="M18,32 H82 A8,8 0 0 1 90,40 V60 A8,8 0 0 1 82,68 H18 A8,8 0 0 1 10,60 V40 A8,8 0 0 1 18,32 Z
           M49,34 h2 v32 h-2 Z
           M25.8,41 a3.8,3.8 0 1,0 -7.6,0 a3.8,3.8 0 1,0 7.6,0 Z
           M41.8,41 a3.8,3.8 0 1,0 -7.6,0 a3.8,3.8 0 1,0 7.6,0 Z
           M25.8,59 a3.8,3.8 0 1,0 -7.6,0 a3.8,3.8 0 1,0 7.6,0 Z
           M41.8,59 a3.8,3.8 0 1,0 -7.6,0 a3.8,3.8 0 1,0 7.6,0 Z
           M66.8,44 a3.8,3.8 0 1,0 -7.6,0 a3.8,3.8 0 1,0 7.6,0 Z
           M75.8,44 a3.8,3.8 0 1,0 -7.6,0 a3.8,3.8 0 1,0 7.6,0 Z
           M84.8,44 a3.8,3.8 0 1,0 -7.6,0 a3.8,3.8 0 1,0 7.6,0 Z
           M66.8,56 a3.8,3.8 0 1,0 -7.6,0 a3.8,3.8 0 1,0 7.6,0 Z
           M75.8,56 a3.8,3.8 0 1,0 -7.6,0 a3.8,3.8 0 1,0 7.6,0 Z
           M84.8,56 a3.8,3.8 0 1,0 -7.6,0 a3.8,3.8 0 1,0 7.6,0 Z"
      />
    </svg>
  );
}

export function ControllerSilhouette({ className, style }: SilhouetteProps) {
  // Gamepad body with the d-pad cross and two face buttons punched out the same way.
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        d="M30,30 H70 C86,30 96,42 96,58 C96,70 88,80 78,80 C71,80 67,75 62,68 C59,64 56,62 50,62 C44,62 41,64 38,68 C33,75 29,80 22,80 C12,80 4,70 4,58 C4,42 14,30 30,30 Z
           M16,52 h16 v6 h-16 Z
           M21,47 h6 v16 h-6 Z
           M75,48 a5,5 0 1,0 -10,0 a5,5 0 1,0 10,0 Z
           M87,60 a5,5 0 1,0 -10,0 a5,5 0 1,0 10,0 Z"
      />
    </svg>
  );
}
