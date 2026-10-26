const express = require('express');
const router = express.Router();
const {
  getIncidents,
  getIncidentById,
  createIncident,
  updateIncident,
  deleteIncident,
  toggleHelpful,
  reportMisinformation,
} = require('../controllers/incidentController');
const { protect } = require('../middleware/auth');
const { incidentValidation } = require('../middleware/validation');

// Publicly readable incident explorer
router.get('/', getIncidents);
router.get('/:id', getIncidentById);

// Protected actions
router.post('/', protect, incidentValidation, createIncident);
router.put('/:id', protect, updateIncident);
router.delete('/:id', protect, deleteIncident);
router.post('/:id/helpful', protect, toggleHelpful);
router.post('/:id/misinformation', protect, reportMisinformation);

module.exports = router;
