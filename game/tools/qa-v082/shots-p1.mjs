// Pass 1 raw captures. usage: WWW=<www-test> node shots-p1.mjs <outdir> ; the same script runs on the v0.8.0 baseline and the new build, compose.py pairs them
import { launch, richSave, setupBattle, sleep } from './harness.mjs'; import fs from 'node:fs';
const OUT = process.argv[2]; fs.mkdirSync(OUT, { recursive: true });
const h = await launch({ viewport: { width: 393, height: 852, deviceScaleFactor: 2 } }); const { page, ev } = h;
const shot = async (n) => { await page.screenshot({ path: `${OUT}/${n}.png` }); console.log('saved', n); };
await richSave(page, 12); await sleep(500);
await ev(() => { window.__game.S.cal = null; window.__game.go('map'); window.__game.S.mapScroll = 0; }); await sleep(400); await shot('map');
await ev(() => window.__game.openCalendar()); await sleep(800); await shot('calendar');
await ev(() => { window.__game.S.cal = null; window.__game.go('cards'); }); await sleep(500); await shot('cards');
await ev(() => window.__game.openCardView('slingshot')); await sleep(500); await shot('card-view');
await ev(() => window.__game.go('shop')); await sleep(500); await shot('shop');
await ev(() => { const g = window.__game; g.go('map'); g.openPrep(5); }); await sleep(600); await shot('prep');
const overlay = () => ev(() => { const g = window.__game; document.querySelectorAll('.hr').forEach((e) => e.remove()); for (const b of g.buttons()) { if (b.cssW > 700 || b.cssH > 700) continue; const d = document.createElement('div'); d.className = 'hr'; d.style.cssText = `position:fixed;left:${b.sx - b.cssW / 2}px;top:${b.sy - b.cssH / 2}px;width:${b.cssW}px;height:${b.cssH}px;border:1px solid rgba(0,120,255,.9);background:rgba(0,120,255,.12);box-sizing:border-box;pointer-events:none;z-index:99`; document.body.appendChild(d); } });
const noOverlay = () => ev(() => document.querySelectorAll('.hr').forEach((e) => e.remove()));
await ev(() => window.__game.go('shop')); await sleep(400); await overlay(); await shot('shop-hit'); await noOverlay();
await setupBattle(page, 5, ['slingshot', 'laser', 'spray', 'slingshot', 'fan', 'laser', 'sound'], 30);
await ev(() => { const g = window.__game; g.S.info = { tower: g.S.battle.towers[0], t: 0 }; }); await sleep(500); await shot('tower-info'); await overlay(); await shot('tower-info-hit'); await noOverlay();
await ev(() => { window.__game.S.info = null; }); await sleep(300); await shot('battle-tray');
const result = async (li, factor, name, times) => {
  await richSave(page, li); await sleep(200);
  await ev((li, factor) => { const g = window.__game; g.go('map'); g.startBattle(li, ['slingshot', 'laser', 'glue', 'spray', 'fan'], ['bomb', 'freeze'], 5); g.S.paused = false; const b = g.S.battle; b.crumbs = 9999; b.cfg.foodHP = b.cfg.foodHP * factor; g.simulate(900, true); }, li, factor);
  for (const t of times) { await ev((t) => { const R = window.__game.S.result; if (R) R.t = t - 0.04; }, t); await sleep(80); await shot(`${name}-t${String(t).replace('.', '')}`); }
};
await result(1, 1, 'result3', [0.8, 1.2, 1.8, 3.4]);
await result(2, 2, 'result2', [1.2, 2.6]);
await result(3, 4, 'result1', [1.2, 2.6]);
await ev(() => { const g = window.__game; g.go('map'); g.startBattle(4, ['slingshot'], [], 5); g.S.paused = false; const b = g.S.battle; b.crumbs = 0; g.simulate(900, false); });
for (const t of [0.8, 1.2, 1.8]) { await ev((t) => { const R = window.__game.S.result; if (R) R.t = t - 0.04; }, t); await sleep(80); await shot(`result-loss-t${String(t).replace('.', '')}`); }
await ev(() => { window.__game.S.result = null; window.__game.S.battle = null; window.__game.go('map'); }); await sleep(400);
const tap = async (id) => { const b = await ev((id) => window.__game.buttons().find((x) => x.id === id), id); if (!b) throw new Error('no button ' + id); await page.mouse.click(b.sx, b.sy); await sleep(350); };
await tap('gear'); await shot('settings');
await h.close();
