  const mongoose = require('mongoose');
  const bcrypt = require('bcryptjs');

  const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['Admin', 'SuperAdmin'],
      default: 'Admin'
    }
  }, {
    timestamps: true
  });

  // Hash password trước khi save
  userSchema.pre('save', async function(next) {
    if (!this.isModified('passwordHash')) return next();
    
    try {
      const salt = await bcrypt.genSalt(10);
      this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
      next();
    } catch (error) {
      next(error);
    }
  });

  // Method để so sánh password
  userSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password, this.passwordHash);
  };

  module.exports = mongoose.model('User', userSchema);