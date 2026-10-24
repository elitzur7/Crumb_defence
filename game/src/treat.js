// v0.4 item 18: the treat reacts with funny ANIMATED faces while ants eat it.
// ONE scheme for every world's treat: the cookie defines the behaviour; a cake (or any later treat) only swaps the body
// drawing (art.js TREAT_BODIES) and reuses exactly these rules and the same face set (art.js drawTreatFace).
// Pure logic, no drawing - unit-tested in tests/v040.test.js.
import * as C from './config.js';

export const TREAT_REACTIONS = ['surprised', 'oyoy', 'sad', 'crying'];
export function newTreatState() { return { face: null, start: -1e9, until: -1e9, bites: [], count: 0 }; }

// Which reaction a bite triggers:
//   first bite of the battle            -> 'surprised'  (eyes pop, little jump)
//   a big bite (>= bigBite food, queen) -> 'crying'     (tears stream, sobbing)
//   >= rushBites bites within rushWindow -> 'oyoy'      ("they're eating me - oy oy oy!", shaking)
//   otherwise it alternates surprised / sad / oyoy so the cookie never repeats itself for long.
export function pickReaction(st, now, n = 1, R = C.UI.treatReact) {
  if (st.count === 0) return 'surprised';
  if (n >= R.bigBite) return 'crying';
  const recent = st.bites.filter((t) => now - t <= R.rushWindow).length + 1;
  if (recent >= R.rushBites) return 'oyoy';
  return ['surprised', 'sad', 'oyoy'][st.count % 3];
}
// Register a bite (the battle's 'steal' event). Returns the face now playing.
export function onBite(st, now, n = 1, R = C.UI.treatReact) {
  const face = pickReaction(st, now, n, R);
  const active = now < st.until;
  // the same reaction already playing just runs longer (no restart flicker); a different one starts fresh
  if (!(active && st.face === face)) st.start = now;
  st.face = face; st.until = now + R.time;
  st.bites = [...st.bites.filter((t) => now - t <= R.rushWindow), now];
  st.count++;
  return face;
}
// The reaction to draw now ({ face, age } with age in seconds), or null when the treat shows its mood face.
export function reaction(st, now) { return st && st.face && now < st.until ? { face: st.face, age: now - st.start } : null; }
