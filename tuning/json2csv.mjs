// tuning.json -> csv/*.csv (for editing in a spreadsheet). Columns starting with "_" are computed, read-only.
// Usage (from /workspace/ant-td): node tuning/json2csv.mjs [--json tuning/tuning.json] [--dir tuning/csv]
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { toCsv } from './tablelib.mjs';
const HERE = fileURLToPath(new URL('.', import.meta.url));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const jsonPath = arg('--json', HERE + 'tuning.json'); const dir = arg('--dir', HERE + 'csv');
const T = JSON.parse(readFileSync(jsonPath, 'utf8'));
mkdirSync(dir, { recursive: true });
const out = (name, cols, rows) => { writeFileSync(`${dir}/${name}.csv`, toCsv(cols, rows)); console.log(`${name}.csv  ${rows.length} rows`); };
const union = (objs, skip = []) => { const s = []; for (const o of objs) for (const k of Object.keys(o)) if (!skip.includes(k) && !s.includes(k)) s.push(k); return s; };

// towers: base stats + per-tower params (prefixed "p.")
const tw = Object.entries(T.towers);
const pcols = union(tw.map(([, t]) => t.params || {}));
out('towers', ['id', 'power', 'rate', 'rangeTiles', ...pcols.map((p) => 'p.' + p)],
  tw.map(([id, t]) => ({ id, power: t.power, rate: t.rate, rangeTiles: t.rangeTiles, ...Object.fromEntries(Object.entries(t.params || {}).map(([k, v]) => ['p.' + k, v])) })));
// in-battle upgrades (multipliers) and card-level upgrades (fractions; range in tiles): one row per stat change
out('tower_upgrades', ['tower', 'battleLevel', 'stat', 'multiplier'],
  tw.flatMap(([id, t]) => t.battleUpgrades.flatMap((u, i) => Object.entries(u).map(([stat, v]) => ({ tower: id, battleLevel: i + 2, stat, multiplier: v })))));
out('card_upgrades', ['tower', 'cardLevel', 'stat', 'value'],
  tw.flatMap(([id, t]) => t.cardUpgrades.flatMap((u, i) => Object.entries(u).map(([stat, v]) => ({ tower: id, cardLevel: i + 2, stat, value: v })))));
// read-only: what each card level adds up to
const lv = [];
for (const [id, t] of tw) {
  const cur = { power: t.power, rate: t.rate, rangeTiles: t.rangeTiles, ...(t.params || {}) };
  for (let L = 1; L <= t.cardUpgrades.length + 1; L++) {
    if (L > 1) for (const [k, v] of Object.entries(t.cardUpgrades[L - 2])) {
      if (k === 'range') { if (cur.rangeTiles != null) cur.rangeTiles = +(cur.rangeTiles + v).toFixed(2); }
      else if (k === 'liftSize') cur.liftSize = Math.min(3, cur.liftSize + v); // v0.6 Tractor: added size classes
      else if (cur[k] != null) cur[k] = +(cur[k] * (1 + v)).toFixed(4);
    }
    lv.push({ _tower: id, _cardLevel: L, _power: cur.power, _rate: cur.rate, _rangeTiles: cur.rangeTiles, _changes: L > 1 ? Object.entries(t.cardUpgrades[L - 2]).map(([k, v]) => `${k} +${k === 'range' ? v + ' tiles' : k === 'liftSize' ? v + ' size' : Math.round(v * 100) + '%'}`).join(' & ') : 'base' });
  }
}
out('card_levels_readonly', ['_tower', '_cardLevel', '_power', '_rate', '_rangeTiles', '_changes'], lv);

// ants (+ computed queen take)
const ants = Object.entries(T.ants);
const acols = union(ants.map(([, a]) => a));
const take = (a) => (a.queenTraits ? 50 + a.queenTraits.reduce((s, k) => s + (T.queenTraitMods[k] || 0), 0) : '');
out('ants', ['id', ...acols, '_queenTake'], ants.map(([id, a]) => ({ id, ...a, _queenTake: take(a) })));
out('ant_sizes', ['size', 'scale'], Object.entries(T.antSizes).map(([size, scale]) => ({ size, scale })));
out('queen_traits', ['trait', 'takeMod'], Object.entries(T.queenTraitMods).map(([trait, takeMod]) => ({ trait, takeMod })));

// worlds, levels (+ computed waves / ants from the game's own wave generator), maps
out('worlds', ['id', ...union(T.worlds, ['id'])], T.worlds);
let gen = null;
try { gen = (await import('../game/src/sim.js')).generateWaves; } catch { /* game sources not available: computed columns left blank */ }
const lcols = union(T.levels);
out('levels', ['level', ...lcols, '_waves', '_ants'], T.levels.map((L, i) => {
  let w = null; try { w = gen && jsonPath.endsWith('tuning/tuning.json') ? gen(i) : null; } catch { w = null; }
  return { level: i + 1, ...L, _waves: w ? w.length : undefined, _ants: w ? w.flat().length : undefined };
}));
const maps = Object.entries(T.maps);
out('maps', ['id', ...union(maps.map(([, m]) => m))], maps.map(([id, m]) => ({ id, ...m })));
