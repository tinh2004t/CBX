const mongoose = require('mongoose');

// Schema cho lịch trình tour
const scheduleSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  activities: [{
    type: String,
    required: true,
    trim: true
  }]
});

// Schema cho thông tin tour
const tourDataSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 200
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: String,
    required: true,
    trim: true
  },
  originalPrice: {
    type: String,
    trim: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: {
    type: Number,
    min: 0,
    default: 0
  },
  groupSize: {
    type: String,
    required: true,
    trim: true
  },
  highlights: [{
    type: String,
    required: true,
    trim: true
  }]
});

// Schema chính cho Tour
const tourSchema = new mongoose.Schema({
  slug: {
    type: String,
    trim: true,
    index: true
  },
  tourData: {
    type: tourDataSchema,
    required: true
  },
  scheduleData: [{
    type: scheduleSchema,
    required: true
  }],
  priceIncludes: [{
    type: String,
    required: true,
    trim: true
  }],
  priceExcludes: [{
    type: String,
    required: true,
    trim: true
  }],
  landscapeImages: [{
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)/.test(v);
      },
      message: 'Landscape image must be a valid URL'
    }
  }],
  foodImages: [{
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)/.test(v);
      },
      message: 'Food image must be a valid URL'
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware để tự động cập nhật updatedAt
tourSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

tourSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

// Virtual để tính discount percentage
tourSchema.virtual('discountPercentage').get(function() {
  if (this.tourData.originalPrice && this.tourData.price) {
    const original = parseFloat(this.tourData.originalPrice.replace(/[,.]/g, ''));
    const current = parseFloat(this.tourData.price.replace(/[,.]/g, ''));
    return Math.round(((original - current) / original) * 100);
  }
  return 0;
});

// Virtual để format giá tiền
tourSchema.virtual('formattedPrice').get(function() {
  return this.tourData.price.toLocaleString('vi-VN') + ' VNĐ';
});

// Index cho tìm kiếm
tourSchema.index({ 'tourData.title': 'text', 'tourData.location': 'text' });
tourSchema.index({ 'tourData.price': 1 });
tourSchema.index({ 'tourData.rating': -1 });
tourSchema.index({ createdAt: -1 });

// Static methods
tourSchema.statics.findByLocation = function(location) {
  return this.find({ 'tourData.location': new RegExp(location, 'i'), isActive: true });
};

tourSchema.statics.findFeatured = function() {
  return this.find({ featured: true, isActive: true }).sort({ 'tourData.rating': -1 });
};

tourSchema.statics.findByPriceRange = function(minPrice, maxPrice) {
  return this.find({
    isActive: true,
    $expr: {
      $and: [
        { $gte: [{ $toDouble: { $replaceAll: { input: "$tourData.price", find: ".", replacement: "" } } }, minPrice] },
        { $lte: [{ $toDouble: { $replaceAll: { input: "$tourData.price", find: ".", replacement: "" } } }, maxPrice] }
      ]
    }
  });
};

// Instance methods
tourSchema.methods.addReview = function(rating) {
  const currentTotal = this.tourData.rating * this.tourData.reviews;
  this.tourData.reviews += 1;
  this.tourData.rating = (currentTotal + rating) / this.tourData.reviews;
  return this.save();
};

tourSchema.methods.updateImages = function(landscapeImages, foodImages) {
  if (landscapeImages) this.landscapeImages = landscapeImages;
  if (foodImages) this.foodImages = foodImages;
  return this.save();
};

// Ensure virtual fields are serialized
tourSchema.set('toJSON', { 
  virtuals: true,
  transform: function(doc, ret) {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

tourSchema.set('toObject', { virtuals: true });

const TourDetail = mongoose.model('TourDetail', tourSchema);

module.exports = TourDetail;

// Example usage:
/*

// Tạo tour mới
const newTour = new Tour({
  slug: "ha-noi-sapa-lao-cai-3n2d",
  tourData: {
    title: "Hà Nội - Sapa - Lào Cai 3N2Đ",
    location: "Sapa, Lào Cai",
    duration: "3 ngày 2 đêm",
    price: "2.999.000",
    originalPrice: "3,500,000",
    rating: 4.8,
    reviews: 127,
    groupSize: "15-20 người",
    highlights: [
      "Chinh phục đỉnh Fansipan",
      "Thăm bản Cát Cát",
      "Ngắm ruộng bậc thang Mường Hoa",
      "Trải nghiệm tàu hỏa leo núi"
    ]
  },
  scheduleData: [
    // ... schedule data
  ],
  priceIncludes: [
    // ... price includes
  ],
  priceExcludes: [
    // ... price excludes
  ],
  landscapeImages: [
    // ... images
  ],
  foodImages: [
    // ... images
  ]
});

// Lưu tour
await newTour.save();

// Tìm kiếm tour theo location
const sapatours = await Tour.findByLocation('Sapa');

// Tìm tour featured
const featuredTours = await Tour.findFeatured();

// Tìm tour theo khoảng giá
const budgetTours = await Tour.findByPriceRange(1000000, 3000000);

// Thêm review
await tour.addReview(5);

*/