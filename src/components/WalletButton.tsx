import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, X, Check, Copy, AlertTriangle, ExternalLink } from "lucide-react";
import { useWallet, shortAddr, BUY_ERROR, type EIP6963ProviderDetail } from "@/lib/wallet";
import { useLang } from "@/lib/i18n";
import { toast } from "sonner";

export function WalletButton() {
  const {
    address,
    connect,
    availableWallets,
    connectWalletConnect,
    walletConnectAvailable,
    connecting,
    disconnect,
    hasProvider,
    wrongNetwork,
    switchToBase,
  } = useWallet();
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  // 14/09/2026: o modal precisa ser "teleportado" pra fora do Navbar via portal — o
  // <header> do site tem `backdrop-blur-xl` pro efeito de vidro dele, e um blur/filtro num
  // elemento PAI faz o navegador tratar `position: fixed` de dentro dele como relativo a
  // esse elemento, não à tela toda (regra do CSS, não é bug do layout em si). Resultado
  // reportado pelo usuário: o fundo escurecido do modal ficava preso dentro do cabeçalho em
  // vez de cobrir a página inteira, deixando o conteúdo por trás visível/"misturado".
  // `mounted` evita chamar `document` durante o SSR (o servidor não tem DOM).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // 17/09/2026: usado tanto pelo botão único (carteira detectada por
  // `getInjectedProvider()`, sem ambiguidade) quanto por cada item da lista de
  // `availableWallets` (EIP-6963) quando há mais de uma extensão instalada — `wallet`
  // ausente = comportamento de sempre, `wallet` presente = conecta com ESSA extensão
  // específica (ver comentário em `connect()` em wallet.tsx).
  async function handleConnect(wallet?: EIP6963ProviderDetail) {
    try {
      await connect(wallet);
      setOpen(false);
    } catch (err) {
      if (err instanceof Error && err.message === BUY_ERROR.WALLET_TIMEOUT) {
        toast.error(t("wallet.connect.timeout"));
      }
    }
  }

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

  const modal = (
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
                  availableWallets.length > 1 ? (
                    // 17/09/2026: mais de uma extensão detectada via EIP-6963 (ex: MetaMask +
                    // Bybit Wallet) — mostra uma opção clicável PRA CADA UMA (nome + ícone
                    // próprios), em vez do botão genérico único de antes, que deixava o site
                    // "chutar" qual usar e podia abrir a errada (bug relatado pelo usuário:
                    // clicou em conectar e abriu a Bybit Wallet, que ele nem tinha conta).
                    <div className="space-y-2">
                      {availableWallets.map((wallet) => (
                        <button
                          key={wallet.info.uuid}
                          disabled={connecting}
                          onClick={() => handleConnect(wallet)}
                          className="glass flex w-full items-center justify-between rounded-2xl p-4 transition hover:border-[color:var(--neon-purple)]/60 disabled:opacity-50"
                        >
                          <span className="flex items-center gap-3">
                            {wallet.info.icon ? (
                              <img src={wallet.info.icon} alt="" className="h-6 w-6 rounded-md" />
                            ) : (
                              <span className="text-2xl">🦊</span>
                            )}
                            <span className="font-medium">{wallet.info.name}</span>
                          </span>
                          <span className="text-xs text-white/40">
                            {connecting ? t("wallet.connecting") : t("wallet.detected")}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                  <button
                    disabled={connecting}
                    onClick={() => handleConnect(availableWallets[0])}
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
                  )
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

                {walletConnectAvailable ? (
                  // 17/09/2026: WalletConnect ligado — o caminho que funciona pra comprar
                  // pelo celular (QR Code / abre a carteira do telefone direto). Mesmo
                  // visual/comportamento do botão da MetaMask acima, só que chamando
                  // `connectWalletConnect()` em vez de `connect()`.
                  <button
                    disabled={connecting}
                    onClick={async () => {
                      try {
                        await connectWalletConnect();
                        setOpen(false);
                      } catch (err) {
                        if (err instanceof Error && err.message === BUY_ERROR.WALLET_TIMEOUT) {
                          toast.error(t("wallet.connect.timeout"));
                        }
                      }
                    }}
                    className="glass flex w-full items-center justify-between rounded-2xl p-4 transition hover:border-[color:var(--neon-purple)]/60 disabled:opacity-50"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-2xl">🔗</span>
                      <span className="font-medium">WalletConnect</span>
                    </span>
                    <span className="text-xs text-white/40">
                      {connecting ? t("wallet.connecting") : t("wallet.walletconnect.hint")}
                    </span>
                  </button>
                ) : (
                  <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-sm text-white/30">
                    <span className="flex items-center gap-3">
                      <span className="text-2xl grayscale">🔗</span>
                      <span className="font-medium">WalletConnect</span>
                    </span>
                    <span className="text-xs">{t("wallet.comingsoon")}</span>
                  </div>
                )}
              </div>

              <p className="mt-5 text-center text-xs text-white/40">{t("wallet.demo.note")}</p>
            </motion.div>
          </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-neon btn-neon-hover text-sm">
        <Wallet className="h-4 w-4" />
        {t("wallet.connect")}
      </button>
      {mounted && createPortal(modal, document.body)}
    </>
  );
}
