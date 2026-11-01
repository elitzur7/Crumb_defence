// Pass 2 shots + checks: mode chips (3 / 4 chips), shield debug battle (dome / bar / shatter / regen / reduced motion), U3 tooltip, U1 first-battle guide.
// usage: node shots-p2.mjs <outdir>   (prints JSON results at the end)
import { launch, richSave, sleep } from './harness.mjs'; import fs from 'node:fs';
const OUT = process.argv[2]; fs.mkdirSync(OUT, { recursive: true });
const res = {}; const ck = (k, v) => { res[k] = v; console.log(k, JSON.stringify(v)); };
// ---------- chips + shield + U3 (rich save, guide off) ----------
{
  const h = await launch({ viewport: { width: 393, height: 852, deviceScaleFactor: 2 } }); const { page, ev } = h;
  const shot = async (n, clip) => { await page.screenshot({ path: `${OUT}/${n}.png`, ...(clip ? { clip } : {}) }); console.log('saved', n); };
  await richSave(page, 40); await sleep(400);
  for (const [li, name] of [[0, 'L01-2chips'], [32, 'L33-3chips'], [39, 'L40-4chips'], [9, 'L10-boss-3chips']]) {
    await ev((li) => { const g = window.__game; g.go('map'); g.startBattle(li, ['slingshot', 'laser', 'glue', 'spray', 'fan'], ['bomb', 'freeze'], 3); g.S.paused = false; g.setAutoBot(false); const b = g.S.battle; b.crumbs = 400;
      let c0 = 0, r0 = 0, best = 1e9; for (let r = 1; r < 12; r++) for (let c = 0; c < 10; c++) { const ti = b.tileInfo(c, r); if (ti.valid && !ti.onPath && !ti.tower && b.touchesTrail(c, r)) { const d = Math.abs(c - 5) + Math.abs(r - 6); if (d < best) { best = d; c0 = c; r0 = r; } } }
      const t = b.addTower('slingshot', c0, r0); g.S.info = { tower: t, t: 0 }; }, li); await sleep(450);
    const chips = await ev(() => window.__game.buttons().filter((b) => b.id.startsWith('mode_')).map((b) => ({ id: b.id, x: Math.round(b.sx), cssW: Math.round(b.cssW), cssH: Math.round(b.cssH) })));
    ck('chips-' + name, chips); await shot('v081-chips-' + name);
    ck('chips-ok-' + name, chips.length <= 4 && chips.every((c) => c.cssH >= 44));
  }
  // shield debug battle on an L32-style map: Glazed ants in the lanes
  const setup = (rm) => ev((rm) => { const g = window.__game; g.S.save.settings.reduceMotion = rm ? 'on' : 'off'; g.S.info = null; g.go('map'); g.startBattle(41 - 10, ['slingshot', 'laser', 'glue', 'spray', 'fan'], [], 3); g.S.paused = false; g.setAutoBot(false);
    const b = g.S.battle; b.crumbs = 900; b.level = { ...b.level, hpMul: 5.4 }; const cand = [];
    for (let r = 1; r < 12; r++) for (let c = 0; c < 10; c++) { const ti = b.tileInfo(c, r); if (ti.valid && !ti.onPath && !ti.tower && b.touchesTrail(c, r)) cand.push([c, r]); }
    for (const i of [0, 3]) { const q = cand[Math.floor(cand.length * (i + 1) / 5)]; const t = b.addTower('slingshot', q[0], q[1]); t.lvl = 2; }
    const L = b.routes[0].length; const out = [];
    [0.28, 0.34, 0.40, 0.46].forEach((f, i) => { const a = b.spawn('glazed', L * f); a.speed = 0; out.push(a.id); }); const w = b.spawn('worker', L * 0.52); w.speed = 0; out.push(w.id); const q5 = b.spawn('queen5', L * 0.12); q5.speed = 0; out.push(q5.id); window.__ids = out; b.nextWaveAt = 9999; }, rm);
  await setup(false); await sleep(300);
  await ev(() => { const g = window.__game, b = g.S.battle, id = window.__ids; const A = (i) => b.ants.find((a) => a.id === id[i]); b.damage(A(0), 70); b.damage(A(1), 5); b.damage(A(2), 200); b.damage(A(5), 120); g.runFrames(3); });
  await sleep(120); await shot('v081-shield-states');
  const st = await ev(() => { const b = window.__game.S.battle, id = window.__ids; return id.map((i) => { const a = b.ants.find((q) => q.id === i); return a ? { t: a.type, sh: Math.round(a.shield), shMax: a.shieldMax, hp: Math.round(a.hp), hpMax: a.maxHp } : null; }); });
  ck('shield-states', st);
  // a clean break: full shield -> shatter, capture 3 frames
  await ev(() => { const g = window.__game, b = g.S.battle, id = window.__ids; const a = b.ants.find((q) => q.id === id[3]); b.damage(a, 168); g.runFrames(4); }); await sleep(30); await shot('v081-shield-break-a'); await sleep(110); await shot('v081-shield-break-b');
  // regen: wait 2.5 s + 1.5 s of sim and capture the pulse
  await ev(() => { window.__game.runFrames(60 * 3.4); }); await sleep(60); await shot('v081-shield-regen');
  const st2 = await ev(() => { const b = window.__game.S.battle, id = window.__ids; return id.slice(0, 4).map((i) => { const a = b.ants.find((q) => q.id === i); return a ? { sh: Math.round(a.shield), shMax: a.shieldMax } : null; }); });
  ck('shield-after-regen', st2);
  // 24 px crop (greyscale) of a glazed ant vs a worker, at 1x
  const box = await ev(() => { const g = window.__game, b = g.S.battle, id = window.__ids; const r = g.S.__canvasRect || null; const cv = document.querySelector('canvas').getBoundingClientRect(); const sc = cv.width / 400; const pos = (i) => { const a = b.ants.find((q) => q.id === i); return a ? { x: cv.left + a.x * sc, y: cv.top + (a.y + 68) * sc } : null; }; return { g: pos(id[2]), w: pos(id[4]), sc }; });
  ck('glazed-vs-worker-pos', box);
  await setup(true); await sleep(300);
  await ev(() => { const g = window.__game, b = g.S.battle, id = window.__ids; const A = (i) => b.ants.find((a) => a.id === id[i]); b.damage(A(0), 70); b.damage(A(2), 200); g.runFrames(3); }); await sleep(120); await shot('v081-shield-reduced-motion');
  // U3 tooltip + intro
  await ev(() => { const g = window.__game; g.S.save.settings.reduceMotion = 'off'; g.S.battle = null; g.go('map'); g.openPrep(31); }); await sleep(500);
  for (const t of ['nurse', 'worker']) { await ev((t) => { const g = window.__game; g.S.prepTip = { type: t, until: g.S.t + 30 }; }, t); await sleep(300); await shot('v081-u3-tip-' + t); }
  await h.close();
}
// ---------- U1 guide (fresh save, ?guide=1) ----------
{
  const h = await launch({ viewport: { width: 393, height: 852, deviceScaleFactor: 2 }, query: '?guide=1' }); const { page, ev } = h;
  const shot = async (n) => { await page.screenshot({ path: `${OUT}/${n}.png` }); console.log('saved', n); };
  const btn = (id) => ev((id) => window.__game.buttons().find((x) => x.id === id) || null, id);
  ck('fresh-firstBattle', await ev(() => window.__game.S.save.onboard.firstBattle));
  let taps = 0; const tap = async (id) => { const b = await btn(id); if (!b) throw new Error('no button ' + id); await page.mouse.click(b.sx, b.sy); taps++; await sleep(300); };
  await ev(() => { const g = window.__game; g.go('map'); g.openPrep(0); }); await sleep(500);
  await tap('start'); await sleep(500); taps = 0; // the guide starts here: count taps from now
  ck('guide-step1', await ev(() => window.__game.S.guide)); await shot('v081-u1-step1');
  const skip = await btn('guideSkip'); ck('skip-pill', skip && { cssW: Math.round(skip.cssW), cssH: Math.round(skip.cssH) });
  // freeze: the sim clock must not move during the guide
  const t0 = await ev(() => window.__game.S.battle.time); await sleep(800); ck('sim-frozen', (await ev(() => window.__game.S.battle.time)) === t0);
  // drag the first card onto a blue spot
  const card = await btn('guideDrag'); const mp = await btn('map'); const spot = await ev((mp) => { const g = window.__game, b = g.S.battle; const sc = mp.cssW / 400; const card = b.picks[0];
    for (let r = 1; r < 12; r++) for (let c = 0; c < 10; c++) { if (b.placeRuleOk(card, c, r) && !b.towers.some((q) => q.c === c && q.r === r) && !(c < 3 && r < 2)) return { x: mp.sx - mp.cssW / 2 + (c * 40 + 20) * sc, y: mp.sy - mp.cssH / 2 + (r * 40 + 20) * sc, c, r, card }; } }, mp);
  ck('drop-spot', spot);
  await page.mouse.move(card.sx, card.sy); await page.mouse.down(); await page.mouse.move((card.sx + spot.x) / 2, (card.sy + spot.y) / 2, { steps: 6 }); await shot('v081-u1-dragging'); await page.mouse.move(spot.x, spot.y, { steps: 6 }); await page.mouse.up(); taps++; await sleep(500);
  ck('after-drop', await ev(() => ({ towers: window.__game.S.battle.towers.length, guide: window.__game.S.guide })));
  await shot('v081-u1-step2');
  await tap('wave'); await sleep(400);
  ck('after-start', await ev(() => ({ wave: window.__game.S.battle.nextWave, guide: window.__game.S.guide, fb: window.__game.S.save.onboard.firstBattle })));
  ck('taps-to-wave1', taps); await shot('v081-u1-after');
  // second battle: no guide; and skip path
  await ev(() => { const g = window.__game; g.S.battle = null; g.go('map'); g.S.save.onboard.firstBattle = 'pending'; g.openPrep(0); }); await sleep(300); await tap('start'); await sleep(300);
  await tap('guideSkip'); ck('skip', await ev(() => ({ guide: window.__game.S.guide, fb: window.__game.S.save.onboard.firstBattle })));
  await h.close();
}
fs.writeFileSync(`${OUT}/p2-results.json`, JSON.stringify(res, null, 1));
