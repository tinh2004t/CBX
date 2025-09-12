// controllers/teamBuildingController.js
const mongoose = require('mongoose');
const TeamBuildingService = require('../models/TeamBuilding');

// GET - Lấy danh sách tất cả dịch vụ
const getAllTeamBuildingServices = async (req, res) => {
  try {
    const services = await TeamBuildingService.find();
    
    res.status(200).json({
      success: true,
      message: 'Lấy danh sách dịch vụ thành công',
      data: services,
      count: services.length
    });

  } catch (error) {
    console.error('Lỗi lấy danh sách dịch vụ:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server nội bộ',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// GET - Lấy một dịch vụ theo ID
const getTeamBuildingServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Document ID không hợp lệ'
      });
    }

    const service = await TeamBuildingService.findById(id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy dịch vụ'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lấy thông tin dịch vụ thành công',
      data: service
    });

  } catch (error) {
    console.error('Lỗi lấy thông tin dịch vụ:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server nội bộ',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// PUT - Cập nhật dịch vụ
const updateTeamBuildingService = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    console.log('ID nhận được:', id);
    console.log('Data cập nhật:', JSON.stringify(updateData, null, 2));

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Document ID không hợp lệ',
        receivedId: id
      });
    }

    const existingService = await TeamBuildingService.findById(id);
    if (!existingService) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy dịch vụ với ID này',
        searchedId: id
      });
    }

    const updatedService = await TeamBuildingService.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Cập nhật dịch vụ thành công',
      data: updatedService
    });

  } catch (error) {
    console.error('Lỗi cập nhật dịch vụ:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: errors
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID không đúng định dạng MongoDB',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Lỗi server nội bộ',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getAllTeamBuildingServices,
  getTeamBuildingServiceById,
  updateTeamBuildingService
};