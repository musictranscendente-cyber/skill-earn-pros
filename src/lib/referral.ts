// PvP Pro — rastreio de indicações de youtubers (opcional, nunca bloqueia o site).
//
// Cada youtuber recebe um link próprio, ex: https://seusite.com/genesis?ref=nomedocanal
// Quando alguém abre o site por esse link, guardamos o "ref" no navegador (localStorage)
// pra saber depois — mesmo que a pessoa navegue por várias páginas antes de comprar ou
// preencher o formulário de interesse — de qual canal ela veio.
//
// Os dados (leads + compras) são mandados em DOBRO, pra dois serviços gratuitos de
// formulário ao mesmo tempo — Formspree (https://formspree.io) e Web3Forms
// (https://web3forms.com) — nenhum dos dois exige backend do nosso lado, só um
// endpoint/chave cada. 17/09/2026: adicionado o segundo destino (Web3Forms) como
// redundância depois que a conta antiga da Formspree foi bloqueada (ver comentário em
// `logPurchaseReferral` abaixo) — cada envio vai pros dois, cada um de forma
// independente (`submitToBoth`): se um estiver fora do ar/bloqueado, o outro continua
// recebendo normalmente, em vez de perder o dado inteiro em silêncio como antes.
// Mesma convenção do GENESIS_CONTRACT_ADDRESS_MAINNET em genesisContract.ts: enquanto
// um dos dois estiver vazio, ele fica desativado (no-op) sem afetar o outro; com os
// dois vazios, tudo aqui vira um no-op silencioso — nada quebra no resto do site.

const REF_KEY = "pvp_ref_v1";

/** Endpoint do Formspree, ex: "https://formspree.io/f/xxxxxxxx". Vazio = desativado.
 *  17/09/2026: a conta anterior (endpoint antigo) foi BLOQUEADA pela Formspree por
 *  violar os termos deles — motivo real descoberto depois, ver comentário em
 *  `logPurchaseReferral` abaixo. Contas gratuitas bloqueadas não são reabertas pelo
 *  suporte deles — essa é uma conta NOVA, criada em 17/09/2026. */
const FORM_ENDPOINT = "https://formspree.io/f/xppwzpwo";

/** Chave de acesso do Web3Forms (https://web3forms.com), o segundo destino/backup —
 *  vazio = desativado. Ao contrário da Formspree, o Web3Forms usa uma "access_key"
 *  dentro do corpo da requisição em vez de um endpoint próprio por formulário (o
 *  endpoint em si, `WEB3FORMS_ENDPOINT` logo abaixo, é sempre o mesmo pra todo mundo). */
const WEB3FORMS_ACCESS_KEY = "eed13965-dcd0-4af3-82c6-78dff1b46c6e";
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

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
    console.error("[referral] submit (formspree) failed", err);
    return false;
  }
}

/** 17/09/2026: segundo destino (Web3Forms), adicionado como redundância — mesma ideia
 *  do submitToFormspree acima, só que o Web3Forms exige o campo `access_key` dentro do
 *  próprio corpo da requisição (em vez de identificar o formulário pela URL do
 *  endpoint). */
async function submitToWeb3Forms(data: Record<string, string>): Promise<boolean> {
  if (!WEB3FORMS_ACCESS_KEY) return false; // desativado até a chave ser preenchida acima
  try {
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ access_key: WEB3FORMS_ACCESS_KEY, ...data }),
    });
    return res.ok;
  } catch (err) {
    console.error("[referral] submit (web3forms) failed", err);
    return false;
  }
}

/** Manda o mesmo envio pros dois serviços ao mesmo tempo, cada um por conta própria —
 *  se um estiver fora do ar ou bloqueado, o outro continua recebendo normalmente
 *  (`Promise.allSettled`, nunca deixa uma falha de um lado derrubar o outro). Considera
 *  sucesso se PELO MENOS UM dos dois confirmar o recebimento. */
async function submitToBoth(data: Record<string, string>): Promise<boolean> {
  const results = await Promise.allSettled([submitToFormspree(data), submitToWeb3Forms(data)]);
  return results.some((r) => r.status === "fulfilled" && r.value === true);
}

/** Envia um lead (email de quem quer saber mais, sem ter comprado ainda) junto com o
 *  "ref" guardado, se tiver algum. Usado pelo formulário embutido (LeadCapture.tsx). */
export function sendLead(email: string): Promise<boolean> {
  return submitToBoth({
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
 *  deve interromper um fluxo de compra que já terminou bem antes disso.
 *  17/09/2026: NÃO manda mais o endereço da carteira do comprador — foi o motivo real
 *  da conta anterior na Formspree ter sido bloqueada ("não permitimos coleta de dados
 *  sensíveis... endereços de carteiras digitais", resposta oficial deles). O `tx_hash`
 *  sozinho já é suficiente pra rastrear: quem precisar ver a carteira consulta o hash
 *  no BaseScan (a transação já é pública ali de qualquer forma). `info.wallet` continua
 *  sendo recebido pra manter a assinatura da função estável caso volte a ser útil pra
 *  outra coisa (ex: um log só local), mas deliberadamente não entra no payload enviado
 *  a um serviço de terceiros. */
export function logPurchaseReferral(info: {
  wallet: string;
  asset: string;
  amountUsd: number;
  pvp: number;
  txHash: string;
}): void {
  const ref = getStoredReferral();
  if (!ref) return;
  submitToBoth({
    tipo: "compra",
    ref,
    ativo: info.asset,
    valor_usd: String(info.amountUsd),
    pvp: String(info.pvp),
    tx_hash: info.txHash,
  }).catch(() => {});
}
