const Incident = require('../models/Incident');
const { calculateDistanceKm } = require('../utils/distance');
const { emitIncidentCreated, emitIncidentUpdated } = require('../socket/socketHandler');

// @desc    Get incidents with filtering, search, pagination, and distance calculation
// @route   GET /api/incidents
// @access  Public (or Private)
const getIncidents = async (req, res, next) => {
  try {
    const {
      keyword,
      category,
      severity,
      status,
      dateRange,
      userLat,
      userLon,
      radiusKm,
      sortBy,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // By default, only show VERIFIED and PENDING incidents to users; hide REJECTED
    if (status) {
      if (status !== 'ALL') query.status = status;
    } else {
      query.status = { $in: ['VERIFIED', 'PENDING', 'RESOLVED'] };
    }

    // Keyword search
    if (keyword && keyword.trim()) {
      query.$or = [
        { title: { $regex: keyword.trim(), $options: 'i' } },
        { description: { $regex: keyword.trim(), $options: 'i' } },
        { address: { $regex: keyword.trim(), $options: 'i' } },
      ];
    }

    // Category filter
    if (category && category !== 'ALL') {
      query.category = category;
    }

    // Severity filter
    if (severity && severity !== 'ALL') {
      query.severity = severity;
    }

    // Date range filter
    if (dateRange && dateRange !== 'ALL') {
      const now = new Date();
      if (dateRange === '24H') {
        query.createdAt = { $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) };
      } else if (dateRange === '7D') {
        query.createdAt = { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
      } else if (dateRange === '30D') {
        query.createdAt = { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) };
      }
    }

    // Fetch matching documents
    let incidents = await Incident.find(query)
      .populate('userId', 'name profileImage')
      .sort({ createdAt: -1 });

    // Sanitize anonymous incidents
    incidents = incidents.map((inc) => {
      const obj = inc.toObject();
      if (obj.anonymous) {
        obj.userId = { _id: null, name: 'Anonymous Reporter' };
      }
      return obj;
    });

    // Calculate distance if coordinates provided
    if (userLat && userLon) {
      const uLat = parseFloat(userLat);
      const uLon = parseFloat(userLon);

      incidents = incidents.map((inc) => {
        const distanceKm = calculateDistanceKm(uLat, uLon, inc.latitude, inc.longitude);
        return {
          ...inc,
          distanceKm: parseFloat(distanceKm.toFixed(2)),
        };
      });

      // Filter by radius if provided
      if (radiusKm && !isNaN(radiusKm)) {
        incidents = incidents.filter((inc) => inc.distanceKm <= parseFloat(radiusKm));
      }

      // Sort by distance if requested
      if (sortBy === 'distance') {
        incidents.sort((a, b) => a.distanceKm - b.distanceKm);
      }
    }

    const total = incidents.length;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedIncidents = incidents.slice(startIndex, startIndex + limitNum);

    res.status(200).json({
      success: true,
      count: paginatedIncidents.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      data: paginatedIncidents,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single incident
// @route   GET /api/incidents/:id
// @access  Public
const getIncidentById = async (req, res, next) => {
  try {
    const incident = await Incident.findById(req.params.id).populate('userId', 'name profileImage');

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found',
      });
    }

    const obj = incident.toObject();
    if (obj.anonymous) {
      obj.userId = { _id: null, name: 'Anonymous Reporter' };
    }

    res.status(200).json({
      success: true,
      data: obj,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new safety incident
// @route   POST /api/incidents
// @access  Private
const createIncident = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      severity,
      latitude,
      longitude,
      address,
      image,
      anonymous,
    } = req.body;

    const incident = await Incident.create({
      userId: req.user.id,
      title,
      description,
      category,
      severity,
      latitude,
      longitude,
      address,
      image: image || '',
      anonymous: anonymous || false,
      status: 'PENDING',
    });

    // Populate user details for broadcast
    await incident.populate('userId', 'name profileImage');

    const broadcastPayload = incident.toObject();
    if (broadcastPayload.anonymous) {
      broadcastPayload.userId = { _id: null, name: 'Anonymous Reporter' };
    }

    emitIncidentCreated(broadcastPayload);

    res.status(201).json({
      success: true,
      message: 'Safety incident reported successfully. Thank you for helping keep the community safe.',
      data: broadcastPayload,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update incident
// @route   PUT /api/incidents/:id
// @access  Private
const updateIncident = async (req, res, next) => {
  try {
    let incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found',
      });
    }

    if (incident.userId.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this incident',
      });
    }

    incident = await Incident.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    emitIncidentUpdated(incident);

    res.status(200).json({
      success: true,
      message: 'Incident updated successfully',
      data: incident,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete incident
// @route   DELETE /api/incidents/:id
// @access  Private
const deleteIncident = async (req, res, next) => {
  try {
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found',
      });
    }

    if (incident.userId.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this incident',
      });
    }

    await incident.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Incident deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle helpful vote for incident
// @route   POST /api/incidents/:id/helpful
// @access  Private
const toggleHelpful = async (req, res, next) => {
  try {
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found',
      });
    }

    const userIdStr = req.user.id.toString();
    const isHelpful = incident.helpfulUsers.some((u) => u.toString() === userIdStr);

    if (isHelpful) {
      incident.helpfulUsers = incident.helpfulUsers.filter((u) => u.toString() !== userIdStr);
    } else {
      incident.helpfulUsers.push(req.user.id);
    }

    await incident.save();

    res.status(200).json({
      success: true,
      helpfulCount: incident.helpfulUsers.length,
      isHelpful: !isHelpful,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Report misinformation on incident
// @route   POST /api/incidents/:id/misinformation
// @access  Private
const reportMisinformation = async (req, res, next) => {
  try {
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found',
      });
    }

    const { reason } = req.body;

    incident.misinformationReports.push({
      userId: req.user.id,
      reason: reason || 'Inaccurate or false incident report',
    });

    // Automatically flag for review if multiple reports
    if (incident.misinformationReports.length >= 3 && incident.status === 'VERIFIED') {
      incident.status = 'PENDING';
    }

    await incident.save();

    res.status(200).json({
      success: true,
      message: 'Report submitted. Our moderation team will review this incident promptly.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getIncidents,
  getIncidentById,
  createIncident,
  updateIncident,
  deleteIncident,
  toggleHelpful,
  reportMisinformation,
};
