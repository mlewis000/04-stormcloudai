/* =============================================
   StormCloud AI — Main JS
   ============================================= */

/* Sticky nav */
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
}

/* Mobile menu */
const hamburger = document.querySelector('.hamburger');
const navLinks  = document.querySelector('.nav-links');
const closeNav  = document.querySelector('.close-nav');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.add('open');
    if (closeNav) closeNav.classList.add('show');
    document.body.style.overflow = 'hidden';
  });
}
if (closeNav && navLinks) {
  closeNav.addEventListener('click', () => {
    navLinks.classList.remove('open');
    closeNav.classList.remove('show');
    document.body.style.overflow = '';
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      closeNav.classList.remove('show');
      document.body.style.overflow = '';
    });
  });
}

/* Active nav link */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});

/* Animate on scroll — .fade-up class */
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      // Stagger siblings by index within parent
      const siblings = Array.from(e.target.parentElement.querySelectorAll('.fade-up'));
      const delay = siblings.indexOf(e.target) * 80;
      setTimeout(() => e.target.classList.add('visible'), delay);
      fadeObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

/* Contact form */
const form = document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = 'Message Sent!';
      showToast('Thanks! We\'ll be in touch within 1 business day.');
      form.reset();
      setTimeout(() => {
        btn.textContent = 'Send Message';
        btn.disabled = false;
      }, 3000);
    }, 1200);
  });
}

function showToast(msg) {
  let t = document.querySelector('.toast');
  if (!t) {
    t = document.createElement('div');
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 4000);
}

/* Live scan animation in hero dashboard */
const scanChecks = [
  'Title & meta tags',
  'SSL certificate valid',
  'Analysing Core Web Vitals...',
  'Schema markup',
  'Backlink profile',
];
const scanChecksEl = document.getElementById('dashChecks');
if (scanChecksEl) {
  const rows = scanChecksEl.querySelectorAll('.chk');
  let step = 2; // start at the active step

  function advanceScan() {
    if (step < rows.length) {
      rows[step].classList.remove('active', 'pending');
      rows[step].classList.add('done');
      rows[step].querySelector('.chk-i').textContent = '✓';
      rows[step].querySelector('.chk-i').classList.remove('dash-spin');
      step++;
      if (step < rows.length) {
        rows[step].classList.remove('pending');
        rows[step].classList.add('active');
        rows[step].querySelector('.chk-i').textContent = '⟳';
        rows[step].querySelector('.chk-i').classList.add('dash-spin');
      }
    } else {
      // Reset cycle
      setTimeout(() => {
        step = 0;
        rows.forEach((r, i) => {
          r.classList.remove('done', 'active');
          r.classList.add('pending');
          r.querySelector('.chk-i').textContent = '○';
          r.querySelector('.chk-i').classList.remove('dash-spin');
        });
        setTimeout(() => {
          rows[0].classList.remove('pending'); rows[0].classList.add('done');
          rows[0].querySelector('.chk-i').textContent = '✓';
          rows[1].classList.remove('pending'); rows[1].classList.add('done');
          rows[1].querySelector('.chk-i').textContent = '✓';
          rows[2].classList.remove('pending'); rows[2].classList.add('active');
          rows[2].querySelector('.chk-i').textContent = '⟳';
          rows[2].querySelector('.chk-i').classList.add('dash-spin');
          step = 2;
        }, 600);
      }, 1200);
    }
  }
  setInterval(advanceScan, 1800);
}

/* Smooth counter animation for hero stats */
function animateCounter(el, target, suffix = '') {
  let current = 0;
  const increment = target / 50;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current) + suffix;
    }
  }, 30);
}

const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        document.querySelectorAll('.stat-num').forEach(el => {
          const val = el.dataset.val;
          const suffix = el.dataset.suffix || '';
          if (val) animateCounter(el, parseInt(val), suffix);
        });
        statObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });
  statObserver.observe(statsSection);
}
