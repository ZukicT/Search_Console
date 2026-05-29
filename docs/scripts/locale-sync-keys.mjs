#!/usr/bin/env node
/**
 * Sync locale JSON key structure from en.json into other locale files.
 * Missing keys are filled from English so UI and fallbacks stay complete.
 *
 * Usage:
 *   node scripts/locale-sync-keys.mjs
 *   node scripts/locale-sync-keys.mjs --check
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, '..', 'locales');
const sourcePath = path.join(localesDir, 'en.json');
const checkOnly = process.argv.includes('--check');
const checkUntranslated = process.argv.includes('--check-untranslated');

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function mergeStructure(source, target) {
  if (Array.isArray(source)) {
    return Array.isArray(target) ? target : source;
  }
  if (!isPlainObject(source)) {
    return target !== undefined ? target : source;
  }

  const output = isPlainObject(target) ? { ...target } : {};
  for (const key of Object.keys(source)) {
    if (!(key in output)) {
      output[key] = structuredClone(source[key]);
      continue;
    }
    output[key] = mergeStructure(source[key], output[key]);
  }
  return output;
}

function countLeaves(value) {
  if (!isPlainObject(value) && !Array.isArray(value)) return 1;
  if (Array.isArray(value)) return value.length;
  return Object.values(value).reduce((sum, child) => sum + countLeaves(child), 0);
}

function flattenKeys(obj, prefix = '') {
  const keys = [];
  if (!isPlainObject(obj)) return keys;
  for (const key of Object.keys(obj)) {
    const next = prefix ? `${prefix}.${key}` : key;
    if (isPlainObject(obj[key])) keys.push(...flattenKeys(obj[key], next));
    else keys.push(next);
  }
  return keys;
}

function getNested(obj, pathKey) {
  return pathKey.split('.').reduce((acc, part) => (acc == null ? undefined : acc[part]), obj);
}

const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
const sourceKeys = new Set(flattenKeys(source));
const localeFiles = fs.readdirSync(localesDir).filter(
  (name) => name.endsWith('.json') && name !== 'en.json' && !name.includes('overrides'),
);

/** Keys intentionally identical across locales (brand, product names, universal abbreviations). */
const ALLOW_IDENTICAL = new Set([
  'common.appNameShort',
  'hero.pill',
  'about.linkedin',
  'footer.googleSearchConsole',
  'screenshots.coreWebVitals',
  'chart.kpiCtr',
  'chart.kpiImpressions',
  'chart.kpiPosition',
]);

let exitCode = 0;

for (const fileName of localeFiles) {
  const filePath = path.join(localesDir, fileName);
  const localeCode = fileName.replace(/\.json$/, '');
  const current = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const beforeKeys = new Set(flattenKeys(current));
  const merged = mergeStructure(source, current);
  merged.locale = localeCode;

  const afterKeys = new Set(flattenKeys(merged));
  const added = [...afterKeys].filter((key) => !beforeKeys.has(key)).length;
  const missing = [...sourceKeys].filter((key) => !afterKeys.has(key)).length;

  if (missing > 0) {
    console.error(`${fileName}: still missing ${missing} keys after merge`);
    exitCode = 1;
  }

  if (checkUntranslated) {
    const identical = [...sourceKeys].filter((key) => {
      if (ALLOW_IDENTICAL.has(key)) return false;
      const sourceValue = getNested(source, key);
      const localeValue = getNested(current, key);
      return typeof sourceValue === 'string' && sourceValue === localeValue && sourceValue.length > 0;
    });
    console.log(`${fileName}: untranslated ${identical.length} keys (same as en)`);
    if (identical.length > 0) exitCode = 1;
    continue;
  }

  if (checkOnly) {
    console.log(`${fileName}: missing ${[...sourceKeys].filter((key) => !beforeKeys.has(key)).length} keys`);
    continue;
  }

  if (added > 0) {
    fs.writeFileSync(filePath, `${JSON.stringify(merged, null, 2)}\n`, 'utf8');
    console.log(`${fileName}: added ${added} keys (${countLeaves(merged)} leaf values)`);
  } else {
    console.log(`${fileName}: already in sync`);
  }
}

process.exit(exitCode);
