// v0.3.0: Reward Calendar, diamonds, card acquisition, booster economy, centre aim, readable info, renames.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as C from '../src/config.js';
import { Battle, aimVector } from '../src/sim.js';
import * as M from '../src/meta.js';
import * as Cal from '../src/calendar.js';

const H = 3600000, DAY = 24 * H;
const DECK = ['slingshot', 'spray', 'glue', 'fan', 'ball'];
const mk = (o = {}) => { const b = new Battle({ levelIndex: 0, deck: DECK, seed: 1, bonusTypes: ['bomb', 'freeze'], bonusStock: { bomb: 0, freeze: 0 }, ...o }); b.nextWaveAt = 1e9; return b; };
const at = (y, m, d, h = 10, min = 0) => new Date(y, m - 1, d, h, min).getTime(); // local time (box TZ)
const src = (f) => readFileSync(new URL(`../src/${f}`, import.meta.url), 'utf8');

// ---------- item 5: coins start at 0 (also after reset) ----------
test('coins and diamonds start at 0, also after a reset (newSave)', () => {
  const s = M.newSave(); assert.equal(s.coins, 0); assert.equal(s.diamonds, 0);
  s.coins = 500; s.diamonds = 40;
  const r = M.newSave(); assert.equal(r.coins, 0); assert.equal(r.diamonds, 0);
  assert.equal(C.ECONOMY.startCoins, 0);
});
test('old saves migrate: diamonds 0 and a fresh calendar are added', () => {
  const store = new Map(); const st = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) };
  const s = M.newSave(); delete s.diamonds; delete s.calendar; s.coins = 77;
  store.set(M.SAVE_KEY, JSON.stringify(s));
  const l = M.loadSave(st); assert.equal(l.coins, 77); assert.equal(l.diamonds, 0); assert.ok(l.calendar && Array.isArray(l.calendar.weekClaimed));
});

// ---------- item 14: booster stock 0, single Bomb for the first clear of level 1, never more than one booster ----------
test('booster stock starts at 0 for every booster', () => {
  const s = M.newSave(); for (const k of C.BONUS_TYPES) assert.equal(s.bonusStock[k], 0, k);
  assert.equal(C.ECONOMY.startBonusStock, 0);
});
test('first clear of level 1 gives exactly ONE Bomb; replay gives none; other levels none', () => {
  const s = M.newSave();
  const out = M.applyBattleResult(s, 0, 'win', 3, { kills: 10, foodLeft: 80 }, () => 0.5);
  assert.deepEqual(out.booster, { kind: 'bonus', id: 'bomb', count: 1 });
  assert.equal(s.bonusStock.bomb, 1); for (const k of C.BONUS_TYPES) if (k !== 'bomb') assert.equal(s.bonusStock[k], 0);
  const again = M.applyBattleResult(s, 0, 'win', 3, { kills: 10, foodLeft: 80 }, () => 0.5);
  assert.equal(again.booster, null); assert.equal(s.bonusStock.bomb, 1);
  const l2 = M.applyBattleResult(s, 1, 'win', 3, { kills: 10, foodLeft: 80 }, () => 0.5);
  assert.equal(l2.booster, null);
  // a loss never gives it
  const s2 = M.newSave(); M.applyBattleResult(s2, 0, 'lose', 0, { kills: 3 }); assert.equal(s2.bonusStock.bomb, 0);
});
test('never more than ONE booster per award: perfect prizes, grantBooster clamp, perfect + first clear', () => {
  for (const p of C.ECONOMY.perfectPrizes) if (p.kind === 'bonus') assert.equal(p.count, 1);
  assert.equal(C.ECONOMY.maxBoostersPerAward, 1);
  const s = M.newSave(); assert.equal(M.grantBooster(s, 'freeze', 5).count, 1); assert.equal(s.bonusStock.freeze, 1);
  // perfect first clear of level 1: the Bomb is the one booster, the prize must then not be a booster
  for (let i = 0; i < 40; i++) {
    const t = M.newSave(); let k = i; const rng = () => ((k = (k * 9301 + 49297) % 233280) / 233280);
    const out = M.applyBattleResult(t, 0, 'win', 3, { kills: 10, foodLeft: 100, perfect: true }, rng);
    assert.ok(out.booster && out.prize.kind === 'cards', 'prize is cards when a booster was already given');
    const total = C.BONUS_TYPES.reduce((n, b) => n + t.bonusStock[b], 0); assert.equal(total, 1);
  }
  // calendar prizes: at most one booster
  for (const e of C.CALENDAR.week) if (e.kind === 'booster') assert.ok(!e.count || e.count === 1);
});
test('a 0-stock booster no longer blocks Defend (warning only)', () => {
  const s = M.newSave();
  const issues = M.prepIssues(s, ['bomb', 'freeze']); assert.equal(issues.length, 2); assert.ok(issues.every((i) => i.blocking === false));
  assert.ok(!/issues\.length > 0/.test(src('game.js')), 'Defend button is not disabled by issues');
});

// ---------- items 8/12: diamonds in battle ----------
test('crumb pack: 50 crumbs for 10, 20, 40, 80 diamonds (doubles each purchase)', () => {
  const save = M.newSave(); save.diamonds = 1000; const b = mk();
  const prices = []; const c0 = b.crumbs;
  for (let i = 0; i < 4; i++) { const r = M.buyCrumbsWithDiamonds(save, b); assert.ok(r.ok); prices.push(r.price); }
  assert.deepEqual(prices, [10, 20, 40, 80]); assert.equal(b.crumbs - c0, 200); assert.equal(save.diamonds, 1000 - 150);
  assert.equal(M.nextCrumbPrice(b), 160);
});
test('booster at 0 stock: buy for 20 - fixed price, no escalation (v0.4 item 9)', () => {
  const save = M.newSave(); save.diamonds = 1000;
  const b = mk({ bonusStock: { ...save.bonusStock }, onBonusUsed: (t) => M.consumeBonus(save, t) });
  assert.equal(b.canUseBonus('bomb'), false, '0 stock');
  const p1 = M.buyBoosterWithDiamonds(save, b, 'bomb'); assert.ok(p1.ok); assert.equal(p1.price, 20);
  assert.equal(b.bonusStock.bomb, 1); assert.equal(save.bonusStock.bomb, 1); assert.ok(b.canUseBonus('bomb'));
  assert.ok(b.useBonus('bomb', 100, 100)); assert.equal(save.bonusStock.bomb, 0);
  assert.equal(M.nextBoosterPrice(b, 'freeze'), 20, 'fixed price for every booster');
  const p2 = M.buyBoosterWithDiamonds(save, b, 'freeze'); assert.equal(p2.price, 20);
  assert.equal(M.nextBoosterPrice(b, 'bomb'), 20);
  assert.equal(save.diamonds, 1000 - 40);
  assert.equal(M.buyBoosterWithDiamonds(save, b, 'plane').why, 'notBrought');
});
test('diamond crumb escalation resets every battle; booster price stays 20', () => {
  const save = M.newSave(); save.diamonds = 1000;
  const b1 = mk(); M.buyCrumbsWithDiamonds(save, b1); M.buyCrumbsWithDiamonds(save, b1); M.buyBoosterWithDiamonds(save, b1, 'bomb');
  assert.equal(M.nextCrumbPrice(b1), 40); assert.equal(M.nextBoosterPrice(b1, 'bomb'), 20);
  const b2 = mk(); assert.equal(M.nextCrumbPrice(b2), 10); assert.equal(M.nextBoosterPrice(b2, 'bomb'), 20);
});
test('cannot buy without enough diamonds, after the battle ended, or past the 2-use limit', () => {
  const save = M.newSave(); save.diamonds = 9; const b = mk();
  assert.equal(M.buyCrumbsWithDiamonds(save, b).why, 'diamonds'); assert.equal(save.diamonds, 9); assert.equal(b.crumbs, 0);
  save.diamonds = 100; b.result = 'win'; assert.equal(M.buyCrumbsWithDiamonds(save, b).why, 'over');
  const b2 = mk({ bonusStock: { bomb: 5, freeze: 5 } }); b2.useBonus('freeze'); b2.useBonus('freeze');
  assert.equal(M.buyBoosterWithDiamonds(save, b2, 'bomb').why, 'uses');
});
test('diamonds persist in the save; crumbs do not', () => {
  const store = new Map(); const st = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) };
  const s = M.newSave(); s.diamonds = 12; M.writeSave(st, s); assert.equal(M.loadSave(st).diamonds, 12);
});

// ---------- item 10: card acquisition (no unlock by level) ----------
test('cards are obtained by buying (Shop) or as prizes - never by clearing levels; starters kept', () => {
  const s = M.newSave(); assert.deepEqual(M.unlockedCards(s).sort(), [...C.STARTER_CARDS].sort());
  for (let i = 0; i < C.LEVELS.length; i++) M.applyBattleResult(s, i, 'win', 3, { kills: 1, foodLeft: 50 });
  assert.equal(M.unlockedCards(s).length, C.STARTER_CARDS.length, 'clearing every level unlocks nothing');
  const locked = M.lockedCards(s); assert.equal(locked.length, C.ALL_CARDS.length - C.STARTER_CARDS.length);
  const id = locked[0]; const coins = s.coins;
  assert.ok(M.buyCardUnlock(s, id)); assert.ok(s.cards[id].unlocked); assert.equal(s.coins, coins - M.unlockPrice(id)); // v0.6.2 item 12: tiered price
  assert.equal(M.buyCardUnlock(s, id), false, 'already owned');
  const poor = M.newSave(); assert.equal(M.buyCardUnlock(poor, M.lockedCards(poor)[0]), false, 'needs coins'); assert.equal(poor.coins, 0);
  // prize: a card you do not own yet, at the prize level
  const p = M.grantCardPrize(s, 2, () => 0); assert.ok(p.newCard); assert.ok(s.cards[p.id].unlocked); assert.ok(s.cards[p.id].level >= 2);
  // owning everything: copies instead
  for (const c of M.lockedCards(s)) M.grantCardPrize(s, 1, () => 0);
  assert.equal(M.lockedCards(s).length, 0);
  // v0.5: owning everything -> the prize card goes straight into the inventory at its level (no copies, no reveal unless a new level)
  const before = M.countAt(s.cards[C.ALL_CARDS[0]], 2);
  const q = M.grantCardPrize(s, 2, () => 0); assert.equal(q.newCard, false); assert.equal(M.countAt(s.cards[q.id], 2), before + 1);
  // perfect prize "cards" prefers an unowned card
  const t = M.newSave(); const pz = M.grantPerfectPrize(t, () => 0); assert.equal(pz.kind, 'cards'); assert.ok(pz.newCard);
});
test('the prep / cards screens no longer say "Clear Lv N" to unlock', () => {
  const g = src('game.js'); assert.ok(!/Clear Lv/.test(g)); assert.ok(!/UNLOCK_ORDER/.test(g));
});

// ---------- item 6: Reward Calendar (rules revised in vc7) ----------
// helpers: one visit (open the game) / one visit + claim on a local date
const visitOn = (s, t) => { Cal.touch(s, t); return Cal.status(s, t); };
const claimOn = (s, t) => { Cal.touch(s, t); return Cal.claim(s, t, () => 0); };
test('calendar defaults: missedDay reset rule; no weekday-bound week', () => {
  assert.equal(C.CALENDAR.monthlyReset.rule, 'missedDay');
  assert.ok(!('weekStartsOn' in C.CALENDAR));
});
test('calendar: first visit -> 1/30 and tile 1/7 on any weekday; claim once per calendar day', () => {
  for (let wd = 0; wd < 7; wd++) {
    const s = M.newSave(); const t0 = at(2026, 10, 18 + wd, 9); // Sun 18 .. Sat 24 Oct 2026
    const st = visitOn(s, t0); assert.ok(st.claimable); assert.equal(st.streakAfter, 1); assert.equal(st.tile, 0, `start weekday ${wd}`);
    const r = Cal.claim(s, t0, () => 0); assert.ok(r.ok); assert.equal(r.streak, 1); assert.equal(r.tile, 0);
    assert.equal(Cal.claim(s, t0 + 3 * H).ok, false, 'same day twice');
    assert.equal(Cal.canClaim(s, at(2026, 10, 19 + wd, 0, 5)), true, 'next calendar day');
  }
});
test("calendar: Yair's example gives 1/30 monthly and 4/7 weekly for all 7 start weekdays", () => {
  for (let wd = 0; wd < 7; wd++) for (const away of [5, 6, 12]) {
    const s = M.newSave(); const d1 = at(2026, 10, 18 + wd, 10); // day 1 = Sun..Sat
    assert.equal(claimOn(s, d1).tile, 0);                       // day 1: claim tile 1
    assert.equal(claimOn(s, d1 + DAY).tile, 1);                 // day 2: claim tile 2
    const s3 = visitOn(s, d1 + 2 * DAY + 2 * H);                // day 3: open the game, do NOT claim prize 3
    assert.equal(s3.tile, 2); assert.equal(s3.tiles[2].state, 'today');
    const back = d1 + (2 + away) * DAY;                          // return `away` days later (5 = audit repro, 6 = after 5 full days away)
    const st = visitOn(s, back);
    assert.equal(st.streakAfter, 1, `monthly 1/30 (start wd ${wd}, away ${away})`);
    assert.ok(st.resetPending);
    assert.equal(st.tile + 1, 4, `weekly 4/7 (start wd ${wd}, away ${away})`);
    assert.deepEqual(st.tiles.map((x) => x.state), ['claimed', 'claimed', 'missed', 'today', 'future', 'future', 'future']);
    const r = Cal.claim(s, back, () => 0); assert.equal(r.tile, 3); assert.equal(r.streak, 1);
  }
});
test('calendar: a missed / past tile can never be claimed', () => {
  const s = M.newSave(); const d1 = at(2026, 10, 20, 10);
  claimOn(s, d1); visitOn(s, d1 + DAY); // tile 2 shown, not claimed
  const st = visitOn(s, d1 + 2 * DAY); assert.equal(st.tiles[1].state, 'missed');
  const r = Cal.claim(s, d1 + 2 * DAY, () => 0); assert.equal(r.tile, 2, 'a claim always takes today\'s tile');
  assert.equal(Cal.status(s, d1 + 2 * DAY).tiles[1].state, 'missed');
  assert.equal(Cal.claim(s, d1 + DAY, () => 0).ok, false, 'clock moved back to the missed day: nothing');
});
test('calendar: the cycle advances one tile per visit day (claimed or not) and wraps after 7', () => {
  const s = M.newSave(); const d1 = at(2026, 10, 22, 12); // a Thursday
  for (let d = 0; d < 7; d++) assert.equal(visitOn(s, d1 + d * DAY).tile, d);
  assert.equal(visitOn(s, d1 + 7 * DAY + 3 * H).tile, 0, 'day 8 = a new cycle, tile 1');
  assert.ok(Cal.status(s, d1 + 7 * DAY + 3 * H).tiles.slice(1).every((x) => x.state === 'future'), 'new cycle = fresh row');
  // several opens on the same day count once
  const s2 = M.newSave(); const t = at(2026, 10, 20, 8);
  for (const h of [0, 3, 9, 15]) visitOn(s2, t + h * H);
  assert.equal(visitOn(s2, t + DAY).tile, 1);
  // midnight while playing: the heartbeat moves to the next tile
  const s3 = M.newSave(); const e = at(2026, 10, 20, 23, 58); claimOn(s3, e); Cal.touch(s3, e + 4 * 60000);
  assert.equal(Cal.status(s3, e + 4 * 60000).tile, 1); assert.ok(Cal.canClaim(s3, e + 4 * 60000));
});
test('calendar: a daily player at varying hours never resets (30 days, wraps 30 -> 1)', () => {
  const hours = [9, 23, 0, 7, 22, 1, 12, 23, 6, 18];
  for (const startWd of [0, 3, 6]) {
    const s = M.newSave(); const day0 = at(2026, 11, 1 + startWd, 0);
    for (let d = 0; d < 31; d++) {
      const t = day0 + d * DAY + hours[d % hours.length] * H + (d % 3) * 17 * 60000; // 00:00 .. 23:51
      const r = claimOn(s, t); assert.ok(r.ok);
      assert.equal(r.streak, (d % 30) + 1, `day ${d + 1} at ${new Date(t).getHours()}h`);
      assert.equal(r.tile, d % 7);
    }
  }
  // the audit case: claim Mon 09:00, back Tue 10:00 (25 h) -> continues
  const s = M.newSave(); const mon = at(2026, 10, 19, 9); claimOn(s, mon);
  assert.equal(claimOn(s, at(2026, 10, 20, 10)).streak, 2);
  // Mon 00:05 -> Tue 23:55 (47 h 50 min) -> continues
  const s2 = M.newSave(); claimOn(s2, at(2026, 10, 19, 0, 5)); assert.equal(claimOn(s2, at(2026, 10, 20, 23, 55)).streak, 2);
});
test('calendar: skipping a whole calendar day resets the monthly bar to 1 (even if < 24 h)', () => {
  const s = M.newSave(); claimOn(s, at(2026, 10, 19, 10)); claimOn(s, at(2026, 10, 20, 23, 50));
  // Wed 21 skipped entirely; Thu 22 00:10 is only ~24 h 20 min later
  const st = visitOn(s, at(2026, 10, 22, 0, 10)); assert.ok(st.resetPending); assert.equal(st.streakAfter, 1);
  assert.equal(Cal.claim(s, at(2026, 10, 22, 0, 10), () => 0).streak, 1);
  // opening the game on a day without collecting also breaks the streak (the bar counts collected days)
  const s2 = M.newSave(); claimOn(s2, at(2026, 10, 19, 10)); visitOn(s2, at(2026, 10, 20, 10));
  assert.equal(claimOn(s2, at(2026, 10, 21, 10)).streak, 1);
});
test('calendar: coins rise 5, 10, 15, 20 in order on coin days, for every start weekday; restart with the streak', () => {
  for (let wd = 0; wd < 7; wd++) {
    const s = M.newSave(); const d1 = at(2026, 10, 18 + wd, 11); const coins = [];
    for (let d = 0; d < 21; d++) { const r = claimOn(s, d1 + d * DAY); if (r.prize.kind === 'coins') coins.push(r.prize.count); }
    assert.deepEqual(coins, [5, 10, 15, 20, 20, 20, 20, 20, 20], `start wd ${wd}`);
    // preview on the calendar matches what a claim gives
    const t = d1 + 21 * DAY; const st = visitOn(s, t); const r = Cal.claim(s, t, () => 0); assert.deepEqual(st.tiles[st.tile].prize.count, r.prize.count);
  }
  // claimed tiles show what was really received
  { const s = M.newSave(); const d1 = at(2026, 10, 20, 9); for (let d = 0; d < 4; d++) claimOn(s, d1 + d * DAY);
    assert.deepEqual(visitOn(s, d1 + 4 * DAY).tiles.filter((x) => x.prize.kind === 'coins').map((x) => x.prize.count), [5, 10, 15]); }
  // after a reset the coin steps start again at 5
  const s = M.newSave(); const d1 = at(2026, 10, 20, 9);
  for (let d = 0; d < 4; d++) claimOn(s, d1 + d * DAY);                    // tiles 1-4: coins 5, 10, -, 15
  const back = d1 + 9 * DAY; const st = visitOn(s, back); assert.equal(st.tile, 4); // tile 5 (card); streak restarts
  claimOn(s, back); claimOn(s, back + DAY); claimOn(s, back + 2 * DAY);       // tiles 5, 6, 7
  assert.deepEqual(claimOn(s, back + 3 * DAY).prize, { kind: 'coins', count: 5 }, 'new cycle tile 1 = first coin day of the new streak');
  // preview: the calendar shows the coming coin tiles in order
  const s2 = M.newSave(); const st2 = visitOn(s2, d1); assert.deepEqual(st2.tiles.filter((x) => x.prize.kind === 'coins').map((x) => x.prize.count), [5, 10, 15]);
});
test('calendar prizes: coins 5/10/15/20 (cap), diamonds 2-5, day 7 = level-2 card + 5 diamonds (v0.4), one booster max', () => {
  const K = C.CALENDAR; const kinds = K.week.map((e) => e.kind);
  assert.ok(kinds.every((k) => ['coins', 'diamonds', 'card', 'booster'].includes(k)));
  assert.deepEqual(K.week[6], { kind: 'card', level: 2, extra: { kind: 'diamonds', count: 5 } });
  assert.deepEqual([1, 2, 3, 4, 5, 30].map((n) => Cal.prizeFor(0, n).count), [5, 10, 15, 20, 20, 20]);
  const dia = []; for (let n = 1; n <= 30; n++) dia.push(Cal.prizeFor(2, n).count);
  assert.equal(Math.min(...dia), 2); assert.equal(Math.max(...dia), 5);
  for (const m of Object.values(K.monthMilestones)) if (m.kind === 'diamonds') assert.ok(m.count >= 2 && m.count <= 5);
  // a full daily cycle: tile 3 = diamonds, tile 7 = an L2 card (a new tower)
  const s = M.newSave(); const d1 = at(2026, 10, 24, 10); let r;
  for (let d = 0; d < 7; d++) { r = claimOn(s, d1 + d * DAY); if (d === 2) { assert.equal(r.prize.kind, 'diamonds'); assert.equal(s.diamonds, r.prize.count); } }
  assert.equal(r.prize.kind, 'card'); assert.ok(r.prize.newCard); assert.equal(s.cards[r.prize.id].level, 2);
  assert.deepEqual(r.extra, { kind: 'diamonds', count: 5 });
});
test('calendar: clock moved backwards cannot claim twice or move the cycle back', () => {
  const s = M.newSave(); const t = at(2026, 10, 21, 10); claimOn(s, t);
  assert.equal(Cal.claim(s, t - DAY).ok, false);
  assert.equal(Cal.status(s, t - DAY).tile, 0);
});
test('calendar: old vc6 saves migrate (weekday fields ignored, a fresh cycle starts on the next visit)', () => {
  const s = M.newSave(); s.calendar = { lastClaimDay: Cal.dayNumber(at(2026, 10, 20, 9)), lastClaimTs: 0, lastSeenTs: 0, broken: false, streak: 3, weekStart: 1, weekClaimed: [true, true, true, false, false, false, false], log: [] };
  const st = visitOn(s, at(2026, 10, 21, 9)); assert.equal(st.tile, 0); assert.equal(st.streakAfter, 4, 'claimed yesterday -> streak continues');
  assert.ok(st.tiles.every((x, i) => x.state === (i === 0 ? 'today' : 'future')));
});

// ---------- item 1: centre aim ----------
test('v0.5 items 2/10 (replaces v0.3 centre aim): directional towers point along the trail next to them, straight (axis-aligned)', () => {
  const b = mk(); const f = b.addTower('fan', 2, 3); // directly below row 2 -> into the trail cell above it
  assert.deepEqual([f.trailDir.dx, f.trailDir.dy], [0, -1]); assert.deepEqual([f.ax, f.ay], [0, -1]);
});

// ---------- items 11, 13: readable info, "booster" wording ----------
test('tower info text is regular weight, larger, dark on light (no Turn)', () => {
  const g = src('game.js');
  const fn = g.slice(g.indexOf('function renderTowerInfo'), g.indexOf('\n}\n', g.indexOf('function renderTowerInfo')));
  assert.ok(/plainWrap\(desc, 346, 12\.5\)/.test(fn)); assert.ok(!/infoTurn/.test(fn));
  assert.ok(/const INFO_INK = '#3d2a36'/.test(g));
});
test('no "bonus" in player-facing text: boosters are Bomb, Crop Duster, Freezer, Sugar Cube', () => {
  assert.deepEqual(C.BONUS_TYPES.map((k) => C.BONUSES[k].name), ['Bomb', 'Crop Duster', 'Freezer', 'Sugar Cube']);
  const g = src('game.js');
  const strings = [...g.matchAll(/(['`])((?:(?!\1)[^\\\n]|\\.)*)\1/g)].map((m) => m[2].replace(/\$\{[^}]*\}/g, ''));
  const ui = strings.filter((s) => /\bbonus(es)?\b/i.test(s) && /\s/.test(s));
  assert.deepEqual(ui, [], 'UI strings mentioning bonus');
  for (const b of Object.values(C.BONUSES)) assert.ok(!/bonus/i.test(b.desc));
});
test('cookie faces: 9 moods by food left, never scary; ouch on a bite', () => {
  const faces = C.UI.cookieFaces.map((f) => f.face);
  assert.deepEqual(faces, ['happy', 'content', 'worried', 'nervous', 'sad', 'crying', 'screaming', 'pleading', 'fainted']);
  const a = src('art.js'); for (const f of [...faces, 'ouch']) assert.ok(a.includes(`case '${f}'`), f);
  assert.ok(!/blood|skull|fangs/i.test(a));
});
test('no network / ads / analytics in the sources', () => {
  for (const f of ['game.js', 'sim.js', 'meta.js', 'calendar.js', 'art.js', 'bot.js', 'config.js']) {
    const t = src(f); assert.ok(!/fetch\(|XMLHttpRequest|WebSocket|sendBeacon|https?:\/\//.test(t), f);
  }
});
