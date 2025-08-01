const express = require("express");
const router = express.Router();
const razorpay = require("../utils/razorpayInstance");
const Collection = require("../models/Collection");
const Member = require("../models/Member");
const Setting = require("../models/Settings");
const { ensureAuthenticated } = require("../middlewares/auth");
const updateGroupSavings = require("../models/Collection").updateGroupSavings;
const Loan = require('../models/Loan')


router.post("/create-order", ensureAuthenticated, async (req, res) => {
  const { amount } = req.body;
  const memberId = req.memberId; // From auth middleware

  if (!amount) {
    return res.status(400).json({ error: "Amount is required." });
  }

  try {
    const memberExists = await Member.findById(memberId);
    if (!memberExists) {
      return res.status(404).json({ error: "Member not found." });
    }

    const paymentAmount = amount * 100; // Convert to paisa

    const order = await razorpay.orders.create({
      amount: paymentAmount,
      currency: "INR",
      receipt: `m${memberId}_${Date.now().toString().slice(-6)}`,
      payment_capture: 1,
    });

    console.log(`✅ Razorpay order created for member ${memberId}:`, order.id);

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("❌ Error creating Razorpay order:", err);
    return res.status(500).json({ error: "Failed to create Razorpay order." });
  }
});


router.post("/verify-payment", ensureAuthenticated, async (req, res) => {
  const {
    amount,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  const memberId = req.memberId;

  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  try {
    const setting = await Setting.findOne();
    if (!setting) return res.status(400).json({ error: "Settings not found!" });

    const contributionAmount = setting.monthlyContributionAmount;
    let penalty = amount - contributionAmount;
    if (penalty < 0) penalty = 0;

    const newPayment = new Collection({
      memberId,
      amount: contributionAmount,
      penalty,
      month,
      year,
      status: penalty > 0 ? "Late" : "Paid",
      datePaid: today,
      mode: "Online",
      orderId: razorpay_order_id,
    });

    await newPayment.save();

    await Member.findByIdAndUpdate(memberId, {
      $inc: { totalSavings: contributionAmount },
    });

    await updateGroupSavings();

    console.log(`✅ Payment recorded for member ${memberId}`);

    res.status(200).json({
      success: true,
      message: `Payment recorded. ${penalty > 0 ? `Penalty ₹${penalty} applied.` : "No penalty."}`,
    });
  } catch (err) {
    console.error("❌ Error verifying payment:", err);
    res.status(500).json({ error: "Payment verification failed." });
  }
});



router.post("/create-loan-order", ensureAuthenticated, async (req, res) => {

  const { loanId, installmentIndex } = req.body;
  console.log("🧾 Received loan order creation request with body:", req.body);

  const memberId = req.memberId; // From your auth middleware

  if (!loanId || installmentIndex === undefined) {
    return res.status(400).json({ error: "Loan ID and installment index are required." });
  }

  try {
    const loan = await Loan.findOne({ _id: loanId, memberId });

    if (!loan) {
      return res.status(404).json({ error: "Loan not found." });
    }

    const installment = loan.repaymentSchedule[installmentIndex];

    if (!installment) {
      return res.status(400).json({ error: "Invalid installment index." });
    }

    if (installment.status === "Paid") {
      return res.status(400).json({ error: "This installment is already paid." });
    }

    const paymentAmount = (installment.amountDue + installment.penalty) * 100; // In paisa

    const order = await razorpay.orders.create({
      amount: paymentAmount,
      currency: "INR",
      receipt: `loan_${loanId}_${installmentIndex}_${Date.now().toString().slice(-6)}`,
      payment_capture: 1,
    });

    console.log(`✅ Razorpay loan order created for member ${memberId}:`, order.id);

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("❌ Error creating Razorpay loan order:", err);
    return res.status(500).json({ error: "Failed to create loan repayment order." });
  }
});

router.post("/verify-loan-order", ensureAuthenticated, async (req, res) => {
  try {
    const {
      loanId,
      installmentIndex,
      razorpay_order_id,
      razorpay_payment_id,
      mode,
    } = req.body;

    // 1. Find loan
    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({ success: false, message: "Loan not found." });
    }

    // 2. Validate installment index
    if (
      !loan.repaymentSchedule ||
      installmentIndex < 0 ||
      installmentIndex >= loan.repaymentSchedule.length
    ) {
      return res.status(400).json({ success: false, message: "Invalid installment index." });
    }

    const installment = loan.repaymentSchedule[installmentIndex];

    // 3. If already paid, avoid duplicate payment
    if (installment.status === "Paid") {
      return res.status(400).json({ success: false, message: "Installment already paid." });
    }

    // 4. Update repayment schedule
    installment.amountPaid = installment.amountDue;
    installment.status = "Paid";
    installment.mode = mode;
    installment.orderId = razorpay_order_id || null;
    installment.datePaid = new Date();

    // 5. Update totals
    loan.totalPaid += installment.amountDue;
    loan.remainingBalance = loan.amount + (loan.amount * loan.interestRate / 100) - loan.totalPaid;

    // 6. If all installments are paid, mark loan as Repaid
    const allPaid = loan.repaymentSchedule.every(inst => inst.status === "Paid");
    if (allPaid) {
      loan.status = "Repaid";
    }

    await loan.save();

    res.json({ success: true, message: "Installment payment recorded successfully." });

  } catch (error) {
    console.error("Error in /verify-loan-order:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});




module.exports = router;