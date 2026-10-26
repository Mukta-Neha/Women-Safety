const express = require('express');
const router = express.Router();
const {
  startJourney,
  getActiveJourney,
  checkInJourney,
  extendJourney,
  completeJourney,
  triggerMissedCheckIn,
  getJourneyHistory,
} = require('../controllers/safeJourneyController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', startJourney);
router.get('/active', getActiveJourney);
router.get('/history', getJourneyHistory);
router.put('/:id/check-in', checkInJourney);
router.put('/:id/extend', extendJourney);
router.put('/:id/complete', completeJourney);
router.put('/:id/missed', triggerMissedCheckIn);

module.exports = router;
