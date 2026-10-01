import { motion } from "framer-motion";
import { SIZE, type Board as BoardType } from "@/lib/tictactoe";

function isWinningCell(winningLine: [number, number][] | null, r: number, c: number) {
  if (!winningLine) return false;
  return winningLine.some(([wr, wc]) => wr === r && wc === c);
}

export function TicTacToeBoard({
  board,
  onPlay,
  disabled,
  winningLine,
  activePlayer,
}: {
  board: BoardType;
  onPlay: (row: number, col: number) => void;
  disabled: boolean;
  winningLine: [number, number][] | null;
  /** 1 while it's the human's turn. */
  activePlayer: 1 | 2;
}) {
  return (
    // Mesma ideia do Connect4Board: sem borda/fundo próprios — renderiza dentro do
    // game-shell compartilhado de play.tsx, que já dá essa moldura pra qualquer jogo.
    <div className="mx-auto w-full max-w-xs">
      <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
        {Array.from({ length: SIZE }).map((_, r) =>
          Array.from({ length: SIZE }).map((__, c) => {
            const cell = board[r][c];
            const canPlay = !disabled && cell === 0 && activePlayer === 1;
            const win = isWinningCell(winningLine, r, c);
            return (
              <button
                key={`${r}-${c}`}
                type="button"
                disabled={!canPlay}
                onClick={() => onPlay(r, c)}
                aria-label={`Linha ${r + 1}, coluna ${c + 1}`}
                className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-[#050811] ring-1 transition ${
                  win ? "ring-2 ring-white/70" : "ring-white/10"
                } ${canPlay ? "cursor-pointer hover:bg-white/[0.04] hover:ring-white/25" : "cursor-default"}`}
              >
                {cell !== 0 && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 26 }}
                    className={`text-5xl font-extrabold sm:text-6xl ${
                      cell === 1 ? "text-[var(--neon-purple)]" : "text-[var(--neon-blue)]"
                    } ${win ? "drop-shadow-[0_0_18px_rgba(255,255,255,0.6)]" : ""}`}
                  >
                    {cell === 1 ? "X" : "O"}
                  </motion.span>
                )}
              </button>
            );
          }),
        )}
      </div>
    </div>
  );
}
