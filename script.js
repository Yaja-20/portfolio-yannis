/* ================================
   Portfolio Yannis — script.js (clean)
   ================================ */

/* -------- Helpers -------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* -------- 1) Typewriter (optionnel) -------- */
(function typewriterInit() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const text = el.textContent.trim() || "Chaque ligne de code est un pas vers l’avenir";
  el.textContent = '';
  let i = 0;
  const tick = () => {
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(tick, 90);
    }
  };
  tick();
})();

/* -------- 2) Thème clair/sombre (persistant) -------- */
(function themeInit() {
  const btn = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const KEY = 'theme';
  const pref = localStorage.getItem(KEY) ||
               (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  setTheme(pref);

  function setTheme(mode) {
    if (mode === 'dark') {
      root.classList.add('dark');      
      document.body.classList.add('dark-mode'); // compat avec ancien CSS
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem(KEY, mode);
  }

  btn?.addEventListener('click', () => {
    const next = (root.classList.contains('dark') || document.body.classList.contains('dark-mode')) ? 'light' : 'dark';
    setTheme(next);
  });
})();

/* -------- 3) Révélations au scroll (cards, sections…) -------- */
(function revealOnScroll() {
  const targets = [
    ...$$('.card'),
    ...$$('.capabilities-grid li'),
    ...$$('.process-steps li'),
    ...$$('.quote')
  ];
  if (!targets.length) return;

  // état initial
  targets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(14px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) {
        target.style.opacity = '1';
        target.style.transform = 'translateY(0)';
        io.unobserve(target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach(el => io.observe(el));
})();

/* -------- 4) Contact (Formspree) + Toast -------- */
function showToast(msg = 'Action réussie !') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// Si tu gardes l’attribut onsubmit="return handleSubmit(event)" sur le <form>, cette fonction sera appelée.
function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;

  fetch(form.action, {
    method: 'POST',
    body: new FormData(form),
    headers: { Accept: 'application/json' }
  }).then(res => {
    if (res.ok) {
      // Option A : page de remerciement (si tu as merci.html)
      window.location.href = 'merci.html';
      // Option B (sinon) : Toast + reset
      // showToast('Message envoyé. Merci !');
      // form.reset();
    } else {
      alert('Une erreur est survenue. Veuillez réessayer.');
    }
  }).catch(() => alert('Impossible de contacter le serveur. Réessaie plus tard.'));

  return false;
}

/* -------- 5) Calculatrice (si présente sur /lab) -------- */
let currentOperand = "";
let previousOperand = "";
let operation = null;

function updateDisplay() {
  const res = document.getElementById('result');
  if (res) res.value = currentOperand;
}

function addToHistory(operationTxt, result) {
  const history = document.getElementById('history');
  if (!history) return;
  const entry = document.createElement('div');
  entry.textContent = `${operationTxt} = ${result}`;
  history.prepend(entry);
}

function appendNumber(number) {
  currentOperand += number;
  updateDisplay();
}

function chooseOperation(op) {
  if (currentOperand === "") return;
  if (previousOperand !== "") computeResult();
  operation = op;
  previousOperand = currentOperand;
  currentOperand = "";
}

function clearResult() {
  currentOperand = "";
  previousOperand = "";
  operation = null;
  updateDisplay();
}

function computeResult() {
  const prev = parseFloat(previousOperand);
  const curr = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(curr)) return;

  let computation;
  switch (operation) {
    case "+": computation = prev + curr; break;
    case "-": computation = prev - curr; break;
    case "*": computation = prev * curr; break;
    case "/": computation = prev / curr; break;
    default: return;
  }

  addToHistory(`${prev} ${operation} ${curr}`, computation);
  currentOperand = computation.toString();
  operation = null;
  previousOperand = "";
  updateDisplay();

  const resultInput = document.getElementById('result');
  if (resultInput) {
    resultInput.classList.add('animate-result');
    setTimeout(() => resultInput.classList.remove('animate-result'), 300);
  }
}

function computeSquare() {
  if (currentOperand === "" || isNaN(parseFloat(currentOperand))) return;
  const result = (parseFloat(currentOperand) ** 2).toString();
  addToHistory(`${currentOperand}²`, result);
  currentOperand = result;
  updateDisplay();
}

function computeSquareRoot() {
  if (currentOperand === "" || isNaN(parseFloat(currentOperand))) return;
  const result = Math.sqrt(parseFloat(currentOperand)).toString();
  addToHistory(`√${currentOperand}`, result);
  currentOperand = result;
  updateDisplay();
}

function exportHistory() {
  const historyEl = document.getElementById('history');
  if (!historyEl) return;
  const history = historyEl.innerText || '';
  const blob = new Blob([history], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'historique_calculs.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Historique exporté avec succès !');
}

/* -------- 6) Timeline (si présente sur /about) -------- */
(function timelineReveal() {
  const events = $$('.event');
  if (!events.length) return;
  const onScroll = () => {
    events.forEach(ev => {
      const rect = ev.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) ev.classList.add('visible');
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* -------- 7) Compte à rebours (Signal Perdu — si présent) -------- */
(function countdownInit() {
  const countdownElement = document.getElementById('countdown');
  if (!countdownElement) return;

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 8);

  function updateCountdown() {
    const now = new Date();
    const timeLeft = targetDate - now;
    if (timeLeft <= 0) {
      countdownElement.textContent = "disponible très bientôt !";
      return;
    }
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);
    countdownElement.textContent = `${days}j ${hours}h ${minutes}m ${seconds}s`;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
})();

/* -------- 8) Log -------- */
document.addEventListener('DOMContentLoaded', () => {
  console.log('JS prêt — portfolio Yannis.');
});
/* ====== Carousel logic (Option B: auto-height, robust) ====== */
(function carouselInit () {
  const root = document.querySelector('.carousel');
  if (!root) return;

  const track   = root.querySelector('.carousel-track');
  const slides  = Array.from(root.querySelectorAll('.slide'));
  const prevBtn = root.querySelector('.prev');
  const nextBtn = root.querySelector('.next');
  const dots    = Array.from(root.querySelectorAll('.dot'));

  let index = 0;
  let ro = null; // ResizeObserver sur la carte courante

  function setAutoHeight () {
    const currentCard = root.querySelector('.slide.is-current .slide-card');
    if (!currentCard) return;
    requestAnimationFrame(() => {
      const h = currentCard.getBoundingClientRect().height;
      track.style.height = (h + 8) + 'px';
    });
  }

  function observeCurrent () {
    const currentCard = root.querySelector('.slide.is-current .slide-card');
    if (!currentCard) return;
    if (ro) ro.disconnect();
    ro = new ResizeObserver(setAutoHeight);
    ro.observe(currentCard);
  }

  function scrollToIndex (i, smooth = true) {
    const offset = i * track.clientWidth;
    track.scrollTo({ left: offset, behavior: smooth ? 'smooth' : 'auto' });
  }

  function update (newIndex) {
    index = (newIndex + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('is-current', i === index));
    dots.forEach((d, i)   => d.classList.toggle('is-active', i === index));
    scrollToIndex(index, true);
    setTimeout(() => { setAutoHeight(); observeCurrent(); }, 50);
  }

  window.__carouselUpdate = update;

  /* --- Contrôles --- */
  prevBtn?.addEventListener('click', () => update(index - 1));
  nextBtn?.addEventListener('click', () => update(index + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => update(i)));

  // Clavier
  root.tabIndex = 0;
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') update(index + 1);
    if (e.key === 'ArrowLeft')  update(index - 1);
  });

  // Swipe (pointer events)
  let startX = 0, dx = 0, touching = false, pid = null;
  track.addEventListener('pointerdown', (e) => {
    touching = true; startX = e.clientX; pid = e.pointerId;
    track.setPointerCapture(pid);
  });
  track.addEventListener('pointermove', (e) => {
    if (!touching) return;
    dx = e.clientX - startX;
  });
  track.addEventListener('pointerup', () => {
    touching = false;
    if (Math.abs(dx) > 40) update(index + (dx < 0 ? 1 : -1));
    dx = 0;
    if (pid) { try { track.releasePointerCapture(pid); } catch {} pid = null; }
  });

  // Resize → réaligner & recalculer la hauteur
  let resizeId;
  window.addEventListener('resize', () => {
    clearTimeout(resizeId);
    resizeId = setTimeout(() => {
      scrollToIndex(index, false); // réaligne sans animation
      setAutoHeight();
    }, 120);
  });

  // Init
  update(0);

  // Sécurité : images qui chargent après coup
  window.addEventListener('load', setAutoHeight);
  slides.forEach(slide => {
    slide.querySelectorAll('img').forEach(img => {
      img.addEventListener('load', setAutoHeight);
    });
  });

  // Empêche le swipe d'intercepter les clics sur les boutons des slides
  root.querySelectorAll('.slide-actions a').forEach(a => {
    a.addEventListener('pointerdown', e => e.stopPropagation());
  });
})();
function scrollToIndex (i, smooth = true) {
  // largeur visible du carrousel (incluant le padding éventuel)
  const slideWidth = root.clientWidth;
  const offset = i * slideWidth;
  track.scrollTo({ left: offset, behavior: smooth ? 'smooth' : 'auto' });
}