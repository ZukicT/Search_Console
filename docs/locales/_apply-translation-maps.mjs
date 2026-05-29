import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const dir = dirname(fileURLToPath(import.meta.url));
const packsDir = join(dir, 'overlay-packs');
const mapsDir = join(packsDir, 'maps');

function walkTranslate(obj, map) {
  if (typeof obj === 'string') {
    const t = map[obj];
    if (!t) {
      throw new Error('Missing translation for: ' + obj.slice(0, 80));
    }
    return t;
  }
  const out = {};
  for (const key of Object.keys(obj)) {
    out[key] = walkTranslate(obj[key], map);
  }
  return out;
}

const en = JSON.parse(readFileSync(join(packsDir, 'en.json'), 'utf8'));
mkdirSync(mapsDir, { recursive: true });

const codes = ['fr', 'pt', 'ja', 'ko', 'hr', 'zh-Hans', 'zh-Hant'];
const overlayLocales = {};

for (const code of codes) {
  const map = JSON.parse(readFileSync(join(mapsDir, `${code}.json`), 'utf8'));
  const pack = walkTranslate(en, map);
  writeFileSync(join(packsDir, `${code}.json`), JSON.stringify(pack, null, 2) + '\n', 'utf8');
  overlayLocales[code] = pack;
}

writeFileSync(
  join(dir, 'overlay-translations.json'),
  JSON.stringify(overlayLocales, null, 2) + '\n',
  'utf8'
);

console.log('Built packs for:', codes.join(', '));
