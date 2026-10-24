// Tower rendering benchmark + L1..L6 montage (dev only, not shipped). Usage:
//   node tools/bench-towers.mjs <www-dir relative to game/> <label> <outdir>
// Uses the test build's window.__game (A.drawTower, renderOnce). Headless Chrome, software canvas, 393x852 @ DPR 3.
import puppeteer from 'puppeteer-core';
import { mkdirSync, writeFileSync } from 'node:fs';
import { serve } from './serve.mjs';
const [dir = 'www-test', label = 'cur', OUT = '/workspace/ant-td/qa/v0.6.1/bench'] = process.argv.slice(2);
mkdirSync(OUT, { recursive: true });
const port = 8800 + Math.floor(Math.random() * 100);
const srv = await serve(port, dir);
const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--disable-gpu'] });
const page = await browser.newPage();
await page.emulate({ viewport: { width: 393, height: 852, deviceScaleFactor: 3, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 14) Mobile' });
const errors = []; page.on('pageerror', (e) => errors.push(e.message));
await page.goto(`http://127.0.0.1:${port}/index.html`); await page.waitForFunction(() => window.__game);
const G = (fn, a) => page.evaluate(fn, a);
// --- a full battle board: every tower type, levels 1..6 mixed, ants walking ---
const board = await G(() => { const g = window.__game, s = g.M.newSave(); g.Cal.touch(s, g.now()); g.Cal.claim(s, g.now(), () => 0);
  for (const id of g.C.ALL_CARDS) g.M.unlockCard(s, id); s.onboard = 'done'; g.setSave(s); g.S.cal = null; g.S.reveal = [];
  g.startBattle(9, ['slingshot', 'laser', 'zapper', 'glue', 'tractor'], ['bomb', 'freeze'], 5);
  const b = g.S.battle; b.addCrumbs(1e6); const types = g.C.ALL_CARDS.slice(); const placed = [];
  let k = 0;
  for (let r = 0; r < 14; r++) for (let c = 0; c < 10; c++) {
    const t = b.tileInfo(c, r); if (!t.valid || t.tower) continue;
    for (let tries = 0; tries < types.length; tries++) {
      const type = types[(k + tries) % types.length]; const T = g.C.TOWERS[type];
      if ((T.place === 'path') !== !!t.onPath) continue;
      const before = b.towers.length; b.picks[0] = type; b.playCard(0, c, r);
      if (b.towers.length > before) { const tw = b.towers.at(-1); const lvl = 1 + (placed.length % 6); for (let L = 1; L < lvl; L++) { b.picks[0] = type; b.playCard(0, c, r); } placed.push(type + tw.lvl); k = (k + tries + 1) % types.length; break; }
    }
  }
  g.consumeEvents(); g.S.info = null; b.nextWaveAt = 0; g.simulate(4, false); for (const tw of b.towers) tw.born = -10; return placed; });
const res = await G(() => { const g = window.__game, A = g.A, b = g.S.battle; const med = (a) => a.slice().sort((x, y) => x - y)[a.length >> 1];
  const out = { towers: b.towers.length, ants: b.ants.filter((a) => !a.dead).length };
  // 1) full game frames (render only, no sim)
  for (let i = 0; i < 40; i++) g.renderOnce();
  const runs = []; for (let r = 0; r < 5; r++) { const t0 = performance.now(); for (let i = 0; i < 200; i++) g.renderOnce(); runs.push((performance.now() - t0) / 200); }
  out.frameMs = +med(runs).toFixed(3); out.frameRuns = runs.map((x) => +x.toFixed(3));
  // 2) towers only, real battle towers at device scale (DPR 3 x fit scale), same transform as the battle
  const cv = document.createElement('canvas'); cv.width = 393 * 3; cv.height = 852 * 3; const ctx = cv.getContext('2d');
  const sc = 3 * Math.min(393 / 400, 852 / 720);
  const drawAll = (t) => { for (const tw of b.towers) { ctx.save(); ctx.setTransform(sc, 0, 0, sc, 0, 0); ctx.translate(tw.x, tw.y); if (g.C.TOWERS[tw.type].place === 'path') ctx.translate(tw.px - tw.x, tw.py - tw.y); A.drawTower(ctx, tw.type, t + tw.id, tw); ctx.restore(); } };
  for (let i = 0; i < 40; i++) drawAll(i / 60);
  const truns = []; for (let r = 0; r < 5; r++) { const t0 = performance.now(); for (let i = 0; i < 200; i++) drawAll(1 + i / 60); truns.push((performance.now() - t0) / 200); }
  out.towersMs = +med(truns).toFixed(3);
  // canvas calls per frame (main canvas only) for the towers pass
  const P = CanvasRenderingContext2D.prototype; const names = ['fill', 'stroke', 'arc', 'ellipse', 'lineTo', 'moveTo', 'quadraticCurveTo', 'arcTo', 'beginPath', 'drawImage', 'createLinearGradient', 'createRadialGradient', 'fillRect'];
  const orig = {}; const cnt = {}; for (const n of names) { orig[n] = P[n]; cnt[n] = 0; P[n] = function (...a) { cnt[n]++; return orig[n].apply(this, a); }; }
  drawAll(2); for (const n of names) P[n] = orig[n];
  out.callsPerTowersFrame = cnt; out.pathCalls = names.filter((n) => n !== 'drawImage').reduce((s, n) => s + cnt[n], 0); out.drawImage = cnt.drawImage;
  // 3) audit-style: 300 x all 13 types at L3, and at every level 1..6
  const ctx2 = document.createElement('canvas').getContext('2d'); ctx2.canvas.width = 240; ctx2.canvas.height = 240; ctx2.setTransform(3, 0, 0, 3, 0, 0);
  const one = (type, lvl, t) => { ctx2.save(); ctx2.translate(40, 40); A.drawTower(ctx2, type, t, { lvl, aim: 0, fireFx: 0, id: 1, dirx: 1, diry: 0, type }); ctx2.restore(); };
  for (const type of Object.keys(g.C.TOWERS)) for (let L = 1; L <= 6; L++) one(type, L, 0);
  let t0 = performance.now(); for (let i = 0; i < 300; i++) for (const type of Object.keys(g.C.TOWERS)) one(type, 3, i * 0.01); out.ms300xAllL3 = +(performance.now() - t0).toFixed(1);
  t0 = performance.now(); for (let i = 0; i < 100; i++) for (const type of Object.keys(g.C.TOWERS)) for (let L = 1; L <= 6; L++) one(type, L, i * 0.01); out.ms100xAllTypesAllLevels = +(performance.now() - t0).toFixed(1);
  out.cache = g.spriteCache ? g.spriteCache() : null;
  return out; });
res.label = label; res.board = board.join(' '); res.errors = errors;
// 4) montage: every type x L1..L6, still frame (t=0), DPR 3
const mont = await G(() => { const g = window.__game, A = g.A; const types = Object.keys(g.C.TOWERS); const CW = 64, S = 3;
  const cv = document.createElement('canvas'); cv.width = 6 * CW * S; cv.height = types.length * CW * S; const c = cv.getContext('2d');
  c.fillStyle = '#efe2d2'; c.fillRect(0, 0, cv.width, cv.height);
  types.forEach((type, r) => { for (let lvl = 1; lvl <= 6; lvl++) { c.save(); c.setTransform(S, 0, 0, S, 0, 0); c.translate((lvl - 1) * CW + CW / 2, r * CW + CW * 0.62); A.drawTower(c, type, 0, { lvl, aim: -0.6, fireFx: 0, id: 1, dirx: 1, diry: 0, type }); c.restore(); } });
  return { url: cv.toDataURL('image/png'), types }; });
writeFileSync(`${OUT}/montage-${label}.png`, Buffer.from(mont.url.split(',')[1], 'base64'));
// 5) animated frame: every type x L1..L6 at t=1.37, facing left (aim 2.5), mid-shot (fireFx 0.6) -> the live parts on top of the sprites
const anim = await G(() => { const g = window.__game, A = g.A; const types = Object.keys(g.C.TOWERS); const CW = 64, S = 3;
  const cv = document.createElement('canvas'); cv.width = 6 * CW * S; cv.height = types.length * CW * S; const c = cv.getContext('2d');
  c.fillStyle = '#efe2d2'; c.fillRect(0, 0, cv.width, cv.height);
  types.forEach((type, r) => { for (let lvl = 1; lvl <= 6; lvl++) { c.save(); c.setTransform(S, 0, 0, S, 0, 0); c.translate((lvl - 1) * CW + CW / 2, r * CW + CW * 0.62); A.drawTower(c, type, 1.37, { lvl, aim: 2.5, fireFx: 0.6, id: 1, dirx: -1, diry: 0, type }); c.restore(); } });
  return cv.toDataURL('image/png'); });
writeFileSync(`${OUT}/montage-anim-${label}.png`, Buffer.from(anim.split(',')[1], 'base64'));
// 6) the battle board itself (same deterministic board + frame time in both builds)
await G(() => { const g = window.__game; g.S.t = 100; g.renderOnce(0); });
await page.screenshot({ path: `${OUT}/battle-${label}.png` });
writeFileSync(`${OUT}/bench-${label}.json`, JSON.stringify(res, null, 1));
console.log(JSON.stringify({ ...res, callsPerTowersFrame: undefined }));
await browser.close(); srv.close(); process.exit(0);
