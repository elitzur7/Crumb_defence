// Crumb Defense - app shell: screens, input, rendering of battle & menus.
import * as C from './config.js';
import { Battle, lossHint, hasTargetModes, levelAntTypes, towerStat, upgradeDiff, formatStat, statLabel, cardUpgradeDiff, upgradeGain, worldCardLevelCap } from './sim.js';
import * as Cal from './calendar.js';
import * as M from './meta.js';
import * as A from './art.js';
import { levelHeaderLine } from './uitext.js';
import { initAudio, sfx, setMuted, setAudioSpeed } from './audio.js';
import { STEP, PACE, advanceFrame, newClock, nextSpeed, startSpeed } from './loop.js';
import { smartBotStep } from './bot.js';
import { addFloatText } from './fx.js';
import * as Treat from './treat.js';
import { previewModel, waveGroups, stripRect, isTank, isFlyer, STRIP_H } from './preview.js';

const W = 400, H = 720, MAP_Y = 68, MAP_W = C.GRID_COLS * C.TILE, MAP_H = C.GRID_ROWS * C.TILE, TRAY_Y = MAP_Y + MAP_H + 4;
const BG = '#fbe9dc';
const canvas = document.getElementById('game');
let ctx = canvas.getContext('2d'); // let: the v0.7 pack reveal pre-renders card faces by pointing ctx at an offscreen canvas for a moment
let dpr = 1, scale = 1, offX = 0, offY = 0, pxRatio = 1;

const storage = (() => { try { localStorage.setItem('__t', '1'); localStorage.removeItem('__t'); return localStorage; } catch (e) { const m = {}; return { getItem: (k) => m[k] ?? null, setItem: (k, v) => { m[k] = String(v); } }; } })();
const S = {
  screen: 'map', save: M.loadSave(storage), battle: null, levelIndex: 0, t: 0,
  prep: { deck: [], bonuses: [] }, sel: null, drag: null, info: null, speed: 1, paused: false, result: null,
  toast: null, fx: [], swatQ: [], ui: [], bgCache: {}, cardsSel: null, confirmReset: 0, autoBot: false, shopMsg: null, crumbShake: 0, crumbPulse: 0, crumbBump: 0, chipSparkT: -9, slotFlip: [0, 0, 0], mergeAnim: null, prepAlert: null,
  dialog: null, cal: null, cookieOuch: 0, clockOffset: 0, treat: Treat.newTreatState(),
  // v0.5: map scroll (item 13), per-card screen (items 6/7), NEW CARD reveals (item 7), Move/Swap mode (items 11/12),
  // fireworks (item 16), shop purchase animation (item 8)
  mapScroll: 0, cardView: null, reveal: [], pack: null, mode: null, fireworks: { rockets: [], parts: [], queue: [] }, shopFx: null, shopSel: null, queenDown: null,
};
if (S.save.settings && S.save.settings.muted) setMuted(true);
function persist() { S.skinSrc = null; M.writeSave(storage, S.save); }
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
function setPaused(v) { S.paused = v; if (S.battle) S.battle.paused = v; if (v) { S.sel = null; S.drag = null; S.info = null; S.mode = null; if (S.toast && S.toast.hint) S.toast = null; } }

// ---------------- layout / resize ----------------
// v0.7.2 C16: the meta screens (map, cards, card detail, shop) sit above a fixed bottom tab bar (Map / Cards / Shop). The bar is 56 dp tall plus the
// bottom safe-area inset (env(safe-area-inset-bottom), read through a hidden probe element). Their design height is 660 instead of 720; every other
// screen (prep, battle, results, overlays) keeps W x H = 400 x 720 over the full window.
const META_SCREENS = ['map', 'cards', 'card', 'shop', 'cabinet', 'antbook'], BAR_H = 56, META_H = 660;
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
  } else { const availH = Math.max(100, ch - insetB); scale = Math.min(cw / W, availH / H); offX = (cw - W * scale) / 2; offY = (availH - H * scale) / 2; } // v0.8.1 U8: prep / battle / results keep clear of the bottom gesture inset too (was the full window; no change when the inset is 0)
  const px = Math.max(1, Math.round(dpr * scale * 2) / 2);
  if (px !== pxRatio) { pxRatio = px; S.bgCache = {}; A.clearTowerCache(); } // sprites are baked at the device scale
}
function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 3);
  cw = window.innerWidth; ch = window.innerHeight; insetB = readInset();
  canvas.width = Math.round(cw * dpr); canvas.height = Math.round(ch * dpr);
  canvas.style.width = cw + 'px'; canvas.style.height = ch + 'px';
  applyLayout();
  S.bgCache = {}; S.bdCache = {};
  A.clearTowerCache(); // v0.6.1: tower sprites are baked at the device scale -> rebuild after a DPR / size change
}
window.addEventListener('resize', resize);
// v0.7.3 (review P1): the safe-area inset can change after the first layout (edge-to-edge applied late, rotation, gesture <-> 3-button navigation, WebView
// inset updates). Re-read it about every 500 ms (frame loop, refreshInset) and on orientationchange / visualViewport resize, not only on window resize.
function refreshInset() { if (Math.abs(readInset() - insetB) > 0.5) resize(); }
window.addEventListener('orientationchange', () => { resize(); setTimeout(resize, 350); }); // the size is sometimes stale right at the event
if (window.visualViewport && window.visualViewport.addEventListener) window.visualViewport.addEventListener('resize', resize);
resize();

// ---------------- immediate-mode buttons ----------------
let buttons = [], prevButtons = [];
function button(id, x, y, w, h, onTap, opt = {}) { buttons.push({ id, x, y, w, h, onTap, ...opt }); }
function hit(list, x, y) { for (let i = list.length - 1; i >= 0; i--) { const b = list[i]; if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) return b; } return null; }
function drawButton(x, y, w, h, label, col = '#ffb3c1', opt = {}) {
  // v0.8.0 (spec 6.5): a glossy pill - lip + candy face + gloss strip (baked per size/colour/state), label in chunky 'btn' text. Disabled = grey candy (a different colour, not transparency).
  const press = opt.pressed ? 3 : 0;
  ctx.save();
  if (C.ART81 && !opt.disabled && !opt.noSquash) { // v0.8.2 J18: press squash 0.96 (60 ms) / release spring 1.04 -> 1.0 (110 ms), about the button centre
    const cx = x + w / 2, cy = y + h / 2, inB = (q) => q && q.id !== 'map' && q.w * q.h < 20000 && cx >= q.x && cx <= q.x + q.w && cy >= q.y && cy <= q.y + q.h, now = performance.now();
    const dn = down && !down.moved && inB(down.b), rl = S.relB && inB(S.relB.b) ? now - S.relB.t : null, ps = A.pressScale(!!dn, dn ? now - down.t0 : 0, rl);
    if (ps !== 1 && !reducedMotion()) { ctx.translate(cx, cy); ctx.scale(ps, ps); ctx.translate(-cx, -cy); }
  }
  A.drawPillButton(ctx, x, y, w, h, opt.disabled ? 'dis' : col, { pressed: !!opt.pressed, disabled: !!opt.disabled, r: opt.r ?? Math.min(14, h / 2) });
  if (label) {
    const neutral = !opt.disabled && String(col).toLowerCase() === '#fff3e6'; // v0.8.1 F7: neutral secondary pills carry an INK label (no chunky white)
    if (opt.disabled) { ctx.globalAlpha = 0.6; A.drawChunkyText(ctx, label, x + w / 2, y + h / 2 + press + 1, opt.size || 17, { mode: 'btn' }); } // v0.8.1 F14: disabled = flat ramp + 60% label
    else if (neutral) { ctx.font = `${opt.size || 17}px ${A.FONT_DISPLAY}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = A.INK; ctx.fillText(label, x + w / 2, y + h / 2 + press + 1); }
    else A.drawChunkyText(ctx, label, x + w / 2, y + h / 2 + press + 1, opt.size || 17, { mode: 'btn' });
  }
  ctx.restore();
}
// v0.8.0 (spec 6.4): panels are beveled tiles - lip below, top-lit face, inner highlight, INK outline; opt.gold adds the champagne-gold rim used by reward cards
function panel(x, y, w, h, col = '#fff6ee', r = 18, opt = {}) {
  A.drawBeveledTile(ctx, x, y, w, h, col, { lip: h >= 28 ? 4 : 3, r, lw: 3, hi: 0.55, end: col === '#fff6ee' ? '#fff0e6' : undefined });
  if (opt.gold) { A.rr(ctx, x + 3.5, y + 3.5, w - 7, h - 7, Math.max(4, r - 3)); ctx.lineWidth = 3; ctx.strokeStyle = '#f6c648'; ctx.stroke(); A.rr(ctx, x + 6, y + 6, w - 12, h - 12, Math.max(3, r - 5)); ctx.lineWidth = 1.2; ctx.strokeStyle = 'rgba(255,248,200,0.9)'; ctx.stroke(); }
}
// Notices: in battle a small pill just above the tray (never covers the map centre); elsewhere a compact box.
function toast(msg, col = '#fff') { const small = S.screen === 'battle'; S.toast = { msg, t: small ? C.UI.toastTime : C.UI.menuToastTime, col, small }; }
function needCrumbs(n) { toast(`Need ${n} crumbs`, '#ffd0d0'); S.crumbShake = 0.45; sfx('tap'); }

// ---------------- pointer input ----------------
let down = null;
function toLogical(e) { return { x: (e.clientX - offX) / scale, y: (e.clientY - offY) / scale }; }
canvas.addEventListener('pointerdown', (e) => {
  initAudio(); e.preventDefault();
  if (S.result && S.result.t < 4) S.result.coinSkip = true; // v0.8.1 G4(b): a tap skips the coin fly
  const p = toLogical(e);
  const b = hit(prevButtons, p.x, p.y);
  down = { x: p.x, y: p.y, b, moved: false, t0: performance.now() };
  // v0.5 item 13: the level map scrolls (drag up/down) - world 2 sits above world 1
  if (S.screen === 'map' && !S.cal && !S.reveal.length && !S.pack && p.y >= MAPVIEW.top && p.y <= MAPVIEW.bottom) down.scroll0 = S.mapScroll;
  if (b && b.onDown) b.onDown(p);
});
canvas.addEventListener('pointermove', (e) => {
  if (!down) return; const p = toLogical(e);
  if (Math.hypot(p.x - down.x, p.y - down.y) > 8) down.moved = true;
  if (S.screen === 'battle' && S.battle && !S.drag) { sweepPieces(S.battle, down.lx ?? down.x, down.ly ?? down.y, p.x, p.y); }
  down.lx = p.x; down.ly = p.y;
  if (S.drag) { S.drag.x = p.x; S.drag.y = p.y; S.drag.moved = S.drag.moved || down.moved; }
  if (down.scroll0 != null && down.moved) S.mapScroll = clampScroll(down.scroll0 + (p.y - down.y));
});
canvas.addEventListener('pointerup', (e) => {
  if (!down) return; const p = toLogical(e);
  if (S.drag && S.drag.moved) { dropCard(p); S.drag = null; down = null; return; }
  if (down.scroll0 != null && down.moved) { down = null; return; } // a scroll drag is never a tap
  S.drag = null;
  const b = hit(prevButtons, p.x, p.y);
  if (down.b) S.relB = { b: down.b, t: performance.now() }; // v0.8.2 J18
  if (b && down.b && b.id === down.b.id && b.onTap) { if (b.id !== 'map') haptic('light'); b.onTap(p); } // v0.8.1 J10: a light tick on buttons (not on the battle board itself)
  down = null;
});
canvas.addEventListener('pointercancel', () => { down = null; S.drag = null; });
document.addEventListener('visibilitychange', () => {
  if (document.hidden && S.screen === 'battle' && !S.result) setPaused(true);
  if (!document.hidden) { heartbeat(true); maybeShowCalendar(); }
});

// ---------------- screens ----------------
// v0.7.3: our own history.back() is async; its popstate must not be treated as the user's Back press (it could close a calendar that go('map') just opened).
// v0.7.4 P2: the swallow window is short (400 ms, the echo normally arrives in a few ms), it is cleared by the echo itself and by a timer, so a REAL Back press
// is never eaten for a whole second (v0.7.3 kept the flag for 1 s whenever history.back() had no echo to consume it).
const OWN_BACK_MS = 400;
let ownBackPending = 0, ownBackAt = 0, ownBackTimer = 0;
function ownBack() {
  try {
    ownBackPending++; ownBackAt = performance.now();
    clearTimeout(ownBackTimer); ownBackTimer = setTimeout(() => { ownBackPending = 0; }, OWN_BACK_MS);
    history.back();
  } catch (e) { ownBackPending = 0; }
}
// v0.7.3: the gear panel owns one history entry while it is open (when none exists yet), so Android Back closes the panel instead of exiting the app.
function openSettings() {
  S.settings = { t: 0 }; S.confirmReset = 0; sfx('tap');
  try { if (!(history.state && history.state.inner)) { history.pushState({ inner: 1 }, ''); S.settingsPushed = true; } } catch (e) { /* history unavailable */ }
}
function closeSettings() { S.settings = null; S.confirmReset = 0; if (S.settingsPushed) { S.settingsPushed = false; ownBack(); } }
function go(screen) {
  S.settingsPushed = false; // a leave-the-map navigation reuses the gear panel's history entry (it is the screen's 'inner' entry)
  S.screen = screen; S.guide = null; S.antCard = null; S.starCard = null; S.prepTip = null; S.sel = null; S.info = null; S.drag = null; S.mergeAnim = null; S.toast = null; S.dialog = null; S.cabAsk = null; S.cal = null; S.settings = null; S.mode = null; S.shopFx = null; sfx('tap');
  if (screen === 'map') { S.mapScroll = autoMapScroll(); maybeShowCalendar(); }
  // keep one history entry while away from the map so the Android back button maps to in-game "back"
  try {
    const inner = history.state && history.state.inner;
    if (screen !== 'map' && !inner) history.pushState({ inner: 1 }, '');
    else if (screen === 'map' && inner) ownBack();
  } catch (e) { /* history unavailable */ }
}
window.addEventListener('popstate', () => {
  if (ownBackPending > 0 && performance.now() - ownBackAt < OWN_BACK_MS) { ownBackPending--; if (!ownBackPending) clearTimeout(ownBackTimer); return; } // the echo of our own history.back(): not a user Back press
  ownBackPending = 0; clearTimeout(ownBackTimer);
  if (S.pack) { closePack('ok'); try { history.pushState({ inner: 1 }, ''); } catch (e) {} return; } // v0.7: back closes the pack reveal
  if (S.dialog) { S.dialog = null; try { history.pushState({ inner: 1 }, ''); } catch (e) {} return; }
  if (S.screen === 'map') { if (S.cal) S.cal = null; else if (S.settings) { S.settings = null; S.confirmReset = 0; S.settingsPushed = false; } return; }
  const repush = () => { try { history.pushState({ inner: 1 }, ''); } catch (e) {} };
  if (S.screen === 'battle' && !S.result) { setPaused(!S.paused); repush(); return; }
  if (S.screen === 'card') { S.screen = 'cards'; repush(); return; }
  if (S.screen === 'cabinet') { S.screen = 'shop'; repush(); return; } // v0.8.2 EC5a
  if (S.screen === 'antbook') { if (S.antBookSel) S.antBookSel = null; else S.screen = 'cards'; repush(); return; } // v0.8.2 U15
  S.battle = null; S.screen = 'map'; S.sel = null;
});
function openPrep(i) {
  S.levelIndex = i;
  const unlocked = M.unlockedCards(S.save);
  let deck = (S.save.lastDeck || []).filter((id) => unlocked.includes(id));
  for (const id of unlocked) if (deck.length < C.BATTLE.deckSize && !deck.includes(id)) deck.push(id);
  S.prep.deck = deck.slice(0, C.BATTLE.deckSize);
  // bonuses that ran out since last time are swapped for ones that still have stock (feedback 12)
  S.prep.bonuses = M.autoFixBonuses(S.save, (S.save.lastBonuses || C.BONUS_TYPES.slice(0, 2)).slice(0, C.BATTLE.bonusTypesToBring)).filter((b) => (S.save.bonusStock[b] || 0) > 0); S.zeroHint = null; // v0.8.2 R6: never pre-select a 0-stock booster
  S.prepAlert = null;
  go('prep');
  S.antCard = antCardWanted() ? M.nextAntCard(S.save, i) : null; // v0.8.1 U2 (after go(), which clears it)
}
// v0.8.1 U2: the 'meet the new ant' card opens when the prep screen opens (never mid-battle). Test builds skip it unless the URL has ?antcard=1 (older QA suites drive prep of levels with nurses / glazed ants).
function antCardWanted() { return C.ART81 && (!__TEST_HOOKS__ || /[?&]antcard=1/.test(location.search)); }
function antCardDone() { const t = S.antCard; if (!t) return; if (M.markAntSeen(S.save, t)) persist(); sfx('tap'); S.antCard = M.nextAntCard(S.save, S.levelIndex); }
// v0.8.1 U1: first-battle guide. Only on a save whose onboard.firstBattle is 'pending' (a brand-new save), on level 1. Test builds skip it unless the URL has ?guide=1 (the older QA suites drive fresh saves).
function guideWanted(levelIndex) { return levelIndex === 0 && !M.isReturningPlayer(S.save) && !!(S.save.onboard && typeof S.save.onboard === 'object' && S.save.onboard.firstBattle === 'pending') && (!__TEST_HOOKS__ || /[?&]guide=1/.test(location.search)); }
function guideDone() { S.guide = null; if (S.save.onboard && typeof S.save.onboard === 'object' && S.save.onboard.firstBattle !== 'done') { S.save.onboard.firstBattle = 'done'; persist(); } }
function startBattle(levelIndex = S.levelIndex, deck = S.prep.deck, bonuses = S.prep.bonuses, seed = (Date.now() & 0xffffff)) {
  S.levelIndex = levelIndex;
  S.save.lastDeck = deck.slice(); S.save.lastBonuses = bonuses.slice(); persist();
  S.treat = Treat.newTreatState();
  S.battle = new Battle({ levelIndex, deck, bonusTypes: bonuses, bonusStock: { ...S.save.bonusStock }, cardLevels: M.cardLevels(S.save), seed,
    onBonusUsed: (type) => { M.consumeBonus(S.save, type); persist(); } }); // deducted immediately: Restart/Quit can't refund it
  S.battleStartStock = { ...S.save.bonusStock };
  capsReset(); S.queenIntro = null; S._bubbleShown = false; S.impactT = {}; S.crumbSprites = []; S.sparkles = []; // v0.8.1 J11: maxima since battle start
  S.fx = []; S.swatQ = []; S.ui = []; S.result = null; setPaused(false); S.speed = startSpeed(S.speed, C.UI.speedMaxAtStart); clock.acc = 0; S.sel = null; S.info = null; S.mode = null; S.queenDown = null; S.modeHint = false; S.nurseTip = false; S.battle.rescueScale = S.speed * PACE; // divisor matches the faster sim fill so the rescue window stays 3 s of wall time
  go('battle');
  S.guide = guideWanted(levelIndex) ? { step: 1 } : null; // v0.8.1 U1 (after go(), which clears it)
  S.specialBanner = null; // v0.8.2 U11: the awakening beat - the first W6 battle with a card at CL >= 5: a 2 s banner, once per tower (save.seenSpecial[type]); never on W1-W5 (the special sleeps there)
  if (C.ART81 && S.battle.specialsOn && !S.guide) {
    const seen = S.save.seenSpecial || (S.save.seenSpecial = {}), fresh = deck.filter((id) => C.specialActive(id, S.battle.level, S.battle.cardLevels ? S.battle.cardLevels[id] : 1) && !seen[id]);
    if (fresh.length) { fresh.forEach((id) => { seen[id] = true; }); persist(); S.specialBanner = { ids: fresh, t0: S.t, until: S.t + 2.4 }; }
  }
}
// v0.8.0 result-screen constants: star confetti <= 36 (spec 6.8), the 3-star moment timeline (ms): 0-200 drop, 200-450 shake, 450-600 burst, 600-1500 count-up, 1500 land, 1500-1900 hold, 1900-2250 fly, 2250+ buttons
const CONFETTI_MAX = 36, MOMENT_MS = 2250, MOMENT_T = { drop: 0.2, shake: 0.45, burst: 0.6, countDone: 1.0, count: 1.5, hold: 1.9, fly: 2.25 };
// coin-pile placement on the result screen (recorded in JOB-v0.8.0.md): 78x30 pile (scaled 0.8-1.2), bottom centre (200, 250); the hero treat sits on it at (200, 201) scaled 1.1
const RESULT_PILE = { x: 200, y: 250 }, RESULT_TREAT = { x: 200, y: 201, k: 1.1 };
function localDay() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; } // v0.8.2 EC6
function finishBattle() {
  const b = S.battle; guideDone(); // v0.8.1 U1: the first finished battle always ends the guide
  // bonuses were already deducted from the save at the moment of use
  const out = M.applyBattleResult(S.save, b.levelIndex, b.result, b.stars, { kills: b.stats.kills, foodLeft: b.foodStored, perfect: b.perfect, time: b.time, day: C.ART81 ? localDay() : undefined });
  { const rc = b.upgradeReach(); S.save.debug = S.save.debug || { reach: [] }; S.save.debug.reach.push({ li: b.levelIndex, res: b.result, towers: rc.towers, l1: rc.l1, l2: rc.l2, l3p: rc.l3p, placed: rc.placed, upgrades: rc.upgrades, crumbsPlace: rc.crumbsPlace, crumbsUpgrade: rc.crumbsUpgrade }); if (S.save.debug.reach.length > 20) S.save.debug.reach.shift(); } // v0.8.1 M8
  const lossRun = M.noteLossRun(S.save, b.levelIndex, b.result === 'win'); // v0.8.1 U7: consecutive losses on this level
  if (b.result === 'win' && b.levelIndex === 0 && out.firstClear && C.ART81) M.armNextHint(S.save, 'l1'); // v0.8.1 U9: after the first L1 win the map points at level 2
  if (b.result === 'lose') M.noteLossForCardBlink(S.save); // v0.4 item 17: arms the 'after a loss' Cards blink
  persist();
  const win = b.result === 'win', fullFood = b.foodStored >= b.cfg.foodHP - 1e-6;
  const queenKilled = win && Object.keys(b.stats.byType).some((t) => C.isQueen(t)); // v0.5.1: queen celebration only when the level is won
  const hold = queenKilled ? C.UI.queenCheerHold : 0; // v0.6.2 item 14: the result panel waits for the queen celebration
  S.result = { win, stars: b.stars, out, t: 0, hold, crumbsLeft: b.crumbs, perfect: out.perfect, kills: b.stats.kills, confetti: [], fullFood, queenKilled, hint: C.ART81 && b.result === 'lose' && lossRun >= 2 ? lossHint(b, lossRun) : null };
  // v0.7.10 / v0.8.0: the gold 3-star bonus card moment (first 3 stars only; amount = round(75 x coinMul / 5) x 5) - T0 = 1.00 s after the result starts (1.80 s on a Perfect); the first tap skips it
  { const sp = out.starParts || { s2: 0, s3: 0 };
    if (win && b.stars >= 3 && sp.s3 > 0) S.result.moment = { amount: sp.s3, t0: out.perfect ? C.UI.perfectAnimTime : 1.0, dur: MOMENT_MS / 1000, sfx: 0 };
    if (win && sp.s2 > 0) S.result.chip2 = sp.s2; }
  // v0.5 item 16: 3 stars -> confetti; a full score (100 food = the whole treat) -> confetti + fireworks; queen beaten -> fireworks + text
  if (win && (b.stars >= 3 || fullFood || out.perfect)) for (let i = 0; i < CONFETTI_MAX; i++) S.result.confetti.push({ x: 200 + (Math.random() - 0.5) * 60, y: 230, vx: (Math.random() - 0.5) * 420, vy: -150 - Math.random() * 320, r: Math.random() * 6, c: ['#ff8fab', '#ffd45e', '#8fe388', '#9fd3f2', '#c9b6f2'][i % 5] });
  if (win && fullFood) { if (S.result.moment) S.result.pendingFw = [9, 2.6]; else launchFireworks(9, 2.6); } // v0.8.1 F5: with the 3-star card moment the fireworks wait until the card has flown
  if (queenKilled) { launchFireworks(10, 3); S.queenDown = { t: S.t, world: C.worldOf(b.levelIndex) }; }
  // v0.5 item 7: a won card that is a new type / new level gets the big NEW CARD reveal (after the Perfect celebration)
  if (out.prize && out.prize.kind === 'cards' && out.prize.reveal) queueReveal(out.prize.id, out.prize.level, out.prize.newCard, S.t + hold + C.UI.perfectAnimTime + 0.4 + (S.result.moment ? S.result.moment.dur + 0.1 : 0));
  if (out.bossGift && out.bossGift.reveal) queueReveal(out.bossGift.id, out.bossGift.level, out.bossGift.newCard, S.t + hold + C.UI.perfectAnimTime + (out.prize && out.prize.reveal ? 2.4 : 0.4) + (S.result.moment ? S.result.moment.dur + 0.1 : 0)); // v0.7.7 S1: the boss gift reveal (after the Perfect prize one, if any)
  sfx(win ? 'win' : 'lose'); if (!win) haptic('heavy'); else if (b.stars >= 3) haptic('medium'); // v0.8.1 J10: defeat = heavy, a 3-star win = medium
  if (win && out.perfect && C.ART81) setTimeout(() => sfx('perfect'), 500);
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
// v0.7.4 M2 (flag rescue.on): a tap within `radius` of a dropped crumb collects it. The tap then goes on as usual (an empty tile still gets selected), except while a card
// or booster is held: that tap only collects (a rescue must never place a tower or drop a bomb by accident). A card DRAG released near a crumb still places the tower (dropCard).
function tryCollectAt(b, t) {
  if (!b.cfg.rescue.on || !b.pieces.length) return false;
  const q = b.pieceAt(t.x, t.y); return !!(q && b.collectPiece(q.id));
}
function sweepPieces(b, x0, y0, x1, y1) { // drag-sweep: pieces within 24 px of the finger's path
  if (!b.cfg.rescue.on || !b.pieces.length || b.result || S.paused) return;
  for (const q of b.pieces.slice()) {
    const qx = q.x, qy = q.y + MAP_Y, dx = x1 - x0, dy = y1 - y0, L2 = dx * dx + dy * dy;
    const k = L2 > 0 ? Math.max(0, Math.min(1, ((qx - x0) * dx + (qy - y0) * dy) / L2)) : 0;
    if (Math.hypot(qx - (x0 + dx * k), qy - (y0 + dy * k)) <= C.UI.rescueSweepRadius) b.collectPiece(q.id);
  }
}
function mapTap(p) {
  const b = S.battle; const t = tileAt(p); if (!t || b.result || S.paused) return;
  const got = tryCollectAt(b, t);
  if (got && S.sel) return;
  if (S.mode) { modeTap(b, t); return; }
  if (S.sel && S.sel.kind === 'card') { tryPlay(S.sel.i, t.c, t.r); return; }
  if (S.sel && S.sel.kind === 'bonus') {
    if (b.useBonus(S.sel.type, t.x, t.y)) sfx(S.sel.type === 'bomb' ? 'boom' : 'tap');
    S.sel = null; return;
  }
  const tw = b.towers.find((q) => q.c === t.c && q.r === t.r);
  // tapping the same tower while its upgrade panel is showing keeps it open (no auto-close); otherwise toggle normally
  if (tw && S.info && S.info.tower === tw && S.info.auto) { S.info.auto = false; S.info.changed = null; return; }
  // v0.7.5 (review Q4): the v0.7.4 'tap an open panel to cycle the target mode' gesture is REMOVED (a hidden gesture that fired by accident); the panel's chips select directly
  S.info = tw ? { tower: tw, t: 0 } : null;
}
// v0.7.4 M1: a one-time tip (per battle, never while paused) the first time a tank (Armoured / Big / Heavy / Queen) steals food, if a tower could change its target
const W6_STORY = 'Drones fly in. Bring a tower that hits flyers.'; // v0.8.2 PP8: the world-6 map story line (<= 60 chars)
const W5_STORY = 'Glaze grows back: hit hard, hit fast!'; // v0.8.1 W9: the world-5 map story line (<= 60 chars)
const TREAT_NAME = { cookie: 'Cookie', cake: 'Cake', pie: 'Pie', sundae: 'Sundae', donut: 'Donut', pancake: 'Pancakes', tart: 'Tart' };
const HINT_ANTS = new Set(['armored', 'big', 'heavy', 'queen', 'queen2', 'greasy', 'mama', 'queen3', 'nurse', 'queen4', 'glazed', 'queen5', 'drone', 'queen6', 'shieldbearer', 'queen7']);
function maybeModeHint(b, e) {
  if (S.modeHint || S.paused || !e.ant || !HINT_ANTS.has(e.ant) || !(e.n > 0)) return;
  if (!b.towers.some((q) => hasTargetModes(q.type))) return;
  S.modeHint = true; toast('Tip: tap a tower, then pick who it shoots', '#ffe39a'); S.toast.hint = true;
}
const MODE_NAME = { weak: 'Weakest', carrier: 'Carrier', healer: 'Healer', strong: 'Heavy' }; // v0.8.1 M3: Front retired; M1 Healer; M2 Heavy (boss levels)
const MODE_HELP = { weak: 'fewest HP first', carrier: 'ants carrying food first', healer: 'healers and escorts first', strong: 'the toughest ant first' };
function modeFeedback(tw, m) { sfx('tap'); tw._modeAt = S.t; // v0.7.5: the active chip / badge pops for 120 ms
  addFloatText(S.fx, { key: 'mode' + tw.id, x: tw.x, y: tw.y - 26, n: 1, fmt: () => MODE_NAME[m], col: m === 'weak' ? '#fff' : '#ffe39a', life: 1.0 }); }
function setMode(tw, m) { if (tw.mode === m) return; if (S.battle.setTargetMode(tw, m)) modeFeedback(tw, m); }

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
function addFx(f) {
  if (C.ART81 && (f.k === 'spark' || f.k === 'star')) { let n = 0; for (let i = 0; i < S.fx.length; i++) { const q = S.fx[i]; if (q.k === 'spark' || q.k === 'star') n++; } if (n >= 24) { for (let i = 0; i < S.fx.length; i++) { const q = S.fx[i]; if (q.k === 'spark' || q.k === 'star') { S.fx.splice(i, 1); break; } } } } // v0.8.1 G5: <= 24 sparkles alive (oldest dropped)
  S.fx.push(f); const cap = S.speed >= 4 ? 220 : 300;
  if (S.fx.length > cap) { // v0.7.6 V4: when full, drop the oldest sparks first (up to 60), then the oldest effects of any kind (ko included)
    let n = 0, j = 0; for (let i = 0; i < S.fx.length; i++) { const q = S.fx[i]; if (q.k === 'spark' && n < 60) { n++; continue; } S.fx[j++] = q; } S.fx.length = j;
    if (S.fx.length > cap) S.fx.splice(0, 60);
  }
} // v0.7.4 M0: a lower cap at 4x keeps S.fx well under 300 with 54 ants
function addUi(f) { S.ui.push(f); if (S.ui.length > 60) S.ui.splice(0, 20); }
const fmtFood = (n) => (Math.abs(n - Math.round(n)) < 0.05 ? String(Math.round(n)) : n.toFixed(1));
// v0.7.3 C13: swatter visuals run on the BATTLE clock (b.time), so they follow pause and 2x speed. The sim applies the damage when the swing starts; the slap
// is drawn SWAT_HIT s later. The kill effects (ko, puffs, crumbs, pop), the spark, the ring and the thwap are queued for that frame; until then the
// dead ant is drawn as a ghost at its spot, so the swatter lands on the ant instead of on empty ground.
const SWAT_HIT = 0.17;
function swatHitTime(b) { return b.time - (0.5 - b.swatFx) + SWAT_HIT; }
// v0.8.1 G4: crumbs fly from the kill to the HUD chip (visual only - the counter itself never waits). <= 12 alive (<= 6 at 4x), kills within 100 ms merge (x1.3);
// reduced motion: no sprites, just the chip bump. Trail sparkles (<= 2 per crumb) are drawn statelessly along the curve and skipped at 4x.
const CHIP = { x: 341, y: 33 };
function crumbUp(e) {
  if (!C.ART81 || !(e.crumbs > 0) || S.screen !== 'battle') return;
  if (reducedMotion()) { S.crumbBump = 0.12; sfx('coinTick'); return; }
  const fast = S.speed >= 4, list = S.crumbSprites || (S.crumbSprites = []), life = fast ? 0.35 : 0.55;
  const last = list[list.length - 1];
  if (last && S.t - last.t0 < 0.1) { last.sc = 1.3; return; }
  if (list.length >= (fast ? 6 : 12)) { S.crumbBump = Math.max(S.crumbBump || 0, 0.12); return; }
  list.push({ x0: e.x, y0: e.y + MAP_Y - 10, t0: S.t, life, sc: 1 });
}
function drawCrumbUp() {
  const list = S.crumbSprites; if (!list || !list.length) return;
  const fast = S.speed >= 4;
  for (let i = list.length - 1; i >= 0; i--) {
    const q = list[i], p = (S.t - q.t0) / q.life;
    if (p >= 1 || p < 0) { list.splice(i, 1); S.crumbBump = 0.12; if (S.t - (S.chipSparkT || -9) > 0.15) { S.chipSparkT = S.t; } sfx('coinTick'); continue; }
    const u = p * p, cx = q.x0 + (CHIP.x - q.x0) * 0.25, cy = Math.min(q.y0, 70) - 46, v = 1 - u;
    const pt = (uu) => { const w = 1 - uu; return [w * w * q.x0 + 2 * w * uu * cx + uu * uu * CHIP.x, w * w * q.y0 + 2 * w * uu * cy + uu * uu * CHIP.y]; };
    if (!fast) for (let j = 1; j <= 2; j++) { const [tx, ty] = pt(Math.max(0, u - j * 0.1)); ctx.save(); ctx.globalAlpha = 0.7 - j * 0.2; A.sparkleAt(ctx, tx, ty, 3 - j * 0.6, j === 1 ? '#fff' : '#ffe27a', 0.4); ctx.restore(); }
    const [x, y] = pt(u); ctx.save(); ctx.globalAlpha = Math.min(1, 1.4 - p * 0.4); A.crumbIcon(ctx, x, y, 1.2 * (1 - 0.2 * p) * q.sc); ctx.restore();
  }
}
// v0.8.1 J1: the 8 per-tower impact bursts (<= 3 particles per shot, 1 at 4x; the repeat-heavy ones reuse a 120 ms throttle at 4x). Reduced motion: a 1-frame tint, no particles.
// colours come from the tower's own base colour (C.TOWERS[..].color) and white - no new palette
function towerImpact(tp, x, y, shape, opt = {}) {
  if (!C.ART81) return;
  const fast = S.speed >= 4, tk = S.impactT || (S.impactT = {});
  if (fast && S.t - (tk[tp] || -9) < 0.12) return; tk[tp] = S.t;
  const col = C.TOWERS[tp] ? C.TOWERS[tp].color : '#ffffff';
  if (reducedMotion()) { addFx({ k: 'impact', shape: 'tint', col, x, y, life: 0.034, max: 0.034 }); return; }
  addFx({ k: 'impact', shape, col, x, y, life: opt.life || 0.18, max: opt.life || 0.18, fast });
}
// v0.8.1 J2: death variety by body class (added particles <= 5 per death, <= 3 at 4x; the base death - ko + puffs - stays). Reduced motion: no extras.
const SHARD_COL = { armored: '#b8c3d4', gasmask: '#a9c9a0', glazed: '#ffa6dc', small_gasmask: '#a9c9a0', small_armed: '#b8c3d4', sprinter: '#b8c3d4', queen5: '#ffa6dc', drone: '#f3c98b', queen6: '#e8a33d' };
function deathExtras(e) {
  if (!C.ART81 || reducedMotion()) return;
  const D0 = C.ANTS[e.ant];
  if (e.ant === 'queen5') { // v0.8.1 W8 / M5: the Glaze Queen's own death - an icing splash and sprinkle confetti (1 splash + 3 puffs + up to 24 sprinkles + 1 sparkle = at most 29 pieces, half at 4x; the 36-piece cap holds)
    const fast = S.speed >= 4, n = fast ? 12 : 24, cols = ['#ffe27a', '#8fd0f7', '#ffffff', '#a8e6a1', '#ff6f91', '#f7b6c8'];
    addFx({ k: 'icing', x: e.x, y: e.y - 4, life: 0.7, max: 0.7 });
    for (let i = 0; i < 3; i++) addFx({ k: 'puff', x: e.x + (i - 1) * 14, y: e.y - 8, vx: (i - 1) * 26, vy: -16, r: 12 + i * 3, life: 0.6, max: 0.6, col: '#f7b6c8' });
    for (let i = 0; i < n; i++) { const a = -Math.PI * (0.1 + 0.8 * Math.random()), v = 70 + Math.random() * 110; addFx({ k: 'sprk', x: e.x, y: e.y - 20, vx: Math.cos(a) * v, vy: Math.sin(a) * v, rot: Math.random() * 6, col: cols[i % cols.length], life: 0.9, max: 0.9 }); }
    addFx({ k: 'spark', big: true, x: e.x, y: e.y - 34, life: 0.7, max: 0.7, col: '#f7b6c8' }); return;
  }
  if (D0 && D0.boss) { for (let i = 0; i < 2; i++) addFx({ k: 'puff', x: e.x + (i - 0.5) * 16, y: e.y - 6, vx: (i - 0.5) * 30, vy: -14, r: 15 + i * 6, life: 0.7, max: 0.7 }); addFx({ k: 'spark', big: true, x: e.x, y: e.y - 34, life: 0.7, max: 0.7, col: '#ffd23f' }); return; } // v0.8.1 J9: queen death = a big puff x2 + a crown sparkle
  const D = D0; if (!D) return; const fast = S.speed >= 4, y = e.y - 4;
  if (D.flying) return; // flyers: the ko spin-and-fall wobble (see 'ko')
  if (D.heal) { addFx({ k: 'healCross', x: e.x, y: e.y - 10, life: 0.5, max: 0.5 }); return; }
  if (D.sizeClass === 'large') { addFx({ k: 'puff', x: e.x, y, vx: 0, vy: -10, r: 4.2 * 1.4 + 3, life: 0.5, max: 0.5 }); for (let i = 0; i < (fast ? 2 : 4); i++) addFx({ k: 'puff', x: e.x + (i - 1.5) * 9, y: e.y + 2, vx: (i - 1.5) * 24, vy: -6, r: 3, life: 0.45, max: 0.45 }); return; }
  if (D.shield || SHARD_COL[e.ant] || (D.armor && D.sizeClass !== 'small')) { for (let i = 0; i < (fast ? 2 : 3); i++) addFx({ k: 'shard', col: SHARD_COL[e.ant] || '#b8c3d4', x: e.x, y: y - 2, vx: (i - 1) * 55 + (Math.random() - 0.5) * 20, vy: -45 - Math.random() * 40, life: 0.5, max: 0.5 }); return; }
  addFx({ k: 'spark', x: e.x, y: y - 4, life: 0.3, max: 0.3, col: '#fff7a8' });
}
function killFx(e) {
  crumbUp(e); deathExtras(e); if (C.ANTS[e.ant] && C.ANTS[e.ant].boss) haptic('medium'); // v0.8.1 J10: a queen kill
  if (e.src === 'tractor') { if (e.crumbs > 0) addFloatText(S.fx, { k: 'crumbTxt', key: 'crumb', x: e.x, y: e.y - 14, n: e.crumbs, fmt: (n) => n, life: 0.9 }); return; } // the scoop event animates the throw
  const fast = S.speed >= 4; // v0.7.4 M0: at 4x fewer cosmetic bits per kill (the S.fx list stays small with 54 ants)
  for (let i = 0; i < (fast ? 1 : 4); i++) addFx({ k: 'crumbBit', x: e.x, y: e.y - 6, vx: (Math.random() - 0.5) * 90, vy: -40 - Math.random() * 60, life: 0.6, max: 0.6 });
  addFx({ k: 'ko', x: e.x, y: e.y, ant: e.ant, fall: !!(C.ART81 && C.ANTS[e.ant] && C.ANTS[e.ant].flying), life: 0.32, max: 0.32, face: Math.random() < 0.5 ? 1 : -1 });
  for (let i = 0; i < (fast ? 2 : 5); i++) addFx({ k: 'puff', x: e.x + (Math.random() - 0.5) * 10, y: e.y + (Math.random() - 0.5) * 6, vx: (Math.random() - 0.5) * 40, vy: -Math.random() * 30, r: 4 + Math.random() * 4, life: 0.5, max: 0.5 });
  if (e.crumbs > 0) addFloatText(S.fx, { k: 'crumbTxt', key: 'crumb', x: e.x, y: e.y - 14, n: e.crumbs, fmt: (n) => n, life: 0.9 }); // v0.7.7: a Brood Ant's babies pay nothing, so no '+0'
  sfx('pop');
}
function swatHitFx(e) {
  addFx({ k: 'spark', x: e.x, y: e.y - 4, life: 0.2, max: 0.2, col: '#fff7b0' });
  addFx({ k: 'ring2', x: e.x, y: e.y - 2, life: 0.3, max: 0.3 });
  sfx('swat');
}
function flushSwat(force) {
  if (!S.swatQ.length) return;
  const b = S.battle, keep = [];
  for (const q of S.swatQ) {
    if (!(force || b.time >= q.at)) { keep.push(q); continue; }
    if (q.kill) killFx(q.kill);
    if (q.swat) swatHitFx(q.swat);
  }
  S.swatQ = keep;
}
// v0.8.3 M7h: ability cues. Ricochet = a 90 ms arc, Burn-through = a 120 ms crack flash, Crescendo = a thicker gold ring, Pounce = a "!" pop + hit star. <= 12 cue effects alive (J11 caps), <= 6 added per frame; reduced motion = a one-frame tint flash only.
let spCueN = 0;
function spCue(e) {
  if (spCueN >= 6) return; let alive = 0; for (let i = 0; i < S.fx.length; i++) if (S.fx[i].k === 'spArc' || S.fx[i].k === 'spCrack' || S.fx[i].k === 'spGold') alive++; if (alive >= 12) return; spCueN++;
  if (reducedMotion()) { addFx({ k: 'impact', shape: 'tint', col: e.sp === 'crescendo' ? '#ffd24a' : '#fff2b8', x: e.x, y: e.y, life: 0.05, max: 0.05 }); return; }
  switch (e.sp) {
    case 'ricochet': addFx({ k: 'spArc', x: e.x, y: e.y, tx: e.tx, ty: e.ty, life: 0.09, max: 0.09 }); break;
    case 'burnthrough': addFx({ k: 'spCrack', x: e.x, y: e.y, life: 0.12, max: 0.12 }); break;
    case 'crescendo': addFx({ k: 'spGold', x: e.x, y: e.y, r: 52, life: 0.4, max: 0.4 }); break;
    case 'pounce': addFx({ k: 'txt', s: '!', x: e.x, y: e.y - 6, size: 14, col: '#fff2b8', life: 0.5, max: 0.5 }); addFx({ k: 'impact', shape: 'spoke3', col: '#fff4c8', x: e.x, y: e.y, life: 0.2, max: 0.2 }); break;
    case 'static': addFx({ k: 'spArc', x: e.x, y: e.y, tx: e.tx, ty: e.ty, life: 0.1, max: 0.1, bright: 1 }); break;
  }
}
function consumeEvents() {
  const b = S.battle; const ev = b.events; b.events = []; spCueN = 0;
  for (const e of ev) {
    switch (e.type) {
      case 'special': if (C.ART81) spCue(e); break;
      case 'clang': if (C.ART81 && e.armor > 0) addFx({ k: 'spark', x: e.x, y: e.y - 6, col: '#d7e2ee', life: 0.12, max: 0.12 }); break;
      case 'kill':
        if (e.src === 'swatter' && !reducedMotion() && b.swatFx > 0) { // v0.7.3: a swatter kill shows on the slap frame (ant ghost stays until then)
          S.swatQ.push({ at: swatHitTime(b), kill: e, ghost: e.ref, x: e.x, y: e.y }); break;
        }
        killFx(e); break;

      case 'beam': addFx({ k: 'beam', ...e, life: 0.09, max: 0.09 }); towerImpact('laser', e.tx, e.ty - 4, 'sparkle', { life: 0.14 }); sfx('laser'); break;
      case 'zap': addFx({ k: 'zap', ...e, life: 0.14, max: 0.14 }); towerImpact('zapper', e.tx, e.ty - 6, 'sparks2', { life: 0.16 }); sfx('zap'); break;
      case 'roast': towerImpact('lava', e.x, e.y - 6, 'bubbles', { life: 0.3 }); for (let i = 0; i < 5; i++) addFx({ k: 'ember', x: e.x + (Math.random() - 0.5) * 14, y: e.y - 4, vx: (Math.random() - 0.5) * 20, vy: -30 - Math.random() * 30, life: 0.7, max: 0.7 }); break; // v0.4 item 7
      case 'tongue': addFx({ k: 'tongue', ...e, life: 0.25, max: 0.25 }); towerImpact('lizard', e.tx, e.ty - 6, 'spoke3', { life: 0.16 }); break;
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
      case 'spray': addFx({ k: 'mist', ...e, life: 0.3, max: 0.3 }); towerImpact('spray', e.tx, e.ty - 4, 'ring', { life: 0.18 }); break;
      case 'swat': { // v0.7.2 C13: the swatter's slap lands 0.17 s into its 0.5 s swing: spark + hit flash on the ant, a soft thwap (v0.7.3: queued on the battle clock)
        if (reducedMotion()) swatHitFx(e); else S.swatQ.push({ at: swatHitTime(b), swat: e });
        break;
      }
      case 'hit': if (C.ART81 && e.src === 'slingshot') towerImpact('slingshot', e.x, e.y - 6, 'spoke3', { life: 0.15 }); else addFx({ k: 'spark', x: e.x, y: e.y - 6, life: 0.15, max: 0.15 }); break;
      case 'gateZap': addFx({ k: 'spark', x: e.x, y: e.y - 14, life: 0.18, max: 0.18, col: '#fff27a' }); break;
      case 'pieceDrop': {
        if (!S.rescueHintSeen && !S.paused) { S.rescueHintSeen = true; toast('Tap the crumb to bring it home!', '#ffe39a'); S.toast.hint = true; }
        sfx('tap'); break;
      }
      case 'pieceCollect': {
        const cp = b.path.pts[b.path.pts.length - 1];
        addFx({ k: 'crumbFly', x0: e.x, y0: e.y, x1: cp.x, y1: cp.y, life: 0.35, max: 0.35 });
        addFloatText(S.fx, { key: 'rescue' + e.id, x: e.x, y: e.y - 20, n: e.n, fmt: (n) => `+${fmtFood(n)}`, col: '#4fc25a', life: 0.9 });
        for (let i = 0; i < 4; i++) addFx({ k: 'star', ci: i, x: e.x, y: e.y, vx: (Math.random() - 0.5) * 120, vy: -30 - Math.random() * 70, life: 0.45, max: 0.45 });
        sfx('return'); break;
      }
      case 'pieceExpire': for (let i = 0; i < 3; i++) addFx({ k: 'puff', x: e.x + (Math.random() - 0.5) * 8, y: e.y, vx: (Math.random() - 0.5) * 30, vy: -Math.random() * 20, r: 3 + Math.random() * 3, life: 0.4, max: 0.4 }); break;
      case 'steal': maybeModeHint(b, e);
        S.cookieOuch = S.t + C.UI.ouchTime; Treat.onBite(S.treat, S.t, e.n || 1); // v0.4 item 18: animated bite reaction
        if (e.n) addFloatText(S.fx, { key: 'steal', x: e.x, y: e.y - 20, n: e.n, fmt: (n) => `-${fmtFood(n)}`, col: '#ff7a7a', life: 1 }); sfx('steal'); break;
      case 'foodReturn': addFloatText(S.fx, { key: 'food', x: e.x, y: e.y - 18, n: e.n, fmt: (n) => `+${fmtFood(n)} food back!`, col: '#8fe388', life: 1.1 }); sfx('return'); break;
      case 'place': case 'upgrade': {
        if (C.ART81 && e.type === 'place' && !reducedMotion()) addFx({ k: 'ring', x: e.x, y: e.y + 14, r: 28, col: A.TOWER_PAD[e.card] || '#ffd45e', life: 0.3, max: 0.3 }); // v0.8.2 J13: the pad ring flashes once (4 dust + 1 ring + the existing sparkles stay under the fx cap)
        if (e.type === 'place' && !reducedMotion()) for (let i = 0; i < (S.speed >= 4 ? 2 : 4); i++) addFx({ k: 'dust', x: e.x + (Math.random() - 0.5) * 26, y: e.y + 9 + (Math.random() - 0.5) * 6, life: 0.45, max: 0.45 }); // v0.8.0: placement dust (<= 6 particles)
        // purchase feedback: the card flies from its tray slot to the tile, the price flies out of the crumb counter
        const delay = e.pick != null ? 0.28 : 0;
        if (e.pick != null) {
          const sx = 12 + e.pick * 94 + 44, sy = TRAY_Y + 6 + 47;
          addUi({ k: 'cardFly', card: e.card, x0: sx, y0: sy, x1: e.x, y1: e.y + MAP_Y, life: delay, max: delay });
          S.slotFlip[e.pick] = 0.3;
        }
        if (e.cost > 0) addUi({ k: 'costFly', n: e.cost, x0: 340, y0: 34, x1: 300, y1: 96, life: 1.0, max: 1.0 }); // big '-N' drops out of the crumb counter
        S.crumbPulse = 0.35;
        { const nS = C.ART81 ? (S.speed >= 4 ? 5 : 10) : 14; for (let i = 0; i < nS; i++) { const a = i / nS * Math.PI * 2; addFx({ k: 'star', ci: i, x: e.x, y: e.y, vx: Math.cos(a) * 75, vy: Math.sin(a) * 75 - 25, life: 0.7 + delay, max: 0.7, wait: delay }); } } // v0.8.1 G5: 14 -> 10 sparkles at 1x, 5 at 4x
        addFx({ k: 'pop', x: e.x, y: e.y, life: 0.35 + delay, max: 0.35, wait: delay });
        addFx({ k: 'ring2', x: e.x, y: e.y, life: 0.5 + delay, max: 0.5, wait: delay });
        if (e.type === 'upgrade') {
          if (C.ART81 && !reducedMotion()) { const ut = b.towers.find((q) => q.id === e.id); if (ut) ut._upAt = S.t + delay; addFx({ k: 'ring', x: e.x, y: e.y + 14, r: 30, col: A.TOWER_PAD[ut ? ut.type : 'slingshot'] || '#ffd45e', life: 0.4 + delay + 0.22, max: 0.4, wait: delay + 0.22 }); } // v0.8.1 J6: hop 6 px, land with a ring in the pad colour
          addFx({ k: 'pillar', x: e.x, y: e.y, life: 0.9 + delay, max: 0.9, wait: delay });
          addFx({ k: 'txt', x: e.x, y: e.y - 34, s: `Level ${e.lvl}!${dmgGainText(e.card, e.lvl, S.battle.cardLevels[e.card] || 1) ? '  ' + dmgGainText(e.card, e.lvl, S.battle.cardLevels[e.card] || 1) : ''}`, col: '#ffe36e', life: 1.4 + delay, max: 1.4, wait: delay, size: 17 });
          (e.diff || []).forEach((d, k) => addFx({ k: 'txt', x: e.x, y: e.y - 52 - k * 16, s: `${d.label} ${formatStat(e.card, d.key, d.from)} \u2192 ${formatStat(e.card, d.key, d.to)}`, col: '#a8ffb0', life: 2 + delay, max: 2, wait: delay, size: 12 }));
          const tw = S.battle.towers.find((q) => q.id === e.id);
          if (tw && !S.autoBot) { const mine = !!(S.info && S.info.tower === tw && !S.info.auto); S.info = { tower: tw, t: 0, changed: e.diff, until: S.t + C.UI.upgradeInfoTime, auto: !mine }; } // B9: auto-closes unless the player had opened it
          sfx('upgrade');
        } else {
          addFloatText(S.fx, { key: 'placed', x: e.x, y: e.y - 34, n: 1, fmt: () => 'Placed!', col: '#fff', life: 0.9 });
          if (!reducedMotion() && S.speed < 4) for (let i = 0; i < 3; i++) addFx({ k: 'puff', x: e.x + (i - 1) * 12, y: e.y + 12, vx: (i - 1) * 26, vy: -8 - Math.random() * 8, r: 3 + Math.random() * 2, life: 0.35 + delay, max: 0.35, wait: delay }); // v0.7.5 juice: 3 dust puffs
        }
        break;
      }
      case 'stick': towerImpact('glue', e.x, e.y + 4, 'splat', { life: 0.25 }); addFloatText(S.fx, { key: 'stick', x: e.x, y: e.y - 20, n: 1, fmt: () => 'stuck!', col: '#fff3b0', life: 0.7 }); break;
      case 'charm': if (e.tx !== undefined) towerImpact('pheromone', e.tx, e.ty - 22, 'heart', { life: 0.5 }); for (let i = 0; i < 2; i++) addFx({ k: 'heart', x: e.x + (i - 0.5) * 8, y: e.y - 18, life: 0.9, max: 0.9 }); break;
      case 'squash': addFx({ k: 'spark', x: e.x, y: e.y - 4, life: 0.2, max: 0.2, col: '#bfe6ff' }); break;
      case 'marbleBreak': for (let i = 0; i < 7; i++) addFx({ k: 'shard', x: e.x, y: e.y - 6, vx: (Math.random() - 0.5) * 110, vy: -30 - Math.random() * 70, life: 0.55, max: 0.55 }); break; // v0.5 item 2: breaks at the wall/turn
      case 'move': addFx({ k: 'pop', x: e.x, y: e.y, life: 0.35, max: 0.35 }); addFx({ k: 'ring2', x: e.x, y: e.y, life: 0.5, max: 0.5 }); addFloatText(S.fx, { key: 'placed', x: e.x, y: e.y - 34, n: 1, fmt: () => 'Moved!', col: '#fff', life: 0.9 }); break;
      case 'swap': for (const [x, y] of [[e.ax, e.ay], [e.bx, e.by]]) { addFx({ k: 'pop', x, y, life: 0.35, max: 0.35 }); addFx({ k: 'ring2', x, y, life: 0.5, max: 0.5 }); } addFloatText(S.fx, { key: 'placed', x: e.ax, y: e.ay - 34, n: 1, fmt: () => 'Swapped!', col: '#fff', life: 0.9 }); break;
      case 'roll': addFx({ k: 'pop', x: e.x, y: e.y - 12, life: 0.2, max: 0.2 }); sfx('gust'); break;
      case 'bomb': addFx({ k: 'boom', x: e.x, y: e.y, r: e.r, life: 0.7, max: 0.7 }); sfx('boom'); break;
      case 'freeze': addFx({ k: 'flash', col: 'rgba(190,235,255,0.7)', life: 0.4, max: 0.4 }); sfx('freeze'); break;
      case 'plane': sfx('plane'); break;
      case 'wave': { // v0.8.1 J4: a pill banner (slides in 180 ms, holds 700, fades 200); the final wave = a gold pill + sparkles + the wave tone twice; "Queen!" on a boss level's last wave
        const lastW = e.n >= b.totalWaves, queen = lastW && C.isBossLevel(b.levelIndex);
        if (C.ART81) addFx({ k: 'banner', pill: true, last: lastW, s: queen ? 'Queen!' : lastW ? `Final wave ${e.n}/${b.totalWaves}` : `Wave ${e.n}/${b.totalWaves}`, life: 1.08, max: 1.08 });
        else addFx({ k: 'banner', s: `Wave ${e.n}`, life: 1.4, max: 1.4 });
        sfx('wave'); if (lastW && C.ART81) setTimeout(() => sfx('wave'), 380);
        if (C.ART81 && b.levelIndex >= 50 && b.levelIndex <= 59 && e.n === 2 && C.W6_TIPS[b.levelIndex] && M.markAntSeen(S.save, 'tip:w6-' + (b.levelIndex + 1))) { persist(); toast(C.W6_TIPS[b.levelIndex], '#ffe39a'); S.toast.hint = true; }
        if (C.ART81 && b.levelIndex >= 60 && b.levelIndex <= 69 && e.n === 2 && C.W7_TIPS[b.levelIndex] && M.markAntSeen(S.save, 'tip:w7-' + (b.levelIndex + 1))) { persist(); toast(C.W7_TIPS[b.levelIndex], '#f3d0f6'); S.toast.hint = true; }
        if (C.ART81 && b.levelIndex === 41 && e.n === 2 && M.markAntSeen(S.save, 'tip:glazed42')) { persist(); toast(C.L42_TIP, '#ffe39a'); S.toast.hint = true; } // v0.8.1 W9: the first Glazed wave of L42 - one tip, once per save (save.seenAnts)
        if (b.levelIndex === 31 && e.n === 2 && !S.nurseTip) { S.nurseTip = true; toast('Nurse ants heal their friends. Pop them first!', '#ffe39a'); S.toast.hint = true; } // v0.7.9: the first nurse arrives in wave 2 of level 32
        break;
      }
      case 'shieldBreak': { // v0.8.1 U4: the dome shatters = 3 ice shards + 3 sparkles (shards only at 4x speed); reduced motion: one still ring, no flying pieces
        const rm = reducedMotion(), fast = S.speed >= 4;
        if (rm) addFx({ k: 'shieldPop', x: e.x, y: e.y - 8, life: 0.3, max: 0.3 });
        else for (let i = 0; i < (fast ? 3 : 6); i++) { const an = -Math.PI / 2 + (i - 2.5) * 0.7 + (i % 3) * 0.1; addFx(i < 3 ? { k: 'iceShard', x: e.x, y: e.y - 10, vx: Math.cos(an) * (60 + 20 * i), vy: Math.sin(an) * (70 + 15 * i), rot: i * 2.1, life: 0.5, max: 0.5 } : { k: 'puff', x: e.x + (i - 4) * 6, y: e.y - 14, vx: (i - 4) * 18, vy: -22, r: 1.6, life: 0.3, max: 0.3 }); }
        if (S.t - (S.lastShieldSfx || -9) > 0.08) { S.lastShieldSfx = S.t; sfx('shield'); }
        break;
      }
      case 'shieldFull': { // v0.8.1 U4: back to full -> one soft pulse (flash on the dome) + a single quiet 'shieldUp'
        const o = b.ants.find((q) => q.id === e.id); if (o) o._shieldFlash = S.t + 0.25;
        if (S.t - (S.lastShieldUpSfx || -9) > 0.25) { S.lastShieldUpSfx = S.t; sfx('shieldUp'); }
        break;
      }
      case 'heal': { // v0.7.9 Nurse Ant pulse: an expanding ring over her radius + a rising plus on each healed ant (max 6 per pulse) + a white flash on them. Reduced motion: no expansion / rise, a still ring and plus.
        const fast = S.speed >= 4, rm = reducedMotion();
        addFx({ k: 'healRing', x: e.x, y: e.y, r: e.r, life: rm ? 0.35 : 0.5, max: rm ? 0.35 : 0.5 });
        let shown = 0;
        for (const id of e.ids || []) {
          const o = b.ants.find((q) => q.id === id); if (!o) continue;
          o._healFlash = S.t + 0.28;
          if (shown < 6 && !(fast && shown >= 2)) { shown++; addFx({ k: 'healPlus', x: o.x + (shown % 2 ? -5 : 5), y: o.y - 22 * (o.size || 1), life: rm ? 0.6 : 0.8, max: rm ? 0.6 : 0.8 }); }
        }
        sfx('heal'); break;
      }
      case 'queenCall': addFloatText(S.fx, { key: 'queen', x: e.x, y: e.y - 40, n: 1, fmt: () => (e.calls === 'flyer' ? 'Wings, go!' : e.calls === 'greasy' ? 'Butter up!' : e.calls === 'nurse' ? 'Nurses, go!' : 'Scouts, go!'), col: '#ffb3e0', life: 1 }); break;
      case 'split': { // v0.7.7 Brood Ant: a little pop of puffs where each baby lands
        const fast = S.speed >= 4;
        for (const k of e.kids) for (let i = 0; i < (fast ? 1 : 3); i++) addFx({ k: 'puff', x: k.x + (Math.random() - 0.5) * 8, y: k.y + (Math.random() - 0.5) * 5, vx: (Math.random() - 0.5) * 50, vy: -Math.random() * 34, r: 3 + Math.random() * 3, life: 0.45, max: 0.45 });
        addFloatText(S.fx, { key: 'split', x: e.x, y: e.y - 26, n: 1, fmt: () => 'Babies!', col: '#ffd0e0', life: 0.9 }); break;
      }
      case 'pickup': { // v0.7.10 cookie pause: the ant pauses at the treat - a crumb pop (1 puff at 4x), a small squash-hop, a rate-limited tick. Reduced motion: one still puff, no hop.
        const rm = reducedMotion(), fast = S.speed >= 4;
        let near = null, nd = 99; for (const q of b.ants) { const d = Math.abs(q.x - e.x) + Math.abs(q.y - e.y); if (d < nd) { nd = d; near = q; } }
        if (near && nd < 6 && !rm) { near._hopT = S.t; if (C.ART81) { near._grabT = S.t; if (!S._bubbleShown) { S._bubbleShown = true; near._bubbleUntil = S.t + (e.t || 1); } } } // v0.8.1 J3: grab squash + a '!' bubble on the first pickup of the battle
        for (let i = 0; i < (rm || fast ? 1 : 3); i++) addFx({ k: 'puff', x: e.x + (Math.random() - 0.5) * 8, y: e.y - 8 - Math.random() * 4, vx: rm ? 0 : (Math.random() - 0.5) * 36, vy: rm ? 0 : -14 - Math.random() * 18, r: 2.2, life: 0.4, max: 0.4 });
        if (!fast && S.t - (S._pickTick || -9) > 0.14) { S._pickTick = S.t; sfx('pop'); }
        break;
      }
      case 'immune': addFloatText(S.fx, { key: 'immune', x: e.x, y: e.y - 22, n: 1, fmt: () => 'immune!', col: '#c9f5c0', life: 0.8 }); break;
    }
  }
}

// ---------------- main loop ----------------
let lastT = performance.now(), insetClock = 0;
const clock = newClock();
// v0.7.4 M0: one rendered frame of the battle. `speed` = the NUMBER of fixed 1/60 sub-steps per frame (1/2/4), never a bigger dt. Events are consumed and the
// swatter queue flushed after EVERY sub-step, so the slap lands within one STEP (1/60 s) of its battle time at any speed (it used to wait for the frame end).
function battleStep(dt) {
  const b = S.battle;
  b.rescueScale = S.speed * PACE; // wall window stays rescue.window seconds (sim seconds arrive at label * PACE per wall second). Audio still uses the label.
  b.update(dt);
  if (S.autoBot) smartBotStep(b);
  if (S.speed > 1 || b.result) { consumeEvents(); flushSwat(!!b.result); }
  return !!b.result;
}
function battleFrame(dt) {
  if (S.guide) { consumeEvents(); return; } // v0.8.1 U1: the sim clock starts at the guide's 'Start' tap (A13: nothing else changes)
  advanceFrame(clock, dt, S.speed, battleStep, { now: () => performance.now() });
  consumeEvents(); flushSwat(!!S.battle.result);
  if (S.battle.result) finishBattle();
}
function frame(now) {
  const dt = Math.min(0.1, (now - lastT) / 1000); lastT = now;
  S.t += dt;
  heartbeat(false);
  insetClock += dt; if (insetClock >= 0.5) { insetClock = 0; refreshInset(); } // v0.7.3: re-read the bottom inset ~every 500 ms
  setAudioSpeed(S.screen === 'battle' ? S.speed : 1);
  if (S.screen === 'battle' && S.battle && !S.paused && !S.result && !S.dialog) battleFrame(dt);
  render(dt);
  capsTick(dt, now);
  if (down && down.b && down.b.id === 'verLong' && !down.moved && performance.now() - (S.capsHold || 0) > 700) { S.capsOn = !S.capsOn; down.b = null; sfx('tap'); } // v0.8.1 J11: long-press the version text
  requestAnimationFrame(frame);
}
// ---------------- v0.8.1 J11: particle / frame caps log (hidden overlay + window.__caps()) ----------------
// counts are sampled every frame (cheap max() calls), kept as running maxima since the battle started, and drawn only when the overlay is on.
const CAPS = { fx: 0, ui: 0, crumbSprites: 0, sparkles: 0, confetti: 0, frameMax: 0 }, CAPW = { n: 0, sum: 0, max: 0, at: 0, avg: 0, wmax: 0 };
function capsReset() { for (const k of Object.keys(CAPS)) CAPS[k] = 0; CAPW.n = 0; CAPW.sum = 0; CAPW.max = 0; CAPW.at = 0; CAPW.avg = 0; CAPW.wmax = 0; }
function capsNow() { return { fx: S.fx.length, ui: S.ui.length, crumbSprites: (S.crumbSprites || []).length, sparkles: S.fx.reduce((n, q) => n + (q.k === 'spark' || q.k === 'star' ? 1 : 0), 0), confetti: S.result ? S.result.confetti.length : 0 }; }
function capsTick(dt, now) {
  const c = capsNow(); for (const k of Object.keys(c)) if (c[k] > CAPS[k]) CAPS[k] = c[k];
  const ms = dt * 1000; CAPW.n++; CAPW.sum += ms; if (ms > CAPW.max) CAPW.max = ms; if (ms > CAPS.frameMax) CAPS.frameMax = ms;
  if (now - CAPW.at >= 5000) { CAPW.avg = CAPW.sum / Math.max(1, CAPW.n); CAPW.wmax = CAPW.max; CAPW.n = 0; CAPW.sum = 0; CAPW.max = 0; CAPW.at = now; }
}
function drawCapsOverlay() {
  if (!S.capsOn) return; const c = capsNow();
  ctx.save(); ctx.globalAlpha = 0.88; A.rr(ctx, 6, 64, 206, S.battle ? 134 : 98, 8); ctx.fillStyle = '#2e2230'; ctx.fill(); ctx.globalAlpha = 1;
  const L = [`fx ${c.fx} (max ${CAPS.fx})   ui ${c.ui} (${CAPS.ui})`, `crumbs ${c.crumbSprites} (${CAPS.crumbSprites})   sparks ${c.sparkles} (${CAPS.sparkles})`, `confetti ${c.confetti} (${CAPS.confetti})`, `frame avg ${CAPW.avg.toFixed(1)} ms  max ${CAPW.wmax.toFixed(1)}`, `run max ${CAPS.frameMax.toFixed(1)} ms   ants ${S.battle ? S.battle.ants.length : 0}`];
  if (S.battle) { const rc = S.battle.upgradeReach(); L.push(`towers L1/L2/L3+ ${rc.l1}/${rc.l2}/${rc.l3p}  upg ${rc.upgrades}`, `crumbs place ${rc.crumbsPlace}  upgrade ${rc.crumbsUpgrade}`); } // v0.8.1 M8
  L.forEach((s, i) => A.text(ctx, s, 14, 78 + i * 17, 12, '#ffe9c9', 'left', null)); ctx.restore();
}

function render(dt) {
  const rt0 = performance.now();
  A.MOTION.reduced = reducedMotion();
  prevButtons = buttons; buttons = [];
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = BG; ctx.fillRect(0, 0, canvas.width, canvas.height);
  applyLayout();
  ctx.setTransform(dpr * scale, 0, 0, dpr * scale, offX * dpr, offY * dpr);
  // soft background pattern
  if (S.skinSrc !== S.save.skins) { S.skinSrc = S.save.skins; A.setSkinPads(M.skinPads(S.save)); } // v0.8.2 EC5a
  drawBackdrop();
  renderTabBar(dt); // v0.7.2 C16: drawn BEFORE the screen so a modal / onboarding dim covers it and its blockers win the taps
  if (S.screen === 'map') renderMapScreen();
  else if (S.screen === 'prep') renderPrep();
  else if (S.screen === 'battle') renderBattle(dt);
  else if (S.screen === 'cards') renderCards();
  else if (S.screen === 'card') renderCardView();
  else if (S.screen === 'shop') renderShop();
  else if (S.screen === 'cabinet') renderCabinet();
  else if (S.screen === 'antbook') renderAntBook();
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
  { const rc = performance.now() - rt0; S.renderMs = S.renderMs ? S.renderMs * 0.9 + rc * 0.1 : rc; } // v0.8.2 G19: the measured render cost (ms, smoothed)
  drawCapsOverlay();
}
// ---------------- v0.7.2 C16: bottom tab bar (Map / Cards / Shop) ----------------
// Screen-space bar (CSS px = dp): BAR_H tall + the bottom safe-area inset (decoration, not tappable). Three equal tabs, each the full BAR_H tall
// (>= 48 dp at every width >= 144). Shown on the meta screens; slides out for modals; never on prep / battle / results / pack reveal.
let barK = 0;
const TAB_COL = ['#d9cfe0', '#b5d8ff', '#ffd27a'], TAB_NAME = ['Map', 'Cards', 'Shop'], TAB_MUTED = '#7a5a6a', BAR_BG = '#fff6ee';
function activeTab() { return S.screen === 'map' ? 0 : (S.screen === 'shop' || S.screen === 'cabinet') ? 2 : 1; } // (the Ant Book belongs to Cards)
function barWanted() { return isMeta() && !S.antCard && !S.starCard && !S.cal && !S.settings && !S.pack && !S.mergeAnim && !(S.reveal.length && S.reveal[0].at <= S.t) && !S.dialog; }
function tabRect(i) { // logical-coordinate rectangle of tab i (for the onboarding spot and the button hit areas)
  const tw = cw / 3, top = ch - BAR_H - insetB;
  return { x: (i * tw + 6 - offX) / scale, y: (top + 6 - offY) / scale, w: (tw - 12) / scale, h: 44 / scale, r: 14 / scale };
}
function tabTap(i) {
  if (i === activeTab()) { if (S.screen === 'map') S.mapScroll = autoMapScroll(); else if (S.screen === 'card') { S.screen = 'cards'; S.mergeAnim = null; } else if (S.screen === 'cabinet') S.screen = 'shop'; else if (S.screen === 'antbook') { S.screen = 'cards'; S.antBookSel = null; } return; } // active tab: silent
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
  button('setBlock2', -2000, -2000, W + 4000, H + 4000, () => closeSettings());
  const x = 70, y = 122, w = 260, h = 398; // v0.8.1 J12: five 68 px rows (Sound, Reduce motion, Haptics, Reset, Close)
  panel(x, y, w, h, '#fff6ee', 20); button('setPanel', x, y, w, h, () => {});
  A.text(ctx, 'Settings', 200, y + 28, 22, '#ffb3c1');
  const st = S.save.settings || {}; const muted = st.muted, rmv = st.reduceMotion || 'auto', hap = st.haptics !== false;
  const setS = (k, v) => { S.save.settings = { ...(S.save.settings || {}), [k]: v }; persist(); sfx('tap'); };
  drawButton(x + 24, y + 54, w - 48, 52, muted ? 'Sound: Off' : 'Sound: On', muted ? '#fff3e6' : '#9fe0b5', { size: 17 });
  button('setSound', x + 24, y + 50, w - 48, 60, () => { S.save.settings = { ...(S.save.settings || {}), muted: !muted }; setMuted(!muted); persist(); sfx('tap'); });
  drawButton(x + 24, y + 122, w - 48, 52, 'Reduce motion: ' + (rmv === 'on' ? 'On' : rmv === 'off' ? 'Off' : 'Auto'), rmv === 'on' ? '#9fe0b5' : '#fff3e6', { size: 16 });
  button('setReduce', x + 24, y + 118, w - 48, 60, () => setS('reduceMotion', rmv === 'auto' ? 'on' : rmv === 'on' ? 'off' : 'auto'));
  drawButton(x + 24, y + 190, w - 48, 52, hap ? 'Haptics: On' : 'Haptics: Off', hap ? '#9fe0b5' : '#fff3e6', { size: 17 });
  button('setHaptics', x + 24, y + 186, w - 48, 60, () => setS('haptics', !hap));
  const sure = S.confirmReset > S.t;
  drawButton(x + 24, y + 258, w - 48, 52, sure ? 'Sure? Tap again' : 'Reset progress', '#ffb3b3', { size: sure ? 16 : 17 });
  button('setReset', x + 24, y + 254, w - 48, 60, () => {
    if (S.confirmReset > S.t) { const keepSet = S.save.settings; S.save = M.newSave(); if (keepSet) S.save.settings = keepSet; Cal.touch(S.save, now()); persist(); S.confirmReset = 0; S.cardsBlinkUntil = 0; closeSettings(); toast('Progress reset'); }
    else { S.confirmReset = S.t + 3; }
  });
  drawButton(x + 24, y + 326, w - 48, 48, 'Close', '#fff3e6', { size: 17 });
  button('setClose', x + 24, y + 322, w - 48, 56, () => closeSettings());
}
// v0.7.5 C18: the backdrop (gradient + faint gingham tablecloth) is baked once into one offscreen canvas per layout (resolution capped at 2x) and blitted with a single
// drawImage per frame; it is rebuilt only on a resize / DPR / layout change (S.bdCache is cleared in resize()). Only the 14 drifting bubbles are drawn live.
const CLOTH = { a: 'rgba(236,140,150,0.08)', b: 'rgba(230,130,140,0.05)', tile: 80 };
function bakeBackdrop() {
  const k = Math.min(1, 2 / dpr), cv = document.createElement('canvas');
  cv.width = Math.max(1, Math.round(canvas.width * k)); cv.height = Math.max(1, Math.round(canvas.height * k));
  const g = cv.getContext('2d'); g.setTransform(dpr * scale * k, 0, 0, dpr * scale * k, offX * dpr * k, offY * dpr * k);
  // v0.8.0 (spec 9.2): the warm peach DIAMOND table (palette: table #ffc98f / #fbc085), a soft top light and a gentle edge vignette. Baked once per layout; only the drifting bubbles are live.
  g.fillStyle = '#ffc98f'; g.fillRect(-2000, -2000, W + 4000, H + 4000);
  const x0 = -offX / scale, x1 = (cw - offX) / scale, y0 = -offY / scale, y1 = (ch - offY) / scale, DS = 44;
  g.save(); g.translate(W / 2, H / 2); g.rotate(Math.PI / 4); g.fillStyle = '#fbc085';
  const reach = Math.hypot(Math.max(Math.abs(x0 - W / 2), Math.abs(x1 - W / 2)), Math.max(Math.abs(y0 - H / 2), Math.abs(y1 - H / 2))), nC = Math.ceil(reach / DS) + 1;
  for (let j = -nC; j <= nC; j++) for (let i = -nC; i <= nC; i++) if (((i + j) & 1) !== 0) g.fillRect(i * DS - DS / 2, j * DS - DS / 2, DS, DS);
  g.restore();
  const tl = g.createLinearGradient(0, y0, 0, y0 + H * 0.6); tl.addColorStop(0, 'rgba(255,244,226,0.42)'); tl.addColorStop(1, 'rgba(255,244,226,0)');
  g.fillStyle = tl; g.fillRect(x0 - 4, y0 - 4, x1 - x0 + 8, H * 0.6 + 4);
  const vg = g.createRadialGradient(W / 2, H * 0.48, H * 0.34, W / 2, H * 0.48, H * 0.82); vg.addColorStop(0, 'rgba(190,110,70,0)'); vg.addColorStop(1, 'rgba(190,110,70,0.2)');
  g.fillStyle = vg; g.fillRect(x0 - 4, y0 - 4, x1 - x0 + 8, y1 - y0 + 8);
  return cv;
}
// v0.8.2 G9: the battle table - theme ground + oversize props in the margins outside the logical canvas, baked per layout + map (the lip layer is blitted after the board)
function battleTable() {
  const b = S.battle; if (!b) return null;
  const key = `${canvas.width}x${canvas.height}|${scale.toFixed(4)}|${offX.toFixed(2)}|${offY.toFixed(2)}|${b.mapId}`;
  if (!S.tbCache) S.tbCache = {};
  let e = S.tbCache[key];
  if (!e) {
    if (Object.keys(S.tbCache).length >= 2) S.tbCache = {};
    const t0 = (typeof performance !== 'undefined' ? performance.now() : 0), sc = Math.min(dpr, 2);
    const lx0 = offX, lx1 = offX + W * scale, ly0 = offY, ly1 = offY + H * scale;
    const margins = [{ side: 'L', x: 0, y: offY + MAP_Y * scale, w: lx0, h: MAP_H * scale }, { side: 'R', x: lx1, y: offY + MAP_Y * scale, w: cw - lx1, h: MAP_H * scale }, { side: 'T', x: 0, y: 0, w: cw, h: ly0 }, { side: 'B', x: 0, y: ly1, w: cw, h: ch - ly1 - insetB }];
    const board = { x: offX, y: offY + MAP_Y * scale, w: MAP_W * scale, h: MAP_H * scale };
    const lv = b.level || {}, r = A.renderTable(b.map.theme || 0, lv.world || 1, String(b.mapId), cw, ch, sc, margins, board);
    e = S.tbCache[key] = { bd: r.bd, lip: r.lip, sc, props: r.props, ms: (typeof performance !== 'undefined' ? performance.now() : 0) - t0 };
    S.lastTableBake = e.ms;
  }
  return e;
}
function drawTableLip() { // after the board: 4 px of each side prop over the rim
  if (!C.ART81 || offX < 24) return; const e = battleTable(); if (!e) return;
  const by = offY + MAP_Y * scale, bh = MAP_H * scale; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  for (const x of [offX, offX + W * scale - 4]) ctx.drawImage(e.lip, x * e.sc, by * e.sc, 4 * e.sc, bh * e.sc, x * dpr, by * dpr, 4 * dpr, bh * dpr);
  ctx.restore();
}
function drawBackdrop() {
  const key = `${canvas.width}x${canvas.height}|${dpr}|${scale.toFixed(4)}|${offX.toFixed(2)}|${offY.toFixed(2)}`;
  if (!S.bdCache) S.bdCache = {};
  let bd = S.bdCache[key];
  if (C.ART81 && S.screen === 'battle' && S.battle) { const e = battleTable(); if (e) bd = e.bd; }
  else if (!bd) { if (Object.keys(S.bdCache).length >= 3) S.bdCache = {}; bd = S.bdCache[key] = bakeBackdrop(); }
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (S.screen === 'battle') { // perf (v0.8.0): the opaque board covers the middle of the screen, so only the strips around it are blitted (saves ~20% of the frame's blit area)
    const m = dpr * scale, ix = 2, tx0 = Math.max(0, Math.ceil(offX * dpr + ix)), tx1 = Math.min(canvas.width, Math.floor((offX + MAP_W * scale) * dpr - ix)), ty0 = Math.max(0, Math.ceil((offY + MAP_Y * scale) * dpr + ix)), ty1 = Math.min(canvas.height, Math.floor((offY + (MAP_Y + MAP_H) * scale) * dpr - ix));
    const kx = bd.width / canvas.width, ky = bd.height / canvas.height;
    const strip = (x0, y0, x1, y1) => { if (x1 > x0 && y1 > y0) ctx.drawImage(bd, x0 * kx, y0 * ky, (x1 - x0) * kx, (y1 - y0) * ky, x0, y0, x1 - x0, y1 - y0); };
    if (tx1 > tx0 && ty1 > ty0 && m > 0) { strip(0, 0, canvas.width, ty0); strip(0, ty1, canvas.width, canvas.height); strip(0, ty0, tx0, ty1); strip(tx1, ty0, canvas.width, ty1); }
    else strip(0, 0, canvas.width, canvas.height);
  } else ctx.drawImage(bd, 0, 0, bd.width, bd.height, 0, 0, canvas.width, canvas.height);
  ctx.restore();
  ctx.save();
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
let _lblBoxes = null;
function mapLabelBoxes() { return _lblBoxes || (_lblBoxes = C.LEVELS.map((_, i) => { const p = nodePos(i); return { x: p.x, y: p.y + 48 }; })); } // v0.8.1 F15
function drawMapRoad() {
  const pts = mapRoadPoints(); let done = 0; while (done < S.save.levels.length && S.save.levels[done].cleared) done++;
  const path = () => { ctx.beginPath(); pts.forEach((p, k) => (k ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y))); };
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.save(); ctx.translate(0, 4); path(); ctx.lineWidth = 24; ctx.strokeStyle = 'rgba(70,35,50,0.22)'; ctx.stroke(); ctx.restore(); // v0.7.5 C18: cast shadow, INK outline, lip
  path(); ctx.lineWidth = 22; ctx.strokeStyle = A.INK; ctx.stroke();
  ctx.save(); ctx.translate(0, 1.5); path(); ctx.lineWidth = 19; ctx.strokeStyle = '#d9a08c'; ctx.stroke(); ctx.restore();
  path(); ctx.lineWidth = 16; ctx.strokeStyle = '#f6dcc0'; ctx.stroke();                         // sandy road
  // travelled part of the road glows a little warmer
  const doneIdx = Math.min(pts.length - 1, done * 24);
  if (doneIdx > 0) { ctx.beginPath(); for (let k = 0; k <= doneIdx; k++) (k ? ctx.lineTo(pts[k].x, pts[k].y) : ctx.moveTo(pts[k].x, pts[k].y)); ctx.lineWidth = 16; ctx.strokeStyle = '#ffe3a8'; ctx.stroke(); }
  path(); ctx.setLineDash([2, 13]); ctx.lineDashOffset = -S.t * 6; ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(200,140,110,0.75)'; ctx.stroke(); ctx.setLineDash([]); // crumb trail
  ctx.restore();
  // a few tufts and pebbles along the road (fixed, decorative)
  for (let k = 12; k < pts.length - 6; k += 29) { const p = pts[k], q = pts[k + 1]; const dx = q.x - p.x, dy = q.y - p.y, L = Math.hypot(dx, dy) || 1; const s = k % 2 ? 1 : -1;
    const tx = p.x - dy / L * 17 * s, ty = p.y + dx / L * 17 * s;
    if (mapLabelBoxes().some((q) => Math.abs(tx - q.x) < 46 && ty > q.y - 14 && ty < q.y + 14)) continue; // v0.8.1 F15: no tuft / pebble under a level label (a 14 px band, 92 px wide, around each name)
    if (k % 3) { ctx.beginPath(); for (const a of [-0.5, 0, 0.5]) { ctx.moveTo(tx, ty); ctx.lineTo(tx + Math.sin(a) * 6, ty - Math.cos(a) * 7); } ctx.lineWidth = 2; ctx.strokeStyle = '#8fcf86'; ctx.lineCap = 'round'; ctx.stroke(); }
    else A.blob(ctx, tx, ty, 3.2, 2.4, '#d9c6cf', 1.4); }
}
// the gate between two worlds: world name, its treat, and (while locked) what it takes to open it (v0.5 item 14)
function drawWorldGate(w) {
  const W2 = C.WORLDS.find((x) => x.id === w); const y = gateY(w); const open = M.worldUnlocked(S.save, w);
  const prev = W2.unlock ? (W2.unlock.allLevelsWonInWorld ?? w - 1) : w - 1;
  panel(40, y - 30, 320, 60, open ? '#fff1f6' : '#efe7ec', 18);
  ctx.save(); ctx.translate(76, y + 2); ctx.scale(0.62, 0.62); A.drawTreat(ctx, W2.treat, 0, 0, 1, S.t, { face: open ? 'happy' : 'content' }); ctx.restore();
  if ((w === 5 || w === 6) && C.ART81) A.drawChunkyText(ctx, `${W2.name}`, 214, y - 12, 20, open ? { mode: 'title' } : { mode: 'plain', fill: '#b9a6b2' }); // v0.8.1 W8: the W5 banner in the chunky 'title' style (World 5 = the donut on the left)
  else A.text(ctx, `World ${w}: ${W2.name}`, 214, y - 12, 17, open ? '#ff8fab' : '#b9a6b2');
  if (open) plainFit(w === 6 ? W6_STORY : w === 5 ? W5_STORY : 'Open! Beat the queen at the top.', 214, y + 12, 262, 12, '#6b5562', 'center', '600'); // v0.8.1 W9: the W5 story line (<= 60 chars)
  else {
    const won = C.LEVELS.filter((L, i) => L.world === prev && S.save.levels[i].cleared).length, total = C.LEVELS.filter((L) => L.world === prev).length;
    plainFit(`Win all ${total} levels (${won}/${total}) + ${W2.unlock.minStarsInWorld} stars (${M.worldStars(S.save, prev)}/${total * 3})`, 214, y + 12, 262, 12, '#a0607e', 'center', '700');
    // (v0.7.7 P2: the lock text uses the exact wording and live numbers)
    if (C.ART81) { const gy0 = Math.max(y + S.mapScroll - 30, MAPVIEW.top), gy1 = Math.min(y + S.mapScroll + 30, MAPVIEW.bottom); if (gy1 - gy0 >= 16) button('gate' + w, 40, gy0, 320, gy1 - gy0, () => { if (!S.starCard) { S.starCard = { w }; sfx('tap'); } }); } // clipped to the visible map so it never covers the header (Calendar) or the tab bar // v0.8.1 U6: tap the locked gate for the lowest-star levels
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
    plainText('Calendar', bx + bs / 2, by + 52, 12, '#5a4652', 'center', '700');
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
  // v0.8.1 J8: a tiny ant walks from the last cleared node to the next one every 8 s (3 s walk); 3-star nodes shine every 4 s (<= 1 per node, <= 4 on screen). Reduced motion: static.
  const lifeOn = C.ART81 && !reducedMotion(); let shines = 0, lastCleared = -1;
  if (lifeOn) for (let i = 0; i < C.LEVELS.length; i++) if (S.save.levels[i].cleared) lastCleared = i;
  for (let i = 0; i < C.LEVELS.length; i++) {
    const p = nodePos(i); const L = S.save.levels[i]; const open = M.levelUnlocked(S.save, i);
    const w = C.worldOf(i), boss = i === C.WORLD_START[w] + C.WORLDS.find((x) => x.id === w).levels - 1;
    const isNext = open && !L.cleared;
    const bounce = isNext ? Math.abs(Math.sin(S.t * 3)) * 4 : 0;
    A.mapNode(ctx, p.x, p.y - bounce, i, { open, cleared: L.cleared, next: isNext, stars: L.stars, boss }, S.t);
    if (boss) { ctx.save(); ctx.translate(p.x + 24, p.y - 30 - bounce); ctx.scale(0.55, 0.55); A.drawAnt(ctx, C.QUEENS[w].type, 0.2); ctx.restore(); }
    if (lifeOn && L.stars >= 3 && shines < 4 && p.y + sc > MAPVIEW.top && p.y + sc < MAPVIEW.bottom) { const ph = ((S.t + i * 1.3) % 4) / 0.6; if (ph < 1) { shines++; A.fxSparkle(ctx, p.x + 15, p.y - 15, 7, '#fff7a8', ph); } }
    if (lifeOn && i === lastCleared && i + 1 < C.LEVELS.length) { const wk = (S.t % 8) / 3; if (wk < 1) { const q = nodePos(i + 1), ax = p.x + (q.x - p.x) * (0.15 + 0.7 * wk), ay = p.y + (q.y - p.y) * (0.15 + 0.7 * wk); ctx.save(); ctx.translate(ax, ay + 4); ctx.scale((q.x >= p.x ? 1 : -1) * 0.34, 0.34); { const wsp = A.antSprite('worker', Math.floor(S.t * 9) % A.ANT_FRAMES, false, pxRatio); ctx.drawImage(wsp.cv, -wsp.ox, -wsp.oy, wsp.w, wsp.h); } ctx.restore(); } } // cached sprite (no per-frame vector ant)
    for (let s2 = 0; s2 < 3; s2++) A.starShape(ctx, p.x - 18 + s2 * 18, p.y + 32, 7, s2 < L.stars ? '#ffd45e' : '#e8dde4', 1.6);
    A.text(ctx, C.LEVELS[i].name, p.x, p.y + 48, 12, '#7a5a6a', 'center', null);
    const sy = p.y + sc; S.layoutNodes.push({ i, x: p.x, y: sy });
    if (open && sy > MAPVIEW.top + 10 && sy < MAPVIEW.bottom - 10) button('lvl' + i, p.x - 30, sy - 30, 60, 60, () => openPrep(i));
  }
  drawNextHint(sc);
  ctx.restore();
  // scroll hint while world 2 is out of view
  // v0.7.7: the hint names the lowest world whose gate has scrolled off the top (W2 first, then W3, ...)
  const hintW = C.WORLDS.map((x) => x.id).filter((id) => id >= 2).find((id) => gateY(id) + sc < MAPVIEW.top - 10);
  if (hintW) {
    const a = 0.75 + 0.25 * Math.sin(S.t * 4);
    ctx.save(); ctx.globalAlpha = a; A.rr(ctx, 128, MAPVIEW.top - 30, 144, 24, 12); ctx.fillStyle = 'rgba(90,64,88,0.85)'; ctx.fill(); // v0.7.8 P2-4: the pill sits in the free band ABOVE the map window (y 164-188), so it never covers a node label
    plainText(`\u25B2 World ${hintW} - scroll up`, 200, MAPVIEW.top - 17.5, 12, '#ffffff', 'center', '700'); ctx.restore();
  }
  // v0.7.2 C16: the bottom buttons moved into the fixed tab bar (renderTabBar); Snd / Reset live in the settings panel behind the gear
  updateCardsBlink();
  A.blob(ctx, 363, 22, 19, 19, '#fff6ee', 2.2); drawGearIcon(363, 22, 12); button('gear', 337, 0, 52, 52, () => openSettings()); // v0.7.3: 7 px left / 4 px up, clear of the mascot's antennae
  // v0.7.3: the version label sits in the free corner under the Calendar badge (it used to collide with the bottom-row stage label), and is drawn only
  // when no modal / onboarding spot covers the map (Daily Rewards, settings, the Shop hint)
  const shopHint = !S.cal && !S.settings && M.zapperGiftPending(S.save) && !S.reveal.length;
  if (!S.cal && !S.settings && !shopHint) plainText('v' + C.VERSION, 14, 186, 12, '#a08090', 'left', '600');
  if (!S.cal && !S.settings && !shopHint) button('verLong', 8, 168, 84, 44, () => {}, { onDown: () => { S.capsHold = performance.now(); } }); // v0.8.1 J11: a 700 ms long-press toggles the caps overlay
  if (S.starCard && !S.cal && !S.settings) renderStarCard(); // v0.8.1 U6
  if (S.cal) renderCalendar();
  else if (S.settings) renderSettings();
  else if (shopHint) onboardSpot(tabRect(2), 'shop', () => go('shop'), 'A free pack waits in the Shop!');
  renderUiFx(1 / 60);
}
// ---------------- v0.6 item 5: one-time onboarding (dim everything except one button + a pointing finger) ----------------
let lastBubble = null; // test hook
function onboardSpot(R, id, onTap, msg, bub = null, dim = 0.66) { // bub = { x, y, w }: an explicit bubble box (v0.7.4 P2: the Cards hint sits in the empty right half of the last card row, not over card labels)
  ctx.save();
  // full-screen dim with a bright cut-out: the hole is added to the SAME path (A.rr would beginPath() and wipe the rect)
  ctx.beginPath(); ctx.rect(-2000, -2000, W + 4000, H + 4000);
  { const x = R.x - 6, y = R.y - 6, w = R.w + 12, h = R.h + 14, r = Math.min((R.r || 14) + 4, w / 2, h / 2);
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  ctx.fillStyle = `rgba(40,26,38,${dim})`; ctx.fill('evenodd');
  const g = 0.5 + 0.5 * Math.sin(S.t * 5);
  A.rr(ctx, R.x - 6, R.y - 6, R.w + 12, R.h + 14, (R.r || 14) + 4); ctx.lineWidth = 3 + g * 2; ctx.strokeStyle = `rgba(255,227,110,${0.6 + 0.4 * g})`; ctx.stroke();
  ctx.restore();
  button('onboardBlock', -2000, -2000, W + 4000, H + 4000, () => {}); // only the highlighted button works
  button(id, R.x, R.y, R.w, R.h, onTap);
  const fx = R.x + R.w / 2 + 18, fy = R.y - 22 - Math.abs(Math.sin(S.t * 4)) * 12;
  drawFinger(fx, fy);
  if (msg) { const my = R.y < 260 ? R.y + R.h + 22 : Math.max(90, R.y - (R.y > 600 ? 148 : 104)); // v0.7.3: a tab-bar spot lifts the bubble 44 px higher, off the bottom map row's stage labels
    if (bub) { panel(bub.x, bub.y, bub.w, 40, '#fff6ee', 16); plainFit(msg, bub.x + bub.w / 2, bub.y + 20, bub.w - 24, 15, '#e0607e', 'center', '800'); lastBubble = { x: bub.x, y: bub.y, w: bub.w, h: 40 }; }
    else { panel(60, my, 280, 40, '#fff6ee', 16); plainFit(msg, 200, my + 20, 256, 15, '#e0607e', 'center', '800'); lastBubble = { x: 60, y: my, w: 280, h: 40 }; } }
}
// v0.8.1 U9: one pulsing ring + finger on the next unplayed level node (armed once after the Cards hint and once after the first L1 win; <= 2 per save). Reduced motion: a static ring.
// Drawn inside the map's scroll transform. Never while a modal / onboarding spot is open. Test builds show it only with ?nexthint=1 (the older QA suites do not expect it).
function nextHintWanted() { return C.ART81 && (!__TEST_HOOKS__ || /[?&]nexthint=1/.test(location.search)); }
function drawWorldReveal(sc) { // v0.8.3 PP10: a ring + the node's name chip on the first node of the world just opened, for 1.2 s (reduced motion: a still ring, no pulse)
  const r = S.worldReveal; if (!r || S.screen !== 'map') { if (r && S.screen !== 'map') S.worldReveal = null; return; }
  if (S.t - r.t0 > 1.2) { S.worldReveal = null; return; }
  const p = nodePos(r.i), k = (S.t - r.t0) / 1.2, rm = reducedMotion();
  ctx.save(); ctx.globalAlpha = 1 - k * k; ctx.lineWidth = 4; ctx.strokeStyle = '#ffe36e'; ctx.beginPath(); ctx.arc(p.x, p.y, 28 + (rm ? 4 : k * 14), 0, Math.PI * 2); ctx.stroke(); ctx.restore();
}
function drawNextHint(sc) {
  drawWorldReveal(sc);
  if (!nextHintWanted() || S.screen !== 'map') { S.nextHint = null; return; }
  const modal = S.cal || S.settings || S.antCard || S.starCard || S.reveal.length || S.pack || (M.zapperGiftPending(S.save) && !S.reveal.length);
  if (modal) return;
  const h = M.nextHintState(S.save), i = M.nextUnplayedLevel(S.save);
  if (i < 0) { S.nextHint = null; return; }
  const p = nodePos(i), sy = p.y + sc; if (sy < MAPVIEW.top + 20 || sy > MAPVIEW.bottom - 40) return; // off screen: not consumed
  if (!S.nextHint) {
    if (!h.armed || h.shown >= 2) return;
    S.nextHint = { kind: h.armed, i, t0: S.t }; h.shown++; h.done.push(h.armed); h.armed = ''; persist(); // this is the one showing
  }
  if (S.nextHint.i !== i || S.t - S.nextHint.t0 > 12) { S.nextHint = null; return; } // follows the next node; fades out after 12 s
  const pulse = reducedMotion() ? 0.5 : 0.5 + 0.5 * Math.sin(S.t * 5);
  ctx.save(); ctx.lineWidth = 3.5 + pulse * 2; ctx.strokeStyle = `rgba(255,227,110,${0.65 + 0.35 * pulse})`; ctx.beginPath(); ctx.arc(p.x, p.y, 30 + pulse * 5, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
  drawFinger(p.x + 18, p.y - 30 - (reducedMotion() ? 0 : Math.abs(Math.sin(S.t * 4)) * 10));
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
  else if (p.kind === 'card') { ctx.save(); ctx.translate(x, y); ctx.rotate(-0.12); A.rr(ctx, -11 * s, -14 * s, 22 * s, 28 * s, 5 * s); ctx.fillStyle = p.level >= 2 ? '#ffd27a' : '#b5d8ff'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = A.INK; ctx.stroke(); A.text(ctx, 'L' + p.level, 0, 0.5, 12 * s, '#fff'); ctx.restore(); }
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
    plainText(`Day ${m}`, mx, my + 24 * sc - (tier === 3 ? 4 : 0), 12, tier === 3 ? '#c27a00' : '#6b5562', 'center', '700');
  });
  if (st.resetPending && !CA.result) plainText('You missed a day - the streak restarts at 1.', 200, 256, 12, '#c0392b', 'center', '600');
  else plainText('Collect every day to keep the streak. Bigger prizes as it grows!', 200, 256, 12, '#6b5562', 'center');
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
    plainText(`Day ${i + 1}`, x + 9, y + 13, 12, '#6b5562', 'left', '700');
    if (missed) plainText('missed', x + w - 8, y + 13, 12, '#8c7a86', 'right', '600');
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
    A.text(ctx, opt.lockText || 'Locked', x + w / 2, y + h - 14, 12, '#7a6a76', 'center', null);
    ctx.restore(); return;
  }
  if (C.ART81 && opt.cost != null) { // v0.8.2 G16: a 2 px top highlight (lost when the card is unaffordable) and a 3 px bottom shade
    ctx.save(); ctx.lineCap = 'round'; if (opt.afford) { ctx.beginPath(); ctx.moveTo(x + 13, y + 3.2); ctx.lineTo(x + w - 13, y + 3.2); ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(x + 13, y + h - 2.6); ctx.lineTo(x + w - 13, y + h - 2.6); ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(70,35,50,0.28)'; ctx.stroke(); ctx.restore();
  }
  ctx.save(); ctx.beginPath(); A.rr(ctx, x + 4, y + 4, w - 8, h - 8, 11); ctx.clip();
  const nameY = y + h - (opt.cost != null ? (C.ART81 ? 35 : 31) : 13);
  const iconY = y + (nameY - y) * 0.62 + 4;
  ctx.beginPath(); ctx.arc(x + w / 2, iconY - 8, w * 0.32, 0, 7); ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.fill();
  const iconS = Math.min(w / 58, (nameY - y) / 58);
  ctx.translate(x + w / 2, iconY); ctx.scale(iconS, iconS); A.drawTower(ctx, type, S.t, null);
  ctx.restore();
  const tag = T.place === 'path' ? 'on trail' : (T.targets === 'air' ? 'air only' : type === 'laser' ? 'gnd+air' : '');
  if (tag && h > 70 && !opt.badge) A.text(ctx, tag, x + w - 7, y + 11, 12, '#fff', 'right');
  fitText(T.short || T.name, x + w / 2, nameY, w - 10, w < 85 ? 13 : 14, '#fff');
  if (opt.level) { A.blob(ctx, x + 12, y + 12, 12, 11, '#ffe36e', 2); A.text(ctx, 'L' + opt.level, x + 12, y + 12.5, 12, '#7a4a2a', 'center', null); }
  if (opt.cost != null && C.ART81) { // v0.8.2 G16: a chunky price - 16 px Lilita, 2 px INK stroke, on a dark pill (fill vs pill >= 4.5:1)
    const px = x + 8, pw = w - 16, py = y + h - 25, ph = 21;
    A.rr(ctx, px, py, pw, ph, 10); ctx.fillStyle = opt.afford ? '#6a4660' : '#664250'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = A.INK; ctx.stroke();
    A.crumbIcon(ctx, x + w / 2 - (opt.cost === 0 ? 24 : 16), py + ph / 2 + 0.5, 0.8);
    A.drawChunkyText(ctx, opt.cost === 0 ? 'FREE' : String(opt.cost), x + w / 2 + (opt.cost === 0 ? 8 : 7), py + ph / 2 + 0.5, 16, { fill: opt.afford ? '#fff6c8' : '#ffc9c0', outline: 2 });
  } else if (opt.cost != null) {
    A.rr(ctx, x + 10, y + h - 21, w - 20, 17, 8); ctx.fillStyle = opt.afford ? '#fff8ec' : '#ffd6d6'; ctx.fill(); ctx.lineWidth = 1.8; ctx.strokeStyle = A.INK; ctx.stroke();
    A.crumbIcon(ctx, x + w / 2 - (opt.cost === 0 ? 22 : 14), y + h - 12.5, 0.75);
    A.text(ctx, opt.cost === 0 ? 'FREE' : String(opt.cost), x + w / 2 + 6, y + h - 12, 12, opt.afford ? '#7a4a2a' : '#c0392b', 'center', null);
  }
  if (opt.badge) { A.blob(ctx, x + w - 11, y + 11, 11, 11, '#ff8fab', 2); A.text(ctx, opt.badge, x + w - 11, y + 11.5, 12, '#fff'); }
  // v0.5 items 6/7: '!' = a merge is ready on this card; '+1' = a won card you have not looked at yet
  if (opt.mergeReady) { const p = 1 + Math.sin(S.t * 6) * 0.08; ctx.save(); ctx.translate(x + w - 10, y + 10); ctx.scale(p, p); A.blob(ctx, 0, 0, 11, 11, '#ff6f91', 2); A.text(ctx, '!', 0, 0.5, 14, '#fff'); ctx.restore(); }
  if (opt.fresh) { A.rr(ctx, x + w / 2 - 19, y - 9, 38, 17, 8); ctx.fillStyle = '#ffd45e'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = A.INK; ctx.stroke(); A.text(ctx, 'NEW', x + w / 2, y - 0.5, 12, '#fff'); }
  ctx.restore();
}
function antIcon(type, x, y, s = 1, idx = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); A.heroBob(ctx, S.t, idx); A.drawAnt(ctx, type, (S.t * 1.3) % 1); ctx.restore(); }

// ---------------- PREP ----------------
function renderPrep() {
  const i = S.levelIndex, L = C.LEVELS[i];
  panel(12, 12, 376, 696, '#fff6ee');
  A.drawChunkyText(ctx, `Level ${i + 1}`, 200, 40, 28, { mode: 'title' });
  A.text(ctx, levelHeaderLine(L, C.MAPS), 200, 66, 13, '#7a5a6a', 'center', null); // v0.7.10: the map name is shown once when it equals the level name
  // enemy preview
  const ants = levelAntTypes(i);
  A.text(ctx, 'Incoming ants', 30, 92, 14, '#7a5a6a', 'left', null);
  A.text(ctx, `${L.waveCount} waves`, 370, 92, 14, '#7a5a6a', 'right', null);
  if (levelHasFlyers(i)) { A.rr(ctx, 152, 82, 132, 20, 10); ctx.fillStyle = '#d7ecff'; ctx.fill(); ctx.lineWidth = 1.6; ctx.strokeStyle = '#5a9fe0'; ctx.stroke(); plainText('Flyers in this level', 218, 92.5, 12, '#2f6fae', 'center', '800'); } // v0.7 (Should): flyers preview
  // icons share the panel width; big ants (queen) are scaled so nothing overflows or reaches the header line
  S.layoutPrepAnts = [];
  const n = ants.length, slot = Math.min(76, 340 / n), x0 = 200 - (slot * (n - 1)) / 2;
  ants.forEach((t, k) => {
    const x = x0 + k * slot, sz = C.ANTS[t].size;
    const sc = Math.min(1.15, (slot - 6) / (40 * sz), 30 / (34 * sz)); // width ~40*size, height above feet ~34*size
    antIcon(t, x, 133, sc, k); // v0.7.7: 3 px higher, to leave room for the rarity pips between the shadow and the name
    S.layoutPrepAnts.push({ type: t, x: x - 20 * sz * sc, y: 133 - 34 * sz * sc, w: 40 * sz * sc, h: 46 * sz * sc });
    { // v0.7.7 S2: rarity pips under the icon (common 1 .. elite 4; the queen has none), colour = tier
      const rk = C.rarityRank(t) + 1, cols = ['#b9a8b0', '#5fbf7a', '#4a90e2', '#a05ad8'];
      if (rk <= 4) for (let q = 0; q < rk; q++) { ctx.beginPath(); ctx.arc(x + (q - (rk - 1) / 2) * 6, 148, 2.2, 0, Math.PI * 2); ctx.fillStyle = cols[rk - 1]; ctx.fill(); ctx.lineWidth = 0.8; ctx.strokeStyle = 'rgba(70,40,55,.55)'; ctx.stroke(); }
    }
    button('ant' + t, x - slot / 2, 104, slot, 66, () => { S.prepTip = { type: t, until: S.t + 3.4 }; sfx('tap'); }); // v0.7.8 P2-2: tap an ant -> its rarity + the dot legend
    { // v0.7.6 V3: ant names stay 12 px - a name wider than its slot wraps to two lines (words, or after a hyphen)
      const nm = C.ANTS[t].name.replace(' Ant', ''); ctx.font = `bold 12px ${A.FONT}`;
      if (ctx.measureText(nm).width <= slot - 2) A.text(ctx, nm, x, 161, 12, '#7a5a6a');
      else { const parts = nm.includes(' ') ? nm.split(' ') : nm.split(/(?<=-)/); const ln = parts.length > 2 ? [parts[0], parts.slice(1).join(' ')] : parts; ln.forEach((q, qi) => A.text(ctx, q, x, 156.5 + qi * 12.5, 12, '#7a5a6a')); }
    }
  });
  // deck
  const unlocked = M.unlockedCards(S.save);
  A.text(ctx, `Your deck (${S.prep.deck.length}/${C.BATTLE.deckSize}) - tap to pick`, 30, 182, 14, '#7a5a6a', 'left', null);
  // v0.7 D-P4 / v0.7.6 E4: a card above the world's cap acts as the cap in this world - a pill on the card and one line under the grid
  const capW = worldCardLevelCap(i); const overCap = (id) => !!capW && unlocked.includes(id) && S.save.cards[id].level > capW;
  if (capW && unlocked.some(overCap)) plainText(`A card above L${capW} acts as L${capW} in this world`, 200, 488, 12, '#b0506a', 'center', '800'); // v0.7.7: the badge shows the capped level (pink + a marker); the pill is gone
  const ownedIds = C.ALL_CARDS.filter((id) => unlocked.includes(id)), lockedIds = C.ALL_CARDS.filter((id) => !unlocked.includes(id)); // v0.8.2 R12: owned cards first (5 columns), the locked ones last as small tiles under a thin divider
  ownedIds.forEach((id, k) => { // v0.6: 13 cards -> 5 columns x 3 rows
    const col = k % 5, row = Math.floor(k / 5);
    const x = 22 + col * 72, y = 196 + row * 98, w = 66, h = 90;
    const isU = true;
    const di = S.prep.deck.indexOf(id);
    drawCardPic(x, y, w, h, id, { locked: !isU, lockText: 'Shop or prize', selected: di >= 0, selCol: '#111111', badge: di >= 0 ? String(di + 1) : null, tag: true, level: isU ? S.save.cards[id].level : 0, cap: capW || 0, spStar: !!(C.ART81 && specialState(id, L, Math.min(S.save.cards[id].level, capW || 99)) === 'active'), dim: isU && di < 0 && S.prep.deck.length >= C.BATTLE.deckSize }); // v0.6.1: card picture
    if (isU) button('deck' + id, x, y, w, h, () => {
      const d = S.prep.deck; const j = d.indexOf(id);
      if (j >= 0) d.splice(j, 1); else if (d.length < C.BATTLE.deckSize) d.push(id); else toast(`Deck is full (${C.BATTLE.deckSize}). Tap a card to remove it.`);
      if (C.ART81 && C.TOWERS[id].special) S.prepTip = { tower: id, until: S.t + 3.4 }; // v0.8.2 M7g: the Special row (3 states) of the tapped card
      sfx('tap');
    });
  });
  if (lockedIds.length) { // v0.8.2 R12
    const ly = 196 + Math.ceil(ownedIds.length / 5) * 98 - 2;
    ctx.fillStyle = 'rgba(122,90,106,0.35)'; ctx.fillRect(22, ly + 9, 356, 1.5); A.rr(ctx, 130, ly, 140, 19, 9); ctx.fillStyle = '#f7ecef'; ctx.fill(); plainText('Not yet unlocked', 200, ly + 10, 12, '#7a5a6a', 'center', '700');
    lockedIds.forEach((id, k) => { const x = 24 + (k % 8) * 44, y = ly + 24 + Math.floor(k / 8) * 40, w = 40, h = 36; A.rr(ctx, x, y, w, h, 8); ctx.fillStyle = '#e4dbe1'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(82,60,75,0.55)'; ctx.stroke(); A.text(ctx, '?', x + w / 2, y + h / 2, 16, '#fff'); });
  }
  if (S.prepTip && S.prepTip.tower && S.t < S.prepTip.until) { // v0.8.2 M7g: tower tooltip = the card's Special row (state by this level and the card level it fights at)
    const id = S.prepTip.tower, T = C.TOWERS[id], cl = S.save.cards[id] ? Math.min(S.save.cards[id].level, capW || 99) : 1, st = specialState(id, C.LEVELS[i], cl);
    panel(20, 179, 360, 40, '#5a4058', 14);
    plainFit(`${T.name} \u00b7 card L${cl}`, 200, 190, 336, 12, '#ffe39a', 'center', '800');
    if (st === 'active') { const full = `${T.special.name}: ${T.special.text}`; ctx.font = `600 12px ${A.FONT}`; plainFit(ctx.measureText(full).width <= 336 ? full : `${T.special.name}: ${T.special.short}`, 200, 207, 336, 12, '#ffffff', 'center', '600'); }
    else if (st === 'asleep') plainFit(`${T.special.name}: awakens in World ${C.SPECIALS_FROM_WORLD}`, 200, 207, 336, 12, '#e4d6b8', 'center', '600');
    else plainFit(`Special unlocks at card level ${C.SPECIAL_CARD_LEVEL}`, 200, 207, 336, 12, '#d8cdd3', 'center', '600');
    button('antTip', 20, 175, 360, 48, () => { S.prepTip = null; });
  } else if (S.prepTip && S.prepTip.type && S.t < S.prepTip.until) { // v0.7.8 P2-2: rarity legend tooltip (2 lines, drawn below the ant names, over the deck title; tap it to close)
    const tp = S.prepTip.type, rk = C.rarityRank(tp) + 1, tier = C.rarityOf(tp), nm = C.ANTS[tp].name;
    panel(20, 179, 360, 40, '#5a4058', 14);
    plainFit(rk <= 4 ? `${nm}: ${tier} (${rk} dot${rk > 1 ? 's' : ''})` : `${nm}: ${tier} (no dots)`, 200, 192, 336, 12, '#ffe39a', 'center', '800');
    plainFit(C.ANTS[tp].intro || 'Dots: 1 common, 2 uncommon, 3 rare, 4 elite', 200, 208, 336, 12, '#ffffff', 'center', '600'); // v0.8.1 U3: line 2 = the ant's one-line intro (<= 60 chars); the dots legend stays as the fallback
    button('antTip', 20, 175, 360, 48, () => { S.prepTip = null; }); // touch target 48 px (the pill itself is 40)
  } else S.prepTip = null;
  // bonuses
  const by = 510; // v0.7.7 P1-1: >= 8 px below the cap line (its text ends at y 494; the Boosters title starts at 503)
  A.text(ctx, `Boosters (bring ${C.BATTLE.bonusTypesToBring}, max ${C.BATTLE.maxBonusUses} uses)`, 30, by, 14, '#7a5a6a', 'left', null);
  C.BONUS_TYPES.forEach((bt, k) => {
    const x = 26 + k * 88, y = by + 14, w = 80, h = 64;
    const sel = S.prep.bonuses.includes(bt);
    const stock = S.save.bonusStock[bt] || 0;
    A.rr(ctx, x, y, w, h, 14); ctx.fillStyle = sel ? A.shade(C.BONUSES[bt].color, 0.2) : '#f3ebee'; ctx.fill();
    // selection = thick black border; a selected booster with 0 left = animated red "lava" border (warning only since v0.3)
    if (sel && stock <= 0) { A.lavaBorder(ctx, x, y, w, h, 14, S.t); }
    else { ctx.lineWidth = sel ? 4.5 : 2.5; ctx.strokeStyle = sel ? '#111111' : A.INK; ctx.stroke(); }
    ctx.save(); ctx.translate(x + w / 2, y + 25); ctx.scale(1.3, 1.3); A.drawBonusIcon(ctx, bt, S.t); ctx.restore();
    A.text(ctx, C.BONUSES[bt].name, x + w / 2, y + 51, 12, '#fff');
    A.text(ctx, 'x' + stock, x + w - 12, y + 12, 12, stock ? '#fff' : '#ff9a9a');
    button('bon' + bt, x, y, w, h, () => {
      const b = S.prep.bonuses; const j = b.indexOf(bt);
      if (j >= 0) b.splice(j, 1); else { b.push(bt); if (b.length > C.BATTLE.bonusTypesToBring) b.shift(); if (stock <= 0) { zeroBonusAlert(bt); S.zeroHint = { bt, until: S.t + 8 }; } }
      sfx('tap');
    });
  });
  // warnings
  let warn = null;
  if (levelHasFlyers(i) && !S.prep.deck.some((d) => C.AIR_COUNTERS.includes(d))) warn = C.ART81 ? 'Flying ants ahead! Only the Laser and Bug Zapper can hit them.' : 'Flying ants ahead! Only Laser, Bug Zapper or the Crop Duster can hit them.';
  else if (ants.includes('gasmask') && S.prep.deck.includes('spray') && S.prep.deck.filter((d) => d !== 'spray' && C.TOWERS[d].kind === 'tower' && d !== 'fan').length < 2) warn = 'Gas-mask ants ignore Bug Spray - bring other damage too.';
  // v0.8.2 R6: a 0-stock booster is never pre-selected and the 'buy one' text is a neutral hint shown only after the player taps the 0-stock booster (S.zeroHint)
  if (S.zeroHint && S.t < S.zeroHint.until && S.prep.bonuses.includes(S.zeroHint.bt) && !(S.save.bonusStock[S.zeroHint.bt] > 0)) warn = `You have 0 ${C.BONUSES[S.zeroHint.bt].name}s. Buy one during battle for ${C.ECONOMY.diamonds.boosterPriceStart} diamonds, or in the Shop.`;
  // warnings are word-wrapped inside an auto-height box (no overflow on narrow phones)
  S.layoutWarn = null;
  S.layoutAirFix = null;
  const airPlan = C.ART81 && warn && warn.startsWith('Flying ants ahead') ? M.airFixPlan(S.prep.deck, unlocked, S.save.cards, C.BATTLE.deckSize) : null; // v0.8.3 U12
  if (airPlan) { // an amber warning with a 112 x 44 'Add <tower>' button (replaces the weakest card when the deck is full)
    const lines = wrapLines(warn, 214, 12).slice(0, 3), hh = 54, y0 = 646 - hh - 2, nm = C.TOWERS[airPlan.add].short || C.TOWERS[airPlan.add].name;
    panel(26, y0, 348, hh, '#ffe3a0', 12);
    lines.forEach((l, k) => A.text(ctx, l, 140, y0 + 27 - (lines.length - 1) * 7 + k * 14, 12, '#8a4a10', 'center', null));
    drawButton(256, y0 + 5, 112, 44, `Add ${nm}`, '#ffd27a', { size: 14 }); button('airfix', 256, y0 + 3, 112, 48, () => { const d = S.prep.deck; if (airPlan.drop) d.splice(d.indexOf(airPlan.drop), 1, airPlan.add); else d.push(airPlan.add); sfx('tap'); toast(`${C.TOWERS[airPlan.add].name} added` + (airPlan.drop ? ` (replaced ${C.TOWERS[airPlan.drop].name})` : ''), '#ffe39a'); });
    ctx.font = `bold 12px ${A.FONT}`; S.layoutWarn = { box: { x: 26, y: y0, w: 348, h: hh }, lines: lines.map((l) => ctx.measureText(l).width), maxW: 214 }; S.layoutAirFix = { add: airPlan.add, drop: airPlan.drop, x: 256, y: y0 + 3, w: 112, h: 48 };
  } else if (warn) {
    const lines = wrapLines(warn, 324, 12).slice(0, 3); const hh = 12 + lines.length * 14;
    panel(26, 646 - hh - 2, 348, hh, S.zeroHint && warn.startsWith('You have 0') ? '#fff2b8' : '#fff0c2', 12);
    lines.forEach((l, k) => A.text(ctx, l, 200, 646 - hh + 6 + k * 14 + 5, 12, '#b0602a', 'center', null));
    ctx.font = `bold 12px ${A.FONT}`;
    S.layoutWarn = { box: { x: 26, y: 646 - hh - 2, w: 348, h: hh }, lines: lines.map((l) => ctx.measureText(l).width), maxW: 324 };
  }
  drawButton(26, 652, 110, 48, 'Back', '#fff3e6'); button('back', 26, 650, 110, 54, () => go('map')); // v0.8.1 U8: the hit area is 54 tall (>= 44 dp on a 360x640 phone with a gesture inset)
  const ready = S.prep.deck.length === Math.min(C.BATTLE.deckSize, unlocked.length);
  drawButton(150, 652, 224, 48, 'Defend!', '#9fe0b5', { disabled: !ready, size: 22 });
  button('start', 150, 650, 224, 54, () => {
    if (!ready) toast(`Pick ${C.BATTLE.deckSize} cards`);
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
  if (S.antCard) renderAntCard(); // v0.8.1 U2: on top of everything; only the CTA closes it
}
// v0.8.1 U2: modal card - the hero sprite at 2.2x with the idle bob, name, rarity dots, the card text (wrapped, >= 12 px), a 44 px 'Got it' CTA. Only the CTA closes it.
function renderAntCard() {
  const t = S.antCard, D = C.ANTS[t]; if (!D) { S.antCard = null; return; }
  ctx.fillStyle = 'rgba(60,40,55,0.6)'; ctx.fillRect(-2000, -2000, W + 4000, H + 4000);
  button('antCardBlock', -2000, -2000, W + 4000, H + 4000, () => {}); // nothing underneath is tappable (not even the back-to-map button)
  const x0 = 36, w = 328, y0 = 150, h = 400; panel(x0, y0, w, h, '#fff6ee');
  A.drawChunkyText(ctx, 'New ant!', 200, y0 + 36, 28, { mode: 'title' });
  ctx.save(); ctx.translate(200, y0 + 150); const sz = Math.min(1, 1.3 / D.size); ctx.scale(2.2 * sz, 2.2 * sz); A.contactShadow(ctx, 0, 16, 22, 5, 0.22); A.heroBob(ctx, S.t, 0); A.drawAnt(ctx, t, (S.t * 1.3) % 1); ctx.restore();
  A.text(ctx, D.name, 200, y0 + 214, 20, '#7a4a5e');
  const rk = C.rarityRank(t) + 1, cols = ['#b9a8b0', '#5fbf7a', '#4a90e2', '#a05ad8'];
  if (rk <= 4) for (let q = 0; q < rk; q++) { ctx.beginPath(); ctx.arc(200 + (q - (rk - 1) / 2) * 12, y0 + 234, 4, 0, Math.PI * 2); ctx.fillStyle = cols[rk - 1]; ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(70,40,55,.55)'; ctx.stroke(); }
  const lines = wrapLines(C.ANT_CARD[t] || D.intro || '', w - 44, 14);
  lines.forEach((l, k) => A.text(ctx, l, 200, y0 + 262 + k * 19, 14, '#5a4652', 'center', null));
  drawButton(x0 + 64, y0 + h - 64, w - 128, 48, 'Got it', '#9fe0b5', { size: 20 }); button('antCardOk', x0 + 60, y0 + h - 68, w - 120, 56, antCardDone);
}
// v0.8.1 U6: tap a locked world's gate -> a card listing the lowest-star levels of the previous world first (numbers = meta.js counts)
function renderStarCard() {
  const c = S.starCard, W2 = C.WORLDS.find((x) => x.id === c.w); if (!W2) { S.starCard = null; return; }
  const prev = W2.unlock ? (W2.unlock.allLevelsWonInWorld ?? c.w - 1) : c.w - 1, need = W2.unlock ? W2.unlock.minStarsInWorld : 0;
  ctx.fillStyle = 'rgba(60,40,55,0.55)'; ctx.fillRect(-2000, -2000, W + 4000, H + 4000);
  button('starCardBlock', -2000, -2000, W + 4000, H + 4000, () => { S.starCard = null; });
  const rows = M.lowestStarLevels(S.save, c.w).slice(0, 5), x0 = 36, w = 328, h = 150 + Math.max(1, rows.length) * 26, y0 = Math.round(380 - h / 2); panel(x0, y0, w, h, '#fff6ee');
  A.text(ctx, `World ${c.w} needs ${need} stars`, 200, y0 + 30, 20, '#7a4a5e');
  plainText(`World ${prev}: ${M.worldStars(S.save, prev)} of ${need} so far`, 200, y0 + 56, 13, '#5a4652', 'center', '700');
  plainText('Best places to gain stars:', 200, y0 + 80, 13, '#7a6a76', 'center', '600');
  if (!rows.length) plainText('Every level is at 3 stars!', 200, y0 + 108, 13, '#5a4652', 'center', '600');
  rows.forEach((r, k) => plainFit(r.cleared ? `L${r.n}: ${r.stars} star${r.stars === 1 ? '' : 's'} - a ${r.stars + 1}${r.stars === 0 ? 'st' : r.stars === 1 ? 'nd' : 'rd'} star here adds +1` : `L${r.n}: not won yet - win it first`, 200, y0 + 108 + k * 26, w - 40, 13, '#3d2a36', 'center', '600'));
  drawButton(x0 + 84, y0 + h - 62, w - 168, 46, 'OK', '#9fe0b5', { size: 20 }); button('starCardOk', x0 + 80, y0 + h - 66, w - 160, 54, () => { S.starCard = null; sfx('tap'); });
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
  if (!S.bgCache[key]) S.bgCache[key] = A.renderMapBackground(b.routes, b.map.theme, MAP_W, MAP_H, pxRatio, b.props, b.map.art);
  return S.bgCache[key];
}
// v0.8.1 U1: step 1 = the first tray card ('Drag a card to a blue spot'), step 2 = the wave button ('Start the wave!'), step 3 = the existing crumb toast. A 44 px Skip pill stays on top.
function renderGuide(b) {
  if (S.guide.step === 1 && b.towers.length > 0) S.guide.step = 2;
  if (S.guide.step === 2 && b.nextWave > 0) { guideDone(); return; }
  const y0 = TRAY_Y, bub = { x: 100, y: MAP_Y + 8, w: 288 };
  if (S.guide.step === 1) {
    onboardSpot({ x: 12, y: y0 + TRAY.cardY, w: 88, h: TRAY.cardH, r: 14 }, 'guideCard', () => { S.sel = { kind: 'card', i: 0 }; S.info = null; sfx('tap'); }, 'Drag a card to a blue spot', bub, 0.34); // a lighter dim so the blue spots stay visible
    button('guideDrag', 9, y0 + 2, 94, TRAY.cardH + 8, () => { S.sel = { kind: 'card', i: 0 }; S.info = null; sfx('tap'); }, { onDown: (p) => { S.drag = { i: 0, x: p.x, y: p.y, moved: false }; } });
    button('map', 0, MAP_Y, MAP_W, MAP_H, mapTap); // a tap on a blue spot places the selected card (the drop of a drag works anywhere)
  } else {
    onboardSpot({ x: 296, y: y0 + TRAY.waveY, w: 92, h: TRAY.waveH, r: 14 }, 'wave', () => { if (b.callWaveEarly() > 0) sfx('return'); guideDone(); }, 'Start the wave!', bub);
  }
  drawButton(12, MAP_Y + 8, 80, 44, 'Skip', '#fff3e6', { size: 16, r: 18 }); button('guideSkip', 8, MAP_Y + 6, 88, 48, () => { guideDone(); sfx('tap'); });
}
// v0.8.2 G19: ambient motes (12 slow drifting specks per world: crumbs, flour, leaf bits, steam, dust, sugar); only while the measured render cost is under 10 ms, none in reduced motion
const MOTE_COL = ['#c9a074', '#ffffff', '#b9d99a', '#ffffff', '#eef7f7', '#fff4e0'], MOTE_N = 12;
function drawMotes(b, t) {
  if (reducedMotion() || (S.renderMs || 0) >= 10 || S.speed >= 4) return;
  const w = Math.min(5, C.worldOf(b.levelIndex) - 1), up = w === 3 ? -1 : 1; ctx.save(); ctx.fillStyle = MOTE_COL[w]; ctx.globalAlpha = 0.3;
  for (let i = 0; i < MOTE_N; i++) { const sp = 3 + (i % 4) * 1.5, x = (((i * 83.7 + t * (2 + (i % 3))) % MAP_W) + MAP_W) % MAP_W + Math.sin(t * 0.5 + i) * 6, y = MAP_Y + ((((i * 131.3 + t * sp * up) % MAP_H) + MAP_H) % MAP_H); ctx.beginPath(); ctx.arc(x, y, 1.3 + (i % 3) * 0.5, 0, 7); ctx.fill(); }
  ctx.restore();
}
function renderBattle(dt) {
  const b = S.battle; const t = S.t;
  // v0.8.1 J9: boss intro - when the queen first appears: a visual-only camera zoom 1.00 -> 1.04 -> 1.00 over 0.8 s (never dt / game speed), her name pill, a low tone
  if (C.ART81 && !S.queenIntro && C.isBossLevel(b.levelIndex) && !b.result) {
    const q = b.ants.find((a) => !a.dead && C.ANTS[a.type].boss);
    if (q) { S.queenIntro = { t0: S.t, type: q.type }; addUi({ k: 'queenPill', type: q.type, life: 2.0, max: 2.0 }); sfx('boss'); haptic('medium'); }
  }
  ctx.save();
  if (S.queenIntro && !reducedMotion()) { const zk = (S.t - S.queenIntro.t0) / 0.8; if (zk >= 0 && zk < 1) { const z = 1 + 0.04 * Math.sin(zk * Math.PI), cy = MAP_Y + MAP_H / 2; ctx.translate(200, cy); ctx.scale(z, z); ctx.translate(-200, -cy); } }
  // map frame
  ctx.save(); A.rr(ctx, -4, MAP_Y - 4, MAP_W + 8, MAP_H + 8, 10); ctx.fillStyle = A.INK; ctx.fill(); ctx.restore();
  ctx.drawImage(mapBg(b), 0, MAP_Y, MAP_W, MAP_H);
  drawTableLip();
  if (C.ART81) drawMotes(b, t); // v0.8.2 G19
  ctx.save(); ctx.beginPath(); ctx.rect(0, MAP_Y, MAP_W, MAP_H); ctx.clip();
  ctx.translate(0, MAP_Y);
  // nest + cookie
  const p1 = b.path.pts[b.path.pts.length - 1];
  const nests = []; for (const rt of b.routes) { const q = rt.pts[0]; if (!nests.some((n) => Math.hypot(n.x - q.x, n.y - q.y) < 5)) nests.push(q); }
  for (const q of nests) A.drawNest(ctx, Math.max(30, Math.min(MAP_W - 30, q.x)), Math.max(26, Math.min(MAP_H - 20, q.y + 6)), t);
  // placement highlights
  const selCard = S.drag ? S.drag.i : (S.sel && S.sel.kind === 'card' ? S.sel.i : (S.guide && S.guide.step === 1 ? 0 : null)); // v0.8.1 U1: the guide shows the blue spots
  if (selCard != null) {
    const card = b.picks[selCard];
    for (let c = 0; c < C.GRID_COLS; c++) for (let r = 0; r < C.GRID_ROWS; r++) {
      const chk = b.canPlay(selCard, c, r);
      if (!chk.ok) continue;
      if (chk.upgrade) { ctx.beginPath(); ctx.arc((c + 0.5) * C.TILE, (r + 0.5) * C.TILE, 19 + Math.sin(t * 6) * 2, 0, 7); ctx.lineWidth = 3; ctx.strokeStyle = '#ffd45e'; ctx.stroke(); }
      else { A.rr(ctx, c * C.TILE + 4, r * C.TILE + 4, C.TILE - 8, C.TILE - 8, 8); ctx.fillStyle = C.TOWERS[card].place === 'path' ? 'rgba(255,200,90,0.28)' : 'rgba(120,220,150,0.25)'; ctx.fill(); }
      if (C.ART81 && !chk.upgrade) { const pa = reducedMotion() ? 0.38 : 0.25 + 0.25 * (0.5 + 0.5 * Math.sin(t * Math.PI * 2)); A.rr(ctx, c * C.TILE + 4, r * C.TILE + 4, C.TILE - 8, C.TILE - 8, 8); ctx.lineWidth = 2; ctx.strokeStyle = `rgba(255,255,255,${pa})`; ctx.stroke(); } // v0.8.2 J15: placeable pads pulse (ring alpha .25 <-> .5, 1 Hz) only while a card is selected
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
  for (const q of S.swatQ) if (q.ghost) drawList.push({ y: q.y, f: () => drawAntObj(q.ghost, true) }); // v0.7.3: the swatted ant stays until the slap lands
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
  drawPieces(b);
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
  drawWaveStrip(b);
  ctx.restore();
  ctx.restore(); // v0.8.1 J9: end of the (optional) zoom
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
  if (S.guide && !S.paused && !S.result) renderGuide(b);
  if (S.specialBanner) { // v0.8.2 U11: the awakening banner (2.4 s with the fade, tap anywhere closes it via the normal flow - it never blocks input)
    const sb = S.specialBanner, k = S.t - sb.t0;
    if (S.t >= sb.until) S.specialBanner = null;
    else {
      const a = Math.min(1, k / 0.25, (sb.until - S.t) / 0.3); ctx.save(); ctx.globalAlpha = Math.max(0, a); const by = 112 + (1 - Math.min(1, k / 0.25)) * -14;
      panel(30, by, 340, 58, '#5a4058', 16);
      const pulse = reducedMotion() ? 0.8 : 0.65 + 0.25 * Math.sin(k * 8);
      ctx.beginPath(); ctx.arc(64, by + 29, 22, 0, 7); ctx.fillStyle = `rgba(255,210,74,${pulse})`; ctx.fill();
      ctx.save(); ctx.translate(64, by + 33); ctx.scale(0.5, 0.5); A.drawTower(ctx, sb.ids[0], S.t, null); ctx.restore();
      const T0 = C.TOWERS[sb.ids[0]];
      plainText('Picnic power!', 96, by + 19, 14, '#ffe39a', 'left', '800');
      plainFit(sb.ids.length === 1 ? `Your ${T0.name} learned ${T0.special.name}` : `${sb.ids.length} of your towers learned specials`, 96, by + 40, 266, 12, '#ffffff', 'left', '600');
      ctx.restore();
    }
  }
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
  plainText(str, x, y, fitSize(str, maxW, size, weight), col, align, weight);
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
// v0.7.4 M1: icons for the target modes (chip + tower badge): Weakest = a small ant, Carrier = a crumb, Healer = a red cross, Heavy = a crown
function drawModeIcon(m, x, y, k) {
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  if (m === 'carrier') A.crumbIcon(ctx, 0, 0, 1.0, true);
  else if (m === 'healer') { // the nurse's red cross on a cream disc
    ctx.beginPath(); ctx.arc(0, 0, 7.2, 0, 7); ctx.fillStyle = '#fffaf5'; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = A.CRUMB_OUTLINE; ctx.stroke();
    ctx.fillStyle = '#e8454f'; ctx.fillRect(-1.9, -5, 3.8, 10); ctx.fillRect(-5, -1.9, 10, 3.8);
  } else if (m === 'strong') { // the queen's crown
    ctx.beginPath(); ctx.moveTo(-7.5, 5); ctx.lineTo(-8.5, -4.5); ctx.lineTo(-4, -0.8); ctx.lineTo(0, -6); ctx.lineTo(4, -0.8); ctx.lineTo(8.5, -4.5); ctx.lineTo(7.5, 5); ctx.closePath();
    ctx.fillStyle = '#ffcf4a'; ctx.fill(); ctx.lineWidth = 1.5; ctx.lineJoin = 'round'; ctx.strokeStyle = A.CRUMB_OUTLINE; ctx.stroke();
  } else {
    ctx.fillStyle = '#7a4a2a'; ctx.strokeStyle = A.CRUMB_OUTLINE; ctx.lineWidth = 1.4;
    for (const [cx, cy, r] of [[-5, 0, 3.4], [0.5, 0, 2.7], [5.5, 0, 3.2]]) { ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill(); ctx.stroke(); }
    ctx.strokeStyle = '#7a4a2a'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-6, 3); ctx.lineTo(-7, 6); ctx.moveTo(0, 3); ctx.lineTo(0, 6); ctx.moveTo(6, 3); ctx.lineTo(7, 6); ctx.stroke();
  }
  ctx.restore();
}
// v0.7.4 M3: the wave preview strip (next wave's ants, between waves) / 'Ants left: N' (after the last wave started), in the free band at the top of the map.
// Display only: no button, taps fall through to the tiles under it. Hidden while a card is held / dragged, a tower panel or the Move/Swap banner is up (they use that area).
let stripLast = null; // test hook: what was drawn last frame { rect, kind, ... }
let stripNoRoom = false, hudPreviewLast = null, stripX = null, stripAt = 0; // v0.7.5: no free span for the strip this frame -> the HUD shows a compact preview; stripX eases the strip sideways
// v0.7.4 M2: a dropped crumb to tap: bouncing crumb, a pulsing ring, and a timer ring that shrinks over its `window` (blinks at 1 s left); reduced motion: no bounce
function drawPieces(b) {
  if (!b.pieces.length) return;
  const rm = reducedMotion();
  for (const q of b.pieces) {
    const frac = Math.max(0, q.left / q.total), blink = q.left <= 1 && Math.floor(S.t * 8) % 2 === 0;
    const bounce = rm ? 0 : Math.abs(Math.sin(S.t * 6 + q.id)) * 5;
    ctx.save(); ctx.translate(q.x, q.y);
    ctx.beginPath(); ctx.ellipse(0, 6, 9, 3, 0, 0, 7); ctx.fillStyle = 'rgba(60,40,50,0.25)'; ctx.fill();
    const pr = 17 + (rm ? 0 : Math.sin(S.t * 5) * 2.5);
    ctx.beginPath(); ctx.arc(0, -2, pr, 0, 7); ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.stroke();
    ctx.beginPath(); ctx.arc(0, -2, 14, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * frac); ctx.lineWidth = 3.4; ctx.lineCap = 'round'; ctx.strokeStyle = blink ? '#ff5a5a' : '#ffd45e'; ctx.stroke();
    A.crumbIcon(ctx, 0, -4 - bounce, 1.35, true);
    if (q.bonus >= 0.05) A.text(ctx, '+' + fmtFood(q.bonus), 0, -24 - bounce * 0.5, 12, '#fff7c9');
    ctx.restore();
  }
}
function drawWaveStrip(b) {
  stripLast = null; stripNoRoom = false;
  if (S.info || S.mode || S.drag || (S.sel && S.sel.kind === 'card')) { stripX = null; return; }
  const m = previewModel(b); if (!m) { stripX = null; return; }
  let groups = m.groups, more = m.moreAnts;
  const widthOf = (gs, mo) => { // measured with the strip's own fonts
    ctx.font = `bold 12px ${A.FONT}`;
    return 12 + gs.reduce((w, g) => w + 18 + 2 + ctx.measureText('x' + g.count).width + 6, 0) + (mo ? ctx.measureText('+' + mo).width + 4 : 0);
  };
  let label = null, w;
  if (m.kind === 'left') { label = `Ants left: ${m.left}`; ctx.font = `bold 12px ${A.FONT}`; w = ctx.measureText(label).width + 22; }
  else w = widthOf(groups, more);
  let rect = stripRect(b, w);
  if (rect && m.kind === 'next') while (rect.w < w - 0.5 && groups.length > 1) { // too narrow here: fewer types, the rest become +n
    const g = groups[groups.length - 1]; groups = groups.slice(0, -1); more += g.count; w = widthOf(groups, more); rect = stripRect(b, w);
  }
  if (!rect) { stripX = null; stripNoRoom = m.kind === 'next'; return; } // v0.7.5: nothing fits (towers / trail / nests / cookie) -> hidden; the HUD shows the compact preview
  stripLast = { rect, kind: m.kind, n: m.n, groups, more, left: m.left };
  // v0.7.5 (review finding 1): when the free span moves (a tower was built under it) the strip eases sideways over ~150 ms instead of jumping (reduced motion: snaps)
  const dtS = Math.min(0.1, Math.max(0, S.t - stripAt)); stripAt = S.t;
  if (stripX == null || reducedMotion() || Math.abs(stripX - rect.x) < 0.5) stripX = rect.x; else stripX += (rect.x - stripX) * Math.min(1, dtS / 0.15 * 1.0);
  ctx.save(); ctx.translate(stripX, rect.y);
  A.rr(ctx, 0, 0, rect.w, STRIP_H, STRIP_H / 2); ctx.fillStyle = 'rgba(255,246,238,0.96)'; ctx.fill();
  ctx.fillStyle = 'rgba(120,80,95,0.14)'; A.rr(ctx, 7, STRIP_H - 5, rect.w - 14, 2, 1); ctx.fill(); // 2 px bottom lip (v0.7.5 C18)
  A.rr(ctx, 0, 0, rect.w, STRIP_H, STRIP_H / 2); ctx.lineWidth = 2.5; ctx.strokeStyle = A.INK; ctx.stroke();
  if (label) A.text(ctx, label, rect.w / 2, STRIP_H / 2 + 0.5, 12, '#c0392b', 'center', null);
  else {
    let x = 8;
    for (const g of groups) { x = drawStripGroup(g, x, STRIP_H / 2, 18, 9); }
    if (more) A.text(ctx, '+' + more, x - 2, STRIP_H / 2 + 0.5, 12, '#8a7080', 'left', null);
  }
  ctx.restore();
}
// one ant icon (head and shoulders in a circle, the tank ring, the flyer wing) + its count; returns the next x. `d` = icon diameter
function drawStripGroup(g, x, cy, d, rad) {
  const spr = A.antSprite(g.type, 0, false, pxRatio), k = C.ANTS[g.type].size, cx = x + rad;
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, rad, 0, 7); ctx.clip();
  const sw = 44 * k, sh = 40 * k; // the ant's head and shoulders (the sprite is drawn facing right; its origin is the body centre)
  ctx.drawImage(spr.cv, (spr.ox - 24 * k) * pxRatio, (spr.oy - 28 * k) * pxRatio, sw * pxRatio, sh * pxRatio, cx - rad, cy - rad, d, d);
  ctx.restore();
  if (isTank(g.type)) { ctx.beginPath(); ctx.arc(cx, cy, rad, 0, 7); ctx.lineWidth = 1.8; ctx.strokeStyle = '#c0392b'; ctx.stroke(); }
  if (isFlyer(g.type)) { ctx.beginPath(); ctx.ellipse(cx + rad * 0.78, cy - rad * 0.9, rad * 0.55, rad * 0.27, -0.5, 0, 7); ctx.fillStyle = 'rgba(205,235,255,0.95)'; ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = A.INK; ctx.stroke(); }
  A.text(ctx, 'x' + g.count, x + d + 2, cy + 0.5, 12, A.INK, 'left', null);
  ctx.font = `bold 12px ${A.FONT}`; return x + d + 2 + ctx.measureText('x' + g.count).width + 6;
}
// v0.7.5 Should #10: the compact preview in the HUD's 'Lv N' slot (x 148-218, below 'Wave n/m'): shown only while the strip has no room. 16 px icons, as many types as fit 70 px, the rest = +n. Returns true when drawn
function drawHudPreview(b) {
  const m = previewModel(b); if (!m || m.kind !== 'next') return false;
  const gs = m.groups.slice(0, 3); let more = m.moreAnts + m.groups.slice(3).reduce((a, g) => a + g.count, 0);
  const wOf = (arr, mo) => { ctx.font = `bold 12px ${A.FONT}`; return arr.reduce((t, g) => t + 16 + 2 + ctx.measureText('x' + g.count).width + 5, -5) + (mo ? 5 + ctx.measureText('+' + mo).width : 0); };
  let use = gs.slice(); while (use.length > 1 && wOf(use, more) > 72) { more += use.pop().count; }
  const wd = wOf(use, more); let x = 184 - wd / 2;
  for (const g of use) x = drawStripGroup(g, x, 46, 16, 8) - 1;
  if (more) A.text(ctx, '+' + more, x - 4, 46.5, 12, '#8a7080', 'left', null);
  hudPreviewLast = { groups: use, more, w: wd };
  return true;
}
function renderTowerInfo(b, info) {
  const tw = info.tower; const T = C.TOWERS[tw.type];
  if (info.until && S.t > info.until) { if (info.auto) { S.info = null; return; } info.changed = null; }
  const modes = hasTargetModes(tw.type), H2 = modes ? 176 : 140, py = tw.y + MAP_Y > 300 ? MAP_Y + 8 : MAP_Y + MAP_H - H2 - 8;
  S.layoutInfo = { x: 14, y: py, w: 372, h: H2 };
  panel(14, py, 372, H2, '#fffaf5', 14);
  // v0.7.6 V3: the Lv text keeps 12 px; the title shrinks (never below 12) to leave it room
  const lvStr = `Lv ${tw.lvl}/${b.cfg.maxInBattleLevel} \u00b7 card L${tw.cardLevel}`; ctx.font = `600 12px ${A.FONT}`; const lvW = ctx.measureText(lvStr).width;
  const titleMax = Math.min(150, 222 - lvW - 8); ctx.font = `bold 15px ${A.FONT}`; const tW = Math.min(titleMax, ctx.measureText(T.name).width);
  fitText(T.name, 26 + tW / 2, py + 17, titleMax, 15, '#ff8fab'); // title stays bold
  plainText(lvStr, 34 + tW, py + 17, 12, INFO_SOFT, 'left', '600');
  let desc = T.ability || T.desc;
  if (modes && tw.mode && C.TARGET_MODE_TEXT[tw.type] && C.TARGET_MODE_TEXT[tw.type][tw.mode]) desc = C.TARGET_MODE_TEXT[tw.type][tw.mode]; // v0.7.5 (review finding 3): the text follows the selected mode
  if (T.directional && !tw.trailDir) desc = tw.type === 'ball' ? 'No trail right next to it - the marble cannot roll here. Move it!' : tw.type === 'tractor' ? 'No trail right next to it - nothing to scoop here. Move it!' : 'No trail right next to it - no wind here. Move it!';
  plainWrap(desc, 346, 12.5).slice(0, 2).forEach((l, i) => plainText(l, 26, py + 38 + i * 16, 12.5, T.directional && !tw.trailDir ? '#c0392b' : INFO_INK));
  const keys = tw.type === 'tractor' ? ['liftSize', 'rate', 'scoop'] : ['power', 'rate', tw.type === 'ball' ? 'roll' : 'range'];
  const changed = new Set((info.changed || []).map((d) => d.key));
  keys.forEach((k, i) => {
    const x = 22 + i * 120, y = py + 66, w = 114, h = 38;
    const on = changed.has(k);
    A.rr(ctx, x, y, w, h, 10); ctx.fillStyle = on ? '#e2f8dc' : '#f7efeb'; ctx.fill(); ctx.lineWidth = on ? 2.4 : 1.2; ctx.strokeStyle = on ? '#55b85a' : '#e0cfd4'; ctx.stroke();
    plainFit(k === 'roll' ? 'Roll here' : k === 'scoop' ? 'Scoop' : statLabel(tw.type, k), x + 8, y + 11, w - 14, 12, INFO_SOFT);
    const d = (info.changed || []).find((q) => q.key === k);
    const val = k === 'roll' ? rollHere(tw) : k === 'scoop' ? (tw.trailDir ? 'trail tile beside it' : 'no trail') : d ? `${formatStat(tw.type, k, d.from)} \u2192 ${formatStat(tw.type, k, d.to)}` : formatStat(tw.type, k, tw.stat(k));
    plainFit(val, x + w / 2, y + 27, w - 12, 14, on ? '#2f8a36' : INFO_INK, 'center', '600');
  });
  const extra = (info.changed || []).filter((d) => !keys.includes(d.key));
  let line;
  if (extra.length) line = 'Upgraded: ' + extra.map((d) => diffText(tw.type, d)).join(', ');
  else if (tw.lvl < b.cfg.maxInBattleLevel) line = (dmgGainText(tw.type, tw.lvl + 1, tw.cardLevel) ? dmgGainText(tw.type, tw.lvl + 1, tw.cardLevel) + '! ' : '') + 'Next (drop same card): ' + upgradeDiff(tw.type, tw.lvl, tw.cardLevel).map((d) => diffText(tw.type, d)).join(', ');
  else line = 'Max level!';
  { const ls = plainWrap(line, 350, 12).slice(0, 2), y0 = py + (modes ? 160 : 122) - (ls.length > 1 ? 8 : 0); // v0.7.6 V3: a long line wraps to 2 lines at 12 px instead of shrinking
    ls.forEach((l, i) => plainText(l, 200, y0 + i * 15, 12, extra.length ? '#2f8a36' : INFO_INK, 'center')); }
  button('infoClose', 14, py, 372, H2, () => { S.info = null; }); // registered after 'map' so it is on top (tapping the panel = the player's own close)
  if (modes) { // v0.7.4 M1: who this tower shoots - three chips under the stat boxes (tap = select). v0.7.5 C18: 34 px tall, a visible 1.5 px outline when inactive, a 120 ms pop on change
    const ML = S.battle.modeList, n4 = ML.length > 3; // v0.8.1 U5: <= 4 chips; 4 chips are 84 x 34 (label over 52 px), <= 3 keep the roomy 114 x 34
    ML.forEach((m, i) => {
      const w = n4 ? 84 : 114, h = 34, x = 22 + i * (w + 6), y = py + 108, on = (tw.mode || 'weak') === m;
      const age = S.t - (tw._modeAt ?? -9), pop = on && age >= 0 && age < 0.12 && !reducedMotion() ? 1 + 0.08 * Math.sin(age / 0.12 * Math.PI) : 1;
      ctx.save(); if (pop !== 1) { ctx.translate(x + w / 2, y + h / 2); ctx.scale(pop, pop); ctx.translate(-(x + w / 2), -(y + h / 2)); }
      A.rr(ctx, x, y, w, h, 11); ctx.fillStyle = on ? '#ffd27a' : '#f7efeb'; ctx.fill(); ctx.lineWidth = on ? 2.6 : 1.5; ctx.strokeStyle = on ? A.INK : '#d9c5cc'; ctx.stroke();
      drawModeIcon(m, x + (n4 ? 14 : 18), y + h / 2, 1);
      plainFit(MODE_NAME[m], x + (n4 ? 28 : 34), y + h / 2 + 0.5, w - (n4 ? 32 : 40), 13, on ? A.INK : INFO_INK, 'left', on ? '700' : '600');
      ctx.restore();
      button('mode_' + m, x - 2, y - 5.5, w + 4, h + 11, () => setMode(tw, m)); // hit area 45 logical = >= 44 css px at 393 wide (F8)
    });
  }
  // Move / Swap (on top of the panel's close area)
  const canMove = (S.save.diamonds || 0) >= C.ECONOMY.diamonds.moveTower;
  drawButton(256, py + 5, 62, 24, '', '#9fd8ff', { r: 10, disabled: !canMove });
  A.text(ctx, 'Move', 280, py + 17, 12); A.diamondIcon(ctx, 305, py + 17, 0.55); A.text(ctx, String(C.ECONOMY.diamonds.moveTower), 312, py + 17.5, 12);
  drawButton(322, py + 5, 58, 24, 'Swap', '#fff3e6', { r: 10, size: 12, disabled: b.towers.length < 2 });
  button('infoMove', 252, py - 2, 68, 44, () => startMode('move', tw));
  button('infoSwap', 320, py - 2, 64, 44, () => startMode('swap', tw));
}
// v0.5 item 16: the queen is beaten -> fireworks + the cheer
function drawQueenCheer(age, world) {
  const k = Math.min(1, age / 0.35), fade = age > 3.8 ? Math.max(0, 1 - (age - 3.8) / 0.7) : 1;
  const msg = world === 6 ? ['Way to go,', 'you saved the pancakes!'] : world === 5 ? ['Way to go,', 'you saved the donut!'] : world === 4 ? ['Way to go,', 'you saved the sundae!'] : world === 3 ? ['Way to go,', 'you saved the pie!'] : world === 2 ? ['Way to go,', 'you saved the cake!'] : ['Way to go,', 'you saved the cookies!'];
  ctx.save(); ctx.globalAlpha = fade; ctx.translate(200, MAP_Y + 210); const sc = 0.6 + 0.4 * k + Math.sin(age * 5) * 0.03; ctx.scale(sc, sc);
  A.rr(ctx, -170, -48, 340, 96, 24); ctx.fillStyle = 'rgba(90,64,88,0.82)'; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = '#ffd45e'; ctx.stroke();
  A.text(ctx, msg[0], 0, -18, 26, '#ffe36e'); A.text(ctx, msg[1], 0, 16, 24, '#ffffff');
  for (const [ax, ty, sg] of [[-146, 'worker', 1], [146, 'small', -1]]) { // v0.8.0 (spec CF-B5, Option A): the hero cheer pose appears on defeat and here
    const sp = A.antSprite(ty, 0, false, pxRatio * 1.2, 'cheer'), hop = reducedMotion() ? 0 : Math.abs(Math.sin(age * 6 + (sg > 0 ? 0 : 1.3))) * 6;
    ctx.save(); ctx.translate(ax, -34 - hop); ctx.scale(1.2 * sg, 1.2); ctx.drawImage(sp.cv, -sp.ox, -sp.oy, sp.w, sp.h); ctx.restore();
  }
  ctx.restore();
}
// v0.7.6 V3: fitText / plainFit never draw below MIN_FONT (12 px); a string that does not fit at 12 must be wrapped, shortened or given more room by the caller
const MIN_FONT = 12;
function fitSize(str, maxW, size, weight) {
  ctx.font = `${weight} ${size}px ${A.FONT}`; const w = ctx.measureText(str).width; if (w <= maxW) return size;
  const s = size * maxW / w; if (__TEST_HOOKS__ && s < MIN_FONT - 0.01) (window.__fitOver ||= []).push([str, +maxW.toFixed(1), +(w * MIN_FONT / size).toFixed(1)]);
  return Math.max(MIN_FONT, s);
}
function fitText(str, x, y, maxW, size, col) {
  A.text(ctx, str, x, y, fitSize(str, maxW, size, 'bold'), col);
}
function wrapText(s, x, y, maxW, size, col) {
  ctx.font = `bold ${size}px ${A.FONT}`; const words = s.split(' '); let line = '', yy = y;
  for (const w of words) { const test = line ? line + ' ' + w : w; if (ctx.measureText(test).width > maxW) { A.text(ctx, line, x, yy, size, col, 'left', null); line = w; yy += size + 3.5; } else line = test; }
  if (line) A.text(ctx, line, x, yy, size, col, 'left', null);
}
function drawTowerObj(tw) {
  ctx.save(); ctx.translate(tw.x, tw.y);
  const age = S.battle.time - (tw.born ?? (tw.born = S.battle.time));
  if (C.ART81) { // v0.8.2 J13: scale 0.6 -> 1.12 -> 1.0 in 180 ms (reduced motion: the scale-in only)
    if (age < 0.18) { const k = age / 0.18, sc = k < 0.6 ? 0.6 + 0.52 * (k / 0.6) : 1.12 - 0.12 * ((k - 0.6) / 0.4); ctx.scale(sc, sc); }
  } else if (reducedMotion()) { /* no pop in reduced motion */ }
  else if (age < 0.26) { // v0.8.0 (spec s12): placed = squash (1.22, 0.78) -> (0.95, 1.06) -> 1 over 260 ms (v0.7.5 was 1.15/0.85 over 220 ms)
    const k = age / 0.26, a = k < 0.4 ? k / 0.4 : (k - 0.4) / 0.6, sx = k < 0.4 ? 1.22 + (0.95 - 1.22) * a : 0.95 + 0.05 * a, sy = k < 0.4 ? 0.78 + (1.06 - 0.78) * a : 1.06 - 0.06 * a;
    ctx.scale(sx, sy);
  }
  if (C.TOWERS[tw.type].place === 'path') ctx.translate(tw.px - tw.x, tw.py - tw.y);
  const uk = tw._upAt !== undefined ? (S.t - tw._upAt) / 0.22 : 2; A.MOTION.hop = uk >= 0 && uk < 1 ? 6 * Math.sin(uk * Math.PI) : 0; // v0.8.1 J6: upgrade hop (body only)
  if (C.ART81 && S.battle && S.battle.specialsOn && C.specialActive(tw, S.battle.level)) { // v0.8.2 M7g: a gold ring under the base marks an active special (never on W1-W5)
    const pa = reducedMotion() ? 0.8 : 0.75 + 0.15 * Math.sin(S.t * Math.PI * 2); ctx.save(); ctx.beginPath(); ctx.ellipse(0, 11, 21, 8.5, 0, 0, 7); ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(82,60,75,' + pa + ')'; ctx.stroke(); ctx.lineWidth = 2; ctx.strokeStyle = `rgba(255,210,74,${pa})`; ctx.stroke(); ctx.restore();
  }
  A.MOTION.bobTowers = true; A.drawTower(ctx, tw.type, S.t + tw.id, tw); A.MOTION.bobTowers = false; A.MOTION.hop = 0; // v0.8.1 G6: only placed towers bob (the ghost / icons call drawTower directly)
  // level pips
  if (tw.mode && tw.mode !== 'weak') { // v0.7.4 M1: a 10 px badge on the tower's base shows a non-default target mode (crumb = Carrier, arrow = Front)
    const bage = S.t - (tw._modeAt ?? -9), bp = bage >= 0 && bage < 0.5 && !reducedMotion() ? 1 + 0.35 * Math.sin(Math.min(1, bage / 0.5) * Math.PI) : 1; // 0.5 s pop on a change
    ctx.save(); ctx.translate(14, 13); ctx.scale(bp, bp);
    ctx.beginPath(); ctx.arc(0, 0, 8, 0, 7); ctx.fillStyle = '#fffaf5'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = A.INK; ctx.stroke(); // v0.7.5 C18: 12+ px cream disc, INK 2.0
    drawModeIcon(tw.mode, 0, 0, 0.55); ctx.restore();
  }
  if (tw.lvl > 1) { // v0.8.4 G12: up to 5 stars above the tower. Level 6 adds a crown dot. The new star eases from 1.6 to 1 in 120 ms.
    const n = Math.min(5, tw.lvl);
    for (let k = 0; k < n; k++) {
      let ps = 1;
      if (C.ART81 && k === n - 1 && tw._upAt !== undefined && !reducedMotion()) { const pk = (S.t - tw._upAt) / 0.12; if (pk >= 0 && pk < 1) ps = 1.6 - 0.6 * pk; else if (pk < 0) ps = 1; }
      const ang = (k - (n - 1) / 2) * 0.45;
      A.starShape(ctx, Math.sin(ang) * 18, -28 - Math.cos(ang) * 6, 5 * ps, '#ffd24a', 1);
    }
    if (tw.lvl >= 6) { ctx.beginPath(); ctx.arc(0, -40, 2.4, 0, 7); ctx.fillStyle = '#ffd24a'; ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = A.INK; ctx.stroke(); }
  }
  ctx.restore();
}
// v0.7.2 C13: the cookie guard. Leans on the right of the cookie; a swat is wind-up 0.10 s, slap 0.08 s, hold 0.06 s, return 0.26 s (0.5 s).
function drawGuard(b, ck) {
  const px = ck.x + C.UI.swatPivot.dx, py = ck.y + C.UI.swatPivot.dy, rest = -0.2;
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
// v0.7.9: the Nurse's readiness cues (shape + motion, never colour alone): a dashed ready ring over her heal radius while she is READY and a hurt friend is in range,
// and a cooldown arc under her feet while she recharges (a full circle outline + a growing arc; grey + a snowflake-free pause bar when frozen).
function drawNurseHud(a, H, x, y, frozen) {
  const b = S.battle, R = H.radius * C.TILE, sz = a.size || 1;
  if (a.healCd > 0 || frozen) {
    const k = 1 - Math.max(0, a.healCd) / H.every, cy = y + 13 * sz, rad = 7.5;
    ctx.save(); ctx.lineWidth = 3.4; ctx.strokeStyle = A.INK; ctx.beginPath(); ctx.arc(x, cy, rad, 0, 7); ctx.stroke();
    ctx.lineWidth = 1.8; ctx.strokeStyle = 'rgba(255,255,255,0.45)'; ctx.beginPath(); ctx.arc(x, cy, rad, 0, 7); ctx.stroke();
    ctx.strokeStyle = frozen ? '#9fb2c8' : '#ff8fb0'; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(x, cy, rad, -Math.PI / 2, -Math.PI / 2 + k * Math.PI * 2); ctx.stroke();
    if (frozen) { ctx.fillStyle = A.INK; ctx.fillRect(x - 3, cy - 3, 2.2, 6); ctx.fillRect(x + 0.8, cy - 3, 2.2, 6); } // pause bars = "frozen, not charging"
    ctx.restore();
    return;
  }
  let hurt = false;
  for (const o of b.ants) { if (o === a || o.dead || o.hp >= o.maxHp - 1e-6 || C.ANTS[o.type].heal) continue; if (Math.hypot(o.x - a.x, o.y - a.y) <= R) { hurt = true; break; } }
  if (!hurt) return;
  ctx.save(); ctx.lineWidth = 2.4; ctx.strokeStyle = 'rgba(255,255,255,0.95)'; ctx.setLineDash([5, 5]); ctx.lineDashOffset = reducedMotion() ? 0 : -S.t * 14;
  ctx.beginPath(); ctx.arc(x, y + 2, R, 0, 7); ctx.stroke(); ctx.setLineDash([]); ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(255,90,126,0.9)'; ctx.beginPath(); ctx.arc(x, y + 2, R - 2.6, 0, 7); ctx.stroke(); ctx.restore();
}
// v0.8.1 U4: Glazed shield = a glass-dome ring (INK 1.5 px + white 1 px) while shield > 0, a 2 px ice bar above the hp bar, a 2 Hz pulse while it regrows.
// No gradients, no shadowBlur: strokes only. Reduced motion = a static dome (no pulse, no flash).
function drawShield(a, x, y) {
  const sz = a.size, f = Math.max(0, Math.min(1, a.shield / a.shieldMax)), rm = reducedMotion(), sh = C.ANTS[a.type].shield;
  const regen = a.shield < a.shieldMax && a.shieldT >= sh.regenDelay;
  const pulse = !rm && regen ? 0.5 + 0.5 * Math.sin(S.t * Math.PI * 4) : 0; // 2 Hz
  const flash = !rm && a._shieldFlash > S.t ? (a._shieldFlash - S.t) / 0.25 : 0;
  if (a.shield > 0) {
    const rx = 17 * sz, ry = 21 * sz, cy = y - 6 * sz;
    ctx.save(); ctx.globalAlpha = 0.55 + 0.4 * f - 0.25 * pulse + 0.3 * flash; ctx.globalAlpha = Math.min(1, ctx.globalAlpha);
    ctx.beginPath(); ctx.ellipse(x, cy, rx, ry, 0, 0, Math.PI * 2); ctx.lineWidth = 1.5 + 0.5 * flash; ctx.strokeStyle = A.INK; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(x, cy, rx - 1.1, ry - 1.1, 0, 0, Math.PI * 2); ctx.lineWidth = 1; ctx.strokeStyle = '#ffffff'; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(x, cy, rx - 3, ry - 3, 0, Math.PI * 1.08, Math.PI * 1.42); ctx.lineWidth = 1.6; ctx.strokeStyle = '#ffffff'; ctx.stroke(); // upper-left glint (light direction)
    ctx.restore();
  }
  if (a.shield < a.shieldMax) { // the bar only while it is hurt or regrowing (a full dome alone is the 'armoured' read)
    const w = a.type === 'queen5' || a.type === 'queen6' ? 60 : 22, hy = y - (a.flying ? 44 : 33) * sz - 4;
    A.rr(ctx, x - w / 2 - 1, hy - 1, w + 2, 4, 2); ctx.fillStyle = A.INK; ctx.fill();
    if (f > 0) { A.rr(ctx, x - w / 2, hy, Math.max(2, w * f), 2, 1); ctx.fillStyle = pulse > 0.5 ? '#ffffff' : '#a8e4ff'; ctx.fill(); }
  }
}
function drawAntObj(a, ghost = false) {
  const b = S.battle;
  const frozen = b.time < b.freezeUntil;
  const p = b.route(a).at(a.d);
  if (Math.abs(p.dx) > 0.3) a._face = (p.dx * (a.dir || 1)) >= 0 ? 1 : -1;
  const face = a._face ?? 1;
  const speedK = a.type === 'small' ? 2.2 : a.type === 'sprinter' ? 2.4 : a.type === 'queen' ? 0.6 : a.type === 'big' ? 1 : a.type === 'heavy' ? 0.9 : 1.5;
  // walk cycle while moving; idle breathing (frame 0 + gentle squash) while stuck, staggered or frozen
  const still = frozen || a.stunT > 0;
  const fr = still ? 0 : Math.floor(((b.time + a.id * 0.37) * speedK * A.ANT_FRAMES)) % A.ANT_FRAMES;
  const H = C.ANTS[a.type].heal, spent = !!H && (frozen || a.healCd > 0); // v0.7.9: a recharging / frozen nurse wears the grey cap
  const mood = spent ? 'g' : (a.hitFlash > 0.02 && !reducedMotion()) ? 'h' : a.stunT > 0 ? 'd' : ''; // v0.8.0: hurt face (> <) on a hit, dizzy face while stunned (baked lazily per type/frame)
  const droneFx = C.ART81 && a.type === 'drone' && !reducedMotion() && !still; // v0.8.3 PP3: a Drone's wings flutter between two poses at 14 Hz and it hovers +-2 px at 1.6 Hz (reduced motion: still pose)
  const vary = a.type === 'worker' || a.type === 'small' || a.type === 'flyer'; // v0.8.4 G14: hue and size only on these three. Queens, the shield bearer, and status types stay fixed.
  const hue = vary ? ((a.id * 17) % 13) - 6 : 0;
  const jit = vary ? 0.97 + ((a.id * 13) % 6) * 0.02 : 1;
  const spr = A.antSprite(a.type, droneFx ? (Math.floor((b.time + a.id * 0.037) * 14) % 2 ? 3 : 9) : fr, a.carrying > 0, pxRatio, mood, { play: true, hue });
  const breathe = still ? 1 + Math.sin(S.t * 5 + a.id) * 0.035 : 1;
  // tiny lateral offset per id so crowds don't stack perfectly
  let lat = ((a.id * 37) % 9 - 4) * 1.2;
  if (a.state === 'back') lat = C.UI.carrierLane + lat * 0.4; // v0.7.4 P: returning carriers ride ~5 px to one side of the lane so they separate from inbound ants
  const x = a.x + p.dy * lat, y = a.y - p.dx * lat;
  let hopY = 0, hopS = 1; if (a._hopT && !reducedMotion()) { const hk = (S.t - a._hopT) / 0.24; if (hk >= 0 && hk < 1) { hopY = -Math.sin(hk * Math.PI) * 4; hopS = 1 + 0.1 * Math.sin(hk * Math.PI * 2) * (1 - hk); } } // v0.7.10 cookie-pause hop
  let gsx = 1, gsy = 1; if (a._grabT && !reducedMotion()) { const gk = (S.t - a._grabT) / 0.08; if (gk >= 0 && gk < 1) { const q = Math.sin(gk * Math.PI); gsx = 1 + 0.12 * q; gsy = 1 - 0.12 * q; } } // v0.8.1 J3: grab squash 1.12 / .88 over 80 ms
  if (droneFx) hopY += Math.sin((b.time + a.id * 0.7) * Math.PI * 2 * 1.6) * 2;
  ctx.save(); ctx.translate(x, y + 4 + hopY); ctx.scale(face / breathe * gsx * jit, breathe * hopS * gsy * jit);
  if (C.ART81) { // v0.8.2 G13: 80 ms hit squash (scaleX 1.08 / scaleY 0.88); a 2nd-Nth hit within 120 ms does not restart it; none with more than 25 ants on screen or under reduced motion
    if (a.hitFlash > 0.05 && !(S.t - (a._sqT ?? -9) < 0.12) && b.ants.length <= 25 && !reducedMotion()) a._sqT = S.t;
    const sk = (S.t - (a._sqT ?? -9)) / 0.08; if (sk >= 0 && sk < 1) { const q = (1 - sk) * (1 - sk); ctx.scale(1 + 0.08 * q, 1 - 0.12 * q); }
  } else if (a.hitFlash > 0 && !reducedMotion()) { const q = Math.min(1, a.hitFlash / 0.12), sq = 0.12 * q * q; ctx.scale(1 + sq, 1 - sq); } // v0.7.5 juice: hit squash (1.12, 0.88) easing out over 120 ms (easeOutQuad)
  ctx.drawImage(spr.cv, -spr.ox, -spr.oy, spr.w, spr.h);
  if (a.hitFlash > 0.04) { ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.6; ctx.drawImage(spr.cv, -spr.ox, -spr.oy, spr.w, spr.h); } // hit flash: white-add 0.6 for the first 80 ms
  if (a._healFlash > S.t && !ghost) { ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = reducedMotion() ? 0.35 : 0.55 * Math.min(1, (a._healFlash - S.t) / 0.2); ctx.drawImage(spr.cv, -spr.ox, -spr.oy, spr.w, spr.h); } // v0.7.9: white flash on a healed ant
  ctx.restore();
  if (C.ART81 && (a.type === 'queen6' || a.type === 'queen7') && !ghost && !frozen && a.spawnT > 0 && a.spawnT <= 0.4) {
    const jam = a.type === 'queen7', q = 1 - a.spawnT / 0.4, q4 = reducedMotion() ? 1 : (Math.min(3, Math.floor(q * 4)) + 1) / 4;
    const dx0 = x - 20 * a.size * face, dy0 = y + 10 + (reducedMotion() ? 6 : q4 * q4 * 26);
    const rx = reducedMotion() ? 6 : 4.2 * (1 + q4 * 0.7) * 1.7, ry = reducedMotion() ? 6 : 5.6 * (1 + q4 * 0.7) * 1.7;
    ctx.save(); ctx.beginPath(); ctx.ellipse(dx0, dy0, rx, ry, 0, 0, 7); ctx.fillStyle = jam ? '#c45ad0' : '#e8a33d'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = jam ? '#8a3a96' : '#b56a18'; ctx.stroke(); ctx.restore();
  }
  if (a._bubbleUntil > S.t && !ghost && !reducedMotion()) { const bx = x, by = y - 40 * a.size - Math.abs(Math.sin(S.t * 6)) * 2; ctx.save(); ctx.beginPath(); ctx.arc(bx, by, 7.5, 0, 7); ctx.fillStyle = '#fffdf0'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = A.INK; ctx.stroke(); ctx.beginPath(); ctx.moveTo(bx - 2.5, by + 6.5); ctx.lineTo(bx + 1, by + 12); ctx.lineTo(bx + 3, by + 6); ctx.fillStyle = '#fffdf0'; ctx.fill(); A.drawChunkyText(ctx, '!', bx, by + 0.5, 12, { mode: 'btn', fill: '#e0524f', outline: 2 }); ctx.restore(); } // v0.8.1 J3
  if (H && !ghost) drawNurseHud(a, H, x, y, frozen);
  if (frozen) { ctx.save(); ctx.globalAlpha = 0.55; A.rr(ctx, x - 17 * a.size, y - 24 * a.size, 34 * a.size, 32 * a.size, 7); ctx.fillStyle = '#d6f3ff'; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = '#8fd0f5'; ctx.stroke(); ctx.restore(); }
  if (a.slow > 0.01 && !frozen) { ctx.fillStyle = 'rgba(255,240,160,0.8)'; ctx.beginPath(); ctx.ellipse(x, y + 8, 9 * a.size, 2.5, 0, 0, 7); ctx.fill(); }
  if (a.stunT > 0 && !frozen) A.stunStars(ctx, x, y - 30 * a.size, S.t + a.id, a.size);
  if (a.charmT > 0) A.heart(ctx, x + Math.sin(S.t * 4 + a.id) * 4, y - 32 * a.size - Math.abs(Math.sin(S.t * 3)) * 4, 3, '#ff8fbf');
  if (a.shieldMax > 0 && !ghost) drawShield(a, x, y);
  if (a.hp < a.maxHp && !ghost) {
    const w = a.type === 'queen' || a.type === 'queen3' || a.type === 'queen4' || a.type === 'queen5' || a.type === 'queen6' ? 60 : 22, hy = y - (a.flying ? 44 : 33) * a.size - 3;
    A.rr(ctx, x - w / 2 - 1, hy - 1, w + 2, 6, 3); ctx.fillStyle = A.INK; ctx.fill();
    const f = Math.max(0, a.hp / a.maxHp);
    A.rr(ctx, x - w / 2, hy, w * f, 4, 2); ctx.fillStyle = f > 0.5 ? '#8fe388' : f > 0.25 ? '#ffd45e' : '#ff7a7a'; ctx.fill();
  }
}
function renderFx(dt) {
  if (S.screen === 'battle' && S.speed >= 4) dt *= 2; // v0.7.4 M0: at 4x effects age (and move) twice as fast, so they do not pile up
  const keep = [];
  for (const f of S.fx) {
    f.life -= dt; if (f.life <= 0) continue; keep.push(f);
    if (f.life > f.max) continue; // still waiting (e.g. until the flying card lands)
    const k = 1 - f.life / f.max;
    ctx.save();
    switch (f.k) {
      case 'thrown': { // v0.6 item 6: an ant thrown off the trail by the Tractor - an arc with a spin, then a puff where it lands
        const spr = A.antSprite(f.ant, 0, false, pxRatio, '', { play: true });
        const x = f.x0 + (f.x1 - f.x0) * k, y = f.y0 + (f.y1 - f.y0) * k - Math.sin(k * Math.PI) * f.h;
        ctx.globalAlpha = k > 0.8 ? (1 - k) / 0.2 : 1; ctx.translate(x, y); ctx.rotate(k * f.spin); const sc = 1 - k * 0.35; ctx.scale(sc, sc);
        ctx.drawImage(spr.cv, -spr.ox, -spr.oy, spr.w, spr.h);
        if (k > 0.82 && !f.landed) { f.landed = true; for (let i = 0; i < 4; i++) addFx({ k: 'puff', x: f.x1 + (Math.random() - 0.5) * 10, y: f.y1, vx: (Math.random() - 0.5) * 40, vy: -Math.random() * 20, r: 3 + Math.random() * 3, life: 0.45, max: 0.45 }); }
        break;
      }
      case 'crumbFly': { const x = f.x0 + (f.x1 - f.x0) * k, y = f.y0 + (f.y1 - f.y0) * k - Math.sin(k * Math.PI) * 24; ctx.globalAlpha = k > 0.85 ? (1 - k) / 0.15 : 1; A.crumbIcon(ctx, x, y, 1.1 - k * 0.5, true); break; }
      case 'ko': {
        const spr = A.antSprite(f.ant, 0, false, pxRatio, '', { play: true });
        // v0.7.6 V4: death = scale 1 -> 1.25 in 80 ms (first 25%), then -> 0 over 240 ms; life 0.32 s (was 0.2); reduced motion: a plain fade of the same length, no scale / spin
        const rmo = reducedMotion(), ds = rmo ? 1 : k < 0.25 ? 1 + 0.25 * (k / 0.25) : 1.25 * (1 - (k - 0.25) / 0.75);
        ctx.globalAlpha = rmo ? 1 - k : 1 - k * k; ctx.translate(f.x, f.y - (rmo ? 0 : f.fall ? -k * k * 20 + Math.sin(k * 14) * 3 : k * 24)); ctx.rotate(rmo ? 0 : Math.PI * k * (f.fall ? 2.2 : 0.4) * f.face); // v0.8.1 J2: a flyer spins and drops ctx.scale(f.face * ds, -ds);
        ctx.drawImage(spr.cv, -spr.ox, -spr.oy, spr.w, spr.h);
        ctx.scale(1, -1); ctx.beginPath(); ctx.ellipse(0, -18, 8, 2.5, 0, 0, 7); ctx.lineWidth = 2; ctx.strokeStyle = '#ffe36e'; ctx.stroke();
        break;
      }
      case 'puff': f.x += f.vx * dt; f.y += f.vy * dt; ctx.globalAlpha = (1 - k) * 0.8; ctx.beginPath(); ctx.arc(f.x, f.y, f.r * (1 + k), 0, 7); ctx.fillStyle = f.col || '#fff'; ctx.fill(); break;
      case 'crumbTxt': ctx.globalAlpha = 1 - k * k; A.crumbIcon(ctx, f.x - 7, f.y - k * 24, 0.7); A.text(ctx, '+' + f.n, f.x + 7, f.y - k * 24, 12, '#ffe3a8'); break;
      case 'txt': { // v0.7.5 juice: rise 22 px with easeOutCubic; scale 0.6 -> 1.15 -> 1 in the first 120 ms; reduced motion: no rise, no pop
        const rm = reducedMotion(), pk = Math.min(1, (f.max * k) / 0.12); ctx.globalAlpha = 1 - k * k;
        const sz = Math.max(MIN_FONT, (f.size || 14) * (rm || pk >= 1 ? 1 : pk < 0.6 ? 0.6 + (1.15 - 0.6) * (pk / 0.6) : 1.15 - 0.15 * ((pk - 0.6) / 0.4))); // v0.7.6 V3: the 120 ms pop-in never starts below 12 px
        A.text(ctx, f.s, Math.max(60, Math.min(MAP_W - 60, f.x)), f.y - (rm ? 0 : 22 * (1 - Math.pow(1 - k, 3))), sz, f.col); break; }
      case 'healRing': { const rm = reducedMotion(), rr3 = f.r * (rm ? 1 : 0.25 + 0.75 * Math.sqrt(k)); ctx.globalAlpha = (1 - k) * 0.95; ctx.beginPath(); ctx.arc(f.x, f.y + 2, rr3, 0, 7); ctx.lineWidth = 6 * (1 - k) + 1.5; ctx.strokeStyle = A.INK; ctx.stroke(); ctx.lineWidth = 3.6 * (1 - k) + 1; ctx.strokeStyle = '#ffffff'; ctx.stroke(); A.plusShape(ctx, f.x, f.y - 12, 6, '#ff5a7e', 1.5); break; }
      case 'iceShard': f.x += f.vx * dt; f.y += f.vy * dt; f.vy += 220 * dt; { ctx.globalAlpha = 1 - k * k; ctx.translate(f.x, f.y); ctx.rotate(f.rot + k * 5); ctx.beginPath(); ctx.moveTo(0, -4); ctx.lineTo(3, 3); ctx.lineTo(-3, 2.5); ctx.closePath(); ctx.fillStyle = '#e9f8ff'; ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = A.INK; ctx.stroke(); } break;
      case 'shieldPop': ctx.globalAlpha = (1 - k) * 0.9; ctx.beginPath(); ctx.ellipse(f.x, f.y, 17, 21, 0, 0, 7); ctx.lineWidth = 1.5; ctx.strokeStyle = '#ffffff'; ctx.stroke(); break;
      case 'healPlus': { const rm = reducedMotion(); ctx.globalAlpha = k < 0.7 ? 1 : (1 - k) / 0.3; A.plusShape(ctx, f.x, f.y - (rm ? 4 : k * 22), 5, '#8fe388', 1.6); break; }
      case 'ring2': ctx.globalAlpha = 1 - k; ctx.beginPath(); ctx.arc(f.x, f.y, 8 + k * 34, 0, 7); ctx.lineWidth = 6 * (1 - k) + 1; ctx.strokeStyle = '#ffe36e'; ctx.stroke(); break;
      case 'pillar': { ctx.globalAlpha = (1 - k) * 0.8; const g = ctx.createLinearGradient(0, f.y - 120, 0, f.y + 10); g.addColorStop(0, 'rgba(255,240,150,0)'); g.addColorStop(1, 'rgba(255,240,150,0.9)'); ctx.fillStyle = g; const w = 26 * (1 - k * 0.5); ctx.fillRect(f.x - w / 2, f.y - 120, w, 130); for (let i = 0; i < 4; i++) A.starShape(ctx, f.x + Math.sin(i * 2.1 + k * 6) * 14, f.y - 20 - ((k * 90 + i * 25) % 100), 3.5, '#fff7b0', 1); break; }
      case 'heart': ctx.globalAlpha = 1 - k; A.heart(ctx, f.x + Math.sin(k * 8) * 3, f.y - k * 18, 3.2, '#ff8fbf'); break;
      case 'crumbBit': f.x += f.vx * dt; f.y += f.vy * dt; f.vy += 260 * dt; ctx.globalAlpha = 1 - k; ctx.fillStyle = '#e8b878'; ctx.beginPath(); ctx.ellipse(f.x, f.y, 2.4, 1.8, k * 6, 0, 7); ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = A.INK; ctx.stroke(); break;
      case 'dizzy': ctx.globalAlpha = 1 - k; for (let i = 0; i < 3; i++) { const a = k * 10 + i * 2.1; A.starShape(ctx, f.x + Math.cos(a) * 12, f.y - 16 + Math.sin(a) * 4, 3, '#fff27a', 1); } break;
      case 'beam': ctx.globalAlpha = 1 - k; ctx.lineCap = 'round'; ctx.lineWidth = 6 + (f.heat || 0) * 5; ctx.strokeStyle = (f.heat || 0) > 0.6 ? 'rgba(255,150,60,0.55)' : 'rgba(255,90,120,0.4)'; ctx.beginPath(); ctx.moveTo(f.x, f.y); ctx.lineTo(f.tx, f.ty - 4); ctx.stroke(); ctx.lineWidth = 2; ctx.strokeStyle = '#fff'; ctx.stroke(); break;
      case 'zap': {
        ctx.globalAlpha = 1 - k; ctx.lineWidth = f.static ? 3.4 : f.chain ? 2.2 : 3; ctx.strokeStyle = f.static ? '#ffffff' : f.chain ? '#e4d0ff' : '#bfe0ff'; ctx.beginPath(); ctx.moveTo(f.x, f.y);
        for (let i = 1; i < 6; i++) { const q = i / 6; ctx.lineTo(f.x + (f.tx - f.x) * q + (Math.random() - 0.5) * 10, f.y + (f.ty - f.y) * q + (Math.random() - 0.5) * 10); }
        ctx.lineTo(f.tx, f.ty); ctx.stroke(); ctx.lineWidth = 1.2; ctx.strokeStyle = '#fff'; ctx.stroke(); break;
      }
      case 'tongue': {
        const ext = k < 0.5 ? k * 2 : (1 - k) * 2; const sx = f.x + 8, sy = f.y - 8;
        const ex = sx + (f.tx - sx) * ext, ey = sy + (f.ty - sy) * ext;
        ctx.lineCap = 'round'; ctx.lineWidth = 5; ctx.strokeStyle = A.INK; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();
        ctx.lineWidth = 3; ctx.strokeStyle = '#ff8fab'; ctx.stroke(); A.blob(ctx, ex, ey, 4, 4, '#ff8fab', 1.5); break;
      }
      case 'spArc': { ctx.lineCap = 'round'; const mx = (f.x + f.tx) / 2, my = (f.y + f.ty) / 2 - 10; ctx.beginPath(); ctx.moveTo(f.x, f.y); ctx.quadraticCurveTo(mx, my, f.tx, f.ty); ctx.lineWidth = f.bright ? 3 : 2; ctx.strokeStyle = f.bright ? '#ffffff' : A.INK; ctx.stroke(); ctx.beginPath(); ctx.arc(mx * 0.5 + (f.x + f.tx) * 0.25, my * 0.5 + (f.y + f.ty) * 0.25, f.bright ? 3 : 2.4, 0, 7); ctx.fillStyle = f.bright ? '#ffffff' : '#fff2b8'; ctx.fill(); break; }
      case 'spCrack': { ctx.globalAlpha = 1 - k; ctx.lineCap = 'round'; ctx.lineWidth = 2; ctx.strokeStyle = '#fff2b8'; ctx.beginPath(); for (let i = 0; i < 3; i++) { const a = -1.2 + i * 1.2 + 0.4; ctx.moveTo(f.x + Math.cos(a) * 3, f.y + Math.sin(a) * 3); ctx.lineTo(f.x + Math.cos(a) * (8 + 4 * k), f.y + Math.sin(a) * (8 + 4 * k)); } ctx.stroke(); break; } // v0.8.3 M7h Burn-through
      case 'spGold': ctx.globalAlpha = (1 - k) * 0.9; ctx.beginPath(); ctx.arc(f.x, f.y - 6, f.r * (0.2 + 0.8 * k), 0, 7); ctx.lineWidth = 6.5 * (1 - k) + 1.3; ctx.strokeStyle = '#ffd24a'; ctx.stroke(); break; // v0.8.3 M7h Crescendo: 30 % thicker, gold
      case 'ring': ctx.globalAlpha = (1 - k) * 0.8; ctx.beginPath(); ctx.arc(f.x, f.y - 6, f.r * (0.2 + 0.8 * k), 0, 7); ctx.lineWidth = 5 * (1 - k) + 1; ctx.strokeStyle = f.col; ctx.stroke();
        ctx.beginPath(); ctx.arc(f.x, f.y - 6, f.r * (0.1 + 0.6 * k), 0, 7); ctx.lineWidth = 2; ctx.strokeStyle = '#fff'; ctx.stroke(); break;
      case 'wisp': { const d = f.d + k * 70; ctx.globalAlpha = 1 - k; ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.strokeStyle = '#ffffff'; ctx.beginPath(); const x0 = f.x + Math.cos(f.a) * d, y0 = f.y + Math.sin(f.a) * d; ctx.moveTo(x0, y0); ctx.quadraticCurveTo(x0 + Math.cos(f.a + 1) * 6, y0 + Math.sin(f.a + 1) * 6, x0 + Math.cos(f.a) * 14, y0 + Math.sin(f.a) * 14); ctx.stroke(); break; }
      case 'mist': { ctx.globalAlpha = 0.6 * (1 - k); const x = f.x + (f.tx - f.x) * k, y = f.y - 20 + (f.ty - f.y + 20) * k; ctx.beginPath(); ctx.arc(x, y, 6 + k * 8, 0, 7); ctx.fillStyle = '#c9f5b8'; ctx.fill(); break; }
      case 'healCross': { ctx.globalAlpha = 1 - k * k; const cy = f.y - k * 16, s = 1 + 0.2 * k; ctx.translate(f.x, cy); ctx.scale(s, s); ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(-2.8, -7); ctx.lineTo(2.8, -7); ctx.lineTo(2.8, -2.8); ctx.lineTo(7, -2.8); ctx.lineTo(7, 2.8); ctx.lineTo(2.8, 2.8); ctx.lineTo(2.8, 7); ctx.lineTo(-2.8, 7); ctx.lineTo(-2.8, 2.8); ctx.lineTo(-7, 2.8); ctx.lineTo(-7, -2.8); ctx.lineTo(-2.8, -2.8); ctx.closePath(); ctx.fillStyle = '#c9f5b8'; ctx.fill(); ctx.lineWidth = 1.8; ctx.strokeStyle = A.INK; ctx.stroke(); break; }
      case 'impact': { // v0.8.1 J1
        const x = f.x, y = f.y; ctx.lineCap = 'round';
        switch (f.shape) {
          case 'tint': ctx.globalAlpha = 0.4; ctx.beginPath(); ctx.arc(x, y, 9, 0, 7); ctx.fillStyle = f.col; ctx.fill(); break;
          case 'spoke3': { ctx.globalAlpha = 1 - k * k; const L = 5 + 4 * k; for (const w of [[5, A.INK], [2.4, '#fff4c8']]) { ctx.lineWidth = w[0]; ctx.strokeStyle = w[1]; ctx.beginPath(); for (let i = 0; i < 3; i++) { const a = -Math.PI / 2 + i * 2.094 + k * 0.5; ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * L, y + Math.sin(a) * L); } ctx.stroke(); } break; }
          case 'ring': ctx.globalAlpha = 1 - k; ctx.beginPath(); ctx.arc(x, y, 6 + 8 * k, 0, 7); ctx.lineWidth = 4.2; ctx.strokeStyle = A.INK; ctx.stroke(); ctx.lineWidth = 2.2; ctx.strokeStyle = '#d6f2ff'; ctx.stroke(); break;
          case 'sparkle': A.fxSparkle(ctx, x, y, 6, '#ffffff', k); break;
          case 'sparks2': ctx.globalAlpha = 1 - k; for (let i = 0; i < 2; i++) { const a = -0.6 + i * 2.2 + k, d = 3 + 7 * k; ctx.beginPath(); ctx.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, 2.5 * (1 - k * 0.5), 0, 7); ctx.fillStyle = '#fff7a8'; ctx.fill(); ctx.lineWidth = 1.2; ctx.strokeStyle = A.INK; ctx.stroke(); } break;
          case 'splat': { ctx.globalAlpha = 1 - k * k; const w = 5 + 7 * Math.min(1, k * 2.2); ctx.beginPath(); ctx.ellipse(x, y, w, w * 0.45, 0, 0, 7); ctx.fillStyle = 'rgba(255,240,170,0.85)'; ctx.fill(); ctx.lineWidth = 1.6; ctx.strokeStyle = A.INK; ctx.stroke(); if (k > 0.3) { ctx.beginPath(); ctx.arc(x + 3, y + (k - 0.3) * 14, 1.8, 0, 7); ctx.fillStyle = '#ffe48a'; ctx.fill(); } break; }
          case 'bubbles': ctx.globalAlpha = 1 - k; for (let i = 0; i < 2; i++) { const rr = (i ? 2.5 : 4) * (0.5 + k * 1.1); ctx.beginPath(); ctx.arc(x + (i ? 6 : -4), y - (i ? 3 : 0) - k * 6, rr, 0, 7); ctx.lineWidth = 1.8; ctx.strokeStyle = A.INK; ctx.stroke(); ctx.fillStyle = 'rgba(255,170,70,0.75)'; ctx.fill(); } break;
          case 'heart': ctx.globalAlpha = 1 - k; A.heart(ctx, x, y - k * 10, 5, '#ff8fbf'); break;
        }
        break;
      }
      case 'ember': f.x += f.vx * dt; f.y += f.vy * dt; ctx.globalAlpha = 1 - k; ctx.beginPath(); ctx.arc(f.x, f.y, 2.6 * (1 - k) + 0.8, 0, 7); ctx.fillStyle = k < 0.4 ? '#ffe08a' : '#ff8a4a'; ctx.fill(); break;
      case 'spark': if (C.ART81) { A.fxSparkle(ctx, f.x, f.y, f.big ? 11 + 5 * k : 4 + 4 * k, f.col || '#fff7a8', k); break; } ctx.globalAlpha = 1 - k; A.starShape(ctx, f.x, f.y, 5 + k * 4, f.col || '#fff', 1); break;
      case 'icing': { const rr = 10 + 34 * Math.sqrt(k); ctx.globalAlpha = (1 - k) * 0.9; ctx.beginPath(); ctx.ellipse(f.x, f.y + 8, rr, rr * 0.45, 0, 0, 7); ctx.fillStyle = '#f7b6c8'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = A.INK; ctx.stroke(); break; } // v0.8.1 W8: the Glaze Queen's icing splash
      case 'sprk': f.x += f.vx * dt; f.y += f.vy * dt; f.vy += 320 * dt; ctx.globalAlpha = 1 - k * k; ctx.translate(f.x, f.y); ctx.rotate(f.rot + k * 9); ctx.fillStyle = f.col; ctx.fillRect(-3, -1.2, 6, 2.4); ctx.lineWidth = 0.9; ctx.strokeStyle = A.INK; ctx.strokeRect(-3, -1.2, 6, 2.4); break; // v0.8.1 W8: a sprinkle piece
      case 'shard': f.x += f.vx * dt; f.y += f.vy * dt; f.vy += 300 * dt; ctx.globalAlpha = 1 - k; ctx.translate(f.x, f.y); ctx.rotate(k * 9); ctx.beginPath(); ctx.moveTo(-3, -2); ctx.lineTo(3, -1); ctx.lineTo(0, 3); ctx.closePath(); ctx.fillStyle = f.col || '#bfe6ff'; ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = A.INK; ctx.stroke(); break;
      case 'star': f.x += f.vx * dt; f.y += f.vy * dt; f.vy += 80 * dt; if (C.ART81) { A.fxSparkle(ctx, f.x, f.y, 4.5 * (1 - k) + 1.5, A.SPARK_COLS[(f.ci || 0) % 4], k); break; } ctx.globalAlpha = 1 - k; A.starShape(ctx, f.x, f.y, 4 * (1 - k) + 1, '#ffe36e', 1); break;
      case 'pop': ctx.globalAlpha = 1 - k; ctx.beginPath(); ctx.arc(f.x, f.y, 10 + k * 22, 0, 7); ctx.lineWidth = 3; ctx.strokeStyle = '#fff'; ctx.stroke(); break;
      case 'boom': {
        ctx.globalAlpha = 1 - k;
        for (const [rr2, col] of [[1, '#ffd36e'], [0.7, '#ff9a6e'], [0.4, '#fff3c0']]) { ctx.beginPath(); ctx.arc(f.x, f.y, f.r * rr2 * (0.3 + 0.7 * Math.sqrt(k)), 0, 7); ctx.fillStyle = col; ctx.fill(); }
        A.text(ctx, 'BOOM!', f.x, f.y - 10 - k * 20, 26 + k * 6, '#fff'); break;
      }
      case 'dust': ctx.globalAlpha = 0.5 * (1 - k); ctx.beginPath(); ctx.arc(f.x, f.y + k * 10, 6 + k * 10, 0, 7); ctx.fillStyle = '#e6f7c8'; ctx.fill(); break;
      case 'flash': ctx.globalAlpha = 1 - k; ctx.fillStyle = f.col; ctx.fillRect(0, 0, MAP_W, MAP_H); break;
      case 'wchip': { // v0.8.2 J16 / J19: a small chip slides in (180 ms), holds, fades; 600 ms in all
        const t = k * f.max, inn = Math.min(1, t / 0.18), ease = 1 - (1 - inn) * (1 - inn), fade = t > 0.45 ? Math.max(0, 1 - (t - 0.45) / 0.15) : 1, rm = reducedMotion();
        ctx.globalAlpha = Math.min(1, inn * 1.5) * fade; ctx.translate(rm ? 0 : -60 * (1 - ease), 0); const w = 132, h = 26, x0 = 200 - w / 2, y0 = 40;
        A.rr(ctx, x0, y0, w, h, 13); ctx.fillStyle = f.col || '#fff2b8'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = A.INK; ctx.stroke(); A.text(ctx, f.s, 200, y0 + h / 2 + 0.5, 13, A.INK, 'center', null); break;
      }
      case 'banner': if (f.pill) { // v0.8.1 J4
        const t = k * f.max, rm = reducedMotion(), inn = Math.min(1, t / 0.18), ease = 1 - (1 - inn) * (1 - inn), fade = t > 0.88 ? Math.max(0, 1 - (t - 0.88) / 0.2) : 1;
        const w = f.last ? 190 : 150, h = 36; ctx.globalAlpha = rm ? Math.min(fade, k < 0.15 ? k / 0.15 : 1) : Math.min(1, inn * 1.5) * fade;
        ctx.translate(0, rm ? 0 : -28 * (1 - ease));
        A.drawPillButton(ctx, 200 - w / 2, 92, w, h, f.last ? 'gold' : 'pink');
        A.drawChunkyText(ctx, f.s, 200, 92 + h / 2 + 1, 20, { mode: 'btn' });
        if (f.last && !rm && t > 0.12) for (let j = 0; j < 4; j++) { const ph = (t * 2.2 + j * 0.27) % 1; A.fxSparkle(ctx, 200 + (j % 2 ? 1 : -1) * (w / 2 + 6 + (j > 1 ? 14 : 0)), 92 + 6 + (j > 1 ? 22 : 0) + ph * 4, 6 - j % 2 * 1.5, A.SPARK_COLS[(j + 1) % 4], ph * 0.9); }
        break;
      } else { ctx.globalAlpha = k < 0.15 ? k / 0.15 : k > 0.75 ? (1 - k) / 0.25 : 1; const s = 1 + Math.max(0, 0.15 - k) * 2; ctx.translate(200, 200); ctx.scale(s, s); A.text(ctx, f.s, 0, 0, 34, '#ffe36e'); break; }
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
    } else if (f.k === 'queenPill') { // v0.8.1 J9: portrait + name, slides in from the left over 250 ms, holds, fades (non-blocking, input stays live)
      const t = k * f.max, rm = reducedMotion(), inn = Math.min(1, t / 0.25), ease = 1 - (1 - inn) * (1 - inn), fade = t > 1.75 ? Math.max(0, 1 - (t - 1.75) / 0.25) : 1;
      ctx.globalAlpha = rm ? Math.min(fade, t < 0.2 ? t / 0.2 : 1) : fade; ctx.translate(rm ? 0 : -150 * (1 - ease), 0);
      A.drawPillButton(ctx, 8, 76, 168, 38, 'purple');
      ctx.save(); ctx.beginPath(); ctx.arc(28, 95, 15, 0, 7); ctx.fillStyle = '#fff3e6'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = A.INK; ctx.stroke(); ctx.clip(); ctx.translate(28, 104); ctx.scale(0.5, 0.5); A.drawAnt(ctx, f.type, 0.2); ctx.restore();
      A.drawChunkyText(ctx, C.ANTS[f.type].name, 102, 96, 15, { mode: 'btn', align: 'center' });
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
let foodBarSt = { b: null, prev: 1, flash: 0, drain: null };
// v0.8.2 J16 / J19: 'Wave n cleared' (once per wave, never on the final wave) and 'Food low!' (once per battle, below 25 %) chips; the food tube's rim pulses #ff8a8a at 1.2 Hz (static under reduced motion)
let chipSt = { b: null, waves: {}, food: false };
function battleChips(b, f) {
  if (chipSt.b !== b) chipSt = { b, waves: {}, food: false };
  if (b.result == null && b.nextWave >= 1 && b.nextWave < b.totalWaves && b.ants.length === 0 && b.pending.length === 0 && !chipSt.waves[b.nextWave]) {
    chipSt.waves[b.nextWave] = true; addFx({ k: 'wchip', s: `Wave ${b.nextWave} cleared`, life: 0.6, max: 0.6 });
    if (!reducedMotion()) for (let i = 0; i < 6; i++) addFx({ k: 'star', ci: i, x: 200 + (i - 2.5) * 22, y: MAP_Y + 20, vx: (i - 2.5) * 10, vy: -90, life: 0.5, max: 0.5 });
  }
  if (f > 0 && f < 0.25) {
    const pa = reducedMotion() ? 0.9 : 0.45 + 0.45 * (0.5 + 0.5 * Math.sin(S.t * Math.PI * 2 * 1.2));
    ctx.save(); A.rr(ctx, 60, 22, 84, 20, 10); ctx.lineWidth = 3; ctx.strokeStyle = `rgba(255,138,138,${pa})`; ctx.stroke(); ctx.restore();
    if (!chipSt.food) { chipSt.food = true; addFx({ k: 'wchip', s: 'Food low!', col: '#ffd0d0', life: 0.6, max: 0.6 }); }
  }
}
function renderHud(b) {
  panel(6, 6, 388, 54, '#fff6ee', 16);
  // food
  A.drawTreat(ctx, treatKind(b), 30, 33, b.foodStored / b.cfg.foodHP, S.t, { ouch: S.cookieOuch > S.t, react: Treat.reaction(S.treat, S.t) });
  const f = b.foodStored / b.cfg.foodHP;
  // v0.4 item 10: the food bar is a bit narrower to make room for the diamonds chip
  if (C.ART81) {
    if (foodBarSt.b !== b) foodBarSt = { b, prev: f, flash: 0, drain: null }; // v0.8.1 G8: flash + drain events come from the food level dropping
    if (f < foodBarSt.prev - 1e-6) { foodBarSt.flash = 0.5; foodBarSt.drain = { from: Math.max(foodBarSt.prev, foodBarSt.drain ? foodBarSt.drain.from : 0), a: 1 }; }
    foodBarSt.prev = f; const dt = Math.min(0.1, S.t - (foodBarSt.t || S.t)); foodBarSt.t = S.t; foodBarSt.flash = Math.max(0, foodBarSt.flash - dt * (0.5 / 0.12)); if (foodBarSt.drain) { foodBarSt.drain.a -= dt / 0.4; if (foodBarSt.drain.a <= 0) foodBarSt.drain = null; }
    A.drawFoodBar(ctx, f, `${Math.floor(b.foodStored + 1e-6)}`, S.t, { flash: reducedMotion() ? 0 : foodBarSt.flash, drain: reducedMotion() ? null : foodBarSt.drain, still: reducedMotion() });
  } else {
  A.rr(ctx, 60, 22, 84, 20, 10); ctx.fillStyle = '#f0e0d8'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = A.INK; ctx.stroke();
  if (f > 0) { A.rr(ctx, 62, 24, 80 * f, 16, 8); ctx.fillStyle = f >= 0.9 ? '#8fe388' : f >= 0.5 ? '#ffd45e' : '#ff8a8a'; ctx.fill(); }
  A.text(ctx, `${Math.floor(b.foodStored + 1e-6)}`, 102, 33, 13, '#fff');
  }
  if (C.ART81) battleChips(b, f);
  const carried = b.ants.reduce((s, a) => s + (a.trips === 0 ? a.carrying : 0), 0); // v0.7.2 C14: 'carried off!' only for ants on their FIRST trip (every ant keeps shuttling, so it would never go away)
  if (carried) A.text(ctx, `${fmtFood(carried)} carried off!`, 102, 51, 12, '#c0392b', 'center', null);
  // wave
  A.text(ctx, `Wave ${Math.min(b.nextWave, b.totalWaves)}/${b.totalWaves}`, 184, 26, 16, '#ffb3c1', 'center', A.INK, 'bold', true);
  hudPreviewLast = null;
  if (!(stripNoRoom && drawHudPreview(b))) A.text(ctx, `Lv ${b.levelIndex + 1}`, 184, 46, 12, '#a08090', 'center', null); // v0.7.5: 12 px caption; with no room for the strip the compact preview takes this slot
  // v0.4 item 10: diamonds in stock, always visible in battle (they buy crumbs and boosters)
  ctx.save(); ctx.translate(252, 33);
  A.rr(ctx, -31, -14, 62, 28, 14); ctx.fillStyle = '#e9f7ff'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = A.INK; ctx.stroke();
  A.diamondIcon(ctx, -15, 0, 0.95);
  A.text(ctx, String(S.save.diamonds || 0), 8, 1, 16, '#7fd3ff', 'center', A.INK, 'bold', true);
  ctx.restore();
  // crumbs
  S.crumbShake = Math.max(0, S.crumbShake - 1 / 60); S.crumbPulse = Math.max(0, S.crumbPulse - 1 / 60);
  const cbump = S.crumbBump > 0 ? 0.08 * Math.sin(Math.PI * (1 - S.crumbBump / 0.12)) : 0; S.crumbBump = Math.max(0, S.crumbBump - 1 / 60); // v0.8.1 G4: 1 -> 1.08 -> 1 over 120 ms
  const shx = S.crumbShake > 0 ? Math.sin(S.t * 60) * 4 * S.crumbShake / 0.45 : 0, pul = 1 + S.crumbPulse * 0.5 + cbump;
  ctx.save(); ctx.translate(341 + shx, 33); ctx.scale(pul, pul);
  A.rr(ctx, -45, -16, 90, 32, 16); ctx.fillStyle = S.crumbShake > 0 ? '#ffd6d6' : '#fff1d6'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = S.crumbShake > 0 ? '#e0524f' : A.INK; ctx.stroke();
  A.crumbIcon(ctx, -27, 0, 1.2);
  A.text(ctx, String(Math.floor(b.crumbs)), 7, 1, 19, '#ffcf7a', 'center', A.INK, 'bold', true);
  // '+' badge: buy crumbs with diamonds (v0.3 item 12)
  A.blob(ctx, 36, -1, 9, 9, '#9fe0ff', 1.8); A.text(ctx, '+', 36, -1.5, 15, '#ffffff');
  ctx.restore();
  if (C.ART81) { drawCrumbUp(); const sk = (S.t - S.chipSparkT) / 0.28; if (sk >= 0 && sk < 1 && !reducedMotion()) { ctx.save(); A.fxSparkle(ctx, 322, 22, 5, '#fff7c2', sk); ctx.restore(); } } // v0.8.1 G4: fly-ups land on the chip, <= 1 sparkle per 150 ms
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
  A.text(ctx, D.title, 200, 258, 22, D.kind === 'crumbs' ? '#ffcf7a' : C.BONUSES[D.booster].color, 'center', A.INK, 'bold', true);
  ctx.save(); ctx.translate(200, 300);
  if (D.kind === 'crumbs') { for (let k = 0; k < 5; k++) A.crumbIcon(ctx, -28 + k * 14, Math.sin(S.t * 4 + k) * 2, 1.4); }
  else { ctx.scale(1.4, 1.4); A.drawBonusIcon(ctx, D.booster, S.t); }
  ctx.restore();
  plainText(D.line, 200, 338, 14, '#3d2a36', 'center', '600');
  A.diamondIcon(ctx, 178, 364, 1.2); A.text(ctx, String(D.price), 212, 365, 22, '#7fd3ff', 'center', A.INK, 'bold', true);
  plainText(afford ? `You have ${have} diamonds.` : `You have ${have} diamonds. Get diamonds from the Reward Calendar.`, 200, 392, 12, afford ? '#5a4652' : '#c0392b', 'center');
  plainText(D.note, 200, 408, 12, '#7a6a76', 'center');
  drawButton(64, 420, 128, 46, 'Cancel', '#fff3e6'); button('dlgCancel', 60, 418, 136, 52, () => { S.dialog = null; });
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
  // v0.8.0 (spec 10): the tray is a beveled gingham tile (#ffe3d2 / #ffd5bf), baked once per scale
  A.bakedBox(ctx, 'tray', 4, y0, 392, H - y0 - 8, 12, (g, w, h) => {
    if (C.ART81) for (const [dy, al] of [[7, 0.07], [5, 0.09], [3, 0.09]]) { A.rrPath(g, 0, dy, w, h, 18); g.fillStyle = `rgba(70,35,50,${al})`; g.fill(); } // v0.8.2 G16: a baked 6 px drop shadow under the whole tray (alpha .25 stacked)
    A.drawBeveledTile(g, 0, 0, w, h, '#ffe3d2', { lip: 4, r: 18, lw: 3, hi: 0.6 });
    g.save(); A.rrPath(g, 3, 3, w - 6, h - 6, 15); g.clip(); g.fillStyle = 'rgba(255,213,191,0.55)';
    for (let x = 0; x < w; x += 24) g.fillRect(x + 6, 0, 12, h);
    for (let y = 0; y < h; y += 24) g.fillRect(0, y + 6, w, 12);
    g.restore(); A.rrPath(g, 0, 0, w, h, 18); g.lineWidth = 3; g.strokeStyle = A.INK; g.stroke();
  });
  const cost = b.nextCardCost; const afford = b.crumbs >= cost;
  // 3 picks
  for (let i = 0; i < b.picks.length; i++) {
    const x = 12 + i * 94, y = y0 + L.cardY, w = 88, h = L.cardH;
    const selected = (S.sel && S.sel.kind === 'card' && S.sel.i === i) || (S.drag && S.drag.i === i);
    S.slotFlip[i] = Math.max(0, (S.slotFlip[i] || 0) - 1 / 60);
    const shake = !afford && S.crumbShake > 0 ? Math.sin(S.t * 60) * 3 : 0;
    ctx.save(); ctx.translate(x + w / 2 + shake, y + h / 2); ctx.scale(Math.max(0.05, S.slotFlip[i] > 0 ? 1 - Math.sin(S.slotFlip[i] / 0.3 * Math.PI) : 1), 1); ctx.translate(-(x + w / 2), -(y + h / 2));
    drawCard(x, y, w, h, b.picks[i], { cost, afford, selected, lift: selected ? 4 : (C.ART81 && afford ? 2 : 0), level: Math.min(S.save.cards[b.picks[i]].level, b.cardLevelCap || Infinity) }); // v0.7.7 P1-2: the badge = the level the card fights at
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
  drawButton(wx, ry, ww, L.rerollH, '', '#fff3e6', { disabled: b.crumbs < rc });
  if (rc === 0) { A.text(ctx, 'Redraw', wx + 30, ry + 18, 13, A.INK, 'center', null); A.text(ctx, 'FREE', wx + 76, ry + 18, 12, '#2f8a3a', 'center', null); } // v0.7 D-R3: the first redraw is free
  else { A.text(ctx, 'Redraw', wx + 30, ry + 18, 13, A.INK, 'center', null); A.crumbIcon(ctx, wx + 66, ry + 18, 0.65); A.text(ctx, String(rc), wx + 80, ry + 18, 12, A.INK, 'center', null); }
  button('reroll', wx - 4, y0 + L.rerollY - 4, ww + 8, L.rowY - L.rerollY + 4, () => { if (b.reroll()) { sfx('tap'); if (rc > 0) { addUi({ k: 'costFly', n: rc, x0: 340, y0: 34, x1: 300, y1: 96, life: 1.0, max: 1.0 }); S.crumbPulse = 0.35; } } else needCrumbs(rc); });
  // bottom row: bonuses, speed, pause
  const by = y0 + L.rowY, bh = L.rowH;
  const hitY = y0 + L.rowY - 2, hitH = H - hitY; // extends to the bottom edge
  b.bonusTypes.forEach((bt, k) => {
    const x = 12 + k * 104, w = 98;
    const can = b.canUseBonus(bt); const sel = S.sel && S.sel.kind === 'bonus' && S.sel.type === bt;
    const stock = b.bonusStock[bt] || 0; const buyable = stock <= 0 && b.bonusUsesLeft > 0; // v0.3: 0 left -> buy one with diamonds
    drawButton(x, by, w, bh, '', sel ? '#ffd27a' : C.BONUSES[bt].color, { disabled: !can && !buyable, r: 12 });
    ctx.save(); ctx.translate(x + 17, by + bh / 2); ctx.scale(0.85, 0.85); A.drawBonusIcon(ctx, bt, S.t); ctx.restore();
    fitText(C.BONUSES[bt].name, x + 59, by + 15, 70, 12, '#fff');
    if (buyable) { const pr = M.nextBoosterPrice(b, bt); A.diamondIcon(ctx, x + 47, by + 31, 0.62); A.text(ctx, String(pr), x + 66, by + 31, 12, '#fff8c0'); }
    else A.text(ctx, `x${stock}`, x + 59, by + 31, 12, '#fff8c0');
    button('bonus' + bt, x - 2, hitY, w + 4, hitH, () => {
      if (buyable) { openBoosterDialog(bt); return; }
      if (!b.canUseBonus(bt)) { toast(b.bonusUsesLeft <= 0 ? `Max ${b.cfg.maxBonusUses} boosters per battle` : 'None left'); return; }
      if (C.BONUSES[bt].needsTarget) { S.sel = sel ? null : { kind: 'bonus', type: bt }; if (!sel) toast('Tap the trail to aim'); }
      else { b.useBonus(bt, 0, 0); }
    });
  });
  A.text(ctx, `${b.bonusUsesLeft}`, 234, by + 14, 14, '#ffb3c1'); A.text(ctx, 'left', 234, by + 30, 12, '#a08090', 'center', null);
  drawSpeedButton(256, by, 60, bh);
  button('speed', 252, hitY, 68, hitH, () => { S.speed = nextSpeed(S.speed); sfx('tap'); }); // v0.7.4 M0: 1x -> 2x -> 4x -> 1x, kept for the session only
  drawButton(324, by, 64, bh, 'II', '#fff3e6', { r: 12, size: 16 });
  button('pause', 320, hitY, 76, hitH, () => { setPaused(true); });
}
// v0.7.4 M0: the speed button - 1 / 2 / 3 vector chevrons (8 px wide, 3 px gap) over a 12 px label; colours 1x #ffd27a, 2x #ffb347, 4x #ff8a5c
const SPEED_COL = { 1: '#ffd27a', 2: '#ffb347', 4: '#ff8a5c' };
function drawSpeedButton(x, y, w, h) {
  const sp = S.speed, n = sp === 1 ? 1 : sp === 2 ? 2 : 3, col = SPEED_COL[sp] || SPEED_COL[1];
  drawButton(x, y, w, h, '', col, { r: 12 });
  const cw = 8, gap = 3, tw = n * cw + (n - 1) * gap, x0 = x + w / 2 - tw / 2, cy = y + h * 0.4, ch = 12;
  ctx.save(); ctx.fillStyle = A.INK;
  for (let i = 0; i < n; i++) { const px = x0 + i * (cw + gap); ctx.beginPath(); ctx.moveTo(px, cy - ch / 2); ctx.lineTo(px + cw, cy); ctx.lineTo(px, cy + ch / 2); ctx.closePath(); ctx.fill(); }
  ctx.restore();
  A.text(ctx, sp + 'x', x + w / 2, y + h - 11, 12, A.INK, 'center', null); // v0.7.5: 12 px (was 9)
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
// v0.8.0 (v0.7.10 plan 1.3 / spec 11.2): the gold 3-star bonus card. rt = seconds since T0. Reduced motion: a 200 ms fade-in, a 300 ms count, a single 'win' (no shake / burst / fly / particles).
function drawStarMoment(MO, rt, tRes) {
  const rm = reducedMotion(), CX = 200, CY = 345, T = MOMENT_T;
  const amount = rm ? Math.round(MO.amount * Math.min(1, Math.max(0, (rt - 0.2) / 0.3))) : Math.round(MO.amount * (1 - Math.pow(1 - Math.min(1, Math.max(0, (rt - T.burst) / (T.countDone - T.burst))), 3))); // v0.8.2 R5: the number holds its final value from t = 1.0 s
  let x = CX, y = CY, sc = 1, rot = 0, al = 1;
  if (rm) { al = rt < 0.2 ? rt / 0.2 : rt > 0.85 ? Math.max(0, 1 - (rt - 0.85) / 0.25) : 1; }
  else if (rt < T.drop) { const k = rt / T.drop; y = 150 + (CY - 150) * A.easeOutBack(k); sc = 0.6 + 0.4 * k; al = Math.min(1, k * 3); }
  else if (rt < T.shake) { const k = (rt - T.drop) / (T.shake - T.drop); rot = Math.sin(k * Math.PI * 6) * 0.07 * (1 - k); }
  else if (rt >= T.hold) { const k = Math.min(1, (rt - T.hold) / (T.fly - T.hold)), e = k * k; x = CX + (240 - CX) * e; y = CY + (468 - CY) * e; sc = 1 - 0.7 * e; al = 1 - 0.85 * e; }
  else if (rt >= T.count && rt < T.count + 0.12) { const k = (rt - T.count) / 0.12; sc = 1 + 0.08 * Math.sin(k * Math.PI); } // land squash
  if (!rm && rt >= T.shake - 0.01 && rt < T.burst + 0.2) { A.lightBurst(ctx, CX, CY, 150 * Math.min(1, (rt - T.shake + 0.05) / 0.3), tRes * 2, { alpha: 0.7, rays: 12 }); }
  if (!rm && rt >= T.burst && rt < T.burst + 0.35 && MO.sfx < 1) { MO.sfx = 1; sfx('upgrade'); }
  if (rm && rt >= 0.2 && MO.sfx < 1) { MO.sfx = 1; sfx('win'); }
  if (!rm && rt >= T.burst && rt < T.countDone) { const n = Math.floor((rt - T.burst) / 0.15); if (n > MO.sfx - 1 && n < 7) { MO.sfx = n + 2; sfx('pop'); } } // a rate-limited tick (<= 6) while the number counts
  ctx.save(); ctx.globalAlpha = Math.max(0, al); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc);
  A.drawBeveledTile(ctx, -76, -49, 152, 98, '#ffe58a', { lip: 5, r: 18, lw: 3, hi: 0.8 });
  A.rr(ctx, -72, -45, 144, 90, 15); ctx.lineWidth = 3; ctx.strokeStyle = '#f2a81d'; ctx.stroke();
  for (let i = 0; i < 3; i++) A.candyStar(ctx, -26 + i * 26, i === 1 ? -33 : -29, i === 1 ? 11 : 9, '#ffd23f', 1.8);
  A.coinIcon(ctx, -42, 3, 1.5);
  A.drawChunkyText(ctx, `+${amount}`, 10, 3, 40, { mode: 'title' });
  A.drawChunkyText(ctx, '3 STARS!', 0, 34, 16, { mode: 'btn' }); // v0.8.1 F4: 16 px label, 40 px number, same 152x98 footprint
  ctx.restore();
  if (!rm && rt >= T.burst && rt < T.burst + 0.5) { // <= 12 sparkles flung out of the card at the burst
    const k = (rt - T.burst) / 0.5; for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6 + 0.3, d = 40 + 70 * k * (0.7 + (i % 3) * 0.15); A.sparkle(ctx, CX + Math.cos(a) * d, CY + Math.sin(a) * d * 0.8, 5 * (1 - k * 0.6), i % 2 ? '#fff7a8' : '#ffe27a', a); }
  }
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
  const MO = R.moment || null, rtM = MO ? (R.skipped ? 99 : R.t - MO.t0) : 99, momentBusy = !!MO && !R.skipped && rtM < MO.dur; // v0.8.0: the 3-star card moment
  ctx.fillStyle = 'rgba(38,28,16,0.72)'; ctx.fillRect(-2000, -2000, W + 4000, H + 4000); // v0.8.0 palette: reward dim
  button('resultBlock', -2000, -2000, W + 4000, H + 4000, () => { if (momentBusy) R.skipped = true; }); // swallow taps on everything underneath (tray, bonuses, pause); the first tap skips the 3-star moment
  if (R.win && !reducedMotion()) A.lightBurst(ctx, RESULT_TREAT.x, RESULT_TREAT.y, 230, R.t, { alpha: 0.5 }); // v0.8.0: the light burst behind the panel (rays peek out around it)
  const celebrating = R.perfect && R.t < C.UI.perfectAnimTime;
  const pop = Math.min(1, R.t * 4); ctx.save(); ctx.translate(200, 360); ctx.scale(0.7 + pop * 0.3, 0.7 + pop * 0.3); ctx.translate(-200, -360);
  panel(36, 120, 328, 480, '#fff6ee', 18, { gold: R.win });
  const tk = C.treatOf(S.battle.levelIndex), TN = TREAT_NAME[tk] || 'Cookie';
  if (C.ART81) A.drawRewardHeader(ctx, A.rewardPalette(R.win, R.stars, R.perfect), R.skipped ? 99 : R.t, reducedMotion(), R.win && (R.stars >= 3 || R.perfect)); // v0.8.1 G3: ribbon + crown behind the title (inside the panel pop)
  const title = R.perfect ? `Perfect ${TN}!` : R.win ? `${TN} saved!` : `${TN} eaten!`;
  const ts = R.perfect ? 30 + Math.max(0, 0.3 - R.t) * 30 + Math.sin(R.t * 6) * 1.5 : 28;
  if (R.win) A.drawChunkyText(ctx, title, 200, 156, ts, C.ART81 ? { mode: 'title', fill: '#fff' } : { mode: 'title' }); else A.drawChunkyText(ctx, title, 200, 156, ts, { mode: 'plain', fill: C.ART81 ? '#fff' : '#ffb4ac' }); // v0.8.1 G3: white on the ribbon // v0.8.0: chunky title
  if (R.perfect) { ctx.save(); ctx.globalAlpha = 0.35 + Math.sin(R.t * 4) * 0.15; const g = ctx.createRadialGradient(200, 212, 10, 200, 212, 70); g.addColorStop(0, '#fff6a8'); g.addColorStop(1, 'rgba(255,246,168,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(200, 212, 70, 0, 7); ctx.fill(); ctx.restore();
    for (let i = 0; i < 8; i++) { const a = R.t * 0.8 + i * Math.PI / 4; A.starShape(ctx, 200 + Math.cos(a) * 52, 212 + Math.sin(a) * 40, 4, '#ffe36e', 1); } }
  if (R.win) { // v0.8.0 Option A: the treat is the hero - a coin pile under it (size grows with the coins won), then the treat at 1.1x
    const pk = 0.9 + Math.min(0.3, (out.coins || 0) / 600); A.drawCoinPile(ctx, RESULT_PILE.x, RESULT_PILE.y, Math.round(pk * 4) / 4);
    ctx.save(); ctx.translate(RESULT_TREAT.x, RESULT_TREAT.y); ctx.scale(RESULT_TREAT.k, RESULT_TREAT.k); A.drawTreat(ctx, tk, 0, 0, S.battle.foodStored / S.battle.cfg.foodHP, S.t, { face: 'happy' }); ctx.restore();
  } else { // defeat: the (nearly eaten) treat and TWO cheering ants - the only place the hero chibi pose is used besides the queen's taunt
    A.drawTreat(ctx, tk, 200, 205, 0.05, S.t, {});
    const hop = (k) => reducedMotion() ? 0 : Math.abs(Math.sin(S.t * 5 + k)) * 5;
    for (const [ax, k, ty] of [[92, 0, 'worker'], [308, 1.7, 'small']]) { const sp = A.antSprite(ty, 0, false, pxRatio * 1.25, 'cheer'); ctx.save(); ctx.translate(ax, 240 - hop(k)); ctx.scale(1.25 * (k ? -1 : 1), 1.25); ctx.drawImage(sp.cv, -sp.ox, -sp.oy, sp.w, sp.h); ctx.restore(); A.contactShadow(ctx, ax, 244, 20, 5, 0.22); }
  }
  if (R.queenKilled) plainFit(tk === 'pancake' ? 'Way to go, you saved the pancakes!' : tk === 'donut' ? 'Way to go, you saved the donut!' : tk === 'cake' ? 'Way to go, you saved the cake!' : tk === 'pie' ? 'Way to go, you saved the pie!' : tk === 'sundae' ? 'Way to go, you saved the sundae!' : 'Way to go, you saved the cookies!', 200, 180, 300, 13, '#e0607e', 'center', '800'); // v0.5 item 16
  for (let s = 0; s < 3; s++) { const gap = 0.35, on = s < R.stars && (reducedMotion() || R.t > 0.3 + s * gap); const sc = !on || reducedMotion() ? 1 : 1 + Math.max(0, 0.2 - (R.t - 0.3 - s * gap)) * 3; if (on && !((R._heard || 0) & (1 << s))) { R._heard = (R._heard || 0) | (1 << s); sfx(['starC', 'starE', 'starG'][s]); } A.starShape(ctx, 140 + s * 60, 270, 18 * sc, on ? '#ffd45e' : '#e8dde4', 2.5); }
  if (R.chip2 && R.t > 0.55) { // the 2-star chip: a small coin pill beside the stars, pops when the second star lands
    const k = Math.min(1, (R.t - 0.55) * 5), cx2 = 322, cy2 = 270; ctx.save(); ctx.translate(cx2, cy2); ctx.scale(0.6 + 0.4 * A.easeOutBack(k), 0.6 + 0.4 * A.easeOutBack(k)); A.drawBeveledTile(ctx, -32, -14, 64, 28, '#ffe9a8', { lip: 2, r: 14, lw: 2, hi: 0.6 }); A.coinIcon(ctx, -19, 0, 1.1); A.drawChunkyText(ctx, `+${R.chip2}`, 9, 0, 16, { mode: 'num' }); // v0.8.1 F4: 64x28 pill, 16 px number ctx.restore();
  }
  const bodyA = MO && !R.skipped ? Math.max(0, Math.min(1, (rtM - MOMENT_T.hold) / 0.35)) : 1; // rows / coin total fade in after the card has flown
  ctx.save(); ctx.globalAlpha = bodyA;
  A.text(ctx, `Food left: ${fmtFood(S.battle.foodStored)}/${S.battle.cfg.foodHP}   Ants beaten: ${R.kills}`, 200, 302, 12, '#7a5a6a', 'center', null); // v0.8.1 F3: fades in with the rows (was leaking through the dim before the card flew)
  // coin breakdown: win = food + kills (+ level, first clear) + time; loss = kills + time (capped together)
  // v0.6 item 1: "Time survived" = floor(battle seconds / 3) - its own line, on a win and on a loss
  const P = out.parts || {}; const rows = [];
  if (R.win) { rows.push(['Victory', P.base]); rows.push(['Food left', P.food]); rows.push(['Ants beaten', P.kills]); if (P.level) rows.push(['Level reward', P.level]); if (P.firstClear) rows.push(['First clear', P.firstClear]); if (P.stars) rows.push(['Star bonus', P.stars]); if (P.daily) rows.push(['Daily first win', P.daily]); } // v0.7.6 E1: first-time 2 / 3 star coins
  else rows.push(['Ants beaten', P.kills || 0]);
  rows.push([R.win ? 'Time survived' : `Time survived${out.coins >= C.ECONOMY.lossCap ? ` (max ${C.ECONOMY.lossCap})` : ''}`, P.time || 0]);
  const RS = rows.length > 5 ? 14 : 16;
  A.rr(ctx, 70, 316, 260, 14 + rows.length * RS, 10); ctx.fillStyle = '#f6ece8'; ctx.fill();
  rows.forEach(([l, v], i) => { A.text(ctx, l, 84, 330 + i * RS, 12, '#7a5a6a', 'left', null); A.text(ctx, `+${v}`, 316, 330 + i * RS, 12, '#c9962a', 'right', null); });
  let yy = 330 + rows.length * RS + 18;
  if (out.gems) { // v0.7.6 E3: boss first clear / first 3 stars -> a gems line beside the coin total
    A.coinIcon(ctx, 92, yy, 1.3); A.text(ctx, `+${out.coins} coins`, 146, yy + 1, 18, '#ffd45e', 'center');
    A.diamondIcon(ctx, 226, yy, 0.8); A.text(ctx, `+${out.gems} gems`, 240, yy + 1, 18, '#8fd0ff', 'left');
  } else { A.coinIcon(ctx, 150, yy, 1.3); A.text(ctx, `+${out.coins} coins`, 208, yy + 1, 18, '#ffd45e'); }
  if (C.ART81 && R.win && out.coins > 0 && !celebrating && !reducedMotion() && !R.coinSkip) { // v0.8.1 G4(b): up to 8 coins (18 px, spinning) fly pile -> total over 0.6 s, 60 ms apart
    const tx = out.gems ? 92 : 150, ty = yy, n = Math.min(8, Math.max(3, Math.ceil(out.coins / 12)));
    for (let i = 0; i < n; i++) {
      const s = (R.t - (R.perfect ? C.UI.perfectAnimTime : 0) - 0.35 - i * 0.06) / 0.6; if (s <= 0 || s >= 1) continue;
      const u = s * s * (3 - 2 * s), x = RESULT_PILE.x + (tx - RESULT_PILE.x) * u + Math.sin(i * 2.1) * 26 * (1 - u) * u * 2, y = RESULT_PILE.y + (ty - RESULT_PILE.y) * u - Math.sin(Math.PI * u) * 34;
      ctx.save(); ctx.translate(x, y); ctx.scale(Math.max(0.15, Math.abs(Math.cos(s * 9 + i))), 1); ctx.globalAlpha = Math.min(1, (1 - s) * 5); A.coinSprite(ctx, 0, 0, 9); ctx.restore();
    }
  }
  const gift = out.bossGift && !celebrating, twin = gift && out.prize; // v0.7.7 S1: a boss gift strip; with a Perfect prize too, the 'unspent crumbs' line gives its row to the second strip
  yy += 20; if (!twin) { A.text(ctx, `(${R.crumbsLeft} unspent crumbs vanish)`, 200, yy, 12, '#a08090', 'center', null); yy += 20; }
  if (!R.win) A.text(ctx, 'Win to earn cards and prizes!', 200, yy, 12, '#a08090', 'center', null);
  if (!R.win && R.hint) { // v0.8.1 U7 / v0.8.2 R4: one hint, wrapped to two lines (>= 12 px text) when it is longer than 38 chars
    const h = R.hint, mid = h.length > 38 ? (h.lastIndexOf(' - ', 40) > 10 ? h.lastIndexOf(' - ', 40) + 2 : h.lastIndexOf('. ', 40) > 10 ? h.lastIndexOf('. ', 40) + 1 : h.lastIndexOf(' ', Math.ceil(h.length / 2) + 4)) : -1;
    const lines = mid > 0 ? [h.slice(0, mid).trim(), h.slice(mid).replace(/^[- ]+/, '').trim()] : [h], ph = lines.length > 1 ? 40 : 26;
    A.rr(ctx, 50, yy + 14, 300, ph, 13); ctx.fillStyle = '#fff2b8'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = '#e0a830'; ctx.stroke();
    lines.forEach((ln, i) => plainFit(ln, 200, yy + 27 + i * 15, 280, 13, '#a8661a', 'center', '800'));
  }
  if (out.booster) { // v0.3 item 14: first clear of level 1 -> ONE Bomb
    A.rr(ctx, 70, yy - 12, 260, 26, 12); ctx.fillStyle = '#ffe9f0'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = '#ff9ab0'; ctx.stroke();
    ctx.save(); ctx.translate(92, yy + 1); ctx.scale(0.62, 0.62); A.drawBonusIcon(ctx, out.booster.id, S.t); ctx.restore();
    A.text(ctx, `First clear: +1 ${C.BONUSES[out.booster.id].name} booster`, 210, yy + 1, 12.5, '#e0607e', 'center', null); yy += 30;
  }
  // v0.7.7 P2: every strip is 30 px tall and the last one ends >= 8 px above the buttons (they start at y 540; was 532 with the strip ending about 3 px above them)
  const strip = (cy, pz, label, k) => {
    if (!(k > 0)) return; // v0.8.2 R5b: before its start time k < 0 made the scale negative - the prize pill drew upside-down during the 3-star count-up
    ctx.save(); ctx.translate(200, cy); ctx.scale(0.5 + k * 0.5, 0.5 + k * 0.5);
    A.rr(ctx, -130, -15, 260, 30, 14); ctx.fillStyle = '#fff2b8'; ctx.fill(); ctx.lineWidth = 2.4; ctx.strokeStyle = '#e0a830'; ctx.stroke();
    if (pz.kind === 'bonus') { ctx.save(); ctx.translate(-108, 0); ctx.scale(0.8, 0.8); A.drawBonusIcon(ctx, pz.id, S.t); ctx.restore(); }
    else { ctx.save(); ctx.translate(-108, 6); ctx.scale(0.42, 0.42); A.drawTower(ctx, pz.id, S.t, null); ctx.restore(); }
    A.text(ctx, label, 10, 1, 13, '#c47a12');
    ctx.restore();
  };
  const cardLabel = (pz, head) => (pz.newCard ? `${head}: new tower - ${C.TOWERS[pz.id].short}!` : `${head === 'Prize' ? 'You won a card' : head}: ${C.TOWERS[pz.id].short} L${pz.level}`);
  if (out.prize && !celebrating) {
    const k = Math.min(1, (R.t - C.UI.perfectAnimTime) * 4); const pz = out.prize;
    strip(yy + 12, pz, pz.kind === 'cards' ? cardLabel(pz, 'Prize') : `Prize: +${pz.count} ${C.BONUSES[pz.id].name} booster`, k);
  }
  if (gift) { // the boss gift: its own strip below the Perfect prize one when both are shown
    const k = Math.min(1, (R.t - C.UI.perfectAnimTime) * 4); strip(yy + 12 + (out.prize ? 34 : 0), out.bossGift, cardLabel(out.bossGift, 'Boss gift'), k);
  }
  if (!(out.prize && !celebrating) && !gift && R.win && !R.perfect && S.battle.stats.stolen > 0) A.text(ctx, 'Tip: lose no food at all for a Perfect prize', 200, yy + 10, 12, '#a08090', 'center', null);
  ctx.restore(); // bodyA
  ctx.restore();
  if (MO && rtM > -0.01 && rtM < MO.dur) drawStarMoment(MO, rtM, R.t); // the gold 3-star card (above everything in the panel)
  // confetti (v0.5 item 16: 3 stars or a full score; the Perfect win too)
  const released = !MO || R.skipped || rtM >= MOMENT_T.hold; // v0.8.1 F5: confetti + Perfect fireworks are held until the card has flown (rtM >= 1.9 s)
  if (released && R.pendingFw) { launchFireworks(...R.pendingFw); R.pendingFw = null; }
  if (released) for (const c of R.confetti) { c.vy += 420 * dt; c.x += c.vx * dt; c.y += c.vy * dt; c.r += dt * 8; if (c.y < 760) A.candyStar(ctx, c.x, c.y, 4 + (c.r * 7 % 3), c.c, 1.2, c.r); } // v0.8.0: <= 36 candy stars (was 90 rects)
  if (celebrating || (MO && !R.skipped && R.t < MO.t0 + MO.dur)) return; // buttons appear after the celebration (and after the 3-star moment, 2250 ms, or its first-tap skip) (the panel title is the only Perfect Cookie title)
  const by = 540;
  if (R.win && C.ART81) { const lvB = S.save.levels[S.levelIndex] || {}, st = lvB.stars || 0, bt = lvB.bestTime || 0; A.text(ctx, `Best: ${'\u2605'.repeat(st)}${'\u2606'.repeat(Math.max(0, 3 - st))}${bt ? ` \u00b7 ${Math.floor(bt / 60)}:${String(bt % 60).padStart(2, '0')}` : ''}`, 200, by - 22, 13, '#7a5a6a', 'center', null); } // v0.8.2 U14
  if (out.zapperGift && M.zapperGiftPending(S.save)) { // v0.6 item 5: first win of stage 2 -> straight to the map, where the gift waits
    drawButton(100, by, 200, 50, 'Continue', '#9fe0b5'); button('rcontinue', 100, by, 200, 50, () => { S.battle = null; go('map'); });
    return;
  }
  drawButton(52, by, 92, 50, 'Map', '#fff3e6'); button('rmap', 52, by - 3, 92, 56, () => { S.battle = null; go('map'); });
  drawButton(154, by, 92, 50, 'Retry', '#ffd27a'); button('rretry', 154, by - 3, 92, 56, () => openPrep(S.levelIndex));
  const hasNext = R.win && S.levelIndex + 1 < C.LEVELS.length;
  const ow6 = C.ART81 && hasNext && S.levelIndex === 49 && out.firstClear && M.worldUnlocked(S.save, 6);
  const ow7 = C.ART81 && hasNext && S.levelIndex === 59 && out.firstClear && M.worldUnlocked(S.save, 7);
  const openLbl = ow7 ? 'Open World 7' : ow6 ? 'Open World 6' : 'Next';
  drawButton(256, by, 92, 50, openLbl, '#9fe0b5', (ow6 || ow7) ? { disabled: !hasNext, size: 12 } : { disabled: !hasNext });
  if (hasNext) button('rnext', 256, by - 3, 92, 56, ow7 ? () => { S.battle = null; go('map'); S.worldReveal = { i: 60, t0: S.t }; } : ow6 ? () => { S.battle = null; go('map'); S.worldReveal = { i: 50, t0: S.t }; } : () => openPrep(S.levelIndex + 1));
}

// ---------------- CARDS / MERGE ----------------
// v0.5 item 1b: the bottom info panel (kept, a bit larger) shows the card's real stats at its level - range in tiles, power,
// fire rate - plus a one-line description and what the NEXT card level changes (item 5b).
function cardStatKeys(id) { return id === 'ball' ? ['power', 'rate', 'ballRadius'] : id === 'tractor' ? ['liftSize', 'rate', 'scoop'] : ['power', 'rate', 'range']; }
// v0.8.2 M7g: the Special row. state: 'locked' (card level < 5) | 'asleep' (CL >= 5, world < 6) | 'active'. level = a LEVELS entry (prep / battle) or null (Cards / Shop: the highest unlocked world).
function specialState(id, level, cl) {
  const T = C.TOWERS[id]; if (!T || !T.special) return null;
  if (!(cl >= C.SPECIAL_CARD_LEVEL)) return 'locked';
  const w = level ? level.world : M.highestWorld(S.save);
  return w >= C.SPECIALS_FROM_WORLD && C.TUNING.specials !== false ? 'active' : 'asleep';
}
function specialRow(id, st, x, cy, w) {
  const T = C.TOWERS[id], sp = T.special; ctx.save(); A.starShape ? A.starShape(ctx, x + 6, cy, 5.5, st === 'active' ? '#ffd24a' : '#d4cac2') : (ctx.beginPath(), ctx.arc(x + 6, cy, 4.5, 0, 7), ctx.fillStyle = st === 'active' ? '#ffd24a' : '#d4cac2', ctx.fill()); ctx.restore();
  const tx = x + 18, tw = w - 18;
  if (st === 'locked') plainFit(`Special unlocks at card level ${C.SPECIAL_CARD_LEVEL}`, tx, cy, tw, 12, '#8a7f86', 'left', '600');
  else if (st === 'asleep') { ctx.font = `800 12px ${A.FONT}`; const nw = ctx.measureText(sp.name).width; plainText(sp.name, tx, cy, 12, '#9a8f7a', 'left', '800'); plainFit(`Awakens in World ${C.SPECIALS_FROM_WORLD}`, tx + nw + 6, cy, tw - nw - 6, 12, '#9a8f7a', 'left', '600'); }
  else { ctx.font = `800 12px ${A.FONT}`; const nw = ctx.measureText(sp.name).width; plainText(sp.name, tx, cy, 12, A.shade(T.color, -0.4), 'left', '800'); plainFit(sp.short, tx + nw + 6, cy, tw - nw - 6, 12, INFO_INK, 'left', '600'); }
}
function cardInfoPanel(id, x, y, w, h, opt = {}) {
  const hasSp = !!(id && C.ART81 && C.TOWERS[id] && C.TOWERS[id].special && opt.special !== false);
  panel(x, y, w, h + (hasSp ? 14 : 0), '#ffffff', 14);
  S.layoutCardPanel = { x, y, w, h };
  if (!id) { plainText(opt.hint || 'Tap a card to see its stats.', x + w / 2, y + h / 2, 12.5, '#a08090', 'center', '600'); return; }
  const T = C.TOWERS[id], c = S.save.cards[id], own = c.unlocked, L = Math.max(1, c.level), capCard = highestWorldCap();
  fitText(T.name, x + 12 + Math.min(170, 9 * T.name.length) / 2, y + 16, 170, 14.5, '#ff8fab');
  plainFit(own ? (capCard && capCard < c.level ? `Card L${c.level} - fights as L${capCard}` : `Card L${c.level} (used in battle)`) : 'Not owned yet', x + w - 12, y + 16, 150, 12, INFO_SOFT, 'right', '700');
  const cmp = h < 108; // v0.7.2: the Cards / card screens give the panel less height (the tab bar took the bottom) -> a tighter layout
  plainFit(T.desc, x + 12, y + (cmp ? 33 : 37), w - 24, 12, INFO_INK, 'left', '500');
  const Le = capCard ? Math.min(L, capCard) : L; // v0.7.8 P2-1: the stats are the EFFECTIVE (capped) numbers - what the card does in battle in the highest unlocked world
  const atCap = !!(own && capCard && L >= capCard); // at/above the cap a further card level adds nothing yet -> no 'next level' preview or highlight
  const next = atCap ? [] : cardUpgradeDiff(id, L); const nk = new Set(next.map((d) => d.key));
  const keys = cardStatKeys(id), bw = (w - 24 - 12) / 3;
  keys.forEach((k, i) => {
    const bx = x + 12 + i * (bw + 6), by = y + (cmp ? 44 : 50), bh = cmp ? 36 : 38;
    A.rr(ctx, bx, by, bw, bh, 9); ctx.fillStyle = nk.has(k) ? '#eefbe9' : '#f7efeb'; ctx.fill(); ctx.lineWidth = nk.has(k) ? 2 : 1.2; ctx.strokeStyle = nk.has(k) ? '#8fd18f' : '#e0cfd4'; ctx.stroke();
    plainFit(k === 'scoop' ? 'Scoops' : statLabel(id, k), bx + 7, by + (cmp ? 9.5 : 10), bw - 12, 12, INFO_SOFT, 'left', '600');
    plainFit(k === 'scoop' ? '1 trail tile' : formatStat(id, k, towerStat(id, k, 1, Le)), bx + bw / 2, by + (cmp ? 24.5 : 26), bw - 10, 13.5, INFO_INK, 'center', '700');
  });
  const line = atCap ? `At the world cap (L${capCard}): higher cards add nothing yet` : next.length ? `Next card level L${L + 1}: ` + next.map((d) => diffText(id, d)).join(' + ') : 'Top card level (L10)!';
  plainFit(line, x + w / 2, y + (cmp ? h - 9 : 102), w - 20, 12, next.length ? '#2f8a36' : '#c9962a', 'center', '700');
  if (hasSp) { const capC = highestWorldCap(), Lc = capC ? Math.min(L, capC) : L; specialRow(id, specialState(id, null, own ? Lc : 0), x + 12, y + h + 7, w - 24); }
  if (h > 118 && !opt.noFoot) plainFit(opt.foot || (own ? 'Merge cards on its own screen to reach the next level.' : `Get it in the Shop (${M.unlockPrice(id)}c) or as a prize.`), x + w / 2, y + h - 13, w - 20, 12, '#a08090', 'center', '600');
}
// ---------------- v0.6 item 7: real card pictures (art window + name banner + level badge) ----------------
// The frame colour follows the level band (bronze 1-3, silver 4-6, gold 7-9, rainbow-pink 10). Used on the Cards screen, the
// per-card screen, the merge animation and the NEW CARD reveal.
const CARD_BANDS = [[3, '#d9965f', '#f3c79c'], [6, '#9fb2c8', '#e1e9f2'], [9, '#e8b830', '#ffe9a0'], [10, '#ff7fb8', '#ffd6ec']];
function cardBand(L) { return CARD_BANDS.find((b) => L <= b[0]) || CARD_BANDS[0]; }
function drawCardPic(x, y, w, h, type, opt = {}) {
  const T = C.TOWERS[type]; const L = opt.level || 1; const [, frame, frameLt] = cardBand(L);
  const Le = opt.cap ? Math.min(L, opt.cap) : L; // v0.7.7 P1-1: the badge and the pips show the level the card FIGHTS at in this world (min(level, cap)); the frame colour stays the card's own tier
  ctx.save();
  if (opt.dim) ctx.globalAlpha = 0.42;
  const r = Math.max(7, w * 0.12);
  A.rr(ctx, x, y + 3, w, h, r); ctx.fillStyle = 'rgba(74,52,66,0.25)'; ctx.fill();
  A.rr(ctx, x, y, w, h, r);
  if (opt.locked) { ctx.fillStyle = '#ddd3da'; ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = A.INK; ctx.stroke();
    A.rr(ctx, x + 5, y + 5, w - 10, h - 10, r - 3); ctx.fillStyle = '#eee6eb'; ctx.fill();
    A.text(ctx, '?', x + w / 2, y + h * 0.42, w * 0.38, '#fff');
    plainFit(opt.lockText || 'Locked', x + w / 2, y + h - 13, w - 10, 12, '#7a6a76', 'center', '700');
    ctx.restore(); return; }
  const fg = ctx.createLinearGradient(x, y, x + w, y + h); fg.addColorStop(0, frameLt); fg.addColorStop(0.5, frame); fg.addColorStop(1, frameLt);
  ctx.fillStyle = fg; ctx.fill();
  ctx.lineWidth = opt.selected ? 4 : 2.4; ctx.strokeStyle = opt.selected ? (opt.selCol || '#ff6f91') : A.INK; ctx.stroke();
  // art window
  // v0.6.1: compact (wide) tiles - the Shop grid - get a taller art window and no level pips, so the tower stays as big as on the old tile
  const compact = h < w * 1.1;
  const m = Math.max(4, w * 0.07), ax = x + m, ay = y + m, aw = w - 2 * m, ah = compact ? h - m * 1.6 - 19 : h * 0.66 - m;
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
  const by = ay + ah + (compact ? 2 : 3), bh = compact ? 16 : Math.max(16, h * 0.16); // v0.7.6 V3: the banner is tall enough for a 12 px name
  A.rr(ctx, x + m * 0.6, by, w - m * 1.2, bh, bh * 0.4); ctx.fillStyle = A.shade(T.color, -0.15); ctx.fill(); ctx.lineWidth = 1.6; ctx.strokeStyle = A.INK; ctx.stroke();
  fitText(T.short || T.name, x + w / 2, by + bh / 2 + 0.5, w - m * 1.2 - 3.4, Math.min(14, Math.max(12, bh * 0.78)), '#fff');
  // level pips along the bottom (10 dots, filled up to the level)
  const py = by + bh + (y + h - by - bh) / 2, n = C.MAX_CARD_LEVEL, gap = Math.min(7, (w - 2 * m - 6) / n);
  if (!compact) for (let i = 0; i < n; i++) { ctx.beginPath(); ctx.arc(x + w / 2 - (n - 1) * gap / 2 + i * gap, py, Math.max(1.6, gap * 0.32), 0, 7); ctx.fillStyle = i < Le ? '#fff6c0' : 'rgba(74,52,66,0.25)'; ctx.fill(); }
  // level badge (top-left, overlapping the frame)
  const bs = Math.max(12, w * 0.15); // v0.8.1 F2: every text is >= 12 px (no exceptions)
  const capped = Le < L, bcx = x + bs * 0.75, bcy = y + bs * 0.75;
  A.blob(ctx, bcx, bcy, bs, bs * 0.92, capped ? '#ffc2d4' : '#ffe36e', 2); A.text(ctx, 'L' + Le, bcx, bcy + 0.5, 12, '#7a4a2a', 'center', null);
  if (capped) { // v0.7.7 P1-1: a small down-triangle marks "your card is higher than the cap" (no extra text, nothing over the tower picture)
    const tx = bcx + bs * 0.62, ty = bcy + bs * 0.66; ctx.beginPath(); ctx.moveTo(tx - 4, ty - 3); ctx.lineTo(tx + 4, ty - 3); ctx.lineTo(tx, ty + 3.4); ctx.closePath();
    ctx.fillStyle = '#b0506a'; ctx.fill(); ctx.lineWidth = 1.5; ctx.lineJoin = 'round'; ctx.strokeStyle = A.INK; ctx.stroke();
  }
  // v0.6.1 (item 7 consistency): the Shop + pre-battle screens use this card picture too -> deck-slot badge + trail/air tag
  if (opt.tag && !opt.badge) { const tag = T.place === 'path' ? 'on trail' : (T.targets === 'air' ? 'air only' : type === 'laser' ? 'gnd+air' : '');
    if (tag) A.text(ctx, tag, ax + aw - 3, ay + 8, 12, '#fff', 'right'); }
  if (opt.badge) { A.blob(ctx, x + w - 11, y + 11, 11, 11, '#ff8fab', 2); A.text(ctx, opt.badge, x + w - 11, y + 11.5, 12, '#fff'); }
  if (opt.count != null) { const str = `\u00d7${opt.count}`; ctx.font = `bold 12px ${A.FONT}`; const cw = Math.max(24, ctx.measureText(str).width + 10);
    A.rr(ctx, x + w - cw - 2, y + 3, cw, 18, 9); ctx.fillStyle = opt.count ? '#ffffff' : '#efe6ea'; ctx.fill(); ctx.lineWidth = 1.8; ctx.strokeStyle = A.INK; ctx.stroke();
    A.text(ctx, str, x + w - cw / 2 - 2, y + 12.5, 12, opt.count ? '#ff6f91' : '#b9a6b2'); }
  if (opt.mergeReady) { const p = 1 + Math.sin(S.t * 6) * 0.08; ctx.save(); ctx.translate(x + w - 10, y + 10); ctx.scale(p, p); A.blob(ctx, 0, 0, 11, 11, '#ff6f91', 2); A.text(ctx, '!', 0, 0.5, 14, '#fff'); ctx.restore(); }
  if (opt.spStar) { ctx.beginPath(); ctx.arc(x + 11, y + 32, 8.5, 0, 7); ctx.fillStyle = '#5a4058'; ctx.fill(); A.starShape(ctx, x + 11, y + 32, 5.8, '#ffd24a', 1.2); } // v0.8.2 M7g: a tiny star badge = this card's special is active (prep: in this world; Cards: in the highest unlocked world)
  if (opt.fresh) { A.rr(ctx, x + w / 2 - 19, y - 9, 38, 17, 8); ctx.fillStyle = '#ffd45e'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = A.INK; ctx.stroke(); A.text(ctx, 'NEW', x + w / 2, y - 0.5, 12, '#fff'); }
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
  if (C.ART81) { drawButton(274, 16, 106, 36, 'Ant Book', '#d6f0c8', { size: 13 }); button('antbook', 274, 8, 106, 52, () => { sfx('tap'); S.screen = 'antbook'; S.antBookSel = null; }); } // v0.8.2 U15
  A.coinIcon(ctx, 304, 60, 1); A.text(ctx, String(S.save.coins), 336, 61, 15, '#ffd45e');
  plainText('Tap a card: stats.  Tap again: open.', 28, 60, 12, '#7a5a6a', 'left', '600');
  S.layoutMerge = [];
  C.ALL_CARDS.forEach((id, k) => {
    const col = k % 4, row = Math.floor(k / 4);
    const x = 30 + col * 88, y = 80 + row * 104, w = 76, h = 96;
    const c = S.save.cards[id]; const ready = c.unlocked && M.mergeReady(S.save, id);
    drawCardPic(x, y, w, h, id, { locked: !c.unlocked, lockText: 'Shop or prize', level: c.level, selected: S.cardsSel === id, mergeReady: ready, fresh: c.fresh, spStar: !!(C.ART81 && c.unlocked && specialState(id, null, Math.min(c.level, highestWorldCap() || 99)) === 'active') });
    button('card' + id, x, y, w, h, () => { if (S.cardsSel === id && c.unlocked) openCardView(id); else S.cardsSel = id; sfx('tap'); });
    if (ready) S.layoutMerge.push(id);
  });
  cardInfoPanel(S.cardsSel, 24, 490, 352, 98, { hint: 'Tap a card to see its stats.', noFoot: true });
  // v0.7.2 C16: Back / Shop are gone (tab bar); Open card + Merge all share one row above the bar
  const anyReady = M.anyMergeReady(S.save), selOpen = !!(S.cardsSel && S.save.cards[S.cardsSel].unlocked);
  if (selOpen) {
    const ready = M.mergeReady(S.save, S.cardsSel);
    drawButton(24, 604, 172, 34, ready ? 'Open card  !' : 'Open card', ready ? '#ff9ec0' : '#fff3e6', { size: 15, r: 12 });
    button('open' + S.cardsSel, 24, 590, 172, 58, () => openCardView(S.cardsSel));
  }
  drawButton(204, 604, 172, 34, 'Merge all', anyReady ? '#9fe0b5' : '#e6dce2', { size: 15, r: 12, disabled: !anyReady }); button('mergeAll', 204, 590, 172, 58, doMergeAll);
  if (S.mergeAnim) renderMergeAnim();
  else if (S.save.onboard && S.save.onboard.cardsHint === 'cards' && S.save.cards.zapper.unlocked) { // v0.7: once, after the free pack
    const k = C.ALL_CARDS.indexOf('zapper'), x = 30 + (k % 4) * 88, y = 80 + Math.floor(k / 4) * 104;
    onboardSpot({ x, y, w: 76, h: 96, r: 12 }, 'cardzapper', () => { S.save.onboard.cardsHint = 'done'; if (C.ART81) M.armNextHint(S.save, 'card'); persist(); openCardView('zapper'); }, 'Your Bug Zapper - it hits flying ants!',
      { x: 122, y: 80 + Math.floor((C.ALL_CARDS.length - 1) / 4) * 104 + 28, w: 272 }); // right of the last row's lone card (C.ALL_CARDS.length % 4 === 1)
  }
}
function openCardView(id) { S.cardView = id; S.cardsSel = id; const c = S.save.cards[id]; if (c.fresh) { c.fresh = false; persist(); } go('card'); }
// One card type's own screen (v0.6 items 4 + 7): a card picture for EACH level you hold (x count), and a Merge button under
// every level: 3 cards of a level -> 1 card of the next level, at every level.
// v0.7.7 S-1: the card-level cap of the highest world the player has unlocked, and the per-world line 'W1 acts as L4, W2 as L5' (worlds 1..max(2, highest unlocked))
function highestWorldCap() { const W = C.WORLDS.find((x) => x.id === M.highestWorld(S.save)); return (W && W.cardLevelCap) || null; }
function worldCapLine() { const top = Math.max(2, M.highestWorld(S.save)); return C.WORLDS.filter((W) => W.id <= top && W.cardLevelCap).map((W, k) => (k === 0 ? `W${W.id} acts as L${W.cardLevelCap}` : `W${W.id} as L${W.cardLevelCap}`)).join(', '); }
function renderCardView() {
  const id = S.cardView; const T = C.TOWERS[id]; const c = S.save.cards[id];
  panel(12, 12, 376, 636, '#fff6ee');
  A.text(ctx, T.name, 200, 36, 24, '#b5d8ff');
  drawButton(22, 18, 66, 28, 'Back', '#fff3e6', { size: 13, r: 10 }); button('cvBack', 14, 8, 84, 48, () => go('cards')); // v0.7.2: small Back (the tab bar's Cards tab also returns to the list)
  drawCardPic(28, 58, 104, 136, id, { level: c.level, locked: !c.unlocked });
  const capNow = highestWorldCap(); // v0.7.7 S-1
  plainText(c.unlocked ? `Fights as L${capNow ? Math.min(c.level, capNow) : c.level}` : 'Not unlocked yet', 146, 76, 15, INFO_INK, 'left', '800');
  plainText('3 cards of a level \u2192 1 of the next', 146, 98, 12, INFO_SOFT, 'left', '600');
  plainText('Your highest level fights.', 146, 114, 12, INFO_SOFT, 'left', '600');
  if (c.unlocked) plainFit(worldCapLine(), 146, 130, 236, 12, INFO_SOFT, 'left', '700'); // v0.7.7 S-1: e.g. 'W1 acts as L4, W2 as L5'
  plainText(`Cards held: ${M.totalCards(c)}`, 146, 146, 12, INFO_SOFT, 'left', '600');
  A.coinIcon(ctx, 158, 170, 1); A.text(ctx, String(S.save.coins), 190, 171, 15, '#ffd45e');
  const rows = M.mergeRows(S.save, id);
  plainText('Your cards by level', 28, 212, 12, '#3d2a36', 'left', '800');
  rows.forEach((r, k) => {
    const col = k % 5, row = Math.floor(k / 5);
    const x = 26 + col * 70, y = 224 + row * 138, w = 62, h = 80;
    drawCardPic(x, y, w, h, id, { level: r.L, count: r.have, dim: r.have === 0, still: true });
    if (r.maxed) { plainText('top level', x + w / 2, y + h + 16, 12, '#c9962a', 'center', '700'); return; }
    const can = M.canMergeAt(S.save, id, r.L);
    plainFit(`${Math.min(r.have, r.need)}/${r.need}`, x + w / 2, y + h + 9, w, 12, r.ready ? '#2f8a36' : '#a08090', 'center', '700');
    drawButton(x, y + h + 17, w, 24, `\u2192 L${r.to}`, can ? '#ff9ec0' : '#e6dce2', { size: 12, r: 9, disabled: !can });
    if (r.coins) plainFit(`${r.coins} coins`, x + w / 2, y + h + 50, w, 12, '#c9962a', 'center', '700');
    button('mrg' + r.L, x - 3, y + h + 2, w + 6, 58, () => { // touch target covers the n/3 label, the button and its price (>= 44 px)
      if (!r.ready) { toast(`Need ${r.need} cards of level ${r.L}`); return; }
      if (S.save.coins < r.coins) { toast(`Need ${r.coins} coins`); return; }
      const res = M.mergeAt(S.save, id, r.L);
      if (res) { persist(); sfx('upgrade'); S.mergeAnim = { id, from: r.L, to: res.to, n: r.need, t: 0 }; }
    });
  });
  cardInfoPanel(id, 24, 497, 352, 97, {});
  const ready = M.mergeReady(S.save, id);
  drawButton(24, 604, 352, 34, 'Merge all', ready ? '#9fe0b5' : '#e6dce2', { size: 15, r: 12, disabled: !M.anyMergeReady(S.save) }); button('cvMergeAll', 24, 604, 352, 44, doMergeAll);
  if (S.mergeAnim) renderMergeAnim();
}
// Merge animation: the 3 merged cards fly into one, flash, it grows and the level badge flips to the new level.
function renderMergeAnim() {
  const MA = S.mergeAnim; MA.t += (1 / 60) * (C.ART81 ? 2.3 / 1.5 : 1); const T = C.UI.mergeAnimTime; const k = MA.t / T;
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
  if (C.ART81) drawButton(274, 16, 106, 36, `Cabinet ${M.skinState(S.save).owned.length}/${C.SKINS.length}`, '#ffd0e6', { size: 13 }), button('cabinet', 274, 8, 106, 52, () => { sfx('tap'); S.screen = 'cabinet'; }); // v0.8.2 EC5a
  panel(62, 56, 132, 32, '#e6f5ff', 16); A.diamondIcon(ctx, 84, 72, 1); A.text(ctx, String(S.save.diamonds || 0), 140, 73, 17, '#7fd3ff');
  panel(206, 56, 132, 32, '#fff1d6', 16); A.coinIcon(ctx, 228, 72, 1.1); A.text(ctx, String(S.save.coins), 284, 73, 17, '#ffd45e');
  plainText('No real money, ever. Diamonds come from Daily Rewards.', 200, 101, 12, '#a08090', 'center', '600');
  // pack
  panel(26, 112, 348, 62, '#ffe9f0', 14);
  for (let k = 0; k < 3; k++) { ctx.save(); ctx.translate(58 + k * 14, 146 - k * 3); ctx.rotate(-0.2 + k * 0.2); A.rr(ctx, -14, -20, 28, 38, 6); ctx.fillStyle = ['#ffb3c1', '#b5d8ff', '#ffd27a'][k]; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = A.INK; ctx.stroke(); A.text(ctx, '?', 0, 0, 16); ctx.restore(); }
  const gift = M.zapperGiftPending(S.save); // v0.6 item 5: the one-time FREE 5-card gift takes the pack's place
  if (gift) {
    A.text(ctx, `FREE pack: ${E.cardPackSize} cards!`, 112, 132, 14, '#e0607e', 'left', null);
    A.text(ctx, `${E.cardPackSize - 1} random + Zapper`, 112, 152, 12, '#a08090', 'left', null); // v0.7 D-P0
    drawButton(290, 122, 74, 40, 'FREE', '#9fe0b5', { size: 17 });
  } else {
    A.text(ctx, `Card pack: ${E.cardPackSize} random cards`, 112, 132, 13, '#7a4a5a', 'left', null);
    { const left = Math.max(1, (E.packPity || 0) - (S.save.packsSinceNew || 0)); // v0.6.2 item 13 + v0.7 D-P3 pity
      plainFit(M.lockedCards(S.save).length ? `level 1, ${Math.round(E.packNewTowerChance * 100)}% NEW tower${E.packPity ? ` (sure in ${left})` : ''}` : 'level 1, any unlocked tower', 112, 152, 172, 12, '#a08090', 'left', '700'); }
    drawButton(290, 122, 74, 40, `${E.cardPack}c`, '#9fe0b5', { size: 15, disabled: S.save.coins < E.cardPack });
    // v0.7: every pack opens the pack reveal (no toast, no separate NEW CARD reveal; a new tower is the last card)
    button('pack', 286, 119, 82, 46, () => { const got = M.buyPack(S.save); if (got) { persist(); shopBought('pack', 'pack', E.cardPack, 'coin'); openPackReveal(got, { source: 'paid', newTower: got.newTower }); } else toast('Not enough coins'); });
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
    A.blob(ctx, x + 10, y + h + 10, 8, 8, S.shopSel === id ? '#5a9fe0' : '#d7e8ff', 1.6); A.text(ctx, 'i', x + 10, y + h + 10.5, 12, '#fff');
    plainText(own ? `${E.cardL1}c` : `${up}c`, x + w - 4, y + h + 10, 12, own ? '#c9962a' : '#e0607e', 'right', '800');
    button('buy' + id, x, y, w, h, () => {
      S.shopSel = id;
      if (own) { if (M.buyCard(S.save, id)) { persist(); sfx('tap'); shopBought('card', id, E.cardL1, 'coin'); } else toast('Not enough coins'); }
      else if (M.buyCardUnlock(S.save, id)) { persist(); sfx('upgrade'); shopBought('card', id, up, 'coin'); queueReveal(id, 1, true, S.t + 0.3); }
      else toast(`Need ${up} coins`);
    });
    button('info' + id, x - 6, y + h - 22, 48, 44, () => { S.shopSel = S.shopSel === id ? null : id; sfx('tap'); });
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
    fitText(C.BONUSES[bt].name, x + w / 2, y + 46, w - 8, 12, '#fff');
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
// ---------------- v0.8.2 U15: the Ant Book ----------------
function antLabelLines(name, w) { // v0.8.3 F8: font stays 12 px; wider than the card minus 8 px -> two lines at the first space
  ctx.font = `bold 12px ${A.FONT}`; const sp = name.indexOf(' '); return ctx.measureText(name).width <= w - 8 || sp < 0 ? [name] : [name.slice(0, sp), name.slice(sp + 1)];
}
function renderAntBook() {
  const met = M.metAnts(S.save), keys = Object.keys(C.ANTS);
  panel(12, 12, 376, 636, '#fff6ee');
  A.text(ctx, 'Ant Book', 200, 36, 26, '#9fd08a');
  drawButton(22, 16, 72, 36, 'Back', '#d9cfe0', { size: 14 }); button('abBack', 22, 14, 72, 42, () => { sfx('tap'); if (S.antBookSel) S.antBookSel = null; else S.screen = 'cards'; });
  const sel = S.antBookSel && met.has(S.antBookSel) ? S.antBookSel : null;
  if (!sel) {
    plainText(`Met ${keys.filter((k) => met.has(k)).length}/${keys.length}. Tap an ant for details.`, 200, 70, 12, '#7a5a6a', 'center', '700');
    keys.forEach((t, k) => {
      const col = k % 4, row = Math.floor(k / 4), x = 24 + col * 88, y = 86 + row * 92, w = 80, h = 84, D = C.ANTS[t], m = met.has(t);
      A.rr(ctx, x, y, w, h, 12); ctx.fillStyle = m ? '#fff' : '#efe3de'; ctx.fill(); ctx.lineWidth = 2.2; ctx.strokeStyle = A.INK; ctx.stroke();
      const nm = m ? antLabelLines(D.name.replace(' Ant', ''), w) : null, two = !!nm && nm.length > 1; // v0.8.3 F8: a long name wraps at the space, the label block rises 12 px, never an ellipsis
      ctx.save(); A.rr(ctx, x + 2, y + 2, w - 4, h - 26 - (two ? 12 : 0), 10); ctx.clip(); ctx.translate(x + w / 2, y + 40 - (two ? 6 : 0)); const sz = Math.min(1, 1.3 / D.size); ctx.scale(0.82 * sz, 0.82 * sz); if (m) A.drawAnt(ctx, t, (S.t * 1.3) % 1); else { ctx.globalAlpha = 0.35; A.drawAnt(ctx, t, 0); ctx.globalAlpha = 0.78; ctx.fillStyle = '#efe3de'; ctx.fillRect(-26, -26, 52, 52); } ctx.restore();
      if (m) { nm.forEach((ln, i) => fitText(ln, x + w / 2, y + 70 - (two ? 12 : 0) + (two ? i * 12 : 0), w - 8, 12, '#7a4a5e')); if (__TEST_HOOKS__) { (window.__abLabels ||= {})[t] = nm.map((ln) => { ctx.font = `bold ${fitSize(ln, w - 8, 12, 'bold')}px ${A.FONT}`; return [ln, +ctx.measureText(ln).width.toFixed(1), w]; }); } } else plainText('???', x + w / 2, y + 70, 13, '#b9a6b2', 'center', '800');
      if (m) button('ab' + t, x, y, w, h, () => { S.antBookSel = t; sfx('tap'); });
    });
  } else {
    const D = C.ANTS[sel], lv = M.antLevels(sel);
    ctx.save(); ctx.translate(200, 168); const sz = Math.min(1, 1.3 / D.size); ctx.scale(1.9 * sz, 1.9 * sz); if (!D.flying) A.contactShadow(ctx, 0, 16, 22, 5, 0.22); A.drawAnt(ctx, sel, (S.t * 1.3) % 1); ctx.restore();
    A.text(ctx, D.name, 200, 226, 22, '#7a4a5e');
    const mx = { hp: Math.max(...Object.values(C.ANTS).map((a) => a.hp)), speed: Math.max(...Object.values(C.ANTS).map((a) => a.speed)) };
    [['HP', Math.log(1 + D.hp) / Math.log(1 + mx.hp), `${D.hp}`, '#ff8aa0'], ['Armor', Math.min(1, (D.armor || 0) / 6), `${D.armor || 0}`, '#8fb8f0'], ['Speed', D.speed / mx.speed, `${D.speed}`, '#9fe0b5']].forEach(([l, f, v, c], i) => {
      const y = 258 + i * 28; A.text(ctx, l, 46, y + 8, 13, '#7a5a6a', 'left', null); A.rr(ctx, 110, y, 200, 16, 8); ctx.fillStyle = '#f0e0d8'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = A.INK; ctx.stroke();
      if (f > 0.03) { A.rr(ctx, 112, y + 2, 196 * Math.min(1, f), 12, 6); ctx.fillStyle = c; ctx.fill(); } A.text(ctx, v, 350, y + 8, 13, '#7a5a6a', 'right', null); });
    if (D.flying) A.text(ctx, 'Flies: only air-capable towers hit it', 200, 348, 12, '#4a90e2', 'center', null);
    const lines = wrapLines(C.ANT_CARD[sel] || D.intro || D.desc || '', 320, 14); lines.forEach((l, k) => A.text(ctx, l, 200, 376 + k * 19, 14, '#5a4652', 'center', null));
    const shown = lv.slice(0, 12).map((n) => `L${n}`).join(' '), ly = 376 + lines.length * 19 + 16;
    A.text(ctx, 'Seen on', 200, ly, 13, '#7a5a6a', 'center', null); wrapLines(shown + (lv.length > 12 ? ' ...' : ''), 320, 13).forEach((l, k) => A.text(ctx, l, 200, ly + 20 + k * 16, 13, '#a08090', 'center', null));
  }
}
// ---------------- v0.8.2 EC5a: the cosmetic cabinet (coins; colour only) ----------------
function renderCabinet() {
  const st = M.skinState(S.save);
  panel(12, 12, 376, 636, '#fff6ee');
  A.text(ctx, 'Cabinet', 200, 36, 28, '#ffd27a');
  drawButton(22, 16, 72, 36, 'Back', '#d9cfe0', { size: 14 }); button('cabBack', 22, 14, 72, 42, () => { sfx('tap'); S.cabAsk = null; S.screen = 'shop'; });
  panel(206, 56, 132, 32, '#fff1d6', 16); A.coinIcon(ctx, 228, 72, 1.1); A.text(ctx, String(S.save.coins), 284, 73, 17, '#ffd45e');
  plainText('Skins change a pad colour only - never stats.', 200, 108, 12, '#7a5a6a', 'center', '700');
  C.SKIN_TOWERS.forEach((tw, i) => {
    const y0 = 124 + i * 114;
    plainText(C.TOWERS[tw].name, 30, y0 + 8, 14, '#7a4a5a', 'left', '800');
    const chips = [{ id: null, name: 'Classic', pad: A.TOWER_PAD[tw] }].concat(C.SKINS.filter((x) => x.tower === tw));
    chips.forEach((ch, k) => {
      const x = 26 + k * 88, y = y0 + 18, w = 80, h = 86, own = ch.id == null || st.owned.includes(ch.id), on = (st.equipped[tw] || null) === ch.id;
      A.rr(ctx, x, y, w, h, 14); ctx.fillStyle = own ? '#fff' : '#f3e6e0'; ctx.fill(); ctx.lineWidth = on ? 4 : 2.5; ctx.strokeStyle = on ? '#52b955' : A.INK; ctx.stroke();
      ctx.beginPath(); ctx.ellipse(x + w / 2, y + 28, 22, 12, 0, 0, 7); ctx.fillStyle = ch.pad; ctx.fill(); ctx.lineWidth = 2.2; ctx.strokeStyle = A.INK; ctx.stroke();
      ctx.beginPath(); ctx.ellipse(x + w / 2, y + 25, 16, 6, 0, Math.PI * 1.05, Math.PI * 1.95); ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(255,255,255,0.45)'; ctx.stroke();
      fitText(ch.name, x + w / 2, y + 54, w - 8, 12, '#7a5a6a');
      const lab = on ? 'On' : own ? 'Owned' : `${ch.price}c`, col = on ? '#3a9a45' : own ? '#7a5a6a' : (S.save.coins >= ch.price ? '#c9962a' : '#e0607e');
      plainText(lab, x + w / 2, y + 73, 13, col, 'center', '800');
      button('skin' + (ch.id || tw), x, y, w, h, () => {
        if (own) { M.equipSkin(S.save, tw, ch.id); persist(); sfx('tap'); S.cabAsk = null; return; }
        S.cabAsk = { id: ch.id, name: ch.name, price: ch.price }; sfx('tap');
      });
    });
  });
  const nx = M.nextSkinPrice(S.save);
  plainText(`Owned ${st.owned.length}/${C.SKINS.length}${nx ? ` - next skin ${nx}c` : ' - all collected!'}`, 200, 612, 13, '#7a5a6a', 'center', '700');
  if (S.cabAsk) { // v0.8.4 EC11: a buy confirms before the coins leave
    const ask = S.cabAsk, afford = (S.save.coins || 0) >= ask.price;
    ctx.fillStyle = 'rgba(60,40,55,0.45)'; ctx.fillRect(-2000, -2000, W + 4000, H + 4000);
    button('cabBlock', -2000, -2000, W + 4000, H + 4000, () => {});
    panel(44, 250, 312, 180, '#fff6ee');
    A.text(ctx, 'Buy this skin?', 200, 286, 20, '#ffd27a');
    plainFit(`${ask.name} for ${ask.price} coins`, 200, 322, 280, 14, '#7a5a6a', 'center', '700');
    drawButton(64, 360, 128, 46, 'Cancel', '#fff3e6'); button('cabNo', 60, 358, 136, 52, () => { S.cabAsk = null; sfx('tap'); });
    drawButton(208, 360, 128, 46, 'Buy', '#9fe0b5', { disabled: !afford });
    button('cabYes', 204, 358, 136, 52, () => {
      if (!afford) { toast(`Need ${ask.price} coins`); return; }
      const r = M.buySkin(S.save, ask.id); S.cabAsk = null;
      if (r.ok) { persist(); sfx('upgrade'); toast(`${ask.name} unlocked!`); } else toast(r.reason === 'coins' ? `Need ${ask.price} coins` : 'Not available');
    });
  }
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
// v0.8.1 J10: haptics through the web Vibration API (the Android WebView honours it with the normal VIBRATE permission; no plugin, no INTERNET). light 12 ms, medium 26 ms, heavy 40-30-60 ms.
// save.settings.haptics === false -> never called. Missing API (desktop / iOS) -> silent no-op. Tests count calls through window.__haptics.
const HAPTIC_MS = { light: 12, medium: 26, heavy: [40, 30, 60] };
function haptic(kind) {
  if (!C.ART81 || !HAPTIC_MS[kind]) return;
  if (S.save && S.save.settings && S.save.settings.haptics === false) return;
  try { (window.__hapticLog || (window.__hapticLog = [])).push(kind); if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(HAPTIC_MS[kind]); } catch (e) { /* no vibration support */ }
}
// v0.8.1 J12: the in-game setting wins ('on' / 'off'); 'auto' follows the OS media query
function reducedMotion() { const rmS = S.save && S.save.settings && S.save.settings.reduceMotion; if (rmS === 'on') return true; if (rmS === 'off') return false; try { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) { return false; } }
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
    packFire('flip' + i, f0, () => { sfx('cardFlip'); haptic('light'); });
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
    fitText(C.TOWERS[cd.id].short || C.TOWERS[cd.id].name, cx, ny, W2, 12, '#ffffff');
    const pk = inSummary ? 1 : Math.max(0, Math.min(1, (t - f0 - PACK.flipDur / 2) / PACK.pip));
    if (cd.maxed) plainText('MAX', cx, ny + 18, 12, '#ffe36e', 'center', '800');
    else {
      const filled = Math.min(cd.need, cd.have);
      for (let p = 0; p < cd.need; p++) {
        const px = cx - 14 + p * 14, py = ny + 18; const isNewPip = p === filled - 1;
        ctx.beginPath(); ctx.arc(px, py, 4.6, 0, 7); ctx.lineWidth = 1.8; ctx.strokeStyle = '#ffffff'; ctx.stroke();
        if (p < filled) { ctx.beginPath(); ctx.arc(px, py, 4.6 * (isNewPip ? pk : 1), 0, 7); ctx.fillStyle = '#ffe36e'; ctx.fill(); }
      }
      plainText(`${Math.min(cd.have, cd.need)}/${cd.need} \u2192 L2`, cx, ny + 34, 12, '#ffe9c0', 'center', '700');
      if (cd.ready && pk >= 1) drawMergeTag(cx, ny + 54);
    }
    if (cd.isNew) { // "NEW" ribbon across the top-right corner
      ctx.save(); ctx.translate(tx + W2 - 6, ty + 8); ctx.rotate(Math.PI / 4);
      A.rr(ctx, -24, -8, 48, 16, 4); ctx.fillStyle = '#ffe36e'; ctx.fill(); ctx.lineWidth = 1.8; ctx.strokeStyle = A.INK; ctx.stroke();
      A.text(ctx, 'NEW', 0, 0.5, 12, '#e0607e', 'center', null); ctx.restore();
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
  A.text(ctx, 'MERGE!', cx + 5, y + 0.5, 12, '#ffffff', 'center', null);
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
if (__TEST_HOOKS__) window.__caps = () => ({ ...CAPS, frameAvg: CAPW.avg, frameWinMax: CAPW.wmax });
if (__TEST_HOOKS__) window.__game = {
  S, C, M, A, Cal, Treat,
  setClockOffset(ms) { S.clockOffset = ms; }, now, heartbeat, openCalendar, maybeShowCalendar,
  hitAt: (cx, cy) => { const p = { x: (cx - offX) / scale, y: (cy - offY) / scale }; const b = hit(prevButtons, p.x, p.y); return b ? b.id : null; },
  buttons: () => prevButtons.map(({ id, x, y, w, h }) => ({ id, x, y, w, h, sx: offX + (x + w / 2) * scale, sy: offY + (y + h / 2) * scale, cssW: w * scale, cssH: h * scale })),
  go, openPrep, startBattle, finishBattle, consumeEvents, openCardView, queueReveal, launchFireworks, startMode, nodePos, gateY, maxMapScroll,
  claimGift, doMergeAll, openPackReveal, skipPack, closePack, upgradeGain, reducedMotion, spriteCache: (k) => A.spriteCacheStats(k), bakedStats: () => A.bakedStats(), clearBaked: () => A.clearBaked(),
  renderOnce: (dt = 1 / 60) => { S.t += dt; render(dt); }, // benchmark hook (test build only)
  setSave(s) { S.save = s; persist(); },
  // fast-forward; only the last ~0.4 s of events become visible effects (so screenshots are not flooded)
  simulate(seconds, bot = true) { S.swatQ = []; const b = S.battle; const n = Math.round(seconds * 60); for (let i = 0; i < n && !b.result; i++) { b.update(1 / 60); if (bot) smartBotStep(b); if (i < n - 24) b.events = []; } S.fx = []; S.ui = []; S.slotFlip = [0, 0, 0]; consumeEvents(); if (b.result) finishBattle(); },
  setAutoBot(v) { S.autoBot = v; },
  // v0.7.4 M0: drive the game's OWN frame stepper (same code as the rAF loop, minus rendering): n frames of `dtReal` real seconds at the current S.speed.
  // Returns the sub-steps taken. clock.acc is exposed so tests can assert the accumulator never grows past the guard.
  runFrames(n, dtReal = 1 / 60, now = null) { let steps = 0; for (let i = 0; i < n && S.battle && !S.battle.result; i++) { const t0 = S.battle.time; advanceFrame(clock, dtReal, S.speed, battleStep, now ? { now } : {}); consumeEvents(); flushSwat(!!S.battle.result); steps += Math.round((S.battle.time - t0) * 60); if (S.battle.result) finishBattle(); } return steps; },
  lastBubble: () => lastBubble, ownBack, ownBackState: () => ({ pending: ownBackPending, ms: OWN_BACK_MS }), clock, battleFrame, stripLast: () => stripLast, mapTap, setMode, hudPreviewLast: () => hudPreviewLast, backdropKeys: () => Object.keys(S.bdCache || {}),
  setInset(px) { insetOverride = px; resize(); }, setInsetQuiet(px) { insetOverride = px; }, flushSwat, // v0.7.3: setInsetQuiet changes the probe value WITHOUT a resize (tests that the frame loop re-reads it)
  layout: () => ({ cw, ch, insetB, scale, offX, offY, barK, barH: BAR_H, metaH: META_H, dpr }), tabRect, BAR_H,
  mapPreview(id) { const b = new Battle({ levelIndex: 0, mapId: id, deck: [], bonusTypes: [], seed: 1 }); const src = A.renderMapBackground(b.routes, b.map.theme || 0, MAP_W, MAP_H, 2, b.props, b.map.art); const cv = document.createElement('canvas'); cv.width = src.width; cv.height = src.height; cv.getContext('2d').drawImage(src, 0, 0); return cv.toDataURL('image/png'); },
};
heartbeat(true); maybeShowCalendar();
// v0.6 item 5: an existing player past stage 2 without a Bug Zapper got one on load - show it with the NEW CARD popup
if (S.save.onboard && S.save.onboard.grantedOnLoad) { queueReveal('zapper', 1, true, S.t + 0.4); S.save.onboard.grantedOnLoad = false; persist(); }
// v0.8.0: the bundled display font (Lilita One, from 'self'); text sprites are rebuilt once it is ready. Never fetched from the internet.
try { if (document.fonts && document.fonts.load) document.fonts.load("22px 'Lilita One'").then(() => { A.setFontReady(true); S.bdCache = null; }, () => {}); } catch (e) { /* the fallback stack is used */ }
requestAnimationFrame(frame);
