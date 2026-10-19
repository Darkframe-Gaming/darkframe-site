/* DARKFRAME — scroll chrome, reveals, card tilt */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* nav background on scroll */
  var nav = document.getElementById('nav');
  function onScroll() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* reveal on scroll (?flat lights everything instantly — used for screenshots/tests) */
  var flat = window.location.search.indexOf('flat') !== -1;
  if (flat) {
    document.documentElement.style.scrollBehavior = 'auto';
    document.documentElement.classList.add('flat');
  }
  var revealed = document.querySelectorAll('.reveal:not(.lit)');
  if ('IntersectionObserver' in window && !reduced && !flat) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('lit');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
    revealed.forEach(function (el) { io.observe(el); });
  } else {
    revealed.forEach(function (el) { el.classList.add('lit'); });
  }

  /* pointer tilt on game art */
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (fine && !reduced) {
    document.querySelectorAll('[data-tilt]').forEach(function (card) {
      var raf = null;
      card.addEventListener('mousemove', function (ev) {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          var r = card.getBoundingClientRect();
          var x = (ev.clientX - r.left) / r.width - 0.5;
          var y = (ev.clientY - r.top) / r.height - 0.5;
          card.style.transform =
            'perspective(900px) rotateY(' + (x * 6).toFixed(2) + 'deg)' +
            ' rotateX(' + (-y * 6).toFixed(2) + 'deg)';
          raf = null;
        });
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  /* game grid: filter chips + sort */
  var grid = document.getElementById('game-grid');
  if (grid) {
    var cards = Array.prototype.slice.call(grid.children);
    var buttons = document.querySelectorAll('[data-filter]');
    var sortSel = document.getElementById('game-sort');
    var filter = 'all';
    function apply() {
      cards.forEach(function (c) {
        var t = (c.getAttribute('data-tags') || '').split(' ');
        c.hidden = filter !== 'all' && t.indexOf(filter) === -1;
      });
      var key = sortSel ? sortSel.value : 'new';
      cards.slice().sort(function (a, b) {
        if (key === 'max') return (+b.dataset.max - +a.dataset.max) || (+b.dataset.order - +a.dataset.order);
        if (key === 'az') return a.dataset.name.localeCompare(b.dataset.name);
        if (key === 'hit') return +a.dataset.hit - +b.dataset.hit;
        return +b.dataset.order - +a.dataset.order;
      }).forEach(function (c) { grid.appendChild(c); });
    }
    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        filter = b.getAttribute('data-filter');
        buttons.forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
        apply();
      });
    });
    if (sortSel) sortSel.addEventListener('change', apply);
  }

  /* live badges: refresh the stakenerds SVGs every minute, hide any that fail */
  var badges = document.querySelectorAll('img[data-live]');
  badges.forEach(function (img) {
    img.addEventListener('error', function () {
      var box = img.closest('[data-live-box]');
      if (box) box.style.display = 'none';
    });
  });
  if (badges.length) {
    setInterval(function () {
      if (document.hidden) return;
      var t = Math.floor(Date.now() / 60000);
      badges.forEach(function (img) { img.src = img.getAttribute('data-live') + '?t=' + t; });
    }, 60000);
  }
})();
