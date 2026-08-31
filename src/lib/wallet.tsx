import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Tier = { name: string; min: number; rate: number; color: string };
export const TIERS: Tier[] = [
  { name: "Starter", min: 50, rate: 500, color: "#7dd3fc" },
  { name: "Bronze", min: 100, rate: 500, color: "#cd7f32" },
  { name: "Silver", min: 250, rate: 500, color: "#c0c0c0" },
  { name: "Gold", min: 500, rate: 500, color: "#facc15" },
  { name: "Diamond", min: 1000, rate: 500, color: "#67e8f9" },
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
  reservedPvp: number;
  invested: number;
  txs: Tx[];
  connect: (provider?: string) => Promise<void>;
  disconnect: () => void;
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

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [invested, setInvested] = useState(0);
  const [reservedPvp, setReserved] = useState(0);
  const [txs, setTxs] = useState<Tx[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const p = JSON.parse(raw);
        setAddress(p.address ?? null);
        setInvested(p.invested ?? 0);
        setReserved(p.reservedPvp ?? 0);
        setTxs(p.txs ?? []);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEY, JSON.stringify({ address, invested, reservedPvp, txs }));
  }, [address, invested, reservedPvp, txs]);

  async function connect() {
    setConnecting(true);
    await new Promise((r) => setTimeout(r, 700));
    setAddress(rand());
    setConnecting(false);
  }
  function disconnect() {
    setAddress(null);
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

  return (
    <WalletCtx.Provider value={{ address, connecting, reservedPvp, invested, txs, connect, disconnect, buy }}>
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