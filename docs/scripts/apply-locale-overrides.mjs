#!/usr/bin/env node
/**
 * Deep-merge locale override files from locales/overrides/<locale>.json
 * into locales/<locale>.json. Run after locale:sync when en.json grows.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, '..', 'locales');
const overridesDir = path.join(localesDir, 'overrides');

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function deepMerge(target, source) {
  if (!isPlainObject(source)) return source;
  const output = isPlainObject(target) ? { ...target } : {};
  for (const key of Object.keys(source)) {
    if (isPlainObject(source[key])) {
      output[key] = deepMerge(output[key], source[key]);
    } else {
      output[key] = source[key];
    }
  }
  return output;
}

if (!fs.existsSync(overridesDir)) {
  console.log('No overrides directory; nothing to apply.');
  process.exit(0);
}

const overrideFiles = fs.readdirSync(overridesDir).filter((name) => name.endsWith('.json'));

for (const fileName of overrideFiles) {
  const localeCode = fileName.replace(/\.json$/, '');
  const localePath = path.join(localesDir, `${localeCode}.json`);
  if (!fs.existsSync(localePath)) {
    console.warn(`Skip ${fileName}: no ${localeCode}.json`);
    continue;
  }
  const current = JSON.parse(fs.readFileSync(localePath, 'utf8'));
  const overrides = JSON.parse(fs.readFileSync(path.join(overridesDir, fileName), 'utf8'));
  const merged = deepMerge(current, overrides);
  merged.locale = localeCode;
  fs.writeFileSync(localePath, `${JSON.stringify(merged, null, 2)}\n`, 'utf8');
  console.log(`Applied overrides to ${localeCode}.json`);
}
