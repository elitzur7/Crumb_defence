// RG1 gloss proxy: share of screen pixels that are specular-white (min channel >= 235) on battle screens (upper bound of "gloss"). usage: node gloss.mjs <outdir> <out.json>
import { launch, richSave, setupBattle, sleep } from './harness.mjs'; import fs from 'node:fs'; import { execFileSync } from 'node:child_process';
const [dir, out] = process.argv.slice(2); fs.mkdirSync(dir, { recursive: true }); const res = {};
const freeze = (ev) => ev(() => { window.__ft = performance.now(); window.__run = 0; window.requestAnimationFrame = (cb) => setTimeout(() => { if (window.__run > 0) { window.__run--; window.__ft += 16.667; } cb(window.__ft); }, 16); });
for (const L of [6, 17, 26, 38, 50]) {
  const h = await launch({ viewport: { width: 393, height: 852, deviceScaleFactor: 1 } }); const { page, ev } = h;
  await richSave(page, 50); await sleep(200);
  await setupBattle(page, L - 1, ['slingshot', 'zapper', 'laser', 'glue', 'spray', 'fan'], 5, ['slingshot', 'laser', 'spray', 'zapper', 'fan']); await freeze(ev);
  await ev(() => { window.__run = 30; }); await sleep(900);
  const f = `${dir}/gloss-L${L}.png`; await page.screenshot({ path: f }); await h.close();
  res[L] = JSON.parse(execFileSync('python3', ['-c', `
from PIL import Image;import json
im=Image.open("${f}").convert("RGB");px=im.getdata();n=len(px);c=sum(1 for p in px if min(p)>=235);print(json.dumps({"white_pct":round(100*c/n,2)}))`]).toString());
}
fs.writeFileSync(out, JSON.stringify(res, null, 1)); console.log(JSON.stringify(res));
