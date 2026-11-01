// v0.8.2 PP7 / PP13 / EC9: the per-level World 6 readout (Bot proxy, provisional). usage: node tools/w6-readout.mjs [LEVELS=51-60] [TR=36] [SPT=15] [OUT=/tmp/w6-readout] [HPMUL=json {level: factor}]
// Spawns one worker per level (tools/w6-readout.mjs --one L), then prints win %, stars per win, replay coins per win, mean battle time, leak share by ant type and the specials that fired.
import { spawn } from 'node:child_process'; import fs from 'node:fs'; import os from 'node:os';
const E = process.env;
if (process.argv[2] === '--one') {
  const L = +process.argv[3], C = await import('../src/config.js'), S = await import('../src/sim.js'), BOT = await import('../src/bot.js'), M = await import('../src/meta.js');
  const P = JSON.parse(fs.readFileSync(new URL('./sim/prof-w6.json', import.meta.url), 'utf8')); const TR = +(E.TR || 36), SPT = +(E.SPT || 15); const i = L - 1, w = C.WORLDS[C.LEVELS[i].world - 1];
  if (E.UNMIRROR) { const D = JSON.parse(fs.readFileSync(new URL('./sim/w6-data.json', import.meta.url), 'utf8')); const src = D.levels[L - 51].simSourceMap; const mp = C.LEVELS[i].map; const keep = { name: C.MAPS[mp].name, theme: C.MAPS[mp].theme }; Object.assign(C.MAPS[mp], C.MAPS[src], keep); } // experiment: sim on the unmirrored source geometry
  if (E.HPMUL) { const f = JSON.parse(E.HPMUL)[L]; if (f) C.LEVELS[i].hpMul *= f; }
  const o = { L, n: 0, wins: 0, stars: 0, coins: 0, time: 0, timeAll: 0, leak: {}, sp: {}, spBattles: {} };
  for (let t = 0; t < Math.min(TR, (P[L] || []).length); t++) { const p = P[L][t]; const deck = BOT.chooseDeck(p.owned, i);
    for (let s = 0; s < SPT; s++) {
      const b = new S.Battle({ levelIndex: i, deck, seed: 1000 + t * 101 + s * 7919, cardLevels: { ...p.cl }, bonusTypes: ['bomb', 'plane'], bonusStock: { ...p.bonus } }); const fired = {};
      const em = b.emit.bind(b); b.emit = (e) => { if (e.type === 'special') { o.sp[e.sp] = (o.sp[e.sp] || 0) + 1; fired[e.sp] = 1; } em(e); };
      let th = 0; const dt = 1 / 60; while (!b.result && b.time < 1800) { b.update(dt); th -= dt; if (th <= 0) { th = 0.5; BOT.smartBotStep(b); } }
      o.n++; o.timeAll += b.time; for (const [k, v] of Object.entries(b.stats.leakBy || {})) o.leak[k] = (o.leak[k] || 0) + v; for (const k of Object.keys(fired)) o.spBattles[k] = (o.spBattles[k] || 0) + 1;
      if (b.result === 'win') { o.wins++; o.stars += b.stars; o.time += b.time; o.coins += M.battleCoins('win', { kills: b.stats.kills, foodLeft: b.foodStored, levelIndex: i, firstClear: false, time: b.time, coinMul: w.coinMul ?? 1 }).total; }
    } }
  console.log(JSON.stringify(o)); process.exit(0);
}
const [lo, hi] = (E.LEVELS || '51-60').split('-').map(Number), OUT = E.OUT || '/tmp/w6-readout'; fs.mkdirSync(OUT, { recursive: true });
const q = []; for (let L = lo; L <= hi; L++) q.push(L); const res = {};
const run = (L) => new Promise((ok) => { let out = ''; const p = spawn('node', [new URL(import.meta.url).pathname, '--one', String(L)], { env: E, stdio: ['ignore', 'pipe', 'inherit'] }); p.stdout.on('data', (d) => out += d); p.on('close', () => { try { res[L] = JSON.parse(out.trim().split('\n').pop()); } catch { res[L] = null; } ok(); }); });
await Promise.all(Array.from({ length: Math.max(1, os.cpus().length - 1) }, async () => { while (q.length) await run(q.shift()); }));
const PLAN = { 51: 100, 52: 100, 53: 90.9, 54: 91.5, 55: 88.1, 56: 93.5, 57: 81.5, 58: 84.1, 59: 77.4, 60: 59.6 }, PSTAR = { 51: 1.97, 52: 1.91, 53: 1.02, 54: 1.0, 55: 1.0, 56: 1.0, 57: 1.0, 58: 1.2, 59: 1.02, 60: 1.02 };
const rows = []; let md = '| L | win % | plan | diff | tol | stars/win | plan | coins/win | mean win time s | leak share by ant | specials fired (battles / events) |\n|---|---|---|---|---|---|---|---|---|---|---|\n'; let tc = 0, tw = 0;
for (let L = lo; L <= hi; L++) { const o = res[L]; if (!o) continue; const win = 100 * o.wins / o.n, spw = o.stars / o.wins, cw = o.coins / o.wins, tol = L === 55 || L === 59 ? 7 : 5;
  const lt = Object.values(o.leak).reduce((a, v) => a + v, 0) || 1, leak = Object.entries(o.leak).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${(100 * v / lt).toFixed(0)}%`).join(', ') || '-';
  const sp = Object.keys(o.sp).map((k) => `${k} ${(100 * o.spBattles[k] / o.n).toFixed(0)}% / ${o.sp[k]}`).join(', ') || '-';
  const pl = PLAN[L], d = win - pl, ok = pl != null && Math.abs(d) <= tol && Math.abs(spw - PSTAR[L]) <= 0.15; tc += cw; tw++;
  rows.push({ L, n: o.n, win, plan: pl, diff: d, tol, spw, planStar: PSTAR[L], coins: cw, time: o.time / o.wins, ok }); md += `| ${L} | ${win.toFixed(1)} | ${pl} | ${d >= 0 ? '+' : ''}${d.toFixed(1)} | ${tol} | ${spw.toFixed(2)} | ${PSTAR[L]} | ${cw.toFixed(0)} | ${(o.time / o.wins).toFixed(0)} | ${leak} | ${sp} |\n`; console.log(`L${L} n ${o.n} win ${win.toFixed(1)} % (plan ${pl} diff ${d.toFixed(1)} tol ${tol}) stars/win ${spw.toFixed(2)} (plan ${PSTAR[L]}) coins/win ${cw.toFixed(0)} time ${(o.time / o.wins).toFixed(0)} s ${ok ? 'OK' : 'OUT OF TOLERANCE'}`); }
console.log(`mean replay coins/win ${(tc / tw).toFixed(0)} (plan 591, +-8% = 544..638)`); fs.writeFileSync(`${OUT}/w6-readout.json`, JSON.stringify({ rows, res }, null, 1)); fs.writeFileSync(`${OUT}/w6-readout.md`, md);
