# EC1 — World 8 reward, unlock, and cap audit

Checked against the new payout, not the released coinMul.

- Tuning still records the v0.8.5 baseline: World 8 coinMul 2.5, cardLevelCap 7, unlock 14 stars in World 7. The live payout does not multiply by coinMul. A World 8 win uses F = 3.2^7 × 1.12^(position−1), replay base, first clear 30F, and star records 20F / 20F / 80F.
- Level 80 first 3-star clear pays that sum once, plus 20 diamonds for the tier and 10 for the boss. A replay pays the 3-star replay coins only. No second boss gift, no +5 for three stars.
- A 1-star then 3-star jump on level 71 pays the two new star records and no more diamonds.
- A level-10 card is not clamped in World 1 or World 8.
- The Frosting Queen spawn is sugar-cube with alt drone, so the first call is the Drone. The book and the level-80 tip say the same order.
- The 14-star World 8 gate is unchanged. It is a world unlock, not a card cap.

No payout bug turned up. The check is `EC1` in `game/tests/v086.test.js`.
