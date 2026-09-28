/* ===================================================================
   Ethan Mills — Engineering Portfolio
   Nav, scroll-spy, reveal, tabs, lightbox, magnetic buttons
=================================================================== */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Nav toggle (left-side sliding panel) ---------- */
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');
  var navOverlay = document.getElementById('navOverlay');

  function closeNav() {
    if (!navToggle || !mainNav) return;
    navToggle.setAttribute('aria-expanded', 'false');
    mainNav.classList.remove('is-open');
    if (navOverlay) navOverlay.classList.remove('is-open');
  }

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var open = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!open));
      mainNav.classList.toggle('is-open', !open);
      if (navOverlay) navOverlay.classList.toggle('is-open', !open);
    });
    mainNav.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });
    if (navOverlay) navOverlay.addEventListener('click', closeNav);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* ---------- Header background on scroll ---------- */
  var header = document.getElementById('siteHeader');
  function onScrollHeader() {
    if (!header) return;
    if (window.scrollY > 20) {
      header.style.setProperty('--header-bg', 'rgba(15,47,102,0.55)');
      header.style.borderBottomColor = 'rgba(255,255,255,0.16)';
    } else {
      header.style.setProperty('--header-bg', 'rgba(15,47,102,0.3)');
      header.style.borderBottomColor = 'rgba(255,255,255,0.1)';
    }
  }
  document.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------- Scroll-spy (home page only — sections live on index.html) ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));

  function setActiveLink(id) {
    navLinks.forEach(function (link) {
      var href = link.getAttribute('href') || '';
      var isActive = href === '#' + id || href === 'index.html#' + id;
      link.classList.toggle('is-active', isActive);
      if (isActive) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  if ('IntersectionObserver' in window && sections.length) {
    var spyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActiveLink(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );
    sections.forEach(function (s) { spyObserver.observe(s); });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- Year tabs ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.year-tab'));
  var panels = {
    'tab-freshman': document.getElementById('panel-freshman'),
    'tab-sophomore': document.getElementById('panel-sophomore')
  };

  function activateTab(tab) {
    tabs.forEach(function (t) {
      var isActive = t === tab;
      t.classList.toggle('is-active', isActive);
      t.setAttribute('aria-selected', String(isActive));
      t.setAttribute('tabindex', isActive ? '0' : '-1');
      var panel = panels[t.id];
      if (panel) {
        panel.classList.toggle('is-active', isActive);
        panel.hidden = !isActive;
      }
    });
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { activateTab(tab); });
    tab.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        var nextIndex = e.key === 'ArrowRight' ? (i + 1) % tabs.length : (i - 1 + tabs.length) % tabs.length;
        tabs[nextIndex].focus();
        activateTab(tabs[nextIndex]);
      }
    });
  });

  /* ---------- Lightbox (story-media figures) ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxCaption = document.getElementById('lightboxCaption');
  var lightboxClose = document.getElementById('lightboxClose');
  var lightboxPrev = document.getElementById('lightboxPrev');
  var lightboxNext = document.getElementById('lightboxNext');
  var lastFocused = null;
  var lightboxFigures = Array.prototype.slice.call(document.querySelectorAll('.collage-item'));
  var lightboxIndex = -1;

  function showAt(index) {
    if (!lightboxFigures.length) return;
    lightboxIndex = (index + lightboxFigures.length) % lightboxFigures.length;
    var fig = lightboxFigures[lightboxIndex];
    var img = fig.querySelector('img');
    var caption = fig.querySelector('figcaption');
    if (!img) return;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || '';
    lightboxCaption.textContent = caption ? caption.textContent : '';
  }
  function openLightbox(index) {
    if (!lightbox || !lightboxImg) return;
    lastFocused = document.activeElement;
    showAt(index);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var showNav = lightboxFigures.length > 1;
    if (lightboxPrev) lightboxPrev.style.display = showNav ? '' : 'none';
    if (lightboxNext) lightboxNext.style.display = showNav ? '' : 'none';
    lightboxClose.focus();
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  lightboxFigures.forEach(function (fig, i) {
    fig.setAttribute('tabindex', '0');
    fig.setAttribute('role', 'button');
    fig.setAttribute('aria-label', 'View larger image');

    function trigger() { openLightbox(i); }
    fig.addEventListener('click', trigger);
    fig.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); trigger(); }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', function (e) { e.stopPropagation(); showAt(lightboxIndex - 1); });
  if (lightboxNext) lightboxNext.addEventListener('click', function (e) { e.stopPropagation(); showAt(lightboxIndex + 1); });
  if (lightbox) {
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
  }
  document.addEventListener('keydown', function (e) {
    if (!lightbox || !lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') showAt(lightboxIndex - 1);
    else if (e.key === 'ArrowRight') showAt(lightboxIndex + 1);
  });

  /* ---------- Interest rows: tap-to-reveal on touch/no-hover devices ---------- */
  document.querySelectorAll('.interest-row').forEach(function (row) {
    row.addEventListener('click', function () {
      row.classList.toggle('is-open');
    });
  });

  /* ---------- Auto-rotating photo gallery ---------- */
  document.querySelectorAll('[data-gallery]').forEach(function (gallery) {
    var track = gallery.querySelector('.photo-gallery-track');
    if (!track) return;

    var timer = null;
    var resumeTimer = null;

    function step(dir) {
      var item = track.querySelector('.collage-item');
      var amount = item ? item.getBoundingClientRect().width + 14 : 240;
      track.scrollBy({ left: dir * amount, behavior: 'smooth' });
    }
    function atEnd() {
      return track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    }
    function advance() {
      if (atEnd()) track.scrollTo({ left: 0, behavior: 'smooth' });
      else step(1);
    }
    function start() {
      if (prefersReducedMotion) return;
      stop();
      timer = window.setInterval(advance, 3200);
    }
    function stop() {
      if (timer) { window.clearInterval(timer); timer = null; }
    }
    function pauseThenResume() {
      stop();
      if (resumeTimer) window.clearTimeout(resumeTimer);
      resumeTimer = window.setTimeout(start, 5000);
    }

    track.addEventListener('mouseenter', stop);
    track.addEventListener('mouseleave', start);
    track.addEventListener('touchstart', pauseThenResume, { passive: true });
    track.addEventListener('wheel', pauseThenResume, { passive: true });
    gallery.addEventListener('focusin', stop);
    gallery.addEventListener('focusout', start);

    start();
  });

  /* ---------- Magnetic buttons (subtle, desktop only, reactive to cursor) ---------- */
  if (!prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.btn').forEach(function (btn) {
      btn.addEventListener('mousemove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        btn.style.transform = 'translate(' + (x * 0.12).toFixed(1) + 'px,' + (y * 0.28 - 2).toFixed(1) + 'px)';
      });
      btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
    });
  }

})();
