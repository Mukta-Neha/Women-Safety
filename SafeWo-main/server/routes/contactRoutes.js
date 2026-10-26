const express = require('express');
const router = express.Router();
const {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
} = require('../controllers/contactController');
const { protect } = require('../middleware/auth');
const { contactValidation } = require('../middleware/validation');

router.use(protect);

router.route('/')
  .get(getContacts)
  .post(contactValidation, createContact);

router.route('/:id')
  .put(updateContact)
  .delete(deleteContact);

module.exports = router;
