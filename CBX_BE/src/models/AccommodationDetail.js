const mongoose = require('mongoose');

const roomTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const accommodationDetailSchema = new mongoose.Schema({
  accommodationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Accommodation',
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  stars: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  amenities: [{
    type: String
  }],
  distances: {
    type: Object,
    airport: String,
    beach: String,
    mall: String,
    cityCenter: String
  },
  images: [{
    type: String
  }],
  roomTypes: [roomTypeSchema],
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

// Index for performance
accommodationDetailSchema.index({ accommodationId: 1 });
accommodationDetailSchema.index({ isDeleted: 1 });

module.exports = mongoose.model('AccommodationDetail', accommodationDetailSchema);