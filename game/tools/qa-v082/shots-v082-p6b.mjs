// Pass 6 U15 Ant Book shots. usage: HASH=<id> node shots-v082-p6b.mjs <outdir>
import { launch, richSave, sleep, namedShot } from './harness.mjs'; import fs from 'node:fs';
const OUT = process.argv[2]; fs.mkdirSync(OUT, { recursive: true }); const res = {};
const h = await launch({ viewport: { width: 393, height: 852, deviceScaleFactor: 2 } }); await richSave(h.page, 52); await sleep(200);
await h.ev(() => { window.__game.S.screen = 'antbook'; window.__game.S.antBookSel = null; }); await sleep(500); res.grid = await namedShot(h.page, OUT, 'U15-antbook-grid', { x: 0, y: 0, width: 393, height: 852 });
await h.ev(() => { window.__game.S.antBookSel = 'drone'; }); await sleep(500); res.detail = await namedShot(h.page, OUT, 'U15-antbook-drone', { x: 0, y: 0, width: 393, height: 852 });
await h.close(); console.log(JSON.stringify(res)); process.exit(0);
