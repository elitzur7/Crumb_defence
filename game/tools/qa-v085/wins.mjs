// v0.8.5: 540 bot battles per level for L61-L80. W7 uses the W6 profile shifted by 10.
// W8 uses prof-w8 (the same trajectories keyed at L71-L80). Slope rows multiply hp by 1.08.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const outFile = process.argv[2] || '/workspace/qa/v0.8.5/wins.json';
if (process.argv[2] === '--one') {
  const L = +process.argv[3];
  const factor = +(process.env.HPMUL || 1);
  const C = await import('../../src/config.js');
  const S = await import('../../src/sim.js');
  const BOT = await import('../../src/bot.js');
  const prof = L >= 71
    ? JSON.parse(fs.readFileSync(new URL('../sim/prof-w8.json', import.meta.url), 'utf8'))
    : JSON.parse(fs.readFileSync(new URL('../sim/prof-w6.json', import.meta.url), 'utf8'));
  const i = L - 1;
  const src = L >= 71 ? String(L) : String(L - 10);
  const baseHp = C.LEVELS[i].hpMul;
  if (factor !== 1) C.LEVELS[i].hpMul = +(baseHp * factor).toFixed(4);
  let n = 0, wins = 0;
  const arr = prof[src] || [];
  for (let t = 0; t < Math.min(36, arr.length); t++) {
    const p = arr[t];
    const deck = BOT.chooseDeck(p.owned, i);
    for (let s = 0; s < 15; s++) {
      const b = new S.Battle({ levelIndex: i, deck, seed: 1000 + t * 101 + s * 7919, cardLevels: { ...p.cl }, bonusTypes: ['bomb', 'plane'], bonusStock: { ...p.bonus } });
      let th = 0;
      while (!b.result && b.time < 1800) { b.update(1 / 60); th -= 1 / 60; if (th <= 0) { th = 0.5; BOT.smartBotStep(b); } }
      n++; if (b.result === 'win') wins++;
    }
  }
  console.log(JSON.stringify({ L, n, wins, win: n ? +(100 * wins / n).toFixed(1) : null, hpMul: +C.LEVELS[i].hpMul.toFixed(4), factor }));
  process.exit(0);
}

const levels = [];
for (let L = 61; L <= 80; L++) levels.push(L);
const slopes = [65, 67, 68, 69, 70, 75, 78, 79, 80];
const jobs = [...levels.map((L) => [L, 1]), ...slopes.map((L) => [L, 1.08])];
const self = fileURLToPath(import.meta.url);
const res = [];
const run = ([L, f]) => new Promise((ok) => {
  const p = spawn(process.execPath, [self, '--one', String(L)], { env: { ...process.env, HPMUL: String(f) }, stdio: ['ignore', 'pipe', 'inherit'] });
  let out = '';
  p.stdout.on('data', (d) => { out += d; });
  p.on('close', () => { try { res.push(JSON.parse(out.trim().split('\n').pop())); } catch (e) { res.push({ L, factor: f, error: String(e), out }); } ok(); });
});
const q = jobs.slice();
const n = Math.max(1, Math.min(os.cpus().length, 6));
await Promise.all(Array.from({ length: n }, async () => { while (q.length) await run(q.shift()); }));
const targets = { 61: [100, 5], 62: [100, 5], 63: [91.5, 5], 64: [93.5, 5], 65: [87, 7], 66: [93, 5], 67: [84, 5], 68: [84, 5], 69: [88, 7], 70: [58.5, 5], 71: [100, 5], 72: [100, 5], 73: [91.5, 5], 74: [93.5, 5], 75: [87, 7], 76: [93, 5], 77: [84, 5], 78: [84, 5], 79: [88, 7], 80: [58.5, 5] };
const base = {}, up = {};
for (const r of res) { if (r.factor === 1) base[r.L] = r; else up[r.L] = r; }
const report = levels.map((L) => {
  const b = base[L], [target, tol] = targets[L];
  const slope = b && up[L] && b.win != null && up[L].win != null ? +(b.win - up[L].win).toFixed(1) : null;
  return { L, hpMul: b && b.hpMul, win: b && b.win, n: b && b.n, target, tol, ok: b && b.win != null ? Math.abs(b.win - target) <= tol : false, slope, slopeOk: slope == null ? null : Math.abs(slope) <= 40 };
});
fs.mkdirSync('/workspace/qa/v0.8.5', { recursive: true });
fs.writeFileSync(outFile, JSON.stringify({ note: 'bot proxy, 36 trajectories x 15 seeds', report }, null, 2));
console.log(report.map((r) => `L${r.L} hp ${r.hpMul} win ${r.win} (${r.n}) target ${r.target}±${r.tol} ${r.ok ? 'OK' : 'OUT'}${r.slope != null ? ` slope ${r.slope}` : ''}`).join('\n'));
