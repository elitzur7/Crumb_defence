// Shared helpers for the tuning JSON <-> CSV scripts (no dependencies).
export const csvCell = (v) => {
  if (v === undefined) return '';
  const s = typeof v === 'string' ? v : JSON.stringify(v);
  return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
};
export const toCsv = (cols, rows) => [cols.join(','), ...rows.map((r) => cols.map((c) => csvCell(r[c])).join(','))].join('\n') + '\n';
export function parseCsv(text) {
  const rows = []; let row = []; let cell = ''; let q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) { if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += ch; continue; }
    if (ch === '"') q = true;
    else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; }
    else cell += ch;
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
  const head = rows.shift().map((h) => h.trim());
  return rows.filter((r) => r.some((c) => c.trim() !== '')).map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ''])));
}
// '' = key absent; 'null' = null; numbers/booleans/arrays/objects = JSON; anything else = plain text
export function cellValue(s) {
  const t = s.trim(); if (t === '') return undefined;
  try { return JSON.parse(t); } catch { return t; }
}
// columns starting with "_" are computed / read-only and are ignored on import
export const editable = (col) => !col.startsWith('_');
// stable, readable JSON: small objects/arrays on one line
export function prettyJson(v, ind = '') {
  const flat = JSON.stringify(v);
  if (v === null || typeof v !== 'object' || flat.length <= 110) return flat;
  const nx = ind + '  ';
  if (Array.isArray(v)) return '[\n' + v.map((x) => nx + prettyJson(x, nx)).join(',\n') + '\n' + ind + ']';
  return '{\n' + Object.entries(v).map(([k, x]) => nx + JSON.stringify(k) + ': ' + prettyJson(x, nx)).join(',\n') + '\n' + ind + '}';
}
