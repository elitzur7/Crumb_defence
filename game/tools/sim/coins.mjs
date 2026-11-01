// v0.8.2 QA7: <dir> is a repo/game directory: <dir>/src (run from game/ with '.') or <dir>/game/src (a repo copy). Bot proxy, provisional.
import { existsSync as __ex } from 'node:fs'; import { resolve as __rs } from 'node:path'; import { pathToFileURL as __pu } from 'node:url';
const __d = process.argv[2]; const SRC = __pu(__rs(__ex(__rs(__d, 'src/config.js')) ? __rs(__d, 'src') : __rs(__d, 'game/src')) + '/').href;
// replay coins per win (typical profile, weak mode): node coins.mjs <dir> <profile> <L1> <L2> <seeds> <TR>
const [dir, pf, lo, hi, SPT, TR] = process.argv.slice(2); const D = SRC; const fs = await import('node:fs');
const C = await import(D + 'config.js'), S = await import(D + 'sim.js'), BOT = await import(D + 'bot.js'), M = await import(D + 'meta.js');
const P = JSON.parse(fs.readFileSync(pf, 'utf8'));
for (let L = +lo; L <= +hi; L++) { const i = L - 1; const w = C.WORLDS[Math.floor(i / 10)]; let n = 0, wins = 0, tot = 0, kills = 0, food = 0, t = 0;
  for (let k = 0; k < Math.min(+TR, (P[L] || []).length); k++) { const p = P[L][k]; const deck = BOT.chooseDeck(p.owned, i);
    for (let s = 0; s < +SPT; s++) { const b = new S.Battle({ levelIndex: i, deck, seed: 1000 + k * 101 + s * 7919, cardLevels: p.cl, bonusTypes: ['bomb', 'plane'], bonusStock: { ...p.bonus } });
      let th = 0; while (!b.result && b.time < 1800) { b.update(1 / 60); th -= 1 / 60; if (th <= 0) { th = .5; BOT.smartBotStep(b); } } n++;
      if (b.result === 'win') { wins++; const c = M.battleCoins('win', { kills: b.stats.kills, foodLeft: b.foodStored, levelIndex: i, firstClear: false, time: b.time, coinMul: w.coinMul ?? 1 }); tot += c.total; kills += b.stats.kills; food += b.foodStored; t += b.time; } } }
  console.log(`L${L} W${w.id} coinMul ${w.coinMul} n ${n} win ${(100 * wins / n).toFixed(1)}% replayCoins/win ${(tot / wins).toFixed(0)} kills ${(kills / wins).toFixed(0)} foodLeft ${(food / wins).toFixed(0)} time ${(t / wins).toFixed(0)}s`); }
