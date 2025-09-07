const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema({
  adminId: {
    type: String,
    required: true
  },
  adminUsername: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true
  },
  targetUser: {
    type: String,
    default: null
  },
  details: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AdminLog', adminLogSchema);