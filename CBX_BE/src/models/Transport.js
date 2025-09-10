// models/Transport.js
const mongoose = require('mongoose');
const slugify = require('slugify');

const transportSchema = new mongoose.Schema({
  slug: {
    type: String,
    unique: true,
    index: true
  },
  company: {
    type: String,
    required: [true, 'Tên công ty là bắt buộc'],
    trim: true,
    index: true
  },
  route: {
    fromCity: {
      type: String,
      required: [true, 'Thành phố đi là bắt buộc'],
      trim: true,
      index: true
    },
    toCity: {
      type: String,
      required: [true, 'Thành phố đến là bắt buộc'],
      trim: true,
      index: true
    }
  },
  bus: {
    seatType: {
      type: String,
      required: [true, 'Loại ghế là bắt buộc'],
      trim: true
    },
    totalSeats: {
      type: Number,
      required: [true, 'Tổng số ghế là bắt buộc'],
      min: [1, 'Số ghế phải lớn hơn 0']
    },
    features: {
      type: String,
      trim: true
    },
    amenities: [{
      type: String,
      trim: true
    }]
  },
  schedule: {
    departDate: {
      type: Date,
      required: [true, 'Ngày khởi hành là bắt buộc'],
      index: true
    },
    returnDate: {
      type: Date
    },
    departTime: {
      type: String,
      required: [true, 'Giờ khởi hành là bắt buộc'],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Định dạng giờ không hợp lệ (HH:MM)']
    },
    arrivalTime: {
      type: String,
      required: [true, 'Giờ đến là bắt buộc'],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Định dạng giờ không hợp lệ (HH:MM)']
    },
    duration: {
      type: String,
      required: [true, 'Thời gian di chuyển là bắt buộc']
    },
    pickupPoint: {
      type: String,
      required: [true, 'Điểm đón là bắt buộc'],
      trim: true
    },
    dropoffPoint: {
      type: String,
      required: [true, 'Điểm trả là bắt buộc'],
      trim: true
    }
  },
  price: {
    type: Number,
    required: [true, 'Giá vé là bắt buộc'],
    min: [0, 'Giá vé không được âm'],
    index: true
  },
  rating: {
    type: Number,
    min: [0, 'Đánh giá không được âm'],
    max: [5, 'Đánh giá không được vượt quá 5'],
    default: 0
  },
  reviews: {
    type: Number,
    min: [0, 'Số lượng đánh giá không được âm'],
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  isDeleted: {
  type: Boolean,
  default: false,
  index: true
},
deletedAt: {
  type: Date,
  default: null
}
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Tạo slug tự động trước khi lưu
transportSchema.pre('save', function(next) {
  if (!this.slug || this.isModified('company') || this.isModified('route')) {
    this.slug = slugify(`${this.company}-${this.route.fromCity}-${this.route.toCity}`, {
      lower: true,
      strict: true
    });
  }
  next();
});



// Index compound cho tìm kiếm hiệu quả
transportSchema.index({ 'route.fromCity': 1, 'route.toCity': 1, 'schedule.departDate': 1 });
transportSchema.index({ company: 1, isActive: 1 });
transportSchema.index({ price: 1, rating: -1 });
transportSchema.pre(['find', 'findOne', 'findOneAndUpdate', 'count', 'countDocuments'], function() {
  // Chỉ áp dụng filter nếu không có điều kiện isDeleted trong query
  if (!this.getQuery().hasOwnProperty('isDeleted')) {
    this.where({ isDeleted: { $ne: true } });
  }
});


// Virtual field cho route description
transportSchema.virtual('routeDescription').get(function() {
  return `${this.route.fromCity} - ${this.route.toCity}`;
});

// Static method để tìm kiếm
transportSchema.statics.findByRoute = function(fromCity, toCity, departDate) {
  const query = {
    isActive: true
  };
  
  if (fromCity) {
    query['route.fromCity'] = new RegExp(fromCity, 'i');
  }
  
  if (toCity) {
    query['route.toCity'] = new RegExp(toCity, 'i');
  }
  
  if (departDate) {
    const startDate = new Date(departDate);
    const endDate = new Date(departDate);
    endDate.setDate(endDate.getDate() + 1);
    
    query['schedule.departDate'] = {
      $gte: startDate,
      $lt: endDate
    };
  }
  
  return this.find(query);
};

// Instance method để kiểm tra còn ghế trống
transportSchema.methods.hasAvailableSeats = function(requestedSeats = 1) {
  // Logic này có thể mở rộng khi có booking system
  return this.bus.totalSeats >= requestedSeats;
};

transportSchema.methods.softDelete = function() {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return this.save({ validateBeforeSave: false }); // 🚀 tắt validate
};

transportSchema.methods.restore = function() {
  this.isDeleted = false;
  this.deletedAt = null;
  return this.save({ validateBeforeSave: false }); // 🚀 tắt validate
};


module.exports = mongoose.model('Transport', transportSchema);