const express = require('express');
const router = express.Router();
const Member = require('../models/Member')
const Collection = require("../models/Collection");
const Loan = require("../models/Loan")
const Setting = require('../models/Settings')
const bcrypt = require("bcrypt")
const treasurer = require('../models/Treasurer')
const { generateToken } = require("../utils/generateToken");
const { upload } = require("../utils/cloudinary");
const { ensureTreasurer, ensurePresident, ensureSecretary, ensureMember } = require("../middlewares/auth");
const moment = require("moment");
const Meeting = require('../models/meeting')
const Otp = require('../models/otpModel');
const sendOtpMail = require('../utils/sendOTP');

router.get("/api/member/dashboard", ensureMember, async (req, res) => {
  try {
    const memberId = req.memberId;
    const upcomingMeetings = await Meeting.find().sort({ date: 1 });

    const member = await Member.findById(memberId);
    if (!member) return res.status(404).json({ message: "Member not found" });

    const settings = await Setting.findOne();
    if (!settings) {
      return res.status(400).json({ message: "Settings not configured." });
    }

    const dueDate = settings.dueDate || 10;
    const monthlyAmount = settings.monthlyContributionAmount || 100;
    const penaltyAmount = settings.penaltyAmount || 0;

    const today = moment();
    const currentYear = today.year();
    const currentMonth = today.month() + 1;

    const collections = await Collection.find({ memberId });

    let totalPaid = 0;
    let totalPending = 0;
    let unpaidCount = 0;
    let unpaidMonths = [];
    let paidMonths = new Set();

    collections.forEach(({ amount, year, month, status }) => {
      if (status === "Paid" || status === "Late") {
        totalPaid += amount || 0;
        paidMonths.add(`${year}-${month}`);
      }
    });

    // Assume payments should have started from when the member was approved
    const startDate = moment(member.joinDate || today).startOf("month");
    const startYear = startDate.year();
    const startMonth = startDate.month() + 1;

    for (let year = startYear; year <= currentYear; year++) {
      for (
        let month = year === startYear ? startMonth : 1;
        month <= (year === currentYear ? currentMonth : 12);
        month++
      ) {
        if (!paidMonths.has(`${year}-${month}`)) {
          // Construct due date for this month
          let checkDate = moment(`${year}-${month}-${dueDate}`, "YYYY-MM-DD");

          if (today.isAfter(checkDate, "day")) {
            // Calculate daily penalty
            let daysLate = today.diff(checkDate, "days");
            let monthlyPenalty = daysLate * penaltyAmount;

            totalPending += monthlyAmount + monthlyPenalty;
            unpaidCount++;

            unpaidMonths.push(
              `${moment().month(month - 1).format("MMMM")} ${year} (₹${monthlyPenalty} penalty)`
            );
          }
        }
      }
    }

    const loans = await Loan.find({ memberId }).sort({ requestedAt: -1 });

    let activeLoanAmount = 0;
    let totalLoanRepaid = 0;
    let totalLoanPending = 0;
    let repaymentDetails = [];

    loans.forEach((loan) => {
      if (["Approved", "Repaid", "Pending"].includes(loan.status)) {
        activeLoanAmount += loan.amount || 0;

        loan.repaymentSchedule.forEach((repayment) => {
          totalLoanRepaid += repayment.amountPaid || 0;
          totalLoanPending += repayment.amountDue - (repayment.amountPaid || 0);
        });

        // In your dashboard route, modify the repaymentDetails push:
        repaymentDetails.push({
          _id: loan._id,  // Make sure to include _id (not just loanId)
          loanId: loan._id, // Keep both for compatibility
          loanAmount: loan.amount,
          interestRate: loan.interestRate,
          status: loan.status,
          totalPaid: loan.totalPaid,
          remainingBalance: loan.remainingBalance,
          repaymentSchedule: loan.repaymentSchedule,
        });
      }
    });

    const profileImage = member.image || null;
    res.json({
      member,
      image: profileImage,
      collections,
      upcomingMeetings,
      totalPaid: totalPaid.toFixed(2),
      totalPending: totalPending.toFixed(2),
      unpaidCount,
      unpaidMonths,
      activeLoanAmount: activeLoanAmount.toFixed(2),
      totalLoanRepaid: totalLoanRepaid.toFixed(2),
      totalLoanPending: totalLoanPending.toFixed(2),
      loans: repaymentDetails,
    });
  } catch (error) {
    console.error("❌ Error loading member dashboard:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/api/register", upload.single("image"), async (req, res) => {
  try {
    const { name, email, password, address, contact } = req.body;
    if (!name || !email || !password || !address || !contact) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const otpRecord = await Otp.findOne({ email });
    if (otpRecord) {
      return res.status(400).json({ message: "Please verify your email with OTP before registering." });
    }

    const existingUser = await Member.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered. Please log in." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newMember = new Member({
      name,
      email,
      password: hashedPassword,
      address,
      contact,
      image: req.file ? req.file.path : "",
      status: "Pending"
    });

    await newMember.save();
    return res.status(201).json({ message: "Registration submitted. Awaiting President's approval." });

  } catch (error) {
    console.error("Error registering member:", error);
    return res.status(500).json({ message: "Internal Server Error. Please try again later." });
  }
});

router.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Member.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Email or Password!" });
    }

    if (user.status !== "Approved") {
      return res.status(403).json({
        message: user.status === "Pending"
          ? "Your registration is pending President's approval."
          : "Your registration was rejected by the President.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid Email or Password!" });
    }

    const token = generateToken(user);
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })

    let redirectUrl;
    switch (user.role) {
      case "president":
        redirectUrl = "/president/dashboard";
        break;
      case "secretary":
        redirectUrl = "/secretary/dashboard";
        break;
      case "treasurer":
        redirectUrl = "/treasurer/dashboard";
        break;
      default:
        redirectUrl = "/member/dashboard";
        break;
    }

    return res.status(200).json({
      message: "Login Successful!",
      role: user.role,
      redirectUrl: redirectUrl,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal Server Error. Please try again." });
  }
});


router.get('/member/api/logout', ensureMember,(req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logout successful' });
});






router.post("/member/update-profile", ensureMember, upload.single("profilePhoto"), async (req, res) => {
  try {
    const memberId = req.memberId;
    const { name, email, password, address, contact } = req.body;
    const updateData = { name, email, address, contact };

    // Hash new password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    // Store profile image if uploaded
    if (req.file) {
      updateData.image = req.file.buffer;
    }

    // Update the member's details in the database
    await Member.findByIdAndUpdate(memberId, updateData);

    req.flash("success_msg", "Profile updated successfully!");
    res.redirect("/member/dashboard");
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "An error occurred while updating the profile.");
    res.redirect("/member/dashboard");
  }
});


module.exports = router;
