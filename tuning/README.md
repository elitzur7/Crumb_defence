# Crumb Defense – tuning files (developer only, not in the app)

`tuning.json` is the **source of truth** for the game's numbers. The build bundles it
(`game/src/config.js` imports it), so any change takes effect on the next build. Nothing here is read or
editable inside the app.

| File | What it is |
|---|---|
| `tuning.json` | All tuning: towers (base stats, params, in-battle upgrades, card-level upgrades), ants, ant sizes, queen trait modifiers, worlds, levels, maps |
| `csv/*.csv` | A spreadsheet-friendly export of the same data (generated, see below) |
| `json2csv.mjs` | `tuning.json` → `csv/*.csv` |
| `csv2json.mjs` | `csv/*.csv` → `tuning.json` (validates first; writes nothing if something is wrong) |
| `tablelib.mjs` | Shared CSV helpers |

## Workflow

```bash
export PATH=~/node22/bin:$PATH
cd /workspace/ant-td
node tuning/json2csv.mjs          # refresh the CSVs from the JSON
# ... edit csv/*.csv in a spreadsheet (keep it as CSV, UTF-8) ...
node tuning/csv2json.mjs          # write the edits back into tuning.json
cd game && npm test && npm run build   # check, then build (Android: npm run android:sync, gradle assembleRelease)
node tools/winrates.mjs           # optional: bot win rates per level, card levels 1 / 5 / 10
```

From `game/`, you can also run `npm run tuning:csv`, `npm run tuning:json` and `npm run winrates`.

You can also edit `tuning.json` directly. If you do, run `json2csv` afterwards so the CSVs don't go stale.

## CSV rules

- Columns starting with `_`, and the whole of `card_levels_readonly.csv`, are **computed and read-only**.
  `csv2json` ignores them. Examples: `_waves`/`_ants` per level, `_queenTake` per ant, and stats per card level.
- An empty cell means the key is absent. `null` means null.
- Numbers, `true`/`false`, and `[...]`/`{...}` cells are read as JSON (e.g. a level's `mix`, a map's `path`).
  Everything else is read as text.
- `towers.csv` has the base stats plus per-tower parameters in `p.<name>` columns.
- `tower_upgrades.csv` lists in-battle levels 2–6 (v0.6: five upgrades, dropping the same card on a tower), as multipliers.
  Exception (Tractor): `liftSize` is **added** (+1 size class, max 3), and `rateIfMaxLift` multiplies the rate only when the
  card already lifts all three sizes (card L8+).
- `card_upgrades.csv` has one row per stat change for card levels 2–10:
  - `range` is added in **tiles** (1 tile = 40 px);
  - every other stat is a **fraction** (`0.1` = +10%);
  - Tractor `liftSize` is **added** (1 = small ants, 2 = + regular, 3 = + large; the queen is never lifted).
- v0.6: Glue, Perfume, E-Gate and Lava cover exactly their own tile; their `rangeTiles` (1) is not upgraded any more.
  - Two rows with the same tower and level mean a step that changes two stats.
- `levels.csv` is in play order:
  - levels 1–10 are world 1 (Cookie Kitchen); levels 11–20 are world 2 (Cake Castle);
  - `special` holds extra spawns per wave (e.g. the queen in wave 9).
- `worlds.csv` has the treat, the queen at level 10 and the unlock rule.
  World 2 needs every world-1 level won and at least 20 of its 30 stars (v0.6.2: was 25).

## Units

- `rangeTiles`: the radius from the tower centre, in tiles.
- `rate`: actions per second (`null` means always on).
- `speed`: px per second.
- A queen takes 50 from the treat, plus the sum of her trait modifiers (`queen_traits.csv`).

## Shop section (v0.6.2, JSON only)

`tuning.json` → `shop` is not exported to CSV; `csv2json` keeps it as it is in the JSON.
- `unlockPrice`: coins to unlock a locked tower in the Shop. The tiers are by base power: 100 Boombox, Perfume, Lava; 200 Gecko, E-Gate, Zapper; 400 Laser, Tractor. `unlockPriceDefault` is used for any tower that is not listed.
- `packNewTowerChance`: the chance that a card pack (5 cards) holds ONE new, locked tower card at L1 as one of its 5 cards. It only applies while some tower is still locked.
