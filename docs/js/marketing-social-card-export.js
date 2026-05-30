import { toCanvas } from 'https://cdn.jsdelivr.net/npm/html-to-image@1.11.13/+esm';
import { GIFEncoder, quantize, applyPalette } from 'https://cdn.jsdelivr.net/npm/gifenc@1.0.3/+esm';

var CARD_SELECTOR = '#social-share-card';
var CARD_WIDTH = 720;
var CARD_HEIGHT = 720;
var STATIC_EXPORT_SCALE = 3;
var JPEG_QUALITY = 1;
var WEBP_QUALITY = 1;
var FRAME_COUNT = 40;
var FRAME_DELAY_MS = 66;
var CAPTURE_INTERVAL_MS = 66;
var GIF_FILENAME = 'search-console-social-card.gif';
var JPEG_FILENAME = 'search-console-social-card.jpg';
var WEBP_FILENAME = 'search-console-social-card.webp';

var exportBusy = false;

function waitForAssets() {
  if (document.fonts && document.fonts.ready) {
    return document.fonts.ready;
  }
  return Promise.resolve();
}

function waitForImages(root) {
  var images = root.querySelectorAll('img');
  var pending = Array.prototype.map.call(images, function (image) {
    if (image.complete) return Promise.resolve();
    return new Promise(function (resolve) {
      image.addEventListener('load', resolve, { once: true });
      image.addEventListener('error', resolve, { once: true });
    });
  });
  return Promise.all(pending);
}

function delay(ms) {
  return new Promise(function (resolve) {
    window.setTimeout(resolve, ms);
  });
}

function getCardElement() {
  var card = document.querySelector(CARD_SELECTOR);
  if (!card) {
    throw new Error('Social card element not found.');
  }
  return card;
}

function captureCardFrame(card, scale) {
  var pixelRatio = scale || 1;
  return toCanvas(card, {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    pixelRatio: pixelRatio,
    backgroundColor: '#000000',
    cacheBust: false,
  });
}

function canvasToBlob(canvas, mimeType, quality) {
  return new Promise(function (resolve, reject) {
    canvas.toBlob(function (blob) {
      if (!blob) {
        reject(new Error('Could not encode ' + mimeType + ' image.'));
        return;
      }
      resolve(blob);
    }, mimeType, quality);
  });
}

function downloadBlob(blob, filename) {
  var url = URL.createObjectURL(blob);
  var link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(function () {
    URL.revokeObjectURL(url);
  }, 0);
}

function setExportControlsDisabled(disabled) {
  document.querySelectorAll('.capture-export-btn').forEach(function (button) {
    button.disabled = disabled;
  });
}

function setStatus(message) {
  var status = document.getElementById('export-status');
  if (!status) return;
  status.hidden = !message;
  status.textContent = message || '';
}

function encodeGif(frames, width, height) {
  var encoder = GIFEncoder();
  var first = frames[0].getContext('2d').getImageData(0, 0, width, height);
  var globalPalette = quantize(first.data, 256);

  frames.forEach(function (frameCanvas) {
    var context = frameCanvas.getContext('2d');
    var imageData = context.getImageData(0, 0, width, height);
    var index = applyPalette(imageData.data, globalPalette);
    encoder.writeFrame(index, width, height, {
      palette: globalPalette,
      delay: FRAME_DELAY_MS,
    });
  });

  encoder.finish();
  return new Blob([encoder.bytes()], { type: 'image/gif' });
}

async function prepareCardForCapture() {
  var card = getCardElement();
  await waitForAssets();
  await waitForImages(card);
  await delay(400);
  return card;
}

async function exportSocialCardStatic(format) {
  var card = await prepareCardForCapture();
  var canvas = await captureCardFrame(card, STATIC_EXPORT_SCALE);
  var exportSize = CARD_WIDTH * STATIC_EXPORT_SCALE;

  if (format === 'jpeg') {
    var jpegBlob = await canvasToBlob(canvas, 'image/jpeg', JPEG_QUALITY);
    downloadBlob(jpegBlob, JPEG_FILENAME);
    return JPEG_FILENAME;
  }

  if (format === 'webp') {
    var webpBlob = await canvasToBlob(canvas, 'image/webp', WEBP_QUALITY);
    downloadBlob(webpBlob, WEBP_FILENAME);
    return WEBP_FILENAME;
  }

  throw new Error('Unsupported export format: ' + format);
}

async function exportSocialCardGif(onProgress) {
  var card = await prepareCardForCapture();
  var frames = [];

  for (var frameIndex = 0; frameIndex < FRAME_COUNT; frameIndex += 1) {
    if (onProgress) {
      onProgress(frameIndex + 1, FRAME_COUNT);
    }
    frames.push(await captureCardFrame(card, 1));
    if (frameIndex < FRAME_COUNT - 1) {
      await delay(CAPTURE_INTERVAL_MS);
    }
  }

  if (onProgress) {
    onProgress(FRAME_COUNT, FRAME_COUNT, 'encoding');
  }

  var blob = encodeGif(frames, CARD_WIDTH, CARD_HEIGHT);
  downloadBlob(blob, GIF_FILENAME);
  return GIF_FILENAME;
}

function runExportTask(button, task) {
  if (exportBusy || button.disabled) return;

  var defaultLabel = button.textContent;
  exportBusy = true;
  setExportControlsDisabled(true);
  button.textContent = 'Exporting…';
  setStatus('Preparing capture…');

  task(function onProgress(current, total, phase) {
    if (phase === 'encoding') {
      button.textContent = 'Encoding GIF…';
      setStatus('Building GIF file…');
      return;
    }
    button.textContent = 'Recording… ' + current + '/' + total;
    setStatus('Capturing frame ' + current + ' of ' + total + '.');
  })
    .then(function (filename) {
      button.textContent = defaultLabel;
      setStatus('Saved as ' + filename + '.');
    })
    .catch(function (error) {
      button.textContent = defaultLabel;
      setStatus(error instanceof Error ? error.message : 'Export failed.');
      console.error('Export failed:', error);
    })
    .finally(function () {
      exportBusy = false;
      setExportControlsDisabled(false);
    });
}

function initSocialCardExports() {
  var jpegButton = document.getElementById('download-jpeg-btn');
  var webpButton = document.getElementById('download-webp-btn');
  var gifButton = document.getElementById('download-gif-btn');

  if (jpegButton) {
    jpegButton.addEventListener('click', function () {
      runExportTask(jpegButton, function () {
        setStatus('Capturing ' + (CARD_WIDTH * STATIC_EXPORT_SCALE) + 'px JPEG…');
        return exportSocialCardStatic('jpeg');
      });
    });
  }

  if (webpButton) {
    webpButton.addEventListener('click', function () {
      runExportTask(webpButton, function () {
        setStatus('Capturing ' + (CARD_WIDTH * STATIC_EXPORT_SCALE) + 'px WebP…');
        return exportSocialCardStatic('webp');
      });
    });
  }

  if (gifButton) {
    gifButton.addEventListener('click', function () {
      runExportTask(gifButton, function (onProgress) {
        setStatus('Wait for dot ripple, then frames capture automatically.');
        return exportSocialCardGif(onProgress);
      });
    });
  }
}

initSocialCardExports();
