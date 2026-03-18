/**
 * ============================================================
 * PROJET COO-BOT – QUINTESSENCE GAMES
 * script.js
 * ============================================================
 */

/* ── DOM References ──────────────────────────────────────────── */
const navbar       = document.getElementById('navbar');
const burger       = document.getElementById('burger');
const navLinks     = document.getElementById('navLinks');
const navItems     = document.querySelectorAll('.nav-item');
const btnSavoir    = document.getElementById('btnSavoirPlus');
const particlesCtn = document.getElementById('particles');

/* ============================================================
   BURGER MENU (mobile)
   ============================================================ */
burger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  burger.classList.toggle('open', isOpen);
  burger.setAttribute('aria-expanded', isOpen);

  // Prevent body scroll when menu is open
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu when a nav link is clicked
navLinks.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    navLinks.classList.remove('open');
    burger.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ============================================================
   ACTIVE NAV ITEM – highlight on scroll
   ============================================================ */
const sections = ['accueil', 'equipe', 'ressources', 'telechargements'];

const setActiveNav = (sectionId) => {
  navItems.forEach(item => {
    item.classList.toggle('active', item.dataset.section === sectionId);
  });
};

const observerOptions = {
  root: null,
  rootMargin: `-${60}px 0px -40% 0px`,
  threshold: 0
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      // Map sub-sections back to nav items
      if (id === 'more-info') return; // no nav item for this
      setActiveNav(id);
    }
  });
}, observerOptions);

sections.forEach(id => {
  const el = document.getElementById(id);
  if (el) sectionObserver.observe(el);
});

/* ============================================================
   CTA BUTTON – smooth scroll to #more-info
   ============================================================ */
btnSavoir.addEventListener('click', (e) => {
  e.preventDefault();
  const target = document.getElementById('more-info');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  console.log('[CTA] "EN SAVOIR PLUS" clicked → scrolling to #more-info');
});

/* ============================================================
   NAV ITEM CLICK – smooth scroll + logging
   ============================================================ */
navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    const section = item.dataset.section;
    console.log(`[NAV] Navigating to section: #${section}`);

    // Immediately highlight clicked item
    navItems.forEach(n => n.classList.remove('active'));
    item.classList.add('active');
  });
});

/* ============================================================
   NAVBAR – subtle scroll shadow
   ============================================================ */
let lastScrollY = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;

  // Add solid background when scrolled
  if (y > 50) {
    navbar.style.background = 'rgba(3, 5, 14, 0.88)';
  } else {
    navbar.style.background = '';
  }

  // Hide navbar on scroll down, show on scroll up
  if (y > lastScrollY + 8 && y > 120) {
    navbar.style.transform = 'translateY(-100%)';
    navbar.style.transition = 'transform 0.35s ease, background 0.3s';
  } else if (y < lastScrollY - 4) {
    navbar.style.transform = 'translateY(0)';
  }

  lastScrollY = y;
}, { passive: true });

/* ============================================================
   FLOATING PARTICLES
   ============================================================ */
const PARTICLE_COUNT = 28;

const createParticle = () => {
  const p = document.createElement('div');
  p.className = 'particle';

  // Random size: tiny dots
  const size = Math.random() * 3 + 1;
  p.style.width  = `${size}px`;
  p.style.height = `${size}px`;

  // Random horizontal position
  p.style.left = `${Math.random() * 100}%`;

  // Alternate colors: cyan or magenta
  const isCyan = Math.random() > 0.35;
  p.style.background = isCyan
    ? `rgba(0, 240, 255, ${Math.random() * 0.6 + 0.3})`
    : `rgba(255, 0, 200, ${Math.random() * 0.4 + 0.2})`;

  // Box shadow glow
  p.style.boxShadow = isCyan
    ? `0 0 ${size * 3}px rgba(0,240,255,0.8)`
    : `0 0 ${size * 3}px rgba(255,0,200,0.7)`;

  // Random speed & delay
  const duration = Math.random() * 15 + 10; // 10–25s
  const delay    = Math.random() * -20;      // stagger starts
  p.style.animationDuration = `${duration}s`;
  p.style.animationDelay    = `${delay}s`;

  // Slight horizontal drift via CSS custom prop (JS controls keyframes)
  p.style.setProperty('--drift', `${(Math.random() - 0.5) * 60}px`);

  return p;
};

// Init particles
for (let i = 0; i < PARTICLE_COUNT; i++) {
  particlesCtn.appendChild(createParticle());
}

/* ============================================================
   GLITCH TITLE – occasional extra burst on hover
   ============================================================ */
const glitchTitle = document.querySelector('.glitch-title');
if (glitchTitle) {
  glitchTitle.addEventListener('mouseenter', () => {
    glitchTitle.style.animation = 'title-shimmer 1s linear, glitch-main 0.5s steps(1) infinite';
    setTimeout(() => {
      glitchTitle.style.animation = '';
    }, 600);
  });
}

/* ============================================================
   SECTION PLACEHOLDERS – future page comments
   ============================================================ */
/*
  TODO – #more-info:
    Detailed game description, screenshots, gameplay video embed,
    feature highlights (co-op mechanics, world design, progression).

  TODO – #equipe:
    Team member cards with roles, avatars, contribution summaries.
    Based on: Anisa (Chef de projet), Kassim (Réseau/Cloud),
              Aïssa (Robots), Lina (?), Ilan (Niveaux).

  TODO – #ressources:
    Three-column grid:
      • Librairies & Outils (Pygame, Figma, VS Code, ChAGPT)
      • Banques d'Assets (Unsplash, Pexels, Freesound, Zapsplat)
      • Références & Tutos (Gamasutra, Clear Code, Stack Overflow)

  TODO – #telechargements:
    Two large CTA buttons (Télécharger le Rapport .docx, Télécharger le Jeu .zip)
    + Installation instructions (clone GitHub, pip install pygame, run main.py)
*/

console.log('%c QUINTESSENCE GAMES – Projet COO-BOT ', 'background:#00f0ff;color:#030810;font-family:monospace;font-weight:bold;padding:4px 8px;');
console.log('%c Développé à l\'EPITA 2026 par Anisa · Kassim · Aïssa · Lina · Ilan ', 'color:#ff00c8;font-family:monospace;');