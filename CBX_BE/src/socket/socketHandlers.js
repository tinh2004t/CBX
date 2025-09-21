const User = require('../models/User');
const SocketManager = require('./socketManager');

function setupSocketHandlers(io) {
  const socketManager = new SocketManager(io);

  // Middleware xác thực socket
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;
      
      if (!token) {
        return next(new Error('Token không được cung cấp'));
      }

      const user = await socketManager.authenticateSocket(socket, token);
      socket.userId = user._id.toString();
      socket.userInfo = user;
      
      next();
    } catch (error) {
      next(new Error('Xác thực thất bại: ' + error.message));
    }
  });

  // Xử lý connection
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id} for user: ${socket.userInfo.username}`);

    // Thêm user vào danh sách online
    socketManager.addOnlineUser(socket.userId, socket.id, socket.userInfo);

    // Gửi danh sách user online cho user vừa connect
    socket.emit('users_online_update', {
      users: socketManager.getOnlineUsers(),
      count: socketManager.getOnlineCount(),
      timestamp: new Date()
    });

    // Heartbeat để check connection
    socket.on('heartbeat', () => {
      socketManager.updateLastSeen(socket.id);
      socket.emit('heartbeat_ack', { timestamp: new Date() });
    });

    // Lấy danh sách user online
    socket.on('get_online_users', () => {
      socket.emit('users_online_update', {
        users: socketManager.getOnlineUsers(),
        count: socketManager.getOnlineCount(),
        timestamp: new Date()
      });
    });

    // Gửi message tới user khác (nếu cần)
    socket.on('send_message_to_user', (data) => {
      const { targetUserId, message } = data;
      
      const success = socketManager.sendToUser(targetUserId, 'private_message', {
        from: socket.userInfo.username,
        fromUserId: socket.userId,
        message,
        timestamp: new Date()
      });

      socket.emit('message_delivery_status', {
        targetUserId,
        delivered: success,
        timestamp: new Date()
      });
    });

    // Broadcast message tới tất cả (trừ sender)
    socket.on('broadcast_message', (data) => {
      // Chỉ SuperAdmin mới có thể broadcast
      if (socket.userInfo.role === 'SuperAdmin') {
        socket.broadcast.emit('broadcast_message', {
          from: socket.userInfo.username,
          fromUserId: socket.userId,
          message: data.message,
          timestamp: new Date()
        });

        socket.emit('broadcast_sent', {
          message: data.message,
          timestamp: new Date()
        });
      } else {
        socket.emit('error', {
          message: 'Chỉ SuperAdmin mới có thể gửi broadcast message'
        });
      }
    });

    // Xử lý disconnect
    socket.on('disconnect', (reason) => {
      console.log(`Socket disconnected: ${socket.id} for user: ${socket.userInfo.username}, reason: ${reason}`);
      socketManager.removeOnlineUser(socket.id);
    });

    // Xử lý lỗi
    socket.on('error', (error) => {
      console.error(`Socket error for ${socket.userInfo.username}:`, error);
    });
  });

  // Trả về socketManager để sử dụng trong routes khác
  return socketManager;
}

module.exports = setupSocketHandlers;