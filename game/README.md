# Crumb Defense v0.4.0 (prototype)

A cute, offline ant tower-defense game for Android phones (portrait). Ants march from their nest toward a cookie on a kitchen counter. You stop them with towers and traps.

- Engine: a hand-made HTML5 canvas engine in plain JavaScript (ES modules), bundled with esbuild.
- Art: all procedural canvas drawing (`src/art.js`). No image, font or audio files, and no third-party assets.
- Sound: tiny WebAudio synth blips (`src/audio.js`), with a mute toggle on the map screen.
- Android: Capacitor 8 wrapper (`android/`). It requests **no permissions** (not even INTERNET). The page CSP also sets `connect-src 'none'`.
- No ads, analytics, network calls or monetization. The save lives in `localStorage` (`crumbdefense.save.v1`).

## Layout
| Path | What |
|---|---|
| `src/config.js` | **All balance numbers**: towers, ants, crumbs, card costs, bonuses, coins, shop prices, merge table, maps, levels |
| `src/sim.js` | Deterministic battle simulation (no DOM). Used by the game, the tests and the bot |
| `src/meta.js` | Coins, card copies/levels, merge, shop, unlocks, save/load |
| `src/bot.js` | Simple "smart" and "random" bots for headless level checks |
| `src/game.js` | Screens, touch input, rendering, effects |
| `src/art.js` | Procedural art (ants with gear, towers, treats + faces, nest, kitchen counters, calendar boxes, map markers) |
| `src/treat.js` | v0.4: the treat's animated bite reactions (rules shared by every world's treat) |
| `src/calendar.js` | Reward Calendar rules (pure, clock passed in) |
| `tests/logic.test.js`, `tests/regress.test.js` | Unit + audit regression tests (`npm test`) |
| `tools/regress-ui.mjs` | UI regression checks in headless Chrome (`npm run test:ui`) |
| `src/fx.js` | Floating-text merge/throttle helper |
| `tools/sim-levels.mjs` | Headless bot run over all 10 levels (`npm run sim`) |
| `tools/screens.mjs` | Headless Chrome load + touch-driven smoke test + screenshots (`npm run screens`) |
| `tools/icons.mjs` | Renders the launcher icons and splash from the game art |

## Build
```bash
npm install
npm run build            # -> www/ (production, packaged in the APK) + www-test/ (same game + window.__game test hook)
npm test                 # unit + regression tests (logic)
npm run test:ui          # touch-driven UI regression checks on 320x568 ... 412x915 (uses www-test/ and www/)
npm run sim              # bots play every level (exit code 1 if a level is unwinnable or difficulty doesn't rise)
npm run screens          # headless Chrome check, screenshots -> /workspace/ant-td/screens
# Android (Capacitor CLI needs Node >= 22; here: ~/node22/bin)
PATH=~/node22/bin:$PATH npm run android:sync   # cap sync + strips Cordova's <access origin="*"> from config.xml
cd android && ANDROID_HOME=~/android-sdk JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64 ./gradlew assembleRelease
# -> android/app/build/outputs/apk/release/app-release.apk (signed with /workspace/ant-td/keys/, see below)
```
To try it in a desktop browser: `npm run build && npm run serve`, then open http://127.0.0.1:8765/ in phone-emulation mode.

## How to tweak balance (everything is in `src/config.js`)
After any change, run `npm test && npm run sim`. The sim table shows win rates and food left for each level.
- **Battle rules (`BATTLE`)**
  - `foodHP` (100)
  - `carryBack`: thieves carry food home, and killing a carrier returns it. Set it to `false` and food is lost the moment an ant reaches the cookie.
  - `startCrumbs` (0), `firstCardCost` (0) and `cardCostStep` (5): the Nth card costs `first + N*step`, so 0, 5, 10, 15…
  - `rerollCost`, `maxInBattleLevel` (3), `waveGap`, `firstWaveDelay`, `earlyCallBonusPerSec` (bonus crumbs for calling a wave early)
  - `maxBonusUses` (2), `bonusTypesToBring` (2)
  - `guaranteeDamageOpening`: the opening hand always contains a damage tower, so the free first card can earn crumbs
- **Stars (`STARS`)**: thresholds by % of food left (3★ ≥ 90, 2★ ≥ 50, 1★ > 0).
- **Towers (`TOWERS`)**: damage, `dps`, `rate` (shots/s), `range` (px; 1 tile = 40), `targets` (`ground`/`air`/`both`), `place` (`side`/`path`), slow, push, radius and so on.
- **In-battle level multipliers (`IN_BATTLE_LEVEL`)**: what a duplicate card adds (damage/rate/range/size per level 1-3).
- **Out-of-battle card level bonus (`CARD_LEVEL_BONUS`)**: +% per card level L1..L10.
- **Ants (`ANTS`)**: hp, speed, armor, steal (food taken), weight (fan push), `slowResist`, `gasImmune`, `flying`, and queen `spawn`.
- **Crumbs per kill**: `crumbsFor()` makes a worker worth 1 and other ants proportional to their power (HP × armor/trait factor × √speed). To force a value, add `crumbs: N` to an ant.
- **Bonuses (`BONUSES`)**: bomb damage/radius, plane damage, freezer time, sugar-decoy time.
- **Coins and shop (`ECONOMY`)**: win/loss coins, first-clear bonus, starting coins and bonus stock, shop prices.
- **Merge (`MERGE_TABLES`, `ACTIVE_MERGE_TABLE`)**: `totalCopies[L]` is the total copies needed to reach level L, and `coinCost[L]` is the coin cost of that merge. The default `yair` table is 3 copies = L1, 2×Ln = Ln+1, up to L10 (1,536 copies). Switch to `'flattened'` or add your own row of 11 numbers.
- **Maps (`MAPS`)**: trail waypoints in tile coordinates on a 10×12 grid (first point = nest, last point = cookie).
- **Levels (`LEVELS`)**: `waveCount`, `hpMul` (main difficulty knob), `base` + `growth` (ants per wave), `interval`, `mix` (ant weights, `from` = first wave a type appears), `special` (extra groups, e.g. the queen in wave 15 of level 10). You can also write a level's waves out by hand with `waves: [[{type,count,interval}], ...]`.
- **Cards**: `STARTER_CARDS` are owned from the start. Since v0.3 no card unlocks by clearing a level. You get new ones in the Shop (`ECONOMY.shop.cardUnlock` coins) or as prizes (Perfect Cookie, Reward Calendar). `SIM_ASSUMED_CARDS` is only the order the balance bot assumes you collected them in.
- **Reward Calendar (`CALENDAR`)**: the weekly tile prizes (`week`), coins by streak (`coinsByStreak`), diamonds by streak week (`diamondsByStreakWeek`), streak milestones (`monthMilestones`), and the reset rule (`monthlyReset.rule`: `'missedDay'` (default since vc7) or the legacy `'hours24'`).
- **Diamonds (`ECONOMY.diamonds`)**: `crumbPack`, `crumbPriceStart`/`crumbPriceMul` (10, 20, 40...), `boosterPriceStart`/`boosterPriceStep` (v0.4: 20 / 0 = a fixed 20 in battle), and `perBooster`. Shop boosters: `ECONOMY.shop.boosterDiamonds` (15).
- **Ant sizes (`ANT_SIZES`)**: small / regular / large / queen. `npm run antsizes` measures the drawn areas. **Queens (`QUEENS`, `QUEEN_TRAITS`, `queenTake`)**: take = 50 + trait modifiers (fast -10, flying -15, slow 0/+5/+10 ...).
- **Treat reactions (`UI.treatReact`)**: how long a bite reaction plays, the "oy oy oy" rush window/bites, and the big-bite threshold (crying). `TREATS` maps worlds to treat bodies.

## Currencies
- **Crumbs**: battle only. You earn them from kills (plus a little extra for calling a wave early) and spend them on cards and redraws. Every battle starts at 0, and leftover crumbs are thrown away at the end.
- **Coins**: persistent and start at 0. You earn them after each battle and from the calendar, and spend them in the Shop (new towers, card copies, packs, boosters) and on Merge.
- **Diamonds** (v0.3): persistent and start at 0. They come only from the Reward Calendar; there is no real money. In battle (where the HUD now shows them) you spend them on 50 crumbs (the crumb counter's **+**; the price doubles per purchase and resets every battle) or on a booster you have 0 of (a fixed 20). In the Shop a booster costs a fixed 15 diamonds.

## How to play
- Before a battle, pick a 5-card deck and 2 booster types. The game warns you if flyers are coming and your deck has no anti-air.
- In battle, 3 random cards from your deck are shown. Tap a card and then a tile, or drag the card onto the map.
  - Towers go beside the trail. Glue, Roasted Lava, Perfume and the E-Gate go on it.
  - Dropping a duplicate card on the same tower upgrades it, up to level 3.
- Tap a placed tower to see its range and info.
- **Next wave** calls the next wave early for extra crumbs. **Redraw** swaps all 3 cards for crumbs. `>`/`>>` changes game speed.
- The Android back button pauses or resumes a battle and leaves other screens.

## What's new in v0.4.0
Full report: `../JOB-v0.4.0.md`. Source of truth: `../FEEDBACK-v0.3.0.md` (items 1-20; 4 and 8 dropped) + `../CHANGELOG-next-draft.md`.
- **Shorter, easier battles.** 30-50% fewer waves in every stage and about half the ants (re-tuned with the bots).
- **Ants.** Four sizes: small, regular, large (shrunk, waddles), queen. Armored / gas-mask / winged ants are regular size. Late stages add the Sprint Knight (fast, armored, sneakers) and the Heavy Knight (large, armored). At most 5 ant types per battle.
- **Queen.** Takes 50 (half the cookie), so a queen that reaches the cookie makes 3 stars impossible in that battle. Future queens: `queenTake(traits)`.
- **Towers.** Base range 1 tile (Laser 2, Bug Zapper 1.5; marble unchanged). New tower **Roasted Lava** (on the trail: slight slow + damage while ants cross). No direction arrows; the fan shows its area circle.
- **Diamonds and boosters.** Diamonds in the battle HUD. Boosters cost a fixed 15 diamonds in the Shop and 20 in battle.
- **Cards button** blinks for 5 s twice ever: the first time you can afford a card, and the first time after a loss.
- **Reward Calendar.** Bigger, colourful monthly boxes (day 30 the biggest; gives a level-3 card), a 3x3 weekly grid with a wide day-7 tile (level-2 card + 5 diamonds), and a square Calendar badge.
- **Level map.** A winding road and 3D stage markers with a small per-stage ornament.
- **Treat faces.** The cookie reacts to bites with animated faces: surprised, "oy oy oy!", sad, crying. Any future treat uses the same faces.
- **Release.** Signed with the same key as v0.3.0: versionCode 8, versionName 0.4.0, installs over v0.3.0 and keeps the save.

## What's new in v0.3.0
Full spec and defaults: `../JOB-v0.3.0.md`. The source of truth is `../FEEDBACK-v0.2.0.md` (items 1-14, all except item 7 = FTUE).
- **Aim at the centre.** The fan and the marble always aim at the board centre (`BATTLE.aim`), at the true angle, fixed when you place them. There is no Turn button.
- **Reward Calendar.** It pops up once a day on entering the game, and there is also a Calendar button on the map.
  - The monthly bar is a 30-day streak. It restarts at 1 only when a whole local calendar day passed without collecting (vc7).
  - The 7 weekly tiles are the player's own cycle. Each day you open the game moves one tile on, and unclaimed tiles are missed. Coin tiles pay 5, 10, 15, 20 in order. See `src/calendar.js` for the formulas.
- **Diamonds**, and **boosters** (renamed from "bonuses"): Bomb, Crop Duster, Freezer, Sugar Cube. Stock starts at 0. Clearing level 1 the first time gives one Bomb. No award ever gives more than one booster.
- **Cards** come from the Shop or prizes, not from clearing levels.
- **Art.** Softer shading and shadows, more detail on the towers, a new Laser turret, and 9 cookie moods plus an "ouch".
- **Readability.** Tower info text is larger, regular weight, and dark on light.
- **Release.** A signed release APK (versionCode 6).

### Release signing (back up the key!)
`android/app/build.gradle` reads `/workspace/ant-td/keys/keystore.properties`, which points at `crumbdefense-release.jks`. Every future update has to be signed with this same key, or Android refuses to install it over the old one, so keep a safe offline copy of the whole `keys/` folder. Earlier builds (v0.1-v0.2.0) were debug-signed, so you have to uninstall them once before installing v0.3.0 (this erases the local save).

## What's new in v0.2.0
Full spec: `../JOB-v0.2.0.md`.
- **Per-tower mechanics.** The fan pushes ants along its arrow; aimed the wrong way it speeds them up. The marble rolls straight until it hits a trail wall or the edge, and aimed badly it sticks at once. Boombox staggers, glue sticks once, perfume charms, the laser heats up, the zapper chains, and the gecko chews.
- **Aiming.** Directional towers start facing upstream. Tap the tower, then **Turn**. Aim arrows show only while you're placing or have the tower selected (`UI.showAimOnlyWhenRelevant`).
- **Tower info and upgrades.** Tap a tower to see Power/Rate/Range. Dropping the same card upgrades it, and the panel shows each stat as before → after. Not every upgrade raises every stat.
- **Food.** HP drops the moment a piece is taken. Killing a carrier returns part of it, set by `BATTLE.foodReturn`:
  - `mode:'fixed'` (default) returns `fixed` (0.4) of the load: 5 → 2.
  - `mode:'distance'` returns between `distMax` (killed near the cookie) and `distMin` (near the nest).
  - `rounding:'exact'|'floor'|'round'` sets rounding.
- **Rewards** (`ECONOMY`):
  - Win: `winBase + coinsPerFood*foodLeft + coinsPerKillWin*kills + coinsPerLevel*level` (+ first-clear bonus).
  - Loss: `coinsPerKillLoss*kills`, capped at `lossCap`, with no cards or prizes.
  - Perfect level (100 food, nothing stolen): a **Perfect Cookie!** celebration and one prize from `perfectPrizes`.
- **Maps** are data in `src/maps.js`: a 10x12 grid where `N` = nest, `F` = cookie, `#` = trail and `+` = crossing. Props are `M` mug, `B` sugar bowl, `J` jam, `S` spoon and `P` plant, and props block building. Maps can have several nests or forks. Assign a map with `LEVELS[i].map`.

## Tools
- `npm test`: logic + regression + v0.2.0 + v0.3.0 + v0.4.0 tests (node:test).
- `npm run test:ui`: touch-driven UI checks on 4 phone viewports, plus a production build check.
- `npm run sim`: smart-bot balance sweep over all levels.
- `npm run towers [-- cardLevel]`: prints every tower's effective L1–L3 stats from `config.js TOWERS`.
- `npm run maps`: validates every map and renders previews to `screens/v0.4.0/maps/`.
- `npm run screens` / `npm run gallery`: screenshots and the tower / cookie-face / prop gallery (-> `screens/v0.4.0/`).
- `npm run shots:v040`: the v0.4 key visuals (calendar, map, treat faces, lava, fan circle). `npm run antsizes`: ant size measurements + line-up. `npm run waves`: per-stage waves/ants before (v0.3 backup) vs now.
