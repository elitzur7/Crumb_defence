// v0.8.4 W7 gate: 540 battles per level (36 x 15) on the W6 typical profile remapped onto L61-L70.
// usage: node tools/w7-wins.mjs [out.json]
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const outFile = process.argv[2] || '/tmp/w7-wins.json';
if (process.argv[2] === '--one') {
  const L = +process.argv[3];
  const factor = +(process.env.HPMUL || 1);
  const C = await import('../src/config.js');
  const S = await import('../src/sim.js');
  const BOT = await import('../src/bot.js');
  const P = JSON.parse(fs.readFileSync(new URL('./sim/prof-w6.json', import.meta.url), 'utf8'));
  const i = L - 1;
  const src = String(L - 10);
  if (factor !== 1) C.LEVELS[i].hpMul *= factor;
  let n = 0, wins = 0;
  const TR = 36, SPT = 15;
  for (let t = 0; t < Math.min(TR, (P[src] || []).length); t++) {
    const p = P[src][t];
    const deck = BOT.chooseDeck(p.owned, i);
    for (let s = 0; s < SPT; s++) {
      const b = new S.Battle({ levelIndex: i, deck, seed: 1000 + t * 101 + s * 7919, cardLevels: { ...p.cl }, bonusTypes: ['bomb', 'plane'], bonusStock: { ...p.bonus } });
      let th = 0;
      while (!b.result && b.time < 1800) { b.update(1 / 60); th -= 1 / 60; if (th <= 0) { th = 0.5; BOT.smartBotStep(b); } }
      n++; if (b.result === 'win') wins++;
    }
  }
  console.log(JSON.stringify({ L, n, wins, win: +(100 * wins / n).toFixed(1), hpMul: C.LEVELS[i].hpMul }));
  process.exit(0);
}

const jobs = [];
for (const L of [61, 62, 63, 64, 65, 66, 67, 68, 69, 70]) jobs.push([L, 1]);
for (const L of [65, 67, 68, 69, 70]) jobs.push([L, 1.08]);
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
const targets = { 61: [100, 5], 62: [100, 5], 63: [91.5, 5], 64: [93.5, 5], 65: [87, 7], 66: [93, 5], 67: [84, 5], 68: [84, 5], 69: [88, 7], 70: [58.5, 5] };
const by = {};
for (const r of res) { const k = r.hpMul && Math.abs(r.hpMul / (targets[r.L] ? 1 : 1)) ? r : r; by[r.L + '@' + (String(r.hpMul).includes('.') && r.n ? r.hpMul : r.hpMul)] = r; }
const rows = res.filter((r) => r.n === 540);
const base = {};
const up = {};
for (const r of rows) {
  const slot = [61, 62, 63, 64, 65, 66, 67, 68, 69, 70].find((L) => L === r.L);
  const tuned = { 61: 6, 62: 7.4, 63: 9.6, 64: 12, 65: 5.42, 66: 9.5, 67: 4.25, 68: 5.51, 69: 3.99, 70: 1.64 }[r.L];
  if (Math.abs(r.hpMul - tuned) < 0.02) base[r.L] = r;
  else up[r.L] = r;
}
const report = [];
for (const L of [61, 62, 63, 64, 65, 66, 67, 68, 69, 70]) {
  const b = base[L], [target, tol] = targets[L];
  const slope = b && up[L] ? +(b.win - up[L].win).toFixed(1) : null;
  report.push({ L, win: b && b.win, target, tol, ok: b ? Math.abs(b.win - target) <= tol : false, slope, slopeOk: slope == null ? null : Math.abs(slope) <= 40, n: b && b.n });
}
fs.writeFileSync(outFile, JSON.stringify({ report, rows }, null, 2));
console.log(report.map((r) => `L${r.L} win ${r.win} target ${r.target}±${r.tol} ${r.ok ? 'OK' : 'OUT'}${r.slope != null ? ` slope ${r.slope}` : ''}`).join('\n'));
