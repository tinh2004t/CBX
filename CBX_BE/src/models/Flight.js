const mongoose = require('mongoose');

const flightDetailSchema = new mongoose.Schema({
  time: {
    type: String,
    required: [true, 'Thời gian bay là bắt buộc']
  },
  duration: {
    type: String,
    required: [true, 'Thời gian bay là bắt buộc']
  },
  flightCode: {
    type: String,
    required: [true, 'Mã chuyến bay là bắt buộc'],
    unique: true
  },
  aircraft: {
    type: String,
    required: [true, 'Loại máy bay là bắt buộc']
  },
  status: {
    type: String,
    enum: ['Còn chỗ', 'Sắp hết', 'Hết chỗ'],
    default: 'Còn chỗ'
  }
}, {
  _id: false // Tắt auto _id cho subdocument
});

const flightSchema = new mongoose.Schema({
  departure: {
    type: String,
    required: [true, 'Điểm khởi hành là bắt buộc']
  },
  destination: {
    type: String,
    required: [true, 'Điểm đến là bắt buộc']
  },
  airline: {
    type: String,
    required: [true, 'Hãng hàng không là bắt buộc']
  },
  airlineLogo: {
    type: String,
    default: ''
  },
  date: {
    type: String,
    required: [true, 'Ngày bay là bắt buộc']
  },
  price: {
    type: String,
    required: [true, 'Giá vé là bắt buộc']
  },
  flights: [flightDetailSchema],
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

// Index để tối ưu tìm kiếm
flightSchema.index({ departure: 1, destination: 1, date: 1 });
flightSchema.index({ airline: 1 });
flightSchema.index({ isDeleted: 1 });
flightSchema.index({ deletedAt: 1 });

module.exports = mongoose.model('Flight', flightSchema);