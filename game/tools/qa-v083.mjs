// v0.8.3 QA suite (aggregates the qa-v082 tools + the qa-v083 lints). usage: node tools/qa-v083.mjs  (needs `node tools/build.mjs` -> www-test). exit 1 on any FAIL.
import { spawnSync } from 'node:child_process'; import fs from 'node:fs';
const T = new URL('./qa-v082/', import.meta.url).pathname, T3 = new URL('./qa-v083/', import.meta.url).pathname; const OUT = process.env.QA_OUT || '/workspace/ant-td/qa/v0.8.3/suites'; fs.mkdirSync(OUT, { recursive: true });
let fails = 0, warns = 0; const ok = (c, m, detail) => { console.log(`${c ? 'PASS' : 'FAIL'} ${m}`); if (!c) { fails++; if (detail) console.log('   failing value: ' + String(detail).trim().split('\n').filter((l) => /FAIL|overflow|<\s*12|small|\d/.test(l)).slice(-6).join(' | ').slice(0, 900)); } }; // v0.8.2 R1: a failing check prints its value
// v0.8.2 R1: every numeric floor/ceiling also has a WARN band of 0.01: a value that passes but is within 0.01 of its limit prints 'WARN <name> within 0.01 of <limit>' and is counted in the summary
const WARNS = [];
const num = (name, v, lim, kind, label) => { const pass = kind === 'min' ? v >= lim : v <= lim; ok(pass, `${label} (value ${v}, limit ${lim})`); if (pass && Math.abs(v - lim) <= 0.01 + 1e-9) { warns++; WARNS.push(`${name} ${v} within 0.01 of ${lim}`); console.log(`WARN ${name} within 0.01 of ${lim} (value ${v})`); } };
const run = (f, args = []) => spawnSync('node', [T + f, ...args], { encoding: 'utf8', timeout: 600000 });
// 1. text >= 12 px on every screen (default + Roboto metrics); an injected 11 px string must fail the scan
let r = run('text-scan.mjs', [`${OUT}/qa83-text-scan.json`]); ok(r.status === 0, 'text-scan: no fillText < 12 px, no fit overflow, Lilita share <= 30%', r.stdout + r.stderr);
r = run('text-scan.mjs', ['--roboto', `${OUT}/qa83-text-scan-roboto.json`]); ok(r.status === 0, 'text-scan with Roboto metrics: no overflow', r.stdout + r.stderr);
r = run('text-scan.mjs', ['--inject', `${OUT}/qa83-text-scan-inject.json`]); ok(r.status !== 0, 'text-scan FAILS on an injected 11 px string (the gate works)');
// 2. tap targets >= 44 logical px
r = run('small-targets.mjs'); ok(r.status === 0 && /PASS/.test(r.stdout), 'small-targets: no tap target < 44 px', r.stdout + r.stderr);
r = run('plate-edge.mjs', [`${OUT}/qa83-plate-edge.json`]); ok(r.status === 0, 'plate-edge: no plate outline/shadow edge crosses a ground-sample tile centre with a pair > 1.356 (all maps)', r.stdout + r.stderr);
// 3. contrast on the rendered baked maps vs the v0.8.0 baseline (no map's A1/A2 down by > 0.03; A3 <= 1.12; A5 >= 1.40; A7 unchanged)
r = run('contrast.mjs', [`${OUT}/qa83-contrast.json`]); ok(r.status === 0, 'contrast.mjs ran: ' + r.stdout.split('\n')[0]);
const cur = JSON.parse(fs.readFileSync(`${OUT}/qa83-contrast.json`, 'utf8')), base = JSON.parse(fs.readFileSync(T + 'baseline/contrast-v080.json', 'utf8'));
ok(cur.length >= base.length, `contrast: ${cur.length} maps measured (baseline ${base.length})`);
const mn = (k) => Math.min(...cur.map((c) => c[k])), mx = (k) => Math.max(...cur.map((c) => c[k]));
num('A1', mn('A1'), 1.52, 'min', 'A1 >= 1.52 on all maps (v0.8.3 F6)'); num('A2', mn('A2'), 1.30, 'min', 'A2 >= 1.30 on all maps (v0.8.3 F6)');
num('A3', mx('A3'), 1.12, 'max', 'A3 (Lumi) <= 1.12'); num('A3r', mx('A3r'), 1.33, 'max', 'A3r (adjacent-tile variant) <= 1.33 (v0.8.3 F6)');
num('A5', mn('A5r'), 1.40, 'min', 'A5 small ant (rendered) >= 1.40'); ok(mn('A7e') >= 1.8 && mn('A7l') >= 1.7, `A7 edge/lip (min ${mn('A7e')} / ${mn('A7l')})`);
// R8: A10b pad vs ground (colour level) >= 1.6; the report names every map that fails
{ const bad = cur.filter((c) => c.A10b < 1.6).map((c) => `L${c.li + 1}=${c.A10b}`); console.log(`A10b pad-vs-ground (colour level, floor 1.6): min ${mn('A10b')}${bad.length ? ' - BELOW 1.6 on: ' + bad.join(' ') : ' - all maps >= 1.6'}`); if (mn('A10b') >= 1.6 && mn('A10b') <= 1.61) { warns++; WARNS.push(`A10b ${mn('A10b')} within 0.01 of 1.6`); console.log(`WARN A10b within 0.01 of 1.6 (value ${mn('A10b')})`); } ok(bad.length === 0 || process.env.A10B_INFO === '1', `A10b >= 1.6 on every map${bad.length ? ' (FAILS on ' + bad.length + ' maps; informational when A10B_INFO=1)' : ''}`); }
ok(cur.length >= 50 && cur.every((c) => c.li !== undefined && c.A1 !== undefined && c.A2 !== undefined && c.A3 !== undefined), `contrast.json has per-map A1/A2/A3 rows for all ${cur.length} maps (R11)`);
let worst = 0; for (const b of base) { const c = cur.find((x) => x.li === b.li); if (c) worst = Math.max(worst, b.A1 - c.A1, b.A2 - c.A2); } ok(worst <= 0.03, `no map's A1/A2 below its v0.8.0 value by > 0.03 (worst drop ${worst.toFixed(3)})`);

// ---- v0.8.3 additions ----
// F9 A10r: rendered pad vs mean ground >= 1.35 on every map (per-map rows are in contrast.json: A10r); negative control: wash 0.06 must fail it
num('A10r', mn('A10r'), 1.35, 'min', 'A10r rendered pad vs mean ground >= 1.35 (F9)'); { const bad = cur.filter((c) => c.A10r < 1.35).map((c) => `L${c.li + 1}=${c.A10r}`); console.log(`A10r: min ${mn('A10r')}${bad.length ? ' - BELOW 1.35 on: ' + bad.join(' ') : ' - all maps >= 1.35'}`); }
{ const rr = spawnSync('node', [T + 'contrast.mjs', `${OUT}/qa83-contrast-wash06.json`], { encoding: 'utf8', timeout: 600000, env: { ...process.env, QA_WASH: '0.06' } }); const w6 = JSON.parse(fs.readFileSync(`${OUT}/qa83-contrast-wash06.json`, 'utf8')); const m6 = Math.min(...w6.map((c) => c.A10r)); ok(m6 < 1.35, `A10r NEGATIVE CONTROL: a 0.06 wash fails the A10r floor (min ${m6})`); }
// per-map art ledger (every map >= -0.010 vs v0.8.0 on A1 and A2; the 0.03 anchor stays absolute)
r = spawnSync('node', [T3 + 'ledger.mjs', `${OUT}/qa83-contrast.json`, '/workspace/ant-td/qa/v0.8.3/art-ledger.json', '-0.010'], { encoding: 'utf8' }); ok(r.status === 0, 'art ledger: every map >= -0.010 on dA1 and dA2 vs v0.8.0 - ' + r.stdout.trim(), r.stdout);
// F3 pad-distinct lint (+ negative control), F10 plate lint (+ negative control)
r = spawnSync('node', [T3 + 'pad-distinct.mjs'], { encoding: 'utf8' }); ok(r.status === 0, 'pad-distinct: ' + r.stdout.trim(), r.stdout); r = spawnSync('node', [T3 + 'pad-distinct.mjs', '--inject'], { encoding: 'utf8' }); ok(r.status !== 0, 'pad-distinct FAILS with the old "Lime" skin injected (the gate works)');
r = spawnSync('node', [T3 + 'plate-lint.mjs'], { encoding: 'utf8' }); ok(r.status === 0, 'plate-lint: ' + r.stdout.trim(), r.stdout); r = spawnSync('node', [T3 + 'plate-lint.mjs', '--inject'], { encoding: 'utf8' }); ok(r.status !== 0, 'plate-lint FAILS with the v0.8.2 L58 override re-added (the gate works)');
// F8 Ant Book labels: every one of the 22 ants' labels inside its card by >= 3 px at 360 / 393 / 412 wide viewports (measureText, 12 px floor)
r = spawnSync('node', [T3 + 'shots-p1.mjs', `${OUT}/qa83-shots`], { encoding: 'utf8', timeout: 600000 }); { const sh = JSON.parse(fs.readFileSync(`${OUT}/qa83-shots/p1-shots.json`, 'utf8')); for (const W of [360, 393, 412]) { const L = sh['labels' + W] || []; const bad = L.filter(([, , wd, cw]) => cw - wd < 6); const ants = new Set(L.map((x) => x[0])); ok(ants.size === 22 && bad.length === 0, `F8 Ant Book at ${W}: ${ants.size} ants, ${L.length} label lines, narrowest margin ${(Math.min(...L.map(([, , wd, cw]) => (cw - wd) / 2 * W / 400))).toFixed(1)} css px (>= 3)`, JSON.stringify(bad)); ok(Math.min(...L.map(([, , wd, cw]) => (cw - wd) / 2 * W / 400)) >= 3, `F8 ${W}: every label >= 3 css px inside the card`); } }
ok(cur[0].A4.every((v) => v >= 1.30), `A4 ladder steps ${cur[0].A4.join(' / ')} >= 1.30`);
console.log(`\nWARN summary: ${warns ? WARNS.join('; ') : 'none'}`); fs.writeFileSync(`${OUT}/qa83-warns.json`, JSON.stringify(WARNS));
console.log(fails ? `\n${fails} FAIL` : '\nALL PASS'); process.exit(fails ? 1 : 0);
