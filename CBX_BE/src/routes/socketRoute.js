// src/routes/socketRoute.js - Routes liên quan đến WebSocket
const express = require('express');
const { authenticateToken, requireSuperAdmin } = require('../middleware/auth');
const router = express.Router();

// Lấy danh sách users online
router.get('/online-users', authenticateToken, (req, res) => {
  try {
    const onlineUsers = req.socketManager.getOnlineUsers();
    const onlineCount = req.socketManager.getOnlineCount();
    
    res.json({
      success: true,
      data: {
        users: onlineUsers,
        count: onlineCount,
        timestamp: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách users online',
      error: error.message
    });
  }
});

// Kiểm tra user có online không
router.get('/check-user-online/:userId', authenticateToken, (req, res) => {
  try {
    const { userId } = req.params;
    const isOnline = req.socketManager.isUserOnline(userId);
    
    res.json({
      success: true,
      data: {
        userId,
        isOnline,
        timestamp: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi kiểm tra trạng thái online',
      error: error.message
    });
  }
});

// Gửi message tới user cụ thể (qua REST API)
router.post('/send-message', authenticateToken, (req, res) => {
  try {
    const { targetUserId, message, type = 'notification' } = req.body;
    
    if (!targetUserId || !message) {
      return res.status(400).json({
        success: false,
        message: 'targetUserId và message là bắt buộc'
      });
    }
    
    const success = req.socketManager.sendToUser(targetUserId, type, {
      from: req.user.username,
      fromUserId: req.user._id,
      message,
      timestamp: new Date()
    });
    
    res.json({
      success: true,
      data: {
        delivered: success,
        targetUserId,
        message: success ? 'Message đã được gửi' : 'User không online'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi gửi message',
      error: error.message
    });
  }
});

// Gửi broadcast message (chỉ SuperAdmin)
router.post('/broadcast', authenticateToken, requireSuperAdmin, (req, res) => {
  try {
    const { message, type = 'broadcast' } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message là bắt buộc'
      });
    }
    
    // Gửi broadcast tới tất cả users online
    req.socketManager.broadcastToOthers(null, type, {
      from: req.user.username,
      fromUserId: req.user._id,
      message,
      timestamp: new Date()
    });
    
    res.json({
      success: true,
      data: {
        message: 'Broadcast message đã được gửi',
        recipients: req.socketManager.getOnlineCount(),
        timestamp: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi gửi broadcast',
      error: error.message
    });
  }
});

// Gửi message tới specific role
router.post('/send-to-role', authenticateToken, requireSuperAdmin, (req, res) => {
  try {
    const { role, message, type = 'role_notification' } = req.body;
    
    if (!role || !message) {
      return res.status(400).json({
        success: false,
        message: 'role và message là bắt buộc'
      });
    }
    
    if (!['Admin', 'SuperAdmin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role không hợp lệ'
      });
    }
    
    req.socketManager.sendToRole(role, type, {
      from: req.user.username,
      fromUserId: req.user._id,
      message,
      targetRole: role,
      timestamp: new Date()
    });
    
    // Đếm số users có role đó đang online
    const onlineUsers = req.socketManager.getOnlineUsers();
    const targetUsers = onlineUsers.filter(user => user.role === role);
    
    res.json({
      success: true,
      data: {
        message: `Message đã được gửi tới ${role}`,
        recipients: targetUsers.length,
        targetRole: role,
        timestamp: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi gửi message tới role',
      error: error.message
    });
  }
});

// Force disconnect user (chỉ SuperAdmin)
router.post('/force-disconnect/:userId', authenticateToken, requireSuperAdmin, (req, res) => {
  try {
    const { userId } = req.params;
    const { reason = 'Disconnected by admin' } = req.body;
    
    const success = req.socketManager.sendToUser(userId, 'force_disconnect', {
      reason,
      by: req.user.username,
      timestamp: new Date()
    });
    
    res.json({
      success: true,
      data: {
        disconnected: success,
        userId,
        message: success ? 'User đã được disconnect' : 'User không online'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi disconnect user',
      error: error.message
    });
  }
});

module.exports = router;