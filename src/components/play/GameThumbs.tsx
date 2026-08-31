// Small hand-drawn (inline SVG) preview art for each game card on the
// "Jogar Demo" hub. No external image files — keeps things on-brand and
// avoids licensing/asset-loading concerns for placeholder "coming soon" games.

type ThumbProps = { className?: string };

export function Connect4Thumb({ className }: ThumbProps) {
  // 4-wide x 3-row board with a highlighted diagonal "connect four" line.
  const win = new Set(["0-0", "1-1", "2-2", "3-3"]);
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Lig-4">
      <rect x="2" y="2" width="60" height="60" rx="12" fill="#0b1020" stroke="rgba(255,255,255,0.12)" />
      {Array.from({ length: 4 }).map((_, col) =>
        Array.from({ length: 3 }).map((__, row) => {
          const key = `${col}-${row}`;
          const isWin = win.has(key);
          const cx = 12 + col * 13.5;
          const cy = 14 + row * 18;
          const fill = isWin
            ? col % 2 === 0
              ? "url(#c4-purple)"
              : "url(#c4-blue)"
            : "rgba(255,255,255,0.08)";
          return <circle key={key} cx={cx} cy={cy} r="5.2" fill={fill} />;
        }),
      )}
      <defs>
        <linearGradient id="c4-purple" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8A2EFF" />
          <stop offset="100%" stopColor="#e879f9" />
        </linearGradient>
        <linearGradient id="c4-blue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00B2FF" />
          <stop offset="100%" stopColor="#7dd3fc" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function CheckersThumb({ className }: ThumbProps) {
  const cells = 4;
  const size = 60 / cells;
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Damas">
      <rect x="2" y="2" width="60" height="60" rx="12" fill="#0b1020" stroke="rgba(255,255,255,0.12)" />
      {Array.from({ length: cells }).map((_, row) =>
        Array.from({ length: cells }).map((__, col) => {
          const dark = (row + col) % 2 === 1;
          if (!dark) return null;
          const x = 2 + col * size;
          const y = 2 + row * size;
          return <rect key={`${row}-${col}`} x={x} y={y} width={size} height={size} fill="rgba(255,255,255,0.06)" />;
        }),
      )}
      <circle cx={2 + size * 0.5} cy={2 + size * 1.5} r={size * 0.32} fill="#8A2EFF" />
      <circle cx={2 + size * 2.5} cy={2 + size * 1.5} r={size * 0.32} fill="#8A2EFF" />
      <circle cx={2 + size * 1.5} cy={2 + size * 2.5} r={size * 0.32} fill="#00B2FF" />
      <circle cx={2 + size * 3.5} cy={2 + size * 2.5} r={size * 0.32} fill="#00B2FF" />
    </svg>
  );
}

export function DominoThumb({ className }: ThumbProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Dominó">
      <rect x="2" y="2" width="60" height="60" rx="12" fill="#0b1020" stroke="rgba(255,255,255,0.12)" />
      <g transform="rotate(-18 32 32)">
        <rect x="10" y="20" width="44" height="20" rx="4" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.18)" />
        <line x1="32" y1="20" x2="32" y2="40" stroke="rgba(255,255,255,0.18)" />
        <circle cx="18" cy="26" r="2" fill="#8A2EFF" />
        <circle cx="18" cy="34" r="2" fill="#8A2EFF" />
        <circle cx="26" cy="30" r="2" fill="#8A2EFF" />
        <circle cx="40" cy="26" r="2" fill="#00B2FF" />
        <circle cx="46" cy="30" r="2" fill="#00B2FF" />
        <circle cx="40" cy="34" r="2" fill="#00B2FF" />
      </g>
    </svg>
  );
}

export function TicTacToeThumb({ className }: ThumbProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Jogo da Velha">
      <rect x="2" y="2" width="60" height="60" rx="12" fill="#0b1020" stroke="rgba(255,255,255,0.12)" />
      <g stroke="rgba(255,255,255,0.18)" strokeWidth="2">
        <line x1="23" y1="10" x2="23" y2="54" />
        <line x1="41" y1="10" x2="41" y2="54" />
        <line x1="10" y1="23" x2="54" y2="23" />
        <line x1="10" y1="41" x2="54" y2="41" />
      </g>
      <g stroke="#8A2EFF" strokeWidth="3" strokeLinecap="round">
        <line x1="14" y1="14" x2="20" y2="20" />
        <line x1="20" y1="14" x2="14" y2="20" />
      </g>
      <circle cx="32" cy="32" r="5.5" fill="none" stroke="#00B2FF" strokeWidth="3" />
      <g stroke="#8A2EFF" strokeWidth="3" strokeLinecap="round">
        <line x1="45" y1="45" x2="51" y2="51" />
        <line x1="51" y1="45" x2="45" y2="51" />
      </g>
    </svg>
  );
}

export function PoolThumb({ className }: ThumbProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Sinuca">
      <rect x="2" y="2" width="60" height="60" rx="12" fill="#0b1020" stroke="rgba(255,255,255,0.12)" />
      <circle cx="32" cy="32" r="22" fill="#0f3d2e" stroke="rgba(255,255,255,0.1)" />
      <circle cx="24" cy="28" r="6" fill="#f8fafc" />
      <circle cx="40" cy="38" r="6" fill="#facc15" stroke="#0f3d2e" strokeWidth="2" />
      <circle cx="40" cy="38" r="6" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.4" strokeDasharray="2 3" />
    </svg>
  );
}

export function ChessThumb({ className }: ThumbProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Xadrez">
      <rect x="2" y="2" width="60" height="60" rx="12" fill="#0b1020" stroke="rgba(255,255,255,0.12)" />
      <path
        d="M32 14c-3 0-5 2.4-5 5.2 0 1.6.8 3 2 3.9l-3.4 12.4h12.8L34.9 23c1.3-1 2.1-2.4 2.1-4C37 16.4 35 14 32 14z"
        fill="url(#chess-grad)"
      />
      <rect x="21" y="37" width="22" height="6" rx="1.5" fill="url(#chess-grad)" />
      <rect x="18" y="45" width="28" height="7" rx="1.8" fill="url(#chess-grad)" />
      <defs>
        <linearGradient id="chess-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8A2EFF" />
          <stop offset="100%" stopColor="#00B2FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function CardsThumb({ className }: ThumbProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Cartas">
      <rect x="2" y="2" width="60" height="60" rx="12" fill="#0b1020" stroke="rgba(255,255,255,0.12)" />
      <g transform="rotate(-10 26 34)">
        <rect x="14" y="18" width="24" height="32" rx="4" fill="#1a2340" stroke="rgba(255,255,255,0.18)" />
        <path d="M26 26l3 6h6l-5 4 2 6-6-4-6 4 2-6-5-4h6z" fill="#00B2FF" />
      </g>
      <g transform="rotate(12 40 34)">
        <rect x="26" y="18" width="24" height="32" rx="4" fill="#1a1030" stroke="rgba(255,255,255,0.18)" />
        <path d="M38 26l3 6h6l-5 4 2 6-6-4-6 4 2-6-5-4h6z" fill="#8A2EFF" />
      </g>
    </svg>
  );
}

export function DiceThumb({ className }: ThumbProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Dados">
      <rect x="2" y="2" width="60" height="60" rx="12" fill="#0b1020" stroke="rgba(255,255,255,0.12)" />
      <g transform="rotate(-8 24 30)">
        <rect x="10" y="16" width="26" height="26" rx="6" fill="#1a2340" stroke="#00B2FF" strokeWidth="1.4" />
        <circle cx="18" cy="24" r="2" fill="#7dd3fc" />
        <circle cx="28" cy="24" r="2" fill="#7dd3fc" />
        <circle cx="18" cy="34" r="2" fill="#7dd3fc" />
        <circle cx="28" cy="34" r="2" fill="#7dd3fc" />
      </g>
      <g transform="rotate(10 42 36)">
        <rect x="28" y="24" width="26" height="26" rx="6" fill="#1a1030" stroke="#8A2EFF" strokeWidth="1.4" />
        <circle cx="41" cy="37" r="2.4" fill="#e879f9" />
      </g>
    </svg>
  );
}

export function BattleshipThumb({ className }: ThumbProps) {
  const cells = 5;
  const size = 52 / cells;
  const ship = new Set(["1-1", "2-1", "3-1"]);
  const hit = "2-1";
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Batalha Naval">
      <rect x="2" y="2" width="60" height="60" rx="12" fill="#0b1020" stroke="rgba(255,255,255,0.12)" />
      {Array.from({ length: cells }).map((_, row) =>
        Array.from({ length: cells }).map((__, col) => {
          const key = `${col}-${row}`;
          const x = 6 + col * size;
          const y = 6 + row * size;
          return (
            <rect
              key={key}
              x={x}
              y={y}
              width={size - 1.4}
              height={size - 1.4}
              rx="1.5"
              fill={ship.has(key) ? "#00B2FF" : "rgba(255,255,255,0.07)"}
            />
          );
        }),
      )}
      {(() => {
        const [col, row] = hit.split("-").map(Number);
        const cx = 6 + col * size + size / 2;
        const cy = 6 + row * size + size / 2;
        return (
          <g stroke="#f87171" strokeWidth="2.4" strokeLinecap="round">
            <line x1={cx - 4} y1={cy - 4} x2={cx + 4} y2={cy + 4} />
            <line x1={cx + 4} y1={cy - 4} x2={cx - 4} y2={cy + 4} />
          </g>
        );
      })()}
    </svg>
  );
}

export function RacingThumb({ className }: ThumbProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Corrida">
      <rect x="2" y="2" width="60" height="60" rx="12" fill="#0b1020" stroke="rgba(255,255,255,0.12)" />
      <ellipse cx="32" cy="32" rx="24" ry="15" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="7" />
      <ellipse cx="32" cy="32" rx="24" ry="15" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="7" strokeDasharray="3 5" />
      <rect x="19" y="20.5" width="7" height="4" rx="1.5" fill="#8A2EFF" transform="rotate(-20 22.5 22.5)" />
      <rect x="30" y="38" width="8" height="4.5" rx="1.5" fill="#00B2FF" transform="rotate(14 34 40)" />
    </svg>
  );
}

export function QuizThumb({ className }: ThumbProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Quiz">
      <rect x="2" y="2" width="60" height="60" rx="12" fill="#0b1020" stroke="rgba(255,255,255,0.12)" />
      <path
        d="M18 16h28a6 6 0 016 6v12a6 6 0 01-6 6H30l-8 8v-8h-4a6 6 0 01-6-6V22a6 6 0 016-6z"
        fill="url(#quiz-grad)"
      />
      <text x="32" y="34" textAnchor="middle" fontSize="16" fontWeight="700" fill="#0b1020">
        ?
      </text>
      <defs>
        <linearGradient id="quiz-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00B2FF" />
          <stop offset="100%" stopColor="#8A2EFF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function MazeThumb({ className }: ThumbProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Labirinto">
      <rect x="2" y="2" width="60" height="60" rx="12" fill="#0b1020" stroke="rgba(255,255,255,0.12)" />
      <g stroke="rgba(255,255,255,0.16)" strokeWidth="3" fill="none" strokeLinecap="round">
        <path d="M10 10h44M10 10v14M22 10v22M34 10v14M46 10v34M10 24h12M22 32h12M10 38h12M34 24h12M10 54h44M22 46v8M34 32v22" />
      </g>
      <circle cx="10" cy="10" r="3" fill="#00B2FF" />
      <circle cx="54" cy="54" r="3" fill="#8A2EFF" />
    </svg>
  );
}

export function WheelThumb({ className }: ThumbProps) {
  const colors = ["#8A2EFF", "#00B2FF", "#A45BFF", "#5B8DEF", "#C28BFF", "#65DDFF"];
  const cx = 32;
  const cy = 34;
  const r = 20;
  const slices = colors.map((color, i) => {
    const a0 = (i / colors.length) * Math.PI * 2 - Math.PI / 2;
    const a1 = ((i + 1) / colors.length) * Math.PI * 2 - Math.PI / 2;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    return <path key={i} d={`M${cx},${cy} L${x0},${y0} A${r},${r} 0 0 1 ${x1},${y1} Z`} fill={color} />;
  });
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Roleta">
      <rect x="2" y="2" width="60" height="60" rx="12" fill="#0b1020" stroke="rgba(255,255,255,0.12)" />
      {slices}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r="3" fill="#0b1020" stroke="rgba(255,255,255,0.4)" />
      <path d={`M${cx - 4},10 L${cx + 4},10 L${cx},16 Z`} fill="#f8fafc" />
    </svg>
  );
}

export function SudokuThumb({ className }: ThumbProps) {
  const digits: Record<string, string> = { "0-0": "5", "1-2": "3", "2-1": "8", "3-3": "1" };
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Sudoku">
      <rect x="2" y="2" width="60" height="60" rx="12" fill="#0b1020" stroke="rgba(255,255,255,0.12)" />
      <g stroke="rgba(255,255,255,0.16)" strokeWidth="1.2">
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={`v${i}`} x1={10 + i * 11} y1="10" x2={10 + i * 11} y2="54" />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={`h${i}`} x1="10" y1={10 + i * 11} x2="54" y2={10 + i * 11} />
        ))}
      </g>
      <rect x="10" y="10" width="44" height="44" rx="2" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
      {Object.entries(digits).map(([key, val]) => {
        const [col, row] = key.split("-").map(Number);
        const x = 10 + col * 11 + 5.5;
        const y = 10 + row * 11 + 5.5;
        return (
          <text key={key} x={x} y={y + 3.5} textAnchor="middle" fontSize="8" fontWeight="700" fill="#00B2FF">
            {val}
          </text>
        );
      })}
    </svg>
  );
}

export function ArenaThumb({ className }: ThumbProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Arena PvP">
      <rect x="2" y="2" width="60" height="60" rx="12" fill="#0b1020" stroke="rgba(255,255,255,0.12)" />
      <circle cx="32" cy="32" r="21" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
      <g stroke="url(#arena-grad)" strokeWidth="4" strokeLinecap="round">
        <line x1="18" y1="18" x2="46" y2="46" />
        <line x1="46" y1="18" x2="18" y2="46" />
      </g>
      <circle cx="18" cy="18" r="3" fill="#00B2FF" />
      <circle cx="46" cy="18" r="3" fill="#8A2EFF" />
      <defs>
        <linearGradient id="arena-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8A2EFF" />
          <stop offset="100%" stopColor="#00B2FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function PingPongThumb({ className }: ThumbProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Tênis de Mesa">
      <rect x="2" y="2" width="60" height="60" rx="12" fill="#0b1020" stroke="rgba(255,255,255,0.12)" />
      <rect x="8" y="26" width="48" height="16" rx="2" fill="#0f3d2e" stroke="rgba(255,255,255,0.15)" />
      <line x1="32" y1="26" x2="32" y2="42" stroke="rgba(255,255,255,0.35)" strokeWidth="1.4" />
      <rect x="10" y="14" width="4" height="12" rx="2" fill="#8A2EFF" transform="rotate(20 12 20)" />
      <circle cx="14" cy="12" r="4.5" fill="#8A2EFF" />
      <rect x="50" y="38" width="4" height="12" rx="2" fill="#00B2FF" transform="rotate(-20 52 44)" />
      <circle cx="50" cy="50" r="4.5" fill="#00B2FF" />
      <circle cx="30" cy="20" r="2.4" fill="#f8fafc" />
    </svg>
  );
}

export function AirHockeyThumb({ className }: ThumbProps) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Hóquei de Mesa">
      <rect x="2" y="2" width="60" height="60" rx="12" fill="#0b1020" stroke="rgba(255,255,255,0.12)" />
      <rect x="8" y="8" width="48" height="48" rx="4" fill="#12183a" stroke="rgba(255,255,255,0.15)" />
      <line x1="8" y1="32" x2="56" y2="32" stroke="rgba(255,255,255,0.2)" strokeWidth="1.4" />
      <circle cx="32" cy="32" r="7" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.4" />
      <circle cx="32" cy="14" r="8" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.4" />
      <circle cx="32" cy="50" r="8" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.4" />
      <circle cx="32" cy="18" r="5" fill="#8A2EFF" />
      <circle cx="32" cy="46" r="5" fill="#00B2FF" />
      <circle cx="32" cy="30" r="2.6" fill="#f8fafc" />
    </svg>
  );
}
