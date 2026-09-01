import { motion } from "framer-motion";

// Gives each homepage section its own background "mood" instead of every section reusing
// the same grid pattern — the thing that makes a page feel like distinct, purpose-built
// sections instead of one long scroll. Three lightweight variants, each tinted by whatever
// accent color that section already uses, so the site's own purple/blue/gold identity does
// the work (no borrowed branding, just the structural idea: vary the backdrop, keep the motion smooth).
//
// Full-bleed on purpose: `<Section>` itself is capped at max-w-7xl and centered, so a naive
// `absolute inset-0` here would only span that narrower centered column — on a wide screen
// the effect (especially the "scan" sweep) would visibly start and stop well inside the
// screen instead of running edge to edge. `left-1/2 w-screen -translate-x-1/2` re-centers a
// full-viewport-width box regardless of the section's own width. The caller must NOT put
// `overflow-hidden` on the `<Section>` itself for this to show past its bounds — this
// component clips its own content instead.
const FULL_BLEED = "pointer-events-none absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 overflow-hidden";

type Variant = "dots" | "scan" | "vignette";

export function SectionBackdrop({
  variant,
  accent = "#8A2EFF",
}: {
  variant: Variant;
  accent?: string;
}) {
  if (variant === "dots") {
    return (
      <div aria-hidden className={FULL_BLEED}>
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(circle, color-mix(in srgb, ${accent} 70%, transparent) 1.4px, transparent 1.6px)`,
            backgroundSize: "28px 28px",
            maskImage: "radial-gradient(ellipse 45% 55% at 50% 38%, black 25%, transparent 85%)",
            WebkitMaskImage: "radial-gradient(ellipse 45% 55% at 50% 38%, black 25%, transparent 85%)",
          }}
        />
      </div>
    );
  }

  if (variant === "scan") {
    // A tilted light band sweeping past — taller than the section and rotated so the
    // extra height clears the corners once rotated, then clipped back down by the
    // wrapper's own overflow-hidden. The tilt is set via Framer Motion's own `style.rotate`
    // rather than a Tailwind `rotate-*` class: Framer writes the animated `x` straight into
    // the element's inline `transform`, which would silently wipe out a class-based rotate
    // on every frame — that fight was almost certainly what read as the band "popping" or
    // lurching up each time the sweep restarted. Keeping rotate as a motion value lets
    // Framer compose translateX + rotate into one consistent transform every frame.
    return (
      <div aria-hidden className={FULL_BLEED}>
        <motion.div
          className="absolute -top-[25%] left-0 h-[150%] w-1/4"
          style={{ rotate: -12 }}
          animate={{ x: ["-140%", "440%"] }}
          transition={{ duration: 4.6, repeat: Infinity, ease: "easeIn", repeatDelay: 1.1 }}
        >
          <div
            className="h-full w-full opacity-[0.14]"
            style={{ background: `linear-gradient(100deg, transparent, ${accent}, transparent)` }}
          />
        </motion.div>
      </div>
    );
  }

  // vignette — a big soft wash anchored high, giving the whole section a tint without a hard shape
  return (
    <div aria-hidden className={FULL_BLEED}>
      <div
        className="absolute -top-1/3 left-1/2 h-[140%] w-[60%] min-w-[700px] -translate-x-1/2 opacity-30 blur-3xl"
        style={{ background: `radial-gradient(closest-side, ${accent}, transparent 70%)` }}
      />
    </div>
  );
}
