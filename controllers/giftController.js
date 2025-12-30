const Gift = require("../models/Gift");
const UserGift = require("../models/UserGift");
const User = require("../models/User");
const ReqError = require("../utilities/ReqError");
const catchAsyncError = require("../utilities/catchAsyncError");

// Получить каталог подарков
exports.getGifts = catchAsyncError(async (req, res, next) => {
  const gifts = await Gift.find({ isActive: true }).sort({ price: 1 });

  res.status(200).json({
    status: "success",
    data: { gifts },
  });
});

// Отправить подарок
exports.sendGift = catchAsyncError(async (req, res, next) => {
  const { giftId, toUserId, message, isAnonymous, withUpgrade } = req.body;
  const fromUserId = req.cookies.userId;

  if (!giftId || !toUserId) {
    return next(new ReqError(400, "Gift ID and recipient required"));
  }

  if (fromUserId === toUserId) {
    return next(new ReqError(400, "Cannot send gift to yourself"));
  }

  const gift = await Gift.findById(giftId);
  if (!gift || !gift.isActive) {
    return next(new ReqError(404, "Gift not found"));
  }

  if (gift.totalSupply && gift.soldCount >= gift.totalSupply) {
    return next(new ReqError(400, "Gift sold out"));
  }

  const sender = await User.findById(fromUserId);
  if (!sender) {
    return next(new ReqError(404, "Sender not found"));
  }

  const upgradePrice = withUpgrade && gift.canUpgrade ? (gift.upgradePrice || 0) : 0;
  const totalPrice = gift.price + upgradePrice;

  if (sender.stars < totalPrice) {
    return next(new ReqError(400, "Not enough Stars"));
  }

  const recipient = await User.findById(toUserId);
  if (!recipient) {
    return next(new ReqError(404, "Recipient not found"));
  }

  sender.stars -= totalPrice;
  await sender.save({ validateBeforeSave: false });

  gift.soldCount += 1;
  await gift.save();

  const userGiftData = {
    gift: giftId,
    from: fromUserId,
    to: toUserId,
    message: message || "",
    isAnonymous: isAnonymous || false,
  };

  if (withUpgrade && gift.canUpgrade) {
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

    const totalUpgraded = await UserGift.countDocuments({ gift: giftId, isUpgraded: true });
    const uniqueNum = totalUpgraded + 1;
    const slug = `${giftId.toString().slice(-6)}-${uniqueNum}-${Date.now().toString(36)}`;

    userGiftData.isUpgraded = true;
    userGiftData.uniqueNum = uniqueNum;
    userGiftData.slug = slug;
    userGiftData.upgradeModel = selectRandom(gift.upgradeModels);
    userGiftData.upgradePattern = selectRandom(gift.upgradePatterns);
    userGiftData.upgradeBackdrop = selectRandom(gift.upgradeBackdrops);
    userGiftData.upgradedAt = new Date();
  }

  const userGift = await UserGift.create(userGiftData);
  await userGift.populate(["gift", "from", "to"]);

  res.status(201).json({
    status: "success",
    data: { userGift, newBalance: sender.stars },
  });
});

// Мои полученные подарки
exports.getMyGifts = catchAsyncError(async (req, res, next) => {
  const userId = req.cookies.userId;

  const gifts = await UserGift.find({ to: userId })
    .populate("gift")
    .populate("from", "name username avatar")
    .sort({ sentAt: -1 });

  const processedGifts = gifts.map((g) => {
    const obj = g.toObject();
    if (obj.isAnonymous) {
      obj.from = { name: "Anonymous", username: "anonymous", avatar: null };
    }
    return obj;
  });

  res.status(200).json({
    status: "success",
    data: { gifts: processedGifts },
  });
});

// Подарки пользователя (для профиля)
exports.getUserGifts = catchAsyncError(async (req, res, next) => {
  const { userId } = req.params;

  const gifts = await UserGift.find({ to: userId, isDisplayed: true })
    .populate("gift")
    .populate("from", "name username avatar")
    .sort({ sentAt: -1 });

  const processedGifts = gifts.map((g) => {
    const obj = g.toObject();
    if (obj.isAnonymous) {
      obj.from = { name: "Anonymous", username: "anonymous", avatar: null };
    }
    return obj;
  });

  res.status(200).json({
    status: "success",
    data: { gifts: processedGifts },
  });
});

// Конвертировать подарок в Stars
exports.convertGift = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.cookies.userId;

  const userGift = await UserGift.findById(id).populate("gift");

  if (!userGift) return next(new ReqError(404, "Gift not found"));
  if (userGift.to.toString() !== userId) return next(new ReqError(403, "This gift is not yours"));
  if (userGift.isConverted) return next(new ReqError(400, "Gift already converted"));

  const starsToAdd = Math.floor(userGift.gift.price * userGift.gift.convertRate);

  const user = await User.findById(userId);
  user.stars += starsToAdd;
  await user.save({ validateBeforeSave: false });

  userGift.isConverted = true;
  userGift.convertedStars = starsToAdd;
  userGift.isDisplayed = false;
  await userGift.save();

  res.status(200).json({
    status: "success",
    data: { starsReceived: starsToAdd, newBalance: user.stars },
  });
});

// Скрыть/показать подарок в профиле
exports.toggleGiftDisplay = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.cookies.userId;

  const userGift = await UserGift.findById(id);

  if (!userGift) return next(new ReqError(404, "Gift not found"));
  if (userGift.to.toString() !== userId) return next(new ReqError(403, "This gift is not yours"));
  if (userGift.isConverted) return next(new ReqError(400, "Cannot display converted gift"));

  userGift.isDisplayed = !userGift.isDisplayed;
  await userGift.save();

  res.status(200).json({
    status: "success",
    data: { isDisplayed: userGift.isDisplayed },
  });
});

// Надеть подарок
exports.wearGift = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.cookies.userId;

  const userGift = await UserGift.findById(id).populate("gift");

  if (!userGift) return next(new ReqError(404, "Gift not found"));
  if (userGift.to.toString() !== userId) return next(new ReqError(403, "This gift is not yours"));
  if (userGift.isConverted) return next(new ReqError(400, "Cannot wear converted gift"));

  const user = await User.findById(userId);
  user.wornGift = id;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    data: { wornGift: userGift },
  });
});

// Снять подарок
exports.unwearGift = catchAsyncError(async (req, res, next) => {
  const userId = req.cookies.userId;

  const user = await User.findById(userId);
  user.wornGift = null;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: "success",
    data: { wornGift: null },
  });
});

// Баланс Stars
exports.getStarsBalance = catchAsyncError(async (req, res, next) => {
  const userId = req.cookies.userId;
  const user = await User.findById(userId).select("stars");

  res.status(200).json({
    status: "success",
    data: { stars: user.stars },
  });
});

// Получить надетый подарок пользователя
exports.getWornGift = catchAsyncError(async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findById(userId).select("wornGift");
  
  if (!user || !user.wornGift) {
    return res.status(200).json({
      status: "success",
      data: { wornGift: null },
    });
  }

  const userGift = await UserGift.findById(user.wornGift).populate("gift");

  res.status(200).json({
    status: "success",
    data: { wornGift: userGift },
  });
});

// Создать подарок (админ)
exports.createGift = catchAsyncError(async (req, res, next) => {
  const { name, emoji, price, totalSupply, convertRate } = req.body;

  const gift = await Gift.create({
    name,
    emoji,
    price,
    totalSupply: totalSupply || null,
    convertRate: convertRate || 0.85,
  });

  res.status(201).json({
    status: "success",
    data: { gift },
  });
});

// Получить превью upgrade
exports.getUpgradePreview = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const userGift = await UserGift.findById(id).populate("gift");

  if (!userGift) return next(new ReqError(404, "Gift not found"));
  if (!userGift.gift.canUpgrade) return next(new ReqError(400, "This gift cannot be upgraded"));
  if (userGift.isUpgraded) return next(new ReqError(400, "Gift already upgraded"));

  res.status(200).json({
    status: "success",
    data: {
      upgradePrice: userGift.gift.upgradePrice,
      models: userGift.gift.upgradeModels || [],
      patterns: userGift.gift.upgradePatterns || [],
      backdrops: userGift.gift.upgradeBackdrops || [],
    },
  });
});

// Улучшить подарок до NFT
exports.upgradeGift = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.cookies.userId;

  const userGift = await UserGift.findById(id).populate("gift");

  if (!userGift) return next(new ReqError(404, "Gift not found"));
  if (userGift.to.toString() !== userId) return next(new ReqError(403, "This gift is not yours"));
  if (!userGift.gift.canUpgrade) return next(new ReqError(400, "This gift cannot be upgraded"));
  if (userGift.isUpgraded) return next(new ReqError(400, "Gift already upgraded"));
  if (userGift.isConverted) return next(new ReqError(400, "Cannot upgrade converted gift"));

  const user = await User.findById(userId);
  const upgradePrice = userGift.gift.upgradePrice || 0;

  if (user.stars < upgradePrice) return next(new ReqError(400, "Not enough Stars"));

  user.stars -= upgradePrice;
  await user.save({ validateBeforeSave: false });

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

  const totalUpgraded = await UserGift.countDocuments({ gift: userGift.gift._id, isUpgraded: true });
  const uniqueNum = totalUpgraded + 1;
  const slug = `${userGift.gift._id.toString().slice(-6)}-${uniqueNum}-${Date.now().toString(36)}`;

  userGift.isUpgraded = true;
  userGift.uniqueNum = uniqueNum;
  userGift.slug = slug;
  userGift.upgradeModel = selectRandom(userGift.gift.upgradeModels);
  userGift.upgradePattern = selectRandom(userGift.gift.upgradePatterns);
  userGift.upgradeBackdrop = selectRandom(userGift.gift.upgradeBackdrops);
  userGift.upgradedAt = new Date();
  await userGift.save();

  await userGift.populate(["gift", "from", "to"]);

  res.status(200).json({
    status: "success",
    data: { userGift, newBalance: user.stars },
  });
});

// Обновить настройки upgrade для подарка (админ)
exports.updateGiftUpgrade = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { canUpgrade, upgradePrice, upgradeModels, upgradePatterns, upgradeBackdrops } = req.body;

  const gift = await Gift.findById(id);
  if (!gift) return next(new ReqError(404, "Gift not found"));

  if (canUpgrade !== undefined) gift.canUpgrade = canUpgrade;
  if (upgradePrice !== undefined) gift.upgradePrice = upgradePrice;
  if (upgradeModels !== undefined) gift.upgradeModels = upgradeModels;
  if (upgradePatterns !== undefined) gift.upgradePatterns = upgradePatterns;
  if (upgradeBackdrops !== undefined) gift.upgradeBackdrops = upgradeBackdrops;

  await gift.save();

  res.status(200).json({
    status: "success",
    data: { gift },
  });
});

// Передать NFT другому пользователю
exports.transferGift = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { toUserId } = req.body;
  const userId = req.cookies.userId;

  if (!toUserId) {
    return next(new ReqError(400, "Recipient required"));
  }

  if (userId === toUserId) {
    return next(new ReqError(400, "Cannot transfer to yourself"));
  }

  const userGift = await UserGift.findById(id).populate("gift");

  if (!userGift) return next(new ReqError(404, "Gift not found"));
  if (userGift.to.toString() !== userId) return next(new ReqError(403, "This gift is not yours"));
  if (userGift.isConverted) return next(new ReqError(400, "Cannot transfer converted gift"));

  const recipient = await User.findById(toUserId);
  if (!recipient) return next(new ReqError(404, "Recipient not found"));

  // Если это надетый подарок - снимаем его
  const currentOwner = await User.findById(userId);
  if (currentOwner.wornGift && currentOwner.wornGift.toString() === id) {
    currentOwner.wornGift = null;
    await currentOwner.save({ validateBeforeSave: false });
  }

  // Передаём подарок
  const previousOwner = userGift.to;
  userGift.to = toUserId;
  userGift.isAnonymous = false; // При передаче отправитель виден
  await userGift.save();

  await userGift.populate(["gift", "from", "to"]);

  res.status(200).json({
    status: "success",
    data: { 
      userGift,
      previousOwner,
      newOwner: toUserId,
    },
  });
});
