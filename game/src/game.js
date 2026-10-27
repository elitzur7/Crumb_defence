// Crumb Defense - app shell: screens, input, rendering of battle & menus.
import * as C from './config.js';
import { Battle, levelAntTypes, towerStat, upgradeDiff, formatStat, statLabel, cardUpgradeDiff, upgradeGain, worldCardLevelCap } from './sim.js';
import * as Cal from './calendar.js';
import * as M from './meta.js';
import * as A from './art.js';
import { initAudio, sfx, setMuted } from './audio.js';
import { smartBotStep } from './bot.js';
import { addFloatText } from './fx.js';
import * as Treat from './treat.js';

const W = 400, H = 720, MAP_Y = 68, MAP_W = C.GRID_COLS * C.TILE, MAP_H = C.GRID_ROWS * C.TILE, TRAY_Y = MAP_Y + MAP_H + 4;
const BG = '#fbe9dc';
const canvas = document.getElementById('game');
let ctx = canvas.getContext('2d'); // let: the v0.7 pack reveal pre-renders card faces by pointing ctx at an offscreen canvas for a moment
let dpr = 1, scale = 1, offX = 0, offY = 0, pxRatio = 1;

const storage = (() => { try { localStorage.setItem('__t', '1'); localStorage.removeItem('__t'); return localStorage; } catch (e) { const m = {}; return { getItem: (k) => m[k] ?? null, setItem: (k, v) => { m[k] = String(v); } }; } })();
const S = {
  screen: 'map', save: M.loadSave(storage), battle: null, levelIndex: 0, t: 0,
  prep: { deck: [], bonuses: [] }, sel: null, drag: null, info: null, speed: 1, paused: false, result: null,
  toast: null, fx: [], ui: [], bgCache: {}, cardsSel: null, confirmReset: 0, autoBot: false, shopMsg: null, crumbShake: 0, crumbPulse: 0, slotFlip: [0, 0, 0], mergeAnim: null, prepAlert: null,
  dialog: null, cal: null, cookieOuch: 0, clockOffset: 0, treat: Treat.newTreatState(),
  // v0.5: map scroll (item 13), per-card screen (items 6/7), NEW CARD reveals (item 7), Move/Swap mode (items 11/12),
  // fireworks (item 16), shop purchase animation (item 8)
  mapScroll: 0, cardView: null, reveal: [], pack: null, mode: null, fireworks: { rockets: [], parts: [], queue: [] }, shopFx: null, shopSel: null, queenDown: null,
};
if (S.save.settings && S.save.settings.muted) setMuted(true);
function persist() { M.writeSave(storage, S.save); }
// wall clock (tests may shift it through the local-only test hook)
function now() { return Date.now() + S.clockOffset; }
// Reward Calendar: "in the game" heartbeat (start-up, resume, every CALENDAR.heartbeatSec while visible) + popup on entering
let lastBeat = -1e9;
function heartbeat(force) { if (!force && S.t - lastBeat < C.CALENDAR.heartbeatSec) return; lastBeat = S.t; Cal.touch(S.save, now()); persist(); }
// pops up by itself once per calendar day (on entering the game / the map) while today's prize is waiting;
// after "Later" the glowing Calendar button on the map is the way back in
let calAutoDay = null;
function maybeShowCalendar() {
  if (S.screen !== 'map' || S.cal || !Cal.canClaim(S.save, now())) return;
  const d = Cal.dayNumber(now()); if (calAutoDay === d) return;
  calAutoDay = d; openCalendar();
}
function openCalendar() { S.cal = { t: 0, result: null }; sfx('tap'); }
function setPaused(v) { S.paused = v; if (S.battle) S.battle.paused = v; if (v) { S.sel = null; S.drag = null; S.info = null; S.mode = null; } }

// ---------------- layout / resize ----------------
// v0.7.2 C16: the meta screens (map, cards, card detail, shop) sit above a fixed bottom tab bar (Map / Cards / Shop). The bar is 56 dp tall plus the
// bottom safe-area inset (env(safe-area-inset-bottom), read through a hidden probe element). Their design height is 660 instead of 720; every other
// screen (prep, battle, results, overlays) keeps W x H = 400 x 720 over the full window.
const META_SCREENS = ['map', 'cards', 'card', 'shop'], BAR_H = 56, META_H = 660;
let cw = 0, ch = 0, insetB = 0, insetProbe = null, insetOverride = null; // insetOverride: test hook only
function readInset() {
  if (insetOverride != null) return insetOverride;
  try {
    if (!insetProbe) { insetProbe = document.createElement('div'); insetProbe.style.cssText = 'position:fixed;left:0;bottom:0;width:0;height:0;visibility:hidden;pointer-events:none;padding-bottom:env(safe-area-inset-bottom,0px)'; document.body.appendChild(insetProbe); }
    const v = parseFloat(getComputedStyle(insetProbe).paddingBottom); return isFinite(v) && v > 0 ? v : 0;
  } catch (e) { return 0; }
}
function isMeta() { return META_SCREENS.includes(S.screen); }
function applyLayout() {
  if (isMeta()) {
    const availH = Math.max(100, ch - (BAR_H + insetB));
    scale = Math.min(cw / W, availH / META_H); offX = (cw - W * scale) / 2; offY = (availH - META_H * scale) / 2;
  } else { scale = Math.min(cw / W, ch / H); offX = (cw - W * scale) / 2; offY = (ch - H * scale) / 2; }
  const px = Math.max(1, Math.round(dpr * scale * 2) / 2);
  if (px !== pxRatio) { pxRatio = px; S.bgCache = {}; A.clearTowerCache(); } // sprites are baked at the device scale
}
function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 3);
  cw = window.innerWidth; ch = window.innerHeight; insetB = readInset();
  canvas.width = Math.round(cw * dpr); canvas.height = Math.round(ch * dpr);
  canvas.style.width = cw + 'px'; canvas.style.height = ch + 'px';
  applyLayout();
  S.bgCache = {};
  A.clearTowerCache(); // v0.6.1: tower sprites are baked at the device scale -> rebuild after a DPR / size change
}
window.addEventListener('resize', resize);
resize();

// ---------------- immediate-mode buttons ----------------
let buttons = [], prevButtons = [];
function button(id, x, y, w, h, onTap, opt = {}) { buttons.push({ id, x, y, w, h, onTap, ...opt }); }
function hit(list, x, y) { for (let i = list.length - 1; i >= 0; i--) { const b = list[i]; if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) return b; } return null; }
function drawButton(x, y, w, h, label, col = '#ffb3c1', opt = {}) {
  const press = opt.pressed ? 2 : 0;
  ctx.save();
  if (opt.disabled) ctx.globalAlpha = 0.5;
  A.rr(ctx, x, y + 4, w, h, opt.r ?? 14); ctx.fillStyle = A.shade(col, -0.35); ctx.fill();
  A.rr(ctx, x, y + press, w, h, opt.r ?? 14);
  const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, A.shade(col, 0.35)); g.addColorStop(1, col);
  ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = A.INK; ctx.stroke();
  A.rr(ctx, x + 6, y + 4 + press, w - 12, h * 0.32, 8); ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fill();
  if (label) A.text(ctx, label, x + w / 2, y + h / 2 + press + 1, opt.size || 17);
  ctx.restore();
}
function panel(x, y, w, h, col = '#fff6ee', r = 18) {
  A.rr(ctx, x, y + 4, w, h, r); ctx.fillStyle = 'rgba(74,52,66,0.25)'; ctx.fill();
  A.rr(ctx, x, y, w, h, r); ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = A.INK; ctx.stroke();
}
// Notices: in battle a small pill just above the tray (never covers the map centre); elsewhere a compact box.
function toast(msg, col = '#fff') { const small = S.screen === 'battle'; S.toast = { msg, t: small ? C.UI.toastTime : C.UI.menuToastTime, col, small }; }
function needCrumbs(n) { toast(`Need ${n} crumbs`, '#ffd0d0'); S.crumbShake = 0.45; sfx('tap'); }

// ---------------- pointer input ----------------
let down = null;
function toLogical(e) { return { x: (e.clientX - offX) / scale, y: (e.clientY - offY) / scale }; }
canvas.addEventListener('pointerdown', (e) => {
  initAudio(); e.preventDefault();
  const p = toLogical(e);
  const b = hit(prevButtons, p.x, p.y);
  down = { x: p.x, y: p.y, b, moved: false };
  // v0.5 item 13: the level map scrolls (drag up/down) - world 2 sits above world 1
  if (S.screen === 'map' && !S.cal && !S.reveal.length && !S.pack && p.y >= MAPVIEW.top && p.y <= MAPVIEW.bottom) down.scroll0 = S.mapScroll;
  if (b && b.onDown) b.onDown(p);
});
canvas.addEventListener('pointermove', (e) => {
  if (!down) return; const p = toLogical(e);
  if (Math.hypot(p.x - down.x, p.y - down.y) > 8) down.moved = true;
  if (S.drag) { S.drag.x = p.x; S.drag.y = p.y; S.drag.moved = S.drag.moved || down.moved; }
  if (down.scroll0 != null && down.moved) S.mapScroll = clampScroll(down.scroll0 + (p.y - down.y));
});
canvas.addEventListener('pointerup', (e) => {
  if (!down) return; const p = toLogical(e);
  if (S.drag && S.drag.moved) { dropCard(p); S.drag = null; down = null; return; }
  if (down.scroll0 != null && down.moved) { down = null; return; } // a scroll drag is never a tap
  S.drag = null;
  const b = hit(prevButtons, p.x, p.y);
  if (b && down.b && b.id === down.b.id && b.onTap) { b.onTap(p); }
  down = null;
});
canvas.addEventListener('pointercancel', () => { down = null; S.drag = null; });
document.addEventListener('visibilitychange', () => {
  if (document.hidden && S.screen === 'battle' && !S.result) setPaused(true);
  if (!document.hidden) { heartbeat(true); maybeShowCalendar(); }
});

// ---------------- screens ----------------
function go(screen) {
  S.screen = screen; S.sel = null; S.info = null; S.drag = null; S.mergeAnim = null; S.toast = null; S.dialog = null; S.cal = null; S.settings = null; S.mode = null; S.shopFx = null; sfx('tap');
  if (screen === 'map') { S.mapScroll = autoMapScroll(); maybeShowCalendar(); }
  // keep one history entry while away from the map so the Android back button maps to in-game "back"
  try {
    const inner = history.state && history.state.inner;
    if (screen !== 'map' && !inner) history.pushState({ inner: 1 }, '');
    else if (screen === 'map' && inner) history.back();
  } catch (e) { /* history unavailable */ }
}
window.addEventListener('popstate', () => {
  if (S.pack) { closePack('ok'); try { history.pushState({ inner: 1 }, ''); } catch (e) {} return; } // v0.7: back closes the pack reveal
  if (S.dialog) { S.dialog = null; try { history.pushState({ inner: 1 }, ''); } catch (e) {} return; }
  if (S.screen === 'map') { if (S.cal) S.cal = null; else if (S.settings) S.settings = null; return; }
  const repush = () => { try { history.pushState({ inner: 1 }, ''); } catch (e) {} };
  if (S.screen === 'battle' && !S.result) { setPaused(!S.paused); repush(); return; }
  if (S.screen === 'card') { S.screen = 'cards'; repush(); return; }
  S.battle = null; S.screen = 'map'; S.sel = null;
});
function openPrep(i) {
  S.levelIndex = i;
  const unlocked = M.unlockedCards(S.save);
  let deck = (S.save.lastDeck || []).filter((id) => unlocked.includes(id));
  for (const id of unlocked) if (deck.length < C.BATTLE.deckSize && !deck.includes(id)) deck.push(id);
  S.prep.deck = deck.slice(0, C.BATTLE.deckSize);
  // bonuses that ran out since last time are swapped for ones that still have stock (feedback 12)
  S.prep.bonuses = M.autoFixBonuses(S.save, (S.save.lastBonuses || C.BONUS_TYPES.slice(0, 2)).slice(0, C.BATTLE.bonusTypesToBring));
  S.prepAlert = null;
  go('prep');
}
function startBattle(levelIndex = S.levelIndex, deck = S.prep.deck, bonuses = S.prep.bonuses, seed = (Date.now() & 0xffffff)) {
  S.levelIndex = levelIndex;
  S.save.lastDeck = deck.slice(); S.save.lastBonuses = bonuses.slice(); persist();
  S.treat = Treat.newTreatState();
  S.battle = new Battle({ levelIndex, deck, bonusTypes: bonuses, bonusStock: { ...S.save.bonusStock }, cardLevels: M.cardLevels(S.save), seed,
    onBonusUsed: (type) => { M.consumeBonus(S.save, type); persist(); } }); // deducted immediately: Restart/Quit can't refund it
  S.battleStartStock = { ...S.save.bonusStock };
  S.fx = []; S.ui = []; S.result = null; setPaused(false); S.speed = S.speed || 1; S.sel = null; S.info = null; S.mode = null; S.queenDown = null;
  go('battle');
}
function finishBattle() {
  const b = S.battle;
  // bonuses were already deducted from the save at the moment of use
  const out = M.applyBattleResult(S.save, b.levelIndex, b.result, b.stars, { kills: b.stats.kills, foodLeft: b.foodStored, perfect: b.perfect, time: b.time });
  if (b.result === 'lose') M.noteLossForCardBlink(S.save); // v0.4 item 17: arms the 'after a loss' Cards blink
  persist();
  const win = b.result === 'win', fullFood = b.foodStored >= b.cfg.foodHP - 1e-6;
  const queenKilled = win && Object.keys(b.stats.byType).some((t) => C.isQueen(t)); // v0.5.1: queen celebration only when the level is won
  const hold = queenKilled ? C.UI.queenCheerHold : 0; // v0.6.2 item 14: the result panel waits for the queen celebration
  S.result = { win, stars: b.stars, out, t: 0, hold, crumbsLeft: b.crumbs, perfect: out.perfect, kills: b.stats.kills, confetti: [], fullFood, queenKilled };
  // v0.5 item 16: 3 stars -> confetti; a full score (100 food = the whole treat) -> confetti + fireworks; queen beaten -> fireworks + text
  if (win && (b.stars >= 3 || fullFood || out.perfect)) for (let i = 0; i < 90; i++) S.result.confetti.push({ x: 200 + (Math.random() - 0.5) * 60, y: 230, vx: (Math.random() - 0.5) * 420, vy: -150 - Math.random() * 320, r: Math.random() * 6, c: ['#ff8fab', '#ffd45e', '#8fe388', '#9fd3f2', '#c9b6f2'][i % 5] });
  if (win && fullFood) launchFireworks(9, 2.6);
  if (queenKilled) { launchFireworks(10, 3); S.queenDown = { t: S.t, world: C.worldOf(b.levelIndex) }; }
  // v0.5 item 7: a won card that is a new type / new level gets the big NEW CARD reveal (after the Perfect celebration)
  if (out.prize && out.prize.kind === 'cards' && out.prize.reveal) queueReveal(out.prize.id, out.prize.level, out.prize.newCard, S.t + hold + C.UI.perfectAnimTime + 0.4);
  sfx(win ? 'win' : 'lose');
}

// ---------------- battle input ----------------
function tileAt(p) {
  const x = p.x, y = p.y - MAP_Y;
  if (x < 0 || y < 0 || x >= MAP_W || y >= MAP_H) return null;
  return { c: Math.floor(x / C.TILE), r: Math.floor(y / C.TILE), x, y };
}
function dragTile(p) { return tileAt({ x: p.x, y: p.y - 34 }); } // ghost sits above the finger
function dropCard(p) {
  const b = S.battle; const t = dragTile(p);
  if (!t || S.drag.i == null || S.paused || S.screen !== 'battle') return;
  tryPlay(S.drag.i, t.c, t.r);
}
function tryPlay(i, c, r) {
  const b = S.battle;
  if (S.paused || S.result) return false;
  const res = b.playCard(i, c, r);
  if (res.ok) { S.sel = null; sfx(res.upgrade ? 'upgrade' : 'place'); return true; }
  if (res.why === 'crumbs') { needCrumbs(b.nextCardCost); return false; }
  const msgs = { needPath: 'Place this ON the trail', needSide: 'Place this BESIDE the trail', needNearTrail: `${C.TOWERS[b.picks[i]] ? C.TOWERS[b.picks[i]].short : 'It'} must touch the trail`, occupied: 'Spot taken', max: `Already max level (${b.cfg.maxInBattleLevel})`, tile: '' };
  if (msgs[res.why]) toast(msgs[res.why], '#ffd0d0');
  return false;
}
function mapTap(p) {
  const b = S.battle; const t = tileAt(p); if (!t || b.result || S.paused) return;
  if (S.mode) { modeTap(b, t); return; }
  if (S.sel && S.sel.kind === 'card') { tryPlay(S.sel.i, t.c, t.r); return; }
  if (S.sel && S.sel.kind === 'bonus') {
    if (b.useBonus(S.sel.type, t.x, t.y)) sfx(S.sel.type === 'bomb' ? 'boom' : 'tap');
    S.sel = null; return;
  }
  const tw = b.towers.find((q) => q.c === t.c && q.r === t.r);
  // tapping the same tower while its upgrade panel is showing keeps it open (no auto-close); otherwise toggle normally
  if (tw && S.info && S.info.tower === tw && S.info.auto) { S.info.auto = false; S.info.changed = null; return; }
  S.info = tw ? { tower: tw, t: 0 } : null;
}

// v0.5 items 11/12: Move (1 diamond) / Swap (free) - started from the tower info panel, finished by tapping the map
function startMode(kind, tw) {
  const b = S.battle; if (!b || b.result || S.paused) return;
  if (kind === 'move' && (S.save.diamonds || 0) < C.ECONOMY.diamonds.moveTower) { toast(`Moving costs ${C.ECONOMY.diamonds.moveTower} diamond (you have ${S.save.diamonds || 0})`, '#ffd0d0'); return; }
  if (kind === 'swap' && b.towers.length < 2) { toast('Place another tower first', '#ffd0d0'); return; }
  S.mode = { kind, tower: tw, t: S.t }; S.info = null; S.sel = null; sfx('tap');
}
function modeTap(b, t) {
  const m = S.mode; const other = b.towers.find((q) => q.c === t.c && q.r === t.r) || null;
  if (other === m.tower) { S.mode = null; return; } // tap the same tower again = cancel
  if (m.kind === 'move') {
    const r = M.moveTowerWithDiamond(S.save, b, m.tower, t.c, t.r);
    if (r.ok) { persist(); S.mode = null; sfx('place'); addUi({ k: 'priceFloat', cur: 'diamond', n: r.price, x: 252, y: 58, life: 1.1, max: 1.1 }); }
    else toast(r.why === 'diamonds' ? `Moving costs ${C.ECONOMY.diamonds.moveTower} diamond` : other ? 'Spot taken - use Swap' : "It can't stand there", '#ffd0d0');
    return;
  }
  if (!other) { toast('Tap another tower to swap with', '#ffd0d0'); return; }
  if (b.swapTowers(m.tower, other)) { S.mode = null; sfx('place'); }
  else toast("Those two can't swap spots", '#ffd0d0');
}

// ---------------- FX from sim events ----------------
function addFx(f) { S.fx.push(f); if (S.fx.length > 300) S.fx.splice(0, 60); }
function addUi(f) { S.ui.push(f); if (S.ui.length > 60) S.ui.splice(0, 20); }
const fmtFood = (n) => (Math.abs(n - Math.round(n)) < 0.05 ? String(Math.round(n)) : n.toFixed(1));
function consumeEvents() {
  const b = S.battle; const ev = b.events; b.events = [];
  for (const e of ev) {
    switch (e.type) {
      case 'kill':
        if (e.src === 'tractor') { addFloatText(S.fx, { k: 'crumbTxt', key: 'crumb', x: e.x, y: e.y - 14, n: e.crumbs, fmt: (n) => n, life: 0.9 }); break; } // the scoop event animates the throw
        for (let i = 0; i < 4; i++) addFx({ k: 'crumbBit', x: e.x, y: e.y - 6, vx: (Math.random() - 0.5) * 90, vy: -40 - Math.random() * 60, life: 0.6, max: 0.6 });
        addFx({ k: 'ko', x: e.x, y: e.y, ant: e.ant, life: 0.9, max: 0.9, face: Math.random() < 0.5 ? 1 : -1 });
        for (let i = 0; i < 5; i++) addFx({ k: 'puff', x: e.x + (Math.random() - 0.5) * 10, y: e.y + (Math.random() - 0.5) * 6, vx: (Math.random() - 0.5) * 40, vy: -Math.random() * 30, r: 4 + Math.random() * 4, life: 0.5, max: 0.5 });
        addFloatText(S.fx, { k: 'crumbTxt', key: 'crumb', x: e.x, y: e.y - 14, n: e.crumbs, fmt: (n) => n, life: 0.9 });
        sfx('pop'); break;
      case 'beam': addFx({ k: 'beam', ...e, life: 0.09, max: 0.09 }); sfx('laser'); break;
      case 'zap': addFx({ k: 'zap', ...e, life: 0.14, max: 0.14 }); sfx('zap'); break;
      case 'roast': for (let i = 0; i < 5; i++) addFx({ k: 'ember', x: e.x + (Math.random() - 0.5) * 14, y: e.y - 4, vx: (Math.random() - 0.5) * 20, vy: -30 - Math.random() * 30, life: 0.7, max: 0.7 }); break; // v0.4 item 7
      case 'tongue': addFx({ k: 'tongue', ...e, life: 0.25, max: 0.25 }); break;
      case 'scoop': { // v0.6 item 6: the Tractor's bucket scoops the ants and throws them off the trail in an arc
        const side = e.dx ? [0, 1] : [1, 0]; // throw sideways to the trail (perpendicular to the scoop direction), mostly back over the tractor
        e.ants.forEach((a, k) => {
          const sgn = k % 2 ? -1 : 1, far = 46 + Math.random() * 26;
          const tx = a.x - e.dx * far * 0.7 + side[0] * sgn * (18 + Math.random() * 20), ty = a.y - e.dy * far * 0.7 + side[1] * sgn * (18 + Math.random() * 20);
          addFx({ k: 'thrown', ant: a.type, x0: a.x, y0: a.y, x1: tx, y1: ty, h: 46 + Math.random() * 20, spin: (Math.random() < 0.5 ? -1 : 1) * (7 + Math.random() * 5), life: 0.95, max: 0.95 });
        });
        for (let i = 0; i < 6; i++) addFx({ k: 'puff', x: e.tx + (Math.random() - 0.5) * 22, y: e.ty + 6 + (Math.random() - 0.5) * 8, vx: (Math.random() - 0.5) * 50, vy: -Math.random() * 25, r: 4 + Math.random() * 4, life: 0.5, max: 0.5 });
        addFloatText(S.fx, { key: 'scoop', x: e.tx, y: e.ty - 24, n: e.ants.length, fmt: (n) => (n > 1 ? `Scoop x${n}!` : 'Scoop!'), col: '#ffe39a', life: 0.9 });
        sfx('gust'); break;
      }
      case 'pulse': addFx({ k: 'ring', ...e, life: 0.45, max: 0.45, col: '#a58be0' }); sfx('pulse'); break;
      case 'gust': for (let i = 0; i < 6; i++) addFx({ k: 'wisp', x: e.x, y: e.y - 16, a: e.ang + (Math.random() - 0.5) * 0.8, d: 10 + Math.random() * 10, life: 0.5, max: 0.5 }); sfx('gust'); break;
      case 'spray': addFx({ k: 'mist', ...e, life: 0.3, max: 0.3 }); break;
      case 'swat': { // v0.7.2 C13: the swatter's slap lands 0.18 s into its 0.5 s swing: spark + hit flash on the ant, a soft thwap
        const wait = reducedMotion() ? 0 : 0.17;
        addFx({ k: 'spark', x: e.x, y: e.y - 4, life: 0.2 + wait, max: 0.2, wait, col: '#fff7b0' });
        addFx({ k: 'ring2', x: e.x, y: e.y - 2, life: 0.3 + wait, max: 0.3, wait });
        setTimeout(() => sfx('swat'), wait * 1000); break;
      }
      case 'hit': addFx({ k: 'spark', x: e.x, y: e.y - 6, life: 0.15, max: 0.15 }); break;
      case 'gateZap': addFx({ k: 'spark', x: e.x, y: e.y - 14, life: 0.18, max: 0.18, col: '#fff27a' }); break;
      case 'steal': S.cookieOuch = S.t + C.UI.ouchTime; Treat.onBite(S.treat, S.t, e.n || 1); // v0.4 item 18: animated bite reaction
        if (e.n) addFloatText(S.fx, { key: 'steal', x: e.x, y: e.y - 20, n: e.n, fmt: (n) => `-${fmtFood(n)}`, col: '#ff7a7a', life: 1 }); sfx('steal'); break;
      case 'foodReturn': addFloatText(S.fx, { key: 'food', x: e.x, y: e.y - 18, n: e.n, fmt: (n) => `+${fmtFood(n)} food back!`, col: '#8fe388', life: 1.1 }); sfx('return'); break;
      case 'place': case 'upgrade': {
        // purchase feedback: the card flies from its tray slot to the tile, the price flies out of the crumb counter
        const delay = e.pick != null ? 0.28 : 0;
        if (e.pick != null) {
          const sx = 12 + e.pick * 94 + 44, sy = TRAY_Y + 6 + 47;
          addUi({ k: 'cardFly', card: e.card, x0: sx, y0: sy, x1: e.x, y1: e.y + MAP_Y, life: delay, max: delay });
          S.slotFlip[e.pick] = 0.3;
        }
        if (e.cost > 0) addUi({ k: 'costFly', n: e.cost, x0: 340, y0: 34, x1: 300, y1: 96, life: 1.0, max: 1.0 }); // big '-N' drops out of the crumb counter
        S.crumbPulse = 0.35;
        for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2; addFx({ k: 'star', x: e.x, y: e.y, vx: Math.cos(a) * 75, vy: Math.sin(a) * 75 - 25, life: 0.7 + delay, max: 0.7, wait: delay }); }
        addFx({ k: 'pop', x: e.x, y: e.y, life: 0.35 + delay, max: 0.35, wait: delay });
        addFx({ k: 'ring2', x: e.x, y: e.y, life: 0.5 + delay, max: 0.5, wait: delay });
        if (e.type === 'upgrade') {
          addFx({ k: 'pillar', x: e.x, y: e.y, life: 0.9 + delay, max: 0.9, wait: delay });
          addFx({ k: 'txt', x: e.x, y: e.y - 34, s: `Level ${e.lvl}!${dmgGainText(e.card, e.lvl, S.battle.cardLevels[e.card] || 1) ? '  ' + dmgGainText(e.card, e.lvl, S.battle.cardLevels[e.card] || 1) : ''}`, col: '#ffe36e', life: 1.4 + delay, max: 1.4, wait: delay, size: 17 });
          (e.diff || []).forEach((d, k) => addFx({ k: 'txt', x: e.x, y: e.y - 52 - k * 16, s: `${d.label} ${formatStat(e.card, d.key, d.from)} \u2192 ${formatStat(e.card, d.key, d.to)}`, col: '#a8ffb0', life: 2 + delay, max: 2, wait: delay, size: 12 }));
          const tw = S.battle.towers.find((q) => q.id === e.id);
          if (tw && !S.autoBot) { const mine = !!(S.info && S.info.tower === tw && !S.info.auto); S.info = { tower: tw, t: 0, changed: e.diff, until: S.t + C.UI.upgradeInfoTime, auto: !mine }; } // B9: auto-closes unless the player had opened it
          sfx('upgrade');
        } else addFloatText(S.fx, { key: 'placed', x: e.x, y: e.y - 34, n: 1, fmt: () => 'Placed!', col: '#fff', life: 0.9 });
        break;
      }
      case 'stick': addFloatText(S.fx, { key: 'stick', x: e.x, y: e.y - 20, n: 1, fmt: () => 'stuck!', col: '#fff3b0', life: 0.7 }); break;
      case 'charm': for (let i = 0; i < 2; i++) addFx({ k: 'heart', x: e.x + (i - 0.5) * 8, y: e.y - 18, life: 0.9, max: 0.9 }); break;
      case 'squash': addFx({ k: 'spark', x: e.x, y: e.y - 4, life: 0.2, max: 0.2, col: '#bfe6ff' }); break;
      case 'marbleBreak': for (let i = 0; i < 7; i++) addFx({ k: 'shard', x: e.x, y: e.y - 6, vx: (Math.random() - 0.5) * 110, vy: -30 - Math.random() * 70, life: 0.55, max: 0.55 }); break; // v0.5 item 2: breaks at the wall/turn
      case 'move': addFx({ k: 'pop', x: e.x, y: e.y, life: 0.35, max: 0.35 }); addFx({ k: 'ring2', x: e.x, y: e.y, life: 0.5, max: 0.5 }); addFloatText(S.fx, { key: 'placed', x: e.x, y: e.y - 34, n: 1, fmt: () => 'Moved!', col: '#fff', life: 0.9 }); break;
      case 'swap': for (const [x, y] of [[e.ax, e.ay], [e.bx, e.by]]) { addFx({ k: 'pop', x, y, life: 0.35, max: 0.35 }); addFx({ k: 'ring2', x, y, life: 0.5, max: 0.5 }); } addFloatText(S.fx, { key: 'placed', x: e.ax, y: e.ay - 34, n: 1, fmt: () => 'Swapped!', col: '#fff', life: 0.9 }); break;
      case 'roll': addFx({ k: 'pop', x: e.x, y: e.y - 12, life: 0.2, max: 0.2 }); sfx('gust'); break;
      case 'bomb': addFx({ k: 'boom', x: e.x, y: e.y, r: e.r, life: 0.7, max: 0.7 }); sfx('boom'); break;
      case 'freeze': addFx({ k: 'flash', col: 'rgba(190,235,255,0.7)', life: 0.4, max: 0.4 }); sfx('freeze'); break;
      case 'plane': sfx('plane'); break;
      case 'wave': addFx({ k: 'banner', s: `Wave ${e.n}`, life: 1.4, max: 1.4 }); sfx('wave'); break;
      case 'queenCall': addFloatText(S.fx, { key: 'queen', x: e.x, y: e.y - 40, n: 1, fmt: () => (e.calls === 'flyer' ? 'Wings, go!' : 'Scouts, go!'), col: '#ffb3e0', life: 1 }); break;
      case 'immune': addFloatText(S.fx, { key: 'immune', x: e.x, y: e.y - 22, n: 1, fmt: () => 'immune!', col: '#c9f5c0', life: 0.8 }); break;
    }
  }
}

// ---------------- main loop ----------------
let lastT = performance.now(), acc = 0;
const STEP = 1 / 60;
function frame(now) {
  const dt = Math.min(0.1, (now - lastT) / 1000); lastT = now;
  S.t += dt;
  heartbeat(false);
  if (S.screen === 'battle' && S.battle && !S.paused && !S.result && !S.dialog) {
    acc += dt * S.speed;
    while (acc >= STEP) {
      S.battle.update(STEP); acc -= STEP;
      if (S.autoBot) smartBotStep(S.battle);
      if (S.battle.result) break;
    }
    consumeEvents();
    if (S.battle.result) finishBattle();
  }
  render(dt);
  requestAnimationFrame(frame);
}

function render(dt) {
  prevButtons = buttons; buttons = [];
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = BG; ctx.fillRect(0, 0, canvas.width, canvas.height);
  applyLayout();
  ctx.setTransform(dpr * scale, 0, 0, dpr * scale, offX * dpr, offY * dpr);
  // soft background pattern
  drawBackdrop();
  renderTabBar(dt); // v0.7.2 C16: drawn BEFORE the screen so a modal / onboarding dim covers it and its blockers win the taps
  if (S.screen === 'map') renderMapScreen();
  else if (S.screen === 'prep') renderPrep();
  else if (S.screen === 'battle') renderBattle(dt);
  else if (S.screen === 'cards') renderCards();
  else if (S.screen === 'card') renderCardView();
  else if (S.screen === 'shop') renderShop();
  renderFireworks(dt);
  if (S.reveal.length && S.reveal[0].at <= S.t) renderReveal(dt);
  if (S.pack) renderPack(dt); // v0.7: pack reveal (free + paid packs)
  if (S.toast) {
    S.toast.t -= dt;
    ctx.save(); ctx.globalAlpha = Math.min(1, S.toast.t * 5);
    if (S.toast.small) {
      // compact pill right above the tray: small, short, never over the middle of the map
      ctx.font = `bold 12px ${A.FONT}`; const w = Math.min(300, ctx.measureText(S.toast.msg).width + 26);
      const y = TRAY_Y - 30; S.layoutToast = { x: 200 - w / 2, y, w, h: 24 };
      A.rr(ctx, 200 - w / 2, y, w, 24, 12); ctx.fillStyle = 'rgba(74,52,66,0.88)'; ctx.fill();
      A.text(ctx, S.toast.msg, 200, y + 12.5, 12, S.toast.col, 'center', null);
    } else {
      ctx.font = `bold 14px ${A.FONT}`; const w = Math.min(340, ctx.measureText(S.toast.msg).width + 36);
      S.layoutToast = { x: 200 - w / 2, y: 600, w, h: 34 };
      panel(200 - w / 2, 600, w, 34, '#5a4058', 17); A.text(ctx, S.toast.msg, 200, 617, 14, S.toast.col, 'center', null);
    }
    ctx.restore();
    if (S.toast.t <= 0) { S.toast = null; S.layoutToast = null; }
  }
}
// ---------------- v0.7.2 C16: bottom tab bar (Map / Cards / Shop) ----------------
// Screen-space bar (CSS px = dp): BAR_H tall + the bottom safe-area inset (decoration, not tappable). Three equal tabs, each the full BAR_H tall
// (>= 48 dp at every width >= 144). Shown on the meta screens; slides out for modals; never on prep / battle / results / pack reveal.
let barK = 0;
const TAB_COL = ['#d9cfe0', '#b5d8ff', '#ffd27a'], TAB_NAME = ['Map', 'Cards', 'Shop'], TAB_MUTED = '#7a5a6a', BAR_BG = '#fff6ee';
function activeTab() { return S.screen === 'map' ? 0 : S.screen === 'shop' ? 2 : 1; }
function barWanted() { return isMeta() && !S.cal && !S.settings && !S.pack && !S.mergeAnim && !(S.reveal.length && S.reveal[0].at <= S.t) && !S.dialog; }
function tabRect(i) { // logical-coordinate rectangle of tab i (for the onboarding spot and the button hit areas)
  const tw = cw / 3, top = ch - BAR_H - insetB;
  return { x: (i * tw + 6 - offX) / scale, y: (top + 6 - offY) / scale, w: (tw - 12) / scale, h: 44 / scale, r: 14 / scale };
}
function tabTap(i) {
  if (i === activeTab()) { if (S.screen === 'map') S.mapScroll = autoMapScroll(); else if (S.screen === 'card') { S.screen = 'cards'; S.mergeAnim = null; } return; } // active tab: silent
  go(['map', 'cards', 'shop'][i]);
}
function drawTabIcon(kind, x, y, active) {
  const ink = active ? A.INK : TAB_MUTED;
  ctx.save(); ctx.translate(x, y); ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.lineWidth = active ? 2.5 : 2; ctx.strokeStyle = ink;
  if (kind === 0) { // map: a curving path with a round pin
    ctx.beginPath(); ctx.moveTo(-10, 9); ctx.bezierCurveTo(-10, 2, 2, 11, 3, 4); ctx.lineWidth = active ? 3.2 : 2.6; ctx.setLineDash([0.1, 5]); ctx.stroke(); ctx.setLineDash([]);
    ctx.lineWidth = active ? 2.5 : 2;
    ctx.beginPath(); ctx.arc(4, -4, 5.2, 0, 7); ctx.fillStyle = active ? '#b9e89a' : '#e6e0e4'; ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(4, -4, 1.6, 0, 7); ctx.fillStyle = ink; ctx.fill();
    ctx.beginPath(); ctx.moveTo(1.4, 0.2); ctx.lineTo(4, 5.4); ctx.lineTo(6.6, 0.2); ctx.fillStyle = active ? '#b9e89a' : '#e6e0e4'; ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(4, -4, 5.2, 0.9, 2.2); ctx.stroke();
  } else if (kind === 1) { // cards: two rounded cards, the front one rotated 8 degrees
    ctx.save(); ctx.translate(-3.5, -0.5); ctx.rotate(-0.14); A.rr(ctx, -6.5, -9, 13, 18, 3); ctx.fillStyle = active ? '#b5d8ff' : '#e6e0e4'; ctx.fill(); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.translate(3.5, 1); ctx.rotate(0.14); A.rr(ctx, -6.5, -9, 13, 18, 3); ctx.fillStyle = active ? '#ffffff' : '#f6f2f4'; ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, 2.2, 0, 7); ctx.fillStyle = active ? '#ff9ec0' : '#cdbcc5'; ctx.fill(); ctx.restore();
  } else { // shop: a small bag with a handle arc and a star
    ctx.beginPath(); ctx.arc(0, -4, 5, Math.PI, 0); ctx.stroke();
    A.rr(ctx, -9, -4, 18, 15, 4); ctx.fillStyle = active ? '#ffb3c1' : '#e6e0e4'; ctx.fill(); ctx.stroke();
    A.starShape(ctx, 0, 4, 3.6, active ? '#fff27a' : '#f6f2f4', 1.2);
  }
  ctx.restore();
}
function renderTabBar(dt) {
  if (!isMeta()) { barK = 0; return; }
  const want = barWanted(), step = reducedMotion() ? 1 : Math.max(0, dt) / (want ? 0.2 : 0.18);
  barK = want ? Math.min(1, barK + step) : Math.max(0, barK - step);
  if (barK <= 0) return;
  const total = BAR_H + insetB, y0 = ch - total + (1 - barK) * total, tw = cw / 3, act = activeTab();
  ctx.save(); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const sg = ctx.createLinearGradient(0, y0 - 7, 0, y0); sg.addColorStop(0, 'rgba(74,52,66,0)'); sg.addColorStop(1, 'rgba(74,52,66,0.18)');
  ctx.fillStyle = sg; ctx.fillRect(0, y0 - 7, cw, 7);
  ctx.fillStyle = BAR_BG; ctx.fillRect(0, y0, cw, total + 2);
  ctx.fillStyle = A.INK; ctx.fillRect(0, y0 - 1, cw, 2.5);
  const blink = cardsBlinkOn(), fresh = C.ALL_CARDS.some((id) => S.save.cards[id].fresh);
  for (let i = 0; i < 3; i++) {
    const on = i === act, pressed = !!(down && down.b && down.b.id === 'tab' + i);
    const x = i * tw + 6, w = tw - 12, lift = on ? 2 : 0, py = y0 + 6 - lift + (pressed ? 2 : 0), ph = 44;
    const col = i === 1 && blink ? '#fff07a' : TAB_COL[i];
    if (i === 1 && blink) { A.rr(ctx, x - 3, y0 + 2, w + 6, ph + 8, 17); ctx.fillStyle = 'rgba(255,240,140,0.85)'; ctx.fill(); }
    if (on || (i === 1 && blink)) {
      A.rr(ctx, x, py + 3, w, ph, 14); ctx.fillStyle = A.shade(col, -0.35); ctx.fill();
      A.rr(ctx, x, py, w, ph, 14); ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = A.INK; ctx.stroke();
    }
    const bob = i === 1 && blink ? Math.sin(S.t * 8) * 2 : 0;
    drawTabIcon(i, x + w / 2, py + 15 + bob, on);
    plainText(TAB_NAME[i], x + w / 2, py + 35, 13, on ? A.INK : TAB_MUTED, 'center', '800');
    if (i === 1 && fresh) { A.blob(ctx, x + w / 2 + 15, py + 8, 6, 6, '#ff6f91', 1.5); } // v0.5 item 7: a won card waits in Cards (pink dot)
    if (barK >= 0.5) button('tab' + i, (i * tw - offX) / scale, (y0 - offY) / scale, tw / scale, BAR_H / scale, () => tabTap(i)); // the full 56 dp tab is the hit area
  }
  ctx.restore();
}
function drawGearIcon(x, y, r) {
  ctx.save(); ctx.translate(x, y); ctx.lineJoin = 'round'; ctx.lineWidth = 2.2; ctx.strokeStyle = A.INK; ctx.fillStyle = '#c9b8c2';
  ctx.beginPath();
  for (let k = 0; k < 16; k++) { const a = k * Math.PI / 8, rr_ = k % 2 ? r * 0.72 : r; ctx.lineTo(Math.cos(a - 0.1) * rr_, Math.sin(a - 0.1) * rr_); ctx.lineTo(Math.cos(a + 0.1) * rr_, Math.sin(a + 0.1) * rr_); }
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, 0, r * 0.32, 0, 7); ctx.fillStyle = '#fff6ee'; ctx.fill(); ctx.stroke();
  ctx.restore();
}
// v0.7.2 C16: Snd and Reset left the map's bottom row: a gear at the top right of the map header opens one small panel (Sound switch, Reset behind a two-step confirm).
function renderSettings() {
  if (!S.settings) return;
  button('setBlock', -2000, -2000, W + 4000, H + 4000, () => {});
  ctx.save(); ctx.fillStyle = 'rgba(40,26,38,0.55)'; ctx.fillRect(-2000, -2000, W + 4000, H + 4000); ctx.restore();
  button('setBlock2', -2000, -2000, W + 4000, H + 4000, () => { S.settings = null; S.confirmReset = 0; });
  const x = 70, y = 190, w = 260, h = 262;
  panel(x, y, w, h, '#fff6ee', 20); button('setPanel', x, y, w, h, () => {});
  A.text(ctx, 'Settings', 200, y + 28, 22, '#ffb3c1');
  const muted = S.save.settings && S.save.settings.muted;
  drawButton(x + 24, y + 54, w - 48, 52, muted ? 'Sound: Off' : 'Sound: On', muted ? '#e6dce2' : '#c9f0c0', { size: 17 });
  button('setSound', x + 24, y + 48, w - 48, 64, () => { S.save.settings = { ...(S.save.settings || {}), muted: !muted }; setMuted(!muted); persist(); sfx('tap'); });
  const sure = S.confirmReset > S.t;
  drawButton(x + 24, y + 122, w - 48, 52, sure ? 'Sure? Tap again' : 'Reset progress', '#ffb3b3', { size: sure ? 16 : 17 });
  button('setReset', x + 24, y + 116, w - 48, 64, () => {
    if (S.confirmReset > S.t) { S.save = M.newSave(); Cal.touch(S.save, now()); persist(); S.confirmReset = 0; S.cardsBlinkUntil = 0; S.settings = null; toast('Progress reset'); }
    else { S.confirmReset = S.t + 3; }
  });
  drawButton(x + 24, y + 190, w - 48, 48, 'Close', '#d9cfe0', { size: 17 });
  button('setClose', x + 24, y + 184, w - 48, 64, () => { S.settings = null; S.confirmReset = 0; });
}
function drawBackdrop() {
  ctx.save();
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#fff1e6'); g.addColorStop(1, '#fbd9cf');
  ctx.fillStyle = g; ctx.fillRect(-2000, -2000, W + 4000, H + 4000);
  ctx.globalAlpha = 0.35; ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 14; i++) { const x = (i * 97) % W, y = (i * 173 + S.t * 6) % (H + 40) - 20; ctx.beginPath(); ctx.arc(x, y, 6 + (i % 3) * 3, 0, 7); ctx.fill(); }
  ctx.restore();
}

// ---------------- MAP / LEVEL SELECT ----------------
// v0.5 item 13: every world = 10 stages in the same zig-zag (2 per row); world 2 continues ABOVE world 1 after a gate and is
// reached by scrolling the map (drag up/down). The header (title, calendar, currencies) and the bottom buttons stay fixed.
const MAPVIEW = { top: 194, bottom: 654 }, WORLD_GAP = 96;
function nodePos(i) {
  const w = C.worldOf(i), j = i - C.WORLD_START[w];
  const row = (w - 1) * 5 + Math.floor(j / 2), col = j % 2;
  const zig = row % 2 ? 1 - col : col;
  return { x: 110 + zig * 180 + Math.sin(i * 1.7) * 18, y: 600 - row * 88 - (w - 1) * WORLD_GAP };
}
function gateY(w) { return (nodePos(C.WORLD_START[w] - 1).y + nodePos(C.WORLD_START[w]).y) / 2; }
function maxMapScroll() { return Math.max(0, (MAPVIEW.top + 70) - nodePos(C.LEVELS.length - 1).y); }
function clampScroll(v) { return Math.max(0, Math.min(maxMapScroll(), v)); }
// on entering the map, scroll so the next stage to play is in view
function autoMapScroll() {
  let n = 0; for (let i = 0; i < C.LEVELS.length; i++) if (M.levelUnlocked(S.save, i)) n = i;
  for (let i = 0; i < C.LEVELS.length; i++) if (M.levelUnlocked(S.save, i) && !S.save.levels[i].cleared) { n = i; break; }
  return clampScroll(430 - nodePos(n).y);
}
// v0.4 item 16 (visuals only): a winding road between the stage markers instead of a straight dotted line. Between two nodes
// the road swings out in an S-bend (alternating sides), giving a curvy, wheel-like route. Node positions are unchanged.
function mapRoadPoints() {
  if (S.mapRoad) return S.mapRoad;
  const pts = [];
  for (let i = 0; i < C.LEVELS.length - 1; i++) {
    const a = nodePos(i), b = nodePos(i + 1); const dx = b.x - a.x, dy = b.y - a.y; const L = Math.hypot(dx, dy) || 1;
    const nx = -dy / L, ny = dx / L; const side = i % 2 ? 1 : -1; const amp = Math.min(46, L * 0.32);
    let c1 = { x: a.x + dx * 0.3 + nx * amp * side, y: a.y + dy * 0.3 + ny * amp * side };
    let c2 = { x: a.x + dx * 0.7 - nx * amp * side * 0.8, y: a.y + dy * 0.7 - ny * amp * side * 0.8 };
    if (Math.abs(dy) > Math.abs(dx)) { // row change: a wide U-bend swinging out toward the screen edge (wheel-like)
      const out = a.x > 200 ? 1 : -1;
      c1 = { x: a.x + out * 105, y: a.y + dy * 0.1 }; c2 = { x: b.x + out * 105, y: b.y - dy * 0.1 };
    }
    for (let k = 0; k < 24; k++) { const t = k / 24, u = 1 - t;
      pts.push({ x: u * u * u * a.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * b.x, y: u * u * u * a.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * b.y }); }
  }
  const e = nodePos(C.LEVELS.length - 1); pts.push({ x: e.x, y: e.y });
  return (S.mapRoad = pts);
}
function drawMapRoad() {
  const pts = mapRoadPoints(); let done = 0; while (done < S.save.levels.length && S.save.levels[done].cleared) done++;
  const path = () => { ctx.beginPath(); pts.forEach((p, k) => (k ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y))); };
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  path(); ctx.lineWidth = 22; ctx.strokeStyle = 'rgba(160,110,85,0.35)'; ctx.stroke();           // soft edge
  path(); ctx.lineWidth = 16; ctx.strokeStyle = '#f6dcc0'; ctx.stroke();                         // sandy road
  // travelled part of the road glows a little warmer
  const doneIdx = Math.min(pts.length - 1, done * 24);
  if (doneIdx > 0) { ctx.beginPath(); for (let k = 0; k <= doneIdx; k++) (k ? ctx.lineTo(pts[k].x, pts[k].y) : ctx.moveTo(pts[k].x, pts[k].y)); ctx.lineWidth = 16; ctx.strokeStyle = '#ffe3a8'; ctx.stroke(); }
  path(); ctx.setLineDash([2, 13]); ctx.lineDashOffset = -S.t * 6; ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(200,140,110,0.75)'; ctx.stroke(); ctx.setLineDash([]); // crumb trail
  ctx.restore();
  // a few tufts and pebbles along the road (fixed, decorative)
  for (let k = 12; k < pts.length - 6; k += 29) { const p = pts[k], q = pts[k + 1]; const dx = q.x - p.x, dy = q.y - p.y, L = Math.hypot(dx, dy) || 1; const s = k % 2 ? 1 : -1;
    const tx = p.x - dy / L * 17 * s, ty = p.y + dx / L * 17 * s;
    if (k % 3) { ctx.beginPath(); for (const a of [-0.5, 0, 0.5]) { ctx.moveTo(tx, ty); ctx.lineTo(tx + Math.sin(a) * 6, ty - Math.cos(a) * 7); } ctx.lineWidth = 2; ctx.strokeStyle = '#8fcf86'; ctx.lineCap = 'round'; ctx.stroke(); }
    else A.blob(ctx, tx, ty, 3.2, 2.4, '#d9c6cf', 1.4); }
}
// the gate between two worlds: world name, its treat, and (while locked) what it takes to open it (v0.5 item 14)
function drawWorldGate(w) {
  const W2 = C.WORLDS.find((x) => x.id === w); const y = gateY(w); const open = M.worldUnlocked(S.save, w);
  const prev = W2.unlock ? (W2.unlock.allLevelsWonInWorld ?? w - 1) : w - 1;
  panel(40, y - 30, 320, 60, open ? '#fff1f6' : '#efe7ec', 18);
  ctx.save(); ctx.translate(76, y + 2); ctx.scale(0.62, 0.62); A.drawTreat(ctx, W2.treat, 0, 0, 1, S.t, { face: open ? 'happy' : 'content' }); ctx.restore();
  A.text(ctx, `World ${w}: ${W2.name}`, 214, y - 12, 17, open ? '#ff8fab' : '#b9a6b2');
  if (open) plainText('Open! Beat the queen at the top.', 214, y + 12, 11.5, '#6b5562', 'center', '600');
  else {
    const won = C.LEVELS.filter((L, i) => L.world === prev && S.save.levels[i].cleared).length, total = C.LEVELS.filter((L) => L.world === prev).length;
    plainFit(`Locked: win all ${total} levels (${won}/${total}) + ${W2.unlock.minStarsInWorld} stars (${M.worldStars(S.save, prev)}/${total * 3})`, 214, y + 12, 262, 11.5, '#a0607e', 'center', '700');
    // padlock
    ctx.save(); ctx.translate(346, y - 22); A.rr(ctx, -8, -3, 16, 13, 3); ctx.fillStyle = '#8c8090'; ctx.fill(); ctx.beginPath(); ctx.arc(0, -4, 5.5, Math.PI, 0); ctx.lineWidth = 3; ctx.strokeStyle = '#8c8090'; ctx.stroke(); ctx.restore();
  }
}
// v0.4 item 17: the Cards button blinks for 5 s (blink only) - first time a card is affordable, first time after a loss
function updateCardsBlink() {
  if ((S.cardsBlinkUntil || 0) > S.t) return;
  if (M.checkCardBlink(S.save)) { S.cardsBlinkUntil = S.t + C.ECONOMY.cardsBlinkSec; persist(); }
}
function cardsBlinkOn() { return (S.cardsBlinkUntil || 0) > S.t && Math.floor((S.cardsBlinkUntil - S.t) * 3) % 2 === 0; }
function renderMapScreen() {
  // title
  ctx.save(); ctx.translate(200, 60);
  const wob = Math.sin(S.t * 2) * 2;
  A.text(ctx, 'Crumb', -22, -8 + wob, 40, '#ffd27a');
  A.text(ctx, 'Defense', 26, 28 - wob, 36, '#ffb3c1');
  ctx.restore();
  A.drawCookie(ctx, 64, 66, 0.9, S.t, {});
  ctx.save(); ctx.translate(336, 86); ctx.scale(1.6, 1.6); A.drawAnt(ctx, 'worker', (S.t * 1.2) % 1); ctx.restore();
  // v0.5 item 9: diamonds to the LEFT of the coins, on the same row
  panel(158, 112, 110, 36, '#fff6ee', 18); A.diamondIcon(ctx, 178, 130, 1.1); A.text(ctx, String(S.save.diamonds || 0), 224, 131, 18, '#7fd3ff');
  panel(276, 112, 116, 36, '#fff6ee', 18); A.coinIcon(ctx, 296, 130, 1.2); A.text(ctx, String(S.save.coins), 344, 131, 18, '#ffd45e');
  // Reward Calendar badge (v0.4 item 11: a flat SQUARE with soft rounded corners; glows while today's prize is waiting)
  const claim = Cal.canClaim(S.save, now());
  { const bx = 14, by = 110, bs = 66;
    if (claim) { A.rr(ctx, bx - 4, by - 4, bs + 8, bs + 8, 20); ctx.fillStyle = `rgba(255,212,94,${0.3 + 0.25 * Math.sin(S.t * 5)})`; ctx.fill(); }
    A.rr(ctx, bx, by, bs, bs, 16); ctx.fillStyle = claim ? '#ffe7a8' : '#fbe3ee'; ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = A.INK; ctx.stroke();
    A.giftIcon(ctx, bx + bs / 2, by + 26 + (claim ? Math.sin(S.t * 5) * 1.5 : 0), 1.05);
    plainText('Calendar', bx + bs / 2, by + 52, 11, '#5a4652', 'center', '700');
    if (claim) { A.blob(ctx, bx + bs - 2, by + 2, 8, 8, '#ff6f91', 1.6); A.text(ctx, '!', bx + bs - 2, by + 2.5, 12); }
    button('calendar', bx - 4, by - 4, bs + 8, bs + 8, () => openCalendar()); }
  // scrolling stage map (clipped between the header and the bottom buttons)
  S.mapScroll = clampScroll(S.mapScroll || 0);
  const sc = S.mapScroll;
  ctx.save(); ctx.beginPath(); ctx.rect(-200, MAPVIEW.top, W + 400, MAPVIEW.bottom - MAPVIEW.top); ctx.clip();
  ctx.translate(0, sc);
  drawMapRoad();
  for (const w of C.WORLDS) if (w.id > 1) drawWorldGate(w.id);
  S.layoutNodes = [];
  for (let i = 0; i < C.LEVELS.length; i++) {
    const p = nodePos(i); const L = S.save.levels[i]; const open = M.levelUnlocked(S.save, i);
    const w = C.worldOf(i), boss = i === C.WORLD_START[w] + C.WORLDS.find((x) => x.id === w).levels - 1;
    const isNext = open && !L.cleared;
    const bounce = isNext ? Math.abs(Math.sin(S.t * 3)) * 4 : 0;
    A.mapNode(ctx, p.x, p.y - bounce, i, { open, cleared: L.cleared, next: isNext, stars: L.stars, boss }, S.t);
    if (boss) { ctx.save(); ctx.translate(p.x + 24, p.y - 30 - bounce); ctx.scale(0.55, 0.55); A.drawAnt(ctx, C.QUEENS[w].type, 0.2); ctx.restore(); }
    for (let s2 = 0; s2 < 3; s2++) A.starShape(ctx, p.x - 18 + s2 * 18, p.y + 32, 7, s2 < L.stars ? '#ffd45e' : '#e8dde4', 1.6);
    A.text(ctx, C.LEVELS[i].name, p.x, p.y + 48, 11, '#7a5a6a', 'center', null);
    const sy = p.y + sc; S.layoutNodes.push({ i, x: p.x, y: sy });
    if (open && sy > MAPVIEW.top + 10 && sy < MAPVIEW.bottom - 10) button('lvl' + i, p.x - 30, sy - 30, 60, 60, () => openPrep(i));
  }
  ctx.restore();
  // scroll hint while world 2 is out of view
  const gy = gateY(2) + sc;
  if (gy < MAPVIEW.top - 10) {
    const a = 0.75 + 0.25 * Math.sin(S.t * 4);
    ctx.save(); ctx.globalAlpha = a; A.rr(ctx, 128, MAPVIEW.top + 4, 144, 26, 13); ctx.fillStyle = 'rgba(90,64,88,0.85)'; ctx.fill();
    plainText('\u25B2 World 2 - scroll up', 200, MAPVIEW.top + 17.5, 11.5, '#ffffff', 'center', '700'); ctx.restore();
  }
  // v0.7.2 C16: the bottom buttons moved into the fixed tab bar (renderTabBar); Snd / Reset live in the settings panel behind the gear
  updateCardsBlink();
  A.blob(ctx, 370, 26, 19, 19, '#fff6ee', 2.2); drawGearIcon(370, 26, 12); button('gear', 344, 2, 52, 52, () => { S.settings = { t: 0 }; S.confirmReset = 0; sfx('tap'); });
  if (S.cal) renderCalendar();
  else if (S.settings) renderSettings();
  else if (M.zapperGiftPending(S.save) && !S.reveal.length) onboardSpot(tabRect(2), 'shop', () => go('shop'), 'A free pack waits in the Shop!');
  plainText('v' + C.VERSION, 392, 650, 11, '#a08090', 'right', '600'); // v0.7: version label
  renderUiFx(1 / 60);
}
// ---------------- v0.6 item 5: one-time onboarding (dim everything except one button + a pointing finger) ----------------
function onboardSpot(R, id, onTap, msg) {
  ctx.save();
  // full-screen dim with a bright cut-out: the hole is added to the SAME path (A.rr would beginPath() and wipe the rect)
  ctx.beginPath(); ctx.rect(-2000, -2000, W + 4000, H + 4000);
  { const x = R.x - 6, y = R.y - 6, w = R.w + 12, h = R.h + 14, r = Math.min((R.r || 14) + 4, w / 2, h / 2);
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  ctx.fillStyle = 'rgba(40,26,38,0.66)'; ctx.fill('evenodd');
  const g = 0.5 + 0.5 * Math.sin(S.t * 5);
  A.rr(ctx, R.x - 6, R.y - 6, R.w + 12, R.h + 14, (R.r || 14) + 4); ctx.lineWidth = 3 + g * 2; ctx.strokeStyle = `rgba(255,227,110,${0.6 + 0.4 * g})`; ctx.stroke();
  ctx.restore();
  button('onboardBlock', -2000, -2000, W + 4000, H + 4000, () => {}); // only the highlighted button works
  button(id, R.x, R.y, R.w, R.h, onTap);
  const fx = R.x + R.w / 2 + 18, fy = R.y - 22 - Math.abs(Math.sin(S.t * 4)) * 12;
  drawFinger(fx, fy);
  if (msg) { const my = R.y < 260 ? R.y + R.h + 22 : Math.max(90, R.y - 104); panel(60, my, 280, 40, '#fff6ee', 16); plainFit(msg, 200, my + 20, 256, 15, '#e0607e', 'center', '800'); }
}
// a cartoon hand pointing down at (x, y) (the fingertip)
function drawFinger(x, y) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(0.35);
  ctx.lineJoin = 'round'; ctx.lineWidth = 2.6; ctx.strokeStyle = A.INK; ctx.fillStyle = '#ffe2c8';
  A.rr(ctx, -6, -34, 12, 34, 6); ctx.fill(); ctx.stroke();              // index finger
  A.rr(ctx, -15, -50, 34, 26, 11); ctx.fill(); ctx.stroke();            // fist
  for (const k of [0, 1, 2]) { ctx.beginPath(); ctx.moveTo(-3 + k * 7, -50); ctx.lineTo(-3 + k * 7, -40); ctx.lineWidth = 1.6; ctx.stroke(); }
  A.rr(ctx, -16, -62, 36, 14, 5); ctx.fillStyle = '#9ad0ff'; ctx.lineWidth = 2.4; ctx.fill(); ctx.stroke(); // sleeve cuff
  ctx.beginPath(); ctx.ellipse(0, -6, 3, 2, 0, 0, 7); ctx.fillStyle = '#fff3ea'; ctx.fill();   // nail shine
  ctx.restore();
}

// ---------------- REWARD CALENDAR (v0.3 items 6 + 9) ----------------
function prizeIcon(p, x, y, s = 1) {
  if (p.kind === 'coins') { A.coinIcon(ctx, x - 6 * s, y + 2 * s, 1.1 * s); A.coinIcon(ctx, x + 5 * s, y - 3 * s, 1.1 * s); }
  else if (p.kind === 'diamonds') { A.diamondIcon(ctx, x, y, 1.25 * s); }
  else if (p.kind === 'card') { ctx.save(); ctx.translate(x, y); ctx.rotate(-0.12); A.rr(ctx, -11 * s, -14 * s, 22 * s, 28 * s, 5 * s); ctx.fillStyle = p.level >= 2 ? '#ffd27a' : '#b5d8ff'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = A.INK; ctx.stroke(); A.text(ctx, 'L' + p.level, 0, 0.5, 11 * s, '#fff'); ctx.restore(); }
  else if (p.kind === 'booster' || p.kind === 'bonus') { ctx.save(); ctx.translate(x, y); ctx.scale(0.8 * s, 0.8 * s); A.drawBonusIcon(ctx, p.id, S.t); ctx.restore(); }
}
function prizeLabel(p) {
  if (!p) return '';
  if (p.kind === 'coins') return `${p.count} coins`;
  if (p.kind === 'diamonds') return `${p.count} diamonds`;
  // v0.5 item 7: a won card goes straight into the inventory at its level
  if (p.kind === 'card') return p.id ? (p.newCard ? `New tower: ${C.TOWERS[p.id].name} (L${p.level})` : `${C.TOWERS[p.id].short} L${p.level} - in your Cards`) : `L${p.level} tower card`;
  if (p.kind === 'bonus' || p.kind === 'booster') return `1 ${C.BONUSES[p.id].name} booster`;
  return '';
}
function renderCalendar() {
  const K = C.CALENDAR; const st = Cal.status(S.save, now()); const CA = S.cal; CA.t += 1 / 60;
  ctx.fillStyle = 'rgba(60,40,55,0.55)'; ctx.fillRect(-2000, -2000, W + 4000, H + 4000);
  button('calBlock', -2000, -2000, W + 4000, H + 4000, () => {});
  const pop = Math.min(1, CA.t * 5); ctx.save(); ctx.translate(200, 360); ctx.scale(0.85 + 0.15 * pop, 0.85 + 0.15 * pop); ctx.translate(-200, -360);
  panel(18, 62, 364, 600, '#fff6ee');
  A.giftIcon(ctx, 56, 94, 1.1); A.text(ctx, 'Daily Rewards', 214, 92, 26, '#ffb3c1');
  plainText('One prize every day you visit.', 214, 118, 12, '#6b5562', 'center');
  // monthly bar = streak
  const shown = CA.result ? CA.result.streak : st.streak;
  plainText('Monthly streak', 36, 142, 13, '#3d2a36', 'left', '700');
  plainText(`${shown}/${st.monthLength}`, 364, 142, 13, '#3d2a36', 'right', '700');
  const bx = 36, bw = 328, segW = bw / st.monthLength;
  for (let i = 0; i < st.monthLength; i++) {
    const on = i < shown; A.rr(ctx, bx + i * segW + 0.8, 152, segW - 1.6, 14, 3);
    ctx.fillStyle = on ? (i === shown - 1 && CA.result ? '#ffd45e' : '#ff9ec0') : '#efe2e8'; ctx.fill();
  }
  ctx.lineWidth = 2; A.rr(ctx, bx - 2, 150, bw + 4, 18, 6); ctx.strokeStyle = A.INK; ctx.stroke();
  // v0.4 item 1: monthly boxes - bigger and more colourful; day 30 is the biggest and the most attractive
  const ms = Object.keys(st.milestones || {}).map(Number).sort((a, b) => a - b);
  ms.forEach((m, k) => {
    const tier = m >= st.monthLength ? 3 : Math.min(2, k + 1);
    const sc = tier === 3 ? 1.55 : tier === 2 ? 1.12 : 1.0;
    const mx = Math.min(bx + bw - 34, bx + (m - 0.5) * segW), my = tier === 3 ? 200 : 194;
    ctx.beginPath(); ctx.moveTo(bx + (m - 0.5) * segW, 168); ctx.lineTo(mx, my - 14 * sc); ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(82,60,75,0.35)'; ctx.stroke();
    A.monthBox(ctx, mx, my, sc, tier, S.t, shown >= m);
    plainText(`Day ${m}`, mx, my + 24 * sc - (tier === 3 ? 4 : 0), tier === 3 ? 11 : 10, tier === 3 ? '#c27a00' : '#6b5562', 'center', '700');
  });
  if (st.resetPending && !CA.result) plainText('You missed a day - the streak restarts at 1.', 200, 256, 11, '#c0392b', 'center', '600');
  else plainText('Collect every day to keep the streak. Bigger prizes as it grows!', 200, 256, 11, '#6b5562', 'center');
  // v0.4 item 2: weekly cycle as a 3x3 square - days 1-6 in two rows of three, day 7 = one wide tile across the bottom row
  plainText('Your 7-day cycle', 36, 276, 13, '#3d2a36', 'left', '700');
  st.tiles.forEach((tl, i) => {
    const big = i === 6; const row = big ? 2 : Math.floor(i / 3), col = big ? 0 : i % 3;
    const gap = 8, cw = (328 - 2 * gap) / 3, rh = 74;
    const w = big ? 328 : cw, h = big ? 84 : rh;
    const x = 36 + col * (cw + gap), y = 286 + row * (rh + gap);
    const today = tl.state === 'today', claimed = tl.state === 'claimed', missed = tl.state === 'missed';
    const glow = today ? 0.5 + 0.5 * Math.sin(S.t * 5) : 0;
    ctx.save();
    if (today) { A.rr(ctx, x - 4, y - 4, w + 8, h + 8, 16); ctx.fillStyle = `rgba(255,212,94,${0.35 + glow * 0.4})`; ctx.fill(); }
    A.rr(ctx, x, y, w, h, 13);
    if (big && !claimed && !missed) { const g = ctx.createLinearGradient(x, y, x + w, y + h); g.addColorStop(0, '#fff1c9'); g.addColorStop(1, '#ffe1ec'); ctx.fillStyle = g; }
    else ctx.fillStyle = claimed ? '#e3f6dc' : missed ? '#ece6ea' : today ? '#fff1c9' : '#ffffff';
    ctx.fill();
    ctx.lineWidth = today ? 3.5 : big ? 2.6 : 2; ctx.strokeStyle = today ? '#e8a620' : big ? '#e0a830' : A.INK; ctx.stroke();
    plainText(`Day ${i + 1}`, x + 9, y + 13, 11, '#6b5562', 'left', '700');
    if (missed) plainText('missed', x + w - 8, y + 13, 10, '#8c7a86', 'right', '600');
    if (today) A.text(ctx, 'TAP!', x + w - 22, y + 13, 12, '#ff8fab');
    if (missed) ctx.globalAlpha = 0.45;
    const bobY = today ? Math.sin(S.t * 4) * 2 : 0;
    if (big) {
      // two prizes: a level-2 card + 5 diamonds
      for (let k = 0; k < 2; k++) A.starShape(ctx, x + (k ? w - 34 : 34), y + 42 + Math.sin(S.t * 2 + k * 2) * 3, 5, '#fff7a8', 1.2);
      prizeIcon({ kind: 'card', level: tl.prize.level }, x + w / 2 - 52, y + 40 + bobY, 1.35);
      A.text(ctx, '+', x + w / 2, y + 40, 20, '#e0a830');
      const ex = tl.prize.extra || { kind: 'diamonds', count: 0 };
      prizeIcon(ex, x + w / 2 + 50, y + 40 + bobY, 1.5);
      plainFit(`L${tl.prize.level} card + ${ex.count} diamonds`, x + w / 2, y + 72, w - 20, 13, '#3d2a36', 'center', '700');
    } else {
      prizeIcon(tl.prize, x + w / 2, y + 38 + bobY, 1.05);
      const amt = tl.prize.kind === 'card' ? `L${tl.prize.level} card` : tl.prize.kind === 'coins' ? `${tl.prize.count} coins` : tl.prize.kind === 'diamonds' ? `${tl.prize.count} diamonds` : '1 booster';
      plainFit(amt, x + w / 2, y + 63, w - 10, 12, '#3d2a36', 'center', '700');
    }
    ctx.globalAlpha = 1;
    if (claimed) { ctx.beginPath(); ctx.moveTo(x + w - 26, y + h - 14); ctx.lineTo(x + w - 18, y + h - 7); ctx.lineTo(x + w - 6, y + h - 22); ctx.lineWidth = 4; ctx.strokeStyle = '#3f9a46'; ctx.lineCap = 'round'; ctx.stroke(); }
    ctx.restore();
    button('calTile' + i, x, y, w, h, () => {
      if (today && !CA.result) { const r = Cal.claim(S.save, now()); if (r.ok) { CA.result = r; CA.rt = 0; persist(); sfx('upgrade');
        for (const pz of [r.prize, r.extra, r.milestone]) if (pz && pz.kind === 'card' && pz.reveal) queueReveal(pz.id, pz.level, pz.newCard, S.t + 0.7); for (let k = 0; k < 14; k++) addUi({ k: 'starBurst', x: x + w / 2, y: y + 40, a: k / 14 * Math.PI * 2, life: 0.8, max: 0.8 }); } }
      else if (missed) toast('Missed - this day has passed');
      else if (claimed) toast('Already collected');
      else { const n = i - st.tile; toast(n === 1 ? 'Comes on your next day in the game' : `Comes in ${n} more days in the game`); }
    });
  });
  // claimed: prize reveal
  if (CA.result) {
    CA.rt += 1 / 60; const k = Math.min(1, CA.rt * 4);
    ctx.save(); ctx.translate(200, 566); ctx.scale(0.6 + 0.4 * k, 0.6 + 0.4 * k);
    A.rr(ctx, -160, -26, 320, 52, 16); ctx.fillStyle = '#fff2b8'; ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = '#e0a830'; ctx.stroke();
    prizeIcon(CA.result.prize, -128, 0, 1.05);
    const extras = [CA.result.extra && `+ ${prizeLabel(CA.result.extra)}`, CA.result.milestone && `+ streak gift: ${prizeLabel(CA.result.milestone)}`].filter(Boolean);
    plainFit((CA.result.prize.kind === 'card' ? 'You won a card: ' : 'You got: ') + prizeLabel(CA.result.prize), 14, extras.length ? -8 : 0, 250, 15, '#8a4e08', 'center', '700');
    if (extras.length) plainFit(extras.join('  '), 14, 12, 250, 12, '#8a4e08', 'center', '600');
    ctx.restore();
  } else if (st.claimable) plainText("Tap today's tile to collect your prize!", 200, 560, 13, '#e0607e', 'center', '700');
  else plainText('Come back tomorrow for the next prize.', 200, 560, 13, '#6b5562', 'center', '600');
  // balances
  // v0.5 item 9: diamonds left of the coins, same row
  A.diamondIcon(ctx, 120, 596, 1); A.text(ctx, String(S.save.diamonds || 0), 152, 597, 15, '#7fd3ff');
  A.coinIcon(ctx, 232, 596, 1.1); A.text(ctx, String(S.save.coins), 266, 597, 15, '#ffd45e');
  ctx.restore();
  drawButton(110, 610, 180, 44, CA.result || !st.claimable ? 'Close' : 'Later', '#9fe0b5');
  button('calClose', 106, 606, 188, 52, () => { S.cal = null; sfx('tap'); });
}

// ---------------- CARD drawing ----------------
function drawCard(x, y, w, h, type, opt = {}) {
  const T = C.TOWERS[type];
  ctx.save();
  if (opt.lift) y -= opt.lift;
  if (opt.dim) ctx.globalAlpha = 0.55;
  A.rr(ctx, x, y + 4, w, h, 14); ctx.fillStyle = 'rgba(74,52,66,0.28)'; ctx.fill();
  A.rr(ctx, x, y, w, h, 14);
  const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, A.shade(T.color, 0.5)); g.addColorStop(1, T.color);
  ctx.fillStyle = opt.locked ? '#ddd3da' : g; ctx.fill();
  ctx.lineWidth = opt.selected ? 4 : 2.5; ctx.strokeStyle = opt.selected ? (opt.selCol || '#ff6f91') : A.INK; ctx.stroke();
  if (opt.locked) {
    A.text(ctx, '?', x + w / 2, y + h * 0.42, 30, '#fff');
    A.text(ctx, opt.lockText || 'Locked', x + w / 2, y + h - 14, 10, '#7a6a76', 'center', null);
    ctx.restore(); return;
  }
  ctx.save(); ctx.beginPath(); A.rr(ctx, x + 4, y + 4, w - 8, h - 8, 11); ctx.clip();
  const nameY = y + h - (opt.cost != null ? 31 : 13);
  const iconY = y + (nameY - y) * 0.62 + 4;
  ctx.beginPath(); ctx.arc(x + w / 2, iconY - 8, w * 0.32, 0, 7); ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.fill();
  const iconS = Math.min(w / 58, (nameY - y) / 58);
  ctx.translate(x + w / 2, iconY); ctx.scale(iconS, iconS); A.drawTower(ctx, type, S.t, null);
  ctx.restore();
  const tag = T.place === 'path' ? 'on trail' : (T.targets === 'air' ? 'air only' : type === 'laser' ? 'gnd+air' : '');
  if (tag && h > 70 && !opt.badge) A.text(ctx, tag, x + w - 7, y + 11, 9, '#fff', 'right');
  fitText(T.short || T.name, x + w / 2, nameY, w - 10, w < 85 ? 13 : 14, '#fff');
  if (opt.level) { A.blob(ctx, x + 12, y + 12, 11, 10, '#ffe36e', 2); A.text(ctx, 'L' + opt.level, x + 12, y + 12.5, 10, '#7a4a2a', 'center', null); }
  if (opt.cost != null) {
    A.rr(ctx, x + 10, y + h - 21, w - 20, 17, 8); ctx.fillStyle = opt.afford ? '#fff8ec' : '#ffd6d6'; ctx.fill(); ctx.lineWidth = 1.8; ctx.strokeStyle = A.INK; ctx.stroke();
    A.crumbIcon(ctx, x + w / 2 - (opt.cost === 0 ? 22 : 14), y + h - 12.5, 0.75);
    A.text(ctx, opt.cost === 0 ? 'FREE' : String(opt.cost), x + w / 2 + 6, y + h - 12, 12, opt.afford ? '#7a4a2a' : '#c0392b', 'center', null);
  }
  if (opt.badge) { A.blob(ctx, x + w - 11, y + 11, 11, 11, '#ff8fab', 2); A.text(ctx, opt.badge, x + w - 11, y + 11.5, 12, '#fff'); }
  // v0.5 items 6/7: '!' = a merge is ready on this card; '+1' = a won card you have not looked at yet
  if (opt.mergeReady) { const p = 1 + Math.sin(S.t * 6) * 0.08; ctx.save(); ctx.translate(x + w - 10, y + 10); ctx.scale(p, p); A.blob(ctx, 0, 0, 11, 11, '#ff6f91', 2); A.text(ctx, '!', 0, 0.5, 14, '#fff'); ctx.restore(); }
  if (opt.fresh) { A.rr(ctx, x + w / 2 - 17, y - 9, 34, 17, 8); ctx.fillStyle = '#ffd45e'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = A.INK; ctx.stroke(); A.text(ctx, 'NEW', x + w / 2, y - 0.5, 10, '#fff'); }
  ctx.restore();
}
function antIcon(type, x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); A.drawAnt(ctx, type, (S.t * 1.3) % 1); ctx.restore(); }

// ---------------- PREP ----------------
function renderPrep() {
  const i = S.levelIndex, L = C.LEVELS[i];
  panel(12, 12, 376, 696, '#fff6ee');
  A.text(ctx, `Level ${i + 1}`, 200, 40, 26, '#ffb3c1');
  A.text(ctx, `${L.name}  -  ${C.MAPS[L.map].name}`, 200, 66, 13, '#7a5a6a', 'center', null);
  // enemy preview
  const ants = levelAntTypes(i);
  A.text(ctx, 'Incoming ants', 30, 92, 14, '#7a5a6a', 'left', null);
  A.text(ctx, `${L.waveCount} waves`, 370, 92, 14, '#7a5a6a', 'right', null);
  if (levelHasFlyers(i)) { A.rr(ctx, 152, 82, 132, 20, 10); ctx.fillStyle = '#d7ecff'; ctx.fill(); ctx.lineWidth = 1.6; ctx.strokeStyle = '#5a9fe0'; ctx.stroke(); plainText('Flyers in this level', 218, 92.5, 11, '#2f6fae', 'center', '800'); } // v0.7 (Should): flyers preview
  // icons share the panel width; big ants (queen) are scaled so nothing overflows or reaches the header line
  S.layoutPrepAnts = [];
  const n = ants.length, slot = Math.min(76, 340 / n), x0 = 200 - (slot * (n - 1)) / 2;
  ants.forEach((t, k) => {
    const x = x0 + k * slot, sz = C.ANTS[t].size;
    const sc = Math.min(1.15, (slot - 6) / (40 * sz), 30 / (34 * sz)); // width ~40*size, height above feet ~34*size
    antIcon(t, x, 136, sc);
    S.layoutPrepAnts.push({ type: t, x: x - 20 * sz * sc, y: 136 - 34 * sz * sc, w: 40 * sz * sc, h: 46 * sz * sc });
    fitText(C.ANTS[t].name.replace(' Ant', ''), x, 160, slot - 4, 10, '#7a5a6a');
  });
  // deck
  const unlocked = M.unlockedCards(S.save);
  A.text(ctx, `Your deck (${S.prep.deck.length}/${C.BATTLE.deckSize}) - tap to pick`, 30, 182, 14, '#7a5a6a', 'left', null);
  { const cap = worldCardLevelCap(i); if (cap && unlocked.some((id) => S.save.cards[id].level > cap)) plainText(`Cards act as L${cap} max`, 370, 182, 10, '#b0506a', 'right', '800'); } // v0.7 D-P4
  C.ALL_CARDS.forEach((id, k) => { // v0.6: 13 cards -> 5 columns x 3 rows
    const col = k % 5, row = Math.floor(k / 5);
    const x = 22 + col * 72, y = 196 + row * 98, w = 66, h = 90;
    const isU = unlocked.includes(id);
    const di = S.prep.deck.indexOf(id);
    drawCardPic(x, y, w, h, id, { locked: !isU, lockText: 'Shop or prize', selected: di >= 0, selCol: '#111111', badge: di >= 0 ? String(di + 1) : null, tag: true, level: isU ? S.save.cards[id].level : 0, dim: isU && di < 0 && S.prep.deck.length >= C.BATTLE.deckSize }); // v0.6.1: card picture
    if (isU) button('deck' + id, x, y, w, h, () => {
      const d = S.prep.deck; const j = d.indexOf(id);
      if (j >= 0) d.splice(j, 1); else if (d.length < C.BATTLE.deckSize) d.push(id); else toast('Deck is full (5). Tap a card to remove it.');
      sfx('tap');
    });
  });
  // bonuses
  const by = 500;
  A.text(ctx, `Boosters (bring ${C.BATTLE.bonusTypesToBring}, max ${C.BATTLE.maxBonusUses} uses)`, 30, by, 14, '#7a5a6a', 'left', null);
  C.BONUS_TYPES.forEach((bt, k) => {
    const x = 26 + k * 88, y = by + 14, w = 80, h = 74;
    const sel = S.prep.bonuses.includes(bt);
    const stock = S.save.bonusStock[bt] || 0;
    A.rr(ctx, x, y, w, h, 14); ctx.fillStyle = sel ? A.shade(C.BONUSES[bt].color, 0.2) : '#f3ebee'; ctx.fill();
    // selection = thick black border; a selected booster with 0 left = animated red "lava" border (warning only since v0.3)
    if (sel && stock <= 0) { A.lavaBorder(ctx, x, y, w, h, 14, S.t); }
    else { ctx.lineWidth = sel ? 4.5 : 2.5; ctx.strokeStyle = sel ? '#111111' : A.INK; ctx.stroke(); }
    ctx.save(); ctx.translate(x + w / 2, y + 28); ctx.scale(1.3, 1.3); A.drawBonusIcon(ctx, bt, S.t); ctx.restore();
    A.text(ctx, C.BONUSES[bt].name, x + w / 2, y + 54, 11, '#fff');
    A.text(ctx, 'x' + stock, x + w - 12, y + 12, 11, stock ? '#fff' : '#ff9a9a');
    button('bon' + bt, x, y, w, h, () => {
      const b = S.prep.bonuses; const j = b.indexOf(bt);
      if (j >= 0) b.splice(j, 1); else { b.push(bt); if (b.length > C.BATTLE.bonusTypesToBring) b.shift(); if (stock <= 0) zeroBonusAlert(bt); }
      sfx('tap');
    });
  });
  // warnings
  let warn = null;
  if (levelHasFlyers(i) && !S.prep.deck.some((d) => C.AIR_COUNTERS.includes(d))) warn = 'Flying ants ahead! Only Laser, Bug Zapper or the Crop Duster can hit them.';
  else if (ants.includes('gasmask') && S.prep.deck.includes('spray') && S.prep.deck.filter((d) => d !== 'spray' && C.TOWERS[d].kind === 'tower' && d !== 'fan').length < 2) warn = 'Gas-mask ants ignore Bug Spray - bring other damage too.';
  const issues = M.prepIssues(S.save, S.prep.bonuses);
  if (issues.length) warn = `You have 0 ${C.BONUSES[issues[0].bonus].name}s. Buy one during battle for ${C.ECONOMY.diamonds.boosterPriceStart} diamonds, or in the Shop.`;
  // warnings are word-wrapped inside an auto-height box (no overflow on narrow phones)
  S.layoutWarn = null;
  if (warn) {
    const lines = wrapLines(warn, 324, 11.5).slice(0, 3); const hh = 12 + lines.length * 14;
    panel(26, 646 - hh - 2, 348, hh, issues.length ? '#ffd9d0' : '#fff0c2', 12);
    lines.forEach((l, k) => A.text(ctx, l, 200, 646 - hh + 6 + k * 14 + 5, 11.5, issues.length ? '#c0392b' : '#b0602a', 'center', null));
    ctx.font = `bold 11.5px ${A.FONT}`;
    S.layoutWarn = { box: { x: 26, y: 646 - hh - 2, w: 348, h: hh }, lines: lines.map((l) => ctx.measureText(l).width), maxW: 324 };
  }
  drawButton(26, 652, 110, 48, 'Back', '#d9cfe0'); button('back', 26, 652, 110, 48, () => go('map'));
  const ready = S.prep.deck.length === Math.min(C.BATTLE.deckSize, unlocked.length);
  drawButton(150, 652, 224, 48, 'Defend!', '#9fe0b5', { disabled: !ready, size: 22 });
  button('start', 150, 652, 224, 48, () => {
    if (!ready) toast('Pick 5 cards');
    else startBattle(); // v0.3: a 0-stock booster is only a warning (it can be bought in battle with diamonds)
  });
  if (S.prepAlert) {
    S.prepAlert.t -= 1 / 60;
    ctx.save(); ctx.globalAlpha = Math.min(1, S.prepAlert.t * 4);
    const lines = wrapLines(S.prepAlert.msg, 250, 12.5);
    const hh = 22 + lines.length * 16; const y0 = 498 - hh;
    panel(60, y0, 280, hh, '#5a4058', 14);
    lines.forEach((l, k) => A.text(ctx, l, 200, y0 + 19 + k * 16, 12.5, '#ffd0d0', 'center', null));
    ctx.restore();
    if (S.prepAlert.t <= 0) S.prepAlert = null;
  }
}
function zeroBonusAlert(bt) { S.prepAlert = { msg: `0 ${C.BONUSES[bt].name}s left! In battle you can buy one for ${C.ECONOMY.diamonds.boosterPriceStart} diamonds (you have ${S.save.diamonds || 0}).`, t: 2.6, bonus: bt }; }
function wrapLines(str, maxW, size) {
  ctx.font = `bold ${size}px ${A.FONT}`; const out = []; let line = '';
  for (const w of str.split(' ')) { const test = line ? line + ' ' + w : w; if (ctx.measureText(test).width > maxW && line) { out.push(line); line = w; } else line = test; }
  if (line) out.push(line); return out;
}

// ---------------- BATTLE ----------------
function mapBg(b) {
  const key = b.mapId + pxRatio;
  if (!S.bgCache[key]) S.bgCache[key] = A.renderMapBackground(b.routes, b.map.theme, MAP_W, MAP_H, pxRatio, b.props);
  return S.bgCache[key];
}
function renderBattle(dt) {
  const b = S.battle; const t = S.t;
  // map frame
  ctx.save(); A.rr(ctx, -4, MAP_Y - 4, MAP_W + 8, MAP_H + 8, 10); ctx.fillStyle = A.INK; ctx.fill(); ctx.restore();
  ctx.drawImage(mapBg(b), 0, MAP_Y, MAP_W, MAP_H);
  ctx.save(); ctx.beginPath(); ctx.rect(0, MAP_Y, MAP_W, MAP_H); ctx.clip();
  ctx.translate(0, MAP_Y);
  // nest + cookie
  const p1 = b.path.pts[b.path.pts.length - 1];
  const nests = []; for (const rt of b.routes) { const q = rt.pts[0]; if (!nests.some((n) => Math.hypot(n.x - q.x, n.y - q.y) < 5)) nests.push(q); }
  for (const q of nests) A.drawNest(ctx, Math.max(30, Math.min(MAP_W - 30, q.x)), Math.max(26, Math.min(MAP_H - 20, q.y + 6)), t);
  // placement highlights
  const selCard = S.drag ? S.drag.i : (S.sel && S.sel.kind === 'card' ? S.sel.i : null);
  if (selCard != null) {
    const card = b.picks[selCard];
    for (let c = 0; c < C.GRID_COLS; c++) for (let r = 0; r < C.GRID_ROWS; r++) {
      const chk = b.canPlay(selCard, c, r);
      if (!chk.ok) continue;
      if (chk.upgrade) { ctx.beginPath(); ctx.arc((c + 0.5) * C.TILE, (r + 0.5) * C.TILE, 19 + Math.sin(t * 6) * 2, 0, 7); ctx.lineWidth = 3; ctx.strokeStyle = '#ffd45e'; ctx.stroke(); }
      else { A.rr(ctx, c * C.TILE + 4, r * C.TILE + 4, C.TILE - 8, C.TILE - 8, 8); ctx.fillStyle = C.TOWERS[card].place === 'path' ? 'rgba(255,200,90,0.28)' : 'rgba(120,220,150,0.25)'; ctx.fill(); }
    }
  }
  // v0.5 items 11/12: Move = every free cell this tower may stand on; Swap = every tower it can trade places with
  if (S.mode) {
    const m = S.mode;
    if (m.kind === 'move') {
      for (let c = 0; c < C.GRID_COLS; c++) for (let r = 0; r < C.GRID_ROWS; r++) if (b.canMoveTower(m.tower, c, r)) { A.rr(ctx, c * C.TILE + 4, r * C.TILE + 4, C.TILE - 8, C.TILE - 8, 8); ctx.fillStyle = 'rgba(127,211,255,0.33)'; ctx.fill(); }
    } else for (const o of b.towers) if (o !== m.tower && b.canSwapTowers(m.tower, o)) { ctx.beginPath(); ctx.arc(o.x, o.y, 19 + Math.sin(t * 6) * 2, 0, 7); ctx.lineWidth = 3; ctx.strokeStyle = '#c9b6f2'; ctx.stroke(); }
    ctx.beginPath(); ctx.arc(m.tower.x, m.tower.y, 21 + Math.sin(t * 8) * 1.5, 0, 7); ctx.lineWidth = 3.5; ctx.strokeStyle = '#7fd3ff'; ctx.stroke();
  }
  // ground layer: auras, clouds, decoy
  // v0.6 item 3: an on-path item covers exactly its own square tile - the aura is that square
  for (const tw of b.towers) {
    const tx = tw.c * C.TILE, ty = tw.r * C.TILE;
    if (tw.type === 'glue' || tw.type === 'pheromone') {
      A.rr(ctx, tx + 1, ty + 1, C.TILE - 2, C.TILE - 2, 6);
      ctx.fillStyle = tw.type === 'glue' ? 'rgba(255,240,170,0.35)' : `rgba(255,170,210,${0.18 + Math.sin(t * 3) * 0.06})`; ctx.fill();
    }
    if (tw.type === 'lava') { // v0.4 item 7: warm glow over the roasting tile
      A.rr(ctx, tx + 1, ty + 1, C.TILE - 2, C.TILE - 2, 6); ctx.fillStyle = `rgba(255,120,50,${0.26 + Math.sin(t * 3) * 0.06})`; ctx.fill();
    }
  }
  drawFanAreas(b);
  for (const c of b.clouds) {
    const f = c.left / c.total; ctx.save(); ctx.globalAlpha = Math.min(1, f * 2) * 0.55;
    for (let k = 0; k < 5; k++) { const a = k * 1.3 + t * 0.6; ctx.beginPath(); ctx.arc(c.x + Math.cos(a) * c.r * 0.45, c.y + Math.sin(a) * c.r * 0.3, c.r * 0.55, 0, 7); ctx.fillStyle = k % 2 ? '#b8eda0' : '#d4f7c4'; ctx.fill(); }
    ctx.restore();
  }
  if (b.decoy) { A.sugarCube(ctx, b.decoy.x, b.decoy.y - 6, 11); for (let k = 0; k < 3; k++) A.starShape(ctx, b.decoy.x + Math.cos(t * 3 + k * 2) * 18, b.decoy.y - 14 + Math.sin(t * 3 + k * 2) * 8, 3, '#fff7a8', 1); }
  // depth-sorted towers + ground ants
  const drawList = [];
  for (const tw of b.towers) drawList.push({ y: tw.y + (C.TOWERS[tw.type].place === 'path' ? -12 : 0), f: () => drawTowerObj(tw) });
  for (const a of b.ants) if (!a.flying) drawList.push({ y: a.y, f: () => drawAntObj(a) });
  for (const m of b.balls) drawList.push({ y: m.y, f: () => A.marble(ctx, m.x, m.y - m.r * 0.6, m.r, m.rot) });
  drawList.push({ y: p1.y + 10, f: () => A.drawTreat(ctx, treatKind(b), p1.x, p1.y, b.foodStored / b.cfg.foodHP, t, { ouch: S.cookieOuch > S.t, react: Treat.reaction(S.treat, S.t) }) }); // v0.5 item 3: faces only
  if (b.cfg.swatter && b.cfg.swatter.on) drawList.push({ y: p1.y + 14, f: () => drawGuard(b, p1) }); // v0.7.2 C13: the cookie guard (fly swatter)
  drawList.sort((u, v) => u.y - v.y);
  for (const d of drawList) d.f();
  for (const a of b.ants) if (a.flying) drawAntObj(a);
  // plane
  for (const pl of b.planes || []) {
    if (pl.d < -60 || pl.d > b.routes[pl.ri].length + 50) continue;
    for (let k = 0; k < 2; k++) addFx({ k: 'dust', x: pl.x + (Math.random() - 0.5) * 30, y: pl.y + (Math.random() - 0.5) * 16, life: 0.8, max: 0.8 });
    ctx.save(); ctx.translate(pl.x, pl.y - 30 + Math.sin(t * 6) * 2); ctx.scale(pl.dx > 0.1 ? -1.6 : 1.6, 1.6); A.drawBonusIcon(ctx, 'plane', t); ctx.restore();
  }
  renderFx(dt);
  if (t < 0 || b.time < b.freezeUntil) { ctx.fillStyle = 'rgba(190,235,255,0.22)'; ctx.fillRect(0, 0, MAP_W, MAP_H); }
  // ghost while dragging
  if (S.drag && S.drag.moved) {
    const tt = dragTile(S.drag);
    if (tt) {
      const card = b.picks[S.drag.i]; const chk = b.canPlay(S.drag.i, tt.c, tt.r);
      const gx = (tt.c + 0.5) * C.TILE, gy = (tt.r + 0.5) * C.TILE;
      const T = C.TOWERS[card]; const rng = towerStat(card, 'range', 1, S.save.cards[card].level);
      let ghostTw = null;
      if (chk.ok && !chk.upgrade && T.directional) { ghostTw = b.addTower(card, tt.c, tt.r); b.towers.pop(); }
      if (T.place === 'path') tileArea(tt.c, tt.r, chk.ok); // v0.6 item 3: its own tile
      else if (rng && !T.nearTrail) { ctx.beginPath(); ctx.arc(gx, gy, rng, 0, 7); ctx.fillStyle = chk.ok ? 'rgba(255,255,255,0.25)' : 'rgba(255,120,120,0.2)'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = chk.ok ? 'rgba(255,255,255,0.9)' : 'rgba(255,90,90,0.8)'; ctx.setLineDash([6, 5]); ctx.stroke(); ctx.setLineDash([]); }
      if (ghostTw) drawAim(ghostTw);
      ctx.save(); ctx.globalAlpha = 0.75; ctx.translate(gx, gy); A.drawTower(ctx, card, t, ghostTw); ctx.restore();
    }
  }
  // tower info
  if (S.info && S.info.tower) {
    const tw = S.info.tower; const T = C.TOWERS[tw.type];
    const rng = tw.stat('range');
    if (T.place === 'path') tileArea(tw.c, tw.r, true);
    else if (rng && !T.nearTrail) { ctx.beginPath(); ctx.arc(tw.x, tw.y, rng, 0, 7); ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = '#fff'; ctx.setLineDash([6, 5]); ctx.stroke(); ctx.setLineDash([]); }
    if (T.directional) drawAim(tw);
    ctx.beginPath(); ctx.arc(tw.x, tw.y, 21, 0, 7); ctx.lineWidth = 3; ctx.strokeStyle = '#ffe36e'; ctx.stroke();
  }
  ctx.restore();
  // map tap region (registered BEFORE the info panel so panel taps never fall through)
  button('map', 0, MAP_Y, MAP_W, MAP_H, mapTap);
  if (S.info && S.info.tower) renderTowerInfo(b, S.info);
  if (S.mode && !S.result) {
    const m = S.mode; panel(30, MAP_Y + 6, 340, 34, '#5a4058', 16);
    plainFit(m.kind === 'move' ? `Tap a free blue spot to move it (${C.ECONOMY.diamonds.moveTower} diamond)` : 'Tap the tower to swap with (free)', 182, MAP_Y + 23, 280, 12.5, '#ffffff', 'center', '700');
    A.blob(ctx, 350, MAP_Y + 23, 11, 11, '#ffb3b3', 1.8); A.text(ctx, 'x', 350, MAP_Y + 22.5, 12, '#fff');
    button('modeCancel', 300, MAP_Y + 2, 74, 42, () => { S.mode = null; });
  }
  renderHud(b);
  renderTray(b);
  renderUiFx(dt);
  if (S.paused && !S.result) renderPause();
  if (S.result) renderResult(dt);
  // v0.6.2 item 14: the queen-win 'Way to go' cheer is drawn ABOVE the result panel (it used to be hidden under it); the
  // panel and its buttons wait for the celebration (renderResult, C.UI.queenCheerHold). The fireworks are drawn after this.
  if (S.queenDown && S.t - S.queenDown.t < 4.5) drawQueenCheer(S.t - S.queenDown.t, S.queenDown.world);
  if (S.dialog && !S.paused && !S.result) renderDialog();
}
// v0.4 item 5 / v0.5 items 2 + 10b: NO direction arrows. The marble shows its roll (a dashed line from the tower edge down the
// straight trail next to it, ending with a small break mark at the wall / turn); with no trail next to it nothing is drawn.
// The fan just shows its area-of-effect circle (range ring while placing/selected, plus drawFanAreas on the board).
// v0.6 item 3: the area of an on-path item (and the Tractor's scoop tile) = one square tile, dashed outline
function tileArea(c, r, ok = true) {
  ctx.save(); A.rr(ctx, c * C.TILE + 1.5, r * C.TILE + 1.5, C.TILE - 3, C.TILE - 3, 6);
  ctx.fillStyle = ok ? 'rgba(255,255,255,0.25)' : 'rgba(255,120,120,0.2)'; ctx.fill();
  ctx.lineWidth = 2.2; ctx.strokeStyle = ok ? 'rgba(255,255,255,0.95)' : 'rgba(255,90,90,0.8)'; ctx.setLineDash([5, 4]); ctx.stroke(); ctx.restore();
}
function drawAim(tw) {
  if (tw.type === 'tractor') { if (tw.trailDir) tileArea(tw.trailDir.nc, tw.trailDir.nr, true); return; } // v0.6: its scoop tile
  if (tw.type !== 'ball' || !tw.trailDir) return;
  const dx = tw.ax, dy = tw.ay; const t = S.t;
  ctx.save();
  const len = Math.max(tw.runLen, 4), ex = tw.lx + dx * len, ey = tw.ly + dy * len;
  ctx.lineCap = 'round'; ctx.setLineDash([3, 7]); ctx.lineDashOffset = -t * 30; ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(120,200,255,0.9)';
  ctx.beginPath(); ctx.moveTo(tw.lx, tw.ly); ctx.lineTo(ex, ey); ctx.stroke(); ctx.setLineDash([]);
  A.starShape(ctx, ex, ey, 5.5, 'rgba(255,255,255,0.95)', 1.4); // the marble breaks here
  ctx.restore();
}
// v0.4 item 5: every placed fan shows its area of effect as a soft circle (gently pulses when it blows)
function drawFanAreas(b) {
  for (const tw of b.towers) {
    if (tw.type !== 'fan') continue;
    const R = tw.stat('range'); const k = Math.max(0, tw.fireFx || 0);
    ctx.beginPath(); ctx.arc(tw.x, tw.y, R, 0, 7);
    ctx.fillStyle = `rgba(168,230,224,${0.10 + k * 0.12})`; ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = `rgba(120,200,190,${0.45 + k * 0.4})`; ctx.stroke();
  }
}
// tower info: range on the map + Power / Rate / Range with units, next upgrade (before -> after).
// v0.3 item 11: readable text - regular weight, no outline, larger, dark ink on a light panel.
// v0.5 items 11/12: Move (1 diamond) and Swap (free) buttons on the panel.
const INFO_INK = '#3d2a36', INFO_SOFT = '#6b5562';
function plainFit(str, x, y, maxW, size, col, align = 'left', weight = '500') {
  ctx.font = `${weight} ${size}px ${A.FONT}`; const w = ctx.measureText(str).width;
  plainText(str, x, y, w > maxW ? size * maxW / w : size, col, align, weight);
}
function plainWrap(str, maxW, size, weight = '500') {
  ctx.font = `${weight} ${size}px ${A.FONT}`; const out = []; let line = '';
  for (const w of str.split(' ')) { const test = line ? line + ' ' + w : w; if (ctx.measureText(test).width > maxW && line) { out.push(line); line = w; } else line = test; }
  if (line) out.push(line); return out;
}
// v0.7 D-T6: the gain of an in-battle upgrade, as total damage vs. the level-1 tower ("x2 dmg" ... "x6 dmg"; Laser 1.7 ... 6.3)
function dmgGainText(type, lvl, cardLevel) { const g = upgradeGain(type, lvl, cardLevel); if (!(g > 1.01)) return ''; const r = Math.round(g * 10) / 10; return `x${Number.isInteger(r) ? r : r.toFixed(1)} dmg`; }
function levelHasFlyers(i) { return levelAntTypes(i).some((t) => C.ANTS[t].flying || (C.ANTS[t].spawn && C.ANTS[t].spawn.type && C.ANTS[C.ANTS[t].spawn.type] && C.ANTS[C.ANTS[t].spawn.type].flying)); }
const diffText = (type, d) => `${d.label} ${formatStat(type, d.key, d.from)} \u2192 ${formatStat(type, d.key, d.to)}`;
// the third stat box: the marble has no range - it shows how far it rolls at this spot / its width
function rollHere(tw) { return tw.trailDir ? `${tw.trailDir.run} tile${tw.trailDir.run > 1 ? 's' : ''}` : 'no roll'; }
function renderTowerInfo(b, info) {
  const tw = info.tower; const T = C.TOWERS[tw.type];
  if (info.until && S.t > info.until) { if (info.auto) { S.info = null; return; } info.changed = null; }
  const H2 = 140, py = tw.y + MAP_Y > 300 ? MAP_Y + 8 : MAP_Y + MAP_H - H2 - 8;
  S.layoutInfo = { x: 14, y: py, w: 372, h: H2 };
  panel(14, py, 372, H2, '#fffaf5', 14);
  ctx.font = `bold 15px ${A.FONT}`; const tW = Math.min(150, ctx.measureText(T.name).width);
  fitText(T.name, 26 + tW / 2, py + 17, 150, 15, '#ff8fab'); // title stays bold
  plainFit(`Lv ${tw.lvl}/${b.cfg.maxInBattleLevel} \u00b7 card L${tw.cardLevel}`, 34 + tW, py + 17, 222 - tW, 12, INFO_SOFT, 'left', '600');
  let desc = T.ability || T.desc;
  if (T.directional && !tw.trailDir) desc = tw.type === 'ball' ? 'No trail right next to it - the marble cannot roll here. Move it!' : tw.type === 'tractor' ? 'No trail right next to it - nothing to scoop here. Move it!' : 'No trail right next to it - no wind here. Move it!';
  plainWrap(desc, 346, 12.5).slice(0, 2).forEach((l, i) => plainText(l, 26, py + 38 + i * 16, 12.5, T.directional && !tw.trailDir ? '#c0392b' : INFO_INK));
  const keys = tw.type === 'tractor' ? ['liftSize', 'rate', 'scoop'] : ['power', 'rate', tw.type === 'ball' ? 'roll' : 'range'];
  const changed = new Set((info.changed || []).map((d) => d.key));
  keys.forEach((k, i) => {
    const x = 22 + i * 120, y = py + 66, w = 114, h = 38;
    const on = changed.has(k);
    A.rr(ctx, x, y, w, h, 10); ctx.fillStyle = on ? '#e2f8dc' : '#f7efeb'; ctx.fill(); ctx.lineWidth = on ? 2.4 : 1.2; ctx.strokeStyle = on ? '#55b85a' : '#e0cfd4'; ctx.stroke();
    plainFit(k === 'roll' ? 'Roll here' : k === 'scoop' ? 'Scoop' : statLabel(tw.type, k), x + 8, y + 11, w - 14, 11, INFO_SOFT);
    const d = (info.changed || []).find((q) => q.key === k);
    const val = k === 'roll' ? rollHere(tw) : k === 'scoop' ? (tw.trailDir ? 'trail tile beside it' : 'no trail') : d ? `${formatStat(tw.type, k, d.from)} \u2192 ${formatStat(tw.type, k, d.to)}` : formatStat(tw.type, k, tw.stat(k));
    plainFit(val, x + w / 2, y + 27, w - 12, 14, on ? '#2f8a36' : INFO_INK, 'center', '600');
  });
  const extra = (info.changed || []).filter((d) => !keys.includes(d.key));
  let line;
  if (extra.length) line = 'Upgraded: ' + extra.map((d) => diffText(tw.type, d)).join(', ');
  else if (tw.lvl < b.cfg.maxInBattleLevel) line = (dmgGainText(tw.type, tw.lvl + 1, tw.cardLevel) ? dmgGainText(tw.type, tw.lvl + 1, tw.cardLevel) + '! ' : '') + 'Next (drop same card): ' + upgradeDiff(tw.type, tw.lvl, tw.cardLevel).map((d) => diffText(tw.type, d)).join(', ');
  else line = 'Max level!';
  plainFit(line, 200, py + 122, 350, 12, extra.length ? '#2f8a36' : INFO_INK, 'center');
  button('infoClose', 14, py, 372, H2, () => { S.info = null; }); // registered after 'map' so it is on top (tapping the panel = the player's own close)
  // Move / Swap (on top of the panel's close area)
  const canMove = (S.save.diamonds || 0) >= C.ECONOMY.diamonds.moveTower;
  drawButton(256, py + 5, 62, 24, '', '#9fd8ff', { r: 10, disabled: !canMove });
  A.text(ctx, 'Move', 280, py + 17, 11.5); A.diamondIcon(ctx, 305, py + 17, 0.55); A.text(ctx, String(C.ECONOMY.diamonds.moveTower), 312, py + 17.5, 10);
  drawButton(322, py + 5, 58, 24, 'Swap', '#c9b6f2', { r: 10, size: 11.5, disabled: b.towers.length < 2 });
  button('infoMove', 252, py, 68, 40, () => startMode('move', tw));
  button('infoSwap', 320, py, 64, 40, () => startMode('swap', tw));
}
// v0.5 item 16: the queen is beaten -> fireworks + the cheer
function drawQueenCheer(age, world) {
  const k = Math.min(1, age / 0.35), fade = age > 3.8 ? Math.max(0, 1 - (age - 3.8) / 0.7) : 1;
  const msg = world === 2 ? ['Way to go,', 'you saved the cake!'] : ['Way to go,', 'you saved the cookies!'];
  ctx.save(); ctx.globalAlpha = fade; ctx.translate(200, MAP_Y + 210); const sc = 0.6 + 0.4 * k + Math.sin(age * 5) * 0.03; ctx.scale(sc, sc);
  A.rr(ctx, -170, -48, 340, 96, 24); ctx.fillStyle = 'rgba(90,64,88,0.82)'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = '#ffd45e'; ctx.stroke();
  A.text(ctx, msg[0], 0, -18, 26, '#ffe36e'); A.text(ctx, msg[1], 0, 16, 24, '#ffffff');
  ctx.restore();
}
function fitText(str, x, y, maxW, size, col) {
  ctx.font = `bold ${size}px ${A.FONT}`;
  const w = ctx.measureText(str).width;
  A.text(ctx, str, x, y, w > maxW ? size * maxW / w : size, col);
}
function wrapText(s, x, y, maxW, size, col) {
  ctx.font = `bold ${size}px ${A.FONT}`; const words = s.split(' '); let line = '', yy = y;
  for (const w of words) { const test = line ? line + ' ' + w : w; if (ctx.measureText(test).width > maxW) { A.text(ctx, line, x, yy, size, col, 'left', null); line = w; yy += size + 3.5; } else line = test; }
  if (line) A.text(ctx, line, x, yy, size, col, 'left', null);
}
function drawTowerObj(tw) {
  ctx.save(); ctx.translate(tw.x, tw.y);
  const age = S.battle.time - (tw.born ?? (tw.born = S.battle.time));
  const pop = age < 0.25 ? 0.6 + age / 0.25 * 0.4 + Math.sin(age / 0.25 * Math.PI) * 0.2 : 1;
  ctx.scale(pop, pop);
  if (C.TOWERS[tw.type].place === 'path') ctx.translate(tw.px - tw.x, tw.py - tw.y);
  A.drawTower(ctx, tw.type, S.t + tw.id, tw);
  // level pips
  if (tw.lvl > 1) for (let k = 0; k < tw.lvl; k++) A.starShape(ctx, -(tw.lvl - 1) * 3.6 + k * 7.2, 16, 3.6, '#ffd45e', 1.1); // up to 6 pips (v0.6 item 11)
  ctx.restore();
}
// v0.7.2 C13: the cookie guard. Leans on the right of the cookie; a swat is wind-up 0.10 s, slap 0.08 s, hold 0.06 s, return 0.26 s (0.5 s).
function drawGuard(b, ck) {
  const px = ck.x + 35, py = ck.y + 21, rest = -0.2;
  let ang = rest + Math.sin(S.t * 1.7) * 0.025, flash = 0;
  const age = 0.5 - (b.swatFx || 0);
  if ((b.swatFx || 0) > 0 && b.swatTarget) {
    const sg = b.swatTarget.x < px ? -1 : 1, ease = (k) => Math.max(0, Math.min(1, k));
    if (reducedMotion()) { flash = Math.max(0, 1 - age / 0.15); }
    else if (age < 0.10) ang = rest + (-sg * 0.4 - rest) * (1 - Math.pow(1 - ease(age / 0.10), 2));
    else if (age < 0.18) { const k = ease((age - 0.10) / 0.08); ang = -sg * 0.4 + (sg * 0.62 + sg * 0.4) * k * k; flash = k > 0.8 ? 1 : 0; }
    else if (age < 0.24) ang = sg * 0.62;
    else { const k = ease((age - 0.24) / 0.26); ang = sg * 0.62 + (rest - sg * 0.62) * (1 - Math.pow(1 - k, 3)); }
  }
  A.drawSwatter(ctx, px, py, ang, 0.8, flash);
}
function drawAntObj(a) {
  const b = S.battle;
  const frozen = b.time < b.freezeUntil;
  const p = b.route(a).at(a.d);
  if (Math.abs(p.dx) > 0.3) a._face = (p.dx * (a.dir || 1)) >= 0 ? 1 : -1;
  const face = a._face ?? 1;
  const speedK = a.type === 'small' ? 2.2 : a.type === 'sprinter' ? 2.4 : a.type === 'queen' ? 0.6 : a.type === 'big' ? 1 : a.type === 'heavy' ? 0.9 : 1.5;
  // walk cycle while moving; idle breathing (frame 0 + gentle squash) while stuck, staggered or frozen
  const still = frozen || a.stunT > 0;
  const fr = still ? 0 : Math.floor(((b.time + a.id * 0.37) * speedK * A.ANT_FRAMES)) % A.ANT_FRAMES;
  const spr = A.antSprite(a.type, fr, a.carrying > 0, pxRatio);
  const breathe = still ? 1 + Math.sin(S.t * 5 + a.id) * 0.035 : 1;
  // tiny lateral offset per id so crowds don't stack perfectly
  const lat = ((a.id * 37) % 9 - 4) * 1.2;
  const x = a.x + p.dy * lat, y = a.y - p.dx * lat;
  ctx.save(); ctx.translate(x, y + 4); ctx.scale(face / breathe, breathe);
  if (a.hitFlash > 0.06) ctx.scale(1.08, 0.92); // hit squash
  ctx.drawImage(spr.cv, -spr.ox, -spr.oy, spr.w, spr.h);
  if (a.hitFlash > 0) { ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.5; ctx.drawImage(spr.cv, -spr.ox, -spr.oy, spr.w, spr.h); }
  ctx.restore();
  if (frozen) { ctx.save(); ctx.globalAlpha = 0.55; A.rr(ctx, x - 17 * a.size, y - 24 * a.size, 34 * a.size, 32 * a.size, 7); ctx.fillStyle = '#d6f3ff'; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = '#8fd0f5'; ctx.stroke(); ctx.restore(); }
  if (a.slow > 0.01 && !frozen) { ctx.fillStyle = 'rgba(255,240,160,0.8)'; ctx.beginPath(); ctx.ellipse(x, y + 8, 9 * a.size, 2.5, 0, 0, 7); ctx.fill(); }
  if (a.stunT > 0 && !frozen) A.stunStars(ctx, x, y - 30 * a.size, S.t + a.id, a.size);
  if (a.charmT > 0) A.heart(ctx, x + Math.sin(S.t * 4 + a.id) * 4, y - 32 * a.size - Math.abs(Math.sin(S.t * 3)) * 4, 3, '#ff8fbf');
  if (a.hp < a.maxHp) {
    const w = a.type === 'queen' ? 60 : 22, hy = y - (a.flying ? 44 : 33) * a.size;
    A.rr(ctx, x - w / 2 - 1, hy - 1, w + 2, 6, 3); ctx.fillStyle = A.INK; ctx.fill();
    const f = Math.max(0, a.hp / a.maxHp);
    A.rr(ctx, x - w / 2, hy, w * f, 4, 2); ctx.fillStyle = f > 0.5 ? '#8fe388' : f > 0.25 ? '#ffd45e' : '#ff7a7a'; ctx.fill();
  }
}
function renderFx(dt) {
  const keep = [];
  for (const f of S.fx) {
    f.life -= dt; if (f.life <= 0) continue; keep.push(f);
    if (f.life > f.max) continue; // still waiting (e.g. until the flying card lands)
    const k = 1 - f.life / f.max;
    ctx.save();
    switch (f.k) {
      case 'thrown': { // v0.6 item 6: an ant thrown off the trail by the Tractor - an arc with a spin, then a puff where it lands
        const spr = A.antSprite(f.ant, 0, false, pxRatio);
        const x = f.x0 + (f.x1 - f.x0) * k, y = f.y0 + (f.y1 - f.y0) * k - Math.sin(k * Math.PI) * f.h;
        ctx.globalAlpha = k > 0.8 ? (1 - k) / 0.2 : 1; ctx.translate(x, y); ctx.rotate(k * f.spin); const sc = 1 - k * 0.35; ctx.scale(sc, sc);
        ctx.drawImage(spr.cv, -spr.ox, -spr.oy, spr.w, spr.h);
        if (k > 0.82 && !f.landed) { f.landed = true; for (let i = 0; i < 4; i++) addFx({ k: 'puff', x: f.x1 + (Math.random() - 0.5) * 10, y: f.y1, vx: (Math.random() - 0.5) * 40, vy: -Math.random() * 20, r: 3 + Math.random() * 3, life: 0.45, max: 0.45 }); }
        break;
      }
      case 'ko': {
        const spr = A.antSprite(f.ant, 0, false, pxRatio);
        ctx.globalAlpha = 1 - k; ctx.translate(f.x, f.y - k * 30); ctx.rotate(Math.PI * k * 0.4 * f.face); ctx.scale(f.face, -1);
        ctx.drawImage(spr.cv, -spr.ox, -spr.oy, spr.w, spr.h);
        ctx.scale(1, -1); ctx.beginPath(); ctx.ellipse(0, -18, 8, 2.5, 0, 0, 7); ctx.lineWidth = 2; ctx.strokeStyle = '#ffe36e'; ctx.stroke();
        break;
      }
      case 'puff': f.x += f.vx * dt; f.y += f.vy * dt; ctx.globalAlpha = (1 - k) * 0.8; ctx.beginPath(); ctx.arc(f.x, f.y, f.r * (1 + k), 0, 7); ctx.fillStyle = '#fff'; ctx.fill(); break;
      case 'crumbTxt': ctx.globalAlpha = 1 - k * k; A.crumbIcon(ctx, f.x - 7, f.y - k * 24, 0.7); A.text(ctx, '+' + f.n, f.x + 7, f.y - k * 24, 12, '#ffe3a8'); break;
      case 'txt': { ctx.globalAlpha = 1 - k * k; const sz = (f.size || 13) * (k < 0.12 ? 0.6 + k / 0.12 * 0.4 + Math.sin(k / 0.12 * Math.PI) * 0.15 : 1); A.text(ctx, f.s, Math.max(60, Math.min(MAP_W - 60, f.x)), f.y - k * 22, sz, f.col); break; }
      case 'ring2': ctx.globalAlpha = 1 - k; ctx.beginPath(); ctx.arc(f.x, f.y, 8 + k * 34, 0, 7); ctx.lineWidth = 6 * (1 - k) + 1; ctx.strokeStyle = '#ffe36e'; ctx.stroke(); break;
      case 'pillar': { ctx.globalAlpha = (1 - k) * 0.8; const g = ctx.createLinearGradient(0, f.y - 120, 0, f.y + 10); g.addColorStop(0, 'rgba(255,240,150,0)'); g.addColorStop(1, 'rgba(255,240,150,0.9)'); ctx.fillStyle = g; const w = 26 * (1 - k * 0.5); ctx.fillRect(f.x - w / 2, f.y - 120, w, 130); for (let i = 0; i < 4; i++) A.starShape(ctx, f.x + Math.sin(i * 2.1 + k * 6) * 14, f.y - 20 - ((k * 90 + i * 25) % 100), 3.5, '#fff7b0', 1); break; }
      case 'heart': ctx.globalAlpha = 1 - k; A.heart(ctx, f.x + Math.sin(k * 8) * 3, f.y - k * 18, 3.2, '#ff8fbf'); break;
      case 'crumbBit': f.x += f.vx * dt; f.y += f.vy * dt; f.vy += 260 * dt; ctx.globalAlpha = 1 - k; ctx.fillStyle = '#e8b878'; ctx.beginPath(); ctx.ellipse(f.x, f.y, 2.4, 1.8, k * 6, 0, 7); ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = A.INK; ctx.stroke(); break;
      case 'dizzy': ctx.globalAlpha = 1 - k; for (let i = 0; i < 3; i++) { const a = k * 10 + i * 2.1; A.starShape(ctx, f.x + Math.cos(a) * 12, f.y - 16 + Math.sin(a) * 4, 3, '#fff27a', 1); } break;
      case 'beam': ctx.globalAlpha = 1 - k; ctx.lineCap = 'round'; ctx.lineWidth = 6 + (f.heat || 0) * 5; ctx.strokeStyle = (f.heat || 0) > 0.6 ? 'rgba(255,150,60,0.55)' : 'rgba(255,90,120,0.4)'; ctx.beginPath(); ctx.moveTo(f.x, f.y); ctx.lineTo(f.tx, f.ty - 4); ctx.stroke(); ctx.lineWidth = 2; ctx.strokeStyle = '#fff'; ctx.stroke(); break;
      case 'zap': {
        ctx.globalAlpha = 1 - k; ctx.lineWidth = f.chain ? 2.2 : 3; ctx.strokeStyle = f.chain ? '#e4d0ff' : '#bfe0ff'; ctx.beginPath(); ctx.moveTo(f.x, f.y);
        for (let i = 1; i < 6; i++) { const q = i / 6; ctx.lineTo(f.x + (f.tx - f.x) * q + (Math.random() - 0.5) * 10, f.y + (f.ty - f.y) * q + (Math.random() - 0.5) * 10); }
        ctx.lineTo(f.tx, f.ty); ctx.stroke(); ctx.lineWidth = 1.2; ctx.strokeStyle = '#fff'; ctx.stroke(); break;
      }
      case 'tongue': {
        const ext = k < 0.5 ? k * 2 : (1 - k) * 2; const sx = f.x + 8, sy = f.y - 8;
        const ex = sx + (f.tx - sx) * ext, ey = sy + (f.ty - sy) * ext;
        ctx.lineCap = 'round'; ctx.lineWidth = 5; ctx.strokeStyle = A.INK; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
        ctx.lineWidth = 3; ctx.strokeStyle = '#ff8fab'; ctx.stroke(); A.blob(ctx, ex, ey, 4, 4, '#ff8fab', 1.5); break;
      }
      case 'ring': ctx.globalAlpha = (1 - k) * 0.8; ctx.beginPath(); ctx.arc(f.x, f.y - 6, f.r * (0.2 + 0.8 * k), 0, 7); ctx.lineWidth = 5 * (1 - k) + 1; ctx.strokeStyle = f.col; ctx.stroke();
        ctx.beginPath(); ctx.arc(f.x, f.y - 6, f.r * (0.1 + 0.6 * k), 0, 7); ctx.lineWidth = 2; ctx.strokeStyle = '#fff'; ctx.stroke(); break;
      case 'wisp': { const d = f.d + k * 70; ctx.globalAlpha = 1 - k; ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.strokeStyle = '#ffffff'; ctx.beginPath(); const x0 = f.x + Math.cos(f.a) * d, y0 = f.y + Math.sin(f.a) * d; ctx.moveTo(x0, y0); ctx.quadraticCurveTo(x0 + Math.cos(f.a + 1) * 6, y0 + Math.sin(f.a + 1) * 6, x0 + Math.cos(f.a) * 14, y0 + Math.sin(f.a) * 14); ctx.stroke(); break; }
      case 'mist': { ctx.globalAlpha = 0.6 * (1 - k); const x = f.x + (f.tx - f.x) * k, y = f.y - 20 + (f.ty - f.y + 20) * k; ctx.beginPath(); ctx.arc(x, y, 6 + k * 8, 0, 7); ctx.fillStyle = '#c9f5b8'; ctx.fill(); break; }
      case 'ember': f.x += f.vx * dt; f.y += f.vy * dt; ctx.globalAlpha = 1 - k; ctx.beginPath(); ctx.arc(f.x, f.y, 2.6 * (1 - k) + 0.8, 0, 7); ctx.fillStyle = k < 0.4 ? '#ffe08a' : '#ff8a4a'; ctx.fill(); break;
      case 'spark': ctx.globalAlpha = 1 - k; A.starShape(ctx, f.x, f.y, 5 + k * 4, f.col || '#fff', 1); break;
      case 'shard': f.x += f.vx * dt; f.y += f.vy * dt; f.vy += 300 * dt; ctx.globalAlpha = 1 - k; ctx.translate(f.x, f.y); ctx.rotate(k * 9); ctx.beginPath(); ctx.moveTo(-3, -2); ctx.lineTo(3, -1); ctx.lineTo(0, 3); ctx.closePath(); ctx.fillStyle = '#bfe6ff'; ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = A.INK; ctx.stroke(); break;
      case 'star': f.x += f.vx * dt; f.y += f.vy * dt; f.vy += 80 * dt; ctx.globalAlpha = 1 - k; A.starShape(ctx, f.x, f.y, 4 * (1 - k) + 1, '#ffe36e', 1); break;
      case 'pop': ctx.globalAlpha = 1 - k; ctx.beginPath(); ctx.arc(f.x, f.y, 10 + k * 22, 0, 7); ctx.lineWidth = 3; ctx.strokeStyle = '#fff'; ctx.stroke(); break;
      case 'boom': {
        ctx.globalAlpha = 1 - k;
        for (const [rr2, col] of [[1, '#ffd36e'], [0.7, '#ff9a6e'], [0.4, '#fff3c0']]) { ctx.beginPath(); ctx.arc(f.x, f.y, f.r * rr2 * (0.3 + 0.7 * Math.sqrt(k)), 0, 7); ctx.fillStyle = col; ctx.fill(); }
        A.text(ctx, 'BOOM!', f.x, f.y - 10 - k * 20, 26 + k * 6, '#fff'); break;
      }
      case 'dust': ctx.globalAlpha = 0.5 * (1 - k); ctx.beginPath(); ctx.arc(f.x, f.y + k * 10, 6 + k * 10, 0, 7); ctx.fillStyle = '#e6f7c8'; ctx.fill(); break;
      case 'flash': ctx.globalAlpha = 1 - k; ctx.fillStyle = f.col; ctx.fillRect(0, 0, MAP_W, MAP_H); break;
      case 'banner': { ctx.globalAlpha = k < 0.15 ? k / 0.15 : k > 0.75 ? (1 - k) / 0.25 : 1; const s = 1 + Math.max(0, 0.15 - k) * 2; ctx.translate(200, 200); ctx.scale(s, s); A.text(ctx, f.s, 0, 0, 34, '#ffe36e'); break; }
    }
    ctx.restore();
  }
  // projectiles (sim-owned)
  for (const p of S.battle.projectiles) A.blob(ctx, p.x, p.y, 3.4, 3.4, '#b9b2c4', 1.5);
  S.fx = keep;
}
// UI-level effects drawn above HUD and tray: flying card and flying price
function renderUiFx(dt) {
  const keep = [];
  for (const f of S.ui) {
    f.life -= dt; if (f.life <= 0) continue; keep.push(f);
    const k = 1 - f.life / f.max, e = 1 - (1 - k) * (1 - k);
    ctx.save();
    if (f.k === 'cardFly') {
      const x = f.x0 + (f.x1 - f.x0) * e, y = f.y0 + (f.y1 - f.y0) * e - Math.sin(k * Math.PI) * 40;
      const sc = 1 - 0.65 * e; ctx.translate(x, y); ctx.rotate(Math.sin(k * Math.PI) * 0.25); ctx.scale(sc, sc);
      drawCard(-44, -47, 88, 94, f.card, {});
    } else if (f.k === 'costFly') {
      const x = f.x0 + (f.x1 - f.x0) * e, y = f.y0 + (f.y1 - f.y0) * e;
      ctx.globalAlpha = k > 0.75 ? (1 - k) / 0.25 : 1;
      const sc = k < 0.15 ? 0.6 + k / 0.15 * 0.6 : 1.2 - k * 0.3;
      ctx.translate(x, y); ctx.scale(sc, sc);
      A.rr(ctx, -34, -15, 68, 30, 15); ctx.fillStyle = '#5a4058'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = '#ffcf7a'; ctx.stroke();
      A.crumbIcon(ctx, -16, 0, 1); A.text(ctx, `-${f.n}`, 10, 1, 18, '#ffcf7a');
    } else if (f.k === 'priceFloat') { // v0.5 item 8 (and Move): "-price" floats up from the coins / diamonds and fades
      ctx.globalAlpha = k > 0.6 ? (1 - k) / 0.4 : 1; const sc = k < 0.15 ? 0.6 + k / 0.15 * 0.5 : 1.1;
      ctx.translate(f.x, f.y + 6 - e * 34); ctx.scale(sc, sc);
      A.rr(ctx, -30, -13, 60, 26, 13); ctx.fillStyle = '#5a4058'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = f.cur === 'diamond' ? '#9fe0ff' : '#ffd45e'; ctx.stroke();
      if (f.cur === 'diamond') A.diamondIcon(ctx, -14, 0, 0.7); else A.coinIcon(ctx, -14, 0, 0.8);
      A.text(ctx, `-${f.n}`, 9, 1, 15, f.cur === 'diamond' ? '#bfeaff' : '#ffe08a');
    } else if (f.k === 'starBurst') {
      const d = 10 + e * 70; ctx.globalAlpha = 1 - k; A.starShape(ctx, f.x + Math.cos(f.a) * d, f.y + Math.sin(f.a) * d, 5 * (1 - k) + 2, '#ffe36e', 1.2);
    } else if (f.k === 'gainFly') {
      const x = f.x0 + (f.x1 - f.x0) * e, y = f.y0 + (f.y1 - f.y0) * e; ctx.globalAlpha = k > 0.8 ? (1 - k) / 0.2 : 1;
      ctx.translate(x, y); A.rr(ctx, -36, -15, 72, 30, 15); ctx.fillStyle = '#3f6a58'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = '#bff5d0'; ctx.stroke();
      A.crumbIcon(ctx, -18, 0, 1); A.text(ctx, `+${f.n}`, 9, 1, 18, '#d8ffe4');
    }
    ctx.restore();
  }
  S.ui = keep;
}
// v0.4 item 18 / v0.5 item 13: each world has its treat (world 1 cookie, world 2 cake); all treats share the faces/reactions
function treatKind(b) { return C.treatOf(b ? b.levelIndex : 0); }
function renderHud(b) {
  panel(6, 6, 388, 54, '#fff6ee', 16);
  // food
  A.drawTreat(ctx, treatKind(b), 30, 33, b.foodStored / b.cfg.foodHP, S.t, { ouch: S.cookieOuch > S.t, react: Treat.reaction(S.treat, S.t) });
  const f = b.foodStored / b.cfg.foodHP;
  // v0.4 item 10: the food bar is a bit narrower to make room for the diamonds chip
  A.rr(ctx, 60, 22, 84, 20, 10); ctx.fillStyle = '#f0e0d8'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = A.INK; ctx.stroke();
  if (f > 0) { A.rr(ctx, 62, 24, 80 * f, 16, 8); ctx.fillStyle = f >= 0.9 ? '#8fe388' : f >= 0.5 ? '#ffd45e' : '#ff8a8a'; ctx.fill(); }
  A.text(ctx, `${Math.floor(b.foodStored + 1e-6)}`, 102, 33, 13, '#fff');
  const carried = b.ants.reduce((s, a) => s + (a.trips === 0 ? a.carrying : 0), 0); // v0.7.2 C14: 'carried off!' only for ants on their FIRST trip (every ant keeps shuttling, so it would never go away)
  if (carried) A.text(ctx, `${fmtFood(carried)} carried off!`, 102, 51, 9.5, '#c0392b', 'center', null);
  // wave
  A.text(ctx, `Wave ${Math.min(b.nextWave, b.totalWaves)}/${b.totalWaves}`, 184, 26, 15, '#ffb3c1');
  A.text(ctx, `Lv ${b.levelIndex + 1}`, 184, 46, 11, '#a08090', 'center', null);
  // v0.4 item 10: diamonds in stock, always visible in battle (they buy crumbs and boosters)
  ctx.save(); ctx.translate(252, 33);
  A.rr(ctx, -31, -14, 62, 28, 14); ctx.fillStyle = '#e9f7ff'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = A.INK; ctx.stroke();
  A.diamondIcon(ctx, -15, 0, 0.95);
  A.text(ctx, String(S.save.diamonds || 0), 8, 1, 16, '#7fd3ff');
  ctx.restore();
  // crumbs
  S.crumbShake = Math.max(0, S.crumbShake - 1 / 60); S.crumbPulse = Math.max(0, S.crumbPulse - 1 / 60);
  const shx = S.crumbShake > 0 ? Math.sin(S.t * 60) * 4 * S.crumbShake / 0.45 : 0, pul = 1 + S.crumbPulse * 0.5;
  ctx.save(); ctx.translate(341 + shx, 33); ctx.scale(pul, pul);
  A.rr(ctx, -45, -16, 90, 32, 16); ctx.fillStyle = S.crumbShake > 0 ? '#ffd6d6' : '#fff1d6'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = S.crumbShake > 0 ? '#e0524f' : A.INK; ctx.stroke();
  A.crumbIcon(ctx, -27, 0, 1.2);
  A.text(ctx, String(Math.floor(b.crumbs)), 7, 1, 19, '#ffcf7a');
  // '+' badge: buy crumbs with diamonds (v0.3 item 12)
  A.blob(ctx, 36, -1, 9, 9, '#9fe0ff', 1.8); A.text(ctx, '+', 36, -1.5, 15, '#ffffff');
  ctx.restore();
  if (!S.result) button('buyCrumbs', 290, 0, 110, 66, () => openCrumbDialog());
}
// ---------------- diamond purchase dialogs (battle pauses while open) ----------------
function openCrumbDialog() {
  const b = S.battle; if (!b || b.result || S.paused) return;
  const price = M.nextCrumbPrice(b);
  S.dialog = { kind: 'crumbs', title: 'More crumbs', line: `Buy ${C.ECONOMY.diamonds.crumbPack} crumbs for`, price,
    note: 'Price doubles with every purchase this battle.', onBuy: () => { const r = M.buyCrumbsWithDiamonds(S.save, b); if (r.ok) { persist(); sfx('return'); S.crumbPulse = 0.5; addUi({ k: 'gainFly', n: r.crumbs, x0: 200, y0: 300, x1: 340, y1: 34, life: 0.8, max: 0.8 }); } return r; } };
  sfx('tap');
}
function openBoosterDialog(bt) {
  const b = S.battle; if (!b || b.result || S.paused) return;
  const price = M.nextBoosterPrice(b, bt);
  S.dialog = { kind: 'booster', booster: bt, title: `${C.BONUSES[bt].name}`, line: `0 left. Buy 1 ${C.BONUSES[bt].name} for`, price,
    note: C.ECONOMY.diamonds.boosterPriceStep ? `Next booster costs +${C.ECONOMY.diamonds.boosterPriceStep} more this battle.` : 'Same price for every booster, every time.', onBuy: () => { const r = M.buyBoosterWithDiamonds(S.save, b, bt); if (r.ok) { persist(); sfx('upgrade'); } return r; } };
  sfx('tap');
}
function renderDialog() {
  const D = S.dialog; const have = S.save.diamonds || 0; const afford = have >= D.price;
  ctx.fillStyle = 'rgba(60,40,55,0.5)'; ctx.fillRect(-2000, -2000, W + 4000, H + 4000);
  button('dlgBlock', -2000, -2000, W + 4000, H + 4000, () => {}); // nothing underneath is tappable
  panel(44, 228, 312, 250, '#fff6ee');
  A.text(ctx, D.title, 200, 258, 22, D.kind === 'crumbs' ? '#ffcf7a' : C.BONUSES[D.booster].color);
  ctx.save(); ctx.translate(200, 300);
  if (D.kind === 'crumbs') { for (let k = 0; k < 5; k++) A.crumbIcon(ctx, -28 + k * 14, Math.sin(S.t * 4 + k) * 2, 1.4); }
  else { ctx.scale(1.4, 1.4); A.drawBonusIcon(ctx, D.booster, S.t); }
  ctx.restore();
  plainText(D.line, 200, 338, 14, '#3d2a36', 'center', '600');
  A.diamondIcon(ctx, 178, 364, 1.2); A.text(ctx, String(D.price), 212, 365, 22, '#7fd3ff');
  plainText(afford ? `You have ${have} diamonds.` : `You have ${have} diamonds. Get diamonds from the Reward Calendar.`, 200, 392, 11.5, afford ? '#5a4652' : '#c0392b', 'center');
  plainText(D.note, 200, 408, 11, '#7a6a76', 'center');
  drawButton(64, 420, 128, 46, 'Cancel', '#d9cfe0'); button('dlgCancel', 60, 418, 136, 52, () => { S.dialog = null; });
  drawButton(208, 420, 128, 46, 'Buy', '#9fe0ff', { disabled: !afford }); button('dlgBuy', 204, 418, 136, 52, () => { if (!afford) { toast('Not enough diamonds'); return; } const r = D.onBuy(); S.dialog = null; if (!r.ok) toast(r.why === 'uses' ? 'No booster uses left' : 'Not enough diamonds'); });
}
// readable, non-bold text without outline (v0.3 item 11)
function plainText(s, x, y, size, col, align = 'left', weight = '500') {
  ctx.font = `${weight} ${size}px ${A.FONT}`; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.fillStyle = col; ctx.fillText(s, x, y);
}
// Tray layout (logical px). Hit areas are taller than the drawn buttons so every target is >= 44 CSS px on phones.
const TRAY = { cardY: 6, cardH: 94, waveY: 6, waveH: 48, rerollY: 58, rerollH: 36, rowY: 108, rowH: 44 };
function renderTray(b) {
  const y0 = TRAY_Y, L = TRAY;
  panel(4, y0, 392, H - y0 - 4, '#ffe9df', 18);
  const cost = b.nextCardCost; const afford = b.crumbs >= cost;
  // 3 picks
  for (let i = 0; i < b.picks.length; i++) {
    const x = 12 + i * 94, y = y0 + L.cardY, w = 88, h = L.cardH;
    const selected = (S.sel && S.sel.kind === 'card' && S.sel.i === i) || (S.drag && S.drag.i === i);
    S.slotFlip[i] = Math.max(0, (S.slotFlip[i] || 0) - 1 / 60);
    const shake = !afford && S.crumbShake > 0 ? Math.sin(S.t * 60) * 3 : 0;
    ctx.save(); ctx.translate(x + w / 2 + shake, y + h / 2); ctx.scale(Math.max(0.05, S.slotFlip[i] > 0 ? 1 - Math.sin(S.slotFlip[i] / 0.3 * Math.PI) : 1), 1); ctx.translate(-(x + w / 2), -(y + h / 2));
    drawCard(x, y, w, h, b.picks[i], { cost, afford, selected, lift: selected ? 4 : 0, level: S.save.cards[b.picks[i]].level });
    ctx.restore();
    button('pick' + i, x - 3, y0 + 2, w + 6, L.cardH + 8, () => {
      if (S.sel && S.sel.kind === 'card' && S.sel.i === i) S.sel = null; else { S.sel = { kind: 'card', i }; S.info = null; if (!afford) needCrumbs(cost); }
      sfx('tap');
    }, { onDown: (p) => { S.drag = { i, x: p.x, y: p.y, moved: false }; } });
  }
  // wave + redraw
  const wx = 296, ww = 92;
  const more = b.nextWave < b.totalWaves;
  const secs = Math.max(0, Math.ceil(b.nextWaveAt - b.time));
  const bonus = Math.floor(Math.max(0, b.nextWaveAt - b.time) * b.cfg.earlyCallBonusPerSec);
  const wy = y0 + L.waveY;
  drawButton(wx, wy, ww, L.waveH, '', '#9fe0b5', { disabled: !more });
  if (more) { A.text(ctx, b.nextWave === 0 ? 'Start!' : 'Next wave', wx + ww / 2, wy + 16, 14); A.text(ctx, `${secs}s${bonus ? '  +' + bonus : ''}`, wx + ww / 2, wy + 35, 12, '#fff8c0'); if (bonus) A.crumbIcon(ctx, wx + ww - 10, wy + 35, 0.55); }
  else A.text(ctx, 'Last wave', wx + ww / 2, wy + 25, 13);
  button('wave', wx - 4, y0 + 2, ww + 8, L.rerollY - 4, () => { if (b.callWaveEarly() > 0) sfx('return'); });
  const rc = b.rerollPrice, ry = y0 + L.rerollY; // v0.5 item 17: 3, 6, 9, 12 ... (resets every battle)
  drawButton(wx, ry, ww, L.rerollH, '', '#c9b6f2', { disabled: b.crumbs < rc });
  if (rc === 0) { A.text(ctx, 'Redraw', wx + 30, ry + 18, 13); A.text(ctx, 'FREE', wx + 76, ry + 18, 12, '#2f8a3a'); } // v0.7 D-R3: the first redraw is free
  else { A.text(ctx, 'Redraw', wx + 30, ry + 18, 13); A.crumbIcon(ctx, wx + 66, ry + 18, 0.65); A.text(ctx, String(rc), wx + 80, ry + 18, 12); }
  button('reroll', wx - 4, y0 + L.rerollY - 2, ww + 8, L.rowY - L.rerollY, () => { if (b.reroll()) { sfx('tap'); if (rc > 0) { addUi({ k: 'costFly', n: rc, x0: 340, y0: 34, x1: 300, y1: 96, life: 1.0, max: 1.0 }); S.crumbPulse = 0.35; } } else needCrumbs(rc); });
  // bottom row: bonuses, speed, pause
  const by = y0 + L.rowY, bh = L.rowH;
  const hitY = y0 + L.rowY - 2, hitH = H - hitY; // extends to the bottom edge
  b.bonusTypes.forEach((bt, k) => {
    const x = 12 + k * 104, w = 98;
    const can = b.canUseBonus(bt); const sel = S.sel && S.sel.kind === 'bonus' && S.sel.type === bt;
    const stock = b.bonusStock[bt] || 0; const buyable = stock <= 0 && b.bonusUsesLeft > 0; // v0.3: 0 left -> buy one with diamonds
    drawButton(x, by, w, bh, '', sel ? '#ffd27a' : C.BONUSES[bt].color, { disabled: !can && !buyable, r: 12 });
    ctx.save(); ctx.translate(x + 17, by + bh / 2); ctx.scale(0.85, 0.85); A.drawBonusIcon(ctx, bt, S.t); ctx.restore();
    fitText(C.BONUSES[bt].name, x + 59, by + 15, 66, 11, '#fff');
    if (buyable) { const pr = M.nextBoosterPrice(b, bt); A.diamondIcon(ctx, x + 47, by + 31, 0.62); A.text(ctx, String(pr), x + 66, by + 31, 11, '#fff8c0'); }
    else A.text(ctx, `x${stock}`, x + 59, by + 31, 10, '#fff8c0');
    button('bonus' + bt, x - 2, hitY, w + 4, hitH, () => {
      if (buyable) { openBoosterDialog(bt); return; }
      if (!b.canUseBonus(bt)) { toast(b.bonusUsesLeft <= 0 ? `Max ${b.cfg.maxBonusUses} boosters per battle` : 'None left'); return; }
      if (C.BONUSES[bt].needsTarget) { S.sel = sel ? null : { kind: 'bonus', type: bt }; if (!sel) toast('Tap the trail to aim'); }
      else { b.useBonus(bt, 0, 0); }
    });
  });
  A.text(ctx, `${b.bonusUsesLeft}`, 234, by + 14, 14, '#ffb3c1'); A.text(ctx, 'left', 234, by + 30, 9, '#a08090', 'center', null);
  drawButton(256, by, 60, bh, S.speed === 1 ? '>' : '>>', '#ffd27a', { r: 12, size: 16 });
  button('speed', 252, hitY, 68, hitH, () => { S.speed = S.speed === 1 ? 2 : 1; });
  drawButton(324, by, 64, bh, 'II', '#d9cfe0', { r: 12, size: 16 });
  button('pause', 320, hitY, 76, hitH, () => { setPaused(true); });
}
function renderPause() {
  buttons.length = 0; // block every battle control while paused; only resume/restart/quit below
  ctx.fillStyle = 'rgba(60,40,55,0.45)'; ctx.fillRect(-2000, -2000, W + 4000, H + 4000);
  panel(60, 220, 280, 260, '#fff6ee');
  A.text(ctx, 'Paused', 200, 256, 28, '#ffb3c1');
  drawButton(90, 290, 220, 48, 'Resume', '#9fe0b5'); button('resume', 90, 290, 220, 48, () => { setPaused(false); });
  drawButton(90, 350, 220, 48, 'Restart', '#ffd27a'); button('restart', 90, 350, 220, 48, () => startBattle(S.levelIndex, S.battle.deck, S.battle.bonusTypes));
  drawButton(90, 410, 220, 48, 'Quit to map', '#ffb3b3'); button('quit', 90, 410, 220, 48, () => { S.battle = null; go('map'); });
}
function renderResult(dt) {
  const R = S.result; const out = R.out;
  // v0.6.2 item 14: on a queen-level win, hold the result panel and its buttons until the 'Way to go' cheer + fireworks end.
  // Taps are swallowed meanwhile; the board stays visible under a light dim.
  if (R.hold > 0) {
    R.hold -= dt;
    ctx.fillStyle = 'rgba(60,40,55,0.22)'; ctx.fillRect(-2000, -2000, W + 4000, H + 4000);
    button('resultBlock', -2000, -2000, W + 4000, H + 4000, () => {});
    return;
  }
  R.t += dt;
  ctx.fillStyle = 'rgba(60,40,55,0.5)'; ctx.fillRect(-2000, -2000, W + 4000, H + 4000);
  button('resultBlock', -2000, -2000, W + 4000, H + 4000, () => {}); // swallow taps on everything underneath (tray, bonuses, pause)
  const celebrating = R.perfect && R.t < C.UI.perfectAnimTime;
  const pop = Math.min(1, R.t * 4); ctx.save(); ctx.translate(200, 360); ctx.scale(0.7 + pop * 0.3, 0.7 + pop * 0.3); ctx.translate(-200, -360);
  panel(36, 120, 328, 480, '#fff6ee');
  const tk = C.treatOf(S.battle.levelIndex), TN = tk === 'cake' ? 'Cake' : 'Cookie';
  const title = R.perfect ? `Perfect ${TN}!` : R.win ? `${TN} saved!` : `${TN} eaten!`;
  const ts = R.perfect ? 30 + Math.max(0, 0.3 - R.t) * 30 + Math.sin(R.t * 6) * 1.5 : 28;
  A.text(ctx, title, 200, 156, ts, R.perfect ? '#ffd45e' : R.win ? '#9fe0b5' : '#ff9a9a');
  if (R.perfect) { ctx.save(); ctx.globalAlpha = 0.35 + Math.sin(R.t * 4) * 0.15; const g = ctx.createRadialGradient(200, 212, 10, 200, 212, 70); g.addColorStop(0, '#fff6a8'); g.addColorStop(1, 'rgba(255,246,168,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(200, 212, 70, 0, 7); ctx.fill(); ctx.restore();
    for (let i = 0; i < 8; i++) { const a = R.t * 0.8 + i * Math.PI / 4; A.starShape(ctx, 200 + Math.cos(a) * 52, 212 + Math.sin(a) * 40, 4, '#ffe36e', 1); } }
  A.drawTreat(ctx, tk, 200, 212, R.win ? S.battle.foodStored / S.battle.cfg.foodHP : 0.05, S.t, R.win ? { face: 'happy' } : {});
  if (R.queenKilled) plainFit(tk === 'cake' ? 'Way to go, you saved the cake!' : 'Way to go, you saved the cookies!', 200, 180, 300, 13, '#e0607e', 'center', '800'); // v0.5 item 16
  for (let s = 0; s < 3; s++) { const on = s < R.stars && R.t > 0.3 + s * 0.25; const sc = on ? 1 + Math.max(0, 0.2 - (R.t - 0.3 - s * 0.25)) * 3 : 1; A.starShape(ctx, 140 + s * 60, 270, 18 * sc, on ? '#ffd45e' : '#e8dde4', 2.5); }
  A.text(ctx, `Food left: ${fmtFood(S.battle.foodStored)}/${S.battle.cfg.foodHP}   Ants beaten: ${R.kills}`, 200, 302, 12, '#7a5a6a', 'center', null);
  // coin breakdown: win = food + kills (+ level, first clear) + time; loss = kills + time (capped together)
  // v0.6 item 1: "Time survived" = floor(battle seconds / 3) - its own line, on a win and on a loss
  const P = out.parts || {}; const rows = [];
  if (R.win) { rows.push(['Victory', P.base]); rows.push(['Food left', P.food]); rows.push(['Ants beaten', P.kills]); if (P.level) rows.push(['Level reward', P.level]); if (P.firstClear) rows.push(['First clear', P.firstClear]); }
  else rows.push(['Ants beaten', P.kills || 0]);
  rows.push([R.win ? 'Time survived' : `Time survived${out.coins >= C.ECONOMY.lossCap ? ` (max ${C.ECONOMY.lossCap})` : ''}`, P.time || 0]);
  const RS = rows.length > 5 ? 14 : 16;
  A.rr(ctx, 70, 316, 260, 14 + rows.length * RS, 10); ctx.fillStyle = '#f6ece8'; ctx.fill();
  rows.forEach(([l, v], i) => { A.text(ctx, l, 84, 330 + i * RS, 11, '#7a5a6a', 'left', null); A.text(ctx, `+${v}`, 316, 330 + i * RS, 11, '#c9962a', 'right', null); });
  let yy = 330 + rows.length * RS + 18;
  A.coinIcon(ctx, 150, yy, 1.3); A.text(ctx, `+${out.coins} coins`, 208, yy + 1, 18, '#ffd45e');
  yy += 20; A.text(ctx, `(${R.crumbsLeft} unspent crumbs vanish)`, 200, yy, 10, '#a08090', 'center', null);
  yy += 20;
  if (!R.win) A.text(ctx, 'Win to earn cards and prizes!', 200, yy, 12, '#a08090', 'center', null);
  if (out.booster) { // v0.3 item 14: first clear of level 1 -> ONE Bomb
    A.rr(ctx, 70, yy - 12, 260, 26, 12); ctx.fillStyle = '#ffe9f0'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = '#ff9ab0'; ctx.stroke();
    ctx.save(); ctx.translate(92, yy + 1); ctx.scale(0.62, 0.62); A.drawBonusIcon(ctx, out.booster.id, S.t); ctx.restore();
    A.text(ctx, `First clear: +1 ${C.BONUSES[out.booster.id].name} booster`, 210, yy + 1, 12.5, '#e0607e', 'center', null); yy += 30;
  }
  if (out.prize && !celebrating) {
    const k = Math.min(1, (R.t - C.UI.perfectAnimTime) * 4);
    ctx.save(); ctx.translate(200, yy + 12); ctx.scale(0.5 + k * 0.5, 0.5 + k * 0.5);
    A.rr(ctx, -130, -16, 260, 32, 14); ctx.fillStyle = '#fff2b8'; ctx.fill(); ctx.lineWidth = 2.4; ctx.strokeStyle = '#e0a830'; ctx.stroke();
    const pz = out.prize;
    const label = pz.kind === 'cards' ? (pz.newCard ? `Prize: new tower - ${C.TOWERS[pz.id].short}!` : `You won a card: ${C.TOWERS[pz.id].short} L${pz.level}`) : `Prize: +${pz.count} ${C.BONUSES[pz.id].name} booster`;
    if (pz.kind === 'bonus') { ctx.save(); ctx.translate(-108, 0); ctx.scale(0.8, 0.8); A.drawBonusIcon(ctx, pz.id, S.t); ctx.restore(); }
    else { ctx.save(); ctx.translate(-108, 6); ctx.scale(0.42, 0.42); A.drawTower(ctx, pz.id, S.t, null); ctx.restore(); }
    A.text(ctx, label, 10, 1, 13, '#c47a12');
    ctx.restore();
  } else if (R.win && !R.perfect && S.battle.stats.stolen > 0) A.text(ctx, 'Tip: lose no food at all for a Perfect prize', 200, yy + 10, 10.5, '#a08090', 'center', null);
  ctx.restore();
  // confetti (v0.5 item 16: 3 stars or a full score; the Perfect win too)
  for (const c of R.confetti) { c.vy += 420 * dt; c.x += c.vx * dt; c.y += c.vy * dt; c.r += dt * 8; if (c.y < 760) { ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.r); ctx.fillStyle = c.c; ctx.fillRect(-4, -2.5, 8, 5); ctx.restore(); } }
  if (celebrating) return; // buttons appear after the celebration (the panel title is the only Perfect Cookie title)
  const by = 532;
  if (out.zapperGift && M.zapperGiftPending(S.save)) { // v0.6 item 5: first win of stage 2 -> straight to the map, where the gift waits
    drawButton(100, by, 200, 50, 'Continue', '#9fe0b5'); button('rcontinue', 100, by, 200, 50, () => { S.battle = null; go('map'); });
    return;
  }
  drawButton(52, by, 92, 50, 'Map', '#d9cfe0'); button('rmap', 52, by, 92, 50, () => { S.battle = null; go('map'); });
  drawButton(154, by, 92, 50, 'Retry', '#ffd27a'); button('rretry', 154, by, 92, 50, () => openPrep(S.levelIndex));
  const hasNext = R.win && S.levelIndex + 1 < C.LEVELS.length;
  drawButton(256, by, 92, 50, 'Next', '#9fe0b5', { disabled: !hasNext }); if (hasNext) button('rnext', 256, by, 92, 50, () => openPrep(S.levelIndex + 1));
}

// ---------------- CARDS / MERGE ----------------
// v0.5 item 1b: the bottom info panel (kept, a bit larger) shows the card's real stats at its level - range in tiles, power,
// fire rate - plus a one-line description and what the NEXT card level changes (item 5b).
function cardStatKeys(id) { return id === 'ball' ? ['power', 'rate', 'ballRadius'] : id === 'tractor' ? ['liftSize', 'rate', 'scoop'] : ['power', 'rate', 'range']; }
function cardInfoPanel(id, x, y, w, h, opt = {}) {
  panel(x, y, w, h, '#ffffff', 14);
  S.layoutCardPanel = { x, y, w, h };
  if (!id) { plainText(opt.hint || 'Tap a card to see its stats.', x + w / 2, y + h / 2, 12.5, '#a08090', 'center', '600'); return; }
  const T = C.TOWERS[id], c = S.save.cards[id], own = c.unlocked, L = Math.max(1, c.level);
  fitText(T.name, x + 12 + Math.min(170, 9 * T.name.length) / 2, y + 16, 170, 14.5, '#ff8fab');
  plainFit(own ? `Card L${c.level} (used in battle)` : 'Not owned yet', x + w - 12, y + 16, 150, 11.5, INFO_SOFT, 'right', '700');
  const cmp = h < 108; // v0.7.2: the Cards / card screens give the panel less height (the tab bar took the bottom) -> a tighter layout
  plainFit(T.desc, x + 12, y + (cmp ? 33 : 37), w - 24, 12, INFO_INK, 'left', '500');
  const next = cardUpgradeDiff(id, L); const nk = new Set(next.map((d) => d.key));
  const keys = cardStatKeys(id), bw = (w - 24 - 12) / 3;
  keys.forEach((k, i) => {
    const bx = x + 12 + i * (bw + 6), by = y + (cmp ? 44 : 50), bh = cmp ? 36 : 38;
    A.rr(ctx, bx, by, bw, bh, 9); ctx.fillStyle = nk.has(k) ? '#eefbe9' : '#f7efeb'; ctx.fill(); ctx.lineWidth = nk.has(k) ? 2 : 1.2; ctx.strokeStyle = nk.has(k) ? '#8fd18f' : '#e0cfd4'; ctx.stroke();
    plainFit(k === 'scoop' ? 'Scoops' : statLabel(id, k), bx + 7, by + (cmp ? 9.5 : 10), bw - 12, 10.5, INFO_SOFT, 'left', '600');
    plainFit(k === 'scoop' ? '1 trail tile' : formatStat(id, k, towerStat(id, k, 1, L)), bx + bw / 2, by + (cmp ? 24.5 : 26), bw - 10, 13.5, INFO_INK, 'center', '700');
  });
  const line = next.length ? `Next card level L${L + 1}: ` + next.map((d) => diffText(id, d)).join(' + ') : 'Top card level (L10)!';
  plainFit(line, x + w / 2, y + (cmp ? h - 9 : 102), w - 20, 12, next.length ? '#2f8a36' : '#c9962a', 'center', '700');
  if (h > 118 && !opt.noFoot) plainFit(opt.foot || (own ? 'Merge cards on its own screen to reach the next level.' : `Get it in the Shop (${M.unlockPrice(id)}c) or as a prize.`), x + w / 2, y + h - 13, w - 20, 10.5, '#a08090', 'center', '600');
}
// ---------------- v0.6 item 7: real card pictures (art window + name banner + level badge) ----------------
// The frame colour follows the level band (bronze 1-3, silver 4-6, gold 7-9, rainbow-pink 10). Used on the Cards screen, the
// per-card screen, the merge animation and the NEW CARD reveal.
const CARD_BANDS = [[3, '#d9965f', '#f3c79c'], [6, '#9fb2c8', '#e1e9f2'], [9, '#e8b830', '#ffe9a0'], [10, '#ff7fb8', '#ffd6ec']];
function cardBand(L) { return CARD_BANDS.find((b) => L <= b[0]) || CARD_BANDS[0]; }
function drawCardPic(x, y, w, h, type, opt = {}) {
  const T = C.TOWERS[type]; const L = opt.level || 1; const [, frame, frameLt] = cardBand(L);
  ctx.save();
  if (opt.dim) ctx.globalAlpha = 0.42;
  const r = Math.max(7, w * 0.12);
  A.rr(ctx, x, y + 3, w, h, r); ctx.fillStyle = 'rgba(74,52,66,0.25)'; ctx.fill();
  A.rr(ctx, x, y, w, h, r);
  if (opt.locked) { ctx.fillStyle = '#ddd3da'; ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = A.INK; ctx.stroke();
    A.rr(ctx, x + 5, y + 5, w - 10, h - 10, r - 3); ctx.fillStyle = '#eee6eb'; ctx.fill();
    A.text(ctx, '?', x + w / 2, y + h * 0.42, w * 0.38, '#fff');
    plainFit(opt.lockText || 'Locked', x + w / 2, y + h - 13, w - 10, 10, '#7a6a76', 'center', '700');
    ctx.restore(); return; }
  const fg = ctx.createLinearGradient(x, y, x + w, y + h); fg.addColorStop(0, frameLt); fg.addColorStop(0.5, frame); fg.addColorStop(1, frameLt);
  ctx.fillStyle = fg; ctx.fill();
  ctx.lineWidth = opt.selected ? 4 : 2.4; ctx.strokeStyle = opt.selected ? (opt.selCol || '#ff6f91') : A.INK; ctx.stroke();
  // art window
  // v0.6.1: compact (wide) tiles - the Shop grid - get a taller art window and no level pips, so the tower stays as big as on the old tile
  const compact = h < w * 1.1;
  const m = Math.max(4, w * 0.07), ax = x + m, ay = y + m, aw = w - 2 * m, ah = compact ? h - m * 1.6 - 15 : h * 0.66 - m;
  ctx.save(); A.rr(ctx, ax, ay, aw, ah, r * 0.6); ctx.clip();
  const bg = ctx.createRadialGradient(ax + aw / 2, ay + ah * 0.45, 2, ax + aw / 2, ay + ah * 0.5, aw * 0.8);
  bg.addColorStop(0, A.shade(T.color, 0.75)); bg.addColorStop(1, A.shade(T.color, 0.25)); ctx.fillStyle = bg; ctx.fillRect(ax, ay, aw, ah);
  ctx.globalAlpha *= 0.22; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(ax + ((i * 37) % aw), ay + ((i * 23) % ah), aw * 0.12, 0, 7); ctx.fillStyle = '#ffffff'; ctx.fill(); }
  ctx.globalAlpha = opt.dim ? 0.42 : 1;
  ctx.beginPath(); ctx.ellipse(ax + aw / 2, ay + ah * 0.86, aw * 0.36, ah * 0.08, 0, 0, 7); ctx.fillStyle = 'rgba(74,52,66,0.18)'; ctx.fill();
  const s = (compact ? Math.min(aw / 50, ah / 46) : Math.min(aw / 54, ah / 56)) * (T.place === 'path' ? 1.15 : 1);
  ctx.translate(ax + aw / 2, ay + ah * (compact ? 0.72 : 0.62)); ctx.scale(s, s); A.drawTower(ctx, type, opt.still ? 0 : S.t, null);
  ctx.restore();
  A.rr(ctx, ax, ay, aw, ah, r * 0.6); ctx.lineWidth = 1.6; ctx.strokeStyle = 'rgba(74,52,66,0.55)'; ctx.stroke();
  // name banner
  const by = ay + ah + (compact ? 2 : 3), bh = compact ? 12 : Math.max(14, h * 0.16);
  A.rr(ctx, x + m * 0.6, by, w - m * 1.2, bh, bh * 0.4); ctx.fillStyle = A.shade(T.color, -0.15); ctx.fill(); ctx.lineWidth = 1.6; ctx.strokeStyle = A.INK; ctx.stroke();
  fitText(T.short || T.name, x + w / 2, by + bh / 2 + 0.5, w - m * 2 - 4, Math.min(14, bh * 0.78), '#fff');
  // level pips along the bottom (10 dots, filled up to the level)
  const py = by + bh + (y + h - by - bh) / 2, n = C.MAX_CARD_LEVEL, gap = Math.min(7, (w - 2 * m - 6) / n);
  if (!compact) for (let i = 0; i < n; i++) { ctx.beginPath(); ctx.arc(x + w / 2 - (n - 1) * gap / 2 + i * gap, py, Math.max(1.6, gap * 0.32), 0, 7); ctx.fillStyle = i < L ? '#fff6c0' : 'rgba(74,52,66,0.25)'; ctx.fill(); }
  // level badge (top-left, overlapping the frame)
  const bs = Math.max(10, w * 0.15);
  A.blob(ctx, x + bs * 0.75, y + bs * 0.75, bs, bs * 0.92, '#ffe36e', 2); A.text(ctx, 'L' + L, x + bs * 0.75, y + bs * 0.75 + 0.5, bs * 0.92, '#7a4a2a', 'center', null);
  // v0.6.1 (item 7 consistency): the Shop + pre-battle screens use this card picture too -> deck-slot badge + trail/air tag
  if (opt.tag && !opt.badge) { const tag = T.place === 'path' ? 'on trail' : (T.targets === 'air' ? 'air only' : type === 'laser' ? 'gnd+air' : '');
    if (tag) A.text(ctx, tag, ax + aw - 3, ay + 8, 8.5, '#fff', 'right'); }
  if (opt.badge) { A.blob(ctx, x + w - 11, y + 11, 11, 11, '#ff8fab', 2); A.text(ctx, opt.badge, x + w - 11, y + 11.5, 12, '#fff'); }
  if (opt.count != null) { const str = `\u00d7${opt.count}`; ctx.font = `bold 12px ${A.FONT}`; const cw = Math.max(24, ctx.measureText(str).width + 10);
    A.rr(ctx, x + w - cw - 2, y + 3, cw, 18, 9); ctx.fillStyle = opt.count ? '#ffffff' : '#efe6ea'; ctx.fill(); ctx.lineWidth = 1.8; ctx.strokeStyle = A.INK; ctx.stroke();
    A.text(ctx, str, x + w - cw / 2 - 2, y + 12.5, 12, opt.count ? '#ff6f91' : '#b9a6b2'); }
  if (opt.mergeReady) { const p = 1 + Math.sin(S.t * 6) * 0.08; ctx.save(); ctx.translate(x + w - 10, y + 10); ctx.scale(p, p); A.blob(ctx, 0, 0, 11, 11, '#ff6f91', 2); A.text(ctx, '!', 0, 0.5, 14, '#fff'); ctx.restore(); }
  if (opt.fresh) { A.rr(ctx, x + w / 2 - 17, y - 9, 34, 17, 8); ctx.fillStyle = '#ffd45e'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = A.INK; ctx.stroke(); A.text(ctx, 'NEW', x + w / 2, y - 0.5, 10, '#fff'); }
  ctx.restore();
}
// v0.5 items 6 + 7 / v0.6 item 7: the main Cards screen shows every type as a card picture at its HIGHEST owned level (the
// one used in battle). Tap = info panel (tap again or "Open" = the card's own screen). v0.6 item 8: "Merge all".
function doMergeAll() {
  const done = M.mergeAll(S.save);
  if (!done.length) { toast(M.anyMergeReady(S.save) ? 'Not enough coins' : 'Nothing to merge yet - 3 cards of a level make 1 of the next'); return; }
  persist(); sfx('upgrade');
  const top = done.reduce((a, d) => (d.to > a.to ? d : a), done[0]);
  S.mergeAnim = { id: top.id, from: top.from, to: top.to, n: 3, t: 0, all: done.length };
}
function renderCards() {
  panel(12, 12, 376, 636, '#fff6ee');
  A.text(ctx, 'Cards', 200, 36, 26, '#b5d8ff');
  A.coinIcon(ctx, 304, 60, 1); A.text(ctx, String(S.save.coins), 336, 61, 15, '#ffd45e');
  plainText('Tap a card: stats.  Tap again: open.', 28, 60, 11.5, '#7a5a6a', 'left', '600');
  S.layoutMerge = [];
  C.ALL_CARDS.forEach((id, k) => {
    const col = k % 4, row = Math.floor(k / 4);
    const x = 30 + col * 88, y = 80 + row * 104, w = 76, h = 96;
    const c = S.save.cards[id]; const ready = c.unlocked && M.mergeReady(S.save, id);
    drawCardPic(x, y, w, h, id, { locked: !c.unlocked, lockText: 'Shop or prize', level: c.level, selected: S.cardsSel === id, mergeReady: ready, fresh: c.fresh });
    button('card' + id, x, y, w, h, () => { if (S.cardsSel === id && c.unlocked) openCardView(id); else S.cardsSel = id; sfx('tap'); });
    if (ready) S.layoutMerge.push(id);
  });
  cardInfoPanel(S.cardsSel, 24, 490, 352, 98, { hint: 'Tap a card to see its stats.', noFoot: true });
  // v0.7.2 C16: Back / Shop are gone (tab bar); Open card + Merge all share one row above the bar
  const anyReady = M.anyMergeReady(S.save), selOpen = !!(S.cardsSel && S.save.cards[S.cardsSel].unlocked);
  if (selOpen) {
    const ready = M.mergeReady(S.save, S.cardsSel);
    drawButton(24, 604, 172, 34, ready ? 'Open card  !' : 'Open card', ready ? '#ff9ec0' : '#d7e8ff', { size: 15, r: 12 });
    button('open' + S.cardsSel, 24, 590, 172, 58, () => openCardView(S.cardsSel));
  }
  drawButton(204, 604, 172, 34, 'Merge all', anyReady ? '#ff9ec0' : '#e6dce2', { size: 15, r: 12, disabled: !anyReady }); button('mergeAll', 204, 590, 172, 58, doMergeAll);
  if (S.mergeAnim) renderMergeAnim();
  else if (S.save.onboard && S.save.onboard.cardsHint === 'cards' && S.save.cards.zapper.unlocked) { // v0.7: once, after the free pack
    const k = C.ALL_CARDS.indexOf('zapper'), x = 30 + (k % 4) * 88, y = 80 + Math.floor(k / 4) * 104;
    onboardSpot({ x, y, w: 76, h: 96, r: 12 }, 'cardzapper', () => { S.save.onboard.cardsHint = 'done'; persist(); openCardView('zapper'); }, 'Your Bug Zapper - it hits flying ants!');
  }
}
function openCardView(id) { S.cardView = id; S.cardsSel = id; const c = S.save.cards[id]; if (c.fresh) { c.fresh = false; persist(); } go('card'); }
// One card type's own screen (v0.6 items 4 + 7): a card picture for EACH level you hold (x count), and a Merge button under
// every level: 3 cards of a level -> 1 card of the next level, at every level.
function renderCardView() {
  const id = S.cardView; const T = C.TOWERS[id]; const c = S.save.cards[id];
  panel(12, 12, 376, 636, '#fff6ee');
  A.text(ctx, T.name, 200, 36, 24, '#b5d8ff');
  drawButton(22, 18, 66, 28, 'Back', '#d9cfe0', { size: 13, r: 10 }); button('cvBack', 14, 8, 84, 48, () => go('cards')); // v0.7.2: small Back (the tab bar's Cards tab also returns to the list)
  drawCardPic(28, 58, 104, 136, id, { level: c.level, locked: !c.unlocked });
  plainText(c.unlocked ? `In battle: level ${c.level}` : 'Not unlocked yet', 146, 76, 15, INFO_INK, 'left', '800');
  plainText('3 cards of a level \u2192 1 of the next', 146, 102, 12, INFO_SOFT, 'left', '600');
  plainText('Your highest level fights.', 146, 120, 12, INFO_SOFT, 'left', '600');
  plainText(`Cards held: ${M.totalCards(c)}`, 146, 138, 12, INFO_SOFT, 'left', '600');
  A.coinIcon(ctx, 158, 170, 1); A.text(ctx, String(S.save.coins), 190, 171, 15, '#ffd45e');
  const rows = M.mergeRows(S.save, id);
  plainText('Your cards by level', 28, 212, 12, '#3d2a36', 'left', '800');
  rows.forEach((r, k) => {
    const col = k % 5, row = Math.floor(k / 5);
    const x = 26 + col * 70, y = 224 + row * 138, w = 62, h = 80;
    drawCardPic(x, y, w, h, id, { level: r.L, count: r.have, dim: r.have === 0, still: true });
    if (r.maxed) { plainText('top level', x + w / 2, y + h + 16, 11, '#c9962a', 'center', '700'); return; }
    const can = M.canMergeAt(S.save, id, r.L);
    plainFit(`${Math.min(r.have, r.need)}/${r.need}`, x + w / 2, y + h + 9, w, 10.5, r.ready ? '#2f8a36' : '#a08090', 'center', '700');
    drawButton(x, y + h + 17, w, 24, `\u2192 L${r.to}`, can ? '#ff9ec0' : '#e6dce2', { size: 12, r: 9, disabled: !can });
    if (r.coins) plainFit(`${r.coins} coins`, x + w / 2, y + h + 50, w, 10, '#c9962a', 'center', '700');
    button('mrg' + r.L, x - 3, y + h + 2, w + 6, 58, () => { // touch target covers the n/3 label, the button and its price (>= 44 px)
      if (!r.ready) { toast(`Need ${r.need} cards of level ${r.L}`); return; }
      if (S.save.coins < r.coins) { toast(`Need ${r.coins} coins`); return; }
      const res = M.mergeAt(S.save, id, r.L);
      if (res) { persist(); sfx('upgrade'); S.mergeAnim = { id, from: r.L, to: res.to, n: r.need, t: 0 }; }
    });
  });
  cardInfoPanel(id, 24, 497, 352, 97, {});
  const ready = M.mergeReady(S.save, id);
  drawButton(24, 604, 352, 34, 'Merge all', ready ? '#ff9ec0' : '#e6dce2', { size: 15, r: 12, disabled: !M.anyMergeReady(S.save) }); button('cvMergeAll', 24, 591, 352, 57, doMergeAll);
  if (S.mergeAnim) renderMergeAnim();
}
// Merge animation: the 3 merged cards fly into one, flash, it grows and the level badge flips to the new level.
function renderMergeAnim() {
  const MA = S.mergeAnim; MA.t += 1 / 60; const T = C.UI.mergeAnimTime; const k = MA.t / T;
  ctx.save(); ctx.fillStyle = `rgba(60,40,55,${Math.min(0.55, k * 3)})`; ctx.fillRect(-2000, -2000, W + 4000, H + 4000); ctx.restore();
  const cx = 200, cy = 330;
  const n = Math.min(6, MA.n || 3);
  if (k < 0.45) {
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2 + k * 3, q = Math.min(1, k / 0.42), r = 150 * (1 - q * q);
      ctx.save(); ctx.translate(cx + Math.cos(a) * r, cy + Math.sin(a) * r * 0.8); ctx.rotate(a + k * 8); ctx.scale(0.55, 0.55); drawCardPic(-40, -54, 80, 108, MA.id, { level: MA.from, still: true }); ctx.restore();
    }
  }
  const grow = k < 0.45 ? 1 : k < 0.6 ? 1 + (k - 0.45) / 0.15 * 0.35 : 1.35 - Math.min(0.15, (k - 0.6) * 0.6);
  ctx.save(); ctx.translate(cx, cy); ctx.scale(grow * 1.4, grow * 1.4);
  drawCardPic(-40, -54, 80, 108, MA.id, { level: k < 0.55 ? MA.from : MA.to });
  ctx.restore();
  if (k > 0.45 && k < 0.75) { ctx.save(); ctx.globalAlpha = 1 - (k - 0.45) / 0.3; ctx.beginPath(); ctx.arc(cx, cy, 40 + (k - 0.45) * 400, 0, 7); ctx.fillStyle = 'rgba(255,255,230,0.85)'; ctx.fill(); ctx.restore(); }
  if (k > 0.5) {
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2, d = 60 + (k - 0.5) * 260; ctx.save(); ctx.globalAlpha = Math.max(0, 1 - (k - 0.5) * 2); A.starShape(ctx, cx + Math.cos(a) * d, cy + Math.sin(a) * d, 6, '#ffe36e', 1.4); ctx.restore(); }
    const bs = k < 0.62 ? 0.5 + (k - 0.5) / 0.12 : 1;
    ctx.save(); ctx.translate(cx, cy - 110); ctx.scale(bs, bs);
    A.text(ctx, `3 \u00d7 L${MA.from}  \u2192  L${MA.to}`, 0, 0, 28, '#ffe36e');
    const d = MA.to >= 2 ? cardUpgradeDiff(MA.id, MA.to - 1) : [];
    fitText(MA.all > 1 ? `${MA.all} merges done!` : d.length ? `L${MA.to}: ` + d.map((q) => diffText(MA.id, q)).join(' + ') : '', 0, 34, 330, 14, '#ffffff');
    ctx.restore();
  }
  ctx.save(); A.rr(ctx, cx - 70, 600, 140, 26, 13); ctx.fillStyle = 'rgba(60,40,55,0.85)'; ctx.fill(); ctx.restore();
  A.text(ctx, 'Tap to continue', cx, 614, 12, '#ffffff', 'center', null);
  button('mergeSkip', -2000, -2000, W + 4000, H + 4000, () => { S.mergeAnim = null; }); // on top: blocks other buttons while playing
  if (MA.t >= T + 0.8) S.mergeAnim = null;
}

// ---------------- SHOP ----------------
// v0.5 item 8: bigger, nicer owned-count badge; every purchase plays three animations together: the card pulses (~5%), the count
// pulses (~28%) while it changes, and the price floats away from the coins (or diamonds) as "-price".
// v0.5 item 9: diamonds LEFT of the coins on one row. v0.5 item 1b: the same bottom info panel as the Cards screen.
const SHOP_FX = { cardPulse: 0.05, countPulse: 0.28, time: 0.45 };
function shopPulse(kind, id) { const f = S.shopFx; if (!f || f.kind !== kind || f.id !== id) return null; const k = (S.t - f.t0) / SHOP_FX.time; if (k >= 1) return null; return k; }
function shopBought(kind, id, price, cur) {
  S.shopFx = { kind, id, t0: S.t };
  const at = cur === 'diamond' ? { x: 152, y: 92 } : { x: 290, y: 92 };
  addUi({ k: 'priceFloat', cur, n: price, x: at.x, y: at.y, life: 1.1, max: 1.1 });
}
function countBadge(x, y, n, k) {
  const sc = k == null ? 1 : 1 + SHOP_FX.countPulse * Math.sin(Math.min(1, k) * Math.PI);
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc);
  const str = `\u00d7${n}`; ctx.font = `bold 15px ${A.FONT}`; const w = Math.max(30, ctx.measureText(str).width + 14);
  A.rr(ctx, -w / 2, -12, w, 24, 12); ctx.fillStyle = k == null ? '#ffffff' : '#fff3b0'; ctx.fill(); ctx.lineWidth = 2.2; ctx.strokeStyle = A.INK; ctx.stroke();
  A.text(ctx, str, 0, 0.5, 15, '#ff6f91');
  ctx.restore();
}
function renderShop() {
  const E = C.ECONOMY.shop;
  panel(12, 12, 376, 636, '#fff6ee');
  A.text(ctx, 'Shop', 200, 36, 28, '#ffd27a');
  panel(62, 56, 132, 32, '#e6f5ff', 16); A.diamondIcon(ctx, 84, 72, 1); A.text(ctx, String(S.save.diamonds || 0), 140, 73, 17, '#7fd3ff');
  panel(206, 56, 132, 32, '#fff1d6', 16); A.coinIcon(ctx, 228, 72, 1.1); A.text(ctx, String(S.save.coins), 284, 73, 17, '#ffd45e');
  plainText('No real money, ever. Diamonds come from Daily Rewards.', 200, 101, 11, '#a08090', 'center', '600');
  // pack
  panel(26, 112, 348, 62, '#ffe9f0', 14);
  for (let k = 0; k < 3; k++) { ctx.save(); ctx.translate(58 + k * 14, 146 - k * 3); ctx.rotate(-0.2 + k * 0.2); A.rr(ctx, -14, -20, 28, 38, 6); ctx.fillStyle = ['#ffb3c1', '#b5d8ff', '#ffd27a'][k]; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = A.INK; ctx.stroke(); A.text(ctx, '?', 0, 0, 16); ctx.restore(); }
  const gift = M.zapperGiftPending(S.save); // v0.6 item 5: the one-time FREE 5-card gift takes the pack's place
  if (gift) {
    A.text(ctx, `FREE pack: ${E.cardPackSize} cards!`, 112, 132, 14, '#e0607e', 'left', null);
    A.text(ctx, `${E.cardPackSize - 1} random + Zapper`, 112, 152, 11, '#a08090', 'left', null); // v0.7 D-P0
    drawButton(290, 122, 74, 40, 'FREE', '#9fe0b5', { size: 17 });
  } else {
    A.text(ctx, `Card pack: ${E.cardPackSize} random cards`, 112, 132, 13, '#7a4a5a', 'left', null);
    { const left = Math.max(1, (E.packPity || 0) - (S.save.packsSinceNew || 0)); // v0.6.2 item 13 + v0.7 D-P3 pity
      plainFit(M.lockedCards(S.save).length ? `level 1, ${Math.round(E.packNewTowerChance * 100)}% NEW tower${E.packPity ? ` (sure in ${left})` : ''}` : 'level 1, of your unlocked towers', 112, 152, 172, 11, '#a08090', 'left', '700'); }
    drawButton(290, 122, 74, 40, `${E.cardPack}c`, '#9fe0b5', { size: 15, disabled: S.save.coins < E.cardPack });
    // v0.7: every pack opens the pack reveal (no toast, no separate NEW CARD reveal; a new tower is the last card)
    button('pack', 290, 122, 74, 40, () => { const got = M.buyPack(S.save); if (got) { persist(); shopBought('pack', 'pack', E.cardPack, 'coin'); openPackReveal(got, { source: 'paid', newTower: got.newTower }); } else toast('Not enough coins'); });
  }
  // single cards: tap = buy (a copy, or unlock a new tower); (i) = just show its stats below
  plainText(`Tap a card to buy: level-1 card ${E.cardL1}c, new tower 100-400c`, 30, 188, 12, '#7a5a6a', 'left', '700'); // v0.6.2 item 12: tiered unlock prices
  C.ALL_CARDS.forEach((id, k) => { // v0.6: 13 cards -> 5 columns
    const col = k % 5, row = Math.floor(k / 5);
    const x = 24 + col * 71, y = 200 + row * 84, w = 64, h = 62;
    const c = S.save.cards[id], own = c.unlocked, up = M.unlockPrice(id);
    const pk = shopPulse('card', id), cs = pk == null ? 1 : 1 + SHOP_FX.cardPulse * Math.sin(pk * Math.PI);
    ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(cs, cs); ctx.translate(-(x + w / 2), -(y + h / 2));
    drawCardPic(x, y, w, h, id, { level: c.level, locked: !own, lockText: `Unlock ${up}c`, selected: S.shopSel === id, selCol: '#5a9fe0' }); // v0.6.1: card picture
    ctx.restore();
    if (own) countBadge(x + w - 17, y + 13, M.totalCards(c), pk); // v0.6: how many cards of this tower you hold (all levels) // inside the card corner (no overlap with the row above)
    // info + price row under the card
    A.blob(ctx, x + 10, y + h + 10, 8, 8, S.shopSel === id ? '#5a9fe0' : '#d7e8ff', 1.6); A.text(ctx, 'i', x + 10, y + h + 10.5, 11, '#fff');
    plainText(own ? `${E.cardL1}c` : `${up}c`, x + w - 4, y + h + 10, 11.5, own ? '#c9962a' : '#e0607e', 'right', '800');
    button('buy' + id, x, y, w, h, () => {
      S.shopSel = id;
      if (own) { if (M.buyCard(S.save, id)) { persist(); sfx('tap'); shopBought('card', id, E.cardL1, 'coin'); } else toast('Not enough coins'); }
      else if (M.buyCardUnlock(S.save, id)) { persist(); sfx('upgrade'); shopBought('card', id, up, 'coin'); queueReveal(id, 1, true, S.t + 0.3); }
      else toast(`Need ${up} coins`);
    });
    button('info' + id, x - 2, y + h - 2, 40, 24, () => { S.shopSel = S.shopSel === id ? null : id; sfx('tap'); });
  });
  // boosters (v0.4 item 10: fixed price, paid in DIAMONDS)
  const by = 462;
  { const bl = `Boosters - ${E.boosterDiamonds} diamonds each`; plainText(bl, 30, by, 12, '#7a5a6a', 'left', '700'); A.diamondIcon(ctx, 30 + ctx.measureText(bl).width + 12, by, 0.7); }
  C.BONUS_TYPES.forEach((bt, k) => {
    const x = 26 + k * 88, y = by + 10, w = 80, h = 56;
    const pk = shopPulse('booster', bt), cs = pk == null ? 1 : 1 + SHOP_FX.cardPulse * Math.sin(pk * Math.PI);
    ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(cs, cs); ctx.translate(-(x + w / 2), -(y + h / 2));
    A.rr(ctx, x, y, w, h, 14); ctx.fillStyle = A.shade(C.BONUSES[bt].color, 0.2); ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = A.INK; ctx.stroke();
    ctx.save(); ctx.translate(x + w / 2, y + 22); ctx.scale(1.05, 1.05); A.drawBonusIcon(ctx, bt, S.t); ctx.restore();
    fitText(C.BONUSES[bt].name, x + w / 2, y + 46, w - 8, 10.5, '#fff');
    ctx.restore();
    countBadge(x + w - 19, y + 15, S.save.bonusStock[bt] || 0, pk);
    button('bbuy' + bt, x, y, w, h, () => { if (M.buyBonus(S.save, bt)) { persist(); sfx('tap'); shopBought('booster', bt, E.boosterDiamonds, 'diamond'); } else toast(`Need ${E.boosterDiamonds} diamonds`); });
  });
  cardInfoPanel(S.shopSel, 24, 534, 352, 108, { hint: 'Tap (i) under a card to see its stats.' });
  if (gift && !S.reveal.length && !S.pack) onboardSpot({ x: 286, y: 118, w: 82, h: 48, r: 14 }, 'gift', claimGift, 'Your free pack - tap it!');
  else if (!S.pack && !S.reveal.length && S.save.onboard && S.save.onboard.cardsHint === 'shop') // v0.7: after the free pack, Cards > Zapper once
    onboardSpot(tabRect(1), 'tocards', () => { S.save.onboard.cardsHint = 'cards'; persist(); go('cards'); }, 'See your new cards!');
  renderUiFx(1 / 60);
}
function claimGift() {
  const res = M.claimZapperGift(S.save); if (!res) return;
  persist(); S.shopFx = { kind: 'pack', id: 'pack', t0: S.t };
  // v0.7 D-P0: the pack reveal; the Zapper is the last card (NEW when it was locked, a normal card when owned)
  openPackReveal(res.got, { source: 'free', newTower: res.zapper.newType ? 'zapper' : null, zapperOwned: res.zapperOwned });
}

// ---------------- v0.5 item 7: NEW CARD reveal (only for a NEW type or a level of that type never owned before) ----------------
function queueReveal(id, level, newType, at = S.t) { S.reveal.push({ id, level, newType: !!newType, at, t: 0 }); }
function renderReveal(dt) {
  const R = S.reveal[0]; R.t += dt; const k = Math.min(1, R.t / 0.45);
  ctx.save(); ctx.fillStyle = `rgba(50,32,46,${0.72 * k})`; ctx.fillRect(-2000, -2000, W + 4000, H + 4000); ctx.restore();
  ctx.save(); ctx.translate(200, 330);
  for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2 + R.t * 0.4; ctx.save(); ctx.rotate(a); ctx.globalAlpha = 0.18 * k; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(230, -22); ctx.lineTo(230, 22); ctx.closePath(); ctx.fillStyle = '#fff3a8'; ctx.fill(); ctx.restore(); }
  const sc = (0.3 + 0.7 * (1 - Math.pow(1 - k, 3))) * 1.9 + Math.sin(R.t * 3) * 0.03;
  ctx.rotate((1 - k) * -0.6); ctx.scale(sc, sc); drawCardPic(-42, -56, 84, 112, R.id, { level: R.level });
  ctx.restore();
  for (let i = 0; i < 8; i++) { const a = R.t * 1.2 + i * Math.PI / 4; A.starShape(ctx, 200 + Math.cos(a) * 130, 330 + Math.sin(a) * 140, 5 + (i % 3), '#ffe36e', 1.2); }
  const ts = 34 + Math.max(0, 0.3 - R.t) * 40;
  A.text(ctx, 'NEW CARD!', 200, 108, ts, '#ffe36e'); // v0.5.1: same indicator for a new type and a new level
  A.text(ctx, `${C.TOWERS[R.id].name}  \u00b7  Level ${R.level}`, 200, 152, 18, '#ffffff');
  plainText('Added to your Cards', 200, 548, 13, '#ffe9c0', 'center', '700');
  if (R.t > 0.5) { A.rr(ctx, 130, 588, 140, 30, 15); ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fill(); A.text(ctx, 'Tap to continue', 200, 603, 13, '#ffffff', 'center', null); }
  button('revealNext', -2000, -2000, W + 4000, H + 4000, () => { if (R.t > 0.4) { S.reveal.shift(); sfx('tap'); } });
}

// ---------------- v0.7 (economy plan §2.9.2): PACK REVEAL - free pack and every paid pack ----------------
// dim -> pack drops in -> shake -> burst -> 5 cards dealt face-down -> flipped one by one (merge pips fill) -> NEW TOWER beat
// (only when the last card is a new tower) -> summary (title, 5 cards, OK + Cards). Tap after 150 ms skips to the summary.
// Replaces the old "Got: ..." toast and the pack-sourced NEW CARD reveal. Faces are pre-rendered when the pack opens.
const PACK = { dim: 0.15, drop: 0.2, shake: 0.45, burst: 0.6, deal0: 0.6, dealStep: 0.08, dealDur: 0.2, flip0: 1.15, flipStep: 0.15, flipDur: 0.22,
  pip: 0.15, beat: 0.4, summary: 2.0, summaryNew: 2.4, fade: 0.15, tapHint: 0.3, cardW: 64, cardH: 86, gap: 8, rowY: 250, packX: 200, packY: 330 };
function haptic(kind) { /* v0.7: no-op hook (no haptics dependency; plan §2.9.2 "Later") */ }
function reducedMotion() { try { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) { return false; } }
function packSlotX(i) { return 24 + i * (PACK.cardW + PACK.gap); }
function prerenderCard(draw, w, h) {
  const k = dpr * scale, pad = 6;
  const cv = A.makeCanvas(Math.ceil((w + pad * 2) * k), Math.ceil((h + pad * 2) * k)); const g = cv.getContext('2d');
  g.scale(k, k); const keep = ctx; ctx = g;
  try { draw(pad, pad); } finally { ctx = keep; }
  return { cv, pad };
}
function drawCardBack(x, y, w, h) {
  A.rr(ctx, x, y + 3, w, h, 8); ctx.fillStyle = 'rgba(74,52,66,0.25)'; ctx.fill();
  A.rr(ctx, x, y, w, h, 8); ctx.fillStyle = '#ff9eb5'; ctx.fill(); ctx.lineWidth = 2.4; ctx.strokeStyle = A.INK; ctx.stroke();
  A.rr(ctx, x + 5, y + 5, w - 10, h - 10, 6); ctx.fillStyle = '#ffd1dc'; ctx.fill();
  for (let i = 0; i < 9; i++) { const cx = x + 12 + (i % 3) * ((w - 24) / 2), cy = y + 14 + Math.floor(i / 3) * ((h - 28) / 2); ctx.beginPath(); ctx.arc(cx, cy, 3.2, 0, 7); ctx.fillStyle = '#e8b06a'; ctx.fill(); ctx.lineWidth = 1.2; ctx.strokeStyle = A.INK; ctx.stroke(); }
}
// cards: ids in deal order (a new tower LAST). opt: { source: 'free'|'paid', newTower: id|null, zapperOwned }
function openPackReveal(ids, opt = {}) {
  const counts = {}; for (const id of ids) counts[id] = (counts[id] || 0) + 1;
  const seen = {};
  const cards = ids.map((id, i) => {
    const c = S.save.cards[id]; const before = M.countAt(c, 1) - counts[id];
    seen[id] = (seen[id] || 0) + 1;
    const have = before + seen[id], row = M.mergeRow(c, 1);
    return { id, have, need: row.need, ready: !row.maxed && have >= row.need, maxed: row.maxed, isNew: !!(opt.newTower && i === ids.length - 1 && id === opt.newTower) };
  });
  const newTower = cards.length && cards[cards.length - 1].isNew;
  const W2 = PACK.cardW, H2 = PACK.cardH;
  const faces = cards.map((cd) => prerenderCard((x, y) => drawCardPic(x, y, W2, H2, cd.id, { level: 1, still: true }), W2, H2));
  const back = prerenderCard((x, y) => drawCardBack(x, y, W2, H2), W2, H2);
  const free = opt.source === 'free';
  const P = { cards, faces, back, t: 0, skipped: false, source: opt.source || 'paid', newTower, fired: {},
    summaryAt: newTower ? PACK.summaryNew : PACK.summary,
    title: free ? 'FREE PACK!' : 'CARD PACK',
    subtitle: free && opt.zapperOwned ? 'Zapper card + 4 random' : `${cards.length} cards added to your Cards`,
    stars: Array.from({ length: 10 }, (_, i) => ({ a: i / 10 * Math.PI * 2 + Math.random() * 0.3, sp: 90 + Math.random() * 60 })) };
  if (reducedMotion()) { P.reduced = true; P.skipped = true; P.t = P.summaryAt; P.fadeFrom = P.summaryAt; }
  S.pack = P; S.toast = null;
}
function skipPack() {
  const P = S.pack; if (!P || P.skipped || P.t < PACK.dim || P.t >= P.summaryAt) return;
  P.skipped = true; P.t = P.summaryAt; sfx(P.newTower ? 'win' : 'upgrade');
}
function closePack(to) {
  const P = S.pack; if (!P) return; S.pack = null; sfx('tap');
  if (P.source === 'free') { S.save.onboard = S.save.onboard || M.newOnboardState(); if (!S.save.onboard.cardsHint) { S.save.onboard.cardsHint = 'shop'; persist(); } }
  if (to === 'cards') { if (S.save.onboard && S.save.onboard.cardsHint === 'shop') { S.save.onboard.cardsHint = 'cards'; persist(); } go('cards'); }
}
function packFire(key, at, fn) { const P = S.pack; if (P.skipped || P.fired[key] || P.t < at) return; P.fired[key] = true; fn(); }
const easeOut = (k) => 1 - Math.pow(1 - Math.max(0, Math.min(1, k)), 3);
function renderPack(dt) {
  const P = S.pack; P.t += dt; const t = P.t;
  // sounds / haptic hooks at their step times (none after a skip)
  packFire('drop', 0, () => sfx('tap'));
  packFire('shake', PACK.drop, () => { sfx('packShake'); haptic('light'); });
  packFire('burst', PACK.shake, () => { sfx('pop'); haptic('medium'); });
  P.cards.forEach((cd, i) => {
    const f0 = PACK.flip0 + i * PACK.flipStep;
    packFire('flip' + i, f0, () => sfx('cardFlip'));
    if (cd.ready) packFire('merge' + i, f0 + PACK.flipDur / 2, () => sfx('upgrade'));
  });
  const lastFlipEnd = PACK.flip0 + (P.cards.length - 1) * PACK.flipStep + PACK.flipDur;
  if (P.newTower) packFire('beat', lastFlipEnd, () => { sfx('win'); haptic('medium'); });
  // dim
  const dimA = P.reduced ? 0.72 * Math.min(1, (t - P.fadeFrom) / PACK.fade) : 0.72 * Math.min(1, t / PACK.dim);
  ctx.save(); ctx.fillStyle = `rgba(50,32,46,${dimA})`; ctx.fillRect(-2000, -2000, W + 4000, H + 4000); ctx.restore();
  const inSummary = t >= P.summaryAt;
  // pack (0 - 0.6 s)
  if (!inSummary && t < PACK.burst) {
    ctx.save();
    if (t < PACK.shake) {
      const k = easeOut(t / PACK.drop), sc = 0.6 + 0.4 * k, y = 200 + (PACK.packY - 200) * k;
      const rot = t > PACK.drop ? Math.sin((t - PACK.drop) / (PACK.shake - PACK.drop) * Math.PI * 4) * 4 * Math.PI / 180 : 0;
      ctx.translate(PACK.packX, y); ctx.rotate(rot); ctx.scale(sc, sc); drawPackArt(0, 1);
    } else {
      const k = (t - PACK.shake) / (PACK.burst - PACK.shake);
      for (const s of [-1, 1]) { ctx.save(); ctx.globalAlpha = 1 - k; ctx.translate(PACK.packX + s * 60 * k, PACK.packY); ctx.rotate(s * 0.4 * k); ctx.beginPath(); ctx.rect(s < 0 ? -80 : 0, -90, 80, 180); ctx.clip(); drawPackArt(0, 1); ctx.restore(); }
    }
    ctx.restore();
  }
  // burst stars (0.45 - 1.0 s)
  if (!inSummary && t >= PACK.shake && t < PACK.shake + 0.55) {
    const k = (t - PACK.shake) / 0.55;
    for (const s of P.stars) A.starShape(ctx, PACK.packX + Math.cos(s.a) * s.sp * k, PACK.packY + Math.sin(s.a) * s.sp * k, 6 * (1 - k) + 2, '#ffe36e', 1.2);
  }
  // cards
  const W2 = PACK.cardW, H2 = PACK.cardH;
  P.cards.forEach((cd, i) => {
    const d0 = PACK.deal0 + i * PACK.dealStep; if (!inSummary && t < d0) return;
    const dk = inSummary ? 1 : easeOut((t - d0) / PACK.dealDur);
    const tx = packSlotX(i), ty = PACK.rowY;
    const x = PACK.packX - W2 / 2 + (tx - (PACK.packX - W2 / 2)) * dk, y = PACK.packY - H2 / 2 + (ty - (PACK.packY - H2 / 2)) * dk;
    const f0 = PACK.flip0 + i * PACK.flipStep, fp = inSummary ? 1 : Math.max(0, Math.min(1, (t - f0) / PACK.flipDur));
    const sx = Math.abs(Math.cos(fp * Math.PI)), face = fp > 0.5;
    let sc = 1;
    if (cd.ready && face) { const mk = inSummary ? 1 : (t - f0 - PACK.flipDur / 2) / 0.3; if (mk < 1) sc = 1 + 0.08 * Math.sin(Math.max(0, mk) * Math.PI); }
    if (cd.isNew && face) {
      const bk = Math.max(0, Math.min(1, (t - lastFlipEnd) / PACK.beat));
      sc = inSummary ? 1.15 : bk < 0.5 ? 1 + 0.7 * bk : 1.35 - 0.4 * (bk - 0.5);
      // ray halo (shape, not colour only)
      ctx.save(); ctx.translate(tx + W2 / 2, ty + H2 / 2);
      for (let r = 0; r < 14; r++) { ctx.save(); ctx.rotate(r / 14 * Math.PI * 2 + S.t * 0.4); ctx.globalAlpha = 0.28; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(70, -8); ctx.lineTo(70, 8); ctx.closePath(); ctx.fillStyle = '#fff3a8'; ctx.fill(); ctx.restore(); }
      ctx.restore();
    }
    const img = face ? P.faces[i] : P.back;
    ctx.save(); ctx.translate(x + W2 / 2, y + H2 / 2); ctx.scale(sx * sc, sc);
    ctx.drawImage(img.cv, -W2 / 2 - img.pad, -H2 / 2 - img.pad, W2 + img.pad * 2, H2 + img.pad * 2);
    ctx.restore();
    if (!face) return;
    // under the card: name, merge pips + "n/3 -> L2", MERGE! / MAX
    const cx = tx + W2 / 2, ny = ty + H2 + 12;
    fitText(C.TOWERS[cd.id].short || C.TOWERS[cd.id].name, cx, ny, W2, 11, '#ffffff');
    const pk = inSummary ? 1 : Math.max(0, Math.min(1, (t - f0 - PACK.flipDur / 2) / PACK.pip));
    if (cd.maxed) plainText('MAX', cx, ny + 18, 11, '#ffe36e', 'center', '800');
    else {
      const filled = Math.min(cd.need, cd.have);
      for (let p = 0; p < cd.need; p++) {
        const px = cx - 14 + p * 14, py = ny + 18; const isNewPip = p === filled - 1;
        ctx.beginPath(); ctx.arc(px, py, 4.6, 0, 7); ctx.lineWidth = 1.8; ctx.strokeStyle = '#ffffff'; ctx.stroke();
        if (p < filled) { ctx.beginPath(); ctx.arc(px, py, 4.6 * (isNewPip ? pk : 1), 0, 7); ctx.fillStyle = '#ffe36e'; ctx.fill(); }
      }
      plainText(`${Math.min(cd.have, cd.need)}/${cd.need} \u2192 L2`, cx, ny + 34, 11, '#ffe9c0', 'center', '700');
      if (cd.ready && pk >= 1) drawMergeTag(cx, ny + 54);
    }
    if (cd.isNew) { // "NEW" ribbon across the top-right corner
      ctx.save(); ctx.translate(tx + W2 - 6, ty + 8); ctx.rotate(Math.PI / 4);
      A.rr(ctx, -24, -8, 48, 16, 4); ctx.fillStyle = '#ffe36e'; ctx.fill(); ctx.lineWidth = 1.8; ctx.strokeStyle = A.INK; ctx.stroke();
      A.text(ctx, 'NEW', 0, 0.5, 11, '#e0607e', 'center', null); ctx.restore();
    }
  });
  // NEW TOWER! ribbon during the beat and on the summary
  if (P.newTower && t >= lastFlipEnd) {
    const k = Math.min(1, (t - lastFlipEnd) / 0.2);
    ctx.save(); ctx.globalAlpha = k; A.rr(ctx, 110, 206, 180, 30, 10); ctx.fillStyle = '#ffe36e'; ctx.fill(); ctx.lineWidth = 2.2; ctx.strokeStyle = A.INK; ctx.stroke();
    A.text(ctx, 'NEW TOWER!', 200, 221.5, 17, '#e0607e', 'center', null); ctx.restore();
  }
  // summary: title, subtitle, buttons (fade in), then tap anywhere closes
  if (inSummary) {
    const a = Math.min(1, (t - P.summaryAt) / PACK.fade);
    ctx.save(); ctx.globalAlpha = a;
    A.text(ctx, P.title, 200, 150, 28, '#ffe36e');
    plainText(P.subtitle, 200, 186, 14, '#ffffff', 'center', '700');
    const merge = M.anyMergeReady(S.save);
    drawButton(32, 470, 160, 48, 'OK', '#ffd45e');
    drawButton(208, 470, 160, 48, merge ? 'Merge now' : 'Cards', '#b5d8ff', { size: merge ? 16 : 17 });
    if (t - P.summaryAt >= PACK.tapHint) plainText('Tap anywhere to continue', 200, 545, 12, '#ffe9c0', 'center', '700');
    ctx.restore();
  }
  // input: whole-screen catcher BEHIND the buttons
  button('packTap', -2000, -2000, W + 4000, H + 4000, () => {
    if (t < P.summaryAt) skipPack();
    else if (t - P.summaryAt >= PACK.tapHint) closePack('ok');
  });
  if (inSummary) {
    button('packOk', 32, 466, 160, 56, () => closePack('ok'));
    button('packCards', 208, 466, 160, 56, () => closePack('cards'));
  }
}
function drawPackArt(x, y) {
  ctx.save(); ctx.translate(x, y);
  A.rr(ctx, -60, -75 + 4, 120, 150, 16); ctx.fillStyle = 'rgba(74,52,66,0.3)'; ctx.fill();
  A.rr(ctx, -60, -75, 120, 150, 16); const g = ctx.createLinearGradient(0, -75, 0, 75); g.addColorStop(0, '#fff3f7'); g.addColorStop(1, '#ffc8d6'); ctx.fillStyle = g; ctx.fill();
  ctx.lineWidth = 3; ctx.strokeStyle = A.INK; ctx.stroke();
  for (let k = 0; k < 3; k++) { ctx.save(); ctx.translate(-26 + k * 26, 6 - (k === 1 ? 8 : 0)); ctx.rotate(-0.25 + k * 0.25); A.rr(ctx, -18, -26, 36, 50, 7); ctx.fillStyle = ['#ffb3c1', '#b5d8ff', '#ffd27a'][k]; ctx.fill(); ctx.lineWidth = 2.2; ctx.strokeStyle = A.INK; ctx.stroke(); A.text(ctx, '?', 0, 0, 20); ctx.restore(); }
  A.text(ctx, 'CARDS', 0, -56, 15, '#ff6f91');
  ctx.restore();
}
function drawMergeTag(cx, y) {
  ctx.save();
  A.rr(ctx, cx - 30, y - 9, 60, 18, 8); ctx.fillStyle = '#55b85a'; ctx.fill(); ctx.lineWidth = 1.8; ctx.strokeStyle = A.INK; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx - 24, y + 4); ctx.lineTo(cx - 20, y - 4); ctx.lineTo(cx - 16, y + 4); ctx.closePath(); ctx.fillStyle = '#ffffff'; ctx.fill(); // up-arrow shape
  A.text(ctx, 'MERGE!', cx + 5, y + 0.5, 11, '#ffffff', 'center', null);
  ctx.restore();
}

// ---------------- v0.5 item 16: fireworks (screen space, above everything) ----------------
function launchFireworks(n = 8, dur = 2.5) { for (let i = 0; i < n; i++) S.fireworks.queue.push({ at: S.t + (i / n) * dur + Math.random() * 0.2 }); }
function renderFireworks(dt) {
  const F = S.fireworks; if (!F.queue.length && !F.rockets.length && !F.parts.length) return;
  const cols = ['#ff8fab', '#ffd45e', '#8fe388', '#9fd3f2', '#c9b6f2', '#ffffff'];
  F.queue = F.queue.filter((q) => { if (q.at > S.t) return true; const x = 60 + Math.random() * 280; F.rockets.push({ x, y: H + 10, vx: (Math.random() - 0.5) * 40, vy: -520 - Math.random() * 160, ty: 120 + Math.random() * 220, c: cols[Math.floor(Math.random() * cols.length)] }); return false; });
  ctx.save();
  F.rockets = F.rockets.filter((r) => {
    r.x += r.vx * dt; r.y += r.vy * dt; r.vy += 260 * dt;
    ctx.beginPath(); ctx.arc(r.x, r.y, 2.6, 0, 7); ctx.fillStyle = '#fff6c8'; ctx.fill();
    ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.moveTo(r.x, r.y); ctx.lineTo(r.x - r.vx * 0.04, r.y - r.vy * 0.04); ctx.lineWidth = 2; ctx.strokeStyle = '#ffe9a0'; ctx.stroke(); ctx.globalAlpha = 1;
    if (r.y <= r.ty || r.vy >= -40) { const n = 34; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, sp = 110 + Math.random() * 90; F.parts.push({ x: r.x, y: r.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1.2 + Math.random() * 0.4, max: 1.6, c: Math.random() < 0.25 ? '#ffffff' : r.c }); } sfx('pop'); return false; }
    return true;
  });
  F.parts = F.parts.filter((p) => {
    p.life -= dt; if (p.life <= 0) return false;
    p.vx *= 0.985; p.vy = p.vy * 0.985 + 90 * dt; p.x += p.vx * dt; p.y += p.vy * dt;
    ctx.globalAlpha = Math.min(1, p.life / 0.6); ctx.beginPath(); ctx.arc(p.x, p.y, 2.4, 0, 7); ctx.fillStyle = p.c; ctx.fill();
    return true;
  });
  ctx.restore();
}

// ---------------- test / screenshot hooks (local only, no network) ----------------
if (__TEST_HOOKS__) window.__game = {
  S, C, M, A, Cal, Treat,
  setClockOffset(ms) { S.clockOffset = ms; }, now, heartbeat, openCalendar, maybeShowCalendar,
  hitAt: (cx, cy) => { const p = { x: (cx - offX) / scale, y: (cy - offY) / scale }; const b = hit(prevButtons, p.x, p.y); return b ? b.id : null; },
  buttons: () => prevButtons.map(({ id, x, y, w, h }) => ({ id, x, y, w, h, sx: offX + (x + w / 2) * scale, sy: offY + (y + h / 2) * scale, cssW: w * scale, cssH: h * scale })),
  go, openPrep, startBattle, finishBattle, consumeEvents, openCardView, queueReveal, launchFireworks, startMode, nodePos, gateY, maxMapScroll,
  claimGift, doMergeAll, openPackReveal, skipPack, closePack, upgradeGain, reducedMotion, spriteCache: (k) => A.spriteCacheStats(k),
  renderOnce: (dt = 1 / 60) => { S.t += dt; render(dt); }, // benchmark hook (test build only)
  setSave(s) { S.save = s; persist(); },
  // fast-forward; only the last ~0.4 s of events become visible effects (so screenshots are not flooded)
  simulate(seconds, bot = true) { const b = S.battle; const n = Math.round(seconds * 60); for (let i = 0; i < n && !b.result; i++) { b.update(1 / 60); if (bot) smartBotStep(b); if (i < n - 24) b.events = []; } S.fx = []; S.ui = []; S.slotFlip = [0, 0, 0]; consumeEvents(); if (b.result) finishBattle(); },
  setAutoBot(v) { S.autoBot = v; },
  setInset(px) { insetOverride = px; resize(); }, layout: () => ({ cw, ch, insetB, scale, offX, offY, barK, barH: BAR_H, metaH: META_H, dpr }), tabRect, BAR_H,
  mapPreview(id) { const b = new Battle({ levelIndex: 0, mapId: id, deck: [], bonusTypes: [], seed: 1 }); const src = A.renderMapBackground(b.routes, b.map.theme || 0, MAP_W, MAP_H, 2, b.props); const cv = document.createElement('canvas'); cv.width = src.width; cv.height = src.height; cv.getContext('2d').drawImage(src, 0, 0); return cv.toDataURL('image/png'); },
};
heartbeat(true); maybeShowCalendar();
// v0.6 item 5: an existing player past stage 2 without a Bug Zapper got one on load - show it with the NEW CARD popup
if (S.save.onboard && S.save.onboard.grantedOnLoad) { queueReveal('zapper', 1, true, S.t + 0.4); S.save.onboard.grantedOnLoad = false; persist(); }
requestAnimationFrame(frame);
