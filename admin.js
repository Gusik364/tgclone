const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const Gift = require("./models/Gift");
const UserGift = require("./models/UserGift");
const User = require("./models/User");
const StickerPack = require("./models/StickerPack");
const EmojiPack = require("./models/EmojiPack");

const router = express.Router();

// Настройка multer для загрузки стикеров
const stickersDir = path.join(__dirname, "uploads", "stickers");
if (!fs.existsSync(stickersDir)) {
  fs.mkdirSync(stickersDir, { recursive: true });
}

const stickerStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, stickersDir),
  filename: (req, file, cb) => {
    const uniqueName = crypto.randomBytes(16).toString("hex") + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const uploadStickers = multer({
  storage: stickerStorage,
  fileFilter: (req, file, cb) => {
    const allowed = [".tgs", ".webp", ".webm", ".png", ".gif"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Неподдерживаемый формат файла"));
    }
  }
});
  
const ADMIN_CODE = "Test";

// Middleware проверки авторизации админа
const checkAdmin = (req, res, next) => {
  if (req.cookies.adminAuth === ADMIN_CODE) {
    return next();  
  }
  res.redirect("/admin/login");
};

// Страница логина
router.get("/login", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Вход в админку</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .login-box {
          background: white;
          padding: 40px;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          width: 100%;
          max-width: 400px;
        }
        h1 { text-align: center; margin-bottom: 30px; color: #333; }
        input {
          width: 100%;
          padding: 15px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 16px;
          margin-bottom: 20px;
          transition: border-color 0.3s;
        }
        input:focus { outline: none; border-color: #667eea; }
        button {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        button:hover { transform: translateY(-2px); box-shadow: 0 5px 20px rgba(102,126,234,0.4); }
      </style>
    </head>
    <body>
      <div class="login-box">
        <h1>🔐 Админ панель</h1>
        <form method="POST" action="/admin/login">
          <input type="password" name="code" placeholder="Введите код" required>
          <button type="submit">Войти</button>
        </form>
      </div>
    </body>
    </html>
  `);
});

// Обработка логина
router.post("/login", express.urlencoded({ extended: true }), (req, res) => {
  if (req.body.code === ADMIN_CODE) {
    res.cookie("adminAuth", ADMIN_CODE, { httpOnly: true });
    res.redirect("/admin");
  } else {
    res.send(`
      <!DOCTYPE html>
      <html><head><title>Ошибка</title></head>
      <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #f5f5f5;">
        <div style="text-align: center;">
          <h1 style="color: #e74c3c;">❌ Неверный код</h1>
          <a href="/admin/login" style="color: #667eea;">Попробовать снова</a>
        </div>
      </body></html>
    `);
  }
});

// Выход
router.get("/logout", (req, res) => {
  res.clearCookie("adminAuth");
  res.redirect("/admin/login");
});


// Главная страница админки
router.get("/", checkAdmin, async (req, res) => {
  const gifts = await Gift.find().sort({ createdAt: -1 });
  const users = await User.find({}, { _id: 1, username: 1, name: 1 });
  
  res.send(`
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Админ панель подарков</title>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js"></script>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #f0f2f5;
          min-height: 100vh;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .header h1 { font-size: 24px; }
        .logout-btn {
          background: rgba(255,255,255,0.2);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          text-decoration: none;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 30px; }
        .tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
        }
        .tab {
          padding: 12px 24px;
          background: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s;
        }
        .tab.active { background: #667eea; color: white; }
        .tab:hover:not(.active) { background: #e0e0e0; }
        .panel { display: none; }
        .panel.active { display: block; }
        .card {
          background: white;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          margin-bottom: 30px;
        }
        .card h2 { margin-bottom: 20px; color: #333; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; font-weight: 600; color: #555; }
        .form-group input, .form-group select {
          width: 100%;
          padding: 12px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
        }
        .form-group input:focus, .form-group select:focus { outline: none; border-color: #667eea; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }
        .btn-primary { background: #667eea; color: white; }
        .btn-primary:hover { background: #5a6fd6; }
        .btn-danger { background: #e74c3c; color: white; }
        .btn-danger:hover { background: #c0392b; }
        .gifts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }
        .gift-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .gift-preview {
          width: 80px;
          height: 80px;
          margin: 0 auto 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 50px;
        }
        .loading-spinner {
          width: 30px;
          height: 30px;
          border: 3px solid #e0e0e0;
          border-top-color: #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
          margin: 0 auto 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 50px;
        }
        .gift-name { font-weight: 600; margin-bottom: 5px; }
        .gift-price { color: #667eea; font-weight: 600; }
        .gift-stats { font-size: 12px; color: #888; margin-top: 10px; }
        .gift-actions { margin-top: 15px; display: flex; gap: 10px; justify-content: center; }
        .gift-actions button { padding: 8px 12px; font-size: 12px; }
        .preview-box {
          width: 120px;
          height: 120px;
          border: 2px dashed #e0e0e0;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 20px auto;
          font-size: 60px;
          background: #f9f9f9;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎁 Админ панель подарков</h1>
        <a href="/admin/logout" class="logout-btn">Выйти</a>
      </div>
      
      <div class="container">
        <div class="tabs">
          <button class="tab active" onclick="showPanel('gifts')">📦 Подарки</button>
          <button class="tab" onclick="showPanel('create')">➕ Создать</button>
          <button class="tab" onclick="showPanel('upgrade')">✨ Upgrade NFT</button>
          <button class="tab" onclick="showPanel('send')">🎁 Отправить</button>
          <button class="tab" onclick="showPanel('stars')">⭐ Выдать звёзды</button>
          <button class="tab" onclick="showPanel('stickers')">😀 Стикеры</button>
          <button class="tab" onclick="showPanel('emoji')">✨ Premium Emoji</button>
          <button class="tab" onclick="showPanel('users')">👥 Пользователи</button>
        </div>

        <!-- Список подарков -->
        <div id="gifts-panel" class="panel active">
          <div class="card">
            <h2>Все подарки</h2>
            <div class="gifts-grid">
              ${gifts.map(g => `
                <div class="gift-card" data-gift-id="${g._id}" data-animation-type="${g.animationType}" data-animation-url="${g.animationUrl || ''}" data-tgs-url="${g.tgsUrl || ''}" data-emoji="${g.emoji || '🎁'}">
                  <div class="gift-preview" id="preview-${g._id}">
                    <div class="loading-spinner"></div>
                  </div>
                  <div class="gift-name">${g.name}</div>
                  <div class="gift-price">⭐ ${g.price}</div>
                  <div class="gift-stats">
                    Продано: ${g.soldCount}${g.totalSupply ? '/' + g.totalSupply : ''}
                  </div>
                  <div class="gift-type" style="font-size:11px;color:#888;margin-top:5px;">
                    ${g.animationType.toUpperCase()}
                    ${g.canUpgrade ? '<span style="color:#9b59b6;margin-left:5px;">✨ NFT</span>' : ''}
                  </div>
                  <div class="gift-actions">
                    <button class="btn btn-danger" onclick="deleteGift('${g._id}')">Удалить</button>
                  </div>
                </div>
              `).join('')}
            </div>
            ${gifts.length === 0 ? '<p style="text-align:center;color:#888;">Подарков пока нет</p>' : ''}
          </div>
        </div>

        <!-- Создать подарок -->
        <div id="create-panel" class="panel">
          <div class="card">
            <h2>Создать новый подарок</h2>
            <form id="createForm">
              <div class="form-row">
                <div class="form-group">
                  <label>Название</label>
                  <input type="text" name="name" required placeholder="Сердце">
                </div>
                <div class="form-group">
                  <label>Цена (звёзды)</label>
                  <input type="number" name="price" required min="1" placeholder="50">
                </div>
              </div>
              
              <div class="form-group">
                <label>Тип анимации</label>
                <select name="animationType" onchange="toggleAnimationFields(this.value)">
                  <option value="emoji">Эмодзи</option>
                  <option value="lottie">Lottie JSON</option>
                  <option value="gif">GIF</option>
                  <option value="tgs">TGS (Telegram Sticker)</option>
                </select>
              </div>

              <div id="emoji-field" class="form-group">
                <label>Эмодзи</label>
                <input type="text" name="emoji" placeholder="❤️">
              </div>

              <div id="animation-field" class="form-group" style="display:none;">
                <label>URL анимации (.json или .gif)</label>
                <input type="text" name="animationUrl" placeholder="https://example.com/animation.json">
              </div>

              <div id="tgs-field" class="form-group" style="display:none;">
                <label>URL TGS файла (.tgs)</label>
                <input type="text" name="tgsUrl" placeholder="https://cdn.changes.tg/gifts/originals/.../Original.tgs">
              </div>

              <div class="preview-box" id="create-preview">🎁</div>

              <div class="form-row">
                <div class="form-group">
                  <label>Всего (пусто = безлимит)</label>
                  <input type="number" name="totalSupply" min="1" placeholder="1000">
                </div>
                <div class="form-group">
                  <label>Курс конвертации (0-1)</label>
                  <input type="number" name="convertRate" step="0.01" min="0" max="1" value="0.85">
                </div>
              </div>

              <button type="submit" class="btn btn-primary">Создать подарок</button>
            </form>
          </div>
        </div>

        <!-- Отправить подарок -->
        <div id="send-panel" class="panel">
          <div class="card">
            <h2>Отправить подарок пользователю</h2>
            <form id="sendForm">
              <div class="form-group">
                <label>Выберите подарок</label>
                <select name="giftId" required>
                  <option value="">-- Выбрать --</option>
                  ${gifts.map(g => `<option value="${g._id}">${g.emoji || '🎁'} ${g.name} (⭐${g.price})</option>`).join('')}
                </select>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>От пользователя</label>
                  <select name="fromUserId" required>
                    <option value="">-- Выбрать --</option>
                    ${users.map(u => `<option value="${u._id}">${u.name} (@${u.username})</option>`).join('')}
                  </select>
                </div>
                <div class="form-group">
                  <label>Кому</label>
                  <select name="toUserId" required>
                    <option value="">-- Выбрать --</option>
                    ${users.map(u => `<option value="${u._id}">${u.name} (@${u.username})</option>`).join('')}
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label>Сообщение (необязательно)</label>
                <input type="text" name="message" placeholder="С днём рождения!">
              </div>
              <button type="submit" class="btn btn-primary">Отправить подарок</button>
            </form>
          </div>
        </div>

        <!-- Upgrade NFT настройки -->
        <div id="upgrade-panel" class="panel">
          <div class="card">
            <h2>✨ Настройки Upgrade для подарков</h2>
            <p style="color:#666;margin-bottom:20px;">Выберите подарок и настройте возможность улучшения до NFT с уникальными атрибутами.</p>
            
            <form id="upgradeForm">
              <div class="form-group">
                <label>Выберите подарок</label>
                <select name="giftId" id="upgradeGiftSelect" required onchange="loadUpgradeSettings(this.value)">
                  <option value="">-- Выбрать --</option>
                  ${gifts.map(g => `<option value="${g._id}" data-canupgrade="${g.canUpgrade}" data-upgradeprice="${g.upgradePrice || 0}">${g.emoji || '🎁'} ${g.name} ${g.canUpgrade ? '✨' : ''}</option>`).join('')}
                </select>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>
                    <input type="checkbox" name="canUpgrade" id="canUpgradeCheck"> Можно улучшить до NFT
                  </label>
                </div>
                <div class="form-group">
                  <label>Цена улучшения (Stars)</label>
                  <input type="number" name="upgradePrice" id="upgradePriceInput" min="0" value="0" placeholder="100">
                </div>
              </div>

              <hr style="margin: 20px 0; border: none; border-top: 1px solid #e0e0e0;">

              <h3 style="margin-bottom:15px;">🎨 Модели (варианты внешнего вида)</h3>
              <div id="modelsContainer"></div>
              <button type="button" class="btn" style="background:#27ae60;color:white;margin-bottom:20px;" onclick="addModel()">+ Добавить модель</button>

              <h3 style="margin-bottom:15px;">🌈 Паттерны</h3>
              <div id="patternsContainer"></div>
              <button type="button" class="btn" style="background:#27ae60;color:white;margin-bottom:20px;" onclick="addPattern()">+ Добавить паттерн</button>

              <h3 style="margin-bottom:15px;">🖼️ Фоны (Backdrops)</h3>
              <div id="backdropsContainer"></div>
              <button type="button" class="btn" style="background:#27ae60;color:white;margin-bottom:20px;" onclick="addBackdrop()">+ Добавить фон</button>

              <hr style="margin: 20px 0; border: none; border-top: 1px solid #e0e0e0;">
              <button type="submit" class="btn btn-primary">💾 Сохранить настройки Upgrade</button>
            </form>
          </div>
        </div>

        <!-- Выдать звёзды -->
        <div id="stars-panel" class="panel">
          <div class="card">
            <h2>⭐ Выдать звёзды пользователю</h2>
            <form id="starsForm">
              <div class="form-group">
                <label>Выберите пользователя</label>
                <select name="userId" required>
                  <option value="">-- Выбрать --</option>
                  ${users.map(u => `<option value="${u._id}">${u.name} (@${u.username})</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label>Количество звёзд</label>
                <input type="number" name="amount" required min="1" placeholder="100">
              </div>
              <button type="submit" class="btn btn-primary">Выдать звёзды</button>
            </form>
          </div>
        </div>

        <!-- Стикеры -->
        <div id="stickers-panel" class="panel">
          <div class="card">
            <h2>😀 Импорт стикерпака из Telegram</h2>
            <p style="color:#666;margin-bottom:20px;">Вставьте ссылку на стикерпак из Telegram (например: https://t.me/addstickers/PackName)</p>
            <form id="importStickerForm">
              <div class="form-group">
                <label>Ссылка на стикерпак</label>
                <input type="text" name="url" required placeholder="https://t.me/addstickers/HotCherry">
              </div>
              <button type="submit" class="btn btn-primary">Импортировать стикерпак</button>
            </form>
            <div id="importProgress" style="display:none;margin-top:20px;">
              <div class="loading-spinner" style="margin:0 auto;"></div>
              <p style="text-align:center;margin-top:10px;color:#666;">Импортируем стикеры...</p>
            </div>
          </div>

          <div class="card">
            <h2>📤 Или загрузить файлы</h2>
            <p style="color:#666;margin-bottom:20px;">Загрузите .tgs, .webp, .webm файлы с компьютера</p>
            <form id="uploadStickerForm">
              <div class="form-group">
                <label>Название стикерпака</label>
                <input type="text" name="packName" required placeholder="Мой стикерпак">
              </div>
              <div class="form-group">
                <label>Выберите файлы</label>
                <input type="file" name="stickerFiles" multiple accept=".tgs,.webp,.webm,.png,.gif" style="padding:10px;border:2px dashed #e0e0e0;border-radius:8px;width:100%;cursor:pointer;">
                <p style="font-size:12px;color:#888;margin-top:5px;">Поддерживаются: .tgs (анимированные), .webp, .webm (видео), .png, .gif</p>
              </div>
              <div id="selectedFiles" style="margin-bottom:15px;"></div>
              <button type="submit" class="btn btn-primary">Загрузить стикерпак</button>
            </form>
            <div id="uploadProgress" style="display:none;margin-top:20px;">
              <div class="loading-spinner" style="margin:0 auto;"></div>
              <p style="text-align:center;margin-top:10px;color:#666;">Загружаем стикеры...</p>
            </div>
          </div>

          <div class="card">
            <h2>📦 Установленные стикерпаки</h2>
            <div id="stickerPacksList" class="gifts-grid">
              <p style="color:#888;text-align:center;">Загрузка...</p>
            </div>
          </div>
        </div>

        <!-- Premium Emoji -->
        <div id="emoji-panel" class="panel">
          <div class="card">
            <h2>✨ Импорт Premium Emoji из Telegram</h2>
            <p style="color:#666;margin-bottom:20px;">Вставьте ссылку на emoji-пак из Telegram (например: https://t.me/addemoji/MerryChristmasEmoji)</p>
            <form id="importEmojiForm">
              <div class="form-group">
                <label>Ссылка на emoji-пак</label>
                <input type="text" name="url" required placeholder="https://t.me/addemoji/MerryChristmasEmoji">
              </div>
              <button type="submit" class="btn btn-primary">Импортировать emoji-пак</button>
            </form>
            <div id="emojiImportProgress" style="display:none;margin-top:20px;">
              <div class="loading-spinner" style="margin:0 auto;"></div>
              <p style="text-align:center;margin-top:10px;color:#666;">Импортируем emoji...</p>
            </div>
          </div>

          <div class="card">
            <h2>📤 Или загрузить файлы</h2>
            <p style="color:#666;margin-bottom:20px;">Загрузите .tgs, .webp, .webm файлы с компьютера</p>
            <form id="uploadEmojiForm">
              <div class="form-group">
                <label>Название emoji-пака</label>
                <input type="text" name="packName" required placeholder="Мой emoji-пак">
              </div>
              <div class="form-group">
                <label>Выберите файлы</label>
                <input type="file" name="emojiFiles" multiple accept=".tgs,.webp,.webm,.png,.gif" style="padding:10px;border:2px dashed #e0e0e0;border-radius:8px;width:100%;cursor:pointer;">
                <p style="font-size:12px;color:#888;margin-top:5px;">Поддерживаются: .tgs (анимированные), .webp, .webm (видео), .png, .gif</p>
              </div>
              <div id="selectedEmojiFiles" style="margin-bottom:15px;"></div>
              <button type="submit" class="btn btn-primary">Загрузить emoji-пак</button>
            </form>
            <div id="emojiUploadProgress" style="display:none;margin-top:20px;">
              <div class="loading-spinner" style="margin:0 auto;"></div>
              <p style="text-align:center;margin-top:10px;color:#666;">Загружаем emoji...</p>
            </div>
          </div>

          <div class="card">
            <h2>📦 Установленные emoji-паки</h2>
            <div id="emojiPacksList" class="gifts-grid">
              <p style="color:#888;text-align:center;">Загрузка...</p>
            </div>
          </div>
        </div>

        <!-- Управление пользователями -->
        <div id="users-panel" class="panel">
          <div class="card">
            <h2>👥 Управление пользователями</h2>
            
            <!-- Поиск пользователя -->
            <div class="form-group">
              <label>Поиск пользователя</label>
              <input type="text" id="userSearch" placeholder="Введите username или имя..." oninput="filterUsers(this.value)">
            </div>

            <div id="usersList" class="users-list" style="max-height: 400px; overflow-y: auto;">
              ${users.map(u => `
                <div class="user-item" data-username="${u.username}" data-name="${u.name}" data-id="${u._id}" style="display:flex;align-items:center;justify-content:space-between;padding:15px;background:#f9f9f9;border-radius:8px;margin-bottom:10px;">
                  <div>
                    <strong>${u.name}</strong> <span style="color:#888;">@${u.username}</span>
                  </div>
                  <button class="btn" style="background:#667eea;color:white;padding:8px 16px;" onclick="openUserModal('${u._id}', '${u.name}', '${u.username}')">Управление</button>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Скам метка -->
          <div class="card">
            <h2>🚨 Скам метка</h2>
            <form id="scamForm">
              <div class="form-group">
                <label>Выберите пользователя</label>
                <select name="userId" id="scamUserSelect" required>
                  <option value="">-- Выбрать --</option>
                  ${users.map(u => `<option value="${u._id}">${u.name} (@${u.username})</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label>
                  <input type="checkbox" name="isScam" id="scamCheckbox"> Пометить как SCAM
                </label>
              </div>
              <div class="form-group">
                <label>Причина (необязательно)</label>
                <input type="text" name="scamReason" placeholder="Мошенничество, фишинг и т.д.">
              </div>
              <button type="submit" class="btn btn-danger">Применить скам метку</button>
            </form>
          </div>

          <!-- NFT Юзернеймы -->
          <div class="card">
            <h2>💎 NFT Юзернеймы</h2>
            <form id="nftUsernameForm">
              <div class="form-group">
                <label>Выберите пользователя</label>
                <select name="userId" id="nftUserSelect" required onchange="loadUserNftUsernames(this.value)">
                  <option value="">-- Выбрать --</option>
                  ${users.map(u => `<option value="${u._id}">${u.name} (@${u.username})</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label>Текущие NFT юзернеймы:</label>
                <div id="currentNftUsernames" style="padding:10px;background:#f0f0f0;border-radius:8px;min-height:40px;margin-bottom:10px;">
                  <span style="color:#888;">Выберите пользователя</span>
                </div>
              </div>
              <div class="form-group">
                <label>Добавить NFT юзернейм (без @)</label>
                <input type="text" name="nftUsername" id="newNftUsername" placeholder="premium_username">
              </div>
              <div style="display:flex;gap:10px;">
                <button type="submit" class="btn btn-primary">Добавить</button>
                <button type="button" class="btn btn-danger" onclick="clearAllNftUsernames()">Очистить все</button>
              </div>
            </form>
          </div>

          <!-- Анонимный номер -->
          <div class="card">
            <h2>📱 Анонимный номер (NFT)</h2>
            <form id="anonymousNumberForm">
              <div class="form-group">
                <label>Выберите пользователя</label>
                <select name="userId" required>
                  <option value="">-- Выбрать --</option>
                  ${users.map(u => `<option value="${u._id}">${u.name} (@${u.username})</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label>Анонимный номер (без +)</label>
                <input type="text" name="anonymousNumber" placeholder="888 0001">
              </div>
              <p style="color:#888;font-size:12px;margin-bottom:15px;">Оставьте пустым чтобы удалить анонимный номер</p>
              <button type="submit" class="btn btn-primary">Сохранить анонимный номер</button>
            </form>
          </div>

          <!-- Верификация -->
          <div class="card">
            <h2>✅ Верификация</h2>
            <form id="verifyForm">
              <div class="form-group">
                <label>Выберите пользователя</label>
                <select name="userId" required>
                  <option value="">-- Выбрать --</option>
                  ${users.map(u => `<option value="${u._id}">${u.name} (@${u.username})</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label>
                  <input type="checkbox" name="isVerified"> Верифицированный аккаунт
                </label>
              </div>
              <button type="submit" class="btn btn-primary">Сохранить</button>
            </form>
          </div>
        </div>
      </div>

      <script>
        function showPanel(name) {
          document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
          document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
          document.getElementById(name + '-panel').classList.add('active');
          event.target.classList.add('active');
        }

        function toggleAnimationFields(type) {
          document.getElementById('emoji-field').style.display = type === 'emoji' ? 'block' : 'none';
          document.getElementById('animation-field').style.display = (type === 'lottie' || type === 'gif') ? 'block' : 'none';
          document.getElementById('tgs-field').style.display = type === 'tgs' ? 'block' : 'none';
        }

        document.getElementById('createForm').onsubmit = async (e) => {
          e.preventDefault();
          const form = new FormData(e.target);
          const data = Object.fromEntries(form);
          data.price = parseInt(data.price);
          if (data.totalSupply) data.totalSupply = parseInt(data.totalSupply);
          else delete data.totalSupply;
          data.convertRate = parseFloat(data.convertRate);
          
          const res = await fetch('/admin/api/gifts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          if (res.ok) {
            alert('Подарок создан!');
            location.reload();
          } else {
            alert('Ошибка создания подарка');
          }
        };

        document.getElementById('sendForm').onsubmit = async (e) => {
          e.preventDefault();
          const form = new FormData(e.target);
          const data = Object.fromEntries(form);
          
          const res = await fetch('/admin/api/send-gift', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          const result = await res.json();
          if (res.ok) {
            alert('Подарок отправлен!');
            e.target.reset();
          } else {
            alert(result.error || 'Ошибка отправки подарка');
          }
        };

        async function deleteGift(id) {
          if (!confirm('Удалить этот подарок?')) return;
          const res = await fetch('/admin/api/gifts/' + id, { method: 'DELETE' });
          if (res.ok) location.reload();
          else alert('Ошибка удаления подарка');
        }

        document.getElementById('starsForm').onsubmit = async (e) => {
          e.preventDefault();
          const form = new FormData(e.target);
          const data = Object.fromEntries(form);
          data.amount = parseInt(data.amount);
          
          const res = await fetch('/admin/api/give-stars', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          const result = await res.json();
          if (res.ok) {
            alert('Звёзды выданы! Новый баланс: ' + result.newBalance);
            e.target.reset();
          } else {
            alert(result.error || 'Ошибка выдачи звёзд');
          }
        };

        // Upgrade functions
        let currentGiftData = null;

        async function loadUpgradeSettings(giftId) {
          if (!giftId) {
            document.getElementById('canUpgradeCheck').checked = false;
            document.getElementById('upgradePriceInput').value = 0;
            document.getElementById('modelsContainer').innerHTML = '';
            document.getElementById('patternsContainer').innerHTML = '';
            document.getElementById('backdropsContainer').innerHTML = '';
            currentGiftData = null;
            return;
          }

          const res = await fetch('/admin/api/gifts/' + giftId);
          const data = await res.json();
          currentGiftData = data.gift;

          document.getElementById('canUpgradeCheck').checked = data.gift.canUpgrade || false;
          document.getElementById('upgradePriceInput').value = data.gift.upgradePrice || 0;

          // Load models
          document.getElementById('modelsContainer').innerHTML = '';
          (data.gift.upgradeModels || []).forEach((m, i) => addModel(m));

          // Load patterns
          document.getElementById('patternsContainer').innerHTML = '';
          (data.gift.upgradePatterns || []).forEach((p, i) => addPattern(p));

          // Load backdrops
          document.getElementById('backdropsContainer').innerHTML = '';
          (data.gift.upgradeBackdrops || []).forEach((b, i) => addBackdrop(b));
        }

        function addModel(data = {}) {
          const container = document.getElementById('modelsContainer');
          const div = document.createElement('div');
          div.className = 'model-item';
          div.style.cssText = 'background:#f9f9f9;padding:15px;border-radius:8px;margin-bottom:10px;';
          div.innerHTML = \`
            <div class="form-row">
              <div class="form-group" style="margin-bottom:10px;">
                <label>Название</label>
                <input type="text" class="model-name" value="\${data.name || ''}" placeholder="Gold">
              </div>
              <div class="form-group" style="margin-bottom:10px;">
                <label>Редкость (‰)</label>
                <input type="number" class="model-rarity" value="\${data.rarityPermille || 100}" min="1" max="1000">
              </div>
            </div>
            <div class="form-group" style="margin-bottom:10px;">
              <label>Тип анимации</label>
              <select class="model-type">
                <option value="lottie" \${data.animationType === 'lottie' ? 'selected' : ''}>Lottie</option>
                <option value="gif" \${data.animationType === 'gif' ? 'selected' : ''}>GIF</option>
                <option value="tgs" \${data.animationType === 'tgs' ? 'selected' : ''}>TGS</option>
              </select>
            </div>
            <div class="form-group" style="margin-bottom:10px;">
              <label>URL анимации</label>
              <input type="text" class="model-url" value="\${data.animationUrl || ''}" placeholder="https://...">
            </div>
            <div class="form-group" style="margin-bottom:10px;">
              <label>TGS URL (если TGS)</label>
              <input type="text" class="model-tgs" value="\${data.tgsUrl || ''}" placeholder="https://...tgs">
            </div>
            <button type="button" class="btn btn-danger" onclick="this.parentElement.remove()">Удалить</button>
          \`;
          container.appendChild(div);
        }

        function addPattern(data = {}) {
          const container = document.getElementById('patternsContainer');
          const div = document.createElement('div');
          div.className = 'pattern-item';
          div.style.cssText = 'background:#f9f9f9;padding:15px;border-radius:8px;margin-bottom:10px;';
          div.innerHTML = \`
            <div class="form-row">
              <div class="form-group" style="margin-bottom:10px;">
                <label>Название</label>
                <input type="text" class="pattern-name" value="\${data.name || ''}" placeholder="Stars">
              </div>
              <div class="form-group" style="margin-bottom:10px;">
                <label>Редкость (‰)</label>
                <input type="number" class="pattern-rarity" value="\${data.rarityPermille || 100}" min="1" max="1000">
              </div>
            </div>
            <div class="form-group" style="margin-bottom:10px;">
              <label>URL паттерна</label>
              <input type="text" class="pattern-url" value="\${data.patternUrl || ''}" placeholder="https://...">
            </div>
            <button type="button" class="btn btn-danger" onclick="this.parentElement.remove()">Удалить</button>
          \`;
          container.appendChild(div);
        }

        function addBackdrop(data = {}) {
          const container = document.getElementById('backdropsContainer');
          const div = document.createElement('div');
          div.className = 'backdrop-item';
          div.style.cssText = 'background:#f9f9f9;padding:15px;border-radius:8px;margin-bottom:10px;';
          div.innerHTML = \`
            <div class="form-row">
              <div class="form-group" style="margin-bottom:10px;">
                <label>Название</label>
                <input type="text" class="backdrop-name" value="\${data.name || ''}" placeholder="Sunset">
              </div>
              <div class="form-group" style="margin-bottom:10px;">
                <label>Редкость (‰)</label>
                <input type="number" class="backdrop-rarity" value="\${data.rarityPermille || 100}" min="1" max="1000">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group" style="margin-bottom:10px;">
                <label>Центр цвет</label>
                <input type="color" class="backdrop-center" value="\${data.centerColor || '#667eea'}">
              </div>
              <div class="form-group" style="margin-bottom:10px;">
                <label>Край цвет</label>
                <input type="color" class="backdrop-edge" value="\${data.edgeColor || '#764ba2'}">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group" style="margin-bottom:10px;">
                <label>Паттерн цвет</label>
                <input type="color" class="backdrop-pattern" value="\${data.patternColor || '#ffffff'}">
              </div>
              <div class="form-group" style="margin-bottom:10px;">
                <label>Текст цвет</label>
                <input type="color" class="backdrop-text" value="\${data.textColor || '#ffffff'}">
              </div>
            </div>
            <button type="button" class="btn btn-danger" onclick="this.parentElement.remove()">Удалить</button>
          \`;
          container.appendChild(div);
        }

        document.getElementById('upgradeForm').onsubmit = async (e) => {
          e.preventDefault();
          const giftId = document.getElementById('upgradeGiftSelect').value;
          if (!giftId) { alert('Выберите подарок'); return; }

          const canUpgrade = document.getElementById('canUpgradeCheck').checked;
          const upgradePrice = parseInt(document.getElementById('upgradePriceInput').value) || 0;

          // Collect models
          const upgradeModels = [];
          document.querySelectorAll('.model-item').forEach(item => {
            upgradeModels.push({
              name: item.querySelector('.model-name').value,
              animationType: item.querySelector('.model-type').value,
              animationUrl: item.querySelector('.model-url').value,
              tgsUrl: item.querySelector('.model-tgs').value,
              rarityPermille: parseInt(item.querySelector('.model-rarity').value) || 100,
            });
          });

          // Collect patterns
          const upgradePatterns = [];
          document.querySelectorAll('.pattern-item').forEach(item => {
            upgradePatterns.push({
              name: item.querySelector('.pattern-name').value,
              patternUrl: item.querySelector('.pattern-url').value,
              rarityPermille: parseInt(item.querySelector('.pattern-rarity').value) || 100,
            });
          });

          // Collect backdrops
          const upgradeBackdrops = [];
          document.querySelectorAll('.backdrop-item').forEach(item => {
            upgradeBackdrops.push({
              name: item.querySelector('.backdrop-name').value,
              centerColor: item.querySelector('.backdrop-center').value,
              edgeColor: item.querySelector('.backdrop-edge').value,
              patternColor: item.querySelector('.backdrop-pattern').value,
              textColor: item.querySelector('.backdrop-text').value,
              rarityPermille: parseInt(item.querySelector('.backdrop-rarity').value) || 100,
            });
          });

          const res = await fetch('/admin/api/gifts/' + giftId + '/upgrade-settings', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ canUpgrade, upgradePrice, upgradeModels, upgradePatterns, upgradeBackdrops })
          });

          if (res.ok) {
            alert('Настройки Upgrade сохранены!');
            location.reload();
          } else {
            alert('Ошибка сохранения');
          }
        };

        // Загрузка анимаций для подарков
        async function loadGiftAnimations() {
          const cards = document.querySelectorAll('.gift-card[data-gift-id]');
          
          for (const card of cards) {
            const giftId = card.dataset.giftId;
            const type = card.dataset.animationType;
            const animationUrl = card.dataset.animationUrl;
            const tgsUrl = card.dataset.tgsUrl;
            const emoji = card.dataset.emoji;
            const container = document.getElementById('preview-' + giftId);
            
            if (!container) continue;
            
            try {
              if (type === 'emoji') {
                container.innerHTML = '<span style="font-size:50px;">' + emoji + '</span>';
              } else if (type === 'gif' && animationUrl) {
                container.innerHTML = '<img src="' + animationUrl + '" style="max-width:100%;max-height:100%;">';
              } else if (type === 'lottie' && animationUrl) {
                container.innerHTML = '';
                lottie.loadAnimation({
                  container: container,
                  renderer: 'svg',
                  loop: true,
                  autoplay: true,
                  path: animationUrl
                });
              } else if (type === 'tgs' && tgsUrl) {
                const res = await fetch(tgsUrl);
                const buffer = await res.arrayBuffer();
                const pako = await import('https://cdn.jsdelivr.net/npm/pako@2.1.0/+esm');
                const decompressed = pako.inflate(new Uint8Array(buffer), { to: 'string' });
                const json = JSON.parse(decompressed);
                container.innerHTML = '';
                lottie.loadAnimation({
                  container: container,
                  renderer: 'svg',
                  loop: true,
                  autoplay: true,
                  animationData: json
                });
              } else {
                container.innerHTML = '<span style="font-size:50px;">' + emoji + '</span>';
              }
            } catch (e) {
              console.error('Animation load error for ' + giftId + ':', e);
              container.innerHTML = '<span style="font-size:50px;">' + emoji + '</span>';
            }
          }
        }

        // Запускаем загрузку анимаций после загрузки страницы
        document.addEventListener('DOMContentLoaded', loadGiftAnimations);
        if (document.readyState !== 'loading') loadGiftAnimations();

        // === УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯМИ ===
        
        // Фильтрация пользователей
        function filterUsers(query) {
          const items = document.querySelectorAll('.user-item');
          query = query.toLowerCase();
          items.forEach(item => {
            const username = item.dataset.username.toLowerCase();
            const name = item.dataset.name.toLowerCase();
            if (username.includes(query) || name.includes(query)) {
              item.style.display = 'flex';
            } else {
              item.style.display = 'none';
            }
          });
        }

        // Открыть модалку пользователя
        function openUserModal(userId, name, username) {
          alert('Пользователь: ' + name + ' (@' + username + ')\\nИспользуйте формы ниже для управления.');
          // Автоматически выбираем пользователя во всех селектах
          document.querySelectorAll('#users-panel select[name="userId"]').forEach(select => {
            select.value = userId;
          });
        }

        // Скам метка
        document.getElementById('scamForm').onsubmit = async (e) => {
          e.preventDefault();
          const form = new FormData(e.target);
          const data = {
            userId: form.get('userId'),
            isScam: form.get('isScam') === 'on',
            scamReason: form.get('scamReason') || null
          };
          
          const res = await fetch('/admin/api/user/scam', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          const result = await res.json();
          if (res.ok) {
            alert(data.isScam ? 'Скам метка установлена!' : 'Скам метка снята!');
            e.target.reset();
          } else {
            alert(result.error || 'Ошибка');
          }
        };

        // NFT Юзернеймы
        async function loadUserNftUsernames(userId) {
          const container = document.getElementById('currentNftUsernames');
          if (!userId) {
            container.innerHTML = '<span style="color:#888;">Выберите пользователя</span>';
            return;
          }
          
          const res = await fetch('/admin/api/user/' + userId);
          const data = await res.json();
          
          if (data.user && data.user.nftUsernames && data.user.nftUsernames.length > 0) {
            container.innerHTML = data.user.nftUsernames.map(u => 
              '<span style="display:inline-block;background:#667eea;color:white;padding:5px 10px;border-radius:5px;margin:3px;cursor:pointer;" onclick="removeNftUsername(\\'' + userId + '\\', \\'' + u + '\\')">@' + u + ' ✕</span>'
            ).join('');
          } else {
            container.innerHTML = '<span style="color:#888;">Нет NFT юзернеймов</span>';
          }
        }

        async function removeNftUsername(userId, username) {
          if (!confirm('Удалить @' + username + '?')) return;
          
          const res = await fetch('/admin/api/user/nft-username/remove', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, nftUsername: username })
          });
          
          if (res.ok) {
            loadUserNftUsernames(userId);
          } else {
            alert('Ошибка удаления');
          }
        }

        async function clearAllNftUsernames() {
          const userId = document.getElementById('nftUserSelect').value;
          if (!userId) { alert('Выберите пользователя'); return; }
          if (!confirm('Удалить все NFT юзернеймы?')) return;
          
          const res = await fetch('/admin/api/user/nft-username/clear', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
          });
          
          if (res.ok) {
            loadUserNftUsernames(userId);
            alert('Все NFT юзернеймы удалены');
          } else {
            alert('Ошибка');
          }
        }

        document.getElementById('nftUsernameForm').onsubmit = async (e) => {
          e.preventDefault();
          const form = new FormData(e.target);
          const userId = form.get('userId');
          const nftUsername = form.get('nftUsername');
          
          if (!nftUsername) {
            alert('Введите NFT юзернейм');
            return;
          }
          
          const res = await fetch('/admin/api/user/nft-username/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, nftUsername })
          });
          const result = await res.json();
          if (res.ok) {
            alert('NFT юзернейм добавлен!');
            document.getElementById('newNftUsername').value = '';
            loadUserNftUsernames(userId);
          } else {
            alert(result.error || 'Ошибка');
          }
        };

        // Анонимный номер
        document.getElementById('anonymousNumberForm').onsubmit = async (e) => {
          e.preventDefault();
          const form = new FormData(e.target);
          const data = {
            userId: form.get('userId'),
            anonymousNumber: form.get('anonymousNumber') || null
          };
          
          const res = await fetch('/admin/api/user/anonymous-number', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          const result = await res.json();
          if (res.ok) {
            alert(data.anonymousNumber ? 'Анонимный номер установлен!' : 'Анонимный номер удалён!');
            e.target.reset();
          } else {
            alert(result.error || 'Ошибка');
          }
        };

        // Верификация
        document.getElementById('verifyForm').onsubmit = async (e) => {
          e.preventDefault();
          const form = new FormData(e.target);
          const data = {
            userId: form.get('userId'),
            isVerified: form.get('isVerified') === 'on'
          };
          
          const res = await fetch('/admin/api/user/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          const result = await res.json();
          if (res.ok) {
            alert(data.isVerified ? 'Пользователь верифицирован!' : 'Верификация снята!');
            e.target.reset();
          } else {
            alert(result.error || 'Ошибка');
          }
        };

        // === СТИКЕРЫ ===
        
        // Загрузка списка стикерпаков
        async function loadStickerPacks() {
          const container = document.getElementById('stickerPacksList');
          try {
            const res = await fetch('/admin/api/stickers');
            const data = await res.json();
            
            if (data.packs && data.packs.length > 0) {
              container.innerHTML = data.packs.map(pack => \`
                <div class="gift-card" style="text-align:left;">
                  <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
                    <img src="\${pack.thumbnail || ''}" style="width:50px;height:50px;object-fit:contain;" onerror="this.style.display='none'">
                    <div>
                      <div class="gift-name">\${pack.title}</div>
                      <div style="font-size:12px;color:#888;">@\${pack.shortName}</div>
                    </div>
                  </div>
                  <div class="gift-stats">\${pack.stickers?.length || 0} стикеров • \${pack.packType}</div>
                  <div class="gift-actions">
                    <button class="btn" style="background:\${pack.isActive ? '#e74c3c' : '#27ae60'};color:white;" onclick="toggleStickerPack('\${pack._id}', \${!pack.isActive})">\${pack.isActive ? 'Выкл' : 'Вкл'}</button>
                    <button class="btn btn-danger" onclick="deleteStickerPack('\${pack._id}')">Удалить</button>
                  </div>
                </div>
              \`).join('');
            } else {
              container.innerHTML = '<p style="color:#888;text-align:center;grid-column:1/-1;">Стикерпаков пока нет</p>';
            }
          } catch (err) {
            container.innerHTML = '<p style="color:#e74c3c;text-align:center;">Ошибка загрузки</p>';
          }
        }

        // Импорт стикерпака по ссылке
        document.getElementById('importStickerForm').onsubmit = async (e) => {
          e.preventDefault();
          const form = new FormData(e.target);
          const url = form.get('url');
          
          document.getElementById('importProgress').style.display = 'block';
          
          try {
            const res = await fetch('/admin/api/stickers/import', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ url })
            });
            const result = await res.json();
            
            if (res.ok) {
              alert(\`Стикерпак "\${result.pack.title}" импортирован! (\${result.pack.stickers.length} стикеров)\`);
              e.target.reset();
              loadStickerPacks();
            } else {
              alert(result.error || 'Ошибка импорта');
            }
          } catch (err) {
            alert('Ошибка: ' + err.message);
          } finally {
            document.getElementById('importProgress').style.display = 'none';
          }
        };

        // Показать выбранные файлы
        document.querySelector('input[name="stickerFiles"]').onchange = function(e) {
          const files = Array.from(e.target.files);
          const container = document.getElementById('selectedFiles');
          if (files.length > 0) {
            container.innerHTML = '<p style="color:#667eea;font-size:14px;">Выбрано файлов: ' + files.length + '</p>';
          } else {
            container.innerHTML = '';
          }
        };

        // Загрузка стикерпака
        document.getElementById('uploadStickerForm').onsubmit = async (e) => {
          e.preventDefault();
          const form = new FormData(e.target);
          const packName = form.get('packName');
          const files = document.querySelector('input[name="stickerFiles"]').files;
          
          if (!files.length) {
            alert('Выберите файлы стикеров');
            return;
          }
          
          document.getElementById('uploadProgress').style.display = 'block';
          
          try {
            const formData = new FormData();
            formData.append('packName', packName);
            for (let i = 0; i < files.length; i++) {
              formData.append('stickers', files[i]);
            }
            
            const res = await fetch('/admin/api/stickers/upload', {
              method: 'POST',
              body: formData
            });
            const result = await res.json();
            
            if (res.ok) {
              alert(\`Стикерпак "\${result.pack.title}" загружен! (\${result.pack.stickers.length} стикеров)\`);
              e.target.reset();
              document.getElementById('selectedFiles').innerHTML = '';
              loadStickerPacks();
            } else {
              alert(result.error || 'Ошибка загрузки');
            }
          } catch (err) {
            alert('Ошибка: ' + err.message);
          } finally {
            document.getElementById('uploadProgress').style.display = 'none';
          }
        };

        // Удалить стикерпак
        async function deleteStickerPack(id) {
          if (!confirm('Удалить этот стикерпак?')) return;
          const res = await fetch('/admin/api/stickers/' + id, { method: 'DELETE' });
          if (res.ok) {
            loadStickerPacks();
          } else {
            alert('Ошибка удаления');
          }
        }

        // Вкл/выкл стикерпак
        async function toggleStickerPack(id, isActive) {
          const res = await fetch('/admin/api/stickers/' + id + '/toggle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isActive })
          });
          if (res.ok) {
            loadStickerPacks();
          }
        }

        // Загружаем стикерпаки при открытии вкладки
        const origShowPanel = showPanel;
        showPanel = function(name) {
          origShowPanel(name);
          if (name === 'stickers') {
            loadStickerPacks();
          }
          if (name === 'emoji') {
            loadEmojiPacks();
          }
        };

        // === PREMIUM EMOJI ===
        
        // Загрузка списка emoji-паков
        async function loadEmojiPacks() {
          const container = document.getElementById('emojiPacksList');
          try {
            const res = await fetch('/admin/api/emoji');
            const data = await res.json();
            
            if (data.packs && data.packs.length > 0) {
              container.innerHTML = data.packs.map(pack => \`
                <div class="gift-card" style="text-align:left;">
                  <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
                    <img src="\${pack.thumbnail || ''}" style="width:50px;height:50px;object-fit:contain;" onerror="this.style.display='none'">
                    <div>
                      <div class="gift-name">\${pack.title} ✨</div>
                      <div style="font-size:12px;color:#888;">@\${pack.shortName}</div>
                    </div>
                  </div>
                  <div class="gift-stats">\${pack.emojis?.length || 0} emoji • \${pack.packType}</div>
                  <div class="gift-actions">
                    <button class="btn" style="background:\${pack.isActive ? '#e74c3c' : '#27ae60'};color:white;" onclick="toggleEmojiPack('\${pack._id}', \${!pack.isActive})">\${pack.isActive ? 'Выкл' : 'Вкл'}</button>
                    <button class="btn btn-danger" onclick="deleteEmojiPack('\${pack._id}')">Удалить</button>
                  </div>
                </div>
              \`).join('');
            } else {
              container.innerHTML = '<p style="color:#888;text-align:center;grid-column:1/-1;">Emoji-паков пока нет</p>';
            }
          } catch (err) {
            container.innerHTML = '<p style="color:#e74c3c;text-align:center;">Ошибка загрузки</p>';
          }
        }

        // Импорт emoji-пака по ссылке
        document.getElementById('importEmojiForm').onsubmit = async (e) => {
          e.preventDefault();
          const form = new FormData(e.target);
          const url = form.get('url');
          
          document.getElementById('emojiImportProgress').style.display = 'block';
          
          try {
            const res = await fetch('/admin/api/emoji/import', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ url })
            });
            const result = await res.json();
            
            if (res.ok) {
              alert(\`Emoji-пак "\${result.pack.title}" импортирован! (\${result.pack.emojis.length} emoji)\`);
              e.target.reset();
              loadEmojiPacks();
            } else {
              alert(result.error || 'Ошибка импорта');
            }
          } catch (err) {
            alert('Ошибка: ' + err.message);
          } finally {
            document.getElementById('emojiImportProgress').style.display = 'none';
          }
        };

        // Показать выбранные файлы emoji
        document.querySelector('input[name="emojiFiles"]').onchange = function(e) {
          const files = Array.from(e.target.files);
          const container = document.getElementById('selectedEmojiFiles');
          if (files.length > 0) {
            container.innerHTML = '<p style="color:#667eea;font-size:14px;">Выбрано файлов: ' + files.length + '</p>';
          } else {
            container.innerHTML = '';
          }
        };

        // Загрузка emoji-пака
        document.getElementById('uploadEmojiForm').onsubmit = async (e) => {
          e.preventDefault();
          const form = new FormData(e.target);
          const packName = form.get('packName');
          const files = document.querySelector('input[name="emojiFiles"]').files;
          
          if (!files.length) {
            alert('Выберите файлы emoji');
            return;
          }
          
          document.getElementById('emojiUploadProgress').style.display = 'block';
          
          try {
            const formData = new FormData();
            formData.append('packName', packName);
            for (let i = 0; i < files.length; i++) {
              formData.append('emojis', files[i]);
            }
            
            const res = await fetch('/admin/api/emoji/upload', {
              method: 'POST',
              body: formData
            });
            const result = await res.json();
            
            if (res.ok) {
              alert(\`Emoji-пак "\${result.pack.title}" загружен! (\${result.pack.emojis.length} emoji)\`);
              e.target.reset();
              document.getElementById('selectedEmojiFiles').innerHTML = '';
              loadEmojiPacks();
            } else {
              alert(result.error || 'Ошибка загрузки');
            }
          } catch (err) {
            alert('Ошибка: ' + err.message);
          } finally {
            document.getElementById('emojiUploadProgress').style.display = 'none';
          }
        };

        // Удалить emoji-пак
        async function deleteEmojiPack(id) {
          if (!confirm('Удалить этот emoji-пак?')) return;
          const res = await fetch('/admin/api/emoji/' + id, { method: 'DELETE' });
          if (res.ok) {
            loadEmojiPacks();
          } else {
            alert('Ошибка удаления');
          }
        }

        // Вкл/выкл emoji-пак
        async function toggleEmojiPack(id, isActive) {
          const res = await fetch('/admin/api/emoji/' + id + '/toggle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isActive })
          });
          if (res.ok) {
            loadEmojiPacks();
          }
        }
      </script>
    </body>
    </html>
  `);
});


// API: Создать подарок
router.post("/api/gifts", checkAdmin, express.json(), async (req, res) => {
  try {
    const gift = await Gift.create(req.body);
    res.json({ success: true, gift });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// API: Удалить подарок
router.delete("/api/gifts/:id", checkAdmin, async (req, res) => {
  try {
    await Gift.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// API: Отправить подарок (админ, без списания Stars)
router.post("/api/send-gift", checkAdmin, express.json(), async (req, res) => {
  try {
    const { giftId, fromUserId, toUserId, message } = req.body;

    const gift = await Gift.findById(giftId);
    if (!gift) return res.status(404).json({ error: "Подарок не найден" });

    const fromUser = await User.findById(fromUserId);
    const toUser = await User.findById(toUserId);
    if (!fromUser || !toUser) return res.status(404).json({ error: "Пользователь не найден" });

    const userGift = await UserGift.create({
      gift: giftId,
      from: fromUserId,
      to: toUserId,
      message: message || "",
      isAnonymous: false,
    });

    gift.soldCount += 1;
    await gift.save();

    res.json({ success: true, userGift });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// API: Выдать звёзды пользователю
router.post("/api/give-stars", checkAdmin, express.json(), async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || !amount || amount < 1) {
      return res.status(400).json({ error: "Укажите пользователя и количество" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "Пользователь не найден" });

    user.stars = (user.stars || 0) + amount;
    await user.save({ validateBeforeSave: false });

    res.json({ success: true, newBalance: user.stars });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// API: Отправить подарок всем пользователям
router.post("/api/send-gift-to-all", checkAdmin, express.json(), async (req, res) => {
  try {
    const { giftId, fromUserId, count = 1, message = "", withUpgrade = false } = req.body;

    const gift = await Gift.findById(giftId);
    if (!gift) return res.status(404).json({ error: "Подарок не найден" });

    const fromUser = await User.findById(fromUserId);
    if (!fromUser) return res.status(404).json({ error: "Отправитель не найден" });

    const allUsers = await User.find({ _id: { $ne: fromUserId }, isDeleted: { $ne: true } });
    
    // Функция выбора случайного атрибута
    const selectRandom = (items) => {
      if (!items || items.length === 0) return null;
      const totalWeight = items.reduce((sum, item) => sum + (item.rarityPermille || 100), 0);
      let random = Math.random() * totalWeight;
      for (const item of items) {
        random -= item.rarityPermille || 100;
        if (random <= 0) return item;
      }
      return items[0];
    };

    let sent = 0;
    for (const toUser of allUsers) {
      for (let i = 0; i < count; i++) {
        const giftData = {
          gift: giftId,
          from: fromUserId,
          to: toUser._id,
          message: message,
          isAnonymous: false,
        };

        // Если нужен upgrade
        if (withUpgrade && gift.canUpgrade) {
          const totalUpgraded = await UserGift.countDocuments({ gift: giftId, isUpgraded: true });
          const uniqueNum = totalUpgraded + sent + 1;
          
          giftData.isUpgraded = true;
          giftData.uniqueNum = uniqueNum;
          giftData.slug = `${giftId.toString().slice(-6)}-${uniqueNum}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
          giftData.upgradeModel = selectRandom(gift.upgradeModels);
          giftData.upgradePattern = selectRandom(gift.upgradePatterns);
          giftData.upgradeBackdrop = selectRandom(gift.upgradeBackdrops);
          giftData.upgradedAt = new Date();
        }

        await UserGift.create(giftData);
        gift.soldCount += 1;
        sent++;
      }
    }
    
    await gift.save();

    res.json({ success: true, sent, users: allUsers.length, upgraded: withUpgrade });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// API: Получить всех пользователей
router.get("/api/users", checkAdmin, async (req, res) => {
  try {
    const users = await User.find({}, { _id: 1, username: 1, name: 1, stars: 1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// API: Получить подарок по ID
router.get("/api/gifts/:id", checkAdmin, async (req, res) => {
  try {
    const gift = await Gift.findById(req.params.id);
    if (!gift) return res.status(404).json({ error: "Подарок не найден" });
    res.json({ success: true, gift });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// API: Обновить настройки upgrade для подарка
router.patch("/api/gifts/:id/upgrade-settings", checkAdmin, express.json(), async (req, res) => {
  try {
    const { canUpgrade, upgradePrice, upgradeModels, upgradePatterns, upgradeBackdrops } = req.body;
    
    const gift = await Gift.findById(req.params.id);
    if (!gift) return res.status(404).json({ error: "Подарок не найден" });

    if (canUpgrade !== undefined) gift.canUpgrade = canUpgrade;
    if (upgradePrice !== undefined) gift.upgradePrice = upgradePrice;
    if (upgradeModels !== undefined) gift.upgradeModels = upgradeModels;
    if (upgradePatterns !== undefined) gift.upgradePatterns = upgradePatterns;
    if (upgradeBackdrops !== undefined) gift.upgradeBackdrops = upgradeBackdrops;

    await gift.save();
    res.json({ success: true, gift });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// API: Удалить индекс slug (для исправления duplicate key error)
router.post("/api/drop-slug-index", checkAdmin, async (req, res) => {
  try {
    await UserGift.collection.dropIndex("slug_1");
    res.json({ success: true, message: "Index slug_1 dropped successfully" });
  } catch (err) {
    if (err.code === 27) {
      res.json({ success: true, message: "Index slug_1 does not exist" });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
});

// API: Отправить подарок одному пользователю с upgrade
router.post("/api/send-gift-upgraded", checkAdmin, express.json(), async (req, res) => {
  try {
    const { giftId, toUserId, fromUserId, message, withUpgrade } = req.body;

    const gift = await Gift.findById(giftId);
    if (!gift) return res.status(404).json({ error: "Подарок не найден" });

    const toUser = await User.findById(toUserId);
    if (!toUser) return res.status(404).json({ error: "Получатель не найден" });

    const selectRandom = (items) => {
      if (!items || items.length === 0) return null;
      const totalWeight = items.reduce((sum, item) => sum + (item.rarityPermille || 100), 0);
      let random = Math.random() * totalWeight;
      for (const item of items) {
        random -= item.rarityPermille || 100;
        if (random <= 0) return item;
      }
      return items[0];
    };

    const giftData = {
      gift: giftId,
      from: fromUserId,
      to: toUserId,
      message: message || "",
      isAnonymous: false,
    };

    if (withUpgrade && gift.canUpgrade) {
      const totalUpgraded = await UserGift.countDocuments({ gift: giftId, isUpgraded: true });
      const uniqueNum = totalUpgraded + 1;
      
      giftData.isUpgraded = true;
      giftData.uniqueNum = uniqueNum;
      giftData.slug = `${giftId.toString().slice(-6)}-${uniqueNum}-${Date.now().toString(36)}`;
      giftData.upgradeModel = selectRandom(gift.upgradeModels);
      giftData.upgradePattern = selectRandom(gift.upgradePatterns);
      giftData.upgradeBackdrop = selectRandom(gift.upgradeBackdrops);
      giftData.upgradedAt = new Date();
    }

    const userGift = await UserGift.create(giftData);
    gift.soldCount += 1;
    await gift.save();

    await userGift.populate(["gift", "from", "to"]);

    res.json({ success: true, userGift });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// === API: УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯМИ ===

// API: Установить/снять скам метку
router.post("/api/user/scam", checkAdmin, express.json(), async (req, res) => {
  try {
    const { userId, isScam, scamReason } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Укажите пользователя" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "Пользователь не найден" });

    user.isScam = isScam;
    user.scamReason = isScam ? scamReason : null;
    user.scamMarkedAt = isScam ? new Date() : null;
    // scamMarkedBy можно добавить если есть система админов с ID

    await user.save({ validateBeforeSave: false });

    res.json({ success: true, isScam: user.isScam, scamReason: user.scamReason });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// API: Добавить NFT юзернейм
router.post("/api/user/nft-username/add", checkAdmin, express.json(), async (req, res) => {
  try {
    const { userId, nftUsername } = req.body;

    if (!userId || !nftUsername) {
      return res.status(400).json({ error: "Укажите пользователя и юзернейм" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "Пользователь не найден" });

    // Проверяем уникальность NFT юзернейма
    const existing = await User.findOne({ nftUsernames: nftUsername, _id: { $ne: userId } });
    if (existing) {
      return res.status(400).json({ error: "Этот NFT юзернейм уже занят" });
    }

    // Проверяем что у пользователя ещё нет этого юзернейма
    if (!user.nftUsernames) user.nftUsernames = [];
    if (user.nftUsernames.includes(nftUsername)) {
      return res.status(400).json({ error: "Этот NFT юзернейм уже добавлен" });
    }

    user.nftUsernames.push(nftUsername);
    user.nftUsernameAcquiredAt = new Date();

    await user.save({ validateBeforeSave: false });

    res.json({ success: true, nftUsernames: user.nftUsernames });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// API: Удалить один NFT юзернейм
router.post("/api/user/nft-username/remove", checkAdmin, express.json(), async (req, res) => {
  try {
    const { userId, nftUsername } = req.body;

    if (!userId || !nftUsername) {
      return res.status(400).json({ error: "Укажите пользователя и юзернейм" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "Пользователь не найден" });

    user.nftUsernames = (user.nftUsernames || []).filter(u => u !== nftUsername);

    await user.save({ validateBeforeSave: false });

    res.json({ success: true, nftUsernames: user.nftUsernames });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// API: Очистить все NFT юзернеймы
router.post("/api/user/nft-username/clear", checkAdmin, express.json(), async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Укажите пользователя" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "Пользователь не найден" });

    user.nftUsernames = [];
    user.nftUsernameAcquiredAt = null;

    await user.save({ validateBeforeSave: false });

    res.json({ success: true, nftUsernames: user.nftUsernames });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// API: Установить анонимный номер
router.post("/api/user/anonymous-number", checkAdmin, express.json(), async (req, res) => {
  try {
    const { userId, anonymousNumber } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Укажите пользователя" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "Пользователь не найден" });

    // Проверяем уникальность анонимного номера
    if (anonymousNumber) {
      const existing = await User.findOne({ anonymousNumber, _id: { $ne: userId } });
      if (existing) {
        return res.status(400).json({ error: "Этот анонимный номер уже занят" });
      }
    }

    user.anonymousNumber = anonymousNumber || null;
    user.anonymousNumberAcquiredAt = anonymousNumber ? new Date() : null;

    await user.save({ validateBeforeSave: false });

    res.json({ success: true, anonymousNumber: user.anonymousNumber });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// API: Верификация пользователя
router.post("/api/user/verify", checkAdmin, express.json(), async (req, res) => {
  try {
    const { userId, isVerified } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Укажите пользователя" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "Пользователь не найден" });

    user.isVerified = isVerified;

    await user.save({ validateBeforeSave: false });

    res.json({ success: true, isVerified: user.isVerified });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// API: Получить полную информацию о пользователе
router.get("/api/user/:id", checkAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password -confirmPassword");
    if (!user) return res.status(404).json({ error: "Пользователь не найден" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ============ СТИКЕРЫ ============

// API: Получить все стикерпаки
router.get("/api/stickers", checkAdmin, async (req, res) => {
  try {
    const packs = await StickerPack.find().sort({ createdAt: -1 });
    res.json({ success: true, packs });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// API: Импорт стикерпака из Telegram
router.post("/api/stickers/import", checkAdmin, express.json(), async (req, res) => {
  try {
    const { url } = req.body;
    
    // Парсим ссылку на стикерпак
    // Форматы: https://t.me/addstickers/PackName или просто PackName
    let shortName = url;
    if (url.includes('t.me/addstickers/')) {
      shortName = url.split('t.me/addstickers/')[1].split(/[?#]/)[0];
    } else if (url.includes('t.me/')) {
      shortName = url.split('t.me/')[1].split(/[?#]/)[0];
    }
    
    if (!shortName) {
      return res.status(400).json({ error: "Неверная ссылка на стикерпак" });
    }

    // Проверяем, не импортирован ли уже
    const existing = await StickerPack.findOne({ shortName });
    if (existing) {
      return res.status(400).json({ error: "Этот стикерпак уже импортирован" });
    }

    // Получаем стикерпак через Telegram Bot API
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      return res.status(400).json({ error: "TELEGRAM_BOT_TOKEN не настроен в .env" });
    }

    // Получаем информацию о стикерпаке
    const stickerSetRes = await fetch(`https://api.telegram.org/bot${botToken}/getStickerSet?name=${encodeURIComponent(shortName)}`);
    const stickerSetData = await stickerSetRes.json();
    
    if (!stickerSetData.ok) {
      return res.status(400).json({ error: "Стикерпак не найден: " + (stickerSetData.description || "Unknown error") });
    }

    const stickerSet = stickerSetData.result;
    
    // Определяем тип пака
    let packType = "regular";
    if (stickerSet.is_animated) packType = "animated";
    if (stickerSet.is_video) packType = "video";

    // Скачиваем стикеры локально
    const stickers = [];
    for (const sticker of stickerSet.stickers) {
      // Получаем файл
      const fileRes = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${sticker.file_id}`);
      const fileData = await fileRes.json();
      
      if (fileData.ok) {
        const telegramUrl = `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`;
        
        // Определяем тип и расширение
        let type = "static";
        let ext = ".webp";
        if (sticker.is_animated) { type = "animated"; ext = ".tgs"; }
        if (sticker.is_video) { type = "video"; ext = ".webm"; }
        
        // Скачиваем файл локально
        const fileName = crypto.randomBytes(16).toString("hex") + ext;
        const filePath = path.join(stickersDir, fileName);
        
        try {
          const fileResponse = await fetch(telegramUrl);
          const buffer = Buffer.from(await fileResponse.arrayBuffer());
          fs.writeFileSync(filePath, buffer);
          
          stickers.push({
            fileId: sticker.file_id,
            url: `/uploads/stickers/${fileName}`,
            type,
            emoji: sticker.emoji || "😀",
            width: sticker.width,
            height: sticker.height,
          });
        } catch (downloadErr) {
          console.error("Failed to download sticker:", downloadErr);
        }
      }
    }

    // Получаем превью (первый стикер)
    let thumbnail = stickers[0]?.url || null;
    if (stickerSet.thumbnail) {
      const thumbRes = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${stickerSet.thumbnail.file_id}`);
      const thumbData = await thumbRes.json();
      if (thumbData.ok) {
        const telegramThumbUrl = `https://api.telegram.org/file/bot${botToken}/${thumbData.result.file_path}`;
        const thumbExt = thumbData.result.file_path.includes(".tgs") ? ".tgs" : 
                         thumbData.result.file_path.includes(".webm") ? ".webm" : ".webp";
        const thumbFileName = crypto.randomBytes(16).toString("hex") + thumbExt;
        const thumbPath = path.join(stickersDir, thumbFileName);
        
        try {
          const thumbResponse = await fetch(telegramThumbUrl);
          const thumbBuffer = Buffer.from(await thumbResponse.arrayBuffer());
          fs.writeFileSync(thumbPath, thumbBuffer);
          thumbnail = `/uploads/stickers/${thumbFileName}`;
        } catch (thumbErr) {
          console.error("Failed to download thumbnail:", thumbErr);
        }
      }
    }

    // Сохраняем в базу
    const pack = await StickerPack.create({
      name: stickerSet.name,
      shortName: shortName,
      title: stickerSet.title,
      packType,
      thumbnail,
      stickers,
      sourceUrl: url,
      isActive: true,
    });

    res.json({ success: true, pack });
  } catch (err) {
    console.error("Sticker import error:", err);
    res.status(400).json({ error: err.message });
  }
});

// API: Удалить стикерпак
router.delete("/api/stickers/:id", checkAdmin, async (req, res) => {
  try {
    await StickerPack.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// API: Вкл/выкл стикерпак
router.post("/api/stickers/:id/toggle", checkAdmin, express.json(), async (req, res) => {
  try {
    const { isActive } = req.body;
    const pack = await StickerPack.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    );
    res.json({ success: true, pack });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// API: Загрузить стикерпак из файлов
router.post("/api/stickers/upload", checkAdmin, uploadStickers.array("stickers", 100), async (req, res) => {
  try {
    const { packName } = req.body;
    const files = req.files;

    if (!packName) {
      return res.status(400).json({ error: "Укажите название стикерпака" });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "Загрузите хотя бы один файл" });
    }

    // Создаём shortName из названия
    const shortName = packName.toLowerCase().replace(/[^a-z0-9]/g, "_") + "_" + Date.now();

    // Обрабатываем файлы
    const stickers = files.map((file, idx) => {
      const ext = path.extname(file.originalname).toLowerCase();
      let type = "static";
      if (ext === ".tgs") type = "animated";
      if (ext === ".webm") type = "video";
      if (ext === ".gif") type = "static"; // gif как static

      return {
        fileId: file.filename,
        url: `/uploads/stickers/${file.filename}`,
        type,
        emoji: "😀",
        width: 512,
        height: 512,
      };
    });

    // Определяем тип пака
    let packType = "regular";
    if (stickers.some(s => s.type === "animated")) packType = "animated";
    if (stickers.some(s => s.type === "video")) packType = "video";

    // Сохраняем в базу
    const pack = await StickerPack.create({
      name: packName,
      shortName,
      title: packName,
      packType,
      thumbnail: stickers[0]?.url || null,
      stickers,
      sourceUrl: "local",
      isActive: true,
    });

    res.json({ success: true, pack });
  } catch (err) {
    console.error("Sticker upload error:", err);
    res.status(400).json({ error: err.message });
  }
});

// ============ PREMIUM EMOJI ============

// Настройка папки для emoji
const emojiDir = path.join(__dirname, "uploads", "emoji");
if (!fs.existsSync(emojiDir)) {
  fs.mkdirSync(emojiDir, { recursive: true });
}

const emojiStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, emojiDir),
  filename: (req, file, cb) => {
    const uniqueName = crypto.randomBytes(16).toString("hex") + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const uploadEmoji = multer({
  storage: emojiStorage,
  fileFilter: (req, file, cb) => {
    const allowed = [".tgs", ".webp", ".webm", ".png", ".gif"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Неподдерживаемый формат файла"));
    }
  }
});

// API: Получить все emoji-паки
router.get("/api/emoji", checkAdmin, async (req, res) => {
  try {
    const packs = await EmojiPack.find().sort({ createdAt: -1 });
    res.json({ success: true, packs });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// API: Импорт emoji-пака из Telegram
router.post("/api/emoji/import", checkAdmin, express.json(), async (req, res) => {
  try {
    const { url } = req.body;
    
    // Парсим ссылку на emoji-пак
    // Форматы: https://t.me/addemoji/PackName или просто PackName
    let shortName = url;
    if (url.includes('t.me/addemoji/')) {
      shortName = url.split('t.me/addemoji/')[1].split(/[?#]/)[0];
    } else if (url.includes('t.me/')) {
      shortName = url.split('t.me/')[1].split(/[?#]/)[0];
    }
    
    if (!shortName) {
      return res.status(400).json({ error: "Неверная ссылка на emoji-пак" });
    }

    // Проверяем, не импортирован ли уже
    const existing = await EmojiPack.findOne({ shortName });
    if (existing) {
      return res.status(400).json({ error: "Этот emoji-пак уже импортирован" });
    }

    // Получаем emoji-пак через Telegram Bot API
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      return res.status(400).json({ error: "TELEGRAM_BOT_TOKEN не настроен в .env" });
    }

    // Получаем информацию о custom emoji set
    // Используем getCustomEmojiStickers для получения emoji по ID
    // Сначала пробуем getStickerSet (работает и для emoji)
    const stickerSetRes = await fetch(`https://api.telegram.org/bot${botToken}/getStickerSet?name=${encodeURIComponent(shortName)}`);
    const stickerSetData = await stickerSetRes.json();
    
    if (!stickerSetData.ok) {
      return res.status(400).json({ error: "Emoji-пак не найден: " + (stickerSetData.description || "Unknown error") });
    }

    const stickerSet = stickerSetData.result;
    
    // Проверяем что это custom emoji
    if (stickerSet.sticker_type !== 'custom_emoji') {
      return res.status(400).json({ error: "Это не emoji-пак. Используйте ссылку вида t.me/addemoji/PackName" });
    }
    
    // Определяем тип пака
    let packType = "regular";
    if (stickerSet.is_animated) packType = "animated";
    if (stickerSet.is_video) packType = "video";

    // Скачиваем emoji локально
    const emojis = [];
    for (const sticker of stickerSet.stickers) {
      // Получаем файл
      const fileRes = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${sticker.file_id}`);
      const fileData = await fileRes.json();
      
      if (fileData.ok) {
        const telegramUrl = `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`;
        
        // Определяем тип и расширение
        let type = "static";
        let ext = ".webp";
        if (sticker.is_animated) { type = "animated"; ext = ".tgs"; }
        if (sticker.is_video) { type = "video"; ext = ".webm"; }
        
        // Скачиваем файл локально
        const fileName = crypto.randomBytes(16).toString("hex") + ext;
        const filePath = path.join(emojiDir, fileName);
        
        try {
          const fileResponse = await fetch(telegramUrl);
          const buffer = Buffer.from(await fileResponse.arrayBuffer());
          fs.writeFileSync(filePath, buffer);
          
          emojis.push({
            customEmojiId: sticker.custom_emoji_id,
            fileId: sticker.file_id,
            url: `/uploads/emoji/${fileName}`,
            type,
            emoji: sticker.emoji || "😀",
            width: sticker.width,
            height: sticker.height,
          });
        } catch (downloadErr) {
          console.error("Failed to download emoji:", downloadErr);
        }
      }
    }

    // Получаем превью (первый emoji)
    let thumbnail = emojis[0]?.url || null;
    if (stickerSet.thumbnail) {
      const thumbRes = await fetch(`https://api.telegram.org/bot${botToken}/getFile?file_id=${stickerSet.thumbnail.file_id}`);
      const thumbData = await thumbRes.json();
      if (thumbData.ok) {
        const telegramThumbUrl = `https://api.telegram.org/file/bot${botToken}/${thumbData.result.file_path}`;
        const thumbExt = thumbData.result.file_path.includes(".tgs") ? ".tgs" : 
                         thumbData.result.file_path.includes(".webm") ? ".webm" : ".webp";
        const thumbFileName = crypto.randomBytes(16).toString("hex") + thumbExt;
        const thumbPath = path.join(emojiDir, thumbFileName);
        
        try {
          const thumbResponse = await fetch(telegramThumbUrl);
          const thumbBuffer = Buffer.from(await thumbResponse.arrayBuffer());
          fs.writeFileSync(thumbPath, thumbBuffer);
          thumbnail = `/uploads/emoji/${thumbFileName}`;
        } catch (thumbErr) {
          console.error("Failed to download thumbnail:", thumbErr);
        }
      }
    }

    // Сохраняем в базу
    const pack = await EmojiPack.create({
      name: stickerSet.name,
      shortName: shortName,
      title: stickerSet.title,
      packType,
      thumbnail,
      emojis,
      sourceUrl: url,
      isActive: true,
      isPremium: true,
    });

    res.json({ success: true, pack });
  } catch (err) {
    console.error("Emoji import error:", err);
    res.status(400).json({ error: err.message });
  }
});

// API: Удалить emoji-пак
router.delete("/api/emoji/:id", checkAdmin, async (req, res) => {
  try {
    await EmojiPack.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// API: Вкл/выкл emoji-пак
router.post("/api/emoji/:id/toggle", checkAdmin, express.json(), async (req, res) => {
  try {
    const { isActive } = req.body;
    const pack = await EmojiPack.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    );
    res.json({ success: true, pack });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// API: Загрузить emoji-пак из файлов
router.post("/api/emoji/upload", checkAdmin, uploadEmoji.array("emojis", 100), async (req, res) => {
  try {
    const { packName } = req.body;
    const files = req.files;

    if (!packName) {
      return res.status(400).json({ error: "Укажите название emoji-пака" });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({ error: "Загрузите хотя бы один файл" });
    }

    // Создаём shortName из названия
    const shortName = packName.toLowerCase().replace(/[^a-z0-9]/g, "_") + "_" + Date.now();

    // Обрабатываем файлы
    const emojis = files.map((file, idx) => {
      const ext = path.extname(file.originalname).toLowerCase();
      let type = "static";
      if (ext === ".tgs") type = "animated";
      if (ext === ".webm") type = "video";
      if (ext === ".gif") type = "static";

      return {
        customEmojiId: `local_${file.filename}`,
        fileId: file.filename,
        url: `/uploads/emoji/${file.filename}`,
        type,
        emoji: "😀",
        width: 100,
        height: 100,
      };
    });

    // Определяем тип пака
    let packType = "regular";
    if (emojis.some(e => e.type === "animated")) packType = "animated";
    if (emojis.some(e => e.type === "video")) packType = "video";

    // Сохраняем в базу
    const pack = await EmojiPack.create({
      name: packName,
      shortName,
      title: packName,
      packType,
      thumbnail: emojis[0]?.url || null,
      emojis,
      sourceUrl: "local",
      isActive: true,
      isPremium: true,
    });

    res.json({ success: true, pack });
  } catch (err) {
    console.error("Emoji upload error:", err);
    res.status(400).json({ error: err.message });
  }
});

// ============ ПУБЛИЧНОЕ API СТИКЕРОВ (для клиента) ============

// Получить все активные стикерпаки (без авторизации админа)
router.get("/api/public/stickers", async (req, res) => {
  try {
    const packs = await StickerPack.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, packs });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ============ ПУБЛИЧНОЕ API EMOJI (для клиента) ============

// Получить все активные emoji-паки (без авторизации админа)
router.get("/api/public/emoji", async (req, res) => {
  try {
    const packs = await EmojiPack.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, packs });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
