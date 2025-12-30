const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const app = express();
const authRouter = require("./routers/authRouter");
const contactsRouter = require("./routers/contactsRouter");
const chatRoomRouter = require("./routers/chatRoomRouter");
const profileRouter = require("./routers/profileRouter");
const uploadRouter = require("./routers/uploadRouter");
const giftRouter = require("./routers/giftRouter");
const adminRouter = require("./admin");
const ReqError = require("./utilities/ReqError");
const errorController = require("./controllers/errorController");

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000", "https://verbally-bustling-kiwi.cloudpub.ru"],
  credentials: true
}));

// Статическая раздача загруженных файлов
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/user", authRouter);
app.use("/admin", adminRouter);

// Временный эндпоинт для получения всех пользователей
app.get("/api/users/all", async (req, res) => {
  const User = require("./models/User");
  const users = await User.find({}, { _id: 1, username: 1, name: 1 });
  res.json(users);
});

// Публичный эндпоинт для каталога подарков
app.get("/api/gifts/all", async (req, res) => {
  const Gift = require("./models/Gift");
  const gifts = await Gift.find({ isActive: true }).sort({ price: 1 });
  res.json({ status: "success", data: { gifts } });
});

// Публичный эндпоинт для создания подарка (УДАЛИТЬ В ПРОДАКШЕНЕ!)
app.post("/api/gifts/create", async (req, res) => {
  const Gift = require("./models/Gift");
  const { name, emoji, animationType, animationUrl, tgsUrl, price, totalSupply, convertRate } = req.body;
  
  const gift = await Gift.create({
    name,
    emoji: emoji || "🎁",
    animationType: animationType || "emoji",
    animationUrl: animationUrl || null,
    tgsUrl: tgsUrl || null,
    price,
    totalSupply: totalSupply || null,
    convertRate: convertRate || 0.85,
  });
  
  res.status(201).json({ status: "success", data: { gift } });
});

// Временный эндпоинт для сброса пароля (УДАЛИТЬ В ПРОДАКШЕНЕ!)
app.post("/api/reset-password", async (req, res) => {
  const User = require("./models/User");
  const { userId, newPassword } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  res.json({ status: "success", message: "Password reset" });
});

// Сброс БД (УДАЛИТЬ В ПРОДАКШЕНЕ!)
app.get("/api/reset-db", async (req, res) => {
  const mongoose = require("mongoose");
  await mongoose.connection.dropDatabase();
  res.json({ message: "Database dropped!" });
});

// Protector
app.use("/api/*", (req, res, next) => {
  if (!req.cookies.userId)
    return next(new ReqError(400, "You are not logged in"));

  next();
});

app.use("/api/contacts", contactsRouter);
app.use("/api/profile", profileRouter);
app.use("/api/chatRoom", chatRoomRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/gifts", giftRouter);

// Error handle middleware
app.use(errorController);

module.exports = app;
