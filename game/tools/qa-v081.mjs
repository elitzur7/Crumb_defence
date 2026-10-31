// v0.8.1 QA suite (aggregates the qa-v081 tools). usage: node tools/qa-v081.mjs  (needs `node tools/build.mjs` -> www-test). exit 1 on any FAIL.
import { spawnSync } from 'node:child_process'; import fs from 'node:fs';
const T = new URL('./qa-v081/', import.meta.url).pathname; const OUT = process.env.QA_OUT || '/workspace/ant-td/qa/v0.8.1/suites'; fs.mkdirSync(OUT, { recursive: true });
let fails = 0; const ok = (c, m) => { console.log(`${c ? 'PASS' : 'FAIL'} ${m}`); if (!c) fails++; };
const run = (f, args = []) => spawnSync('node', [T + f, ...args], { encoding: 'utf8', timeout: 600000 });
// 1. text >= 12 px on every screen (default + Roboto metrics); an injected 11 px string must fail the scan
let r = run('text-scan.mjs', [`${OUT}/qa81-text-scan.json`]); ok(r.status === 0, 'text-scan: no fillText < 12 px, no fit overflow, Lilita share <= 30%');
r = run('text-scan.mjs', ['--roboto', `${OUT}/qa81-text-scan-roboto.json`]); ok(r.status === 0, 'text-scan with Roboto metrics: no overflow');
r = run('text-scan.mjs', ['--inject', `${OUT}/qa81-text-scan-inject.json`]); ok(r.status !== 0, 'text-scan FAILS on an injected 11 px string (the gate works)');
// 2. tap targets >= 44 logical px
r = run('small-targets.mjs'); ok(r.status === 0 && /PASS/.test(r.stdout), 'small-targets: no tap target < 44 px');
// 3. contrast on the rendered baked maps vs the v0.8.0 baseline (no map's A1/A2 down by > 0.03; A3 <= 1.12; A5 >= 1.40; A7 unchanged)
r = run('contrast.mjs', [`${OUT}/qa81-contrast.json`]); ok(r.status === 0, 'contrast.mjs ran: ' + r.stdout.split('\n')[0]);
const cur = JSON.parse(fs.readFileSync(`${OUT}/qa81-contrast.json`, 'utf8')), base = JSON.parse(fs.readFileSync(T + 'baseline/contrast-v080.json', 'utf8'));
ok(cur.length >= base.length, `contrast: ${cur.length} maps measured (baseline ${base.length})`);
const mn = (k) => Math.min(...cur.map((c) => c[k])), mx = (k) => Math.max(...cur.map((c) => c[k]));
ok(mn('A1') >= 1.40, `A1 >= 1.40 on all maps (min ${mn('A1')})`); ok(mn('A2') >= 1.25, `A2 >= 1.25 (min ${mn('A2')})`);
ok(mx('A3') <= 1.12, `A3 (Lumi) <= 1.12 (max ${mx('A3')})`); ok(mx('A3r') <= 1.36, `A3 (adjacent-tile variant) not above the v0.8.0 value 1.356 (max ${mx('A3r')})`);
ok(mn('A5r') >= 1.40, `A5 small ant (rendered) >= 1.40 (min ${mn('A5r')})`); ok(mn('A7e') >= 1.8 && mn('A7l') >= 1.7, `A7 edge/lip (min ${mn('A7e')} / ${mn('A7l')})`);
let worst = 0; for (const b of base) { const c = cur.find((x) => x.li === b.li); if (c) worst = Math.max(worst, b.A1 - c.A1, b.A2 - c.A2); } ok(worst <= 0.03, `no map's A1/A2 below its v0.8.0 value by > 0.03 (worst drop ${worst.toFixed(3)})`);
ok(cur[0].A4.every((v) => v >= 1.30), `A4 ladder steps ${cur[0].A4.join(' / ')} >= 1.30`);
console.log(fails ? `\n${fails} FAIL` : '\nALL PASS'); process.exit(fails ? 1 : 0);
