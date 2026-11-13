# SR1 / UX1

All 182 card and battle steps now move a measured effect. The check is `game/tests/v086-ux1.test.js`.

- Glue: four workers walk the glue tile. The metric is added time versus an unhindered walk. Battle 3 to 4 adds more than 15 percent.
- Fan: the ant is held in the gust and the total push is summed. A range-only step is tested with the ant between the old and new range.
- Perfume charm and slow steps use the same crossing-time metric. The last battle slow step is now ×1.4, and two card slow steps are +0.16 and +0.14, so the crossing time clears 8 percent and 3 percent.
- Marble, zapper, and the other damage towers use hit points removed. The marble's last step is rate only, measured over 30 seconds so the extra shot is visible.
- Tractor rate is extra scoops over 150 seconds. A lift-size step is scored on workers, which the smaller bucket cannot lift.

`npm test` includes this gate.
