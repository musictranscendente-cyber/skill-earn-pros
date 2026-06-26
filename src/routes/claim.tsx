import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { GridBackground } from "@/components/Background";
import { Countdown } from "@/components/Countdown";
import { useWallet, GENESIS } from "@/lib/wallet";
import { WalletButton } from "@/components/WalletButton";
import { Lock, Sparkles } from "lucide-react";

export const Route = createFileRoute("/claim")({
  head: () => ({
    meta: [
      { title: "Claim Portal — PvP Pro" },
      { name: "description", content: "Claim your reserved PVP tokens after the Genesis Sale concludes at TGE." },
      { property: "og:url", content: "/claim" },
    ],
    links: [{ rel: "canonical", href: "/claim" }],
  }),
  component: Claim,
});

function Claim() {
  const { address, reservedPvp } = useWallet();
  return (
    <Layout>
      <section className="relative overflow-hidden pt-16 pb-32">
        <GridBackground />
        <div className="relative mx-auto max-w-3xl px-6">
          <div className="glass neon-border rounded-3xl p-8 md:p-12">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/60">
              <Sparkles className="h-3 w-3 text-[var(--neon-blue)]" /> Claim Portal
            </div>
            <h1 className="text-balance text-4xl font-extrabold md:text-5xl">
              <span className="text-silver">Your tokens, </span><span className="text-gradient">unlocked at TGE</span>.
            </h1>
            <p className="mt-4 text-white/60">Claim opens automatically once the Genesis Sale concludes and the audited claim contract is deployed.</p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <Box label="Reserved tokens" value={`${reservedPvp.toLocaleString()} PVP`} />
              <Box label="Status" value="Locked · pending TGE" />
            </div>

            <div className="mt-6">
              <div className="text-xs uppercase tracking-widest text-white/50">Unlocks in</div>
              <div className="mt-3"><Countdown to={GENESIS.launchDate} /></div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button disabled className="btn-neon flex-1 cursor-not-allowed opacity-50">
                <Lock className="h-4 w-4" /> Claim PVP
              </button>
              {!address && <WalletButton />}
            </div>
            <p className="mt-3 text-xs text-white/40">Claim button will activate at launch. Connect your wallet to verify your reserved allocation.</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function Box({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/[0.03] p-5 ring-1 ring-white/5">
      <div className="text-xs uppercase tracking-widest text-white/50">{label}</div>
      <div className="text-silver mt-2 text-xl font-bold">{value}</div>
    </div>
  );
}