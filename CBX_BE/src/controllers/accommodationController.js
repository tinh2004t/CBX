const Accommodation = require('../models/Accommodation');
const AccommodationDetail = require('../models/AccommodationDetail');
const { slugify, generateUniqueSlug } = require('../utils/slugify');

// Create accommodation
const createAccommodation = async (req, res) => {
  try {
    const { name, location, image, rating, reviewCount, stars, price, type, detailData } = req.body;

    // Generate slug from name
    const baseSlug = slugify(name);
    const uniqueSlug = await generateUniqueSlug(Accommodation, baseSlug);

    // Create accommodation
    const accommodation = new Accommodation({
      slug: uniqueSlug,
      name,
      location,
      image,
      rating,
      reviewCount,
      stars,
      price,
      type
    });

    const savedAccommodation = await accommodation.save();

    // Create accommodation detail if provided
    let accommodationDetail = null;
    if (detailData) {
      accommodationDetail = new AccommodationDetail({
        accommodationId: savedAccommodation._id,
        slug: uniqueSlug, // Same slug as accommodation
        name,
        location,
        address: detailData.address,
        description: detailData.description,
        stars,
        rating,
        reviewCount,
        amenities: detailData.amenities || [],
        distances: detailData.distances || {},
        images: detailData.images || [],
        roomTypes: detailData.roomTypes || []
      });

      await accommodationDetail.save();
    }

    res.status(201).json({
      success: true,
      message: 'Accommodation created successfully',
      data: {
        accommodation: savedAccommodation,
        accommodationDetail
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating accommodation',
      error: error.message
    });
  }
};

// Get all accommodations (not deleted)
const getAllAccommodations = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, location, minRating, includeDeleted = false } = req.query;

    const filter = includeDeleted === 'true' ? {} : { isDeleted: false };

    if (type) filter.type = type;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (minRating) filter.rating = { $gte: parseFloat(minRating) };

    const accommodations = await Accommodation.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Accommodation.countDocuments(filter);

    res.json({
      success: true,
      data: accommodations,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching accommodations',
      error: error.message
    });
  }
};

// Get accommodation by slug with details
const getAccommodationBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const accommodation = await Accommodation.findOne({ 
      slug, 
      isDeleted: false 
    });

    if (!accommodation) {
      return res.status(404).json({
        success: false,
        message: 'Accommodation not found'
      });
    }

    const accommodationDetail = await AccommodationDetail.findOne({
      accommodationId: accommodation._id,
      isDeleted: false
    });

    res.json({
      success: true,
      data: {
        accommodation,
        accommodationDetail
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching accommodation',
      error: error.message
    });
  }
};

// Update accommodation
const updateAccommodation = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const accommodation = await Accommodation.findOne({ 
      _id: id, 
      isDeleted: false 
    });

    if (!accommodation) {
      return res.status(404).json({
        success: false,
        message: 'Accommodation not found'
      });
    }

    // If name is being updated, update slug in both collections
    if (updateData.name && updateData.name !== accommodation.name) {
      const baseSlug = slugify(updateData.name);
      const uniqueSlug = await generateUniqueSlug(Accommodation, baseSlug, accommodation._id);
      updateData.slug = uniqueSlug;

      // Update slug in accommodation detail as well
      await AccommodationDetail.findOneAndUpdate(
        { accommodationId: accommodation._id },
        { 
          slug: uniqueSlug,
          name: updateData.name // Update name in detail too
        }
      );
    }

    const updatedAccommodation = await Accommodation.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    // Update related fields in accommodation detail
    const detailUpdateData = {};
    if (updateData.location) detailUpdateData.location = updateData.location;
    if (updateData.stars) detailUpdateData.stars = updateData.stars;
    if (updateData.rating) detailUpdateData.rating = updateData.rating;
    if (updateData.reviewCount) detailUpdateData.reviewCount = updateData.reviewCount;

    if (Object.keys(detailUpdateData).length > 0) {
      await AccommodationDetail.findOneAndUpdate(
        { accommodationId: accommodation._id },
        detailUpdateData
      );
    }

    res.json({
      success: true,
      message: 'Accommodation updated successfully',
      data: updatedAccommodation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating accommodation',
      error: error.message
    });
  }
};

// Soft delete accommodation
const deleteAccommodation = async (req, res) => {
  try {
    const { id } = req.params;

    const accommodation = await Accommodation.findOne({ 
      _id: id, 
      isDeleted: false 
    });

    if (!accommodation) {
      return res.status(404).json({
        success: false,
        message: 'Accommodation not found'
      });
    }

    // Soft delete accommodation
    await Accommodation.findByIdAndUpdate(id, {
      isDeleted: true,
      deletedAt: new Date()
    });

    // Soft delete accommodation detail
    await AccommodationDetail.findOneAndUpdate(
      { accommodationId: id },
      {
        isDeleted: true,
        deletedAt: new Date()
      }
    );

    res.json({
      success: true,
      message: 'Accommodation deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting accommodation',
      error: error.message
    });
  }
};

// Permanent delete accommodation
const permanentDeleteAccommodation = async (req, res) => {
  try {
    const { id } = req.params;

    const accommodation = await Accommodation.findById(id);

    if (!accommodation) {
      return res.status(404).json({
        success: false,
        message: 'Accommodation not found'
      });
    }

    // Permanently delete accommodation detail first
    await AccommodationDetail.findOneAndDelete({ accommodationId: id });

    // Permanently delete accommodation
    await Accommodation.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Accommodation permanently deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error permanently deleting accommodation',
      error: error.message
    });
  }
};

// Restore deleted accommodation
const restoreAccommodation = async (req, res) => {
  try {
    const { id } = req.params;

    const accommodation = await Accommodation.findOne({ 
      _id: id, 
      isDeleted: true 
    });

    if (!accommodation) {
      return res.status(404).json({
        success: false,
        message: 'Deleted accommodation not found'
      });
    }

    // Restore accommodation
    await Accommodation.findByIdAndUpdate(id, {
      isDeleted: false,
      deletedAt: null
    });

    // Restore accommodation detail
    await AccommodationDetail.findOneAndUpdate(
      { accommodationId: id },
      {
        isDeleted: false,
        deletedAt: null
      }
    );

    res.json({
      success: true,
      message: 'Accommodation restored successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error restoring accommodation',
      error: error.message
    });
  }
};

// Clean up old deleted records (older than 30 days)
const cleanupOldDeleted = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Find accommodations deleted more than 30 days ago
    const oldDeletedAccommodations = await Accommodation.find({
      isDeleted: true,
      deletedAt: { $lt: thirtyDaysAgo }
    });

    const deletedIds = oldDeletedAccommodations.map(acc => acc._id);

    // Permanently delete accommodation details
    await AccommodationDetail.deleteMany({
      accommodationId: { $in: deletedIds }
    });

    // Permanently delete accommodations
    const result = await Accommodation.deleteMany({
      _id: { $in: deletedIds }
    });

    res.json({
      success: true,
      message: `Cleaned up ${result.deletedCount} old deleted accommodations`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cleaning up old deleted records',
      error: error.message
    });
  }
};

module.exports = {
  createAccommodation,
  getAllAccommodations,
  getAccommodationBySlug,
  updateAccommodation,
  deleteAccommodation,
  permanentDeleteAccommodation,
  restoreAccommodation,
  cleanupOldDeleted
};