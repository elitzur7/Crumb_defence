// Pass 6 shots (EC5a cabinet, skin on the board). usage: HASH=<id> node shots-v082-p6.mjs <outdir>
import { launch, richSave, sleep, namedShot, setupBattle } from './harness.mjs'; import fs from 'node:fs';
const OUT = process.argv[2]; fs.mkdirSync(OUT, { recursive: true }); const res = {};
const vp = { width: 393, height: 852, deviceScaleFactor: 2 };
{ const h = await launch({ viewport: vp }); await richSave(h.page, 50); await sleep(200);
  await h.ev(() => { const g = window.__game, S = g.S; S.save.coins = 9000; g.M.buySkin(S.save, 'laser-1'); g.M.buySkin(S.save, 'slingshot-1'); g.M.buySkin(S.save, 'sound-2'); g.M.equipSkin(S.save, 'sound', null); g.S.screen = 'shop'; });
  await sleep(500); res.shop = await namedShot(h.page, OUT, 'EC5a-shop', { x: 0, y: 0, width: 393, height: 400 });
  await h.ev(() => { window.__game.S.screen = 'cabinet'; }); await sleep(500); res.cab = await namedShot(h.page, OUT, 'EC5a-cabinet', { x: 0, y: 0, width: 393, height: 852 });
  await setupBattle(h.page, 6, ['slingshot', 'laser', 'zapper'], 4, ['slingshot', 'laser', 'zapper', 'sound', 'lizard']); await sleep(400);
  res.board = await namedShot(h.page, OUT, 'EC5a-skins-on-board', { x: 0, y: 70, width: 393, height: 520 });
  await h.close(); }
console.log(JSON.stringify(res)); process.exit(0);
