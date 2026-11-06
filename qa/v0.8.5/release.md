# Crumb Defense v0.8.5 (vc30)

Base: v0.8.4, vc29, commit 1b06ec6, tag v0.8.4. versionName 0.8.5, versionCode 30. No INTERNET permission. No purchase code. No signing keys.

## Shipped

| Item | Result |
|---|---|
| PACE2 | `PACE = 1.35`. Labels stay 1/2/4, so the sim runs at 1.35× / 2.7× / 5.4× of vc28. Rescue wall window stays 3.0 s (`rescueScale = label * PACE`). Audio and toasts stay on the label. |
| ANT4 | `PLAY_ANT_SCALE = 0.72`. Worker long axis 31 px. Ratio to the 40 px tile is 0.775, inside 0.75–0.82. Hit radii unchanged. |
| ANT5a | Vivid `ANT_COL` hexes from the plan, including Sugar Cube `#efe6ff` and Frosting Queen `#7ec8e8`. |
| ANT5b | Play segments are radial volumes (highlight, body, shade, terminator), specular alpha 0.55, tone edge 0.22, six legs at 2.2 px, antennae 1.5 px with a 1.8 px ball. No ink in play. Sprites stay cached per type, frame, and hue. |
| F-EYE | Play sclera is 0.80 of the v0.8.4 play eye. Iris is `#1a1218` at 0.55 of the sclera, plus one white glint. |
| F-PP5b | Queen drip radius is at least 8 px, including the reduced-motion dot. Frosting Queen drips in `#7ec8e8`. |
| F-CONTRAST | 80 maps. Ledger vs v0.8.0: worst dA1 +0.027, dA2 +0.020 (floor −0.010, anchor −0.030). A5 min 1.651, rendered A5r min 1.578 (≥ 1.40). A10r min 1.402 (≥ 1.35). |
| F-R3b-DEV | Filed in `r3b-device.md`. No phone on this machine, so the device gate is not run. The lab harness passed. |
| F-PERF-ANTS | L38 label 4x, yield per frame: p50 1.7 ms, p95 3.2 ms, max 18.7 ms, 0/2400 over 22 ms. |
| F-SHEET / G20b | `ants-vs-cf.png` and `colonyflow-sheet.png`. |
| G14b | Hue ±5 and size 0.97–1.05, only worker, scout, and flyer. |
| U16b | Ten W8 flavour tips. `tipLint` is clean. |
| QA9b | The scaffold check covers W1–W8, including the cupcake body and the frosting theme. |
| W8 | Frosting Factory, L71–L80, coinMul 2.5, stars 40/190, cap 7, Sugar Cube, Frosting Queen. hpMul is the plan table. L67 and L68 stay 4.68 and 7.05. |
| EC12b | Economy row in `economy.md`. |

The frosting ground shipped one step darker than the proposal (`#e8d4c4` / `#e0c8b4`, trail still `#fffaf5`). The proposal cream measured A2 1.18 against the trail. The darker tiles measure A2 1.37 on the ten W8 maps.

The Frosting Queen calls a Drone, then a Sugar Cube. That is the data-pack spawn (alt is the first flip). It is the order that reproduces the 59.1% L80 result. A Sugar-Cube-first flip won 64.1%, which is outside the ±5 band.

## Win rates (540 battles, bot proxy)

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
| 71 | 6.50 | 100 | 100 | 5 | yes | |
| 72 | 7.80 | 100 | 100 | 5 | yes | |
| 73 | 10.20 | 95.0 | 91.5 | 5 | yes | |
| 74 | 11.40 | 98.0 | 93.5 | 5 | yes | |
| 75 | 5.20 | 83.5 | 87 | 7 | yes | 19.1 |
| 76 | 9.80 | 96.5 | 93 | 5 | yes | |
| 77 | 4.60 | 86.7 | 84 | 5 | yes | |
| 78 | 6.68 | 86.1 | 84 | 5 | yes | 29.6 |
| 79 | 3.73 | 93.5 | 88 | 7 | yes | 11.5 |
| 80 | 1.55 | 59.1 | 58.5 | 5 | yes | 16.0 |

All twenty are inside the band. Peak slopes are at most 29.6.

## Cut

Not in this build, from the plan cut list: MAP-SCENE, G17 (title and map restyle), J17b (no new star-ladder work; the 0.35 s gap is still real-time), G12b, G15b (the flyer rim is still the existing 1 px stroke), G11b (treat pool stays alpha 0.06), M7h-polish, J20 (wing-buzz and queen stings), U13 (text size), J7 (screen slide).

## Gates

| Gate | Result |
|---|---|
| `npm test` | 442 pass, 0 fail |
| Ant bbox | worker play 31 px, tile 40, ratio 0.775 |
| Contrast ledger | pass, worst dA1 +0.027, dA2 +0.020 |
| A5 / A10r | 1.651 / 1.402 |
| R3b harness | pass, p95 3.2 ms |
| R3b device | not run |
| W8 + W7 win rates | 20/20 inside tolerance |
| Android debug APK | not compiled. No Android SDK on this machine. |
