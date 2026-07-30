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
})();
