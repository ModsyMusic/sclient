const express = require('express');
const cors = require('cors');
const path = require('path');
const { readDb, writeDb, generateLicenseKey } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// 1. General client information & stats
app.get('/api/info', (req, res) => {
  const db = readDb();
  res.json({
    name: 'Spectral Client',
    tagline: 'Spectral — абсолютное превосходство на CheatMine',
    version: db.stats.version,
    stats: db.stats,
    supportedVersions: ['1.12.2', '1.16.5', '1.18.2', '1.20.2', '1.20.4+'],
    cheatmineStatus: 'ONLINE (100% Bypassed)'
  });
});

// 2. Products list
app.get('/api/products', (req, res) => {
  const db = readDb();
  res.json(db.products);
});

// 3. Promo code check
app.post('/api/promo/validate', (req, res) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Промокод не указан' });
  }

  const db = readDb();
  const normalized = String(code).trim().toUpperCase();
  const promo = db.promos[normalized];

  if (promo && promo.active) {
    return res.json({
      valid: true,
      code: normalized,
      discountPercent: promo.discountPercent,
      message: `Скидка ${promo.discountPercent}% успешно применена!`
    });
  }

  return res.status(404).json({
    valid: false,
    error: 'Неверный или устаревший промокод'
  });
});

// 4. Create an order / purchase
app.post('/api/orders/create', (req, res) => {
  const { productId, email, nickname, promoCode, paymentMethod } = req.body;

  if (!productId || !email || !nickname) {
    return res.status(400).json({ error: 'Пожалуйста, заполните все обязательные поля' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Укажите корректный email адрес' });
  }

  const db = readDb();
  const product = db.products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({ error: 'Выбранный тариф не найден' });
  }

  let finalPrice = product.price;
  let appliedDiscount = 0;

  if (promoCode) {
    const promo = db.promos[String(promoCode).trim().toUpperCase()];
    if (promo && promo.active) {
      appliedDiscount = promo.discountPercent;
      finalPrice = Math.round(product.price * (1 - appliedDiscount / 100));
    }
  }

  const licenseKey = generateLicenseKey();
  const orderId = 'ORD-' + Date.now().toString(36).toUpperCase() + '-' + Math.floor(Math.random() * 900 + 100);
  const now = new Date();

  let expiresAt = null;
  if (product.durationDays > 0) {
    const exp = new Date(now.getTime() + product.durationDays * 24 * 60 * 60 * 1000);
    expiresAt = exp.toISOString();
  }

  const newLicense = {
    key: licenseKey,
    orderId,
    email: email.trim().toLowerCase(),
    nickname: nickname.trim(),
    productName: product.name,
    productId: product.id,
    createdAt: now.toISOString(),
    expiresAt,
    status: 'ACTIVE'
  };

  const newOrder = {
    orderId,
    productId: product.id,
    productName: product.name,
    finalPrice,
    originalPrice: product.price,
    discountPercent: appliedDiscount,
    email: email.trim().toLowerCase(),
    nickname: nickname.trim(),
    paymentMethod: paymentMethod || 'sbp',
    licenseKey,
    createdAt: now.toISOString(),
    status: 'COMPLETED'
  };

  db.orders.unshift(newOrder);
  db.licenses.unshift(newLicense);
  db.stats.totalPurchases += 1;
  writeDb(db);

  return res.json({
    success: true,
    message: 'Заказ успешно оплачен и активирован!',
    order: newOrder,
    license: {
      key: licenseKey,
      nickname: newLicense.nickname,
      productName: newLicense.productName,
      expiresAt: newLicense.expiresAt,
      downloadUrl: '/api/download/launcher?key=' + encodeURIComponent(licenseKey)
    }
  });
});

// 5. Verify license key
app.post('/api/license/verify', (req, res) => {
  const { key, email } = req.body;
  if (!key) {
    return res.status(400).json({ error: 'Введите лицензионный ключ' });
  }

  const db = readDb();
  const cleanKey = String(key).trim().toUpperCase();

  const license = db.licenses.find(l => {
    if (l.key.toUpperCase() !== cleanKey) return false;
    if (email && l.email.toLowerCase() !== String(email).trim().toLowerCase()) return false;
    return true;
  });

  if (!license) {
    return res.status(404).json({
      valid: false,
      error: 'Лицензия с таким ключом не найдена. Проверьте правильность ввода.'
    });
  }

  let isExpired = false;
  if (license.expiresAt) {
    if (new Date(license.expiresAt) < new Date()) {
      isExpired = true;
    }
  }

  return res.json({
    valid: !isExpired,
    license: {
      key: license.key,
      nickname: license.nickname,
      productName: license.productName,
      createdAt: license.createdAt,
      expiresAt: license.expiresAt,
      isLifetime: license.expiresAt === null,
      status: isExpired ? 'EXPIRED' : license.status,
      downloadUrl: '/api/download/launcher?key=' + encodeURIComponent(license.key)
    }
  });
});

// 6. Reviews
app.get('/api/reviews', (req, res) => {
  const db = readDb();
  res.json(db.reviews);
});

app.post('/api/reviews', (req, res) => {
  const { author, rating, text } = req.body;
  if (!author || !text || !rating) {
    return res.status(400).json({ error: 'Заполните автора, оценку и текст отзыва' });
  }

  const db = readDb();
  const newReview = {
    id: Date.now(),
    author: String(author).trim().slice(0, 32),
    rating: Math.max(1, Math.min(5, Number(rating))),
    date: 'Только что',
    text: String(text).trim().slice(0, 500)
  };

  db.reviews.unshift(newReview);
  writeDb(db);

  res.json({ success: true, review: newReview });
});

// 7. Download mock launcher
app.get('/api/download/launcher', (req, res) => {
  const { key } = req.query;
  const launcherContent = `===========================================
  SPECTRAL CLIENT v5.0 [CHEATMINE EDITION]
===========================================
Ваш ключ активации: ${key || 'DEMO-USER'}
Статус лицензии: АКТИВИРОВАНО
Сервер назначения: CheatMine (mc.cheatmine.ru)

Инструкция по установке:
1. Запустите SpectralLauncher.exe или поместите файл в .minecraft/versions
2. Запустите лаунчер и выберите профиль "Spectral Client [CheatMine]"
3. Введите ваш лицензионный ключ при первом запуске в игре
4. Клавиша Right Shift открывает ClickGUI со встроенным конфигом под CheatMine
5. По всем вопросам: t.me/spectralclient_tg или discord.gg/spectral
===========================================`;

  res.setHeader('Content-Disposition', 'attachment; filename="SpectralClient_CheatMine_v5.0.txt"');
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.send(launcherContent);
});

app.listen(PORT, () => {
  console.log(`Spectral Minecraft Client (CheatMine Edition) running at http://localhost:${PORT}`);
});
