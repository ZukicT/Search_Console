import { readFile, mkdir, writeFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'

const config = JSON.parse(await readFile(new URL('./indexnow.json', import.meta.url), 'utf8'))
const origin = `https://${config.host}`
const args = process.argv.slice(2)
const option = (name) => args[args.indexOf(name) + 1]
const request = (url, options = {}) => fetch(url, { ...options, signal: AbortSignal.timeout(30000) })
const expected = process.env.INDEXNOW_DEPLOY_SHA || process.env.AWS_COMMIT_ID || process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()

if (args.includes('--prepare')) {
  const output = args.includes('--output') ? option('--output') : config.output
  if (!output) throw new Error('Missing output directory')
  await mkdir(resolve(output), { recursive: true })
  await writeFile(resolve(output, 'indexnow-deploy.txt'), expected + '\n')
  console.log(`Prepared IndexNow deployment marker for ${config.host}`)
} else {
  if (args.includes('--wait')) {
    const deadline = Date.now() + 20 * 60 * 1000
    let ready = false
    while (Date.now() < deadline) {
      try {
        const markerReady = config.waitForMarker === false || await (async () => {
          const marker = await request(`${origin}/indexnow-deploy.txt?revision=${encodeURIComponent(expected)}`)
          return marker.ok && (await marker.text()).trim() === expected
        })()
        const key = await request(`${origin}/${config.key}.txt`)
        ready = markerReady && key.ok && (await key.text()).trim() === config.key
        if (ready) break
      } catch { /* Deployment may still be starting. */ }
      await new Promise((done) => setTimeout(done, 30000))
    }
    if (!ready) throw new Error(`Matching deployment/key not available on ${config.host}; no URLs submitted`)
  }
  let xml
  if (args.includes('--sitemap')) xml = await readFile(option('--sitemap'), 'utf8')
  else {
    const response = await request(`${origin}/sitemap.xml`)
    if (!response.ok) throw new Error(`Sitemap HTTP ${response.status}`)
    xml = await response.text()
  }
  if (!/<urlset[\s>]/.test(xml)) throw new Error('Expected a sitemap urlset')
  const unescape = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'")
  const clean = xml.replace(/<image:image[\s\S]*?<\/image:image>/g, '')
  const urls = [...new Set([...clean.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => unescape(m[1].trim())))]
  if (!urls.length) throw new Error('Empty sitemap')
  for (const value of urls) {
    const url = new URL(value)
    if (url.protocol !== 'https:' || url.host !== config.host || url.username || url.password) throw new Error(`Invalid sitemap URL: ${value}`)
  }
  if (args.includes('--dry-run')) console.log(`Validated ${urls.length} public URLs for ${config.host}; no submission`)
  else {
    const keyResponse = await request(`${origin}/${config.key}.txt`)
    if (!keyResponse.ok || (await keyResponse.text()).trim() !== config.key) throw new Error('Live key file mismatch; no submission')
    for (let i = 0; i < urls.length; i += 10000) {
      const response = await request('https://api.indexnow.org/indexnow', {
        method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ host: config.host, key: config.key, keyLocation: `${origin}/${config.key}.txt`, urlList: urls.slice(i, i + 10000) }),
      })
      if (![200, 202].includes(response.status)) throw new Error(`IndexNow HTTP ${response.status}: ${await response.text()}`)
      console.log(`IndexNow accepted ${Math.min(10000, urls.length - i)} URLs for ${config.host} (HTTP ${response.status})`)
    }
  }
}
