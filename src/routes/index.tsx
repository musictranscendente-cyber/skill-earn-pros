import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import {
  Sword, Trophy, Coins, Users, ShieldCheck, Zap, TrendingUp, AlertTriangle,
  Flame, Rocket, ArrowRight, ArrowDown, FileText, ChevronDown, Gamepad2, Lock,
  type LucideIcon,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { Section } from "@/components/Section";
import { GridBackground } from "@/components/Background";
import { TIERS, GENESIS } from "@/lib/wallet";
import { useLang } from "@/lib/i18n";
import { useEffect, useRef, useState } from "react";
import { FloatingGameIcons } from "@/components/home/FloatingGameIcons";
import { SectionBackdrop } from "@/components/home/SectionBackdrop";
import {
  Connect4Thumb,
  CheckersThumb,
  ChessThumb,
  DominoThumb,
  CardsThumb,
  PoolThumb,
  TicTacToeThumb,
  BattleshipThumb,
  SudokuThumb,
  PingPongThumb,
} from "@/components/play/GameThumbs";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PvP Pro — Where Skill Becomes Reward" },
      { name: "description", content: "PvP Pro is a skill-based Web3 esports ecosystem powered by gameplay revenue, not inflation. Compete, earn reputation, become a founder." },
      { property: "og:title", content: "PvP Pro — Where Skill Becomes Reward" },
      { property: "og:description", content: "Skill-based Web3 esports. Real economy. Real competition." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

// Thin seam sitting exactly on the boundary between two homepage sections — a
// hairline with a brighter neon segment glowing at its center. Combined with
// PanelBg below (the real source of contrast), it reads as a clean cut between
// bands rather than a hard, jarring edge.
function SectionDivider() {
  return (
    <div aria-hidden className="relative z-10 mx-auto h-px w-full max-w-6xl px-6">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute left-1/2 top-1/2 h-px w-28 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-[var(--neon-purple)] to-transparent opacity-70 shadow-[0_0_16px_2px_var(--neon-purple)]" />
    </div>
  );
}

// Wraps a section in the site's existing "card" tone (already used for every glass
// panel/card across the page) so alternating sections sit on a visibly lighter
// full-bleed band instead of all blending into the same page background.
function PanelBg({ children }: { children: ReactNode }) {
  return <div className="bg-[var(--card)]">{children}</div>;
}

function Index() {
  return (
    <Layout>
      <Hero />
      <SectionDivider />
      <PanelBg>
        <GamesShowcase />
      </PanelBg>
      <SectionDivider />
      <Problem />
      <SectionDivider />
      <PanelBg>
        <Solution />
      </PanelBg>
      <SectionDivider />
      <Economy />
      <SectionDivider />
      <PanelBg>
        <Tokenomics />
      </PanelBg>
      <SectionDivider />
      <MatchFlow />
      <SectionDivider />
      <PanelBg>
        <Tiers />
      </PanelBg>
      <SectionDivider />
      <Roadmap />
      <SectionDivider />
      <PanelBg>
        <FAQ />
      </PanelBg>
    </Layout>
  );
}

function Hero() {
  const { t } = useLang();
  const raised = GENESIS.raised;
  const pct = Math.min(100, (raised / GENESIS.hardCap) * 100);
  const [videoReady, setVideoReady] = useState(false);
  return (
    <section className="relative isolate overflow-hidden pt-20 pb-14 md:pt-32 md:pb-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* The video is a wide cinematic shot — cover-fitting it into a narrow, tall mobile
         *  hero forces a heavy zoom that reads as broken. A static photo crops far more
         *  gracefully onto a portrait screen, so mobile gets a still frame instead and only
         *  shows the video from md up where the hero is wide enough for it to sit naturally. */}
        <div className="hidden h-full w-full md:block">
          <LoopingBgVideo />
        </div>
        <img
          src="/hero-bg-mobile.jpg"
          alt=""
          className="h-full w-full object-cover opacity-25 md:hidden"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent from-5% via-[#05050a]/60 via-30% to-[#05050a]/85" />
      </div>
      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-8"
        >
          <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:max-w-none lg:text-left">
            <motion.h1
              variants={fadeUp}
              className="text-balance text-5xl font-extrabold leading-[1.02] tracking-tighter md:text-6xl lg:text-7xl"
            >
              <span className="text-silver">{t("hero.title1")}</span>{" "}
              <span className="text-gradient drop-shadow-[0_0_40px_rgba(138,46,255,0.35)]">{t("hero.title2")}</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="mx-auto mt-8 max-w-2xl text-pretty text-base leading-relaxed text-white/65 md:text-lg md:leading-relaxed lg:mx-0">
              {t("hero.subtitle")}
            </motion.p>
            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Link to="/genesis" className="btn-neon btn-neon-hover">
                <Flame className="h-4 w-4" /> {t("hero.cta.founder")}
              </Link>
              <Link to="/whitepaper" className="btn-ghost btn-ghost-hover">
                <FileText className="h-4 w-4" /> {t("hero.cta.whitepaper")}
              </Link>
            </motion.div>
          </div>

          <motion.div variants={fadeUp} className="relative mx-auto flex h-72 w-72 items-center justify-center sm:h-96 sm:w-96 lg:h-[460px] lg:w-[460px]">
            <div aria-hidden className="absolute inset-0 rounded-full bg-[radial-gradient(closest-side,rgba(138,46,255,0.4),transparent_70%)] blur-3xl" />
            <video
              autoPlay
              muted
              loop
              playsInline
              onLoadedData={() => setVideoReady(true)}
              className={`relative h-full w-full object-contain transition-opacity duration-500 ${videoReady ? "opacity-100" : "opacity-0"}`}
            >
              <source src="/logo-spin-alpha.webm" type="video/webm" />
              <source src="/logo-spin.mp4" type="video/mp4" />
            </video>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="glass neon-border mx-auto mt-16 max-w-5xl rounded-3xl p-6 md:p-8"
        >
          <div className="flex flex-wrap gap-x-8 gap-y-6">
            <Stat label={t("hero.stat.price")} value={`$${GENESIS.price.toFixed(2)}`} sub={t("hero.stat.price.sub")} />
            <Stat label={t("hero.stat.cap")} value={`$${GENESIS.hardCap.toLocaleString()}`} sub={t("hero.stat.cap.sub")} />
            <Stat label={t("hero.stat.raised")} value={`$${raised.toLocaleString()}`} sub={`${pct.toFixed(1)}% ${t("hero.stat.raised.suffix")}`} />
            <Stat
              highlight
              label={t("hero.stat.founders")}
              value={`${GENESIS.foundersSold.toLocaleString()} / ${GENESIS.foundersTotal.toLocaleString()}`}
              sub={t("hero.stat.founders.sub")}
            />
          </div>
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-xs text-white/55">
              <span>{t("hero.progress")}</span>
              <span>${raised.toLocaleString()} / ${GENESIS.hardCap.toLocaleString()}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1.4, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-[var(--neon-purple)] via-fuchsia-500 to-[var(--neon-blue)] shadow-[0_0_24px_rgba(138,46,255,0.6)]"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const BRAND_ACCENTS = ["#8A2EFF", "#00B2FF", "#C13BFF", "#00E0FF", "#A45BFF", "#3DD9FF"];
const PROBLEM_ACCENTS = ["#FB7185", "#FB923C", "#F472B6", "#FBBF24"];
const ECONOMY_ACCENTS = ["#00B2FF", "#22D3EE", "#8A2EFF", "#38BDF8", "#A45BFF", "#0EA5E9", "#C13BFF"];
const HEX_CLIP = "polygon(25% 4%, 75% 4%, 100% 50%, 75% 96%, 25% 96%, 0% 50%)";

function IconBadge({
  icon: Icon,
  size = "md",
  color,
  shape = "circle",
  spin = false,
}: {
  icon: LucideIcon;
  size?: "sm" | "md" | "lg";
  color?: string;
  shape?: "circle" | "hex" | "square";
  spin?: boolean;
}) {
  const box = size === "lg" ? "h-24 w-24" : size === "sm" ? "h-16 w-16" : "h-20 w-20";
  const iconSize = size === "lg" ? "h-10 w-10" : size === "sm" ? "h-7 w-7" : "h-8 w-8";
  const c = color ?? BRAND_ACCENTS[0];
  const coreRadius = shape === "square" ? "rounded-2xl" : shape === "circle" ? "rounded-full" : "";

  return (
    <div className={`relative shrink-0 ${box}`}>
      {/* glow — steady pulse for circle/square, an irregular "warning flicker" for hex */}
      <motion.div
        aria-hidden
        animate={
          shape === "hex"
            ? { opacity: [0.4, 1, 0.5, 0.9, 0.4], scale: [0.95, 1.1, 1, 1.15, 0.95] }
            : { opacity: [0.55, 1, 0.55], scale: [0.95, 1.2, 0.95] }
        }
        transition={{ duration: shape === "hex" ? 1.8 : 2.6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -inset-3 rounded-full blur-xl"
        style={{ background: `radial-gradient(closest-side, ${c}, transparent 72%)` }}
      />
      {/* spinning neon ring — only the "hero" circular treatment gets this */}
      {spin && (
        <motion.div
          aria-hidden
          animate={{ rotate: 360 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full p-[2.5px]"
          style={{ background: `conic-gradient(from 0deg, ${c}, transparent 35%, transparent 65%, ${c} 100%)` }}
        >
          <div className="h-full w-full rounded-full bg-[#0b1020]" />
        </motion.div>
      )}
      {/* core */}
      <div
        className={`relative flex ${box} items-center justify-center ${coreRadius} ${spin || shape === "hex" ? "" : "ring-1 ring-white/10"} transition duration-300 group-hover:scale-110`}
        style={{ background: `linear-gradient(135deg, ${c}66, ${c}1a)`, clipPath: shape === "hex" ? HEX_CLIP : undefined }}
      >
        <Icon className={iconSize} style={{ color: c, filter: `drop-shadow(0 0 12px ${c})` }} />
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  highlight = false,
}: {
  label: string;
  value: string;
  sub?: string;
  /** Marks the one stat that's genuinely urgent (limited Founder spots) so it visually
   *  pops out of the row instead of reading as just another neutral metric. */
  highlight?: boolean;
}) {
  if (highlight) {
    return (
      <motion.div
        animate={{
          boxShadow: [
            "0 0 0px 0px rgba(138,46,255,0)",
            "0 0 22px 1px rgba(138,46,255,0.35)",
            "0 0 0px 0px rgba(138,46,255,0)",
          ],
        }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        className="relative rounded-2xl border border-[var(--neon-purple)]/40 bg-[var(--neon-purple)]/[0.07] px-4 py-3"
      >
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--neon-purple)]">
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--neon-purple)] opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--neon-purple)]" />
          </span>
          {label}
        </div>
        <div className="mt-2 whitespace-nowrap text-2xl font-extrabold tracking-tight text-gradient drop-shadow-[0_0_20px_rgba(138,46,255,0.4)] md:text-3xl">
          {value}
        </div>
        {sub && <div className="mt-1 whitespace-nowrap text-xs font-medium text-white/60">{sub}</div>}
      </motion.div>
    );
  }
  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-white/50">{label}</div>
      <div className="text-silver mt-2 whitespace-nowrap text-2xl font-bold tracking-tight md:text-3xl">{value}</div>
      {sub && <div className="mt-1 whitespace-nowrap text-xs text-white/45">{sub}</div>}
    </div>
  );
}

const SHOWCASE_GAMES = [
  { Thumb: Connect4Thumb, titleKey: "play.games.connect4" as const, available: true },
  { Thumb: CheckersThumb, titleKey: "play.games.checkers" as const, available: false },
  { Thumb: ChessThumb, titleKey: "play.games.chess" as const, available: false },
  { Thumb: DominoThumb, titleKey: "play.games.domino" as const, available: false },
  { Thumb: CardsThumb, titleKey: "play.games.truco" as const, available: false },
  { Thumb: PoolThumb, titleKey: "play.games.pool" as const, available: false },
  { Thumb: TicTacToeThumb, titleKey: "play.games.tictactoe" as const, available: false },
  { Thumb: BattleshipThumb, titleKey: "play.games.battleship" as const, available: false },
  { Thumb: SudokuThumb, titleKey: "play.games.sudoku" as const, available: false },
  { Thumb: PingPongThumb, titleKey: "play.games.pingpong" as const, available: false },
];

/** Looping cinematic background video. Sets `muted` on the DOM node
 *  directly (not just via the JSX prop) and forces a manual restart on `ended` — some browsers
 *  don't reliably honor the native `loop` attribute or the autoplay policy when `muted` is only
 *  set as a React prop, so this guarantees the video actually plays and actually loops. */
/** `topOffset` positions the (oversized) video directly instead of relying on
 *  object-position's crop math, whose effective pan amount depends on the source/box
 *  aspect ratio and is hard to predict — this way "-11%" always means the same thing
 *  regardless of screen size: the video is rendered at 145% of the box height, and
 *  `topOffset` says how much of that extra height sits above the visible box. */
function LoopingBgVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    const tryPlay = () => v.play().catch(() => {});
    tryPlay();
    const onEnded = () => {
      v.currentTime = 0;
      tryPlay();
    };
    v.addEventListener("ended", onEnded);
    return () => v.removeEventListener("ended", onEnded);
  }, []);

  return (
    <video
      ref={ref}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      className="h-full w-full object-cover opacity-40"
    >
      <source src="/games-bg.mp4" type="video/mp4" />
    </video>
  );
}

/** New section: makes "this is a multi-game platform" obvious at a glance, right after the
 *  hero — reuses the exact card treatment and copy already proven on /play so it feels like
 *  one product, not a bolt-on. */
function GamesShowcase() {
  const { t } = useLang();
  return (
    <Section
      id="games"
      eyebrow={t("games.eyebrow")}
      title={<>{t("games.title1")} <span className="text-gradient">{t("games.title2")}</span></>}
      subtitle={t("games.subtitle")}
      className="relative isolate"
    >
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 overflow-hidden">
        <GridBackground />
      </div>
      <FloatingGameIcons variant="games" className="hidden md:block" />
      <FloatingGameIcons variant="gamesMobile" className="md:hidden" />
      <div className="relative grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {SHOWCASE_GAMES.map((g, i) => (
          <motion.div
            key={g.titleKey}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className={`glass relative flex flex-col items-center gap-2 overflow-hidden rounded-2xl p-4 text-center transition sm:p-5 ${
              g.available
                ? "neon-border hover:-translate-y-1 hover:border-[var(--neon-purple)]/70 hover:shadow-[0_0_24px_rgba(138,46,255,0.3)]"
                : ""
            }`}
          >
            {!g.available && (
              <span className="absolute right-2 top-2 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-black/50">
                <Lock className="h-3.5 w-3.5 text-white/60" />
              </span>
            )}
            <g.Thumb className="h-16 w-16 sm:h-20 sm:w-20" />
            <span className="text-sm font-semibold text-white">{t(g.titleKey)}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${
                g.available
                  ? "bg-emerald-400/15 text-emerald-400 ring-1 ring-emerald-400/30"
                  : "border border-white/10 bg-white/[0.03] text-white/40"
              }`}
            >
              {g.available ? t("play.games.available") : t("play.games.soon")}
            </span>
          </motion.div>
        ))}
      </div>
      <div className="relative mt-8 text-center">
        <Link to="/play" className="btn-neon btn-neon-hover">
          <Gamepad2 className="h-4 w-4" /> {t("games.cta")}
        </Link>
      </div>
    </Section>
  );
}

function Problem() {
  const { t } = useLang();
  const items = [
    { icon: TrendingUp, title: t("problem.item1.title"), desc: t("problem.item1.desc") },
    { icon: AlertTriangle, title: t("problem.item2.title"), desc: t("problem.item2.desc") },
    { icon: Coins, title: t("problem.item3.title"), desc: t("problem.item3.desc") },
    { icon: Users, title: t("problem.item4.title"), desc: t("problem.item4.desc") },
  ];
  return (
    <Section
      id="problem"
      eyebrow={t("problem.eyebrow")}
      title={<>{t("problem.title1")} <span className="text-gradient">{t("problem.title2")}</span>.</>}
      subtitle={t("problem.subtitle")}
      className="relative"
    >
      <SectionBackdrop variant="vignette" accent="#FB7185" />
      <div className="relative grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="glass group relative overflow-hidden rounded-2xl p-6"
          >
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[var(--neon-purple)]/10 blur-2xl transition group-hover:bg-[var(--neon-purple)]/30" />
            <div className="relative">
              <div className="mb-4">
                <IconBadge icon={it.icon} size="md" shape="hex" color={PROBLEM_ACCENTS[i % PROBLEM_ACCENTS.length]} />
              </div>
              <h3 className="text-lg font-semibold">{it.title}</h3>
              <p className="mt-2 text-sm text-white/55">{it.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function Solution() {
  const { t } = useLang();
  const pillars = [
    { icon: Gamepad2, title: t("solution.item1.title"), desc: t("solution.item1.desc") },
    { icon: Trophy, title: t("solution.item2.title"), desc: t("solution.item2.desc") },
    { icon: Sword, title: t("solution.item3.title"), desc: t("solution.item3.desc") },
    { icon: Coins, title: t("solution.item4.title"), desc: t("solution.item4.desc") },
    { icon: ShieldCheck, title: t("solution.item5.title"), desc: t("solution.item5.desc") },
    { icon: TrendingUp, title: t("solution.item6.title"), desc: t("solution.item6.desc") },
  ];
  return (
    <Section
      id="solution"
      eyebrow={t("solution.eyebrow")}
      title={<>{t("solution.title1")} <span className="text-gradient">{t("solution.title2")}</span>.</>}
      subtitle={t("solution.subtitle")}
      className="relative"
    >
      <SectionBackdrop variant="scan" accent="#00B2FF" />

      {/* The player-driven flywheel logic, spelled out as a numbered cause→effect chain
       *  instead of a wall of stacked centered sentences — each step gets its own badge
       *  and a connecting line, ending on a highlighted "utilization, not speculation"
       *  punchline banner instead of just bolder text. */}
      <div className="glass relative mx-auto mb-10 max-w-2xl rounded-3xl p-6 md:p-8">
        {[t("solution.chain1"), t("solution.chain2"), t("solution.chain3")].map((line, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                style={{ background: `${BRAND_ACCENTS[i]}22`, color: BRAND_ACCENTS[i] }}
              >
                {i + 1}
              </div>
              {i < 2 && <div className="my-1 w-px flex-1 bg-white/10" />}
            </div>
            <p className="pb-6 text-sm text-white/65 md:text-base">{line}</p>
          </div>
        ))}
        <div className="flex items-center gap-3 rounded-2xl border border-[var(--neon-purple)]/30 bg-[var(--neon-purple)]/5 p-4">
          <Zap className="h-5 w-5 shrink-0 text-[var(--neon-purple)]" />
          <p className="text-sm font-semibold text-gradient md:text-base">{t("solution.chain4")}</p>
        </div>
      </div>

      <div className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {pillars.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, x: i % 2 === 0 ? -24 : 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="glass group relative overflow-hidden rounded-2xl p-6 transition hover:-translate-y-1 hover:border-[var(--neon-purple)]/40"
          >
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[var(--neon-blue)]/10 blur-2xl transition group-hover:bg-[var(--neon-blue)]/30" />
            <div className="relative mb-4">
              <IconBadge icon={p.icon} size="md" spin color={BRAND_ACCENTS[i % BRAND_ACCENTS.length]} />
            </div>
            <h3 className="relative text-lg font-semibold">{p.title}</h3>
            <p className="mt-2 text-sm text-white/55">{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function Economy() {
  const { t } = useLang();
  const flow = [
    { label: t("economy.step1.label"), desc: t("economy.step1.desc"), icon: Sword },
    { label: t("economy.step2.label"), desc: t("economy.step2.desc"), icon: Sword },
    { label: t("economy.step3.label"), desc: t("economy.step3.desc"), icon: Zap },
    { label: t("economy.step4.label"), desc: t("economy.step4.desc"), icon: Trophy },
    { label: t("economy.step5.label"), desc: t("economy.step5.desc"), icon: ShieldCheck },
    { label: t("economy.step6.label"), desc: t("economy.step6.desc"), icon: Coins },
    { label: t("economy.step7.label"), desc: t("economy.step7.desc"), icon: Rocket },
  ];
  return (
    <Section
      id="economy"
      eyebrow={t("economy.eyebrow")}
      title={<>{t("economy.title1")} <span className="text-gradient">{t("economy.title2")}</span>.</>}
      subtitle={t("economy.subtitle")}
      className="relative"
    >
      <SectionBackdrop variant="dots" accent="#22D3EE" />
      {/* This is the flagship section — the whole "why the token has real value" argument —
          so it gets bigger icons, bigger type, more padding and a stronger glow than its
          neighbors instead of the same-weight treatment every other section gets. */}
      <div className="relative mb-6 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#22D3EE]">
        <Zap className="h-3.5 w-3.5" /> {t("economy.flagship")}
      </div>
      <div
        className="glass relative rounded-3xl p-8 md:p-14"
        style={{
          border: "1px solid color-mix(in srgb, #22D3EE 45%, transparent)",
          boxShadow: "0 0 0 1px color-mix(in srgb, #22D3EE 18%, transparent), 0 18px 60px -12px color-mix(in srgb, #22D3EE 45%, transparent), inset 0 1px 0 rgba(255,255,255,0.07)",
        }}
      >
        <div className="relative grid grid-cols-1 gap-6 md:grid-cols-7 md:gap-4">
          {/* baseline current track + a traveling spark, reinforcing "value flowing through the system" */}
          <div className="absolute left-10 right-10 top-10 hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent md:block" />
          <motion.div
            aria-hidden
            animate={{ left: ["3%", "97%"] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 hidden h-2.5 w-2.5 -translate-y-1/2 rounded-full md:block"
            style={{ background: "var(--neon-blue)", boxShadow: "0 0 18px 4px rgba(0,178,255,0.9)" }}
          />
          {flow.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className="group relative flex flex-col items-center text-center"
            >
              <IconBadge icon={step.icon} size="md" shape="square" color={ECONOMY_ACCENTS[i % ECONOMY_ACCENTS.length]} />
              <div className="mt-3 text-base font-bold">{step.label}</div>
              <div className="text-sm text-white/50">{step.desc}</div>
              {i < flow.length - 1 && (
                <>
                  <div className="absolute right-[-14px] top-9 hidden md:block">
                    <ArrowRight className="h-4 w-4 text-white/30" />
                  </div>
                  <div className="mt-2 md:hidden">
                    <ArrowDown className="h-4 w-4 text-white/30" />
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function MatchFlow() {
  const { t } = useLang();
  const feeBreakdown = [
    { pct: 3, title: t("matchflow.fee1.title"), desc: t("matchflow.fee1.desc"), color: "#8A2EFF" },
    { pct: 3, title: t("matchflow.fee2.title"), desc: t("matchflow.fee2.desc"), color: "#00B2FF" },
    { pct: 2, title: t("matchflow.fee3.title"), desc: t("matchflow.fee3.desc"), color: "#A45BFF" },
    { pct: 2, title: t("matchflow.fee4.title"), desc: t("matchflow.fee4.desc"), color: "#5B8DEF" },
  ];
  return (
    <Section
      id="matchflow"
      eyebrow={t("matchflow.eyebrow")}
      title={<>{t("matchflow.title1")} <span className="text-gradient">{t("matchflow.title2")}</span>.</>}
      subtitle={
        <>
          {t("matchflow.subtitle.before")}
          <span className="font-bold text-gradient">{t("matchflow.subtitle.highlight")}</span>
          {t("matchflow.subtitle.after")}
        </>
      }
      className="relative"
    >
      <SectionBackdrop variant="dots" accent="#8A2EFF" />

      {/* 2 players -> match -> result, mirroring the "Jogador A/B" language used in Economy
       *  so the two sections read as the same universe, just zoomed into one match. */}
      <div className="relative mb-4 flex flex-wrap items-center justify-center gap-3 md:gap-4">
        <div className="glass flex flex-col items-center gap-2 rounded-2xl px-5 py-4 text-center">
          <Users className="h-6 w-6 text-white/70" />
          <div className="text-sm font-semibold">{t("matchflow.player1")}</div>
        </div>
        <ArrowRight className="h-5 w-5 shrink-0 text-white/25" />
        <div className="glass flex flex-col items-center gap-2 rounded-2xl px-5 py-4 text-center">
          <Users className="h-6 w-6 text-white/70" />
          <div className="text-sm font-semibold">{t("matchflow.player2")}</div>
        </div>
        <ArrowRight className="h-5 w-5 shrink-0 text-white/25" />
        <div className="glass flex flex-col items-center gap-2 rounded-2xl border border-[var(--neon-purple)]/30 px-5 py-4 text-center">
          <Sword className="h-6 w-6 text-[var(--neon-purple)]" />
          <div className="text-sm font-semibold">{t("matchflow.matchLabel")}</div>
        </div>
        <ArrowRight className="h-5 w-5 shrink-0 text-white/25" />
        <div className="glass flex flex-col items-center gap-2 rounded-2xl border border-[var(--neon-blue)]/30 px-5 py-4 text-center">
          <Trophy className="h-6 w-6 text-[var(--neon-blue)]" />
          <div className="text-sm font-semibold">{t("matchflow.resultLabel")}</div>
        </div>
      </div>
      <p className="relative mx-auto mb-10 max-w-2xl text-center text-sm text-white/55 md:text-base">
        {t("matchflow.flowDesc")}
      </p>

      {/* The headline 90/10 split */}
      <div className="relative grid gap-5 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="glass relative overflow-hidden rounded-3xl border border-[var(--neon-purple)]/30 p-8 text-center"
          style={{ boxShadow: "0 18px 60px -20px rgba(138,46,255,0.5)" }}
        >
          <div className="mx-auto mb-4">
            <IconBadge icon={Trophy} size="lg" spin color="#8A2EFF" />
          </div>
          <div className="text-5xl font-black text-gradient md:text-6xl">🏆 {t("matchflow.winnerPct")}</div>
          <h3 className="mt-3 text-lg font-semibold md:text-xl">{t("matchflow.winnerTitle")}</h3>
          <p className="mt-2 text-sm text-white/55">{t("matchflow.winnerDesc")}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass relative overflow-hidden rounded-3xl border border-[var(--neon-blue)]/30 p-8 text-center"
          style={{ boxShadow: "0 18px 60px -20px rgba(0,178,255,0.5)" }}
        >
          <div className="mx-auto mb-4">
            <IconBadge icon={Zap} size="lg" spin color="#00B2FF" />
          </div>
          <div className="text-5xl font-black text-gradient md:text-6xl">⚡ {t("matchflow.feePct")}</div>
          <h3 className="mt-3 text-lg font-semibold md:text-xl">{t("matchflow.feeTitle")}</h3>
          <p className="mt-2 text-sm text-white/55">{t("matchflow.feeDesc")}</p>
        </motion.div>
      </div>

      {/* How the 10% ecosystem fee itself breaks down: a proportional stacked bar plus a
       *  card per allocation, so the four percentages are both felt visually and readable. */}
      <div className="glass relative mt-8 rounded-3xl p-6 md:p-8">
        <h4 className="text-center text-xs font-semibold uppercase tracking-widest text-white/50">
          {t("matchflow.breakdownLabel")}
        </h4>
        <div className="mt-5 flex h-4 w-full overflow-hidden rounded-full bg-white/5">
          {feeBreakdown.map((f, i) => (
            <div key={i} style={{ width: `${(f.pct / 10) * 100}%`, background: f.color }} />
          ))}
        </div>
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {feeBreakdown.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="text-center"
            >
              <div className="text-2xl font-extrabold" style={{ color: f.color }}>
                {f.pct}%
              </div>
              <div className="mt-1 text-sm font-semibold">{f.title}</div>
              <div className="mt-1 text-xs text-white/50">{f.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function Tokenomics() {
  const { t } = useLang();
  const allocations = [
    { label: t("tokenomics.alloc1"), pct: 35, color: "#8A2EFF" },
    { label: t("tokenomics.alloc2"), pct: 20, color: "#00B2FF" },
    { label: t("tokenomics.alloc3"), pct: 15, color: "#A45BFF" },
    { label: t("tokenomics.alloc4"), pct: 12, color: "#5B8DEF" },
    { label: t("tokenomics.alloc5"), pct: 10, color: "#C28BFF" },
    { label: t("tokenomics.alloc6"), pct: 8, color: "#65DDFF" },
  ];
  // Build conic gradient
  let acc = 0;
  const conic = allocations
    .map((a) => {
      const start = acc;
      acc += a.pct;
      return `${a.color} ${start}% ${acc}%`;
    })
    .join(", ");

  return (
    <Section
      id="tokenomics"
      eyebrow={t("tokenomics.eyebrow")}
      title={<>{t("tokenomics.title1")} <span className="text-gradient">{t("tokenomics.title2")}</span>.</>}
      subtitle={t("tokenomics.subtitle")}
      className="relative"
    >
      <SectionBackdrop variant="vignette" accent="#e879f9" />
      <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-8">
        <div className="order-2 grid grid-cols-2 gap-4 lg:order-1">
          <Card label={t("tokenomics.supply")} value="1,000,000,000" sub="PVP" />
          <Card label={t("tokenomics.price")} value={`$${GENESIS.price.toFixed(2)}`} sub={t("tokenomics.price.sub")} />
          <Card label={t("tokenomics.allocation")} value="100,000,000" sub={t("tokenomics.allocation.sub")} />
          <Card label={t("tokenomics.network")} value="Base" sub={t("tokenomics.network.sub")} />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.55, rotate: -18 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative order-1 mx-auto flex h-56 w-56 items-center justify-center sm:h-64 sm:w-64 lg:order-2 lg:h-72 lg:w-72"
        >
          <motion.div
            aria-hidden
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full bg-[radial-gradient(closest-side,rgba(0,178,255,0.35),transparent_70%)] blur-3xl"
          />
          <motion.img
            src="/pvp-coin.webp"
            alt="PVP Token"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="relative h-full w-full object-contain drop-shadow-[0_0_50px_rgba(138,46,255,0.35)]"
          />
        </motion.div>

        <div className="glass order-3 flex flex-col items-center gap-8 rounded-3xl p-8">
          <div
            className="relative h-64 w-64 shrink-0 rounded-full"
            style={{ background: `conic-gradient(${conic})` }}
          >
            <div className="absolute inset-6 flex flex-col items-center justify-center rounded-full bg-[#0b1020] ring-1 ring-white/10">
              <div className="text-xs uppercase tracking-widest text-white/50">{t("tokenomics.center.label")}</div>
              <div className="text-silver text-2xl font-bold">1B PVP</div>
            </div>
          </div>
          <div className="grid w-full max-w-md grid-cols-1 gap-x-6 gap-y-3 text-xs sm:grid-cols-2">
            {allocations.map((a) => (
              <div key={a.label} className="grid grid-cols-[10px_1fr_auto] items-start gap-x-2">
                <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: a.color }} />
                <span className="text-white/70">{a.label}</span>
                <span className="pl-2 text-white/40">{a.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

function Card({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="text-xs uppercase tracking-widest text-white/50">{label}</div>
      <div className="text-silver mt-2 text-2xl font-bold tracking-tight">{value}</div>
      {sub && <div className="mt-1 text-xs text-white/45">{sub}</div>}
    </div>
  );
}

function Tiers() {
  const { t } = useLang();
  return (
    <Section
      id="tiers"
      eyebrow={t("tiers.eyebrow")}
      title={<>{t("tiers.title1")} <span className="text-gradient">{t("tiers.title2")}</span>.</>}
      subtitle={t("tiers.subtitle")}
      className="relative"
    >
      <SectionBackdrop variant="dots" accent="#facc15" />
      <div className="relative grid gap-5 md:grid-cols-3 lg:grid-cols-5">
        {TIERS.map((tItem, i) => {
          const featured = tItem.name === "Gold";
          const pvp = (tItem.min / GENESIS.price).toLocaleString();
          return (
            <motion.div
              key={tItem.name}
              initial={{ opacity: 0, y: 24, rotate: i % 2 === 0 ? -2.5 : 2.5 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className={`relative rounded-3xl p-6 ${featured ? "neon-border bg-gradient-to-b from-[var(--neon-purple)]/15 to-transparent" : "glass"}`}
            >
              {featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                  {t("tiers.featured.badge")}
                </div>
              )}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{tItem.name}</h3>
                <span className="h-2 w-2 rounded-full" style={{ background: tItem.color, boxShadow: `0 0 12px ${tItem.color}` }} />
              </div>
              <div className="mt-5">
                <div className="flex items-baseline gap-1">
                  <span className="text-silver text-4xl font-extrabold">${tItem.min}</span>
                  <span className="text-xs text-white/40">USDC</span>
                </div>
                <div className="mt-1 text-sm text-[var(--neon-blue)]">{pvp} PVP</div>
              </div>
              <ul className="mt-5 space-y-2 text-sm text-white/65">
                <li>• {t("tiers.benefit.nft")}</li>
                <li>• {t("tiers.benefit.fees")}</li>
                {tItem.min >= 100 && tItem.min < 250 && <li>• {t("tiers.benefit.entries3")}</li>}
                {tItem.min >= 250 && tItem.min < 500 && <li>• {t("tiers.benefit.entries5")}</li>}
                {tItem.min >= 500 && tItem.min < 1000 && <li>• {t("tiers.benefit.entries7")}</li>}
                {tItem.min >= 1000 && <li>• {t("tiers.benefit.entries10")}</li>}
                {tItem.min >= 250 && <li>• {t("tiers.benefit.governance")}</li>}
                {tItem.min >= 500 && <li>• {t("tiers.benefit.earlyAccess")}</li>}
                {tItem.min >= 1000 && <li>• {t("tiers.benefit.diamondGroup")}</li>}
              </ul>
              <Link
                to="/genesis"
                search={{ amount: tItem.min }}
                className={`mt-6 block rounded-full py-2.5 text-center text-sm font-semibold ${featured ? "btn-neon btn-neon-hover" : "btn-ghost btn-ghost-hover"}`}
              >
                {t("tiers.reserve")} {tItem.name}
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Scarcity note: Genesis is a one-time window, not a recurring sale — reinforces
       *  why locking in a tier now matters. Kept subtle: no card/border, just the icon + original type. */}
      <div className="relative mx-auto mt-8 flex max-w-2xl items-center justify-center gap-2.5 px-4">
        <Lock className="h-3.5 w-3.5 shrink-0 text-white/40" />
        <p className="text-center text-xs text-white/55 md:text-sm">
          {t("tiers.exclusivityNote.before")}
          <span className="font-bold text-gradient">{t("tiers.exclusivityNote.highlight")}</span>
          {t("tiers.exclusivityNote.after")}
        </p>
      </div>
    </Section>
  );
}

function Roadmap() {
  const { t } = useLang();
  const phases = [
    { phase: t("roadmap.p1.phase"), title: t("roadmap.p1.title"), items: [t("roadmap.p1.i1"), t("roadmap.p1.i2"), t("roadmap.p1.i3"), t("roadmap.p1.i4")], status: t("roadmap.p1.status") },
    { phase: t("roadmap.p2.phase"), title: t("roadmap.p2.title"), items: [t("roadmap.p2.i1"), t("roadmap.p2.i2"), t("roadmap.p2.i3"), t("roadmap.p2.i4"), t("roadmap.p2.i5"), t("roadmap.p2.i6")], status: t("roadmap.p2.status") },
    { phase: t("roadmap.p3.phase"), title: t("roadmap.p3.title"), items: [t("roadmap.p3.i1"), t("roadmap.p3.i2"), t("roadmap.p3.i3"), t("roadmap.p3.i4"), t("roadmap.p3.i5"), t("roadmap.p3.i6")], status: t("roadmap.p3.status") },
    { phase: t("roadmap.p4.phase"), title: t("roadmap.p4.title"), items: [t("roadmap.p4.i1"), t("roadmap.p4.i2"), t("roadmap.p4.i3"), t("roadmap.p4.i4"), t("roadmap.p4.i5"), t("roadmap.p4.i6")], status: t("roadmap.p4.status") },
    { phase: t("roadmap.p5.phase"), title: t("roadmap.p5.title"), items: [t("roadmap.p5.i1"), t("roadmap.p5.i2"), t("roadmap.p5.i3"), t("roadmap.p5.i4"), t("roadmap.p5.i5"), t("roadmap.p5.i6")], status: t("roadmap.p5.status") },
    { phase: t("roadmap.p6.phase"), title: t("roadmap.p6.title"), items: [t("roadmap.p6.i1"), t("roadmap.p6.i2"), t("roadmap.p6.i3"), t("roadmap.p6.i4"), t("roadmap.p6.i5")], status: t("roadmap.p6.status") },
  ];
  return (
    <Section
      id="roadmap"
      eyebrow={t("roadmap.eyebrow")}
      title={<>{t("roadmap.title1")} <span className="text-gradient">{t("roadmap.title2")}</span>.</>}
      subtitle={t("roadmap.subtitle")}
      className="relative"
    >
      <SectionBackdrop variant="vignette" accent="#00B2FF" />
      <div className="relative">
        <div className="absolute left-4 top-0 hidden h-full w-px bg-gradient-to-b from-[var(--neon-purple)]/60 via-[var(--neon-blue)]/30 to-transparent md:block" />
        <div className="space-y-6">
          {phases.map((p, i) => (
            <motion.div
              key={p.phase}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative md:pl-14"
            >
              <div className="absolute left-0 top-5 hidden h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-[#0b1020] md:flex">
                <span className="h-2 w-2 rounded-full bg-[var(--neon-purple)] shadow-[0_0_10px_var(--neon-purple)]" />
              </div>
              <div className="glass rounded-2xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-white/50">{p.phase}</div>
                    <h3 className="mt-1 text-xl font-semibold">{p.title}</h3>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/70">{p.status}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.items.map((it) => (
                    <span key={it} className="rounded-full bg-white/[0.04] px-3 py-1 text-xs text-white/70">{it}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

function FAQ() {
  const { t } = useLang();
  const items = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
    { q: t("faq.q5"), a: t("faq.a5") },
    { q: t("faq.q6"), a: t("faq.a6") },
    { q: t("faq.q7"), a: t("faq.a7") },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section id="faq" eyebrow={t("faq.eyebrow")} title={<>{t("faq.title1")} <span className="text-gradient">{t("faq.title2")}</span>.</>}>
      <div className="mx-auto max-w-3xl space-y-3">
        {items.map((it, i) => (
          <div key={it.q} className="glass overflow-hidden rounded-2xl">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-4 p-5 text-left"
            >
              <span className="font-medium">{it.q}</span>
              <ChevronDown className={`h-4 w-4 shrink-0 transition ${open === i ? "rotate-180" : ""}`} />
            </button>
            <motion.div
              initial={false}
              animate={{ height: open === i ? "auto" : 0, opacity: open === i ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <p className="px-5 pb-5 text-sm text-white/60">{it.a}</p>
            </motion.div>
          </div>
        ))}
      </div>
    </Section>
  );
}
