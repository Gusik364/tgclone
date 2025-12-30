const mongoose = require("mongoose");

const stickerSchema = new mongoose.Schema({
  // ID стикера в паке
  fileId: String,
  // URL стикера (webp, tgs или webm)
  url: String,
  // Тип: static (webp), animated (tgs), video (webm)
  type: {
    type: String,
    enum: ["static", "animated", "video"],
    default: "static",
  },
  // Эмодзи связанный со стикером
  emoji: String,
  // Размеры
  width: Number,
  height: Number,
});

const stickerPackSchema = new mongoose.Schema({
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
  // Превью (первый стикер)
  thumbnail: String,
  // Стикеры в паке
  stickers: [stickerSchema],
  // Источник импорта
  sourceUrl: String,
  // Активен ли пак
  isActive: {
    type: Boolean,
    default: true,
  },
  // Дата создания
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("StickerPack", stickerPackSchema);
