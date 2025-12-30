const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  // Название подарка
  name: {
    type: String,
    required: true,
  },
  // Эмодзи/иконка подарка (опционально)
  emoji: {
    type: String,
    default: "🎁",
  },
  // URL анимации (Lottie JSON или GIF)
  animationUrl: {
    type: String,
    default: null,
  },
  // Тип анимации: "lottie", "gif", "emoji", "tgs"
  animationType: {
    type: String,
    enum: ["lottie", "gif", "emoji", "tgs"],
    default: "emoji",
  },
  // URL для TGS файла (Telegram Sticker)
  tgsUrl: {
    type: String,
    default: null,
  },
  // Цена в Stars
  price: {
    type: Number,
    required: true,
    min: 1,
  },
  // Общее количество (null = безлимитный)
  totalSupply: {
    type: Number,
    default: null,
  },
  // Сколько уже отправлено
  soldCount: {
    type: Number,
    default: 0,
  },
  // Процент конвертации в Stars (от цены)
  convertRate: {
    type: Number,
    default: 0.85,
    min: 0,
    max: 1,
  },
  // Активен ли подарок
  isActive: {
    type: Boolean,
    default: true,
  },
  // === UPGRADE / NFT ===
  // Можно ли улучшить этот подарок
  canUpgrade: {
    type: Boolean,
    default: false,
  },
  // Цена улучшения в Stars
  upgradePrice: {
    type: Number,
    default: 0,
  },
  // Доступные модели для upgrade (варианты внешнего вида)
  upgradeModels: [{
    name: String,
    animationUrl: String,
    animationType: {
      type: String,
      enum: ["lottie", "gif", "tgs"],
    },
    tgsUrl: String,
    rarityPermille: Number, // редкость в промилле (1000 = 100%)
  }],
  // Доступные паттерны для upgrade
  upgradePatterns: [{
    name: String,
    patternUrl: String,
    rarityPermille: Number,
  }],
  // Доступные фоны для upgrade
  upgradeBackdrops: [{
    name: String,
    centerColor: String,
    edgeColor: String,
    patternColor: String,
    textColor: String,
    rarityPermille: Number,
  }],
  // Дата создания
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Gift", Schema);
