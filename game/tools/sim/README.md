# Crumb Design sim harness (copy of what produced the v0.8.2 numbers)
Scratch tooling, not shipped code. Provisional: the player is the bot proxy.
- `specials-hooks-sim.js.diff` — the ability hooks I added to `game/src/sim.js` of f6b154f (env `ABIL`, `AP`). **The diff is the exact semantics behind plan §3.0**; implement the specs of M7a–f, not the env switches.
- `modexp.mjs <dir> <profile.json> <out.json>` — env: `MODE=bot TR SPT LEVELS=a-b OVR=<json {level:{hpMul}}> ABIL=ric,burn,pounce,cres,static AP=<json> ANTOVR=<json {ant:{field:value}}>`. `<dir>` holds a copy of the repo (`<dir>/game/src`).
- `runjobs.py jobs.json 7` — runs a job list in parallel; `w6round.py`, `w6agg.py`, `secant.py` — one W6 calibration round / aggregate / next hp by logit-linear secant.
- `coins.mjs <dir> <profile> <L1> <L2> <seeds> <TR>` — replay coins per win (EC1/EC9); `runcoins.py` — W6 run.
- Profiles: `prof-w6.json` (W6, 36 trajectories, derived), `prof-w5-v2.json` (W5, 36), `profiles-W4-v2.json` (W4, 99).
- `mkw6.py` — how the W6 data was assembled from the W5 slots (also the substitutions of plan §4.2).
Paired seeds: `1000 + t*101 + s*7919`. 540 battles per level = 36 trajectories x 15 seeds.

## In the repo (v0.8.2 QA7)
Copied to `game/tools/sim/`. `<dir>` may be `.` when run from `game/` (the scripts read `<dir>/src`, or `<dir>/game/src` for a repo copy).
Example: `LEVELS=45-45 TR=4 SPT=2 node tools/sim/modexp.mjs . tools/sim/prof-w5-v2.json /tmp/out.json` prints the win rate. W6: `LEVELS=55-55 ... tools/sim/prof-w6.json`.
**Bot proxy, provisional:** every win % is the smart bot on 36 trajectories, not a human. `w6-data.json` is Crumb Design's W6 data (the source of `tuning.json` levels 51-60).
