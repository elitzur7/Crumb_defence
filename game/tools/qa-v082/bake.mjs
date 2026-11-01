// QA3: first-battle sprite bake time + cache memory. usage: WWW=<www-test> node tools/qa-v082/bake.mjs <label> <out.json>
import { launch, sleep, richSave, setupBattle } from './harness.mjs'; import { writeFileSync } from 'node:fs';
const [label = 'new', out = '/tmp/bake.json'] = process.argv.slice(2); const res = { label };
for (const [li, name] of [[5, 'L6'], [37, 'L38']]) {
  const h = await launch({ viewport: { width: 393, height: 852, deviceScaleFactor: 2 } }); const { ev, page } = h;
  await richSave(page, 40); await sleep(200);
  const ids = await ev(() => Object.keys(window.__game.C.TOWERS).slice(0, 13));
  await setupBattle(page, li, ids.slice(0, 12), 0, ids.slice(0, 5)); // no simulate: caches stay cold until the first renders
  await ev(() => { window.__game.simulate(6, true); });
  const r = await ev(() => { const g = window.__game; g.clearBaked(); const t0 = performance.now(); g.renderOnce(1 / 60); const first = performance.now() - t0; const s = performance.now(); for (let i = 0; i < 30; i++) g.renderOnce(1 / 60); const next30 = performance.now() - s;
    return { firstFrameMs: +first.toFixed(1), next30Ms: +next30.toFixed(1), tower: g.spriteCache(), baked: g.bakedStats ? g.bakedStats() : null }; });
  res[name] = r; await h.close();
}
writeFileSync(out, JSON.stringify(res, null, 1)); console.log(JSON.stringify(res));
