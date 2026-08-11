/* ============================================================
   EQUILÍBRIO INTEGRAL — script.js
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  /* ---------- Loader ---------- */
  window.addEventListener('load', function () {
    var loader = document.getElementById('loader');
    if (!loader) return;
    setTimeout(function () { loader.classList.add('is-hidden'); }, reduceMotion ? 0 : 600);
  });

  /* ---------- Theme toggle (persisted) ---------- */
  (function () {
    var root = document.documentElement;
    var toggle = document.getElementById('theme-toggle');
    var stored = null;
    try { stored = localStorage.getItem('ei-theme'); } catch (e) {}
    if (stored) { root.setAttribute('data-theme', stored); }
    if (toggle) {
      toggle.addEventListener('click', function () {
        var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem('ei-theme', next); } catch (e) {}
      });
    }
  })();

  /* ---------- Mobile menu ---------- */
  (function () {
    var burger = document.getElementById('menu-toggle');
    var nav = document.getElementById('main-nav');
    if (!burger || !nav) return;
    function close() { burger.classList.remove('is-open'); nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); }
    burger.addEventListener('click', function () {
      var open = burger.classList.toggle('is-open');
      nav.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', close); });
  })();

  /* ---------- Header scroll state + active link ---------- */
  (function () {
    var header = document.getElementById('header');
    var links = Array.prototype.slice.call(document.querySelectorAll('.header__link'));
    var sections = links
      .map(function (l) { var id = l.getAttribute('href'); return id && id.charAt(0) === '#' ? document.querySelector(id) : null; })
      .filter(Boolean);

    function onScroll() {
      if (header) header.classList.toggle('is-scrolled', window.scrollY > 20);
      var pos = window.scrollY + window.innerHeight * 0.35;
      var currentId = null;
      sections.forEach(function (sec) { if (sec.offsetTop <= pos) currentId = '#' + sec.id; });
      links.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === currentId); });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  })();

  /* ---------- Scroll reveal ---------- */
  (function () {
    var els = document.querySelectorAll('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var delay = parseInt(entry.target.getAttribute('data-delay') || '0', 10) * 90;
          setTimeout(function () { entry.target.classList.add('is-visible'); }, delay);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  })();

  /* ---------- Timeline progress ---------- */
  (function () {
    var line = document.querySelector('.timeline__line');
    var progress = document.querySelector('.timeline__progress');
    var timeline = document.querySelector('.timeline');
    if (!line || !progress || !timeline) return;
    function update() {
      var rect = timeline.getBoundingClientRect();
      var vh = window.innerHeight;
      var start = vh * 0.6;
      var total = rect.height + start;
      var scrolled = Math.min(Math.max(start - rect.top, 0), total);
      progress.style.height = Math.min((scrolled / rect.height) * 100, 100) + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  })();

  /* ---------- Hero parallax ---------- */
  (function () {
    if (reduceMotion) return;
    var bg = document.querySelector('.hero__bg');
    if (!bg) return;
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (y < window.innerHeight) bg.style.transform = 'translateY(' + (y * 0.18) + 'px)';
    }, { passive: true });
  })();

  /* ---------- Custom cursor + magnetic buttons ---------- */
  (function () {
    if (isTouch || reduceMotion) return;
    var cursor = document.querySelector('.cursor');
    var follower = document.querySelector('.cursor-follower');
    if (!cursor || !follower) return;
    var fx = 0, fy = 0, mx = 0, my = 0;
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      cursor.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
    });
    (function loop() {
      fx += (mx - fx) * 0.16; fy += (my - fy) * 0.16;
      follower.style.transform = 'translate(' + fx + 'px,' + fy + 'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a, button, .infobook-panel').forEach(function (el) {
      el.addEventListener('mouseenter', function () { follower.classList.add('is-active'); });
      el.addEventListener('mouseleave', function () { follower.classList.remove('is-active'); });
    });
    document.querySelectorAll('.btn--magnetic').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        btn.style.transform = 'translate(' + x * 0.25 + 'px,' + y * 0.35 + 'px)';
      });
      btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
    });
  })();

  /* ---------- Back to top ---------- */
  (function () {
    var btn = document.getElementById('back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', function () {
      btn.classList.toggle('is-visible', window.scrollY > 600);
    }, { passive: true });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  })();

  /* ---------- Contact form validation ---------- */
  (function () {
    var form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      form.querySelectorAll('[required]').forEach(function (field) {
        var group = field.closest('.form-group');
        var err = group ? group.querySelector('.form-error') : null;
        var ok = field.value.trim() !== '' && (field.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value));
        if (group) group.classList.toggle('has-error', !ok);
        if (err) err.textContent = ok ? '' : (field.type === 'email' && field.value.trim() ? 'E-mail inválido.' : 'Campo obrigatório.');
        if (!ok) valid = false;
      });
      if (valid) {
        form.reset();
        var btn = form.querySelector('button[type="submit"]');
        if (btn) { var t = btn.textContent; btn.textContent = 'Mensagem enviada ✓'; btn.disabled = true; setTimeout(function () { btn.textContent = t; btn.disabled = false; }, 3200); }
      }
    });
  })();

  /* ---------- Newsletter (sidebar) ---------- */
  (function () {
    var form = document.querySelector('.sidebar-widget__form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input');
      var btn = form.querySelector('button');
      if (input && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
        form.reset();
        if (btn) { var t = btn.textContent; btn.textContent = 'Inscrito ✓'; setTimeout(function () { btn.textContent = t; }, 2800); }
      }
    });
  })();

  /* ============================================================
     DESTAQUE DO DIA
     Selects the article of the day. Priority:
     1) an article flagged featuredOfDay = true (admin pick)
     2) otherwise the most recent article (articles[] is date-desc)
     ============================================================ */
  (function () {
    var articles = [
      { id: 'blog-disciplina', featuredOfDay: false, date: '2026-06-01',
        title: 'Como desenvolver disciplina',
        img: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=200&q=70&auto=format&fit=crop',
        alt: 'Pessoa concentrada escrevendo em um caderno ao lado do notebook', readingTime: 6 },
      { id: 'blog-meditacao', featuredOfDay: false, date: '2026-05-20',
        title: 'Os benefícios da meditação',
        img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=200&q=70&auto=format&fit=crop',
        alt: 'Mulher meditando sentada em posição de lótus ao amanhecer', readingTime: 5 },
      { id: 'blog-energia', featuredOfDay: false, date: '2026-05-10',
        title: 'Exercícios para mais energia',
        img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&q=70&auto=format&fit=crop',
        alt: 'Pessoa em treino funcional erguendo peso em ambiente iluminado', readingTime: 7 },
      { id: 'blog-livros', featuredOfDay: false, date: '2026-04-28',
        title: 'Livros para evolução pessoal',
        img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&q=70&auto=format&fit=crop',
        alt: 'Pilha de livros sobre uma mesa de madeira ao lado de uma xícara', readingTime: 8 }
    ];

    var el = document.getElementById('featured-day');
    if (!el) return;

    var pick = articles.filter(function (a) { return a.featuredOfDay; })[0] || articles[0];

    el.innerHTML =
      '<a class="featured-day__thumb" href="#' + pick.id + '" tabindex="-1" aria-hidden="true">' +
        '<img src="' + pick.img + '" alt="" width="78" height="78" loading="eager" decoding="async">' +
      '</a>' +
      '<div class="featured-day__body">' +
        '<span class="featured-day__eyebrow">Destaque do Dia</span>' +
        '<h2 class="featured-day__title">' + pick.title + '</h2>' +
        '<div class="featured-day__meta">' +
          '<span>' + pick.readingTime + ' min de leitura</span>' +
          '<a class="featured-day__link" href="#' + pick.id + '">Ler artigo <span aria-hidden="true">→</span></a>' +
        '</div>' +
      '</div>';

    el.setAttribute('aria-label', 'Destaque do dia: ' + pick.title);

    if (reduceMotion || !('IntersectionObserver' in window)) {
      el.classList.add('is-visible');
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { setTimeout(function () { el.classList.add('is-visible'); }, 400); io.unobserve(el); }
        });
      }, { threshold: 0.2 });
      io.observe(el);
    }
  })();

})();
