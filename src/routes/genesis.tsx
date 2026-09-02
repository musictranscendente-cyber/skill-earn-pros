import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { GridBackground } from "@/components/Background";
import { Countdown } from "@/components/Countdown";
import { TIERS, GENESIS, tierFor, useWallet } from "@/lib/wallet";
import { WalletButton } from "@/components/WalletButton";
import { Check, Flame, Star, Shield, Award, Trophy, Gem, Clock, TrendingUp, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { useLang } from "@/lib/i18n";

/** Lets a tier card elsewhere (e.g. the homepage pricing grid) deep-link straight into
 *  that tier — /genesis?amount=500 opens the page with Gold already selected. */
type GenesisSearch = { amount?: number };

export const Route = createFileRoute("/genesis")({
  validateSearch: (search: Record<string, unknown>): GenesisSearch => {
    const n = Number(search.amount);
    return { amount: Number.isFinite(n) && n > 0 ? n : undefined };
  },
  head: () => ({
    meta: [
      { title: "Genesis Sale — PvP Pro" },
      { name: "description", content: "Reserve your founder allocation in the PvP Pro Genesis Sale. Demo flow ready to be wired to the live smart contract at TGE." },
      { property: "og:title", content: "Genesis Sale — PvP Pro" },
      { property: "og:description", content: "Reserve PVP at the genesis price and become a founder." },
      { property: "og:url", content: "/genesis" },
    ],
    links: [{ rel: "canonical", href: "/genesis" }],
  }),
  component: GenesisPage,
});

const TIER_ICONS: Record<string, LucideIcon> = {
  Starter: Star,
  Bronze: Shield,
  Silver: Award,
  Gold: Trophy,
  Diamond: Gem,
};
const POPULAR_TIER = "Gold";
const SLIDER_MIN = 10;
const SLIDER_MAX = 2000;

/** Rolling/spring-driven number — makes the "you receive" figure feel alive instead of a static label. */
function AnimatedNumber({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const mv = useMotionValue(value);
  const spring = useSpring(mv, { stiffness: 140, damping: 24, mass: 0.6 });
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    mv.set(value);
  }, [value, mv]);

  useEffect(() => spring.on("change", (v) => setDisplay(v)), [spring]);

  return <>{display.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</>;
}

function GenesisPage() {
  const { t } = useLang();
  const { address, buy } = useWallet();
  const searchParams = Route.useSearch();
  const [amount, setAmount] = useState(() => searchParams.amount ?? 500);

  // Also react to the search param changing while already on this page (e.g. clicking a
  // different tier card from another route without a full remount).
  useEffect(() => {
    if (searchParams.amount && searchParams.amount !== amount) setAmount(searchParams.amount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.amount]);
  const tier = tierFor(amount);
  const pvp = Math.floor(amount / GENESIS.price);
  const raised = 3_247_891.63;
  const pct = Math.min(100, (raised / GENESIS.hardCap) * 100);
  const TierIcon = TIER_ICONS[tier?.name ?? "Starter"] ?? Star;
  const accent = tier?.color ?? "#8A2EFF";
  /** No tier reached (below Starter's $50 minimum) → no neon at all, just a plain box. */
  const hasTier = tier !== null;
  /** Silver's flat #c0c0c0 has almost no saturation — as a solid button fill it reads as a
   *  dull, disabled grey rather than a shiny metal, so it gets a cooler gradient below. */
  const isSilver = tier?.name === "Silver";

  function submit() {
    if (!address) return toast.error(t("genesis.toast.connect"));
    buy(amount);
    toast.success(`${t("genesis.toast.reserved.prefix")} ${pvp.toLocaleString()} PVP · ${tier?.name ?? "Starter"} ${t("genesis.toast.reserved.tier")}`);
  }

  return (
    <Layout>
      <section className="relative overflow-hidden pt-12 pb-24">
        <GridBackground />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 top-32 h-96 w-96 rounded-full bg-[var(--neon-purple)]/20 blur-[120px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[var(--neon-blue)]/15 blur-[120px]"
        />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="mb-10 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/60">
              <Flame className="h-3 w-3 text-[var(--neon-purple)]" /> {t("genesis.badge")}
            </div>
            <h1 className="text-balance text-4xl font-extrabold tracking-tight md:text-6xl">
              <span className="text-silver">{t("genesis.title1")}</span> <span className="text-gradient">{t("genesis.title2")}</span>.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-white/60">
              {t("genesis.subtitle")}
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              {/* thin glow strictly around the box's edge — a separate element behind the
                  border, never wrapping/containing the card content, so it can't wash out
                  anything inside (that was the earlier "smoke" bug). Off below Starter. */}
              {hasTier && (
                <div
                  aria-hidden
                  className="absolute -inset-0.5 rounded-[1.6rem] opacity-[0.18] blur-sm transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(115deg, ${accent}, color-mix(in srgb, ${accent} 55%, white))`,
                    animation: "pvp-pulse-glow 3.5s ease-in-out infinite",
                  }}
                />
              )}
              {/* border — flowing tier-colored gradient once a tier is reached, plain neutral otherwise. */}
              <div
                className="relative overflow-hidden rounded-3xl p-[2px] transition-[background] duration-500"
                style={
                  hasTier
                    ? {
                        // Alpha baked into each color stop (not into this element's own
                        // opacity) — that keeps the fade on the border ring only, instead
                        // of washing out the card content nested inside it.
                        backgroundImage: `linear-gradient(90deg, color-mix(in srgb, ${accent} 70%, transparent), color-mix(in srgb, ${accent} 25%, white), color-mix(in srgb, ${accent} 70%, transparent), color-mix(in srgb, ${accent} 20%, black), color-mix(in srgb, ${accent} 70%, transparent))`,
                        backgroundSize: "300% 100%",
                        animation: "pvp-border-flow 6s linear infinite",
                      }
                    : { background: "rgba(255,255,255,0.1)" }
                }
              >
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a0c2e] via-[#0d1220] to-[#041824] p-6 backdrop-blur-xl md:p-8">
              <div className="mb-3 text-xs uppercase tracking-widest text-white/50">{t("genesis.amount.label")}</div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {TIERS.map((tItem) => {
                  const Icon = TIER_ICONS[tItem.name] ?? Star;
                  const active = amount === tItem.min;
                  const tierPvp = Math.floor(tItem.min / GENESIS.price);
                  return (
                    <button
                      key={tItem.name}
                      onClick={() => setAmount(tItem.min)}
                      className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition ${
                        active ? "" : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]"
                      }`}
                      style={
                        active
                          ? {
                              borderColor: tItem.color,
                              background: `linear-gradient(180deg, color-mix(in srgb, ${tItem.color} 28%, transparent), color-mix(in srgb, ${tItem.color} 6%, transparent))`,
                              boxShadow: `0 0 30px -8px color-mix(in srgb, ${tItem.color} 75%, transparent)`,
                            }
                          : undefined
                      }
                    >
                      {tItem.name === POPULAR_TIER && (
                        <span className="absolute -top-px right-3 rounded-b-md bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white">
                          {t("genesis.popular")}
                        </span>
                      )}
                      <div className="relative flex items-center justify-between">
                        <Icon
                          className="h-5 w-5 transition group-hover:scale-110"
                          style={{ color: tItem.color, filter: `drop-shadow(0 0 8px ${tItem.color}88)` }}
                        />
                        {active && (
                          <motion.span
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                          >
                            <Check className="h-4 w-4" style={{ color: tItem.color }} />
                          </motion.span>
                        )}
                      </div>
                      <div className="mt-3 text-sm font-semibold text-white/85">{tItem.name}</div>
                      <div className="text-silver text-xl font-extrabold">${tItem.min}</div>
                      <div className="mt-0.5 text-[11px] text-white/45">{tierPvp.toLocaleString()} PVP</div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase tracking-widest text-white/50">{t("genesis.custom.label")}</label>
                  <span className="text-[11px] text-white/35">{t("genesis.slider.hint")}</span>
                </div>
                <input
                  type="number"
                  value={amount}
                  min={10}
                  onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-2xl font-bold text-white outline-none focus:border-[var(--neon-purple)]"
                />
                <SliderPrimitive.Root
                  value={[Math.min(SLIDER_MAX, Math.max(SLIDER_MIN, amount))]}
                  min={SLIDER_MIN}
                  max={SLIDER_MAX}
                  step={10}
                  onValueChange={([v]) => setAmount(v)}
                  className="relative mt-4 flex h-5 w-full touch-none select-none items-center"
                >
                  <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-white/10">
                    <SliderPrimitive.Range className="absolute h-full rounded-full bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)]" />
                  </SliderPrimitive.Track>
                  <SliderPrimitive.Thumb
                    aria-label={t("genesis.custom.label")}
                    className="block h-5 w-5 rounded-full border-2 border-white bg-gradient-to-br from-[var(--neon-purple)] to-[var(--neon-blue)] shadow-[0_0_16px_rgba(138,46,255,0.8)] transition hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--neon-purple)]"
                  />
                </SliderPrimitive.Root>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--neon-purple)]/25 bg-gradient-to-r from-[var(--neon-purple)]/15 via-white/[0.02] to-[var(--neon-blue)]/10 p-5">
                <div>
                  <div className="text-xs uppercase tracking-widest text-white/50">{t("genesis.receive")}</div>
                  <div className="text-gradient mt-1 flex items-baseline gap-2 text-3xl font-extrabold tabular-nums md:text-4xl">
                    <AnimatedNumber value={pvp} />
                    <span className="text-sm font-semibold text-white/50">PVP</span>
                  </div>
                  <div className="mt-1 text-xs text-white/40">{t("genesis.price")}: ${GENESIS.price} / PVP</div>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tier?.name ?? "none"}
                    initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ type: "spring", stiffness: 320, damping: 20 }}
                    className="flex flex-col items-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3"
                  >
                    <TierIcon
                      className="h-7 w-7"
                      style={{ color: tier?.color ?? "#8A2EFF", filter: `drop-shadow(0 0 10px ${tier?.color ?? "#8A2EFF"}aa)` }}
                    />
                    <span className="text-xs font-bold uppercase tracking-widest text-white/80">{tier?.name ?? "—"}</span>
                  </motion.div>
                </AnimatePresence>
              </div>

              <motion.button
                onClick={submit}
                className="btn-neon btn-neon-hover relative mt-6 w-full overflow-hidden transition-[background] duration-500"
                style={
                  hasTier
                    ? {
                        background: isSilver
                          ? // Cooler, brighter "chrome" gradient instead of flat grey → white.
                            `linear-gradient(135deg, ${accent} 0%, color-mix(in srgb, ${accent} 55%, #475569) 40%, color-mix(in srgb, ${accent} 60%, var(--neon-blue)) 75%, color-mix(in srgb, ${accent} 35%, white) 130%)`
                          : `linear-gradient(135deg, ${accent} 0%, color-mix(in srgb, ${accent} 65%, black) 60%, color-mix(in srgb, ${accent} 55%, white) 130%)`,
                      }
                    : undefined
                }
                // Gentle breathing glow — a subtle, tasteful nudge toward the CTA rather than
                // a jarring size-pulse (which would also jitter the layout around it).
                animate={{
                  boxShadow: [
                    `0 10px 30px -10px color-mix(in srgb, ${accent} 45%, transparent), inset 0 1px 0 rgba(255,255,255,0.25)`,
                    `0 16px 44px -6px color-mix(in srgb, ${accent} 80%, transparent), inset 0 1px 0 rgba(255,255,255,0.4)`,
                    `0 10px 30px -10px color-mix(in srgb, ${accent} 45%, transparent), inset 0 1px 0 rgba(255,255,255,0.25)`,
                  ],
                }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Diagonal light sweep — reinforces "click me" and, for Silver especially,
                    is what actually sells the "shiny metal" look a flat fill can't. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: "linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.4) 50%, transparent 65%)",
                    animation: "pvp-cta-shine 3.2s ease-in-out infinite",
                  }}
                />
                <span className="relative z-10 inline-flex items-center gap-2">
                  <Check className="h-4 w-4" /> {t("genesis.confirm")}
                </span>
              </motion.button>
              {!address && (
                <div className="mt-3 flex items-center justify-between rounded-2xl border border-yellow-500/20 bg-yellow-500/5 px-4 py-3 text-sm text-yellow-200/80">
                  {t("genesis.connect.prompt")}
                  <WalletButton />
                </div>
              )}
              <p className="mt-3 text-center text-xs text-white/40">{t("genesis.demo.note")}</p>
                </div>
              </div>
            </motion.div>

            <div className="space-y-4">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-6">
                <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-widest text-white/50">
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5 text-[var(--neon-blue)]" /> {t("genesis.progress.label")}
                  </span>
                  <span className="text-silver font-bold">
                    <AnimatedNumber value={pct} decimals={1} />%
                  </span>
                </div>
                <div className="relative h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                    className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] shadow-[0_0_24px_rgba(138,46,255,0.6)]"
                  >
                    <motion.div
                      aria-hidden
                      animate={{ x: ["-100%", "220%"] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    />
                  </motion.div>
                </div>
                <div className="mt-3 flex justify-between text-sm text-white/70">
                  <span>${raised.toLocaleString()} {t("genesis.raised.suffix")}</span>
                  <span>${GENESIS.hardCap.toLocaleString()} {t("genesis.cap.suffix")}</span>
                </div>
              </motion.div>
              <div className="glass rounded-3xl p-6">
                <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-white/50">
                  <Clock className="h-3.5 w-3.5" /> {t("genesis.countdown.label")}
                </div>
                <div className="mt-3"><Countdown to={GENESIS.launchDate} /></div>
              </div>
              <div className="glass rounded-3xl p-6">
                <div className="mb-3 text-xs uppercase tracking-widest text-white/50">{t("genesis.tier.ladder")}</div>
                <div className="space-y-2">
                  {TIERS.map((tr) => {
                    const Icon = TIER_ICONS[tr.name] ?? Star;
                    const active = tier?.name === tr.name;
                    return (
                      <button
                        key={tr.name}
                        onClick={() => setAmount(tr.min)}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition ${
                          active
                            ? "bg-[var(--neon-purple)]/15 ring-1 ring-[var(--neon-purple)]/50"
                            : "hover:bg-white/[0.04]"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <Icon className="h-3.5 w-3.5" style={{ color: tr.color }} />
                          {tr.name}
                          {active && <Check className="h-3 w-3 text-[var(--neon-purple)]" />}
                        </span>
                        <span className="text-white/60">${tr.min}+</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
