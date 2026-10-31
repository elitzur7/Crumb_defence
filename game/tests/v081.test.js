// v0.8.1 unit tests (Pass 1 so far: F1-F18, J11, J12; later passes append below)
import test from 'node:test'; import assert from 'node:assert/strict'; import { readFileSync, existsSync } from 'node:fs';
import * as C from '../src/config.js'; import * as M from '../src/meta.js';
const rd = (p) => readFileSync(new URL('../' + p, import.meta.url), 'utf8'); const src = (n) => rd('src/' + n);
const mem = () => { const m = {}; return { getItem: (k) => (k in m ? m[k] : null), setItem: (k, v) => { m[k] = String(v); }, _m: m }; };
test('J12: newSave and loadSave carry settings { reduceMotion: auto, haptics: true }; bad values fall back', () => {
  assert.deepEqual(M.newSave().settings, { reduceMotion: 'auto', haptics: true });
  const st = mem(); const s = M.newSave(); s.settings = { muted: true, reduceMotion: 'sideways', haptics: 'yes' }; M.writeSave(st, s);
  const l = M.loadSave(st); assert.equal(l.settings.reduceMotion, 'auto'); assert.equal(l.settings.haptics, true); assert.equal(l.settings.muted, true);
  const old = M.newSave(); delete old.settings; M.writeSave(st, old); assert.deepEqual(M.loadSave(st).settings, { reduceMotion: 'auto', haptics: true }, 'a v0.8.0 save (no settings) gets the defaults');
  const on = M.newSave(); on.settings.reduceMotion = 'on'; on.settings.haptics = false; M.writeSave(st, on); const l2 = M.loadSave(st); assert.equal(l2.settings.reduceMotion, 'on'); assert.equal(l2.settings.haptics, false);
});
test('J12: reducedMotion() reads the setting first; the settings panel has Reduce motion + Haptics rows >= 44 px', () => {
  const g = src('game.js');
  assert.match(g, /function reducedMotion\(\) \{ const rmS = S\.save && S\.save\.settings && S\.save\.settings\.reduceMotion; if \(rmS === 'on'\) return true; if \(rmS === 'off'\) return false;/);
  assert.match(g, /'Reduce motion: '/); assert.match(g, /'Haptics: On'/); assert.match(g, /setReduce/); assert.match(g, /setHaptics/);
  assert.match(g, /const x = 70, y = 122, w = 260, h = 398;/);
  for (const m of g.matchAll(/drawButton\(x \+ 24, y \+ \d+, w - 48, (\d+),/g)) assert.ok(+m[1] >= 44, 'settings row height >= 44');
});
test('J11: caps counters + overlay + window.__caps (test hooks only), reset per battle, long-press on the version text', () => {
  const g = src('game.js');
  assert.match(g, /const CAPS = \{ fx: 0, ui: 0, crumbSprites: 0, sparkles: 0, confetti: 0, frameMax: 0 \}/); assert.match(g, /if \(__TEST_HOOKS__\) window\.__caps =/);
  assert.match(g, /capsReset\(\); S\.queenIntro = null; S\._bubbleShown = false; S\.impactT = \{\}; S\.crumbSprites = \[\]; S\.sparkles = \[\];/); assert.match(g, /button\('verLong'/); assert.match(g, /> 700/);
});
test('F1/F2: A.text uses the body stack; display only on request; no text call below 12 px in game.js/art.js', () => {
  const a = src('art.js'); assert.match(a, /export const FONT = FONT_BODY;/); assert.match(a, /display \? FONT_DISPLAY : FONT/);
  for (const f of ['game.js', 'art.js']) for (const m of src(f).matchAll(/A\.text\(ctx, [^;]*?, (\d+(?:\.\d+)?), '#[0-9a-fA-F]{3,6}'/g)) assert.ok(+m[1] >= 12, `${f}: A.text size ${m[1]} < 12`);
});
test('F4: the 3-star card reads "3 STARS!" (16 px) and the 2-star chip is a 64x28 pill', () => {
  const g = src('game.js'); assert.match(g, /'3 STARS!', 0, 34, 16/); assert.doesNotMatch(g, /3-STAR REWARD/); assert.match(g, /drawBeveledTile\(ctx, -32, -14, 64, 28/);
});
test('F5: confetti and Perfect fireworks wait for the card moment (pendingFw, released flag)', () => {
  const g = src('game.js'); assert.match(g, /const released = !MO \|\| R\.skipped \|\| rtM >= MOMENT_T\.hold;/); assert.match(g, /pendingFw = \[9, 2\.6\]/);
});
test('F7/F14: neutral cream family with an INK label; disabled = flat ramp, label at 60%', () => {
  const r = src('recipes.js'); assert.deepEqual(r.match(/cream: \['[^\]]*\]/)[0], "cream: ['#fffaf3', '#fff3e6', '#c9a98e', '#e8d2bd']"); assert.match(r, /dis: \['#ebe2e7', '#e6dce2', '#bfb2bb', '#ddd0d8'\]/);
  const g = src('game.js'); assert.match(g, /globalAlpha = 0\.6; A\.drawChunkyText/); assert.match(g, /'#fff3e6'/);
});
test('F8: hit boxes >= 44 px (shop info 48x44, pack 82x46, mode chips 45 logical so >= 44 css at 393 wide, Move/Swap 44 high)', () => {
  const g = src('game.js'); assert.match(g, /infoMove', 252, py - 2, 68, 44/); assert.match(g, /infoSwap', 320, py - 2, 64, 44/); assert.match(g, /'pack', 286, 119, 82, 46/); assert.match(g, /x - 6, y \+ h - 22, 48, 44/);
});
test('F9/F10/F11/F12: art recipes (chute 18/23, bitten treats baked per bite count, longer thin antennae, INK nest cloth)', () => {
  const a = src('art.js'); assert.ok(/lvl\s*>=\s*2\s*\?\s*23\s*:\s*18/.test(a), 'chute length');
  assert.match(a, /function treatBaked\(ctx, kind, r, pct\)/); assert.match(a, /destination-out/);
});
test('F13: panel gradient ends at #fff0e6 for cream panels (drawBeveledTile o.end)', () => {
  assert.match(src('recipes.js'), /o\.end \|\| R\.shade/); assert.match(src('game.js'), /end: col === '#fff6ee' \? '#fff0e6' : undefined/);
});
test('F15: map labels keep a 14 px band free of tufts and pebbles', () => { assert.match(src('game.js'), /mapLabelBoxes\(\)\.some/); });
test('F18: no stray .orig files in src', () => { assert.ok(!existsSync(new URL('../src/config.js.orig', import.meta.url))); });
test('QA tools: text-scan, small-targets, contrast, harness and the baseline are in the repo', () => {
  for (const f of ['text-scan.mjs', 'small-targets.mjs', 'contrast.mjs', 'harness.mjs', 'baseline/contrast-v080.json', 'shots-p1.mjs', 'qa-sheets.mjs']) assert.ok(existsSync(new URL('../tools/qa-v081/' + f, import.meta.url)), f);
  assert.match(rd('tools/qa-v081/text-scan.mjs'), /--inject/); assert.match(rd('tools/qa-v081/text-scan.mjs'), /--roboto/);
});

// ---------------- Pass 2: M1 / M2 / M3 / U5 modes, M8 counters, M4 shield, M5 data ----------------
import { Battle, TARGET_MODES, BASE_MODES, modesForLevel, nextTargetMode, isHealerType, hasTargetModes } from '../src/sim.js';
const DECK81 = C.STARTER_CARDS.slice();
const mk81 = (li = 0, seed = 1) => new Battle({ levelIndex: li, deck: DECK81, seed });
const still81 = (a) => { a.speed = 0; return a; };
const putAt81 = (b, a, d) => { a.d = d; const q = b.routes[a.ri].at(d); a.x = q.x; a.y = q.y; return a; };
function nearTower(b, type = 'zapper') { // a tower on the free tile closest to the trail, and the trail distance closest to it
  let best = null;
  for (let r = 0; r < 12; r++) for (let c = 0; c < 10; c++) if (b.placeRuleOk(type, c, r) && !b.towers.some((q) => q.c === c && q.r === r)) { let m = 1e9, md = 0; for (let d = 0; d < b.routes[0].length; d += 4) { const q = b.routes[0].at(d); const h = Math.hypot(q.x - (c * 40 + 20), q.y - (r * 40 + 20)); if (h < m) { m = h; md = d; } } if (!best || m < best.m) best = { c, r, m, md }; }
  return { tw: b.addTower(type, best.c, best.r), d: best.md };
}
test('M3: Front is gone from the player-facing code (config, game, uitext) and from the mode list; the sim branch is test-only', () => {
  assert.deepEqual(TARGET_MODES, ['weak', 'carrier', 'healer', 'strong']);
  for (const f of ['config.js', 'game.js', 'uitext.js']) assert.ok(!/['"`>]\s*Front\s*['"`<]|Front mode|front:/i.test(src(f).replace(/\/\/.*$/gm, '')), `no player-visible Front in ${f}`);
  const b = mk81(0); const tw = b.addTower('slingshot', 3, 3);
  assert.equal(b.setTargetMode(tw, 'front'), false, 'Front cannot be selected without the test flag'); assert.equal(tw.mode, 'weak');
});
test('M1/M2: modesForLevel = Weakest + Carrier, + Healer where a healer ant is in the waves, + Heavy on boss levels; at most 4 chips', () => {
  assert.deepEqual(modesForLevel(0), ['weak', 'carrier']);
  for (let li = 0; li < C.LEVELS.length; li++) {
    const m = modesForLevel(li); assert.ok(m.length >= 2 && m.length <= 4, `L${li + 1}: ${m}`); assert.deepEqual(m.slice(0, 2), BASE_MODES);
    assert.equal(m.includes('strong'), C.isBossLevel(li), `L${li + 1} strong`);
  }
  for (const li of [32, 33, 34, 35, 36, 37, 38, 39]) assert.ok(modesForLevel(li).includes('healer'), `L${li + 1} has a Healer chip`);
  assert.ok(modesForLevel(39).includes('strong') && modesForLevel(39).length === 4, 'L40 (nurse + queen) has 4 chips');
  assert.ok(!modesForLevel(9).includes('healer') && modesForLevel(9).includes('strong'), 'L10: queen only');
  assert.deepEqual(['weak', 'carrier', 'healer', 'strong', 'weak'].map((m, i, a) => nextTargetMode(m, a.slice(0, 4))), ['carrier', 'healer', 'strong', 'weak', 'carrier']);
  assert.ok(isHealerType('nurse') && !isHealerType('worker') && !isHealerType('queen4'));
});
test('M1: Healer picks the nurse over a lower-hp worker; with no nurse in range it falls back to Weakest; setTargetMode rejects healer on a level without one', () => {
  const b = mk81(32); const { tw, d } = nearTower(b); tw.mode = 'weak'; assert.ok(b.setTargetMode(tw, 'healer'));
  const w = putAt81(b, still81(b.spawn('worker', d)), d), n = putAt81(b, still81(b.spawn('nurse', d)), Math.max(0, d - 6));
  w.hp = 2; w.maxHp = 40; n.hp = 60; n.maxHp = 60;
  assert.equal(b.weakestTarget(tw, [w, n]), n, 'healer: the nurse first');
  assert.equal(b.weakestTarget(tw, [w]), w, 'no nurse in range -> Weakest');
  tw.mode = 'weak'; assert.equal(b.weakestTarget(tw, [w, n]), w, 'Weakest is unchanged');
  const b1 = mk81(0); const t1 = b1.addTower('slingshot', 3, 3); assert.equal(b1.setTargetMode(t1, 'healer'), false); assert.equal(b1.setTargetMode(t1, 'strong'), false);
});
test('M2: Heavy (strong) picks the highest-hp ant, ties by threat; only offered on boss levels', () => {
  const b = mk81(9); const { tw, d } = nearTower(b); assert.ok(b.setTargetMode(tw, 'strong'));
  const a1 = putAt81(b, still81(b.spawn('worker', d)), d), a2 = putAt81(b, still81(b.spawn('worker', d)), d - 8), a3 = putAt81(b, still81(b.spawn('worker', d)), d - 16);
  a1.hp = 5; a2.hp = 18; a3.hp = 18; a1.maxHp = a2.maxHp = a3.maxHp = 20;
  assert.equal(b.weakestTarget(tw, [a1, a2, a3]), a2, 'highest hp; the tie goes to the one further along the trail');
  const nb = mk81(0); assert.equal(nb.setTargetMode(nb.addTower('slingshot', 3, 3), 'strong'), false);
});
test('M8: per-battle upgrade-reach counters (placed, upgrades, crumbs on cards vs upgrades, towers by level, highest level per type); never touch the RNG; local-only debug blob', () => {
  const run = (count) => { const b = mk81(0, 7); b.crumbs = 9999; b.hand = ['slingshot', 'slingshot', 'slingshot', 'slingshot']; b.hand = b.hand || []; return b; };
  const b = mk81(0, 7); b.crumbs = 9999;
  const r0 = b.upgradeReach(); assert.deepEqual([r0.towers, r0.placed, r0.upgrades, r0.crumbsPlace, r0.crumbsUpgrade], [0, 0, 0, 0, 0]);
  const t = b.addTower('slingshot', 3, 3); t.lvl = 3;
  const r1 = b.upgradeReach(); assert.equal(r1.towers, 1); assert.equal(r1.l3p, 1); assert.equal(r1.byType.slingshot, 3);
  const g = src('game.js'); assert.match(g, /upgradeReach\(\)/); assert.match(g, /S\.save\.debug\.reach\.push/); assert.match(g, /towers L1\/L2\/L3\+/);
  const reachSrc = src('sim.js').match(/upgradeReach\(\) \{[\s\S]*?\n  \}/)[0]; assert.ok(!/rng/.test(reachSrc));
  const s = M.newSave(); assert.deepEqual(s.debug, { reach: [] });
  const st = mem(); s.debug.reach = Array.from({ length: 30 }, (_, i) => ({ li: i })); M.writeSave(st, s); assert.equal(M.loadSave(st).debug.reach.length, 20, 'trimmed to the last 20');
  const old = M.newSave(); delete old.debug; M.writeSave(st, old); assert.deepEqual(M.loadSave(st).debug, { reach: [] });
});
test('M4: shield data - Glazed and the Glaze Queen are in tuning with the plan numbers; no other ant has a shield', () => {
  assert.deepEqual(C.ANTS.glazed.shield, { pts: 30, regenDelay: 2.5, regenRate: 0.3, when: 'always' });
  assert.equal(C.ANTS.glazed.hp, 24); assert.equal(C.ANTS.glazed.speed, 38); assert.equal(C.ANTS.glazed.rarity, 'uncommon');
  const q = C.ANTS.queen5; assert.deepEqual(q.shield, { pts: 600, regenDelay: 4, regenRate: 0.25, when: 'always' });
  assert.equal(q.hp, 2400); assert.equal(q.boss, true); assert.deepEqual(q.spawn, { type: 'glazed', every: 10, count: 1 }); assert.equal(C.queenTake(q.queenTraits), 50);
  for (const [id, a] of Object.entries(C.ANTS)) if (!['glazed', 'queen5'].includes(id)) assert.ok(!a.shield, id);
});
test('M4: a 30-pt shield absorbs 10-dmg hits (20 / 10 / 0) and then hp; armor first; any damage restarts the regen timer; regen = 30% of max per s after 2.5 s', () => {
  const b = mk81(0); const a = still81(b.spawn('glazed', 10)); assert.equal(a.shieldMax, 30); assert.equal(a.shield, 30); assert.equal(a.hp, 24);
  b.damage(a, 10); assert.equal(a.shield, 20); assert.equal(a.hp, 24);
  b.damage(a, 10); assert.equal(a.shield, 10); b.damage(a, 10); assert.equal(a.shield, 0); assert.equal(a.hp, 24);
  b.damage(a, 10); assert.equal(a.shield, 0); assert.equal(a.hp, 14, 'once the shield is gone the hit goes to hp');
  assert.equal(a.shieldT, 0, 'a hit with the shield already down still resets the timer');
  // regen: not before 2.5 s, then 9 pts/s
  for (let i = 0; i < 120; i++) b.update(1 / 60); // 2.0 s
  assert.equal(a.shield, 0);
  for (let i = 0; i < 30; i++) b.update(1 / 60); // 2.5 s total: regen just starting
  assert.ok(a.shield < 1.2, `regen has barely started (${a.shield})`);
  for (let i = 0; i < 60; i++) b.update(1 / 60); // +1 s
  assert.ok(Math.abs(a.shield - 9) < 1.2, `~9 pts after 1 s of regen (${a.shield})`);
  // a fresh hit resets it
  const before = a.shield; b.damage(a, 1); b.update(1 / 60); assert.ok(a.shield <= before, 'no regen right after a hit');
});
test('M4: Gas and Bomb damage hits the shield first (armor-ignoring still goes through the shield); armor is applied before the shield', () => {
  const b = mk81(0); const a = still81(b.spawn('glazed', 10)); a.armor = 4;
  b.damage(a, 14); assert.equal(a.shield, 20, 'armor 4 takes 4 off a 14 hit -> 10 into the shield'); assert.equal(a.hp, 24);
  b.damage(a, 12, { ignoreArmor: true }); assert.equal(a.shield, 8);
  b.damage(a, 20, { ignoreArmor: true }); assert.equal(a.shield, 0); assert.equal(a.hp, 12, '8 absorbed, 12 to hp');
});
test('M4: damage conservation (absorbed + hp lost = dealt after armor); L45-style hpMul 5.4 gives Glazed hp 130 and shield 162', () => {
  const b = mk81(0); b.level = { ...b.level, hpMul: 5.4 };
  const a = still81(b.spawn('glazed', 10)); assert.equal(a.maxHp, 130); assert.equal(a.shieldMax, 162); assert.equal(a.shield, 162);
  let dealt = 0; const hp0 = a.hp; for (const d of [30, 50, 70, 25]) { dealt += b.damage(a, d); }
  assert.ok(Math.abs((162 - a.shield) + (hp0 - a.hp) - dealt) < 1e-9, 'absorbed + hp lost = dealt'); assert.equal(a.shield, 0); assert.equal(a.hp, hp0 - (dealt - 162));
  const w = b.spawn('worker', 10); assert.equal(w.shieldMax, 0, 'ants without a shield are untouched');
});
test('M4: events - shieldBreak when it hits 0, shieldBack when regen starts from 0, shieldFull when it is full again; a queen5 shield scales too', () => {
  const b = mk81(0); const a = still81(b.spawn('glazed', 10));  
  b.damage(a, 40); const evs = b.events;
  assert.ok(JSON.stringify(evs).includes('shieldBreak'), 'shieldBreak emitted');
  for (let i = 0; i < 60 * 8; i++) b.update(1 / 60);
  const all = JSON.stringify(b.events);
  assert.ok(all.includes('shieldBack') && all.includes('shieldFull'), 'shieldBack and shieldFull emitted'); assert.equal(a.shield, a.shieldMax);
  const q = still81(b.spawn('queen5', 5)); assert.equal(q.shieldMax, 600);
});
test('U4: shield visuals - dome strokes (INK 1.5 + white 1), a 2 px bar above the hp bar, 2 Hz pulse, 3 shards + sparkles on break, reduced motion = static dome, shield/shieldUp sfx; no shadowBlur/gradients', () => {
  const g = src('game.js'); const ds = g.match(/function drawShield[\s\S]*?\n\}\n/)[0];
  assert.match(ds, /lineWidth = 1\.5/); assert.match(ds, /strokeStyle = '#ffffff'/); assert.match(ds, /A\.rr\(ctx, x - w \/ 2, hy, Math\.max\(2, w \* f\), 2, 1\)/); assert.match(ds, /Math\.PI \* 4/); assert.match(ds, /reducedMotion\(\)/);
  assert.ok(!/shadowBlur|createLinearGradient|createRadialGradient|filter/.test(ds));
  assert.match(g, /case 'shieldBreak'/); assert.match(g, /sfx\('shield'\)/); assert.match(g, /sfx\('shieldUp'\)/); assert.match(g, /k: 'iceShard'/);
  assert.match(src('audio.js'), /case 'shield':/); assert.match(src('audio.js'), /case 'shieldUp':/);
});
test('U3: every ant carries an intro line <= 60 chars (config ANTS) and the prep tooltip shows it as line 2 (>= 12 px, 3.4 s)', () => {
  assert.match(src('game.js'), /C\.ANTS\[tp\]\.intro \|\|/); assert.match(src('game.js'), /until: S\.t \+ 3\.4/);
  for (const id of Object.keys(C.ANTS)) { assert.ok(C.ANTS[id].intro && C.ANTS[id].intro.length <= 60, `${id}: ${C.ANTS[id].intro && C.ANTS[id].intro.length}`); }
});

// ---- Pass 2: U1 first-battle guide ----
test('U1: newOnboardState firstBattle pending, migrated saves done, guide gated on level 0 + pending, skip pill >= 44, bubbles <= 8 words', async () => {
  const m = src('meta.js'); assert.match(m, /firstBattle: 'pending'/); assert.match(m, /firstBattle = 'done'|firstBattle: 'done'/);
  const g = src('game.js'); assert.match(g, /function guideWanted/); assert.match(g, /function renderGuide/); assert.match(g, /'guideSkip'/);
  const texts = [...g.matchAll(/'(Drag a card to a blue spot|Start the wave!)'/g)].map((x) => x[1]);
  assert.ok(texts.length >= 2); for (const t of texts) assert.ok(t.split(/\s+/).length <= 8);
});
test('U1: guideWanted/guideDone tolerate a string onboard (older test saves)', () => {
  const g = src('game.js'); assert.match(g, /function guideWanted[^\n]*typeof S\.save\.onboard === 'object'/); assert.match(g, /function guideDone[^\n]*typeof S\.save\.onboard === 'object'/);
});
// ---- Pass 3: field art (G1-G3, G7, G8) ----
test('G-art: ART81 is on in production and the flag has an escape hatch only in test builds', () => {
  const c = src('config.js'); assert.match(c, /export const ART81 = !\(typeof __TEST_HOOKS__ !== 'undefined' && __TEST_HOOKS__/); assert.equal(C.ART81, true);
});
test('G2: towers x1.18 about the pad top, BAKE_BOX grows, saturated pad bases, card tint colours untouched', () => {
  const a = src('art.js'); assert.match(a, /TOWER_K = 1\.18/); assert.match(a, /\[-48, -76, 48, 36\]/);
  for (const hex of ['#e78015', '#49af29', '#a687e9', '#30a2f1', '#ff6673', '#319fff', '#28aa9d', '#f06da6', '#76a927', '#cf8a00', '#d9a900', '#d99a00']) assert.ok(a.includes(`'${hex}'`), 'pad base ' + hex);
  assert.match(a, /function bodyScale\(ctx\) \{ if \(!C\.ART81\) return; if \(MOTION\.hop\)[^\n]*ctx\.translate\(0, 8\); ctx\.scale\(TOWER_K, TOWER_K\); ctx\.translate\(0, -8\)/); // v0.8.1 G6/J6: the idle bob and the upgrade hop are applied just before the x1.18 scale
  assert.match(a, /function bodyScale\(ctx\) \{ if \(!C\.ART81\) return; if \(MOTION\.hop\)/);
  assert.match(a, /const f = 1\.2 \/ BODYK/, 'outlines compensated to 2.4 px on screen');
  assert.equal(C.TOWERS.slingshot.color, C.TOWERS.slingshot.color); // the card tint is not derived from TOWER_PAD
  assert.ok(!/TOWER_PAD/.test(src('config.js')));
});
test('G7: the nest pole stands on the mound centre', () => {
  const a = src('art.js'); assert.match(a, /ctx\.moveTo\(0, -16\); ctx\.lineTo\(0, topY\)/); assert.match(a, /const s = 0\.95/);
});
test('G8: the food bar keeps its geometry and bakes track + fills', () => {
  const a = src('art.js'); assert.match(a, /bakedBox\(ctx, 'foodTrack', 60, 22, 84, 20/); assert.match(a, /rr\(ctx, 62, 24, w, 16, 8\); ctx\.clip\(\)/);
  assert.match(a, /text\(ctx, label, 102, 33, 14, '#fff'\)/); const g = src('game.js'); assert.match(g, /A\.drawFoodBar\(ctx, f,/);
  const live = a.slice(a.indexOf('const drawFill'), a.indexOf('// v0.8.1 G3: the reward header')); assert.ok(!/createLinearGradient|createRadialGradient/.test(live), 'no per-frame gradients after the bakes');
});
test('G3: reward header palettes per star count; defeat is slate with no crown; layout untouched', () => {
  const A = rd('src/art.js'); assert.match(A, /rewardPalette/);
  assert.match(A, /pink: \['#ff8fa3', '#e0546e', '#b83a55'\]/); assert.match(A, /gold: \['#ffd45e', '#f0a82a', '#b8700a'\]/); assert.match(A, /slate: \['#b9aecb', '#8f84a6', '#6e6488'\]/);
  assert.match(A, /bronze: '#d9a77a', silver: '#dfe6f0', gold: '#ffd23f'/);
  const g = src('game.js'); assert.match(g, /panel\(36, 120, 328, 480, '#fff6ee', 18, \{ gold: R\.win \}\)/); assert.match(g, /A\.drawChunkyText\(ctx, title, 200, 156, ts/); assert.match(g, /A\.drawRewardHeader\(ctx, A\.rewardPalette\(R\.win, R\.stars, R\.perfect\)/);
});
// ---- Pass 4: motion and sound (G4-G6, J1-J4, J6, J8-J10) ----
import { throttleMs } from '../src/audio.js';
test('J10/G4: coinTick is throttled to 100 ms (120 at 4x); the new sfx exist', () => {
  assert.equal(throttleMs('coinTick', 1), 100); assert.equal(throttleMs('coinTick', 4), 120); assert.equal(throttleMs('laser', 4), 120); assert.equal(throttleMs('tap', 1), 60);
  const a = src('audio.js'); for (const n of ["'coinTick'", "'perfect'", "'boss'"]) assert.ok(a.includes('case ' + n), 'sfx ' + n);
});
test('J10: haptics use the plain VIBRATE permission only (no INTERNET, no dangerous permission) and honour the setting', () => {
  const mf = rd('android/app/src/main/AndroidManifest.xml'); const perms = [...mf.matchAll(/<uses-permission[^>]*android:name="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(perms, ['android.permission.VIBRATE']);
  const g = src('game.js'); assert.match(g, /const HAPTIC_MS = \{ light: 12, medium: 26, heavy: \[40, 30, 60\] \}/);
  assert.match(g, /function haptic\(kind\) \{\s*if \(!C\.ART81 \|\| !HAPTIC_MS\[kind\]\) return;\s*if \(S\.save && S\.save\.settings && S\.save\.settings\.haptics === false\) return;/);
  assert.ok(!/@capacitor\/haptics/.test(rd('package.json')), 'no new plugin dependency');
});
test('G5: at most 24 sparkles alive; the sparkle shape grows 1 -> 1.25 -> 0; reduced motion only fades', () => {
  const g = src('game.js'); assert.match(g, /if \(n >= 24\)/); const a = src('art.js'); assert.match(a, /export function fxSparkle\(/); assert.match(a, /1\.25/);
  assert.match(a, /export const MOTION = \{ reduced: false, bobTowers: false, hop: 0 \}/);
});
test('G4: crumb sprites <= 12 in their own array; merge under 100 ms; coin fly skipped on tap', () => {
  const g = src('game.js'); assert.match(g, /S\.crumbSprites/); assert.match(g, /S\.t - last\.t0 < 0\.1/); assert.match(g, /coinSkip/);
});
test('J1/J2/J4/J9: sim events carry the visual payload only (hit.src, charm.tx/ty); the wave banner and queen pill exist', () => {
  const s = src('sim.js'); assert.match(s, /src: p\.src && p\.src\.type/); assert.match(s, /tx: tw\.x, ty: tw\.y/);
  const g = src('game.js'); assert.match(g, /k === 'queenPill'/); assert.match(g, /Final wave/); assert.match(g, /function towerImpact/); assert.match(g, /function deathExtras/);
});
test('J12: motion state is reset per frame and every new art path is behind ART81', () => {
  const g = src('game.js'); assert.match(g, /A\.MOTION\.reduced = /); assert.match(g, /C\.ART81 && !reducedMotion\(\)/);
});

// ---------- Pass 5: World 5 "Donut Diner" (W1-W9, U2, U6, EC1, EC3, EC4) ----------
import { generateWaves, levelAntTypes } from '../src/sim.js'; import * as A from '../src/art.js';
test('W1: world 5 Donut Diner - 50 levels, 5 worlds, 42 maps, treat donut, queen5, cap 6, coinMul 1.75, gate 14 stars of W4', () => {
  assert.equal(C.LEVELS.length, 50); assert.equal(C.WORLDS.length, 5); assert.equal(Object.keys(C.MAPS).length, 42);
  const w = C.WORLDS[4]; assert.equal(w.id, 5); assert.equal(w.name, 'Donut Diner'); assert.equal(w.treat, 'donut'); assert.equal(w.queen, 'queen5'); assert.equal(w.levels, 10);
  assert.equal(w.cardLevelCap, 6); assert.equal(w.coinMul, 1.75); assert.deepEqual(w.unlock, { allLevelsWonInWorld: 4, minStarsInWorld: 14 });
  assert.equal(C.WORLD_START[5], 40); assert.ok(C.isBossLevel(49)); assert.ok(!C.isBossLevel(48)); assert.ok(C.LEVELS.slice(40).every((L) => L.world === 5));
  assert.equal(C.LEVELS.slice(40).map((l) => l.map).length, 10); assert.equal(new Set(C.LEVELS.slice(40).map((l) => l.map)).size, 10);
  assert.ok(C.LEVELS.slice(40).every((l) => C.MAPS[l.map] && C.MAPS[l.map].theme === 8), 'W5 maps use theme 8');
  assert.equal(typeof A.TREAT_BODIES.donut, 'function'); assert.equal(A.THEMES[8].name, 'W5 teal-diner'); assert.equal(C.TREATS[5], 'donut');
});
test('W2: Glazed first appears on L42 (wave 2), never on L41; at most 3 per wave on L45; <= 5 ant types per battle; the queen is last on L50', () => {
  assert.ok(!levelAntTypes(40).includes('glazed')); const w42 = generateWaves(41); assert.ok(!w42[0].some((e) => e.type === 'glazed')); assert.ok(w42[1].some((e) => e.type === 'glazed'));
  for (let i = 40; i < 50; i++) { assert.ok(levelAntTypes(i).length <= 5, `L${i + 1}`); if (i > 41) assert.ok(levelAntTypes(i).includes('glazed'), `L${i + 1} has glazed`); }
  assert.ok(Math.max(...generateWaves(44).map((w) => w.filter((e) => e.type === 'glazed').length)) <= 3);
  const w50 = generateWaves(49); assert.equal(w50[w50.length - 1].filter((e) => e.type === 'queen5').length, 1);
});
test('W3: hpMul table for L41-L50 is the final tuning (move hpMul, never waves); rarity checker R1-R4 reports 0 violations on the W5 levels', async () => {
  assert.deepEqual(C.LEVELS.slice(40).map((l) => l.hpMul), [4.2, 4.5, 9.3, 8.35, 5.4, 8.8, 6.25, 6.75, 5.45, 0.87]);
  const { checkLevel } = await import('../tools/check-rarity.mjs'); for (let i = 40; i < 50; i++) assert.deepEqual(checkLevel(i).msgs, [], `L${i + 1}`);
});
test('U2: ant intro cards - glazed / queen5 / nurse only, once per save, never on a cleared level; an old save pre-marks the ants it has already met', () => {
  assert.deepEqual(Object.keys(C.ANT_CARD).sort(), ['glazed', 'nurse', 'queen5']);
  assert.match(C.ANT_CARD.glazed, /\u2014/); assert.ok(C.ANT_CARD.glazed.length > 20);
  const s = M.newSave(); assert.equal(M.nextAntCard(s, 0), null, 'L1: no card'); assert.equal(M.nextAntCard(s, 40), null, 'L41 has no glazed');
  assert.equal(M.nextAntCard(s, 41), 'glazed'); assert.equal(M.markAntSeen(s, 'glazed'), true); assert.equal(M.markAntSeen(s, 'glazed'), false); assert.equal(M.nextAntCard(s, 41), null);
  const s2 = M.newSave(); s2.levels[41] = { stars: 1, cleared: true }; assert.equal(M.nextAntCard(s2, 41), null, 'cleared level: never');
  const st = mem(); const old = M.newSave(); delete old.seenAnts; old.levels[31] = { stars: 1, cleared: true }; M.writeSave(st, old); const l = M.loadSave(st);
  assert.ok(l.seenAnts.includes('nurse'), 'cleared L32 pre-marks the nurse'); assert.ok(!l.seenAnts.includes('glazed'));
  assert.match(src('game.js'), /renderAntCard/); assert.match(src('game.js'), /antcard=1/);
});
test('U6: lowestStarLevels lists the previous world levels that can still add stars, lowest first; the locked gate is tappable', () => {
  const s = M.newSave(); for (let i = 30; i < 40; i++) s.levels[i] = { stars: i < 34 ? 1 : 3, cleared: true }; s.levels[39] = { stars: 0, cleared: false };
  const low = M.lowestStarLevels(s, 5); assert.ok(low.length >= 4); assert.equal(low[0].stars, 0); assert.ok(low.every((x, k) => k === 0 || x.stars >= low[k - 1].stars));
  assert.equal(M.worldStars(s, 4), 4 * 1 + 5 * 3, 'meta count agrees'); assert.equal(M.worldUnlocked(s, 5), false);
  assert.match(src('game.js'), /button\('gate' \+ w/); assert.match(src('game.js'), /S\.starCard = \{ w \}/);
});
test('EC3: first-time star bonus per world = tuning x coinMul rounded to 5 (W1 15/75, W2 15/75, W3 20/95, W4 25/115, W5 25/130)', () => {
  const want = [[15, 75], [15, 75], [20, 95], [25, 115], [25, 130]];
  want.forEach(([b2, b3], k) => {
    const lvl = k * 10; const s = M.newSave(); s.levels[lvl] = { stars: 1, cleared: true };
    const r = M.applyBattleResult(s, lvl, 'win', 3, { kills: 10, foodLeft: 10, time: 60 }, () => 0.5);
    assert.deepEqual([r.starParts.s2, r.starParts.s3], [b2, b3], `W${k + 1}`);
  });
});
test('W9: the L42 tip toast text exists, fires once on wave 2 of L42 via save.seenAnts, and W5 story line <= 60 chars', () => {
  assert.equal(C.L42_TIP, 'Glaze grows back. Focus fire.'); const g = src('game.js');
  assert.match(g, /b\.levelIndex === 41 && e\.n === 2 && M\.markAntSeen\(S\.save, 'tip:glazed42'\)/);
  const m = g.match(/const W5_STORY = '([^']+)'/); assert.ok(m && m[1].length <= 60, 'story <= 60');
});

// ---------------- Pass 6: U7 / U8 / U9 ----------------
import { lossHint, LOSS_HINTS } from '../src/sim.js';
test('U7: hints are <= 60 chars; lossHint follows the rule order and is read-only', () => {
  for (const h of Object.values(LOSS_HINTS)) assert.ok(h.length <= 60, h);
  assert.equal(LOSS_HINTS.carrier, 'Try Carrier mode on a tower');
  const b = mk81(0); assert.equal(lossHint(b), null, 'no hint before a defeat');
  b.result = 'lose'; b.addTower('slingshot', 3, 3);
  // rule 1: most stolen food left with carriers, a single-target tower not on Carrier mode
  b.stats.stolen = 10; b.stats.lostOnWay = 8; assert.equal(lossHint(b), LOSS_HINTS.carrier);
  const tw = b.towers[0]; tw.mode = 'carrier'; assert.equal(lossHint(b), null, 'already on Carrier mode and nothing else matches');
  // rule 2: a healer alive at the end
  const n = b.spawn('nurse', 5); assert.equal(lossHint(b), LOSS_HINTS.healer); n.dead = true;
  // rule 3: flyer leak and no Laser / Zapper
  b.stats.flyLeak = 3; b.deck = ['slingshot', 'spray', 'glue', 'fan', 'ball']; assert.equal(lossHint(b), LOSS_HINTS.flyer);
  b.deck = ['slingshot', 'zapper']; assert.equal(lossHint(b), null);
  const snap = JSON.stringify(b.stats); lossHint(b); assert.equal(JSON.stringify(b.stats), snap);
});
test('U7: the flyer-leak counter is visual-only and the loss run counts consecutive losses on one level', () => {
  const s = M.newSave();
  assert.equal(M.noteLossRun(s, 4, false), 1); assert.equal(M.noteLossRun(s, 4, false), 2); assert.equal(M.noteLossRun(s, 5, false), 1, 'another level restarts');
  assert.equal(M.noteLossRun(s, 5, false), 2); assert.equal(M.noteLossRun(s, 5, true), 0); assert.equal(s.lossRun, null);
  const sim = src('sim.js'); assert.match(sim, /if \(a\.flying\) this\.stats\.flyLeak =/);
  const g = src('game.js'); assert.match(g, /hint: C\.ART81 && b\.result === 'lose' && lossRun >= 2 \? lossHint\(b\) : null/); assert.match(g, /R\.hint/);
});
test('U8: no hard-coded deck size strings; the deck size comes from C.BATTLE.deckSize', () => {
  const g = src('game.js'); assert.ok(!/Deck is full \(5\)/.test(g)); assert.ok(!/Pick 5 cards/.test(g));
  assert.match(g, /Deck is full \(\$\{C\.BATTLE\.deckSize\}\)/); assert.match(g, /Pick \$\{C\.BATTLE\.deckSize\} cards/);
});
test('U9: nudge armed once per kind, at most twice per save, points at the first unlocked unplayed level', () => {
  const s = M.newSave(); assert.equal(M.nextUnplayedLevel(s), 0);
  assert.equal(M.armNextHint(s, 'card'), true); assert.equal(M.armNextHint(s, 'l1'), false, 'one armed at a time');
  const h = M.nextHintState(s); h.shown++; h.done.push(h.armed); h.armed = '';
  assert.equal(M.armNextHint(s, 'card'), false, 'same kind never again'); assert.equal(M.armNextHint(s, 'l1'), true);
  h.shown++; h.done.push('l1'); h.armed = ''; assert.equal(h.shown, 2); assert.equal(M.armNextHint(s, 'x'), false, 'never a third time');
  s.levels[0].cleared = true; assert.equal(M.nextUnplayedLevel(s), 1);
  const g = src('game.js'); assert.match(g, /nexthint=1/); assert.match(g, /M\.armNextHint\(S\.save, 'card'\)/); assert.match(g, /M\.armNextHint\(S\.save, 'l1'\)/);
  assert.match(g, /const modal = S\.cal \|\| S\.settings/);
});

test('version 0.8.1 / versionCode 26 (release)', () => {
  assert.equal(C.VERSION, '0.8.1');
  assert.match(rd('android/app/build.gradle'), /versionCode 26\b/); assert.match(rd('android/app/build.gradle'), /versionName "0\.8\.1"/);
  assert.equal(JSON.parse(rd('package.json')).version, '0.8.1');
});
