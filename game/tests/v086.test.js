// v0.8.6: board translation, marble radius, uncapped cards, economy factor.
import test from 'node:test';
import assert from 'node:assert/strict';
import * as C from '../src/config.js';
import { Battle, towerStat, cardPowerQ } from '../src/sim.js';
import { parseMap } from '../src/maps.js';
import * as M from '../src/meta.js';

test('LY1: every level path is the released route translated one row, and the new rows can hold a side tower', () => {
  assert.equal(C.GRID_ROWS, 14);
  for (let i = 0; i < C.LEVELS.length; i++) {
    const src = parseMap(C.MAPS[C.LEVELS[i].map], 10, 12);
    const b = new Battle({ levelIndex: i, deck: ['slingshot'], seed: 1 });
    const rt = src.routes[0];
    let len = 0;
    for (let k = 1; k < rt.length; k++) len += Math.hypot((rt[k][0] - rt[k - 1][0]) * C.TILE, (rt[k][1] - rt[k - 1][1]) * C.TILE);
    assert.ok(Math.abs(b.path.length - len) < 1.5, `L${i + 1} length ${b.path.length} vs ${len}`);
    const side = [];
    for (let r = 0; r < 14; r++) for (let c = 0; c < 10; c++) if (!b.isPathTile(c, r)) side.push([c, r]);
    assert.ok(side.some(([c, r]) => r === 0 || r === 13), `L${i + 1} has an off-path cell on a new row`);
    const spot = side.find(([c, r]) => (r === 0 || r === 13) && b.placeRuleOk('slingshot', c, r));
    assert.ok(spot, `L${i + 1} new row is placeable`);
  }
});

test('MB1: marble collision radius stays 13 at every card and battle level', () => {
  for (const cl of [1, 4, 8, 10]) for (const lvl of [1, 3, 6]) assert.equal(towerStat('ball', 'ballRadius', lvl, cl), 13);
});

test('EX1: card power Q is 1.08 to the level, and a world does not clamp the card', () => {
  assert.ok(Math.abs(cardPowerQ(1) - 1) < 1e-9);
  assert.ok(Math.abs(cardPowerQ(10) - Math.pow(1.08, 9)) < 1e-9);
  const b = new Battle({ levelIndex: 0, deck: ['slingshot'], cardLevels: { slingshot: 10 }, seed: 1 });
  assert.equal(b.cardLevels.slingshot, 10);
  assert.equal(C.MERGE.coinCost[2], 40);
});

test('version is 0.8.6', () => { assert.equal(C.VERSION, '0.8.6'); });
