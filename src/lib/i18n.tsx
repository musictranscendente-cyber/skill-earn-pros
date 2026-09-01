import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "pt" | "en";

const KEY = "pvp_lang_v1";

const STRINGS = {
  // Navbar
  "nav.home": { pt: "Início", en: "Home" },
  "nav.genesis": { pt: "Genesis", en: "Genesis" },
  "nav.dashboard": { pt: "Painel", en: "Dashboard" },
  "nav.claim": { pt: "Resgate", en: "Claim" },
  "nav.play": { pt: "Jogar Demo", en: "Play Demo" },

  // Hero
  "hero.badge": { pt: "Venda Genesis Ativa · Base Mainnet", en: "Genesis Sale is Live · Base Mainnet" },
  "hero.title1": { pt: "Onde Habilidade", en: "Where Skill" },
  "hero.title2": { pt: "Vira Recompensa.", en: "Becomes Reward." },
  "hero.subtitle": {
    pt: "PvP Pro é o ecossistema de games competitivos baseado em habilidade mais disputado do mundo. Compita em partidas PvP cara a cara, construa reputação e tenha sua fatia de uma economia movida por jogabilidade real — não por inflação.",
    en: "PvP Pro is the world's most competitive skill-based gaming ecosystem. Compete in head-to-head PvP matches, build reputation, and own a piece of an economy fueled by real gameplay — not inflation.",
  },
  "hero.cta.founder": { pt: "Torne-se um Founder", en: "Become a Founder" },
  "hero.cta.whitepaper": { pt: "Ler Whitepaper", en: "Read Whitepaper" },
  "hero.stat.price": { pt: "Preço Genesis", en: "Genesis Price" },
  "hero.stat.price.sub": { pt: "por PVP", en: "per PVP" },
  "hero.stat.cap": { pt: "Hard Cap", en: "Hard Cap" },
  "hero.stat.cap.sub": { pt: "rodada Genesis", en: "Genesis round" },
  "hero.stat.raised": { pt: "Arrecadado", en: "Raised" },
  "hero.stat.raised.suffix": { pt: "do Hard Cap", en: "of cap" },
  "hero.stat.launch": { pt: "Lançamento em", en: "Launch In" },
  "hero.progress": { pt: "Progresso", en: "Progress" },
  "hero.mockup.stake": { pt: "Aposta simulada", en: "Simulated stake" },
  "countdown.days": { pt: "Dias", en: "Days" },
  "countdown.hrs": { pt: "Hrs", en: "Hrs" },
  "countdown.min": { pt: "Min", en: "Min" },
  "countdown.sec": { pt: "Seg", en: "Sec" },

  // Games showcase (homepage)
  "games.eyebrow": { pt: "Biblioteca de Jogos", en: "Game Library" },
  "games.title1": { pt: "Vários jogos", en: "Many classic" },
  "games.title2": { pt: "clássicos, um só torneio", en: "games, one arena" },
  "games.subtitle": {
    pt: "Lig-4 já está disponível pra testar agora. Damas, xadrez, dominó, sinuca e mais estão a caminho — tudo dentro do mesmo sistema PvP com apostas simuladas hoje, reais no lançamento.",
    en: "Connect 4 is live to try right now. Checkers, chess, domino, pool and more are on the way — all inside the same PvP system, simulated stakes today, real ones at launch.",
  },
  "games.cta": { pt: "Jogar demo grátis", en: "Play free demo" },

  // Problem
  "problem.eyebrow": { pt: "O Problema", en: "The Problem" },
  "problem.title1": { pt: "Por que o GameFi tradicional", en: "Why traditional" },
  "problem.title2": { pt: "fracassou", en: "GameFi failed" },
  "problem.subtitle": {
    pt: "Uma geração de jogos Play-to-Earn quebrou porque suas economias dependiam de emissão de tokens, não de demanda real dos jogadores. O PvP Pro parte de uma premissa diferente.",
    en: "A generation of Play-to-Earn games collapsed because their economies depended on emissions, not on real player demand. PvP Pro starts from a different premise.",
  },
  "problem.item1.title": { pt: "Inflação infinita", en: "Infinite inflation" },
  "problem.item1.desc": { pt: "Emissões sem fim diluem os holders e destroem o valor no longo prazo.", en: "Endless emissions dilute holders and crush long-term value." },
  "problem.item2.title": { pt: "Despejo de tokens", en: "Token dumping" },
  "problem.item2.desc": { pt: "Farmers mercenários extraem liquidez e abandonam os projetos em semanas.", en: "Mercenary farmers extract liquidity and abandon projects in weeks." },
  "problem.item3.title": { pt: "Sem economia real", en: "No real economy" },
  "problem.item3.desc": { pt: "A receita vem de novos compradores, não do produto em si.", en: "Revenue comes from new buyers, not from the product itself." },
  "problem.item4.title": { pt: "Comunidades frágeis", en: "Weak communities" },
  "problem.item4.desc": { pt: "Sem participação real, não existe lealdade quando o mercado esfria.", en: "No skin in the game means no loyalty when markets get hard." },

  // Solution
  "solution.eyebrow": { pt: "A Solução", en: "The Solution" },
  "solution.title1": { pt: "Uma economia onde", en: "An economy where" },
  "solution.title2": { pt: "habilidade é o ativo", en: "skill is the asset" },
  "solution.subtitle": {
    pt: "O PvP Pro substitui emissão por demanda real. Jogadores pagam pra competir. Vencedores ganham. O treasury captura valor e recicla de volta pro ecossistema.",
    en: "PvP Pro replaces emissions with real demand. Players pay to compete. Winners earn. The treasury captures value and recycles it back into the ecosystem.",
  },
  "solution.item1.title": { pt: "Baseado em habilidade", en: "Skill-based" },
  "solution.item1.desc": { pt: "Toda partida tem um vencedor e um perdedor de verdade. Habilidade é a única vantagem.", en: "Every match has a real winner and a real loser. Skill is the only edge." },
  "solution.item2.title": { pt: "Movido a treasury", en: "Treasury-driven" },
  "solution.item2.desc": { pt: "As taxas de jogabilidade financiam um treasury transparente que sustenta o ecossistema.", en: "Gameplay fees fund a transparent treasury that backs the ecosystem." },
  "solution.item3.title": { pt: "Movido pela comunidade", en: "Community-driven" },
  "solution.item3.desc": { pt: "Founders ajudam a moldar decisões, propor torneios e curar temporadas competitivas.", en: "Founders shape decisions, propose tournaments and curate competitive seasons." },
  "solution.item4.title": { pt: "Economia Founder", en: "Founder economy" },
  "solution.item4.desc": { pt: "Early supporters ganham status vitalício, participação na receita e acesso exclusivo.", en: "Early supporters earn lifetime status, revenue share and exclusive access." },
  "solution.item5.title": { pt: "Receita de jogabilidade", en: "Gameplay revenue" },
  "solution.item5.desc": { pt: "Usuários reais pagando por partidas competitivas é o único motor sustentável.", en: "Real users paying for competitive matches is the only sustainable engine." },
  "solution.item6.title": { pt: "Flywheel de buyback", en: "Buyback flywheel" },
  "solution.item6.desc": { pt: "O treasury executa buybacks sistemáticos de PVP conforme as partidas escalam.", en: "Treasury executes systematic PVP buybacks as matches scale." },

  // Economy
  "economy.eyebrow": { pt: "Economia de Jogo", en: "Gameplay Economy" },
  "economy.flagship": { pt: "O motor econômico do PvP Pro", en: "The economic engine of PvP Pro" },
  "economy.title1": { pt: "Como o valor", en: "How value" },
  "economy.title2": { pt: "realmente flui", en: "actually flows" },
  "economy.subtitle": {
    pt: "Um ciclo fechado onde cada partida fortalece o treasury e cada ação do treasury reforça a demanda competitiva.",
    en: "A closed loop where every match strengthens the treasury and every treasury action reinforces competitive demand.",
  },
  "economy.step1.label": { pt: "Jogador A", en: "Player A" },
  "economy.step1.desc": { pt: "Paga a taxa da partida", en: "Pays match fee" },
  "economy.step2.label": { pt: "Jogador B", en: "Player B" },
  "economy.step2.desc": { pt: "Paga a taxa da partida", en: "Pays match fee" },
  "economy.step3.label": { pt: "Partida PvP", en: "PvP Match" },
  "economy.step3.desc": { pt: "Duelo baseado em habilidade", en: "Skill-based duel" },
  "economy.step4.label": { pt: "Vencedor", en: "Winner" },
  "economy.step4.desc": { pt: "Leva o prêmio", en: "Takes the pot" },
  "economy.step5.label": { pt: "Treasury", en: "Treasury" },
  "economy.step5.desc": { pt: "Captura a taxa do protocolo", en: "Captures protocol fee" },
  "economy.step6.label": { pt: "Buyback", en: "Buyback" },
  "economy.step6.desc": { pt: "Remove PVP do mercado", en: "Removes PVP from market" },
  "economy.step7.label": { pt: "Ecossistema", en: "Ecosystem" },
  "economy.step7.desc": { pt: "Financia crescimento e recompensas", en: "Funds growth & rewards" },

  // Tokenomics
  "tokenomics.eyebrow": { pt: "Tokenomics", en: "Tokenomics" },
  "tokenomics.title1": { pt: "O", en: "The" },
  "tokenomics.title2": { pt: "token PVP", en: "PVP token" },
  "tokenomics.subtitle": {
    pt: "Um utility token de supply fixo que move a camada competitiva — não um instrumento de rendimento estilo Ponzi.",
    en: "A fixed supply utility token that powers the competitive layer — not a Ponzi yield instrument.",
  },
  "tokenomics.supply": { pt: "Supply Total", en: "Total Supply" },
  "tokenomics.price": { pt: "Preço Genesis", en: "Genesis Price" },
  "tokenomics.price.sub": { pt: "por PVP", en: "per PVP" },
  "tokenomics.allocation": { pt: "Alocação Genesis", en: "Genesis Allocation" },
  "tokenomics.allocation.sub": { pt: "10% do supply", en: "10% of supply" },
  "tokenomics.network": { pt: "Rede", en: "Network" },
  "tokenomics.network.sub": { pt: "Mainnet", en: "Mainnet" },
  "tokenomics.center.label": { pt: "Supply", en: "Supply" },
  "tokenomics.alloc1": { pt: "Ecossistema e Recompensas", en: "Ecosystem & Rewards" },
  "tokenomics.alloc2": { pt: "Treasury", en: "Treasury" },
  "tokenomics.alloc3": { pt: "Time e Advisors", en: "Team & Advisors" },
  "tokenomics.alloc4": { pt: "Liquidez", en: "Liquidity" },
  "tokenomics.alloc5": { pt: "Venda Genesis", en: "Genesis Sale" },
  "tokenomics.alloc6": { pt: "Grants da Comunidade", en: "Community Grants" },

  // Founder Tiers
  "tiers.eyebrow": { pt: "Founder Tiers", en: "Founder Tiers" },
  "tiers.title1": { pt: "Escolha seu", en: "Choose your" },
  "tiers.title2": { pt: "nível de founder", en: "founder rank" },
  "tiers.subtitle": {
    pt: "Cada tier de founder libera benefícios vitalícios: torneios exclusivos, peso de governança e acesso antecipado às temporadas.",
    en: "Every founder tier unlocks lifetime benefits: exclusive tournaments, governance weight, and early access to seasons.",
  },
  "tiers.featured.badge": { pt: "Mais Popular", en: "Most Popular" },
  "tiers.benefit.nft": { pt: "Founder NFT (Temporada 0)", en: "Founder NFT (Season 0)" },
  "tiers.benefit.badge": { pt: "Selo de tier vitalício", en: "Lifetime tier badge" },
  "tiers.benefit.tournament": { pt: "Acesso a torneios", en: "Tournament access" },
  "tiers.benefit.governance": { pt: "Peso de governança", en: "Governance weight" },
  "tiers.benefit.revshare": { pt: "Alocação de revenue share", en: "Revenue share allocation" },
  "tiers.benefit.council": { pt: "Cadeira no conselho de Founders", en: "Founders council seat" },
  "tiers.reserve": { pt: "Reservar", en: "Reserve" },

  // Roadmap
  "roadmap.eyebrow": { pt: "Roadmap", en: "Roadmap" },
  "roadmap.title1": { pt: "Construído em", en: "Built in" },
  "roadmap.title2": { pt: "temporadas competitivas", en: "competitive seasons" },
  "roadmap.subtitle": {
    pt: "Um caminho em etapas do genesis até uma economia competitiva totalmente governada.",
    en: "A staged path from genesis to a fully governed competitive economy.",
  },
  "roadmap.p1.title": { pt: "Fundação", en: "Foundation" },
  "roadmap.p1.status": { pt: "No ar", en: "Live" },
  "roadmap.p1.i1": { pt: "Marca", en: "Brand" },
  "roadmap.p1.i2": { pt: "Whitepaper", en: "Whitepaper" },
  "roadmap.p1.i3": { pt: "Comunidade", en: "Community" },
  "roadmap.p1.i4": { pt: "Genesis", en: "Genesis" },
  "roadmap.p2.title": { pt: "Infraestrutura", en: "Infrastructure" },
  "roadmap.p2.status": { pt: "Em andamento", en: "In progress" },
  "roadmap.p2.i1": { pt: "Token", en: "Token" },
  "roadmap.p2.i2": { pt: "Contratos", en: "Contracts" },
  "roadmap.p2.i3": { pt: "Painel", en: "Dashboard" },
  "roadmap.p3.title": { pt: "MVP da Plataforma PvP", en: "PvP Platform MVP" },
  "roadmap.p3.status": { pt: "T2", en: "Q2" },
  "roadmap.p3.i1": { pt: "Matchmaking", en: "Matchmaking" },
  "roadmap.p3.i2": { pt: "Primeiro jogo competitivo", en: "First competitive game" },
  "roadmap.p3.i3": { pt: "Treasury integrado", en: "Treasury wired" },
  "roadmap.p4.title": { pt: "Expansão Competitiva", en: "Competitive Expansion" },
  "roadmap.p4.status": { pt: "T3", en: "Q3" },
  "roadmap.p4.i1": { pt: "Novos jogos", en: "New titles" },
  "roadmap.p4.i2": { pt: "Torneios", en: "Tournaments" },
  "roadmap.p4.i3": { pt: "Programa de streamers", en: "Streamer program" },
  "roadmap.p5.title": { pt: "Governança e NFTs", en: "Governance & NFTs" },
  "roadmap.p5.status": { pt: "T4+", en: "Q4+" },
  "roadmap.p5.i1": { pt: "Founder NFTs", en: "Founder NFTs" },
  "roadmap.p5.i2": { pt: "Votação on-chain", en: "On-chain voting" },
  "roadmap.p5.i3": { pt: "DAOs de temporada", en: "Season DAOs" },

  // FAQ
  "faq.eyebrow": { pt: "FAQ", en: "FAQ" },
  "faq.title1": { pt: "Perguntas,", en: "Questions," },
  "faq.title2": { pt: "respondidas", en: "answered" },
  "faq.q1": { pt: "O PvP Pro é um jogo Play-to-Earn?", en: "Is PvP Pro a Play-to-Earn game?" },
  "faq.a1": {
    pt: "Não. O PvP Pro é PvP baseado em habilidade. Os ganhos vêm de vencer partidas contra outros jogadores — nunca de emissão ou recompensas inflacionárias.",
    en: "No. PvP Pro is skill-based PvP. Earnings come from winning matches against other players — never from emissions or inflationary rewards.",
  },
  "faq.q2": { pt: "O que dá lastro ao token PVP?", en: "What backs the PVP token?" },
  "faq.a2": {
    pt: "Receita real do protocolo, vinda de partidas competitivas, financia um treasury transparente que executa buybacks sistemáticos.",
    en: "Real protocol revenue from competitive matches funds a transparent treasury that executes systematic buybacks.",
  },
  "faq.q3": { pt: "Quem pode se tornar um Founder?", en: "Who can become a Founder?" },
  "faq.a3": {
    pt: "Qualquer pessoa que participar da Venda Genesis. Founders recebem um selo de tier vitalício, um NFT e benefícios por tier.",
    en: "Anyone participating in the Genesis Sale. Founders receive a lifetime tier badge, NFT, and tier-based benefits.",
  },
  "faq.q4": { pt: "Em qual rede o PvP Pro é construído?", en: "Which network is PvP Pro built on?" },
  "faq.a4": {
    pt: "O PvP Pro é lançado na Base Mainnet, por causa das taxas baixas, finalidade rápida e amplo suporte de carteiras.",
    en: "PvP Pro launches on Base Mainnet for low fees, fast finality, and broad wallet support.",
  },
  "faq.q5": { pt: "Quando o token vai poder ser resgatado?", en: "When will the token be claimable?" },
  "faq.a5": {
    pt: "O resgate abre no TGE, depois que a Venda Genesis for concluída e os contratos forem auditados de forma independente.",
    en: "Claim opens at TGE, after the Genesis Sale completes and contracts are independently audited.",
  },
  "faq.q6": { pt: "Como eu conecto minha carteira?", en: "How do I connect my wallet?" },
  "faq.a6": {
    pt: "Use o botão Connect Wallet. MetaMask, Coinbase Wallet e WalletConnect são suportados.",
    en: "Use the Connect Wallet button. MetaMask, Coinbase Wallet, and WalletConnect are supported.",
  },

  // Footer
  "footer.tagline": {
    pt: "O PvP Pro é o ecossistema de games competitivos baseado em habilidade mais disputado do mundo. Onde habilidade vira recompensa.",
    en: "PvP Pro is the world's most competitive skill-based gaming ecosystem. Where skill becomes reward.",
  },
  "footer.platform": { pt: "Plataforma", en: "Platform" },
  "footer.genesis": { pt: "Venda Genesis", en: "Genesis Sale" },
  "footer.dashboard": { pt: "Painel do Founder", en: "Founder Dashboard" },
  "footer.claim": { pt: "Portal de Resgate", en: "Claim Portal" },
  "footer.resources": { pt: "Recursos", en: "Resources" },
  "footer.whitepaper": { pt: "Whitepaper", en: "Whitepaper" },
  "footer.faq": { pt: "FAQ", en: "FAQ" },
  "footer.brandkit": { pt: "Kit de Marca", en: "Brand Kit" },
  "footer.rights": { pt: "Todos os direitos reservados.", en: "All rights reserved." },
  "footer.disclaimer": { pt: "Construído na Base. Isso não é conselho financeiro.", en: "Built on Base. Not financial advice." },

  // Genesis page
  "genesis.badge": { pt: "Rodada Genesis", en: "Genesis Round" },
  "genesis.title1": { pt: "Reserve sua", en: "Reserve your" },
  "genesis.title2": { pt: "alocação de founder", en: "founder allocation" },
  "genesis.subtitle": {
    pt: "Escolha um valor e confirme. Este é um fluxo de demonstração — no TGE a mesma interface vai chamar o contrato auditado da Venda Genesis na Base.",
    en: "Select an amount and confirm. This is a demo flow — at TGE the same UI calls the audited Genesis Sale contract on Base.",
  },
  "genesis.amount.label": { pt: "Valor do investimento", en: "Investment amount" },
  "genesis.custom.label": { pt: "Valor personalizado (USDC)", en: "Custom amount (USDC)" },
  "genesis.receive": { pt: "Você recebe", en: "You receive" },
  "genesis.price": { pt: "Preço", en: "Price" },
  "genesis.tier": { pt: "Tier de founder", en: "Founder tier" },
  "genesis.confirm": { pt: "Confirmar reserva", en: "Confirm reservation" },
  "genesis.connect.prompt": { pt: "Conecte uma carteira para reservar", en: "Connect a wallet to reserve" },
  "genesis.demo.note": { pt: "Apenas demonstração — nenhum fundo é transferido.", en: "Demo only — no funds are transferred." },
  "genesis.progress.label": { pt: "Progresso da Genesis", en: "Genesis progress" },
  "genesis.raised.suffix": { pt: "arrecadado", en: "raised" },
  "genesis.cap.suffix": { pt: "limite", en: "cap" },
  "genesis.countdown.label": { pt: "Contagem para o lançamento", en: "Launch countdown" },
  "genesis.tier.ladder": { pt: "Escada de tiers", en: "Tier ladder" },
  "genesis.popular": { pt: "Mais escolhido", en: "Most chosen" },
  "genesis.slider.hint": { pt: "Ou arraste para personalizar", en: "Or drag to customize" },
  "genesis.toast.connect": { pt: "Conecte sua carteira primeiro", en: "Connect your wallet first" },
  "genesis.toast.reserved.prefix": { pt: "Reservado", en: "Reserved" },
  "genesis.toast.reserved.tier": { pt: "tier", en: "tier" },

  // Dashboard page
  "dashboard.connect.title": { pt: "Conecte sua carteira", en: "Connect your wallet" },
  "dashboard.connect.desc": {
    pt: "Faça login para ver seu painel de founder, PVP reservado e status de resgate.",
    en: "Sign in to view your founder dashboard, reserved PVP and claim status.",
  },
  "dashboard.label": { pt: "Painel do Founder", en: "Founder Dashboard" },
  "dashboard.welcome": { pt: "Bem-vindo de volta,", en: "Welcome back," },
  "dashboard.reserve.more": { pt: "Reservar mais PVP", en: "Reserve more PVP" },
  "dashboard.stat.wallet": { pt: "Carteira", en: "Wallet" },
  "dashboard.stat.wallet.sub": { pt: "Base Mainnet", en: "Base Mainnet" },
  "dashboard.stat.tier": { pt: "Tier de founder", en: "Founder tier" },
  "dashboard.stat.tier.unlock": { pt: "Reserve para desbloquear", en: "Reserve to unlock" },
  "dashboard.stat.reserved": { pt: "PVP Reservado", en: "Reserved PVP" },
  "dashboard.stat.invested.suffix": { pt: "investido", en: "invested" },
  "dashboard.stat.status": { pt: "Status da Genesis", en: "Genesis status" },
  "dashboard.stat.status.value": { pt: "Aguardando TGE", en: "Pending TGE" },
  "dashboard.stat.status.sub": { pt: "Resgate bloqueado", en: "Claim locked" },
  "dashboard.tx.title": { pt: "Histórico de transações", en: "Transaction history" },
  "dashboard.tx.entries": { pt: "registros", en: "entries" },
  "dashboard.tx.empty": { pt: "Nenhuma transação ainda.", en: "No transactions yet." },
  "dashboard.tx.empty.cta": { pt: "Reserve PVP", en: "Reserve PVP" },
  "dashboard.tx.empty.suffix": { pt: "para ver sua atividade aqui.", en: "to see your activity here." },
  "dashboard.tx.col.tx": { pt: "Tx", en: "Tx" },
  "dashboard.tx.col.amount": { pt: "Valor", en: "Amount" },
  "dashboard.tx.col.pvp": { pt: "PVP", en: "PVP" },
  "dashboard.tx.col.date": { pt: "Data", en: "Date" },
  "dashboard.tx.col.status": { pt: "Status", en: "Status" },
  "dashboard.tx.status.reserved": { pt: "Reservado", en: "Reserved" },
  "dashboard.tx.status.confirmed": { pt: "Confirmado", en: "Confirmed" },
  "dashboard.claim.opens": { pt: "Resgate abre em", en: "Claim opens in" },
  "dashboard.claim.goto": { pt: "Ir para o portal de resgate", en: "Go to claim portal" },
  "dashboard.perks.title": { pt: "Benefícios do tier", en: "Tier perks" },
  "dashboard.perks.badge": { pt: "Selo de founder vitalício", en: "Lifetime founder badge" },
  "dashboard.perks.nft": { pt: "Airdrop de NFT da Temporada 0", en: "Season 0 NFT airdrop" },
  "dashboard.perks.tournament": { pt: "Acesso antecipado a torneios", en: "Tournament early access" },
  "dashboard.perks.governance": { pt: "Peso de governança", en: "Governance weight" },
  "dashboard.perks.revshare": { pt: "Alocação de revenue share", en: "Revenue share allocation" },
  "dashboard.perks.council": { pt: "Cadeira no conselho de Founders", en: "Founders council seat" },

  // Claim page
  "claim.badge": { pt: "Portal de Resgate", en: "Claim Portal" },
  "claim.title1": { pt: "Seus tokens, ", en: "Your tokens, " },
  "claim.title2": { pt: "desbloqueados no TGE", en: "unlocked at TGE" },
  "claim.subtitle": {
    pt: "O resgate abre automaticamente assim que a Venda Genesis for concluída e o contrato de resgate auditado for implantado.",
    en: "Claim opens automatically once the Genesis Sale concludes and the audited claim contract is deployed.",
  },
  "claim.reserved.label": { pt: "Tokens reservados", en: "Reserved tokens" },
  "claim.status.label": { pt: "Status", en: "Status" },
  "claim.status.value": { pt: "Bloqueado · aguardando TGE", en: "Locked · pending TGE" },
  "claim.unlocks": { pt: "Desbloqueia em", en: "Unlocks in" },
  "claim.button": { pt: "Resgatar PVP", en: "Claim PVP" },
  "claim.note": {
    pt: "O botão de resgate será ativado no lançamento. Conecte sua carteira para verificar sua alocação reservada.",
    en: "Claim button will activate at launch. Connect your wallet to verify your reserved allocation.",
  },

  // Wallet button / modal
  "wallet.connect": { pt: "Conectar Carteira", en: "Connect Wallet" },
  "wallet.modal.title": { pt: "Conecte uma carteira", en: "Connect a wallet" },
  "wallet.modal.desc": { pt: "Conecte na Base Mainnet para acessar seu painel de founder.", en: "Connect on Base Mainnet to access your founder dashboard." },
  "wallet.connecting": { pt: "Conectando…", en: "Connecting…" },
  "wallet.detected": { pt: "Detectado", en: "Detected" },
  "wallet.demo.note": {
    pt: "Conexão de carteira real. A compra da Genesis ainda roda em modo demonstração até o contrato auditado entrar no ar.",
    en: "Real wallet connection. Genesis purchases still run in demo mode until the audited contract goes live.",
  },
  "wallet.disconnect": { pt: "Desconectar", en: "Disconnect" },
  "wallet.browser.wallet": { pt: "Carteira do navegador", en: "Browser wallet" },
  "wallet.notfound.desc": {
    pt: "Nenhuma carteira Web3 foi detectada neste navegador.",
    en: "No Web3 wallet was detected in this browser.",
  },
  "wallet.notfound.cta": { pt: "Instalar MetaMask", en: "Install MetaMask" },
  "wallet.comingsoon": { pt: "Em breve", en: "Coming soon" },
  "wallet.switch.base": { pt: "Trocar para Base", en: "Switch to Base" },

  // Play / Lig-4 demo page
  "play.badge": { pt: "Demo Aberta · Grátis", en: "Open Demo · Free" },
  "play.title1": { pt: "Sinta o gostinho de um", en: "Get a taste of a" },
  "play.title2": { pt: "duelo PvP", en: "PvP duel" },
  "play.subtitle": {
    pt: "Uma prévia gratuita e sem compromisso de como serão os duelos 1x1 no PvP Pro. Escolha uma aposta simulada, encontre um adversário e jogue uma partida de Lig-4 — o placar aqui é só para teste.",
    en: "A free, no-strings preview of what 1v1 duels will feel like on PvP Pro. Pick a simulated stake, find an opponent, and play a round of Connect 4 — the score here is just for testing.",
  },
  "play.stake.label": { pt: "Aposta simulada", en: "Simulated stake" },
  "play.stake.sub": { pt: "Escolha o valor e encontre um adversário", en: "Pick an amount and find an opponent" },
  "play.stake.win.prefix": { pt: "ganha", en: "win" },
  "play.stake.note": { pt: "100% fictício — nenhum valor real é usado nesta demo.", en: "100% fictional — no real funds are used in this demo." },
  "play.find.cta": { pt: "Buscar Adversário", en: "Find Opponent" },
  "play.searching.title": { pt: "Procurando adversário…", en: "Searching for an opponent…" },
  "play.searching.sub": { pt: "Conectando você a um jogador disponível", en: "Connecting you to an available player" },
  "play.found.title": { pt: "Adversário encontrado!", en: "Opponent found!" },
  "play.found.tag": { pt: "Modo teste · adversário simulado (bot)", en: "Test mode · simulated opponent (bot)" },
  "play.start.cta": { pt: "Começar Partida", en: "Start Match" },
  "play.you": { pt: "Você", en: "You" },
  "play.turn.you": { pt: "Sua vez", en: "Your turn" },
  "play.turn.bot": { pt: "Vez do adversário…", en: "Opponent's turn…" },
  "play.result.win.title": { pt: "Vitória!", en: "Victory!" },
  "play.result.win.sub": { pt: "Foi assim que uma vitória de verdade vai parecer.", en: "This is what a real win will feel like." },
  "play.result.lose.title": { pt: "Não foi dessa vez", en: "Not this time" },
  "play.result.lose.sub": { pt: "Tenta de novo — é só treino.", en: "Give it another shot — it's just practice." },
  "play.result.draw.title": { pt: "Empate!", en: "Draw!" },
  "play.result.draw.sub": { pt: "Ninguém venceu essa. Bora revanche?", en: "Nobody won this one. Rematch?" },
  "play.reward.label": { pt: "Você ganhou", en: "You won" },
  "play.reward.demo.note": { pt: "Valor simulado — 90% da sua aposta demo. Nenhum dinheiro real envolvido.", en: "Simulated amount — 90% of your demo stake. No real money involved." },
  "play.again.cta": { pt: "Jogar Novamente", en: "Play Again" },
  "play.genesis.cta": { pt: "Reservar PVP de Verdade", en: "Reserve Real PVP" },
  "play.demo.note": { pt: "Isso é uma demonstração. Nenhum fundo, token ou saldo real é afetado.", en: "This is a demo. No real funds, tokens, or balances are affected." },
  "play.howto.title": { pt: "Como jogar", en: "How to play" },
  "play.howto.desc": { pt: "Clique em uma coluna para soltar sua peça. Seja o primeiro a alinhar 4 peças na horizontal, vertical ou diagonal.", en: "Click a column to drop your piece. Be the first to line up 4 in a row — horizontally, vertically, or diagonally." },
  "play.color.you": { pt: "você · roxo", en: "you · purple" },
  "play.color.bot": { pt: "adversário · azul", en: "opponent · blue" },
  "play.sound.on": { pt: "Som ligado", en: "Sound on" },
  "play.sound.off": { pt: "Som desligado", en: "Sound off" },
  "play.result.win.big": { pt: "VOCÊ VENCEU!", en: "YOU WON!" },
  "play.result.lose.big": { pt: "VOCÊ PERDEU", en: "YOU LOST" },
  "play.result.draw.big": { pt: "EMPATE!", en: "DRAW!" },
  "play.result.drag.hint": { pt: "Arraste para mover e ver o tabuleiro", en: "Drag to move and see the board" },

  // Game selection hub (on /play)
  "play.games.title": { pt: "Escolha um jogo", en: "Choose a game" },
  "play.games.connect4": { pt: "Lig-4", en: "Connect 4" },
  "play.games.connect4.desc": { pt: "Alinhe 4 peças antes do adversário. Rápido e direto.", en: "Line up 4 pieces before your opponent. Fast and simple." },
  "play.games.available": { pt: "Disponível agora", en: "Available now" },
  "play.games.play.cta": { pt: "Jogar agora", en: "Play now" },
  "play.games.soon.title": { pt: "Mais jogos em breve", en: "More games coming soon" },
  "play.games.soon": { pt: "Em breve", en: "Coming soon" },
  "play.games.checkers": { pt: "Damas", en: "Checkers" },
  "play.games.domino": { pt: "Dominó", en: "Dominoes" },
  "play.games.tictactoe": { pt: "Jogo da Velha", en: "Tic-Tac-Toe" },
  "play.games.pool": { pt: "Sinuca", en: "Pool" },
  "play.games.chess": { pt: "Xadrez", en: "Chess" },
  "play.games.truco": { pt: "Truco", en: "Truco" },
  "play.games.battleship": { pt: "Batalha Naval", en: "Battleship" },
  "play.games.racing": { pt: "Corrida", en: "Racing" },
  "play.games.quiz": { pt: "Quiz Duelo", en: "Quiz Duel" },
  "play.games.maze": { pt: "Labirinto", en: "Maze Race" },
  "play.games.sudoku": { pt: "Sudoku", en: "Sudoku" },
  "play.games.arena": { pt: "Arena PvP", en: "PvP Arena" },
  "play.games.pingpong": { pt: "Tênis de Mesa", en: "Table Tennis" },
  "play.games.airhockey": { pt: "Hóquei de Mesa", en: "Air Hockey" },
  "play.back.games": { pt: "Escolher outro jogo", en: "Choose another game" },
} as const;

type StringKey = keyof typeof STRINGS;

type LangCtxType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: StringKey) => string;
};

const LangCtx = createContext<LangCtxType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("pt");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === "pt" || saved === "en") setLangState(saved);
    } catch {}
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {}
  }

  function t(key: StringKey): string {
    return STRINGS[key]?.[lang] ?? String(key);
  }

  return <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>;
}

export function useLang() {
  const ctx = useContext(LangCtx);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
