const Flight = require('../models/Flight');
const { validateFlight, validateFlightUpdate } = require('../middleware/flightValidation');

// Lấy tất cả chuyến bay
const getAllFlights = async (req, res) => {
  try {
    const {
      departure,
      destination,
      date,
      airline,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Tạo filter object
    const filter = {};
    if (departure) filter.departure = new RegExp(departure, 'i');
    if (destination) filter.destination = new RegExp(destination, 'i');
    if (date) filter.date = date;
    if (airline) filter.airline = new RegExp(airline, 'i');

    // Pagination
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const flights = await Flight.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip(skip);

    const total = await Flight.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: flights,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Lấy chuyến bay theo ID
const getFlightById = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    
    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chuyến bay'
      });
    }

    res.status(200).json({
      success: true,
      data: flight
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Tạo chuyến bay mới
const createFlight = async (req, res) => {
  try {
    const { error, value } = validateFlight(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: error.details.map(detail => detail.message)
      });
    }

    const flight = new Flight(value);
    await flight.save();

    res.status(201).json({
      success: true,
      message: 'Tạo chuyến bay thành công',
      data: flight
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Mã chuyến bay đã tồn tại'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Cập nhật chuyến bay
const updateFlight = async (req, res) => {
  try {
    const { error, value } = validateFlightUpdate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: error.details.map(detail => detail.message)
      });
    }

    const flight = await Flight.findByIdAndUpdate(
      req.params.id,
      value,
      { new: true, runValidators: true }
    );

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chuyến bay'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật chuyến bay thành công',
      data: flight
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Xóa chuyến bay
const deleteFlight = async (req, res) => {
  try {
    const flight = await Flight.findByIdAndDelete(req.params.id);

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chuyến bay'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Xóa chuyến bay thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Tìm kiếm chuyến bay
const searchFlights = async (req, res) => {
  try {
    const { departure, destination, date } = req.query;

    if (!departure || !destination || !date) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ thông tin: điểm khởi hành, điểm đến và ngày bay'
      });
    }

    const flights = await Flight.find({
      departure: new RegExp(departure, 'i'),
      destination: new RegExp(destination, 'i'),
      date: date
    });

    res.status(200).json({
      success: true,
      data: flights,
      count: flights.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Cập nhật trạng thái chuyến bay con
const updateFlightStatus = async (req, res) => {
  try {
    const { flightId, flightCode } = req.params;
    const { status } = req.body;

    if (!['Còn chỗ', 'Sắp hết', 'Hết chỗ'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái không hợp lệ'
      });
    }

    const flight = await Flight.findOneAndUpdate(
      { _id: flightId, 'flights.flightCode': flightCode },
      { $set: { 'flights.$.status': status } },
      { new: true }
    );

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chuyến bay hoặc mã chuyến bay'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật trạng thái thành công',
      data: flight
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

const addSubFlight = async (req, res) => {
  try {
    const { flightId } = req.params;
    const { flightCode, departureTime, arrivalTime, price, availableSeats, status = 'Còn chỗ' } = req.body;

    // Validate required fields
    if (!flightCode || !departureTime || !arrivalTime || !price || !availableSeats) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ thông tin: mã chuyến bay, giờ khởi hành, giờ đến, giá và số ghế'
      });
    }

    // Validate status
    if (!['Còn chỗ', 'Sắp hết', 'Hết chỗ'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái không hợp lệ'
      });
    }

    // Check if flight exists and flightCode is unique within this flight
    const existingFlight = await Flight.findOne({
      _id: flightId,
      'flights.flightCode': flightCode
    });

    if (existingFlight) {
      return res.status(400).json({
        success: false,
        message: 'Mã chuyến bay con đã tồn tại trong chuyến bay này'
      });
    }

    const newSubFlight = {
      flightCode,
      departureTime,
      arrivalTime,
      price,
      availableSeats,
      status
    };

    const flight = await Flight.findByIdAndUpdate(
      flightId,
      { $push: { flights: newSubFlight } },
      { new: true, runValidators: true }
    );

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chuyến bay chính'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Thêm chuyến bay con thành công',
      data: flight
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Sửa thông tin chuyến bay con
const updateSubFlight = async (req, res) => {
  try {
    const { flightId, flightCode } = req.params;
    const updateData = req.body;

    // Validate status if provided
    if (updateData.status && !['Còn chỗ', 'Sắp hết', 'Hết chỗ'].includes(updateData.status)) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái không hợp lệ'
      });
    }

    // Check if trying to update flightCode to an existing one
    if (updateData.flightCode && updateData.flightCode !== flightCode) {
      const existingFlight = await Flight.findOne({
        _id: flightId,
        'flights.flightCode': updateData.flightCode
      });

      if (existingFlight) {
        return res.status(400).json({
          success: false,
          message: 'Mã chuyến bay con mới đã tồn tại trong chuyến bay này'
        });
      }
    }

    // Create update object with proper field paths
    const updateFields = {};
    Object.keys(updateData).forEach(key => {
      updateFields[`flights.$.${key}`] = updateData[key];
    });

    const flight = await Flight.findOneAndUpdate(
      { _id: flightId, 'flights.flightCode': flightCode },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chuyến bay hoặc mã chuyến bay con'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật chuyến bay con thành công',
      data: flight
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Xóa chuyến bay con
const deleteSubFlight = async (req, res) => {
  try {
    const { flightId, flightCode } = req.params;

    const flight = await Flight.findByIdAndUpdate(
      flightId,
      { $pull: { flights: { flightCode: flightCode } } },
      { new: true }
    );

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chuyến bay chính'
      });
    }

    // Check if the sub-flight was actually removed
    const subFlightExists = flight.flights.some(f => f.flightCode === flightCode);
    if (subFlightExists) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chuyến bay con với mã này'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Xóa chuyến bay con thành công',
      data: flight
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Lấy thông tin chuyến bay con theo mã
const getSubFlightByCode = async (req, res) => {
  try {
    const { flightId, flightCode } = req.params;

    const flight = await Flight.findOne(
      { _id: flightId, 'flights.flightCode': flightCode },
      { 'flights.$': 1, departure: 1, destination: 1, date: 1, airline: 1 }
    );

    if (!flight || !flight.flights || flight.flights.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chuyến bay con'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        mainFlight: {
          departure: flight.departure,
          destination: flight.destination,
          date: flight.date,
          airline: flight.airline
        },
        subFlight: flight.flights[0]
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Lấy tất cả chuyến bay con của một chuyến bay chính
const getAllSubFlights = async (req, res) => {
  try {
    const { flightId } = req.params;

    const flight = await Flight.findById(flightId);

    if (!flight) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy chuyến bay chính'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        mainFlight: {
          _id: flight._id,
          departure: flight.departure,
          destination: flight.destination,
          date: flight.date,
          airline: flight.airline
        },
        subFlights: flight.flights || [],
        count: flight.flights ? flight.flights.length : 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Cập nhật exports
module.exports = {
  getAllFlights,
  getFlightById,
  createFlight,
  updateFlight,
  deleteFlight,
  searchFlights,
  updateFlightStatus,
  // New functions for sub-flights
  addSubFlight,
  updateSubFlight,
  deleteSubFlight,
  getSubFlightByCode,
  getAllSubFlights
};
