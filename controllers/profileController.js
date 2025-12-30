const catchAsyncError = require("../utilities/catchAsyncError");
const ReqError = require("../utilities/ReqError");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const UserGift = require("../models/UserGift");

exports.getSelfProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.cookies.userId).select(
    "-contacts -password -__v"
  );

  if (!user) return next(new ReqError(400, "User does not exist"));

  res.status(200).json({
    status: "Success",
    data: {
      user,
    },
  });
});

exports.updateSelfProfile = catchAsyncError(async (req, res, next) => {
  // This action should send a message to all sockets to update username if user changes username
  const user = await User.findByIdAndUpdate(req.cookies.userId, req.body, {
    new: true,
  });

  if (!user) return next(new ReqError(400, "User does not exist"));

  res.status(200).json({
    status: "Success",
    data: {
      user,
    },
  });
});

// Удаление аккаунта
exports.deleteAccount = catchAsyncError(async (req, res, next) => {
  const { password } = req.body;
  const userId = req.cookies.userId;

  // Найти пользователя
  const user = await User.findById(userId);
  if (!user) return next(new ReqError(400, "User does not exist"));

  // Проверить пароль
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return next(new ReqError(401, "Incorrect password"));
  }

  // Помечаем аккаунт как удалённый (не удаляем физически)
  user.isDeleted = true;
  user.deletedAt = new Date();
  user.name = "Deleted Account";
  user.bio = "";
  user.avatar = "https://res.cloudinary.com/dlanhtzbw/image/upload/v1675343188/Telegram%20Clone/no-profile_aknbeq.jpg";
  user.status = { online: false, lastSeen: new Date() };
  await user.save({ validateBeforeSave: false });

  // Удалить подарки пользователя
  await UserGift.deleteMany({ $or: [{ from: userId }, { to: userId }] });

  // Очистить куки
  res.clearCookie("userId");
  res.clearCookie("token");

  res.status(200).json({
    status: "Success",
    message: "Account deleted successfully",
  });
});
