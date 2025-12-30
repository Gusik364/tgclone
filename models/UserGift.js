const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  // Подарок
  gift: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Gift",
    required: true,
  },
  // Кто отправил
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // Кому отправили
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // Сообщение к подарку
  message: {
    type: String,
    maxlength: 255,
    default: "",
  },
  // Скрыт ли отправитель
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  // Показывать ли в профиле
  isDisplayed: {
    type: Boolean,
    default: true,
  },
  // Конвертирован ли в Stars
  isConverted: {
    type: Boolean,
    default: false,
  },
  // Сколько Stars получено при конвертации
  convertedStars: {
    type: Number,
    default: 0,
  },
  // === UPGRADE / NFT ===
  // Улучшен ли подарок
  isUpgraded: {
    type: Boolean,
    default: false,
  },
  // Уникальный номер NFT (для upgraded подарков)
  uniqueNum: {
    type: Number,
    default: null,
  },
  // Slug для ссылки на NFT
  slug: {
    type: String,
    default: null,
    sparse: true,
  },
  // Выбранная модель при upgrade
  upgradeModel: {
    name: String,
    animationUrl: String,
    animationType: String,
    tgsUrl: String,
    rarityPermille: Number,
  },
  // Выбранный паттерн при upgrade
  upgradePattern: {
    name: String,
    patternUrl: String,
    rarityPermille: Number,
  },
  // Выбранный фон при upgrade
  upgradeBackdrop: {
    name: String,
    centerColor: String,
    edgeColor: String,
    patternColor: String,
    textColor: String,
    rarityPermille: Number,
  },
  // Дата upgrade
  upgradedAt: {
    type: Date,
    default: null,
  },
  // Дата отправки
  sentAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("UserGift", Schema);
