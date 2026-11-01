// v0.8.3 Pass 2 shots: M7h cues, U12 prep chip, PP9 (meet-Drone card + tip), PP10 (Open World 6), PP12 (result 3-star / queen6 gems), PP3/PP5 (drone, drip). usage: node shots-p2.mjs <outdir>
import { launch, richSave, setupBattle, sleep } from '../qa-v082/harness.mjs'; import fs from 'node:fs';
const OUT = process.argv[2]; fs.mkdirSync(OUT, { recursive: true }); const res = {}, HASH = process.env.HASH || 'nohash';
const W = 393, H = 852, clip = { x: 0, y: 0, width: W, height: H };
const shot = async (page, id) => { const f = `v083-${id}-${HASH}.png`; await page.screenshot({ path: `${OUT}/${f}`, clip }); res[id] = f; };
const h = await launch({ viewport: { width: W, height: H, deviceScaleFactor: 2 }, query: '?antcard=1' }); const { page, ev } = h;
// --- U12 + PP9 meet-the-Drone: L52 prep
await richSave(page, 51); await sleep(200);
await ev(() => { const g = window.__game; g.S.save.seenAnts = (g.S.save.seenAnts || []).filter((x) => x !== 'drone'); g.openPrep(51); g.S.prep.deck = ['slingshot', 'spray', 'glue', 'fan', 'lizard'].slice(0, 5); }); await sleep(500);
res.antCard = await ev(() => window.__game.S.antCard || null); await shot(page, 'PP9-meet-drone'); res.cardShownOnce = await ev(() => { const g = window.__game; g.M.markAntSeen(g.S.save, g.S.antCard); return g.M.nextAntCard(g.S.save, 51); });
await ev(() => { const g = window.__game; g.S.antCard = null; g.S.prep.deck = ['slingshot', 'spray', 'glue', 'fan', 'lizard']; }); await sleep(400);
res.airfix = await ev(() => window.__game.S.layoutAirFix); res.warn = await ev(() => window.__game.S.layoutWarn); await shot(page, 'U12-prep-airfix');
const btn = await ev(() => window.__game.buttons().find((b) => b.id === 'airfix')); res.airBtn = btn;
if (btn) { await page.mouse.click(btn.sx, btn.sy); await sleep(300); res.deckAfter = await ev(() => window.__game.S.prep.deck.slice()); await shot(page, 'U12-after-tap'); }
// --- PP9 tip + PP3 drone + PP5 drip: L60 battle
await ev(() => { window.__game.S.save.seenAnts = []; });
await setupBattle(page, 59, ['slingshot', 'laser', 'zapper', 'glue', 'spray'], 2, ['slingshot', 'laser', 'zapper', 'glue', 'spray']);
await ev(() => { const g = window.__game; g.S.paused = false; g.S.battle.events.push({ type: 'wave', n: 2 }); g.consumeEvents(); }); await sleep(250); await shot(page, 'PP9-tips');
res.tipSeen = await ev(() => window.__game.S.save.seenAnts.filter((x) => String(x).startsWith('tip:')));
// a Queen about to spawn a Drone: drip window
const qd = await ev(() => { const g = window.__game, b = g.S.battle; g.S.paused = false; g.S.fx.length = 0; const q = b.spawn('queen6', 0, 0); q.d = 330; q.spawnT = 0.2; window.__keepQ = setInterval(() => { q.spawnT = 0.2; }, 5); for (let k = 0; k < 4; k++) { const d = b.spawn('drone', 10 + k * 22, 0); d.d = 150 + k * 45; } b.ants.forEach((a) => { const p = b.route(a).at(a.d); a.x = p.x; a.y = p.y; }); return b.ants.length; });
await sleep(60); res.droneScene = qd; await shot(page, 'PP3-PP5-drone-drip'); await ev(() => clearInterval(window.__keepQ));
// --- M7h cues: synthetic specials at ant positions
await ev(() => { const g = window.__game, b = g.S.battle; g.S.paused = false; const a = b.ants.filter((x) => !x.dead); const p = a[0]; for (const [sp, k] of [['ricochet', 0], ['burnthrough', 1], ['crescendo', 2], ['pounce', 3]]) { const t = a[k % a.length]; b.events.push({ type: 'special', sp, x: t.x, y: t.y, tx: t.x + 40, ty: t.y - 20 }); } g.consumeEvents(); }); await sleep(30);
await shot(page, 'M7h-cues');
res.fxAfter = await ev(() => window.__game.S.fx.map((f) => f.k));
// cap test: 40 special events in one frame
res.capTest = await ev(() => { const g = window.__game, b = g.S.battle; g.S.fx.length = 0; const t = b.ants[0]; for (let i = 0; i < 40; i++) b.events.push({ type: 'special', sp: ['ricochet', 'burnthrough', 'crescendo'][i % 3], x: t.x, y: t.y, tx: t.x + 10, ty: t.y }); g.consumeEvents(); return g.S.fx.filter((f) => /^sp/.test(f.k)).length; });
await h.close();
// --- PP10 + PP12: L50 first win
const h2 = await launch({ viewport: { width: W, height: H, deviceScaleFactor: 2 }, query: '' }); const p2 = h2.page, ev2 = h2.ev;
await richSave(p2, 49); await sleep(200);
const win = (li) => ev2((li) => { const g = window.__game; g.go('map'); g.startBattle(li, ['slingshot', 'laser', 'glue', 'spray', 'fan'], ['bomb', 'freeze'], 3); const b = g.S.battle; g.S.paused = false; b.result = 'win'; b.stats.kills = 40; g.finishBattle(); }, li);
const settle = async () => { await sleep(1200); for (let k = 0; k < 4; k++) { await ev2(() => { const S = window.__game.S; S.reveal.length = 0; S.pack = null; }); await sleep(500); } await sleep(3500); };
await win(49); await settle(); res.pp10 = await ev2(() => ({ screen: window.__game.S.screen, btn: window.__game.buttons().filter((b) => /^r/.test(b.id)).map((b) => [b.id, b.w, b.h]) }));
await p2.screenshot({ path: `${OUT}/v083-PP10-open-world6-${HASH}.png`, clip }); res.PP10 = 'ok';
const nb = await ev2(() => window.__game.buttons().find((b) => b.id === 'rnext')); if (nb) { await p2.mouse.click(nb.sx, nb.sy); await sleep(350); res.afterTap = await ev2(() => window.__game.S.screen); await p2.screenshot({ path: `${OUT}/v083-PP10-map-reveal-${HASH}.png`, clip }); await sleep(1400); res.revealGone = await ev2(() => !window.__game.S.worldReveal); }
await win(55); await settle(); res.pp12a = await ev2(() => window.__game.S.result && window.__game.S.result.out && { stars: window.__game.S.result.out.starParts, parts: window.__game.S.result.out.parts }); await p2.screenshot({ path: `${OUT}/v083-PP12-result3-${HASH}.png`, clip });
await win(59); await settle(); res.pp12b = await ev2(() => window.__game.S.result && window.__game.S.result.out && { gems: window.__game.S.result.out.gems }); await p2.screenshot({ path: `${OUT}/v083-PP12-queen6-${HASH}.png`, clip });
await h2.close();
fs.writeFileSync(OUT + '/p2-shots.json', JSON.stringify(res, null, 1)); console.log(JSON.stringify(res)); process.exit(0);
