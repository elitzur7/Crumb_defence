// ../tuning/tuning.json
var tuning_default = {
  _about: "Crumb Defense tuning - the SOURCE OF TRUTH for the numbers below. Edit, then rebuild (see README.md in this folder). Not loaded at runtime; the build bundles it.",
  _units: {
    rangeTiles: "radius from the tower centre in map tiles (1 tile = 40 px)",
    rate: "actions per second (null = always on)",
    cardUpgrades: "steps to card levels L2..L10, in order. power / rate / any other key: fraction (+0.10 = +10%); range: tiles (+0.2 tiles)",
    battleUpgrades: "in-battle levels 2-6 (five upgrades; drop the same card on the tower): multipliers",
    speed: "px per second",
    queenTake: "a queen takes 50 + the sum of her trait modifiers (queenTraitMods) from the treat"
  },
  shop: {
    _about: "v0.6.2 items 12/13. unlockPrice: coins to unlock a locked tower in the Shop (tiered by base power, approved by Yair). packNewTowerChance: chance that a card pack holds ONE new (locked) tower card (L1) as one of its cards.",
    unlockPrice: {
      sound: 100,
      pheromone: 100,
      lava: 100,
      lizard: 200,
      gate: 200,
      zapper: 200,
      laser: 400,
      tractor: 400
    },
    unlockPriceDefault: 200,
    packNewTowerChance: 0.1
  },
  queenTraitMods: {
    fast: -10,
    flying: -15,
    slow: 0,
    slower: 5,
    slowest: 10,
    vulnerable: 5,
    veryVulnerable: 10
  },
  antSizes: {
    small: 0.7,
    regular: 1,
    large: 1.12,
    queen: 2.1
  },
  towers: {
    slingshot: {
      power: 6,
      rate: 1.1,
      rangeTiles: 1.5,
      params: {
        projSpeed: 380
      },
      battleUpgrades: [
        {
          power: 2
        },
        {
          rate: 1.3,
          range: 1.1,
          power: 1.154
        },
        {
          power: 1.333
        },
        {
          rate: 1.15,
          power: 1.087
        },
        {
          range: 1.1,
          power: 1.2
        }
      ],
      cardUpgrades: [
        {
          range: 0.2
        },
        {
          power: 0.1
        },
        {
          range: 0.2
        },
        {
          rate: 0.1
        },
        {
          power: 0.1
        },
        {
          power: 0.12
        },
        {
          rate: 0.1
        },
        {
          range: 0.2
        },
        {
          range: 0.2,
          power: 0.1
        }
      ]
    },
    spray: {
      power: 6,
      rate: 0.42,
      rangeTiles: 1.5,
      params: {
        cloudTime: 2.6,
        cloudRadius: 42
      },
      battleUpgrades: [
        {
          power: 2,
          cloudRadius: 1.2
        },
        {
          rate: 1.3,
          power: 1.154
        },
        {
          cloudRadius: 1.15,
          range: 1.1,
          power: 1.333
        },
        {
          power: 1.25
        },
        {
          rate: 1.2
        }
      ],
      cardUpgrades: [
        {
          power: 0.1
        },
        {
          rate: 0.08
        },
        {
          range: 0.2
        },
        {
          power: 0.12
        },
        {
          range: 0.15
        },
        {
          rate: 0.1
        },
        {
          power: 0.1
        },
        {
          range: 0.2
        },
        {
          power: 0.1,
          rate: 0.1
        }
      ]
    },
    sound: {
      power: 4,
      rate: 0.75,
      rangeTiles: 1.5,
      params: {
        ignoreArmor: !0,
        stagger: 0.18
      },
      battleUpgrades: [
        {
          power: 2
        },
        {
          range: 1.15,
          rate: 1.2,
          power: 1.25
        },
        {
          stagger: 1.3,
          power: 1.333
        },
        {
          power: 1.25
        },
        {
          rate: 1.15,
          stagger: 1.25,
          power: 1.043
        }
      ],
      cardUpgrades: [
        {
          rate: 0.1
        },
        {
          range: 0.2
        },
        {
          power: 0.1
        },
        {
          power: 0.1
        },
        {
          range: 0.2
        },
        {
          rate: 0.08
        },
        {
          range: 0.15
        },
        {
          power: 0.12
        },
        {
          rate: 0.1,
          range: 0.2
        }
      ]
    },
    ball: {
      power: 16,
      rate: 0.16,
      rangeTiles: null,
      params: {
        ballRadius: 13,
        rollSpeed: 230,
        maxBalls: 1
      },
      battleUpgrades: [
        {
          power: 2,
          ballRadius: 1.2
        },
        {
          rate: 1.3,
          power: 1.154
        },
        {
          ballRadius: 1.1,
          power: 1.333
        },
        {
          power: 1.25
        },
        {
          rate: 1.2
        }
      ],
      cardUpgrades: [
        {
          power: 0.1
        },
        {
          rate: 0.1
        },
        {
          ballRadius: 0.1
        },
        {
          power: 0.12
        },
        {
          rate: 0.08
        },
        {
          power: 0.1
        },
        {
          ballRadius: 0.1
        },
        {
          rate: 0.1
        },
        {
          power: 0.1,
          rate: 0.1
        }
      ]
    },
    fan: {
      power: 50,
      rate: 0.36,
      rangeTiles: 1.5,
      params: {},
      battleUpgrades: [
        {
          power: 1.3
        },
        {
          rate: 1.25,
          range: 1.1
        },
        {
          power: 1.15
        },
        {
          range: 1.1
        },
        {
          rate: 1.15
        }
      ],
      cardUpgrades: [
        {
          range: 0.2
        },
        {
          rate: 0.1
        },
        {
          power: 0.1
        },
        {
          range: 0.2
        },
        {
          range: 0.15
        },
        {
          power: 0.1
        },
        {
          rate: 0.1
        },
        {
          power: 0.12
        },
        {
          range: 0.2,
          rate: 0.1
        }
      ]
    },
    pheromone: {
      power: 2.5,
      rate: null,
      rangeTiles: 1,
      params: {
        ignoreArmor: !0,
        slow: 0.35,
        charmTime: 1.6
      },
      battleUpgrades: [
        {
          power: 1.5
        },
        {
          charmTime: 1.4,
          slow: 1.25
        },
        {
          power: 1.2
        },
        {
          charmTime: 1.2
        },
        {
          slow: 1.15
        }
      ],
      cardUpgrades: [
        {
          power: 0.12
        },
        {
          slow: 0.1
        },
        {
          charmTime: 0.1
        },
        {
          power: 0.1
        },
        {
          slow: 0.08
        },
        {
          power: 0.1
        },
        {
          charmTime: 0.1
        },
        {
          charmTime: 0.12
        },
        {
          power: 0.1,
          slow: 0.08
        }
      ]
    },
    lizard: {
      power: 38,
      rate: 0.42,
      rangeTiles: 1.5,
      params: {
        chewTime: 1.4
      },
      battleUpgrades: [
        {
          power: 2
        },
        {
          chewTime: 0.6,
          range: 1.1,
          power: 1.5
        },
        {
          rate: 1.2,
          power: 1.111
        },
        {
          power: 1.25
        },
        {
          chewTime: 0.75,
          power: 1.2
        }
      ],
      cardUpgrades: [
        {
          power: 0.12
        },
        {
          rate: 0.08
        },
        {
          range: 0.2
        },
        {
          power: 0.1
        },
        {
          range: 0.2
        },
        {
          rate: 0.1
        },
        {
          power: 0.1
        },
        {
          power: 0.12
        },
        {
          range: 0.2,
          power: 0.1
        }
      ]
    },
    laser: {
      power: 3,
      rate: 3.2,
      rangeTiles: 2.5,
      params: {
        heatPerHit: 0.1,
        heatMax: 1
      },
      battleUpgrades: [
        {
          power: 1.7
        },
        {
          rate: 1.15,
          power: 1.228
        },
        {
          range: 1.1,
          power: 1.292
        },
        {
          power: 1.15,
          heatMax: 1.5
        },
        {
          rate: 1.2,
          heatMax: 1.3
        }
      ],
      cardUpgrades: [
        {
          rate: 0.08
        },
        {
          power: 0.1
        },
        {
          range: 0.2
        },
        {
          rate: 0.1
        },
        {
          power: 0.1
        },
        {
          range: 0.2
        },
        {
          power: 0.12
        },
        {
          rate: 0.1
        },
        {
          power: 0.1,
          rate: 0.1
        }
      ]
    },
    zapper: {
      power: 10,
      rate: 1.5,
      rangeTiles: 2,
      params: {
        chain: 2,
        chainRange: 75,
        chainFalloff: 0.6
      },
      battleUpgrades: [
        {
          power: 2
        },
        {
          chain: 1.5,
          range: 1.1,
          power: 1.5
        },
        {
          rate: 1.2,
          power: 1.111
        },
        {
          power: 1.25
        },
        {
          rate: 1.15,
          chain: 1.34,
          power: 1.043
        }
      ],
      cardUpgrades: [
        {
          range: 0.2
        },
        {
          power: 0.1
        },
        {
          rate: 0.1
        },
        {
          range: 0.2
        },
        {
          power: 0.12
        },
        {
          rate: 0.08
        },
        {
          power: 0.1
        },
        {
          range: 0.2
        },
        {
          power: 0.1,
          range: 0.15
        }
      ]
    },
    glue: {
      power: 0.55,
      rate: null,
      rangeTiles: 1,
      params: {
        stickTime: 0.5
      },
      battleUpgrades: [
        {
          power: 1.15
        },
        {
          stickTime: 2
        },
        {
          stickTime: 1.25
        },
        {
          power: 1.1
        },
        {
          stickTime: 1.2
        }
      ],
      cardUpgrades: [
        {
          stickTime: 0.12
        },
        {
          power: 0.08
        },
        {
          stickTime: 0.15
        },
        {
          power: 0.06
        },
        {
          power: 0.08
        },
        {
          stickTime: 0.1
        },
        {
          stickTime: 0.15
        },
        {
          power: 0.08
        },
        {
          stickTime: 0.12,
          power: 0.05
        }
      ]
    },
    gate: {
      power: 4.5,
      rate: 2.85,
      rangeTiles: 1,
      params: {
        ignoreArmor: !0
      },
      battleUpgrades: [
        {
          power: 2
        },
        {
          rate: 1.3,
          power: 1.154
        },
        {
          rate: 1.15,
          power: 1.159
        },
        {
          power: 1.25
        },
        {
          power: 1.1,
          rate: 1.1
        }
      ],
      cardUpgrades: [
        {
          rate: 0.1
        },
        {
          power: 0.1
        },
        {
          power: 0.12
        },
        {
          rate: 0.08
        },
        {
          rate: 0.08
        },
        {
          power: 0.1
        },
        {
          power: 0.08
        },
        {
          rate: 0.1
        },
        {
          power: 0.1,
          rate: 0.06
        }
      ]
    },
    lava: {
      power: 6,
      rate: null,
      rangeTiles: 1,
      params: {
        ignoreArmor: !0,
        slow: 0.2
      },
      battleUpgrades: [
        {
          power: 2
        },
        {
          slow: 1.25,
          power: 1.5
        },
        {
          power: 1.333
        },
        {
          slow: 1.15,
          power: 1.25
        },
        {
          power: 1.2
        }
      ],
      cardUpgrades: [
        {
          power: 0.1
        },
        {
          slow: 0.08
        },
        {
          power: 0.1
        },
        {
          slow: 0.1
        },
        {
          power: 0.08
        },
        {
          power: 0.12
        },
        {
          slow: 0.08
        },
        {
          power: 0.1
        },
        {
          slow: 0.1,
          power: 0.1
        }
      ]
    },
    tractor: {
      power: null,
      rate: 0.13,
      rangeTiles: null,
      params: {
        liftSize: 1
      },
      battleUpgrades: [
        {
          rate: 1.12
        },
        {
          rate: 1.1
        },
        {
          rate: 1.12
        },
        {
          liftSize: 1,
          rateIfMaxLift: 1.15
        },
        {
          rate: 1.1
        }
      ],
      cardUpgrades: [
        {
          rate: 0.05
        },
        {
          liftSize: 1
        },
        {
          rate: 0.06
        },
        {
          rate: 0.05
        },
        {
          rate: 0.07
        },
        {
          rate: 0.05
        },
        {
          liftSize: 1
        },
        {
          rate: 0.06
        },
        {
          rate: 0.07
        }
      ]
    }
  },
  ants: {
    small: {
      hp: 4,
      speed: 60,
      armor: 0,
      steal: 0.9,
      weight: 1.2,
      size: "small",
      crumbs: 1
    },
    worker: {
      hp: 20,
      speed: 40,
      armor: 0,
      steal: 0.9,
      weight: 1,
      size: "regular",
      crumbs: 1
    },
    big: {
      hp: 100,
      speed: 27,
      armor: 2,
      steal: 1.8,
      weight: 0.5,
      size: "large",
      crumbs: 4
    },
    gasmask: {
      hp: 16,
      speed: 40,
      armor: 1,
      steal: 0.9,
      weight: 1,
      size: "regular",
      gasImmune: !0,
      crumbs: 2
    },
    armored: {
      hp: 40,
      speed: 30,
      armor: 6,
      steal: 1.8,
      weight: 0.6,
      size: "regular",
      crumbs: 4
    },
    flyer: {
      hp: 12,
      speed: 62,
      armor: 0,
      steal: 0.9,
      weight: 1.3,
      size: "regular",
      flying: !0,
      crumbs: 2
    },
    sprinter: {
      hp: 10,
      speed: 52,
      armor: 4,
      steal: 0.9,
      weight: 0.8,
      size: "regular",
      lateGame: !0,
      crumbs: 3
    },
    heavy: {
      hp: 80,
      speed: 24,
      armor: 6,
      steal: 1.8,
      weight: 0.35,
      size: "large",
      lateGame: !0,
      crumbs: 8
    },
    queen: {
      hp: 1200,
      speed: 13,
      armor: 6,
      weight: 0,
      size: "queen",
      slowResist: 0.5,
      boss: !0,
      spawn: {
        type: "small",
        every: 5,
        count: 1
      },
      queenTraits: [
        "slow"
      ],
      crumbs: 93
    },
    queen2: {
      hp: 2e3,
      speed: 19,
      armor: 5,
      weight: 0,
      size: "queen",
      slowResist: 0.4,
      boss: !0,
      spawn: {
        type: "flyer",
        every: 6,
        count: 1
      },
      queenTraits: [
        "fast"
      ],
      crumbs: 141
    },
    small_gasmask: {
      hp: 4,
      speed: 60,
      armor: 0,
      steal: 0.9,
      weight: 1.2,
      size: "small",
      gasImmune: !0,
      crumbs: 1
    },
    small_armed: {
      hp: 10,
      speed: 45,
      armor: 4,
      steal: 0.9,
      weight: 1,
      size: "small",
      crumbs: 1
    },
    small_fly: {
      hp: 3,
      speed: 70,
      armor: 0,
      steal: 0.9,
      weight: 1.5,
      size: "small",
      flying: !0,
      crumbs: 1
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
      cardLevelCap: 4
    },
    {
      id: 2,
      name: "Cake Castle",
      treat: "cake",
      queen: "queen2",
      levels: 10,
      unlock: {
        allLevelsWonInWorld: 1,
        minStarsInWorld: 18
      },
      cardLevelCap: 6
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
      mix: [
        {
          type: "worker",
          w: 4
        },
        {
          type: "small",
          w: 3,
          from: 2
        }
      ]
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
      mix: [
        {
          type: "worker",
          w: 4
        },
        {
          type: "small",
          w: 3
        },
        {
          type: "small_gasmask",
          w: 1,
          from: 3
        }
      ]
    },
    {
      world: 1,
      name: "Gas Masks On",
      map: "hook",
      waveCount: 5,
      hpMul: 3,
      base: 7.8,
      growth: 1.75,
      interval: 1,
      mix: [
        {
          type: "worker",
          w: 3
        },
        {
          type: "small",
          w: 3
        },
        {
          type: "gasmask",
          w: 2,
          from: 2
        },
        {
          type: "small_gasmask",
          w: 2
        },
        {
          type: "small_fly",
          w: 1,
          from: 3
        }
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
      mix: [
        {
          type: "worker",
          w: 3
        },
        {
          type: "small",
          w: 2
        },
        {
          type: "flyer",
          w: 2,
          from: 2
        },
        {
          type: "small_fly",
          w: 3
        }
      ]
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
        {
          type: "worker",
          w: 3
        },
        {
          type: "small",
          w: 2
        },
        {
          type: "armored",
          w: 2,
          from: 2
        },
        {
          type: "small_armed",
          w: 3,
          from: 2
        }
      ],
      special: {
        "6": [
          {
            type: "big",
            count: 2,
            interval: 1.6
          }
        ]
      }
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
        {
          type: "worker",
          w: 2
        },
        {
          type: "small",
          w: 3
        },
        {
          type: "flyer",
          w: 3
        },
        {
          type: "small_fly",
          w: 2
        },
        {
          type: "gasmask",
          w: 1
        }
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
        {
          type: "worker",
          w: 2
        },
        {
          type: "small",
          w: 2
        },
        {
          type: "big",
          w: 2,
          from: 3
        },
        {
          type: "armored",
          w: 2
        },
        {
          type: "small_armed",
          w: 2
        }
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
        {
          type: "worker",
          w: 2
        },
        {
          type: "small",
          w: 2
        },
        {
          type: "gasmask",
          w: 3
        },
        {
          type: "small_gasmask",
          w: 3
        },
        {
          type: "flyer",
          w: 2,
          from: 2
        }
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
        {
          type: "small",
          w: 4
        },
        {
          type: "worker",
          w: 2
        },
        {
          type: "small_fly",
          w: 2
        },
        {
          type: "sprinter",
          w: 1,
          from: 2
        },
        {
          type: "small_armed",
          w: 1
        }
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
      mix: [
        {
          type: "worker",
          w: 2
        },
        {
          type: "small",
          w: 2
        },
        {
          type: "heavy",
          w: 2,
          from: 3
        },
        {
          type: "flyer",
          w: 2
        }
      ],
      special: {
        "9": [
          {
            type: "queen",
            count: 1,
            interval: 1,
            delay: 4
          }
        ]
      }
    },
    {
      world: 2,
      name: "Cake Gate",
      map: "frosting",
      waveCount: 6,
      hpMul: 3.054,
      base: 10,
      growth: 1.8,
      interval: 1,
      mix: [
        {
          type: "worker",
          w: 3
        },
        {
          type: "small",
          w: 3
        },
        {
          type: "small_fly",
          w: 1,
          from: 2
        },
        {
          type: "gasmask",
          w: 2,
          from: 2
        }
      ]
    },
    {
      world: 2,
      name: "Sugar Steps",
      map: "staircase",
      waveCount: 6,
      hpMul: 3.387,
      base: 9,
      growth: 2,
      interval: 0.95,
      mix: [
        {
          type: "worker",
          w: 3
        },
        {
          type: "small",
          w: 2
        },
        {
          type: "small_armed",
          w: 2,
          from: 2
        },
        {
          type: "armored",
          w: 1,
          from: 3
        },
        {
          type: "big",
          w: 1,
          from: 4
        }
      ]
    },
    {
      world: 2,
      name: "Layer Cake",
      map: "layers",
      waveCount: 6,
      hpMul: 2.875,
      base: 10,
      growth: 2,
      interval: 0.95,
      mix: [
        {
          type: "worker",
          w: 3
        },
        {
          type: "small",
          w: 2
        },
        {
          type: "flyer",
          w: 2,
          from: 2
        },
        {
          type: "small_gasmask",
          w: 2
        },
        {
          type: "gasmask",
          w: 1,
          from: 3
        }
      ]
    },
    {
      world: 2,
      name: "Candle Light",
      map: "candles",
      waveCount: 6,
      hpMul: 3.6,
      base: 10,
      growth: 2.1,
      interval: 0.9,
      mix: [
        {
          type: "worker",
          w: 2
        },
        {
          type: "small",
          w: 2
        },
        {
          type: "armored",
          w: 2
        },
        {
          type: "small_armed",
          w: 2
        },
        {
          type: "sprinter",
          w: 1,
          from: 3
        }
      ]
    },
    {
      world: 2,
      name: "Tea Party",
      map: "teaparty",
      waveCount: 7,
      hpMul: 5.304,
      base: 10.5,
      growth: 2.1,
      interval: 0.9,
      mix: [
        {
          type: "worker",
          w: 2
        },
        {
          type: "small",
          w: 3
        },
        {
          type: "small_fly",
          w: 2
        },
        {
          type: "flyer",
          w: 2
        },
        {
          type: "gasmask",
          w: 1
        }
      ]
    },
    {
      world: 2,
      name: "Frosting Rush",
      map: "frosting",
      waveCount: 7,
      hpMul: 4.213,
      base: 11,
      growth: 2.2,
      interval: 0.85,
      mix: [
        {
          type: "small",
          w: 3
        },
        {
          type: "worker",
          w: 2
        },
        {
          type: "sprinter",
          w: 3
        },
        {
          type: "small_armed",
          w: 1
        },
        {
          type: "flyer",
          w: 1
        }
      ]
    },
    {
      world: 2,
      name: "Heavy Icing",
      map: "snake",
      waveCount: 8,
      hpMul: 2.38,
      base: 11,
      growth: 2.2,
      interval: 0.9,
      mix: [
        {
          type: "worker",
          w: 2
        },
        {
          type: "big",
          w: 2
        },
        {
          type: "heavy",
          w: 1,
          from: 3
        },
        {
          type: "armored",
          w: 2
        },
        {
          type: "small",
          w: 2
        }
      ]
    },
    {
      world: 2,
      name: "Sprinkle Storm",
      map: "layers",
      waveCount: 8,
      hpMul: 3.557,
      base: 11.5,
      growth: 2.3,
      interval: 0.85,
      mix: [
        {
          type: "small",
          w: 3
        },
        {
          type: "flyer",
          w: 2
        },
        {
          type: "small_fly",
          w: 3
        },
        {
          type: "worker",
          w: 2
        },
        {
          type: "small_gasmask",
          w: 2
        }
      ]
    },
    {
      world: 2,
      name: "Cherry on Top",
      map: "candles",
      waveCount: 9,
      hpMul: 4.065,
      base: 12,
      growth: 2.4,
      interval: 0.8,
      mix: [
        {
          type: "worker",
          w: 2
        },
        {
          type: "small",
          w: 3
        },
        {
          type: "heavy",
          w: 1
        },
        {
          type: "sprinter",
          w: 2
        },
        {
          type: "small_fly",
          w: 2
        }
      ]
    },
    {
      world: 2,
      name: "The Swift Queen",
      map: "cross",
      waveCount: 9,
      hpMul: 1.6,
      base: 12,
      growth: 2.4,
      interval: 0.8,
      mix: [
        {
          type: "worker",
          w: 2
        },
        {
          type: "small",
          w: 2
        },
        {
          type: "sprinter",
          w: 2
        },
        {
          type: "flyer",
          w: 2
        }
      ],
      special: {
        "9": [
          {
            type: "queen2",
            count: 1,
            interval: 1,
            delay: 4
          }
        ]
      }
    }
  ],
  maps: {
    zigzag: {
      name: "Breakfast Counter",
      theme: 0,
      path: [
        [
          1,
          -0.6
        ],
        [
          1,
          2
        ],
        [
          8,
          2
        ],
        [
          8,
          5
        ],
        [
          1,
          5
        ],
        [
          1,
          8
        ],
        [
          8,
          8
        ],
        [
          8,
          10
        ]
      ],
      props: [
        {
          k: "sugar",
          c: 5,
          r: 10
        },
        {
          k: "mug",
          c: 9,
          r: 6
        }
      ]
    },
    hook: {
      name: "Baking Table",
      theme: 1,
      path: [
        [
          8,
          -0.6
        ],
        [
          8,
          1
        ],
        [
          2,
          1
        ],
        [
          2,
          4
        ],
        [
          7,
          4
        ],
        [
          7,
          7
        ],
        [
          2,
          7
        ],
        [
          2,
          10
        ],
        [
          6,
          10
        ]
      ],
      props: [
        {
          k: "jam",
          c: 0,
          r: 11
        },
        {
          k: "plant",
          c: 9,
          r: 9
        }
      ]
    },
    spiral: {
      name: "Midnight Snack",
      theme: 2,
      path: [
        [
          -0.6,
          1
        ],
        [
          8,
          1
        ],
        [
          8,
          10
        ],
        [
          1,
          10
        ],
        [
          1,
          4
        ],
        [
          5,
          4
        ],
        [
          5,
          7
        ]
      ],
      props: [
        {
          k: "mug",
          c: 3,
          r: 7
        },
        {
          k: "spoon",
          c: 9,
          r: 11
        }
      ]
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
  forage: { on: !0, pause: 0.3, queenLoop: !0 },
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
var AIR_COUNTERS = ["laser", "zapper"], VERSION = "0.7.4", ANT_SIZES = { ...tuning_default.antSizes }, ANT_TEXT = {
  small: { name: "Scout Ant", desc: "Tiny, fast, comes in swarms." },
  worker: { name: "Worker Ant", desc: "The regular. Hard hat included." },
  big: { name: "Big Ant", desc: "Slow, chunky, a bit of armor." },
  gasmask: { name: "Gas-Mask Ant", desc: "Immune to bug spray." },
  armored: { name: "Knight Ant", desc: "Heavy armor. Use spray, boombox or gate." },
  flyer: { name: "Flying Ant", desc: "Flies over ground towers. Laser, zapper or plane!" },
  sprinter: { name: "Sprint Knight", desc: "Armored AND fast - sneakers on. Late stages only." },
  heavy: { name: "Heavy Knight", desc: "A big ant in full armor. Late stages only." },
  queen: { name: "Ant Queen", desc: "BOSS. Marches in and calls her scouts. Takes HALF the cookie." },
  // v0.7 (Yair ANT-STATS-v0.6.3): small variants - same tiny body as the Scout, with a gas mask / armour / wings
  small_gasmask: { name: "Masked Scout", desc: "A tiny scout with a gas mask - spray does nothing." },
  small_armed: { name: "Armored Scout", desc: "A tiny scout in armour. Slower, shrugs off weak hits." },
  small_fly: { name: "Flying Scout", desc: "A tiny flying scout. Laser or zapper!" },
  queen2: { name: "Swift Queen", desc: "BOSS of world 2. Fast, calls flying ants. Takes 40 of the cake." }
}, QUEEN_TRAITS = { ...tuning_default.queenTraitMods };
function queenTake(traits = [], T = QUEEN_TRAITS) {
  return 50 + traits.reduce((s, t) => s + (T[t] || 0), 0);
}
var ANTS = {};
for (let [id, a] of Object.entries(tuning_default.ants))
  ANTS[id] = { ...ANT_TEXT[id] || { name: id, desc: "" }, ...a, size: ANT_SIZES[a.size] ?? a.size, sizeClass: a.size }, a.boss && (ANTS[id].steal = queenTake(a.queenTraits || []));
var isQueen = (type) => !!(ANTS[type] && ANTS[type].boss), WORLDS = tuning_default.worlds.map((w) => ({ ...w })), QUEENS = Object.fromEntries(WORLDS.map((w) => [w.id, { type: w.queen, traits: tuning_default.ants[w.queen].queenTraits }]));
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
  coinsByStreak: [5, 10, 15, 20],
  // 1st, 2nd, 3rd, 4th+ coin prize of the current streak (cap 20)
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
}, MAX_CARD_LEVEL = 10, LEVELS = tuning_default.levels.map((L) => ({ ...L })), WORLD_START = Object.fromEntries(WORLDS.map((w) => [w.id, LEVELS.findIndex((L) => L.world === w.id)])), worldOf = (i) => LEVELS[i] ? LEVELS[i].world : 1, treatOf = (i) => TREATS[worldOf(i)] || "cookie";

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
var LOWEST_HP = /* @__PURE__ */ new Set(["slingshot", "laser", "zapper", "lizard"]), TARGET_MODES = ["weak", "carrier", "front"];
function hasTargetModes(type) {
  return LOWEST_HP.has(type);
}
function nextTargetMode(mode) {
  return TARGET_MODES[(TARGET_MODES.indexOf(mode) + 1) % TARGET_MODES.length];
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
}, SPACING = {
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
  small_fly: 0.5
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
    this.cfg = { ...BATTLE, ...opts.battleCfg || {} }, this.cfg.foodReturn = { ...BATTLE.foodReturn, ...(opts.battleCfg || {}).foodReturn || {} }, this.cfg.rescue = { ...BATTLE.rescue, ...(opts.battleCfg || {}).rescue || {} }, this.levelIndex = opts.levelIndex, this.level = LEVELS[opts.levelIndex], this.mapId = opts.mapId || this.level.map, this.map = MAPS[this.mapId];
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
      dead: !1,
      x: 0,
      y: 0,
      born: this.time,
      hitFlash: 0,
      dir: 1
    }, p = this.routes[ri].at(d);
    return ant.x = p.x, ant.y = p.y, this.ants.push(ant), this.stats.spawned++, ant;
  }
  damage(ant, dmg, opt = {}) {
    if (ant.dead || dmg <= 0) return 0;
    if (opt.gas && ant.gasImmune)
      return opt.fx !== !1 && this.rng() < 0.05 && this.emit({ type: "immune", x: ant.x, y: ant.y }), 0;
    let real = applyArmor(dmg, ant.armor, opt.ignoreArmor);
    return ant.hp -= real, ant.hitFlash = 0.12, ant.hp <= 0 && this.kill(ant, opt.src), real;
  }
  kill(ant, src) {
    ant.dead = !0;
    let crumbs = crumbsFor(ant.type);
    if (this.addCrumbs(crumbs), this.stats.kills++, this.stats.byType[ant.type] = (this.stats.byType[ant.type] || 0) + 1, ant.carrying > 0 && this.cfg.rescue && this.cfg.rescue.on) {
      let R = this.cfg.rescue, auto = Math.round(ant.carrying * R.auto * 1e3) / 1e3, bonus = Math.round(ant.carrying * (R.tap - R.auto) * 1e3) / 1e3;
      this.stats.lostOnWay += ant.carrying - auto, auto > 0 && (this.foodStored = Math.min(this.cfg.foodHP, this.foodStored + auto), this.stats.returned += auto, this.emit({ type: "foodReturn", x: ant.x, y: ant.y, n: auto, of: ant.carrying })), bonus > 0 && this.dropPiece(ant.x, ant.y, bonus), ant.carrying = 0;
    } else if (ant.carrying > 0) {
      let rt = this.route(ant), back = foodReturned(ant.carrying, ant.d / rt.length, this.cfg.foodReturn);
      this.stats.lostOnWay += ant.carrying - back, back > 0 && (this.foodStored = Math.min(this.cfg.foodHP, this.foodStored + back), this.stats.returned += back, this.emit({ type: "foodReturn", x: ant.x, y: ant.y, n: back, of: ant.carrying })), ant.carrying = 0;
    }
    this.emit({ type: "kill", x: ant.x, y: ant.y, ant: ant.type, crumbs, src: src && src.type, ...src && src.type === "swatter" ? { ref: ant } : {} }), src && src.type === "lizard" && (src.chew = src.stat("chewTime"));
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
  playCard(pickIndex, c, r) {
    let chk = this.canPlay(pickIndex, c, r);
    if (!chk.ok) return chk;
    let card = this.picks[pickIndex], cost = this.nextCardCost;
    this.crumbs -= cost, this.cardsPlayed++;
    let tower, diff = null;
    return chk.upgrade ? (tower = chk.tower, diff = upgradeDiff(tower.type, tower.lvl, tower.cardLevel), tower.lvl++, TOWERS[tower.type].directional && this.computeRun(tower), this.emit({ type: "upgrade", x: tower.x, y: tower.y, lvl: tower.lvl, card, pick: pickIndex, cost, id: tower.id, diff })) : (tower = this.addTower(card, c, r), this.emit({ type: "place", x: tower.x, y: tower.y, card, pick: pickIndex, cost, id: tower.id })), this.picks[pickIndex] = this.drawReplacement(pickIndex), { ok: !0, upgrade: chk.upgrade, tower, cost, diff };
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
  setTargetMode(tw, mode) {
    return !hasTargetModes(tw.type) || !TARGET_MODES.includes(mode) ? !1 : (tw.mode = mode, this.emit({ type: "mode", id: tw.id, x: tw.x, y: tw.y, mode }), !0);
  }
  cycleTargetMode(tw) {
    return hasTargetModes(tw.type) && this.setTargetMode(tw, nextTargetMode(tw.mode)) ? tw.mode : null;
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
          !boss && rd != null && !tw.charmSet.has(a.id) && a.state === "go" && (tw.charmSet.add(a.id), a.charmT = tw.stat("charmTime"), a.charmD = rd, this.emit({ type: "charm", x: a.x, y: a.y }));
        } else tw.type === "lava" ? (a.slow = Math.max(a.slow, tw.stat("slow")), this.damage(a, tw.stat("power") * dt, { ignoreArmor: !0, src: tw }), tw.roastSet.has(a.id) || (tw.roastSet.add(a.id), this.emit({ type: "roast", x: a.x, y: a.y }))) : tw.type === "gate" && tw.tick <= 0 && (this.damage(a, tw.stat("power"), { ignoreArmor: !0, src: tw }), zapped = !0);
      }
      tw.type === "gate" && tw.tick <= 0 && (tw.tick = 1 / tw.stat("rate"), zapped && (tw.fireFx = 0.2, this.emit({ type: "gateZap", x: tw.px, y: tw.py })));
    }
    for (let a of this.ants) {
      if (a.dead) continue;
      let rt = this.route(a), L = rt.length;
      a.hitFlash = Math.max(0, a.hitFlash - dt), a.plantSlowT > 0 && (a.plantSlowT -= dt, a.slow = Math.max(a.slow, a.plantSlow));
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
        let st = tw.stat("stagger");
        for (let a of inRange)
          this.damage(a, tw.stat("power"), { ignoreArmor: !0, src: tw }), a.dead || (a.stunT = Math.max(a.stunT, st * (ANTS[a.type].boss ? 0.3 : 1)));
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
        this.damage(target, tw.stat("power") * (1 + heat), { src: tw }), this.emit({ type: "beam", x: tw.x, y: tw.y - 10, tx: target.x, ty: target.y, heat: heat / (tw.stat("heatMax") || 1) });
      } else if (tw.type === "zapper") {
        let hit2 = /* @__PURE__ */ new Set([target.id]), cur = target, dmg = tw.stat("power");
        this.damage(target, dmg, { src: tw }), this.emit({ type: "zap", x: tw.x, y: tw.y - 14, tx: target.x, ty: target.y });
        for (let k = 0; k < tw.stat("chain"); k++) {
          let nx = null, nd = T.chainRange;
          for (let a of this.ants) {
            if (a.dead || !a.flying || hit2.has(a.id)) continue;
            let q = Math.hypot(a.x - cur.x, a.y - cur.y);
            q <= nd && (nd = q, nx = a);
          }
          if (!nx) break;
          dmg *= T.chainFalloff, hit2.add(nx.id), this.emit({ type: "zap", x: cur.x, y: cur.y, tx: nx.x, ty: nx.y, chain: !0 }), this.damage(nx, dmg, { src: tw }), cur = nx;
        }
      } else tw.type === "lizard" ? (this.damage(target, tw.stat("power"), { src: tw }), this.emit({ type: "tongue", x: tw.x, y: tw.y, tx: target.x, ty: target.y }), tw.fireFx = 0.25) : tw.type === "spray" && (this.clouds.push({ x: target.x, y: target.y, r: tw.stat("cloudRadius"), dps: tw.stat("power"), left: T.cloudTime, total: T.cloudTime, src: tw }), this.emit({ type: "spray", x: tw.x, y: tw.y, tx: target.x, ty: target.y }));
    }
    for (let p of this.projectiles) {
      let tg = p.target, dx = tg.x - p.x, dy = tg.y - p.y, dist = Math.hypot(dx, dy), step = p.speed * dt;
      dist <= step || tg.dead ? (tg.dead || this.damage(tg, p.dmg, { src: p.src }), p.done = !0, this.emit({ type: "hit", x: tg.x, y: tg.y })) : (p.x += dx / dist * step, p.y += dy / dist * step);
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
    return pool.reduce((b, a) => a.hp < b.hp - 1e-9 || Math.abs(a.hp - b.hp) <= 1e-9 && this.threat(a) > this.threat(b) ? a : b);
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
    this.foodStored -= steal, this.stats.stolen += steal, this.emit({ type: "steal", x: a.x, y: a.y, n: steal, ant: a.type }), this.cfg.carryBack && steal > 0 ? (a.state = "back", a.carrying = steal, a.d = this.route(a).length - 0.01) : (this.cfg.carryBack || (this.foodDelivered += steal), a.dead = !0, a.escaped = !0);
  }
  get stars() {
    return this.result === "win" ? starsFor(this.foodStored, this.cfg.foodHP) : 0;
  }
};
function segDist(px, py, ax, ay, bx, by) {
  let vx = bx - ax, vy = by - ay, l2 = vx * vx + vy * vy || 1, t = Math.max(0, Math.min(1, ((px - ax) * vx + (py - ay) * vy) / l2));
  return Math.hypot(px - (ax + vx * t), py - (ay + vy * t));
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
    packsSinceNew: 0
  };
}
var SAVE_VERSION = 5;
function newOnboardState() {
  return { zapperGift: "none", grantedOnLoad: !1 };
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
function battleCoins(result, { kills = 0, foodLeft = 0, levelIndex = 0, firstClear = !1, time = 0 } = {}, E = ECONOMY) {
  if (result === "win") {
    let parts = {
      base: E.winBase,
      food: Math.round(foodLeft * E.coinsPerFood),
      kills: Math.round(kills * E.coinsPerKillWin),
      level: levelIndex * E.coinsPerLevel,
      firstClear: firstClear ? E.firstClearBonus : 0,
      time: timeCoins(time, E)
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
function applyBattleResult(save, levelIndex, result, stars, info = {}, rng = Math.random) {
  let E = ECONOMY, out = { coins: 0, parts: {}, unlocked: null, bonusReward: null, booster: null, prize: null, firstClear: !1, perfect: !1 };
  if (result === "win") {
    let lv = save.levels[levelIndex];
    out.firstClear = !lv.cleared;
    let c = battleCoins("win", { kills: info.kills || 0, foodLeft: info.foodLeft ?? BATTLE.foodHP, levelIndex, firstClear: out.firstClear, time: info.time || 0 });
    if (out.coins = c.total, out.parts = c.parts, out.firstClear) {
      let fb = (E.firstClearBoosters || {})[levelIndex];
      if (fb && (out.booster = grantBooster(save, fb, 1)), E.bonusRewardOnFirstClear && !out.booster) {
        let b = BONUS_TYPES[Math.floor(rng() * BONUS_TYPES.length)];
        out.booster = grantBooster(save, b, 1), out.bonusReward = b;
      }
    }
    info.perfect && (out.perfect = !0, out.prize = grantPerfectPrize(save, rng, void 0, { noBooster: !!out.booster })), lv.cleared = !0, lv.stars = Math.max(lv.stars, stars), info.perfect && (lv.perfect = !0), save.onboard = save.onboard || newOnboardState(), levelIndex === ZAPPER_STAGE && out.firstClear && save.onboard.zapperGift === "none" && (save.onboard.zapperGift = "pending", out.zapperGift = !0);
  } else {
    let c = battleCoins("lose", { kills: info.kills || 0, time: info.time || 0 });
    out.coins = c.total, out.parts = c.parts;
  }
  return save.coins += out.coins, out;
}
function prepIssues(save, bonuses) {
  return bonuses.filter((b) => (save.bonusStock[b] || 0) <= 0).map((b) => ({ kind: "zeroBonus", bonus: b, blocking: !1 }));
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
    (!s.onboard || typeof s.onboard != "object") && (s.onboard = newOnboardState(), s.levels[ZAPPER_STAGE] && s.levels[ZAPPER_STAGE].cleared && (s.onboard.zapperGift = "done")), (s.version || 1) < 5 && s.levels[ZAPPER_STAGE] && s.levels[ZAPPER_STAGE].cleared && s.onboard.zapperGift === "done" && !s.onboard.legacyPack && (s.onboard.zapperGift = "pending", s.onboard.legacyPack = !0, s.onboard.grantedOnLoad = !1), typeof s.packsSinceNew != "number" && (s.packsSinceNew = 0);
    for (let b of BONUS_TYPES) s.bonusStock[b] == null && (s.bonusStock[b] = 0);
    for (; s.levels.length < LEVELS.length; ) s.levels.push({ stars: 0, cleared: !1 });
    typeof s.diamonds != "number" && (s.diamonds = ECONOMY.diamonds.start), s.calendar || (s.calendar = newCalendarState()), (!s.cardBlink || typeof s.cardBlink != "object") && (s.cardBlink = newCardBlinkState());
    for (let k of Object.keys(base.cardBlink)) typeof s.cardBlink[k] != "boolean" && (s.cardBlink[k] = !1);
    return s.lastDeck || (s.lastDeck = base.lastDeck.slice()), s.lastBonuses || (s.lastBonuses = base.lastBonuses.slice()), s.version = Math.max(s.version || 1, SAVE_VERSION), delete s.crumbs, s;
  } catch {
    return newSave();
  }
}
function writeSave(storage2, save) {
  let copy = { ...save };
  delete copy.crumbs, storage2.setItem(SAVE_KEY, JSON.stringify(copy));
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
var coinAmount = (k, K = CALENDAR) => K.coinsByStreak[Math.min(Math.max(1, k), K.coinsByStreak.length) - 1];
function prizeFor(tile, streak, K = CALENDAR, coinStep = streak) {
  let e = K.week[tile], s = Math.max(1, streak);
  return e.kind === "coins" ? { kind: "coins", count: e.count ?? coinAmount(coinStep, K) } : e.kind === "diamonds" ? { kind: "diamonds", count: e.count ?? K.diamondsByStreakWeek[Math.min(Math.floor((s - 1) / 7), K.diamondsByStreakWeek.length - 1)] } : e.kind === "card" ? { kind: "card", level: e.level || 1, ...e.extra ? { extra: { ...e.extra } } : {} } : e.kind === "booster" ? { kind: "booster", id: e.id, count: 1 } : { ...e };
}
function status(save, now2, K = CALENDAR) {
  let c = cal(save), today = dayNumber(now2);
  visit(c, today, K);
  let tile = c.pos, claimable = canClaim(save, now2), streakAfter = nextStreak(save, now2, K), resetPending = claimable && c.lastClaimDay != null && streakResets(c, today, K), base = coinBase(c, save, now2, K), coins = base, tiles = K.week.map((e, i) => {
    let step = base + 1;
    return i >= tile && (e.kind === "coins" && coins++, step = coins), {
      i,
      state: c.weekClaimed[i] ? "claimed" : i === tile ? claimable ? "today" : "claimed" : i < tile ? "missed" : "future",
      prize: c.weekClaimed[i] && c.weekGot && c.weekGot[i] && c.weekGot[i].kind === e.kind ? { ...prizeFor(i, streakAfter, K, step), count: c.weekGot[i].count } : prizeFor(i, i >= tile ? streakAfter + (i - tile) : streakAfter, K, step)
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
  let streak = nextStreak(save, now2, K), base = coinBase(c, save, now2, K), isCoins = K.week[tile].kind === "coins", p0 = prizeFor(tile, streak, K, base + 1), prize = grant(save, p0, rng), extra = p0.extra ? grant(save, p0.extra, rng) : null;
  prize && extra && (prize.extra = extra);
  let ms = K.monthMilestones && K.monthMilestones[streak], milestone = ms ? grant(save, ms.kind === "booster" ? { ...ms, count: 1 } : ms, rng) : null;
  return c.streak = streak, c.coinStep = base + (isCoins ? 1 : 0), c.lastClaimDay = today, c.lastClaimTs = now2, c.lastSeenTs = now2, c.broken = !1, c.weekClaimed[tile] = !0, c.weekGot = c.weekGot || [], c.weekGot[tile] = prize && prize.count != null ? { kind: prize.kind, count: prize.count } : null, c.log = [...c.log || [], { day: today, tile, streak, prize: prize && prize.kind }].slice(-40), { ok: !0, tile, streak, prize, extra, milestone };
}

// src/art.js
var CRUMB_OUTLINE = "#2e1a12", INK = "#523c4b", FONT = "'Trebuchet MS','Nunito','Arial Rounded MT Bold','Segoe UI',Roboto,sans-serif";
function rr(ctx2, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2), ctx2.beginPath(), ctx2.moveTo(x + r, y), ctx2.arcTo(x + w, y, x + w, y + h, r), ctx2.arcTo(x + w, y + h, x, y + h, r), ctx2.arcTo(x, y + h, x, y, r), ctx2.arcTo(x, y, x + w, y, r), ctx2.closePath();
}
function shade(hex, amt) {
  let c = hex.replace("#", "");
  c.length === 3 && (c = c.split("").map((x) => x + x).join(""));
  let n = parseInt(c, 16), r = n >> 16 & 255, g = n >> 8 & 255, b = n & 255, f = (v) => Math.max(0, Math.min(255, Math.round(amt > 0 ? v + (255 - v) * amt : v * (1 + amt))));
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}
function blob(ctx2, x, y, rx, ry, color, lw = 2, rot = 0) {
  let g = ctx2.createRadialGradient(x - rx * 0.35, y - ry * 0.45, Math.max(1, Math.min(rx, ry) * 0.12), x, y, Math.max(rx, ry) * 1.15);
  g.addColorStop(0, shade(color, 0.5)), g.addColorStop(0.35, shade(color, 0.18)), g.addColorStop(0.75, color), g.addColorStop(1, shade(color, -0.16)), ctx2.beginPath(), ctx2.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2), ctx2.fillStyle = g, ctx2.fill(), lw && (ctx2.lineWidth = lw, ctx2.strokeStyle = INK, ctx2.stroke());
}
function shadow(ctx2, x, y, rx, ry = rx * 0.35, a = 0.2) {
  ctx2.save(), ctx2.translate(x, y), ctx2.scale(1, ry / Math.max(rx, 0.01));
  let g = ctx2.createRadialGradient(0, 0, 0, 0, 0, rx * 1.15);
  g.addColorStop(0, `rgba(74,40,60,${a * 1.25})`), g.addColorStop(0.55, `rgba(74,40,60,${a * 0.85})`), g.addColorStop(1, "rgba(74,40,60,0)"), ctx2.beginPath(), ctx2.arc(0, 0, rx * 1.15, 0, Math.PI * 2), ctx2.fillStyle = g, ctx2.fill(), ctx2.restore();
}
function rim(ctx2, x, y, rx, ry, a = 0.7, from = Math.PI * 1.05, to = Math.PI * 1.55) {
  ctx2.beginPath(), ctx2.ellipse(x, y, rx * 0.86, ry * 0.86, 0, from, to), ctx2.lineWidth = Math.max(1, Math.min(rx, ry) * 0.16), ctx2.strokeStyle = `rgba(255,255,255,${a})`, ctx2.lineCap = "round", ctx2.stroke();
}
function text(ctx2, s, x, y, size = 16, fill = "#fff", align = "center", stroke = INK, weight = "bold") {
  ctx2.font = `${weight} ${size}px ${FONT}`, ctx2.textAlign = align, ctx2.textBaseline = "middle", stroke && (ctx2.lineJoin = "round", ctx2.lineWidth = Math.max(2, size / 4.5), ctx2.strokeStyle = stroke, ctx2.strokeText(s, x, y)), ctx2.fillStyle = fill, ctx2.fillText(s, x, y);
}
function eye(ctx2, x, y, r, look = 0.5, blink = !1) {
  if (blink) {
    ctx2.beginPath(), ctx2.moveTo(x - r, y), ctx2.quadraticCurveTo(x, y + r * 0.7, x + r, y), ctx2.lineWidth = 1.6, ctx2.strokeStyle = INK, ctx2.stroke();
    return;
  }
  ctx2.beginPath(), ctx2.ellipse(x, y, r, r * 1.12, 0, 0, Math.PI * 2), ctx2.fillStyle = "#fff", ctx2.fill(), ctx2.lineWidth = 1.5, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.arc(x + r * 0.35 * look, y + r * 0.1, r * 0.6, 0, Math.PI * 2), ctx2.fillStyle = "#2b1d28", ctx2.fill(), ctx2.beginPath(), ctx2.arc(x + r * 0.35 * look - r * 0.22, y - r * 0.2, r * 0.22, 0, Math.PI * 2), ctx2.fillStyle = "#fff", ctx2.fill();
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
  ctx2.save(), ctx2.translate(x, y), ctx2.scale(s, s), blob(ctx2, 0, 0, 8, 8, "#ffd45e", 1.8), ctx2.beginPath(), ctx2.arc(0, 0, 5, 0, 7), ctx2.strokeStyle = "#d99a1e", ctx2.lineWidth = 1.4, ctx2.stroke(), ctx2.fillStyle = "#d99a1e", ctx2.font = `bold 8px ${FONT}`, ctx2.textAlign = "center", ctx2.textBaseline = "middle", ctx2.fillText("C", 0, 0.5), ctx2.restore();
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
  if (ctx2.beginPath(), ctx2.arc(0, -11.5 - lift, 2.2, 0, 7), ctx2.fillStyle = st.knot, ctx2.fill(), ctx2.stroke(), ctx2.beginPath(), ctx2.ellipse(-7, -0.5, 2.6, 1, -0.3, 0, 7), ctx2.fillStyle = "rgba(255,255,255,0.8)", ctx2.fill(), reached || (ctx2.font = `bold 9px ${FONT}`, ctx2.textAlign = "center", ctx2.textBaseline = "middle", ctx2.lineWidth = 2.4, ctx2.strokeStyle = INK, ctx2.strokeText("?", 7.5, 9.5), ctx2.fillStyle = "#ffffff", ctx2.fillText("?", 7.5, 9.5)), ctx2.restore(), tier >= 2) for (let k = 0; k < (tier === 3 ? 4 : 2); k++) {
    let a = t * 1.6 + k * (Math.PI * 2 / (tier === 3 ? 4 : 2));
    starShape(ctx2, x + Math.cos(a) * 20 * s, y + bob + Math.sin(a) * 13 * s, (tier === 3 ? 3.4 : 2.4) * (0.75 + 0.25 * Math.sin(t * 5 + k)), "#fff7a8", 1);
  }
}
var NODE_COLS = ["#ffc38a", "#ffb3c1", "#b9e89a", "#9fd6ff", "#c9b6f2", "#ffd27a", "#ff9e9e", "#a8e6e0", "#f7b6e8", "#d7b8ff"], NODE_ORN = ["leaf", "crumb", "bubble", "wing", "shield", "cloud", "cone", "mask", "dots", "crown"];
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
  }
  ctx2.restore();
}
function mapNode(ctx2, x, y, i, st, t = 0) {
  let base = st.open ? NODE_COLS[i % NODE_COLS.length] : "#cfc6cf", R = st.boss ? 29 : 27, depth = 7;
  if (ctx2.save(), shadow(ctx2, x, y + 26, 30, 7, 0.22), st.next && (ctx2.beginPath(), ctx2.ellipse(x, y + 3, R + 7 + Math.sin(t * 4) * 2, R * 0.92 + 6, 0, 0, 7), ctx2.fillStyle = "rgba(255,212,94,0.35)", ctx2.fill()), ctx2.beginPath(), ctx2.ellipse(x, y + depth, R, R * 0.9, 0, 0, Math.PI), ctx2.lineTo(x - R, y), ctx2.ellipse(x, y, R, R * 0.9, 0, Math.PI, 0, !0), ctx2.closePath(), ctx2.fillStyle = shade(base, -0.3), ctx2.fill(), ctx2.lineWidth = 3, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), st.boss) {
    for (let k = 0; k <= 10; k++) {
      let a = Math.PI + k / 10 * Math.PI, rr2 = k % 2 ? R * 0.82 : R;
      k === 0 ? ctx2.moveTo(x + Math.cos(a) * R, y + Math.sin(a) * R * 0.9) : ctx2.lineTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2 * 0.9 - (k % 2 ? 0 : 3));
    }
    ctx2.ellipse(x, y, R, R * 0.9, 0, 0, Math.PI);
  } else ctx2.ellipse(x, y, R, R * 0.9, 0, 0, 7);
  let g = ctx2.createRadialGradient(x - R * 0.35, y - R * 0.4, 2, x, y, R * 1.1);
  g.addColorStop(0, shade(base, 0.55)), g.addColorStop(0.6, base), g.addColorStop(1, shade(base, -0.12)), ctx2.fillStyle = g, ctx2.fill(), ctx2.lineWidth = 3, ctx2.strokeStyle = st.cleared ? "#e0a830" : INK, ctx2.stroke(), st.cleared && (ctx2.beginPath(), ctx2.ellipse(x, y, R - 2.5, R * 0.9 - 2.5, 0, 0, 7), ctx2.lineWidth = 2, ctx2.strokeStyle = "#ffe9a0", ctx2.stroke()), ctx2.beginPath(), ctx2.ellipse(x, y + 1, R * 0.66, R * 0.6, 0, 0, 7), ctx2.lineWidth = 2, ctx2.strokeStyle = `rgba(255,255,255,${st.open ? 0.55 : 0.3})`, ctx2.stroke(), ctx2.beginPath(), ctx2.ellipse(x - R * 0.38, y - R * 0.5, R * 0.36, R * 0.16, -0.4, 0, 7), ctx2.fillStyle = "rgba(255,255,255,0.6)", ctx2.fill(), st.open ? (text(ctx2, String(i + 1), x, y + 1, 23, "#fff"), nodeOrnament(ctx2, NODE_ORN[i % NODE_ORN.length], x + R * 0.72, y - R * 0.72, t), st.stars >= 3 && !st.boss && miniCrown(ctx2, x, y - R - 3, 1.1)) : (rr(ctx2, x - 8, y - 3, 16, 13, 3), ctx2.fillStyle = "#8c8090", ctx2.fill(), ctx2.beginPath(), ctx2.arc(x, y - 4, 5.5, Math.PI, 0), ctx2.lineWidth = 3, ctx2.strokeStyle = "#8c8090", ctx2.stroke()), ctx2.restore();
}
function starShape(ctx2, x, y, r, fill, lw = 2) {
  ctx2.beginPath();
  for (let i = 0; i < 10; i++) {
    let a = -Math.PI / 2 + i * Math.PI / 5, rr2 = i % 2 ? r * 0.48 : r;
    ctx2.lineTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2);
  }
  ctx2.closePath(), ctx2.fillStyle = fill, ctx2.fill(), ctx2.lineJoin = "round", ctx2.lineWidth = lw, ctx2.strokeStyle = INK, ctx2.stroke();
}
var ANT_COL = { small: "#f8c27e", worker: "#f2a65f", big: "#e7925a", gasmask: "#eeac78", armored: "#e9a067", flyer: "#f7b083", queen: "#f59b9b", queen2: "#c7a6f5", sprinter: "#f4ad6a", heavy: "#dd8a55" }, ALW = 2.4;
function softBlob(ctx2, x, y, rx, ry, col, lw = ALW) {
  blob(ctx2, x, y, rx, ry, col, lw), ctx2.beginPath(), ctx2.ellipse(x - rx * 0.28, y - ry * 0.46, rx * 0.4, ry * 0.22, -0.35, 0, 7), ctx2.fillStyle = "rgba(255,255,255,0.5)", ctx2.fill();
}
function glossyEye(ctx2, x, y, rx, ry, blink) {
  if (blink) {
    ctx2.beginPath(), ctx2.moveTo(x - rx, y + 0.5), ctx2.quadraticCurveTo(x, y + ry * 0.9, x + rx, y + 0.5), ctx2.lineWidth = 1.9, ctx2.strokeStyle = INK, ctx2.stroke();
    return;
  }
  ctx2.beginPath(), ctx2.ellipse(x, y, rx, ry, 0, 0, 7);
  let g = ctx2.createLinearGradient(0, y - ry, 0, y + ry);
  g.addColorStop(0, "#24151f"), g.addColorStop(0.65, "#3b2533"), g.addColorStop(1, "#7a4f62"), ctx2.fillStyle = g, ctx2.fill(), ctx2.beginPath(), ctx2.ellipse(x - rx * 0.22, y - ry * 0.32, rx * 0.46, ry * 0.36, -0.3, 0, 7), ctx2.fillStyle = "#ffffff", ctx2.fill(), ctx2.beginPath(), ctx2.arc(x + rx * 0.38, y + ry * 0.36, rx * 0.2, 0, 7), ctx2.fillStyle = "rgba(255,255,255,0.9)", ctx2.fill();
}
function cheek(ctx2, x, y, r = 2.4) {
  ctx2.beginPath(), ctx2.ellipse(x, y, r, r * 0.62, 0, 0, 7), ctx2.fillStyle = "rgba(255,112,140,0.55)", ctx2.fill();
}
function leg(ctx2, x0, y0, x1, y1, col) {
  ctx2.lineCap = "round", ctx2.beginPath(), ctx2.moveTo(x0, y0), ctx2.quadraticCurveTo((x0 + x1) / 2 + 1, (y0 + y1) / 2 + 1, x1, y1), ctx2.lineWidth = 4.8, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.lineWidth = 2.6, ctx2.strokeStyle = col, ctx2.stroke();
}
function sneaker(ctx2, x, y, far) {
  ctx2.beginPath(), ctx2.ellipse(x + 1, y + 0.6, 2.8, 1.7, 0, 0, 7), ctx2.fillStyle = far ? "#e6e6ee" : "#ffffff", ctx2.fill(), ctx2.lineWidth = 1.3, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.moveTo(x - 0.8, y + 0.4), ctx2.lineTo(x + 2.4, y + 0.1), ctx2.lineWidth = 1.1, ctx2.strokeStyle = "#ff5a6e", ctx2.stroke();
}
var ANT_LOOK = { small_gasmask: "gasmask", small_armed: "armored", small_fly: "flyer" };
function drawAnt(ctx2, type, phase = 0, opt = {}) {
  let S2 = ANTS[type].size;
  type = ANT_LOOK[type] || type;
  let col = ANT_COL[type], legCol = shade(col, -0.18), farCol = shade(col, -0.32), P = phase * Math.PI * 2, step = Math.sin(P), hop = Math.abs(Math.sin(P)), flying = type === "flyer", queen = type === "queen" || type === "queen2", swiftQueen = type === "queen2", big = type === "big" || type === "heavy", shell = type === "armored" || type === "heavy" || type === "sprinter", sprinter = type === "sprinter", heavy = type === "heavy";
  ctx2.save(), ctx2.scale(S2, S2), ctx2.lineJoin = "round", ctx2.lineCap = "round", flying ? shadow(ctx2, 0, 21, 10, 3, 0.13) : shadow(ctx2, 0, 10.5, 15 - hop * 2, 4, 0.2);
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
  if (flying) {
    let flap = Math.sin(P * 8);
    for (let k of [1, 0])
      ctx2.save(), ctx2.translate(-2, -4), ctx2.rotate(-2 - flap * 0.45 - k * 0.5), ctx2.beginPath(), ctx2.ellipse(11, 0, 12.5, 6.5, 0, 0, 7), ctx2.fillStyle = k ? "rgba(205,236,255,0.8)" : "rgba(232,247,255,0.92)", ctx2.fill(), ctx2.lineWidth = 2, ctx2.strokeStyle = "#6f9cc2", ctx2.stroke(), ctx2.beginPath(), ctx2.ellipse(13, -1.5, 5, 1.6, 0, 0, 7), ctx2.fillStyle = "rgba(255,255,255,0.8)", ctx2.fill(), ctx2.restore();
  }
  if (queen) {
    let sw = Math.sin(P) * 1.5;
    ctx2.beginPath(), ctx2.moveTo(3, -8), ctx2.quadraticCurveTo(-14, -12 + sw, -24, 7), ctx2.quadraticCurveTo(-11, 11, 2, 5), ctx2.closePath();
    let g = ctx2.createLinearGradient(0, -10, 0, 10);
    g.addColorStop(0, "#b597f0"), g.addColorStop(1, "#8a68d8"), ctx2.fillStyle = g, ctx2.fill(), ctx2.lineWidth = ALW, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.moveTo(-22, 6.5), ctx2.quadraticCurveTo(-10, 10, 1.5, 4.5), ctx2.lineWidth = 3.4, ctx2.strokeStyle = "#ffffff", ctx2.stroke(), ctx2.fillStyle = INK;
    for (let [a, b] of [[-17, 6.8], [-10, 8], [-4, 6.6]])
      ctx2.beginPath(), ctx2.arc(a, b, 0.9, 0, 7), ctx2.fill();
  }
  let legY = 3, footY = flying ? 7.5 : 10;
  for (let i = 0; i < 3; i++) {
    let sw = (i % 2 ? -1 : 1) * step * 2.4;
    leg(ctx2, -7 + i * 4.5, legY, -6 + i * 4.5 - sw, footY - 0.5, farCol), sprinter && sneaker(ctx2, -6 + i * 4.5 - sw, footY - 0.5, !0);
  }
  let abRx = queen ? 12 : big ? 11.5 : 9.5, abRy = queen ? 10 : big ? 9.5 : 8;
  softBlob(ctx2, -10, 0.5, abRx, abRy, col), ctx2.save(), ctx2.beginPath(), ctx2.ellipse(-10, 0.5, abRx - 1, abRy - 1, 0, 0, 7), ctx2.clip(), ctx2.strokeStyle = shade(col, -0.14), ctx2.lineWidth = 2;
  for (let sx of [-15, -10.5])
    ctx2.beginPath(), ctx2.ellipse(sx - (big ? 1.5 : 0), 0.5, 2, abRy + 2, 0, -1.3, 1.3), ctx2.stroke();
  if (ctx2.restore(), shell) {
    ctx2.save(), ctx2.beginPath(), ctx2.ellipse(-10, 0, abRx + 1.2, abRy + 0.8, 0, Math.PI * 1.02, Math.PI * 1.98), ctx2.quadraticCurveTo(-10, 3, -10 - abRx - 1, 0), ctx2.closePath();
    let g = ctx2.createLinearGradient(0, -9, 0, 2);
    g.addColorStop(0, "#ffffff"), g.addColorStop(1, heavy ? "#9aa3ba" : sprinter ? "#bfe3ff" : "#b4bdd0"), ctx2.fillStyle = g, ctx2.fill(), ctx2.lineWidth = 2.4, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.fillStyle = heavy ? "#f4b632" : "#8992aa";
    for (let rx of [-16, -10, -4])
      ctx2.beginPath(), ctx2.arc(rx, -3, 1.1, 0, 7), ctx2.fill();
    heavy && (ctx2.beginPath(), ctx2.ellipse(-10, -2.5, abRx * 0.8, 1.4, 0, Math.PI * 1.1, Math.PI * 1.9), ctx2.lineWidth = 1.6, ctx2.strokeStyle = "#f4b632", ctx2.stroke()), ctx2.restore();
  }
  softBlob(ctx2, -1, 1.5, 5.2, 4.8, col), opt.carrying && crumbIcon(ctx2, -10, -11, 1.3, !0);
  for (let i = 0; i < 3; i++) {
    let sw = (i % 2 ? 1 : -1) * step * 2.6;
    leg(ctx2, -5 + i * 4.5, legY + 1, -4 + i * 4.5 + sw, footY + 0.5, legCol), sprinter && sneaker(ctx2, -4 + i * 4.5 + sw, footY + 0.5, !1), big && blob(ctx2, -4 + i * 4.5 + sw, footY + 0.8, 2.2, 1.6, shade(col, -0.3), 1.4);
  }
  sprinter && (ctx2.save(), ctx2.beginPath(), ctx2.ellipse(-1, 1.5, 5.2, 4.8, 0, 0, 7), ctx2.clip(), ctx2.fillStyle = "#4fb4ff", ctx2.fillRect(-7, -4, 12, 12), ctx2.fillStyle = "#ffffff", ctx2.fillRect(-7, -0.6, 12, 1.6), ctx2.restore(), ctx2.beginPath(), ctx2.ellipse(-1, 1.5, 5.2, 4.8, 0, 0, 7), ctx2.lineWidth = ALW, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.font = `bold 5px ${FONT}`, ctx2.textAlign = "center", ctx2.textBaseline = "middle", ctx2.fillStyle = "#ffffff", ctx2.fillText("7", -1, 4.2));
  let hr = type === "small" || big ? 11.5 : queen ? 11 : 10.8, hx = 8, hy = -9, bob = Math.sin(P * 2 + 0.6) * 1.4;
  if (type !== "armored" && type !== "heavy" && type !== "small")
    for (let k of [0, 1]) {
      let bx0 = hx - 3 + k * 6, by0 = hy - hr + 3, tx = hx - 4.5 + k * 10 + bob * (k ? 1 : -0.6), ty = hy - hr - 4.5 + k * 0.5 - Math.abs(bob) * 0.5;
      ctx2.beginPath(), ctx2.moveTo(bx0, by0), ctx2.quadraticCurveTo(bx0 + (k ? 3 : -2), ty + 3, tx, ty), ctx2.lineWidth = 3.8, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.lineWidth = 1.5, ctx2.strokeStyle = legCol, ctx2.stroke(), blob(ctx2, tx, ty, 2.5, 2.5, shade(col, 0.25), 2);
    }
  softBlob(ctx2, hx, hy, hr, hr * 0.94, col);
  let e1x = hx + 0.5, e2x = hx + 7.3, ey = hy + 0.8, blink = opt.blink;
  if (type === "gasmask") {
    ctx2.beginPath(), ctx2.moveTo(hx - hr + 1, hy - 3), ctx2.quadraticCurveTo(hx - 2, hy - 6, e1x, ey - 1), ctx2.lineWidth = 3, ctx2.strokeStyle = "#6f6a7c", ctx2.stroke();
    for (let [ex, r] of [[e1x, 4.6], [e2x, 4.1]])
      ctx2.beginPath(), ctx2.arc(ex, ey - 0.3, r, 0, 7), ctx2.fillStyle = "#d9f3ff", ctx2.fill(), ctx2.lineWidth = 2.6, ctx2.strokeStyle = "#5d5a6b", ctx2.stroke(), glossyEye(ctx2, ex + 0.3, ey - 0.2, r * 0.55, r * 0.68, blink), ctx2.beginPath(), ctx2.arc(ex - r * 0.35, ey - r * 0.45, r * 0.22, 0, 7), ctx2.fillStyle = "rgba(255,255,255,0.8)", ctx2.fill();
    blob(ctx2, hx + 5, hy + 7.4, 5.2, 3.8, "#a7afbb", 2.4), ctx2.fillStyle = "#7d8592";
    for (let dx of [-1.8, 0.4, 2.6])
      ctx2.beginPath(), ctx2.arc(hx + 5 + dx, hy + 7.6, 0.8, 0, 7), ctx2.fill();
    blob(ctx2, hx + 10.5, hy + 9.2, 2.8, 3.1, "#7fd3ad", 2.2);
  } else if (glossyEye(ctx2, e1x, ey, 3.1, 3.9, blink), glossyEye(ctx2, e2x, ey - 0.3, 2.7, 3.6, blink), cheek(ctx2, hx - 3, hy + 5.6), cheek(ctx2, hx + 10, hy + 5.2, 2), big ? (ctx2.beginPath(), ctx2.moveTo(hx + 1, hy + 6.2), ctx2.quadraticCurveTo(hx + 4, hy + 3.6, hx + 4.2, hy + 5.4), ctx2.quadraticCurveTo(hx + 4.6, hy + 3.6, hx + 8, hy + 6.2), ctx2.quadraticCurveTo(hx + 4.4, hy + 8, hx + 1, hy + 6.2), ctx2.fillStyle = "#8a4b33", ctx2.fill(), ctx2.lineWidth = 1.3, ctx2.strokeStyle = INK, ctx2.stroke()) : (ctx2.beginPath(), ctx2.moveTo(hx + 2.6, hy + 5.6), ctx2.quadraticCurveTo(hx + 4.3, hy + 8.4, hx + 6, hy + 5.6), ctx2.lineWidth = 1.8, ctx2.strokeStyle = INK, ctx2.stroke(), queen && (ctx2.beginPath(), ctx2.ellipse(hx + 4.3, hy + 6.6, 1.3, 0.8, 0, 0, 7), ctx2.fillStyle = "#ff6f91", ctx2.fill())), queen) {
    ctx2.lineWidth = 1.5, ctx2.strokeStyle = INK;
    for (let [ex, k] of [[e1x - 2.4, 0], [e1x - 1, 1], [e2x + 1.8, 2]])
      ctx2.beginPath(), ctx2.moveTo(ex, ey - 3), ctx2.lineTo(ex + (k === 2 ? 1.6 : -1.2), ey - 5.2), ctx2.stroke();
  }
  let top = hy - hr;
  if (type === "worker") {
    ctx2.beginPath(), ctx2.ellipse(hx, hy - 3.6, hr * 0.98, hr * 0.78, 0, Math.PI, 0), ctx2.closePath();
    let g = ctx2.createLinearGradient(0, top - 1, 0, hy - 3);
    g.addColorStop(0, "#fff3a3"), g.addColorStop(1, "#f6c33a"), ctx2.fillStyle = g, ctx2.fill(), ctx2.lineWidth = 2.5, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.moveTo(hx - 1, top + 0.5), ctx2.quadraticCurveTo(hx, hy - 7, hx - 0.5, hy - 3.8), ctx2.lineWidth = 2.2, ctx2.strokeStyle = "#e2a521", ctx2.stroke(), rr(ctx2, hx - hr - 1.5, hy - 5.2, hr * 2 + 5, 3.6, 1.8), ctx2.fillStyle = "#f6c33a", ctx2.fill(), ctx2.lineWidth = 2.2, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.ellipse(hx - 4, top + 3.5, 2.5, 1.3, -0.5, 0, 7), ctx2.fillStyle = "rgba(255,255,255,0.7)", ctx2.fill();
  } else if (type === "small") {
    ctx2.beginPath(), ctx2.ellipse(hx - 0.5, hy - 4.2, hr * 0.92, hr * 0.7, 0, Math.PI, 0), ctx2.closePath(), ctx2.fillStyle = "#8fd0f7", ctx2.fill(), ctx2.lineWidth = 2.4, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.save(), ctx2.beginPath(), ctx2.ellipse(hx - 0.5, hy - 4.2, hr * 0.92, hr * 0.7, 0, Math.PI, 0), ctx2.clip(), ctx2.fillStyle = "#ff9fb8", ctx2.fillRect(hx - 4, top - 4, 3.2, 14), ctx2.fillStyle = "#ffe27a", ctx2.fillRect(hx + 3, top - 4, 3.2, 14), ctx2.restore(), ctx2.beginPath(), ctx2.ellipse(hx - 0.5, hy - 4.2, hr * 0.92, hr * 0.7, 0, Math.PI, 0), ctx2.lineWidth = 2.4, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.moveTo(hx - 0.5, top + 1.5), ctx2.lineTo(hx - 0.5, top - 3), ctx2.lineWidth = 2, ctx2.stroke();
    let sp = Math.cos(P * 3);
    ctx2.beginPath(), ctx2.ellipse(hx - 0.5 - 3.6 * sp, top - 3.5, 3.8 * Math.abs(sp) + 0.8, 1.5, 0, 0, 7), ctx2.ellipse(hx - 0.5 + 3.6 * sp, top - 3.5, 3.8 * Math.abs(sp) + 0.8, 1.5, 0, 0, 7), ctx2.fillStyle = "#ff7f9e", ctx2.fill(), ctx2.lineWidth = 1.5, ctx2.stroke(), blob(ctx2, hx - 0.5, top - 3.5, 1.4, 1.4, "#ffe27a", 1.2);
  } else if (type === "big")
    ctx2.save(), ctx2.beginPath(), ctx2.ellipse(hx, hy, hr, hr * 0.94, 0, 0, 7), ctx2.clip(), ctx2.fillStyle = "#ff6f91", ctx2.fillRect(hx - hr - 1, hy - 7.5, hr * 2 + 2, 4), ctx2.fillStyle = "#ffffff", ctx2.fillRect(hx - hr - 1, hy - 6.2, hr * 2 + 2, 1.2), ctx2.restore(), ctx2.beginPath(), ctx2.ellipse(hx, hy, hr, hr * 0.94, 0, 0, 7), ctx2.lineWidth = ALW, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.moveTo(hx - hr + 0.5, hy - 5.5), ctx2.quadraticCurveTo(hx - hr - 4, hy - 4 + step, hx - hr - 5, hy + 0.5), ctx2.lineWidth = 3, ctx2.strokeStyle = "#ff6f91", ctx2.stroke();
  else if (sprinter) {
    ctx2.beginPath(), ctx2.ellipse(hx, hy - 3.4, hr * 1, hr * 0.8, 0, Math.PI, 0), ctx2.closePath();
    let g = ctx2.createLinearGradient(0, top - 1, 0, hy - 3);
    g.addColorStop(0, "#e6f4ff"), g.addColorStop(1, "#4fb4ff"), ctx2.fillStyle = g, ctx2.fill(), ctx2.lineWidth = 2.4, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.moveTo(hx - hr + 1, hy - 6), ctx2.quadraticCurveTo(hx, top - 0.5, hx + hr - 1, hy - 6), ctx2.lineWidth = 2, ctx2.strokeStyle = "#ffffff", ctx2.stroke(), rr(ctx2, hx - 2, hy - 5.8, hr + 3, 2.8, 1.4), ctx2.fillStyle = "#ffe27a", ctx2.fill(), ctx2.lineWidth = 1.6, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.ellipse(hx - 4, top + 3, 2.4, 1.1, -0.4, 0, 7), ctx2.fillStyle = "rgba(255,255,255,0.85)", ctx2.fill();
  } else if (type === "armored" || heavy) {
    ctx2.beginPath(), ctx2.moveTo(hx - hr - 1, hy - 3.5), ctx2.quadraticCurveTo(hx - hr - 1.5, top - 2.5, hx, top - 2.5), ctx2.quadraticCurveTo(hx + hr + 1.5, top - 2.5, hx + hr + 1, hy - 4.5), ctx2.closePath();
    let g = ctx2.createLinearGradient(0, top - 2, 0, hy - 1);
    if (g.addColorStop(0, "#ffffff"), g.addColorStop(1, heavy ? "#8c96ae" : "#aeb8cc"), ctx2.fillStyle = g, ctx2.fill(), ctx2.lineWidth = 2.6, ctx2.strokeStyle = INK, ctx2.stroke(), rr(ctx2, hx - hr - 2, hy - 6.6, hr * 2 + 4, 3.6, 1.8), ctx2.fillStyle = heavy ? "#f4c84a" : "#cfd6e4", ctx2.fill(), ctx2.lineWidth = 2.2, ctx2.stroke(), heavy) for (let sx of [-1, 1])
      ctx2.beginPath(), ctx2.moveTo(hx + sx * (hr - 2), top + 2), ctx2.quadraticCurveTo(hx + sx * (hr + 4), top - 2, hx + sx * (hr + 3), top - 7), ctx2.quadraticCurveTo(hx + sx * (hr + 0.5), top - 2, hx + sx * (hr - 5), top + 1), ctx2.closePath(), ctx2.fillStyle = "#fff6dc", ctx2.fill(), ctx2.lineWidth = 1.8, ctx2.strokeStyle = INK, ctx2.stroke();
    ctx2.fillStyle = "#8992aa";
    for (let dx of [-6, 0, 6])
      ctx2.beginPath(), ctx2.arc(hx + dx, hy - 4.8, 0.9, 0, 7), ctx2.fill();
    ctx2.beginPath(), ctx2.moveTo(hx - 2, top - 1.5), ctx2.quadraticCurveTo(hx - 5, top - 11, hx - 13, top - 8 + step), ctx2.quadraticCurveTo(hx - 8, top - 5, hx - 6, top), ctx2.quadraticCurveTo(hx - 3.5, top - 3, hx - 2, top - 1.5), ctx2.fillStyle = heavy ? "#b48cf0" : "#ff7b7b", ctx2.fill(), ctx2.lineWidth = 2, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.ellipse(hx - 4, top + 2, 2.6, 1.2, -0.4, 0, 7), ctx2.fillStyle = "rgba(255,255,255,0.8)", ctx2.fill();
  } else if (flying) {
    ctx2.beginPath(), ctx2.ellipse(hx, hy - 3, hr * 0.97, hr * 0.8, 0, Math.PI * 0.98, Math.PI * 2.02), ctx2.closePath(), ctx2.fillStyle = "#b9805a", ctx2.fill(), ctx2.lineWidth = 2.4, ctx2.strokeStyle = INK, ctx2.stroke();
    for (let [gx, r] of [[hx - 1, 3.3], [hx + 6, 3]])
      blob(ctx2, gx, hy - 5.8, r, r, "#bfe8ff", 2.2), ctx2.beginPath(), ctx2.arc(gx - 1, hy - 7, 0.9, 0, 7), ctx2.fillStyle = "#fff", ctx2.fill();
    ctx2.beginPath(), ctx2.moveTo(hx + 2.3, hy - 5.8), ctx2.lineTo(hx + 3, hy - 5.8), ctx2.lineWidth = 2, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.moveTo(1, -2), ctx2.quadraticCurveTo(-7, -4 + step * 2, -15, -8 + step * 3), ctx2.lineWidth = 5.6, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.lineWidth = 3.2, ctx2.strokeStyle = "#ff7f9e", ctx2.stroke();
  } else if (queen) {
    let cy = top + 3;
    ctx2.beginPath(), ctx2.moveTo(hx - 7, cy), ctx2.lineTo(hx - 8, cy - 9), ctx2.lineTo(hx - 3.5, cy - 4.5), ctx2.lineTo(hx, cy - 11), ctx2.lineTo(hx + 3.5, cy - 4.5), ctx2.lineTo(hx + 8, cy - 9), ctx2.lineTo(hx + 7, cy), ctx2.closePath();
    let g = ctx2.createLinearGradient(0, cy - 11, 0, cy);
    g.addColorStop(0, "#fff5ad"), g.addColorStop(1, "#f4b632"), ctx2.fillStyle = g, ctx2.fill(), ctx2.lineWidth = 2.3, ctx2.strokeStyle = INK, ctx2.stroke(), blob(ctx2, hx, cy - 2.6, 1.8, 1.8, "#ff6f91", 1.2), blob(ctx2, hx - 5, cy - 2.2, 1.2, 1.2, "#7cc6f2", 1), blob(ctx2, hx + 5, cy - 2.2, 1.2, 1.2, "#7cc6f2", 1);
    for (let [x, y] of [[hx - 8, cy - 9], [hx, cy - 11], [hx + 8, cy - 9]]) blob(ctx2, x, y, 1.4, 1.4, "#fff5ad", 1.2);
  }
  ctx2.restore();
}
var spriteCache = /* @__PURE__ */ new Map(), ANT_FRAMES = 12;
function antSprite(type, frame2, carrying, dpr2) {
  let key = type + frame2 + (carrying ? "c" : "") + dpr2, s = spriteCache.get(key);
  if (s) return s;
  let S2 = ANTS[type].size, w = Math.ceil(80 * S2), h = Math.ceil(84 * S2), cv = makeCanvas(Math.ceil(w * dpr2), Math.ceil(h * dpr2)), g = cv.getContext("2d");
  return g.scale(dpr2, dpr2), g.translate(w / 2, h * 0.66), drawAnt(g, type, frame2 / ANT_FRAMES, { carrying, blink: frame2 === 7 && type !== "queen" && type !== "queen2" }), s = { cv, w, h, ox: w / 2, oy: h * 0.66 }, spriteCache.set(key, s), s;
}
function makeCanvas(w, h) {
  if (typeof OffscreenCanvas < "u") return new OffscreenCanvas(w, h);
  let c = document.createElement("canvas");
  return c.width = w, c.height = h, c;
}
var CARD_COLORS = Object.fromEntries(Object.entries(TOWERS).map(([k, v]) => [k, v.color])), partCache = /* @__PURE__ */ new Map(), partHits = 0, partMisses = 0, partBytes = 0, partClipped = 0, BAKE_BOX = [-44, -60, 44, 36];
function clearTowerCache() {
  partCache.clear(), partBytes = 0;
}
function devScale(ctx2) {
  let sc = 1;
  if (ctx2.getTransform) {
    let m = ctx2.getTransform();
    sc = Math.hypot(m.a, m.b);
  }
  return sc <= 4 ? Math.max(1, Math.ceil(sc * 4 - 1e-6) / 4) : Math.min(8, +Math.pow(2, Math.ceil(Math.log2(sc) * 4 - 1e-6) / 4).toFixed(3));
}
function baked(ctx2, key, draw, os = 1) {
  let sc = devScale(ctx2) * os, k = key + "@" + sc, e = partCache.get(k);
  if (e)
    partHits++;
  else {
    partMisses++, partBytes > 4e7 && clearTowerCache();
    let [x0, y0, x1, y1] = BAKE_BOX, W0 = Math.ceil((x1 - x0) * sc), H0 = Math.ceil((y1 - y0) * sc), big = makeCanvas(W0, H0), g = big.getContext("2d");
    g.setTransform(sc, 0, 0, sc, -x0 * sc, -y0 * sc), g.lineJoin = "round", g.lineCap = "round", draw(g);
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
  baked(ctx2, "pad" + color, (g) => padPaths(g, color));
}
function padPaths(ctx2, color) {
  shadow(ctx2, 0, 11, 18, 6.5, 0.24), ctx2.beginPath(), ctx2.ellipse(0, 8, 16, 8.5, 0, 0, 7), ctx2.fillStyle = shade(color, -0.22), ctx2.fill(), ctx2.lineWidth = 1.9, ctx2.strokeStyle = INK, ctx2.stroke(), blob(ctx2, 0, 5.5, 15.5, 8, shade(color, -0.02), 1.9);
  let g = ctx2.createRadialGradient(-4, 3, 1, 0, 5, 12);
  g.addColorStop(0, shade(color, 0.6)), g.addColorStop(1, shade(color, 0.2)), ctx2.beginPath(), ctx2.ellipse(0, 4.5, 11, 5, 0, 0, 7), ctx2.fillStyle = g, ctx2.fill(), rim(ctx2, 0, 5.5, 15.5, 8, 0.75), ctx2.fillStyle = shade(color, -0.35);
  for (let a of [0.35, 1.2, 1.95, 2.8])
    ctx2.beginPath(), ctx2.arc(Math.cos(a) * 13.2, 6.5 + Math.sin(a) * 6.3, 0.9, 0, 7), ctx2.fill();
}
var lvKey = (lvl) => lvl >= 5 ? 5 : lvl >= 3 ? 3 : lvl >= 2 ? 2 : 1, r2 = (v) => Math.round(v * 100) / 100;
function drawTower(ctx2, type, t = 0, tw = null) {
  let T = TOWERS[type], aim = tw ? tw.aim : -0.6, fx = tw ? tw.fireFx : 0, lvl = tw && tw.lvl || 1, lk = lvKey(lvl);
  switch (ctx2.save(), ctx2.lineJoin = "round", ctx2.lineCap = "round", lvl >= 4 && T.place === "side" && baked(ctx2, "plinth", plinthPaths), lvl >= 2 && T.place === "side" && (baked(ctx2, "trim", (g) => {
    g.beginPath(), g.ellipse(0, 7, 19, 10.5, 0, 0, 7), g.lineWidth = 3.2, g.strokeStyle = "#f4b632", g.stroke();
  }), ctx2.beginPath(), ctx2.ellipse(0, 7, 19, 10.5, 0, Math.PI * 1.1 + t % 3 * 0.6, Math.PI * 1.3 + t % 3 * 0.6), ctx2.lineWidth = 2, ctx2.strokeStyle = "#fff6c0", ctx2.stroke()), lvl > 1 && ctx2.scale(1 + 0.03 * (lvl - 1), 1 + 0.03 * (lvl - 1)), lvl >= 4 && T.place === "path" && pathStuds(ctx2, t), type) {
    case "slingshot": {
      pad(ctx2, "#f6c99a");
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
      pad(ctx2, "#bfe8b2");
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
      pad(ctx2, "#d6c8f5");
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
      pad(ctx2, "#b6defa");
      let ca = tw && tw.lx != null ? Math.atan2(tw.ly - tw.y, tw.lx - tw.x) : 0.5;
      ctx2.save(), ctx2.rotate(ca);
      let cl = lvl >= 2 ? 27 : 22;
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
      baked(ctx2, "fan:below:" + v, (g) => {
        padPaths(g, "#bdeee8"), g.lineWidth = 4, g.strokeStyle = INK, g.beginPath(), g.moveTo(0, 6), g.lineTo(0, -8), g.stroke(), g.lineWidth = 2.2, g.strokeStyle = "#7fcfc4", g.beginPath(), g.moveTo(0, 6), g.lineTo(0, -8), g.stroke(), g.save(), g.translate(0, -16), back || blob(g, mx, my, 6, 6, "#bfe9e2", 1.8), g.restore(), g.save(), cage(g), blob(g, 0, 0, 14, 14, "#effcfa", 2), g.restore();
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
      baked(ctx2, "pher:body", (g) => {
        shadow(g, 0, 9, 13, 4.5, 0.18), g.beginPath(), g.ellipse(0, 6, 15, 6, 0, 0, 7), g.fillStyle = "rgba(255,170,210,0.45)", g.fill(), rr(g, -8, -12, 16, 18, 7);
        let gr = g.createLinearGradient(-8, 0, 8, 0);
        gr.addColorStop(0, "#ffd9ec"), gr.addColorStop(1, "#f59cc6"), g.fillStyle = gr, g.fill(), g.lineWidth = 2.2, g.strokeStyle = INK, g.stroke(), rr(g, -3.5, -18, 7, 6, 2), g.fillStyle = "#e7c4ff", g.fill(), g.stroke(), heart(g, 0, -3, 4, "#ff6fa5");
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
        g.closePath(), g.fillStyle = "rgba(255,248,205,0.92)", g.fill(), g.lineWidth = 2, g.strokeStyle = "#d8c27a", g.stroke(), g.beginPath(), g.ellipse(-5, 0, 4, 1.6, -0.3, 0, 7), g.fillStyle = "#fff", g.fill(), g.save(), g.translate(9, -5), g.rotate(0.9), rr(g, -5, -9, 10, 15, 4), g.fillStyle = "#fffdf3", g.fill(), g.lineWidth = 2, g.strokeStyle = INK, g.stroke(), rr(g, -5, -3, 10, 5, 1), g.fillStyle = "#ffb347", g.fill(), g.stroke(), g.beginPath(), g.moveTo(-2, -9), g.lineTo(0, -14), g.lineTo(2, -9), g.closePath(), g.fillStyle = "#ff8c6b", g.fill(), g.stroke(), g.restore(), lvl >= 2 && (g.save(), g.translate(-10, -3), g.rotate(-0.7), rr(g, -3.5, -6, 7, 10, 3), g.fillStyle = "#fffdf3", g.fill(), g.lineWidth = 1.5, g.strokeStyle = INK, g.stroke(), rr(g, -3.5, -2, 7, 3, 1), g.fillStyle = "#7fd3ff", g.fill(), g.restore());
      }), lk >= 3) for (let k = 0; k < 2; k++) {
        let p = (t * 0.8 + k * 0.5) % 1;
        ctx2.globalAlpha = 1 - p, ctx2.beginPath(), ctx2.arc(-4 + k * 8, 2 - p * 8, 1.5 + p, 0, 7), ctx2.lineWidth = 1, ctx2.strokeStyle = "#d8c27a", ctx2.stroke(), ctx2.globalAlpha = 1;
      }
      lk >= 5 && baked(ctx2, "glue:lp5", (g) => {
        for (let [x, y] of [[-14, 8], [14, 9], [0, 12]]) blob(g, x, y, 2.6, 1.5, "#fff4c0", 1);
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
          if (shadow(g, px, py + 5, 6, 2.2, 0.22), rr(g, px - 3, py - 14, 6, 19, 3), g.fillStyle = "#c3c9d8", g.fill(), g.lineWidth = 1.8, g.strokeStyle = INK, g.stroke(), lvl >= 3) for (let k of [0, 1])
            g.beginPath(), g.ellipse(px, py - 3 - k * 5, 4.2, 1.6, 0, 0, 7), g.fillStyle = "#ffb3c1", g.fill(), g.lineWidth = 1.1, g.strokeStyle = INK, g.stroke();
          lvl >= 2 ? starShape(g, px, py - 16, 5.2, "#ffe066", 1.4) : blob(g, px, py - 15, 4.2, 4.2, "#ffe066", 1.8);
        }
      });
      break;
    }
    case "lizard": {
      baked(ctx2, "liz:shadow", (g) => shadow(g, 0, 11, 17, 5, 0.22));
      let chew = tw && tw.chew > 0, face = Math.cos(aim) >= 0 ? 1 : -1;
      ctx2.save(), ctx2.scale(face, 1), ctx2.beginPath(), ctx2.moveTo(-8, 4), ctx2.quadraticCurveTo(-20, 8 + Math.sin(t * 3) * 3, -18, -4), ctx2.lineWidth = 6, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.lineWidth = 3.6, ctx2.strokeStyle = "#a7d96a", ctx2.stroke(), baked(ctx2, "liz:body", (g) => {
        blob(g, -2, 2, 12, 8, "#b8e07a"), g.fillStyle = "#8cc456";
        for (let [a, b] of [[-6, 0], [-1, -2], [3, 1]])
          g.beginPath(), g.arc(a, b, 1.6, 0, 7), g.fill();
        for (let fx2 of [-9, 6]) blob(g, fx2, 9, 3.5, 2.2, "#a7d96a", 1.5);
      });
      let hb = chew ? Math.sin(t * 25) * 1.5 : 0;
      ctx2.save(), ctx2.translate(0, hb), baked(ctx2, "liz:head", (g) => blob(g, 9, -6, 9, 7.5, "#c4ea86")), ctx2.restore();
      let blink = t % 3.7 < 0.12, br = Math.sin(t * 2.4) * 0.6;
      eye(ctx2, 6, -13 + hb + br, 3.6, 0.6, blink), eye(ctx2, 12.5, -12.5 + hb + br, 3.4, 0.6, blink), ctx2.save(), ctx2.translate(0, hb), baked(ctx2, "liz:mouth", (g) => {
        g.beginPath(), g.arc(13, -3, 3, 0.1, Math.PI - 0.3), g.lineWidth = 1.5, g.strokeStyle = INK, g.stroke(), g.beginPath(), g.ellipse(8, -2, 2, 1.2, 0, 0, 7), g.fillStyle = "rgba(255,120,140,0.6)", g.fill();
      }), ctx2.restore(), lk >= 2 && baked(ctx2, "liz:lp" + Math.min(lk, 3), (g) => levelParts(g, type, Math.min(lvl, 4), 0, 0, 0)), lk >= 5 && (ctx2.beginPath(), ctx2.moveTo(-4, -2), ctx2.quadraticCurveTo(-16, 2 + Math.sin(t * 4) * 2, -18, 9), ctx2.lineTo(-6, 6), ctx2.closePath(), ctx2.fillStyle = "#8fb6ff", ctx2.fill(), ctx2.lineWidth = 1.3, ctx2.strokeStyle = INK, ctx2.stroke()), ctx2.restore();
      break;
    }
    case "laser": {
      pad(ctx2, "#ffc2c7");
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
        gr.addColorStop(0, "#fff2f5"), gr.addColorStop(0.5, "#ff6f8f"), gr.addColorStop(1, "#c8324f"), g.fillStyle = gr, g.fill(), g.lineWidth = 1.5, g.strokeStyle = INK, g.stroke(), g.beginPath(), g.moveTo(-1.6, -3.6), g.lineTo(-3, -1.2), g.lineWidth = 1.2, g.strokeStyle = "#fff", g.stroke();
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
      pad(ctx2, "#c5e4ff"), baked(ctx2, "zap:stem", (g) => {
        rr(g, -3, -8, 6, 12, 2), g.fillStyle = "#9aa3b5", g.fill(), g.lineWidth = 1.8, g.strokeStyle = INK, g.stroke();
      });
      let glow = 0.5 + Math.sin(t * 6) * 0.2 + (fx > 0 ? 0.5 : 0);
      if (ctx2.beginPath(), ctx2.arc(0, -20, 15, 0, 7), ctx2.fillStyle = `rgba(150,200,255,${0.25 * glow})`, ctx2.fill(), baked(ctx2, "zap:box", (g) => {
        rr(g, -11, -31, 22, 22, 7), g.fillStyle = "#6a7ad8", g.fill(), g.lineWidth = 2.2, g.strokeStyle = INK, g.stroke();
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
  if (lvl >= 6) {
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
  ctx2.restore();
}
function plinthPaths(ctx2) {
  ctx2.beginPath(), ctx2.ellipse(0, 11, 22, 10, 0, 0, 7), ctx2.fillStyle = "#d8ccd4", ctx2.fill(), ctx2.lineWidth = 2, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.ellipse(0, 9.5, 21, 8.6, 0, Math.PI * 1.05, Math.PI * 1.6), ctx2.lineWidth = 1.4, ctx2.strokeStyle = "#f6f0f3", ctx2.stroke();
  for (let a of [0.25, 0.95, 1.6, 2.25, 2.9])
    ctx2.beginPath(), ctx2.arc(Math.cos(a) * 19, 11 + Math.sin(a) * 8.4, 1.7, 0, 7), ctx2.fillStyle = "#ffd45e", ctx2.fill(), ctx2.lineWidth = 0.9, ctx2.strokeStyle = INK, ctx2.stroke();
}
function tractorBodyPaths(ctx2) {
  shadow(ctx2, 0, 9, 18, 5, 0.24), rr(ctx2, -12, -10, 25, 13, 5);
  let g = ctx2.createLinearGradient(0, -10, 0, 3);
  g.addColorStop(0, "#ffe39e"), g.addColorStop(1, "#f2b84a"), ctx2.fillStyle = g, ctx2.fill(), ctx2.lineWidth = 2, ctx2.strokeStyle = INK, ctx2.stroke(), rr(ctx2, -13, -23, 13, 15, 3), ctx2.fillStyle = "#ffd27a", ctx2.fill(), ctx2.lineWidth = 2, ctx2.strokeStyle = INK, ctx2.stroke(), rr(ctx2, -10.5, -20.5, 8, 8, 2), ctx2.fillStyle = "#bfe6ff", ctx2.fill(), ctx2.lineWidth = 1.3, ctx2.stroke(), ctx2.beginPath(), ctx2.moveTo(-9, -19), ctx2.lineTo(-6, -16), ctx2.lineWidth = 1.2, ctx2.strokeStyle = "#ffffff", ctx2.stroke(), rr(ctx2, -15, -25.5, 17, 4, 2), ctx2.fillStyle = "#ff8fab", ctx2.fill(), ctx2.lineWidth = 1.6, ctx2.strokeStyle = INK, ctx2.stroke();
  for (let ex of [6, 10.5])
    ctx2.beginPath(), ctx2.ellipse(ex, -5.5, 1.7, 2.1, 0, 0, 7), ctx2.fillStyle = INK, ctx2.fill(), ctx2.beginPath(), ctx2.arc(ex + 0.5, -6.3, 0.6, 0, 7), ctx2.fillStyle = "#fff", ctx2.fill();
  ctx2.beginPath(), ctx2.arc(8.3, -2.6, 2, 0.2, Math.PI - 0.2), ctx2.lineWidth = 1.2, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.ellipse(3.5, -2.5, 1.6, 1, 0, 0, 7), ctx2.fillStyle = "rgba(255,112,140,0.55)", ctx2.fill();
  for (let [wx, wy, r] of [[-7, 3, 8.5], [8, 5.5, 5.2]]) {
    ctx2.beginPath(), ctx2.arc(wx, wy, r, 0, 7), ctx2.fillStyle = "#5a4652", ctx2.fill(), ctx2.lineWidth = 2, ctx2.strokeStyle = INK, ctx2.stroke();
    for (let k = 0; k < 8; k++) {
      let a = k * Math.PI / 4;
      ctx2.beginPath(), ctx2.moveTo(wx + Math.cos(a) * (r - 1.6), wy + Math.sin(a) * (r - 1.6)), ctx2.lineTo(wx + Math.cos(a) * r, wy + Math.sin(a) * r), ctx2.lineWidth = 1.4, ctx2.strokeStyle = "#3d2a36", ctx2.stroke();
    }
    ctx2.beginPath(), ctx2.arc(wx, wy, r * 0.48, 0, 7), ctx2.fillStyle = "#ffd45e", ctx2.fill(), ctx2.lineWidth = 1.3, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.arc(wx, wy, r * 0.16, 0, 7), ctx2.fillStyle = INK, ctx2.fill();
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
      if (L3 && (ctx2.beginPath(), ctx2.ellipse(0, -14, 11, 4.6, 0, 0, 7), ctx2.lineWidth = 2.4, ctx2.strokeStyle = "#f4b632", ctx2.stroke()), L5) for (let [x, y] of [[-14, 2], [-11, -2], [-15, -3]]) marble(ctx2, x, y, 3, x);
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
  ctx2.restore(), ctx2.beginPath(), ctx2.arc(0, 0, r, 0, 7), ctx2.lineWidth = 2.6, ctx2.strokeStyle = INK, ctx2.save(), ctx2.beginPath(), ctx2.rect(-r - 12, -r - 12, r * 2 + 24, r * 2 + 24);
  for (let k = 0; k < bites; k++) {
    let a = -0.6 + k * 0.72;
    ctx2.moveTo(Math.cos(a) * r * 0.98 + 9, Math.sin(a) * r * 0.98), ctx2.arc(Math.cos(a) * r * 0.98, Math.sin(a) * r * 0.98, 9, 0, Math.PI * 2, !0);
  }
  ctx2.clip("evenodd"), ctx2.beginPath(), ctx2.arc(0, 0, r, 0, 7), ctx2.stroke(), ctx2.restore(), ctx2.save(), ctx2.beginPath(), ctx2.arc(0, 0, r + 1, 0, 7), ctx2.clip();
  for (let k = 0; k < bites; k++) {
    let a = -0.6 + k * 0.72;
    ctx2.beginPath(), ctx2.arc(Math.cos(a) * r * 0.98, Math.sin(a) * r * 0.98, 9, 0, 7), ctx2.lineWidth = 2.6, ctx2.strokeStyle = INK, ctx2.stroke();
  }
  ctx2.restore();
}
function cakeBody(ctx2, r, pct) {
  let w = r * 1.05, h = r * 0.95, cut = Math.round((1 - pct) * 4);
  ctx2.save(), ctx2.beginPath(), ctx2.roundRect(-w, -h * 0.55, w * 2, h * 1.35, 6), cut && ctx2.rect(w - cut * w * 0.42, -h * 0.6, cut * w * 0.42 + 1, h * 1.5), ctx2.clip("evenodd");
  let g = ctx2.createLinearGradient(0, -h, 0, h);
  g.addColorStop(0, "#ffd9e6"), g.addColorStop(1, "#f2a7c0"), ctx2.beginPath(), ctx2.roundRect(-w, -h * 0.55, w * 2, h * 1.35, 6), ctx2.fillStyle = g, ctx2.fill(), ctx2.fillStyle = "#fff6f0", ctx2.fillRect(-w, h * 0.18, w * 2, 4), ctx2.beginPath(), ctx2.moveTo(-w, -h * 0.5);
  for (let k = 0; k <= 8; k++) ctx2.quadraticCurveTo(-w + (k - 0.5) * w / 4, -h * 0.5 + 8, -w + k * w / 4, -h * 0.5);
  ctx2.lineTo(w, -h * 0.62), ctx2.lineTo(-w, -h * 0.62), ctx2.fillStyle = "#fffaf2", ctx2.fill(), ctx2.beginPath(), ctx2.roundRect(-w, -h * 0.55, w * 2, h * 1.35, 6), ctx2.lineWidth = 2.6, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.restore(), ctx2.beginPath(), ctx2.arc(0, -h * 0.75, 4.5, 0, 7), ctx2.fillStyle = "#e8304e", ctx2.fill(), ctx2.lineWidth = 1.6, ctx2.strokeStyle = INK, ctx2.stroke();
}
var TREAT_BODIES = { cookie: cookieBody, cake: cakeBody };
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
function drawTreat(ctx2, kind, x, y, pct, t, opts = {}) {
  typeof opts == "boolean" && (opts = {});
  let face = opts.face || cookieFace(pct), react = opts.react || null, r = 26, m = reactMotion(react, t);
  ctx2.save(), ctx2.translate(x, y), shadow(ctx2, 0, r * 0.75, r * 1.05 * (1 - Math.min(0.2, -m.dy / 40)), r * 0.32, 0.25), ctx2.save(), ctx2.translate(m.dx, m.dy + r * 0.75), ctx2.scale(m.sx, m.sy), ctx2.translate(0, -r * 0.75), (TREAT_BODIES[kind] || cookieBody)(ctx2, r, pct), react ? drawTreatFace(ctx2, react.face, t, react.age) : drawCookieFace(ctx2, opts.ouch ? "ouch" : face, t), ctx2.restore(), ctx2.restore();
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
  ctx2.save(), ctx2.translate(x, y), shadow(ctx2, 0, 12, 30, 8, 0.2), ctx2.beginPath(), ctx2.moveTo(-30, 12), ctx2.quadraticCurveTo(-24, -14, 0, -16), ctx2.quadraticCurveTo(24, -14, 30, 12), ctx2.closePath();
  let g = ctx2.createLinearGradient(0, -16, 0, 12);
  g.addColorStop(0, "#d9a77a"), g.addColorStop(1, "#a8754e"), ctx2.fillStyle = g, ctx2.fill(), ctx2.lineWidth = 2.4, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.fillStyle = "#c08a5e";
  for (let [a, b] of [[-15, 2], [12, -4], [18, 6], [-6, -8]])
    ctx2.beginPath(), ctx2.arc(a, b, 2, 0, 7), ctx2.fill();
  ctx2.beginPath(), ctx2.ellipse(0, 4, 10, 7, 0, 0, 7), ctx2.fillStyle = "#3c2630", ctx2.fill(), ctx2.lineWidth = 2, ctx2.stroke(), ctx2.beginPath(), ctx2.moveTo(14, -10), ctx2.lineTo(14, -30), ctx2.lineWidth = 2, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.moveTo(14, -30), ctx2.quadraticCurveTo(22, -28 + Math.sin(t * 4) * 2, 28, -26), ctx2.lineTo(14, -22), ctx2.closePath(), ctx2.fillStyle = "#ff7a8a", ctx2.fill(), ctx2.lineWidth = 1.6, ctx2.stroke(), ctx2.restore();
}
var THEMES = [
  { name: "gingham", a: "#fdf1e2", b: "#f8e3cc", check: "rgba(255,150,160,0.16)", grout: "rgba(200,160,130,0.18)", trail: "#fff8ec", edge: "#e9c9a6", dot: "#f2c6c6" },
  { name: "wood", a: "#f0d7b3", b: "#e9cda5", grain: "rgba(160,110,70,0.18)", grout: "rgba(140,95,60,0.3)", trail: "#fffaf0", edge: "#d8b088", dot: "#d9b48c" },
  { name: "midnight", a: "#e3e0f6", b: "#d7d2f0", grout: "rgba(140,130,190,0.3)", trail: "#fffaf2", edge: "#c9c1ec", dot: "#d8cff7", moon: !0 },
  { name: "picnic", a: "#e8f6dc", b: "#d9efc9", check: "rgba(110,180,120,0.18)", grout: "rgba(120,170,110,0.2)", trail: "#fffdf2", edge: "#bfdcae", dot: "#cfe8bd" }
];
function renderMapBackground(routes, theme, w, h, dpr2, props = []) {
  Array.isArray(routes) || (routes = [routes]);
  let cv = makeCanvas(Math.ceil(w * dpr2), Math.ceil(h * dpr2)), g = cv.getContext("2d");
  g.scale(dpr2, dpr2);
  let th = THEMES[theme % THEMES.length], seed = 7 + theme * 13, rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;
  for (let c = 0; c < GRID_COLS; c++) for (let r = 0; r < GRID_ROWS; r++)
    g.fillStyle = (c + r) % 2 ? th.a : th.b, g.fillRect(c * TILE, r * TILE, TILE, TILE);
  if (th.check) {
    g.fillStyle = th.check;
    for (let x = 0; x < w; x += 40) g.fillRect(x + 10, 0, 20, h);
    for (let y = 0; y < h; y += 40) g.fillRect(0, y + 10, w, 20);
    g.strokeStyle = "rgba(255,255,255,0.35)", g.lineWidth = 1;
    for (let x = 0; x < w; x += 8)
      g.beginPath(), g.moveTo(x, 0), g.lineTo(x, h), g.stroke();
  } else if (th.grain) {
    for (let x = 0; x < w; x += 80)
      g.fillStyle = x / 80 % 2 ? "rgba(255,255,255,0.08)" : "rgba(120,80,40,0.05)", g.fillRect(x, 0, 80, h), g.fillStyle = "rgba(110,70,40,0.35)", g.fillRect(x, 0, 1.5, h);
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
  if (th.moon) {
    let mg = g.createRadialGradient(w * 0.85, -20, 10, w * 0.85, -20, 300);
    mg.addColorStop(0, "rgba(255,255,230,0.45)"), mg.addColorStop(1, "rgba(255,255,230,0)"), g.fillStyle = mg, g.fillRect(0, 0, w, h);
  }
  for (let k = 0; k < 22; k++) {
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
  g.save(), g.translate(0, 4), strokeAll(38, "rgba(90,50,70,0.16)"), g.restore(), strokeAll(36, INK), strokeAll(31.5, th.edge), strokeAll(25, th.trail), strokeAll(28.5, "rgba(200,150,120,0.35)", [4, 5]), strokeAll(25, th.trail), strokeAll(17, "rgba(240,215,180,0.35)", [2, 9]);
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
  for (let path of routes) {
    let p = path.pts[0], nx = Math.max(30, Math.min(w - 30, p.x)), ny = Math.max(26, p.y + 6);
    for (let k = 0; k < 6; k++) {
      let a = Math.PI * (0.1 + k * 0.16);
      tuft(g, nx + Math.cos(a) * 36 * (k % 2 ? 1 : -1), ny + 10 + Math.sin(a) * 6, 0.8 + rnd() * 0.4);
    }
  }
  for (let pr of props) drawProp(g, pr.k, (pr.c + 0.5) * TILE, (pr.r + 0.5) * TILE);
  let vg = g.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.45, w / 2, h / 2, Math.max(w, h) * 0.75);
  return vg.addColorStop(0, "rgba(80,40,50,0)"), vg.addColorStop(1, "rgba(80,40,50,0.18)"), g.fillStyle = vg, g.fillRect(0, 0, w, h), cv;
}
function tuft(g, x, y, s) {
  g.save(), g.translate(x, y), g.scale(s, s);
  for (let [a, l] of [[-0.5, 8], [0, 10], [0.5, 8]])
    g.beginPath(), g.moveTo(0, 0), g.quadraticCurveTo(Math.sin(a) * 4, -l * 0.6, Math.sin(a) * 6, -l), g.lineWidth = 3.4, g.strokeStyle = INK, g.lineCap = "round", g.stroke(), g.lineWidth = 1.8, g.strokeStyle = "#8fd17d", g.stroke();
  g.restore();
}
function drawProp(g, kind, x, y) {
  if (g.save(), g.translate(x, y), g.lineJoin = "round", g.lineCap = "round", shadow(g, 2, 13, 17, 5, 0.25), kind === "mug") {
    g.beginPath(), g.arc(13, -2, 7, -1.4, 1.4), g.lineWidth = 6, g.strokeStyle = INK, g.stroke(), g.lineWidth = 3, g.strokeStyle = "#ff9fb2", g.stroke(), rr(g, -13, -14, 26, 27, 6);
    let gr = g.createLinearGradient(-13, 0, 13, 0);
    gr.addColorStop(0, "#ffc4cf"), gr.addColorStop(1, "#f28aa0"), g.fillStyle = gr, g.fill(), g.lineWidth = 2.4, g.strokeStyle = INK, g.stroke(), g.beginPath(), g.ellipse(0, -14, 13, 4, 0, 0, 7), g.fillStyle = "#7a4a34", g.fill(), g.lineWidth = 2.2, g.stroke(), heart(g, 0, -1, 4, "#fff"), g.globalAlpha = 0.5, g.strokeStyle = "#fff", g.lineWidth = 2;
    for (let k of [-4, 3])
      g.beginPath(), g.moveTo(k, -20), g.quadraticCurveTo(k + 4, -25, k, -30), g.stroke();
  } else if (kind === "sugar") {
    blob(g, 0, 2, 16, 11, "#cfe8ff", 2.4), g.beginPath(), g.ellipse(0, -6, 14, 5, 0, 0, 7), g.fillStyle = "#fffaf0", g.fill(), g.lineWidth = 2, g.strokeStyle = INK, g.stroke(), sugarCube(g, -4, -9, 4), sugarCube(g, 4, -10, 3.5), g.fillStyle = "#8fc2ef";
    for (let k of [-8, 0, 8])
      g.beginPath(), g.arc(k, 5, 2, 0, 7), g.fill();
  } else if (kind === "jam") {
    rr(g, -11, -10, 22, 23, 6);
    let gr = g.createLinearGradient(-11, 0, 11, 0);
    gr.addColorStop(0, "#ff7a8a"), gr.addColorStop(1, "#c9304a"), g.fillStyle = gr, g.fill(), g.lineWidth = 2.4, g.strokeStyle = INK, g.stroke(), rr(g, -12, -16, 24, 8, 3), g.fillStyle = "#fff0f0", g.fill(), g.stroke(), g.fillStyle = "#ff9aa8";
    for (let k = -10; k < 12; k += 5)
      g.beginPath(), g.arc(k, -8, 2.4, 0, Math.PI), g.fill();
    rr(g, -7, -2, 14, 9, 3), g.fillStyle = "#fff6e8", g.fill(), g.lineWidth = 1.4, g.stroke(), g.beginPath(), g.ellipse(-5, -4, 2, 5, 0.2, 0, 7), g.fillStyle = "rgba(255,255,255,0.5)", g.fill();
  } else if (kind === "spoon")
    g.rotate(-0.6), rr(g, -2.5, -4, 5, 24, 2.5), g.fillStyle = "#d8dce8", g.fill(), g.lineWidth = 2, g.strokeStyle = INK, g.stroke(), blob(g, 0, -11, 8, 10, "#eef0f7", 2.2), g.beginPath(), g.ellipse(-2, -14, 2, 4, 0, 0, 7), g.fillStyle = "#fff", g.fill();
  else if (kind === "plant") {
    for (let [a, l] of [[-0.8, 16], [-0.3, 20], [0.2, 19], [0.7, 15]])
      g.save(), g.translate(0, -6), g.rotate(a), g.beginPath(), g.ellipse(0, -l / 2, 5, l / 2, 0, 0, 7), g.fillStyle = "#8fd17d", g.fill(), g.lineWidth = 2, g.strokeStyle = INK, g.stroke(), g.beginPath(), g.moveTo(0, 0), g.lineTo(0, -l + 3), g.lineWidth = 1, g.strokeStyle = "#5fa34e", g.stroke(), g.restore();
    g.beginPath(), g.moveTo(-11, -4), g.lineTo(11, -4), g.lineTo(8, 13), g.lineTo(-8, 13), g.closePath(), g.fillStyle = "#e88a5c", g.fill(), g.lineWidth = 2.4, g.strokeStyle = INK, g.stroke(), rr(g, -12, -7, 24, 5, 2), g.fillStyle = "#f2a274", g.fill(), g.stroke();
  }
  g.restore();
}
function drawSwatter(ctx2, x, y, ang = 0, sc = 1, flash = 0) {
  ctx2.save(), ctx2.translate(x, y), ctx2.rotate(ang), ctx2.scale(sc, sc), ctx2.lineJoin = "round", ctx2.lineCap = "round", shadow(ctx2, 0, 2, 9, 3, 0.22), rr(ctx2, -3.2, -34, 6.4, 34, 3.2), ctx2.fillStyle = "#d9a066", ctx2.fill(), ctx2.lineWidth = 2.2, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.beginPath(), ctx2.moveTo(-1, -6), ctx2.lineTo(-1, -28), ctx2.lineWidth = 1.4, ctx2.strokeStyle = "rgba(255,240,210,0.55)", ctx2.stroke(), ctx2.beginPath(), ctx2.arc(0, -2.5, 1.7, 0, 7), ctx2.fillStyle = "#b97f48", ctx2.fill();
  let hx = -15, hy = -78, hw = 30, hh = 46;
  rr(ctx2, hx, hy, hw, hh, 12), ctx2.fillStyle = "#ff9fb6", ctx2.fill(), ctx2.lineWidth = 2.6, ctx2.strokeStyle = INK, ctx2.stroke(), rr(ctx2, hx + 4, hy + 4, hw - 8, hh - 8, 8), ctx2.fillStyle = "#fff6ee", ctx2.fill(), ctx2.lineWidth = 1.6, ctx2.strokeStyle = INK, ctx2.stroke(), ctx2.save(), rr(ctx2, hx + 4, hy + 4, hw - 8, hh - 8, 8), ctx2.clip(), ctx2.lineWidth = 1, ctx2.strokeStyle = "rgba(255,159,182,0.75)";
  for (let k = 1; k < 4; k++)
    ctx2.beginPath(), ctx2.moveTo(hx + 4 + k * 5.5, hy + 4), ctx2.lineTo(hx + 4 + k * 5.5, hy + hh - 4), ctx2.stroke();
  for (let k = 1; k < 6; k++)
    ctx2.beginPath(), ctx2.moveTo(hx + 4, hy + 4 + k * 6), ctx2.lineTo(hx + hw - 4, hy + 4 + k * 6), ctx2.stroke();
  ctx2.restore(), ctx2.fillStyle = INK, ctx2.beginPath(), ctx2.arc(-4.6, hy + 20, 2.3, 0, 7), ctx2.arc(4.6, hy + 20, 2.3, 0, 7), ctx2.fill(), ctx2.fillStyle = "#fff", ctx2.beginPath(), ctx2.arc(-5.3, hy + 19.2, 0.8, 0, 7), ctx2.arc(3.9, hy + 19.2, 0.8, 0, 7), ctx2.fill(), ctx2.fillStyle = "rgba(255,111,145,0.45)", ctx2.beginPath(), ctx2.ellipse(-8.6, hy + 25, 2.6, 1.7, 0, 0, 7), ctx2.ellipse(8.6, hy + 25, 2.6, 1.7, 0, 0, 7), ctx2.fill(), flash > 0 && (rr(ctx2, hx, hy, hw, hh, 12), ctx2.globalAlpha = flash * 0.7, ctx2.fillStyle = "#fff", ctx2.fill()), ctx2.restore();
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
var FAST_THROTTLED = /* @__PURE__ */ new Set(["laser", "zap", "pop", "pulse"]), throttleMs = (name, speed) => speed >= 4 && FAST_THROTTLED.has(name) ? 120 : 60;
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
var FLOAT_TEXT = { mergeRadius: 60, maxAlive: 10, perKeyMax: { queen: 1, immune: 2 } };
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
  writeSave(storage, S.save);
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
var META_SCREENS = ["map", "cards", "card", "shop"], BAR_H = 56, META_H = 660, cw = 0, ch = 0, insetB = 0, insetProbe = null, insetOverride = null;
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
  } else
    scale = Math.min(cw / W, ch / H), offX = (cw - W * scale) / 2, offY = (ch - H * scale) / 2;
  let px = Math.max(1, Math.round(dpr * scale * 2) / 2);
  px !== pxRatio && (pxRatio = px, S.bgCache = {}, clearTowerCache());
}
function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 3), cw = window.innerWidth, ch = window.innerHeight, insetB = readInset(), canvas.width = Math.round(cw * dpr), canvas.height = Math.round(ch * dpr), canvas.style.width = cw + "px", canvas.style.height = ch + "px", applyLayout(), S.bgCache = {}, clearTowerCache();
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
  let press = opt.pressed ? 2 : 0;
  ctx.save(), opt.disabled && (ctx.globalAlpha = 0.5), rr(ctx, x, y + 4, w, h, opt.r ?? 14), ctx.fillStyle = shade(col, -0.35), ctx.fill(), rr(ctx, x, y + press, w, h, opt.r ?? 14);
  let g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, shade(col, 0.35)), g.addColorStop(1, col), ctx.fillStyle = g, ctx.fill(), ctx.lineWidth = 2.5, ctx.strokeStyle = INK, ctx.stroke(), rr(ctx, x + 6, y + 4 + press, w - 12, h * 0.32, 8), ctx.fillStyle = "rgba(255,255,255,0.35)", ctx.fill(), label && text(ctx, label, x + w / 2, y + h / 2 + press + 1, opt.size || 17), ctx.restore();
}
function panel(x, y, w, h, col = "#fff6ee", r = 18) {
  rr(ctx, x, y + 4, w, h, r), ctx.fillStyle = "rgba(74,52,66,0.25)", ctx.fill(), rr(ctx, x, y, w, h, r), ctx.fillStyle = col, ctx.fill(), ctx.lineWidth = 2.5, ctx.strokeStyle = INK, ctx.stroke();
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
  initAudio(), e.preventDefault();
  let p = toLogical(e), b = hit(prevButtons, p.x, p.y);
  down = { x: p.x, y: p.y, b, moved: !1 }, S.screen === "map" && !S.cal && !S.reveal.length && !S.pack && p.y >= MAPVIEW.top && p.y <= MAPVIEW.bottom && (down.scroll0 = S.mapScroll), b && b.onDown && b.onDown(p);
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
  b && down.b && b.id === down.b.id && b.onTap && b.onTap(p), down = null;
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
  S.settingsPushed = !1, S.screen = screen, S.sel = null, S.info = null, S.drag = null, S.mergeAnim = null, S.toast = null, S.dialog = null, S.cal = null, S.settings = null, S.mode = null, S.shopFx = null, sfx("tap"), screen === "map" && (S.mapScroll = autoMapScroll(), maybeShowCalendar());
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
  S.battle = null, S.screen = "map", S.sel = null;
});
function openPrep(i) {
  S.levelIndex = i;
  let unlocked = unlockedCards(S.save), deck = (S.save.lastDeck || []).filter((id) => unlocked.includes(id));
  for (let id of unlocked) deck.length < BATTLE.deckSize && !deck.includes(id) && deck.push(id);
  S.prep.deck = deck.slice(0, BATTLE.deckSize), S.prep.bonuses = autoFixBonuses(S.save, (S.save.lastBonuses || BONUS_TYPES.slice(0, 2)).slice(0, BATTLE.bonusTypesToBring)), S.prepAlert = null, go("prep");
}
function startBattle(levelIndex = S.levelIndex, deck = S.prep.deck, bonuses = S.prep.bonuses, seed = Date.now() & 16777215) {
  S.levelIndex = levelIndex, S.save.lastDeck = deck.slice(), S.save.lastBonuses = bonuses.slice(), persist(), S.treat = newTreatState(), S.battle = new Battle({
    levelIndex,
    deck,
    bonusTypes: bonuses,
    bonusStock: { ...S.save.bonusStock },
    cardLevels: cardLevels(S.save),
    seed,
    onBonusUsed: (type) => {
      consumeBonus(S.save, type), persist();
    }
  }), S.battleStartStock = { ...S.save.bonusStock }, S.fx = [], S.swatQ = [], S.ui = [], S.result = null, setPaused(!1), S.speed = startSpeed(S.speed, UI.speedMaxAtStart), clock.acc = 0, S.sel = null, S.info = null, S.mode = null, S.queenDown = null, S.modeHint = !1, S.battle.rescueScale = S.speed, go("battle");
}
function finishBattle() {
  let b = S.battle, out = applyBattleResult(S.save, b.levelIndex, b.result, b.stars, { kills: b.stats.kills, foodLeft: b.foodStored, perfect: b.perfect, time: b.time });
  b.result === "lose" && noteLossForCardBlink(S.save), persist();
  let win = b.result === "win", fullFood = b.foodStored >= b.cfg.foodHP - 1e-6, queenKilled = win && Object.keys(b.stats.byType).some((t) => isQueen(t)), hold = queenKilled ? UI.queenCheerHold : 0;
  if (S.result = { win, stars: b.stars, out, t: 0, hold, crumbsLeft: b.crumbs, perfect: out.perfect, kills: b.stats.kills, confetti: [], fullFood, queenKilled }, win && (b.stars >= 3 || fullFood || out.perfect)) for (let i = 0; i < 90; i++) S.result.confetti.push({ x: 200 + (Math.random() - 0.5) * 60, y: 230, vx: (Math.random() - 0.5) * 420, vy: -150 - Math.random() * 320, r: Math.random() * 6, c: ["#ff8fab", "#ffd45e", "#8fe388", "#9fd3f2", "#c9b6f2"][i % 5] });
  win && fullFood && launchFireworks(9, 2.6), queenKilled && (launchFireworks(10, 3), S.queenDown = { t: S.t, world: worldOf(b.levelIndex) }), out.prize && out.prize.kind === "cards" && out.prize.reveal && queueReveal(out.prize.id, out.prize.level, out.prize.newCard, S.t + hold + UI.perfectAnimTime + 0.4), sfx(win ? "win" : "lose");
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
  if (tw && S.info && S.info.tower === tw && !S.info.auto && hasTargetModes(tw.type)) {
    cycleMode(tw), S.info = { tower: tw, t: 0 };
    return;
  }
  S.info = tw ? { tower: tw, t: 0 } : null;
}
var HINT_ANTS = /* @__PURE__ */ new Set(["armored", "big", "heavy", "queen", "queen2"]);
function maybeModeHint(b, e) {
  S.modeHint || S.paused || !e.ant || !HINT_ANTS.has(e.ant) || !(e.n > 0) || b.towers.some((q) => hasTargetModes(q.type)) && (S.modeHint = !0, toast("Tip: tap a tower to change who it shoots", "#ffe39a"), S.toast.hint = !0);
}
var MODE_NAME = { weak: "Weakest", carrier: "Carrier", front: "Front" };
function cycleMode(tw) {
  let m = S.battle.cycleTargetMode(tw);
  m && modeFeedback(tw, m);
}
function modeFeedback(tw, m) {
  sfx("tap"), addFloatText(S.fx, { key: "mode" + tw.id, x: tw.x, y: tw.y - 26, n: 1, fmt: () => MODE_NAME[m], col: m === "weak" ? "#fff" : "#ffe39a", life: 1 });
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
  S.fx.push(f);
  let cap = S.speed >= 4 ? 220 : 300;
  S.fx.length > cap && S.fx.splice(0, 60);
}
function addUi(f) {
  S.ui.push(f), S.ui.length > 60 && S.ui.splice(0, 20);
}
var fmtFood = (n) => Math.abs(n - Math.round(n)) < 0.05 ? String(Math.round(n)) : n.toFixed(1), SWAT_HIT = 0.17;
function swatHitTime(b) {
  return b.time - (0.5 - b.swatFx) + SWAT_HIT;
}
function killFx(e) {
  if (e.src === "tractor") {
    addFloatText(S.fx, { k: "crumbTxt", key: "crumb", x: e.x, y: e.y - 14, n: e.crumbs, fmt: (n) => n, life: 0.9 });
    return;
  }
  let fast = S.speed >= 4;
  for (let i = 0; i < (fast ? 1 : 4); i++) addFx({ k: "crumbBit", x: e.x, y: e.y - 6, vx: (Math.random() - 0.5) * 90, vy: -40 - Math.random() * 60, life: 0.6, max: 0.6 });
  addFx({ k: "ko", x: e.x, y: e.y, ant: e.ant, life: 0.9, max: 0.9, face: Math.random() < 0.5 ? 1 : -1 });
  for (let i = 0; i < (fast ? 2 : 5); i++) addFx({ k: "puff", x: e.x + (Math.random() - 0.5) * 10, y: e.y + (Math.random() - 0.5) * 6, vx: (Math.random() - 0.5) * 40, vy: -Math.random() * 30, r: 4 + Math.random() * 4, life: 0.5, max: 0.5 });
  addFloatText(S.fx, { k: "crumbTxt", key: "crumb", x: e.x, y: e.y - 14, n: e.crumbs, fmt: (n) => n, life: 0.9 }), sfx("pop");
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
function consumeEvents() {
  let b = S.battle, ev = b.events;
  b.events = [];
  for (let e of ev)
    switch (e.type) {
      case "kill":
        if (e.src === "swatter" && !reducedMotion() && b.swatFx > 0) {
          S.swatQ.push({ at: swatHitTime(b), kill: e, ghost: e.ref, x: e.x, y: e.y });
          break;
        }
        killFx(e);
        break;
      case "beam":
        addFx({ k: "beam", ...e, life: 0.09, max: 0.09 }), sfx("laser");
        break;
      case "zap":
        addFx({ k: "zap", ...e, life: 0.14, max: 0.14 }), sfx("zap");
        break;
      case "roast":
        for (let i = 0; i < 5; i++) addFx({ k: "ember", x: e.x + (Math.random() - 0.5) * 14, y: e.y - 4, vx: (Math.random() - 0.5) * 20, vy: -30 - Math.random() * 30, life: 0.7, max: 0.7 });
        break;
      // v0.4 item 7
      case "tongue":
        addFx({ k: "tongue", ...e, life: 0.25, max: 0.25 });
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
        addFx({ k: "mist", ...e, life: 0.3, max: 0.3 });
        break;
      case "swat": {
        reducedMotion() ? swatHitFx(e) : S.swatQ.push({ at: swatHitTime(b), swat: e });
        break;
      }
      case "hit":
        addFx({ k: "spark", x: e.x, y: e.y - 6, life: 0.15, max: 0.15 });
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
        for (let i = 0; i < 4; i++) addFx({ k: "star", x: e.x, y: e.y, vx: (Math.random() - 0.5) * 120, vy: -30 - Math.random() * 70, life: 0.45, max: 0.45 });
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
        let delay = e.pick != null ? 0.28 : 0;
        if (e.pick != null) {
          let sx = 12 + e.pick * 94 + 44, sy = TRAY_Y + 6 + 47;
          addUi({ k: "cardFly", card: e.card, x0: sx, y0: sy, x1: e.x, y1: e.y + MAP_Y, life: delay, max: delay }), S.slotFlip[e.pick] = 0.3;
        }
        e.cost > 0 && addUi({ k: "costFly", n: e.cost, x0: 340, y0: 34, x1: 300, y1: 96, life: 1, max: 1 }), S.crumbPulse = 0.35;
        for (let i = 0; i < 14; i++) {
          let a = i / 14 * Math.PI * 2;
          addFx({ k: "star", x: e.x, y: e.y, vx: Math.cos(a) * 75, vy: Math.sin(a) * 75 - 25, life: 0.7 + delay, max: 0.7, wait: delay });
        }
        if (addFx({ k: "pop", x: e.x, y: e.y, life: 0.35 + delay, max: 0.35, wait: delay }), addFx({ k: "ring2", x: e.x, y: e.y, life: 0.5 + delay, max: 0.5, wait: delay }), e.type === "upgrade") {
          addFx({ k: "pillar", x: e.x, y: e.y, life: 0.9 + delay, max: 0.9, wait: delay }), addFx({ k: "txt", x: e.x, y: e.y - 34, s: `Level ${e.lvl}!${dmgGainText(e.card, e.lvl, S.battle.cardLevels[e.card] || 1) ? "  " + dmgGainText(e.card, e.lvl, S.battle.cardLevels[e.card] || 1) : ""}`, col: "#ffe36e", life: 1.4 + delay, max: 1.4, wait: delay, size: 17 }), (e.diff || []).forEach((d, k) => addFx({ k: "txt", x: e.x, y: e.y - 52 - k * 16, s: `${d.label} ${formatStat(e.card, d.key, d.from)} \u2192 ${formatStat(e.card, d.key, d.to)}`, col: "#a8ffb0", life: 2 + delay, max: 2, wait: delay, size: 12 }));
          let tw = S.battle.towers.find((q) => q.id === e.id);
          if (tw && !S.autoBot) {
            let mine = !!(S.info && S.info.tower === tw && !S.info.auto);
            S.info = { tower: tw, t: 0, changed: e.diff, until: S.t + UI.upgradeInfoTime, auto: !mine };
          }
          sfx("upgrade");
        } else addFloatText(S.fx, { key: "placed", x: e.x, y: e.y - 34, n: 1, fmt: () => "Placed!", col: "#fff", life: 0.9 });
        break;
      }
      case "stick":
        addFloatText(S.fx, { key: "stick", x: e.x, y: e.y - 20, n: 1, fmt: () => "stuck!", col: "#fff3b0", life: 0.7 });
        break;
      case "charm":
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
      case "wave":
        addFx({ k: "banner", s: `Wave ${e.n}`, life: 1.4, max: 1.4 }), sfx("wave");
        break;
      case "queenCall":
        addFloatText(S.fx, { key: "queen", x: e.x, y: e.y - 40, n: 1, fmt: () => e.calls === "flyer" ? "Wings, go!" : "Scouts, go!", col: "#ffb3e0", life: 1 });
        break;
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
  advanceFrame(clock, dt, S.speed, battleStep, { now: () => performance.now() }), consumeEvents(), flushSwat(!!S.battle.result), S.battle.result && finishBattle();
}
function frame(now2) {
  let dt = Math.min(0.1, (now2 - lastT) / 1e3);
  lastT = now2, S.t += dt, heartbeat(!1), insetClock += dt, insetClock >= 0.5 && (insetClock = 0, refreshInset()), setAudioSpeed(S.screen === "battle" ? S.speed : 1), S.screen === "battle" && S.battle && !S.paused && !S.result && !S.dialog && battleFrame(dt), render(dt), requestAnimationFrame(frame);
}
function render(dt) {
  if (prevButtons = buttons, buttons = [], ctx.setTransform(1, 0, 0, 1, 0, 0), ctx.fillStyle = BG, ctx.fillRect(0, 0, canvas.width, canvas.height), applyLayout(), ctx.setTransform(dpr * scale, 0, 0, dpr * scale, offX * dpr, offY * dpr), drawBackdrop(), renderTabBar(dt), S.screen === "map" ? renderMapScreen() : S.screen === "prep" ? renderPrep() : S.screen === "battle" ? renderBattle(dt) : S.screen === "cards" ? renderCards() : S.screen === "card" ? renderCardView() : S.screen === "shop" && renderShop(), renderFireworks(dt), S.reveal.length && S.reveal[0].at <= S.t && renderReveal(dt), S.pack && renderPack(dt), S.toast) {
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
}
var barK = 0, TAB_COL = ["#d9cfe0", "#b5d8ff", "#ffd27a"], TAB_NAME = ["Map", "Cards", "Shop"], TAB_MUTED = "#7a5a6a", BAR_BG = "#fff6ee";
function activeTab() {
  return S.screen === "map" ? 0 : S.screen === "shop" ? 2 : 1;
}
function barWanted() {
  return isMeta() && !S.cal && !S.settings && !S.pack && !S.mergeAnim && !(S.reveal.length && S.reveal[0].at <= S.t) && !S.dialog;
}
function tabRect(i) {
  let tw = cw / 3, top = ch - BAR_H - insetB;
  return { x: (i * tw + 6 - offX) / scale, y: (top + 6 - offY) / scale, w: (tw - 12) / scale, h: 44 / scale, r: 14 / scale };
}
function tabTap(i) {
  if (i === activeTab()) {
    S.screen === "map" ? S.mapScroll = autoMapScroll() : S.screen === "card" && (S.screen = "cards", S.mergeAnim = null);
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
  let x = 70, y = 190, w = 260, h = 262;
  panel(x, y, w, h, "#fff6ee", 20), button("setPanel", x, y, w, h, () => {
  }), text(ctx, "Settings", 200, y + 28, 22, "#ffb3c1");
  let muted2 = S.save.settings && S.save.settings.muted;
  drawButton(x + 24, y + 54, w - 48, 52, muted2 ? "Sound: Off" : "Sound: On", muted2 ? "#e6dce2" : "#c9f0c0", { size: 17 }), button("setSound", x + 24, y + 48, w - 48, 64, () => {
    S.save.settings = { ...S.save.settings || {}, muted: !muted2 }, setMuted(!muted2), persist(), sfx("tap");
  });
  let sure = S.confirmReset > S.t;
  drawButton(x + 24, y + 122, w - 48, 52, sure ? "Sure? Tap again" : "Reset progress", "#ffb3b3", { size: sure ? 16 : 17 }), button("setReset", x + 24, y + 116, w - 48, 64, () => {
    S.confirmReset > S.t ? (S.save = newSave(), touch(S.save, now()), persist(), S.confirmReset = 0, S.cardsBlinkUntil = 0, closeSettings(), toast("Progress reset")) : S.confirmReset = S.t + 3;
  }), drawButton(x + 24, y + 190, w - 48, 48, "Close", "#d9cfe0", { size: 17 }), button("setClose", x + 24, y + 184, w - 48, 64, () => closeSettings());
}
function drawBackdrop() {
  ctx.save();
  let g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#fff1e6"), g.addColorStop(1, "#fbd9cf"), ctx.fillStyle = g, ctx.fillRect(-2e3, -2e3, W + 4e3, H + 4e3), ctx.globalAlpha = 0.35, ctx.fillStyle = "#ffffff";
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
function drawMapRoad() {
  let pts = mapRoadPoints(), done = 0;
  for (; done < S.save.levels.length && S.save.levels[done].cleared; ) done++;
  let path = () => {
    ctx.beginPath(), pts.forEach((p, k) => k ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
  };
  ctx.save(), ctx.lineCap = "round", ctx.lineJoin = "round", path(), ctx.lineWidth = 22, ctx.strokeStyle = "rgba(160,110,85,0.35)", ctx.stroke(), path(), ctx.lineWidth = 16, ctx.strokeStyle = "#f6dcc0", ctx.stroke();
  let doneIdx = Math.min(pts.length - 1, done * 24);
  if (doneIdx > 0) {
    ctx.beginPath();
    for (let k = 0; k <= doneIdx; k++) k ? ctx.lineTo(pts[k].x, pts[k].y) : ctx.moveTo(pts[k].x, pts[k].y);
    ctx.lineWidth = 16, ctx.strokeStyle = "#ffe3a8", ctx.stroke();
  }
  path(), ctx.setLineDash([2, 13]), ctx.lineDashOffset = -S.t * 6, ctx.lineWidth = 5, ctx.strokeStyle = "rgba(200,140,110,0.75)", ctx.stroke(), ctx.setLineDash([]), ctx.restore();
  for (let k = 12; k < pts.length - 6; k += 29) {
    let p = pts[k], q = pts[k + 1], dx = q.x - p.x, dy = q.y - p.y, L = Math.hypot(dx, dy) || 1, s = k % 2 ? 1 : -1, tx = p.x - dy / L * 17 * s, ty = p.y + dx / L * 17 * s;
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
  if (panel(40, y - 30, 320, 60, open ? "#fff1f6" : "#efe7ec", 18), ctx.save(), ctx.translate(76, y + 2), ctx.scale(0.62, 0.62), drawTreat(ctx, W2.treat, 0, 0, 1, S.t, { face: open ? "happy" : "content" }), ctx.restore(), text(ctx, `World ${w}: ${W2.name}`, 214, y - 12, 17, open ? "#ff8fab" : "#b9a6b2"), open) plainText("Open! Beat the queen at the top.", 214, y + 12, 11.5, "#6b5562", "center", "600");
  else {
    let won = LEVELS.filter((L, i) => L.world === prev && S.save.levels[i].cleared).length, total = LEVELS.filter((L) => L.world === prev).length;
    plainFit(`Locked: win all ${total} levels (${won}/${total}) + ${W2.unlock.minStarsInWorld} stars (${worldStars(S.save, prev)}/${total * 3})`, 214, y + 12, 262, 11.5, "#a0607e", "center", "700"), ctx.save(), ctx.translate(346, y - 22), rr(ctx, -8, -3, 16, 13, 3), ctx.fillStyle = "#8c8090", ctx.fill(), ctx.beginPath(), ctx.arc(0, -4, 5.5, Math.PI, 0), ctx.lineWidth = 3, ctx.strokeStyle = "#8c8090", ctx.stroke(), ctx.restore();
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
  claim2 && (rr(ctx, 10, 106, 74, 74, 20), ctx.fillStyle = `rgba(255,212,94,${0.3 + 0.25 * Math.sin(S.t * 5)})`, ctx.fill()), rr(ctx, 14, 110, 66, 66, 16), ctx.fillStyle = claim2 ? "#ffe7a8" : "#fbe3ee", ctx.fill(), ctx.lineWidth = 2.5, ctx.strokeStyle = INK, ctx.stroke(), giftIcon(ctx, 14 + 66 / 2, 136 + (claim2 ? Math.sin(S.t * 5) * 1.5 : 0), 1.05), plainText("Calendar", 14 + 66 / 2, 162, 11, "#5a4652", "center", "700"), claim2 && (blob(ctx, 78, 112, 8, 8, "#ff6f91", 1.6), text(ctx, "!", 78, 110 + 2.5, 12)), button("calendar", 10, 106, 74, 74, () => openCalendar()), S.mapScroll = clampScroll(S.mapScroll || 0);
  let sc = S.mapScroll;
  ctx.save(), ctx.beginPath(), ctx.rect(-200, MAPVIEW.top, W + 400, MAPVIEW.bottom - MAPVIEW.top), ctx.clip(), ctx.translate(0, sc), drawMapRoad();
  for (let w of WORLDS) w.id > 1 && drawWorldGate(w.id);
  S.layoutNodes = [];
  for (let i = 0; i < LEVELS.length; i++) {
    let p = nodePos(i), L = S.save.levels[i], open = levelUnlocked(S.save, i), w = worldOf(i), boss = i === WORLD_START[w] + WORLDS.find((x) => x.id === w).levels - 1, isNext = open && !L.cleared, bounce = isNext ? Math.abs(Math.sin(S.t * 3)) * 4 : 0;
    mapNode(ctx, p.x, p.y - bounce, i, { open, cleared: L.cleared, next: isNext, stars: L.stars, boss }, S.t), boss && (ctx.save(), ctx.translate(p.x + 24, p.y - 30 - bounce), ctx.scale(0.55, 0.55), drawAnt(ctx, QUEENS[w].type, 0.2), ctx.restore());
    for (let s2 = 0; s2 < 3; s2++) starShape(ctx, p.x - 18 + s2 * 18, p.y + 32, 7, s2 < L.stars ? "#ffd45e" : "#e8dde4", 1.6);
    text(ctx, LEVELS[i].name, p.x, p.y + 48, 11, "#7a5a6a", "center", null);
    let sy = p.y + sc;
    S.layoutNodes.push({ i, x: p.x, y: sy }), open && sy > MAPVIEW.top + 10 && sy < MAPVIEW.bottom - 10 && button("lvl" + i, p.x - 30, sy - 30, 60, 60, () => openPrep(i));
  }
  if (ctx.restore(), gateY(2) + sc < MAPVIEW.top - 10) {
    let a = 0.75 + 0.25 * Math.sin(S.t * 4);
    ctx.save(), ctx.globalAlpha = a, rr(ctx, 128, MAPVIEW.top + 4, 144, 26, 13), ctx.fillStyle = "rgba(90,64,88,0.85)", ctx.fill(), plainText("\u25B2 World 2 - scroll up", 200, MAPVIEW.top + 17.5, 11.5, "#ffffff", "center", "700"), ctx.restore();
  }
  updateCardsBlink(), blob(ctx, 363, 22, 19, 19, "#fff6ee", 2.2), drawGearIcon(363, 22, 12), button("gear", 337, 0, 52, 52, () => openSettings());
  let shopHint = !S.cal && !S.settings && zapperGiftPending(S.save) && !S.reveal.length;
  !S.cal && !S.settings && !shopHint && plainText("v" + VERSION, 14, 186, 11, "#a08090", "left", "600"), S.cal ? renderCalendar() : S.settings ? renderSettings() : shopHint && onboardSpot(tabRect(2), "shop", () => go("shop"), "A free pack waits in the Shop!"), renderUiFx(1 / 60);
}
var lastBubble = null;
function onboardSpot(R, id, onTap, msg, bub = null) {
  ctx.save(), ctx.beginPath(), ctx.rect(-2e3, -2e3, W + 4e3, H + 4e3);
  {
    let x = R.x - 6, y = R.y - 6, w = R.w + 12, h = R.h + 14, r = Math.min((R.r || 14) + 4, w / 2, h / 2);
    ctx.moveTo(x + r, y), ctx.arcTo(x + w, y, x + w, y + h, r), ctx.arcTo(x + w, y + h, x, y + h, r), ctx.arcTo(x, y + h, x, y, r), ctx.arcTo(x, y, x + w, y, r), ctx.closePath();
  }
  ctx.fillStyle = "rgba(40,26,38,0.66)", ctx.fill("evenodd");
  let g = 0.5 + 0.5 * Math.sin(S.t * 5);
  rr(ctx, R.x - 6, R.y - 6, R.w + 12, R.h + 14, (R.r || 14) + 4), ctx.lineWidth = 3 + g * 2, ctx.strokeStyle = `rgba(255,227,110,${0.6 + 0.4 * g})`, ctx.stroke(), ctx.restore(), button("onboardBlock", -2e3, -2e3, W + 4e3, H + 4e3, () => {
  }), button(id, R.x, R.y, R.w, R.h, onTap);
  let fx = R.x + R.w / 2 + 18, fy = R.y - 22 - Math.abs(Math.sin(S.t * 4)) * 12;
  if (drawFinger(fx, fy), msg) {
    let my = R.y < 260 ? R.y + R.h + 22 : Math.max(90, R.y - (R.y > 600 ? 148 : 104));
    bub ? (panel(bub.x, bub.y, bub.w, 40, "#fff6ee", 16), plainFit(msg, bub.x + bub.w / 2, bub.y + 20, bub.w - 24, 15, "#e0607e", "center", "800"), lastBubble = { x: bub.x, y: bub.y, w: bub.w, h: 40 }) : (panel(60, my, 280, 40, "#fff6ee", 16), plainFit(msg, 200, my + 20, 256, 15, "#e0607e", "center", "800"), lastBubble = { x: 60, y: my, w: 280, h: 40 });
  }
}
function drawFinger(x, y) {
  ctx.save(), ctx.translate(x, y), ctx.rotate(0.35), ctx.lineJoin = "round", ctx.lineWidth = 2.6, ctx.strokeStyle = INK, ctx.fillStyle = "#ffe2c8", rr(ctx, -6, -34, 12, 34, 6), ctx.fill(), ctx.stroke(), rr(ctx, -15, -50, 34, 26, 11), ctx.fill(), ctx.stroke();
  for (let k of [0, 1, 2])
    ctx.beginPath(), ctx.moveTo(-3 + k * 7, -50), ctx.lineTo(-3 + k * 7, -40), ctx.lineWidth = 1.6, ctx.stroke();
  rr(ctx, -16, -62, 36, 14, 5), ctx.fillStyle = "#9ad0ff", ctx.lineWidth = 2.4, ctx.fill(), ctx.stroke(), ctx.beginPath(), ctx.ellipse(0, -6, 3, 2, 0, 0, 7), ctx.fillStyle = "#fff3ea", ctx.fill(), ctx.restore();
}
function prizeIcon(p, x, y, s = 1) {
  p.kind === "coins" ? (coinIcon(ctx, x - 6 * s, y + 2 * s, 1.1 * s), coinIcon(ctx, x + 5 * s, y - 3 * s, 1.1 * s)) : p.kind === "diamonds" ? diamondIcon(ctx, x, y, 1.25 * s) : p.kind === "card" ? (ctx.save(), ctx.translate(x, y), ctx.rotate(-0.12), rr(ctx, -11 * s, -14 * s, 22 * s, 28 * s, 5 * s), ctx.fillStyle = p.level >= 2 ? "#ffd27a" : "#b5d8ff", ctx.fill(), ctx.lineWidth = 2, ctx.strokeStyle = INK, ctx.stroke(), text(ctx, "L" + p.level, 0, 0.5, 11 * s, "#fff"), ctx.restore()) : (p.kind === "booster" || p.kind === "bonus") && (ctx.save(), ctx.translate(x, y), ctx.scale(0.8 * s, 0.8 * s), drawBonusIcon(ctx, p.id, S.t), ctx.restore());
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
    ctx.beginPath(), ctx.moveTo(bx + (m - 0.5) * segW, 168), ctx.lineTo(mx, my - 14 * sc), ctx.lineWidth = 2, ctx.strokeStyle = "rgba(82,60,75,0.35)", ctx.stroke(), monthBox(ctx, mx, my, sc, tier, S.t, shown >= m), plainText(`Day ${m}`, mx, my + 24 * sc - (tier === 3 ? 4 : 0), tier === 3 ? 11 : 10, tier === 3 ? "#c27a00" : "#6b5562", "center", "700");
  }), st.resetPending && !CA.result ? plainText("You missed a day - the streak restarts at 1.", 200, 256, 11, "#c0392b", "center", "600") : plainText("Collect every day to keep the streak. Bigger prizes as it grows!", 200, 256, 11, "#6b5562", "center"), plainText("Your 7-day cycle", 36, 276, 13, "#3d2a36", "left", "700"), st.tiles.forEach((tl, i) => {
    let big = i === 6, row = big ? 2 : Math.floor(i / 3), col = big ? 0 : i % 3, gap = 8, cw2 = (328 - 2 * gap) / 3, rh = 74, w = big ? 328 : cw2, h = big ? 84 : rh, x = 36 + col * (cw2 + gap), y = 286 + row * (rh + gap), today = tl.state === "today", claimed = tl.state === "claimed", missed = tl.state === "missed", glow = today ? 0.5 + 0.5 * Math.sin(S.t * 5) : 0;
    if (ctx.save(), today && (rr(ctx, x - 4, y - 4, w + 8, h + 8, 16), ctx.fillStyle = `rgba(255,212,94,${0.35 + glow * 0.4})`, ctx.fill()), rr(ctx, x, y, w, h, 13), big && !claimed && !missed) {
      let g = ctx.createLinearGradient(x, y, x + w, y + h);
      g.addColorStop(0, "#fff1c9"), g.addColorStop(1, "#ffe1ec"), ctx.fillStyle = g;
    } else ctx.fillStyle = claimed ? "#e3f6dc" : missed ? "#ece6ea" : today ? "#fff1c9" : "#ffffff";
    ctx.fill(), ctx.lineWidth = today ? 3.5 : big ? 2.6 : 2, ctx.strokeStyle = today ? "#e8a620" : big ? "#e0a830" : INK, ctx.stroke(), plainText(`Day ${i + 1}`, x + 9, y + 13, 11, "#6b5562", "left", "700"), missed && plainText("missed", x + w - 8, y + 13, 10, "#8c7a86", "right", "600"), today && text(ctx, "TAP!", x + w - 22, y + 13, 12, "#ff8fab"), missed && (ctx.globalAlpha = 0.45);
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
    text(ctx, "?", x + w / 2, y + h * 0.42, 30, "#fff"), text(ctx, opt.lockText || "Locked", x + w / 2, y + h - 14, 10, "#7a6a76", "center", null), ctx.restore();
    return;
  }
  ctx.save(), ctx.beginPath(), rr(ctx, x + 4, y + 4, w - 8, h - 8, 11), ctx.clip();
  let nameY = y + h - (opt.cost != null ? 31 : 13), iconY = y + (nameY - y) * 0.62 + 4;
  ctx.beginPath(), ctx.arc(x + w / 2, iconY - 8, w * 0.32, 0, 7), ctx.fillStyle = "rgba(255,255,255,0.45)", ctx.fill();
  let iconS = Math.min(w / 58, (nameY - y) / 58);
  ctx.translate(x + w / 2, iconY), ctx.scale(iconS, iconS), drawTower(ctx, type, S.t, null), ctx.restore();
  let tag = T.place === "path" ? "on trail" : T.targets === "air" ? "air only" : type === "laser" ? "gnd+air" : "";
  if (tag && h > 70 && !opt.badge && text(ctx, tag, x + w - 7, y + 11, 9, "#fff", "right"), fitText(T.short || T.name, x + w / 2, nameY, w - 10, w < 85 ? 13 : 14, "#fff"), opt.level && (blob(ctx, x + 12, y + 12, 11, 10, "#ffe36e", 2), text(ctx, "L" + opt.level, x + 12, y + 12.5, 10, "#7a4a2a", "center", null)), opt.cost != null && (rr(ctx, x + 10, y + h - 21, w - 20, 17, 8), ctx.fillStyle = opt.afford ? "#fff8ec" : "#ffd6d6", ctx.fill(), ctx.lineWidth = 1.8, ctx.strokeStyle = INK, ctx.stroke(), crumbIcon(ctx, x + w / 2 - (opt.cost === 0 ? 22 : 14), y + h - 12.5, 0.75), text(ctx, opt.cost === 0 ? "FREE" : String(opt.cost), x + w / 2 + 6, y + h - 12, 12, opt.afford ? "#7a4a2a" : "#c0392b", "center", null)), opt.badge && (blob(ctx, x + w - 11, y + 11, 11, 11, "#ff8fab", 2), text(ctx, opt.badge, x + w - 11, y + 11.5, 12, "#fff")), opt.mergeReady) {
    let p = 1 + Math.sin(S.t * 6) * 0.08;
    ctx.save(), ctx.translate(x + w - 10, y + 10), ctx.scale(p, p), blob(ctx, 0, 0, 11, 11, "#ff6f91", 2), text(ctx, "!", 0, 0.5, 14, "#fff"), ctx.restore();
  }
  opt.fresh && (rr(ctx, x + w / 2 - 17, y - 9, 34, 17, 8), ctx.fillStyle = "#ffd45e", ctx.fill(), ctx.lineWidth = 2, ctx.strokeStyle = INK, ctx.stroke(), text(ctx, "NEW", x + w / 2, y - 0.5, 10, "#fff")), ctx.restore();
}
function antIcon(type, x, y, s = 1) {
  ctx.save(), ctx.translate(x, y), ctx.scale(s, s), drawAnt(ctx, type, S.t * 1.3 % 1), ctx.restore();
}
function renderPrep() {
  let i = S.levelIndex, L = LEVELS[i];
  panel(12, 12, 376, 696, "#fff6ee"), text(ctx, `Level ${i + 1}`, 200, 40, 26, "#ffb3c1"), text(ctx, `${L.name}  -  ${MAPS[L.map].name}`, 200, 66, 13, "#7a5a6a", "center", null);
  let ants = levelAntTypes(i);
  text(ctx, "Incoming ants", 30, 92, 14, "#7a5a6a", "left", null), text(ctx, `${L.waveCount} waves`, 370, 92, 14, "#7a5a6a", "right", null), levelHasFlyers(i) && (rr(ctx, 152, 82, 132, 20, 10), ctx.fillStyle = "#d7ecff", ctx.fill(), ctx.lineWidth = 1.6, ctx.strokeStyle = "#5a9fe0", ctx.stroke(), plainText("Flyers in this level", 218, 92.5, 11, "#2f6fae", "center", "800")), S.layoutPrepAnts = [];
  let n = ants.length, slot = Math.min(76, 340 / n), x0 = 200 - slot * (n - 1) / 2;
  ants.forEach((t, k) => {
    let x = x0 + k * slot, sz = ANTS[t].size, sc = Math.min(1.15, (slot - 6) / (40 * sz), 30 / (34 * sz));
    antIcon(t, x, 136, sc), S.layoutPrepAnts.push({ type: t, x: x - 20 * sz * sc, y: 136 - 34 * sz * sc, w: 40 * sz * sc, h: 46 * sz * sc }), fitText(ANTS[t].name.replace(" Ant", ""), x, 160, slot - 4, 10, "#7a5a6a");
  });
  let unlocked = unlockedCards(S.save);
  text(ctx, `Your deck (${S.prep.deck.length}/${BATTLE.deckSize}) - tap to pick`, 30, 182, 14, "#7a5a6a", "left", null);
  {
    let cap = worldCardLevelCap(i);
    cap && unlocked.some((id) => S.save.cards[id].level > cap) && plainText(`Cards act as L${cap} max`, 370, 182, 10, "#b0506a", "right", "800");
  }
  ALL_CARDS.forEach((id, k) => {
    let col = k % 5, row = Math.floor(k / 5), x = 22 + col * 72, y = 196 + row * 98, w = 66, h = 90, isU = unlocked.includes(id), di = S.prep.deck.indexOf(id);
    drawCardPic(x, y, w, h, id, { locked: !isU, lockText: "Shop or prize", selected: di >= 0, selCol: "#111111", badge: di >= 0 ? String(di + 1) : null, tag: !0, level: isU ? S.save.cards[id].level : 0, dim: isU && di < 0 && S.prep.deck.length >= BATTLE.deckSize }), isU && button("deck" + id, x, y, w, h, () => {
      let d = S.prep.deck, j = d.indexOf(id);
      j >= 0 ? d.splice(j, 1) : d.length < BATTLE.deckSize ? d.push(id) : toast("Deck is full (5). Tap a card to remove it."), sfx("tap");
    });
  });
  let by = 500;
  text(ctx, `Boosters (bring ${BATTLE.bonusTypesToBring}, max ${BATTLE.maxBonusUses} uses)`, 30, by, 14, "#7a5a6a", "left", null), BONUS_TYPES.forEach((bt, k) => {
    let x = 26 + k * 88, y = by + 14, w = 80, h = 74, sel = S.prep.bonuses.includes(bt), stock = S.save.bonusStock[bt] || 0;
    rr(ctx, x, y, w, h, 14), ctx.fillStyle = sel ? shade(BONUSES[bt].color, 0.2) : "#f3ebee", ctx.fill(), sel && stock <= 0 ? lavaBorder(ctx, x, y, w, h, 14, S.t) : (ctx.lineWidth = sel ? 4.5 : 2.5, ctx.strokeStyle = sel ? "#111111" : INK, ctx.stroke()), ctx.save(), ctx.translate(x + w / 2, y + 28), ctx.scale(1.3, 1.3), drawBonusIcon(ctx, bt, S.t), ctx.restore(), text(ctx, BONUSES[bt].name, x + w / 2, y + 54, 11, "#fff"), text(ctx, "x" + stock, x + w - 12, y + 12, 11, stock ? "#fff" : "#ff9a9a"), button("bon" + bt, x, y, w, h, () => {
      let b = S.prep.bonuses, j = b.indexOf(bt);
      j >= 0 ? b.splice(j, 1) : (b.push(bt), b.length > BATTLE.bonusTypesToBring && b.shift(), stock <= 0 && zeroBonusAlert(bt)), sfx("tap");
    });
  });
  let warn = null;
  levelHasFlyers(i) && !S.prep.deck.some((d) => AIR_COUNTERS.includes(d)) ? warn = "Flying ants ahead! Only Laser, Bug Zapper or the Crop Duster can hit them." : ants.includes("gasmask") && S.prep.deck.includes("spray") && S.prep.deck.filter((d) => d !== "spray" && TOWERS[d].kind === "tower" && d !== "fan").length < 2 && (warn = "Gas-mask ants ignore Bug Spray - bring other damage too.");
  let issues = prepIssues(S.save, S.prep.bonuses);
  if (issues.length && (warn = `You have 0 ${BONUSES[issues[0].bonus].name}s. Buy one during battle for ${ECONOMY.diamonds.boosterPriceStart} diamonds, or in the Shop.`), S.layoutWarn = null, warn) {
    let lines = wrapLines(warn, 324, 11.5).slice(0, 3), hh = 12 + lines.length * 14;
    panel(26, 646 - hh - 2, 348, hh, issues.length ? "#ffd9d0" : "#fff0c2", 12), lines.forEach((l, k) => text(ctx, l, 200, 646 - hh + 6 + k * 14 + 5, 11.5, issues.length ? "#c0392b" : "#b0602a", "center", null)), ctx.font = `bold 11.5px ${FONT}`, S.layoutWarn = { box: { x: 26, y: 646 - hh - 2, w: 348, h: hh }, lines: lines.map((l) => ctx.measureText(l).width), maxW: 324 };
  }
  drawButton(26, 652, 110, 48, "Back", "#d9cfe0"), button("back", 26, 652, 110, 48, () => go("map"));
  let ready = S.prep.deck.length === Math.min(BATTLE.deckSize, unlocked.length);
  if (drawButton(150, 652, 224, 48, "Defend!", "#9fe0b5", { disabled: !ready, size: 22 }), button("start", 150, 652, 224, 48, () => {
    ready ? startBattle() : toast("Pick 5 cards");
  }), S.prepAlert) {
    S.prepAlert.t -= 1 / 60, ctx.save(), ctx.globalAlpha = Math.min(1, S.prepAlert.t * 4);
    let lines = wrapLines(S.prepAlert.msg, 250, 12.5), hh = 22 + lines.length * 16, y0 = 498 - hh;
    panel(60, y0, 280, hh, "#5a4058", 14), lines.forEach((l, k) => text(ctx, l, 200, y0 + 19 + k * 16, 12.5, "#ffd0d0", "center", null)), ctx.restore(), S.prepAlert.t <= 0 && (S.prepAlert = null);
  }
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
  return S.bgCache[key] || (S.bgCache[key] = renderMapBackground(b.routes, b.map.theme, MAP_W, MAP_H, pxRatio, b.props)), S.bgCache[key];
}
function renderBattle(dt) {
  let b = S.battle, t = S.t;
  ctx.save(), rr(ctx, -4, MAP_Y - 4, MAP_W + 8, MAP_H + 8, 10), ctx.fillStyle = INK, ctx.fill(), ctx.restore(), ctx.drawImage(mapBg(b), 0, MAP_Y, MAP_W, MAP_H), ctx.save(), ctx.beginPath(), ctx.rect(0, MAP_Y, MAP_W, MAP_H), ctx.clip(), ctx.translate(0, MAP_Y);
  let p1 = b.path.pts[b.path.pts.length - 1], nests = [];
  for (let rt of b.routes) {
    let q = rt.pts[0];
    nests.some((n) => Math.hypot(n.x - q.x, n.y - q.y) < 5) || nests.push(q);
  }
  for (let q of nests) drawNest(ctx, Math.max(30, Math.min(MAP_W - 30, q.x)), Math.max(26, Math.min(MAP_H - 20, q.y + 6)), t);
  let selCard = S.drag ? S.drag.i : S.sel && S.sel.kind === "card" ? S.sel.i : null;
  if (selCard != null) {
    let card = b.picks[selCard];
    for (let c = 0; c < GRID_COLS; c++) for (let r = 0; r < GRID_ROWS; r++) {
      let chk = b.canPlay(selCard, c, r);
      chk.ok && (chk.upgrade ? (ctx.beginPath(), ctx.arc((c + 0.5) * TILE, (r + 0.5) * TILE, 19 + Math.sin(t * 6) * 2, 0, 7), ctx.lineWidth = 3, ctx.strokeStyle = "#ffd45e", ctx.stroke()) : (rr(ctx, c * TILE + 4, r * TILE + 4, TILE - 8, TILE - 8, 8), ctx.fillStyle = TOWERS[card].place === "path" ? "rgba(255,200,90,0.28)" : "rgba(120,220,150,0.25)", ctx.fill()));
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
  if (drawWaveStrip(b), ctx.restore(), button("map", 0, MAP_Y, MAP_W, MAP_H, mapTap), S.info && S.info.tower && renderTowerInfo(b, S.info), S.mode && !S.result) {
    let m = S.mode;
    panel(30, MAP_Y + 6, 340, 34, "#5a4058", 16), plainFit(m.kind === "move" ? `Tap a free blue spot to move it (${ECONOMY.diamonds.moveTower} diamond)` : "Tap the tower to swap with (free)", 182, MAP_Y + 23, 280, 12.5, "#ffffff", "center", "700"), blob(ctx, 350, MAP_Y + 23, 11, 11, "#ffb3b3", 1.8), text(ctx, "x", 350, MAP_Y + 22.5, 12, "#fff"), button("modeCancel", 300, MAP_Y + 2, 74, 42, () => {
      S.mode = null;
    });
  }
  renderHud(b), renderTray(b), renderUiFx(dt), S.paused && !S.result && renderPause(), S.result && renderResult(dt), S.queenDown && S.t - S.queenDown.t < 4.5 && drawQueenCheer(S.t - S.queenDown.t, S.queenDown.world), S.dialog && !S.paused && !S.result && renderDialog();
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
  ctx.font = `${weight} ${size}px ${FONT}`;
  let w = ctx.measureText(str).width;
  plainText(str, x, y, w > maxW ? size * maxW / w : size, col, align, weight);
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
  else if (m === "front")
    ctx.beginPath(), ctx.arc(7, 0, 4.6, 0, 7), ctx.fillStyle = "#e8b878", ctx.fill(), ctx.lineWidth = 1.6, ctx.strokeStyle = CRUMB_OUTLINE, ctx.stroke(), ctx.beginPath(), ctx.moveTo(-9, -1.8), ctx.lineTo(-3, -1.8), ctx.lineTo(-3, -5), ctx.lineTo(3, 0), ctx.lineTo(-3, 5), ctx.lineTo(-3, 1.8), ctx.lineTo(-9, 1.8), ctx.closePath(), ctx.fillStyle = "#ff6f6f", ctx.fill(), ctx.lineWidth = 1.5, ctx.strokeStyle = CRUMB_OUTLINE, ctx.lineJoin = "round", ctx.stroke();
  else {
    ctx.fillStyle = "#7a4a2a", ctx.strokeStyle = CRUMB_OUTLINE, ctx.lineWidth = 1.4;
    for (let [cx, cy, r] of [[-5, 0, 3.4], [0.5, 0, 2.7], [5.5, 0, 3.2]])
      ctx.beginPath(), ctx.arc(cx, cy, r, 0, 7), ctx.fill(), ctx.stroke();
    ctx.strokeStyle = "#7a4a2a", ctx.lineWidth = 1, ctx.beginPath(), ctx.moveTo(-6, 3), ctx.lineTo(-7, 6), ctx.moveTo(0, 3), ctx.lineTo(0, 6), ctx.moveTo(6, 3), ctx.lineTo(7, 6), ctx.stroke();
  }
  ctx.restore();
}
var stripLast = null;
function drawPieces(b) {
  if (!b.pieces.length) return;
  let rm = reducedMotion();
  for (let q of b.pieces) {
    let frac = Math.max(0, q.left / q.total), blink = q.left <= 1 && Math.floor(S.t * 8) % 2 === 0, bounce = rm ? 0 : Math.abs(Math.sin(S.t * 6 + q.id)) * 5;
    ctx.save(), ctx.translate(q.x, q.y), ctx.beginPath(), ctx.ellipse(0, 6, 9, 3, 0, 0, 7), ctx.fillStyle = "rgba(60,40,50,0.25)", ctx.fill();
    let pr = 17 + (rm ? 0 : Math.sin(S.t * 5) * 2.5);
    ctx.beginPath(), ctx.arc(0, -2, pr, 0, 7), ctx.lineWidth = 2, ctx.strokeStyle = "rgba(255,255,255,0.75)", ctx.stroke(), ctx.beginPath(), ctx.arc(0, -2, 14, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * frac), ctx.lineWidth = 3.4, ctx.lineCap = "round", ctx.strokeStyle = blink ? "#ff5a5a" : "#ffd45e", ctx.stroke(), crumbIcon(ctx, 0, -4 - bounce, 1.35, !0), q.bonus >= 0.05 && text(ctx, "+" + fmtFood(q.bonus), 0, -24 - bounce * 0.5, 10, "#fff7c9"), ctx.restore();
  }
}
function drawWaveStrip(b) {
  if (stripLast = null, S.info || S.mode || S.drag || S.sel && S.sel.kind === "card") return;
  let m = previewModel(b);
  if (!m) return;
  let groups = m.groups, more = m.moreAnts, widthOf = (gs, mo) => (ctx.font = `bold 11px ${FONT}`, 12 + gs.reduce((w2, g) => w2 + 18 + 2 + ctx.measureText("x" + g.count).width + 6, 0) + (mo ? ctx.measureText("+" + mo).width + 4 : 0)), label = null, w;
  m.kind === "left" ? (label = `Ants left: ${m.left}`, ctx.font = `bold 12px ${FONT}`, w = ctx.measureText(label).width + 22) : w = widthOf(groups, more);
  let rect = stripRect(b, w);
  if (rect && m.kind === "next") for (; rect.w < w - 0.5 && groups.length > 1; ) {
    let g = groups[groups.length - 1];
    groups = groups.slice(0, -1), more += g.count, w = widthOf(groups, more), rect = stripRect(b, w);
  }
  if (rect) {
    if (stripLast = { rect, kind: m.kind, n: m.n, groups, more, left: m.left }, ctx.save(), ctx.translate(rect.x, rect.y), rr(ctx, 0, 0, rect.w, STRIP_H, STRIP_H / 2), ctx.fillStyle = "rgba(255,250,245,0.93)", ctx.fill(), ctx.lineWidth = 1.8, ctx.strokeStyle = INK, ctx.stroke(), label) text(ctx, label, rect.w / 2, STRIP_H / 2 + 0.5, 12, "#c0392b", "center", null);
    else {
      let x = 8;
      for (let g of groups) {
        let spr = antSprite(g.type, 0, !1, pxRatio), k = ANTS[g.type].size, cx = x + 9, cy = STRIP_H / 2;
        ctx.save(), ctx.beginPath(), ctx.arc(cx, cy, 9, 0, 7), ctx.clip();
        let sw = 44 * k, sh = 40 * k;
        ctx.drawImage(spr.cv, (spr.ox - 24 * k) * pxRatio, (spr.oy - 28 * k) * pxRatio, sw * pxRatio, sh * pxRatio, cx - 9, cy - 9, 18, 18), ctx.restore(), isTank(g.type) && (ctx.beginPath(), ctx.arc(cx, cy, 9, 0, 7), ctx.lineWidth = 1.8, ctx.strokeStyle = "#c0392b", ctx.stroke()), isFlyer(g.type) && (ctx.beginPath(), ctx.ellipse(cx + 7, cy - 8, 5, 2.4, -0.5, 0, 7), ctx.fillStyle = "rgba(205,235,255,0.95)", ctx.fill(), ctx.lineWidth = 1, ctx.strokeStyle = INK, ctx.stroke()), text(ctx, "x" + g.count, x + 20, STRIP_H / 2 + 0.5, 11, INK, "left", null), ctx.font = `bold 11px ${FONT}`, x += 20 + ctx.measureText("x" + g.count).width + 6;
      }
      more && text(ctx, "+" + more, x - 2, STRIP_H / 2 + 0.5, 11, "#8a7080", "left", null);
    }
    ctx.restore();
  }
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
  let modes = hasTargetModes(tw.type), H2 = modes ? 168 : 140, py = tw.y + MAP_Y > 300 ? MAP_Y + 8 : MAP_Y + MAP_H - H2 - 8;
  S.layoutInfo = { x: 14, y: py, w: 372, h: H2 }, panel(14, py, 372, H2, "#fffaf5", 14), ctx.font = `bold 15px ${FONT}`;
  let tW = Math.min(150, ctx.measureText(T.name).width);
  fitText(T.name, 26 + tW / 2, py + 17, 150, 15, "#ff8fab"), plainFit(`Lv ${tw.lvl}/${b.cfg.maxInBattleLevel} \xB7 card L${tw.cardLevel}`, 34 + tW, py + 17, 222 - tW, 12, INFO_SOFT, "left", "600");
  let desc = T.ability || T.desc;
  T.directional && !tw.trailDir && (desc = tw.type === "ball" ? "No trail right next to it - the marble cannot roll here. Move it!" : tw.type === "tractor" ? "No trail right next to it - nothing to scoop here. Move it!" : "No trail right next to it - no wind here. Move it!"), plainWrap(desc, 346, 12.5).slice(0, 2).forEach((l, i) => plainText(l, 26, py + 38 + i * 16, 12.5, T.directional && !tw.trailDir ? "#c0392b" : INFO_INK));
  let keys = tw.type === "tractor" ? ["liftSize", "rate", "scoop"] : ["power", "rate", tw.type === "ball" ? "roll" : "range"], changed = new Set((info.changed || []).map((d) => d.key));
  keys.forEach((k, i) => {
    let x = 22 + i * 120, y = py + 66, w = 114, h = 38, on = changed.has(k);
    rr(ctx, x, y, w, h, 10), ctx.fillStyle = on ? "#e2f8dc" : "#f7efeb", ctx.fill(), ctx.lineWidth = on ? 2.4 : 1.2, ctx.strokeStyle = on ? "#55b85a" : "#e0cfd4", ctx.stroke(), plainFit(k === "roll" ? "Roll here" : k === "scoop" ? "Scoop" : statLabel(tw.type, k), x + 8, y + 11, w - 14, 11, INFO_SOFT);
    let d = (info.changed || []).find((q) => q.key === k), val = k === "roll" ? rollHere(tw) : k === "scoop" ? tw.trailDir ? "trail tile beside it" : "no trail" : d ? `${formatStat(tw.type, k, d.from)} \u2192 ${formatStat(tw.type, k, d.to)}` : formatStat(tw.type, k, tw.stat(k));
    plainFit(val, x + w / 2, y + 27, w - 12, 14, on ? "#2f8a36" : INFO_INK, "center", "600");
  });
  let extra = (info.changed || []).filter((d) => !keys.includes(d.key)), line;
  extra.length ? line = "Upgraded: " + extra.map((d) => diffText(tw.type, d)).join(", ") : tw.lvl < b.cfg.maxInBattleLevel ? line = (dmgGainText(tw.type, tw.lvl + 1, tw.cardLevel) ? dmgGainText(tw.type, tw.lvl + 1, tw.cardLevel) + "! " : "") + "Next (drop same card): " + upgradeDiff(tw.type, tw.lvl, tw.cardLevel).map((d) => diffText(tw.type, d)).join(", ") : line = "Max level!", plainFit(line, 200, py + (modes ? 148 : 122), 350, 12, extra.length ? "#2f8a36" : INFO_INK, "center"), button("infoClose", 14, py, 372, H2, () => {
    S.info = null;
  }), modes && TARGET_MODES.forEach((m, i) => {
    let x = 22 + i * 120, y = py + 110, w = 114, h = 28, on = tw.mode === m;
    rr(ctx, x, y, w, h, 10), ctx.fillStyle = on ? "#ffd27a" : "#f7efeb", ctx.fill(), ctx.lineWidth = on ? 2.6 : 1.2, ctx.strokeStyle = on ? INK : "#e0cfd4", ctx.stroke(), drawModeIcon(m, x + 17, y + h / 2, 1), plainFit(MODE_NAME[m], x + 32, y + h / 2 + 0.5, w - 38, 12.5, on ? INK : INFO_INK, "left", on ? "700" : "600"), button("mode_" + m, x - 2, y - 2, w + 4, h + 4, () => setMode(tw, m));
  });
  let canMove = (S.save.diamonds || 0) >= ECONOMY.diamonds.moveTower;
  drawButton(256, py + 5, 62, 24, "", "#9fd8ff", { r: 10, disabled: !canMove }), text(ctx, "Move", 280, py + 17, 11.5), diamondIcon(ctx, 305, py + 17, 0.55), text(ctx, String(ECONOMY.diamonds.moveTower), 312, py + 17.5, 10), drawButton(322, py + 5, 58, 24, "Swap", "#c9b6f2", { r: 10, size: 11.5, disabled: b.towers.length < 2 }), button("infoMove", 252, py, 68, 40, () => startMode("move", tw)), button("infoSwap", 320, py, 64, 40, () => startMode("swap", tw));
}
function drawQueenCheer(age, world) {
  let k = Math.min(1, age / 0.35), fade = age > 3.8 ? Math.max(0, 1 - (age - 3.8) / 0.7) : 1, msg = world === 2 ? ["Way to go,", "you saved the cake!"] : ["Way to go,", "you saved the cookies!"];
  ctx.save(), ctx.globalAlpha = fade, ctx.translate(200, MAP_Y + 210);
  let sc = 0.6 + 0.4 * k + Math.sin(age * 5) * 0.03;
  ctx.scale(sc, sc), rr(ctx, -170, -48, 340, 96, 24), ctx.fillStyle = "rgba(90,64,88,0.82)", ctx.fill(), ctx.lineWidth = 3, ctx.strokeStyle = "#ffd45e", ctx.stroke(), text(ctx, msg[0], 0, -18, 26, "#ffe36e"), text(ctx, msg[1], 0, 16, 24, "#ffffff"), ctx.restore();
}
function fitText(str, x, y, maxW, size, col) {
  ctx.font = `bold ${size}px ${FONT}`;
  let w = ctx.measureText(str).width;
  text(ctx, str, x, y, w > maxW ? size * maxW / w : size, col);
}
function drawTowerObj(tw) {
  ctx.save(), ctx.translate(tw.x, tw.y);
  let age = S.battle.time - (tw.born ?? (tw.born = S.battle.time)), pop = age < 0.25 ? 0.6 + age / 0.25 * 0.4 + Math.sin(age / 0.25 * Math.PI) * 0.2 : 1;
  if (ctx.scale(pop, pop), TOWERS[tw.type].place === "path" && ctx.translate(tw.px - tw.x, tw.py - tw.y), drawTower(ctx, tw.type, S.t + tw.id, tw), tw.mode && tw.mode !== "weak" && (ctx.beginPath(), ctx.arc(14, 13, 7, 0, 7), ctx.fillStyle = "#fffaf5", ctx.fill(), ctx.lineWidth = 1.8, ctx.strokeStyle = INK, ctx.stroke(), drawModeIcon(tw.mode, 14, 13, 0.5)), tw.lvl > 1) for (let k = 0; k < tw.lvl; k++) starShape(ctx, -(tw.lvl - 1) * 3.6 + k * 7.2, 16, 3.6, "#ffd45e", 1.1);
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
function drawAntObj(a, ghost = !1) {
  let b = S.battle, frozen = b.time < b.freezeUntil, p = b.route(a).at(a.d);
  Math.abs(p.dx) > 0.3 && (a._face = p.dx * (a.dir || 1) >= 0 ? 1 : -1);
  let face = a._face ?? 1, speedK2 = a.type === "small" ? 2.2 : a.type === "sprinter" ? 2.4 : a.type === "queen" ? 0.6 : a.type === "big" ? 1 : a.type === "heavy" ? 0.9 : 1.5, still = frozen || a.stunT > 0, fr = still ? 0 : Math.floor((b.time + a.id * 0.37) * speedK2 * ANT_FRAMES) % ANT_FRAMES, spr = antSprite(a.type, fr, a.carrying > 0, pxRatio), breathe = still ? 1 + Math.sin(S.t * 5 + a.id) * 0.035 : 1, lat = (a.id * 37 % 9 - 4) * 1.2;
  a.state === "back" && (lat = UI.carrierLane + lat * 0.4);
  let x = a.x + p.dy * lat, y = a.y - p.dx * lat;
  if (ctx.save(), ctx.translate(x, y + 4), ctx.scale(face / breathe, breathe), a.hitFlash > 0.06 && ctx.scale(1.08, 0.92), ctx.drawImage(spr.cv, -spr.ox, -spr.oy, spr.w, spr.h), a.hitFlash > 0 && (ctx.globalCompositeOperation = "lighter", ctx.globalAlpha = 0.5, ctx.drawImage(spr.cv, -spr.ox, -spr.oy, spr.w, spr.h)), ctx.restore(), frozen && (ctx.save(), ctx.globalAlpha = 0.55, rr(ctx, x - 17 * a.size, y - 24 * a.size, 34 * a.size, 32 * a.size, 7), ctx.fillStyle = "#d6f3ff", ctx.fill(), ctx.lineWidth = 1.5, ctx.strokeStyle = "#8fd0f5", ctx.stroke(), ctx.restore()), a.slow > 0.01 && !frozen && (ctx.fillStyle = "rgba(255,240,160,0.8)", ctx.beginPath(), ctx.ellipse(x, y + 8, 9 * a.size, 2.5, 0, 0, 7), ctx.fill()), a.stunT > 0 && !frozen && stunStars(ctx, x, y - 30 * a.size, S.t + a.id, a.size), a.charmT > 0 && heart(ctx, x + Math.sin(S.t * 4 + a.id) * 4, y - 32 * a.size - Math.abs(Math.sin(S.t * 3)) * 4, 3, "#ff8fbf"), a.hp < a.maxHp && !ghost) {
    let w = a.type === "queen" ? 60 : 22, hy = y - (a.flying ? 44 : 33) * a.size;
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
        let spr = antSprite(f.ant, 0, !1, pxRatio);
        ctx.globalAlpha = 1 - k, ctx.translate(f.x, f.y - k * 30), ctx.rotate(Math.PI * k * 0.4 * f.face), ctx.scale(f.face, -1), ctx.drawImage(spr.cv, -spr.ox, -spr.oy, spr.w, spr.h), ctx.scale(1, -1), ctx.beginPath(), ctx.ellipse(0, -18, 8, 2.5, 0, 0, 7), ctx.lineWidth = 2, ctx.strokeStyle = "#ffe36e", ctx.stroke();
        break;
      }
      case "puff":
        f.x += f.vx * dt, f.y += f.vy * dt, ctx.globalAlpha = (1 - k) * 0.8, ctx.beginPath(), ctx.arc(f.x, f.y, f.r * (1 + k), 0, 7), ctx.fillStyle = "#fff", ctx.fill();
        break;
      case "crumbTxt":
        ctx.globalAlpha = 1 - k * k, crumbIcon(ctx, f.x - 7, f.y - k * 24, 0.7), text(ctx, "+" + f.n, f.x + 7, f.y - k * 24, 12, "#ffe3a8");
        break;
      case "txt": {
        ctx.globalAlpha = 1 - k * k;
        let sz = (f.size || 13) * (k < 0.12 ? 0.6 + k / 0.12 * 0.4 + Math.sin(k / 0.12 * Math.PI) * 0.15 : 1);
        text(ctx, f.s, Math.max(60, Math.min(MAP_W - 60, f.x)), f.y - k * 22, sz, f.col);
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
      case "ember":
        f.x += f.vx * dt, f.y += f.vy * dt, ctx.globalAlpha = 1 - k, ctx.beginPath(), ctx.arc(f.x, f.y, 2.6 * (1 - k) + 0.8, 0, 7), ctx.fillStyle = k < 0.4 ? "#ffe08a" : "#ff8a4a", ctx.fill();
        break;
      case "spark":
        ctx.globalAlpha = 1 - k, starShape(ctx, f.x, f.y, 5 + k * 4, f.col || "#fff", 1);
        break;
      case "shard":
        f.x += f.vx * dt, f.y += f.vy * dt, f.vy += 300 * dt, ctx.globalAlpha = 1 - k, ctx.translate(f.x, f.y), ctx.rotate(k * 9), ctx.beginPath(), ctx.moveTo(-3, -2), ctx.lineTo(3, -1), ctx.lineTo(0, 3), ctx.closePath(), ctx.fillStyle = "#bfe6ff", ctx.fill(), ctx.lineWidth = 1, ctx.strokeStyle = INK, ctx.stroke();
        break;
      case "star":
        f.x += f.vx * dt, f.y += f.vy * dt, f.vy += 80 * dt, ctx.globalAlpha = 1 - k, starShape(ctx, f.x, f.y, 4 * (1 - k) + 1, "#ffe36e", 1);
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
      case "banner": {
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
function renderHud(b) {
  panel(6, 6, 388, 54, "#fff6ee", 16), drawTreat(ctx, treatKind(b), 30, 33, b.foodStored / b.cfg.foodHP, S.t, { ouch: S.cookieOuch > S.t, react: reaction(S.treat, S.t) });
  let f = b.foodStored / b.cfg.foodHP;
  rr(ctx, 60, 22, 84, 20, 10), ctx.fillStyle = "#f0e0d8", ctx.fill(), ctx.lineWidth = 2, ctx.strokeStyle = INK, ctx.stroke(), f > 0 && (rr(ctx, 62, 24, 80 * f, 16, 8), ctx.fillStyle = f >= 0.9 ? "#8fe388" : f >= 0.5 ? "#ffd45e" : "#ff8a8a", ctx.fill()), text(ctx, `${Math.floor(b.foodStored + 1e-6)}`, 102, 33, 13, "#fff");
  let carried = b.ants.reduce((s, a) => s + (a.trips === 0 ? a.carrying : 0), 0);
  carried && text(ctx, `${fmtFood(carried)} carried off!`, 102, 51, 11, "#c0392b", "center", null), text(ctx, `Wave ${Math.min(b.nextWave, b.totalWaves)}/${b.totalWaves}`, 184, 26, 15, "#ffb3c1"), text(ctx, `Lv ${b.levelIndex + 1}`, 184, 46, 11, "#a08090", "center", null), ctx.save(), ctx.translate(252, 33), rr(ctx, -31, -14, 62, 28, 14), ctx.fillStyle = "#e9f7ff", ctx.fill(), ctx.lineWidth = 2, ctx.strokeStyle = INK, ctx.stroke(), diamondIcon(ctx, -15, 0, 0.95), text(ctx, String(S.save.diamonds || 0), 8, 1, 16, "#7fd3ff"), ctx.restore(), S.crumbShake = Math.max(0, S.crumbShake - 1 / 60), S.crumbPulse = Math.max(0, S.crumbPulse - 1 / 60);
  let shx = S.crumbShake > 0 ? Math.sin(S.t * 60) * 4 * S.crumbShake / 0.45 : 0, pul = 1 + S.crumbPulse * 0.5;
  ctx.save(), ctx.translate(341 + shx, 33), ctx.scale(pul, pul), rr(ctx, -45, -16, 90, 32, 16), ctx.fillStyle = S.crumbShake > 0 ? "#ffd6d6" : "#fff1d6", ctx.fill(), ctx.lineWidth = 2, ctx.strokeStyle = S.crumbShake > 0 ? "#e0524f" : INK, ctx.stroke(), crumbIcon(ctx, -27, 0, 1.2), text(ctx, String(Math.floor(b.crumbs)), 7, 1, 19, "#ffcf7a"), blob(ctx, 36, -1, 9, 9, "#9fe0ff", 1.8), text(ctx, "+", 36, -1.5, 15, "#ffffff"), ctx.restore(), S.result || button("buyCrumbs", 290, 0, 110, 66, () => openCrumbDialog());
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
  }), panel(44, 228, 312, 250, "#fff6ee"), text(ctx, D.title, 200, 258, 22, D.kind === "crumbs" ? "#ffcf7a" : BONUSES[D.booster].color), ctx.save(), ctx.translate(200, 300), D.kind === "crumbs")
    for (let k = 0; k < 5; k++) crumbIcon(ctx, -28 + k * 14, Math.sin(S.t * 4 + k) * 2, 1.4);
  else
    ctx.scale(1.4, 1.4), drawBonusIcon(ctx, D.booster, S.t);
  ctx.restore(), plainText(D.line, 200, 338, 14, "#3d2a36", "center", "600"), diamondIcon(ctx, 178, 364, 1.2), text(ctx, String(D.price), 212, 365, 22, "#7fd3ff"), plainText(afford ? `You have ${have} diamonds.` : `You have ${have} diamonds. Get diamonds from the Reward Calendar.`, 200, 392, 11.5, afford ? "#5a4652" : "#c0392b", "center"), plainText(D.note, 200, 408, 11, "#7a6a76", "center"), drawButton(64, 420, 128, 46, "Cancel", "#d9cfe0"), button("dlgCancel", 60, 418, 136, 52, () => {
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
  panel(4, y0, 392, H - y0 - 4, "#ffe9df", 18);
  let cost = b.nextCardCost, afford = b.crumbs >= cost;
  for (let i = 0; i < b.picks.length; i++) {
    let x = 12 + i * 94, y = y0 + L.cardY, w = 88, h = L.cardH, selected = S.sel && S.sel.kind === "card" && S.sel.i === i || S.drag && S.drag.i === i;
    S.slotFlip[i] = Math.max(0, (S.slotFlip[i] || 0) - 1 / 60);
    let shake = !afford && S.crumbShake > 0 ? Math.sin(S.t * 60) * 3 : 0;
    ctx.save(), ctx.translate(x + w / 2 + shake, y + h / 2), ctx.scale(Math.max(0.05, S.slotFlip[i] > 0 ? 1 - Math.sin(S.slotFlip[i] / 0.3 * Math.PI) : 1), 1), ctx.translate(-(x + w / 2), -(y + h / 2)), drawCard(x, y, w, h, b.picks[i], { cost, afford, selected, lift: selected ? 4 : 0, level: S.save.cards[b.picks[i]].level }), ctx.restore(), button("pick" + i, x - 3, y0 + 2, w + 6, L.cardH + 8, () => {
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
  drawButton(wx, ry, ww, L.rerollH, "", "#c9b6f2", { disabled: b.crumbs < rc }), rc === 0 ? (text(ctx, "Redraw", wx + 30, ry + 18, 13), text(ctx, "FREE", wx + 76, ry + 18, 12, "#2f8a3a")) : (text(ctx, "Redraw", wx + 30, ry + 18, 13), crumbIcon(ctx, wx + 66, ry + 18, 0.65), text(ctx, String(rc), wx + 80, ry + 18, 12)), button("reroll", wx - 4, y0 + L.rerollY - 2, ww + 8, L.rowY - L.rerollY, () => {
    b.reroll() ? (sfx("tap"), rc > 0 && (addUi({ k: "costFly", n: rc, x0: 340, y0: 34, x1: 300, y1: 96, life: 1, max: 1 }), S.crumbPulse = 0.35)) : needCrumbs(rc);
  });
  let by = y0 + L.rowY, bh = L.rowH, hitY = y0 + L.rowY - 2, hitH = H - hitY;
  b.bonusTypes.forEach((bt, k) => {
    let x = 12 + k * 104, w = 98, can = b.canUseBonus(bt), sel = S.sel && S.sel.kind === "bonus" && S.sel.type === bt, stock = b.bonusStock[bt] || 0, buyable = stock <= 0 && b.bonusUsesLeft > 0;
    if (drawButton(x, by, w, bh, "", sel ? "#ffd27a" : BONUSES[bt].color, { disabled: !can && !buyable, r: 12 }), ctx.save(), ctx.translate(x + 17, by + bh / 2), ctx.scale(0.85, 0.85), drawBonusIcon(ctx, bt, S.t), ctx.restore(), fitText(BONUSES[bt].name, x + 59, by + 15, 66, 11, "#fff"), buyable) {
      let pr = nextBoosterPrice(b, bt);
      diamondIcon(ctx, x + 47, by + 31, 0.62), text(ctx, String(pr), x + 66, by + 31, 11, "#fff8c0");
    } else text(ctx, `x${stock}`, x + 59, by + 31, 10, "#fff8c0");
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
  }), text(ctx, `${b.bonusUsesLeft}`, 234, by + 14, 14, "#ffb3c1"), text(ctx, "left", 234, by + 30, 9, "#a08090", "center", null), drawSpeedButton(256, by, 60, bh), button("speed", 252, hitY, 68, hitH, () => {
    S.speed = nextSpeed(S.speed), sfx("tap");
  }), drawButton(324, by, 64, bh, "II", "#d9cfe0", { r: 12, size: 16 }), button("pause", 320, hitY, 76, hitH, () => {
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
  ctx.restore(), text(ctx, sp + "x", x + w / 2, y + h - 10, 9, INK, "center", null);
}
function renderPause() {
  buttons.length = 0, ctx.fillStyle = "rgba(60,40,55,0.45)", ctx.fillRect(-2e3, -2e3, W + 4e3, H + 4e3), panel(60, 220, 280, 260, "#fff6ee"), text(ctx, "Paused", 200, 256, 28, "#ffb3c1"), drawButton(90, 290, 220, 48, "Resume", "#9fe0b5"), button("resume", 90, 290, 220, 48, () => {
    setPaused(!1);
  }), drawButton(90, 350, 220, 48, "Restart", "#ffd27a"), button("restart", 90, 350, 220, 48, () => startBattle(S.levelIndex, S.battle.deck, S.battle.bonusTypes)), drawButton(90, 410, 220, 48, "Quit to map", "#ffb3b3"), button("quit", 90, 410, 220, 48, () => {
    S.battle = null, go("map");
  });
}
function renderResult(dt) {
  let R = S.result, out = R.out;
  if (R.hold > 0) {
    R.hold -= dt, ctx.fillStyle = "rgba(60,40,55,0.22)", ctx.fillRect(-2e3, -2e3, W + 4e3, H + 4e3), button("resultBlock", -2e3, -2e3, W + 4e3, H + 4e3, () => {
    });
    return;
  }
  R.t += dt, ctx.fillStyle = "rgba(60,40,55,0.5)", ctx.fillRect(-2e3, -2e3, W + 4e3, H + 4e3), button("resultBlock", -2e3, -2e3, W + 4e3, H + 4e3, () => {
  });
  let celebrating = R.perfect && R.t < UI.perfectAnimTime, pop = Math.min(1, R.t * 4);
  ctx.save(), ctx.translate(200, 360), ctx.scale(0.7 + pop * 0.3, 0.7 + pop * 0.3), ctx.translate(-200, -360), panel(36, 120, 328, 480, "#fff6ee");
  let tk = treatOf(S.battle.levelIndex), TN = tk === "cake" ? "Cake" : "Cookie", title = R.perfect ? `Perfect ${TN}!` : R.win ? `${TN} saved!` : `${TN} eaten!`, ts = R.perfect ? 30 + Math.max(0, 0.3 - R.t) * 30 + Math.sin(R.t * 6) * 1.5 : 28;
  if (text(ctx, title, 200, 156, ts, R.perfect ? "#ffd45e" : R.win ? "#9fe0b5" : "#ff9a9a"), R.perfect) {
    ctx.save(), ctx.globalAlpha = 0.35 + Math.sin(R.t * 4) * 0.15;
    let g = ctx.createRadialGradient(200, 212, 10, 200, 212, 70);
    g.addColorStop(0, "#fff6a8"), g.addColorStop(1, "rgba(255,246,168,0)"), ctx.fillStyle = g, ctx.beginPath(), ctx.arc(200, 212, 70, 0, 7), ctx.fill(), ctx.restore();
    for (let i = 0; i < 8; i++) {
      let a = R.t * 0.8 + i * Math.PI / 4;
      starShape(ctx, 200 + Math.cos(a) * 52, 212 + Math.sin(a) * 40, 4, "#ffe36e", 1);
    }
  }
  drawTreat(ctx, tk, 200, 212, R.win ? S.battle.foodStored / S.battle.cfg.foodHP : 0.05, S.t, R.win ? { face: "happy" } : {}), R.queenKilled && plainFit(tk === "cake" ? "Way to go, you saved the cake!" : "Way to go, you saved the cookies!", 200, 180, 300, 13, "#e0607e", "center", "800");
  for (let s = 0; s < 3; s++) {
    let on = s < R.stars && R.t > 0.3 + s * 0.25, sc = on ? 1 + Math.max(0, 0.2 - (R.t - 0.3 - s * 0.25)) * 3 : 1;
    starShape(ctx, 140 + s * 60, 270, 18 * sc, on ? "#ffd45e" : "#e8dde4", 2.5);
  }
  text(ctx, `Food left: ${fmtFood(S.battle.foodStored)}/${S.battle.cfg.foodHP}   Ants beaten: ${R.kills}`, 200, 302, 12, "#7a5a6a", "center", null);
  let P = out.parts || {}, rows = [];
  R.win ? (rows.push(["Victory", P.base]), rows.push(["Food left", P.food]), rows.push(["Ants beaten", P.kills]), P.level && rows.push(["Level reward", P.level]), P.firstClear && rows.push(["First clear", P.firstClear])) : rows.push(["Ants beaten", P.kills || 0]), rows.push([R.win ? "Time survived" : `Time survived${out.coins >= ECONOMY.lossCap ? ` (max ${ECONOMY.lossCap})` : ""}`, P.time || 0]);
  let RS = rows.length > 5 ? 14 : 16;
  rr(ctx, 70, 316, 260, 14 + rows.length * RS, 10), ctx.fillStyle = "#f6ece8", ctx.fill(), rows.forEach(([l, v], i) => {
    text(ctx, l, 84, 330 + i * RS, 11, "#7a5a6a", "left", null), text(ctx, `+${v}`, 316, 330 + i * RS, 11, "#c9962a", "right", null);
  });
  let yy = 330 + rows.length * RS + 18;
  if (coinIcon(ctx, 150, yy, 1.3), text(ctx, `+${out.coins} coins`, 208, yy + 1, 18, "#ffd45e"), yy += 20, text(ctx, `(${R.crumbsLeft} unspent crumbs vanish)`, 200, yy, 10, "#a08090", "center", null), yy += 20, R.win || text(ctx, "Win to earn cards and prizes!", 200, yy, 12, "#a08090", "center", null), out.booster && (rr(ctx, 70, yy - 12, 260, 26, 12), ctx.fillStyle = "#ffe9f0", ctx.fill(), ctx.lineWidth = 2, ctx.strokeStyle = "#ff9ab0", ctx.stroke(), ctx.save(), ctx.translate(92, yy + 1), ctx.scale(0.62, 0.62), drawBonusIcon(ctx, out.booster.id, S.t), ctx.restore(), text(ctx, `First clear: +1 ${BONUSES[out.booster.id].name} booster`, 210, yy + 1, 12.5, "#e0607e", "center", null), yy += 30), out.prize && !celebrating) {
    let k = Math.min(1, (R.t - UI.perfectAnimTime) * 4);
    ctx.save(), ctx.translate(200, yy + 12), ctx.scale(0.5 + k * 0.5, 0.5 + k * 0.5), rr(ctx, -130, -16, 260, 32, 14), ctx.fillStyle = "#fff2b8", ctx.fill(), ctx.lineWidth = 2.4, ctx.strokeStyle = "#e0a830", ctx.stroke();
    let pz = out.prize, label = pz.kind === "cards" ? pz.newCard ? `Prize: new tower - ${TOWERS[pz.id].short}!` : `You won a card: ${TOWERS[pz.id].short} L${pz.level}` : `Prize: +${pz.count} ${BONUSES[pz.id].name} booster`;
    pz.kind === "bonus" ? (ctx.save(), ctx.translate(-108, 0), ctx.scale(0.8, 0.8), drawBonusIcon(ctx, pz.id, S.t), ctx.restore()) : (ctx.save(), ctx.translate(-108, 6), ctx.scale(0.42, 0.42), drawTower(ctx, pz.id, S.t, null), ctx.restore()), text(ctx, label, 10, 1, 13, "#c47a12"), ctx.restore();
  } else R.win && !R.perfect && S.battle.stats.stolen > 0 && text(ctx, "Tip: lose no food at all for a Perfect prize", 200, yy + 10, 10.5, "#a08090", "center", null);
  ctx.restore();
  for (let c of R.confetti)
    c.vy += 420 * dt, c.x += c.vx * dt, c.y += c.vy * dt, c.r += dt * 8, c.y < 760 && (ctx.save(), ctx.translate(c.x, c.y), ctx.rotate(c.r), ctx.fillStyle = c.c, ctx.fillRect(-4, -2.5, 8, 5), ctx.restore());
  if (celebrating) return;
  let by = 532;
  if (out.zapperGift && zapperGiftPending(S.save)) {
    drawButton(100, by, 200, 50, "Continue", "#9fe0b5"), button("rcontinue", 100, by, 200, 50, () => {
      S.battle = null, go("map");
    });
    return;
  }
  drawButton(52, by, 92, 50, "Map", "#d9cfe0"), button("rmap", 52, by, 92, 50, () => {
    S.battle = null, go("map");
  }), drawButton(154, by, 92, 50, "Retry", "#ffd27a"), button("rretry", 154, by, 92, 50, () => openPrep(S.levelIndex));
  let hasNext = R.win && S.levelIndex + 1 < LEVELS.length;
  drawButton(256, by, 92, 50, "Next", "#9fe0b5", { disabled: !hasNext }), hasNext && button("rnext", 256, by, 92, 50, () => openPrep(S.levelIndex + 1));
}
function cardStatKeys(id) {
  return id === "ball" ? ["power", "rate", "ballRadius"] : id === "tractor" ? ["liftSize", "rate", "scoop"] : ["power", "rate", "range"];
}
function cardInfoPanel(id, x, y, w, h, opt = {}) {
  if (panel(x, y, w, h, "#ffffff", 14), S.layoutCardPanel = { x, y, w, h }, !id) {
    plainText(opt.hint || "Tap a card to see its stats.", x + w / 2, y + h / 2, 12.5, "#a08090", "center", "600");
    return;
  }
  let T = TOWERS[id], c = S.save.cards[id], own = c.unlocked, L = Math.max(1, c.level);
  fitText(T.name, x + 12 + Math.min(170, 9 * T.name.length) / 2, y + 16, 170, 14.5, "#ff8fab"), plainFit(own ? `Card L${c.level} (used in battle)` : "Not owned yet", x + w - 12, y + 16, 150, 11.5, INFO_SOFT, "right", "700");
  let cmp = h < 108;
  plainFit(T.desc, x + 12, y + (cmp ? 33 : 37), w - 24, 12, INFO_INK, "left", "500");
  let next = cardUpgradeDiff(id, L), nk = new Set(next.map((d) => d.key)), keys = cardStatKeys(id), bw = (w - 24 - 12) / 3;
  keys.forEach((k, i) => {
    let bx = x + 12 + i * (bw + 6), by = y + (cmp ? 44 : 50);
    rr(ctx, bx, by, bw, cmp ? 36 : 38, 9), ctx.fillStyle = nk.has(k) ? "#eefbe9" : "#f7efeb", ctx.fill(), ctx.lineWidth = nk.has(k) ? 2 : 1.2, ctx.strokeStyle = nk.has(k) ? "#8fd18f" : "#e0cfd4", ctx.stroke(), plainFit(k === "scoop" ? "Scoops" : statLabel(id, k), bx + 7, by + (cmp ? 9.5 : 10), bw - 12, 10.5, INFO_SOFT, "left", "600"), plainFit(k === "scoop" ? "1 trail tile" : formatStat(id, k, towerStat(id, k, 1, L)), bx + bw / 2, by + (cmp ? 24.5 : 26), bw - 10, 13.5, INFO_INK, "center", "700");
  });
  let line = next.length ? `Next card level L${L + 1}: ` + next.map((d) => diffText(id, d)).join(" + ") : "Top card level (L10)!";
  plainFit(line, x + w / 2, y + (cmp ? h - 9 : 102), w - 20, 12, next.length ? "#2f8a36" : "#c9962a", "center", "700"), h > 118 && !opt.noFoot && plainFit(opt.foot || (own ? "Merge cards on its own screen to reach the next level." : `Get it in the Shop (${unlockPrice(id)}c) or as a prize.`), x + w / 2, y + h - 13, w - 20, 10.5, "#a08090", "center", "600");
}
var CARD_BANDS = [[3, "#d9965f", "#f3c79c"], [6, "#9fb2c8", "#e1e9f2"], [9, "#e8b830", "#ffe9a0"], [10, "#ff7fb8", "#ffd6ec"]];
function cardBand(L) {
  return CARD_BANDS.find((b) => L <= b[0]) || CARD_BANDS[0];
}
function drawCardPic(x, y, w, h, type, opt = {}) {
  let T = TOWERS[type], L = opt.level || 1, [, frame2, frameLt] = cardBand(L);
  ctx.save(), opt.dim && (ctx.globalAlpha = 0.42);
  let r = Math.max(7, w * 0.12);
  if (rr(ctx, x, y + 3, w, h, r), ctx.fillStyle = "rgba(74,52,66,0.25)", ctx.fill(), rr(ctx, x, y, w, h, r), opt.locked) {
    ctx.fillStyle = "#ddd3da", ctx.fill(), ctx.lineWidth = 2.5, ctx.strokeStyle = INK, ctx.stroke(), rr(ctx, x + 5, y + 5, w - 10, h - 10, r - 3), ctx.fillStyle = "#eee6eb", ctx.fill(), text(ctx, "?", x + w / 2, y + h * 0.42, w * 0.38, "#fff"), plainFit(opt.lockText || "Locked", x + w / 2, y + h - 13, w - 10, 10, "#7a6a76", "center", "700"), ctx.restore();
    return;
  }
  let fg = ctx.createLinearGradient(x, y, x + w, y + h);
  fg.addColorStop(0, frameLt), fg.addColorStop(0.5, frame2), fg.addColorStop(1, frameLt), ctx.fillStyle = fg, ctx.fill(), ctx.lineWidth = opt.selected ? 4 : 2.4, ctx.strokeStyle = opt.selected ? opt.selCol || "#ff6f91" : INK, ctx.stroke();
  let compact = h < w * 1.1, m = Math.max(4, w * 0.07), ax = x + m, ay = y + m, aw = w - 2 * m, ah = compact ? h - m * 1.6 - 15 : h * 0.66 - m;
  ctx.save(), rr(ctx, ax, ay, aw, ah, r * 0.6), ctx.clip();
  let bg = ctx.createRadialGradient(ax + aw / 2, ay + ah * 0.45, 2, ax + aw / 2, ay + ah * 0.5, aw * 0.8);
  bg.addColorStop(0, shade(T.color, 0.75)), bg.addColorStop(1, shade(T.color, 0.25)), ctx.fillStyle = bg, ctx.fillRect(ax, ay, aw, ah), ctx.globalAlpha *= 0.22;
  for (let i = 0; i < 6; i++)
    ctx.beginPath(), ctx.arc(ax + i * 37 % aw, ay + i * 23 % ah, aw * 0.12, 0, 7), ctx.fillStyle = "#ffffff", ctx.fill();
  ctx.globalAlpha = opt.dim ? 0.42 : 1, ctx.beginPath(), ctx.ellipse(ax + aw / 2, ay + ah * 0.86, aw * 0.36, ah * 0.08, 0, 0, 7), ctx.fillStyle = "rgba(74,52,66,0.18)", ctx.fill();
  let s = (compact ? Math.min(aw / 50, ah / 46) : Math.min(aw / 54, ah / 56)) * (T.place === "path" ? 1.15 : 1);
  ctx.translate(ax + aw / 2, ay + ah * (compact ? 0.72 : 0.62)), ctx.scale(s, s), drawTower(ctx, type, opt.still ? 0 : S.t, null), ctx.restore(), rr(ctx, ax, ay, aw, ah, r * 0.6), ctx.lineWidth = 1.6, ctx.strokeStyle = "rgba(74,52,66,0.55)", ctx.stroke();
  let by = ay + ah + (compact ? 2 : 3), bh = compact ? 12 : Math.max(14, h * 0.16);
  rr(ctx, x + m * 0.6, by, w - m * 1.2, bh, bh * 0.4), ctx.fillStyle = shade(T.color, -0.15), ctx.fill(), ctx.lineWidth = 1.6, ctx.strokeStyle = INK, ctx.stroke(), fitText(T.short || T.name, x + w / 2, by + bh / 2 + 0.5, w - m * 2 - 4, Math.min(14, bh * 0.78), "#fff");
  let py = by + bh + (y + h - by - bh) / 2, n = MAX_CARD_LEVEL, gap = Math.min(7, (w - 2 * m - 6) / n);
  if (!compact) for (let i = 0; i < n; i++)
    ctx.beginPath(), ctx.arc(x + w / 2 - (n - 1) * gap / 2 + i * gap, py, Math.max(1.6, gap * 0.32), 0, 7), ctx.fillStyle = i < L ? "#fff6c0" : "rgba(74,52,66,0.25)", ctx.fill();
  let bs = Math.max(10, w * 0.15);
  if (blob(ctx, x + bs * 0.75, y + bs * 0.75, bs, bs * 0.92, "#ffe36e", 2), text(ctx, "L" + L, x + bs * 0.75, y + bs * 0.75 + 0.5, bs * 0.92, "#7a4a2a", "center", null), opt.tag && !opt.badge) {
    let tag = T.place === "path" ? "on trail" : T.targets === "air" ? "air only" : type === "laser" ? "gnd+air" : "";
    tag && text(ctx, tag, ax + aw - 3, ay + 8, 8.5, "#fff", "right");
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
  opt.fresh && (rr(ctx, x + w / 2 - 17, y - 9, 34, 17, 8), ctx.fillStyle = "#ffd45e", ctx.fill(), ctx.lineWidth = 2, ctx.strokeStyle = INK, ctx.stroke(), text(ctx, "NEW", x + w / 2, y - 0.5, 10, "#fff")), ctx.restore();
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
  panel(12, 12, 376, 636, "#fff6ee"), text(ctx, "Cards", 200, 36, 26, "#b5d8ff"), coinIcon(ctx, 304, 60, 1), text(ctx, String(S.save.coins), 336, 61, 15, "#ffd45e"), plainText("Tap a card: stats.  Tap again: open.", 28, 60, 11.5, "#7a5a6a", "left", "600"), S.layoutMerge = [], ALL_CARDS.forEach((id, k) => {
    let col = k % 4, row = Math.floor(k / 4), x = 30 + col * 88, y = 80 + row * 104, w = 76, h = 96, c = S.save.cards[id], ready = c.unlocked && mergeReady(S.save, id);
    drawCardPic(x, y, w, h, id, { locked: !c.unlocked, lockText: "Shop or prize", level: c.level, selected: S.cardsSel === id, mergeReady: ready, fresh: c.fresh }), button("card" + id, x, y, w, h, () => {
      S.cardsSel === id && c.unlocked ? openCardView(id) : S.cardsSel = id, sfx("tap");
    }), ready && S.layoutMerge.push(id);
  }), cardInfoPanel(S.cardsSel, 24, 490, 352, 98, { hint: "Tap a card to see its stats.", noFoot: !0 });
  let anyReady = anyMergeReady(S.save);
  if (!!(S.cardsSel && S.save.cards[S.cardsSel].unlocked)) {
    let ready = mergeReady(S.save, S.cardsSel);
    drawButton(24, 604, 172, 34, ready ? "Open card  !" : "Open card", ready ? "#ff9ec0" : "#d7e8ff", { size: 15, r: 12 }), button("open" + S.cardsSel, 24, 590, 172, 58, () => openCardView(S.cardsSel));
  }
  if (drawButton(204, 604, 172, 34, "Merge all", anyReady ? "#ff9ec0" : "#e6dce2", { size: 15, r: 12, disabled: !anyReady }), button("mergeAll", 204, 590, 172, 58, doMergeAll), S.mergeAnim) renderMergeAnim();
  else if (S.save.onboard && S.save.onboard.cardsHint === "cards" && S.save.cards.zapper.unlocked) {
    let k = ALL_CARDS.indexOf("zapper"), x = 30 + k % 4 * 88, y = 80 + Math.floor(k / 4) * 104;
    onboardSpot(
      { x, y, w: 76, h: 96, r: 12 },
      "cardzapper",
      () => {
        S.save.onboard.cardsHint = "done", persist(), openCardView("zapper");
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
function renderCardView() {
  let id = S.cardView, T = TOWERS[id], c = S.save.cards[id];
  panel(12, 12, 376, 636, "#fff6ee"), text(ctx, T.name, 200, 36, 24, "#b5d8ff"), drawButton(22, 18, 66, 28, "Back", "#d9cfe0", { size: 13, r: 10 }), button("cvBack", 14, 8, 84, 48, () => go("cards")), drawCardPic(28, 58, 104, 136, id, { level: c.level, locked: !c.unlocked }), plainText(c.unlocked ? `In battle: level ${c.level}` : "Not unlocked yet", 146, 76, 15, INFO_INK, "left", "800"), plainText("3 cards of a level \u2192 1 of the next", 146, 102, 12, INFO_SOFT, "left", "600"), plainText("Your highest level fights.", 146, 120, 12, INFO_SOFT, "left", "600"), plainText(`Cards held: ${totalCards(c)}`, 146, 138, 12, INFO_SOFT, "left", "600"), coinIcon(ctx, 158, 170, 1), text(ctx, String(S.save.coins), 190, 171, 15, "#ffd45e");
  let rows = mergeRows(S.save, id);
  plainText("Your cards by level", 28, 212, 12, "#3d2a36", "left", "800"), rows.forEach((r, k) => {
    let col = k % 5, row = Math.floor(k / 5), x = 26 + col * 70, y = 224 + row * 138, w = 62, h = 80;
    if (drawCardPic(x, y, w, h, id, { level: r.L, count: r.have, dim: r.have === 0, still: !0 }), r.maxed) {
      plainText("top level", x + w / 2, y + h + 16, 11, "#c9962a", "center", "700");
      return;
    }
    let can = canMergeAt(S.save, id, r.L);
    plainFit(`${Math.min(r.have, r.need)}/${r.need}`, x + w / 2, y + h + 9, w, 10.5, r.ready ? "#2f8a36" : "#a08090", "center", "700"), drawButton(x, y + h + 17, w, 24, `\u2192 L${r.to}`, can ? "#ff9ec0" : "#e6dce2", { size: 12, r: 9, disabled: !can }), r.coins && plainFit(`${r.coins} coins`, x + w / 2, y + h + 50, w, 10, "#c9962a", "center", "700"), button("mrg" + r.L, x - 3, y + h + 2, w + 6, 58, () => {
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
  drawButton(24, 604, 352, 34, "Merge all", ready ? "#ff9ec0" : "#e6dce2", { size: 15, r: 12, disabled: !anyMergeReady(S.save) }), button("cvMergeAll", 24, 591, 352, 57, doMergeAll), S.mergeAnim && renderMergeAnim();
}
function renderMergeAnim() {
  let MA = S.mergeAnim;
  MA.t += 1 / 60;
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
  panel(12, 12, 376, 636, "#fff6ee"), text(ctx, "Shop", 200, 36, 28, "#ffd27a"), panel(62, 56, 132, 32, "#e6f5ff", 16), diamondIcon(ctx, 84, 72, 1), text(ctx, String(S.save.diamonds || 0), 140, 73, 17, "#7fd3ff"), panel(206, 56, 132, 32, "#fff1d6", 16), coinIcon(ctx, 228, 72, 1.1), text(ctx, String(S.save.coins), 284, 73, 17, "#ffd45e"), plainText("No real money, ever. Diamonds come from Daily Rewards.", 200, 101, 11, "#a08090", "center", "600"), panel(26, 112, 348, 62, "#ffe9f0", 14);
  for (let k = 0; k < 3; k++)
    ctx.save(), ctx.translate(58 + k * 14, 146 - k * 3), ctx.rotate(-0.2 + k * 0.2), rr(ctx, -14, -20, 28, 38, 6), ctx.fillStyle = ["#ffb3c1", "#b5d8ff", "#ffd27a"][k], ctx.fill(), ctx.lineWidth = 2, ctx.strokeStyle = INK, ctx.stroke(), text(ctx, "?", 0, 0, 16), ctx.restore();
  let gift = zapperGiftPending(S.save);
  if (gift)
    text(ctx, `FREE pack: ${E.cardPackSize} cards!`, 112, 132, 14, "#e0607e", "left", null), text(ctx, `${E.cardPackSize - 1} random + Zapper`, 112, 152, 11, "#a08090", "left", null), drawButton(290, 122, 74, 40, "FREE", "#9fe0b5", { size: 17 });
  else {
    text(ctx, `Card pack: ${E.cardPackSize} random cards`, 112, 132, 13, "#7a4a5a", "left", null);
    {
      let left = Math.max(1, (E.packPity || 0) - (S.save.packsSinceNew || 0));
      plainFit(lockedCards(S.save).length ? `level 1, ${Math.round(E.packNewTowerChance * 100)}% NEW tower${E.packPity ? ` (sure in ${left})` : ""}` : "level 1, of your unlocked towers", 112, 152, 172, 11, "#a08090", "left", "700");
    }
    drawButton(290, 122, 74, 40, `${E.cardPack}c`, "#9fe0b5", { size: 15, disabled: S.save.coins < E.cardPack }), button("pack", 290, 122, 74, 40, () => {
      let got = buyPack(S.save);
      got ? (persist(), shopBought("pack", "pack", E.cardPack, "coin"), openPackReveal(got, { source: "paid", newTower: got.newTower })) : toast("Not enough coins");
    });
  }
  plainText(`Tap a card to buy: level-1 card ${E.cardL1}c, new tower 100-400c`, 30, 188, 12, "#7a5a6a", "left", "700"), ALL_CARDS.forEach((id, k) => {
    let col = k % 5, row = Math.floor(k / 5), x = 24 + col * 71, y = 200 + row * 84, w = 64, h = 62, c = S.save.cards[id], own = c.unlocked, up = unlockPrice(id), pk = shopPulse("card", id), cs = pk == null ? 1 : 1 + SHOP_FX.cardPulse * Math.sin(pk * Math.PI);
    ctx.save(), ctx.translate(x + w / 2, y + h / 2), ctx.scale(cs, cs), ctx.translate(-(x + w / 2), -(y + h / 2)), drawCardPic(x, y, w, h, id, { level: c.level, locked: !own, lockText: `Unlock ${up}c`, selected: S.shopSel === id, selCol: "#5a9fe0" }), ctx.restore(), own && countBadge(x + w - 17, y + 13, totalCards(c), pk), blob(ctx, x + 10, y + h + 10, 8, 8, S.shopSel === id ? "#5a9fe0" : "#d7e8ff", 1.6), text(ctx, "i", x + 10, y + h + 10.5, 11, "#fff"), plainText(own ? `${E.cardL1}c` : `${up}c`, x + w - 4, y + h + 10, 11.5, own ? "#c9962a" : "#e0607e", "right", "800"), button("buy" + id, x, y, w, h, () => {
      S.shopSel = id, own ? buyCard(S.save, id) ? (persist(), sfx("tap"), shopBought("card", id, E.cardL1, "coin")) : toast("Not enough coins") : buyCardUnlock(S.save, id) ? (persist(), sfx("upgrade"), shopBought("card", id, up, "coin"), queueReveal(id, 1, !0, S.t + 0.3)) : toast(`Need ${up} coins`);
    }), button("info" + id, x - 2, y + h - 2, 40, 24, () => {
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
    ctx.save(), ctx.translate(x + w / 2, y + h / 2), ctx.scale(cs, cs), ctx.translate(-(x + w / 2), -(y + h / 2)), rr(ctx, x, y, w, h, 14), ctx.fillStyle = shade(BONUSES[bt].color, 0.2), ctx.fill(), ctx.lineWidth = 2.5, ctx.strokeStyle = INK, ctx.stroke(), ctx.save(), ctx.translate(x + w / 2, y + 22), ctx.scale(1.05, 1.05), drawBonusIcon(ctx, bt, S.t), ctx.restore(), fitText(BONUSES[bt].name, x + w / 2, y + 46, w - 8, 10.5, "#fff"), ctx.restore(), countBadge(x + w - 19, y + 15, S.save.bonusStock[bt] || 0, pk), button("bbuy" + bt, x, y, w, h, () => {
      buyBonus(S.save, bt) ? (persist(), sfx("tap"), shopBought("booster", bt, E.boosterDiamonds, "diamond")) : toast(`Need ${E.boosterDiamonds} diamonds`);
    });
  }), cardInfoPanel(S.shopSel, 24, 534, 352, 108, { hint: "Tap (i) under a card to see its stats." }), gift && !S.reveal.length && !S.pack ? onboardSpot({ x: 286, y: 118, w: 82, h: 48, r: 14 }, "gift", claimGift, "Your free pack - tap it!") : !S.pack && !S.reveal.length && S.save.onboard && S.save.onboard.cardsHint === "shop" && onboardSpot(tabRect(1), "tocards", () => {
    S.save.onboard.cardsHint = "cards", persist(), go("cards");
  }, "See your new cards!"), renderUiFx(1 / 60);
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
};
function reducedMotion() {
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
    sfx("packShake");
  }), packFire("burst", PACK.shake, () => {
    sfx("pop");
  }), P.cards.forEach((cd, i) => {
    let f0 = PACK.flip0 + i * PACK.flipStep;
    packFire("flip" + i, f0, () => sfx("cardFlip")), cd.ready && packFire("merge" + i, f0 + PACK.flipDur / 2, () => sfx("upgrade"));
  });
  let lastFlipEnd = PACK.flip0 + (P.cards.length - 1) * PACK.flipStep + PACK.flipDur;
  P.newTower && packFire("beat", lastFlipEnd, () => {
    sfx("win");
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
    fitText(TOWERS[cd.id].short || TOWERS[cd.id].name, cx, ny, W2, 11, "#ffffff");
    let pk = inSummary ? 1 : Math.max(0, Math.min(1, (t - f0 - PACK.flipDur / 2) / PACK.pip));
    if (cd.maxed) plainText("MAX", cx, ny + 18, 11, "#ffe36e", "center", "800");
    else {
      let filled = Math.min(cd.need, cd.have);
      for (let p = 0; p < cd.need; p++) {
        let px = cx - 14 + p * 14, py = ny + 18, isNewPip = p === filled - 1;
        ctx.beginPath(), ctx.arc(px, py, 4.6, 0, 7), ctx.lineWidth = 1.8, ctx.strokeStyle = "#ffffff", ctx.stroke(), p < filled && (ctx.beginPath(), ctx.arc(px, py, 4.6 * (isNewPip ? pk : 1), 0, 7), ctx.fillStyle = "#ffe36e", ctx.fill());
      }
      plainText(`${Math.min(cd.have, cd.need)}/${cd.need} \u2192 L2`, cx, ny + 34, 11, "#ffe9c0", "center", "700"), cd.ready && pk >= 1 && drawMergeTag(cx, ny + 54);
    }
    cd.isNew && (ctx.save(), ctx.translate(tx + W2 - 6, ty + 8), ctx.rotate(Math.PI / 4), rr(ctx, -24, -8, 48, 16, 4), ctx.fillStyle = "#ffe36e", ctx.fill(), ctx.lineWidth = 1.8, ctx.strokeStyle = INK, ctx.stroke(), text(ctx, "NEW", 0, 0.5, 11, "#e0607e", "center", null), ctx.restore());
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
  ctx.save(), rr(ctx, cx - 30, y - 9, 60, 18, 8), ctx.fillStyle = "#55b85a", ctx.fill(), ctx.lineWidth = 1.8, ctx.strokeStyle = INK, ctx.stroke(), ctx.beginPath(), ctx.moveTo(cx - 24, y + 4), ctx.lineTo(cx - 20, y - 4), ctx.lineTo(cx - 16, y + 4), ctx.closePath(), ctx.fillStyle = "#ffffff", ctx.fill(), text(ctx, "MERGE!", cx + 5, y + 0.5, 11, "#ffffff", "center", null), ctx.restore();
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
requestAnimationFrame(frame);
