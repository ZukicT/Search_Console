#!/usr/bin/env node
/**
 * Final localization patches for chapter eyebrows and remaining UI labels.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, '..', 'locales');

const patches = {
  de: {
    valueProps: { eyebrow: 'Kapitel 1' },
    story: { proofEyebrow: 'Kapitel 2' },
    howTo: { eyebrow: 'Kapitel 3' },
    features: { eyebrow: 'Kapitel 4' },
    screenshots: { eyebrow: 'Kapitel 5', coreWebVitals: 'Core Web Vitals' },
    footer: { copyright: '\u00a9 2026 Search Console f\u00fcr iOS' },
  },
  fr: {
    valueProps: { eyebrow: 'Chapitre 1' },
    story: { proofEyebrow: 'Chapitre 2' },
    howTo: { eyebrow: 'Chapitre 3' },
    features: { eyebrow: 'Chapitre 4' },
    screenshots: { eyebrow: 'Chapitre 5' },
    footer: { copyright: '\u00a9 2026 Search Console pour iOS' },
  },
  pt: {
    valueProps: { eyebrow: 'Cap\u00edtulo 1' },
    story: { proofEyebrow: 'Cap\u00edtulo 2' },
    howTo: { eyebrow: 'Cap\u00edtulo 3' },
    features: { eyebrow: 'Cap\u00edtulo 4' },
    screenshots: { eyebrow: 'Cap\u00edtulo 5', coreWebVitals: 'Core Web Vitals' },
    chart: { kpiImpressions: 'Impr.', kpiCtr: 'CTR', kpiPosition: 'Pos.' },
    footer: { copyright: '\u00a9 2026 Search Console para iOS' },
  },
  ja: {
    nav: { faq: '\u3088\u304f\u3042\u308b\u8cea\u554f' },
    valueProps: { eyebrow: '\u7b2c1\u7ae0' },
    story: { proofEyebrow: '\u7b2c2\u7ae0' },
    howTo: { eyebrow: '\u7b2c3\u7ae0' },
    features: { eyebrow: '\u7b2c4\u7ae0' },
    screenshots: { eyebrow: '\u7b2c5\u7ae0', vitals: '\u30d0\u30a4\u30bf\u30eb', coreWebVitals: 'Core Web Vitals' },
    chart: { kpiCtr: 'CTR' },
    footer: { copyright: '\u00a9 2026 iOS\u7248 Search Console' },
    share: { title: 'iOS\u7248 Search Console' },
  },
  ko: {
    valueProps: { eyebrow: '\uc81c1\uc7a5' },
    story: { proofEyebrow: '\uc81c2\uc7a5' },
    howTo: { eyebrow: '\uc81c3\uc7a5' },
    features: { eyebrow: '\uc81c4\uc7a5' },
    screenshots: { eyebrow: '\uc81c5\uc7a5', coreWebVitals: 'Core Web Vitals' },
    chart: { kpiCtr: 'CTR' },
    footer: { copyright: '\u00a9 2026 iOS\uc6a9 Search Console' },
  },
  'zh-Hans': {
    valueProps: { eyebrow: '\u7b2c1\u7ae0' },
    story: { proofEyebrow: '\u7b2c2\u7ae0' },
    howTo: { eyebrow: '\u7b2c3\u7ae0' },
    features: { eyebrow: '\u7b2c4\u7ae0' },
    screenshots: { eyebrow: '\u7b2c5\u7ae0', coreWebVitals: 'Core Web Vitals' },
    chart: { kpiCtr: 'CTR' },
    footer: { copyright: '\u00a9 2026 iOS \u7248 Search Console' },
  },
  'zh-Hant': {
    valueProps: { eyebrow: '\u7b2c1\u7ae0' },
    story: { proofEyebrow: '\u7b2c2\u7ae0' },
    howTo: { eyebrow: '\u7b2c3\u7ae0' },
    features: { eyebrow: '\u7b2c4\u7ae0' },
    screenshots: { eyebrow: '\u7b2c5\u7ae0', coreWebVitals: 'Core Web Vitals' },
    chart: { kpiCtr: 'CTR' },
    footer: { copyright: '\u00a9 2026 iOS \u7248 Search Console' },
  },
};

function deepMerge(target, source) {
  const output = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      output[key] = deepMerge(output[key] || {}, source[key]);
    } else {
      output[key] = source[key];
    }
  }
  return output;
}

for (const [localeCode, patch] of Object.entries(patches)) {
  const filePath = path.join(localesDir, `${localeCode}.json`);
  const current = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const merged = deepMerge(current, patch);
  merged.locale = localeCode;
  fs.writeFileSync(filePath, `${JSON.stringify(merged, null, 2)}\n`, 'utf8');
  console.log(`Patched ${localeCode}.json`);
}
