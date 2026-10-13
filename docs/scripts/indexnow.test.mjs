import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
const config = JSON.parse(readFileSync(new URL('./indexnow.json', import.meta.url), 'utf8'))
const script = fileURLToPath(new URL('./indexnow.mjs', import.meta.url))
function validate(xml) {
  const dir = mkdtempSync(join(tmpdir(), 'indexnow-test-'))
  try {
    const file = join(dir, 'sitemap.xml')
    writeFileSync(file, xml)
    return spawnSync(process.execPath, [script, '--dry-run', '--sitemap', file], { encoding: 'utf8' })
  } finally { rmSync(dir, { recursive: true, force: true }) }
}
test('submits sitemap pages once and excludes image locations', () => {
  const url = `https://${config.host}/`
  const result = validate(`<urlset><url><loc>${url}</loc><image:image><image:loc>https://images.example/image.png</image:loc></image:image></url><url><loc>${url}</loc></url></urlset>`)
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /Validated 1 public URLs/)
})
test('rejects wrong hosts, insecure URLs, credentials, and non-sitemap responses', () => {
  for (const xml of ['<html>blocked</html>', '<urlset></urlset>', '<urlset><url><loc>https://other.example/</loc></url></urlset>', `<urlset><url><loc>http://${config.host}/</loc></url></urlset>`, `<urlset><url><loc>https://user:pass@${config.host}/</loc></url></urlset>`]) assert.notEqual(validate(xml).status, 0)
})
