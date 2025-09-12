// models/Settings.js
const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  bannerImage: {
    type: String,
    required: true,
    trim: true
  },
  footerImage: {
    type: String,
    required: true,
    trim: true
  },
  logoImage: {
    type: String,
    required: true,
    trim: true
  },
  hotline: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  fbLink: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true,
  collection: 'settings'
});

// Đảm bảo chỉ có một document settings duy nhất
settingsSchema.statics.getSingleSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    // Tạo settings mặc định nếu chưa có
    settings = await this.create({
      bannerImage: '',
      footerImage: '',
      logoImage: '',
      hotline: '',
      email: '',
      address: '',
      fbLink: ''
    });
  }
  return settings;
};

settingsSchema.statics.updateSingleSettings = async function(updateData) {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create(updateData);
  } else {
    Object.assign(settings, updateData);
    await settings.save();
  }
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);