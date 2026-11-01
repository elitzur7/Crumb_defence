// v0.8.3 Pass 1 shots: F8 Ant Book (labels measured at 360 and 412), F3 cabinet, F4 queen ants. usage: node shots-p1.mjs <outdir> ; prints JSON
import { launch, richSave, sleep, namedShot } from '../qa-v082/harness.mjs'; import fs from 'node:fs';
const OUT = process.argv[2]; fs.mkdirSync(OUT, { recursive: true }); const res = {};
for (const W of [360, 393, 412]) {
  const h = await launch({ viewport: { width: W, height: Math.round(W * 2.17), deviceScaleFactor: 2 } }); await richSave(h.page, 60); await sleep(200);
  await h.ev(() => { window.__game.S.screen = 'antbook'; window.__game.S.antBookSel = null; }); await sleep(500);
  if (W === 393) { res.grid = await namedShot(h.page, OUT, 'F8-antbook', { x: 0, y: 0, width: W, height: Math.round(W * 2.17) }); }
  res['labels' + W] = await h.ev(() => { const L = window.__abLabels || {}, out = []; for (const [t, ls] of Object.entries(L)) for (const [ln, wd, cw] of ls) out.push([t, ln, wd, cw]); return out; });
  if (W === 393) {
    await h.ev(() => { window.__game.S.screen = 'cabinet'; }); await sleep(500); res.cab = await namedShot(h.page, OUT, 'F3-cabinet', { x: 0, y: 0, width: W, height: Math.round(W * 2.17) });
    await h.ev(() => { window.__game.S.antBookSel = 'queen5'; window.__game.S.screen = 'antbook'; }); await sleep(500); res.q5 = await namedShot(h.page, OUT, 'F4-queen5', { x: 0, y: 0, width: W, height: Math.round(W * 2.17) });
  }
  await h.close();
}
fs.writeFileSync(OUT + '/p1-shots.json', JSON.stringify(res)); console.log(JSON.stringify(Object.fromEntries(Object.entries(res).map(([k, v]) => [k, Array.isArray(v) ? v.length + ' labels, max w ' + Math.max(...v.map((x) => x[2])) + ' / ' + v[0][3] : v])))); process.exit(0);
