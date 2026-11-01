// v0.8.2 Pass 2 (M7a-M7f, M7i): the specials engine. W6 does not exist yet in this pass, so battles run on a W5 map with b.level patched to world 6.
import test from 'node:test'; import assert from 'node:assert/strict';
import * as C from '../src/config.js'; import { Battle, applyArmor } from '../src/sim.js'; import { playLevel, unlockedAt } from '../src/bot.js';
const DECK = ['slingshot', 'laser', 'lizard', 'sound', 'zapper'];
function mk(world = 6, cl = 5, extra = {}) {
  const b = new Battle({ levelIndex: 44, deck: DECK, seed: 3, cardLevels: Object.fromEntries(DECK.map((d) => [d, cl])), noCardLevelCap: true, ...extra });
  b.level = { ...b.level, world }; b.crumbs = 9999; return b;
}
const freeze = (a) => { a.speed = 0; a.hp = a.maxHp = 1e6; return a; };
const at = (b, a, d) => { a.d = d; const q = b.routes[a.ri].at(d); a.x = q.x; a.y = q.y; return a; };
// a tower on the free tile nearest to trail distance d
function towerNear(b, type, d, notD = null) {
  const q = b.routes[0].at(d); let best = null;
  for (let r = 0; r < 12; r++) for (let c = 0; c < 10; c++) if (b.placeRuleOk(type, c, r) && !b.towers.some((t) => t.c === c && t.r === r)) { const h = Math.hypot(c * 40 + 20 - q.x, r * 40 + 20 - q.y); if (!best || h < best.h) best = { c, r, h }; }
  const tw = b.addTower(type, best.c, best.r); tw.cd = 0; return tw;
}
const dFor = (b, d1, chord) => { const p = b.routes[0].at(d1); for (let d = d1 + 2; d < b.routes[0].length; d += 1) { const q = b.routes[0].at(d); if (Math.hypot(q.x - p.x, q.y - p.y) >= chord) return d; } return null; };

test('M7a: specialActive - false on every W1-W5 level even at CL6; W6 needs CL5; five towers carry a special with text', () => {
  assert.equal(C.SPECIALS_FROM_WORLD, 6); assert.equal(C.SPECIAL_CARD_LEVEL, 5);
  for (const id of ['slingshot', 'laser', 'lizard', 'sound', 'zapper']) { const s = C.TOWERS[id].special; assert.ok(s && s.id && s.name && s.text && s.params, id); assert.ok(s.text.length <= 60, id + ' text length'); for (const w of [1, 2, 3, 4, 5]) assert.equal(C.specialActive(id, { world: w }, 6), false, `${id} W${w}`); assert.equal(C.specialActive(id, { world: 6 }, 4), false); assert.equal(C.specialActive(id, { world: 6 }, 5), true); assert.equal(C.specialActive(id, { world: 6 }, 6), true); }
  assert.equal(C.specialActive('spray', { world: 6 }, 6), false, 'towers without a special are never active');
  assert.equal(C.TUNING.specials, true, 'the tuning flag defaults to true');
});
test('M7a: the flag turns every special off; W<=5 spec() is null at CL6', () => {
  const on = mk(6, 5), off = mk(6, 5, { specials: false }); const a = towerNear(on, 'slingshot', 100), z = towerNear(off, 'slingshot', 100);
  assert.ok(on.spec(a)); assert.equal(off.spec(z), null);
  const w5 = mk(5, 6); assert.equal(w5.spec(towerNear(w5, 'laser', 100)), null);
  const cl4 = mk(6, 4); assert.equal(cl4.spec(towerNear(cl4, 'laser', 100)), null);
});
test('M7b Ricochet: 40 px apart -> second ant takes max(1, power*0.5 - armor); 80 px apart no jump; flyer no jump', () => {
  const run = (chord, secondType = 'worker', armor2 = 0) => {
    const b = mk(); const A = freeze(b.spawn('worker', 0, 0)), B = freeze(b.spawn(secondType, 0, 0)); const d1 = 200; const d2 = dFor(b, d1, chord); assert.ok(d2);
    at(b, A, d1); if (secondType === 'flyer') { B.x = A.x + chord; B.y = A.y; } else at(b, B, d2); B.armor = armor2;
    const tw = towerNear(b, 'slingshot', d1); tw.cd = 999; const P = tw.stat('power'); const h0 = B.hp;
    b.projectiles.push({ x: A.x, y: A.y, target: A, dmg: P, speed: 1e6, src: tw }); b.update(0.001);
    return { dealt: h0 - B.hp, P, hitA: 1e6 - A.hp, armor2 };
  };
  const r = run(40, 'worker', 1); assert.ok(r.hitA > 0); assert.ok(Math.abs(r.dealt - Math.max(1, r.P * 0.5 - 1)) < 1e-6, `got ${r.dealt}`);
  assert.equal(run(80).dealt, 0, '80 px: no jump'); assert.equal(run(40, 'flyer').dealt, 0, 'flyer: no jump');
  const f = run(40, 'worker', 99); assert.ok(Math.abs(f.dealt - 1) < 1e-6, 'armor floor 1');
});
test('M7b Ricochet is off at CL4, in W5 and with the flag off', () => {
  for (const mkb of [() => mk(6, 4), () => mk(5, 6), () => mk(6, 5, { specials: false })]) {
    const b = mkb(); const A = freeze(b.spawn('worker', 0, 0)), B = freeze(b.spawn('worker', 0, 0)); at(b, A, 200); at(b, B, dFor(b, 200, 40));
    const tw = towerNear(b, 'slingshot', 200); tw.cd = 999; const h0 = B.hp; b.projectiles.push({ x: A.x, y: A.y, target: A, dmg: 50, speed: 1e6, src: tw }); b.update(0.001); assert.equal(B.hp, h0);
  }
});
test('M7c Burn-through: armor-4 sprinter 5 hits -> 3, 10 -> 2, 20 -> 0; queens immune; every tower benefits', () => {
  const b = mk(); const A = freeze(b.spawn('sprinter', 0, 0)); A.armor = 4; at(b, A, 200); const tw = towerNear(b, 'laser', 200); const want = new Map([[5, 3], [10, 2], [15, 1], [20, 0], [25, 0]]);
  let guard = 0; while ((A.burnHits || 0) < 25 && guard++ < 4000) { b.update(0.05); const n = A.burnHits || 0; if (want.has(n) && !want.get('done' + n)) { assert.equal(A.armor, want.get(n), `after ${n} hits`); want.set('done' + n, 1); } }
  assert.equal(A.shred, 4); assert.equal(A.armor, 0);
  for (const q of ['queen5', 'queen4']) { const b2 = mk(); const Q = freeze(b2.spawn(q, 0, 0)); const a0 = Q.armor; at(b2, Q, 200); const lt = towerNear(b2, 'laser', 200); let hits = 0; const dmg0 = b2.damage.bind(b2); b2.damage = (...x) => { if (x[0] === Q && x[2] && x[2].src && x[2].src.type === 'laser') hits++; return dmg0(...x); }; for (let g = 0; g < 400 && hits < 100; g++) { lt.cd = 0; b2.update(0.001); } assert.ok(hits >= 100, 'hits ' + hits); assert.equal(Q.armor, a0, q + ' keeps its armor'); }
  assert.equal(applyArmor(10, 0), 10, 'armor shred feeds the shared armor rule');
  const b3 = mk(); const S = freeze(b3.spawn('sprinter', 0, 0)); S.armor = 2; const real = b3.damage(S, 10, { src: { type: 'bomb' } }); S.armor -= 1; const real2 = b3.damage(S, 10, { src: { type: 'bomb' } }); assert.equal(real - real2, -1, 'less armor -> more damage from any source');
});
test('M7c Burn-through off in W5 / at CL4 / flag off: no armor loss', () => {
  for (const mkb of [() => mk(5, 6), () => mk(6, 4), () => mk(6, 5, { specials: false })]) { const b = mkb(); const A = freeze(b.spawn('sprinter', 0, 0)); A.armor = 4; at(b, A, 200); towerNear(b, 'laser', 200); for (let i = 0; i < 400; i++) b.update(0.05); assert.equal(A.armor, 4); assert.equal(A.burnHits, undefined); }
});
test('M7d Pounce: fresh worker takes 2x then 1x; a glazed ant with its shield up takes 1x; healed back to full takes 2x again', () => {
  const b = mk(); const A = b.spawn('worker', 0, 0); A.speed = 0; at(b, A, 200); const tw = towerNear(b, 'lizard', 200); const P = tw.stat('power'); A.armor = 0; A.hp = A.maxHp = 1e6;
  const fire = () => { const h = A.hp; tw.cd = 0; tw.chew = 0; for (let i = 0; i < 40 && A.hp === h; i++) b.update(0.05); return h - A.hp; };
  const d1 = fire(), d2 = fire(); assert.ok(Math.abs(d1 - 2 * P) < 1e-6, `first ${d1} vs ${2 * P}`); assert.ok(Math.abs(d2 - P) < 1e-6, `second ${d2}`);
  A.hp = A.maxHp; const d3 = fire(); assert.ok(Math.abs(d3 - 2 * P) < 1e-6, 'healed to full: pounce again');
  const b2 = mk(); const G = b2.spawn('glazed', 0, 0); G.speed = 0; at(b2, G, 200); const tw2 = towerNear(b2, 'lizard', 200); assert.ok(G.shield > 0); G.armor = 0; const s0 = G.shield, h0 = G.hp; tw2.cd = 0; for (let i = 0; i < 40 && G.shield === s0; i++) b2.update(0.05); assert.ok(Math.abs((s0 - G.shield) - tw2.stat('power')) < 1e-6, 'shield up -> 1x');
});
test('M7e Crescendo: pulses 1,2 normal, 3 and 6 = x1.3; the counter belongs to the tower (new tower = fresh counter)', () => {
  const b = mk(); const A = freeze(b.spawn('worker', 0, 0)); at(b, A, 200); const tw = towerNear(b, 'sound', 200); const P = tw.stat('power'); const seq = [];
  for (let n = 0; n < 6; n++) { const h = A.hp; tw.cd = 0; b.update(0.001); seq.push((h - A.hp) / P); A.stunT = 0; }
  assert.deepEqual(seq.map((x) => +x.toFixed(3)), [1, 1, 1.3, 1, 1, 1.3]);
  const tw2 = towerNear(b, 'sound', 200); assert.equal(tw2.pulses, undefined, 'a rebuilt tower starts at 0');
  const off = mk(6, 5, { specials: false }); const A2 = freeze(off.spawn('worker', 0, 0)); at(off, A2, 200); const t3 = towerNear(off, 'sound', 200); for (let n = 0; n < 3; n++) { const h = A2.hp; t3.cd = 0; off.update(0.001); assert.ok(Math.abs(h - A2.hp - t3.stat('power')) < 1e-3); A2.stunT = 0; }
});
test('M7f Static: the Zapper chain is +1 with the special', () => {
  const count = (b) => { const ants = []; for (let i = 0; i < 8; i++) { const f = freeze(b.spawn('flyer', 0, 0)); ants.push(f); } const tw = towerNear(b, 'zapper', 200); const q = b.routes[0].at(200); ants.forEach((f, i) => { f.x = q.x + i * 8; f.y = q.y; f.d = 200; f.flying = true; }); b.events.length = 0; tw.cd = 0; b.update(0.001); return b.events.filter((e) => e.type === 'zap' && e.chain).length; };
  const on = mk(); const off = mk(6, 5, { specials: false }); const cOn = count(on), cOff = count(off); assert.equal(cOn, cOff + 1, `on ${cOn} off ${cOff}`);
});
test('M7i / A13b: W1-W5 sims are identical with specials on (default) and off, at card level 6 (every level, 4 seeds)', () => {
  const L = C.LEVELS.length; let n = 0;
  for (let i = 0; i < Math.min(50, L); i++) for (const seed of [1, 2, 3, 4]) {
    const f = (sp) => { const r = playLevel(i, { bot: 'smart', unlocked: unlockedAt(i), cardLevel: 6, seed, specials: sp }); return [r.result, r.stars, r.food, r.time, r.towers, r.cards, r.crumbs, r.kills, r.spawned].join(','); };
    assert.equal(f(true), f(false), `level ${i + 1} seed ${seed}`); n++;
  }
  assert.ok(n >= 200);
});
