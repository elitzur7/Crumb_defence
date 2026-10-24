// v0.6.2 screenshots (dev only, not shipped). Usage: node tools/shots-v062.mjs [www-test] [393x852]
// -> /workspace/ant-td/screens/v0.6.2/*.png
import puppeteer from 'puppeteer-core';
import { mkdirSync, writeFileSync } from 'node:fs';
import { serve } from './serve.mjs';
const [dir = 'www-test', vpArg = '393x852'] = process.argv.slice(2);
const OUT = '/workspace/ant-td/screens/v0.6.2'; mkdirSync(OUT, { recursive: true });
const [VW, VH] = vpArg.split('x').map(Number);
const port = 8900 + Math.floor(Math.random() * 90); const srv = await serve(port, dir);
const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--disable-gpu'] });
const page = await browser.newPage();
await page.emulate({ viewport: { width: VW, height: VH, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 14) Mobile' });
const errors = []; page.on('pageerror', (e) => errors.push(e.message));
await page.goto(`http://127.0.0.1:${port}/index.html`); await page.waitForFunction(() => window.__game);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const G = (fn, a) => page.evaluate(fn, a);
const shot = (n) => page.screenshot({ path: `${OUT}/${vpArg}-${n}.png` });
const res = { vp: vpArg };
const fresh = (k) => G((k) => { const g = window.__game, s = g.M.newSave(); for (let i = 0; i < k; i++) s.levels[i] = { cleared: true, stars: 3 }; s.onboard = 'done'; s.coins = 1000;
  g.Cal.touch(s, g.now()); g.Cal.claim(s, g.now(), () => 0); g.setSave(s); g.S.cal = null; g.S.reveal = []; }, k);
// 1) Shop with tier prices + pack chance line (some towers still locked)
await fresh(2); await G(() => window.__game.go('shop')); await sleep(500); await shot('shop-tier-prices');
res.prices = await G(() => Object.fromEntries(window.__game.C.ALL_CARDS.map((id) => [id, window.__game.M.unlockPrice(id)])));
// 2) Shop unlock -> card shows NEW
res.lavaBuy = await G(() => { const g = window.__game, s = g.S.save, before = s.coins; const ok = g.M.buyCardUnlock(s, 'lava'); g.setSave(s); return { ok: !!ok, spent: before - s.coins, fresh: !!(s.cards.lava && s.cards.lava.fresh) }; });
await G(() => window.__game.go('shop')); await sleep(400); await shot('shop-after-lava-unlock-new');
await G(() => window.__game.go('cards')); await sleep(400); await shot('cards-lava-new-marker');
// 3) Pack that rolled a new tower (forced rng) -> NEW CARD reveal
res.pack = await G(() => { const g = window.__game, s = g.S.save; const got = g.M.buyPack(s, () => 0.01); g.setSave(s); if (got && got.newTower) g.queueReveal(got.newTower, 1, true, g.S.t + 0.1); return got ? { newTower: got.newTower, cards: got.map((c) => c.id || c) } : null; });
await sleep(900); await shot('pack-new-tower-reveal');
// 4) Queen win (level 10, world 1): during the hold, cheer above; then the result panel
await fresh(9);
await G(() => { const g = window.__game; g.startBattle(9, ['slingshot', 'spray', 'glue', 'fan', 'ball'], ['bomb', 'freeze'], 1); const b = g.S.battle; b.foodStored = 95; b.stats.stolen = 5; b.stats.byType.queen = 1; b.nextWave = b.waves.length; b.time = 200; g.simulate(0.1, false); });
await sleep(1200); res.holdAt1s = await G(() => window.__game.S.result && +window.__game.S.result.hold.toFixed(2));
res.buttonsDuringHold = await G(() => window.__game.buttons().map((b) => b.id)); await shot('queen-win-1s-hold');
await sleep(1600); await shot('queen-win-2.8s-hold');
await sleep(2400); res.buttonsAfterHold = await G(() => window.__game.buttons().map((b) => b.id)); await shot('queen-win-after-hold-result');
// 5) Normal win (no queen): panel at once
await fresh(2);
await G(() => { const g = window.__game; g.startBattle(1, ['slingshot', 'spray', 'glue', 'fan', 'ball'], ['bomb', 'freeze'], 1); const b = g.S.battle; b.foodStored = 95; b.stats.stolen = 5; b.nextWave = b.waves.length; b.time = 200; g.simulate(0.1, false); });
await sleep(1200); res.normalHold = await G(() => window.__game.S.result.hold); await shot('normal-win-no-hold');
// 6) Map: World 2 gate at 19 vs 20 stars (all 10 won)
for (const stars of [19, 20]) {
  await G((stars) => { const g = window.__game, s = g.M.newSave(); let left = stars; for (let i = 0; i < 10; i++) { const st = Math.max(1, Math.min(3, left - (9 - i))); s.levels[i] = { cleared: true, stars: st }; left -= st; }
    s.onboard = 'done'; g.Cal.touch(s, g.now()); g.Cal.claim(s, g.now(), () => 0); g.setSave(s); g.S.cal = null; g.S.reveal = []; g.go('map'); }, stars);
  await sleep(300); res['w2open' + stars] = await G(() => { const g = window.__game; return { stars: g.M.worldStars(g.S.save, 1), open: g.M.levelUnlocked ? g.M.levelUnlocked(g.S.save, 10) : null }; });
  await G(() => { const g = window.__game; const y = g.gateY ? g.gateY(1) : null; if (y != null && g.S.mapScroll !== undefined) g.S.mapScroll = Math.max(0, Math.min(g.maxMapScroll(), y - 300)); });
  await sleep(400); await shot(`map-world2-${stars}stars`);
}
res.errors = errors;
writeFileSync(`${OUT}/${vpArg}-shots.json`, JSON.stringify(res, null, 1)); console.log(JSON.stringify(res, null, 1));
await browser.close(); srv.close(); process.exit(0);
