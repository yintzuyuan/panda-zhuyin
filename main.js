/* ===== Panda Zhuyin — main.js ===== */

(function () {
  'use strict';

  var root = document.documentElement;
  var STORAGE_THEME = 'panda-theme';
  var STORAGE_LANG = 'panda-lang';

  // --- i18n: 雙語切換 ---
  // 中文寫在 textContent（HTML 預設），英文寫在 data-en attribute
  // 首次切到 en 前把當前 textContent（中文）存進 data-zh，之後雙向切換
  // aria-label 同構：中文寫在 aria-label（HTML 預設），英文寫在 data-aria-en（#854）
  function applyLang(lang) {
    document.querySelectorAll('[data-en]').forEach(function (el) {
      if (lang === 'en') {
        if (!el.hasAttribute('data-zh')) el.setAttribute('data-zh', el.textContent);
        el.textContent = el.getAttribute('data-en');
      } else {
        var zh = el.getAttribute('data-zh');
        if (zh != null) el.textContent = zh;
      }
    });
    document.querySelectorAll('[data-aria-en]').forEach(function (el) {
      if (lang === 'en') {
        if (!el.hasAttribute('data-aria-zh')) el.setAttribute('data-aria-zh', el.getAttribute('aria-label') || '');
        el.setAttribute('aria-label', el.getAttribute('data-aria-en'));
      } else {
        var ariaZh = el.getAttribute('data-aria-zh');
        if (ariaZh != null) el.setAttribute('aria-label', ariaZh);
      }
    });
    root.dataset.lang = lang;
    root.lang = lang === 'zh' ? 'zh-TW' : 'en';

    document.querySelectorAll('[data-lang-set]').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang-set') === lang);
    });

    // theme toggle 的 aria-label 由 updateToggleIcon 依語言動態組字，切語言時同步刷新
    updateToggleIcon(root.getAttribute('data-theme'));

    try { localStorage.setItem(STORAGE_LANG, lang); } catch (e) {}
  }

  function setupLangSwitcher() {
    document.querySelectorAll('[data-lang-set]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyLang(btn.getAttribute('data-lang-set'));
      });
    });
  }

  // --- Theme Toggle ---
  var toggle = document.getElementById('theme-toggle');
  function updateToggleIcon(theme) {
    if (!toggle) return;
    var icon = toggle.querySelector('i');
    if (!icon) return;
    icon.className = theme === 'dark' ? 'ph ph-sun' : 'ph ph-moon';
    var isZh = root.dataset.lang !== 'en';
    toggle.setAttribute('aria-label', theme === 'dark'
      ? (isZh ? '切換淺色模式' : 'Toggle light mode')
      : (isZh ? '切換深色模式' : 'Toggle dark mode'));
  }

  function setupThemeToggle() {
    if (!toggle) return;
    toggle.addEventListener('click', function () {
      var current = root.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem(STORAGE_THEME, next); } catch (e) {}
      updateToggleIcon(next);
    });
    updateToggleIcon(root.getAttribute('data-theme'));
  }

  // --- Scroll Fade-In ---
  function setupFadeIn() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.fade-in').forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in').forEach(function (el) {
      observer.observe(el);
    });
  }

  // --- Init ---
  function init() {
    // 1. i18n 先跑，避免 fade-in 顯示中文後才切英文閃爍
    applyLang(root.dataset.lang || 'zh');
    setupLangSwitcher();

    // 2. theme toggle 事件
    setupThemeToggle();

    // 3. fade-in observer（在內容已切到正確語言後才觀察）
    setupFadeIn();

    // 4. 移除 loading flag、開始 fade
    requestAnimationFrame(function () {
      root.classList.remove('js-loading');
      root.classList.add('js-fade-ready');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
