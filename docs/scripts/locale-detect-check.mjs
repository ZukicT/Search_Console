#!/usr/bin/env node
/**
 * Validates browser locale tag resolution used by js/i18n.js.
 * Run: node scripts/locale-detect-check.mjs
 */

function resolveLocaleTag(lang) {
  if (!lang || typeof lang !== 'string') return null;
  const tag = lang.toLowerCase().replace(/_/g, '-');
  if (tag.startsWith('zh-cn') || tag === 'zh-hans') return 'zh-Hans';
  if (tag.startsWith('zh-tw') || tag.startsWith('zh-hk') || tag === 'zh-hant') return 'zh-Hant';
  if (tag.startsWith('ko')) return 'ko';
  if (tag.startsWith('hr') || tag.startsWith('bs')) return 'hr';
  if (tag.startsWith('de')) return 'de';
  if (tag.startsWith('fr')) return 'fr';
  if (tag.startsWith('pt')) return 'pt';
  if (tag.startsWith('ja')) return 'ja';
  if (tag.startsWith('en')) return 'en';
  return null;
}

function pickLocale(candidates) {
  for (const candidate of candidates) {
    const resolved = resolveLocaleTag(candidate);
    if (resolved) return resolved;
  }
  return 'en';
}

const cases = [
  [['en-US'], 'en'],
  [['en-GB'], 'en'],
  [['de-DE'], 'de'],
  [['fr-FR'], 'fr'],
  [['pt-BR'], 'pt'],
  [['ja-JP'], 'ja'],
  [['ko-KR'], 'ko'],
  [['hr-HR'], 'hr'],
  [['bs-BA'], 'hr'],
  [['zh-CN'], 'zh-Hans'],
  [['zh-TW'], 'zh-Hant'],
  [['zh-HK'], 'zh-Hant'],
  [['sl-SI'], 'en'],
  [['sl-SI', 'hr-HR'], 'hr'],
  [['sl-SI', 'de-DE'], 'de'],
  [['it-IT'], 'en'],
  [['es-ES'], 'en'],
  [[], 'en'],
];

let failed = 0;
for (const [input, expected] of cases) {
  const actual = pickLocale(input);
  if (actual !== expected) {
    failed += 1;
    console.error(`FAIL ${JSON.stringify(input)} -> ${actual}, expected ${expected}`);
  }
}

if (failed) {
  console.error(`${failed} locale detect case(s) failed`);
  process.exit(1);
}

console.log(`locale-detect-check: ${cases.length} cases passed`);
