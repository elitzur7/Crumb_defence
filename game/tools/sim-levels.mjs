import * as C from '../src/config.js';
import { playLevel, unlockedAt } from '../src/bot.js';
import { generateWaves } from '../src/sim.js';
import { antPower } from '../src/config.js';

const SEEDS = [1, 2, 3, 4, 5];
const rows = [];
let allOk = true;
for (let i = 0; i < C.LEVELS.length; i++) {
  const unlocked = unlockedAt(i);
  const waves = generateWaves(i);
  const threat = waves.flat().reduce((s, e) => s + antPower(C.ANTS[e.type]) * (C.LEVELS[i].hpMul || 1), 0);
  const smart = SEEDS.map((seed) => playLevel(i, { bot: 'smart', unlocked, seed }));
  const random = SEEDS.map((seed) => playLevel(i, { bot: 'random', unlocked, seed }));
  const idle = playLevel(i, { bot: 'idle', unlocked, seed: 1 });
  const wins = smart.filter((r) => r.result === 'win').length;
  const rwins = random.filter((r) => r.result === 'win').length;
  const avg = (a, k) => Math.round(a.reduce((s, r) => s + r[k], 0) / a.length);
  rows.push({ level: i + 1, name: C.LEVELS[i].name, waves: waves.length, ants: waves.flat().length, threat: Math.round(threat),
    smartWins: `${wins}/${SEEDS.length}`, smartAvgFood: avg(smart, 'food'), smartStars: smart.map((r) => r.stars).join(''),
    randomWins: `${rwins}/${SEEDS.length}`, randomAvgFood: avg(random, 'food'), idle: idle.result, deck: smart[0].deck.join(',') });
  if (wins < SEEDS.length) allOk = false;
}
console.table(rows);
// difficulty should rise: threat strictly increasing
let rising = true;
for (let i = 1; i < rows.length; i++) if (rows[i].threat <= rows[i - 1].threat) rising = false;
console.log('Threat strictly rising across levels:', rising);
console.log('All levels winnable by smart bot on every seed:', allOk);
if (process.argv.includes('--json')) console.log(JSON.stringify(rows));
process.exit(allOk && rising ? 0 : 1);
