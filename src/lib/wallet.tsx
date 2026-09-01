import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Tier = { name: string; min: number; rate: number; color: string };
export const TIERS: Tier[] = [
  { name: "Starter", min: 50, rate: 500, color: "#7dd3fc" },
  { name: "Bronze", min: 100, rate: 500, color: "#cd7f32" },
  { name: "Silver", min: 250, rate: 500, color: "#c0c0c0" },
  { name: "Gold", min: 500, rate: 500, color: "#facc15" },
  { name: "Diamond", min: 1000, rate: 500, color: "#C13BFF" },
];

export function tierFor(amount: number): Tier | null {
  let current: Tier | null = null;
  for (const t of TIERS) if (amount >= t.min) current = t;
  return current;
}

export type Tx = { id: string; amount: number; pvp: number; date: string; status: "Reserved" | "Confirmed" };

export type WalletState = {
  address: string | null;
  connecting: boolean;
  /** True once a browser wallet extension (MetaMask, Coinbase Wallet, etc.) is detected. */
  hasProvider: boolean;
  chainId: number | null;
  /** True when connected but on a chain other than Base. */
  wrongNetwork: boolean;
  reservedPvp: number;
  invested: number;
  txs: Tx[];
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToBase: () => Promise<void>;
  buy: (amountUsd: number) => void;
};

const WalletCtx = createContext<WalletState | null>(null);
const KEY = "pvp_wallet_v1";

function rand(): string {
  const chars = "0123456789abcdef";
  let s = "0x";
  for (let i = 0; i < 40; i++) s += chars[Math.floor(Math.random() * 16)];
  return s;
}

// --- Base network (chosen chain for PvP Pro — see project master doc) ---
export const BASE_CHAIN_ID = 8453;
const BASE_CHAIN_ID_HEX = "0x2105";
const BASE_CHAIN_PARAMS = {
  chainId: BASE_CHAIN_ID_HEX,
  chainName: "Base",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: ["https://mainnet.base.org"],
  blockExplorerUrls: ["https://basescan.org"],
};

/** Minimal EIP-1193 shape — the interface every injected wallet (MetaMask, Coinbase Wallet, Brave, …) implements. */
type EIP1193Provider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
};

declare global {
  interface Window {
    ethereum?: EIP1193Provider;
  }
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [hasProvider, setHasProvider] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);
  const [invested, setInvested] = useState(0);
  const [reservedPvp, setReserved] = useState(0);
  const [txs, setTxs] = useState<Tx[]>([]);

  // Genesis purchase history stays local/demo (see genesis.tsx) until the audited
  // Genesis Sale contract is live — only the wallet connection below is real.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const p = JSON.parse(raw);
        setInvested(p.invested ?? 0);
        setReserved(p.reservedPvp ?? 0);
        setTxs(p.txs ?? []);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEY, JSON.stringify({ invested, reservedPvp, txs }));
  }, [invested, reservedPvp, txs]);

  // Detect an injected wallet and silently pick up an already-authorized account
  // (eth_accounts never prompts — it just reports prior approvals), then keep
  // address/network in sync with wallet-side changes.
  useEffect(() => {
    const eth = window.ethereum;
    if (!eth) return;
    setHasProvider(true);

    (async () => {
      try {
        const accounts = (await eth.request({ method: "eth_accounts" })) as string[];
        if (accounts[0]) setAddress(accounts[0]);
        const hex = (await eth.request({ method: "eth_chainId" })) as string;
        setChainId(parseInt(hex, 16));
      } catch {}
    })();

    const onAccountsChanged = (...args: unknown[]) => {
      const accounts = args[0] as string[];
      setAddress(accounts[0] ?? null);
    };
    const onChainChanged = (...args: unknown[]) => {
      setChainId(parseInt(args[0] as string, 16));
    };
    eth.on?.("accountsChanged", onAccountsChanged);
    eth.on?.("chainChanged", onChainChanged);
    return () => {
      eth.removeListener?.("accountsChanged", onAccountsChanged);
      eth.removeListener?.("chainChanged", onChainChanged);
    };
  }, []);

  async function connect() {
    const eth = window.ethereum;
    if (!eth) {
      setHasProvider(false);
      return;
    }
    setConnecting(true);
    try {
      const accounts = (await eth.request({ method: "eth_requestAccounts" })) as string[];
      setAddress(accounts[0] ?? null);
      const hex = (await eth.request({ method: "eth_chainId" })) as string;
      setChainId(parseInt(hex, 16));
    } catch (err) {
      console.error("[wallet] connect failed", err);
    } finally {
      setConnecting(false);
    }
  }

  function disconnect() {
    // Injected wallets have no real "disconnect" RPC — this only clears local UI state.
    // The wallet extension itself stays authorized until the user revokes it there.
    setAddress(null);
  }

  async function switchToBase() {
    const eth = window.ethereum;
    if (!eth) return;
    try {
      await eth.request({ method: "wallet_switchEthereumChain", params: [{ chainId: BASE_CHAIN_ID_HEX }] });
    } catch (err) {
      const code = (err as { code?: number } | null)?.code;
      if (code === 4902) {
        try {
          await eth.request({ method: "wallet_addEthereumChain", params: [BASE_CHAIN_PARAMS] });
        } catch (addErr) {
          console.error("[wallet] add Base chain failed", addErr);
        }
      } else {
        console.error("[wallet] switch chain failed", err);
      }
    }
  }

  function buy(amountUsd: number) {
    const pvp = Math.floor(amountUsd / 0.002);
    setInvested((v) => v + amountUsd);
    setReserved((v) => v + pvp);
    setTxs((v) => [
      { id: rand().slice(0, 12), amount: amountUsd, pvp, date: new Date().toISOString(), status: "Reserved" },
      ...v,
    ]);
  }

  const wrongNetwork = address !== null && chainId !== null && chainId !== BASE_CHAIN_ID;

  return (
    <WalletCtx.Provider
      value={{
        address,
        connecting,
        hasProvider,
        chainId,
        wrongNetwork,
        reservedPvp,
        invested,
        txs,
        connect,
        disconnect,
        switchToBase,
        buy,
      }}
    >
      {children}
    </WalletCtx.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletCtx);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}

export function shortAddr(a: string) {
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

export const GENESIS = {
  price: 0.002,
  hardCap: 10_000_000,
  genesisAllocation: 100_000_000,
  supply: 1_000_000_000,
  launchDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString(),
};