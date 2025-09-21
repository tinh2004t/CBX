// src/socket/socketManager.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class SocketManager {
  constructor(io) {
    this.io = io;
    this.onlineUsers = new Map(); // userId -> { socketId, userInfo, lastSeen }
    this.userSockets = new Map(); // socketId -> userId
  }

  // Xác thực socket connection
  async authenticateSocket(socket, token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-passwordHash');
      
      if (!user) {
        throw new Error('User không tồn tại');
      }
      
      return user;
    } catch (error) {
      throw new Error('Token không hợp lệ');
    }
  }

  // Thêm user online
  addOnlineUser(userId, socketId, userInfo) {
    this.onlineUsers.set(userId, {
      socketId,
      userInfo: {
        id: userInfo._id,
        username: userInfo.username,
        role: userInfo.role
      },
      lastSeen: new Date()
    });
    
    this.userSockets.set(socketId, userId);
    
    console.log(`User ${userInfo.username} connected (${socketId})`);
    
    // Broadcast danh sách user online mới
    this.broadcastOnlineUsers();
  }

  // Xóa user offline
  removeOnlineUser(socketId) {
    const userId = this.userSockets.get(socketId);
    
    if (userId) {
      const userInfo = this.onlineUsers.get(userId);
      this.onlineUsers.delete(userId);
      this.userSockets.delete(socketId);
      
      if (userInfo) {
        console.log(`User ${userInfo.userInfo.username} disconnected (${socketId})`);
      }
      
      // Broadcast danh sách user online mới
      this.broadcastOnlineUsers();
    }
  }

  // Lấy danh sách user online
  getOnlineUsers() {
    const users = [];
    for (const [userId, data] of this.onlineUsers) {
      users.push({
        userId,
        username: data.userInfo.username,
        role: data.userInfo.role,
        lastSeen: data.lastSeen
      });
    }
    return users;
  }

  // Lấy số lượng user online
  getOnlineCount() {
    return this.onlineUsers.size;
  }

  // Broadcast danh sách user online
  broadcastOnlineUsers() {
    const onlineUsers = this.getOnlineUsers();
    const onlineCount = this.getOnlineCount();
    
    this.io.emit('users_online_update', {
      users: onlineUsers,
      count: onlineCount,
      timestamp: new Date()
    });
  }

  // Gửi message tới user cụ thể
  sendToUser(userId, event, data) {
    const userConnection = this.onlineUsers.get(userId);
    if (userConnection) {
      this.io.to(userConnection.socketId).emit(event, data);
      return true;
    }
    return false;
  }

  // Kiểm tra user có online không
  isUserOnline(userId) {
    return this.onlineUsers.has(userId);
  }

  // Cập nhật last seen
  updateLastSeen(socketId) {
    const userId = this.userSockets.get(socketId);
    if (userId && this.onlineUsers.has(userId)) {
      this.onlineUsers.get(userId).lastSeen = new Date();
    }
  }

  // Broadcast message tới tất cả users (trừ sender)
  broadcastToOthers(senderSocketId, event, data) {
    this.io.emit(event, data);
  }

  // Gửi message tới specific role
  sendToRole(role, event, data) {
    for (const [userId, userConnection] of this.onlineUsers) {
      if (userConnection.userInfo.role === role) {
        this.io.to(userConnection.socketId).emit(event, data);
      }
    }
  }
}

module.exports = SocketManager;