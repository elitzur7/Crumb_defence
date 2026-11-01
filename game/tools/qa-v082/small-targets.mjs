// small-targets: visit every screen/state, list every tap target < 44 logical px in either dimension. usage: node small-targets.mjs [out.json]; exit 1 when the list is not empty
import { launch, richSave, setupBattle, sleep } from './harness.mjs'; import { writeFileSync } from 'node:fs';
const out = process.argv.find((a) => a.endsWith('.json')) || '/workspace/ant-td/qa/v0.8.2/small-targets.json';
const h = await launch(); const { ev } = h; const found = {}; const seen = {};
const scan = async (name) => { await sleep(450); const bs = await ev(() => window.__game.buttons()); seen[name] = bs.length;
  for (const b of bs) { if (b.w > 300 && b.h > 300) continue; /* full-screen swallow layers */ if (b.w < 43.9 || b.h < 43.9) (found[`${b.id}`] ||= []).push({ screen: name, w: +b.w.toFixed(1), h: +b.h.toFixed(1), x: +b.x.toFixed(0), y: +b.y.toFixed(0) }); } };
await richSave(h.page, 12); await scan('map');
await ev(() => window.__game.openCalendar()); await sleep(900); await scan('calendar');
await ev(() => { window.__game.S.cal = null; window.__game.go('cards'); }); await scan('cards');
await ev(() => { const g = window.__game; g.S.cardSel = 'slingshot'; }); await scan('cards-sel');
await ev(() => window.__game.openCardView('slingshot')); await sleep(500); await scan('card-view');
await ev(() => window.__game.go('shop')); await scan('shop');
await ev(() => { const g = window.__game; g.S.shopSel = 'slingshot'; }); await scan('shop-sel');
await ev(() => { window.__game.go('map'); window.__game.openPrep(5); }); await scan('prep');
await ev(() => { window.__game.openPrep(37); }); await scan('prep-L38');
await setupBattle(h.page, 16, ['slingshot', 'laser', 'spray', 'lizard', 'fan', 'zapper', 'ball'], 30); await scan('battle');
for (const [i, nm] of [[0, 'slingshot'], [1, 'laser'], [2, 'spray']]) { await ev((i) => { const g = window.__game, b = g.S.battle; g.S.info = { tower: b.towers[i], changed: [] }; }, i); await scan('tower-info-' + nm); }
await ev(() => { const g = window.__game; g.S.info = null; g.S.paused = true; }); await scan('pause'); await ev(() => { window.__game.S.paused = false; });
await ev(() => { const g = window.__game; g.S.info = null; g.go('map'); g.startBattle(1, ['slingshot', 'laser', 'glue', 'spray', 'fan'], ['bomb', 'freeze'], 5); g.S.paused = false; g.S.battle.crumbs = 9999; g.simulate(900, true); }); await sleep(4500); await scan('result');
await ev(() => { const g = window.__game; g.S.result = null; g.S.battle = null; g.go('map'); g.openPackReveal(['laser', 'laser', 'slingshot'], {}); }); await sleep(2500); await scan('pack');
await ev(() => { const g = window.__game; g.S.pack = null; g.go('map'); g.S.settings = { t: 5 }; }); await scan('settings');
writeFileSync(out, JSON.stringify({ seen, small: found }, null, 1)); console.log(JSON.stringify(found, null, 1)); console.log(Object.keys(found).length ? `FAIL: ${Object.keys(found).length} small targets` : 'PASS: no tap target < 44 px');
await h.close(); process.exit(Object.keys(found).length ? 1 : 0);
