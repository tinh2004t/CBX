import { io } from "socket.io-client";
import apiClient from "./client.js";
import API_CONFIG from "./config.js";

let socket = null;

const socketAPI = {
  connect: (token) => {
    if (socket && socket.connected) return socket;

    socket = io(API_CONFIG.SOCKET_URL, {
      auth: { token }, // chỉ gửi raw token
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket error:", err.message);
    });

    return socket;
  },

  getSocket: () => socket,
getOnlineUsers: async () => {
    const res = await apiClient.get("/socket/online-users");
    return res.data; // {users, count, timestamp}
  },

  // REST API: kiểm tra 1 user có online không
  checkUserOnline: async (userId) => {
    const res = await apiClient.get(`/socket/check-user-online/${userId}`);
    return res.data; // {userId, isOnline, timestamp}
  },

  // REST API: gửi message qua API
  sendMessage: async (targetUserId, message) => {
    const res = await apiClient.post("/socket/send-message", { targetUserId, message });
    return res.data;
  },
  on: (event, callback) => {
    if (socket) socket.on(event, callback);
  },

  emit: (event, data) => {
    if (socket) socket.emit(event, data);
  },

  disconnect: () => {
    if (socket) socket.disconnect();
    socket = null;
  },
};

export default socketAPI;
