// Out-of-battle progression: coins + diamonds (persistent), cards by level, merge, shop, boosters, save/load.
import * as C from './config.js';

export const SAVE_KEY = 'crumbdefense.save.v1';

export function newSave() {
  const cards = {};
  for (const id of C.ALL_CARDS) cards[id] = newCard();
  for (const id of C.STARTER_CARDS) unlockCard({ cards }, id);
  const bonusStock = {};
  for (const b of C.BONUS_TYPES) bonusStock[b] = C.ECONOMY.startBonusStock;
  return { version: SAVE_VERSION, coins: C.ECONOMY.startCoins, diamonds: C.ECONOMY.diamonds.start, cards, bonusStock, levels: C.LEVELS.map(() => ({ stars: 0, cleared: false })),
    lastDeck: C.STARTER_CARDS.slice(), lastBonuses: C.BONUS_TYPES.slice(0, 2), calendar: newCalendarState(), cardBlink: newCardBlinkState(), onboard: newOnboardState(), packsSinceNew: 0 };
}
export const SAVE_VERSION = 6; // v0.7: paid-pack pity counter + one-time free pack for saves past stage 2 (D-P0); v0.7.7: world 3 levels (loadSave pads `levels`; boss gifts are never granted retroactively)
// v0.6 item 5: the one-time Zapper onboarding. zapperGift: 'none' -> 'pending' (first win of stage 2) -> 'done' (free gift taken).
// grantedOnLoad: an existing player past stage 2 without a Zapper got one when this version loaded (the game shows the reveal once).
export function newOnboardState() { return { zapperGift: 'none', grantedOnLoad: false }; }
export const ZAPPER_STAGE = 1; // level index of stage 2
// v0.4 item 17: the Cards button blinks for 5 s exactly twice in the player's life (each trigger fires once, ever).
export function newCardBlinkState() { return { affordShown: false, afterLossShown: false, lossPending: false }; }
export function newCalendarState() { return { lastClaimDay: null, lastClaimTs: null, lastSeenTs: null, broken: false, streak: 0, coinStep: 0, pos: null, cycleStartDay: null, lastVisitDay: null, weekClaimed: [false, false, false, false, false, false, false], weekGot: [], log: [] };
}

// ----- cards BY LEVEL (v0.5 items 6/7; v0.6 item 4: no copies - every card has a level) -----
// Each card type holds an inventory `inv[L]` = how many cards of level L you own (cards are obtained at L1..L4).
// Merging is MANUAL (Cards > a card's own screen, or "Merge all"): 3 cards of a level -> 1 card of the next level, at every
// level (+ C.MERGE.coinCost[next] coins). The battle uses the HIGHEST level you own (`level` = max L with inv[L] > 0).
// `seen` = levels of this type the player has ever had (a prize shows the big NEW CARD reveal only for a new type or a new level).
// `fresh` = a won card waiting to be looked at (small "+1" tag on the Cards screen until its card screen is opened).
export const MERGE_RULE = { sameToNext: C.MERGE.cardsPerMerge }; // 3 x Ln = 1 x L(n+1)
export function newCard() { return { unlocked: false, level: 0, inv: {}, seen: [], fresh: false }; }
export function normCard(c) {
  if (!c.inv || typeof c.inv !== 'object') c.inv = {};
  if (!Array.isArray(c.seen)) c.seen = [];
  return c;
}
export function syncCard(c) {
  normCard(c);
  let top = 0; for (let L = 1; L <= C.MAX_CARD_LEVEL; L++) if ((c.inv[L] || 0) > 0) top = L;
  c.level = top; c.unlocked = top > 0;
  return c;
}
export function countAt(c, L) { return (c.inv && c.inv[L]) || 0; }
export function totalCards(c) { let n = 0; for (let L = 1; L <= C.MAX_CARD_LEVEL; L++) n += (c.inv && c.inv[L]) || 0; return n; }
// add n cards of level L to a type. Returns { newType, newLevel } (both drive the NEW CARD reveal)
export function addCards(save, id, level = 1, n = 1) {
  const c = normCard(save.cards[id]);
  const newType = !c.unlocked; const newLevel = !c.seen.includes(level);
  c.inv[level] = (c.inv[level] || 0) + n;
  if (newLevel) { c.seen.push(level); c.seen.sort((a, b) => a - b); }
  syncCard(c);
  return { newType, newLevel };
}
// Unlocking a type = one card of level 1
export function unlockCard(save, id) {
  const c = normCard(save.cards[id]);
  if (c.unlocked) return false;
  addCards(save, id, 1, 1);
  return true;
}
// one merge row of a card's screen: level L -> L + 1 (L >= 1)
export function mergeRow(c, L) {
  const need = MERGE_RULE.sameToNext;
  const to = L + 1;
  if (to > C.MAX_CARD_LEVEL) return { L, to, need, have: countAt(c, L), coins: 0, maxed: true, ready: false };
  const coins = C.MERGE.coinCost[to] || 0;
  const have = countAt(c, L);
  return { L, to, need, have, coins, maxed: false, ready: have >= need };
}
export function canMergeAt(save, id, L) { const r = mergeRow(normCard(save.cards[id]), L); return !r.maxed && r.ready && save.coins >= r.coins; }
export function mergeAt(save, id, L) {
  if (!(L >= 1) || !canMergeAt(save, id, L)) return null;
  const c = save.cards[id]; const r = mergeRow(c, L);
  c.inv[L] -= r.need; if (c.inv[L] <= 0) delete c.inv[L];
  save.coins -= r.coins;
  const got = addCards(save, id, r.to, 1);
  return { id, from: L, to: r.to, coins: r.coins, ...got };
}
// rows to show on a card's own screen: every level from 1 up to the highest owned
export function mergeRows(save, id) {
  const c = normCard(save.cards[id]); const rows = [];
  for (let L = 1; L <= c.level; L++) rows.push(mergeRow(c, L));
  return rows;
}
// any merge ready on this card (the main Cards screen shows a "!" badge)
export function mergeReady(save, id) {
  const c = normCard(save.cards[id]);
  for (let L = 1; L <= c.level; L++) if (canMergeAt(save, id, L)) return true;
  return false;
}
export function anyMergeReady(save) { return C.ALL_CARDS.some((id) => mergeReady(save, id)); }
// v0.6 item 8: "Merge all" - every merge that is ready and affordable, lowest levels first (so new cards can merge on upward).
// Stops a type/level when the coins run out. Returns the list of merges done (same objects as mergeAt).
export function mergeAll(save) {
  const done = [];
  for (let L = 1; L < C.MAX_CARD_LEVEL; L++) for (const id of C.ALL_CARDS) { let r; while ((r = mergeAt(save, id, L))) done.push(r); }
  return done;
}

// ----- obtaining tower cards (v0.3 item 10: no auto-unlock by level) -----
export function lockedCards(save) { return C.ALL_CARDS.filter((id) => !save.cards[id].unlocked); }
// v0.6.2 item 12: tiered unlock price by base power (tuning.json shop.unlockPrice); available any time in the Shop.
export function unlockPrice(id, E = C.ECONOMY.shop) { return (E.unlockPrice && E.unlockPrice[id]) ?? E.unlockPriceDefault; }
export function buyCardUnlock(save, id) {
  const price = unlockPrice(id);
  if (save.cards[id].unlocked || save.coins < price) return false;
  save.coins -= price; unlockCard(save, id);
  save.cards[id].fresh = true; // v0.6.2 item 12: the "NEW" marker on the Cards screen, as for a won card
  return true;
}
// A card prize of level L (v0.5 item 7): goes STRAIGHT into the inventory as one card of level L. Prefers a type you don't own.
// reveal = true when it is a new type or a level of that type the player never had (-> the big NEW CARD reveal); otherwise the
// game only says "you won a card" and tags it on the Cards screen.
export function grantCardPrize(save, level = 1, rng = Math.random) {
  const locked = lockedCards(save);
  const pool = locked.length ? locked : C.ALL_CARDS;
  const id = pool[Math.floor(rng() * pool.length) % pool.length];
  const got = addCards(save, id, level, 1);
  save.cards[id].fresh = true;
  return { kind: 'card', id, level, newCard: got.newType, newLevel: got.newLevel, reveal: got.newType || got.newLevel };
}
// ONE booster (never more than C.ECONOMY.maxBoostersPerAward at a time)
export function grantBooster(save, id, count = 1) {
  const n = Math.min(count, C.ECONOMY.maxBoostersPerAward);
  save.bonusStock[id] = (save.bonusStock[id] || 0) + n;
  return { kind: 'bonus', id, count: n };
}

// ----- diamonds in battle (v0.3 items 8/12): escalating prices, counters live on the Battle so they reset every battle -----
export function crumbPrice(n, D = C.ECONOMY.diamonds) { return Math.round(D.crumbPriceStart * Math.pow(D.crumbPriceMul, n)); }
// v0.4 item 9: fixed price (20 diamonds) - boosterPriceStep is 0, so the price no longer climbs with each purchase.
export function boosterPrice(n, D = C.ECONOMY.diamonds) { return D.boosterPriceStart + D.boosterPriceStep * n; }
function boosterBuys(battle, type) { const D = C.ECONOMY.diamonds; battle.dia = battle.dia || { crumbs: 0, boosters: 0, per: {} }; return D.perBooster ? (battle.dia.per[type] || 0) : battle.dia.boosters; }
export function nextCrumbPrice(battle) { battle.dia = battle.dia || { crumbs: 0, boosters: 0, per: {} }; return crumbPrice(battle.dia.crumbs); }
export function nextBoosterPrice(battle, type) { return boosterPrice(boosterBuys(battle, type)); }
export function buyCrumbsWithDiamonds(save, battle) {
  const price = nextCrumbPrice(battle);
  if (battle.result) return { ok: false, why: 'over', price };
  if ((save.diamonds || 0) < price) return { ok: false, why: 'diamonds', price };
  save.diamonds -= price; battle.dia.crumbs++;
  battle.addCrumbs(C.ECONOMY.diamonds.crumbPack);
  return { ok: true, price, crumbs: C.ECONOMY.diamonds.crumbPack };
}
export function buyBoosterWithDiamonds(save, battle, type) {
  const price = nextBoosterPrice(battle, type);
  if (battle.result) return { ok: false, why: 'over', price };
  if (!battle.bonusTypes.includes(type)) return { ok: false, why: 'notBrought', price };
  if (battle.bonusUsesLeft <= 0) return { ok: false, why: 'uses', price };
  if ((save.diamonds || 0) < price) return { ok: false, why: 'diamonds', price };
  save.diamonds -= price;
  if (C.ECONOMY.diamonds.perBooster) battle.dia.per[type] = (battle.dia.per[type] || 0) + 1; else battle.dia.boosters++;
  save.bonusStock[type] = (save.bonusStock[type] || 0) + 1; battle.bonusStock[type] = (battle.bonusStock[type] || 0) + 1;
  return { ok: true, price };
}

// v0.5 item 11: move a placed tower to another free cell during battle for 1 diamond (C.ECONOMY.diamonds.moveTower).
// Swapping two placed towers is free (Battle.swapTowers) and needs nothing from the save.
export function moveTowerWithDiamond(save, battle, tw, c, r) {
  const price = C.ECONOMY.diamonds.moveTower;
  if ((save.diamonds || 0) < price) return { ok: false, why: 'diamonds', price };
  if (!battle.canMoveTower(tw, c, r)) return { ok: false, why: 'spot', price };
  battle.moveTower(tw, c, r); save.diamonds -= price;
  return { ok: true, price };
}

// ----- shop (cards: coins; boosters: diamonds since v0.4) -----
// v0.6 item 4: buying a card of a tower you own = one level-1 card of it
export function buyCard(save, id) {
  const price = C.ECONOMY.shop.cardL1;
  if (!save.cards[id].unlocked || save.coins < price) return false;
  save.coins -= price; addCards(save, id, 1, 1);
  return true;
}
// v0.6.2 item 13 / v0.7 D-P2 + D-P3: with chance E.packNewTowerChance (while a tower is still locked) ONE of the pack's cards is a
// new tower (L1, unlocks it, marked fresh), taken from the CHEAPEST locked price tier (100c -> 200c -> 400c, uniform within the
// tier). Pity: if the previous packPity-1 paid packs held no new tower, this one does (save.packsSinceNew counts them).
// The other cards are level-1 cards of towers you own. The new tower is always the LAST card (the pack reveal deals it last).
// Returns the ids; got.newTower = the new id or null.
export function cheapestLockedTier(save, E = C.ECONOMY.shop) {
  const locked = lockedCards(save); if (!locked.length) return [];
  const min = Math.min(...locked.map((id) => unlockPrice(id, E)));
  return locked.filter((id) => unlockPrice(id, E) === min);
}
export function buyPack(save, rng = Math.random, E = C.ECONOMY.shop) {
  const price = E.cardPack;
  if (save.coins < price) return null;
  const pool = C.ALL_CARDS.filter((id) => save.cards[id].unlocked);
  const tier = cheapestLockedTier(save, E);
  save.coins -= price;
  const got = [];
  let newTower = null;
  const since = save.packsSinceNew || 0;
  const pity = E.packPity && since >= E.packPity - 1;
  if (tier.length && (rng() < (E.packNewTowerChance || 0) || pity)) newTower = tier[Math.floor(rng() * tier.length) % tier.length];
  if (tier.length) save.packsSinceNew = newTower ? 0 : since + 1;
  const n = E.cardPackSize - (newTower ? 1 : 0);
  for (let i = 0; i < n; i++) { const id = pool[Math.floor(rng() * pool.length) % pool.length]; addCards(save, id, 1, 1); got.push(id); }
  if (newTower) { addCards(save, newTower, 1, 1); save.cards[newTower].fresh = true; got.push(newTower); }
  got.newTower = newTower;
  return got;
}
// v0.6 item 5 / v0.7 D-P0: the free one-time pack after the first win of stage 2 = 5 level-1 cards:
// 4 random cards of towers you own (Zapper excluded from the draw), AT LEAST ONE a damage card (sim isDamageCard rule), + 1 Zapper
// card ALWAYS, dealt last. If the Zapper is locked it is the new unlock; if owned it is a normal card (it takes one random card's place).
// Outside the paid-pack rules: no 10% roll, no tier rule, does not touch the pity counter.
// Returns { got: [ids], zapper: {newType, newLevel}, zapperOwned } or null if no gift is waiting.
export function zapperGiftPending(save) { return !!(save.onboard && save.onboard.zapperGift === 'pending'); }
export function isDamageId(id) { const T = C.TOWERS[id]; return !!T && T.kind === 'tower' && id !== 'fan' && T.targets !== 'air' && !T.nearTrail; }
export function claimZapperGift(save, rng = Math.random) {
  if (!zapperGiftPending(save)) return null;
  const pool = C.ALL_CARDS.filter((id) => save.cards[id].unlocked && id !== 'zapper');
  const dmg = pool.filter(isDamageId);
  const n = C.ECONOMY.shop.cardPackSize - 1;
  const ids = [];
  for (let i = 0; i < n; i++) ids.push(pool[Math.floor(rng() * pool.length) % pool.length]);
  if (dmg.length && !ids.some(isDamageId)) { const k = Math.floor(rng() * n) % n; ids[k] = dmg[Math.floor(rng() * dmg.length) % dmg.length]; }
  const got = [];
  for (const id of ids) { addCards(save, id, 1, 1); got.push(id); }
  const zapperOwned = !!save.cards.zapper.unlocked;
  const z = addCards(save, 'zapper', 1, 1); got.push('zapper'); save.cards.zapper.fresh = true;
  save.onboard.zapperGift = 'done';
  return { got, zapper: z, zapperOwned };
}
// v0.4 item 9: every booster costs a fixed 15 diamonds in the shop (was 30 coins).
export function buyBonus(save, type) {
  const price = C.ECONOMY.shop.boosterDiamonds;
  if ((save.diamonds || 0) < price) return false;
  save.diamonds -= price; save.bonusStock[type] = (save.bonusStock[type] || 0) + 1;
  return true;
}

// ----- v0.4 item 17: Cards button blink -----
// "Can buy a card" = coins cover the cheapest card on sale in the shop (a level-1 card of an owned tower, or a new tower).
export function cheapestCardPrice(save, E = C.ECONOMY.shop) {
  const prices = [];
  if (C.ALL_CARDS.some((id) => save.cards[id].unlocked)) prices.push(E.cardL1);
  for (const id of C.ALL_CARDS) if (!save.cards[id].unlocked) prices.push(unlockPrice(id, E)); // v0.6.2: tiered unlock prices
  return prices.length ? Math.min(...prices) : Infinity;
}
export function canAffordCard(save) { return (save.coins || 0) >= cheapestCardPrice(save); }
// Called when a battle is lost: arms trigger (2) unless it has already fired.
export function noteLossForCardBlink(save) {
  save.cardBlink = save.cardBlink || newCardBlinkState();
  if (!save.cardBlink.afterLossShown) save.cardBlink.lossPending = true;
}
// Called on the map screen. Returns true when the Cards button should start its 5-second blink now.
// Trigger (1): first time the player can afford a card. Trigger (2): first time after a loss that he can afford one.
// If both become due at the same moment, one blink covers both (each trigger still fires only once ever).
export function checkCardBlink(save) {
  const b = save.cardBlink = save.cardBlink || newCardBlinkState();
  if (!canAffordCard(save)) return false;
  let fire = false;
  if (!b.affordShown) { b.affordShown = true; fire = true; }
  if (b.lossPending && !b.afterLossShown) { b.afterLossShown = true; b.lossPending = false; fire = true; }
  return fire;
}

// Bonuses are deducted from the save the moment they are used in battle (so Restart/Quit cannot refund them).
export function consumeBonus(save, type) {
  if ((save.bonusStock[type] || 0) <= 0) return false;
  save.bonusStock[type]--;
  return true;
}

export function unlockedCards(save) { return C.ALL_CARDS.filter((id) => save.cards[id].unlocked); }
// v0.5 item 14: the first level of world w > 1 needs EVERY level of world w-1 won AND >= minStarsInWorld stars there (v0.7: 18 of 30, tuning.json worlds[1].unlock).
export function worldStars(save, w) { let s = 0; C.LEVELS.forEach((L, i) => { if (L.world === w) s += (save.levels[i] && save.levels[i].stars) || 0; }); return s; }
export function worldCleared(save, w) { return C.LEVELS.every((L, i) => L.world !== w || (save.levels[i] && save.levels[i].cleared)); }
// v0.7.6 E2: the highest world the player has unlocked (the calendar coin prizes scale with it)
export function highestWorld(save) { let h = 1; for (const W of C.WORLDS) if (worldUnlocked(save, W.id)) h = Math.max(h, W.id); return h; }
export function worldUnlocked(save, w) {
  const W = C.WORLDS.find((x) => x.id === w); if (!W || !W.unlock) return true;
  const u = W.unlock; const prev = u.allLevelsWonInWorld ?? w - 1;
  return worldCleared(save, prev) && worldStars(save, prev) >= (u.minStarsInWorld || 0);
}
export function levelUnlocked(save, i) {
  if (i === 0) return true;
  const L = C.LEVELS[i]; if (!L) return false;
  if (C.WORLD_START[L.world] === i) return worldUnlocked(save, L.world);
  return !!(save.levels[i - 1] && save.levels[i - 1].cleared);
}
export function cardLevels(save) { const o = {}; for (const id of C.ALL_CARDS) o[id] = Math.max(1, save.cards[id].level); return o; }

// Coins earned for a battle (pure). Win: food left + ants killed (+ level, first clear) + time survived.
// v0.6 item 1: time = floor(battle seconds / 3), its own line. Loss: ants killed + time survived, capped TOGETHER at lossCap (15).
export function timeCoins(time, E = C.ECONOMY) { return Math.max(0, Math.floor((time || 0) / E.secondsPerCoin)); }
export function battleCoins(result, { kills = 0, foodLeft = 0, levelIndex = 0, firstClear = false, time = 0, coinMul = 1 } = {}, E = C.ECONOMY) {
  if (result === 'win') {
    // v0.7.6 E5: worlds[w].coinMul scales the win coins (each line, so the results rows still add up); the first-clear bonus is not scaled
    const m = (v) => (coinMul === 1 ? v : Math.round(v * coinMul));
    const parts = { base: m(E.winBase), food: m(Math.round(foodLeft * E.coinsPerFood)), kills: m(Math.round(kills * E.coinsPerKillWin)),
      level: m(levelIndex * E.coinsPerLevel), firstClear: firstClear ? E.firstClearBonus : 0, time: m(timeCoins(time, E)) };
    return { total: Object.values(parts).reduce((s, v) => s + v, 0), parts };
  }
  const k = Math.min(E.lossCap, Math.floor(kills * E.coinsPerKillLoss));
  const t = Math.min(E.lossCap - k, timeCoins(time, E));
  return { total: k + t, parts: { kills: k, time: t } };
}
// Pick and grant a Perfect-level prize (cards or a booster). Only called for perfect wins.
export function grantPerfectPrize(save, rng = Math.random, table = C.ECONOMY.perfectPrizes, { noBooster = false } = {}) {
  if (noBooster) table = table.filter((p) => p.kind !== 'bonus'); // item 14: never more than ONE booster per award
  const total = table.reduce((s, p) => s + p.w, 0);
  let r = rng() * total, pick = table[0];
  for (const p of table) { r -= p.w; if (r <= 0) { pick = p; break; } }
  if (pick.kind === 'cards') {
    // v0.3 item 10: prizes are a way to OBTAIN cards - prefer one you don't own yet.
    // v0.5 item 7: a card prize lands in the inventory as ONE level-1 card.
    const locked = lockedCards(save);
    const pool = locked.length ? locked : C.ALL_CARDS.filter((id) => save.cards[id].unlocked);
    const id = pool[Math.floor(rng() * pool.length) % pool.length];
    const got = addCards(save, id, 1, 1); save.cards[id].fresh = true;
    return { kind: 'cards', id, level: 1, count: 1, newCard: got.newType, newLevel: got.newLevel, reveal: got.newType || got.newLevel };
  }
  return grantBooster(save, pick.id, pick.count);
}

// v0.7.7 S1 boss gift: the first clear of a world's queen pays ONE extra card, deterministic (no rng): the cheapest locked tower as an L1 card (ties: card order),
// otherwise one card of level max(2, cap - 2) of the owned tower with the most cards (ties: card order). It lands in the inventory, marked fresh.
export function grantBossGift(save, levelIndex) {
  let id, level;
  const locked = lockedCards(save);
  if (locked.length) { const min = Math.min(...locked.map((x) => unlockPrice(x))); id = locked.find((x) => unlockPrice(x) === min); level = 1; }
  else {
    const W = C.WORLDS.find((x) => x.id === C.worldOf(levelIndex)); const cap = (W && W.cardLevelCap) || C.MAX_CARD_LEVEL;
    let best = -1; for (const x of C.ALL_CARDS) { const n = totalCards(save.cards[x]); if (n > best) { best = n; id = x; } }
    level = Math.min(C.MAX_CARD_LEVEL, Math.max(2, cap - 2));
  }
  const got = addCards(save, id, level, 1); save.cards[id].fresh = true;
  return { kind: 'cards', id, level, count: 1, newCard: got.newType, newLevel: got.newLevel, reveal: got.newType || got.newLevel, boss: true };
}
// Apply the outcome of a battle. Crumbs are NOT carried over (battle-only currency); only coins/unlocks/prizes persist.
// info: { kills, foodLeft, perfect, time }. Cards and prizes are granted ONLY on a win (prize only on a perfect win).
export function applyBattleResult(save, levelIndex, result, stars, info = {}, rng = Math.random) {
  const E = C.ECONOMY;
  const out = { coins: 0, parts: {}, unlocked: null, bonusReward: null, booster: null, prize: null, bossGift: null, firstClear: false, perfect: false, starCoins: 0, gems: 0 };
  if (result === 'win') {
    const lv = save.levels[levelIndex];
    out.firstClear = !lv.cleared;
    const lvW = C.WORLDS.find((x) => x.id === C.worldOf(levelIndex));
    const c = battleCoins('win', { kills: info.kills || 0, foodLeft: info.foodLeft ?? C.BATTLE.foodHP, levelIndex, firstClear: out.firstClear, time: info.time || 0, coinMul: (lvW && lvW.coinMul) ?? 1 });
    out.coins = c.total; out.parts = c.parts;
    // v0.7.6 E1: first-time star coins. The stored `stars` of an existing save count as already paid (no retroactive grant, nothing is paid on load).
    // A jump 1 -> 3 stars pays both steps; a repeat pays nothing.
    const before = lv.stars || 0; const SB = E.starBonus;
    out.starCoins = (before < 2 && stars >= 2 ? SB[2] : 0) + (before < 3 && stars >= 3 ? SB[3] : 0);
    if (out.starCoins) { out.coins += out.starCoins; out.parts.stars = out.starCoins; }
    // v0.7.6 E3: gems from play - the first clear of a world's boss level, and the first 3 stars there
    out.gems = 0;
    if (C.isBossLevel(levelIndex)) out.gems = (out.firstClear ? E.bossGems.firstClear : 0) + (before < 3 && stars >= 3 ? E.bossGems.firstThreeStars : 0);
    if (out.gems) save.diamonds = (save.diamonds || 0) + out.gems;
    if (out.firstClear) {
      // v0.3 item 10: no card is unlocked by clearing a level any more.
      // v0.3 item 14: specific first-clear booster prizes (level 1 -> ONE Bomb)
      const fb = (E.firstClearBoosters || {})[levelIndex];
      if (fb) out.booster = grantBooster(save, fb, 1);
      if (E.bonusRewardOnFirstClear && !out.booster) { const b = C.BONUS_TYPES[Math.floor(rng() * C.BONUS_TYPES.length)]; out.booster = grantBooster(save, b, 1); out.bonusReward = b; }
    }
    if (out.firstClear && C.isBossLevel(levelIndex)) out.bossGift = grantBossGift(save, levelIndex); // v0.7.7 S1
    if (info.perfect) { out.perfect = true; out.prize = grantPerfectPrize(save, rng, undefined, { noBooster: !!out.booster }); }
    lv.cleared = true; lv.stars = Math.max(lv.stars, stars);
    if (info.perfect) lv.perfect = true;
    // v0.6 item 5: first win of stage 2 -> the one-time Zapper onboarding (dimmed map, finger on Shop, free 5-card gift)
    save.onboard = save.onboard || newOnboardState();
    if (levelIndex === ZAPPER_STAGE && out.firstClear && save.onboard.zapperGift === 'none') { save.onboard.zapperGift = 'pending'; out.zapperGift = true; }
  } else {
    const c = battleCoins('lose', { kills: info.kills || 0, time: info.time || 0 });
    out.coins = c.total; out.parts = c.parts;
  }
  save.coins += out.coins;
  return out;
}

// Prep-screen notes: a selected booster with 0 stock is a WARNING only (v0.3: it can be bought in battle with diamonds),
// it no longer blocks Defend.
export function prepIssues(save, bonuses) {
  return bonuses.filter((b) => (save.bonusStock[b] || 0) <= 0).map((b) => ({ kind: 'zeroBonus', bonus: b, blocking: false }));
}
// Prefer boosters that still have stock; fill the remaining slots with the previous picks (0-stock is allowed).
export function autoFixBonuses(save, bonuses, n = C.BATTLE.bonusTypesToBring) {
  const keep = bonuses.filter((b) => (save.bonusStock[b] || 0) > 0);
  for (const b of C.BONUS_TYPES) if (keep.length < n && !keep.includes(b) && (save.bonusStock[b] || 0) > 0) keep.push(b);
  for (const b of [...bonuses, ...C.BONUS_TYPES]) if (keep.length < n && !keep.includes(b)) keep.push(b);
  return keep.slice(0, n);
}

export function loadSave(storage) {
  try {
    const raw = storage && storage.getItem(SAVE_KEY);
    if (!raw) return newSave();
    const s = JSON.parse(raw);
    const base = newSave();
    // forward-compatible merge with defaults
    for (const id of C.ALL_CARDS) if (!s.cards[id]) s.cards[id] = base.cards[id];
    // v0.5 migration (save v2 -> v3): cards by level. An old card { level L, copies c } becomes ONE card of level L plus its
    // c loose copies (same value: 3 copies = L1, 2 x Ln = Ln+1); levels 1..L count as already seen (no NEW CARD reveal for them).
    for (const id of C.ALL_CARDS) {
      const c = s.cards[id];
      if (!c.inv || typeof c.inv !== 'object') {
        c.inv = {}; c.seen = [];
        if (c.unlocked && c.level >= 1) { c.inv[c.level] = 1; for (let L = 1; L <= c.level; L++) c.seen.push(L); }
        c.fresh = false;
      }
      // v0.6 migration (save v3 -> v4): no copies any more. Each loose copy becomes ONE level-1 card (a copy and a level-1
      // card both cost 12 coins, so nothing a player bought or won is lost). A type that only had copies gets unlocked.
      if (typeof c.copies === 'number' && c.copies > 0) { c.inv[1] = (c.inv[1] || 0) + c.copies; if (!c.seen.includes(1)) { c.seen.push(1); c.seen.sort((a, b) => a - b); c.fresh = true; } }
      delete c.copies;
      syncCard(c);
    }
    // v0.6 item 5: onboarding state. A player already past stage 2 skips the gift; without a Zapper he gets one now (+ reveal).
    if (!s.onboard || typeof s.onboard !== 'object') {
      s.onboard = newOnboardState();
      if (s.levels[ZAPPER_STAGE] && s.levels[ZAPPER_STAGE].cleared) {
        s.onboard.zapperGift = 'done';
        // v0.7: no direct Zapper grant any more - the one-time free pack below (D-P0) always holds the Zapper card
      }
    }
    // v0.7 D-P0: saves from before v0.7 that are past stage 2 get the free pack ONCE (claimed in the Shop, map finger guides there).
    // A v0.6 save cannot tell "claimed" from "skipped on load" (both are 'done'), so every such save gets it once.
    if ((s.version || 1) < 5 && s.levels[ZAPPER_STAGE] && s.levels[ZAPPER_STAGE].cleared && s.onboard.zapperGift === 'done' && !s.onboard.legacyPack) {
      s.onboard.zapperGift = 'pending'; s.onboard.legacyPack = true; s.onboard.grantedOnLoad = false;
    }
    if (typeof s.packsSinceNew !== 'number') s.packsSinceNew = 0;
    for (const b of C.BONUS_TYPES) if (s.bonusStock[b] == null) s.bonusStock[b] = 0;
    while (s.levels.length < C.LEVELS.length) s.levels.push({ stars: 0, cleared: false });
    if (typeof s.diamonds !== 'number') s.diamonds = C.ECONOMY.diamonds.start;
    if (!s.calendar) s.calendar = newCalendarState();
    // v0.4 migration: card-blink flags (new field), new cards (Roasted Lava arrives locked via the loop above), save version 2
    if (!s.cardBlink || typeof s.cardBlink !== 'object') s.cardBlink = newCardBlinkState();
    for (const k of Object.keys(base.cardBlink)) if (typeof s.cardBlink[k] !== 'boolean') s.cardBlink[k] = false;
    if (!s.lastDeck) s.lastDeck = base.lastDeck.slice();
    if (!s.lastBonuses) s.lastBonuses = base.lastBonuses.slice();
    s.version = Math.max(s.version || 1, SAVE_VERSION);
    delete s.crumbs; // crumbs never persist
    return s;
  } catch (e) { return newSave(); }
}
export function writeSave(storage, save) {
  const copy = { ...save }; delete copy.crumbs;
  storage.setItem(SAVE_KEY, JSON.stringify(copy));
}
