(function () {
  var APP_STORE_URL = 'https://apps.apple.com/us/app/search-console/id6758431981';
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function preferredScrollBehavior() {
    return prefersReducedMotion ? 'auto' : 'smooth';
  }

  function initReveal() {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      document.querySelectorAll('[data-reveal]').forEach(function (node) {
        node.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' },
    );

    document.querySelectorAll('[data-reveal]').forEach(function (node) {
      var rect = node.getBoundingClientRect();
      var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top < viewportHeight && rect.bottom > 0) {
        node.classList.add('is-visible');
        return;
      }
      observer.observe(node);
    });
  }

  function initHeaderScroll() {
    var header = document.querySelector('.header');
    if (!header) return;

    function updateHeader() {
      header.classList.toggle('header--scrolled', window.scrollY > 8);
    }

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  function normalizePath(pathname) {
    var path = pathname || '/';
    if (path.endsWith('/')) {
      path = path.slice(0, -1) || '/';
    }
    var segment = path.split('/').pop();
    return segment || 'index.html';
  }

  function isHomePage() {
    var page = normalizePath(window.location.pathname);
    return page === 'index.html' || page === '';
  }

  function getScrollPaddingTop() {
    var header = document.querySelector('.header');
    if (!header) return 88;
    return Math.ceil(header.getBoundingClientRect().height) + 8;
  }

  var scrollNavLockUntil = 0;

  function scrollToSection(target) {
    if (!target) return;
    scrollNavLockUntil = Date.now() + 900;
    var top = window.scrollY + target.getBoundingClientRect().top - getScrollPaddingTop();
    window.scrollTo({
      top: Math.max(0, top),
      behavior: preferredScrollBehavior(),
    });
  }

  function setHomeHash(sectionId) {
    var suffix = sectionId === 'hero' ? '' : '#' + sectionId;
    var nextUrl = window.location.pathname + window.location.search + suffix;
    if (window.location.pathname + window.location.search + window.location.hash === nextUrl) return;
    if (history.replaceState) {
      history.replaceState(null, '', nextUrl);
    } else {
      window.location.hash = suffix || '#hero';
    }
    initNavActiveState();
  }

  function initInPageAnchorNav() {
    if (!isHomePage()) return;

    var sectionNavMap = {
      hero: 'home',
      features: 'features',
      faq: 'faq',
    };

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href || href === '#') return;
      var sectionId = href.slice(1);
      if (!sectionNavMap[sectionId]) return;

      link.addEventListener('click', function (event) {
        var target = document.getElementById(sectionId);
        if (!target) return;
        event.preventDefault();
        scrollToSection(target);
        setHomeHash(sectionId);

        var mobileNav = document.getElementById('mobile-nav');
        if (mobileNav && mobileNav.classList.contains('open')) {
          document.dispatchEvent(new CustomEvent('mobile-menu:request-close'));
        }
      });
    });

    var sections = Object.keys(sectionNavMap)
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);

    if (!sections.length) return;

    var scrollSpyFrame = 0;

    function updateScrollSpy() {
      scrollSpyFrame = 0;
      if (Date.now() < scrollNavLockUntil) return;
      if (window.scrollY < 64) {
        setHomeHash('hero');
        return;
      }

      var paddingTop = getScrollPaddingTop();
      var activeSection = 'hero';
      var bestVisibleArea = -1;

      sections.forEach(function (section) {
        var rect = section.getBoundingClientRect();
        if (rect.bottom <= paddingTop) return;
        if (rect.top >= window.innerHeight * 0.55) return;

        var visibleTop = Math.max(rect.top, paddingTop);
        var visibleBottom = Math.min(rect.bottom, window.innerHeight);
        var visibleArea = visibleBottom - visibleTop;
        if (visibleArea > bestVisibleArea) {
          bestVisibleArea = visibleArea;
          activeSection = section.id;
        }
      });

      setHomeHash(activeSection);
    }

    window.addEventListener('scroll', function () {
      if (scrollSpyFrame) return;
      scrollSpyFrame = window.requestAnimationFrame(updateScrollSpy);
    }, { passive: true });

    window.addEventListener('resize', function () {
      if (scrollSpyFrame) window.cancelAnimationFrame(scrollSpyFrame);
      scrollSpyFrame = window.requestAnimationFrame(updateScrollSpy);
    });

    updateScrollSpy();

    var initialHash = window.location.hash.replace('#', '');
    if (initialHash && sectionNavMap[initialHash]) {
      var initialTarget = document.getElementById(initialHash);
      if (initialTarget) {
        scrollNavLockUntil = Date.now() + 900;
        window.requestAnimationFrame(function () {
          scrollToSection(initialTarget);
        });
      }
    }
  }

  function initNavActiveState() {
    // Works with and without the .html extension, so hosts that serve clean URLs mark the page too.
    var page = (window.location.pathname || '/').replace(/^\//, '').replace(/\.html$/, '').replace(/\/$/, '');
    var hash = window.location.hash;
    var onHome = isHomePage();

    document.querySelectorAll('[data-nav]').forEach(function (link) {
      var key = link.getAttribute('data-nav');
      var isActive = false;

      if (key === 'home' && onHome && (!hash || hash === '#hero')) isActive = true;
      if (key === 'blog' && (page === 'blog' || page.indexOf('blog/') === 0)) isActive = true;
      if (key === 'faq' && (page === 'faq' || (onHome && hash === '#faq'))) isActive = true;
      if (key === 'about' && page === 'about') isActive = true;
      if (key === 'releases' && page === 'releases') isActive = true;
      if (key === 'privacy' && page === 'privacy') isActive = true;
      if (key === 'terms' && page === 'terms') isActive = true;

      link.classList.toggle('is-active', isActive);
      if (isActive) {
        if (key === 'blog' || key === 'faq') {
          link.setAttribute('aria-current', 'true');
        } else {
          link.setAttribute('aria-current', 'page');
        }
      } else {
        link.removeAttribute('aria-current');
      }
    });

    updateNavGlassIndicator();
  }

  var navGlassIndicator = null;

  function ensureNavGlassIndicator() {
    var navLinks = document.querySelector('.nav-links');
    if (!navLinks) return null;

    if (!navGlassIndicator || navGlassIndicator.parentElement !== navLinks) {
      navGlassIndicator = navLinks.querySelector('.nav-glass-indicator');
    }
    if (!navGlassIndicator) {
      navGlassIndicator = document.createElement('span');
      navGlassIndicator.className = 'nav-glass-indicator';
      navGlassIndicator.setAttribute('aria-hidden', 'true');
      navLinks.insertBefore(navGlassIndicator, navLinks.firstChild);
    }
    return navGlassIndicator;
  }

  function updateNavGlassIndicator() {
    var navLinks = document.querySelector('.nav-links');
    var indicator = ensureNavGlassIndicator();
    if (!navLinks || !indicator) return;

    var activeLink = navLinks.querySelector('a.is-active:not(.nav-cta)');
    if (!activeLink) {
      indicator.classList.remove('is-visible');
      return;
    }

    var navRect = navLinks.getBoundingClientRect();
    var linkRect = activeLink.getBoundingClientRect();
    indicator.style.width = linkRect.width + 'px';
    indicator.style.height = linkRect.height + 'px';
    indicator.style.transform = 'translate('
      + (linkRect.left - navRect.left) + 'px, '
      + (linkRect.top - navRect.top) + 'px)';
    indicator.classList.add('is-visible');
  }

  function initMobileMenu() {
    var MOBILE_NAV_MAX_WIDTH = 900;
    var header = document.querySelector('.header');
    var mobileMenuBtn = document.getElementById('mobile-menu-btn');
    var mobileMenuLayer = document.getElementById('mobile-menu-layer');
    var mobileNav = document.getElementById('mobile-nav');
    var mobileNavBackdrop = document.getElementById('mobile-nav-backdrop');
    var menuIcon = document.getElementById('menu-icon');
    var mainContent = document.getElementById('main');
    if (!mobileMenuBtn || !mobileNav) return;

    if (!mobileMenuLayer) {
      mobileMenuLayer = document.createElement('div');
      mobileMenuLayer.id = 'mobile-menu-layer';
      mobileMenuLayer.className = 'mobile-menu-layer';
      mobileMenuLayer.setAttribute('aria-hidden', 'true');
      mobileMenuLayer.setAttribute('inert', '');
      document.body.appendChild(mobileMenuLayer);
    }

    // Closed means inert, however the layer got into the page.
    if (!mobileMenuLayer.classList.contains('is-open')) mobileMenuLayer.setAttribute('inert', '');

    if (mobileNavBackdrop && mobileNavBackdrop.parentElement !== mobileMenuLayer) {
      mobileMenuLayer.appendChild(mobileNavBackdrop);
    }
    if (mobileNav.parentElement !== mobileMenuLayer) {
      mobileMenuLayer.appendChild(mobileNav);
    }

    var menuScrollY = 0;
    var menuIsOpen = false;

    function syncMobileNavTop() {
      if (!header) return;
      var headerHeight = Math.ceil(header.getBoundingClientRect().height);
      document.documentElement.style.setProperty('--mobile-nav-top', headerHeight + 'px');
    }

    function updateMenuButtonAria(isOpen) {
      var openLabel = mobileMenuBtn.getAttribute('data-i18n-aria-label-expand')
        || mobileMenuBtn.getAttribute('data-aria-label-expand');
      var closeLabel = mobileMenuBtn.getAttribute('data-i18n-aria-label-collapse')
        || mobileMenuBtn.getAttribute('data-aria-label-collapse');
      if (openLabel && closeLabel) {
        mobileMenuBtn.setAttribute('aria-label', isOpen ? closeLabel : openLabel);
        return;
      }
      mobileMenuBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    }

    function lockBodyScroll() {
      menuScrollY = window.scrollY || window.pageYOffset || 0;
      document.documentElement.classList.add('menu-open');
      document.body.classList.add('menu-open');
      document.body.style.position = 'fixed';
      document.body.style.top = '-' + menuScrollY + 'px';
      document.body.style.left = '0';
      document.body.style.right = '0';
    }

    function unlockBodyScroll() {
      document.documentElement.classList.remove('menu-open');
      document.body.classList.remove('menu-open');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      window.scrollTo(0, menuScrollY);
    }

    function setMenuOpen(isOpen) {
      if (menuIsOpen === isOpen) return;
      syncMobileNavTop();
      menuIsOpen = isOpen;

      if (isOpen) {
        lockBodyScroll();
      } else {
        unlockBodyScroll();
      }

      mobileMenuLayer.classList.toggle('is-open', isOpen);
      mobileMenuLayer.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      if (isOpen) mobileMenuLayer.removeAttribute('inert'); else mobileMenuLayer.setAttribute('inert', '');
      mobileNav.classList.toggle('open', isOpen);
      mobileMenuBtn.classList.toggle('is-open', isOpen);
      mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      mobileNav.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      if (isOpen) mobileNav.removeAttribute('inert'); else mobileNav.setAttribute('inert', '');
      if (header) {
        header.classList.toggle('header--menu-open', isOpen);
      }
      if (mobileNavBackdrop) {
        mobileNavBackdrop.classList.toggle('is-visible', isOpen);
        mobileNavBackdrop.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      }
      if (menuIcon) {
        menuIcon.innerHTML = isOpen
          ? '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'
          : '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>';
      }
      updateMenuButtonAria(isOpen);

      if (mainContent && 'inert' in mainContent) {
        mainContent.inert = isOpen;
      }

      if (!isOpen) {
        mobileMenuBtn.focus();
      }
    }

    mobileMenuBtn.addEventListener('click', function (event) {
      event.stopPropagation();
      setMenuOpen(!menuIsOpen);
    });

    if (mobileNavBackdrop) {
      mobileNavBackdrop.addEventListener('click', function () {
        setMenuOpen(false);
      });
    }

    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setMenuOpen(false);
      });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape' || !menuIsOpen) return;
      event.preventDefault();
      setMenuOpen(false);
    });

    document.addEventListener('mobile-menu:request-close', function () {
      setMenuOpen(false);
    });

    document.addEventListener('locale:applied', function () {
      updateMenuButtonAria(menuIsOpen);
    });

    function handleViewportChange() {
      syncMobileNavTop();
      if (window.innerWidth > MOBILE_NAV_MAX_WIDTH && menuIsOpen) {
        setMenuOpen(false);
      }
    }

    syncMobileNavTop();
    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('orientationchange', handleViewportChange);
    window.addEventListener('load', syncMobileNavTop);
    window.addEventListener('scroll', syncMobileNavTop, { passive: true });
  }

  function openLightbox(src, alt) {
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightbox-img');
    if (!lightbox || !lightboxImg || !src) return;

    lightboxImg.hidden = false;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    if (prefersReducedMotion) {
      lightbox.classList.add('show');
      return;
    }

    lightbox.classList.remove('show');
    window.requestAnimationFrame(function () {
      lightbox.classList.add('show');
    });
  }

  function initLightbox() {
    var lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    function closeLightbox() {
      lightbox.classList.remove('show');
      var lightboxImg = document.getElementById('lightbox-img');
      if (lightboxImg) lightboxImg.hidden = true;
    }

    lightbox.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && lightbox.classList.contains('show')) {
        closeLightbox();
      }
    });
  }

  function initScreenshotRail() {
    var rail = document.getElementById('screenshot-rail');
    if (!rail) return;

    var prevBtn = document.getElementById('screenshot-rail-prev');
    var nextBtn = document.getElementById('screenshot-rail-next');
    var caption = document.getElementById('screenshot-caption');
    var dotsRoot = document.getElementById('screenshot-dots');
    var slides = Array.prototype.slice.call(rail.querySelectorAll('[data-screenshot-slide]'));
    var activeIndex = 0;
    var scrollFrame = 0;

    if (!slides.length) return;

    function slideLabel(slide) {
      var img = slide.querySelector('img');
      return (img && img.alt) || slide.getAttribute('aria-label') || '';
    }

    function scrollBehavior() {
      return preferredScrollBehavior();
    }

    function setActiveIndex(index) {
      if (index < 0 || index >= slides.length) return;
      activeIndex = index;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
        if (slideIndex === index) {
          slide.setAttribute('aria-current', 'true');
        } else {
          slide.removeAttribute('aria-current');
        }
      });
      if (caption) caption.textContent = slideLabel(slides[index]);
      if (dotsRoot) {
        dotsRoot.querySelectorAll('.screenshot-showcase__dot').forEach(function (dot, dotIndex) {
          var isActive = dotIndex === index;
          dot.classList.toggle('is-active', isActive);
          dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
      }
    }

    function nearestSlideIndex() {
      var railRect = rail.getBoundingClientRect();
      var center = railRect.left + railRect.width / 2;
      var closestIndex = activeIndex;
      var closestDistance = Infinity;

      slides.forEach(function (slide, index) {
        var rect = slide.getBoundingClientRect();
        var slideCenter = rect.left + rect.width / 2;
        var distance = Math.abs(center - slideCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      return closestIndex;
    }

    function syncActiveSlide() {
      setActiveIndex(nearestSlideIndex());
    }

    function scrollToIndex(index) {
      var target = slides[index];
      if (!target) return;
      target.scrollIntoView({ behavior: scrollBehavior(), inline: 'center', block: 'nearest' });
      setActiveIndex(index);
    }

    function stepSlide(direction) {
      var nextIndex = activeIndex + direction;
      if (nextIndex < 0) nextIndex = slides.length - 1;
      if (nextIndex >= slides.length) nextIndex = 0;
      scrollToIndex(nextIndex);
    }

    if (dotsRoot) {
      dotsRoot.replaceChildren();
      slides.forEach(function (slide, index) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'screenshot-showcase__dot';
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-label', slideLabel(slide));
        dot.addEventListener('click', function () {
          scrollToIndex(index);
        });
        dotsRoot.appendChild(dot);
      });
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { stepSlide(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { stepSlide(1); });

    slides.forEach(function (slide) {
      slide.addEventListener('click', function () {
        var img = slide.querySelector('img');
        if (!img) return;
        openLightbox(img.src, img.alt || '');
      });
    });

    rail.addEventListener('scroll', function () {
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
      scrollFrame = window.requestAnimationFrame(syncActiveSlide);
    }, { passive: true });

    rail.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        stepSlide(1);
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        stepSlide(-1);
      }
    });

    var lastRailWidth = rail.clientWidth;

    window.addEventListener('resize', function () {
      var nextWidth = rail.clientWidth;
      if (Math.abs(nextWidth - lastRailWidth) < 2) return;
      lastRailWidth = nextWidth;
      scrollToIndex(activeIndex);
    });

    setActiveIndex(0);
    if (rail.scrollWidth <= rail.clientWidth + 2) {
      scrollToIndex(0);
    }

    document.addEventListener('locale:applied', function () {
      setActiveIndex(activeIndex);
    });
  }

  function initMobileDownloadBar() {
    var bar = document.getElementById('mobile-download-bar');
    var hero = document.querySelector('.home-hero, .hero-chapter');
    if (!bar || !hero) return;

    // While the bar is off screen it is inert: out of the tab order and out of the accessibility tree.
    // aria-hidden alone left its link focusable.
    function setShown(isShown) {
      bar.classList.toggle('mobile-download-bar--visible', isShown);
      bar.removeAttribute('aria-hidden');
      if (isShown) bar.removeAttribute('inert'); else bar.setAttribute('inert', '');
    }

    if (!('IntersectionObserver' in window)) {
      setShown(true);
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        var heroVisible = entries.some(function (entry) { return entry.isIntersecting; });
        var showBar = !heroVisible;
        setShown(showBar);
      },
      { threshold: 0.05 },
    );

    observer.observe(hero);
  }

  function initFaqAccordion() {
    var questions = document.querySelectorAll('.faq-question');
    if (!questions.length) return;

    questions.forEach(function (btn, index) {
      var item = btn.closest('.faq-item');
      var answer = item ? item.querySelector('.faq-answer') : null;
      var answerId = 'faq-answer-' + index;

      if (answer) {
        answer.id = answerId;
        btn.setAttribute('aria-controls', answerId);
      }

      btn.setAttribute('aria-expanded', 'false');
      btn.addEventListener('click', function () {
        var item = btn.closest('.faq-item');
        if (!item) return;
        var wasOpen = item.classList.contains('open');

        document.querySelectorAll('.faq-item').forEach(function (faq) {
          faq.classList.remove('open');
          var question = faq.querySelector('.faq-question');
          if (question) question.setAttribute('aria-expanded', 'false');
        });

        if (!wasOpen) {
          item.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  function initHeroIntro() {
    var content = document.querySelector('[data-hero-content]');
    if (!content) return;

    if (prefersReducedMotion) {
      content.classList.add('hero-chapter__content--ready');
      return;
    }

    content.classList.add('hero-chapter__content--animating');
    window.requestAnimationFrame(function () {
      content.classList.add('hero-chapter__content--ready');
    });
  }

  function initHeroScrollCue() {
    var cue = document.querySelector('[data-hero-scroll-cue]');
    if (!cue) return;

    function updateCue() {
      cue.classList.toggle('scroll-cue--hidden', window.scrollY > 56);
    }

    updateCue();
    window.addEventListener('scroll', updateCue, { passive: true });
  }

  function initReleaseBanner() {
    var banner = document.getElementById('release-notice-banner');
    if (!banner) return;
    var expires = banner.getAttribute('data-expires');
    if (!expires) return;
    if (new Date() > new Date(expires)) {
      banner.hidden = true;
    }
  }

  function initBotCoinEasterEgg() {
    var trigger = document.querySelector('[data-bot-coin]');
    if (!trigger) return;

    var bounce = trigger.querySelector('.hero-app-mark__bounce');
    if (!bounce) return;

    function playCoinSpin() {
      if (trigger.classList.contains('hero-app-mark--spinning')) return;

      trigger.classList.add('hero-app-mark--spinning');

      function finishSpin(event) {
        if (event.animationName !== 'mario-coin-bounce' && event.animationName !== 'mario-coin-bounce-reduced') return;
        trigger.classList.remove('hero-app-mark--spinning');
        bounce.removeEventListener('animationend', finishSpin);
      }

      bounce.addEventListener('animationend', finishSpin);
    }

    trigger.addEventListener('click', playCoinSpin);
  }

  function initScrollProgress() {
    var bar = document.getElementById('scroll-progress');
    if (!bar || prefersReducedMotion) return;

    function updateProgress() {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? scrollTop / docHeight : 0;
      bar.style.transform = 'scaleX(' + Math.min(1, Math.max(0, progress)) + ')';
    }

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
  }

  function initReleaseTimeline() {
    document.querySelectorAll('.release-item--collapsible details.release-card').forEach(function (details) {
      var summary = details.querySelector('summary.release-header');
      if (!summary) return;

      var versionLabel = summary.querySelector('.release-version');
      var versionName = versionLabel ? versionLabel.textContent.trim() : 'Release notes';
      summary.setAttribute('aria-label', versionName);
    });
  }

  function initServiceWorker() {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.register('/sw.js').then(function (registration) {
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }

      registration.addEventListener('updatefound', function () {
        var installing = registration.installing;
        if (!installing) return;

        installing.addEventListener('statechange', function () {
          if (installing.state === 'installed' && navigator.serviceWorker.controller) {
            installing.postMessage({ type: 'SKIP_WAITING' });
          }
        });
      });
    }).catch(function () {});
  }

  function runWhenIdle(fn, timeout) {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(fn, { timeout: timeout || 2000 });
      return;
    }
    setTimeout(fn, 1);
  }

  initHeaderScroll();
  initHeroIntro();
  initReveal();
  initNavActiveState();
  initInPageAnchorNav();
  initMobileMenu();
  initMobileDownloadBar();
  initFaqAccordion();
  initReleaseBanner();
  initBotCoinEasterEgg();
  initHeroScrollCue();

  runWhenIdle(function () {
    initLightbox();
    initScreenshotRail();
    initReleaseTimeline();
    initScrollProgress();
    initServiceWorker();
  }, 2500);

  window.addEventListener('hashchange', initNavActiveState);
  window.addEventListener('resize', updateNavGlassIndicator);
  window.addEventListener('load', updateNavGlassIndicator);
})();

/* Blink, live: wherever a [data-blink] figure appears he watches the pointer, blinks on his own,
   and hops with a happy face when clicked. */
(function () {
  var figures = Array.prototype.slice.call(document.querySelectorAll('[data-blink]'));
  if (!figures.length) return;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var touchOnly = window.matchMedia && window.matchMedia('(hover: none)').matches;

  figures.forEach(function (svg) {
    var gazes = Array.prototype.slice.call(svg.querySelectorAll('[data-blink-gaze]'));
    var lids = Array.prototype.slice.call(svg.querySelectorAll('[data-blink-lid]'));
    var opens = Array.prototype.slice.call(svg.querySelectorAll('[data-blink-open]'));
    var smiles = Array.prototype.slice.call(svg.querySelectorAll('[data-blink-smile]'));
    var button = svg.closest('[data-blink-button]');
    var bubble = button && button.parentNode ? button.parentNode.querySelector('[data-blink-bubble]') : null;

    // Gaze is in the eye's own units: x from -1 (left) to 1 (right), y from -1 (up) to 1 (down).
    var target = { x: 0.45, y: 0.35 };
    var current = { x: 0.45, y: 0.35 };
    var frame = null;

    function applyGaze() {
      gazes.forEach(function (gaze) {
        var scale = parseFloat(gaze.getAttribute('data-scale')) || 1;
        gaze.setAttribute('transform', 'translate(' + (current.x * 78 * scale).toFixed(1) + ' ' + (current.y * 130 * scale).toFixed(1) + ')');
      });
    }

    function step() {
      current.x += (target.x - current.x) * 0.16;
      current.y += (target.y - current.y) * 0.16;
      applyGaze();
      frame = (Math.abs(target.x - current.x) > 0.004 || Math.abs(target.y - current.y) > 0.004) ? window.requestAnimationFrame(step) : null;
    }

    function lookAt(clientX, clientY) {
      var rect = svg.getBoundingClientRect();
      // Only track while he is on screen; the eyes sit right of centre and low in the body.
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      var dx = (clientX - (rect.left + rect.width * 0.66)) / 320;
      var dy = (clientY - (rect.top + rect.height * 0.63)) / 320;
      var length = Math.sqrt(dx * dx + dy * dy);
      if (length > 1) { dx /= length; dy /= length; }
      target.x = dx;
      target.y = dy;
      if (!frame) frame = window.requestAnimationFrame(step);
    }

    function setLids(scale) {
      lids.forEach(function (lid) { lid.setAttribute('transform', 'scale(1 ' + scale + ')'); });
    }

    function blinkOnce() {
      var start = null;
      function tick(now) {
        if (start === null) start = now;
        var k = Math.min((now - start) / 150, 1);
        setLids(k < 0.5 ? 1 - 1.88 * k : 0.06 + 1.88 * (k - 0.5));
        if (k < 1) window.requestAnimationFrame(tick); else setLids(1);
      }
      window.requestAnimationFrame(tick);
    }

    function scheduleBlink() {
      window.setTimeout(function () {
        var rect = svg.getBoundingClientRect();
        if (!document.hidden && rect.bottom > 0 && rect.top < window.innerHeight) blinkOnce();
        scheduleBlink();
      }, 2600 + Math.random() * 3200);
    }

    function setHappy(isHappy) {
      opens.forEach(function (node) { node.style.display = isHappy ? 'none' : ''; });
      smiles.forEach(function (node) { node.style.display = isHappy ? '' : 'none'; });
    }

    applyGaze();
    if (reduceMotion) return;

    window.addEventListener('pointermove', function (event) { lookAt(event.clientX, event.clientY); }, { passive: true });
    if (touchOnly) {
      // With no pointer he reads down the page as it scrolls.
      window.addEventListener('scroll', function () {
        target.x = -0.5;
        target.y = Math.min(0.8, 0.3 + window.scrollY / 600);
        if (!frame) frame = window.requestAnimationFrame(step);
      }, { passive: true });
    }
    scheduleBlink();

    if (button) {
      button.addEventListener('click', function () {
        if (svg.classList.contains('is-hopping')) return;
        svg.classList.add('is-hopping');
        setHappy(true);
        if (bubble) bubble.style.visibility = 'hidden';
        window.setTimeout(function () {
          svg.classList.remove('is-hopping');
          setHappy(false);
          if (bubble) bubble.style.visibility = '';
        }, 900);
      });
    }
  });
})();

/* The film: a poster until asked for, then the video plays in place. It is served from this site,
   so there is no third-party player, no channel branding, and full screen works everywhere. */
(function () {
  var play = document.querySelector('[data-film]');
  if (!play) return;
  play.addEventListener('click', function () {
    var video = document.createElement('video');
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.preload = 'auto';
    video.poster = play.querySelector('img') ? play.querySelector('img').src : '';
    video.setAttribute('aria-label', play.getAttribute('aria-label') || 'Film');
    // Set straight on the element: iOS Safari starts loading sooner than with a <source> child.
    video.src = play.getAttribute('data-film');
    var captions = play.getAttribute('data-film-captions');
    if (captions) {
      var track = document.createElement('track');
      track.kind = 'captions';
      track.srclang = 'en';
      track.label = 'English';
      track.src = captions;
      video.appendChild(track);
    }
    var filmUrl = video.src;
    var frame = play.parentNode;
    var triedBlob = false;

    function begin() {
      var started = video.play();
      if (started && started.catch) started.catch(function () {});
    }

    function report(detail) {
      var note = frame.querySelector('.film-frame__note');
      if (!note) {
        note = document.createElement('p');
        note.className = 'film-frame__note';
        frame.appendChild(note);
      }
      note.textContent = '';
      var link = document.createElement('a');
      link.href = filmUrl;
      link.textContent = 'Open the film';
      note.appendChild(document.createTextNode('The film could not play here. '));
      note.appendChild(link);
      note.appendChild(document.createTextNode(' (' + detail + ')'));
    }

    // Some phones refuse the film through the system media loader. When that happens, fetch the
    // whole file (it is small) and play it from memory instead.
    function playFromMemory(reason) {
      if (triedBlob) return report(reason);
      triedBlob = true;
      window.fetch(filmUrl, { cache: 'reload' }).then(function (response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.blob();
      }).then(function (blob) {
        var typed = blob.type === 'video/mp4' ? blob : blob.slice(0, blob.size, 'video/mp4');
        video.src = URL.createObjectURL(typed);
        video.load();
        begin();
      }).catch(function (error) {
        report(reason + '; ' + (error && error.message ? error.message : 'fetch failed'));
      });
    }

    video.addEventListener('error', function () {
      var code = video.error ? video.error.code : 0;
      var message = video.error && video.error.message ? video.error.message : '';
      playFromMemory('error ' + code + (message ? ' ' + message : ''));
    });
    // Stuck with nothing loaded after a few seconds counts as a failure too.
    window.setTimeout(function () {
      if (video.readyState === 0 && !video.error) playFromMemory('no data after 6 s');
    }, 6000);

    frame.replaceChild(video, play);
    video.load();
    begin();
    video.focus({ preventScroll: true });
  });
})();

/* Sound: the same short synthesised tones the app uses. Nothing plays before the visitor's first
   click or key press, and the toggle in the hero turns it off for good (remembered per browser). */
window.SiteSound = (function () {
  var STORAGE_KEY = 'siteSound';
  var context = null;
  var enabled = true;
  try { enabled = window.localStorage.getItem(STORAGE_KEY) !== 'off'; } catch (e) {}

  // [from Hz, to Hz, start s, duration s, second-harmonic level]
  var SOUNDS = {
    select: [[1318.51, 1318.51, 0, 0.05, 0]],
    tick: [[1568, 1568, 0, 0.045, 0]],
    advance: [[880, 880, 0, 0.07, 0], [1174.66, 1174.66, 0.045, 0.09, 0]],
    back: [[880, 880, 0, 0.07, 0], [659.25, 659.25, 0.045, 0.09, 0]],
    pop: [[520, 1040, 0, 0.09, 0]],
    hop: [[330, 660, 0, 0.16, 0.2], [660, 440, 0.34, 0.12, 0.2]],
    speak: [[520, 560, 0, 0.07, 0.35], [720, 780, 0.1, 0.06, 0.35], [640, 600, 0.19, 0.07, 0.35]]
  };
  var LEVELS = { select: 1, tick: 0.65, advance: 1, back: 1, pop: 0.7, hop: 0.55, speak: 0.6 };

  function schedule(ctx, destination, name, startAt) {
    var partials = SOUNDS[name];
    if (!partials) return;
    var level = 0.09 * (LEVELS[name] || 1);
    partials.forEach(function (partial) {
      var begin = startAt + partial[2];
      var end = begin + partial[3];
      var gain = ctx.createGain();
      gain.gain.setValueAtTime(0, begin);
      gain.gain.linearRampToValueAtTime(level, begin + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, end);
      gain.connect(destination);
      [[1, 1], [2, partial[4]]].forEach(function (voice) {
        if (!voice[1]) return;
        var osc = ctx.createOscillator();
        var voiceGain = ctx.createGain();
        voiceGain.gain.value = voice[1];
        osc.type = 'sine';
        osc.frequency.setValueAtTime(partial[0] * voice[0], begin);
        osc.frequency.linearRampToValueAtTime(partial[1] * voice[0], end);
        osc.connect(voiceGain);
        voiceGain.connect(gain);
        osc.start(begin);
        osc.stop(end + 0.02);
      });
    });
  }

  function unlock() {
    if (context || !enabled) return;
    var Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return;
    try { context = new Ctor(); } catch (e) { context = null; }
  }

  function play(name) {
    if (!enabled) return;
    unlock();
    if (!context) return;
    // iOS hands back a suspended context: wait for it to wake, or the first sound is lost.
    if (context.state !== 'running' && context.resume) {
      var woke = context.resume();
      if (woke && woke.then) {
        woke.then(function () { schedule(context, context.destination, name, context.currentTime + 0.005); }).catch(function () {});
        return;
      }
    }
    schedule(context, context.destination, name, context.currentTime + 0.005);
  }

  function setEnabled(value) {
    enabled = value;
    try { window.localStorage.setItem(STORAGE_KEY, value ? 'on' : 'off'); } catch (e) {}
    document.querySelectorAll('[data-sound-toggle]').forEach(function (toggle) {
      toggle.setAttribute('aria-pressed', value ? 'true' : 'false');
      var on = toggle.querySelector('[data-sound-on]');
      var off = toggle.querySelector('[data-sound-off]');
      if (on) on.hidden = !value;
      if (off) off.hidden = value;
    });
  }

  document.addEventListener('pointerdown', unlock, { passive: true });
  document.addEventListener('keydown', unlock);
  document.addEventListener('DOMContentLoaded', function () { setEnabled(enabled); });
  if (document.readyState !== 'loading') setEnabled(enabled);

  document.addEventListener('click', function (event) {
    var target = event.target.closest ? event.target : null;
    if (!target) return;
    var toggle = target.closest('[data-sound-toggle]');
    if (toggle) {
      var next = !enabled;
      setEnabled(next);
      if (next) play('select');
      return;
    }
    if (target.closest('[data-blink-button]')) return play('hop');
    // No sound here: on iPhone a tone starting with the film competes with the film's own audio.
    if (target.closest('[data-film]')) return;
    if (target.closest('.carbon-btn--primary, .nav-cta, .footer-app-cta')) return play('advance');
    if (target.closest('.faq-question, .screenshot-showcase__nav, .carbon-btn--outline, .mobile-menu-btn')) return play('tick');
    // The live Overview plays its own sounds, and the film player is the browser's.
    if (target.closest('[data-overview-demo], video')) return;
    if (target.closest('.privacy-card__allow, .privacy-card__decline')) return play('select');
    if (target.closest('.privacy-card__close, [data-back], .back-link')) return play('back');
    // Everything else that can be pressed: links, buttons, tabs, filters and disclosure rows.
    if (target.closest('a[href], button, summary, [role="tab"], [role="button"]')) return play('tick');
  }, true); // capture: the menu button stops its click from bubbling, which used to silence it

  document.addEventListener('change', function (event) {
    var target = event.target;
    if (target && target.matches && target.matches('select, input[type="checkbox"], input[type="radio"]')) play('select');
  });

  return {
    play: play,
    isEnabled: function () { return enabled; },
    // For checks: renders a sound offline and reports its length and peak level.
    measure: function (name) {
      var Offline = window.OfflineAudioContext || window.webkitOfflineAudioContext;
      if (!Offline) return Promise.resolve(null);
      var offline = new Offline(1, 44100, 44100);
      schedule(offline, offline.destination, name, 0.01);
      return offline.startRendering().then(function (buffer) {
        var data = buffer.getChannelData(0);
        var peak = 0;
        var last = 0;
        for (var i = 0; i < data.length; i += 1) {
          var value = Math.abs(data[i]);
          if (value > peak) peak = value;
          if (value > 0.001) last = i;
        }
        return { name: name, peak: Math.round(peak * 1000) / 1000, seconds: Math.round(last / 441) / 100 };
      });
    }
  };
})();

/* The Overview, live: pick a figure to change the chart, drag along it to read a day. Same as the app. */
(function () {
  var root = document.querySelector('[data-overview-demo]');
  if (!root) return;

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clicks = [150, 70, 75, 120, 110, 170, 130, 190, 185, 60, 70, 85, 100, 82, 115, 68, 105, 66, 108, 113, 96, 80, 90, 66, 88, 124, 96, 131];
  var impressions = clicks.map(function (value, i) { return Math.round(value * (10.2 + 2.1 * Math.sin(i * 0.9))); });
  var series = {
    clicks: { values: clicks, format: function (v) { return String(Math.round(v)); } },
    impressions: { values: impressions, format: function (v) { return v >= 1000 ? (v / 1000).toFixed(1) + 'K' : String(Math.round(v)); } },
    ctr: { values: clicks.map(function (value, i) { return 7.4 + (clicks[(i * 5 + 3) % clicks.length] % 41) / 9 + (value - 105) / 90; }), format: function (v) { return v.toFixed(1) + '%'; } },
    position: { values: clicks.map(function (value, i) { return 13.2 + (clicks[(i * 11 + 7) % clicks.length] - 105) / 38 - (value - 105) / 70; }), format: function (v) { return v.toFixed(1); } }
  };

  var plot = root.querySelector('[data-overview-plot]');
  var line = root.querySelector('[data-line]');
  var area = root.querySelector('[data-area]');
  var cursor = root.querySelector('[data-cursor]');
  var marker = root.querySelector('[data-marker]');
  var callout = root.querySelector('[data-callout]');
  var axisMax = root.querySelector('[data-axis="max"]');
  var axisMid = root.querySelector('[data-axis="mid"]');
  var tabs = Array.prototype.slice.call(root.querySelectorAll('[data-metric]'));
  var W = 1000;
  var H = 300;
  var current = 'clicks';
  var points = [];
  var selectedIndex = -1;
  var lastTick = 0;
  var clearTimer = null;

  function niceCeiling(value) {
    var magnitude = Math.pow(10, Math.floor(Math.log(value) / Math.LN10));
    var steps = [1, 2, 2.5, 5, 10];
    for (var i = 0; i < steps.length; i += 1) {
      if (value <= steps[i] * magnitude) return steps[i] * magnitude;
    }
    return 10 * magnitude;
  }

  function draw(animate) {
    var data = series[current];
    var top = niceCeiling(Math.max.apply(null, data.values) * 1.05);
    points = data.values.map(function (value, i) {
      return { x: (i / (data.values.length - 1)) * W, y: H - (value / top) * (H - 12), value: value };
    });
    var path = points.map(function (p, i) { return (i ? 'L' : 'M') + p.x.toFixed(1) + ' ' + p.y.toFixed(1); }).join(' ');
    line.setAttribute('d', path);
    area.setAttribute('d', path + ' L' + W + ' ' + H + ' L0 ' + H + ' Z');
    axisMax.textContent = data.format(top);
    axisMid.textContent = data.format(top / 2);
    clearSelection();
    if (animate && !reduceMotion) {
      root.classList.remove('is-drawn');
      // Force a style flush so the draw restarts from zero.
      void line.getBoundingClientRect();
      root.classList.add('is-drawn');
    } else {
      root.classList.add('is-drawn');
    }
  }

  function clearSelection() {
    selectedIndex = -1;
    root.classList.remove('is-scrubbing');
  }

  function select(index) {
    if (index === selectedIndex) return;
    selectedIndex = index;
    var p = points[index];
    var rect = plot.getBoundingClientRect();
    var svgRect = plot.querySelector('svg').getBoundingClientRect();
    var left = svgRect.left - rect.left + (p.x / W) * svgRect.width;
    var topPx = svgRect.top - rect.top + (p.y / H) * svgRect.height;
    cursor.setAttribute('x1', p.x);
    cursor.setAttribute('x2', p.x);
    marker.style.left = left + 'px';
    marker.style.top = topPx + 'px';
    callout.textContent = series[current].format(p.value);
    callout.style.left = Math.min(Math.max(left, 28), rect.width - 28) + 'px';
    callout.style.top = Math.max(topPx - 30, 2) + 'px';
    root.classList.add('is-scrubbing');
    var now = Date.now();
    if (now - lastTick > 70 && window.SiteSound) {
      lastTick = now;
      window.SiteSound.play('tick');
    }
  }

  function scrub(event) {
    var svgRect = plot.querySelector('svg').getBoundingClientRect();
    var ratio = Math.min(Math.max((event.clientX - svgRect.left) / svgRect.width, 0), 1);
    select(Math.round(ratio * (points.length - 1)));
    window.clearTimeout(clearTimer);
  }

  function scheduleClear() {
    window.clearTimeout(clearTimer);
    clearTimer = window.setTimeout(clearSelection, 2500);
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      if (tab.getAttribute('data-metric') === current) return;
      current = tab.getAttribute('data-metric');
      tabs.forEach(function (other) { other.setAttribute('aria-selected', other === tab ? 'true' : 'false'); });
      if (window.SiteSound) window.SiteSound.play('select');
      draw(true);
    });
  });

  plot.addEventListener('pointermove', function (event) {
    if (event.pointerType === 'mouse' || event.buttons || event.pressure > 0) scrub(event);
  });
  plot.addEventListener('pointerdown', scrub);
  plot.addEventListener('pointerleave', scheduleClear);
  plot.addEventListener('pointerup', scheduleClear);

  draw(false);
  root.classList.remove('is-drawn');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    root.classList.add('is-drawn');
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          root.classList.add('is-drawn');
          observer.disconnect();
        }
      });
    }, { threshold: 0.35 });
    observer.observe(root);
  }
})();

/* Measurement: one event per App Store click, with where on the page it happened.
   An outbound click is not an install; pair it with App Store Connect to see downloads. */
(function () {
  function locationOf(link) {
    if (link.closest('.mobile-download-bar, [data-mobile-download-bar]')) return 'mobile_bar';
    if (link.closest('header.header')) return 'header';
    if (link.closest('.mobile-nav')) return 'mobile_menu';
    if (link.closest('footer.footer, .footer')) return 'footer';
    var section = link.closest('section[id]');
    if (section) return section.id;
    if (link.closest('.blog-app-promo')) return 'sidebar';
    if (link.closest('.guide-cta')) return 'guide_cta';
    if (link.closest('.release-card')) return 'release_card';
    return 'page';
  }

  document.addEventListener('click', function (event) {
    var link = event.target.closest ? event.target.closest('a[href*="apps.apple.com"]') : null;
    if (!link || typeof window.gtag !== 'function') return;
    window.gtag('event', 'app_store_click', {
      page_path: window.location.pathname,
      cta_location: locationOf(link),
      transport_type: 'beacon'
    });
  }, true);
})();

/* Privacy: a button that is always in the bottom corner, opening a card where analytics can be
   switched on or off. The choice is remembered in this browser and applied straight away. */
(function () {
  var state = window.SitePrivacy;
  if (!state) return;

  function el(tag, className, key, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (key) node.setAttribute('data-i18n', key);
    if (text) node.textContent = text;
    return node;
  }

  var allowed = state.allowed;
  var wrap = el('div', 'privacy-control');
  var button = el('button', 'privacy-control__button');
  button.type = 'button';
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', 'privacy-card');
  button.appendChild(el('span', 'privacy-control__dot'));
  button.appendChild(el('span', '', 'consent.button', 'Privacy'));

  var card = el('div', 'privacy-card');
  card.id = 'privacy-card';
  card.setAttribute('role', 'dialog');
  card.setAttribute('aria-labelledby', 'privacy-card-title');
  card.hidden = true;

  var title = el('h2', 'privacy-card__title', 'consent.title', 'Privacy settings');
  title.id = 'privacy-card-title';
  var close = el('button', 'privacy-card__close');
  close.type = 'button';
  close.setAttribute('data-i18n-aria-label', 'consent.close');
  close.setAttribute('aria-label', 'Close');
  close.textContent = '×';
  var head = el('div', 'privacy-card__head');
  head.appendChild(title);
  head.appendChild(close);

  var row = el('div', 'privacy-card__row');
  row.appendChild(el('span', 'privacy-card__label', 'consent.analytics', 'Analytics'));
  var status = el('span', 'privacy-card__status');
  var statusOn = el('span', '', 'consent.on', 'On');
  var statusOff = el('span', '', 'consent.off', 'Off');
  status.appendChild(statusOn);
  status.appendChild(statusOff);
  row.appendChild(status);

  var actions = el('div', 'privacy-card__actions');
  var allow = el('button', 'privacy-card__allow', 'consent.allow', 'Allow analytics');
  allow.type = 'button';
  var decline = el('button', 'privacy-card__decline', 'consent.decline', 'Turn off');
  decline.type = 'button';
  actions.appendChild(allow);
  actions.appendChild(decline);

  var policy = el('a', 'privacy-card__link', 'consent.policy', 'Privacy policy');
  var inSubfolder = /\/(guides|blog)\//.test(window.location.pathname);
  policy.href = (inSubfolder ? '../' : '') + 'privacy.html';

  card.appendChild(head);
  card.appendChild(el('p', 'privacy-card__body', 'consent.body', 'This site can use Google Analytics to count visits and App Store clicks. It is your choice, and you can change it here at any time.'));
  card.appendChild(row);
  card.appendChild(actions);
  card.appendChild(el('p', 'privacy-card__note', 'consent.necessary', 'Your language and sound choices are saved in this browser only. They are not sent anywhere.'));
  card.appendChild(policy);
  wrap.appendChild(card);
  wrap.appendChild(button);
  document.body.appendChild(wrap);

  function render() {
    wrap.classList.toggle('is-on', allowed);
    statusOn.hidden = !allowed;
    statusOff.hidden = allowed;
    allow.setAttribute('aria-pressed', allowed ? 'true' : 'false');
    decline.setAttribute('aria-pressed', allowed ? 'false' : 'true');
  }

  function open(isOpen) {
    card.hidden = !isOpen;
    button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    if (isOpen) allow.focus({ preventScroll: true });
  }

  function clearAnalyticsCookies() {
    var host = window.location.hostname;
    var domains = [host, '.' + host, '.' + host.replace(/^www\./, '')];
    document.cookie.split(';').forEach(function (pair) {
      var name = pair.split('=')[0].trim();
      if (name.indexOf('_ga') !== 0 && name !== '_gid' && name !== '_gat') return;
      domains.forEach(function (domain) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=' + domain;
      });
      document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    });
  }

  function choose(value) {
    allowed = value;
    try { window.localStorage.setItem(state.key, value ? 'granted' : 'denied'); } catch (e) {}
    window['ga-disable-' + state.id] = !value;
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', { analytics_storage: value ? 'granted' : 'denied' });
    }
    if (value && typeof window.loadGoogleTag === 'function') window.loadGoogleTag();
    if (!value) clearAnalyticsCookies();
    render();
    open(false);
    button.focus({ preventScroll: true });
  }

  button.addEventListener('click', function () { open(card.hidden); });
  close.addEventListener('click', function () { open(false); button.focus({ preventScroll: true }); });
  allow.addEventListener('click', function () { choose(true); });
  decline.addEventListener('click', function () { choose(false); });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !card.hidden) { open(false); button.focus({ preventScroll: true }); }
  });

  render();
  // Where a choice is required and none has been made, the card starts open. It never blocks the page.
  if (state.needsChoice) {
    card.hidden = false;
    button.setAttribute('aria-expanded', 'true');
  }
})();
