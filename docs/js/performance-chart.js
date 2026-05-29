(function () {
  var SERIES = [
    {
      key: 'clicks',
      color: '#2997ff',
      values: [3, 2, 4, 3, 5, 4, 6],
      areaFill: true,
    },
    {
      key: 'impressions',
      color: '#bf5af2',
      values: [18, 22, 28, 24, 35, 30, 42],
      areaFill: false,
    },
  ];

  var LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  var VIEW_WIDTH = 600;
  var VIEW_HEIGHT = 232;
  var PLOT = { left: 36, right: 36, top: 16, bottom: 32 };
  var chartInstance = 0;

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function plotWidth() {
    return VIEW_WIDTH - PLOT.left - PLOT.right;
  }

  function plotHeight() {
    return VIEW_HEIGHT - PLOT.top - PLOT.bottom;
  }

  function seriesPeak(values) {
    var peak = 0;
    values.forEach(function (value) {
      if (value > peak) peak = value;
    });
    return peak || 1;
  }

  function pointAt(index, value, peak) {
    var width = plotWidth();
    var height = plotHeight();
    var count = SERIES[0].values.length;
    var step = count > 1 ? width / (count - 1) : 0;
    var x = PLOT.left + step * index;
    var y = PLOT.top + height - (value / peak) * height;
    return { x: x, y: y };
  }

  function smoothLinePath(values, peak) {
    var points = values.map(function (value, index) {
      return pointAt(index, value, peak);
    });

    if (points.length < 2) {
      return 'M' + points[0].x.toFixed(2) + ' ' + points[0].y.toFixed(2);
    }

    var path = 'M' + points[0].x.toFixed(2) + ' ' + points[0].y.toFixed(2);

    for (var i = 0; i < points.length - 1; i += 1) {
      var current = points[i];
      var next = points[i + 1];
      var controlX = ((current.x + next.x) / 2).toFixed(2);
      path +=
        ' C' +
        controlX +
        ' ' +
        current.y.toFixed(2) +
        ', ' +
        controlX +
        ' ' +
        next.y.toFixed(2) +
        ', ' +
        next.x.toFixed(2) +
        ' ' +
        next.y.toFixed(2);
    }

    return path;
  }

  function areaPath(values, peak) {
    var baseline = PLOT.top + plotHeight();
    var line = smoothLinePath(values, peak);
    var lastIndex = values.length - 1;
    var last = pointAt(lastIndex, values[lastIndex], peak);
    var first = pointAt(0, values[0], peak);
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

  function formatTick(value) {
    if (value >= 1000) {
      return (value / 1000).toFixed(value % 1000 === 0 ? 0 : 1) + 'k';
    }
    return String(Math.round(value));
  }

  function createSvgElement(name, attrs) {
    var node = document.createElementNS('http://www.w3.org/2000/svg', name);
    Object.keys(attrs).forEach(function (key) {
      node.setAttribute(key, attrs[key]);
    });
    return node;
  }

  function renderYAxisLabels(svg, side, values, color) {
    var peak = seriesPeak(values);
    var ticks = [peak, peak / 2, 0];
    var x = side === 'left' ? PLOT.left - 8 : VIEW_WIDTH - PLOT.right + 8;
    var anchor = side === 'left' ? 'end' : 'start';

    ticks.forEach(function (tickValue) {
      var point = pointAt(0, tickValue, peak);
      var text = createSvgElement('text', {
        class: 'performance-chart-axis-label performance-chart-axis-label--y',
        x: String(x),
        y: String(point.y + 3),
        'text-anchor': anchor,
        fill: color,
      });
      text.textContent = formatTick(tickValue);
      svg.appendChild(text);
    });
  }

  function renderChart(plot, fillId) {
    if (!plot) return;

    var svg = createSvgElement('svg', {
      class: 'performance-chart-svg',
      viewBox: '0 0 ' + VIEW_WIDTH + ' ' + VIEW_HEIGHT,
      role: 'img',
      'aria-hidden': 'true',
      focusable: 'false',
    });

    var defs = createSvgElement('defs', {});
    var gradient = createSvgElement('linearGradient', {
      id: fillId,
      x1: '0',
      y1: '0',
      x2: '0',
      y2: '1',
    });
    gradient.appendChild(
      createSvgElement('stop', { offset: '0%', 'stop-color': '#2997ff', 'stop-opacity': '0.22' }),
    );
    gradient.appendChild(
      createSvgElement('stop', { offset: '100%', 'stop-color': '#2997ff', 'stop-opacity': '0' }),
    );
    defs.appendChild(gradient);
    svg.appendChild(defs);

    for (var grid = 0; grid <= 3; grid += 1) {
      var gridY = PLOT.top + (plotHeight() / 3) * grid;
      svg.appendChild(
        createSvgElement('line', {
          class: 'performance-chart-grid',
          x1: String(PLOT.left),
          y1: String(gridY),
          x2: String(VIEW_WIDTH - PLOT.right),
          y2: String(gridY),
        }),
      );
    }

    renderYAxisLabels(svg, 'left', SERIES[0].values, '#2997ff');
    renderYAxisLabels(svg, 'right', SERIES[1].values, '#bf5af2');

    SERIES.forEach(function (series, seriesIndex) {
      var peak = seriesPeak(series.values);

      if (series.areaFill) {
        svg.appendChild(
          createSvgElement('path', {
            class: 'performance-chart-area performance-chart-area--' + series.key,
            d: areaPath(series.values, peak),
            fill: 'url(#' + fillId + ')',
          }),
        );
      }

      var path = createSvgElement('path', {
        class: 'performance-chart-line performance-chart-line--' + series.key,
        d: smoothLinePath(series.values, peak),
        stroke: series.color,
        pathLength: '1',
        'data-series': series.key,
      });
      path.style.setProperty('--performance-chart-line-delay', String(seriesIndex * 0.14) + 's');
      svg.appendChild(path);

      var lastIndex = series.values.length - 1;
      var lastValue = series.values[lastIndex];
      var lastPoint = pointAt(lastIndex, lastValue, peak);
      var dot = createSvgElement('circle', {
        class: 'performance-chart-dot performance-chart-dot--' + series.key,
        cx: String(lastPoint.x),
        cy: String(lastPoint.y),
        r: series.key === 'clicks' ? '4.5' : '4',
        fill: series.color,
        'data-series': series.key,
      });
      dot.style.setProperty('--performance-chart-dot-delay', String(0.75 + seriesIndex * 0.12) + 's');
      if (series.key === 'clicks') {
        dot.classList.add('performance-chart-dot--active');
      }
      svg.appendChild(dot);
    });

    LABELS.forEach(function (label, index) {
      var peak = seriesPeak(SERIES[0].values);
      var point = pointAt(index, 0, peak);
      var text = createSvgElement('text', {
        class: 'performance-chart-axis-label',
        x: String(point.x),
        y: String(VIEW_HEIGHT - 8),
        'text-anchor': 'middle',
      });
      text.textContent = label;
      svg.appendChild(text);
    });

    plot.replaceChildren(svg);
  }

  function animateMetricValue(node, target) {
    if (!node || prefersReducedMotion()) {
      if (node) node.textContent = String(target);
      return;
    }

    var start = 0;
    var duration = 900;
    var startTime = null;

    function frame(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(start + (target - start) * eased);
      node.textContent = String(value);
      if (progress < 1) {
        window.requestAnimationFrame(frame);
      }
    }

    window.requestAnimationFrame(frame);
  }

  function activateChart(card) {
    if (!card || card.dataset.active === 'true') return;
    card.dataset.active = 'true';
    card.classList.add('performance-chart-card--active');

    var metric = card.querySelector('[data-chart-metric]');
    if (metric) {
      var target = Number(metric.getAttribute('data-chart-metric'));
      if (!Number.isNaN(target)) {
        if (prefersReducedMotion()) {
          metric.textContent = String(target);
        } else {
          metric.textContent = '0';
          animateMetricValue(metric, target);
        }
      }
    }
  }

  function initChart(root) {
    chartInstance += 1;
    var fillId = 'performance-chart-clicks-fill-' + chartInstance;
    var plot = root.querySelector('[data-performance-chart-plot]');
    var card = root.querySelector('.performance-chart-card');
    renderChart(plot, fillId);

    if (prefersReducedMotion()) {
      activateChart(card);
      return;
    }

    if ('IntersectionObserver' in window && card) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              activateChart(card);
              observer.disconnect();
            }
          });
        },
        { threshold: 0.2 },
      );
      observer.observe(card);
      return;
    }

    activateChart(card);
  }

  function initPerformanceCharts() {
    document.querySelectorAll('[data-performance-chart]').forEach(initChart);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPerformanceCharts);
  } else {
    initPerformanceCharts();
  }
})();
