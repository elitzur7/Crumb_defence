// v0.7.4.1 hotfix: the native ActionBar ("Crumb Defense" strip) that appeared on top of every screen in v0.7.4 / v0.7.3.
// Root cause: MainActivity called EdgeToEdge.enable(this) BEFORE super.onCreate(), which built the decor view under the launch theme
// (AppTheme.NoActionBarLaunch) before Capacitor's BridgeActivity.onCreate switched to AppTheme.NoActionBar. These source tests guard the fix.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as C from '../src/config.js';

const rd = (p) => readFileSync(new URL('../' + p, import.meta.url), 'utf8');
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
const java = strip(rd('android/app/src/main/java/com/yair/crumbdefense/MainActivity.java'));
const styles = rd('android/app/src/main/res/values/styles.xml');
const manifest = rd('android/app/src/main/AndroidManifest.xml');

test('v0.7.4.1 version + versionCode 19', () => {
  assert.match(C.VERSION, /^0\.7\.(4\.1|5|6|7|8)$/); // v0.7.6: the hotfix version is superseded; v076.test.js asserts the new one
  assert.ok(+/versionCode (\d+)/.exec(rd('android/app/build.gradle'))[1] >= 19);
  assert.equal(JSON.parse(rd('package.json')).version, C.VERSION);
});

test('MainActivity.onCreate: super.onCreate() runs BEFORE EdgeToEdge.enable(this)', () => {
  const body = java.slice(java.indexOf('void onCreate'));
  const sup = body.indexOf('super.onCreate(savedInstanceState)');
  const edge = body.indexOf('EdgeToEdge.enable(this)');
  assert.ok(sup >= 0, 'super.onCreate present');
  assert.ok(edge >= 0, 'EdgeToEdge.enable present (v0.7.3 safe-area behaviour kept)');
  assert.ok(sup < edge, 'EdgeToEdge.enable must come after super.onCreate');
  assert.equal((java.match(/EdgeToEdge\.enable\(/g) || []).length, 1);
  assert.equal((java.match(/super\.onCreate\(/g) || []).length, 1);
});

test('NoActionBarLaunch declares postSplashScreenTheme = AppTheme.NoActionBar', () => {
  const launch = /<style name="AppTheme\.NoActionBarLaunch"[^>]*>([\s\S]*?)<\/style>/.exec(styles);
  assert.ok(launch, 'launch theme present');
  assert.match(launch[1], /<item name="postSplashScreenTheme">@style\/AppTheme\.NoActionBar<\/item>/);
  assert.match(styles, /<style name="AppTheme\.NoActionBarLaunch" parent="Theme\.SplashScreen">/);
});

test('AppTheme.NoActionBar has no action bar and no title; the activity starts on the launch theme', () => {
  const na = /<style name="AppTheme\.NoActionBar"[^>]*>([\s\S]*?)<\/style>/.exec(styles)[1];
  assert.match(na, /<item name="windowActionBar">false<\/item>/);
  assert.match(na, /<item name="windowNoTitle">true<\/item>/);
  assert.match(manifest, /android:name="\.MainActivity"[\s\S]*?android:theme="@style\/AppTheme\.NoActionBarLaunch"/);
});

test('the action bar is not hidden from JS (no native-bar hack in the web layer)', () => {
  const g = rd('src/game.js');
  assert.ok(!/ActionBar|StatusBar\.hide|setStyle\(\{/.test(g));
});

test('hotfix scope: still no INTERNET permission', () => {
  assert.ok(!/android\.permission\.INTERNET/.test(manifest));
});
