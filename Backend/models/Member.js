const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  address: { type: String, required: true },
  joinDate: { type: Date, default: Date.now },
  email: { type: String, required: true },
  password: { type: String, required: true },
  image: {
    type: String,  
    default: ""
  },
  role: {
    type: String,
    enum: ["Member", "President", "Treasurer", "Secretary"],
    default: "Member"
  },
  totalSavings: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending"
  }
});

module.exports = mongoose.model("Member", MemberSchema);
