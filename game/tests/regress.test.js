// Regression tests for the v0.1.1 audit findings (logic side). UI-side checks live in tools/regress-ui.mjs.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as C from '../src/config.js';
import { Battle } from '../src/sim.js';
import * as M from '../src/meta.js';
import { addFloatText } from '../src/fx.js';

const mk = (o = {}) => new Battle({ levelIndex: 0, deck: ['slingshot', 'spray', 'glue', 'fan', 'ball'], seed: 3, bonusTypes: ['bomb', 'freeze'], bonusStock: { bomb: 3, freeze: 3 }, ...o });
const side = (b) => { for (let c = 0; c < 10; c++) for (let r = 0; r < 12; r++) { const t = b.tileInfo(c, r); if (t.valid && !t.onPath && !t.tower) return { c, r }; } };

test('B1: while paused no card, wave, redraw or bonus action works and time stands still', () => {
  const b = mk(); b.addCrumbs(100); b.picks[0] = 'slingshot';
  b.paused = true;
  const t = side(b);
  assert.equal(b.playCard(0, t.c, t.r).ok, false);
  assert.equal(b.canPlay(0, t.c, t.r).why, 'paused');
  assert.equal(b.callWaveEarly(), 0); assert.equal(b.nextWave, 0);
  assert.equal(b.reroll(), false); assert.equal(b.crumbs, 100);
  assert.equal(b.useBonus('freeze'), false); assert.equal(b.bonusUsesLeft, C.BATTLE.maxBonusUses);
  const t0 = b.time; b.update(1); assert.equal(b.time, t0);
  assert.equal(b.towers.length, 0); assert.equal(b.cardsPlayed, 0);
  b.paused = false;
  assert.equal(b.playCard(0, t.c, t.r).ok, true, 'works again after resume');
});

test('B2: a used bonus is deducted from the save immediately (Restart/Quit cannot refund it)', () => {
  const save = M.newSave(); save.bonusStock.bomb = 3; const start = save.bonusStock.bomb; // v0.3: stock starts at 0
  const b = mk({ bonusStock: { ...save.bonusStock }, onBonusUsed: (type) => M.consumeBonus(save, type) });
  assert.ok(b.useBonus('bomb', 100, 100));
  assert.equal(save.bonusStock.bomb, start - 1, 'deducted at the moment of use');
  // simulate Quit/Restart: battle thrown away without applyBattleResult -> stock stays deducted
  const b2 = mk({ bonusStock: { ...save.bonusStock }, onBonusUsed: (type) => M.consumeBonus(save, type) });
  assert.equal(b2.bonusStock.bomb, start - 1, 'restarted battle sees the reduced stock');
  // finishing a battle must not deduct a second time
  M.applyBattleResult(save, 0, 'lose', 0, {});
  assert.equal(save.bonusStock.bomb, start - 1);
  // and the stock never goes negative
  save.bonusStock.freeze = 0; assert.equal(M.consumeBonus(save, 'freeze'), false); assert.equal(save.bonusStock.freeze, 0);
});

test('B2: game.js wires the deduction to the moment of use and no longer deducts at battle end', () => {
  const src = readFileSync(new URL('../src/game.js', import.meta.url), 'utf8');
  assert.match(src, /onBonusUsed: \(type\) => \{ M\.consumeBonus\(S\.save, type\); persist\(\); \}/);
  assert.match(src, /applyBattleResult\(S\.save, b\.levelIndex, b\.result, b\.stars, \{ kills: b\.stats\.kills, foodLeft: b\.foodStored, perfect: b\.perfect, time: b\.time \}\)/);
  assert.ok(!/usedBonuses|bonusStock\[b\] = Math\.max\(0/.test(readFileSync(new URL('../src/meta.js', import.meta.url), 'utf8')), 'meta no longer deducts bonuses at battle end');
});

test('B5: duplicate floating texts merge instead of piling up', () => {
  const fx = [];
  for (let i = 0; i < 10; i++) addFloatText(fx, { key: 'food', x: 100 + i, y: 200, n: 1, fmt: (n) => `+${n} food back!`, life: 1.1 });
  const food = fx.filter((f) => f.k === 'txt');
  assert.equal(food.length, 1);
  assert.equal(food[0].s, '+10 food back!');
  for (let i = 0; i < 6; i++) addFloatText(fx, { key: 'queen', x: 50 + i * 100, y: 80, n: 1, fmt: () => 'Scouts, go!', life: 1 });
  assert.equal(fx.filter((f) => f.key === 'queen').length, 1, 'only one "Scouts, go!" at a time');
  // far-apart different events still show separately, but the total is capped
  for (let i = 0; i < 40; i++) addFloatText(fx, { key: 'steal' + i, x: i * 100, y: i * 100, n: 1, fmt: (n) => `-${n}`, life: 1 });
  assert.ok(fx.filter((f) => f.k === 'txt').length <= 10);
  // crumb pop-ups (own kind) merge too
  const c = [];
  for (let i = 0; i < 8; i++) addFloatText(c, { k: 'crumbTxt', key: 'crumb', x: 10, y: 10, n: 2, fmt: (n) => n, life: 0.9 });
  assert.equal(c.length, 1); assert.equal(c[0].n, 16);
});

test('debug hook only in the test build: production bundle has no window.__game', () => {
  const prod = readFileSync(new URL('../www/game.js', import.meta.url), 'utf8');
  const testB = readFileSync(new URL('../www-test/game.js', import.meta.url), 'utf8');
  assert.ok(!prod.includes('__game'), 'www/game.js must not expose __game');
  assert.ok(testB.includes('window.__game'));
});

test('Android config.xml has no <access origin="*"> and the manifest requests no INTERNET permission', () => {
  const xml = readFileSync(new URL('../android/app/src/main/res/xml/config.xml', import.meta.url), 'utf8');
  assert.ok(!/<access\s+origin=/.test(xml));
  const man = readFileSync(new URL('../android/app/src/main/AndroidManifest.xml', import.meta.url), 'utf8');
  assert.ok(!man.includes('android.permission.INTERNET'));
});
