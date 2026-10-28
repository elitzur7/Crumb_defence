// v0.7.8 'typical profile' QA mode (review-v0.7.7 P1-2). Port of the design harness scratch/arr78.mjs + agg78.mjs against the shipped config.
// The arrival deck of each level comes from tools/data/profiles-typical.json (progression sim, mixed policy, K=4: what a real player owns/levels/holds on
// the FIRST attempt of that level). Reports win %, stars per win and 3-star % TOGETHER per level, and world means. Uniform-cap mode is secondary.
// usage: [LEVELS=a-b] [TR=100] [SPT=10] [MODE=prof|uni] [CL=4] [PROFILES=file] [OUT=rows.json] [OVR=levelOverrides.json] [QUIET=1] node tools/sim-typical.mjs
//  prof (default): level L, trajectory t in 0..TR-1 (profile entry), SPT seeds each (paired: seed = 1000 + t*101 + s*7919) -> TR*SPT battles per level (100 x 10 = 1000)
//  uni  (secondary, Lumi's sims5 'cap N'): every card at CL, 9 of each booster, seeds 1..TR*SPT, the world cap applies
// Battle: DT = 1/60, the smart bot steps every 0.5 s, 1800 s limit - identical to arr78.mjs.
import { readFileSync, writeFileSync } from 'node:fs';
import * as C from '../src/config.js'; import * as S from '../src/sim.js'; import * as BOT from '../src/bot.js';
const E = process.env;
const PF = E.PROFILES || new URL('./data/profiles-typical.json', import.meta.url).pathname;
const TR = +(E.TR || 100), SPT = +(E.SPT || 10), MODE = E.MODE || 'prof', CL = +(E.CL || 4);
if (E.OVR) { const O = JSON.parse(readFileSync(E.OVR, 'utf8')); for (const [l, o] of Object.entries(O)) Object.assign(C.LEVELS[+l - 1], o); }
const [lo, hi] = (E.LEVELS || '1-30').split('-').map(Number);
export function runBattle(i, deck, cardLevels, bonusStock, seed) {
  const b = new S.Battle({ levelIndex: i, deck, seed, cardLevels, bonusTypes: ['bomb', 'plane'], bonusStock, noCardLevelCap: false });
  let th = 0; const dt = 1 / 60;
  while (!b.result && b.time < 1800) { b.update(dt); th -= dt; if (th <= 0) { th = 0.5; BOT.smartBotStep(b); } }
  return { win: b.result === 'win' ? 1 : 0, stars: b.result === 'win' ? b.stars : 0 };
}
export function aggregate(rows) {
  const by = {}; for (const r of rows) (by[r.L] = by[r.L] || []).push(r);
  return Object.keys(by).map(Number).sort((a, b) => a - b).map((L) => { const a = by[L], n = a.length, w = a.reduce((x, r) => x + r.win, 0), st = a.reduce((x, r) => x + r.stars, 0), s3 = a.filter((r) => r.stars === 3).length;
    return { L, n, win: 100 * w / n, starsPerWin: w ? st / w : null, star3: 100 * s3 / n, starsPerBattle: st / n }; });
}
if (process.argv[1] && process.argv[1].endsWith('sim-typical.mjs')) {
  const P = MODE === 'uni' ? null : JSON.parse(readFileSync(PF, 'utf8')); const rows = [];
  for (let L = lo; L <= hi; L++) {
    const i = L - 1;
    if (MODE === 'uni') {
      const deck = BOT.chooseDeck(C.ALL_CARDS, i); const cl = {}; for (const id of C.ALL_CARDS) cl[id] = CL;
      for (let s = 1; s <= TR * SPT; s++) rows.push({ L, t: 0, s, ...runBattle(i, deck, { ...cl }, { bomb: 9, plane: 9, freeze: 9, decoy: 9 }, s) });
    } else {
      const arr = P[L] || [];
      for (let t = 0; t < Math.min(TR, arr.length); t++) { const p = arr[t]; const deck = BOT.chooseDeck(p.owned, i);
        for (let s = 0; s < SPT; s++) rows.push({ L, t, s, ...runBattle(i, deck, { ...p.cl }, { ...p.bonus }, 1000 + t * 101 + s * 7919) }); }
    }
  }
  if (E.OUT) writeFileSync(E.OUT, JSON.stringify(rows));
  const agg = aggregate(rows);
  if (!E.QUIET) {
    console.log(`mode ${MODE}${MODE === 'uni' ? ' CL' + CL : ''}  levels ${lo}-${hi}  ${TR}x${SPT} battles/level  DT 1/60`);
    console.log('level\tn\twin%\tstars/win\t3star%');
    for (const r of agg) console.log(`L${r.L}\t${r.n}\t${r.win.toFixed(1)}\t${r.starsPerWin == null ? '-' : r.starsPerWin.toFixed(2)}\t${r.star3.toFixed(1)}`);
    for (const [name, a, b2] of [['W1', 1, 10], ['W2', 11, 20], ['W3', 21, 30]]) { const g = agg.filter((r) => r.L >= a && r.L <= b2); if (g.length === b2 - a + 1)
      console.log(`${name} mean\t\t${(g.reduce((x, r) => x + r.win, 0) / g.length).toFixed(1)}\t${(g.reduce((x, r) => x + (r.starsPerWin || 0), 0) / g.length).toFixed(2)}\t${(g.reduce((x, r) => x + r.star3, 0) / g.length).toFixed(1)}\tstar sum ${g.reduce((x, r) => x + r.starsPerBattle, 0).toFixed(1)}`); }
  }
}
