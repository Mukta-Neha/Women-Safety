const mongoose = require('mongoose');

const emergencyContactSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide contact name'],
      trim: true,
    },
    relationship: {
      type: String,
      required: [true, 'Please provide relationship (e.g. Mother, Father, Friend)'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide contact phone number'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    priority: {
      type: Number,
      default: 1,
      min: 1,
      max: 5,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('EmergencyContact', emergencyContactSchema);
