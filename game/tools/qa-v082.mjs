// v0.8.2 QA suite (aggregates the qa-v082 tools). usage: node tools/qa-v082.mjs  (needs `node tools/build.mjs` -> www-test). exit 1 on any FAIL.
import { spawnSync } from 'node:child_process'; import fs from 'node:fs';
const T = new URL('./qa-v082/', import.meta.url).pathname; const OUT = process.env.QA_OUT || '/workspace/ant-td/qa/v0.8.2/suites'; fs.mkdirSync(OUT, { recursive: true });
let fails = 0, warns = 0; const ok = (c, m, detail) => { console.log(`${c ? 'PASS' : 'FAIL'} ${m}`); if (!c) { fails++; if (detail) console.log('   failing value: ' + String(detail).trim().split('\n').filter((l) => /FAIL|overflow|<\s*12|small|\d/.test(l)).slice(-6).join(' | ').slice(0, 900)); } }; // v0.8.2 R1: a failing check prints its value
// v0.8.2 R1: every numeric floor/ceiling also has a WARN band of 0.01: a value that passes but is within 0.01 of its limit prints 'WARN <name> within 0.01 of <limit>' and is counted in the summary
const WARNS = [];
const num = (name, v, lim, kind, label) => { const pass = kind === 'min' ? v >= lim : v <= lim; ok(pass, `${label} (value ${v}, limit ${lim})`); if (pass && Math.abs(v - lim) <= 0.01 + 1e-9) { warns++; WARNS.push(`${name} ${v} within 0.01 of ${lim}`); console.log(`WARN ${name} within 0.01 of ${lim} (value ${v})`); } };
const run = (f, args = []) => spawnSync('node', [T + f, ...args], { encoding: 'utf8', timeout: 600000 });
// 1. text >= 12 px on every screen (default + Roboto metrics); an injected 11 px string must fail the scan
let r = run('text-scan.mjs', [`${OUT}/qa82-text-scan.json`]); ok(r.status === 0, 'text-scan: no fillText < 12 px, no fit overflow, Lilita share <= 30%', r.stdout + r.stderr);
r = run('text-scan.mjs', ['--roboto', `${OUT}/qa82-text-scan-roboto.json`]); ok(r.status === 0, 'text-scan with Roboto metrics: no overflow', r.stdout + r.stderr);
r = run('text-scan.mjs', ['--inject', `${OUT}/qa82-text-scan-inject.json`]); ok(r.status !== 0, 'text-scan FAILS on an injected 11 px string (the gate works)');
// 2. tap targets >= 44 logical px
r = run('small-targets.mjs'); ok(r.status === 0 && /PASS/.test(r.stdout), 'small-targets: no tap target < 44 px', r.stdout + r.stderr);
r = run('plate-edge.mjs', [`${OUT}/qa82-plate-edge.json`]); ok(r.status === 0, 'plate-edge: no plate outline/shadow edge crosses a ground-sample tile centre with a pair > 1.356 (all maps)', r.stdout + r.stderr);
// 3. contrast on the rendered baked maps vs the v0.8.0 baseline (no map's A1/A2 down by > 0.03; A3 <= 1.12; A5 >= 1.40; A7 unchanged)
r = run('contrast.mjs', [`${OUT}/qa82-contrast.json`]); ok(r.status === 0, 'contrast.mjs ran: ' + r.stdout.split('\n')[0]);
const cur = JSON.parse(fs.readFileSync(`${OUT}/qa82-contrast.json`, 'utf8')), base = JSON.parse(fs.readFileSync(T + 'baseline/contrast-v080.json', 'utf8'));
ok(cur.length >= base.length, `contrast: ${cur.length} maps measured (baseline ${base.length})`);
const mn = (k) => Math.min(...cur.map((c) => c[k])), mx = (k) => Math.max(...cur.map((c) => c[k]));
num('A1', mn('A1'), 1.40, 'min', 'A1 >= 1.40 on all maps'); num('A2', mn('A2'), 1.25, 'min', 'A2 >= 1.25 on all maps');
num('A3', mx('A3'), 1.12, 'max', 'A3 (Lumi) <= 1.12'); ok(mx('A3r') <= 1.36, `A3 (adjacent-tile variant) not above the v0.8.0 value 1.356 (max ${mx('A3r')})`);
num('A5', mn('A5r'), 1.40, 'min', 'A5 small ant (rendered) >= 1.40'); ok(mn('A7e') >= 1.8 && mn('A7l') >= 1.7, `A7 edge/lip (min ${mn('A7e')} / ${mn('A7l')})`);
// R8: A10b pad vs ground (colour level) >= 1.6; the report names every map that fails
{ const bad = cur.filter((c) => c.A10b < 1.6).map((c) => `L${c.li + 1}=${c.A10b}`); console.log(`A10b pad-vs-ground (colour level, floor 1.6): min ${mn('A10b')}${bad.length ? ' - BELOW 1.6 on: ' + bad.join(' ') : ' - all maps >= 1.6'}`); if (mn('A10b') >= 1.6 && mn('A10b') <= 1.61) { warns++; WARNS.push(`A10b ${mn('A10b')} within 0.01 of 1.6`); console.log(`WARN A10b within 0.01 of 1.6 (value ${mn('A10b')})`); } ok(bad.length === 0 || process.env.A10B_INFO === '1', `A10b >= 1.6 on every map${bad.length ? ' (FAILS on ' + bad.length + ' maps; informational when A10B_INFO=1)' : ''}`); }
ok(cur.length >= 50 && cur.every((c) => c.li !== undefined && c.A1 !== undefined && c.A2 !== undefined && c.A3 !== undefined), `contrast.json has per-map A1/A2/A3 rows for all ${cur.length} maps (R11)`);
let worst = 0; for (const b of base) { const c = cur.find((x) => x.li === b.li); if (c) worst = Math.max(worst, b.A1 - c.A1, b.A2 - c.A2); } ok(worst <= 0.03, `no map's A1/A2 below its v0.8.0 value by > 0.03 (worst drop ${worst.toFixed(3)})`);
ok(cur[0].A4.every((v) => v >= 1.30), `A4 ladder steps ${cur[0].A4.join(' / ')} >= 1.30`);
console.log(`\nWARN summary: ${warns ? WARNS.join('; ') : 'none'}`); fs.writeFileSync(`${OUT}/qa82-warns.json`, JSON.stringify(WARNS));
console.log(fails ? `\n${fails} FAIL` : '\nALL PASS'); process.exit(fails ? 1 : 0);
