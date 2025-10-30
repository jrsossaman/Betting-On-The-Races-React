const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    teamId: {
      type: Number,
      required: true,
      default: 2,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    wallet: {
      type: Number,
      default: 1000,
    },
    isAdmin: {
      type: Boolean,
      default: false,
      required: true,
    },
    accountStatus: {
      type: String,
      enum: ['active', 'suspended', 'deleted'],
      default: 'active',
      required: true,
    },
    raceCount: {
      type: Number,
      default: 0,
    },
    totalWinnings: {
      type: Number,
      default: 0,
    },
    raceHistory: [
      {
        driver1: String,
        driver2: String,
        winner: String,
        betAmount: Number,
        userWon: Boolean,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
