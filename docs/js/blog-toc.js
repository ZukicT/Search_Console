(function () {
  var HEADING_SELECTOR = '.page-blog-post .blog-article-body > h2.guide-heading';
  var ACTIVE_CLASS = 'is-active';
  var ticking = false;

  function headerOffset() {
    var raw = getComputedStyle(document.documentElement).getPropertyValue('--site-header-offset');
    var parsed = parseFloat(raw);
    if (!isNaN(parsed)) return parsed + 8;
    var header = document.querySelector('.header');
    if (!header) return 96;
    return Math.ceil(header.getBoundingClientRect().height) + 16;
  }

  function headingNodes() {
    return Array.prototype.slice.call(document.querySelectorAll(HEADING_SELECTOR));
  }

  function slugFor(heading, index) {
    var key = heading.getAttribute('data-i18n') || '';
    var slug = key.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    if (!slug) slug = 'section-' + (index + 1);
    return 'toc-' + slug;
  }

  function ensureIds(nodes) {
    nodes.forEach(function (heading, index) {
      heading.id = slugFor(heading, index);
    });
  }

  function fillNav(nav, nodes) {
    var list = nav.querySelector('.blog-toc__list');
    if (!list) return;
    var fragment = document.createDocumentFragment();
    nodes.forEach(function (heading) {
      var item = document.createElement('li');
      var link = document.createElement('a');
      link.className = 'blog-toc__link';
      link.href = '#' + heading.id;
      link.textContent = heading.textContent.replace(/\s+/g, ' ').trim();
      item.appendChild(link);
      fragment.appendChild(item);
    });
    list.replaceChildren(fragment);
    nav.hidden = nodes.length === 0;
  }

  function setActive(id) {
    document.querySelectorAll('.blog-toc__link').forEach(function (link) {
      var active = link.getAttribute('href') === '#' + id;
      link.classList.toggle(ACTIVE_CLASS, active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  function currentHeadingId(nodes) {
    var line = headerOffset();
    var current = nodes[0];
    nodes.forEach(function (heading) {
      if (heading.getBoundingClientRect().top <= line) current = heading;
    });
    return current ? current.id : '';
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      ticking = false;
      var nodes = headingNodes();
      if (!nodes.length) return;
      setActive(currentHeadingId(nodes));
    });
  }

  function scrollOffset() {
    var header = document.querySelector('.header');
    if (!header) return 88;
    return Math.ceil(header.getBoundingClientRect().height) + 8;
  }

  var scrollFrame = 0;

  function cancelSmoothScroll() {
    if (!scrollFrame) return;
    window.cancelAnimationFrame(scrollFrame);
    scrollFrame = 0;
  }

  function scrollToHeading(id) {
    var target = document.getElementById(id);
    if (!target) return;
    var top = Math.max(0, window.scrollY + target.getBoundingClientRect().top - scrollOffset());
    if (history.pushState) {
      history.pushState(null, '', window.location.pathname + window.location.search + '#' + id);
    }
    setActive(id);
    cancelSmoothScroll();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo(0, top);
      return;
    }
    var start = window.scrollY;
    var distance = top - start;
    if (Math.abs(distance) < 2) return;
    var duration = Math.min(700, Math.max(320, Math.abs(distance) * 0.45));
    var startTime = null;
    function step(now) {
      if (startTime === null) startTime = now;
      var progress = Math.min(1, (now - startTime) / duration);
      var eased = 1 - Math.pow(1 - progress, 3);
      window.scrollTo(0, start + distance * eased);
      if (progress < 1) scrollFrame = window.requestAnimationFrame(step);
      else scrollFrame = 0;
    }
    scrollFrame = window.requestAnimationFrame(step);
  }

  function onTocClick(event) {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    var link = event.target.closest ? event.target.closest('.blog-toc__link') : null;
    if (!link) return;
    var href = link.getAttribute('href') || '';
    if (href.charAt(0) !== '#') return;
    var id = href.slice(1);
    if (!document.getElementById(id)) return;
    event.preventDefault();
    scrollToHeading(id);
  }

  function render() {
    var nodes = headingNodes();
    var navs = document.querySelectorAll('[data-blog-toc]');
    if (!navs.length) return;
    ensureIds(nodes);
    Array.prototype.forEach.call(navs, function (nav) {
      fillNav(nav, nodes);
    });
    if (nodes.length) setActive(currentHeadingId(nodes));
  }

  function boot() {
    if (!document.querySelector('[data-blog-toc]')) return;
    render();
    document.addEventListener('click', onTocClick);
    document.addEventListener('locale:applied', render);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('hashchange', onScroll);
    window.addEventListener('popstate', onScroll);
    window.addEventListener('wheel', cancelSmoothScroll, { passive: true });
    window.addEventListener('touchmove', cancelSmoothScroll, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
