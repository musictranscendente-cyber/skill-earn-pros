import { motion } from "framer-motion";
import type { ComponentType } from "react";
import {
  Connect4Thumb,
  CheckersThumb,
  TicTacToeThumb,
  PingPongThumb,
  SudokuThumb,
  BattleshipThumb,
  DiceThumb,
} from "@/components/play/GameThumbs";
import {
  ChessPieceSilhouette,
  CardsSilhouette,
  ControllerSilhouette,
  DominoSilhouette,
} from "@/components/home/GameSilhouettes";

// Ambient "classic games" texture for the homepage — no external photos/video: keeps
// everything on-brand and avoids licensing risk (same reasoning as GameThumbs.tsx itself).
//
// Two flavors of piece: GameThumbs.tsx's small dark-boxed board previews (fine as subtle
// corner texture at modest size), and the plain single-color GameSilhouettes (chess piece,
// cards, dice, controller) that scale up cleanly and stay legible as real shapes even large
// and faint — those carry the "hero" variant, since a boxed board-preview icon blown up big
// just reads as a dark tile, not a shape.

type ThumbProps = { className?: string };
type Piece = {
  Thumb: ComponentType<ThumbProps>;
  top: string;
  left: string;
  size: number;
  rotate: number;
  delay: number;
  duration: number;
  /** Tint applied via a wrapping element's `color`, so it works for both the
   *  currentColor-based silhouettes and (harmlessly, as a no-op) the GameThumbs, which
   *  paint their own fixed colors. */
  color?: string;
};

const HERO_PIECES: Piece[] = [
  { Thumb: ChessPieceSilhouette, top: "4%", left: "2%", size: 150, rotate: -9, delay: 0, duration: 7.5, color: "#a78bfa" },
  { Thumb: CardsSilhouette, top: "56%", left: "4%", size: 130, rotate: 8, delay: 1, duration: 8, color: "#00B2FF" },
  { Thumb: ControllerSilhouette, top: "8%", left: "84%", size: 130, rotate: 10, delay: 0.6, duration: 7, color: "#8A2EFF" },
  { Thumb: DominoSilhouette, top: "68%", left: "84%", size: 110, rotate: -10, delay: 1.6, duration: 6.5, color: "#60d9ff" },
];

const SUBTLE_PIECES: Piece[] = [
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
  const opacity = variant === "hero" ? 0.26 : 0.09;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ top: p.top, left: p.left, width: p.size, height: p.size, opacity, color: p.color }}
          initial={{ rotate: p.rotate }}
          animate={{ y: [0, -14, 0], rotate: [p.rotate, p.rotate + 5, p.rotate] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          <p.Thumb
            className={`h-full w-full ${
              variant === "hero" ? "drop-shadow-[0_0_26px_rgba(138,46,255,0.45)]" : "drop-shadow-[0_0_18px_rgba(138,46,255,0.3)]"
            }`}
          />
        </motion.div>
      ))}
    </div>
  );
}
