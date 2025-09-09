const mongoose = require('mongoose');

// Oversea Tour Schema
const overseaTourSchema = new mongoose.Schema({
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
  continent: {
    type: String,
    required: true,
    trim: true,
    enum: ['Châu Á', 'Châu Âu', 'Châu Úc', 'Châu Mỹ', 'Châu Phi']
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
overseaTourSchema.pre(/^find/, function() {
  // Only apply filter if not explicitly including deleted items
  if (!this.getOptions().includeDeleted) {
    this.where({ isDeleted: { $ne: true } });
  }
});

// Static methods
overseaTourSchema.statics.findWithDeleted = function() {
  return this.find().setOptions({ includeDeleted: true });
};

overseaTourSchema.statics.findDeleted = function() {
  return this.find({ isDeleted: true }).setOptions({ includeDeleted: true });
};

overseaTourSchema.statics.findByContinent = function(continent) {
  return this.find({ continent: continent });
};

overseaTourSchema.statics.cleanupOldDeleted = function() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  return this.deleteMany({
    isDeleted: true,
    deletedAt: { $lt: thirtyDaysAgo }
  });
};

// Instance methods
overseaTourSchema.methods.softDelete = function() {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return this.save();
};

overseaTourSchema.methods.restore = function() {
  this.isDeleted = false;
  this.deletedAt = null;
  return this.save();
};

// Create Oversea Tour model
const OverseaTour = mongoose.model('OverseaTour', overseaTourSchema);

module.exports = OverseaTour;