// v0.8.2 X4: colour-blind simulation (Machado 2009, severity 1.0) of the ground/trail colours of W1-W6; DeltaE76 between neighbouring worlds. usage: node x4-cb.mjs <out.json> <out.png>
import * as C from '../../src/config.js'; import * as A from '../../src/art.js'; import fs from 'node:fs'; import { execFileSync } from 'node:child_process';
const hx = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }, gam = (v) => { v = Math.min(1, Math.max(0, v)); return 255 * (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055); };
const MAT = { deut: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.011820, 0.042940, 0.968881]], prot: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]] };
const sim = (rgb, k) => { if (k === 'norm') return rgb; const l = rgb.map(lin); return MAT[k].map((r) => gam(r[0] * l[0] + r[1] * l[1] + r[2] * l[2])); };
const lab = (rgb) => { const [r, g, b] = rgb.map(lin); const X = (0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047, Y = 0.2126 * r + 0.7152 * g + 0.0722 * b, Z = (0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883; const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116); return [116 * f(Y) - 16, 500 * (f(X) - f(Y)), 200 * (f(Y) - f(Z))]; };
const dE = (a, b) => Math.hypot(...lab(a).map((v, i) => v - lab(b)[i]));
const mapTheme = (i) => C.MAPS ? C.MAPS[C.LEVELS[i].map].theme : 0;
const worlds = []; for (let w = 1; w <= 6; w++) { const set = [...new Set(Array.from({ length: 10 }, (_, k) => mapTheme((w - 1) * 10 + k)))]; for (const t of set) { const th = A.THEMES[t]; worlds.push({ w, theme: t, name: th.name, a: th.a, trail: th.trail }); } }
const out = { worlds, pairs: [] };
for (const k of ['norm', 'deut', 'prot']) for (let w = 1; w < 6; w++) { const X = worlds.filter((q) => q.w === w), Y = worlds.filter((q) => q.w === w + 1); let min = 1e9, pair = ''; for (const x of X) for (const y of Y) { const d = dE(sim(hx(x.a), k), sim(hx(y.a), k)); if (d < min) { min = d; pair = `${x.name}|${y.name}`; } } out.pairs.push({ view: k, pair: `W${w}-W${w + 1}`, minGroundDE: +min.toFixed(1), closest: pair }); }
fs.writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
// contact sheet via PIL: rows = normal/deut/prot, columns = W1..W6 (ground swatch with a trail stripe)
const py = `
from PIL import Image, ImageDraw
import json,sys
d=json.load(open(sys.argv[1])); MAT=${JSON.stringify(MAT)}
def lin(v): v/=255; return v/12.92 if v<=0.04045 else ((v+0.055)/1.055)**2.4
def gam(v): v=min(1,max(0,v)); return 255*(12.92*v if v<=0.0031308 else 1.055*v**(1/2.4)-0.055)
def sim(c,k):
    if k=='norm': return c
    l=[lin(x) for x in c]; return tuple(round(gam(sum(m*q for m,q in zip(r,l)))) for r in MAT[k])
def hx(c): return tuple(int(c[i:i+2],16) for i in (1,3,5))
n=len(d['worlds']); im=Image.new('RGB',(n*120+20,3*100+20),(255,255,255)); dr=ImageDraw.Draw(im)
for r,k in enumerate(['norm','deut','prot']):
    for c,w in enumerate(d['worlds']):
        x=10+c*120; y=10+r*100; dr.rectangle([x,y,x+110,y+90],fill=sim(hx(w['a']),k)); dr.rectangle([x+10,y+35,x+100,y+55],fill=sim(hx(w['trail']),k)); dr.text((x+6,y+4),'W%d %s %s'%(w['w'],w['name'][:8],k),fill=(60,40,50))
im.save(sys.argv[2])`;
fs.writeFileSync('/tmp/x4sheet.py', py); execFileSync('python3', ['/tmp/x4sheet.py', process.argv[2], process.argv[3]]);
console.log(JSON.stringify(out.pairs));
