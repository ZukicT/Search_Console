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

  function linePath(values, width, height, padX, padY) {
    var max = 0;
    values.forEach(function (v) {
      if (v > max) max = v;
    });
    if (!max) max = 1;
    var plotW = width - padX * 2;
    var plotH = height - padY * 2;
    var step = plotW / (values.length - 1);
    return values
      .map(function (value, index) {
        var x = padX + index * step;
        var y = padY + plotH - (value / max) * plotH;
        return (index === 0 ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(1);
      })
      .join(' ');
  }

  function areaPath(values, width, height, padX, padY) {
    var max = 0;
    values.forEach(function (v) {
      if (v > max) max = v;
    });
    if (!max) max = 1;
    var plotW = width - padX * 2;
    var plotH = height - padY * 2;
    var step = plotW / (values.length - 1);
    var baseline = padY + plotH;
    var points = values.map(function (value, index) {
      var x = padX + index * step;
      var y = padY + plotH - (value / max) * plotH;
      return x.toFixed(1) + ',' + y.toFixed(1);
    });
    return (
      'M' +
      padX +
      ' ' +
      baseline +
      ' L' +
      points.join(' L') +
      ' L' +
      (padX + plotW) +
      ' ' +
      baseline +
      ' Z'
    );
  }

  function renderTrafficPlot(container) {
    if (!container || container.dataset.rendered === 'true') return;
    var width = 560;
    var height = 140;
    var padX = 12;
    var padY = 14;

    var svg = createSvg('svg', {
      viewBox: '0 0 ' + width + ' ' + height,
      role: 'img',
      'aria-label': 'Sample chart comparing page clicks between two date ranges',
      focusable: 'false',
    });

    svg.appendChild(
      createSvg('path', {
        class: 'blog-visual-traffic__area--curr',
        d: areaPath(TRAFFIC_CURR, width, height, padX, padY),
      }),
    );
    svg.appendChild(
      createSvg('path', {
        class: 'blog-visual-traffic__line blog-visual-traffic__line--prev',
        d: linePath(TRAFFIC_PREV, width, height, padX, padY),
      }),
    );
    var currLine = createSvg('path', {
      class: 'blog-visual-traffic__line blog-visual-traffic__line--curr',
      d: linePath(TRAFFIC_CURR, width, height, padX, padY),
    });
    svg.appendChild(currLine);

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
      { label: 'LCP', score: 92, color: '#30d158', delay: '0.05s' },
      { label: 'INP', score: 68, color: '#ffd60a', delay: '0.2s' },
      { label: 'CLS', score: 96, color: '#30d158', delay: '0.35s' },
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

  function initAll() {
    document.querySelectorAll('[data-blog-visual]').forEach(initVisual);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
