// v0.5: smart-bot win rates per level, starter cards (card level 1) vs upgraded cards (card levels 5 and 10), both worlds.
// Cards owned at level i: tools assume STARTER_CARDS + the first i of SIM_ASSUMED_CARDS (world 2: all of them).
// Usage: node tools/winrates.mjs [--levels 0-19] [--seeds 5] [--json out.json]
import * as C from '../src/config.js';
import { playLevel, unlockedAt } from '../src/bot.js';
import { generateWaves } from '../src/sim.js';
import { writeFileSync } from 'node:fs';
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const [lo, hi] = arg('--levels', `0-${C.LEVELS.length - 1}`).split('-').map(Number);
const N = Number(arg('--seeds', 5)); const SEEDS = Array.from({ length: N }, (_, i) => i + 1);
const CL = (arg('--cl', '1,5,10')).split(',').map(Number);
const rows = [];
for (let i = lo; i <= hi; i++) {
  const unlocked = unlockedAt(i);
  const row = { level: i + 1, world: C.LEVELS[i].world, name: C.LEVELS[i].name, map: C.LEVELS[i].map, ants: generateWaves(i).flat().length };
  for (const cl of CL) {
    const res = SEEDS.map((seed) => playLevel(i, { bot: 'smart', unlocked, cardLevel: cl, seed }));
    row[`L${cl} wins`] = `${res.filter((r) => r.result === 'win').length}/${N}`;
    row[`L${cl} stars`] = res.map((r) => r.stars).join('');
    row[`L${cl} food`] = Math.round(res.reduce((s, r) => s + r.food, 0) / N);
  }
  rows.push(row); console.error(JSON.stringify(row));
}
console.table(rows);
const out = arg('--json'); if (out) writeFileSync(out, JSON.stringify(rows, null, 1));
