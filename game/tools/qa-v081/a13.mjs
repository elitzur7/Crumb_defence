// A13 sim identity: node tools/qa-v081/a13.mjs <srcDir> <out.json> [lo-hi] [seeds]  - plays every level with the smart bot over paired seeds and writes a per-battle result string.
// Run once against the v0.8.0 src and once against the current src (and with the ART81 kill-switch on/off); the two files must be byte-identical for levels that did not change.
import { writeFileSync } from 'node:fs'; import { resolve } from 'node:path';
const [dir, out, rng = '1-40', seedsN = '20'] = process.argv.slice(2); const base = 'file://' + resolve(dir) + '/';
const C = await import(base + 'config.js'); const BOT = await import(base + 'bot.js');
const [lo, hi] = rng.split('-').map(Number); const res = {};
for (let L = lo; L <= Math.min(hi, C.LEVELS.length); L++) for (let s = 1; s <= +seedsN; s++) {
  const i = L - 1; const r = BOT.playLevel(i, { bot: 'smart', unlocked: BOT.unlockedAt(i), cardLevel: 1 + (s % 4), seed: s });
  res[`${L}/${s}`] = [r.result, r.stars, r.food, r.time, r.towers, r.cards, r.crumbs, r.kills, r.spawned].join(',');
}
writeFileSync(out, JSON.stringify(res, null, 0)); console.log('wrote', out, Object.keys(res).length);
