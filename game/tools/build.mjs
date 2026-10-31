// Bundles src/ into www/ (production, packaged into the APK) and www-test/ (same game + window.__game test hook).
// No network, no external assets.
import { build } from 'esbuild';
import { mkdirSync, copyFileSync, readFileSync, readdirSync } from 'node:fs';
for (const [dir, hooks] of [['www', false], ['www-test', true]]) {
  mkdirSync(dir, { recursive: true });
  await build({ entryPoints: ['src/game.js'], bundle: true, format: 'esm', target: ['chrome80'], outfile: `${dir}/game.js`,
    define: { __TEST_HOOKS__: String(hooks) }, minifySyntax: true, minifyWhitespace: false, minifyIdentifiers: false, legalComments: 'none' });
  copyFileSync('index.html', `${dir}/index.html`);
  mkdirSync(`${dir}/fonts`, { recursive: true }); // v0.8.0: Lilita One (SIL OFL) is bundled locally with its licence; never loaded from the internet
  for (const f of readdirSync('fonts')) copyFileSync(`fonts/${f}`, `${dir}/fonts/${f}`);
  const js = readFileSync(`${dir}/game.js`, 'utf8');
  if (!hooks && js.includes('__game')) throw new Error('production bundle still contains the __game test hook');
  console.log(`built ${dir}/ (game.js ${(js.length / 1024).toFixed(1)} KB, test hooks: ${hooks})`);
}
