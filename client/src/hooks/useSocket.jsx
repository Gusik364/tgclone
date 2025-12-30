import { useSelector } from "react-redux";
import { io } from "socket.io-client";

// Определяем URL сокета автоматически
const getSocketUrl = () => {
  // Если есть переменная окружения - используем её
  if (process.env.REACT_APP_SOCKET_URL) {
    return process.env.REACT_APP_SOCKET_URL;
  }
  // В production используем текущий хост
  if (window.location.hostname !== "localhost") {
    return window.location.origin;
  }
  // В development используем порт 8080
  return "http://localhost:8080";
};

const socket = io(getSocketUrl(), {
  transports: ["websocket", "polling"],
});

// Добавляем логирование для отладки
socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.error("❌ Socket disconnected:", reason);
});

socket.on("connect_error", (error) => {
  console.error("❌ Socket connection error:", error);
});

const useSocket = () => {
  const userId = useSelector((state) => state.userReducer.user._id);

  const socketEmit = (action, payload, fn) => {
    if (!socket.connected) {
      console.error("❌ Socket is not connected! Attempting to reconnect...");
      socket.connect();
    }
    
    console.log("📡 Socket emit:", action, socket.connected ? "✅ Connected" : "❌ Disconnected");
    socket.emit(action, payload, fn);
  };

  const socketListen = (action, fn) => {
    socket.on(action, fn);
  };

  return { socketEmit, socketListen, userId, socket };
};

export default useSocket;
