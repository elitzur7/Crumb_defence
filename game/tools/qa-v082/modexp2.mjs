// usage: [LEVELS=a-b] [TR=20] [SPT=5] [MODE=weak|carrier|front|bot] [OVR=json] node modexp.mjs <dir> <profiles.json> <out.json>
// like arr78.mjs but forces every single-target tower (slingshot/laser/zapper/lizard) to MODE after every bot step; also logs heal stats and nurse kill times.
const [dir, pf, outF] = process.argv.slice(2); const E = process.env; const fs = await import('node:fs');
const C = await import(`/workspace/ant-td/game/src/config.js`); const S = await import(`/workspace/ant-td/game/src/sim.js`); const BOT = await import(`/workspace/ant-td/game/src/bot.js`);
if (E.PWR) globalThis.__PWR = +E.PWR; if (E.RATE) globalThis.__RATE = +E.RATE; if (E.CAPSTONE) globalThis.__CAPSTONE = 1; if (E.DECK6) C.BATTLE.deckSize = +E.DECK6;
const CLB = +(E.CLBUMP || 0);
const P = JSON.parse(fs.readFileSync(pf, 'utf8')); const TR = +(E.TR || 20), SPT = +(E.SPT || 5), MODE = E.MODE || 'weak';
if (E.OVR) { const O = JSON.parse(fs.readFileSync(E.OVR, 'utf8')); for (const [l, o] of Object.entries(O)) Object.assign(C.LEVELS[+l - 1], o); }
const [lo, hi] = (E.LEVELS || '31-40').split('-').map(Number); const rows = [];
function run(i, deck, cardLevels, bonusStock, seed) {
  const b = new S.Battle({ levelIndex: i, deck, seed, cardLevels, bonusTypes: ['bomb', 'plane'], bonusStock });
  let th = 0; const dt = 1 / 60; let nk = 0, nkT = 0;
  while (!b.result && b.time < 1800) { b.update(dt); th -= dt; if (th <= 0) { th = 0.5; BOT.smartBotStep(b); if (MODE !== 'bot' && MODE !== 'air' && MODE !== 'noair') for (const tw of b.towers) if (S.hasTargetModes(tw.type)) tw.mode = MODE.startsWith('mix') ? ((tw.id % 2) ? { mixH: 'healer', mixF: 'front', mixC: 'carrier', mixG: 'guard4' }[MODE] : 'weak') : MODE; } }
  return { win: b.result === 'win' ? 1 : 0, stars: b.result === 'win' ? b.stars : 0, time: Math.round(b.time), food: Math.round(b.foodStored), heals: b.stats.heals || 0, healed: Math.round(b.stats.healed || 0) };
}
for (let L = lo; L <= hi; L++) { const i = L - 1; const arr = P[L] || [];
  for (let t = 0; t < Math.min(TR, arr.length); t++) { const p = arr[t]; const AAT = ['laser', 'zapper', 'fan']; const deck = MODE === 'noair' ? BOT.chooseDeck(p.owned.filter((x) => !AAT.includes(x)), i) : MODE === 'air' ? BOT.chooseDeck(p.owned, i, { prefer: AAT }) : BOT.chooseDeck(p.owned, i); // v0.8.3 F12: 'air' = Laser, Zapper and Fan all in the deck; 'noair' = none of them (no tower-mode forcing)
    for (let s = 0; s < SPT; s++) rows.push({ L, t, s, ...run(i, deck, Object.fromEntries(Object.entries(p.cl).map(([k, v]) => [k, v >= 2 ? v + CLB : v])), { ...p.bonus }, 1000 + t * 101 + s * 7919) }); } }
fs.writeFileSync(outF, JSON.stringify(rows));
