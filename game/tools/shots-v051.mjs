// v0.5.1 audit-fix screenshots -> /workspace/ant-td/screens/v0.5.1/
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';
import { serve } from './serve.mjs';
const OUT = '/workspace/ant-td/screens/v0.5.1'; mkdirSync(OUT, { recursive: true });
await serve(8786, 'www-test');
const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--disable-gpu'] });
const page = await browser.newPage();
await page.emulate({ viewport: { width: 393, height: 852, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 14) Mobile' });
const errors = []; page.on('pageerror', (e) => errors.push(e.message));
await page.goto('http://127.0.0.1:8786/index.html'); await page.waitForFunction(() => window.__game);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const G = (fn, a) => page.evaluate(fn, a);
const shot = async (n, w = 400) => { await sleep(w); await page.screenshot({ path: `${OUT}/${n}.png` }); console.log('saved', n); };
const textsNow = async () => { await G(() => { window.__tx = []; const f = CanvasRenderingContext2D.prototype.fillText; if (!window.__hooked) { window.__hooked = 1; CanvasRenderingContext2D.prototype.fillText = function (t, ...r) { window.__tx.push(String(t)); return f.call(this, t, ...r); }; } }); await sleep(150); return G(() => window.__tx.slice()); };
await G(() => { const g = window.__game, s = g.M.newSave(); g.Cal.touch(s, g.now()); g.Cal.claim(s, g.now(), () => 0); s.coins = 500; s.diamonds = 10; g.setSave(s); g.S.cal = null; g.go('map'); });
// fix 1: new LEVEL of an owned card -> "NEW CARD!"
await G(() => { const g = window.__game; g.queueReveal('slingshot', 2, false, g.S.t); });
let tx = await textsNow(); console.log('new level reveal texts:', [...new Set(tx.filter((t) => /NEW/.test(t)))]);
await shot('fix1-reveal-new-level-says-NEW-CARD', 800);
await G(() => { const g = window.__game; g.S.reveal = []; g.queueReveal('laser', 1, true, g.S.t); });
tx = await textsNow(); console.log('new type reveal texts:', [...new Set(tx.filter((t) => /NEW/.test(t)))]);
await shot('fix1-reveal-new-type-says-NEW-CARD', 800);
await G(() => { window.__game.S.reveal = []; });
// fix 2: queen killed with one wave still to come (battle not decided), then the cookie is eaten -> lose, no queen celebration
await G(() => { const g = window.__game; g.startBattle(9, ['slingshot', 'spray', 'glue', 'fan', 'ball'], ['bomb', 'freeze'], 2); const b = g.S.battle; b.nextWave = b.waves.length - 1; b.nextWaveAt = 1e9;
  const q = b.spawn('queen', 300); g.simulate(0.3, false); b.damage(q, 1e7, { ignoreArmor: true }); g.consumeEvents(); });
const mid = await G(() => { const g = window.__game; return { queenDown: g.S.queenDown, fireworks: g.S.fireworks.queue.length + g.S.fireworks.rockets.length }; });
console.log('right after the queen kill (battle not decided):', JSON.stringify(mid));
await shot('fix2a-queen-killed-battle-not-over-no-celebration', 600);
// the remaining ants eat the whole cookie (real game path: steal -> food 0 -> lose)
await G(() => { const g = window.__game, b = g.S.battle; b.foodStored = 3; b.nextWaveAt = 0; for (let i = 0; i < 60 * 120 && !b.result; i++) b.update(1 / 60); b.events = []; if (b.result) g.finishBattle(); });
const lost = await G(() => { const g = window.__game; return { result: g.S.battle.result, win: g.S.result.win, queenKilled: g.S.result.queenKilled, queenDown: g.S.queenDown, fireworks: g.S.fireworks.queue.length + g.S.fireworks.rockets.length }; });
tx = await textsNow(); console.log('lost:', JSON.stringify(lost), 'texts:', [...new Set(tx.filter((t) => /Way to go|eaten|saved/i.test(t)))]);
await shot('fix2b-queen-killed-but-lost-cookie-eaten-no-celebration', 1200);
// control: queen killed and the level won -> fireworks + "Way to go, you saved the cookies!"
await G(() => { const g = window.__game; g.startBattle(9, ['slingshot', 'spray', 'glue', 'fan', 'ball'], ['bomb', 'freeze'], 2); const b = g.S.battle; b.nextWave = b.waves.length; b.nextWaveAt = 1e9;
  const q = b.spawn('queen', 300); g.simulate(0.3, false); b.damage(q, 1e7, { ignoreArmor: true }); g.consumeEvents(); for (const a of b.ants) if (!a.dead) b.damage(a, 1e7, { ignoreArmor: true }); g.simulate(0.2, false); });
const won = await G(() => { const g = window.__game; return { win: g.S.result && g.S.result.win, queenKilled: g.S.result && g.S.result.queenKilled, fireworks: g.S.fireworks.queue.length + g.S.fireworks.rockets.length }; });
tx = await textsNow(); console.log('won:', JSON.stringify(won), 'texts:', [...new Set(tx.filter((t) => /Way to go|eaten|saved|Perfect/i.test(t)))]);
await shot('fix2c-control-queen-killed-and-won-celebration', 1000);
console.log('errors:', errors.length ? errors : 'none');
await browser.close(); process.exit(0);
