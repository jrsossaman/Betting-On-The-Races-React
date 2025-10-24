const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema(
  {
    teamId: {
      type: Number,
      required: true,
      default: 2,
    },
    number: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    driveBonus: {
      type: Number,
      default: 2,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Driver', driverSchema);
