import TUNING from '../../tuning/tuning.json' with { type: 'json' };
export { TUNING };
// =====================================================================
//  CRUMB DEFENSE - GAME CONFIG.
//  v0.5 item 15: the TUNING numbers (tower stats, upgrade sequences, ants, worlds, levels, maps) live in
//  /workspace/ant-td/tuning/tuning.json - the source of truth, bundled at build time (see tuning/README.md).
//  This file adds the texts/labels and the rules that are not tuning data. Run `npm test && npm run sim`, then `npm run build`.
//  Units: distances in logical pixels (1 tile = 40 px), time in seconds.
// =====================================================================

export const TILE = 40;
export const GRID_COLS = 10;
export const GRID_ROWS = 12;

// ---------------- Battle rules ----------------
export const BATTLE = {
  foodHP: 100,              // cookie food points
  carryBack: true,          // true: thieves carry the piece home (killing them returns part of it). false: food is lost on arrival.
  // Food leaves the cookie THE MOMENT an ant takes a piece. If the carrier is killed on the way home only part returns:
  //   mode 'fixed'    : return `fixed` of the piece (default 40%: stole 5 -> 2 come back)
  //   mode 'distance' : return distMin..distMax depending on how far the carrier got: killed next to the cookie -> distMax,
  //                     killed at the nest door -> distMin (linear in between).
  //   rounding 'exact' keeps fractions (a worker's 1 crumb -> 0.4), or use 'floor' / 'round'.
  foodReturn: { mode: 'fixed', fixed: 0.4, distMin: 0.1, distMax: 0.8, rounding: 'exact' },
  // v0.7.2 C14 'shuttle until death': an ant that drops its piece at the nest (lost for good) waits `pause` s and walks back to the cookie
  // for another piece. It only stops by dying (HP 0). Queens loop too. The level is won when no ant is alive after the last wave,
  // lost when the cookie is empty (so a level can never be endless).
  forage: { on: true, pause: 0.3, queenLoop: true,
    // v0.7.10 cookie pick-up beat: seconds an ant stands at the treat after taking its piece, before it turns home (every trip). 0 = off (v0.7.9 behaviour). v0.7.10 ships 0.5.
    // cookiePauseBoss: same for queens (omit = same as cookiePause).
    cookiePause: 0.5 },
  // v0.7.2 C13 cookie guard (fly swatter): free, automatic, fixed on the cookie. One swat every `interval` s (the timer waits while nothing is in range)
  // of `damage` (armour applies, min 1) at an ant within `range` px of the cookie; carrier nearest the cookie first, else nearest ant; hits flyers.
  swatter: { on: true, damage: 4, interval: 4, range: 72, first: 4, air: true },
  // v0.7.4 M2 'rescue the crumb' (FLAG, default OFF = the 40% above comes back automatically, exactly as in v0.7.3). With on: true a killed carrier
  // returns `auto` of its piece at once and leaves a piece worth (tap - auto) x the stolen food on the trail for `window` s of WALL time
  // (any game speed); a tap within `radius` (design px) collects it. Pieces closer than `mergeRadius` merge. Ship `on: false` until the human tap check.
  rescue: { on: false, auto: 0.2, tap: 0.6, window: 3, radius: 30, mergeRadius: 28 },
  carrierSpeedMul: 0.85,    // carriers walk a bit slower on the way home
  startCrumbs: 0,           // crumbs are battle-only and always start from this value (spec: 0)
  // Card cost: cost of the Nth card played this battle (N starts at 0) = firstCardCost + N * cardCostStep
  firstCardCost: 0,         // spec 07:45: first card is free
  cardCostStep: 5,          // ...then 5, 10, 15, ...
  // v0.5 item 17: redraw all 3 visible picks. Cost of the Nth redraw this battle (N from 0) = rerollCost + N * rerollStep
  // -> 3, 6, 9, 12 ... and it RESETS at the start of every battle.
  rerollCost: 3,
  rerollStep: 3,
  visiblePicks: 3,
  guaranteeDamageOpening: true, // opening hand always holds >=1 ground damage tower (so the free card can earn crumbs)
  // v0.7 D-R1..R3 (economy plan): a hand never shows the same card twice; the opening hand holds >= openingDamageCards damage
  // cards (when the deck has that many); the first `freeRedraws` redraws of every battle cost 0 (then 3, 6, 9 ...).
  distinctHand: true,
  openingDamageCards: 2,
  freeRedraws: 1,
  deckSize: 5,
  maxInBattleLevel: 6,      // v0.6 item 11: duplicate card dropped on same tower upgrades it, up to this level (5 upgrades, see TOWERS[x].upgrades)
  firstWaveDelay: 8,        // seconds before wave 1 auto-starts (player can call it early)
  waveGap: 9,               // seconds between end of one wave's spawning and the next wave
  earlyCallBonusPerSec: 0.25, // crumbs granted per second skipped when calling a wave early (rounded down)
  maxBonusUses: 2,          // max bonus uses per battle (total across both types)
  bonusTypesToBring: 2,
  // v0.3 item 1: directional towers (fan, marble) ALWAYS aim at the board centre, fixed at placement (no Turn).
  // snap:false = true angle toward the centre; snap:true = rounded to the nearest of right/down/left/up.
  aim: { target: 'center', snap: false },
};

// Stars by % food remaining at victory (food on the cookie / foodHP)
export const STARS = [
  { stars: 3, minPct: 90 },
  { stars: 2, minPct: 50 },
  { stars: 1, minPct: 0.0001 }, // >0
];


// ---------------- Towers & obstacles ----------------
// NUMBERS: tuning.json "towers" (power / rate / rangeTiles / params / battleUpgrades / cardUpgrades). TEXTS: below.
// stats   : the 3 core stats shown to the player. power = what one hit/tick does (see powerLabel), rate = actions per second
//           (null = always on), range = radius in px from the tower centre (40 px = 1 tile).
// upgrades: in-battle levels 2 and 3 (drop a duplicate card on the tower): multipliers of ONLY the listed keys.
// cardUpgrades (v0.5 items 5/5b): each tower's OWN hand-made sequence of card-level steps (L2..L10, from merging cards);
//           every step improves one stat (sometimes two): power/rate/others +x (fraction), range +x tiles.
// place   : 'side' = beside the trail, 'path' = on the trail. targets: 'ground' | 'air' | 'both'.
// directional (v0.5 items 2/10): Marble + Fan act along the trail next to them, in the direction AWAY from the tower
//           (sim.js trailDirection). The Marble rolls to the end of that straight stretch; the Fan blows along it.
// v0.5 item 4: ranges back to the v0.4.0 values, measured from the tower centre: basic 1.5 tiles (60 px),
//   Bug Zapper 2 (80 px), Laser 2.5 (100 px); on-trail objects 1 tile (40 px). rangePx(t) = t * TILE.
export const rangePx = (tiles) => tiles * TILE;
const TOWER_TEXT = {
  slingshot: { name: 'Slingshot', short: 'Slingshot', kind: 'tower', place: 'side', targets: 'ground', color: '#f4b183', powerLabel: 'Damage',
    desc: 'Pings the weakest ant in range.', ability: 'Single target: the ant with the fewest HP left.' },
  spray: { name: 'Bug Spray', short: 'Spray', kind: 'tower', place: 'side', targets: 'ground', color: '#b5e3a8', powerLabel: 'Gas dmg/s',
    desc: 'Gas cloud, ignores armor. Not gas masks.', ability: 'Area damage over time, ignores armor.' },
  sound: { name: 'Boombox', short: 'Boombox', kind: 'tower', place: 'side', targets: 'ground', color: '#c9b6f2', powerLabel: 'Pulse dmg',
    desc: 'Hits all ants around it. Ignores armor.', ability: 'Hits all nearby ants + short stagger.' },
  ball: { name: 'Marble Roller', short: 'Marble', kind: 'tower', place: 'side', targets: 'ground', color: '#9fd3f2', directional: true, nearTrail: true,
    powerLabel: 'Squash dmg', rangeLabel: 'Roll',
    desc: 'Rolls away from itself along the trail.', ability: 'Rolls down the straight trail beside it, away from the tower, until a turn.' },
  fan: { name: 'Desk Fan', short: 'Fan', kind: 'tower', place: 'side', targets: 'both', color: '#a8e6e0', directional: true, powerLabel: 'Push',
    desc: 'Blows along the trail, away from itself.', ability: 'Wind along the trail beside it, away from the fan.' },
  pheromone: { name: 'Pheromone Perfume', short: 'Perfume', kind: 'tower', place: 'path', targets: 'ground', color: '#f7b2d0', powerLabel: 'Drain/s',
    desc: 'Lures ants on its tile back, slowed + drained.', ability: 'Covers its own tile. Charm: ants walk back once, slowed.' },
  lizard: { name: 'Gecko', short: 'Gecko', kind: 'tower', place: 'side', targets: 'ground', color: '#b8e07a', powerLabel: 'Bite',
    desc: 'Bites the weakest ant hard. Chews after.', ability: 'Targets the ant with the fewest HP left; chews after kills.' },
  laser: { name: 'Laser Pointer', short: 'Laser', kind: 'tower', place: 'side', targets: 'both', color: '#ff9aa2', powerLabel: 'Damage',
    desc: 'Fast beam at the weakest ant. Hits flyers.', ability: 'Aims at the fewest HP left. Heat: +12% per hit on the same ant.' },
  zapper: { name: 'Bug Zapper', short: 'Zapper', kind: 'tower', place: 'side', targets: 'air', color: '#9ad0ff', powerLabel: 'Zap dmg',
    desc: 'Anti-air: zaps the weakest flyer, chains on.', ability: 'First zap: fewest HP left. Chains to the nearest flyers (60% each jump).' },
  glue: { name: 'Glue Puddle', short: 'Glue', kind: 'obstacle', place: 'path', targets: 'ground', color: '#fff3b0', powerLabel: 'Slow', powerFmt: 'pct',
    desc: 'Sticks ants on its tile, then slows them.', ability: 'Covers its own tile. First touch sticks the ant, then slows it.' },
  gate: { name: 'Electric Gate', short: 'E-Gate', kind: 'obstacle', place: 'path', targets: 'ground', color: '#ffe08a', powerLabel: 'Zap dmg',
    desc: 'Zaps ants on its tile. Ignores armor.', ability: 'Covers its own tile: zaps everything on it.' },
  lava: { name: 'Roasted Lava', short: 'Lava', kind: 'obstacle', place: 'path', targets: 'ground', color: '#ffb36b', powerLabel: 'Roast dmg/s',
    desc: 'Hot tile: slows and roasts walkers.', ability: 'Covers its own tile: slight slow + damage every moment an ant is on it.' },
  // v0.6 item 6: the Tractor. Beside the trail; lowers its front bucket onto ONE trail tile next to it (the same direction logic as
  // the marble/fan, sim.js trailDirection), lifts EVERY liftable ant on that tile and throws it off the trail (instant kill).
  // liftSize: 1 = small ants, 2 = + regular, 3 = + large. Queens are never lifted; flyers are in the air (not lifted).
  tractor: { name: 'Tractor', short: 'Tractor', kind: 'tower', place: 'side', targets: 'ground', color: '#ffcf6e', directional: true, nearTrail: true,
    powerLabel: 'Lifts', desc: 'Scoops ants off the trail. Slow.', ability: 'Lifts every liftable ant on the trail tile in front of it and throws it away.' },
};
export const TOWERS = {};
for (const [id, txt] of Object.entries(TOWER_TEXT)) {
  const T = TUNING.towers[id];
  TOWERS[id] = { ...txt, stats: { power: T.power, rate: T.rate, range: T.rangeTiles == null ? null : rangePx(T.rangeTiles) },
    ...T.params, upgrades: T.battleUpgrades, cardUpgrades: T.cardUpgrades };
}
// v0.6 item 6: Tractor lift sizes (size class of an ant = its tuning.json size name)
export const LIFT_MAX = 3;
export const SIZE_RANK = { small: 1, regular: 2, large: 3 };
export const LIFT_NAMES = ['', 'Small', 'Small + regular', 'All sizes'];
// labels for upgradeable keys in the info panel
export const STAT_LABELS = { power: 'Power', rate: 'Rate', range: 'Range', cloudRadius: 'Cloud', ballRadius: 'Marble width', stagger: 'Stagger',
  charmTime: 'Charm', slow: 'Slow', chewTime: 'Chew time', heatMax: 'Max heat', chain: 'Chain', stickTime: 'Stick', liftSize: 'Lifts' };
export const SLOW_CAP = 0.85;
export const ALL_CARDS = Object.keys(TOWERS);
export const STARTER_CARDS = ['slingshot', 'spray', 'glue', 'fan', 'ball'];
// v0.3 item 10: cards are NOT unlocked by levels any more - they must be bought (Shop) or won (Reward Calendar / Perfect prize).
// SIM_ASSUMED_CARDS is only used by the balance simulator: it assumes that by level i the player has obtained the first i of these.
export const SIM_ASSUMED_CARDS = ['sound', 'gate', 'laser', 'pheromone', 'zapper', 'lizard', 'lava', 'tractor'];
export const AIR_COUNTERS = ['laser', 'zapper'];

// ---------------- Ants ----------------
// speed px/s; steal = food taken on reaching the cookie; weight scales fan push (1 = full push, 0 = immune)
// slowResist: fraction of slow ignored
// v0.4 items 14/20: exactly FOUR body sizes - three battle-ant sizes + the queen (always the largest).
//   small  = the fast ant, about HALF the regular ant's drawn area
//   regular= worker; the regular size carries the modifiers (wings, helmet/armor, gas "chef" mask)
//   large  = only slightly bigger. Yair: "large = twice a regular" where the old large looked "about 3x" to him (measured: its
//            drawn area was 2.0x the regular) -> shrunk by that same 2/3 to ~1.4x the regular's drawn area (~1.15x as tall; scale 1.12, measured 1.39x by npm run antsizes).
//            `npm run antsizes` (tools/ant-sizes.mjs) prints the measured areas. Change ANT_SIZES.large to tune.
//   queen  = unchanged (Yair: her size is "relatively good").
// Armored = regular size + armor/helmet only. Late-game exceptions (item 14d/e): Heavy Knight = LARGE armored,
// Sprint Knight = FAST armored (regular body, sports shoes + jersey). Max 5 ant types per battle (item 15, see LEVELS).
// v0.7.5 (review finding 3): the tower info panel's one-line description follows the selected target mode (text only; the sim's behaviour is in sim.js). 'weak' keeps TOWERS[id].ability.
export const TARGET_MODE_TEXT = {
  slingshot: { carrier: 'Single target: ants carrying food first, then the fewest HP left.', front: 'Single target: the walking ant closest to the cookie.' },
  lizard: { carrier: 'Targets ants carrying food first, then fewest HP left; chews after kills.', front: 'Targets the walking ant closest to the cookie; chews after kills.' },
  laser: { carrier: 'Aims at ants carrying food first, then fewest HP. Heat: +12% per hit on the same ant.', front: 'Aims at the walking ant closest to the cookie. Heat: +12% per hit on the same ant.' },
  zapper: { carrier: 'First zap: food carriers first, then fewest HP. Chains to the nearest flyers (60% each jump).', front: 'First zap: the flyer closest to the cookie. Chains to the nearest flyers (60% each jump).' },
};
export const VERSION = '0.8.0'; // v0.7: shown on the map screen (keep in step with package.json + android versionName)
export const ANT_SIZES = { ...TUNING.antSizes };
const ANT_TEXT = {
  small: { name: 'Scout Ant', desc: 'Tiny, fast, comes in swarms.' },
  worker: { name: 'Worker Ant', desc: 'The regular. Hard hat included.' },
  big: { name: 'Big Ant', desc: 'Slow, chunky, a bit of armor.' },
  gasmask: { name: 'Gas-Mask Ant', desc: 'Immune to bug spray.' },
  armored: { name: 'Knight Ant', desc: 'Heavy armor. Use spray, boombox or gate.' },
  flyer: { name: 'Flying Ant', desc: 'Flies over ground towers. Laser, zapper or plane!' },
  sprinter: { name: 'Sprint Knight', desc: 'Armored AND fast - sneakers on. Late stages only.' },
  heavy: { name: 'Heavy Knight', desc: 'A big ant in full armor. Late stages only.' },
  queen: { name: 'Ant Queen', desc: 'BOSS. Marches in and calls her scouts. Takes HALF the cookie.' },
  // v0.7 (Yair ANT-STATS-v0.6.3): small variants - same tiny body as the Scout, with a gas mask / armour / wings
  small_gasmask: { name: 'Masked Scout', desc: 'A tiny scout with a gas mask - spray does nothing.' },
  small_armed: { name: 'Armored Scout', desc: 'A tiny scout in armour. Slower, shrugs off weak hits.' },
  small_fly: { name: 'Flying Scout', desc: 'A tiny flying scout. Laser or zapper!' },
  queen2: { name: 'Swift Queen', desc: 'BOSS of world 2. Fast, calls flying ants. Takes 40 of the cake.' },
  // v0.7.7 world 3 (Pie Pantry)
  greasy: { name: 'Buttery Ant', desc: 'Slippery! Slowing barely works. Hit it hard.' },
  mama: { name: 'Brood Ant', desc: 'Drops 3 baby ants when she falls.' },
  queen3: { name: 'Pie Queen', desc: 'BOSS of world 3. Calls buttery ants. Takes 55 of the pie. Ignores most slowing.' },
  // v0.7.9 world 4 (Ice-Cream Parlour)
  nurse: { name: 'Nurse Ant', desc: 'Heals hurt friends nearby every 3 seconds. Pop her first!' },
  queen4: { name: 'Sundae Queen', desc: 'BOSS of world 4. Calls a nurse every 9 seconds, and the nurses heal her. Takes 50 of the sundae.' },
};
// ---------------- Queens (v0.4 item 19) ----------------
// One queen per world, each a bit different. What a queen takes from the treat when she reaches it (`steal`) follows ONE formula:
//   take = 50 (the average) + sum of her trait modifiers. Traits in her favour LOWER it, traits against her RAISE it:
//     fast -10 (-> 40), flying / hard to hit -15 (-> 35), slow +0 / +5 / +10 (-> 50 / 55 / 60 by how slow), vulnerable +5 / +10.
// World 1's queen is slow ('slow' = +0) -> takes 50 (Yair set 25 -> 50 on 2026-10-21).
// IMPORTANT: the treat has foodHP 100, so a queen that reaches it takes HALF of it. 3 stars need >= 90% food left, so once the
// queen gets a bite, 3 stars are no longer reachable in that battle (killing her on the way home returns only part of it).
export const QUEEN_TRAITS = { ...TUNING.queenTraitMods };
export function queenTake(traits = [], T = QUEEN_TRAITS) { return 50 + traits.reduce((s, t) => s + (T[t] || 0), 0); }
// ANTS: numbers from tuning.json "ants" (+ texts above). A queen's `steal` is ALWAYS computed by queenTake(her traits).
export const ANTS = {};
for (const [id, a] of Object.entries(TUNING.ants)) {
  ANTS[id] = { ...(ANT_TEXT[id] || { name: id, desc: '' }), ...a, size: ANT_SIZES[a.size] ?? a.size, sizeClass: a.size };
  if (a.boss) ANTS[id].steal = queenTake(a.queenTraits || []);
}
export const isQueen = (type) => !!(ANTS[type] && ANTS[type].boss);
// v0.7.7 rarity tiers (tuning.json ants[].rarity; default common). Used by the level checker test and the prep 'Incoming ants' pips.
export const RARITY_TIERS = ['common', 'uncommon', 'rare', 'elite', 'boss'];
export const rarityOf = (type) => (ANTS[type] && ANTS[type].rarity) || 'common';
export const rarityRank = (type) => Math.max(0, RARITY_TIERS.indexOf(rarityOf(type)));
// ---------------- Worlds (v0.5 items 13/14) ----------------
// tuning.json "worlds": each world = 10 levels ending with its queen, its own treat. World 2 unlocks when every level of
// world 1 is won AND the player has >= minStarsInWorld (v0.7: 18, was 20) of its 30 stars.
// Star gates (v0.7.9): W1->W2 18, W2->W3 18, W3->W4 14 (encoded in tuning.json worlds[3].unlock). W4->W5 = 12 stars in W4 (review v0.7.8 plan s7, first-attempt W4 star sum 11.7):
// recorded here only; encode it as worlds[4].unlock {allLevelsWonInWorld: 4, minStarsInWorld: 12} when World 5 exists.
export const WORLDS = TUNING.worlds.map((w) => ({ coinMul: 1, ...w })); // v0.7.6 E5: coinMul (default 1) multiplies that world's win coins (not the first-clear bonus)
export const QUEENS = Object.fromEntries(WORLDS.map((w) => [w.id, { type: w.queen, traits: TUNING.ants[w.queen].queenTraits }]));

// Crumbs per kill: basic ant = 1; others proportional to their "power" vs the worker (power ~ effective HP x speed factor).
// You can override any value by adding `crumbs: N` to an ant above.
export function antPower(a) {
  const effHP = a.hp * (1 + 0.12 * a.armor) * (a.gasImmune ? 1.15 : 1) * (a.flying ? 1.4 : 1);
  return effHP * Math.sqrt(a.speed / ANTS.worker.speed);
}
export function crumbsFor(type) {
  const a = ANTS[type];
  if (a.crumbs != null) return a.crumbs;
  return Math.max(1, Math.round(antPower(a) / antPower(ANTS.worker)));
}

// ---------------- Boosters (code name BONUSES; UI name 'Boosters') ----------------
export const BONUSES = {
  bomb:    { name: 'Bomb',        damage: 60, radius: 105, targetsAir: false, needsTarget: true,  color: '#ff8c8c', desc: 'Big boom where you tap. Bosses survive.' },
  plane:   { name: 'Crop Duster', damage: 22, slow: 0.4, slowTime: 2, speed: 260, targetsAir: true, needsTarget: false, color: '#a0d8ef', desc: 'Sprays the whole trail. Hits flyers too.' },
  freeze:  { name: 'Freezer',     time: 4, needsTarget: false, color: '#c7ecff', desc: 'Freezes every ant for 4 seconds.' },
  decoy:   { name: 'Sugar Cube',  time: 6, needsTarget: true, color: '#fff7e6', desc: 'Ants rush to the sugar and munch on it.' },
};
export const BONUS_TYPES = Object.keys(BONUSES);

// ---------------- Meta economy: coins + diamonds (persistent), crumbs (battle only) ----------------
export const ECONOMY = {
  startCoins: 0,               // v0.3 item 5 (was 50); also after Reset
  // WIN  : coins = winBase + foodLeft * coinsPerFood + kills * coinsPerKillWin + levelIndex * coinsPerLevel  (+ firstClearBonus)
  winBase: 10, coinsPerFood: 0.3, coinsPerKillWin: 0.15, coinsPerLevel: 3,
  firstClearBonus: 25,
  // v0.7.6 E1: coins paid ONCE per level the first time it reaches 2 / 3 stars (tuning.json economy.starBonus); a 1 -> 3 star jump pays both
  starBonus: { 2: TUNING.economy.starBonus['2'], 3: TUNING.economy.starBonus['3'] },
  starBonusScale: TUNING.economy.starBonusScale, // v0.7.10 R1: 'coinMul' = bonus x world coinMul (rounded to 5)
  // v0.7.6 E3: diamonds on the first clear of a world's boss level (its last level) and on the first 3 stars there (tuning.json economy.bossGems)
  bossGems: { firstClear: TUNING.economy.bossGems.firstClear, firstThreeStars: TUNING.economy.bossGems.firstThreeStars },
  // v0.6 item 1: + floor(battle time / secondsPerCoin) for the time survived - its own results line, on a win AND on a loss.
  secondsPerCoin: 3,
  // LOSS : coins = min(lossCap, floor(kills * coinsPerKillLoss) + floor(time / secondsPerCoin)). The cap covers the whole loss
  //        payout (kills + time). Never cards or prizes.
  coinsPerKillLoss: 0.1, lossCap: 15,
  startBonusStock: 0,          // v0.3 item 14 (was 3): every booster starts at 0
  firstClearBoosters: { 0: 'bomb' }, // v0.3 item 14: first clear of level 1 (index 0) -> ONE Bomb (count is always 1)
  maxBoostersPerAward: 1,      // v0.3 item 14: never award more than ONE booster at a time
  bonusRewardOnFirstClear: 0,  // v0.2: off - special prizes only come from a Perfect level
  // PERFECT level = win with full food and nothing ever stolen -> "Perfect Cookie!" + one prize from this table (weights w)
  perfectPrizes: [
    { kind: 'cards', count: 3, w: 2 },          // a card you don't own yet (L1); else ONE level-1 card of an owned type
    { kind: 'bonus', id: 'bomb', count: 1, w: 1 },   // v0.3 item 14: booster prizes are ONE booster (was 2)
    { kind: 'bonus', id: 'plane', count: 1, w: 1 },
    { kind: 'bonus', id: 'freeze', count: 1, w: 1 },
    { kind: 'bonus', id: 'decoy', count: 1, w: 1 },
  ],
  shop: {
    cardL1: 12,                // v0.6 item 4: coins for one level-1 card of a tower you own (there are no "copies" any more)
    cardPack: 40,              // coins for 5 random level-1 cards of towers you own
    packPity: 10,              // v0.7 D-P3: while a tower is locked, every 10th paid pack without a new tower holds one
    cardPackSize: 5,
    // v0.4 item 10: boosters are bought with DIAMONDS at a FIXED price (all 4 boosters): 15 in the Shop, 20 in battle.
    boosterDiamonds: 15,       // diamonds per booster in the Shop (was 30 coins)
    // v0.6.2 item 12: unlocking a tower you don't own yet (any time, not tied to stages) costs a TIERED price by base power
    // (tuning.json shop.unlockPrice: 100 Boombox/Perfume/Lava, 200 Gecko/E-Gate/Zapper, 400 Laser/Tractor). Replaces the flat 60c.
    unlockPrice: { ...TUNING.shop.unlockPrice },
    unlockPriceDefault: TUNING.shop.unlockPriceDefault,
    // v0.6.2 item 13: chance that a card pack holds ONE new (locked) tower card (L1) as one of its cards (tuning.json shop)
    packNewTowerChance: TUNING.shop.packNewTowerChance,
  },
  // v0.3 items 8/12: diamonds (persistent, start 0, come from the Reward Calendar). The crumb price escalates and RESETS every battle.
  diamonds: {
    start: 0,
    crumbPack: 50,             // crumbs per in-battle purchase
    crumbPriceStart: 10,       // 10 -> 20 -> 40 -> 80 -> 160 ...
    crumbPriceMul: 2,
    boosterPriceStart: 20,     // v0.4 item 10: FIXED 20 diamonds per booster in battle, no escalation (all 4 boosters)
    boosterPriceStep: 0,       // was 10 (20, 30, 40 ...) in v0.3
    perBooster: false,
    moveTower: 1,              // v0.5 item 11: move a placed tower to another cell in battle (swapping two towers is free)
  },
  // v0.4 item 17: the Cards button blinks (5 s, blink only) exactly twice ever: (1) the first time the coins are enough to buy a
  // card, (2) the first time after a LOSS that the coins are enough. "A card" = the cheapest card purchase (one level-1 card, 12c).
  cardsBlinkSec: 5,
};

// ---------------- Reward Calendar (v0.3 items 6 + 9) ----------------
// One prize per local calendar day, claimed by tapping today's tile.
// Monthly bar = login streak 1..30 (wraps to 1 after 30). Rule 'missedDay' (default since vc7): it RESETS to 1 only when a whole
//   local calendar day passed without a claim (the hour of day never matters). Legacy alternative: 'hours24' (> `hours` since last seen).
// Weekly row = the player's own 7-day cycle: it starts on the first visit day; every new visit day (a local calendar day on which the
//   game was opened, claimed or not) moves one tile forward; after tile 7 a new cycle starts. Unclaimed earlier tiles are missed.
// Amounts: coins = 30, 60, 90, 120 (cap; v0.7.6, x world multiplier) for the 1st, 2nd, 3rd, 4th+ coin prize of the current streak; diamonds 2..5 by streak week.
// Card prizes prefer cards you don't own. Boosters are allowed in the table but are always clamped to ONE (item 14).
// Formulas: see src/calendar.js header.
export const CALENDAR = {
  monthLength: 30,
  monthlyReset: { rule: 'missedDay', hours: 24 }, // 'missedDay' (default) | 'hours24' (legacy alternative; uses `hours`)
  // v0.7.6 E2/E5: [30, 60, 90, 120] (tuning.json economy.calendar; was 5/10/15/20) x (1 + worldStep x (highest unlocked world - 1)), rounded to roundTo
  coinsByStreak: TUNING.economy.calendar.coinsByStreak.slice(), // 1st, 2nd, 3rd, 4th+ coin prize of the current streak (the last value is the cap)
  worldStep: TUNING.economy.calendar.worldStep, roundTo: TUNING.economy.calendar.roundTo,
  diamondsByStreakWeek: [2, 3, 4, 5],          // streak days 1-7, 8-14, 15-21, 22-30
  week: [                                      // tile 1..7 of the player's 7-day cycle
    { kind: 'coins' },
    { kind: 'coins' },
    { kind: 'diamonds' },
    { kind: 'coins' },
    { kind: 'card', level: 1 },
    { kind: 'diamonds' },
    { kind: 'card', level: 2, extra: { kind: 'diamonds', count: 5 } }, // v0.4 item 2: day 7 = level-2 card + 5 diamonds
  ],
  // monthly surprise boxes at 10/20/30 (contents are not shown before they are won). v0.4 item 1: the day-30 box = a level-3 card.
  monthMilestones: { 10: { kind: 'diamonds', count: 3 }, 20: { kind: 'diamonds', count: 4 }, 30: { kind: 'card', level: 3 } },
  heartbeatSec: 60,                            // how often the visit / "last seen" is refreshed while the game is visible
};

// ---------------- UI timing ----------------
export const UI = {
  queenCheerHold: 4.2,         // v0.6.2 item 14: on a queen-level win the result panel + buttons wait this long ('Way to go' + fireworks)
  swatPivot: { dx: 46, dy: 17, oldDx: 35, oldDy: 21 }, // v0.7.4 P: the swatter's pivot beside the cookie (was 35, 21): the slap head lands 10-14 px farther from the cookie centre
  carrierLane: 5,              // v0.7.4 P: lateral offset (design px) of an ant walking home with food
  rescueSweepRadius: 24,       // v0.7.4 M2: a finger drag collects crumbs within this distance of its path
  speedMaxAtStart: 2,          // v0.7.4 M0: a battle starts at 1x or 2x at most (a session's 4x becomes 2x); the speed is never saved
  toastTime: 0.9,              // seconds for small in-battle notices ("Need 10 crumbs")
  menuToastTime: 1.3,
  mergeAnimTime: 1.5,
  perfectAnimTime: 1.8,
  upgradeInfoTime: 2.5,        // after an upgrade the info panel shows this long, then closes (B9) unless the player tapped it/the tower
  showAimOnlyWhenRelevant: true, // v0.4 item 5: no direction arrows at all; the fan shows its area circle, the marble its roll line
  // v0.3 item 4: cookie face by food left (fraction, highest first) + a short 'ouch' face when a piece is stolen
  cookieFaces: [
    { min: 0.85, face: 'happy' }, { min: 0.70, face: 'content' }, { min: 0.55, face: 'worried' }, { min: 0.40, face: 'nervous' },
    { min: 0.28, face: 'sad' }, { min: 0.18, face: 'crying' }, { min: 0.09, face: 'screaming' }, { min: 0.03, face: 'pleading' }, { min: -1, face: 'fainted' },
  ],
  ouchTime: 0.35,
  // v0.4 item 18 / v0.5 item 3: the treat (cookie, cake, ...) reacts with a short ANIMATED face every time ants take a bite:
  // 'surprised', 'oyoy' (bites come fast), 'sad', 'crying' (big bites, e.g. the queen). FACES ONLY - no text / speech bubbles.
  // See src/treat.js (rules) and art.js drawTreat/drawTreatFace (one face set for every treat).
  treatReact: { time: 1.6, rushWindow: 4, rushBites: 3, bigBite: 5 },
};
// Each world's treat. Every treat uses the SAME face/animation set; only the body art differs (art.js TREAT_BODIES).
export const TREATS = Object.fromEntries(WORLDS.map((w) => [w.id, w.treat]));

// v0.6 item 4: cards only - every card has a level (cards are obtained at L1..L4). Manual merge at EVERY level:
// 3 cards of the same level -> 1 card of the next level, paying coinCost[next level] coins. (Merge costs as built in v0.5.)
export const MERGE = {
  cardsPerMerge: 3,
  coinCost: [0, 0, 10, 20, 40, 60, 90, 130, 180, 240, 320],
};
export const MAX_CARD_LEVEL = 10;

// ---------------- Maps: see src/maps.js (ASCII grids, data only) ----------------
export { MAPS } from './maps.js'; // map layouts: tuning.json "maps"

// ---------------- Levels ----------------
// Each wave is generated from: count = round(base + growth * waveIndex), mix chosen from `mix` (weights, from wave index `from`).
// hpMul scales all ant HP in the level. `special` adds extra groups to specific waves (1-based wave numbers).
// You can instead give `waves: [[{type,count,interval}], ...]` for full manual control.
// v0.4 items 12 + 13 + 15 (applied together):
//   * waves per stage cut by 30-50% (each stage on its own; the number of stages is unchanged):
//       6,7,8,9,10,11,12,13,14,15  ->  4,4,5,6,6,7,8,8,9,9   (-33,-43,-38,-33,-40,-36,-33,-38,-36,-40 %)
//   * the number of ants in each stage is HALVED (total ants per stage ~50% of v0.3; L2 45%). Cutting the waves already removes
//     about half the ants (the late waves were the biggest), so each wave keeps about its v0.3 size (base/growth x 0.9-1.0,
//     never bigger than before). See JOB-v0.4.0.md for per-stage before/after counts.
//   * at most 5 ant types per battle (the queen counts as one).
//   v0.3 values for reference (base, growth): L1 9/1.6, L2 7/1.8, L3 8/1.8, L4 8/2.0, L5 9/2.0, L6 10/2.1, L7 10/2.2, L8 11/2.2,
//   L9 12/2.4, L10 12/2.4. hpMul re-tuned with the bots (npm run sim) after the range change (item 6).
export const LEVELS = TUNING.levels.map((L) => ({ ...L }));
export const isBossLevel = (i) => { const L = LEVELS[i]; const w = L && WORLDS.find((x) => x.id === L.world); return !!w && i === WORLD_START[w.id] + w.levels - 1; }; // v0.7.6 E3: the last level of a world (its queen)
// first level index of each world
export const WORLD_START = Object.fromEntries(WORLDS.map((w) => [w.id, LEVELS.findIndex((L) => L.world === w.id)]));
export const worldOf = (i) => (LEVELS[i] ? LEVELS[i].world : 1);
export const treatOf = (i) => TREATS[worldOf(i)] || 'cookie';
// v0.4 item 15: hard cap on ant types per battle (the queen counts). Checked by tests and the level report.
export const MAX_ANT_TYPES_PER_BATTLE = 5;
