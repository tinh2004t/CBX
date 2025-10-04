// src/services/onlineUsersManager.js
// Quản lý users online bằng Long Polling thay thế WebSocket

class OnlineUsersManager {
  constructor() {
    this.onlineUsers = new Map(); // userId -> { userInfo, lastSeen, sessionId }
    this.cleanupInterval = null;
    
    // Tự động cleanup users không active sau 30 giây
    this.startCleanupInterval();
  }

  // Thêm hoặc cập nhật user online
  updateUserActivity(userId, userInfo, sessionId) {
    const now = Date.now();
    
    this.onlineUsers.set(userId, {
      userInfo: {
        id: userInfo._id || userInfo.id,
        username: userInfo.username,
        role: userInfo.role
      },
      lastSeen: now,
      sessionId: sessionId || Date.now().toString()
    });

    console.log(`👤 User ${userInfo.username} activity updated (${this.getOnlineCount()} online)`);
    
    return {
      success: true,
      sessionId: this.onlineUsers.get(userId).sessionId
    };
  }

  // Lấy danh sách users online
  getOnlineUsers() {
    const users = [];
    const now = Date.now();
    
    for (const [userId, data] of this.onlineUsers) {
      // Chỉ trả về users active trong 30 giây gần đây
      if (now - data.lastSeen < 30000) {
        users.push({
          userId,
          username: data.userInfo.username,
          role: data.userInfo.role,
          lastSeen: new Date(data.lastSeen)
        });
      }
    }
    
    return users;
  }

  // Lấy số lượng users online
  getOnlineCount() {
    const now = Date.now();
    let count = 0;
    
    for (const [, data] of this.onlineUsers) {
      if (now - data.lastSeen < 30000) {
        count++;
      }
    }
    
    return count;
  }

  // Xóa user khi logout
  removeUser(userId) {
    if (this.onlineUsers.has(userId)) {
      const user = this.onlineUsers.get(userId);
      this.onlineUsers.delete(userId);
      console.log(`👋 User ${user.userInfo.username} logged out`);
      return true;
    }
    return false;
  }

  // Cleanup users không active
  cleanupInactiveUsers() {
    const now = Date.now();
    const timeout = 30000; // 30 giây
    let cleanedCount = 0;

    for (const [userId, data] of this.onlineUsers) {
      if (now - data.lastSeen > timeout) {
        this.onlineUsers.delete(userId);
        cleanedCount++;
        console.log(`🧹 Cleaned up inactive user: ${data.userInfo.username}`);
      }
    }

    if (cleanedCount > 0) {
      console.log(`🧹 Cleaned up ${cleanedCount} inactive users. Current online: ${this.getOnlineCount()}`);
    }
  }

  // Bắt đầu interval cleanup
  startCleanupInterval() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    
    // Cleanup mỗi 10 giây
    this.cleanupInterval = setInterval(() => {
      this.cleanupInactiveUsers();
    }, 10000);
    
    console.log('✅ Cleanup interval started');
  }

  // Dừng cleanup interval
  stopCleanupInterval() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
      console.log('🛑 Cleanup interval stopped');
    }
  }

  // Kiểm tra user có online không
  isUserOnline(userId) {
    const now = Date.now();
    const userData = this.onlineUsers.get(userId);
    
    if (!userData) return false;
    
    return (now - userData.lastSeen) < 30000;
  }

  // Lấy thông tin chi tiết user
  getUserDetails(userId) {
    const userData = this.onlineUsers.get(userId);
    if (!userData) return null;
    
    const now = Date.now();
    const isActive = (now - userData.lastSeen) < 30000;
    
    return {
      ...userData.userInfo,
      lastSeen: new Date(userData.lastSeen),
      isActive,
      sessionId: userData.sessionId
    };
  }

  // Get stats
  getStats() {
    const now = Date.now();
    const activeUsers = [];
    const inactiveUsers = [];
    
    for (const [userId, data] of this.onlineUsers) {
      const userInfo = {
        userId,
        username: data.userInfo.username,
        lastSeen: new Date(data.lastSeen),
        inactiveDuration: now - data.lastSeen
      };
      
      if (now - data.lastSeen < 30000) {
        activeUsers.push(userInfo);
      } else {
        inactiveUsers.push(userInfo);
      }
    }
    
    return {
      totalUsers: this.onlineUsers.size,
      activeUsers: activeUsers.length,
      inactiveUsers: inactiveUsers.length,
      activeUsersList: activeUsers,
      inactiveUsersList: inactiveUsers
    };
  }
}

// Singleton instance
let instance = null;

function getOnlineUsersManager() {
  if (!instance) {
    instance = new OnlineUsersManager();
  }
  return instance;
}

module.exports = getOnlineUsersManager;