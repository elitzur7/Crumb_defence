// Pass 3 shots (G9 table, G10 pads, G13 crowd, G16 tray, G18 chevrons). usage: HASH=<id> node shots-v082-p3.mjs <outdir> [parts]
import { launch, richSave, sleep, namedShot, setupBattle } from './harness.mjs'; import fs from 'node:fs';
const OUT = process.argv[2]; fs.mkdirSync(OUT, { recursive: true }); const PARTS = (process.argv[3] || 'g9,pads,crowd,tray,chev').split(',');
const freeze = (ev) => ev(() => { window.__ft = performance.now(); window.__run = 0; window.requestAnimationFrame = (cb) => setTimeout(() => { if (window.__run > 0) { window.__run--; window.__ft += 16.667; } cb(window.__ft); }, 16); });
const step = (page, ev) => async (sec) => { await ev((s) => { window.__run = Math.max(1, Math.round(s * 60)); }, sec); await page.waitForFunction(() => window.__run === 0, { polling: 10 }); await sleep(40); };
const ASP = { '16x9': { width: 360, height: 640, deviceScaleFactor: 2 }, '19x9': { width: 393, height: 852, deviceScaleFactor: 2 }, '4x3': { width: 768, height: 1024, deviceScaleFactor: 1 } };
const DECK = ['slingshot', 'laser', 'zapper', 'sound', 'lizard']; const res = {};
const fresh = async (vp) => { const h = await launch({ viewport: vp }); await richSave(h.page, 50); await sleep(200); return h; };
const battle = async (h, li, want, secs, deck = DECK) => { const st = step(h.page, h.ev); await freeze(h.ev); await setupBattle(h.page, li, want, secs, deck); await h.ev(() => { const g = window.__game; g.S.specialBanner = null; g.S.paused = false; }); await st(0.4); return st; };
if (PARTS.includes('g9')) for (const [asp, vp] of Object.entries(ASP)) for (const [w, li] of [['W1', 0], ['W5', 44], ['W6', 54]]) {
  const h = await fresh(vp); await battle(h, li, ['slingshot', 'laser', 'zapper'], 12);
  res[`g9-${w}-${asp}`] = await namedShot(h.page, OUT, `G9-${w}-${asp}`, { x: 0, y: 0, width: vp.width, height: vp.height }); res[`bake-${w}-${asp}`] = await h.ev(() => ({ ms: window.__game.S.lastTableBake, props: Object.values(window.__game.S.tbCache || {}).map((e) => e.props) })); await h.close(); }
if (PARTS.includes('pads')) { const h = await fresh(ASP['19x9']); await battle(h, 6, ['slingshot', 'laser', 'zapper', 'sound', 'lizard'], 8); res.pads = await namedShot(h.page, OUT, 'G10-pads', { x: 0, y: 130, width: 393, height: 300 }); await h.close(); }
if (PARTS.includes('crowd')) { const h = await fresh(ASP['19x9']); await battle(h, 37, ['slingshot', 'laser'], 35); res.crowd = await namedShot(h.page, OUT, 'G13-crowd-L38', { x: 0, y: 70, width: 393, height: 520 }); await h.close(); }
if (PARTS.includes('tray')) { const h = await fresh(ASP['16x9']); await battle(h, 12, ['slingshot'], 3); res.tray = await namedShot(h.page, OUT, 'G16-tray', { x: 0, y: 420, width: 360, height: 220 });
  await h.ev(() => { const b = window.__game.S.battle; b.crumbs = 0; }); await sleep(100); await h.ev(() => { window.__run = 3; }); await h.page.waitForFunction(() => window.__run === 0, { polling: 10 }); res.trayPoor = await namedShot(h.page, OUT, 'G16-tray-poor', { x: 0, y: 420, width: 360, height: 220 }); await h.close(); }
if (PARTS.includes('chev')) { const h = await fresh(ASP['19x9']); await battle(h, 17, ['slingshot'], 2); res.chev = await namedShot(h.page, OUT, 'G18-chevrons', { x: 0, y: 70, width: 393, height: 520 }); await h.close(); }
console.log(JSON.stringify(res));
