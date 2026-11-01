// v0.8.2 M7i: specials readout. usage: node tools/specials-readout.mjs [TR=36] [SPT=15] [JOBS=n]  (Bot proxy, provisional)
// Runs W4 L38 and W5 L45 at hp x1.00 (specials off = baseline), and with the final set of specials at hp x1.00 / 1.07 / 1.11, then prints win % next to plan section 3.0.
import { spawn } from 'node:child_process'; import { writeFileSync, readFileSync, mkdirSync } from 'node:fs'; import os from 'node:os';
const E = process.env; const TR = E.TR || '36', SPT = E.SPT || '15', JOBS = +(E.JOBS || Math.max(1, os.cpus().length - 1)); const OUT = E.OUT || '/tmp/specials-readout'; mkdirSync(OUT, { recursive: true });
const C = await import(new URL('../src/config.js', import.meta.url));
const PLAN = { 38: { base: 79.8, 1.0: 93.3, 1.07: 82.4, 1.11: 68.7, prof: 'profiles-W4-v2.json' }, 45: { base: 83.1, 1.0: 95.7, 1.07: 88.1, 1.11: 80.6, prof: 'prof-w5-v2.json' } };
const cells = []; for (const L of [38, 45]) { cells.push({ L, k: 'base', mul: 1, spec: 0 }); for (const m of [1.0, 1.07, 1.11]) cells.push({ L, k: m, mul: m, spec: 1 }); }
const run = (c) => new Promise((ok) => {
  const f = `${OUT}/L${c.L}-${c.k}.json`, ov = `${OUT}/ov-L${c.L}-${c.k}.json`; writeFileSync(ov, JSON.stringify({ [c.L]: { hpMul: C.LEVELS[c.L - 1].hpMul * c.mul } }));
  const p = spawn('node', ['tools/sim/modexp.mjs', '.', `tools/sim/${PLAN[c.L].prof}`, f], { env: { ...E, LEVELS: `${c.L}-${c.L}`, TR, SPT, OVR: ov, SPEC: String(c.spec), MODE: 'bot' }, stdio: 'ignore' }); p.on('close', () => { const rows = JSON.parse(readFileSync(f, 'utf8')); c.n = rows.length; c.win = 100 * rows.reduce((x, r) => x + r.win, 0) / rows.length; ok(); });
});
const q = cells.slice(); await Promise.all(Array.from({ length: JOBS }, async () => { while (q.length) await run(q.shift()); }));
let worst = 0; console.log('level | cell | battles | win % | plan 3.0 | diff'); for (const c of cells) { const want = PLAN[c.L][c.k]; const d = c.win - want; worst = Math.max(worst, Math.abs(d)); console.log(`L${c.L} | ${c.k === 'base' ? 'baseline (off)' : 'specials x' + c.k} | ${c.n} | ${c.win.toFixed(1)} | ${want} | ${d >= 0 ? '+' : ''}${d.toFixed(1)}`); }
console.log(`worst |diff| ${worst.toFixed(1)} points -> ${worst <= 3 ? 'WITHIN +-3' : worst <= 5 ? 'WARN 3-5 off' : 'STOP: more than 5 off, tell Crumb Design'}`);
writeFileSync(`${OUT}/readout.json`, JSON.stringify(cells, null, 1));
