const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['SOS', 'PANIC', 'MEDICAL', 'UNSAFE_COMMUTE'],
      default: 'SOS',
    },
    latitude: {
      type: Number,
      required: [true, 'Latitude is required for SOS alert'],
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required for SOS alert'],
    },
    accuracy: {
      type: Number,
      default: 10,
    },
    message: {
      type: String,
      default: 'Emergency! I need immediate assistance at my current location.',
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'ACKNOWLEDGED', 'RESOLVED', 'CANCELLED'],
      default: 'ACTIVE',
      index: true,
    },
    emergencyContactsNotified: [
      {
        contactId: String,
        name: String,
        phone: String,
        status: { type: String, default: 'NOTIFIED' },
      },
    ],
    recipients: {
      type: [String],
      default: [],
    },
    resolvedAt: {
      type: Date,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    resolutionNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

alertSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Alert', alertSchema);
