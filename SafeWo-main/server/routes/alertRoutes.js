const express = require('express');
const router = express.Router();
const {
  triggerSOS,
  getActiveAlert,
  updateLiveLocation,
  resolveAlert,
  cancelAlert,
  getAlerts,
  getAlertById,
} = require('../controllers/alertController');
const { protect } = require('../middleware/auth');
const { sosValidation } = require('../middleware/validation');

router.use(protect);

router.post('/sos', sosValidation, triggerSOS);
router.get('/active', getActiveAlert);
router.post('/location', updateLiveLocation);
router.get('/', getAlerts);
router.get('/:id', getAlertById);
router.put('/:id/resolve', resolveAlert);
router.put('/:id/cancel', cancelAlert);

module.exports = router;
