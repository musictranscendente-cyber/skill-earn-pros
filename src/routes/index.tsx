import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Sword, Trophy, Coins, Users, ShieldCheck, Zap, TrendingUp, AlertTriangle,
  Flame, Rocket, ArrowRight, ArrowDown, FileText, ChevronDown,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { Section } from "@/components/Section";
import { GridBackground } from "@/components/Background";
import { Countdown } from "@/components/Countdown";
import { TIERS, GENESIS } from "@/lib/wallet";
import { useLang } from "@/lib/i18n";
import { useState } from "react";

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

function Index() {
  return (
    <Layout>
      <Hero />
      <Problem />
      <Solution />
      <Economy />
      <Tokenomics />
      <Tiers />
      <Roadmap />
      <FAQ />
    </Layout>
  );
}

function Hero() {
  const { t } = useLang();
  const raised = 84_320;
  const pct = Math.min(100, (raised / GENESIS.hardCap) * 100);
  return (
    <section className="relative overflow-hidden pt-20 pb-28 md:pt-32 md:pb-40">
      <GridBackground />
      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div variants={fadeUp} className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/70">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--neon-purple)] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--neon-purple)]" />
            </span>
            {t("hero.badge")}
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-balance text-5xl font-extrabold leading-[1.02] tracking-tighter md:text-7xl lg:text-[96px]"
          >
            <span className="text-silver">{t("hero.title1")}</span>{" "}
            <span className="text-gradient drop-shadow-[0_0_40px_rgba(138,46,255,0.35)]">{t("hero.title2")}</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="mx-auto mt-8 max-w-2xl text-pretty text-base leading-relaxed text-white/65 md:text-lg md:leading-relaxed">
            {t("hero.subtitle")}
          </motion.p>
          <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link to="/genesis" className="btn-neon btn-neon-hover">
              <Flame className="h-4 w-4" /> {t("hero.cta.founder")}
            </Link>
            <a href="#" className="btn-ghost btn-ghost-hover">
              <FileText className="h-4 w-4" /> {t("hero.cta.whitepaper")}
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="glass neon-border mx-auto mt-20 max-w-5xl rounded-3xl p-6 md:p-8"
        >
          <div className="grid gap-6 md:grid-cols-4">
            <Stat label={t("hero.stat.price")} value="$0.002" sub={t("hero.stat.price.sub")} />
            <Stat label={t("hero.stat.cap")} value="$200,000" sub={t("hero.stat.cap.sub")} />
            <Stat label={t("hero.stat.raised")} value={`$${raised.toLocaleString()}`} sub={`${pct.toFixed(1)}% ${t("hero.stat.raised.suffix")}`} />
            <div>
              <div className="text-xs uppercase tracking-widest text-white/50">{t("hero.stat.launch")}</div>
              <div className="mt-2"><Countdown to={GENESIS.launchDate} /></div>
            </div>
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

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-white/50">{label}</div>
      <div className="text-silver mt-2 text-3xl font-bold tracking-tight md:text-4xl">{value}</div>
      {sub && <div className="mt-1 text-xs text-white/45">{sub}</div>}
    </div>
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
    >
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="glass group relative overflow-hidden rounded-2xl p-6"
          >
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[var(--neon-purple)]/10 blur-2xl transition group-hover:bg-[var(--neon-purple)]/30" />
            <div className="relative">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.04] text-[var(--neon-purple)]">
                <it.icon className="h-5 w-5" />
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
    { icon: Sword, title: t("solution.item1.title"), desc: t("solution.item1.desc") },
    { icon: ShieldCheck, title: t("solution.item2.title"), desc: t("solution.item2.desc") },
    { icon: Users, title: t("solution.item3.title"), desc: t("solution.item3.desc") },
    { icon: Trophy, title: t("solution.item4.title"), desc: t("solution.item4.desc") },
    { icon: Coins, title: t("solution.item5.title"), desc: t("solution.item5.desc") },
    { icon: Zap, title: t("solution.item6.title"), desc: t("solution.item6.desc") },
  ];
  return (
    <Section
      id="solution"
      eyebrow={t("solution.eyebrow")}
      title={<>{t("solution.title1")} <span className="text-gradient">{t("solution.title2")}</span>.</>}
      subtitle={t("solution.subtitle")}
    >
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {pillars.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="glass relative rounded-2xl p-6 transition hover:-translate-y-1 hover:border-[var(--neon-purple)]/40"
          >
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--neon-purple)]/30 to-[var(--neon-blue)]/20 text-white">
              <p.icon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold">{p.title}</h3>
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
    >
      <div className="glass neon-border rounded-3xl p-6 md:p-10">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-7">
          {flow.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--neon-purple)]/30 to-[var(--neon-blue)]/30 ring-1 ring-white/10">
                <step.icon className="h-6 w-6 text-white" />
              </div>
              <div className="mt-3 text-sm font-semibold">{step.label}</div>
              <div className="text-xs text-white/45">{step.desc}</div>
              {i < flow.length - 1 && (
                <>
                  <div className="absolute right-[-14px] top-7 hidden md:block">
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
    >
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div className="grid grid-cols-2 gap-4">
          <Card label={t("tokenomics.supply")} value="1,000,000,000" sub="PVP" />
          <Card label={t("tokenomics.price")} value="$0.002" sub={t("tokenomics.price.sub")} />
          <Card label={t("tokenomics.allocation")} value="100,000,000" sub={t("tokenomics.allocation.sub")} />
          <Card label={t("tokenomics.network")} value="Base" sub={t("tokenomics.network.sub")} />
        </div>
        <div className="glass relative flex items-center justify-center rounded-3xl p-8">
          <div
            className="relative h-64 w-64 rounded-full"
            style={{ background: `conic-gradient(${conic})` }}
          >
            <div className="absolute inset-6 flex flex-col items-center justify-center rounded-full bg-[#0b1020] ring-1 ring-white/10">
              <div className="text-xs uppercase tracking-widest text-white/50">{t("tokenomics.center.label")}</div>
              <div className="text-silver text-2xl font-bold">1B PVP</div>
            </div>
          </div>
          <div className="absolute -bottom-2 left-0 right-0 mx-auto grid max-w-md grid-cols-2 gap-x-4 gap-y-2 px-6 text-xs">
            {allocations.map((a) => (
              <div key={a.label} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-sm" style={{ background: a.color }} />
                <span className="text-white/70">{a.label}</span>
                <span className="ml-auto text-white/40">{a.pct}%</span>
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
    >
      <div className="grid gap-5 md:grid-cols-3 lg:grid-cols-5">
        {TIERS.map((tItem, i) => {
          const featured = tItem.name === "Gold";
          const pvp = (tItem.min / 0.002).toLocaleString();
          return (
            <motion.div
              key={tItem.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
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
                <li>• {t("tiers.benefit.badge")}</li>
                <li>• {t("tiers.benefit.tournament")}</li>
                {tItem.min >= 250 && <li>• {t("tiers.benefit.governance")}</li>}
                {tItem.min >= 500 && <li>• {t("tiers.benefit.revshare")}</li>}
                {tItem.min >= 1000 && <li>• {t("tiers.benefit.council")}</li>}
              </ul>
              <Link to="/genesis" className={`mt-6 block rounded-full py-2.5 text-center text-sm font-semibold ${featured ? "btn-neon btn-neon-hover" : "btn-ghost btn-ghost-hover"}`}>
                {t("tiers.reserve")} {tItem.name}
              </Link>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}

function Roadmap() {
  const { t } = useLang();
  const phases = [
    { phase: "Phase 1", title: t("roadmap.p1.title"), items: [t("roadmap.p1.i1"), t("roadmap.p1.i2"), t("roadmap.p1.i3"), t("roadmap.p1.i4")], status: t("roadmap.p1.status") },
    { phase: "Phase 2", title: t("roadmap.p2.title"), items: [t("roadmap.p2.i1"), t("roadmap.p2.i2"), t("roadmap.p2.i3")], status: t("roadmap.p2.status") },
    { phase: "Phase 3", title: t("roadmap.p3.title"), items: [t("roadmap.p3.i1"), t("roadmap.p3.i2"), t("roadmap.p3.i3")], status: t("roadmap.p3.status") },
    { phase: "Phase 4", title: t("roadmap.p4.title"), items: [t("roadmap.p4.i1"), t("roadmap.p4.i2"), t("roadmap.p4.i3")], status: t("roadmap.p4.status") },
    { phase: "Phase 5", title: t("roadmap.p5.title"), items: [t("roadmap.p5.i1"), t("roadmap.p5.i2"), t("roadmap.p5.i3")], status: t("roadmap.p5.status") },
  ];
  return (
    <Section
      id="roadmap"
      eyebrow={t("roadmap.eyebrow")}
      title={<>{t("roadmap.title1")} <span className="text-gradient">{t("roadmap.title2")}</span>.</>}
      subtitle={t("roadmap.subtitle")}
    >
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
