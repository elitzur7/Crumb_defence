// Reward Calendar (v0.3 items 6 + 9; rules revised in v0.3.0 vc7). Pure functions: every call takes `now` (ms) so tests can drive the clock.
// "Day" = the LOCAL calendar date (dayNumber). A "visit day" = a local calendar day on which the player was in the game
// (start-up, resume, heartbeat while open, opening the calendar, claiming).
//
// Monthly bar (streak 1..monthLength), rule 'missedDay' (default):
//   streak(today) = 1                          if never claimed, or today - lastClaimDay > 1 (a whole calendar day without a claim)
//                 = streak % monthLength + 1   otherwise (claimed yesterday) - the hour of day never matters.
//   (legacy alternative 'hours24': reset after > 24 h since last seen in the game.)
// Weekly row (7 tiles, the player's own cycle):
//   The cycle starts on the player's first visit day (tile 1). Every NEW visit day moves the cursor one tile forward,
//   whether or not the prize was claimed; after tile 7 the next visit day starts a new cycle at tile 1.
//   tile(today) = (number of visit days since the cycle start, counting today) - 1, mod 7  (+1 for display).
//   Only today's tile can be claimed, only today. Earlier unclaimed tiles of the cycle are "missed" for good.
//   Days without any visit do not move the cursor, so Yair's example always gives 4/7: claim day 1, day 2,
//   open day 3 without claiming (tile 3 -> missed), stay away any number of days -> the next visit is tile 4/7 (and 1/30).
// Coins: the k-th coin prize of the current streak gives coinsByStreak[min(k,4)-1] = 5, 10, 15, 20, 20 ... (in order);
//   the count restarts with the streak.
import * as C from './config.js';
import * as M from './meta.js';

const DAY = 86400000;
// local calendar day index (DST-safe: built from the local Y/M/D)
export function dayNumber(ts) { const d = new Date(ts); return Math.round(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / DAY); }
const cal = (save) => (save.calendar = save.calendar || M.newCalendarState());
const fresh7 = () => [false, false, false, false, false, false, false];

// register today as a visit day (idempotent within a day; a clock moved backwards changes nothing)
function visit(c, today, K) {
  if (c.lastVisitDay != null && today <= c.lastVisitDay) return;
  if (c.pos == null || c.lastVisitDay == null || c.pos >= K.week.length - 1) { c.pos = 0; c.cycleStartDay = today; c.weekClaimed = fresh7(); c.weekGot = []; }
  else c.pos++;
  c.lastVisitDay = today;
}
// today's weekly tile (0..6) - registers the visit
export function tileIndex(save, now, K = C.CALENDAR) { const c = cal(save); visit(c, dayNumber(now), K); return c.pos; }

// "the player is in the game now": start-up, resume, heartbeat, claim.
export function touch(save, now, K = C.CALENDAR) {
  const c = cal(save);
  if (K.monthlyReset.rule === 'hours24' && c.lastSeenTs != null && now - c.lastSeenTs > K.monthlyReset.hours * 3600000) c.broken = true;
  c.lastSeenTs = now;
  visit(c, dayNumber(now), K);
}
function streakResets(c, today, K) {
  if (c.lastClaimDay == null) return true;
  if (K.monthlyReset.rule === 'hours24') return !!c.broken;
  return today - c.lastClaimDay > 1; // 'missedDay' (default): a whole calendar day passed without a claim
}
export function canClaim(save, now) { const c = cal(save); return c.lastClaimDay == null || dayNumber(now) > c.lastClaimDay; }
// streak value today's claim would give (1..monthLength)
export function nextStreak(save, now, K = C.CALENDAR) {
  const c = cal(save); const today = dayNumber(now);
  if (!canClaim(save, now)) return c.streak;
  return streakResets(c, today, K) ? 1 : (c.streak % K.monthLength) + 1;
}
// coin prizes already taken in the streak today's claim continues (0 if it restarts)
function coinBase(c, save, now, K) { return canClaim(save, now) && streakResets(c, dayNumber(now), K) ? 0 : (c.coinStep || 0); }
export const coinAmount = (k, K = C.CALENDAR) => K.coinsByStreak[Math.min(Math.max(1, k), K.coinsByStreak.length) - 1];
// what a tile gives: coins by the k-th coin day of the streak (coinStep, 1-based), diamonds by the streak week
export function prizeFor(tile, streak, K = C.CALENDAR, coinStep = streak) {
  const e = K.week[tile]; const s = Math.max(1, streak);
  if (e.kind === 'coins') return { kind: 'coins', count: e.count ?? coinAmount(coinStep, K) };
  if (e.kind === 'diamonds') return { kind: 'diamonds', count: e.count ?? K.diamondsByStreakWeek[Math.min(Math.floor((s - 1) / 7), K.diamondsByStreakWeek.length - 1)] };
  // v0.4 item 2: the wide day-7 tile is a level-2 card PLUS 5 diamonds (`extra`)
  if (e.kind === 'card') return { kind: 'card', level: e.level || 1, ...(e.extra ? { extra: { ...e.extra } } : {}) };
  if (e.kind === 'booster') return { kind: 'booster', id: e.id, count: 1 }; // item 14: never more than one
  return { ...e };
}
export function status(save, now, K = C.CALENDAR) {
  const c = cal(save); const today = dayNumber(now); visit(c, today, K);
  const tile = c.pos; const claimable = canClaim(save, now);
  const streakAfter = nextStreak(save, now, K);
  const resetPending = claimable && c.lastClaimDay != null && streakResets(c, today, K);
  const base = coinBase(c, save, now, K);
  let coins = base; // preview assumes a claim on every coming visit day
  const tiles = K.week.map((e, i) => {
    let step = base + 1;
    if (i >= tile) { if (e.kind === 'coins') coins++; step = coins; }
    return {
      i, state: c.weekClaimed[i] ? 'claimed' : i === tile ? (claimable ? 'today' : 'claimed') : i < tile ? 'missed' : 'future',
      prize: c.weekClaimed[i] && c.weekGot && c.weekGot[i] && c.weekGot[i].kind === e.kind ? { ...prizeFor(i, streakAfter, K, step), count: c.weekGot[i].count } // what was really received
        : prizeFor(i, i >= tile ? streakAfter + (i - tile) : streakAfter, K, step),
    };
  });
  return { tile, claimable, streak: resetPending ? 0 : c.streak, streakAfter, resetPending, tiles, monthLength: K.monthLength, milestones: K.monthMilestones, cycleStartDay: c.cycleStartDay };
}
function grant(save, p, rng) {
  if (p.kind === 'coins') { save.coins += p.count; return { ...p }; }
  if (p.kind === 'diamonds') { save.diamonds = (save.diamonds || 0) + p.count; return { ...p }; }
  if (p.kind === 'card') return M.grantCardPrize(save, p.level, rng);
  if (p.kind === 'booster') return M.grantBooster(save, p.id, 1);
  return null;
}
// claim today's prize (tap on today's tile)
export function claim(save, now, rng = Math.random, K = C.CALENDAR) {
  const c = cal(save); const today = dayNumber(now);
  visit(c, today, K);
  if (!canClaim(save, now)) return { ok: false, why: 'claimed' };
  const tile = c.pos;
  if (c.weekClaimed[tile]) return { ok: false, why: 'claimed' };
  const streak = nextStreak(save, now, K);
  const base = coinBase(c, save, now, K);
  const isCoins = K.week[tile].kind === 'coins';
  const p0 = prizeFor(tile, streak, K, base + 1);
  const prize = grant(save, p0, rng);
  const extra = p0.extra ? grant(save, p0.extra, rng) : null; // v0.4 item 2 (day 7: + 5 diamonds)
  if (prize && extra) prize.extra = extra;
  const ms = K.monthMilestones && K.monthMilestones[streak];
  const milestone = ms ? grant(save, ms.kind === 'booster' ? { ...ms, count: 1 } : ms, rng) : null;
  c.streak = streak; c.coinStep = base + (isCoins ? 1 : 0);
  c.lastClaimDay = today; c.lastClaimTs = now; c.lastSeenTs = now; c.broken = false; c.weekClaimed[tile] = true;
  c.weekGot = c.weekGot || []; c.weekGot[tile] = prize && prize.count != null ? { kind: prize.kind, count: prize.count } : null;
  c.log = [...(c.log || []), { day: today, tile, streak, prize: prize && prize.kind }].slice(-40);
  return { ok: true, tile, streak, prize, extra, milestone };
}
