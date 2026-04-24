/* ═══════════════════════════════════════════════════════
   POUR TOI 💕 — Script principal
   Fonctionne sur toutes les pages (hero + sous-pages)
   ═══════════════════════════════════════════════════════ */


/* ─────────────────────────────────────
   CARROUSEL (uniquement sur la page d'accueil)
   ───────────────────────────────────── */
const track = document.getElementById('carouselTrack');

if (track) {
  const slides = track.querySelectorAll('.carousel-slide');
  const dotsContainer = document.getElementById('carouselDots');
  const pillsContainer = document.getElementById('carouselPills');

  const slideNames = ['💕 Pour toi', '🌸 Moments', '💌 Secret', '🧠 Memory', '🔮 Capsule', '🎰 Cash', '🎨 Coloriage'];
  let current = 0;
  let autoplay;

  // Génération des dots et pilules de navigation
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.onclick = () => goTo(i);
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dotsContainer.appendChild(dot);

    const pill = document.createElement('button');
    pill.className = 'carousel-pill' + (i === 0 ? ' active' : '');
    pill.textContent = slideNames[i];
    pill.onclick = () => goTo(i);
    pillsContainer.appendChild(pill);
  });

  function goTo(index) {
    current = index;
    track.style.transform = `translateX(-${current * 100}%)`;

    dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) =>
      d.classList.toggle('active', i === current)
    );
    pillsContainer.querySelectorAll('.carousel-pill').forEach((p, i) =>
      p.classList.toggle('active', i === current)
    );
    resetAutoplay();
  }

  window.nextSlide = function () { goTo((current + 1) % slides.length); };
  window.prevSlide = function () { goTo((current - 1 + slides.length) % slides.length); };

  function resetAutoplay() {
    clearInterval(autoplay);
    autoplay = setInterval(window.nextSlide, 5500);
  }
  resetAutoplay();

  // Swipe tactile
  let touchX = null;
  const container = document.querySelector('.carousel-container');

  container.addEventListener('touchstart', (e) => {
    touchX = e.touches[0].clientX;
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? window.nextSlide() : window.prevSlide();
    }
    touchX = null;
  }, { passive: true });

  // Navigation clavier
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') window.nextSlide();
    if (e.key === 'ArrowLeft') window.prevSlide();
  });
}


/* ─────────────────────────────────────
   COUNTDOWN — Compte à rebours dynamique
   ───────────────────────────────────── */
const cdDays = document.getElementById('cdDays');
const cdHours = document.getElementById('cdHours');
const cdMins = document.getElementById('cdMins');
const cdSecs = document.getElementById('cdSecs');

if (cdDays) {
  // ════════════════════════════════════════════
  // 🎯 MODIFIE CETTE DATE pour changer l'objectif
  // Format : année, mois (0-indexé!), jour, heure, minute
  // Mois : 0=Jan, 1=Fev, 2=Mars, 3=Avril...
  // ════════════════════════════════════════════
  const TARGET_DATE = new Date(2026, 3, 28, 0, 0, 0); // 28 avril 2026

  let prevValues = { d: '', h: '', m: '', s: '' };

  function tickAnimation(el, newVal) {
    if (el.textContent !== newVal) {
      el.classList.add('tick');
      setTimeout(() => el.classList.remove('tick'), 300);
    }
  }

  function updateCountdown() {
    const now = new Date();
    const diff = TARGET_DATE - now;

    if (diff <= 0) {
      // Le jour est arrivé !
      cdDays.textContent = '🎉';
      cdHours.textContent = '';
      cdMins.textContent = '';
      cdSecs.textContent = '';
      const label = document.querySelector('.countdown-label');
      if (label) label.textContent = '💕 Joyeux 4 mois !';
      const sep = document.querySelectorAll('.countdown-sep');
      sep.forEach(s => s.style.display = 'none');

      // 🎉 Confettis à chaque visite !
      launchCountdownConfetti();
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    const dStr = String(days).padStart(2, '0');
    const hStr = String(hours).padStart(2, '0');
    const mStr = String(mins).padStart(2, '0');
    const sStr = String(secs).padStart(2, '0');

    tickAnimation(cdDays, dStr);
    tickAnimation(cdHours, hStr);
    tickAnimation(cdMins, mStr);
    tickAnimation(cdSecs, sStr);

    cdDays.textContent = dStr;
    cdHours.textContent = hStr;
    cdMins.textContent = mStr;
    cdSecs.textContent = sStr;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

/* ─────────────────────────────────────
   CONFETTIS COUNTDOWN — Se lance quand le compte à rebours est à 0
   ───────────────────────────────────── */
function launchCountdownConfetti() {
  const container = document.querySelector('.hero') || document.body;
  const emojis = ['💖', '💕', '✨', '🌸', '♡', '💗', '🩷', '🎉', '🥳', '🎊'];

  for (let i = 0; i < 40; i++) {
    setTimeout(() => {
      const c = document.createElement('span');
      c.className = 'confetti';
      c.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      c.style.left = Math.random() * 100 + '%';
      c.style.setProperty('--fall-duration', (2.5 + Math.random() * 3.5) + 's');
      c.style.setProperty('--sway', (Math.random() > 0.5 ? '' : '-') + (20 + Math.random() * 80) + 'px');
      container.appendChild(c);
      setTimeout(() => c.remove(), 6000);
    }, i * 70);
  }
}


/* ─────────────────────────────────────
   NOTIFICATION — Popup message
   ───────────────────────────────────── */
function openNotifPopup() {
  const overlay = document.getElementById('notifOverlay');
  if (overlay) {
    overlay.classList.add('active');
    // Masquer la notification après ouverture
    const bubble = document.getElementById('notifBubble');
    if (bubble) bubble.classList.add('notif-read');
  }
}

function closeNotifPopup(e, forceClose) {
  const overlay = document.getElementById('notifOverlay');
  const popup = document.getElementById('notifPopup');
  // Fermer si on clique en dehors ou sur le bouton X
  if (forceClose || e.target === overlay) {
    overlay.classList.remove('active');
  }
}


/* ─────────────────────────────────────
   COEURS FLOTTANTS (toutes les pages)
   ───────────────────────────────────── */
const heartsBox = document.getElementById('heartsContainer');

if (heartsBox) {
  const heartSymbols = ['♥', '♡', '❤', '💕', '🤍'];

  for (let i = 0; i < 14; i++) {
    const h = document.createElement('span');
    h.className = 'floating-heart';
    h.textContent = heartSymbols[i % heartSymbols.length];

    h.style.setProperty('--delay', `${i * 1.6 + Math.random() * 2}s`);
    h.style.setProperty('--dur', `${6 + Math.random() * 5}s`);
    h.style.setProperty('--size', `${10 + Math.random() * 16}px`);
    h.style.setProperty('--rot', `${Math.random() > 0.5 ? '' : '-'}${120 + Math.random() * 180}deg`);
    h.style.left = `${Math.random() * 100}%`;

    heartsBox.appendChild(h);
  }
}


/* ─────────────────────────────────────
   SCROLL REVEAL (toutes les pages)
   ───────────────────────────────────── */
const revealTargets = document.querySelectorAll('#messageCard, #momentsMessage');

if (revealTargets.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.3 }
  );

  revealTargets.forEach((el) => observer.observe(el));
}


/* ─────────────────────────────────────
   CARROUSELS COVERFLOW (multiple instances)
   Fonctionne pour N carrousels sur la même page
   ───────────────────────────────────── */
document.querySelectorAll('.coverflow-wrapper').forEach((wrapper) => {
  const cfTrack = wrapper.querySelector('.coverflow-track');
  const cfItems = cfTrack.querySelectorAll('.coverflow-item');
  const cfDotsContainer = wrapper.querySelector('.coverflow-dots');
  const cfPrev = wrapper.querySelector('.coverflow-prev');
  const cfNext = wrapper.querySelector('.coverflow-next');
  const cfViewport = wrapper.querySelector('.coverflow-viewport');
  let current = 0;
  const total = cfItems.length;

  // Générer les dots
  cfItems.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'coverflow-dot' + (i === 0 ? ' active' : '');
    dot.onclick = () => goTo(i);
    dot.setAttribute('aria-label', `Image ${i + 1}`);
    cfDotsContainer.appendChild(dot);
  });

  function update() {
    cfItems.forEach((item, i) => {
      const offset = i - current;
      if (offset >= -2 && offset <= 2) {
        item.setAttribute('data-pos', offset.toString());
      } else {
        item.setAttribute('data-pos', 'hidden');
      }
    });
    cfDotsContainer.querySelectorAll('.coverflow-dot').forEach((d, i) =>
      d.classList.toggle('active', i === current)
    );
  }

  function goTo(index) {
    current = ((index % total) + total) % total;
    update();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  cfPrev.onclick = prev;
  cfNext.onclick = next;

  // Clic sur image secondaire
  cfItems.forEach((item, i) => {
    item.addEventListener('click', () => { if (i !== current) goTo(i); });
  });

  // Swipe
  let touchX = null;
  cfViewport.addEventListener('touchstart', (e) => {
    touchX = e.touches[0].clientX;
  }, { passive: true });
  cfViewport.addEventListener('touchend', (e) => {
    if (touchX === null) return;
    const diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    touchX = null;
  }, { passive: true });

  update();
});


/* ─────────────────────────────────────
   SCROLL REVEAL — Blocs mémoire timeline
   ───────────────────────────────────── */
const memoryBlocks = document.querySelectorAll('.memory-reveal');

if (memoryBlocks.length > 0) {
  const memoryObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );

  memoryBlocks.forEach((block) => memoryObserver.observe(block));
}
