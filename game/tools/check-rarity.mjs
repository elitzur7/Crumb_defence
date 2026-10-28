// v0.7.9: the Crumb Design rarity checker R1-R4 (v0.7.8-plan.md s6), enforced on worlds >= 3. usage: node tools/check-rarity.mjs [firstWorldToEnforce=3]
// R1 <= 5 ant types per level (queen included) | R2 >= 2 common types in a non-boss level | R3 <= 2 rare-or-higher types and <= 1 elite (queen excluded)
// R4 a rare first appears at wave >= 3 (the L32 nurse debut at wave 2 with <= 2 ants is the one allowed exception); an elite at wave >= 5.
import * as C from '../src/config.js';
import * as S from '../src/sim.js';
const TIER = { small: 0, worker: 0, flyer: 0, small_fly: 0, gasmask: 1, small_gasmask: 1, small_armed: 1, sprinter: 1, greasy: 1, nurse: 2, armored: 2, big: 2, mama: 2, heavy: 3 };
const tier = (t) => (C.ANTS[t].boss ? 4 : (TIER[t] ?? 1));
export const DEBUT = { 22: ['greasy'], 25: ['mama'], 32: ['nurse'] };
export function checkLevel(i) {
  const waves = S.generateWaves(i); const first = {}, cnt = {};
  waves.forEach((w, k) => w.forEach((e) => { if (first[e.type] == null) first[e.type] = k + 1; if (first[e.type] === k + 1) cnt[e.type] = (cnt[e.type] || 0) + 1; }));
  const types = Object.keys(first), nb = types.filter((t) => tier(t) < 4), msgs = [];
  if (types.length > C.MAX_ANT_TYPES_PER_BATTLE) msgs.push(`R1 ${types.length} types`);
  if (nb.filter((t) => tier(t) === 0).length < 2) msgs.push('R2 <2 common types');
  if (nb.filter((t) => tier(t) >= 2).length > 2) msgs.push(`R3 ${nb.filter((t) => tier(t) >= 2).length} rare+ types`);
  if (nb.filter((t) => tier(t) === 3).length > 1) msgs.push('R3 >1 elite');
  for (const t of nb) {
    const d = (DEBUT[i + 1] || []).includes(t);
    if (tier(t) === 2 && first[t] < (d ? 2 : 3)) msgs.push(`R4 ${t} from wave ${first[t]}`);
    if (tier(t) === 2 && d && cnt[t] > 2) msgs.push(`R4 ${t} debut count ${cnt[t]}`);
    if (tier(t) === 3 && first[t] < 5) msgs.push(`R4 ${t} (elite) from wave ${first[t]}`);
  }
  return { types, tiers: types.map((t) => t + '(' + 'CUREB'[tier(t)] + ')'), msgs };
}
if (process.argv[1] && process.argv[1].endsWith('check-rarity.mjs')) {
  const FROM = +(process.argv[2] || 3); let bad = 0;
  for (let i = 0; i < C.LEVELS.length; i++) {
    const L = C.LEVELS[i], r = checkLevel(i), enf = L.world >= FROM; if (r.msgs.length && enf) bad++;
    console.log(`L${i + 1} W${L.world} ${L.name.padEnd(18)} ${r.tiers.join(' ')}${r.msgs.length ? '  ' + (enf ? 'FAIL ' : 'info ') + r.msgs.join('; ') : '  ok'}`);
  }
  console.log('violations in enforced worlds:', bad); process.exit(bad ? 1 : 0);
}
