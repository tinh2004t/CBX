const mongoose = require('mongoose');

// Tour Schema - Simplified version
const tourSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  image: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  departure: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: String,
    required: true,
    trim: true
  },
  airline: {
    type: String,
    required: true,
    trim: true
  },
  scheduleInfo: {
    type: String,
    required: true,
    trim: true
  },
  region: {
    type: String,
    required: true,
    trim: true
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

// Simplified middleware - chỉ exclude soft deleted documents
tourSchema.pre(/^find/, function() {
  // Only apply filter if not explicitly including deleted items
  if (!this.getOptions().includeDeleted) {
    this.where({ isDeleted: { $ne: true } });
  }
});

// Static methods
tourSchema.statics.findWithDeleted = function() {
  return this.find().setOptions({ includeDeleted: true });
};

tourSchema.statics.findDeleted = function() {
  return this.find({ isDeleted: true }).setOptions({ includeDeleted: true });
};

tourSchema.statics.cleanupOldDeleted = function() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  return this.deleteMany({
    isDeleted: true,
    deletedAt: { $lt: thirtyDaysAgo }
  });
};

// Instance methods
tourSchema.methods.softDelete = function() {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return this.save();
};

tourSchema.methods.restore = function() {
  this.isDeleted = false;
  this.deletedAt = null;
  return this.save();
};

// Create Tour model
const Tour = mongoose.model('DomesticTour', tourSchema);

module.exports = Tour;