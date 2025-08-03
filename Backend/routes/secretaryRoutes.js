const express = require('express');
const router = express.Router();
const Member = require('../models/Member')
const Collection = require("../models/Collection");
const Loan = require("../models/Loan")
const Setting = require('../models/Settings')
const bcrypt = require("bcrypt")
const treasurer = require('../models/Treasurer')
const { generateToken } = require("../utils/generateToken");
const { ensureTreasurer, ensurePresident, ensureSecretary, ensureMember } = require("../middlewares/auth");
const moment = require("moment");
const Meeting = require('../models/meeting')
const { upload } = require("../utils/cloudinary");
const sendEmail = require("../utils/sendEmail"); 


router.get('/api/meetings', ensureSecretary, async (req, res) => {
  try {
    const meetings = await Meeting.find();
    res.status(200).json({ success: true, meetings });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch meetings" });
  }
});

router.post("/api/schedule", ensureSecretary, async (req, res) => {
  try {
    const { title, date, time, agenda } = req.body;

    const existing = await Meeting.findOne({ date, time });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "A meeting is already scheduled at this date and time.",
      });
    }

    // Step 1: Save the new meeting
    const newMeeting = new Meeting({
      title,
      date,
      time,
      agenda,
      createdBy: req.memberId,
    });

    await newMeeting.save();

    // Step 2: Fetch all approved members
    const members = await Member.find({ status: "Approved" }, "email name");
    const emailList = members.map((m) => m.email);

    // Step 3: Compose email content
    const subject = `📅 New Meeting Scheduled: ${title}`;
    const text = `Namaste 🙏,

A new meeting has been scheduled in your e-Bachat Gat group. Mark your calendar!

📌 Title: ${title}
📅 Date: ${date}
⏰ Time: ${time}
📝 Agenda: ${agenda}

✨ Your participation is valuable. Be sure to attend!

Login to your dashboard for more info.

Together, we grow 🌱  
Warm regards,  
e-Bachat Gat Secretary`;

    const html = `
      <div style="font-family: sans-serif; line-height: 1.5;">
        <p>Hello,</p>
        <p><strong>Good news!</strong> A new meeting has been <span style="color:green;"><strong>scheduled</strong></span> in your <strong>e-Bachat Gat</strong> group.</p>
        <ul>
          <li><strong>📌 Title:</strong> ${title}</li>
          <li><strong>📅 Date:</strong> ${date}</li>
          <li><strong>⏰ Time:</strong> ${time}</li>
          <li><strong>📝 Agenda:</strong> ${agenda}</li>
        </ul>
        <p>✨ Your presence matters. Don’t miss it!</p>
        <p>📲 <a href="http://localhost:5173/member/login" style="color:#007bff;">Login to your dashboard</a> for full details.</p>
        <p>Together, we grow 🌱<br/>Warm regards,<br/><strong>e-Bachat Gat Secretary</strong></p>
      </div>
    `;

    // Step 4: Send email to each member
    for (const email of emailList) {
      await sendEmail(email, subject, text, html);
    }

    res.json({ success: true, message: "Meeting scheduled and notifications sent.", meeting: newMeeting });
  } catch (error) {
    console.error("Meeting scheduling failed:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.put("/schedule/:id",ensureSecretary, async (req, res) => {
  try {
    const { title, date, time, agenda } = req.body;

    // Step 1: Find and update meeting
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ error: "Meeting not found" });
    }

    meeting.title = title;
    meeting.date = date;
    meeting.time = time;
    meeting.agenda = agenda;

    await meeting.save();

    // Step 2: Fetch all approved members
    const members = await Member.find({ status: "Approved" }, "email name");
    const emailList = members.map((m) => m.email);

    // Step 3: Compose email
    const emailSubject = `📅 Updated Meeting: ${title}`;

    const emailText = `Helloo 🙏,

Exciting update! A meeting in your e-Bachat Gat group has just been updated. Here are the new details:

📌 Title: ${title}
📅 Date: ${date}
⏰ Time: ${time}
📝 Agenda: ${agenda}

✨ Your presence and participation make our Bachat Gat stronger. Don’t miss it!

Login to your dashboard for more info:
👉 http://localhost:5173/member/login

Together, we grow 🌱
Warm regards,
e-Bachat Gat Secretary`;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>📢 Meeting Update Notification</h2>
        <p>Namaste 🙏,</p>
        <p><strong>Exciting update!</strong> A meeting in your <strong>e-Bachat Gat</strong> group has been <span style="color:green;"><strong>updated</strong></span>.</p>
        <ul>
          <li><strong>📌 Title:</strong> ${title}</li>
          <li><strong>📅 Date:</strong> ${date}</li>
          <li><strong>⏰ Time:</strong> ${time}</li>
          <li><strong>📝 Agenda:</strong> ${agenda}</li>
        </ul>
        <p>✨ Your presence and participation make our group stronger. Don’t miss it!</p>
        <p>
          👉 <a href="http://localhost:5173/member/login" style="color:#007bff;">Click here to login to your dashboard</a>
        </p>
        <p>Together, we grow 🌱</p>
        <p>Warm regards,<br><strong>e-Bachat Gat Secretary</strong></p>
      </div>
    `;

    // Step 4: Send email to all approved members
    for (const email of emailList) {
      await sendEmail(email, emailSubject, emailText, emailHtml);
    }

    res.json({
      success: true,
      message: "Meeting updated and notifications sent.",
      meeting,
    });

  } catch (error) {
    console.error("Meeting update failed:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/delete/:id", ensureSecretary, async (req, res) => {
  try {
    const meeting = await Meeting.findOne({ _id: req.params.id, createdBy: req.memberId });

    if (!meeting) {
      return res.status(403).json({ success: false, message: "Unauthorized!" });
    }

    await Meeting.deleteOne({ _id: req.params.id });
    res.json({ success: true });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.get('/api/logout', ensureSecretary, (req, res) => {
 res.clearCookie("token", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
});
  return res.status(200).json({ success: true, message: 'Secretary logout successful.' });
});

router.get("/getprofile", ensureSecretary, async (req, res) => {
  try {
    const secretaryId = req.memberId;

    const secretary = await Member.findById(secretaryId);
    if (!secretary) {
      return res.status(404).json({ error: "Secretary not found" });
    }

    const settings = await Setting.findOne();
    if (!settings) {
      return res.status(400).json({ error: "Settings not configured" });
    }

    const dueDate = settings.dueDate || 10;
    const monthlyAmount = settings.monthlyContributionAmount || 100;
    const penaltyAmount = settings.penaltyAmount || 0;

    const today = moment();
    const currentYear = today.year();
    const currentMonth = today.month() + 1;

    const personalCollections = await Collection.find({ memberId: secretaryId });

    let totalPaid = 0;
    let totalPending = 0;
    let unpaidCount = 0;
    let unpaidMonths = [];
    let paidMonths = new Set();

    personalCollections.forEach(({ amount, year, month, status }) => {
      if (status === "Paid" || status === "Late") {
        totalPaid += amount || 0;
        paidMonths.add(`${year}-${month}`);
      }
    });

    // ✅ Use secretary.createdAt as dynamic start date
    const startDate = moment(secretary.createdAt);
    const startYear = startDate.year();
    const startMonth = startDate.month() + 1;

    for (let year = startYear; year <= currentYear; year++) {
      for (
        let month = year === startYear ? startMonth : 1;
        month <= (year === currentYear ? currentMonth : 12);
        month++
      ) {
        const monthKey = `${year}-${month}`;
        if (!paidMonths.has(monthKey)) {
          const checkDate = moment(`${year}-${month}-${dueDate}`, "YYYY-MM-DD");
          if (today.isAfter(checkDate)) {
            const lateDays = today.diff(checkDate, "days");
            const totalPenalty = penaltyAmount * lateDays;

            totalPending += monthlyAmount + totalPenalty;
            unpaidCount++;
            unpaidMonths.push(`${moment().month(month - 1).format("MMMM")} ${year}`);
          }
        }
      }
    }

    const formattedCollections = personalCollections.map((col) => ({
      ...col._doc,
      monthName: moment().month(col.month - 1).format("MMMM"),
    }));

    const upcomingMeetings = await Meeting.find().sort({ date: 1 });

    res.json({
      upcomingMeetings,
      secretary: {
        ...secretary._doc,
        image: secretary.image || null,
      },
      collections: formattedCollections,
      totalCollected: totalPaid.toFixed(2),
      totalPending: totalPending.toFixed(2),
      unpaidCount,
      unpaidMonths,
    });
  } catch (error) {
    console.error("❌ Error loading Secretary Profile:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

router.post("/update-profile", ensureSecretary, upload.single("profilePhoto"), async (req, res) => {
  try {
    const memberId = req.memberId;
    const { name, email, password, address, contact } = req.body;

    const updateData = { name, email, address, contact };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    if (req.file) {
      updateData.image = req.file.path;
    }

    await Member.findByIdAndUpdate(memberId, updateData);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the profile.",
    });
  }
}
);

module.exports = router;

































































