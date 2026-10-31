// Pass 4 shots: J8 map life, J9 queen intro. usage: node shots-p4c.mjs <outdir>
import { launch, richSave, setupBattle, sleep } from './harness.mjs'; import fs from 'node:fs';
const OUT = process.argv[2]; fs.mkdirSync(OUT, { recursive: true });
const h = await launch({ viewport: { width: 393, height: 852, deviceScaleFactor: 2 }, query: '' }); const { page, ev } = h;
await richSave(page, 40); await sleep(300);
const freeze = () => ev(() => { window.__ft = performance.now(); window.__run = 0; window.requestAnimationFrame = (cb) => setTimeout(() => { if (window.__run > 0) { window.__run--; window.__ft += 16.667; } cb(window.__ft); }, 8); });
const step = async (sec) => { await ev((s) => { window.__run = Math.max(1, Math.round(s * 60)); }, sec); await page.waitForFunction(() => window.__run === 0, { polling: 10 }); await sleep(40); };
const shot = async (name, clip) => { for (let k = 0; k < 4; k++) { const buf = await page.screenshot({ path: `${OUT}/${name}.png`, clip }); if (buf.length > 9000) return; await sleep(120); } };
if (!process.env.SKIP8) {
// J8: map near the last cleared node (L40 cleared in richSave -> walker L40 -> L41 = none; use a lower cleared level)
await ev(() => { const g = window.__game; g.go('map'); });
await sleep(300); await freeze(); await sleep(100);
// make level 20 the last cleared one so the walker sits mid-map
await ev(() => { const g = window.__game; for (let i = 16; i < 40; i++) { g.S.save.levels[i].cleared = false; g.S.save.levels[i].stars = 0; } g.S.save.levels[15].stars = 3; g.S.save.levels[14].stars = 3; g.S.mapScroll = g.S.mapScroll; });
await ev(() => { const g = window.__game; g.go('map'); });
await sleep(100);
// advance S.t to a walking phase (S.t % 8 in [1,2]) and a shine phase
await ev(() => { const g = window.__game; const t = g.S.t; g.S.t = t - (t % 8) + 0.3; });
await step(0.05);
await shot('v081-J8-map-life', { x: 0, y: 150, width: 393, height: 560 });
await shot('v081-J8-map-life-full', { x: 0, y: 0, width: 393, height: 852 });
}
if (process.env.ONLY8) { await h.close(); process.exit(0); }
// J9: queen intro on L10
await setupBattle(page, 9, ['slingshot', 'laser', 'spray', 'glue'], 3, ['slingshot', 'laser', 'spray', 'glue', 'fan']); await sleep(200); await freeze();
const L = await ev(() => window.__game.layout());
await ev(() => { const b = window.__game.S.battle; b.nextWave = b.waves.length - 1; b.startWave(); });
let found = false;
for (let i = 0; i < 120 && !found; i++) { await step(0.25); found = await ev(() => { const g = window.__game; return !!g.S.queenIntro || g.S.battle.ants.some((a) => !a.dead && g.C.ANTS[a.type].boss); }); }
console.log('queen found', found, await ev(() => ({ intro: !!window.__game.S.queenIntro, t: window.__game.S.t, wave: window.__game.S.battle.wave })));
await step(0.1); await shot('v081-J9-queen-a', { x: 0, y: 72, width: 393, height: 560 });
await step(0.3); await shot('v081-J9-queen-b', { x: 0, y: 72, width: 393, height: 560 });
await step(0.9); await shot('v081-J9-queen-c', { x: 0, y: 72, width: 393, height: 560 });
await h.close();
