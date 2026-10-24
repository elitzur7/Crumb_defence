// Run after `cap sync android`: Capacitor regenerates res/xml/config.xml with a Cordova `<access origin="*" />` entry.
// It is only read by Cordova's whitelist plugin (not used here; the app has no Cordova plugins and no INTERNET permission),
// so it is stripped to keep the package minimal.
import { readFileSync, writeFileSync } from 'node:fs';
const p = 'android/app/src/main/res/xml/config.xml';
const before = readFileSync(p, 'utf8');
const after = before.replace(/\s*<access origin="\*"\s*\/>/g, '');
writeFileSync(p, after);
console.log(before === after ? 'config.xml: no <access> entry' : 'config.xml: removed <access origin="*" />');
