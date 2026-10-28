// v0.7.7: W3 bot sim (the design plan's w3cal harness, against the shipped config). usage: node tools/sim-w3-v077.mjs <level 1-based> <cap> <seeds> [top=4]
// The bot plays with the TOP damage cards at card level CAP and everything else at CL1 (noCardLevelCap), seeds 1000 + s * 37, bot step every 0.5 s.
import * as C from '../src/config.js'; import * as S from '../src/sim.js'; import * as BOT from '../src/bot.js';
const [lv, cap, N, topArg] = process.argv.slice(2);
const TOP = topArg == null ? 4 : +topArg, ALL = C.ALL_CARDS;
const DMG = ['laser', 'slingshot', 'sound', 'lizard', 'spray', 'zapper', 'gate', 'lava', 'ball'];
const cl = {}; for (const id of ALL) cl[id] = 1; DMG.slice(0, TOP).forEach((id) => { cl[id] = +cap; });
const i = +lv - 1; let w = 0, st = 0, kids = 0;
for (let s = 0; s < +N; s++) {
  const deck = BOT.chooseDeck(ALL, i);
  const b = new S.Battle({ levelIndex: i, deck, seed: 1000 + s * 37, cardLevels: { ...cl }, bonusTypes: [], bonusStock: {}, noCardLevelCap: true });
  let th = 0; while (!b.result && b.time < 1800) { b.update(1 / 60); th -= 1 / 60; if (th <= 0) { th = 0.5; BOT.smartBotStep(b); } }
  if (b.result === 'win') { w++; st += b.stars; } kids += b.stats.splitSpawned || 0;
}
console.log(JSON.stringify({ level: +lv, cap: +cap, seeds: +N, winPct: +(100 * w / N).toFixed(1), stars: w ? +(st / w).toFixed(2) : null, splitKids: kids }));
