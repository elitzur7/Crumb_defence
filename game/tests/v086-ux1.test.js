// v0.8.6 SR1/UX1: every one of the 182 card and battle steps must change a real effect.
// Card steps need at least +3%. Battle steps need at least +8%. Glue's battle 3->4 needs +15% added delay.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as C from '../src/config.js';
import { Battle, towerStat } from '../src/sim.js';

const DT = 1 / 30;
const run = (b, sec) => { for (let i = 0; i < sec / DT; i++) b.update(DT); };
function battle(type, cl) {
  const b = new Battle({ levelIndex: 0, deck: [type], seed: 7, cardLevels: { [type]: cl } });
  b.nextWaveAt = 1e9; b.foodStored = 1e9;
  return b;
}
function at(b, d) { const p = b.path.at(Math.max(0, Math.min(b.path.length - 1, d))); return p; }

function glueDelay(lvl, cl) {
  const b = battle('glue', cl);
  const tw = b.addTower('glue', 4, 3); tw.lvl = lvl;
  const start = tw.pathD - 20, goal = tw.pathD + 50;
  const ants = [0, 8, 16, 24].map((o) => b.spawn('worker', start + o));
  const t0 = b.time; let acc = 0, n = 0;
  for (let i = 0; i < 40 / DT && n < ants.length; i++) {
    b.update(DT);
    for (const a of ants) if (!a._g && a.d >= goal) { a._g = 1; n++; acc += b.time - t0; }
  }
  const free = (goal - (start + 12)) / C.ANTS.worker.speed;
  return acc / n - free;
}
function fanPush(lvl, cl, dist) {
  const b = battle('fan', cl);
  const tw = b.addTower('fan', 9, 3); tw.lvl = lvl; tw.cd = 0;
  const base = b.nearestOnTrail((tw.trailDir.nc + 0.5) * C.TILE, (tw.trailDir.nr + 0.5) * C.TILE);
  const a = b.spawn('worker', base.d); a.speed = 0; a.hp = a.maxHp = 9e4;
  if (dist) {
    const step = tw.ax < 0 ? -1 : 1;
    while (Math.hypot(a.x - tw.x, a.y - tw.y) < dist && a.d > 8 && a.d < b.path.length - 8) {
      a.d += step * 2; const p = at(b, a.d); a.x = p.x; a.y = p.y;
    }
  }
  let pushed = 0;
  const home = a.d;
  for (let i = 0; i < 8 / DT; i++) {
    const d0 = a.d; b.update(DT); pushed += a.d - d0;
    a.d = home; const p = at(b, home); a.x = p.x; a.y = p.y; a.speed = 0;
  }
  return Math.abs(pushed);
}
function tileDamage(type, cell, lvl, cl, sec, kind) {
  const b = battle(type, cl);
  const tw = b.addTower(type, cell[0], cell[1]); tw.lvl = lvl; tw.cd = 0;
  const nd = type === 'ball' ? b.nearestOnTrail(tw.lx, tw.ly) : b.nearestOnTrail(tw.x, tw.y);
  const spawn = (off) => {
    const a = b.spawn(kind, nd.d + off); a.speed = 0; a.hp = a.maxHp = 9e6; a.armor = 0; return a;
  };
  spawn(type === 'ball' ? 12 : 0);
  if (type === 'zapper') { spawn(6); spawn(12); }
  run(b, sec);
  return tw.rec.dmg;
}
function crossDelay(type, lvl, cl) {
  const b = battle(type, cl);
  const tw = b.addTower(type, 4, 3); tw.lvl = lvl;
  const start = tw.pathD - 20, goal = tw.pathD + 50;
  const ants = [0, 8, 16, 24].map((o) => b.spawn('worker', start + o));
  const t0 = b.time; let acc = 0, n = 0;
  for (let i = 0; i < 40 / DT && n < ants.length; i++) {
    b.update(DT);
    for (const a of ants) if (!a._g && a.d >= goal) { a._g = 1; n++; acc += b.time - t0; }
  }
  const free = (goal - (start + 12)) / C.ANTS.worker.speed;
  return acc / Math.max(1, n) - free;
}
function tractorKills(lvl, cl, kind) {
  const b = battle('tractor', cl);
  let tw = null, best = -1;
  for (let r = 0; r < 14; r++) for (let c = 0; c < 10; c++) {
    if (b.isPathTile(c, r) || !b.touchesTrail(c, r)) continue;
    const dir = b.trailDirection(c, r); if (!dir || dir.run < 4) continue;
    if (dir.run > best) { best = dir.run; tw = [c, r]; }
  }
  const tower = b.addTower('tractor', tw[0], tw[1]); tower.lvl = lvl; tower.cd = 0;
  let kills = 0;
  for (let i = 0; i < 150 / DT; i++) {
    if (i % 15 === 0) {
      const a = b.spawn(kind, 20); a.speed = 0; a.hp = a.maxHp = 40;
      const nd = b.nearestOnTrail((tower.trailDir.nc + 0.5) * C.TILE, (tower.trailDir.nr + 0.5) * C.TILE);
      a.d = nd.d; const p = at(b, nd.d); a.x = p.x; a.y = p.y;
    }
    b.update(DT);
  }
  return b.ants.filter((a) => a.dead).length + (tower.lifts || 0);
}

function measure(id, lvl, cl, keys, otherRange) {
  if (id === 'glue') return glueDelay(lvl, cl);
  if (id === 'fan') {
    const dist = keys.includes('range') && !keys.includes('power') && !keys.includes('rate') ? otherRange : 0;
    return fanPush(lvl, cl, dist);
  }
  if (id === 'tractor') return tractorKills(lvl, cl, keys.includes('liftSize') ? 'worker' : 'small');
  if (id === 'zapper') return tileDamage('zapper', [4, 4], lvl, cl, 8, 'flyer');
  if (id === 'ball') return tileDamage('ball', [0, 3], lvl, cl, 30, 'worker');
  if (id === 'pheromone' && !keys.includes('power')) return crossDelay('pheromone', lvl, cl);
  if (id === 'pheromone' || id === 'lava' || id === 'gate' || id === 'spray') {
    const cell = C.TOWERS[id].place === 'path' ? [4, 3] : [4, 4];
    return tileDamage(id, cell, lvl, cl, 8, 'worker');
  }
  const cell = C.TOWERS[id].place === 'path' ? [5, 3] : [4, 4];
  return tileDamage(id, cell, lvl, cl, 8, 'worker');
}

test('UX1: all 182 upgrade steps change a real battle effect', () => {
  const rows = [];
  for (const id of Object.keys(C.TOWERS)) {
    const T = C.TOWERS[id];
    const steps = [];
    T.upgrades.forEach((u, i) => steps.push([`battle ${i + 1}->${i + 2}`, i + 1, 1, i + 2, 1, Object.keys(u), id === 'glue' && i === 2 ? 0.15 : 0.08]));
    T.cardUpgrades.forEach((u, i) => steps.push([`card ${i + 1}->${i + 2}`, 1, i + 1, 1, i + 2, Object.keys(u), 0.03]));
    for (const [name, l1, c1, l2, c2, keys, need] of steps) {
      const r1 = towerStat(id, 'range', l1, c1), r2 = towerStat(id, 'range', l2, c2);
      const boundary = r1 && r2 ? (r1 + r2) / 2 : 0;
      const before = measure(id, l1, c1, keys, boundary);
      const after = measure(id, l2, c2, keys, boundary);
      let pct = null, ok = 'fail';
      if (before == null || after == null || Number.isNaN(before) || Number.isNaN(after)) ok = 'NOT MEASURED';
      else if (before <= 0 && after > before) { pct = 1; ok = 'pass'; }
      else if (before > 0) { pct = (after - before) / before; ok = pct + 1e-9 >= need ? 'pass' : 'fail'; }
      rows.push({ tower: id, step: name, before, after, pct: pct == null ? null : +pct.toFixed(3), need, ok });
    }
  }
  try { fs.mkdirSync('/workspace/qa/v0.8.6', { recursive: true }); fs.writeFileSync('/workspace/qa/v0.8.6/upgrade-effect.json', JSON.stringify({ n: rows.length, pass: rows.filter((r) => r.ok === 'pass').length, fail: rows.filter((r) => r.ok === 'fail').length, skip: rows.filter((r) => r.ok === 'NOT MEASURED').length, rows }, null, 1)); } catch (e) {}
  const bad = rows.filter((r) => r.ok !== 'pass');
  assert.equal(rows.length, 182);
  assert.deepEqual(bad, [], bad.slice(0, 8).map((r) => `${r.tower} ${r.step} ${r.before}->${r.after} (${r.pct})`).join('; '));
});
