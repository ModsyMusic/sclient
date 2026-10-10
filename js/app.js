// ==========================================================================
// SPECTRAL CLIENT — MEME CONTROLLER & RICH WEB AUDIO SOUND EFFECTS 🤣😂👍
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

let currentProducts = [];
let selectedPlanId = 'days-30';
let activeDiscount = 0;
let soundEnabled = true;

// Web Audio Context for zero-dependency meme synthesizer
let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function initApp() {
  initSpectralCanvas();
  initCursorSpotlight();
  initScrollReveal();
  initButtonRipples();
  initCardGlareTracking();
  initMemeSounds();
  initInteractivePunchHud();
  initSecretMemeModal();
  loadProductsAndPricing();
  loadInfoAndStats();
  loadReviews();
  setup3DHeroShowcase();
  setupClickGuiSimulator();
  setupCheckoutModal();
  setupLicenseVerification();
  setupReviewForm();
}

// --------------------------------------------------------------------------
// 1. Web Audio Meme Synthesizer Soundboard
// --------------------------------------------------------------------------
function playVineBoom() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Sub-bass 808 boom
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(25, now + 0.6);

    gain.gain.setValueAtTime(1.0, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    // Distortion
    const shaper = ctx.createWaveShaper();
    shaper.curve = makeDistortionCurve(50);

    osc.connect(shaper);
    shaper.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.75);
  } catch (e) {
    console.warn(e);
  }
}

function playPunchHit() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.18);

    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
  } catch (e) {}
}

function playCoinSound() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(987.77, now);
    osc1.frequency.setValueAtTime(1318.51, now + 0.08);

    osc2.frequency.setValueAtTime(987.77, now);
    osc2.frequency.setValueAtTime(1318.51, now + 0.08);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.36);
    osc2.stop(now + 0.36);
  } catch (e) {}
}

function playAirhorn() {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const freqs = [466.16, 466.16, 466.16, 466.16, 523.25, 466.16];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      gain.gain.setValueAtTime(0.25, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.07 + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.065);
    });
  } catch (e) {}
}

function makeDistortionCurve(amount) {
  const k = amount;
  const n_samples = 44100;
  const curve = new Float32Array(n_samples);
  const deg = Math.PI / 180;
  for (let i = 0; i < n_samples; ++i) {
    const x = (i * 2) / n_samples - 1;
    curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
  }
  return curve;
}

function spawnMemeReaction(x, y, text) {
  const el = document.createElement('div');
  el.className = 'flying-meme-reaction';
  el.textContent = text;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

// --------------------------------------------------------------------------
// 2. Meme Sounds Toggle & Secret Easter Egg
// --------------------------------------------------------------------------
function initMemeSounds() {
  const toggleBtn = document.getElementById('memeSoundToggle');
  const soundText = document.getElementById('soundStateText');
  const vineBtn = document.getElementById('vineBoomBtn');
  const laughBtn = document.getElementById('laughSoundBtn');

  toggleBtn?.addEventListener('click', (e) => {
    soundEnabled = !soundEnabled;
    if (soundText) {
      soundText.textContent = soundEnabled ? 'ВКЛ 🤣' : 'ВЫКЛ 🤫';
      soundText.className = soundEnabled ? 'text-emerald' : 'text-dim';
    }
    if (soundEnabled) {
      playCoinSound();
      showToast('Мемные звуки ВКЛЮЧЕНЫ! Нажимай на всё подряд 🤣👍', 'success');
    } else {
      showToast('Звуки выключены (режим тихого скуфа)', 'info');
    }
    spawnMemeReaction(e.clientX, e.clientY, soundEnabled ? '🔊 100%' : '🔇 0%');
  });

  vineBtn?.addEventListener('click', (e) => {
    playVineBoom();
    spawnMemeReaction(e.clientX, e.clientY, '💥 БАСУХА 🗿');
  });

  laughBtn?.addEventListener('click', (e) => {
    playAirhorn();
    spawnMemeReaction(e.clientX, e.clientY, '🤣 АДМИН ПЛАЧЕТ 🤡');
  });

  // Global click meme reaction generator
  document.addEventListener('click', (e) => {
    if (e.target.closest('button, a, .sim-module, .pricing-row-btn, #interactiveTargetHud')) {
      const memes = ['🗿', '🍷', '💀', '🤡', '🤣', '🔥', '+1000 Aura', 'ПОПУЩЕН 🧃', 'ГИГАЧАД 👍'];
      const chosen = memes[Math.floor(Math.random() * memes.length)];
      spawnMemeReaction(e.clientX, e.clientY, chosen);
    }
  });
}

// --------------------------------------------------------------------------
// 3. Punchable Interactive TargetHUD 🥊
// --------------------------------------------------------------------------
let targetHp = 14.8;
const targetNames = [
  'Донатер_На_Спавне 🤡',
  'Школьник_С_Луком 👶',
  'Клан_Лидер_Плакса 😭',
  'Админ_Под_Прикрытием 🕵️',
  'Скуф_Вася 🍺'
];

function initInteractivePunchHud() {
  const hud = document.getElementById('interactiveTargetHud');
  const fill = document.getElementById('targetHealthFill');
  const label = document.getElementById('targetHpLabel');
  const nameEl = document.getElementById('targetName');
  const emojiEl = document.getElementById('targetEmoji');

  if (!hud) return;

  hud.addEventListener('click', (e) => {
    playPunchHit();

    targetHp -= 3.5;
    if (targetHp <= 0) {
      playAirhorn();
      spawnMemeReaction(e.clientX, e.clientY, '💀 КИЛЛ! +1 ТОТЕМ');
      targetHp = 20.0;
      const nextName = targetNames[Math.floor(Math.random() * targetNames.length)];
      if (nameEl) nameEl.textContent = nextName;
      if (emojiEl) emojiEl.textContent = '☠️';
      setTimeout(() => { if (emojiEl) emojiEl.textContent = '🤡'; }, 500);
    } else {
      const dmg = (Math.random() * 2 + 3).toFixed(1);
      spawnMemeReaction(e.clientX, e.clientY, `💥 -${dmg} HP (CRIT 💀)`);
    }

    const pct = Math.max(5, (targetHp / 20) * 100);
    if (fill) fill.style.width = `${pct}%`;
    if (label) label.textContent = `${targetHp.toFixed(1)} / 20 ❤`;

    hud.style.transform = 'scale(0.95)';
    setTimeout(() => (hud.style.transform = 'scale(1)'), 100);
  });
}

// --------------------------------------------------------------------------
// 4. Secret Meme Easter Egg Modal 🎁
// --------------------------------------------------------------------------
function initSecretMemeModal() {
  const secretBtn = document.getElementById('memeSecretBtn');
  const modal = document.getElementById('secretMemeModal');
  const closeBtn = document.getElementById('closeSecretBtn');
  const claimBtn = document.getElementById('claimSecretBtn');

  if (!modal) return;

  secretBtn?.addEventListener('click', (e) => {
    playAirhorn();
    spawnMemeReaction(e.clientX, e.clientY, '🎉 СЕКРЕТКА 🗿');
    modal.showModal();
  });

  closeBtn?.addEventListener('click', () => modal.close());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.close();
  });

  claimBtn?.addEventListener('click', () => {
    modal.close();
    copyPromoCode('GIGACHAD');
    const prod = currentProducts.find((p) => p.id === 'days-30') || currentProducts[1];
    openCheckoutModal(prod);
    const promoInput = document.getElementById('orderPromo');
    if (promoInput) {
      promoInput.value = 'GIGACHAD';
      document.getElementById('applyPromoBtn')?.click();
    }
  });
}

// --------------------------------------------------------------------------
// 5. Interactive Spectral Canvas Particles
// --------------------------------------------------------------------------
function initSpectralCanvas() {
  const canvas = document.getElementById('spectralCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(65, Math.floor((width * height) / 18000));
  let mouse = { x: -1000, y: -1000, radius: 120 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2.2 + 0.8;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.alpha = Math.random() * 0.5 + 0.2;
      this.color = Math.random() > 0.5 ? '129, 140, 248' : '192, 132, 252';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouse.radius) {
        const force = (mouse.radius - distance) / mouse.radius;
        const directionX = (dx / distance) * force * 3;
        const directionY = (dy / distance) * force * 3;
        this.x -= directionX;
        this.y -= directionY;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `rgba(${this.color}, 0.5)`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 110) {
          const alpha = (1 - distance / 110) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(129, 140, 248, ${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    connectParticles();
    requestAnimationFrame(animate);
  }

  animate();
}

// --------------------------------------------------------------------------
// 6. Cursor Glow Spotlight Follower
// --------------------------------------------------------------------------
function initCursorSpotlight() {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let glowX = mouseX;
  let glowY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function renderGlow() {
    glowX += (mouseX - glowX) * 0.12;
    glowY += (mouseY - glowY) * 0.12;

    glow.style.left = `${glowX}px`;
    glow.style.top = `${glowY}px`;

    requestAnimationFrame(renderGlow);
  }

  renderGlow();
}

// --------------------------------------------------------------------------
// 7. Card Glare Reflection Tracking
// --------------------------------------------------------------------------
function initCardGlareTracking() {
  const cards = document.querySelectorAll(
    '.showcase-card, .magic-bento-card, .spotlight-card-visual, .verify-card-obsidian, .gui-sim-container, .modal-card'
  );

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  });
}

// --------------------------------------------------------------------------
// 8. Scroll Reveal Observer
// --------------------------------------------------------------------------
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  if (!('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
}

// --------------------------------------------------------------------------
// 9. Button Ripple Click Effect
// --------------------------------------------------------------------------
function initButtonRipples() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-ripple');
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple-wave';

    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
}

// --------------------------------------------------------------------------
// 10. Toast Notification Helper
// --------------------------------------------------------------------------
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const icon = type === 'success' ? '🗿' : type === 'error' ? '🤡' : '🤣';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// --------------------------------------------------------------------------
// 11. Load Live Stats & Info
// --------------------------------------------------------------------------
async function loadInfoAndStats() {
  try {
    const res = await fetch('/api/info');
    if (!res.ok) return;
    const data = await res.json();

    if (data.stats) {
      const onlineEl = document.getElementById('statOnline');
      const purchasesEl = document.getElementById('statPurchases');

      if (onlineEl) onlineEl.textContent = Number(data.stats.onlineUsers).toLocaleString('ru-RU');
      if (purchasesEl) purchasesEl.textContent = Number(data.stats.totalPurchases).toLocaleString('ru-RU') + '+';
    }
  } catch (err) {
    console.warn('Could not load server stats:', err);
  }
}

// --------------------------------------------------------------------------
// 12. Load Products & Interactive Pricing Switcher
// --------------------------------------------------------------------------
async function loadProductsAndPricing() {
  try {
    const res = await fetch('/api/products');
    if (!res.ok) throw new Error('Failed to load products');
    currentProducts = await res.json();
  } catch (err) {
    console.warn('Could not load products from API, using fallback data', err);
    currentProducts = [
      { id: 'days-7', name: '7 дней 👶', durationDays: 7, price: 199, originalPrice: null, perDay: '28 ₽ /день', discountPercent: null, features: ['Полный функционал Spectral Client', 'CheatMine Bypass: Combat & Movement', 'Все обновления на 7 дней', 'Поддержка 24/7'] },
      { id: 'days-30', name: '30 дней 🗿', durationDays: 30, price: 399, originalPrice: 999, perDay: '13 ₽ /день', discountPercent: 60, badge: 'Пак Гигачада 🗿', isPopular: true, features: ['Полный функционал Spectral Client', 'CheatMine Anarchy & Grief Auto-Bypass', 'Cloud Configs (лучшие сеты под CheatMine)', 'Все обновления включены', 'Приоритетная поддержка 24/7'] },
      { id: 'days-90', name: '90 дней 🍺', durationDays: 90, price: 799, originalPrice: 2890, perDay: '9 ₽ /день', discountPercent: 72, badge: '+1 ПК', features: ['Полный функционал + 1 доп. ПК', 'CheatMine Custom Rotations & Aura', 'Приватные макросы для грифа и фарма', 'Все обновления и хотфиксы', 'Приоритетный саппорт в Discord'] },
      { id: 'days-180', name: '180 дней 💀', durationDays: 180, price: 1199, originalPrice: 5490, perDay: '7 ₽ /день', discountPercent: 78, badge: '+2 ПК', features: ['Полный функционал + 2 доп. ПК', 'Полный набор всех CheatMine модулей', 'Ранний доступ к Beta-обновлениям', 'Персональные конфиги под топ-кланы', 'Приоритет в очереди тикетов'] },
      { id: 'lifetime', name: 'Навсегда 👑🍷', durationDays: -1, price: 1890, originalPrice: 4990, perDay: 'Вечный доступ', discountPercent: 62, badge: 'VIP CheatMine', features: ['Бессрочный доступ ко всем версиям Spectral', '100% гарантия обходов CheatMine навсегда', 'VIP статус в Discord и приватный чат', 'Кастомные анимированные плащи Spectral', 'Прямая связь с разработчиками 24/7'] }
    ];
  }

  setupPricingRowInteractivity();
  updatePricingDisplay(selectedPlanId);
}

function setupPricingRowInteractivity() {
  const rowButtons = document.querySelectorAll('.pricing-row-btn');
  const checkoutTrigger = document.getElementById('checkoutBtnTrigger');

  rowButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      playCoinSound();
      rowButtons.forEach((b) => {
        b.classList.remove('active');
        const bar = b.querySelector('.row-active-bar');
        if (bar) bar.remove();
      });

      btn.classList.add('active');
      const activeBar = document.createElement('span');
      activeBar.className = 'row-active-bar';
      btn.prepend(activeBar);

      selectedPlanId = btn.getAttribute('data-plan');
      updatePricingDisplay(selectedPlanId);
    });
  });

  checkoutTrigger?.addEventListener('click', () => {
    playCoinSound();
    const prod = currentProducts.find((p) => p.id === selectedPlanId) || currentProducts[1];
    openCheckoutModal(prod);
  });
}

function updatePricingDisplay(planId) {
  const product = currentProducts.find((p) => p.id === planId) || currentProducts[0];
  if (!product) return;

  const periodEl = document.getElementById('displayPlanPeriod');
  const oldPriceEl = document.getElementById('displayPlanOld');
  const discountEl = document.getElementById('displayPlanDiscount');
  const priceEl = document.getElementById('displayPlanPrice');
  const perDayEl = document.getElementById('displayPlanPerDay');
  const featuresListEl = document.getElementById('displayFeaturesList');

  if (periodEl) periodEl.textContent = `${product.name.toUpperCase()} (РАЗВАЛ НА CHEATMINE 🗿)`;

  if (oldPriceEl) {
    if (product.originalPrice) {
      oldPriceEl.textContent = `${product.originalPrice.toLocaleString('ru-RU')} ₽`;
      oldPriceEl.classList.remove('hidden');
    } else {
      oldPriceEl.classList.add('hidden');
    }
  }

  if (discountEl) {
    if (product.discountPercent) {
      discountEl.textContent = `−${product.discountPercent}%`;
      discountEl.classList.remove('hidden');
    } else {
      discountEl.classList.add('hidden');
    }
  }

  if (priceEl) {
    priceEl.textContent = `${product.price.toLocaleString('ru-RU')} ₽`;
    priceEl.style.transform = 'scale(0.93)';
    setTimeout(() => (priceEl.style.transform = 'scale(1)'), 150);
  }

  if (perDayEl) {
    perDayEl.textContent = product.perDay ? `~${product.perDay}` : '';
  }

  if (featuresListEl && product.features) {
    featuresListEl.innerHTML = product.features
      .map((f) => `<li><span class="bar-line"></span>${f}</li>`)
      .join('');
  }
}

// --------------------------------------------------------------------------
// 13. 3D Perspective Hero Cards Tilt
// --------------------------------------------------------------------------
function setup3DHeroShowcase() {
  const container = document.querySelector('.hero-showcase-perspective');
  const cardLeft = document.querySelector('.card-left');
  const cardCenter = document.querySelector('.card-center');
  const cardRight = document.querySelector('.card-right');

  if (!container || !cardCenter) return;

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = -(y / rect.height) * 12;
    const rotY = (x / rect.width) * 16;

    cardCenter.style.transform = `translateY(${rotX}px) scale(1.02) rotateX(${4 + rotX}deg) rotateY(${rotY}deg)`;
    if (cardLeft) {
      cardLeft.style.transform = `translateX(-20px) translateY(${rotX * 0.5}px) rotateY(${-8 + rotY}deg) rotate(-1deg)`;
    }
    if (cardRight) {
      cardRight.style.transform = `translateX(20px) translateY(${rotX * 0.5}px) rotateY(${8 + rotY}deg) rotate(1deg)`;
    }
  });

  container.addEventListener('mouseleave', () => {
    cardCenter.style.transform = 'translateY(0) scale(1) rotateX(4deg)';
    if (cardLeft) cardLeft.style.transform = 'translateX(-20px) rotateY(-8deg) rotate(-1deg)';
    if (cardRight) cardRight.style.transform = 'translateX(20px) rotateY(8deg) rotate(1deg)';
  });
}

// --------------------------------------------------------------------------
// 14. ClickGUI Simulator Interactivity
// --------------------------------------------------------------------------
function setupClickGuiSimulator() {
  const tabBtns = document.querySelectorAll('.gui-cat-btn');
  const tabPanes = document.querySelectorAll('.gui-tab-pane');
  const modules = document.querySelectorAll('.sim-module');
  const countEl = document.getElementById('activeModulesCount');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      playCoinSound();
      tabBtns.forEach((b) => b.classList.remove('active'));
      tabPanes.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      const targetTab = btn.getAttribute('data-tab');
      const targetPane = document.getElementById(`tab-${targetTab}`);
      if (targetPane) targetPane.classList.add('active');
    });
  });

  modules.forEach((mod) => {
    mod.addEventListener('click', () => {
      mod.classList.toggle('active');
      const modName = mod.querySelector('.sim-mod-name')?.textContent || 'Модуль';
      const isActive = mod.classList.contains('active');

      if (isActive) {
        playCoinSound();
        showToast(`${modName}: АКТИВИРОВАНО 🗿🔥`, 'success');
      } else {
        playPunchHit();
        showToast(`${modName}: ОТКЛЮЧЕНО 👍`, 'info');
      }
      updateActiveCount();
    });
  });

  function updateActiveCount() {
    const total = document.querySelectorAll('.sim-module.active').length;
    if (countEl) countEl.textContent = total;
  }
}

// --------------------------------------------------------------------------
// 15. Checkout Modal & Purchase Handling
// --------------------------------------------------------------------------
let checkoutCurrentProduct = null;

function setupCheckoutModal() {
  const dialog = document.getElementById('checkoutModal');
  const closeBtn = document.getElementById('closeCheckoutBtn');
  const applyPromoBtn = document.getElementById('applyPromoBtn');
  const promoInput = document.getElementById('orderPromo');
  const promoFeedback = document.getElementById('promoFeedback');
  const purchaseForm = document.getElementById('purchaseForm');
  const payOptions = document.querySelectorAll('.pay-option');
  const copyKeyBtn = document.getElementById('copyKeyBtn');
  const finishSuccessBtn = document.getElementById('finishSuccessBtn');

  if (!dialog) return;

  closeBtn?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
  finishSuccessBtn?.addEventListener('click', () => dialog.close());

  payOptions.forEach((opt) => {
    opt.addEventListener('click', () => {
      playCoinSound();
      payOptions.forEach((o) => o.classList.remove('selected'));
      opt.classList.add('selected');
    });
  });

  // Promo code validation
  applyPromoBtn?.addEventListener('click', async () => {
    const code = promoInput.value.trim().toUpperCase();
    if (!code) {
      promoFeedback.textContent = 'Введи промокод, братулёк 🤡';
      promoFeedback.className = 'promo-feedback error';
      return;
    }

    try {
      applyPromoBtn.disabled = true;
      applyPromoBtn.textContent = '...';

      const res = await fetch('/api/promo/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });

      const data = await res.json();
      if (res.ok && data.valid) {
        playAirhorn();
        activeDiscount = data.discountPercent;
        promoFeedback.textContent = `Красавчик! Скидка ${data.discountPercent}% применена 🗿🍷`;
        promoFeedback.className = 'promo-feedback success';
        updateModalPrices();
      } else {
        playPunchHit();
        activeDiscount = 0;
        promoFeedback.textContent = data.error || 'Такого промокода нет, админ не одобрил 🤡';
        promoFeedback.className = 'promo-feedback error';
        updateModalPrices();
      }
    } catch (err) {
      promoFeedback.textContent = 'Ошибка проверки';
      promoFeedback.className = 'promo-feedback error';
    } finally {
      applyPromoBtn.disabled = false;
      applyPromoBtn.textContent = 'Применить';
    }
  });

  // Purchase submission
  purchaseForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!checkoutCurrentProduct) return;

    const nickname = document.getElementById('orderNickname').value.trim();
    const email = document.getElementById('orderEmail').value.trim();
    const promoCode = promoInput.value.trim().toUpperCase();
    const selectedPayRadio = document.querySelector('input[name="paymentMethod"]:checked');
    const paymentMethod = selectedPayRadio ? selectedPayRadio.value : 'sbp';

    const payBtn = document.getElementById('paySubmitBtn');
    payBtn.disabled = true;
    payBtn.innerHTML = '<span>Обработка бабок... 💸</span>';

    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: checkoutCurrentProduct.id,
          nickname,
          email,
          promoCode,
          paymentMethod
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка при оформлении заказа');

      playAirhorn();
      document.getElementById('checkoutFormState').classList.add('hidden');
      const successState = document.getElementById('checkoutSuccessState');
      successState.classList.remove('hidden');

      document.getElementById('successNick').textContent = nickname;
      document.getElementById('successKeyDisplay').textContent = data.license.key;

      const dlBtn = document.getElementById('successDownloadBtn');
      if (dlBtn) dlBtn.href = data.license.downloadUrl;

      showToast('Бабки дошли! Лицензия готова, иди разваливать 🗿🍷', 'success');
      loadInfoAndStats();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      payBtn.disabled = false;
      payBtn.innerHTML = '<span>Оплатить и получить ключик 💸</span>';
    }
  });

  copyKeyBtn?.addEventListener('click', () => {
    playCoinSound();
    const key = document.getElementById('successKeyDisplay').textContent;
    navigator.clipboard.writeText(key).then(() => {
      showToast('Ключ скопирован! Не потеряй 👍', 'success');
      copyKeyBtn.textContent = 'Скопировано 🗿';
      setTimeout(() => (copyKeyBtn.textContent = 'Скопировать 📋'), 2000);
    });
  });
}

function openCheckoutModal(product) {
  checkoutCurrentProduct = product;
  activeDiscount = 0;

  const dialog = document.getElementById('checkoutModal');
  if (!dialog) return;

  document.getElementById('checkoutFormState').classList.remove('hidden');
  document.getElementById('checkoutSuccessState').classList.add('hidden');
  document.getElementById('orderProductId').value = product.id;
  document.getElementById('orderPromo').value = '';
  document.getElementById('promoFeedback').textContent = '';

  document.getElementById('modalPlanBadge').textContent = product.badge || 'Spectral Client 🗿';
  document.getElementById('modalPlanTitle').textContent = `Тариф: ${product.name}`;
  document.getElementById('modalPlanName').textContent = product.name;

  updateModalPrices();
  dialog.showModal();
}

function updateModalPrices() {
  if (!checkoutCurrentProduct) return;

  const original = checkoutCurrentProduct.price;
  let finalPrice = original;

  if (activeDiscount > 0) {
    finalPrice = Math.round(original * (1 - activeDiscount / 100));
  }

  const oldPriceEl = document.getElementById('modalOriginalPrice');
  const priceEl = document.getElementById('modalPrice');

  if (activeDiscount > 0) {
    oldPriceEl.textContent = `${original} ₽`;
    oldPriceEl.classList.remove('hidden');
  } else {
    oldPriceEl.classList.add('hidden');
  }

  priceEl.textContent = `${finalPrice} ₽`;
}

// --------------------------------------------------------------------------
// 16. License Verification
// --------------------------------------------------------------------------
function setupLicenseVerification() {
  const form = document.getElementById('verifyForm');
  const input = document.getElementById('verifyKeyInput');
  const resultDiv = document.getElementById('verifyResult');
  const btn = document.getElementById('verifyBtn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const key = input.value.trim().toUpperCase();
    if (!key) return;

    btn.disabled = true;
    btn.innerHTML = '<span>Чекаем... 🔍</span>';

    try {
      const res = await fetch('/api/license/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key })
      });

      const data = await res.json();
      resultDiv.classList.remove('hidden');

      if (res.ok && data.valid) {
        playAirhorn();
        const lic = data.license;
        const expiry = lic.isLifetime
          ? '<strong style="color: #34d399">Вечная (Гигачад Навсегда 👑)</strong>'
          : new Date(lic.expiresAt).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            });

        resultDiv.className = 'verify-result-box success';
        resultDiv.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <strong style="color: #34d399; font-size: 15px;">✓ Лицензия Активна (Админ плачет) 🗿</strong>
            <span style="font-family: var(--font-mono); font-size: 12px; color: var(--primary-300);">${lic.productName}</span>
          </div>
          <p style="margin-bottom: 6px; font-size: 13px;">Гигачад на CheatMine: <strong>${lic.nickname}</strong></p>
          <p style="margin-bottom: 14px; font-size: 13px;">Срок: ${expiry}</p>
          <a href="${lic.downloadUrl}" class="btn-primary-glow btn-sm btn-ripple" style="display: inline-flex;">
            <span>📥 Скачать лаунчер Spectral Client [CheatMine]</span>
          </a>
        `;
        showToast('Ключ валидный, добро пожаловать в семью 🗿🍷', 'success');
      } else {
        playPunchHit();
        resultDiv.className = 'verify-result-box error';
        resultDiv.innerHTML = `
          <strong>✕ Ключ не найден 🤡</strong>
          <p style="margin-top: 6px; font-size: 13px;">${data.error || 'Проверь буквы, братуха'}</p>
        `;
        showToast('Неверный ключ, не пытайся обмануть систему 🤣', 'error');
      }
    } catch (err) {
      resultDiv.className = 'verify-result-box error';
      resultDiv.innerHTML = `<p>Ошибка связи с сервером авторизации</p>`;
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<span>Проверить ключ 🔍</span>';
    }
  });
}

// --------------------------------------------------------------------------
// 17. Reviews
// --------------------------------------------------------------------------
async function loadReviews() {
  const container = document.getElementById('reviewsContainer');
  if (!container) return;

  try {
    const res = await fetch('/api/reviews');
    if (!res.ok) throw new Error('Failed to load reviews');
    const reviews = await res.json();

    container.innerHTML = '';
    reviews.forEach((rev) => {
      const item = document.createElement('div');
      item.className = 'review-item';

      const stars = '★'.repeat(rev.rating) + '☆'.repeat(5 - rev.rating);

      item.innerHTML = `
        <div class="review-top">
          <div>
            <div class="user-name">${escapeHtml(rev.author)}</div>
            <div class="review-date">${rev.date}</div>
          </div>
          <div class="stars">${stars}</div>
        </div>
        <p class="review-text">${escapeHtml(rev.text)}</p>
      `;

      container.appendChild(item);
    });
  } catch (err) {
    container.innerHTML = '<p style="color: var(--text-dim)">Не удалось загрузить отзывы.</p>';
  }
}

function setupReviewForm() {
  const form = document.getElementById('addReviewForm');
  const btn = document.getElementById('submitReviewBtn');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const author = document.getElementById('reviewAuthor').value.trim();
    const text = document.getElementById('reviewText').value.trim();
    const ratingRadio = document.querySelector('input[name="rating"]:checked');
    const rating = ratingRadio ? ratingRadio.value : 5;

    if (!author || !text) return;

    btn.disabled = true;
    btn.innerHTML = '<span>Публикация... 🚀</span>';

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, rating, text })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Ошибка при публикации');

      playAirhorn();
      showToast('Отзыв опубликован! Респект от Гигачадов 🗿👍', 'success');
      form.reset();
      loadReviews();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<span>Запостить отзыв 🚀</span>';
    }
  });
}

// --------------------------------------------------------------------------
// 18. Global Helpers
// --------------------------------------------------------------------------
window.fillDemoKey = function () {
  playCoinSound();
  const keyInput = document.getElementById('verifyKeyInput');
  if (keyInput) {
    keyInput.value = 'SPECTRAL-DEMO-2026-PASS';
    showToast('Тестовый ключ подставлен! Жми кнопку 🔑', 'info');
  }
};

window.copyPromoCode = function (code) {
  playCoinSound();
  navigator.clipboard.writeText(code).then(() => {
    showToast(`Промокод "${code}" скопирован! Примени его при покупке 💸`, 'success');
  });
};

function escapeHtml(string) {
  const div = document.createElement('div');
  div.textContent = string;
  return div.innerHTML;
}
