const AdminLog = require('../models/AdminLog');

// Lấy tất cả logs (có phân trang, lọc)
exports.getAdminLogs = async (req, res) => {
  try {
    const { page = 1, limit = 20, adminId, action } = req.query;
    const filter = {};

    if (adminId) filter.adminId = adminId;
    if (action) filter.action = action;

    const logs = await AdminLog.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await AdminLog.countDocuments(filter);

    res.json({
      success: true,
      data: logs,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit)
      }
    });
  } catch (error) {
    console.error('Lỗi lấy admin logs:', error);
    res.status(500).json({ success: false, message: 'Lỗi server khi lấy logs' });
  }

  
};

exports.cleanupLogs = async (req, res) => {
  try {
    const { days = 30 } = req.body; // nhận từ body, ví dụ {days: 30}
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

    // Tìm & xoá
    const result = await AdminLog.deleteMany({
      createdAt: { $lt: cutoffDate }
    });

    res.json({
      success: true,
      message: `Đã xoá ${result.deletedCount} logs cũ hơn ${days} ngày`,
      deletedCount: result.deletedCount,
      cutoffDate
    });
  } catch (error) {
    console.error("Lỗi cleanup logs:", error);
    res.status(500).json({ success: false, message: "Lỗi server khi cleanup logs" });
  }
};
