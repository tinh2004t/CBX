const express = require('express');
const { authenticateToken, requireSuperAdmin } = require('../middleware/auth');
const router = express.Router();
const {
  getAllFlights,
  getDeletedFlights,
  getFlightById,
  createFlight,
  updateFlight,
  softDeleteFlight,
  deletePermanent,
  restoreFlight,
  cleanupFlights,
  searchFlights,
  updateFlightStatus,
  addSubFlight,
  updateSubFlight,
  deleteSubFlight,
  getSubFlightByCode,
  getAllSubFlights
} = require('../controllers/FlightController');

// Main flight routes
router.get('/', getAllFlights);                    // GET /api/flights - Lấy tất cả chuyến bay (chưa xóa)
router.get('/deleted', authenticateToken, getDeletedFlights);         // GET /api/flights/deleted - Lấy chuyến bay đã xóa mềm
router.get('/search', searchFlights);              // GET /api/flights/search - Tìm kiếm chuyến bay
router.post('/cleanup', authenticateToken, cleanupFlights);           // POST /api/flights/cleanup - Dọn dẹp chuyến bay cũ
router.get('/:id', getFlightById);                 // GET /api/flights/:id - Lấy chuyến bay theo ID
router.post('/', authenticateToken, createFlight);                    // POST /api/flights - Tạo chuyến bay mới
router.put('/:id', authenticateToken, updateFlight);                  // PUT /api/flights/:id - Cập nhật chuyến bay
router.delete('/:id/', authenticateToken, softDeleteFlight);      // DELETE /api/flights/:id/soft - Xóa mềm chuyến bay
router.delete('/:id/permanent', authenticateToken, deletePermanent);  // DELETE /api/flights/:id/permanent - Xóa vĩnh viễn
router.post('/:id/restore', authenticateToken, restoreFlight);        // POST /api/flights/:id/restore - Khôi phục chuyến bay

// Sub-flight routes
router.get('/:flightId/subflights', getAllSubFlights);                    // GET /api/flights/:flightId/subflights
router.get('/:flightId/subflights/:flightCode', getSubFlightByCode);      // GET /api/flights/:flightId/subflights/:flightCode
router.post('/:flightId/subflights', authenticateToken, addSubFlight);                       // POST /api/flights/:flightId/subflights
router.put('/:flightId/subflights/:flightCode', authenticateToken, updateSubFlight);         // PUT /api/flights/:flightId/subflights/:flightCode
router.delete('/:flightId/subflights/:flightCode', authenticateToken, deleteSubFlight);      // DELETE /api/flights/:flightId/subflights/:flightCode
router.patch('/:flightId/subflights/:flightCode/status', authenticateToken, updateFlightStatus); // PATCH /api/flights/:flightId/subflights/:flightCode/status

module.exports = router;