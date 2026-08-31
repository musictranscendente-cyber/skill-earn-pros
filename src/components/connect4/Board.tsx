import { useState } from "react";
import { motion } from "framer-motion";
import { COLS, ROWS, type Board as BoardType } from "@/lib/connect4";

function isWinningCell(winningLine: [number, number][] | null, r: number, c: number) {
  if (!winningLine) return false;
  return winningLine.some(([wr, wc]) => wr === r && wc === c);
}

export function Connect4Board({
  board,
  onDrop,
  disabled,
  winningLine,
  activePlayer,
}: {
  board: BoardType;
  onDrop: (col: number) => void;
  disabled: boolean;
  winningLine: [number, number][] | null;
  /** 1 while it's the human's turn — used for the hover/ghost preview. */
  activePlayer: 1 | 2;
}) {
  const [hoverCol, setHoverCol] = useState<number | null>(null);

  return (
    <div className="glass neon-border mx-auto w-full max-w-xl rounded-3xl p-3 md:p-4">
      <div
        className="grid gap-1.5 md:gap-2"
        style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: COLS }).map((_, c) => {
          const isFull = board[0][c] !== 0;
          const canPlay = !disabled && !isFull && activePlayer === 1;
          return (
            <button
              key={c}
              type="button"
              disabled={!canPlay}
              onClick={() => onDrop(c)}
              onMouseEnter={() => setHoverCol(c)}
              onMouseLeave={() => setHoverCol((v) => (v === c ? null : v))}
              aria-label={`Coluna ${c + 1}`}
              className={`flex flex-col gap-1.5 rounded-xl p-1 transition md:gap-2 ${
                canPlay ? "cursor-pointer hover:bg-white/[0.04]" : "cursor-default"
              }`}
            >
              {Array.from({ length: ROWS }).map((__, r) => {
                const cell = board[r][c];
                const showGhost = canPlay && hoverCol === c && cell === 0 && isTopEmptyOfColumn(board, c, r);
                const win = isWinningCell(winningLine, r, c);
                return (
                  <div
                    key={r}
                    className="relative aspect-square w-full overflow-hidden rounded-full bg-[#050811] ring-1 ring-white/10"
                  >
                    {cell !== 0 && (
                      <motion.div
                        initial={{ y: "-140%", opacity: 0.4 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 28 }}
                        className={`absolute inset-0.5 rounded-full ${
                          cell === 1
                            ? "bg-gradient-to-br from-[var(--neon-purple)] to-fuchsia-500"
                            : "bg-gradient-to-br from-[var(--neon-blue)] to-sky-300"
                        } ${win ? "shadow-[0_0_18px_4px_rgba(255,255,255,0.55)] ring-2 ring-white/80" : "shadow-[0_0_10px_rgba(0,0,0,0.4)]"}`}
                      />
                    )}
                    {showGhost && (
                      <div className="absolute inset-0.5 rounded-full bg-[var(--neon-purple)]/25 ring-1 ring-[var(--neon-purple)]/50" />
                    )}
                  </div>
                );
              })}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** True when `r` is the row a new piece would land on for this column (topmost empty cell). */
function isTopEmptyOfColumn(board: BoardType, col: number, r: number) {
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row][col] === 0) return row === r;
  }
  return false;
}
