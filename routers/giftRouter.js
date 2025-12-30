const express = require("express");
const giftController = require("../controllers/giftController");

const router = express.Router();

// Каталог подарков
router.get("/", giftController.getGifts);

// Все подарки (без авторизации)
router.get("/all", giftController.getGifts);

// Отправить подарок
router.post("/send", giftController.sendGift);

// Мои полученные подарки
router.get("/my", giftController.getMyGifts);

// Баланс Stars
router.get("/stars", giftController.getStarsBalance);

// Подарки пользователя (для профиля)
router.get("/user/:userId", giftController.getUserGifts);

// Надетый подарок пользователя
router.get("/user/:userId/worn", giftController.getWornGift);

// Конвертировать подарок в Stars
router.post("/:id/convert", giftController.convertGift);

// Скрыть/показать подарок
router.patch("/:id/toggle-display", giftController.toggleGiftDisplay);

// Надеть подарок
router.post("/:id/wear", giftController.wearGift);

// Снять подарок
router.post("/unwear", giftController.unwearGift);



// Создать подарок (админ)
router.post("/create", giftController.createGift);

// Обновить настройки upgrade для подарка (админ)
router.patch("/:id/upgrade-settings", giftController.updateGiftUpgrade);

module.exports = router;
