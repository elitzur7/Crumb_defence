# Q1 — never-cut regression matrix

Head `30ccd4f` plus this note. `npm test` 453 pass, 0 fail.

| Item | Status | Evidence |
|---|---|---|
| PACE 1.35 | PASS | `game/src/loop.js`, pace tests in `game/tests/v085.test.js` |
| PLAY_ANT_SCALE 0.72 | PASS | `game/src/art.js`, `game/tests/v085.test.js` |
| No INTERNET permission | PASS | `game/android/app/src/main/AndroidManifest.xml` requests only VIBRATE |
| No purchase code, no signing keys | PASS | No billing permission. Keys were not created or committed |
| GL1 glue output | PASS | `game/tests/v086-ux1.test.js` crossing-time metric, including battle 3→4 above 15% |
| SR1 / UX1, all 182 steps | PASS | Same test. 182/182 pass |
| UC1, no world card cap | PASS | `game/tests/v086.test.js` EC1: level 10 applies in World 1 and World 8. Specials are on below World 6 |
| SH1, 10% pack, no pity | PASS | `game/tests/v062.test.js`, `game/tests/v070.test.js`. Shop prices 20 and 80 |
| EX1 payout and measured durations | PASS | `game/src/meta.js` `TREF`, `qa/v0.8.6/tref-measured.json`. Level 3 uses 90 s because that seed did not win |
| DX1 tiers and world prices | PASS | `game/tests/v086.test.js` DX1 table and EC1 boss diamonds (30 once, replay 0) |
| AC1 drop carrier | PASS | 17 of 50 World 4–8 levels, first at L33. Test `AC1`: same seed, same drop, four workers start toward the cookie |
| AU1 marble and music | PASS for code | `game/src/audio.js`. Listening NOT RUN |
| AU1 human listening | NOT RUN | Needs Yair, phone and speakers |
| DQ earned boosters and queen | FAIL | `qa/v0.8.6/dq-curve.md`. Bomb then Freezer adds 0.2 food and no wins. A queen HP bump fell off a cliff and was not kept |
| DQ human play | NOT RUN | Needs Yair |
| LV variety and paired sims of changed trails | PASS | `qa/v0.8.6/lv-pair.json`. L65 88.9 (87±7), L74 91.7 (93.5±5), L76 91.7 (93±5). No world reuses a trail |
| TG1 test grants | PASS | Battle diamond chip, 300 ms debounce, `testGranted` stored apart from earned diamonds. `TEST_GRANTS` is true and must be false for a public build |
| E1 contrast | PASS | `qa/v0.8.6/art-ledger.json`. Worst paired dA1 +0.023, dA2 −0.025. Floor −0.030 |
| M1 clock and rescue | PASS | Pace tests. Rescue uses `speed * PACE` so the wall window stays about 3 s |
| V1 legs | PASS for the drawing | `qa/v0.8.6/gait-sheet.png`. Matched Colony Flow crops were not redone this run |
| P1 frame time | PASS | `qa/v0.8.6/r3b-raw.json`. L38 label 4, p95 3.1 ms, 0/2400 over 22 ms |
| D1 physical device | NOT RUN | No phone |
| EC1 World 8 rewards | PASS | `qa/v0.8.6/ec1.md`, test `EC1` |
| EC2 merge this tower only | PASS | `game/tests/v086.test.js` |
| U2 prep stats | PASS | Docked panel in `game/src/game.js` `drawPrepStats` |
| MB1 marble stats | PASS | Collision radius 13 at every level. Labels are Damage and Firing frequency |
| RS1 tower records | PASS | `noteHit` in `game/src/sim.js`, result rows in `drawBattleRecords` |
| B1 Crumb Rush | PASS | `qa/v0.8.6/b1-sim.md`. Not retuned |
| LY1 placeable rows | PASS for layout and the paired sample | `qa/v0.8.6/ly1-wins.json`. 20 seeds, all 80 levels, mean +4.2 points |
