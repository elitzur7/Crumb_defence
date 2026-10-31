// v0.8.0 (v0.7.10 fold): pure UI-text helpers (no DOM) so tests can import them.
// The prep-screen sub-header shows "<level name>  -  <map name>"; when the two are the same string it is shown ONCE.
export function levelHeaderLine(level, maps) {
  const map = maps[level.map] ? maps[level.map].name : '';
  return !map || map === level.name ? level.name : `${level.name}  -  ${map}`;
}
