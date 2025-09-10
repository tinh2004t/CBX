const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

// Schema cho MICE Tour
const miceTourSchema = new mongoose.Schema({
  slug: {
    type: String,
    trim: true,
    index: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Tên tour là bắt buộc'],
    trim: true,
    maxLength: [200, 'Tên tour không được vượt quá 200 ký tự']
  },
  image: {
    type: String,
    required: [true, 'Hình ảnh tour là bắt buộc'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)/.test(v);
      },
      message: 'Hình ảnh phải là URL hợp lệ'
    }
  },
  duration: {
    type: String,
    required: [true, 'Thời gian tour là bắt buộc'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Địa điểm là bắt buộc'],
    trim: true
  },
  rating: {
    type: Number,
    min: [0, 'Rating không được nhỏ hơn 0'],
    max: [5, 'Rating không được lớn hơn 5'],
    default: 0
  },
  price: {
    type: String,
    required: [true, 'Giá tour là bắt buộc'],
    trim: true
  },
  category: {
    type: String,
    enum: ['meeting', 'incentive', 'conference', 'exhibition', 'teambuilding', 'workshop'],
    default: 'meeting'
  },
   isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Plugin mongoose-delete để soft delete
miceTourSchema.plugin(mongooseDelete, { 
  deletedAt: true, 
  deletedBy: true,
  indexFields: ['deleted', 'deletedAt'] 
});

// Middleware để tự động cập nhật updatedAt
miceTourSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

miceTourSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

// Virtual để tính discount percentage
miceTourSchema.virtual('discountPercentage').get(function() {
  if (this.originalPrice && this.price) {
    const original = parseFloat(this.originalPrice.replace(/[^\d]/g, ''));
    const current = parseFloat(this.price.replace(/[^\d]/g, ''));
    if (original > 0) {
      return Math.round(((original - current) / original) * 100);
    }
  }
  return 0;
});

// Virtual để format giá tiền
miceTourSchema.virtual('formattedPrice').get(function() {
  const numericPrice = this.price.replace(/[^\d]/g, '');
  return new Intl.NumberFormat('vi-VN').format(numericPrice) + ' VNĐ';
});

// Index cho tìm kiếm
miceTourSchema.index({ name: 'text', location: 'text' });
miceTourSchema.index({ price: 1 });
miceTourSchema.index({ rating: -1 });
miceTourSchema.index({ category: 1 });
miceTourSchema.index({ createdAt: -1 });
miceTourSchema.index({ slug: 1 }, { unique: true });

// Static methods
miceTourSchema.statics.findByLocation = function(location) {
  return this.find({ location: new RegExp(location, 'i'), isActive: true });
};

miceTourSchema.statics.findFeatured = function() {
  return this.find({ featured: true, isActive: true }).sort({ rating: -1 });
};

miceTourSchema.statics.findByCategory = function(category) {
  return this.find({ category, isActive: true });
};

miceTourSchema.statics.findByPriceRange = function(minPrice, maxPrice) {
  return this.find({
    isActive: true,
    $expr: {
      $and: [
        { $gte: [{ $toDouble: { $replaceAll: { input: "$price", find: /[^\d]/g, replacement: "" } } }, minPrice] },
        { $lte: [{ $toDouble: { $replaceAll: { input: "$price", find: /[^\d]/g, replacement: "" } } }, maxPrice] }
      ]
    }
  });
};

miceTourSchema.methods.softDelete = function() {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return this.save();
};


// Static method để cleanup tour đã xóa quá 30 ngày
miceTourSchema.statics.cleanupOldDeleted = function() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  return this.deleteMany({
    isDeleted: true,
    deletedAt: { $lte: thirtyDaysAgo }
  });
};

// Instance methods
miceTourSchema.methods.addReview = function(rating) {
  const currentTotal = this.rating * this.reviews;
  this.reviews += 1;
  this.rating = (currentTotal + rating) / this.reviews;
  return this.save();
};

miceTourSchema.methods.updateServices = function(services) {
  if (services) this.services = services;
  return this.save();
};

miceTourSchema.methods.updateFacilities = function(facilities) {
  if (facilities) this.facilities = facilities;
  return this.save();
};

// Ensure virtual fields are serialized
miceTourSchema.set('toJSON', { 
  virtuals: true,
  transform: function(doc, ret) {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

miceTourSchema.set('toObject', { virtuals: true });

const MiceTour = mongoose.model('MiceTour', miceTourSchema);

module.exports = MiceTour;

// Example usage:
/*
// Tạo MICE tour mới
const newMiceTour = new MiceTour({
  slug: "hoi-thao-teambuilding-dalat",
  name: "Hội thảo & Teambuilding Đà Lạt",
  image: "https://images.unsplash.com/photo-1540541338287-41700207dee6",
  duration: "3 ngày 2 đêm",
  location: "Đà Lạt, Lâm Đồng",
  rating: 4.8,
  price: "1000000",
  originalPrice: "1200000",
  category: "teambuilding",
  groupSize: "30-50 người",
  description: "Tổ chức hội thảo và teambuilding tại Đà Lạt với không gian thoáng mát",
  highlights: [
    "Không gian hội nghị chuyên nghiệp",
    "Hoạt động teambuilding ngoại trời",
    "Ẩm thực địa phương đặc sắc",
    "Dịch vụ tổ chức sự kiện trọn gói"
  ],
  services: [
    "Tổ chức hội nghị/hội thảo",
    "Hoạt động teambuilding",
    "Dịch vụ ăn uống",
    "Âm thanh ánh sáng"
  ],
  facilities: [
    "Phòng hội nghị 200 chỗ",
    "Thiết bị âm thanh hiện đại",
    "Wifi tốc độ cao",
    "Bãi đỗ xe rộng rãi"
  ]
});

// Lưu tour
await newMiceTour.save();

// Tìm kiếm tour theo location
const dalatTours = await MiceTour.findByLocation('Đà Lạt');

// Tìm tour featured
const featuredTours = await MiceTour.findFeatured();

// Tìm tour theo category
const teambuilding = await MiceTour.findByCategory('teambuilding');

// Thêm review
await tour.addReview(5);
*/