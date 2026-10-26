const mongoose = require('mongoose');

const checkInEntrySchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  latitude: Number,
  longitude: Number,
  batteryLevel: Number,
  status: {
    type: String,
    enum: ['safe', 'delayed', 'alert'],
    default: 'safe',
  },
  note: String,
});

const safeJourneySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    startLocationName: {
      type: String,
      default: 'Current Location',
      trim: true,
    },
    destinationName: {
      type: String,
      required: [true, 'Please provide destination name or address'],
      trim: true,
    },
    transportMode: {
      type: String,
      enum: ['Walking', 'Cab / Taxi', 'Auto-Rickshaw', 'Public Bus', 'Metro / Train', 'Bicycle', 'Personal Vehicle'],
      default: 'Cab / Taxi',
    },
    vehicleNumber: {
      type: String,
      trim: true,
      default: '',
    },
    driverDetails: {
      type: String,
      trim: true,
      default: '',
    },
    estimatedMinutes: {
      type: Number,
      required: true,
      min: [2, 'Minimum journey time is 2 minutes'],
      max: [480, 'Maximum journey time is 8 hours'],
      default: 20,
    },
    checkInIntervalMinutes: {
      type: Number,
      required: true,
      default: 10,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    expectedArrivalAt: {
      type: Date,
      required: true,
    },
    nextCheckInDueAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'missed_checkin', 'emergency', 'cancelled'],
      default: 'active',
      index: true,
    },
    checkIns: [checkInEntrySchema],
    lastKnownLocation: {
      latitude: Number,
      longitude: Number,
      accuracy: Number,
      updatedAt: Date,
    },
    batteryLevel: {
      type: Number,
      default: 100,
    },
    completionNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

safeJourneySchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('SafeJourney', safeJourneySchema);
