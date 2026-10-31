// G1 shots: before (?art81=0) / after (default) for L6, L17 and one level per theme; props at 4x. usage: node shots-g1.mjs <outdir>
import { launch, richSave, setupBattle, sleep } from './harness.mjs'; import fs from 'node:fs';
const OUT = process.argv[2]; fs.mkdirSync(OUT, { recursive: true });
for (const [tag, query] of [['after', ''], ['before', '?art81=0']]) {
  const h = await launch({ viewport: { width: 393, height: 852, deviceScaleFactor: 2 }, query }); const { page, ev } = h;
  await richSave(page, 40); await sleep(300);
  const themeLv = await ev(() => { const C = window.__game.C, o = {}; C.LEVELS.forEach((l, i) => { const m = C.MAPS ? C.MAPS[l.map] : null; }); return null; });
  const lvls = { L06: 5, L17: 16, L26: 25, L33: 32 }; // wood/gingham mix, picnic, W3, mint (themes checked below)
  const info = {};
  for (const [n, li] of Object.entries(lvls)) {
    await setupBattle(page, li, ['slingshot', 'laser', 'glue', 'spray', 'fan', 'ball'], 6); await sleep(200);
    info[n] = await ev(() => { const g = window.__game, b = g.S.battle; return { theme: b.map.theme, art81: g.C.ART81 }; });
    await page.screenshot({ path: `${OUT}/g1-${tag}-${n}.png` });
  }
  console.log(tag, JSON.stringify(info));
  const props = await ev(() => { const g = window.__game, A = g.A; const cv = document.createElement('canvas'); cv.width = 5 * 100 * 4 / 2; cv.height = 70 * 4; const c = cv.getContext('2d'); c.fillStyle = A.THEMES[1].a; c.fillRect(0, 0, cv.width, cv.height); c.scale(2, 2);
    ['mug', 'sugar', 'jam', 'spoon', 'plant'].forEach((k, i) => A.drawProp(c, k, 25 + i * 50, 35)); return cv.toDataURL('image/png'); });
  fs.writeFileSync(`${OUT}/g1-${tag}-props.png`, Buffer.from(props.split(',')[1], 'base64'));
  await h.close();
}
