import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { GridBackground } from "@/components/Background";
import { useWallet, tierFor, shortAddr, GENESIS } from "@/lib/wallet";
import { WalletButton } from "@/components/WalletButton";
import { Countdown } from "@/components/Countdown";
import { Wallet, Trophy, Coins, Clock, ExternalLink } from "lucide-react";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Founder Dashboard — PvP Pro" },
      { name: "description", content: "Track your reserved PVP, founder tier, genesis status and transactions." },
      { property: "og:url", content: "/dashboard" },
    ],
    links: [{ rel: "canonical", href: "/dashboard" }],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { t } = useLang();
  const { address, invested, reservedPvp, txs } = useWallet();
  const tier = tierFor(invested);

  if (!address) {
    return (
      <Layout>
        <section className="relative overflow-hidden pt-20 pb-32">
          <GridBackground />
          <div className="relative mx-auto max-w-xl px-6 text-center">
            <div className="glass neon-border mx-auto rounded-3xl p-10">
              <Wallet className="mx-auto h-10 w-10 text-[var(--neon-purple)]" />
              <h1 className="mt-5 text-3xl font-bold">{t("dashboard.connect.title")}</h1>
              <p className="mt-2 text-white/60">{t("dashboard.connect.desc")}</p>
              <div className="mt-6 flex justify-center"><WalletButton /></div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="relative overflow-hidden pt-12 pb-24">
        <GridBackground />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-widest text-white/50">{t("dashboard.label")}</div>
              <h1 className="mt-1 text-3xl font-bold md:text-4xl">{t("dashboard.welcome")} <span className="text-gradient">{shortAddr(address)}</span></h1>
            </div>
            <Link to="/genesis" className="btn-ghost btn-ghost-hover text-sm">{t("dashboard.reserve.more")}</Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Wallet} label={t("dashboard.stat.wallet")} value={shortAddr(address)} sub={t("dashboard.stat.wallet.sub")} />
            <StatCard icon={Trophy} label={t("dashboard.stat.tier")} value={tier?.name ?? "—"} sub={tier ? `≥ $${tier.min}` : t("dashboard.stat.tier.unlock")} accent />
            <StatCard icon={Coins} label={t("dashboard.stat.reserved")} value={reservedPvp.toLocaleString()} sub={`$${invested.toLocaleString()} ${t("dashboard.stat.invested.suffix")}`} />
            <StatCard icon={Clock} label={t("dashboard.stat.status")} value={t("dashboard.stat.status.value")} sub={t("dashboard.stat.status.sub")} />
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[2fr_1fr]">
            <div className="glass rounded-3xl p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">{t("dashboard.tx.title")}</h2>
                <span className="text-xs text-white/40">{txs.length} {t("dashboard.tx.entries")}</span>
              </div>
              {txs.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-sm text-white/50">
                  {t("dashboard.tx.empty")} <Link to="/genesis" className="text-[var(--neon-blue)] underline-offset-4 hover:underline">{t("dashboard.tx.empty.cta")}</Link> {t("dashboard.tx.empty.suffix")}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-left text-xs uppercase tracking-widest text-white/40">
                      <tr>
                        <th className="py-2 font-medium">{t("dashboard.tx.col.tx")}</th>
                        <th className="py-2 font-medium">{t("dashboard.tx.col.amount")}</th>
                        <th className="py-2 font-medium">{t("dashboard.tx.col.pvp")}</th>
                        <th className="py-2 font-medium">{t("dashboard.tx.col.date")}</th>
                        <th className="py-2 font-medium">{t("dashboard.tx.col.status")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {txs.map((tx) => (
                        <tr key={tx.id} className="border-t border-white/5">
                          <td className="py-3 font-mono text-xs text-white/70 flex items-center gap-1">{tx.id}<ExternalLink className="h-3 w-3 opacity-40" /></td>
                          <td className="py-3">${tx.amount.toLocaleString()}</td>
                          <td className="py-3">{tx.pvp.toLocaleString()}</td>
                          <td className="py-3 text-white/60">{new Date(tx.date).toLocaleString()}</td>
                          <td className="py-3">
                            <span className="rounded-full bg-[var(--neon-purple)]/15 px-2 py-0.5 text-xs text-[var(--neon-purple)] ring-1 ring-[var(--neon-purple)]/30">
                              {tx.status === "Confirmed" ? t("dashboard.tx.status.confirmed") : t("dashboard.tx.status.reserved")}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="space-y-5">
              <div className="glass rounded-3xl p-6">
                <div className="text-xs uppercase tracking-widest text-white/50">{t("dashboard.claim.opens")}</div>
                <div className="mt-3"><Countdown to={GENESIS.launchDate} /></div>
                <Link to="/claim" className="btn-ghost btn-ghost-hover mt-4 w-full text-sm">{t("dashboard.claim.goto")}</Link>
              </div>
              <div className="glass rounded-3xl p-6">
                <div className="text-xs uppercase tracking-widest text-white/50">{t("dashboard.perks.title")}</div>
                <ul className="mt-3 space-y-2 text-sm text-white/70">
                  <li>• {t("dashboard.perks.badge")}</li>
                  <li>• {t("dashboard.perks.nft")}</li>
                  <li>• {t("dashboard.perks.tournament")}</li>
                  {tier && tier.min >= 250 && <li>• {t("dashboard.perks.governance")}</li>}
                  {tier && tier.min >= 500 && <li>• {t("dashboard.perks.revshare")}</li>}
                  {tier && tier.min >= 1000 && <li>• {t("dashboard.perks.council")}</li>}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function StatCard({
  icon: Icon, label, value, sub, accent,
}: {
  icon: typeof Wallet; label: string; value: string; sub?: string; accent?: boolean;
}) {
  return (
    <div className={`rounded-3xl p-5 ${accent ? "neon-border bg-gradient-to-b from-[var(--neon-purple)]/15 to-transparent" : "glass"}`}>
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/50">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className="text-silver mt-2 text-2xl font-bold tracking-tight">{value}</div>
      {sub && <div className="mt-1 text-xs text-white/45">{sub}</div>}
    </div>
  );
}
