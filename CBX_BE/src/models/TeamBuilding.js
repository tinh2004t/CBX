const mongoose = require('mongoose');

const teamBuildingSchema = new mongoose.Schema({
  service: {
    title: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      min: 0,
      max: 5
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    viewCount: {
      type: Number,
      default: 0
    },
    price: {
      type: String,
      required: true
    },
    location: [{
      type: String
    }],
    description: {
      type: String
    }
  },
  contact: {
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    }
  },
  images: [{
    type: String
  }],
  teamBuilding: {
    definition: {
      type: String
    },
    roles: [{
      type: String
    }],
    types: [{
      name: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      }
    }]
  }
}, {
  timestamps: true
});

const TeamBuilding = mongoose.model('TeamBuilding', teamBuildingSchema);

module.exports = TeamBuilding;