# Como testar o contrato da Genesis Sale (testnet — dinheiro de mentira)

Este guia é pra colocar o `PvPGenesisSale.sol` no ar na rede de teste **Base Sepolia**, sem gastar
nada de verdade. Segue o passo a passo — nenhuma etapa exige instalar programa nenhum no seu PC,
tudo acontece no navegador.

⚠️ **Antes de tudo:** eu não consegui compilar este contrato automaticamente no meu ambiente
desta vez (minha sandbox está sem acesso à internet pra baixar o compilador Solidity). Escrevi o
código com bastante cuidado, mas o passo 5 (compilar no Remix) é quem vai confirmar se está tudo
certo — se aparecer qualquer erro em vermelho lá, me manda a mensagem exata que eu conserto na
hora, antes de você fazer o deploy.

---

## 1. Adicionar a rede Base Sepolia na MetaMask

Abra a MetaMask → rede → "Adicionar rede" → "Adicionar rede manualmente" e preencha:

- **Nome da rede:** Base Sepolia
- **URL do RPC:** `https://sepolia.base.org`
- **Chain ID:** `84532`
- **Símbolo da moeda:** ETH
- **URL do explorador:** `https://sepolia.basescan.org`

## 2. Pegar ETH de teste (grátis)

Você precisa de um pouco de ETH de teste só pra pagar o "gás" (taxa) das transações — não vale
nada de verdade.

⚠️ **Cuidado com a faucet da Alchemy** — se você pesquisar "Base Sepolia faucet" no Google, ela
costuma aparecer em primeiro lugar, mas ela exige que sua carteira já tenha pelo menos 0,001 ETH
na rede **principal** (mainnet) pra liberar o teste — não é uma regra da Base, é só uma trava
daquela faucet específica pra evitar bots. Se você não tem ETH de verdade, ela não vai funcionar.

Use em vez dela a da **QuickNode**, que não pede nada disso:

**https://faucet.quicknode.com/base/sepolia** — cole o endereço da sua carteira, sem precisar de
conta, sem postar no X, sem saldo nenhum em rede nenhuma. Dá 0,1 ETH de teste, uma vez a cada 24h.
Isso é mais do que suficiente pros testes.

## 3. Pegar USDC de teste (grátis)

Vá em **https://faucet.circle.com** (site oficial da Circle, empresa que emite o USDC de verdade),
escolha a rede **Base Sepolia** e cole seu endereço. Isso te dá USDC de teste de verdade — o
mesmo contrato oficial que vamos usar (endereço abaixo).

## 4. Abrir o Remix

Vá em **https://remix.ethereum.org** (site oficial, não precisa criar conta nem instalar nada).

- Crie um arquivo novo chamado `PvPGenesisSale.sol` e cole o conteúdo do arquivo com esse mesmo
  nome que eu te mandei.
- Crie outro arquivo `MockERC20.sol` e cole o conteúdo do arquivo `MockERC20.sol` que eu mandei.

## 5. Compilar

Na aba "Solidity Compiler" (ícone lateral esquerdo), escolha a versão `0.8.24` (ou qualquer
`0.8.2x` mais recente que o Remix oferecer) e clique em "Compile PvPGenesisSale.sol". Se der
qualquer erro em vermelho, me manda a mensagem completa antes de continuar.

## 6. Deploy dos tokens de teste (USDT e BTC)

Não existe USDT nem cbBTC "oficiais" de teste na Base Sepolia (só a Tether e a Coinbase têm isso
na rede principal). Por isso criei o `MockERC20.sol` — um token de teste que qualquer um pode
criar quantidade ilimitada pra si mesmo, só pra simular.

Na aba "Deploy & Run", com "Environment" = **Injected Provider - MetaMask** (confirme que a
MetaMask está na rede Base Sepolia), selecione o contrato `MockERC20` e faça o deploy **duas
vezes**, uma pra cada token, preenchendo os campos do construtor assim:

**Token de teste "USDT":**
- `name_`: `Test Tether USD`
- `symbol_`: `USDT`
- `decimals_`: `6`

**Token de teste "BTC" (representando cbBTC):**
- `name_`: `Test Coinbase Wrapped BTC`
- `symbol_`: `cbBTC`
- `decimals_`: `8`

Depois de cada deploy, guarde o endereço do contrato que aparece no Remix (vai precisar dele no
passo 8). Pra ter saldo de teste pra usar depois, chame a função `mint` de cada um com uma
quantidade grande (ex: `1000000000000` — lembre que USDT de teste tem 6 casas decimais, então
isso equivale a 1.000.000 "USDT" de teste).

## 7. Deploy do contrato principal (PvPGenesisSale)

Selecione o contrato `PvPGenesisSale` e clique em "Deploy", preenchendo os 4 campos do
construtor:

- `initialOwner`: o endereço da sua própria carteira MetaMask (copie da extensão)
- `initialTreasury`: o mesmo endereço da sua carteira, por enquanto (é o "tesouro" — dá pra trocar
  depois com `setTreasury`, inclusive pra uma carteira multisig quando tiver uma)
- `_priceUsd18`: `100000000000000000` (isso é $0.10 por PVP, no formato do contrato — atualizado junto com o preço do site em 05/09/2026)
- `_hardCapUsd18`: `10000000000000000000000000` (isso é $10.000.000, no formato do contrato)

Confirme na MetaMask. Guarde o endereço do contrato que aparece depois do deploy — é esse
endereço que vamos usar no site depois.

## 8. Configurar os ativos aceitos

⚠️ **Confira os dois endereços de "Chainlink price feed" abaixo (ETH/USD e BTC/USD) antes de usar.**
Eu revalidei o endereço do USDC de teste agora (está correto), mas não consegui abrir a tabela
oficial da Chainlink pra revalidar esses dois — a página carrega os dados via JavaScript e minha
ferramenta de busca não consegue ler. Antes do passo 8, entre em
**https://docs.chain.link/data-feeds/price-feeds/addresses?network=base**, marque "Show testnet
feeds", procure "Base Sepolia" e confirme que o endereço de ETH/USD e o de BTC/USD batem com os
que estão aqui embaixo. Se não bater, me manda o endereço certo que eu corrijo o guia. Se estiver
errado, o pior que acontece é a chamada `buyWithEth`/`buyWithToken` desses ativos falhar com erro
na hora do teste (não trava dinheiro nem gera preço errado silenciosamente) — mas é melhor
confirmar antes.

Ainda na aba Deploy, abaixo do contrato já deployado (`PvPGenesisSale`), chame a função
`configureAsset` quatro vezes, uma pra cada ativo:

**ETH** (o endereço `0x0000000000000000000000000000000000000000` representa ETH nativo):
```
token:         0x0000000000000000000000000000000000000000
enabled:       true
isStable:      false
tokenDecimals: 18
priceFeed:     0x4aDC67696bA383F43DD60A9e78F2C97Fbbfc7cb1   (Chainlink ETH/USD, Base Sepolia)
```

**USDC** (endereço oficial de teste da Circle na Base Sepolia):
```
token:         0x036CbD53842c5426634e7929541eC2318f3dCF7e
enabled:       true
isStable:      true
tokenDecimals: 6
priceFeed:     0x0000000000000000000000000000000000000000   (ignorado quando isStable = true)
```

**USDT de teste** (use o endereço do MockERC20 "USDT" que você deployou no passo 6):
```
token:         <endereço do seu MockERC20 USDT>
enabled:       true
isStable:      true
tokenDecimals: 6
priceFeed:     0x0000000000000000000000000000000000000000
```

**BTC de teste / cbBTC** (use o endereço do MockERC20 "cbBTC", precificado pelo feed real de BTC):
```
token:         <endereço do seu MockERC20 cbBTC>
enabled:       true
isStable:      false
tokenDecimals: 8
priceFeed:     0x0FB99723Aee6f420beAD13e6bBB79b7E6F034298   (Chainlink BTC/USD, Base Sepolia)
```

## 9. Abrir a campanha

Chame `setSaleActive` com `true`. A partir daqui o contrato aceita compras.

## 10. Testar uma compra

- **Com ETH:** chame `buyWithEth`, colocando um valor pequeno de ETH de teste no campo "VALUE"
  do Remix (ex: `0.001` ether) antes de clicar.
- **Com USDC/USDT de teste:** primeiro precisa "aprovar" o contrato a gastar seu token — no
  próprio contrato do token (USDC ou o MockERC20), chame `approve` com o endereço do
  `PvPGenesisSale` e uma quantidade. Só depois chame `buyWithToken` no `PvPGenesisSale`, passando
  o endereço do token e a quantidade.

Depois de comprar, chame `positionOf` passando seu próprio endereço — ele mostra quanto você já
"investiu" em dólar e quanto PVP reservou. Dá pra ver tudo isso também direto no
**https://sepolia.basescan.org**, colando o endereço do contrato.

---

## 11. Ligar o site de verdade a esse contrato

Até aqui, tudo aconteceu só no Remix. Este passo final é o que faz o **próprio site**
(botão "Confirmar reserva" da página Genesis) mandar uma transação de verdade pra Base Sepolia,
em vez de só simular localmente como fazia antes.

Abra o arquivo `src/lib/genesisContract.ts` (peça pra IA abrir/editar se preferir não mexer você
mesmo) e preencha 3 endereços que você já tem guardados dos passos 6 e 7 acima:

```ts
export const GENESIS_CONTRACT_ADDRESS = ""; // <- endereço do PvPGenesisSale (passo 7)
```
```ts
USDT: { label: "USDT (teste)", address: "", decimals: 6, isStable: true }, // <- MockERC20 "USDT" (passo 6)
BTC: { label: "cbBTC (teste)", address: "", decimals: 8, isStable: false }, // <- MockERC20 "cbBTC" (passo 6)
```

Cole cada endereço entre as aspas vazias `""`. O endereço do USDC de teste já vem preenchido
(é o oficial da Circle, o mesmo do passo 3) e não precisa mexer nele.

**Importante:** enquanto `GENESIS_CONTRACT_ADDRESS` estiver vazio, o site continua se comportando
exatamente como antes — reserva só local, sem transação nenhuma. Só depois de colar o endereço é
que o botão passa a abrir a MetaMask de verdade. Ou seja, dá pra fazer esse passo com calma, sem
pressa e sem risco de "quebrar" o site enquanto isso.

Depois de salvar o arquivo com os 3 endereços preenchidos:

1. No terminal (com `npm run dev` já rodando em outra aba, ou reiniciando ele), abra o site local
   e vá na página **Genesis**.
2. Conecte a MetaMask — ela vai pedir pra trocar pra rede **Base Sepolia** automaticamente (o site
   já sabe que deve usar essa rede enquanto estiver em modo teste).
3. Escolha um valor, escolha o ativo (ETH, USDC, ou os de teste USDT/cbBTC — só aparecem os que
   você já configurou), e clique em "Confirmar reserva". A MetaMask vai abrir pedindo confirmação
   de verdade — exatamente como fez no Remix, só que agora pela tela do site.
4. Depois de confirmar, vá na página **Dashboard** — ela mostra sua posição real (lida direto do
   contrato) e o histórico de transações, cada uma com um link pra ver no BaseScan.

Se alguma coisa der errado (rede errada, ativo não configurado, campanha pausada), o site mostra
um aviso explicando o que fazer — nenhuma etapa deixa o dinheiro de teste "preso" no meio do
caminho.

---

## Resumindo o que esse contrato faz (e o que NÃO faz)

- Ele recebe o pagamento (ETH, USDC, ou os tokens de teste) e **anota** quanto cada pessoa
  investiu e quanto PVP ela reservou — como um caderno de registro.
- Ele **não** cria nem transfere o token PVP de verdade — isso só vai acontecer num contrato de
  Claim separado, no lançamento (TGE), exatamente como já está descrito no site.
- O dinheiro só sai do contrato através da função `withdraw`, e só pode ir para o endereço
  `treasury` configurado — nunca para um endereço qualquer.
- Preço e hard cap só podem ser alterados enquanto a campanha está pausada (`setSaleActive(false)`)
  — assim ninguém corre o risco de ver as regras mudarem no meio de uma compra.

**Isto é um rascunho de testnet.** Antes de qualquer versão com dinheiro real (mainnet), este
contrato precisa passar por auditoria de segurança profissional e revisão jurídica — sem exceção.
