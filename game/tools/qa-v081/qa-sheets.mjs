// QA1 (recipes sheet with pressed states + labelled swatches), QA2 (real greyscale ants at 24 px), QA5 (result shots). usage: node qa-sheets.mjs <outdir>
import { launch, richSave, sleep } from './harness.mjs'; import fs from 'node:fs';
const OUT = process.argv[2] || '/workspace/ant-td/qa/v0.8.1/screens'; fs.mkdirSync(OUT, { recursive: true });
{ // QA1 + QA2 on a flat canvas page
  const h = await launch({ viewport: { width: 1200, height: 900, deviceScaleFactor: 1 } });
  await h.ev(async () => { const A = window.__game.A; document.body.innerHTML = ''; const W = 1200, H = 900; const cv = document.createElement('canvas'); cv.width = W; cv.height = H; document.body.appendChild(cv); const g = cv.getContext('2d');
    g.fillStyle = '#ffc98f'; g.fillRect(0, 0, W, H); const lab = (s, x, y, sz = 12) => { g.fillStyle = '#523c4b'; g.font = `bold ${sz}px sans-serif`; g.textAlign = 'center'; g.fillText(s, x, y); };
    lab('QA1 - pill families: rest | pressed (label + ramp hex: highlight / face / lip / [end])', 600, 22, 15);
    const fams = Object.keys(A.CANDY); fams.forEach((f, i) => { const col = i % 3, row = Math.floor(i / 3); const x = 30 + col * 390, y = 44 + row * 92;
      A.drawPillButton(g, x, y, 120, 40, f, {}); A.drawPillButton(g, x + 130, y, 120, 40, f, { pressed: true, disabled: f === 'dis' ? true : false });
      g.fillStyle = f === 'cream' ? '#523c4b' : '#fff'; g.font = '16px sans-serif'; g.textAlign = 'center';
      lab(f, x + 60, y + 58); lab('pressed', x + 190, y + 58); lab(A.CANDY[f].join(' '), x + 130, y + 74, 11);
      A.CANDY[f].forEach((c, k) => { g.fillStyle = c; g.fillRect(x + 262 + k * 28, y + 2, 26, 36); g.strokeStyle = '#523c4b'; g.lineWidth = 1.5; g.strokeRect(x + 262 + k * 28, y + 2, 26, 36); }); });
    lab('F7 neutral family: cream face + INK label (idle / pressed / disabled F14)', 600, 420, 14);
    [['Back', {}], ['Back', { pressed: true }], ['Back', { disabled: true }]].forEach(([t, o], i) => { const x = 180 + i * 300, y = 436; A.drawPillButton(g, x, y, 130, 44, o.disabled ? 'dis' : 'cream', o); g.font = '17px "Lilita One"'; g.fillStyle = '#523c4b'; g.textAlign = 'center'; g.globalAlpha = o.disabled ? 0.6 : 1; g.fillText(t, x + 65, y + 29); g.globalAlpha = 1; });
    // QA2: real greyscale (luma) of the sprite at 24 px height for every ant type
    const ids = Object.keys(window.__game.C.ANTS); const cell = 64; const cols = 14;
    lab('QA2 - ants at 24 px height, real greyscale (BT.709 luma); left half colour for reference', 600, 520, 15);
    const sc = document.createElement('canvas'); const x0 = 20, y0 = 540;
    ids.forEach((id, i) => { const col = i % cols, row = Math.floor(i / cols), cx = 20 + col * 84, cy = y0 + row * 110;
      const t = document.createElement('canvas'); t.width = 140; t.height = 110; const c2 = t.getContext('2d'); c2.translate(70, 70); c2.scale(2, 2); A.drawAnt(c2, id, 0.2, {});
      const d = document.createElement('canvas'); d.width = 40; d.height = 36; const dc = d.getContext('2d'); dc.imageSmoothingQuality = 'high'; dc.drawImage(t, 0, 0, 140, 110, 0, 0, 40, 36);
      const im = dc.getImageData(0, 0, 40, 36), px = im.data; for (let k = 0; k < px.length; k += 4) { const l = 0.2126 * px[k] + 0.7152 * px[k + 1] + 0.0722 * px[k + 2]; px[k] = px[k + 1] = px[k + 2] = l; } dc.putImageData(im, 0, 0);
      g.fillStyle = '#e8d2bd'; g.fillRect(cx - 4, cy - 4, 80, 92); g.drawImage(d, cx, cy); g.drawImage(t, 0, 0, 140, 110, cx, cy + 42, 40, 36); lab(id, cx + 36, cy + 84, 10); }); });
  await h.page.screenshot({ path: `${OUT}/v081-qa-recipes-sheet.png`, clip: { x: 0, y: 0, width: 1200, height: 520 } });
  await h.page.screenshot({ path: `${OUT}/v081-qa-ants-grey24.png`, clip: { x: 0, y: 510, width: 1200, height: 390 } });
  await h.close(); console.log('QA1/QA2 saved');
}
{ // QA5: result shots - 1 star (t=0.5), 2 star first clear (t=1.2), 3 star with reduced motion (t=2.0)
  const h = await launch({ viewport: { width: 393, height: 852, deviceScaleFactor: 2 } }); const { page, ev } = h;
  const run = async (li, factor, t, name, reduce) => {
    await richSave(page, li); await sleep(200);
    await ev((li, factor, reduce) => { const g = window.__game; if (reduce) g.S.save.settings = { ...(g.S.save.settings || {}), reduceMotion: 'on' }; g.go('map'); g.startBattle(li, ['slingshot', 'laser', 'glue', 'spray', 'fan'], ['bomb', 'freeze'], 5); g.S.paused = false; const b = g.S.battle; b.crumbs = 9999; b.cfg.foodHP = b.cfg.foodHP * factor; g.simulate(900, true); }, li, factor, reduce);
    await ev((t) => { const R = window.__game.S.result; if (R) R.t = t - 0.04; }, t); await sleep(90); await page.screenshot({ path: `${OUT}/${name}.png` }); console.log('saved', name); };
  await run(3, 4, 0.5, 'v081-qa-result-1star'); await run(2, 2, 1.2, 'v081-qa-result-2star-first'); await run(1, 1, 2.0, 'v081-qa-result-3star-reduced', true);
  await h.close();
}
