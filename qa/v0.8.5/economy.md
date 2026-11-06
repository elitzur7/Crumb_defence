# Economy readout v0.8.5

Star bonus is `round(starBonus * coinMul / 5) * 5` with starBonus 15 / 75. Daily first win is `50 * min(coinMul, 2)`.

| World | coinMul | Star 2 | Star 3 | Daily | Cap |
|---|---|---|---|---|---|
| W6 | 2.00 | 30 | 150 | 100 | 6 |
| W7 | 2.25 | 35 | 170 | 100 | 6 |
| W8 | 2.50 | 40 | 190 | 100 | 7 |
| W9 | 2.75 | 40 | 205 | 100 | 7 |
| W10 | 3.00 | 45 | 225 | 100 | 7 |

W8 is Frosting Factory. Unlock is every World 7 level won plus 14 stars. Boss gems stay +10 on the first clear and +5 on the first 3 stars. Eight queens raise the cumulative gem ceiling to 120.

Replay coins are the bot-proxy win table in `wins.json`. The star row does not depend on the bot.
