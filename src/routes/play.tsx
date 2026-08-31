import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/Layout";
import { GridBackground } from "@/components/Background";
import { Connect4Board } from "@/components/connect4/Board";
import {
  createEmptyBoard,
  dropPiece,
  checkWinner,
  isBoardFull,
  getBotMove,
  type Board as BoardType,
} from "@/lib/connect4";
import { useLang } from "@/lib/i18n";
import {
  playClick,
  playDrop,
  playFound,
  playMoney,
  playLose,
  playDraw,
  initSoundPreference,
  isSoundEnabled,
  setSoundEnabled,
} from "@/lib/sound";
import { Gamepad2, Search, Swords, Trophy, RotateCcw, Flame, Volume2, VolumeX, ChevronLeft, Lock } from "lucide-react";
import {
  Connect4Thumb,
  CheckersThumb,
  DominoThumb,
  TicTacToeThumb,
  PoolThumb,
  ChessThumb,
  CardsThumb,
  BattleshipThumb,
  RacingThumb,
  QuizThumb,
  MazeThumb,
  SudokuThumb,
  ArenaThumb,
  PingPongThumb,
  AirHockeyThumb,
} from "@/components/play/GameThumbs";

export const Route = createFileRoute("/play")({
  head: () => ({
    meta: [
      { title: "Play Demo — PvP Pro" },
      { name: "description", content: "Free open demo — feel what a PvP Pro duel is like before launch. Simulated match, real gameplay: Connect 4 against a bot opponent." },
      { property: "og:url", content: "/play" },
    ],
    links: [{ rel: "canonical", href: "/play" }],
  }),
  component: PlayPage,
});

const STAKES = [1, 5, 20, 100];
const OPPONENTS = [
  { name: "ShadowByte", emoji: "🥷" },
  { name: "NeonRider", emoji: "🐉" },
  { name: "QuantumAce", emoji: "🦾" },
  { name: "VortexPlay", emoji: "👾" },
  { name: "CipherKid", emoji: "🎮" },
  { name: "DriftKing", emoji: "🦊" },
  { name: "PixelWolf", emoji: "🔥" },
  { name: "EchoStrike", emoji: "⚡️" },
];
const CONFETTI_COLORS = ["#8A2EFF", "#00B2FF", "#facc15", "#34d399", "#f472b6"];

const GAMES = [
  { id: "connect4", Thumb: Connect4Thumb, titleKey: "play.games.connect4" as const, available: true },
  { id: "checkers", Thumb: CheckersThumb, titleKey: "play.games.checkers" as const, available: false },
  { id: "domino", Thumb: DominoThumb, titleKey: "play.games.domino" as const, available: false },
  { id: "tictactoe", Thumb: TicTacToeThumb, titleKey: "play.games.tictactoe" as const, available: false },
  { id: "pool", Thumb: PoolThumb, titleKey: "play.games.pool" as const, available: false },
  { id: "chess", Thumb: ChessThumb, titleKey: "play.games.chess" as const, available: false },
  { id: "truco", Thumb: CardsThumb, titleKey: "play.games.truco" as const, available: false },
  { id: "battleship", Thumb: BattleshipThumb, titleKey: "play.games.battleship" as const, available: false },
  { id: "racing", Thumb: RacingThumb, titleKey: "play.games.racing" as const, available: false },
  { id: "quiz", Thumb: QuizThumb, titleKey: "play.games.quiz" as const, available: false },
  { id: "maze", Thumb: MazeThumb, titleKey: "play.games.maze" as const, available: false },
  { id: "arena", Thumb: ArenaThumb, titleKey: "play.games.arena" as const, available: false },
  { id: "sudoku", Thumb: SudokuThumb, titleKey: "play.games.sudoku" as const, available: false },
  { id: "pingpong", Thumb: PingPongThumb, titleKey: "play.games.pingpong" as const, available: false },
  { id: "airhockey", Thumb: AirHockeyThumb, titleKey: "play.games.airhockey" as const, available: false },
];

type Stage = "select" | "intro" | "searching" | "found" | "playing" | "result";
type ResultType = "win" | "lose" | "draw" | null;

function PlayPage() {
  const { t } = useLang();
  const [stage, setStage] = useState<Stage>("select");
  const [stake, setStake] = useState(5);
  const [board, setBoard] = useState<BoardType>(() => createEmptyBoard());
  const [turn, setTurn] = useState<1 | 2>(1);
  const [winLine, setWinLine] = useState<[number, number][] | null>(null);
  const [resultType, setResultType] = useState<ResultType>(null);
  const [opponent, setOpponent] = useState(OPPONENTS[0]);
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => {
    initSoundPreference();
    setSoundOn(isSoundEnabled());
  }, []);

  function toggleSound() {
    const next = !soundOn;
    setSoundEnabled(next);
    setSoundOn(next);
    if (next) playClick();
  }

  function beginSearch() {
    playClick();
    setOpponent(OPPONENTS[Math.floor(Math.random() * OPPONENTS.length)]);
    setBoard(createEmptyBoard());
    setWinLine(null);
    setResultType(null);
    setTurn(1);
    setStage("searching");
  }

  useEffect(() => {
    if (stage !== "searching") return;
    const id = setTimeout(() => {
      playFound();
      setStage("found");
    }, 1600);
    return () => clearTimeout(id);
  }, [stage]);

  function startMatch() {
    playClick();
    setBoard(createEmptyBoard());
    setWinLine(null);
    setResultType(null);
    setTurn(1);
    setStage("playing");
  }

  function handleDrop(col: number) {
    if (stage !== "playing" || turn !== 1) return;
    const dropped = dropPiece(board, col, 1);
    if (!dropped) return;
    playDrop(dropped.row);
    setBoard(dropped.board);
    const win = checkWinner(dropped.board);
    if (win) {
      setWinLine(win.line);
      setResultType(win.winner === 1 ? "win" : "lose");
      setStage("result");
      return;
    }
    if (isBoardFull(dropped.board)) {
      setResultType("draw");
      setStage("result");
      return;
    }
    setTurn(2);
  }

  useEffect(() => {
    if (stage !== "playing" || turn !== 2) return;
    const id = setTimeout(() => {
      const col = getBotMove(board, 2, 1);
      if (col < 0) return;
      const dropped = dropPiece(board, col, 2);
      if (!dropped) return;
      playDrop(dropped.row);
      setBoard(dropped.board);
      const win = checkWinner(dropped.board);
      if (win) {
        setWinLine(win.line);
        setResultType(win.winner === 1 ? "win" : "lose");
        setStage("result");
        return;
      }
      if (isBoardFull(dropped.board)) {
        setResultType("draw");
        setStage("result");
        return;
      }
      setTurn(1);
    }, 750);
    return () => clearTimeout(id);
  }, [stage, turn, board]);

  useEffect(() => {
    if (stage !== "result") return;
    if (resultType === "win") playMoney();
    else if (resultType === "lose") playLose();
    else if (resultType === "draw") playDraw();
  }, [stage, resultType]);

  const resultCopy = useMemo(() => {
    if (resultType === "win") return { big: t("play.result.win.big"), title: t("play.result.win.title"), sub: t("play.result.win.sub") };
    if (resultType === "lose") return { big: t("play.result.lose.big"), title: t("play.result.lose.title"), sub: t("play.result.lose.sub") };
    if (resultType === "draw") return { big: t("play.result.draw.big"), title: t("play.result.draw.title"), sub: t("play.result.draw.sub") };
    return { big: "", title: "", sub: "" };
  }, [resultType, t]);

  const resultColor = resultType === "win" ? "emerald" : resultType === "lose" ? "rose" : "yellow";
  const winnings = stake * 0.9;

  return (
    <Layout>
      <section className="relative overflow-hidden pt-12 pb-24">
        <GridBackground />

        {/* Full-bleed outcome flash */}
        <AnimatePresence>
          {stage === "result" && (
            <motion.div
              key="flash"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 1.1, times: [0, 0.25, 1] }}
              className={`pointer-events-none absolute inset-0 ${
                resultColor === "emerald"
                  ? "bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,rgba(52,211,153,0.35),transparent)]"
                  : resultColor === "rose"
                    ? "bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,rgba(244,63,94,0.3),transparent)]"
                    : "bg-[radial-gradient(ellipse_60%_50%_at_50%_30%,rgba(250,204,21,0.3),transparent)]"
              }`}
            />
          )}
        </AnimatePresence>

        {stage === "result" && resultType === "win" && <Confetti />}

        <div className="relative mx-auto max-w-4xl px-6">
          <div className="mb-10 text-center">
            <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
              {stage !== "select" && (
                <button
                  onClick={() => {
                    playClick();
                    setStage("select");
                  }}
                  className="glass flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-xs text-white/60 transition hover:text-white"
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> {t("play.back.games")}
                </button>
              )}
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/60">
                <Gamepad2 className="h-3 w-3 text-[var(--neon-purple)]" /> {t("play.badge")}
              </div>
              <button
                onClick={toggleSound}
                aria-label={soundOn ? t("play.sound.on") : t("play.sound.off")}
                title={soundOn ? t("play.sound.on") : t("play.sound.off")}
                className="glass flex h-7 w-7 items-center justify-center rounded-full text-white/60 transition hover:text-white"
              >
                {soundOn ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
              </button>
            </div>
            <h1 className="text-balance text-4xl font-extrabold tracking-tight md:text-6xl">
              <span className="text-silver">{t("play.title1")}</span> <span className="text-gradient">{t("play.title2")}</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-white/60">{t("play.subtitle")}</p>
          </div>

          <AnimatePresence mode="wait">
            {stage === "select" && (
              <motion.div
                key="select"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="mx-auto max-w-3xl"
              >
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                  {GAMES.map((g, i) => (
                    <motion.button
                      key={g.id}
                      type="button"
                      disabled={!g.available}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      onClick={() => {
                        if (!g.available) return;
                        playClick();
                        setStage("intro");
                      }}
                      className={`glass relative flex flex-col items-center gap-2 overflow-hidden rounded-2xl p-4 text-center transition sm:p-5 ${
                        g.available
                          ? "neon-border cursor-pointer hover:-translate-y-1 hover:border-[var(--neon-purple)]/70 hover:shadow-[0_0_24px_rgba(138,46,255,0.3)]"
                          : "cursor-not-allowed"
                      }`}
                    >
                      {!g.available && (
                        <>
                          {/* Darkens the colorful thumb underneath instead of graying it out. */}
                          <span aria-hidden className="pointer-events-none absolute inset-0 z-10 bg-[#050811]/55" />
                          <span className="absolute right-2 top-2 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-black/50">
                            <Lock className="h-3.5 w-3.5 text-white/60" />
                          </span>
                        </>
                      )}
                      <g.Thumb className="h-20 w-20 sm:h-24 sm:w-24" />
                      <span className="text-sm font-semibold text-white">{t(g.titleKey)}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${
                          g.available
                            ? "bg-emerald-400/15 text-emerald-400 ring-1 ring-emerald-400/30"
                            : "border border-white/10 bg-white/[0.03] text-white/40"
                        }`}
                      >
                        {g.available ? t("play.games.available") : t("play.games.soon")}
                      </span>
                    </motion.button>
                  ))}
                </div>
                <p className="mt-6 text-center text-xs text-white/40">{t("play.games.soon.title")}</p>
              </motion.div>
            )}

            {stage === "intro" && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="glass neon-border mx-auto max-w-lg rounded-3xl p-6 text-center md:p-8"
              >
                <div className="mb-2 text-xs uppercase tracking-widest text-white/50">{t("play.stake.label")}</div>
                <div className="flex flex-wrap justify-center gap-2">
                  {STAKES.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setStake(s);
                        playClick();
                      }}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        stake === s
                          ? "border-[var(--neon-purple)] bg-[var(--neon-purple)]/15 text-white"
                          : "border-white/10 bg-white/[0.03] text-white/70 hover:text-white"
                      }`}
                    >
                      ${s}
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-xs text-white/40">{t("play.stake.note")}</p>
                <button onClick={beginSearch} className="btn-neon btn-neon-hover mt-6 w-full">
                  <Search className="h-4 w-4" /> {t("play.find.cta")}
                </button>
              </motion.div>
            )}

            {stage === "searching" && (
              <motion.div
                key="searching"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="glass neon-border mx-auto max-w-lg rounded-3xl p-10 text-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--neon-purple)]/15 ring-1 ring-[var(--neon-purple)]/40"
                >
                  <Search className="h-6 w-6 text-[var(--neon-purple)]" />
                </motion.div>
                <h2 className="mt-5 text-xl font-semibold">{t("play.searching.title")}</h2>
                <p className="mt-1 text-sm text-white/50">{t("play.searching.sub")}</p>
              </motion.div>
            )}

            {stage === "found" && (
              <motion.div
                key="found"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="glass neon-border mx-auto max-w-lg rounded-3xl p-8 text-center"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[var(--neon-purple)]/25 to-[var(--neon-blue)]/15 text-3xl ring-1 ring-white/10">
                  {opponent.emoji}
                </div>
                <h2 className="mt-4 text-xl font-semibold">{t("play.found.title")}</h2>
                <div className="mt-1 text-lg text-gradient font-bold">{opponent.name}</div>
                <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] uppercase tracking-widest text-white/50">
                  {t("play.found.tag")}
                </div>
                <button onClick={startMatch} className="btn-neon btn-neon-hover mt-6 w-full">
                  <Swords className="h-4 w-4" /> {t("play.start.cta")}
                </button>
              </motion.div>
            )}

            {(stage === "playing" || stage === "result") && (
              <motion.div
                key="playing"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
              >
                <div className="mx-auto mb-5 flex max-w-xl items-center justify-between">
                  <PlayerChip
                    label={t("play.you")}
                    colorLabel={t("play.color.you")}
                    emoji="🧑‍🚀"
                    active={turn === 1 && stage === "playing"}
                    color="purple"
                  />
                  <div className="text-xs uppercase tracking-widest text-white/40">
                    {stage === "playing" ? (turn === 1 ? t("play.turn.you") : t("play.turn.bot")) : " "}
                  </div>
                  <PlayerChip
                    label={opponent.name}
                    colorLabel={t("play.color.bot")}
                    emoji={opponent.emoji}
                    active={turn === 2 && stage === "playing"}
                    color="blue"
                    reverse
                  />
                </div>

                <Connect4Board
                  board={board}
                  onDrop={handleDrop}
                  disabled={stage !== "playing"}
                  winningLine={winLine}
                  activePlayer={turn}
                />

                <AnimatePresence>
                  {stage === "result" && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ type: "spring", stiffness: 340, damping: 22 }}
                      className={`glass mx-auto mt-6 max-w-lg rounded-3xl border-2 p-8 text-center ${
                        resultColor === "emerald"
                          ? "border-emerald-400/50 shadow-[0_0_40px_rgba(52,211,153,0.25)]"
                          : resultColor === "rose"
                            ? "border-rose-400/50 shadow-[0_0_40px_rgba(244,63,94,0.2)]"
                            : "border-yellow-400/50 shadow-[0_0_40px_rgba(250,204,21,0.2)]"
                      }`}
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 14, delay: 0.1 }}
                        className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ring-1 ${
                          resultColor === "emerald"
                            ? "bg-emerald-400/15 ring-emerald-400/40"
                            : resultColor === "rose"
                              ? "bg-rose-400/15 ring-rose-400/40"
                              : "bg-yellow-400/10 ring-yellow-400/30"
                        }`}
                      >
                        <Trophy
                          className={`h-7 w-7 ${
                            resultColor === "emerald" ? "text-emerald-400" : resultColor === "rose" ? "text-rose-400" : "text-yellow-300"
                          }`}
                        />
                      </motion.div>
                      <h2
                        className={`mt-4 text-3xl font-extrabold tracking-tight md:text-4xl ${
                          resultColor === "emerald" ? "text-emerald-400" : resultColor === "rose" ? "text-rose-400" : "text-yellow-300"
                        }`}
                      >
                        {resultCopy.big}
                      </h2>
                      <p className="mt-1 text-sm text-white/60">{resultCopy.sub}</p>
                      {resultType === "win" && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.7 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: "spring", stiffness: 320, damping: 16, delay: 0.2 }}
                          className="mt-5"
                        >
                          <div className="text-xs uppercase tracking-widest text-white/40">{t("play.reward.label")}</div>
                          <div className="mt-1 text-5xl font-extrabold text-emerald-400 drop-shadow-[0_0_28px_rgba(52,211,153,0.55)] md:text-6xl">
                            +${winnings.toFixed(2)}
                          </div>
                          <p className="mt-2 text-[11px] text-white/40">{t("play.reward.demo.note")}</p>
                        </motion.div>
                      )}
                      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                        <button onClick={beginSearch} className="btn-ghost btn-ghost-hover flex-1 text-sm">
                          <RotateCcw className="h-4 w-4" /> {t("play.again.cta")}
                        </button>
                        <Link to="/genesis" className="btn-neon btn-neon-hover flex-1 text-sm">
                          <Flame className="h-4 w-4" /> {t("play.genesis.cta")}
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {stage !== "result" && (
            <p className="mx-auto mt-8 max-w-lg text-center text-xs text-white/40">{t("play.demo.note")}</p>
          )}
        </div>
      </section>
    </Layout>
  );
}

function PlayerChip({
  label,
  colorLabel,
  emoji,
  active,
  color,
  reverse,
}: {
  label: string;
  colorLabel: string;
  emoji: string;
  active: boolean;
  color: "purple" | "blue";
  reverse?: boolean;
}) {
  const ring = color === "purple" ? "ring-[var(--neon-purple)]/60" : "ring-[var(--neon-blue)]/60";
  const glow = color === "purple" ? "shadow-[0_0_16px_rgba(138,46,255,0.45)]" : "shadow-[0_0_16px_rgba(0,178,255,0.45)]";
  const dot = color === "purple" ? "bg-gradient-to-br from-[var(--neon-purple)] to-fuchsia-500" : "bg-gradient-to-br from-[var(--neon-blue)] to-sky-300";
  return (
    <div className={`flex items-center gap-2 ${reverse ? "flex-row-reverse text-right" : ""}`}>
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.04] text-lg ring-1 transition ${
          active ? `${ring} ${glow}` : "ring-white/10"
        }`}
      >
        {emoji}
      </div>
      <div className={`flex flex-col ${reverse ? "items-end" : "items-start"}`}>
        <span className={`max-w-[8rem] truncate text-sm font-medium ${active ? "text-white" : "text-white/50"}`}>{label}</span>
        <span className={`flex items-center gap-1 text-[10px] uppercase tracking-wide text-white/40 ${reverse ? "flex-row-reverse" : ""}`}>
          <span className={`h-2 w-2 shrink-0 rounded-full ${dot}`} />
          {colorLabel}
        </span>
      </div>
    </div>
  );
}

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        rotate: Math.random() * 360,
        delay: Math.random() * 0.4,
        duration: 1.6 + Math.random() * 0.8,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        size: 6 + Math.random() * 6,
      })),
    [],
  );
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: "70vh", opacity: 0, rotate: p.rotate }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
          className="absolute top-0 block rounded-sm"
          style={{ width: p.size, height: p.size * 1.6, backgroundColor: p.color }}
        />
      ))}
    </div>
  );
}
