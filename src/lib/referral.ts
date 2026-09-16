// PvP Pro — rastreio de indicações de youtubers (opcional, nunca bloqueia o site).
//
// Cada youtuber recebe um link próprio, ex: https://seusite.com/genesis?ref=nomedocanal
// Quando alguém abre o site por esse link, guardamos o "ref" no navegador (localStorage)
// pra saber depois — mesmo que a pessoa navegue por várias páginas antes de comprar ou
// preencher o formulário de interesse — de qual canal ela veio.
//
// Os dados (leads + compras) são mandados pro Formspree (https://formspree.io), um
// serviço gratuito de formulários que não exige backend nenhum do nosso lado, só um
// endpoint. Pra ativar:
//   1. Crie uma conta gratuita em https://formspree.io e um formulário novo (qualquer
//      nome, ex: "PvP Pro — Leads e Indicações").
//   2. Copie o endpoint que ele te dá (formato "https://formspree.io/f/xxxxxxxx").
//   3. Cole esse endpoint em FORM_ENDPOINT abaixo.
// Mesma convenção do GENESIS_CONTRACT_ADDRESS_MAINNET em genesisContract.ts: enquanto
// FORM_ENDPOINT estiver vazio, tudo aqui vira um no-op silencioso — o formulário de leads
// mostra erro ao enviar (nada pra onde mandar ainda) e nenhuma compra é registrada, mas
// nada quebra em nenhum outro lugar do site.

const REF_KEY = "pvp_ref_v1";

/** Endpoint do Formspree, ex: "https://formspree.io/f/xxxxxxxx". Vazio = desativado. */
const FORM_ENDPOINT = "https://formspree.io/f/meaojrvg";

/** Lê o parâmetro ?ref= da URL atual, se existir. Aceita letras/números/hífen/underscore
 *  (o suficiente pra um "slug" de nome de canal), até 60 caracteres — qualquer coisa fora
 *  disso é cortada, nunca quebra a leitura da página. */
export function getRefFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  const raw = new URLSearchParams(window.location.search).get("ref");
  if (!raw) return null;
  const cleaned = raw.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 60);
  return cleaned || null;
}

/** Guarda o "ref" da URL atual no navegador (se tiver algum), pra persistir entre
 *  páginas mesmo que a pessoa navegue pelo site antes de converter. Chame uma vez, no
 *  carregamento de qualquer página pública (ver src/components/Layout.tsx). Nunca
 *  sobrescreve um "ref" já guardado com "nenhum" — só troca se a URL atual tiver um novo. */
export function captureReferralFromUrl(): void {
  const ref = getRefFromUrl();
  if (!ref) return;
  try {
    localStorage.setItem(REF_KEY, ref);
  } catch {}
}

/** O "ref" guardado (do último link de youtuber usado pra entrar no site), ou null se a
 *  pessoa nunca veio de um link com ?ref=. */
export function getStoredReferral(): string | null {
  try {
    return localStorage.getItem(REF_KEY);
  } catch {
    return null;
  }
}

async function submitToFormspree(data: Record<string, string>): Promise<boolean> {
  if (!FORM_ENDPOINT) return false; // desativado até o endpoint ser preenchido acima
  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch (err) {
    console.error("[referral] submit failed", err);
    return false;
  }
}

/** Envia um lead (email de quem quer saber mais, sem ter comprado ainda) junto com o
 *  "ref" guardado, se tiver algum. Usado pelo formulário embutido (LeadCapture.tsx). */
export function sendLead(email: string): Promise<boolean> {
  return submitToFormspree({
    tipo: "lead",
    email,
    ref: getStoredReferral() ?? "(direto, sem indicacao)",
    pagina: typeof window !== "undefined" ? window.location.pathname : "",
  });
}

/** Registra uma compra confirmada como vinda de uma indicação — só manda algo se a
 *  pessoa tiver chegado ao site por um link ?ref= (senão não há nada pra atribuir, e
 *  não vale poluir a lista com toda compra "direta"). Chamado por wallet.tsx depois de
 *  cada compra on-chain confirmada com sucesso; nunca lança erro — uma falha aqui não
 *  deve interromper um fluxo de compra que já terminou bem antes disso. */
export function logPurchaseReferral(info: {
  wallet: string;
  asset: string;
  amountUsd: number;
  pvp: number;
  txHash: string;
}): void {
  const ref = getStoredReferral();
  if (!ref) return;
  submitToFormspree({
    tipo: "compra",
    ref,
    carteira: info.wallet,
    ativo: info.asset,
    valor_usd: String(info.amountUsd),
    pvp: String(info.pvp),
    tx_hash: info.txHash,
  }).catch(() => {});
}
