import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const dir = join(dirname(fileURLToPath(import.meta.url)), 'overlay-packs');

function load(code) {
  return JSON.parse(readFileSync(join(dir, `${code}.json`), 'utf8'));
}

export const OVERLAY_LOCALES = {
  fr: load('fr'),
  pt: load('pt'),
  ja: load('ja'),
  ko: load('ko'),
  'zh-Hans': load('zh-Hans'),
  'zh-Hant': load('zh-Hant'),
};
