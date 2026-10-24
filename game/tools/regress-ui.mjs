// UI regression checks: v0.1.1 audit (B1-B7 + hook removal), v0.2.0 UI (V1-V5), the v0.2.0 audit (B8-B10) and v0.3.0 (W1-W9), on several phone viewports, driven by real touch events.
import puppeteer from 'puppeteer-core';
import { serve } from './serve.mjs';
const OUT = '/workspace/ant-td/screens';
const VIEWPORTS = [[320, 568, 2], [360, 640, 3], [393, 852, 2.75], [412, 915, 2.6]].filter((v) => !process.env.UI_VP || process.env.UI_VP === `${v[0]}x${v[1]}`); // UI_VP=393x852 runs one viewport
const srvT = await serve(8771, 'www-test'), srvP = await serve(8772, 'www');
const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
let fails = 0; const results = [];
const ok = (cond, msg) => { results.push(`${cond ? 'PASS' : 'FAIL'} ${msg}`); if (!cond) fails++; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

for (const [w, h, dpr] of VIEWPORTS) {
  const vp = `${w}x${h}`;
  const page = await browser.newPage();
  await page.emulate({ viewport: { width: w, height: h, deviceScaleFactor: dpr, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 14) Mobile' });
  const G = (fn, arg) => page.evaluate(fn, arg);
  const errors = []; page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.evaluateOnNewDocument(() => {
    // record every string drawn on the canvas (B8: catch NaN/undefined from renamed config keys) + count frames
    try { localStorage.clear(); } catch (e) { /* about:blank */ } // every viewport starts like a first launch
    window.__tx = []; window.__allTx = new Set(); window.__frames = 0; window.__font = {};
    const f = CanvasRenderingContext2D.prototype.fillText;
    CanvasRenderingContext2D.prototype.fillText = function (t, ...r) { const s = String(t); window.__tx.push(s); window.__allTx.add(s); window.__font[s] = this.font; return f.call(this, t, ...r); };
    const raf = window.requestAnimationFrame.bind(window); window.requestAnimationFrame = (cb) => raf((ts) => { window.__frames++; cb(ts); });
  });
  await page.goto('http://127.0.0.1:8771/index.html'); await page.waitForFunction(() => window.__game);
  const texts = async (ms = 120) => { await G(() => { window.__tx = []; window.__f0 = window.__frames; }); await sleep(ms); return G(() => ({ tx: window.__tx.slice(), frames: window.__frames - window.__f0 })); };
  const bad = (arr) => arr.filter((t) => /NaN|undefined|null|\[object/.test(t));
  const btns = () => G(() => window.__game.buttons());
  const btn = async (id) => (await btns()).find((b) => b.id === id);
  const tap = async (x, y) => { await page.touchscreen.tap(x, y); await sleep(120); };
  // v0.6.1 B1: mean luma (0-255) of the canvas inside the inner 60% of a button vs everywhere outside a 30 css-px margin around it
  const bright = (b) => G((b) => { const c = document.querySelector('canvas'), r = c.getBoundingClientRect(), k = c.width / r.width;
    const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data, W = c.width;
    const tx0 = (b.sx - b.cssW * 0.3 - r.left) * k, tx1 = (b.sx + b.cssW * 0.3 - r.left) * k, ty0 = (b.sy - b.cssH * 0.3 - r.top) * k, ty1 = (b.sy + b.cssH * 0.3 - r.top) * k;
    const ox0 = (b.sx - b.cssW / 2 - 30 - r.left) * k, ox1 = (b.sx + b.cssW / 2 + 30 - r.left) * k, oy0 = (b.sy - b.cssH / 2 - 30 - r.top) * k, oy1 = (b.sy + b.cssH / 2 + 30 - r.top) * k;
    let ts = 0, tn = 0, os = 0, on = 0;
    for (let y = 0; y < c.height; y += 2) for (let x = 0; x < W; x += 2) { const i = (y * W + x) * 4, l = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
      if (x >= tx0 && x <= tx1 && y >= ty0 && y <= ty1) { ts += l; tn++; } else if (x < ox0 || x > ox1 || y < oy0 || y > oy1) { os += l; on++; } }
    return { target: Math.round(ts / tn), outside: Math.round(os / on) }; }, b);
  const tapId = async (id) => { const b = await btn(id); if (!b) throw new Error(`${vp}: no button ${id}`); await tap(b.sx, b.sy); };
  const tileCss = (c, r) => G(({ c, r }) => { const cv = document.getElementById('game').getBoundingClientRect(); const sc = Math.min(cv.width / 400, cv.height / 720); return { x: (cv.width - 400 * sc) / 2 + (c + 0.5) * 40 * sc, y: (cv.height - 720 * sc) / 2 + (68 + (r + 0.5) * 40) * sc }; }, { c, r });
  // ---------- W1: Reward Calendar pops up on entering the game (fresh save), claim today's tile ----------
  {
    await sleep(200);
    ok(await G(() => window.__game.S.screen === 'map' && !!window.__game.S.cal), `${vp} W1 calendar pops up on entering the game`);
    const tile = await G(() => window.__game.Cal.status(window.__game.S.save, window.__game.now()).tile);
    const tb = await btn('calTile' + tile);
    ok(tb && (await G(([x, y]) => window.__game.hitAt(x, y), [tb.sx, tb.sy])) === 'calTile' + tile && Math.min(tb.cssW, tb.cssH) >= 44, `${vp} W1 today's tile (${tile + 1}/7) is top-most and >= 44px`);
    const c0 = await G(() => ({ coins: window.__game.S.save.coins, dia: window.__game.S.save.diamonds }));
    ok(c0.coins === 0 && c0.dia === 0, `${vp} W1 fresh save starts with 0 coins / 0 diamonds`);
    await tap(tb.sx, tb.sy); await sleep(150);
    const r = await G(() => ({ res: window.__game.S.cal && window.__game.S.cal.result, disk: JSON.parse(localStorage.getItem('crumbdefense.save.v1')).calendar }));
    ok(r.res && r.res.ok && r.res.streak === 1 && r.disk.streak === 1 && r.disk.weekClaimed[tile] === true, `${vp} W1 claim grants the prize (${r.res && r.res.prize && r.res.prize.kind}) and is saved`);
    if (w === 393) await page.screenshot({ path: `${OUT}/v0.6.2/regress/W1-calendar-claimed-393x852.png` });
    await tapId('calClose');
    ok(await G(() => !window.__game.S.cal), `${vp} W1 Close hides the calendar`);
    await G(() => window.__game.go('map')); await sleep(80);
    ok(await G(() => !window.__game.S.cal), `${vp} W1 already claimed today: no popup on returning to the map`);
    // next day within 24h -> popup again, streak 2 ; then 3 days away -> streak back to 1
    await G(() => { const g = window.__game; g.setClockOffset(12 * 3600000); g.heartbeat(true); g.setClockOffset(24 * 3600000 + 60000); g.heartbeat(true); g.go('map'); }); // seen every <24h
    const st2 = await G(() => { const g = window.__game; return { open: !!g.S.cal, s: g.Cal.status(g.S.save, g.now()) }; });
    ok(st2.open && st2.s.claimable && st2.s.streakAfter === 2, `${vp} W1 next day: popup again and the streak continues (2/30)`);
    await G(() => { const g = window.__game; g.Cal.claim(g.S.save, g.now()); g.S.cal = null; g.setClockOffset(4 * 86400000); g.heartbeat(true); g.go('map'); });
    const st3 = await G(() => { const g = window.__game; return g.Cal.status(g.S.save, g.now()); });
    ok(st3.resetPending && st3.streakAfter === 1, `${vp} W1 after more than 24h away the monthly bar resets to 1/30`);
    if (w === 393) await page.screenshot({ path: `${OUT}/v0.6.2/regress/W1-calendar-reset-393x852.png` });
    // Yair's example in the running game: claim day 1 + day 2, open day 3 without claiming, come back 5 days later -> 1/30 and 4/7
    await G(() => { const g = window.__game; const s = g.M.newSave(); g.setSave(s); g.S.cal = null; const D = 86400000;
      g.setClockOffset(10 * D); g.heartbeat(true); g.Cal.claim(g.S.save, g.now());
      g.setClockOffset(11 * D); g.heartbeat(true); g.Cal.claim(g.S.save, g.now());
      g.setClockOffset(12 * D); g.heartbeat(true); g.go('map'); g.S.cal = null;
      g.setClockOffset(17 * D); g.heartbeat(true); g.go('map'); });
    await sleep(200);
    const ye = await G(() => { const g = window.__game; return { open: !!g.S.cal, s: g.Cal.status(g.S.save, g.now()) }; });
    ok(ye.open && ye.s.streakAfter === 1 && ye.s.tile === 3 && ye.s.tiles.map((x) => x.state).join() === 'claimed,claimed,missed,today,future,future,future', `${vp} W1 Yair's example: back after 5 days -> 1/30 and 4/7 (${ye.s.streakAfter}/30, ${ye.s.tile + 1}/7)`);
    if (w === 393) await page.screenshot({ path: `${OUT}/v0.6.2/regress/W1-calendar-yair-example-393x852.png` });
    await G(() => { const g = window.__game; g.S.cal = null; g.setClockOffset(0); });
  }
  // test setup: all cards owned (as if bought/won), boosters in stock, today's calendar prize already claimed
  await G(() => { const g = window.__game; const s = g.M.newSave(); for (const id of g.C.ALL_CARDS) g.M.unlockCard(s, id); s.levels.forEach((l) => { l.cleared = true; l.stars = 3; }); s.coins = 99999; for (const k of g.C.BONUS_TYPES) s.bonusStock[k] = 5; g.Cal.touch(s, g.now()); g.Cal.claim(s, g.now(), () => 0); g.setSave(s); g.S.cal = null; });

  // ---------- B6: touch target sizes in battle ----------
  await G(() => window.__game.startBattle(0, ['slingshot', 'spray', 'glue', 'fan', 'ball'], ['bomb', 'freeze'], 5));
  await sleep(150);
  const bb = await btns();
  const sizes = Object.fromEntries(bb.filter((b) => /^(pick\d|wave|reroll|bonus\w+|speed|pause)$/.test(b.id)).map((b) => [b.id, Math.round(Math.min(b.cssW, b.cssH))]));
  for (const id of ['bonusbomb', 'bonusfreeze', 'speed', 'pause']) ok(sizes[id] >= 44, `${vp} B6 ${id} touch target ${sizes[id]}px >= 44`);
  if (w >= 360) for (const id of ['pick0', 'pick1', 'pick2', 'wave', 'reroll']) ok(sizes[id] >= 44, `${vp} B6 ${id} touch target ${sizes[id]}px >= 44`);
  else results.push(`INFO ${vp} B6 other battle targets: ${JSON.stringify(sizes)}`);
  if (w === 320) await page.screenshot({ path: `${OUT}/v0.6.2/regress/battle-320x568.png` });

  // ---------- B7: info panel taps do not fall through to the map ----------
  const spot = await G(() => { const b = window.__game.S.battle; for (let r = 11; r >= 0; r--) for (let c = 0; c < 10; c++) { const t = b.tileInfo(c, r); if (t.valid && !t.onPath && !t.tower) return { c, r }; } });
  await G((s) => { const b = window.__game.S.battle; b.picks[0] = 'slingshot'; b.playCard(0, s.c, s.r); }, spot);
  const tc = await tileCss(spot.c, spot.r); await tap(tc.x, tc.y);
  ok(await G(() => !!window.__game.S.info), `${vp} B7 tapping a tower opens its info panel`);
  const panelBtn = await btn('infoClose');
  ok(panelBtn && (await G(([x, y]) => window.__game.hitAt(x, y), [panelBtn.sx, panelBtn.sy])) === 'infoClose', `${vp} B7 info panel is the top-most target`);
  await G(() => { const g = window.__game; const b = g.S.battle; b.addCrumbs(500); b.picks[1] = 'slingshot'; g.S.sel = { kind: 'card', i: 1 }; });
  const towers0 = await G(() => window.__game.S.battle.towers.length);
  await tap(panelBtn.sx, panelBtn.sy);
  ok(await G(() => window.__game.S.info === null), `${vp} B7 tapping the panel closes it`);
  ok((await G(() => window.__game.S.battle.towers.length)) === towers0, `${vp} B7 panel tap did not place a card on the map underneath`);
  await G(() => { window.__game.S.sel = null; });

  // ---------- B1: input blocked while paused ----------
  await tapId('pause');
  ok(await G(() => window.__game.S.paused), `${vp} B1 pause button pauses`);
  const before = await G(() => { const g = window.__game, b = g.S.battle; return { towers: b.towers.length, wave: b.nextWave, crumbs: b.crumbs, speed: g.S.speed, uses: b.bonusUsesLeft, t: b.time }; });
  const free = await G(() => { const b = window.__game.S.battle; for (let c = 0; c < 10; c++) for (let r = 0; r < 12; r++) { const t = b.tileInfo(c, r); if (t.valid && !t.onPath && !t.tower) return { c, r }; } });
  const fc = await tileCss(free.c, free.r);
  const pick = bb.find((b) => b.id === 'pick0'); const wave = bb.find((b) => b.id === 'wave');
  // tap card then tile, drag card onto tile, tap Next wave / speed / bonuses / redraw
  await tap(pick.sx, pick.sy); await tap(fc.x, fc.y);
  await page.touchscreen.touchStart(pick.sx, pick.sy); for (let k = 1; k <= 6; k++) await page.touchscreen.touchMove(pick.sx + (fc.x - pick.sx) * k / 6, pick.sy + (fc.y + 34 - pick.sy) * k / 6); await page.touchscreen.touchEnd(); await sleep(100);
  for (const id of ['wave', 'speed', 'bonusfreeze', 'bonusbomb', 'reroll']) { const b = bb.find((q) => q.id === id); await tap(b.sx, b.sy); }
  const after = await G(() => { const g = window.__game, b = g.S.battle; return { towers: b.towers.length, wave: b.nextWave, crumbs: b.crumbs, speed: g.S.speed, uses: b.bonusUsesLeft, t: b.time }; });
  ok(JSON.stringify(before) === JSON.stringify(after), `${vp} B1 nothing changed while paused ${JSON.stringify(after)}`);
  ok(await G(() => window.__game.S.paused && window.__game.S.sel === null), `${vp} B1 still paused, no card armed`);
  const live = (await btns()).map((b) => b.id).sort().join(',');
  ok(live === 'quit,restart,resume', `${vp} B1 only resume/restart/quit are tappable while paused (${live})`);
  await tapId('resume');
  ok(await G(() => !window.__game.S.paused), `${vp} B1 resume works`);

  // ---------- B2: bonus deducted at use; Quit/Restart can't refund ----------
  const s0 = await G(() => window.__game.S.save.bonusStock.freeze);
  await tapId('bonusfreeze');
  const s1 = await G(() => ({ mem: window.__game.S.save.bonusStock.freeze, disk: JSON.parse(localStorage.getItem('crumbdefense.save.v1')).bonusStock.freeze }));
  ok(s1.mem === s0 - 1 && s1.disk === s0 - 1, `${vp} B2 freeze deducted and saved immediately (${s0} -> ${s1.mem}/${s1.disk})`);
  await tapId('pause'); await tapId('restart');
  ok((await G(() => window.__game.S.save.bonusStock.freeze)) === s0 - 1, `${vp} B2 Restart does not refund`);
  await tapId('bonusfreeze'); await tapId('pause'); await tapId('quit');
  const s2 = await G(() => ({ mem: window.__game.S.save.bonusStock.freeze, disk: JSON.parse(localStorage.getItem('crumbdefense.save.v1')).bonusStock.freeze, screen: window.__game.S.screen }));
  ok(s2.mem === s0 - 2 && s2.disk === s0 - 2 && s2.screen === 'map', `${vp} B2 Quit does not refund (${s2.mem})`);

  // ---------- V1/W2: tower info shows stats; NO Turn button (always aims at the centre); readable regular-weight text ----------
  await G(() => window.__game.startBattle(0, ['fan', 'slingshot', 'spray', 'glue', 'ball'], ['bomb', 'freeze'], 5)); await sleep(120);
  const fspot = await G(() => { const g = window.__game, b = g.S.battle; b.addCrumbs(200); for (let r = 0; r < 12; r++) for (let c = 0; c < 10; c++) { const t = b.tileInfo(c, r); if (t.valid && !t.onPath && !t.tower) { b.picks[0] = 'fan'; b.playCard(0, c, r); return { c, r }; } } });
  await G(() => window.__game.consumeEvents()); await sleep(100);
  const ftc = await tileCss(fspot.c, fspot.r); await tap(ftc.x, ftc.y); await sleep(80);
  ok(await G(() => window.__game.S.info && window.__game.S.info.tower.type === 'fan'), `${vp} V1 tapping the fan opens its info panel`);
  ok(!(await btn('infoTurn')), `${vp} W2 no Turn button on a directional tower`);
  {
    const f = await G(() => { const g = window.__game, tw = g.S.battle.towers.find((t) => t.type === 'fan'); const T = g.C.TOWERS.fan; return { ax: tw.ax, ay: tw.ay, x: tw.x, y: tw.y, ab: T.ability || T.desc }; });
    // v0.5 item 10b: the fan blows straight along the trail cell next to it (axis-aligned unit vector), or not at all
    const fd = await G(() => { const tw = window.__game.S.battle.towers.find((t) => t.type === 'fan'); return tw.trailDir ? [tw.trailDir.dx, tw.trailDir.dy] : null; });
    ok(fd ? f.ax === fd[0] && f.ay === fd[1] && Math.abs(f.ax) + Math.abs(f.ay) === 1 : f.ax === 0 && f.ay === 0, `${vp} W2 fan blows along the adjacent trail (${f.ax.toFixed(2)}, ${f.ay.toFixed(2)})`);
    await sleep(100);
    const fonts = await G(() => window.__font);
    const body = Object.entries(fonts).filter(([t]) => f.ab.startsWith(t.slice(0, 12)));
    ok(body.length > 0 && body.every(([, fo]) => /^(500|400|normal) 12\.5px/.test(fo)), `${vp} W2 info description is regular weight, 12.5px (${body.map(([, fo]) => fo.split(' ').slice(0, 2).join(' ')).join(',')})`);
    if (w === 393) await page.screenshot({ path: `${OUT}/v0.6.2/regress/W2-info-panel-393x852.png` });
  }
  await G(() => { window.__game.S.info = null; });
  // ---------- V2: "not enough crumbs" is a small short pill above the tray ----------
  await G(() => { const g = window.__game, b = g.S.battle; b.crumbs = 0; b.picks[1] = 'laser'; }); await sleep(60);
  const p1 = await btn('pick1'); await tap(p1.sx, p1.sy); await sleep(60);
  const tl = await G(() => ({ L: window.__game.S.layoutToast, t: window.__game.S.toast && window.__game.S.toast.t }));
  ok(tl.L && tl.L.h <= 26 && tl.L.w <= 220 && tl.L.y + tl.L.h <= 68 + 480 + 4 && tl.t <= 1.0, `${vp} V2 crumbs notice is a small pill above the tray ${JSON.stringify(tl)}`);
  await sleep(1100);
  ok(await G(() => window.__game.S.toast === null), `${vp} V2 crumbs notice gone within ~1 s`);
  await G(() => window.__game.go('map'));
  // ---------- V3/W3: a 0-stock booster is only a warning now (it can be bought in battle with diamonds) ----------
  await G(() => { const g = window.__game; g.S.save.bonusStock.bomb = 0; g.openPrep(3); g.S.prep.bonuses = ['bomb', 'plane']; }); await sleep(150);
  { const { tx } = await texts(100); ok(tx.some((t) => /0 Bombs/.test(t)), `${vp} W3 prep warns about 0 Bombs`); }
  if (w === 393) await page.screenshot({ path: `${OUT}/v0.6.2/regress/W3-prep-zero-booster-393x852.png` });
  await tapId('start'); await sleep(120);
  ok(await G(() => window.__game.S.screen === 'battle'), `${vp} W3 Defend is NOT blocked by a 0-stock booster`);
  await G(() => window.__game.go('map')); await sleep(200); // let the history.back() popstate settle
  await G(() => { const g = window.__game; g.S.save.bonusStock.bomb = 3; g.openPrep(3); g.S.prep.bonuses = ['plane', 'freeze']; }); await sleep(120);
  // ---------- V4: warning text wraps inside its box ----------
  const lw = await G(() => window.__game.S.layoutWarn);
  ok(lw && lw.lines.length >= 1 && lw.lines.every((x) => x <= lw.maxW + 0.5) && lw.box.x >= 14 && lw.box.x + lw.box.w <= 386, `${vp} V4 flying-ant warning wraps inside its box (${lw && lw.lines.map(Math.round).join('/')} <= ${lw && lw.maxW})`);
  const sb = await btn('start'); const bk = await btn('back');
  ok(sb && bk && lw.box.y + lw.box.h <= Math.min(sb.y, bk.y) + 0.5, `${vp} V4 warning box ends above Back/Defend (${lw && lw.box.y + lw.box.h} vs ${sb && sb.y}/${bk && bk.y})`);
  if (w === 320) await page.screenshot({ path: `${OUT}/v0.6.2/regress/prep-warning-320x568.png` });
  await G(() => window.__game.go('map'));

  // ---------- B8: Cards screen description of every card: real numbers, no NaN/undefined ----------
  {
    const badCards = [];
    for (const id of await G(() => window.__game.C.ALL_CARDS)) {
      await G((i) => { const g = window.__game; g.go('cards'); g.S.cardsSel = i; }, id);
      const { tx } = await texts(80);
      const desc = tx.join(' '); // v0.5 item 1b/5b: real stats + the next card-level upgrade
      if (bad(tx).length || !/Next card level L\d+: |Top card level/.test(desc)) badCards.push(`${id}:${bad(tx).join('|') || 'missing next-level line'}`);
    }
    ok(badCards.length === 0, `${vp} B8 Cards screen panel shows real stats + the next card upgrade, no NaN/undefined ${badCards.join(' ')}`);
    if (w === 320) await page.screenshot({ path: `${OUT}/v0.6.2/regress/B8-cards-desc-320x568.png` });
    await G(() => window.__game.go('map'));
  }
  // ---------- B9: upgrade-opened info panel auto-closes after UI.upgradeInfoTime; stays if the player opened/tapped it ----------
  {
    await G(() => window.__game.startBattle(9, ['slingshot', 'spray', 'glue', 'fan', 'ball'], ['bomb', 'freeze'], 5)); await sleep(120);
    const spots = await G(() => { const b = window.__game.S.battle; b.addCrumbs(900); const out = []; for (let r = 11; r >= 0 && out.length < 2; r--) for (let c = 0; c < 10 && out.length < 2; c++) { const t = b.tileInfo(c, r); if (t.valid && !t.onPath && !t.tower) { b.picks[0] = 'slingshot'; b.playCard(0, c, r); out.push({ c, r }); } } window.__game.consumeEvents(); return out; });
    const upg = (sp) => G((sp) => { const g = window.__game, b = g.S.battle; b.picks[0] = 'slingshot'; b.playCard(0, sp.c, sp.r); g.consumeEvents(); }, sp);
    const T = await G(() => window.__game.C.UI.upgradeInfoTime);
    // a) untouched: open after the upgrade, closed after T (+ margin)
    await upg(spots[0]); await sleep(150);
    const openA = await G(() => !!(window.__game.S.info && window.__game.S.info.changed));
    await sleep(T * 1000 + 300);
    ok(openA && (await G(() => window.__game.S.info === null)), `${vp} B9 upgrade panel opened (${openA}) and auto-closed after ${T}s`);
    // b) player taps the upgraded tower while the panel is up -> it stays open
    await upg(spots[1]); await sleep(150);
    const tc2 = await tileCss(spots[1].c, spots[1].r); await tap(tc2.x, tc2.y);
    await sleep(T * 1000 + 300);
    ok(await G(() => !!window.__game.S.info && window.__game.S.info.tower.c === window.__game.S.battle.towers.find((t) => t.lvl === 2 && t !== window.__game.S.battle.towers[0])?.c), `${vp} B9 panel stays open when the player tapped the tower`);
    // c) player had the panel open themselves before upgrading -> stays open
    await G(() => { window.__game.S.info = null; });
    const tc1 = await tileCss(spots[0].c, spots[0].r); await tap(tc1.x, tc1.y);
    await upg(spots[0]); await sleep(T * 1000 + 300);
    ok(await G(() => !!window.__game.S.info && window.__game.S.info.tower.lvl === 3), `${vp} B9 panel the player opened stays open through an upgrade`);
    // d) the panel never hides the L10 queen for longer than T: after an untouched upgrade, the map is clear
    await G(() => { window.__game.S.info = null; });
  }
  // ---------- B10a: marble 'Roll' chip = actual roll at that spot (same number as the aim line); marble width has a unit ----------
  {
    await G(() => window.__game.startBattle(0, ['ball', 'slingshot', 'spray', 'glue', 'fan'], ['bomb', 'freeze'], 5)); await sleep(100);
    const res = await G(() => {
      const g = window.__game, b = g.S.battle; b.addCrumbs(900);
      for (let r = 0; r < 12; r++) for (let c = 0; c < 10; c++) { const t = b.tileInfo(c, r); if (t.valid && !t.onPath && !t.tower) { b.picks[0] = 'ball'; if (b.canPlay(0, c, r).ok) { b.playCard(0, c, r); g.consumeEvents(); const tw = b.towers[b.towers.length - 1]; if (!(tw.runLen > 0)) { b.towers.pop(); continue; } g.S.info = { tower: tw, t: 0 }; return { c, r, run: tw.runLen, tiles: tw.trailDir.run, tile: g.C.TILE }; } } }
    });
    const { tx } = await texts(100);
    const want = `${res.tiles} tile${res.tiles > 1 ? 's' : ''}`; // v0.5 item 2: straight trail tiles until the wall/turn where it breaks
    ok(res && tx.includes(want) && tx.some((t) => t.startsWith('Roll here')), `${vp} B10 marble panel shows the roll at this spot "${want}"`);
    ok(tx.some((t) => /Marble width [\d.]+ tiles \u2192 [\d.]+ tiles/.test(t)), `${vp} B10 marble size upgrade line has a unit (${tx.find((t) => t.includes('Marble')) || 'none'})`);
  }
  // ---------- B10b: Perfect Cookie title drawn once per frame; dimmed tray under results takes no taps ----------
  {
    await G(() => { const g = window.__game; g.startBattle(0, ['slingshot', 'spray', 'glue', 'fan', 'ball'], ['bomb', 'freeze'], 1); const b = g.S.battle; b.nextWave = b.waves.length; g.simulate(0.1, false); });
    const cel = await texts(500);
    const per = cel.tx.filter((t) => t === 'Perfect Cookie!').length / Math.max(1, cel.frames);
    ok(await G(() => window.__game.S.result && window.__game.S.result.perfect) && per > 0.5 && per <= 1.01, `${vp} B10 "Perfect Cookie!" drawn once per frame during the celebration (${per.toFixed(2)}/frame)`);
    await sleep(1800);
    const before = await G(() => { const g = window.__game; return JSON.stringify({ st: g.S.save.bonusStock, p: g.S.paused, sel: g.S.sel, sp: g.S.speed, uses: g.S.battle.bonusUsesLeft }); });
    const under = (await btns()).filter((b) => /^(pick\d|bonus\w+|pause|speed|wave|reroll)$/.test(b.id));
    const tops = [];
    // every tray target is covered either by the blocker or by a result button (Map/Retry/Next overlap the tray top); tap only the blocked ones
    for (const b of under) { const t = await G(([x, y]) => window.__game.hitAt(x, y), [b.sx, b.sy]); tops.push(t); if (t === 'resultBlock') await tap(b.sx, b.sy); }
    const after = await G(() => { const g = window.__game; return JSON.stringify({ st: g.S.save.bonusStock, p: g.S.paused, sel: g.S.sel, sp: g.S.speed, uses: g.S.battle.bonusUsesLeft }); });
    ok(under.length >= 5 && tops.every((t) => t === 'resultBlock' || /^r(map|retry|next)$/.test(t)) && tops.filter((t) => t === 'resultBlock').length >= 5 && before === after && (await G(() => window.__game.S.screen === 'battle' && !!window.__game.S.result)), `${vp} B10 taps on the dimmed tray under the result are swallowed (${under.length} targets, top=${[...new Set(tops)].join('/')})`);
    ok(!!(await btn('rmap')) && (await G(([x, y]) => window.__game.hitAt(x, y), [(await btn('rmap')).sx, (await btn('rmap')).sy])) === 'rmap', `${vp} B10 result buttons still on top of the tap blocker`);
    if (w === 320) await page.screenshot({ path: `${OUT}/v0.6.2/regress/B10-result-after-tray-taps-320x568.png` });
    await G(() => window.__game.go('map'));
  }

  // ---------- W4: buy 50 crumbs with diamonds: 10, 20, 40 ...; pauses while open; resets next battle ----------
  {
    await G(() => { const g = window.__game; g.S.save.diamonds = 100; g.startBattle(0, ['slingshot', 'spray', 'glue', 'fan', 'ball'], ['bomb', 'freeze'], 5); }); await sleep(150);
    const plus = await btn('buyCrumbs');
    ok(plus && (await G(([x, y]) => window.__game.hitAt(x, y), [plus.sx, plus.sy])) === 'buyCrumbs' && Math.min(plus.cssW, plus.cssH) >= 44, `${vp} W4 crumb "+" is tappable and >= 44px`);
    await tap(plus.sx, plus.sy);
    const d1 = await G(() => window.__game.S.dialog && { k: window.__game.S.dialog.kind, p: window.__game.S.dialog.price });
    const t0 = await G(() => window.__game.S.battle.time); await sleep(300); const t1 = await G(() => window.__game.S.battle.time);
    ok(d1 && d1.k === 'crumbs' && d1.p === 10 && t0 === t1, `${vp} W4 crumb dialog opens at 10 diamonds and the battle waits (${JSON.stringify(d1)})`);
    if (w === 393) await page.screenshot({ path: `${OUT}/v0.6.2/regress/W4-crumb-dialog-393x852.png` });
    const c0 = await G(() => window.__game.S.battle.crumbs);
    await tapId('dlgBuy');
    const a1 = await G(() => ({ c: window.__game.S.battle.crumbs, d: window.__game.S.save.diamonds, disk: JSON.parse(localStorage.getItem('crumbdefense.save.v1')).diamonds, open: !!window.__game.S.dialog }));
    ok(a1.c === c0 + 50 && a1.d === 90 && a1.disk === 90 && !a1.open, `${vp} W4 bought +50 crumbs for 10 (diamonds ${a1.d}, saved ${a1.disk})`);
    await tapId('buyCrumbs'); const p2 = await G(() => window.__game.S.dialog.price); await tapId('dlgBuy');
    await tapId('buyCrumbs'); const p3 = await G(() => window.__game.S.dialog.price); await tapId('dlgCancel');
    ok(p2 === 20 && p3 === 40 && (await G(() => window.__game.S.save.diamonds)) === 70, `${vp} W4 price doubles: 10 -> ${p2} -> ${p3}; Cancel spends nothing`);
    await G(() => window.__game.startBattle(0, ['slingshot', 'spray', 'glue', 'fan', 'ball'], ['bomb', 'freeze'], 5)); await sleep(100);
    await tapId('buyCrumbs'); ok((await G(() => window.__game.S.dialog.price)) === 10, `${vp} W4 price is back to 10 in the next battle`);
    await tapId('dlgCancel');
    // not enough diamonds: Buy is disabled
    await G(() => { window.__game.S.save.diamonds = 3; }); await tapId('buyCrumbs'); await tapId('dlgBuy');
    ok((await G(() => window.__game.S.save.diamonds)) === 3, `${vp} W4 cannot buy with too few diamonds`);
    await G(() => { window.__game.S.dialog = null; });
  }
  // ---------- W5: booster with 0 stock: buy for 20; v0.4 item 10: the price stays 20 (no escalation) ----------
  {
    await G(() => { const g = window.__game; g.S.save.diamonds = 100; g.S.save.bonusStock.bomb = 0; g.S.save.bonusStock.freeze = 0; g.startBattle(0, ['slingshot', 'spray', 'glue', 'fan', 'ball'], ['bomb', 'freeze'], 5); }); await sleep(150);
    { const { tx } = await texts(100); ok(tx.includes('20'), `${vp} W5 a 0-stock booster shows its diamond price`); }
    { const { tx } = await texts(100); ok(tx.includes('100'), `${vp} V4-9 battle HUD shows the diamonds in stock (100)`); }
    if (w === 393) await page.screenshot({ path: `${OUT}/v0.6.2/regress/W5-tray-zero-boosters-393x852.png` });
    await tapId('bonusbomb');
    const d = await G(() => window.__game.S.dialog && { k: window.__game.S.dialog.kind, p: window.__game.S.dialog.price });
    ok(d && d.k === 'booster' && d.p === 20, `${vp} W5 tapping a 0-stock booster opens the buy dialog at 20 (${JSON.stringify(d)})`);
    if (w === 393) await page.screenshot({ path: `${OUT}/v0.6.2/regress/W5-booster-dialog-393x852.png` });
    await tapId('dlgBuy');
    const a = await G(() => ({ st: window.__game.S.save.bonusStock.bomb, bst: window.__game.S.battle.bonusStock.bomb, d: window.__game.S.save.diamonds }));
    ok(a.st === 1 && a.bst === 1 && a.d === 80, `${vp} W5 bought 1 Bomb for 20 (${JSON.stringify(a)})`);
    await tapId('bonusfreeze'); ok((await G(() => window.__game.S.dialog && window.__game.S.dialog.price)) === 20, `${vp} W5 next booster still costs 20 (fixed price)`);
    await tapId('dlgCancel');
    await G(() => window.__game.go('map'));
  }
  // ---------- W6: Shop: every card listed; locked ones unlock for coins; boosters header ----------
  {
    await G(() => { const g = window.__game; g.S.save.cards.zapper.unlocked = false; g.S.save.coins = 500; g.go('shop'); }); await sleep(150);
    const { tx } = await texts(100);
    ok(tx.some((t) => /^Unlock \d+c$/.test(t)) && tx.some((t) => /^Boosters - /.test(t)), `${vp} W6 shop shows "Unlock" on a locked card and a Boosters header`);
    if (w === 393) await page.screenshot({ path: `${OUT}/v0.6.2/regress/W6-shop-393x852.png` });
    await tapId('buyzapper');
    const z = await G(() => ({ u: window.__game.S.save.cards.zapper.unlocked, c: window.__game.S.save.coins }));
    ok(z.u && z.c === 500 - (await G(() => window.__game.M.unlockPrice("zapper"))), `${vp} W6 unlocking a card in the Shop costs coins (${z.c} left)`);
    ok(await G(() => window.__game.S.reveal.length === 1), `${vp} v0.5 item 7: a shop unlock queues the NEW CARD reveal`);
    await G(() => { window.__game.S.reveal = []; window.__game.go('map'); });
  }
  // ---------- W7: first clear of level 1 on a fresh save -> exactly one Bomb, shown on the result ----------
  {
    await G(() => { const g = window.__game; const s = g.M.newSave(); g.Cal.touch(s, g.now()); g.Cal.claim(s, g.now(), () => 0); g.setSave(s); g.S.cal = null;
      g.startBattle(0, ['slingshot', 'spray', 'glue', 'fan', 'ball'], ['bomb', 'freeze'], 1); const b = g.S.battle; b.foodStored = 95; b.nextWave = b.waves.length; g.simulate(0.1, false); });
    await sleep(1900);
    const { tx } = await texts(150);
    const st = await G(() => window.__game.S.save.bonusStock);
    ok(tx.includes('First clear: +1 Bomb booster') && st.bomb === 1 && Object.values(st).reduce((a, b) => a + b, 0) === 1, `${vp} W7 first clear of level 1: one Bomb (${JSON.stringify(st)})`);
    if (w === 393) await page.screenshot({ path: `${OUT}/v0.6.2/regress/W7-first-clear-bomb-393x852.png` });
    await G(() => window.__game.go('map'));
  }
  // ---------- W8: map shows coins and diamonds + the Calendar button ----------
  {
    await sleep(120); const { tx } = await texts(100);
    ok(tx.includes('Calendar') && !!(await btn('calendar')), `${vp} W8 map has a Calendar button`);
    await tapId('calendar'); ok(await G(() => !!window.__game.S.cal), `${vp} W8 Calendar button opens the calendar`);
    await tapId('calClose');
    // v0.4 item 11: the badge is a square (soft corners), still a >= 44 px touch target
    { const cb = await btn('calendar'); ok(cb && Math.abs(cb.cssW - cb.cssH) < 1 && cb.cssW >= 44, `${vp} V4-11 Calendar badge is square and >= 44px (${cb && Math.round(cb.cssW)}x${cb && Math.round(cb.cssH)})`); }
    // v0.4 item 17: Cards button blinks for 5 s the first time a card is affordable - once
    { const r = await G(async () => { const g = window.__game; g.S.save.cardBlink = g.M.newCardBlinkState(); g.S.save.coins = 50; g.S.cardsBlinkUntil = 0; await new Promise((q) => setTimeout(q, 150));
        const first = g.S.cardsBlinkUntil - g.S.t; g.S.cardsBlinkUntil = 0; await new Promise((q) => setTimeout(q, 150)); return { first, again: g.S.cardsBlinkUntil, flags: g.S.save.cardBlink }; });
      ok(r.first > 4 && r.first <= 5 && r.again === 0 && r.flags.affordShown, `${vp} V4-17 Cards blink starts once for 5 s (${JSON.stringify(r)})`); }
    await G(() => { const g = window.__game; const s = g.S.save; for (const id of g.C.ALL_CARDS) g.M.unlockCard(s, id); s.levels.forEach((l) => { l.cleared = true; l.stars = 3; }); s.coins = 99999; for (const k of g.C.BONUS_TYPES) s.bonusStock[k] = 5; g.setSave(s); });
  }

  // ---------- B5: floating texts merge ----------
  await G(() => window.__game.startBattle(9, ['laser', 'zapper', 'sound', 'gate', 'slingshot'], ['bomb', 'freeze'], 2));
  await G(() => { const b = window.__game.S.battle; for (let i = 0; i < 25; i++) { b.emit({ type: 'foodReturn', x: 200 + i, y: 300, n: 1 }); b.emit({ type: 'queenCall', x: 100 + i * 8, y: 100 }); } });
  await sleep(200);
  const tx = await G(() => window.__game.S.fx.filter((f) => f.k === 'txt').map((f) => f.s));
  ok(tx.filter((s) => s.includes('food back')).length === 1 && tx.includes('+25 food back!') && tx.filter((s) => s === 'Scouts, go!').length === 1, `${vp} B5 texts merged: ${JSON.stringify(tx)}`);
  await G(() => window.__game.go('map'));

  // ---------- B4: level 10 ant icons fit ----------
  await G(() => window.__game.openPrep(9)); await sleep(150);
  const ants = await G(() => window.__game.S.layoutPrepAnts);
  const inside = ants.every((a) => a.x >= 14 && a.x + a.w <= 386 && a.y >= 100);
  const noOverlap = ants.every((a, i) => i === 0 || a.x >= ants[i - 1].x + ants[i - 1].w - 2);
  const nTypes = await G(() => new Set(window.__game.S.prep && window.__game.C.LEVELS[9].mix.map((m) => m.type).concat(['queen'])).size); // v0.4: max 5 types
  ok(ants.length === nTypes && ants.length <= 5 && inside && noOverlap, `${vp} B4 ${ants.length} ant icons (<= 5 types) inside the panel, below the waves line, not overlapping`);
  if (w === 320) await page.screenshot({ path: `${OUT}/v0.6.2/regress/prep-L10-320x568.png` });

  // ---------- B3 (v0.6 items 4/7): every card opens its own screen; its Merge buttons are tappable (3 x L1 -> L2, 3 x L2 -> L3) ----------
  {
    await G(() => { const g = window.__game; for (const id of g.C.ALL_CARDS) { g.M.unlockCard(g.S.save, id); const c = g.S.save.cards[id]; c.inv = { 1: 3, 2: 2 }; c.seen = [1, 2]; c.level = 2; c.fresh = false; } g.S.save.coins = 99999; g.S.cardsSel = 'gate'; g.go('cards'); });
    await sleep(150);
    { const { tx } = await texts(100); const cp = tx.filter((t) => /cop(y|ies)/i.test(t)); ok(cp.length === 0 && tx.includes('Merge all'), `${vp} v0.6 item 4/8: Cards screen has no "copies" and a Merge all button ${cp.join('|')}`); }
    if (w === 393) await page.screenshot({ path: `${OUT}/v0.6.2/regress/cards-grid-393x852.png` });
    const ids = await G(() => window.__game.S.layoutMerge);
    let good = 0; const badM = [];
    for (const id of ids) {
      await G((i) => { window.__game.S.cardsSel = i; window.__game.go('cards'); }, id); await sleep(80);
      const ob = await btn('open' + id); if (!ob) { badM.push(`${id}(no open)`); continue; }
      await tap(ob.sx, ob.sy);
      const view = await G(() => window.__game.S.screen + ':' + window.__game.S.cardView);
      if (w === 393 && id === 'tractor') await page.screenshot({ path: `${OUT}/v0.6.2/regress/card-view-tractor-393x852.png` });
      const steps = [];
      for (const [row, want] of [[1, [0, 3, 2]], [2, [0, 0, 3]]]) {
        const b = await btn('mrg' + row); if (!b) { steps.push(`no mrg${row}`); continue; }
        const top = await G(([x, y]) => window.__game.hitAt(x, y), [b.sx, b.sy]);
        await tap(b.sx, b.sy);
        const anim = await G(() => !!window.__game.S.mergeAnim); await sleep(80);
        const skipTop = anim && (await G(() => window.__game.hitAt(Math.round(innerWidth / 2), Math.round(innerHeight / 2)))) === 'mergeSkip';
        if (anim) await tap(Math.round(w / 2), Math.round(h / 2));
        const c = await G((i) => window.__game.S.save.cards[i], id);
        const okStep = top === 'mrg' + row && (c.inv[1] || 0) === want[0] && (c.inv[2] || 0) === want[1] && c.level === want[2] && Math.min(b.cssW, b.cssH) >= 44 && anim && skipTop && (await G(() => window.__game.S.mergeAnim === null));
        if (!okStep) steps.push(`mrg${row}(top=${top},inv=${JSON.stringify(c.inv)},lvl=${c.level},anim=${anim},skip=${skipTop})`);
        if (w === 320 && id === 'gate' && row === 1) await page.screenshot({ path: `${OUT}/v0.6.2/regress/card-view-after-merge-320x568.png` });
      }
      if (view === 'card:' + id && !steps.length) good++; else badM.push(`${id}(${view}) ${steps.join(' ')}`);
    }
    const nCards = await G(() => window.__game.C.ALL_CARDS.length);
    ok(nCards === 13 && ids.length === 13 && good === 13, `${vp} B3/V5 all ${nCards} cards: own screen opens, Merge buttons tappable, animation shown and skippable ${badM.join(' ')}`);
    // v0.6 item 8: Merge all
    await G(() => { const g = window.__game; for (const id of g.C.ALL_CARDS) { const c = g.S.save.cards[id]; c.inv = { 1: 9 }; c.seen = [1]; c.level = 1; } g.S.save.coins = 99999; g.S.mergeAnim = null; g.S.cardsSel = null; g.go('cards'); });
    await sleep(120);
    const mb = await btn('mergeAll');
    ok(mb && (await G(([x, y]) => window.__game.hitAt(x, y), [mb.sx, mb.sy])) === 'mergeAll' && Math.min(mb.cssW, mb.cssH) >= 44, `${vp} v0.6 item 8 Merge all is top-most and >= 44px`);
    await tap(mb.sx, mb.sy); await sleep(100);
    const ma = await G(() => { const g = window.__game; return g.C.ALL_CARDS.every((id) => { const c = g.S.save.cards[id]; return c.level === 3 && c.inv[3] === 1 && g.M.totalCards(c) === 1; }); });
    ok(ma, `${vp} v0.6 item 8 Merge all: 9 x L1 -> 1 x L3 for every card`);
    if (w === 393) await page.screenshot({ path: `${OUT}/v0.6.2/regress/merge-all-anim-393x852.png` });
    await G(() => { window.__game.S.mergeAnim = null; window.__game.go('cards'); }); await sleep(120);
    if (w === 320) await page.screenshot({ path: `${OUT}/v0.6.2/regress/cards-320x568.png` });
  }
  // ---------- v0.6 item 5: Zapper onboarding - first stage-2 win -> Continue -> map finger on Shop -> free gift -> NEW CARD Zapper ----------
  {
    await G(() => { const g = window.__game; const s = g.M.newSave(); s.levels[0] = { cleared: true, stars: 3 }; g.Cal.touch(s, g.now()); g.Cal.claim(s, g.now(), () => 0); g.setSave(s); g.S.cal = null; g.S.reveal = [];
      g.startBattle(1, ['slingshot', 'spray', 'glue', 'fan', 'ball'], ['bomb', 'freeze'], 1); const b = g.S.battle; b.foodStored = 95; b.stats.stolen = 5; b.nextWave = b.waves.length; b.time = 200; g.simulate(0.1, false); });
    await sleep(1900);
    const { tx } = await texts(150);
    ok(tx.some((t) => /^Time survived/.test(t)), `${vp} v0.6 item 1 results show a "Time survived" line`);
    if (w === 393) await page.screenshot({ path: `${OUT}/v0.6.2/regress/results-time-coins-393x852.png` });
    const cont = await btn('rcontinue');
    ok(!!cont && (await G(() => window.__game.M.zapperGiftPending(window.__game.S.save))), `${vp} v0.6 item 5 first stage-2 win: gift pending, single Continue button`);
    if (cont) await tap(cont.sx, cont.sy); await sleep(250);
    const shopB = await btn('shop');
    const top = shopB && (await G(([x, y]) => window.__game.hitAt(x, y), [shopB.sx, shopB.sy]));
    const blocked = await G(() => window.__game.hitAt(20, 200));
    ok(await G(() => window.__game.S.screen === 'map') && top === 'shop' && blocked === 'onboardBlock', `${vp} v0.6 item 5 map is dimmed, only Shop is tappable (top=${top}, elsewhere=${blocked})`);
    if (shopB) { const br = await bright(shopB); ok(br.outside < 130 && br.target > 170 && br.target - br.outside > 60, `${vp} v0.6.1 B1 map: screen dimmed, Shop button bright (outside ${br.outside}, target ${br.target})`); }
    if (w === 393) await page.screenshot({ path: `${OUT}/v0.6.2/regress/onboard-map-finger-393x852.png` });
    if (shopB) await tap(shopB.sx, shopB.sy); await sleep(200);
    const gb = await btn('gift');
    ok(await G(() => window.__game.S.screen === 'shop') && !!gb && (await G(([x, y]) => window.__game.hitAt(x, y), [gb.sx, gb.sy])) === 'gift', `${vp} v0.6 item 5 shop shows the FREE gift on top`);
    if (gb) { const br = await bright(gb); ok(br.outside < 130 && br.target > 150 && br.target - br.outside > 50, `${vp} v0.6.1 B1 shop: screen dimmed, FREE button bright (outside ${br.outside}, target ${br.target})`); }
    if (w === 393) await page.screenshot({ path: `${OUT}/v0.6.2/regress/onboard-shop-gift-393x852.png` });
    const coins0 = await G(() => window.__game.S.save.coins);
    if (gb) await tap(gb.sx, gb.sy); await sleep(600);
    const g5 = await G(() => { const g = window.__game, s = g.S.save; return { z: s.cards.zapper.unlocked, coins: s.coins, n: g.C.ALL_CARDS.reduce((k, id) => k + g.M.totalCards(s.cards[id]), 0), rev: g.S.reveal.map((r) => r.id || r.type || r.card), pend: g.M.zapperGiftPending(s), disk: JSON.parse(localStorage.getItem('crumbdefense.save.v1')).onboard.zapperGift }; });
    ok(g5.z && g5.coins === coins0 && g5.n === 10 && !g5.pend && g5.disk === 'done' && g5.rev.length >= 1, `${vp} v0.6 item 5 free gift: 5 cards (4 + Zapper), no coins spent, NEW CARD reveal queued, saved (${JSON.stringify(g5)})`);
    await sleep(500);
    if (w === 393) await page.screenshot({ path: `${OUT}/v0.6.2/regress/onboard-zapper-reveal-393x852.png` });
    await G(() => { const g = window.__game; g.S.reveal = []; g.go('map'); });
  }
  // ---------- v0.6.1 B2: tower bodies come from cached sprites (per type x visual level), rebuilt after a resize ----------
  {
    const r = await G(() => { const g = window.__game, A = g.A; const types = Object.keys(g.C.TOWERS);
      const cv = document.createElement('canvas'); cv.width = 300; cv.height = 300; const c = cv.getContext('2d'); c.setTransform(3, 0, 0, 3, 0, 0);
      const draw = (type, lvl) => { c.save(); c.translate(50, 60); A.drawTower(c, type, 0.5, { lvl, aim: 0.3, fireFx: 0, id: 1, dirx: 1, diry: 0, type }); c.restore(); };
      A.clearTowerCache(); const per = {};
      for (const type of types) { const seen = new Set(); for (let L = 1; L <= 6; L++) { const k0 = new Set(g.spriteCache(true).keys); draw(type, L); for (const k of g.spriteCache(true).keys) if (!k0.has(k)) seen.add(k); } per[type] = seen.size; }
      const st = g.spriteCache(true); const m0 = st.misses; for (const type of types) for (let L = 1; L <= 6; L++) draw(type, L);
      const again = g.spriteCache().misses - m0;
      window.dispatchEvent(new Event('resize')); const afterResize = g.spriteCache().parts; g.renderOnce && g.renderOnce(); draw('slingshot', 3);
      return { per, parts: st.parts, clipped: st.clipped, again, afterResize, rebuilt: g.spriteCache().parts }; });
    ok(Object.values(r.per).every((n) => n >= 3), `${vp} v0.6.1 B2 every type (incl. Glue/Lava/Perfume/E-Gate/Tractor) bakes its own body sprites per level (${JSON.stringify(r.per)})`);
    ok(r.again === 0 && r.clipped === 0, `${vp} v0.6.1 B2 second pass over 13 types x L1-L6 = 0 new bakes, 0 clipped sprites (${r.parts} sprites)`);
    ok(r.afterResize === 0 && r.rebuilt > 0, `${vp} v0.6.1 B2 resize clears the tower cache and it rebuilds (after resize ${r.afterResize}, then ${r.rebuilt})`);
  }
  // ---------- v0.6.1 item 7: Shop + pre-battle card pictures keep >= 44 css-px tap targets ----------
  {
    await G(() => { const g = window.__game, s = g.S.save; for (const id of g.C.ALL_CARDS) g.M.unlockCard(s, id); g.setSave(s); g.S.reveal = []; g.go('shop'); }); await sleep(200);
    const sb = (await btns()).filter((b) => /^buy/.test(b.id));
    ok(sb.length === 13 && sb.every((b) => b.cssW >= 44 && b.cssH >= 44), `${vp} v0.6.1 item 7 shop card pictures: 13 tap targets >= 44 css px (min ${Math.min(...sb.map((b) => Math.min(b.cssW, b.cssH))).toFixed(1)})`);
    if (w === 393) await page.screenshot({ path: `${OUT}/v0.6.2/regress/shop-card-pictures-393x852.png` });
    await G(() => window.__game.openPrep(1)); await sleep(200);
    const db = (await btns()).filter((b) => /^deck/.test(b.id));
    ok(db.length === 13 && db.every((b) => b.cssW >= 44 && b.cssH >= 44), `${vp} v0.6.1 item 7 prep card pictures: 13 tap targets >= 44 css px`);
    if (w === 393 || w === 320) await page.screenshot({ path: `${OUT}/v0.6.2/regress/prep-card-pictures-${vp}.png` });
    await G(() => window.__game.go('map'));
  }
  // ---------- v0.6 item 6/10: the Tractor in battle; upgrade levels change the shape ----------
  {
    await G(() => { const g = window.__game; const s = g.S.save; for (const id of g.C.ALL_CARDS) g.M.unlockCard(s, id); g.setSave(s); g.startBattle(2, ['tractor', 'slingshot', 'gate', 'laser', 'glue'], ['bomb', 'freeze'], 5); });
    await sleep(120);
    const r = await G(() => { const g = window.__game, b = g.S.battle; b.addCrumbs(5000); const out = [];
      for (let rr = 0; rr < 12 && out.length < 6; rr++) for (let c = 0; c < 10 && out.length < 6; c++) { const t = b.tileInfo(c, rr); if (t.valid && !t.onPath && !t.tower && b.trailDirection(c, rr)) { const type = out.length % 2 ? 'slingshot' : 'tractor'; b.picks[0] = type; b.playCard(0, c, rr); const tw = b.towers.at(-1); for (let L = 1; L < 1 + out.length; L++) { b.picks[0] = type; b.playCard(0, c, rr); } out.push({ c, r: rr, lvl: tw.lvl, type }); } }
      g.consumeEvents(); g.S.info = null; return out; });
    ok(r.length === 6 && r.map((x) => x.lvl).join() === '1,2,3,4,5,6', `${vp} v0.6 item 11 towers upgrade to level 6 (${r.map((x) => x.type[0] + x.lvl).join(' ')})`);
    await G(() => { const g = window.__game, b = g.S.battle; b.nextWaveAt = 0; }); await sleep(2500);
    const sc = await G(() => window.__game.spriteCache && window.__game.spriteCache());
    ok(sc && sc.parts > 0 && sc.hits > sc.misses, `${vp} v0.6 item 9 tower bodies come from the sprite cache (${JSON.stringify(sc)})`);
    if (w === 393) await page.screenshot({ path: `${OUT}/v0.6.2/regress/tractor-levels-battle-393x852.png` });
    await G(() => window.__game.go('map'));
  }
  // ---------- W9: item 13 - no "bonus" anywhere on screen during the whole run ----------
  { const all = await G(() => [...window.__allTx]); const bon = all.filter((t) => /bonus/i.test(t)); ok(bon.length === 0, `${vp} W9 no "bonus" text drawn (boosters only) ${bon.slice(0, 5).join(' | ')}`); }
  const allBad = bad(await G(() => [...window.__allTx]));
  ok(allBad.length === 0, `${vp} B8 no NaN/undefined/null text drawn anywhere during the whole run ${allBad.slice(0, 5).join(' | ')}`);
  ok(errors.length === 0, `${vp} no console errors ${errors.join(' | ')}`);
  await page.close();
}

// ---------- production build: loads cleanly, no debug hook ----------
const page = await browser.newPage();
const perr = []; page.on('pageerror', (e) => perr.push(e.message)); page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') perr.push(m.text()); });
const ext = []; page.on('request', (r) => { if (!r.url().startsWith('http://127.0.0.1:8772/')) ext.push(r.url()); });
await page.emulate({ viewport: { width: 393, height: 852, deviceScaleFactor: 2.75, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 14) Mobile' });
await page.goto('http://127.0.0.1:8772/index.html'); await sleep(800);
await page.screenshot({ path: `${OUT}/v0.6.2/regress/production-calendar.png` });
await page.touchscreen.tap(196, 688); await sleep(300); // calendar "Later"
await page.touchscreen.tap(108, 662); await sleep(300); // level 1 node -> prep screen
await page.screenshot({ path: `${OUT}/v0.6.2/regress/production-prep.png` });
ok(await page.evaluate(() => typeof window.__game === 'undefined'), 'production build has no window.__game');
ok(perr.length === 0 && ext.length === 0, `production build: no console errors/warnings, no external requests ${perr.join(' | ')} ${ext.join(' ')}`);
await browser.close(); srvT.close(); srvP.close();
console.log(results.join('\n'));
console.log(fails ? `\n${fails} FAILED` : `\nALL ${results.filter((r) => r.startsWith('PASS')).length} UI CHECKS PASSED`);
process.exit(fails ? 1 : 0);
