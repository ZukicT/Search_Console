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
          mobileNav.classList.remove('open');
          document.body.classList.remove('menu-open');
          var mobileMenuBtn = document.getElementById('mobile-menu-btn');
          if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
          var mobileNavBackdrop = document.getElementById('mobile-nav-backdrop');
          if (mobileNavBackdrop) {
            mobileNavBackdrop.classList.remove('is-visible');
            mobileNavBackdrop.setAttribute('aria-hidden', 'true');
          }
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
    var page = normalizePath(window.location.pathname);
    var hash = window.location.hash;
    var onHome = isHomePage();

    document.querySelectorAll('[data-nav]').forEach(function (link) {
      var key = link.getAttribute('data-nav');
      var isActive = false;

      if (key === 'home' && onHome && (!hash || hash === '#hero')) isActive = true;
      if (key === 'features' && onHome && hash === '#features') isActive = true;
      if (key === 'faq' && onHome && hash === '#faq') isActive = true;
      if (key === 'about' && page === 'about.html') isActive = true;
      if (key === 'releases' && page === 'releases.html') isActive = true;
      if (key === 'privacy' && page === 'privacy.html') isActive = true;
      if (key === 'terms' && page === 'terms.html') isActive = true;

      link.classList.toggle('is-active', isActive);
      if (isActive) {
        if (key === 'features' || key === 'faq') {
          link.setAttribute('aria-current', 'true');
        } else {
          link.setAttribute('aria-current', 'page');
        }
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  function initMobileMenu() {
    var mobileMenuBtn = document.getElementById('mobile-menu-btn');
    var mobileNav = document.getElementById('mobile-nav');
    var mobileNavBackdrop = document.getElementById('mobile-nav-backdrop');
    var mobileNavClose = document.getElementById('mobile-nav-close');
    var menuIcon = document.getElementById('menu-icon');
    if (!mobileMenuBtn || !mobileNav) return;

    function setMenuOpen(isOpen) {
      mobileNav.classList.toggle('open', isOpen);
      mobileMenuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.classList.toggle('menu-open', isOpen);
      if (mobileNavBackdrop) {
        mobileNavBackdrop.classList.toggle('is-visible', isOpen);
        mobileNavBackdrop.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      }
      if (menuIcon) {
        menuIcon.innerHTML = isOpen
          ? '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'
          : '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>';
      }
    }

    mobileMenuBtn.addEventListener('click', function () {
      setMenuOpen(!mobileNav.classList.contains('open'));
    });

    if (mobileNavClose) {
      mobileNavClose.addEventListener('click', function () {
        setMenuOpen(false);
      });
    }

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
      if (event.key === 'Escape' && mobileNav.classList.contains('open')) {
        setMenuOpen(false);
      }
    });
  }

  function openLightbox(src, alt) {
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightbox-img');
    if (!lightbox || !lightboxImg || !src) return;

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
    var hero = document.querySelector('.hero-chapter');
    if (!bar || !hero) return;

    if (!('IntersectionObserver' in window)) {
      bar.classList.add('mobile-download-bar--visible');
      bar.setAttribute('aria-hidden', 'false');
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        var heroVisible = entries.some(function (entry) { return entry.isIntersecting; });
        var showBar = !heroVisible;
        bar.classList.toggle('mobile-download-bar--visible', showBar);
        bar.setAttribute('aria-hidden', showBar ? 'false' : 'true');
      },
      { threshold: 0.05 },
    );

    observer.observe(hero);
  }

  function initFaqAccordion() {
    var questions = document.querySelectorAll('.faq-question');
    if (!questions.length) return;

    questions.forEach(function (btn) {
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

  initReveal();
  initHeaderScroll();
  initHeroIntro();
  initHeroScrollCue();
  initBotCoinEasterEgg();
  initReleaseBanner();
  initNavActiveState();
  initInPageAnchorNav();
  initMobileMenu();
  initLightbox();
  initScreenshotRail();
  initMobileDownloadBar();
  initFaqAccordion();
  initReleaseTimeline();
  initScrollProgress();

  window.addEventListener('hashchange', initNavActiveState);
})();
