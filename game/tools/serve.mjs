// Minimal static file server for local testing of www/ (binds to 127.0.0.1 only).
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
const base = new URL('../', import.meta.url).pathname;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json' };
export function serve(port = 8765, dir = 'www-test') {
  const root = join(base, dir, '/');
  const srv = createServer(async (req, res) => {
    let p = normalize(decodeURIComponent(req.url.split('?')[0])); if (p.endsWith('/')) p += 'index.html';
    try { const data = await readFile(join(root, p)); res.writeHead(200, { 'content-type': types[extname(p)] || 'application/octet-stream' }); res.end(data); }
    catch { res.writeHead(404); res.end('nope'); }
  });
  return new Promise((ok) => srv.listen(port, '127.0.0.1', () => ok(srv)));
}
if (import.meta.url === `file://${process.argv[1]}`) serve(8765, process.argv[2] || 'www').then(() => console.log('http://127.0.0.1:8765/'));
