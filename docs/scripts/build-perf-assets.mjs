#!/usr/bin/env node
/**
 * Minify static CSS and JS before GitHub Pages deploy.
 * Source files in repo stay readable; CI overwrites copies in the artifact.
 */
import { execSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const docsDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const cssDir = join(docsDir, 'css');
const jsDir = join(docsDir, 'js');

function minifyCss(filePath) {
  execSync(`npx --yes clean-css-cli -O1 --format breakWith=lf "${filePath}" -o "${filePath}"`, {
    stdio: 'inherit',
  });
}

function minifyJs(filePath) {
  execSync(
    `npx --yes terser "${filePath}" --compress passes=2 --mangle --format comments=false -o "${filePath}"`,
    { stdio: 'inherit' },
  );
}

for (const name of readdirSync(cssDir).filter((file) => file.endsWith('.css'))) {
  minifyCss(join(cssDir, name));
  console.log(`minified css/${name}`);
}

for (const name of [
  'hero-dot-wave.js',
  'site-charts.js',
  'site-ui.js',
  'i18n.js',
  'site-chrome-scripts.js',
  'blog-visuals.js',
  'performance-chart.js',
]) {
  const filePath = join(jsDir, name);
  try {
    minifyJs(filePath);
    console.log(`minified js/${name}`);
  } catch {
    console.warn(`skipped js/${name}`);
  }
}

console.log('Performance asset build complete.');
