// ===== Mobile menu toggle =====
(function () {
  const btn  = document.getElementById('menuToggle');
  const nav  = document.getElementById('primaryNav');
  if (!btn || !nav) return;

  const closeMenu = () => {
    nav.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  };

  btn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close after clicking a link
  nav.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', closeMenu);
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // If resizing to desktop, ensure menu is reset
  const BP = 860;
  window.addEventListener('resize', () => {
    if (window.innerWidth > BP) closeMenu();
  });
})();

// ===== Dark by default; toggle to light, with memory =====
(function () {
  const btn = document.getElementById('themeToggle');
  const STORAGE_KEY = 'theme';

  const apply = (mode) => {
    document.body.classList.toggle('dark', mode === 'dark');
    if (btn) {
      btn.setAttribute('aria-pressed', String(mode === 'dark'));
      btn.setAttribute('aria-label', mode === 'dark'
        ? 'Switch to light mode'
        : 'Switch to dark mode');
      btn.textContent = mode === 'dark' ? '🌙' : '☀️'; // optional icon swap
    }
  };

  let saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch {}

  // Default to DARK if nothing saved
  if (saved === 'dark' || saved === 'light') {
    apply(saved);
  } else {
    apply('dark');
  }

  // Toggle handler
  btn?.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark');
    const next = isDark ? 'light' : 'dark';
    apply(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch {}
  });
})();

// ===== Smooth scroll for nav + hero buttons =====
(function () {
  const clickable = document.querySelectorAll('header nav a, .cta .btn[href^="#"]');
  clickable.forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', href);
    });
  });
})();

// ===== Highlight active nav section (sets .active + aria-current) =====
(function () {
  const links = Array.from(document.querySelectorAll('header nav a[href^="#"]'));
  if (!links.length) return;

  const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
  const clear = () => {
    links.forEach(l => {
      l.classList.remove('active');
      l.removeAttribute('aria-current');
    });
  };

  const observer = new IntersectionObserver((entries) => {
    // Prefer the entry that is intersecting and closest to viewport center
    const visible = entries.filter(e => e.isIntersecting);
    if (!visible.length) return;

    // Pick the one with the greatest intersection ratio
    const best = visible.reduce((a, b) => (a.intersectionRatio > b.intersectionRatio ? a : b));
    const link = map.get(best.target.id);
    if (!link) return;

    clear();
    link.classList.add('active');
    link.setAttribute('aria-current', 'page');
  }, { rootMargin: '-40% 0px -55% 0px', threshold: [0.01, 0.25, 0.5, 0.75, 1] });

  document.querySelectorAll('main section[id]').forEach(sec => observer.observe(sec));
})();

// ===== Reveal animation (both show + hide on scroll) =====
(function () {
  const targets = [
    ...document.querySelectorAll('.card'),
    ...document.querySelectorAll('section h2'),
    document.querySelector('#home h1'),
    document.querySelector('#home p')
  ].filter(Boolean);

  if (!targets.length) return;

  targets.forEach(t => t.classList.add('reveal'));

  if (!('IntersectionObserver' in window)) {
    targets.forEach(t => t.classList.add('reveal-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('reveal-visible');
      } else {
        e.target.classList.remove('reveal-visible'); // <-- removes when scrolled out
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });

  targets.forEach(t => observer.observe(t));
})();

// ===== Footer year =====
(function () {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

// ===== Hero image preview (optional input#heroUpload) =====
(function () {
  const upload = document.getElementById('heroUpload');
  const img = document.getElementById('heroImage');
  if (!upload || !img) return;

  upload.addEventListener('change', () => {
    const file = upload.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    img.src = url;
  });
})();

// ===== Resume link: open in browser viewer (no forced download) =====
(function () {
  const btn = document.getElementById('resumeDownload');
  if (!btn) return;

  // Ensure it opens in a new tab (browser PDF viewer)
  btn.setAttribute('target', '_blank');
  btn.setAttribute('rel', 'noopener');

  // Remove any accidental 'download' attribute
  btn.removeAttribute('download');

  // Do not intercept click — let the browser handle it
})();

// ===== Hide header on scroll down, show on scroll up =====
(function () {
  const header = document.querySelector("header");
  let lastScroll = window.scrollY;

  window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;

    if (currentScroll > lastScroll && currentScroll > 80) {
      // scrolling down, hide
      header.classList.add("hide");
    } else {
      // scrolling up, show
      header.classList.remove("hide");
    }

    lastScroll = currentScroll;
  });
})();

