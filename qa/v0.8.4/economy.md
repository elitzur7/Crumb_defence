# Economy readout v0.8.4

Star bonus is `round(starBonus * coinMul / 5) * 5` with starBonus 15 / 75. Daily first win is `50 * min(coinMul, 2)`.

| World | coinMul | Star 2 | Star 3 | Daily |
|---|---|---|---|---|
| W6 | 2.00 | 30 | 150 | 100 |
| W7 | 2.25 | 35 | 170 | 100 |
| W8 | 2.50 | 40 | 190 | 100 |
| W9 | 2.75 | 40 | 205 | 100 |
| W10 | 3.00 | 45 | 225 | 100 |

W7 is Jelly Jamboree, card level cap 6, unlock is every World 6 level won plus 14 stars. Boss gems stay +10 on the first clear and +5 on the first 3 stars. Seven queens raise the cumulative gem ceiling to 105.

Replay coins per win are the bot proxy and are listed next to the win-rate table in `w7-wins.json` when that run has finished. The star row above does not depend on the bot.
