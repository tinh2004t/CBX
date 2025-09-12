// routes/teamBuildingRoutes.js
const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();
const { 
  getAllTeamBuildingServices,
  getTeamBuildingServiceById,
  updateTeamBuildingService 
} = require('../controllers/TeamBuildingController');

router.use(authenticateToken);
router.get('/', getAllTeamBuildingServices);
router.get('/:id', getTeamBuildingServiceById);
router.put('/:id', updateTeamBuildingService);

module.exports = router;