const express = require('express');
const router = express.Router();
const {
  getSafeHavens,
  getSafeHavenById,
  createSafeHaven,
  evaluateRouteSafety,
} = require('../controllers/safeHavenController');
const { protect } = require('../middleware/auth');

router.get('/', getSafeHavens);
router.post('/route-score', evaluateRouteSafety);
router.get('/:id', getSafeHavenById);
router.post('/', protect, createSafeHaven);

module.exports = router;
