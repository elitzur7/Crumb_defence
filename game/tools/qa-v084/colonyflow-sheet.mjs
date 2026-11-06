// G20: labelled pairs, Colony Flow reference beside an in-battle frame.
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import { serve } from '../serve.mjs';

const refs = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => {
  const hit = fs.readdirSync('/home/ubuntu/.cursor/projects/workspace/uploads').find((f) => f.startsWith(`colonyflow-play-${n}_`));
  return `/home/ubuntu/.cursor/projects/workspace/uploads/${hit}`;
});
const levels = [2, 11, 20, 29, 37, 46, 55, 64];
const srv = await serve(8798, 'www-test');
const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 393, height: 852, deviceScaleFactor: 2 });
await page.goto('http://127.0.0.1:8798/index.html');
await page.waitForFunction(() => window.__game && window.__game.startBattle);
const shots = await page.evaluate(async (levels) => {
  const g = window.__game;
  const save = g.M.newSave();
  for (let i = 0; i < save.levels.length; i++) save.levels[i] = { cleared: true, stars: 1 };
  for (const id of Object.keys(save.cards)) save.cards[id].level = 4;
  g.setSave(save);
  window.requestAnimationFrame = () => 0;
  const out = [];
  for (const li of levels) {
    g.startBattle(li, ['slingshot', 'spray', 'laser', 'zapper', 'fan'], []);
    g.S.speed = 2;
    g.setAutoBot(true);
    for (let i = 0; i < 420 && g.S.battle && !g.S.battle.result; i++) g.battleFrame(1 / 60);
    g.renderOnce(0);
    const ants = g.S.battle ? g.S.battle.ants.length : 0;
    out.push({ li, ants, url: document.querySelector('canvas').toDataURL('image/png') });
  }
  return out;
}, levels);
fs.mkdirSync('/tmp/cf-shots', { recursive: true });
shots.forEach((s, i) => {
  fs.writeFileSync(`/tmp/cf-shots/b${i}.png`, Buffer.from(s.url.split(',')[1], 'base64'));
  console.log('L' + (s.li + 1), 'ants', s.ants);
});
await browser.close(); srv.close();

const { createCanvas, loadImage } = await import('canvas').catch(() => ({ createCanvas: null }));
if (!createCanvas) {
  const { execFileSync } = await import('node:child_process');
  const py = `
from PIL import Image, ImageDraw, ImageFont
refs = ${JSON.stringify(refs)}
W, H, pad, rh = 920, 2100, 16, 250
sheet = Image.new('RGB', (W, H), (61, 107, 79))
draw = ImageDraw.Draw(sheet)
font = ImageFont.load_default()
for i, ref in enumerate(refs):
    y = 12 + i * (rh + 8)
    cf = Image.open(ref).convert('RGB')
    cw = int(rh * cf.width / cf.height)
    cf = cf.resize((cw, rh), Image.Resampling.LANCZOS)
    bat = Image.open(f'/tmp/cf-shots/b{i}.png').convert('RGB')
    bw = int(rh * bat.width / bat.height)
    bat = bat.resize((bw, rh), Image.Resampling.LANCZOS)
    draw.text((pad, y), f'colonyflow-play-{i+1}    |    L{${JSON.stringify(levels)}[i]+1} in battle', fill=(255,255,255), font=font)
    sheet.paste(cf, (pad, y + 16))
    sheet.paste(bat, (pad + cw + 12, y + 16))
sheet.save('/workspace/qa/v0.8.4/colonyflow-sheet.png')
sheet.save('/opt/cursor/artifacts/colonyflow-sheet.png')
print(sheet.size)
`;
  execFileSync('python3', ['-c', py], { stdio: 'inherit' });
}
