// Wave / ant counts per stage, before (v0.3.0 vc7 backup) and after (current src). `node tools/wave-report.mjs [--json]`
import * as Cn from '../src/config.js';
import { generateWaves as genNew } from '../src/sim.js';
const OLD = new URL('../../backup-v0.3.0-vc7/src/', import.meta.url);
const Co = await import(new URL('config.js', OLD)); const { generateWaves: genOld } = await import(new URL('sim.js', OLD));
const rows = Cn.LEVELS.map((L, i) => {
  const wo = genOld(i), wn = genNew(i);
  const types = (w) => [...new Set(w.flat().map((e) => e.type))];
  const no = wo.flat().length, nn = wn.flat().length;
  return { level: i + 1, name: L.name, wavesBefore: wo.length, wavesAfter: wn.length, waveCut: `${Math.round((1 - wn.length / wo.length) * 100)}%`,
    antsBefore: no, antsAfter: nn, antRatio: +(nn / no).toFixed(2), typesBefore: types(wo).length, typesAfter: types(wn).length, typesNow: types(wn).join(',') };
});
console.table(rows);
if (process.argv.includes('--json')) console.log(JSON.stringify(rows));
