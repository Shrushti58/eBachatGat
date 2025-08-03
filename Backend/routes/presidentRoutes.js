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

router.get("/dashboard", ensurePresident, async (req, res) => {
  try {
    const setting = await Setting.findOne();
    const totalSavings = setting ? setting.groupSavings : 0;
    const totalMembers = await Member.countDocuments();

    const totalApprovedLoansResult = await Loan.aggregate([
      { $match: { status: "Approved", remainingBalance: { $gt: 0 } } },
      { $group: { _id: null, total: { $sum: "$remainingBalance" } } }
    ]);
    const totalApprovedLoans = totalApprovedLoansResult.length > 0
      ? totalApprovedLoansResult[0].total
      : 0;

    const availableSavings = totalSavings;

    const activeLoans = await Loan.countDocuments({ status: "Approved", remainingBalance: { $gt: 0 } });

    const loanStats = await Loan.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    const loanData = { Approved: 0, Rejected: 0, Pending: 0, Repaid: 0 };
    loanStats.forEach(stat => {
      loanData[stat._id] = stat.count;
    });

    const memberSavings = await Member.aggregate([
      {
        $lookup: {
          from: "collections",
          localField: "_id",
          foreignField: "memberId",
          as: "savings"
        }
      },
      {
        $project: {
          name: 1,
          totalSavings: { $sum: "$savings.amount" }
        }
      }
    ]);
    const memberNames = memberSavings.map(m => m.name);
    const savingsAmounts = memberSavings.map(m => m.totalSavings || 0);

    const pendingLoans = await Loan.find({ status: "Pending" }).populate("memberId", "name");

    // ✅ New: Get all pending member registrations
    const pendingMembers = await Member.find({ role: "member", status: "Pending" });

    return res.status(200).json({
      success: true,
      totalMembers,
      totalSavings: availableSavings,
      activeLoans,
      pendingLoans,
      loanData,
      pendingMembers, // ✅ Include in response
      memberSavings: {
        names: memberNames,
        amounts: savingsAmounts
      }
    });

  } catch (error) {
    console.error("❌ Error loading president dashboard:", error);
    return res.status(500).json({
      success: false,
      message: "Error loading dashboard",
    });
  }
});

router.post("/approve-member/:memberId", ensurePresident, async (req, res) => {
  try {
    const { memberId } = req.params;

    const member = await Member.findById(memberId);
    if (!member || member.role !== "member" || member.status !== "Pending") {
      return res.status(404).json({ success: false, message: "Pending member not found" });
    }

    member.status = "Approved";
    await member.save();

    return res.status(200).json({ success: true, message: "Member approved successfully" });
  } catch (error) {
    console.error("Error approving member:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/reject-member/:memberId", ensurePresident, async (req, res) => {
  try {
    const { memberId } = req.params;

    const member = await Member.findById(memberId);
    if (!member || member.role !== "member" || member.status !== "Pending") {
      return res.status(404).json({ success: false, message: "Pending member not found" });
    }

    // ❌ Permanently delete the member record
    await Member.findByIdAndDelete(memberId);

    return res.status(200).json({ success: true, message: "Member rejected and deleted successfully" });
  } catch (error) {
    console.error("❌ Error rejecting member:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get("/getprofile", ensurePresident, async (req, res) => {
  try {
    const presidentId = req.memberId;

    const president = await Member.findById(presidentId);
    if (!president) {
      return res.status(404).json({ error: "President not found" });
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

    const personalCollections = await Collection.find({ memberId: presidentId });

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

    // ✅ Use president.createdAt as dynamic start date
    const startDate = moment(president.createdAt);
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
      president: {
        ...president._doc,
        image: president.image || null,
      },
      collections: formattedCollections,
      totalCollected: totalPaid.toFixed(2),
      totalPending: totalPending.toFixed(2),
      unpaidCount,
      unpaidMonths,
    });
  } catch (error) {
    console.error("❌ Error loading President Profile:", error);
    res.status(500).json({ error: "Server Error" });
  }
});


router.post("/update-profile", ensurePresident, upload.single("profilePhoto"), async (req, res) => {
  try {
    const memberId = req.memberId;
    const { name, email, password, address, contact } = req.body;

    const updateData = { name, email, address, contact };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    if (req.file) {
      updateData.image = req.file.path; // ✅ Save Cloudinary URL
    }

    await Member.findByIdAndUpdate(memberId, updateData);

    return res.status(200).json({
      success: true,
      message: "President profile updated successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the profile.",
    });
  }
}
);

router.post("/approve-loan/:loanId", ensurePresident, async (req, res) => {
  try {
    console.log("🔹 Approving loan request for ID:", req.params.loanId);
    const loan = await Loan.findById(req.params.loanId);
    if (!loan) {
      return res.status(404).json({ message: "Loan not found." });
    }

    if (loan.status !== "Pending") {
      return res.status(400).json({ message: "Loan has already been processed." });
    }

    const setting = await Setting.findOne();
    if (!setting) {
      return res.status(400).json({ message: "Settings not configured." });
    }

    let totalGroupSavings = setting.groupSavings || 0;

    if (totalGroupSavings < loan.amount) {
      return res.status(400).json({
        message: `Insufficient group savings. Available: ₹${totalGroupSavings}, Required: ₹${loan.amount}`
      });
    }

    // Deduct loan amount and update
    setting.groupSavings = totalGroupSavings - loan.amount;
    await setting.save();

    loan.status = "Approved";
    loan.approvedAt = new Date();
    await loan.save();

    console.log("🎉 Loan approved successfully.");
    return res.status(200).json({ message: "Loan approved and deducted from group savings." });

  } catch (err) {
    console.error("❌ Error approving loan:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
});

router.post("/reject-loan/:loanId", ensurePresident, async (req, res) => {
  try {
    const loanId = req.params.loanId;
    const loan = await Loan.findById(loanId);

    if (!loan) {
      return res.status(404).json({ message: "Loan not found." });
    }

    if (loan.status !== "Pending") {
      return res.status(400).json({ message: "Loan has already been processed." });
    }

    loan.status = "Rejected";
    loan.rejectedAt = new Date();
    await loan.save();

    return res.status(200).json({ message: "Loan rejected successfully." });

  } catch (error) {
    console.error("❌ Error rejecting loan:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

router.get("/loan-details/:id", ensurePresident, async (req, res) => {
  try {
    console.log("🔍 Fetching Loan Details...");

    const loan = await Loan.findById(req.params.id).populate("memberId", "name email contact");

    if (!loan) {
      return res.status(404).json({ message: "Loan not found!" });
    }

    res.status(200).json({ loan });

  } catch (error) {
    console.error("❌ Error fetching loan details:", error);
    res.status(500).json({ message: "Server error while fetching loan details." });
  }
});

router.get('/api/logout', (req, res) => {
  try {
    // Clear the token cookie with same options used in login
    res.clearCookie("token", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
});

    // Successful logout response
    return res.status(200).json({ 
      success: true, 
      message: 'Logout successful.',
      redirectUrl: '/member/login'
    });

  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred during logout' 
    });
  }
});

module.exports = router;