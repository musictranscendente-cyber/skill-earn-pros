// Tiny dependency-free sound effects using the Web Audio API.
// No external audio files — everything is synthesized on the fly, so there's
// nothing to download and it works instantly offline.

let ctx: AudioContext | null = null;
let enabled = true;

const KEY = "pvp_sound_v1";

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    if (!ctx) ctx = new Ctor();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(
  freq: number,
  duration: number,
  opts: { type?: OscillatorType; gain?: number; delay?: number } = {},
) {
  if (!enabled) return;
  const c = getCtx();
  if (!c) return;
  const { type = "sine", gain = 0.15, delay = 0 } = opts;
  try {
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    const start = c.currentTime + delay;
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(gain, start + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(g).connect(c.destination);
    osc.start(start);
    osc.stop(start + duration + 0.03);
  } catch {
    // Ignore — sound is a nice-to-have, never block gameplay on it.
  }
}

export function isSoundEnabled(): boolean {
  return enabled;
}

export function initSoundPreference() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === "off") enabled = false;
  } catch {}
}

export function setSoundEnabled(v: boolean) {
  enabled = v;
  try {
    localStorage.setItem(KEY, v ? "on" : "off");
  } catch {}
}

function noiseBurst(duration: number, opts: { gain?: number; delay?: number; lowpass?: number } = {}) {
  if (!enabled) return;
  const c = getCtx();
  if (!c) return;
  const { gain = 0.22, delay = 0, lowpass = 1800 } = opts;
  try {
    const bufferSize = Math.max(1, Math.floor(c.sampleRate * duration));
    const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const src = c.createBufferSource();
    src.buffer = buffer;
    const filter = c.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = lowpass;
    const g = c.createGain();
    const start = c.currentTime + delay;
    g.gain.setValueAtTime(gain, start);
    g.gain.exponentialRampToValueAtTime(0.001, start + duration);
    src.connect(filter).connect(g).connect(c.destination);
    src.start(start);
    src.stop(start + duration + 0.02);
  } catch {
    // Ignore — sound is a nice-to-have, never block gameplay on it.
  }
}

export function playClick() {
  tone(520, 0.08, { type: "triangle", gain: 0.12 });
}

/**
 * A satisfying "clack + thud" for a piece landing on the board — plays for
 * EVERY piece dropped, yours and the bot's. `row` (0 = top, 5 = bottom) is
 * optional and just adds a subtle pitch variation for how far it fell.
 */
export function playDrop(row = 5) {
  const fallFactor = Math.max(0, Math.min(1, row / 5));
  // The percussive "clack" of the piece hitting the slot.
  noiseBurst(0.06, { gain: 0.3, lowpass: 2200 - fallFactor * 600 });
  // A low thud right after, giving it physical weight.
  tone(130 - fallFactor * 25, 0.12, { type: "sine", gain: 0.22, delay: 0.015 });
  tone(70 - fallFactor * 10, 0.16, { type: "sine", gain: 0.14, delay: 0.03 });
}

export function playFound() {
  tone(660, 0.12, { type: "sine", gain: 0.14 });
  tone(880, 0.18, { type: "sine", gain: 0.14, delay: 0.1 });
}

export function playWin() {
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, 0.24, { type: "triangle", gain: 0.17, delay: i * 0.09 }));
}

/**
 * A quick, triumphant rising run that resolves into a bright, held chord —
 * still one single musical gesture (all tones, no clunk/noise layers), just
 * energized so a win actually feels like a win.
 */
export function playMoney() {
  const run = [784, 988, 1175, 1568];
  run.forEach((f, i) => tone(f, 0.13, { type: "triangle", gain: 0.2, delay: i * 0.065 }));
  const chordStart = run.length * 0.065;
  tone(2093, 0.45, { type: "sine", gain: 0.24, delay: chordStart });
  tone(2637, 0.4, { type: "sine", gain: 0.16, delay: chordStart + 0.02 });
}

export function playLose() {
  [300, 220, 160].forEach((f, i) => tone(f, 0.3, { type: "sawtooth", gain: 0.11, delay: i * 0.13 }));
}

export function playDraw() {
  [420, 420].forEach((f, i) => tone(f, 0.16, { type: "square", gain: 0.1, delay: i * 0.18 }));
}
