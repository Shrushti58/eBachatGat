const mongoose = require("mongoose");

const SettingSchema = new mongoose.Schema({
  monthlyContributionAmount: {
    type: Number,
    required: true,
    default: 100
  },
  dueDate: {
    type: Number,
    required: true,
    default: 10
  },
  penaltyAmount: {
    type: Number,
    default: 0
  },
  loanInterestRate: {
    type: Number,
    default: 5 // Default 5% interest
  },
  groupSavings: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("Setting", SettingSchema);
