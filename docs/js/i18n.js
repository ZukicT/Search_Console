(function () {
  var STORAGE_KEY = 'locale';
  var LOCALES = {
    en: 'English',
    de: 'Deutsch',
    fr: 'Fran\u00e7ais',
    pt: 'Portugu\u00eas',
    ja: '\u65e5\u672c\u8a9e',
    'zh-Hans': '\u7b80\u4f53\u4e2d\u6587',
    'zh-Hant': '\u7e41\u9ad4\u4e2d\u6587',
    ko: '\ud55c\uad6d\uc5b4'
  };
  var FALLBACK_LOCALE = 'en';
  var currentTranslations = null;
  var currentLocale = FALLBACK_LOCALE;

  function getLocalesUrl(locale) {
    var script = document.querySelector('script[src*="i18n.js"]');
    if (script && script.src) {
      try {
        var base = script.src.replace(/\/[^/]*$/, '/');
        return base + (base.indexOf('/js/') !== -1 ? '../locales/' : 'locales/') + locale + '.json';
      } catch (e) {}
    }
    var path = window.location.pathname;
    var last = path.lastIndexOf('/');
    var base = last === -1 ? '' : path.substring(0, last + 1);
    return base + (base.indexOf('/guides/') !== -1 ? '../locales/' : 'locales/') + locale + '.json';
  }

  function getStoredLocale() {
    try {
      var s = localStorage.getItem(STORAGE_KEY);
      if (s && LOCALES[s]) return s;
    } catch (e) {}
    return null;
  }

  function getBrowserLocale() {
    var lang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (lang.startsWith('zh-cn') || lang === 'zh-hans') return 'zh-Hans';
    if (lang.startsWith('zh-tw') || lang.startsWith('zh-hk') || lang === 'zh-hant') return 'zh-Hant';
    if (lang.startsWith('ko')) return 'ko';
    if (lang.startsWith('de')) return 'de';
    if (lang.startsWith('fr')) return 'fr';
    if (lang.startsWith('pt')) return 'pt';
    if (lang.startsWith('ja')) return 'ja';
    if (lang.startsWith('en')) return 'en';
    return FALLBACK_LOCALE;
  }

  function getCurrentLocale() {
    var stored = getStoredLocale();
    var browser = getBrowserLocale();
    var locale = stored || browser;
    return LOCALES[locale] ? locale : FALLBACK_LOCALE;
  }

  function setLocale(code) {
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch (e) {}
  }

  function getNested(obj, path) {
    var parts = path.split('.');
    for (var i = 0; i < parts.length; i++) {
      if (obj == null) return undefined;
      obj = obj[parts[i]];
    }
    return obj;
  }

  function interpolate(str, vars) {
    if (!vars || typeof str !== 'string') return str;
    return str.replace(/\{\{(\w+)\}\}/g, function (_, key) {
      return vars[key] != null ? String(vars[key]) : '';
    });
  }

  function t(key, vars) {
    var val = getNested(currentTranslations, key);
    if (typeof val !== 'string') return '';
    return interpolate(val, vars);
  }

  function applyMeta(translations) {
    if (!translations) return;
    var body = document.body;
    var titleKey = (body && body.getAttribute('data-i18n-title-key')) || 'meta.title';
    var descriptionKey = (body && body.getAttribute('data-i18n-description-key')) || 'meta.description';
    var title = getNested(translations, titleKey);
    var description = getNested(translations, descriptionKey);

    if (typeof title === 'string') {
      document.title = title.replace(/\n/g, ' ').trim();
    }

    if (typeof description === 'string') {
      var metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) metaDescription.setAttribute('content', description);

      var ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) ogDescription.setAttribute('content', description);

      var twitterDescription = document.querySelector('meta[name="twitter:description"]');
      if (twitterDescription) twitterDescription.setAttribute('content', description);
    }

    if (typeof title === 'string') {
      var ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', title.replace(/\n/g, ' ').trim());

      var twitterTitle = document.querySelector('meta[name="twitter:title"]');
      if (twitterTitle) twitterTitle.setAttribute('content', title.replace(/\n/g, ' ').trim());
    }
  }

  function applyTranslations(translations) {
    if (!translations) return;
    currentTranslations = translations;
    applyMeta(translations);
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var val = getNested(translations, key);
      if (typeof val === 'string') {
        if (val.indexOf('<') !== -1) {
          el.innerHTML = val;
        } else {
          el.textContent = val;
        }
      }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      var val = getNested(translations, key);
      if (typeof val === 'string') el.placeholder = val;
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-aria-label');
      var val = getNested(translations, key);
      if (typeof val === 'string') el.setAttribute('aria-label', val);
    });
    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-alt');
      var val = getNested(translations, key);
      if (typeof val === 'string') el.setAttribute('alt', val);
    });
    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-title');
      var val = getNested(translations, key);
      if (typeof val === 'string') el.setAttribute('title', val);
    });
    document.querySelectorAll('[data-i18n-aria-label-expand]').forEach(function (el) {
      var keyExpand = el.getAttribute('data-i18n-aria-label-expand');
      var keyCollapse = el.getAttribute('data-i18n-aria-label-collapse');
      var valExpand = keyExpand ? getNested(translations, keyExpand) : '';
      var valCollapse = keyCollapse ? getNested(translations, keyCollapse) : '';
      if (typeof valExpand === 'string') el.setAttribute('data-aria-label-expand', valExpand);
      if (typeof valCollapse === 'string') el.setAttribute('data-aria-label-collapse', valCollapse);
      if (typeof valExpand === 'string') el.setAttribute('aria-label', valExpand);
    });
    document.dispatchEvent(
      new CustomEvent('locale:applied', {
        detail: { locale: currentLocale, translations: translations }
      })
    );
  }

  function initPicker(locale) {
    var picker = document.getElementById('lang-picker');
    if (!picker) return;
    if (picker.options.length === 0) {
      Object.keys(LOCALES).forEach(function (code) {
        var opt = document.createElement('option');
        opt.value = code;
        opt.textContent = LOCALES[code];
        picker.appendChild(opt);
      });
    }
    picker.value = LOCALES[locale] ? locale : FALLBACK_LOCALE;
    picker.removeEventListener('change', onPickerChange);
    picker.addEventListener('change', onPickerChange);
  }

  function onPickerChange() {
    var picker = document.getElementById('lang-picker');
    if (!picker) return;
    var code = picker.value;
    if (!LOCALES[code]) return;
    setLocale(code);
    loadAndApply(code);
  }

  function loadAndApply(locale) {
    if (!LOCALES[locale]) locale = FALLBACK_LOCALE;
    currentLocale = locale;
    var url = getLocalesUrl(locale);
    fetch(url)
      .then(function (res) { return res.ok ? res.json() : Promise.reject(); })
      .then(function (translations) {
        applyTranslations(translations);
        initPicker(locale);
        document.documentElement.lang = locale === 'zh-Hans' || locale === 'zh-Hant' ? 'zh' : locale;
      })
      .catch(function () {
        if (locale !== FALLBACK_LOCALE) loadAndApply(FALLBACK_LOCALE);
      });
  }

  window.SC_I18N = {
    t: t,
    getLocale: function () { return currentLocale; },
    getTranslations: function () { return currentTranslations; }
  };

  function run() {
    var locale = getCurrentLocale();
    initPicker(locale);
    loadAndApply(locale);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
