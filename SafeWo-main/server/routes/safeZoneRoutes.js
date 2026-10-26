const express = require('express');
const router = express.Router();
const {
  getSafeZones,
  createSafeZone,
  updateSafeZone,
  deleteSafeZone,
  checkSafeZoneStatus,
} = require('../controllers/safeZoneController');
const { protect } = require('../middleware/auth');
const { safeZoneValidation } = require('../middleware/validation');

router.use(protect);

router.route('/')
  .get(getSafeZones)
  .post(safeZoneValidation, createSafeZone);

router.post('/check', checkSafeZoneStatus);

router.route('/:id')
  .put(updateSafeZone)
  .delete(deleteSafeZone);

module.exports = router;
