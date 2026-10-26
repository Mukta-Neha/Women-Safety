const express = require('express');
const router = express.Router();
const {
  getStats,
  getAdminAlerts,
  updateAdminAlert,
  getAdminIncidents,
  updateAdminIncidentStatus,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('ADMIN'));

router.get('/stats', getStats);
router.get('/alerts', getAdminAlerts);
router.put('/alerts/:id', updateAdminAlert);
router.get('/incidents', getAdminIncidents);
router.put('/incidents/:id', updateAdminIncidentStatus);

module.exports = router;
