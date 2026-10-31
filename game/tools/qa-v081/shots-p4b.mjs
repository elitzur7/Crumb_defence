// Pass 4 deterministic shots (frozen rAF; events injected through consumeEvents). usage: node shots-p4b.mjs <outdir> [reduced]
import { launch, richSave, setupBattle, sleep } from './harness.mjs'; import fs from 'node:fs';
const OUT = process.argv[2], RM = process.argv[3] === 'reduced'; fs.mkdirSync(OUT, { recursive: true });
const tag = RM ? 'reduced' : 'motion';
const h = await launch({ viewport: { width: 393, height: 852, deviceScaleFactor: 2 }, query: '' }); const { page, ev } = h;
await richSave(page, 40); await sleep(300);
if (RM) await ev(() => { window.__game.S.save.settings = { ...(window.__game.S.save.settings || {}), reduceMotion: 'on' }; });
let LAY = null; const bc = (x, y, w, h) => ({ x: LAY.offX + x * LAY.scale, y: LAY.offY + (y + 68) * LAY.scale, width: w * LAY.scale, height: h * LAY.scale }); // board-logical crop -> css clip
const clipAll = { x: 0, y: 72, width: 393, height: 560 };
const shot = async (name, clip = clipAll) => { for (let k = 0; k < 4; k++) { const buf = await page.screenshot({ path: `${OUT}/${tag}-${name}.png`, clip }); if (buf.length > 9000) return; await sleep(120); } };
const freeze = () => ev(() => { window.__ft = performance.now(); window.__run = 0; window.requestAnimationFrame = (cb) => setTimeout(() => { if (window.__run > 0) { window.__run--; window.__ft += 16.667; } cb(window.__ft); }, 8); });
const step = async (sec) => { await ev((s) => { window.__run = Math.max(1, Math.round(s * 60)); }, sec); await page.waitForFunction(() => window.__run === 0, { polling: 10 }); await sleep(40); };
const emit = (...evs) => ev((evs) => { const g = window.__game; for (const e of evs) g.S.battle.events.push(e); g.consumeEvents(); }, evs);
await setupBattle(page, 5, ['slingshot', 'zapper', 'laser', 'lizard', 'spray', 'pheromone', 'glue', 'lava', 'fan', 'sound'], 6, ['slingshot', 'laser', 'spray', 'zapper', 'fan']);
await sleep(300); await freeze(); await sleep(150);
LAY = await ev(() => window.__game.layout());
await ev(() => { const g = window.__game; g.S.paused = false; g.S.battle.crumbs = 900; g.S.fx = []; g.S.ui = []; });
const geo = await ev(() => { const b = window.__game.S.battle; return { towers: b.towers.map((t) => ({ id: t.id, type: t.type, x: t.x, y: t.y })), ants: b.ants.map((a) => ({ x: a.x, y: a.y })).slice(0, 3), pts: b.path.pts.slice(0, 40).filter((_, i) => i % 6 === 0).map((p) => ({ x: p.x, y: p.y })) }; });
console.log(JSON.stringify(geo.towers.slice(0, 3)), geo.pts.length);
// G5: place burst, a hit, a rescue
await emit({ type: 'place', x: 200, y: 300, card: 'slingshot', lvl: 1, id: 999, cost: 40 }, { type: 'hit', x: 120, y: 250, src: 'x' }, { type: 'pieceCollect', id: 5, x: 290, y: 330, n: 3, gain: 3, auto: false });
await step(0.18); await shot('G5-sparkles');
// G4: crumbs in flight (merged ones too)
await ev(() => { window.__game.S.fx = []; });
await emit(...[[110, 300], [150, 330], [200, 260], [260, 340], [300, 280], [60, 200]].map(([x, y]) => ({ type: 'kill', x, y, ant: 'worker', crumbs: 5, src: 'slingshot' })));
await step(0.2); await shot('G4-crumbs-a'); await step(0.22); await shot('G4-crumbs-b');
// J1: eight impact bursts in a row at 0.07 s
await ev(() => { const g = window.__game; g.S.fx = []; });
const pos = [[60, 150], [130, 150], [200, 150], [270, 150], [340, 150], [90, 220], [200, 220], [310, 220]];
await emit({ type: 'hit', x: pos[0][0], y: pos[0][1], src: 'slingshot' }, { type: 'spray', x: 0, y: 0, tx: pos[1][0], ty: pos[1][1] }, { type: 'charm', x: pos[2][0], y: pos[2][1], tx: pos[2][0], ty: pos[2][1] + 30 }, { type: 'tongue', x: pos[3][0] - 30, y: pos[3][1], tx: pos[3][0], ty: pos[3][1] }, { type: 'beam', x: pos[4][0] - 30, y: pos[4][1], tx: pos[4][0], ty: pos[4][1], heat: 0.2 }, { type: 'zap', x: pos[5][0] - 30, y: pos[5][1], tx: pos[5][0], ty: pos[5][1] }, { type: 'stick', x: pos[6][0], y: pos[6][1] }, { type: 'roast', x: pos[7][0], y: pos[7][1] });
await step(0.07); await shot('J1-impacts', bc(0, 110, 400, 150));
// J2: one death per class (in a row), caught at 0.12 s
await ev(() => { window.__game.S.fx = []; });
const classes = ['worker', 'big', 'armored', 'flyer', 'nurse', 'glazed', 'sprinter', 'mama'];
await emit(...classes.map((c, i) => ({ type: 'kill', x: 30 + i * 47, y: 400, ant: c, crumbs: 0 })));
await step(0.12); await shot('J2-deaths', bc(0, 350, 400, 80));
// J4: banners
await ev(() => { const g = window.__game; g.S.fx = []; g.S.ui = []; });
await emit({ type: 'wave', n: 2 }); await step(0.5); await shot('J4-banner');
await ev(() => { window.__game.S.fx = []; });
await ev(() => { const g = window.__game; g.S.fx = []; g.S.battle.events.push({ type: 'wave', n: g.S.battle.totalWaves }); g.consumeEvents(); }); await step(0.4); await shot('J4-banner-final');
// J3: the '!' bubble on the first pickup
await ev(() => { const g = window.__game, S = g.S, b = S.battle; S._bubbleShown = false; const a = b.spawn('worker', 60); const an = b.ants[b.ants.length - 1]; an.state = 'go'; window.__pk = { x: an.x, y: an.y }; b.events.push({ type: 'pickup', x: an.x, y: an.y, n: 3, ant: 'worker', t: 1.2 }); g.consumeEvents(); });
await step(0.04); await shot('J3-bubble-a'); await step(0.25); await shot('J3-bubble-b');
// G6 bob: three phases of the placed towers
for (const [i, dt] of [[0, 0], [1, 0.6], [2, 0.6]]) { await step(dt); await shot('G6-bob-' + i, bc(40, 200, 340, 330)); }
// J6: upgrade hop
await ev(() => { const g = window.__game, S = g.S, b = S.battle, tw = b.towers[0]; S._upT = tw.id; b.events.push({ type: 'upgrade', x: tw.x, y: tw.y, lvl: 3, card: tw.type, id: tw.id, cost: 30, pick: null, diff: null }); g.consumeEvents(); });
let hopN = 0; for (const d of [0.06, 0.1, 0.1, 0.12]) { await step(d); await shot('J6-hop-' + (++hopN), bc(40, 200, 120, 120)); }
console.log(JSON.stringify(await ev(() => window.__caps && window.__caps())));
await h.close();
