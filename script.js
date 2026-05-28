/* ============================================================
   C00-B0T – QUINTESSENCE GAMES
   script.js – Version Améliorée
   ============================================================ */

/* ── PRELOADER ──────────────────────────────────────────────── */
const preloader = document.getElementById('preloader');
const plFill    = document.getElementById('plFill');
const plPct     = document.getElementById('plPct');

let progress = 0;
const interval = setInterval(() => {
  progress += Math.random() * 12 + 3;
  if (progress >= 100) {
    progress = 100;
    clearInterval(interval);
    setTimeout(() => {
      preloader.classList.add('done');
      document.body.style.cursor = '';
      initScrollReveal();
    }, 400);
  }
  plFill.style.width = progress + '%';
  plPct.textContent  = Math.round(progress) + '%';
}, 80);

/* ── CUSTOM CURSOR ──────────────────────────────────────────── */
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');
let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

function animateTrail() {
  trailX += (mouseX - trailX) * 0.12;
  trailY += (mouseY - trailY) * 0.12;
  cursorTrail.style.left = trailX + 'px';
  cursorTrail.style.top  = trailY + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();

/* ── HERO CANVAS — FLOATING PARTICLES ──────────────────────── */
const canvas = document.getElementById('heroCanvas');
const ctx    = canvas ? canvas.getContext('2d') : null;

if (canvas && ctx) {
  const resize = () => {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  const dots = Array.from({ length: 80 }, () => ({
    x:    Math.random() * canvas.width,
    y:    Math.random() * canvas.height,
    r:    Math.random() * 1.5 + 0.3,
    vx:   (Math.random() - 0.5) * 0.3,
    vy:   (Math.random() - 0.5) * 0.3,
    cyan: Math.random() > 0.4,
    a:    Math.random() * 0.6 + 0.2,
  }));

  function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dots.forEach(d => {
      d.x += d.vx;
      d.y += d.vy;
      if (d.x < 0) d.x = canvas.width;
      if (d.x > canvas.width) d.x = 0;
      if (d.y < 0) d.y = canvas.height;
      if (d.y > canvas.height) d.y = 0;

      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = d.cyan
        ? `rgba(0,240,255,${d.a})`
        : `rgba(255,0,200,${d.a * 0.6})`;
      ctx.fill();
    });

    // Draw connection lines
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx   = dots[i].x - dots[j].x;
        const dy   = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100) {
          const a = (1 - dist / 100) * 0.15;
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = `rgba(0,240,255,${a})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(drawCanvas);
  }
  drawCanvas();
}

/* ── FLOATING DOM PARTICLES ─────────────────────────────────── */
const particlesCtn = document.getElementById('particles');
if (particlesCtn) {
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 3 + 1;
    const cyan = Math.random() > 0.35;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      background: ${cyan ? `rgba(0,240,255,${Math.random()*0.5+0.3})` : `rgba(255,0,200,${Math.random()*0.35+0.2})`};
      box-shadow: 0 0 ${size*3}px ${cyan ? 'rgba(0,240,255,0.8)' : 'rgba(255,0,200,0.7)'};
      animation-duration: ${Math.random()*18+10}s;
      animation-delay: ${Math.random()*-20}s;
    `;
    particlesCtn.appendChild(p);
  }
}

/* ── NAVBAR ─────────────────────────────────────────────────── */
const navbar   = document.getElementById('navbar');
const burger   = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
const navItems = document.querySelectorAll('.nav-item');

let lastScroll = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 60);
  if (y > lastScroll + 8 && y > 150) {
    navbar.classList.add('hidden');
  } else if (y < lastScroll - 4) {
    navbar.classList.remove('hidden');
  }
  lastScroll = y;
}, { passive: true });

burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

navLinks.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    navLinks.classList.remove('open');
    burger.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ── ACTIVE NAV on scroll ───────────────────────────────────── */
const sectionIds = ['accueil', 'univers', 'equipe', 'ressources', 'telechargements'];

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navItems.forEach(item => {
        item.classList.toggle('active', item.dataset.section === id);
      });
    }
  });
}, { rootMargin: `-${72}px 0px -45% 0px`, threshold: 0 });

sectionIds.forEach(id => {
  const el = document.getElementById(id);
  if (el) navObserver.observe(el);
});

/* ── SCROLL REVEAL ──────────────────────────────────────────── */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));
}

/* ── GLITCH TITLE hover burst ───────────────────────────────── */
const glitchTitle = document.querySelector('.glitch-title');
if (glitchTitle) {
  glitchTitle.addEventListener('mouseenter', () => {
    glitchTitle.style.animation =
      'title-shimmer 1s linear, glitch-main 0.4s steps(1) infinite';
    setTimeout(() => {
      glitchTitle.style.animation = '';
    }, 500);
  });
}

/* ── TEAM CARDS — tilt effect ───────────────────────────────── */
document.querySelectorAll('.team-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-8px) rotateY(${x*8}deg) rotateX(${-y*8}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease';
    setTimeout(() => { card.style.transition = ''; }, 500);
  });
});

/* ── GAMEPLAY CARDS — stagger reveal ───────────────────────── */
document.querySelectorAll('.gameplay-card').forEach((card, i) => {
  card.style.setProperty('--delay', `${i * 0.1}s`);
});

/* ── SMOOTH SCROLL for anchor links ─────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── DOWNLOAD BUTTONS — ripple effect ───────────────────────── */
document.querySelectorAll('.dl-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const ripple = document.createElement('span');
    const rect   = btn.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position:absolute;
      width:${size}px; height:${size}px;
      left:${e.clientX-rect.left-size/2}px;
      top:${e.clientY-rect.top-size/2}px;
      border-radius:50%;
      background:rgba(255,255,255,0.15);
      transform:scale(0);
      animation:ripple 0.6s ease;
      pointer-events:none;
    `;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Ripple keyframe
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to { transform: scale(2.5); opacity: 0; }
  }
`;
document.head.appendChild(style);

/* ── TYPING EFFECT for hero tag ─────────────────────────────── */
const heroTag = document.querySelector('.hero-tag');
if (heroTag) {
  const text   = heroTag.textContent;
  heroTag.textContent = '';
  let i = 0;
  const type = () => {
    if (i < text.length) {
      heroTag.textContent += text[i++];
      setTimeout(type, 60);
    }
  };
  setTimeout(type, 800);
}

console.log('%c ██████╗ ██████╗  ██████╗       ██████╗  ██████╗ ████████╗ ', 'color:#00f0ff;font-family:monospace;');
console.log('%c ██╔════╝██╔═══██╗██╔═══██╗      ██╔══██╗██╔═══██╗╚══██╔══╝ ', 'color:#00f0ff;font-family:monospace;');
console.log('%c ██║     ██║   ██║██║   ██║█████╗██████╔╝██║   ██║   ██║    ', 'color:#ff00c8;font-family:monospace;');
console.log('%c QUINTESSENCE GAMES – EPITA 2026 ', 'background:#00f0ff;color:#030810;font-family:monospace;font-weight:bold;padding:4px 12px;');
