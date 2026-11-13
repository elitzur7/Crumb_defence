# v0.8.6 progress (foundation commit)

Branch `cursor/v086-feedback-economy-ffd4` from tag v0.8.5 (`04bb086`). `npm test`: 445 pass, 0 fail, 1 skip.

## Shipped in this commit

- Version 0.8.6, versionCode 31. PACE stays 1.35. Play-ant scale stays 0.72.
- LY1: the board is 10×14. Source maps stay 10×12 and are translated one row at load, including the 0.6-tile walk-in. Path length in pixels is unchanged. The new rows are placeable under the existing rules (side towers off the trail, Marble/Fan/Tractor only where they touch it). Battle canvas is 400×800. The layout reads the top safe inset. A 16:9 phone scales 800 px into a shorter window, so tiles shrink; that screenshot is not in this commit yet.
- MB1: marble collision radius is fixed at 13. Card and battle steps that used to grow the radius now raise damage or firing frequency. The player-facing words are Damage and Firing frequency.
- GL1: the glue steps named in the plan now raise stick time. Stuck ants are not cleared when the tower is upgraded (that reset was not in the code).
- UC1: a battle uses the owned card level. Level-5 specials work in every world. Boss gifts use the fixed level table 2/3/4/5/5/5/5/6.
- EX1: win coins are the frozen replay base times 1 / 1.05 / 1.10. First clear is 30×F. Star records are 20F, 20F, 80F, paid once. A loss pays progress/3.5 with no cap. Merge costs and the shop prices (20 and 80) match the plan. Card power uses Q = 1.08^(level−1) on the useful stat. The reference duration is a uniform 48 seconds so the coin rate rises with F. It is not a measured per-level duration yet.
- DX1: the first clear pays one diamond tier (1, 5, or 20). A later star pays none. A boss first clear still adds 10. The old +5 for a first 3-star boss is not paid.
- SH1: a pack is a special on exactly 10% of rolls. Pity does not force one. When every tower is owned, that roll is level 3 (75%) or level 4 (25%).
- U1: Settings has Text: Normal / Large. Large is ×1.15 with a 14 px floor, and it is saved.
- U2: prep keeps a stats strip above Defend. Empty text is "Tap a card to see its stats". Defend's hit size is still 224×54.

## Not in this commit

E1 contrast, P1 frame-time, the paired win-rate sims, V1 legs, C1, AU1 audio, EC2 per-type merge, B1 Crumb Rush, RS1 tower records, TG1 test grant, AC1 Drop Carrier, the new LV maps, the DQ calibration, and Q1/Q2. D1 (a physical phone on L38) is BLOCKED: this machine has no phone. AU1 listening and a human pass on the queen levels are not claimed.

`game/android/app/src/main/res/xml/config.xml` is gitignored. A local copy with no network access origin is what the regression test reads. The manifest still requests no INTERNET permission. No purchase code was added. Release signing keys were not created.
