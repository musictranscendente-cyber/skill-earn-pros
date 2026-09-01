import { motion } from "framer-motion";
import type { ComponentType } from "react";
import {
  Connect4Thumb,
  CheckersThumb,
  DominoThumb,
  TicTacToeThumb,
  ChessThumb,
  CardsThumb,
  DiceThumb,
  PingPongThumb,
  SudokuThumb,
  BattleshipThumb,
} from "@/components/play/GameThumbs";

// Ambient "classic games" texture for the homepage — reuses the same hand-drawn SVG
// thumbnails already built for the /play game hub (no external photos/video: keeps
// everything on-brand and avoids licensing risk, same reasoning as GameThumbs.tsx itself).
// Rendered small, slow-floating, and very low-opacity so it reads as texture, never as
// competing content.

type ThumbProps = { className?: string };
type Piece = {
  Thumb: ComponentType<ThumbProps>;
  top: string;
  left: string;
  size: number;
  rotate: number;
  delay: number;
  duration: number;
};

const HERO_PIECES: Piece[] = [
  { Thumb: ChessThumb, top: "6%", left: "3%", size: 58, rotate: -14, delay: 0, duration: 7 },
  { Thumb: DiceThumb, top: "68%", left: "8%", size: 44, rotate: 10, delay: 1.2, duration: 6 },
  { Thumb: CardsThumb, top: "14%", left: "89%", size: 60, rotate: 12, delay: 0.6, duration: 8 },
  { Thumb: Connect4Thumb, top: "74%", left: "88%", size: 50, rotate: -8, delay: 1.8, duration: 6.5 },
  { Thumb: TicTacToeThumb, top: "44%", left: "1%", size: 40, rotate: 6, delay: 2.4, duration: 7.5 },
  { Thumb: PingPongThumb, top: "50%", left: "95%", size: 42, rotate: -10, delay: 0.9, duration: 6.8 },
];

const SUBTLE_PIECES: Piece[] = [
  { Thumb: DominoThumb, top: "8%", left: "2%", size: 40, rotate: -10, delay: 0, duration: 7 },
  { Thumb: SudokuThumb, top: "78%", left: "93%", size: 44, rotate: 12, delay: 1, duration: 8 },
  { Thumb: CheckersThumb, top: "82%", left: "3%", size: 36, rotate: 8, delay: 2, duration: 6.5 },
];

const RIGHT_ONLY_PIECES: Piece[] = [
  { Thumb: BattleshipThumb, top: "10%", left: "90%", size: 46, rotate: -10, delay: 0.4, duration: 7.2 },
  { Thumb: DiceThumb, top: "78%", left: "94%", size: 38, rotate: 8, delay: 1.6, duration: 6.4 },
];

const VARIANTS = { hero: HERO_PIECES, subtle: SUBTLE_PIECES, right: RIGHT_ONLY_PIECES };

export function FloatingGameIcons({ variant = "subtle" }: { variant?: keyof typeof VARIANTS }) {
  const pieces = VARIANTS[variant];
  const opacity = variant === "hero" ? 0.16 : 0.09;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ top: p.top, left: p.left, width: p.size, height: p.size, opacity }}
          initial={{ rotate: p.rotate }}
          animate={{ y: [0, -14, 0], rotate: [p.rotate, p.rotate + 5, p.rotate] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <p.Thumb className="h-full w-full drop-shadow-[0_0_18px_rgba(138,46,255,0.3)]" />
        </motion.div>
      ))}
    </div>
  );
}
