const mongoose = require('mongoose');

const safeZoneSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide safe zone name (e.g. My College, Home)'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Please select safe zone type'],
      enum: ['Home', 'College', 'Office', 'Hostel', 'Family House', 'Other'],
      default: 'Home',
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    latitude: {
      type: Number,
      required: [true, 'Latitude is required'],
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required'],
    },
    radius: {
      type: Number,
      default: 200, // radius in meters
      min: [50, 'Minimum safe zone radius is 50 meters'],
      max: [5000, 'Maximum safe zone radius is 5000 meters'],
    },
  },
  {
    timestamps: true,
  }
);

safeZoneSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('SafeZone', safeZoneSchema);
