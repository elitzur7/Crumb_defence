// G2 in-game: 12-tower L38 battle, prep deck, Cards, card view, tray. usage: node shots-g2b.mjs <outdir> [query]
import { launch, richSave, setupBattle, sleep } from './harness.mjs'; import fs from 'node:fs';
const OUT = process.argv[2]; const tag = process.argv[3] || 'after'; const query = process.argv[4] || ''; fs.mkdirSync(OUT, { recursive: true });
const h = await launch({ viewport: { width: 393, height: 852, deviceScaleFactor: 2 }, query }); const { page, ev } = h;
await richSave(page, 40); await sleep(300);
const deck = ['slingshot', 'laser', 'zapper', 'spray', 'fan', 'ball', 'sound', 'pheromone', 'lizard', 'tractor', 'glue', 'gate'];
await setupBattle(page, 37, deck, 8, deck.slice(0, 5)); await sleep(200);
await ev(() => { const b = window.__game.S.battle; b.towers.forEach((t, i) => { if (i % 3 === 0) t.lvl = 6; }); });
await sleep(300); await page.screenshot({ path: `${OUT}/g2-${tag}-battle-L38.png` });
await ev(() => { const g = window.__game; g.go('map'); g.openPrep(37); }); await sleep(400); await page.screenshot({ path: `${OUT}/g2-${tag}-prep.png` });
await ev(() => window.__game.go('cards')); await sleep(400); await page.screenshot({ path: `${OUT}/g2-${tag}-cards.png` });
await ev(() => { const g = window.__game; g.openCardView('slingshot'); }); await sleep(600); await page.screenshot({ path: `${OUT}/g2-${tag}-cardview.png` });
console.log(JSON.stringify(await ev(() => window.__game.A.spriteCacheStats())));
await h.close();
