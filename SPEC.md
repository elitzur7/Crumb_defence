# Ant Tower Defense - Design Spec (from Yair, voice call 2026-10-19 ~02:00)
Status: Yair approved starting development overnight IF no substantive open questions. Research first (Raid Rush + similar).
Title: "Crumb Defense" (chosen by Yair 2026-10-19). Store-name availability not yet verified.

## Theme / Art
- Ants raid food in a kitchen (cookie, bread - not ice cream). Ants = attacking troops; food = HQ to defend.
- Art is a major part: cute, funny, soft, painted look - closer to Rush Royale than Raid Rush. Humorous gear on ants (helmets, armor, gas masks).

## Core mechanic
- Like Raid Rush mechanically: ants advance along a path toward the food; player places defenses along it.

## Defenses (towers)
1. Slingshot - single-target shots, one by one.
2. Spray - gas cloud area (like gas/poison towers).
3. Sound effect - circular pulse area around it (like the "magnetometer"-type tower in Raid Rush).
4. Rolling ball - rolls and crushes ants (exists in Raid Rush).
5. Fan - blows ants back off the path.
6. Pheromones - lures/slows ants, drains some energy (placeable like a weapon).
7. Lizard - placed at side; tongue lashes out; damages strong ants, only collects/eats after it kills them (multiple hits for big ants).
8. Laser - like slingshot but faster/stronger; hits ground AND flying ants.
9. Anti-air-only tower - TBD (ideas: bird diving on flyers; simple shooter without path change is preferred for animation simplicity).
Obstacles: Glue (slows), Electric gate (two poles, arc between them; ants passing lose energy/burn a bit).

## Ants (7 types, each with unique traits)
Small (fast, big groups, weak), Regular, Big (slow, more defense), Gas-mask (immune to spray), Armored (much higher defense), Winged/flying (fast; flies over ground towers like ball/spray - only laser + anti-air can hit), Queen (boss, marches in). Optional: helmet ants. HP model e.g. regular = 10 HP; each weapon has its own damage.

## Upgrades
- Parameters: range, fire rate, size (not all apply; e.g. ball size grows; slingshot/fan stay same size). Spray and electrode pulse, so rate matters.
- In-battle (live): upgrade rate (and possibly power); exact form TBD.
- Out-of-battle: coins earned per battle; buy cards; merge cards: 3 same cards = Level 1; 2 x L(n) = L(n+1); 10 levels total.

## Pre-battle
- Loadout of 5 from the full pool (towers + obstacles count).

## Battle management
- From the 5-card deck, 3 visible slots at any time, random draw WITH replacement (duplicates possible, e.g. laser + 2 electric gates). Use one -> a new random one replaces it. Strategy: wait for a better pick.

## Bonuses (global weapons/boosters)
- Ideas: bomb that wipes everything on screen; plane that sprays the whole field from above; + at least 1 more, and 2-3 more types because players will accumulate many over 40-60 battles.
- Obtained as rewards (preferred) or bought with coins.
- Pre-battle: choose only 2-3 bonus types to bring. Max 2 bonus uses per battle.

## Levels
- First build: 10 levels, increasing difficulty. Later: 100 levels = 10 worlds x 10 levels.

## Standing rules for delivery
- Independent QA by a separate check; independent malware audit before Yair installs any build.
- Deliver APK via Google Drive (in-chat attachments don't download on his phone; Gmail blocks APK).

## DECISIONS (Yair, 2026-10-19 07:42) - research report: /workspace/td-research/report.md section 4
Accepted research recommendations (report §4) EXCEPT these overrides:
- In-battle currency "crumbs" earned per kill. Basic ant = 1; other types worth more, proportional to their power/HP ratio vs basic.
- Card cost escalates: first card placed costs 5, each subsequent card +5 (5, 10, 15...).
- Food has 100 HP; regular ant steals 1. Thief ants carry food back to the nest; killing a carrier on the way back returns the food (Lumi proposal, pending Yair confirmation - keep configurable).
- Stars: by % food remaining (3* >=90, 2* >=50, 1* >0) - configurable.
- Out-of-battle merge: Yair's formula (3 copies = L1, 2x Ln = Ln+1, max L10) vs flattened curve still UNDECIDED. Implement as a data table; default to Yair's formula.
Accepted as recommended: duplicate card on same tower = in-battle upgrade (max 3); fixed path + free side placement (glue/pheromone/gate on path, lizard side only); armor subtract (min 1), sound+gate ignore armor, spray DoT, gas-mask immune; flyers only hit by laser/anti-air/plane; deck warning if no anti-air; anti-air = bug-zapper turret; starter 5 = slingshot, spray, glue, fan, ball, unlock one per level; bonuses bomb, crop-duster plane, freezer 4s, sugar decoy, bring 2 types, 2 uses; 10 levels, call-wave-early button, queen in level 10; no monetization.
- UPDATE 07:45: Card cost sequence starts at 0: 1st card free, then 5, 10, 15... (+5 each).
- Exactly TWO currencies: (1) Crumbs = in-battle only, earned from kills, spent on cards, reset to 0 / discarded when battle ends. (2) Coins = persistent meta currency earned after battles, spent on cards/bonuses out of battle. No third currency (no gems) in v0.1.

## ART DIRECTION (Yair, voice 2026-10-19 08:20)
- Animation and the shapes of ants and towers are very important for success. Size ratios between units must look sensible.
- Final art must reach real game quality (not prototype). Not urgent now: infrastructure first; priority visual work = animation + unit shapes.
- Ants v0.1 judged "a bit ugly" -> redesign cuter (in progress).
- Perf note: HP bars drawn only on damaged ants, 2 small rounded rects each; ant bodies are pre-rendered cached sprites. Considered cheap; not yet measured on a real device.
