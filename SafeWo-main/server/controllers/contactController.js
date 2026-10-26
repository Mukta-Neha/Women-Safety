const EmergencyContact = require('../models/EmergencyContact');

// @desc    Get all emergency contacts for current user
// @route   GET /api/contacts
// @access  Private
const getContacts = async (req, res, next) => {
  try {
    const contacts = await EmergencyContact.find({ userId: req.user.id }).sort({
      priority: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new emergency contact
// @route   POST /api/contacts
// @access  Private
const createContact = async (req, res, next) => {
  try {
    const { name, relationship, phone, email, priority, isPrimary } = req.body;

    // Check count limit (e.g. max 10 contacts per user)
    const existingCount = await EmergencyContact.countDocuments({ userId: req.user.id });
    if (existingCount >= 10) {
      return res.status(400).json({
        success: false,
        message: 'You can register a maximum of 10 emergency contacts.',
      });
    }

    // If marked as primary, demote other contacts
    if (isPrimary) {
      await EmergencyContact.updateMany(
        { userId: req.user.id },
        { $set: { isPrimary: false } }
      );
    }

    const contact = await EmergencyContact.create({
      userId: req.user.id,
      name,
      relationship,
      phone,
      email,
      priority: priority || (existingCount === 0 ? 1 : existingCount + 1),
      isPrimary: isPrimary || existingCount === 0, // First contact is automatically primary
    });

    res.status(201).json({
      success: true,
      message: 'Emergency contact added successfully',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update emergency contact
// @route   PUT /api/contacts/:id
// @access  Private
const updateContact = async (req, res, next) => {
  try {
    let contact = await EmergencyContact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Emergency contact not found',
      });
    }

    // Ensure contact belongs to user
    if (contact.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this contact',
      });
    }

    if (req.body.isPrimary) {
      await EmergencyContact.updateMany(
        { userId: req.user.id },
        { $set: { isPrimary: false } }
      );
    }

    contact = await EmergencyContact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Emergency contact updated successfully',
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete emergency contact
// @route   DELETE /api/contacts/:id
// @access  Private
const deleteContact = async (req, res, next) => {
  try {
    const contact = await EmergencyContact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Emergency contact not found',
      });
    }

    if (contact.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this contact',
      });
    }

    await contact.deleteOne();

    // If deleted contact was primary, promote next available
    if (contact.isPrimary) {
      const nextPrimary = await EmergencyContact.findOne({ userId: req.user.id }).sort({ priority: 1 });
      if (nextPrimary) {
        nextPrimary.isPrimary = true;
        await nextPrimary.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Emergency contact removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
};
