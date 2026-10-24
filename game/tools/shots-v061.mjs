// v0.6.1 screenshots + B1 brightness numbers (dev only, not shipped). Usage: node tools/shots-v061.mjs <www dir> <label>
// -> /workspace/ant-td/screens/v0.6.1/<label>-*.png and <label>-brightness.json
// Brightness = mean Rec.709 luma (0-255) of the game canvas pixels: TARGET = inner 60% of the highlighted button,
// OUTSIDE = the whole canvas minus a 30 css-px margin around the button.
import puppeteer from 'puppeteer-core';
import { mkdirSync, writeFileSync } from 'node:fs';
import { serve } from './serve.mjs';
const [dir = 'www-test', label = 'v0.6.1', vpArg = '393x852'] = process.argv.slice(2);
const OUT = '/workspace/ant-td/screens/v0.6.1'; mkdirSync(OUT, { recursive: true });
const [VW, VH] = vpArg.split('x').map(Number);
const port = 8900 + Math.floor(Math.random() * 90); const srv = await serve(port, dir);
const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--disable-gpu'] });
const page = await browser.newPage();
await page.emulate({ viewport: { width: VW, height: VH, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 14) Mobile' });
const errors = []; page.on('pageerror', (e) => errors.push(e.message));
await page.goto(`http://127.0.0.1:${port}/index.html`); await page.waitForFunction(() => window.__game);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const G = (fn, a) => page.evaluate(fn, a);
const btn = async (id) => (await G(() => window.__game.buttons())).find((b) => b.id === id);
const tap = async (x, y) => { await page.touchscreen.tap(x, y); await sleep(120); };
const bright = (b) => G((b) => { const c = document.querySelector('canvas'), r = c.getBoundingClientRect(), k = c.width / r.width;
  const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data, W = c.width;
  const tx0 = (b.sx - b.cssW * 0.3 - r.left) * k, tx1 = (b.sx + b.cssW * 0.3 - r.left) * k, ty0 = (b.sy - b.cssH * 0.3 - r.top) * k, ty1 = (b.sy + b.cssH * 0.3 - r.top) * k;
  const ox0 = (b.sx - b.cssW / 2 - 30 - r.left) * k, ox1 = (b.sx + b.cssW / 2 + 30 - r.left) * k, oy0 = (b.sy - b.cssH / 2 - 30 - r.top) * k, oy1 = (b.sy + b.cssH / 2 + 30 - r.top) * k;
  let ts = 0, tn = 0, os = 0, on = 0;
  for (let y = 0; y < c.height; y += 2) for (let x = 0; x < W; x += 2) { const i = (y * W + x) * 4, l = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
    if (x >= tx0 && x <= tx1 && y >= ty0 && y <= ty1) { ts += l; tn++; } else if (x < ox0 || x > ox1 || y < oy0 || y > oy1) { os += l; on++; } }
  return { target: +(ts / tn).toFixed(1), outside: +(os / on).toFixed(1) }; }, b);
const res = { label, vp: vpArg };
// plain map + shop (no onboarding) = the undimmed reference
await G(() => { const g = window.__game, s = g.M.newSave(); s.levels[0] = { cleared: true, stars: 3 }; s.onboard = 'done'; g.Cal.touch(s, g.now()); g.Cal.claim(s, g.now(), () => 0); g.setSave(s); g.S.cal = null; g.S.reveal = []; g.go('map'); });
await sleep(400); res.mapPlain = await bright(await btn('shop'));
// Zapper onboarding: first stage-2 win -> Continue -> map (finger on Shop) -> Shop (FREE gift)
await G(() => { const g = window.__game; const s = g.M.newSave(); s.levels[0] = { cleared: true, stars: 3 }; g.Cal.touch(s, g.now()); g.Cal.claim(s, g.now(), () => 0); g.setSave(s); g.S.cal = null; g.S.reveal = [];
  g.startBattle(1, ['slingshot', 'spray', 'glue', 'fan', 'ball'], ['bomb', 'freeze'], 1); const b = g.S.battle; b.foodStored = 95; b.stats.stolen = 5; b.nextWave = b.waves.length; b.time = 200; g.simulate(0.1, false); });
await sleep(1900);
const cont = await btn('rcontinue'); if (cont) await tap(cont.sx, cont.sy); await sleep(400);
const shopB = await btn('shop'); res.mapOnboard = await bright(shopB);
await page.screenshot({ path: `${OUT}/${label}-onboard-map-dim.png` });
await tap(shopB.sx, shopB.sy); await sleep(400);
const gb = await btn('gift'); res.shopOnboard = await bright(gb);
await page.screenshot({ path: `${OUT}/${label}-onboard-shop-dim.png` });
// Shop + pre-battle with every card unlocked at mixed levels (item 7 consistency)
await G(() => { const g = window.__game, s = g.M.newSave(); s.levels[0] = { cleared: true, stars: 3 }; s.onboard = 'done'; s.coins = 5000; g.Cal.touch(s, g.now()); g.Cal.claim(s, g.now(), () => 0);
  g.C.ALL_CARDS.forEach((id, k) => { if (k < 11) { g.M.unlockCard(s, id); s.cards[id].level = 1 + (k % 10); } }); g.setSave(s); g.S.cal = null; g.S.reveal = []; g.go('shop'); });
await sleep(400); await page.screenshot({ path: `${OUT}/${label}-shop-cards.png` });
await G(() => { const g = window.__game; g.go('map'); }); await sleep(200);
const lv = await btn('lvl1') || await btn('level1') || null;
await G(() => { const g = window.__game; g.openPrep ? g.openPrep(1) : null; }); await sleep(300);
res.prepScreen = await G(() => window.__game.S.screen);
if (res.prepScreen === 'prep') { const d = await G(() => window.__game.buttons().filter((b) => b.id.startsWith('deck')).map((b) => b.id)); res.deckButtons = d.length;
  for (const id of d.slice(0, 3)) { const b = await btn(id); await tap(b.sx, b.sy); } await sleep(300); await page.screenshot({ path: `${OUT}/${label}-prep-cards.png` }); }
res.errors = errors;
writeFileSync(`${OUT}/${label}-brightness.json`, JSON.stringify(res, null, 1)); console.log(JSON.stringify(res));
await browser.close(); srv.close(); process.exit(0);
