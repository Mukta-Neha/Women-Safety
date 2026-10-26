const SafeZone = require('../models/SafeZone');
const { isPointInsideSafeZone, calculateDistanceMeters } = require('../utils/distance');

// @desc    Get all safe zones for current user
// @route   GET /api/safe-zones
// @access  Private
const getSafeZones = async (req, res, next) => {
  try {
    const { userLat, userLon } = req.query;
    const safeZones = await SafeZone.find({ userId: req.user.id }).sort({ createdAt: -1 });

    let currentZone = null;
    let isInsideAny = false;

    const formattedZones = safeZones.map((zone) => {
      const zoneObj = zone.toObject();

      if (userLat && userLon) {
        const uLat = parseFloat(userLat);
        const uLon = parseFloat(userLon);
        const distanceM = calculateDistanceMeters(uLat, uLon, zone.latitude, zone.longitude);
        const inside = distanceM <= zone.radius;

        zoneObj.distanceMeters = Math.round(distanceM);
        zoneObj.isUserInside = inside;

        if (inside && !currentZone) {
          currentZone = zoneObj;
          isInsideAny = true;
        }
      }

      return zoneObj;
    });

    res.status(200).json({
      success: true,
      count: formattedZones.length,
      isInsideAny,
      currentZone,
      data: formattedZones,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new safe zone
// @route   POST /api/safe-zones
// @access  Private
const createSafeZone = async (req, res, next) => {
  try {
    const { name, type, address, latitude, longitude, radius } = req.body;

    const safeZone = await SafeZone.create({
      userId: req.user.id,
      name,
      type: type || 'Home',
      address,
      latitude,
      longitude,
      radius: radius || 200,
    });

    res.status(201).json({
      success: true,
      message: `Safe zone "${safeZone.name}" created successfully`,
      data: safeZone,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update safe zone
// @route   PUT /api/safe-zones/:id
// @access  Private
const updateSafeZone = async (req, res, next) => {
  try {
    let safeZone = await SafeZone.findById(req.params.id);

    if (!safeZone) {
      return res.status(404).json({
        success: false,
        message: 'Safe zone not found',
      });
    }

    if (safeZone.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this safe zone',
      });
    }

    safeZone = await SafeZone.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Safe zone updated successfully',
      data: safeZone,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete safe zone
// @route   DELETE /api/safe-zones/:id
// @access  Private
const deleteSafeZone = async (req, res, next) => {
  try {
    const safeZone = await SafeZone.findById(req.params.id);

    if (!safeZone) {
      return res.status(404).json({
        success: false,
        message: 'Safe zone not found',
      });
    }

    if (safeZone.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this safe zone',
      });
    }

    await safeZone.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Safe zone deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check if coordinate is inside user's safe zone
// @route   POST /api/safe-zones/check
// @access  Private
const checkSafeZoneStatus = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Coordinates required to check safe zone status',
      });
    }

    const safeZones = await SafeZone.find({ userId: req.user.id });

    let insideZone = null;

    for (const zone of safeZones) {
      if (isPointInsideSafeZone(latitude, longitude, zone.latitude, zone.longitude, zone.radius)) {
        insideZone = zone;
        break;
      }
    }

    res.status(200).json({
      success: true,
      insideSafeZone: !!insideZone,
      zone: insideZone,
      message: insideZone
        ? `You're inside your safe zone: ${insideZone.name}`
        : 'Outside of designated safe zones',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSafeZones,
  createSafeZone,
  updateSafeZone,
  deleteSafeZone,
  checkSafeZoneStatus,
};
