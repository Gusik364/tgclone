/**
 * Bot Controller - обработка команд бота TestBot
 */

const User = require("../models/User");
const Gift = require("../models/Gift");
const UserGift = require("../models/UserGift");
const ChatRoom = require("../models/ChatRoom");
const { addMessageToChatRoom } = require("../controllers/chatRoomController");

// ID бота (будет установлен при инициализации)
let testBotId = null;

// Форматирование времени для логов
function logTime() {
  return new Date().toLocaleString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

// Логирование входящего сообщения
function logIncoming(username, userId, message) {
  console.log(`\n${"═".repeat(50)}`);
  console.log(`📩 [${logTime()}] ВХОДЯЩЕЕ СООБЩЕНИЕ`);
  console.log(`   От: ${username} (${userId})`);
  console.log(`   Текст: "${message}"`);
  console.log(`${"─".repeat(50)}`);
}

// Логирование исходящего сообщения
function logOutgoing(text) {
  console.log(`📤 [${logTime()}] ОТВЕТ БОТА`);
  console.log(`   Текст: "${text}"`);
  console.log(`${"═".repeat(50)}\n`);
}

// Инициализация бота - получаем ID из базы
async function initBot() {
  try {
    const testBot = await User.findOne({ username: "testbot" });
    if (testBot) {
      testBotId = testBot._id.toString();
      console.log("\n" + "═".repeat(50));
      console.log("🤖 TestBot ЗАПУЩЕН");
      console.log(`   ID: ${testBotId}`);
      console.log(`   Username: testbot`);
      console.log("   Команды: /gifts, /help");
      console.log("═".repeat(50) + "\n");
    } else {
      console.log("⚠️ TestBot not found. Run: python scripts/create_testbot.py");
    }
  } catch (error) {
    console.error("❌ Error initializing bot:", error.message);
  }
}

// Отправить подарки пользователю
async function sendGiftsToUser(userId, io, chatRoomId) {
  try {
    // Получаем 3 случайных подарка
    const gifts = await Gift.aggregate([
      { $match: { isActive: true } },
      { $sample: { size: 3 } },
    ]);

    if (gifts.length === 0) {
      return { success: false, message: "Нет доступных подарков" };
    }

    const sentGifts = [];

    for (const gift of gifts) {
      // Создаём запись о подарке
      const userGift = await UserGift.create({
        gift: gift._id,
        from: testBotId,
        to: userId,
        message: "🎁 Подарок от TestBot!",
        isAnonymous: false,
      });

      // Увеличиваем счётчик проданных
      await Gift.findByIdAndUpdate(gift._id, { $inc: { soldCount: 1 } });

      sentGifts.push(gift.name);
    }

    return { 
      success: true, 
      message: `Отправлено ${sentGifts.length} подарков: ${sentGifts.join(", ")}` 
    };
  } catch (error) {
    console.error("❌ Error sending gifts:", error);
    return { success: false, message: "Ошибка при отправке подарков" };
  }
}

// Отправить сообщение от бота
async function sendBotMessage(chatRoomId, text, io) {
  try {
    const message = {
      messageType: "Text",
      sender: testBotId,
      message: text,
      timeSent: new Date(),
      readStatus: false,
      deliveredStatus: true,
      undeliveredMembers: [],
      unreadMembers: [],
    };

    const { messageObj, day } = await addMessageToChatRoom(chatRoomId, message);

    if (messageObj) {
      io.to(chatRoomId).emit("user:message", {
        chatRoomId,
        message: messageObj,
        day,
        userId: testBotId,
      });
    }
  } catch (error) {
    console.error("❌ Error sending bot message:", error);
  }
}

// Обработчик команд бота
exports.botCommandController = (io, socket) => {
  // Инициализируем бота при первом подключении
  if (!testBotId) {
    initBot();
  }

  socket.on("bot:command", async (data) => {
    const { command, chatRoomId, userId } = data;

    if (!testBotId) {
      console.log("⚠️ Bot not initialized");
      return;
    }

    console.log(`🤖 Bot command received: ${command} from user ${userId}`);

    switch (command) {
      case "/gifts":
        // Отправляем подарки
        const result = await sendGiftsToUser(userId, io, chatRoomId);

        // Отправляем результат
        if (result.success) {
          await sendBotMessage(chatRoomId, "✅ Успешно!", io);
        } else {
          await sendBotMessage(chatRoomId, `❌ ${result.message}`, io);
        }
        break;

      case "/help":
        await sendBotMessage(
          chatRoomId,
          "🤖 Доступные команды:\n/gifts - получить 3 случайных подарка\n/help - показать справку",
          io
        );
        break;

      default:
        await sendBotMessage(
          chatRoomId,
          "❓ Неизвестная команда. Напиши /help для списка команд.",
          io
        );
    }
  });
};

// Проверка сообщения на команду бота
exports.checkBotCommand = async (message, chatRoomId, userId, io) => {
  if (!testBotId) {
    await initBot();
  }

  if (!testBotId || !message || typeof message !== "string") {
    return false;
  }

  // Проверяем, что это чат с ботом
  const chatRoom = await ChatRoom.findById(chatRoomId);
  if (!chatRoom || !chatRoom.members.some(m => m.toString() === testBotId)) {
    return false;
  }

  const text = message.trim().toLowerCase();

  if (text.startsWith("/")) {
    const command = text.split(" ")[0];

    switch (command) {
      case "/gifts":
        const result = await sendGiftsToUser(userId, io, chatRoomId);
        if (result.success) {
          await sendBotMessage(chatRoomId, "✅ Успешно!", io);
        } else {
          await sendBotMessage(chatRoomId, `❌ ${result.message}`, io);
        }
        return true;

      case "/help":
        await sendBotMessage(
          chatRoomId,
          "🤖 Доступные команды:\n/gifts - получить 3 случайных подарка\n/help - показать справку",
          io
        );
        return true;

      default:
        await sendBotMessage(
          chatRoomId,
          "❓ Неизвестная команда. Напиши /help для списка команд.",
          io
        );
        return true;
    }
  }

  return false;
};

exports.initBot = initBot;
