const SafeJourney = require('../models/SafeJourney');
const { getIO } = require('../socket/socketHandler');

// @desc    Start a new safe journey
// @route   POST /api/journeys
// @access  Private
const startJourney = async (req, res, next) => {
  try {
    const {
      startLocationName,
      destinationName,
      transportMode,
      vehicleNumber,
      driverDetails,
      estimatedMinutes = 20,
      checkInIntervalMinutes = 10,
      latitude,
      longitude,
      batteryLevel = 100,
    } = req.body;

    // End any previously active journey
    await SafeJourney.updateMany(
      { userId: req.user.id, status: 'active' },
      { $set: { status: 'cancelled', completionNotes: 'Replaced by newer journey' } }
    );

    const now = new Date();
    const estMins = Math.max(2, parseInt(estimatedMinutes, 10));
    const intervalMins = Math.max(1, parseInt(checkInIntervalMinutes, 10));

    const expectedArrivalAt = new Date(now.getTime() + estMins * 60 * 1000);
    const nextCheckInDueAt = new Date(now.getTime() + Math.min(intervalMins, estMins) * 60 * 1000);

    const initialCheckIn = {
      timestamp: now,
      latitude: latitude || 28.6139,
      longitude: longitude || 77.209,
      batteryLevel,
      status: 'safe',
      note: 'Journey commenced',
    };

    const journey = await SafeJourney.create({
      userId: req.user.id,
      startLocationName: startLocationName || 'Current Location',
      destinationName,
      transportMode: transportMode || 'Cab / Taxi',
      vehicleNumber: vehicleNumber || '',
      driverDetails: driverDetails || '',
      estimatedMinutes: estMins,
      checkInIntervalMinutes: intervalMins,
      startedAt: now,
      expectedArrivalAt,
      nextCheckInDueAt,
      status: 'active',
      checkIns: [initialCheckIn],
      lastKnownLocation: {
        latitude: latitude || 28.6139,
        longitude: longitude || 77.209,
        accuracy: 10,
        updatedAt: now,
      },
      batteryLevel,
    });

    try {
      const io = getIO();
      if (io) {
        io.emit('journey:started', {
          journeyId: journey._id,
          userId: req.user.id,
          destination: journey.destinationName,
        });
      }
    } catch (e) {
      // socket ignore
    }

    res.status(201).json({
      success: true,
      message: 'Safe journey initiated. Guardian timer activated.',
      data: journey,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's current active journey
// @route   GET /api/journeys/active
// @access  Private
const getActiveJourney = async (req, res, next) => {
  try {
    const journey = await SafeJourney.findOne({
      userId: req.user.id,
      status: { $in: ['active', 'missed_checkin'] },
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: journey || null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Perform safe check-in
// @route   PUT /api/journeys/:id/check-in
// @access  Private
const checkInJourney = async (req, res, next) => {
  try {
    const { latitude, longitude, batteryLevel, note } = req.body;
    const journey = await SafeJourney.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!journey) {
      return res.status(404).json({ success: false, message: 'Journey not found' });
    }

    if (journey.status !== 'active' && journey.status !== 'missed_checkin') {
      return res.status(400).json({ success: false, message: 'This journey is no longer active' });
    }

    const now = new Date();
    const intervalMs = journey.checkInIntervalMinutes * 60 * 1000;
    const nextDue = new Date(now.getTime() + intervalMs);

    const checkInRecord = {
      timestamp: now,
      latitude: latitude || journey.lastKnownLocation.latitude,
      longitude: longitude || journey.lastKnownLocation.longitude,
      batteryLevel: batteryLevel !== undefined ? batteryLevel : journey.batteryLevel,
      status: 'safe',
      note: note || 'User confirmed safety',
    };

    journey.checkIns.push(checkInRecord);
    journey.nextCheckInDueAt = nextDue;
    journey.status = 'active'; // restore to active if it was missed_checkin
    if (batteryLevel !== undefined) journey.batteryLevel = batteryLevel;
    if (latitude && longitude) {
      journey.lastKnownLocation = {
        latitude,
        longitude,
        accuracy: 10,
        updatedAt: now,
      };
    }

    await journey.save();

    res.status(200).json({
      success: true,
      message: 'Safety check-in recorded. Timer refreshed.',
      data: journey,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Extend journey time
// @route   PUT /api/journeys/:id/extend
// @access  Private
const extendJourney = async (req, res, next) => {
  try {
    const { additionalMinutes = 10 } = req.body;
    const journey = await SafeJourney.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!journey) {
      return res.status(404).json({ success: false, message: 'Journey not found' });
    }

    const addMs = parseInt(additionalMinutes, 10) * 60 * 1000;
    journey.expectedArrivalAt = new Date(new Date(journey.expectedArrivalAt).getTime() + addMs);
    journey.nextCheckInDueAt = new Date(new Date(journey.nextCheckInDueAt).getTime() + addMs);
    journey.estimatedMinutes += parseInt(additionalMinutes, 10);

    journey.checkIns.push({
      timestamp: new Date(),
      status: 'delayed',
      note: `Extended journey by ${additionalMinutes} mins due to traffic/delay`,
    });

    await journey.save();

    res.status(200).json({
      success: true,
      message: `Journey extended by ${additionalMinutes} minutes.`,
      data: journey,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Complete journey (arrived safely)
// @route   PUT /api/journeys/:id/complete
// @access  Private
const completeJourney = async (req, res, next) => {
  try {
    const { notes } = req.body;
    const journey = await SafeJourney.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!journey) {
      return res.status(404).json({ success: false, message: 'Journey not found' });
    }

    journey.status = 'completed';
    journey.completionNotes = notes || 'Arrived safely at destination.';
    await journey.save();

    try {
      const io = getIO();
      if (io) {
        io.emit('journey:completed', {
          journeyId: journey._id,
          userId: req.user.id,
        });
      }
    } catch (e) {
      // ignore
    }

    res.status(200).json({
      success: true,
      message: 'You have arrived safely! Journey successfully concluded.',
      data: journey,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Trigger missed check-in escalation
// @route   PUT /api/journeys/:id/missed
// @access  Private
const triggerMissedCheckIn = async (req, res, next) => {
  try {
    const journey = await SafeJourney.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!journey) {
      return res.status(404).json({ success: false, message: 'Journey not found' });
    }

    journey.status = 'missed_checkin';
    journey.checkIns.push({
      timestamp: new Date(),
      status: 'alert',
      note: 'Missed safety check-in countdown. Contacting guardians.',
    });
    await journey.save();

    res.status(200).json({
      success: true,
      message: 'Missed check-in logged. Emergency escalation triggered.',
      data: journey,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get past journey history
// @route   GET /api/journeys/history
// @access  Private
const getJourneyHistory = async (req, res, next) => {
  try {
    const journeys = await SafeJourney.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      count: journeys.length,
      data: journeys,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  startJourney,
  getActiveJourney,
  checkInJourney,
  extendJourney,
  completeJourney,
  triggerMissedCheckIn,
  getJourneyHistory,
};
