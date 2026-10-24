# Crumb Defense: Tower & Obstacle Spec (from the code)

Written 22.10.2026 from `game/src/sim.js` (behavior), `game/src/config.js` (texts, `TOWER_TEXT`) and
`tuning/tuning.json` (all numbers; `config.js` line 1 imports `../../tuning/tuning.json`, i.e. `/workspace/ant-td/tuning/tuning.json`).
No game files were changed. 1 tile = 40 px. The simulation runs at a fixed step of 1/60 s (`game.js` `STEP = 1 / 60`).

## 0. Rules that apply to every tower

* **Armor** (`applyArmor`, sim.js:16): `real = max(1, dmg - armor)` for each damage call, unless the call passes `ignoreArmor`.
  The minimum is 1 per hit. Ants that hit armor: Slingshot, Marble, Gecko, Laser, Zapper. Spray, Boombox, Perfume, Lava and Gate ignore armor.
  Armor values: worker/small/flyer 0, gasmask 1, big 2, queen2 3, sprinter 4, queen 4, armored (Knight) 6, heavy 6.
* **Gas mask** (`damage`, sim.js:320): only damage that has `gas: true` returns 0 against `gasImmune` ants. Only Spray clouds have it.
  No other tower cares about gas masks.
* **Ground vs air** (`canHit`): side towers filter with `targets` ('ground' | 'air' | 'both'). The Spray cloud, Marble and every
  on-path object skip `a.flying` on their own.
* **Range** = Euclidean distance from the tower **centre** to the ant's centre point (the ant's body size is ignored, except for the Marble). Range check is `<= range`.
* **Fire cadence** (side towers): `cd` starts at 0.3 s. Each frame `cd -= dt`. When `cd <= 0` AND at least one valid ant is in range, the tower acts and
  sets `cd = 1/rate`. It does not add to `cd`, so the overshoot is lost and the real period rounds up to whole 1/60 s frames.
  Effective rates (L1 / L3, card L1): Slingshot 1.091 / 1.429, Spray 0.420 / 0.545, Boombox 0.750 / 0.896, Marble 0.160 / 0.208,
  Fan 0.359 / 0.448, Gecko 0.420, Laser **3.158 / 3.750** (nominal 3.2 / 3.84), Zapper 1.500 / 1.765, Gate **2.727 / 3.529** (nominal 2.85 / 3.705).
* **Targeting "threat"** (`threat`, sim.js:342) is used by Slingshot, Spray, Laser and Zapper (first target):
  `threat = d` while walking to the cookie, and `threat = 2*routeLength - d` while carrying food home.
  So **every carrier going home outranks every ant walking in**. Among carriers, the one **closest to its nest** wins.
  Among walkers, the one furthest along its own route wins. On maps with more than one route, `d` is compared across routes, not the real distance to the cookie.
* **Slow**: `a.slow` is reset to 0 every frame, then set to the **max** of all auras (slows do not stack). It is then reduced by the ant's `slowResist`
  (queen 0.5, queen2 0.4). `slow` values and Glue's power are capped at `SLOW_CAP = 0.85`.
* **Stun** (`stunT`): speed 0 while it lasts. A new stun uses `max(current, new)`.
* **In-battle upgrades** (drop a duplicate card, up to L3): `battleUpgrades[0]` applies at L2, and `[0]` and `[1]` together at L3. Each is a multiplier.
* **Card levels** (L2..L10): step `i` applies when `cardLevel >= i+2`. `range` steps **add tiles**. Every other key multiplies by `(1+x)`.
  Card steps apply first. The in-battle multipliers apply on top of them (`towerStat`). `chain` is rounded.
  Keys not listed in either table never change: projSpeed, cloudTime, rollSpeed, maxBalls, chainRange, chainFalloff, heatPerHit.

## 1. Summary table (base values = in-battle L1, card L1)

| Tower | Damage / power (L1 -> L2 -> L3) | Single vs area | Hits | Armor / gas mask | Targeting | Rate /s (L1->L3) | Range tiles (L1->L3) | Special |
|---|---|---|---|---|---|---|---|---|
| Slingshot | 6 -> 8.4 -> 8.4 dmg | **Single** (homing shot) | ground | armor applies (vs Knight: 1) | max threat | 1.1 -> 1.43 | 1.5 -> 1.65 | projectile 380 px/s |
| Bug Spray | 6 -> 8.1 -> 9.315 dmg/s | **Area**: every ground ant in the cloud | ground | ignores armor; gas mask immune (0) | cloud dropped on the max-threat ant | 0.42 -> 0.546 clouds | 1.5 (never changes in battle) | cloud r 42 -> 50.4 px, lasts 2.6 s, clouds stack |
| Boombox | 4 -> 5.6 -> 5.6 dmg | **Area**: ALL ground ants in range | ground | ignores armor | none (all) | 0.75 -> 0.9 | 1.5 -> 1.725 | stagger 0.18 -> 0.234 s (boss x0.3) |
| Marble | 16 -> 22.4 -> 25.76 dmg | **Line**: each ground ant on the roll, once | ground | armor applies | fires if a ground ant is within 24 px of the roll line | 0.16 -> 0.208 (max 1 marble alive) | n/a; roll = run*40 - min(r,20) px | r 13 -> 15.6 px, 230 px/s |
| Desk Fan | 50 -> 65 -> 65 px push (no damage) | **Area**: ALL ants in range | **both** | n/a; push x weight (queens 0 = immune) | none (all) | 0.36 -> 0.45 | 1.5 -> 1.65 | push x weight x (wind·trail) |
| Perfume | 2.5 -> 3.75 -> 3.75 dmg/s | **Area**: ALL ground ants in the circle | ground | ignores armor | none | continuous | circle r 1.0 -> 1.15 -> 1.15 | slow 35% -> 43.75%; charm 1.6 -> 2.24 s, once per ant, not bosses |
| Gecko | 38 -> 53.2 -> 53.2 dmg | **Single** | ground | armor applies | **highest current HP** | 0.42 (no battle upgrade) | 1.5 -> 1.65 | chews 1.4 -> 0.84 s after a kill |
| Laser | 4.6 -> 6.21 -> 6.21 dmg x heat | **Single** | **both** | armor applies after heat (vs Knight 1 -> 3.2) | max threat | 3.2 -> 3.84 (real 3.158 -> 3.75) | 2.5 (never changes in battle) | +12%/consecutive hit, max +100% -> +150% |
| Zapper | 15 -> 20.25 -> 20.25 dmg | **Chain**: 1 + 2 jumps (L3: 1 + 3) | **air only** | armor applies on each jump | max-threat flyer, then nearest flyer | 1.5 -> 1.8 | 2.0 (never changes in battle) | jump range 75 px, x0.6 per jump |
| Glue | 55% -> 63.25% -> 63.25% slow (no dmg) | **Area**: ALL ground ants in the circle | ground | n/a | none | continuous | circle r 1.0 -> 1.2 -> 1.32 | stick (stun) 0.5 -> 1.0 s on first touch |
| E-Gate | 3 -> 4.2 -> 4.2 dmg per zap | **Area**: ALL ground ants in the circle | ground | ignores armor | none | 2.85 -> 3.705 (real 2.727 -> 3.529) | circle r 1.0 -> 1.0 -> 1.2 | - |
| Lava | 4 -> 5.6 -> 5.6 dmg/s | **Area**: ALL ground ants in the circle | ground | ignores armor | none | continuous | circle r 1.0 -> 1.0 -> 1.2 | slow 20% -> 25% |

Card L10 (in-battle L1 / L3): Slingshot power 8.944/12.52, rate 1.331/1.730, range 2.3/2.53 t · Spray 8.944/13.89 dps, rate 0.549/0.714, range 2.05 t ·
Boombox 5.421/7.589, rate 0.980/1.176, range 2.25/2.5875 t · Marble 23.85/38.40, rate 0.23/0.299, r 15.73/18.88 px · Fan 67.76/88.09, rate 0.479/0.599, range 2.25/2.475 t ·
Perfume 3.727/5.590 dps, range 1.75/2.0125 t, charm 1.936/2.710 s · Gecko 63.45/88.82, rate 0.499, range 2.1/2.31 t · Laser 6.857/9.257, rate 4.600/5.520, range 2.9 t ·
Zapper 22.36/30.19, rate 1.782/2.138, range 2.75 t · Glue 72.75%/83.66%, range 1.75/2.31 t, stick 0.661/1.3225 s · Gate 4.472/6.261, rate 3.724/4.842, range 1.55/1.86 t ·
Lava 6.559/9.183 dps, range 1.55/1.86 t, slow 24.2%/30.25%.

## 2. On-path items: hit area (glue, lava, Perfume, E-Gate)

**Code today** (sim.js:543-570): each on-path object snaps to the nearest trail point to its tile centre (`px,py`). For a trail tile that is the tile centre.
It then affects every non-flying ant whose centre is within `hypot(a.x-px, a.y-py) <= range`. That area is a **circle of radius 1 tile (40 px) at L1**, 2 tiles across.
Ants walk on the trail centre line, so on a straight trail the zone is **80 px = 2 tiles of trail**: the item's own tile plus half of each neighbouring tile
(it runs from the centre of the previous tile to the centre of the next).
At a corner it is still 80 px of trail, going round the bend. Trail of another route or a hairpin that runs alongside (an adjacent trail tile, 40 px away)
sits exactly on the edge and also counts (`<=`). Diagonal neighbours (56.6 px) are outside at L1.
Upgrades make the circle bigger: Glue 48 px (L2) and 52.8 px (L3). Gate and Lava 48 px (L3). Perfume 46 px (L2/L3). Each card range step adds 8 px (+0.2 t) or 6 px (+0.15 t).
Radius at card L10: Glue/Perfume 70 px, Gate/Lava 62 px.

**Design intent (Yair 22.10):** ALL flat on-path items (Glue, Lava, Pheromone Perfume, Electric Gate) cover **only the single square tile they sit on**.
**Code does NOT match:** today the area is a circle (radius 1 tile, growing with upgrades), about 2 tiles of trail long and twice the intended length.
A square-tile check would be `floor(a.x/40)==c && floor(a.y/40)==r`. That would also need a new meaning for their `range` upgrade steps, which today grow the circle.

## 3. Per tower

### Slingshot (side, ground)
* One homing pebble at the **max-threat** ground ant in 1.5 t. Speed 380 px/s. Damage is applied when it arrives. It cannot miss. If the target dies first, the pebble is wasted (no retarget).
* 6 dmg, armor applies: Big 4, Gasmask 5, Sprinter 2, Knight/Heavy **1**.
* In battle: L2 power x1.4. L3 rate x1.3, range x1.1.
* Card: L2 range +0.2t, L3 power +10%, L4 range +0.2t, L5 rate +10%, L6 power +10%, L7 power +12%, L8 rate +10%, L9 range +0.2t, L10 range +0.2t + power +10%.
* Text check: "Pings the ant closest to the cookie / aims at the leader". **Mismatch**: carriers going home always win, and among them the one *closest to its nest* (furthest from the cookie).

### Bug Spray (side, ground)
* Picks the **max-threat** ground ant in 1.5 t and drops a **stationary** cloud on its current spot. The cloud has radius 42 px (1.05 t) and lasts 2.6 s.
  It does `power*dt` to **every** non-flying ant inside, every frame (gas, ignores armor, gasmask = 0). One ant in a full cloud takes up to 6 x 2.6 = 15.6.
  New clouds come every 2.38 s, so they overlap, and overlapping clouds stack.
* In battle: L2 power x1.35, cloudRadius x1.2. L3 rate x1.3, power x1.15.
* Card: L2 power +10%, L3 rate +8%, L4 range +0.2t, L5 power +12%, L6 range +0.15t, L7 rate +10%, L8 power +10%, L9 range +0.2t, L10 power +10% + rate +10%.
  Range steps change only how far it can aim. Cloud size never changes with card level.
* Text matches ("ignores armor, not gas masks").

### Boombox (`sound`, side, ground)
* Every pulse hits **ALL** ground ants in 1.5 t with 4 dmg (ignores armor). Survivors get stun `max(stunT, stagger)`, where stagger is 0.18 s (bosses x0.3 = 0.054 s).
  It pulses only if an ant is in range.
* In battle: L2 power x1.4. L3 range x1.15, rate x1.2, stagger x1.3.
* Card: L2 rate +10%, L3 range +0.2t, L4 power +10%, L5 power +10%, L6 range +0.2t, L7 rate +8%, L8 range +0.15t, L9 power +12%, L10 rate +10% + range +0.2t.
* Text: "Hits all ants around it". Small point: it hits ground ants only, never flyers.

### Marble Roller (`ball`, side next to the trail, ground)
* Direction (`trailDirection`): one of the 4 orthogonal trail cells next to the tower. The marble moves in the direction tower -> that cell.
  `run` = 1 + how many more cells the trail continues straight **in that same direction**. Longest run wins, ties go to the higher cell, then the left one.
  Roll length = `run*40 - min(ballRadius, 20)` px from the tower/trail edge, at 230 px/s. Then the marble breaks (no extra damage).
* It fires only when `balls < maxBalls (1)` and a ground ant is within 24 px of the roll segment. Cooldown is 1/0.16 = 6.25 s from launch.
* Each ground ant within `ballRadius + 8*antSize` px (13 + 8 for a worker) is hit **once per marble**: 16 dmg, armor applies (Knight 10).
* In battle: L2 power x1.4, ballRadius x1.2. L3 rate x1.3, power x1.15. The roll is recalculated when it upgrades.
* Card: L2 power +10%, L3 rate +10%, L4 ballRadius +10%, L5 power +12%, L6 rate +8%, L7 power +10%, L8 ballRadius +10%, L9 rate +10%, L10 power +10% + rate +10%.
* Text check: "rolls down the straight trail beside it". **Behavior note**: the marble only rolls *along* the trail when the tower sits at the end of a straight stretch
  that points away from it (e.g. beside a corner). Beside an ordinary parallel stretch, run = 1: it crosses the trail sideways for 27 px and hits only ants at that spot.

### Desk Fan (side, both)
* Same direction rule as the Marble. With no trail cell next to it, it does nothing (re-checks every 0.5 s). Each gust affects **ALL** ants (ground and air) within 1.5 t of the fan centre:
  `d += push * weight * dot`, where `dot = wind · trail direction at the ant` (+1 = towards the cookie). The result is clamped to [0, length-0.5]. Damage is 0.
* push 50 px (1.25 t) per gust. Weights: small 1.2, worker/gasmask 1, flyer 1.3, sprinter 0.8, armored 0.6, big 0.5, heavy 0.35, queens 0 (immune).
* In battle: L2 power x1.3. L3 rate x1.25, range x1.1.
* Card: L2 range +0.2t, L3 rate +10%, L4 power +10%, L5 range +0.2t, L6 range +0.15t, L7 power +10%, L8 rate +10%, L9 power +12%, L10 range +0.2t + rate +10%.
* **Behavior notes / mismatch**: (1) Because the wind is tower -> adjacent cell, ants on a stretch running *across* that direction get `dot = 0`, so no push.
  Only trail that runs along the wind is affected. (2) The push follows the trail direction, not the ant's: wind towards the nest pushes walkers back
  **and pushes carriers home faster**. Wind towards the cookie speeds walkers up. Nothing in the text warns about this.

### Pheromone Perfume (on path, ground)
* Area: circle r = 1 t (see §2). For every ground ant inside, every frame: slow `max(slow, 0.35)`, drain 2.5/s (ignores armor).
  **Charm**: once per ant per perfume, only if the ant is not a boss, is walking to the cookie (`state 'go'`) and is on a route that passes the perfume (within 24 px).
  For `charmTime` = 1.6 s it walks toward the perfume's point on its route (still slowed) and then waits there. Bosses get the slow and drain, never the charm.
* In battle: L2 power x1.5, range x1.15. L3 charmTime x1.4, slow x1.25.
* Card: L2 power +12%, L3 range +0.2t, L4 charmTime +10%, L5 power +10%, L6 range +0.15t, L7 power +10%, L8 charmTime +10%, L9 range +0.2t, L10 power +10% + range +0.2t.
* Text check: "Lures ants back to it". **Mismatch**: an ant gets charmed as it enters the circle, about 40 px *before* the centre. So it is pulled **forward** to the centre
  and held there for whatever is left of the 1.6 s. It walks back only if it was already past the centre when charmed (e.g. pushed by a fan).
* **Design intent (Yair 22.10):** it covers only its own square tile. **Code today:** circle r 40 px (46 px at L2/L3), about 2 tiles of trail. **Does not match.**

### Gecko (`lizard`, side, ground)
* Bites the ground ant in 1.5 t with the **highest current HP** (`a.hp`, not maxHp; ignores armor/threat; first in the list on a tie). 38 dmg, armor applies (Knight 32).
* If the bite kills, `chew = chewTime` (1.4 s). While chewing, the cooldown is **frozen**, so after a kill the next bite comes chew + 1/rate later (1.4 + 2.38 = 3.78 s).
* In battle: L2 power x1.4. L3 chewTime x0.6 (0.84 s), range x1.1. Rate has no in-battle upgrade.
* Card: L2 power +12%, L3 rate +8%, L4 range +0.2t, L5 power +10%, L6 range +0.2t, L7 rate +10%, L8 power +10%, L9 power +12%, L10 range +0.2t + power +10%. chewTime has no card step.
* Text "Bites the toughest ant" means highest current HP, not armor. Chew stacks on top of the cooldown (not described).

### Laser Pointer (side, both)
* Single target, max threat, ground or air, in 2.5 t. Heat: if the target is the same as last shot, `heat++`, otherwise heat resets to 0.
  Damage = `power * (1 + min(heatMax, heat*0.12))`, then armor. The +100% cap is reached on the 10th consecutive hit (heat 9). With L3's +150% cap it is the 14th hit.
* vs Knight/Heavy (armor 6): 1 dmg for hits 1-5 (heat 0-4, e.g. heat 4: 4.6 x 1.48 = 6.81 -> 0.81 -> 1). From heat 5: 1.36. Max 4.6 x 2 - 6 = 3.2 at L1.
* In battle: L2 power x1.35. L3 rate x1.2, heatMax x1.5.
* Card: L2 rate +8%, L3 power +10%, L4 range +0.2t, L5 rate +10%, L6 power +10%, L7 range +0.2t, L8 power +12%, L9 rate +10%, L10 power +10% + rate +10%.
* Text "max +100%": true at L1/L2. At L3 it is +150% (the text never changes).

### Bug Zapper (side, air only)
* First target: the max-threat **flyer** in 2 t. 15 dmg (armor applies). Then up to `chain` = 2 jumps: each goes to the nearest unhit living flyer within **75 px of the previous target**
  (not limited by tower range). Each jump does x0.6: 15 -> 9 -> 5.4. It stops early if no flyer is near enough.
* In battle: L2 power x1.35. L3 rate x1.2, chain x1.5 -> round(3) = 3 jumps.
* Card: L2 range +0.2t, L3 power +10%, L4 rate +10%, L5 range +0.2t, L6 power +12%, L7 rate +8%, L8 power +10%, L9 range +0.2t, L10 power +10% + range +0.15t.
* Text "chains to 2 more flyers (60% each jump)": correct at L1/L2. L3 does 3 jumps.

### Glue Puddle (on path, ground)
* Every ground ant in the circle: slow `max(slow, 0.55)` (capped 0.85), reduced by slowResist. **First touch** (once per ant per puddle): stun 0.5 s,
  x0.3 for bosses, x0.6 for large ants (size >= 1.12: big, heavy). No damage.
* In battle: L2 power x1.15, range x1.2. L3 stickTime x2, range x1.1.
* Card: L2 range +0.2t, L3 power +8%, L4 stickTime +15%, L5 range +0.15t, L6 power +8%, L7 range +0.2t, L8 stickTime +15%, L9 power +8%, L10 range +0.2t + power +5%.
* Text matches.
* **Design intent (Yair 22.10):** it covers only its own square tile. **Code today:** circle r 40 px (L1), 48 px (L2), 52.8 px (L3), about 2+ tiles of trail. **Does not match.**

### Electric Gate (on path, ground)
* A timer counts down every frame. When it reaches 0: **every** ground ant in the circle takes 3 dmg (ignores armor), then the timer goes back to 1/rate
  (overshoot lost, so a real 2.727/s at L1). It runs even when no ant is there.
* In battle: L2 power x1.4. L3 rate x1.3, range x1.2.
* Card: L2 rate +10%, L3 power +10%, L4 power +12%, L5 range +0.2t, L6 rate +8%, L7 power +10%, L8 range +0.15t, L9 rate +10%, L10 power +10% + range +0.2t.
* Text "Zaps everything between the poles". **Mismatch**: the zone is a circle, not the strip between the poles.
* **Design intent (Yair 22.10):** it covers only its own square tile. **Code today:** circle r 40 px (48 px at L3). **Does not match.**

### Roasted Lava (on path, ground)
* Every ground ant in the circle: slow `max(slow, 0.2)`, damage 4/s (`power*dt`, ignores armor).
* In battle: L2 power x1.4. L3 range x1.2, slow x1.25.
* Card: L2 power +10%, L3 range +0.2t, L4 power +10%, L5 slow +10%, L6 range +0.2t, L7 power +12%, L8 range +0.15t, L9 power +10%, L10 slow +10% + power +10%.
* Text matches.
* **Design intent (Yair 22.10):** it covers only its own square tile. **Code today:** circle r 40 px (48 px at L3). **Does not match.**

## 4. End-of-stage coins (meta.js `battleCoins` + `applyBattleResult`; ECONOMY in config.js)
* **Win**: `coins = 10 + round(foodLeft * 0.3) + round(kills * 0.15) + levelIndex * 3 + (firstClear ? 25 : 0)`.
  foodLeft = `battle.foodStored` (0..100). levelIndex is 0-based. kills = `stats.kills` (includes queen-spawned ants).
  firstClear = the level was not cleared before. Each part is rounded separately.
* **Loss**: `coins = min(15, floor(kills * 0.1))`.
* No time term today. Battle time is available as `battle.time` (seconds, sim-advanced, paused time not counted) if "+1 coin per 3 s survived"
  (`floor(time/3)`) is added later. **Not implemented.**
