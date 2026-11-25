// Minimal static server for the generated site (no extra dependency).
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { join, extname, normalize } from 'node:path'

import { existsSync } from 'node:fs'

const root = new URL('../.output/public/', import.meta.url).pathname
if (!existsSync(join(root, 'index.html'))) {
  console.error('\n.output/public is missing or stale. Run `npm run generate` before `npm run test:e2e`.\n')
  process.exit(1)
}
const port = Number(process.env.PORT || 4173)
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript', '.mjs':'text/javascript',
  '.css':'text/css', '.json':'application/json', '.jpg':'image/jpeg', '.png':'image/png',
  '.svg':'image/svg+xml', '.xml':'application/xml', '.txt':'text/plain', '.ico':'image/x-icon', '.woff2':'font/woff2' }

createServer(async (req, res) => {
  try {
    const url = decodeURIComponent((req.url || '/').split('?')[0])
    let file = join(root, normalize(url).replace(/^(\.\.[/\\])+/, ''))
    try { if ((await stat(file)).isDirectory()) file = join(file, 'index.html') }
    catch { if (!extname(file)) file = join(root, url, 'index.html') }
    const body = await readFile(file)
    res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream' })
    res.end(body)
  } catch {
    try {
      const body = await readFile(join(root, '404.html'))
      res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' }); res.end(body)
    } catch { res.writeHead(404); res.end('Not found') }
  }
}).listen(port, () => console.log(`static server on http://localhost:${port}`))
