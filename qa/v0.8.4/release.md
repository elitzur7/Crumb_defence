# Crumb Defense v0.8.4 (vc29)

Base: v0.8.3, vc28, commit 197b4b1. versionName 0.8.4, versionCode 29. No INTERNET permission added. No purchase code. No signing keys.

## Shipped

| Item | Result |
|---|---|
| PACE1 | `PACE = 1.5`. Labels stay 1/2/4, so the sim runs at 1.5x/3x/6x of vc28. Rescue wall window stays 3.0 s because `rescueScale = label * PACE`. Toasts, audio throttle, and UI tweens stay on the label. |
| ANT1 | `PLAY_ANT_SCALE = 0.62`. Worker long axis 27 px (ink was 46). Ratio to the 40 px tile is 0.675, inside 0.65–0.75. Hit radii are still the sim size. |
| ANT2 | Play-field body is a 3-stop tone ramp, gloss alpha 0.35, 1 px tone edge, 2 px legs, softer shadow. Ant Book, prep, and result still use the ink outline. |
| ANT3 | Shield Bearer draws a round violet shield. Other silhouette gear is the existing set, scaled with the body. |
| F-PP5 | Queen drip radius ×1.7, four frames, darker lip. Jam Queen uses the same shape in grape. |
| F9 | A10r was already measured in the contrast tool. It still runs. |
| F11 | L58 and L59 grids are mirrored. hpMul is 5.29 and 4.12. W7 copies were taken from the pre-mirror geometry so the calibrated table still applies. |
| G11 | Light pool sits on the treat, alpha 0.06, radius 22% of the short side. |
| G12 / J14 | Upgrade marks are up to five stars above the tower. The newest star eases from 1.6 to 1 in 120 ms. Level 6 adds a crown dot. |
| G15 | Flyers get a 1 px white rim on the head. |
| M7h-fix | Static emits `{ type: 'special', sp: 'static', x, y, tx, ty }` on the extra jump. Discrete armored hits emit `clang` with `armor` and `armorBlocked`. |
| J17 | Result stars land 0.35 s apart (C, E, G). Reduced motion skips the pop and keeps the notes. |
| U16 | W7 tips are flavour lines, 8 words or fewer, and fail `tipLint` if they use an advice verb without `HINT_OK`. |
| QA9 | Scaffold check is green on W1–W7. Deleting the L61 tip fails it. |
| W7 | Jelly Jamboree, L61–L70, coinMul 2.25, stars 35/170, Shield Bearer aura, Jam Queen (Worker then Drone every 14 s). |

## Win rates (540 battles, bot proxy)

Profile is `prof-w6` remapped onto the matching slot. Tolerances are the plan's.

| L | hpMul | win % | target | tol | in band | slope |
|---|---|---|---|---|---|---|
| 61 | 6.00 | 100 | 100 | 5 | yes | |
| 62 | 7.40 | 100 | 100 | 5 | yes | |
| 63 | 9.60 | 96.3 | 91.5 | 5 | yes | |
| 64 | 12.00 | 92.2 | 93.5 | 5 | yes | |
| 65 | 5.42 | 87.2 | 87 | 7 | yes | 11.3 |
| 66 | 9.50 | 97.0 | 93 | 5 | yes | |
| 67 | 4.68 | 87.4 | 84 | 5 | yes | 22.8 |
| 68 | 7.05 | 85.0 | 84 | 5 | yes | 20.0 |
| 69 | 3.99 | 93.7 | 88 | 7 | yes | 20.0 |
| 70 | 1.64 | 58.1 | 58.5 | 5 | yes | 14.6 |

L67 and L68 are not the plan's 4.25 and 5.51. Those hp values, after swapping Drone for Flyer so the levels stay inside the strict rarity rule (two commons, at most two rares), won at 96.5% and 97.4%. The shipped hpMul values bring them back inside the win-rate band. Slopes on L65, L67, L68, L69, and L70 are all at most 40.

L61–L66 and L69–L70 match the plan's simulated win percents on this profile (L66 prints as 97, the plan's 97.0).

## Cut

Not in this build, in the plan's cut order: G17 (map/title scene beyond the grape nodes and one soft map walker), J7 (screen wipe), G20 (Colony Flow contact sheet — the reference PNGs were not in the workspace after the reset; the before/after ant sheet is `qa/v0.8.4/ants-before-after.png`), U13 (text-size setting), J20 (wing-buzz loop and queen stings; the result-star notes did ship), G14 (per-ant size and hue jitter), EC11 (cabinet confirm sheet).

EC12 is the formula table in `economy.md` (W7 2.25 / 35 / 170). A full replay-coin sim was not re-run.

## Gates

| Gate | Result |
|---|---|
| `npm test` | 439 pass, 0 fail, 0 skipped |
| Pace | label 1x wall/sim = 1/1.5; rescue window 3.0 s at labels 1, 2, and 4; cookie pause stays 0.5 sim-seconds; advanceFrame matches `Battle.update` on the sample |
| Ant bbox | worker play 27 px, tile 40, ratio 0.675 |
| W7 win rates | 10/10 inside tolerance; five slopes ≤ 40 |
| R3b L38 at label 4x | **fail** (p95 210.7 ms, p50 1.4 ms). Follow-up recorded above. |
| Contrast / A10r suite | not re-run in a browser pass this build; the unit suite and the existing contrast tool are unchanged in their floors |
| Android debug APK | not compiled. This machine has no Android SDK. `versionCode` 29 and `versionName` 0.8.4 are set. The web bundle builds (`npm run build`). Manifest still has no INTERNET permission. No signing keys were added. |
