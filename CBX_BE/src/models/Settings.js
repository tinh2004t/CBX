// models/Settings.js
const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // Thay đổi bannerImage thành mảng chứa 3 hình
  bannerImages: {
    type: [String],
    default: ['', '', ''],
    validate: {
      validator: function(v) {
        return v.length === 3;
      },
      message: 'Banner phải có đúng 3 hình ảnh'
    }
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
  // Thêm trường videoUrl để lưu YouTube URL
  videoUrls: {
  type: [String],
  default: [],
  validate: {
    validator: function(v) {
      // Kiểm tra từng URL trong mảng
      return v.every(url => {
        if (!url || url === '') return true;
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[a-zA-Z0-9_-]{11}$/;
        return youtubeRegex.test(url);
      });
    },
    message: 'Có URL YouTube không hợp lệ trong danh sách'
  }
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
      bannerImages: ['', '', ''],
      footerImage: '',
      logoImage: '',
      videoUrl: '',
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