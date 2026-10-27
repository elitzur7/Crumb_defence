// v0.2.0 mechanics: per-tower logic, food return, rewards, perfect prize, stats/upgrades, maps, prep checks.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as C from '../src/config.js';
import { Battle, towerStat, upgradeDiff, foodReturned, formatStat } from '../src/sim.js';
import * as M from '../src/meta.js';
import { parseMap, validateMap } from '../src/maps.js';

const DECK = ['slingshot', 'spray', 'glue', 'fan', 'ball'];
const mk = (o = {}) => { const b = new Battle({ levelIndex: 0, deck: DECK, seed: 1, bonusTypes: ['bomb', 'freeze'], bonusStock: { bomb: 5, freeze: 5 }, ...o }); b.nextWaveAt = 1e9; return b; };
// zigzag (level 1): row 2 runs left->right from x=60 to x=340; first segment (col 1, from y=-4 to 100) is 104 px long
const ROW2 = 104; const dAtX = (x) => ROW2 + (x - 60);
const still = (a) => { a.speed = 0; return a; };
const run = (b, sec, dt = 1 / 60) => { for (let i = 0; i < sec / dt; i++) b.update(dt); };

// ---------- 1. Fan / marble (v0.3: always aimed at the board centre, true angle, no Turn) ----------
const CX = C.GRID_COLS * C.TILE / 2, CY = C.GRID_ROWS * C.TILE / 2;
test('v0.5 item 10b: fan blows ALONG the trail next to it, away from the fan; effect = wind . trail direction', () => {
  const res = {};
  // zigzag row 2 runs left -> right (cols 1..8). A fan at (0,2) blows +x along it (with the ants = bad spot);
  // a fan at (9,2) blows -x along it (against the ants = good spot).
  for (const [name, c, x] of [['left', 0, 80], ['right', 9, 320]]) {
    const b = mk(); const fan = b.addTower('fan', c, 2); fan.cd = 0;
    assert.ok(fan.trailDir && fan.trailDir.run === 8, `${name}: straight run of 8 tiles`);
    assert.deepEqual([fan.ax, fan.ay], name === 'left' ? [1, 0] : [-1, 0]);
    const a = still(b.spawn('worker', dAtX(x))); const d0 = a.d;
    b.update(1 / 60); res[name] = a.d - d0;
  }
  assert.ok(res.left > 5, `left fan pushes row-2 ants forward (${res.left})`);
  assert.ok(res.right < -5, `right fan pushes row-2 ants back (${res.right})`);
  assert.ok(Math.abs(res.left + res.right) < 1e-6, 'mirror spots give mirror effects');
  // no trail cell right next to it (only diagonal) -> no direction, no wind
  const b = mk(); const fan = b.addTower('fan', 0, 3); fan.cd = 0; assert.equal(fan.trailDir, null);
  const a = still(b.spawn('worker', dAtX(60))); const d0 = a.d; b.update(1 / 60); assert.equal(a.d, d0);
});
test('v0.5 items 2 + 10a: direction = from the tower into the trail cell next to it; longest straight run, then higher, then left', () => {
  const b = mk(); const set = (tiles, runs) => { b.pathTiles = new Set(tiles.map(([c, r]) => c + ',' + r)); b.trailEdges = new Set(); for (const run of runs) for (let i = 1; i < run.length; i++) { const [p, q] = [run[i - 1], run[i]]; b.trailEdges.add(p + '>' + q); b.trailEdges.add(q + '>' + p); } };
  // longer run wins: left cell alone (run 1) vs right cell starting a 3-tile straight run
  set([[4, 5], [6, 5], [7, 5], [8, 5]], [[[6, 5], [7, 5], [8, 5]]]);
  let d = b.trailDirection(5, 5); assert.deepEqual([d.dx, d.dy, d.run], [1, 0, 3]);
  // equal runs (2 each): the one higher on the screen wins
  set([[5, 4], [5, 3], [6, 5], [7, 5]], [[[5, 4], [5, 3]], [[6, 5], [7, 5]]]);
  d = b.trailDirection(5, 5); assert.deepEqual([d.dx, d.dy, d.run], [0, -1, 2]);
  // equal runs on the same row: the left one wins
  set([[4, 5], [3, 5], [6, 5], [7, 5]], [[[4, 5], [3, 5]], [[6, 5], [7, 5]]]);
  d = b.trailDirection(5, 5); assert.deepEqual([d.dx, d.dy, d.run], [-1, 0, 2]);
  // a straight run stops at a turn (no straight edge onward)
  set([[6, 5], [7, 5], [7, 6]], [[[6, 5], [7, 5], [7, 6]]]);
  d = b.trailDirection(5, 5); assert.deepEqual([d.dx, d.dy, d.run], [1, 0, 2]);
  // only diagonal / no trail next to it -> null
  set([[6, 6]], []); assert.equal(b.trailDirection(5, 5), null);
});
test('no Turn: the direction is fixed at placement and cannot be changed', () => {
  const b = mk();
  assert.equal(typeof b.turnTower, 'undefined'); assert.equal(typeof b.setTowerDir, 'undefined');
  const g = readFileSync(new URL('../src/game.js', import.meta.url), 'utf8');
  assert.ok(!/infoTurn|'Turn'|turnTower|setTowerDir/.test(g), 'no Turn button in the UI');
});
test('v0.5 item 2: the marble rolls away from the tower down the straight trail, breaks at the end (no extra damage)', () => {
  const b = mk(); const m = b.addTower('ball', 0, 2); // left of row 2 -> rolls right along cols 1..8
  assert.ok(m.hasLaunch); assert.deepEqual([m.ax, m.ay], [1, 0]); assert.equal(m.trailDir.run, 8);
  const R = b.rollFor(m); assert.equal(R.len, m.runLen); assert.equal(R.tiles, 8); assert.equal(m.runLen, 8 * C.TILE - towerStat('ball', 'ballRadius', 1, 1));
  const a = still(b.spawn('worker', dAtX(220))); m.cd = 0;
  let broke = null; for (let i = 0; i < 120 && !broke; i++) { b.update(1 / 60); broke = b.events.find((e) => e.type === 'marbleBreak'); }
  assert.ok(a.hp < a.maxHp || a.dead, 'ant in the roll path was squashed');
  assert.ok(broke, 'the marble broke at the end of the straight stretch');
  assert.ok(Math.abs(broke.x - (m.lx + m.runLen)) < 1 && broke.y === m.ly, 'it broke at the wall');
  assert.equal(b.balls.length, 0); assert.ok(!b.events.some((e) => e.type === 'marbleStuck'));
});
test('v0.5 item 2: no trail right next to the marble (only diagonal) = it does not roll at all', () => {
  const b = mk(); const m = b.addTower('ball', 0, 3); // touches row 2 only diagonally
  assert.equal(m.hasLaunch, false); assert.equal(m.runLen, 0); assert.equal(m.trailDir, null);
  const a = still(b.spawn('worker', dAtX(60))); m.cd = 0;
  run(b, 1.5);
  assert.equal(b.balls.length, 0); assert.ok(!b.events.some((e) => e.type === 'roll'));
  assert.equal(a.hp, a.maxHp, 'no damage');
});
test('marble must touch the trail, fires slowly (nerf) and keeps one marble at a time', () => {
  const b = mk(); b.addCrumbs(100); b.picks[0] = 'ball';
  assert.equal(b.canPlay(0, 0, 10).why, 'needNearTrail');
  assert.ok(b.canPlay(0, 4, 3).ok);
  assert.ok(C.TOWERS.ball.stats.rate <= 0.2, 'marble rate nerfed from 0.30/s');
  assert.equal(C.TOWERS.ball.maxBalls, 1);
});

// ---------- 1. every tower's own ability ----------
test('boombox staggers, glue sticks once, perfume charms, laser heats up, zapper chains', () => {
  let b = mk(); let tw = b.addTower('sound', 4, 3); tw.cd = 0; let a = still(b.spawn('worker', dAtX(180))); b.update(1 / 60); // v0.4.1: 1-tile radius = exactly the next cell's centre, so hold the ant there
  assert.ok(a.stunT > 0, 'boombox stagger');
  b = mk(); const glue = b.addTower('glue', 4, 2); a = b.spawn('worker', dAtX(150)); run(b, 1.2);
  assert.ok(glue.stuckSet.has(a.id), 'glue stuck the ant'); assert.ok(b.events.some((e) => e.type === 'stick'));
  b = mk(); const pf = b.addTower('pheromone', 4, 2); a = b.spawn('worker', dAtX(150)); run(b, 1.4);
  assert.ok(pf.charmSet.has(a.id), 'perfume charmed the ant'); assert.ok(Math.abs(a.d - pf.pathD) < 20, 'held near the perfume');
  b = mk(); const ls = b.addTower('laser', 4, 3); const big = still(b.spawn('big', dAtX(180))); big.hp = big.maxHp = 1e6; big.armor = 0;
  const hits = []; let last = big.hp; for (let i = 0; i < 300; i++) { b.update(1 / 60); if (big.hp < last) { hits.push(last - big.hp); last = big.hp; } }
  assert.ok(hits.length > 5 && hits.at(-1) > hits[0] * 1.5, `laser heat ramps damage ${hits[0]} -> ${hits.at(-1)}`);
  b = mk(); const z = b.addTower('zapper', 4, 3); z.cd = 0;
  const fl = [0, 30, 60].map((o) => still(b.spawn('flyer', dAtX(170 + o))));
  b.update(1 / 60);
  assert.equal(fl.filter((f) => f.hp < f.maxHp || f.dead).length, 3, 'zap chained to all 3 flyers');
});

// ---------- 5. food: immediate deduction, partial return ----------
test('food drops the moment a piece is taken; a killed carrier returns 40% (stole 5 -> 2)', () => {
  assert.equal(C.BATTLE.foodReturn.mode, 'fixed'); assert.equal(C.BATTLE.foodReturn.fixed, 0.4);
  assert.equal(foodReturned(5, 0.5), 2);
  assert.equal(foodReturned(1, 0.5), 0.4);
  const b = mk(); const a = b.spawn('big', b.path.length - 1); b.update(0.05);
  assert.equal(b.foodStored, 100 - C.ANTS.big.steal, 'HP dropped immediately, before the carrier gets home');
  assert.equal(a.state, 'back');
  b.damage(a, 1e9, { ignoreArmor: true });
  assert.equal(b.foodStored, 100 - C.ANTS.big.steal + C.ANTS.big.steal * 0.4);
});
test('distance mode: carriers killed near the cookie return more than near the nest; one switch', () => {
  const R = { ...C.BATTLE.foodReturn, mode: 'distance' };
  assert.ok(foodReturned(5, 0.95, R) > foodReturned(5, 0.05, R));
  assert.equal(foodReturned(10, 1, R), 10 * R.distMax); assert.equal(foodReturned(10, 0, R), 10 * R.distMin);
  const b = mk({ battleCfg: { foodReturn: { mode: 'distance' } } }); assert.equal(b.cfg.foodReturn.mode, 'distance');
  assert.equal(foodReturned(5, 0.5, { ...R, mode: 'fixed', rounding: 'floor', fixed: 0.3 }), 1);
});
test('the battle is lost the moment the cookie is gone', () => {
  const b = mk(); b.foodStored = 0.5; b.spawn('worker', b.path.length - 1); b.update(0.05);
  assert.equal(b.result, 'lose');
});

// ---------- 4/11. rewards & perfect ----------
test('win coins = base + food left + ants killed (+ level, first clear); loss = few coins from kills only', () => {
  const E = C.ECONOMY;
  const w = M.battleCoins('win', { kills: 80, foodLeft: 90, levelIndex: 2, firstClear: false });
  assert.equal(w.total, E.winBase + Math.round(90 * E.coinsPerFood) + Math.round(80 * E.coinsPerKillWin) + 2 * E.coinsPerLevel);
  assert.ok(M.battleCoins('win', { kills: 80, foodLeft: 100 }).total > M.battleCoins('win', { kills: 80, foodLeft: 50 }).total, 'more food left = more coins');
  assert.ok(M.battleCoins('win', { kills: 120, foodLeft: 80 }).total > M.battleCoins('win', { kills: 40, foodLeft: 80 }).total, 'more kills = more coins');
  assert.equal(M.battleCoins('lose', { kills: 37 }).total, Math.floor(37 * E.coinsPerKillLoss));
  assert.equal(M.battleCoins('lose', { kills: 100000 }).total, E.lossCap);
  assert.ok(M.battleCoins('lose', { kills: 80 }).total < M.battleCoins('win', { kills: 80, foodLeft: 1 }).total);
});
test('a loss never grants cards, unlocks or prizes; a normal win grants no prize', () => {
  const s = M.newSave(); const cards0 = JSON.stringify(s.cards), stock0 = JSON.stringify(s.bonusStock);
  const out = M.applyBattleResult(s, 0, 'lose', 0, { kills: 50, perfect: true }, () => 0.1);
  assert.equal(out.unlocked, null); assert.equal(out.prize, null);
  assert.equal(JSON.stringify(s.cards), cards0); assert.equal(JSON.stringify(s.bonusStock), stock0);
  const w = M.applyBattleResult(s, 0, 'win', 2, { kills: 50, foodLeft: 70, perfect: false }, () => 0.1);
  assert.equal(w.prize, null); assert.equal(w.bonusReward, null, 'no random first-clear surprise any more');
});
test('perfect level (100 food, nothing stolen) -> Perfect Cookie prize: cards or a booster', () => {
  const s = M.newSave(); const before = JSON.stringify({ c: s.cards, b: s.bonusStock });
  const out = M.applyBattleResult(s, 0, 'win', 3, { kills: 60, foodLeft: 100, perfect: true }, () => 0.01);
  assert.ok(out.perfect && out.prize, 'prize granted');
  assert.notEqual(JSON.stringify({ c: s.cards, b: s.bonusStock }), before);
  const kinds = new Set(); for (let r = 0; r < 1; r += 0.05) kinds.add(M.grantPerfectPrize(M.newSave(), () => r).kind);
  assert.deepEqual([...kinds].sort(), ['bonus', 'cards'], 'prize table has cards and boosters');
  // battle side: perfect only if nothing was ever stolen
  const b = mk(); b.nextWave = b.waves.length; b.update(0.1); assert.equal(b.perfect, true);
  const b2 = mk(); b2.stats.stolen = 1; b2.foodStored = 100; b2.nextWave = b2.waves.length; b2.update(0.1);
  assert.equal(b2.result, 'win'); assert.equal(b2.perfect, false, 'stolen-then-returned is not perfect');
});

// ---------- 6/9. stats, upgrades, config ----------
test('every tower: core stats, per-stat upgrades in one config block, labels and formatting', () => {
  for (const [id, T] of Object.entries(C.TOWERS)) {
    // v0.5: the marble has no range (it rolls the straight trail); v0.6: the Tractor has no power/range (it lifts ants off ONE tile)
    if (id === 'tractor') { assert.equal(T.stats.power, null); assert.equal(T.stats.range, null); assert.equal(typeof T.liftSize, 'number'); }
    else { assert.equal(typeof T.stats.power, 'number', id); assert.ok(typeof T.stats.range === 'number' || (id === 'ball' && T.stats.range === null), id); }
    assert.ok(T.stats.rate === null || typeof T.stats.rate === 'number', id);
    assert.equal(T.upgrades.length, C.BATTLE.maxInBattleLevel - 1, id);
    assert.ok(T.desc && T.ability && T.powerLabel, id);
    for (let l = 1; l < C.BATTLE.maxInBattleLevel; l++) {
      const diff = upgradeDiff(id, l);
      assert.deepEqual(diff.map((d) => d.key).sort(), Object.keys(T.upgrades[l - 1]).filter((k) => k !== 'rateIfMaxLift').sort(), `${id} L${l} lists exactly its changes`); // rateIfMaxLift: Tractor, card L8+ only
      for (const d of diff) { assert.ok(typeof d.from === 'number' && d.from !== d.to, `${id} ${d.key} changes`); assert.ok(formatStat(id, d.key, d.to)); }
      const untouched = ['power', 'rate', 'range'].filter((k) => !(k in T.upgrades[l - 1]));
      for (const k of untouched) assert.equal(towerStat(id, k, l + 1), towerStat(id, k, l), `${id} ${k} unchanged by L${l + 1}`);
    }
  }
  assert.ok(upgradeDiff('slingshot', 1).length === 1, 'not every upgrade improves every stat');
  assert.equal(formatStat('slingshot', 'range', 120), '3.0 tiles'); // v0.4.1: range = circle radius in map cells (40 px each)
});
test('an in-battle upgrade reports what changed (before -> after) in its event', () => {
  const b = mk(); b.addCrumbs(100); b.picks[0] = 'slingshot'; b.playCard(0, 4, 3); b.picks[0] = 'slingshot';
  const r = b.playCard(0, 4, 3);
  assert.ok(r.upgrade); assert.deepEqual(r.diff.map((d) => d.key), ['power']);
  const ev = b.events.find((e) => e.type === 'upgrade'); assert.ok(ev && ev.diff[0].to > ev.diff[0].from && ev.pick === 0 && ev.cost === 5);
  assert.ok(b.events.find((e) => e.type === 'place').pick === 0, 'place event carries the tray slot for the card-fly animation');
});
test('UI timing: in-battle notices are short; tower config is the single tuning place', () => {
  assert.ok(C.UI.toastTime <= 1);
  const sim = readFileSync(new URL('../src/sim.js', import.meta.url), 'utf8');
  assert.ok(!/stat\('(damage|dps|radius|push)'\)/.test(sim), 'sim reads only the configured stat names');
});

// ---------- 10. maps ----------
test('maps: all parse and validate; levels use 6+ different maps incl. fork, two nests, crossing and props', () => {
  for (const [id, m] of Object.entries(C.MAPS)) assert.deepEqual(validateMap(id, m), [], id);
  const used = new Set(C.LEVELS.map((L) => L.map)); for (const id of used) assert.ok(C.MAPS[id], id);
  assert.ok(used.size >= 6);
  assert.equal(parseMap(C.MAPS.fork).routes.length, 2);
  const twin = parseMap(C.MAPS.twin).routes; assert.equal(twin.length, 2); assert.notDeepEqual(twin[0][0], twin[1][0], 'two different nests');
  assert.ok(parseMap(C.MAPS.cross).routes[0].length > 8);
  assert.ok(validateMap('bad', { grid: ['N.........', ...Array(10).fill('..........'), '.........C'] }).length > 0, 'disconnected map is rejected');
  const b = new Battle({ levelIndex: C.LEVELS.findIndex((L) => L.map === 'fork'), deck: DECK, seed: 1 });
  assert.deepEqual([b.spawn('worker').ri, b.spawn('worker').ri], [0, 1], 'ants alternate routes');
  const pr = b.props[0]; assert.equal(b.tileInfo(pr.c, pr.r).valid, false, 'props block building');
});

// ---------- 12. zero-count bonus ----------
test('prep: a selected booster with 0 stock is flagged (warning only since v0.3); auto-fix swaps it for one with stock', () => {
  const s = M.newSave(); for (const k of C.BONUS_TYPES) s.bonusStock[k] = 3; s.bonusStock.bomb = 0;
  assert.deepEqual(M.prepIssues(s, ['bomb', 'plane']).map(({ kind, bonus }) => ({ kind, bonus })), [{ kind: 'zeroBonus', bonus: 'bomb' }]);
  assert.ok(M.prepIssues(s, ['bomb', 'plane']).every((i) => i.blocking === false), 'non-blocking: the booster can be bought in battle');
  assert.deepEqual(M.prepIssues(s, ['freeze', 'plane']), []);
  const fixed = M.autoFixBonuses(s, ['bomb', 'plane']); assert.ok(!fixed.includes('bomb') && fixed.length === 2);
});

test('version 0.7.3 (versionCode 17) everywhere', () => {
  assert.equal(JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version, '0.7.3');
  const gr = readFileSync(new URL('../android/app/build.gradle', import.meta.url), 'utf8');
  assert.match(gr, /versionCode 17\b/); assert.match(gr, /versionName "0\.7\.3"/);
});

// ---------- v0.2.0 audit fixes (B8-B10) ----------
test('B8: no source reads a config key that does not exist (v0.5: CARD_LEVEL_BONUS replaced by per-tower cardUpgrades)', () => {
  const src = ['game.js', 'sim.js', 'meta.js', 'bot.js', 'art.js'].map((f) => readFileSync(new URL(`../src/${f}`, import.meta.url), 'utf8')).join('\n');
  assert.ok(!/CARD_LEVEL_BONUS/.test(src), 'old flat card bonus is gone');
  for (const m of src.matchAll(/C\.UI\.(\w+)/g)) assert.ok(m[1] in C.UI, `C.UI.${m[1]} is undefined`);
  for (const m of src.matchAll(/C\.(BATTLE|ECONOMY)\.(\w+)/g)) assert.ok(m[2] in C[m[1]], `C.${m[1]}.${m[2]} is undefined`);
  assert.ok(!/IN_BATTLE_LEVEL/.test(src));
});
test('B9: upgrade info panel time is 2.5 s (spec section 6)', () => { assert.equal(C.UI.upgradeInfoTime, 2.5); });
test('B10: marble roll shown = actual roll at the spot (same as aim/runLen); width has a unit', () => {
  const b = mk(); b.addCrumbs(500);
  let tw = null;
  for (let r = 0; r < 12 && !tw; r++) for (let c = 0; c < 10 && !tw; c++) { b.picks[0] = 'ball'; if (b.canPlay(0, c, r).ok) { b.playCard(0, c, r); tw = b.towers[b.towers.length - 1]; } }
  assert.ok(tw);
  { const R = b.rollFor(tw); assert.equal(R.len, tw.runLen); assert.equal(R.tiles, tw.trailDir ? tw.trailDir.run : 0); }
  assert.match(formatStat('ball', 'ballRadius', 13), /^0\.65 tiles$/);
  assert.match(formatStat('ball', 'ballRadius', 15.6), /tiles$/);
  for (const t of Object.keys(C.TOWERS)) for (let l = 1; l <= 2; l++) for (const d of upgradeDiff(t, l)) assert.ok(!/NaN|undefined/.test(`${d.label} ${formatStat(t, d.key, d.from)} ${formatStat(t, d.key, d.to)}`), `${t} L${l} ${d.key}`);
});
test('B10: single Perfect Cookie title, result overlay swallows taps (source check)', () => {
  const g = readFileSync(new URL('../src/game.js', import.meta.url), 'utf8');
  const body = g.slice(g.indexOf('function renderResult'), g.indexOf('// ---------------- CARDS'));
  assert.equal((body.match(/`Perfect \$\{TN\}!`/g) || []).length, 1); // v0.5: 'Perfect Cookie!' / 'Perfect Cake!' (world 2)
  assert.ok(body.indexOf("button('resultBlock'") < body.indexOf("button('rmap'"));
});
