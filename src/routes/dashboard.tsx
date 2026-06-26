import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { GridBackground } from "@/components/Background";
import { useWallet, tierFor, shortAddr, GENESIS } from "@/lib/wallet";
import { WalletButton } from "@/components/WalletButton";
import { Countdown } from "@/components/Countdown";
import { Wallet, Trophy, Coins, Clock, ExternalLink } from "lucide-react";

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
              <h1 className="mt-5 text-3xl font-bold">Connect your wallet</h1>
              <p className="mt-2 text-white/60">Sign in to view your founder dashboard, reserved PVP and claim status.</p>
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
              <div className="text-xs uppercase tracking-widest text-white/50">Founder Dashboard</div>
              <h1 className="mt-1 text-3xl font-bold md:text-4xl">Welcome back, <span className="text-gradient">{shortAddr(address)}</span></h1>
            </div>
            <Link to="/genesis" className="btn-ghost btn-ghost-hover text-sm">Reserve more PVP</Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={Wallet} label="Wallet" value={shortAddr(address)} sub="Base Mainnet" />
            <StatCard icon={Trophy} label="Founder tier" value={tier?.name ?? "—"} sub={tier ? `≥ $${tier.min}` : "Reserve to unlock"} accent />
            <StatCard icon={Coins} label="Reserved PVP" value={reservedPvp.toLocaleString()} sub={`$${invested.toLocaleString()} invested`} />
            <StatCard icon={Clock} label="Genesis status" value="Pending TGE" sub="Claim locked" />
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[2fr_1fr]">
            <div className="glass rounded-3xl p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Transaction history</h2>
                <span className="text-xs text-white/40">{txs.length} entries</span>
              </div>
              {txs.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-sm text-white/50">
                  No transactions yet. <Link to="/genesis" className="text-[var(--neon-blue)] underline-offset-4 hover:underline">Reserve PVP</Link> to see your activity here.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-left text-xs uppercase tracking-widest text-white/40">
                      <tr>
                        <th className="py-2 font-medium">Tx</th>
                        <th className="py-2 font-medium">Amount</th>
                        <th className="py-2 font-medium">PVP</th>
                        <th className="py-2 font-medium">Date</th>
                        <th className="py-2 font-medium">Status</th>
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
                            <span className="rounded-full bg-[var(--neon-purple)]/15 px-2 py-0.5 text-xs text-[var(--neon-purple)] ring-1 ring-[var(--neon-purple)]/30">{tx.status}</span>
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
                <div className="text-xs uppercase tracking-widest text-white/50">Claim opens in</div>
                <div className="mt-3"><Countdown to={GENESIS.launchDate} /></div>
                <Link to="/claim" className="btn-ghost btn-ghost-hover mt-4 w-full text-sm">Go to claim portal</Link>
              </div>
              <div className="glass rounded-3xl p-6">
                <div className="text-xs uppercase tracking-widest text-white/50">Tier perks</div>
                <ul className="mt-3 space-y-2 text-sm text-white/70">
                  <li>• Lifetime founder badge</li>
                  <li>• Season 0 NFT airdrop</li>
                  <li>• Tournament early access</li>
                  {tier && tier.min >= 250 && <li>• Governance weight</li>}
                  {tier && tier.min >= 500 && <li>• Revenue share allocation</li>}
                  {tier && tier.min >= 1000 && <li>• Founders council seat</li>}
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