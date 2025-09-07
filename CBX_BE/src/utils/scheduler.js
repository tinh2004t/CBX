const cron = require("node-cron");
const Tour = require("../models/DomesticTour");

// Chạy cleanup mỗi ngày lúc 2:00 AM
const startCleanupScheduler = () => {
  cron.schedule("0 2 * * *", async () => {
    try {
      console.log("Bắt đầu cleanup tour đã xóa quá 30 ngày...");
      const result = await Tour.cleanupOldDeleted();
      console.log(`Đã xóa vĩnh viễn ${result.deletedCount} tour quá 30 ngày`);
    } catch (error) {
      console.error("Lỗi khi cleanup tour:", error);
    }
  });

  console.log(
    "Cleanup scheduler đã được khởi động (chạy hàng ngày lúc 2:00 AM)"
  );
};

module.exports = { startCleanupScheduler };
