#!/usr/bin/env python3
# v0.4.1: measures, from the actual screenshots, (a) the on-screen map cell size and (b) each range circle's radius, in device px,
# and writes annotated images (cell grid + measured radius) to screens/v0.4.1/ranges/annotated-<tower>.png.
# Cell size: NOT the tablecloth pattern (level 1's gingham draws squares of HALF a cell). The real cell = the tower placement unit:
#   with a card selected the game tints every placeable cell; the spacing between neighbouring tinted boxes = the cell size.
# Circle radius: diff of the frame with the tower info open vs closed; pixels that turned pure white (#fff dashed ring) are ring
#   pixels; for 360 rays from the circle centre, the mean distance of the ring pixels on that ray = radius (stroke centre).
import json, math, sys, statistics as st
from PIL import Image, ImageDraw, ImageFont
D = '/workspace/ant-td/screens/v0.4.1/ranges'
meta = json.load(open(f'{D}/raw/meta.json')); dpr = meta['dpr']

def cell_size():
    # placement highlights: diff (card selected) vs (nothing selected) -> changed pixels = the tinted cell boxes.
    # For every pixel row in the map, find where boxes START (unchanged -> changed going right) and where rows of boxes start
    # (going down); the spacing between consecutive starts is the cell pitch. Returns (horizontal pitches, vertical pitches).
    on = Image.open(f"{D}/raw/cells-on.png").convert('RGB').load(); off = Image.open(f"{D}/raw/cells-off.png").convert('RGB').load()
    tf = meta['cellsTf']; x0 = int(tf['left'] * dpr); x1 = int((tf['left'] + 400 * tf['s']) * dpr) - 1
    y0 = int((tf['top'] + 68 * tf['s']) * dpr); y1 = int((tf['top'] + (68 + 480) * tf['s']) * dpr) - 1
    ch = lambda x, y: sum(abs(a - b) for a, b in zip(on[x, y], off[x, y])) > 12
    hs, vs = [], []
    for y in range(y0, y1, 3):
        starts = [x for x in range(x0 + 1, x1) if ch(x, y) and not ch(x - 1, y) and all(ch(x + k, y) for k in range(1, 30))]
        hs += [b - a for a, b in zip(starts, starts[1:])]
    for x in range(x0, x1, 3):
        starts = [y for y in range(y0 + 1, y1) if ch(x, y) and not ch(x, y - 1) and all(ch(x, y + k) for k in range(1, 30))]
        vs += [b - a for a, b in zip(starts, starts[1:])]
    return hs, vs

hs, vs = cell_size()
# keep pitches between adjacent boxes (the smallest repeating spacing); a skipped (non-placeable) cell gives 2x
base = st.median(sorted(hs + vs)[: max(1, len(hs + vs) // 2)])
adj = [g for g in hs + vs if abs(g - base) < 0.15 * base]
CELL = st.mean(adj)
print(f"map cell (placement highlights): {CELL:.2f} device px = {CELL / dpr:.2f} CSS px  (median {st.median(adj)}, {len(adj)} box-to-box spacings, dpr {dpr})")
res = []
for t in meta['towers']:
    on = Image.open(f"{D}/raw/{t['type']}-on.png").convert('RGB'); off = Image.open(f"{D}/raw/{t['type']}-off.png").convert('RGB')
    tf = t['tf']; s = tf['s'] * dpr
    cx = (tf['left'] + t['x'] * tf['s']) * dpr; cy = (tf['top'] + (68 + t['y']) * tf['s']) * dpr
    po, pf = on.load(), off.load(); W, H = on.size
    radii = []
    for k in range(360):
        a = math.radians(k); ds = []
        for d10 in range(int(25 * s * 10), int(130 * s * 10), 5):
            d = d10 / 10; x = int(round(cx + math.cos(a) * d)); y = int(round(cy + math.sin(a) * d))
            if not (0 <= x < W and 0 <= y < H): break
            p, q = po[x, y], pf[x, y]
            if min(p) >= 250 and min(q) < 235: ds.append(d)
        if ds: radii.append(st.mean(ds))
    r_dev = st.median(radii)
    cell_dev = CELL
    res.append(dict(type=t['type'], rangePx=t['rangePx'], expected_tiles=t['rangePx'] / 40, cell_dev=round(cell_dev, 2), cell_expected_dev=round(s * 40, 2),
                    radius_dev=round(r_dev, 2), rays=len(radii), measured_tiles=round(r_dev / cell_dev, 3), css_per_logical=round(tf['s'], 4)))
    # annotated copy: cell grid (from measured cell size, anchored at the map origin) + measured circle + label
    ann = on.copy(); g = ImageDraw.Draw(ann, 'RGBA')
    mx0 = tf['left'] * dpr; my0 = (tf['top'] + 68 * tf['s']) * dpr
    for c in range(11): X = mx0 + c * cell_dev; g.line([(X, my0), (X, my0 + 12 * cell_dev)], fill=(40, 90, 200, 150), width=2)
    for r in range(13): Y = my0 + r * cell_dev; g.line([(mx0, Y), (mx0 + 10 * cell_dev, Y)], fill=(40, 90, 200, 150), width=2)
    g.ellipse([cx - r_dev, cy - r_dev, cx + r_dev, cy + r_dev], outline=(230, 30, 60, 255), width=3)
    g.line([(cx, cy), (cx + r_dev, cy)], fill=(230, 30, 60, 255), width=4)
    try: f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 30)
    except Exception: f = ImageFont.load_default()
    label = f"{t['type']}: r {r_dev:.0f}px / cell {cell_dev:.0f}px = {r_dev / cell_dev:.2f} tiles (target {t['rangePx'] / 40:g})"
    g.rectangle([10, 10, W - 10, 64], fill=(255, 255, 255, 230)); g.text((24, 18), label, fill=(30, 30, 60, 255), font=f)
    ann.save(f"{D}/annotated-{t['type']}.png")
json.dump(res, open(f'{D}/measurements.json', 'w'), indent=1)
print(f"{'tower':10} {'range(px logical)':>17} {'target':>6} {'cell dev px':>11} {'radius dev px':>13} {'tiles':>6} rays")
for r in res: print(f"{r['type']:10} {r['rangePx']:>17} {r['expected_tiles']:>6g} {r['cell_dev']:>11} {r['radius_dev']:>13} {r['measured_tiles']:>6} {r['rays']}")
