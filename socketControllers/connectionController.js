const {
  checkMembersOffUndeliveredListInMessage,
} = require("../controllers/chatRoomController");
const User = require("../models/User");

exports.getSocketDetails = async (userId) => {
  // Get user model
  const userModel = await User.findById(userId);

  // Если пользователь не найден, возвращаем пустые данные
  if (!userModel) {
    return { userModel: null, allRoomsUserIn: [] };
  }

  // Get all rooms
  const allRoomsUserIn = (userModel.chatRooms || []).map((room) => room.toString());

  return { userModel, allRoomsUserIn };
};

exports.onlineController = (io, socket) => {
  socket.on("user:online", async (userId) => {
    console.log("📡 user:online event received, userId:", userId, "Socket ID:", socket.id);
    
    if (!userId) {
      console.error("❌ user:online event received without userId");
      return;
    }
    
    socket.userId = userId;
    console.log("✅ User online - socket.userId set to:", socket.userId, "Socket ID:", socket.id);
    
    // Get user detaiils
    const { userModel, allRoomsUserIn } = await this.getSocketDetails(userId);

    // Если пользователь не найден, выходим
    if (!userModel) {
      console.error("❌ User not found in database:", userId);
      console.error("💡 Tip: Make sure user exists in MongoDB");
      return;
    }
    
    console.log("✅ User found in database, joining rooms:", allRoomsUserIn.length);

    //   Make user join rooms
    socket.join(allRoomsUserIn);

    //   Update database on status
    userModel.status = {
      online: true,
      lastSeen: undefined,
    };

    for (let properties of userModel.undeliveredMessages || []) {
      await checkMembersOffUndeliveredListInMessage({
        membersId: [userId],
        io,
        ...properties,
      });
    }

    userModel.undeliveredMessages = [];

    // Save user model
    await userModel.save({ validateBeforeSave: false });

    // Emit user online status in all rooms user is in
    socket.to(allRoomsUserIn).emit("user:online", userId);
  });
};

exports.offlineController = (io, socket) => {
  socket.on("user:offline", async () => {
    const { userId } = socket;
    if (!userId) return;
    
    // Get user detaiils
    const { userModel, allRoomsUserIn } = await this.getSocketDetails(userId);

    if (!userModel) return;

    const time = new Date(Date.now()).toISOString();

    userModel.status = {
      online: false,
      lastSeen: time,
    };

    await userModel.save({ validateBeforeSave: false });

    socket
      .to(allRoomsUserIn)
      .emit("user:offline", { userId: userModel._id, time });
  });
};

// socket disconnection
exports.disconnectingController = (io, socket) => {
  socket.on("disconnecting", async () => {
    if (!socket.userId) return;
    // Get user detaiils
    const { userModel, allRoomsUserIn } = await this.getSocketDetails(
      socket.userId
    );

    if (!userModel) return;

    const time = new Date(Date.now()).toISOString();

    userModel.status = {
      online: false,
      lastSeen: time,
    };

    await userModel.save({ validateBeforeSave: false });

    socket
      .to(allRoomsUserIn)
      .emit("user:offline", { userId: userModel._id, time });
  });
};

exports.joinRoomController = (io, socket) => {
  socket.on("user:joinRooms", ({ rooms }) => {
    socket.join(rooms);
  });
};
