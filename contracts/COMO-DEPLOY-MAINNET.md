# Como colocar o contrato no ar na mainnet (Base — dinheiro de verdade)

Este guia é o mesmo espírito do `COMO-TESTAR-NA-TESTNET.md`, só que agora na rede **principal**
da Base, com ETH e dólar de verdade. Nada aqui é irreversível até você mesmo confirmar cada
transação na MetaMask — eu não tenho acesso à sua carteira nem consigo assinar nada por você.

⚠️ **O que ficou decidido até aqui, pra não esquecer:**
- Ativos aceitos no lançamento: **ETH** e **USDC** apenas (sem USDT — não existe USDT oficial na
  Base; sem cbBTC — pra evitar repetir o susto do preço inflado que aconteceu na testnet).
- A função `grantPosition` (dar posição manualmente, ex: pra youtuber) **continua no contrato**,
  mas você decidiu não chamá-la até ter a liberação jurídica — ela fica disponível, só não é usada
  ainda.
- Carteira do tesouro (`treasury`): `0x5AF24bb56AFD01cCed20946578654D87B6013479`

---

## 1. Adicionar a rede Base (mainnet) na MetaMask

A MetaMask já vem com a Base cadastrada em muitas versões recentes — confira primeiro na lista de
redes. Se não tiver, adicione manualmente:

- **Nome da rede:** Base
- **URL do RPC:** `https://mainnet.base.org`
- **Chain ID:** `8453`
- **Símbolo da moeda:** ETH
- **URL do explorador:** `https://basescan.org`

## 2. Ter ETH de verdade na carteira

Diferente da testnet, aqui não tem faucet — você precisa de ETH de verdade na Base pra pagar o
"gás" (taxa) do deploy e das configurações. As formas mais simples:

- Se você tem conta na **Coinbase**, dá pra sacar ETH direto pra rede Base (sem taxa de rede, é um
  saque interno da própria Coinbase).
- Se seu ETH está em outra rede (ex: Ethereum mainnet) ou em outra corretora, use uma ponte
  oficial: **https://superbridge.app/?fromChainId=1&toChainId=8453** (Superbridge) ou
  **https://brid.gg** — ambas oficiais/recomendadas pela documentação da Base.

Não precisa de muito — o deploy e as 3 chamadas de configuração juntas costumam custar bem pouco
(a Base tem taxas de rede baixas). Ainda assim, é dinheiro de verdade, então comece com uma
quantia pequena, só pra cobrir o gás.

## 3. Abrir o Remix

Vá em **https://remix.ethereum.org** (mesmo site da vez passada).

- Crie um arquivo `PvPGenesisSale.sol` e cole o conteúdo mais atual do contrato (o mesmo que já
  está rodando na testnet — não precisa de nenhuma mudança de código pra ir pra mainnet).
- Não precisa do `MockERC20.sol` desta vez — na mainnet vamos usar o USDC oficial de verdade, não
  um token de teste.

## 4. Compilar

Aba "Solidity Compiler", versão `0.8.24` (ou `0.8.2x` mais recente disponível), clique em
"Compile PvPGenesisSale.sol". Confirme que não apareceu nada em vermelho.

## 5. Deploy do contrato principal

Na aba "Deploy & Run":

- **Environment:** "Injected Provider - MetaMask" — confirme que a MetaMask está na rede **Base**
  (não Base Sepolia — cuidado pra não confundir as duas na hora de trocar).
- Selecione o contrato `PvPGenesisSale` e preencha os 5 campos do construtor:

```
initialOwner:      <endereço da sua própria carteira MetaMask>
initialTreasury:   0x5AF24bb56AFD01cCed20946578654D87B6013479
_priceUsd18:       100000000000000000          (mesmo preço de sempre: $0,10 por PVP — me avisa se quiser mudar)
_hardCapUsd18:     10000000000000000000000000  (mesmo hard cap de sempre: $10.000.000 — me avisa se quiser mudar)
_minPurchaseUsd18: 5000000000000000000         (compra mínima: $5 — me avisa se quiser mudar)
```

Clique em "Deploy", confirme na MetaMask (essa transação já custa gás de verdade). Guarde o
**endereço do contrato** que aparece depois — é o mais importante desse processo, vamos precisar
dele no passo 8.

## 6. Verificar o price feed do ETH antes de usar

⚠️ **Não pule esta etapa.** Eu tenho um endereço candidato pro Chainlink ETH/USD da Base mainnet
(`0x50015f8b17fb2C290Dde41fDc246ed0dcEE93a8b`), vindo da documentação oficial da Chainlink, mas
não consegui confirmar 100% por ferramenta automática que ele é exatamente o par "ETH / USD" (a
página da Chainlink carrega os dados por JavaScript e minhas ferramentas de leitura não conseguem
rodar isso). Antes de usar esse endereço no passo 8, confirme você mesmo pelo Remix:

1. Ainda na aba "Deploy & Run", em "Contract" escolha `AggregatorV3Interface` (ou cole o ABI
   mínimo se o Remix não listar — me avisa se precisar que eu gere esse arquivo).
2. Em vez de fazer deploy, use a opção **"At Address"**, colando
   `0x50015f8b17fb2C290Dde41fDc246ed0dcEE93a8b`.
3. Chame `description()` — **tem que retornar exatamente `"ETH / USD"`**.
4. Chame `decimals()` — **tem que retornar `8`**.

Se bater os dois, pode usar esse endereço no passo 8 sem problema. Se vier qualquer coisa
diferente (outro par, erro, etc.), me manda o resultado exato que eu procuro o endereço certo
antes de continuar — não configure o ETH com um feed não verificado, porque aí sim um preço errado
poderia passar despercebido (diferente da testnet, aqui é dinheiro de verdade).

## 7. Confirmar o endereço oficial do USDC

O endereço abaixo já foi verificado como o contrato oficial do USDC emitido pela Circle na Base
mainnet — não precisa reconferir, mas se quiser conferir por conta própria, o próprio site da
Circle (circle.com) lista os endereços oficiais por rede.

```
0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
```

## 8. Configurar os ativos aceitos

Ainda no contrato `PvPGenesisSale` já deployado (não precisa fazer "At Address" de novo, ele
continua na tela), chame `configureAsset` duas vezes:

**ETH** (endereço `0x0000...0000` representa ETH nativo):
```
token:         0x0000000000000000000000000000000000000000
enabled:       true
isStable:      false
tokenDecimals: 18
priceFeed:     0x50015f8b17fb2C290Dde41fDc246ed0dcEE93a8b   (Chainlink ETH/USD, Base mainnet — só use depois de confirmar no passo 6)
```

**USDC:**
```
token:         0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
enabled:       true
isStable:      true
tokenDecimals: 6
priceFeed:     0x0000000000000000000000000000000000000000   (ignorado quando isStable = true)
```

## 9. Testar uma compra pequena, você mesmo, antes de abrir pro público

Chame `setSaleActive` com `true`. Depois, com a mesma carteira ou outra sua, faça uma compra
pequena de verdade:

- **Com ETH:** `buyWithEth`, colocando um valor pequeno (ex: `0.001` ether) no campo "VALUE" do
  Remix antes de clicar.
- **Com USDC:** primeiro `approve` no contrato do USDC (endereço do passo 7) autorizando o
  `PvPGenesisSale` a gastar uma quantidade pequena, depois `buyWithToken` no `PvPGenesisSale`
  passando o endereço do USDC e a quantidade.

Depois, chame `positionOf` com seu próprio endereço pra conferir que o valor em dólar registrado
bate com o que você pagou (isso é justamente o que falhou com o cbBTC na testnet — vale a pena
conferir com calma aqui antes de liberar pro site).

## 10. Ligar o site de verdade a esse contrato

Só depois que o teste do passo 9 confirmar que está tudo certo: me manda o endereço do contrato
que você guardou no passo 5. Eu preencho `GENESIS_CONTRACT_ADDRESS_MAINNET` no arquivo
`src/lib/genesisContract.ts` e, só depois que você confirmar que quer ligar o site de verdade pra
mainnet, mudo `TESTNET_MODE` de `true` pra `false`. A partir daí, o botão "Confirmar reserva" do
site passa a mandar transação real pra Base mainnet, com dinheiro de verdade.

**Importante:** enquanto `TESTNET_MODE` continuar `true`, o site publicado continua usando a Base
Sepolia normalmente — então não tem pressa nem risco de "virar mainnet sem querer" no meio do
caminho. Essa troca só acontece quando eu editar essa única linha, a seu pedido.

---

## Resumindo o que muda da testnet pra mainnet

- Mesma lógica do contrato, sem nenhuma alteração de código — só muda a rede e os endereços dos
  ativos/feeds.
- Dinheiro de verdade a partir do passo 5 em diante — cada clique de "confirmar" na MetaMask gasta
  ETH de verdade em taxa de rede.
- `grantPosition` fica disponível no contrato, mas você decidiu não chamá-la ainda, até ter a
  liberação jurídica pra compensar os youtubers oficialmente.
- Preço e hard cap só podem mudar enquanto a campanha está pausada (`setSaleActive(false)`) — os
  mesmos valores da testnet foram sugeridos aqui, mas é só avisar se quiser outros antes do deploy.
