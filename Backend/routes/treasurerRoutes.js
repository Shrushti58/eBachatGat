const express = require('express');
const router = express.Router();
const Member = require('../models/Member')
const Setting = require('../models/Settings')
const Loan = require('../models/Loan')
const bcrypt = require("bcrypt")
const treasurer = require('../models/Treasurer')
const { generateToken } = require("../utils/generateToken");
const { ensureTreasurer, ensurePresident, ensureSecretary, ensureMember } = require("../middlewares/auth");
const Collection = require('../models/Collection')
const moment = require("moment");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const updateGroupSavings = require("../models/Collection").updateGroupSavings;
const Meeting = require('../models/meeting')
const { upload } = require("../utils/cloudinary"); 


router.get("/dashboard", ensureTreasurer, async (req, res) => {
  try {
    const members = await Member.find();
    const setting = await Setting.findOne();

    const startOfMonth = moment().startOf("month").toDate();
    const endOfMonth = moment().endOf("month").toDate();

    const collections = await Collection.find({
      datePaid: { $gte: startOfMonth, $lte: endOfMonth },
    }).populate("memberId").sort({ datePaid: -1 });

    const totalApprovedLoansResult = await Loan.aggregate([
      { $match: { status: "Approved" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalApprovedLoans = totalApprovedLoansResult[0]?.total || 0;

    const activeLoans = await Loan.find({ status: { $in: ["Active", "Approved"] } })
      .populate("memberId").sort({ requestedAt: -1 });

    const allLoans = await Loan.find()
      .populate("memberId").sort({ requestedAt: -1 });

    const totalOutstandingLoans = activeLoans.reduce((sum, loan) => sum + loan.remainingBalance, 0);

    let loanRepaymentsThisMonth = 0;
    let loanPenalty = 0;
    const today = new Date();

    activeLoans.forEach(loan => {
      loan.repaymentSchedule.forEach(installment => {
        if (installment.datePaid) {
          const date = new Date(installment.datePaid);
          if (date >= startOfMonth && date <= endOfMonth) {
            loanRepaymentsThisMonth += installment.amountPaid;
          }
        } else if (installment.dueDate) {
          const due = new Date(installment.dueDate);
          if (due < today && setting?.penaltyAmount) {
            const lateDays = Math.floor((today - due) / (1000 * 60 * 60 * 24));
            loanPenalty += lateDays * setting.penaltyAmount;
          }
        }
      });
    });

    let calculatedPenalty = 0;
    if (setting?.dueDate && setting?.penaltyAmount && today.getDate() > setting.dueDate) {
      calculatedPenalty = (today.getDate() - setting.dueDate) * setting.penaltyAmount;
    }

    const totalGroupSavings = setting?.groupSavings || 0;

    const memberStatuses = new Map();
    members.forEach(member => {
      const paid = collections.some(col => col.memberId.equals(member._id));
      const isLate = today.getDate() > setting.dueDate;

      if (!paid) {
        memberStatuses.set(member._id.toString(), 1);
      } else if (isLate) {
        memberStatuses.set(member._id.toString(), 3);
      } else {
        memberStatuses.set(member._id.toString(), 2);
      }
    });

    members.sort((a, b) =>
      (memberStatuses.get(a._id.toString()) || 2) - (memberStatuses.get(b._id.toString()) || 2)
    );

    res.json({
      members,
      collections,
      setting,
      totalFunds: collections.reduce((sum, col) => sum + col.amount, 0),
      totalGroupSavings,
      calculatedPenalty,
      loanPenalty,
      activeLoans,
      allLoans,
      totalOutstandingLoans,
      loanRepaymentsThisMonth,
    });

  } catch (err) {
    console.error("❌ Treasurer Dashboard API Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/collect", ensureTreasurer, async (req, res) => {
  const { memberId } = req.body;

  try {
    const setting = await Setting.findOne();
    if (!setting) return res.status(400).json({ error: "Settings not configured!" });

    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    if (today.getDate() < setting.dueDate) {
      return res
        .status(400)
        .json({ error: `Collection is only allowed from the ${setting.dueDate}th.` });
    }

    const existingPayment = await Collection.findOne({
      memberId,
      month: currentMonth,
      year: currentYear,
    });

    if (existingPayment) {
      return res.status(400).json({ error: "Member has already paid for this month." });
    }

    const contributionAmount = setting.monthlyContributionAmount;
    const penaltyPerDay = setting.penaltyAmount;

    let totalPenalty = 0;
    let paymentStatus = "Paid";

    if (today.getDate() > setting.dueDate) {
      totalPenalty = (today.getDate() - setting.dueDate) * penaltyPerDay;
      paymentStatus = "Late";
    }

    const newPayment = new Collection({
      memberId,
      amount: contributionAmount,
      month: currentMonth,
      year: currentYear,
      datePaid: today,
      status: paymentStatus,
      penalty: totalPenalty,
      mode: "Offline",
      orderId: null, // no order ID for offline
    });

    await newPayment.save();

    await Member.findByIdAndUpdate(memberId, {
      $inc: { totalSavings: contributionAmount },
    });

    await updateGroupSavings();

    const populatedCollection = await Collection.findById(newPayment._id).populate("memberId");

    const collectionsThisMonth = await Collection.find({ month: currentMonth, year: currentYear });
    const totalFunds = collectionsThisMonth.reduce((acc, col) => acc + col.amount + (col.penalty || 0), 0);

    const totalGroupSavings = setting.groupSavings;

    return res.status(200).json({
      message: `Offline payment recorded. ${totalPenalty > 0 ? `Penalty ₹${totalPenalty} applied.` : "No penalty."}`,
      collection: populatedCollection,
      totalFunds,
      totalGroupSavings,
    });
  } catch (err) {
    console.error("❌ Error collecting contribution:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

router.delete("/delete/:id", ensureTreasurer, async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      return res.status(404).json({ error: "Collection not found" });
    }

    await Member.findByIdAndUpdate(collection.memberId, {
      $inc: { totalSavings: -collection.amount },
    });

    await collection.deleteOne();

    await updateGroupSavings();

    // Calculate updated totals
    const totalGroupSavings = await Setting.findOne().then((s) => s.groupSavings || 0);

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const currentMonthContributions = await Collection.aggregate([
      {
        $match: {
          month: currentMonth,
          year: currentYear,
          status: { $in: ["Paid", "Late"] },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const totalFunds = currentMonthContributions[0]?.total || 0;

    return res.json({
      message: "Collection removed successfully!",
      totalGroupSavings,
      totalFunds,
    });
  } catch (error) {
    console.error("❌ Error while deleting record:", error);
    return res.status(500).json({ error: "Error while deleting record" });
  }
});

router.get("/records", ensureTreasurer, async (req, res) => {
  try {
    const { month, year } = req.query;
    let filter = {};

    if (month) filter.month = parseInt(month);
    if (year) filter.year = parseInt(year);

    const collections = await Collection.find(filter).populate("memberId");
    const members = await Member.find();

    res.status(200).json({
      collections,
      members,
      selectedMonth: month,
      selectedYear: year,
    });
  } catch (err) {
    console.error("❌ Error fetching records:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

router.get("/records/pdf", ensureTreasurer, async (req, res) => {
  try {
    let { month, year } = req.query;
    const currentYear = new Date().getFullYear();
    if (!year || year === "All") year = currentYear.toString();

    let filter = {};
    let conditions = [];

    if (year !== "All") conditions.push({ $eq: [{ $year: "$datePaid" }, parseInt(year)] });
    if (month) conditions.push({ $eq: [{ $month: "$datePaid" }, parseInt(month)] });

    if (conditions.length > 0) filter.$expr = { $and: conditions };

    const collections = await Collection.find(filter).populate("memberId");

    let totalSavings = 0;
    let totalCollections = 0;
    collections.forEach(c => {
      totalCollections += c.amount || 0;
      totalSavings += (c.amount || 0) + (c.penalty || 0);
    });

    const doc = new PDFDocument({ margin: 40, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=EbaChat_Contributions_${moment().format("YYYYMMDD")}.pdf`);
    doc.pipe(res);

    // Dark green theme colors (matching your React component)
    const darkGreen = "#2c5e1a";       // Your header color
    const mediumGreen = "#4c8c2a";     // Your gradient color
    const accentYellow = "#f9a825";    // Your accent color
    const lightBg = "#f8f5ee";         // Your background color
    const white = "#ffffff";
    const darkText = "#2c3e50";

    // Set background color
    doc.rect(0, 0, doc.page.width, doc.page.height).fill(lightBg);

    // Title Section with solid color instead of gradient
    doc.fillColor(darkGreen)
      .rect(50, 50, doc.page.width - 100, 80)
      .fill();

    doc.fillColor(white).font("Helvetica-Bold").fontSize(24)
      .text("E-BachatGat Contributions Report", 50, 70, {
        width: doc.page.width - 100,
        align: "center"
      });

    doc.fontSize(12).font("Helvetica").fillColor(white)
      .text(`Filtered By: ${month ? `Month: ${moment(month, "M").format("MMMM")}` : "All"} | Year: ${year}`,
        50, 110, {
        width: doc.page.width - 100,
        align: "center"
      })
      .moveDown(1);

    // Table setup
    const tableTop = 180;
    const rowHeight = 28;
    const columns = [
      { name: "Contributor", x: 50, width: 100 },
      { name: "Role", x: 160, width: 70 },
      { name: "Amount", x: 240, width: 60 },
      { name: "Penalty", x: 310, width: 60 },
      { name: "Total Paid", x: 380, width: 80 },
      { name: "Date", x: 470, width: 90 },
      { name: "Status", x: 570, width: 70 }
    ];

    // Table header with dark green background
    doc.rect(50, tableTop - 10, doc.page.width - 100, rowHeight + 10)
      .fill(darkGreen);

    doc.fillColor(white).fontSize(12).font("Helvetica-Bold");
    columns.forEach(col => {
      doc.text(col.name, col.x, tableTop, {
        width: col.width,
        align: "center"
      });
    });

    // Table rows with alternating colors
    let y = tableTop + rowHeight;
    collections.forEach((col, i) => {
      const isEven = i % 2 === 0;
      doc.fillColor(isEven ? white : "#e8f5e9") // Light green tint for odd rows
        .rect(50, y - 5, doc.page.width - 100, rowHeight)
        .fill();

      doc.fillColor(darkText).font("Helvetica").fontSize(10);

      const totalPaid = (col.amount || 0) + (col.penalty || 0);
      const datePaid = col.datePaid ? moment(col.datePaid).format("MM/DD/YYYY") : "N/A";

      const rowData = [
        { text: col.memberId?.name || "Unknown", x: 50, width: 100 },
        { text: col.memberId?.role || "Member", x: 160, width: 70 },
        { text: `₹${(col.amount || 0).toLocaleString()}`, x: 240, width: 60 },
        { text: `₹${(col.penalty || 0).toLocaleString()}`, x: 310, width: 60 },
        { text: `₹${totalPaid.toLocaleString()}`, x: 380, width: 80 },
        { text: datePaid, x: 470, width: 90 },
        { text: col.status, x: 570, width: 70 }
      ];

      rowData.forEach(cell => {
        doc.text(cell.text, cell.x, y, {
          width: cell.width,
          align: "center"
        });
      });

      y += rowHeight;
    });

    // Summary section
    y += 20;
    doc.moveTo(50, y).lineTo(doc.page.width - 50, y)
      .lineWidth(2)
      .stroke(mediumGreen);

    y += 15;
    doc.font("Helvetica-Bold").fontSize(12)
      .fillColor(darkGreen)
      .text(`Total Group Savings: ₹${totalSavings.toLocaleString()}`, 50, y)
      .text(`Total Collections: ₹${totalCollections.toLocaleString()}`,
        doc.page.width - 250, y, {
        width: 200,
        align: "right"
      });

    // Footer with accent yellow
    const footerY = doc.page.height - 50;
    doc.fillColor(accentYellow)
      .rect(0, footerY, doc.page.width, 50)
      .fill();

    doc.fillColor(darkGreen).fontSize(10).font("Helvetica")
      .text(`Generated by E-BachatGat System | ${moment().format("YYYY-MM-DD HH:mm:ss")}`,
        50, footerY + 20, {
        width: doc.page.width - 100,
        align: "center"
      });

    doc.end();

  } catch (err) {
    console.error("❌ PDF Generation Error:", err);
    res.status(500).send("Server Error generating PDF");
  }
});

router.get("/getprofile", ensureTreasurer, async (req, res) => {
  try {
    const treasurerId = req.memberId;

    const treasurer = await Member.findById(treasurerId);
    if (!treasurer) return res.status(404).json({ error: "Treasurer not found" });

    const settings = await Setting.findOne();
    if (!settings) return res.status(400).json({ error: "Settings not configured" });

    const dueDate = settings.dueDate || 10;
    const monthlyAmount = settings.monthlyContributionAmount || 100;
    const penaltyAmount = settings.penaltyAmount || 0;

    const today = moment();
    const currentYear = today.year();
    const currentMonth = today.month() + 1;

    const personalCollections = await Collection.find({ memberId: treasurerId });

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

    // ✅ Use treasurer.createdAt instead of fixed 12 months
    const startDate = moment(treasurer.createdAt);
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
      treasurer: {
        ...treasurer._doc,
        image: treasurer.image || null,
      },
      collections: formattedCollections,
      totalCollected: totalPaid.toFixed(2),
      totalPending: totalPending.toFixed(2),
      unpaidCount,
      unpaidMonths,
    });
  } catch (error) {
    console.error("❌ Error loading Treasurer Profile:", error);
    res.status(500).json({ error: "Server Error" });
  }
});

router.post(
  "/update-profile",
  ensureTreasurer,
  upload.single("profilePhoto"),
  async (req, res) => {
    try {
      const memberId = req.memberId;
      const { name, email, password, address, contact } = req.body;

      console.log("📥 Incoming form data:", req.body);
      console.log("🧑 Member ID from token:", memberId);

      const updateData = { name, email, address, contact };

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateData.password = hashedPassword;
        console.log("🔐 Password was updated and hashed");
      }

      if (req.file) {
        console.log("🖼️ Uploaded file (from Cloudinary):", req.file);
        updateData.image = req.file.path; // ✅ Save Cloudinary URL
      } else {
        console.log("⚠️ No new profile photo uploaded");
      }

      console.log("📤 Final updateData to be saved:", updateData);

      await Member.findByIdAndUpdate(memberId, updateData);

      console.log("✅ Profile updated in MongoDB");

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully!",
      });
    } catch (error) {
      console.error("❌ Update profile error:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the profile.",
      });
    }
  }
);

router.get('/logout', ensureTreasurer, (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "Lax", // or "Strict"/"None" depending on your setup
    secure: process.env.NODE_ENV === "production" // use secure in production
  });

  return res.status(200).json({ message: "Logout successful" });
});

router.post("/api/collect-loan-repayment", ensureTreasurer, async (req, res) => {
  try {
    const { memberId, loanId, loanRepayment } = req.body;

    if (!memberId || !loanId || !loanRepayment) {
      return res.status(400).json({ success: false, message: "All fields are required!" });
    }

    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ success: false, message: "Loan not found!" });
    }

    if (loan.remainingBalance <= 0) {
      return res.status(400).json({ success: false, message: "Loan is already fully repaid!" });
    }

    // ✅ Apply penalty before repayment (assuming applyPenalty is a method in your schema)
    if (typeof loan.applyPenalty === "function") {
      await loan.applyPenalty();
    }

    let repaymentAmount = parseFloat(loanRepayment);
    let installmentUpdated = false;

    for (let installment of loan.repaymentSchedule) {
      if (installment.status === "Pending" || installment.status === "Late") {
        const totalDue = installment.amountDue + installment.penalty;

        if (repaymentAmount >= totalDue) {
          repaymentAmount -= totalDue;
          installment.amountPaid = totalDue;
          installment.status = "Paid";
        } else {
          installment.amountPaid += repaymentAmount;
          repaymentAmount = 0;
        }

        installmentUpdated = true;
        if (repaymentAmount === 0) break;
      }
    }

    if (!installmentUpdated) {
      return res.status(400).json({ success: false, message: "No pending installments found!" });
    }

    loan.totalPaid += parseFloat(loanRepayment);
    loan.remainingBalance -= parseFloat(loanRepayment);
    if (loan.remainingBalance < 0) loan.remainingBalance = 0;
    if (loan.remainingBalance === 0) loan.status = "Repaid";

    await loan.save();

    // ✅ Update group savings
    await Setting.updateOne({}, { $inc: { groupSavings: parseFloat(loanRepayment) } });

    return res.status(200).json({
      success: true,
      message: `Loan repayment of ₹${loanRepayment} collected successfully and added to group savings.`,
      updatedLoan: loan,
    });

  } catch (error) {
    console.error("❌ Error collecting loan repayment:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;