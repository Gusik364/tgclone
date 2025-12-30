const mongoose = require("mongoose");

const customEmojiSchema = new mongoose.Schema({
  // ID эмодзи в Telegram
  customEmojiId: String,
  // ID файла
  fileId: String,
  // URL эмодзи (webp, tgs или webm)
  url: String,
  // Тип: static (webp), animated (tgs), video (webm)
  type: {
    type: String,
    enum: ["static", "animated", "video"],
    default: "static",
  },
  // Связанный эмодзи
  emoji: String,
  // Размеры
  width: Number,
  height: Number,
});

const emojiPackSchema = new mongoose.Schema({
  // Название пака
  name: {
    type: String,
    required: true,
  },
  // Короткое имя (slug) для ссылки
  shortName: {
    type: String,
    required: true,
    unique: true,
  },
  // Заголовок пака
  title: {
    type: String,
    required: true,
  },
  // Тип пака: regular, animated, video
  packType: {
    type: String,
    enum: ["regular", "animated", "video"],
    default: "regular",
  },
  // Превью (первый эмодзи)
  thumbnail: String,
  // Эмодзи в паке
  emojis: [customEmojiSchema],
  // Источник импорта
  sourceUrl: String,
  // Активен ли пак
  isActive: {
    type: Boolean,
    default: true,
  },
  // Premium only
  isPremium: {
    type: Boolean,
    default: true,
  },
  // Дата создания
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("EmojiPack", emojiPackSchema);
