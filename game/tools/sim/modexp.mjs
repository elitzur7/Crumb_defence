// v0.8.2 QA7: <dir> is a repo/game directory: <dir>/src (run from game/ with '.') or <dir>/game/src (a repo copy). Bot proxy, provisional.
import { existsSync as __ex } from 'node:fs'; import { resolve as __rs } from 'node:path'; import { pathToFileURL as __pu } from 'node:url';
const __d = process.argv[2]; const SRC = __pu(__rs(__ex(__rs(__d, 'src/config.js')) ? __rs(__d, 'src') : __rs(__d, 'game/src')) + '/').href;
// usage: [LEVELS=a-b] [TR=20] [SPT=5] [MODE=weak|carrier|front|bot] [OVR=json] node modexp.mjs <dir> <profiles.json> <out.json>
// like arr78.mjs but forces every single-target tower (slingshot/laser/zapper/lizard) to MODE after every bot step; also logs heal stats and nurse kill times.
const [dir, pf, outF] = process.argv.slice(2); const E = process.env; const fs = await import('node:fs');
const C = await import(SRC + 'config.js'); const S = await import(SRC + 'sim.js'); const BOT = await import(SRC + 'bot.js');
const P = JSON.parse(fs.readFileSync(pf, 'utf8')); const TR = +(E.TR || 20), SPT = +(E.SPT || 5), MODE = E.MODE || 'weak';
if (E.ANTOVR) { const O = JSON.parse(E.ANTOVR); for (const [k, o] of Object.entries(O)) Object.assign(C.ANTS[k], o); }
if (E.OVR) { const O = JSON.parse(fs.readFileSync(E.OVR, 'utf8')); for (const [l, o] of Object.entries(O)) Object.assign(C.LEVELS[+l - 1], o); }
const [lo, hi] = (E.LEVELS || '31-40').split('-').map(Number); const rows = [];
function run(i, deck, cardLevels, bonusStock, seed) {
  const b = new S.Battle({ levelIndex: i, deck, seed, cardLevels, bonusTypes: ['bomb', 'plane'], bonusStock });
  if (E.SPEC === '1') b.level = { ...b.level, world: 6 }; // v0.8.2 M7i readout: run the specials on a W4/W5 map (the sim reads them only through specialActive)
  let th = 0; const dt = 1 / 60; let nk = 0, nkT = 0;
  while (!b.result && b.time < 1800) { b.update(dt); th -= dt; if (th <= 0) { th = 0.5; BOT.smartBotStep(b); if (MODE !== 'bot') for (const tw of b.towers) if (S.hasTargetModes(tw.type)) tw.mode = MODE; } }
  return { win: b.result === 'win' ? 1 : 0, stars: b.result === 'win' ? b.stars : 0, time: Math.round(b.time), food: Math.round(b.foodStored), heals: b.stats.heals || 0, healed: Math.round(b.stats.healed || 0) };
}
for (let L = lo; L <= hi; L++) { const i = L - 1; const arr = P[L] || [];
  for (let t = 0; t < Math.min(TR, arr.length); t++) { const p = arr[t]; const deck = BOT.chooseDeck(p.owned, i);
    for (let s = 0; s < SPT; s++) rows.push({ L, t, s, ...run(i, deck, { ...p.cl }, { ...p.bonus }, 1000 + t * 101 + s * 7919) }); } }
fs.writeFileSync(outF, JSON.stringify(rows));

{ const byL = {}; for (const r of rows) { (byL[r.L] = byL[r.L] || []).push(r); } for (const [L, a] of Object.entries(byL)) console.log(`L${L}: ${a.length} battles, win ${(100 * a.reduce((x, r) => x + r.win, 0) / a.length).toFixed(1)} %, stars/win ${(a.reduce((x, r) => x + r.stars, 0) / Math.max(1, a.reduce((x, r) => x + r.win, 0))).toFixed(2)}  (bot proxy, provisional)`); }
