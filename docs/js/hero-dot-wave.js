(function () {
  var DOT_RGB = [148, 148, 163];

  function fract(value) {
    return value - Math.floor(value);
  }

  function hash21(cellX, cellY) {
    return fract(Math.sin(cellX * 127.1 + cellY * 311.7) * 43758.5453);
  }

  function cellPhase(cellX, cellY) {
    return {
      primary: hash21(cellX, cellY) * Math.PI * 2,
      secondary: hash21(cellX + 19, cellY + 43) * Math.PI * 2
    };
  }

  function waveField(uvX, uvY, time, cellX, cellY) {
    var phase = cellPhase(cellX, cellY);
    var primary = phase.primary;
    var secondary = phase.secondary;
    var t = time + primary * 0.42;
    var alongX = Math.sin(uvX * 14 + primary * 0.6 - t * 1.35) * 0.34;
    var alongY = Math.sin(uvY * 11 + secondary * 0.45 - t * 0.92) * 0.27;
    var diagonal = Math.sin((uvX * 1.2 + uvY * 0.9) * 12 + primary * 0.35 - t * 2.05) * 0.3;
    var ripple = Math.sin(uvX * 23 + uvY * 17 + secondary - t * 2.55) * 0.17;
    var wobble = Math.sin((uvX + uvY) * 10 + primary - t * 1.15) * 0.13;
    var drift = Math.sin(uvX * 7 - uvY * 8 + secondary * 0.8 - t * 0.65) * 0.11;
    return alongX + alongY + diagonal + ripple + wobble + drift;
  }

  function dotAlphaAtCell(cellX, cellY, width, height, spacing, time) {
    var centerX = (cellX + 0.5) * spacing;
    var centerY = (cellY + 0.5) * spacing;
    var uvX = centerX / width;
    var uvY = centerY / height;
    var wave = waveField(uvX, uvY, time, cellX, cellY);
    var grain = hash21(cellX, cellY);
    var sizeScale = 1;
    if (grain < 0.22) sizeScale = 0.52;
    else if (grain < 0.48) sizeScale = 0.76;
    var peak = Math.max(wave, 0);
    return Math.min(0.82, (0.16 + wave * 0.26 + peak * 0.18) * (0.75 + sizeScale * 0.25));
  }

  function dotRadiusAtCell(cellX, cellY, width, height, spacing, time) {
    var centerX = (cellX + 0.5) * spacing;
    var centerY = (cellY + 0.5) * spacing;
    var uvX = centerX / width;
    var uvY = centerY / height;
    var wave = waveField(uvX, uvY, time, cellX, cellY);
    var grain = hash21(cellX, cellY);
    var sizeScale = 1;
    if (grain < 0.22) sizeScale = 0.52;
    else if (grain < 0.48) sizeScale = 0.76;
    return spacing * (0.34 + wave * 0.17) * sizeScale * 0.5;
  }

  function spacingForSize(width, height) {
    var target = width < 480 ? 14 : width < 768 ? 13 : width < 1200 ? 12 : width < 1600 ? 11 : 10;
    var cols = Math.ceil(width / target);
    var rows = Math.ceil(height / target);
    var maxCells = width >= 1600 ? 18000 : width >= 1200 ? 14000 : width >= 768 ? 9000 : 5500;
    if (cols * rows <= maxCells) return target;
    var computed = Math.ceil(Math.sqrt((width * height) / maxCells));
    return Math.max(9, Math.min(computed, target + 2));
  }

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function initHeroDotWave(wrap) {
    if (!wrap || wrap.dataset.initialized === 'true') return;
    wrap.dataset.initialized = 'true';

    if (prefersReducedMotion()) {
      var fallback = document.createElement('div');
      fallback.className = 'hero-dot-wave hero-dot-wave--css';
      fallback.setAttribute('aria-hidden', 'true');
      wrap.appendChild(fallback);
      return;
    }

    var canvas = document.createElement('canvas');
    canvas.className = 'hero-dot-wave hero-dot-wave--canvas';
    canvas.setAttribute('aria-hidden', 'true');
    wrap.appendChild(canvas);

    var ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    var animationFrame = 0;
    var startTime = performance.now();
    var spacing = 16;
    var layoutWidth = 0;
    var layoutHeight = 0;
    var pixelRatio = 1;

    function resize() {
      var rect = wrap.getBoundingClientRect();
      layoutWidth = Math.max(1, Math.floor(rect.width));
      layoutHeight = Math.max(1, Math.floor(rect.height));
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(layoutWidth * pixelRatio);
      canvas.height = Math.floor(layoutHeight * pixelRatio);
      canvas.style.width = layoutWidth + 'px';
      canvas.style.height = layoutHeight + 'px';
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      spacing = spacingForSize(layoutWidth, layoutHeight);
    }

    function drawFrame(time) {
      var elapsed = (time - startTime) / 1000;
      ctx.clearRect(0, 0, layoutWidth, layoutHeight);
      var cols = Math.ceil(layoutWidth / spacing);
      var rows = Math.ceil(layoutHeight / spacing);
      var r = DOT_RGB[0];
      var g = DOT_RGB[1];
      var b = DOT_RGB[2];

      for (var row = 0; row < rows; row += 1) {
        for (var col = 0; col < cols; col += 1) {
          var alpha = dotAlphaAtCell(col, row, layoutWidth, layoutHeight, spacing, elapsed);
          if (alpha < 0.04) continue;
          var radius = dotRadiusAtCell(col, row, layoutWidth, layoutHeight, spacing, elapsed);
          var x = (col + 0.5) * spacing;
          var y = (row + 0.5) * spacing;
          ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    function tick(time) {
      drawFrame(time);
      animationFrame = window.requestAnimationFrame(tick);
    }

    resize();
    animationFrame = window.requestAnimationFrame(tick);

    var resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(function () { resize(); })
      : null;
    if (resizeObserver) resizeObserver.observe(wrap);
    else window.addEventListener('resize', resize);

    window.addEventListener('pagehide', function () {
      window.cancelAnimationFrame(animationFrame);
      if (resizeObserver) resizeObserver.disconnect();
    });
  }

  document.querySelectorAll('[data-hero-dot-wave]').forEach(initHeroDotWave);
})();
