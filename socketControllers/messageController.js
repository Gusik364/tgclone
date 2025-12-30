const {
  addMessageToChatRoom,
  checkMembersOffUndeliveredListInMessage,
  addMessageAsUndeliveredToUser,
  addMessageAsUnreadToUser,
  markMessageAsReadByUser,
  getMessageFromChatRoom,
} = require("../controllers/chatRoomController");
const { checkBotCommand } = require("./botController");

exports.messagingController = (io, socket) => {
  socket.on("user:message", async (data) => {
    console.log("📨 user:message event received:", JSON.stringify(data, null, 2));
    console.log("🔍 Socket userId:", socket.userId);
    console.log("🔍 Socket ID:", socket.id);
    
    if (!data || !data.chatRoomId || !data.message) {
      console.error("❌ Invalid message data:", data);
      return;
    }
    
    const { chatRoomId, message } = data;
    
    if (!socket.userId) {
      console.error("❌ Message rejected: socket.userId is not set");
      console.error("💡 Tip: Make sure 'user:online' event was sent and processed");
      return;
    }
    
    console.log("✅ Message received from user:", socket.userId);
    console.log("ChatRoomId:", chatRoomId);
    console.log("Message type:", message.messageType);

    // Проверяем команды бота после сохранения сообщения пользователя
    const messageText = message.message || "";
    const isBotCommand = messageText.trim().startsWith("/");

    // Save message to database
    try {
      const { messageObj, day } = await addMessageToChatRoom(chatRoomId, message);
      if (!messageObj) {
        console.error("❌ Failed to save message to database");
        return;
      }
      console.log("✅ Message saved to database:", messageObj._id);

    // Broadcast message to room
    io.timeout(180000)
      .to(chatRoomId)
      .emit(
        "user:message",
        {
          chatRoomId,
          message: messageObj,
          day,
          userId: socket.userId,
        },
        async (error, membersId) => {
          if (error) {
            console.log(error);
          } else {
            // Unique identifier of a message in chatRoom
            const uniqueMessageDetails = {
              chatRoomId,
              day,
              messageId: messageObj._id,
            };

            // Remove members from undelivered list
            const { undeliveredMembers } =
              await checkMembersOffUndeliveredListInMessage({
                ...uniqueMessageDetails,
                membersId: membersId.map((id) => id.toString()),
                io,
              });

            // Add message as undelivered to members that aren't currently online
            await addMessageAsUndeliveredToUser({
              ...uniqueMessageDetails,
              undeliveredMembers,
            });

            // Add message as unread to all members of the room except sender of the messagee
            await addMessageAsUnreadToUser({
              ...uniqueMessageDetails,
              unreadMembers: messageObj.unreadMembers.filter(
                (memberId) =>
                  memberId.toString() !== messageObj.sender.toString()
              ),
            });

            // Emit to all users that message can be read
            io.to(chatRoomId).emit("user:messageCanBeRead", {
              ...uniqueMessageDetails,
              message: messageObj,
            });

            // Проверяем команды бота после отправки сообщения
            if (isBotCommand) {
              setTimeout(async () => {
                await checkBotCommand(messageText, chatRoomId, socket.userId, io);
              }, 500);
            }
          }
        }
      );
    } catch (error) {
      console.error("❌ Error processing message:", error);
    }
  });
};

exports.markMessageReadController = (io, socket) => {
  socket.on(
    "user:messageRead",
    async ({ messageId, chatRoomId, day, userId }) => {
      await markMessageAsReadByUser({ messageId, chatRoomId, day, userId, io });
    }
  );

  socket.on(
    "user:markMessagesAsRead",
    async ({ messages, chatRoomId, userId }) => {
      for (let { messageId, day } of messages) {
        await markMessageAsReadByUser({
          messageId,
          chatRoomId,
          day,
          userId,
          io,
        });
      }
    }
  );
};

