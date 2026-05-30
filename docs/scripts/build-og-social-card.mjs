#!/usr/bin/env node
/**
 * Build Open Graph social card assets from the marketing capture page.
 */

import { spawn, spawnSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { createCanvas, loadImage } = require('canvas');
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS = path.resolve(__dirname, '..');
const OG_DIR = path.join(DOCS, 'og');
const PORT = Number(process.env.OG_BUILD_PORT || 8099);
const CARD_URL = `http://127.0.0.1:${PORT}/marketing/social-share-card.html?capture=1`;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(url, attempts = 40) {
  for (let index = 0; index < attempts; index += 1) {
    try {
      const response = await fetch(url, { redirect: 'follow' });
      if (response.ok) return;
    } catch {
      // retry
    }
    await wait(250);
  }
  throw new Error(`Static server did not start for ${url}`);
}

function startServer() {
  return spawn('npx', ['--yes', 'serve', '.', '-l', String(PORT), '--no-port-switching'], {
    cwd: DOCS,
    stdio: 'ignore',
    detached: true,
  });
}

async function withBrowser(run) {
  const puppeteer = await import('puppeteer');
  const browser = await puppeteer.default.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    return await run(browser);
  } finally {
    await browser.close();
  }
}

async function captureCard(browser) {
  const page = await browser.newPage();
  await page.setViewport({ width: 720, height: 720, deviceScaleFactor: 1 });
  await page.goto(CARD_URL, { waitUntil: 'networkidle0', timeout: 60000 });
  await wait(800);

  const cardHandle = await page.$('#social-share-card');
  if (!cardHandle) {
    throw new Error('Social card element not found.');
  }

  return cardHandle;
}

async function buildStaticAssets(browser) {
  const page = await browser.newPage();
  await page.setViewport({ width: 720, height: 720, deviceScaleFactor: 3 });
  await page.goto(CARD_URL, { waitUntil: 'networkidle0', timeout: 60000 });
  await wait(800);

  const cardHandle = await page.$('#social-share-card');
  if (!cardHandle) {
    throw new Error('Social card element not found.');
  }

  const sourcePng = path.join(OG_DIR, 'social-card-source.png');
  await cardHandle.screenshot({ path: sourcePng, type: 'png' });

  const jpegPath = path.join(OG_DIR, 'social-card.jpg');
  const webpPath = path.join(OG_DIR, 'social-card.webp');

  spawnSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '100', sourcePng, '--out', jpegPath], {
    stdio: 'inherit',
  });
  spawnSync('cwebp', ['-q', '100', sourcePng, '-o', webpPath], { stdio: 'inherit' });
}

async function buildGifAsset(browser) {
  const gifenc = await import('gifenc');
  const { GIFEncoder, quantize, applyPalette } = gifenc.default || gifenc;
  const cardHandle = await captureCard(browser);
  const frameCount = 40;
  const frameDelayMs = 66;
  const pngFrames = [];

  for (let frameIndex = 0; frameIndex < frameCount; frameIndex += 1) {
    pngFrames.push(await cardHandle.screenshot({ type: 'png' }));
    if (frameIndex < frameCount - 1) {
      await wait(frameDelayMs);
    }
  }

  const firstImage = await loadImage(pngFrames[0]);
  const measureCanvas = createCanvas(720, 720);
  const measureContext = measureCanvas.getContext('2d');
  measureContext.drawImage(firstImage, 0, 0, 720, 720);
  const palette = quantize(measureContext.getImageData(0, 0, 720, 720).data, 256);

  const encoder = GIFEncoder();
  for (const pngFrame of pngFrames) {
    const image = await loadImage(pngFrame);
    const canvas = createCanvas(720, 720);
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, 720, 720);
    const index = applyPalette(context.getImageData(0, 0, 720, 720).data, palette);
    encoder.writeFrame(index, 720, 720, { palette, delay: frameDelayMs });
  }

  encoder.finish();
  const gifPath = path.join(OG_DIR, 'social-card.gif');
  await writeFile(gifPath, Buffer.from(encoder.bytes()));
}

async function main() {
  await mkdir(OG_DIR, { recursive: true });
  const skipGif = process.argv.includes('--skip-gif');
  const skipStatic = process.argv.includes('--skip-static');
  const server = startServer();

  try {
    await waitForServer(`http://127.0.0.1:${PORT}/`);

    await withBrowser(async (browser) => {
      if (!skipStatic) {
        await buildStaticAssets(browser);
        console.log('Wrote social-card-source.png, social-card.jpg, social-card.webp');
      }
      if (!skipGif) {
        await buildGifAsset(browser);
        console.log('Wrote social-card.gif');
      }
    });
  } finally {
    if (server.pid) {
      process.kill(-server.pid);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
