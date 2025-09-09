const mongoose = require('mongoose');

const accommodationSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true
  },
  image: {
    type: String,
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
  stars: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Hotel', 'Homestay', 'Resort', 'Villa', 'Apartment']
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

// Index for performance
accommodationSchema.index({ slug: 1 });
accommodationSchema.index({ isDeleted: 1 });
accommodationSchema.index({ deletedAt: 1 });

module.exports = mongoose.model('Accommodation', accommodationSchema);