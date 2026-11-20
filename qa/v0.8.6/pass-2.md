# v0.8.6 second commit

`npm test`: 447 pass, 0 fail, 1 skip.

## Shipped

- EC2: the card's own screen merges only that tower. The Cards screen still has a separate Merge all for every tower.
- B1: Crumb Rush. Kill crumbs gain 20 percent for 20 seconds, with a leftover of at least half a crumb paid as 1 when it ends. It does not stack. It is a perfect-prize choice and an extra on the calendar's level-1 card day. No balance sim was run, so the 0.20 / 20 s numbers are the plan's starting values, not a retune.
- RS1: each tower records damage, kills, and overkill. Cookie Swatter, Bomb, Crop Duster, and Other have their own rows. The result panel shows up to four of those rows. Brood children add damage and not a kill.
- TG1: tapping the battle diamond chip opens Test grant (free) for +20, +40, and +100. A second tap inside 300 ms does nothing. The amount is stored on the save as testGranted and is not mixed into earned income. TEST_GRANTS is true in this build. Set it false before a public build.
- U1 and U2 were already in the first commit (text size, prep stats strip).

## Still not shipped

V1 legs, C1 cues, AU1 audio, AC1 Drop Carrier, the new LV maps, the DQ calibration, the paired LY1 win-rate sims, E1 contrast, P1 frame times, and Q1/Q2. D1 is BLOCKED (no phone). AU1 listening is not claimed. No human has played the queen levels on this build.

PACE is still 1.35. Play-ant scale is still 0.72. The manifest has no INTERNET permission. No purchase code. No signing keys.
