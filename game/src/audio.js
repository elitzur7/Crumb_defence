// Procedural SFX and three gentle music loops. No samples, no network.
let ac = null, master = null, sfxBus = null, musicBus = null, lp = null, comp = null;
let muted = false, last = {}, speedK = 1;
let sfxGain = 1, musicGain = 0.35;
const voices = [];
let marbleAt = 0, marbleOn = 0;
const log = { accepted: 0, dropped: 0, peak: 0 };
let mode = 'off', holdUntil = 0, queenWas = false;
let musicTimer = null, barUntil = 0, fading = null;

export function initAudio() {
  if (ac) return;
  try {
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    ac = new AC();
    master = ac.createGain(); master.gain.value = 0.25;
    comp = ac.createDynamicsCompressor();
    comp.threshold.value = -12; comp.knee.value = 12; comp.ratio.value = 2.5; comp.attack.value = 0.01; comp.release.value = 0.2;
    lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2500;
    sfxBus = ac.createGain(); sfxBus.gain.value = sfxGain;
    musicBus = ac.createGain(); musicBus.gain.value = musicGain;
    sfxBus.connect(lp); musicBus.connect(lp); lp.connect(comp); comp.connect(master); master.connect(ac.destination);
  } catch (e) { ac = null; }
}
export function setMuted(m) {
  muted = m;
  if (master && ac) master.gain.setValueAtTime(m ? 0 : 0.25, ac.currentTime);
}
export function isMuted() { return muted; }
export function setAudioSpeed(k) { speedK = k; }
export function setSfxGain(v) { sfxGain = Math.max(0, Math.min(1, v)); if (sfxBus) sfxBus.gain.setTargetAtTime(sfxGain, ac.currentTime, 0.03); }
export function setMusicGain(v) { musicGain = Math.max(0, Math.min(1, v)); if (musicBus && ac) musicBus.gain.setTargetAtTime(musicGain * (fading ? 0.63 : 1), ac.currentTime, 0.05); }
export function audioReport() { return { ...log, voices: voices.length, mode, marbleOn }; }

function gcVoices(now) {
  for (let i = voices.length - 1; i >= 0; i--) if (voices[i] <= now) voices.splice(i, 1);
  log.peak = Math.max(log.peak, voices.length);
}
function takeVoice(dur, cat) {
  if (!ac) return false;
  const now = ac.currentTime;
  gcVoices(now);
  if (voices.length >= 12) { log.dropped++; return false; }
  if (cat === 'music' && voices.length >= 10) { log.dropped++; return false; }
  voices.push(now + dur + 0.05); log.accepted++; return true;
}
function tone(freq, dur, type = 'sine', vol = 0.2, slide = 0, delay = 0, cat = 'combat') {
  if (!ac || muted || !takeVoice(dur + delay, cat)) return;
  const t = ac.currentTime + delay;
  const o = ac.createOscillator(), g = ac.createGain();
  o.type = type; o.frequency.setValueAtTime(Math.max(40, freq), t);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq * slide), t + dur);
  const atk = Math.max(0.005, 0.01);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + atk);
  g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(atk + 0.02, dur));
  o.connect(g); g.connect(cat === 'music' ? musicBus : sfxBus);
  o.start(t); o.stop(t + dur + 0.03);
}
const noiseBuf = {};
function cachedNoise(dur, hp) {
  const key = dur + ':' + hp;
  if (noiseBuf[key]) return noiseBuf[key];
  const rate = ac.sampleRate, len = Math.max(1, Math.floor(rate * dur));
  const buf = ac.createBuffer(1, len, rate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) {
    const env = Math.min(1, i / (rate * 0.005)) * (1 - i / len);
    d[i] = (Math.random() * 2 - 1) * env;
  }
  noiseBuf[key] = buf; return buf;
}
function noise(dur, vol = 0.1, hp = 800, cat = 'combat') {
  if (!ac || muted || !takeVoice(dur, cat)) return;
  const s = ac.createBufferSource(); s.buffer = cachedNoise(dur, hp);
  const f = ac.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = hp;
  const g = ac.createGain();
  const t = ac.currentTime;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f); f.connect(g); g.connect(sfxBus); s.start(t); s.stop(t + dur + 0.02);
}
function marble() {
  if (!ac || muted) return;
  const now = performance.now();
  if (now - marbleAt < 40) { log.dropped++; return; }
  gcVoices(ac.currentTime);
  if (marbleOn >= 3 || voices.length >= 12) { log.dropped++; return; }
  marbleAt = now; marbleOn++;
  const jitter = 1 + (Math.random() - 0.5) * 0.04;
  tone(440 * jitter, 0.09, Math.random() < 0.5 ? 'sine' : 'triangle', 0.16 * (1 + (Math.random() - 0.5) * 0.2), 0, 0, 'combat');
  setTimeout(() => { marbleOn = Math.max(0, marbleOn - 1); }, 100);
}

const FAST_THROTTLED = new Set(['laser', 'zap', 'pop', 'pulse']);
export const throttleMs = (name, speed) => (name === 'coinTick' ? (speed >= 4 ? 120 : 100) : speed >= 4 && FAST_THROTTLED.has(name) ? 120 : 60);
export function sfx(name) {
  if (!ac || muted) return;
  const now = performance.now();
  if (name !== 'marble' && last[name] && now - last[name] < throttleMs(name, speedK)) return;
  if (name !== 'marble') last[name] = now;
  switch (name) {
    case 'marble': marble(); break;
    case 'pop': tone(520 + Math.random() * 200, 0.12, 'sine', 0.22); break;
    case 'place': tone(392, 0.09, 'triangle', 0.28, 0, 0, 'ui'); tone(587, 0.12, 'triangle', 0.22, 0, 0.07, 'ui'); break;
    case 'upgrade': tone(523, 0.1, 'triangle', 0.28, 0, 0, 'ui'); tone(659, 0.1, 'triangle', 0.26, 0, 0.08, 'ui'); tone(784, 0.16, 'triangle', 0.24, 0, 0.16, 'ui'); break;
    case 'zap': tone(880, 0.08, 'triangle', 0.12, 0.6); break;
    case 'laser': tone(880, 0.08, 'sine', 0.08); break;
    case 'pulse': tone(220, 0.22, 'sine', 0.28, 0.6); break;
    case 'boom': noise(0.5, 0.28, 120); tone(90, 0.4, 'sine', 0.3, 0.4); break;
    case 'swat': tone(330 + Math.random() * 40, 0.09, 'sine', 0.22, 0.55); noise(0.05, 0.06, 800); break;
    case 'steal': tone(300, 0.15, 'triangle', 0.1, 0.6); break;
    case 'return': tone(660, 0.12, 'triangle', 0.22, 1.5, 0, 'ui'); break;
    case 'wave': tone(440, 0.12, 'triangle', 0.22, 0, 0, 'ui'); tone(440, 0.12, 'triangle', 0.18, 0, 0.16, 'ui'); break;
    case 'win': [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.22, 'triangle', 0.26, 0, i * 0.12, 'ui')); break;
    case 'lose': [392, 330, 262].forEach((f, i) => tone(f, 0.3, 'triangle', 0.24, 0, i * 0.2, 'ui')); break;
    case 'shield': tone(988, 0.05, 'triangle', 0.12); tone(988, 0.09, 'triangle', 0.1, 0, 0.04); tone(659, 0.12, 'sine', 0.1, 0, 0.09); break;
    case 'shieldUp': tone(659, 0.08, 'sine', 0.1); tone(988, 0.1, 'sine', 0.08, 0, 0.07); break;
    case 'coinTick': tone(660, 0.08, 'sine', 0.12, 0, 0, 'ui'); break;
    case 'starC': tone(523, 0.12, 'triangle', 0.22, 0, 0, 'ui'); break;
    case 'starE': tone(659, 0.12, 'triangle', 0.22, 0, 0, 'ui'); break;
    case 'starG': tone(784, 0.14, 'triangle', 0.24, 0, 0, 'ui'); break;
    case 'perfect': [784, 988, 1175, 1046].forEach((f, i) => tone(f, 0.16, 'triangle', 0.2, 0, i * 0.07, 'ui')); break;
    case 'boss': tone(98, 0.5, 'sine', 0.12, 0.7); tone(147, 0.4, 'triangle', 0.14, 0.8, 0.12); break;
    case 'heal': tone(880, 0.1, 'sine', 0.14); tone(1175, 0.14, 'sine', 0.12, 0, 0.08); break;
    case 'tap': tone(700, 0.08, 'sine', 0.16, 0, 0, 'ui'); break;
    case 'freeze': tone(988, 0.4, 'sine', 0.12, 0.5); break;
    case 'plane': tone(140, 1.2, 'triangle', 0.06, 1.3); break;
    case 'gust': noise(0.3, 0.08, 800); break;
    case 'packShake': noise(0.15, 0.08, 800, 'ui'); break;
    case 'cardFlip': tone(700, 0.08, 'sine', 0.16, 0, 0, 'ui'); break;
    case 'clang': tone(660, 0.04, 'triangle', 0.1); break;
    default: break;
  }
}

const LOOPS = {
  prep: { bpm: 80, notes: [261.6, 329.6, 392, 329.6, 293.7, 392, 349.2, 261.6] },
  battle: { bpm: 96, notes: [196, 246.9, 293.7, 246.9, 220, 293.7, 329.6, 196] },
  queen: { bpm: 112, notes: [174.6, 220, 261.6, 220, 196, 246.9, 293.7, 174.6] },
};
function scheduleBar(which) {
  if (!ac || muted || !LOOPS[which]) return;
  const spec = LOOPS[which];
  const beat = 60 / spec.bpm;
  const t0 = Math.max(ac.currentTime + 0.05, barUntil || ac.currentTime);
  spec.notes.forEach((f, i) => {
    if (i % 2 && which === 'prep') return;
    tone(f, beat * 0.7, i % 3 === 0 ? 'triangle' : 'sine', which === 'queen' ? 0.05 : 0.055, 0, t0 + i * beat - ac.currentTime, 'music');
  });
  barUntil = t0 + spec.notes.length * beat;
}
export function setMusicMode(next, paused) {
  if (!ac) return;
  if (paused) { if (musicBus) musicBus.gain.setTargetAtTime(0.0001, ac.currentTime, 0.05); return; }
  if (musicBus) musicBus.gain.setTargetAtTime(musicGain, ac.currentTime, 0.08);
  if (next === mode) return;
  mode = next;
  barUntil = 0;
}
export function noteQueens(n, paused) {
  const alive = n > 0;
  if (alive) { queenWas = true; holdUntil = 0; setMusicMode('queen', paused); return; }
  if (queenWas) { queenWas = false; holdUntil = performance.now() + 4000; }
  if (holdUntil && performance.now() < holdUntil) { setMusicMode('queen', paused); return; }
  setMusicMode('battle', paused);
}
export function musicTick(want, paused) {
  initAudio();
  if (!ac) return;
  if (want === 'prep' || want === 'off') { holdUntil = 0; queenWas = false; setMusicMode(want, paused); }
  else if (want === 'queen') noteQueens(1, paused);
  else noteQueens(0, paused);
  if (paused || muted || mode === 'off') return;
  if (!barUntil || ac.currentTime > barUntil - 0.2) scheduleBar(mode === 'prep' || mode === 'battle' || mode === 'queen' ? mode : 'prep');
}
