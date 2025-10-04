// src/routes/onlineUsersRoute.js
const express = require("express");
const router = express.Router();
const getOnlineUsersManager = require("../services/onlineUsersManager");
const { authenticateToken } = require("../middleware/auth");

// Lấy instance singleton
const onlineUsersManager = getOnlineUsersManager();

/**
 * 📌 Cập nhật activity (heartbeat) của user
 * Gọi định kỳ từ client (5–10s/lần) để báo user còn online
 */
router.post("/update", (req, res) => {
  try {
    const { userId, username, role, sessionId } = req.body;
    if (!userId || !username) {
      return res.status(400).json({ success: false, message: "Thiếu userId hoặc username" });
    }

    const result = onlineUsersManager.updateUserActivity(
      userId,
      { _id: userId, username, role: role || "user" },
      sessionId
    );

    res.json({ success: true, ...result });
  } catch (err) {
    console.error("❌ Error in /online-users/update:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * 📌 Lấy danh sách user online
 */
router.get("/", (req, res) => {
  try {
    const users = onlineUsersManager.getOnlineUsers();
    res.json({
      success: true,
      data: {
        users: users,        // ← Thay đổi structure
        count: users.length,
        timestamp: new Date()
      }
    });
  } catch (err) {
    console.error("❌ Error in /online-users:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * 📌 Lấy số lượng user online
 */
router.get("/count", (req, res) => {
  try {
    const count = onlineUsersManager.getOnlineCount();
    res.json({ success: true, count });
  } catch (err) {
    console.error("❌ Error in /online-users/count:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * 📌 Xóa user (logout)
 */
router.post('/logout', authenticateToken, (req, res) => {
  try {
    const manager = getOnlineUsersManager();
    
    // Lấy userId từ token (req.user) thay vì từ body
    const userId = req.user._id.toString();
    manager.removeUser(userId);

    res.json({
      success: true,
      message: 'Đã logout thành công'
    });
  } catch (error) {
    console.error('❌ Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi logout'
    });
  }
});

/**
 * 📌 Lấy thống kê chi tiết
 */
router.get("/stats", (req, res) => {
  try {
    const stats = onlineUsersManager.getStats();
    res.json({ success: true, stats });
  } catch (err) {
    console.error("❌ Error in /online-users/stats:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post('/heartbeat', authenticateToken, (req, res) => {
  try {
    const { sessionId } = req.body;
    const manager = getOnlineUsersManager();
    
    // Lấy thông tin từ token
    const userId = req.user._id.toString();
    const userInfo = {
      _id: req.user._id,
      username: req.user.username,
      role: req.user.role
    };
    
    const result = manager.updateUserActivity(userId, userInfo, sessionId);

    res.json({
      success: true,
      data: {
        sessionId: result.sessionId,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('❌ Heartbeat error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật heartbeat'
    });
  }
});

module.exports = router;
