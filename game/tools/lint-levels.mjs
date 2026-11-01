// v0.8.2 QA6: level-data lint. lintLevels({ LEVELS, ANTS, WORLDS, TUNING }) -> array of 'QA6 rule N: ...' strings (empty = clean). Runs in npm test (tests/v082.test.js) on every build.
export const MAX_ANT_TYPES = 5;
export function lintLevels({ LEVELS, ANTS, WORLDS, TUNING, wavesOf }) { // wavesOf(i) = the generated wave tables (sim.generateWaves); explicit level.waves is used when present
  const out = [];
  LEVELS.forEach((L, i) => {
    const tag = `L${i + 1}`; const types = new Set();
    const waves = wavesOf ? wavesOf(i) : L.waves || [];
    for (const wave of waves) for (const g of wave) { types.add(g.type); if (!ANTS[g.type]) out.push(`QA6 rule 2: ${tag} spawns unknown ant type '${g.type}'`); }
    if (types.size > MAX_ANT_TYPES) out.push(`QA6 rule 1: ${tag} has ${types.size} ant types (max ${MAX_ANT_TYPES}): ${[...types].join(',')}`);
    for (const t of types) if (ANTS[t] && ANTS[t].flying && ANTS[t].armor > 2) out.push(`QA6 rule 3: ${tag} flying ant '${t}' has armor ${ANTS[t].armor} (> 2)`);
    if (L.world >= 6 && TUNING && TUNING.specials === false) out.push(`QA6 rule 4: ${tag} is in world ${L.world} but tuning.specials is false`);
    if (!(L.hpMul > 0)) out.push(`QA6 rule 5: ${tag} hpMul ${L.hpMul} is not > 0`);
    if (L.waveCount !== waves.length) out.push(`QA6 rule 5: ${tag} waveCount ${L.waveCount} != ${waves.length} wave tables`);
  });
  const ids = new Set(WORLDS.map((w) => w.id));
  for (const w of WORLDS) {
    if (!w.unlock || w.id === 1) continue;
    const prev = w.unlock.allLevelsWonInWorld;
    if (!ids.has(prev) || prev >= w.id) out.push(`QA6 rule 6: world ${w.id} gate references missing/invalid previous world ${prev}`);
    if (w.unlock.minStarsInWorld > 3 * 10) out.push(`QA6 rule 6: world ${w.id} gate needs ${w.unlock.minStarsInWorld} stars, a world only has ${3 * 10}`);
  }
  return out;
}
