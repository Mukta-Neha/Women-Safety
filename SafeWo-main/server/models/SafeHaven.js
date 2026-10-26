const mongoose = require('mongoose');

const safeHavenSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide safe haven name'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please select safe haven category'],
      enum: ['Police', 'Hospital', 'Pharmacy', 'Transit', 'Shelter', 'Store', 'Other'],
      default: 'Police',
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    city: {
      type: String,
      default: 'New Delhi',
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
    contactPhone: {
      type: String,
      trim: true,
      default: '112',
    },
    is24x7: {
      type: Boolean,
      default: true,
    },
    verified: {
      type: Boolean,
      default: true,
    },
    lightingRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    cctvGuarded: {
      type: Boolean,
      default: true,
    },
    hasFemaleStaff: {
      type: Boolean,
      default: false,
    },
    features: {
      type: [String],
      default: ['24/7 Active Security', 'Well-Lit Exterior', 'CCTV Monitored'],
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

safeHavenSchema.index({ latitude: 1, longitude: 1 });
safeHavenSchema.index({ category: 1, verified: 1 });

module.exports = mongoose.model('SafeHaven', safeHavenSchema);
