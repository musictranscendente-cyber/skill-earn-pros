import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { GridBackground } from "@/components/Background";
import { Countdown } from "@/components/Countdown";
import { TIERS, GENESIS, tierFor, useWallet } from "@/lib/wallet";
import { WalletButton } from "@/components/WalletButton";
import { Check, Flame } from "lucide-react";
import { toast } from "sonner";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/genesis")({
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

const AMOUNTS = [50, 100, 250, 500, 1000];

function GenesisPage() {
  const { t } = useLang();
  const { address, buy } = useWallet();
  const [amount, setAmount] = useState(250);
  const tier = tierFor(amount);
  const pvp = Math.floor(amount / GENESIS.price);
  const raised = 3_247_891.63;
  const pct = Math.min(100, (raised / GENESIS.hardCap) * 100);

  function submit() {
    if (!address) return toast.error(t("genesis.toast.connect"));
    buy(amount);
    toast.success(`${t("genesis.toast.reserved.prefix")} ${pvp.toLocaleString()} PVP · ${tier?.name ?? "Starter"} ${t("genesis.toast.reserved.tier")}`);
  }

  return (
    <Layout>
      <section className="relative overflow-hidden pt-12 pb-24">
        <GridBackground />
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
            <div className="glass neon-border rounded-3xl p-6 md:p-8">
              <div className="mb-2 text-xs uppercase tracking-widest text-white/50">{t("genesis.amount.label")}</div>
              <div className="flex flex-wrap gap-2">
                {AMOUNTS.map((a) => (
                  <button
                    key={a}
                    onClick={() => setAmount(a)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${amount === a ? "border-[var(--neon-purple)] bg-[var(--neon-purple)]/15 text-white" : "border-white/10 bg-white/[0.03] text-white/70 hover:text-white"}`}
                  >
                    ${a}
                  </button>
                ))}
              </div>
              <div className="mt-6">
                <label className="text-xs uppercase tracking-widest text-white/50">{t("genesis.custom.label")}</label>
                <input
                  type="number"
                  value={amount}
                  min={50}
                  onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-2xl font-bold text-white outline-none focus:border-[var(--neon-purple)]"
                />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
                <Mini label={t("genesis.receive")} value={`${pvp.toLocaleString()} PVP`} />
                <Mini label={t("genesis.price")} value={`$${GENESIS.price}`} />
                <Mini label={t("genesis.tier")} value={tier?.name ?? "—"} accent />
              </div>

              <button onClick={submit} className="btn-neon btn-neon-hover mt-7 w-full">
                <Check className="h-4 w-4" /> {t("genesis.confirm")}
              </button>
              {!address && (
                <div className="mt-3 flex items-center justify-between rounded-2xl border border-yellow-500/20 bg-yellow-500/5 px-4 py-3 text-sm text-yellow-200/80">
                  {t("genesis.connect.prompt")}
                  <WalletButton />
                </div>
              )}
              <p className="mt-3 text-center text-xs text-white/40">{t("genesis.demo.note")}</p>
            </div>

            <div className="space-y-4">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-6">
                <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-widest text-white/50">
                  <span>{t("genesis.progress.label")}</span><span>{pct.toFixed(1)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                  <div style={{ width: `${pct}%` }} className="h-full rounded-full bg-gradient-to-r from-[var(--neon-purple)] to-[var(--neon-blue)] shadow-[0_0_24px_rgba(138,46,255,0.6)]" />
                </div>
                <div className="mt-3 flex justify-between text-sm text-white/70">
                  <span>${raised.toLocaleString()} {t("genesis.raised.suffix")}</span>
                  <span>${GENESIS.hardCap.toLocaleString()} {t("genesis.cap.suffix")}</span>
                </div>
              </motion.div>
              <div className="glass rounded-3xl p-6">
                <div className="text-xs uppercase tracking-widest text-white/50">{t("genesis.countdown.label")}</div>
                <div className="mt-3"><Countdown to={GENESIS.launchDate} /></div>
              </div>
              <div className="glass rounded-3xl p-6">
                <div className="mb-3 text-xs uppercase tracking-widest text-white/50">{t("genesis.tier.ladder")}</div>
                <div className="space-y-2">
                  {TIERS.map((tr) => (
                    <div key={tr.name} className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm ${tier?.name === tr.name ? "bg-[var(--neon-purple)]/15 ring-1 ring-[var(--neon-purple)]/40" : ""}`}>
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ background: tr.color, boxShadow: `0 0 8px ${tr.color}` }} />
                        {tr.name}
                      </span>
                      <span className="text-white/60">${tr.min}+</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function Mini({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl p-4 ${accent ? "bg-gradient-to-br from-[var(--neon-purple)]/20 to-[var(--neon-blue)]/10 ring-1 ring-[var(--neon-purple)]/30" : "bg-white/[0.03] ring-1 ring-white/5"}`}>
      <div className="text-[10px] uppercase tracking-widest text-white/50">{label}</div>
      <div className="text-silver mt-1 text-lg font-bold">{value}</div>
    </div>
  );
}
