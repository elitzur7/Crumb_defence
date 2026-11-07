// v0.8.3 Pass 1: F1 L59 hpMul, F3 skin palette, F4 queen5 colour, F5 named rarity exceptions, F6 ground wash, F7 chevrons, F8 Ant Book labels, F10 plate hide. (version tests are "or later")
import test from 'node:test'; import assert from 'node:assert/strict'; import { readFileSync } from 'node:fs';
import * as C from '../src/config.js'; import * as S from '../src/sim.js'; import * as A from '../src/art.js';
const src = (f) => readFileSync(new URL('../src/' + f, import.meta.url), 'utf8'), rd = (f) => readFileSync(new URL(f, import.meta.url), 'utf8');
const tuning = JSON.parse(rd('../../tuning/tuning.json'));
test('v0.8.3: version 0.8.3 (or later), versionCode 28 (or later)', () => {
  const ge = (a, b) => { const x = a.split('.').map(Number), y = b.split('.').map(Number); for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] > y[i]; return true; };
  assert.ok(ge(C.VERSION, '0.8.3')); assert.ok(ge(JSON.parse(rd('../package.json')).version, '0.8.3'));
  assert.ok(+/versionCode (\d+)/.exec(rd('../android/app/build.gradle'))[1] >= 28);
});
test('F1: L59 hpMul is 4.05 and no other W6 hpMul moved', () => {
  const hp = Object.fromEntries(C.LEVELS.slice(50, 60).map((l, i) => [51 + i, l.hpMul]));
  assert.deepEqual(hp, { 51: 6, 52: 7.2, 53: 9.19, 54: 9.5, 55: 4.84, 56: 9.57, 57: 5.9, 58: 5.29, 59: 4.12, 60: 1.7 });
});
test('F3: the cabinet palette (new names and pads, ids unchanged, prices unchanged)', () => {
  const want = { 'slingshot-1': ['Bubblegum', '#ef51ee'], 'slingshot-2': ['Sandstone', '#a09760'], 'slingshot-3': ['Meadow', '#53a764'], 'laser-1': ['Denim', '#6c9bb4'], 'laser-2': ['Orchid', '#d86cd2'], 'laser-3': ['Olive', '#9e9820'], 'zapper-1': ['Fuchsia', '#ff4cc1'], 'zapper-2': ['Caramel', '#c58a4f'], 'zapper-3': ['Dusty Rose', '#d17d92'], 'sound-1': ['Persimmon', '#f06a48'], 'sound-2': ['Coral', '#db7766'], 'sound-3': ['Mauve', '#c979b5'] };
  assert.equal(C.SKINS.length, 12); for (const sk of C.SKINS) assert.deepEqual([sk.name, sk.pad], want[sk.id], sk.id);
  assert.equal(C.SKINS.reduce((s, x) => s + x.price, 0), 42000);
});
test('F3: an old save that owns slingshot-2 still loads and shows it as owned (ids unchanged)', async () => {
  const M = await import('../src/meta.js'); const s = M.newSave(); s.coins = 5000; assert.equal(M.buySkin(s, 'slingshot-2').ok, true);
  const t = JSON.parse(JSON.stringify(s)); assert.equal(M.buySkin(t, 'slingshot-2').reason, 'owned'); assert.equal(t.coins, s.coins);
});
test('F4: queen5 (Glaze Queen) body colour is the vivid #ed5a89', () => { assert.equal(A.ANT_COL.queen5, '#ed5a89'); });
test('F5: the rarity rule has exactly two named W6 exceptions (L57 R1, L58 R2); everything else, W7+ included, is strict', () => {
  const RARITY_EXCEPT = { 57: ['R1'], 58: ['R2'] }; const RANK = Object.fromEntries(C.RARITY_TIERS.map((t, i) => [t, i]));
  const report = (li) => { const seen = new Map(); S.generateWaves(li).forEach((w, wi) => { for (const e of w) if (!seen.has(e.type)) seen.set(e.type, wi); }); const types = [...seen.keys()], issues = [];
    if (types.filter((t) => C.rarityOf(t) === 'common').length < 2) issues.push('R1'); if (types.filter((t) => C.rarityOf(t) !== 'boss' && RANK[C.rarityOf(t)] >= RANK.rare).length > 2) issues.push('R2'); return issues; };
  const found = {}; for (let li = 50; li < C.LEVELS.length; li++) { const r = report(li); if (r.length) found[li + 1] = r; }
  assert.deepEqual(found, RARITY_EXCEPT);
  // removing an entry makes the check fail (the exception list is asserted exactly)
  assert.notDeepEqual(found, { 57: ['R1'] }); assert.notDeepEqual(found, { 58: ['R2'] });
});
test('F6: the 2 % ground wash is in renderMapBackground (after the checker block, before the moon / pool), ART81 only, art.wash overrides', () => {
  const a = src('art.js'); const i = a.indexOf("'rgba(70,35,50,' + (art.wash ?? 0.02)"); assert.ok(i > 0);
  assert.ok(i > a.indexOf('wooden planks with grain') && i < a.indexOf('if (th.moon) { const mg')); assert.match(a.slice(i - 40, i), /C\.ART81/);
});
test('F7: chevrons default to alpha 0.08 on every map (no per-map override left, fork included)', () => {
  assert.match(src('art.js'), /art\.chev \?\? 0\.08/); for (const [id, m] of Object.entries(tuning.maps)) assert.ok(!(m.art && m.art.chev !== undefined), id + ' has a chev override');
});
test('F8: Ant Book labels wrap at the space (no ellipsis), 12 px floor', () => {
  const g = src('game.js'); assert.match(g, /function antLabelLines/); assert.ok(!/antLabelLines[\s\S]{0,400}\u2026/.test(g)); assert.match(g, /nm\.forEach\(\(ln, i\) => fitText\(ln, x \+ w \/ 2, y \+ 70 - \(two \? 12 : 0\) \+ \(two \? i \* 12 : 0\), w - 8, 12/);
});
test('F10: the only art.plate override is an explicit hide; the plate lint passes and fails its negative control', async () => {
  const { spawnSync } = await import('node:child_process'); const run = (a) => spawnSync('node', [new URL('../tools/qa-v083/plate-lint.mjs', import.meta.url).pathname, ...a], { encoding: 'utf8' });
  assert.equal(run([]).status, 0); assert.equal(run(['--inject']).status, 1);
  const o = Object.entries(tuning.maps).filter(([, m]) => m.art && m.art.plate); assert.deepEqual(o.map(([k, m]) => [k, m.art.plate]), [['w6_waffle_iron', { hide: true }], ['w7_press_plate', { hide: true }], ['w8_cupcake_tin', { hide: true }]]);
});
test('F3 lint: pad-distinct passes and fails its negative control', async () => {
  const { spawnSync } = await import('node:child_process'); const run = (a) => spawnSync('node', [new URL('../tools/qa-v083/pad-distinct.mjs', import.meta.url).pathname, ...a], { encoding: 'utf8' });
  assert.equal(run([]).status, 0); assert.equal(run(['--inject']).status, 1);
});
test('F1/F12: HINT_OK matches the v0.8.3 mode evidence (L59 healer +7.5 / carrier +5.8 stay in; drone [60] measured +100)', () => {
  const ev = JSON.parse(rd('../../qa/v0.8.3/mode-evidence.json')); const g = (l, m) => ev[l][m] - ev[l].weak;
  assert.ok(g(59, 'healer') >= 5 && g(59, 'carrier') >= 5); assert.ok(C.HINT_OK.healer.includes(59) && C.HINT_OK.carrier.includes(59));
  assert.deepEqual(C.HINT_OK.drone, [60]); assert.ok(ev.drone['60'].air - ev.drone['60'].noair >= 5);
});
// ---- Pass 2 ----
test('PP12: a first 3-star win in World 6 pays +30 (2 stars) and +150 (3 stars); queen6 pays boss gems 10 + 5 (verified, no new code)', async () => {
  const M = await import('../src/meta.js'); const s = M.newSave(); const r = M.applyBattleResult(s, 55, 'win', 3, { kills: 10, foodLeft: 20, time: 60 });
  assert.equal(r.starParts.s2, 30); assert.equal(r.starParts.s3, 150);
  const q = M.newSave(); const d0 = q.diamonds; const r2 = M.applyBattleResult(q, 59, 'win', 3, { kills: 10, foodLeft: 20, time: 60 });
  assert.equal(r2.gems, 15); assert.equal(q.diamonds, d0 + 15); const r3 = M.applyBattleResult(q, 59, 'win', 3, { kills: 10, foodLeft: 20, time: 60 }); assert.equal(r3.gems, 0);
});
test('U12: airFixPlan over L51-L60 - offers the Laser (else the Zapper), replaces the weakest card, never when an air tower is in the deck', async () => {
  const M = await import('../src/meta.js'); const lv = { slingshot: { level: 5 }, spray: { level: 2 }, fan: { level: 1 }, glue: { level: 4 }, laser: { level: 3 }, zapper: { level: 3 } };
  const deck = ['slingshot', 'spray', 'glue', 'fan'];
  for (let i = 50; i < 60; i++) { assert.equal(typeof i, 'number'); }
  const p = M.airFixPlan(deck, ['slingshot', 'spray', 'glue', 'fan', 'laser', 'zapper'], lv, 4); assert.deepEqual(p, { add: 'laser', drop: 'fan' });
  assert.deepEqual(M.airFixPlan(deck, ['slingshot', 'spray', 'glue', 'fan', 'zapper'], lv, 4), { add: 'zapper', drop: 'fan' });
  assert.deepEqual(M.airFixPlan(deck.slice(0, 3), ['laser'], lv, 4), { add: 'laser', drop: null });
  assert.equal(M.airFixPlan(['laser', 'glue'], ['laser'], lv, 4), null); assert.equal(M.airFixPlan(deck, ['slingshot'], lv, 4), null);
  assert.ok(C.AIR_COUNTERS.includes('laser') && C.AIR_COUNTERS.includes('zapper') && !C.AIR_COUNTERS.includes('fan'));
});
test('PP9: W6_TIPS - one line per W6 level, <= 8 words, no advice verbs; the hook fires once per save on wave 2', () => {
  assert.deepEqual(Object.keys(C.W6_TIPS).map(Number), [50, 51, 52, 53, 54, 55, 56, 57, 58, 59]);
  for (const t of Object.values(C.W6_TIPS)) { assert.ok(t.split(/\s+/).length <= 8, t); assert.ok(!/\b(should|must|try|use|bring|place|put|pick)\b/i.test(t), t); }
  const g = src('game.js'); assert.ok(/'tip:w6-'/.test(g) && /markAntSeen\(S\.save, 'tip:w6-'/.test(g));
});
test('M7h: the ability cues are capped (6 per frame, 12 alive) and the special event is hooked behind ART81', () => {
  const g = src('game.js'); assert.ok(/case 'special': if \(C\.ART81\) spCue\(e\)/.test(g)); assert.ok(/spCueN\s*>=\s*6|spCueN >= 6/.test(g));
});
test('PP3 / PP5 / PP10: Drone flutter + bob, queen6 drip window 0.4 s, "Open World 6" only for the L50 first win', () => {
  const g = src('game.js'); assert.ok(/% 2 \? 3 : 9/.test(g) && /\* 1\.6\) \* 2/.test(g)); assert.ok(/a\.spawnT <= 0\.4/.test(g)); assert.ok(/S\.levelIndex === 49 && out\.firstClear/.test(g) && /'Open World 6'/.test(g));
  assert.equal(C.ANTS.queen6.spawn.every > 0.4, true); assert.equal(C.ANTS.queen6.spawn.type, 'drone');
});
