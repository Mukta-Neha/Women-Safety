const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  updatePassword,
  getUsers,
  deleteUser,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/me', getProfile);
router.put('/me', updateProfile);
router.put('/update-password', updatePassword);

// Admin-only user management
router.get('/', authorize('ADMIN'), getUsers);
router.delete('/:id', authorize('ADMIN'), deleteUser);

module.exports = router;
