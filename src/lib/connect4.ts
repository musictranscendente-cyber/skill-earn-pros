// Connect 4 ("Lig-4") game engine — pure logic, no React/UI here.
// Board is row-major: board[row][col], row 0 = top row, row ROWS-1 = bottom row.
// Cell values: 0 = empty, 1 = human player, 2 = bot.

export const ROWS = 6;
export const COLS = 7;

export type Cell = 0 | 1 | 2;
export type Board = Cell[][];
export type Player = 1 | 2;

export function createEmptyBoard(): Board {
  return Array.from({ length: ROWS }, () => Array<Cell>(COLS).fill(0));
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => [...row]);
}

export function getValidColumns(board: Board): number[] {
  const cols: number[] = [];
  for (let c = 0; c < COLS; c++) if (board[0][c] === 0) cols.push(c);
  return cols;
}

export function isColumnFull(board: Board, col: number): boolean {
  return board[0][col] !== 0;
}

export function isBoardFull(board: Board): boolean {
  return getValidColumns(board).length === 0;
}

/** Drops a piece into a column. Returns the row it landed on, or null if the column is full. */
export function dropPiece(board: Board, col: number, player: Player): { board: Board; row: number } | null {
  if (isColumnFull(board, col)) return null;
  const next = cloneBoard(board);
  let landedRow = -1;
  for (let r = ROWS - 1; r >= 0; r--) {
    if (next[r][col] === 0) {
      next[r][col] = player;
      landedRow = r;
      break;
    }
  }
  return { board: next, row: landedRow };
}

export type WinResult = { winner: Player; line: [number, number][] } | null;

const DIRECTIONS: [number, number][] = [
  [0, 1], // horizontal
  [1, 0], // vertical
  [1, 1], // diagonal down-right
  [1, -1], // diagonal down-left
];

export function checkWinner(board: Board): WinResult {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const player = board[r][c];
      if (player === 0) continue;
      for (const [dr, dc] of DIRECTIONS) {
        const line: [number, number][] = [[r, c]];
        for (let i = 1; i < 4; i++) {
          const nr = r + dr * i;
          const nc = c + dc * i;
          if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS || board[nr][nc] !== player) break;
          line.push([nr, nc]);
        }
        if (line.length === 4) return { winner: player, line };
      }
    }
  }
  return null;
}

function windowScore(cells: Cell[], player: Player): number {
  const opponent: Player = player === 1 ? 2 : 1;
  const playerCount = cells.filter((c) => c === player).length;
  const opponentCount = cells.filter((c) => c === opponent).length;
  const emptyCount = cells.filter((c) => c === 0).length;

  if (playerCount === 4) return 1000;
  if (opponentCount === 4) return -1000;
  if (playerCount === 3 && emptyCount === 1) return 50;
  if (playerCount === 2 && emptyCount === 2) return 10;
  if (opponentCount === 3 && emptyCount === 1) return -80;
  if (opponentCount === 2 && emptyCount === 2) return -8;
  return 0;
}

function evaluateBoard(board: Board, player: Player): number {
  let score = 0;

  // Prefer center column control.
  const centerCol = Math.floor(COLS / 2);
  const centerCount = board.reduce((acc, row) => acc + (row[centerCol] === player ? 1 : 0), 0);
  score += centerCount * 6;

  // Horizontal windows
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      score += windowScore([board[r][c], board[r][c + 1], board[r][c + 2], board[r][c + 3]], player);
    }
  }
  // Vertical windows
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r <= ROWS - 4; r++) {
      score += windowScore([board[r][c], board[r + 1][c], board[r + 2][c], board[r + 3][c]], player);
    }
  }
  // Diagonal down-right
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      score += windowScore(
        [board[r][c], board[r + 1][c + 1], board[r + 2][c + 2], board[r + 3][c + 3]],
        player,
      );
    }
  }
  // Diagonal down-left
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = COLS - 1; c >= 3; c--) {
      score += windowScore(
        [board[r][c], board[r + 1][c - 1], board[r + 2][c - 2], board[r + 3][c - 3]],
        player,
      );
    }
  }
  return score;
}

function minimax(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  maximizing: boolean,
  botPlayer: Player,
  humanPlayer: Player,
): { score: number; col: number | null } {
  const valid = getValidColumns(board);
  const win = checkWinner(board);

  if (win) {
    if (win.winner === botPlayer) return { score: 1_000_000 - (6 - depth), col: null };
    return { score: -1_000_000 + (6 - depth), col: null };
  }
  if (valid.length === 0) return { score: 0, col: null };
  if (depth === 0) return { score: evaluateBoard(board, botPlayer), col: null };

  // Try center-first for better pruning.
  const ordered = [...valid].sort((a, b) => Math.abs(a - COLS / 2) - Math.abs(b - COLS / 2));

  let bestCol = ordered[0];
  if (maximizing) {
    let value = -Infinity;
    for (const col of ordered) {
      const dropped = dropPiece(board, col, botPlayer);
      if (!dropped) continue;
      const result = minimax(dropped.board, depth - 1, alpha, beta, false, botPlayer, humanPlayer);
      if (result.score > value) {
        value = result.score;
        bestCol = col;
      }
      alpha = Math.max(alpha, value);
      if (alpha >= beta) break;
    }
    return { score: value, col: bestCol };
  } else {
    let value = Infinity;
    for (const col of ordered) {
      const dropped = dropPiece(board, col, humanPlayer);
      if (!dropped) continue;
      const result = minimax(dropped.board, depth - 1, alpha, beta, true, botPlayer, humanPlayer);
      if (result.score < value) {
        value = result.score;
        bestCol = col;
      }
      beta = Math.min(beta, value);
      if (alpha >= beta) break;
    }
    return { score: value, col: bestCol };
  }
}

/**
 * Picks the bot's move. Plays a solid game (blocks/wins when it can) but is
 * intentionally beatable: it occasionally settles for a good-not-perfect move
 * so the demo feels fun rather than unbeatable.
 */
export function getBotMove(board: Board, botPlayer: Player, humanPlayer: Player): number {
  const valid = getValidColumns(board);
  if (valid.length === 0) return -1;
  if (valid.length === 1) return valid[0];

  // "Easy mode" knobs — tuned so a casual first-time visitor wins noticeably
  // more often than they lose. This is a demo meant to feel good, not a
  // competitive opponent.
  const TAKE_WIN_CHANCE = 0.65; // sometimes lets a winning move slip
  const BLOCK_CHANCE = 0.4; // often fails to block your winning move
  const BLUNDER_CHANCE = 0.6; // even its "best" pick is usually swapped for a weaker one
  const DEPTH = 1; // barely looks ahead — won't spot multi-move traps

  // 1. Take an immediate win if available (most of the time).
  if (Math.random() < TAKE_WIN_CHANCE) {
    for (const col of valid) {
      const dropped = dropPiece(board, col, botPlayer);
      if (dropped && checkWinner(dropped.board)?.winner === botPlayer) return col;
    }
  }
  // 2. Block an immediate human win (not guaranteed).
  if (Math.random() < BLOCK_CHANCE) {
    for (const col of valid) {
      const dropped = dropPiece(board, col, humanPlayer);
      if (dropped && checkWinner(dropped.board)?.winner === humanPlayer) return col;
    }
  }

  const { col } = minimax(board, DEPTH, -Infinity, Infinity, true, botPlayer, humanPlayer);
  if (col !== null && valid.includes(col)) {
    // Keep it easy to beat: frequently pick a weaker column instead of the "best" one.
    if (Math.random() < BLUNDER_CHANCE) {
      const alt = valid.filter((c) => c !== col);
      if (alt.length > 0) return alt[Math.floor(Math.random() * alt.length)];
    }
    return col;
  }
  return valid[Math.floor(Math.random() * valid.length)];
}
