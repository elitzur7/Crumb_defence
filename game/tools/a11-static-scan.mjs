// v0.7.6 A11 static scan: every text-drawing call in src/ whose size argument contains a literal < 12 (4..11.99). Usage: node tools/a11-static-scan.mjs [srcDir]
import fs from 'node:fs';
const dir = process.argv[2] || 'src';
const FN = { text: 4, fitText: 4, wrapText: 4, plainText: 3, plainFit: 4, plainWrap: 2, wrapLines: 2, plainFitWrap: 4 };
let n = 0;
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.js'))) {
  const s = fs.readFileSync(`${dir}/${f}`, 'utf8');
  const re = /(?<![\w.])(?:A\.)?(text|fitText|wrapText|plainText|plainFit|plainWrap|wrapLines)\(/g; let m;
  while ((m = re.exec(s))) {
    let i = m.index + m[0].length, d = 1, args = [], cur = '', q = null;
    for (; i < s.length && d > 0; i++) { const c = s[i];
      if (q) { cur += c; if (c === q && s[i - 1] !== '\\') q = null; continue; }
      if (c === "'" || c === '"' || c === '`') { q = c; cur += c; continue; }
      if ('([{'.includes(c)) d++; if (')]}'.includes(c)) { d--; if (d === 0) break; }
      if (c === ',' && d === 1) { args.push(cur.trim()); cur = ''; } else cur += c; }
    args.push(cur.trim());
    const idx = FN[m[1]]; if (args.length <= idx) continue; const a = args[idx];
    if (/^\d+(\.\d+)?$/.test(a) ? +a < 12 : /\b(?:[4-9]|1[01])(?:\.\d+)?\b/.test(a)) { const line = s.slice(0, m.index).split('\n').length; console.log(`${f}:${line} ${m[1]} size=${a.slice(0, 60)} text=${args[m[1] === 'plainWrap' || m[1] === 'wrapLines' ? 0 : 1].slice(0, 50)}`); n++; }
  }
}
console.log(`${n} site(s) with a size < 12`);
