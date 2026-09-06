import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  FileText, ShieldCheck, AlertTriangle, TrendingUp, Coins, Users, Sword, Trophy,
  Zap, Rocket, Flame, Gem, Check, ListChecks, ArrowRight, Star, Shield, Award,
  Gamepad2, Lock, X, ShieldAlert, BookOpen,
  type LucideIcon,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { GridBackground } from "@/components/Background";
import { TIERS, GENESIS } from "@/lib/wallet";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/whitepaper")({
  head: () => ({
    meta: [
      { title: "Whitepaper — PvP Pro" },
      { name: "description", content: "The complete technical and economic document behind the PvP Pro ecosystem — vision, product, economic model, tokenomics, security, and the Genesis Founder Program." },
      { property: "og:title", content: "Whitepaper — PvP Pro" },
      { property: "og:description", content: "Vision, product, tokenomics, security, and the Genesis Founder Program — explained in full." },
      { property: "og:url", content: "/whitepaper" },
    ],
    links: [{ rel: "canonical", href: "/whitepaper" }],
  }),
  component: WhitepaperPage,
});

const TIER_ICONS: Record<string, LucideIcon> = {
  Starter: Star,
  Bronze: Shield,
  Silver: Award,
  Gold: Trophy,
  Diamond: Gem,
};

/** Free tournament entries per season, by tier minimum — mirrors the thresholds used
 *  on the homepage Tiers grid and on /genesis, kept as a single helper here so the
 *  benefits matrix stays in sync with those without duplicating the logic. */
function entriesFor(min: number): number {
  if (min >= 1000) return 10;
  if (min >= 500) return 7;
  if (min >= 250) return 5;
  if (min >= 100) return 3;
  return 0;
}

function WhitepaperPage() {
  const { t } = useLang();

  const toc = [
    { id: "s1", label: t("wp.toc.1") },
    { id: "s2", label: t("wp.toc.2") },
    { id: "s3", label: t("wp.toc.3") },
    { id: "splat", label: t("wp.toc.4") },
    { id: "s4", label: t("wp.toc.5") },
    { id: "s5", label: t("wp.toc.6") },
    { id: "s6", label: t("wp.toc.7") },
    { id: "s7", label: t("wp.toc.8") },
    { id: "s8", label: t("wp.toc.9") },
    { id: "s9", label: t("wp.toc.10") },
    { id: "saud", label: t("wp.toc.11") },
    { id: "ssec", label: t("wp.toc.12") },
    { id: "sgloss", label: t("wp.toc.13") },
    { id: "s11", label: t("wp.toc.14") },
  ];

  return (
    <Layout>
      <section className="relative overflow-hidden pt-16 pb-10 md:pt-24">
        <GridBackground />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/60">
            <FileText className="h-3 w-3 text-[var(--neon-blue)]" /> {t("wp.badge")}
          </div>
          <h1 className="text-balance text-4xl font-extrabold tracking-tight md:text-6xl">
            <span className="text-silver">{t("wp.hero.title1")}</span>{" "}
            <span className="text-gradient">{t("wp.hero.title2")}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-white/60 md:text-lg">{t("wp.hero.subtitle")}</p>
          <div className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-white/45">
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1">{t("wp.hero.version")}</span>
            <span>{t("wp.hero.living")}</span>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/genesis" className="btn-neon btn-neon-hover">
              <Flame className="h-4 w-4" /> {t("hero.cta.founder")}
            </Link>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-4xl px-6 pb-10">
        <div className="glass rounded-3xl p-6 md:p-8">
          <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/50">
            <ListChecks className="h-3.5 w-3.5 text-[var(--neon-purple)]" /> {t("wp.toc.title")}
          </div>
          <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {toc.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-white/70 transition hover:bg-white/[0.04] hover:text-white"
              >
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-white/30" /> {item.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="relative mx-auto max-w-4xl space-y-6 px-6 pb-24">
        <Overview />
        <Problem />
        <Solution />
        <Platform />
        <MatchEconomy />
        <EcosystemEngine />
        <Tokenomics />
        <FounderProgram />
        <RoadmapSummary />
        <Governance />
        <SecurityAudit />
        <Security />
        <Glossary />
        <Conclusion />

        <p className="pt-4 text-center text-xs text-white/35">{t("footer.disclaimer")}</p>
      </div>
    </Layout>
  );
}

function WpSection({ id, title, icon: Icon, children }: { id: string; title: string; icon: LucideIcon; children: React.ReactNode }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className="glass scroll-mt-24 rounded-3xl p-6 md:p-8"
    >
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--neon-purple)]/15 text-[var(--neon-purple)]">
          <Icon className="h-4.5 w-4.5" />
        </span>
        <h2 className="text-xl font-bold md:text-2xl">{title}</h2>
      </div>
      <div className="space-y-4 text-sm leading-relaxed text-white/70 md:text-base">{children}</div>
    </motion.section>
  );
}

function Overview() {
  const { t } = useLang();
  return (
    <WpSection id="s1" title={t("wp.s1.title")} icon={Sword}>
      <p>{t("wp.s1.p1")}</p>
      <p>{t("wp.s1.p2")}</p>
      <p>{t("wp.s1.p3")}</p>
      <p>{t("wp.s1.p4")}</p>
    </WpSection>
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
    <WpSection id="s2" title={t("wp.s2.title")} icon={AlertTriangle}>
      <p>{t("wp.s2.intro")}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((it) => (
          <div key={it.title} className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <it.icon className="h-4 w-4 text-white/50" /> {it.title}
            </div>
            <p className="mt-1.5 text-xs text-white/55">{it.desc}</p>
          </div>
        ))}
      </div>
    </WpSection>
  );
}

function Solution() {
  const { t } = useLang();
  const pillars = [
    { icon: Sword, title: t("solution.item1.title"), desc: t("solution.item1.desc") },
    { icon: Trophy, title: t("solution.item2.title"), desc: t("solution.item2.desc") },
    { icon: Zap, title: t("solution.item3.title"), desc: t("solution.item3.desc") },
    { icon: Coins, title: t("solution.item4.title"), desc: t("solution.item4.desc") },
    { icon: ShieldCheck, title: t("solution.item5.title"), desc: t("solution.item5.desc") },
    { icon: TrendingUp, title: t("solution.item6.title"), desc: t("solution.item6.desc") },
  ];
  return (
    <WpSection id="s3" title={t("wp.s3.title")} icon={ShieldCheck}>
      <p>{t("wp.s3.intro")}</p>
      <ol className="space-y-2 border-l border-white/10 pl-4">
        {[t("solution.chain1"), t("solution.chain2"), t("solution.chain3")].map((line, i) => (
          <li key={i} className="text-white/65">
            <span className="mr-1.5 font-bold text-[var(--neon-purple)]">{i + 1}.</span> {line}
          </li>
        ))}
      </ol>
      <p className="font-semibold text-gradient">{t("solution.chain4")}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {pillars.map((p) => (
          <div key={p.title} className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <p.icon className="h-4 w-4 text-[var(--neon-blue)]" /> {p.title}
            </div>
            <p className="mt-1.5 text-xs text-white/55">{p.desc}</p>
          </div>
        ))}
      </div>
    </WpSection>
  );
}

const PLATFORM_GAMES = [
  { key: "play.games.connect4" as const, available: true },
  { key: "play.games.checkers" as const, available: false },
  { key: "play.games.chess" as const, available: false },
  { key: "play.games.domino" as const, available: false },
  { key: "play.games.pool" as const, available: false },
];

function Platform() {
  const { t } = useLang();
  return (
    <WpSection id="splat" title={t("wp.plat.title")} icon={Gamepad2}>
      <p>{t("wp.plat.p1")}</p>
      <p>{t("wp.plat.p2")}</p>
      <p>{t("wp.plat.p3")}</p>
      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/50">{t("wp.plat.games.title")}</h4>
        <div className="flex flex-wrap gap-2">
          {PLATFORM_GAMES.map((g) => (
            <span
              key={g.key}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                g.available
                  ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                  : "border-white/10 bg-white/[0.03] text-white/45"
              }`}
            >
              {g.available ? <Check className="h-3 w-3" /> : <Lock className="h-3 w-3" />} {t(g.key)}
            </span>
          ))}
        </div>
      </div>
    </WpSection>
  );
}

function MatchEconomy() {
  const { t } = useLang();
  const feeBreakdown = [
    { pct: 3, title: t("matchflow.fee1.title"), desc: t("matchflow.fee1.desc") },
    { pct: 3, title: t("matchflow.fee2.title"), desc: t("matchflow.fee2.desc") },
    { pct: 2, title: t("matchflow.fee3.title"), desc: t("matchflow.fee3.desc") },
    { pct: 2, title: t("matchflow.fee4.title"), desc: t("matchflow.fee4.desc") },
  ];
  return (
    <WpSection id="s4" title={t("wp.s4.title")} icon={Sword}>
      <p>{t("wp.s4.intro")}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--neon-purple)]/25 bg-[var(--neon-purple)]/5 p-4 text-center">
          <div className="text-3xl font-black text-gradient">{t("matchflow.winnerPct")}</div>
          <div className="mt-1 text-sm font-semibold text-white">{t("matchflow.winnerTitle")}</div>
          <p className="mt-1 text-xs text-white/55">{t("matchflow.winnerDesc")}</p>
        </div>
        <div className="rounded-2xl border border-[var(--neon-blue)]/25 bg-[var(--neon-blue)]/5 p-4 text-center">
          <div className="text-3xl font-black text-gradient">{t("matchflow.feePct")}</div>
          <div className="mt-1 text-sm font-semibold text-white">{t("matchflow.feeTitle")}</div>
          <p className="mt-1 text-xs text-white/55">{t("matchflow.feeDesc")}</p>
        </div>
      </div>
      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/50">{t("matchflow.breakdownLabel")}</h4>
        <div className="grid gap-3 sm:grid-cols-2">
          {feeBreakdown.map((f) => (
            <div key={f.title} className="flex items-start gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-3.5">
              <span className="shrink-0 text-lg font-extrabold text-[var(--neon-blue)]">{f.pct}%</span>
              <div>
                <div className="text-sm font-semibold text-white">{f.title}</div>
                <p className="text-xs text-white/55">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-white/50">{t("wp.s4.example.title")}</div>
        <p className="text-sm text-white/65">{t("wp.s4.example")}</p>
      </div>
    </WpSection>
  );
}

function EcosystemEngine() {
  const { t } = useLang();
  const steps = [
    t("economy.step1.label"), t("economy.step2.label"), t("economy.step3.label"),
    t("economy.step4.label"), t("economy.step5.label"), t("economy.step6.label"), t("economy.step7.label"),
  ];
  const uses = [t("wp.s5.use1"), t("wp.s5.use2"), t("wp.s5.use3"), t("wp.s5.use4"), t("wp.s5.use5")];
  return (
    <WpSection id="s5" title={t("wp.s5.title")} icon={Zap}>
      <p>{t("wp.s5.intro")}</p>
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-white/70">
        {steps.map((s, i) => (
          <span key={s} className="flex items-center gap-2">
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">{s}</span>
            {i < steps.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-white/25" />}
          </span>
        ))}
      </div>
      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/50">{t("wp.s5.use.title")}</h4>
        <ul className="grid gap-1.5 sm:grid-cols-2">
          {uses.map((u) => (
            <li key={u} className="flex items-start gap-2 text-white/65">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--neon-blue)]" /> {u}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-white/45">{t("wp.s5.use.note")}</p>
      </div>
    </WpSection>
  );
}

function Tokenomics() {
  const { t } = useLang();
  const allocations = [
    { label: t("tokenomics.alloc1"), pct: 35 },
    { label: t("tokenomics.alloc2"), pct: 20 },
    { label: t("tokenomics.alloc3"), pct: 15 },
    { label: t("tokenomics.alloc4"), pct: 12 },
    { label: t("tokenomics.alloc5"), pct: 10 },
    { label: t("tokenomics.alloc6"), pct: 8 },
  ];
  return (
    <WpSection id="s6" title={t("wp.s6.title")} icon={Coins}>
      <p>{t("wp.s6.intro")}</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
          <div className="text-[10px] uppercase tracking-widest text-white/45">{t("tokenomics.supply")}</div>
          <div className="text-silver mt-1 text-lg font-bold">1,000,000,000</div>
          <div className="text-[11px] text-white/40">PVP</div>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
          <div className="text-[10px] uppercase tracking-widest text-white/45">{t("tokenomics.price")}</div>
          <div className="text-silver mt-1 text-lg font-bold">${GENESIS.price.toFixed(2)}</div>
          <div className="text-[11px] text-white/40">{t("tokenomics.price.sub")}</div>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
          <div className="text-[10px] uppercase tracking-widest text-white/45">{t("tokenomics.allocation")}</div>
          <div className="text-silver mt-1 text-lg font-bold">100,000,000</div>
          <div className="text-[11px] text-white/40">{t("tokenomics.allocation.sub")}</div>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
          <div className="text-[10px] uppercase tracking-widest text-white/45">{t("tokenomics.network")}</div>
          <div className="text-silver mt-1 text-lg font-bold">Base</div>
          <div className="text-[11px] text-white/40">{t("tokenomics.network.sub")}</div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
        {allocations.map((a) => (
          <div key={a.label} className="flex items-center justify-between border-b border-white/5 py-1.5">
            <span className="text-white/70">{a.label}</span>
            <span className="font-semibold text-white/50">{a.pct}%</span>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-white/50">{t("wp.s6.vesting.title")}</div>
        <p className="text-sm text-white/65">{t("wp.s6.vesting.p1")}</p>
        <p className="mt-1.5 text-sm text-white/65">{t("wp.s6.vesting.p2")}</p>
      </div>
    </WpSection>
  );
}

function FounderProgram() {
  const { t } = useLang();
  return (
    <WpSection id="s7" title={t("wp.s7.title")} icon={Flame}>
      <p>{t("wp.s7.intro")}</p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-widest text-white/45">
              <th className="py-2 pr-4">Tier</th>
              <th className="py-2 pr-4">USDC</th>
              <th className="py-2 pr-4">PVP</th>
            </tr>
          </thead>
          <tbody>
            {TIERS.map((tItem) => {
              const Icon = TIER_ICONS[tItem.name] ?? Star;
              const pvp = Math.floor(tItem.min / GENESIS.price);
              return (
                <tr key={tItem.name} className="border-b border-white/5">
                  <td className="flex items-center gap-2 py-2.5 pr-4 font-semibold text-white">
                    <Icon className="h-4 w-4" style={{ color: tItem.color }} /> {tItem.name}
                  </td>
                  <td className="py-2.5 pr-4 text-white/70">${tItem.min}</td>
                  <td className="py-2.5 pr-4 text-[var(--neon-blue)]">{pvp.toLocaleString()} PVP</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/50">{t("wp.s7.matrix.title")}</h4>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-white/45">
                <th className="py-2 pr-3 font-normal">&nbsp;</th>
                {TIERS.map((tItem) => (
                  <th key={tItem.name} className="py-2 px-2 text-center font-semibold" style={{ color: tItem.color }}>
                    {tItem.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-white/70">
              <tr className="border-b border-white/5">
                <td className="py-2 pr-3">{t("tiers.benefit.nft")}</td>
                {TIERS.map((tItem) => (
                  <td key={tItem.name} className="py-2 px-2 text-center"><Check className="mx-auto h-3.5 w-3.5 text-emerald-400" /></td>
                ))}
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 pr-3">{t("tiers.benefit.fees")}</td>
                {TIERS.map((tItem) => (
                  <td key={tItem.name} className="py-2 px-2 text-center"><Check className="mx-auto h-3.5 w-3.5 text-emerald-400" /></td>
                ))}
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 pr-3">{t("wp.s7.matrix.entries")}</td>
                {TIERS.map((tItem) => {
                  const n = entriesFor(tItem.min);
                  return (
                    <td key={tItem.name} className="py-2 px-2 text-center">
                      {n > 0 ? <span className="font-semibold text-white">{n}</span> : <X className="mx-auto h-3.5 w-3.5 text-white/25" />}
                    </td>
                  );
                })}
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 pr-3">{t("tiers.benefit.governance")}</td>
                {TIERS.map((tItem) => (
                  <td key={tItem.name} className="py-2 px-2 text-center">
                    {tItem.min >= 250 ? <Check className="mx-auto h-3.5 w-3.5 text-emerald-400" /> : <X className="mx-auto h-3.5 w-3.5 text-white/25" />}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 pr-3">{t("tiers.benefit.earlyAccess")}</td>
                {TIERS.map((tItem) => (
                  <td key={tItem.name} className="py-2 px-2 text-center">
                    {tItem.min >= 500 ? <Check className="mx-auto h-3.5 w-3.5 text-emerald-400" /> : <X className="mx-auto h-3.5 w-3.5 text-white/25" />}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2 pr-3">{t("tiers.benefit.diamondGroup")}</td>
                {TIERS.map((tItem) => (
                  <td key={tItem.name} className="py-2 px-2 text-center">
                    {tItem.min >= 1000 ? <Check className="mx-auto h-3.5 w-3.5 text-emerald-400" /> : <X className="mx-auto h-3.5 w-3.5 text-white/25" />}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/50">{t("wp.s7.contract.title")}</div>
        <p className="text-sm text-white/65">{t("wp.s7.contract.p1")}</p>
        <p className="mt-1.5 text-sm text-white/65">{t("wp.s7.contract.p2")}</p>
        <p className="mt-1.5 text-sm text-white/65">{t("wp.s7.contract.p3")}</p>
        <div className="mt-3 flex flex-wrap items-center gap-1.5 rounded-xl bg-white/[0.03] px-3 py-2 text-xs font-semibold text-[var(--neon-blue)]">
          {t("wp.s7.contract.flow")}
        </div>
        <p className="mt-2 text-xs font-semibold text-gradient">{t("wp.s7.contract.tagline")}</p>
      </div>

      <p className="text-xs text-white/45">
        {t("tiers.exclusivityNote.before")}
        <span className="font-semibold text-white/60">{t("tiers.exclusivityNote.highlight")}</span>
        {t("tiers.exclusivityNote.after")}
      </p>
    </WpSection>
  );
}

function RoadmapSummary() {
  const { t } = useLang();
  const phases = [
    { phase: t("roadmap.p1.phase"), title: t("roadmap.p1.title"), status: t("roadmap.p1.status"), items: [t("roadmap.p1.i1"), t("roadmap.p1.i2"), t("roadmap.p1.i3"), t("roadmap.p1.i4")] },
    { phase: t("roadmap.p2.phase"), title: t("roadmap.p2.title"), status: t("roadmap.p2.status"), items: [t("roadmap.p2.i1"), t("roadmap.p2.i2"), t("roadmap.p2.i3"), t("roadmap.p2.i4"), t("roadmap.p2.i5"), t("roadmap.p2.i6")] },
    { phase: t("roadmap.p3.phase"), title: t("roadmap.p3.title"), status: t("roadmap.p3.status"), items: [t("roadmap.p3.i1"), t("roadmap.p3.i2"), t("roadmap.p3.i3"), t("roadmap.p3.i4"), t("roadmap.p3.i5"), t("roadmap.p3.i6")] },
    { phase: t("roadmap.p4.phase"), title: t("roadmap.p4.title"), status: t("roadmap.p4.status"), items: [t("roadmap.p4.i1"), t("roadmap.p4.i2"), t("roadmap.p4.i3"), t("roadmap.p4.i4"), t("roadmap.p4.i5"), t("roadmap.p4.i6")] },
    { phase: t("roadmap.p5.phase"), title: t("roadmap.p5.title"), status: t("roadmap.p5.status"), items: [t("roadmap.p5.i1"), t("roadmap.p5.i2"), t("roadmap.p5.i3"), t("roadmap.p5.i4"), t("roadmap.p5.i5"), t("roadmap.p5.i6")] },
    { phase: t("roadmap.p6.phase"), title: t("roadmap.p6.title"), status: t("roadmap.p6.status"), items: [t("roadmap.p6.i1"), t("roadmap.p6.i2"), t("roadmap.p6.i3"), t("roadmap.p6.i4"), t("roadmap.p6.i5")] },
  ];
  return (
    <WpSection id="s8" title={t("wp.s8.title")} icon={Rocket}>
      <p>{t("wp.s8.intro")}</p>
      <div className="space-y-2">
        {phases.map((p) => (
          <div key={p.phase} className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-white/40">{p.phase}</span>
                <div className="text-sm font-semibold text-white">{p.title}</div>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] text-white/60">{p.status}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {p.items.map((it) => (
                <span key={it} className="rounded-full bg-white/[0.04] px-2.5 py-1 text-[11px] text-white/55">{it}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </WpSection>
  );
}

function Governance() {
  const { t } = useLang();
  return (
    <WpSection id="s9" title={t("wp.s9.title")} icon={Users}>
      <p>{t("wp.s9.p1")}</p>
      <p>{t("wp.s9.p2")}</p>
      <p>{t("wp.s9.p3")}</p>
      <p>{t("wp.s9.p4")}</p>
      <p>{t("wp.s9.p5")}</p>
      <p>{t("wp.s9.p6")}</p>
    </WpSection>
  );
}

function SecurityAudit() {
  const { t } = useLang();
  const items = [
    { title: t("wp.aud.i1.title"), desc: t("wp.aud.i1.desc") },
    { title: t("wp.aud.i2.title"), desc: t("wp.aud.i2.desc") },
    { title: t("wp.aud.i3.title"), desc: t("wp.aud.i3.desc") },
    { title: t("wp.aud.i4.title"), desc: t("wp.aud.i4.desc") },
    { title: t("wp.aud.i5.title"), desc: t("wp.aud.i5.desc") },
  ];
  return (
    <WpSection id="saud" title={t("wp.aud.title")} icon={ShieldAlert}>
      <p>{t("wp.aud.intro")}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((it) => (
          <div key={it.title} className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <ShieldCheck className="h-4 w-4 text-[var(--neon-blue)]" /> {it.title}
            </div>
            <p className="mt-1.5 text-xs text-white/55">{it.desc}</p>
          </div>
        ))}
      </div>
    </WpSection>
  );
}

function Security() {
  const { t } = useLang();
  const items = [
    { title: t("wp.sec.i1.title"), desc: t("wp.sec.i1.desc") },
    { title: t("wp.sec.i2.title"), desc: t("wp.sec.i2.desc") },
    { title: t("wp.sec.i3.title"), desc: t("wp.sec.i3.desc") },
    { title: t("wp.sec.i4.title"), desc: t("wp.sec.i4.desc") },
    { title: t("wp.sec.i5.title"), desc: t("wp.sec.i5.desc") },
    { title: t("wp.sec.i6.title"), desc: t("wp.sec.i6.desc") },
    { title: t("wp.sec.i7.title"), desc: t("wp.sec.i7.desc") },
  ];
  return (
    <WpSection id="ssec" title={t("wp.sec.title")} icon={ShieldCheck}>
      <p className="font-semibold text-gradient">{t("wp.sec.tagline")}</p>
      <p>{t("wp.sec.intro")}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((it) => (
          <div key={it.title} className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Check className="h-4 w-4 shrink-0 text-[var(--neon-blue)]" /> {it.title}
            </div>
            <p className="mt-1.5 text-xs text-white/55">{it.desc}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-white/50">{t("wp.sec.note.title")}</div>
        <p className="text-sm text-white/65">{t("wp.sec.note.p1")}</p>
        <p className="mt-1.5 text-sm text-white/65">{t("wp.sec.note.p2")}</p>
      </div>
    </WpSection>
  );
}

const GLOSSARY_KEYS = Array.from({ length: 13 }, (_, i) => i + 1);

function Glossary() {
  const { t } = useLang();
  return (
    <WpSection id="sgloss" title={t("wp.gloss.title")} icon={BookOpen}>
      <p>{t("wp.gloss.intro")}</p>
      <dl className="grid gap-3 sm:grid-cols-2">
        {GLOSSARY_KEYS.map((n) => (
          <div key={n} className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
            <dt className="text-sm font-semibold text-white">{t(`wp.gloss.${n}.term` as "wp.gloss.1.term")}</dt>
            <dd className="mt-1 text-xs text-white/55">{t(`wp.gloss.${n}.def` as "wp.gloss.1.def")}</dd>
          </div>
        ))}
      </dl>
    </WpSection>
  );
}

function Conclusion() {
  const { t } = useLang();
  return (
    <WpSection id="s11" title={t("wp.s11.title")} icon={Trophy}>
      <p>{t("wp.s11.p1")}</p>
      <p>{t("wp.s11.p2")}</p>
      <div className="pt-2">
        <Link to="/genesis" className="btn-neon btn-neon-hover">
          <Flame className="h-4 w-4" /> {t("wp.s11.cta")}
        </Link>
      </div>
    </WpSection>
  );
}
