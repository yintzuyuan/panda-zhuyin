/* ===== Panda Zhuyin — main.js ===== */

(function () {
  'use strict';

  // --- Theme Toggle ---
  var STORAGE_KEY = 'panda-theme';
  var toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem(STORAGE_KEY, next);
      updateToggleIcon(next);
    });
    updateToggleIcon(document.documentElement.getAttribute('data-theme'));
  }

  function updateToggleIcon(theme) {
    if (!toggle) return;
    var icon = toggle.querySelector('i');
    if (!icon) return;
    icon.className = theme === 'dark' ? 'ph ph-sun' : 'ph ph-moon';
    toggle.setAttribute('aria-label', theme === 'dark' ? '切換淺色模式' : '切換深色模式');
  }

  // --- Scroll Fade-In ---
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

  // --- Enable fade class after first paint ---
  requestAnimationFrame(function () {
    document.documentElement.classList.remove('js-loading');
    document.documentElement.classList.add('js-fade-ready');
  });
})();
