// csv/*.csv -> tuning.json. Sections not covered by a CSV (_about, _units) are kept from the existing JSON. v0.6.2: the "shop" section (unlock prices, pack chance) is JSON-only and kept as well.
// Columns starting with "_" (computed) and the read-only card_levels_readonly.csv are ignored.
// Usage (from /workspace/ant-td): node tuning/csv2json.mjs [--dir tuning/csv] [--json tuning/tuning.json] [--out tuning/tuning.json]
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { parseCsv, cellValue, editable, prettyJson } from './tablelib.mjs';
const HERE = fileURLToPath(new URL('.', import.meta.url));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const dir = arg('--dir', HERE + 'csv'); const base = arg('--json', HERE + 'tuning.json'); const outPath = arg('--out', base);
const T = existsSync(base) ? JSON.parse(readFileSync(base, 'utf8')) : {};
const read = (n) => parseCsv(readFileSync(`${dir}/${n}.csv`, 'utf8'));
const obj = (row, skip = []) => { const o = {}; for (const [k, s] of Object.entries(row)) { if (!editable(k) || skip.includes(k)) continue; const v = cellValue(s); if (v !== undefined) o[k] = v; } return o; };
const errors = [];
const need = (cond, msg) => { if (!cond) errors.push(msg); };

const towers = {};
for (const r of read('towers')) {
  const o = obj(r, ['id']); const t = { power: o.power, rate: o.rate ?? null, rangeTiles: o.rangeTiles ?? null, params: {}, battleUpgrades: [], cardUpgrades: [] };
  for (const [k, v] of Object.entries(o)) if (k.startsWith('p.')) t.params[k.slice(2)] = v;
  need(typeof t.power === 'number' || (t.power === null && r.id === 'tractor'), `towers: ${r.id} power must be a number`); // v0.6: the Tractor lifts (no power)
  towers[r.id] = t;
}
const steps = (file, levelCol, valueCol, key) => {
  for (const r of read(file)) {
    const t = towers[r.tower]; need(t, `${file}: unknown tower "${r.tower}"`); if (!t) continue;
    const i = Number(r[levelCol]) - 2; need(Number.isInteger(i) && i >= 0, `${file}: bad ${levelCol} "${r[levelCol]}"`);
    const v = cellValue(r[valueCol]); need(typeof v === 'number', `${file}: ${r.tower} ${levelCol} ${r[levelCol]} ${r.stat}: value must be a number`);
    (t[key][i] ||= {})[r.stat.trim()] = v;
  }
};
steps('tower_upgrades', 'battleLevel', 'multiplier', 'battleUpgrades');
steps('card_upgrades', 'cardLevel', 'value', 'cardUpgrades');
for (const [id, t] of Object.entries(towers)) {
  need(t.battleUpgrades.length === 5 && t.battleUpgrades.every(Boolean), `tower_upgrades: ${id} needs battle levels 2..6 (v0.6: five in-battle upgrades)`);
  need(t.cardUpgrades.length === 9 && t.cardUpgrades.every(Boolean), `card_upgrades: ${id} needs card levels 2..10 (one or more rows each)`);
}
const ants = {}; for (const r of read('ants')) ants[r.id] = obj(r, ['id']);
const antSizes = {}; for (const r of read('ant_sizes')) antSizes[r.size] = cellValue(r.scale);
const queenTraitMods = {}; for (const r of read('queen_traits')) queenTraitMods[r.trait] = cellValue(r.takeMod);
const worlds = read('worlds').map((r) => ({ id: cellValue(r.id), ...obj(r, ['id']) }));
const levels = read('levels').map((r) => obj(r, ['level']));
const maps = {}; for (const r of read('maps')) maps[r.id] = obj(r, ['id']);
for (const [id, a] of Object.entries(ants)) need(antSizes[a.size] !== undefined, `ants: ${id} has unknown size "${a.size}"`);
levels.forEach((L, i) => { need(maps[L.map], `levels: level ${i + 1} uses unknown map "${L.map}"`); for (const m of L.mix || []) need(ants[m.type], `levels: level ${i + 1} mix has unknown ant "${m.type}"`); });
if (errors.length) { console.error('Not written - fix these first:\n  ' + errors.join('\n  ')); process.exit(1); }

const outJ = { _about: T._about, _units: T._units, shop: T.shop, queenTraitMods, antSizes, towers, ants, worlds, levels, maps };
for (const k of Object.keys(outJ)) if (outJ[k] === undefined) delete outJ[k];
writeFileSync(outPath, prettyJson(outJ) + '\n');
console.log(`wrote ${outPath}: ${Object.keys(towers).length} towers, ${Object.keys(ants).length} ants, ${worlds.length} worlds, ${levels.length} levels, ${Object.keys(maps).length} maps`);
