// utils/cleanupScheduler.js
const cron = require('node-cron');
const blogPostController = require('../controllers/blogPostController');

class CleanupScheduler {
  // Chạy cleanup tự động mỗi ngày lúc 2:00 AM
  startAutoCleanup() {
    console.log('🚀 Starting auto cleanup scheduler...');
    
    // Cron expression: '0 2 * * *' = Chạy lúc 2:00 AM mỗi ngày
    cron.schedule('0 2 * * *', async () => {
      try {
        console.log('🧹 Running auto cleanup for old deleted posts...');
        const result = await blogPostController.cleanupOldDeletedPosts();
        console.log(`✅ Auto cleanup completed: ${result.message}`);
      } catch (error) {
        console.error('❌ Auto cleanup failed:', error);
      }
    }, {
      scheduled: true,
      timezone: "Asia/Ho_Chi_Minh"
    });

    console.log('✅ Auto cleanup scheduler started successfully');
  }

  // Chạy cleanup ngay lập tức (để test)
  async runImmediateCleanup() {
    try {
      console.log('🧹 Running immediate cleanup...');
      const result = await blogPostController.cleanupOldDeletedPosts();
      console.log(`✅ Immediate cleanup completed: ${result.message}`);
      return result;
    } catch (error) {
      console.error('❌ Immediate cleanup failed:', error);
      throw error;
    }
  }

  // Dừng scheduler
  stopScheduler() {
    cron.getTasks().forEach(task => {
      task.destroy();
    });
    console.log('🛑 Cleanup scheduler stopped');
  }
}

module.exports = new CleanupScheduler();