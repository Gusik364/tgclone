const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const contactSchema = new mongoose.Schema({
  contactDetails: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  chatRoomId: mongoose.Schema.Types.ObjectId,
});

const Schema = new mongoose.Schema({
  // name
  name: {
    type: String,
    required: true,
  },
  // Username
  username: {
    unique: true,
    type: String,
    required: true,
    lower: true,
  },
  //   Bio, shouldn't be more than 100 characters
  bio: {
    type: String,
    min: 1,
    max: 100,
    default: "Hi there, I'm using Telegram",
  },
  //   User profile image (Avatar)
  avatar: {
    type: String,
    default:
      "https://res.cloudinary.com/dlanhtzbw/image/upload/v1675343188/Telegram%20Clone/no-profile_aknbeq.jpg",
  },
  //   User contacts
  contacts: [contactSchema],
  // Status, whether user is online or not
  status: {
    online: { type: Boolean, default: true },
    lastSeen: Date,
  },
  //   User password
  password: {
    type: String,
    required: true,
    min: [8, "Password too short"],
  },
  confirmPassword: {
    type: String,
    validate: {
      validator: function (givenPassword) {
        return givenPassword === this.password;
      },
      message: "Passwords do not match",
    },
  },
  // Chat rooms user belongs to
  chatRooms: [mongoose.Schema.Types.ObjectId],
  // Pinned chat rooms by user
  pinnedChatRooms: [],
  // Unread messages
  unreadMessages: [{}],
  // Undelivered messages
  undeliveredMessages: [{}],
  // Баланс Stars
  stars: {
    type: Number,
    default: 100,
    min: 0,
  },
  // Скрыть подарки от других пользователей
  hideGifts: {
    type: Boolean,
    default: false,
  },
  // Надетый подарок (отображается возле ника)
  wornGift: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserGift",
    default: null,
  },
  // Аккаунт удалён
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
  // Это бот
  isBot: {
    type: Boolean,
    default: false,
  },
  // Верифицированный аккаунт
  isVerified: {
    type: Boolean,
    default: false,
  },
  // === NFT СИСТЕМА ===
  // Анонимный номер (NFT)
  anonymousNumber: {
    type: String,
    default: null,
    sparse: true,
  },
  // NFT юзернеймы (как в Telegram) - массив
  nftUsernames: [{
    type: String,
  }],
  // Дата покупки NFT юзернейма
  nftUsernameAcquiredAt: {
    type: Date,
    default: null,
  },
  // Дата покупки анонимного номера
  anonymousNumberAcquiredAt: {
    type: Date,
    default: null,
  },
  // === СКАМ МЕТКА ===
  isScam: {
    type: Boolean,
    default: false,
  },
  // Причина скам метки
  scamReason: {
    type: String,
    default: null,
  },
  // Кто выдал скам метку (admin ID)
  scamMarkedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  // Дата выдачи скам метки
  scamMarkedAt: {
    type: Date,
    default: null,
  },
});

Schema.pre("save", async function (next) {
  if (!this.$isNew) this.$ignore("password");
});

Schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const hashedPassword = await bcrypt.hash(this.password, 12);
  this.password = hashedPassword;
  this.confirmPassword = undefined;
  next();
});

Schema.methods.checkPasswordValidity = async (
  givenPassword,
  originalPassword
) => await bcrypt.compare(givenPassword, originalPassword);

module.exports = mongoose.model("User", Schema);
