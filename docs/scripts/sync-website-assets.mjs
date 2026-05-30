#!/usr/bin/env node
/**
 * Copies marketing assets from the iOS app asset catalog into docs/ for the website.
 */
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const docsRoot = dirname(fileURLToPath(import.meta.url));
const docsDir = join(docsRoot, '..');
const assetsRoot = join(
  docsDir,
  '..',
  'Search Console',
  'Search Console',
  'Assets.xcassets',
);

const appLogo = join(assetsRoot, 'AppLogo.imageset', 'App Logo Search Console-3.jpg');
const headshot = join(
  assetsRoot,
  'PictuerOfMe.imageset',
  '41ACD091-853E-466B-8386-81E8310488E7.jpg',
);

function copyFile(src, dest) {
  if (!existsSync(src)) {
    throw new Error(`Missing asset: ${src}`);
  }
  cpSync(src, dest);
}

copyFile(appLogo, join(docsDir, 'app-icon-source.jpg'));
for (const name of ['app-icon.jpg', 'app-icon-full.jpg', 'app-icon-512.jpg']) {
  copyFile(appLogo, join(docsDir, name));
}
copyFile(headshot, join(docsDir, 'founder.jpg'));

const botMark = join(assetsRoot, 'Bot.imageset', 'App Logo Search Console-2.png');
const botSource = join(docsDir, 'Bot-source.png');
copyFile(botMark, botSource);

for (const [size, name] of [
  [36, 'Bot-72.png'],
  [48, 'Bot-96.png'],
  [72, 'Bot-144.png'],
  [144, 'Bot.png'],
  [200, 'Bot-200.png'],
]) {
  execSync(`sips -z ${size} ${size} "${botSource}" --out "${join(docsDir, name)}"`, {
    stdio: 'inherit',
  });
}

const botSad = join(assetsRoot, 'Bot-Sad.imageset');
if (existsSync(botSad)) {
  const sadPng = readdirSync(botSad).find((file) => file.endsWith('.png'));
  if (sadPng) {
    copyFile(join(botSad, sadPng), join(docsDir, 'Bot-Sad.png'));
  }
}

execSync(`sips -z 512 512 "${join(docsDir, 'app-icon-source.jpg')}" --out "${join(docsDir, 'favicon.png')}"`, {
  stdio: 'inherit',
});
execSync(`sips -z 32 32 "${join(docsDir, 'favicon.png')}" --out "${join(docsDir, 'favicon-32x32.png')}"`, {
  stdio: 'inherit',
});
execSync(`sips -z 16 16 "${join(docsDir, 'favicon.png')}" --out "${join(docsDir, 'favicon-16x16.png')}"`, {
  stdio: 'inherit',
});
execSync(`sips -z 180 180 "${join(docsDir, 'favicon.png')}" --out "${join(docsDir, 'apple-touch-icon.png')}"`, {
  stdio: 'inherit',
});
execSync(`sips -z 192 192 "${join(docsDir, 'favicon.png')}" --out "${join(docsDir, 'icon-192.png')}"`, {
  stdio: 'inherit',
});

const screenshotNames = [
  'Image1',
  'Image2',
  'Image3',
  'Image4',
  'Image5',
  'Image6',
  'Image7',
  'Image8',
];

for (const name of screenshotNames) {
  const srcDir = join(assetsRoot, 'AppAssetsWebsite', `${name}.imageset`);
  const png = readdirSync(srcDir).find((file) => file.endsWith('.png'));
  if (!png) {
    throw new Error(`Missing PNG screenshot in ${srcDir}`);
  }

  const destDir = join(docsDir, 'AppAssetsWebsite', `${name}.imageset`);
  mkdirSync(destDir, { recursive: true });
  for (const file of readdirSync(destDir)) {
    if (file.endsWith('.jpg')) {
      rmSync(join(destDir, file));
    }
  }
  copyFile(join(srcDir, png), join(destDir, `${name}.png`));
  writeFileSync(
    join(destDir, 'Contents.json'),
    `${JSON.stringify(
      {
        images: [{ filename: `${name}.png`, idiom: 'universal', scale: '1x' }],
        info: { author: 'xcode', version: 1 },
      },
      null,
      2,
    )}\n`,
  );
}

console.log('Synced website assets from Xcode asset catalog.');
