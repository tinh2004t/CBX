// models/BlogPostData.js
const mongoose = require('mongoose');

const blogPostDataSchema = new mongoose.Schema({
  blogPostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BlogPost',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  views: {
    type: Number,
    default: 0
  },
  location: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    name: {
      type: String,
      required: true
    }
  },
  publishDate: {
    type: Date,
    required: true
  },
  content: {
    type: String,
    default: '<p>Nội dung đang được cập nhật...</p>'
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
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

module.exports = mongoose.model('BlogPostData', blogPostDataSchema);