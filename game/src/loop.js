// Crumb Defense - the battle's frame stepper (v0.7.4 M0). Pure logic (no DOM), so tests can drive it with a fake clock.
//
// Speed = the NUMBER of fixed sub-steps per frame, never a bigger step: 1x = one `STEP` (1/60 s) per 60 Hz frame, 2x = two, 4x = four.
// Physics, cooldowns, spawns, projectiles and the swatter all see the same dt = 1/60 at every speed, so the sim result does not depend on the speed.
export const STEP = 1 / 60;
export const SPEEDS = [1, 2, 4];
export const FRAME_BUDGET_MS = 10;   // per-frame guard: stop stepping once the loop has used this much wall time ...
export const ACC_CAP_STEPS = 8;      // ... and drop the backlog beyond this many steps (a slow phone slows the game down instead of freezing)
export const MAX_FRAME_DT = 0.1;     // a hitch frame counts as at most 0.1 s of real time (as before v0.7.4)

export const nextSpeed = (s) => SPEEDS[(Math.max(0, SPEEDS.indexOf(s)) + 1) % SPEEDS.length];
// a battle starts at `max` (config UI.speedMaxAtStart, 2) at most
export const startSpeed = (s, max = 2) => Math.min(SPEEDS.includes(s) ? s : 1, max);

export function newClock() { return { acc: 0 }; }
/**
 * Advances the battle by one rendered frame.
 *   clk: { acc } accumulator (battle seconds waiting to be stepped)
 *   dtReal: real seconds since the last frame; speed: 1 | 2 | 4
 *   stepFn(STEP) -> truthy when the battle is over (stepping stops at once)
 *   opts.now: () => ms clock for the budget guard (default none = no guard; tests use a fake clock)
 * Returns the number of sub-steps executed.
 */
export function advanceFrame(clk, dtReal, speed, stepFn, opts = {}) {
  const dt = Math.min(MAX_FRAME_DT, Math.max(0, dtReal));
  clk.acc += dt * speed;
  const t0 = opts.now ? opts.now() : 0, budget = opts.budgetMs ?? FRAME_BUDGET_MS;
  let n = 0;
  while (clk.acc >= STEP - 1e-9) {
    const over = stepFn(STEP); clk.acc -= STEP; n++;
    if (over) { clk.acc = 0; break; }
    if (opts.now && n < 64 && opts.now() - t0 > budget) { clk.acc = Math.min(clk.acc, ACC_CAP_STEPS * STEP); clk.guarded = (clk.guarded || 0) + 1; break; }
  }
  if (clk.acc < 0) clk.acc = 0;
  return n;
}
