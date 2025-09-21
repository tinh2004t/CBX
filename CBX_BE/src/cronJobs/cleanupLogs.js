const cron = require('node-cron');
const AdminLog = require('../models/AdminLog');

const autoCleanupLogs = () => {
  // Chạy lúc 00:00 mỗi ngày (giờ server)
  cron.schedule('0 0 * * *', async () => {
    try {
      const days = 30;
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const result = await AdminLog.deleteMany({
        createdAt: { $lt: cutoffDate }
      });

      if (result.deletedCount > 0) {
        console.log(`[CRON] Cleanup: Đã xoá ${result.deletedCount} logs cũ hơn ${days} ngày`);
      } else {
        console.log('[CRON] Cleanup: Không có log nào để xoá');
      }
    } catch (error) {
      console.error('[CRON] Lỗi khi cleanup logs:', error);
    }
  });
};

module.exports = autoCleanupLogs;
