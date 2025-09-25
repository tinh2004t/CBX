const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

// Base Tour Schema - Chứa các fields chung
const baseTourSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  title: {
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
  price: {
    type: String,
    required: [true, 'Giá tour là bắt buộc'],
    trim: true
  },
  rating: {
    type: Number,
    min: [0, 'Rating không được nhỏ hơn 0'],
    max: [5, 'Rating không được lớn hơn 5'],
    default: 0
  },
  reviews: {
    type: Number,
    min: 0,
    default: 0
  },
  // Tour type để phân biệt
  tourType: {
    type: String,
    required: true,
    enum: ['mice', 'domestic', 'oversea']
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
  timestamps: true,
  discriminatorKey: 'tourType'
});

// Middleware chung
baseTourSchema.pre(/^find/, function() {
  if (!this.getOptions().includeDeleted) {
    this.where({ isDeleted: { $ne: true } });
  }
});

// Static methods chung
baseTourSchema.statics.findWithDeleted = function() {
  return this.find().setOptions({ includeDeleted: true });
};

baseTourSchema.statics.findDeleted = function() {
  return this.find({ isDeleted: true }).setOptions({ includeDeleted: true });
};

baseTourSchema.statics.cleanupOldDeleted = function() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  return this.deleteMany({
    isDeleted: true,
    deletedAt: { $lt: thirtyDaysAgo }
  });
};

// Instance methods chung
baseTourSchema.methods.softDelete = function() {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return this.save();
};

baseTourSchema.methods.restore = function() {
  this.isDeleted = false;
  this.deletedAt = null;
  return this.save();
};

baseTourSchema.methods.addReview = function(rating) {
  const currentTotal = this.rating * this.reviews;
  this.reviews += 1;
  this.rating = (currentTotal + rating) / this.reviews;
  return this.save();
};

// Virtual cho formatted price
baseTourSchema.virtual('formattedPrice').get(function() {
  const numericPrice = this.price.replace(/[^\d]/g, '');
  return new Intl.NumberFormat('vi-VN').format(numericPrice) + ' VNĐ';
});

// Index chung
baseTourSchema.index({ title: 'text' });
baseTourSchema.index({ price: 1 });
baseTourSchema.index({ rating: -1 });
baseTourSchema.index({ createdAt: -1 });
baseTourSchema.index({ tourType: 1 });

baseTourSchema.set('toJSON', { 
  virtuals: true,
  transform: function(doc, ret) {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// Base model
const Tour = mongoose.model('Tour', baseTourSchema);

// =============================================================================
// MICE TOUR SCHEMA (extends base)
// =============================================================================
const miceTourFields = {
  location: {
    type: String,
    required: [true, 'Địa điểm là bắt buộc'],
    trim: true
  },
  category: {
    type: String,
    enum: ['meeting', 'incentive', 'conference', 'exhibition', 'teambuilding', 'workshop'],
    default: 'meeting'
  },
  groupSize: {
    type: String,
    trim: true
  },
  services: [{
    type: String,
    trim: true
  }],
  facilities: [{
    type: String,
    trim: true
  }]
};

const MiceTour = Tour.discriminator('mice', new mongoose.Schema(miceTourFields));

// MICE specific methods
MiceTour.schema.statics.findByLocation = function(location) {
  return this.find({ location: new RegExp(location, 'i') });
};

MiceTour.schema.statics.findByCategory = function(category) {
  return this.find({ category });
};

// =============================================================================
// DOMESTIC TOUR SCHEMA (extends base)
// =============================================================================
const domesticTourFields = {
  departure: {
    type: String,
    required: [true, 'Điểm khởi hành là bắt buộc'],
    trim: true
  },
  scheduleInfo: {
    type: String,
    required: [true, 'Thông tin lịch trình là bắt buộc'],
    trim: true
  },
  region: {
    type: String,
    required: [true, 'Vùng miền là bắt buộc'],
    enum: ['Miền Bắc', 'Miền Trung', 'Miền Nam'],
    trim: true
  },
  // Không cần airline cho domestic tour
  transportation: {
    type: String,
    enum: ['bus', 'train', 'plane', 'car'],
    default: 'bus'
  }
};

const DomesticTour = Tour.discriminator('domestic', new mongoose.Schema(domesticTourFields));

// Domestic specific methods
DomesticTour.schema.statics.findByRegion = function(region) {
  return this.find({ region });
};

DomesticTour.schema.statics.findByDeparture = function(departure) {
  return this.find({ departure: new RegExp(departure, 'i') });
};

// =============================================================================
// OVERSEA TOUR SCHEMA (extends base)
// =============================================================================
const overseaTourFields = {
  departure: {
    type: String,
    required: [true, 'Điểm khởi hành là bắt buộc'],
    trim: true
  },
  airline: {
    type: String,
    required: [true, 'Hãng hàng không là bắt buộc'],
    trim: true
  },
  scheduleInfo: {
    type: String,
    required: [true, 'Thông tin lịch trình là bắt buộc'],
    trim: true
  },
  continent: {
    type: String,
    required: [true, 'Châu lục là bắt buộc'],
    enum: ['Châu Á', 'Châu Âu', 'Châu Úc', 'Châu Mỹ', 'Châu Phi'],
    trim: true
  },
  visa: {
    type: String,
    enum: ['required', 'not_required', 'visa_on_arrival'],
    default: 'required'
  },
  countries: [{
    type: String,
    trim: true
  }]
};

const OverseaTour = Tour.discriminator('oversea', new mongoose.Schema(overseaTourFields));

// Oversea specific methods
OverseaTour.schema.statics.findByContinent = function(continent) {
  return this.find({ continent });
};

OverseaTour.schema.statics.findByAirline = function(airline) {
  return this.find({ airline: new RegExp(airline, 'i') });
};

// Export all models
module.exports = {
  Tour,
  MiceTour,
  DomesticTour,
  OverseaTour
};

// =============================================================================
// MIGRATION SCRIPT - Chuyển đổi dữ liệu hiện tại
// =============================================================================

/*
async function migrateExistingData() {
  try {
    // Migrate MiceTour data
    const existingMiceTours = await OldMiceTour.find({});
    for (const tour of existingMiceTours) {
      await new MiceTour({
        ...tour.toObject(),
        title: tour.name, // Convert name -> title
        tourType: 'mice',
        _id: undefined // Let MongoDB generate new _id
      }).save();
    }

    // Migrate DomesticTour data  
    const existingDomesticTours = await OldDomesticTour.find({});
    for (const tour of existingDomesticTours) {
      await new DomesticTour({
        ...tour.toObject(),
        tourType: 'domestic',
        transportation: 'bus', // Default value
        _id: undefined
      }).save();
    }

    // Migrate OverseaTour data
    const existingOverseaTours = await OldOverseaTour.find({});
    for (const tour of existingOverseaTours) {
      await new OverseaTour({
        ...tour.toObject(),
        tourType: 'oversea',
        visa: 'required', // Default value
        countries: [], // Default empty array
        _id: undefined
      }).save();
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run migration (uncomment when ready)
// migrateExistingData();
*/

// =============================================================================
// USAGE EXAMPLES
// =============================================================================

/*
// Tạo MICE tour
const miceTour = new MiceTour({
  slug: 'hoi-thao-teambuilding-dalat',
  title: 'Hội thảo & Teambuilding Đà Lạt',
  image: 'https://example.com/image.jpg',
  duration: '3 ngày 2 đêm',
  price: '1000000',
  location: 'Đà Lạt, Lâm Đồng',
  category: 'teambuilding',
  tourType: 'mice'
});

// Tạo Domestic tour
const domesticTour = new DomesticTour({
  slug: 'ha-giang-dong-van',
  title: 'Tour Hà Giang - Đồng Văn',
  image: 'https://example.com/image.jpg',
  duration: '3 ngày 2 đêm',
  price: '2500000',
  departure: 'Hà Nội',
  region: 'Miền Bắc',
  scheduleInfo: 'Khởi hành thứ 7 hàng tuần',
  tourType: 'domestic'
});

// Tạo Oversea tour
const overseaTour = new OverseaTour({
  slug: 'tour-nhat-ban',
  title: 'Tour Nhật Bản Tokyo - Osaka',
  image: 'https://example.com/image.jpg',
  duration: '7 ngày 6 đêm',
  price: '25000000',
  departure: 'Hà Nội',
  airline: 'Vietnam Airlines',
  continent: 'Châu Á',
  scheduleInfo: 'Khởi hành hàng ngày',
  tourType: 'oversea'
});

// Query tất cả tours
const allTours = await Tour.find({});

// Query by type
const miceTours = await MiceTour.find({});
const domesticTours = await DomesticTour.find({});
const overseaTours = await OverseaTour.find({});

// Mixed queries
const asianTours = await Tour.find({
  $or: [
    { tourType: 'oversea', continent: 'Châu Á' },
    { tourType: 'domestic', region: 'Miền Bắc' }
  ]
});
*/