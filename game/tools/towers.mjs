// Prints the effective stats of every tower at in-battle levels 1-3 (card level from argv, default 1),
// straight from src/config.js TOWERS - the one place all tower abilities are tuned.  Usage: npm run towers [-- cardLevel]
import * as C from '../src/config.js';
import { towerStat, statLabel, formatStat } from '../src/sim.js';
const cl = Math.max(1, Math.min(10, Number(process.argv[2]) || 1));
console.log(`Crumb Defense tower stats (card level ${cl}); edit src/config.js TOWERS to tune\n`);
for (const [id, T] of Object.entries(C.TOWERS)) {
  const keys = ['power', 'rate', 'range'].filter((k) => T.stats[k] !== null && T.stats[k] !== undefined);
  const row = (l) => keys.map((k) => `${statLabel(id, k)} ${formatStat(id, k, towerStat(id, k, l, cl))}`).join(' | ');
  const extra = Object.entries(T).filter(([k, v]) => typeof v === 'number' || typeof v === 'boolean').map(([k, v]) => `${k}=${v}`).join(' ');
  console.log(`${T.name} [${id}]  ${T.ability || T.desc || ''}`);
  for (let l = 1; l <= 3; l++) console.log(`  L${l}: ${row(l)}`);
  if (extra) console.log(`  params: ${extra}`);
}
