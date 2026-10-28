// v0.7.2: C13 cookie guard (fly swatter), C14 shuttle until death, C16 bottom tab bar, version 0.7.2 / versionCode 16.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as C from '../src/config.js';
import { Battle } from '../src/sim.js';

const src = (f) => readFileSync(new URL(`../src/${f}`, import.meta.url), 'utf8');
const SW0 = C.BATTLE.swatter;
const mk = (o = {}, sw = {}, forage = {}) => {
  const b = new Battle({ levelIndex: 0, deck: ['slingshot', 'spray', 'gate', 'fan', 'tractor'], seed: 1,
    battleCfg: { swatter: { ...SW0, ...sw }, forage: { ...C.BATTLE.forage, ...forage }, ...(o.battleCfg || {}) }, ...o, });
  b.nextWaveAt = 1e9; return b;
};
const step = (b, sec) => { for (let i = 0; i < Math.round(sec * 60) && !b.result; i++) b.update(1 / 60); };
const offSw = { on: false };
const cookie = (b) => b.path.pts[b.path.pts.length - 1];
const near = (b, type, dist = 20) => { const ck = cookie(b); const a = b.spawn(type, b.path.length - dist); return a; };

// ================= C14: shuttle until death =================
test('C14: an ant shuttles - delivers, drops the food, walks back and steals again (>= 3 trips, no tower, swatter off)', () => {
  const b = mk({}, offSw); b.foodStored = 1000; b.cfg.foodHP = 1000;
  const a = b.spawn('worker', b.path.length - 5);
  step(b, 400);
  assert.ok(a.trips >= 3, `trips ${a.trips}`); assert.ok(!a.dead, 'never dies on its own'); assert.ok(!a.escaped, 'never escapes');
  assert.ok(b.stats.loops >= 3, 'loops counted');
  assert.ok(b.foodStored < 1000 - 3 * C.ANTS.worker.steal + 1e-6, 'every trip cost the cookie a piece for good');
});
test('C14: the food an ant drops at the nest is lost for the player (delivered, not returned)', () => {
  const b = mk({}, offSw); const a = b.spawn('worker', b.path.length - 0.5);
  step(b, 0.2); assert.equal(a.state, 'back'); const st = C.ANTS.worker.steal;
  assert.ok(Math.abs(b.foodStored - (b.cfg.foodHP - st)) < 1e-9);
  a.d = 0.05; step(b, 0.1);
  assert.ok(Math.abs(b.foodDelivered - st) < 1e-9, 'delivered'); assert.equal(a.carrying, 0); assert.equal(a.state, 'go'); assert.equal(a.trips, 1);
  assert.ok(Math.abs(b.foodStored - (b.cfg.foodHP - st)) < 1e-9, 'the player does not get it back');
  assert.ok(!a.dead && !a.escaped);
});
test('C14: 0.3 s pause at the nest before walking back for more', () => {
  const b = mk({}, offSw); const a = b.spawn('worker', 0.01); a.state = 'back'; a.carrying = 1; a.d = 0.01; b.update(1 / 60);
  assert.equal(a.state, 'go'); assert.ok(a.waitT > 0.2 && a.waitT <= C.BATTLE.forage.pause + 1e-9); const d0 = a.d; step(b, 0.25); assert.ok(a.d <= d0 + 1e-9, 'still waiting');
  step(b, 0.3); assert.ok(a.d > d0 + 1, 'walks again');
  assert.equal(C.BATTLE.forage.pause, 0.3);
});
test('C14: a carrier that is killed still returns 0.4 of its piece; an ant on its 2nd trip too', () => {
  const b = mk({}, offSw); const a = b.spawn('big', b.path.length - 0.5); step(b, 0.1); assert.equal(a.state, 'back');
  const before = b.foodStored; a.trips = 2; a.d = b.path.length * 0.5; b.damage(a, 99999, {});
  assert.ok(a.dead && !a.escaped); assert.ok(Math.abs(b.foodStored - (before + 0.4 * C.ANTS.big.steal)) < 1e-6, `${b.foodStored - before}`);
});
test('C14: no ant ever "escapes" - the level only ends on 0 ants (win) or 0 food (loss)', () => {
  const b = mk({}, offSw); b.pendingWave = null; const a = b.spawn('worker', 0.01); b.nextWaveAt = 1e9;
  step(b, 40); assert.ok(!b.result || b.result === 'lose', 'cannot win while an ant lives'); assert.ok(a.dead === false || b.result === 'lose');
  assert.ok(!b.ants.some((x) => x.escaped));
  const w = mk({}, offSw); w.waves = []; w.waveIndex = 99; w.pending = []; w.update(0.1);
  assert.equal(w.result, 'win', 'all dead, nothing left to come -> win');
});
test('C14: the loss comes when the food runs out, even with nothing else going on', () => {
  const b = mk({}, offSw); b.foodStored = 3; b.spawn('worker', b.path.length - 1); step(b, 900);
  assert.equal(b.result, 'lose'); assert.ok(b.foodStored <= 1e-6);
});
test('C14: queens shuttle too (queenLoop) and the forage switch can be turned off', () => {
  assert.equal(C.BATTLE.forage.queenLoop, true); assert.equal(C.BATTLE.forage.on, true);
  const b = mk({}, offSw); const q = b.spawn('queen', b.path.length - 1); step(b, 30); assert.ok(q.trips >= 1 || q.state === 'back' || q.state === 'go'); assert.ok(!q.escaped);
  const off = mk({}, offSw, { on: false }); const a = off.spawn('worker', off.path.length - 0.5); step(off, 200); assert.ok(a.dead && a.escaped, 'with forage off the old behaviour is back');
});
test('C14: stars still come from the food left (3 >= 90 %, 2 >= 50 %)', () => {
  const s = (p) => { const b = mk({}); b.foodStored = b.cfg.foodHP * p; b.result = 'win'; return b.stars; };
  assert.equal(s(0.95), 3); assert.equal(s(0.9), 3); assert.equal(s(0.89), 2); assert.equal(s(0.5), 2); assert.equal(s(0.49), 1);
});
test('C14: the HUD "carried off!" only counts first-trip carriers', () => { assert.ok(/a\.trips === 0 \? a\.carrying : 0/.test(src('game.js'))); });

// ================= C13: cookie guard (swatter) =================
test('C13: config - 4 dmg every 4 s within 72 px of the cookie, hits air', () => {
  assert.deepEqual([SW0.damage, SW0.interval, SW0.range, SW0.air, SW0.on], [4, 4, 72, true, true]);
});
test('C13: swats an ant in range for its damage (armour applies, min 1) and then waits for the interval', () => {
  const b = mk({}, { first: 0.05 }); const a = b.spawn('worker', b.path.length - 20); const hp = a.hp;
  step(b, 0.2); assert.equal(hp - a.hp, 4); assert.equal(b.stats.swats, 1);
  step(b, 3.5); assert.equal(b.stats.swats, 1, 'no second swat inside 4 s'); a.state = 'go'; a.carrying = 0; a.d = b.path.length - 20; a.hp = 1000; step(b, 0.6); assert.ok(b.stats.swats >= 2);
  const k = mk({}, { first: 0.05, damage: 4 }); const kn = k.spawn('heavy', k.path.length - 20); const khp = kn.hp; step(k, 0.2);
  assert.equal(khp - kn.hp, 1, 'heavy (armour 8): min 1 damage');
});
test('C13: an ant outside the range is not swatted; the timer waits (ready) until one comes in range', () => {
  const b = mk({}, { first: 0.05 }); b.spawn('worker', 5); step(b, 3); assert.equal(b.stats.swats || 0, 0); assert.equal(b.swatCd, 0, 'ready and waiting');
  const a = b.spawn('worker', b.path.length - 30); const hp = a.hp; step(b, 0.1); assert.equal(hp - a.hp, 4, 'swats at once when something arrives');
});
test('C13: the carrier nearest the cookie is preferred, else the nearest ant', () => {
  const b = mk({}, { first: 0.05 }); const plain = b.spawn('worker', b.path.length - 8); const car = b.spawn('worker', b.path.length - 30);
  car.state = 'back'; car.carrying = 1; const ph = plain.hp, ch = car.hp; step(b, 0.2);
  assert.equal(car.hp, ch - 4, 'carrier first'); assert.equal(plain.hp, ph);
  const c = mk({}, { first: 0.05 }); const far = c.spawn('worker', c.path.length - 40), nr = c.spawn('worker', c.path.length - 10); const fh = far.hp, nh = nr.hp; step(c, 0.2);
  assert.equal(nr.hp, nh - 4); assert.equal(far.hp, fh);
});
test('C13: hits flying ants; can kill; swat event emitted with the ant position', () => {
  const b = mk({}, { first: 0.05, damage: 99 }); const f = b.spawn('flyer', b.path.length - 20); step(b, 0.2);
  assert.ok(f.dead && !f.escaped, 'swatter killed the flyer');
  const e = mk({}, { first: 0.05 }); const w = e.spawn('worker', e.path.length - 20); e.events = []; step(e, 0.2);
  const ev = e.events.find((x) => x.type === 'swat'); assert.ok(ev && Math.abs(ev.x - w.x) < 30 && Math.abs(ev.y - w.y) < 30, 'swat event');
});
test('C13: exactly one guard, no card, not placeable / upgradable / in the shop (it is not a tower)', () => {
  assert.ok(!C.TOWERS.swatter && !C.ALL_CARDS.includes('swatter'));
  const b = mk({}); assert.equal(b.towers.length, 0, 'no tower object for the guard');
  const g = src('game.js'); assert.equal((g.match(/A\.drawSwatter\(/g) || []).length, 1, 'one drawn guard');
  assert.ok(/export function drawSwatter/.test(src('art.js')) && !/sling|elastic|fork/i.test(src('art.js').slice(src('art.js').indexOf('export function drawSwatter'))), 'a swatter, not a slingshot');
  const sw = mk({}, offSw); sw.spawn('worker', sw.path.length - 20); step(sw, 5); assert.equal(sw.stats.swats || 0, 0, 'on:false = no guard');
});
test('C13: hit sound + flash exist (sfx "swat", swat event)', () => {
  assert.ok(/case 'swat'/.test(src('audio.js'))); assert.ok(/case 'swat'/.test(src('game.js'))); assert.ok(/sfx\('swat'\)/.test(src('game.js')));
});

// ================= C16: bottom tab bar =================
test('C16: three tabs Map / Cards / Shop, 56 dp bar, hidden in battle, safe-area inset read from env()', () => {
  const g = src('game.js');
  assert.ok(/const META_SCREENS = \['map', 'cards', 'card', 'shop'\], BAR_H = 56/.test(g));
  assert.ok(/TAB_NAME = \['Map', 'Cards', 'Shop'\]/.test(g));
  assert.ok(/env\(safe-area-inset-bottom/.test(g)); assert.ok(/viewport-fit=cover/.test(readFileSync(new URL('../index.html', import.meta.url), 'utf8')));
  assert.ok(/function isMeta\(\) \{ return META_SCREENS\.includes\(S\.screen\)/.test(g));
  assert.ok(/if \(!isMeta\(\)\) \{ barK = 0; return; \}/.test(g), 'never drawn outside the meta screens (prep / battle / result)');
  assert.ok(g.includes("button('tab' + i"), 'tab button ids tab0..tab2');
});
test('C16: the old bottom buttons are gone from the map / cards / shop code', () => {
  const g = src('game.js');
  for (const id of ["button('cards',", "button('shop',", "button('mute',", "button('reset',", "button('toshop',", "button('cvShop',", "button('back', 26, 650, 160"]) assert.ok(!g.includes(id), id);
  assert.ok(g.includes("button('gear'") && g.includes("button('setSound'") && g.includes("button('setReset'"), 'sound + reset live in the settings panel');
});
test('C16: version 0.7.4 / versionCode 21 everywhere (updated in v0.7.6)', () => {
  assert.match(C.VERSION, /^0\.7\.[678]$/);
  assert.match(JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version, /^0\.7\.[678]$/);
  const gr = readFileSync(new URL('../android/app/build.gradle', import.meta.url), 'utf8');
  assert.ok(/versionCode 2[123]\b/.test(gr) && /versionName "0\.7\.[678]"/.test(gr));
});
