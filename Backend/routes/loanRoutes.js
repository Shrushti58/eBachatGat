const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');
const Member=require("../models/Member")
const Collection = require("../models/Collection");
const Setting=require('../models/Settings')
const bcrypt=require("bcrypt")
const treasurer=require('../models/Treasurer')
const {generateToken}=require("../utils/generateToken");
const { ensureTreasurer, ensurePresident, ensureSecretary, ensureMember } = require("../middlewares/auth");
const moment = require("moment");
const { getTotalSavings } = require("../utils/financeUtils");
const { upload } = require("../utils/cloudinary");


router.get("/api/request-loan", ensureMember, async (req, res) => {
  try {
    const member = await Member.findById(req.memberId);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const totalSavings = await getTotalSavings(member._id);
    const settings = await Setting.findOne();
    const adminInterestRate = settings?.loanInterestRate || 0;

    let eligible = true;
    const reasons = [];

    // ✅ 1. Check first contribution date
    const firstContribution = await Collection.findOne({ memberId: member._id }).sort({ datePaid: 1 });

    if (!firstContribution) {
      eligible = false;
      reasons.push("You must have at least 3 months of contributions.");
    } else {
      const threeMonthsAgo = moment().subtract(3, "months");
      const firstDate = moment(firstContribution.datePaid);
      if (firstDate.isAfter(threeMonthsAgo)) {
        eligible = false;
        reasons.push("You must have contributed for at least 3 months.");
      }
    }

    // ✅ 2. Check for any late contributions in past 3 months
    const lateContributions = await Collection.find({
      memberId: member._id,
      status: "Late",
    });

    const hasRecentLate = lateContributions.some((entry) => {
      const paidMonth = moment(`${entry.year}-${entry.month}-01`, "YYYY-MM-DD");
      return paidMonth.isSameOrAfter(moment().subtract(3, "months").startOf("month"));
    });

    if (hasRecentLate) {
      eligible = false;
      reasons.push("No late contributions allowed in the past 3 months.");
    }

    // ✅ 3. Minimum savings check
    if (totalSavings < 400) {
      eligible = false;
      reasons.push("Minimum savings of ₹400 is required.");
    }

    // ✅ 4. Check for active loan
    const activeLoan = await Loan.exists({
      memberId: member._id,
      status: "Approved",
      remainingBalance: { $gt: 0 },
    });

    if (activeLoan) {
      eligible = false;
      reasons.push("You already have an active loan.");
    }

    // ✅ Final response
    res.json({
      member,
      totalSavings,
      adminInterestRate,
      eligible,
      reasons,
    });
  } catch (error) {
    console.error("❌ Loan eligibility error:", error);
    res.status(500).json({ message: "Server error" });
  }
});



router.post("/api/loan-request",upload.fields([{ name: "guarantorDoc1", maxCount: 1 },{ name: "guarantorDoc2", maxCount: 1 },]),async (req, res) => {
    try {
      const { memberId, amount, interestRate, tenure, reason } = req.body;

      const member = await Member.findById(memberId);
      if (!member) return res.status(404).json({ error: "Member not found" });

      // 1️⃣ Minimum membership duration: 3 months (based on first contribution)
      const firstPayment = await Collection.findOne({ memberId }).sort({ datePaid: 1 });
      if (!firstPayment) {
        return res.status(400).json({ error: "You must have at least one contribution to request a loan." });
      }
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      if (firstPayment.datePaid > threeMonthsAgo) {
        return res.status(400).json({ error: "You must be a member for at least 3 months to apply for a loan." });
      }

      // 2️⃣ No "Late" contributions in the past 3 months
      const lateCollections = await Collection.find({
        memberId,
        status: "Late",
        datePaid: { $gte: threeMonthsAgo },
      });
      if (lateCollections.length > 0) {
        return res.status(400).json({ error: "No late contributions allowed in the past 3 months." });
      }

      // 3️⃣ No active loans
      const activeLoan = await Loan.findOne({
        memberId,
        status: { $in: ["Approved", "Pending"] },
      });
      if (activeLoan) {
        return res.status(400).json({ error: "You already have an active or pending loan." });
      }

      // 4️⃣ Calculate total savings
      const totalSavings = await getTotalSavings(memberId);
      if (totalSavings < 400) {
        return res.status(400).json({ error: "Minimum savings of ₹400 required to request a loan." });
      }

      // 5️⃣ Validate loan amount against 3x total savings
      const maxLoan = totalSavings * 3;
      if (amount > maxLoan) {
        return res.status(400).json({ error: `Loan request exceeds the allowed limit of ₹${maxLoan}.` });
      }

      // ✅ Upload guarantor docs to Cloudinary
      const guarantorDocs = [];
      if (req.files["guarantorDoc1"]) {
        guarantorDocs.push({
          url: req.files["guarantorDoc1"][0].path,
          public_id: req.files["guarantorDoc1"][0].filename,
        });
      }
      if (req.files["guarantorDoc2"]) {
        guarantorDocs.push({
          url: req.files["guarantorDoc2"][0].path,
          public_id: req.files["guarantorDoc2"][0].filename,
        });
      }

      // ✅ Create new Loan entry
      const newLoan = new Loan({
        memberId,
        amount,
        interestRate,
        tenure,
        reason,
        status: "Pending",
        requestedAt: new Date(),
        guarantorDocs,
      });

      await newLoan.save();

      return res.status(200).json({
        message: "Loan request submitted successfully.",
        loan: newLoan,
      });
    } catch (error) {
      console.error("❌ Loan request error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);



module.exports = router;

