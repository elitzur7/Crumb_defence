// Labelled pairs: each Colony Flow reference beside an in-battle frame.
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import { serve } from '../serve.mjs';
const refs = [
  'colonyflow-play-1_51be.png', 'colonyflow-play-2_c621.png', 'colonyflow-play-3_da50.png', 'colonyflow-play-4_e9d7.png',
  'colonyflow-play-5_b544.png', 'colonyflow-play-6_83f7.png', 'colonyflow-play-7_acd7.png', 'colonyflow-play-8_902e.png',
].map((f) => '/home/ubuntu/.cursor/projects/workspace/uploads/' + f);
const levels = [2, 37, 50, 60, 64, 70, 74, 79];
const srv = await serve(8801, 'www-test');
const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 393, height: 852, deviceScaleFactor: 2 });
await page.goto('http://127.0.0.1:8801/index.html');
await page.waitForFunction(() => window.__game && window.__game.startBattle);
const shots = await page.evaluate(async (levels) => {
  const g = window.__game;
  const save = g.M.newSave();
  for (let i = 0; i < save.levels.length; i++) save.levels[i] = { cleared: true, stars: 1 };
  for (const id of Object.keys(save.cards)) if (save.cards[id]) save.cards[id].level = 4;
  g.setSave(save);
  window.requestAnimationFrame = () => 0;
  const out = [];
  for (const li of levels) {
    g.startBattle(li, ['slingshot', 'spray', 'laser', 'zapper', 'fan'], []);
    g.S.speed = 2; g.setAutoBot(true);
    for (let i = 0; i < 280 && g.S.battle && !g.S.battle.result; i++) g.battleFrame(1 / 60);
    g.renderOnce(0);
    out.push(document.querySelector('canvas').toDataURL('image/png'));
  }
  return out;
}, levels);
fs.mkdirSync('/tmp/cf-shots', { recursive: true });
shots.forEach((u, i) => fs.writeFileSync(`/tmp/cf-shots/b${i}.png`, Buffer.from(u.split(',')[1], 'base64')));
await browser.close(); srv.close();
const { execFileSync } = await import('node:child_process');
execFileSync('python3', ['-c', `
from PIL import Image, ImageDraw, ImageFont
refs = ${JSON.stringify(refs)}
levels = ${JSON.stringify(levels)}
rh = 300
pad, gap, label = 12, 8, 18
cf0 = Image.open(refs[0])
cw = int(rh * cf0.width / cf0.height)
bw = int(rh * Image.open('/tmp/cf-shots/b0.png').width / Image.open('/tmp/cf-shots/b0.png').height)
pair = pad + cw + gap + bw + pad
cols, rows = 2, 4
sheet = Image.new('RGB', (pair * cols, (label + rh + 14) * rows + 8), (61, 107, 79))
d = ImageDraw.Draw(sheet)
font = ImageFont.load_default()
for i, ref in enumerate(refs):
    c, r = i % cols, i // cols
    x0, y0 = c * pair, 8 + r * (label + rh + 14)
    d.text((x0 + pad, y0), f'colonyflow-play-{i+1}    L{levels[i]+1}', fill=(255,255,255), font=font)
    cf = Image.open(ref).convert('RGB').resize((cw, rh), Image.Resampling.LANCZOS)
    bat = Image.open(f'/tmp/cf-shots/b{i}.png').convert('RGB').resize((bw, rh), Image.Resampling.LANCZOS)
    sheet.paste(cf, (x0 + pad, y0 + label))
    sheet.paste(bat, (x0 + pad + cw + gap, y0 + label))
sheet.save('/workspace/qa/v0.8.5/colonyflow-sheet.png')
sheet.save('/opt/cursor/artifacts/colonyflow-sheet.png')
print(sheet.size)
`], { stdio: 'inherit' });
