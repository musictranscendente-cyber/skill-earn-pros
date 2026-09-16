// PvP Pro — cliente mínimo para o contrato da Genesis Sale (PvPGenesisSale.sol).
//
// De propósito, NÃO usa ethers/viem: são chamadas cruas via EIP-1193
// (o mesmo `window.ethereum.request` que já é usado em wallet.tsx) mais um
// punhado de helpers de encode/decode ABI escritos à mão aqui embaixo. Os
// "selectors" (assinatura de 4 bytes de cada função) foram calculados uma vez
// offline (keccak256 da assinatura) e ficam fixos como constantes — ou seja,
// o navegador nunca precisa rodar um algoritmo de keccak, só monta bytes.
//
// ⚠️ Troca de rede-alvo é feita mudando SÓ a linha `TESTNET_MODE` abaixo — tudo o mais
// (endereços, RPC, explorador) já está separado por modo. Ver /contracts/COMO-TESTAR-NA-TESTNET.md
// (testnet) e /contracts/COMO-DEPLOY-MAINNET.md (mainnet, dinheiro real — só depois que o
// contrato de mainnet estiver deployado e você mesmo tiver testado uma compra pequena).

export const TESTNET_MODE = false;

export const BASE_SEPOLIA_CHAIN_ID = 84532;
const BASE_SEPOLIA_CHAIN_ID_HEX = "0x14a34";
export const BASE_SEPOLIA_RPC_URL = "https://sepolia.base.org";
export const BASE_SEPOLIA_EXPLORER_URL = "https://sepolia.basescan.org";

export const BASE_SEPOLIA_CHAIN_PARAMS = {
  chainId: BASE_SEPOLIA_CHAIN_ID_HEX,
  chainName: "Base Sepolia",
  nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: [BASE_SEPOLIA_RPC_URL],
  blockExplorerUrls: [BASE_SEPOLIA_EXPLORER_URL],
};

// Base mainnet — valores conferidos em 14/09/2026 direto na documentação oficial da Base
// (docs.base.org/base-chain/quickstart/connecting-to-base): chainId 8453, RPC
// https://mainnet.base.org, explorador https://basescan.org.
export const BASE_MAINNET_RPC_URL = "https://mainnet.base.org";
export const BASE_MAINNET_EXPLORER_URL = "https://basescan.org";

/** URL usada pra leitura pública via RPC (`publicRpc`, mais abaixo) — muda sozinha com `TESTNET_MODE`. */
const ACTIVE_RPC_URL = TESTNET_MODE ? BASE_SEPOLIA_RPC_URL : BASE_MAINNET_RPC_URL;
/** URL do explorador (BaseScan) usada nos links de transação do Dashboard — muda sozinha com `TESTNET_MODE`. */
export const ACTIVE_EXPLORER_URL = TESTNET_MODE ? BASE_SEPOLIA_EXPLORER_URL : BASE_MAINNET_EXPLORER_URL;

/**
 * ───────────────────────── PASSO FINAL DO GUIA DE TESTNET ─────────────────────────
 * Depois de fazer o deploy no Remix (contracts/COMO-TESTAR-NA-TESTNET.md), cole aqui:
 *  1) o endereço do contrato `PvPGenesisSale` (passo 7 do guia) em GENESIS_CONTRACT_ADDRESS_TESTNET;
 *  2) os endereços dos `MockERC20` (passo 6 do guia) em ASSETS_TESTNET.USDT/.BTC.
 *
 * Enquanto GENESIS_CONTRACT_ADDRESS_TESTNET estiver vazio, o site inteiro continua funcionando
 * exatamente como antes (reserva 100% local/simulada, sem nenhuma transação de verdade)
 * — ninguém que visita o site é afetado até você preencher isso.
 * ────────────────────────────────────────────────────────────────────────────────
 */
const GENESIS_CONTRACT_ADDRESS_TESTNET = "0x6B807B0130E6C42FDb5739580c5408D4A8169A17"; // <- endereço do PvPGenesisSale (Base Sepolia), REDEPLOY de 14/09/2026 (contrato novo, ganhou a função grantPosition — o endereço antigo 0x7A27127d...9e2a7 não tem essa função e ficou obsoleto)

/**
 * ───────────────────────── PASSO FINAL DO GUIA DE MAINNET ─────────────────────────
 * Depois de fazer o deploy na Base mainnet (contracts/COMO-DEPLOY-MAINNET.md), cole aqui
 * o endereço do contrato `PvPGenesisSale` (dinheiro real). Enquanto estiver vazio, e
 * enquanto TESTNET_MODE continuar `true`, isso não tem NENHUM efeito no site — é só
 * preenchido com antecedência pra ficar pronto pra quando você decidir trocar o modo.
 * ────────────────────────────────────────────────────────────────────────────────
 */
const GENESIS_CONTRACT_ADDRESS_MAINNET = "0x8cE0564EA679d7ab462347ba2C8566AA50ac4F29";

export const GENESIS_CONTRACT_ADDRESS = TESTNET_MODE ? GENESIS_CONTRACT_ADDRESS_TESTNET : GENESIS_CONTRACT_ADDRESS_MAINNET;

export type AssetKey = "ETH" | "USDC" | "USDT" | "BTC";

type AssetConfig = { label: string; address: string; decimals: number; isStable: boolean };

/** Precisa bater exatamente com o que você passou em `configureAsset` no Remix
 *  (endereço, decimais e se é stable) — o site confia nesses valores para montar
 *  as transações, ele não lê a struct `assets` do contrato para isso. */
const ASSETS_TESTNET: Record<AssetKey, AssetConfig> = {
  ETH: { label: "ETH", address: "0x0000000000000000000000000000000000000000", decimals: 18, isStable: false },
  USDC: { label: "USDC", address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", decimals: 6, isStable: true },
  USDT: { label: "USDT", address: "0x66d0CD3e231143208c81cdc07a5B754BF40E6a54", decimals: 6, isStable: true },
  // 14/09/2026: desativado no site (endereço vazio = some da lista de ativos em genesis.tsx,
  // igual acontece antes de configurar). Motivo: o feed Chainlink BTC/USD da testnet Base
  // Sepolia (0x0FB99723Aee6f420beAd13e6bBB79b7E6F034298) se mostrou pouco confiável nos testes —
  // às vezes devolve um preço correto, às vezes um valor muito fora da realidade bem na hora da
  // compra, o que infla o valor em dólar registrado. Também foi desativado no contrato via
  // configureAsset(token, enabled: false, ...). ETH/USDC/USDT continuam funcionando normalmente.
  BTC: { label: "cbBTC", address: "", decimals: 8, isStable: false },
};

/** Ativos da Base MAINNET (dinheiro real). 14/09/2026:
 *  - Não existe USDT oficial (emitido pela própria Tether) na Base — conferido direto em
 *    tether.to/en/supported-protocols, a Base não está na lista. Existe um "USDT" de ponte
 *    feito por terceiros, mas usar isso como se fosse USDT real seria enganoso — por isso
 *    fica de fora por enquanto (endereço vazio).
 *  - cbBTC também fica de fora por enquanto (mesma decisão da testnet — decisão do usuário
 *    em 14/09/2026 de estrear só com ETH + USDC).
 *  - USDC é o endereço oficial, emitido pela própria Circle na Base mainnet — conferido em
 *    developers.circle.com/stablecoins/usdc-contract-addresses.
 *  Pra reativar USDT/cbBTC no futuro: preencher o endereço aqui embaixo E chamar
 *  `configureAsset` no contrato de mainnet com o endereço/feed corretos. */
const ASSETS_MAINNET: Record<AssetKey, AssetConfig> = {
  ETH: { label: "ETH", address: "0x0000000000000000000000000000000000000000", decimals: 18, isStable: false },
  USDC: { label: "USDC", address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", decimals: 6, isStable: true },
  USDT: { label: "USDT", address: "", decimals: 6, isStable: true },
  BTC: { label: "cbBTC", address: "", decimals: 8, isStable: false },
};

export const ASSETS: Record<AssetKey, AssetConfig> = TESTNET_MODE ? ASSETS_TESTNET : ASSETS_MAINNET;

export function assetConfigured(asset: AssetKey): boolean {
  return ASSETS[asset].address.length > 0;
}

/** Ao menos um ativo além do ETH nativo precisa ter endereço preenchido para
 *  considerarmos a integração "ligada" — ETH sozinho já é suficiente. */
export function genesisOnChainReady(): boolean {
  return GENESIS_CONTRACT_ADDRESS.length > 0;
}

// ───────────────────────────── ABI encode/decode ─────────────────────────────
// Só tipos estáticos (address, uint256) — nenhuma função usada aqui tem tipo
// dinâmico (string/bytes/array), então não precisamos de um encoder ABI completo.

const SELECTORS = {
  buyWithEth: "0x11b5444f", // buyWithEth()
  buyWithToken: "0x6e33a831", // buyWithToken(address,uint256)
  positionOf: "0xfd2d39c5", // positionOf(address) -> (uint256,uint256)
  quote: "0x8f79306e", // quote(address,uint256) -> (uint256,uint256)
  saleActive: "0x68428a1b", // saleActive() -> bool
  raisedUsd18: "0x6da733ba", // raisedUsd18() -> uint256
  hardCapUsd18: "0x3877f5c4", // hardCapUsd18() -> uint256
  approve: "0x095ea7b3", // approve(address,uint256) -> bool  (ERC20 padrão)
  allowance: "0xdd62ed3e", // allowance(address,address) -> uint256 (ERC20 padrão)
  balanceOf: "0x70a08231", // balanceOf(address) -> uint256 (ERC20 padrão)
} as const;

// Hashes de evento (topic0) — calculados offline com o mesmo Keccak-256 próprio
// usado pros SELECTORS acima, a partir da assinatura canônica de cada evento
// (só os tipos, sem nome de parâmetro). Usados só pra contar carteiras únicas
// que já têm posição (ver getGenesisFounderCount) via eth_getLogs.
const EVENT_TOPICS = {
  // Purchased(address indexed buyer, address indexed asset, uint256, uint256, uint256)
  purchased: "0xb362243af1e2070d7d5bf8d713f2e0fab64203f1b71462afbe20572909788c5e",
  // PositionGranted(address indexed wallet, uint256, uint256)
  positionGranted: "0xcb847bc5e6db05798c7036c8c4af29e7e7372cf87fda564c8c9687730b8d421c",
} as const;

function stripHexPrefix(hex: string): string {
  return hex.startsWith("0x") || hex.startsWith("0X") ? hex.slice(2) : hex;
}

function padWord(hexNoPrefix: string): string {
  if (hexNoPrefix.length > 64) throw new Error("valor grande demais para uma palavra ABI de 32 bytes");
  return hexNoPrefix.padStart(64, "0");
}

function encodeUint256(value: bigint): string {
  if (value < 0n) throw new Error("encodeUint256: valor negativo não suportado");
  return padWord(value.toString(16));
}

function encodeAddress(address: string): string {
  const clean = stripHexPrefix(address).toLowerCase();
  if (!/^[0-9a-f]{40}$/.test(clean)) throw new Error(`endereço inválido: ${address}`);
  return padWord(clean);
}

function buildCalldata(selector: string, ...words: string[]): string {
  return selector + words.join("");
}

function decodeWord(dataHex: string, index: number): string {
  const clean = stripHexPrefix(dataHex);
  const start = index * 64;
  return clean.slice(start, start + 64);
}

function decodeUint256(dataHex: string, index = 0): bigint {
  const word = decodeWord(dataHex, index);
  return word ? BigInt("0x" + word) : 0n;
}

// ───────────────────────────── Transporte RPC ─────────────────────────────

/** Forma mínima de um provedor EIP-1193 (MetaMask, Coinbase Wallet, etc.) —
 *  igual ao tipo já usado em wallet.tsx, repetido aqui só na forma que este
 *  arquivo realmente usa, pra não depender de um import cruzado. */
export type Eip1193Like = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

let rpcRequestId = 1;

/** Leitura pública via RPC da rede ativa (Base Sepolia ou Base mainnet, conforme
 *  `TESTNET_MODE`) — não depende de carteira conectada. Usado pra tudo que é só "ler"
 *  (preço, posição, se a campanha está ativa). */
async function publicRpc<T>(method: string, params: unknown[]): Promise<T> {
  const res = await fetch(ACTIVE_RPC_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: rpcRequestId++, method, params }),
  });
  if (!res.ok) throw new Error(`Falha de rede ao falar com a Base (HTTP ${res.status})`);
  const json = (await res.json()) as { result?: T; error?: { message?: string } };
  if (json.error) throw new Error(json.error.message ?? "Erro retornado pela rede Base Sepolia");
  return json.result as T;
}

async function publicEthCall(to: string, data: string): Promise<string> {
  return publicRpc<string>("eth_call", [{ to, data }, "latest"]);
}

type RawLog = { topics: string[]; data: string; blockNumber: string; transactionHash: string };

/** Folga generosa pra paginação abaixo — bem mais que o necessário pra um contrato
 *  lançado há poucos dias, ~46 dias de blocos na Base (2s/bloco). */
const SAFE_SCAN_BLOCKS = 2_000_000;

/** `eth_getLogs`, mas resiliente a nós RPC públicos que recusam varrer o histórico
 *  inteiro de uma vez (limite comum de "block range" em provedores gratuitos —
 *  a Base mainnet já tem milhões de blocos, então pedir `fromBlock: "0x0"` direto
 *  pode ser rejeitado). Acha o maior tamanho de janela que a RPC aceita (tentando a
 *  mais recente primeiro); se essa janela não cobrir o histórico inteiro sozinha,
 *  pagina pra trás com o MESMO tamanho, acumulando, até cobrir SAFE_SCAN_BLOCKS ou
 *  chegar no bloco 0.
 *  16/09/2026: antes tentava só UMA janela e parava por aí — numa RPC pública que só
 *  aceita janelas de ~5.000 blocos (≈2,7h na Base), isso cobria só as últimas horas.
 *  A posição (positionOf, leitura direta do contrato) sempre aparecia certa no
 *  Dashboard, mas o Histórico de transações (que depende de varrer eventos) ficava
 *  vazio pra qualquer compra mais antiga que essa janela — bug real relatado pelo
 *  usuário depois do deploy em mainnet, quando já tinha compras de dias diferentes. */
async function getLogsWithFallback(baseFilter: { address: string; topics: (string | null)[] }): Promise<RawLog[]> {
  const latest = Number(BigInt(await publicRpc<string>("eth_blockNumber", [])));
  const windowSizes = [latest + 1, 500_000, 50_000, 10_000, 5_000, 2_000]; // maior janela primeiro
  let lastErr: unknown;
  for (const size of windowSizes) {
    const wholeHistory = size > latest;
    const fromBlock = wholeHistory ? "0x0" : "0x" + (latest - size + 1).toString(16);
    try {
      const firstChunk = await publicRpc<RawLog[]>("eth_getLogs", [{ ...baseFilter, fromBlock, toBlock: "latest" }]);
      if (wholeHistory) return firstChunk; // essa janela já cobriu 100% do histórico sozinha

      // Essa janela funcionou, mas é menor que o histórico todo — pagina pra trás
      // com o mesmo tamanho (já que a RPC aceitou esse tamanho uma vez) até cobrir
      // SAFE_SCAN_BLOCKS ou chegar no bloco 0.
      const allLogs = [...firstChunk];
      let toBlockNum = latest - size;
      let scanned = size;
      while (toBlockNum >= 0 && scanned < SAFE_SCAN_BLOCKS) {
        const fromBlockNum = Math.max(0, toBlockNum - size + 1);
        try {
          const chunk = await publicRpc<RawLog[]>("eth_getLogs", [
            { ...baseFilter, fromBlock: "0x" + fromBlockNum.toString(16), toBlock: "0x" + toBlockNum.toString(16) },
          ]);
          allLogs.push(...chunk);
        } catch (err) {
          // Uma página mais antiga falhou (ex: instabilidade momentânea da RPC) —
          // fica com o que já foi encontrado em vez de perder tudo por causa de um
          // pedaço só.
          console.error("[genesisContract] eth_getLogs falhou numa página mais antiga, parando a varredura ali", err);
          break;
        }
        scanned += toBlockNum - fromBlockNum + 1;
        if (fromBlockNum === 0) break;
        toBlockNum = fromBlockNum - 1;
      }
      return allLogs;
    } catch (err) {
      lastErr = err;
      console.error(`[genesisContract] eth_getLogs falhou com janela de ${size} blocos, tentando uma janela menor`, err);
    }
  }
  throw lastErr instanceof Error
    ? lastErr
    : new Error("Não foi possível ler o histórico de eventos do contrato (RPC pública recusou todas as janelas de bloco tentadas).");
}

/** Envia uma transação assinada pela própria carteira do usuário (MetaMask abre
 *  o popup de confirmação) — usado só para approve/buyWithEth/buyWithToken. */
async function sendTx(provider: Eip1193Like, from: string, to: string, data: string, valueWei?: bigint): Promise<string> {
  const tx: Record<string, string> = { from, to, data };
  if (valueWei !== undefined) tx.value = "0x" + valueWei.toString(16);
  return (await provider.request({ method: "eth_sendTransaction", params: [tx] })) as string;
}

export class TxTimeoutError extends Error {}

/** Espera a transação ser minerada, consultando o recibo a cada `intervalMs`.
 *  `status: true` = sucesso, `status: false` = revertida (nada foi cobrado
 *  além do gás — o contrato não deixa dinheiro "preso" numa reversão). */
export async function waitForReceipt(
  provider: Eip1193Like,
  hash: string,
  timeoutMs = 120_000,
  intervalMs = 2500,
): Promise<{ status: boolean }> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const receipt = (await provider.request({
      method: "eth_getTransactionReceipt",
      params: [hash],
    })) as { status?: string } | null;
    if (receipt && receipt.status !== undefined) {
      return { status: receipt.status === "0x1" };
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  throw new TxTimeoutError("Tempo esgotado esperando a confirmação da transação na Base Sepolia.");
}

// ───────────────────────────── Leituras (sem carteira) ─────────────────────────────

export async function getSaleActive(): Promise<boolean> {
  if (!genesisOnChainReady()) return false;
  const res = await publicEthCall(GENESIS_CONTRACT_ADDRESS, SELECTORS.saleActive);
  return decodeUint256(res) === 1n;
}

export async function getGenesisOnChainStats(): Promise<{ raisedUsd: number; hardCapUsd: number; saleActive: boolean }> {
  const [raisedHex, capHex, activeHex] = await Promise.all([
    publicEthCall(GENESIS_CONTRACT_ADDRESS, SELECTORS.raisedUsd18),
    publicEthCall(GENESIS_CONTRACT_ADDRESS, SELECTORS.hardCapUsd18),
    publicEthCall(GENESIS_CONTRACT_ADDRESS, SELECTORS.saleActive),
  ]);
  return {
    raisedUsd: Number(decodeUint256(raisedHex)) / 1e18,
    hardCapUsd: Number(decodeUint256(capHex)) / 1e18,
    saleActive: decodeUint256(activeHex) === 1n,
  };
}

/** Conta quantas carteiras ÚNICAS já têm posição no contrato — soma quem comprou
 *  de verdade (evento `Purchased`) com quem recebeu Tier de graça (evento
 *  `PositionGranted`, ver `grantPosition` em PvPGenesisSale.sol). O contrato não
 *  guarda "quantos compradores" em nenhuma variável (só o total em dólar), então
 *  isso varre o histórico de eventos via `eth_getLogs` e conta endereços distintos.
 *  Em caso de erro (ex: RPC pública recusar um range grande demais), deixa o
 *  chamador decidir o que fazer — não retorna um número inventado. */
export async function getGenesisFounderCount(): Promise<number> {
  if (!genesisOnChainReady()) return 0;
  const [purchasedLogs, grantedLogs] = await Promise.all([
    getLogsWithFallback({ address: GENESIS_CONTRACT_ADDRESS, topics: [EVENT_TOPICS.purchased] }),
    getLogsWithFallback({ address: GENESIS_CONTRACT_ADDRESS, topics: [EVENT_TOPICS.positionGranted] }),
  ]);
  const wallets = new Set<string>();
  for (const log of [...purchasedLogs, ...grantedLogs]) {
    const topic = log.topics[1]; // 1º parâmetro indexado = a carteira, nos dois eventos
    if (topic) wallets.add(("0x" + topic.slice(-40)).toLowerCase());
  }
  return wallets.size;
}

/** Uma entrada do histórico on-chain de UMA carteira específica — tanto compras
 *  reais (`Purchased`) quanto Tiers dados de graça (`PositionGranted`, ver
 *  `grantPosition` em PvPGenesisSale.sol). Usado pelo Dashboard pra mostrar, com
 *  hash real e link pro explorador, também os Tiers concedidos a youtubers —
 *  antes disso só apareciam as compras feitas pelo próprio navegador (localStorage). */
export type WalletHistoryEntry = {
  hash: string;
  kind: "purchase" | "grant";
  usdValue: number;
  pvp: number;
  blockNumber: number;
  /** Unix (segundos). 0 quando a busca do horário do bloco falhou — o chamador decide
   *  como mostrar isso (ex: "data desconhecida") em vez de inventar um horário. */
  timestamp: number;
};

/** Histórico on-chain de uma carteira específica: todas as compras reais e todos
 *  os Tiers concedidos de graça a ela (ver `grantPosition`). Filtra direto na
 *  consulta RPC (pelo 1º parâmetro indexado, que é a carteira nos dois eventos),
 *  então não varre o histórico inteiro do contrato como `getGenesisFounderCount`. */
export async function getWalletHistory(owner: string): Promise<WalletHistoryEntry[]> {
  if (!genesisOnChainReady()) return [];
  const ownerTopic = "0x" + encodeAddress(owner);
  const [purchasedLogs, grantedLogs] = await Promise.all([
    getLogsWithFallback({ address: GENESIS_CONTRACT_ADDRESS, topics: [EVENT_TOPICS.purchased, ownerTopic] }),
    getLogsWithFallback({ address: GENESIS_CONTRACT_ADDRESS, topics: [EVENT_TOPICS.positionGranted, ownerTopic] }),
  ]);

  const entries = [
    // Purchased(buyer indexed, asset indexed, assetAmount, usdValue18, pvpReserved) — data[1]=usdValue18, data[2]=pvp
    ...purchasedLogs.map((log) => ({
      hash: log.transactionHash,
      kind: "purchase" as const,
      usdValue: Number(decodeUint256(log.data, 1)) / 1e18,
      pvp: Number(decodeUint256(log.data, 2)) / 1e18,
      blockNumber: Number(BigInt(log.blockNumber)),
    })),
    // PositionGranted(wallet indexed, usdValue18, pvp) — data[0]=usdValue18, data[1]=pvp
    ...grantedLogs.map((log) => ({
      hash: log.transactionHash,
      kind: "grant" as const,
      usdValue: Number(decodeUint256(log.data, 0)) / 1e18,
      pvp: Number(decodeUint256(log.data, 1)) / 1e18,
      blockNumber: Number(BigInt(log.blockNumber)),
    })),
  ];

  // Busca o horário real de cada bloco envolvido — uma chamada por bloco DISTINTO,
  // não por log. Se uma falhar, só aquela entrada fica com timestamp 0 (não quebra
  // a lista inteira por causa de um bloco só).
  const uniqueBlocks = Array.from(new Set(entries.map((e) => e.blockNumber)));
  const timestamps = new Map<number, number>();
  await Promise.all(
    uniqueBlocks.map(async (bn) => {
      try {
        const block = await publicRpc<{ timestamp: string }>("eth_getBlockByNumber", ["0x" + bn.toString(16), false]);
        timestamps.set(bn, Number(BigInt(block.timestamp)));
      } catch {
        timestamps.set(bn, 0);
      }
    }),
  );

  return entries
    .map((e) => ({ ...e, timestamp: timestamps.get(e.blockNumber) ?? 0 }))
    .sort((a, b) => b.blockNumber - a.blockNumber);
}

/** Preço do ativo em USD, 18 casas fixas (mesmo formato do contrato). Stablecoins
 *  não fazem chamada nenhuma (são sempre 1:1 por definição). Pra ETH/BTC, chama
 *  `quote(ativo, 1 unidade inteira)` no próprio contrato — a mesma fonte de preço
 *  (Chainlink) que vai ser usada de verdade na hora da compra. */
export async function getAssetPriceUsd18(asset: AssetKey): Promise<bigint> {
  const cfg = ASSETS[asset];
  if (!cfg.address) throw new Error(`O endereço do ativo ${asset} ainda não foi configurado no site.`);
  if (cfg.isStable) return 10n ** 18n;
  const oneUnit = 10n ** BigInt(cfg.decimals);
  const data = buildCalldata(SELECTORS.quote, encodeAddress(cfg.address), encodeUint256(oneUnit));
  const res = await publicEthCall(GENESIS_CONTRACT_ADDRESS, data);
  const usdValue18 = decodeUint256(res, 0);
  if (usdValue18 === 0n) {
    throw new Error(`O ativo ${asset} ainda não foi habilitado no contrato (configureAsset) ou o feed de preço falhou.`);
  }
  return usdValue18;
}

/** Converte um valor em dólares (ex: 250.5) na quantidade nativa do ativo
 *  (wei para ETH, unidades de 6 casas para USDC/USDT, 8 casas para BTC).
 *  Usa aritmética inteira (BigInt) do início ao fim pra nunca perder precisão
 *  de ponto flutuante — o valor em dólares só entra convertido em centavos. */
export function usdToAssetAmount(usdAmount: number, asset: AssetKey, priceUsd18: bigint): bigint {
  const cfg = ASSETS[asset];
  const cents = BigInt(Math.round(usdAmount * 100));
  const usdValue18 = cents * 10n ** 16n; // centavos -> ponto fixo de 18 casas
  if (cfg.isStable) {
    const shift = 18 - cfg.decimals;
    return usdValue18 / 10n ** BigInt(shift);
  }
  return (usdValue18 * 10n ** BigInt(cfg.decimals)) / priceUsd18;
}

export async function getAllowance(owner: string, asset: AssetKey): Promise<bigint> {
  const cfg = ASSETS[asset];
  const data = buildCalldata(SELECTORS.allowance, encodeAddress(owner), encodeAddress(GENESIS_CONTRACT_ADDRESS));
  const res = await publicEthCall(cfg.address, data);
  return decodeUint256(res);
}

/** Saldo do usuário nesse ativo (wei para ETH nativo, ou `balanceOf` do token ERC20).
 *  Usado só pra checar ANTES de abrir a MetaMask se dá pra cobrir a compra — evita o
 *  usuário confirmar na carteira e só depois descobrir (com um erro de "fee"/"insufficient
 *  funds" confuso) que não tinha saldo suficiente. */
export async function getAssetBalance(owner: string, asset: AssetKey): Promise<bigint> {
  const cfg = ASSETS[asset];
  if (asset === "ETH") {
    const hex = await publicRpc<string>("eth_getBalance", [owner, "latest"]);
    return BigInt(hex);
  }
  const data = buildCalldata(SELECTORS.balanceOf, encodeAddress(owner));
  const res = await publicEthCall(cfg.address, data);
  return decodeUint256(res);
}

export async function getPositionOf(owner: string): Promise<{ usdContributed: number; pvpReserved: number }> {
  if (!genesisOnChainReady()) return { usdContributed: 0, pvpReserved: 0 };
  const data = buildCalldata(SELECTORS.positionOf, encodeAddress(owner));
  const res = await publicEthCall(GENESIS_CONTRACT_ADDRESS, data);
  return {
    usdContributed: Number(decodeUint256(res, 0)) / 1e18,
    pvpReserved: Number(decodeUint256(res, 1)) / 1e18,
  };
}

// ───────────────────────────── Escritas (pedem assinatura na carteira) ─────────────────────────────

export async function approveAsset(provider: Eip1193Like, owner: string, asset: AssetKey, amount: bigint): Promise<string> {
  const cfg = ASSETS[asset];
  const data = buildCalldata(SELECTORS.approve, encodeAddress(GENESIS_CONTRACT_ADDRESS), encodeUint256(amount));
  return sendTx(provider, owner, cfg.address, data);
}

export async function buyWithEthOnChain(provider: Eip1193Like, owner: string, weiAmount: bigint): Promise<string> {
  return sendTx(provider, owner, GENESIS_CONTRACT_ADDRESS, SELECTORS.buyWithEth, weiAmount);
}

export async function buyWithTokenOnChain(provider: Eip1193Like, owner: string, asset: AssetKey, amount: bigint): Promise<string> {
  const cfg = ASSETS[asset];
  const data = buildCalldata(SELECTORS.buyWithToken, encodeAddress(cfg.address), encodeUint256(amount));
  return sendTx(provider, owner, GENESIS_CONTRACT_ADDRESS, data);
}
