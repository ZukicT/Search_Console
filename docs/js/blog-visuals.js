(function () {
  var TRAFFIC_PREV = [42, 44, 43, 45, 46, 44, 47];
  var TRAFFIC_CURR = [38, 35, 33, 30, 28, 26, 24];

  function createSvg(name, attrs) {
    var node = document.createElementNS('http://www.w3.org/2000/svg', name);
    Object.keys(attrs || {}).forEach(function (key) {
      node.setAttribute(key, attrs[key]);
    });
    return node;
  }

  function seriesCeiling(groups) {
    var max = 0;
    groups.forEach(function (values) {
      values.forEach(function (value) {
        if (value > max) max = value;
      });
    });
    return max || 1;
  }

  function plotPoint(value, index, count, width, height, padX, padY, max) {
    var plotW = width - padX * 2;
    var plotH = height - padY * 2;
    var step = plotW / (count - 1);
    return {
      x: padX + index * step,
      y: padY + plotH - (value / max) * plotH,
    };
  }

  function linePath(values, width, height, padX, padY, max) {
    return values
      .map(function (value, index) {
        var point = plotPoint(value, index, values.length, width, height, padX, padY, max);
        return (index === 0 ? 'M' : 'L') + point.x.toFixed(1) + ' ' + point.y.toFixed(1);
      })
      .join(' ');
  }

  function areaPath(values, width, height, padX, padY, max) {
    var first = plotPoint(values[0], 0, values.length, width, height, padX, padY, max);
    var last = plotPoint(values[values.length - 1], values.length - 1, values.length, width, height, padX, padY, max);
    var baseline = height - 1;
    return linePath(values, width, height, padX, padY, max)
      + ' L' + last.x.toFixed(1) + ' ' + baseline
      + ' L' + first.x.toFixed(1) + ' ' + baseline
      + ' Z';
  }

  function renderTrafficPlot(container) {
    if (!container || container.dataset.rendered === 'true') return;
    var width = 560;
    var height = 140;
    var padX = 8;
    var padY = 8;
    var ceiling = seriesCeiling([TRAFFIC_PREV, TRAFFIC_CURR]);

    var svg = createSvg('svg', {
      viewBox: '0 0 ' + width + ' ' + height,
      role: 'img',
      'aria-label': 'Sample chart comparing page clicks between two date ranges',
      focusable: 'false',
    });

    var defs = createSvg('defs', {});
    var areaFill = createSvg('linearGradient', {
      id: 'blog-traffic-area',
      x1: '0',
      y1: '0',
      x2: '0',
      y2: '1',
    });
    areaFill.appendChild(createSvg('stop', { offset: '0', 'stop-color': '#0f62fe', 'stop-opacity': '0.24' }));
    areaFill.appendChild(createSvg('stop', { offset: '1', 'stop-color': '#0f62fe', 'stop-opacity': '0' }));
    defs.appendChild(areaFill);
    svg.appendChild(defs);

    [0, 0.5].forEach(function (fraction) {
      var y = (height * fraction).toFixed(1);
      svg.appendChild(createSvg('line', {
        class: 'blog-visual-traffic__grid',
        x1: '0',
        y1: y,
        x2: String(width),
        y2: y,
      }));
    });
    svg.appendChild(createSvg('line', {
      class: 'blog-visual-traffic__axis',
      x1: '0',
      y1: '0',
      x2: '0',
      y2: String(height),
    }));
    svg.appendChild(createSvg('line', {
      class: 'blog-visual-traffic__axis',
      x1: '0',
      y1: String(height - 1),
      x2: String(width),
      y2: String(height - 1),
    }));

    svg.appendChild(
      createSvg('path', {
        class: 'blog-visual-traffic__area--curr',
        d: areaPath(TRAFFIC_CURR, width, height, padX, padY, ceiling),
      }),
    );
    svg.appendChild(
      createSvg('path', {
        class: 'blog-visual-traffic__line blog-visual-traffic__line--prev',
        d: linePath(TRAFFIC_PREV, width, height, padX, padY, ceiling),
      }),
    );
    var currLine = createSvg('path', {
      class: 'blog-visual-traffic__line blog-visual-traffic__line--curr',
      d: linePath(TRAFFIC_CURR, width, height, padX, padY, ceiling),
    });
    svg.appendChild(currLine);
    TRAFFIC_CURR.forEach(function (value, index) {
      var point = plotPoint(value, index, TRAFFIC_CURR.length, width, height, padX, padY, ceiling);
      svg.appendChild(createSvg('rect', {
        class: 'blog-visual-traffic__marker',
        x: (point.x - 2.5).toFixed(1),
        y: (point.y - 2.5).toFixed(1),
        width: '5',
        height: '5',
      }));
    });

    container.replaceChildren(svg);

    var lineLength = currLine.getTotalLength();
    currLine.style.setProperty('--line-len', String(lineLength));
    currLine.style.strokeDasharray = String(lineLength);
    currLine.style.strokeDashoffset = String(lineLength);

    container.dataset.rendered = 'true';
  }

  function renderCwvRing(container, config) {
    if (!container || container.dataset.rendered === 'true') return;
    var size = 72;
    var stroke = 5;
    var radius = (size - stroke) / 2;
    var circumference = 2 * Math.PI * radius;
    var dash = (config.score / 100) * circumference;

    var svg = createSvg('svg', {
      viewBox: '0 0 ' + size + ' ' + size,
      role: 'img',
      'aria-hidden': 'true',
      focusable: 'false',
    });

    svg.appendChild(
      createSvg('circle', {
        class: 'blog-visual-cwv__track',
        cx: String(size / 2),
        cy: String(size / 2),
        r: String(radius),
      }),
    );

    var center = size / 2;
    var progress = createSvg('circle', {
      class: 'blog-visual-cwv__progress',
      cx: String(center),
      cy: String(center),
      r: String(radius),
      stroke: config.color,
      transform: 'rotate(-90 ' + center + ' ' + center + ')',
      style: '--circ:' + circumference + ';--target:' + (circumference - dash) + ';--delay:' + config.delay,
    });
    svg.appendChild(progress);

    var label = createSvg('text', {
      class: 'blog-visual-cwv__label',
      x: String(size / 2),
      y: String(size / 2 + 4),
      'text-anchor': 'middle',
    });
    label.textContent = config.label;
    svg.appendChild(label);

    container.replaceChildren(svg);
    container.dataset.rendered = 'true';
  }

  function initCwvVisual(root) {
    var rings = [
      { label: 'LCP', score: 92, color: '#24a148', delay: '0.05s' },
      { label: 'INP', score: 68, color: '#f1c21b', delay: '0.2s' },
      { label: 'CLS', score: 96, color: '#24a148', delay: '0.35s' },
    ];
    root.querySelectorAll('[data-cwv-ring]').forEach(function (node, index) {
      renderCwvRing(node, rings[index]);
    });
  }

  function initVisual(root) {
    var type = root.getAttribute('data-blog-visual');
    if (type === 'traffic') {
      renderTrafficPlot(root.querySelector('[data-traffic-plot]'));
    }
    if (type === 'cwv') {
      initCwvVisual(root);
    }
  }

  var CHART_BLINK_MARKUP = '<div class="blog-visual__blink-face" data-blog-blink>'
    + '<svg class="blog-visual__blink-eyes" viewBox="0 0 144 144" aria-hidden="true" focusable="false">'
    + '<g transform="translate(76.5 94.5)"><ellipse rx="16" ry="26" fill="#ffffff"/>'
    + '<g data-blog-blink-pupil><ellipse rx="5.5" ry="8" fill="#0f62fe"/></g>'
    + '<ellipse class="blog-blink__lid" rx="20" ry="32" fill="#0f62fe"/></g>'
    + '<g transform="translate(109.5 102.5)"><ellipse rx="13" ry="20" fill="#ffffff"/>'
    + '<g data-blog-blink-pupil><ellipse rx="4.6" ry="6.6" fill="#0f62fe"/></g>'
    + '<ellipse class="blog-blink__lid" rx="17" ry="26" fill="#0f62fe"/></g>'
    + '</svg></div>';

  function clampUnit(value) {
    if (value > 1) return 1;
    if (value < -1) return -1;
    return value;
  }

  function setChartBlinkPupils(svg, x, y) {
    var move = 'translate(' + (x * 6.5).toFixed(2) + ' ' + (y * 5.5).toFixed(2) + ')';
    svg.querySelectorAll('[data-blog-blink-pupil]').forEach(function (pupil) {
      pupil.setAttribute('transform', move);
    });
  }

  function blinkChartLids(svg) {
    svg.querySelectorAll('.blog-blink__lid').forEach(function (lid) {
      lid.classList.remove('is-blinking');
      void lid.getBoundingClientRect();
      lid.classList.add('is-blinking');
    });
  }

  function mountChartBlinks() {
    var faces = [];
    document.querySelectorAll('.blog-visual').forEach(function (figure) {
      if (figure.querySelector('[data-blog-blink]')) return;
      var host = document.createElement('div');
      host.className = 'blog-visual__blink';
      host.setAttribute('aria-hidden', 'true');
      host.innerHTML = CHART_BLINK_MARKUP;
      figure.appendChild(host);
      var face = host.querySelector('[data-blog-blink]');
      if (face) faces.push({ figure: figure, face: face });
    });
    if (!faces.length) return;

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var lastPointer = null;

    function gazeFromPointer(face, event) {
      var rect = face.getBoundingClientRect();
      return {
        x: clampUnit((event.clientX - (rect.left + rect.width * 0.5)) / 150),
        y: clampUnit((event.clientY - (rect.top + rect.height * 0.4)) / 130),
      };
    }

    function applyGaze(event) {
      faces.forEach(function (entry) {
        if (entry.face._chartLook) {
          setChartBlinkPupils(entry.face, entry.face._chartLook.x, entry.face._chartLook.y);
          return;
        }
        if (!event) return;
        var gaze = gazeFromPointer(entry.face, event);
        setChartBlinkPupils(entry.face, gaze.x, gaze.y);
      });
    }

    document.addEventListener('pointermove', function (event) {
      lastPointer = event;
      applyGaze(event);
    }, { passive: true });

    document.addEventListener('animationend', function (event) {
      if (event.animationName !== 'blog-blink-lid') return;
      event.target.classList.remove('is-blinking');
    });

    faces.forEach(function (entry) {
      var face = entry.face;
      face._chartLook = { x: -0.45, y: 0.9 };
      setChartBlinkPupils(face, face._chartLook.x, face._chartLook.y);

        function arrive() {
        if (entry.figure._blinkArrived) return;
        entry.figure._blinkArrived = true;
        queueChartSound(entry.figure);
        if (reduceMotion) return;
        window.setTimeout(function () { blinkChartLids(face); }, 620);
        window.setTimeout(function () { blinkChartLids(face); }, 860);
        window.setTimeout(function () {
          face._chartLook = null;
          applyGaze(lastPointer);
        }, 1280);
        function idleBlink() {
          window.setTimeout(function () {
            blinkChartLids(face);
            idleBlink();
          }, 2600 + Math.random() * 3200);
        }
        idleBlink();
      }

      if (entry.figure.classList.contains('is-visible')) {
        arrive();
      } else {
        var observer = new MutationObserver(function () {
          if (!entry.figure.classList.contains('is-visible')) return;
          observer.disconnect();
          arrive();
        });
        observer.observe(entry.figure, { attributes: true, attributeFilter: ['class'] });
      }
    });
  }

  var chartSoundQueue = [];
  var chartSoundArmed = false;
  var chartSoundBusy = false;
  var CHART_SOUND_GAP_MS = 480;

  function queueChartSound(figure) {
    if (!figure || figure._chartSoundQueued) return;
    figure._chartSoundQueued = true;
    chartSoundQueue.push(figure);
    if (chartSoundArmed) drainChartSounds();
  }

  function drainChartSounds() {
    if (!chartSoundArmed || chartSoundBusy || !chartSoundQueue.length) return;
    if (!window.SiteSound || !window.SiteSound.isEnabled()) {
      chartSoundQueue = [];
      return;
    }
    chartSoundQueue.shift();
    chartSoundBusy = true;
    window.SiteSound.play('chart');
    window.setTimeout(function () {
      chartSoundBusy = false;
      drainChartSounds();
    }, CHART_SOUND_GAP_MS);
  }

  function armChartSounds() {
    if (chartSoundArmed) return;
    chartSoundArmed = true;
    window.setTimeout(drainChartSounds, 280);
  }

  function bindChartSounds() {
    document.addEventListener('pointerdown', armChartSounds, { capture: true });
    document.addEventListener('keydown', armChartSounds);
  }

  function initAll() {
    document.querySelectorAll('[data-blog-visual]').forEach(initVisual);
    bindChartSounds();
    mountChartBlinks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
