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
nada de verdade. Pesquise por "Base Sepolia faucet" — tem opções como a da própria Coinbase
Developer Platform e a da thirdweb. Cole o endereço da sua carteira lá e recebe em segundos.

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
- `_priceUsd18`: `2000000000000000` (isso é $0.002 por PVP, no formato do contrato)
- `_hardCapUsd18`: `10000000000000000000000000` (isso é $10.000.000, no formato do contrato)

Confirme na MetaMask. Guarde o endereço do contrato que aparece depois do deploy — é esse
endereço que vamos usar no site depois.

## 8. Configurar os ativos aceitos

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
