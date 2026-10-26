const SafeHaven = require('../models/SafeHaven');
const Incident = require('../models/Incident');
const { calculateDistanceKm, calculateDistanceMeters } = require('../utils/distance');

// @desc    Get all verified safe havens with optional category and proximity sorting
// @route   GET /api/safe-havens
// @access  Public
const getSafeHavens = async (req, res, next) => {
  try {
    const { category, search, userLat, userLon, limit = 50 } = req.query;

    const query = { verified: true };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
      ];
    }

    const havens = await SafeHaven.find(query).limit(parseInt(limit, 10));

    let results = havens.map((haven) => {
      const hObj = haven.toObject();
      if (userLat && userLon) {
        const uLat = parseFloat(userLat);
        const uLon = parseFloat(userLon);
        const distKm = calculateDistanceKm(uLat, uLon, haven.latitude, haven.longitude);
        hObj.distanceKm = parseFloat(distKm.toFixed(2));
        hObj.distanceMeters = Math.round(distKm * 1000);
      }
      return hObj;
    });

    if (userLat && userLon) {
      results.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
    }

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single safe haven
// @route   GET /api/safe-havens/:id
// @access  Public
const getSafeHavenById = async (req, res, next) => {
  try {
    const haven = await SafeHaven.findById(req.params.id);
    if (!haven) {
      return res.status(404).json({ success: false, message: 'Safe haven spot not found' });
    }
    res.status(200).json({ success: true, data: haven });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new safe haven suggestion
// @route   POST /api/safe-havens
// @access  Private
const createSafeHaven = async (req, res, next) => {
  try {
    const {
      name,
      category,
      address,
      city,
      latitude,
      longitude,
      contactPhone,
      is24x7,
      lightingRating,
      cctvGuarded,
      hasFemaleStaff,
      features,
    } = req.body;

    const haven = await SafeHaven.create({
      name,
      category,
      address,
      city: city || 'New Delhi',
      latitude,
      longitude,
      contactPhone: contactPhone || '112',
      is24x7: is24x7 !== undefined ? is24x7 : true,
      lightingRating: lightingRating || 5,
      cctvGuarded: cctvGuarded !== undefined ? cctvGuarded : true,
      hasFemaleStaff: !!hasFemaleStaff,
      features: features && features.length > 0 ? features : ['24/7 Monitored', 'Well Lit', 'Emergency Assistance'],
      verified: true, // auto-verified for demo convenience
      addedBy: req.user ? req.user.id : null,
    });

    res.status(201).json({
      success: true,
      data: haven,
      message: 'Safe haven location added successfully!',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Evaluate Route Safety Score & Heat Index
// @route   POST /api/safe-havens/route-score
// @access  Public
const evaluateRouteSafety = async (req, res, next) => {
  try {
    const { originLat, originLon, destLat, destLon, timeOfDay } = req.body;

    const oLat = parseFloat(originLat) || 28.6139;
    const oLon = parseFloat(originLon) || 77.2090;
    const dLat = parseFloat(destLat) || 28.6328;
    const dLon = parseFloat(destLon) || 77.2197;

    const midLat = (oLat + dLat) / 2;
    const midLon = (oLon + dLon) / 2;
    const totalDistKm = calculateDistanceKm(oLat, oLon, dLat, dLon);

    // Search for incidents near route corridor (within 5km of midpoint)
    const allIncidents = await Incident.find({ status: { $ne: 'REJECTED' } });
    const corridorIncidents = allIncidents.filter((inc) => {
      const dist = calculateDistanceKm(midLat, midLon, inc.latitude, inc.longitude);
      return dist <= Math.max(3, totalDistKm * 0.8);
    });

    // Search for safe havens near route corridor
    const allHavens = await SafeHaven.find({ verified: true });
    const corridorHavens = allHavens.filter((h) => {
      const dist = calculateDistanceKm(midLat, midLon, h.latitude, h.longitude);
      return dist <= Math.max(3, totalDistKm * 0.8);
    });

    // Calculate baseline safety score
    let score = 85;

    // Severity penalties
    corridorIncidents.forEach((inc) => {
      if (inc.severity === 'CRITICAL') score -= 12;
      else if (inc.severity === 'HIGH') score -= 7;
      else if (inc.severity === 'MEDIUM') score -= 4;
      else score -= 2;
    });

    // Haven bonuses
    score += Math.min(20, corridorHavens.length * 4);

    // Time of day factor
    const hour = timeOfDay !== undefined ? parseInt(timeOfDay, 10) : new Date().getHours();
    const isLateNight = hour >= 22 || hour < 5;
    if (isLateNight) {
      score -= 10;
    }

    // Clamp score 10 - 99
    score = Math.max(15, Math.min(98, score));

    let riskLevel = 'SAFE';
    let summary = 'Well-patrolled corridor with active 24/7 safe havens and good street visibility.';
    let recommendations = [
      'Stay on main arterial roads with active commercial storefronts',
      'Keep your SafeWo live tracking or Guardian check-in active',
      'Keep emergency helpline 112 on speed dial',
    ];

    if (score < 45) {
      riskLevel = 'HIGH RISK';
      summary = 'Caution: Multiple past safety alerts and limited night surveillance along this segment.';
      recommendations = [
        'Avoid walking alone after dark on this route',
        'Use verified app-based transit with vehicle number sharing',
        'Consider traveling along alternative commercial main avenues',
        'Activate SafeWo Safe Journey with 5-minute check-ins',
      ];
    } else if (score < 70) {
      riskLevel = 'MODERATE';
      summary = 'Moderate safety corridor. Maintain awareness and stay along lit avenues.';
      recommendations = [
        'Stay along brightly lit transit stations and retail hubs',
        'Share your live route with a trusted emergency contact',
      ];
    }

    res.status(200).json({
      success: true,
      data: {
        safetyScore: Math.round(score),
        riskLevel,
        summary,
        totalDistanceKm: parseFloat(totalDistKm.toFixed(2)),
        estimatedMinutesWalk: Math.round(totalDistKm * 12),
        estimatedMinutesDrive: Math.max(3, Math.round(totalDistKm * 2.5)),
        nearbyIncidentsCount: corridorIncidents.length,
        nearbySafeHavensCount: corridorHavens.length,
        nearbySafeHavens: corridorHavens.slice(0, 5),
        recommendations,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSafeHavens,
  getSafeHavenById,
  createSafeHaven,
  evaluateRouteSafety,
};
