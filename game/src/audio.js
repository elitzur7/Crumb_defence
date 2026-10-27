// Tiny procedural sound effects with WebAudio (no audio files). Created lazily on first touch.
let ac = null, master = null, muted = false, last = {};
export function initAudio() {
  if (ac) return;
  try { const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return; ac = new AC(); master = ac.createGain(); master.gain.value = 0.25; master.connect(ac.destination); } catch (e) { ac = null; }
}
export function setMuted(m) { muted = m; }
export function isMuted() { return muted; }
function tone(freq, dur, type = 'sine', vol = 0.5, slide = 0, delay = 0) {
  if (!ac || muted) return;
  const t = ac.currentTime + delay;
  const o = ac.createOscillator(), g = ac.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq * slide), t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.02);
}
function noise(dur, vol = 0.4, hp = 800) {
  if (!ac || muted) return;
  const len = Math.floor(ac.sampleRate * dur), buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const s = ac.createBufferSource(); s.buffer = buf; const f = ac.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = hp;
  const g = ac.createGain(); g.gain.value = vol; s.connect(f); f.connect(g); g.connect(master); s.start();
}
let speedK = 1;
export function setAudioSpeed(k) { speedK = k; }
const FAST_THROTTLED = new Set(['laser', 'zap', 'pop', 'pulse']); // v0.7.4 M0: at 4x these repeat the most; throttled to 120 ms (everything else stays 60 ms)
export const throttleMs = (name, speed) => (speed >= 4 && FAST_THROTTLED.has(name) ? 120 : 60);
export function sfx(name) {
  if (!ac || muted) return;
  const now = performance.now();
  if (last[name] && now - last[name] < throttleMs(name, speedK)) return; // throttle
  last[name] = now;
  switch (name) {
    case 'pop': tone(520 + Math.random() * 200, 0.12, 'sine', 0.35, 1.8); break;
    case 'place': tone(392, 0.09, 'triangle', 0.4); tone(587, 0.12, 'triangle', 0.35, 1, 0.07); break;
    case 'upgrade': tone(523, 0.1, 'triangle', 0.4); tone(659, 0.1, 'triangle', 0.4, 1, 0.08); tone(784, 0.16, 'triangle', 0.4, 1, 0.16); break;
    case 'zap': tone(1200, 0.08, 'square', 0.12, 0.4); break;
    case 'laser': tone(1600, 0.05, 'sawtooth', 0.06, 0.6); break;
    case 'pulse': tone(110, 0.22, 'sine', 0.5, 0.6); break;
    case 'boom': noise(0.5, 0.6, 120); tone(90, 0.4, 'sine', 0.6, 0.4); break;
    case 'swat': tone(330 + Math.random() * 40, 0.09, 'sine', 0.32, 0.55); noise(0.05, 0.1, 1500); break; // v0.7.2: the cookie guard's soft thwap (a lower 'pop')
    case 'steal': tone(300, 0.15, 'square', 0.12, 0.6); break;
    case 'return': tone(660, 0.12, 'triangle', 0.3, 1.5); break;
    case 'wave': tone(440, 0.12, 'triangle', 0.3); tone(440, 0.12, 'triangle', 0.3, 1, 0.16); break;
    case 'win': [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.22, 'triangle', 0.4, 1, i * 0.12)); break;
    case 'lose': [392, 330, 262].forEach((f, i) => tone(f, 0.3, 'triangle', 0.4, 1, i * 0.2)); break;
    case 'tap': tone(700, 0.05, 'sine', 0.25); break;
    case 'freeze': tone(1800, 0.4, 'sine', 0.2, 0.5); break;
    case 'plane': tone(140, 1.2, 'sawtooth', 0.08, 1.3); break;
    case 'gust': noise(0.3, 0.12, 2000); break;
    case 'packShake': noise(0.15, 0.14, 2000); break; // v0.7 pack reveal: the pack rocks
    case 'cardFlip': tone(900, 0.05, 'sine', 0.22, 1.3); break; // v0.7 pack reveal: one card flips
  }
}
