const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getAllFlights,
  getFlightById,
  createFlight,
  updateFlight,
  deleteFlight,
  searchFlights,
  updateFlightStatus,
  addSubFlight,
  updateSubFlight,
  deleteSubFlight,
  getSubFlightByCode,
  getAllSubFlights
} = require('../controllers/FlightController');

// Routes
router.get('/', getAllFlights);
router.get('/search', searchFlights);
router.get('/:id', getFlightById);
router.post('/', authenticateToken, createFlight);
router.put('/:id', authenticateToken, updateFlight);
router.delete('/:id', authenticateToken, deleteFlight);

router.get('/:flightId/flights', getAllSubFlights); // Lấy tất cả chuyến bay con
router.get('/:flightId/flights/:flightCode', getSubFlightByCode); // Lấy chuyến bay con theo mã
router.post('/:flightId/flights', authenticateToken, addSubFlight); // Thêm chuyến bay con
router.put('/:flightId/flights/:flightCode', authenticateToken, updateSubFlight); // Sửa chuyến bay con
router.delete('/:flightId/flights/:flightCode', authenticateToken, deleteSubFlight); // Xóa chuyến bay con
router.patch('/:flightId/flights/:flightCode/status', authenticateToken, updateFlightStatus); // Cập nhật trạng thái (đã có)

module.exports = router;