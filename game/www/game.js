// ../tuning/tuning.json
var tuning_default = {
  _about: "Crumb Defense tuning - the SOURCE OF TRUTH for the numbers below. Edit, then rebuild (see README.md in this folder). Not loaded at runtime; the build bundles it.",
  specials: !0,
  _units: {
    rangeTiles: "radius from the tower centre in map tiles (1 tile = 40 px)",
    rate: "actions per second (null = always on)",
    cardUpgrades: "steps to card levels L2..L10, in order. power / rate / any other key: fraction (+0.10 = +10%); range: tiles (+0.2 tiles)",
    battleUpgrades: "in-battle levels 2-6 (five upgrades; drop the same card on the tower): multipliers",
    speed: "px per second",
    queenTake: "a queen takes 50 + the sum of her trait modifiers (queenTraitMods) from the treat",
    heal: "optional ant field (v0.7.8 nurse): { radius (tiles), pct (of the TARGET's max hp per pulse), every (s, cooldown after a pulse), bossMul (multiplier when the target is a queen) }. A ready, unfrozen healer pulses when >= 1 hurt non-healer ant is in range; she never heals herself or another healer.",
    rarity: "common | uncommon | rare | elite | boss (v0.7.7). Checked by tests/v077.test.js for worlds >= 3: >= 2 common types per non-boss level, <= 2 rare-or-higher types, a rare first appears at wave >= 2 (never wave 1). W1/W2 only report."
  },
  shop: {
    _about: "v0.6.2 items 12/13. unlockPrice: coins to unlock a locked tower in the Shop (tiered by base power, approved by Yair). packNewTowerChance: chance that a card pack holds ONE new (locked) tower card (L1) as one of its cards.",
    unlockPrice: { sound: 100, pheromone: 100, lava: 100, lizard: 200, gate: 200, zapper: 200, laser: 400, tractor: 400 },
    unlockPriceDefault: 200,
    packNewTowerChance: 0.1
  },
  economy: {
    _about: "v0.7.6 E1/E2/E3/E5. starBonus: coins paid ONCE per level the first time it reaches 2 (key 2) and 3 (key 3) stars (a 1 -> 3 star jump pays both; stored stars count as already paid, no retroactive grant). bossGems: diamonds on the FIRST clear of a world's last level (its queen) and on the first 3 stars there. calendar.coinsByStreak: coins of the 1st, 2nd, 3rd, 4th+ coin prize of a streak, multiplied by 1 + worldStep x (highest unlocked world - 1), rounded to a multiple of roundTo. worlds[].coinMul (default 1) multiplies the win coins of that world's levels (not the first-clear bonus, not loss coins).",
    starBonus: { "2": 15, "3": 75 },
    starBonusScale: "coinMul",
    bossGems: { firstClear: 10, firstThreeStars: 5 },
    calendar: { coinsByStreak: [30, 60, 90, 120], worldStep: 0.5, roundTo: 5 }
  },
  queenTraitMods: { fast: -10, flying: -15, slow: 0, slower: 5, slowest: 10, vulnerable: 5, veryVulnerable: 10 },
  antSizes: { small: 0.7, regular: 1, large: 1.12, queen: 2.1 },
  towers: {
    slingshot: {
      power: 6,
      rate: 1.1,
      rangeTiles: 1.5,
      params: { projSpeed: 380 },
      battleUpgrades: [
        { power: 2 },
        { rate: 1.3, range: 1.1, power: 1.154 },
        { power: 1.333 },
        { rate: 1.15, power: 1.087 },
        { range: 1.1, power: 1.2 }
      ],
      cardUpgrades: [
        { range: 0.2 },
        { power: 0.1 },
        { range: 0.2 },
        { rate: 0.1 },
        { power: 0.1 },
        { power: 0.12 },
        { rate: 0.1 },
        { range: 0.2 },
        { range: 0.2, power: 0.1 }
      ]
    },
    spray: {
      power: 6,
      rate: 0.42,
      rangeTiles: 1.5,
      params: { cloudTime: 2.6, cloudRadius: 42 },
      battleUpgrades: [
        { power: 2, cloudRadius: 1.2 },
        { rate: 1.3, power: 1.154 },
        { cloudRadius: 1.15, range: 1.1, power: 1.333 },
        { power: 1.25 },
        { rate: 1.2 }
      ],
      cardUpgrades: [
        { power: 0.1 },
        { rate: 0.08 },
        { range: 0.2 },
        { power: 0.12 },
        { range: 0.15 },
        { rate: 0.1 },
        { power: 0.1 },
        { range: 0.2 },
        { power: 0.1, rate: 0.1 }
      ]
    },
    sound: {
      power: 4,
      rate: 0.75,
      rangeTiles: 1.5,
      params: { ignoreArmor: !0, stagger: 0.18 },
      battleUpgrades: [
        { power: 2 },
        { range: 1.15, rate: 1.2, power: 1.25 },
        { stagger: 1.3, power: 1.333 },
        { power: 1.25 },
        { rate: 1.15, stagger: 1.25, power: 1.043 }
      ],
      cardUpgrades: [
        { rate: 0.1 },
        { range: 0.2 },
        { power: 0.1 },
        { power: 0.1 },
        { range: 0.2 },
        { rate: 0.08 },
        { range: 0.15 },
        { power: 0.12 },
        { rate: 0.1, range: 0.2 }
      ]
    },
    ball: {
      power: 16,
      rate: 0.16,
      rangeTiles: null,
      params: { ballRadius: 13, rollSpeed: 230, maxBalls: 1 },
      battleUpgrades: [
        { power: 2, ballRadius: 1.2 },
        { rate: 1.3, power: 1.154 },
        { ballRadius: 1.1, power: 1.333 },
        { power: 1.25 },
        { rate: 1.2 }
      ],
      cardUpgrades: [
        { power: 0.1 },
        { rate: 0.1 },
        { ballRadius: 0.1 },
        { power: 0.12 },
        { rate: 0.08 },
        { power: 0.1 },
        { ballRadius: 0.1 },
        { rate: 0.1 },
        { power: 0.1, rate: 0.1 }
      ]
    },
    fan: {
      power: 50,
      rate: 0.36,
      rangeTiles: 1.5,
      params: {},
      battleUpgrades: [{ power: 1.3 }, { rate: 1.25, range: 1.1 }, { power: 1.15 }, { range: 1.1 }, { rate: 1.15 }],
      cardUpgrades: [
        { range: 0.2 },
        { rate: 0.1 },
        { power: 0.1 },
        { range: 0.2 },
        { range: 0.15 },
        { power: 0.1 },
        { rate: 0.1 },
        { power: 0.12 },
        { range: 0.2, rate: 0.1 }
      ]
    },
    pheromone: {
      power: 2.5,
      rate: null,
      rangeTiles: 1,
      params: { ignoreArmor: !0, slow: 0.35, charmTime: 1.6 },
      battleUpgrades: [{ power: 1.5 }, { charmTime: 1.4, slow: 1.25 }, { power: 1.2 }, { charmTime: 1.2 }, { slow: 1.15 }],
      cardUpgrades: [
        { power: 0.12 },
        { slow: 0.1 },
        { charmTime: 0.1 },
        { power: 0.1 },
        { slow: 0.08 },
        { power: 0.1 },
        { charmTime: 0.1 },
        { charmTime: 0.12 },
        { power: 0.1, slow: 0.08 }
      ]
    },
    lizard: {
      power: 38,
      rate: 0.42,
      rangeTiles: 1.5,
      params: { chewTime: 1.4 },
      battleUpgrades: [
        { power: 2 },
        { chewTime: 0.6, range: 1.1, power: 1.5 },
        { rate: 1.2, power: 1.111 },
        { power: 1.25 },
        { chewTime: 0.75, power: 1.2 }
      ],
      cardUpgrades: [
        { power: 0.12 },
        { rate: 0.08 },
        { range: 0.2 },
        { power: 0.1 },
        { range: 0.2 },
        { rate: 0.1 },
        { power: 0.1 },
        { power: 0.12 },
        { range: 0.2, power: 0.1 }
      ]
    },
    laser: {
      power: 3,
      rate: 3.2,
      rangeTiles: 2.5,
      params: { heatPerHit: 0.1, heatMax: 1 },
      battleUpgrades: [
        { power: 1.7 },
        { rate: 1.15, power: 1.228 },
        { range: 1.1, power: 1.292 },
        { power: 1.15, heatMax: 1.5 },
        { rate: 1.2, heatMax: 1.3 }
      ],
      cardUpgrades: [
        { rate: 0.08 },
        { power: 0.1 },
        { range: 0.2 },
        { rate: 0.1 },
        { power: 0.1 },
        { range: 0.2 },
        { power: 0.12 },
        { rate: 0.1 },
        { power: 0.1, rate: 0.1 }
      ]
    },
    zapper: {
      power: 10,
      rate: 1.5,
      rangeTiles: 2,
      params: { chain: 2, chainRange: 75, chainFalloff: 0.6 },
      battleUpgrades: [
        { power: 2 },
        { chain: 1.5, range: 1.1, power: 1.5 },
        { rate: 1.2, power: 1.111 },
        { power: 1.25 },
        { rate: 1.15, chain: 1.34, power: 1.043 }
      ],
      cardUpgrades: [
        { range: 0.2 },
        { power: 0.1 },
        { rate: 0.1 },
        { range: 0.2 },
        { power: 0.12 },
        { rate: 0.08 },
        { power: 0.1 },
        { range: 0.2 },
        { power: 0.1, range: 0.15 }
      ]
    },
    glue: {
      power: 0.55,
      rate: null,
      rangeTiles: 1,
      params: { stickTime: 0.5 },
      battleUpgrades: [{ power: 1.15 }, { stickTime: 2 }, { stickTime: 1.25 }, { power: 1.1 }, { stickTime: 1.2 }],
      cardUpgrades: [
        { stickTime: 0.12 },
        { power: 0.08 },
        { stickTime: 0.15 },
        { power: 0.06 },
        { power: 0.08 },
        { stickTime: 0.1 },
        { stickTime: 0.15 },
        { power: 0.08 },
        { stickTime: 0.12, power: 0.05 }
      ]
    },
    gate: {
      power: 4.5,
      rate: 2.85,
      rangeTiles: 1,
      params: { ignoreArmor: !0 },
      battleUpgrades: [{ power: 2 }, { rate: 1.3, power: 1.154 }, { rate: 1.15, power: 1.159 }, { power: 1.25 }, { power: 1.1, rate: 1.1 }],
      cardUpgrades: [
        { rate: 0.1 },
        { power: 0.1 },
        { power: 0.12 },
        { rate: 0.08 },
        { rate: 0.08 },
        { power: 0.1 },
        { power: 0.08 },
        { rate: 0.1 },
        { power: 0.1, rate: 0.06 }
      ]
    },
    lava: {
      power: 6,
      rate: null,
      rangeTiles: 1,
      params: { ignoreArmor: !0, slow: 0.2 },
      battleUpgrades: [{ power: 2 }, { slow: 1.25, power: 1.5 }, { power: 1.333 }, { slow: 1.15, power: 1.25 }, { power: 1.2 }],
      cardUpgrades: [
        { power: 0.1 },
        { slow: 0.08 },
        { power: 0.1 },
        { slow: 0.1 },
        { power: 0.08 },
        { power: 0.12 },
        { slow: 0.08 },
        { power: 0.1 },
        { slow: 0.1, power: 0.1 }
      ]
    },
    tractor: {
      power: null,
      rate: 0.13,
      rangeTiles: null,
      params: { liftSize: 1 },
      battleUpgrades: [{ rate: 1.12 }, { rate: 1.1 }, { rate: 1.12 }, { liftSize: 1, rateIfMaxLift: 1.15 }, { rate: 1.1 }],
      cardUpgrades: [
        { rate: 0.05 },
        { liftSize: 1 },
        { rate: 0.06 },
        { rate: 0.05 },
        { rate: 0.07 },
        { rate: 0.05 },
        { liftSize: 1 },
        { rate: 0.06 },
        { rate: 0.07 }
      ]
    }
  },
  ants: {
    small: { hp: 4, speed: 60, armor: 0, steal: 0.9, weight: 1.2, size: "small", crumbs: 1, rarity: "common" },
    worker: { hp: 20, speed: 40, armor: 0, steal: 0.9, weight: 1, size: "regular", crumbs: 1, rarity: "common" },
    big: { hp: 100, speed: 27, armor: 2, steal: 1.8, weight: 0.5, size: "large", crumbs: 4, rarity: "rare" },
    gasmask: {
      hp: 16,
      speed: 40,
      armor: 1,
      steal: 0.9,
      weight: 1,
      size: "regular",
      crumbs: 2,
      rarity: "uncommon",
      gasImmune: !0
    },
    armored: { hp: 40, speed: 30, armor: 6, steal: 1.8, weight: 0.6, size: "regular", crumbs: 4, rarity: "rare" },
    flyer: {
      hp: 12,
      speed: 62,
      armor: 0,
      steal: 0.9,
      weight: 1.3,
      size: "regular",
      crumbs: 2,
      rarity: "common",
      flying: !0
    },
    sprinter: {
      hp: 10,
      speed: 52,
      armor: 4,
      steal: 0.9,
      weight: 0.8,
      size: "regular",
      crumbs: 3,
      rarity: "uncommon",
      lateGame: !0
    },
    heavy: {
      hp: 80,
      speed: 24,
      armor: 6,
      steal: 1.8,
      weight: 0.35,
      size: "large",
      crumbs: 8,
      rarity: "elite",
      lateGame: !0
    },
    queen: {
      hp: 1200,
      speed: 13,
      armor: 6,
      weight: 0,
      size: "queen",
      crumbs: 93,
      rarity: "boss",
      slowResist: 0.5,
      boss: !0,
      spawn: { type: "small", every: 5, count: 1 },
      queenTraits: ["slow"]
    },
    queen2: {
      hp: 2e3,
      speed: 19,
      armor: 5,
      weight: 0,
      size: "queen",
      crumbs: 141,
      rarity: "boss",
      slowResist: 0.4,
      boss: !0,
      spawn: { type: "flyer", every: 6, count: 1 },
      queenTraits: ["fast"]
    },
    small_gasmask: {
      hp: 4,
      speed: 60,
      armor: 0,
      steal: 0.9,
      weight: 1.2,
      size: "small",
      crumbs: 1,
      rarity: "uncommon",
      gasImmune: !0
    },
    small_armed: { hp: 10, speed: 45, armor: 4, steal: 0.9, weight: 1, size: "small", crumbs: 1, rarity: "uncommon" },
    small_fly: {
      hp: 3,
      speed: 70,
      armor: 0,
      steal: 0.9,
      weight: 1.5,
      size: "small",
      crumbs: 1,
      rarity: "common",
      flying: !0
    },
    greasy: {
      hp: 24,
      speed: 40,
      armor: 0,
      steal: 0.9,
      weight: 1,
      size: "regular",
      crumbs: 2,
      rarity: "uncommon",
      slowResist: 0.75
    },
    mama: {
      hp: 60,
      speed: 28,
      armor: 2,
      steal: 1.8,
      weight: 0.5,
      size: "large",
      crumbs: 3,
      rarity: "rare",
      splitInto: { type: "small", count: 3 }
    },
    queen3: {
      hp: 2300,
      speed: 14,
      armor: 6,
      weight: 0,
      size: "queen",
      crumbs: 160,
      rarity: "boss",
      slowResist: 0.7,
      boss: !0,
      spawn: { type: "greasy", every: 7, count: 1 },
      queenTraits: ["slower"]
    },
    nurse: {
      hp: 60,
      speed: 32,
      armor: 0,
      steal: 1.2,
      weight: 0.6,
      size: "regular",
      crumbs: 3,
      rarity: "rare",
      heal: { radius: 1.5, pct: 0.2, every: 3, bossMul: 0.1 }
    },
    queen4: {
      hp: 2600,
      speed: 16,
      armor: 6,
      weight: 0,
      size: "queen",
      crumbs: 180,
      rarity: "boss",
      slowResist: 0.6,
      boss: !0,
      spawn: { type: "nurse", every: 9, count: 1 },
      queenTraits: ["slow"]
    },
    glazed: {
      hp: 24,
      speed: 38,
      armor: 0,
      steal: 1,
      weight: 0.8,
      size: "regular",
      crumbs: 3,
      rarity: "uncommon",
      shield: { pts: 30, regenDelay: 2.5, regenRate: 0.3, when: "always" }
    },
    queen5: {
      hp: 2400,
      speed: 15,
      armor: 6,
      weight: 0,
      size: "queen",
      crumbs: 200,
      rarity: "boss",
      slowResist: 0.6,
      boss: !0,
      spawn: { type: "glazed", every: 10, count: 1 },
      shield: { pts: 600, regenDelay: 4, regenRate: 0.25, when: "always" },
      queenTraits: ["slow"]
    },
    drone: {
      hp: 30,
      speed: 54,
      armor: 2,
      steal: 1.1,
      weight: 1,
      size: "regular",
      crumbs: 4,
      rarity: "rare",
      flying: !0
    },
    queen6: {
      hp: 3e3,
      speed: 15,
      armor: 6,
      weight: 0,
      size: "queen",
      crumbs: 220,
      rarity: "boss",
      slowResist: 0.6,
      boss: !0,
      spawn: { type: "drone", every: 12, count: 1 },
      queenTraits: ["slow"]
    }
  },
  worlds: [
    {
      id: 1,
      name: "Cookie Kitchen",
      treat: "cookie",
      queen: "queen",
      levels: 10,
      unlock: null,
      cardLevelCap: 4,
      coinMul: 1
    },
    {
      id: 2,
      name: "Cake Castle",
      treat: "cake",
      queen: "queen2",
      levels: 10,
      unlock: { allLevelsWonInWorld: 1, minStarsInWorld: 18 },
      cardLevelCap: 5,
      coinMul: 1
    },
    {
      id: 3,
      name: "Pie Pantry",
      treat: "pie",
      queen: "queen3",
      levels: 10,
      unlock: { allLevelsWonInWorld: 2, minStarsInWorld: 18 },
      cardLevelCap: 5,
      coinMul: 1.25
    },
    {
      id: 4,
      name: "Ice-Cream Parlour",
      treat: "sundae",
      queen: "queen4",
      levels: 10,
      unlock: { allLevelsWonInWorld: 3, minStarsInWorld: 14 },
      cardLevelCap: 6,
      coinMul: 1.5
    },
    {
      id: 5,
      name: "Donut Diner",
      treat: "donut",
      queen: "queen5",
      levels: 10,
      unlock: { allLevelsWonInWorld: 4, minStarsInWorld: 14 },
      cardLevelCap: 6,
      coinMul: 1.75
    },
    {
      id: 6,
      name: "Pancake Picnic",
      treat: "pancake",
      queen: "queen6",
      levels: 10,
      unlock: { allLevelsWonInWorld: 5, minStarsInWorld: 14 },
      cardLevelCap: 6,
      coinMul: 2
    }
  ],
  levels: [
    {
      world: 1,
      name: "First Crumbs",
      map: "zigzag",
      waveCount: 4,
      hpMul: 1,
      base: 8.1,
      growth: 1.44,
      interval: 1.1,
      mix: [{ type: "worker", w: 4 }, { type: "small", w: 3, from: 2 }]
    },
    {
      world: 1,
      name: "Hungry Morning",
      map: "zigzag",
      waveCount: 4,
      hpMul: 1.56,
      base: 7,
      growth: 1.8,
      interval: 1,
      mix: [{ type: "worker", w: 4 }, { type: "small", w: 3 }, { type: "small_gasmask", w: 1, from: 3 }]
    },
    {
      world: 1,
      name: "Gas Masks On",
      map: "hook",
      waveCount: 5,
      hpMul: 3.125,
      interval: 1,
      waves: [
        [
          { type: "worker", count: 4, interval: 1, delay: 0 },
          { type: "small", count: 6, interval: 0.45, delay: 0 },
          { type: "small_gasmask", count: 2, interval: 0.45, delay: 0 }
        ],
        [
          { type: "small_gasmask", count: 6, interval: 0.45, delay: 0 },
          { type: "small_fly", count: 2, interval: 0.5, delay: 0 },
          { type: "worker", count: 4, interval: 1, delay: 0 },
          { type: "gasmask", count: 3, interval: 1, delay: 0 }
        ],
        [
          { type: "worker", count: 3, interval: 1, delay: 0 },
          { type: "small", count: 6, interval: 0.45, delay: 0 },
          { type: "small_fly", count: 4, interval: 0.5, delay: 0 },
          { type: "small_gasmask", count: 8, interval: 0.45, delay: 0 },
          { type: "gasmask", count: 1, interval: 1, delay: 0 }
        ],
        [
          { type: "worker", count: 7, interval: 1, delay: 0 },
          { type: "small_fly", count: 5, interval: 0.5, delay: 0 },
          { type: "small", count: 8, interval: 0.45, delay: 0 },
          { type: "gasmask", count: 1, interval: 1, delay: 0 }
        ],
        [
          { type: "worker", count: 3, interval: 1, delay: 0 },
          { type: "small", count: 14, interval: 0.45, delay: 0 },
          { type: "small_fly", count: 5, interval: 0.5, delay: 0 },
          { type: "small_gasmask", count: 6, interval: 0.45, delay: 0 },
          { type: "gasmask", count: 2, interval: 1, delay: 0 }
        ]
      ]
    },
    {
      world: 1,
      name: "Wings!",
      map: "fork",
      waveCount: 6,
      hpMul: 6.6,
      base: 7.2,
      growth: 1.8,
      interval: 0.95,
      mix: [{ type: "worker", w: 3 }, { type: "small", w: 2 }, { type: "flyer", w: 2, from: 2 }, { type: "small_fly", w: 3 }]
    },
    {
      world: 1,
      name: "Shiny Knights",
      map: "spiral",
      waveCount: 6,
      hpMul: 2.803,
      base: 8.8,
      growth: 1.96,
      interval: 0.95,
      mix: [
        { type: "worker", w: 3 },
        { type: "small", w: 2 },
        { type: "armored", w: 2, from: 2 },
        { type: "small_armed", w: 3, from: 2 }
      ],
      special: { "6": [{ type: "big", count: 2, interval: 1.6 }] }
    },
    {
      world: 1,
      name: "Sky Picnic",
      map: "twin",
      waveCount: 7,
      hpMul: 4.321,
      base: 9.5,
      growth: 2,
      interval: 0.9,
      mix: [
        { type: "worker", w: 2 },
        { type: "small", w: 3 },
        { type: "flyer", w: 3 },
        { type: "small_fly", w: 2 },
        { type: "gasmask", w: 1 }
      ]
    },
    {
      world: 1,
      name: "Heavy Traffic",
      map: "snake",
      waveCount: 8,
      hpMul: 2.225,
      base: 9.4,
      growth: 2.07,
      interval: 0.9,
      mix: [
        { type: "worker", w: 2 },
        { type: "small", w: 2 },
        { type: "big", w: 2, from: 3 },
        { type: "armored", w: 2 },
        { type: "small_armed", w: 2 }
      ]
    },
    {
      world: 1,
      name: "Masked Ball",
      map: "fork",
      waveCount: 8,
      hpMul: 3.72,
      base: 11,
      growth: 2.2,
      interval: 0.85,
      mix: [
        { type: "worker", w: 2 },
        { type: "small", w: 2 },
        { type: "gasmask", w: 3 },
        { type: "small_gasmask", w: 3 },
        { type: "flyer", w: 2, from: 2 }
      ]
    },
    {
      world: 1,
      name: "The Swarm",
      map: "twin",
      waveCount: 9,
      hpMul: 4.8,
      base: 11.4,
      growth: 2.28,
      interval: 0.75,
      mix: [
        { type: "small", w: 4 },
        { type: "worker", w: 2 },
        { type: "small_fly", w: 2 },
        { type: "sprinter", w: 1, from: 2 },
        { type: "small_armed", w: 1 }
      ]
    },
    {
      world: 1,
      name: "Her Majesty",
      map: "cross",
      waveCount: 9,
      hpMul: 2.373,
      base: 12,
      growth: 2.4,
      interval: 0.8,
      mix: [{ type: "worker", w: 2 }, { type: "small", w: 2 }, { type: "heavy", w: 2, from: 3 }, { type: "flyer", w: 2 }],
      special: { "9": [{ type: "queen", count: 1, interval: 1, delay: 4 }] }
    },
    {
      world: 2,
      name: "Cake Gate",
      map: "frosting",
      waveCount: 6,
      hpMul: 3.665,
      base: 10,
      growth: 1.8,
      interval: 1,
      mix: [
        { type: "worker", w: 3 },
        { type: "small", w: 3 },
        { type: "small_fly", w: 1, from: 2 },
        { type: "gasmask", w: 2, from: 2 }
      ]
    },
    {
      world: 2,
      name: "Sugar Steps",
      map: "staircase",
      waveCount: 6,
      hpMul: 4.064,
      base: 9,
      growth: 2,
      interval: 0.95,
      mix: [
        { type: "worker", w: 3 },
        { type: "small", w: 2 },
        { type: "small_armed", w: 2, from: 2 },
        { type: "armored", w: 1, from: 3 },
        { type: "big", w: 1, from: 4 }
      ]
    },
    {
      world: 2,
      name: "Layer Cake",
      map: "layers",
      waveCount: 6,
      hpMul: 3.45,
      base: 10,
      growth: 2,
      interval: 0.95,
      mix: [
        { type: "worker", w: 3 },
        { type: "small", w: 2 },
        { type: "flyer", w: 2, from: 2 },
        { type: "small_gasmask", w: 2 },
        { type: "gasmask", w: 1, from: 3 }
      ]
    },
    {
      world: 2,
      name: "Candle Light",
      map: "candles",
      waveCount: 6,
      hpMul: 4.32,
      base: 10,
      growth: 2.1,
      interval: 0.9,
      mix: [
        { type: "worker", w: 2 },
        { type: "small", w: 2 },
        { type: "armored", w: 2 },
        { type: "small_armed", w: 2 },
        { type: "sprinter", w: 1, from: 3 }
      ]
    },
    {
      world: 2,
      name: "Tea Party",
      map: "teaparty",
      waveCount: 7,
      hpMul: 6.365,
      base: 10.5,
      growth: 2.1,
      interval: 0.9,
      mix: [
        { type: "worker", w: 2 },
        { type: "small", w: 3 },
        { type: "small_fly", w: 2 },
        { type: "flyer", w: 2 },
        { type: "gasmask", w: 1 }
      ]
    },
    {
      world: 2,
      name: "Frosting Rush",
      map: "frosting",
      waveCount: 7,
      hpMul: 5.056,
      base: 11,
      growth: 2.2,
      interval: 0.85,
      mix: [
        { type: "small", w: 3 },
        { type: "worker", w: 2 },
        { type: "sprinter", w: 3 },
        { type: "small_armed", w: 1 },
        { type: "flyer", w: 1 }
      ]
    },
    {
      world: 2,
      name: "Heavy Icing",
      map: "snake",
      waveCount: 8,
      hpMul: 2.856,
      base: 11,
      growth: 2.2,
      interval: 0.9,
      mix: [
        { type: "worker", w: 2 },
        { type: "big", w: 2 },
        { type: "heavy", w: 1, from: 3 },
        { type: "armored", w: 2 },
        { type: "small", w: 2 }
      ]
    },
    {
      world: 2,
      name: "Sprinkle Storm",
      map: "layers",
      waveCount: 8,
      hpMul: 4.268,
      base: 11.5,
      growth: 2.3,
      interval: 0.85,
      mix: [
        { type: "small", w: 3 },
        { type: "flyer", w: 2 },
        { type: "small_fly", w: 3 },
        { type: "worker", w: 2 },
        { type: "small_gasmask", w: 2 }
      ]
    },
    {
      world: 2,
      name: "Cherry on Top",
      map: "candles",
      waveCount: 9,
      hpMul: 4.878,
      base: 12,
      growth: 2.4,
      interval: 0.8,
      mix: [
        { type: "worker", w: 2 },
        { type: "small", w: 3 },
        { type: "heavy", w: 1 },
        { type: "sprinter", w: 2 },
        { type: "small_fly", w: 2 }
      ]
    },
    {
      world: 2,
      name: "The Swift Queen",
      map: "cross",
      waveCount: 9,
      hpMul: 1.92,
      base: 12,
      growth: 2.4,
      interval: 0.8,
      mix: [{ type: "worker", w: 2 }, { type: "small", w: 2 }, { type: "sprinter", w: 2 }, { type: "flyer", w: 2 }],
      special: { "9": [{ type: "queen2", count: 1, interval: 1, delay: 4 }] }
    },
    {
      world: 3,
      name: "Pantry Door",
      map: "w3_shelves",
      waveCount: 6,
      hpMul: 3.3,
      interval: 1,
      waves: [
        [{ type: "worker", count: 6, interval: 1.1, delay: 0 }],
        [{ type: "small", count: 8, interval: 0.45, delay: 0 }, { type: "worker", count: 4, interval: 1.1, delay: 1 }],
        [
          { type: "worker", count: 6, interval: 1, delay: 0 },
          { type: "flyer", count: 2, interval: 0.8, delay: 1 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [{ type: "flyer", count: 4, interval: 0.8, delay: 0 }, { type: "worker", count: 6, interval: 1, delay: 0 }],
        [
          { type: "small", count: 10, interval: 0.45, delay: 0 },
          { type: "worker", count: 6, interval: 1, delay: 0 },
          { type: "flyer", count: 3, interval: 0.8, delay: 1 }
        ],
        [
          { type: "worker", count: 8, interval: 0.9, delay: 0 },
          { type: "small", count: 10, interval: 0.45, delay: 1 },
          { type: "flyer", count: 4, interval: 0.8, delay: 1 }
        ]
      ]
    },
    {
      world: 3,
      name: "Butter Fingers",
      map: "w3_butter",
      waveCount: 7,
      hpMul: 4.3,
      interval: 1,
      waves: [
        [{ type: "worker", count: 5, interval: 1, delay: 0 }, { type: "small", count: 6, interval: 0.45, delay: 1 }],
        [
          { type: "worker", count: 4, interval: 1, delay: 0 },
          { type: "greasy", count: 2, interval: 1.2, delay: 2 },
          { type: "small", count: 6, interval: 0.45, delay: 1 }
        ],
        [{ type: "small", count: 10, interval: 0.45, delay: 0 }, { type: "greasy", count: 3, interval: 1.1, delay: 2 }],
        [
          { type: "worker", count: 6, interval: 1, delay: 0 },
          { type: "small_fly", count: 6, interval: 0.5, delay: 1 },
          { type: "greasy", count: 3, interval: 1.1, delay: 1 }
        ],
        [
          { type: "greasy", count: 4, interval: 1, delay: 0 },
          { type: "small", count: 10, interval: 0.45, delay: 0 },
          { type: "worker", count: 4, interval: 1, delay: 0 }
        ],
        [
          { type: "small_fly", count: 8, interval: 0.5, delay: 0 },
          { type: "greasy", count: 5, interval: 1, delay: 1 },
          { type: "worker", count: 5, interval: 1, delay: 0 }
        ],
        [
          { type: "greasy", count: 6, interval: 0.9, delay: 0 },
          { type: "worker", count: 6, interval: 1, delay: 1 },
          { type: "small", count: 12, interval: 0.45, delay: 1 }
        ]
      ]
    },
    {
      world: 3,
      name: "Lattice",
      map: "w3_lattice",
      waveCount: 7,
      hpMul: 5.2,
      interval: 1,
      waves: [
        [{ type: "worker", count: 6, interval: 1, delay: 0 }, { type: "small", count: 8, interval: 0.45, delay: 1 }],
        [{ type: "flyer", count: 4, interval: 0.8, delay: 0 }, { type: "worker", count: 5, interval: 1, delay: 1 }],
        [
          { type: "small_fly", count: 8, interval: 0.5, delay: 0 },
          { type: "worker", count: 6, interval: 1, delay: 1 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "flyer", count: 5, interval: 0.8, delay: 0 },
          { type: "worker", count: 6, interval: 1, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 1 }
        ],
        [
          { type: "small_fly", count: 10, interval: 0.5, delay: 0 },
          { type: "flyer", count: 4, interval: 0.8, delay: 1 },
          { type: "worker", count: 6, interval: 1, delay: 1 }
        ],
        [
          { type: "worker", count: 8, interval: 0.9, delay: 0 },
          { type: "flyer", count: 6, interval: 0.8, delay: 1 },
          { type: "small", count: 12, interval: 0.45, delay: 1 }
        ],
        [
          { type: "small_fly", count: 12, interval: 0.5, delay: 0 },
          { type: "flyer", count: 6, interval: 0.75, delay: 1 },
          { type: "worker", count: 8, interval: 0.9, delay: 1 }
        ]
      ]
    },
    {
      world: 3,
      name: "Spice Rack",
      map: "w3_spice",
      waveCount: 7,
      hpMul: 4.9,
      interval: 1,
      waves: [
        [{ type: "worker", count: 5, interval: 1, delay: 0 }, { type: "small", count: 8, interval: 0.45, delay: 1 }],
        [{ type: "small_armed", count: 6, interval: 0.6, delay: 0 }, { type: "worker", count: 4, interval: 1, delay: 1 }],
        [
          { type: "worker", count: 6, interval: 1, delay: 0 },
          { type: "armored", count: 1, interval: 1.5, delay: 2 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "small_armed", count: 8, interval: 0.6, delay: 0 },
          { type: "small", count: 8, interval: 0.45, delay: 1 },
          { type: "armored", count: 2, interval: 1.5, delay: 2 }
        ],
        [
          { type: "worker", count: 8, interval: 0.9, delay: 0 },
          { type: "small_armed", count: 6, interval: 0.6, delay: 1 },
          { type: "armored", count: 2, interval: 1.5, delay: 1 }
        ],
        [
          { type: "small", count: 12, interval: 0.45, delay: 0 },
          { type: "armored", count: 3, interval: 1.5, delay: 1 },
          { type: "small_armed", count: 6, interval: 0.6, delay: 1 }
        ],
        [
          { type: "armored", count: 4, interval: 1.4, delay: 0 },
          { type: "worker", count: 8, interval: 0.9, delay: 1 },
          { type: "small_armed", count: 8, interval: 0.6, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 1 }
        ]
      ]
    },
    {
      world: 3,
      name: "Brood Nest",
      map: "w3_jar",
      waveCount: 7,
      hpMul: 8,
      interval: 1,
      waves: [
        [{ type: "worker", count: 6, interval: 1, delay: 0 }, { type: "small", count: 8, interval: 0.45, delay: 1 }],
        [
          { type: "worker", count: 6, interval: 1, delay: 0 },
          { type: "mama", count: 1, interval: 1.6, delay: 2 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "small_gasmask", count: 8, interval: 0.45, delay: 0 },
          { type: "worker", count: 6, interval: 1, delay: 1 },
          { type: "mama", count: 1, interval: 1.6, delay: 2 }
        ],
        [
          { type: "small", count: 10, interval: 0.45, delay: 0 },
          { type: "mama", count: 2, interval: 1.6, delay: 1 },
          { type: "worker", count: 5, interval: 1, delay: 1 }
        ],
        [
          { type: "small_gasmask", count: 10, interval: 0.45, delay: 0 },
          { type: "worker", count: 6, interval: 1, delay: 0 },
          { type: "mama", count: 2, interval: 1.6, delay: 2 }
        ],
        [
          { type: "worker", count: 8, interval: 0.9, delay: 0 },
          { type: "mama", count: 3, interval: 1.6, delay: 1 },
          { type: "small", count: 12, interval: 0.45, delay: 1 }
        ],
        [
          { type: "mama", count: 3, interval: 1.5, delay: 0 },
          { type: "small_gasmask", count: 12, interval: 0.45, delay: 1 },
          { type: "worker", count: 8, interval: 0.9, delay: 1 }
        ]
      ]
    },
    {
      world: 3,
      name: "Fruit Bowl",
      map: "w3_fruit",
      waveCount: 6,
      hpMul: 6,
      interval: 1,
      waves: [
        [{ type: "flyer", count: 4, interval: 0.8, delay: 0 }, { type: "worker", count: 5, interval: 1, delay: 1 }],
        [{ type: "small_fly", count: 8, interval: 0.5, delay: 0 }, { type: "worker", count: 5, interval: 1, delay: 1 }],
        [{ type: "flyer", count: 6, interval: 0.8, delay: 0 }, { type: "small", count: 8, interval: 0.45, delay: 1 }],
        [
          { type: "small_fly", count: 10, interval: 0.5, delay: 0 },
          { type: "flyer", count: 4, interval: 0.8, delay: 1 },
          { type: "worker", count: 4, interval: 1, delay: 1 }
        ],
        [
          { type: "flyer", count: 8, interval: 0.75, delay: 0 },
          { type: "small", count: 10, interval: 0.45, delay: 1 },
          { type: "worker", count: 5, interval: 1, delay: 0 }
        ],
        [
          { type: "small_fly", count: 12, interval: 0.5, delay: 0 },
          { type: "flyer", count: 8, interval: 0.7, delay: 1 },
          { type: "worker", count: 6, interval: 0.9, delay: 1 }
        ]
      ]
    },
    {
      world: 3,
      name: "Gas Mask Gala",
      map: "w3_gala",
      waveCount: 8,
      hpMul: 8,
      interval: 1,
      waves: [
        [
          { type: "worker", count: 5, interval: 1, delay: 0 },
          { type: "small_gasmask", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "gasmask", count: 4, interval: 1, delay: 0 },
          { type: "worker", count: 4, interval: 1, delay: 1 },
          { type: "small_gasmask", count: 6, interval: 0.45, delay: 1 }
        ],
        [
          { type: "greasy", count: 3, interval: 1.1, delay: 0 },
          { type: "gasmask", count: 4, interval: 1, delay: 1 },
          { type: "small_gasmask", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "flyer", count: 5, interval: 0.8, delay: 0 },
          { type: "gasmask", count: 5, interval: 1, delay: 1 },
          { type: "greasy", count: 3, interval: 1.1, delay: 1 }
        ],
        [
          { type: "small_gasmask", count: 12, interval: 0.45, delay: 0 },
          { type: "greasy", count: 4, interval: 1, delay: 1 },
          { type: "gasmask", count: 4, interval: 1, delay: 1 }
        ],
        [
          { type: "gasmask", count: 6, interval: 0.9, delay: 0 },
          { type: "greasy", count: 5, interval: 1, delay: 1 },
          { type: "flyer", count: 4, interval: 0.8, delay: 1 }
        ],
        [
          { type: "small_gasmask", count: 14, interval: 0.45, delay: 0 },
          { type: "gasmask", count: 6, interval: 0.9, delay: 1 },
          { type: "greasy", count: 5, interval: 1, delay: 1 }
        ],
        [
          { type: "gasmask", count: 8, interval: 0.85, delay: 0 },
          { type: "greasy", count: 6, interval: 0.95, delay: 1 },
          { type: "flyer", count: 5, interval: 0.8, delay: 1 },
          { type: "small_gasmask", count: 12, interval: 0.45, delay: 1 }
        ]
      ]
    },
    {
      world: 3,
      name: "Heavy Pastry",
      map: "w3_cloud",
      waveCount: 8,
      hpMul: 6,
      interval: 1,
      waves: [
        [{ type: "worker", count: 6, interval: 1, delay: 0 }, { type: "small", count: 8, interval: 0.45, delay: 1 }],
        [
          { type: "flyer", count: 4, interval: 0.8, delay: 0 },
          { type: "worker", count: 6, interval: 1, delay: 1 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "big", count: 2, interval: 1.6, delay: 1 },
          { type: "worker", count: 6, interval: 1, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 1 }
        ],
        [
          { type: "flyer", count: 5, interval: 0.8, delay: 0 },
          { type: "big", count: 3, interval: 1.6, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 1 }
        ],
        [
          { type: "heavy", count: 1, interval: 1.7, delay: 2 },
          { type: "big", count: 2, interval: 1.6, delay: 0 },
          { type: "worker", count: 6, interval: 1, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 1 }
        ],
        [
          { type: "big", count: 4, interval: 1.5, delay: 0 },
          { type: "flyer", count: 5, interval: 0.8, delay: 1 },
          { type: "small", count: 12, interval: 0.45, delay: 1 }
        ],
        [
          { type: "heavy", count: 2, interval: 1.7, delay: 2 },
          { type: "big", count: 3, interval: 1.5, delay: 0 },
          { type: "worker", count: 8, interval: 0.9, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 1 }
        ],
        [
          { type: "heavy", count: 3, interval: 1.6, delay: 1 },
          { type: "big", count: 4, interval: 1.5, delay: 1 },
          { type: "flyer", count: 5, interval: 0.8, delay: 1 },
          { type: "worker", count: 6, interval: 0.9, delay: 1 }
        ]
      ]
    },
    {
      world: 3,
      name: "Everything Pie",
      map: "w3_every",
      waveCount: 9,
      hpMul: 8.7,
      interval: 1,
      waves: [
        [{ type: "worker", count: 6, interval: 1, delay: 0 }, { type: "small", count: 8, interval: 0.45, delay: 1 }],
        [
          { type: "greasy", count: 3, interval: 1.1, delay: 0 },
          { type: "small", count: 8, interval: 0.45, delay: 0 },
          { type: "worker", count: 4, interval: 1, delay: 1 }
        ],
        [
          { type: "sprinter", count: 4, interval: 0.9, delay: 1 },
          { type: "worker", count: 6, interval: 1, delay: 1 },
          { type: "small", count: 8, interval: 0.45, delay: 0 }
        ],
        [
          { type: "mama", count: 1, interval: 1.6, delay: 2 },
          { type: "greasy", count: 4, interval: 1, delay: 0 },
          { type: "small", count: 10, interval: 0.45, delay: 1 }
        ],
        [
          { type: "sprinter", count: 6, interval: 0.9, delay: 0 },
          { type: "worker", count: 6, interval: 1, delay: 1 },
          { type: "greasy", count: 4, interval: 1, delay: 1 }
        ],
        [
          { type: "mama", count: 2, interval: 1.6, delay: 0 },
          { type: "small", count: 12, interval: 0.45, delay: 1 },
          { type: "sprinter", count: 4, interval: 0.9, delay: 1 }
        ],
        [
          { type: "greasy", count: 6, interval: 0.95, delay: 0 },
          { type: "sprinter", count: 6, interval: 0.9, delay: 1 },
          { type: "worker", count: 8, interval: 0.9, delay: 1 }
        ],
        [
          { type: "mama", count: 3, interval: 1.5, delay: 0 },
          { type: "small", count: 14, interval: 0.45, delay: 1 },
          { type: "greasy", count: 5, interval: 1, delay: 1 }
        ],
        [
          { type: "sprinter", count: 8, interval: 0.85, delay: 0 },
          { type: "mama", count: 3, interval: 1.5, delay: 1 },
          { type: "greasy", count: 6, interval: 0.95, delay: 1 },
          { type: "worker", count: 8, interval: 0.9, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 1 }
        ]
      ]
    },
    {
      world: 3,
      name: "Pie Queen",
      map: "w3_tin",
      waveCount: 9,
      hpMul: 1.45,
      interval: 1,
      waves: [
        [{ type: "worker", count: 6, interval: 1, delay: 0 }, { type: "small", count: 8, interval: 0.45, delay: 1 }],
        [
          { type: "flyer", count: 4, interval: 0.8, delay: 0 },
          { type: "worker", count: 5, interval: 1, delay: 1 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "greasy", count: 3, interval: 1.1, delay: 0 },
          { type: "worker", count: 6, interval: 1, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 1 }
        ],
        [
          { type: "flyer", count: 5, interval: 0.8, delay: 0 },
          { type: "greasy", count: 4, interval: 1, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 0 }
        ],
        [
          { type: "worker", count: 8, interval: 0.9, delay: 0 },
          { type: "greasy", count: 4, interval: 1, delay: 1 },
          { type: "flyer", count: 4, interval: 0.8, delay: 1 }
        ],
        [
          { type: "small", count: 14, interval: 0.45, delay: 0 },
          { type: "flyer", count: 6, interval: 0.8, delay: 1 },
          { type: "greasy", count: 4, interval: 1, delay: 1 }
        ],
        [
          { type: "greasy", count: 6, interval: 0.95, delay: 0 },
          { type: "worker", count: 8, interval: 0.9, delay: 0 },
          { type: "flyer", count: 6, interval: 0.8, delay: 1 }
        ],
        [
          { type: "small", count: 14, interval: 0.45, delay: 0 },
          { type: "greasy", count: 6, interval: 0.95, delay: 1 },
          { type: "worker", count: 8, interval: 0.9, delay: 1 },
          { type: "flyer", count: 5, interval: 0.8, delay: 1 }
        ],
        [
          { type: "worker", count: 8, interval: 0.9, delay: 0 },
          { type: "greasy", count: 5, interval: 1, delay: 1 },
          { type: "flyer", count: 5, interval: 0.8, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 1 },
          { type: "queen3", count: 1, interval: 1, delay: 4 }
        ]
      ]
    },
    {
      world: 4,
      name: "Sundae Counter",
      map: "w4_counter",
      waveCount: 6,
      hpMul: 3.9,
      interval: 1,
      waves: [
        [{ type: "worker", count: 6, interval: 1.1, delay: 0 }],
        [{ type: "small", count: 8, interval: 0.45, delay: 0 }, { type: "worker", count: 4, interval: 1.1, delay: 1 }],
        [
          { type: "worker", count: 6, interval: 1, delay: 0 },
          { type: "flyer", count: 3, interval: 0.8, delay: 1 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [{ type: "flyer", count: 4, interval: 0.8, delay: 0 }, { type: "worker", count: 6, interval: 1, delay: 0 }],
        [
          { type: "small", count: 10, interval: 0.45, delay: 0 },
          { type: "worker", count: 6, interval: 1, delay: 0 },
          { type: "flyer", count: 4, interval: 0.8, delay: 1 }
        ],
        [
          { type: "worker", count: 8, interval: 0.9, delay: 0 },
          { type: "small", count: 12, interval: 0.45, delay: 1 },
          { type: "flyer", count: 4, interval: 0.8, delay: 1 }
        ]
      ]
    },
    {
      world: 4,
      name: "Scoop Lane",
      map: "w4_scoop",
      waveCount: 7,
      hpMul: 4.5,
      interval: 1,
      waves: [
        [{ type: "worker", count: 6, interval: 1, delay: 0 }, { type: "small", count: 8, interval: 0.45, delay: 1 }],
        [
          { type: "worker", count: 5, interval: 1, delay: 0 },
          { type: "nurse", count: 1, interval: 1.5, delay: 2 },
          { type: "small", count: 6, interval: 0.45, delay: 1 }
        ],
        [
          { type: "small", count: 10, interval: 0.45, delay: 0 },
          { type: "nurse", count: 1, interval: 1.5, delay: 1 },
          { type: "worker", count: 5, interval: 1, delay: 1 }
        ],
        [
          { type: "worker", count: 6, interval: 1, delay: 0 },
          { type: "nurse", count: 2, interval: 1.5, delay: 1 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "small", count: 12, interval: 0.45, delay: 0 },
          { type: "nurse", count: 2, interval: 1.5, delay: 2 },
          { type: "worker", count: 6, interval: 1, delay: 1 }
        ],
        [
          { type: "worker", count: 8, interval: 0.9, delay: 0 },
          { type: "nurse", count: 2, interval: 1.4, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 1 }
        ],
        [
          { type: "small", count: 12, interval: 0.45, delay: 0 },
          { type: "nurse", count: 3, interval: 1.4, delay: 1 },
          { type: "worker", count: 8, interval: 0.9, delay: 1 }
        ]
      ]
    },
    {
      world: 4,
      name: "Cone Crossing",
      map: "w4_cone",
      waveCount: 7,
      hpMul: 7.4,
      interval: 1,
      waves: [
        [{ type: "worker", count: 6, interval: 1, delay: 0 }, { type: "small", count: 8, interval: 0.45, delay: 1 }],
        [{ type: "flyer", count: 4, interval: 0.8, delay: 0 }, { type: "worker", count: 5, interval: 1, delay: 1 }],
        [
          { type: "small_fly", count: 8, interval: 0.5, delay: 0 },
          { type: "worker", count: 6, interval: 1, delay: 1 },
          { type: "nurse", count: 1, interval: 1.5, delay: 2 }
        ],
        [
          { type: "flyer", count: 5, interval: 0.8, delay: 0 },
          { type: "small", count: 10, interval: 0.45, delay: 1 },
          { type: "nurse", count: 1, interval: 1.5, delay: 1 }
        ],
        [
          { type: "small_fly", count: 10, interval: 0.5, delay: 0 },
          { type: "flyer", count: 4, interval: 0.8, delay: 1 },
          { type: "worker", count: 6, interval: 1, delay: 1 },
          { type: "nurse", count: 2, interval: 1.5, delay: 2 }
        ],
        [
          { type: "worker", count: 8, interval: 0.9, delay: 0 },
          { type: "flyer", count: 6, interval: 0.8, delay: 1 },
          { type: "nurse", count: 2, interval: 1.4, delay: 1 },
          { type: "small", count: 8, interval: 0.45, delay: 0 }
        ],
        [
          { type: "small_fly", count: 12, interval: 0.5, delay: 0 },
          { type: "flyer", count: 6, interval: 0.75, delay: 1 },
          { type: "worker", count: 8, interval: 0.9, delay: 1 },
          { type: "nurse", count: 2, interval: 1.4, delay: 2 }
        ]
      ]
    },
    {
      world: 4,
      name: "Sprinkle Switchback",
      map: "w4_sprinkle",
      waveCount: 7,
      hpMul: 7.25,
      interval: 1,
      waves: [
        [{ type: "worker", count: 6, interval: 1, delay: 0 }, { type: "small", count: 8, interval: 0.45, delay: 1 }],
        [
          { type: "small_armed", count: 4, interval: 0.6, delay: 0 },
          { type: "worker", count: 4, interval: 1, delay: 1 },
          { type: "small", count: 6, interval: 0.45, delay: 1 }
        ],
        [
          { type: "armored", count: 2, interval: 1.5, delay: 1 },
          { type: "worker", count: 4, interval: 1, delay: 0 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "nurse", count: 1, interval: 1.5, delay: 0 },
          { type: "armored", count: 2, interval: 1.5, delay: 0.5 },
          { type: "worker", count: 4, interval: 1, delay: 1 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "nurse", count: 1, interval: 1.5, delay: 0 },
          { type: "armored", count: 3, interval: 1.4, delay: 0.5 },
          { type: "worker", count: 4, interval: 1, delay: 1 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "nurse", count: 2, interval: 1.4, delay: 0 },
          { type: "armored", count: 3, interval: 1.4, delay: 0.5 },
          { type: "small_armed", count: 4, interval: 0.6, delay: 2 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "nurse", count: 2, interval: 1.4, delay: 0 },
          { type: "armored", count: 4, interval: 1.3, delay: 0.5 },
          { type: "worker", count: 6, interval: 1, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 1 }
        ]
      ]
    },
    {
      world: 4,
      name: "Waffle Grid",
      map: "w4_waffle",
      waveCount: 7,
      hpMul: 6.65,
      interval: 1,
      waves: [
        [{ type: "worker", count: 6, interval: 1, delay: 0 }, { type: "small", count: 8, interval: 0.45, delay: 1 }],
        [
          { type: "greasy", count: 3, interval: 1.1, delay: 0 },
          { type: "worker", count: 4, interval: 1, delay: 1 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "mama", count: 1, interval: 1.6, delay: 1 },
          { type: "worker", count: 4, interval: 1, delay: 0 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "nurse", count: 1, interval: 1.5, delay: 0 },
          { type: "mama", count: 1, interval: 1.6, delay: 0.5 },
          { type: "greasy", count: 3, interval: 1, delay: 1 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "nurse", count: 1, interval: 1.5, delay: 0 },
          { type: "mama", count: 2, interval: 1.6, delay: 0.5 },
          { type: "greasy", count: 3, interval: 1, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 1 }
        ],
        [
          { type: "nurse", count: 2, interval: 1.4, delay: 0 },
          { type: "mama", count: 2, interval: 1.5, delay: 0.5 },
          { type: "greasy", count: 4, interval: 1, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 1 }
        ],
        [
          { type: "nurse", count: 2, interval: 1.4, delay: 0 },
          { type: "mama", count: 3, interval: 1.5, delay: 0.5 },
          { type: "worker", count: 4, interval: 1, delay: 1 },
          { type: "small", count: 12, interval: 0.45, delay: 1 }
        ]
      ]
    },
    {
      world: 4,
      name: "Cherry Top",
      map: "w4_cherry",
      waveCount: 6,
      hpMul: 7.7,
      interval: 1,
      waves: [
        [{ type: "worker", count: 6, interval: 1, delay: 0 }, { type: "small", count: 8, interval: 0.45, delay: 1 }],
        [{ type: "flyer", count: 4, interval: 0.8, delay: 0 }, { type: "worker", count: 5, interval: 1, delay: 1 }],
        [
          { type: "small_fly", count: 8, interval: 0.5, delay: 0 },
          { type: "small", count: 8, interval: 0.45, delay: 1 },
          { type: "nurse", count: 1, interval: 1.5, delay: 2 }
        ],
        [
          { type: "worker", count: 6, interval: 1, delay: 0 },
          { type: "flyer", count: 5, interval: 0.8, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 1 }
        ],
        [
          { type: "small_fly", count: 10, interval: 0.5, delay: 0 },
          { type: "nurse", count: 1, interval: 1.5, delay: 1 },
          { type: "worker", count: 6, interval: 1, delay: 1 }
        ],
        [
          { type: "worker", count: 8, interval: 0.9, delay: 0 },
          { type: "flyer", count: 6, interval: 0.8, delay: 1 },
          { type: "small", count: 12, interval: 0.45, delay: 1 },
          { type: "nurse", count: 2, interval: 1.4, delay: 2 }
        ]
      ]
    },
    {
      world: 4,
      name: "Fudge Fork",
      map: "w4_fudge",
      waveCount: 8,
      hpMul: 5.9,
      interval: 1,
      waves: [
        [
          { type: "worker", count: 5, interval: 1, delay: 0 },
          { type: "small_gasmask", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "gasmask", count: 4, interval: 1, delay: 0 },
          { type: "worker", count: 4, interval: 1, delay: 1 },
          { type: "small_gasmask", count: 6, interval: 0.45, delay: 1 }
        ],
        [
          { type: "flyer", count: 4, interval: 0.8, delay: 0 },
          { type: "gasmask", count: 4, interval: 1, delay: 1 },
          { type: "small_gasmask", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "gasmask", count: 5, interval: 1, delay: 0 },
          { type: "flyer", count: 4, interval: 0.8, delay: 1 },
          { type: "nurse", count: 1, interval: 1.5, delay: 2 },
          { type: "worker", count: 4, interval: 1, delay: 0 }
        ],
        [
          { type: "small_gasmask", count: 12, interval: 0.45, delay: 0 },
          { type: "flyer", count: 4, interval: 0.8, delay: 1 },
          { type: "gasmask", count: 4, interval: 1, delay: 1 },
          { type: "nurse", count: 1, interval: 1.5, delay: 2 }
        ],
        [
          { type: "gasmask", count: 6, interval: 0.9, delay: 0 },
          { type: "flyer", count: 5, interval: 0.8, delay: 1 },
          { type: "nurse", count: 2, interval: 1.4, delay: 1 },
          { type: "worker", count: 4, interval: 1, delay: 0 }
        ],
        [
          { type: "small_gasmask", count: 14, interval: 0.45, delay: 0 },
          { type: "gasmask", count: 6, interval: 0.9, delay: 1 },
          { type: "flyer", count: 5, interval: 0.8, delay: 1 },
          { type: "nurse", count: 2, interval: 1.4, delay: 2 }
        ],
        [
          { type: "gasmask", count: 8, interval: 0.85, delay: 0 },
          { type: "flyer", count: 6, interval: 0.8, delay: 1 },
          { type: "nurse", count: 2, interval: 1.4, delay: 1 },
          { type: "small_gasmask", count: 12, interval: 0.45, delay: 1 },
          { type: "worker", count: 5, interval: 0.9, delay: 0 }
        ]
      ]
    },
    {
      world: 4,
      name: "Syrup Spiral",
      map: "w4_spiral",
      waveCount: 8,
      hpMul: 7.4,
      interval: 1,
      waves: [
        [{ type: "worker", count: 6, interval: 1, delay: 0 }, { type: "small", count: 8, interval: 0.45, delay: 1 }],
        [
          { type: "flyer", count: 4, interval: 0.8, delay: 0 },
          { type: "worker", count: 4, interval: 1, delay: 1 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "nurse", count: 1, interval: 1.5, delay: 1 },
          { type: "worker", count: 4, interval: 1, delay: 0 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "nurse", count: 1, interval: 1.5, delay: 0 },
          { type: "flyer", count: 4, interval: 0.8, delay: 1 },
          { type: "worker", count: 4, interval: 1, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 1 }
        ],
        [
          { type: "heavy", count: 1, interval: 1.7, delay: 1 },
          { type: "nurse", count: 1, interval: 1.5, delay: 0.5 },
          { type: "worker", count: 4, interval: 1, delay: 1 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "heavy", count: 1, interval: 1.7, delay: 0.5 },
          { type: "nurse", count: 2, interval: 1.4, delay: 0 },
          { type: "worker", count: 4, interval: 1, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 1 }
        ],
        [
          { type: "heavy", count: 2, interval: 1.7, delay: 0.5 },
          { type: "nurse", count: 2, interval: 1.4, delay: 0 },
          { type: "flyer", count: 4, interval: 0.8, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 1 }
        ],
        [
          { type: "heavy", count: 3, interval: 1.6, delay: 0.5 },
          { type: "nurse", count: 2, interval: 1.4, delay: 0 },
          { type: "worker", count: 4, interval: 1, delay: 1 },
          { type: "small", count: 12, interval: 0.45, delay: 1 }
        ]
      ]
    },
    {
      world: 4,
      name: "Banana Split",
      map: "w4_banana",
      waveCount: 9,
      hpMul: 5.35,
      interval: 1,
      waves: [
        [{ type: "worker", count: 6, interval: 1, delay: 0 }, { type: "small", count: 8, interval: 0.45, delay: 1 }],
        [
          { type: "greasy", count: 3, interval: 1.1, delay: 0 },
          { type: "small", count: 8, interval: 0.45, delay: 0 },
          { type: "worker", count: 4, interval: 1, delay: 1 }
        ],
        [
          { type: "sprinter", count: 4, interval: 0.9, delay: 1 },
          { type: "worker", count: 6, interval: 1, delay: 1 },
          { type: "small", count: 8, interval: 0.45, delay: 0 },
          { type: "nurse", count: 1, interval: 1.5, delay: 2 }
        ],
        [
          { type: "greasy", count: 4, interval: 1, delay: 0 },
          { type: "nurse", count: 1, interval: 1.5, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 1 }
        ],
        [
          { type: "sprinter", count: 6, interval: 0.9, delay: 0 },
          { type: "worker", count: 6, interval: 1, delay: 1 },
          { type: "greasy", count: 4, interval: 1, delay: 1 },
          { type: "nurse", count: 1, interval: 1.5, delay: 2 }
        ],
        [
          { type: "small", count: 14, interval: 0.45, delay: 0 },
          { type: "nurse", count: 2, interval: 1.4, delay: 1 },
          { type: "greasy", count: 5, interval: 1, delay: 1 },
          { type: "sprinter", count: 4, interval: 0.9, delay: 1 }
        ],
        [
          { type: "worker", count: 8, interval: 0.9, delay: 0 },
          { type: "sprinter", count: 6, interval: 0.85, delay: 1 },
          { type: "greasy", count: 5, interval: 1, delay: 1 },
          { type: "nurse", count: 2, interval: 1.4, delay: 2 }
        ],
        [
          { type: "small", count: 14, interval: 0.45, delay: 0 },
          { type: "greasy", count: 6, interval: 0.95, delay: 1 },
          { type: "sprinter", count: 6, interval: 0.85, delay: 1 },
          { type: "nurse", count: 3, interval: 1.4, delay: 1 }
        ],
        [
          { type: "worker", count: 8, interval: 0.9, delay: 0 },
          { type: "sprinter", count: 8, interval: 0.8, delay: 1 },
          { type: "greasy", count: 6, interval: 0.95, delay: 1 },
          { type: "nurse", count: 3, interval: 1.4, delay: 1 },
          { type: "small", count: 12, interval: 0.45, delay: 1 }
        ]
      ]
    },
    {
      world: 4,
      name: "Parlour Floor",
      map: "w4_floor",
      waveCount: 9,
      hpMul: 0.8,
      interval: 1,
      waves: [
        [{ type: "worker", count: 6, interval: 1, delay: 0 }, { type: "small", count: 8, interval: 0.45, delay: 1 }],
        [
          { type: "flyer", count: 4, interval: 0.8, delay: 0 },
          { type: "worker", count: 5, interval: 1, delay: 1 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "nurse", count: 1, interval: 1.5, delay: 2 },
          { type: "worker", count: 6, interval: 1, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 1 }
        ],
        [
          { type: "flyer", count: 5, interval: 0.8, delay: 0 },
          { type: "nurse", count: 1, interval: 1.5, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 0 }
        ],
        [
          { type: "worker", count: 8, interval: 0.9, delay: 0 },
          { type: "nurse", count: 2, interval: 1.5, delay: 1 },
          { type: "flyer", count: 4, interval: 0.8, delay: 1 }
        ],
        [
          { type: "small", count: 14, interval: 0.45, delay: 0 },
          { type: "flyer", count: 6, interval: 0.8, delay: 1 },
          { type: "nurse", count: 2, interval: 1.4, delay: 1 }
        ],
        [
          { type: "nurse", count: 2, interval: 1.4, delay: 0 },
          { type: "worker", count: 8, interval: 0.9, delay: 1 },
          { type: "flyer", count: 6, interval: 0.8, delay: 1 }
        ],
        [
          { type: "small", count: 14, interval: 0.45, delay: 0 },
          { type: "nurse", count: 3, interval: 1.4, delay: 1 },
          { type: "worker", count: 8, interval: 0.9, delay: 1 },
          { type: "flyer", count: 5, interval: 0.8, delay: 1 }
        ],
        [
          { type: "worker", count: 8, interval: 0.9, delay: 0 },
          { type: "nurse", count: 2, interval: 1.4, delay: 1 },
          { type: "flyer", count: 5, interval: 0.8, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 1 },
          { type: "queen4", count: 1, interval: 1, delay: 4 }
        ]
      ]
    },
    {
      world: 5,
      name: "Donut Counter",
      map: "w5_counter",
      waveCount: 6,
      hpMul: 4.2,
      interval: 1,
      waves: [
        [{ type: "worker", count: 6, interval: 1, delay: 0 }, { type: "small", count: 8, interval: 0.45, delay: 1 }],
        [{ type: "small", count: 8, interval: 0.45, delay: 0 }, { type: "worker", count: 4, interval: 1, delay: 1 }],
        [
          { type: "worker", count: 6, interval: 1, delay: 0 },
          { type: "flyer", count: 3, interval: 0.8, delay: 1 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [{ type: "flyer", count: 4, interval: 0.8, delay: 0 }, { type: "worker", count: 6, interval: 1, delay: 0 }],
        [
          { type: "small", count: 10, interval: 0.45, delay: 0 },
          { type: "worker", count: 6, interval: 1, delay: 0 },
          { type: "flyer", count: 4, interval: 0.8, delay: 1 }
        ],
        [
          { type: "worker", count: 8, interval: 0.9, delay: 0 },
          { type: "small", count: 12, interval: 0.45, delay: 1 },
          { type: "flyer", count: 4, interval: 0.8, delay: 1 }
        ]
      ]
    },
    {
      world: 5,
      name: "Sprinkle Stool",
      map: "w5_stool",
      waveCount: 6,
      hpMul: 4.5,
      interval: 1,
      waves: [
        [{ type: "worker", count: 6, interval: 1, delay: 0 }, { type: "small", count: 8, interval: 0.45, delay: 1 }],
        [
          { type: "worker", count: 5, interval: 1, delay: 0 },
          { type: "glazed", count: 2, interval: 1.5, delay: 2 },
          { type: "small", count: 6, interval: 0.45, delay: 1 }
        ],
        [
          { type: "small", count: 10, interval: 0.45, delay: 0 },
          { type: "glazed", count: 2, interval: 1.5, delay: 1 },
          { type: "worker", count: 5, interval: 1, delay: 1 }
        ],
        [
          { type: "worker", count: 6, interval: 1, delay: 0 },
          { type: "glazed", count: 3, interval: 1.4, delay: 1 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "small", count: 12, interval: 0.45, delay: 0 },
          { type: "glazed", count: 3, interval: 1.4, delay: 2 },
          { type: "worker", count: 6, interval: 1, delay: 1 }
        ],
        [
          { type: "worker", count: 8, interval: 0.9, delay: 0 },
          { type: "glazed", count: 4, interval: 1.3, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 1 }
        ]
      ]
    },
    {
      world: 5,
      name: "Jelly Booth",
      map: "w5_jelly",
      waveCount: 7,
      hpMul: 9.3,
      interval: 1,
      waves: [
        [{ type: "worker", count: 6, interval: 1, delay: 0 }, { type: "small", count: 8, interval: 0.45, delay: 1 }],
        [{ type: "flyer", count: 4, interval: 0.8, delay: 0 }, { type: "worker", count: 5, interval: 1, delay: 1 }],
        [
          { type: "small_fly", count: 8, interval: 0.5, delay: 0 },
          { type: "glazed", count: 2, interval: 1.5, delay: 1 },
          { type: "worker", count: 6, interval: 1, delay: 1 }
        ],
        [
          { type: "flyer", count: 5, interval: 0.8, delay: 0 },
          { type: "glazed", count: 3, interval: 1.4, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 1 }
        ],
        [
          { type: "small_fly", count: 10, interval: 0.5, delay: 0 },
          { type: "flyer", count: 4, interval: 0.8, delay: 1 },
          { type: "glazed", count: 3, interval: 1.4, delay: 1 },
          { type: "worker", count: 6, interval: 1, delay: 1 }
        ],
        [
          { type: "worker", count: 8, interval: 0.9, delay: 0 },
          { type: "flyer", count: 6, interval: 0.8, delay: 1 },
          { type: "glazed", count: 4, interval: 1.3, delay: 1 }
        ],
        [
          { type: "small_fly", count: 12, interval: 0.5, delay: 0 },
          { type: "flyer", count: 6, interval: 0.75, delay: 1 },
          { type: "glazed", count: 4, interval: 1.3, delay: 1 },
          { type: "worker", count: 8, interval: 0.9, delay: 1 }
        ]
      ]
    },
    {
      world: 5,
      name: "Cruller Corner",
      map: "w5_cruller",
      waveCount: 7,
      hpMul: 8.35,
      interval: 1,
      waves: [
        [{ type: "worker", count: 6, interval: 1, delay: 0 }, { type: "small", count: 8, interval: 0.45, delay: 1 }],
        [
          { type: "small_armed", count: 4, interval: 0.6, delay: 0 },
          { type: "worker", count: 4, interval: 1, delay: 1 },
          { type: "small", count: 6, interval: 0.45, delay: 1 }
        ],
        [
          { type: "armored", count: 2, interval: 1.5, delay: 1 },
          { type: "worker", count: 4, interval: 1, delay: 0 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "glazed", count: 3, interval: 1.4, delay: 0 },
          { type: "armored", count: 2, interval: 1.5, delay: 1 },
          { type: "worker", count: 4, interval: 1, delay: 1 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "glazed", count: 3, interval: 1.4, delay: 0 },
          { type: "armored", count: 3, interval: 1.4, delay: 1 },
          { type: "small_armed", count: 4, interval: 0.6, delay: 1 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "glazed", count: 4, interval: 1.3, delay: 0 },
          { type: "armored", count: 3, interval: 1.4, delay: 1 },
          { type: "worker", count: 6, interval: 1, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 1 }
        ],
        [
          { type: "glazed", count: 4, interval: 1.3, delay: 0 },
          { type: "armored", count: 4, interval: 1.3, delay: 1 },
          { type: "worker", count: 6, interval: 1, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 1 }
        ]
      ]
    },
    {
      world: 5,
      name: "Glaze Line",
      map: "w5_glaze",
      waveCount: 7,
      hpMul: 5.4,
      interval: 1,
      waves: [
        [{ type: "worker", count: 6, interval: 1, delay: 0 }, { type: "small", count: 8, interval: 0.45, delay: 1 }],
        [
          { type: "greasy", count: 3, interval: 1.1, delay: 0 },
          { type: "worker", count: 4, interval: 1, delay: 1 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "glazed", count: 3, interval: 1.4, delay: 0 },
          { type: "mama", count: 1, interval: 1.6, delay: 1 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "glazed", count: 3, interval: 1.3, delay: 0 },
          { type: "mama", count: 1, interval: 1.6, delay: 1 },
          { type: "greasy", count: 3, interval: 1, delay: 1 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "glazed", count: 3, interval: 1.3, delay: 0 },
          { type: "mama", count: 1, interval: 1.6, delay: 1 },
          { type: "greasy", count: 3, interval: 1, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 1 }
        ],
        [
          { type: "glazed", count: 3, interval: 1.2, delay: 0 },
          { type: "mama", count: 2, interval: 1.5, delay: 1 },
          { type: "greasy", count: 4, interval: 1, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 1 }
        ],
        [
          { type: "glazed", count: 3, interval: 1.2, delay: 0 },
          { type: "mama", count: 2, interval: 1.5, delay: 1 },
          { type: "worker", count: 4, interval: 1, delay: 1 },
          { type: "small", count: 12, interval: 0.45, delay: 1 }
        ]
      ]
    },
    {
      world: 5,
      name: "Coffee Break",
      map: "w5_coffee",
      waveCount: 6,
      hpMul: 8.8,
      interval: 1,
      waves: [
        [{ type: "worker", count: 6, interval: 1, delay: 0 }, { type: "small", count: 8, interval: 0.45, delay: 1 }],
        [{ type: "flyer", count: 4, interval: 0.8, delay: 0 }, { type: "worker", count: 5, interval: 1, delay: 1 }],
        [
          { type: "small_fly", count: 8, interval: 0.5, delay: 0 },
          { type: "glazed", count: 2, interval: 1.5, delay: 1 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "worker", count: 6, interval: 1, delay: 0 },
          { type: "flyer", count: 5, interval: 0.8, delay: 1 },
          { type: "glazed", count: 2, interval: 1.5, delay: 1 }
        ],
        [
          { type: "small_fly", count: 10, interval: 0.5, delay: 0 },
          { type: "glazed", count: 3, interval: 1.4, delay: 1 },
          { type: "worker", count: 6, interval: 1, delay: 1 }
        ],
        [
          { type: "worker", count: 8, interval: 0.9, delay: 0 },
          { type: "flyer", count: 6, interval: 0.8, delay: 1 },
          { type: "glazed", count: 3, interval: 1.4, delay: 1 },
          { type: "small", count: 12, interval: 0.45, delay: 1 }
        ]
      ]
    },
    {
      world: 5,
      name: "Maple Bar",
      map: "w5_maple",
      waveCount: 7,
      hpMul: 6.25,
      interval: 1,
      waves: [
        [
          { type: "worker", count: 5, interval: 1, delay: 0 },
          { type: "small_gasmask", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "gasmask", count: 4, interval: 1, delay: 0 },
          { type: "worker", count: 4, interval: 1, delay: 1 },
          { type: "small_gasmask", count: 6, interval: 0.45, delay: 1 }
        ],
        [
          { type: "flyer", count: 4, interval: 0.8, delay: 0 },
          { type: "gasmask", count: 4, interval: 1, delay: 1 },
          { type: "small_gasmask", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "gasmask", count: 5, interval: 1, delay: 0 },
          { type: "glazed", count: 3, interval: 1.4, delay: 1 },
          { type: "worker", count: 4, interval: 1, delay: 1 }
        ],
        [
          { type: "small_gasmask", count: 12, interval: 0.45, delay: 0 },
          { type: "glazed", count: 3, interval: 1.4, delay: 1 },
          { type: "gasmask", count: 4, interval: 1, delay: 1 }
        ],
        [
          { type: "gasmask", count: 6, interval: 0.9, delay: 0 },
          { type: "glazed", count: 4, interval: 1.3, delay: 1 },
          { type: "flyer", count: 5, interval: 0.8, delay: 1 }
        ],
        [
          { type: "small_gasmask", count: 14, interval: 0.45, delay: 0 },
          { type: "gasmask", count: 6, interval: 0.9, delay: 1 },
          { type: "glazed", count: 4, interval: 1.3, delay: 1 },
          { type: "flyer", count: 5, interval: 0.8, delay: 1 }
        ]
      ]
    },
    {
      world: 5,
      name: "Boston Cream",
      map: "w5_boston",
      waveCount: 8,
      hpMul: 6.75,
      interval: 1,
      waves: [
        [{ type: "worker", count: 6, interval: 1, delay: 0 }, { type: "small", count: 8, interval: 0.45, delay: 1 }],
        [
          { type: "flyer", count: 4, interval: 0.8, delay: 0 },
          { type: "worker", count: 4, interval: 1, delay: 1 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "glazed", count: 3, interval: 1.4, delay: 0 },
          { type: "worker", count: 4, interval: 1, delay: 1 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "glazed", count: 4, interval: 1.3, delay: 0 },
          { type: "flyer", count: 4, interval: 0.8, delay: 1 },
          { type: "worker", count: 4, interval: 1, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 1 }
        ],
        [
          { type: "heavy", count: 1, interval: 1.7, delay: 1 },
          { type: "glazed", count: 3, interval: 1.4, delay: 1 },
          { type: "worker", count: 4, interval: 1, delay: 1 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "heavy", count: 1, interval: 1.7, delay: 0.5 },
          { type: "glazed", count: 4, interval: 1.3, delay: 0 },
          { type: "worker", count: 4, interval: 1, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 1 }
        ],
        [
          { type: "heavy", count: 2, interval: 1.7, delay: 0.5 },
          { type: "glazed", count: 4, interval: 1.3, delay: 0 },
          { type: "flyer", count: 4, interval: 0.8, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 1 }
        ],
        [
          { type: "heavy", count: 3, interval: 1.6, delay: 0.5 },
          { type: "glazed", count: 5, interval: 1.2, delay: 0 },
          { type: "worker", count: 4, interval: 1, delay: 1 },
          { type: "small", count: 12, interval: 0.45, delay: 1 }
        ]
      ]
    },
    {
      world: 5,
      name: "Baker's Dozen",
      map: "w5_dozen",
      waveCount: 7,
      hpMul: 5.45,
      interval: 1,
      waves: [
        [{ type: "worker", count: 6, interval: 1, delay: 0 }, { type: "small", count: 8, interval: 0.45, delay: 1 }],
        [
          { type: "sprinter", count: 4, interval: 0.9, delay: 1 },
          { type: "worker", count: 5, interval: 1, delay: 1 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "glazed", count: 3, interval: 1.4, delay: 0 },
          { type: "sprinter", count: 4, interval: 0.9, delay: 1 },
          { type: "worker", count: 5, interval: 1, delay: 1 }
        ],
        [
          { type: "glazed", count: 4, interval: 1.3, delay: 0 },
          { type: "nurse", count: 1, interval: 1.5, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 1 },
          { type: "sprinter", count: 4, interval: 0.9, delay: 1 }
        ],
        [
          { type: "glazed", count: 4, interval: 1.3, delay: 0 },
          { type: "sprinter", count: 6, interval: 0.9, delay: 1 },
          { type: "nurse", count: 1, interval: 1.5, delay: 1 },
          { type: "worker", count: 6, interval: 1, delay: 1 }
        ],
        [
          { type: "glazed", count: 5, interval: 1.2, delay: 0 },
          { type: "nurse", count: 2, interval: 1.4, delay: 1 },
          { type: "small", count: 14, interval: 0.45, delay: 1 },
          { type: "sprinter", count: 4, interval: 0.9, delay: 1 }
        ],
        [
          { type: "glazed", count: 5, interval: 1.2, delay: 0 },
          { type: "sprinter", count: 6, interval: 0.85, delay: 1 },
          { type: "nurse", count: 2, interval: 1.4, delay: 1 },
          { type: "worker", count: 8, interval: 0.9, delay: 1 }
        ]
      ]
    },
    {
      world: 5,
      name: "Glaze Counter",
      map: "w5_diner",
      waveCount: 9,
      hpMul: 0.87,
      interval: 1,
      waves: [
        [{ type: "worker", count: 6, interval: 1, delay: 0 }, { type: "small", count: 8, interval: 0.45, delay: 1 }],
        [
          { type: "flyer", count: 4, interval: 0.8, delay: 0 },
          { type: "worker", count: 5, interval: 1, delay: 1 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "glazed", count: 2, interval: 1.5, delay: 2 },
          { type: "worker", count: 6, interval: 1, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 1 }
        ],
        [
          { type: "flyer", count: 5, interval: 0.8, delay: 0 },
          { type: "glazed", count: 2, interval: 1.5, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 0 }
        ],
        [
          { type: "worker", count: 8, interval: 0.9, delay: 0 },
          { type: "glazed", count: 3, interval: 1.4, delay: 1 },
          { type: "flyer", count: 4, interval: 0.8, delay: 1 }
        ],
        [
          { type: "small", count: 14, interval: 0.45, delay: 0 },
          { type: "flyer", count: 6, interval: 0.8, delay: 1 },
          { type: "glazed", count: 3, interval: 1.4, delay: 1 }
        ],
        [
          { type: "glazed", count: 4, interval: 1.3, delay: 0 },
          { type: "worker", count: 8, interval: 0.9, delay: 1 },
          { type: "flyer", count: 6, interval: 0.8, delay: 1 }
        ],
        [
          { type: "small", count: 14, interval: 0.45, delay: 0 },
          { type: "glazed", count: 4, interval: 1.3, delay: 1 },
          { type: "worker", count: 8, interval: 0.9, delay: 1 },
          { type: "flyer", count: 5, interval: 0.8, delay: 1 }
        ],
        [
          { type: "worker", count: 8, interval: 0.9, delay: 0 },
          { type: "glazed", count: 3, interval: 1.4, delay: 1 },
          { type: "flyer", count: 5, interval: 0.8, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 1 },
          { type: "queen5", count: 1, interval: 1, delay: 4 }
        ]
      ]
    },
    {
      world: 6,
      name: "Pancake Plate",
      map: "w6_pancake_plate",
      waveCount: 6,
      hpMul: 6,
      interval: 1,
      waves: [
        [{ type: "worker", count: 6, interval: 1, delay: 0 }, { type: "small", count: 8, interval: 0.45, delay: 1 }],
        [{ type: "small", count: 8, interval: 0.45, delay: 0 }, { type: "worker", count: 4, interval: 1, delay: 1 }],
        [
          { type: "worker", count: 6, interval: 1, delay: 0 },
          { type: "flyer", count: 3, interval: 0.8, delay: 1 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [{ type: "flyer", count: 4, interval: 0.8, delay: 0 }, { type: "worker", count: 6, interval: 1, delay: 0 }],
        [
          { type: "small", count: 10, interval: 0.45, delay: 0 },
          { type: "worker", count: 6, interval: 1, delay: 0 },
          { type: "flyer", count: 4, interval: 0.8, delay: 1 }
        ],
        [
          { type: "worker", count: 8, interval: 0.9, delay: 0 },
          { type: "small", count: 12, interval: 0.45, delay: 1 },
          { type: "flyer", count: 4, interval: 0.8, delay: 1 }
        ]
      ]
    },
    {
      world: 6,
      name: "Syrup Pitcher",
      map: "w6_syrup_pitcher",
      waveCount: 6,
      hpMul: 7.2,
      interval: 1,
      waves: [
        [{ type: "worker", count: 6, interval: 1, delay: 0 }, { type: "small", count: 8, interval: 0.45, delay: 1 }],
        [
          { type: "worker", count: 5, interval: 1, delay: 0 },
          { type: "drone", count: 2, interval: 1.5, delay: 2 },
          { type: "small", count: 6, interval: 0.45, delay: 1 }
        ],
        [
          { type: "small", count: 10, interval: 0.45, delay: 0 },
          { type: "drone", count: 2, interval: 1.5, delay: 1 },
          { type: "worker", count: 5, interval: 1, delay: 1 }
        ],
        [
          { type: "worker", count: 6, interval: 1, delay: 0 },
          { type: "drone", count: 3, interval: 1.4, delay: 1 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "small", count: 12, interval: 0.45, delay: 0 },
          { type: "drone", count: 3, interval: 1.4, delay: 2 },
          { type: "worker", count: 6, interval: 1, delay: 1 }
        ],
        [
          { type: "worker", count: 8, interval: 0.9, delay: 0 },
          { type: "drone", count: 4, interval: 1.3, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 1 }
        ]
      ]
    },
    {
      world: 6,
      name: "Butter Dish",
      map: "w6_butter_dish",
      waveCount: 7,
      hpMul: 9.19,
      interval: 1,
      waves: [
        [{ type: "worker", count: 6, interval: 1, delay: 0 }, { type: "small", count: 8, interval: 0.45, delay: 1 }],
        [{ type: "flyer", count: 4, interval: 0.8, delay: 0 }, { type: "worker", count: 5, interval: 1, delay: 1 }],
        [
          { type: "small_fly", count: 8, interval: 0.5, delay: 0 },
          { type: "drone", count: 2, interval: 1.5, delay: 1 },
          { type: "worker", count: 6, interval: 1, delay: 1 }
        ],
        [
          { type: "flyer", count: 5, interval: 0.8, delay: 0 },
          { type: "drone", count: 3, interval: 1.4, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 1 }
        ],
        [
          { type: "small_fly", count: 10, interval: 0.5, delay: 0 },
          { type: "flyer", count: 4, interval: 0.8, delay: 1 },
          { type: "drone", count: 3, interval: 1.4, delay: 1 },
          { type: "worker", count: 6, interval: 1, delay: 1 }
        ],
        [
          { type: "worker", count: 8, interval: 0.9, delay: 0 },
          { type: "flyer", count: 6, interval: 0.8, delay: 1 },
          { type: "drone", count: 4, interval: 1.3, delay: 1 }
        ],
        [
          { type: "small_fly", count: 12, interval: 0.5, delay: 0 },
          { type: "flyer", count: 6, interval: 0.75, delay: 1 },
          { type: "drone", count: 4, interval: 1.3, delay: 1 },
          { type: "worker", count: 8, interval: 0.9, delay: 1 }
        ]
      ]
    },
    {
      world: 6,
      name: "Fork Fence",
      map: "w6_fork_fence",
      waveCount: 7,
      hpMul: 9.5,
      interval: 1,
      waves: [
        [{ type: "worker", count: 6, interval: 1, delay: 0 }, { type: "small", count: 8, interval: 0.45, delay: 1 }],
        [
          { type: "small_armed", count: 4, interval: 0.6, delay: 0 },
          { type: "worker", count: 4, interval: 1, delay: 1 },
          { type: "small", count: 6, interval: 0.45, delay: 1 }
        ],
        [
          { type: "armored", count: 2, interval: 1.5, delay: 1 },
          { type: "worker", count: 4, interval: 1, delay: 0 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "drone", count: 3, interval: 1.4, delay: 0 },
          { type: "armored", count: 2, interval: 1.5, delay: 1 },
          { type: "worker", count: 4, interval: 1, delay: 1 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "drone", count: 3, interval: 1.4, delay: 0 },
          { type: "armored", count: 3, interval: 1.4, delay: 1 },
          { type: "small_armed", count: 4, interval: 0.6, delay: 1 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "drone", count: 4, interval: 1.3, delay: 0 },
          { type: "armored", count: 3, interval: 1.4, delay: 1 },
          { type: "worker", count: 6, interval: 1, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 1 }
        ],
        [
          { type: "drone", count: 4, interval: 1.3, delay: 0 },
          { type: "armored", count: 4, interval: 1.3, delay: 1 },
          { type: "worker", count: 6, interval: 1, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 1 }
        ]
      ]
    },
    {
      world: 6,
      name: "Stack Alley",
      map: "w6_stack_alley",
      waveCount: 7,
      hpMul: 4.84,
      interval: 1,
      waves: [
        [{ type: "worker", count: 6, interval: 1, delay: 0 }, { type: "small", count: 8, interval: 0.45, delay: 1 }],
        [
          { type: "drone", count: 3, interval: 1.1, delay: 0 },
          { type: "worker", count: 4, interval: 1, delay: 1 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "glazed", count: 3, interval: 1.4, delay: 0 },
          { type: "mama", count: 1, interval: 1.6, delay: 1 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "glazed", count: 3, interval: 1.3, delay: 0 },
          { type: "mama", count: 1, interval: 1.6, delay: 1 },
          { type: "drone", count: 3, interval: 1, delay: 1 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "glazed", count: 3, interval: 1.3, delay: 0 },
          { type: "mama", count: 1, interval: 1.6, delay: 1 },
          { type: "drone", count: 3, interval: 1, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 1 }
        ],
        [
          { type: "glazed", count: 3, interval: 1.2, delay: 0 },
          { type: "mama", count: 2, interval: 1.5, delay: 1 },
          { type: "drone", count: 4, interval: 1, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 1 }
        ],
        [
          { type: "glazed", count: 3, interval: 1.2, delay: 0 },
          { type: "mama", count: 2, interval: 1.5, delay: 1 },
          { type: "worker", count: 4, interval: 1, delay: 1 },
          { type: "small", count: 12, interval: 0.45, delay: 1 }
        ]
      ]
    },
    {
      world: 6,
      name: "Berry Basket",
      map: "w6_berry_basket",
      waveCount: 6,
      hpMul: 9.57,
      interval: 1,
      waves: [
        [{ type: "worker", count: 6, interval: 1, delay: 0 }, { type: "small", count: 8, interval: 0.45, delay: 1 }],
        [{ type: "flyer", count: 4, interval: 0.8, delay: 0 }, { type: "worker", count: 5, interval: 1, delay: 1 }],
        [
          { type: "small_fly", count: 8, interval: 0.5, delay: 0 },
          { type: "drone", count: 2, interval: 1.5, delay: 1 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "worker", count: 6, interval: 1, delay: 0 },
          { type: "flyer", count: 5, interval: 0.8, delay: 1 },
          { type: "drone", count: 2, interval: 1.5, delay: 1 }
        ],
        [
          { type: "small_fly", count: 10, interval: 0.5, delay: 0 },
          { type: "drone", count: 3, interval: 1.4, delay: 1 },
          { type: "worker", count: 6, interval: 1, delay: 1 }
        ],
        [
          { type: "worker", count: 8, interval: 0.9, delay: 0 },
          { type: "flyer", count: 6, interval: 0.8, delay: 1 },
          { type: "drone", count: 3, interval: 1.4, delay: 1 },
          { type: "small", count: 12, interval: 0.45, delay: 1 }
        ]
      ]
    },
    {
      world: 6,
      name: "Whipped Cream Hill",
      map: "w6_whipped_cream_hill",
      waveCount: 7,
      hpMul: 5.9,
      interval: 1,
      waves: [
        [
          { type: "worker", count: 5, interval: 1, delay: 0 },
          { type: "small_gasmask", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "gasmask", count: 4, interval: 1, delay: 0 },
          { type: "worker", count: 4, interval: 1, delay: 1 },
          { type: "small_gasmask", count: 6, interval: 0.45, delay: 1 }
        ],
        [
          { type: "drone", count: 4, interval: 0.8, delay: 0 },
          { type: "gasmask", count: 4, interval: 1, delay: 1 },
          { type: "small_gasmask", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "gasmask", count: 5, interval: 1, delay: 0 },
          { type: "glazed", count: 3, interval: 1.4, delay: 1 },
          { type: "worker", count: 4, interval: 1, delay: 1 }
        ],
        [
          { type: "small_gasmask", count: 12, interval: 0.45, delay: 0 },
          { type: "glazed", count: 3, interval: 1.4, delay: 1 },
          { type: "gasmask", count: 4, interval: 1, delay: 1 }
        ],
        [
          { type: "gasmask", count: 6, interval: 0.9, delay: 0 },
          { type: "glazed", count: 4, interval: 1.3, delay: 1 },
          { type: "drone", count: 5, interval: 0.8, delay: 1 }
        ],
        [
          { type: "small_gasmask", count: 14, interval: 0.45, delay: 0 },
          { type: "gasmask", count: 6, interval: 0.9, delay: 1 },
          { type: "glazed", count: 4, interval: 1.3, delay: 1 },
          { type: "drone", count: 5, interval: 0.8, delay: 1 }
        ]
      ]
    },
    {
      world: 6,
      name: "Waffle Iron",
      map: "w6_waffle_iron",
      waveCount: 8,
      hpMul: 5.36,
      interval: 1,
      waves: [
        [{ type: "worker", count: 6, interval: 1, delay: 0 }, { type: "small", count: 8, interval: 0.45, delay: 1 }],
        [
          { type: "drone", count: 4, interval: 0.8, delay: 0 },
          { type: "worker", count: 4, interval: 1, delay: 1 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "nurse", count: 3, interval: 1.4, delay: 0 },
          { type: "worker", count: 4, interval: 1, delay: 1 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "nurse", count: 4, interval: 1.3, delay: 0 },
          { type: "drone", count: 4, interval: 0.8, delay: 1 },
          { type: "worker", count: 4, interval: 1, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 1 }
        ],
        [
          { type: "heavy", count: 1, interval: 1.7, delay: 1 },
          { type: "nurse", count: 3, interval: 1.4, delay: 1 },
          { type: "worker", count: 4, interval: 1, delay: 1 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "heavy", count: 1, interval: 1.7, delay: 0.5 },
          { type: "nurse", count: 4, interval: 1.3, delay: 0 },
          { type: "worker", count: 4, interval: 1, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 1 }
        ],
        [
          { type: "heavy", count: 2, interval: 1.7, delay: 0.5 },
          { type: "nurse", count: 4, interval: 1.3, delay: 0 },
          { type: "drone", count: 4, interval: 0.8, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 1 }
        ],
        [
          { type: "heavy", count: 3, interval: 1.6, delay: 0.5 },
          { type: "nurse", count: 5, interval: 1.2, delay: 0 },
          { type: "worker", count: 4, interval: 1, delay: 1 },
          { type: "small", count: 12, interval: 0.45, delay: 1 }
        ]
      ]
    },
    {
      world: 6,
      name: "Picnic Blanket",
      map: "w6_picnic_blanket",
      waveCount: 7,
      hpMul: 4.05,
      interval: 1,
      waves: [
        [{ type: "worker", count: 6, interval: 1, delay: 0 }, { type: "small", count: 8, interval: 0.45, delay: 1 }],
        [
          { type: "drone", count: 4, interval: 0.9, delay: 1 },
          { type: "worker", count: 5, interval: 1, delay: 1 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "glazed", count: 3, interval: 1.4, delay: 0 },
          { type: "drone", count: 4, interval: 0.9, delay: 1 },
          { type: "worker", count: 5, interval: 1, delay: 1 }
        ],
        [
          { type: "glazed", count: 4, interval: 1.3, delay: 0 },
          { type: "nurse", count: 1, interval: 1.5, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 1 },
          { type: "drone", count: 4, interval: 0.9, delay: 1 }
        ],
        [
          { type: "glazed", count: 4, interval: 1.3, delay: 0 },
          { type: "drone", count: 6, interval: 0.9, delay: 1 },
          { type: "nurse", count: 1, interval: 1.5, delay: 1 },
          { type: "worker", count: 6, interval: 1, delay: 1 }
        ],
        [
          { type: "glazed", count: 5, interval: 1.2, delay: 0 },
          { type: "nurse", count: 2, interval: 1.4, delay: 1 },
          { type: "small", count: 14, interval: 0.45, delay: 1 },
          { type: "drone", count: 4, interval: 0.9, delay: 1 }
        ],
        [
          { type: "glazed", count: 5, interval: 1.2, delay: 0 },
          { type: "drone", count: 6, interval: 0.85, delay: 1 },
          { type: "nurse", count: 2, interval: 1.4, delay: 1 },
          { type: "worker", count: 8, interval: 0.9, delay: 1 }
        ]
      ]
    },
    {
      world: 6,
      name: "Syrup Falls",
      map: "w6_syrup_falls",
      waveCount: 9,
      hpMul: 1.7,
      interval: 1,
      waves: [
        [{ type: "worker", count: 6, interval: 1, delay: 0 }, { type: "small", count: 8, interval: 0.45, delay: 1 }],
        [
          { type: "drone", count: 4, interval: 0.8, delay: 0 },
          { type: "worker", count: 5, interval: 1, delay: 1 },
          { type: "small", count: 8, interval: 0.45, delay: 1 }
        ],
        [
          { type: "glazed", count: 2, interval: 1.5, delay: 2 },
          { type: "worker", count: 6, interval: 1, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 1 }
        ],
        [
          { type: "drone", count: 5, interval: 0.8, delay: 0 },
          { type: "glazed", count: 2, interval: 1.5, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 0 }
        ],
        [
          { type: "worker", count: 8, interval: 0.9, delay: 0 },
          { type: "glazed", count: 3, interval: 1.4, delay: 1 },
          { type: "drone", count: 4, interval: 0.8, delay: 1 }
        ],
        [
          { type: "small", count: 14, interval: 0.45, delay: 0 },
          { type: "drone", count: 6, interval: 0.8, delay: 1 },
          { type: "glazed", count: 3, interval: 1.4, delay: 1 }
        ],
        [
          { type: "glazed", count: 4, interval: 1.3, delay: 0 },
          { type: "worker", count: 8, interval: 0.9, delay: 1 },
          { type: "drone", count: 6, interval: 0.8, delay: 1 }
        ],
        [
          { type: "small", count: 14, interval: 0.45, delay: 0 },
          { type: "glazed", count: 4, interval: 1.3, delay: 1 },
          { type: "worker", count: 8, interval: 0.9, delay: 1 },
          { type: "drone", count: 5, interval: 0.8, delay: 1 }
        ],
        [
          { type: "worker", count: 8, interval: 0.9, delay: 0 },
          { type: "glazed", count: 3, interval: 1.4, delay: 1 },
          { type: "drone", count: 5, interval: 0.8, delay: 1 },
          { type: "small", count: 10, interval: 0.45, delay: 1 },
          { type: "queen6", count: 1, interval: 1, delay: 4 }
        ]
      ]
    }
  ],
  maps: {
    zigzag: {
      name: "Breakfast Counter",
      theme: 0,
      path: [[1, -0.6], [1, 2], [8, 2], [8, 5], [1, 5], [1, 8], [8, 8], [8, 10]],
      props: [{ k: "sugar", c: 5, r: 10 }, { k: "mug", c: 9, r: 6 }]
    },
    hook: {
      name: "Baking Table",
      theme: 1,
      path: [[8, -0.6], [8, 1], [2, 1], [2, 4], [7, 4], [7, 7], [2, 7], [2, 10], [6, 10]],
      props: [{ k: "jam", c: 0, r: 11 }, { k: "plant", c: 9, r: 9 }]
    },
    spiral: {
      name: "Midnight Snack",
      theme: 2,
      path: [[-0.6, 1], [8, 1], [8, 10], [1, 10], [1, 4], [5, 4], [5, 7]],
      props: [{ k: "mug", c: 3, r: 7 }, { k: "spoon", c: 9, r: 11 }]
    },
    fork: {
      name: "Sugar Bowl Split",
      theme: 3,
      grid: [
        "....N.....",
        "....#.....",
        ".#######..",
        ".#.....#..",
        ".#.B...#.P",
        ".#...M.#..",
        ".#.....#..",
        ".#######..",
        "....#.....",
        "....####..",
        ".J.....#..",
        ".......C.."
      ]
    },
    twin: {
      name: "Two Front Doors",
      theme: 0,
      grid: [
        ".N......N.",
        ".#......#.",
        ".###..###.",
        "...#..#...",
        "...#.B#...",
        "...####...",
        "....#..M..",
        "....#.....",
        ".####...P.",
        ".#........",
        ".######...",
        "J.....C..."
      ]
    },
    snake: {
      name: "Cutting Board",
      theme: 1,
      grid: [
        ".N........",
        ".#..####..",
        ".#..#..#..",
        ".#..#..#.P",
        ".####..#..",
        ".......#..",
        ".M.#####..",
        "...#....J.",
        "...#.####.",
        ".B.#.#..#.",
        "...###..#.",
        "........C."
      ]
    },
    cross: {
      name: "Midnight Crossing",
      theme: 2,
      grid: [
        "...N......",
        "...#......",
        "...#....M.",
        ".##+####..",
        ".#.#...#..",
        ".#.#.B.#..",
        ".#.#####..",
        ".#.......S",
        ".#..####..",
        ".#..#..#..",
        ".####..#..",
        "P......C.."
      ]
    },
    frosting: {
      name: "Frosting Swirl",
      theme: 3,
      grid: [
        "N.........",
        "#######...",
        "......#...",
        ".####.#.M.",
        ".#..#.#...",
        ".#..#.#...",
        ".#..###...",
        ".#........",
        ".######...",
        "......#.B.",
        ".P....###.",
        "........C."
      ]
    },
    layers: {
      name: "Layer Cake",
      theme: 1,
      grid: [
        "N........N",
        "#........#",
        "###....###",
        "..#....#..",
        "..#.M..#..",
        "..######..",
        ".....#....",
        ".B...#..J.",
        ".#####....",
        ".#........",
        ".#######..",
        ".......C.."
      ]
    },
    candles: {
      name: "Birthday Candles",
      theme: 2,
      grid: [
        ".N........",
        ".#........",
        ".#.####...",
        ".#.#..#.M.",
        ".#.#..#...",
        ".###..#...",
        "......#...",
        ".S..###...",
        "....#.....",
        ".####..P..",
        ".#........",
        ".######C.."
      ]
    },
    teaparty: {
      name: "Tea Party",
      theme: 3,
      grid: [
        "....N.....",
        "....#.....",
        "..#####...",
        "..#...#...",
        "..#.M.#...",
        "..#...#...",
        "..#####...",
        "....#.....",
        ".J..#.....",
        "....#####.",
        "........#.",
        "........C."
      ]
    },
    staircase: {
      name: "Sugar Staircase",
      theme: 0,
      grid: [
        "N.........",
        "##........",
        ".##.....M.",
        "..##......",
        "...##.....",
        "....##....",
        ".....##...",
        "......##..",
        ".B.....##.",
        "........#.",
        "...J....#.",
        "........C."
      ]
    },
    w3_shelves: {
      name: "Pantry Shelves",
      theme: 5,
      grid: [
        ".N........",
        ".#........",
        ".#######..",
        ".......#..",
        ".......#..",
        "..######..",
        "..#.....P.",
        "..#.......",
        "..######..",
        ".......#.J",
        ".......#..",
        ".......C.."
      ]
    },
    w3_butter: {
      name: "Butter Dish",
      theme: 4,
      path: [[1, -0.6], [1, 1], [7, 1], [7, 4], [2, 4], [2, 7], [7, 7], [7, 10], [3, 10]],
      props: [{ k: "jam", c: 9, r: 11 }, { k: "plant", c: 0, r: 9 }]
    },
    w3_lattice: {
      name: "Lattice Crust",
      theme: 6,
      grid: [
        "....N.....",
        "....#.....",
        "..#####...",
        "..#...#...",
        "..#.M.#...",
        "..#...#...",
        "..#...#...",
        "..#####...",
        "....#.....",
        "....#..J..",
        "....#.....",
        "....C....."
      ]
    },
    w3_spice: {
      name: "Spice Rack",
      theme: 5,
      grid: [
        ".........N",
        "........##",
        ".M.....##.",
        "......##..",
        ".....##...",
        "....##....",
        "...##.....",
        "..##......",
        ".##.....B.",
        ".#........",
        ".#....J...",
        ".C........"
      ]
    },
    w3_jar: {
      name: "Jam Jar Run",
      theme: 4,
      grid: [
        ".N......N.",
        ".#......#.",
        ".#......#.",
        ".###..###.",
        "...#..#...",
        "...####...",
        "......#...",
        "......#.B.",
        ".######...",
        ".#........",
        ".#######..",
        ".......C.."
      ]
    },
    w3_fruit: {
      name: "Fruit Bowl",
      theme: 6,
      grid: [
        "........N.",
        "........#.",
        "...####.#.",
        ".M.#..#.#.",
        "...#..#.#.",
        "...#..###.",
        "...#......",
        "...###..S.",
        ".....#....",
        "..P..####.",
        "........#.",
        "..C######."
      ]
    },
    w3_gala: {
      name: "Gala Hall",
      theme: 5,
      grid: [
        "........N.",
        "..####..#.",
        "..#..#..#.",
        "P.#..#..#.",
        "..#..####.",
        "..#.......",
        "..#####.M.",
        ".J....#...",
        ".####.#...",
        ".#..#.#.B.",
        ".#..###...",
        ".C........"
      ]
    },
    w3_cloud: {
      name: "Flour Cloud",
      theme: 4,
      grid: [
        "N.........",
        "#.#######.",
        "#.#.....#.",
        "#.#.....#.",
        "#.#.###.#.",
        "#.#.C.#.#.",
        "#.#...#.#.",
        "#.#...#.#.",
        "#.#####.#.",
        "#.......#.",
        "#########.",
        "..M....B.."
      ]
    },
    w3_every: {
      name: "Everything Shelf",
      theme: 5,
      grid: [
        ".........N",
        "...#######",
        "...#......",
        ".M.#.####.",
        "...#.#..#.",
        "...#.#..#.",
        "...###..#.",
        "........#.",
        "...######.",
        ".B.#......",
        ".###....P.",
        ".C........"
      ]
    },
    w3_tin: {
      name: "Pie Tin",
      theme: 6,
      grid: [
        "....N.....",
        "....#.....",
        "....#.....",
        ".###+###..",
        ".#..#..#..",
        ".#..####..",
        ".#........",
        ".#......M.",
        ".####.....",
        "....#.....",
        "....#.....",
        "....C....."
      ]
    },
    w4_counter: {
      name: "Sundae Counter",
      theme: 7,
      grid: [
        ".N........",
        ".#........",
        ".#........",
        ".########.",
        "........#.",
        ".....M..#.",
        "........#.",
        "..#######.",
        "P.#.......",
        "..#.......",
        "..#######.",
        "........C."
      ]
    },
    w4_scoop: {
      name: "Scoop Lane",
      theme: 7,
      grid: [
        ".........J",
        "N########.",
        "........#.",
        ".########.",
        ".#........",
        ".########.",
        "........#P",
        ".########.",
        ".#........",
        ".########.",
        "........#.",
        "........#C"
      ]
    },
    w4_cone: {
      name: "Cone Crossing",
      theme: 7,
      grid: [
        ".....N....",
        ".....#..S.",
        ".....#....",
        ".####+###.",
        ".#...#..#.",
        ".#...#..#.",
        ".#####..#.",
        "........#.",
        "..M.....#.",
        "....#####.",
        "....#.....",
        "....C....."
      ]
    },
    w4_sprinkle: {
      name: "Sprinkle Switchback",
      theme: 7,
      grid: [
        "....J....N",
        ".........#",
        ".#########",
        ".#........",
        ".########.",
        "........#.",
        ".########.",
        ".#........",
        ".########.",
        "........#.",
        "#########.",
        "C....B...."
      ]
    },
    w4_waffle: {
      name: "Waffle Grid",
      theme: 7,
      grid: [
        ".N......N.",
        ".#......#.",
        ".#....###.",
        ".#.M..#...",
        ".#....#...",
        ".######...",
        "......#...",
        "......#...",
        "....###...",
        "....#...P.",
        "....#.....",
        "....C....."
      ]
    },
    w4_cherry: {
      name: "Cherry Top",
      theme: 7,
      grid: [
        "..........",
        "....M.....",
        "..........",
        "N#######..",
        ".......#..",
        ".......#..",
        "..######..",
        "..#.......",
        "..#.......",
        "..####...P",
        ".....#....",
        ".....C...."
      ]
    },
    w4_fudge: {
      name: "Fudge Fork",
      theme: 7,
      grid: [
        "....N.....",
        "....#....P",
        "....#.....",
        ".#######..",
        ".#.....#..",
        ".#..B..#..",
        ".#.....#..",
        ".#.....#..",
        ".#######..",
        "....#.....",
        "....#.....",
        "....C....."
      ]
    },
    w4_spiral: {
      name: "Syrup Spiral",
      theme: 7,
      grid: [
        "..........",
        "N########.",
        "........#.",
        ".######.#.",
        ".#....#.#.",
        ".#....#.#M",
        ".#....C.#.",
        ".#......#.",
        ".#..P...#.",
        ".#......#.",
        ".########.",
        ".........."
      ]
    },
    w4_banana: {
      name: "Banana Split",
      theme: 7,
      grid: [
        ".N......N.",
        ".#......#.",
        ".#..J...#.",
        ".#....###.",
        ".#....#...",
        ".######...",
        "......#...",
        "......#...",
        "..#####...",
        "..#......P",
        "..#.......",
        "..C......."
      ]
    },
    w4_floor: {
      name: "Parlour Floor",
      theme: 7,
      grid: [
        "..N.......",
        "..#.......",
        "..######..",
        ".......#..",
        ".#######..",
        ".#...P....",
        ".#........",
        ".########.",
        "........#.",
        ".....M..#.",
        "S.......#.",
        "........C."
      ]
    },
    w5_counter: {
      name: "Donut Counter",
      theme: 8,
      grid: [
        ".....P..N.",
        "........#.",
        ".########.",
        ".#........",
        ".#........",
        ".########.",
        "........#.",
        "........#.",
        "..#######.",
        "..#.......",
        "..#.M.....",
        ".C#......."
      ]
    },
    w5_stool: {
      name: "Sprinkle Stool",
      theme: 8,
      grid: [
        "N........J",
        "#.........",
        "#########.",
        "........#.",
        ".########.",
        ".#........",
        ".########.",
        ".....P..#.",
        "........#.",
        "..#######.",
        "..#.......",
        "..#######C"
      ]
    },
    w5_jelly: {
      name: "Jelly Booth",
      theme: 8,
      grid: [
        "..N.......",
        "..#.......",
        "..#.#####.",
        "..#.#...#.",
        "..#.#...#.",
        "..##+####.",
        "....#.....",
        "....#.S...",
        "M...#.....",
        "....####..",
        ".......#..",
        ".......C.."
      ]
    },
    w5_cruller: {
      name: "Cruller Corner",
      theme: 8,
      grid: [
        "N........B",
        "#.........",
        "#########.",
        "........#.",
        ".########.",
        ".#........",
        ".########.",
        "........#.",
        ".########.",
        ".#........",
        ".#########",
        ".....J...C"
      ]
    },
    w5_glaze: {
      name: "Glaze Line",
      theme: 8,
      grid: [
        ".N......N.",
        ".#......#.",
        ".#......#.",
        ".#......#.",
        ".#####..#.",
        ".....#..#.",
        ".....####.",
        ".....#....",
        "...M.#....",
        ".....#...P",
        ".....#....",
        ".....C...."
      ]
    },
    w5_coffee: {
      name: "Coffee Break",
      theme: 8,
      grid: [
        ".....M....",
        "..........",
        "N########.",
        "........#.",
        "........#.",
        ".########.",
        ".#........",
        ".#........",
        ".####.....",
        "....#....P",
        "....#.....",
        "....C....."
      ]
    },
    w5_maple: {
      name: "Maple Bar",
      theme: 8,
      grid: [
        ".....N....",
        ".....#....",
        ".....#....",
        ".########.",
        ".#......#.",
        ".#......#.",
        ".#.B....#.",
        ".#...####.",
        ".#...#....",
        ".#####....",
        ".....#...P",
        ".....C...."
      ]
    },
    w5_boston: {
      name: "Boston Cream",
      theme: 8,
      grid: [
        "N........P",
        "#.........",
        "#.#######.",
        "#.#.....#.",
        "#.#.....#.",
        "#.#..M..#.",
        "#.#.....#.",
        "#.#.....#.",
        "#.###C..#.",
        "#.......#.",
        "#########.",
        ".........."
      ]
    },
    w5_dozen: {
      name: "Baker's Dozen",
      theme: 8,
      grid: [
        ".N......N.",
        ".#...J..#.",
        ".#......#.",
        ".#......#.",
        ".#.######.",
        ".#.#......",
        ".#######..",
        ".......#..",
        ".......#..",
        "..P....##.",
        "........#.",
        "........C."
      ]
    },
    w5_diner: {
      name: "Glaze Counter",
      theme: 8,
      grid: [
        ".......N..",
        ".......#..",
        "..######..",
        "..#..P....",
        "..#.......",
        "..#######.",
        "........#.",
        "........#.",
        ".########.",
        ".#........",
        ".#...M....",
        ".C.......S"
      ]
    },
    w6_pancake_plate: {
      name: "Pancake Plate",
      theme: 9,
      grid: [
        ".N..J.....",
        ".#........",
        ".########.",
        "........#.",
        "........#.",
        ".########.",
        ".#........",
        ".#........",
        ".#######..",
        ".......#..",
        ".....B.#..",
        ".......#C."
      ]
    },
    w6_syrup_pitcher: {
      name: "Syrup Pitcher",
      theme: 9,
      grid: [
        "S........N",
        ".........#",
        ".#########",
        ".#........",
        ".########.",
        "........#.",
        ".########.",
        ".#..S.....",
        ".#........",
        ".#######..",
        ".......#..",
        "C#######.."
      ]
    },
    w6_butter_dish: {
      name: "Butter Dish",
      theme: 9,
      grid: [
        ".......N..",
        ".......#..",
        ".#####.#..",
        ".#...#.#..",
        ".#...#.#..",
        ".####+##..",
        ".....#....",
        "...M.#....",
        ".....#...J",
        "..####....",
        "..#.......",
        "..C......."
      ]
    },
    w6_fork_fence: {
      name: "Fork Fence",
      theme: 9,
      grid: [
        "B........N",
        ".........#",
        ".#########",
        ".#........",
        ".########.",
        "........#.",
        ".########.",
        ".#........",
        ".########.",
        "........#.",
        "#########.",
        "C...B....."
      ]
    },
    w6_stack_alley: {
      name: "Stack Alley",
      theme: 9,
      grid: [
        ".N......N.",
        ".#......#.",
        ".#......#.",
        ".#......#.",
        ".#..#####.",
        ".#..#.....",
        ".####.....",
        "....#.....",
        "....#.P...",
        "S...#.....",
        "....#.....",
        "....C....."
      ]
    },
    w6_berry_basket: {
      name: "Berry Basket",
      theme: 9,
      grid: [
        "....J.....",
        "..........",
        ".########N",
        ".#........",
        ".#........",
        ".########.",
        "........#.",
        "........#.",
        ".....####.",
        "J....#....",
        ".....#....",
        ".....C...."
      ]
    },
    w6_whipped_cream_hill: {
      name: "Whipped Cream Hill",
      theme: 9,
      grid: [
        "....N.....",
        "....#.....",
        "....#.....",
        ".########.",
        ".#......#.",
        ".#......#.",
        ".#....M.#.",
        ".####...#.",
        "....#...#.",
        "....#####.",
        "M...#.....",
        "....C....."
      ]
    },
    w6_waffle_iron: {
      name: "Waffle Iron",
      art: { plate: { hide: !0 } },
      theme: 9,
      grid: [
        "N........S",
        "#.........",
        "#.#######.",
        "#.#.....#.",
        "#.#.....#.",
        "#.#..B..#.",
        "#.#.....#.",
        "#.#.....#.",
        "#.###C..#.",
        "#.......#.",
        "#########.",
        ".........."
      ]
    },
    w6_picnic_blanket: {
      name: "Picnic Blanket",
      theme: 9,
      grid: [
        ".N......N.",
        ".#...P..#.",
        ".#......#.",
        ".#......#.",
        ".#.######.",
        ".#.#......",
        ".#######..",
        ".......#..",
        ".......#..",
        "..P....##.",
        "........#.",
        "........C."
      ]
    },
    w6_syrup_falls: {
      name: "Syrup Falls",
      theme: 9,
      grid: [
        "..N.......",
        "..#.......",
        "..######..",
        "....M..#..",
        ".......#..",
        ".#######..",
        ".#........",
        ".#........",
        ".########.",
        "........#.",
        "....S...#.",
        "M.......C."
      ]
    }
  }
};

// src/maps.js
var PROP_KINDS = { M: "mug", B: "sugar", J: "jam", S: "spoon", P: "plant" }, MAPS = JSON.parse(JSON.stringify(tuning_default.maps)), DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]];
function parseMap(m, cols = 10, rows = 12) {
  if (m.path) return { routes: [m.path], props: m.props || [], errors: [] };
  let errors = [], g = m.grid;
  (!g || g.length !== rows || g.some((row) => row.length !== cols)) && errors.push(`grid must be ${rows} rows of ${cols} chars`);
  let at = (c, r) => c < 0 || r < 0 || c >= cols || r >= rows ? " " : g[r][c], nests = [], props = [], cookie = null;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    let ch2 = at(c, r);
    ch2 === "N" ? nests.push([c, r]) : ch2 === "C" ? (cookie && errors.push("more than one cookie"), cookie = [c, r]) : PROP_KINDS[ch2] ? props.push({ k: PROP_KINDS[ch2], c, r }) : ".#+".includes(ch2) || errors.push(`unknown char '${ch2}' at ${c},${r}`);
  }
  nests.length || errors.push("no nest N"), nests.length > 2 && errors.push("max 2 nests"), cookie || errors.push("no cookie C");
  let walk = (ch2) => ch2 === "#" || ch2 === "+" || ch2 === "C", routes = [];
  if (!errors.length) for (let n of nests) {
    let found = [], visit2 = (c, r, dir, seen, acc) => {
      if (found.length > 8) return;
      if (at(c, r) === "C") {
        found.push(acc.slice());
        return;
      }
      let cand = at(c, r) === "+" && dir != null ? [dir] : [0, 1, 2, 3];
      for (let k of cand) {
        let nc = c + DIRS[k][0], nr = r + DIRS[k][1], ch2 = at(nc, nr);
        if (!walk(ch2)) continue;
        let key = nc + "," + nr, times = seen.get(key) || 0;
        times >= (ch2 === "+" ? 2 : 1) || (seen.set(key, times + 1), acc.push([nc, nr]), visit2(nc, nr, k, seen, acc), acc.pop(), seen.set(key, times));
      }
    };
    visit2(n[0], n[1], null, /* @__PURE__ */ new Map([[n[0] + "," + n[1], 1]]), [n]), found.length || errors.push(`nest at ${n} does not reach the cookie`);
    for (let tiles of found) {
      let [c0, r0] = tiles[0], pre = r0 === 0 ? [c0, -0.6] : c0 === 0 ? [-0.6, r0] : c0 === cols - 1 ? [cols - 0.4, r0] : r0 === rows - 1 ? [c0, rows - 0.4] : null, pts = pre ? [pre, ...tiles] : tiles;
      routes.push(compress(pts));
    }
  }
  return { routes, props, errors };
}
function compress(pts) {
  let out = [pts[0]];
  for (let i = 1; i < pts.length - 1; i++) {
    let a = out[out.length - 1], b = pts[i], c = pts[i + 1], d1 = [Math.sign(b[0] - a[0]), Math.sign(b[1] - a[1])], d2 = [Math.sign(c[0] - b[0]), Math.sign(c[1] - b[1])];
    (d1[0] !== d2[0] || d1[1] !== d2[1]) && out.push(b);
  }
  return out.push(pts[pts.length - 1]), out;
}

// src/config.js
var TILE = 40, GRID_COLS = 10, GRID_ROWS = 12, BATTLE = {
  foodHP: 100,
  // cookie food points
  carryBack: !0,
  // true: thieves carry the piece home (killing them returns part of it). false: food is lost on arrival.
  // Food leaves the cookie THE MOMENT an ant takes a piece. If the carrier is killed on the way home only part returns:
  //   mode 'fixed'    : return `fixed` of the piece (default 40%: stole 5 -> 2 come back)
  //   mode 'distance' : return distMin..distMax depending on how far the carrier got: killed next to the cookie -> distMax,
  //                     killed at the nest door -> distMin (linear in between).
  //   rounding 'exact' keeps fractions (a worker's 1 crumb -> 0.4), or use 'floor' / 'round'.
  foodReturn: { mode: "fixed", fixed: 0.4, distMin: 0.1, distMax: 0.8, rounding: "exact" },
  // v0.7.2 C14 'shuttle until death': an ant that drops its piece at the nest (lost for good) waits `pause` s and walks back to the cookie
  // for another piece. It only stops by dying (HP 0). Queens loop too. The level is won when no ant is alive after the last wave,
  // lost when the cookie is empty (so a level can never be endless).
  forage: {
    on: !0,
    pause: 0.3,
    queenLoop: !0,
    // v0.7.10 cookie pick-up beat: seconds an ant stands at the treat after taking its piece, before it turns home (every trip). 0 = off (v0.7.9 behaviour). v0.7.10 ships 0.5.
    // cookiePauseBoss: same for queens (omit = same as cookiePause).
    cookiePause: 0.5
  },
  // v0.7.2 C13 cookie guard (fly swatter): free, automatic, fixed on the cookie. One swat every `interval` s (the timer waits while nothing is in range)
  // of `damage` (armour applies, min 1) at an ant within `range` px of the cookie; carrier nearest the cookie first, else nearest ant; hits flyers.
  swatter: { on: !0, damage: 4, interval: 4, range: 72, first: 4, air: !0 },
  // v0.7.4 M2 'rescue the crumb' (FLAG, default OFF = the 40% above comes back automatically, exactly as in v0.7.3). With on: true a killed carrier
  // returns `auto` of its piece at once and leaves a piece worth (tap - auto) x the stolen food on the trail for `window` s of WALL time
  // (any game speed); a tap within `radius` (design px) collects it. Pieces closer than `mergeRadius` merge. Ship `on: false` until the human tap check.
  rescue: { on: !1, auto: 0.2, tap: 0.6, window: 3, radius: 30, mergeRadius: 28 },
  carrierSpeedMul: 0.85,
  // carriers walk a bit slower on the way home
  startCrumbs: 0,
  // crumbs are battle-only and always start from this value (spec: 0)
  // Card cost: cost of the Nth card played this battle (N starts at 0) = firstCardCost + N * cardCostStep
  firstCardCost: 0,
  // spec 07:45: first card is free
  cardCostStep: 5,
  // ...then 5, 10, 15, ...
  // v0.5 item 17: redraw all 3 visible picks. Cost of the Nth redraw this battle (N from 0) = rerollCost + N * rerollStep
  // -> 3, 6, 9, 12 ... and it RESETS at the start of every battle.
  rerollCost: 3,
  rerollStep: 3,
  visiblePicks: 3,
  guaranteeDamageOpening: !0,
  // opening hand always holds >=1 ground damage tower (so the free card can earn crumbs)
  // v0.7 D-R1..R3 (economy plan): a hand never shows the same card twice; the opening hand holds >= openingDamageCards damage
  // cards (when the deck has that many); the first `freeRedraws` redraws of every battle cost 0 (then 3, 6, 9 ...).
  distinctHand: !0,
  openingDamageCards: 2,
  freeRedraws: 1,
  deckSize: 5,
  maxInBattleLevel: 6,
  // v0.6 item 11: duplicate card dropped on same tower upgrades it, up to this level (5 upgrades, see TOWERS[x].upgrades)
  firstWaveDelay: 8,
  // seconds before wave 1 auto-starts (player can call it early)
  waveGap: 9,
  // seconds between end of one wave's spawning and the next wave
  earlyCallBonusPerSec: 0.25,
  // crumbs granted per second skipped when calling a wave early (rounded down)
  maxBonusUses: 2,
  // max bonus uses per battle (total across both types)
  bonusTypesToBring: 2,
  // v0.3 item 1: directional towers (fan, marble) ALWAYS aim at the board centre, fixed at placement (no Turn).
  // snap:false = true angle toward the centre; snap:true = rounded to the nearest of right/down/left/up.
  aim: { target: "center", snap: !1 }
}, STARS = [
  { stars: 3, minPct: 90 },
  { stars: 2, minPct: 50 },
  { stars: 1, minPct: 1e-4 }
  // >0
], rangePx = (tiles) => tiles * TILE, TOWER_TEXT = {
  slingshot: {
    name: "Slingshot",
    short: "Slingshot",
    kind: "tower",
    place: "side",
    targets: "ground",
    color: "#f4b183",
    powerLabel: "Damage",
    desc: "Pings the weakest ant in range.",
    ability: "Single target: the ant with the fewest HP left."
  },
  spray: {
    name: "Bug Spray",
    short: "Spray",
    kind: "tower",
    place: "side",
    targets: "ground",
    color: "#b5e3a8",
    powerLabel: "Gas dmg/s",
    desc: "Gas cloud, ignores armor. Not gas masks.",
    ability: "Area damage over time, ignores armor."
  },
  sound: {
    name: "Boombox",
    short: "Boombox",
    kind: "tower",
    place: "side",
    targets: "ground",
    color: "#c9b6f2",
    powerLabel: "Pulse dmg",
    desc: "Hits all ants around it. Ignores armor.",
    ability: "Hits all nearby ants + short stagger."
  },
  ball: {
    name: "Marble Roller",
    short: "Marble",
    kind: "tower",
    place: "side",
    targets: "ground",
    color: "#9fd3f2",
    directional: !0,
    nearTrail: !0,
    powerLabel: "Squash dmg",
    rangeLabel: "Roll",
    desc: "Rolls away from itself along the trail.",
    ability: "Rolls down the straight trail beside it, away from the tower, until a turn."
  },
  fan: {
    name: "Desk Fan",
    short: "Fan",
    kind: "tower",
    place: "side",
    targets: "both",
    color: "#a8e6e0",
    directional: !0,
    powerLabel: "Push",
    desc: "Blows along the trail, away from itself.",
    ability: "Wind along the trail beside it, away from the fan."
  },
  pheromone: {
    name: "Pheromone Perfume",
    short: "Perfume",
    kind: "tower",
    place: "path",
    targets: "ground",
    color: "#f7b2d0",
    powerLabel: "Drain/s",
    desc: "Lures ants on its tile back, slowed + drained.",
    ability: "Covers its own tile. Charm: ants walk back once, slowed."
  },
  lizard: {
    name: "Gecko",
    short: "Gecko",
    kind: "tower",
    place: "side",
    targets: "ground",
    color: "#b8e07a",
    powerLabel: "Bite",
    desc: "Bites the weakest ant hard. Chews after.",
    ability: "Targets the ant with the fewest HP left; chews after kills."
  },
  laser: {
    name: "Laser Pointer",
    short: "Laser",
    kind: "tower",
    place: "side",
    targets: "both",
    color: "#ff9aa2",
    powerLabel: "Damage",
    desc: "Fast beam at the weakest ant. Hits flyers.",
    ability: "Aims at the fewest HP left. Heat: +12% per hit on the same ant."
  },
  zapper: {
    name: "Bug Zapper",
    short: "Zapper",
    kind: "tower",
    place: "side",
    targets: "air",
    color: "#9ad0ff",
    powerLabel: "Zap dmg",
    desc: "Anti-air: zaps the weakest flyer, chains on.",
    ability: "First zap: fewest HP left. Chains to the nearest flyers (60% each jump)."
  },
  glue: {
    name: "Glue Puddle",
    short: "Glue",
    kind: "obstacle",
    place: "path",
    targets: "ground",
    color: "#fff3b0",
    powerLabel: "Slow",
    powerFmt: "pct",
    desc: "Sticks ants on its tile, then slows them.",
    ability: "Covers its own tile. First touch sticks the ant, then slows it."
  },
  gate: {
    name: "Electric Gate",
    short: "E-Gate",
    kind: "obstacle",
    place: "path",
    targets: "ground",
    color: "#ffe08a",
    powerLabel: "Zap dmg",
    desc: "Zaps ants on its tile. Ignores armor.",
    ability: "Covers its own tile: zaps everything on it."
  },
  lava: {
    name: "Roasted Lava",
    short: "Lava",
    kind: "obstacle",
    place: "path",
    targets: "ground",
    color: "#ffb36b",
    powerLabel: "Roast dmg/s",
    desc: "Hot tile: slows and roasts walkers.",
    ability: "Covers its own tile: slight slow + damage every moment an ant is on it."
  },
  // v0.6 item 6: the Tractor. Beside the trail; lowers its front bucket onto ONE trail tile next to it (the same direction logic as
  // the marble/fan, sim.js trailDirection), lifts EVERY liftable ant on that tile and throws it off the trail (instant kill).
  // liftSize: 1 = small ants, 2 = + regular, 3 = + large. Queens are never lifted; flyers are in the air (not lifted).
  tractor: {
    name: "Tractor",
    short: "Tractor",
    kind: "tower",
    place: "side",
    targets: "ground",
    color: "#ffcf6e",
    directional: !0,
    nearTrail: !0,
    powerLabel: "Lifts",
    desc: "Scoops ants off the trail. Slow.",
    ability: "Lifts every liftable ant on the trail tile in front of it and throws it away."
  }
}, SPECIALS_FROM_WORLD = 6, SPECIAL_CARD_LEVEL = 5, SPECIAL_DEFS = {
  slingshot: { id: "ricochet", name: "Ricochet", text: "Stones bounce to a nearby ant for half damage.", short: "Stones bounce to a 2nd ant", params: { radius: 60, mul: 0.5 } },
  laser: { id: "burnthrough", name: "Burn-through", text: "Every fifth beam melts 1 armor off an ant. Not on queens.", short: "Melts armor, not on queens", params: { every: 5, strip: 1, max: 4 } },
  lizard: { id: "pounce", name: "Pounce", text: "The first lick on a fresh ant hits twice as hard.", short: "First lick hits twice as hard", params: { mul: 2 } },
  sound: { id: "crescendo", name: "Crescendo", text: "Every third pulse hits 30 % harder.", short: "Every 3rd pulse hits harder", params: { every: 3, mul: 1.3 } },
  zapper: { id: "static", name: "Static", text: "Lightning jumps to one more ant.", short: "Lightning jumps to +1 ant", params: { plus: 1 } }
}, TOWERS = {};
for (let [id, txt] of Object.entries(TOWER_TEXT)) {
  let T = tuning_default.towers[id];
  TOWERS[id] = {
    ...txt,
    stats: { power: T.power, rate: T.rate, range: T.rangeTiles == null ? null : rangePx(T.rangeTiles) },
    ...T.params,
    upgrades: T.battleUpgrades,
    cardUpgrades: T.cardUpgrades
  };
}
for (let [id, sp] of Object.entries(SPECIAL_DEFS)) TOWERS[id].special = sp;
function specialActive(tower, level, cardLevel) {
  let type = typeof tower == "string" ? tower : tower && tower.type, cl = cardLevel ?? (tower && tower.cardLevel || 1);
  return !!(TOWERS[type] && TOWERS[type].special && level && level.world >= SPECIALS_FROM_WORLD && cl >= SPECIAL_CARD_LEVEL);
}
var LIFT_MAX = 3, SIZE_RANK = { small: 1, regular: 2, large: 3 }, LIFT_NAMES = ["", "Small", "Small + regular", "All sizes"], STAT_LABELS = {
  power: "Power",
  rate: "Rate",
  range: "Range",
  cloudRadius: "Cloud",
  ballRadius: "Marble width",
  stagger: "Stagger",
  charmTime: "Charm",
  slow: "Slow",
  chewTime: "Chew time",
  heatMax: "Max heat",
  chain: "Chain",
  stickTime: "Stick",
  liftSize: "Lifts"
}, SLOW_CAP = 0.85, ALL_CARDS = Object.keys(TOWERS), STARTER_CARDS = ["slingshot", "spray", "glue", "fan", "ball"];
var AIR_COUNTERS = ["laser", "zapper"], TARGET_MODE_TEXT = {
  // v0.8.1: Front retired (M3); Healer (M1, levels with healer ants) and Heavy = 'strong' (M2, boss levels) added
  slingshot: { carrier: "Single target: ants carrying food first, then the fewest HP left.", healer: "Single target: healer ants first, then the fewest HP left.", strong: "Single target: the toughest ant first. For queen levels." },
  lizard: { carrier: "Targets ants carrying food first, then fewest HP left; chews after kills.", healer: "Targets healer ants first, then fewest HP left; chews after kills.", strong: "Targets the toughest ant first; chews after kills. For queen levels." },
  laser: { carrier: "Aims at ants carrying food first, then fewest HP. Heat: +12% per hit on the same ant.", healer: "Aims at healer ants first, then fewest HP. Heat: +12% per hit on the same ant.", strong: "Aims at the toughest ant first. Heat: +12% per hit. For queen levels." },
  zapper: { carrier: "First zap: food carriers first, then fewest HP. Chains to the nearest flyers (60% each jump).", healer: "First zap: healer flyers first, then fewest HP. Chains to the nearest flyers (60% each jump).", strong: "First zap: the toughest flyer first. Chains to the nearest flyers. For queen levels." }
}, HINT_OK = { healer: [35, 39, 49, 59], carrier: [40, 50, 59, 60], drone: [60] }, ART81 = !0, VERSION = "0.8.3", ANT_SIZES = { ...tuning_default.antSizes }, ANT_TEXT = {
  small: { name: "Scout Ant", desc: "Tiny, fast, comes in swarms.", intro: "Tiny and fast. They come in swarms." },
  worker: { name: "Worker Ant", desc: "The regular. Hard hat included.", intro: "The regular ant. Easy to stop." },
  big: { name: "Big Ant", desc: "Slow, chunky, a bit of armor.", intro: "Slow and chunky, with a bit of armour." },
  gasmask: { name: "Gas-Mask Ant", desc: "Immune to bug spray.", intro: "Wears a gas mask. Bug spray does nothing." },
  armored: { name: "Knight Ant", desc: "Heavy armor. Use spray, boombox or gate.", intro: "Heavy armour. Use spray, boombox or the gate." },
  flyer: { name: "Flying Ant", desc: "Flies over ground towers. Laser, zapper or plane!", intro: "Flies over ground towers. Use Laser or Zapper." },
  sprinter: { name: "Sprint Knight", desc: "Armored AND fast - sneakers on. Late stages only.", intro: "Armoured AND fast. Hit it early." },
  heavy: { name: "Heavy Knight", desc: "A big ant in full armor. Late stages only.", intro: "A big ant in full armour. Hit it hard." },
  queen: { name: "Ant Queen", desc: "BOSS. Marches in and calls her scouts. Takes HALF the cookie.", intro: "BOSS. Calls her scouts. Takes half the cookie." },
  // v0.7 (Yair ANT-STATS-v0.6.3): small variants - same tiny body as the Scout, with a gas mask / armour / wings
  small_gasmask: { name: "Masked Scout", desc: "A tiny scout with a gas mask - spray does nothing.", intro: "A tiny scout in a gas mask. Spray does nothing." },
  small_armed: { name: "Armored Scout", desc: "A tiny scout in armour. Slower, shrugs off weak hits.", intro: "A tiny armoured scout. Weak hits bounce off." },
  small_fly: { name: "Flying Scout", desc: "A tiny flying scout. Laser or zapper!", intro: "A tiny flyer. Use Laser or Zapper." },
  queen2: { name: "Swift Queen", desc: "BOSS of world 2. Fast, calls flying ants. Takes 40 of the cake.", intro: "BOSS. Fast, and she calls flying ants." },
  // v0.7.7 world 3 (Pie Pantry)
  greasy: { name: "Buttery Ant", desc: "Slippery! Slowing barely works. Hit it hard.", intro: "Slippery! Slowing barely works. Hit it hard." },
  mama: { name: "Brood Ant", desc: "Drops 3 baby ants when she falls.", intro: "Drops 3 baby ants when she falls." },
  queen3: { name: "Pie Queen", desc: "BOSS of world 3. Calls buttery ants. Takes 55 of the pie. Ignores most slowing.", intro: "BOSS. Calls buttery ants. Ignores most slowing." },
  // v0.7.9 world 4 (Ice-Cream Parlour)
  nurse: { name: "Nurse Ant", desc: "Heals hurt friends nearby every 3 seconds. Pop her first!", intro: "Nurse Ant: heals friends nearby every 3 s. Pop her first!" },
  glazed: { name: "Glazed Ant", desc: "Wears a sugar shield that soaks damage first, then grows back after a pause. Hit it hard and fast.", intro: "Glazed Ant: a sugar shield soaks damage, then it grows back." },
  // v0.8.1 W2 / M4
  queen5: { name: "Glaze Queen", desc: "BOSS of world 5. Shielded, and she keeps sending Glazed Ants. Takes 50 of the donut.", intro: "Glaze Queen: shielded, and she keeps sending Glazed Ants." },
  // v0.8.1 M5
  // v0.8.2 world 6 (Pancake Picnic)
  drone: { name: "Drone Ant", desc: "A four-winged flyer with armor 2. Laser, Zapper or Fan can hit it; Burn-through strips its armor.", intro: "Flies, with armor 2. Laser, Zapper or Fan!" },
  queen6: { name: "Syrup Queen", desc: "BOSS of world 6. Walks slowly and drips a Drone every 12 seconds. Takes 50 of the pancakes. Ignores most slowing.", intro: "Syrup Queen: a new Drone every 12 seconds." },
  queen4: { name: "Sundae Queen", desc: "BOSS of world 4. Calls a nurse every 9 seconds, and the nurses heal her. Takes 50 of the sundae.", intro: "BOSS. Calls nurses that heal her." }
}, ANT_CARD = {
  glazed: "Glazed Ant \u2014 sweet armor. Its glaze soaks up damage, then grows back. Hit it hard and fast, or use Spray and Bombs.",
  queen5: "Glaze Queen \u2014 shielded, and she keeps sending Glazed Ants. Break her glaze, then finish her.",
  nurse: "Nurse Ant \u2014 heals friends nearby every 3 seconds. Pop her first!",
  drone: "Drone Ant \u2014 flies, armor 2. Laser, Zapper and Fan can hit flyers.",
  // v0.8.2 PP9 (shown once on the first prep screen of L52)
  queen6: "Syrup Queen \u2014 she walks, and drips a Drone every 12 seconds. Keep an air tower ready."
  // v0.8.2 PP5/PP9
}, W6_TIPS = { 50: "Pancakes first. Syrup is next.", 51: "Drones fly. Only air towers hit them.", 52: "A long, winding picnic path.", 53: "Syrup is sticky. So are queens.", 54: "Halfway through the picnic.", 55: "Heavy hitters on this table.", 56: "Fewer ant types, bigger crowds.", 57: "The cookie waits at the end.", 58: "Drones and nurses arrive together.", 59: "The Syrup Queen drips Drones." }, L42_TIP = "Glaze grows back. Focus fire.", QUEEN_TRAITS = { ...tuning_default.queenTraitMods };
function queenTake(traits = [], T = QUEEN_TRAITS) {
  return 50 + traits.reduce((s, t) => s + (T[t] || 0), 0);
}
var ANTS = {};
for (let [id, a] of Object.entries(tuning_default.ants))
  ANTS[id] = { ...ANT_TEXT[id] || { name: id, desc: "" }, ...a, size: ANT_SIZES[a.size] ?? a.size, sizeClass: a.size }, a.boss && (ANTS[id].steal = queenTake(a.queenTraits || []));
var isQueen = (type) => !!(ANTS[type] && ANTS[type].boss), RARITY_TIERS = ["common", "uncommon", "rare", "elite", "boss"], rarityOf = (type) => ANTS[type] && ANTS[type].rarity || "common", rarityRank = (type) => Math.max(0, RARITY_TIERS.indexOf(rarityOf(type))), WORLDS = tuning_default.worlds.map((w) => ({ coinMul: 1, ...w })), QUEENS = Object.fromEntries(WORLDS.map((w) => [w.id, { type: w.queen, traits: tuning_default.ants[w.queen].queenTraits }]));
function antPower(a) {
  return a.hp * (1 + 0.12 * a.armor) * (a.gasImmune ? 1.15 : 1) * (a.flying ? 1.4 : 1) * Math.sqrt(a.speed / ANTS.worker.speed);
}
function crumbsFor(type) {
  let a = ANTS[type];
  return a.crumbs != null ? a.crumbs : Math.max(1, Math.round(antPower(a) / antPower(ANTS.worker)));
}
var BONUSES = {
  bomb: { name: "Bomb", damage: 60, radius: 105, targetsAir: !1, needsTarget: !0, color: "#ff8c8c", desc: "Big boom where you tap. Bosses survive." },
  plane: { name: "Crop Duster", damage: 22, slow: 0.4, slowTime: 2, speed: 260, targetsAir: !0, needsTarget: !1, color: "#a0d8ef", desc: "Sprays the whole trail. Hits flyers too." },
  freeze: { name: "Freezer", time: 4, needsTarget: !1, color: "#c7ecff", desc: "Freezes every ant for 4 seconds." },
  decoy: { name: "Sugar Cube", time: 6, needsTarget: !0, color: "#fff7e6", desc: "Ants rush to the sugar and munch on it." }
}, BONUS_TYPES = Object.keys(BONUSES), ECONOMY = {
  startCoins: 0,
  // v0.3 item 5 (was 50); also after Reset
  // WIN  : coins = winBase + foodLeft * coinsPerFood + kills * coinsPerKillWin + levelIndex * coinsPerLevel  (+ firstClearBonus)
  winBase: 10,
  coinsPerFood: 0.3,
  coinsPerKillWin: 0.15,
  coinsPerLevel: 3,
  firstClearBonus: 25,
  // v0.7.6 E1: coins paid ONCE per level the first time it reaches 2 / 3 stars (tuning.json economy.starBonus); a 1 -> 3 star jump pays both
  starBonus: { 2: tuning_default.economy.starBonus[2], 3: tuning_default.economy.starBonus[3] },
  starBonusScale: tuning_default.economy.starBonusScale,
  // v0.7.10 R1: 'coinMul' = bonus x world coinMul (rounded to 5)
  // v0.7.6 E3: diamonds on the first clear of a world's boss level (its last level) and on the first 3 stars there (tuning.json economy.bossGems)
  bossGems: { firstClear: tuning_default.economy.bossGems.firstClear, firstThreeStars: tuning_default.economy.bossGems.firstThreeStars },
  // v0.6 item 1: + floor(battle time / secondsPerCoin) for the time survived - its own results line, on a win AND on a loss.
  secondsPerCoin: 3,
  // LOSS : coins = min(lossCap, floor(kills * coinsPerKillLoss) + floor(time / secondsPerCoin)). The cap covers the whole loss
  //        payout (kills + time). Never cards or prizes.
  coinsPerKillLoss: 0.1,
  lossCap: 15,
  startBonusStock: 0,
  // v0.3 item 14 (was 3): every booster starts at 0
  firstClearBoosters: { 0: "bomb" },
  // v0.3 item 14: first clear of level 1 (index 0) -> ONE Bomb (count is always 1)
  maxBoostersPerAward: 1,
  // v0.3 item 14: never award more than ONE booster at a time
  bonusRewardOnFirstClear: 0,
  // v0.2: off - special prizes only come from a Perfect level
  // PERFECT level = win with full food and nothing ever stolen -> "Perfect Cookie!" + one prize from this table (weights w)
  perfectPrizes: [
    { kind: "cards", count: 3, w: 2 },
    // a card you don't own yet (L1); else ONE level-1 card of an owned type
    { kind: "bonus", id: "bomb", count: 1, w: 1 },
    // v0.3 item 14: booster prizes are ONE booster (was 2)
    { kind: "bonus", id: "plane", count: 1, w: 1 },
    { kind: "bonus", id: "freeze", count: 1, w: 1 },
    { kind: "bonus", id: "decoy", count: 1, w: 1 }
  ],
  shop: {
    cardL1: 12,
    // v0.6 item 4: coins for one level-1 card of a tower you own (there are no "copies" any more)
    cardPack: 40,
    // coins for 5 random level-1 cards of towers you own
    packPity: 10,
    // v0.7 D-P3: while a tower is locked, every 10th paid pack without a new tower holds one
    cardPackSize: 5,
    // v0.4 item 10: boosters are bought with DIAMONDS at a FIXED price (all 4 boosters): 15 in the Shop, 20 in battle.
    boosterDiamonds: 15,
    // diamonds per booster in the Shop (was 30 coins)
    // v0.6.2 item 12: unlocking a tower you don't own yet (any time, not tied to stages) costs a TIERED price by base power
    // (tuning.json shop.unlockPrice: 100 Boombox/Perfume/Lava, 200 Gecko/E-Gate/Zapper, 400 Laser/Tractor). Replaces the flat 60c.
    unlockPrice: { ...tuning_default.shop.unlockPrice },
    unlockPriceDefault: tuning_default.shop.unlockPriceDefault,
    // v0.6.2 item 13: chance that a card pack holds ONE new (locked) tower card (L1) as one of its cards (tuning.json shop)
    packNewTowerChance: tuning_default.shop.packNewTowerChance
  },
  // v0.3 items 8/12: diamonds (persistent, start 0, come from the Reward Calendar). The crumb price escalates and RESETS every battle.
  diamonds: {
    start: 0,
    crumbPack: 50,
    // crumbs per in-battle purchase
    crumbPriceStart: 10,
    // 10 -> 20 -> 40 -> 80 -> 160 ...
    crumbPriceMul: 2,
    boosterPriceStart: 20,
    // v0.4 item 10: FIXED 20 diamonds per booster in battle, no escalation (all 4 boosters)
    boosterPriceStep: 0,
    // was 10 (20, 30, 40 ...) in v0.3
    perBooster: !1,
    moveTower: 1
    // v0.5 item 11: move a placed tower to another cell in battle (swapping two towers is free)
  },
  // v0.4 item 17: the Cards button blinks (5 s, blink only) exactly twice ever: (1) the first time the coins are enough to buy a
  // card, (2) the first time after a LOSS that the coins are enough. "A card" = the cheapest card purchase (one level-1 card, 12c).
  cardsBlinkSec: 5
}, CALENDAR = {
  monthLength: 30,
  monthlyReset: { rule: "missedDay", hours: 24 },
  // 'missedDay' (default) | 'hours24' (legacy alternative; uses `hours`)
  // v0.7.6 E2/E5: [30, 60, 90, 120] (tuning.json economy.calendar; was 5/10/15/20) x (1 + worldStep x (highest unlocked world - 1)), rounded to roundTo
  coinsByStreak: tuning_default.economy.calendar.coinsByStreak.slice(),
  // 1st, 2nd, 3rd, 4th+ coin prize of the current streak (the last value is the cap)
  worldStep: tuning_default.economy.calendar.worldStep,
  roundTo: tuning_default.economy.calendar.roundTo,
  diamondsByStreakWeek: [2, 3, 4, 5],
  // streak days 1-7, 8-14, 15-21, 22-30
  week: [
    // tile 1..7 of the player's 7-day cycle
    { kind: "coins" },
    { kind: "coins" },
    { kind: "diamonds" },
    { kind: "coins" },
    { kind: "card", level: 1 },
    { kind: "diamonds" },
    { kind: "card", level: 2, extra: { kind: "diamonds", count: 5 } }
    // v0.4 item 2: day 7 = level-2 card + 5 diamonds
  ],
  // monthly surprise boxes at 10/20/30 (contents are not shown before they are won). v0.4 item 1: the day-30 box = a level-3 card.
  monthMilestones: { 10: { kind: "diamonds", count: 3 }, 20: { kind: "diamonds", count: 4 }, 30: { kind: "card", level: 3 } },
  heartbeatSec: 60
  // how often the visit / "last seen" is refreshed while the game is visible
}, UI = {
  queenCheerHold: 4.2,
  // v0.6.2 item 14: on a queen-level win the result panel + buttons wait this long ('Way to go' + fireworks)
  swatPivot: { dx: 46, dy: 17, oldDx: 35, oldDy: 21 },
  // v0.7.4 P: the swatter's pivot beside the cookie (was 35, 21): the slap head lands 10-14 px farther from the cookie centre
  carrierLane: 5,
  // v0.7.4 P: lateral offset (design px) of an ant walking home with food
  rescueSweepRadius: 24,
  // v0.7.4 M2: a finger drag collects crumbs within this distance of its path
  speedMaxAtStart: 2,
  // v0.7.4 M0: a battle starts at 1x or 2x at most (a session's 4x becomes 2x); the speed is never saved
  toastTime: 0.9,
  // seconds for small in-battle notices ("Need 10 crumbs")
  menuToastTime: 1.3,
  mergeAnimTime: 1.5,
  perfectAnimTime: 1.8,
  upgradeInfoTime: 2.5,
  // after an upgrade the info panel shows this long, then closes (B9) unless the player tapped it/the tower
  showAimOnlyWhenRelevant: !0,
  // v0.4 item 5: no direction arrows at all; the fan shows its area circle, the marble its roll line
  // v0.3 item 4: cookie face by food left (fraction, highest first) + a short 'ouch' face when a piece is stolen
  cookieFaces: [
    { min: 0.85, face: "happy" },
    { min: 0.7, face: "content" },
    { min: 0.55, face: "worried" },
    { min: 0.4, face: "nervous" },
    { min: 0.28, face: "sad" },
    { min: 0.18, face: "crying" },
    { min: 0.09, face: "screaming" },
    { min: 0.03, face: "pleading" },
    { min: -1, face: "fainted" }
  ],
  ouchTime: 0.35,
  // v0.4 item 18 / v0.5 item 3: the treat (cookie, cake, ...) reacts with a short ANIMATED face every time ants take a bite:
  // 'surprised', 'oyoy' (bites come fast), 'sad', 'crying' (big bites, e.g. the queen). FACES ONLY - no text / speech bubbles.
  // See src/treat.js (rules) and art.js drawTreat/drawTreatFace (one face set for every treat).
  treatReact: { time: 1.6, rushWindow: 4, rushBites: 3, bigBite: 5 }
}, TREATS = Object.fromEntries(WORLDS.map((w) => [w.id, w.treat])), MERGE = {
  cardsPerMerge: 3,
  coinCost: [0, 0, 10, 20, 40, 60, 90, 130, 180, 240, 320]
}, MAX_CARD_LEVEL = 10, LEVELS = tuning_default.levels.map((L) => ({ ...L })), isBossLevel = (i) => {
  let L = LEVELS[i], w = L && WORLDS.find((x) => x.id === L.world);
  return !!w && i === WORLD_START[w.id] + w.levels - 1;
}, WORLD_START = Object.fromEntries(WORLDS.map((w) => [w.id, LEVELS.findIndex((L) => L.world === w.id)])), worldOf = (i) => LEVELS[i] ? LEVELS[i].world : 1, treatOf = (i) => TREATS[worldOf(i)] || "cookie";
var SKINS = [
  { id: "slingshot-1", tower: "slingshot", name: "Bubblegum", tier: 1, price: 1500, pad: "#ef51ee" },
  { id: "slingshot-2", tower: "slingshot", name: "Sandstone", tier: 2, price: 3e3, pad: "#a09760" },
  { id: "slingshot-3", tower: "slingshot", name: "Meadow", tier: 3, price: 6e3, pad: "#53a764" },
  { id: "laser-1", tower: "laser", name: "Denim", tier: 1, price: 1500, pad: "#6c9bb4" },
  { id: "laser-2", tower: "laser", name: "Orchid", tier: 2, price: 3e3, pad: "#d86cd2" },
  { id: "laser-3", tower: "laser", name: "Olive", tier: 3, price: 6e3, pad: "#9e9820" },
  { id: "zapper-1", tower: "zapper", name: "Fuchsia", tier: 1, price: 1500, pad: "#ff4cc1" },
  { id: "zapper-2", tower: "zapper", name: "Caramel", tier: 2, price: 3e3, pad: "#c58a4f" },
  { id: "zapper-3", tower: "zapper", name: "Dusty Rose", tier: 3, price: 6e3, pad: "#d17d92" },
  { id: "sound-1", tower: "sound", name: "Persimmon", tier: 1, price: 1500, pad: "#f06a48" },
  { id: "sound-2", tower: "sound", name: "Coral", tier: 2, price: 3e3, pad: "#db7766" },
  { id: "sound-3", tower: "sound", name: "Mauve", tier: 3, price: 6e3, pad: "#c979b5" }
], SKIN_TOWERS = ["slingshot", "laser", "zapper", "sound"];
var DAILY_WIN = { base: 50, capMul: 2 };

// src/sim.js
function mulberry32(seed) {
  let a = seed >>> 0;
  return function() {
    a |= 0, a = a + 1831565813 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    return t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t, ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function applyArmor(dmg, armor, ignoreArmor = !1) {
  return ignoreArmor ? dmg : Math.max(1, dmg - armor);
}
function cardCost(cardsPlayed, cfg = BATTLE) {
  return cfg.firstCardCost + cardsPlayed * cfg.cardCostStep;
}
function starsFor(foodLeft, foodHP = BATTLE.foodHP, table = STARS) {
  let pct = foodLeft / foodHP * 100;
  for (let s of table) if (pct >= s.minPct - 1e-9) return s.stars;
  return 0;
}
var LOWEST_HP = /* @__PURE__ */ new Set(["slingshot", "laser", "zapper", "lizard"]);
var BASE_MODES = ["weak", "carrier"], FRONT_FOR_TESTS = !1;
function hasTargetModes(type) {
  return LOWEST_HP.has(type);
}
function isHealerType(type) {
  let A = ANTS[type];
  return !!(A && (A.heal || A.aura));
}
function modesForLevel(levelIndex) {
  let out = BASE_MODES.slice();
  return levelAntTypes(levelIndex).some(isHealerType) && out.push("healer"), isBossLevel(levelIndex) && out.push("strong"), out;
}
function nextTargetMode(mode, list = BASE_MODES) {
  let k = list.indexOf(mode);
  return list[(k + 1) % list.length];
}
function onTile(a, c, r) {
  return Math.floor(a.x / TILE) === c && Math.floor(a.y / TILE) === r;
}
function liftable(a, lift) {
  let A = ANTS[a.type];
  return !A.boss && !a.flying && (SIZE_RANK[A.sizeClass] || 9) <= lift;
}
function canHit(targets, flying) {
  return targets === "both" || targets === "air" == !!flying;
}
function worldCardLevelCap(levelIndex) {
  let L = LEVELS[levelIndex], w = L && WORLDS.find((x) => x.id === L.world);
  return w && w.cardLevelCap || null;
}
var DAMAGE_UPGRADE_TOWERS = ["slingshot", "spray", "sound", "ball", "lizard", "laser", "zapper", "gate", "lava"];
function upgradeGain(type, lvl, cardLevel = 1) {
  if (!DAMAGE_UPGRADE_TOWERS.includes(type)) return 0;
  let dps = (L) => towerStat(type, "power", L, cardLevel) * (towerStat(type, "rate", L, cardLevel) || 1) * (type === "laser" ? 1 + (towerStat(type, "heatMax", L, cardLevel) || 0) : 1), base = dps(1);
  return base > 0 ? dps(lvl) / base : 0;
}
function isDamageCard(id) {
  let T = TOWERS[id];
  return T.kind === "tower" && id !== "fan" && T.targets !== "air" && !T.nearTrail;
}
function towerStat(type, key, lvl = 1, cardLevel = 1) {
  let T = TOWERS[type], v = T.stats && key in T.stats ? T.stats[key] : T[key];
  if (v == null || typeof v != "number") return v ?? null;
  v = applyCardSteps(T, key, v, cardLevel);
  let ups = T.upgrades || [], cardLift = type === "tractor" ? applyCardSteps(T, "liftSize", T.liftSize, cardLevel) : 0;
  for (let i = 0; i < lvl - 1 && i < ups.length; i++) {
    let u = ups[i];
    if (key === "liftSize") {
      u.liftSize != null && cardLift < LIFT_MAX && (v += u.liftSize);
      continue;
    }
    key === "rate" && u.rateIfMaxLift != null && cardLift >= LIFT_MAX && (v *= u.rateIfMaxLift), u[key] != null && (v *= u[key]);
  }
  return key === "liftSize" && (v = Math.min(LIFT_MAX, Math.round(v))), (key === "slow" || key === "power" && T.powerFmt === "pct") && (v = Math.min(SLOW_CAP, v)), key === "chain" && (v = Math.round(v)), v;
}
function applyCardSteps(T, key, v, cardLevel = 1) {
  let steps = T.cardUpgrades || [];
  for (let i = 0; i < cardLevel - 1 && i < steps.length; i++) {
    let a = steps[i][key];
    a != null && (v = key === "range" ? v + a * TILE : key === "liftSize" ? Math.min(LIFT_MAX, v + a) : v * (1 + a));
  }
  return v;
}
function cardUpgradeDiff(type, fromLevel) {
  let step = (TOWERS[type].cardUpgrades || [])[fromLevel - 1];
  return !step || fromLevel >= MAX_CARD_LEVEL ? [] : Object.keys(step).map((key) => ({ key, label: statLabel(type, key), amount: step[key], from: towerStat(type, key, 1, fromLevel), to: towerStat(type, key, 1, fromLevel + 1) }));
}
function upgradeDiff(type, fromLvl, cardLevel = 1) {
  let up = (TOWERS[type].upgrades || [])[fromLvl - 1];
  return up ? [...new Set(Object.keys(up).map((k) => k === "rateIfMaxLift" ? "rate" : k))].map((key) => ({ key, label: statLabel(type, key), from: towerStat(type, key, fromLvl, cardLevel), to: towerStat(type, key, fromLvl + 1, cardLevel) })).filter((d) => d.from !== d.to) : [];
}
function statLabel(type, key) {
  let T = TOWERS[type];
  return key === "power" ? T.powerLabel || "Power" : key === "range" ? T.rangeLabel || (T.place === "path" ? "Area" : "Range") : STAT_LABELS[key] || key;
}
function rangeTiles(type, px) {
  return px / TILE;
}
var r1 = (v) => Math.abs(v - Math.round(v)) < 0.05 ? String(Math.round(v)) : v.toFixed(1);
function formatStat(type, key, v) {
  let T = TOWERS[type];
  return v == null ? key === "rate" ? "always on" : "-" : key === "power" ? T.powerFmt === "pct" ? `${Math.round(v * 100)}%` : r1(v) : key === "rate" ? v >= 1 ? `${v.toFixed(1)}/s` : `1 per ${(1 / v).toFixed(1)}s` : key === "range" ? T.place === "path" ? "its tile" : `${rangeTiles(type, v).toFixed(1)} tiles` : key === "liftSize" ? LIFT_NAMES[v] || String(v) : key === "slow" ? `${Math.round(v * 100)}%` : key === "ballRadius" ? `${(2 * v / TILE).toFixed(2)} tiles` : key === "cloudRadius" || key === "chainRange" ? `${(v / TILE).toFixed(1)} tiles` : key === "heatMax" ? `+${Math.round(v * 100)}%` : key === "chain" ? `${v} jumps` : /Time$/.test(key) || key === "stagger" ? `${v.toFixed(1)}s` : r1(v);
}
var DIRS2 = [[1, 0], [0, 1], [-1, 0], [0, -1]];
function routeTileSeq(wps) {
  let out = [], push = (c, r) => {
    let l = out[out.length - 1];
    (!l || l[0] !== c || l[1] !== r) && out.push([c, r]);
  };
  for (let i = 0; i < wps.length; i++) {
    let b = [Math.round(wps[i][0]), Math.round(wps[i][1])];
    if (!i) {
      push(b[0], b[1]);
      continue;
    }
    let a = out[out.length - 1], sx = Math.sign(b[0] - a[0]), sy = Math.sign(b[1] - a[1]), c = a[0], r = a[1];
    for (; c !== b[0] || r !== b[1]; )
      c += sx, r += sy, push(c, r);
  }
  return out.filter(([c, r]) => c >= 0 && r >= 0 && c < GRID_COLS && r < GRID_ROWS);
}
function dirFromVec(dx, dy) {
  return Math.abs(dx) >= Math.abs(dy) ? dx >= 0 ? 0 : 2 : dy >= 0 ? 1 : 3;
}
var Path = class {
  constructor(tilePts) {
    this.pts = tilePts.map(([c, r]) => ({ x: (c + 0.5) * TILE, y: (r + 0.5) * TILE })), this.cum = [0];
    for (let i = 1; i < this.pts.length; i++) {
      let a = this.pts[i - 1], b = this.pts[i];
      this.cum.push(this.cum[i - 1] + Math.hypot(b.x - a.x, b.y - a.y));
    }
    this.length = this.cum[this.cum.length - 1], this.tiles = /* @__PURE__ */ new Set();
    for (let d = 0; d <= this.length; d += 4) {
      let p = this.at(d), c = Math.floor(p.x / TILE), r = Math.floor(p.y / TILE);
      c >= 0 && r >= 0 && c < GRID_COLS && r < GRID_ROWS && this.tiles.add(c + "," + r);
    }
  }
  at(d) {
    d = Math.max(0, Math.min(this.length, d));
    let i = 1;
    for (; i < this.cum.length - 1 && this.cum[i] < d; ) i++;
    let a = this.pts[i - 1], b = this.pts[i], seg = this.cum[i] - this.cum[i - 1] || 1, t = (d - this.cum[i - 1]) / seg;
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, dx: (b.x - a.x) / seg, dy: (b.y - a.y) / seg };
  }
  nearestD(x, y) {
    let best = 0, bd = 1 / 0;
    for (let d = 0; d <= this.length; d += 2) {
      let p = this.at(d), q = (p.x - x) ** 2 + (p.y - y) ** 2;
      q < bd && (bd = q, best = d);
    }
    return { d: best, dist: Math.sqrt(bd) };
  }
  isPathTile(c, r) {
    return this.tiles.has(c + "," + r);
  }
}, SPLIT_BACK = 3, SPLIT_STEP = 7, MAX_SPLIT_DEPTH = 1, SPACING = {
  small: 0.45,
  worker: 1,
  big: 1.6,
  gasmask: 1,
  armored: 1.5,
  flyer: 0.8,
  sprinter: 0.9,
  heavy: 1.7,
  queen: 1,
  queen2: 1,
  small_gasmask: 0.45,
  small_armed: 0.6,
  small_fly: 0.5,
  greasy: 1.1,
  mama: 1.6,
  queen3: 1,
  nurse: 1.5,
  queen4: 1,
  drone: 0.8,
  queen6: 1
};
function generateWaves(levelIndex, levels = LEVELS) {
  let L = levels[levelIndex];
  if (L.waves) return L.waves.map((groups) => expandGroups(groups, L.interval || 1));
  let rng = mulberry32(1e3 + levelIndex * 7919), waves = [];
  for (let i = 0; i < L.waveCount; i++) {
    let n = i + 1, pool = L.mix.filter((m) => (m.from || 1) <= n), total = pool.reduce((s, m) => s + m.w, 0), count = Math.round(L.base + L.growth * i), list = [], t = 0;
    for (let k = 0; k < count; k++) {
      let r = rng() * total, type = pool[0].type;
      for (let m of pool)
        if (r -= m.w, r <= 0) {
          type = m.type;
          break;
        }
      let reps = type === "small" || type === "small_gasmask" || type === "small_fly" ? 2 : 1;
      for (let j = 0; j < reps; j++)
        list.push({ t, type }), t += L.interval * SPACING[type] * (j < reps - 1 ? 0.5 : 1);
    }
    if (L.special && L.special[n]) {
      let t2 = t;
      for (let g of L.special[n]) {
        t2 += g.delay || 0;
        for (let j = 0; j < g.count; j++)
          list.push({ t: t2, type: g.type }), t2 += g.interval;
      }
    }
    list.sort((a, b) => a.t - b.t), waves.push(list);
  }
  return waves;
}
function expandGroups(groups, interval) {
  let list = [], t = 0;
  for (let g of groups) {
    t += g.delay || 0;
    for (let j = 0; j < g.count; j++)
      list.push({ t, type: g.type }), t += g.interval || interval;
  }
  return list;
}
function levelAntTypes(levelIndex) {
  let s = /* @__PURE__ */ new Set();
  for (let w of generateWaves(levelIndex)) for (let e of w) s.add(e.type);
  return [...s];
}
function foodReturned(carrying, progress, R = BATTLE.foodReturn) {
  let f = R.mode === "distance" ? R.distMin + (R.distMax - R.distMin) * Math.max(0, Math.min(1, progress)) : R.fixed, v = carrying * f;
  return R.rounding === "floor" ? v = Math.floor(v + 1e-9) : R.rounding === "round" && (v = Math.round(v)), Math.round(v * 1e3) / 1e3;
}
var NEXT_ID = 1, Battle = class {
  /**
   * opts: { levelIndex, deck: [cardIds], bonusTypes: [ids], bonusStock: {id:n}, cardLevels: {id:L}, seed, battleCfg, onBonusUsed }
   */
  constructor(opts) {
    this.cfg = { ...BATTLE, ...opts.battleCfg || {} }, this.cfg.foodReturn = { ...BATTLE.foodReturn, ...(opts.battleCfg || {}).foodReturn || {} }, this.cfg.rescue = { ...BATTLE.rescue, ...(opts.battleCfg || {}).rescue || {} }, this.levelIndex = opts.levelIndex, this.level = LEVELS[opts.levelIndex], this.specialsOn = opts.specials !== void 0 ? !!opts.specials : tuning_default.specials !== !1, this.mapId = opts.mapId || this.level.map, this.map = MAPS[this.mapId];
    let parsed = parseMap(this.map, GRID_COLS, GRID_ROWS);
    this.routes = parsed.routes.map((r) => new Path(r)), this.path = this.routes[0], this.props = parsed.props, this.pathTiles = /* @__PURE__ */ new Set();
    for (let rt of this.routes) for (let t of rt.tiles) this.pathTiles.add(t);
    this.trailEdges = /* @__PURE__ */ new Set();
    for (let wps of parsed.routes) {
      let seq = routeTileSeq(wps);
      for (let i = 1; i < seq.length; i++) {
        let [a, b] = [seq[i - 1], seq[i]];
        this.trailEdges.add(a + ">" + b), this.trailEdges.add(b + ">" + a);
      }
    }
    this.blocked = /* @__PURE__ */ new Set();
    let ends = [];
    for (let rt of this.routes)
      ends.push({ ...rt.pts[0], k: 0 }), ends.push({ ...rt.pts[rt.pts.length - 1], k: 1 });
    for (let c = 0; c < GRID_COLS; c++) for (let r = 0; r < GRID_ROWS; r++) {
      let x = (c + 0.5) * TILE, y = (r + 0.5) * TILE;
      ends.some((e) => Math.hypot(e.x - x, Math.max(e.y, 20) - y) < (e.k ? 36 : 30)) && this.blocked.add(c + "," + r);
    }
    for (let p of this.props) this.blocked.add(p.c + "," + p.r);
    if (this.rng = mulberry32(opts.seed ?? 12345), this.deck = opts.deck.slice(0, this.cfg.deckSize), this.cardLevelCap = opts.noCardLevelCap ? null : worldCardLevelCap(opts.levelIndex || 0), this.cardLevels = { ...opts.cardLevels || {} }, this.cardLevelCap) for (let k of Object.keys(this.cardLevels)) this.cardLevels[k] = Math.min(this.cardLevels[k], this.cardLevelCap);
    this.bonusTypes = (opts.bonusTypes || []).slice(0, this.cfg.bonusTypesToBring), this.bonusStock = { ...opts.bonusStock || {} }, this.bonusUsesLeft = this.cfg.maxBonusUses, this.dia = { crumbs: 0, boosters: 0, per: {} }, this.waves = generateWaves(opts.levelIndex), this.time = 0, this.crumbs = this.cfg.startCrumbs, this.crumbsEarned = 0, this.cardsPlayed = 0, this.rerolls = 0, this.foodStored = this.cfg.foodHP, this.foodDelivered = 0, this.ants = [], this.towers = [], this.projectiles = [], this.clouds = [], this.balls = [], this.pending = [], this.nextWave = 0, this.nextWaveAt = this.cfg.firstWaveDelay, this.routeCounter = 0, this.freezeUntil = -1, this.decoy = null, this.planes = null, this.events = [], this.pieces = [], this.rescueScale = 1, this.pieceId = 1, this.stats = { kills: 0, spawned: 0, byType: {}, stolen: 0, returned: 0, lostOnWay: 0 }, this.result = null, this.paused = !1, this.onBonusUsed = opts.onBonusUsed || null, this.picks = [], this.dealHand();
  }
  // v0.7 D-R1/D-R2: a full hand (start of battle and every redraw). Distinct cards when the deck allows it; while no card has been
  // played yet, the hand holds >= openingDamageCards damage cards (when the deck has that many): draw those first, then the rest.
  dealHand() {
    let n = this.cfg.visiblePicks, hand = [];
    if (this.cfg.distinctHand) {
      let ids = [...new Set(this.deck)], take = (pool) => {
        let id = pool[Math.floor(this.rng() * pool.length) % pool.length];
        hand.push(id), ids.splice(ids.indexOf(id), 1);
      };
      if (this.cardsPlayed === 0 && this.cfg.openingDamageCards)
        for (let k = 0; k < this.cfg.openingDamageCards && hand.length < n; k++) {
          let dmg = ids.filter(isDamageCard);
          if (!dmg.length) break;
          take(dmg);
        }
      for (; hand.length < n && ids.length; ) take(ids);
      for (; hand.length < n; ) hand.push(this.draw());
      for (let i = hand.length - 1; i > 0; i--) {
        let j = Math.floor(this.rng() * (i + 1));
        [hand[i], hand[j]] = [hand[j], hand[i]];
      }
    } else
      for (let i = 0; i < n; i++) hand.push(this.draw());
    if (this.cfg.guaranteeDamageOpening && this.cardsPlayed === 0) {
      let dmg = this.deck.filter(isDamageCard);
      dmg.length && !hand.some(isDamageCard) && (hand[0] = dmg[Math.floor(this.rng() * dmg.length)]);
    }
    this.picks = hand;
  }
  // v0.7 D-R1: the card that replaces a played one differs from the two still in the hand (when the deck allows it)
  drawReplacement(pickIndex) {
    if (!this.cfg.distinctHand) return this.draw();
    let others = this.picks.filter((_, i) => i !== pickIndex), pool = [...new Set(this.deck)].filter((id) => !others.includes(id));
    return pool.length ? pool[Math.floor(this.rng() * pool.length) % pool.length] : this.draw();
  }
  draw() {
    return this.deck[Math.floor(this.rng() * this.deck.length)];
  }
  get nextCardCost() {
    return cardCost(this.cardsPlayed, this.cfg);
  }
  get totalWaves() {
    return this.waves.length;
  }
  get foodLeft() {
    return this.foodStored;
  }
  get perfect() {
    return this.result === "win" && this.stats.stolen === 0 && this.foodStored >= this.cfg.foodHP;
  }
  route(a) {
    return this.routes[a.ri || 0];
  }
  isPathTile(c, r) {
    return this.pathTiles.has(c + "," + r);
  }
  nearestOnTrail(x, y) {
    let best = null;
    return this.routes.forEach((rt, ri) => {
      let n = rt.nearestD(x, y);
      (!best || n.dist < best.dist) && (best = { ...n, ri });
    }), best;
  }
  emit(e) {
    this.events.push(e), this.events.length > 400 && this.events.splice(0, 200);
  }
  // ----- waves -----
  startWave() {
    if (this.nextWave >= this.waves.length) return !1;
    let w = this.waves[this.nextWave], last2 = 0;
    for (let e of w)
      this.pending.push({ t: this.time + e.t, type: e.type }), last2 = Math.max(last2, e.t);
    return this.nextWave++, this.nextWaveAt = this.time + last2 + this.cfg.waveGap, this.emit({ type: "wave", n: this.nextWave }), !0;
  }
  callWaveEarly() {
    if (this.result || this.paused || this.nextWave >= this.waves.length) return 0;
    let skipped = Math.max(0, this.nextWaveAt - this.time), bonus = Math.floor(skipped * this.cfg.earlyCallBonusPerSec);
    return this.addCrumbs(bonus), this.startWave(), bonus;
  }
  addCrumbs(n) {
    this.crumbs += n, this.crumbsEarned += n;
  }
  spawn(type, d = 0, ri = null) {
    let a = ANTS[type], hp = Math.round(a.hp * (this.level.hpMul || 1));
    ri == null && (ri = this.routeCounter++ % this.routes.length);
    let ant = {
      id: NEXT_ID++,
      type,
      ri,
      hp,
      maxHp: hp,
      armor: a.armor,
      d,
      speed: a.speed,
      flying: !!a.flying,
      gasImmune: !!a.gasImmune,
      weight: a.weight,
      size: a.size,
      state: "go",
      carrying: 0,
      trips: 0,
      waitT: 0,
      slow: 0,
      stunT: 0,
      charmT: 0,
      charmD: 0,
      plantSlow: 0,
      plantSlowT: 0,
      spawnT: a.spawn ? a.spawn.every : 0,
      healCd: 0,
      healFx: 0,
      shield: 0,
      shieldMax: 0,
      shieldT: 99,
      dead: !1,
      x: 0,
      y: 0,
      born: this.time,
      hitFlash: 0,
      dir: 1
    }, p = this.routes[ri].at(d);
    return ant.x = p.x, ant.y = p.y, a.shield && a.shield.pts > 0 && (ant.shieldMax = ant.shield = Math.round(a.shield.pts * (this.level.hpMul || 1))), this.ants.push(ant), this.stats.spawned++, ant;
  }
  // v0.8.2 M7a: the ONLY way sim.js reads a tower's special: the params when it is active (world >= 6, card level >= 5, flag on), else null
  spec(tw) {
    return this.specialsOn && tw && tw.stat && specialActive(tw, this.level) ? TOWERS[tw.type].special.params : null;
  }
  damage(ant, dmg, opt = {}) {
    if (ant.dead || dmg <= 0) return 0;
    if (opt.gas && ant.gasImmune)
      return opt.fx !== !1 && this.rng() < 0.05 && this.emit({ type: "immune", x: ant.x, y: ant.y }), 0;
    let real = applyArmor(dmg, ant.armor, opt.ignoreArmor), toHp = real;
    if (ant.shieldMax > 0 && (ant.shieldT = 0, ant.shield > 0)) {
      let ab = Math.min(ant.shield, real);
      ant.shield -= ab, toHp -= ab, this.stats.shieldAbsorbed = (this.stats.shieldAbsorbed || 0) + ab, ant.shield <= 1e-9 && (ant.shield = 0, this.stats.shieldBreaks = (this.stats.shieldBreaks || 0) + 1, this.emit({ type: "shieldBreak", x: ant.x, y: ant.y, id: ant.id, ant: ant.type }));
    }
    return ant.hitFlash = 0.12, toHp > 1e-12 && (ant.hp -= toHp, ant.hp <= 0 && this.kill(ant, opt.src)), real;
  }
  kill(ant, src) {
    ant.dead = !0;
    let crumbs = ant.child ? 0 : crumbsFor(ant.type);
    if (this.addCrumbs(crumbs), ant.child ? this.stats.childKills = (this.stats.childKills || 0) + 1 : (this.stats.kills++, this.stats.byType[ant.type] = (this.stats.byType[ant.type] || 0) + 1), ant.carrying > 0 && this.cfg.rescue && this.cfg.rescue.on) {
      let R = this.cfg.rescue, auto = Math.round(ant.carrying * R.auto * 1e3) / 1e3, bonus = Math.round(ant.carrying * (R.tap - R.auto) * 1e3) / 1e3;
      this.stats.lostOnWay += ant.carrying - auto, auto > 0 && (this.foodStored = Math.min(this.cfg.foodHP, this.foodStored + auto), this.stats.returned += auto, this.emit({ type: "foodReturn", x: ant.x, y: ant.y, n: auto, of: ant.carrying })), bonus > 0 && this.dropPiece(ant.x, ant.y, bonus), ant.carrying = 0;
    } else if (ant.carrying > 0) {
      let rt = this.route(ant), back = foodReturned(ant.carrying, ant.d / rt.length, this.cfg.foodReturn);
      this.stats.lostOnWay += ant.carrying - back, back > 0 && (this.foodStored = Math.min(this.cfg.foodHP, this.foodStored + back), this.stats.returned += back, this.emit({ type: "foodReturn", x: ant.x, y: ant.y, n: back, of: ant.carrying })), ant.carrying = 0;
    }
    this.emit({ type: "kill", x: ant.x, y: ant.y, ant: ant.type, crumbs, src: src && src.type, ...src && src.type === "swatter" ? { ref: ant } : {} }), src && src.type === "lizard" && (src.chew = src.stat("chewTime")), this.splitAnt(ant);
  }
  // v0.7.7 splitInto (tuning.json ants[].splitInto = { type, count }): a dying ant drops `count` children of `type` on its own route, behind it
  // (d - 3 - 7k, k = 0..count-1; where that would fall off the nest end the child goes the same distance AHEAD instead, so no two children stack).
  // Children pay 0 crumbs (kill()), do not count as kills, start at full hp x hpMul, walk the normal 'go' state, and NEVER split (child flag + MAX_SPLIT_DEPTH).
  splitAnt(ant) {
    let SP = ANTS[ant.type].splitInto;
    if (!SP || ant.child || (ant.gen || 0) >= MAX_SPLIT_DEPTH || !(SP.count > 0) || !ANTS[SP.type] || ant.splitDone) return [];
    ant.splitDone = !0;
    let len = this.routes[ant.ri].length, kids = [];
    for (let k = 0; k < SP.count; k++) {
      let off = SPLIT_BACK + k * SPLIT_STEP, d = ant.d - off;
      d < 0 && (d = Math.min(len - 0.01, ant.d + off));
      let c = this.spawn(SP.type, Math.max(0, d), ant.ri);
      c.child = !0, c.gen = (ant.gen || 0) + 1, c.parentId = ant.id, kids.push(c);
    }
    return this.stats.splitSpawned = (this.stats.splitSpawned || 0) + kids.length, this.emit({ type: "split", x: ant.x, y: ant.y, ant: ant.type, kids: kids.map((c) => ({ id: c.id, x: c.x, y: c.y })) }), kids;
  }
  // ----- v0.7.4 M2: rescue the crumb (flag cfg.rescue.on; default off = v0.7.3's automatic 40%) -----
  dropPiece(x, y, bonus) {
    let R = this.cfg.rescue, near = this.pieces.find((q2) => Math.hypot(q2.x - x, q2.y - y) <= R.mergeRadius);
    if (near) {
      let w = near.bonus + bonus;
      return near.x = (near.x * near.bonus + x * bonus) / w, near.y = (near.y * near.bonus + y * bonus) / w, near.bonus = Math.round(w * 1e3) / 1e3, near.left = R.window, near.total = R.window, near.n++, this.emit({ type: "pieceDrop", id: near.id, x: near.x, y: near.y, bonus: near.bonus, merged: !0 }), near;
    }
    let q = { id: this.pieceId++, x, y, bonus, left: R.window, total: R.window, n: 1, born: this.time };
    return this.pieces.push(q), this.emit({ type: "pieceDrop", id: q.id, x, y, bonus, merged: !1 }), q;
  }
  pieceAt(x, y, radius = this.cfg.rescue.radius) {
    let best = null, bd = radius;
    for (let q of this.pieces) {
      let d = Math.hypot(q.x - x, q.y - y);
      d <= bd && (bd = d, best = q);
    }
    return best;
  }
  // tap / sweep: adds the piece's bonus to the cookie (never above foodHP) and removes it. Returns false when there is no such piece (double-collect), or paused / over.
  collectPiece(id, auto = !1) {
    if (this.result && !auto || this.paused && !auto) return !1;
    let i = this.pieces.findIndex((q2) => q2.id === id);
    if (i < 0) return !1;
    let q = this.pieces[i];
    this.pieces.splice(i, 1);
    let gain = Math.min(q.bonus, Math.max(0, this.cfg.foodHP - this.foodStored));
    return this.foodStored += gain, this.stats.returned += gain, this.stats.lostOnWay -= gain, this.stats.rescued = (this.stats.rescued || 0) + gain, this.emit({ type: "pieceCollect", id: q.id, x: q.x, y: q.y, n: q.bonus, gain, auto }), !0;
  }
  threat(a) {
    return a.state === "go" ? a.d : this.route(a).length * 2 - a.d;
  }
  // ----- cards -----
  tileInfo(c, r) {
    if (c < 0 || r < 0 || c >= GRID_COLS || r >= GRID_ROWS) return { valid: !1 };
    let onPath = this.isPathTile(c, r);
    if (this.blocked.has(c + "," + r)) return { valid: !1 };
    let tower = this.towers.find((t) => t.c === c && t.r === r) || null;
    return { valid: !0, onPath, tower };
  }
  touchesTrail(c, r) {
    for (let dc = -1; dc <= 1; dc++) for (let dr = -1; dr <= 1; dr++) if ((dc || dr) && this.isPathTile(c + dc, r + dr)) return !0;
    return !1;
  }
  canPlay(pickIndex, c, r) {
    let card = this.picks[pickIndex];
    if (!card || this.result) return { ok: !1, why: "none" };
    if (this.paused) return { ok: !1, why: "paused" };
    if (this.crumbs < this.nextCardCost) return { ok: !1, why: "crumbs" };
    let ti = this.tileInfo(c, r);
    if (!ti.valid) return { ok: !1, why: "tile" };
    if (ti.tower)
      return ti.tower.type === card && ti.tower.lvl < this.cfg.maxInBattleLevel ? { ok: !0, upgrade: !0, tower: ti.tower } : { ok: !1, why: ti.tower.type === card ? "max" : "occupied" };
    let T = TOWERS[card];
    return T.place === "path" && !ti.onPath ? { ok: !1, why: "needPath" } : T.place === "side" && ti.onPath ? { ok: !1, why: "needSide" } : T.nearTrail && !this.touchesTrail(c, r) ? { ok: !1, why: "needNearTrail" } : { ok: !0, upgrade: !1 };
  }
  // v0.8.1 M8: how far the in-battle upgrades reach this battle (towers on the board now by level, highest level per tower type, crumbs spent placing vs upgrading)
  upgradeReach() {
    let byType = {}, l1 = 0, l2 = 0, l3 = 0;
    for (let t of this.towers)
      byType[t.type] = Math.max(byType[t.type] || 0, t.lvl), t.lvl <= 1 ? l1++ : t.lvl === 2 ? l2++ : l3++;
    return { towers: this.towers.length, l1, l2, l3p: l3, byType, placed: this.stats.placed || 0, upgrades: this.stats.upgrades || 0, crumbsPlace: this.stats.crumbsPlace || 0, crumbsUpgrade: this.stats.crumbsUpgrade || 0 };
  }
  playCard(pickIndex, c, r) {
    let chk = this.canPlay(pickIndex, c, r);
    if (!chk.ok) return chk;
    let card = this.picks[pickIndex], cost = this.nextCardCost;
    this.crumbs -= cost, this.cardsPlayed++;
    let tower, diff = null;
    return chk.upgrade ? (tower = chk.tower, diff = upgradeDiff(tower.type, tower.lvl, tower.cardLevel), tower.lvl++, TOWERS[tower.type].directional && this.computeRun(tower), this.stats.upgrades = (this.stats.upgrades || 0) + 1, this.stats.crumbsUpgrade = (this.stats.crumbsUpgrade || 0) + cost, this.emit({ type: "upgrade", x: tower.x, y: tower.y, lvl: tower.lvl, card, pick: pickIndex, cost, id: tower.id, diff })) : (tower = this.addTower(card, c, r), this.stats.placed = (this.stats.placed || 0) + 1, this.stats.crumbsPlace = (this.stats.crumbsPlace || 0) + cost, this.emit({ type: "place", x: tower.x, y: tower.y, card, pick: pickIndex, cost, id: tower.id })), this.picks[pickIndex] = this.drawReplacement(pickIndex), { ok: !0, upgrade: chk.upgrade, tower, cost, diff };
  }
  // v0.5 item 17: 3, 6, 9, 12 ... crumbs (rerollCost + rerolls * rerollStep), reset at the start of every battle.
  // v0.7 D-R3: the first `freeRedraws` redraws of a battle are free, then 3, 6, 9 ...
  get rerollPrice() {
    let f = this.cfg.freeRedraws || 0;
    return this.rerolls < f ? 0 : this.cfg.rerollCost + (this.rerolls - f) * (this.cfg.rerollStep || 0);
  }
  reroll() {
    let price = this.rerollPrice;
    return this.crumbs < price || this.result || this.paused ? !1 : (this.crumbs -= price, this.rerolls++, this.dealHand(), !0);
  }
  // ----- v0.5 items 11/12: move a placed tower (1 diamond, charged by the game) / swap two placed towers (free) -----
  // placement rule of a tower type on a cell, ignoring which towers stand where
  placeRuleOk(type, c, r) {
    if (c < 0 || r < 0 || c >= GRID_COLS || r >= GRID_ROWS || this.blocked.has(c + "," + r)) return !1;
    let T = TOWERS[type], onPath = this.isPathTile(c, r);
    return !(T.place === "path" && !onPath || T.place === "side" && onPath || T.nearTrail && !this.touchesTrail(c, r));
  }
  canMoveTower(tw, c, r) {
    return !tw || this.result || this.paused || !this.towers.includes(tw) || tw.c === c && tw.r === r || this.towers.some((o) => o.c === c && o.r === r) ? !1 : this.placeRuleOk(tw.type, c, r);
  }
  // v0.7.4 M1: set / cycle a single-target tower's target mode (instant, free; per tower; not saved)
  get modeList() {
    return this._modeList || (this._modeList = modesForLevel(this.levelIndex));
  }
  setTargetMode(tw, mode) {
    return !hasTargetModes(tw.type) || !(this.modeList.includes(mode) || mode === "front" && FRONT_FOR_TESTS) ? !1 : (tw.mode = mode, this.emit({ type: "mode", id: tw.id, x: tw.x, y: tw.y, mode }), !0);
  }
  cycleTargetMode(tw) {
    return hasTargetModes(tw.type) && this.setTargetMode(tw, nextTargetMode(tw.mode, this.modeList)) ? tw.mode : null;
  }
  moveTower(tw, c, r) {
    if (!this.canMoveTower(tw, c, r)) return !1;
    let from = { x: tw.x, y: tw.y };
    return this.relocate(tw, c, r), this.emit({ type: "move", id: tw.id, fx: from.x, fy: from.y, x: tw.x, y: tw.y }), !0;
  }
  canSwapTowers(a, b) {
    return !a || !b || a === b || this.result || this.paused ? !1 : this.placeRuleOk(a.type, b.c, b.r) && this.placeRuleOk(b.type, a.c, a.r);
  }
  swapTowers(a, b) {
    if (!this.canSwapTowers(a, b)) return !1;
    let ac2 = a.c, ar = a.r;
    return this.relocate(a, b.c, b.r), this.relocate(b, ac2, ar), this.emit({ type: "swap", a: a.id, b: b.id, ax: a.x, ay: a.y, bx: b.x, by: b.y }), !0;
  }
  relocate(tw, c, r) {
    tw.c = c, tw.r = r, tw.x = (c + 0.5) * TILE, tw.y = (r + 0.5) * TILE, this.setupTower(tw);
  }
  addTower(type, c, r) {
    let T = TOWERS[type], x = (c + 0.5) * TILE, y = (r + 0.5) * TILE, cl = this.cardLevels[type] || 1, tower = {
      id: NEXT_ID++,
      type,
      c,
      r,
      x,
      y,
      lvl: 1,
      cardLevel: cl,
      cd: 0.3,
      chew: 0,
      anim: 0,
      aim: -Math.PI / 2,
      fireFx: 0,
      target: null,
      tick: 0,
      heat: 0,
      heatTarget: null,
      mode: "weak",
      dir: 0,
      stuckSet: /* @__PURE__ */ new Set(),
      charmSet: /* @__PURE__ */ new Set(),
      roastSet: /* @__PURE__ */ new Set(),
      balls: 0,
      stat(key) {
        return towerStat(this.type, key, this.lvl, this.cardLevel);
      }
    };
    return this.setupTower(tower), this.towers.push(tower), tower;
  }
  // everything that depends on WHERE a tower stands (also after Move / Swap)
  setupTower(tower) {
    let T = TOWERS[tower.type];
    if (T.place === "path") {
      let nd = this.nearestOnTrail(tower.x, tower.y), p = this.routes[nd.ri].at(nd.d);
      tower.pathD = nd.d, tower.px = p.x, tower.py = p.y, tower.dirx = p.dx, tower.diry = p.dy, tower.routeD = this.routes.map((rt) => {
        let n = rt.nearestD(p.x, p.y);
        return n.dist < 24 ? n.d : null;
      });
    }
    T.directional && (this.aimTower(tower), this.computeRun(tower));
  }
  // v0.5 items 2 + 10a (FEEDBACK-v0.3.0 item 4, final): a directional tower acts on the trail cell right next to it
  // (up / down / left / right), in the direction AWAY from the tower: tower -> that cell -> onward in a straight line while the
  // trail keeps going straight. It stops at a wall / turn. Two or more such cells: the LONGER straight run wins; tie -> the
  // one higher on the screen; still tied -> the left one. No trail cell next to it -> no direction (the marble does not roll,
  // the fan does not blow). v0.5 item 10b: the Fan uses exactly this direction.
  trailDirection(c, r) {
    let best = null;
    for (let [dx, dy] of DIRS2) {
      let nc = c + dx, nr = r + dy;
      if (!this.isPathTile(nc, nr)) continue;
      let run = 1, cc = nc, cr = nr;
      for (; run < 40 && this.trailEdges.has(cc + "," + cr + ">" + (cc + dx) + "," + (cr + dy)); )
        cc += dx, cr += dy, run++;
      let cand = { dx, dy, run, nc, nr, ec: cc, er: cr };
      (!best || run > best.run || run === best.run && (nr < best.nr || nr === best.nr && nc < best.nc)) && (best = cand);
    }
    return best;
  }
  aimTower(tw) {
    let d = this.trailDirection(tw.c, tw.r);
    tw.trailDir = d, tw.hasLaunch = !!d, d ? (tw.ax = d.dx, tw.ay = d.dy, tw.dir = dirFromVec(d.dx, d.dy)) : (tw.ax = 0, tw.ay = 0, tw.dir = 1), tw.lx = tw.x + tw.ax * TILE / 2, tw.ly = tw.y + tw.ay * TILE / 2, tw.lc = d ? d.nc : tw.c, tw.lr = d ? d.nr : tw.r;
  }
  onTrailPx(px, py) {
    return this.isPathTile(Math.floor(px / TILE), Math.floor(py / TILE));
  }
  computeRun(tw) {
    if (tw.type !== "ball") return;
    let r = this.rollFor(tw);
    tw.runLen = r.len, tw.runStuck = !1, tw.runTiles = r.tiles;
  }
  // roll of a marble at its spot: from the tower edge to the far wall of the last straight trail cell (minus the marble radius)
  rollFor(tw, lvl = tw.lvl) {
    let d = tw.trailDir;
    if (!d) return { len: 0, tiles: 0, stuck: !0 };
    let rad = towerStat(tw.type, "ballRadius", lvl, tw.cardLevel);
    return { len: Math.max(0, d.run * TILE - Math.min(rad, TILE / 2)), tiles: d.run, stuck: !1 };
  }
  // wind effect of a fan blowing along (wx, wy) on ants near (x, y): >0 = pushes ants back (good), <0 = speeds them up (bad)
  windScore(x, y, wx, wy, range) {
    let s = 0;
    for (let rt of this.routes) for (let d = 0; d <= rt.length; d += 10) {
      let p = rt.at(d);
      Math.hypot(p.x - x, p.y - y) <= range && (s -= wx * p.dx + wy * p.dy);
    }
    return s;
  }
  // ----- bonuses -----
  canUseBonus(type) {
    return !this.result && !this.paused && this.bonusTypes.includes(type) && this.bonusUsesLeft > 0 && (this.bonusStock[type] || 0) > 0;
  }
  useBonus(type, x, y) {
    if (!this.canUseBonus(type)) return !1;
    let B = BONUSES[type];
    if (this.bonusUsesLeft--, this.bonusStock[type]--, this.onBonusUsed && this.onBonusUsed(type), type === "bomb") {
      for (let a of this.ants) !a.dead && !a.flying && Math.hypot(a.x - x, a.y - y) <= B.radius && this.damage(a, B.damage, { ignoreArmor: !0, src: { type: "bomb" } });
      this.emit({ type: "bomb", x, y, r: B.radius });
    } else if (type === "plane")
      this.planes = this.routes.map((rt, ri) => ({ ri, d: rt.length + 60, x: 0, y: 0, dx: 0 })), this.planeHit = /* @__PURE__ */ new Set(), this.emit({ type: "plane" });
    else if (type === "freeze")
      this.freezeUntil = this.time + B.time, this.emit({ type: "freeze" });
    else if (type === "decoy") {
      let nd = this.nearestOnTrail(x, y), p = this.routes[nd.ri].at(nd.d);
      this.decoy = { x: p.x, y: p.y, until: this.time + B.time, ds: this.routes.map((rt) => {
        let n = rt.nearestD(p.x, p.y);
        return n.dist < 50 ? n.d : null;
      }) }, this.emit({ type: "decoy", x: p.x, y: p.y });
    }
    return !0;
  }
  get plane() {
    return this.planes && this.planes[0];
  }
  // compatibility for older callers
  // ----- main update -----
  update(dt) {
    if (this.result || this.paused) return;
    this.time += dt;
    let t = this.time;
    if (this.nextWave < this.waves.length && t >= this.nextWaveAt && this.startWave(), this.pending.length) {
      let due = this.pending.filter((p) => p.t <= t);
      if (due.length) {
        this.pending = this.pending.filter((p) => p.t > t);
        for (let p of due) this.spawn(p.type);
      }
    }
    let frozen = t < this.freezeUntil;
    for (let a of this.ants) a.slow = 0;
    for (let h of this.ants) {
      let H2 = ANTS[h.type].heal;
      if (!H2 || h.dead || (h.healFx = Math.max(0, h.healFx - dt), frozen) || h.healCd > 0 && (h.healCd = Math.max(0, h.healCd - dt), h.healCd > 0))
        continue;
      let r22 = (H2.radius * TILE) ** 2, hit2 = [];
      for (let o of this.ants) {
        if (o === h || o.dead || o.hp >= o.maxHp - 1e-6 || ANTS[o.type].heal) continue;
        let dx = o.x - h.x, dy = o.y - h.y;
        dx * dx + dy * dy <= r22 && hit2.push(o);
      }
      if (!hit2.length) continue;
      let sum = 0;
      for (let o of hit2) {
        let g = Math.min(o.maxHp - o.hp, o.maxHp * H2.pct * (ANTS[o.type].boss ? H2.bossMul ?? 1 : 1));
        o.hp += g, sum += g;
      }
      h.healCd = H2.every, h.healFx = 0.5, this.stats.heals = (this.stats.heals || 0) + 1, this.stats.healed = (this.stats.healed || 0) + sum, this.emit({ type: "heal", id: h.id, x: h.x, y: h.y, r: H2.radius * TILE, n: hit2.length, ids: hit2.map((o) => o.id) });
    }
    for (let tw of this.towers) {
      let T = TOWERS[tw.type];
      if (tw.anim += dt, T.place !== "path") continue;
      tw.type === "gate" && (tw.tick -= dt);
      let zapped = !1;
      for (let a of this.ants) {
        if (a.dead || a.flying || !onTile(a, tw.c, tw.r)) continue;
        let boss = ANTS[a.type].boss;
        if (tw.type === "glue")
          a.slow = Math.max(a.slow, tw.stat("power")), tw.stuckSet.has(a.id) || (tw.stuckSet.add(a.id), a.stunT = Math.max(a.stunT, tw.stat("stickTime") * (boss ? 0.3 : a.size >= ANT_SIZES.large ? 0.6 : 1)), this.emit({ type: "stick", x: a.x, y: a.y }));
        else if (tw.type === "pheromone") {
          a.slow = Math.max(a.slow, tw.stat("slow")), this.damage(a, tw.stat("power") * dt, { ignoreArmor: !0, src: tw });
          let rd = tw.routeD[a.ri];
          !boss && rd != null && !tw.charmSet.has(a.id) && a.state === "go" && (tw.charmSet.add(a.id), a.charmT = tw.stat("charmTime"), a.charmD = rd, this.emit({ type: "charm", x: a.x, y: a.y, tx: tw.x, ty: tw.y }));
        } else tw.type === "lava" ? (a.slow = Math.max(a.slow, tw.stat("slow")), this.damage(a, tw.stat("power") * dt, { ignoreArmor: !0, src: tw }), tw.roastSet.has(a.id) || (tw.roastSet.add(a.id), this.emit({ type: "roast", x: a.x, y: a.y }))) : tw.type === "gate" && tw.tick <= 0 && (this.damage(a, tw.stat("power"), { ignoreArmor: !0, src: tw }), zapped = !0);
      }
      tw.type === "gate" && tw.tick <= 0 && (tw.tick = 1 / tw.stat("rate"), zapped && (tw.fireFx = 0.2, this.emit({ type: "gateZap", x: tw.px, y: tw.py })));
    }
    for (let a of this.ants) {
      if (a.dead) continue;
      let rt = this.route(a), L = rt.length;
      if (a.hitFlash = Math.max(0, a.hitFlash - dt), a.shieldMax > 0) {
        a.shieldT += dt;
        let SH = ANTS[a.type].shield;
        if (a.shieldT >= SH.regenDelay && a.shield < a.shieldMax) {
          let was = a.shield;
          a.shield = Math.min(a.shieldMax, a.shield + a.shieldMax * SH.regenRate * dt), a.shield >= a.shieldMax && this.emit({ type: "shieldFull", x: a.x, y: a.y, id: a.id }), was <= 0 && this.emit({ type: "shieldBack", x: a.x, y: a.y, id: a.id });
        }
      }
      a.plantSlowT > 0 && (a.plantSlowT -= dt, a.slow = Math.max(a.slow, a.plantSlow));
      let A = ANTS[a.type], slow = a.slow * (1 - (A.slowResist || 0)), v = a.speed * (1 - slow);
      if (frozen && (v = 0), a.stunT > 0 && (a.stunT -= dt, v = 0), a.waitT > 0 && (a.waitT -= dt, v = 0), a.state === "back" && (v *= this.cfg.carrierSpeedMul), A.spawn && !frozen && (a.spawnT -= dt, a.spawnT <= 0)) {
        a.spawnT = A.spawn.every;
        for (let k = 0; k < A.spawn.count; k++) this.spawn(A.spawn.type, Math.max(0, a.d - 6 - k * 10), a.ri);
        this.emit({ type: "queenCall", x: a.x, y: a.y, calls: A.spawn.type });
      }
      let dd = this.decoy && t < this.decoy.until ? this.decoy.ds[a.ri] : null;
      if (dd != null) {
        let diff = dd - a.d;
        Math.abs(diff) > 3 && (a.d += Math.sign(diff) * Math.min(Math.abs(diff), v * 1.3 * dt), a.dir = Math.sign(diff));
      } else if (a.charmT > 0) {
        a.charmT -= dt;
        let diff = a.charmD - a.d;
        Math.abs(diff) > 2 && (a.d += Math.sign(diff) * Math.min(Math.abs(diff), v * dt), a.dir = Math.sign(diff));
      } else if (a.state === "go")
        a.d += v * dt, a.dir = 1, a.d >= L && this.reachFood(a);
      else if (a.d -= v * dt, a.dir = -1, a.d <= 0) {
        this.foodDelivered += a.carrying, this.emit({ type: "delivered", n: a.carrying, first: a.trips === 0 }), a.carrying = 0, a.trips++;
        let F = this.cfg.forage;
        F && F.on && !(A.boss && F.queenLoop === !1) ? (a.state = "go", a.d = 0, a.dir = 1, a.waitT = F.pause || 0, this.stats.loops = (this.stats.loops || 0) + 1) : (a.dead = !0, a.escaped = !0);
      }
      let p = rt.at(a.d);
      a.x = p.x, a.y = p.y;
    }
    this.decoy && t >= this.decoy.until && (this.decoy = null);
    let SW = this.cfg.swatter;
    if (SW && SW.on) {
      let ck = this.path.pts[this.path.pts.length - 1];
      if (this.swatCd = (this.swatCd == null ? SW.first ?? SW.interval : this.swatCd) - dt, this.swatFx = Math.max(0, (this.swatFx || 0) - dt), this.swatCd <= 0) {
        let cand = this.ants.filter((a) => !a.dead && (SW.air !== !1 || !a.flying) && Math.hypot(a.x - ck.x, a.y - ck.y) <= SW.range);
        if (cand.length) {
          let car = cand.filter((a) => a.carrying > 0), tg = (car.length ? car : cand).reduce((b, a) => Math.hypot(a.x - ck.x, a.y - ck.y) < Math.hypot(b.x - ck.x, b.y - ck.y) ? a : b);
          this.damage(tg, SW.damage, { src: { type: "swatter" } }), this.stats.swats = (this.stats.swats || 0) + 1, this.swatFx = 0.5, this.swatTarget = { x: tg.x, y: tg.y }, this.emit({ type: "swat", x: tg.x, y: tg.y }), this.swatCd = SW.interval;
        } else this.swatCd = 0;
      }
    }
    for (let tw of this.towers) {
      let T = TOWERS[tw.type];
      if (T.place === "path") continue;
      if (tw.fireFx = Math.max(0, tw.fireFx - dt), tw.chew > 0) {
        tw.chew -= dt;
        continue;
      }
      if (tw.cd -= dt, tw.cd > 0) continue;
      let range = tw.stat("range");
      if (tw.type === "ball") {
        this.fireMarble(tw, T);
        continue;
      }
      if (tw.type === "tractor") {
        this.fireTractor(tw);
        continue;
      }
      let inRange = this.ants.filter((a) => !a.dead && canHit(T.targets, a.flying) && Math.hypot(a.x - tw.x, a.y - tw.y) <= range);
      if (!inRange.length) continue;
      if (tw.type === "sound") {
        let st = tw.stat("stagger"), spC = this.spec(tw), cm = 1;
        spC && (tw.pulses = (tw.pulses || 0) + 1, tw.pulses % spC.every === 0 && (cm = spC.mul, this.emit({ type: "special", sp: "crescendo", x: tw.x, y: tw.y })));
        for (let a of inRange)
          this.damage(a, tw.stat("power") * cm, { ignoreArmor: !0, src: tw }), a.dead || (a.stunT = Math.max(a.stunT, st * (ANTS[a.type].boss ? 0.3 : 1)));
        tw.cd = 1 / tw.stat("rate"), tw.fireFx = 0.4, this.emit({ type: "pulse", x: tw.x, y: tw.y, r: range });
        continue;
      }
      if (tw.type === "fan") {
        if (!tw.trailDir) {
          tw.cd = 0.5;
          continue;
        }
        let push = tw.stat("power"), wx = tw.ax, wy = tw.ay;
        for (let a of inRange) {
          let w = a.weight;
          if (!w) continue;
          let rt = this.route(a), p = rt.at(a.d), dot = wx * p.dx + wy * p.dy;
          a.d = Math.max(0, Math.min(rt.length - 0.5, a.d + push * w * dot));
          let q = rt.at(a.d);
          a.x = q.x, a.y = q.y;
        }
        tw.cd = 1 / tw.stat("rate"), tw.fireFx = 0.6, tw.aim = Math.atan2(wy, wx), this.emit({ type: "gust", x: tw.x, y: tw.y, ang: tw.aim });
        continue;
      }
      let target;
      if (LOWEST_HP.has(tw.type) ? target = this.weakestTarget(tw, inRange) : target = inRange.reduce((b, a) => this.threat(a) > this.threat(b) ? a : b), tw.aim = Math.atan2(target.y - tw.y, target.x - tw.x), tw.target = target.id, tw.cd = 1 / tw.stat("rate"), tw.fireFx = 0.18, tw.type === "slingshot") this.projectiles.push({ x: tw.x, y: tw.y - 6, target, dmg: tw.stat("power"), speed: T.projSpeed, src: tw });
      else if (tw.type === "laser") {
        tw.heatTarget === target.id ? tw.heat++ : (tw.heatTarget = target.id, tw.heat = 0);
        let heat = Math.min(tw.stat("heatMax"), tw.heat * T.heatPerHit);
        this.damage(target, tw.stat("power") * (1 + heat), { src: tw });
        let spL = this.spec(tw);
        spL && !target.dead && !ANTS[target.type].boss && (target.burnHits = (target.burnHits || 0) + 1, target.burnHits % spL.every === 0 && (target.shred || 0) < spL.max && (target.shred = (target.shred || 0) + spL.strip, target.armor = Math.max(0, target.armor - spL.strip), this.emit({ type: "special", sp: "burnthrough", x: target.x, y: target.y, id: target.id, armor: target.armor }))), this.emit({ type: "beam", x: tw.x, y: tw.y - 10, tx: target.x, ty: target.y, heat: heat / (tw.stat("heatMax") || 1) });
      } else if (tw.type === "zapper") {
        let hit2 = /* @__PURE__ */ new Set([target.id]), cur = target, dmg = tw.stat("power");
        this.damage(target, dmg, { src: tw }), this.emit({ type: "zap", x: tw.x, y: tw.y - 14, tx: target.x, ty: target.y });
        let spZ = this.spec(tw);
        for (let k = 0; k < tw.stat("chain") + (spZ ? spZ.plus : 0); k++) {
          let nx = null, nd = T.chainRange;
          for (let a of this.ants) {
            if (a.dead || !a.flying || hit2.has(a.id)) continue;
            let q = Math.hypot(a.x - cur.x, a.y - cur.y);
            q <= nd && (nd = q, nx = a);
          }
          if (!nx) break;
          dmg *= T.chainFalloff, hit2.add(nx.id), this.emit({ type: "zap", x: cur.x, y: cur.y, tx: nx.x, ty: nx.y, chain: !0 }), this.damage(nx, dmg, { src: tw }), cur = nx;
        }
      } else if (tw.type === "lizard") {
        let spP = this.spec(tw), pounce = spP && target.hp >= target.maxHp - 1e-6 && !(target.shield > 0);
        pounce && this.emit({ type: "special", sp: "pounce", x: target.x, y: target.y }), this.damage(target, tw.stat("power") * (pounce ? spP.mul : 1), { src: tw }), this.emit({ type: "tongue", x: tw.x, y: tw.y, tx: target.x, ty: target.y }), tw.fireFx = 0.25;
      } else tw.type === "spray" && (this.clouds.push({ x: target.x, y: target.y, r: tw.stat("cloudRadius"), dps: tw.stat("power"), left: T.cloudTime, total: T.cloudTime, src: tw }), this.emit({ type: "spray", x: tw.x, y: tw.y, tx: target.x, ty: target.y }));
    }
    for (let p of this.projectiles) {
      let tg = p.target, dx = tg.x - p.x, dy = tg.y - p.y, dist = Math.hypot(dx, dy), step = p.speed * dt;
      if (dist <= step || tg.dead) {
        if (!tg.dead) {
          this.damage(tg, p.dmg, { src: p.src });
          let spR = p.src && p.src.type === "slingshot" ? this.spec(p.src) : null;
          if (spR) {
            let nx = null, nd = spR.radius;
            for (let o of this.ants) {
              if (o.dead || o === tg || o.flying) continue;
              let q = Math.hypot(o.x - tg.x, o.y - tg.y);
              q <= nd && (nd = q, nx = o);
            }
            nx && (this.damage(nx, p.dmg * spR.mul, { src: p.src }), this.emit({ type: "special", sp: "ricochet", x: tg.x, y: tg.y, tx: nx.x, ty: nx.y }));
          }
        }
        p.done = !0, this.emit({ type: "hit", x: tg.x, y: tg.y, src: p.src && p.src.type });
      } else
        p.x += dx / dist * step, p.y += dy / dist * step;
    }
    this.projectiles = this.projectiles.filter((p) => !p.done);
    for (let c of this.clouds) {
      c.left -= dt;
      for (let a of this.ants) !a.dead && !a.flying && Math.hypot(a.x - c.x, a.y - c.y) <= c.r && this.damage(a, c.dps * dt, { gas: !0, ignoreArmor: !0, src: c.src, fx: !0 });
    }
    this.clouds = this.clouds.filter((c) => c.left > 0);
    for (let b of this.balls) {
      if (b.stuck > 0) {
        b.stuck -= dt, b.rot += dt * 18, b.stuck <= 0 && (b.done = !0);
        continue;
      }
      let step = Math.min(b.speed * dt, b.left);
      b.x += b.dx * step, b.y += b.dy * step, b.left -= step, b.rot += step / b.r, b.travel += step;
      for (let a of this.ants)
        a.dead || a.flying || b.hit.has(a.id) || Math.hypot(a.x - b.x, a.y - b.y) <= b.r + 8 * a.size && (b.hit.add(a.id), this.damage(a, b.dmg, { src: b.src }), a.hitFlash = 0.2, this.emit({ type: "squash", x: a.x, y: a.y }));
      b.left <= 0 && (b.done = !0, this.emit({ type: "marbleBreak", x: b.x, y: b.y, travel: b.travel }));
    }
    for (let b of this.balls) b.done && b.src && (b.src.balls = Math.max(0, b.src.balls - 1));
    if (this.balls = this.balls.filter((b) => !b.done), this.planes) {
      let B = BONUSES.plane, alive = 0;
      for (let pl of this.planes) {
        let rt = this.routes[pl.ri];
        if (pl.d -= B.speed * dt, pl.d < -60) continue;
        alive++;
        for (let a of this.ants)
          a.dead || this.planeHit.has(a.id) || a.ri !== pl.ri || Math.abs(a.d - pl.d) < 30 && (this.planeHit.add(a.id), this.damage(a, B.damage, { ignoreArmor: !0, src: { type: "plane" } }), a.plantSlow = B.slow, a.plantSlowT = B.slowTime);
        let p = rt.at(pl.d);
        pl.x = p.x, pl.y = p.y, pl.dx = p.dx;
      }
      alive || (this.planes = null);
    }
    if (this.ants = this.ants.filter((a) => !a.dead), this.pieces.length) {
      let k = dt / (this.rescueScale || 1);
      for (let q of this.pieces) q.left -= k;
      for (let q of this.pieces.filter((q2) => q2.left <= 0)) this.emit({ type: "pieceExpire", id: q.id, x: q.x, y: q.y, bonus: q.bonus });
      this.pieces = this.pieces.filter((q) => q.left > 0);
    }
    if (this.foodStored <= 1e-6 && !this.pieces.length)
      this.foodStored = Math.max(0, this.foodStored), this.result = "lose", this.emit({ type: "lose" });
    else if (this.nextWave >= this.waves.length && this.pending.length === 0 && this.ants.length === 0) {
      for (let q of this.pieces.slice()) this.collectPiece(q.id, !0);
      this.result = "win", this.emit({ type: "win", perfect: this.perfect });
    }
  }
  // v0.6 item 2: single-target towers (Slingshot, Laser, Zapper's first zap, Gecko) aim at the ant with the FEWEST HP left.
  // The Slingshot skips ants its pebbles already in flight will finish (unless nothing else is in range). Tie -> the leader.
  weakestTarget(tw, inRange) {
    let pool = inRange;
    if (tw.type === "slingshot" && this.projectiles.length) {
      let pend = /* @__PURE__ */ new Map();
      for (let p of this.projectiles) p.target.dead || pend.set(p.target.id, (pend.get(p.target.id) || 0) + applyArmor(p.dmg, p.target.armor, !1));
      let alive = inRange.filter((a) => a.hp - (pend.get(a.id) || 0) > 1e-6);
      alive.length && (pool = alive);
    }
    let mode = tw.mode || "weak";
    if (mode === "carrier" || mode === "front") {
      let maxThreat = (list) => list.reduce((b, a) => this.threat(a) > this.threat(b) ? a : b);
      if (mode === "carrier") {
        let cs = pool.filter((a) => a.state !== "go");
        if (cs.length) return maxThreat(cs);
      } else {
        let ws = pool.filter((a) => a.state === "go");
        return maxThreat(ws.length ? ws : pool);
      }
    }
    if (mode === "healer") {
      let hs = pool.filter((a) => isHealerType(a.type));
      if (hs.length) return hs.reduce((b, a) => this.threat(a) > this.threat(b) ? a : b);
    }
    return mode === "strong" ? pool.reduce((b, a) => a.hp > b.hp + 1e-9 || Math.abs(a.hp - b.hp) <= 1e-9 && this.threat(a) > this.threat(b) ? a : b) : pool.reduce((b, a) => a.hp < b.hp - 1e-9 || Math.abs(a.hp - b.hp) <= 1e-9 && this.threat(a) > this.threat(b) ? a : b);
  }
  // v0.6 item 6: the Tractor lowers its bucket onto the trail tile next to it (trailDirection, like the marble / fan) and lifts
  // EVERY liftable ant on that tile off the trail (instant kill; carried food returns as for any kill). It only acts when at
  // least one liftable ant is on the tile. No trail next to it -> it does nothing.
  fireTractor(tw) {
    let d = tw.trailDir;
    if (!d) {
      tw.cd = 0.5;
      return;
    }
    let lift = tw.stat("liftSize"), on = this.ants.filter((a) => !a.dead && onTile(a, d.nc, d.nr) && liftable(a, lift));
    if (!on.length) {
      tw.cd = 0.05;
      return;
    }
    tw.cd = 1 / tw.stat("rate"), tw.fireFx = 0.9, tw.lifts = (tw.lifts || 0) + 1, this.emit({
      type: "scoop",
      tower: tw.id,
      x: tw.x,
      y: tw.y,
      tx: (d.nc + 0.5) * TILE,
      ty: (d.nr + 0.5) * TILE,
      dx: d.dx,
      dy: d.dy,
      ants: on.map((a) => ({ type: a.type, x: a.x, y: a.y, size: a.size, dir: a.dir }))
    });
    for (let a of on) this.kill(a, tw);
  }
  fireMarble(tw, T) {
    if (tw.balls >= T.maxBalls || !tw.trailDir || tw.runLen <= 0) return;
    let dx = tw.ax, dy = tw.ay, ex = tw.lx + dx * tw.runLen, ey = tw.ly + dy * tw.runLen;
    this.ants.some((a) => !a.dead && !a.flying && segDist(a.x, a.y, tw.lx, tw.ly, ex, ey) <= 24) && (this.balls.push({
      x: tw.lx,
      y: tw.ly,
      dx,
      dy,
      left: tw.runLen,
      stuck: 0,
      travel: 0,
      r: tw.stat("ballRadius"),
      dmg: tw.stat("power"),
      speed: T.rollSpeed,
      hit: /* @__PURE__ */ new Set(),
      src: tw,
      rot: 0
    }), tw.balls++, tw.cd = 1 / tw.stat("rate"), tw.fireFx = 0.3, this.emit({ type: "roll", x: tw.x, y: tw.y }));
  }
  reachFood(a) {
    let steal = Math.min(ANTS[a.type].steal, this.foodStored);
    this.foodStored -= steal, this.stats.stolen += steal;
    {
      let lb = this.stats.leakBy || (this.stats.leakBy = {});
      lb[a.type] = (lb[a.type] || 0) + steal;
    }
    if (a.flying && (this.stats.flyLeak = (this.stats.flyLeak || 0) + steal, a.type === "drone" && (this.stats.droneLeak = (this.stats.droneLeak || 0) + steal)), this.emit({ type: "steal", x: a.x, y: a.y, n: steal, ant: a.type }), this.cfg.carryBack && steal > 0) {
      a.state = "back", a.carrying = steal, a.d = this.route(a).length - 0.01;
      let F = this.cfg.forage, cp = F && F.on ? ANTS[a.type].boss && F.cookiePauseBoss != null ? F.cookiePauseBoss : F.cookiePause || 0 : 0;
      cp > 0 && (a.waitT = Math.max(a.waitT, cp), this.stats.pickups = (this.stats.pickups || 0) + 1, this.emit({ type: "pickup", x: a.x, y: a.y, n: steal, ant: a.type, t: cp }));
    } else
      this.cfg.carryBack || (this.foodDelivered += steal), a.dead = !0, a.escaped = !0;
  }
  get stars() {
    return this.result === "win" ? starsFor(this.foodStored, this.cfg.foodHP) : 0;
  }
};
function segDist(px, py, ax, ay, bx, by) {
  let vx = bx - ax, vy = by - ay, l2 = vx * vx + vy * vy || 1, t = Math.max(0, Math.min(1, ((px - ax) * vx + (py - ay) * vy) / l2));
  return Math.hypot(px - (ax + vx * t), py - (ay + vy * t));
}
var LOSS_HINTS = { carrier: "Try Carrier mode on a tower", healer: "Switch a tower to Healer mode - the nurses keep the rest alive", flyer: "Bring a Laser or Zapper for flyers", drone: "Syrup Queen sends Drones. Bring a Zapper or a Laser." };
function lossHint(b, lossRun = 0) {
  if (!b || b.result !== "lose" || lossRun < 2) return null;
  let st = b.stats, stolen = st.stolen || 0, L = b.levelIndex + 1, ok = HINT_OK;
  return ok.carrier.includes(L) && stolen > 0 && (st.lostOnWay || 0) >= 0.5 * stolen && b.towers.some((t) => hasTargetModes(t.type) && t.mode !== "carrier") ? LOSS_HINTS.carrier : ok.healer.includes(L) && b.ants.some((a) => !a.dead && isHealerType(a.type)) ? LOSS_HINTS.healer : ok.drone.includes(L) && (st.droneLeak || 0) > 0 && b.deck.filter((id) => id === "laser" || id === "zapper" || id === "fan").length < 2 ? LOSS_HINTS.drone : (st.flyLeak || 0) > 0 && !b.deck.some((id) => id === "laser" || id === "zapper") ? LOSS_HINTS.flyer : null;
}

// src/meta.js
var SAVE_KEY = "crumbdefense.save.v1";
function newSave() {
  let cards = {};
  for (let id of ALL_CARDS) cards[id] = newCard();
  for (let id of STARTER_CARDS) unlockCard({ cards }, id);
  let bonusStock = {};
  for (let b of BONUS_TYPES) bonusStock[b] = ECONOMY.startBonusStock;
  return {
    version: SAVE_VERSION,
    coins: ECONOMY.startCoins,
    diamonds: ECONOMY.diamonds.start,
    cards,
    bonusStock,
    levels: LEVELS.map(() => ({ stars: 0, cleared: !1 })),
    lastDeck: STARTER_CARDS.slice(),
    lastBonuses: BONUS_TYPES.slice(0, 2),
    calendar: newCalendarState(),
    cardBlink: newCardBlinkState(),
    onboard: newOnboardState(),
    packsSinceNew: 0,
    settings: defaultSettings(),
    debug: { reach: [] },
    seenAnts: []
  };
}
function defaultSettings() {
  return { reduceMotion: "auto", haptics: !0 };
}
var SAVE_VERSION = 6;
function newOnboardState() {
  return { zapperGift: "none", grantedOnLoad: !1, firstBattle: "pending" };
}
var ZAPPER_STAGE = 1;
function newCardBlinkState() {
  return { affordShown: !1, afterLossShown: !1, lossPending: !1 };
}
function newCalendarState() {
  return { lastClaimDay: null, lastClaimTs: null, lastSeenTs: null, broken: !1, streak: 0, coinStep: 0, pos: null, cycleStartDay: null, lastVisitDay: null, weekClaimed: [!1, !1, !1, !1, !1, !1, !1], weekGot: [], log: [] };
}
var MERGE_RULE = { sameToNext: MERGE.cardsPerMerge };
function newCard() {
  return { unlocked: !1, level: 0, inv: {}, seen: [], fresh: !1 };
}
function normCard(c) {
  return (!c.inv || typeof c.inv != "object") && (c.inv = {}), Array.isArray(c.seen) || (c.seen = []), c;
}
function syncCard(c) {
  normCard(c);
  let top = 0;
  for (let L = 1; L <= MAX_CARD_LEVEL; L++) (c.inv[L] || 0) > 0 && (top = L);
  return c.level = top, c.unlocked = top > 0, c;
}
function countAt(c, L) {
  return c.inv && c.inv[L] || 0;
}
function totalCards(c) {
  let n = 0;
  for (let L = 1; L <= MAX_CARD_LEVEL; L++) n += c.inv && c.inv[L] || 0;
  return n;
}
function addCards(save, id, level = 1, n = 1) {
  let c = normCard(save.cards[id]), newType = !c.unlocked, newLevel = !c.seen.includes(level);
  return c.inv[level] = (c.inv[level] || 0) + n, newLevel && (c.seen.push(level), c.seen.sort((a, b) => a - b)), syncCard(c), { newType, newLevel };
}
function unlockCard(save, id) {
  return normCard(save.cards[id]).unlocked ? !1 : (addCards(save, id, 1, 1), !0);
}
function mergeRow(c, L) {
  let need = MERGE_RULE.sameToNext, to = L + 1;
  if (to > MAX_CARD_LEVEL) return { L, to, need, have: countAt(c, L), coins: 0, maxed: !0, ready: !1 };
  let coins = MERGE.coinCost[to] || 0, have = countAt(c, L);
  return { L, to, need, have, coins, maxed: !1, ready: have >= need };
}
function canMergeAt(save, id, L) {
  let r = mergeRow(normCard(save.cards[id]), L);
  return !r.maxed && r.ready && save.coins >= r.coins;
}
function mergeAt(save, id, L) {
  if (!(L >= 1) || !canMergeAt(save, id, L)) return null;
  let c = save.cards[id], r = mergeRow(c, L);
  c.inv[L] -= r.need, c.inv[L] <= 0 && delete c.inv[L], save.coins -= r.coins;
  let got = addCards(save, id, r.to, 1);
  return { id, from: L, to: r.to, coins: r.coins, ...got };
}
function mergeRows(save, id) {
  let c = normCard(save.cards[id]), rows = [];
  for (let L = 1; L <= c.level; L++) rows.push(mergeRow(c, L));
  return rows;
}
function mergeReady(save, id) {
  let c = normCard(save.cards[id]);
  for (let L = 1; L <= c.level; L++) if (canMergeAt(save, id, L)) return !0;
  return !1;
}
function anyMergeReady(save) {
  return ALL_CARDS.some((id) => mergeReady(save, id));
}
function mergeAll(save) {
  let done = [];
  for (let L = 1; L < MAX_CARD_LEVEL; L++) for (let id of ALL_CARDS) {
    let r;
    for (; r = mergeAt(save, id, L); ) done.push(r);
  }
  return done;
}
function lockedCards(save) {
  return ALL_CARDS.filter((id) => !save.cards[id].unlocked);
}
function unlockPrice(id, E = ECONOMY.shop) {
  return (E.unlockPrice && E.unlockPrice[id]) ?? E.unlockPriceDefault;
}
function buyCardUnlock(save, id) {
  let price = unlockPrice(id);
  return save.cards[id].unlocked || save.coins < price ? !1 : (save.coins -= price, unlockCard(save, id), save.cards[id].fresh = !0, !0);
}
function grantCardPrize(save, level = 1, rng = Math.random) {
  let locked = lockedCards(save), pool = locked.length ? locked : ALL_CARDS, id = pool[Math.floor(rng() * pool.length) % pool.length], got = addCards(save, id, level, 1);
  return save.cards[id].fresh = !0, { kind: "card", id, level, newCard: got.newType, newLevel: got.newLevel, reveal: got.newType || got.newLevel };
}
function grantBooster(save, id, count = 1) {
  let n = Math.min(count, ECONOMY.maxBoostersPerAward);
  return save.bonusStock[id] = (save.bonusStock[id] || 0) + n, { kind: "bonus", id, count: n };
}
function crumbPrice(n, D = ECONOMY.diamonds) {
  return Math.round(D.crumbPriceStart * Math.pow(D.crumbPriceMul, n));
}
function boosterPrice(n, D = ECONOMY.diamonds) {
  return D.boosterPriceStart + D.boosterPriceStep * n;
}
function boosterBuys(battle, type) {
  let D = ECONOMY.diamonds;
  return battle.dia = battle.dia || { crumbs: 0, boosters: 0, per: {} }, D.perBooster ? battle.dia.per[type] || 0 : battle.dia.boosters;
}
function nextCrumbPrice(battle) {
  return battle.dia = battle.dia || { crumbs: 0, boosters: 0, per: {} }, crumbPrice(battle.dia.crumbs);
}
function nextBoosterPrice(battle, type) {
  return boosterPrice(boosterBuys(battle, type));
}
function buyCrumbsWithDiamonds(save, battle) {
  let price = nextCrumbPrice(battle);
  return battle.result ? { ok: !1, why: "over", price } : (save.diamonds || 0) < price ? { ok: !1, why: "diamonds", price } : (save.diamonds -= price, battle.dia.crumbs++, battle.addCrumbs(ECONOMY.diamonds.crumbPack), { ok: !0, price, crumbs: ECONOMY.diamonds.crumbPack });
}
function buyBoosterWithDiamonds(save, battle, type) {
  let price = nextBoosterPrice(battle, type);
  return battle.result ? { ok: !1, why: "over", price } : battle.bonusTypes.includes(type) ? battle.bonusUsesLeft <= 0 ? { ok: !1, why: "uses", price } : (save.diamonds || 0) < price ? { ok: !1, why: "diamonds", price } : (save.diamonds -= price, ECONOMY.diamonds.perBooster ? battle.dia.per[type] = (battle.dia.per[type] || 0) + 1 : battle.dia.boosters++, save.bonusStock[type] = (save.bonusStock[type] || 0) + 1, battle.bonusStock[type] = (battle.bonusStock[type] || 0) + 1, { ok: !0, price }) : { ok: !1, why: "notBrought", price };
}
function moveTowerWithDiamond(save, battle, tw, c, r) {
  let price = ECONOMY.diamonds.moveTower;
  return (save.diamonds || 0) < price ? { ok: !1, why: "diamonds", price } : battle.canMoveTower(tw, c, r) ? (battle.moveTower(tw, c, r), save.diamonds -= price, { ok: !0, price }) : { ok: !1, why: "spot", price };
}
function buyCard(save, id) {
  let price = ECONOMY.shop.cardL1;
  return !save.cards[id].unlocked || save.coins < price ? !1 : (save.coins -= price, addCards(save, id, 1, 1), !0);
}
function cheapestLockedTier(save, E = ECONOMY.shop) {
  let locked = lockedCards(save);
  if (!locked.length) return [];
  let min = Math.min(...locked.map((id) => unlockPrice(id, E)));
  return locked.filter((id) => unlockPrice(id, E) === min);
}
function buyPack(save, rng = Math.random, E = ECONOMY.shop) {
  let price = E.cardPack;
  if (save.coins < price) return null;
  let pool = ALL_CARDS.filter((id) => save.cards[id].unlocked), tier = cheapestLockedTier(save, E);
  save.coins -= price;
  let got = [], newTower = null, since = save.packsSinceNew || 0, pity = E.packPity && since >= E.packPity - 1;
  tier.length && (rng() < (E.packNewTowerChance || 0) || pity) && (newTower = tier[Math.floor(rng() * tier.length) % tier.length]), tier.length && (save.packsSinceNew = newTower ? 0 : since + 1);
  let n = E.cardPackSize - (newTower ? 1 : 0);
  for (let i = 0; i < n; i++) {
    let id = pool[Math.floor(rng() * pool.length) % pool.length];
    addCards(save, id, 1, 1), got.push(id);
  }
  return newTower && (addCards(save, newTower, 1, 1), save.cards[newTower].fresh = !0, got.push(newTower)), got.newTower = newTower, got;
}
function zapperGiftPending(save) {
  return !!(save.onboard && save.onboard.zapperGift === "pending");
}
function isDamageId(id) {
  let T = TOWERS[id];
  return !!T && T.kind === "tower" && id !== "fan" && T.targets !== "air" && !T.nearTrail;
}
function claimZapperGift(save, rng = Math.random) {
  if (!zapperGiftPending(save)) return null;
  let pool = ALL_CARDS.filter((id) => save.cards[id].unlocked && id !== "zapper"), dmg = pool.filter(isDamageId), n = ECONOMY.shop.cardPackSize - 1, ids = [];
  for (let i = 0; i < n; i++) ids.push(pool[Math.floor(rng() * pool.length) % pool.length]);
  if (dmg.length && !ids.some(isDamageId)) {
    let k = Math.floor(rng() * n) % n;
    ids[k] = dmg[Math.floor(rng() * dmg.length) % dmg.length];
  }
  let got = [];
  for (let id of ids)
    addCards(save, id, 1, 1), got.push(id);
  let zapperOwned = !!save.cards.zapper.unlocked, z = addCards(save, "zapper", 1, 1);
  return got.push("zapper"), save.cards.zapper.fresh = !0, save.onboard.zapperGift = "done", { got, zapper: z, zapperOwned };
}
function buyBonus(save, type) {
  let price = ECONOMY.shop.boosterDiamonds;
  return (save.diamonds || 0) < price ? !1 : (save.diamonds -= price, save.bonusStock[type] = (save.bonusStock[type] || 0) + 1, !0);
}
function cheapestCardPrice(save, E = ECONOMY.shop) {
  let prices = [];
  ALL_CARDS.some((id) => save.cards[id].unlocked) && prices.push(E.cardL1);
  for (let id of ALL_CARDS) save.cards[id].unlocked || prices.push(unlockPrice(id, E));
  return prices.length ? Math.min(...prices) : 1 / 0;
}
function canAffordCard(save) {
  return (save.coins || 0) >= cheapestCardPrice(save);
}
function noteLossForCardBlink(save) {
  save.cardBlink = save.cardBlink || newCardBlinkState(), save.cardBlink.afterLossShown || (save.cardBlink.lossPending = !0);
}
function checkCardBlink(save) {
  let b = save.cardBlink = save.cardBlink || newCardBlinkState();
  if (!canAffordCard(save)) return !1;
  let fire = !1;
  return b.affordShown || (b.affordShown = !0, fire = !0), b.lossPending && !b.afterLossShown && (b.afterLossShown = !0, b.lossPending = !1, fire = !0), fire;
}
function consumeBonus(save, type) {
  return (save.bonusStock[type] || 0) <= 0 ? !1 : (save.bonusStock[type]--, !0);
}
function unlockedCards(save) {
  return ALL_CARDS.filter((id) => save.cards[id].unlocked);
}
function worldStars(save, w) {
  let s = 0;
  return LEVELS.forEach((L, i) => {
    L.world === w && (s += save.levels[i] && save.levels[i].stars || 0);
  }), s;
}
function worldCleared(save, w) {
  return LEVELS.every((L, i) => L.world !== w || save.levels[i] && save.levels[i].cleared);
}
function highestWorld(save) {
  let h = 1;
  for (let W2 of WORLDS) worldUnlocked(save, W2.id) && (h = Math.max(h, W2.id));
  return h;
}
function nextAntCard(save, levelIndex) {
  if (!save || !LEVELS[levelIndex] || save.levels[levelIndex] && save.levels[levelIndex].cleared) return null;
  let seen = save.seenAnts || [];
  for (let t of levelAntTypes(levelIndex)) if (ANT_CARD[t] && !seen.includes(t)) return t;
  return null;
}
function markAntSeen(save, key) {
  return Array.isArray(save.seenAnts) || (save.seenAnts = []), save.seenAnts.includes(key) ? !1 : (save.seenAnts.push(key), !0);
}
function lowestStarLevels(save, w) {
  let W2 = WORLDS.find((x) => x.id === w);
  if (!W2 || !W2.unlock) return [];
  let prev = W2.unlock.allLevelsWonInWorld ?? w - 1, out = [];
  return LEVELS.forEach((L, i) => {
    if (L.world !== prev) return;
    let lv = save.levels[i] || { stars: 0, cleared: !1 };
    (lv.stars || 0) < 3 && out.push({ i, n: i + 1, stars: lv.stars || 0, cleared: !!lv.cleared });
  }), out.sort((a, b) => a.stars - b.stars || a.i - b.i), out;
}
function worldUnlocked(save, w) {
  let W2 = WORLDS.find((x) => x.id === w);
  if (!W2 || !W2.unlock) return !0;
  let u = W2.unlock, prev = u.allLevelsWonInWorld ?? w - 1;
  return worldCleared(save, prev) && worldStars(save, prev) >= (u.minStarsInWorld || 0);
}
function levelUnlocked(save, i) {
  if (i === 0) return !0;
  let L = LEVELS[i];
  return L ? WORLD_START[L.world] === i ? worldUnlocked(save, L.world) : !!(save.levels[i - 1] && save.levels[i - 1].cleared) : !1;
}
function cardLevels(save) {
  let o = {};
  for (let id of ALL_CARDS) o[id] = Math.max(1, save.cards[id].level);
  return o;
}
function timeCoins(time, E = ECONOMY) {
  return Math.max(0, Math.floor((time || 0) / E.secondsPerCoin));
}
function battleCoins(result, { kills = 0, foodLeft = 0, levelIndex = 0, firstClear = !1, time = 0, coinMul = 1 } = {}, E = ECONOMY) {
  if (result === "win") {
    let m = (v) => coinMul === 1 ? v : Math.round(v * coinMul), parts = {
      base: m(E.winBase),
      food: m(Math.round(foodLeft * E.coinsPerFood)),
      kills: m(Math.round(kills * E.coinsPerKillWin)),
      level: m(levelIndex * E.coinsPerLevel),
      firstClear: firstClear ? E.firstClearBonus : 0,
      time: m(timeCoins(time, E))
    };
    return { total: Object.values(parts).reduce((s, v) => s + v, 0), parts };
  }
  let k = Math.min(E.lossCap, Math.floor(kills * E.coinsPerKillLoss)), t = Math.min(E.lossCap - k, timeCoins(time, E));
  return { total: k + t, parts: { kills: k, time: t } };
}
function grantPerfectPrize(save, rng = Math.random, table = ECONOMY.perfectPrizes, { noBooster = !1 } = {}) {
  noBooster && (table = table.filter((p) => p.kind !== "bonus"));
  let total = table.reduce((s, p) => s + p.w, 0), r = rng() * total, pick = table[0];
  for (let p of table)
    if (r -= p.w, r <= 0) {
      pick = p;
      break;
    }
  if (pick.kind === "cards") {
    let locked = lockedCards(save), pool = locked.length ? locked : ALL_CARDS.filter((id2) => save.cards[id2].unlocked), id = pool[Math.floor(rng() * pool.length) % pool.length], got = addCards(save, id, 1, 1);
    return save.cards[id].fresh = !0, { kind: "cards", id, level: 1, count: 1, newCard: got.newType, newLevel: got.newLevel, reveal: got.newType || got.newLevel };
  }
  return grantBooster(save, pick.id, pick.count);
}
function grantBossGift(save, levelIndex) {
  let id, level, locked = lockedCards(save);
  if (locked.length) {
    let min = Math.min(...locked.map((x) => unlockPrice(x)));
    id = locked.find((x) => unlockPrice(x) === min), level = 1;
  } else {
    let W2 = WORLDS.find((x) => x.id === worldOf(levelIndex)), cap = W2 && W2.cardLevelCap || MAX_CARD_LEVEL, best = -1;
    for (let x of ALL_CARDS) {
      let n = totalCards(save.cards[x]);
      n > best && (best = n, id = x);
    }
    level = Math.min(MAX_CARD_LEVEL, Math.max(2, cap - (worldOf(levelIndex) >= 3 ? 1 : 2)));
  }
  let got = addCards(save, id, level, 1);
  return save.cards[id].fresh = !0, { kind: "cards", id, level, count: 1, newCard: got.newType, newLevel: got.newLevel, reveal: got.newType || got.newLevel, boss: !0 };
}
function applyBattleResult(save, levelIndex, result, stars, info = {}, rng = Math.random) {
  let E = ECONOMY, out = { coins: 0, parts: {}, unlocked: null, bonusReward: null, booster: null, prize: null, bossGift: null, firstClear: !1, perfect: !1, starCoins: 0, gems: 0 };
  if (result === "win") {
    let lv = save.levels[levelIndex];
    out.firstClear = !lv.cleared;
    let lvW = WORLDS.find((x) => x.id === worldOf(levelIndex)), c = battleCoins("win", { kills: info.kills || 0, foodLeft: info.foodLeft ?? BATTLE.foodHP, levelIndex, firstClear: out.firstClear, time: info.time || 0, coinMul: (lvW && lvW.coinMul) ?? 1 });
    out.coins = c.total, out.parts = c.parts;
    let before = lv.stars || 0, SB = E.starBonus, sm = E.starBonusScale === "coinMul" ? (lvW && lvW.coinMul) ?? 1 : 1, sbv = (k) => Math.round(SB[k] * sm / 5) * 5;
    if (out.starParts = { s2: before < 2 && stars >= 2 ? sbv(2) : 0, s3: before < 3 && stars >= 3 ? sbv(3) : 0 }, out.starCoins = out.starParts.s2 + out.starParts.s3, out.starCoins && (out.coins += out.starCoins, out.parts.stars = out.starCoins), info.day && save.dailyWin !== info.day && (save.dailyWin = info.day, out.dailyBonus = dailyWinBonus((lvW && lvW.coinMul) ?? 1), out.coins += out.dailyBonus, out.parts.daily = out.dailyBonus), out.gems = 0, isBossLevel(levelIndex) && (out.gems = (out.firstClear ? E.bossGems.firstClear : 0) + (before < 3 && stars >= 3 ? E.bossGems.firstThreeStars : 0)), out.gems && (save.diamonds = (save.diamonds || 0) + out.gems), out.firstClear) {
      let fb = (E.firstClearBoosters || {})[levelIndex];
      if (fb && (out.booster = grantBooster(save, fb, 1)), E.bonusRewardOnFirstClear && !out.booster) {
        let b = BONUS_TYPES[Math.floor(rng() * BONUS_TYPES.length)];
        out.booster = grantBooster(save, b, 1), out.bonusReward = b;
      }
    }
    out.firstClear && isBossLevel(levelIndex) && (out.bossGift = grantBossGift(save, levelIndex)), info.perfect && (out.perfect = !0, out.prize = grantPerfectPrize(save, rng, void 0, { noBooster: !!out.booster })), lv.cleared = !0, lv.stars = Math.max(lv.stars, stars), info.time > 0 && (!lv.bestTime || info.time < lv.bestTime) && (lv.bestTime = Math.round(info.time)), info.perfect && (lv.perfect = !0), save.onboard = save.onboard || newOnboardState(), levelIndex === ZAPPER_STAGE && out.firstClear && save.onboard.zapperGift === "none" && (save.onboard.zapperGift = "pending", out.zapperGift = !0);
  } else {
    let c = battleCoins("lose", { kills: info.kills || 0, time: info.time || 0 });
    out.coins = c.total, out.parts = c.parts;
  }
  return save.coins += out.coins, out;
}
function autoFixBonuses(save, bonuses, n = BATTLE.bonusTypesToBring) {
  let keep = bonuses.filter((b) => (save.bonusStock[b] || 0) > 0);
  for (let b of BONUS_TYPES) keep.length < n && !keep.includes(b) && (save.bonusStock[b] || 0) > 0 && keep.push(b);
  for (let b of [...bonuses, ...BONUS_TYPES]) keep.length < n && !keep.includes(b) && keep.push(b);
  return keep.slice(0, n);
}
function loadSave(storage2) {
  try {
    let raw = storage2 && storage2.getItem(SAVE_KEY);
    if (!raw) return newSave();
    let s = JSON.parse(raw), base = newSave();
    for (let id of ALL_CARDS) s.cards[id] || (s.cards[id] = base.cards[id]);
    for (let id of ALL_CARDS) {
      let c = s.cards[id];
      if (!c.inv || typeof c.inv != "object") {
        if (c.inv = {}, c.seen = [], c.unlocked && c.level >= 1) {
          c.inv[c.level] = 1;
          for (let L = 1; L <= c.level; L++) c.seen.push(L);
        }
        c.fresh = !1;
      }
      typeof c.copies == "number" && c.copies > 0 && (c.inv[1] = (c.inv[1] || 0) + c.copies, c.seen.includes(1) || (c.seen.push(1), c.seen.sort((a, b) => a - b), c.fresh = !0)), delete c.copies, syncCard(c);
    }
    (!s.onboard || typeof s.onboard != "object") && (s.onboard = newOnboardState(), s.levels[ZAPPER_STAGE] && s.levels[ZAPPER_STAGE].cleared && (s.onboard.zapperGift = "done")), s.onboard.firstBattle !== "pending" && s.onboard.firstBattle !== "done" && (s.onboard.firstBattle = "done"), (s.version || 1) < 5 && s.levels[ZAPPER_STAGE] && s.levels[ZAPPER_STAGE].cleared && s.onboard.zapperGift === "done" && !s.onboard.legacyPack && (s.onboard.zapperGift = "pending", s.onboard.legacyPack = !0, s.onboard.grantedOnLoad = !1), (!s.seenSpecial || typeof s.seenSpecial != "object" || Array.isArray(s.seenSpecial)) && (s.seenSpecial = {}), Array.isArray(s.seenAnts) || (s.seenAnts = [], s.levels.forEach((lv, i) => {
      if (lv && lv.cleared && LEVELS[i]) for (let t of levelAntTypes(i)) s.seenAnts.includes(t) || s.seenAnts.push(t);
    })), typeof s.packsSinceNew != "number" && (s.packsSinceNew = 0);
    for (let b of BONUS_TYPES) s.bonusStock[b] == null && (s.bonusStock[b] = 0);
    for (; s.levels.length < LEVELS.length; ) s.levels.push({ stars: 0, cleared: !1 });
    typeof s.diamonds != "number" && (s.diamonds = ECONOMY.diamonds.start), s.calendar || (s.calendar = newCalendarState()), (!s.cardBlink || typeof s.cardBlink != "object") && (s.cardBlink = newCardBlinkState());
    for (let k of Object.keys(base.cardBlink)) typeof s.cardBlink[k] != "boolean" && (s.cardBlink[k] = !1);
    return s.lastDeck || (s.lastDeck = base.lastDeck.slice()), s.lastBonuses || (s.lastBonuses = base.lastBonuses.slice()), s.version = Math.max(s.version || 1, SAVE_VERSION), delete s.crumbs, s.settings = { ...defaultSettings(), ...s.settings && typeof s.settings == "object" ? s.settings : {} }, ["auto", "on", "off"].includes(s.settings.reduceMotion) || (s.settings.reduceMotion = "auto"), typeof s.settings.haptics != "boolean" && (s.settings.haptics = !0), s.debug = { reach: Array.isArray(s.debug && s.debug.reach) ? s.debug.reach.filter((x) => x && typeof x == "object").slice(-20) : [] }, s;
  } catch {
    return newSave();
  }
}
function writeSave(storage2, save) {
  let copy = { ...save };
  delete copy.crumbs, storage2.setItem(SAVE_KEY, JSON.stringify(copy));
}
function noteLossRun(save, li, won) {
  let r = save.lossRun;
  return won ? (r && r.li === li && (save.lossRun = null), 0) : (r && r.li === li ? r.n += 1 : save.lossRun = { li, n: 1 }, save.lossRun.n);
}
function nextHintState(save) {
  let o = save.onboard;
  return !o || typeof o != "object" ? { shown: 2, armed: "", done: [] } : ((!o.nextHint || typeof o.nextHint != "object") && (o.nextHint = { shown: 0, armed: "", done: [] }), o.nextHint);
}
function armNextHint(save, kind) {
  let h = nextHintState(save);
  return h.shown >= 2 || h.armed || h.done.includes(kind) ? !1 : (h.armed = kind, !0);
}
function nextUnplayedLevel(save) {
  for (let i = 0; i < LEVELS.length; i++) if (!save.levels[i].cleared && levelUnlocked(save, i)) return i;
  return -1;
}
function isReturningPlayer(save) {
  return !!save && Array.isArray(save.levels) && save.levels.some((l) => l && l.cleared);
}
function dailyWinBonus(coinMul) {
  return Math.round(DAILY_WIN.base * Math.min(coinMul, DAILY_WIN.capMul) / 5) * 5;
}
function skinState(save) {
  return (!save.skins || typeof save.skins != "object") && (save.skins = { owned: [], equipped: {} }), save.skins;
}
function buySkin(save, id) {
  let sk = SKINS.find((x) => x.id === id);
  if (!sk) return { ok: !1, reason: "unknown" };
  let st = skinState(save);
  return st.owned.includes(id) ? { ok: !1, reason: "owned" } : (save.coins || 0) < sk.price ? { ok: !1, reason: "coins" } : (save.coins -= sk.price, st.owned.push(id), st.equipped[sk.tower] = id, { ok: !0, price: sk.price });
}
function equipSkin(save, tower, id) {
  let st = skinState(save);
  if (id == null)
    return delete st.equipped[tower], !0;
  let sk = SKINS.find((x) => x.id === id);
  return !sk || sk.tower !== tower || !st.owned.includes(id) ? !1 : (st.equipped[tower] = id, !0);
}
function skinPads(save) {
  let st = skinState(save), out = {};
  for (let [t, id] of Object.entries(st.equipped)) {
    let sk = SKINS.find((x) => x.id === id);
    sk && st.owned.includes(id) && (out[t] = sk.pad);
  }
  return out;
}
function nextSkinPrice(save) {
  let st = skinState(save), left = SKINS.filter((x) => !st.owned.includes(x.id)).map((x) => x.price);
  return left.length ? Math.min(...left) : null;
}
function metAnts(save) {
  let last2 = -1;
  (save.levels || []).forEach((l, i) => {
    l && l.cleared && (last2 = i);
  });
  let met = new Set((save.seenAnts || []).filter((t) => ANTS[t]));
  for (let i = 0; i <= Math.min(LEVELS.length - 1, last2 + 1); i++) for (let t of levelAntTypes(i)) met.add(t);
  return met;
}
function antLevels(type) {
  let out = [];
  return LEVELS.forEach((_, i) => {
    levelAntTypes(i).includes(type) && out.push(i + 1);
  }), out;
}
function airFixPlan(deck, owned, levels, max, air = AIR_COUNTERS) {
  if (deck.some((d) => air.includes(d))) return null;
  let add = ["laser", "zapper"].find((id) => air.includes(id) && owned.includes(id));
  if (!add) return null;
  if (deck.length < max) return { add, drop: null };
  let rank = (id) => (levels[id] ? levels[id].level : 1) * 10 + rarityRank(id), drop = null, best = 1e9;
  return deck.forEach((id) => {
    let r = rank(id);
    r <= best && (best = r, drop = id);
  }), { add, drop };
}

// src/calendar.js
var DAY = 864e5;
function dayNumber(ts) {
  let d = new Date(ts);
  return Math.round(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / DAY);
}
var cal = (save) => save.calendar = save.calendar || newCalendarState(), fresh7 = () => [!1, !1, !1, !1, !1, !1, !1];
function visit(c, today, K) {
  c.lastVisitDay != null && today <= c.lastVisitDay || (c.pos == null || c.lastVisitDay == null || c.pos >= K.week.length - 1 ? (c.pos = 0, c.cycleStartDay = today, c.weekClaimed = fresh7(), c.weekGot = []) : c.pos++, c.lastVisitDay = today);
}
function touch(save, now2, K = CALENDAR) {
  let c = cal(save);
  K.monthlyReset.rule === "hours24" && c.lastSeenTs != null && now2 - c.lastSeenTs > K.monthlyReset.hours * 36e5 && (c.broken = !0), c.lastSeenTs = now2, visit(c, dayNumber(now2), K);
}
function streakResets(c, today, K) {
  return c.lastClaimDay == null ? !0 : K.monthlyReset.rule === "hours24" ? !!c.broken : today - c.lastClaimDay > 1;
}
function canClaim(save, now2) {
  let c = cal(save);
  return c.lastClaimDay == null || dayNumber(now2) > c.lastClaimDay;
}
function nextStreak(save, now2, K = CALENDAR) {
  let c = cal(save), today = dayNumber(now2);
  return canClaim(save, now2) ? streakResets(c, today, K) ? 1 : c.streak % K.monthLength + 1 : c.streak;
}
function coinBase(c, save, now2, K) {
  return canClaim(save, now2) && streakResets(c, dayNumber(now2), K) ? 0 : c.coinStep || 0;
}
var worldMul = (world = 1, K = CALENDAR) => 1 + (K.worldStep || 0) * (Math.max(1, world) - 1), coinAmount = (k, K = CALENDAR, world = 1) => {
  let v = K.coinsByStreak[Math.min(Math.max(1, k), K.coinsByStreak.length) - 1] * worldMul(world, K), q = K.roundTo || 1;
  return Math.round(v / q) * q;
};
function prizeFor(tile, streak, K = CALENDAR, coinStep = streak, world = 1) {
  let e = K.week[tile], s = Math.max(1, streak);
  return e.kind === "coins" ? { kind: "coins", count: e.count ?? coinAmount(coinStep, K, world) } : e.kind === "diamonds" ? { kind: "diamonds", count: e.count ?? K.diamondsByStreakWeek[Math.min(Math.floor((s - 1) / 7), K.diamondsByStreakWeek.length - 1)] } : e.kind === "card" ? { kind: "card", level: e.level || 1, ...e.extra ? { extra: { ...e.extra } } : {} } : e.kind === "booster" ? { kind: "booster", id: e.id, count: 1 } : { ...e };
}
function status(save, now2, K = CALENDAR) {
  let c = cal(save), today = dayNumber(now2);
  visit(c, today, K);
  let tile = c.pos, claimable = canClaim(save, now2), streakAfter = nextStreak(save, now2, K), resetPending = claimable && c.lastClaimDay != null && streakResets(c, today, K), base = coinBase(c, save, now2, K), world = highestWorld(save), coins = base, tiles = K.week.map((e, i) => {
    let step = base + 1;
    return i >= tile && (e.kind === "coins" && coins++, step = coins), {
      i,
      state: c.weekClaimed[i] ? "claimed" : i === tile ? claimable ? "today" : "claimed" : i < tile ? "missed" : "future",
      prize: c.weekClaimed[i] && c.weekGot && c.weekGot[i] && c.weekGot[i].kind === e.kind ? { ...prizeFor(i, streakAfter, K, step, world), count: c.weekGot[i].count } : prizeFor(i, i >= tile ? streakAfter + (i - tile) : streakAfter, K, step, world)
    };
  });
  return { tile, claimable, streak: resetPending ? 0 : c.streak, streakAfter, resetPending, tiles, monthLength: K.monthLength, milestones: K.monthMilestones, cycleStartDay: c.cycleStartDay };
}
function grant(save, p, rng) {
  return p.kind === "coins" ? (save.coins += p.count, { ...p }) : p.kind === "diamonds" ? (save.diamonds = (save.diamonds || 0) + p.count, { ...p }) : p.kind === "card" ? grantCardPrize(save, p.level, rng) : p.kind === "booster" ? grantBooster(save, p.id, 1) : null;
}
function claim(save, now2, rng = Math.random, K = CALENDAR) {
  let c = cal(save), today = dayNumber(now2);
  if (visit(c, today, K), !canClaim(save, now2)) return { ok: !1, why: "claimed" };
  let tile = c.pos;
  if (c.weekClaimed[tile]) return { ok: !1, why: "claimed" };
  let streak = nextStreak(save, now2, K), base = coinBase(c, save, now2, K), isCoins = K.week[tile].kind === "coins", p0 = prizeFor(tile, streak, K, base + 1, highestWorld(save)), prize = grant(save, p0, rng), extra = p0.extra ? grant(save, p0.extra, rng) : null;
  prize && extra && (prize.extra = extra);
  let ms = K.monthMilestones && K.monthMilestones[streak], milestone = ms ? grant(save, ms.kind === "booster" ? { ...ms, count: 1 } : ms, rng) : null;
  return c.streak = streak, c.coinStep = base + (isCoins ? 1 : 0), c.lastClaimDay = today, c.lastClaimTs = now2, c.lastSeenTs = now2, c.broken = !1, c.weekClaimed[tile] = !0, c.weekGot = c.weekGot || [], c.weekGot[tile] = prize && prize.count != null ? { kind: prize.kind, count: prize.count } : null, c.log = [...c.log || [], { day: today, tile, streak, prize: prize && prize.kind }].slice(-40), { ok: !0, tile, streak, prize, extra, milestone };
}

// src/recipes.js
var INK = "#523c4b", FONT_BODY = "'Trebuchet MS','Nunito','Arial Rounded MT Bold','Segoe UI',Roboto,sans-serif", FONT_DISPLAY = `'Lilita One','Trebuchet MS','Arial Rounded MT Bold',${FONT_BODY}`, _pc = /* @__PURE__ */ new Map();
function parseColor(c) {
  let v = _pc.get(c);
  if (v) return v;
  let r = 0, g = 0, b = 0;
  if (c[0] === "#") {
    let h = c.slice(1);
    h.length === 3 && (h = h.split("").map((x) => x + x).join(""));
    let n = parseInt(h.slice(0, 6), 16);
    r = n >> 16 & 255, g = n >> 8 & 255, b = n & 255;
  } else {
    let m = c.match(/-?[\d.]+/g);
    m && (r = +m[0], g = +m[1], b = +m[2]);
  }
  return v = [r, g, b], _pc.size > 600 && _pc.clear(), _pc.set(c, v), v;
}
var hx = (n) => (n = Math.max(0, Math.min(255, Math.round(n))), (n < 16 ? "0" : "") + n.toString(16));
function toHex(rgb) {
  return "#" + hx(rgb[0]) + hx(rgb[1]) + hx(rgb[2]);
}
function mixHex(a, b, t) {
  let p = parseColor(a), q = parseColor(b);
  return toHex([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2] + (q[2] - p[2]) * t]);
}
function hueOf(c) {
  let [r, g, b] = parseColor(c).map((v) => v / 255), mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  if (d < 1e-3) return [0, 0];
  let h = mx === r ? (g - b) / d % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return h *= 60, h < 0 && (h += 360), [h, d / (mx || 1)];
}
var _ramp = /* @__PURE__ */ new Map();
function ramp(base, cool) {
  let key = base + (cool === void 0 ? "" : cool ? "|c" : "|w"), r = _ramp.get(key);
  if (r) return r;
  if (cool === void 0) {
    let [h, s] = hueOf(base);
    cool = s > 0.12 && h >= 85 && h <= 285;
  }
  return r = cool ? { hi: mixHex(base, "#ffffff", 0.7), lit: mixHex(base, "#fffdf0", 0.32), base, shade: mixHex(base, "#6f6aa8", 0.34), deep: mixHex(base, "#4a3f7a", 0.56), line: INK } : { hi: mixHex(base, "#fffdf0", 0.7), lit: mixHex(base, "#fffdf0", 0.32), base, shade: mixHex(base, "#8c3f4f", 0.3), deep: mixHex(base, "#5a2438", 0.5), line: INK }, _ramp.size > 500 && _ramp.clear(), _ramp.set(key, r), r;
}
var CANDY = {
  green: ["#b6f08a", "#6fd44a", "#2f9a3a"],
  gold: ["#fff0a0", "#ffd23f", "#d98a14"],
  orange: ["#ffd29a", "#ff9a3c", "#d8561a"],
  pink: ["#ffc4d8", "#ff7fa8", "#d1497b"],
  cyan: ["#c4f6ff", "#6fd8ef", "#2a98c0"],
  blue: ["#c8dcff", "#7ba8ff", "#3f66d6"],
  red: ["#ffb0a4", "#ff6a5a", "#c93030"],
  purple: ["#e2d0ff", "#b896f5", "#7a4cc2"],
  grey: ["#eee6ea", "#d8cfd6", "#a89aa6"],
  // v0.8.1 F7: the neutral secondary family (Back / Pause / Redraw / Close / Map ...): cream face, #e8d2bd shade, #c9a98e lip, INK label. F14: the disabled ramp (flat, no gloss, label at 60% alpha).
  cream: ["#fffaf3", "#fff3e6", "#c9a98e", "#e8d2bd"],
  dis: ["#ebe2e7", "#e6dce2", "#bfb2bb", "#ddd0d8"]
}, COL2CANDY = { "#9fe0b5": "green", "#ffd27a": "gold", "#d9cfe0": "purple", "#ffb3c1": "pink", "#b5d8ff": "blue", "#ff9a9a": "red", "#ffd0d0": "red", "#8fd0ff": "cyan", "#ffb3b3": "red", "#d8cfd6": "grey", "#fff3e6": "cream" };
function candyOf(col) {
  let k = COL2CANDY[col.toLowerCase()];
  if (k) return CANDY[k];
  let r = ramp(col);
  return [r.lit, col, r.shade];
}
function contactShadow(ctx2, x, y, rx, ry = rx * 0.34, a = 0.2) {
  ctx2.save(), ctx2.translate(x, y), ctx2.scale(1, ry / Math.max(rx, 0.01));
  let g = ctx2.createRadialGradient(0, 0, 0, 0, 0, rx * 1.15);
  g.addColorStop(0, `rgba(74,40,60,${a * 1.25})`), g.addColorStop(0.55, `rgba(74,40,60,${a * 0.85})`), g.addColorStop(1, "rgba(74,40,60,0)"), ctx2.beginPath(), ctx2.arc(0, 0, rx * 1.15, 0, Math.PI * 2), ctx2.fillStyle = g, ctx2.fill(), ctx2.restore();
}
function drawGlossyBlob(ctx2, x, y, rx, ry, base, o = {}) {
  let lw = o.lw === void 0 ? 2 : o.lw, rot = o.rot || 0, m = Math.min(rx, ry), gl = o.gloss === void 0 ? 1 : o.gloss, R = ramp(base, o.cool), g = ctx2.createRadialGradient(x - rx * 0.36, y - ry * 0.46, Math.max(0.6, m * 0.1), x, y, Math.max(rx, ry) * 1.18);
  g.addColorStop(0, R.lit), g.addColorStop(0.42, R.base), g.addColorStop(0.82, R.shade), g.addColorStop(1, R.deep), ctx2.beginPath(), ctx2.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2), ctx2.fillStyle = g, ctx2.fill(), m >= 5 && o.rim !== !1 && (ctx2.beginPath(), ctx2.ellipse(x, y, rx * 0.8, ry * 0.8, rot, Math.PI * 0.12, Math.PI * 0.62), ctx2.lineWidth = Math.max(1, m * 0.13), ctx2.lineCap = "round", ctx2.strokeStyle = mixHex(R.base, "#fffdf0", 0.38), ctx2.globalAlpha = 0.55, ctx2.stroke(), ctx2.globalAlpha = 1), lw && (ctx2.beginPath(), ctx2.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2), ctx2.lineWidth = lw, ctx2.strokeStyle = o.line || INK, ctx2.stroke()), gl > 0 && m >= 3.2 && (ctx2.save(), ctx2.translate(x, y), ctx2.rotate(rot), ctx2.beginPath(), ctx2.ellipse(-rx * 0.32, -ry * 0.44, rx * 0.34, ry * 0.2, -0.5, 0, Math.PI * 2), ctx2.fillStyle = R.hi, ctx2.globalAlpha = 0.78 * gl, ctx2.fill(), m >= 6 && (ctx2.beginPath(), ctx2.arc(-rx * 0.6, -ry * 0.12, Math.max(0.8, m * 0.07), 0, Math.PI * 2), ctx2.globalAlpha = 0.85 * gl, ctx2.fillStyle = "#ffffff", ctx2.fill()), ctx2.restore(), ctx2.globalAlpha = 1);
}
function rrPath(ctx2, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2), ctx2.beginPath(), ctx2.moveTo(x + r, y), ctx2.arcTo(x + w, y, x + w, y + h, r), ctx2.arcTo(x + w, y + h, x, y + h, r), ctx2.arcTo(x, y + h, x, y, r), ctx2.arcTo(x, y, x + w, y, r), ctx2.closePath();
}
function drawBeveledTile(ctx2, x, y, w, h, base, o = {}) {
  let lip = o.lip === void 0 ? 4 : o.lip, r = o.r === void 0 ? Math.min(10, h / 3) : o.r, lw = o.lw === void 0 ? 2.2 : o.lw, R = ramp(base, o.cool);
  lip && (rrPath(ctx2, x, y + lip, w, h, r), ctx2.fillStyle = R.deep, ctx2.fill(), lw && (ctx2.lineWidth = lw, ctx2.strokeStyle = o.line || INK, ctx2.stroke()));
  let g = ctx2.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, R.lit), g.addColorStop(0.5, R.base), g.addColorStop(1, o.end || R.shade), rrPath(ctx2, x, y, w, h, r), ctx2.fillStyle = g, ctx2.fill(), lw && (ctx2.lineWidth = lw, ctx2.strokeStyle = o.line || INK, ctx2.stroke()), h >= 14 && w >= 14 && (ctx2.lineCap = "round", ctx2.beginPath(), ctx2.moveTo(x + r * 0.7 + 1, y + lw + 1.2), ctx2.lineTo(x + w - r * 0.7 - 1, y + lw + 1.2), ctx2.lineWidth = 1.6, ctx2.strokeStyle = R.hi, ctx2.globalAlpha = o.hi === void 0 ? 0.8 : o.hi, ctx2.stroke(), ctx2.beginPath(), ctx2.moveTo(x + r * 0.7 + 1, y + h - lw - 1.4), ctx2.lineTo(x + w - r * 0.7 - 1, y + h - lw - 1.4), ctx2.lineWidth = 2.2, ctx2.strokeStyle = R.deep, ctx2.globalAlpha = 0.28, ctx2.stroke(), ctx2.globalAlpha = 1);
}
var _spr = /* @__PURE__ */ new Map(), _sprCount = 0;
var _mk = null;
function mkCanvas(w, h) {
  if (_mk) return _mk(w, h);
  if (typeof OffscreenCanvas < "u") return new OffscreenCanvas(w, h);
  let c = document.createElement("canvas");
  return c.width = w, c.height = h, c;
}
function devScale(ctx2) {
  let m = ctx2.getTransform();
  return Math.min(4, Math.max(0.5, Math.round(Math.hypot(m.a, m.b) * 4) / 4));
}
function bakedBox(ctx2, key, x, y, w, h, pad2, draw, cap = 96) {
  let sc = devScale(ctx2), k = key + "@" + sc + "|" + w + "x" + h, e = _spr.get(k);
  if (e)
    _spr.delete(k);
  else {
    let cv = mkCanvas(Math.ceil((w + pad2 * 2) * sc), Math.ceil((h + pad2 * 2) * sc)), g = cv.getContext("2d");
    g.scale(sc, sc), g.translate(pad2, pad2), g.lineJoin = "round", g.lineCap = "round", draw(g, w, h), e = { cv, sc }, _sprCount++, _spr.size >= cap && _spr.delete(_spr.keys().next().value);
  }
  _spr.set(k, e), ctx2.drawImage(e.cv, x - pad2, y - pad2, w + pad2 * 2, h + pad2 * 2);
}
function drawPillButton(ctx2, x, y, w, h, family, o = {}) {
  let press = o.pressed ? 3 : 0, dis = !!o.disabled, r = o.r === void 0 ? Math.min(h / 2, 16) : o.r, fam = dis ? CANDY.dis : typeof family == "string" && CANDY[family] || (Array.isArray(family) ? family : candyOf(family || "#ffb3c1"));
  bakedBox(ctx2, "pill|" + fam.join(",") + "|" + (o.pressed ? 1 : 0) + "|" + r, x, y, w, h + 5, 4, (g, bw, bh) => {
    let hh = bh - 5, ph = press;
    rrPath(g, 0, o.pressed && fam[3] ? 1 : 4, bw, hh, r), g.fillStyle = fam[2], g.fill(), g.lineWidth = 2.5, g.strokeStyle = INK, g.stroke();
    let gr = g.createLinearGradient(0, ph, 0, ph + hh);
    gr.addColorStop(0, o.pressed && fam[3] ? "#f4e3d3" : fam[0]), gr.addColorStop(0.55, o.pressed && fam[3] ? "#f4e3d3" : fam[1]), gr.addColorStop(1, fam[3] || mixHex(fam[1], fam[2], 0.42)), rrPath(g, 0, ph, bw, hh, r), g.fillStyle = gr, g.fill(), g.lineWidth = 2.5, g.strokeStyle = INK, g.stroke(), dis || (rrPath(g, 5, ph + 3.5, bw - 10, Math.max(6, hh * 0.3), Math.min(8, hh * 0.18)), g.fillStyle = "rgba(255,255,255,0.42)", g.fill()), g.beginPath(), g.moveTo(r * 0.8, ph + hh - 4.5), g.lineTo(bw - r * 0.8, ph + hh - 4.5), g.lineWidth = 2, g.strokeStyle = fam[2], g.globalAlpha = 0.3, g.stroke(), g.globalAlpha = 1;
  });
}
var TEXT_MODES = {
  title: { fill: "#fff6d8", inner: "#f59a2a", outer: "#b8531a", ink: INK, drop: 3 },
  num: { fill: "#fffdf0", inner: null, outer: INK, ink: INK, drop: 1.5 },
  btn: { fill: "#ffffff", inner: null, outer: INK, ink: INK, drop: 2 },
  plain: { fill: "#fffdf0", inner: null, outer: INK, ink: INK, drop: 0 }
}, _fontEpoch = 0, _fontOk = !1;
function setFontReady(v) {
  v !== _fontOk && (_fontOk = v, _fontEpoch++, _spr.clear());
}
function drawChunkyText(ctx2, str, x, y, size, o = {}) {
  let M = TEXT_MODES[o.mode || "btn"], fill = o.fill || M.fill, align = o.align || "center";
  ctx2.save(), ctx2.font = `${size}px ${FONT_DISPLAY}`, ctx2.textAlign = align, ctx2.textBaseline = "middle", ctx2.lineJoin = "round", ctx2.miterLimit = 2;
  let ow = o.outline || Math.max(2.4, size * 0.16);
  if (M.drop && (ctx2.lineWidth = ow * 2, ctx2.strokeStyle = "rgba(60,30,40,0.30)", ctx2.strokeText(str, x, y + M.drop)), ctx2.lineWidth = ow * 2, ctx2.strokeStyle = M.ink, ctx2.strokeText(str, x, y), M.inner && (ctx2.lineWidth = ow * 1.35, ctx2.strokeStyle = M.outer, ctx2.strokeText(str, x, y)), M.inner && size >= 20) {
    let lit = mixHex(fill, "#ffffff", 0.35), g = ctx2.createLinearGradient(0, y - size * 0.5, 0, y + size * 0.5);
    g.addColorStop(0, lit), g.addColorStop(0.45, lit), g.addColorStop(0.46, fill), g.addColorStop(1, fill), ctx2.fillStyle = g;
  } else ctx2.fillStyle = fill;
  ctx2.fillText(str, x, y), ctx2.restore();
}
function sparkle(ctx2, x, y, r, col = "#fff7a8", rot = 0) {
  ctx2.save(), ctx2.translate(x, y), ctx2.rotate(rot), ctx2.beginPath();
  for (let i = 0; i < 8; i++) {
    let a = i * Math.PI / 4, rr2 = i % 2 ? r * 0.28 : r;
    ctx2.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2);
  }
  ctx2.closePath(), ctx2.fillStyle = col, ctx2.fill(), ctx2.lineWidth = Math.max(0.8, r * 0.14), ctx2.strokeStyle = INK, ctx2.lineJoin = "round", ctx2.stroke(), ctx2.restore();
}
function candyStar(ctx2, x, y, r, base = "#ffd23f", lw = 1.6, rot = 0) {
  let rr2 = r >= 6 ? Math.round(r) : Math.round(r * 2) / 2, S2 = rr2 + lw + 1;
  ctx2.save(), ctx2.translate(x, y), ctx2.rotate(rot), bakedBox(ctx2, "star" + rr2 + base + lw, -S2, -S2, 2 * S2, 2 * S2, 1, (g) => {
    g.translate(S2, S2), candyStarRaw(g, 0, 0, rr2, base, lw, 0);
  }, 128), ctx2.restore();
}
function candyStarRaw(ctx2, x, y, r, base, lw, rot) {
  ctx2.save(), ctx2.translate(x, y), ctx2.rotate(rot), ctx2.lineJoin = "round", ctx2.beginPath();
  for (let i = 0; i < 10; i++) {
    let a = -Math.PI / 2 + i * Math.PI / 5, rr2 = i % 2 ? r * 0.5 : r;
    ctx2.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2);
  }
  ctx2.closePath();
  let R = ramp(base, !1), g = ctx2.createLinearGradient(0, -r, 0, r);
  g.addColorStop(0, R.lit), g.addColorStop(0.55, R.base), g.addColorStop(1, R.shade), ctx2.fillStyle = g, ctx2.fill(), lw && (ctx2.lineWidth = lw, ctx2.strokeStyle = INK, ctx2.stroke()), r >= 6 && (ctx2.beginPath(), ctx2.moveTo(-r * 0.3, -r * 0.35), ctx2.lineTo(-r * 0.08, -r * 0.68), ctx2.lineWidth = Math.max(1, r * 0.12), ctx2.strokeStyle = "rgba(255,255,255,0.8)", ctx2.lineCap = "round", ctx2.stroke()), ctx2.restore();
}
function squashAt(ctx2, x, y, k, amt = 0.12) {
  let s = 1 + amt * Math.sin(Math.max(0, Math.min(1, k)) * Math.PI);
  ctx2.translate(x, y), ctx2.scale(1 / Math.sqrt(s), s), ctx2.translate(-x, -y);
}
var easeOutBack = (k) => {
  k = Math.max(0, Math.min(1, k));
  let c1 = 1.70158;
  return 1 + (c1 + 1) * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2);
};
function lightBurst(ctx2, x, y, R, t, o = {}) {
  let n = o.rays || 14, a0 = (o.spin === void 0 ? 0.25 : o.spin) * t, al = o.alpha === void 0 ? 0.42 : o.alpha;
  ctx2.save(), ctx2.translate(x, y), ctx2.rotate(a0);
  let g = ctx2.createRadialGradient(0, 0, 4, 0, 0, R);
  g.addColorStop(0, `rgba(255,248,196,${al})`), g.addColorStop(0.6, `rgba(255,236,150,${al * 0.55})`), g.addColorStop(1, "rgba(255,236,150,0)"), ctx2.beginPath();
  for (let i = 0; i < n; i++) {
    let a = i * Math.PI * 2 / n, w = Math.PI / n * 0.62;
    ctx2.moveTo(0, 0), ctx2.lineTo(Math.cos(a - w) * R, Math.sin(a - w) * R), ctx2.lineTo(Math.cos(a + w) * R, Math.sin(a + w) * R), ctx2.closePath();
  }
  ctx2.fillStyle = g, ctx2.fill(), ctx2.restore();
}
function coinDraw(g, cx, cy, r, th) {
  let ry = r * 0.92;
  if (g.beginPath(), g.ellipse(cx, cy + th, r, ry, 0, 0, Math.PI * 2), g.fillStyle = "#c47a10", g.fill(), g.lineWidth = Math.max(1.4, r * 0.2), g.strokeStyle = INK, g.stroke(), drawGlossyBlob(g, cx, cy, r, ry, "#ffd23f", { lw: Math.max(1.4, r * 0.2), gloss: 0.9, cool: !1 }), g.beginPath(), g.ellipse(cx, cy, r * 0.7, ry * 0.7, 0, 0, Math.PI * 2), g.lineWidth = Math.max(0.8, r * 0.1), g.strokeStyle = "#d98a14", g.stroke(), r >= 4.5) {
    g.save(), g.translate(cx, cy + 0.2);
    let sr = r * 0.46;
    for (let [dx, dy, col] of [[0.6, 0.7, "#b8741a"], [-0.3, -0.4, "#fff6b8"]]) {
      g.beginPath();
      for (let i = 0; i < 10; i++) {
        let a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? sr * 0.5 : sr;
        g.lineTo(dx + Math.cos(a) * q, dy + Math.sin(a) * q);
      }
      g.closePath(), g.fillStyle = col, g.fill();
    }
    g.restore();
  }
}
function drawCoin(ctx2, x, y, r = 8) {
  bakedBox(ctx2, "coin" + r, x - r - 1, y - r - 1, 2 * r + 2, 2 * r + 3, 2, (g) => coinDraw(g, r + 1, r + 1, r, Math.max(1.2, r * 0.22)));
}
var PILE = { w: 78, h: 30 };
function drawCoinPile(ctx2, x, y, k = 1) {
  bakedBox(ctx2, "pile", x - PILE.w / 2 * k, y - PILE.h * k, PILE.w * k, PILE.h * k, 6, (g) => {
    g.save(), g.scale(k, k);
    let rows = [[[-24, 19], [-8, 19.5], [8, 19.5], [24, 19]], [[-16, 13], [0, 13.5], [16, 13]], [[-7, 8], [8, 8]], [[0, 3.2]]];
    for (let row of rows) for (let [px, py] of row) coinDraw(g, PILE.w / 2 + px, py, 8, 3);
    g.restore();
  });
}
function pressScale(pressed, heldMs, sinceRelMs) {
  if (pressed) return 1 - 0.04 * Math.min(1, Math.max(0, heldMs) / 60);
  if (sinceRelMs != null && sinceRelMs >= 0 && sinceRelMs < 110) {
    let q = 1 - sinceRelMs / 110;
    return 1 + 0.04 * q * q;
  }
  return 1;
}

// src/art.js
var CRUMB_OUTLINE = "#2e1a12", FONT = FONT_BODY;
function rr(ctx2, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2), ctx2.beginPath(), ctx2.moveTo(x + r, y), ctx2.arcTo(x + w, y, x + w, y + h, r), ctx2.arcTo(x + w, y + h, x, y + h, r), ctx2.arcTo(x, y + h, x, y, r), ctx2.arcTo(x, y, x + w, y, r), ctx2.closePath();
}
function shade(hex, amt) {
  let c = hex.replace("#", "");
  c.length === 3 && (c = c.split("").map((x) => x + x).join(""));
  let n = parseInt(c, 16), r = n >> 16 & 255, g = n >> 8 & 255, b = n & 255, f = (v) => Math.max(0, Math.min(255, Math.round(amt > 0 ? v + (255 - v) * amt : v * (1 + amt))));
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}
function blob(ctx2, x, y, rx, ry, color, lw = 2, rot = 0, opt) {
  drawGlossyBlob(ctx2, x, y, rx, ry, color, opt ? { lw, rot, ...opt } : { lw, rot });
}
function shadow(ctx2, x, y, rx, ry = rx * 0.35, a = 0.2) {
  ctx2.save(), ctx2.translate(x, y), ctx2.scale(1, ry / Math.max(rx, 0.01));
  let g = ctx2.createRadialGradient(0, 0, 0, 0, 0, rx * 1.15);
  g.addColorStop(0, `rgba(74,40,60,${a * 1.25})`), g.addColorStop(0.55, `rgba(74,40,60,${a * 0.85})`), g.addColorStop(1, "rgba(74,40,60,0)"), ctx2.beginPath(), ctx2.arc(0, 0, rx * 1.15, 0, Math.PI * 2), ctx2.fillStyle = g, ctx2.fill(), ctx2.restore();
}
function rim(ctx2, x, y, rx, ry, a = 0.7, from = Math.PI * 1.05, to = Math.PI * 1.55) {
  ctx2.beginPath(), ctx2.ellipse(x, y, rx * 0.86, ry * 0.86, 0, from, to), ctx2.lineWidth = Math.max(1, Math.min(rx, ry) * 0.16), ctx2.strokeStyle = `rgba(255,255,255,${a})`, ctx2.lineCap = "round", ctx2.stroke();
}
function text(ctx2, s, x, y, size = 16, fill = "#fff", align = "center", stroke = INK, weight = "bold", display = !1) {
  ctx2.font = `${weight} ${size}px ${display ? FONT_DISPLAY : FONT}`, ctx2.textAlign = align, ctx2.textBaseline = "middle", stroke && (ctx2.lineJoin = "round", ctx2.lineWidth = Math.max(2, size / 4.5), ctx2.strokeStyle = stroke, ctx2.strokeText(s, x, y)), ctx2.fillStyle = fill, ctx2.fillText(s, x, y);
}
function eye(ctx2, x, y, r, look = 0.5, blink = !1) {
  if (blink) {
    ctx2.beginPath(), ctx2.moveTo(x - r, y), ctx2.quadraticCurveTo(x, y + r * 0.7, x + r, y), ctx2.lineWidth = 1.6, ctx2.strokeStyle = INK, ctx2.stroke();
    return;
  }
  ctx2.beginPath(), ctx2.ellipse(x, y, r, r * 1.12, 0, 0, Math.PI * 2), ctx2.fillStyle = "#fff", ctx2.fill(), ctx2.lineWidth = 1.5, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.arc(x + r * 0.35 * look, y + r * 0.1, r * 0.6, 0, Math.PI * 2), ctx2.fillStyle = "#2b1d28", ctx2.fill(), ctx2.beginPath(), ctx2.arc(x + r * 0.35 * look - r * 0.22, y - r * 0.2, r * 0.22, 0, Math.PI * 2), ctx2.fillStyle = "#fff", ctx2.fill(), ctx2.beginPath(), ctx2.arc(x + r * 0.35 * look + r * 0.2, y + r * 0.34, r * 0.1, 0, Math.PI * 2), ctx2.fillStyle = "rgba(255,255,255,0.85)", ctx2.fill();
}
function crumbIcon(ctx2, x, y, s = 1, dark = !1) {
  ctx2.save(), ctx2.translate(x, y), ctx2.scale(s, s), ctx2.beginPath(), ctx2.moveTo(-7, 3), ctx2.quadraticCurveTo(-8, -5, -1, -7), ctx2.quadraticCurveTo(7, -7, 7, 0), ctx2.quadraticCurveTo(7, 6, 0, 6), ctx2.quadraticCurveTo(-6, 7, -7, 3), ctx2.closePath();
  let g = ctx2.createLinearGradient(0, -7, 0, 7);
  g.addColorStop(0, "#f6c77d"), g.addColorStop(1, "#d48f45"), ctx2.fillStyle = g, ctx2.fill(), ctx2.lineWidth = dark ? 2.3 : 1.8, ctx2.strokeStyle = dark ? CRUMB_OUTLINE : INK, ctx2.stroke(), ctx2.fillStyle = "#7a4a2a";
  for (let [a, b] of [[-3, -2], [2, 1], [-1, 3]])
    ctx2.beginPath(), ctx2.arc(a, b, 1.1, 0, 7), ctx2.fill();
  ctx2.restore();
}
function coinIcon(ctx2, x, y, s = 1) {
  drawCoin(ctx2, x, y, Math.round(8 * s * 2) / 2);
}
function diamondIcon(ctx2, x, y, s = 1) {
  ctx2.save(), ctx2.translate(x, y), ctx2.scale(s, s), ctx2.lineJoin = "round";
  let top = -6, mid = -1.5, bot = 8;
  ctx2.beginPath(), ctx2.moveTo(-8, mid), ctx2.lineTo(-4.5, top), ctx2.lineTo(4.5, top), ctx2.lineTo(8, mid), ctx2.lineTo(0, bot), ctx2.closePath();
  let g = ctx2.createLinearGradient(-8, top, 8, bot);
  g.addColorStop(0, "#d9f6ff"), g.addColorStop(0.45, "#7fd3ff"), g.addColorStop(1, "#4a9de8"), ctx2.fillStyle = g, ctx2.fill(), ctx2.lineWidth = 1.7, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.moveTo(-8, mid), ctx2.lineTo(8, mid), ctx2.moveTo(-2, top), ctx2.lineTo(-3.4, mid), ctx2.lineTo(0, bot), ctx2.lineTo(3.4, mid), ctx2.lineTo(2, top), ctx2.lineWidth = 0.9, ctx2.strokeStyle = "rgba(40,90,150,0.55)", ctx2.stroke(), ctx2.beginPath(), ctx2.moveTo(-5.6, mid - 0.6), ctx2.lineTo(-3.6, top + 1), ctx2.lineTo(-1.6, top + 1), ctx2.lineTo(-3.2, mid - 0.6), ctx2.closePath(), ctx2.fillStyle = "rgba(255,255,255,0.85)", ctx2.fill(), ctx2.restore();
}
function giftIcon(ctx2, x, y, s = 1) {
  ctx2.save(), ctx2.translate(x, y), ctx2.scale(s, s), ctx2.lineJoin = "round", rr(ctx2, -11, -3, 22, 15, 3);
  let g = ctx2.createLinearGradient(0, -3, 0, 12);
  g.addColorStop(0, "#ffb3cb"), g.addColorStop(1, "#f17ea6"), ctx2.fillStyle = g, ctx2.fill(), ctx2.lineWidth = 1.8, ctx2.strokeStyle = INK, ctx2.stroke(), rr(ctx2, -13, -8, 26, 7, 2.5), g = ctx2.createLinearGradient(0, -8, 0, -1), g.addColorStop(0, "#ffd0e0"), g.addColorStop(1, "#ff9ab9"), ctx2.fillStyle = g, ctx2.fill(), ctx2.stroke(), ctx2.fillStyle = "#ffe36e", ctx2.fillRect(-2.2, -8, 4.4, 20), ctx2.strokeRect(-2.2, -8, 4.4, 20);
  for (let sx of [-1, 1])
    ctx2.beginPath(), ctx2.ellipse(sx * 5, -11, 5, 3, sx * 0.5, 0, 7), ctx2.fillStyle = "#ffe36e", ctx2.fill(), ctx2.stroke();
  ctx2.restore();
}
var BOX_STYLES = [
  null,
  { body: ["#9ff0e0", "#3fc0b0"], lid: ["#c8fff4", "#69d8c8"], ribbon: "#ff7fa8", knot: "#ffb3cb" },
  // day 10: mint + pink
  { body: ["#d7c2ff", "#9a72e8"], lid: ["#ece2ff", "#b896f5"], ribbon: "#ffd45e", knot: "#fff0a0" },
  // day 20: violet + gold
  { body: ["#fff0a0", "#f2b632"], lid: ["#fff8cf", "#ffd45e"], ribbon: "rainbow", knot: "#ff7fa8" }
  // day 30: gold + rainbow
];
function monthBox(ctx2, x, y, s, tier, t = 0, reached = !1) {
  let st = BOX_STYLES[tier] || BOX_STYLES[1];
  if (ctx2.save(), ctx2.translate(x, y), ctx2.lineJoin = "round", tier === 3) {
    ctx2.save(), ctx2.rotate(t * 0.5);
    for (let k = 0; k < 10; k++)
      ctx2.rotate(Math.PI / 5), ctx2.beginPath(), ctx2.moveTo(0, 0), ctx2.lineTo(-4 * s, -30 * s), ctx2.lineTo(4 * s, -30 * s), ctx2.closePath(), ctx2.fillStyle = "rgba(255,226,120,0.35)", ctx2.fill();
    ctx2.restore();
    let g2 = ctx2.createRadialGradient(0, 0, 2, 0, 0, 28 * s);
    g2.addColorStop(0, "rgba(255,240,170,0.9)"), g2.addColorStop(1, "rgba(255,240,170,0)"), ctx2.beginPath(), ctx2.arc(0, 0, 28 * s, 0, 7), ctx2.fillStyle = g2, ctx2.fill();
  }
  let bob = Math.sin(t * 3 + tier) * (tier === 3 ? 1.6 : 0.8);
  ctx2.translate(0, bob), ctx2.scale(s, s), shadow(ctx2, 0, 13, 13, 3, 0.18), rr(ctx2, -12, -3, 24, 16, 3.5);
  let g = ctx2.createLinearGradient(0, -3, 0, 13);
  g.addColorStop(0, st.body[0]), g.addColorStop(1, st.body[1]), ctx2.fillStyle = g, ctx2.fill(), ctx2.lineWidth = 1.8, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.fillStyle = "rgba(255,255,255,0.55)";
  for (let [dx, dy] of [[-7, 3], [7, 8], [-6, 10], [8, 1]])
    ctx2.beginPath(), ctx2.arc(dx, dy, 1.3, 0, 7), ctx2.fill();
  let lift = tier === 3 ? Math.max(0, Math.sin(t * 2.4)) * 1.6 : 0;
  rr(ctx2, -14, -9 - lift, 28, 7.5, 2.5), g = ctx2.createLinearGradient(0, -9, 0, -1), g.addColorStop(0, st.lid[0]), g.addColorStop(1, st.lid[1]), ctx2.fillStyle = g, ctx2.fill(), ctx2.stroke();
  let rib = st.ribbon === "rainbow" ? (() => {
    let r = ctx2.createLinearGradient(0, -9, 0, 13);
    for (let [o, c] of [[0, "#ff7fa8"], [0.25, "#ffb347"], [0.5, "#ffe36e"], [0.75, "#7fe0a0"], [1, "#7fc4ff"]]) r.addColorStop(o, c);
    return r;
  })() : st.ribbon;
  ctx2.fillStyle = rib, ctx2.fillRect(-2.6, -9 - lift, 5.2, 22 + lift), ctx2.strokeRect(-2.6, -9 - lift, 5.2, 22 + lift), ctx2.fillRect(-12, 3, 24, 3.6), ctx2.strokeRect(-12, 3, 24, 3.6);
  for (let sx of [-1, 1])
    ctx2.beginPath(), ctx2.ellipse(sx * 5.5, -12.5 - lift, 5.6, 3.4, sx * 0.5, 0, 7), ctx2.fillStyle = st.knot, ctx2.fill(), ctx2.stroke();
  if (ctx2.beginPath(), ctx2.arc(0, -11.5 - lift, 2.2, 0, 7), ctx2.fillStyle = st.knot, ctx2.fill(), ctx2.stroke(), ctx2.beginPath(), ctx2.ellipse(-7, -0.5, 2.6, 1, -0.3, 0, 7), ctx2.fillStyle = "rgba(255,255,255,0.8)", ctx2.fill(), reached || (ctx2.font = `bold 12px ${FONT}`, ctx2.textAlign = "center", ctx2.textBaseline = "middle", ctx2.lineWidth = 2, ctx2.strokeStyle = INK, ctx2.strokeText("?", 7.5, 9.5), ctx2.fillStyle = "#ffffff", ctx2.fillText("?", 7.5, 9.5)), ctx2.restore(), tier >= 2) for (let k = 0; k < (tier === 3 ? 4 : 2); k++) {
    let a = t * 1.6 + k * (Math.PI * 2 / (tier === 3 ? 4 : 2));
    starShape(ctx2, x + Math.cos(a) * 20 * s, y + bob + Math.sin(a) * 13 * s, (tier === 3 ? 3.4 : 2.4) * (0.75 + 0.25 * Math.sin(t * 5 + k)), "#fff7a8", 1);
  }
}
var NODE_COLS = ["#ffc38a", "#ffb3c1", "#b9e89a", "#9fd6ff", "#c9b6f2", "#ffd27a", "#ff9e9e", "#a8e6e0", "#f7b6e8", "#d7b8ff"], W5_NODE_COLS = ["#a9d8de", "#8fcbd5", "#b9e2e6", "#9ecfd6", "#c4e8ec"], W6_NODE_COLS = ["#f0c078", "#e8a33d", "#f6d49a", "#eab25a", "#f9dfae"], NODE_ORN = ["leaf", "crumb", "bubble", "wing", "shield", "cloud", "cone", "mask", "dots", "crown"];
function miniCrown(ctx2, x, y, s, fill = "#ffe36e") {
  ctx2.save(), ctx2.translate(x, y), ctx2.scale(s, s), ctx2.beginPath(), ctx2.moveTo(-7, 3), ctx2.lineTo(-8, -5), ctx2.lineTo(-3.5, -1), ctx2.lineTo(0, -7), ctx2.lineTo(3.5, -1), ctx2.lineTo(8, -5), ctx2.lineTo(7, 3), ctx2.closePath(), ctx2.fillStyle = fill, ctx2.fill(), ctx2.lineWidth = 1.8, ctx2.strokeStyle = INK, ctx2.lineJoin = "round", ctx2.stroke(), ctx2.beginPath(), ctx2.arc(0, -0.5, 1.4, 0, 7), ctx2.fillStyle = "#ff6f91", ctx2.fill(), ctx2.restore();
}
function nodeOrnament(ctx2, kind, x, y, t) {
  switch (ctx2.save(), ctx2.translate(x, y), ctx2.lineWidth = 1.6, ctx2.strokeStyle = INK, ctx2.lineJoin = "round", kind) {
    case "leaf":
      ctx2.rotate(-0.5), ctx2.beginPath(), ctx2.ellipse(0, 0, 6, 3.2, 0, 0, 7), ctx2.fillStyle = "#8fdc7a", ctx2.fill(), ctx2.stroke(), ctx2.beginPath(), ctx2.moveTo(-5, 0), ctx2.lineTo(5, 0), ctx2.stroke();
      break;
    case "crumb":
      blob(ctx2, 0, 0, 5, 4, "#e8b878", 1.6), ctx2.fillStyle = "#8a5a3a", ctx2.beginPath(), ctx2.arc(-1.5, -0.5, 1, 0, 7), ctx2.arc(2, 1, 0.8, 0, 7), ctx2.fill();
      break;
    case "bubble":
      for (let [bx, by, r] of [[-3, 1, 3.4], [3, -2, 2.6], [4, 3, 1.6]])
        ctx2.beginPath(), ctx2.arc(bx, by + Math.sin(t * 2 + bx) * 0.8, r, 0, 7), ctx2.fillStyle = "#c9f5b8", ctx2.fill(), ctx2.stroke();
      break;
    case "wing":
      for (let sx of [-1, 1])
        ctx2.beginPath(), ctx2.ellipse(sx * 4, 0, 5, 2.8, sx * -0.5 + Math.sin(t * 8) * 0.15 * sx, 0, 7), ctx2.fillStyle = "rgba(225,245,255,0.95)", ctx2.fill(), ctx2.strokeStyle = "#6f9cc2", ctx2.stroke();
      break;
    case "shield":
      ctx2.beginPath(), ctx2.moveTo(0, -5), ctx2.lineTo(5, -3), ctx2.quadraticCurveTo(5, 3, 0, 6), ctx2.quadraticCurveTo(-5, 3, -5, -3), ctx2.closePath(), ctx2.fillStyle = "#dfe4ef", ctx2.fill(), ctx2.stroke();
      break;
    case "cloud":
      for (let [bx, by, r] of [[-4, 1, 3.2], [0, -1.5, 4], [4, 1, 3.2]])
        ctx2.beginPath(), ctx2.arc(bx, by, r, 0, 7), ctx2.fillStyle = "#ffffff", ctx2.fill();
      ctx2.beginPath(), ctx2.ellipse(0, 0.5, 8, 4.5, 0, 0, 7), ctx2.strokeStyle = "rgba(82,60,75,0.5)", ctx2.stroke();
      break;
    case "cone":
      ctx2.beginPath(), ctx2.moveTo(-4.5, 4), ctx2.lineTo(0, -6), ctx2.lineTo(4.5, 4), ctx2.closePath(), ctx2.fillStyle = "#ffa25e", ctx2.fill(), ctx2.stroke(), ctx2.fillStyle = "#fff", ctx2.fillRect(-2.4, -1, 4.8, 1.8);
      break;
    case "mask":
      blob(ctx2, 0, 0, 6, 4, "#a7afbb", 1.6);
      for (let sx of [-2.5, 2.5])
        ctx2.beginPath(), ctx2.arc(sx, -0.5, 1.6, 0, 7), ctx2.fillStyle = "#d9f3ff", ctx2.fill(), ctx2.stroke();
      break;
    case "dots":
      for (let k = 0; k < 5; k++) {
        let a = k * 1.256 + t;
        blob(ctx2, Math.cos(a) * 4.5, Math.sin(a) * 2.6, 1.6, 1.6, "#f2a65f", 1.1);
      }
      break;
    case "crown":
      miniCrown(ctx2, 0, 0, 1.05);
      break;
    case "pancake":
      for (let [py, c] of [[2.6, "#e8a33d"], [0, "#f3c98b"], [-2.6, "#f3c98b"]])
        ctx2.beginPath(), ctx2.ellipse(0, py, 5.6, 2.6, 0, 0, 7), ctx2.fillStyle = c, ctx2.fill(), ctx2.stroke();
      rr(ctx2, -1.8, -4.4, 3.6, 2.4, 0.8), ctx2.fillStyle = "#fff2b8", ctx2.fill();
      break;
    // v0.8.2 PP8
    case "donut":
      ctx2.beginPath(), ctx2.arc(0, 0, 5.4, 0, 7), ctx2.fillStyle = "#f7b6c8", ctx2.fill(), ctx2.stroke(), ctx2.beginPath(), ctx2.arc(0, 0, 1.7, 0, 7), ctx2.fillStyle = "#8a5a3a", ctx2.fill();
      for (let [dx, dy, c] of [[-3, -2.4, "#ffe27a"], [3, -2, "#8fd0f7"], [0, 3.6, "#ffffff"]])
        ctx2.fillStyle = c, ctx2.fillRect(dx - 1.1, dy - 0.5, 2.2, 1);
      break;
  }
  ctx2.restore();
}
function mapNode(ctx2, x, y, i, st, t = 0) {
  let w5 = ART81 && worldOf(i) === 5, w6 = ART81 && worldOf(i) === 6, base = st.open ? w6 ? W6_NODE_COLS[i % W6_NODE_COLS.length] : w5 ? W5_NODE_COLS[i % W5_NODE_COLS.length] : NODE_COLS[i % NODE_COLS.length] : "#cfc6cf", R = st.boss ? 29 : 27, depth = 7;
  if (ctx2.save(), shadow(ctx2, x, y + 26, 30, 7, 0.28), st.next && (ctx2.beginPath(), ctx2.ellipse(x, y + 3, R + 7 + Math.sin(t * 4) * 2, R * 0.92 + 6, 0, 0, 7), ctx2.fillStyle = "rgba(255,212,94,0.35)", ctx2.fill()), ctx2.beginPath(), ctx2.ellipse(x, y + depth, R, R * 0.9, 0, 0, Math.PI), ctx2.lineTo(x - R, y), ctx2.ellipse(x, y, R, R * 0.9, 0, Math.PI, 0, !0), ctx2.closePath(), ctx2.fillStyle = shade(base, -0.3), ctx2.fill(), ctx2.lineWidth = 3, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), st.boss) {
    for (let k = 0; k <= 10; k++) {
      let a = Math.PI + k / 10 * Math.PI, rr2 = k % 2 ? R * 0.82 : R;
      k === 0 ? ctx2.moveTo(x + Math.cos(a) * R, y + Math.sin(a) * R * 0.9) : ctx2.lineTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2 * 0.9 - (k % 2 ? 0 : 3));
    }
    ctx2.ellipse(x, y, R, R * 0.9, 0, 0, Math.PI);
  } else ctx2.ellipse(x, y, R, R * 0.9, 0, 0, 7);
  let g = ctx2.createRadialGradient(x - R * 0.35, y - R * 0.4, 2, x, y, R * 1.1);
  g.addColorStop(0, shade(base, 0.55)), g.addColorStop(0.6, base), g.addColorStop(1, shade(base, -0.12)), ctx2.fillStyle = g, ctx2.fill(), ctx2.lineWidth = 3, ctx2.strokeStyle = st.cleared ? "#e0a830" : INK, ctx2.stroke(), st.cleared && (ctx2.beginPath(), ctx2.ellipse(x, y, R - 2.5, R * 0.9 - 2.5, 0, 0, 7), ctx2.lineWidth = 2, ctx2.strokeStyle = "#ffe9a0", ctx2.stroke()), ctx2.beginPath(), ctx2.ellipse(x, y + 1, R * 0.66, R * 0.6, 0, 0, 7), ctx2.lineWidth = 2, ctx2.strokeStyle = w6 && st.open ? "rgba(201,119,43,0.95)" : w5 && st.open ? "rgba(247,182,200,0.95)" : `rgba(255,255,255,${st.open ? 0.55 : 0.3})`, ctx2.stroke(), ctx2.beginPath(), ctx2.ellipse(x - R * 0.38, y - R * 0.5, R * 0.36, R * 0.16, -0.4, 0, 7), ctx2.fillStyle = "rgba(255,255,255,0.6)", ctx2.fill(), st.open ? (drawChunkyText(ctx2, String(i + 1), x, y + 1, 25, { mode: "num" }), nodeOrnament(ctx2, w6 ? st.boss ? "crown" : "pancake" : w5 ? st.boss ? "crown" : "donut" : NODE_ORN[i % NODE_ORN.length], x + R * 0.72, y - R * 0.72, t), st.stars >= 3 && !st.boss && miniCrown(ctx2, x, y - R - 3, 1.1)) : (rr(ctx2, x - 8, y - 3, 16, 13, 3), ctx2.fillStyle = "#8c8090", ctx2.fill(), ctx2.beginPath(), ctx2.arc(x, y - 4, 5.5, Math.PI, 0), ctx2.lineWidth = 3, ctx2.strokeStyle = "#8c8090", ctx2.stroke()), ctx2.restore();
}
function starShape(ctx2, x, y, r, fill, lw = 2) {
  candyStar(ctx2, x, y, r, fill, lw);
}
var ANT_COL = { small: "#f8c07e", worker: "#f0994d", big: "#d97a3f", gasmask: "#f0994d", armored: "#e48a47", flyer: "#f9b878", queen: "#f59b9b", queen2: "#c7a6f5", sprinter: "#f0994d", heavy: "#b95b34", greasy: "#ee9f45", mama: "#d9774a", queen3: "#e9b05c", nurse: "#f2b49b", queen4: "#f4b9c8", glazed: "#f1cf9a", queen5: "#e8789c", drone: "#e8a33d", queen6: "#c9772b" }, ALW = 2.4;
function softBlob(ctx2, x, y, rx, ry, col, lw = ALW, gloss = 1) {
  drawGlossyBlob(ctx2, x, y, rx, ry, col, { lw, gloss });
}
function glossyEye(ctx2, x, y, rx, ry, blink, mood = "", side = 1) {
  if (mood === "hurt") {
    ctx2.beginPath(), ctx2.moveTo(x - rx * 0.9 * side, y - ry * 0.55), ctx2.lineTo(x + rx * 0.7 * side, y), ctx2.lineTo(x - rx * 0.9 * side, y + ry * 0.55), ctx2.lineWidth = 2.1, ctx2.strokeStyle = INK, ctx2.stroke();
    return;
  }
  if (mood === "dizzy") {
    ctx2.beginPath();
    for (let k = 0; k <= 18; k++) {
      let a = k / 18 * Math.PI * 4, q = k / 18 * rx * 1.05;
      ctx2.lineTo(x + Math.cos(a) * q, y + Math.sin(a) * q);
    }
    ctx2.lineWidth = 1.5, ctx2.strokeStyle = INK, ctx2.stroke();
    return;
  }
  if (mood === "cheer") {
    ctx2.beginPath(), ctx2.moveTo(x - rx, y + ry * 0.25), ctx2.quadraticCurveTo(x, y - ry * 0.95, x + rx, y + ry * 0.25), ctx2.lineWidth = 2.3, ctx2.strokeStyle = INK, ctx2.stroke();
    return;
  }
  if (blink) {
    ctx2.beginPath(), ctx2.moveTo(x - rx, y + 0.5), ctx2.quadraticCurveTo(x, y + ry * 0.9, x + rx, y + 0.5), ctx2.lineWidth = 1.9, ctx2.strokeStyle = INK, ctx2.stroke();
    return;
  }
  ctx2.beginPath(), ctx2.ellipse(x, y, rx, ry, 0, 0, 7);
  let g = ctx2.createLinearGradient(0, y - ry, 0, y + ry);
  g.addColorStop(0, "#24151f"), g.addColorStop(0.65, "#3b2533"), g.addColorStop(1, "#7a4f62"), ctx2.fillStyle = g, ctx2.fill(), ctx2.beginPath(), ctx2.ellipse(x - rx * 0.26, y - ry * 0.36, rx * 0.48, ry * 0.3, -0.3, 0, 7), ctx2.fillStyle = "#ffffff", ctx2.fill(), ctx2.beginPath(), ctx2.arc(x + rx * 0.4, y + ry * 0.42, rx * 0.22, 0, 7), ctx2.fillStyle = "rgba(255,255,255,0.92)", ctx2.fill();
}
function cheek(ctx2, x, y, r = 2.8) {
  ctx2.beginPath(), ctx2.ellipse(x, y, r, r * 0.66, 0, 0, 7), ctx2.fillStyle = "rgba(255,100,130,0.6)", ctx2.fill();
}
function leg(ctx2, x0, y0, x1, y1, col) {
  ctx2.lineCap = "round", ctx2.beginPath(), ctx2.moveTo(x0, y0), ctx2.quadraticCurveTo((x0 + x1) / 2 + 0.6, (y0 + y1) / 2 + 0.6, x1, y1), ctx2.lineWidth = 5.6, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.lineWidth = 3.4, ctx2.strokeStyle = col, ctx2.stroke(), ctx2.beginPath(), ctx2.ellipse(x1 + 0.7, y1 + 0.5, 2.7, 1.9, 0, 0, 7), ctx2.fillStyle = col, ctx2.fill(), ctx2.lineWidth = 1.7, ctx2.strokeStyle = INK, ctx2.stroke();
}
function sneaker(ctx2, x, y, far) {
  ctx2.beginPath(), ctx2.ellipse(x + 1, y + 0.6, 2.8, 1.7, 0, 0, 7), ctx2.fillStyle = far ? "#e6e6ee" : "#ffffff", ctx2.fill(), ctx2.lineWidth = 1.3, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.moveTo(x - 0.8, y + 0.4), ctx2.lineTo(x + 2.4, y + 0.1), ctx2.lineWidth = 1.1, ctx2.strokeStyle = "#ff5a6e", ctx2.stroke();
}
var ANT_LOOK = { small_gasmask: "gasmask", small_armed: "armored", small_fly: "flyer" };
function plusShape(ctx2, x, y, s, fill, lw = 1.5) {
  let a = s * 0.31, t = s;
  ctx2.beginPath(), ctx2.moveTo(x - a, y - t), ctx2.lineTo(x + a, y - t), ctx2.lineTo(x + a, y - a), ctx2.lineTo(x + t, y - a), ctx2.lineTo(x + t, y + a), ctx2.lineTo(x + a, y + a), ctx2.lineTo(x + a, y + t), ctx2.lineTo(x - a, y + t), ctx2.lineTo(x - a, y + a), ctx2.lineTo(x - t, y + a), ctx2.lineTo(x - t, y - a), ctx2.lineTo(x - a, y - a), ctx2.closePath(), ctx2.fillStyle = fill, ctx2.fill(), lw > 0 && (ctx2.lineWidth = lw, ctx2.strokeStyle = INK, ctx2.stroke());
}
function drawAnt(ctx2, type, phase = 0, opt = {}) {
  let S2 = ANTS[type].size, LW = Math.min(3, Math.max(1.8, 2.2 * S2)) / S2;
  type = ANT_LOOK[type] || type;
  let col = ANT_COL[type], legCol = shade(col, -0.18), farCol = shade(col, -0.32), P = phase * Math.PI * 2, step = Math.sin(P), hop = Math.abs(Math.sin(P)), drone = type === "drone", syrupQueen = type === "queen6", flying = type === "flyer" || drone, queen = type === "queen" || type === "queen2" || type === "queen3" || type === "queen4" || type === "queen5" || syrupQueen, swiftQueen = type === "queen2", mama = type === "mama", greasy = type === "greasy", pieQueen = type === "queen3", nurse = type === "nurse", sundaeQueen = type === "queen4", glazed = type === "glazed", glazeQueen = type === "queen5", big = type === "big" || type === "heavy" || mama, shell = type === "armored" || type === "heavy" || type === "sprinter", sprinter = type === "sprinter", heavy = type === "heavy", cheer = opt.pose === "cheer";
  ctx2.save(), ctx2.scale(S2, S2), ctx2.lineJoin = "round", ctx2.lineCap = "round", drone && ctx2.scale(1.15, 1.15), ART81 ? flying ? shadow(ctx2, 0, 24, 11 * (1 - 0.1 * hop), 3.3 * (1 - 0.1 * hop), 0.15) : shadow(ctx2, 0, 10.5, 15 - hop * 2, 4, 0.22) : flying ? shadow(ctx2, 0, 21, 10, 3, 0.13) : shadow(ctx2, 0, 10.5, 15 - hop * 2, 4, 0.2);
  let lift = flying ? 9 + Math.sin(P * 2) * 2 : big ? hop * 1.8 : hop * 3.2;
  if (big && !flying && (ctx2.translate(0, 10), ctx2.rotate(Math.sin(P) * 0.06), ctx2.translate(0, -10), hop < 0.18)) {
    ctx2.save(), ctx2.globalAlpha = (0.18 - hop) * 3;
    for (let fx0 of [-12, 6])
      ctx2.beginPath(), ctx2.ellipse(fx0 + (Math.sin(P) > 0 ? 0 : 4), 11, 3.5, 1.4, 0, 0, 7), ctx2.fillStyle = "#efe1c8", ctx2.fill();
    ctx2.restore();
  }
  if (sprinter || swiftQueen) {
    ctx2.save(), ctx2.lineCap = "round";
    for (let k = 0; k < 3; k++) {
      let ph = (phase * 3 + k * 0.33) % 1;
      ctx2.globalAlpha = 0.65 * (1 - ph), ctx2.beginPath(), ctx2.moveTo(-22 - ph * 6, -6 + k * 5), ctx2.lineTo(-30 - ph * 10, -6 + k * 5), ctx2.lineWidth = 2, ctx2.strokeStyle = "#8fcfff", ctx2.stroke();
    }
    ctx2.restore();
  }
  if (ctx2.translate(0, -lift), !flying) {
    let sq = 1 + (0.5 - hop) * 0.09;
    ctx2.translate(0, 10), ctx2.scale(1 / sq, sq), ctx2.translate(0, -10);
  }
  if (glazed && ART81 && (ctx2.beginPath(), ctx2.ellipse(1, -1, 20.5, 19, 0, 0, 7), ctx2.lineWidth = 5, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.ellipse(1, -1, 20.5, 19, 0, 0, 7), ctx2.lineWidth = 2.4, ctx2.strokeStyle = "#9fe7ff", ctx2.stroke()), flying) {
    let flap = Math.sin(P * 8);
    for (let k of [1, 0])
      ctx2.save(), ctx2.translate(-2, -4), ctx2.rotate(-2 - flap * 0.45 - k * 0.5), ctx2.beginPath(), ctx2.ellipse(11, 0, 12.5, 6.5, 0, 0, 7), ctx2.fillStyle = k ? "rgba(205,236,255,0.8)" : "rgba(232,247,255,0.92)", ctx2.fill(), ctx2.lineWidth = 2, ctx2.strokeStyle = "#6f9cc2", ctx2.stroke(), ctx2.beginPath(), ctx2.ellipse(13, -1.5, 5, 1.6, 0, 0, 7), ctx2.fillStyle = "rgba(255,255,255,0.8)", ctx2.fill(), ctx2.restore();
    if (drone) for (let k of [1, 0])
      ctx2.save(), ctx2.translate(-5, -1), ctx2.rotate(-0.55 + flap * 0.4 - k * 0.55), ctx2.beginPath(), ctx2.ellipse(8.5, 0, 9.5, 4.8, 0, 0, 7), ctx2.fillStyle = k ? "rgba(255,238,200,0.78)" : "rgba(255,246,222,0.92)", ctx2.fill(), ctx2.lineWidth = 2, ctx2.strokeStyle = "#b07a3a", ctx2.stroke(), ctx2.restore();
  }
  if (queen) {
    let sw = Math.sin(P) * 1.5;
    ctx2.beginPath(), ctx2.moveTo(3, -8), ctx2.quadraticCurveTo(-14, -12 + sw, -24, 7), ctx2.quadraticCurveTo(-11, 11, 2, 5), ctx2.closePath();
    let g = ctx2.createLinearGradient(0, -10, 0, 10);
    g.addColorStop(0, syrupQueen ? "#f3b868" : glazeQueen ? "#9fe3e6" : sundaeQueen ? "#8fe0c8" : pieQueen ? "#7f9be6" : "#b597f0"), g.addColorStop(1, syrupQueen ? "#a85f1c" : glazeQueen ? "#4fb3bd" : sundaeQueen ? "#3fa88f" : pieQueen ? "#4f69b8" : "#8a68d8"), ctx2.fillStyle = g, ctx2.fill(), ctx2.lineWidth = LW, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.moveTo(-22, 6.5), ctx2.quadraticCurveTo(-10, 10, 1.5, 4.5), ctx2.lineWidth = 3.4, ctx2.strokeStyle = "#ffffff", ctx2.stroke(), ctx2.fillStyle = INK;
    for (let [a, b] of [[-17, 6.8], [-10, 8], [-4, 6.6]])
      ctx2.beginPath(), ctx2.arc(a, b, 0.9, 0, 7), ctx2.fill();
  }
  let legY = 4.2, footY = flying ? 8.2 : 10.4;
  for (let i = 0; i < 3; i++) {
    let sw = (i % 2 ? -1 : 1) * step * 2;
    leg(ctx2, -8 + i * 4.8, legY, -7 + i * 4.8 - sw, footY - 0.5, farCol), sprinter && sneaker(ctx2, -7 + i * 4.8 - sw, footY - 0.5, !0);
  }
  let abRx = queen ? 13 : big ? 12 : 11, abRy = queen ? 11 : big ? 10 : 9.5;
  softBlob(ctx2, -10, 0.5, abRx, abRy, col, LW, 0.85), ctx2.save(), ctx2.beginPath(), ctx2.ellipse(-10, 0.5, abRx - 1, abRy - 1, 0, 0, 7), ctx2.clip(), ctx2.strokeStyle = drone ? INK : shade(col, -0.14), ctx2.lineWidth = drone ? 3.6 : 2;
  for (let sx of [-15, -10.5])
    ctx2.beginPath(), ctx2.ellipse(sx - (big ? 1.5 : 0), 0.5, 2, abRy + 2, 0, -1.3, 1.3), ctx2.stroke();
  if (syrupQueen && (ctx2.beginPath(), ctx2.moveTo(-20.5, -5.2), ctx2.quadraticCurveTo(-11, -9.6, -1.5, -6.4), ctx2.lineWidth = 3, ctx2.strokeStyle = "rgba(255,248,224,0.72)", ctx2.stroke()), ctx2.restore(), mama)
    for (let [ex, ey2, er] of [[-16.5, -2.2, 2.9], [-10.5, -4.6, 3.1], [-5.2, -1.4, 2.7]])
      ctx2.beginPath(), ctx2.ellipse(ex, ey2, er, er * 1.2, 0.2, 0, 7), ctx2.fillStyle = "#fffaf0", ctx2.fill(), ctx2.lineWidth = 1.7, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.arc(ex - 0.7, ey2 - 0.8, 0.8, 0, 7), ctx2.fillStyle = "#f2a0b0", ctx2.fill();
  if (shell) {
    ctx2.save(), ctx2.beginPath(), ctx2.ellipse(-10, 0, abRx + 1.2, abRy + 0.8, 0, Math.PI * 1.02, Math.PI * 1.98), ctx2.quadraticCurveTo(-10, 3, -10 - abRx - 1, 0), ctx2.closePath();
    let g = ctx2.createLinearGradient(0, -9, 0, 2);
    g.addColorStop(0, "#ffffff"), g.addColorStop(1, heavy ? "#9aa3ba" : sprinter ? "#bfe3ff" : "#b4bdd0"), ctx2.fillStyle = g, ctx2.fill(), ctx2.lineWidth = 2.4, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.fillStyle = heavy ? "#f4b632" : "#8992aa";
    for (let rx of [-16, -10, -4])
      ctx2.beginPath(), ctx2.arc(rx, -3, 1.1, 0, 7), ctx2.fill();
    heavy && (ctx2.beginPath(), ctx2.ellipse(-10, -2.5, abRx * 0.8, 1.4, 0, Math.PI * 1.1, Math.PI * 1.9), ctx2.lineWidth = 1.6, ctx2.strokeStyle = "#f4b632", ctx2.stroke()), ctx2.restore();
  }
  softBlob(ctx2, -1, 1.5, 6.5, 6, col, LW, 0), opt.carrying && crumbIcon(ctx2, -10.5, -12.5, 1.4, !0);
  for (let i = 0; i < 3; i++) {
    let sw = (i % 2 ? 1 : -1) * step * 2.2;
    cheer && i === 2 || (leg(ctx2, -6 + i * 4.8, legY + 1.2, -5 + i * 4.8 + sw, footY + 0.5, legCol), sprinter && sneaker(ctx2, -5 + i * 4.8 + sw, footY + 0.5, !1));
  }
  if (cheer) {
    let wv = Math.sin(P * 2) * 1.6;
    for (let [sx0, sy0, mx, my, c0] of [[-3, 0, -9 + wv, -25, farCol], [3, 0, 27 - wv, -20, legCol]])
      ctx2.beginPath(), ctx2.moveTo(sx0, sy0), ctx2.quadraticCurveTo((sx0 + mx) / 2 + (mx > 0 ? 8 : -5), (sy0 + my) / 2 + 2, mx, my), ctx2.lineWidth = 6.4, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.lineWidth = 4, ctx2.strokeStyle = c0, ctx2.stroke(), ctx2.save(), ctx2.translate(-0.7, -0.9), ctx2.lineWidth = 1.5, ctx2.strokeStyle = shade(c0, 0.38), ctx2.globalAlpha = 0.85, ctx2.stroke(), ctx2.restore(), blob(ctx2, mx, my, 3.4, 3.2, c0, 1.8, 0, { gloss: 0.6 });
  }
  sprinter && (ctx2.save(), ctx2.beginPath(), ctx2.ellipse(-1, 1.5, 6.5, 6, 0, 0, 7), ctx2.clip(), ctx2.fillStyle = "#4fb4ff", ctx2.fillRect(-7, -4, 12, 12), ctx2.fillStyle = "#ffffff", ctx2.fillRect(-7, -0.6, 12, 1.6), ctx2.restore(), ctx2.beginPath(), ctx2.ellipse(-1, 1.5, 6.5, 6, 0, 0, 7), ctx2.lineWidth = LW, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.font = `bold 5px ${FONT}`, ctx2.textAlign = "center", ctx2.textBaseline = "middle", ctx2.fillStyle = "#ffffff", ctx2.fillText("7", -1, 4.2));
  let hr = 12.5, hx2 = 8, hy = -10, bob = Math.sin(P * 2 + 0.6) * 1.4;
  if (type !== "armored" && type !== "heavy" && type !== "small")
    for (let k of [0, 1]) {
      let bx0 = hx2 - 3 + k * 6, by0 = hy - hr + 3, tx0 = hx2 - 4.5 + k * 10 + bob * (k ? 1 : -0.6), ty0 = hy - hr - 4.5 + k * 0.5 - Math.abs(bob) * 0.5, tx = bx0 + (tx0 - bx0) * 1.2, ty = by0 + (ty0 - by0) * 1.2;
      ctx2.beginPath(), ctx2.moveTo(bx0, by0), ctx2.quadraticCurveTo(bx0 + (k ? 3 : -2), ty + 3, tx, ty), ctx2.lineWidth = 3.2, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.lineWidth = 1.5, ctx2.strokeStyle = legCol, ctx2.stroke(), blob(ctx2, tx, ty, 2, 2, shade(col, 0.25), 1.5, 0, { gloss: 0.6 });
    }
  softBlob(ctx2, hx2, hy, hr, hr * 0.92, col, LW);
  let e1x = hx2 + 0.2, e2x = hx2 + 8.6, ey = hy + 1.6, blink = opt.blink, mood = opt.mood || (cheer ? "cheer" : "");
  if (type === "gasmask") {
    ctx2.beginPath(), ctx2.moveTo(hx2 - hr + 1, hy - 3), ctx2.quadraticCurveTo(hx2 - 2, hy - 6, e1x, ey - 1), ctx2.lineWidth = 3, ctx2.strokeStyle = "#6f6a7c", ctx2.stroke();
    for (let [ex, r] of [[e1x, 4.6], [e2x, 4.1]])
      ctx2.beginPath(), ctx2.arc(ex, ey - 0.3, r, 0, 7), ctx2.fillStyle = "#d9f3ff", ctx2.fill(), ctx2.lineWidth = 2.6, ctx2.strokeStyle = "#5d5a6b", ctx2.stroke(), glossyEye(ctx2, ex + 0.3, ey - 0.2, r * 0.55, r * 0.68, blink), ctx2.beginPath(), ctx2.arc(ex - r * 0.35, ey - r * 0.45, r * 0.22, 0, 7), ctx2.fillStyle = "rgba(255,255,255,0.8)", ctx2.fill();
    blob(ctx2, hx2 + 5, hy + 7.4, 5.2, 3.8, "#a7afbb", 2.4), ctx2.fillStyle = "#7d8592";
    for (let dx of [-1.8, 0.4, 2.6])
      ctx2.beginPath(), ctx2.arc(hx2 + 5 + dx, hy + 7.6, 0.8, 0, 7), ctx2.fill();
    blob(ctx2, hx2 + 10.5, hy + 9.2, 2.8, 3.1, "#7fd3ad", 2.2);
  } else {
    if (glossyEye(ctx2, e1x, ey, 3.3, 4.6, blink, mood, -1), glossyEye(ctx2, e2x, ey - 0.3, 3, 4.3, blink, mood, 1), cheek(ctx2, hx2 - 4.2, hy + 7), cheek(ctx2, hx2 + 12.2, hy + 6.6, 2.4), opt.carrying && !mood)
      for (let [bx, k] of [[e1x, -1], [e2x, 1]])
        ctx2.beginPath(), ctx2.moveTo(bx - 3.2 * k, ey - 6.9 + 0.3), ctx2.lineTo(bx + 3 * k, ey - 6.4 - 0.9), ctx2.lineWidth = 1.8, ctx2.strokeStyle = INK, ctx2.stroke();
    if (big && !mama)
      ctx2.beginPath(), ctx2.moveTo(hx2 + 1, hy + 6.2), ctx2.quadraticCurveTo(hx2 + 4, hy + 3.6, hx2 + 4.2, hy + 5.4), ctx2.quadraticCurveTo(hx2 + 4.6, hy + 3.6, hx2 + 8, hy + 6.2), ctx2.quadraticCurveTo(hx2 + 4.4, hy + 8, hx2 + 1, hy + 6.2), ctx2.fillStyle = "#8a4b33", ctx2.fill(), ctx2.lineWidth = 1.3, ctx2.strokeStyle = INK, ctx2.stroke();
    else {
      if (cheer || mood === "hurt") {
        let w = cheer ? 4.6 : 2.2;
        ctx2.beginPath(), cheer ? (ctx2.moveTo(hx2 + 4.4 - w, hy + 6.6), ctx2.quadraticCurveTo(hx2 + 4.4, hy + 7.4, hx2 + 4.4 + w, hy + 6.6), ctx2.quadraticCurveTo(hx2 + 4.4 + w * 0.6, hy + 12.6, hx2 + 4.4, hy + 12.6), ctx2.quadraticCurveTo(hx2 + 4.4 - w * 0.6, hy + 12.6, hx2 + 4.4 - w, hy + 6.6)) : ctx2.ellipse(hx2 + 4.4, hy + 8.4, 2.1, 2.6, 0, 0, 7), ctx2.fillStyle = "#7a3040", ctx2.fill(), ctx2.lineWidth = 1.7, ctx2.strokeStyle = INK, ctx2.stroke(), cheer && (ctx2.beginPath(), ctx2.ellipse(hx2 + 4.4, hy + 11, 2.4, 1.3, 0, 0, 7), ctx2.fillStyle = "#ff8fa0", ctx2.fill());
      } else if (mood === "dizzy") {
        ctx2.beginPath(), ctx2.moveTo(hx2 + 1.4, hy + 7.4);
        for (let k = 1; k <= 4; k++) ctx2.lineTo(hx2 + 1.4 + k * 1.9, hy + 7.4 + (k % 2 ? 1.4 : -0.4));
        ctx2.lineWidth = 1.8, ctx2.strokeStyle = INK, ctx2.stroke();
      } else
        ctx2.beginPath(), ctx2.moveTo(hx2 + 2.4, hy + 7.4), ctx2.quadraticCurveTo(hx2 + 4.4, hy + 10.4, hx2 + 6.4, hy + 7.4), ctx2.lineWidth = 1.9, ctx2.strokeStyle = INK, ctx2.stroke();
      queen && !cheer && (ctx2.beginPath(), ctx2.ellipse(hx2 + 4.4, hy + 8.6, 1.6, 0.9, 0, 0, 7), ctx2.fillStyle = "#ff6f91", ctx2.fill());
    }
    if (queen) {
      ctx2.lineWidth = 1.5, ctx2.strokeStyle = INK;
      for (let [ex, k] of [[e1x - 2.4, 0], [e1x - 1, 1], [e2x + 1.8, 2]])
        ctx2.beginPath(), ctx2.moveTo(ex, ey - 3), ctx2.lineTo(ex + (k === 2 ? 1.6 : -1.2), ey - 5.2), ctx2.stroke();
    }
  }
  let top = hy - hr;
  if (type === "worker") {
    ctx2.beginPath(), ctx2.ellipse(hx2, hy - 3.6, hr * 0.98, hr * 0.78, 0, Math.PI, 0), ctx2.closePath();
    let g = ctx2.createLinearGradient(0, top - 1, 0, hy - 3);
    g.addColorStop(0, "#fff3a3"), g.addColorStop(1, "#f6c33a"), ctx2.fillStyle = g, ctx2.fill(), ctx2.lineWidth = 2.5, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.moveTo(hx2 - 1, top + 0.5), ctx2.quadraticCurveTo(hx2, hy - 7, hx2 - 0.5, hy - 3.8), ctx2.lineWidth = 2.2, ctx2.strokeStyle = "#e2a521", ctx2.stroke(), rr(ctx2, hx2 - hr - 1.5, hy - 5.2, hr * 2 + 5, 3.6, 1.8), ctx2.fillStyle = "#f6c33a", ctx2.fill(), ctx2.lineWidth = 2.2, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.ellipse(hx2 - 4, top + 3.5, 2.5, 1.3, -0.5, 0, 7), ctx2.fillStyle = "rgba(255,255,255,0.7)", ctx2.fill();
  } else if (type === "small") {
    ctx2.beginPath(), ctx2.ellipse(hx2 - 0.5, hy - 4.2, hr * 0.92, hr * 0.7, 0, Math.PI, 0), ctx2.closePath(), ctx2.fillStyle = "#8fd0f7", ctx2.fill(), ctx2.lineWidth = 2.4, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.save(), ctx2.beginPath(), ctx2.ellipse(hx2 - 0.5, hy - 4.2, hr * 0.92, hr * 0.7, 0, Math.PI, 0), ctx2.clip(), ctx2.fillStyle = "#ff9fb8", ctx2.fillRect(hx2 - 4, top - 4, 3.2, 14), ctx2.fillStyle = "#ffe27a", ctx2.fillRect(hx2 + 3, top - 4, 3.2, 14), ctx2.restore(), ctx2.beginPath(), ctx2.ellipse(hx2 - 0.5, hy - 4.2, hr * 0.92, hr * 0.7, 0, Math.PI, 0), ctx2.lineWidth = 2.4, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.moveTo(hx2 - 0.5, top + 1.5), ctx2.lineTo(hx2 - 0.5, top - 3), ctx2.lineWidth = 2, ctx2.stroke();
    let sp = Math.cos(P * 3);
    ctx2.beginPath(), ctx2.ellipse(hx2 - 0.5 - 3.6 * sp, top - 3.5, 3.8 * Math.abs(sp) + 0.8, 1.5, 0, 0, 7), ctx2.ellipse(hx2 - 0.5 + 3.6 * sp, top - 3.5, 3.8 * Math.abs(sp) + 0.8, 1.5, 0, 0, 7), ctx2.fillStyle = "#ff7f9e", ctx2.fill(), ctx2.lineWidth = 1.5, ctx2.stroke(), blob(ctx2, hx2 - 0.5, top - 3.5, 1.4, 1.4, "#ffe27a", 1.2);
  } else if (greasy) {
    let ty = top + 1.5;
    ctx2.beginPath(), ctx2.moveTo(hx2 - 6.5, ty), ctx2.lineTo(hx2 + 7.5, ty), ctx2.lineTo(hx2 + 7.5, ty - 6.5), ctx2.lineTo(hx2 - 6.5, ty - 6.5), ctx2.closePath(), ctx2.fillStyle = "#fff3a8", ctx2.fill(), ctx2.lineWidth = 2.2, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.moveTo(hx2 + 7.5, ty - 1), ctx2.quadraticCurveTo(hx2 + 11, ty + 1, hx2 + 9.6, ty + 5 + Math.abs(step) * 0.8), ctx2.quadraticCurveTo(hx2 + 8, ty + 6, hx2 + 7.5, ty + 2.5), ctx2.fillStyle = "#ffe36a", ctx2.fill(), ctx2.lineWidth = 1.8, ctx2.stroke(), ctx2.beginPath(), ctx2.moveTo(hx2 - 4.5, ty - 4.6), ctx2.lineTo(hx2 + 1.5, ty - 4.6), ctx2.lineWidth = 1.6, ctx2.strokeStyle = "#ffffff", ctx2.stroke(), ctx2.fillStyle = "rgba(255,255,255,0.8)";
    for (let [gx, gy, gr] of [[-8, 1, 1.5], [-3, 6, 1.1], [-12, -3, 1]])
      ctx2.beginPath(), ctx2.arc(hx2 + gx + 2, hy + gy, gr, 0, 7), ctx2.fill();
  } else if (mama) {
    ctx2.beginPath(), ctx2.ellipse(hx2, hy - 3.4, hr * 1, hr * 0.8, 0, Math.PI, 0), ctx2.closePath(), ctx2.fillStyle = "#ff8fb0", ctx2.fill(), ctx2.lineWidth = 2.5, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.fillStyle = "#ffffff";
    for (let [dx, dy] of [[-6, -9], [0, -11.5], [6, -9], [-2, -6.2], [4, -5.6]])
      ctx2.beginPath(), ctx2.arc(hx2 + dx, hy + dy + 1, 1.15, 0, 7), ctx2.fill();
    ctx2.beginPath(), ctx2.moveTo(hx2 - hr + 1, hy - 4.5), ctx2.quadraticCurveTo(hx2 - hr - 6, hy - 9, hx2 - hr - 7, hy - 3 + step), ctx2.quadraticCurveTo(hx2 - hr - 3, hy - 4, hx2 - hr + 1, hy - 1.6), ctx2.fillStyle = "#ff8fb0", ctx2.fill(), ctx2.lineWidth = 2, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.ellipse(hx2 - 4, top + 3.2, 2.4, 1.2, -0.4, 0, 7), ctx2.fillStyle = "rgba(255,255,255,0.75)", ctx2.fill();
  } else if (type === "big")
    ctx2.save(), ctx2.beginPath(), ctx2.ellipse(hx2, hy, hr, hr * 0.92, 0, 0, 7), ctx2.clip(), ctx2.fillStyle = "#ff6f91", ctx2.fillRect(hx2 - hr - 1, hy - 7.5, hr * 2 + 2, 4), ctx2.fillStyle = "#ffffff", ctx2.fillRect(hx2 - hr - 1, hy - 6.2, hr * 2 + 2, 1.2), ctx2.restore(), ctx2.beginPath(), ctx2.ellipse(hx2, hy, hr, hr * 0.92, 0, 0, 7), ctx2.lineWidth = LW, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.moveTo(hx2 - hr + 0.5, hy - 5.5), ctx2.quadraticCurveTo(hx2 - hr - 4, hy - 4 + step, hx2 - hr - 5, hy + 0.5), ctx2.lineWidth = 3, ctx2.strokeStyle = "#ff6f91", ctx2.stroke();
  else if (sprinter) {
    ctx2.beginPath(), ctx2.ellipse(hx2, hy - 3.4, hr * 1, hr * 0.8, 0, Math.PI, 0), ctx2.closePath();
    let g = ctx2.createLinearGradient(0, top - 1, 0, hy - 3);
    g.addColorStop(0, "#e6f4ff"), g.addColorStop(1, "#4fb4ff"), ctx2.fillStyle = g, ctx2.fill(), ctx2.lineWidth = 2.4, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.moveTo(hx2 - hr + 1, hy - 6), ctx2.quadraticCurveTo(hx2, top - 0.5, hx2 + hr - 1, hy - 6), ctx2.lineWidth = 2, ctx2.strokeStyle = "#ffffff", ctx2.stroke(), rr(ctx2, hx2 - 2, hy - 5.8, hr + 3, 2.8, 1.4), ctx2.fillStyle = "#ffe27a", ctx2.fill(), ctx2.lineWidth = 1.6, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.ellipse(hx2 - 4, top + 3, 2.4, 1.1, -0.4, 0, 7), ctx2.fillStyle = "rgba(255,255,255,0.85)", ctx2.fill();
  } else if (type === "armored" || heavy) {
    ctx2.beginPath(), ctx2.moveTo(hx2 - hr - 1, hy - 3.5), ctx2.quadraticCurveTo(hx2 - hr - 1.5, top - 2.5, hx2, top - 2.5), ctx2.quadraticCurveTo(hx2 + hr + 1.5, top - 2.5, hx2 + hr + 1, hy - 4.5), ctx2.closePath();
    let g = ctx2.createLinearGradient(0, top - 2, 0, hy - 1);
    if (g.addColorStop(0, "#ffffff"), g.addColorStop(1, heavy ? "#8c96ae" : "#aeb8cc"), ctx2.fillStyle = g, ctx2.fill(), ctx2.lineWidth = 2.6, ctx2.strokeStyle = INK, ctx2.stroke(), rr(ctx2, hx2 - hr - 2, hy - 6.6, hr * 2 + 4, 3.6, 1.8), ctx2.fillStyle = heavy ? "#f4c84a" : "#cfd6e4", ctx2.fill(), ctx2.lineWidth = 2.2, ctx2.stroke(), heavy) for (let sx of [-1, 1])
      ctx2.beginPath(), ctx2.moveTo(hx2 + sx * (hr - 2), top + 2), ctx2.quadraticCurveTo(hx2 + sx * (hr + 4), top - 2, hx2 + sx * (hr + 3), top - 7), ctx2.quadraticCurveTo(hx2 + sx * (hr + 0.5), top - 2, hx2 + sx * (hr - 5), top + 1), ctx2.closePath(), ctx2.fillStyle = "#fff6dc", ctx2.fill(), ctx2.lineWidth = 1.8, ctx2.strokeStyle = INK, ctx2.stroke();
    ctx2.fillStyle = "#8992aa";
    for (let dx of [-6, 0, 6])
      ctx2.beginPath(), ctx2.arc(hx2 + dx, hy - 4.8, 0.9, 0, 7), ctx2.fill();
    ctx2.beginPath(), ctx2.moveTo(hx2 - 2, top - 1.5), ctx2.quadraticCurveTo(hx2 - 5, top - 11, hx2 - 13, top - 8 + step), ctx2.quadraticCurveTo(hx2 - 8, top - 5, hx2 - 6, top), ctx2.quadraticCurveTo(hx2 - 3.5, top - 3, hx2 - 2, top - 1.5), ctx2.fillStyle = heavy ? "#b48cf0" : "#ff7b7b", ctx2.fill(), ctx2.lineWidth = 2, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.ellipse(hx2 - 4, top + 2, 2.6, 1.2, -0.4, 0, 7), ctx2.fillStyle = "rgba(255,255,255,0.8)", ctx2.fill();
  } else if (drone) {
    for (let sx of [-1, 1])
      ctx2.beginPath(), ctx2.moveTo(hx2 + sx * 3, top + 1), ctx2.quadraticCurveTo(hx2 + sx * 7, top - 8, hx2 + sx * 10 + 1, top - 12 + step), ctx2.lineWidth = 2.4, ctx2.strokeStyle = INK, ctx2.stroke(), blob(ctx2, hx2 + sx * 10 + 1, top - 12 + step, 2.6, 2.6, "#fff2b8", 1.5);
    ctx2.beginPath(), ctx2.ellipse(hx2 - 4.6, top + 3.6, 2.2, 1, -0.5, 0, 7), ctx2.fillStyle = "rgba(255,255,255,0.8)", ctx2.fill();
  } else if (flying) {
    ctx2.beginPath(), ctx2.ellipse(hx2, hy - 3, hr * 0.97, hr * 0.8, 0, Math.PI * 0.98, Math.PI * 2.02), ctx2.closePath(), ctx2.fillStyle = "#b9805a", ctx2.fill(), ctx2.lineWidth = 2.4, ctx2.strokeStyle = INK, ctx2.stroke();
    for (let [gx, r] of [[hx2 - 1, 3.3], [hx2 + 6, 3]])
      blob(ctx2, gx, hy - 5.8, r, r, "#bfe8ff", 2.2), ctx2.beginPath(), ctx2.arc(gx - 1, hy - 7, 0.9, 0, 7), ctx2.fillStyle = "#fff", ctx2.fill();
    ctx2.beginPath(), ctx2.moveTo(hx2 + 2.3, hy - 5.8), ctx2.lineTo(hx2 + 3, hy - 5.8), ctx2.lineWidth = 2, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.moveTo(1, -2), ctx2.quadraticCurveTo(-7, -4 + step * 2, -15, -8 + step * 3), ctx2.lineWidth = 5.6, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.lineWidth = 3.2, ctx2.strokeStyle = "#ff7f9e", ctx2.stroke();
  } else if (nurse) {
    let grey = !!opt.grey;
    ctx2.beginPath(), ctx2.ellipse(hx2, hy - 3.4, hr * 0.98, hr * 0.8, 0, Math.PI, 0), ctx2.closePath();
    let g = ctx2.createLinearGradient(0, top - 1, 0, hy - 3);
    g.addColorStop(0, grey ? "#e3e3ea" : "#ffffff"), g.addColorStop(1, grey ? "#b9bac6" : "#eef3f6"), ctx2.fillStyle = g, ctx2.fill(), ctx2.lineWidth = 2.5, ctx2.strokeStyle = INK, ctx2.stroke(), rr(ctx2, hx2 - hr - 1, hy - 5.2, hr * 2 + 2, 3.2, 1.6), ctx2.fillStyle = grey ? "#b9bac6" : "#ffffff", ctx2.fill(), ctx2.lineWidth = 2, ctx2.strokeStyle = INK, ctx2.stroke(), plusShape(ctx2, hx2, hy - 12.6, 4.6, grey ? "#9a9ba8" : "#ff5a7e", 1.5), ctx2.beginPath(), ctx2.ellipse(hx2 - 5.6, top + 3.6, 2, 1, -0.5, 0, 7), ctx2.fillStyle = "rgba(255,255,255,0.85)", ctx2.fill();
  } else if (glazed) {
    let cw2 = hr * 1.2;
    ctx2.beginPath(), ctx2.moveTo(hx2 - cw2, hy - 2.2), ctx2.bezierCurveTo(hx2 - cw2 - 1, hy - hr * 1.5, hx2 + cw2 + 1, hy - hr * 1.5, hx2 + cw2, hy - 2.2);
    for (let k = 0; k < 4; k++) ctx2.quadraticCurveTo(hx2 + cw2 - (k + 0.5) * cw2 * 0.5, hy + (k % 2 ? 0.6 : 2.4), hx2 + cw2 - (k + 1) * cw2 * 0.5, hy - 2.2);
    ctx2.closePath();
    let gz = ctx2.createLinearGradient(0, top - 2, 0, hy);
    gz.addColorStop(0, "#ffd3e0"), gz.addColorStop(1, "#f48fb1"), ctx2.fillStyle = gz, ctx2.fill(), ctx2.lineWidth = 2.3, ctx2.strokeStyle = INK, ctx2.stroke();
    for (let [dx, dy, c2, rot] of [[-4.6, -3.6, "#6fd0e8", 0.5], [0.4, -7.6, "#fff3a8", -0.6], [5, -3.2, "#8de0a8", 1.1]])
      ctx2.save(), ctx2.translate(hx2 + dx, hy + dy), ctx2.rotate(rot), rr(ctx2, -1.8, -0.7, 3.6, 1.4, 0.7), ctx2.fillStyle = c2, ctx2.fill(), ctx2.restore();
    ctx2.beginPath(), ctx2.ellipse(hx2 - 5.6, top + 3.8, 2.2, 1, -0.5, 0, 7), ctx2.fillStyle = "rgba(255,255,255,0.85)", ctx2.fill();
  } else if (queen) {
    let cy = top + 3;
    if (glazeQueen) {
      blob(ctx2, hx2, cy - 6, 10.5, 6.6, "#f1cf9a", 2.4), blob(ctx2, hx2, cy - 7.4, 9, 5, "#ff9ec0", 2), blob(ctx2, hx2, cy - 7.4, 3.2, 1.9, "#f1cf9a", 1.6), blob(ctx2, hx2 - 3, cy - 10, 2.6, 1.2, "#ffd9e6", 0.1);
      for (let [dx, dy, c2, rot] of [[-6, -6.6, "#6fd0e8", 0.4], [5.5, -7.6, "#fff3a8", -0.5], [-1, -11.2, "#8de0a8", 1], [7, -5, "#ffffff", 0.9]])
        ctx2.save(), ctx2.translate(hx2 + dx, cy + dy), ctx2.rotate(rot), rr(ctx2, -1.6, -0.6, 3.2, 1.2, 0.6), ctx2.fillStyle = c2, ctx2.fill(), ctx2.restore();
      if (ART81) for (let [dx, dy, c2] of [[-6.6, -14, "#6fd0e8"], [0, -18, "#fff3a8"], [6.6, -14, "#8de0a8"]])
        ctx2.beginPath(), ctx2.arc(hx2 + dx, cy + dy, 3.1, 0, 7), ctx2.fillStyle = c2, ctx2.fill(), ctx2.lineWidth = 1.4, ctx2.strokeStyle = INK, ctx2.stroke();
      ctx2.restore();
      return;
    }
    if (syrupQueen) {
      blob(ctx2, hx2, cy - 6.5, 10.5, 4.4, "#e8a33d", 2.3);
      for (let [dx, len] of [[-6.4, 5.2], [0, 7.4], [6.4, 5.2]])
        ctx2.beginPath(), ctx2.moveTo(hx2 + dx - 2.6, cy - 6), ctx2.lineTo(hx2 + dx - 2.2, cy - 6 + len - 2), ctx2.arc(hx2 + dx, cy - 6 + len - 2, 2.2, Math.PI, 0, !0), ctx2.lineTo(hx2 + dx + 2.6, cy - 6), ctx2.closePath(), ctx2.fillStyle = "#c9772b", ctx2.fill(), ctx2.lineWidth = 2, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.arc(hx2 + dx - 0.9, cy - 6 + len - 3, 0.8, 0, 7), ctx2.fillStyle = "rgba(255,255,255,0.8)", ctx2.fill();
      blob(ctx2, hx2 - 3.2, cy - 8, 2.8, 1.2, "#fff2b8", 0.1);
      for (let dx of [-7, 0, 7])
        ctx2.beginPath(), ctx2.arc(hx2 + dx, cy - 11.6 - (dx ? 0 : 3), 3, 0, 7), ctx2.fillStyle = "#fff2b8", ctx2.fill(), ctx2.lineWidth = 1.5, ctx2.strokeStyle = INK, ctx2.stroke();
      ctx2.restore();
      return;
    }
    if (sundaeQueen) {
      ctx2.beginPath(), ctx2.moveTo(hx2 - 8.5, cy - 8.5), ctx2.lineTo(hx2 + 8.5, cy - 8.5), ctx2.lineTo(hx2 + 1.2, cy + 1), ctx2.lineTo(hx2 - 1.2, cy + 1), ctx2.closePath();
      let gc = ctx2.createLinearGradient(0, cy - 9, 0, cy + 1);
      gc.addColorStop(0, "#f6cf8a"), gc.addColorStop(1, "#d99a4a"), ctx2.fillStyle = gc, ctx2.fill(), ctx2.lineWidth = 2.3, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.save(), ctx2.beginPath(), ctx2.moveTo(hx2 - 8.5, cy - 8.5), ctx2.lineTo(hx2 + 8.5, cy - 8.5), ctx2.lineTo(hx2 + 1.2, cy + 1), ctx2.lineTo(hx2 - 1.2, cy + 1), ctx2.closePath(), ctx2.clip(), ctx2.lineWidth = 1, ctx2.strokeStyle = "rgba(122,70,30,0.7)";
      for (let k of [-6, -2, 2, 6])
        ctx2.beginPath(), ctx2.moveTo(hx2 + k - 4, cy - 9), ctx2.lineTo(hx2 + k + 4, cy + 1), ctx2.moveTo(hx2 + k + 4, cy - 9), ctx2.lineTo(hx2 + k - 4, cy + 1), ctx2.stroke();
      ctx2.restore(), blob(ctx2, hx2, cy - 11, 8.2, 5.6, "#ff9ec0", 2.2), blob(ctx2, hx2 - 1.6, cy - 12.6, 2.6, 1.4, "#ffd3e2", 0.1), ctx2.beginPath(), ctx2.moveTo(hx2 - 6.5, cy - 8.6);
      for (let k = 0; k < 4; k++) ctx2.quadraticCurveTo(hx2 - 6.5 + k * 4.4 + 1.6, cy - 5.6, hx2 - 6.5 + (k + 1) * 4.4, cy - 8.6);
      ctx2.lineWidth = 1.6, ctx2.strokeStyle = INK, ctx2.stroke(), blob(ctx2, hx2 + 1, cy - 17.4, 2.6, 2.6, "#e8304e", 1.6), ctx2.beginPath(), ctx2.moveTo(hx2 + 1, cy - 19.6), ctx2.quadraticCurveTo(hx2 + 2.5, cy - 23, hx2 + 5, cy - 23.4), ctx2.lineWidth = 1.6, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.restore();
      return;
    }
    ctx2.beginPath(), ctx2.moveTo(hx2 - 7, cy), ctx2.lineTo(hx2 - 8, cy - 9), ctx2.lineTo(hx2 - 3.5, cy - 4.5), ctx2.lineTo(hx2, cy - 11), ctx2.lineTo(hx2 + 3.5, cy - 4.5), ctx2.lineTo(hx2 + 8, cy - 9), ctx2.lineTo(hx2 + 7, cy), ctx2.closePath();
    let g = ctx2.createLinearGradient(0, cy - 11, 0, cy);
    g.addColorStop(0, pieQueen ? "#ff8aa0" : "#fff5ad"), g.addColorStop(1, pieQueen ? "#d93a5c" : "#f4b632"), ctx2.fillStyle = g, ctx2.fill(), ctx2.lineWidth = 2.3, ctx2.strokeStyle = INK, ctx2.stroke(), blob(ctx2, hx2, cy - 2.6, 1.8, 1.8, "#ff6f91", 1.2), blob(ctx2, hx2 - 5, cy - 2.2, 1.2, 1.2, "#7cc6f2", 1), blob(ctx2, hx2 + 5, cy - 2.2, 1.2, 1.2, "#7cc6f2", 1);
    for (let [x, y] of [[hx2 - 8, cy - 9], [hx2, cy - 11], [hx2 + 8, cy - 9]]) blob(ctx2, x, y, 1.4, 1.4, "#fff5ad", 1.2);
  }
  ctx2.restore();
}
var spriteCache = /* @__PURE__ */ new Map(), ANT_FRAMES = 12;
function antSprite(type, frame2, carrying, dpr2, variant = "") {
  let key = type + frame2 + (carrying ? "c" : "") + dpr2 + variant, s = spriteCache.get(key);
  if (s) return s;
  let S2 = ANTS[type].size, w = Math.ceil(80 * S2), h = Math.ceil(84 * S2), cv = makeCanvas(Math.ceil(w * dpr2), Math.ceil(h * dpr2)), g = cv.getContext("2d");
  return g.scale(dpr2, dpr2), g.translate(w / 2, h * 0.66), drawAnt(g, type, frame2 / ANT_FRAMES, { carrying, blink: frame2 === 7 && !isQueen(type), grey: variant === "g", mood: variant === "h" ? "hurt" : variant === "d" ? "dizzy" : "", pose: variant === "cheer" ? "cheer" : "" }), s = { cv, w, h, ox: w / 2, oy: h * 0.66 }, spriteCache.set(key, s), s;
}
function makeCanvas(w, h) {
  if (typeof OffscreenCanvas < "u") return new OffscreenCanvas(w, h);
  let c = document.createElement("canvas");
  return c.width = w, c.height = h, c;
}
var CARD_COLORS = Object.fromEntries(Object.entries(TOWERS).map(([k, v]) => [k, v.color])), HERO_GLOSS = { spray: [-5.5, -16, 2.6, 6.2], sound: [-9, -19, 5.5, 2.2], heart: [-4, -16, 2, 5], zapper: [-5.4, -29, 2.2, 6], tractor: [-8, -21.5, 5, 2], slingshot: [-5.6, -14, 1.5, 4.5], ball: [-5, -34, 2.2, 3.6], gate: [-2, -20, 1.2, 5], fan: [-7, -19, 3, 5], laser: [-4, -22, 3.6, 2.2], lizard: null, glue: null, lava: null };
function heroGloss(ctx2, type, lvl) {
  let h = HERO_GLOSS[type];
  h && (ctx2.save(), ctx2.beginPath(), ctx2.ellipse(h[0], h[1], h[2], h[3], -0.2, 0, 7), ctx2.fillStyle = "rgba(255,255,255,0.62)", ctx2.fill(), ctx2.beginPath(), ctx2.arc(h[0] + h[2] * 0.4, h[1] + h[3] + 2.4, 1.1, 0, 7), ctx2.fillStyle = "rgba(255,255,255,0.8)", ctx2.fill(), ctx2.restore());
}
var partCache = /* @__PURE__ */ new Map(), partHits = 0, partMisses = 0, partBytes = 0, partClipped = 0, BAKE_BOX = ART81 ? [-48, -76, 48, 36] : [-44, -60, 44, 36], TOWER_K = 1.18, BODYK = 1, TOWER_PAD = {
  slingshot: "#e07c14",
  spray: "#47aa28",
  sound: "#a183e2",
  ball: "#2f9dea",
  laser: "#f76370",
  zapper: "#309af7",
  // v0.8.2 A10b: the six side-tower pads x0.97 (W6 ground is the lightest: pad vs ground 1.543 -> 1.636; every other theme rises too)
  fan: "#28aa9d",
  pheromone: "#f06da6",
  lizard: "#76a927",
  tractor: "#cf8a00",
  glue: "#d9a900",
  gate: "#d99a00",
  lava: "#ff6a00"
}, SKIN_PAD = {};
function setSkinPads(m) {
  SKIN_PAD = m || {};
}
var tpad = (type, old) => ART81 ? SKIN_PAD[type] || TOWER_PAD[type] : old, MOTION = { reduced: !1, bobTowers: !1, hop: 0 }, BOBV = null;
function bodyScale(ctx2) {
  ART81 && (MOTION.hop && ctx2.translate(0, -MOTION.hop), BOBV !== null && (ctx2.translate(0, 8), ctx2.translate(0, -1.2 * (0.5 + 0.5 * BOBV)), ctx2.scale(1, 1 + 0.012 * BOBV), ctx2.translate(0, -8)), ctx2.translate(0, 8), ctx2.scale(TOWER_K, TOWER_K), ctx2.translate(0, -8), BODYK = TOWER_K);
}
function clearTowerCache() {
  partCache.clear(), partBytes = 0;
}
function devScale2(ctx2) {
  let sc = 1;
  if (ctx2.getTransform) {
    let m = ctx2.getTransform();
    sc = Math.hypot(m.a, m.b);
  }
  return sc <= 4 ? Math.max(1, Math.ceil(sc * 4 - 1e-6) / 4) : Math.min(8, +Math.pow(2, Math.ceil(Math.log2(sc) * 4 - 1e-6) / 4).toFixed(3));
}
function baked(ctx2, key, draw, os = 1) {
  let sc = devScale2(ctx2) * os, k = key + "@" + sc, e = partCache.get(k);
  if (e)
    partHits++;
  else {
    partMisses++, partBytes > 4e7 && clearTowerCache();
    let [x0, y0, x1, y1] = BAKE_BOX, W0 = Math.ceil((x1 - x0) * sc), H0 = Math.ceil((y1 - y0) * sc), big = makeCanvas(W0, H0), g = big.getContext("2d");
    if (g.setTransform(sc, 0, 0, sc, -x0 * sc, -y0 * sc), g.lineJoin = "round", g.lineCap = "round", BODYK !== 1) {
      let set = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(g), "lineWidth");
      if (set && set.set) {
        let f = 1.2 / BODYK, lw = 1;
        Object.defineProperty(g, "lineWidth", { configurable: !0, get() {
          return lw;
        }, set(v) {
          lw = v, set.set.call(g, v * f);
        } });
      }
    }
    draw(g);
    let minX = W0, minY = H0, maxX = -1, maxY = -1;
    if (g.getImageData) {
      let d = g.getImageData(0, 0, W0, H0).data;
      for (let y = 0; y < H0; y++) {
        let row = y * W0 * 4;
        for (let x = 0; x < W0; x++) d[row + x * 4 + 3] && (x < minX && (minX = x), x > maxX && (maxX = x), y < minY && (minY = y), y > maxY && (maxY = y));
      }
    } else
      minX = 0, minY = 0, maxX = W0 - 1, maxY = H0 - 1;
    if (maxX < 0) e = { cv: null };
    else {
      (minX === 0 || minY === 0 || maxX === W0 - 1 || maxY === H0 - 1) && partClipped++;
      let w = maxX - minX + 1, h = maxY - minY + 1, cv = makeCanvas(w, h);
      cv.getContext("2d").drawImage(big, minX, minY, w, h, 0, 0, w, h), e = { cv, x: x0 + minX / sc, y: y0 + minY / sc, w: w / sc, h: h / sc }, partBytes += w * h * 4;
    }
    partCache.set(k, e);
  }
  e.cv && ctx2.drawImage(e.cv, e.x, e.y, e.w, e.h);
}
function pad(ctx2, color) {
  baked(ctx2, "pad" + color, (g) => padPaths(g, color)), bodyScale(ctx2);
}
function padPaths(ctx2, color) {
  shadow(ctx2, 0, 11, 18, 6.5, 0.24), ctx2.beginPath(), ctx2.ellipse(0, 9.6, 16.4, 8.6, 0, 0, 7), ctx2.fillStyle = shade(color, -0.3), ctx2.fill(), ctx2.lineWidth = 3, ctx2.strokeStyle = INK, ctx2.stroke(), blob(ctx2, 0, 5.5, 15.5, 8, shade(color, -0.02), 3, 0, { gloss: 0.55 });
  let g = ctx2.createRadialGradient(-4, 3, 1, 0, 5, 12);
  g.addColorStop(0, shade(color, 0.6)), g.addColorStop(1, shade(color, 0.2)), ctx2.beginPath(), ctx2.ellipse(0, 4.5, 11, 5, 0, 0, 7), ctx2.fillStyle = g, ctx2.fill(), rim(ctx2, 0, 5.5, 15.5, 8, 0.75), ART81 && (ctx2.save(), ctx2.lineCap = "round", ctx2.beginPath(), ctx2.ellipse(0, 5.5, 14, 6.6, 0, Math.PI * 1.08, Math.PI * 1.92), ctx2.lineWidth = 2, ctx2.strokeStyle = "rgba(255,255,255,0.35)", ctx2.stroke(), ctx2.beginPath(), ctx2.ellipse(0, 5.5, 13.6, 6.3, 0, Math.PI * 0.12, Math.PI * 0.88), ctx2.lineWidth = 3, ctx2.strokeStyle = shade(color, -0.18), ctx2.stroke(), ctx2.restore());
  for (let a of [0.35, 1.2, 1.95, 2.8]) {
    let rx = Math.cos(a) * 13.2, ry = 6.5 + Math.sin(a) * 6.3;
    ctx2.beginPath(), ctx2.arc(rx, ry, 1.35, 0, 7), ctx2.fillStyle = shade(color, -0.38), ctx2.fill(), ctx2.beginPath(), ctx2.arc(rx - 0.4, ry - 0.45, 0.45, 0, 7), ctx2.fillStyle = "rgba(255,255,255,0.8)", ctx2.fill();
  }
}
var lvKey = (lvl) => lvl >= 5 ? 5 : lvl >= 3 ? 3 : lvl >= 2 ? 2 : 1, r2 = (v) => Math.round(v * 100) / 100;
function drawTower(ctx2, type, t = 0, tw = null) {
  let T = TOWERS[type], aim = tw ? tw.aim : -0.6, fx = tw ? tw.fireFx : 0, lvl = tw && tw.lvl || 1, lk = lvKey(lvl);
  switch (ctx2.save(), ctx2.lineJoin = "round", ctx2.lineCap = "round", BODYK = 1, BOBV = ART81 && MOTION.bobTowers && tw && !MOTION.reduced && !(tw.fireFx > 0) ? Math.sin(Math.PI * 2 * t / 2.4 + (tw.id || 0) * 0.83) : null, T.place === "side" && baked(ctx2, "ring76", (g) => {
    g.beginPath(), g.ellipse(0, 10.2, 19.2, 9.6, 0, 0, 7), g.fillStyle = "#7d5a40", g.fill(), g.lineWidth = 3, g.strokeStyle = INK, g.stroke(), drawGlossyBlob(g, 0, 9, 19.5, 10.5, "#a67c5c", { lw: 2.6, gloss: 0.5 });
  }), lvl >= 4 && T.place === "side" && baked(ctx2, "plinth", plinthPaths), lvl >= 2 && T.place === "side" && (baked(ctx2, "trim", (g) => {
    g.beginPath(), g.ellipse(0, 8.1, 19, 10.5, 0, 0, Math.PI), g.lineWidth = 3.2, g.strokeStyle = "#b8700a", g.stroke(), g.beginPath(), g.ellipse(0, 7, 19, 10.5, 0, 0, 7), g.lineWidth = 3.2, g.strokeStyle = "#f4b632", g.stroke(), g.beginPath(), g.ellipse(0, 6.6, 19, 10.5, 0, Math.PI * 1.05, Math.PI * 1.75), g.lineWidth = 1.3, g.strokeStyle = "#ffe566", g.stroke();
  }), ctx2.beginPath(), ctx2.ellipse(0, 7, 19, 10.5, 0, Math.PI * 1.1 + t % 3 * 0.6, Math.PI * 1.3 + t % 3 * 0.6), ctx2.lineWidth = 2, ctx2.strokeStyle = "#fff6c0", ctx2.stroke()), lvl > 1 && ctx2.scale(1 + 0.03 * (lvl - 1), 1 + 0.03 * (lvl - 1)), lvl >= 4 && T.place === "path" && pathStuds(ctx2, t), type) {
    case "slingshot": {
      pad(ctx2, tpad("slingshot", "#f6c99a"));
      let face = Math.cos(aim) >= 0 ? 1 : -1;
      ctx2.save(), ctx2.scale(face, 1), baked(ctx2, "sling:frame", (g) => {
        g.lineWidth = 7, g.strokeStyle = INK, g.beginPath(), g.moveTo(0, 6), g.lineTo(0, -4), g.moveTo(0, -4), g.quadraticCurveTo(-8, -8, -8, -17), g.moveTo(0, -4), g.quadraticCurveTo(8, -8, 8, -17), g.stroke(), g.lineWidth = 4.2, g.strokeStyle = "#c98a55", g.beginPath(), g.moveTo(0, 6), g.lineTo(0, -4), g.moveTo(0, -4), g.quadraticCurveTo(-8, -8, -8, -17), g.moveTo(0, -4), g.quadraticCurveTo(8, -8, 8, -17), g.stroke();
      });
      let pull = fx > 0 ? 0 : 4.2 + Math.sin(t * 3) * 0.8;
      ctx2.lineWidth = 2, ctx2.strokeStyle = "#ff7a8a", ctx2.beginPath(), ctx2.moveTo(-8, -16), ctx2.lineTo(-2 - pull, -12 + pull * 0.4), ctx2.lineTo(8, -16), ctx2.stroke(), baked(ctx2, "sling:caps", (g) => {
        g.lineWidth = 1, g.strokeStyle = "rgba(255,240,220,0.6)", g.beginPath(), g.moveTo(-1, 4), g.lineTo(-1, -3), g.moveTo(-6.5, -10), g.quadraticCurveTo(-7, -14, -7, -16), g.stroke();
        for (let sx2 of [-8, 8])
          rr(g, sx2 - 2.6, -18, 5.2, 4, 1.5), g.fillStyle = "#ff9aa6", g.fill(), g.lineWidth = 1.2, g.strokeStyle = INK, g.stroke();
      }), ctx2.beginPath(), ctx2.ellipse(-2 - pull, -12 + pull * 0.4, 3.6, 2.6, 0.3, 0, 7), ctx2.fillStyle = "#a0623a", ctx2.fill(), ctx2.lineWidth = 1.2, ctx2.strokeStyle = INK, ctx2.stroke(), fx || blob(ctx2, -3 - pull, -12.5 + pull * 0.4, 2.8, 2.8, "#c9c2d6", 1.3), lk >= 2 && baked(ctx2, "sling:lp" + lk, (g) => levelParts(g, type, lvl, 0, 0, 0)), ctx2.restore();
      break;
    }
    case "spray": {
      pad(ctx2, tpad("spray", "#bfe8b2"));
      let sx = fx > 0 ? 1.06 : 1;
      ctx2.scale(1 / sx, sx), baked(ctx2, "spray:can", (g) => {
        rr(g, -9, -20, 18, 26, 6);
        let gr = g.createLinearGradient(-9, 0, 9, 0);
        gr.addColorStop(0, "#ffd0e0"), gr.addColorStop(0.4, "#ffb3cb"), gr.addColorStop(1, "#ee86a8"), g.fillStyle = gr, g.fill(), g.lineWidth = 2.2, g.strokeStyle = INK, g.stroke(), rr(g, -9, -9, 18, 7, 2), g.fillStyle = "#9be38a", g.fill(), g.stroke();
      }), ctx2.save(), rr(ctx2, -8, -19, 16, 9, 4), ctx2.clip(), ctx2.beginPath(), ctx2.moveTo(-9, -13 + Math.sin(t * 3) * 1.2);
      for (let k = -8; k <= 9; k += 3) ctx2.lineTo(k, -13 + Math.sin(t * 3 + k * 0.4) * 1.4);
      ctx2.lineTo(9, -10), ctx2.lineTo(-9, -10), ctx2.closePath(), ctx2.fillStyle = "rgba(255,255,255,0.45)", ctx2.fill(), ctx2.restore(), baked(ctx2, "spray:top", (g) => {
        g.lineWidth = 2.2, g.strokeStyle = INK, g.fillStyle = INK, g.beginPath(), g.arc(-3, -6, 1.2, 0, 7), g.arc(3, -6, 1.2, 0, 7), g.fill(), rr(g, -5, -27, 10, 7, 2), g.fillStyle = "#ffffff", g.fill(), g.stroke(), rr(g, 3, -26, 6, 3, 1), g.fillStyle = "#8fd17d", g.fill(), g.stroke(), rr(g, -7, -18, 3, 22, 1.5), g.fillStyle = "rgba(255,255,255,0.45)", g.fill();
      });
      {
        let dp = t * 0.8 % 1;
        ctx2.globalAlpha = 1 - dp, ctx2.beginPath(), ctx2.ellipse(11 + dp * 4, -24 + dp * 6, 1.6, 2.1, 0, 0, 7), ctx2.fillStyle = "#b8f0a8", ctx2.fill(), ctx2.lineWidth = 1, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.globalAlpha = 1;
      }
      lk >= 2 && baked(ctx2, "spray:lp" + lk, (g) => levelParts(g, type, lvl, 0, 0, 0)), lk >= 5 && (ctx2.beginPath(), ctx2.moveTo(-11, -16), ctx2.lineTo(-11 + Math.cos(-2 + Math.sin(t * 2) * 0.5) * 3, -16 + Math.sin(-2 + Math.sin(t * 2) * 0.5) * 3), ctx2.lineWidth = 1.3, ctx2.strokeStyle = "#e0607e", ctx2.stroke());
      break;
    }
    case "sound": {
      pad(ctx2, tpad("sound", "#d6c8f5"));
      let beat = Math.max(0, Math.sin(t * 7.5)), pump = fx > 0 ? 1 + fx * 0.25 : 1 + beat * 0.04;
      if (ctx2.translate(0, 6), ctx2.scale(pump, 1 / pump), ctx2.translate(0, -6 - beat * 1.2), fx <= 0 && beat > 0.6) {
        ctx2.save(), ctx2.globalAlpha = (beat - 0.6) * 2;
        let ny = -26 - t % 1 * 5;
        ctx2.fillStyle = "#a58be0", ctx2.beginPath(), ctx2.ellipse(13, ny, 2.4, 1.8, -0.4, 0, 7), ctx2.fill(), ctx2.fillRect(14.6, ny - 7, 1.3, 7), ctx2.restore();
      }
      baked(ctx2, "sound:body" + lk, (g) => {
        rr(g, -15, -19, 30, 22, 7);
        let gr = g.createLinearGradient(0, -19, 0, 3);
        gr.addColorStop(0, "#c9b6f2"), gr.addColorStop(1, "#9d84d8"), g.fillStyle = gr, g.fill(), g.lineWidth = 2.2, g.strokeStyle = INK, g.stroke(), rr(g, -12, -17, 4, 18, 2), g.fillStyle = "rgba(255,255,255,0.3)", g.fill();
        for (let sx of [-7.5, 7.5])
          blob(g, sx, -8, 5.5, 5.5, "#5b4a7a", 1.8), g.beginPath(), g.arc(sx, -8, 3.6, 0, 7), g.lineWidth = 1, g.strokeStyle = "rgba(232,221,255,0.6)", g.stroke();
        g.beginPath(), g.moveTo(-8, -19), g.quadraticCurveTo(0, -27, 8, -19), g.lineWidth = 2.4, g.strokeStyle = INK, g.stroke(), lk >= 2 && levelParts(g, type, lvl, 0, 0, 0);
      });
      for (let sx of [-7.5, 7.5])
        ctx2.beginPath(), ctx2.arc(sx, -8, 2 + beat * 0.5, 0, 7), ctx2.fillStyle = "#e8ddff", ctx2.fill();
      break;
    }
    case "ball": {
      pad(ctx2, tpad("ball", "#b6defa"));
      let ca = tw && tw.lx != null ? Math.atan2(tw.ly - tw.y, tw.lx - tw.x) : 0.5;
      ctx2.save(), ctx2.rotate(ca);
      let cl = lvl >= 2 ? 23 : 18;
      if (baked(ctx2, "ball:chute" + (lvl >= 2 ? 2 : 1), (g) => {
        rr(g, 0, -5, cl, 10, 4), g.fillStyle = "#e8c08a", g.fill(), g.lineWidth = 2, g.strokeStyle = INK, g.stroke(), g.beginPath(), g.moveTo(3, 0), g.lineTo(cl - 2, 0), g.lineWidth = 2, g.strokeStyle = "#c99a62", g.stroke(), lvl >= 2 && (g.beginPath(), g.moveTo(4, -5.5), g.lineTo(cl - 3, -5.5), g.moveTo(4, 5.5), g.lineTo(cl - 3, 5.5), g.lineWidth = 1.8, g.strokeStyle = "#f4b632", g.stroke());
      }, 2), ctx2.restore(), baked(ctx2, "ball:body", (g) => {
        rr(g, -11, -14, 22, 18, 6);
        let gr = g.createLinearGradient(-11, 0, 11, 0);
        gr.addColorStop(0, "#f6dcb4"), gr.addColorStop(1, "#ddb27c"), g.fillStyle = gr, g.fill(), g.lineWidth = 2.2, g.strokeStyle = INK, g.stroke(), g.beginPath(), g.moveTo(-9, -6), g.lineTo(9, -6), g.moveTo(-9, 0), g.lineTo(9, 0), g.lineWidth = 1.3, g.strokeStyle = "#c99a62", g.stroke(), g.beginPath(), g.ellipse(0, -14, 10, 4, 0, 0, 7), g.fillStyle = "#8f6a48", g.fill(), g.lineWidth = 2, g.strokeStyle = INK, g.stroke();
      }), fx <= 0) {
        let wob = Math.sin(t * 2.2) * 0.8;
        marble(ctx2, wob, -20 - Math.abs(Math.sin(t * 2.2)) * 0.8, 7.5 * (tw ? towerSize(tw) : 1), t * 0.3);
      } else
        ctx2.save(), ctx2.globalAlpha = fx / 0.3, ctx2.beginPath(), ctx2.arc(0, -20, 10 + (0.3 - fx) * 30, 0, 7), ctx2.lineWidth = 2, ctx2.strokeStyle = "#fff", ctx2.stroke(), ctx2.restore();
      lk >= 3 && baked(ctx2, "ball:lp" + lk, (g) => levelParts(g, type, lvl, 0, 0, 0));
      break;
    }
    case "fan": {
      let ax = r2(tw && tw.ax != null ? tw.ax : 0.45), ay = r2(tw && tw.ay != null ? tw.ay : 0.9), spin = t * (fx > 0 ? 30 : 5), sx = ax < 0 ? -1 : 1, wf = Math.max(0.36, Math.abs(ay)), back = ay < -0.25, mx = -ax * 7, my = -ay * 3, v = ax + "," + ay, cage = (g) => {
        g.translate(0, -16), g.translate(ax * 2, ay * 1), g.scale(wf * sx, 1);
      };
      pad(ctx2, tpad("fan", "#bdeee8")), baked(ctx2, "fan:below:" + v, (g) => {
        g.lineWidth = 4, g.strokeStyle = INK, g.beginPath(), g.moveTo(0, 6), g.lineTo(0, -8), g.stroke(), g.lineWidth = 2.2, g.strokeStyle = "#7fcfc4", g.beginPath(), g.moveTo(0, 6), g.lineTo(0, -8), g.stroke(), g.save(), g.translate(0, -16), back || blob(g, mx, my, 6, 6, "#bfe9e2", 1.8), g.restore(), g.save(), cage(g), blob(g, 0, 0, 14, 14, "#effcfa", 2), g.restore();
      }), ctx2.save(), ctx2.translate(0, -16), ctx2.save(), ctx2.translate(ax * 2, ay * 1), ctx2.scale(wf * sx, 1), ctx2.globalAlpha = back ? 0.55 : 1;
      let nb = lvl >= 2 ? 4 : 3;
      for (let k = 0; k < nb; k++) {
        let a = spin + k * Math.PI * 2 / nb;
        ctx2.beginPath(), ctx2.ellipse(Math.cos(a) * 6, Math.sin(a) * 6, 6, 3.2, a, 0, 7);
        let g = ctx2.createLinearGradient(-6, -6, 6, 6);
        g.addColorStop(0, "#a6ece2"), g.addColorStop(1, "#5fc4b6"), ctx2.fillStyle = g, ctx2.fill(), ctx2.lineWidth = 1.3 / wf * 0.8, ctx2.strokeStyle = INK, ctx2.stroke();
      }
      if (ctx2.globalAlpha = 1, ctx2.restore(), ctx2.restore(), baked(ctx2, "fan:above:" + v + ":" + (lvl >= 3 ? 3 : 1), (g) => {
        g.save(), cage(g);
        for (let k = 0; k < 6; k++)
          g.beginPath(), g.moveTo(0, 0), g.lineTo(Math.cos(k * 1.047 + 0.5) * 13, Math.sin(k * 1.047 + 0.5) * 13), g.lineWidth = 0.8 / wf, g.strokeStyle = "rgba(82,60,75,0.45)", g.stroke();
        g.beginPath(), g.arc(0, 0, 14, 0, 7), g.lineWidth = 2.6 / Math.max(wf, 0.6), g.strokeStyle = INK, g.stroke(), lvl >= 3 && (g.beginPath(), g.arc(0, 0, 16, 0, 7), g.lineWidth = 2.4 / Math.max(wf, 0.6), g.strokeStyle = "#c4ccd8", g.stroke(), g.lineWidth = 1, g.strokeStyle = INK, g.stroke()), g.beginPath(), g.arc(0, 0, 11.5, Math.PI * 1.1, Math.PI * 1.5), g.lineWidth = 1.5, g.strokeStyle = "rgba(255,255,255,0.8)", g.stroke(), g.restore(), g.save(), g.translate(0, -16), back ? blob(g, mx, my, 6, 6, "#bfe9e2", 1.8) : blob(g, ax * 3, ay * 1.5, 2.6, 2.6, "#ff9ab0", 1.3), g.restore();
      }), tw) {
        ctx2.save(), ctx2.translate(0, -16), ctx2.globalAlpha = 0.5;
        for (let k = 0; k < 2; k++) {
          let d = 16 + (t * 1.6 + k * 0.5) % 1 * 10;
          ctx2.beginPath(), ctx2.moveTo(ax * d - ay * (k ? 4 : -4), ay * d * 0.6 + ax * (k ? 4 : -4)), ctx2.lineTo(ax * (d + 6) - ay * (k ? 4 : -4), ay * (d + 6) * 0.6 + ax * (k ? 4 : -4)), ctx2.lineWidth = 1.6, ctx2.strokeStyle = "#ffffff", ctx2.stroke();
        }
        ctx2.globalAlpha = 1, ctx2.restore();
      }
      if (lk >= 3) for (let s2 of [-1, 1]) {
        let w = Math.sin(t * 9 + s2) * 3;
        ctx2.beginPath(), ctx2.moveTo(s2 * 12, -24), ctx2.quadraticCurveTo(s2 * 18, -30 + w, s2 * 22, -26 - w), ctx2.lineWidth = 2.2, ctx2.strokeStyle = s2 < 0 ? "#ff9ab0" : "#ffd45e", ctx2.stroke();
      }
      lk >= 5 && baked(ctx2, "fan:lp5", (g) => {
        rr(g, -9, 1, 18, 5, 2), g.fillStyle = "#9fe0d6", g.fill(), g.lineWidth = 1.4, g.strokeStyle = INK, g.stroke();
      });
      break;
    }
    case "pheromone": {
      bodyScale(ctx2), baked(ctx2, "pher:body", (g) => {
        shadow(g, 0, 9, 13, 4.5, 0.18), g.beginPath(), g.ellipse(0, 6, 15, 6, 0, 0, 7), g.fillStyle = ART81 ? "rgba(240,109,166,0.85)" : "rgba(255,170,210,0.45)", g.fill(), rr(g, -8, -12, 16, 18, 7);
        let gr = g.createLinearGradient(-8, 0, 8, 0);
        gr.addColorStop(0, ART81 ? "#ff9ec8" : "#ffd9ec"), gr.addColorStop(1, ART81 ? "#f06da6" : "#f59cc6"), g.fillStyle = gr, g.fill(), g.lineWidth = 2.2, g.strokeStyle = INK, g.stroke(), rr(g, -3.5, -18, 7, 6, 2), g.fillStyle = "#e7c4ff", g.fill(), g.stroke(), heart(g, 0, -3, 4, "#ff6fa5");
      });
      for (let k = 0; k < 2; k++) {
        let p = (t * 0.6 + k * 0.5) % 1;
        ctx2.globalAlpha = 1 - p, heart(ctx2, -5 + k * 10 + Math.sin(p * 6) * 2, -20 - p * 16, 2.6, "#ff8fbf");
      }
      ctx2.globalAlpha = 1, lk >= 2 && baked(ctx2, "pher:lp" + lk, (g) => levelParts(g, type, lvl, 0, 0, 0));
      break;
    }
    case "glue": {
      if (baked(ctx2, "glue:body" + (lvl >= 2 ? 2 : 1), (g) => {
        shadow(g, 0, 8, 16, 4, 0.12), g.beginPath();
        for (let k = 0; k <= 12; k++) {
          let a = k / 12 * Math.PI * 2, r = 15 + Math.sin(a * 3 + 1) * 2.5;
          g.lineTo(Math.cos(a) * r, 3 + Math.sin(a) * r * 0.5);
        }
        g.closePath(), g.fillStyle = ART81 ? "#d9a900" : "rgba(255,248,205,0.92)", g.fill(), g.lineWidth = 2, g.strokeStyle = ART81 ? INK : "#d8c27a", g.stroke(), g.beginPath(), g.ellipse(-5, 0, 4, 1.6, -0.3, 0, 7), g.fillStyle = "#fff", g.fill(), g.save(), g.translate(9, -5), g.rotate(0.9), rr(g, -5, -9, 10, 15, 4), g.fillStyle = "#fffdf3", g.fill(), g.lineWidth = 2, g.strokeStyle = INK, g.stroke(), rr(g, -5, -3, 10, 5, 1), g.fillStyle = "#ffb347", g.fill(), g.stroke(), g.beginPath(), g.moveTo(-2, -9), g.lineTo(0, -14), g.lineTo(2, -9), g.closePath(), g.fillStyle = "#ff8c6b", g.fill(), g.stroke(), g.restore(), lvl >= 2 && (g.save(), g.translate(-10, -3), g.rotate(-0.7), rr(g, -3.5, -6, 7, 10, 3), g.fillStyle = "#fffdf3", g.fill(), g.lineWidth = 1.5, g.strokeStyle = INK, g.stroke(), rr(g, -3.5, -2, 7, 3, 1), g.fillStyle = "#7fd3ff", g.fill(), g.restore());
      }), lk >= 3) for (let k = 0; k < 2; k++) {
        let p = (t * 0.8 + k * 0.5) % 1;
        ctx2.globalAlpha = 1 - p, ctx2.beginPath(), ctx2.arc(-4 + k * 8, 2 - p * 8, 1.5 + p, 0, 7), ctx2.lineWidth = 1, ctx2.strokeStyle = "#d8c27a", ctx2.stroke(), ctx2.globalAlpha = 1;
      }
      lk >= 5 && baked(ctx2, "glue:lp5", (g) => {
        for (let [x, y] of [[-14, 8], [14, 9], [0, 12]]) blob(g, x, y, 2.6, 1.5, ART81 ? "#e8b800" : "#fff4c0", 1);
      });
      break;
    }
    case "lava": {
      baked(ctx2, "lava:crust", (g2) => {
        shadow(g2, 0, 8, 17, 4.5, 0.14), g2.beginPath();
        for (let k = 0; k <= 14; k++) {
          let a = k / 14 * Math.PI * 2, r = 16.5 + Math.sin(a * 4 + 0.6) * 2;
          g2.lineTo(Math.cos(a) * r, 3 + Math.sin(a) * r * 0.55);
        }
        g2.closePath(), g2.fillStyle = "#6b3a34", g2.fill(), g2.lineWidth = 2, g2.strokeStyle = INK, g2.stroke();
      });
      let glow = 0.5 + Math.sin(t * 3) * 0.5;
      ctx2.beginPath();
      for (let k = 0; k <= 14; k++) {
        let a = k / 14 * Math.PI * 2, r = 12.5 + Math.sin(a * 3 + t * 1.5) * 1.6;
        ctx2.lineTo(Math.cos(a) * r, 3 + Math.sin(a) * r * 0.5);
      }
      ctx2.closePath();
      let g = ctx2.createRadialGradient(-2, 2, 1, 0, 3, 14);
      g.addColorStop(0, "#fff3a0"), g.addColorStop(0.35, glow > 0.5 ? "#ffc04d" : "#ffb347"), g.addColorStop(1, "#ff6a3d"), ctx2.fillStyle = g, ctx2.fill();
      for (let [px, py, w, h, r] of [[-7, 1, 4.5, 2.2, 0.3], [6, 5, 4, 1.8, -0.4], [3, -1, 2.6, 1.3, 0.8]])
        ctx2.beginPath(), ctx2.ellipse(px + Math.sin(t + px) * 0.6, py, w, h, r, 0, 7), ctx2.fillStyle = "#8a4a3c", ctx2.fill(), ctx2.lineWidth = 1, ctx2.strokeStyle = "#ffdf80", ctx2.stroke();
      for (let k = 0; k < 3; k++) {
        let p = (t * 0.9 + k * 0.37) % 1, bx = [-3, 8, -9][k], by = [5, 0, 6][k];
        ctx2.globalAlpha = 1 - p * p, ctx2.beginPath(), ctx2.arc(bx, by - p * 2, 1 + p * 2.4, 0, 7), ctx2.lineWidth = 1.2, ctx2.strokeStyle = "#fff6c0", ctx2.stroke();
      }
      ctx2.globalAlpha = 1;
      for (let k = 0; k < 2; k++) {
        let p = (t * 0.7 + k * 0.5) % 1;
        ctx2.globalAlpha = (1 - p) * 0.7, ctx2.beginPath();
        let x0 = -5 + k * 10;
        ctx2.moveTo(x0, -2 - p * 14), ctx2.quadraticCurveTo(x0 + 4, -6 - p * 14, x0, -10 - p * 14), ctx2.quadraticCurveTo(x0 - 4, -14 - p * 14, x0, -18 - p * 14), ctx2.lineWidth = 1.8, ctx2.strokeStyle = "#ffb36b", ctx2.stroke();
      }
      if (ctx2.globalAlpha = 1, fx > 0 && (ctx2.globalAlpha = Math.min(1, fx * 2), ctx2.beginPath(), ctx2.ellipse(0, 3, 18, 9, 0, 0, 7), ctx2.lineWidth = 2, ctx2.strokeStyle = "#ffe08a", ctx2.stroke(), ctx2.globalAlpha = 1), lk >= 2 && baked(ctx2, "lava:lp" + Math.min(lk, 3), (g2) => levelParts(g2, type, Math.min(lvl, 4), 0, 0, 0)), lk >= 5) for (let k = 0; k < 3; k++) {
        let h = 4 + Math.sin(t * 8 + k * 2) * 2;
        ctx2.beginPath(), ctx2.moveTo(-8 + k * 8 - 2, 2), ctx2.quadraticCurveTo(-8 + k * 8, 2 - h * 2, -8 + k * 8 + 2, 2), ctx2.fillStyle = "#ff8a3d", ctx2.fill();
      }
      break;
    }
    case "gate": {
      let dirx = tw ? tw.dirx : 0, diry = tw ? tw.diry : 1, nx = -diry, ny = dirx, d = 16, ax = nx * d, ay = ny * d * 0.8, bx = -nx * d, by = -ny * d * 0.8, live = fx > 0;
      ctx2.beginPath(), ctx2.moveTo(ax, ay - 14);
      for (let k = 1; k < 8; k++) {
        let f = k / 8;
        ctx2.lineTo(ax + (bx - ax) * f + Math.sin(t * 40 + k * 2) * 2.5, ay - 14 + (by - ay) * f + Math.cos(t * 33 + k) * 3);
      }
      if (ctx2.lineTo(bx, by - 14), ctx2.lineWidth = live ? 4 : 2.5, ctx2.strokeStyle = live ? "#fff7a8" : "rgba(255,240,120,0.75)", ctx2.stroke(), ctx2.lineWidth = 1.2, ctx2.strokeStyle = "#ffb000", ctx2.stroke(), lvl >= 5) {
        ctx2.beginPath(), ctx2.moveTo(ax, ay - 6);
        for (let k = 1; k < 8; k++) {
          let f = k / 8;
          ctx2.lineTo(ax + (bx - ax) * f + Math.sin(t * 37 + k * 3) * 2, ay - 6 + (by - ay) * f + Math.cos(t * 29 + k) * 2.5);
        }
        ctx2.lineTo(bx, by - 6), ctx2.lineWidth = 1.6, ctx2.strokeStyle = "rgba(255,240,120,0.8)", ctx2.stroke();
      }
      baked(ctx2, "gate:poles:" + dirx + "," + diry + ":" + Math.min(lk, 3), (g) => {
        for (let [px, py] of [[ax, ay], [bx, by]]) {
          if (shadow(g, px, py + 5, 6, 2.2, 0.22), rr(g, px - 3, py - 14, 6, 19, 3), g.fillStyle = ART81 ? "#d99a00" : "#c3c9d8", g.fill(), g.lineWidth = 1.8, g.strokeStyle = INK, g.stroke(), lvl >= 3) for (let k of [0, 1])
            g.beginPath(), g.ellipse(px, py - 3 - k * 5, 4.2, 1.6, 0, 0, 7), g.fillStyle = "#ffb3c1", g.fill(), g.lineWidth = 1.1, g.strokeStyle = INK, g.stroke();
          lvl >= 2 ? starShape(g, px, py - 16, 5.2, "#ffe066", 1.4) : blob(g, px, py - 15, 4.2, 4.2, "#ffe066", 1.8);
        }
      });
      break;
    }
    case "lizard": {
      baked(ctx2, "liz:shadow", (g) => shadow(g, 0, 11, 17, 5, 0.22)), bodyScale(ctx2);
      let chew = tw && tw.chew > 0, face = Math.cos(aim) >= 0 ? 1 : -1;
      ctx2.save(), ctx2.scale(face, 1), ctx2.beginPath(), ctx2.moveTo(-8, 4), ctx2.quadraticCurveTo(-20, 8 + Math.sin(t * 3) * 3, -18, -4), ctx2.lineWidth = 6, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.lineWidth = 3.6, ctx2.strokeStyle = tpad("lizard", "#a7d96a") === "#76a927" ? "#6a9c22" : "#a7d96a", ctx2.stroke(), baked(ctx2, "liz:body", (g) => {
        blob(g, -2, 2, 12, 8, tpad("lizard", "#b8e07a")), g.fillStyle = ART81 ? "#55851a" : "#8cc456";
        for (let [a, b] of [[-6, 0], [-1, -2], [3, 1]])
          g.beginPath(), g.arc(a, b, 1.6, 0, 7), g.fill();
        for (let fx2 of [-9, 6]) blob(g, fx2, 9, 3.5, 2.2, ART81 ? "#5f8f1c" : "#a7d96a", 1.5);
        g.beginPath(), g.ellipse(-1, 5.4, 7.5, 2.6, 0, 0, 7), g.fillStyle = "rgba(230,247,184,0.85)", g.fill();
      });
      let hb = chew ? Math.sin(t * 25) * 1.5 : 0;
      ctx2.save(), ctx2.translate(0, hb), baked(ctx2, "liz:head", (g) => blob(g, 9, -6, 9, 7.5, ART81 ? "#8cc03a" : "#c4ea86")), ctx2.restore();
      let blink = t % 3.7 < 0.12, br = Math.sin(t * 2.4) * 0.6;
      eye(ctx2, 6, -13 + hb + br, 3.6, 0.6, blink), eye(ctx2, 12.5, -12.5 + hb + br, 3.4, 0.6, blink), ctx2.save(), ctx2.translate(0, hb), baked(ctx2, "liz:mouth", (g) => {
        g.beginPath(), g.arc(13, -3, 3, 0.1, Math.PI - 0.3), g.lineWidth = 1.5, g.strokeStyle = INK, g.stroke(), g.beginPath(), g.ellipse(8, -2, 2, 1.2, 0, 0, 7), g.fillStyle = "rgba(255,120,140,0.6)", g.fill();
      }), ctx2.restore(), lk >= 2 && baked(ctx2, "liz:lp" + Math.min(lk, 3), (g) => levelParts(g, type, Math.min(lvl, 4), 0, 0, 0)), lk >= 5 && (ctx2.beginPath(), ctx2.moveTo(-4, -2), ctx2.quadraticCurveTo(-16, 2 + Math.sin(t * 4) * 2, -18, 9), ctx2.lineTo(-6, 6), ctx2.closePath(), ctx2.fillStyle = "#8fb6ff", ctx2.fill(), ctx2.lineWidth = 1.3, ctx2.strokeStyle = INK, ctx2.stroke()), ctx2.restore();
      break;
    }
    case "laser": {
      pad(ctx2, tpad("laser", "#ffc2c7"));
      let charge = fx > 0 ? 1 : 0.5 + 0.5 * Math.sin(t * 4);
      baked(ctx2, "laser:ped", (g) => {
        rr(g, -7.5, -8, 15, 13, 4);
        let gr = g.createLinearGradient(-7, 0, 7, 0);
        gr.addColorStop(0, "#f3eff9"), gr.addColorStop(1, "#bdb5d1"), g.fillStyle = gr, g.fill(), g.lineWidth = 1.8, g.strokeStyle = INK, g.stroke(), g.beginPath(), g.ellipse(0, -8, 10.5, 4.2, 0, 0, 7), g.fillStyle = "#e4dff0", g.fill(), g.stroke(), g.beginPath(), g.ellipse(0, -8, 10.5, 4.2, 0, Math.PI * 1.05, Math.PI * 1.6), g.lineWidth = 1.2, g.strokeStyle = "#fff", g.stroke();
      });
      let ra = aim + (fx > 0 ? 0 : Math.sin(t * 1.3) * 0.12);
      if (ctx2.save(), ctx2.translate(0, -13), ctx2.rotate(ra), baked(ctx2, "laser:rails", (g) => {
        for (let sy of [-3.2, 3.2])
          rr(g, 2, sy - 1.8, 18, 3.6, 1.8), g.fillStyle = "#cfc8e0", g.fill(), g.lineWidth = 1.5, g.strokeStyle = INK, g.stroke();
      }, 2), ctx2.save(), ctx2.globalAlpha = 0.35 + 0.5 * charge, ctx2.beginPath(), ctx2.moveTo(4, 0), ctx2.lineTo(19, 0), ctx2.lineWidth = 2.4, ctx2.strokeStyle = "#ff4f6d", ctx2.stroke(), ctx2.restore(), baked(ctx2, "laser:lensbox", (g) => {
        rr(g, 17, -5.5, 5, 11, 2.2), g.fillStyle = "#ffd1d8", g.fill(), g.lineWidth = 1.6, g.strokeStyle = INK, g.stroke();
      }, 2), ctx2.beginPath(), ctx2.arc(22.5, 0, 2.6 + charge * 0.6, 0, 7), ctx2.fillStyle = fx > 0 ? "#ffffff" : "#ff3d63", ctx2.fill(), ctx2.lineWidth = 1.2, ctx2.strokeStyle = INK, ctx2.stroke(), fx > 0 && (ctx2.beginPath(), ctx2.arc(22.5, 0, 6, 0, 7), ctx2.fillStyle = "rgba(255,90,120,0.4)", ctx2.fill()), baked(ctx2, "laser:shell", (g) => {
        g.beginPath(), g.ellipse(-1, 0, 10, 8.5, 0, 0, 7);
        let gr = g.createRadialGradient(-4, -4, 1, 0, 0, 11);
        gr.addColorStop(0, "#ffe7ea"), gr.addColorStop(0.55, "#ff9aaa"), gr.addColorStop(1, "#e56a80"), g.fillStyle = gr, g.fill(), g.lineWidth = 2, g.strokeStyle = INK, g.stroke();
        for (let k of [-1, 0, 1])
          g.beginPath(), g.moveTo(-9.5, k * 3.6), g.lineTo(-13.5, k * 4.4), g.lineWidth = 2.6, g.strokeStyle = INK, g.stroke(), g.lineWidth = 1.2, g.strokeStyle = "#ffd1d8", g.stroke();
      }, 2), ctx2.restore(), ctx2.save(), ctx2.translate(0, -15), ctx2.beginPath(), ctx2.arc(0, 0, 7 + charge * 1.5, 0, 7), ctx2.fillStyle = `rgba(255,80,120,${0.12 + 0.18 * charge})`, ctx2.fill(), baked(ctx2, "laser:gem", (g) => {
        g.beginPath(), g.moveTo(0, -6), g.lineTo(4.4, -1), g.lineTo(0, 4.5), g.lineTo(-4.4, -1), g.closePath();
        let gr = g.createLinearGradient(-4, -6, 4, 4);
        gr.addColorStop(0, "#fff2f5"), gr.addColorStop(0.5, "#ff6f8f"), gr.addColorStop(1, "#c8324f"), g.fillStyle = gr, g.fill(), g.lineWidth = 1.5, g.strokeStyle = INK, g.stroke(), g.beginPath(), g.moveTo(-1.6, -3.6), g.lineTo(-3, -1.2), g.lineWidth = 1.2, g.strokeStyle = "#fff", g.stroke(), g.beginPath(), g.moveTo(0, -6), g.lineTo(0, 4.5), g.lineTo(4.4, -1), g.closePath(), g.fillStyle = "rgba(160,30,60,0.28)", g.fill();
      }), ctx2.restore(), lk >= 2 && (ctx2.save(), ctx2.translate(0, -13), ctx2.rotate(aim), baked(ctx2, "laser:hood", (g) => {
        rr(g, 15, -7, 8, 14, 3), g.fillStyle = "rgba(80,70,100,0.85)", g.fill(), g.lineWidth = 1.4, g.strokeStyle = INK, g.stroke();
      }, 2), ctx2.restore()), lk >= 3) {
        let a = t * 2.2, ox = Math.cos(a) * 11, oy = -18 + Math.sin(a) * 4;
        ctx2.beginPath(), ctx2.moveTo(ox, oy - 3.5), ctx2.lineTo(ox + 2.6, oy), ctx2.lineTo(ox, oy + 3), ctx2.lineTo(ox - 2.6, oy), ctx2.closePath(), ctx2.fillStyle = "#ff9fb6", ctx2.fill(), ctx2.lineWidth = 1.1, ctx2.strokeStyle = INK, ctx2.stroke();
      }
      lk >= 5 && baked(ctx2, "laser:sinks", (g) => {
        for (let sx of [-1, 1]) for (let k of [0, 1, 2])
          g.beginPath(), g.moveTo(sx * 8, -6 + k * 3.5), g.lineTo(sx * 13, -5 + k * 3.5), g.lineWidth = 2.2, g.strokeStyle = INK, g.stroke(), g.lineWidth = 1, g.strokeStyle = "#d9d2ea", g.stroke();
      });
      break;
    }
    case "tractor": {
      bodyScale(ctx2);
      let dx = tw && tw.trailDir ? tw.trailDir.nc - tw.c : 1, dy = tw && tw.trailDir ? tw.trailDir.nr - tw.r : 0, face = dx < 0 ? -1 : 1;
      ctx2.save(), ctx2.scale(face, 1), dy && ctx2.translate(0, dy * 2);
      let bob = fx > 0 ? 0 : Math.sin(t * 9) * 0.35;
      ctx2.translate(0, bob), baked(ctx2, "tractorBody", tractorBodyPaths);
      let p = fx > 0 ? 1 - fx / 0.9 : 0, ang = fx > 0 ? p < 0.25 ? 0.35 * (p / 0.25) : p < 0.55 ? 0.35 - 1.45 * ((p - 0.25) / 0.3) : -1.1 + 1.1 * ((p - 0.55) / 0.45) : Math.sin(t * 1.5) * 0.04;
      ctx2.save(), ctx2.translate(5, -6), ctx2.rotate(ang);
      for (let oy of [-1.2, 1.2])
        ctx2.beginPath(), ctx2.moveTo(0, oy), ctx2.lineTo(12, oy + 5), ctx2.lineWidth = 3.2, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.lineWidth = 1.6, ctx2.strokeStyle = "#ffb347", ctx2.stroke();
      ctx2.translate(13, 6), ctx2.rotate(-ang * 0.6), ctx2.beginPath(), ctx2.moveTo(-1, -5), ctx2.lineTo(7, -6), ctx2.quadraticCurveTo(10, 1, 6, 5), ctx2.lineTo(-2, 5), ctx2.closePath(), ctx2.fillStyle = "#c9cfdc", ctx2.fill(), ctx2.lineWidth = 1.8, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.fillStyle = INK;
      for (let ty of [-3, 0.5, 3.5])
        ctx2.beginPath(), ctx2.moveTo(7.5, ty - 1), ctx2.lineTo(10, ty), ctx2.lineTo(7.5, ty + 1), ctx2.fill();
      if (fx > 0 && p > 0.15 && p < 0.6 && (ctx2.beginPath(), ctx2.arc(3, -5, 3, Math.PI, 0), ctx2.fillStyle = "#c8956a", ctx2.fill()), ctx2.restore(), ctx2.restore(), lk >= 2 && baked(ctx2, "tractor:lp" + (lk >= 5 ? 5 : 2), (g) => {
        rr(g, 4, -21, 3.4, 9, 1.5), g.fillStyle = "#9aa3b5", g.fill(), g.lineWidth = 1.2, g.strokeStyle = INK, g.stroke(), lk >= 5 && (g.beginPath(), g.moveTo(-16, -4), g.lineTo(-20, 2), g.lineTo(-16, 4), g.lineWidth = 2, g.strokeStyle = INK, g.stroke());
      }), lk >= 2) {
        let sp = t * 1.2 % 1;
        ctx2.globalAlpha = 0.6 * (1 - sp), ctx2.beginPath(), ctx2.arc(5.7 + sp * 2, -23 - sp * 8, 1.6 + sp * 2, 0, 7), ctx2.fillStyle = "#ffffff", ctx2.fill(), ctx2.globalAlpha = 1;
      }
      if (lk >= 3) {
        let on = Math.sin(t * 7) > 0;
        baked(ctx2, "tractor:beacon" + (on ? 1 : 0), (g) => {
          rr(g, -9, -27, 6, 4, 2), g.fillStyle = on ? "#ffb347" : "#ffe0a8", g.fill(), g.lineWidth = 1.2, g.strokeStyle = INK, g.stroke();
        });
      }
      break;
    }
    case "zapper": {
      pad(ctx2, tpad("zapper", "#c5e4ff")), baked(ctx2, "zap:stem", (g) => {
        rr(g, -3, -8, 6, 12, 2), g.fillStyle = "#9aa3b5", g.fill(), g.lineWidth = 1.8, g.strokeStyle = INK, g.stroke();
      });
      let glow = 0.5 + Math.sin(t * 6) * 0.2 + (fx > 0 ? 0.5 : 0);
      if (ctx2.beginPath(), ctx2.arc(0, -20, 15, 0, 7), ctx2.fillStyle = `rgba(150,200,255,${0.25 * glow})`, ctx2.fill(), baked(ctx2, "zap:box", (g) => {
        rr(g, -11, -29, 22, 22, 7), g.fillStyle = "#4a58b0", g.fill(), g.lineWidth = 2.2, g.strokeStyle = INK, g.stroke(), rr(g, -11, -31, 22, 22, 7), g.fillStyle = "#6a7ad8", g.fill(), g.stroke(), g.beginPath(), g.moveTo(-7, -29.2), g.lineTo(7, -29.2), g.lineWidth = 1.6, g.strokeStyle = "rgba(255,255,255,0.5)", g.stroke();
      }), rr(ctx2, -7.5, -27.5, 15, 15, 4), ctx2.fillStyle = `rgba(190,170,255,${0.7 + 0.3 * glow})`, ctx2.fill(), baked(ctx2, "zap:top" + (lk >= 5 ? 5 : lk >= 2 ? 2 : 1), (g) => {
        g.strokeStyle = "#f2f4ff", g.lineWidth = 1.3;
        for (let k = -1; k <= 1; k++)
          g.beginPath(), g.moveTo(-7, -20 + k * 4.5), g.lineTo(7, -20 + k * 4.5), g.stroke();
        g.beginPath(), g.moveTo(-8, -32), g.quadraticCurveTo(0, -38, 8, -32), g.lineWidth = 2.2, g.strokeStyle = INK, g.stroke(), rr(g, -9.5, -29.5, 4, 18, 2), g.fillStyle = "rgba(255,255,255,0.3)", g.fill();
        for (let k = 0; k < 3; k++)
          g.beginPath(), g.ellipse(0, -2 - k * 2.6, 4.2, 1.3, 0, 0, 7), g.lineWidth = 1.2, g.strokeStyle = "#f2b54a", g.stroke();
        if (lk >= 2) for (let k = 0; k < 2; k++)
          g.beginPath(), g.ellipse(0, -10 + k * 2.6, 6, 1.6, 0, 0, 7), g.lineWidth = 1.4, g.strokeStyle = "#f2b54a", g.stroke();
        lk >= 5 && (g.beginPath(), g.moveTo(0, -36), g.lineTo(0, -44), g.lineWidth = 2, g.strokeStyle = INK, g.stroke(), blob(g, 0, -45, 2.4, 2.4, "#fff3a0", 1.1));
      }), (Math.sin(t * 9) > 0.7 || fx > 0) && (ctx2.beginPath(), ctx2.moveTo(9, -34), ctx2.lineTo(12, -38), ctx2.lineTo(10, -38.5), ctx2.lineTo(14, -43), ctx2.lineWidth = 1.6, ctx2.strokeStyle = "#fff3a0", ctx2.stroke()), lk >= 3) for (let s2 of [-1, 1]) {
        let on = Math.sin(t * 6 + s2) > 0;
        baked(ctx2, "zap:lamp" + s2 + (on ? 1 : 0), (g) => blob(g, s2 * 14, -26, 3.2, 3.2, on ? "#fff3a0" : "#c9d4ff", 1.3));
      }
      break;
    }
  }
  if (heroGloss(ctx2, type, lvl), lvl >= 6) {
    let side = T.place === "side";
    if (baked(ctx2, "crown" + (side ? "s" : "p"), (g) => {
      g.translate(side ? 13 : 11, side ? -24 : -14), g.beginPath(), g.moveTo(-5, 3), g.lineTo(-6, -4), g.lineTo(-2.5, -1), g.lineTo(0, -6), g.lineTo(2.5, -1), g.lineTo(6, -4), g.lineTo(5, 3), g.closePath(), g.fillStyle = "#ffd45e", g.fill(), g.lineWidth = 1.6, g.strokeStyle = INK, g.stroke();
    }), side) {
      baked(ctx2, "pennantPole", (g) => {
        g.translate(-15, 2), g.beginPath(), g.moveTo(0, 6), g.lineTo(0, -26), g.lineWidth = 2.2, g.strokeStyle = INK, g.stroke(), g.lineWidth = 1, g.strokeStyle = "#e8d9c8", g.stroke();
      }), ctx2.save(), ctx2.translate(-15, 2);
      let wv = Math.sin(t * 5) * 1.5;
      ctx2.beginPath(), ctx2.moveTo(0, -26), ctx2.quadraticCurveTo(6, -24 + wv, 11, -22 + wv), ctx2.lineTo(0, -18), ctx2.closePath(), ctx2.fillStyle = "#ff8fab", ctx2.fill(), ctx2.lineWidth = 1.4, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.restore();
    }
  }
  BODYK = 1, BOBV = null, ctx2.restore();
}
function plinthPaths(ctx2) {
  ctx2.beginPath(), ctx2.ellipse(0, 11, 22, 10, 0, 0, 7), ctx2.fillStyle = "#d8ccd4", ctx2.fill(), ctx2.lineWidth = 2, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.ellipse(0, 9.5, 21, 8.6, 0, Math.PI * 1.05, Math.PI * 1.6), ctx2.lineWidth = 1.4, ctx2.strokeStyle = "#f6f0f3", ctx2.stroke();
  for (let a of [0.25, 0.95, 1.6, 2.25, 2.9])
    ctx2.beginPath(), ctx2.arc(Math.cos(a) * 19, 11 + Math.sin(a) * 8.4, 1.7, 0, 7), ctx2.fillStyle = "#ffd45e", ctx2.fill(), ctx2.lineWidth = 0.9, ctx2.strokeStyle = INK, ctx2.stroke();
}
function tractorBodyPaths(ctx2) {
  shadow(ctx2, 0, 9, 18, 5, 0.24), rr(ctx2, -12, -10, 25, 13, 5);
  let g = ctx2.createLinearGradient(0, -10, 0, 3);
  g.addColorStop(0, ART81 ? "#eeb040" : "#ffe39e"), g.addColorStop(1, ART81 ? "#cf8a00" : "#f2b84a"), ctx2.fillStyle = g, ctx2.fill(), ctx2.lineWidth = 2, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.moveTo(-8, -8.2), ctx2.lineTo(9, -8.2), ctx2.lineWidth = 1.5, ctx2.strokeStyle = "rgba(255,255,255,0.55)", ctx2.stroke(), rr(ctx2, -13, -23, 13, 15, 3), ctx2.fillStyle = ART81 ? "#e3a020" : "#ffd27a", ctx2.fill(), ctx2.lineWidth = 2, ctx2.strokeStyle = INK, ctx2.stroke(), rr(ctx2, -10.5, -20.5, 8, 8, 2), ctx2.fillStyle = "#bfe6ff", ctx2.fill(), ctx2.lineWidth = 1.3, ctx2.stroke(), ctx2.beginPath(), ctx2.moveTo(-9, -19), ctx2.lineTo(-6, -16), ctx2.lineWidth = 1.2, ctx2.strokeStyle = "#ffffff", ctx2.stroke(), rr(ctx2, -15, -25.5, 17, 4, 2), ctx2.fillStyle = "#ff8fab", ctx2.fill(), ctx2.lineWidth = 1.6, ctx2.strokeStyle = INK, ctx2.stroke();
  for (let ex of [6, 10.5])
    ctx2.beginPath(), ctx2.ellipse(ex, -5.5, 1.7, 2.1, 0, 0, 7), ctx2.fillStyle = INK, ctx2.fill(), ctx2.beginPath(), ctx2.arc(ex + 0.5, -6.3, 0.6, 0, 7), ctx2.fillStyle = "#fff", ctx2.fill();
  ctx2.beginPath(), ctx2.arc(8.3, -2.6, 2, 0.2, Math.PI - 0.2), ctx2.lineWidth = 1.2, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.ellipse(3.5, -2.5, 1.6, 1, 0, 0, 7), ctx2.fillStyle = "rgba(255,112,140,0.55)", ctx2.fill();
  for (let [wx, wy, r] of [[-7, 3, 8.5], [8, 5.5, 5.2]]) {
    ctx2.beginPath(), ctx2.arc(wx, wy, r, 0, 7), ctx2.fillStyle = "#5a4652", ctx2.fill(), ctx2.lineWidth = 2, ctx2.strokeStyle = INK, ctx2.stroke();
    for (let k = 0; k < 8; k++) {
      let a = k * Math.PI / 4;
      ctx2.beginPath(), ctx2.moveTo(wx + Math.cos(a) * (r - 1.6), wy + Math.sin(a) * (r - 1.6)), ctx2.lineTo(wx + Math.cos(a) * r, wy + Math.sin(a) * r), ctx2.lineWidth = 1.4, ctx2.strokeStyle = "#3d2a36", ctx2.stroke();
    }
    ctx2.beginPath(), ctx2.arc(wx, wy, r * 0.48, 0, 7), ctx2.fillStyle = "#c9b6a0", ctx2.fill(), ctx2.lineWidth = 1.3, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.arc(wx, wy, r * 0.82, Math.PI * 1.1, Math.PI * 1.45), ctx2.lineWidth = 1.5, ctx2.strokeStyle = "rgba(255,255,255,0.4)", ctx2.stroke(), ctx2.beginPath(), ctx2.arc(wx, wy, r * 0.16, 0, 7), ctx2.fillStyle = INK, ctx2.fill();
  }
  g = null;
}
function pathStuds(ctx2, t) {
  for (let [x, y] of [[-15, -9], [15, -9], [-15, 15], [15, 15]])
    ctx2.save(), ctx2.translate(x, y + Math.sin(t * 3 + x) * 0.6), baked(ctx2, "stud", (g) => starShape(g, 0, 0, 2.8, "#ffd45e", 1)), ctx2.restore();
}
function levelParts(ctx2, type, lvl, t, fx, aim) {
  if (lvl < 2) return;
  let L2 = lvl >= 2, L3 = lvl >= 3, L5 = lvl >= 5;
  ctx2.save(), ctx2.lineJoin = "round", ctx2.lineCap = "round";
  let steel = (x, y, w, h, r = 1.5) => {
    rr(ctx2, x, y, w, h, r), ctx2.fillStyle = "#c9cfdc", ctx2.fill(), ctx2.lineWidth = 1.3, ctx2.strokeStyle = INK, ctx2.stroke();
  };
  switch (type) {
    case "slingshot": {
      let face = Math.cos(aim) >= 0 ? 1 : -1;
      if (ctx2.scale(face, 1), L2) for (let sx of [-8, 8]) steel(sx - 3, -21, 6, 5, 2);
      if (L3 && (ctx2.beginPath(), ctx2.moveTo(-8, -14), ctx2.lineTo(-1, -9), ctx2.lineTo(8, -14), ctx2.lineWidth = 1.6, ctx2.strokeStyle = "#ffb3c1", ctx2.stroke(), blob(ctx2, 7, 4, 4.5, 3.6, "#c98a55", 1.3), blob(ctx2, 6, 2, 1.6, 1.4, "#f3d2a2", 0.8)), L5) {
        rr(ctx2, -15, -2, 7, 9, 2), ctx2.fillStyle = "#e0b07a", ctx2.fill(), ctx2.lineWidth = 1.3, ctx2.strokeStyle = INK, ctx2.stroke();
        for (let [x, y] of [[-13, -3], [-10, -4]]) blob(ctx2, x, y, 2, 2, "#c9c2d6", 1);
      }
      break;
    }
    case "spray": {
      L2 && (rr(ctx2, -9, -26, 6, 3, 1), ctx2.fillStyle = "#8fd17d", ctx2.fill(), ctx2.lineWidth = 1.2, ctx2.strokeStyle = INK, ctx2.stroke()), L3 && (rr(ctx2, 9, -12, 7, 15, 3), ctx2.fillStyle = "#9be38a", ctx2.fill(), ctx2.lineWidth = 1.6, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.moveTo(12.5, -12), ctx2.quadraticCurveTo(13, -22, 6, -24), ctx2.lineWidth = 1.6, ctx2.stroke()), L5 && (ctx2.beginPath(), ctx2.arc(-11, -16, 4, 0, 7), ctx2.fillStyle = "#fff", ctx2.fill(), ctx2.lineWidth = 1.3, ctx2.strokeStyle = INK, ctx2.stroke());
      break;
    }
    case "sound": {
      if (L2 && (blob(ctx2, 0, -25, 4, 4, "#5b4a7a", 1.5), ctx2.beginPath(), ctx2.arc(0, -25, 1.8, 0, 7), ctx2.fillStyle = "#e8ddff", ctx2.fill()), L3) for (let sx of [-1, 1])
        rr(ctx2, sx * 15 - (sx < 0 ? 7 : 0), -14, 7, 14, 3), ctx2.fillStyle = "#b39ee6", ctx2.fill(), ctx2.lineWidth = 1.6, ctx2.strokeStyle = INK, ctx2.stroke(), blob(ctx2, sx * 18.5, -7, 2.3, 2.3, "#5b4a7a", 1);
      L5 && (ctx2.beginPath(), ctx2.moveTo(6, -21), ctx2.lineTo(10, -31), ctx2.lineWidth = 1.6, ctx2.strokeStyle = INK, ctx2.stroke(), blob(ctx2, 10, -32, 2.2, 2.2, "#ff8fab", 1.1));
      break;
    }
    case "ball": {
      if (L3) {
        let hg = ctx2.createRadialGradient(0, -14, 8, 0, -14, 19);
        hg.addColorStop(0, "rgba(244,182,50,0)"), hg.addColorStop(0.3, "rgba(244,182,50,0.35)"), hg.addColorStop(1, "rgba(244,182,50,0)"), ctx2.save(), ctx2.beginPath(), ctx2.rect(-30, -13, 60, 40), ctx2.clip(), ctx2.fillStyle = hg, ctx2.beginPath(), ctx2.arc(0, -14, 19, 0, 7), ctx2.fill(), ctx2.restore(), ctx2.beginPath(), ctx2.ellipse(0, -14, 10.4, 4.2, 0, 0.12, Math.PI - 0.12), ctx2.lineWidth = 2.2, ctx2.strokeStyle = "#f4b632", ctx2.stroke();
      }
      if (L5) for (let [x, y] of [[-14, 2], [-11, -2], [-15, -3]]) marble(ctx2, x, y, 3, x);
      break;
    }
    case "lizard": {
      let face = Math.cos(aim) >= 0 ? 1 : -1;
      if (ctx2.scale(face, 1), L2) for (let x of [-9, -4, 1])
        ctx2.beginPath(), ctx2.moveTo(x - 2, -4), ctx2.lineTo(x, -9), ctx2.lineTo(x + 2, -4), ctx2.closePath(), ctx2.fillStyle = "#ffb36b", ctx2.fill(), ctx2.lineWidth = 1.1, ctx2.strokeStyle = INK, ctx2.stroke();
      L3 && (ctx2.beginPath(), ctx2.ellipse(9, -11, 8.5, 2.2, 0, Math.PI, 0), ctx2.lineWidth = 2.6, ctx2.strokeStyle = "#ff6f91", ctx2.stroke());
      break;
    }
    case "pheromone": {
      if (L2 && (rr(ctx2, -2, -23, 4, 5, 1.5), ctx2.fillStyle = "#ff9ec0", ctx2.fill(), ctx2.lineWidth = 1.2, ctx2.strokeStyle = INK, ctx2.stroke()), L3)
        for (let sx of [-1, 1])
          ctx2.beginPath(), ctx2.ellipse(sx * 4, -12, 4, 2.2, sx * 0.4, 0, 7), ctx2.fillStyle = "#c9b6f2", ctx2.fill(), ctx2.lineWidth = 1.1, ctx2.strokeStyle = INK, ctx2.stroke();
      L5 && (rr(ctx2, 9, -4, 6, 9, 3), ctx2.fillStyle = "#ffd9ec", ctx2.fill(), ctx2.lineWidth = 1.3, ctx2.strokeStyle = INK, ctx2.stroke());
      break;
    }
    case "lava": {
      if (L2) for (let [x, y] of [[-16, 2], [16, 3], [-8, 10], [9, 10]]) blob(ctx2, x, y, 3, 2.2, "#8c7a86", 1.1);
      L3 && (ctx2.beginPath(), ctx2.moveTo(-5, 3), ctx2.lineTo(-2, -5), ctx2.lineTo(2, -5), ctx2.lineTo(5, 3), ctx2.closePath(), ctx2.fillStyle = "#7a4238", ctx2.fill(), ctx2.lineWidth = 1.4, ctx2.strokeStyle = INK, ctx2.stroke(), blob(ctx2, 0, -5, 2.2, 1, "#ffb347", 0.8));
      break;
    }
  }
  ctx2.restore();
}
function towerSize(tw) {
  let T = TOWERS[tw.type], v = 1;
  for (let i = 0; i < (tw.lvl || 1) - 1; i++) T.upgrades[i] && T.upgrades[i].ballRadius && (v *= T.upgrades[i].ballRadius);
  return v;
}
function stunStars(ctx2, x, y, t, s = 1) {
  for (let i = 0; i < 3; i++) {
    let a = t * 6 + i * 2.1;
    starShape(ctx2, x + Math.cos(a) * 9 * s, y + Math.sin(a) * 3, 2.6, "#fff27a", 1);
  }
}
function lavaBorder(ctx2, x, y, w, h, r, t) {
  ctx2.save(), rr(ctx2, x, y, w, h, r), ctx2.lineWidth = 6, ctx2.strokeStyle = "#c0281e", ctx2.stroke(), ctx2.setLineDash([10, 8]), ctx2.lineDashOffset = -t * 40, ctx2.lineWidth = 3.5, ctx2.strokeStyle = "#ff9a2e", ctx2.stroke(), ctx2.setLineDash([3, 15]), ctx2.lineDashOffset = t * 25, ctx2.lineWidth = 2, ctx2.strokeStyle = "#ffe36e", ctx2.stroke(), ctx2.restore();
}
function marble(ctx2, x, y, r, rot = 0) {
  shadow(ctx2, x, y + r * 0.9, r * 0.9, r * 0.3, 0.2), blob(ctx2, x, y, r, r, "#7fc4f0", 2), ctx2.save(), ctx2.beginPath(), ctx2.arc(x, y, r - 1, 0, 7), ctx2.clip(), ctx2.strokeStyle = "rgba(255,255,255,0.7)", ctx2.lineWidth = r * 0.35, ctx2.beginPath(), ctx2.ellipse(x, y, r * 0.9, r * 0.35, rot, 0, 7), ctx2.stroke(), ctx2.restore(), ctx2.beginPath(), ctx2.arc(x - r * 0.35, y - r * 0.4, r * 0.22, 0, 7), ctx2.fillStyle = "#fff", ctx2.fill();
}
function heart(ctx2, x, y, s, col) {
  ctx2.beginPath(), ctx2.moveTo(x, y + s), ctx2.bezierCurveTo(x - s * 2, y - s * 0.5, x - s * 0.8, y - s * 2, x, y - s * 0.7), ctx2.bezierCurveTo(x + s * 0.8, y - s * 2, x + s * 2, y - s * 0.5, x, y + s), ctx2.fillStyle = col, ctx2.fill(), ctx2.lineWidth = 1.2, ctx2.strokeStyle = INK, ctx2.stroke();
}
function drawBonusIcon(ctx2, type, t = 0) {
  if (ctx2.save(), ctx2.lineJoin = "round", ctx2.lineCap = "round", type === "bomb")
    blob(ctx2, 0, 2, 11, 11, "#5f5a78"), ctx2.beginPath(), ctx2.arc(-4, -2, 3, 0, 7), ctx2.fillStyle = "rgba(255,255,255,0.5)", ctx2.fill(), rr(ctx2, -3.5, -12, 7, 5, 2), ctx2.fillStyle = "#9a96b0", ctx2.fill(), ctx2.lineWidth = 1.8, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.moveTo(0, -12), ctx2.quadraticCurveTo(5, -18, 9, -15), ctx2.lineWidth = 1.8, ctx2.stroke(), starShape(ctx2, 9, -15, 4 + Math.sin(t * 20), "#ffd45e", 1.2);
  else if (type === "plane")
    ctx2.save(), ctx2.rotate(-0.15), rr(ctx2, -13, -4, 24, 9, 4.5), ctx2.fillStyle = "#ffd36e", ctx2.fill(), ctx2.lineWidth = 2, ctx2.strokeStyle = INK, ctx2.stroke(), rr(ctx2, -5, -12, 8, 24, 3), ctx2.fillStyle = "#ff8c8c", ctx2.fill(), ctx2.stroke(), ctx2.beginPath(), ctx2.moveTo(-13, 0), ctx2.lineTo(-17, -7), ctx2.lineTo(-11, -3), ctx2.closePath(), ctx2.fillStyle = "#ff8c8c", ctx2.fill(), ctx2.stroke(), ctx2.beginPath(), ctx2.arc(2, -3, 2.6, 0, 7), ctx2.fillStyle = "#bfe7ff", ctx2.fill(), ctx2.stroke(), ctx2.beginPath(), ctx2.ellipse(12, 0, 1.5, 6 * Math.abs(Math.sin(t * 30)) + 1, 0, 0, 7), ctx2.fillStyle = "#ccc", ctx2.fill(), ctx2.restore();
  else if (type === "freeze") {
    blob(ctx2, 0, 0, 12, 12, "#bfe9ff"), ctx2.strokeStyle = "#ffffff", ctx2.lineWidth = 2.4;
    for (let k = 0; k < 3; k++) {
      let a = k * Math.PI / 3;
      ctx2.beginPath(), ctx2.moveTo(Math.cos(a) * 8, Math.sin(a) * 8), ctx2.lineTo(-Math.cos(a) * 8, -Math.sin(a) * 8), ctx2.stroke();
    }
    ctx2.strokeStyle = "#6fb8e8", ctx2.lineWidth = 1;
    for (let k = 0; k < 3; k++) {
      let a = k * Math.PI / 3;
      ctx2.beginPath(), ctx2.moveTo(Math.cos(a) * 8, Math.sin(a) * 8), ctx2.lineTo(-Math.cos(a) * 8, -Math.sin(a) * 8), ctx2.stroke();
    }
  } else type === "decoy" && sugarCube(ctx2, 0, 2, 10);
  ctx2.restore();
}
function sugarCube(ctx2, x, y, s) {
  ctx2.save(), ctx2.translate(x, y), ctx2.lineJoin = "round", ctx2.beginPath(), ctx2.moveTo(-s, -s * 0.4), ctx2.lineTo(0, -s), ctx2.lineTo(s, -s * 0.4), ctx2.lineTo(s, s * 0.6), ctx2.lineTo(0, s * 1.1), ctx2.lineTo(-s, s * 0.6), ctx2.closePath(), ctx2.fillStyle = "#fffaf0", ctx2.fill(), ctx2.lineWidth = 2, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.moveTo(-s, -s * 0.4), ctx2.lineTo(0, s * 0.15), ctx2.lineTo(s, -s * 0.4), ctx2.moveTo(0, s * 0.15), ctx2.lineTo(0, s * 1.1), ctx2.lineWidth = 1.4, ctx2.stroke(), ctx2.beginPath(), ctx2.moveTo(0, s * 0.15), ctx2.lineTo(s, -s * 0.4), ctx2.lineTo(s, s * 0.6), ctx2.lineTo(0, s * 1.1), ctx2.closePath(), ctx2.fillStyle = "rgba(200,180,160,0.35)", ctx2.fill(), ctx2.fillStyle = "#e8dccb";
  for (let [a, b] of [[-4, 2], [-6, -1], [3, -5], [-2, -6]])
    ctx2.fillRect(a * s / 10, b * s / 10, 1.4, 1.4);
  ctx2.restore();
}
function cookieFace(pct) {
  for (let f of UI.cookieFaces) if (pct >= f.min) return f.face;
  return "fainted";
}
function cookieBody(ctx2, r, pct) {
  ctx2.save();
  let bites = Math.round((1 - pct) * 9);
  ctx2.beginPath(), ctx2.arc(0, 0, r, 0, Math.PI * 2);
  for (let k = 0; k < bites; k++) {
    let a = -0.6 + k * 0.72, bx = Math.cos(a) * r * 0.98, by = Math.sin(a) * r * 0.98;
    ctx2.moveTo(bx + 9, by), ctx2.arc(bx, by, 9, 0, Math.PI * 2, !0);
  }
  ctx2.clip("evenodd");
  let g = ctx2.createRadialGradient(-8, -10, 4, 0, 0, r * 1.1);
  g.addColorStop(0, "#ffe2a8"), g.addColorStop(0.7, "#f2b866"), g.addColorStop(1, "#d58f3f"), ctx2.beginPath(), ctx2.arc(0, 0, r, 0, 7), ctx2.fillStyle = g, ctx2.fill(), ctx2.fillStyle = "#6b3d2a";
  for (let [a, b, s] of [[-12, -8, 3.4], [9, -12, 3], [14, 5, 3.6], [-4, 13, 3.2], [-16, 7, 2.6], [3, -2, 2.4], [-6, -17, 2.2], [18, -6, 2]])
    ctx2.beginPath(), ctx2.ellipse(a, b, s, s * 0.8, a, 0, 7), ctx2.fill();
  ctx2.restore(), ctx2.beginPath(), ctx2.arc(0, 0, r, 0, 7), ctx2.lineWidth = 3, ctx2.strokeStyle = INK, ctx2.save(), ctx2.beginPath(), ctx2.rect(-r - 12, -r - 12, r * 2 + 24, r * 2 + 24);
  for (let k = 0; k < bites; k++) {
    let a = -0.6 + k * 0.72;
    ctx2.moveTo(Math.cos(a) * r * 0.98 + 9, Math.sin(a) * r * 0.98), ctx2.arc(Math.cos(a) * r * 0.98, Math.sin(a) * r * 0.98, 9, 0, Math.PI * 2, !0);
  }
  ctx2.clip("evenodd"), ctx2.beginPath(), ctx2.arc(0, 0, r, 0, 7), ctx2.stroke(), ctx2.restore(), ctx2.save(), ctx2.beginPath(), ctx2.arc(0, 0, r + 1, 0, 7), ctx2.clip();
  for (let k = 0; k < bites; k++) {
    let a = -0.6 + k * 0.72;
    ctx2.beginPath(), ctx2.arc(Math.cos(a) * r * 0.98, Math.sin(a) * r * 0.98, 9, 0, 7), ctx2.lineWidth = 3, ctx2.strokeStyle = INK, ctx2.stroke();
  }
  ctx2.restore();
}
function cakeBody(ctx2, r, pct) {
  let w = r * 1.05, h = r * 0.95, cut = Math.round((1 - pct) * 4);
  ctx2.save(), ctx2.beginPath(), ctx2.roundRect(-w, -h * 0.55, w * 2, h * 1.35, 6), cut && ctx2.rect(w - cut * w * 0.42, -h * 0.6, cut * w * 0.42 + 1, h * 1.5), ctx2.clip("evenodd");
  let g = ctx2.createLinearGradient(0, -h, 0, h);
  g.addColorStop(0, "#ffd9e6"), g.addColorStop(1, "#f2a7c0"), ctx2.beginPath(), ctx2.roundRect(-w, -h * 0.55, w * 2, h * 1.35, 6), ctx2.fillStyle = g, ctx2.fill(), ctx2.fillStyle = "#fff6f0", ctx2.fillRect(-w, h * 0.18, w * 2, 4), ctx2.beginPath(), ctx2.moveTo(-w, -h * 0.5);
  for (let k = 0; k <= 8; k++) ctx2.quadraticCurveTo(-w + (k - 0.5) * w / 4, -h * 0.5 + 8, -w + k * w / 4, -h * 0.5);
  ctx2.lineTo(w, -h * 0.62), ctx2.lineTo(-w, -h * 0.62), ctx2.fillStyle = "#fffaf2", ctx2.fill(), ctx2.beginPath(), ctx2.roundRect(-w, -h * 0.55, w * 2, h * 1.35, 6), ctx2.lineWidth = 3, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.restore(), ctx2.beginPath(), ctx2.arc(0, -h * 0.75, 4.5, 0, 7), ctx2.fillStyle = "#e8304e", ctx2.fill(), ctx2.lineWidth = 1.6, ctx2.strokeStyle = INK, ctx2.stroke();
}
function pieBody(ctx2, r, pct) {
  let bites = Math.round((1 - pct) * 9), bAt = (k) => {
    let a = -0.6 + k * 0.72;
    return [Math.cos(a) * r * 0.98, Math.sin(a) * r * 0.98];
  };
  ctx2.save(), ctx2.beginPath(), ctx2.arc(0, 0, r, 0, Math.PI * 2);
  for (let k = 0; k < bites; k++) {
    let [bx, by] = bAt(k);
    ctx2.moveTo(bx + 9, by), ctx2.arc(bx, by, 9, 0, Math.PI * 2, !0);
  }
  ctx2.clip("evenodd");
  let g = ctx2.createRadialGradient(-8, -10, 4, 0, 0, r * 1.1);
  g.addColorStop(0, "#fff0c4"), g.addColorStop(0.7, "#f3c878"), g.addColorStop(1, "#d99a4a"), ctx2.beginPath(), ctx2.arc(0, 0, r, 0, 7), ctx2.fillStyle = g, ctx2.fill(), ctx2.beginPath(), ctx2.arc(0, 0, r - 1, 0, 7), ctx2.lineWidth = 7, ctx2.strokeStyle = "#e2a65c", ctx2.stroke(), ctx2.fillStyle = "#c98a3e";
  for (let k = 0; k < 18; k++) {
    let a = k * Math.PI / 9;
    ctx2.beginPath(), ctx2.arc(Math.cos(a) * (r - 3.4), Math.sin(a) * (r - 3.4), 1.7, 0, 7), ctx2.fill();
  }
  ctx2.save(), ctx2.beginPath(), ctx2.arc(0, 0, r - 7, 0, 7), ctx2.clip(), ctx2.fillStyle = "#f0a58f", ctx2.fillRect(-r, -r, r * 2, r * 2), ctx2.lineWidth = 4.2, ctx2.strokeStyle = "#fbe0a0", ctx2.lineCap = "butt";
  for (let k = -3; k <= 3; k++)
    ctx2.beginPath(), ctx2.moveTo(-r, -r + k * 12 + 4), ctx2.lineTo(r, r + k * 12 + 4), ctx2.stroke(), ctx2.beginPath(), ctx2.moveTo(r, -r + k * 12 + 4), ctx2.lineTo(-r, r + k * 12 + 4), ctx2.stroke();
  ctx2.restore(), ctx2.beginPath(), ctx2.arc(0, 0, r - 7, 0, 7), ctx2.lineWidth = 1.6, ctx2.strokeStyle = "rgba(122,70,30,0.7)", ctx2.stroke(), ctx2.restore(), ctx2.save(), ctx2.beginPath(), ctx2.rect(-r - 12, -r - 12, r * 2 + 24, r * 2 + 24);
  for (let k = 0; k < bites; k++) {
    let [bx, by] = bAt(k);
    ctx2.moveTo(bx + 9, by), ctx2.arc(bx, by, 9, 0, Math.PI * 2, !0);
  }
  ctx2.clip("evenodd"), ctx2.beginPath(), ctx2.arc(0, 0, r, 0, 7), ctx2.lineWidth = 3, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.restore(), ctx2.save(), ctx2.beginPath(), ctx2.arc(0, 0, r + 1, 0, 7), ctx2.clip();
  for (let k = 0; k < bites; k++) {
    let [bx, by] = bAt(k);
    ctx2.beginPath(), ctx2.arc(bx, by, 9, 0, 7), ctx2.lineWidth = 3, ctx2.strokeStyle = INK, ctx2.stroke();
  }
  ctx2.restore();
}
function sundaeBody(ctx2, r, pct) {
  let bites = Math.round((1 - pct) * 9), bAt = (k) => {
    let a = -0.6 + k * 0.72;
    return [Math.cos(a) * r * 0.98, Math.sin(a) * r * 0.98];
  };
  ctx2.save(), ctx2.beginPath(), ctx2.arc(0, 0, r, 0, Math.PI * 2);
  for (let k = 0; k < bites; k++) {
    let [bx, by] = bAt(k);
    ctx2.moveTo(bx + 9, by), ctx2.arc(bx, by, 9, 0, Math.PI * 2, !0);
  }
  ctx2.clip("evenodd");
  let g = ctx2.createRadialGradient(-8, -10, 4, 0, 0, r * 1.1);
  g.addColorStop(0, "#fff3f6"), g.addColorStop(0.7, "#ffc4d6"), g.addColorStop(1, "#f08fb0"), ctx2.beginPath(), ctx2.arc(0, 0, r, 0, 7), ctx2.fillStyle = g, ctx2.fill(), ctx2.beginPath(), ctx2.arc(0, 0, r - 1, 0, 7), ctx2.lineWidth = 6, ctx2.strokeStyle = "#d6f1ea", ctx2.stroke(), ctx2.beginPath(), ctx2.arc(0, 0, r - 4.2, 0, 7), ctx2.lineWidth = 1.4, ctx2.strokeStyle = "rgba(80,150,135,0.7)", ctx2.stroke(), ctx2.lineWidth = 3.4, ctx2.strokeStyle = "#7a4a34", ctx2.lineCap = "round", ctx2.beginPath(), ctx2.moveTo(-r + 7, -9);
  for (let k = 0; k < 5; k++) ctx2.quadraticCurveTo(-r + 7 + k * 9 + 4.5, -9 + (k % 2 ? 8 : -8), -r + 7 + (k + 1) * 9, -9);
  ctx2.stroke(), ctx2.beginPath(), ctx2.moveTo(-r + 10, 15);
  for (let k = 0; k < 4; k++) ctx2.quadraticCurveTo(-r + 10 + k * 10 + 5, 15 + (k % 2 ? -7 : 7), -r + 10 + (k + 1) * 10, 15);
  ctx2.stroke();
  for (let [x, y, c, a] of [[-14, -17, "#ffe27a", 0.6], [12, -15, "#8fd0f7", -0.5], [17, 8, "#ffffff", 0.9], [-17, 3, "#ffe27a", -0.3], [5, 18, "#8fd0f7", 0.4], [-6, 19, "#ffffff", 1.2], [20, -3, "#ffe27a", 0.2]])
    ctx2.save(), ctx2.translate(x, y), ctx2.rotate(a), ctx2.fillStyle = c, ctx2.fillRect(-2.2, -0.8, 4.4, 1.7), ctx2.restore();
  ctx2.restore(), blob(ctx2, -r * 0.5, -r * 0.62, 4.4, 4.4, "#e8304e", 1.8), ctx2.beginPath(), ctx2.moveTo(-r * 0.5, -r * 0.62 - 3.8), ctx2.quadraticCurveTo(-r * 0.5 + 3, -r * 0.62 - 8, -r * 0.5 + 6.5, -r * 0.62 - 8), ctx2.lineWidth = 1.8, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.save(), ctx2.beginPath(), ctx2.rect(-r - 12, -r - 12, r * 2 + 24, r * 2 + 24);
  for (let k = 0; k < bites; k++) {
    let [bx, by] = bAt(k);
    ctx2.moveTo(bx + 9, by), ctx2.arc(bx, by, 9, 0, Math.PI * 2, !0);
  }
  ctx2.clip("evenodd"), ctx2.beginPath(), ctx2.arc(0, 0, r, 0, 7), ctx2.lineWidth = 3, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.restore(), ctx2.save(), ctx2.beginPath(), ctx2.arc(0, 0, r + 1, 0, 7), ctx2.clip();
  for (let k = 0; k < bites; k++) {
    let [bx, by] = bAt(k);
    ctx2.beginPath(), ctx2.arc(bx, by, 9, 0, 7), ctx2.lineWidth = 3, ctx2.strokeStyle = INK, ctx2.stroke();
  }
  ctx2.restore();
}
var DONUT_SPR = [[-16, -15, "#ffe27a", 0.6], [15, -16, "#8fd0f7", -0.5], [-21, 5, "#ffffff", 0.2], [21, 4, "#a8e6a1", 1.1], [-12, 20, "#ff6f91", 0.9], [13, 20, "#ffe27a", -0.4]];
function donutBody(ctx2, r, pct) {
  let bites = Math.round((1 - pct) * 9), bAt = (k) => {
    let a = -0.6 + k * 0.72;
    return [Math.cos(a) * r * 0.98, Math.sin(a) * r * 0.98];
  };
  ctx2.save(), ctx2.beginPath(), ctx2.arc(0, 0, r, 0, Math.PI * 2);
  for (let k = 0; k < bites; k++) {
    let [bx, by] = bAt(k);
    ctx2.moveTo(bx + 9, by), ctx2.arc(bx, by, 9, 0, Math.PI * 2, !0);
  }
  ctx2.clip("evenodd");
  let g = ctx2.createRadialGradient(-8, -10, 4, 0, 0, r * 1.1);
  g.addColorStop(0, "#fbe3b0"), g.addColorStop(0.7, "#e9b266"), g.addColorStop(1, "#c98a3e"), ctx2.beginPath(), ctx2.arc(0, 0, r, 0, 7), ctx2.fillStyle = g, ctx2.fill(), ctx2.beginPath();
  for (let k = 0; k <= 48; k++) {
    let a = k / 48 * Math.PI * 2, rr2 = r * 0.8 + Math.sin(a * 7) * 2.2;
    (k ? ctx2.lineTo : ctx2.moveTo).call(ctx2, Math.cos(a) * rr2, Math.sin(a) * rr2);
  }
  ctx2.closePath();
  let ig = ctx2.createRadialGradient(-8, -10, 3, 0, 0, r * 0.9);
  ig.addColorStop(0, "#ffdbe6"), ig.addColorStop(0.65, "#f7b6c8"), ig.addColorStop(1, "#ec97b2"), ctx2.fillStyle = ig, ctx2.fill(), ctx2.lineWidth = 1.8, ctx2.strokeStyle = "rgba(82,60,75,0.7)", ctx2.stroke();
  for (let [x, y, c, a] of DONUT_SPR)
    ctx2.save(), ctx2.translate(x, y), ctx2.rotate(a), ctx2.fillStyle = c, ctx2.fillRect(-2.5, -1, 5, 2.2), ctx2.lineWidth = 0.8, ctx2.strokeStyle = "rgba(82,60,75,0.55)", ctx2.strokeRect(-2.5, -1, 5, 2.2), ctx2.restore();
  ctx2.beginPath(), ctx2.ellipse(0, 1.6, 3.6, 3, 0, 0, 7), ctx2.fillStyle = "#8a5a3a", ctx2.fill(), ctx2.lineWidth = 1.5, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.restore(), ctx2.save(), ctx2.beginPath(), ctx2.rect(-r - 12, -r - 12, r * 2 + 24, r * 2 + 24);
  for (let k = 0; k < bites; k++) {
    let [bx, by] = bAt(k);
    ctx2.moveTo(bx + 9, by), ctx2.arc(bx, by, 9, 0, Math.PI * 2, !0);
  }
  ctx2.clip("evenodd"), ctx2.beginPath(), ctx2.arc(0, 0, r, 0, 7), ctx2.lineWidth = 3, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.restore(), ctx2.save(), ctx2.beginPath(), ctx2.arc(0, 0, r + 1, 0, 7), ctx2.clip();
  for (let k = 0; k < bites; k++) {
    let [bx, by] = bAt(k);
    ctx2.beginPath(), ctx2.arc(bx, by, 9, 0, 7), ctx2.lineWidth = 3, ctx2.strokeStyle = INK, ctx2.stroke();
  }
  ctx2.restore();
}
function pancakeBody(ctx2, r, pct) {
  let bites = Math.round((1 - pct) * 9), bAt = (k) => {
    let a = -0.6 + k * 0.72;
    return [Math.cos(a) * r * 0.98, Math.sin(a) * r * 0.98];
  };
  ctx2.save(), ctx2.beginPath(), ctx2.arc(0, 0, r, 0, Math.PI * 2);
  for (let k = 0; k < bites; k++) {
    let [bx, by] = bAt(k);
    ctx2.moveTo(bx + 9, by), ctx2.arc(bx, by, 9, 0, Math.PI * 2, !0);
  }
  ctx2.clip("evenodd");
  let g = ctx2.createRadialGradient(-8, -10, 4, 0, 0, r * 1.1);
  g.addColorStop(0, "#f9dcae"), g.addColorStop(0.7, "#f3c98b"), g.addColorStop(1, "#e8a33d"), ctx2.beginPath(), ctx2.arc(0, 0, r, 0, 7), ctx2.fillStyle = g, ctx2.fill(), ctx2.beginPath(), ctx2.arc(0, 0, r - 1, 0, 7), ctx2.lineWidth = 5, ctx2.strokeStyle = "#e8a33d", ctx2.stroke(), ctx2.lineCap = "round", ctx2.lineWidth = 1.5, ctx2.strokeStyle = "rgba(138,84,32,0.55)";
  for (let [rr2, a0, a1] of [[r - 3, 0.35, 2.8], [r - 7, 0.6, 2.55]])
    ctx2.beginPath(), ctx2.arc(0, 0, rr2, a0, a1), ctx2.stroke();
  ctx2.beginPath(), ctx2.moveTo(-r * 0.15, r * 0.52);
  for (let k = 0; k <= 36; k++) {
    let a = 0.15 + k / 36 * 2.9, rr2 = r * 0.74 + Math.sin(a * 5) * 2.2;
    ctx2.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2 + 3);
  }
  ctx2.closePath(), ctx2.fillStyle = "rgba(214,134,40,0.88)", ctx2.fill(), ctx2.lineWidth = 1.4, ctx2.strokeStyle = "rgba(138,84,32,0.7)", ctx2.stroke(), ctx2.lineCap = "round", ctx2.lineWidth = 5.2, ctx2.strokeStyle = "#d98a28";
  for (let [dx, dy] of [[-r * 0.55, r * 0.62], [r * 0.12, r * 0.92], [r * 0.7, r * 0.5]])
    ctx2.beginPath(), ctx2.moveTo(dx, dy - 5), ctx2.lineTo(dx, dy + 3), ctx2.stroke();
  rr(ctx2, -r * 0.62, -r * 0.7, 11, 8, 2.4), ctx2.fillStyle = "#fff2b8", ctx2.fill(), ctx2.lineWidth = 1.6, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.moveTo(-r * 0.62 + 2.4, -r * 0.7 + 2.4), ctx2.lineTo(-r * 0.62 + 6, -r * 0.7 + 2.4), ctx2.lineWidth = 1.2, ctx2.strokeStyle = "rgba(255,255,255,0.9)", ctx2.stroke(), ctx2.restore(), ctx2.save(), ctx2.beginPath(), ctx2.rect(-r - 12, -r - 12, r * 2 + 24, r * 2 + 24);
  for (let k = 0; k < bites; k++) {
    let [bx, by] = bAt(k);
    ctx2.moveTo(bx + 9, by), ctx2.arc(bx, by, 9, 0, Math.PI * 2, !0);
  }
  ctx2.clip("evenodd"), ctx2.beginPath(), ctx2.arc(0, 0, r, 0, 7), ctx2.lineWidth = 3, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.restore(), ctx2.save(), ctx2.beginPath(), ctx2.arc(0, 0, r + 1, 0, 7), ctx2.clip();
  for (let k = 0; k < bites; k++) {
    let [bx, by] = bAt(k);
    ctx2.beginPath(), ctx2.arc(bx, by, 9, 0, 7), ctx2.lineWidth = 3, ctx2.strokeStyle = INK, ctx2.stroke();
  }
  ctx2.restore();
}
var TREAT_BODIES = { cookie: cookieBody, cake: cakeBody, pie: pieBody, sundae: sundaeBody, donut: donutBody, pancake: pancakeBody };
function reactMotion(react, t) {
  if (!react) return { dx: 0, dy: 0, sx: 1, sy: 1 };
  let a = react.age, e = Math.max(0, 1 - a / 1.6);
  switch (react.face) {
    case "surprised": {
      let hop = a < 0.45 ? Math.sin(a / 0.45 * Math.PI) : 0;
      return { dx: 0, dy: -hop * 9, sx: 1 - hop * 0.06, sy: 1 + hop * 0.08 };
    }
    case "oyoy":
      return { dx: Math.sin(t * 46) * 2.2 * e, dy: 0, sx: 1 + Math.sin(t * 23) * 0.03, sy: 1 - Math.sin(t * 23) * 0.03 };
    case "sad": {
      let d = Math.min(1, a / 0.4);
      return { dx: 0, dy: d * 2, sx: 1 + d * 0.05, sy: 1 - d * 0.07 };
    }
    case "crying": {
      let b = Math.abs(Math.sin(t * 9)) * e;
      return { dx: 0, dy: -b * 2.5, sx: 1 + b * 0.04, sy: 1 - b * 0.03 };
    }
  }
  return { dx: 0, dy: 0, sx: 1, sy: 1 };
}
function treatGloss(ctx2, kind, r, pct) {
  let bites = kind === "cake" ? 0 : Math.round((1 - pct) * 9);
  if (ctx2.save(), kind === "cake")
    ctx2.beginPath(), ctx2.ellipse(-r * 0.55, -r * 0.2, r * 0.36, 2.2, -0.05, 0, 7), ctx2.fillStyle = "rgba(255,255,255,0.55)", ctx2.fill();
  else if (kind === "donut" && bites < 6) {
    ctx2.beginPath(), ctx2.arc(0, 0, r - 2.6, Math.PI * 1.08, Math.PI * 1.46), ctx2.lineWidth = 2.2, ctx2.lineCap = "round", ctx2.strokeStyle = "rgba(255,255,255,0.55)", ctx2.stroke(), ctx2.beginPath(), ctx2.ellipse(-r * 0.5, -r * 0.5, 6, 2.8, -0.7, 0, 7), ctx2.fillStyle = "rgba(255,255,255,0.55)", ctx2.fill();
    let sr = bites === 0 ? 3.4 : bites < 3 ? 2.7 : 2.1;
    ctx2.save(), ctx2.translate(-r * 0.7, -r * 0.62), ctx2.beginPath();
    for (let k = 0; k < 8; k++) {
      let a = k * Math.PI / 4 - Math.PI / 2, rr2 = k % 2 ? sr * 0.3 : sr;
      (k ? ctx2.lineTo : ctx2.moveTo).call(ctx2, Math.cos(a) * rr2, Math.sin(a) * rr2);
    }
    ctx2.closePath(), ctx2.fillStyle = "rgba(255,255,255,0.9)", ctx2.fill(), ctx2.restore();
  } else bites < 6 && (ctx2.beginPath(), ctx2.arc(0, 0, r - 4.2, Math.PI * 1.08, Math.PI * 1.46), ctx2.lineWidth = 2.2, ctx2.lineCap = "round", ctx2.strokeStyle = "rgba(255,255,255,0.5)", ctx2.stroke(), ctx2.beginPath(), ctx2.ellipse(-r * 0.46, -r * 0.55, 6.5, 3, -0.7, 0, 7), ctx2.fillStyle = "rgba(255,255,255,0.5)", ctx2.fill(), ctx2.beginPath(), ctx2.arc(-r * 0.22, -r * 0.8, 1.5, 0, 7), ctx2.fillStyle = "rgba(255,255,255,0.7)", ctx2.fill());
  ctx2.restore();
}
function treatBaked(ctx2, kind, r, pct) {
  let cake = kind === "cake", bites = Math.round(cake ? (1 - pct) * 4 : (1 - pct) * 9), P = r + 9, S2 = P * 2;
  bakedBox(ctx2, "treat|" + kind + "|" + bites, -P, -P, S2, S2, 0, (g) => {
    if (g.translate(P, P), (TREAT_BODIES[kind] || cookieBody)(g, r, 1), !bites) return;
    if (cake) {
      let w = r * 1.05, h = r * 0.95, x0 = w - bites * w * 0.42;
      g.globalCompositeOperation = "destination-out", g.fillRect(x0, -h * 0.9, w * 2, h * 2.2), g.globalCompositeOperation = "source-atop", g.beginPath(), g.moveTo(x0 - 1.5, -h * 0.9), g.lineTo(x0 - 1.5, h * 0.9), g.lineWidth = 3, g.strokeStyle = INK, g.stroke();
      return;
    }
    let bAt = (k) => {
      let an = -0.6 + k * 0.72;
      return [Math.cos(an) * r * 0.98, Math.sin(an) * r * 0.98];
    };
    g.globalCompositeOperation = "destination-out", g.fillStyle = "#000";
    for (let k = 0; k < bites; k++) {
      let [bx, by] = bAt(k);
      g.beginPath(), g.arc(bx, by, 9, 0, 7), g.fill();
    }
    g.globalCompositeOperation = "source-atop", g.lineWidth = 3.2, g.strokeStyle = INK;
    for (let k = 0; k < bites; k++) {
      let [bx, by] = bAt(k);
      g.beginPath(), g.arc(bx, by, 10.4, 0, 7), g.stroke();
    }
  });
}
function drawTreat(ctx2, kind, x, y, pct, t, opts = {}) {
  typeof opts == "boolean" && (opts = {});
  let face = opts.face || cookieFace(pct), react = opts.react || null, r = 26, m = reactMotion(react, t);
  ctx2.save(), ctx2.translate(x, y), shadow(ctx2, 0, r * 0.75, r * 1.05 * (1 - Math.min(0.2, -m.dy / 40)), r * 0.32, 0.25);
  let tb = ART81 && !MOTION.reduced && !react && !opts.ouch && !opts.face && !opts.still ? 1 + 0.025 * Math.sin(Math.PI * 2 * t / 2.8) : 1;
  ctx2.save(), ctx2.translate(m.dx, m.dy + r * 0.75), ctx2.scale(m.sx, m.sy * tb), ctx2.translate(0, -r * 0.75), treatBaked(ctx2, kind, r, pct), treatGloss(ctx2, kind, r, pct), react ? drawTreatFace(ctx2, react.face, t, react.age) : drawCookieFace(ctx2, opts.ouch ? "ouch" : face, t), ctx2.restore(), ctx2.restore();
}
function drawCookie(ctx2, x, y, pct, t, opts = {}) {
  return drawTreat(ctx2, "cookie", x, y, pct, t, opts);
}
function drawTreatFace(ctx2, face, t, age = 0) {
  switch (ctx2.lineCap = "round", face) {
    case "surprised": {
      let pop = age < 0.25 ? 0.6 + age / 0.25 * 0.65 : 1.25 - Math.min(0.25, (age - 0.25) * 0.6);
      for (let sx of [-7, 7])
        ctx2.beginPath(), ctx2.ellipse(sx, -3, 3.4 * pop, 4 * pop, 0, 0, 7), ctx2.fillStyle = "#fff", ctx2.fill(), ctx2.lineWidth = 1.5, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.arc(sx, -3, 1.6, 0, 7), ctx2.fillStyle = "#2b1d28", ctx2.fill();
      let bu = Math.min(1, age / 0.2) * 3;
      brow(ctx2, -7, -9 - bu, -0.2), brow(ctx2, 7, -9 - bu, 0.2);
      let o = 2 + Math.min(1, age / 0.3) * 2;
      ctx2.beginPath(), ctx2.ellipse(0, 8, o * 0.8, o, 0, 0, 7), ctx2.fillStyle = "#7a3040", ctx2.fill(), ctx2.lineWidth = 1.5, ctx2.strokeStyle = INK, ctx2.stroke(), blushes(ctx2, 0.5);
      break;
    }
    case "oyoy": {
      ctx2.beginPath(), ctx2.moveTo(-10, -5), ctx2.lineTo(-5, -2), ctx2.lineTo(-10, 1), ctx2.moveTo(10, -5), ctx2.lineTo(5, -2), ctx2.lineTo(10, 1), ctx2.lineWidth = 1.9, ctx2.strokeStyle = INK, ctx2.stroke(), brow(ctx2, -7, -9, 0.45, 3.5), brow(ctx2, 7, -9, -0.45, 3.5);
      let open = 1 + Math.abs(Math.sin(t * 16)) * 3.2;
      ctx2.beginPath(), ctx2.ellipse(0, 8, 4.6, open, 0, 0, 7), ctx2.fillStyle = "#7a3040", ctx2.fill(), ctx2.lineWidth = 1.5, ctx2.strokeStyle = INK, ctx2.stroke();
      for (let sx of [-1, 1]) {
        let p = (age * 2.2 + (sx > 0 ? 0.5 : 0)) % 1;
        ctx2.globalAlpha = 1 - p, tear(ctx2, sx * (17 + p * 8), -12 - p * 6, 0.8), ctx2.globalAlpha = 1;
      }
      blushes(ctx2, 0.75);
      break;
    }
    case "sad": {
      let d = Math.min(1, age / 0.4);
      eye(ctx2, -7, -1 + d, 3.2, 0), eye(ctx2, 7, -1 + d, 3.2, 0);
      for (let sx of [-7, 7])
        ctx2.beginPath(), ctx2.moveTo(sx - 3.6, -3.4 + d), ctx2.quadraticCurveTo(sx, -1.6 + d * 1.4, sx + 3.6, -3.4 + d), ctx2.lineWidth = 1.8, ctx2.strokeStyle = INK, ctx2.stroke();
      brow(ctx2, -7, -7 + d, 0.55), brow(ctx2, 7, -7 + d, -0.55);
      let tr = Math.sin(t * 30) * 0.6;
      ctx2.beginPath(), ctx2.arc(0 + tr, 11, 4, Math.PI + 0.35, -0.35), ctx2.lineWidth = 1.8, ctx2.strokeStyle = INK, ctx2.stroke();
      let p = Math.min(1, age / 1.2);
      tear(ctx2, -9, 3 + p * 12, 1), blushes(ctx2, 0.3);
      break;
    }
    case "crying": {
      closedEye(ctx2, -7, -1, 3.6, !1), closedEye(ctx2, 7, -1, 3.6, !1), brow(ctx2, -7, -7, 0.6), brow(ctx2, 7, -7, -0.6);
      for (let sx of [-1, 1]) for (let k = 0; k < 3; k++) {
        let p = (t * 1.8 + k * 0.33) % 1;
        ctx2.globalAlpha = 1 - p * 0.7, tear(ctx2, sx * (9 + p * 5), 2 + p * 18, 0.9), ctx2.globalAlpha = 1;
      }
      let w = 5.5 + Math.sin(t * 10) * 0.8;
      ctx2.beginPath(), ctx2.moveTo(-w, 6), ctx2.quadraticCurveTo(0, 2, w, 6), ctx2.quadraticCurveTo(w * 0.6, 14, 0, 14), ctx2.quadraticCurveTo(-w * 0.6, 14, -w, 6), ctx2.fillStyle = "#7a3040", ctx2.fill(), ctx2.lineWidth = 1.5, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.ellipse(0, 11.5, 2.6, 1.4, 0, 0, 7), ctx2.fillStyle = "#ff8fa0", ctx2.fill(), blushes(ctx2, 0.6);
      break;
    }
    default:
      drawCookieFace(ctx2, face, t);
  }
}
function brow(ctx2, x, y, ang, len = 4) {
  ctx2.beginPath(), ctx2.moveTo(x - Math.cos(ang) * len, y - Math.sin(ang) * len), ctx2.lineTo(x + Math.cos(ang) * len, y + Math.sin(ang) * len), ctx2.lineWidth = 1.7, ctx2.strokeStyle = INK, ctx2.lineCap = "round", ctx2.stroke();
}
function tear(ctx2, x, y, s = 1) {
  ctx2.beginPath(), ctx2.moveTo(x, y - 3.2 * s), ctx2.quadraticCurveTo(x + 2.6 * s, y + 0.6 * s, x, y + 2.6 * s), ctx2.quadraticCurveTo(x - 2.6 * s, y + 0.6 * s, x, y - 3.2 * s), ctx2.fillStyle = "#9fdcff", ctx2.fill(), ctx2.lineWidth = 1, ctx2.strokeStyle = "#4a9de8", ctx2.stroke();
}
function closedEye(ctx2, x, y, r, up = !0) {
  ctx2.beginPath(), ctx2.moveTo(x - r, y), ctx2.quadraticCurveTo(x, y + (up ? -r : r) * 0.9, x + r, y), ctx2.lineWidth = 1.8, ctx2.strokeStyle = INK, ctx2.lineCap = "round", ctx2.stroke();
}
function blushes(ctx2, a = 0.5) {
  ctx2.beginPath(), ctx2.ellipse(-12, 5, 3, 1.8, 0, 0, 7), ctx2.ellipse(12, 5, 3, 1.8, 0, 0, 7), ctx2.fillStyle = `rgba(255,120,140,${a})`, ctx2.fill();
}
function drawCookieFace(ctx2, face, t) {
  let by = Math.sin(t * 2) * 0.8, blink = t % 4 < 0.12;
  switch (ctx2.lineCap = "round", face) {
    case "happy":
      closedEye(ctx2, -7, -1 + by, 3.4, !0), closedEye(ctx2, 7, -1 + by, 3.4, !0), ctx2.beginPath(), ctx2.moveTo(-5, 4 + by), ctx2.quadraticCurveTo(0, 11 + by, 5, 4 + by), ctx2.closePath(), ctx2.fillStyle = "#7a3040", ctx2.fill(), ctx2.lineWidth = 1.5, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.ellipse(0, 7.6 + by, 2.4, 1.3, 0, 0, 7), ctx2.fillStyle = "#ff8fa0", ctx2.fill(), blushes(ctx2, 0.6);
      break;
    case "content":
      eye(ctx2, -7, -2 + by, 3.2, 0.2, blink), eye(ctx2, 7, -2 + by, 3.2, 0.2, blink), ctx2.beginPath(), ctx2.arc(0, 4 + by, 4, 0.25, Math.PI - 0.25), ctx2.lineWidth = 1.8, ctx2.strokeStyle = INK, ctx2.stroke(), blushes(ctx2, 0.5);
      break;
    case "worried":
      eye(ctx2, -7, -2 + by, 3.3, 0, blink), eye(ctx2, 7, -2 + by, 3.3, 0, blink), brow(ctx2, -7, -8 + by, 0.35), brow(ctx2, 7, -8 + by, -0.35), ctx2.beginPath(), ctx2.moveTo(-4, 7 + by), ctx2.quadraticCurveTo(-2, 5 + by, 0, 7 + by), ctx2.quadraticCurveTo(2, 9 + by, 4, 7 + by), ctx2.lineWidth = 1.7, ctx2.strokeStyle = INK, ctx2.stroke(), blushes(ctx2, 0.4);
      break;
    case "nervous": {
      let look = Math.sin(t * 3) > 0 ? 0.8 : -0.8;
      eye(ctx2, -7, -2 + by, 3.4, look), eye(ctx2, 7, -2 + by, 3.4, look), brow(ctx2, -7, -8 + by, 0.4), brow(ctx2, 7, -8 + by, -0.4), ctx2.beginPath(), ctx2.moveTo(-4, 7 + by);
      for (let k = 1; k <= 4; k++) ctx2.lineTo(-4 + k * 2, 7 + by + (k % 2 ? -1.4 : 0));
      ctx2.lineWidth = 1.6, ctx2.strokeStyle = INK, ctx2.stroke(), tear(ctx2, 15, -10 + Math.sin(t * 4) * 0.8, 1.1), blushes(ctx2, 0.35);
      break;
    }
    case "sad":
      eye(ctx2, -7, -1 + by, 3.2, 0), eye(ctx2, 7, -1 + by, 3.2, 0), brow(ctx2, -7, -7 + by, 0.5), brow(ctx2, 7, -7 + by, -0.5), ctx2.beginPath(), ctx2.arc(0, 10 + by, 4, Math.PI + 0.35, -0.35), ctx2.lineWidth = 1.8, ctx2.strokeStyle = INK, ctx2.stroke(), tear(ctx2, -9, 4 + by, 0.8), blushes(ctx2, 0.3);
      break;
    case "crying": {
      closedEye(ctx2, -7, -1 + by, 3.4, !1), closedEye(ctx2, 7, -1 + by, 3.4, !1), brow(ctx2, -7, -7 + by, 0.55), brow(ctx2, 7, -7 + by, -0.55);
      for (let sx of [-1, 1]) for (let k = 0; k < 2; k++) {
        let p = (t * 1.4 + k * 0.5) % 1;
        ctx2.globalAlpha = 1 - p * 0.6, tear(ctx2, sx * (9 + p * 2), 2 + p * 14 + by, 0.85), ctx2.globalAlpha = 1;
      }
      ctx2.beginPath(), ctx2.ellipse(0, 8 + by, 4.2, 3 + Math.sin(t * 9) * 0.6, 0, 0, 7), ctx2.fillStyle = "#7a3040", ctx2.fill(), ctx2.lineWidth = 1.5, ctx2.strokeStyle = INK, ctx2.stroke(), blushes(ctx2, 0.45);
      break;
    }
    case "screaming": {
      let sh = Math.sin(t * 40) * 0.8;
      ctx2.save(), ctx2.translate(sh, 0);
      for (let sx of [-7, 7])
        ctx2.beginPath(), ctx2.ellipse(sx, -3, 3.8, 4.4, 0, 0, 7), ctx2.fillStyle = "#fff", ctx2.fill(), ctx2.lineWidth = 1.5, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.arc(sx, -3, 1.5, 0, 7), ctx2.fillStyle = "#2b1d28", ctx2.fill();
      brow(ctx2, -7, -10, -0.25), brow(ctx2, 7, -10, 0.25), ctx2.beginPath(), ctx2.ellipse(0, 8, 5, 6, 0, 0, 7), ctx2.fillStyle = "#7a3040", ctx2.fill(), ctx2.lineWidth = 1.6, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.ellipse(0, 11, 3, 2, 0, 0, 7), ctx2.fillStyle = "#ff8fa0", ctx2.fill(), ctx2.restore(), ctx2.font = `bold 8px ${FONT}`, ctx2.textAlign = "center", ctx2.textBaseline = "middle", ctx2.fillStyle = "#e0607e", ctx2.fillText("!", 21 + Math.sin(t * 8), -18), ctx2.fillText("!", -21 - Math.sin(t * 8), -16);
      break;
    }
    case "pleading": {
      for (let sx of [-7, 7])
        ctx2.beginPath(), ctx2.ellipse(sx, -2 + by, 4.4, 4.8, 0, 0, 7), ctx2.fillStyle = "#2b1d28", ctx2.fill(), ctx2.lineWidth = 1.4, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.arc(sx - 1.4, -3.6 + by, 1.8, 0, 7), ctx2.arc(sx + 1.6, 0 + by, 0.9, 0, 7), ctx2.fillStyle = "#fff", ctx2.fill(), ctx2.beginPath(), ctx2.ellipse(sx, 2 + by, 3.6, 1.1, 0, 0, Math.PI), ctx2.fillStyle = "rgba(159,220,255,0.9)", ctx2.fill();
      brow(ctx2, -7, -9 + by, 0.5, 3), brow(ctx2, 7, -9 + by, -0.5, 3), ctx2.beginPath(), ctx2.moveTo(-2.5, 8 + by), ctx2.quadraticCurveTo(0, 6.5 + by, 2.5, 8 + by), ctx2.lineWidth = 1.6, ctx2.strokeStyle = INK, ctx2.stroke(), blushes(ctx2, 0.65);
      break;
    }
    case "fainted":
      for (let sx of [-7, 7]) {
        ctx2.beginPath();
        for (let k = 0; k <= 24; k++) {
          let a = k / 24 * Math.PI * 4 + t * 3, rr2 = k / 24 * 3.6;
          ctx2.lineTo(sx + Math.cos(a) * rr2, -2 + Math.sin(a) * rr2);
        }
        ctx2.lineWidth = 1.4, ctx2.strokeStyle = INK, ctx2.stroke();
      }
      ctx2.beginPath(), ctx2.arc(0, 6, 3.5, 0.2, Math.PI - 0.2), ctx2.lineWidth = 1.6, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.ellipse(1.5, 9, 1.8, 2.2, 0.2, 0, 7), ctx2.fillStyle = "#ff8fa0", ctx2.fill();
      for (let k = 0; k < 3; k++) {
        let a = t * 2 + k * 2.1;
        starShape(ctx2, Math.cos(a) * 14, -22 + Math.sin(a) * 4, 2.8, "#ffe36e", 1);
      }
      break;
    case "ouch":
      ctx2.beginPath(), ctx2.moveTo(-10, -5), ctx2.lineTo(-5, -2), ctx2.lineTo(-10, 1), ctx2.moveTo(10, -5), ctx2.lineTo(5, -2), ctx2.lineTo(10, 1), ctx2.lineWidth = 1.9, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.moveTo(-4, 7), ctx2.quadraticCurveTo(-2, 4, 0, 7), ctx2.quadraticCurveTo(2, 10, 4, 7), ctx2.lineWidth = 1.8, ctx2.stroke(), blushes(ctx2, 0.7);
      break;
  }
}
function drawNest(ctx2, x, y, t) {
  ctx2.save(), ctx2.translate(x, y);
  let K7 = ART81, topY = K7 && y < 40 ? -24 : -36;
  if (bakedBox(ctx2, K7 ? y < 40 ? "nest7s" : "nest7" : "nest", -40, -42, 80, 68, 4, (ctx3) => {
    ctx3.translate(40, 42), shadow(ctx3, 0, 13, 32, 8, 0.24), ctx3.beginPath(), ctx3.ellipse(0, 10.5, 32, 7.5, 0, 0, 7), ctx3.fillStyle = "#7d5436", ctx3.fill(), ctx3.lineWidth = 3, ctx3.strokeStyle = INK, ctx3.stroke(), ctx3.beginPath(), ctx3.moveTo(-30, 10), ctx3.quadraticCurveTo(-25, -15, 0, -17), ctx3.quadraticCurveTo(25, -15, 30, 10), ctx3.quadraticCurveTo(0, 16, -30, 10), ctx3.closePath();
    let g = ctx3.createRadialGradient(-9, -10, 2, 0, -2, 38);
    g.addColorStop(0, "#f1c79a"), g.addColorStop(0.45, "#d29a69"), g.addColorStop(1, "#a8754e"), ctx3.fillStyle = g, ctx3.fill(), ctx3.lineWidth = 3, ctx3.strokeStyle = INK, ctx3.stroke(), ctx3.beginPath(), ctx3.ellipse(-12, -8.5, 8.5, 3.2, -0.55, 0, 7), ctx3.fillStyle = "rgba(255,255,255,0.5)", ctx3.fill(), ctx3.beginPath(), ctx3.arc(-4.5, -13, 1.4, 0, 7), ctx3.fillStyle = "rgba(255,255,255,0.7)", ctx3.fill();
    for (let [a, b, r] of [[-20, 4, 2.4], [17, -3, 2.2], [22, 6, 2.6], [-6, -9, 1.8], [8, -11, 1.6]]) blob(ctx3, a, b, r, r * 0.8, "#d9a77a", 1.2, 0, { gloss: 0 });
    ctx3.beginPath(), ctx3.ellipse(0, 5, 10.5, 7.5, 0, 0, 7);
    let dg = ctx3.createLinearGradient(0, -2, 0, 12);
    dg.addColorStop(0, "#2c1a24"), dg.addColorStop(1, "#4a2e3a"), ctx3.fillStyle = dg, ctx3.fill(), ctx3.lineWidth = 2.4, ctx3.strokeStyle = INK, ctx3.stroke(), ctx3.beginPath(), ctx3.ellipse(0, 5, 8.6, 5.7, 0, 0.25, Math.PI - 0.25), ctx3.lineWidth = 1.5, ctx3.strokeStyle = "rgba(255,214,170,0.8)", ctx3.stroke(), K7 ? (ctx3.beginPath(), ctx3.moveTo(0, -16), ctx3.lineTo(0, topY), ctx3.lineWidth = 2.4, ctx3.strokeStyle = INK, ctx3.stroke(), blob(ctx3, 0, topY - 1, 2.2, 2.2, "#ffd45e", 1.4, 0, { gloss: 0.8 })) : (ctx3.beginPath(), ctx3.moveTo(14, -11), ctx3.lineTo(14, -31), ctx3.lineWidth = 2.4, ctx3.strokeStyle = INK, ctx3.stroke(), blob(ctx3, 14, -32, 2.2, 2.2, "#ffd45e", 1.4, 0, { gloss: 0.8 }));
  }), K7) {
    let w = Math.sin(t * 4);
    ctx2.beginPath(), ctx2.moveTo(0, topY + 1), ctx2.quadraticCurveTo(8 * 0.95, topY + 3 * 0.95 + w * 2, 15 * 0.95, topY + 6 * 0.95), ctx2.lineTo(0, topY + 10.5 * 0.95), ctx2.closePath(), ctx2.fillStyle = "#ff6f86", ctx2.fill(), ctx2.lineWidth = 1.8, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.moveTo(2, topY + 4), ctx2.quadraticCurveTo(7, topY + 5.2 + w * 1.4, 10, topY + 6.5), ctx2.lineWidth = 1.3, ctx2.strokeStyle = "rgba(255,255,255,0.65)", ctx2.stroke(), ctx2.restore();
    return;
  }
  ctx2.beginPath(), ctx2.moveTo(14, -31), ctx2.quadraticCurveTo(22, -29 + Math.sin(t * 4) * 2, 29, -26), ctx2.lineTo(14, -21.5), ctx2.closePath(), ctx2.fillStyle = "#ff6f86", ctx2.fill(), ctx2.lineWidth = 1.8, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.moveTo(16, -28.5), ctx2.quadraticCurveTo(21, -27.2 + Math.sin(t * 4) * 1.4, 24, -26), ctx2.lineWidth = 1.3, ctx2.strokeStyle = "rgba(255,255,255,0.65)", ctx2.stroke(), ctx2.restore();
}
function drawFoodBar(ctx2, f, label, t, st = {}) {
  f = Math.max(0, Math.min(1, f)), bakedBox(ctx2, "foodTrack", 60, 22, 84, 20, 3, (g) => {
    g.translate(-60, -22), rr(g, 60, 22, 84, 20, 10);
    let gr = g.createLinearGradient(0, 22, 0, 42);
    gr.addColorStop(0, "#e9d6cc"), gr.addColorStop(1, "#f6e9e2"), g.fillStyle = gr, g.fill(), g.lineWidth = 2.4, g.strokeStyle = INK, g.stroke(), g.beginPath(), g.moveTo(68, 25.6), g.lineTo(136, 25.6), g.lineWidth = 3, g.strokeStyle = "rgba(82,60,75,0.18)", g.stroke();
  });
  let kind = f >= 0.9 ? "g" : f >= 0.5 ? "y" : "r", cols = { g: ["#b8f5ae", "#8fe388", "#52b955"], y: ["#ffe9a0", "#ffd45e", "#e2a92a"], r: ["#ffb4b4", "#ff8a8a", "#e05a64"] }[kind], sprite = (k, c, stripes) => bakedBox(ctx2, "foodFill" + k + (stripes ? "s" : ""), 62, 24, 80, 16, 2, (g) => {
    if (g.translate(-62, -24), g.fillStyle = c[1], g.fillRect(62, 24, 80, 16), g.fillStyle = c[2], g.fillRect(62, 35.2, 80, 4.8), g.fillStyle = c[0], g.fillRect(62, 24, 80, 5.2), stripes) {
      g.save(), g.beginPath(), g.rect(62, 24, 80, 16), g.clip(), g.fillStyle = "rgba(255,255,255,0.22)";
      for (let x = 54; x < 150; x += 12)
        g.beginPath(), g.moveTo(x, 40), g.lineTo(x + 6, 40), g.lineTo(x + 14, 24), g.lineTo(x + 8, 24), g.closePath(), g.fill();
      g.restore();
    }
    g.beginPath(), g.moveTo(67, 28), g.lineTo(136, 28), g.lineWidth = 4, g.lineCap = "round", g.strokeStyle = "rgba(255,255,255,0.55)", g.stroke(), g.beginPath(), g.arc(138.5, 28.5, 1.5, 0, 7), g.fillStyle = "rgba(255,255,255,0.8)", g.fill(), g.lineCap = "butt", g.lineWidth = 1, g.strokeStyle = "rgba(82,60,75,0.35)";
    for (let tx of [102, 134])
      g.beginPath(), g.moveTo(tx, 25), g.lineTo(tx, 39), g.stroke();
  }), pulse = f > 0 && f < 0.25 && !st.still ? 0.85 + 0.15 * (0.5 + 0.5 * Math.sin(t * 9.42)) : 1, drawFill = (ff, alpha) => {
    if (ff <= 0) return;
    let w = 80 * ff;
    ctx2.save(), alpha < 1 && (ctx2.globalAlpha = alpha), rr(ctx2, 62, 24, w, 16, 8), ctx2.clip(), ctx2.globalAlpha = alpha, sprite(kind, cols, f < 0.5), ctx2.restore(), ctx2.beginPath();
    let ex = 62 + w - 3.2;
    ctx2.moveTo(ex, 28), ctx2.lineTo(ex, 36), ctx2.lineWidth = 1, ctx2.strokeStyle = "rgba(82,60,75,0.28)", ff < 0.98 && ctx2.stroke();
  };
  if (st.drain && st.drain.a > 0 && st.drain.from > f) {
    let w0 = 80 * f, w1 = 80 * st.drain.from;
    ctx2.save(), rr(ctx2, 62, 24, w1, 16, 8), ctx2.clip(), ctx2.globalAlpha = Math.min(1, st.drain.a) * 0.85, ctx2.fillStyle = "#fff7f2", ctx2.fillRect(62 + w0, 24, w1 - w0, 16), ctx2.restore();
  }
  if (drawFill(f, pulse), f > 0) {
    let fl = st.flash || 0;
    fl > 0 && (ctx2.save(), rr(ctx2, 62, 24, 80 * f, 16, 8), ctx2.clip(), ctx2.globalAlpha = Math.min(0.7, fl), ctx2.fillStyle = "#fff", ctx2.fillRect(62, 24, 80 * f, 16), ctx2.restore());
  }
  text(ctx2, label, 102, 33, 14, "#fff");
}
var RIBBON_PAL = { pink: ["#ff8fa3", "#e0546e", "#b83a55"], gold: ["#ffd45e", "#f0a82a", "#b8700a"], slate: ["#b9aecb", "#8f84a6", "#6e6488"] }, CROWN_PAL = { bronze: "#d9a77a", silver: "#dfe6f0", gold: "#ffd23f" };
function rewardPalette(win, stars, perfect) {
  return win ? perfect || stars >= 3 ? { ribbon: "gold", crown: "gold" } : stars === 2 ? { ribbon: "pink", crown: "silver" } : { ribbon: "pink", crown: "bronze" } : { ribbon: "slate", crown: null };
}
function ribbonSprite(ctx2, pal) {
  let [face, shd, lip] = RIBBON_PAL[pal];
  bakedBox(ctx2, "rwRibbon:" + pal, 48, 138, 304, 42, 4, (g) => {
    g.translate(-48, -138);
    for (let s of [-1, 1]) {
      let ex = s < 0 ? 82 : 318, fx = s < 0 ? 48 : 352, nx = fx - s * 9;
      g.beginPath(), g.moveTo(ex, 146), g.lineTo(fx, 146), g.lineTo(nx, 163), g.lineTo(fx, 180), g.lineTo(ex, 180), g.closePath(), g.fillStyle = shd, g.fill(), g.lineWidth = 2.4, g.strokeStyle = INK, g.stroke(), g.beginPath(), g.moveTo(ex, 172), g.lineTo(ex, 180), g.lineTo(ex - s * 12, 172), g.closePath(), g.fillStyle = shade(shd, -0.35), g.fill(), g.lineWidth = 2, g.strokeStyle = INK, g.stroke();
    }
    rr(g, 82, 138, 236, 34, 6);
    let gr = g.createLinearGradient(0, 138, 0, 172);
    gr.addColorStop(0, face), gr.addColorStop(0.62, face), gr.addColorStop(0.63, shd), gr.addColorStop(1, shd), g.fillStyle = gr, g.fill(), g.save(), rr(g, 82, 138, 236, 34, 6), g.clip(), g.fillStyle = lip, g.fillRect(82, 168.6, 236, 3.4), g.restore(), rr(g, 82, 138, 236, 34, 6), g.lineWidth = 2.4, g.strokeStyle = INK, g.stroke(), g.beginPath(), g.moveTo(90, 141.4), g.lineTo(310, 141.4), g.lineWidth = 1.6, g.strokeStyle = "rgba(255,255,255,0.6)", g.stroke();
  });
}
function crownSprite(ctx2, pal) {
  let base = CROWN_PAL[pal];
  bakedBox(ctx2, "rwCrown:" + pal, 160, 96, 80, 50, 4, (g) => {
    g.translate(-160, -96), g.beginPath(), g.moveTo(166, 141), g.lineTo(164, 108), g.lineTo(183, 125), g.lineTo(200, 101), g.lineTo(217, 125), g.lineTo(236, 108), g.lineTo(234, 141), g.closePath();
    let gr = g.createLinearGradient(0, 100, 0, 141);
    gr.addColorStop(0, shade(base, 0.25)), gr.addColorStop(0.55, base), gr.addColorStop(1, shade(base, -0.22)), g.fillStyle = gr, g.fill(), g.lineWidth = 2.4, g.strokeStyle = INK, g.lineJoin = "round", g.stroke(), g.beginPath(), g.moveTo(167, 133), g.lineTo(233, 133), g.lineWidth = 1.6, g.strokeStyle = shade(base, -0.35), g.stroke();
    for (let [x, y, c] of [[164.5, 111, "#ff6f86"], [200, 105.5, "#8fe9fb"], [235.5, 111, "#ff6f86"]])
      g.beginPath(), g.arc(x, y, 3.4, 0, 7), g.fillStyle = c, g.fill(), g.lineWidth = 1.6, g.strokeStyle = INK, g.stroke(), g.beginPath(), g.arc(x - 1, y - 1.1, 0.9, 0, 7), g.fillStyle = "rgba(255,255,255,0.85)", g.fill();
    g.beginPath(), g.ellipse(180, 118, 7, 2.6, -0.7, 0, 7), g.fillStyle = "rgba(255,255,255,0.5)", g.fill();
  });
}
function drawRewardHeader(ctx2, pal, k, still, stars3) {
  let rp = pal.ribbon, cr = pal.crown;
  if (stars3 && !still) {
    let tw = 0.6 + 0.4 * Math.sin(k * 6);
    if (k > 0.3) for (let x of [40, 360]) sparkle(ctx2, x, 163, 3.4 * tw, "#fff7a8", k);
    if (k > 0.4 && k < 1) for (let x of [164, 236]) sparkle(ctx2, x, 104, 5 * (1 - (k - 0.4) / 0.6) + 1, "#fff7a8", k * 2);
  }
  ctx2.save();
  let dy = 0, alpha = 1, cs = 1;
  still ? alpha = Math.min(1, k / 0.15) : (dy = -36 * (1 - easeOutBack(k / 0.24)), alpha = Math.min(1, k / 0.1), cs = k < 0.15 ? 0 : 0.4 + 0.6 * easeOutBack((k - 0.15) / 0.25)), ctx2.globalAlpha = alpha, ctx2.translate(0, dy), ribbonSprite(ctx2, rp), cr && cs > 0.01 && (ctx2.save(), !still && k >= 0.15 && k < 0.4 && squashAt(ctx2, 200, 141, (k - 0.15) / 0.25, 0.1), ctx2.translate(200, 141), ctx2.scale(cs, cs), ctx2.translate(-200, -141), crownSprite(ctx2, cr), ctx2.restore()), ctx2.restore();
}
function heroBob(ctx2, t, i = 0) {
  if (!ART81 || MOTION.reduced) return;
  let s = Math.sin(Math.PI * 2 * t / 1.9 + i * 0.6);
  ctx2.translate(0, 1.5 * s), ctx2.scale(1, 1 + 0.02 * s);
}
var coinSprite = (...q) => drawCoin(...q), sparkleAt = (...q) => sparkle(...q), SPARK_COLS = ["#ffffff", "#ffe27a", "#8fe9fb", "#ffa6dc"];
function fxSparkle(ctx2, x, y, r, col, k) {
  let rm = MOTION.reduced;
  ctx2.globalAlpha = rm ? 1 - k : 1;
  let sc = rm ? 1 : k < 0.35 ? 1 + 0.25 * (k / 0.35) : 1.25 * (1 - (k - 0.35) / 0.65);
  sparkle(ctx2, x, y, Math.max(0.8, r * sc), col, rm ? 0 : 0.6 * k);
}
var THEMES = [
  { name: "gingham", a: "#f7d3ca", b: "#f1c7bd", check: "rgba(222,112,122,0.10)", grout: "rgba(200,160,130,0.18)", trail: "#fff8ec", edge: "#d9a08c", dot: "#e7a3a3" },
  { name: "wood", a: "#ead1a8", b: "#e1c49b", grain: "rgba(120,80,40,0.16)", grout: "rgba(120,80,45,0.3)", trail: "#fffaf0", edge: "#c49766", dot: "#c9a074" },
  { name: "midnight", a: "#d2cbee", b: "#c7bfe7", grout: "rgba(120,110,175,0.3)", trail: "#fffaf2", edge: "#a89fd8", dot: "#b9aee6", moon: !0 },
  { name: "picnic", a: "#c9e6b2", b: "#bddca3", check: "rgba(80,160,100,0.19)", grout: "rgba(100,150,90,0.2)", trail: "#fffdf2", edge: "#98c283", dot: "#a6d18c" },
  // v0.7.7 world 3 (Crumb Design palettes-W3-W10.json, the first three): butter, blueberry, crust. Checked by the A1-A7/A10 contrast pass on every W3 map.
  { name: "W3 butter", a: "#ecd37f", b: "#e5c974", grout: "rgba(160,130,50,0.25)", trail: "#fffaf0", edge: "#c9a64f", dot: "#d9bb60" },
  { name: "W3 blueberry", a: "#bcd5ef", b: "#b0cbea", check: "rgba(90,130,200,0.14)", grout: "rgba(90,120,170,0.22)", trail: "#fffaf2", edge: "#86a9d6", dot: "#9dbde4" },
  { name: "W3 crust", a: "#e4bf92", b: "#deb88a", grain: "rgba(130,80,40,0.14)", grout: "rgba(130,85,45,0.28)", trail: "#fffaf0", edge: "#b98a57", dot: "#c99c6a" },
  // v0.7.9 world 4 (Crumb Design w4-paste.json artThemes_add index 7): mint. Contrast A1/A2/A3 on all ten W4 maps in qa/v0.7.9/contrast.
  { name: "W4 mint", a: "#b6e4d6", b: "#abdccd", check: "rgba(60,170,150,0.14)", grout: "rgba(70,150,130,0.22)", trail: "#fffdf5", edge: "#80c3b0", dot: "#98d3c2" },
  // v0.8.1 world 5 (plan W4, Crumb Design palettes-W3-W10.json): teal diner, with a pink icing accent for the flowers/dots. A1/A2/A3/A5 measured on the G1 renderer over all ten W5 maps (qa/v0.8.1/contrast-w5.json).
  { name: "W5 teal-diner", a: "#a9d8de", b: "#9ecfd6", check: "rgba(60,150,170,0.13)", grout: "rgba(60,130,150,0.22)", trail: "#fffdf5", edge: "#7fbcc6", dot: "#f7b6c8" },
  // v0.8.2 world 6 (Crumb Design palettes-W3-W10.json 'W6 maple'): warm maple planks. If the rendered A10b is < 1.6 on any W6 map, darken the pad by steps (see qa/v0.8.2 contrast-w6).
  { name: "W6 maple", a: "#e6b98a", b: "#e1b27f", grain: "rgba(120,70,20,0.15)", grout: "rgba(130,80,30,0.28)", trail: "#fffaf0", edge: "#b98550", dot: "#c99660" }
];
function renderMapBackground(routes, theme, w, h, dpr2, props = [], art = {}) {
  Array.isArray(routes) || (routes = [routes]);
  let cv = makeCanvas(Math.ceil(w * dpr2), Math.ceil(h * dpr2)), g = cv.getContext("2d");
  g.scale(dpr2, dpr2);
  let th = THEMES[theme % THEMES.length], seed = 7 + theme * 13, rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647, soft = ART81 && th.grain, ta = soft ? mixHex(th.a, th.b, 0.3) : th.a, tb = th.b;
  for (let c = 0; c < GRID_COLS; c++) for (let r = 0; r < GRID_ROWS; r++)
    g.fillStyle = (c + r) % 2 ? ta : tb, g.fillRect(c * TILE, r * TILE, TILE, TILE);
  if (th.check) {
    g.fillStyle = th.check;
    for (let x = 0; x < w; x += 40) g.fillRect(x + 10, 0, 20, h);
    for (let y = 0; y < h; y += 40) g.fillRect(0, y + 10, w, 20);
  } else if (th.grain) {
    for (let x = 0; x < w; x += 80)
      g.fillStyle = x / 80 % 2 ? `rgba(255,255,255,${ART81 ? 0.065 : 0.08})` : `rgba(120,80,40,${ART81 ? 0.04 : 0.05})`, g.fillRect(x, 0, 80, h), g.fillStyle = `rgba(110,70,40,${ART81 ? 0.2975 : 0.35})`, g.fillRect(x, 0, 1.5, h);
    g.strokeStyle = th.grain, g.lineWidth = 1.2;
    for (let k = 0; k < 40; k++) {
      let x = rnd() * w;
      g.beginPath(), g.moveTo(x, 0);
      for (let y = 0; y <= h; y += 20) g.lineTo(x + Math.sin(y * 0.02 + k) * 4, y);
      g.stroke();
    }
    for (let k = 0; k < 5; k++) {
      let x = rnd() * w, y = rnd() * h;
      g.beginPath(), g.ellipse(x, y, 5, 3, 0, 0, 7), g.lineWidth = 1.5, g.stroke();
    }
  } else {
    g.strokeStyle = th.grout, g.lineWidth = 1.5;
    for (let c = 1; c < GRID_COLS; c++)
      g.beginPath(), g.moveTo(c * TILE, 0), g.lineTo(c * TILE, h), g.stroke();
    for (let r = 1; r < GRID_ROWS; r++)
      g.beginPath(), g.moveTo(0, r * TILE), g.lineTo(w, r * TILE), g.stroke();
    for (let k = 0; k < 30; k++)
      g.fillStyle = "rgba(255,255,255,0.25)", g.fillRect(Math.floor(rnd() * 10) * 40 + 3, Math.floor(rnd() * 12) * 40 + 3, 12, 3);
  }
  if (ART81 && (g.fillStyle = "rgba(70,35,50," + (art.wash ?? 0.02) + ")", g.fillRect(0, 0, w, h)), th.moon) {
    let mg = g.createRadialGradient(w * 0.85, -20, 10, w * 0.85, -20, 300);
    mg.addColorStop(0, "rgba(255,255,230,0.45)"), mg.addColorStop(1, "rgba(255,255,230,0)"), g.fillStyle = mg, g.fillRect(0, 0, w, h);
  }
  if (ART81) {
    let lp = g.createRadialGradient(130, 110, 20, 130, 110, 300);
    lp.addColorStop(0, "rgba(255,250,228,0.02)"), lp.addColorStop(1, "rgba(255,250,228,0)"), g.fillStyle = lp, g.fillRect(0, 0, w, h);
  }
  for (let k = 0; k < 10; k++) {
    let x = rnd() * w, y = rnd() * h;
    g.globalAlpha = 0.5, g.fillStyle = th.dot;
    for (let p = 0; p < 5; p++) {
      let a = p * Math.PI * 2 / 5;
      g.beginPath(), g.arc(x + Math.cos(a) * 3, y + Math.sin(a) * 3, 2.2, 0, 7), g.fill();
    }
    g.fillStyle = "#fff", g.beginPath(), g.arc(x, y, 1.6, 0, 7), g.fill(), g.globalAlpha = 1;
  }
  let strokeAll = (lw, col, dash) => {
    for (let path of routes) {
      let pts = path.pts;
      g.beginPath(), g.moveTo(pts[0].x, pts[0].y);
      for (let p of pts.slice(1)) g.lineTo(p.x, p.y);
      g.lineWidth = lw, g.strokeStyle = col, g.lineJoin = "round", g.lineCap = "round", g.setLineDash(dash || []), g.stroke(), g.setLineDash([]);
    }
  };
  g.save(), g.translate(0, 5), strokeAll(40, "rgba(70,35,50,0.26)"), g.restore(), ART81 && (g.save(), g.translate(2, 3), strokeAll(42, "rgba(70,35,50,0.07)"), g.restore(), g.save(), g.translate(-1.5, -1.5), strokeAll(39, "rgba(255,248,232,0.22)"), g.restore()), strokeAll(36, INK), g.save(), g.translate(0, 1.5), strokeAll(32, shade(th.edge, -0.28)), g.restore(), strokeAll(30, th.edge), ART81 ? (strokeAll(25, "rgba(70,35,50,0.20)"), g.save(), g.translate(0, 1), strokeAll(25, th.trail), g.restore()) : strokeAll(25, th.trail), g.save(), g.globalAlpha = 0.34, g.translate(-2, -2), strokeAll(15, mixHex(th.trail, "#ffffff", 0.5)), g.restore(), g.save(), g.globalAlpha = 0.16, g.translate(6.5, 6.5), strokeAll(5, shade(th.trail, -0.4)), g.restore();
  for (let path of routes) {
    for (let d = 14; d < path.length; d += 15) {
      let p = path.at(d), side = (Math.floor(d / 15) % 2 ? 1 : -1) * 4;
      g.fillStyle = "rgba(160,110,80,0.22)", g.beginPath(), g.arc(p.x + p.dy * side, p.y - p.dx * side, 1.3, 0, 7), g.fill();
    }
    for (let d = 20; d < path.length; d += 37) {
      let p = path.at(d), o = (rnd() - 0.5) * 14;
      g.fillStyle = "#e8b878", g.beginPath(), g.ellipse(p.x + p.dy * o, p.y - p.dx * o, 2, 1.5, rnd() * 3, 0, 7), g.fill();
    }
  }
  if (ART81 && (art.chev ?? 0.08) > 0) {
    g.save(), g.lineCap = "round", g.lineJoin = "round", g.lineWidth = 1.8, g.strokeStyle = `rgba(82,60,75,${art.chev ?? 0.08})`;
    for (let path of routes) for (let d = 70; d < path.length - 30; d += 120) {
      let p = path.at(d);
      g.save(), g.translate(p.x, p.y), g.rotate(Math.atan2(p.dy, p.dx)), g.beginPath(), g.moveTo(-3, -4), g.lineTo(3, 0), g.lineTo(-3, 4), g.stroke(), g.restore();
    }
    g.restore();
  }
  for (let path of routes) {
    let p = path.pts[0], nx = Math.max(30, Math.min(w - 30, p.x)), ny = Math.max(26, p.y + 6);
    for (let k = 0; k < 6; k++) {
      let a = Math.PI * (0.1 + k * 0.16);
      tuft(g, nx + Math.cos(a) * 36 * (k % 2 ? 1 : -1), ny + 10 + Math.sin(a) * 6, 0.8 + rnd() * 0.4);
    }
  }
  ART81 && !(art.plate && art.plate.hide) && plates(g, routes, art.plate);
  for (let pr of props) drawProp(g, pr.k, (pr.c + 0.5) * TILE, (pr.r + 0.5) * TILE);
  let vg = g.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.45, w / 2, h / 2, Math.max(w, h) * 0.75);
  if (vg.addColorStop(0, "rgba(80,40,50,0)"), vg.addColorStop(1, ART81 ? "rgba(80,40,50,0.12)" : "rgba(80,40,50,0.18)"), g.fillStyle = vg, g.fillRect(0, 0, w, h), ART81) {
    let wall = (x0, y0, x1, y1, c0, c1, rx, ry, rw, rh) => {
      let q = g.createLinearGradient(x0, y0, x1, y1);
      q.addColorStop(0, c0), q.addColorStop(1, c1), g.fillStyle = q, g.fillRect(rx, ry, rw, rh);
    };
    wall(0, 5, 0, 21, "rgba(70,35,50,0.26)", "rgba(70,35,50,0)", 0, 5, w, 16), wall(5, 0, 19, 0, "rgba(70,35,50,0.20)", "rgba(70,35,50,0)", 5, 0, 14, h), wall(0, h - 15, 0, h - 5, "rgba(255,248,230,0)", "rgba(255,248,230,0.20)", 0, h - 15, w, 10), wall(w - 15, 0, w - 5, 0, "rgba(255,248,230,0)", "rgba(255,248,230,0.20)", w - 15, 0, 10, h);
  } else {
    let ig = g.createLinearGradient(0, 0, 0, 12);
    ig.addColorStop(0, "rgba(70,35,50,0.22)"), ig.addColorStop(1, "rgba(70,35,50,0)"), g.fillStyle = ig, g.fillRect(0, 0, w, 12);
  }
  {
    g.save(), g.beginPath(), g.rect(0, 0, w, h), g.rect(5, 5, w - 10, h - 10);
    let rg = g.createLinearGradient(0, 0, 0, h);
    rg.addColorStop(0, "#f0d0a4"), rg.addColorStop(0.5, "#e6bf8f"), rg.addColorStop(1, "#c99a68"), g.fillStyle = rg, g.fill("evenodd"), g.lineWidth = 2, g.strokeStyle = INK, g.strokeRect(5, 5, w - 10, h - 10), g.lineWidth = 1.4, g.strokeStyle = "rgba(255,246,222,0.85)", g.beginPath(), g.moveTo(1.5, h - 2), g.lineTo(1.5, 1.5), g.lineTo(w - 2, 1.5), g.stroke(), ART81 && (g.lineWidth = 1.6, g.strokeStyle = "rgba(110,70,45,0.6)", g.beginPath(), g.moveTo(1, h - 1), g.lineTo(w - 1, h - 1), g.lineTo(w - 1, 1), g.stroke()), g.restore();
  }
  return cv;
}
function plates(g, routes, po = {}) {
  let ends = [];
  for (let rt of routes) {
    let p = rt.pts[rt.pts.length - 1];
    ends.some((q) => Math.hypot(q.x - p.x, q.y - p.y) < 5) || ends.push(p);
  }
  for (let p of ends) {
    let cy = p.y + 19.5 + 4 + (po.dy || 0);
    g.save(), g.translate(p.x, cy), po.scale && g.scale(po.scale, po.scale), g.beginPath(), g.ellipse(0, 10, 32, 7, 0, 0, 7), g.fillStyle = "rgba(70,35,50,0.22)", g.fill(), g.beginPath(), g.ellipse(0, 0, 30, 11, 0, 0, 7);
    let pg = g.createLinearGradient(0, -11, 0, 11);
    pg.addColorStop(0, "#fff6e4"), pg.addColorStop(1, "#f1dcc0"), g.fillStyle = pg, g.fill(), g.lineWidth = 2.4, g.strokeStyle = INK, g.stroke(), g.beginPath(), g.ellipse(0, 0, 26, 8, 0, Math.PI * 0.9, Math.PI * 1.45), g.lineWidth = 1.4, g.strokeStyle = "rgba(255,255,255,0.85)", g.stroke(), g.restore();
  }
}
function tuft(g, x, y, s) {
  g.save(), g.translate(x, y), g.scale(s, s);
  for (let [a, l] of [[-0.5, 8], [0, 10], [0.5, 8]])
    g.beginPath(), g.moveTo(0, 0), g.quadraticCurveTo(Math.sin(a) * 4, -l * 0.6, Math.sin(a) * 6, -l), g.lineWidth = 3.4, g.strokeStyle = INK, g.lineCap = "round", g.stroke(), g.lineWidth = 1.8, g.strokeStyle = "#8fd17d", g.stroke();
  g.restore();
}
function drawProp(g, kind, x, y) {
  if (g.save(), g.translate(x, y), g.lineJoin = "round", g.lineCap = "round", ART81 ? (g.beginPath(), g.ellipse(0, 12.5, 17, 5.5, 0, 0, 7), g.fillStyle = "rgba(255,248,232,0.5)", g.fill(), g.lineWidth = 1.4, g.strokeStyle = "rgba(82,60,75,0.45)", g.stroke(), g.beginPath(), g.ellipse(2, 14, 19, 6, 0, 0, 7), g.fillStyle = "rgba(70,35,50,0.14)", g.fill(), g.beginPath(), g.ellipse(1, 13, 12, 3.6, 0, 0, 7), g.fillStyle = "rgba(70,35,50,0.30)", g.fill()) : shadow(g, 2, 13, 17, 5, 0.25), kind === "mug") {
    g.beginPath(), g.arc(13, -2, 7, -1.4, 1.4), g.lineWidth = 6, g.strokeStyle = INK, g.stroke(), g.lineWidth = 3, g.strokeStyle = "#ff9fb2", g.stroke(), rr(g, -13, -14, 26, 27, 6);
    let gr = g.createLinearGradient(-13, 0, 13, 0);
    gr.addColorStop(0, "#ffc4cf"), gr.addColorStop(1, "#f28aa0"), g.fillStyle = gr, g.fill(), g.lineWidth = 2.4, g.strokeStyle = INK, g.stroke(), g.beginPath(), g.ellipse(0, -14, 13, 4, 0, 0, 7), g.fillStyle = "#7a4a34", g.fill(), g.lineWidth = 2.2, g.stroke(), heart(g, 0, -1, 4, "#fff"), g.globalAlpha = 0.5, g.strokeStyle = "#fff", g.lineWidth = 2;
    for (let k of [-4, 3])
      g.beginPath(), g.moveTo(k, -20), g.quadraticCurveTo(k + 4, -25, k, -30), g.stroke();
    g.globalAlpha = 1, ART81 && propGloss(g, -8, -4, 2.6, 6.5, -9, -9);
  } else if (kind === "sugar") {
    blob(g, 0, 2, 16, 11, "#cfe8ff", 2.4), g.beginPath(), g.ellipse(0, -6, 14, 5, 0, 0, 7), g.fillStyle = "#fffaf0", g.fill(), g.lineWidth = 2, g.strokeStyle = INK, g.stroke(), sugarCube(g, -4, -9, 4), sugarCube(g, 4, -10, 3.5), g.fillStyle = "#8fc2ef";
    for (let k of [-8, 0, 8])
      g.beginPath(), g.arc(k, 5, 2, 0, 7), g.fill();
    ART81 && propGloss(g, -10, 3, 2.8, 5, -11, -1);
  } else if (kind === "jam") {
    rr(g, -11, -10, 22, 23, 6);
    let gr = g.createLinearGradient(-11, 0, 11, 0);
    gr.addColorStop(0, "#ff7a8a"), gr.addColorStop(1, "#c9304a"), g.fillStyle = gr, g.fill(), g.lineWidth = 2.4, g.strokeStyle = INK, g.stroke(), rr(g, -12, -16, 24, 8, 3), g.fillStyle = "#fff0f0", g.fill(), g.stroke(), g.fillStyle = "#ff9aa8";
    for (let k = -10; k < 12; k += 5)
      g.beginPath(), g.arc(k, -8, 2.4, 0, Math.PI), g.fill();
    rr(g, -7, -2, 14, 9, 3), g.fillStyle = "#fff6e8", g.fill(), g.lineWidth = 1.4, g.stroke(), g.beginPath(), g.ellipse(-5, -4, 2, 5, 0.2, 0, 7), g.fillStyle = "rgba(255,255,255,0.5)", g.fill();
  } else if (kind === "spoon")
    g.rotate(-0.6), rr(g, -2.5, -4, 5, 24, 2.5), g.fillStyle = "#d8dce8", g.fill(), g.lineWidth = 2, g.strokeStyle = INK, g.stroke(), blob(g, 0, -11, 8, 10, "#eef0f7", 2.2), g.beginPath(), g.ellipse(-2, -14, 2, 4, 0, 0, 7), g.fillStyle = "#fff", g.fill(), ART81 && (g.beginPath(), g.ellipse(-0.6, 8, 1.2, 6, 0, 0, 7), g.fillStyle = "rgba(255,255,255,0.55)", g.fill(), g.beginPath(), g.arc(-3.5, -17, 1.1, 0, 7), g.fillStyle = "rgba(255,255,255,0.8)", g.fill());
  else if (kind === "plant") {
    for (let [a, l] of [[-0.8, 16], [-0.3, 20], [0.2, 19], [0.7, 15]])
      g.save(), g.translate(0, -6), g.rotate(a), g.beginPath(), g.ellipse(0, -l / 2, 5, l / 2, 0, 0, 7), g.fillStyle = "#8fd17d", g.fill(), g.lineWidth = 2, g.strokeStyle = INK, g.stroke(), g.beginPath(), g.moveTo(0, 0), g.lineTo(0, -l + 3), g.lineWidth = 1, g.strokeStyle = "#5fa34e", g.stroke(), g.restore();
    g.beginPath(), g.moveTo(-11, -4), g.lineTo(11, -4), g.lineTo(8, 13), g.lineTo(-8, 13), g.closePath(), g.fillStyle = "#e88a5c", g.fill(), g.lineWidth = 2.4, g.strokeStyle = INK, g.stroke(), rr(g, -12, -7, 24, 5, 2), g.fillStyle = "#f2a274", g.fill(), g.stroke(), ART81 && propGloss(g, -6, 4, 1.8, 4.5, -6.5, 0);
  }
  ART81 && kind === "jam" && (g.beginPath(), g.arc(-8, -13, 1.2, 0, 7), g.fillStyle = "rgba(255,255,255,0.8)", g.fill()), g.restore();
}
function propGloss(g, x, y, rx, ry, dx, dy) {
  g.beginPath(), g.ellipse(x, y, rx, ry, 0.15, 0, 7), g.fillStyle = "rgba(255,255,255,0.55)", g.fill(), g.beginPath(), g.arc(dx, dy, 1.4, 0, 7), g.fillStyle = "rgba(255,255,255,0.8)", g.fill();
}
function drawSwatter(ctx2, x, y, ang = 0, sc = 1, flash = 0) {
  ctx2.save(), ctx2.translate(x, y), ctx2.rotate(ang), ctx2.scale(sc, sc), ctx2.lineJoin = "round", ctx2.lineCap = "round", shadow(ctx2, 0, 2, 9, 3, 0.22), rr(ctx2, -3.2, -34, 6.4, 34, 3.2), ctx2.fillStyle = "#d9a066", ctx2.fill(), ctx2.lineWidth = 2.2, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.moveTo(-1, -6), ctx2.lineTo(-1, -28), ctx2.lineWidth = 1.4, ctx2.strokeStyle = "rgba(255,240,210,0.55)", ctx2.stroke(), ctx2.beginPath(), ctx2.arc(0, -2.5, 1.7, 0, 7), ctx2.fillStyle = "#b97f48", ctx2.fill();
  let hx2 = -15, hy = -78, hw = 30, hh = 46;
  rr(ctx2, hx2, hy, hw, hh, 12), ctx2.fillStyle = "#ff9fb6", ctx2.fill(), ctx2.lineWidth = 2.6, ctx2.strokeStyle = INK, ctx2.stroke(), rr(ctx2, hx2 + 4, hy + 4, hw - 8, hh - 8, 8), ctx2.fillStyle = "#fff6ee", ctx2.fill(), ctx2.lineWidth = 1.6, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.save(), rr(ctx2, hx2 + 4, hy + 4, hw - 8, hh - 8, 8), ctx2.clip(), ctx2.lineWidth = 1, ctx2.strokeStyle = "rgba(255,159,182,0.75)";
  for (let k = 1; k < 4; k++)
    ctx2.beginPath(), ctx2.moveTo(hx2 + 4 + k * 5.5, hy + 4), ctx2.lineTo(hx2 + 4 + k * 5.5, hy + hh - 4), ctx2.stroke();
  for (let k = 1; k < 6; k++)
    ctx2.beginPath(), ctx2.moveTo(hx2 + 4, hy + 4 + k * 6), ctx2.lineTo(hx2 + hw - 4, hy + 4 + k * 6), ctx2.stroke();
  ctx2.restore(), ctx2.fillStyle = INK, ctx2.beginPath(), ctx2.arc(-4.6, hy + 20, 2.3, 0, 7), ctx2.arc(4.6, hy + 20, 2.3, 0, 7), ctx2.fill(), ctx2.fillStyle = "#fff", ctx2.beginPath(), ctx2.arc(-5.3, hy + 19.2, 0.8, 0, 7), ctx2.arc(3.9, hy + 19.2, 0.8, 0, 7), ctx2.fill(), ctx2.fillStyle = "rgba(255,111,145,0.45)", ctx2.beginPath(), ctx2.ellipse(-8.6, hy + 25, 2.6, 1.7, 0, 0, 7), ctx2.ellipse(8.6, hy + 25, 2.6, 1.7, 0, 0, 7), ctx2.fill(), flash > 0 && (rr(ctx2, hx2, hy, hw, hh, 12), ctx2.globalAlpha = flash * 0.7, ctx2.fillStyle = "#fff", ctx2.fill()), ctx2.restore();
}
var TABLE_SETS = { 1: ["leaf", "twig", "leaf", "pebble"], 2: ["pebble", "pebble", "twig", "leaf"], 3: ["cup", "cup", "plate"], 4: ["plate", "cutlery", "plate", "cup"], 5: ["donutbox", "napkin", "ring", "donutbox"], 6: ["syrup", "butter", "berry", "berry"] };
function drawTableProp(g, kind, x, y, r, rot = 0, shadow2 = !0) {
  g.save(), g.translate(x, y), shadow2 && (g.beginPath(), g.ellipse(r * 0.18, r * 0.62, r * 0.95, r * 0.32, 0, 0, 7), g.fillStyle = "rgba(70,35,50,0.18)", g.fill()), g.rotate(rot), g.lineWidth = 2, g.strokeStyle = INK, g.lineJoin = "round", g.lineCap = "round";
  let fs = (col) => {
    g.fillStyle = col, g.fill(), g.stroke();
  };
  switch (kind) {
    case "leaf":
      g.beginPath(), g.moveTo(-r, 0), g.quadraticCurveTo(0, -r * 0.9, r, 0), g.quadraticCurveTo(0, r * 0.9, -r, 0), g.closePath(), fs("#8fcf6a"), g.beginPath(), g.moveTo(-r * 0.8, 0), g.lineTo(r * 0.7, 0), g.strokeStyle = "#4f9a3c", g.stroke();
      break;
    case "twig":
      g.beginPath(), g.moveTo(-r, r * 0.1), g.lineTo(r, -r * 0.1), g.lineWidth = 7, g.strokeStyle = INK, g.stroke(), g.lineWidth = 3.4, g.strokeStyle = "#b98355", g.stroke(), g.beginPath(), g.moveTo(-r * 0.1, 0), g.lineTo(r * 0.3, -r * 0.5), g.lineWidth = 5, g.strokeStyle = INK, g.stroke(), g.lineWidth = 2, g.strokeStyle = "#b98355", g.stroke();
      break;
    case "pebble":
      g.beginPath(), g.ellipse(0, 0, r, r * 0.72, 0, 0, 7), fs("#cdc3c0"), g.beginPath(), g.ellipse(-r * 0.3, -r * 0.25, r * 0.28, r * 0.14, -0.4, 0, 7), g.fillStyle = "rgba(255,255,255,0.55)", g.fill();
      break;
    case "cup":
      g.beginPath(), g.arc(r * 0.95, 0, r * 0.38, -1.2, 1.2), g.lineWidth = 5, g.stroke(), g.lineWidth = 2, g.beginPath(), g.arc(0, 0, r * 0.82, 0, 7), fs("#fff1e0"), g.beginPath(), g.arc(0, 0, r * 0.58, 0, 7), fs("#a7794f"), g.beginPath(), g.ellipse(-r * 0.2, -r * 0.2, r * 0.18, r * 0.08, -0.6, 0, 7), g.fillStyle = "rgba(255,255,255,0.35)", g.fill();
      break;
    case "plate":
      g.beginPath(), g.arc(0, 0, r, 0, 7), fs("#fff6ea"), g.beginPath(), g.arc(0, 0, r * 0.66, 0, 7), g.lineWidth = 1.4, g.strokeStyle = "rgba(82,60,75,0.45)", g.stroke();
      break;
    case "cutlery":
      g.beginPath(), g.rect(-r, -r * 0.1, r * 1.1, r * 0.2), fs("#d9dde3"), g.beginPath(), g.ellipse(r * 0.25, 0, r * 0.2, r * 0.3, 0, 0, 7), fs("#d9dde3");
      for (let o of [-0.22, 0, 0.22])
        g.beginPath(), g.rect(r * 0.25, (o - 0.04) * r, r * 0.7, r * 0.08), fs("#d9dde3");
      break;
    case "donutbox":
      g.beginPath(), g.rect(-r * 0.9, -r * 0.7, r * 1.8, r * 1.4), fs("#f6a8c6"), g.beginPath(), g.rect(-r * 0.9, -r * 0.7, r * 1.8, r * 0.3), fs("#fff1f6"), g.beginPath(), g.arc(0, r * 0.12, r * 0.3, 0, 7), g.fillStyle = "#ffd89a", g.fill(), g.stroke();
      break;
    case "napkin":
      g.beginPath(), g.rect(-r * 0.8, -r * 0.8, r * 1.6, r * 1.6), fs("#fff5f0"), g.beginPath(), g.moveTo(-r * 0.8, -r * 0.1), g.lineTo(r * 0.8, -r * 0.1), g.lineWidth = 1.4, g.strokeStyle = "rgba(240,120,150,0.7)", g.stroke();
      break;
    case "ring":
      g.beginPath(), g.arc(0, 0, r * 0.8, 0, 7), g.lineWidth = 6, g.strokeStyle = "rgba(120,70,40,0.5)", g.stroke(), g.lineWidth = 2, g.beginPath(), g.arc(0, 0, r * 0.8, 0.3, 5.9), g.strokeStyle = "rgba(80,45,30,0.5)", g.stroke();
      break;
    case "syrup":
      g.beginPath(), A_rrp(g, -r * 0.5, -r * 0.6, r, r * 1.3, r * 0.3), fs("#c9742a"), g.beginPath(), A_rrp(g, -r * 0.28, -r * 0.95, r * 0.56, r * 0.4, 3), fs("#ffe0a0"), g.beginPath(), g.rect(-r * 0.4, -r * 0.1, r * 0.8, r * 0.45), g.fillStyle = "#fff3d6", g.fill();
      break;
    case "butter":
      g.beginPath(), A_rrp(g, -r * 0.9, -r * 0.5, r * 1.8, r, 4), fs("#ffe27a"), g.beginPath(), g.moveTo(-r * 0.7, -r * 0.3), g.lineTo(r * 0.4, -r * 0.3), g.lineWidth = 2, g.strokeStyle = "rgba(255,255,255,0.7)", g.stroke();
      break;
    case "berry":
      g.beginPath(), g.arc(0, 0, r * 0.7, 0, 7), fs("#b8456f"), g.beginPath(), g.arc(-r * 0.22, -r * 0.2, r * 0.16, 0, 7), g.fillStyle = "rgba(255,255,255,0.5)", g.fill(), g.beginPath(), g.ellipse(0, -r * 0.7, r * 0.3, r * 0.14, 0.2, 0, 7), fs("#5fb24a");
      break;
  }
  g.restore();
}
function A_rrp(g, x, y, w, h, r) {
  g.moveTo(x + r, y), g.arcTo(x + w, y, x + w, y + h, r), g.arcTo(x + w, y + h, x, y + h, r), g.arcTo(x, y + h, x, y, r), g.arcTo(x, y, x + w, y, r), g.closePath();
}
function renderTable(theme, world, seedStr, cw2, ch2, sc, margins, board) {
  let th = THEMES[theme % THEMES.length], mk = () => {
    let c = makeCanvas(Math.max(1, Math.round(cw2 * sc)), Math.max(1, Math.round(ch2 * sc))), g2 = c.getContext("2d");
    return g2.scale(sc, sc), [c, g2];
  }, [bd, g] = mk(), [lip, lg] = mk(), sd = 17;
  for (let i = 0; i < seedStr.length; i++) sd = (sd * 31 + seedStr.charCodeAt(i)) % 2147483647;
  let rnd = () => (sd = sd * 16807 % 2147483647) / 2147483647;
  g.fillStyle = shade(th.a, -0.12), g.fillRect(0, 0, cw2, ch2);
  let nN = Math.min(2600, Math.round(cw2 * ch2 / 40));
  for (let i = 0; i < nN; i++)
    g.fillStyle = i % 2 ? "rgba(255,255,255,0.05)" : "rgba(60,30,40,0.05)", g.fillRect(rnd() * cw2, rnd() * ch2, 1.5, 1.5);
  let fr = (inf, a) => {
    A_rrp(g, board.x - inf, board.y - inf + 2, board.w + inf * 2, board.h + inf * 2, 10 + inf), g.fillStyle = `rgba(70,35,50,${a})`, g.fill();
  };
  g.beginPath(), fr(10, 0.06), g.beginPath(), fr(8, 0.07), g.beginPath(), fr(6, 0.08), g.beginPath(), fr(4, 0.1);
  let kinds = TABLE_SETS[world] || TABLE_SETS[1], n = 0;
  for (let m of margins)
    if (m.side === "L" || m.side === "R") {
      if (m.w < 24) continue;
      let r = Math.max(12, Math.min(42, m.w * 0.6)), cnt = Math.max(1, Math.min(4, Math.floor(m.h / (r * 3.2))));
      for (let i = 0; i < cnt; i++) {
        let cy = m.y + (i + 0.5 + (rnd() - 0.5) * 0.4) * m.h / cnt, kind = kinds[n++ % kinds.length], rot = (rnd() - 0.5) * 1.4, inward = i % 2 === 0, cx = m.side === "L" ? inward ? m.w + 4 - r * 0.9 : m.w * 0.4 : inward ? m.x - 4 + r * 0.9 : m.x + m.w * 0.6;
        drawTableProp(g, kind, cx, cy, r, rot, !0), inward && (lg.save(), lg.beginPath(), m.side === "L" ? lg.rect(m.w, cy - r * 1.4, 4, r * 2.8) : lg.rect(m.x - 4, cy - r * 1.4, 4, r * 2.8), lg.clip(), drawTableProp(lg, kind, cx, cy, r, rot, !1), lg.restore());
      }
    } else {
      if (m.h < 24) continue;
      let r = Math.max(9, Math.min(34, (m.h - 6) * 0.45)), cnt = Math.max(1, Math.floor(m.w / (r * 4)));
      for (let i = 0; i < cnt; i++) {
        let cx = m.x + (i + 0.5 + (rnd() - 0.5) * 0.4) * m.w / cnt, cy = m.side === "T" ? m.y + m.h - 6 - r - rnd() * Math.max(0, m.h - 12 - 2 * r) : m.y + 6 + r + rnd() * Math.max(0, m.h - 12 - 2 * r);
        drawTableProp(g, kinds[n++ % kinds.length], cx, cy, r, (rnd() - 0.5) * 1.4, !0);
      }
    }
  return { bd, lip, props: n };
}

// src/uitext.js
function levelHeaderLine(level, maps) {
  let map = maps[level.map] ? maps[level.map].name : "";
  return !map || map === level.name ? level.name : `${level.name}  -  ${map}`;
}

// src/audio.js
var ac = null, master = null, muted = !1, last = {};
function initAudio() {
  if (!ac)
    try {
      let AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ac = new AC(), master = ac.createGain(), master.gain.value = 0.25, master.connect(ac.destination);
    } catch {
      ac = null;
    }
}
function setMuted(m) {
  muted = m;
}
function tone(freq, dur, type = "sine", vol = 0.5, slide = 0, delay = 0) {
  if (!ac || muted) return;
  let t = ac.currentTime + delay, o = ac.createOscillator(), g = ac.createGain();
  o.type = type, o.frequency.setValueAtTime(freq, t), slide && o.frequency.exponentialRampToValueAtTime(Math.max(30, freq * slide), t + dur), g.gain.setValueAtTime(1e-4, t), g.gain.exponentialRampToValueAtTime(vol, t + 0.01), g.gain.exponentialRampToValueAtTime(1e-4, t + dur), o.connect(g), g.connect(master), o.start(t), o.stop(t + dur + 0.02);
}
function noise(dur, vol = 0.4, hp = 800) {
  if (!ac || muted) return;
  let len = Math.floor(ac.sampleRate * dur), buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  let s = ac.createBufferSource();
  s.buffer = buf;
  let f = ac.createBiquadFilter();
  f.type = "highpass", f.frequency.value = hp;
  let g = ac.createGain();
  g.gain.value = vol, s.connect(f), f.connect(g), g.connect(master), s.start();
}
var speedK = 1;
function setAudioSpeed(k) {
  speedK = k;
}
var FAST_THROTTLED = /* @__PURE__ */ new Set(["laser", "zap", "pop", "pulse"]), throttleMs = (name, speed) => name === "coinTick" ? speed >= 4 ? 120 : 100 : speed >= 4 && FAST_THROTTLED.has(name) ? 120 : 60;
function sfx(name) {
  if (!ac || muted) return;
  let now2 = performance.now();
  if (!(last[name] && now2 - last[name] < throttleMs(name, speedK)))
    switch (last[name] = now2, name) {
      case "pop":
        tone(520 + Math.random() * 200, 0.12, "sine", 0.35, 1.8);
        break;
      case "place":
        tone(392, 0.09, "triangle", 0.4), tone(587, 0.12, "triangle", 0.35, 1, 0.07);
        break;
      case "upgrade":
        tone(523, 0.1, "triangle", 0.4), tone(659, 0.1, "triangle", 0.4, 1, 0.08), tone(784, 0.16, "triangle", 0.4, 1, 0.16);
        break;
      case "zap":
        tone(1200, 0.08, "square", 0.12, 0.4);
        break;
      case "laser":
        tone(1600, 0.05, "sawtooth", 0.06, 0.6);
        break;
      case "pulse":
        tone(110, 0.22, "sine", 0.5, 0.6);
        break;
      case "boom":
        noise(0.5, 0.6, 120), tone(90, 0.4, "sine", 0.6, 0.4);
        break;
      case "swat":
        tone(330 + Math.random() * 40, 0.09, "sine", 0.32, 0.55), noise(0.05, 0.1, 1500);
        break;
      // v0.7.2: the cookie guard's soft thwap (a lower 'pop')
      case "steal":
        tone(300, 0.15, "square", 0.12, 0.6);
        break;
      case "return":
        tone(660, 0.12, "triangle", 0.3, 1.5);
        break;
      case "wave":
        tone(440, 0.12, "triangle", 0.3), tone(440, 0.12, "triangle", 0.3, 1, 0.16);
        break;
      case "win":
        [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.22, "triangle", 0.4, 1, i * 0.12));
        break;
      case "lose":
        [392, 330, 262].forEach((f, i) => tone(f, 0.3, "triangle", 0.4, 1, i * 0.2));
        break;
      case "shield":
        tone(1568, 0.05, "triangle", 0.16), tone(988, 0.09, "triangle", 0.14, 1, 0.04), tone(659, 0.12, "sine", 0.12, 1, 0.09);
        break;
      // v0.8.1 M4: a glassy 'tink' when a glaze shield breaks
      case "shieldUp":
        tone(659, 0.08, "sine", 0.1), tone(988, 0.1, "sine", 0.1, 1, 0.07);
        break;
      // v0.8.1 M4: soft rising pair when the shield is full again
      case "coinTick":
        tone(1318 + Math.random() * 60, 0.05, "triangle", 0.14, 1.1);
        break;
      // v0.8.1 G4/J10: a small bright tick when crumbs land on the counter
      case "perfect":
        [784, 988, 1175, 1568].forEach((f, i) => tone(f, 0.16, "triangle", 0.3, 1, i * 0.07)), tone(2093, 0.3, "sine", 0.14, 1, 0.3);
        break;
      // v0.8.1 J10: Perfect = a quick rising arpeggio + a sparkle
      case "boss":
        tone(98, 0.5, "sawtooth", 0.14, 0.7), tone(147, 0.4, "triangle", 0.18, 0.8, 0.12);
        break;
      // v0.8.1 J9: the Queen's low entrance tone
      case "heal":
        tone(880, 0.1, "sine", 0.18), tone(1175, 0.14, "sine", 0.16, 1, 0.08);
        break;
      // v0.7.9: a soft two-note chime for a nurse pulse
      case "tap":
        tone(700, 0.05, "sine", 0.25);
        break;
      case "freeze":
        tone(1800, 0.4, "sine", 0.2, 0.5);
        break;
      case "plane":
        tone(140, 1.2, "sawtooth", 0.08, 1.3);
        break;
      case "gust":
        noise(0.3, 0.12, 2e3);
        break;
      case "packShake":
        noise(0.15, 0.14, 2e3);
        break;
      // v0.7 pack reveal: the pack rocks
      case "cardFlip":
        tone(900, 0.05, "sine", 0.22, 1.3);
        break;
    }
}

// src/loop.js
var STEP = 0.016666666666666666, SPEEDS = [1, 2, 4], FRAME_BUDGET_MS = 10, ACC_CAP_STEPS = 8, MAX_FRAME_DT = 0.1, nextSpeed = (s) => SPEEDS[(Math.max(0, SPEEDS.indexOf(s)) + 1) % SPEEDS.length], startSpeed = (s, max = 2) => Math.min(SPEEDS.includes(s) ? s : 1, max);
function newClock() {
  return { acc: 0 };
}
function advanceFrame(clk, dtReal, speed, stepFn, opts = {}) {
  let dt = Math.min(MAX_FRAME_DT, Math.max(0, dtReal));
  clk.acc += dt * speed;
  let t0 = opts.now ? opts.now() : 0, budget = opts.budgetMs ?? FRAME_BUDGET_MS, n = 0;
  for (; clk.acc >= STEP - 1e-9; ) {
    let over = stepFn(STEP);
    if (clk.acc -= STEP, n++, over) {
      clk.acc = 0;
      break;
    }
    if (opts.now && n < 64 && opts.now() - t0 > budget) {
      clk.acc = Math.min(clk.acc, ACC_CAP_STEPS * STEP), clk.guarded = (clk.guarded || 0) + 1;
      break;
    }
  }
  return clk.acc < 0 && (clk.acc = 0), n;
}

// src/bot.js
var VALUE = { laser: 1.3, slingshot: 1, sound: 1.1, lizard: 1.1, spray: 1, zapper: 0.9, gate: 0.8, lava: 0.8, ball: 0.9, glue: 0.6, pheromone: 0.7, fan: 0.5, tractor: 0.8 };
function coverage(b, x, y, range) {
  let n = 0;
  for (let rt of b.routes) for (let d = 0; d <= rt.length; d += 10) {
    let p = rt.at(d);
    Math.hypot(p.x - x, p.y - y) <= range && n++;
  }
  return n;
}
function directionalScore(b, card, c, r) {
  let T = TOWERS[card], tmp = b.addTower(card, c, r);
  if (b.towers.pop(), !tmp.trailDir) return card === "fan" ? -1 : 0;
  if (card === "fan") return b.windScore(tmp.x, tmp.y, tmp.ax, tmp.ay, tmp.stat("range"));
  if (card === "tractor") {
    let x = (tmp.trailDir.nc + 0.5) * TILE, y = (tmp.trailDir.nr + 0.5) * TILE, nd2 = b.nearestOnTrail(x, y);
    return 1 + nd2.d / b.routes[nd2.ri].length;
  }
  if (tmp.runLen <= 0) return 0;
  let nd = b.nearestOnTrail((tmp.lc + 0.5) * TILE, (tmp.lr + 0.5) * TILE), p = b.routes[nd.ri].at(nd.d), up = -(tmp.ax * p.dx + tmp.ay * p.dy);
  return tmp.runLen * (up > 0.5 ? 1 : 0.4);
}
function bestTile(b, card) {
  let T = TOWERS[card], best = null, bs = -1;
  for (let c = 0; c < GRID_COLS; c++) for (let r = 0; r < GRID_ROWS; r++) {
    let ti = b.tileInfo(c, r);
    if (!ti.valid || ti.tower || (T.place === "path" ? !ti.onPath : ti.onPath) || T.nearTrail && !b.touchesTrail(c, r)) continue;
    let x = (c + 0.5) * TILE, y = (r + 0.5) * TILE, s;
    if (T.place === "path") {
      let nd = b.nearestOnTrail(x, y);
      s = nd.d / b.routes[nd.ri].length * 5;
      for (let tw of b.towers) TOWERS[tw.type].place === "side" && Math.hypot(tw.x - x, tw.y - y) <= tw.stat("range") && (s += 3);
      for (let tw of b.towers) tw.type === card && Math.hypot(tw.x - x, tw.y - y) < 80 && (s -= 6);
    } else card === "ball" ? s = directionalScore(b, card, c, r) / 10 : card === "fan" || card === "tractor" ? s = directionalScore(b, card, c, r) : s = coverage(b, x, y, towerStat(card, "range", 1, b.cardLevels[card] || 1));
    s > bs && (bs = s, best = { c, r, s });
  }
  return best;
}
function smartBotStep(b) {
  if (b.result) return null;
  if (b.cardsPlayed === 0 && b.rerollPrice === 0 && !b.botRedrawn) {
    let top = b.deck.find(isDamageCard);
    b.botRedrawn = !0, top && !b.picks.includes(top) && b.reroll();
  }
  if (b.crumbs < b.nextCardCost) return null;
  let bestMove = null, bestScore = -1 / 0;
  if (b.picks.forEach((card2, i) => {
    let same = b.towers.filter((t) => t.type === card2), upg = same.filter((t) => t.lvl < b.cfg.maxInBattleLevel).sort((a, z) => a.lvl - z.lvl)[0], v = VALUE[card2] || 1, airNeed = AIR_COUNTERS.includes(card2) && b.towers.filter((t) => AIR_COUNTERS.includes(t.type)).length < 2 && levelAntTypes(b.levelIndex).some((t) => ANTS[t].flying) ? 1.5 : 0;
    if (!(!b.towers.some((t) => isDamageCard(t.type)) && b.picks.some(isDamageCard) && !isDamageCard(card2))) {
      if (same.length < 2 || !upg) {
        let t = bestTile(b, card2);
        if (t) {
          let sc = v * (2 - same.length * 0.5) + airNeed;
          sc > bestScore && (bestScore = sc, bestMove = { i, c: t.c, r: t.r });
        }
      }
      if (upg) {
        let sc = v * 1.2 - upg.lvl * 0.2 + airNeed * 0.5;
        sc > bestScore && (bestScore = sc, bestMove = { i, c: upg.c, r: upg.r });
      }
    }
  }), !bestMove) return null;
  let card = b.picks[bestMove.i];
  return b.playCard(bestMove.i, bestMove.c, bestMove.r);
}

// src/fx.js
var FLOAT_TEXT = { mergeRadius: 60, maxAlive: 8, perKeyMax: { queen: 1, immune: 2 } };
function addFloatText(list, item, cfg = FLOAT_TEXT) {
  let kind = item.k || "txt", texts = list.filter((f2) => f2.k === kind && f2.life > 0), same = texts.filter((f2) => f2.key === item.key), near = same.find((f2) => Math.hypot(f2.x - item.x, f2.y0 - item.y) <= cfg.mergeRadius && f2.life > f2.max * 0.35);
  if (near)
    return near.n += item.n || 0, near.s = item.fmt(near.n), near.life = near.max, near;
  let lim = cfg.perKeyMax[item.key];
  if (lim != null && same.length >= lim) {
    let f2 = same[same.length - 1];
    return f2.life = f2.max, f2;
  }
  if (texts.length >= cfg.maxAlive) {
    let i = list.indexOf(texts[0]);
    i >= 0 && list.splice(i, 1);
  }
  let f = { k: kind, key: item.key, n: item.n || 0, s: item.fmt(item.n || 0), x: item.x, y: item.y, y0: item.y, col: item.col, life: item.life || 1, max: item.life || 1 };
  return list.push(f), f;
}

// src/treat.js
function newTreatState() {
  return { face: null, start: -1e9, until: -1e9, bites: [], count: 0 };
}
function pickReaction(st, now2, n = 1, R = UI.treatReact) {
  return st.count === 0 ? "surprised" : n >= R.bigBite ? "crying" : st.bites.filter((t) => now2 - t <= R.rushWindow).length + 1 >= R.rushBites ? "oyoy" : ["surprised", "sad", "oyoy"][st.count % 3];
}
function onBite(st, now2, n = 1, R = UI.treatReact) {
  let face = pickReaction(st, now2, n, R);
  return now2 < st.until && st.face === face || (st.start = now2), st.face = face, st.until = now2 + R.time, st.bites = [...st.bites.filter((t) => now2 - t <= R.rushWindow), now2], st.count++, face;
}
function reaction(st, now2) {
  return st && st.face && now2 < st.until ? { face: st.face, age: now2 - st.start } : null;
}

// src/preview.js
var STRIP_H = 22, STRIP_Y = 4, STRIP_MAX_TYPES = 4, TANK_HP = 40;
function waveGroups(wave, max = STRIP_MAX_TYPES) {
  let m = /* @__PURE__ */ new Map();
  for (let e of wave) m.set(e.type, (m.get(e.type) || 0) + 1);
  let all = [...m.entries()].map(([type, count], i) => ({ type, count, i })).sort((a, b) => b.count - a.count || a.i - b.i).map(({ type, count }) => ({ type, count })), groups = all.slice(0, max), rest = all.slice(max);
  return { groups, moreTypes: rest.length, moreAnts: rest.reduce((s, g) => s + g.count, 0), total: wave.length };
}
var isTank = (type) => ANTS[type].hp >= TANK_HP, isFlyer = (type) => !!ANTS[type].flying;
function previewModel(b) {
  return b.result ? null : b.nextWave >= b.waves.length ? { kind: "left", left: antsLeft(b) } : b.pending.length > 0 ? null : { kind: "next", n: b.nextWave + 1, ...waveGroups(b.waves[b.nextWave]) };
}
function antsLeft(b) {
  return b.ants.filter((a) => !a.dead).length + b.pending.length;
}
function nestPoints(b) {
  let nests = [];
  for (let rt of b.routes) {
    let q = rt.pts[0];
    nests.some((n) => Math.hypot(n.x - q.x, n.y - q.y) < 5) || nests.push(q);
  }
  let W2 = GRID_COLS * TILE, Hh = GRID_ROWS * TILE;
  return nests.map((q) => ({ x: Math.max(30, Math.min(W2 - 30, q.x)), y: Math.max(26, Math.min(Hh - 20, q.y + 6)) }));
}
function cookiePoints(b) {
  let pts = b.path.pts;
  return [pts[pts.length - 1]];
}
function blockedSpans(b, y0 = STRIP_Y, h = STRIP_H) {
  let W2 = GRID_COLS * TILE, out = [], y1 = y0 + h, row0 = Math.floor(y0 / TILE), row1 = Math.floor((y1 - 1) / TILE);
  for (let r = row0; r <= row1; r++) for (let c = 0; c < GRID_COLS; c++) b.isPathTile(c, r) && out.push([c * TILE - 6, (c + 1) * TILE + 6, "trail"]);
  for (let n of nestPoints(b)) n.y + 22 > y0 && n.y - 34 < y1 && out.push([n.x - 36, n.x + 36, "nest"]);
  for (let t of b.towers || []) t.r >= row0 && t.r <= row1 && out.push([t.x - 24, t.x + 24, "tower"]);
  for (let q of cookiePoints(b)) q.y + 34 > y0 && q.y - 34 < y1 && out.push([q.x - 36, q.x + 36, "cookie"]);
  return out.sort((a, c) => a[0] - c[0]).map(([a, c, k]) => [Math.max(0, a), Math.min(W2, c), k]);
}
function freeSpans(b, y0 = STRIP_Y, h = STRIP_H, margin = 4) {
  let W2 = GRID_COLS * TILE, spans = [], x = margin;
  for (let [a, c] of blockedSpans(b, y0, h))
    a - margin > x && spans.push([x, a - margin]), x = Math.max(x, c + margin);
  return W2 - margin > x && spans.push([x, W2 - margin]), spans;
}
function stripRect(b, w, y0 = STRIP_Y, h = STRIP_H) {
  let W2 = GRID_COLS * TILE, spans = freeSpans(b, y0, h).filter(([a2, c2]) => c2 - a2 >= 60);
  if (!spans.length) return null;
  spans.sort((p, q) => q[1] - q[0] - (p[1] - p[0]) || Math.abs((p[0] + p[1]) / 2 - W2 / 2) - Math.abs((q[0] + q[1]) / 2 - W2 / 2));
  let [a, c] = spans[0], ww = Math.min(w, c - a);
  return { x: a + (c - a - ww) / 2, y: y0, w: ww, h };
}

// src/game.js
var W = 400, H = 720, MAP_Y = 68, MAP_W = GRID_COLS * TILE, MAP_H = GRID_ROWS * TILE, TRAY_Y = MAP_Y + MAP_H + 4, BG = "#fbe9dc", canvas = document.getElementById("game"), ctx = canvas.getContext("2d"), dpr = 1, scale = 1, offX = 0, offY = 0, pxRatio = 1, storage = (() => {
  try {
    return localStorage.setItem("__t", "1"), localStorage.removeItem("__t"), localStorage;
  } catch {
    let m = {};
    return { getItem: (k) => m[k] ?? null, setItem: (k, v) => {
      m[k] = String(v);
    } };
  }
})(), S = {
  screen: "map",
  save: loadSave(storage),
  battle: null,
  levelIndex: 0,
  t: 0,
  prep: { deck: [], bonuses: [] },
  sel: null,
  drag: null,
  info: null,
  speed: 1,
  paused: !1,
  result: null,
  toast: null,
  fx: [],
  swatQ: [],
  ui: [],
  bgCache: {},
  cardsSel: null,
  confirmReset: 0,
  autoBot: !1,
  shopMsg: null,
  crumbShake: 0,
  crumbPulse: 0,
  crumbBump: 0,
  chipSparkT: -9,
  slotFlip: [0, 0, 0],
  mergeAnim: null,
  prepAlert: null,
  dialog: null,
  cal: null,
  cookieOuch: 0,
  clockOffset: 0,
  treat: newTreatState(),
  // v0.5: map scroll (item 13), per-card screen (items 6/7), NEW CARD reveals (item 7), Move/Swap mode (items 11/12),
  // fireworks (item 16), shop purchase animation (item 8)
  mapScroll: 0,
  cardView: null,
  reveal: [],
  pack: null,
  mode: null,
  fireworks: { rockets: [], parts: [], queue: [] },
  shopFx: null,
  shopSel: null,
  queenDown: null
};
S.save.settings && S.save.settings.muted && setMuted(!0);
function persist() {
  S.skinSrc = null, writeSave(storage, S.save);
}
function now() {
  return Date.now() + S.clockOffset;
}
var lastBeat = -1e9;
function heartbeat(force) {
  !force && S.t - lastBeat < CALENDAR.heartbeatSec || (lastBeat = S.t, touch(S.save, now()), persist());
}
var calAutoDay = null;
function maybeShowCalendar() {
  if (S.screen !== "map" || S.cal || !canClaim(S.save, now())) return;
  let d = dayNumber(now());
  calAutoDay !== d && (calAutoDay = d, openCalendar());
}
function openCalendar() {
  S.cal = { t: 0, result: null }, sfx("tap");
}
function setPaused(v) {
  S.paused = v, S.battle && (S.battle.paused = v), v && (S.sel = null, S.drag = null, S.info = null, S.mode = null, S.toast && S.toast.hint && (S.toast = null));
}
var META_SCREENS = ["map", "cards", "card", "shop", "cabinet", "antbook"], BAR_H = 56, META_H = 660, cw = 0, ch = 0, insetB = 0, insetProbe = null, insetOverride = null;
function readInset() {
  if (insetOverride != null) return insetOverride;
  try {
    insetProbe || (insetProbe = document.createElement("div"), insetProbe.style.cssText = "position:fixed;left:0;bottom:0;width:0;height:0;visibility:hidden;pointer-events:none;padding-bottom:env(safe-area-inset-bottom,0px)", document.body.appendChild(insetProbe));
    let v = parseFloat(getComputedStyle(insetProbe).paddingBottom);
    return isFinite(v) && v > 0 ? v : 0;
  } catch {
    return 0;
  }
}
function isMeta() {
  return META_SCREENS.includes(S.screen);
}
function applyLayout() {
  if (isMeta()) {
    let availH = Math.max(100, ch - (BAR_H + insetB));
    scale = Math.min(cw / W, availH / META_H), offX = (cw - W * scale) / 2, offY = (availH - META_H * scale) / 2;
  } else {
    let availH = Math.max(100, ch - insetB);
    scale = Math.min(cw / W, availH / H), offX = (cw - W * scale) / 2, offY = (availH - H * scale) / 2;
  }
  let px = Math.max(1, Math.round(dpr * scale * 2) / 2);
  px !== pxRatio && (pxRatio = px, S.bgCache = {}, clearTowerCache());
}
function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 3), cw = window.innerWidth, ch = window.innerHeight, insetB = readInset(), canvas.width = Math.round(cw * dpr), canvas.height = Math.round(ch * dpr), canvas.style.width = cw + "px", canvas.style.height = ch + "px", applyLayout(), S.bgCache = {}, S.bdCache = {}, clearTowerCache();
}
window.addEventListener("resize", resize);
function refreshInset() {
  Math.abs(readInset() - insetB) > 0.5 && resize();
}
window.addEventListener("orientationchange", () => {
  resize(), setTimeout(resize, 350);
});
window.visualViewport && window.visualViewport.addEventListener && window.visualViewport.addEventListener("resize", resize);
resize();
var buttons = [], prevButtons = [];
function button(id, x, y, w, h, onTap, opt = {}) {
  buttons.push({ id, x, y, w, h, onTap, ...opt });
}
function hit(list, x, y) {
  for (let i = list.length - 1; i >= 0; i--) {
    let b = list[i];
    if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) return b;
  }
  return null;
}
function drawButton(x, y, w, h, label, col = "#ffb3c1", opt = {}) {
  let press = opt.pressed ? 3 : 0;
  if (ctx.save(), ART81 && !opt.disabled && !opt.noSquash) {
    let cx = x + w / 2, cy = y + h / 2, inB = (q) => q && q.id !== "map" && q.w * q.h < 2e4 && cx >= q.x && cx <= q.x + q.w && cy >= q.y && cy <= q.y + q.h, now2 = performance.now(), dn = down && !down.moved && inB(down.b), rl = S.relB && inB(S.relB.b) ? now2 - S.relB.t : null, ps = pressScale(!!dn, dn ? now2 - down.t0 : 0, rl);
    ps !== 1 && !reducedMotion() && (ctx.translate(cx, cy), ctx.scale(ps, ps), ctx.translate(-cx, -cy));
  }
  if (drawPillButton(ctx, x, y, w, h, opt.disabled ? "dis" : col, { pressed: !!opt.pressed, disabled: !!opt.disabled, r: opt.r ?? Math.min(14, h / 2) }), label) {
    let neutral = !opt.disabled && String(col).toLowerCase() === "#fff3e6";
    opt.disabled ? (ctx.globalAlpha = 0.6, drawChunkyText(ctx, label, x + w / 2, y + h / 2 + press + 1, opt.size || 17, { mode: "btn" })) : neutral ? (ctx.font = `${opt.size || 17}px ${FONT_DISPLAY}`, ctx.textAlign = "center", ctx.textBaseline = "middle", ctx.fillStyle = INK, ctx.fillText(label, x + w / 2, y + h / 2 + press + 1)) : drawChunkyText(ctx, label, x + w / 2, y + h / 2 + press + 1, opt.size || 17, { mode: "btn" });
  }
  ctx.restore();
}
function panel(x, y, w, h, col = "#fff6ee", r = 18, opt = {}) {
  drawBeveledTile(ctx, x, y, w, h, col, { lip: h >= 28 ? 4 : 3, r, lw: 3, hi: 0.55, end: col === "#fff6ee" ? "#fff0e6" : void 0 }), opt.gold && (rr(ctx, x + 3.5, y + 3.5, w - 7, h - 7, Math.max(4, r - 3)), ctx.lineWidth = 3, ctx.strokeStyle = "#f6c648", ctx.stroke(), rr(ctx, x + 6, y + 6, w - 12, h - 12, Math.max(3, r - 5)), ctx.lineWidth = 1.2, ctx.strokeStyle = "rgba(255,248,200,0.9)", ctx.stroke());
}
function toast(msg, col = "#fff") {
  let small = S.screen === "battle";
  S.toast = { msg, t: small ? UI.toastTime : UI.menuToastTime, col, small };
}
function needCrumbs(n) {
  toast(`Need ${n} crumbs`, "#ffd0d0"), S.crumbShake = 0.45, sfx("tap");
}
var down = null;
function toLogical(e) {
  return { x: (e.clientX - offX) / scale, y: (e.clientY - offY) / scale };
}
canvas.addEventListener("pointerdown", (e) => {
  initAudio(), e.preventDefault(), S.result && S.result.t < 4 && (S.result.coinSkip = !0);
  let p = toLogical(e), b = hit(prevButtons, p.x, p.y);
  down = { x: p.x, y: p.y, b, moved: !1, t0: performance.now() }, S.screen === "map" && !S.cal && !S.reveal.length && !S.pack && p.y >= MAPVIEW.top && p.y <= MAPVIEW.bottom && (down.scroll0 = S.mapScroll), b && b.onDown && b.onDown(p);
});
canvas.addEventListener("pointermove", (e) => {
  if (!down) return;
  let p = toLogical(e);
  Math.hypot(p.x - down.x, p.y - down.y) > 8 && (down.moved = !0), S.screen === "battle" && S.battle && !S.drag && sweepPieces(S.battle, down.lx ?? down.x, down.ly ?? down.y, p.x, p.y), down.lx = p.x, down.ly = p.y, S.drag && (S.drag.x = p.x, S.drag.y = p.y, S.drag.moved = S.drag.moved || down.moved), down.scroll0 != null && down.moved && (S.mapScroll = clampScroll(down.scroll0 + (p.y - down.y)));
});
canvas.addEventListener("pointerup", (e) => {
  if (!down) return;
  let p = toLogical(e);
  if (S.drag && S.drag.moved) {
    dropCard(p), S.drag = null, down = null;
    return;
  }
  if (down.scroll0 != null && down.moved) {
    down = null;
    return;
  }
  S.drag = null;
  let b = hit(prevButtons, p.x, p.y);
  down.b && (S.relB = { b: down.b, t: performance.now() }), b && down.b && b.id === down.b.id && b.onTap && (b.id !== "map" && haptic("light"), b.onTap(p)), down = null;
});
canvas.addEventListener("pointercancel", () => {
  down = null, S.drag = null;
});
document.addEventListener("visibilitychange", () => {
  document.hidden && S.screen === "battle" && !S.result && setPaused(!0), document.hidden || (heartbeat(!0), maybeShowCalendar());
});
var OWN_BACK_MS = 400, ownBackPending = 0, ownBackAt = 0, ownBackTimer = 0;
function ownBack() {
  try {
    ownBackPending++, ownBackAt = performance.now(), clearTimeout(ownBackTimer), ownBackTimer = setTimeout(() => {
      ownBackPending = 0;
    }, OWN_BACK_MS), history.back();
  } catch {
    ownBackPending = 0;
  }
}
function openSettings() {
  S.settings = { t: 0 }, S.confirmReset = 0, sfx("tap");
  try {
    history.state && history.state.inner || (history.pushState({ inner: 1 }, ""), S.settingsPushed = !0);
  } catch {
  }
}
function closeSettings() {
  S.settings = null, S.confirmReset = 0, S.settingsPushed && (S.settingsPushed = !1, ownBack());
}
function go(screen) {
  S.settingsPushed = !1, S.screen = screen, S.guide = null, S.antCard = null, S.starCard = null, S.prepTip = null, S.sel = null, S.info = null, S.drag = null, S.mergeAnim = null, S.toast = null, S.dialog = null, S.cal = null, S.settings = null, S.mode = null, S.shopFx = null, sfx("tap"), screen === "map" && (S.mapScroll = autoMapScroll(), maybeShowCalendar());
  try {
    let inner = history.state && history.state.inner;
    screen !== "map" && !inner ? history.pushState({ inner: 1 }, "") : screen === "map" && inner && ownBack();
  } catch {
  }
}
window.addEventListener("popstate", () => {
  if (ownBackPending > 0 && performance.now() - ownBackAt < OWN_BACK_MS) {
    ownBackPending--, ownBackPending || clearTimeout(ownBackTimer);
    return;
  }
  if (ownBackPending = 0, clearTimeout(ownBackTimer), S.pack) {
    closePack("ok");
    try {
      history.pushState({ inner: 1 }, "");
    } catch {
    }
    return;
  }
  if (S.dialog) {
    S.dialog = null;
    try {
      history.pushState({ inner: 1 }, "");
    } catch {
    }
    return;
  }
  if (S.screen === "map") {
    S.cal ? S.cal = null : S.settings && (S.settings = null, S.confirmReset = 0, S.settingsPushed = !1);
    return;
  }
  let repush = () => {
    try {
      history.pushState({ inner: 1 }, "");
    } catch {
    }
  };
  if (S.screen === "battle" && !S.result) {
    setPaused(!S.paused), repush();
    return;
  }
  if (S.screen === "card") {
    S.screen = "cards", repush();
    return;
  }
  if (S.screen === "cabinet") {
    S.screen = "shop", repush();
    return;
  }
  if (S.screen === "antbook") {
    S.antBookSel ? S.antBookSel = null : S.screen = "cards", repush();
    return;
  }
  S.battle = null, S.screen = "map", S.sel = null;
});
function openPrep(i) {
  S.levelIndex = i;
  let unlocked = unlockedCards(S.save), deck = (S.save.lastDeck || []).filter((id) => unlocked.includes(id));
  for (let id of unlocked) deck.length < BATTLE.deckSize && !deck.includes(id) && deck.push(id);
  S.prep.deck = deck.slice(0, BATTLE.deckSize), S.prep.bonuses = autoFixBonuses(S.save, (S.save.lastBonuses || BONUS_TYPES.slice(0, 2)).slice(0, BATTLE.bonusTypesToBring)).filter((b) => (S.save.bonusStock[b] || 0) > 0), S.zeroHint = null, S.prepAlert = null, go("prep"), S.antCard = antCardWanted() ? nextAntCard(S.save, i) : null;
}
function antCardWanted() {
  return ART81 && !0;
}
function antCardDone() {
  let t = S.antCard;
  t && (markAntSeen(S.save, t) && persist(), sfx("tap"), S.antCard = nextAntCard(S.save, S.levelIndex));
}
function guideWanted(levelIndex) {
  return levelIndex === 0 && !isReturningPlayer(S.save) && !!(S.save.onboard && typeof S.save.onboard == "object" && S.save.onboard.firstBattle === "pending") && !0;
}
function guideDone() {
  S.guide = null, S.save.onboard && typeof S.save.onboard == "object" && S.save.onboard.firstBattle !== "done" && (S.save.onboard.firstBattle = "done", persist());
}
function startBattle(levelIndex = S.levelIndex, deck = S.prep.deck, bonuses = S.prep.bonuses, seed = Date.now() & 16777215) {
  if (S.levelIndex = levelIndex, S.save.lastDeck = deck.slice(), S.save.lastBonuses = bonuses.slice(), persist(), S.treat = newTreatState(), S.battle = new Battle({
    levelIndex,
    deck,
    bonusTypes: bonuses,
    bonusStock: { ...S.save.bonusStock },
    cardLevels: cardLevels(S.save),
    seed,
    onBonusUsed: (type) => {
      consumeBonus(S.save, type), persist();
    }
  }), S.battleStartStock = { ...S.save.bonusStock }, capsReset(), S.queenIntro = null, S._bubbleShown = !1, S.impactT = {}, S.crumbSprites = [], S.sparkles = [], S.fx = [], S.swatQ = [], S.ui = [], S.result = null, setPaused(!1), S.speed = startSpeed(S.speed, UI.speedMaxAtStart), clock.acc = 0, S.sel = null, S.info = null, S.mode = null, S.queenDown = null, S.modeHint = !1, S.nurseTip = !1, S.battle.rescueScale = S.speed, go("battle"), S.guide = guideWanted(levelIndex) ? { step: 1 } : null, S.specialBanner = null, ART81 && S.battle.specialsOn && !S.guide) {
    let seen = S.save.seenSpecial || (S.save.seenSpecial = {}), fresh = deck.filter((id) => specialActive(id, S.battle.level, S.battle.cardLevels ? S.battle.cardLevels[id] : 1) && !seen[id]);
    fresh.length && (fresh.forEach((id) => {
      seen[id] = !0;
    }), persist(), S.specialBanner = { ids: fresh, t0: S.t, until: S.t + 2.4 });
  }
}
var CONFETTI_MAX = 36, MOMENT_MS = 2250, MOMENT_T = { drop: 0.2, shake: 0.45, burst: 0.6, countDone: 1, count: 1.5, hold: 1.9, fly: 2.25 }, RESULT_PILE = { x: 200, y: 250 }, RESULT_TREAT = { x: 200, y: 201, k: 1.1 };
function localDay() {
  let d = /* @__PURE__ */ new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function finishBattle() {
  let b = S.battle;
  guideDone();
  let out = applyBattleResult(S.save, b.levelIndex, b.result, b.stars, { kills: b.stats.kills, foodLeft: b.foodStored, perfect: b.perfect, time: b.time, day: ART81 ? localDay() : void 0 });
  {
    let rc = b.upgradeReach();
    S.save.debug = S.save.debug || { reach: [] }, S.save.debug.reach.push({ li: b.levelIndex, res: b.result, towers: rc.towers, l1: rc.l1, l2: rc.l2, l3p: rc.l3p, placed: rc.placed, upgrades: rc.upgrades, crumbsPlace: rc.crumbsPlace, crumbsUpgrade: rc.crumbsUpgrade }), S.save.debug.reach.length > 20 && S.save.debug.reach.shift();
  }
  let lossRun = noteLossRun(S.save, b.levelIndex, b.result === "win");
  b.result === "win" && b.levelIndex === 0 && out.firstClear && ART81 && armNextHint(S.save, "l1"), b.result === "lose" && noteLossForCardBlink(S.save), persist();
  let win = b.result === "win", fullFood = b.foodStored >= b.cfg.foodHP - 1e-6, queenKilled = win && Object.keys(b.stats.byType).some((t) => isQueen(t)), hold = queenKilled ? UI.queenCheerHold : 0;
  S.result = { win, stars: b.stars, out, t: 0, hold, crumbsLeft: b.crumbs, perfect: out.perfect, kills: b.stats.kills, confetti: [], fullFood, queenKilled, hint: ART81 && b.result === "lose" && lossRun >= 2 ? lossHint(b, lossRun) : null };
  {
    let sp = out.starParts || { s2: 0, s3: 0 };
    win && b.stars >= 3 && sp.s3 > 0 && (S.result.moment = { amount: sp.s3, t0: out.perfect ? UI.perfectAnimTime : 1, dur: MOMENT_MS / 1e3, sfx: 0 }), win && sp.s2 > 0 && (S.result.chip2 = sp.s2);
  }
  if (win && (b.stars >= 3 || fullFood || out.perfect)) for (let i = 0; i < CONFETTI_MAX; i++) S.result.confetti.push({ x: 200 + (Math.random() - 0.5) * 60, y: 230, vx: (Math.random() - 0.5) * 420, vy: -150 - Math.random() * 320, r: Math.random() * 6, c: ["#ff8fab", "#ffd45e", "#8fe388", "#9fd3f2", "#c9b6f2"][i % 5] });
  win && fullFood && (S.result.moment ? S.result.pendingFw = [9, 2.6] : launchFireworks(9, 2.6)), queenKilled && (launchFireworks(10, 3), S.queenDown = { t: S.t, world: worldOf(b.levelIndex) }), out.prize && out.prize.kind === "cards" && out.prize.reveal && queueReveal(out.prize.id, out.prize.level, out.prize.newCard, S.t + hold + UI.perfectAnimTime + 0.4 + (S.result.moment ? S.result.moment.dur + 0.1 : 0)), out.bossGift && out.bossGift.reveal && queueReveal(out.bossGift.id, out.bossGift.level, out.bossGift.newCard, S.t + hold + UI.perfectAnimTime + (out.prize && out.prize.reveal ? 2.4 : 0.4) + (S.result.moment ? S.result.moment.dur + 0.1 : 0)), sfx(win ? "win" : "lose"), win ? b.stars >= 3 && haptic("medium") : haptic("heavy"), win && out.perfect && ART81 && setTimeout(() => sfx("perfect"), 500);
}
function tileAt(p) {
  let x = p.x, y = p.y - MAP_Y;
  return x < 0 || y < 0 || x >= MAP_W || y >= MAP_H ? null : { c: Math.floor(x / TILE), r: Math.floor(y / TILE), x, y };
}
function dragTile(p) {
  return tileAt({ x: p.x, y: p.y - 34 });
}
function dropCard(p) {
  let b = S.battle, t = dragTile(p);
  !t || S.drag.i == null || S.paused || S.screen !== "battle" || tryPlay(S.drag.i, t.c, t.r);
}
function tryPlay(i, c, r) {
  let b = S.battle;
  if (S.paused || S.result) return !1;
  let res = b.playCard(i, c, r);
  if (res.ok)
    return S.sel = null, sfx(res.upgrade ? "upgrade" : "place"), !0;
  if (res.why === "crumbs")
    return needCrumbs(b.nextCardCost), !1;
  let msgs = { needPath: "Place this ON the trail", needSide: "Place this BESIDE the trail", needNearTrail: `${TOWERS[b.picks[i]] ? TOWERS[b.picks[i]].short : "It"} must touch the trail`, occupied: "Spot taken", max: `Already max level (${b.cfg.maxInBattleLevel})`, tile: "" };
  return msgs[res.why] && toast(msgs[res.why], "#ffd0d0"), !1;
}
function tryCollectAt(b, t) {
  if (!b.cfg.rescue.on || !b.pieces.length) return !1;
  let q = b.pieceAt(t.x, t.y);
  return !!(q && b.collectPiece(q.id));
}
function sweepPieces(b, x0, y0, x1, y1) {
  if (!(!b.cfg.rescue.on || !b.pieces.length || b.result || S.paused))
    for (let q of b.pieces.slice()) {
      let qx = q.x, qy = q.y + MAP_Y, dx = x1 - x0, dy = y1 - y0, L2 = dx * dx + dy * dy, k = L2 > 0 ? Math.max(0, Math.min(1, ((qx - x0) * dx + (qy - y0) * dy) / L2)) : 0;
      Math.hypot(qx - (x0 + dx * k), qy - (y0 + dy * k)) <= UI.rescueSweepRadius && b.collectPiece(q.id);
    }
}
function mapTap(p) {
  let b = S.battle, t = tileAt(p);
  if (!t || b.result || S.paused || tryCollectAt(b, t) && S.sel) return;
  if (S.mode) {
    modeTap(b, t);
    return;
  }
  if (S.sel && S.sel.kind === "card") {
    tryPlay(S.sel.i, t.c, t.r);
    return;
  }
  if (S.sel && S.sel.kind === "bonus") {
    b.useBonus(S.sel.type, t.x, t.y) && sfx(S.sel.type === "bomb" ? "boom" : "tap"), S.sel = null;
    return;
  }
  let tw = b.towers.find((q) => q.c === t.c && q.r === t.r);
  if (tw && S.info && S.info.tower === tw && S.info.auto) {
    S.info.auto = !1, S.info.changed = null;
    return;
  }
  S.info = tw ? { tower: tw, t: 0 } : null;
}
var W6_STORY = "Drones fly in. Bring a tower that hits flyers.", W5_STORY = "Glaze grows back: hit hard, hit fast!", TREAT_NAME = { cookie: "Cookie", cake: "Cake", pie: "Pie", sundae: "Sundae", donut: "Donut", pancake: "Pancakes" }, HINT_ANTS = /* @__PURE__ */ new Set(["armored", "big", "heavy", "queen", "queen2", "greasy", "mama", "queen3", "nurse", "queen4", "glazed", "queen5", "drone", "queen6"]);
function maybeModeHint(b, e) {
  S.modeHint || S.paused || !e.ant || !HINT_ANTS.has(e.ant) || !(e.n > 0) || b.towers.some((q) => hasTargetModes(q.type)) && (S.modeHint = !0, toast("Tip: tap a tower, then pick who it shoots", "#ffe39a"), S.toast.hint = !0);
}
var MODE_NAME = { weak: "Weakest", carrier: "Carrier", healer: "Healer", strong: "Heavy" };
function modeFeedback(tw, m) {
  sfx("tap"), tw._modeAt = S.t, addFloatText(S.fx, { key: "mode" + tw.id, x: tw.x, y: tw.y - 26, n: 1, fmt: () => MODE_NAME[m], col: m === "weak" ? "#fff" : "#ffe39a", life: 1 });
}
function setMode(tw, m) {
  tw.mode !== m && S.battle.setTargetMode(tw, m) && modeFeedback(tw, m);
}
function startMode(kind, tw) {
  let b = S.battle;
  if (!(!b || b.result || S.paused)) {
    if (kind === "move" && (S.save.diamonds || 0) < ECONOMY.diamonds.moveTower) {
      toast(`Moving costs ${ECONOMY.diamonds.moveTower} diamond (you have ${S.save.diamonds || 0})`, "#ffd0d0");
      return;
    }
    if (kind === "swap" && b.towers.length < 2) {
      toast("Place another tower first", "#ffd0d0");
      return;
    }
    S.mode = { kind, tower: tw, t: S.t }, S.info = null, S.sel = null, sfx("tap");
  }
}
function modeTap(b, t) {
  let m = S.mode, other = b.towers.find((q) => q.c === t.c && q.r === t.r) || null;
  if (other === m.tower) {
    S.mode = null;
    return;
  }
  if (m.kind === "move") {
    let r = moveTowerWithDiamond(S.save, b, m.tower, t.c, t.r);
    r.ok ? (persist(), S.mode = null, sfx("place"), addUi({ k: "priceFloat", cur: "diamond", n: r.price, x: 252, y: 58, life: 1.1, max: 1.1 })) : toast(r.why === "diamonds" ? `Moving costs ${ECONOMY.diamonds.moveTower} diamond` : other ? "Spot taken - use Swap" : "It can't stand there", "#ffd0d0");
    return;
  }
  if (!other) {
    toast("Tap another tower to swap with", "#ffd0d0");
    return;
  }
  b.swapTowers(m.tower, other) ? (S.mode = null, sfx("place")) : toast("Those two can't swap spots", "#ffd0d0");
}
function addFx(f) {
  if (ART81 && (f.k === "spark" || f.k === "star")) {
    let n = 0;
    for (let i = 0; i < S.fx.length; i++) {
      let q = S.fx[i];
      (q.k === "spark" || q.k === "star") && n++;
    }
    if (n >= 24)
      for (let i = 0; i < S.fx.length; i++) {
        let q = S.fx[i];
        if (q.k === "spark" || q.k === "star") {
          S.fx.splice(i, 1);
          break;
        }
      }
  }
  S.fx.push(f);
  let cap = S.speed >= 4 ? 220 : 300;
  if (S.fx.length > cap) {
    let n = 0, j = 0;
    for (let i = 0; i < S.fx.length; i++) {
      let q = S.fx[i];
      if (q.k === "spark" && n < 60) {
        n++;
        continue;
      }
      S.fx[j++] = q;
    }
    S.fx.length = j, S.fx.length > cap && S.fx.splice(0, 60);
  }
}
function addUi(f) {
  S.ui.push(f), S.ui.length > 60 && S.ui.splice(0, 20);
}
var fmtFood = (n) => Math.abs(n - Math.round(n)) < 0.05 ? String(Math.round(n)) : n.toFixed(1), SWAT_HIT = 0.17;
function swatHitTime(b) {
  return b.time - (0.5 - b.swatFx) + SWAT_HIT;
}
var CHIP = { x: 341, y: 33 };
function crumbUp(e) {
  if (!ART81 || !(e.crumbs > 0) || S.screen !== "battle") return;
  if (reducedMotion()) {
    S.crumbBump = 0.12, sfx("coinTick");
    return;
  }
  let fast = S.speed >= 4, list = S.crumbSprites || (S.crumbSprites = []), life = fast ? 0.35 : 0.55, last2 = list[list.length - 1];
  if (last2 && S.t - last2.t0 < 0.1) {
    last2.sc = 1.3;
    return;
  }
  if (list.length >= (fast ? 6 : 12)) {
    S.crumbBump = Math.max(S.crumbBump || 0, 0.12);
    return;
  }
  list.push({ x0: e.x, y0: e.y + MAP_Y - 10, t0: S.t, life, sc: 1 });
}
function drawCrumbUp() {
  let list = S.crumbSprites;
  if (!list || !list.length) return;
  let fast = S.speed >= 4;
  for (let i = list.length - 1; i >= 0; i--) {
    let q = list[i], p = (S.t - q.t0) / q.life;
    if (p >= 1 || p < 0) {
      list.splice(i, 1), S.crumbBump = 0.12, S.t - (S.chipSparkT || -9) > 0.15 && (S.chipSparkT = S.t), sfx("coinTick");
      continue;
    }
    let u = p * p, cx = q.x0 + (CHIP.x - q.x0) * 0.25, cy = Math.min(q.y0, 70) - 46, v = 1 - u, pt = (uu) => {
      let w = 1 - uu;
      return [w * w * q.x0 + 2 * w * uu * cx + uu * uu * CHIP.x, w * w * q.y0 + 2 * w * uu * cy + uu * uu * CHIP.y];
    };
    if (!fast) for (let j = 1; j <= 2; j++) {
      let [tx, ty] = pt(Math.max(0, u - j * 0.1));
      ctx.save(), ctx.globalAlpha = 0.7 - j * 0.2, sparkleAt(ctx, tx, ty, 3 - j * 0.6, j === 1 ? "#fff" : "#ffe27a", 0.4), ctx.restore();
    }
    let [x, y] = pt(u);
    ctx.save(), ctx.globalAlpha = Math.min(1, 1.4 - p * 0.4), crumbIcon(ctx, x, y, 1.2 * (1 - 0.2 * p) * q.sc), ctx.restore();
  }
}
function towerImpact(tp, x, y, shape, opt = {}) {
  if (!ART81) return;
  let fast = S.speed >= 4, tk = S.impactT || (S.impactT = {});
  if (fast && S.t - (tk[tp] || -9) < 0.12) return;
  tk[tp] = S.t;
  let col = TOWERS[tp] ? TOWERS[tp].color : "#ffffff";
  if (reducedMotion()) {
    addFx({ k: "impact", shape: "tint", col, x, y, life: 0.034, max: 0.034 });
    return;
  }
  addFx({ k: "impact", shape, col, x, y, life: opt.life || 0.18, max: opt.life || 0.18, fast });
}
var SHARD_COL = { armored: "#b8c3d4", gasmask: "#a9c9a0", glazed: "#ffa6dc", small_gasmask: "#a9c9a0", small_armed: "#b8c3d4", sprinter: "#b8c3d4", queen5: "#ffa6dc", drone: "#f3c98b", queen6: "#e8a33d" };
function deathExtras(e) {
  if (!ART81 || reducedMotion()) return;
  let D0 = ANTS[e.ant];
  if (e.ant === "queen5") {
    let fast2 = S.speed >= 4, n = fast2 ? 12 : 24, cols = ["#ffe27a", "#8fd0f7", "#ffffff", "#a8e6a1", "#ff6f91", "#f7b6c8"];
    addFx({ k: "icing", x: e.x, y: e.y - 4, life: 0.7, max: 0.7 });
    for (let i = 0; i < 3; i++) addFx({ k: "puff", x: e.x + (i - 1) * 14, y: e.y - 8, vx: (i - 1) * 26, vy: -16, r: 12 + i * 3, life: 0.6, max: 0.6, col: "#f7b6c8" });
    for (let i = 0; i < n; i++) {
      let a = -Math.PI * (0.1 + 0.8 * Math.random()), v = 70 + Math.random() * 110;
      addFx({ k: "sprk", x: e.x, y: e.y - 20, vx: Math.cos(a) * v, vy: Math.sin(a) * v, rot: Math.random() * 6, col: cols[i % cols.length], life: 0.9, max: 0.9 });
    }
    addFx({ k: "spark", big: !0, x: e.x, y: e.y - 34, life: 0.7, max: 0.7, col: "#f7b6c8" });
    return;
  }
  if (D0 && D0.boss) {
    for (let i = 0; i < 2; i++) addFx({ k: "puff", x: e.x + (i - 0.5) * 16, y: e.y - 6, vx: (i - 0.5) * 30, vy: -14, r: 15 + i * 6, life: 0.7, max: 0.7 });
    addFx({ k: "spark", big: !0, x: e.x, y: e.y - 34, life: 0.7, max: 0.7, col: "#ffd23f" });
    return;
  }
  let D = D0;
  if (!D) return;
  let fast = S.speed >= 4, y = e.y - 4;
  if (!D.flying) {
    if (D.heal) {
      addFx({ k: "healCross", x: e.x, y: e.y - 10, life: 0.5, max: 0.5 });
      return;
    }
    if (D.sizeClass === "large") {
      addFx({ k: "puff", x: e.x, y, vx: 0, vy: -10, r: 4.2 * 1.4 + 3, life: 0.5, max: 0.5 });
      for (let i = 0; i < (fast ? 2 : 4); i++) addFx({ k: "puff", x: e.x + (i - 1.5) * 9, y: e.y + 2, vx: (i - 1.5) * 24, vy: -6, r: 3, life: 0.45, max: 0.45 });
      return;
    }
    if (D.shield || SHARD_COL[e.ant] || D.armor && D.sizeClass !== "small") {
      for (let i = 0; i < (fast ? 2 : 3); i++) addFx({ k: "shard", col: SHARD_COL[e.ant] || "#b8c3d4", x: e.x, y: y - 2, vx: (i - 1) * 55 + (Math.random() - 0.5) * 20, vy: -45 - Math.random() * 40, life: 0.5, max: 0.5 });
      return;
    }
    addFx({ k: "spark", x: e.x, y: y - 4, life: 0.3, max: 0.3, col: "#fff7a8" });
  }
}
function killFx(e) {
  if (crumbUp(e), deathExtras(e), ANTS[e.ant] && ANTS[e.ant].boss && haptic("medium"), e.src === "tractor") {
    e.crumbs > 0 && addFloatText(S.fx, { k: "crumbTxt", key: "crumb", x: e.x, y: e.y - 14, n: e.crumbs, fmt: (n) => n, life: 0.9 });
    return;
  }
  let fast = S.speed >= 4;
  for (let i = 0; i < (fast ? 1 : 4); i++) addFx({ k: "crumbBit", x: e.x, y: e.y - 6, vx: (Math.random() - 0.5) * 90, vy: -40 - Math.random() * 60, life: 0.6, max: 0.6 });
  addFx({ k: "ko", x: e.x, y: e.y, ant: e.ant, fall: !!(ART81 && ANTS[e.ant] && ANTS[e.ant].flying), life: 0.32, max: 0.32, face: Math.random() < 0.5 ? 1 : -1 });
  for (let i = 0; i < (fast ? 2 : 5); i++) addFx({ k: "puff", x: e.x + (Math.random() - 0.5) * 10, y: e.y + (Math.random() - 0.5) * 6, vx: (Math.random() - 0.5) * 40, vy: -Math.random() * 30, r: 4 + Math.random() * 4, life: 0.5, max: 0.5 });
  e.crumbs > 0 && addFloatText(S.fx, { k: "crumbTxt", key: "crumb", x: e.x, y: e.y - 14, n: e.crumbs, fmt: (n) => n, life: 0.9 }), sfx("pop");
}
function swatHitFx(e) {
  addFx({ k: "spark", x: e.x, y: e.y - 4, life: 0.2, max: 0.2, col: "#fff7b0" }), addFx({ k: "ring2", x: e.x, y: e.y - 2, life: 0.3, max: 0.3 }), sfx("swat");
}
function flushSwat(force) {
  if (!S.swatQ.length) return;
  let b = S.battle, keep = [];
  for (let q of S.swatQ) {
    if (!(force || b.time >= q.at)) {
      keep.push(q);
      continue;
    }
    q.kill && killFx(q.kill), q.swat && swatHitFx(q.swat);
  }
  S.swatQ = keep;
}
var spCueN = 0;
function spCue(e) {
  if (spCueN >= 6) return;
  let alive = 0;
  for (let i = 0; i < S.fx.length; i++) (S.fx[i].k === "spArc" || S.fx[i].k === "spCrack" || S.fx[i].k === "spGold") && alive++;
  if (!(alive >= 12)) {
    if (spCueN++, reducedMotion()) {
      addFx({ k: "impact", shape: "tint", col: e.sp === "crescendo" ? "#ffd24a" : "#fff2b8", x: e.x, y: e.y, life: 0.05, max: 0.05 });
      return;
    }
    switch (e.sp) {
      case "ricochet":
        addFx({ k: "spArc", x: e.x, y: e.y, tx: e.tx, ty: e.ty, life: 0.09, max: 0.09 });
        break;
      case "burnthrough":
        addFx({ k: "spCrack", x: e.x, y: e.y, life: 0.12, max: 0.12 });
        break;
      case "crescendo":
        addFx({ k: "spGold", x: e.x, y: e.y, r: 52, life: 0.4, max: 0.4 });
        break;
      case "pounce":
        addFx({ k: "txt", s: "!", x: e.x, y: e.y - 6, size: 14, col: "#fff2b8", life: 0.5, max: 0.5 }), addFx({ k: "impact", shape: "spoke3", col: "#fff4c8", x: e.x, y: e.y, life: 0.2, max: 0.2 });
        break;
    }
  }
}
function consumeEvents() {
  let b = S.battle, ev = b.events;
  b.events = [], spCueN = 0;
  for (let e of ev)
    switch (e.type) {
      case "special":
        ART81 && spCue(e);
        break;
      // v0.8.3 M7h: field-layer cues only (no background layer, no sim event added)
      case "kill":
        if (e.src === "swatter" && !reducedMotion() && b.swatFx > 0) {
          S.swatQ.push({ at: swatHitTime(b), kill: e, ghost: e.ref, x: e.x, y: e.y });
          break;
        }
        killFx(e);
        break;
      case "beam":
        addFx({ k: "beam", ...e, life: 0.09, max: 0.09 }), towerImpact("laser", e.tx, e.ty - 4, "sparkle", { life: 0.14 }), sfx("laser");
        break;
      case "zap":
        addFx({ k: "zap", ...e, life: 0.14, max: 0.14 }), towerImpact("zapper", e.tx, e.ty - 6, "sparks2", { life: 0.16 }), sfx("zap");
        break;
      case "roast":
        towerImpact("lava", e.x, e.y - 6, "bubbles", { life: 0.3 });
        for (let i = 0; i < 5; i++) addFx({ k: "ember", x: e.x + (Math.random() - 0.5) * 14, y: e.y - 4, vx: (Math.random() - 0.5) * 20, vy: -30 - Math.random() * 30, life: 0.7, max: 0.7 });
        break;
      // v0.4 item 7
      case "tongue":
        addFx({ k: "tongue", ...e, life: 0.25, max: 0.25 }), towerImpact("lizard", e.tx, e.ty - 6, "spoke3", { life: 0.16 });
        break;
      case "scoop": {
        let side = e.dx ? [0, 1] : [1, 0];
        e.ants.forEach((a, k) => {
          let sgn = k % 2 ? -1 : 1, far = 46 + Math.random() * 26, tx = a.x - e.dx * far * 0.7 + side[0] * sgn * (18 + Math.random() * 20), ty = a.y - e.dy * far * 0.7 + side[1] * sgn * (18 + Math.random() * 20);
          addFx({ k: "thrown", ant: a.type, x0: a.x, y0: a.y, x1: tx, y1: ty, h: 46 + Math.random() * 20, spin: (Math.random() < 0.5 ? -1 : 1) * (7 + Math.random() * 5), life: 0.95, max: 0.95 });
        });
        for (let i = 0; i < 6; i++) addFx({ k: "puff", x: e.tx + (Math.random() - 0.5) * 22, y: e.ty + 6 + (Math.random() - 0.5) * 8, vx: (Math.random() - 0.5) * 50, vy: -Math.random() * 25, r: 4 + Math.random() * 4, life: 0.5, max: 0.5 });
        addFloatText(S.fx, { key: "scoop", x: e.tx, y: e.ty - 24, n: e.ants.length, fmt: (n) => n > 1 ? `Scoop x${n}!` : "Scoop!", col: "#ffe39a", life: 0.9 }), sfx("gust");
        break;
      }
      case "pulse":
        addFx({ k: "ring", ...e, life: 0.45, max: 0.45, col: "#a58be0" }), sfx("pulse");
        break;
      case "gust":
        for (let i = 0; i < 6; i++) addFx({ k: "wisp", x: e.x, y: e.y - 16, a: e.ang + (Math.random() - 0.5) * 0.8, d: 10 + Math.random() * 10, life: 0.5, max: 0.5 });
        sfx("gust");
        break;
      case "spray":
        addFx({ k: "mist", ...e, life: 0.3, max: 0.3 }), towerImpact("spray", e.tx, e.ty - 4, "ring", { life: 0.18 });
        break;
      case "swat": {
        reducedMotion() ? swatHitFx(e) : S.swatQ.push({ at: swatHitTime(b), swat: e });
        break;
      }
      case "hit":
        ART81 && e.src === "slingshot" ? towerImpact("slingshot", e.x, e.y - 6, "spoke3", { life: 0.15 }) : addFx({ k: "spark", x: e.x, y: e.y - 6, life: 0.15, max: 0.15 });
        break;
      case "gateZap":
        addFx({ k: "spark", x: e.x, y: e.y - 14, life: 0.18, max: 0.18, col: "#fff27a" });
        break;
      case "pieceDrop": {
        !S.rescueHintSeen && !S.paused && (S.rescueHintSeen = !0, toast("Tap the crumb to bring it home!", "#ffe39a"), S.toast.hint = !0), sfx("tap");
        break;
      }
      case "pieceCollect": {
        let cp = b.path.pts[b.path.pts.length - 1];
        addFx({ k: "crumbFly", x0: e.x, y0: e.y, x1: cp.x, y1: cp.y, life: 0.35, max: 0.35 }), addFloatText(S.fx, { key: "rescue" + e.id, x: e.x, y: e.y - 20, n: e.n, fmt: (n) => `+${fmtFood(n)}`, col: "#4fc25a", life: 0.9 });
        for (let i = 0; i < 4; i++) addFx({ k: "star", ci: i, x: e.x, y: e.y, vx: (Math.random() - 0.5) * 120, vy: -30 - Math.random() * 70, life: 0.45, max: 0.45 });
        sfx("return");
        break;
      }
      case "pieceExpire":
        for (let i = 0; i < 3; i++) addFx({ k: "puff", x: e.x + (Math.random() - 0.5) * 8, y: e.y, vx: (Math.random() - 0.5) * 30, vy: -Math.random() * 20, r: 3 + Math.random() * 3, life: 0.4, max: 0.4 });
        break;
      case "steal":
        maybeModeHint(b, e), S.cookieOuch = S.t + UI.ouchTime, onBite(S.treat, S.t, e.n || 1), e.n && addFloatText(S.fx, { key: "steal", x: e.x, y: e.y - 20, n: e.n, fmt: (n) => `-${fmtFood(n)}`, col: "#ff7a7a", life: 1 }), sfx("steal");
        break;
      case "foodReturn":
        addFloatText(S.fx, { key: "food", x: e.x, y: e.y - 18, n: e.n, fmt: (n) => `+${fmtFood(n)} food back!`, col: "#8fe388", life: 1.1 }), sfx("return");
        break;
      case "place":
      case "upgrade": {
        if (ART81 && e.type === "place" && !reducedMotion() && addFx({ k: "ring", x: e.x, y: e.y + 14, r: 28, col: TOWER_PAD[e.card] || "#ffd45e", life: 0.3, max: 0.3 }), e.type === "place" && !reducedMotion()) for (let i = 0; i < (S.speed >= 4 ? 2 : 4); i++) addFx({ k: "dust", x: e.x + (Math.random() - 0.5) * 26, y: e.y + 9 + (Math.random() - 0.5) * 6, life: 0.45, max: 0.45 });
        let delay = e.pick != null ? 0.28 : 0;
        if (e.pick != null) {
          let sx = 12 + e.pick * 94 + 44, sy = TRAY_Y + 6 + 47;
          addUi({ k: "cardFly", card: e.card, x0: sx, y0: sy, x1: e.x, y1: e.y + MAP_Y, life: delay, max: delay }), S.slotFlip[e.pick] = 0.3;
        }
        e.cost > 0 && addUi({ k: "costFly", n: e.cost, x0: 340, y0: 34, x1: 300, y1: 96, life: 1, max: 1 }), S.crumbPulse = 0.35;
        {
          let nS = ART81 ? S.speed >= 4 ? 5 : 10 : 14;
          for (let i = 0; i < nS; i++) {
            let a = i / nS * Math.PI * 2;
            addFx({ k: "star", ci: i, x: e.x, y: e.y, vx: Math.cos(a) * 75, vy: Math.sin(a) * 75 - 25, life: 0.7 + delay, max: 0.7, wait: delay });
          }
        }
        if (addFx({ k: "pop", x: e.x, y: e.y, life: 0.35 + delay, max: 0.35, wait: delay }), addFx({ k: "ring2", x: e.x, y: e.y, life: 0.5 + delay, max: 0.5, wait: delay }), e.type === "upgrade") {
          if (ART81 && !reducedMotion()) {
            let ut = b.towers.find((q) => q.id === e.id);
            ut && (ut._upAt = S.t + delay), addFx({ k: "ring", x: e.x, y: e.y + 14, r: 30, col: TOWER_PAD[ut ? ut.type : "slingshot"] || "#ffd45e", life: 0.4 + delay + 0.22, max: 0.4, wait: delay + 0.22 });
          }
          addFx({ k: "pillar", x: e.x, y: e.y, life: 0.9 + delay, max: 0.9, wait: delay }), addFx({ k: "txt", x: e.x, y: e.y - 34, s: `Level ${e.lvl}!${dmgGainText(e.card, e.lvl, S.battle.cardLevels[e.card] || 1) ? "  " + dmgGainText(e.card, e.lvl, S.battle.cardLevels[e.card] || 1) : ""}`, col: "#ffe36e", life: 1.4 + delay, max: 1.4, wait: delay, size: 17 }), (e.diff || []).forEach((d, k) => addFx({ k: "txt", x: e.x, y: e.y - 52 - k * 16, s: `${d.label} ${formatStat(e.card, d.key, d.from)} \u2192 ${formatStat(e.card, d.key, d.to)}`, col: "#a8ffb0", life: 2 + delay, max: 2, wait: delay, size: 12 }));
          let tw = S.battle.towers.find((q) => q.id === e.id);
          if (tw && !S.autoBot) {
            let mine = !!(S.info && S.info.tower === tw && !S.info.auto);
            S.info = { tower: tw, t: 0, changed: e.diff, until: S.t + UI.upgradeInfoTime, auto: !mine };
          }
          sfx("upgrade");
        } else if (addFloatText(S.fx, { key: "placed", x: e.x, y: e.y - 34, n: 1, fmt: () => "Placed!", col: "#fff", life: 0.9 }), !reducedMotion() && S.speed < 4) for (let i = 0; i < 3; i++) addFx({ k: "puff", x: e.x + (i - 1) * 12, y: e.y + 12, vx: (i - 1) * 26, vy: -8 - Math.random() * 8, r: 3 + Math.random() * 2, life: 0.35 + delay, max: 0.35, wait: delay });
        break;
      }
      case "stick":
        towerImpact("glue", e.x, e.y + 4, "splat", { life: 0.25 }), addFloatText(S.fx, { key: "stick", x: e.x, y: e.y - 20, n: 1, fmt: () => "stuck!", col: "#fff3b0", life: 0.7 });
        break;
      case "charm":
        e.tx !== void 0 && towerImpact("pheromone", e.tx, e.ty - 22, "heart", { life: 0.5 });
        for (let i = 0; i < 2; i++) addFx({ k: "heart", x: e.x + (i - 0.5) * 8, y: e.y - 18, life: 0.9, max: 0.9 });
        break;
      case "squash":
        addFx({ k: "spark", x: e.x, y: e.y - 4, life: 0.2, max: 0.2, col: "#bfe6ff" });
        break;
      case "marbleBreak":
        for (let i = 0; i < 7; i++) addFx({ k: "shard", x: e.x, y: e.y - 6, vx: (Math.random() - 0.5) * 110, vy: -30 - Math.random() * 70, life: 0.55, max: 0.55 });
        break;
      // v0.5 item 2: breaks at the wall/turn
      case "move":
        addFx({ k: "pop", x: e.x, y: e.y, life: 0.35, max: 0.35 }), addFx({ k: "ring2", x: e.x, y: e.y, life: 0.5, max: 0.5 }), addFloatText(S.fx, { key: "placed", x: e.x, y: e.y - 34, n: 1, fmt: () => "Moved!", col: "#fff", life: 0.9 });
        break;
      case "swap":
        for (let [x, y] of [[e.ax, e.ay], [e.bx, e.by]])
          addFx({ k: "pop", x, y, life: 0.35, max: 0.35 }), addFx({ k: "ring2", x, y, life: 0.5, max: 0.5 });
        addFloatText(S.fx, { key: "placed", x: e.ax, y: e.ay - 34, n: 1, fmt: () => "Swapped!", col: "#fff", life: 0.9 });
        break;
      case "roll":
        addFx({ k: "pop", x: e.x, y: e.y - 12, life: 0.2, max: 0.2 }), sfx("gust");
        break;
      case "bomb":
        addFx({ k: "boom", x: e.x, y: e.y, r: e.r, life: 0.7, max: 0.7 }), sfx("boom");
        break;
      case "freeze":
        addFx({ k: "flash", col: "rgba(190,235,255,0.7)", life: 0.4, max: 0.4 }), sfx("freeze");
        break;
      case "plane":
        sfx("plane");
        break;
      case "wave": {
        let lastW = e.n >= b.totalWaves, queen = lastW && isBossLevel(b.levelIndex);
        addFx(ART81 ? { k: "banner", pill: !0, last: lastW, s: queen ? "Queen!" : lastW ? `Final wave ${e.n}/${b.totalWaves}` : `Wave ${e.n}/${b.totalWaves}`, life: 1.08, max: 1.08 } : { k: "banner", s: `Wave ${e.n}`, life: 1.4, max: 1.4 }), sfx("wave"), lastW && ART81 && setTimeout(() => sfx("wave"), 380), ART81 && b.levelIndex >= 50 && b.levelIndex <= 59 && e.n === 2 && W6_TIPS[b.levelIndex] && markAntSeen(S.save, "tip:w6-" + (b.levelIndex + 1)) && (persist(), toast(W6_TIPS[b.levelIndex], "#ffe39a"), S.toast.hint = !0), ART81 && b.levelIndex === 41 && e.n === 2 && markAntSeen(S.save, "tip:glazed42") && (persist(), toast(L42_TIP, "#ffe39a"), S.toast.hint = !0), b.levelIndex === 31 && e.n === 2 && !S.nurseTip && (S.nurseTip = !0, toast("Nurse ants heal their friends. Pop them first!", "#ffe39a"), S.toast.hint = !0);
        break;
      }
      case "shieldBreak": {
        let rm = reducedMotion(), fast = S.speed >= 4;
        if (rm) addFx({ k: "shieldPop", x: e.x, y: e.y - 8, life: 0.3, max: 0.3 });
        else for (let i = 0; i < (fast ? 3 : 6); i++) {
          let an = -Math.PI / 2 + (i - 2.5) * 0.7 + i % 3 * 0.1;
          addFx(i < 3 ? { k: "iceShard", x: e.x, y: e.y - 10, vx: Math.cos(an) * (60 + 20 * i), vy: Math.sin(an) * (70 + 15 * i), rot: i * 2.1, life: 0.5, max: 0.5 } : { k: "puff", x: e.x + (i - 4) * 6, y: e.y - 14, vx: (i - 4) * 18, vy: -22, r: 1.6, life: 0.3, max: 0.3 });
        }
        S.t - (S.lastShieldSfx || -9) > 0.08 && (S.lastShieldSfx = S.t, sfx("shield"));
        break;
      }
      case "shieldFull": {
        let o = b.ants.find((q) => q.id === e.id);
        o && (o._shieldFlash = S.t + 0.25), S.t - (S.lastShieldUpSfx || -9) > 0.25 && (S.lastShieldUpSfx = S.t, sfx("shieldUp"));
        break;
      }
      case "heal": {
        let fast = S.speed >= 4, rm = reducedMotion();
        addFx({ k: "healRing", x: e.x, y: e.y, r: e.r, life: rm ? 0.35 : 0.5, max: rm ? 0.35 : 0.5 });
        let shown = 0;
        for (let id of e.ids || []) {
          let o = b.ants.find((q) => q.id === id);
          o && (o._healFlash = S.t + 0.28, shown < 6 && !(fast && shown >= 2) && (shown++, addFx({ k: "healPlus", x: o.x + (shown % 2 ? -5 : 5), y: o.y - 22 * (o.size || 1), life: rm ? 0.6 : 0.8, max: rm ? 0.6 : 0.8 })));
        }
        sfx("heal");
        break;
      }
      case "queenCall":
        addFloatText(S.fx, { key: "queen", x: e.x, y: e.y - 40, n: 1, fmt: () => e.calls === "flyer" ? "Wings, go!" : e.calls === "greasy" ? "Butter up!" : e.calls === "nurse" ? "Nurses, go!" : "Scouts, go!", col: "#ffb3e0", life: 1 });
        break;
      case "split": {
        let fast = S.speed >= 4;
        for (let k of e.kids) for (let i = 0; i < (fast ? 1 : 3); i++) addFx({ k: "puff", x: k.x + (Math.random() - 0.5) * 8, y: k.y + (Math.random() - 0.5) * 5, vx: (Math.random() - 0.5) * 50, vy: -Math.random() * 34, r: 3 + Math.random() * 3, life: 0.45, max: 0.45 });
        addFloatText(S.fx, { key: "split", x: e.x, y: e.y - 26, n: 1, fmt: () => "Babies!", col: "#ffd0e0", life: 0.9 });
        break;
      }
      case "pickup": {
        let rm = reducedMotion(), fast = S.speed >= 4, near = null, nd = 99;
        for (let q of b.ants) {
          let d = Math.abs(q.x - e.x) + Math.abs(q.y - e.y);
          d < nd && (nd = d, near = q);
        }
        near && nd < 6 && !rm && (near._hopT = S.t, ART81 && (near._grabT = S.t, S._bubbleShown || (S._bubbleShown = !0, near._bubbleUntil = S.t + (e.t || 1))));
        for (let i = 0; i < (rm || fast ? 1 : 3); i++) addFx({ k: "puff", x: e.x + (Math.random() - 0.5) * 8, y: e.y - 8 - Math.random() * 4, vx: rm ? 0 : (Math.random() - 0.5) * 36, vy: rm ? 0 : -14 - Math.random() * 18, r: 2.2, life: 0.4, max: 0.4 });
        !fast && S.t - (S._pickTick || -9) > 0.14 && (S._pickTick = S.t, sfx("pop"));
        break;
      }
      case "immune":
        addFloatText(S.fx, { key: "immune", x: e.x, y: e.y - 22, n: 1, fmt: () => "immune!", col: "#c9f5c0", life: 0.8 });
        break;
    }
}
var lastT = performance.now(), insetClock = 0, clock = newClock();
function battleStep(dt) {
  let b = S.battle;
  return b.rescueScale = S.speed, b.update(dt), S.autoBot && smartBotStep(b), (S.speed > 1 || b.result) && (consumeEvents(), flushSwat(!!b.result)), !!b.result;
}
function battleFrame(dt) {
  if (S.guide) {
    consumeEvents();
    return;
  }
  advanceFrame(clock, dt, S.speed, battleStep, { now: () => performance.now() }), consumeEvents(), flushSwat(!!S.battle.result), S.battle.result && finishBattle();
}
function frame(now2) {
  let dt = Math.min(0.1, (now2 - lastT) / 1e3);
  lastT = now2, S.t += dt, heartbeat(!1), insetClock += dt, insetClock >= 0.5 && (insetClock = 0, refreshInset()), setAudioSpeed(S.screen === "battle" ? S.speed : 1), S.screen === "battle" && S.battle && !S.paused && !S.result && !S.dialog && battleFrame(dt), render(dt), capsTick(dt, now2), down && down.b && down.b.id === "verLong" && !down.moved && performance.now() - (S.capsHold || 0) > 700 && (S.capsOn = !S.capsOn, down.b = null, sfx("tap")), requestAnimationFrame(frame);
}
var CAPS = { fx: 0, ui: 0, crumbSprites: 0, sparkles: 0, confetti: 0, frameMax: 0 }, CAPW = { n: 0, sum: 0, max: 0, at: 0, avg: 0, wmax: 0 };
function capsReset() {
  for (let k of Object.keys(CAPS)) CAPS[k] = 0;
  CAPW.n = 0, CAPW.sum = 0, CAPW.max = 0, CAPW.at = 0, CAPW.avg = 0, CAPW.wmax = 0;
}
function capsNow() {
  return { fx: S.fx.length, ui: S.ui.length, crumbSprites: (S.crumbSprites || []).length, sparkles: S.fx.reduce((n, q) => n + (q.k === "spark" || q.k === "star" ? 1 : 0), 0), confetti: S.result ? S.result.confetti.length : 0 };
}
function capsTick(dt, now2) {
  let c = capsNow();
  for (let k of Object.keys(c)) c[k] > CAPS[k] && (CAPS[k] = c[k]);
  let ms = dt * 1e3;
  CAPW.n++, CAPW.sum += ms, ms > CAPW.max && (CAPW.max = ms), ms > CAPS.frameMax && (CAPS.frameMax = ms), now2 - CAPW.at >= 5e3 && (CAPW.avg = CAPW.sum / Math.max(1, CAPW.n), CAPW.wmax = CAPW.max, CAPW.n = 0, CAPW.sum = 0, CAPW.max = 0, CAPW.at = now2);
}
function drawCapsOverlay() {
  if (!S.capsOn) return;
  let c = capsNow();
  ctx.save(), ctx.globalAlpha = 0.88, rr(ctx, 6, 64, 206, S.battle ? 134 : 98, 8), ctx.fillStyle = "#2e2230", ctx.fill(), ctx.globalAlpha = 1;
  let L = [`fx ${c.fx} (max ${CAPS.fx})   ui ${c.ui} (${CAPS.ui})`, `crumbs ${c.crumbSprites} (${CAPS.crumbSprites})   sparks ${c.sparkles} (${CAPS.sparkles})`, `confetti ${c.confetti} (${CAPS.confetti})`, `frame avg ${CAPW.avg.toFixed(1)} ms  max ${CAPW.wmax.toFixed(1)}`, `run max ${CAPS.frameMax.toFixed(1)} ms   ants ${S.battle ? S.battle.ants.length : 0}`];
  if (S.battle) {
    let rc = S.battle.upgradeReach();
    L.push(`towers L1/L2/L3+ ${rc.l1}/${rc.l2}/${rc.l3p}  upg ${rc.upgrades}`, `crumbs place ${rc.crumbsPlace}  upgrade ${rc.crumbsUpgrade}`);
  }
  L.forEach((s, i) => text(ctx, s, 14, 78 + i * 17, 12, "#ffe9c9", "left", null)), ctx.restore();
}
function render(dt) {
  let rt0 = performance.now();
  if (MOTION.reduced = reducedMotion(), prevButtons = buttons, buttons = [], ctx.setTransform(1, 0, 0, 1, 0, 0), ctx.fillStyle = BG, ctx.fillRect(0, 0, canvas.width, canvas.height), applyLayout(), ctx.setTransform(dpr * scale, 0, 0, dpr * scale, offX * dpr, offY * dpr), S.skinSrc !== S.save.skins && (S.skinSrc = S.save.skins, setSkinPads(skinPads(S.save))), drawBackdrop(), renderTabBar(dt), S.screen === "map" ? renderMapScreen() : S.screen === "prep" ? renderPrep() : S.screen === "battle" ? renderBattle(dt) : S.screen === "cards" ? renderCards() : S.screen === "card" ? renderCardView() : S.screen === "shop" ? renderShop() : S.screen === "cabinet" ? renderCabinet() : S.screen === "antbook" && renderAntBook(), renderFireworks(dt), S.reveal.length && S.reveal[0].at <= S.t && renderReveal(dt), S.pack && renderPack(dt), S.toast) {
    if (S.toast.t -= dt, ctx.save(), ctx.globalAlpha = Math.min(1, S.toast.t * 5), S.toast.small) {
      ctx.font = `bold 12px ${FONT}`;
      let w = Math.min(300, ctx.measureText(S.toast.msg).width + 26), y = TRAY_Y - 30;
      S.layoutToast = { x: 200 - w / 2, y, w, h: 24 }, rr(ctx, 200 - w / 2, y, w, 24, 12), ctx.fillStyle = "rgba(74,52,66,0.88)", ctx.fill(), text(ctx, S.toast.msg, 200, y + 12.5, 12, S.toast.col, "center", null);
    } else {
      ctx.font = `bold 14px ${FONT}`;
      let w = Math.min(340, ctx.measureText(S.toast.msg).width + 36);
      S.layoutToast = { x: 200 - w / 2, y: 600, w, h: 34 }, panel(200 - w / 2, 600, w, 34, "#5a4058", 17), text(ctx, S.toast.msg, 200, 617, 14, S.toast.col, "center", null);
    }
    ctx.restore(), S.toast.t <= 0 && (S.toast = null, S.layoutToast = null);
  }
  {
    let rc = performance.now() - rt0;
    S.renderMs = S.renderMs ? S.renderMs * 0.9 + rc * 0.1 : rc;
  }
  drawCapsOverlay();
}
var barK = 0, TAB_COL = ["#d9cfe0", "#b5d8ff", "#ffd27a"], TAB_NAME = ["Map", "Cards", "Shop"], TAB_MUTED = "#7a5a6a", BAR_BG = "#fff6ee";
function activeTab() {
  return S.screen === "map" ? 0 : S.screen === "shop" || S.screen === "cabinet" ? 2 : 1;
}
function barWanted() {
  return isMeta() && !S.antCard && !S.starCard && !S.cal && !S.settings && !S.pack && !S.mergeAnim && !(S.reveal.length && S.reveal[0].at <= S.t) && !S.dialog;
}
function tabRect(i) {
  let tw = cw / 3, top = ch - BAR_H - insetB;
  return { x: (i * tw + 6 - offX) / scale, y: (top + 6 - offY) / scale, w: (tw - 12) / scale, h: 44 / scale, r: 14 / scale };
}
function tabTap(i) {
  if (i === activeTab()) {
    S.screen === "map" ? S.mapScroll = autoMapScroll() : S.screen === "card" ? (S.screen = "cards", S.mergeAnim = null) : S.screen === "cabinet" ? S.screen = "shop" : S.screen === "antbook" && (S.screen = "cards", S.antBookSel = null);
    return;
  }
  go(["map", "cards", "shop"][i]);
}
function drawTabIcon(kind, x, y, active) {
  let ink = active ? INK : TAB_MUTED;
  ctx.save(), ctx.translate(x, y), ctx.lineJoin = "round", ctx.lineCap = "round", ctx.lineWidth = active ? 2.5 : 2, ctx.strokeStyle = ink, kind === 0 ? (ctx.beginPath(), ctx.moveTo(-10, 9), ctx.bezierCurveTo(-10, 2, 2, 11, 3, 4), ctx.lineWidth = active ? 3.2 : 2.6, ctx.setLineDash([0.1, 5]), ctx.stroke(), ctx.setLineDash([]), ctx.lineWidth = active ? 2.5 : 2, ctx.beginPath(), ctx.arc(4, -4, 5.2, 0, 7), ctx.fillStyle = active ? "#b9e89a" : "#e6e0e4", ctx.fill(), ctx.stroke(), ctx.beginPath(), ctx.arc(4, -4, 1.6, 0, 7), ctx.fillStyle = ink, ctx.fill(), ctx.beginPath(), ctx.moveTo(1.4, 0.2), ctx.lineTo(4, 5.4), ctx.lineTo(6.6, 0.2), ctx.fillStyle = active ? "#b9e89a" : "#e6e0e4", ctx.fill(), ctx.stroke(), ctx.beginPath(), ctx.arc(4, -4, 5.2, 0.9, 2.2), ctx.stroke()) : kind === 1 ? (ctx.save(), ctx.translate(-3.5, -0.5), ctx.rotate(-0.14), rr(ctx, -6.5, -9, 13, 18, 3), ctx.fillStyle = active ? "#b5d8ff" : "#e6e0e4", ctx.fill(), ctx.stroke(), ctx.restore(), ctx.save(), ctx.translate(3.5, 1), ctx.rotate(0.14), rr(ctx, -6.5, -9, 13, 18, 3), ctx.fillStyle = active ? "#ffffff" : "#f6f2f4", ctx.fill(), ctx.stroke(), ctx.beginPath(), ctx.arc(0, 0, 2.2, 0, 7), ctx.fillStyle = active ? "#ff9ec0" : "#cdbcc5", ctx.fill(), ctx.restore()) : (ctx.beginPath(), ctx.arc(0, -4, 5, Math.PI, 0), ctx.stroke(), rr(ctx, -9, -4, 18, 15, 4), ctx.fillStyle = active ? "#ffb3c1" : "#e6e0e4", ctx.fill(), ctx.stroke(), starShape(ctx, 0, 4, 3.6, active ? "#fff27a" : "#f6f2f4", 1.2)), ctx.restore();
}
function renderTabBar(dt) {
  if (!isMeta()) {
    barK = 0;
    return;
  }
  let want = barWanted(), step = reducedMotion() ? 1 : Math.max(0, dt) / (want ? 0.2 : 0.18);
  if (barK = want ? Math.min(1, barK + step) : Math.max(0, barK - step), barK <= 0) return;
  let total = BAR_H + insetB, y0 = ch - total + (1 - barK) * total, tw = cw / 3, act = activeTab();
  ctx.save(), ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  let sg = ctx.createLinearGradient(0, y0 - 7, 0, y0);
  sg.addColorStop(0, "rgba(74,52,66,0)"), sg.addColorStop(1, "rgba(74,52,66,0.18)"), ctx.fillStyle = sg, ctx.fillRect(0, y0 - 7, cw, 7), ctx.fillStyle = BAR_BG, ctx.fillRect(0, y0, cw, total + 2), ctx.fillStyle = INK, ctx.fillRect(0, y0 - 1, cw, 2.5);
  let blink = cardsBlinkOn(), fresh = ALL_CARDS.some((id) => S.save.cards[id].fresh);
  for (let i = 0; i < 3; i++) {
    let on = i === act, pressed = !!(down && down.b && down.b.id === "tab" + i), x = i * tw + 6, w = tw - 12, lift = on ? 2 : 0, py = y0 + 6 - lift + (pressed ? 2 : 0), ph = 44, col = i === 1 && blink ? "#fff07a" : TAB_COL[i];
    i === 1 && blink && (rr(ctx, x - 3, y0 + 2, w + 6, ph + 8, 17), ctx.fillStyle = "rgba(255,240,140,0.85)", ctx.fill()), (on || i === 1 && blink) && (rr(ctx, x, py + 3, w, ph, 14), ctx.fillStyle = shade(col, -0.35), ctx.fill(), rr(ctx, x, py, w, ph, 14), ctx.fillStyle = col, ctx.fill(), ctx.lineWidth = 2.5, ctx.strokeStyle = INK, ctx.stroke());
    let bob = i === 1 && blink ? Math.sin(S.t * 8) * 2 : 0;
    drawTabIcon(i, x + w / 2, py + 15 + bob, on), plainText(TAB_NAME[i], x + w / 2, py + 35, 13, on ? INK : TAB_MUTED, "center", "800"), i === 1 && fresh && blob(ctx, x + w / 2 + 15, py + 8, 6, 6, "#ff6f91", 1.5), barK >= 0.5 && button("tab" + i, (i * tw - offX) / scale, (y0 - offY) / scale, tw / scale, BAR_H / scale, () => tabTap(i));
  }
  ctx.restore();
}
function drawGearIcon(x, y, r) {
  ctx.save(), ctx.translate(x, y), ctx.lineJoin = "round", ctx.lineWidth = 2.2, ctx.strokeStyle = INK, ctx.fillStyle = "#c9b8c2", ctx.beginPath();
  for (let k = 0; k < 16; k++) {
    let a = k * Math.PI / 8, rr_ = k % 2 ? r * 0.72 : r;
    ctx.lineTo(Math.cos(a - 0.1) * rr_, Math.sin(a - 0.1) * rr_), ctx.lineTo(Math.cos(a + 0.1) * rr_, Math.sin(a + 0.1) * rr_);
  }
  ctx.closePath(), ctx.fill(), ctx.stroke(), ctx.beginPath(), ctx.arc(0, 0, r * 0.32, 0, 7), ctx.fillStyle = "#fff6ee", ctx.fill(), ctx.stroke(), ctx.restore();
}
function renderSettings() {
  if (!S.settings) return;
  button("setBlock", -2e3, -2e3, W + 4e3, H + 4e3, () => {
  }), ctx.save(), ctx.fillStyle = "rgba(40,26,38,0.55)", ctx.fillRect(-2e3, -2e3, W + 4e3, H + 4e3), ctx.restore(), button("setBlock2", -2e3, -2e3, W + 4e3, H + 4e3, () => closeSettings());
  let x = 70, y = 122, w = 260, h = 398;
  panel(x, y, w, h, "#fff6ee", 20), button("setPanel", x, y, w, h, () => {
  }), text(ctx, "Settings", 200, y + 28, 22, "#ffb3c1");
  let st = S.save.settings || {}, muted2 = st.muted, rmv = st.reduceMotion || "auto", hap = st.haptics !== !1, setS = (k, v) => {
    S.save.settings = { ...S.save.settings || {}, [k]: v }, persist(), sfx("tap");
  };
  drawButton(x + 24, y + 54, w - 48, 52, muted2 ? "Sound: Off" : "Sound: On", muted2 ? "#fff3e6" : "#9fe0b5", { size: 17 }), button("setSound", x + 24, y + 50, w - 48, 60, () => {
    S.save.settings = { ...S.save.settings || {}, muted: !muted2 }, setMuted(!muted2), persist(), sfx("tap");
  }), drawButton(x + 24, y + 122, w - 48, 52, "Reduce motion: " + (rmv === "on" ? "On" : rmv === "off" ? "Off" : "Auto"), rmv === "on" ? "#9fe0b5" : "#fff3e6", { size: 16 }), button("setReduce", x + 24, y + 118, w - 48, 60, () => setS("reduceMotion", rmv === "auto" ? "on" : rmv === "on" ? "off" : "auto")), drawButton(x + 24, y + 190, w - 48, 52, hap ? "Haptics: On" : "Haptics: Off", hap ? "#9fe0b5" : "#fff3e6", { size: 17 }), button("setHaptics", x + 24, y + 186, w - 48, 60, () => setS("haptics", !hap));
  let sure = S.confirmReset > S.t;
  drawButton(x + 24, y + 258, w - 48, 52, sure ? "Sure? Tap again" : "Reset progress", "#ffb3b3", { size: sure ? 16 : 17 }), button("setReset", x + 24, y + 254, w - 48, 60, () => {
    if (S.confirmReset > S.t) {
      let keepSet = S.save.settings;
      S.save = newSave(), keepSet && (S.save.settings = keepSet), touch(S.save, now()), persist(), S.confirmReset = 0, S.cardsBlinkUntil = 0, closeSettings(), toast("Progress reset");
    } else
      S.confirmReset = S.t + 3;
  }), drawButton(x + 24, y + 326, w - 48, 48, "Close", "#fff3e6", { size: 17 }), button("setClose", x + 24, y + 322, w - 48, 56, () => closeSettings());
}
function bakeBackdrop() {
  let k = Math.min(1, 2 / dpr), cv = document.createElement("canvas");
  cv.width = Math.max(1, Math.round(canvas.width * k)), cv.height = Math.max(1, Math.round(canvas.height * k));
  let g = cv.getContext("2d");
  g.setTransform(dpr * scale * k, 0, 0, dpr * scale * k, offX * dpr * k, offY * dpr * k), g.fillStyle = "#ffc98f", g.fillRect(-2e3, -2e3, W + 4e3, H + 4e3);
  let x0 = -offX / scale, x1 = (cw - offX) / scale, y0 = -offY / scale, y1 = (ch - offY) / scale, DS = 44;
  g.save(), g.translate(W / 2, H / 2), g.rotate(Math.PI / 4), g.fillStyle = "#fbc085";
  let reach = Math.hypot(Math.max(Math.abs(x0 - W / 2), Math.abs(x1 - W / 2)), Math.max(Math.abs(y0 - H / 2), Math.abs(y1 - H / 2))), nC = Math.ceil(reach / DS) + 1;
  for (let j = -nC; j <= nC; j++) for (let i = -nC; i <= nC; i++) (i + j & 1) !== 0 && g.fillRect(i * DS - DS / 2, j * DS - DS / 2, DS, DS);
  g.restore();
  let tl = g.createLinearGradient(0, y0, 0, y0 + H * 0.6);
  tl.addColorStop(0, "rgba(255,244,226,0.42)"), tl.addColorStop(1, "rgba(255,244,226,0)"), g.fillStyle = tl, g.fillRect(x0 - 4, y0 - 4, x1 - x0 + 8, H * 0.6 + 4);
  let vg = g.createRadialGradient(W / 2, H * 0.48, H * 0.34, W / 2, H * 0.48, H * 0.82);
  return vg.addColorStop(0, "rgba(190,110,70,0)"), vg.addColorStop(1, "rgba(190,110,70,0.2)"), g.fillStyle = vg, g.fillRect(x0 - 4, y0 - 4, x1 - x0 + 8, y1 - y0 + 8), cv;
}
function battleTable() {
  let b = S.battle;
  if (!b) return null;
  let key = `${canvas.width}x${canvas.height}|${scale.toFixed(4)}|${offX.toFixed(2)}|${offY.toFixed(2)}|${b.mapId}`;
  S.tbCache || (S.tbCache = {});
  let e = S.tbCache[key];
  if (!e) {
    Object.keys(S.tbCache).length >= 2 && (S.tbCache = {});
    let t0 = typeof performance < "u" ? performance.now() : 0, sc = Math.min(dpr, 2), lx0 = offX, lx1 = offX + W * scale, ly0 = offY, ly1 = offY + H * scale, margins = [{ side: "L", x: 0, y: offY + MAP_Y * scale, w: lx0, h: MAP_H * scale }, { side: "R", x: lx1, y: offY + MAP_Y * scale, w: cw - lx1, h: MAP_H * scale }, { side: "T", x: 0, y: 0, w: cw, h: ly0 }, { side: "B", x: 0, y: ly1, w: cw, h: ch - ly1 - insetB }], board = { x: offX, y: offY + MAP_Y * scale, w: MAP_W * scale, h: MAP_H * scale }, lv = b.level || {}, r = renderTable(b.map.theme || 0, lv.world || 1, String(b.mapId), cw, ch, sc, margins, board);
    e = S.tbCache[key] = { bd: r.bd, lip: r.lip, sc, props: r.props, ms: (typeof performance < "u" ? performance.now() : 0) - t0 }, S.lastTableBake = e.ms;
  }
  return e;
}
function drawTableLip() {
  if (!ART81 || offX < 24) return;
  let e = battleTable();
  if (!e) return;
  let by = offY + MAP_Y * scale, bh = MAP_H * scale;
  ctx.save(), ctx.setTransform(1, 0, 0, 1, 0, 0);
  for (let x of [offX, offX + W * scale - 4]) ctx.drawImage(e.lip, x * e.sc, by * e.sc, 4 * e.sc, bh * e.sc, x * dpr, by * dpr, 4 * dpr, bh * dpr);
  ctx.restore();
}
function drawBackdrop() {
  let key = `${canvas.width}x${canvas.height}|${dpr}|${scale.toFixed(4)}|${offX.toFixed(2)}|${offY.toFixed(2)}`;
  S.bdCache || (S.bdCache = {});
  let bd = S.bdCache[key];
  if (ART81 && S.screen === "battle" && S.battle) {
    let e = battleTable();
    e && (bd = e.bd);
  } else bd || (Object.keys(S.bdCache).length >= 3 && (S.bdCache = {}), bd = S.bdCache[key] = bakeBackdrop());
  if (ctx.save(), ctx.setTransform(1, 0, 0, 1, 0, 0), S.screen === "battle") {
    let m = dpr * scale, ix = 2, tx0 = Math.max(0, Math.ceil(offX * dpr + ix)), tx1 = Math.min(canvas.width, Math.floor((offX + MAP_W * scale) * dpr - ix)), ty0 = Math.max(0, Math.ceil((offY + MAP_Y * scale) * dpr + ix)), ty1 = Math.min(canvas.height, Math.floor((offY + (MAP_Y + MAP_H) * scale) * dpr - ix)), kx = bd.width / canvas.width, ky = bd.height / canvas.height, strip = (x0, y0, x1, y1) => {
      x1 > x0 && y1 > y0 && ctx.drawImage(bd, x0 * kx, y0 * ky, (x1 - x0) * kx, (y1 - y0) * ky, x0, y0, x1 - x0, y1 - y0);
    };
    tx1 > tx0 && ty1 > ty0 && m > 0 ? (strip(0, 0, canvas.width, ty0), strip(0, ty1, canvas.width, canvas.height), strip(0, ty0, tx0, ty1), strip(tx1, ty0, canvas.width, ty1)) : strip(0, 0, canvas.width, canvas.height);
  } else ctx.drawImage(bd, 0, 0, bd.width, bd.height, 0, 0, canvas.width, canvas.height);
  ctx.restore(), ctx.save(), ctx.globalAlpha = 0.35, ctx.fillStyle = "#ffffff";
  for (let i = 0; i < 14; i++) {
    let x = i * 97 % W, y = (i * 173 + S.t * 6) % (H + 40) - 20;
    ctx.beginPath(), ctx.arc(x, y, 6 + i % 3 * 3, 0, 7), ctx.fill();
  }
  ctx.restore();
}
var MAPVIEW = { top: 194, bottom: 654 }, WORLD_GAP = 96;
function nodePos(i) {
  let w = worldOf(i), j = i - WORLD_START[w], row = (w - 1) * 5 + Math.floor(j / 2), col = j % 2;
  return { x: 110 + (row % 2 ? 1 - col : col) * 180 + Math.sin(i * 1.7) * 18, y: 600 - row * 88 - (w - 1) * WORLD_GAP };
}
function gateY(w) {
  return (nodePos(WORLD_START[w] - 1).y + nodePos(WORLD_START[w]).y) / 2;
}
function maxMapScroll() {
  return Math.max(0, MAPVIEW.top + 70 - nodePos(LEVELS.length - 1).y);
}
function clampScroll(v) {
  return Math.max(0, Math.min(maxMapScroll(), v));
}
function autoMapScroll() {
  let n = 0;
  for (let i = 0; i < LEVELS.length; i++) levelUnlocked(S.save, i) && (n = i);
  for (let i = 0; i < LEVELS.length; i++) if (levelUnlocked(S.save, i) && !S.save.levels[i].cleared) {
    n = i;
    break;
  }
  return clampScroll(430 - nodePos(n).y);
}
function mapRoadPoints() {
  if (S.mapRoad) return S.mapRoad;
  let pts = [];
  for (let i = 0; i < LEVELS.length - 1; i++) {
    let a = nodePos(i), b = nodePos(i + 1), dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L, side = i % 2 ? 1 : -1, amp = Math.min(46, L * 0.32), c1 = { x: a.x + dx * 0.3 + nx * amp * side, y: a.y + dy * 0.3 + ny * amp * side }, c2 = { x: a.x + dx * 0.7 - nx * amp * side * 0.8, y: a.y + dy * 0.7 - ny * amp * side * 0.8 };
    if (Math.abs(dy) > Math.abs(dx)) {
      let out = a.x > 200 ? 1 : -1;
      c1 = { x: a.x + out * 105, y: a.y + dy * 0.1 }, c2 = { x: b.x + out * 105, y: b.y - dy * 0.1 };
    }
    for (let k = 0; k < 24; k++) {
      let t = k / 24, u = 1 - t;
      pts.push({ x: u * u * u * a.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * b.x, y: u * u * u * a.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * b.y });
    }
  }
  let e = nodePos(LEVELS.length - 1);
  return pts.push({ x: e.x, y: e.y }), S.mapRoad = pts;
}
var _lblBoxes = null;
function mapLabelBoxes() {
  return _lblBoxes || (_lblBoxes = LEVELS.map((_, i) => {
    let p = nodePos(i);
    return { x: p.x, y: p.y + 48 };
  }));
}
function drawMapRoad() {
  let pts = mapRoadPoints(), done = 0;
  for (; done < S.save.levels.length && S.save.levels[done].cleared; ) done++;
  let path = () => {
    ctx.beginPath(), pts.forEach((p, k) => k ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
  };
  ctx.save(), ctx.lineCap = "round", ctx.lineJoin = "round", ctx.save(), ctx.translate(0, 4), path(), ctx.lineWidth = 24, ctx.strokeStyle = "rgba(70,35,50,0.22)", ctx.stroke(), ctx.restore(), path(), ctx.lineWidth = 22, ctx.strokeStyle = INK, ctx.stroke(), ctx.save(), ctx.translate(0, 1.5), path(), ctx.lineWidth = 19, ctx.strokeStyle = "#d9a08c", ctx.stroke(), ctx.restore(), path(), ctx.lineWidth = 16, ctx.strokeStyle = "#f6dcc0", ctx.stroke();
  let doneIdx = Math.min(pts.length - 1, done * 24);
  if (doneIdx > 0) {
    ctx.beginPath();
    for (let k = 0; k <= doneIdx; k++) k ? ctx.lineTo(pts[k].x, pts[k].y) : ctx.moveTo(pts[k].x, pts[k].y);
    ctx.lineWidth = 16, ctx.strokeStyle = "#ffe3a8", ctx.stroke();
  }
  path(), ctx.setLineDash([2, 13]), ctx.lineDashOffset = -S.t * 6, ctx.lineWidth = 5, ctx.strokeStyle = "rgba(200,140,110,0.75)", ctx.stroke(), ctx.setLineDash([]), ctx.restore();
  for (let k = 12; k < pts.length - 6; k += 29) {
    let p = pts[k], q = pts[k + 1], dx = q.x - p.x, dy = q.y - p.y, L = Math.hypot(dx, dy) || 1, s = k % 2 ? 1 : -1, tx = p.x - dy / L * 17 * s, ty = p.y + dx / L * 17 * s;
    if (!mapLabelBoxes().some((q2) => Math.abs(tx - q2.x) < 46 && ty > q2.y - 14 && ty < q2.y + 14))
      if (k % 3) {
        ctx.beginPath();
        for (let a of [-0.5, 0, 0.5])
          ctx.moveTo(tx, ty), ctx.lineTo(tx + Math.sin(a) * 6, ty - Math.cos(a) * 7);
        ctx.lineWidth = 2, ctx.strokeStyle = "#8fcf86", ctx.lineCap = "round", ctx.stroke();
      } else blob(ctx, tx, ty, 3.2, 2.4, "#d9c6cf", 1.4);
  }
}
function drawWorldGate(w) {
  let W2 = WORLDS.find((x) => x.id === w), y = gateY(w), open = worldUnlocked(S.save, w), prev = W2.unlock ? W2.unlock.allLevelsWonInWorld ?? w - 1 : w - 1;
  if (panel(40, y - 30, 320, 60, open ? "#fff1f6" : "#efe7ec", 18), ctx.save(), ctx.translate(76, y + 2), ctx.scale(0.62, 0.62), drawTreat(ctx, W2.treat, 0, 0, 1, S.t, { face: open ? "happy" : "content" }), ctx.restore(), (w === 5 || w === 6) && ART81 ? drawChunkyText(ctx, `${W2.name}`, 214, y - 12, 20, open ? { mode: "title" } : { mode: "plain", fill: "#b9a6b2" }) : text(ctx, `World ${w}: ${W2.name}`, 214, y - 12, 17, open ? "#ff8fab" : "#b9a6b2"), open) plainFit(w === 6 ? W6_STORY : w === 5 ? W5_STORY : "Open! Beat the queen at the top.", 214, y + 12, 262, 12, "#6b5562", "center", "600");
  else {
    let won = LEVELS.filter((L, i) => L.world === prev && S.save.levels[i].cleared).length, total = LEVELS.filter((L) => L.world === prev).length;
    if (plainFit(`Win all ${total} levels (${won}/${total}) + ${W2.unlock.minStarsInWorld} stars (${worldStars(S.save, prev)}/${total * 3})`, 214, y + 12, 262, 12, "#a0607e", "center", "700"), ART81) {
      let gy0 = Math.max(y + S.mapScroll - 30, MAPVIEW.top), gy1 = Math.min(y + S.mapScroll + 30, MAPVIEW.bottom);
      gy1 - gy0 >= 16 && button("gate" + w, 40, gy0, 320, gy1 - gy0, () => {
        S.starCard || (S.starCard = { w }, sfx("tap"));
      });
    }
    ctx.save(), ctx.translate(346, y - 22), rr(ctx, -8, -3, 16, 13, 3), ctx.fillStyle = "#8c8090", ctx.fill(), ctx.beginPath(), ctx.arc(0, -4, 5.5, Math.PI, 0), ctx.lineWidth = 3, ctx.strokeStyle = "#8c8090", ctx.stroke(), ctx.restore();
  }
}
function updateCardsBlink() {
  (S.cardsBlinkUntil || 0) > S.t || checkCardBlink(S.save) && (S.cardsBlinkUntil = S.t + ECONOMY.cardsBlinkSec, persist());
}
function cardsBlinkOn() {
  return (S.cardsBlinkUntil || 0) > S.t && Math.floor((S.cardsBlinkUntil - S.t) * 3) % 2 === 0;
}
function renderMapScreen() {
  ctx.save(), ctx.translate(200, 60);
  let wob = Math.sin(S.t * 2) * 2;
  text(ctx, "Crumb", -22, -8 + wob, 40, "#ffd27a"), text(ctx, "Defense", 26, 28 - wob, 36, "#ffb3c1"), ctx.restore(), drawCookie(ctx, 64, 66, 0.9, S.t, {}), ctx.save(), ctx.translate(336, 86), ctx.scale(1.6, 1.6), drawAnt(ctx, "worker", S.t * 1.2 % 1), ctx.restore(), panel(158, 112, 110, 36, "#fff6ee", 18), diamondIcon(ctx, 178, 130, 1.1), text(ctx, String(S.save.diamonds || 0), 224, 131, 18, "#7fd3ff"), panel(276, 112, 116, 36, "#fff6ee", 18), coinIcon(ctx, 296, 130, 1.2), text(ctx, String(S.save.coins), 344, 131, 18, "#ffd45e");
  let claim2 = canClaim(S.save, now());
  claim2 && (rr(ctx, 10, 106, 74, 74, 20), ctx.fillStyle = `rgba(255,212,94,${0.3 + 0.25 * Math.sin(S.t * 5)})`, ctx.fill()), rr(ctx, 14, 110, 66, 66, 16), ctx.fillStyle = claim2 ? "#ffe7a8" : "#fbe3ee", ctx.fill(), ctx.lineWidth = 2.5, ctx.strokeStyle = INK, ctx.stroke(), giftIcon(ctx, 14 + 66 / 2, 136 + (claim2 ? Math.sin(S.t * 5) * 1.5 : 0), 1.05), plainText("Calendar", 14 + 66 / 2, 162, 12, "#5a4652", "center", "700"), claim2 && (blob(ctx, 78, 112, 8, 8, "#ff6f91", 1.6), text(ctx, "!", 78, 110 + 2.5, 12)), button("calendar", 10, 106, 74, 74, () => openCalendar()), S.mapScroll = clampScroll(S.mapScroll || 0);
  let sc = S.mapScroll;
  ctx.save(), ctx.beginPath(), ctx.rect(-200, MAPVIEW.top, W + 400, MAPVIEW.bottom - MAPVIEW.top), ctx.clip(), ctx.translate(0, sc), drawMapRoad();
  for (let w of WORLDS) w.id > 1 && drawWorldGate(w.id);
  S.layoutNodes = [];
  let lifeOn = ART81 && !reducedMotion(), shines = 0, lastCleared = -1;
  if (lifeOn) for (let i = 0; i < LEVELS.length; i++) S.save.levels[i].cleared && (lastCleared = i);
  for (let i = 0; i < LEVELS.length; i++) {
    let p = nodePos(i), L = S.save.levels[i], open = levelUnlocked(S.save, i), w = worldOf(i), boss = i === WORLD_START[w] + WORLDS.find((x) => x.id === w).levels - 1, isNext = open && !L.cleared, bounce = isNext ? Math.abs(Math.sin(S.t * 3)) * 4 : 0;
    if (mapNode(ctx, p.x, p.y - bounce, i, { open, cleared: L.cleared, next: isNext, stars: L.stars, boss }, S.t), boss && (ctx.save(), ctx.translate(p.x + 24, p.y - 30 - bounce), ctx.scale(0.55, 0.55), drawAnt(ctx, QUEENS[w].type, 0.2), ctx.restore()), lifeOn && L.stars >= 3 && shines < 4 && p.y + sc > MAPVIEW.top && p.y + sc < MAPVIEW.bottom) {
      let ph = (S.t + i * 1.3) % 4 / 0.6;
      ph < 1 && (shines++, fxSparkle(ctx, p.x + 15, p.y - 15, 7, "#fff7a8", ph));
    }
    if (lifeOn && i === lastCleared && i + 1 < LEVELS.length) {
      let wk = S.t % 8 / 3;
      if (wk < 1) {
        let q = nodePos(i + 1), ax = p.x + (q.x - p.x) * (0.15 + 0.7 * wk), ay = p.y + (q.y - p.y) * (0.15 + 0.7 * wk);
        ctx.save(), ctx.translate(ax, ay + 4), ctx.scale((q.x >= p.x ? 1 : -1) * 0.34, 0.34);
        {
          let wsp = antSprite("worker", Math.floor(S.t * 9) % ANT_FRAMES, !1, pxRatio);
          ctx.drawImage(wsp.cv, -wsp.ox, -wsp.oy, wsp.w, wsp.h);
        }
        ctx.restore();
      }
    }
    for (let s2 = 0; s2 < 3; s2++) starShape(ctx, p.x - 18 + s2 * 18, p.y + 32, 7, s2 < L.stars ? "#ffd45e" : "#e8dde4", 1.6);
    text(ctx, LEVELS[i].name, p.x, p.y + 48, 12, "#7a5a6a", "center", null);
    let sy = p.y + sc;
    S.layoutNodes.push({ i, x: p.x, y: sy }), open && sy > MAPVIEW.top + 10 && sy < MAPVIEW.bottom - 10 && button("lvl" + i, p.x - 30, sy - 30, 60, 60, () => openPrep(i));
  }
  drawNextHint(sc), ctx.restore();
  let hintW = WORLDS.map((x) => x.id).filter((id) => id >= 2).find((id) => gateY(id) + sc < MAPVIEW.top - 10);
  if (hintW) {
    let a = 0.75 + 0.25 * Math.sin(S.t * 4);
    ctx.save(), ctx.globalAlpha = a, rr(ctx, 128, MAPVIEW.top - 30, 144, 24, 12), ctx.fillStyle = "rgba(90,64,88,0.85)", ctx.fill(), plainText(`\u25B2 World ${hintW} - scroll up`, 200, MAPVIEW.top - 17.5, 12, "#ffffff", "center", "700"), ctx.restore();
  }
  updateCardsBlink(), blob(ctx, 363, 22, 19, 19, "#fff6ee", 2.2), drawGearIcon(363, 22, 12), button("gear", 337, 0, 52, 52, () => openSettings());
  let shopHint = !S.cal && !S.settings && zapperGiftPending(S.save) && !S.reveal.length;
  !S.cal && !S.settings && !shopHint && plainText("v" + VERSION, 14, 186, 12, "#a08090", "left", "600"), !S.cal && !S.settings && !shopHint && button("verLong", 8, 168, 84, 44, () => {
  }, { onDown: () => {
    S.capsHold = performance.now();
  } }), S.starCard && !S.cal && !S.settings && renderStarCard(), S.cal ? renderCalendar() : S.settings ? renderSettings() : shopHint && onboardSpot(tabRect(2), "shop", () => go("shop"), "A free pack waits in the Shop!"), renderUiFx(1 / 60);
}
var lastBubble = null;
function onboardSpot(R, id, onTap, msg, bub = null, dim = 0.66) {
  ctx.save(), ctx.beginPath(), ctx.rect(-2e3, -2e3, W + 4e3, H + 4e3);
  {
    let x = R.x - 6, y = R.y - 6, w = R.w + 12, h = R.h + 14, r = Math.min((R.r || 14) + 4, w / 2, h / 2);
    ctx.moveTo(x + r, y), ctx.arcTo(x + w, y, x + w, y + h, r), ctx.arcTo(x + w, y + h, x, y + h, r), ctx.arcTo(x, y + h, x, y, r), ctx.arcTo(x, y, x + w, y, r), ctx.closePath();
  }
  ctx.fillStyle = `rgba(40,26,38,${dim})`, ctx.fill("evenodd");
  let g = 0.5 + 0.5 * Math.sin(S.t * 5);
  rr(ctx, R.x - 6, R.y - 6, R.w + 12, R.h + 14, (R.r || 14) + 4), ctx.lineWidth = 3 + g * 2, ctx.strokeStyle = `rgba(255,227,110,${0.6 + 0.4 * g})`, ctx.stroke(), ctx.restore(), button("onboardBlock", -2e3, -2e3, W + 4e3, H + 4e3, () => {
  }), button(id, R.x, R.y, R.w, R.h, onTap);
  let fx = R.x + R.w / 2 + 18, fy = R.y - 22 - Math.abs(Math.sin(S.t * 4)) * 12;
  if (drawFinger(fx, fy), msg) {
    let my = R.y < 260 ? R.y + R.h + 22 : Math.max(90, R.y - (R.y > 600 ? 148 : 104));
    bub ? (panel(bub.x, bub.y, bub.w, 40, "#fff6ee", 16), plainFit(msg, bub.x + bub.w / 2, bub.y + 20, bub.w - 24, 15, "#e0607e", "center", "800"), lastBubble = { x: bub.x, y: bub.y, w: bub.w, h: 40 }) : (panel(60, my, 280, 40, "#fff6ee", 16), plainFit(msg, 200, my + 20, 256, 15, "#e0607e", "center", "800"), lastBubble = { x: 60, y: my, w: 280, h: 40 });
  }
}
function nextHintWanted() {
  return ART81 && !0;
}
function drawWorldReveal(sc) {
  let r = S.worldReveal;
  if (!r || S.screen !== "map") {
    r && S.screen !== "map" && (S.worldReveal = null);
    return;
  }
  if (S.t - r.t0 > 1.2) {
    S.worldReveal = null;
    return;
  }
  let p = nodePos(r.i), k = (S.t - r.t0) / 1.2, rm = reducedMotion();
  ctx.save(), ctx.globalAlpha = 1 - k * k, ctx.lineWidth = 4, ctx.strokeStyle = "#ffe36e", ctx.beginPath(), ctx.arc(p.x, p.y, 28 + (rm ? 4 : k * 14), 0, Math.PI * 2), ctx.stroke(), ctx.restore();
}
function drawNextHint(sc) {
  if (drawWorldReveal(sc), !nextHintWanted() || S.screen !== "map") {
    S.nextHint = null;
    return;
  }
  if (S.cal || S.settings || S.antCard || S.starCard || S.reveal.length || S.pack || zapperGiftPending(S.save) && !S.reveal.length) return;
  let h = nextHintState(S.save), i = nextUnplayedLevel(S.save);
  if (i < 0) {
    S.nextHint = null;
    return;
  }
  let p = nodePos(i), sy = p.y + sc;
  if (sy < MAPVIEW.top + 20 || sy > MAPVIEW.bottom - 40) return;
  if (!S.nextHint) {
    if (!h.armed || h.shown >= 2) return;
    S.nextHint = { kind: h.armed, i, t0: S.t }, h.shown++, h.done.push(h.armed), h.armed = "", persist();
  }
  if (S.nextHint.i !== i || S.t - S.nextHint.t0 > 12) {
    S.nextHint = null;
    return;
  }
  let pulse = reducedMotion() ? 0.5 : 0.5 + 0.5 * Math.sin(S.t * 5);
  ctx.save(), ctx.lineWidth = 3.5 + pulse * 2, ctx.strokeStyle = `rgba(255,227,110,${0.65 + 0.35 * pulse})`, ctx.beginPath(), ctx.arc(p.x, p.y, 30 + pulse * 5, 0, Math.PI * 2), ctx.stroke(), ctx.restore(), drawFinger(p.x + 18, p.y - 30 - (reducedMotion() ? 0 : Math.abs(Math.sin(S.t * 4)) * 10));
}
function drawFinger(x, y) {
  ctx.save(), ctx.translate(x, y), ctx.rotate(0.35), ctx.lineJoin = "round", ctx.lineWidth = 2.6, ctx.strokeStyle = INK, ctx.fillStyle = "#ffe2c8", rr(ctx, -6, -34, 12, 34, 6), ctx.fill(), ctx.stroke(), rr(ctx, -15, -50, 34, 26, 11), ctx.fill(), ctx.stroke();
  for (let k of [0, 1, 2])
    ctx.beginPath(), ctx.moveTo(-3 + k * 7, -50), ctx.lineTo(-3 + k * 7, -40), ctx.lineWidth = 1.6, ctx.stroke();
  rr(ctx, -16, -62, 36, 14, 5), ctx.fillStyle = "#9ad0ff", ctx.lineWidth = 2.4, ctx.fill(), ctx.stroke(), ctx.beginPath(), ctx.ellipse(0, -6, 3, 2, 0, 0, 7), ctx.fillStyle = "#fff3ea", ctx.fill(), ctx.restore();
}
function prizeIcon(p, x, y, s = 1) {
  p.kind === "coins" ? (coinIcon(ctx, x - 6 * s, y + 2 * s, 1.1 * s), coinIcon(ctx, x + 5 * s, y - 3 * s, 1.1 * s)) : p.kind === "diamonds" ? diamondIcon(ctx, x, y, 1.25 * s) : p.kind === "card" ? (ctx.save(), ctx.translate(x, y), ctx.rotate(-0.12), rr(ctx, -11 * s, -14 * s, 22 * s, 28 * s, 5 * s), ctx.fillStyle = p.level >= 2 ? "#ffd27a" : "#b5d8ff", ctx.fill(), ctx.lineWidth = 2, ctx.strokeStyle = INK, ctx.stroke(), text(ctx, "L" + p.level, 0, 0.5, 12 * s, "#fff"), ctx.restore()) : (p.kind === "booster" || p.kind === "bonus") && (ctx.save(), ctx.translate(x, y), ctx.scale(0.8 * s, 0.8 * s), drawBonusIcon(ctx, p.id, S.t), ctx.restore());
}
function prizeLabel(p) {
  return p ? p.kind === "coins" ? `${p.count} coins` : p.kind === "diamonds" ? `${p.count} diamonds` : p.kind === "card" ? p.id ? p.newCard ? `New tower: ${TOWERS[p.id].name} (L${p.level})` : `${TOWERS[p.id].short} L${p.level} - in your Cards` : `L${p.level} tower card` : p.kind === "bonus" || p.kind === "booster" ? `1 ${BONUSES[p.id].name} booster` : "" : "";
}
function renderCalendar() {
  let K = CALENDAR, st = status(S.save, now()), CA = S.cal;
  CA.t += 1 / 60, ctx.fillStyle = "rgba(60,40,55,0.55)", ctx.fillRect(-2e3, -2e3, W + 4e3, H + 4e3), button("calBlock", -2e3, -2e3, W + 4e3, H + 4e3, () => {
  });
  let pop = Math.min(1, CA.t * 5);
  ctx.save(), ctx.translate(200, 360), ctx.scale(0.85 + 0.15 * pop, 0.85 + 0.15 * pop), ctx.translate(-200, -360), panel(18, 62, 364, 600, "#fff6ee"), giftIcon(ctx, 56, 94, 1.1), text(ctx, "Daily Rewards", 214, 92, 26, "#ffb3c1"), plainText("One prize every day you visit.", 214, 118, 12, "#6b5562", "center");
  let shown = CA.result ? CA.result.streak : st.streak;
  plainText("Monthly streak", 36, 142, 13, "#3d2a36", "left", "700"), plainText(`${shown}/${st.monthLength}`, 364, 142, 13, "#3d2a36", "right", "700");
  let bx = 36, bw = 328, segW = bw / st.monthLength;
  for (let i = 0; i < st.monthLength; i++) {
    let on = i < shown;
    rr(ctx, bx + i * segW + 0.8, 152, segW - 1.6, 14, 3), ctx.fillStyle = on ? i === shown - 1 && CA.result ? "#ffd45e" : "#ff9ec0" : "#efe2e8", ctx.fill();
  }
  if (ctx.lineWidth = 2, rr(ctx, bx - 2, 150, bw + 4, 18, 6), ctx.strokeStyle = INK, ctx.stroke(), Object.keys(st.milestones || {}).map(Number).sort((a, b) => a - b).forEach((m, k) => {
    let tier = m >= st.monthLength ? 3 : Math.min(2, k + 1), sc = tier === 3 ? 1.55 : tier === 2 ? 1.12 : 1, mx = Math.min(bx + bw - 34, bx + (m - 0.5) * segW), my = tier === 3 ? 200 : 194;
    ctx.beginPath(), ctx.moveTo(bx + (m - 0.5) * segW, 168), ctx.lineTo(mx, my - 14 * sc), ctx.lineWidth = 2, ctx.strokeStyle = "rgba(82,60,75,0.35)", ctx.stroke(), monthBox(ctx, mx, my, sc, tier, S.t, shown >= m), plainText(`Day ${m}`, mx, my + 24 * sc - (tier === 3 ? 4 : 0), 12, tier === 3 ? "#c27a00" : "#6b5562", "center", "700");
  }), st.resetPending && !CA.result ? plainText("You missed a day - the streak restarts at 1.", 200, 256, 12, "#c0392b", "center", "600") : plainText("Collect every day to keep the streak. Bigger prizes as it grows!", 200, 256, 12, "#6b5562", "center"), plainText("Your 7-day cycle", 36, 276, 13, "#3d2a36", "left", "700"), st.tiles.forEach((tl, i) => {
    let big = i === 6, row = big ? 2 : Math.floor(i / 3), col = big ? 0 : i % 3, gap = 8, cw2 = (328 - 2 * gap) / 3, rh = 74, w = big ? 328 : cw2, h = big ? 84 : rh, x = 36 + col * (cw2 + gap), y = 286 + row * (rh + gap), today = tl.state === "today", claimed = tl.state === "claimed", missed = tl.state === "missed", glow = today ? 0.5 + 0.5 * Math.sin(S.t * 5) : 0;
    if (ctx.save(), today && (rr(ctx, x - 4, y - 4, w + 8, h + 8, 16), ctx.fillStyle = `rgba(255,212,94,${0.35 + glow * 0.4})`, ctx.fill()), rr(ctx, x, y, w, h, 13), big && !claimed && !missed) {
      let g = ctx.createLinearGradient(x, y, x + w, y + h);
      g.addColorStop(0, "#fff1c9"), g.addColorStop(1, "#ffe1ec"), ctx.fillStyle = g;
    } else ctx.fillStyle = claimed ? "#e3f6dc" : missed ? "#ece6ea" : today ? "#fff1c9" : "#ffffff";
    ctx.fill(), ctx.lineWidth = today ? 3.5 : big ? 2.6 : 2, ctx.strokeStyle = today ? "#e8a620" : big ? "#e0a830" : INK, ctx.stroke(), plainText(`Day ${i + 1}`, x + 9, y + 13, 12, "#6b5562", "left", "700"), missed && plainText("missed", x + w - 8, y + 13, 12, "#8c7a86", "right", "600"), today && text(ctx, "TAP!", x + w - 22, y + 13, 12, "#ff8fab"), missed && (ctx.globalAlpha = 0.45);
    let bobY = today ? Math.sin(S.t * 4) * 2 : 0;
    if (big) {
      for (let k = 0; k < 2; k++) starShape(ctx, x + (k ? w - 34 : 34), y + 42 + Math.sin(S.t * 2 + k * 2) * 3, 5, "#fff7a8", 1.2);
      prizeIcon({ kind: "card", level: tl.prize.level }, x + w / 2 - 52, y + 40 + bobY, 1.35), text(ctx, "+", x + w / 2, y + 40, 20, "#e0a830");
      let ex = tl.prize.extra || { kind: "diamonds", count: 0 };
      prizeIcon(ex, x + w / 2 + 50, y + 40 + bobY, 1.5), plainFit(`L${tl.prize.level} card + ${ex.count} diamonds`, x + w / 2, y + 72, w - 20, 13, "#3d2a36", "center", "700");
    } else {
      prizeIcon(tl.prize, x + w / 2, y + 38 + bobY, 1.05);
      let amt = tl.prize.kind === "card" ? `L${tl.prize.level} card` : tl.prize.kind === "coins" ? `${tl.prize.count} coins` : tl.prize.kind === "diamonds" ? `${tl.prize.count} diamonds` : "1 booster";
      plainFit(amt, x + w / 2, y + 63, w - 10, 12, "#3d2a36", "center", "700");
    }
    ctx.globalAlpha = 1, claimed && (ctx.beginPath(), ctx.moveTo(x + w - 26, y + h - 14), ctx.lineTo(x + w - 18, y + h - 7), ctx.lineTo(x + w - 6, y + h - 22), ctx.lineWidth = 4, ctx.strokeStyle = "#3f9a46", ctx.lineCap = "round", ctx.stroke()), ctx.restore(), button("calTile" + i, x, y, w, h, () => {
      if (today && !CA.result) {
        let r = claim(S.save, now());
        if (r.ok) {
          CA.result = r, CA.rt = 0, persist(), sfx("upgrade");
          for (let pz of [r.prize, r.extra, r.milestone]) pz && pz.kind === "card" && pz.reveal && queueReveal(pz.id, pz.level, pz.newCard, S.t + 0.7);
          for (let k = 0; k < 14; k++) addUi({ k: "starBurst", x: x + w / 2, y: y + 40, a: k / 14 * Math.PI * 2, life: 0.8, max: 0.8 });
        }
      } else if (missed) toast("Missed - this day has passed");
      else if (claimed) toast("Already collected");
      else {
        let n = i - st.tile;
        toast(n === 1 ? "Comes on your next day in the game" : `Comes in ${n} more days in the game`);
      }
    });
  }), CA.result) {
    CA.rt += 1 / 60;
    let k = Math.min(1, CA.rt * 4);
    ctx.save(), ctx.translate(200, 566), ctx.scale(0.6 + 0.4 * k, 0.6 + 0.4 * k), rr(ctx, -160, -26, 320, 52, 16), ctx.fillStyle = "#fff2b8", ctx.fill(), ctx.lineWidth = 2.5, ctx.strokeStyle = "#e0a830", ctx.stroke(), prizeIcon(CA.result.prize, -128, 0, 1.05);
    let extras = [CA.result.extra && `+ ${prizeLabel(CA.result.extra)}`, CA.result.milestone && `+ streak gift: ${prizeLabel(CA.result.milestone)}`].filter(Boolean);
    plainFit((CA.result.prize.kind === "card" ? "You won a card: " : "You got: ") + prizeLabel(CA.result.prize), 14, extras.length ? -8 : 0, 250, 15, "#8a4e08", "center", "700"), extras.length && plainFit(extras.join("  "), 14, 12, 250, 12, "#8a4e08", "center", "600"), ctx.restore();
  } else st.claimable ? plainText("Tap today's tile to collect your prize!", 200, 560, 13, "#e0607e", "center", "700") : plainText("Come back tomorrow for the next prize.", 200, 560, 13, "#6b5562", "center", "600");
  diamondIcon(ctx, 120, 596, 1), text(ctx, String(S.save.diamonds || 0), 152, 597, 15, "#7fd3ff"), coinIcon(ctx, 232, 596, 1.1), text(ctx, String(S.save.coins), 266, 597, 15, "#ffd45e"), ctx.restore(), drawButton(110, 610, 180, 44, CA.result || !st.claimable ? "Close" : "Later", "#9fe0b5"), button("calClose", 106, 606, 188, 52, () => {
    S.cal = null, sfx("tap");
  });
}
function drawCard(x, y, w, h, type, opt = {}) {
  let T = TOWERS[type];
  ctx.save(), opt.lift && (y -= opt.lift), opt.dim && (ctx.globalAlpha = 0.55), rr(ctx, x, y + 4, w, h, 14), ctx.fillStyle = "rgba(74,52,66,0.28)", ctx.fill(), rr(ctx, x, y, w, h, 14);
  let g = ctx.createLinearGradient(0, y, 0, y + h);
  if (g.addColorStop(0, shade(T.color, 0.5)), g.addColorStop(1, T.color), ctx.fillStyle = opt.locked ? "#ddd3da" : g, ctx.fill(), ctx.lineWidth = opt.selected ? 4 : 2.5, ctx.strokeStyle = opt.selected ? opt.selCol || "#ff6f91" : INK, ctx.stroke(), opt.locked) {
    text(ctx, "?", x + w / 2, y + h * 0.42, 30, "#fff"), text(ctx, opt.lockText || "Locked", x + w / 2, y + h - 14, 12, "#7a6a76", "center", null), ctx.restore();
    return;
  }
  ART81 && opt.cost != null && (ctx.save(), ctx.lineCap = "round", opt.afford && (ctx.beginPath(), ctx.moveTo(x + 13, y + 3.2), ctx.lineTo(x + w - 13, y + 3.2), ctx.lineWidth = 2, ctx.strokeStyle = "rgba(255,255,255,0.6)", ctx.stroke()), ctx.beginPath(), ctx.moveTo(x + 13, y + h - 2.6), ctx.lineTo(x + w - 13, y + h - 2.6), ctx.lineWidth = 3, ctx.strokeStyle = "rgba(70,35,50,0.28)", ctx.stroke(), ctx.restore()), ctx.save(), ctx.beginPath(), rr(ctx, x + 4, y + 4, w - 8, h - 8, 11), ctx.clip();
  let nameY = y + h - (opt.cost != null ? ART81 ? 35 : 31 : 13), iconY = y + (nameY - y) * 0.62 + 4;
  ctx.beginPath(), ctx.arc(x + w / 2, iconY - 8, w * 0.32, 0, 7), ctx.fillStyle = "rgba(255,255,255,0.45)", ctx.fill();
  let iconS = Math.min(w / 58, (nameY - y) / 58);
  ctx.translate(x + w / 2, iconY), ctx.scale(iconS, iconS), drawTower(ctx, type, S.t, null), ctx.restore();
  let tag = T.place === "path" ? "on trail" : T.targets === "air" ? "air only" : type === "laser" ? "gnd+air" : "";
  if (tag && h > 70 && !opt.badge && text(ctx, tag, x + w - 7, y + 11, 12, "#fff", "right"), fitText(T.short || T.name, x + w / 2, nameY, w - 10, w < 85 ? 13 : 14, "#fff"), opt.level && (blob(ctx, x + 12, y + 12, 12, 11, "#ffe36e", 2), text(ctx, "L" + opt.level, x + 12, y + 12.5, 12, "#7a4a2a", "center", null)), opt.cost != null && ART81) {
    let px = x + 8, pw = w - 16, py = y + h - 25, ph = 21;
    rr(ctx, px, py, pw, ph, 10), ctx.fillStyle = opt.afford ? "#6a4660" : "#664250", ctx.fill(), ctx.lineWidth = 2, ctx.strokeStyle = INK, ctx.stroke(), crumbIcon(ctx, x + w / 2 - (opt.cost === 0 ? 24 : 16), py + ph / 2 + 0.5, 0.8), drawChunkyText(ctx, opt.cost === 0 ? "FREE" : String(opt.cost), x + w / 2 + (opt.cost === 0 ? 8 : 7), py + ph / 2 + 0.5, 16, { fill: opt.afford ? "#fff6c8" : "#ffc9c0", outline: 2 });
  } else opt.cost != null && (rr(ctx, x + 10, y + h - 21, w - 20, 17, 8), ctx.fillStyle = opt.afford ? "#fff8ec" : "#ffd6d6", ctx.fill(), ctx.lineWidth = 1.8, ctx.strokeStyle = INK, ctx.stroke(), crumbIcon(ctx, x + w / 2 - (opt.cost === 0 ? 22 : 14), y + h - 12.5, 0.75), text(ctx, opt.cost === 0 ? "FREE" : String(opt.cost), x + w / 2 + 6, y + h - 12, 12, opt.afford ? "#7a4a2a" : "#c0392b", "center", null));
  if (opt.badge && (blob(ctx, x + w - 11, y + 11, 11, 11, "#ff8fab", 2), text(ctx, opt.badge, x + w - 11, y + 11.5, 12, "#fff")), opt.mergeReady) {
    let p = 1 + Math.sin(S.t * 6) * 0.08;
    ctx.save(), ctx.translate(x + w - 10, y + 10), ctx.scale(p, p), blob(ctx, 0, 0, 11, 11, "#ff6f91", 2), text(ctx, "!", 0, 0.5, 14, "#fff"), ctx.restore();
  }
  opt.fresh && (rr(ctx, x + w / 2 - 19, y - 9, 38, 17, 8), ctx.fillStyle = "#ffd45e", ctx.fill(), ctx.lineWidth = 2, ctx.strokeStyle = INK, ctx.stroke(), text(ctx, "NEW", x + w / 2, y - 0.5, 12, "#fff")), ctx.restore();
}
function antIcon(type, x, y, s = 1, idx = 0) {
  ctx.save(), ctx.translate(x, y), ctx.scale(s, s), heroBob(ctx, S.t, idx), drawAnt(ctx, type, S.t * 1.3 % 1), ctx.restore();
}
function renderPrep() {
  let i = S.levelIndex, L = LEVELS[i];
  panel(12, 12, 376, 696, "#fff6ee"), drawChunkyText(ctx, `Level ${i + 1}`, 200, 40, 28, { mode: "title" }), text(ctx, levelHeaderLine(L, MAPS), 200, 66, 13, "#7a5a6a", "center", null);
  let ants = levelAntTypes(i);
  text(ctx, "Incoming ants", 30, 92, 14, "#7a5a6a", "left", null), text(ctx, `${L.waveCount} waves`, 370, 92, 14, "#7a5a6a", "right", null), levelHasFlyers(i) && (rr(ctx, 152, 82, 132, 20, 10), ctx.fillStyle = "#d7ecff", ctx.fill(), ctx.lineWidth = 1.6, ctx.strokeStyle = "#5a9fe0", ctx.stroke(), plainText("Flyers in this level", 218, 92.5, 12, "#2f6fae", "center", "800")), S.layoutPrepAnts = [];
  let n = ants.length, slot = Math.min(76, 340 / n), x0 = 200 - slot * (n - 1) / 2;
  ants.forEach((t, k) => {
    let x = x0 + k * slot, sz = ANTS[t].size, sc = Math.min(1.15, (slot - 6) / (40 * sz), 30 / (34 * sz));
    antIcon(t, x, 133, sc, k), S.layoutPrepAnts.push({ type: t, x: x - 20 * sz * sc, y: 133 - 34 * sz * sc, w: 40 * sz * sc, h: 46 * sz * sc });
    {
      let rk = rarityRank(t) + 1, cols = ["#b9a8b0", "#5fbf7a", "#4a90e2", "#a05ad8"];
      if (rk <= 4) for (let q = 0; q < rk; q++)
        ctx.beginPath(), ctx.arc(x + (q - (rk - 1) / 2) * 6, 148, 2.2, 0, Math.PI * 2), ctx.fillStyle = cols[rk - 1], ctx.fill(), ctx.lineWidth = 0.8, ctx.strokeStyle = "rgba(70,40,55,.55)", ctx.stroke();
    }
    button("ant" + t, x - slot / 2, 104, slot, 66, () => {
      S.prepTip = { type: t, until: S.t + 3.4 }, sfx("tap");
    });
    {
      let nm = ANTS[t].name.replace(" Ant", "");
      if (ctx.font = `bold 12px ${FONT}`, ctx.measureText(nm).width <= slot - 2) text(ctx, nm, x, 161, 12, "#7a5a6a");
      else {
        let parts = nm.includes(" ") ? nm.split(" ") : nm.split(/(?<=-)/);
        (parts.length > 2 ? [parts[0], parts.slice(1).join(" ")] : parts).forEach((q, qi) => text(ctx, q, x, 156.5 + qi * 12.5, 12, "#7a5a6a"));
      }
    }
  });
  let unlocked = unlockedCards(S.save);
  text(ctx, `Your deck (${S.prep.deck.length}/${BATTLE.deckSize}) - tap to pick`, 30, 182, 14, "#7a5a6a", "left", null);
  let capW = worldCardLevelCap(i), overCap = (id) => !!capW && unlocked.includes(id) && S.save.cards[id].level > capW;
  capW && unlocked.some(overCap) && plainText(`A card above L${capW} acts as L${capW} in this world`, 200, 488, 12, "#b0506a", "center", "800");
  let ownedIds = ALL_CARDS.filter((id) => unlocked.includes(id)), lockedIds = ALL_CARDS.filter((id) => !unlocked.includes(id));
  if (ownedIds.forEach((id, k) => {
    let col = k % 5, row = Math.floor(k / 5), x = 22 + col * 72, y = 196 + row * 98, w = 66, h = 90, isU = !0, di = S.prep.deck.indexOf(id);
    drawCardPic(x, y, w, h, id, { locked: !isU, lockText: "Shop or prize", selected: di >= 0, selCol: "#111111", badge: di >= 0 ? String(di + 1) : null, tag: !0, level: isU ? S.save.cards[id].level : 0, cap: capW || 0, spStar: !!(ART81 && specialState(id, L, Math.min(S.save.cards[id].level, capW || 99)) === "active"), dim: isU && di < 0 && S.prep.deck.length >= BATTLE.deckSize }), isU && button("deck" + id, x, y, w, h, () => {
      let d = S.prep.deck, j = d.indexOf(id);
      j >= 0 ? d.splice(j, 1) : d.length < BATTLE.deckSize ? d.push(id) : toast(`Deck is full (${BATTLE.deckSize}). Tap a card to remove it.`), ART81 && TOWERS[id].special && (S.prepTip = { tower: id, until: S.t + 3.4 }), sfx("tap");
    });
  }), lockedIds.length) {
    let ly = 196 + Math.ceil(ownedIds.length / 5) * 98 - 2;
    ctx.fillStyle = "rgba(122,90,106,0.35)", ctx.fillRect(22, ly + 9, 356, 1.5), rr(ctx, 130, ly, 140, 19, 9), ctx.fillStyle = "#f7ecef", ctx.fill(), plainText("Not yet unlocked", 200, ly + 10, 12, "#7a5a6a", "center", "700"), lockedIds.forEach((id, k) => {
      let x = 24 + k % 8 * 44, y = ly + 24 + Math.floor(k / 8) * 40, w = 40, h = 36;
      rr(ctx, x, y, w, h, 8), ctx.fillStyle = "#e4dbe1", ctx.fill(), ctx.lineWidth = 2, ctx.strokeStyle = "rgba(82,60,75,0.55)", ctx.stroke(), text(ctx, "?", x + w / 2, y + h / 2, 16, "#fff");
    });
  }
  if (S.prepTip && S.prepTip.tower && S.t < S.prepTip.until) {
    let id = S.prepTip.tower, T = TOWERS[id], cl = S.save.cards[id] ? Math.min(S.save.cards[id].level, capW || 99) : 1, st = specialState(id, LEVELS[i], cl);
    if (panel(20, 179, 360, 40, "#5a4058", 14), plainFit(`${T.name} \xB7 card L${cl}`, 200, 190, 336, 12, "#ffe39a", "center", "800"), st === "active") {
      let full = `${T.special.name}: ${T.special.text}`;
      ctx.font = `600 12px ${FONT}`, plainFit(ctx.measureText(full).width <= 336 ? full : `${T.special.name}: ${T.special.short}`, 200, 207, 336, 12, "#ffffff", "center", "600");
    } else st === "asleep" ? plainFit(`${T.special.name}: awakens in World ${SPECIALS_FROM_WORLD}`, 200, 207, 336, 12, "#e4d6b8", "center", "600") : plainFit(`Special unlocks at card level ${SPECIAL_CARD_LEVEL}`, 200, 207, 336, 12, "#d8cdd3", "center", "600");
    button("antTip", 20, 175, 360, 48, () => {
      S.prepTip = null;
    });
  } else if (S.prepTip && S.prepTip.type && S.t < S.prepTip.until) {
    let tp = S.prepTip.type, rk = rarityRank(tp) + 1, tier = rarityOf(tp), nm = ANTS[tp].name;
    panel(20, 179, 360, 40, "#5a4058", 14), plainFit(rk <= 4 ? `${nm}: ${tier} (${rk} dot${rk > 1 ? "s" : ""})` : `${nm}: ${tier} (no dots)`, 200, 192, 336, 12, "#ffe39a", "center", "800"), plainFit(ANTS[tp].intro || "Dots: 1 common, 2 uncommon, 3 rare, 4 elite", 200, 208, 336, 12, "#ffffff", "center", "600"), button("antTip", 20, 175, 360, 48, () => {
      S.prepTip = null;
    });
  } else S.prepTip = null;
  let by = 510;
  text(ctx, `Boosters (bring ${BATTLE.bonusTypesToBring}, max ${BATTLE.maxBonusUses} uses)`, 30, by, 14, "#7a5a6a", "left", null), BONUS_TYPES.forEach((bt, k) => {
    let x = 26 + k * 88, y = by + 14, w = 80, h = 64, sel = S.prep.bonuses.includes(bt), stock = S.save.bonusStock[bt] || 0;
    rr(ctx, x, y, w, h, 14), ctx.fillStyle = sel ? shade(BONUSES[bt].color, 0.2) : "#f3ebee", ctx.fill(), sel && stock <= 0 ? lavaBorder(ctx, x, y, w, h, 14, S.t) : (ctx.lineWidth = sel ? 4.5 : 2.5, ctx.strokeStyle = sel ? "#111111" : INK, ctx.stroke()), ctx.save(), ctx.translate(x + w / 2, y + 25), ctx.scale(1.3, 1.3), drawBonusIcon(ctx, bt, S.t), ctx.restore(), text(ctx, BONUSES[bt].name, x + w / 2, y + 51, 12, "#fff"), text(ctx, "x" + stock, x + w - 12, y + 12, 12, stock ? "#fff" : "#ff9a9a"), button("bon" + bt, x, y, w, h, () => {
      let b = S.prep.bonuses, j = b.indexOf(bt);
      j >= 0 ? b.splice(j, 1) : (b.push(bt), b.length > BATTLE.bonusTypesToBring && b.shift(), stock <= 0 && (zeroBonusAlert(bt), S.zeroHint = { bt, until: S.t + 8 })), sfx("tap");
    });
  });
  let warn = null;
  levelHasFlyers(i) && !S.prep.deck.some((d) => AIR_COUNTERS.includes(d)) ? warn = ART81 ? "Flying ants ahead! Only the Laser and Bug Zapper can hit them." : "Flying ants ahead! Only Laser, Bug Zapper or the Crop Duster can hit them." : ants.includes("gasmask") && S.prep.deck.includes("spray") && S.prep.deck.filter((d) => d !== "spray" && TOWERS[d].kind === "tower" && d !== "fan").length < 2 && (warn = "Gas-mask ants ignore Bug Spray - bring other damage too."), S.zeroHint && S.t < S.zeroHint.until && S.prep.bonuses.includes(S.zeroHint.bt) && !(S.save.bonusStock[S.zeroHint.bt] > 0) && (warn = `You have 0 ${BONUSES[S.zeroHint.bt].name}s. Buy one during battle for ${ECONOMY.diamonds.boosterPriceStart} diamonds, or in the Shop.`), S.layoutWarn = null, S.layoutAirFix = null;
  let airPlan = ART81 && warn && warn.startsWith("Flying ants ahead") ? airFixPlan(S.prep.deck, unlocked, S.save.cards, BATTLE.deckSize) : null;
  if (airPlan) {
    let lines = wrapLines(warn, 214, 12).slice(0, 3), hh = 54, y0 = 646 - hh - 2, nm = TOWERS[airPlan.add].short || TOWERS[airPlan.add].name;
    panel(26, y0, 348, hh, "#ffe3a0", 12), lines.forEach((l, k) => text(ctx, l, 140, y0 + 27 - (lines.length - 1) * 7 + k * 14, 12, "#8a4a10", "center", null)), drawButton(256, y0 + 5, 112, 44, `Add ${nm}`, "#ffd27a", { size: 14 }), button("airfix", 256, y0 + 3, 112, 48, () => {
      let d = S.prep.deck;
      airPlan.drop ? d.splice(d.indexOf(airPlan.drop), 1, airPlan.add) : d.push(airPlan.add), sfx("tap"), toast(`${TOWERS[airPlan.add].name} added` + (airPlan.drop ? ` (replaced ${TOWERS[airPlan.drop].name})` : ""), "#ffe39a");
    }), ctx.font = `bold 12px ${FONT}`, S.layoutWarn = { box: { x: 26, y: y0, w: 348, h: hh }, lines: lines.map((l) => ctx.measureText(l).width), maxW: 214 }, S.layoutAirFix = { add: airPlan.add, drop: airPlan.drop, x: 256, y: y0 + 3, w: 112, h: 48 };
  } else if (warn) {
    let lines = wrapLines(warn, 324, 12).slice(0, 3), hh = 12 + lines.length * 14;
    panel(26, 646 - hh - 2, 348, hh, S.zeroHint && warn.startsWith("You have 0") ? "#fff2b8" : "#fff0c2", 12), lines.forEach((l, k) => text(ctx, l, 200, 646 - hh + 6 + k * 14 + 5, 12, "#b0602a", "center", null)), ctx.font = `bold 12px ${FONT}`, S.layoutWarn = { box: { x: 26, y: 646 - hh - 2, w: 348, h: hh }, lines: lines.map((l) => ctx.measureText(l).width), maxW: 324 };
  }
  drawButton(26, 652, 110, 48, "Back", "#fff3e6"), button("back", 26, 650, 110, 54, () => go("map"));
  let ready = S.prep.deck.length === Math.min(BATTLE.deckSize, unlocked.length);
  if (drawButton(150, 652, 224, 48, "Defend!", "#9fe0b5", { disabled: !ready, size: 22 }), button("start", 150, 650, 224, 54, () => {
    ready ? startBattle() : toast(`Pick ${BATTLE.deckSize} cards`);
  }), S.prepAlert) {
    S.prepAlert.t -= 1 / 60, ctx.save(), ctx.globalAlpha = Math.min(1, S.prepAlert.t * 4);
    let lines = wrapLines(S.prepAlert.msg, 250, 12.5), hh = 22 + lines.length * 16, y0 = 498 - hh;
    panel(60, y0, 280, hh, "#5a4058", 14), lines.forEach((l, k) => text(ctx, l, 200, y0 + 19 + k * 16, 12.5, "#ffd0d0", "center", null)), ctx.restore(), S.prepAlert.t <= 0 && (S.prepAlert = null);
  }
  S.antCard && renderAntCard();
}
function renderAntCard() {
  let t = S.antCard, D = ANTS[t];
  if (!D) {
    S.antCard = null;
    return;
  }
  ctx.fillStyle = "rgba(60,40,55,0.6)", ctx.fillRect(-2e3, -2e3, W + 4e3, H + 4e3), button("antCardBlock", -2e3, -2e3, W + 4e3, H + 4e3, () => {
  });
  let x0 = 36, w = 328, y0 = 150, h = 400;
  panel(x0, y0, w, h, "#fff6ee"), drawChunkyText(ctx, "New ant!", 200, y0 + 36, 28, { mode: "title" }), ctx.save(), ctx.translate(200, y0 + 150);
  let sz = Math.min(1, 1.3 / D.size);
  ctx.scale(2.2 * sz, 2.2 * sz), contactShadow(ctx, 0, 16, 22, 5, 0.22), heroBob(ctx, S.t, 0), drawAnt(ctx, t, S.t * 1.3 % 1), ctx.restore(), text(ctx, D.name, 200, y0 + 214, 20, "#7a4a5e");
  let rk = rarityRank(t) + 1, cols = ["#b9a8b0", "#5fbf7a", "#4a90e2", "#a05ad8"];
  if (rk <= 4) for (let q = 0; q < rk; q++)
    ctx.beginPath(), ctx.arc(200 + (q - (rk - 1) / 2) * 12, y0 + 234, 4, 0, Math.PI * 2), ctx.fillStyle = cols[rk - 1], ctx.fill(), ctx.lineWidth = 1, ctx.strokeStyle = "rgba(70,40,55,.55)", ctx.stroke();
  wrapLines(ANT_CARD[t] || D.intro || "", w - 44, 14).forEach((l, k) => text(ctx, l, 200, y0 + 262 + k * 19, 14, "#5a4652", "center", null)), drawButton(x0 + 64, y0 + h - 64, w - 128, 48, "Got it", "#9fe0b5", { size: 20 }), button("antCardOk", x0 + 60, y0 + h - 68, w - 120, 56, antCardDone);
}
function renderStarCard() {
  let c = S.starCard, W2 = WORLDS.find((x) => x.id === c.w);
  if (!W2) {
    S.starCard = null;
    return;
  }
  let prev = W2.unlock ? W2.unlock.allLevelsWonInWorld ?? c.w - 1 : c.w - 1, need = W2.unlock ? W2.unlock.minStarsInWorld : 0;
  ctx.fillStyle = "rgba(60,40,55,0.55)", ctx.fillRect(-2e3, -2e3, W + 4e3, H + 4e3), button("starCardBlock", -2e3, -2e3, W + 4e3, H + 4e3, () => {
    S.starCard = null;
  });
  let rows = lowestStarLevels(S.save, c.w).slice(0, 5), x0 = 36, w = 328, h = 150 + Math.max(1, rows.length) * 26, y0 = Math.round(380 - h / 2);
  panel(x0, y0, w, h, "#fff6ee"), text(ctx, `World ${c.w} needs ${need} stars`, 200, y0 + 30, 20, "#7a4a5e"), plainText(`World ${prev}: ${worldStars(S.save, prev)} of ${need} so far`, 200, y0 + 56, 13, "#5a4652", "center", "700"), plainText("Best places to gain stars:", 200, y0 + 80, 13, "#7a6a76", "center", "600"), rows.length || plainText("Every level is at 3 stars!", 200, y0 + 108, 13, "#5a4652", "center", "600"), rows.forEach((r, k) => plainFit(r.cleared ? `L${r.n}: ${r.stars} star${r.stars === 1 ? "" : "s"} - a ${r.stars + 1}${r.stars === 0 ? "st" : r.stars === 1 ? "nd" : "rd"} star here adds +1` : `L${r.n}: not won yet - win it first`, 200, y0 + 108 + k * 26, w - 40, 13, "#3d2a36", "center", "600")), drawButton(x0 + 84, y0 + h - 62, w - 168, 46, "OK", "#9fe0b5", { size: 20 }), button("starCardOk", x0 + 80, y0 + h - 66, w - 160, 54, () => {
    S.starCard = null, sfx("tap");
  });
}
function zeroBonusAlert(bt) {
  S.prepAlert = { msg: `0 ${BONUSES[bt].name}s left! In battle you can buy one for ${ECONOMY.diamonds.boosterPriceStart} diamonds (you have ${S.save.diamonds || 0}).`, t: 2.6, bonus: bt };
}
function wrapLines(str, maxW, size) {
  ctx.font = `bold ${size}px ${FONT}`;
  let out = [], line = "";
  for (let w of str.split(" ")) {
    let test = line ? line + " " + w : w;
    ctx.measureText(test).width > maxW && line ? (out.push(line), line = w) : line = test;
  }
  return line && out.push(line), out;
}
function mapBg(b) {
  let key = b.mapId + pxRatio;
  return S.bgCache[key] || (S.bgCache[key] = renderMapBackground(b.routes, b.map.theme, MAP_W, MAP_H, pxRatio, b.props, b.map.art)), S.bgCache[key];
}
function renderGuide(b) {
  if (S.guide.step === 1 && b.towers.length > 0 && (S.guide.step = 2), S.guide.step === 2 && b.nextWave > 0) {
    guideDone();
    return;
  }
  let y0 = TRAY_Y, bub = { x: 100, y: MAP_Y + 8, w: 288 };
  S.guide.step === 1 ? (onboardSpot({ x: 12, y: y0 + TRAY.cardY, w: 88, h: TRAY.cardH, r: 14 }, "guideCard", () => {
    S.sel = { kind: "card", i: 0 }, S.info = null, sfx("tap");
  }, "Drag a card to a blue spot", bub, 0.34), button("guideDrag", 9, y0 + 2, 94, TRAY.cardH + 8, () => {
    S.sel = { kind: "card", i: 0 }, S.info = null, sfx("tap");
  }, { onDown: (p) => {
    S.drag = { i: 0, x: p.x, y: p.y, moved: !1 };
  } }), button("map", 0, MAP_Y, MAP_W, MAP_H, mapTap)) : onboardSpot({ x: 296, y: y0 + TRAY.waveY, w: 92, h: TRAY.waveH, r: 14 }, "wave", () => {
    b.callWaveEarly() > 0 && sfx("return"), guideDone();
  }, "Start the wave!", bub), drawButton(12, MAP_Y + 8, 80, 44, "Skip", "#fff3e6", { size: 16, r: 18 }), button("guideSkip", 8, MAP_Y + 6, 88, 48, () => {
    guideDone(), sfx("tap");
  });
}
var MOTE_COL = ["#c9a074", "#ffffff", "#b9d99a", "#ffffff", "#eef7f7", "#fff4e0"], MOTE_N = 12;
function drawMotes(b, t) {
  if (reducedMotion() || (S.renderMs || 0) >= 10 || S.speed >= 4) return;
  let w = Math.min(5, worldOf(b.levelIndex) - 1), up = w === 3 ? -1 : 1;
  ctx.save(), ctx.fillStyle = MOTE_COL[w], ctx.globalAlpha = 0.3;
  for (let i = 0; i < MOTE_N; i++) {
    let sp = 3 + i % 4 * 1.5, x = ((i * 83.7 + t * (2 + i % 3)) % MAP_W + MAP_W) % MAP_W + Math.sin(t * 0.5 + i) * 6, y = MAP_Y + ((i * 131.3 + t * sp * up) % MAP_H + MAP_H) % MAP_H;
    ctx.beginPath(), ctx.arc(x, y, 1.3 + i % 3 * 0.5, 0, 7), ctx.fill();
  }
  ctx.restore();
}
function renderBattle(dt) {
  let b = S.battle, t = S.t;
  if (ART81 && !S.queenIntro && isBossLevel(b.levelIndex) && !b.result) {
    let q = b.ants.find((a) => !a.dead && ANTS[a.type].boss);
    q && (S.queenIntro = { t0: S.t, type: q.type }, addUi({ k: "queenPill", type: q.type, life: 2, max: 2 }), sfx("boss"), haptic("medium"));
  }
  if (ctx.save(), S.queenIntro && !reducedMotion()) {
    let zk = (S.t - S.queenIntro.t0) / 0.8;
    if (zk >= 0 && zk < 1) {
      let z = 1 + 0.04 * Math.sin(zk * Math.PI), cy = MAP_Y + MAP_H / 2;
      ctx.translate(200, cy), ctx.scale(z, z), ctx.translate(-200, -cy);
    }
  }
  ctx.save(), rr(ctx, -4, MAP_Y - 4, MAP_W + 8, MAP_H + 8, 10), ctx.fillStyle = INK, ctx.fill(), ctx.restore(), ctx.drawImage(mapBg(b), 0, MAP_Y, MAP_W, MAP_H), drawTableLip(), ART81 && drawMotes(b, t), ctx.save(), ctx.beginPath(), ctx.rect(0, MAP_Y, MAP_W, MAP_H), ctx.clip(), ctx.translate(0, MAP_Y);
  let p1 = b.path.pts[b.path.pts.length - 1], nests = [];
  for (let rt of b.routes) {
    let q = rt.pts[0];
    nests.some((n) => Math.hypot(n.x - q.x, n.y - q.y) < 5) || nests.push(q);
  }
  for (let q of nests) drawNest(ctx, Math.max(30, Math.min(MAP_W - 30, q.x)), Math.max(26, Math.min(MAP_H - 20, q.y + 6)), t);
  let selCard = S.drag ? S.drag.i : S.sel && S.sel.kind === "card" ? S.sel.i : S.guide && S.guide.step === 1 ? 0 : null;
  if (selCard != null) {
    let card = b.picks[selCard];
    for (let c = 0; c < GRID_COLS; c++) for (let r = 0; r < GRID_ROWS; r++) {
      let chk = b.canPlay(selCard, c, r);
      if (chk.ok && (chk.upgrade ? (ctx.beginPath(), ctx.arc((c + 0.5) * TILE, (r + 0.5) * TILE, 19 + Math.sin(t * 6) * 2, 0, 7), ctx.lineWidth = 3, ctx.strokeStyle = "#ffd45e", ctx.stroke()) : (rr(ctx, c * TILE + 4, r * TILE + 4, TILE - 8, TILE - 8, 8), ctx.fillStyle = TOWERS[card].place === "path" ? "rgba(255,200,90,0.28)" : "rgba(120,220,150,0.25)", ctx.fill()), ART81 && !chk.upgrade)) {
        let pa = reducedMotion() ? 0.38 : 0.25 + 0.25 * (0.5 + 0.5 * Math.sin(t * Math.PI * 2));
        rr(ctx, c * TILE + 4, r * TILE + 4, TILE - 8, TILE - 8, 8), ctx.lineWidth = 2, ctx.strokeStyle = `rgba(255,255,255,${pa})`, ctx.stroke();
      }
    }
  }
  if (S.mode) {
    let m = S.mode;
    if (m.kind === "move")
      for (let c = 0; c < GRID_COLS; c++) for (let r = 0; r < GRID_ROWS; r++) b.canMoveTower(m.tower, c, r) && (rr(ctx, c * TILE + 4, r * TILE + 4, TILE - 8, TILE - 8, 8), ctx.fillStyle = "rgba(127,211,255,0.33)", ctx.fill());
    else for (let o of b.towers) o !== m.tower && b.canSwapTowers(m.tower, o) && (ctx.beginPath(), ctx.arc(o.x, o.y, 19 + Math.sin(t * 6) * 2, 0, 7), ctx.lineWidth = 3, ctx.strokeStyle = "#c9b6f2", ctx.stroke());
    ctx.beginPath(), ctx.arc(m.tower.x, m.tower.y, 21 + Math.sin(t * 8) * 1.5, 0, 7), ctx.lineWidth = 3.5, ctx.strokeStyle = "#7fd3ff", ctx.stroke();
  }
  for (let tw of b.towers) {
    let tx = tw.c * TILE, ty = tw.r * TILE;
    (tw.type === "glue" || tw.type === "pheromone") && (rr(ctx, tx + 1, ty + 1, TILE - 2, TILE - 2, 6), ctx.fillStyle = tw.type === "glue" ? "rgba(255,240,170,0.35)" : `rgba(255,170,210,${0.18 + Math.sin(t * 3) * 0.06})`, ctx.fill()), tw.type === "lava" && (rr(ctx, tx + 1, ty + 1, TILE - 2, TILE - 2, 6), ctx.fillStyle = `rgba(255,120,50,${0.26 + Math.sin(t * 3) * 0.06})`, ctx.fill());
  }
  drawFanAreas(b);
  for (let c of b.clouds) {
    let f = c.left / c.total;
    ctx.save(), ctx.globalAlpha = Math.min(1, f * 2) * 0.55;
    for (let k = 0; k < 5; k++) {
      let a = k * 1.3 + t * 0.6;
      ctx.beginPath(), ctx.arc(c.x + Math.cos(a) * c.r * 0.45, c.y + Math.sin(a) * c.r * 0.3, c.r * 0.55, 0, 7), ctx.fillStyle = k % 2 ? "#b8eda0" : "#d4f7c4", ctx.fill();
    }
    ctx.restore();
  }
  if (b.decoy) {
    sugarCube(ctx, b.decoy.x, b.decoy.y - 6, 11);
    for (let k = 0; k < 3; k++) starShape(ctx, b.decoy.x + Math.cos(t * 3 + k * 2) * 18, b.decoy.y - 14 + Math.sin(t * 3 + k * 2) * 8, 3, "#fff7a8", 1);
  }
  let drawList = [];
  for (let tw of b.towers) drawList.push({ y: tw.y + (TOWERS[tw.type].place === "path" ? -12 : 0), f: () => drawTowerObj(tw) });
  for (let a of b.ants) a.flying || drawList.push({ y: a.y, f: () => drawAntObj(a) });
  for (let q of S.swatQ) q.ghost && drawList.push({ y: q.y, f: () => drawAntObj(q.ghost, !0) });
  for (let m of b.balls) drawList.push({ y: m.y, f: () => marble(ctx, m.x, m.y - m.r * 0.6, m.r, m.rot) });
  drawList.push({ y: p1.y + 10, f: () => drawTreat(ctx, treatKind(b), p1.x, p1.y, b.foodStored / b.cfg.foodHP, t, { ouch: S.cookieOuch > S.t, react: reaction(S.treat, S.t) }) }), b.cfg.swatter && b.cfg.swatter.on && drawList.push({ y: p1.y + 14, f: () => drawGuard(b, p1) }), drawList.sort((u, v) => u.y - v.y);
  for (let d of drawList) d.f();
  for (let a of b.ants) a.flying && drawAntObj(a);
  for (let pl of b.planes || [])
    if (!(pl.d < -60 || pl.d > b.routes[pl.ri].length + 50)) {
      for (let k = 0; k < 2; k++) addFx({ k: "dust", x: pl.x + (Math.random() - 0.5) * 30, y: pl.y + (Math.random() - 0.5) * 16, life: 0.8, max: 0.8 });
      ctx.save(), ctx.translate(pl.x, pl.y - 30 + Math.sin(t * 6) * 2), ctx.scale(pl.dx > 0.1 ? -1.6 : 1.6, 1.6), drawBonusIcon(ctx, "plane", t), ctx.restore();
    }
  if (drawPieces(b), renderFx(dt), (t < 0 || b.time < b.freezeUntil) && (ctx.fillStyle = "rgba(190,235,255,0.22)", ctx.fillRect(0, 0, MAP_W, MAP_H)), S.drag && S.drag.moved) {
    let tt = dragTile(S.drag);
    if (tt) {
      let card = b.picks[S.drag.i], chk = b.canPlay(S.drag.i, tt.c, tt.r), gx = (tt.c + 0.5) * TILE, gy = (tt.r + 0.5) * TILE, T = TOWERS[card], rng = towerStat(card, "range", 1, S.save.cards[card].level), ghostTw = null;
      chk.ok && !chk.upgrade && T.directional && (ghostTw = b.addTower(card, tt.c, tt.r), b.towers.pop()), T.place === "path" ? tileArea(tt.c, tt.r, chk.ok) : rng && !T.nearTrail && (ctx.beginPath(), ctx.arc(gx, gy, rng, 0, 7), ctx.fillStyle = chk.ok ? "rgba(255,255,255,0.25)" : "rgba(255,120,120,0.2)", ctx.fill(), ctx.lineWidth = 2, ctx.strokeStyle = chk.ok ? "rgba(255,255,255,0.9)" : "rgba(255,90,90,0.8)", ctx.setLineDash([6, 5]), ctx.stroke(), ctx.setLineDash([])), ghostTw && drawAim(ghostTw), ctx.save(), ctx.globalAlpha = 0.75, ctx.translate(gx, gy), drawTower(ctx, card, t, ghostTw), ctx.restore();
    }
  }
  if (S.info && S.info.tower) {
    let tw = S.info.tower, T = TOWERS[tw.type], rng = tw.stat("range");
    T.place === "path" ? tileArea(tw.c, tw.r, !0) : rng && !T.nearTrail && (ctx.beginPath(), ctx.arc(tw.x, tw.y, rng, 0, 7), ctx.fillStyle = "rgba(255,255,255,0.2)", ctx.fill(), ctx.lineWidth = 2.5, ctx.strokeStyle = "#fff", ctx.setLineDash([6, 5]), ctx.stroke(), ctx.setLineDash([])), T.directional && drawAim(tw), ctx.beginPath(), ctx.arc(tw.x, tw.y, 21, 0, 7), ctx.lineWidth = 3, ctx.strokeStyle = "#ffe36e", ctx.stroke();
  }
  if (drawWaveStrip(b), ctx.restore(), ctx.restore(), button("map", 0, MAP_Y, MAP_W, MAP_H, mapTap), S.info && S.info.tower && renderTowerInfo(b, S.info), S.mode && !S.result) {
    let m = S.mode;
    panel(30, MAP_Y + 6, 340, 34, "#5a4058", 16), plainFit(m.kind === "move" ? `Tap a free blue spot to move it (${ECONOMY.diamonds.moveTower} diamond)` : "Tap the tower to swap with (free)", 182, MAP_Y + 23, 280, 12.5, "#ffffff", "center", "700"), blob(ctx, 350, MAP_Y + 23, 11, 11, "#ffb3b3", 1.8), text(ctx, "x", 350, MAP_Y + 22.5, 12, "#fff"), button("modeCancel", 300, MAP_Y + 2, 74, 42, () => {
      S.mode = null;
    });
  }
  if (renderHud(b), renderTray(b), S.guide && !S.paused && !S.result && renderGuide(b), S.specialBanner) {
    let sb = S.specialBanner, k = S.t - sb.t0;
    if (S.t >= sb.until) S.specialBanner = null;
    else {
      let a = Math.min(1, k / 0.25, (sb.until - S.t) / 0.3);
      ctx.save(), ctx.globalAlpha = Math.max(0, a);
      let by = 112 + (1 - Math.min(1, k / 0.25)) * -14;
      panel(30, by, 340, 58, "#5a4058", 16);
      let pulse = reducedMotion() ? 0.8 : 0.65 + 0.25 * Math.sin(k * 8);
      ctx.beginPath(), ctx.arc(64, by + 29, 22, 0, 7), ctx.fillStyle = `rgba(255,210,74,${pulse})`, ctx.fill(), ctx.save(), ctx.translate(64, by + 33), ctx.scale(0.5, 0.5), drawTower(ctx, sb.ids[0], S.t, null), ctx.restore();
      let T0 = TOWERS[sb.ids[0]];
      plainText("Picnic power!", 96, by + 19, 14, "#ffe39a", "left", "800"), plainFit(sb.ids.length === 1 ? `Your ${T0.name} learned ${T0.special.name}` : `${sb.ids.length} of your towers learned specials`, 96, by + 40, 266, 12, "#ffffff", "left", "600"), ctx.restore();
    }
  }
  renderUiFx(dt), S.paused && !S.result && renderPause(), S.result && renderResult(dt), S.queenDown && S.t - S.queenDown.t < 4.5 && drawQueenCheer(S.t - S.queenDown.t, S.queenDown.world), S.dialog && !S.paused && !S.result && renderDialog();
}
function tileArea(c, r, ok = !0) {
  ctx.save(), rr(ctx, c * TILE + 1.5, r * TILE + 1.5, TILE - 3, TILE - 3, 6), ctx.fillStyle = ok ? "rgba(255,255,255,0.25)" : "rgba(255,120,120,0.2)", ctx.fill(), ctx.lineWidth = 2.2, ctx.strokeStyle = ok ? "rgba(255,255,255,0.95)" : "rgba(255,90,90,0.8)", ctx.setLineDash([5, 4]), ctx.stroke(), ctx.restore();
}
function drawAim(tw) {
  if (tw.type === "tractor") {
    tw.trailDir && tileArea(tw.trailDir.nc, tw.trailDir.nr, !0);
    return;
  }
  if (tw.type !== "ball" || !tw.trailDir) return;
  let dx = tw.ax, dy = tw.ay, t = S.t;
  ctx.save();
  let len = Math.max(tw.runLen, 4), ex = tw.lx + dx * len, ey = tw.ly + dy * len;
  ctx.lineCap = "round", ctx.setLineDash([3, 7]), ctx.lineDashOffset = -t * 30, ctx.lineWidth = 5, ctx.strokeStyle = "rgba(120,200,255,0.9)", ctx.beginPath(), ctx.moveTo(tw.lx, tw.ly), ctx.lineTo(ex, ey), ctx.stroke(), ctx.setLineDash([]), starShape(ctx, ex, ey, 5.5, "rgba(255,255,255,0.95)", 1.4), ctx.restore();
}
function drawFanAreas(b) {
  for (let tw of b.towers) {
    if (tw.type !== "fan") continue;
    let R = tw.stat("range"), k = Math.max(0, tw.fireFx || 0);
    ctx.beginPath(), ctx.arc(tw.x, tw.y, R, 0, 7), ctx.fillStyle = `rgba(168,230,224,${0.1 + k * 0.12})`, ctx.fill(), ctx.lineWidth = 2, ctx.strokeStyle = `rgba(120,200,190,${0.45 + k * 0.4})`, ctx.stroke();
  }
}
var INFO_INK = "#3d2a36", INFO_SOFT = "#6b5562";
function plainFit(str, x, y, maxW, size, col, align = "left", weight = "500") {
  plainText(str, x, y, fitSize(str, maxW, size, weight), col, align, weight);
}
function plainWrap(str, maxW, size, weight = "500") {
  ctx.font = `${weight} ${size}px ${FONT}`;
  let out = [], line = "";
  for (let w of str.split(" ")) {
    let test = line ? line + " " + w : w;
    ctx.measureText(test).width > maxW && line ? (out.push(line), line = w) : line = test;
  }
  return line && out.push(line), out;
}
function dmgGainText(type, lvl, cardLevel) {
  let g = upgradeGain(type, lvl, cardLevel);
  if (!(g > 1.01)) return "";
  let r = Math.round(g * 10) / 10;
  return `x${Number.isInteger(r) ? r : r.toFixed(1)} dmg`;
}
function levelHasFlyers(i) {
  return levelAntTypes(i).some((t) => ANTS[t].flying || ANTS[t].spawn && ANTS[t].spawn.type && ANTS[ANTS[t].spawn.type] && ANTS[ANTS[t].spawn.type].flying);
}
var diffText = (type, d) => `${d.label} ${formatStat(type, d.key, d.from)} \u2192 ${formatStat(type, d.key, d.to)}`;
function rollHere(tw) {
  return tw.trailDir ? `${tw.trailDir.run} tile${tw.trailDir.run > 1 ? "s" : ""}` : "no roll";
}
function drawModeIcon(m, x, y, k) {
  if (ctx.save(), ctx.translate(x, y), ctx.scale(k, k), m === "carrier") crumbIcon(ctx, 0, 0, 1, !0);
  else if (m === "healer")
    ctx.beginPath(), ctx.arc(0, 0, 7.2, 0, 7), ctx.fillStyle = "#fffaf5", ctx.fill(), ctx.lineWidth = 1.5, ctx.strokeStyle = CRUMB_OUTLINE, ctx.stroke(), ctx.fillStyle = "#e8454f", ctx.fillRect(-1.9, -5, 3.8, 10), ctx.fillRect(-5, -1.9, 10, 3.8);
  else if (m === "strong")
    ctx.beginPath(), ctx.moveTo(-7.5, 5), ctx.lineTo(-8.5, -4.5), ctx.lineTo(-4, -0.8), ctx.lineTo(0, -6), ctx.lineTo(4, -0.8), ctx.lineTo(8.5, -4.5), ctx.lineTo(7.5, 5), ctx.closePath(), ctx.fillStyle = "#ffcf4a", ctx.fill(), ctx.lineWidth = 1.5, ctx.lineJoin = "round", ctx.strokeStyle = CRUMB_OUTLINE, ctx.stroke();
  else {
    ctx.fillStyle = "#7a4a2a", ctx.strokeStyle = CRUMB_OUTLINE, ctx.lineWidth = 1.4;
    for (let [cx, cy, r] of [[-5, 0, 3.4], [0.5, 0, 2.7], [5.5, 0, 3.2]])
      ctx.beginPath(), ctx.arc(cx, cy, r, 0, 7), ctx.fill(), ctx.stroke();
    ctx.strokeStyle = "#7a4a2a", ctx.lineWidth = 1, ctx.beginPath(), ctx.moveTo(-6, 3), ctx.lineTo(-7, 6), ctx.moveTo(0, 3), ctx.lineTo(0, 6), ctx.moveTo(6, 3), ctx.lineTo(7, 6), ctx.stroke();
  }
  ctx.restore();
}
var stripLast = null, stripNoRoom = !1, hudPreviewLast = null, stripX = null, stripAt = 0;
function drawPieces(b) {
  if (!b.pieces.length) return;
  let rm = reducedMotion();
  for (let q of b.pieces) {
    let frac = Math.max(0, q.left / q.total), blink = q.left <= 1 && Math.floor(S.t * 8) % 2 === 0, bounce = rm ? 0 : Math.abs(Math.sin(S.t * 6 + q.id)) * 5;
    ctx.save(), ctx.translate(q.x, q.y), ctx.beginPath(), ctx.ellipse(0, 6, 9, 3, 0, 0, 7), ctx.fillStyle = "rgba(60,40,50,0.25)", ctx.fill();
    let pr = 17 + (rm ? 0 : Math.sin(S.t * 5) * 2.5);
    ctx.beginPath(), ctx.arc(0, -2, pr, 0, 7), ctx.lineWidth = 2, ctx.strokeStyle = "rgba(255,255,255,0.75)", ctx.stroke(), ctx.beginPath(), ctx.arc(0, -2, 14, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * frac), ctx.lineWidth = 3.4, ctx.lineCap = "round", ctx.strokeStyle = blink ? "#ff5a5a" : "#ffd45e", ctx.stroke(), crumbIcon(ctx, 0, -4 - bounce, 1.35, !0), q.bonus >= 0.05 && text(ctx, "+" + fmtFood(q.bonus), 0, -24 - bounce * 0.5, 12, "#fff7c9"), ctx.restore();
  }
}
function drawWaveStrip(b) {
  if (stripLast = null, stripNoRoom = !1, S.info || S.mode || S.drag || S.sel && S.sel.kind === "card") {
    stripX = null;
    return;
  }
  let m = previewModel(b);
  if (!m) {
    stripX = null;
    return;
  }
  let groups = m.groups, more = m.moreAnts, widthOf = (gs, mo) => (ctx.font = `bold 12px ${FONT}`, 12 + gs.reduce((w2, g) => w2 + 18 + 2 + ctx.measureText("x" + g.count).width + 6, 0) + (mo ? ctx.measureText("+" + mo).width + 4 : 0)), label = null, w;
  m.kind === "left" ? (label = `Ants left: ${m.left}`, ctx.font = `bold 12px ${FONT}`, w = ctx.measureText(label).width + 22) : w = widthOf(groups, more);
  let rect = stripRect(b, w);
  if (rect && m.kind === "next") for (; rect.w < w - 0.5 && groups.length > 1; ) {
    let g = groups[groups.length - 1];
    groups = groups.slice(0, -1), more += g.count, w = widthOf(groups, more), rect = stripRect(b, w);
  }
  if (!rect) {
    stripX = null, stripNoRoom = m.kind === "next";
    return;
  }
  stripLast = { rect, kind: m.kind, n: m.n, groups, more, left: m.left };
  let dtS = Math.min(0.1, Math.max(0, S.t - stripAt));
  if (stripAt = S.t, stripX == null || reducedMotion() || Math.abs(stripX - rect.x) < 0.5 ? stripX = rect.x : stripX += (rect.x - stripX) * Math.min(1, dtS / 0.15 * 1), ctx.save(), ctx.translate(stripX, rect.y), rr(ctx, 0, 0, rect.w, STRIP_H, STRIP_H / 2), ctx.fillStyle = "rgba(255,246,238,0.96)", ctx.fill(), ctx.fillStyle = "rgba(120,80,95,0.14)", rr(ctx, 7, STRIP_H - 5, rect.w - 14, 2, 1), ctx.fill(), rr(ctx, 0, 0, rect.w, STRIP_H, STRIP_H / 2), ctx.lineWidth = 2.5, ctx.strokeStyle = INK, ctx.stroke(), label) text(ctx, label, rect.w / 2, STRIP_H / 2 + 0.5, 12, "#c0392b", "center", null);
  else {
    let x = 8;
    for (let g of groups)
      x = drawStripGroup(g, x, STRIP_H / 2, 18, 9);
    more && text(ctx, "+" + more, x - 2, STRIP_H / 2 + 0.5, 12, "#8a7080", "left", null);
  }
  ctx.restore();
}
function drawStripGroup(g, x, cy, d, rad) {
  let spr = antSprite(g.type, 0, !1, pxRatio), k = ANTS[g.type].size, cx = x + rad;
  ctx.save(), ctx.beginPath(), ctx.arc(cx, cy, rad, 0, 7), ctx.clip();
  let sw = 44 * k, sh = 40 * k;
  return ctx.drawImage(spr.cv, (spr.ox - 24 * k) * pxRatio, (spr.oy - 28 * k) * pxRatio, sw * pxRatio, sh * pxRatio, cx - rad, cy - rad, d, d), ctx.restore(), isTank(g.type) && (ctx.beginPath(), ctx.arc(cx, cy, rad, 0, 7), ctx.lineWidth = 1.8, ctx.strokeStyle = "#c0392b", ctx.stroke()), isFlyer(g.type) && (ctx.beginPath(), ctx.ellipse(cx + rad * 0.78, cy - rad * 0.9, rad * 0.55, rad * 0.27, -0.5, 0, 7), ctx.fillStyle = "rgba(205,235,255,0.95)", ctx.fill(), ctx.lineWidth = 1, ctx.strokeStyle = INK, ctx.stroke()), text(ctx, "x" + g.count, x + d + 2, cy + 0.5, 12, INK, "left", null), ctx.font = `bold 12px ${FONT}`, x + d + 2 + ctx.measureText("x" + g.count).width + 6;
}
function drawHudPreview(b) {
  let m = previewModel(b);
  if (!m || m.kind !== "next") return !1;
  let gs = m.groups.slice(0, 3), more = m.moreAnts + m.groups.slice(3).reduce((a, g) => a + g.count, 0), wOf = (arr, mo) => (ctx.font = `bold 12px ${FONT}`, arr.reduce((t, g) => t + 16 + 2 + ctx.measureText("x" + g.count).width + 5, -5) + (mo ? 5 + ctx.measureText("+" + mo).width : 0)), use = gs.slice();
  for (; use.length > 1 && wOf(use, more) > 72; )
    more += use.pop().count;
  let wd = wOf(use, more), x = 184 - wd / 2;
  for (let g of use) x = drawStripGroup(g, x, 46, 16, 8) - 1;
  return more && text(ctx, "+" + more, x - 4, 46.5, 12, "#8a7080", "left", null), hudPreviewLast = { groups: use, more, w: wd }, !0;
}
function renderTowerInfo(b, info) {
  let tw = info.tower, T = TOWERS[tw.type];
  if (info.until && S.t > info.until) {
    if (info.auto) {
      S.info = null;
      return;
    }
    info.changed = null;
  }
  let modes = hasTargetModes(tw.type), H2 = modes ? 176 : 140, py = tw.y + MAP_Y > 300 ? MAP_Y + 8 : MAP_Y + MAP_H - H2 - 8;
  S.layoutInfo = { x: 14, y: py, w: 372, h: H2 }, panel(14, py, 372, H2, "#fffaf5", 14);
  let lvStr = `Lv ${tw.lvl}/${b.cfg.maxInBattleLevel} \xB7 card L${tw.cardLevel}`;
  ctx.font = `600 12px ${FONT}`;
  let lvW = ctx.measureText(lvStr).width, titleMax = Math.min(150, 222 - lvW - 8);
  ctx.font = `bold 15px ${FONT}`;
  let tW = Math.min(titleMax, ctx.measureText(T.name).width);
  fitText(T.name, 26 + tW / 2, py + 17, titleMax, 15, "#ff8fab"), plainText(lvStr, 34 + tW, py + 17, 12, INFO_SOFT, "left", "600");
  let desc = T.ability || T.desc;
  modes && tw.mode && TARGET_MODE_TEXT[tw.type] && TARGET_MODE_TEXT[tw.type][tw.mode] && (desc = TARGET_MODE_TEXT[tw.type][tw.mode]), T.directional && !tw.trailDir && (desc = tw.type === "ball" ? "No trail right next to it - the marble cannot roll here. Move it!" : tw.type === "tractor" ? "No trail right next to it - nothing to scoop here. Move it!" : "No trail right next to it - no wind here. Move it!"), plainWrap(desc, 346, 12.5).slice(0, 2).forEach((l, i) => plainText(l, 26, py + 38 + i * 16, 12.5, T.directional && !tw.trailDir ? "#c0392b" : INFO_INK));
  let keys = tw.type === "tractor" ? ["liftSize", "rate", "scoop"] : ["power", "rate", tw.type === "ball" ? "roll" : "range"], changed = new Set((info.changed || []).map((d) => d.key));
  keys.forEach((k, i) => {
    let x = 22 + i * 120, y = py + 66, w = 114, h = 38, on = changed.has(k);
    rr(ctx, x, y, w, h, 10), ctx.fillStyle = on ? "#e2f8dc" : "#f7efeb", ctx.fill(), ctx.lineWidth = on ? 2.4 : 1.2, ctx.strokeStyle = on ? "#55b85a" : "#e0cfd4", ctx.stroke(), plainFit(k === "roll" ? "Roll here" : k === "scoop" ? "Scoop" : statLabel(tw.type, k), x + 8, y + 11, w - 14, 12, INFO_SOFT);
    let d = (info.changed || []).find((q) => q.key === k), val = k === "roll" ? rollHere(tw) : k === "scoop" ? tw.trailDir ? "trail tile beside it" : "no trail" : d ? `${formatStat(tw.type, k, d.from)} \u2192 ${formatStat(tw.type, k, d.to)}` : formatStat(tw.type, k, tw.stat(k));
    plainFit(val, x + w / 2, y + 27, w - 12, 14, on ? "#2f8a36" : INFO_INK, "center", "600");
  });
  let extra = (info.changed || []).filter((d) => !keys.includes(d.key)), line;
  extra.length ? line = "Upgraded: " + extra.map((d) => diffText(tw.type, d)).join(", ") : tw.lvl < b.cfg.maxInBattleLevel ? line = (dmgGainText(tw.type, tw.lvl + 1, tw.cardLevel) ? dmgGainText(tw.type, tw.lvl + 1, tw.cardLevel) + "! " : "") + "Next (drop same card): " + upgradeDiff(tw.type, tw.lvl, tw.cardLevel).map((d) => diffText(tw.type, d)).join(", ") : line = "Max level!";
  {
    let ls = plainWrap(line, 350, 12).slice(0, 2), y0 = py + (modes ? 160 : 122) - (ls.length > 1 ? 8 : 0);
    ls.forEach((l, i) => plainText(l, 200, y0 + i * 15, 12, extra.length ? "#2f8a36" : INFO_INK, "center"));
  }
  if (button("infoClose", 14, py, 372, H2, () => {
    S.info = null;
  }), modes) {
    let ML = S.battle.modeList, n4 = ML.length > 3;
    ML.forEach((m, i) => {
      let w = n4 ? 84 : 114, h = 34, x = 22 + i * (w + 6), y = py + 108, on = (tw.mode || "weak") === m, age = S.t - (tw._modeAt ?? -9), pop = on && age >= 0 && age < 0.12 && !reducedMotion() ? 1 + 0.08 * Math.sin(age / 0.12 * Math.PI) : 1;
      ctx.save(), pop !== 1 && (ctx.translate(x + w / 2, y + h / 2), ctx.scale(pop, pop), ctx.translate(-(x + w / 2), -(y + h / 2))), rr(ctx, x, y, w, h, 11), ctx.fillStyle = on ? "#ffd27a" : "#f7efeb", ctx.fill(), ctx.lineWidth = on ? 2.6 : 1.5, ctx.strokeStyle = on ? INK : "#d9c5cc", ctx.stroke(), drawModeIcon(m, x + (n4 ? 14 : 18), y + h / 2, 1), plainFit(MODE_NAME[m], x + (n4 ? 28 : 34), y + h / 2 + 0.5, w - (n4 ? 32 : 40), 13, on ? INK : INFO_INK, "left", on ? "700" : "600"), ctx.restore(), button("mode_" + m, x - 2, y - 5.5, w + 4, h + 11, () => setMode(tw, m));
    });
  }
  let canMove = (S.save.diamonds || 0) >= ECONOMY.diamonds.moveTower;
  drawButton(256, py + 5, 62, 24, "", "#9fd8ff", { r: 10, disabled: !canMove }), text(ctx, "Move", 280, py + 17, 12), diamondIcon(ctx, 305, py + 17, 0.55), text(ctx, String(ECONOMY.diamonds.moveTower), 312, py + 17.5, 12), drawButton(322, py + 5, 58, 24, "Swap", "#fff3e6", { r: 10, size: 12, disabled: b.towers.length < 2 }), button("infoMove", 252, py - 2, 68, 44, () => startMode("move", tw)), button("infoSwap", 320, py - 2, 64, 44, () => startMode("swap", tw));
}
function drawQueenCheer(age, world) {
  let k = Math.min(1, age / 0.35), fade = age > 3.8 ? Math.max(0, 1 - (age - 3.8) / 0.7) : 1, msg = world === 6 ? ["Way to go,", "you saved the pancakes!"] : world === 5 ? ["Way to go,", "you saved the donut!"] : world === 4 ? ["Way to go,", "you saved the sundae!"] : world === 3 ? ["Way to go,", "you saved the pie!"] : world === 2 ? ["Way to go,", "you saved the cake!"] : ["Way to go,", "you saved the cookies!"];
  ctx.save(), ctx.globalAlpha = fade, ctx.translate(200, MAP_Y + 210);
  let sc = 0.6 + 0.4 * k + Math.sin(age * 5) * 0.03;
  ctx.scale(sc, sc), rr(ctx, -170, -48, 340, 96, 24), ctx.fillStyle = "rgba(90,64,88,0.82)", ctx.fill(), ctx.lineWidth = 3, ctx.strokeStyle = "#ffd45e", ctx.stroke(), text(ctx, msg[0], 0, -18, 26, "#ffe36e"), text(ctx, msg[1], 0, 16, 24, "#ffffff");
  for (let [ax, ty, sg] of [[-146, "worker", 1], [146, "small", -1]]) {
    let sp = antSprite(ty, 0, !1, pxRatio * 1.2, "cheer"), hop = reducedMotion() ? 0 : Math.abs(Math.sin(age * 6 + (sg > 0 ? 0 : 1.3))) * 6;
    ctx.save(), ctx.translate(ax, -34 - hop), ctx.scale(1.2 * sg, 1.2), ctx.drawImage(sp.cv, -sp.ox, -sp.oy, sp.w, sp.h), ctx.restore();
  }
  ctx.restore();
}
var MIN_FONT = 12;
function fitSize(str, maxW, size, weight) {
  ctx.font = `${weight} ${size}px ${FONT}`;
  let w = ctx.measureText(str).width;
  if (w <= maxW) return size;
  let s = size * maxW / w;
  return Math.max(MIN_FONT, s);
}
function fitText(str, x, y, maxW, size, col) {
  text(ctx, str, x, y, fitSize(str, maxW, size, "bold"), col);
}
function drawTowerObj(tw) {
  ctx.save(), ctx.translate(tw.x, tw.y);
  let age = S.battle.time - (tw.born ?? (tw.born = S.battle.time));
  if (ART81) {
    if (age < 0.18) {
      let k = age / 0.18, sc = k < 0.6 ? 0.6 + 0.52 * (k / 0.6) : 1.12 - 0.12 * ((k - 0.6) / 0.4);
      ctx.scale(sc, sc);
    }
  } else if (!reducedMotion()) {
    if (age < 0.26) {
      let k = age / 0.26, a = k < 0.4 ? k / 0.4 : (k - 0.4) / 0.6, sx = k < 0.4 ? 1.22 + (0.95 - 1.22) * a : 0.95 + 0.05 * a, sy = k < 0.4 ? 0.78 + (1.06 - 0.78) * a : 1.06 - 0.06 * a;
      ctx.scale(sx, sy);
    }
  }
  TOWERS[tw.type].place === "path" && ctx.translate(tw.px - tw.x, tw.py - tw.y);
  let uk = tw._upAt !== void 0 ? (S.t - tw._upAt) / 0.22 : 2;
  if (MOTION.hop = uk >= 0 && uk < 1 ? 6 * Math.sin(uk * Math.PI) : 0, ART81 && S.battle && S.battle.specialsOn && specialActive(tw, S.battle.level)) {
    let pa = reducedMotion() ? 0.8 : 0.75 + 0.15 * Math.sin(S.t * Math.PI * 2);
    ctx.save(), ctx.beginPath(), ctx.ellipse(0, 11, 21, 8.5, 0, 0, 7), ctx.lineWidth = 4, ctx.strokeStyle = "rgba(82,60,75," + pa + ")", ctx.stroke(), ctx.lineWidth = 2, ctx.strokeStyle = `rgba(255,210,74,${pa})`, ctx.stroke(), ctx.restore();
  }
  if (MOTION.bobTowers = !0, drawTower(ctx, tw.type, S.t + tw.id, tw), MOTION.bobTowers = !1, MOTION.hop = 0, tw.mode && tw.mode !== "weak") {
    let bage = S.t - (tw._modeAt ?? -9), bp = bage >= 0 && bage < 0.5 && !reducedMotion() ? 1 + 0.35 * Math.sin(Math.min(1, bage / 0.5) * Math.PI) : 1;
    ctx.save(), ctx.translate(14, 13), ctx.scale(bp, bp), ctx.beginPath(), ctx.arc(0, 0, 8, 0, 7), ctx.fillStyle = "#fffaf5", ctx.fill(), ctx.lineWidth = 2, ctx.strokeStyle = INK, ctx.stroke(), drawModeIcon(tw.mode, 0, 0, 0.55), ctx.restore();
  }
  if (tw.lvl > 1) for (let k = 0; k < tw.lvl; k++) {
    let ps = 1;
    if (ART81 && k === tw.lvl - 1 && tw._upAt !== void 0 && !reducedMotion()) {
      let pk = (S.t - tw._upAt - 0.22) / 0.16;
      pk >= 0 && pk < 1 ? ps = Math.max(0.01, easeOutBack(pk)) : pk < 0 && (ps = 0.01);
    }
    starShape(ctx, -(tw.lvl - 1) * 3.6 + k * 7.2, 16, 3.6 * ps, "#ffd45e", 1.1);
  }
  ctx.restore();
}
function drawGuard(b, ck) {
  let px = ck.x + UI.swatPivot.dx, py = ck.y + UI.swatPivot.dy, rest = -0.2, ang = rest + Math.sin(S.t * 1.7) * 0.025, flash = 0, age = 0.5 - (b.swatFx || 0);
  if ((b.swatFx || 0) > 0 && b.swatTarget) {
    let sg = b.swatTarget.x < px ? -1 : 1, ease = (k) => Math.max(0, Math.min(1, k));
    if (reducedMotion())
      flash = Math.max(0, 1 - age / 0.15);
    else if (age < 0.1) ang = rest + (-sg * 0.4 - rest) * (1 - Math.pow(1 - ease(age / 0.1), 2));
    else if (age < 0.18) {
      let k = ease((age - 0.1) / 0.08);
      ang = -sg * 0.4 + (sg * 0.62 + sg * 0.4) * k * k, flash = k > 0.8 ? 1 : 0;
    } else if (age < 0.24) ang = sg * 0.62;
    else {
      let k = ease((age - 0.24) / 0.26);
      ang = sg * 0.62 + (rest - sg * 0.62) * (1 - Math.pow(1 - k, 3));
    }
  }
  drawSwatter(ctx, px, py, ang, 0.8, flash);
}
function drawNurseHud(a, H2, x, y, frozen) {
  let b = S.battle, R = H2.radius * TILE, sz = a.size || 1;
  if (a.healCd > 0 || frozen) {
    let k = 1 - Math.max(0, a.healCd) / H2.every, cy = y + 13 * sz, rad = 7.5;
    ctx.save(), ctx.lineWidth = 3.4, ctx.strokeStyle = INK, ctx.beginPath(), ctx.arc(x, cy, rad, 0, 7), ctx.stroke(), ctx.lineWidth = 1.8, ctx.strokeStyle = "rgba(255,255,255,0.45)", ctx.beginPath(), ctx.arc(x, cy, rad, 0, 7), ctx.stroke(), ctx.strokeStyle = frozen ? "#9fb2c8" : "#ff8fb0", ctx.lineCap = "round", ctx.beginPath(), ctx.arc(x, cy, rad, -Math.PI / 2, -Math.PI / 2 + k * Math.PI * 2), ctx.stroke(), frozen && (ctx.fillStyle = INK, ctx.fillRect(x - 3, cy - 3, 2.2, 6), ctx.fillRect(x + 0.8, cy - 3, 2.2, 6)), ctx.restore();
    return;
  }
  let hurt = !1;
  for (let o of b.ants)
    if (!(o === a || o.dead || o.hp >= o.maxHp - 1e-6 || ANTS[o.type].heal) && Math.hypot(o.x - a.x, o.y - a.y) <= R) {
      hurt = !0;
      break;
    }
  hurt && (ctx.save(), ctx.lineWidth = 2.4, ctx.strokeStyle = "rgba(255,255,255,0.95)", ctx.setLineDash([5, 5]), ctx.lineDashOffset = reducedMotion() ? 0 : -S.t * 14, ctx.beginPath(), ctx.arc(x, y + 2, R, 0, 7), ctx.stroke(), ctx.setLineDash([]), ctx.lineWidth = 1, ctx.strokeStyle = "rgba(255,90,126,0.9)", ctx.beginPath(), ctx.arc(x, y + 2, R - 2.6, 0, 7), ctx.stroke(), ctx.restore());
}
function drawShield(a, x, y) {
  let sz = a.size, f = Math.max(0, Math.min(1, a.shield / a.shieldMax)), rm = reducedMotion(), sh = ANTS[a.type].shield, regen = a.shield < a.shieldMax && a.shieldT >= sh.regenDelay, pulse = !rm && regen ? 0.5 + 0.5 * Math.sin(S.t * Math.PI * 4) : 0, flash = !rm && a._shieldFlash > S.t ? (a._shieldFlash - S.t) / 0.25 : 0;
  if (a.shield > 0) {
    let rx = 17 * sz, ry = 21 * sz, cy = y - 6 * sz;
    ctx.save(), ctx.globalAlpha = 0.55 + 0.4 * f - 0.25 * pulse + 0.3 * flash, ctx.globalAlpha = Math.min(1, ctx.globalAlpha), ctx.beginPath(), ctx.ellipse(x, cy, rx, ry, 0, 0, Math.PI * 2), ctx.lineWidth = 1.5 + 0.5 * flash, ctx.strokeStyle = INK, ctx.stroke(), ctx.beginPath(), ctx.ellipse(x, cy, rx - 1.1, ry - 1.1, 0, 0, Math.PI * 2), ctx.lineWidth = 1, ctx.strokeStyle = "#ffffff", ctx.stroke(), ctx.beginPath(), ctx.ellipse(x, cy, rx - 3, ry - 3, 0, Math.PI * 1.08, Math.PI * 1.42), ctx.lineWidth = 1.6, ctx.strokeStyle = "#ffffff", ctx.stroke(), ctx.restore();
  }
  if (a.shield < a.shieldMax) {
    let w = a.type === "queen5" || a.type === "queen6" ? 60 : 22, hy = y - (a.flying ? 44 : 33) * sz - 4;
    rr(ctx, x - w / 2 - 1, hy - 1, w + 2, 4, 2), ctx.fillStyle = INK, ctx.fill(), f > 0 && (rr(ctx, x - w / 2, hy, Math.max(2, w * f), 2, 1), ctx.fillStyle = pulse > 0.5 ? "#ffffff" : "#a8e4ff", ctx.fill());
  }
}
function drawAntObj(a, ghost = !1) {
  let b = S.battle, frozen = b.time < b.freezeUntil, p = b.route(a).at(a.d);
  Math.abs(p.dx) > 0.3 && (a._face = p.dx * (a.dir || 1) >= 0 ? 1 : -1);
  let face = a._face ?? 1, speedK2 = a.type === "small" ? 2.2 : a.type === "sprinter" ? 2.4 : a.type === "queen" ? 0.6 : a.type === "big" ? 1 : a.type === "heavy" ? 0.9 : 1.5, still = frozen || a.stunT > 0, fr = still ? 0 : Math.floor((b.time + a.id * 0.37) * speedK2 * ANT_FRAMES) % ANT_FRAMES, H2 = ANTS[a.type].heal, mood = !!H2 && (frozen || a.healCd > 0) ? "g" : a.hitFlash > 0.02 && !reducedMotion() ? "h" : a.stunT > 0 ? "d" : "", droneFx = ART81 && a.type === "drone" && !reducedMotion() && !still, spr = antSprite(a.type, droneFx ? Math.floor((b.time + a.id * 0.037) * 14) % 2 ? 3 : 9 : fr, a.carrying > 0, pxRatio, mood), breathe = still ? 1 + Math.sin(S.t * 5 + a.id) * 0.035 : 1, lat = (a.id * 37 % 9 - 4) * 1.2;
  a.state === "back" && (lat = UI.carrierLane + lat * 0.4);
  let x = a.x + p.dy * lat, y = a.y - p.dx * lat, hopY = 0, hopS = 1;
  if (a._hopT && !reducedMotion()) {
    let hk = (S.t - a._hopT) / 0.24;
    hk >= 0 && hk < 1 && (hopY = -Math.sin(hk * Math.PI) * 4, hopS = 1 + 0.1 * Math.sin(hk * Math.PI * 2) * (1 - hk));
  }
  let gsx = 1, gsy = 1;
  if (a._grabT && !reducedMotion()) {
    let gk = (S.t - a._grabT) / 0.08;
    if (gk >= 0 && gk < 1) {
      let q = Math.sin(gk * Math.PI);
      gsx = 1 + 0.12 * q, gsy = 1 - 0.12 * q;
    }
  }
  if (droneFx && (hopY += Math.sin((b.time + a.id * 0.7) * Math.PI * 2 * 1.6) * 2), ctx.save(), ctx.translate(x, y + 4 + hopY), ctx.scale(face / breathe * gsx, breathe * hopS * gsy), ART81) {
    a.hitFlash > 0.05 && !(S.t - (a._sqT ?? -9) < 0.12) && b.ants.length <= 25 && !reducedMotion() && (a._sqT = S.t);
    let sk = (S.t - (a._sqT ?? -9)) / 0.08;
    if (sk >= 0 && sk < 1) {
      let q = (1 - sk) * (1 - sk);
      ctx.scale(1 + 0.08 * q, 1 - 0.12 * q);
    }
  } else if (a.hitFlash > 0 && !reducedMotion()) {
    let q = Math.min(1, a.hitFlash / 0.12), sq = 0.12 * q * q;
    ctx.scale(1 + sq, 1 - sq);
  }
  if (ctx.drawImage(spr.cv, -spr.ox, -spr.oy, spr.w, spr.h), a.hitFlash > 0.04 && (ctx.globalCompositeOperation = "lighter", ctx.globalAlpha = 0.6, ctx.drawImage(spr.cv, -spr.ox, -spr.oy, spr.w, spr.h)), a._healFlash > S.t && !ghost && (ctx.globalCompositeOperation = "lighter", ctx.globalAlpha = reducedMotion() ? 0.35 : 0.55 * Math.min(1, (a._healFlash - S.t) / 0.2), ctx.drawImage(spr.cv, -spr.ox, -spr.oy, spr.w, spr.h)), ctx.restore(), ART81 && a.type === "queen6" && !ghost && !frozen && a.spawnT > 0 && a.spawnT <= 0.4) {
    let q = 1 - a.spawnT / 0.4, dx0 = x - 20 * a.size * face, dy0 = y + 10 + (reducedMotion() ? 8 : q * q * 22), rr2 = 1 + q * 0.7;
    ctx.save(), ctx.beginPath(), ctx.ellipse(dx0, dy0, 4.2 * rr2, 5.6 * rr2, 0, 0, 7), ctx.fillStyle = "#ffe07a", ctx.fill(), ctx.lineWidth = 2, ctx.strokeStyle = INK, ctx.stroke(), ctx.beginPath(), ctx.arc(dx0 - 1.4 * rr2, dy0 - 1.6 * rr2, 1.3 * rr2, 0, 7), ctx.fillStyle = "#fffbe0", ctx.fill(), ctx.restore();
  }
  if (a._bubbleUntil > S.t && !ghost && !reducedMotion()) {
    let bx = x, by = y - 40 * a.size - Math.abs(Math.sin(S.t * 6)) * 2;
    ctx.save(), ctx.beginPath(), ctx.arc(bx, by, 7.5, 0, 7), ctx.fillStyle = "#fffdf0", ctx.fill(), ctx.lineWidth = 2, ctx.strokeStyle = INK, ctx.stroke(), ctx.beginPath(), ctx.moveTo(bx - 2.5, by + 6.5), ctx.lineTo(bx + 1, by + 12), ctx.lineTo(bx + 3, by + 6), ctx.fillStyle = "#fffdf0", ctx.fill(), drawChunkyText(ctx, "!", bx, by + 0.5, 12, { mode: "btn", fill: "#e0524f", outline: 2 }), ctx.restore();
  }
  if (H2 && !ghost && drawNurseHud(a, H2, x, y, frozen), frozen && (ctx.save(), ctx.globalAlpha = 0.55, rr(ctx, x - 17 * a.size, y - 24 * a.size, 34 * a.size, 32 * a.size, 7), ctx.fillStyle = "#d6f3ff", ctx.fill(), ctx.lineWidth = 1.5, ctx.strokeStyle = "#8fd0f5", ctx.stroke(), ctx.restore()), a.slow > 0.01 && !frozen && (ctx.fillStyle = "rgba(255,240,160,0.8)", ctx.beginPath(), ctx.ellipse(x, y + 8, 9 * a.size, 2.5, 0, 0, 7), ctx.fill()), a.stunT > 0 && !frozen && stunStars(ctx, x, y - 30 * a.size, S.t + a.id, a.size), a.charmT > 0 && heart(ctx, x + Math.sin(S.t * 4 + a.id) * 4, y - 32 * a.size - Math.abs(Math.sin(S.t * 3)) * 4, 3, "#ff8fbf"), a.shieldMax > 0 && !ghost && drawShield(a, x, y), a.hp < a.maxHp && !ghost) {
    let w = a.type === "queen" || a.type === "queen3" || a.type === "queen4" || a.type === "queen5" || a.type === "queen6" ? 60 : 22, hy = y - (a.flying ? 44 : 33) * a.size;
    rr(ctx, x - w / 2 - 1, hy - 1, w + 2, 6, 3), ctx.fillStyle = INK, ctx.fill();
    let f = Math.max(0, a.hp / a.maxHp);
    rr(ctx, x - w / 2, hy, w * f, 4, 2), ctx.fillStyle = f > 0.5 ? "#8fe388" : f > 0.25 ? "#ffd45e" : "#ff7a7a", ctx.fill();
  }
}
function renderFx(dt) {
  S.screen === "battle" && S.speed >= 4 && (dt *= 2);
  let keep = [];
  for (let f of S.fx) {
    if (f.life -= dt, f.life <= 0 || (keep.push(f), f.life > f.max)) continue;
    let k = 1 - f.life / f.max;
    switch (ctx.save(), f.k) {
      case "thrown": {
        let spr = antSprite(f.ant, 0, !1, pxRatio), x = f.x0 + (f.x1 - f.x0) * k, y = f.y0 + (f.y1 - f.y0) * k - Math.sin(k * Math.PI) * f.h;
        ctx.globalAlpha = k > 0.8 ? (1 - k) / 0.2 : 1, ctx.translate(x, y), ctx.rotate(k * f.spin);
        let sc = 1 - k * 0.35;
        if (ctx.scale(sc, sc), ctx.drawImage(spr.cv, -spr.ox, -spr.oy, spr.w, spr.h), k > 0.82 && !f.landed) {
          f.landed = !0;
          for (let i = 0; i < 4; i++) addFx({ k: "puff", x: f.x1 + (Math.random() - 0.5) * 10, y: f.y1, vx: (Math.random() - 0.5) * 40, vy: -Math.random() * 20, r: 3 + Math.random() * 3, life: 0.45, max: 0.45 });
        }
        break;
      }
      case "crumbFly": {
        let x = f.x0 + (f.x1 - f.x0) * k, y = f.y0 + (f.y1 - f.y0) * k - Math.sin(k * Math.PI) * 24;
        ctx.globalAlpha = k > 0.85 ? (1 - k) / 0.15 : 1, crumbIcon(ctx, x, y, 1.1 - k * 0.5, !0);
        break;
      }
      case "ko": {
        let spr = antSprite(f.ant, 0, !1, pxRatio), rmo = reducedMotion(), ds = rmo ? 1 : k < 0.25 ? 1 + 0.25 * (k / 0.25) : 1.25 * (1 - (k - 0.25) / 0.75);
        ctx.globalAlpha = rmo ? 1 - k : 1 - k * k, ctx.translate(f.x, f.y - (rmo ? 0 : f.fall ? -k * k * 20 + Math.sin(k * 14) * 3 : k * 24)), ctx.rotate(rmo ? 0 : Math.PI * k * (f.fall ? 2.2 : 0.4) * f.face), ctx.drawImage(spr.cv, -spr.ox, -spr.oy, spr.w, spr.h), ctx.scale(1, -1), ctx.beginPath(), ctx.ellipse(0, -18, 8, 2.5, 0, 0, 7), ctx.lineWidth = 2, ctx.strokeStyle = "#ffe36e", ctx.stroke();
        break;
      }
      case "puff":
        f.x += f.vx * dt, f.y += f.vy * dt, ctx.globalAlpha = (1 - k) * 0.8, ctx.beginPath(), ctx.arc(f.x, f.y, f.r * (1 + k), 0, 7), ctx.fillStyle = f.col || "#fff", ctx.fill();
        break;
      case "crumbTxt":
        ctx.globalAlpha = 1 - k * k, crumbIcon(ctx, f.x - 7, f.y - k * 24, 0.7), text(ctx, "+" + f.n, f.x + 7, f.y - k * 24, 12, "#ffe3a8");
        break;
      case "txt": {
        let rm = reducedMotion(), pk = Math.min(1, f.max * k / 0.12);
        ctx.globalAlpha = 1 - k * k;
        let sz = Math.max(MIN_FONT, (f.size || 14) * (rm || pk >= 1 ? 1 : pk < 0.6 ? 0.6 + (1.15 - 0.6) * (pk / 0.6) : 1.15 - 0.15 * ((pk - 0.6) / 0.4)));
        text(ctx, f.s, Math.max(60, Math.min(MAP_W - 60, f.x)), f.y - (rm ? 0 : 22 * (1 - Math.pow(1 - k, 3))), sz, f.col);
        break;
      }
      case "healRing": {
        let rm = reducedMotion(), rr3 = f.r * (rm ? 1 : 0.25 + 0.75 * Math.sqrt(k));
        ctx.globalAlpha = (1 - k) * 0.95, ctx.beginPath(), ctx.arc(f.x, f.y + 2, rr3, 0, 7), ctx.lineWidth = 6 * (1 - k) + 1.5, ctx.strokeStyle = INK, ctx.stroke(), ctx.lineWidth = 3.6 * (1 - k) + 1, ctx.strokeStyle = "#ffffff", ctx.stroke(), plusShape(ctx, f.x, f.y - 12, 6, "#ff5a7e", 1.5);
        break;
      }
      case "iceShard":
        f.x += f.vx * dt, f.y += f.vy * dt, f.vy += 220 * dt, ctx.globalAlpha = 1 - k * k, ctx.translate(f.x, f.y), ctx.rotate(f.rot + k * 5), ctx.beginPath(), ctx.moveTo(0, -4), ctx.lineTo(3, 3), ctx.lineTo(-3, 2.5), ctx.closePath(), ctx.fillStyle = "#e9f8ff", ctx.fill(), ctx.lineWidth = 1, ctx.strokeStyle = INK, ctx.stroke();
        break;
      case "shieldPop":
        ctx.globalAlpha = (1 - k) * 0.9, ctx.beginPath(), ctx.ellipse(f.x, f.y, 17, 21, 0, 0, 7), ctx.lineWidth = 1.5, ctx.strokeStyle = "#ffffff", ctx.stroke();
        break;
      case "healPlus": {
        let rm = reducedMotion();
        ctx.globalAlpha = k < 0.7 ? 1 : (1 - k) / 0.3, plusShape(ctx, f.x, f.y - (rm ? 4 : k * 22), 5, "#8fe388", 1.6);
        break;
      }
      case "ring2":
        ctx.globalAlpha = 1 - k, ctx.beginPath(), ctx.arc(f.x, f.y, 8 + k * 34, 0, 7), ctx.lineWidth = 6 * (1 - k) + 1, ctx.strokeStyle = "#ffe36e", ctx.stroke();
        break;
      case "pillar": {
        ctx.globalAlpha = (1 - k) * 0.8;
        let g = ctx.createLinearGradient(0, f.y - 120, 0, f.y + 10);
        g.addColorStop(0, "rgba(255,240,150,0)"), g.addColorStop(1, "rgba(255,240,150,0.9)"), ctx.fillStyle = g;
        let w = 26 * (1 - k * 0.5);
        ctx.fillRect(f.x - w / 2, f.y - 120, w, 130);
        for (let i = 0; i < 4; i++) starShape(ctx, f.x + Math.sin(i * 2.1 + k * 6) * 14, f.y - 20 - (k * 90 + i * 25) % 100, 3.5, "#fff7b0", 1);
        break;
      }
      case "heart":
        ctx.globalAlpha = 1 - k, heart(ctx, f.x + Math.sin(k * 8) * 3, f.y - k * 18, 3.2, "#ff8fbf");
        break;
      case "crumbBit":
        f.x += f.vx * dt, f.y += f.vy * dt, f.vy += 260 * dt, ctx.globalAlpha = 1 - k, ctx.fillStyle = "#e8b878", ctx.beginPath(), ctx.ellipse(f.x, f.y, 2.4, 1.8, k * 6, 0, 7), ctx.fill(), ctx.lineWidth = 1, ctx.strokeStyle = INK, ctx.stroke();
        break;
      case "dizzy":
        ctx.globalAlpha = 1 - k;
        for (let i = 0; i < 3; i++) {
          let a = k * 10 + i * 2.1;
          starShape(ctx, f.x + Math.cos(a) * 12, f.y - 16 + Math.sin(a) * 4, 3, "#fff27a", 1);
        }
        break;
      case "beam":
        ctx.globalAlpha = 1 - k, ctx.lineCap = "round", ctx.lineWidth = 6 + (f.heat || 0) * 5, ctx.strokeStyle = (f.heat || 0) > 0.6 ? "rgba(255,150,60,0.55)" : "rgba(255,90,120,0.4)", ctx.beginPath(), ctx.moveTo(f.x, f.y), ctx.lineTo(f.tx, f.ty - 4), ctx.stroke(), ctx.lineWidth = 2, ctx.strokeStyle = "#fff", ctx.stroke();
        break;
      case "zap": {
        ctx.globalAlpha = 1 - k, ctx.lineWidth = f.chain ? 2.2 : 3, ctx.strokeStyle = f.chain ? "#e4d0ff" : "#bfe0ff", ctx.beginPath(), ctx.moveTo(f.x, f.y);
        for (let i = 1; i < 6; i++) {
          let q = i / 6;
          ctx.lineTo(f.x + (f.tx - f.x) * q + (Math.random() - 0.5) * 10, f.y + (f.ty - f.y) * q + (Math.random() - 0.5) * 10);
        }
        ctx.lineTo(f.tx, f.ty), ctx.stroke(), ctx.lineWidth = 1.2, ctx.strokeStyle = "#fff", ctx.stroke();
        break;
      }
      case "tongue": {
        let ext = k < 0.5 ? k * 2 : (1 - k) * 2, sx = f.x + 8, sy = f.y - 8, ex = sx + (f.tx - sx) * ext, ey = sy + (f.ty - sy) * ext;
        ctx.lineCap = "round", ctx.lineWidth = 5, ctx.strokeStyle = INK, ctx.beginPath(), ctx.moveTo(sx, sy), ctx.lineTo(ex, ey), ctx.stroke(), ctx.lineWidth = 3, ctx.strokeStyle = "#ff8fab", ctx.stroke(), blob(ctx, ex, ey, 4, 4, "#ff8fab", 1.5);
        break;
      }
      case "spArc": {
        ctx.lineCap = "round";
        let mx = (f.x + f.tx) / 2, my = (f.y + f.ty) / 2 - 10;
        ctx.beginPath(), ctx.moveTo(f.x, f.y), ctx.quadraticCurveTo(mx, my, f.tx, f.ty), ctx.lineWidth = 2, ctx.strokeStyle = INK, ctx.stroke(), ctx.beginPath(), ctx.arc(mx * 0.5 + (f.x + f.tx) * 0.25, my * 0.5 + (f.y + f.ty) * 0.25, 2.4, 0, 7), ctx.fillStyle = "#fff2b8", ctx.fill();
        break;
      }
      // v0.8.3 M7h Ricochet
      case "spCrack": {
        ctx.globalAlpha = 1 - k, ctx.lineCap = "round", ctx.lineWidth = 2, ctx.strokeStyle = "#fff2b8", ctx.beginPath();
        for (let i = 0; i < 3; i++) {
          let a = -1.2 + i * 1.2 + 0.4;
          ctx.moveTo(f.x + Math.cos(a) * 3, f.y + Math.sin(a) * 3), ctx.lineTo(f.x + Math.cos(a) * (8 + 4 * k), f.y + Math.sin(a) * (8 + 4 * k));
        }
        ctx.stroke();
        break;
      }
      // v0.8.3 M7h Burn-through
      case "spGold":
        ctx.globalAlpha = (1 - k) * 0.9, ctx.beginPath(), ctx.arc(f.x, f.y - 6, f.r * (0.2 + 0.8 * k), 0, 7), ctx.lineWidth = 6.5 * (1 - k) + 1.3, ctx.strokeStyle = "#ffd24a", ctx.stroke();
        break;
      // v0.8.3 M7h Crescendo: 30 % thicker, gold
      case "ring":
        ctx.globalAlpha = (1 - k) * 0.8, ctx.beginPath(), ctx.arc(f.x, f.y - 6, f.r * (0.2 + 0.8 * k), 0, 7), ctx.lineWidth = 5 * (1 - k) + 1, ctx.strokeStyle = f.col, ctx.stroke(), ctx.beginPath(), ctx.arc(f.x, f.y - 6, f.r * (0.1 + 0.6 * k), 0, 7), ctx.lineWidth = 2, ctx.strokeStyle = "#fff", ctx.stroke();
        break;
      case "wisp": {
        let d = f.d + k * 70;
        ctx.globalAlpha = 1 - k, ctx.lineWidth = 2.5, ctx.lineCap = "round", ctx.strokeStyle = "#ffffff", ctx.beginPath();
        let x0 = f.x + Math.cos(f.a) * d, y0 = f.y + Math.sin(f.a) * d;
        ctx.moveTo(x0, y0), ctx.quadraticCurveTo(x0 + Math.cos(f.a + 1) * 6, y0 + Math.sin(f.a + 1) * 6, x0 + Math.cos(f.a) * 14, y0 + Math.sin(f.a) * 14), ctx.stroke();
        break;
      }
      case "mist": {
        ctx.globalAlpha = 0.6 * (1 - k);
        let x = f.x + (f.tx - f.x) * k, y = f.y - 20 + (f.ty - f.y + 20) * k;
        ctx.beginPath(), ctx.arc(x, y, 6 + k * 8, 0, 7), ctx.fillStyle = "#c9f5b8", ctx.fill();
        break;
      }
      case "healCross": {
        ctx.globalAlpha = 1 - k * k;
        let cy = f.y - k * 16, s = 1 + 0.2 * k;
        ctx.translate(f.x, cy), ctx.scale(s, s), ctx.lineJoin = "round", ctx.beginPath(), ctx.moveTo(-2.8, -7), ctx.lineTo(2.8, -7), ctx.lineTo(2.8, -2.8), ctx.lineTo(7, -2.8), ctx.lineTo(7, 2.8), ctx.lineTo(2.8, 2.8), ctx.lineTo(2.8, 7), ctx.lineTo(-2.8, 7), ctx.lineTo(-2.8, 2.8), ctx.lineTo(-7, 2.8), ctx.lineTo(-7, -2.8), ctx.lineTo(-2.8, -2.8), ctx.closePath(), ctx.fillStyle = "#c9f5b8", ctx.fill(), ctx.lineWidth = 1.8, ctx.strokeStyle = INK, ctx.stroke();
        break;
      }
      case "impact": {
        let x = f.x, y = f.y;
        switch (ctx.lineCap = "round", f.shape) {
          case "tint":
            ctx.globalAlpha = 0.4, ctx.beginPath(), ctx.arc(x, y, 9, 0, 7), ctx.fillStyle = f.col, ctx.fill();
            break;
          case "spoke3": {
            ctx.globalAlpha = 1 - k * k;
            let L = 5 + 4 * k;
            for (let w of [[5, INK], [2.4, "#fff4c8"]]) {
              ctx.lineWidth = w[0], ctx.strokeStyle = w[1], ctx.beginPath();
              for (let i = 0; i < 3; i++) {
                let a = -Math.PI / 2 + i * 2.094 + k * 0.5;
                ctx.moveTo(x, y), ctx.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L);
              }
              ctx.stroke();
            }
            break;
          }
          case "ring":
            ctx.globalAlpha = 1 - k, ctx.beginPath(), ctx.arc(x, y, 6 + 8 * k, 0, 7), ctx.lineWidth = 4.2, ctx.strokeStyle = INK, ctx.stroke(), ctx.lineWidth = 2.2, ctx.strokeStyle = "#d6f2ff", ctx.stroke();
            break;
          case "sparkle":
            fxSparkle(ctx, x, y, 6, "#ffffff", k);
            break;
          case "sparks2":
            ctx.globalAlpha = 1 - k;
            for (let i = 0; i < 2; i++) {
              let a = -0.6 + i * 2.2 + k, d = 3 + 7 * k;
              ctx.beginPath(), ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, 2.5 * (1 - k * 0.5), 0, 7), ctx.fillStyle = "#fff7a8", ctx.fill(), ctx.lineWidth = 1.2, ctx.strokeStyle = INK, ctx.stroke();
            }
            break;
          case "splat": {
            ctx.globalAlpha = 1 - k * k;
            let w = 5 + 7 * Math.min(1, k * 2.2);
            ctx.beginPath(), ctx.ellipse(x, y, w, w * 0.45, 0, 0, 7), ctx.fillStyle = "rgba(255,240,170,0.85)", ctx.fill(), ctx.lineWidth = 1.6, ctx.strokeStyle = INK, ctx.stroke(), k > 0.3 && (ctx.beginPath(), ctx.arc(x + 3, y + (k - 0.3) * 14, 1.8, 0, 7), ctx.fillStyle = "#ffe48a", ctx.fill());
            break;
          }
          case "bubbles":
            ctx.globalAlpha = 1 - k;
            for (let i = 0; i < 2; i++) {
              let rr2 = (i ? 2.5 : 4) * (0.5 + k * 1.1);
              ctx.beginPath(), ctx.arc(x + (i ? 6 : -4), y - (i ? 3 : 0) - k * 6, rr2, 0, 7), ctx.lineWidth = 1.8, ctx.strokeStyle = INK, ctx.stroke(), ctx.fillStyle = "rgba(255,170,70,0.75)", ctx.fill();
            }
            break;
          case "heart":
            ctx.globalAlpha = 1 - k, heart(ctx, x, y - k * 10, 5, "#ff8fbf");
            break;
        }
        break;
      }
      case "ember":
        f.x += f.vx * dt, f.y += f.vy * dt, ctx.globalAlpha = 1 - k, ctx.beginPath(), ctx.arc(f.x, f.y, 2.6 * (1 - k) + 0.8, 0, 7), ctx.fillStyle = k < 0.4 ? "#ffe08a" : "#ff8a4a", ctx.fill();
        break;
      case "spark":
        if (ART81) {
          fxSparkle(ctx, f.x, f.y, f.big ? 11 + 5 * k : 4 + 4 * k, f.col || "#fff7a8", k);
          break;
        }
        ctx.globalAlpha = 1 - k, starShape(ctx, f.x, f.y, 5 + k * 4, f.col || "#fff", 1);
        break;
      case "icing": {
        let rr2 = 10 + 34 * Math.sqrt(k);
        ctx.globalAlpha = (1 - k) * 0.9, ctx.beginPath(), ctx.ellipse(f.x, f.y + 8, rr2, rr2 * 0.45, 0, 0, 7), ctx.fillStyle = "#f7b6c8", ctx.fill(), ctx.lineWidth = 2, ctx.strokeStyle = INK, ctx.stroke();
        break;
      }
      // v0.8.1 W8: the Glaze Queen's icing splash
      case "sprk":
        f.x += f.vx * dt, f.y += f.vy * dt, f.vy += 320 * dt, ctx.globalAlpha = 1 - k * k, ctx.translate(f.x, f.y), ctx.rotate(f.rot + k * 9), ctx.fillStyle = f.col, ctx.fillRect(-3, -1.2, 6, 2.4), ctx.lineWidth = 0.9, ctx.strokeStyle = INK, ctx.strokeRect(-3, -1.2, 6, 2.4);
        break;
      // v0.8.1 W8: a sprinkle piece
      case "shard":
        f.x += f.vx * dt, f.y += f.vy * dt, f.vy += 300 * dt, ctx.globalAlpha = 1 - k, ctx.translate(f.x, f.y), ctx.rotate(k * 9), ctx.beginPath(), ctx.moveTo(-3, -2), ctx.lineTo(3, -1), ctx.lineTo(0, 3), ctx.closePath(), ctx.fillStyle = f.col || "#bfe6ff", ctx.fill(), ctx.lineWidth = 1, ctx.strokeStyle = INK, ctx.stroke();
        break;
      case "star":
        if (f.x += f.vx * dt, f.y += f.vy * dt, f.vy += 80 * dt, ART81) {
          fxSparkle(ctx, f.x, f.y, 4.5 * (1 - k) + 1.5, SPARK_COLS[(f.ci || 0) % 4], k);
          break;
        }
        ctx.globalAlpha = 1 - k, starShape(ctx, f.x, f.y, 4 * (1 - k) + 1, "#ffe36e", 1);
        break;
      case "pop":
        ctx.globalAlpha = 1 - k, ctx.beginPath(), ctx.arc(f.x, f.y, 10 + k * 22, 0, 7), ctx.lineWidth = 3, ctx.strokeStyle = "#fff", ctx.stroke();
        break;
      case "boom": {
        ctx.globalAlpha = 1 - k;
        for (let [rr2, col] of [[1, "#ffd36e"], [0.7, "#ff9a6e"], [0.4, "#fff3c0"]])
          ctx.beginPath(), ctx.arc(f.x, f.y, f.r * rr2 * (0.3 + 0.7 * Math.sqrt(k)), 0, 7), ctx.fillStyle = col, ctx.fill();
        text(ctx, "BOOM!", f.x, f.y - 10 - k * 20, 26 + k * 6, "#fff");
        break;
      }
      case "dust":
        ctx.globalAlpha = 0.5 * (1 - k), ctx.beginPath(), ctx.arc(f.x, f.y + k * 10, 6 + k * 10, 0, 7), ctx.fillStyle = "#e6f7c8", ctx.fill();
        break;
      case "flash":
        ctx.globalAlpha = 1 - k, ctx.fillStyle = f.col, ctx.fillRect(0, 0, MAP_W, MAP_H);
        break;
      case "wchip": {
        let t = k * f.max, inn = Math.min(1, t / 0.18), ease = 1 - (1 - inn) * (1 - inn), fade = t > 0.45 ? Math.max(0, 1 - (t - 0.45) / 0.15) : 1, rm = reducedMotion();
        ctx.globalAlpha = Math.min(1, inn * 1.5) * fade, ctx.translate(rm ? 0 : -60 * (1 - ease), 0);
        let w = 132, h = 26, x0 = 200 - w / 2, y0 = 40;
        rr(ctx, x0, y0, w, h, 13), ctx.fillStyle = f.col || "#fff2b8", ctx.fill(), ctx.lineWidth = 2, ctx.strokeStyle = INK, ctx.stroke(), text(ctx, f.s, 200, y0 + h / 2 + 0.5, 13, INK, "center", null);
        break;
      }
      case "banner":
        if (f.pill) {
          let t = k * f.max, rm = reducedMotion(), inn = Math.min(1, t / 0.18), ease = 1 - (1 - inn) * (1 - inn), fade = t > 0.88 ? Math.max(0, 1 - (t - 0.88) / 0.2) : 1, w = f.last ? 190 : 150, h = 36;
          if (ctx.globalAlpha = rm ? Math.min(fade, k < 0.15 ? k / 0.15 : 1) : Math.min(1, inn * 1.5) * fade, ctx.translate(0, rm ? 0 : -28 * (1 - ease)), drawPillButton(ctx, 200 - w / 2, 92, w, h, f.last ? "gold" : "pink"), drawChunkyText(ctx, f.s, 200, 92 + h / 2 + 1, 20, { mode: "btn" }), f.last && !rm && t > 0.12) for (let j = 0; j < 4; j++) {
            let ph = (t * 2.2 + j * 0.27) % 1;
            fxSparkle(ctx, 200 + (j % 2 ? 1 : -1) * (w / 2 + 6 + (j > 1 ? 14 : 0)), 98 + (j > 1 ? 22 : 0) + ph * 4, 6 - j % 2 * 1.5, SPARK_COLS[(j + 1) % 4], ph * 0.9);
          }
          break;
        } else {
          ctx.globalAlpha = k < 0.15 ? k / 0.15 : k > 0.75 ? (1 - k) / 0.25 : 1;
          let s = 1 + Math.max(0, 0.15 - k) * 2;
          ctx.translate(200, 200), ctx.scale(s, s), text(ctx, f.s, 0, 0, 34, "#ffe36e");
          break;
        }
    }
    ctx.restore();
  }
  for (let p of S.battle.projectiles) blob(ctx, p.x, p.y, 3.4, 3.4, "#b9b2c4", 1.5);
  S.fx = keep;
}
function renderUiFx(dt) {
  let keep = [];
  for (let f of S.ui) {
    if (f.life -= dt, f.life <= 0) continue;
    keep.push(f);
    let k = 1 - f.life / f.max, e = 1 - (1 - k) * (1 - k);
    if (ctx.save(), f.k === "cardFly") {
      let x = f.x0 + (f.x1 - f.x0) * e, y = f.y0 + (f.y1 - f.y0) * e - Math.sin(k * Math.PI) * 40, sc = 1 - 0.65 * e;
      ctx.translate(x, y), ctx.rotate(Math.sin(k * Math.PI) * 0.25), ctx.scale(sc, sc), drawCard(-44, -47, 88, 94, f.card, {});
    } else if (f.k === "queenPill") {
      let t = k * f.max, rm = reducedMotion(), inn = Math.min(1, t / 0.25), ease = 1 - (1 - inn) * (1 - inn), fade = t > 1.75 ? Math.max(0, 1 - (t - 1.75) / 0.25) : 1;
      ctx.globalAlpha = rm ? Math.min(fade, t < 0.2 ? t / 0.2 : 1) : fade, ctx.translate(rm ? 0 : -150 * (1 - ease), 0), drawPillButton(ctx, 8, 76, 168, 38, "purple"), ctx.save(), ctx.beginPath(), ctx.arc(28, 95, 15, 0, 7), ctx.fillStyle = "#fff3e6", ctx.fill(), ctx.lineWidth = 2, ctx.strokeStyle = INK, ctx.stroke(), ctx.clip(), ctx.translate(28, 104), ctx.scale(0.5, 0.5), drawAnt(ctx, f.type, 0.2), ctx.restore(), drawChunkyText(ctx, ANTS[f.type].name, 102, 96, 15, { mode: "btn", align: "center" });
    } else if (f.k === "costFly") {
      let x = f.x0 + (f.x1 - f.x0) * e, y = f.y0 + (f.y1 - f.y0) * e;
      ctx.globalAlpha = k > 0.75 ? (1 - k) / 0.25 : 1;
      let sc = k < 0.15 ? 0.6 + k / 0.15 * 0.6 : 1.2 - k * 0.3;
      ctx.translate(x, y), ctx.scale(sc, sc), rr(ctx, -34, -15, 68, 30, 15), ctx.fillStyle = "#5a4058", ctx.fill(), ctx.lineWidth = 2, ctx.strokeStyle = "#ffcf7a", ctx.stroke(), crumbIcon(ctx, -16, 0, 1), text(ctx, `-${f.n}`, 10, 1, 18, "#ffcf7a");
    } else if (f.k === "priceFloat") {
      ctx.globalAlpha = k > 0.6 ? (1 - k) / 0.4 : 1;
      let sc = k < 0.15 ? 0.6 + k / 0.15 * 0.5 : 1.1;
      ctx.translate(f.x, f.y + 6 - e * 34), ctx.scale(sc, sc), rr(ctx, -30, -13, 60, 26, 13), ctx.fillStyle = "#5a4058", ctx.fill(), ctx.lineWidth = 2, ctx.strokeStyle = f.cur === "diamond" ? "#9fe0ff" : "#ffd45e", ctx.stroke(), f.cur === "diamond" ? diamondIcon(ctx, -14, 0, 0.7) : coinIcon(ctx, -14, 0, 0.8), text(ctx, `-${f.n}`, 9, 1, 15, f.cur === "diamond" ? "#bfeaff" : "#ffe08a");
    } else if (f.k === "starBurst") {
      let d = 10 + e * 70;
      ctx.globalAlpha = 1 - k, starShape(ctx, f.x + Math.cos(f.a) * d, f.y + Math.sin(f.a) * d, 5 * (1 - k) + 2, "#ffe36e", 1.2);
    } else if (f.k === "gainFly") {
      let x = f.x0 + (f.x1 - f.x0) * e, y = f.y0 + (f.y1 - f.y0) * e;
      ctx.globalAlpha = k > 0.8 ? (1 - k) / 0.2 : 1, ctx.translate(x, y), rr(ctx, -36, -15, 72, 30, 15), ctx.fillStyle = "#3f6a58", ctx.fill(), ctx.lineWidth = 2, ctx.strokeStyle = "#bff5d0", ctx.stroke(), crumbIcon(ctx, -18, 0, 1), text(ctx, `+${f.n}`, 9, 1, 18, "#d8ffe4");
    }
    ctx.restore();
  }
  S.ui = keep;
}
function treatKind(b) {
  return treatOf(b ? b.levelIndex : 0);
}
var foodBarSt = { b: null, prev: 1, flash: 0, drain: null }, chipSt = { b: null, waves: {}, food: !1 };
function battleChips(b, f) {
  if (chipSt.b !== b && (chipSt = { b, waves: {}, food: !1 }), b.result == null && b.nextWave >= 1 && b.nextWave < b.totalWaves && b.ants.length === 0 && b.pending.length === 0 && !chipSt.waves[b.nextWave] && (chipSt.waves[b.nextWave] = !0, addFx({ k: "wchip", s: `Wave ${b.nextWave} cleared`, life: 0.6, max: 0.6 }), !reducedMotion()))
    for (let i = 0; i < 6; i++) addFx({ k: "star", ci: i, x: 200 + (i - 2.5) * 22, y: MAP_Y + 20, vx: (i - 2.5) * 10, vy: -90, life: 0.5, max: 0.5 });
  if (f > 0 && f < 0.25) {
    let pa = reducedMotion() ? 0.9 : 0.45 + 0.45 * (0.5 + 0.5 * Math.sin(S.t * Math.PI * 2 * 1.2));
    ctx.save(), rr(ctx, 60, 22, 84, 20, 10), ctx.lineWidth = 3, ctx.strokeStyle = `rgba(255,138,138,${pa})`, ctx.stroke(), ctx.restore(), chipSt.food || (chipSt.food = !0, addFx({ k: "wchip", s: "Food low!", col: "#ffd0d0", life: 0.6, max: 0.6 }));
  }
}
function renderHud(b) {
  panel(6, 6, 388, 54, "#fff6ee", 16), drawTreat(ctx, treatKind(b), 30, 33, b.foodStored / b.cfg.foodHP, S.t, { ouch: S.cookieOuch > S.t, react: reaction(S.treat, S.t) });
  let f = b.foodStored / b.cfg.foodHP;
  if (ART81) {
    foodBarSt.b !== b && (foodBarSt = { b, prev: f, flash: 0, drain: null }), f < foodBarSt.prev - 1e-6 && (foodBarSt.flash = 0.5, foodBarSt.drain = { from: Math.max(foodBarSt.prev, foodBarSt.drain ? foodBarSt.drain.from : 0), a: 1 }), foodBarSt.prev = f;
    let dt = Math.min(0.1, S.t - (foodBarSt.t || S.t));
    foodBarSt.t = S.t, foodBarSt.flash = Math.max(0, foodBarSt.flash - dt * (0.5 / 0.12)), foodBarSt.drain && (foodBarSt.drain.a -= dt / 0.4, foodBarSt.drain.a <= 0 && (foodBarSt.drain = null)), drawFoodBar(ctx, f, `${Math.floor(b.foodStored + 1e-6)}`, S.t, { flash: reducedMotion() ? 0 : foodBarSt.flash, drain: reducedMotion() ? null : foodBarSt.drain, still: reducedMotion() });
  } else
    rr(ctx, 60, 22, 84, 20, 10), ctx.fillStyle = "#f0e0d8", ctx.fill(), ctx.lineWidth = 2, ctx.strokeStyle = INK, ctx.stroke(), f > 0 && (rr(ctx, 62, 24, 80 * f, 16, 8), ctx.fillStyle = f >= 0.9 ? "#8fe388" : f >= 0.5 ? "#ffd45e" : "#ff8a8a", ctx.fill()), text(ctx, `${Math.floor(b.foodStored + 1e-6)}`, 102, 33, 13, "#fff");
  ART81 && battleChips(b, f);
  let carried = b.ants.reduce((s, a) => s + (a.trips === 0 ? a.carrying : 0), 0);
  carried && text(ctx, `${fmtFood(carried)} carried off!`, 102, 51, 12, "#c0392b", "center", null), text(ctx, `Wave ${Math.min(b.nextWave, b.totalWaves)}/${b.totalWaves}`, 184, 26, 16, "#ffb3c1", "center", INK, "bold", !0), hudPreviewLast = null, stripNoRoom && drawHudPreview(b) || text(ctx, `Lv ${b.levelIndex + 1}`, 184, 46, 12, "#a08090", "center", null), ctx.save(), ctx.translate(252, 33), rr(ctx, -31, -14, 62, 28, 14), ctx.fillStyle = "#e9f7ff", ctx.fill(), ctx.lineWidth = 2, ctx.strokeStyle = INK, ctx.stroke(), diamondIcon(ctx, -15, 0, 0.95), text(ctx, String(S.save.diamonds || 0), 8, 1, 16, "#7fd3ff", "center", INK, "bold", !0), ctx.restore(), S.crumbShake = Math.max(0, S.crumbShake - 1 / 60), S.crumbPulse = Math.max(0, S.crumbPulse - 1 / 60);
  let cbump = S.crumbBump > 0 ? 0.08 * Math.sin(Math.PI * (1 - S.crumbBump / 0.12)) : 0;
  S.crumbBump = Math.max(0, S.crumbBump - 1 / 60);
  let shx = S.crumbShake > 0 ? Math.sin(S.t * 60) * 4 * S.crumbShake / 0.45 : 0, pul = 1 + S.crumbPulse * 0.5 + cbump;
  if (ctx.save(), ctx.translate(341 + shx, 33), ctx.scale(pul, pul), rr(ctx, -45, -16, 90, 32, 16), ctx.fillStyle = S.crumbShake > 0 ? "#ffd6d6" : "#fff1d6", ctx.fill(), ctx.lineWidth = 2, ctx.strokeStyle = S.crumbShake > 0 ? "#e0524f" : INK, ctx.stroke(), crumbIcon(ctx, -27, 0, 1.2), text(ctx, String(Math.floor(b.crumbs)), 7, 1, 19, "#ffcf7a", "center", INK, "bold", !0), blob(ctx, 36, -1, 9, 9, "#9fe0ff", 1.8), text(ctx, "+", 36, -1.5, 15, "#ffffff"), ctx.restore(), ART81) {
    drawCrumbUp();
    let sk = (S.t - S.chipSparkT) / 0.28;
    sk >= 0 && sk < 1 && !reducedMotion() && (ctx.save(), fxSparkle(ctx, 322, 22, 5, "#fff7c2", sk), ctx.restore());
  }
  S.result || button("buyCrumbs", 290, 0, 110, 66, () => openCrumbDialog());
}
function openCrumbDialog() {
  let b = S.battle;
  if (!b || b.result || S.paused) return;
  let price = nextCrumbPrice(b);
  S.dialog = {
    kind: "crumbs",
    title: "More crumbs",
    line: `Buy ${ECONOMY.diamonds.crumbPack} crumbs for`,
    price,
    note: "Price doubles with every purchase this battle.",
    onBuy: () => {
      let r = buyCrumbsWithDiamonds(S.save, b);
      return r.ok && (persist(), sfx("return"), S.crumbPulse = 0.5, addUi({ k: "gainFly", n: r.crumbs, x0: 200, y0: 300, x1: 340, y1: 34, life: 0.8, max: 0.8 })), r;
    }
  }, sfx("tap");
}
function openBoosterDialog(bt) {
  let b = S.battle;
  if (!b || b.result || S.paused) return;
  let price = nextBoosterPrice(b, bt);
  S.dialog = {
    kind: "booster",
    booster: bt,
    title: `${BONUSES[bt].name}`,
    line: `0 left. Buy 1 ${BONUSES[bt].name} for`,
    price,
    note: ECONOMY.diamonds.boosterPriceStep ? `Next booster costs +${ECONOMY.diamonds.boosterPriceStep} more this battle.` : "Same price for every booster, every time.",
    onBuy: () => {
      let r = buyBoosterWithDiamonds(S.save, b, bt);
      return r.ok && (persist(), sfx("upgrade")), r;
    }
  }, sfx("tap");
}
function renderDialog() {
  let D = S.dialog, have = S.save.diamonds || 0, afford = have >= D.price;
  if (ctx.fillStyle = "rgba(60,40,55,0.5)", ctx.fillRect(-2e3, -2e3, W + 4e3, H + 4e3), button("dlgBlock", -2e3, -2e3, W + 4e3, H + 4e3, () => {
  }), panel(44, 228, 312, 250, "#fff6ee"), text(ctx, D.title, 200, 258, 22, D.kind === "crumbs" ? "#ffcf7a" : BONUSES[D.booster].color, "center", INK, "bold", !0), ctx.save(), ctx.translate(200, 300), D.kind === "crumbs")
    for (let k = 0; k < 5; k++) crumbIcon(ctx, -28 + k * 14, Math.sin(S.t * 4 + k) * 2, 1.4);
  else
    ctx.scale(1.4, 1.4), drawBonusIcon(ctx, D.booster, S.t);
  ctx.restore(), plainText(D.line, 200, 338, 14, "#3d2a36", "center", "600"), diamondIcon(ctx, 178, 364, 1.2), text(ctx, String(D.price), 212, 365, 22, "#7fd3ff", "center", INK, "bold", !0), plainText(afford ? `You have ${have} diamonds.` : `You have ${have} diamonds. Get diamonds from the Reward Calendar.`, 200, 392, 12, afford ? "#5a4652" : "#c0392b", "center"), plainText(D.note, 200, 408, 12, "#7a6a76", "center"), drawButton(64, 420, 128, 46, "Cancel", "#fff3e6"), button("dlgCancel", 60, 418, 136, 52, () => {
    S.dialog = null;
  }), drawButton(208, 420, 128, 46, "Buy", "#9fe0ff", { disabled: !afford }), button("dlgBuy", 204, 418, 136, 52, () => {
    if (!afford) {
      toast("Not enough diamonds");
      return;
    }
    let r = D.onBuy();
    S.dialog = null, r.ok || toast(r.why === "uses" ? "No booster uses left" : "Not enough diamonds");
  });
}
function plainText(s, x, y, size, col, align = "left", weight = "500") {
  ctx.font = `${weight} ${size}px ${FONT}`, ctx.textAlign = align, ctx.textBaseline = "middle", ctx.fillStyle = col, ctx.fillText(s, x, y);
}
var TRAY = { cardY: 6, cardH: 94, waveY: 6, waveH: 48, rerollY: 58, rerollH: 36, rowY: 108, rowH: 44 };
function renderTray(b) {
  let y0 = TRAY_Y, L = TRAY;
  bakedBox(ctx, "tray", 4, y0, 392, H - y0 - 8, 12, (g, w, h) => {
    if (ART81) for (let [dy, al] of [[7, 0.07], [5, 0.09], [3, 0.09]])
      rrPath(g, 0, dy, w, h, 18), g.fillStyle = `rgba(70,35,50,${al})`, g.fill();
    drawBeveledTile(g, 0, 0, w, h, "#ffe3d2", { lip: 4, r: 18, lw: 3, hi: 0.6 }), g.save(), rrPath(g, 3, 3, w - 6, h - 6, 15), g.clip(), g.fillStyle = "rgba(255,213,191,0.55)";
    for (let x = 0; x < w; x += 24) g.fillRect(x + 6, 0, 12, h);
    for (let y = 0; y < h; y += 24) g.fillRect(0, y + 6, w, 12);
    g.restore(), rrPath(g, 0, 0, w, h, 18), g.lineWidth = 3, g.strokeStyle = INK, g.stroke();
  });
  let cost = b.nextCardCost, afford = b.crumbs >= cost;
  for (let i = 0; i < b.picks.length; i++) {
    let x = 12 + i * 94, y = y0 + L.cardY, w = 88, h = L.cardH, selected = S.sel && S.sel.kind === "card" && S.sel.i === i || S.drag && S.drag.i === i;
    S.slotFlip[i] = Math.max(0, (S.slotFlip[i] || 0) - 1 / 60);
    let shake = !afford && S.crumbShake > 0 ? Math.sin(S.t * 60) * 3 : 0;
    ctx.save(), ctx.translate(x + w / 2 + shake, y + h / 2), ctx.scale(Math.max(0.05, S.slotFlip[i] > 0 ? 1 - Math.sin(S.slotFlip[i] / 0.3 * Math.PI) : 1), 1), ctx.translate(-(x + w / 2), -(y + h / 2)), drawCard(x, y, w, h, b.picks[i], { cost, afford, selected, lift: selected ? 4 : ART81 && afford ? 2 : 0, level: Math.min(S.save.cards[b.picks[i]].level, b.cardLevelCap || 1 / 0) }), ctx.restore(), button("pick" + i, x - 3, y0 + 2, w + 6, L.cardH + 8, () => {
      S.sel && S.sel.kind === "card" && S.sel.i === i ? S.sel = null : (S.sel = { kind: "card", i }, S.info = null, afford || needCrumbs(cost)), sfx("tap");
    }, { onDown: (p) => {
      S.drag = { i, x: p.x, y: p.y, moved: !1 };
    } });
  }
  let wx = 296, ww = 92, more = b.nextWave < b.totalWaves, secs = Math.max(0, Math.ceil(b.nextWaveAt - b.time)), bonus = Math.floor(Math.max(0, b.nextWaveAt - b.time) * b.cfg.earlyCallBonusPerSec), wy = y0 + L.waveY;
  drawButton(wx, wy, ww, L.waveH, "", "#9fe0b5", { disabled: !more }), more ? (text(ctx, b.nextWave === 0 ? "Start!" : "Next wave", wx + ww / 2, wy + 16, 14), text(ctx, `${secs}s${bonus ? "  +" + bonus : ""}`, wx + ww / 2, wy + 35, 12, "#fff8c0"), bonus && crumbIcon(ctx, wx + ww - 10, wy + 35, 0.55)) : text(ctx, "Last wave", wx + ww / 2, wy + 25, 13), button("wave", wx - 4, y0 + 2, ww + 8, L.rerollY - 4, () => {
    b.callWaveEarly() > 0 && sfx("return");
  });
  let rc = b.rerollPrice, ry = y0 + L.rerollY;
  drawButton(wx, ry, ww, L.rerollH, "", "#fff3e6", { disabled: b.crumbs < rc }), rc === 0 ? (text(ctx, "Redraw", wx + 30, ry + 18, 13, INK, "center", null), text(ctx, "FREE", wx + 76, ry + 18, 12, "#2f8a3a", "center", null)) : (text(ctx, "Redraw", wx + 30, ry + 18, 13, INK, "center", null), crumbIcon(ctx, wx + 66, ry + 18, 0.65), text(ctx, String(rc), wx + 80, ry + 18, 12, INK, "center", null)), button("reroll", wx - 4, y0 + L.rerollY - 4, ww + 8, L.rowY - L.rerollY + 4, () => {
    b.reroll() ? (sfx("tap"), rc > 0 && (addUi({ k: "costFly", n: rc, x0: 340, y0: 34, x1: 300, y1: 96, life: 1, max: 1 }), S.crumbPulse = 0.35)) : needCrumbs(rc);
  });
  let by = y0 + L.rowY, bh = L.rowH, hitY = y0 + L.rowY - 2, hitH = H - hitY;
  b.bonusTypes.forEach((bt, k) => {
    let x = 12 + k * 104, w = 98, can = b.canUseBonus(bt), sel = S.sel && S.sel.kind === "bonus" && S.sel.type === bt, stock = b.bonusStock[bt] || 0, buyable = stock <= 0 && b.bonusUsesLeft > 0;
    if (drawButton(x, by, w, bh, "", sel ? "#ffd27a" : BONUSES[bt].color, { disabled: !can && !buyable, r: 12 }), ctx.save(), ctx.translate(x + 17, by + bh / 2), ctx.scale(0.85, 0.85), drawBonusIcon(ctx, bt, S.t), ctx.restore(), fitText(BONUSES[bt].name, x + 59, by + 15, 70, 12, "#fff"), buyable) {
      let pr = nextBoosterPrice(b, bt);
      diamondIcon(ctx, x + 47, by + 31, 0.62), text(ctx, String(pr), x + 66, by + 31, 12, "#fff8c0");
    } else text(ctx, `x${stock}`, x + 59, by + 31, 12, "#fff8c0");
    button("bonus" + bt, x - 2, hitY, w + 4, hitH, () => {
      if (buyable) {
        openBoosterDialog(bt);
        return;
      }
      if (!b.canUseBonus(bt)) {
        toast(b.bonusUsesLeft <= 0 ? `Max ${b.cfg.maxBonusUses} boosters per battle` : "None left");
        return;
      }
      BONUSES[bt].needsTarget ? (S.sel = sel ? null : { kind: "bonus", type: bt }, sel || toast("Tap the trail to aim")) : b.useBonus(bt, 0, 0);
    });
  }), text(ctx, `${b.bonusUsesLeft}`, 234, by + 14, 14, "#ffb3c1"), text(ctx, "left", 234, by + 30, 12, "#a08090", "center", null), drawSpeedButton(256, by, 60, bh), button("speed", 252, hitY, 68, hitH, () => {
    S.speed = nextSpeed(S.speed), sfx("tap");
  }), drawButton(324, by, 64, bh, "II", "#fff3e6", { r: 12, size: 16 }), button("pause", 320, hitY, 76, hitH, () => {
    setPaused(!0);
  });
}
var SPEED_COL = { 1: "#ffd27a", 2: "#ffb347", 4: "#ff8a5c" };
function drawSpeedButton(x, y, w, h) {
  let sp = S.speed, n = sp === 1 ? 1 : sp === 2 ? 2 : 3, col = SPEED_COL[sp] || SPEED_COL[1];
  drawButton(x, y, w, h, "", col, { r: 12 });
  let cw2 = 8, gap = 3, tw = n * cw2 + (n - 1) * gap, x0 = x + w / 2 - tw / 2, cy = y + h * 0.4, ch2 = 12;
  ctx.save(), ctx.fillStyle = INK;
  for (let i = 0; i < n; i++) {
    let px = x0 + i * (cw2 + gap);
    ctx.beginPath(), ctx.moveTo(px, cy - ch2 / 2), ctx.lineTo(px + cw2, cy), ctx.lineTo(px, cy + ch2 / 2), ctx.closePath(), ctx.fill();
  }
  ctx.restore(), text(ctx, sp + "x", x + w / 2, y + h - 11, 12, INK, "center", null);
}
function renderPause() {
  buttons.length = 0, ctx.fillStyle = "rgba(60,40,55,0.45)", ctx.fillRect(-2e3, -2e3, W + 4e3, H + 4e3), panel(60, 220, 280, 260, "#fff6ee"), text(ctx, "Paused", 200, 256, 28, "#ffb3c1"), drawButton(90, 290, 220, 48, "Resume", "#9fe0b5"), button("resume", 90, 290, 220, 48, () => {
    setPaused(!1);
  }), drawButton(90, 350, 220, 48, "Restart", "#ffd27a"), button("restart", 90, 350, 220, 48, () => startBattle(S.levelIndex, S.battle.deck, S.battle.bonusTypes)), drawButton(90, 410, 220, 48, "Quit to map", "#ffb3b3"), button("quit", 90, 410, 220, 48, () => {
    S.battle = null, go("map");
  });
}
function drawStarMoment(MO, rt, tRes) {
  let rm = reducedMotion(), CX = 200, CY = 345, T = MOMENT_T, amount = Math.round(rm ? MO.amount * Math.min(1, Math.max(0, (rt - 0.2) / 0.3)) : MO.amount * (1 - Math.pow(1 - Math.min(1, Math.max(0, (rt - T.burst) / (T.countDone - T.burst))), 3))), x = CX, y = CY, sc = 1, rot = 0, al = 1;
  if (rm)
    al = rt < 0.2 ? rt / 0.2 : rt > 0.85 ? Math.max(0, 1 - (rt - 0.85) / 0.25) : 1;
  else if (rt < T.drop) {
    let k = rt / T.drop;
    y = 150 + (CY - 150) * easeOutBack(k), sc = 0.6 + 0.4 * k, al = Math.min(1, k * 3);
  } else if (rt < T.shake) {
    let k = (rt - T.drop) / (T.shake - T.drop);
    rot = Math.sin(k * Math.PI * 6) * 0.07 * (1 - k);
  } else if (rt >= T.hold) {
    let k = Math.min(1, (rt - T.hold) / (T.fly - T.hold)), e = k * k;
    x = CX + (240 - CX) * e, y = CY + (468 - CY) * e, sc = 1 - 0.7 * e, al = 1 - 0.85 * e;
  } else if (rt >= T.count && rt < T.count + 0.12) {
    let k = (rt - T.count) / 0.12;
    sc = 1 + 0.08 * Math.sin(k * Math.PI);
  }
  if (!rm && rt >= T.shake - 0.01 && rt < T.burst + 0.2 && lightBurst(ctx, CX, CY, 150 * Math.min(1, (rt - T.shake + 0.05) / 0.3), tRes * 2, { alpha: 0.7, rays: 12 }), !rm && rt >= T.burst && rt < T.burst + 0.35 && MO.sfx < 1 && (MO.sfx = 1, sfx("upgrade")), rm && rt >= 0.2 && MO.sfx < 1 && (MO.sfx = 1, sfx("win")), !rm && rt >= T.burst && rt < T.countDone) {
    let n = Math.floor((rt - T.burst) / 0.15);
    n > MO.sfx - 1 && n < 7 && (MO.sfx = n + 2, sfx("pop"));
  }
  ctx.save(), ctx.globalAlpha = Math.max(0, al), ctx.translate(x, y), ctx.rotate(rot), ctx.scale(sc, sc), drawBeveledTile(ctx, -76, -49, 152, 98, "#ffe58a", { lip: 5, r: 18, lw: 3, hi: 0.8 }), rr(ctx, -72, -45, 144, 90, 15), ctx.lineWidth = 3, ctx.strokeStyle = "#f2a81d", ctx.stroke();
  for (let i = 0; i < 3; i++) candyStar(ctx, -26 + i * 26, i === 1 ? -33 : -29, i === 1 ? 11 : 9, "#ffd23f", 1.8);
  if (coinIcon(ctx, -42, 3, 1.5), drawChunkyText(ctx, `+${amount}`, 10, 3, 40, { mode: "title" }), drawChunkyText(ctx, "3 STARS!", 0, 34, 16, { mode: "btn" }), ctx.restore(), !rm && rt >= T.burst && rt < T.burst + 0.5) {
    let k = (rt - T.burst) / 0.5;
    for (let i = 0; i < 12; i++) {
      let a = i * Math.PI / 6 + 0.3, d = 40 + 70 * k * (0.7 + i % 3 * 0.15);
      sparkle(ctx, CX + Math.cos(a) * d, CY + Math.sin(a) * d * 0.8, 5 * (1 - k * 0.6), i % 2 ? "#fff7a8" : "#ffe27a", a);
    }
  }
}
function renderResult(dt) {
  let R = S.result, out = R.out;
  if (R.hold > 0) {
    R.hold -= dt, ctx.fillStyle = "rgba(60,40,55,0.22)", ctx.fillRect(-2e3, -2e3, W + 4e3, H + 4e3), button("resultBlock", -2e3, -2e3, W + 4e3, H + 4e3, () => {
    });
    return;
  }
  R.t += dt;
  let MO = R.moment || null, rtM = MO ? R.skipped ? 99 : R.t - MO.t0 : 99, momentBusy = !!MO && !R.skipped && rtM < MO.dur;
  ctx.fillStyle = "rgba(38,28,16,0.72)", ctx.fillRect(-2e3, -2e3, W + 4e3, H + 4e3), button("resultBlock", -2e3, -2e3, W + 4e3, H + 4e3, () => {
    momentBusy && (R.skipped = !0);
  }), R.win && !reducedMotion() && lightBurst(ctx, RESULT_TREAT.x, RESULT_TREAT.y, 230, R.t, { alpha: 0.5 });
  let celebrating = R.perfect && R.t < UI.perfectAnimTime, pop = Math.min(1, R.t * 4);
  ctx.save(), ctx.translate(200, 360), ctx.scale(0.7 + pop * 0.3, 0.7 + pop * 0.3), ctx.translate(-200, -360), panel(36, 120, 328, 480, "#fff6ee", 18, { gold: R.win });
  let tk = treatOf(S.battle.levelIndex), TN = TREAT_NAME[tk] || "Cookie";
  ART81 && drawRewardHeader(ctx, rewardPalette(R.win, R.stars, R.perfect), R.skipped ? 99 : R.t, reducedMotion(), R.win && (R.stars >= 3 || R.perfect));
  let title = R.perfect ? `Perfect ${TN}!` : R.win ? `${TN} saved!` : `${TN} eaten!`, ts = R.perfect ? 30 + Math.max(0, 0.3 - R.t) * 30 + Math.sin(R.t * 6) * 1.5 : 28;
  if (R.win ? drawChunkyText(ctx, title, 200, 156, ts, ART81 ? { mode: "title", fill: "#fff" } : { mode: "title" }) : drawChunkyText(ctx, title, 200, 156, ts, { mode: "plain", fill: ART81 ? "#fff" : "#ffb4ac" }), R.perfect) {
    ctx.save(), ctx.globalAlpha = 0.35 + Math.sin(R.t * 4) * 0.15;
    let g = ctx.createRadialGradient(200, 212, 10, 200, 212, 70);
    g.addColorStop(0, "#fff6a8"), g.addColorStop(1, "rgba(255,246,168,0)"), ctx.fillStyle = g, ctx.beginPath(), ctx.arc(200, 212, 70, 0, 7), ctx.fill(), ctx.restore();
    for (let i = 0; i < 8; i++) {
      let a = R.t * 0.8 + i * Math.PI / 4;
      starShape(ctx, 200 + Math.cos(a) * 52, 212 + Math.sin(a) * 40, 4, "#ffe36e", 1);
    }
  }
  if (R.win) {
    let pk = 0.9 + Math.min(0.3, (out.coins || 0) / 600);
    drawCoinPile(ctx, RESULT_PILE.x, RESULT_PILE.y, Math.round(pk * 4) / 4), ctx.save(), ctx.translate(RESULT_TREAT.x, RESULT_TREAT.y), ctx.scale(RESULT_TREAT.k, RESULT_TREAT.k), drawTreat(ctx, tk, 0, 0, S.battle.foodStored / S.battle.cfg.foodHP, S.t, { face: "happy" }), ctx.restore();
  } else {
    drawTreat(ctx, tk, 200, 205, 0.05, S.t, {});
    let hop = (k) => reducedMotion() ? 0 : Math.abs(Math.sin(S.t * 5 + k)) * 5;
    for (let [ax, k, ty] of [[92, 0, "worker"], [308, 1.7, "small"]]) {
      let sp = antSprite(ty, 0, !1, pxRatio * 1.25, "cheer");
      ctx.save(), ctx.translate(ax, 240 - hop(k)), ctx.scale(1.25 * (k ? -1 : 1), 1.25), ctx.drawImage(sp.cv, -sp.ox, -sp.oy, sp.w, sp.h), ctx.restore(), contactShadow(ctx, ax, 244, 20, 5, 0.22);
    }
  }
  R.queenKilled && plainFit(tk === "pancake" ? "Way to go, you saved the pancakes!" : tk === "donut" ? "Way to go, you saved the donut!" : tk === "cake" ? "Way to go, you saved the cake!" : tk === "pie" ? "Way to go, you saved the pie!" : tk === "sundae" ? "Way to go, you saved the sundae!" : "Way to go, you saved the cookies!", 200, 180, 300, 13, "#e0607e", "center", "800");
  for (let s = 0; s < 3; s++) {
    let on = s < R.stars && R.t > 0.3 + s * 0.25, sc = on ? 1 + Math.max(0, 0.2 - (R.t - 0.3 - s * 0.25)) * 3 : 1;
    starShape(ctx, 140 + s * 60, 270, 18 * sc, on ? "#ffd45e" : "#e8dde4", 2.5);
  }
  if (R.chip2 && R.t > 0.55) {
    let k = Math.min(1, (R.t - 0.55) * 5), cx2 = 322, cy2 = 270;
    ctx.save(), ctx.translate(cx2, cy2), ctx.scale(0.6 + 0.4 * easeOutBack(k), 0.6 + 0.4 * easeOutBack(k)), drawBeveledTile(ctx, -32, -14, 64, 28, "#ffe9a8", { lip: 2, r: 14, lw: 2, hi: 0.6 }), coinIcon(ctx, -19, 0, 1.1), drawChunkyText(ctx, `+${R.chip2}`, 9, 0, 16, { mode: "num" });
  }
  let bodyA = MO && !R.skipped ? Math.max(0, Math.min(1, (rtM - MOMENT_T.hold) / 0.35)) : 1;
  ctx.save(), ctx.globalAlpha = bodyA, text(ctx, `Food left: ${fmtFood(S.battle.foodStored)}/${S.battle.cfg.foodHP}   Ants beaten: ${R.kills}`, 200, 302, 12, "#7a5a6a", "center", null);
  let P = out.parts || {}, rows = [];
  R.win ? (rows.push(["Victory", P.base]), rows.push(["Food left", P.food]), rows.push(["Ants beaten", P.kills]), P.level && rows.push(["Level reward", P.level]), P.firstClear && rows.push(["First clear", P.firstClear]), P.stars && rows.push(["Star bonus", P.stars]), P.daily && rows.push(["Daily first win", P.daily])) : rows.push(["Ants beaten", P.kills || 0]), rows.push([R.win ? "Time survived" : `Time survived${out.coins >= ECONOMY.lossCap ? ` (max ${ECONOMY.lossCap})` : ""}`, P.time || 0]);
  let RS = rows.length > 5 ? 14 : 16;
  rr(ctx, 70, 316, 260, 14 + rows.length * RS, 10), ctx.fillStyle = "#f6ece8", ctx.fill(), rows.forEach(([l, v], i) => {
    text(ctx, l, 84, 330 + i * RS, 12, "#7a5a6a", "left", null), text(ctx, `+${v}`, 316, 330 + i * RS, 12, "#c9962a", "right", null);
  });
  let yy = 330 + rows.length * RS + 18;
  if (out.gems ? (coinIcon(ctx, 92, yy, 1.3), text(ctx, `+${out.coins} coins`, 146, yy + 1, 18, "#ffd45e", "center"), diamondIcon(ctx, 226, yy, 0.8), text(ctx, `+${out.gems} gems`, 240, yy + 1, 18, "#8fd0ff", "left")) : (coinIcon(ctx, 150, yy, 1.3), text(ctx, `+${out.coins} coins`, 208, yy + 1, 18, "#ffd45e")), ART81 && R.win && out.coins > 0 && !celebrating && !reducedMotion() && !R.coinSkip) {
    let tx = out.gems ? 92 : 150, ty = yy, n = Math.min(8, Math.max(3, Math.ceil(out.coins / 12)));
    for (let i = 0; i < n; i++) {
      let s = (R.t - (R.perfect ? UI.perfectAnimTime : 0) - 0.35 - i * 0.06) / 0.6;
      if (s <= 0 || s >= 1) continue;
      let u = s * s * (3 - 2 * s), x = RESULT_PILE.x + (tx - RESULT_PILE.x) * u + Math.sin(i * 2.1) * 26 * (1 - u) * u * 2, y = RESULT_PILE.y + (ty - RESULT_PILE.y) * u - Math.sin(Math.PI * u) * 34;
      ctx.save(), ctx.translate(x, y), ctx.scale(Math.max(0.15, Math.abs(Math.cos(s * 9 + i))), 1), ctx.globalAlpha = Math.min(1, (1 - s) * 5), coinSprite(ctx, 0, 0, 9), ctx.restore();
    }
  }
  let gift = out.bossGift && !celebrating, twin = gift && out.prize;
  if (yy += 20, twin || (text(ctx, `(${R.crumbsLeft} unspent crumbs vanish)`, 200, yy, 12, "#a08090", "center", null), yy += 20), R.win || text(ctx, "Win to earn cards and prizes!", 200, yy, 12, "#a08090", "center", null), !R.win && R.hint) {
    let h = R.hint, mid = h.length > 38 ? h.lastIndexOf(" - ", 40) > 10 ? h.lastIndexOf(" - ", 40) + 2 : h.lastIndexOf(". ", 40) > 10 ? h.lastIndexOf(". ", 40) + 1 : h.lastIndexOf(" ", Math.ceil(h.length / 2) + 4) : -1, lines = mid > 0 ? [h.slice(0, mid).trim(), h.slice(mid).replace(/^[- ]+/, "").trim()] : [h], ph = lines.length > 1 ? 40 : 26;
    rr(ctx, 50, yy + 14, 300, ph, 13), ctx.fillStyle = "#fff2b8", ctx.fill(), ctx.lineWidth = 2, ctx.strokeStyle = "#e0a830", ctx.stroke(), lines.forEach((ln, i) => plainFit(ln, 200, yy + 27 + i * 15, 280, 13, "#a8661a", "center", "800"));
  }
  out.booster && (rr(ctx, 70, yy - 12, 260, 26, 12), ctx.fillStyle = "#ffe9f0", ctx.fill(), ctx.lineWidth = 2, ctx.strokeStyle = "#ff9ab0", ctx.stroke(), ctx.save(), ctx.translate(92, yy + 1), ctx.scale(0.62, 0.62), drawBonusIcon(ctx, out.booster.id, S.t), ctx.restore(), text(ctx, `First clear: +1 ${BONUSES[out.booster.id].name} booster`, 210, yy + 1, 12.5, "#e0607e", "center", null), yy += 30);
  let strip = (cy, pz, label, k) => {
    k > 0 && (ctx.save(), ctx.translate(200, cy), ctx.scale(0.5 + k * 0.5, 0.5 + k * 0.5), rr(ctx, -130, -15, 260, 30, 14), ctx.fillStyle = "#fff2b8", ctx.fill(), ctx.lineWidth = 2.4, ctx.strokeStyle = "#e0a830", ctx.stroke(), pz.kind === "bonus" ? (ctx.save(), ctx.translate(-108, 0), ctx.scale(0.8, 0.8), drawBonusIcon(ctx, pz.id, S.t), ctx.restore()) : (ctx.save(), ctx.translate(-108, 6), ctx.scale(0.42, 0.42), drawTower(ctx, pz.id, S.t, null), ctx.restore()), text(ctx, label, 10, 1, 13, "#c47a12"), ctx.restore());
  }, cardLabel = (pz, head) => pz.newCard ? `${head}: new tower - ${TOWERS[pz.id].short}!` : `${head === "Prize" ? "You won a card" : head}: ${TOWERS[pz.id].short} L${pz.level}`;
  if (out.prize && !celebrating) {
    let k = Math.min(1, (R.t - UI.perfectAnimTime) * 4), pz = out.prize;
    strip(yy + 12, pz, pz.kind === "cards" ? cardLabel(pz, "Prize") : `Prize: +${pz.count} ${BONUSES[pz.id].name} booster`, k);
  }
  if (gift) {
    let k = Math.min(1, (R.t - UI.perfectAnimTime) * 4);
    strip(yy + 12 + (out.prize ? 34 : 0), out.bossGift, cardLabel(out.bossGift, "Boss gift"), k);
  }
  !(out.prize && !celebrating) && !gift && R.win && !R.perfect && S.battle.stats.stolen > 0 && text(ctx, "Tip: lose no food at all for a Perfect prize", 200, yy + 10, 12, "#a08090", "center", null), ctx.restore(), ctx.restore(), MO && rtM > -0.01 && rtM < MO.dur && drawStarMoment(MO, rtM, R.t);
  let released = !MO || R.skipped || rtM >= MOMENT_T.hold;
  if (released && R.pendingFw && (launchFireworks(...R.pendingFw), R.pendingFw = null), released) for (let c of R.confetti)
    c.vy += 420 * dt, c.x += c.vx * dt, c.y += c.vy * dt, c.r += dt * 8, c.y < 760 && candyStar(ctx, c.x, c.y, 4 + c.r * 7 % 3, c.c, 1.2, c.r);
  if (celebrating || MO && !R.skipped && R.t < MO.t0 + MO.dur) return;
  let by = 540;
  if (R.win && ART81) {
    let lvB = S.save.levels[S.levelIndex] || {}, st = lvB.stars || 0, bt = lvB.bestTime || 0;
    text(ctx, `Best: ${"\u2605".repeat(st)}${"\u2606".repeat(Math.max(0, 3 - st))}${bt ? ` \xB7 ${Math.floor(bt / 60)}:${String(bt % 60).padStart(2, "0")}` : ""}`, 200, by - 22, 13, "#7a5a6a", "center", null);
  }
  if (out.zapperGift && zapperGiftPending(S.save)) {
    drawButton(100, by, 200, 50, "Continue", "#9fe0b5"), button("rcontinue", 100, by, 200, 50, () => {
      S.battle = null, go("map");
    });
    return;
  }
  drawButton(52, by, 92, 50, "Map", "#fff3e6"), button("rmap", 52, by - 3, 92, 56, () => {
    S.battle = null, go("map");
  }), drawButton(154, by, 92, 50, "Retry", "#ffd27a"), button("rretry", 154, by - 3, 92, 56, () => openPrep(S.levelIndex));
  let hasNext = R.win && S.levelIndex + 1 < LEVELS.length, ow6 = ART81 && hasNext && S.levelIndex === 49 && out.firstClear && worldUnlocked(S.save, 6);
  drawButton(256, by, 92, 50, ow6 ? "Open World 6" : "Next", "#9fe0b5", ow6 ? { disabled: !hasNext, size: 13 } : { disabled: !hasNext }), hasNext && button("rnext", 256, by - 3, 92, 56, ow6 ? () => {
    S.battle = null, go("map"), S.worldReveal = { i: 50, t0: S.t };
  } : () => openPrep(S.levelIndex + 1));
}
function cardStatKeys(id) {
  return id === "ball" ? ["power", "rate", "ballRadius"] : id === "tractor" ? ["liftSize", "rate", "scoop"] : ["power", "rate", "range"];
}
function specialState(id, level, cl) {
  let T = TOWERS[id];
  return !T || !T.special ? null : cl >= SPECIAL_CARD_LEVEL ? (level ? level.world : highestWorld(S.save)) >= SPECIALS_FROM_WORLD && tuning_default.specials !== !1 ? "active" : "asleep" : "locked";
}
function specialRow(id, st, x, cy, w) {
  let T = TOWERS[id], sp = T.special;
  ctx.save(), starShape ? starShape(ctx, x + 6, cy, 5.5, st === "active" ? "#ffd24a" : "#d4cac2") : (ctx.beginPath(), ctx.arc(x + 6, cy, 4.5, 0, 7), ctx.fillStyle = st === "active" ? "#ffd24a" : "#d4cac2", ctx.fill()), ctx.restore();
  let tx = x + 18, tw = w - 18;
  if (st === "locked") plainFit(`Special unlocks at card level ${SPECIAL_CARD_LEVEL}`, tx, cy, tw, 12, "#8a7f86", "left", "600");
  else if (st === "asleep") {
    ctx.font = `800 12px ${FONT}`;
    let nw = ctx.measureText(sp.name).width;
    plainText(sp.name, tx, cy, 12, "#9a8f7a", "left", "800"), plainFit(`Awakens in World ${SPECIALS_FROM_WORLD}`, tx + nw + 6, cy, tw - nw - 6, 12, "#9a8f7a", "left", "600");
  } else {
    ctx.font = `800 12px ${FONT}`;
    let nw = ctx.measureText(sp.name).width;
    plainText(sp.name, tx, cy, 12, shade(T.color, -0.4), "left", "800"), plainFit(sp.short, tx + nw + 6, cy, tw - nw - 6, 12, INFO_INK, "left", "600");
  }
}
function cardInfoPanel(id, x, y, w, h, opt = {}) {
  let hasSp = !!(id && ART81 && TOWERS[id] && TOWERS[id].special && opt.special !== !1);
  if (panel(x, y, w, h + (hasSp ? 14 : 0), "#ffffff", 14), S.layoutCardPanel = { x, y, w, h }, !id) {
    plainText(opt.hint || "Tap a card to see its stats.", x + w / 2, y + h / 2, 12.5, "#a08090", "center", "600");
    return;
  }
  let T = TOWERS[id], c = S.save.cards[id], own = c.unlocked, L = Math.max(1, c.level), capCard = highestWorldCap();
  fitText(T.name, x + 12 + Math.min(170, 9 * T.name.length) / 2, y + 16, 170, 14.5, "#ff8fab"), plainFit(own ? capCard && capCard < c.level ? `Card L${c.level} - fights as L${capCard}` : `Card L${c.level} (used in battle)` : "Not owned yet", x + w - 12, y + 16, 150, 12, INFO_SOFT, "right", "700");
  let cmp = h < 108;
  plainFit(T.desc, x + 12, y + (cmp ? 33 : 37), w - 24, 12, INFO_INK, "left", "500");
  let Le = capCard ? Math.min(L, capCard) : L, atCap = !!(own && capCard && L >= capCard), next = atCap ? [] : cardUpgradeDiff(id, L), nk = new Set(next.map((d) => d.key)), keys = cardStatKeys(id), bw = (w - 24 - 12) / 3;
  keys.forEach((k, i) => {
    let bx = x + 12 + i * (bw + 6), by = y + (cmp ? 44 : 50);
    rr(ctx, bx, by, bw, cmp ? 36 : 38, 9), ctx.fillStyle = nk.has(k) ? "#eefbe9" : "#f7efeb", ctx.fill(), ctx.lineWidth = nk.has(k) ? 2 : 1.2, ctx.strokeStyle = nk.has(k) ? "#8fd18f" : "#e0cfd4", ctx.stroke(), plainFit(k === "scoop" ? "Scoops" : statLabel(id, k), bx + 7, by + (cmp ? 9.5 : 10), bw - 12, 12, INFO_SOFT, "left", "600"), plainFit(k === "scoop" ? "1 trail tile" : formatStat(id, k, towerStat(id, k, 1, Le)), bx + bw / 2, by + (cmp ? 24.5 : 26), bw - 10, 13.5, INFO_INK, "center", "700");
  });
  let line = atCap ? `At the world cap (L${capCard}): higher cards add nothing yet` : next.length ? `Next card level L${L + 1}: ` + next.map((d) => diffText(id, d)).join(" + ") : "Top card level (L10)!";
  if (plainFit(line, x + w / 2, y + (cmp ? h - 9 : 102), w - 20, 12, next.length ? "#2f8a36" : "#c9962a", "center", "700"), hasSp) {
    let capC = highestWorldCap(), Lc = capC ? Math.min(L, capC) : L;
    specialRow(id, specialState(id, null, own ? Lc : 0), x + 12, y + h + 7, w - 24);
  }
  h > 118 && !opt.noFoot && plainFit(opt.foot || (own ? "Merge cards on its own screen to reach the next level." : `Get it in the Shop (${unlockPrice(id)}c) or as a prize.`), x + w / 2, y + h - 13, w - 20, 12, "#a08090", "center", "600");
}
var CARD_BANDS = [[3, "#d9965f", "#f3c79c"], [6, "#9fb2c8", "#e1e9f2"], [9, "#e8b830", "#ffe9a0"], [10, "#ff7fb8", "#ffd6ec"]];
function cardBand(L) {
  return CARD_BANDS.find((b) => L <= b[0]) || CARD_BANDS[0];
}
function drawCardPic(x, y, w, h, type, opt = {}) {
  let T = TOWERS[type], L = opt.level || 1, [, frame2, frameLt] = cardBand(L), Le = opt.cap ? Math.min(L, opt.cap) : L;
  ctx.save(), opt.dim && (ctx.globalAlpha = 0.42);
  let r = Math.max(7, w * 0.12);
  if (rr(ctx, x, y + 3, w, h, r), ctx.fillStyle = "rgba(74,52,66,0.25)", ctx.fill(), rr(ctx, x, y, w, h, r), opt.locked) {
    ctx.fillStyle = "#ddd3da", ctx.fill(), ctx.lineWidth = 2.5, ctx.strokeStyle = INK, ctx.stroke(), rr(ctx, x + 5, y + 5, w - 10, h - 10, r - 3), ctx.fillStyle = "#eee6eb", ctx.fill(), text(ctx, "?", x + w / 2, y + h * 0.42, w * 0.38, "#fff"), plainFit(opt.lockText || "Locked", x + w / 2, y + h - 13, w - 10, 12, "#7a6a76", "center", "700"), ctx.restore();
    return;
  }
  let fg = ctx.createLinearGradient(x, y, x + w, y + h);
  fg.addColorStop(0, frameLt), fg.addColorStop(0.5, frame2), fg.addColorStop(1, frameLt), ctx.fillStyle = fg, ctx.fill(), ctx.lineWidth = opt.selected ? 4 : 2.4, ctx.strokeStyle = opt.selected ? opt.selCol || "#ff6f91" : INK, ctx.stroke();
  let compact = h < w * 1.1, m = Math.max(4, w * 0.07), ax = x + m, ay = y + m, aw = w - 2 * m, ah = compact ? h - m * 1.6 - 19 : h * 0.66 - m;
  ctx.save(), rr(ctx, ax, ay, aw, ah, r * 0.6), ctx.clip();
  let bg = ctx.createRadialGradient(ax + aw / 2, ay + ah * 0.45, 2, ax + aw / 2, ay + ah * 0.5, aw * 0.8);
  bg.addColorStop(0, shade(T.color, 0.75)), bg.addColorStop(1, shade(T.color, 0.25)), ctx.fillStyle = bg, ctx.fillRect(ax, ay, aw, ah), ctx.globalAlpha *= 0.22;
  for (let i = 0; i < 6; i++)
    ctx.beginPath(), ctx.arc(ax + i * 37 % aw, ay + i * 23 % ah, aw * 0.12, 0, 7), ctx.fillStyle = "#ffffff", ctx.fill();
  ctx.globalAlpha = opt.dim ? 0.42 : 1, ctx.beginPath(), ctx.ellipse(ax + aw / 2, ay + ah * 0.86, aw * 0.36, ah * 0.08, 0, 0, 7), ctx.fillStyle = "rgba(74,52,66,0.18)", ctx.fill();
  let s = (compact ? Math.min(aw / 50, ah / 46) : Math.min(aw / 54, ah / 56)) * (T.place === "path" ? 1.15 : 1);
  ctx.translate(ax + aw / 2, ay + ah * (compact ? 0.72 : 0.62)), ctx.scale(s, s), drawTower(ctx, type, opt.still ? 0 : S.t, null), ctx.restore(), rr(ctx, ax, ay, aw, ah, r * 0.6), ctx.lineWidth = 1.6, ctx.strokeStyle = "rgba(74,52,66,0.55)", ctx.stroke();
  let by = ay + ah + (compact ? 2 : 3), bh = compact ? 16 : Math.max(16, h * 0.16);
  rr(ctx, x + m * 0.6, by, w - m * 1.2, bh, bh * 0.4), ctx.fillStyle = shade(T.color, -0.15), ctx.fill(), ctx.lineWidth = 1.6, ctx.strokeStyle = INK, ctx.stroke(), fitText(T.short || T.name, x + w / 2, by + bh / 2 + 0.5, w - m * 1.2 - 3.4, Math.min(14, Math.max(12, bh * 0.78)), "#fff");
  let py = by + bh + (y + h - by - bh) / 2, n = MAX_CARD_LEVEL, gap = Math.min(7, (w - 2 * m - 6) / n);
  if (!compact) for (let i = 0; i < n; i++)
    ctx.beginPath(), ctx.arc(x + w / 2 - (n - 1) * gap / 2 + i * gap, py, Math.max(1.6, gap * 0.32), 0, 7), ctx.fillStyle = i < Le ? "#fff6c0" : "rgba(74,52,66,0.25)", ctx.fill();
  let bs = Math.max(12, w * 0.15), capped = Le < L, bcx = x + bs * 0.75, bcy = y + bs * 0.75;
  if (blob(ctx, bcx, bcy, bs, bs * 0.92, capped ? "#ffc2d4" : "#ffe36e", 2), text(ctx, "L" + Le, bcx, bcy + 0.5, 12, "#7a4a2a", "center", null), capped) {
    let tx = bcx + bs * 0.62, ty = bcy + bs * 0.66;
    ctx.beginPath(), ctx.moveTo(tx - 4, ty - 3), ctx.lineTo(tx + 4, ty - 3), ctx.lineTo(tx, ty + 3.4), ctx.closePath(), ctx.fillStyle = "#b0506a", ctx.fill(), ctx.lineWidth = 1.5, ctx.lineJoin = "round", ctx.strokeStyle = INK, ctx.stroke();
  }
  if (opt.tag && !opt.badge) {
    let tag = T.place === "path" ? "on trail" : T.targets === "air" ? "air only" : type === "laser" ? "gnd+air" : "";
    tag && text(ctx, tag, ax + aw - 3, ay + 8, 12, "#fff", "right");
  }
  if (opt.badge && (blob(ctx, x + w - 11, y + 11, 11, 11, "#ff8fab", 2), text(ctx, opt.badge, x + w - 11, y + 11.5, 12, "#fff")), opt.count != null) {
    let str = `\xD7${opt.count}`;
    ctx.font = `bold 12px ${FONT}`;
    let cw2 = Math.max(24, ctx.measureText(str).width + 10);
    rr(ctx, x + w - cw2 - 2, y + 3, cw2, 18, 9), ctx.fillStyle = opt.count ? "#ffffff" : "#efe6ea", ctx.fill(), ctx.lineWidth = 1.8, ctx.strokeStyle = INK, ctx.stroke(), text(ctx, str, x + w - cw2 / 2 - 2, y + 12.5, 12, opt.count ? "#ff6f91" : "#b9a6b2");
  }
  if (opt.mergeReady) {
    let p = 1 + Math.sin(S.t * 6) * 0.08;
    ctx.save(), ctx.translate(x + w - 10, y + 10), ctx.scale(p, p), blob(ctx, 0, 0, 11, 11, "#ff6f91", 2), text(ctx, "!", 0, 0.5, 14, "#fff"), ctx.restore();
  }
  opt.spStar && (ctx.beginPath(), ctx.arc(x + 11, y + 32, 8.5, 0, 7), ctx.fillStyle = "#5a4058", ctx.fill(), starShape(ctx, x + 11, y + 32, 5.8, "#ffd24a", 1.2)), opt.fresh && (rr(ctx, x + w / 2 - 19, y - 9, 38, 17, 8), ctx.fillStyle = "#ffd45e", ctx.fill(), ctx.lineWidth = 2, ctx.strokeStyle = INK, ctx.stroke(), text(ctx, "NEW", x + w / 2, y - 0.5, 12, "#fff")), ctx.restore();
}
function doMergeAll() {
  let done = mergeAll(S.save);
  if (!done.length) {
    toast(anyMergeReady(S.save) ? "Not enough coins" : "Nothing to merge yet - 3 cards of a level make 1 of the next");
    return;
  }
  persist(), sfx("upgrade");
  let top = done.reduce((a, d) => d.to > a.to ? d : a, done[0]);
  S.mergeAnim = { id: top.id, from: top.from, to: top.to, n: 3, t: 0, all: done.length };
}
function renderCards() {
  panel(12, 12, 376, 636, "#fff6ee"), text(ctx, "Cards", 200, 36, 26, "#b5d8ff"), ART81 && (drawButton(274, 16, 106, 36, "Ant Book", "#d6f0c8", { size: 13 }), button("antbook", 274, 8, 106, 52, () => {
    sfx("tap"), S.screen = "antbook", S.antBookSel = null;
  })), coinIcon(ctx, 304, 60, 1), text(ctx, String(S.save.coins), 336, 61, 15, "#ffd45e"), plainText("Tap a card: stats.  Tap again: open.", 28, 60, 12, "#7a5a6a", "left", "600"), S.layoutMerge = [], ALL_CARDS.forEach((id, k) => {
    let col = k % 4, row = Math.floor(k / 4), x = 30 + col * 88, y = 80 + row * 104, w = 76, h = 96, c = S.save.cards[id], ready = c.unlocked && mergeReady(S.save, id);
    drawCardPic(x, y, w, h, id, { locked: !c.unlocked, lockText: "Shop or prize", level: c.level, selected: S.cardsSel === id, mergeReady: ready, fresh: c.fresh, spStar: !!(ART81 && c.unlocked && specialState(id, null, Math.min(c.level, highestWorldCap() || 99)) === "active") }), button("card" + id, x, y, w, h, () => {
      S.cardsSel === id && c.unlocked ? openCardView(id) : S.cardsSel = id, sfx("tap");
    }), ready && S.layoutMerge.push(id);
  }), cardInfoPanel(S.cardsSel, 24, 490, 352, 98, { hint: "Tap a card to see its stats.", noFoot: !0 });
  let anyReady = anyMergeReady(S.save);
  if (!!(S.cardsSel && S.save.cards[S.cardsSel].unlocked)) {
    let ready = mergeReady(S.save, S.cardsSel);
    drawButton(24, 604, 172, 34, ready ? "Open card  !" : "Open card", ready ? "#ff9ec0" : "#fff3e6", { size: 15, r: 12 }), button("open" + S.cardsSel, 24, 590, 172, 58, () => openCardView(S.cardsSel));
  }
  if (drawButton(204, 604, 172, 34, "Merge all", anyReady ? "#9fe0b5" : "#e6dce2", { size: 15, r: 12, disabled: !anyReady }), button("mergeAll", 204, 590, 172, 58, doMergeAll), S.mergeAnim) renderMergeAnim();
  else if (S.save.onboard && S.save.onboard.cardsHint === "cards" && S.save.cards.zapper.unlocked) {
    let k = ALL_CARDS.indexOf("zapper"), x = 30 + k % 4 * 88, y = 80 + Math.floor(k / 4) * 104;
    onboardSpot(
      { x, y, w: 76, h: 96, r: 12 },
      "cardzapper",
      () => {
        S.save.onboard.cardsHint = "done", ART81 && armNextHint(S.save, "card"), persist(), openCardView("zapper");
      },
      "Your Bug Zapper - it hits flying ants!",
      { x: 122, y: 80 + Math.floor((ALL_CARDS.length - 1) / 4) * 104 + 28, w: 272 }
    );
  }
}
function openCardView(id) {
  S.cardView = id, S.cardsSel = id;
  let c = S.save.cards[id];
  c.fresh && (c.fresh = !1, persist()), go("card");
}
function highestWorldCap() {
  let W2 = WORLDS.find((x) => x.id === highestWorld(S.save));
  return W2 && W2.cardLevelCap || null;
}
function worldCapLine() {
  let top = Math.max(2, highestWorld(S.save));
  return WORLDS.filter((W2) => W2.id <= top && W2.cardLevelCap).map((W2, k) => k === 0 ? `W${W2.id} acts as L${W2.cardLevelCap}` : `W${W2.id} as L${W2.cardLevelCap}`).join(", ");
}
function renderCardView() {
  let id = S.cardView, T = TOWERS[id], c = S.save.cards[id];
  panel(12, 12, 376, 636, "#fff6ee"), text(ctx, T.name, 200, 36, 24, "#b5d8ff"), drawButton(22, 18, 66, 28, "Back", "#fff3e6", { size: 13, r: 10 }), button("cvBack", 14, 8, 84, 48, () => go("cards")), drawCardPic(28, 58, 104, 136, id, { level: c.level, locked: !c.unlocked });
  let capNow = highestWorldCap();
  plainText(c.unlocked ? `Fights as L${capNow ? Math.min(c.level, capNow) : c.level}` : "Not unlocked yet", 146, 76, 15, INFO_INK, "left", "800"), plainText("3 cards of a level \u2192 1 of the next", 146, 98, 12, INFO_SOFT, "left", "600"), plainText("Your highest level fights.", 146, 114, 12, INFO_SOFT, "left", "600"), c.unlocked && plainFit(worldCapLine(), 146, 130, 236, 12, INFO_SOFT, "left", "700"), plainText(`Cards held: ${totalCards(c)}`, 146, 146, 12, INFO_SOFT, "left", "600"), coinIcon(ctx, 158, 170, 1), text(ctx, String(S.save.coins), 190, 171, 15, "#ffd45e");
  let rows = mergeRows(S.save, id);
  plainText("Your cards by level", 28, 212, 12, "#3d2a36", "left", "800"), rows.forEach((r, k) => {
    let col = k % 5, row = Math.floor(k / 5), x = 26 + col * 70, y = 224 + row * 138, w = 62, h = 80;
    if (drawCardPic(x, y, w, h, id, { level: r.L, count: r.have, dim: r.have === 0, still: !0 }), r.maxed) {
      plainText("top level", x + w / 2, y + h + 16, 12, "#c9962a", "center", "700");
      return;
    }
    let can = canMergeAt(S.save, id, r.L);
    plainFit(`${Math.min(r.have, r.need)}/${r.need}`, x + w / 2, y + h + 9, w, 12, r.ready ? "#2f8a36" : "#a08090", "center", "700"), drawButton(x, y + h + 17, w, 24, `\u2192 L${r.to}`, can ? "#ff9ec0" : "#e6dce2", { size: 12, r: 9, disabled: !can }), r.coins && plainFit(`${r.coins} coins`, x + w / 2, y + h + 50, w, 12, "#c9962a", "center", "700"), button("mrg" + r.L, x - 3, y + h + 2, w + 6, 58, () => {
      if (!r.ready) {
        toast(`Need ${r.need} cards of level ${r.L}`);
        return;
      }
      if (S.save.coins < r.coins) {
        toast(`Need ${r.coins} coins`);
        return;
      }
      let res = mergeAt(S.save, id, r.L);
      res && (persist(), sfx("upgrade"), S.mergeAnim = { id, from: r.L, to: res.to, n: r.need, t: 0 });
    });
  }), cardInfoPanel(id, 24, 497, 352, 97, {});
  let ready = mergeReady(S.save, id);
  drawButton(24, 604, 352, 34, "Merge all", ready ? "#9fe0b5" : "#e6dce2", { size: 15, r: 12, disabled: !anyMergeReady(S.save) }), button("cvMergeAll", 24, 604, 352, 44, doMergeAll), S.mergeAnim && renderMergeAnim();
}
function renderMergeAnim() {
  let MA = S.mergeAnim;
  MA.t += 1 / 60 * (ART81 ? 2.3 / 1.5 : 1);
  let T = UI.mergeAnimTime, k = MA.t / T;
  ctx.save(), ctx.fillStyle = `rgba(60,40,55,${Math.min(0.55, k * 3)})`, ctx.fillRect(-2e3, -2e3, W + 4e3, H + 4e3), ctx.restore();
  let cx = 200, cy = 330, n = Math.min(6, MA.n || 3);
  if (k < 0.45)
    for (let i = 0; i < n; i++) {
      let a = i / n * Math.PI * 2 + k * 3, q = Math.min(1, k / 0.42), r = 150 * (1 - q * q);
      ctx.save(), ctx.translate(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.8), ctx.rotate(a + k * 8), ctx.scale(0.55, 0.55), drawCardPic(-40, -54, 80, 108, MA.id, { level: MA.from, still: !0 }), ctx.restore();
    }
  let grow = k < 0.45 ? 1 : k < 0.6 ? 1 + (k - 0.45) / 0.15 * 0.35 : 1.35 - Math.min(0.15, (k - 0.6) * 0.6);
  if (ctx.save(), ctx.translate(cx, cy), ctx.scale(grow * 1.4, grow * 1.4), drawCardPic(-40, -54, 80, 108, MA.id, { level: k < 0.55 ? MA.from : MA.to }), ctx.restore(), k > 0.45 && k < 0.75 && (ctx.save(), ctx.globalAlpha = 1 - (k - 0.45) / 0.3, ctx.beginPath(), ctx.arc(cx, cy, 40 + (k - 0.45) * 400, 0, 7), ctx.fillStyle = "rgba(255,255,230,0.85)", ctx.fill(), ctx.restore()), k > 0.5) {
    for (let i = 0; i < 12; i++) {
      let a = i / 12 * Math.PI * 2, d2 = 60 + (k - 0.5) * 260;
      ctx.save(), ctx.globalAlpha = Math.max(0, 1 - (k - 0.5) * 2), starShape(ctx, cx + Math.cos(a) * d2, cy + Math.sin(a) * d2, 6, "#ffe36e", 1.4), ctx.restore();
    }
    let bs = k < 0.62 ? 0.5 + (k - 0.5) / 0.12 : 1;
    ctx.save(), ctx.translate(cx, cy - 110), ctx.scale(bs, bs), text(ctx, `3 \xD7 L${MA.from}  \u2192  L${MA.to}`, 0, 0, 28, "#ffe36e");
    let d = MA.to >= 2 ? cardUpgradeDiff(MA.id, MA.to - 1) : [];
    fitText(MA.all > 1 ? `${MA.all} merges done!` : d.length ? `L${MA.to}: ` + d.map((q) => diffText(MA.id, q)).join(" + ") : "", 0, 34, 330, 14, "#ffffff"), ctx.restore();
  }
  ctx.save(), rr(ctx, cx - 70, 600, 140, 26, 13), ctx.fillStyle = "rgba(60,40,55,0.85)", ctx.fill(), ctx.restore(), text(ctx, "Tap to continue", cx, 614, 12, "#ffffff", "center", null), button("mergeSkip", -2e3, -2e3, W + 4e3, H + 4e3, () => {
    S.mergeAnim = null;
  }), MA.t >= T + 0.8 && (S.mergeAnim = null);
}
var SHOP_FX = { cardPulse: 0.05, countPulse: 0.28, time: 0.45 };
function shopPulse(kind, id) {
  let f = S.shopFx;
  if (!f || f.kind !== kind || f.id !== id) return null;
  let k = (S.t - f.t0) / SHOP_FX.time;
  return k >= 1 ? null : k;
}
function shopBought(kind, id, price, cur) {
  S.shopFx = { kind, id, t0: S.t };
  let at = cur === "diamond" ? { x: 152, y: 92 } : { x: 290, y: 92 };
  addUi({ k: "priceFloat", cur, n: price, x: at.x, y: at.y, life: 1.1, max: 1.1 });
}
function countBadge(x, y, n, k) {
  let sc = k == null ? 1 : 1 + SHOP_FX.countPulse * Math.sin(Math.min(1, k) * Math.PI);
  ctx.save(), ctx.translate(x, y), ctx.scale(sc, sc);
  let str = `\xD7${n}`;
  ctx.font = `bold 15px ${FONT}`;
  let w = Math.max(30, ctx.measureText(str).width + 14);
  rr(ctx, -w / 2, -12, w, 24, 12), ctx.fillStyle = k == null ? "#ffffff" : "#fff3b0", ctx.fill(), ctx.lineWidth = 2.2, ctx.strokeStyle = INK, ctx.stroke(), text(ctx, str, 0, 0.5, 15, "#ff6f91"), ctx.restore();
}
function renderShop() {
  let E = ECONOMY.shop;
  panel(12, 12, 376, 636, "#fff6ee"), text(ctx, "Shop", 200, 36, 28, "#ffd27a"), ART81 && (drawButton(274, 16, 106, 36, `Cabinet ${skinState(S.save).owned.length}/${SKINS.length}`, "#ffd0e6", { size: 13 }), button("cabinet", 274, 8, 106, 52, () => {
    sfx("tap"), S.screen = "cabinet";
  })), panel(62, 56, 132, 32, "#e6f5ff", 16), diamondIcon(ctx, 84, 72, 1), text(ctx, String(S.save.diamonds || 0), 140, 73, 17, "#7fd3ff"), panel(206, 56, 132, 32, "#fff1d6", 16), coinIcon(ctx, 228, 72, 1.1), text(ctx, String(S.save.coins), 284, 73, 17, "#ffd45e"), plainText("No real money, ever. Diamonds come from Daily Rewards.", 200, 101, 12, "#a08090", "center", "600"), panel(26, 112, 348, 62, "#ffe9f0", 14);
  for (let k = 0; k < 3; k++)
    ctx.save(), ctx.translate(58 + k * 14, 146 - k * 3), ctx.rotate(-0.2 + k * 0.2), rr(ctx, -14, -20, 28, 38, 6), ctx.fillStyle = ["#ffb3c1", "#b5d8ff", "#ffd27a"][k], ctx.fill(), ctx.lineWidth = 2, ctx.strokeStyle = INK, ctx.stroke(), text(ctx, "?", 0, 0, 16), ctx.restore();
  let gift = zapperGiftPending(S.save);
  if (gift)
    text(ctx, `FREE pack: ${E.cardPackSize} cards!`, 112, 132, 14, "#e0607e", "left", null), text(ctx, `${E.cardPackSize - 1} random + Zapper`, 112, 152, 12, "#a08090", "left", null), drawButton(290, 122, 74, 40, "FREE", "#9fe0b5", { size: 17 });
  else {
    text(ctx, `Card pack: ${E.cardPackSize} random cards`, 112, 132, 13, "#7a4a5a", "left", null);
    {
      let left = Math.max(1, (E.packPity || 0) - (S.save.packsSinceNew || 0));
      plainFit(lockedCards(S.save).length ? `level 1, ${Math.round(E.packNewTowerChance * 100)}% NEW tower${E.packPity ? ` (sure in ${left})` : ""}` : "level 1, any unlocked tower", 112, 152, 172, 12, "#a08090", "left", "700");
    }
    drawButton(290, 122, 74, 40, `${E.cardPack}c`, "#9fe0b5", { size: 15, disabled: S.save.coins < E.cardPack }), button("pack", 286, 119, 82, 46, () => {
      let got = buyPack(S.save);
      got ? (persist(), shopBought("pack", "pack", E.cardPack, "coin"), openPackReveal(got, { source: "paid", newTower: got.newTower })) : toast("Not enough coins");
    });
  }
  plainText(`Tap a card to buy: level-1 card ${E.cardL1}c, new tower 100-400c`, 30, 188, 12, "#7a5a6a", "left", "700"), ALL_CARDS.forEach((id, k) => {
    let col = k % 5, row = Math.floor(k / 5), x = 24 + col * 71, y = 200 + row * 84, w = 64, h = 62, c = S.save.cards[id], own = c.unlocked, up = unlockPrice(id), pk = shopPulse("card", id), cs = pk == null ? 1 : 1 + SHOP_FX.cardPulse * Math.sin(pk * Math.PI);
    ctx.save(), ctx.translate(x + w / 2, y + h / 2), ctx.scale(cs, cs), ctx.translate(-(x + w / 2), -(y + h / 2)), drawCardPic(x, y, w, h, id, { level: c.level, locked: !own, lockText: `Unlock ${up}c`, selected: S.shopSel === id, selCol: "#5a9fe0" }), ctx.restore(), own && countBadge(x + w - 17, y + 13, totalCards(c), pk), blob(ctx, x + 10, y + h + 10, 8, 8, S.shopSel === id ? "#5a9fe0" : "#d7e8ff", 1.6), text(ctx, "i", x + 10, y + h + 10.5, 12, "#fff"), plainText(own ? `${E.cardL1}c` : `${up}c`, x + w - 4, y + h + 10, 12, own ? "#c9962a" : "#e0607e", "right", "800"), button("buy" + id, x, y, w, h, () => {
      S.shopSel = id, own ? buyCard(S.save, id) ? (persist(), sfx("tap"), shopBought("card", id, E.cardL1, "coin")) : toast("Not enough coins") : buyCardUnlock(S.save, id) ? (persist(), sfx("upgrade"), shopBought("card", id, up, "coin"), queueReveal(id, 1, !0, S.t + 0.3)) : toast(`Need ${up} coins`);
    }), button("info" + id, x - 6, y + h - 22, 48, 44, () => {
      S.shopSel = S.shopSel === id ? null : id, sfx("tap");
    });
  });
  let by = 462;
  {
    let bl = `Boosters - ${E.boosterDiamonds} diamonds each`;
    plainText(bl, 30, by, 12, "#7a5a6a", "left", "700"), diamondIcon(ctx, 30 + ctx.measureText(bl).width + 12, by, 0.7);
  }
  BONUS_TYPES.forEach((bt, k) => {
    let x = 26 + k * 88, y = by + 10, w = 80, h = 56, pk = shopPulse("booster", bt), cs = pk == null ? 1 : 1 + SHOP_FX.cardPulse * Math.sin(pk * Math.PI);
    ctx.save(), ctx.translate(x + w / 2, y + h / 2), ctx.scale(cs, cs), ctx.translate(-(x + w / 2), -(y + h / 2)), rr(ctx, x, y, w, h, 14), ctx.fillStyle = shade(BONUSES[bt].color, 0.2), ctx.fill(), ctx.lineWidth = 2.5, ctx.strokeStyle = INK, ctx.stroke(), ctx.save(), ctx.translate(x + w / 2, y + 22), ctx.scale(1.05, 1.05), drawBonusIcon(ctx, bt, S.t), ctx.restore(), fitText(BONUSES[bt].name, x + w / 2, y + 46, w - 8, 12, "#fff"), ctx.restore(), countBadge(x + w - 19, y + 15, S.save.bonusStock[bt] || 0, pk), button("bbuy" + bt, x, y, w, h, () => {
      buyBonus(S.save, bt) ? (persist(), sfx("tap"), shopBought("booster", bt, E.boosterDiamonds, "diamond")) : toast(`Need ${E.boosterDiamonds} diamonds`);
    });
  }), cardInfoPanel(S.shopSel, 24, 534, 352, 108, { hint: "Tap (i) under a card to see its stats." }), gift && !S.reveal.length && !S.pack ? onboardSpot({ x: 286, y: 118, w: 82, h: 48, r: 14 }, "gift", claimGift, "Your free pack - tap it!") : !S.pack && !S.reveal.length && S.save.onboard && S.save.onboard.cardsHint === "shop" && onboardSpot(tabRect(1), "tocards", () => {
    S.save.onboard.cardsHint = "cards", persist(), go("cards");
  }, "See your new cards!"), renderUiFx(1 / 60);
}
function antLabelLines(name, w) {
  ctx.font = `bold 12px ${FONT}`;
  let sp = name.indexOf(" ");
  return ctx.measureText(name).width <= w - 8 || sp < 0 ? [name] : [name.slice(0, sp), name.slice(sp + 1)];
}
function renderAntBook() {
  let met = metAnts(S.save), keys = Object.keys(ANTS);
  panel(12, 12, 376, 636, "#fff6ee"), text(ctx, "Ant Book", 200, 36, 26, "#9fd08a"), drawButton(22, 16, 72, 36, "Back", "#d9cfe0", { size: 14 }), button("abBack", 22, 14, 72, 42, () => {
    sfx("tap"), S.antBookSel ? S.antBookSel = null : S.screen = "cards";
  });
  let sel = S.antBookSel && met.has(S.antBookSel) ? S.antBookSel : null;
  if (!sel)
    plainText(`Met ${keys.filter((k) => met.has(k)).length}/${keys.length}. Tap an ant for details.`, 200, 70, 12, "#7a5a6a", "center", "700"), keys.forEach((t, k) => {
      let col = k % 4, row = Math.floor(k / 4), x = 24 + col * 88, y = 86 + row * 92, w = 80, h = 84, D = ANTS[t], m = met.has(t);
      rr(ctx, x, y, w, h, 12), ctx.fillStyle = m ? "#fff" : "#efe3de", ctx.fill(), ctx.lineWidth = 2.2, ctx.strokeStyle = INK, ctx.stroke();
      let nm = m ? antLabelLines(D.name.replace(" Ant", ""), w) : null, two = !!nm && nm.length > 1;
      ctx.save(), rr(ctx, x + 2, y + 2, w - 4, h - 26 - (two ? 12 : 0), 10), ctx.clip(), ctx.translate(x + w / 2, y + 40 - (two ? 6 : 0));
      let sz = Math.min(1, 1.3 / D.size);
      ctx.scale(0.82 * sz, 0.82 * sz), m ? drawAnt(ctx, t, S.t * 1.3 % 1) : (ctx.globalAlpha = 0.35, drawAnt(ctx, t, 0), ctx.globalAlpha = 0.78, ctx.fillStyle = "#efe3de", ctx.fillRect(-26, -26, 52, 52)), ctx.restore(), m ? nm.forEach((ln, i) => fitText(ln, x + w / 2, y + 70 - (two ? 12 : 0) + (two ? i * 12 : 0), w - 8, 12, "#7a4a5e")) : plainText("???", x + w / 2, y + 70, 13, "#b9a6b2", "center", "800"), m && button("ab" + t, x, y, w, h, () => {
        S.antBookSel = t, sfx("tap");
      });
    });
  else {
    let D = ANTS[sel], lv = antLevels(sel);
    ctx.save(), ctx.translate(200, 168);
    let sz = Math.min(1, 1.3 / D.size);
    ctx.scale(1.9 * sz, 1.9 * sz), D.flying || contactShadow(ctx, 0, 16, 22, 5, 0.22), drawAnt(ctx, sel, S.t * 1.3 % 1), ctx.restore(), text(ctx, D.name, 200, 226, 22, "#7a4a5e");
    let mx = { hp: Math.max(...Object.values(ANTS).map((a) => a.hp)), speed: Math.max(...Object.values(ANTS).map((a) => a.speed)) };
    [["HP", Math.log(1 + D.hp) / Math.log(1 + mx.hp), `${D.hp}`, "#ff8aa0"], ["Armor", Math.min(1, (D.armor || 0) / 6), `${D.armor || 0}`, "#8fb8f0"], ["Speed", D.speed / mx.speed, `${D.speed}`, "#9fe0b5"]].forEach(([l, f, v, c], i) => {
      let y = 258 + i * 28;
      text(ctx, l, 46, y + 8, 13, "#7a5a6a", "left", null), rr(ctx, 110, y, 200, 16, 8), ctx.fillStyle = "#f0e0d8", ctx.fill(), ctx.lineWidth = 2, ctx.strokeStyle = INK, ctx.stroke(), f > 0.03 && (rr(ctx, 112, y + 2, 196 * Math.min(1, f), 12, 6), ctx.fillStyle = c, ctx.fill()), text(ctx, v, 350, y + 8, 13, "#7a5a6a", "right", null);
    }), D.flying && text(ctx, "Flies: only air-capable towers hit it", 200, 348, 12, "#4a90e2", "center", null);
    let lines = wrapLines(ANT_CARD[sel] || D.intro || D.desc || "", 320, 14);
    lines.forEach((l, k) => text(ctx, l, 200, 376 + k * 19, 14, "#5a4652", "center", null));
    let shown = lv.slice(0, 12).map((n) => `L${n}`).join(" "), ly = 376 + lines.length * 19 + 16;
    text(ctx, "Seen on", 200, ly, 13, "#7a5a6a", "center", null), wrapLines(shown + (lv.length > 12 ? " ..." : ""), 320, 13).forEach((l, k) => text(ctx, l, 200, ly + 20 + k * 16, 13, "#a08090", "center", null));
  }
}
function renderCabinet() {
  let st = skinState(S.save);
  panel(12, 12, 376, 636, "#fff6ee"), text(ctx, "Cabinet", 200, 36, 28, "#ffd27a"), drawButton(22, 16, 72, 36, "Back", "#d9cfe0", { size: 14 }), button("cabBack", 22, 14, 72, 42, () => {
    sfx("tap"), S.screen = "shop";
  }), panel(206, 56, 132, 32, "#fff1d6", 16), coinIcon(ctx, 228, 72, 1.1), text(ctx, String(S.save.coins), 284, 73, 17, "#ffd45e"), plainText("Skins change a pad colour only - never stats.", 200, 108, 12, "#7a5a6a", "center", "700"), SKIN_TOWERS.forEach((tw, i) => {
    let y0 = 124 + i * 114;
    plainText(TOWERS[tw].name, 30, y0 + 8, 14, "#7a4a5a", "left", "800"), [{ id: null, name: "Classic", pad: TOWER_PAD[tw] }].concat(SKINS.filter((x) => x.tower === tw)).forEach((ch2, k) => {
      let x = 26 + k * 88, y = y0 + 18, w = 80, h = 86, own = ch2.id == null || st.owned.includes(ch2.id), on = (st.equipped[tw] || null) === ch2.id;
      rr(ctx, x, y, w, h, 14), ctx.fillStyle = own ? "#fff" : "#f3e6e0", ctx.fill(), ctx.lineWidth = on ? 4 : 2.5, ctx.strokeStyle = on ? "#52b955" : INK, ctx.stroke(), ctx.beginPath(), ctx.ellipse(x + w / 2, y + 28, 22, 12, 0, 0, 7), ctx.fillStyle = ch2.pad, ctx.fill(), ctx.lineWidth = 2.2, ctx.strokeStyle = INK, ctx.stroke(), ctx.beginPath(), ctx.ellipse(x + w / 2, y + 25, 16, 6, 0, Math.PI * 1.05, Math.PI * 1.95), ctx.lineWidth = 2, ctx.strokeStyle = "rgba(255,255,255,0.45)", ctx.stroke(), fitText(ch2.name, x + w / 2, y + 54, w - 8, 12, "#7a5a6a");
      let lab = on ? "On" : own ? "Owned" : `${ch2.price}c`, col = on ? "#3a9a45" : own ? "#7a5a6a" : S.save.coins >= ch2.price ? "#c9962a" : "#e0607e";
      plainText(lab, x + w / 2, y + 73, 13, col, "center", "800"), button("skin" + (ch2.id || tw), x, y, w, h, () => {
        if (own) {
          equipSkin(S.save, tw, ch2.id), persist(), sfx("tap");
          return;
        }
        let r = buySkin(S.save, ch2.id);
        r.ok ? (persist(), sfx("upgrade"), toast(`${ch2.name} unlocked!`)) : toast(r.reason === "coins" ? `Need ${ch2.price} coins` : "Not available");
      });
    });
  });
  let nx = nextSkinPrice(S.save);
  plainText(`Owned ${st.owned.length}/${SKINS.length}${nx ? ` - next skin ${nx}c` : " - all collected!"}`, 200, 612, 13, "#7a5a6a", "center", "700");
}
function claimGift() {
  let res = claimZapperGift(S.save);
  res && (persist(), S.shopFx = { kind: "pack", id: "pack", t0: S.t }, openPackReveal(res.got, { source: "free", newTower: res.zapper.newType ? "zapper" : null, zapperOwned: res.zapperOwned }));
}
function queueReveal(id, level, newType, at = S.t) {
  S.reveal.push({ id, level, newType: !!newType, at, t: 0 });
}
function renderReveal(dt) {
  let R = S.reveal[0];
  R.t += dt;
  let k = Math.min(1, R.t / 0.45);
  ctx.save(), ctx.fillStyle = `rgba(50,32,46,${0.72 * k})`, ctx.fillRect(-2e3, -2e3, W + 4e3, H + 4e3), ctx.restore(), ctx.save(), ctx.translate(200, 330);
  for (let i = 0; i < 14; i++) {
    let a = i / 14 * Math.PI * 2 + R.t * 0.4;
    ctx.save(), ctx.rotate(a), ctx.globalAlpha = 0.18 * k, ctx.beginPath(), ctx.moveTo(0, 0), ctx.lineTo(230, -22), ctx.lineTo(230, 22), ctx.closePath(), ctx.fillStyle = "#fff3a8", ctx.fill(), ctx.restore();
  }
  let sc = (0.3 + 0.7 * (1 - Math.pow(1 - k, 3))) * 1.9 + Math.sin(R.t * 3) * 0.03;
  ctx.rotate((1 - k) * -0.6), ctx.scale(sc, sc), drawCardPic(-42, -56, 84, 112, R.id, { level: R.level }), ctx.restore();
  for (let i = 0; i < 8; i++) {
    let a = R.t * 1.2 + i * Math.PI / 4;
    starShape(ctx, 200 + Math.cos(a) * 130, 330 + Math.sin(a) * 140, 5 + i % 3, "#ffe36e", 1.2);
  }
  let ts = 34 + Math.max(0, 0.3 - R.t) * 40;
  text(ctx, "NEW CARD!", 200, 108, ts, "#ffe36e"), text(ctx, `${TOWERS[R.id].name}  \xB7  Level ${R.level}`, 200, 152, 18, "#ffffff"), plainText("Added to your Cards", 200, 548, 13, "#ffe9c0", "center", "700"), R.t > 0.5 && (rr(ctx, 130, 588, 140, 30, 15), ctx.fillStyle = "rgba(255,255,255,0.18)", ctx.fill(), text(ctx, "Tap to continue", 200, 603, 13, "#ffffff", "center", null)), button("revealNext", -2e3, -2e3, W + 4e3, H + 4e3, () => {
    R.t > 0.4 && (S.reveal.shift(), sfx("tap"));
  });
}
var PACK = {
  dim: 0.15,
  drop: 0.2,
  shake: 0.45,
  burst: 0.6,
  deal0: 0.6,
  dealStep: 0.08,
  dealDur: 0.2,
  flip0: 1.15,
  flipStep: 0.15,
  flipDur: 0.22,
  pip: 0.15,
  beat: 0.4,
  summary: 2,
  summaryNew: 2.4,
  fade: 0.15,
  tapHint: 0.3,
  cardW: 64,
  cardH: 86,
  gap: 8,
  rowY: 250,
  packX: 200,
  packY: 330
}, HAPTIC_MS = { light: 12, medium: 26, heavy: [40, 30, 60] };
function haptic(kind) {
  if (!(!ART81 || !HAPTIC_MS[kind]) && !(S.save && S.save.settings && S.save.settings.haptics === !1))
    try {
      (window.__hapticLog || (window.__hapticLog = [])).push(kind), typeof navigator < "u" && navigator.vibrate && navigator.vibrate(HAPTIC_MS[kind]);
    } catch {
    }
}
function reducedMotion() {
  let rmS = S.save && S.save.settings && S.save.settings.reduceMotion;
  if (rmS === "on") return !0;
  if (rmS === "off") return !1;
  try {
    return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  } catch {
    return !1;
  }
}
function packSlotX(i) {
  return 24 + i * (PACK.cardW + PACK.gap);
}
function prerenderCard(draw, w, h) {
  let k = dpr * scale, pad2 = 6, cv = makeCanvas(Math.ceil((w + pad2 * 2) * k), Math.ceil((h + pad2 * 2) * k)), g = cv.getContext("2d");
  g.scale(k, k);
  let keep = ctx;
  ctx = g;
  try {
    draw(pad2, pad2);
  } finally {
    ctx = keep;
  }
  return { cv, pad: pad2 };
}
function drawCardBack(x, y, w, h) {
  rr(ctx, x, y + 3, w, h, 8), ctx.fillStyle = "rgba(74,52,66,0.25)", ctx.fill(), rr(ctx, x, y, w, h, 8), ctx.fillStyle = "#ff9eb5", ctx.fill(), ctx.lineWidth = 2.4, ctx.strokeStyle = INK, ctx.stroke(), rr(ctx, x + 5, y + 5, w - 10, h - 10, 6), ctx.fillStyle = "#ffd1dc", ctx.fill();
  for (let i = 0; i < 9; i++) {
    let cx = x + 12 + i % 3 * ((w - 24) / 2), cy = y + 14 + Math.floor(i / 3) * ((h - 28) / 2);
    ctx.beginPath(), ctx.arc(cx, cy, 3.2, 0, 7), ctx.fillStyle = "#e8b06a", ctx.fill(), ctx.lineWidth = 1.2, ctx.strokeStyle = INK, ctx.stroke();
  }
}
function openPackReveal(ids, opt = {}) {
  let counts = {};
  for (let id of ids) counts[id] = (counts[id] || 0) + 1;
  let seen = {}, cards = ids.map((id, i) => {
    let c = S.save.cards[id], before = countAt(c, 1) - counts[id];
    seen[id] = (seen[id] || 0) + 1;
    let have = before + seen[id], row = mergeRow(c, 1);
    return { id, have, need: row.need, ready: !row.maxed && have >= row.need, maxed: row.maxed, isNew: !!(opt.newTower && i === ids.length - 1 && id === opt.newTower) };
  }), newTower = cards.length && cards[cards.length - 1].isNew, W2 = PACK.cardW, H2 = PACK.cardH, faces = cards.map((cd) => prerenderCard((x, y) => drawCardPic(x, y, W2, H2, cd.id, { level: 1, still: !0 }), W2, H2)), back = prerenderCard((x, y) => drawCardBack(x, y, W2, H2), W2, H2), free = opt.source === "free", P = {
    cards,
    faces,
    back,
    t: 0,
    skipped: !1,
    source: opt.source || "paid",
    newTower,
    fired: {},
    summaryAt: newTower ? PACK.summaryNew : PACK.summary,
    title: free ? "FREE PACK!" : "CARD PACK",
    subtitle: free && opt.zapperOwned ? "Zapper card + 4 random" : `${cards.length} cards added to your Cards`,
    stars: Array.from({ length: 10 }, (_, i) => ({ a: i / 10 * Math.PI * 2 + Math.random() * 0.3, sp: 90 + Math.random() * 60 }))
  };
  reducedMotion() && (P.reduced = !0, P.skipped = !0, P.t = P.summaryAt, P.fadeFrom = P.summaryAt), S.pack = P, S.toast = null;
}
function skipPack() {
  let P = S.pack;
  !P || P.skipped || P.t < PACK.dim || P.t >= P.summaryAt || (P.skipped = !0, P.t = P.summaryAt, sfx(P.newTower ? "win" : "upgrade"));
}
function closePack(to) {
  let P = S.pack;
  P && (S.pack = null, sfx("tap"), P.source === "free" && (S.save.onboard = S.save.onboard || newOnboardState(), S.save.onboard.cardsHint || (S.save.onboard.cardsHint = "shop", persist())), to === "cards" && (S.save.onboard && S.save.onboard.cardsHint === "shop" && (S.save.onboard.cardsHint = "cards", persist()), go("cards")));
}
function packFire(key, at, fn) {
  let P = S.pack;
  P.skipped || P.fired[key] || P.t < at || (P.fired[key] = !0, fn());
}
var easeOut = (k) => 1 - Math.pow(1 - Math.max(0, Math.min(1, k)), 3);
function renderPack(dt) {
  let P = S.pack;
  P.t += dt;
  let t = P.t;
  packFire("drop", 0, () => sfx("tap")), packFire("shake", PACK.drop, () => {
    sfx("packShake"), haptic("light");
  }), packFire("burst", PACK.shake, () => {
    sfx("pop"), haptic("medium");
  }), P.cards.forEach((cd, i) => {
    let f0 = PACK.flip0 + i * PACK.flipStep;
    packFire("flip" + i, f0, () => {
      sfx("cardFlip"), haptic("light");
    }), cd.ready && packFire("merge" + i, f0 + PACK.flipDur / 2, () => sfx("upgrade"));
  });
  let lastFlipEnd = PACK.flip0 + (P.cards.length - 1) * PACK.flipStep + PACK.flipDur;
  P.newTower && packFire("beat", lastFlipEnd, () => {
    sfx("win"), haptic("medium");
  });
  let dimA = P.reduced ? 0.72 * Math.min(1, (t - P.fadeFrom) / PACK.fade) : 0.72 * Math.min(1, t / PACK.dim);
  ctx.save(), ctx.fillStyle = `rgba(50,32,46,${dimA})`, ctx.fillRect(-2e3, -2e3, W + 4e3, H + 4e3), ctx.restore();
  let inSummary = t >= P.summaryAt;
  if (!inSummary && t < PACK.burst) {
    if (ctx.save(), t < PACK.shake) {
      let k = easeOut(t / PACK.drop), sc = 0.6 + 0.4 * k, y = 200 + (PACK.packY - 200) * k, rot = t > PACK.drop ? Math.sin((t - PACK.drop) / (PACK.shake - PACK.drop) * Math.PI * 4) * 4 * Math.PI / 180 : 0;
      ctx.translate(PACK.packX, y), ctx.rotate(rot), ctx.scale(sc, sc), drawPackArt(0, 1);
    } else {
      let k = (t - PACK.shake) / (PACK.burst - PACK.shake);
      for (let s of [-1, 1])
        ctx.save(), ctx.globalAlpha = 1 - k, ctx.translate(PACK.packX + s * 60 * k, PACK.packY), ctx.rotate(s * 0.4 * k), ctx.beginPath(), ctx.rect(s < 0 ? -80 : 0, -90, 80, 180), ctx.clip(), drawPackArt(0, 1), ctx.restore();
    }
    ctx.restore();
  }
  if (!inSummary && t >= PACK.shake && t < PACK.shake + 0.55) {
    let k = (t - PACK.shake) / 0.55;
    for (let s of P.stars) starShape(ctx, PACK.packX + Math.cos(s.a) * s.sp * k, PACK.packY + Math.sin(s.a) * s.sp * k, 6 * (1 - k) + 2, "#ffe36e", 1.2);
  }
  let W2 = PACK.cardW, H2 = PACK.cardH;
  if (P.cards.forEach((cd, i) => {
    let d0 = PACK.deal0 + i * PACK.dealStep;
    if (!inSummary && t < d0) return;
    let dk = inSummary ? 1 : easeOut((t - d0) / PACK.dealDur), tx = packSlotX(i), ty = PACK.rowY, x = PACK.packX - W2 / 2 + (tx - (PACK.packX - W2 / 2)) * dk, y = PACK.packY - H2 / 2 + (ty - (PACK.packY - H2 / 2)) * dk, f0 = PACK.flip0 + i * PACK.flipStep, fp = inSummary ? 1 : Math.max(0, Math.min(1, (t - f0) / PACK.flipDur)), sx = Math.abs(Math.cos(fp * Math.PI)), face = fp > 0.5, sc = 1;
    if (cd.ready && face) {
      let mk = inSummary ? 1 : (t - f0 - PACK.flipDur / 2) / 0.3;
      mk < 1 && (sc = 1 + 0.08 * Math.sin(Math.max(0, mk) * Math.PI));
    }
    if (cd.isNew && face) {
      let bk = Math.max(0, Math.min(1, (t - lastFlipEnd) / PACK.beat));
      sc = inSummary ? 1.15 : bk < 0.5 ? 1 + 0.7 * bk : 1.35 - 0.4 * (bk - 0.5), ctx.save(), ctx.translate(tx + W2 / 2, ty + H2 / 2);
      for (let r = 0; r < 14; r++)
        ctx.save(), ctx.rotate(r / 14 * Math.PI * 2 + S.t * 0.4), ctx.globalAlpha = 0.28, ctx.beginPath(), ctx.moveTo(0, 0), ctx.lineTo(70, -8), ctx.lineTo(70, 8), ctx.closePath(), ctx.fillStyle = "#fff3a8", ctx.fill(), ctx.restore();
      ctx.restore();
    }
    let img = face ? P.faces[i] : P.back;
    if (ctx.save(), ctx.translate(x + W2 / 2, y + H2 / 2), ctx.scale(sx * sc, sc), ctx.drawImage(img.cv, -W2 / 2 - img.pad, -H2 / 2 - img.pad, W2 + img.pad * 2, H2 + img.pad * 2), ctx.restore(), !face) return;
    let cx = tx + W2 / 2, ny = ty + H2 + 12;
    fitText(TOWERS[cd.id].short || TOWERS[cd.id].name, cx, ny, W2, 12, "#ffffff");
    let pk = inSummary ? 1 : Math.max(0, Math.min(1, (t - f0 - PACK.flipDur / 2) / PACK.pip));
    if (cd.maxed) plainText("MAX", cx, ny + 18, 12, "#ffe36e", "center", "800");
    else {
      let filled = Math.min(cd.need, cd.have);
      for (let p = 0; p < cd.need; p++) {
        let px = cx - 14 + p * 14, py = ny + 18, isNewPip = p === filled - 1;
        ctx.beginPath(), ctx.arc(px, py, 4.6, 0, 7), ctx.lineWidth = 1.8, ctx.strokeStyle = "#ffffff", ctx.stroke(), p < filled && (ctx.beginPath(), ctx.arc(px, py, 4.6 * (isNewPip ? pk : 1), 0, 7), ctx.fillStyle = "#ffe36e", ctx.fill());
      }
      plainText(`${Math.min(cd.have, cd.need)}/${cd.need} \u2192 L2`, cx, ny + 34, 12, "#ffe9c0", "center", "700"), cd.ready && pk >= 1 && drawMergeTag(cx, ny + 54);
    }
    cd.isNew && (ctx.save(), ctx.translate(tx + W2 - 6, ty + 8), ctx.rotate(Math.PI / 4), rr(ctx, -24, -8, 48, 16, 4), ctx.fillStyle = "#ffe36e", ctx.fill(), ctx.lineWidth = 1.8, ctx.strokeStyle = INK, ctx.stroke(), text(ctx, "NEW", 0, 0.5, 12, "#e0607e", "center", null), ctx.restore());
  }), P.newTower && t >= lastFlipEnd) {
    let k = Math.min(1, (t - lastFlipEnd) / 0.2);
    ctx.save(), ctx.globalAlpha = k, rr(ctx, 110, 206, 180, 30, 10), ctx.fillStyle = "#ffe36e", ctx.fill(), ctx.lineWidth = 2.2, ctx.strokeStyle = INK, ctx.stroke(), text(ctx, "NEW TOWER!", 200, 221.5, 17, "#e0607e", "center", null), ctx.restore();
  }
  if (inSummary) {
    let a = Math.min(1, (t - P.summaryAt) / PACK.fade);
    ctx.save(), ctx.globalAlpha = a, text(ctx, P.title, 200, 150, 28, "#ffe36e"), plainText(P.subtitle, 200, 186, 14, "#ffffff", "center", "700");
    let merge = anyMergeReady(S.save);
    drawButton(32, 470, 160, 48, "OK", "#ffd45e"), drawButton(208, 470, 160, 48, merge ? "Merge now" : "Cards", "#b5d8ff", { size: merge ? 16 : 17 }), t - P.summaryAt >= PACK.tapHint && plainText("Tap anywhere to continue", 200, 545, 12, "#ffe9c0", "center", "700"), ctx.restore();
  }
  button("packTap", -2e3, -2e3, W + 4e3, H + 4e3, () => {
    t < P.summaryAt ? skipPack() : t - P.summaryAt >= PACK.tapHint && closePack("ok");
  }), inSummary && (button("packOk", 32, 466, 160, 56, () => closePack("ok")), button("packCards", 208, 466, 160, 56, () => closePack("cards")));
}
function drawPackArt(x, y) {
  ctx.save(), ctx.translate(x, y), rr(ctx, -60, -71, 120, 150, 16), ctx.fillStyle = "rgba(74,52,66,0.3)", ctx.fill(), rr(ctx, -60, -75, 120, 150, 16);
  let g = ctx.createLinearGradient(0, -75, 0, 75);
  g.addColorStop(0, "#fff3f7"), g.addColorStop(1, "#ffc8d6"), ctx.fillStyle = g, ctx.fill(), ctx.lineWidth = 3, ctx.strokeStyle = INK, ctx.stroke();
  for (let k = 0; k < 3; k++)
    ctx.save(), ctx.translate(-26 + k * 26, 6 - (k === 1 ? 8 : 0)), ctx.rotate(-0.25 + k * 0.25), rr(ctx, -18, -26, 36, 50, 7), ctx.fillStyle = ["#ffb3c1", "#b5d8ff", "#ffd27a"][k], ctx.fill(), ctx.lineWidth = 2.2, ctx.strokeStyle = INK, ctx.stroke(), text(ctx, "?", 0, 0, 20), ctx.restore();
  text(ctx, "CARDS", 0, -56, 15, "#ff6f91"), ctx.restore();
}
function drawMergeTag(cx, y) {
  ctx.save(), rr(ctx, cx - 30, y - 9, 60, 18, 8), ctx.fillStyle = "#55b85a", ctx.fill(), ctx.lineWidth = 1.8, ctx.strokeStyle = INK, ctx.stroke(), ctx.beginPath(), ctx.moveTo(cx - 24, y + 4), ctx.lineTo(cx - 20, y - 4), ctx.lineTo(cx - 16, y + 4), ctx.closePath(), ctx.fillStyle = "#ffffff", ctx.fill(), text(ctx, "MERGE!", cx + 5, y + 0.5, 12, "#ffffff", "center", null), ctx.restore();
}
function launchFireworks(n = 8, dur = 2.5) {
  for (let i = 0; i < n; i++) S.fireworks.queue.push({ at: S.t + i / n * dur + Math.random() * 0.2 });
}
function renderFireworks(dt) {
  let F = S.fireworks;
  if (!F.queue.length && !F.rockets.length && !F.parts.length) return;
  let cols = ["#ff8fab", "#ffd45e", "#8fe388", "#9fd3f2", "#c9b6f2", "#ffffff"];
  F.queue = F.queue.filter((q) => {
    if (q.at > S.t) return !0;
    let x = 60 + Math.random() * 280;
    return F.rockets.push({ x, y: H + 10, vx: (Math.random() - 0.5) * 40, vy: -520 - Math.random() * 160, ty: 120 + Math.random() * 220, c: cols[Math.floor(Math.random() * cols.length)] }), !1;
  }), ctx.save(), F.rockets = F.rockets.filter((r) => {
    if (r.x += r.vx * dt, r.y += r.vy * dt, r.vy += 260 * dt, ctx.beginPath(), ctx.arc(r.x, r.y, 2.6, 0, 7), ctx.fillStyle = "#fff6c8", ctx.fill(), ctx.globalAlpha = 0.5, ctx.beginPath(), ctx.moveTo(r.x, r.y), ctx.lineTo(r.x - r.vx * 0.04, r.y - r.vy * 0.04), ctx.lineWidth = 2, ctx.strokeStyle = "#ffe9a0", ctx.stroke(), ctx.globalAlpha = 1, r.y <= r.ty || r.vy >= -40) {
      for (let i = 0; i < 34; i++) {
        let a = i / 34 * Math.PI * 2, sp = 110 + Math.random() * 90;
        F.parts.push({ x: r.x, y: r.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1.2 + Math.random() * 0.4, max: 1.6, c: Math.random() < 0.25 ? "#ffffff" : r.c });
      }
      return sfx("pop"), !1;
    }
    return !0;
  }), F.parts = F.parts.filter((p) => (p.life -= dt, p.life <= 0 ? !1 : (p.vx *= 0.985, p.vy = p.vy * 0.985 + 90 * dt, p.x += p.vx * dt, p.y += p.vy * dt, ctx.globalAlpha = Math.min(1, p.life / 0.6), ctx.beginPath(), ctx.arc(p.x, p.y, 2.4, 0, 7), ctx.fillStyle = p.c, ctx.fill(), !0))), ctx.restore();
}
heartbeat(!0);
maybeShowCalendar();
S.save.onboard && S.save.onboard.grantedOnLoad && (queueReveal("zapper", 1, !0, S.t + 0.4), S.save.onboard.grantedOnLoad = !1, persist());
try {
  document.fonts && document.fonts.load && document.fonts.load("22px 'Lilita One'").then(() => {
    setFontReady(!0), S.bdCache = null;
  }, () => {
  });
} catch {
}
requestAnimationFrame(frame);
