// routes/teamBuildingRoutes.js
const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const { 
  getAllTeamBuildingServices,
  getTeamBuildingServiceById,
  updateTeamBuildingService 
} = require('../controllers/TeamBuildingController');


router.get('/', getAllTeamBuildingServices);
router.get('/:id', getTeamBuildingServiceById);
router.use(authenticateToken);
router.put('/:id', updateTeamBuildingService);

module.exports = router;