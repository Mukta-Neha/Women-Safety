const Alert = require('../models/Alert');
const Location = require('../models/Location');
const EmergencyContact = require('../models/EmergencyContact');
const Notification = require('../models/Notification');
const {
  emitSOSCreated,
  emitSOSUpdated,
  emitSOSResolved,
  emitLocationUpdate,
  emitNotificationNew,
} = require('../socket/socketHandler');
const { sendEmergencyNotifications } = require('../services/notificationService');

// @desc    Trigger one-click SOS emergency alert
// @route   POST /api/alerts/sos
// @access  Private
const triggerSOS = async (req, res, next) => {
  try {
    const { latitude, longitude, accuracy, message, type } = req.body;

    // Check if user already has an active SOS
    const existingActive = await Alert.findOne({
      userId: req.user.id,
      status: { $in: ['ACTIVE', 'ACKNOWLEDGED'] },
    });

    if (existingActive) {
      return res.status(200).json({
        success: true,
        message: 'An active SOS alert is already in progress',
        data: existingActive,
        alreadyActive: true,
      });
    }

    // Get user's emergency contacts
    const contacts = await EmergencyContact.find({ userId: req.user.id });

    // Format and dispatch SMS / WhatsApp notifications
    const dispatchInfo = await sendEmergencyNotifications({
      user: req.user,
      alert: { latitude, longitude },
      contacts,
    });

    const emergencyContactsNotified = dispatchInfo.contactsDispatched.map((c) => ({
      contactId: c.contactId.toString(),
      name: c.name,
      phone: c.phone,
      status: c.status,
    }));

    const recipients = contacts.map((c) => `${c.name} (${c.phone})`);

    // Create the SOS alert in MongoDB
    const alert = await Alert.create({
      userId: req.user.id,
      type: type || 'SOS',
      latitude,
      longitude,
      accuracy: accuracy || 10,
      message: message || dispatchInfo.emergencyMessage,
      status: 'ACTIVE',
      emergencyContactsNotified,
      recipients,
    });

    // Record initial location in tracking log
    await Location.create({
      userId: req.user.id,
      alertId: alert._id,
      latitude,
      longitude,
      accuracy: accuracy || 10,
    });

    // Create In-App Notification
    const notif = await Notification.create({
      userId: req.user.id,
      type: 'SOS',
      title: '🚨 Emergency SOS Activated',
      message: `Your emergency alert has been sent. ${contacts.length} emergency contacts were notified with your live GPS location.`,
      link: `/sos`,
      metadata: { alertId: alert._id },
    });

    // Emit real-time Socket.io events
    emitSOSCreated(alert, {
      id: req.user._id,
      name: req.user.name,
      phone: req.user.phone,
      email: req.user.email,
    });

    emitNotificationNew(req.user.id, notif);

    res.status(201).json({
      success: true,
      message: '🚨 Emergency SOS broadcast successfully!',
      data: alert,
      autoDispatch: {
        emailDispatch: dispatchInfo.emailDispatch,
        primaryWhatsAppUrl: dispatchInfo.primaryWhatsAppUrl,
        generalWhatsAppLink: dispatchInfo.generalWhatsAppLink,
        contactsDispatched: dispatchInfo.contactsDispatched,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's active SOS alert (if any)
// @route   GET /api/alerts/active
// @access  Private
const getActiveAlert = async (req, res, next) => {
  try {
    const alert = await Alert.findOne({
      userId: req.user.id,
      status: { $in: ['ACTIVE', 'ACKNOWLEDGED'] },
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: alert || null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update live location during active SOS
// @route   POST /api/alerts/location
// @access  Private
const updateLiveLocation = async (req, res, next) => {
  try {
    const { latitude, longitude, accuracy, speed, heading, alertId } = req.body;

    let targetAlert = null;
    if (alertId) {
      targetAlert = await Alert.findById(alertId);
    } else {
      targetAlert = await Alert.findOne({
        userId: req.user.id,
        status: { $in: ['ACTIVE', 'ACKNOWLEDGED'] },
      });
    }

    if (targetAlert) {
      targetAlert.latitude = latitude;
      targetAlert.longitude = longitude;
      if (accuracy) targetAlert.accuracy = accuracy;
      await targetAlert.save();
    }

    // Save location breadcrumb
    const locationEntry = await Location.create({
      userId: req.user.id,
      alertId: targetAlert?._id,
      latitude,
      longitude,
      accuracy: accuracy || 0,
      speed: speed || 0,
      heading: heading || 0,
    });

    // Broadcast update via Socket.io
    emitLocationUpdate({
      userId: req.user.id,
      alertId: targetAlert?._id,
      userName: req.user.name,
      userPhone: req.user.phone,
      latitude,
      longitude,
      accuracy,
      speed,
      timestamp: locationEntry.timestamp,
    });

    res.status(200).json({
      success: true,
      message: 'Location tracked successfully',
      data: locationEntry,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resolve an SOS alert
// @route   PUT /api/alerts/:id/resolve
// @access  Private
const resolveAlert = async (req, res, next) => {
  try {
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'SOS Alert not found',
      });
    }

    // Must be alert owner or ADMIN
    if (alert.userId.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to resolve this alert',
      });
    }

    alert.status = 'RESOLVED';
    alert.resolvedAt = Date.now();
    alert.resolvedBy = req.user.id;
    if (req.body.resolutionNotes) {
      alert.resolutionNotes = req.body.resolutionNotes;
    }
    await alert.save();

    // Create Notification
    const notif = await Notification.create({
      userId: alert.userId,
      type: 'Safety',
      title: '✅ SOS Alert Resolved',
      message: 'Your emergency alert has been marked as resolved. Glad you are safe!',
      link: `/alerts`,
    });

    emitSOSResolved(alert);
    emitNotificationNew(alert.userId, notif);

    res.status(200).json({
      success: true,
      message: 'SOS Alert marked as RESOLVED',
      data: alert,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel an SOS alert
// @route   PUT /api/alerts/:id/cancel
// @access  Private
const cancelAlert = async (req, res, next) => {
  try {
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'SOS Alert not found',
      });
    }

    if (alert.userId.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this alert',
      });
    }

    alert.status = 'CANCELLED';
    alert.resolvedAt = Date.now();
    alert.resolvedBy = req.user.id;
    alert.resolutionNotes = req.body.reason || 'Cancelled by user';
    await alert.save();

    emitSOSUpdated(alert);

    res.status(200).json({
      success: true,
      message: 'SOS Alert has been cancelled',
      data: alert,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's alert history
// @route   GET /api/alerts
// @access  Private
const getAlerts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const query = { userId: req.user.id };
    if (req.query.status && req.query.status !== 'ALL') {
      query.status = req.query.status;
    }

    const total = await Alert.countDocuments(query);
    const alerts = await Alert.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: alerts.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: alerts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get alert details with location trail
// @route   GET /api/alerts/:id
// @access  Private
const getAlertById = async (req, res, next) => {
  try {
    const alert = await Alert.findById(req.params.id).populate('userId', 'name phone email profileImage');

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found',
      });
    }

    // Check permission (owner or admin)
    if (alert.userId._id.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this alert',
      });
    }

    // Get location trail
    const locations = await Location.find({ alertId: alert._id }).sort({ timestamp: 1 }).limit(50);

    res.status(200).json({
      success: true,
      data: {
        alert,
        trail: locations,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  triggerSOS,
  getActiveAlert,
  updateLiveLocation,
  resolveAlert,
  cancelAlert,
  getAlerts,
  getAlertById,
};
