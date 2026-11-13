// v0.8.1 QA harness: headless chrome driver for www-test (shared by text-scan, small-targets, contrast, shots, caps)
import { createRequire } from 'node:module';
import { createServer } from 'node:http'; import { readFile } from 'node:fs/promises'; import { extname, join } from 'node:path';
const require = createRequire(new URL('../../package.json', import.meta.url));
export const puppeteer = require('puppeteer-core');
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const types = { '.html': 'text/html', '.js': 'text/javascript', '.ttf': 'font/ttf' };
export async function launch(opts = {}) {
  const root = opts.root || process.env.WWW || new URL('../../www-test/', import.meta.url).pathname;
  const srv = createServer(async (q, r) => { let p = q.url.split('?')[0]; if (p.endsWith('/')) p += 'index.html'; try { const d = await readFile(join(root, p)); r.writeHead(200, { 'content-type': types[extname(p)] || 'application/octet-stream' }); r.end(d); } catch (e) { r.writeHead(404); r.end(); } });
  await new Promise((ok) => srv.listen(0, '127.0.0.1', ok));
  const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', ...(opts.args || [])] });
  const page = await browser.newPage();
  const vp = opts.viewport || { width: 393, height: 852, deviceScaleFactor: 2 };
  await page.emulate({ viewport: { ...vp, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 14) Mobile' });
  if (opts.init) await page.evaluateOnNewDocument(opts.init);
  await page.evaluateOnNewDocument(() => { try { localStorage.clear(); } catch (e) {} });
  page.on('pageerror', (e) => console.log('PAGEERR', e.message));
  await page.goto(`http://127.0.0.1:${srv.address().port}/index.html${opts.query || ''}`); await page.waitForFunction(() => window.__game);
  await page.evaluate(async () => { try { await document.fonts.load("20px 'Lilita One'"); } catch (e) {} });
  const ev = (f, ...a) => page.evaluate(f, ...a);
  const close = async () => { await browser.close(); srv.close(); };
  return { page, ev, close, sleep };
}
// a rich save: N levels won, all cards unlocked, onboarding done
export const richSave = (page, n = 12, extra) => page.evaluate((n, extra) => { const g = window.__game, s = g.M.newSave(); for (let i = 0; i < n; i++) g.M.applyBattleResult(s, i, 'win', i % 3 + 1, {}, () => 0); for (const id of g.C.SIM_ASSUMED_CARDS) g.M.unlockCard(s, id); s.onboard = 'done'; s.diamonds = 14; if (extra) Object.assign(s, extra); g.setSave(s); g.S.cal = null; g.go('map'); }, n, extra);
// battle with towers auto-placed beside the trail (reuses the v0.8.0 shot.mjs helper)
export const setupBattle = (page, li, want, secs, deck = ['slingshot', 'laser', 'glue', 'spray', 'fan']) => page.evaluate((li, want, secs, deck) => { const g = window.__game; g.go('map'); g.startBattle(li, deck, ['bomb', 'freeze'], 3); g.S.paused = false; g.setAutoBot(false);
  const b = g.S.battle; b.crumbs = 400; const used = []; const cand = [];
  for (let r = 0; r < 12; r++) for (let c = 0; c < 10; c++) { const ti = b.tileInfo(c, r); if (ti.valid && !ti.onPath && !ti.tower && b.touchesTrail(c, r) && r > 0) cand.push([c, r]); }
  used.push(cand[Math.floor(cand.length / 2)]);
  while (used.length < want.length) { let best = null, bd = -1; for (const q of cand) { const d = Math.min(...used.map((u) => Math.hypot(u[0] - q[0], u[1] - q[1]))); if (d > bd) { bd = d; best = q; } } used.push(best); }
  used.forEach((q, i) => { const t = b.addTower(want[i], q[0], q[1]); t.lvl = i % 3 === 0 ? 3 : (i % 3 === 1 ? 2 : 1); });
  g.simulate(secs, true); }, li, want, secs, deck);
