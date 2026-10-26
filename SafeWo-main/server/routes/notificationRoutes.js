const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  clearNotifications,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getNotifications);
router.put('/read-all', markAllAsRead);
router.delete('/', clearNotifications);
router.put('/:id/read', markAsRead);

module.exports = router;
