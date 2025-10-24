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
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
