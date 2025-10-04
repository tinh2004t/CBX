// src/api/socket.js - Long Polling thay WebSocket
import apiClient from "./client.js";

class SocketAPI {
  constructor() {
    this.pollingInterval = null;
    this.heartbeatInterval = null;
    this.sessionId = null;
    this.isPolling = false;
    this.listeners = new Map(); // event -> callback[]
  }

  // Bắt đầu polling thay connect()
  connect(token) {
    // Nếu đang polling, disconnect trước rồi connect lại
    if (this.isPolling) {
      console.log('⚠️ Already polling, reconnecting...');
      this.stopPollingOnly(); // Chỉ stop interval, không gọi API logout
    }

    console.log('🔄 Starting long polling...');
    this.isPolling = true;
    
    // Gửi heartbeat mỗi 10 giây
    this.startHeartbeat();
    
    // Poll users online mỗi 5 giây
    this.startPolling();
    
    // Trigger connect event
    setTimeout(() => {
      this.emit('connect');
    }, 100);

    return this;
  }

  // Heartbeat để báo server mình còn online
  startHeartbeat() {
    this.heartbeatInterval = setInterval(async () => {
      try {
        const res = await apiClient.post('/online-users/heartbeat', {
          sessionId: this.sessionId
        });
        
        if (res.data.success) {
          this.sessionId = res.data.data.sessionId;
        }
      } catch (error) {
        console.error('❌ Heartbeat failed:', error);
        // Nếu heartbeat fail, trigger disconnect
        if (error.response?.status === 401 || error.response?.status === 403) {
          this.disconnect();
          this.emit('disconnect', 'auth_error');
        }
      }
    }, 10000); // 10 giây
  }

  // Polling để lấy danh sách users online
  startPolling() {
    // Gọi ngay lần đầu
    this.pollOnlineUsers();

    // Sau đó poll mỗi 5 giây
    this.pollingInterval = setInterval(() => {
      this.pollOnlineUsers();
    }, 5000);
  }

  async pollOnlineUsers() {
    try {
      const res = await apiClient.get('/online-users');
      
      if (res.data.success) {
        // Trigger event giống WebSocket
        this.emit('users_online_update', res.data.data);
      }
    } catch (error) {
      console.error('❌ Poll failed:', error);
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        this.disconnect();
        this.emit('disconnect', 'auth_error');
      } else {
        this.emit('connect_error', error);
      }
    }
  }

  // Lấy danh sách users online (REST API)
  async getOnlineUsers() {
    try {
      const res = await apiClient.get('/online-users');
      return res.data;
    } catch (error) {
      console.error('❌ Get online users failed:', error);
      throw error;
    }
  }

  // Kiểm tra user có online không
  async checkUserOnline(userId) {
    try {
      const res = await apiClient.get(`/online-users/check/${userId}`);
      return res.data;
    } catch (error) {
      console.error('❌ Check user online failed:', error);
      throw error;
    }
  }

  // Gửi message (qua REST API thay socket.emit)
  async sendMessage(targetUserId, message) {
    try {
      // Bạn cần thêm endpoint này vào backend nếu cần
      const res = await apiClient.post('/socket/send-message', { 
        targetUserId, 
        message 
      });
      return res.data;
    } catch (error) {
      console.error('❌ Send message failed:', error);
      throw error;
    }
  }

  // Đăng ký lắng nghe event (giống socket.on)
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  // Xóa listener
 // Xóa listener
off(event, callback) {
  if (!this.listeners.has(event)) return;
  
  // Nếu không truyền callback, xóa TẤT CẢ listeners của event đó
  if (!callback) {
    this.listeners.delete(event);
    return;
  }
  
  // Nếu có callback, chỉ xóa callback đó
  const callbacks = this.listeners.get(event);
  const index = callbacks.indexOf(callback);
  if (index > -1) {
    callbacks.splice(index, 1);
  }
}

  // Trigger event (internal)
  emit(event, data) {
    if (!this.listeners.has(event)) return;
    
    this.listeners.get(event).forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`❌ Error in ${event} listener:`, error);
      }
    });
  }

  
 // THÊM function này vào class SocketAPI (TRƯỚC function disconnect)
stopPollingOnly() {
  if (this.pollingInterval) {
    clearInterval(this.pollingInterval);
    this.pollingInterval = null;
  }
  
  if (this.heartbeatInterval) {
    clearInterval(this.heartbeatInterval);
    this.heartbeatInterval = null;
  }
}

// Function disconnect sử dụng stopPollingOnly
async disconnect() {
  console.log('🔌 Disconnecting...');
  
  this.stopPollingOnly();

  try {
    await apiClient.post('/online-users/logout');
    console.log('✅ Logged out successfully');
  } catch (error) {
    console.warn('⚠️ Logout API failed (ignored):', error.message);
  }

  this.isPolling = false;
  this.sessionId = null;
  
  this.emit('disconnect', 'client_disconnect');
}
  // Kiểm tra đã kết nối chưa
  isConnected() {
    return this.isPolling;
  }

  // Legacy method để tương thích code cũ
  getSocket() {
    return this;
  }
}

// Export singleton instance
const socketAPI = new SocketAPI();
export default socketAPI;