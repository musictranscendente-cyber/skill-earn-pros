import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, X, Check, Copy, AlertTriangle, ExternalLink } from "lucide-react";
import { useWallet, shortAddr } from "@/lib/wallet";
import { useLang } from "@/lib/i18n";

export function WalletButton() {
  const { address, connect, connecting, disconnect, hasProvider, wrongNetwork, switchToBase } = useWallet();
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (address) {
    return (
      <div className="flex items-center gap-2">
        {wrongNetwork && (
          <button
            onClick={switchToBase}
            className="flex items-center gap-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-xs font-medium text-yellow-200 transition hover:bg-yellow-500/15"
          >
            <AlertTriangle className="h-3.5 w-3.5" /> {t("wallet.switch.base")}
          </button>
        )}
        <button
          onClick={() => {
            navigator.clipboard.writeText(address);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
          }}
          className="glass neon-border flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
          {shortAddr(address)}
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 opacity-60" />}
          <span
            onClick={(e) => {
              e.stopPropagation();
              disconnect();
            }}
            className="ml-1 cursor-pointer rounded-full p-1 opacity-50 hover:opacity-100"
            role="button"
            aria-label={t("wallet.disconnect")}
          >
            <X className="h-3.5 w-3.5" />
          </span>
        </button>
      </div>
    );
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-neon btn-neon-hover text-sm">
        <Wallet className="h-4 w-4" />
        {t("wallet.connect")}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass neon-border w-full max-w-md rounded-3xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-1 flex items-center justify-between">
                <h3 className="text-lg font-semibold">{t("wallet.modal.title")}</h3>
                <button onClick={() => setOpen(false)} className="text-white/50 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="mb-5 text-sm text-white/60">{t("wallet.modal.desc")}</p>

              <div className="space-y-2">
                {hasProvider ? (
                  <button
                    disabled={connecting}
                    onClick={async () => {
                      await connect();
                      setOpen(false);
                    }}
                    className="glass flex w-full items-center justify-between rounded-2xl p-4 transition hover:border-[color:var(--neon-purple)]/60 disabled:opacity-50"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-2xl">🦊</span>
                      <span className="font-medium">{t("wallet.browser.wallet")}</span>
                    </span>
                    <span className="text-xs text-white/40">
                      {connecting ? t("wallet.connecting") : t("wallet.detected")}
                    </span>
                  </button>
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/60">
                    <p>{t("wallet.notfound.desc")}</p>
                    <a
                      href="https://metamask.io/download/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--neon-purple)] hover:underline"
                    >
                      {t("wallet.notfound.cta")} <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                )}

                <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-sm text-white/30">
                  <span className="flex items-center gap-3">
                    <span className="text-2xl grayscale">🔗</span>
                    <span className="font-medium">WalletConnect</span>
                  </span>
                  <span className="text-xs">{t("wallet.comingsoon")}</span>
                </div>
              </div>

              <p className="mt-5 text-center text-xs text-white/40">{t("wallet.demo.note")}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
