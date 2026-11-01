// Pass 6 shots + audit: U7 (defeat hint rules), U9 (next-step ring), U8 (3-size audit: map, prep, battle, result). usage: node shots-p6.mjs <outdir> [parts: u7,u9,u8]
import { launch, richSave, setupBattle, sleep } from './harness.mjs'; import fs from 'node:fs';
const OUT = process.argv[2]; fs.mkdirSync(OUT, { recursive: true }); const PARTS = (process.argv[3] || 'u7,u9,u8').split(',');
const freeze = (ev) => ev(() => { window.__ft = performance.now(); window.__run = 0; window.requestAnimationFrame = (cb) => setTimeout(() => { if (window.__run > 0) { window.__run--; window.__ft += 16.667; } cb(window.__ft); }, 16); });
const mk = (page, ev, dir = OUT) => ({
  step: async (sec) => { await ev((s) => { window.__run = Math.max(1, Math.round(s * 60)); }, sec); await page.waitForFunction(() => window.__run === 0, { polling: 10 }); await sleep(40); },
  shot: async (name, clip) => { for (let k = 0; k < 5; k++) { const buf = await page.screenshot({ path: `${dir}/${name}.png`, clip }); if (buf.length > 9000) return; await sleep(150); } },
});
const results = {};
if (PARTS.includes('u7')) {
  const cases = [
    ['carrier', 4, ['slingshot', 'laser', 'glue', 'spray', 'fan'], (b) => { b.stats.stolen = 12; b.stats.lostOnWay = 9; }, 1],
    ['healer', 33, ['slingshot', 'laser', 'glue', 'spray', 'fan'], (b) => { b.stats.stolen = 0; b.stats.lostOnWay = 0; b.spawn('nurse', 40); }, 1],
    ['flyer', 5, ['slingshot', 'glue', 'spray', 'fan', 'ball'], (b) => { b.stats.stolen = 6; b.stats.lostOnWay = 0; b.stats.flyLeak = 6; }, 1],
    ['first-loss-none', 4, ['slingshot', 'laser', 'glue', 'spray', 'fan'], (b) => { b.stats.stolen = 12; b.stats.lostOnWay = 9; }, 0],
  ];
  for (const [nm, li, deck, f, prior] of cases) {
    const h = await launch({ viewport: { width: 393, height: 852, deviceScaleFactor: 2 }, query: '' }); const { page, ev } = h; const { step, shot } = mk(page, ev);
    await richSave(page, 40); await sleep(200);
    await setupBattle(page, li, ['slingshot', 'glue', 'spray', 'fan'], 3, deck); await sleep(100); await freeze(ev);
    const hint = await ev((f, prior, li) => { const g = window.__game, b = g.S.battle; g.S.save.lossRun = prior ? { li, n: 1 } : null; b.foodStored = 0; b.result = 'lose'; eval('(' + f + ')')(b); g.finishBattle(); return g.S.result.hint; }, f.toString(), prior, li);
    await step(2.2); await shot(`v081-U7-hint-${nm}`, { x: 0, y: 0, width: 393, height: 852 }); results[nm] = hint; console.log(nm, JSON.stringify(hint)); await h.close();
  }
}
if (PARTS.includes('u9')) for (const rm of [false, true]) {
  const h = await launch({ viewport: { width: 393, height: 852, deviceScaleFactor: 2 }, query: '?nexthint=1' }); const { page, ev } = h; const { step, shot } = mk(page, ev);
  await richSave(page, 1); await sleep(200);
  await ev((rm) => { const g = window.__game; g.S.save.settings.reduceMotion = rm ? 'on' : 'off'; g.S.save.onboard = { zapperGift: 'done', grantedOnLoad: false, firstBattle: 'done', cardsHint: 'done' }; g.M.armNextHint(g.S.save, 'l1'); g.go('map'); g.S.mapScroll = 0; }, rm); await freeze(ev); await step(0.5);
  await shot(`v081-U9-nudge-${rm ? 'reduced' : 'motion'}`, { x: 0, y: 0, width: 393, height: 852 });
  const st = await ev(() => { const g = window.__game, h = g.M.nextHintState(g.S.save); return { shown: h.shown, armed: h.armed, done: h.done.slice(), active: !!g.S.nextHint, next: g.M.nextUnplayedLevel(g.S.save) }; });
  await ev(() => { window.__game.go('map'); }); await step(0.5);
  const st2 = await ev(() => { const g = window.__game, h = g.M.nextHintState(g.S.save); return { shown: h.shown, active: !!g.S.nextHint }; });
  results['u9-' + (rm ? 'reduced' : 'motion')] = { st, st2 }; console.log('u9', rm, JSON.stringify(st), JSON.stringify(st2)); await h.close();
}
if (PARTS.includes('u8')) {
  const VPS = [[360, 640], [393, 852], [412, 915]]; const audit = {};
  for (const [w, hh] of VPS) {
    const h = await launch({ viewport: { width: w, height: hh, deviceScaleFactor: 2 }, query: '', init: () => { window.__tx = []; const o = CanvasRenderingContext2D.prototype.fillText; CanvasRenderingContext2D.prototype.fillText = function (t, x, y, mw) { try { const m = /(\d+(?:\.\d+)?)px/.exec(this.font); const a = this.getTransform().a; window.__tx.push({ t: String(t).slice(0, 24), px: m ? +m[1] : 0, css: m ? +m[1] * a / (window.devicePixelRatio || 1) : 0, a: this.globalAlpha }); } catch (e) {} return o.call(this, t, x, y, mw); }; } }); const { page, ev } = h; const { step, shot } = mk(page, ev);
    await richSave(page, 40); await sleep(200); await freeze(ev); await ev(() => window.__game.setInset(24)); // a typical 24 dp gesture-bar inset
    const key = `${w}x${hh}`; audit[key] = {};
    const scan = async (name) => { await step(0.6); await shot(`u8-${name}-${key}`, { x: 0, y: 0, width: w, height: hh });
      const r = await ev(() => { const g = window.__game, L = g.layout(), bs = g.buttons(); const small = bs.filter((b) => !(b.w > 300 && b.h > 300) && (b.cssW < 43.9 || b.cssH < 43.9) && b.id !== 'verLong').map((b) => ({ id: b.id, w: +b.cssW.toFixed(1), h: +b.cssH.toFixed(1) }));
        const gest = bs.filter((b) => !(b.w > 300 && b.h > 300) && b.sy + b.cssH / 2 > innerHeight - 24 + 0.5 && !/^tab/.test(b.id)).map((b) => b.id);
        const allTx = window.__tx.filter((q) => q.px && q.a > 0.3 && q.t.trim()); const minPx = allTx.length ? Math.min(...allTx.map((q) => q.px)) : null, minAllCss = allTx.length ? +Math.min(...allTx.map((q) => q.css)).toFixed(1) : null, nTx = allTx.length; const tx = window.__tx.filter((q) => q.px && q.px < 12 && q.a > 0.3 && q.t.trim()); window.__tx = []; return { small, gest, textLt12: [...new Set(tx.map((q) => `${q.t}@${q.px}`))].slice(0, 12), minCss: tx.length ? Math.min(...tx.map((q) => q.css)) : null, scale: L.scale, nTx, minPx, minAllCss }; });
      audit[key][name] = r; };
    await ev(() => { const g = window.__game; g.go('map'); g.S.mapScroll = 0; }); await scan('map');
    await ev(() => window.__game.openPrep(5)); await scan('prep');
    await setupBattle(page, 16, ['slingshot', 'laser', 'spray', 'lizard', 'fan', 'zapper', 'ball'], 30); await scan('battle');
    await ev(() => { const g = window.__game, b = g.S.battle; b.foodStored = 60; b.result = 'win'; g.finishBattle(); }); await step(1.5); await scan('result-win');
    await ev(() => { const g = window.__game; g.S.result = null; g.S.battle = null; g.go('map'); g.startBattle(4, ['slingshot', 'laser', 'glue', 'spray', 'fan'], ['bomb', 'freeze'], 1); g.S.save.lossRun = { li: 4, n: 1 }; const b = g.S.battle; b.stats.stolen = 12; b.stats.lostOnWay = 9; b.foodStored = 0; b.result = 'lose'; g.finishBattle(); }); await step(2); await scan('result-lose');
    await h.close();
  }
  results.audit = audit; fs.writeFileSync(`${OUT}/u8-audit.json`, JSON.stringify(audit, null, 1));
  for (const k of Object.keys(audit)) for (const n of Object.keys(audit[k])) { const r = audit[k][n]; console.log(k, n, 'small', r.small.length, JSON.stringify(r.small.slice(0, 4)), 'gest', JSON.stringify(r.gest), 'txt<12', r.textLt12.length, JSON.stringify(r.textLt12.slice(0, 3)), 'minCss', r.minCss && +r.minCss.toFixed(1)); }
}
fs.writeFileSync(`${OUT}/p6-results.json`, JSON.stringify(results, null, 1));
