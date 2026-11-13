# v0.8.6 status after the second development pass

`npm test`: 448 pass, 0 fail. PACE 1.35. Play-ant scale 0.72. versionCode 31. No INTERNET permission. No purchase code. No signing keys. No APK: this machine has no Android SDK, so the unsigned web bundles in `game/www` are the build artifacts.

## Gates that were run

- Contrast, 80 levels, ground sampled within two tiles of the trail. Paired ledger `art-ledger.json`: worst dA1 +0.023, worst dA2 −0.035. The floor is −0.030. Level 23 is the only paired miss, by 0.005. A5 min 1.555, rendered A5r min 1.486, both at least 1.40. L41–L80 are absolute records in `contrast.json`, not paired to a v0.8.0 map.
- L38 label 4, 2400 yielded frames, viewport 393×852, DPR 2. p50 1.6, p90 2.6, p95 3.1, p99 6.5, max 19.8, over 22 ms: 0/2400. See `r3b-raw.json`.
- Aspect shots: `layout-16x9.png`, `layout-18x9.png`, `layout-19.5x9.png`, `layout-20x9.png`, `layout-21x9.png`. On 16:9 the 800 px board is scaled into 640 px, so tiles are smaller than on the old 720 px board. Taller phones keep more of the tile size.
- Gait strip: `gait-sheet.png` (worker, flyer, sugar cube, queen, six phases).
- Reference durations: `tref-measured.json`. One bot clear per level. Level 3 did not win; its reference is 90 s. Payout is 90×F coins per wall-minute times that duration. Wall minutes are sim seconds / (1.35×60).
- Upgrade fixture: `upgrade-effect.json`. 182 transitions, 111 raised the fixture metric by the required amount, 15 did not (glue's one-ant stick count saturates; the last marble step did not add a hit in four seconds), 56 did not register a metric. This is not a passed UX1 gate.

## Still pending a person

- D1, a physical phone on L38: NOT RUN.
- AU1 pleasantness: NOT RUN. The code has the marble bead, the voice cap, the three loops and the volume controls. Nobody has listened.
- DQ human play of the World 3 queen: NOT RUN.

## Item notes

- V1: play legs use three roots per side, a bent near knee, and quieter far legs. Scale, hitboxes and the vivid colours are unchanged.
- C1: an armor hit draws three sparks and plays a short clang. No damage numbers changed.
- AU1: marble roll is a 440 Hz bead, not the fan hiss. Music is prep 80 / battle 96 / queen 112 BPM in C major, held 4 real seconds after the last queen, and it does not get louder for the queen. Mute cuts the master gain immediately. `TEST_GRANTS` is still true.
- AC1: Drop Carrier (HP 80, flying, drops a crate of up to 4 workers) is on levels 41, 62, 65, 71 and 74, the later levels that still had a free type slot. Levels already at five types were left alone so the older ant-count tests still hold.
- LV: World 7 and World 8 trails were redrawn, except L65, L74 and L76, which were put back because the proxy deck won 0 of 5 seeds. World 1 and World 2 still share a few trails. Nest mixes are not yet the full 4/3/3 table. Map count is 75.
- DQ: level 30 prep says "Try Bomb + Freezer. Clear the escort near your towers; freeze the queen there before she bites." After two losses the prep offers one free Freezer, which uses a normal use slot and cannot be claimed twice.
