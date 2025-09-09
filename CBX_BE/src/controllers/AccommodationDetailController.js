const AccommodationDetail = require('../models/AccommodationDetail');
const Accommodation = require('../models/Accommodation');

// Update accommodation detail
const updateAccommodationDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove slug from updateData to prevent modification
    if (updateData.slug) {
      delete updateData.slug;
    }

    // Also remove accommodationId to prevent modification
    if (updateData.accommodationId) {
      delete updateData.accommodationId;
    }

    const accommodationDetail = await AccommodationDetail.findOne({ 
      _id: id, 
      isDeleted: false 
    });

    if (!accommodationDetail) {
      return res.status(404).json({
        success: false,
        message: 'Accommodation detail not found'
      });
    }

    // Validate roomTypes if provided
    if (updateData.roomTypes) {
      const isValidRoomTypes = updateData.roomTypes.every(room => 
        room.type && room.name && room.price && room.description
      );
      
      if (!isValidRoomTypes) {
        return res.status(400).json({
          success: false,
          message: 'Invalid room types format. Each room must have type, name, price, and description'
        });
      }
    }

    // Validate rating if provided
    if (updateData.rating && (updateData.rating < 0 || updateData.rating > 5)) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 0 and 5'
      });
    }

    // Validate stars if provided
    if (updateData.stars && (updateData.stars < 1 || updateData.stars > 5)) {
      return res.status(400).json({
        success: false,
        message: 'Stars must be between 1 and 5'
      });
    }

    // Validate reviewCount if provided
    if (updateData.reviewCount && updateData.reviewCount < 0) {
      return res.status(400).json({
        success: false,
        message: 'Review count cannot be negative'
      });
    }

    const updatedAccommodationDetail = await AccommodationDetail.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Accommodation detail updated successfully',
      data: updatedAccommodationDetail
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating accommodation detail',
      error: error.message
    });
  }
};

// Get accommodation detail by ID
const getAccommodationDetailById = async (req, res) => {
  try {
    const { id } = req.params;

    const accommodationDetail = await AccommodationDetail.findOne({ 
      _id: id, 
      isDeleted: false 
    }).populate('accommodationId', 'name slug type price');

    if (!accommodationDetail) {
      return res.status(404).json({
        success: false,
        message: 'Accommodation detail not found'
      });
    }

    res.json({
      success: true,
      data: accommodationDetail
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching accommodation detail',
      error: error.message
    });
  }
};

// Get accommodation detail by slug
const getAccommodationDetailBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const accommodationDetail = await AccommodationDetail.findOne({ 
      slug, 
      isDeleted: false 
    }).populate('accommodationId', 'name slug type price');

    if (!accommodationDetail) {
      return res.status(404).json({
        success: false,
        message: 'Accommodation detail not found'
      });
    }

    res.json({
      success: true,
      data: accommodationDetail
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching accommodation detail',
      error: error.message
    });
  }
};

// Get all accommodation details with filters
const getAllAccommodationDetails = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      location, 
      minRating, 
      maxPrice, 
      minPrice,
      amenities,
      stars,
      search
    } = req.query;

    const filter = { isDeleted: false };

    // Search by location or address
    if (location) {
      filter.$or = [
        { location: { $regex: location, $options: 'i' } },
        { address: { $regex: location, $options: 'i' } }
      ];
    }

    // General search (name, location, address, description)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (minRating) filter.rating = { $gte: parseFloat(minRating) };
    if (stars) filter.stars = parseInt(stars);

    // Filter by room price range
    if (minPrice || maxPrice) {
      const priceFilter = {};
      if (minPrice) priceFilter.$gte = parseInt(minPrice);
      if (maxPrice) priceFilter.$lte = parseInt(maxPrice);
      filter['roomTypes.price'] = priceFilter;
    }

    // Filter by amenities
    if (amenities) {
      const amenityArray = amenities.split(',').map(a => a.trim());
      filter.amenities = { $in: amenityArray };
    }

    const accommodationDetails = await AccommodationDetail.find(filter)
      .populate('accommodationId', 'name slug type price')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await AccommodationDetail.countDocuments(filter);

    res.json({
      success: true,
      data: accommodationDetails,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching accommodation details',
      error: error.message
    });
  }
};

// Add new room type to accommodation detail
const addRoomType = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, name, price, description } = req.body;

    if (!type || !name || !price || !description) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: type, name, price, description'
      });
    }

    const accommodationDetail = await AccommodationDetail.findOne({
      _id: id,
      isDeleted: false
    });

    if (!accommodationDetail) {
      return res.status(404).json({
        success: false,
        message: 'Accommodation detail not found'
      });
    }

    // Check if room type already exists
    const existingRoomType = accommodationDetail.roomTypes.find(
      room => room.type === type
    );

    if (existingRoomType) {
      return res.status(400).json({
        success: false,
        message: 'Room type already exists'
      });
    }

    accommodationDetail.roomTypes.push({
      type,
      name,
      price,
      description
    });

    await accommodationDetail.save();

    res.json({
      success: true,
      message: 'Room type added successfully',
      data: accommodationDetail
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding room type',
      error: error.message
    });
  }
};

// Update specific room type
const updateRoomType = async (req, res) => {
  try {
    const { id, roomTypeId } = req.params;
    const { type, name, price, description } = req.body;

    const accommodationDetail = await AccommodationDetail.findOne({
      _id: id,
      isDeleted: false
    });

    if (!accommodationDetail) {
      return res.status(404).json({
        success: false,
        message: 'Accommodation detail not found'
      });
    }

    const roomType = accommodationDetail.roomTypes.id(roomTypeId);

    if (!roomType) {
      return res.status(404).json({
        success: false,
        message: 'Room type not found'
      });
    }

    // Update room type fields if provided
    if (type) roomType.type = type;
    if (name) roomType.name = name;
    if (price) roomType.price = price;
    if (description) roomType.description = description;

    await accommodationDetail.save();

    res.json({
      success: true,
      message: 'Room type updated successfully',
      data: accommodationDetail
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating room type',
      error: error.message
    });
  }
};

// Delete room type
const deleteRoomType = async (req, res) => {
  try {
    const { id, roomTypeId } = req.params;

    const accommodationDetail = await AccommodationDetail.findOne({
      _id: id,
      isDeleted: false
    });

    if (!accommodationDetail) {
      return res.status(404).json({
        success: false,
        message: 'Accommodation detail not found'
      });
    }

    const roomType = accommodationDetail.roomTypes.id(roomTypeId);

    if (!roomType) {
      return res.status(404).json({
        success: false,
        message: 'Room type not found'
      });
    }

    accommodationDetail.roomTypes.pull(roomTypeId);
    await accommodationDetail.save();

    res.json({
      success: true,
      message: 'Room type deleted successfully',
      data: accommodationDetail
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting room type',
      error: error.message
    });
  }
};

module.exports = {
  updateAccommodationDetail,
  getAccommodationDetailById,
  getAccommodationDetailBySlug,
  getAllAccommodationDetails,
  addRoomType,
  updateRoomType,
  deleteRoomType
};