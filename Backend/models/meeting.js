const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    agenda: { type: String, required: true },
    minutes: { type: String, default: "" }, // Initially empty, added later
    createdBy: { type: mongoose.Schema.Types.ObjectId,ref: "Member" }, // Secretary
});

module.exports = mongoose.model("Meeting", meetingSchema);
