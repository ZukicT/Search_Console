(function () {
  var ACCENT = '#2997ff';
  var PERFORMANCE_CLICKS = [3, 2, 4, 3, 5, 4, 6];
  var DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  var DAY_LABELS_FALLBACK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  var SPARKLINES = {
    ctr: {
      color: '#64d2ff',
      values: [11.1, 9.1, 14.3, 12.5, 14.3, 13.3, 14.3],
    },
    position: {
      color: '#ffd60a',
      values: [5.2, 5.8, 4.9, 5.1, 4.6, 4.9, 4.8],
    },
  };

  var VITALS = [
    { key: 'lcp', label: 'LCP', score: 92, color: '#30d158' },
    { key: 'inp', label: 'INP', score: 78, color: '#ffd60a' },
    { key: 'cls', label: 'CLS', score: 96, color: '#30d158' },
  ];

  var LINE_VIEW = {
    width: 600,
    height: 188,
    plot: { left: 34, right: 12, top: 12, bottom: 28 },
  };

  var SPARK_VIEW = {
    width: 320,
    height: 120,
    plot: { left: 6, right: 6, top: 12, bottom: 22 },
  };

  var chartInstance = 0;

  function translate(key, fallback) {
    if (window.SC_I18N && typeof SC_I18N.t === 'function') {
      var value = SC_I18N.t(key);
      if (value) return value;
    }
    return fallback || '';
  }

  function getDayLabels() {
    return DAY_KEYS.map(function (key, index) {
      return translate('chart.days.' + key, DAY_LABELS_FALLBACK[index]);
    });
  }

  function formatInsight(day, clicks) {
    var template = translate('chart.insightTemplate', 'Best day: {{day}} · {{clicks}} clicks');
    return template
      .replace('{{day}}', day)
      .replace('{{clicks}}', String(clicks));
  }

  function createSvgElement(name, attrs) {
    attrs = attrs || {};
    var node = document.createElementNS('http://www.w3.org/2000/svg', name);
    Object.keys(attrs).forEach(function (key) {
      node.setAttribute(key, attrs[key]);
    });
    return node;
  }

  function seriesPeak(values) {
    var peak = 0;
    values.forEach(function (value) {
      if (value > peak) peak = value;
    });
    return peak || 1;
  }

  function plotWidth(view) {
    return view.width - view.plot.left - view.plot.right;
  }

  function plotHeight(view) {
    return view.height - view.plot.top - view.plot.bottom;
  }

  function laneBounds(view) {
    return { top: view.plot.top, height: plotHeight(view) };
  }

  function pointAt(index, value, peak, view, count) {
    var width = plotWidth(view);
    var bounds = laneBounds(view);
    var step = count > 1 ? width / (count - 1) : 0;
    var x = view.plot.left + step * index;
    var laneInset = bounds.height * 0.08;
    var y =
      bounds.top +
      bounds.height -
      laneInset -
      (value / peak) * (bounds.height - laneInset * 2);
    return { x: x, y: y };
  }

  function lineSegmentsPath(values, peak, view) {
    var points = values.map(function (value, index) {
      return pointAt(index, value, peak, view, values.length);
    });

    if (!points.length) return '';

    return points.reduce(function (path, point, index) {
      return (
        path +
        (index === 0 ? 'M' : 'L') +
        point.x.toFixed(2) +
        ' ' +
        point.y.toFixed(2)
      );
    }, '');
  }

  function areaPath(values, peak, view) {
    var bounds = laneBounds(view);
    var baseline = bounds.top + bounds.height;
    var line = lineSegmentsPath(values, peak, view);
    var lastIndex = values.length - 1;
    var last = pointAt(lastIndex, values[lastIndex], peak, view, values.length);
    var first = pointAt(0, values[0], peak, view, values.length);
    return (
      line +
      ' L' +
      last.x.toFixed(2) +
      ' ' +
      baseline +
      ' L' +
      first.x.toFixed(2) +
      ' ' +
      baseline +
      ' Z'
    );
  }

  function appendPlotClip(defs, clipId, view) {
    var pad = 4;
    var bounds = laneBounds(view);
    var clip = createSvgElement('clipPath', { id: clipId });
    clip.appendChild(
      createSvgElement('rect', {
        x: String(view.plot.left - pad),
        y: String(bounds.top - pad),
        width: String(plotWidth(view) + pad * 2),
        height: String(bounds.height + pad * 2),
      }),
    );
    defs.appendChild(clip);
  }

  function formatTick(value) {
    if (value >= 1000) {
      return (value / 1000).toFixed(value % 1000 === 0 ? 0 : 1) + 'k';
    }
    return String(Math.round(value));
  }

  function yAxisValues(peak) {
    if (peak <= 5) {
      var small = [];
      for (var i = 0; i <= peak; i += 1) small.push(i);
      return small;
    }
    var step = Math.max(1, Math.ceil(peak / 4));
    var ticks = [];
    for (var tick = 0; tick <= peak; tick += step) ticks.push(tick);
    if (ticks[ticks.length - 1] !== peak) ticks.push(peak);
    return ticks;
  }

  function renderChartGrid(svg, view, peak) {
    var left = view.plot.left;
    var right = view.width - view.plot.right;
    yAxisValues(peak).forEach(function (tickValue) {
      var point = pointAt(0, tickValue, peak, view, PERFORMANCE_CLICKS.length);
      svg.appendChild(
        createSvgElement('line', {
          class: 'performance-chart-grid',
          x1: String(left),
          y1: String(point.y),
          x2: String(right),
          y2: String(point.y),
        }),
      );
    });
  }

  function renderYAxisLabels(svg, values, view) {
    var peak = seriesPeak(values);
    yAxisValues(peak).forEach(function (tickValue) {
      var point = pointAt(0, tickValue, peak, view, values.length);
      var text = createSvgElement('text', {
        class: 'performance-chart-axis-label performance-chart-axis-label--y',
        x: String(view.plot.left - 8),
        y: String(point.y + 3),
        'text-anchor': 'end',
      });
      text.textContent = formatTick(tickValue);
      svg.appendChild(text);
    });
  }

  function renderPerformanceChart(plot) {
    if (!plot) return;

    var view = LINE_VIEW;
    var peak = seriesPeak(PERFORMANCE_CLICKS);
    chartInstance += 1;
    var clipId = 'performance-chart-clip-' + chartInstance;

    var svg = createSvgElement('svg', {
      class: 'performance-chart-svg',
      viewBox: '0 0 ' + view.width + ' ' + view.height,
      role: 'img',
      'aria-hidden': 'true',
      focusable: 'false',
    });

    var defs = createSvgElement('defs', {});
    appendPlotClip(defs, clipId, view);
    svg.appendChild(defs);

    renderChartGrid(svg, view, peak);
    renderYAxisLabels(svg, PERFORMANCE_CLICKS, view);

    var seriesLayer = createSvgElement('g', { 'clip-path': 'url(#' + clipId + ')' });
    seriesLayer.appendChild(
      createSvgElement('path', {
        class: 'performance-chart-area',
        d: areaPath(PERFORMANCE_CLICKS, peak, view),
        fill: ACCENT,
        'fill-opacity': '0.1',
      }),
    );
    seriesLayer.appendChild(
      createSvgElement('path', {
        class: 'performance-chart-line',
        d: lineSegmentsPath(PERFORMANCE_CLICKS, peak, view),
        stroke: ACCENT,
      }),
    );

    PERFORMANCE_CLICKS.forEach(function (value, index) {
      var point = pointAt(index, value, peak, view, PERFORMANCE_CLICKS.length);
      seriesLayer.appendChild(
        createSvgElement('circle', {
          class: 'performance-chart-point',
          cx: String(point.x),
          cy: String(point.y),
          r: '3.5',
          fill: ACCENT,
          'fill-opacity': '0.85',
        }),
      );
    });

    svg.appendChild(seriesLayer);

    getDayLabels().forEach(function (label, index) {
      var point = pointAt(index, 0, peak, view, PERFORMANCE_CLICKS.length);
      var text = createSvgElement('text', {
        class: 'performance-chart-axis-label',
        x: String(point.x),
        y: String(view.height - 8),
        'text-anchor': 'middle',
      });
      text.textContent = label;
      svg.appendChild(text);
    });

    plot.replaceChildren(svg);
  }

  function renderSparkline(plot, config) {
    if (!plot || !config) return;

    var view = SPARK_VIEW;
    var peak = seriesPeak(config.values);
    chartInstance += 1;
    var clipId = 'sparkline-clip-' + chartInstance;

    var svg = createSvgElement('svg', {
      class: 'sparkline-chart-svg',
      viewBox: '0 0 ' + view.width + ' ' + view.height,
      role: 'img',
      'aria-hidden': 'true',
      focusable: 'false',
    });

    var defs = createSvgElement('defs', {});
    appendPlotClip(defs, clipId, view);
    svg.appendChild(defs);

    var seriesLayer = createSvgElement('g', { 'clip-path': 'url(#' + clipId + ')' });
    seriesLayer.appendChild(
      createSvgElement('path', {
        class: 'sparkline-chart-area',
        d: areaPath(config.values, peak, view),
        fill: config.color,
        'fill-opacity': '0.1',
      }),
    );
    seriesLayer.appendChild(
      createSvgElement('path', {
        class: 'sparkline-chart-line',
        d: lineSegmentsPath(config.values, peak, view),
        stroke: config.color,
      }),
    );
    svg.appendChild(seriesLayer);

    plot.replaceChildren(svg);
  }

  function renderVitalsRing(container, vital) {
    if (!container) return;

    var size = 72;
    var stroke = 5;
    var radius = (size - stroke) / 2;
    var circumference = 2 * Math.PI * radius;
    var dash = (vital.score / 100) * circumference;

    var svg = createSvgElement('svg', {
      class: 'vitals-ring',
      viewBox: '0 0 ' + size + ' ' + size,
      role: 'img',
      'aria-hidden': 'true',
      focusable: 'false',
    });

    svg.appendChild(
      createSvgElement('circle', {
        class: 'vitals-ring__track',
        cx: String(size / 2),
        cy: String(size / 2),
        r: String(radius),
      }),
    );

    svg.appendChild(
      createSvgElement('circle', {
        class: 'vitals-ring__progress',
        cx: String(size / 2),
        cy: String(size / 2),
        r: String(radius),
        stroke: vital.color,
        'stroke-dasharray': dash + ' ' + circumference,
        'stroke-dashoffset': '0',
      }),
    );

    var label = createSvgElement('text', {
      class: 'vitals-ring__label',
      x: String(size / 2),
      y: String(size / 2 + 4),
      'text-anchor': 'middle',
    });
    label.textContent = vital.label;
    svg.appendChild(label);

    container.replaceChildren(svg);
  }

  function peakDayInsight(values, labels) {
    var peak = 0;
    var peakIndex = 0;
    values.forEach(function (value, index) {
      if (value >= peak) {
        peak = value;
        peakIndex = index;
      }
    });
    return { day: labels[peakIndex], clicks: peak };
  }

  function updatePerformanceInsight(root) {
    var insightNode = root.querySelector('[data-chart-insight]');
    if (!insightNode) return;
    var peak = peakDayInsight(PERFORMANCE_CLICKS, getDayLabels());
    insightNode.textContent = formatInsight(peak.day, peak.clicks);
  }

  function initPerformanceChart(root) {
    var plot = root.querySelector('[data-performance-chart-plot]');
    renderPerformanceChart(plot);
    updatePerformanceInsight(root);
  }

  function initSparklineChart(root) {
    var type = root.getAttribute('data-sparkline-type') || 'ctr';
    var config = SPARKLINES[type];
    if (!config) return;
    renderSparkline(root.querySelector('[data-sparkline-plot]'), config);
  }

  function initVitalsChart(root) {
    root.querySelectorAll('.vitals-chart-item').forEach(function (item) {
      var key = item.getAttribute('data-vital');
      var vital = VITALS.find(function (entry) {
        return entry.key === key;
      });
      if (!vital) return;
      renderVitalsRing(item.querySelector('[data-vitals-ring]'), vital);
    });
  }

  function initSiteCharts() {
    document.querySelectorAll('[data-performance-chart]').forEach(initPerformanceChart);
    document.querySelectorAll('[data-sparkline-chart]').forEach(initSparklineChart);
    document.querySelectorAll('[data-vitals-chart]').forEach(initVitalsChart);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSiteCharts);
  } else {
    initSiteCharts();
  }

  document.addEventListener('locale:applied', initSiteCharts);
})();
