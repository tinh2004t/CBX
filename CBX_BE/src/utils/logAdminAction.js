const AdminLog = require('../models/AdminLog');

const logAdminAction = async (adminId, adminUsername, action, targetUser = null, details = {}) => {
  try {
    await AdminLog.create({
      adminId: adminId.toString(),
      adminUsername,
      action,
      targetUser,
      details
    });
  } catch (error) {
    console.error('Lỗi ghi log:', error);
  }
};

module.exports = logAdminAction;