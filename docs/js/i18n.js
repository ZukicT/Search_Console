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

  function applyTranslations(t) {
    if (!t) return;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var val = getNested(t, key);
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
      var val = getNested(t, key);
      if (typeof val === 'string') el.placeholder = val;
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-aria-label');
      var val = getNested(t, key);
      if (typeof val === 'string') el.setAttribute('aria-label', val);
    });
    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-title');
      var val = getNested(t, key);
      if (typeof val === 'string') el.setAttribute('title', val);
    });
    document.querySelectorAll('[data-i18n-aria-label-expand]').forEach(function (el) {
      var keyExpand = el.getAttribute('data-i18n-aria-label-expand');
      var keyCollapse = el.getAttribute('data-i18n-aria-label-collapse');
      var valExpand = keyExpand ? getNested(t, keyExpand) : '';
      var valCollapse = keyCollapse ? getNested(t, keyCollapse) : '';
      if (typeof valExpand === 'string') el.setAttribute('data-aria-label-expand', valExpand);
      if (typeof valCollapse === 'string') el.setAttribute('data-aria-label-collapse', valCollapse);
      if (typeof valExpand === 'string') el.setAttribute('aria-label', valExpand);
    });
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
    var url = getLocalesUrl(locale);
    fetch(url)
      .then(function (res) { return res.ok ? res.json() : Promise.reject(); })
      .then(function (t) {
        applyTranslations(t);
        initPicker(locale);
        document.documentElement.lang = locale === 'zh-Hans' || locale === 'zh-Hant' ? 'zh' : locale;
      })
      .catch(function () {
        if (locale !== FALLBACK_LOCALE) loadAndApply(FALLBACK_LOCALE);
      });
  }

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
