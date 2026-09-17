import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useMotionValue, useSpring } from "framer-motion";
import {
  ASSETS,
  assetConfigured,
  BASE_SEPOLIA_CHAIN_ID,
  BASE_SEPOLIA_CHAIN_PARAMS,
  type AssetKey,
  approveAsset,
  buyWithEthOnChain,
  buyWithTokenOnChain,
  genesisOnChainReady,
  getAllowance,
  getAssetBalance,
  getAssetPriceUsd18,
  getGenesisFounderCount,
  getGenesisOnChainStats,
  getPositionOf,
  getSaleActive,
  getWalletHistory,
  TESTNET_MODE,
  usdToAssetAmount,
  waitForReceipt,
} from "./genesisContract";
import { logPurchaseReferral } from "./referral";

export type { AssetKey } from "./genesisContract";
export { ACTIVE_EXPLORER_URL, ASSETS, assetConfigured } from "./genesisContract";

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

export type Tx = {
  id: string;
  amount: number;
  pvp: number;
  date: string;
  status: "Reserved" | "Confirmed" | "Failed";
  /** Hash real da transação — só existe para compras feitas de verdade na testnet
   *  (a via local/simulada, usada enquanto o contrato não está configurado, não tem hash). */
  hash?: string;
  /** "grant" = Tier dado de graça via `grantPosition` (ex: parceria com youtuber),
   *  detectado a partir do histórico on-chain (getWalletHistory). Ausente = compra normal
   *  (inclui as compras locais/simuladas, que nunca são grant). */
  kind?: "purchase" | "grant";
};

/** Junta o histórico oficial vindo do contrato (`getWalletHistory`, sempre com hash
 *  real) com o que já estava no estado local. Uma entrada local com o MESMO hash de
 *  uma entrada on-chain é substituída pela versão on-chain (data/hora real do bloco,
 *  em vez do horário em que o navegador disparou a transação) — evita duplicar a
 *  mesma compra na lista. Entradas sem hash (reserva local/simulada, de antes do
 *  contrato estar configurado) e falhas locais sem evento correspondente na chain
 *  são mantidas como estavam.
 */
function mergeOnChainHistory(prev: Tx[], chainTxs: Tx[]): Tx[] {
  const chainHashes = new Set(chainTxs.map((t) => t.hash));
  const rest = prev.filter((t) => !(t.hash && chainHashes.has(t.hash)));
  return [...chainTxs, ...rest].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** Erros "esperados" do fluxo de compra on-chain — genesis.tsx usa `error.message`
 *  pra decidir qual toast mostrar em vez de um texto genérico de erro. */
export const BUY_ERROR = {
  NO_WALLET: "NO_WALLET",
  WRONG_NETWORK: "WRONG_NETWORK",
  SALE_INACTIVE: "SALE_INACTIVE",
  ASSET_NOT_CONFIGURED: "ASSET_NOT_CONFIGURED",
  USER_REJECTED: "USER_REJECTED",
  TX_FAILED: "TX_FAILED",
  INSUFFICIENT_BALANCE: "INSUFFICIENT_BALANCE",
  /** 16/09/2026: valor abaixo do mínimo aceito pelo contrato (`minPurchaseUsd18`,
   *  ver PvPGenesisSale.sol) — checado aqui também, ANTES de abrir a MetaMask, pra
   *  não fazer a pessoa pagar gás por uma transação que o contrato vai recusar. */
  BELOW_MIN_PURCHASE: "BELOW_MIN_PURCHASE",
  /** 14/09/2026: `eth_requestAccounts` nunca respondeu (ver `getInjectedProvider`/
   *  `withTimeout` acima) — geralmente porque um seletor de carteira (quando há mais de
   *  uma extensão instalada, ex: MetaMask + Phantom) foi fechado sem escolher nada. */
  WALLET_TIMEOUT: "WALLET_TIMEOUT",
} as const;

export type WalletState = {
  address: string | null;
  connecting: boolean;
  /** True once a browser wallet extension (MetaMask, Coinbase Wallet, etc.) is detected. */
  hasProvider: boolean;
  chainId: number | null;
  /** True when connected but on a chain other than the one PvP Pro currently targets
   *  (Base Sepolia while TESTNET_MODE is on — see genesisContract.ts). */
  wrongNetwork: boolean;
  reservedPvp: number;
  invested: number;
  txs: Tx[];
  connect: () => Promise<void>;
  /** 17/09/2026: conectar via WalletConnect (QR Code) — o caminho pra comprar pelo
   *  celular. Só faz algo se `walletConnectAvailable` for true (ver abaixo). */
  connectWalletConnect: () => Promise<void>;
  /** True quando WALLETCONNECT_PROJECT_ID (acima) já foi preenchido — controla se o
   *  botão "WalletConnect" no modal aparece clicável ou como "Em breve" (cinza). */
  walletConnectAvailable: boolean;
  disconnect: () => void;
  switchToBase: () => Promise<void>;
  /** True once GENESIS_CONTRACT_ADDRESS (genesisContract.ts) foi preenchido — a partir
   *  daí `buy()` manda transações reais na Base Sepolia em vez de só gravar no localStorage. */
  onChainReady: boolean;
  /** True durante todo o fluxo de uma compra on-chain (approve + compra + confirmação). */
  buying: boolean;
  /** Etapa atual pra UI mostrar feedback ("approving" | "confirming"), null fora do fluxo. */
  buyStep: "approving" | "confirming" | null;
  buy: (amountUsd: number, asset?: AssetKey) => Promise<void>;
  /** Relê a posição real do contrato (positionOf) e atualiza invested/reservedPvp —
   *  usado pelo botão "Sincronizar" do Dashboard e depois de cada compra confirmada. */
  refreshOnChainPosition: () => Promise<void>;
};

const WalletCtx = createContext<WalletState | null>(null);
const KEY = "pvp_wallet_v1";

function rand(): string {
  const chars = "0123456789abcdef";
  let s = "0x";
  for (let i = 0; i < 40; i++) s += chars[Math.floor(Math.random() * 16)];
  return s;
}

// --- Rede alvo atual ---
// TESTNET_MODE (genesisContract.ts) decide se o site guia a carteira pra Base Sepolia
// (testnet, dinheiro de mentira — situação atual) ou Base mainnet (só depois de
// auditoria de segurança + revisão jurídica, regra 12 do projeto). Trocar de rede-alvo
// é então uma mudança de uma linha só (TESTNET_MODE), não um reescrever do fluxo.
export const BASE_CHAIN_ID = 8453;
const BASE_CHAIN_ID_HEX = "0x2105";
const BASE_CHAIN_PARAMS = {
  chainId: BASE_CHAIN_ID_HEX,
  chainName: "Base",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: ["https://mainnet.base.org"],
  blockExplorerUrls: ["https://basescan.org"],
};

const ACTIVE_CHAIN_ID = TESTNET_MODE ? BASE_SEPOLIA_CHAIN_ID : BASE_CHAIN_ID;
const ACTIVE_CHAIN_PARAMS = TESTNET_MODE ? BASE_SEPOLIA_CHAIN_PARAMS : BASE_CHAIN_PARAMS;

/** 17/09/2026: WalletConnect — é o que permite comprar pelo CELULAR. Uma extensão de
 *  navegador (MetaMask/Coinbase Wallet) só existe em navegador de computador; no
 *  celular, o WalletConnect mostra um QR Code (ou abre a carteira direto, se estiver no
 *  navegador de dentro do próprio app da carteira) pra aprovar a conexão e cada
 *  transação pelo app da carteira instalada no telefone.
 *  Pra ativar, o dono do projeto precisa criar uma conta grátis em
 *  https://cloud.reown.com (WalletConnect virou "Reown"), criar um Project novo, e
 *  colar aqui o "Project ID" que aparece no painel. Mesma convenção do
 *  GENESIS_CONTRACT_ADDRESS_MAINNET/FORM_ENDPOINT: enquanto estiver vazio, o botão
 *  "WalletConnect" continua aparecendo cinza/"Em breve" no modal de conectar carteira,
 *  sem afetar em nada quem já usa MetaMask no computador. */
const WALLETCONNECT_PROJECT_ID = "21d7f3adc298b238eb2d4f6b6a385093";
export const WALLETCONNECT_AVAILABLE = WALLETCONNECT_PROJECT_ID.length > 0;

/** Minimal EIP-1193 shape — the interface every injected wallet (MetaMask, Coinbase Wallet, Brave, …) implements. */
type EIP1193Provider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
  isMetaMask?: boolean;
  /** Present when MORE THAN ONE wallet extension is installed (e.g. MetaMask + Phantom) —
   *  some wallets populate this array on `window.ethereum` instead of one of them just
   *  overwriting the other. See `getInjectedProvider()` below for why this matters. */
  providers?: EIP1193Provider[];
};

declare global {
  interface Window {
    ethereum?: EIP1193Provider;
  }
}

/** 14/09/2026: com MetaMask E Phantom instalados juntos, `window.ethereum` pode virar
 *  um objeto ambíguo que dispara um seletor de carteira do próprio navegador — se o
 *  usuário fechar esse seletor sem escolher nada, o `request(...)` que o site chamou
 *  fica pendurado PRA SEMPRE (nunca resolve nem rejeita), travando o site em
 *  "Conectando..." até dar F5 (bug real relatado pelo usuário). Duas mitigações:
 *  1) Quando existem vários provedores (`window.ethereum.providers`), escolhe a
 *     MetaMask especificamente em vez do objeto ambíguo — evita o seletor aparecer
 *     bugado na maioria dos casos.
 *  2) `connect()` abaixo usa `withTimeout` pra nunca ficar pendurado de verdade, mesmo
 *     se isso falhar — depois de alguns segundos sem resposta, o site desiste sozinho
 *     e mostra um aviso, em vez de exigir F5.
 */
function getInjectedProvider(): EIP1193Provider | undefined {
  const eth = window.ethereum;
  if (!eth) return undefined;
  if (Array.isArray(eth.providers) && eth.providers.length > 0) {
    return eth.providers.find((p) => p.isMetaMask) ?? eth.providers[0];
  }
  return eth;
}

/** 17/09/2026: formato mínimo que a instância devolvida por `EthereumProvider.init(...)`
 *  do pacote `@walletconnect/ethereum-provider` precisa ter pra gente usar — ela já
 *  implementa `request`/`on`/`removeListener` iguaizinho a uma carteira injetada
 *  (`EIP1193Provider` acima), só que com dois métodos a mais: `connect()` (abre o QR
 *  Code e espera a aprovação pelo app da carteira) e `disconnect()` (encerra a sessão
 *  de verdade — ao contrário de uma extensão injetada, aqui dá pra desconectar sem
 *  precisar mexer em nenhuma configuração da carteira). Escrito à mão (em vez de
 *  importar o tipo oficial do pacote) porque o pacote só existe depois que o usuário
 *  rodar `npm install`, então isso evita quebrar o `tsc` antes disso acontecer. */
type WCProviderInstance = EIP1193Provider & {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  accounts?: string[];
  chainId?: number;
};

/** Import "preguiçoso" do pacote — só baixa o código dele quando alguém realmente
 *  clica em "WalletConnect" (em vez de inflar o carregamento inicial do site pra quem
 *  só usa MetaMask). Lançar `require`/`import` estático aqui quebraria o build antes do
 *  `npm install`; import dinâmico só falha em tempo de execução, na hora do clique. */
async function loadWalletConnectProvider(): Promise<{
  init: (opts: Record<string, unknown>) => Promise<WCProviderInstance>;
}> {
  // @ts-ignore — módulo só existe depois de `npm install @walletconnect/ethereum-provider`;
  // usa "ignore" (não "expect-error") de propósito, porque depois do install o TypeScript
  // passa a achar o módulo normalmente e um "expect-error" sem erro nenhum pra suprimir
  // quebraria o build sozinho ("Unused '@ts-expect-error' directive").
  const mod = await import("@walletconnect/ethereum-provider");
  return mod.EthereumProvider as { init: (opts: Record<string, unknown>) => Promise<WCProviderInstance> };
}

/** Nunca deixa uma chamada de carteira travar a UI pra sempre — se `promise` não
 *  resolver nem rejeitar dentro de `ms`, rejeita com `timeoutError` (o app trata isso
 *  como qualquer outro erro de conexão, sem precisar de F5 pra se recuperar). */
function withTimeout<T>(promise: Promise<T>, ms: number, timeoutError: Error): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(timeoutError), ms);
    promise.then(
      (v) => {
        clearTimeout(id);
        resolve(v);
      },
      (err) => {
        clearTimeout(id);
        reject(err);
      },
    );
  });
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [hasProvider, setHasProvider] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);
  const [invested, setInvested] = useState(0);
  const [reservedPvp, setReserved] = useState(0);
  const [txs, setTxs] = useState<Tx[]>([]);
  const [buying, setBuying] = useState(false);
  const [buyStep, setBuyStep] = useState<"approving" | "confirming" | null>(null);

  // 17/09/2026: guarda a instância do WalletConnect enquanto ela estiver ativa (não é
  // `useState` de propósito — trocar não precisa re-renderizar nada por si só, quem
  // muda é o `address`/`chainId` que ela reporta). `getActiveProvider()` logo abaixo é
  // o que toda função que já usava `getInjectedProvider()` direto (buy, switchToBase)
  // passa a chamar, pra funcionar com QUALQUER uma das duas formas de conectar.
  const wcProviderRef = useRef<WCProviderInstance | undefined>(undefined);

  function getActiveProvider(): EIP1193Provider | undefined {
    return wcProviderRef.current ?? getInjectedProvider();
  }

  // Genesis purchase history stays local/demo (see genesis.tsx) until GENESIS_CONTRACT_ADDRESS
  // (genesisContract.ts) is filled in — from then on, invested/reservedPvp get overwritten by
  // the real on-chain position (positionOf) after every confirmed purchase.
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
    const eth = getInjectedProvider();
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

  // Once connected, pull the real reserved position from the contract (if it's
  // already configured) so the Dashboard doesn't show stale/local numbers for a
  // wallet that already bought on a previous visit/device.
  // 14/09/2026: também repete sozinho a cada 30s enquanto a carteira estiver conectada
  // (mesmo padrão do "Arrecadado"/"Founders" da Home) — antes só atualizava ao conectar
  // ou trocar de rede, então um Tier concedido (`grantPosition`) direto pelo Remix, com
  // o site já aberto, só aparecia depois de clicar "Sincronizar" manualmente ou dar F5.
  // 14/09/2026 (correção): tirado o `chainId !== ACTIVE_CHAIN_ID` daqui — a leitura
  // (positionOf/histórico) é sempre feita via RPC pública direto na Base Sepolia, não
  // depende de qual rede a carteira do usuário está conectada, então essa checagem só
  // servia pra travar a atualização automática sem necessidade (bug real encontrado:
  // usuário esperou 3 minutos sem nada mudar, e o botão "Sincronizar" — que nunca teve
  // essa checagem — atualizava na hora). O botão continua existindo como atalho manual.
  useEffect(() => {
    if (!genesisOnChainReady() || !address) return;
    refreshOnChainPosition();
    const id = setInterval(refreshOnChainPosition, 30_000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  async function connect() {
    const eth = getInjectedProvider();
    if (!eth) {
      setHasProvider(false);
      return;
    }
    setConnecting(true);
    try {
      // 16/09/2026: força o MetaMask a sempre abrir o seletor de conta, mesmo quando o
      // site já tinha permissão de uma conexão anterior — sozinho, eth_requestAccounts
      // devolve direto a última conta autorizada sem perguntar nada, então quem clicava
      // em "Conectar" depois de já ter desconectado uma vez (ou queria trocar de
      // carteira) ficava preso na carteira antiga sem conseguir escolher outra (bug
      // relatado pelo usuário). Se a carteira não suportar esse método (nem toda
      // extensão implementa EIP-2255), ignora e segue pro fluxo de sempre; se o usuário
      // fechar/recusar esse seletor (code 4001), trata como rejeição normal.
      try {
        await eth.request({ method: "wallet_requestPermissions", params: [{ eth_accounts: {} }] });
      } catch (permErr) {
        const code = (permErr as { code?: number } | null)?.code;
        if (code === 4001) throw permErr;
      }
      // 14/09/2026: com timeout — se o popup da carteira nunca aparecer/for fechado sem
      // escolher nada (ver comentário de `getInjectedProvider`/`withTimeout` acima), essa
      // chamada ficava pendurada pra sempre e travava o botão em "Conectando..." até dar
      // F5. Depois de 25s sem resposta, desiste e cai no catch abaixo normalmente.
      const accounts = (await withTimeout(
        eth.request({ method: "eth_requestAccounts" }),
        25_000,
        new Error(BUY_ERROR.WALLET_TIMEOUT),
      )) as string[];
      setAddress(accounts[0] ?? null);
      const hex = (await eth.request({ method: "eth_chainId" })) as string;
      setChainId(parseInt(hex, 16));
    } catch (err) {
      console.error("[wallet] connect failed", err);
      // Repassa pro chamador (WalletButton) exatamente como `buy()` já faz com os
      // BUY_ERROR — quem decide QUAL toast mostrar é o componente de tela, não este
      // arquivo (que não lida com toast/tradução diretamente).
      if (err instanceof Error && err.message === BUY_ERROR.WALLET_TIMEOUT) throw err;
    } finally {
      setConnecting(false);
    }
  }

  /** 17/09/2026: conectar via WalletConnect — o caminho que funciona no CELULAR (uma
   *  extensão de navegador tipo MetaMask só existe em computador). Abre um QR Code (ou,
   *  se o site já estiver sendo acessado de dentro do navegador embutido de um app de
   *  carteira no celular, pode até pular direto pra aprovação); depois de aprovado,
   *  passa a se comportar como qualquer outra carteira conectada — `buy()` e
   *  `switchToBase()` usam `getActiveProvider()`, que passa a devolver esta em vez da
   *  injetada. Só funciona depois que `WALLETCONNECT_PROJECT_ID` acima for preenchido
   *  (o dono do projeto precisa criar uma conta grátis em https://cloud.reown.com) e o
   *  pacote `@walletconnect/ethereum-provider` estiver instalado (`npm install`). */
  async function connectWalletConnect() {
    if (!WALLETCONNECT_AVAILABLE) return;
    setConnecting(true);
    try {
      const EthereumProvider = await loadWalletConnectProvider();
      const provider = await EthereumProvider.init({
        projectId: WALLETCONNECT_PROJECT_ID,
        chains: [ACTIVE_CHAIN_ID],
        optionalChains: [ACTIVE_CHAIN_ID],
        showQrModal: true,
        metadata: {
          name: "PvP Pro",
          description: "PvP Pro — Genesis Founder Program",
          url: "https://pvppro.app",
          icons: ["https://pvppro.app/favicon.svg"],
        },
      });

      const onAccountsChanged = (...args: unknown[]) => {
        const accounts = args[0] as string[];
        setAddress(accounts[0] ?? null);
      };
      const onChainChanged = (...args: unknown[]) => {
        setChainId(Number(args[0]));
      };
      const onDisconnect = () => {
        wcProviderRef.current = undefined;
        setAddress(null);
      };
      provider.on?.("accountsChanged", onAccountsChanged);
      provider.on?.("chainChanged", onChainChanged);
      provider.on?.("disconnect", onDisconnect);

      // Só marca como "ativa" DEPOIS de registrar os listeners acima, mas ANTES do
      // `.connect()` — o QR Code já usa `getActiveProvider()` indiretamente por trás
      // (ex: se o usuário girar a tela e o componente re-renderizar no meio do caminho).
      wcProviderRef.current = provider;

      await provider.connect(); // abre o QR Code / deep link e espera a aprovação

      const accounts = (provider.accounts ?? ((await provider.request({ method: "eth_accounts" })) as string[])) ?? [];
      setAddress(accounts[0] ?? null);
      const rawChainId = provider.chainId ?? (await provider.request({ method: "eth_chainId" }));
      setChainId(typeof rawChainId === "string" ? parseInt(rawChainId, 16) : Number(rawChainId));
    } catch (err) {
      console.error("[wallet] walletconnect connect failed", err);
      wcProviderRef.current = undefined;
      if (err instanceof Error) throw err;
    } finally {
      setConnecting(false);
    }
  }

  function disconnect() {
    // 17/09/2026: WalletConnect tem uma sessão de verdade que dá pra encerrar (ao
    // contrário de uma extensão injetada, que não tem "desconectar" de verdade — ver
    // comentário original abaixo). Se a conexão ativa for por WalletConnect, encerra a
    // sessão pra valer antes de limpar o estado local.
    if (wcProviderRef.current) {
      wcProviderRef.current.disconnect().catch(() => {});
      wcProviderRef.current = undefined;
    }
    // Injected wallets have no real "disconnect" RPC — this only clears local UI state.
    // The wallet extension itself stays authorized until the user revokes it there.
    setAddress(null);
  }

  async function switchToBase() {
    const eth = getActiveProvider();
    if (!eth) return;
    try {
      await eth.request({ method: "wallet_switchEthereumChain", params: [{ chainId: ACTIVE_CHAIN_PARAMS.chainId }] });
    } catch (err) {
      const code = (err as { code?: number } | null)?.code;
      if (code === 4902) {
        try {
          await eth.request({ method: "wallet_addEthereumChain", params: [ACTIVE_CHAIN_PARAMS] });
        } catch (addErr) {
          console.error("[wallet] add chain failed", addErr);
        }
      } else {
        console.error("[wallet] switch chain failed", err);
      }
    }
  }

  async function refreshOnChainPosition() {
    if (!genesisOnChainReady() || !address) return;
    try {
      const pos = await getPositionOf(address);
      setInvested(pos.usdContributed);
      setReserved(pos.pvpReserved);
    } catch (err) {
      console.error("[wallet] refreshOnChainPosition failed", err);
    }
    // Histórico (inclui Tiers dados de graça via grantPosition) é buscado à parte —
    // se essa consulta falhar, a posição acima (que já atualizou certinho) não é
    // descartada, só a lista de transações fica sem se atualizar dessa vez.
    try {
      const history = await getWalletHistory(address);
      const chainTxs: Tx[] = history.map((h) => ({
        id: h.hash.slice(0, 12),
        amount: h.usdValue,
        pvp: h.pvp,
        date: h.timestamp ? new Date(h.timestamp * 1000).toISOString() : new Date().toISOString(),
        status: "Confirmed",
        hash: h.hash,
        kind: h.kind,
      }));
      setTxs((prev) => mergeOnChainHistory(prev, chainTxs));
    } catch (err) {
      console.error("[wallet] getWalletHistory failed", err);
    }
  }

  function buyLocalSimulated(amountUsd: number) {
    const pvp = Math.floor(amountUsd / GENESIS.price);
    setInvested((v) => v + amountUsd);
    setReserved((v) => v + pvp);
    setTxs((v) => [
      { id: rand().slice(0, 12), amount: amountUsd, pvp, date: new Date().toISOString(), status: "Reserved" },
      ...v,
    ]);
  }

  async function buy(amountUsd: number, asset: AssetKey = "USDC") {
    // Enquanto o contrato não estiver configurado (GENESIS_CONTRACT_ADDRESS vazio em
    // genesisContract.ts), mantém o comportamento local/simulado de sempre — nada muda
    // pra quem visita o site hoje.
    if (!genesisOnChainReady()) {
      buyLocalSimulated(amountUsd);
      return;
    }

    // 16/09/2026: mesmo mínimo do contrato (minPurchaseUsd18), checado aqui ANTES
    // de abrir a MetaMask — sem isso, a pessoa confirmaria a transação, pagaria o
    // gás, e só depois descobriria pelo revert que o valor era baixo demais.
    if (amountUsd < GENESIS.minPurchaseUsd) throw new Error(BUY_ERROR.BELOW_MIN_PURCHASE);

    // 17/09/2026: getActiveProvider() (não getInjectedProvider() direto) — pra comprar
    // funcionar também com uma carteira conectada via WalletConnect (celular), não só
    // extensão de navegador.
    const eth = getActiveProvider();
    if (!eth || !address) throw new Error(BUY_ERROR.NO_WALLET);
    if (chainId !== ACTIVE_CHAIN_ID) throw new Error(BUY_ERROR.WRONG_NETWORK);
    if (buying) return;

    setBuying(true);
    setBuyStep(null);
    try {
      if (!assetConfigured(asset)) throw new Error(BUY_ERROR.ASSET_NOT_CONFIGURED);

      const active = await getSaleActive();
      if (!active) throw new Error(BUY_ERROR.SALE_INACTIVE);

      const price18 = await getAssetPriceUsd18(asset);
      const amount = usdToAssetAmount(amountUsd, asset, price18);

      // Checa o saldo ANTES de abrir a MetaMask — sem isso, o usuário confirma a
      // transação na carteira e só depois descobre (com um erro de "fee"/"insufficient
      // funds" vindo direto do nó da rede, bem confuso) que não tinha saldo suficiente.
      const balance = await getAssetBalance(address, asset);
      if (balance < amount) throw new Error(BUY_ERROR.INSUFFICIENT_BALANCE);

      let hash: string;
      if (asset === "ETH") {
        hash = await buyWithEthOnChain(eth, address, amount);
      } else {
        const currentAllowance = await getAllowance(address, asset);
        if (currentAllowance < amount) {
          setBuyStep("approving");
          const approveHash = await approveAsset(eth, address, asset, amount);
          const approveReceipt = await waitForReceipt(eth, approveHash);
          if (!approveReceipt.status) throw new Error(BUY_ERROR.TX_FAILED);
        }
        setBuyStep("confirming");
        hash = await buyWithTokenOnChain(eth, address, asset, amount);
      }

      setBuyStep("confirming");
      const receipt = await waitForReceipt(eth, hash);
      const pvpEstimate = Math.floor(amountUsd / GENESIS.price);
      setTxs((v) => [
        {
          id: hash.slice(0, 12),
          amount: amountUsd,
          pvp: pvpEstimate,
          date: new Date().toISOString(),
          status: receipt.status ? "Confirmed" : "Failed",
          hash,
        },
        ...v,
      ]);

      if (!receipt.status) throw new Error(BUY_ERROR.TX_FAILED);

      // Se essa carteira chegou ao site por um link de youtuber (?ref=..., ver
      // src/lib/referral.ts), registra a compra associada a ele. Só manda algo quando
      // existe um "ref" guardado — não polui a lista com toda compra "direta". Nunca
      // lança erro: a compra já está confirmada acima, uma falha aqui não deve afetar
      // o resultado que o usuário já recebeu.
      logPurchaseReferral({ wallet: address, asset, amountUsd, pvp: pvpEstimate, txHash: hash });

      await refreshOnChainPosition();
    } catch (err) {
      const code = (err as { code?: number } | null)?.code;
      if (code === 4001) throw new Error(BUY_ERROR.USER_REJECTED);
      throw err;
    } finally {
      setBuying(false);
      setBuyStep(null);
    }
  }

  const wrongNetwork = address !== null && chainId !== null && chainId !== ACTIVE_CHAIN_ID;

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
        connectWalletConnect,
        walletConnectAvailable: WALLETCONNECT_AVAILABLE,
        disconnect,
        switchToBase,
        onChainReady: genesisOnChainReady(),
        buying,
        buyStep,
        buy,
        refreshOnChainPosition,
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
  price: 0.1,
  /** 16/09/2026: mesmo valor configurado no contrato (minPurchaseUsd18, ver
   *  PvPGenesisSale.sol) — mudar aqui sozinho NÃO muda o mínimo de verdade, os
   *  dois precisam ficar em sincronia manualmente (o mínimo real é sempre o do
   *  contrato; isso aqui só evita que a pessoa pague gás numa compra fadada a
   *  ser recusada).
   *  17/09/2026: voltado de $1 (baixado só pra testar a compra pelo celular via
   *  WalletConnect, confirmado funcionando) pra $5 de novo. Falta agora o
   *  redeploy do contrato pra esse mínimo passar a valer de verdade on-chain
   *  também (até lá, o contrato aceita qualquer valor — esse número aqui só
   *  evita pagar gás à toa numa compra que, quando o redeploy sair, seria recusada). */
  minPurchaseUsd: 5,
  hardCap: 10_000_000,
  genesisAllocation: 100_000_000,
  supply: 1_000_000_000,
  launchDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString(),
  // Base editorial fixa somada ao valor real do contrato — ver `useLiveRaised()`
  // abaixo. Nunca é o número mostrado sozinho no site depois que o contrato está
  // ligado (14/09/2026): Home e Genesis sempre chamam `useLiveRaised()`, que soma
  // essa base a `raisedUsd18` (dinheiro de verdade recebido) lido direto do
  // contrato. De propósito NÃO inclui nenhum incremento automático por tempo —
  // um "Arrecadado" que sobe sozinho sem venda nenhuma acontecendo seria enganoso
  // pra quem visita a página.
  raised: 3_247_850.0,
  // Genesis Founder positions are capped and sold on a first-come basis — shared here
  // so the home hero and the Genesis page always show the same live count. The contract
  // itself doesn't track a buyer count, only USD raised, so this stays a manual figure.
  foundersSold: 6512,
  foundersTotal: 20_000,
};

/** Suaviza qualquer número-alvo com uma mola (mesma técnica do `AnimatedNumber`
 *  de genesis.tsx) — quando `target` muda, o valor retornado desliza até lá em
 *  vez de saltar de uma hora pra outra. Compartilhado por `useLiveRaised` e
 *  `useLiveFoundersSold` abaixo.
 *  14/09/2026: começa sempre de 0 (não do valor final) — antes a mola já nascia
 *  igual ao alvo, então na primeira carga da página não tinha nada pra animar
 *  (só mudava se um valor novo chegasse depois, ex. uma compra real). Agora,
 *  assim que o número-base é conhecido, ele sobe suavemente de 0 até lá — é
 *  essa subida que dá o efeito de "contagem" visível no carregamento da página. */
function useSmoothedTarget(target: number): number {
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 60, damping: 20, mass: 1 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    mv.set(target);
  }, [target, mv]);

  useEffect(() => spring.on("change", (v: number) => setDisplay(v)), [spring]);

  return display;
}

/** "Arrecadado" mostrado na Home e na Genesis: `GENESIS.raised` (base editorial
 *  fixa) + o valor REAL somado no contrato (`raisedUsd18`, dinheiro de verdade —
 *  nunca inclui posições dadas de graça via `grantPosition`, ver PvPGenesisSale.sol).
 *  Enquanto o contrato não está ligado (`genesisOnChainReady()` false) ou a leitura
 *  falha, retorna só a base — nunca um número fabricado crescendo sozinho.
 *  Arredondado pro dólar mais próximo (valor aproximado, sem casas decimais). */
export function useLiveRaised(): number {
  const [target, setTarget] = useState(GENESIS.raised);

  useEffect(() => {
    if (!genesisOnChainReady()) return;
    let cancelled = false;
    async function poll() {
      try {
        const stats = await getGenesisOnChainStats();
        if (!cancelled) setTarget(GENESIS.raised + stats.raisedUsd);
      } catch (err) {
        console.error("[wallet] useLiveRaised failed", err);
      }
    }
    poll();
    const id = setInterval(poll, 60_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return Math.round(useSmoothedTarget(target));
}

/** "Founders vendidos" mostrado na Home e na Genesis: `GENESIS.foundersSold`
 *  (base editorial fixa) + a contagem REAL de carteiras únicas com posição no
 *  contrato (`getGenesisFounderCount()`) — inclui tanto quem comprou de verdade
 *  quanto quem recebeu um Tier de graça via `grantPosition` (parcerias com
 *  youtubers). Mesma regra do `useLiveRaised`: sem contrato ligado ou com erro
 *  na leitura, fica só na base. */
export function useLiveFoundersSold(): number {
  const [target, setTarget] = useState(GENESIS.foundersSold);

  useEffect(() => {
    if (!genesisOnChainReady()) return;
    let cancelled = false;
    async function poll() {
      try {
        const count = await getGenesisFounderCount();
        if (!cancelled) setTarget(GENESIS.foundersSold + count);
      } catch (err) {
        console.error("[wallet] useLiveFoundersSold failed", err);
      }
    }
    poll();
    const id = setInterval(poll, 60_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return Math.round(useSmoothedTarget(target));
}
