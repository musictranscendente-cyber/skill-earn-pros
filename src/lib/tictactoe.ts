// PvP Pro — Jogo da Velha (Tic-Tac-Toe) engine — pure logic, no React/UI here.
// Mesmo "formato" de dados do connect4.ts (board = matriz de 0/1/2, 1 = humano,
// 2 = bot) de propósito, pra reaproveitar o máximo da estrutura já testada em
// play.tsx — a única diferença real é COMO uma jogada é feita: aqui a pessoa clica
// direto na célula que quer marcar, em vez de "cair" numa coluna por gravidade.

export const SIZE = 3;

export type Cell = 0 | 1 | 2;
export type Board = Cell[][];
export type Player = 1 | 2;

export function createEmptyBoard(): Board {
  return Array.from({ length: SIZE }, () => Array<Cell>(SIZE).fill(0));
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

export function getEmptyCells(board: Board): [number, number][] {
  const cells: [number, number][] = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === 0) cells.push([r, c]);
    }
  }
  return cells;
}

export function isBoardFull(board: Board): boolean {
  return getEmptyCells(board).length === 0;
}

/** Marca uma célula pro jogador. Retorna null se a célula já estiver ocupada
 *  (clique inválido — play.tsx já evita isso pela UI, mas a função se protege sozinha). */
export function placeMark(board: Board, row: number, col: number, player: Player): { board: Board } | null {
  if (board[row][col] !== 0) return null;
  const next = cloneBoard(board);
  next[row][col] = player;
  return { board: next };
}

export type WinResult = { winner: Player; line: [number, number][] } | null;

const LINES: [number, number][][] = [
  [[0, 0], [0, 1], [0, 2]],
  [[1, 0], [1, 1], [1, 2]],
  [[2, 0], [2, 1], [2, 2]],
  [[0, 0], [1, 0], [2, 0]],
  [[0, 1], [1, 1], [2, 1]],
  [[0, 2], [1, 2], [2, 2]],
  [[0, 0], [1, 1], [2, 2]],
  [[0, 2], [1, 1], [2, 0]],
];

export function checkWinner(board: Board): WinResult {
  for (const line of LINES) {
    const [a, b, c] = line;
    const va = board[a[0]][a[1]];
    if (va === 0) continue;
    if (va === board[b[0]][b[1]] && va === board[c[0]][c[1]]) {
      return { winner: va, line };
    }
  }
  return null;
}

/** Minimax "de verdade" (sem poda/profundidade limitada — o tabuleiro é tão pequeno,
 *  no máximo 9 jogadas, que calcular todas as possibilidades é instantâneo). Um bot
 *  jogando isso sem nenhuma válvula de escape NUNCA perderia (jogo da velha é um jogo
 *  "resolvido": com os dois lados jogando perfeitamente, sempre empata) — ver
 *  `getBotMove` abaixo pra como isso é suavizado, igual ao bot do Lig-4
 *  (connect4.ts), pra manter o demo divertido em vez de impossível de vencer. */
function minimax(
  board: Board,
  depth: number,
  maximizing: boolean,
  botPlayer: Player,
  humanPlayer: Player,
): { score: number; move: [number, number] | null } {
  const win = checkWinner(board);
  if (win) {
    if (win.winner === botPlayer) return { score: 10 - depth, move: null };
    return { score: depth - 10, move: null };
  }
  const empty = getEmptyCells(board);
  if (empty.length === 0) return { score: 0, move: null };

  let bestMove: [number, number] = empty[0];
  if (maximizing) {
    let value = -Infinity;
    for (const [r, c] of empty) {
      const placed = placeMark(board, r, c, botPlayer)!;
      const result = minimax(placed.board, depth + 1, false, botPlayer, humanPlayer);
      if (result.score > value) {
        value = result.score;
        bestMove = [r, c];
      }
    }
    return { score: value, move: bestMove };
  } else {
    let value = Infinity;
    for (const [r, c] of empty) {
      const placed = placeMark(board, r, c, humanPlayer)!;
      const result = minimax(placed.board, depth + 1, true, botPlayer, humanPlayer);
      if (result.score < value) {
        value = result.score;
        bestMove = [r, c];
      }
    }
    return { score: value, move: bestMove };
  }
}

/**
 * Escolhe a jogada do bot. Mesma filosofia do Lig-4 (connect4.ts): joga bem (bloqueia/
 * vence quando dá) mas é DE PROPÓSITO beatável, senão ninguém nunca ganharia nada num
 * jogo da velha jogado "perfeito" dos dois lados.
 */
export function getBotMove(board: Board, botPlayer: Player, humanPlayer: Player): [number, number] | null {
  const empty = getEmptyCells(board);
  if (empty.length === 0) return null;
  if (empty.length === 1) return empty[0];

  // "Easy mode" — mesmas válvulas de escape do Lig-4, ajustadas pro jogo da velha ser
  // pequeno/rápido (uma única blunder aqui já muda o resultado, ao contrário do Lig-4
  // onde sobra tabuleiro pra se recuperar).
  const TAKE_WIN_CHANCE = 0.7;
  const BLOCK_CHANCE = 0.45;
  const BLUNDER_CHANCE = 0.4;

  // 1. Fecha uma vitória imediata (na maioria das vezes).
  if (Math.random() < TAKE_WIN_CHANCE) {
    for (const [r, c] of empty) {
      const placed = placeMark(board, r, c, botPlayer)!;
      if (checkWinner(placed.board)?.winner === botPlayer) return [r, c];
    }
  }
  // 2. Bloqueia uma vitória sua iminente (não sempre).
  if (Math.random() < BLOCK_CHANCE) {
    for (const [r, c] of empty) {
      const placed = placeMark(board, r, c, humanPlayer)!;
      if (checkWinner(placed.board)?.winner === humanPlayer) return [r, c];
    }
  }

  const { move } = minimax(board, 0, true, botPlayer, humanPlayer);
  if (move) {
    // Troca a jogada "perfeita" por uma mais fraca com frequência — mantém fácil de
    // vencer/empatar em vez de sempre bater no empate garantido do minimax puro.
    if (Math.random() < BLUNDER_CHANCE) {
      const alt = empty.filter(([r, c]) => !(r === move[0] && c === move[1]));
      if (alt.length > 0) return alt[Math.floor(Math.random() * alt.length)];
    }
    return move;
  }
  return empty[Math.floor(Math.random() * empty.length)];
}
